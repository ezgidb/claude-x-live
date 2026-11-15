// VERİ testleri: depo, simülatör, kaynak ayrıştırıcıları. Gerçek ağ çağrısı yapılmaz.
import test from 'node:test';
import assert from 'node:assert/strict';
import { openStore } from '../src/store.js';
import { createSources, demoClients } from '../src/sources/index.js';
import { createSimulator } from '../src/sources/simulator.js';
import { parseXResponse, buildXQuery, createXSource } from '../src/sources/x.js';
import { parseRss, buildNewsUrl, createHaberSource } from '../src/sources/haber.js';
import { parseBlueskyResponse, createBlueskySource } from '../src/sources/bluesky.js';

const H = 3_600_000;
const ANCHOR = Date.UTC(2026, 0, 12, 9, 0, 0);
const item = (id, o = {}) => ({ id, source: 'x', url: 'u', text: `metin ${id}`, lang: 'tr', createdAt: 1000,
  author: { id: 'x:u1', handle: 'a', name: 'A', followers: 10, verified: false, createdAt: 1, kind: 'kişi' },
  metrics: { likes: 0, reposts: 0, replies: 0, quotes: 0, views: 0 }, refs: { replyTo: null, quoteOf: null, repostOf: null },
  media: false, clientId: 'c1', enr: null, ...o });

test('depo: danışan, gönderi, zenginleştirme gidiş-dönüş', () => {
  const s = openStore(':memory:');
  const [c] = demoClients();
  s.upsertClient(c);
  s.upsertClient({ ...c, note: 'değişti' });
  assert.equal(s.listClients().length, 1);
  assert.equal(s.getClient(c.id).note, 'değişti');

  const a = item('x:1', { createdAt: 1000, metrics: { likes: 5, reposts: 0, replies: 0, quotes: 0, views: 9 } });
  const b = item('x:2', { createdAt: 2000, author: { ...item('z').author, id: 'x:u2' }, metrics: { likes: 1, reposts: 10, replies: 1, quotes: 1, views: 0 } });
  const d = item('x:3', { createdAt: 3000, metrics: { likes: 20, reposts: 0, replies: 0, quotes: 0, views: 0 } });
  assert.equal(s.upsertItems([a, b, d]), 3);
  assert.equal(s.upsertItems([{ ...a, metrics: { ...a.metrics, likes: 500 } }, item('x:9', { clientId: 'baska' })]), 1);

  assert.deepEqual(s.items('c1').map((i) => i.id), ['x:3', 'x:2', 'x:1']); // yeni → eski
  assert.deepEqual(s.items('c1', { order: 'top' }).map((i) => i.id), ['x:1', 'x:2', 'x:3']); // 500, 1+20+1+1, 20
  assert.equal(s.items('c1', { ids: ['x:1'] })[0].metrics.likes, 500);
  assert.deepEqual(s.items('c1', { since: 2000, until: 3000 }).map((i) => i.id), ['x:2']);
  assert.deepEqual(s.items('c1', { authorId: 'x:u2' }).map((i) => i.id), ['x:2']);
  assert.equal(s.items('c1', { limit: 2 }).length, 2);
  assert.deepEqual(s.items('c1')[0], { ...d, enr: null });

  assert.equal(s.unenriched('c1', 10).length, 3);
  const enr = { stance: 'elestiri', emotion: 'öfke', narrative: 'Üründe yabancı madde iddiası', claim: true, callToAction: false, by: 'yerel' };
  s.setEnrichments([{ id: 'x:2', ...enr }]);
  assert.deepEqual(s.items('c1', { ids: ['x:2'] })[0].enr, enr);
  assert.deepEqual(s.items('c1', { narrative: enr.narrative }).map((i) => i.id), ['x:2']);
  assert.equal(s.unenriched('c1', 10).length, 2);
  s.upsertItems([{ ...b, metrics: { ...b.metrics, likes: 7 } }]); // metrik güncellemesi zenginleştirmeyi silmez
  assert.equal(s.items('c1', { ids: ['x:2'] })[0].enr.stance, 'elestiri');
  s.close();
});

