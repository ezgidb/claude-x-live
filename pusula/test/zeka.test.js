import test from 'node:test';
import assert from 'node:assert/strict';
import { createAI } from '../src/ai/index.js';
import { parseJsonLoose } from '../src/ai/claude.js';
import { fmtNum, fmtBig, fmtPct, fmtWhen } from '../src/ai/format.js';
import { classifyQuestion } from '../src/ai/local-ask.js';
import { SAMPLES, HOLDOUT } from './zeka-ornekler.js';

// ---------- Fixture'lar (sözleşme biçiminde, elle) ----------
const NOW = Date.UTC(2026, 2, 10, 15, 0);            // İstanbul 18.00
const H = 3600e3, M = 60e3;

const sut = { id: 'anadolu-sut', name: 'Anadolu Süt', kind: 'marka', terms: ['Anadolu Süt', '@anadolusut', '#AnadoluSüt'],
  sensitivities: ['ürün güvenliği', 'çocuk sağlığı'], rivals: ['Trakya Süt'], note: '' };
const selin = { id: 'selin-aktas', name: 'Dr. Selin Aktaş', kind: 'kişi', terms: ['Selin Aktaş'], sensitivities: ['bilimsel güvenilirlik'], rivals: [], note: '' };

function series(fn) {
  const out = [];
  for (let i = 144; i >= 1; i--) { const t = NOW - i * 10 * M; const n = fn(i); out.push({ t, n, reach: n * 900, neg: Math.round(n * 0.6) }); }
  return out;
}
const author = (handle, followers, kind = 'kişi', verified = false) => ({ id: handle, handle, name: handle, followers, verified, createdAt: NOW - 900 * 864e5, kind });
function item(id, t, a, text, enr, source = 'x') {
  return { id, source, url: `https://example.test/${id}`, text, lang: 'tr', createdAt: t, author: a,
    metrics: { likes: 100, reposts: 40, replies: 10, quotes: 5, views: 9000 }, refs: { replyTo: null, quoteOf: null, repostOf: null }, media: false,
    clientId: 'anadolu-sut', enr: enr ? { emotion: 'öfke', claim: false, callToAction: false, by: 'yerel', ...enr } : null };
}

const N_MADDE = 'Üründe yabancı madde iddiası', N_BOYKOT = 'Boykot çağrısı', N_ESKI = 'Videonun eski olduğu savunması';
const crisisItems = [
  item('x:1', NOW - 6 * H, author('ayse_anne34', 1200), 'Kızımın sütünden bu çıktı. Anadolu Süt çocuk sütü, bugün aldım. Videosu burada, yabancı madde resmen 😡', { stance: 'elestiri', narrative: N_MADDE, claim: true }),
  item('x:2', NOW - 5 * H - 20 * M, author('tuketicisesi', 310000, 'kurum', true), 'Anadolu Süt çocuk sütünden yabancı madde çıktığı iddia ediliyor. Firma açıklama yapmalı.', { stance: 'elestiri', narrative: N_MADDE, claim: true }),
  item('haber:1', NOW - 4 * H, author('gundemhaber', 890000, 'medya', true), 'Çocuk sütünde yabancı madde iddiası sosyal medyayı karıştırdı', { stance: 'notr', narrative: N_MADDE, claim: true }, 'haber'),
  item('x:3', NOW - 3 * H - 10 * M, author('komikadam', 2400000, 'kişi', true), 'Anadolu Süt\'ten yeni lezzet: ekstra proteinli süt 😂', { stance: 'alay', emotion: 'alay', narrative: N_MADDE }),
  item('x:4', NOW - 2 * H - 30 * M, author('boykotcu01', 40), '#AnadoluSütBoykot bu markayı almayın', { stance: 'elestiri', narrative: N_BOYKOT, callToAction: true }),
  item('x:5', NOW - 1 * H - 20 * M, author('sutcu_mehmet', 15000), 'Video 2019\'dan, eski video bu. Kanmayın.', { stance: 'destek', emotion: 'nötr', narrative: N_ESKI, claim: true }),
];
const nar = (id, label, o) => ({ id, label, summary: '', terms: [], count: 100, share: 0.1, reach: 1e5, stance: { destek: 0.05, elestiri: 0.6, alay: 0.2, soru: 0.1, notr: 0.05 },
  firstSeen: NOW - 6 * H, lastSeen: NOW - 5 * M, velocity: 1.2, status: 'büyüyor', kind: 'saldırı', risk: 60, originItemId: null, topItemIds: [], series: [], ...o });

