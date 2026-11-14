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

test('gözlem günlüğü: açılış notu, doğrulanmış aşama değişimi, tekrar etmeme, gönderi tırmanışı', async () => {
  const { observe } = await import('../src/journal.js');
  const now = Date.UTC(2026, 10, 14, 12, 0, 0); const MINUTE = 60000;
  const snap = (stage, over = {}) => ({
    momentum: { stage, stageLabel: stage, score: 50, velocity: over.v ?? 2, ratio: over.R ?? 1.6, z: 4, last30: 120, prev30: 60, baseline30: 20, burst: stage === 'quiet' ? null : { start: now - 30 * MINUTE, peakVelocity: 6, active: true }, projection: { low: 100, high: 200 }, why: 'neden' },
    kpi: { total: 2000, perHour: over.perHour ?? 200 }, sample: { n: 300, confidence: 'Orta' },
    terms: { terms: over.terms ?? [] }, accounts: { influencers: over.infl ?? [], inorganicShare: 0 },
    content: { topPosts: over.top ?? [], reaction: { nNow: 0, alarmNow: 0, alarmBefore: 0 } },
  });
  const none = new Map();
  let r = observe(null, snap('quiet'), none, { hourMax7d: 500 }, now);
  assert.deepEqual(r.events.map((e) => e.type), ['watch_started']);
  r = observe(r.state, snap('accelerating'), none, { hourMax7d: 500 }, now + 5 * MINUTE);
  assert.equal(r.events.length, 0, 'tek ölçümle aşama notu yazılmaz');
  r = observe(r.state, snap('accelerating'), none, { hourMax7d: 500 }, now + 10 * MINUTE);
  assert.deepEqual(r.events.map((e) => [e.type, e.level]), [['started', 1]]);
  r = observe(r.state, snap('accelerating'), none, { hourMax7d: 500 }, now + 15 * MINUTE);
  assert.equal(r.events.length, 0, 'aynı durum yeniden not edilmez');
  const term = { key: 'kampan', term: 'kampanya', rising: true, zeta: 4.2, y1: 20, y0: 2, lift: 5, hashtag: false, isNew: false };
  const top = [{ id: '7', username: 'biri', engagement: 100, created_at: now, text: 'metin' }];
  r = observe(r.state, snap('accelerating', { terms: [term], top, v: 3.5 }), none, { hourMax7d: 500 }, now + 20 * MINUTE);
  assert.ok(r.events.some((e) => e.type === 'term' && e.level === 1)); assert.ok(r.events.some((e) => e.type === 'speed'));
  assert.ok(r.state.watch['7']);
  const posts = new Map([['7', { id: '7', username: 'biri', text: 'metin', likes: 400, reposts: 50, quotes: 0, replies: 0 }]]);
  r = observe(r.state, snap('accelerating', { terms: [term], top, v: 3.5 }), posts, { hourMax7d: 500 }, now + 35 * MINUTE);
  const climb = r.events.find((e) => e.type === 'post_climbing');
  assert.ok(climb); assert.match(climb.text, /100 → 500/); assert.equal(climb.level, 1);
  assert.ok(!r.events.some((e) => e.type === 'term'), 'aynı alt başlık 12 saat içinde yeniden yazılmaz');
});

test('üç aşama (demo veri): tarama listesi, inceleme planı, onay, geçmişe dönük günlük', async () => {
  const app = createApp({ dbFile: ':memory:' });
  await new Promise((r) => app.server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${app.server.address().port}`;
  const call = async (method, path, body) => (await fetch(base + path, { method, headers: { 'content-type': 'application/json' }, body: method === 'GET' ? undefined : JSON.stringify(body ?? {}) })).json();
  try {
    await call('POST', '/api/demo', { on: true });
    const { id: listId } = await call('POST', '/api/lists', { name: 'Deneme', items: ['sarı torba', '@hesap', 'sarı torba'] });
    const scanned = await call('POST', `/api/lists/${listId}/scan`, { wait: true });
    const items = scanned.lists[0].items;
    assert.equal(items.length, 2, 'yinelenen öğe tekilleştirilir');
    assert.ok(items.every((i) => i.result && i.result.spark.length > 10 && i.result.burstActive));
    assert.equal(app.store.countPosts(-items[0].id), 0, 'tarama gönderi okumaz');

    const inv = await call('POST', '/api/investigations', { spec: { any: ['sarı torba'], lang: 'tr' }, hours: 3 });
    const plan = inv.watch.investigation.plan;
    assert.equal(inv.watch.investigation.status, 'planned');
    assert.equal(app.store.countPosts(inv.id), 0, 'plan aşamasında gönderi okunmaz');
    const onset = plan.segments.find((s) => s.key === 'onset');
    assert.ok(plan.wave && onset && onset.take === 'full', 'başlangıç evresi eksiksiz okunur');
    assert.equal(plan.segments.reduce((n, s) => n + s.count, 0), plan.total, 'evreler dönemi boşluksuz kaplar');

    await call('POST', `/api/investigations/${inv.id}/approve`, {});
    let w;
    for (let i = 0; i < 100; i++) { w = (await call('GET', '/api/state')).watches.find((x) => x.id === inv.id); if (w.investigation.status === 'done' && !w.running) break; await new Promise((r) => setTimeout(r, 100)); }
    assert.equal(w.last_error, null); assert.equal(w.status, 'paused', 'inceleme bitince canlı izleme kendiliğinden başlamaz');
    const lo = onset.from; const hi = onset.to;
    const got = app.store.getPosts(inv.id).filter((p) => p.created_at >= lo && p.created_at < hi).length;
    assert.ok(got >= onset.count * 0.95, `başlangıç evresi: ${got}/${onset.count}`);
    const d = await call('GET', `/api/watches/${inv.id}/analysis?range=6h`);
    const types = d.journal.map((j) => j.type);
    assert.ok(types.includes('retro_start') && types.includes('retro_first') && types.includes('retro_done'));
    assert.ok(plan.important && plan.important.count > 0, 'yüksek etkileşim süzgeci planlanır');
    assert.ok(w.investigation.threads.length > 0 && types.includes('retro_thread'), 'yanıt zincirleri okunur ve not edilir');
    assert.ok(d.analysis.sample.n < app.store.countPosts(inv.id), 'yanıtlar kelime analizine karışmaz');
  } finally { app.close(); }
});