test('depo: anlık görüntü, olay, ayar, sıfırlama', () => {
  const s = openStore(':memory:');
  s.upsertClient({ id: 'c1', name: 'C' });
  for (let i = 1; i <= 40; i++) s.saveSnapshot({ clientId: 'c1', at: i * 1000, pulse: { rate1h: i }, risk: { score: i * 2 } });
  assert.equal(s.latestSnapshot('c1').at, 40000);
  assert.equal(s.latestSnapshot('yok'), null);
  const hist = s.snapshotHistory('c1', { since: 39000 });
  assert.deepEqual(hist, [{ at: 39000, risk: 78, rate1h: 39 }, { at: 40000, risk: 80, rate1h: 40 }]);
  assert.equal(s.snapshotHistory('c1').length, 40);

  s.addEvents([{ id: 'e1', clientId: 'c1', at: 10, kind: 'zirve', level: 'bilgi', title: 'a' }, { id: 'e2', clientId: 'c1', at: 20, kind: 'zirve', level: 'alarm', title: 'b' },
    { id: 'e3', clientId: 'c2', at: 30, kind: 'zirve', level: 'bilgi', title: 'c' }]);
  assert.deepEqual(s.events('c1').map((e) => e.id), ['e2', 'e1']);
  assert.deepEqual(s.events(null, { limit: 2 }).map((e) => e.id), ['e3', 'e2']);
  assert.deepEqual(s.events('c1', { since: 15 }).map((e) => e.id), ['e2']);

  assert.equal(s.get('yok'), undefined);
  s.set('ayar', { a: [1, 2] });
  assert.deepEqual(s.get('ayar'), { a: [1, 2] });
  s.upsertItems([item('x:1')]);
  s.reset();
  assert.equal(s.items('c1').length, 0);
  assert.equal(s.events(null).length, 0);
  assert.equal(s.latestSnapshot('c1'), null);
  assert.equal(s.listClients().length, 1);
  assert.deepEqual(s.get('ayar'), { a: [1, 2] });
  s.removeClient('c1');
  assert.equal(s.listClients().length, 0);
  s.close();
});

test('simülatör: deterministik ve sözleşmeye uygun gönderiler', async () => {
  const [c] = demoClients();
  assert.equal(demoClients().length, 3);
  const srcs = createSources({ mode: 'demo', anchor: ANCHOR });
  assert.equal(srcs.length, 1);
  assert.equal(srcs[0].id, 'sim');
  const q = { client: c, since: ANCHOR - 2 * H, until: ANCHOR + 3 * H };
  const a = await srcs[0].poll(q);
  const b = await createSimulator({ anchor: ANCHOR }).poll(q);
  assert.deepEqual(a, b);
  const other = await createSimulator({ anchor: ANCHOR, seed: 7 }).poll(q);
  assert.notDeepEqual(a.map((i) => i.text), other.map((i) => i.text));
  assert.equal(new Set(a.map((i) => i.id)).size, a.length);
  for (const i of a) {
    assert.match(i.id, /^(x|haber|bluesky):/);
    assert.ok(['x', 'haber', 'bluesky'].includes(i.source));
    assert.equal(i.clientId, c.id);
    assert.equal(i.enr, null);
    assert.ok(i.text.length > 0 && i.author.handle && Number.isFinite(i.author.createdAt));
    assert.ok(['kişi', 'medya', 'kurum', 'bilinmiyor'].includes(i.author.kind));
    for (const k of ['likes', 'reposts', 'replies', 'quotes', 'views']) assert.ok(Number.isInteger(i.metrics[k]) && i.metrics[k] >= 0);
    assert.ok('replyTo' in i.refs && 'quoteOf' in i.refs && 'repostOf' in i.refs);
  }
});