const crisis = {
  clientId: 'anadolu-sut', at: NOW,
  pulse: { bucketMin: 10, series: series((i) => (i > 36 ? 5 : Math.round(5 + (37 - i) * 6))), rate1h: 1240, baseline1h: 32, z: 9.4, trend: 'patlama' },
  stance: { destek: 0.09, elestiri: 0.48, alay: 0.24, soru: 0.11, notr: 0.08 },
  narratives: [
    nar('urunde-yabanci-madde-iddiasi', N_MADDE, { terms: ['yabancı madde', 'çocuk sütü', 'video'], count: 1850, share: 0.46, reach: 6.2e6, risk: 88, originItemId: 'x:1', velocity: 1.6 }),
    nar('boykot-cagrisi', N_BOYKOT, { terms: ['boykot', '#anadolusütboykot', 'almayın'], count: 720, share: 0.18, reach: 1.9e6, risk: 74, velocity: 2.4, firstSeen: NOW - 2.5 * H }),
    nar('videonun-eski-oldugu-savunmasi', N_ESKI, { terms: ['2019', 'eski video'], count: 310, share: 0.08, kind: 'savunma', risk: 10, velocity: 1.9, status: 'doğuyor', firstSeen: NOW - 80 * M,
      stance: { destek: 0.8, elestiri: 0.05, alay: 0.05, soru: 0.1, notr: 0 } }),
  ],
  actors: [
    { id: 'a1', handle: 'ayse_anne34', name: 'Ayşe', followers: 1200, verified: false, kind: 'kişi', role: 'kaynak', items: 3, reach: 410000, engagement: 52000, firstAt: NOW - 6 * H, stance: 'elestiri', narrativeIds: [], note: '' },
    { id: 'a2', handle: 'tuketicisesi', name: 'Tüketici Sesi', followers: 310000, verified: true, kind: 'kurum', role: 'yükseltici', items: 4, reach: 1900000, engagement: 88000, firstAt: NOW - 5.3 * H, stance: 'elestiri', narrativeIds: [], note: '' },
    { id: 'a3', handle: 'komikadam', name: 'Komik Adam', followers: 2400000, verified: true, kind: 'kişi', role: 'yükseltici', items: 2, reach: 3100000, engagement: 140000, firstAt: NOW - 3.2 * H, stance: 'alay', narrativeIds: [], note: '' },
    { id: 'a4', handle: 'gundemhaber', name: 'Gündem Haber', followers: 890000, verified: true, kind: 'medya', role: 'medya', items: 2, reach: 1200000, engagement: 21000, firstAt: NOW - 4 * H, stance: 'notr', narrativeIds: [], note: '' },
    { id: 'a5', handle: 'sutcu_mehmet', name: 'Mehmet', followers: 15000, verified: false, kind: 'kişi', role: 'savunucu', items: 5, reach: 90000, engagement: 4000, firstAt: NOW - 80 * M, stance: 'destek', narrativeIds: [], note: '' },
  ],
  cascade: { originItemId: 'x:1', steps: [
    { t: NOW - 6 * H, itemId: 'x:1', kind: 'ilk', note: '' },
    { t: NOW - 5 * H - 20 * M, itemId: 'x:2', kind: 'sıçrama', note: '' },
    { t: NOW - 4 * H, itemId: 'haber:1', kind: 'medya', note: '' },
    { t: NOW - 3 * H - 10 * M, itemId: 'x:3', kind: 'büyük-hesap', note: '' },
    { t: NOW - 80 * M, itemId: 'x:5', kind: 'karşı-anlatı', note: '' },
  ] },
  coordination: [{ id: 'c1', kind: 'kopya-metin', accounts: Array.from({ length: 23 }, (_, i) => `boykotcu${i}`), itemIds: ['x:4'], windowMin: 12, score: 0.82, note: '23 hesabın 19\'u son bir haftada açılmış.' }],
  forecast: { next1h: 1500, next3h: 3900, direction: 'artış', peakAt: NOW + 70 * M, confidence: 'orta', basis: 'Son üç saatin artış hızı sürüyor.' },
  risk: { score: 86, level: 'kırmızı', drivers: [
    { key: 'hacim', weight: 0.3, note: 'hacim olağanın çok üstünde' },
    { key: 'hassas-konu', weight: 0.25, note: 'ürün güvenliği ve çocuk sağlığı hassasiyetine dokunuyor' },
    { key: 'medya', weight: 0.2, note: 'haber sitesi ve 2,4 milyon takipçili bir hesap konuya girdi' },
    { key: 'çağrı', weight: 0.1, note: 'boykot çağrısı var' }] },
  incident: { id: 'inc1', startedAt: NOW - 5 * H, status: 'açık', headline: 'Çocuk sütünde yabancı madde iddiası hızla yayılıyor' },
  sources: { x: 3900, haber: 46, bluesky: 120 }, sample: { items: 4066, enriched: 2600 }, brief: null, playbook: null,
};

