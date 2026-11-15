import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze, diffEvents } from '../src/analysis/index.js';
import { trLower, slugify, words } from '../src/analysis/text.js';

const MIN = 60_000, HOUR = 60 * MIN, DAY = 24 * HOUR;
const NOW = Date.UTC(2026, 4, 10, 15, 0, 0);
const client = { id: 'anadolu-sut', name: 'Anadolu Süt', kind: 'marka', terms: ['Anadolu Süt', '@anadolusut', '#AnadoluSüt'], sensitivities: ['ürün güvenliği', 'çocuk sağlığı'], rivals: [], note: '' };

function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pick = (r, a) => a[Math.floor(r() * a.length)];

const P = {
  fiyat: { n: 'Fiyat şikâyeti', s: 'elestiri', a: ['yine zam gelmiş', 'fiyatlar uçmuş', 'bir litre süt bu kadar olur mu', 'market fiyatı cep yakıyor'], b: ['artık alamıyoruz', 'peynir de pahalandı', 'etiketi görünce şaştım', 'maaş yetmiyor'] },
  tarif: { n: 'Tarif paylaşımları', s: 'notr', a: ['sütlaç tarifi denedim', 'kahvaltıya yoğurtlu poğaça yaptım', 'muhallebi nefis oldu', 'ev yapımı kek tarifim'], b: ['tarifi isteyene yazarım', 'çocuklar bayıldı', 'fırından yeni çıktı', 'kıvamı tam oldu'] },
  reklam: { n: 'Reklam övgüsü', s: 'destek', a: ['yeni reklam filmi çok güzel olmuş', 'reklamdaki müzik harika', 'reklam ekibine teşekkürler', 'kampanya süper düşünülmüş'], b: ['içim ısındı', 'tebrik ederim', 'yıllardır tercihim', 'emeği geçenlere bravo'] },
  madde: { n: 'Üründe yabancı madde iddiası', s: 'elestiri', a: ['çocuk sütünden yabancı madde çıktı', 'videodaki yabancı madde mide bulandırıyor', 'sütün içinden plastik parça çıkmış', 'kutudan çıkan yabancı madde videosu rezalet'], b: ['çocuğuma içirdim korkuyorum', 'bu nasıl denetim', 'açıklama bekliyoruz', 'sağlığımızla oynuyorlar', 'video ortada inkar edemezler'] },
  boykot: { n: 'Boykot çağrısı', s: 'elestiri', cta: true, a: ['boykot ediyoruz', 'raflarda kalsın boykot', 'kimse almasın boykot zamanı', 'boykot listesine ekledim'], b: ['paylaşın herkes görsün', 'almayın aldırmayın', 'özür dileyene kadar yok', 'cüzdanla cevap verelim'] },
  alay: { n: 'Üründe yabancı madde iddiası', s: 'alay', a: ['sürpriz yumurta gibi süt', 'ekstra katkılı süt çıkarmışlar', 'sütten oyuncak çıkıyormuş', 'yeni ürün plastikli süt'], b: ['koleksiyon yapacağım', 'hediyesi içinde', 'yabancı madde bonus', 'şaka gibi video'] },
  karsi: { n: 'Video eski iddiası', s: 'destek', a: ['video 2019 tarihli eski görüntü', 'bu görüntüler eski 2019 yılına ait', 'eski video yeniden dolaşıma sokulmuş', 'görüntü 2019 tarihli başka ülkeden'], b: ['iftira atmayın', 'araştırmadan paylaşmayın', 'markaya haksızlık', 'teyit edilmiş bilgi'] },
  rotar: { n: 'Rötar şikâyeti', s: 'elestiri', a: ['uçak üç saat rötar yaptı', 'yine rötar bekliyoruz', 'rötar yüzünden aktarmayı kaçırdım', 'kapıda iki saattir rötar anonsu'], b: ['bilgi veren yok', 'mağdur olduk', 'bagaj da kayıp', 'özür bile yok'] },
};
const EMO = ['', '', ' 😡', ' 🙄', ' !!', ' ...', ' ya', ' arkadaşlar'];