test('simülatör: kriz öncesi sakin, zirvede yüksek hacim; kaynak ve bağ çeşitliliği', async () => {
  const [c] = demoClients();
  const sim = createSimulator({ anchor: ANCHOR });
  const all = await sim.poll({ client: c, since: ANCHOR - 30 * H, until: ANCHOR + 10 * H });
  const fresh = all.filter((i) => i.createdAt >= ANCHOR - 24 * H);
  const perHour = (h) => fresh.filter((i) => i.createdAt >= ANCHOR + h * H && i.createdAt < ANCHOR + (h + 1) * H).length;
  for (let h = -24; h < 0; h++) assert.ok(perHour(h) >= 8 && perHour(h) <= 45, `sakin saat ${h}: ${perHour(h)}`);
  const peak = Math.max(perHour(5), perHour(6));
  assert.ok(peak >= 600 && peak <= 1000, `zirve ${peak}`);
  assert.ok(perHour(9) < peak * 0.75, 'zirveden sonra sönüş');
  assert.ok(fresh.length > 3000 && fresh.length < 9000);

  const count = (f) => fresh.filter(f).length;
  assert.ok(count((i) => i.source === 'haber') >= 5);
  assert.ok(count((i) => i.source === 'bluesky') >= 20);
  assert.ok(count((i) => i.refs.replyTo) > 300 && count((i) => i.refs.quoteOf) > 150 && count((i) => i.refs.repostOf) > 150);
  const ids = new Set(all.map((i) => i.id));
  for (const i of fresh) for (const r of Object.values(i.refs)) if (r) assert.ok(ids.has(r), 'bağ var olan gönderiye');
  const fol = fresh.filter((i) => i.source === 'x').map((i) => i.author.followers).sort((x, y) => x - y);
  assert.ok(fol[Math.floor(fol.length / 2)] < 1500, 'çoğu hesap küçük');
  assert.ok(fol[fol.length - 1] > 500_000, 'birkaç büyük hesap');
  // danışanın resmî hesabı kriz hakkında açıklama yapmaz
  assert.equal(count((i) => i.author.handle === 'anadolusut' && i.createdAt > ANCHOR + 2 * H), 0);
  // metinler çeşitli: yeniden paylaşım ve küme dışında tekrar oranı düşük
  const texts = fresh.filter((i) => !i.refs.repostOf && !/raflarda bırakıyoruz|Bakanlık göreve/.test(i.text)).map((i) => i.text);
  assert.ok(1 - new Set(texts).size / texts.length < 0.03);
  assert.ok(count((i) => /2019/.test(i.text) && i.createdAt < ANCHOR + 6.3 * H) === 0, 'karşı-anlatı sonradan gelir');
  assert.ok(count((i) => /2019/.test(i.text)) > 100);
});