const calm = {
  clientId: 'selin-aktas', at: NOW,
  pulse: { bucketMin: 10, series: series(() => 2), rate1h: 13, baseline1h: 12, z: 0.2, trend: 'sakin' },
  stance: { destek: 0.52, elestiri: 0.06, alay: 0.02, soru: 0.15, notr: 0.25 },
  narratives: [nar('kitap', 'Kitap ve okur yorumları', { kind: 'nötr', count: 140, share: 0.55, risk: 4, status: 'zirvede', velocity: 1, stance: { destek: 0.7, elestiri: 0.05, alay: 0, soru: 0.15, notr: 0.1 } })],
  actors: [], cascade: { originItemId: null, steps: [] }, coordination: [],
  forecast: { next1h: 12, next3h: 36, direction: 'yatay', peakAt: null, confidence: 'orta', basis: 'Akış günlerdir aynı düzeyde.' },
  risk: { score: 8, level: 'yeşil', drivers: [] }, incident: null,
  sources: { x: 250, haber: 6, bluesky: 32 }, sample: { items: 288, enriched: 288 }, brief: null, playbook: null,
};

// ---------- Yerel zenginleştirme ----------
test('yerel enrich: etiketli örneklerde duruş isabeti', async () => {
  const ai = createAI({});
  assert.equal(ai.mode, 'yerel');
  const score = async (set) => {
    const out = await ai.enrich(set.map(([text], i) => ({ id: `x:${i}`, text })), { client: sut, narratives: [] });
    return out.filter((o, i) => o.stance === set[i][1]).length;
  };
  const a = await score(SAMPLES), b = await score(HOLDOUT);
  const total = (a + b) / (SAMPLES.length + HOLDOUT.length);
  console.log(`    duruş isabeti — ana küme: ${a}/${SAMPLES.length}, ayar yapılmamış küme: ${b}/${HOLDOUT.length}, toplam: %${Math.round(total * 100)}`);
  assert.ok(SAMPLES.length + HOLDOUT.length >= 40);
  assert.ok(total >= 0.75, `toplam isabet ${total}`);
  assert.ok(a / SAMPLES.length >= 0.85);
  assert.ok(b / HOLDOUT.length >= 0.65, `ayar yapılmamış küme isabeti ${b / HOLDOUT.length}`);
});

test('yerel enrich: iddia, çağrı, biçim ve anlatı eşleştirme', async () => {
  const ai = createAI({});
  const flagged = SAMPLES.filter((s) => s[2]);
  const out = await ai.enrich(flagged.map(([text], i) => ({ id: `x:${i}`, text })), { client: sut });
  flagged.forEach(([text, , f], i) => {
    if (f.claim) assert.equal(out[i].claim, true, text);
    if (f.cta) assert.equal(out[i].callToAction, true, text);
  });
  const narratives = [{ id: 'a', label: N_MADDE }, { id: 'b', label: N_BOYKOT }, { id: 'c', label: 'Rötar ve gecikme şikâyetleri' }];
  const r = await ai.enrich([
    { id: 'x:1', text: 'Anadolu Süt çocuk sütünden yabancı madde çıktı' },
    { id: 'x:2', text: '#AnadoluSütBoykot almayın' },
    { id: 'x:3', text: 'Anadolu Süt ile irmik helvası tarifi' },
  ], { client: sut, narratives });
  assert.equal(r[0].narrative, N_MADDE);
  assert.equal(r[1].narrative, N_BOYKOT);
  assert.equal(r[2].narrative, null);            // eşleşme yoksa null: ANALİZ kümeler
  assert.deepEqual(Object.keys(r[0]).sort(), ['by', 'callToAction', 'claim', 'emotion', 'id', 'narrative', 'stance']);
  assert.equal(r[0].by, 'yerel');
  assert.deepEqual(await ai.enrich([], { client: sut }), []);
});

