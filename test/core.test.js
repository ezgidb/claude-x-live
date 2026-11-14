import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQuery, parsePostUrl, normalize } from '../src/xapi.js';
import { tokenize, momentum } from '../src/analytics.js';
import { createApp } from '../src/server.js';

test('sorgu kurucu: kelime, ifade, etiket, hesap, hariç tutma', () => {
  const q = buildQuery({ any: ['asgari ücret', '#zam'], all: ['meclis'], accounts: ['@ornek'], accountMode: 'both', exclude: ['reklam', '@spam'], lang: 'tr' });
  assert.equal(q.countsQuery, '("asgari ücret" OR #zam) meclis (from:ornek OR to:ornek OR @ornek) -reklam -from:spam lang:tr');
  assert.equal(q.query, q.countsQuery + ' -is:retweet');
  assert.throws(() => buildQuery({ any: [] }), /En az bir/);
  assert.throws(() => buildQuery({ any: Array.from({ length: 30 }, (_, i) => 'çokuzunbirkelime' + i.toString().padStart(8, '0')) }), /çok uzun/);
});

test('gönderi adresi ve yedek sorgu biçimleri', () => {
  assert.equal(parsePostUrl('https://x.com/biri/status/1234567890123?s=20'), '1234567890123');
  assert.equal(parsePostUrl('https://twitter.com/biri/status/99999999999'), '99999999999');
  assert.equal(parsePostUrl('merhaba'), null);
  assert.match(buildQuery({ postId: '5', conversationId: '4' }, 0).query, /conversation_id:4 OR quotes_of_tweet_id:5/);
  assert.match(buildQuery({ postId: '5', conversationId: '4' }, 2).query, /^conversation_id:4 /);
});

test('X yanıtı dönüştürme: alıntı, yeniden paylaşım, uzun metin', () => {
  const n = normalize({
    data: [
      { id: '10', author_id: '1', created_at: '2026-11-14T10:00:00.000Z', text: 'kısa…', note_tweet: { text: 'uzun metin' }, lang: 'tr',
        public_metrics: { like_count: 5, retweet_count: 2, reply_count: 1, quote_count: 0 }, entities: { hashtags: [{ tag: 'Zam' }], mentions: [{ username: 'b' }], urls: [{ expanded_url: 'https://ornek.com/a' }, { expanded_url: 'https://x.com/a/status/1/photo/1', media_key: '3_1' }] } },
      { id: '11', author_id: '2', created_at: '2026-11-14T10:01:00.000Z', text: 'RT @a: kısa…', referenced_tweets: [{ type: 'retweeted', id: '10' }] },
      { id: '12', author_id: '2', created_at: '2026-11-14T10:02:00.000Z', text: 'yanıt', in_reply_to_user_id: '1', referenced_tweets: [{ type: 'replied_to', id: '99' }] },
    ],
    includes: { users: [{ id: '1', username: 'a', name: 'A', public_metrics: { followers_count: 100 } }, { id: '2', username: 'b', name: 'B' }], tweets: [{ id: '10', author_id: '1', text: 'kısa…', note_tweet: { text: 'uzun metin' } }] },
    meta: { newest_id: '12' },
  });
  assert.equal(n.posts[0].text, 'uzun metin');
  assert.deepEqual(n.posts[0].urls, ['https://ornek.com/a']);
  assert.equal(n.posts[0].has_media, true);
  assert.equal(n.posts[1].kind, 'repost'); assert.equal(n.posts[1].ref_author_id, '1'); assert.equal(n.posts[1].text, 'RT @a: uzun metin');
  assert.equal(n.posts[2].kind, 'reply'); assert.equal(n.posts[2].ref_author_id, '1');
  assert.equal(n.users[0].followers, 100);
});

test('Türkçe sözcük ayırma: ek kesme, İ/ı, durak sözcükler', () => {
  const keys = tokenize({ text: "İstanbul'da ve Türkiye'nin IŞIK https://t.co/x @biri", hashtags: ['Seçim'] }).map((t) => t.key);
  assert.ok(keys.includes('istanb')); assert.ok(keys.includes('turkiy')); assert.ok(keys.includes('isik')); assert.ok(keys.includes('#secim'));
  assert.ok(!keys.includes('ve'));
});

test('ivme: düz seri sessiz, ani artış hızlanma verir', () => {
  const now = Date.UTC(2026, 10, 14, 12, 0, 0); const MIN = 60000; const HOUR = 3600000;
  const hours = []; for (let t = now - 7 * 24 * HOUR; t < now; t += HOUR) hours.push({ ts: t, n: 60 });
  const flat = []; for (let t = now - 6 * HOUR; t < now; t += MIN) flat.push({ ts: t, n: 1 });
  assert.equal(momentum(flat, hours, now).stage, 'quiet');
  const burst = flat.map((c) => ({ ts: c.ts, n: c.ts >= now - 40 * MIN ? Math.round(2 + (c.ts - (now - 40 * MIN)) / MIN / 3) : 1 }));
  const m = momentum(burst, hours, now);
  assert.ok(['emerging', 'accelerating'].includes(m.stage), m.stage); assert.ok(m.score > 60, String(m.score));
});

test('uçtan uca (demo veri): izleme oluştur, analiz ve not üret', async () => {
  const app = createApp({ dbFile: ':memory:' });
  await new Promise((r) => app.server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${app.server.address().port}`;
  const call = async (method, path, body) => (await fetch(base + path, { method, headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })).json();
  try {
    await call('POST', '/api/demo', { on: true });
    const pv = await call('POST', '/api/preview', { spec: { any: ['deneme'], lang: 'tr' } });
    assert.ok(pv.total7d > 1000);
    const { id } = await call('POST', '/api/watches', { spec: { any: ['deneme'], lang: 'tr' }, backfill_posts: 300 });
    for (let i = 0; i < 100; i++) { const s = await call('GET', '/api/state'); if (s.watches[0]?.backfill_done && !s.watches[0].running) break; await new Promise((r) => setTimeout(r, 100)); }
    const d = await call('GET', `/api/watches/${id}/analysis?range=24h`);
    assert.equal(d.watch.last_error, null);
    assert.ok(d.analysis.sample.n >= 250); assert.ok(d.analysis.series.length > 50); assert.ok(d.analysis.cards.length > 0);
    assert.ok(d.analysis.accounts.influencers.length > 0);
    await call('POST', `/api/watches/${id}/pins`, { kind: 'note', note: 'kendi notum' });
    const b = await call('GET', `/api/watches/${id}/brief?range=24h`);
    assert.match(b.text, /DANIŞMANLIK NOTU/); assert.match(b.text, /kendi notum/);
    const bad = await fetch(base + '/api/watches', { method: 'POST', body: '{}' });
    assert.equal(bad.status, 415);
  } finally { app.close(); }
});