test('simülatör: koordineli küme (yeni hesaplar, kopyaya yakın metin, dar pencere)', async () => {
  const [c] = demoClients();
  const items = await createSimulator({ anchor: ANCHOR }).poll({ client: c, since: ANCHOR + 5 * H, until: ANCHOR + 5.3 * H });
  const k = items.filter((i) => i.createdAt >= ANCHOR + 5 * H && /raflarda bırakıyoruz/.test(i.text) && !i.refs.repostOf);
  const accounts = new Set(k.map((i) => i.author.handle));
  assert.ok(accounts.size >= 20 && accounts.size <= 30, `küme hesap sayısı ${accounts.size}`);
  const ts = k.map((i) => i.createdAt);
  const firstWave = ts.filter((t) => t < Math.min(...ts) + 15 * 60_000).length;
  assert.ok(firstWave >= 20);
  for (const i of k) {
    assert.ok(ANCHOR - i.author.createdAt < 62 * 24 * H, 'hesap son iki ayda açılmış');
    assert.ok(i.author.followers < 100);
    assert.match(i.text, /#AnadoluSütBoykot/);
  }
  assert.ok(new Set(k.map((i) => i.text)).size > 3, 'birebir değil, kopyaya yakın');
});

test('simülatör: metrikler zamanla büyür, eski gönderilerin güncel hâli döner', async () => {
  const [c] = demoClients();
  const sim = createSimulator({ anchor: ANCHOR });
  const early = await sim.poll({ client: c, since: ANCHOR - H, until: ANCHOR + 20 * 60_000 });
  const origin = early.find((i) => i.author.handle === 'elifin_defteri');
  assert.ok(origin && origin.media);
  assert.ok(origin.metrics.likes < 200);
  const later = await sim.poll({ client: c, since: ANCHOR + 4 * H, until: ANCHOR + 4.5 * H });
  const again = later.find((i) => i.id === origin.id);
  assert.ok(again, 'eski gönderi güncellenmiş hâliyle geldi');
  assert.ok(again.metrics.likes > origin.metrics.likes * 20);
  assert.equal(again.createdAt, origin.createdAt);
  const olds = later.filter((i) => i.createdAt < ANCHOR + 4 * H);
  const news = later.filter((i) => i.createdAt >= ANCHOR + 4 * H);
  assert.ok(olds.length > 50 && news.length > 150);
  assert.ok(news.every((i) => i.createdAt < ANCHOR + 4.5 * H), 'gelecekten gönderi sızmaz');
  // depoya yazınca: var olan güncellenir, yeni sayılmaz
  const s = openStore(':memory:');
  s.upsertItems(early);
  assert.equal(s.upsertItems([again]), 0);
  assert.equal(s.items(c.id, { ids: [origin.id] })[0].metrics.likes, again.metrics.likes);
  s.close();
});

test('simülatör: diğer danışanlar sakin; Kuzey küçük dalga yapıp söner', async () => {
  const [, kuzey, selin] = demoClients();
  const sim = createSimulator({ anchor: ANCHOR });
  const k = await sim.poll({ client: kuzey, since: ANCHOR - 12 * H, until: ANCHOR + 10 * H });
  const ph = (list, h) => list.filter((i) => i.createdAt >= ANCHOR + h * H && i.createdAt < ANCHOR + (h + 1) * H).length;
  assert.ok(ph(k, 2) > 45 && ph(k, 2) < 150);
  assert.ok(ph(k, -3) < 25 && ph(k, 7) < 25);
  const s = await sim.poll({ client: selin, since: ANCHOR - 12 * H, until: ANCHOR + 10 * H });
  for (let h = -12; h < 10; h++) assert.ok(ph(s, h) < 40);
  const g = await sim.poll({ client: { id: 'yeni', name: 'Deneme Marka', terms: ['Deneme Marka'] }, since: ANCHOR - 5 * H, until: ANCHOR });
  assert.ok(g.length > 3 && g.every((i) => /deneme marka/i.test(i.text)));
});

const RSS = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>"Örnek Marka" - Google Haberler</title>
<item><title>Örnek Marka&#39;dan yeni tesis yatırımı - Örnek Gazete</title><link>https://news.google.com/rss/articles/AAA?oc=5</link>
<guid isPermaLink="false">AAA</guid><pubDate>Mon, 12 Jan 2026 08:30:00 GMT</pubDate>
<description>&lt;a href="https://news.google.com/rss/articles/AAA" target="_blank"&gt;Örnek Marka&amp;#39;dan yeni tesis yatırımı&lt;/a&gt;&amp;nbsp;&amp;nbsp;&lt;font color="#6f6f6f"&gt;Örnek Gazete&lt;/font&gt;</description>
<source url="https://www.ornekgazete.example">Örnek Gazete</source></item>
<item><title><![CDATA[Tüketiciler tepkili: "Fiyatlar & gramaj" tartışması - Deneme Ajans]]></title><link>https://news.google.com/rss/articles/BBB</link>
<guid>BBB</guid><pubDate>Mon, 12 Jan 2026 07:00:00 GMT</pubDate><description><![CDATA[Şirket açıklama yapmadı; dernekler toplanıyor.]]></description>
<source url="https://denemeajans.example">Deneme Ajans</source></item></channel></rss>`;

test('haber: RSS ayrıştırma ve enjekte fetch ile çekim', async () => {
  const c = { id: 'c1', terms: ['Örnek Marka', '@ornekmarka', '#ÖrnekMarka'] };
  const items = parseRss(RSS, c);
  assert.equal(items.length, 2);
  assert.equal(items[0].text, "Örnek Marka'dan yeni tesis yatırımı");
  assert.equal(items[0].author.name, 'Örnek Gazete');
  assert.equal(items[0].author.handle, 'ornekgazete.example');
  assert.equal(items[0].author.kind, 'medya');
  assert.equal(items[0].createdAt, Date.UTC(2026, 0, 12, 8, 30));
  assert.equal(items[0].source, 'haber');
  assert.match(items[0].id, /^haber:/);
  assert.equal(items[1].text, 'Tüketiciler tepkili: "Fiyatlar & gramaj" tartışması — Şirket açıklama yapmadı; dernekler toplanıyor.');
  const url = buildNewsUrl(c, { since: ANCHOR - 24 * H, until: ANCHOR });
  assert.ok(url.startsWith('https://news.google.com/rss/search?q=') && url.endsWith('&hl=tr&gl=TR&ceid=TR:tr'));
  assert.ok(decodeURIComponent(url).includes('"Örnek Marka" OR ornekmarka OR ÖrnekMarka when:1d'));

  let asked = null;
  const src = createHaberSource({ fetchImpl: async (u) => { asked = u; return { ok: true, status: 200, text: async () => RSS }; } });
  const got = await src.poll({ client: c, since: Date.UTC(2026, 0, 12, 8), until: Date.UTC(2026, 0, 12, 9) });
  assert.equal(got.length, 1);
  assert.equal(asked, buildNewsUrl(c, { since: Date.UTC(2026, 0, 12, 8), until: Date.UTC(2026, 0, 12, 9) }));
  assert.equal(src.lastError, null);
  const bad = createHaberSource({ fetchImpl: async () => { throw new Error('ağ yok'); } });
  assert.deepEqual(await bad.poll({ client: c, since: 0, until: 1 }), []);
  assert.match(bad.lastError, /ağ yok/);
});

const X_JSON = { data: [
  { id: '111', text: 'Örnek Marka yine zam yapmış', lang: 'tr', created_at: '2026-01-12T08:00:00.000Z', author_id: '9',
    public_metrics: { like_count: 12, retweet_count: 3, reply_count: 2, quote_count: 1, impression_count: 900 }, attachments: { media_keys: ['m1'] } },
  { id: '112', text: '@biri katılıyorum', lang: 'tr', created_at: '2026-01-12T08:05:00.000Z', author_id: '10',
    public_metrics: { like_count: 0, retweet_count: 0, reply_count: 0, quote_count: 0 }, referenced_tweets: [{ type: 'replied_to', id: '111' }, { type: 'quoted', id: '50' }] }],
  includes: { users: [
    { id: '9', username: 'ornekhaber', name: 'Örnek Haber', verified: true, verified_type: 'business', created_at: '2015-03-01T00:00:00.000Z', public_metrics: { followers_count: 54000 } },
    { id: '10', username: 'biri_iki', name: 'Biri', verified: false, created_at: '2025-12-20T00:00:00.000Z', public_metrics: { followers_count: 14 } }] },
  meta: { result_count: 2 } };

test('X: yanıt ayrıştırma, sorgu kurma', () => {
  const c = { id: 'c1', terms: ['Örnek Marka', '@ornekmarka', '#ÖrnekMarka'] };
  assert.equal(buildXQuery(c), '("Örnek Marka" OR @ornekmarka OR #ÖrnekMarka) -is:retweet');
  const [a, b] = parseXResponse(X_JSON, c);
  assert.equal(a.id, 'x:111');
  assert.equal(a.url, 'https://x.com/ornekhaber/status/111');
  assert.deepEqual(a.metrics, { likes: 12, reposts: 3, replies: 2, quotes: 1, views: 900 });
  assert.deepEqual(a.author, { id: 'x:u9', handle: 'ornekhaber', name: 'Örnek Haber', followers: 54000, verified: true, createdAt: Date.UTC(2015, 2, 1), kind: 'medya' });
  assert.equal(a.media, true);
  assert.equal(a.createdAt, Date.UTC(2026, 0, 12, 8));
  assert.equal(a.clientId, 'c1');
  assert.deepEqual(b.refs, { replyTo: 'x:111', quoteOf: 'x:50', repostOf: null });
  assert.equal(b.author.kind, 'kişi');
  assert.equal(b.metrics.views, 0);
  assert.deepEqual(parseXResponse({ meta: { result_count: 0 } }, c), []);
});

test('X: harcama defteri ve günlük tavan (sahte fetch)', async () => {
  const c = { id: 'c1', terms: ['Örnek Marka'] };
  const store = openStore(':memory:');
  const calls = [];
  const fetchImpl = async (url, opt) => { calls.push({ url: new URL(url), opt }); return { ok: true, status: 200, json: async () => X_JSON }; };
  const noToken = createXSource({ store, fetchImpl });
  assert.deepEqual(await noToken.poll({ client: c, since: ANCHOR - H, until: ANCHOR }), []);
  assert.ok(noToken.lastError && calls.length === 0);

  const src = createXSource({ token: 'T', store, fetchImpl });
  const got = await src.poll({ client: c, since: ANCHOR - H, until: ANCHOR });
  assert.equal(got.length, 2);
  assert.equal(src.lastError, null);
  const u = calls[0].url;
  assert.equal(u.origin + u.pathname, 'https://api.x.com/2/tweets/search/recent');
  assert.equal(u.searchParams.get('start_time'), new Date(ANCHOR - H).toISOString());
  assert.ok(Date.parse(u.searchParams.get('end_time')) < ANCHOR);
  assert.equal(u.searchParams.get('expansions'), 'author_id');
  assert.equal(calls[0].opt.headers.Authorization, 'Bearer T');
  assert.equal(src.spend(ANCHOR).usd, 0.01);
  assert.equal(src.spend(ANCHOR).capUsd, 10);
  assert.equal(src.spend(ANCHOR + 24 * H).usd, 0, 'ertesi gün defter sıfırdan başlar');

  store.set('x.dailyCapUsd', 0.03); // kalan bütçe 10 gönderiye yetmez → çekme
  const n = calls.length;
  assert.deepEqual(await src.poll({ client: c, since: ANCHOR, until: ANCHOR + H }), []);
  assert.equal(calls.length, n);
  assert.match(src.lastError, /tavan/);

  const failing = createXSource({ token: 'T', store: openStore(':memory:'), fetchImpl: async () => ({ ok: false, status: 429 }) });
  assert.deepEqual(await failing.poll({ client: c, since: ANCHOR - H, until: ANCHOR }), []);
  assert.match(failing.lastError, /sınır/);
  store.close();
});

test('Bluesky: yanıt ayrıştırma; hata durumunda sessizce boş', async () => {
  const json = { posts: [{ uri: 'at://did:plc:abc/app.bsky.feed.post/3kxyz', cid: 'c', author: { did: 'did:plc:abc', handle: 'biri.bsky.social', displayName: 'Biri', createdAt: '2024-02-01T00:00:00.000Z' },
    record: { text: 'Örnek Marka konuşuluyor', createdAt: '2026-01-12T08:10:00.000Z', langs: ['tr'], reply: { parent: { uri: 'at://did:plc:def/app.bsky.feed.post/3kaaa' } } },
    replyCount: 1, repostCount: 2, likeCount: 7, quoteCount: 0, indexedAt: '2026-01-12T08:10:05.000Z' }] };
  const [p] = parseBlueskyResponse(json, { id: 'c1' });
  assert.equal(p.id, 'bluesky:did:plc:abc/3kxyz');
  assert.equal(p.url, 'https://bsky.app/profile/biri.bsky.social/post/3kxyz');
  assert.deepEqual(p.metrics, { likes: 7, reposts: 2, replies: 1, quotes: 0, views: 0 });
  assert.equal(p.refs.replyTo, 'bluesky:did:plc:def/3kaaa');
  assert.equal(p.lang, 'tr');
  assert.equal(p.createdAt, Date.UTC(2026, 0, 12, 8, 10));

  const ok = createBlueskySource({ fetchImpl: async (u) => ({ ok: true, status: 200,
    json: async () => (String(u).includes('getProfiles') ? { profiles: [{ did: 'did:plc:abc', followersCount: 321 }] } : json) }) });
  const got = await ok.poll({ client: { id: 'c1', terms: ['Örnek Marka', '@ornek'] }, since: Date.UTC(2026, 0, 12, 8), until: Date.UTC(2026, 0, 12, 9) });
  assert.equal(got.length, 1);
  assert.equal(got[0].author.followers, 321);
  const bad = createBlueskySource({ fetchImpl: async () => ({ ok: false, status: 403 }) });
  assert.deepEqual(await bad.poll({ client: { id: 'c1', terms: ['a'] }, since: 0, until: 1 }), []);
  assert.match(bad.lastError, /403/);
});

test('kaynak fabrikası: canlı modda üç kaynak', () => {
  const srcs = createSources({ mode: 'canlı', store: openStore(':memory:'), fetchImpl: async () => ({ ok: false, status: 500 }) });
  assert.deepEqual(srcs.map((s) => s.id), ['x', 'haber', 'bluesky']);
  for (const s of srcs) { assert.equal(typeof s.poll, 'function'); assert.ok(s.label); assert.equal(s.lastError, null); }
});