test('yerel nameNarratives: okunur etiket ve özet', async () => {
  const ai = createAI({});
  const out = await ai.nameNarratives([
    { id: 'k1', label: 'madde yabancı süt', terms: ['yabancı madde', 'çocuk sütü'], count: 40, samples: ['sütten yabancı madde çıktı rezalet', 'yabancı madde videosu'] },
    { id: 'k2', label: 'rötar saat', terms: ['rötar', 'saat'], samples: [{ text: '3 saat rötar yaptı yine' }] },
    { id: 'k3', label: 'zzz', terms: ['kahvaltı', 'peynir'], samples: [] },
  ], { client: sut });
  assert.equal(out.length, 3);
  assert.equal(out[0].id, 'k1');
  assert.match(out[0].label, /yabancı madde/i);
  assert.match(out[1].label, /Rötar/);
  assert.match(out[2].label, /Kahvaltı/);
  for (const o of out) assert.ok(o.summary.length > 10 && o.summary.endsWith('.'));
});

// ---------- Not ve plan ----------
const BRIEF_KEYS = ['headline', 'whatHappened', 'howItGrew', 'whoStarted', 'whoAmplified', 'whereNow', 'meaning', 'basisNote'];

test('yerel brief: kriz ve sakin snapshot farklı ve tutarlı', async () => {
  const ai = createAI({});
  const k = await ai.brief({ client: sut, snapshot: crisis, items: crisisItems });
  const s = await ai.brief({ client: selin, snapshot: calm, items: [] });
  for (const b of [k, s]) {
    for (const key of BRIEF_KEYS) assert.ok(typeof b[key] === 'string' && b[key].length > 0, key);
    assert.equal(b.at, NOW); assert.equal(b.by, 'yerel');
    assert.ok(Array.isArray(b.watchNext) && b.watchNext.length >= 2);
    assert.ok(['düşük', 'orta', 'yüksek'].includes(b.confidence));
    assert.doesNotMatch(JSON.stringify(b), /undefined|NaN|null|sürüklü/);
    assert.match(b.basisNote, /sayım/);
  }
  // kriz: veriye dayalı ayrıntılar
  assert.match(k.whatHappened, /@ayse_anne34/);
  assert.match(k.whatHappened, /1\.240/);                       // Türkçe sayı biçimi
  assert.match(k.whatHappened, /12\.00/);                       // 14.20 biçiminde saat (İstanbul)
  assert.match(k.howItGrew, /@tuketicisesi/);
  assert.match(k.howItGrew, /haber/);
  assert.match(k.whoAmplified, /@komikadam/);
  assert.match(k.whoAmplified, /kanıt değil/);                  // koordinasyon şüphe olarak
  assert.match(k.meaning, /kırmızı/);
  assert.match(k.meaning, /ürün güvenliği/);
  // sakin: kısa ve sakin
  assert.match(s.headline + s.whatHappened, /kayda değer hareket yok|sakin|olağan/);
  const len = (b) => BRIEF_KEYS.reduce((a, key) => a + b[key].length, 0);
  assert.ok(len(s) < len(k) * 0.6, `sakin not kısa olmalı (${len(s)} / ${len(k)})`);
  assert.doesNotMatch(JSON.stringify(s), /kriz|alarm|kırmızı/);
  // aynı girdi aynı çıktı
  assert.deepEqual(await ai.brief({ client: sut, snapshot: crisis, items: crisisItems }), k);
});