function gen(seed) {
  const r = rng(seed), items = [];
  let k = 0;
  const author = (o = {}) => { const id = `u${seed}_${k}`; return { id, handle: `kisi_${seed}_${k}`, name: `Kişi ${k}`, followers: Math.floor(50 + r() * r() * 3000), verified: false, createdAt: NOW - (200 + r() * 2000) * DAY, kind: 'kişi', ...o }; };
  const add = (t, pool, o = {}) => {
    const p = P[pool]; k++;
    const text = o.text ?? `${pick(r, p.a)} ${pick(r, ['', 'bence', 'gerçekten', 'resmen'])} ${pick(r, p.b)} Anadolu Süt${pick(r, EMO)} ${Math.floor(r() * 1e6).toString(36)}`;
    const it = { id: `x:${seed}:${k}`, source: o.source || 'x', url: '', text, lang: 'tr', createdAt: Math.round(t),
      author: o.author || author(o.au), metrics: { likes: Math.floor(r() * 20), reposts: Math.floor(r() * 5), replies: Math.floor(r() * 4), quotes: 0, views: 0, ...o.metrics },
      refs: { replyTo: null, quoteOf: null, repostOf: null, ...o.refs }, media: false, clientId: client.id,
      enr: { stance: p.s, emotion: 'nötr', narrative: p.n, claim: pool === 'madde', callToAction: !!p.cta, by: 'claude' } };
    items.push(it);
    return it;
  };
  const noise = (perHour, pools = ['fiyat', 'tarif', 'reklam', 'tarif', 'reklam']) => { for (let t = NOW - DAY + 1; t < NOW; t += HOUR / perHour) add(t + r() * (HOUR / perHour) * 0.9, pick(r, pools)); };
  return { r, items, add, noise, author };
}
const calm = () => { const g = gen(1); g.noise(6); return g.items; };
function smallWave() { const g = gen(2); g.noise(5); for (let i = 0; i < 110; i++) g.add(NOW - 2 * HOUR + g.r() * 2 * HOUR, 'rotar'); return g.items; }
function crisis(scale = 1, endH = 5) {
  const g = gen(3), T0 = NOW - 5 * HOUR, end = T0 + endH * HOUR, r = g.r;
  g.noise(8);
  const origin = g.add(T0, 'madde', { text: 'Çocuk sütünden yabancı madde çıktı, videoyu çektim. Anadolu Süt açıklama yapsın!', au: { followers: 800, handle: 'ilk_paylasan' }, metrics: { likes: 9000, reposts: 4000 } });
  const at = (t, pool, o) => { if (t < end) return g.add(t, pool, o); };
  for (let i = 0; i < 4; i++) at(T0 + (5 + i * 8) * MIN, 'madde');
  at(T0 + 40 * MIN, 'madde', { au: { followers: 85_000, handle: 'tuketici_haklari' }, refs: { quoteOf: origin.id }, metrics: { likes: 5000, reposts: 2500 } });
  at(T0 + 95 * MIN, 'madde', { source: 'haber', au: { kind: 'medya', followers: 400_000, handle: 'gundemhaber', name: 'Gündem Haber' }, text: 'Anadolu Süt ürününde yabancı madde iddiası sosyal medyada gündem oldu' });
  at(T0 + 120 * MIN, 'boykot', { au: { followers: 2_100_000, handle: 'buyuk_fenomen', verified: true }, metrics: { likes: 40000, reposts: 12000 } });
  at(T0 + 130 * MIN, 'madde', { source: 'bluesky', au: { handle: 'mavi.gok' } });
  // büyüme: 40. dakikadan sonra hızlanır, 4. saatte zirve
  for (let m = 41; m < 300; m++) {
    const rate = (m < 90 ? 0.6 : m < 150 ? 2 : m < 250 ? 4.5 : 3.5) * scale;
    const n = Math.floor(rate) + (r() < rate % 1 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const t = T0 + (m + r()) * MIN, x = r();
      if (x < 0.25) at(t, 'madde', { refs: { repostOf: origin.id }, text: 'RT' });
      else if (m > 120 && x < 0.5) at(t, 'boykot');
      else if (x < 0.65) at(t, 'alay');
      else at(t, 'madde');
    }
  }
  // koordineli küme: 15 genç hesap, 12 dakika, neredeyse aynı metin
  for (let i = 0; i < 15; i++) at(T0 + 180 * MIN + i * 48_000, 'boykot', { text: `Anadolu Süt çocuklarımızı zehirliyor bu markayı hemen boykot edin ve herkese duyurun ${i % 3 ? '#AnadoluSütBoykot' : 'lütfen'}`, au: { createdAt: T0 - 10 * DAY, followers: 12 } });
  // sıradan kullanıcıların kısa sloganı (koordinasyon sayılmamalı)
  for (let i = 0; i < 40; i++) at(T0 + (125 + r() * 170) * MIN, 'boykot', { text: '#AnadoluSütBoykot' });
  for (let i = 0; i < 14; i++) at(T0 + (210 + i * 6) * MIN, 'karsi');
  return g.items;
}
const strip = (items) => items.map((it) => ({ ...it, enr: null }));
const run = (items, prev = null, now = NOW) => analyze({ client, items, now, prev });