test('yerel playbook: kriz ve sakin snapshot farklı ve tutarlı', async () => {
  const ai = createAI({});
  const brief = await ai.brief({ client: sut, snapshot: crisis, items: crisisItems });
  const k = await ai.playbook({ client: sut, snapshot: crisis, brief, items: crisisItems });
  const s = await ai.playbook({ client: selin, snapshot: calm, brief: null, items: [] });
  for (const p of [k, s]) {
    assert.ok(['izle', 'hazırlan', 'yanıtla', 'düzelt', 'üstlen'].includes(p.posture));
    assert.ok(p.options.length >= 2 && p.options.length <= 3);
    for (const o of p.options) for (const key of ['name', 'when', 'upside', 'risk', 'draft']) assert.ok(o[key].length > 0, key);
    assert.ok(p.rationale.length > 40 && p.holdingStatement.length > 20 && p.doNot.length >= 2 && p.qna.length >= 1);
    assert.ok(Number.isInteger(p.nextCheckMin) && p.nextCheckMin > 0);
    assert.doesNotMatch(JSON.stringify(p), /undefined|NaN/);
  }
  assert.equal(k.posture, 'yanıtla');
  assert.equal(s.posture, 'izle');
  assert.ok(k.nextCheckMin < s.nextCheckMin);
  // İlk taslak iddianın doğruluğunu varsaymaz: inceleme tonu, yalanlama ya da kabul yok
  const first = k.options[0].draft;
  assert.match(first, /incele/);
  assert.doesNotMatch(first, /asılsız|yalan|iftira|doğru değil|özür|tespit ettik/);
  assert.match(first, /Anadolu Süt/);                             // danışanın ağzından, imzalı
  assert.match(first, /ciddiyetle ele alıyoruz/);
  // Düzeltme ve üstlenme yalnızca koşullu
  assert.match(k.options[1].when, /doğrulandıktan sonra/);
  // Koordinasyon: kamuya açık suçlama önerilmez, doNot'ta yer alır
  assert.ok(k.doNot.some((d) => /bot|organize/i.test(d) && /kanıt değil/.test(d)));
  for (const o of k.options) assert.doesNotMatch(o.draft, /bot|trol|organize|koordin/i);
  assert.doesNotMatch(k.holdingStatement, /bot|trol|organize/i);
  assert.ok(k.qna.some((x) => /organize/.test(x.q) && /değerlendirme yapmıyoruz/.test(x.a)));
  // kişi danışan: birinci tekil
  assert.match(s.holdingStatement, /alıyorum/);
});

test('yerel playbook: sarı ve sönen dalgada izle; hizmet şikâyetinde üstlen', async () => {
  const ai = createAI({});
  const hava = { id: 'kuzey', name: 'Kuzey Havayolları', kind: 'marka', terms: [], sensitivities: ['uçuş güvenliği'], rivals: [] };
  const rotar = nar('rotar', 'Rötar ve gecikme şikâyetleri', { terms: ['rötar', 'uçuş'], share: 0.5, risk: 40, status: 'sönüyor' });
  const sari = { ...calm, clientId: 'kuzey', pulse: { ...calm.pulse, rate1h: 60, baseline1h: 25, trend: 'sönüyor' }, narratives: [rotar],
    forecast: { ...calm.forecast, direction: 'düşüş' }, risk: { score: 38, level: 'sarı', drivers: [{ key: 'hacim', weight: 0.5, note: 'hacim olağanın iki katı' }] } };
  const p1 = await ai.playbook({ client: hava, snapshot: sari, items: [] });
  assert.equal(p1.posture, 'izle');
  const turuncu = { ...sari, pulse: { ...sari.pulse, trend: 'yükseliyor' }, risk: { ...sari.risk, score: 66, level: 'turuncu' } };
  const p2 = await ai.playbook({ client: hava, snapshot: turuncu, items: [] });
  assert.equal(p2.posture, 'üstlen');
  assert.match(p2.options[0].draft, /özür/);
});

// ---------- Sor ----------
test('yerel ask: soruyu sınıflar, snapshot\'tan yanıtlar, sınırını söyler', async () => {
  const ai = createAI({});
  assert.equal(classifyQuestion('Bunu kim başlattı?'), 'basla');
  assert.equal(classifyQuestion('en büyük hesaplar hangileri'), 'hesap');
  assert.equal(classifyQuestion('Ne yapmalıyım?'), 'yap');
  assert.equal(classifyQuestion('hangi anlatı büyüyor'), 'anlati');
  assert.equal(classifyQuestion('bot var mı?'), 'bot');
  assert.equal(classifyQuestion('bu ne zaman biter'), 'nezaman');
  assert.equal(classifyQuestion('özetle'), 'ozet');
  const q = (question, snapshot = crisis, client = sut) => ai.ask({ client, snapshot, items: snapshot === crisis ? crisisItems : [], question });
  assert.match(await q('Kim başlattı?'), /@ayse_anne34/);
  assert.match(await q('En büyük hesaplar kim?'), /@komikadam/);
  assert.match(await q('Ne yapmalıyım?'), /yanıtla/);
  assert.match(await q('Hangi anlatı büyüyor?'), /Boykot çağrısı/);
  const bot = await q('Bot var mı?');
  assert.match(bot, /23 hesap/); assert.match(bot, /kanıt değil/);
  assert.match(await q('Ne zaman biter?'), /Kesin bir bitiş saati veremem/);
  assert.match(await q('Bot var mı?', calm, selin), /görülmedi/);
  assert.match(await q('Rakibimizin reklam bütçesi ne kadar?'), /Claude anahtarı gerekli/);
});