test('metin: Türkçe küçük harf, slug, etiket parçalama', () => {
  assert.equal(trLower('IŞIK İDDİA'), 'ışık iddia');
  assert.equal(slugify('Üründe Yabancı Madde İddiası'), 'urunde-yabanci-madde-iddiasi');
  assert.deepEqual(words("#AnadoluSütBoykot @biri Süt'ten https://x.co/a"), ['anadolu', 'süt', 'boykot', 'süt']);
});

test('boş girdi çökmez, biçim tamam', () => {
  const s = run([]);
  assert.equal(s.pulse.series.length, 144);
  assert.equal(s.risk.level, 'yeşil');
  assert.equal(s.incident, null);
  assert.deepEqual(s.cascade, { originItemId: null, steps: [] });
  assert.equal(s.brief, null); assert.equal(s.playbook, null);
  assert.deepEqual(diffEvents(null, s, { client, items: [] }), []);
});

test('sakin dönem: yeşil, olay yok, koordinasyon yok, olay üretmez', () => {
  const items = calm();
  const s = run(items);
  assert.equal(s.risk.level, 'yeşil', JSON.stringify(s.risk));
  assert.equal(s.pulse.trend, 'sakin');
  assert.equal(s.incident, null);
  assert.equal(s.coordination.length, 0);
  assert.ok(Math.abs(Object.values(s.stance).reduce((a, b) => a + b, 0) - 1) < 1e-9);
  assert.ok(s.narratives.length >= 3);
  const s2 = run(items, s, NOW + 5 * MIN);
  assert.deepEqual(diffEvents(s, s2, { client, items }), []);
  assert.equal(s.forecast.confidence, 'düşük');
});

test('küçük şikâyet dalgası: sarıyı geçmez, olay açılmaz', () => {
  const s = run(smallWave());
  assert.ok(s.pulse.z >= 3, `z=${s.pulse.z}`);
  assert.ok(['yeşil', 'sarı'].includes(s.risk.level), JSON.stringify(s.risk));
  assert.equal(s.risk.level, 'sarı');
  assert.equal(s.incident, null);
  assert.equal(s.coordination.length, 0);
});

test('tam kriz (enr\'li): kırmızı/turuncu, anlatılar, zincir, koordinasyon, aktörler', () => {
  const items = crisis();
  const s = run(items);
  assert.ok(['turuncu', 'kırmızı'].includes(s.risk.level), JSON.stringify(s.risk));
  assert.ok(s.risk.drivers.length >= 4 && s.risk.drivers.every((d) => d.note));
  assert.ok(s.incident && s.incident.status === 'açık');
  assert.ok(['patlama', 'yükseliyor', 'hareketli'].includes(s.pulse.trend), s.pulse.trend);
  const madde = s.narratives.find((n) => n.id === 'urunde-yabanci-madde-iddiasi');
  assert.ok(madde && madde.kind === 'saldırı');
  assert.equal(madde.originItemId, items.find((i) => i.author.handle === 'ilk_paylasan').id);
  assert.ok(madde.count > 300, 'yeniden paylaşımlar kaynağın anlatısına sayılır');
  assert.equal(s.narratives.find((n) => n.label === 'Video eski iddiası').kind, 'savunma');
  assert.equal(s.cascade.originItemId, madde.originItemId);
  const kinds = s.cascade.steps.map((x) => x.kind);
  for (const k of ['ilk', 'sıçrama', 'büyük-hesap', 'medya', 'platform-geçişi', 'karşı-anlatı']) assert.ok(kinds.includes(k), `zincirde ${k} yok: ${kinds}`);
  assert.deepEqual(s.cascade.steps.map((x) => x.t), s.cascade.steps.map((x) => x.t).sort((a, b) => a - b));
  const sic = s.cascade.steps.find((x) => x.kind === 'sıçrama');
  assert.equal(items.find((i) => i.id === sic.itemId).author.handle, 'tuketici_haklari');
  assert.match(sic.note, /ardından/);
  // koordinasyon: tek küme, kısa slogan ve yeniden paylaşımlar hariç
  assert.equal(s.coordination.length, 1, JSON.stringify(s.coordination.map((c) => [c.kind, c.accounts.length, c.note])));
  assert.equal(s.coordination[0].kind, 'kopya-metin');
  assert.equal(s.coordination[0].accounts.length, 15);
  assert.ok(s.coordination[0].score >= 0.5 && s.coordination[0].score <= 1);
  const role = (h) => s.actors.find((a) => a.handle === h)?.role;
  assert.equal(role('ilk_paylasan'), 'kaynak');
  assert.equal(role('tuketici_haklari'), 'yükseltici');
  assert.equal(role('gundemhaber'), 'medya');
  assert.ok(s.actors.some((a) => a.role === 'şüpheli'));
  assert.ok(s.actors.length <= 25 && s.actors.every((a) => a.note));
  assert.ok(s.sources.haber >= 1 && s.sources.bluesky >= 1);
});

test('tam kriz (enr\'siz): sözcüksel kümeleme ve yedek duruş ile yine yüksek risk', () => {
  const s = run(strip(crisis()));
  assert.ok(['turuncu', 'kırmızı'].includes(s.risk.level), JSON.stringify(s.risk));
  assert.ok(s.narratives.length >= 2 && s.narratives.every((n) => n.lexical));
  assert.ok(s.narratives.some((n) => n.terms.some((t) => /yabancı|madde/.test(t))), JSON.stringify(s.narratives.map((n) => n.label)));
  assert.equal(s.coordination.length, 1);
  assert.equal(s.sample.enriched, 0);
});

test('kimlikler prev\'e göre kararlı; adlandırılmış sözcüksel anlatı etiketi korunur', () => {
  const items = strip(crisis());
  const a = run(items, null, NOW - 10 * MIN);
  a.narratives[0].label = 'Yapay zekâ adı'; a.narratives[0].summary = 'Özet';
  const b = run(items, a);
  const ids = new Set(b.narratives.map((n) => n.id));
  for (const n of a.narratives.slice(0, 3)) assert.ok(ids.has(n.id), `kayıp id ${n.id}`);
  const same = b.narratives.find((n) => n.id === a.narratives[0].id);
  assert.equal(same.label, 'Yapay zekâ adı'); assert.equal(same.summary, 'Özet');
  // benzer etiketler birleşir, id korunur
  const it2 = crisis().map((it) => (it.enr.narrative === 'Üründe yabancı madde iddiası' && it.id.endsWith('7') ? { ...it, enr: { ...it.enr, narrative: 'ÜRÜNDE YABANCI MADDE İDDİASI!' } } : it));
  const c = run(it2);
  assert.equal(c.narratives.filter((n) => /yabanc/i.test(n.label)).length, 1);
});

test('diffEvents: kriz boyunca anlamlı olaylar, tekrar yok', () => {
  let prev = null; const all = new Map(); const kinds = []; const full = crisis();
  for (let h = 0.25; h <= 5.001; h += 0.25) {
    const now = NOW - 5 * HOUR + h * HOUR;
    const items = full.filter((i) => i.createdAt <= now);
    const s = analyze({ client, items, now, prev });
    for (const e of diffEvents(prev, s, { client, items })) {
      assert.ok(!all.has(e.id), `yinelenen olay ${e.id}`);
      assert.ok(e.title && e.detail && e.detail.length < 400 && e.clientId === client.id && e.at === now);
      all.set(e.id, e); kinds.push(e.kind);
    }
    prev = s;
  }
  for (const k of ['olay-açıldı', 'yeni-anlatı', 'büyük-hesap', 'medya-girdi', 'koordinasyon', 'karşı-anlatı']) assert.ok(kinds.includes(k), `${k} yok: ${kinds}`);
  assert.ok(kinds.length <= 25, `çok fazla olay: ${kinds.length}`);
  // aynı veriyle yeniden: sessiz
  const again = analyze({ client, items: crisis(), now: NOW + MIN, prev });
  assert.deepEqual(diffEvents(prev, again, { client, items: crisis() }).map((e) => e.kind), []);
});

test('olay yaşam döngüsü histerezisli; zirve olayı', () => {
  const items = crisis();
  let prev = run(items), states = [], kinds = [];
  for (let h = 1; h <= 16; h++) {
    const s = run(items, prev, NOW + h * HOUR);
    kinds.push(...diffEvents(prev, s, { client, items }).map((e) => e.kind));
    states.push(s.incident ? s.incident.status : 'yok');
    prev = s;
  }
  const str = states.join(',');
  assert.match(str, /^(açık,)+(soğuyor,)*(yok,?)+$/, str);
  assert.ok(kinds.includes('zirve'), kinds.join());
  assert.ok(kinds.includes('olay-soğudu'));
  assert.equal(prev.risk.level, 'yeşil');
});

test('performans: 10 bin gönderi < 300 ms (ısınmış)', () => {
  const items = crisis(13);
  assert.ok(items.length >= 10_000, `n=${items.length}`);
  for (const set of [items, strip(items)]) {
    run(set);
    const t = performance.now(); run(set); const ms = performance.now() - t;
    assert.ok(ms < 300, `${ms.toFixed(0)} ms`);
  }
});