test('biçimlendirme: Türkçe sayı, pay ve saat', () => {
  assert.equal(fmtNum(12400), '12.400');
  assert.equal(fmtBig(2400000), '2,4 milyon');
  assert.equal(fmtBig(310000), '310 bin');
  assert.equal(fmtPct(0.46), '%46');
  assert.equal(fmtWhen(Date.UTC(2026, 2, 10, 11, 20), NOW), '14.20');
  assert.equal(fmtWhen(Date.UTC(2026, 2, 9, 20, 40), NOW), 'dün 23.40');
});

// ---------- Claude modu (sahte fetch; gerçek çağrı yok) ----------
function fakeFetch(handler) {
  const calls = [];
  const fn = async (url, init) => {
    const body = JSON.parse(init.body);
    calls.push({ url, headers: init.headers, body });
    const r = await handler(body, calls.length);
    if (r instanceof Error) throw r;
    if (r.status) return { ok: false, status: r.status, text: async () => r.text || '', json: async () => ({}) };
    const text = typeof r === 'string' ? r : JSON.stringify(r);
    return { ok: true, status: 200, text: async () => '', json: async () => ({ content: [{ type: 'thinking', thinking: '' }, { type: 'text', text }], stop_reason: r.__stop || 'end_turn', usage: { input_tokens: 100, cache_read_input_tokens: 400, output_tokens: 50 } }) };
  };
  fn.calls = calls;
  return fn;
}

test('claude enrich: istek gövdesi, toplu çağrı, ayrıştırma', async () => {
  const items = Array.from({ length: 120 }, (_, i) => ({ id: `x:${i}`, source: 'x', text: i % 2 ? 'Rezalet bir ürün' : 'Harika bir ürün', author: { handle: `h${i}`, followers: 10 } }));
  const fetchImpl = fakeFetch((body) => {
    const rows = JSON.parse(body.messages[0].content.split('Gönderiler (JSON):\n')[1]);
    return { items: rows.map((r) => ({ id: r.id, stance: 'alay', emotion: 'alay', narrative: 'Yeni anlatı etiketi', claim: true, callToAction: false })) };
  });
  const ai = createAI({ apiKey: 'test-anahtar', fetchImpl });
  assert.equal(ai.mode, 'claude');
  const out = await ai.enrich(items, { client: sut, narratives: [{ id: 'a', label: N_MADDE }] });
  assert.equal(out.length, 120);
  assert.ok(out.every((o, i) => o.id === items[i].id && o.stance === 'alay' && o.by === 'claude' && o.narrative === 'Yeni anlatı etiketi' && o.claim === true));
  assert.equal(fetchImpl.calls.length, 3);                        // 50 + 50 + 20
  const c = fetchImpl.calls[0];
  assert.equal(c.url, 'https://api.anthropic.com/v1/messages');
  assert.equal(c.headers['x-api-key'], 'test-anahtar');
  assert.equal(c.headers['anthropic-version'], '2026-10-21');
  assert.equal(c.headers['anthropic-beta'], undefined);           // hızlı modelde sunucu tarafı yedek yok
  assert.equal(c.body.model, 'claude-haiku-5-5');
  assert.equal(c.body.fallbacks, undefined);
  assert.equal(c.body.output_config.format.type, 'json_schema');
  assert.equal(c.body.output_config.format.schema.additionalProperties, false);
  assert.ok(!('temperature' in c.body) && !('thinking' in c.body));
  assert.deepEqual(c.body.system[0].cache_control, { type: 'ephemeral' });   // sistem istemi önbelleğe alınır
  const sys = c.body.system[0].text;
  for (const s of ['Anadolu Süt', 'marka', 'ürün güvenliği', 'Trakya Süt', 'HARFİ HARFİNE', '3-6 sözcüklük']) assert.ok(sys.includes(s), s);
  assert.ok(c.body.messages[0].content.includes(`- ${N_MADDE}`));
  assert.equal(fetchImpl.calls[0].body.system[0].text, fetchImpl.calls[1].body.system[0].text);   // sabit önek
  assert.deepEqual(ai.usage(), { calls: 3, inputTokens: 1500, outputTokens: 150 });
});

test('claude enrich: hata, bozuk JSON ve eksik kayıt → yerel sonuca düşer', async () => {
  const items = Array.from({ length: 60 }, (_, i) => ({ id: `x:${i}`, text: 'Rezalet, yazıklar olsun' }));
  for (const bad of [new Error('ağ hatası'), { status: 529, text: 'overloaded' }, 'JSON değil bu', { items: 'yanlış' }, { __stop: 'refusal', items: [] }]) {
    const ai = createAI({ apiKey: 'k', fetchImpl: fakeFetch(() => bad) });
    const out = await ai.enrich(items, { client: sut });
    assert.equal(out.length, 60);
    assert.ok(out.every((o) => o.by === 'yerel' && o.stance === 'elestiri'));
    assert.ok(ai.lastError());
  }
  // İlk parti başarılı, ikincisi hatalı; bir kayıt geçersiz duruşla gelir
  const fetchImpl = fakeFetch((body, n) => {
    if (n === 2) return { status: 500 };
    const rows = JSON.parse(body.messages[0].content.split('Gönderiler (JSON):\n')[1]);
    return '```json\n' + JSON.stringify({ items: rows.slice(1).map((r, i) => ({ id: r.id, stance: i === 0 ? 'kızgın' : 'soru', emotion: 'nötr', narrative: null, claim: false, callToAction: false })) }) + '\n```';
  });
  const out = await createAI({ apiKey: 'k', fetchImpl }).enrich(items, { client: sut });
  assert.equal(out[0].by, 'yerel');          // yanıtta yok
  assert.equal(out[1].by, 'yerel');          // geçersiz duruş
  assert.equal(out[2].by, 'claude'); assert.equal(out[2].stance, 'soru');
  assert.ok(out.slice(50).every((o) => o.by === 'yerel'));
});

test('claude brief / playbook / ask: derin model, şema, başarı ve düşüş', async () => {
  const briefJson = { headline: 'B', whatHappened: 'ne', howItGrew: 'nasıl', whoStarted: 'kim', whoAmplified: 'kimler', whereNow: 'şimdi', meaning: 'anlam', watchNext: ['bir', 'iki'], confidence: 'orta', basisNote: 'sayım kesin' };
  const pbJson = { posture: 'yanıtla', rationale: 'gerekçe', options: [{ name: 'A', when: 'şimdi', upside: 'x', risk: 'y', draft: 'İnceliyoruz.' }], doNot: ['yapma'], holdingStatement: 'Haberdarız.', qna: [{ q: 's', a: 'c' }], nextCheckMin: 20 };
  const fetchImpl = fakeFetch((body) => {
    if (!body.output_config.format) return 'Düz metin yanıt.';
    return body.output_config.format.schema.properties.posture ? pbJson : briefJson;
  });
  const ai = createAI({ apiKey: 'k', fetchImpl });
  const b = await ai.brief({ client: sut, snapshot: crisis, items: crisisItems });
  assert.deepEqual(b, { at: NOW, by: 'claude', ...briefJson });
  const p = await ai.playbook({ client: sut, snapshot: crisis, brief: b, items: crisisItems });
  assert.deepEqual(p, { at: NOW, by: 'claude', ...pbJson });
  const a = await ai.ask({ client: sut, snapshot: crisis, items: crisisItems, question: 'Kim başlattı?', history: [{ q: 'özet', a: 'şöyle' }] });
  assert.equal(a, 'Düz metin yanıt.');
  const [cb, cp, ca] = fetchImpl.calls;
  for (const c of [cb, cp, ca]) {
    assert.equal(c.body.model, 'claude-opus-5-5');
    assert.equal(c.headers['anthropic-beta'], 'server-side-fallback-2026-07-01');
    assert.equal(c.body.fallbacks, 'default');
    assert.ok(c.body.system[0].text.includes('Anadolu Süt') && c.body.system[0].text.includes('neden-sonuç'.replace('neden', 'Neden')));
  }
  assert.equal(cb.body.output_config.effort, 'high');
  assert.ok(cb.body.messages[0].content.includes('"son1saat":1240'));
  assert.ok(cb.body.messages[0].content.includes('@ayse_anne34'));
  assert.ok(cp.body.system[0].text.includes('ÖNERME'));          // koordinasyon suçlaması yasağı
  assert.ok(cp.body.messages[0].content.includes('Durum notu'));
  assert.deepEqual(ca.body.messages.map((m) => m.role), ['user', 'user', 'assistant', 'user']);
  assert.ok(ca.body.messages.at(-1).content.includes('Kim başlattı?'));

  // Düşüş yolları: hata, zaman aşımı benzeri fırlatma, eksik alan → yerel çıktı, fırlatma yok
  for (const bad of [new Error('abort'), { status: 401, text: 'invalid x-api-key' }, 'yarım { json', { headline: 'yalnızca başlık' }]) {
    const ai2 = createAI({ apiKey: 'k', fetchImpl: fakeFetch(() => bad) });
    const b2 = await ai2.brief({ client: sut, snapshot: crisis, items: crisisItems });
    assert.equal(b2.by, 'yerel'); assert.match(b2.whatHappened, /@ayse_anne34/);
    const p2 = await ai2.playbook({ client: sut, snapshot: crisis, brief: b2, items: crisisItems });
    assert.equal(p2.by, 'yerel'); assert.equal(p2.posture, 'yanıtla');
    if (typeof bad !== 'string' && !bad.headline) assert.match(await ai2.ask({ client: sut, snapshot: crisis, items: crisisItems, question: 'Kim başlattı?' }), /@ayse_anne34/);
    const n2 = await ai2.nameNarratives([{ id: 'k1', label: 'x', terms: ['rötar'], samples: [] }], { client: sut });
    assert.match(n2[0].label, /Rötar/);
  }
});

test('modeller parametre ve ortam değişkeniyle değişir', async () => {
  const fetchImpl = fakeFetch(() => ({ narratives: [{ id: 'k1', label: 'Yeni ad', summary: 'Özet.' }] }));
  const ai = createAI({ apiKey: 'k', fetchImpl, models: { fast: 'claude-sonnet-5-5' } });
  const out = await ai.nameNarratives([{ id: 'k1', label: 'x', terms: [], samples: [] }], { client: sut });
  assert.deepEqual(out, [{ id: 'k1', label: 'Yeni ad', summary: 'Özet.' }]);
  assert.equal(fetchImpl.calls[0].body.model, 'claude-sonnet-5-5');
  process.env.PUSULA_MODEL_DEEP = 'claude-fable-5-2';
  try { assert.equal(createAI({ apiKey: 'k', fetchImpl }).models.deep, 'claude-fable-5-2'); } finally { delete process.env.PUSULA_MODEL_DEEP; }
  assert.equal(createAI({}).models.fast, 'claude-haiku-5-5');
});

test('parseJsonLoose: kod çiti ve çevresindeki söz', () => {
  assert.deepEqual(parseJsonLoose('İşte:\n```json\n{"a":1}\n```'), { a: 1 });
  assert.deepEqual(parseJsonLoose('Sonuç {"a":{"b":2}} budur'), { a: { b: 2 } });
  assert.throws(() => parseJsonLoose('hiç json yok'));
});

test('hiçbir yöntem bozuk girdide fırlatmaz', async () => {
  const ai = createAI({});
  await ai.enrich([{ id: 'x:1', text: null }, { id: 'x:2' }], {});
  await ai.nameNarratives([{ id: 'a' }], {});
  const b = await ai.brief({ client: sut, snapshot: { clientId: 'anadolu-sut', at: NOW }, items: null });
  assert.equal(b.by, 'yerel');
  const p = await ai.playbook({ client: sut, snapshot: { clientId: 'anadolu-sut', at: NOW } });
  assert.equal(p.posture, 'izle');
  assert.equal(typeof await ai.ask({ client: sut, snapshot: null, question: 'özetle' }), 'string');
  assert.deepEqual(ai.usage(), { calls: 0, inputTokens: 0, outputTokens: 0 });
});
