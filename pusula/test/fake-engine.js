// Sahte motor: sözleşmedeki motor arayüzünü uygular; arayüz testleri ve geliştirme için.
// Üç uydurma danışan: Anadolu Süt (kırmızı kriz), Kuzey Havayolları (sarı), Dr. Selin Aktaş (yeşil).
// Doğrudan çalıştırılırsa sunucuyu bu motorla 4400'de başlatır: `node test/fake-engine.js`
import { EventEmitter } from 'node:events';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const MIN = 60_000, HOUR = 60 * MIN, BUCKET = 10 * MIN;

// tohumlu rastgele: aynı (tohum, anahtar) hep aynı sayıyı verir
function hash(str) { let h = 2166136261; for (const ch of str) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
const rnd = (key) => (hash(String(key)) % 100000) / 100000;
const pick = (arr, key) => arr[Math.floor(rnd(key) * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const round = (v, d = 2) => Math.round(v * 10 ** d) / 10 ** d;
const bump = (x, peak, width) => Math.exp(-((x - peak) ** 2) / (2 * width ** 2));

// ---------- danışan tanımları ----------
const CLIENTS = [
  { id: 'anadolu-sut', name: 'Anadolu Süt', kind: 'marka', terms: ['Anadolu Süt', '@anadolusut', '#AnadoluSüt'],
    sensitivities: ['ürün güvenliği', 'çocuk sağlığı'], rivals: ['Trakya Süt'], note: '' },
  { id: 'kuzey-havayollari', name: 'Kuzey Havayolları', kind: 'marka', terms: ['Kuzey Havayolları', '@kuzeyhava', 'KZ rötar'],
    sensitivities: ['uçuş güvenliği'], rivals: ['Mavi Kanat'], note: '' },
  { id: 'selin-aktas', name: 'Dr. Selin Aktaş', kind: 'kişi', terms: ['Selin Aktaş', '@drselinaktas', 'Sofradaki Denge'],
    sensitivities: ['bilimsel doğruluk'], rivals: [], note: '' },
];

const AUTHORS = {
  'anadolu-sut': [
    { id: 'u1', handle: 'ayse_anne34', name: 'Ayşe K.', followers: 412, verified: false, kind: 'kişi', role: 'kaynak', stance: 'elestiri', note: 'Videoyu ilk paylaşan hesap; geçmişte marka hakkında paylaşımı yok.' },
    { id: 'u2', handle: 'tuketicihaklari', name: 'Tüketici Hakları Derneği', followers: 186000, verified: true, kind: 'kurum', role: 'yükseltici', stance: 'elestiri', note: 'Alıntısıyla erişim ilk kez sıçradı.' },
    { id: 'u3', handle: 'gundemhaber', name: 'Gündem Haber', followers: 940000, verified: true, kind: 'medya', role: 'medya', stance: 'notr', note: 'Konuyu haber olarak işleyen ilk site.' },
    { id: 'u4', handle: 'mizahbaskisi', name: 'Mizah Baskısı', followers: 312000, verified: false, kind: 'kişi', role: 'köprü', stance: 'alay', note: 'Konuyu mizah kitlesine taşıdı; en çok etkileşim alan alay gönderileri burada.' },
    { id: 'u5', handle: 'canberkvlog', name: 'Canberk', followers: 1240000, verified: true, kind: 'kişi', role: 'yükseltici', stance: 'elestiri', note: 'Büyük fenomen; boykot etiketini paylaştı.' },
    { id: 'u6', handle: 'veri_dedektifi', name: 'Veri Dedektifi', followers: 58000, verified: false, kind: 'kişi', role: 'savunucu', stance: 'destek', note: 'Videonun 2019 tarihli olduğunu gösteren karşı anlatının kaynağı.' },
    { id: 'u7', handle: 'mehmet48291', name: 'mehmet48291', followers: 3, verified: false, kind: 'bilinmiyor', role: 'şüpheli', stance: 'elestiri', note: 'Hesap 6 gün önce açılmış; kopya metin kümesinde.' },
    { id: 'u8', handle: 'zeynep_k7731', name: 'zeynep_k7731', followers: 11, verified: false, kind: 'bilinmiyor', role: 'şüpheli', stance: 'elestiri', note: 'Hesap 9 gün önce açılmış; kopya metin kümesinde.' },
    { id: 'u9', handle: 'bsky_gulsen', name: 'Gülşen T.', followers: 2300, verified: false, kind: 'kişi', role: 'köprü', stance: 'elestiri', note: 'Konuyu Bluesky\'a taşıyan ilk hesap.' },
    { id: 'u10', handle: 'gidamuhendisi', name: 'Gıda Mühendisi Okan', followers: 41000, verified: false, kind: 'kişi', role: 'savunucu', stance: 'soru', note: 'Üretim sürecini soran, sakinleştirici paylaşımlar.' },
  ],
  'kuzey-havayollari': [
    { id: 'k1', handle: 'seyyah_emre', name: 'Emre Seyyah', followers: 8400, verified: false, kind: 'kişi', role: 'kaynak', stance: 'elestiri', note: 'Ankara seferindeki rötarı ilk duyuran.' },
    { id: 'k2', handle: 'havacilikgundem', name: 'Havacılık Gündem', followers: 72000, verified: false, kind: 'medya', role: 'medya', stance: 'notr', note: 'Rötarı haberleştirdi.' },
    { id: 'k3', handle: 'deniz.ucar', name: 'Deniz Uçar', followers: 1900, verified: false, kind: 'kişi', role: 'savunucu', stance: 'destek', note: 'Kabin ekibine teşekkür paylaşımı.' },
    { id: 'k4', handle: 'bagajimnerde', name: 'Bagajım Nerede', followers: 15000, verified: false, kind: 'kişi', role: 'yükseltici', stance: 'alay', note: 'Mizahi şikâyet hesabı.' },
  ],
  'selin-aktas': [
    { id: 's1', handle: 'kitapkurdu_elif', name: 'Elif Okur', followers: 23000, verified: false, kind: 'kişi', role: 'yükseltici', stance: 'destek', note: 'Kitabı öneren paylaşımı en çok etkileşim alan.' },
    { id: 's2', handle: 'saglikdergisi', name: 'Sağlık Dergisi', followers: 210000, verified: true, kind: 'medya', role: 'medya', stance: 'notr', note: 'Söyleşi yayımladı.' },
    { id: 's3', handle: 'fit_baris', name: 'Barış Fit', followers: 64000, verified: false, kind: 'kişi', role: 'kaynak', stance: 'soru', note: 'Aralıklı oruç önerisini sorgulayan paylaşım.' },
  ],
};

const NARRATIVES = {
  'anadolu-sut': [
    { id: 'yabanci-madde-iddiasi', label: 'Çocuk sütünde yabancı madde iddiası', kind: 'saldırı', at: -2.6, weight: 0.38,
      summary: 'Bir kullanıcının paylaştığı videoda çocuk sütü kutusundan yabancı madde çıktığı ileri sürülüyor; tüketici hakları hesabının alıntısıyla yayıldı.',
      texts: ['Kızımın sütünden bu çıktı, @anadolusut açıklama bekliyorum 😡 video ekte', 'Çocuk sütünden yabancı madde çıkması kabul edilemez. Bu nasıl denetim?', 'arkadaşlar bu videoyu gördünüz mü? anadolu süt kutusundan resmen plastik parçası çıkıyor', 'Yıllardır çocuğuma bunu içiriyorum, midem bulandı açıkçası', 'Tüketici olarak hakkımızı arayalım, bu video çok ciddi', 'Bebek mamasında da aynı firma mı? Biri açıklasın lütfen'] },
    { id: 'boykot-cagrisi', label: '#AnadoluSütBoykot çağrısı', kind: 'saldırı', at: -1.2, weight: 0.24,
      summary: 'Boykot etiketiyle markanın ürünlerinin alınmaması çağrısı yapılıyor; etiket büyük bir fenomen hesabın paylaşımından sonra hızlandı.',
      texts: ['#AnadoluSütBoykot çocuklarımızın sağlığı her şeyden önemli', 'Bugünden itibaren evime Anadolu Süt girmiyor. #AnadoluSütBoykot', 'Markete gittim raflar dolu kimse almıyor 😂 #AnadoluSütBoykot', 'Açıklama yapana kadar boykot! RT RT RT'] },
    { id: 'alay-dalgasi', label: 'Mizah ve alay dalgası', kind: 'saldırı', at: -2.0, weight: 0.14,
      summary: 'İddia üzerine "sürpriz yumurta" benzetmeli şakalar ve capsler paylaşılıyor.',
      texts: ['Anadolu Süt artık kutudan sürpriz çıkarıyor, kinder yumurtaya rakip geldi 🥚', 'kahvaltıda süt içtim içinden lego çıktı, teşekkürler anadolu süt', 'yeni slogan: her yudumda bir macera 😂😂'] },
    { id: 'video-eski', label: 'Video eski, 2019\'dan', kind: 'savunma', at: -0.6, weight: 0.12,
      summary: 'Videonun 2019\'da başka bir ülkede çekildiğini gösteren tersine görsel arama sonuçları paylaşılıyor.',
      texts: ['Arkadaşlar bu video 2019\'dan, tersine arama yaptım, başka bir ülkede çekilmiş. Doğrulamadan paylaşmayın.', 'Video eski çıktı ama kimse düzeltme paylaşmıyor tabii', 'Kanıt: aynı video 2019\'da YouTube\'da var. Linki bırakıyorum.'] },
    { id: 'bakanlik-denetim', label: 'Bakanlığa denetim çağrısı', kind: 'saldırı', at: -0.3, weight: 0.08,
      summary: 'Tarım ve gıda denetiminden sorumlu kuruma fabrikayı denetleme çağrısı yapılıyor.',
      texts: ['@TarimGida bu fabrikayı acilen denetleyin, çocuklar söz konusu', 'Bakanlık neden sessiz? Denetim raporları açıklansın.'] },
    { id: 'fiyat-sikayeti', label: 'Fiyat şikâyeti', kind: 'nötr', at: -24, weight: 0.04,
      summary: 'Süt fiyatlarına dair sıradan şikâyetler; krizle bağlantısı yok.',
      texts: ['Anadolu Süt 1 litre yine zamlanmış, ne oluyor ya', 'süt fiyatları uçtu, bir tek ben mi fark ediyorum'] },
  ],
  'kuzey-havayollari': [
    { id: 'ankara-rotari', label: 'Ankara seferinde rötar', kind: 'saldırı', at: -3.2, weight: 0.55,
      summary: 'Sabah Ankara seferi yaklaşık üç saat gecikti; yolcular bilgilendirme yapılmadığından şikâyetçi.',
      texts: ['3 saattir kapıdayız, kimse bir şey söylemiyor @kuzeyhava', 'Kuzey Havayolları yine rötar, toplantıyı kaçırdım', 'rötar olur anlarım ama bilgi vermemek ne?'] },
    { id: 'bagaj-gecikmesi', label: 'Bagaj gecikmesi', kind: 'saldırı', at: -2.4, weight: 0.2,
      summary: 'Aynı seferde bagajların geç geldiğine dair şikâyetler.',
      texts: ['bagajım nerede kuzey havayolları 🙃', 'Bagaj bandında 50 dakika bekledik'] },
    { id: 'murettebat-ovgusu', label: 'Kabin ekibine teşekkür', kind: 'savunma', at: -1.5, weight: 0.25,
      summary: 'Gecikmeye rağmen kabin ekibinin ilgisini öven paylaşımlar.',
      texts: ['Rötar oldu ama kabin ekibi çok ilgiliydi, teşekkürler', 'Kuzey\'in hosteslerine helal olsun, bebeğimle çok ilgilendiler'] },
  ],
  'selin-aktas': [
    { id: 'yeni-kitap', label: 'Yeni kitap: Sofradaki Denge', kind: 'savunma', at: -20, weight: 0.7,
      summary: 'Yeni kitabın çıkışı; okurlar olumlu yorumlar paylaşıyor.',
      texts: ['Sofradaki Denge elime ulaştı, çok sade ve anlaşılır 📚', 'Selin Hanım\'ın kitabındaki kahvaltı önerileri harika', 'Kitap fuarında imza günü varmış, gidecek olan?'] },
    { id: 'aralikli-oruc', label: 'Aralıklı oruç önerisine soru', kind: 'nötr', at: -6, weight: 0.3,
      summary: 'Kitaptaki aralıklı oruç önerisinin herkese uygun olup olmadığı soruluyor.',
      texts: ['Aralıklı oruç herkes için uygun mu gerçekten? Hamileler ne yapacak?', 'Kitapta aralıklı oruç kısmı biraz genelleyici olmuş gibi'] },
  ],
};

// hacim eğrisi (10 dk'lık dilim başına gönderi), krizin başlangıcına (T0) göre
function volume(clientId, t, T0) {
  const h = (t - T0) / HOUR;
  const noise = 0.75 + rnd(`${clientId}:${Math.floor(t / BUCKET)}`) * 0.5;
  if (clientId === 'anadolu-sut') {
    const base = 5 + 2 * Math.sin((t / HOUR) * Math.PI / 12);
    const crisis = h < 0 ? 0 : 140 * (h / 4.5) ** 1.6 * Math.exp(1.6 * (1 - h / 4.5));
    return Math.max(0, Math.round((base + crisis) * noise));
  }
  if (clientId === 'kuzey-havayollari') return Math.max(0, Math.round((3 + 26 * bump(h, 0.2, 1.1)) * noise));
  return Math.max(0, Math.round((2.5 + 1.5 * Math.sin((t / HOUR) * Math.PI / 8)) * noise));
}
const negShare = (clientId, t, T0) => {
  const h = (t - T0) / HOUR;
  if (clientId === 'anadolu-sut') return h < 0 ? 0.15 : clamp(0.25 + 0.5 * Math.min(1, h / 2) - 0.08 * Math.max(0, h - 5), 0.2, 0.8);
  if (clientId === 'kuzey-havayollari') return clamp(0.2 + 0.4 * bump(h, 0.2, 1.4), 0.15, 0.65);
  return 0.08;
};

const LEVEL = (s) => (s >= 75 ? 'kırmızı' : s >= 55 ? 'turuncu' : s >= 30 ? 'sarı' : 'yeşil');

export function createFakeEngine({ speed = 60, tickMs = 2000, realNow = () => Date.now(), start = Date.UTC(2026, 10, 14, 10, 30) } = {}) {
  const bus = new EventEmitter();
  let sp = speed, baseSim = start, baseReal = realNow(), timer = null, tickNo = 0;
  let mode = 'demo', keys = { anthropic: false, x: false }, aiCalls = 0;
  const now = () => Math.round(baseSim + (realNow() - baseReal) * sp);
  // kriz anları: Anadolu krizi 2,5 saat önce, Kuzey dalgası 1 saat önce başladı
  let T0 = {};
  let clients, items, events, snaps, briefs, hist, seq;

  function reset() {
    baseSim = start; baseReal = realNow(); tickNo = 0; seq = 0;
    T0 = { 'anadolu-sut': start - 2.5 * HOUR, 'kuzey-havayollari': start - 1 * HOUR, 'selin-aktas': start - 30 * HOUR };
    clients = CLIENTS.map((c) => structuredClone(c));
    items = new Map(); events = []; snaps = new Map(); briefs = new Map(); hist = new Map();
    for (const c of clients) seedItems(c.id, start);
    seedEvents();
    for (const c of clients) {
      const h = [];
      for (let t = start - 24 * HOUR; t <= start; t += HOUR) h.push(makeHistory(c.id, t));
      hist.set(c.id, h);
      snaps.set(c.id, build(c.id, start));
    }
  }

  // ---------- gönderiler ----------
  function makeItem(clientId, n, t, key) {
    const ns = NARRATIVES[clientId] || [];
    const authors = AUTHORS[clientId] || [];
    const nar = ns.length ? n || pickWeighted(ns, key) : null;
    const author = pick(authors.length ? authors : [{ id: 'anon', handle: 'anonim', name: 'Anonim', followers: 10, verified: false, kind: 'bilinmiyor' }], key + 'a');
    const src = rnd(key + 's') < 0.72 ? 'x' : rnd(key + 's2') < 0.5 ? 'haber' : 'bluesky';
    const text = nar ? pick(nar.texts, key + 't') : 'Bugün de güzel bir gün.';
    const reach = author.followers;
    const stance = nar?.kind === 'savunma' ? (rnd(key + 'st') < 0.7 ? 'destek' : 'notr')
      : nar?.kind === 'nötr' ? pick(['notr', 'soru', 'elestiri'], key + 'st')
      : pick(['elestiri', 'elestiri', 'alay', 'soru'], key + 'st');
    const id = `${src === 'haber' ? 'haber' : src}:${clientId}-${hash(key).toString(36)}`;
    return { id, source: src, url: src === 'haber' ? 'https://ornek-haber.example/haber/' + hash(key) : src === 'x' ? 'https://x.com/i/status/' + hash(key) : 'https://bsky.app/profile/ornek/post/' + hash(key),
      text, lang: 'tr', createdAt: t,
      author: { id: author.id, handle: author.handle, name: author.name, followers: author.followers, verified: author.verified, createdAt: t - 400 * 24 * HOUR, kind: author.kind },
      metrics: { likes: Math.round(rnd(key + 'l') * reach * 0.02), reposts: Math.round(rnd(key + 'r') * reach * 0.006), replies: Math.round(rnd(key + 'p') * 40), quotes: Math.round(rnd(key + 'q') * 12), views: Math.round(reach * (0.2 + rnd(key + 'v'))) },
      refs: { replyTo: null, quoteOf: null, repostOf: null }, media: rnd(key + 'm') < 0.3, clientId,
      enr: nar ? { stance, emotion: stance === 'alay' ? 'alay' : stance === 'destek' ? 'sevinç' : stance === 'elestiri' ? 'öfke' : 'nötr', narrative: nar.label, claim: nar.kind === 'saldırı', callToAction: nar.id === 'boykot-cagrisi', by: 'yerel' } : null };
  }
  function pickWeighted(ns, key) {
    let r = rnd(key + 'w') * ns.reduce((s, n) => s + n.weight, 0);
    for (const n of ns) { r -= n.weight; if (r <= 0) return n; }
    return ns[0];
  }
  function seedItems(clientId, t) {
    const map = new Map();
    items.set(clientId, map);
    for (const n of NARRATIVES[clientId]) {
      const first = T0[clientId] + Math.max(n.at + 2.5, 0.05) * HOUR * (clientId === 'anadolu-sut' ? 1 : 0.4);
      for (let i = 0; i < 9; i++) {
        const at = Math.min(t - MIN, first + i * 17 * MIN);
        const it = makeItem(clientId, n, at, `${clientId}:${n.id}:${i}`);
        map.set(it.id, it);
      }
    }
  }
  function addFreshItems(clientId, t) {
    const k = clientId === 'anadolu-sut' ? 3 : 1;
    for (let i = 0; i < k; i++) {
      const it = makeItem(clientId, null, t - Math.floor(rnd(`${tickNo}:${i}`) * MIN), `${clientId}:tick${tickNo}:${i}`);
      items.get(clientId)?.set(it.id, it);
    }
  }
  const itemList = (clientId) => [...(items.get(clientId)?.values() || [])];
  const narItems = (clientId, label) => itemList(clientId).filter((i) => i.enr?.narrative === label);

  // ---------- anlık görüntü ----------
  function makeHistory(clientId, t) {
    const s = riskScore(clientId, t);
    let r = 0; for (let k = 0; k < 6; k++) r += volume(clientId, t - k * BUCKET, T0[clientId]);
    return { at: t, risk: s, rate1h: r };
  }
  function riskScore(clientId, t) {
    const h = (t - T0[clientId]) / HOUR;
    if (clientId === 'anadolu-sut') return Math.round(clamp(12 + (h < 0 ? 0 : 76 * Math.min(1, h / 3) - 6 * Math.max(0, h - 7)), 8, 92));
    if (clientId === 'kuzey-havayollari') return Math.round(clamp(10 + 30 * bump(h, 0.4, 1.6), 8, 45));
    return 14;
  }

  function build(clientId, t) {
    const c = clients.find((x) => x.id === clientId);
    if (!c) return null;
    const T = T0[clientId];
    const startB = Math.floor((t - 24 * HOUR) / BUCKET) * BUCKET;
    const series = [];
    for (let b = startB; b <= t; b += BUCKET) {
      const n = volume(clientId, b, T);
      series.push({ t: b, n, reach: Math.round(n * (900 + rnd(`r${b}`) * 4000)), neg: Math.round(n * negShare(clientId, b, T)) });
    }
    const last6 = series.slice(-6).reduce((s, x) => s + x.n, 0);
    const prev6 = series.slice(-12, -6).reduce((s, x) => s + x.n, 0);
    const baseline = clientId === 'anadolu-sut' ? 34 : clientId === 'kuzey-havayollari' ? 18 : 15;
    const z = round((last6 - baseline) / Math.sqrt(baseline + 4), 1);
    const ratio = prev6 ? last6 / prev6 : 1;
    const trend = z > 8 && ratio > 1.15 ? 'patlama' : ratio > 1.1 && z > 2 ? 'yükseliyor' : ratio < 0.88 && z > 1 ? 'sönüyor' : z > 2 ? 'hareketli' : 'sakin';
    const score = riskScore(clientId, t);
    const level = LEVEL(score);
    const ns = (NARRATIVES[clientId] || []).filter((n) => t >= T + n.at * HOUR || n.at < -5);
    const total = ns.reduce((s, n) => s + n.weight, 0) || 1;
    const hrs = (t - T) / HOUR;
    const narratives = ns.map((n) => {
      const its = narItems(clientId, n.label);
      const share = n.weight / total;
      const age = hrs - (n.at + 2.5);
      const status = age < 0.6 ? 'doğuyor' : age < 2.5 ? 'büyüyor' : age < 4 ? 'zirvede' : 'sönüyor';
      const top = [...its].sort((a, b) => (b.metrics.likes + b.metrics.reposts) - (a.metrics.likes + a.metrics.reposts)).slice(0, 4).map((i) => i.id);
      const origin = [...its].sort((a, b) => a.createdAt - b.createdAt)[0];
      const st = n.kind === 'savunma' ? { destek: 0.68, elestiri: 0.06, alay: 0.04, soru: 0.08, notr: 0.14 }
        : n.kind === 'nötr' ? { destek: 0.08, elestiri: 0.3, alay: 0.05, soru: 0.27, notr: 0.3 }
        : { destek: 0.03, elestiri: 0.55, alay: 0.22, soru: 0.12, notr: 0.08 };
      const sumN = series.slice(-12).reduce((s, x) => s + x.n, 0);
      return { id: n.id, label: n.label, summary: n.summary, terms: n.label.toLocaleLowerCase('tr').split(/\s+/).slice(0, 3),
        count: Math.round(sumN * share * 2), share: round(share, 3), reach: Math.round(share * series.slice(-18).reduce((s, x) => s + x.reach, 0)), stance: st,
        firstSeen: Math.min(T + n.at * HOUR, origin?.createdAt ?? Infinity), lastSeen: t - Math.floor(rnd(`ls${n.id}${tickNo}`) * 4 * MIN),
        velocity: round(status === 'doğuyor' ? 2.4 : status === 'büyüyor' ? 1.5 + rnd(`v${n.id}${Math.floor(t / BUCKET)}`) * 0.3 : status === 'zirvede' ? 1.02 : 0.72, 2),
        status, kind: n.kind, risk: n.kind === 'saldırı' ? Math.round(score * (0.6 + share)) % 101 : Math.round(score * 0.2),
        originItemId: origin?.id || null, topItemIds: top,
        series: series.filter((_, i) => i % 3 === 0).map((x) => ({ t: x.t, n: Math.round(x.n * share * (0.8 + rnd(`${n.id}${x.t}`) * 0.4)) })) };
    }).sort((a, b) => b.share - a.share);

    const neg = clientId === 'anadolu-sut' ? negShare(clientId, t, T) : negShare(clientId, t, T);
    const stance = { destek: round((1 - neg) * 0.45, 3), elestiri: round(neg * 0.7, 3), alay: round(neg * 0.3, 3), soru: round((1 - neg) * 0.2, 3) };
    stance.notr = round(1 - stance.destek - stance.elestiri - stance.alay - stance.soru, 3);

    const authors = AUTHORS[clientId] || [];
    const actors = authors.map((a, i) => ({ id: a.id, handle: a.handle, name: a.name, followers: a.followers, verified: a.verified, kind: a.kind, role: a.role,
      items: 1 + Math.round(rnd(a.id + 'n') * 9), reach: Math.round(a.followers * (0.4 + rnd(a.id + 'r'))), engagement: Math.round(a.followers * 0.03 * (1 + rnd(a.id + 'e'))),
      firstAt: T + (i * 18 - 10) * MIN, stance: a.stance, narrativeIds: narratives.slice(0, 2).map((n) => n.id), note: a.note }));

    const firstOf = (nid) => narratives.find((n) => n.id === nid)?.originItemId || null;
    const cascade = clientId === 'anadolu-sut' ? {
      originItemId: firstOf('yabanci-madde-iddiasi'),
      steps: [
        { t: T, itemId: firstOf('yabanci-madde-iddiasi'), kind: 'ilk', note: '@ayse_anne34 videoyu paylaştı (412 takipçi).' },
        { t: T + 25 * MIN, itemId: firstOf('yabanci-madde-iddiasi'), kind: 'sıçrama', note: '@tuketicihaklari alıntıladı; erişim 40 kat arttı.' },
        { t: T + 50 * MIN, itemId: firstOf('alay-dalgasi'), kind: 'büyük-hesap', note: '@mizahbaskisi alay gönderisiyle konuyu mizah kitlesine taşıdı.' },
        { t: T + 80 * MIN, itemId: firstOf('yabanci-madde-iddiasi'), kind: 'medya', note: 'Gündem Haber konuyu haberleştirdi.' },
        { t: T + 95 * MIN, itemId: firstOf('boykot-cagrisi'), kind: 'büyük-hesap', note: '@canberkvlog #AnadoluSütBoykot etiketini paylaştı.' },
        { t: T + 110 * MIN, itemId: null, kind: 'platform-geçişi', note: 'Konu Bluesky\'da da konuşulmaya başladı.' },
        { t: T + 135 * MIN, itemId: firstOf('video-eski'), kind: 'karşı-anlatı', note: '"Video 2019\'dan" karşı anlatısı doğdu.' },
      ].filter((s) => s.t <= t) }
      : clientId === 'kuzey-havayollari' ? { originItemId: firstOf('ankara-rotari'), steps: [
        { t: T - 20 * MIN, itemId: firstOf('ankara-rotari'), kind: 'ilk', note: '@seyyah_emre rötarı duyurdu.' },
        { t: T + 30 * MIN, itemId: null, kind: 'medya', note: 'Havacılık Gündem haberleştirdi.' },
      ].filter((s) => s.t <= t) }
      : { originItemId: null, steps: [] };

    const coordination = clientId === 'anadolu-sut' && hrs > 1.6 ? [
      { id: 'kopya-1', kind: 'kopya-metin', accounts: ['mehmet48291', 'zeynep_k7731', 'ali_v9921', 'hlya_8812', 'krm.4410', 'tuba77612'], itemIds: narratives.find((n) => n.id === 'boykot-cagrisi')?.topItemIds.slice(0, 2) || [], windowMin: 12, score: 0.82, note: 'Altı hesap 12 dakika içinde neredeyse aynı boykot metnini paylaştı.' },
      { id: 'yeni-hesap-1', kind: 'yeni-hesap', accounts: ['mehmet48291', 'zeynep_k7731', 'ali_v9921'], itemIds: [], windowMin: 45, score: 0.61, note: 'Son iki haftada açılmış hesaplardan oluşan küme; takipçi sayıları 20\'nin altında.' },
    ] : [];

    const rate1h = last6;
    const dir = trend === 'sönüyor' ? 'düşüş' : trend === 'yükseliyor' || trend === 'patlama' ? 'artış' : 'yatay';
    const forecast = { next1h: Math.round(rate1h * (dir === 'artış' ? 1.25 : dir === 'düşüş' ? 0.8 : 1)), next3h: Math.round(rate1h * 3 * (dir === 'artış' ? 1.1 : dir === 'düşüş' ? 0.6 : 1)),
      direction: dir, peakAt: clientId === 'anadolu-sut' ? T + 4.5 * HOUR : null, confidence: clientId === 'anadolu-sut' ? 'orta' : 'düşük',
      basis: dir === 'artış' ? 'Son iki saatte hız her saat yaklaşık yarı yarıya arttı; benzer dalgalar 4-6 saatte zirve yapıyor.' : dir === 'düşüş' ? 'Hız iki saattir düşüyor; yeni büyük hesap girişi yok.' : 'Hacim tabana yakın ve dalgalanma yok.' };

    const drivers = clientId === 'anadolu-sut' ? [
      { key: 'hassas-konu', weight: 0.28, note: 'Çocuk sağlığı ve ürün güvenliği konuşuluyor.' },
      { key: 'hacim', weight: 0.24, note: `Saatlik hacim tabanın ${Math.max(1, Math.round(rate1h / baseline))} katı.` },
      { key: 'buyuk-hesap', weight: 0.18, note: '1 milyon üstü takipçili hesap konuya girdi.' },
      { key: 'cagri', weight: 0.16, note: 'Boykot çağrısı yapan gönderiler artıyor.' },
      { key: 'koordinasyon', weight: 0.08, note: 'Kopya metin kümesi var (işaret, kanıt değil).' },
    ] : clientId === 'kuzey-havayollari' ? [
      { key: 'hacim', weight: 0.5, note: 'Tek seferle sınırlı kısa süreli artış.' },
      { key: 'olumsuz-pay', weight: 0.35, note: 'Gönderilerin yarısına yakını şikâyet.' },
    ] : [{ key: 'hacim', weight: 0.2, note: 'Hacim olağan düzeyde.' }];

    const incident = clientId === 'anadolu-sut' && score >= 55 ? { id: 'olay-as-1', startedAt: T, status: hrs > 8 ? 'soğuyor' : 'açık', headline: 'Çocuk sütünde yabancı madde iddiası boykot çağrısına dönüştü' }
      : clientId === 'kuzey-havayollari' && score >= 30 ? { id: 'olay-kh-1', startedAt: T, status: hrs > 1.5 ? 'soğuyor' : 'açık', headline: 'Ankara seferindeki rötar şikâyetleri' } : null;

    const all = itemList(clientId);
    const sources = { x: 0, haber: 0, bluesky: 0 };
    for (const x of series) { sources.x += Math.round(x.n * 0.78); sources.haber += Math.round(x.n * 0.08); sources.bluesky += Math.round(x.n * 0.14); }
    const b = briefs.get(clientId) || {};
    return { clientId, at: t, pulse: { bucketMin: 10, series, rate1h, baseline1h: baseline, z, trend }, stance, narratives, actors, cascade, coordination, forecast,
      risk: { score, level, drivers }, incident, sources, sample: { items: all.length, enriched: all.filter((i) => i.enr).length },
      brief: b.brief === undefined ? defaultBrief(clientId, t) : b.brief, playbook: b.playbook === undefined ? defaultPlaybook(clientId, t) : b.playbook };
  }

  function defaultBrief(clientId, t) {
    if (clientId === 'anadolu-sut') return { at: t - 6 * MIN, by: 'yerel', headline: 'Çocuk sütünde yabancı madde iddiası boykot çağrısına dönüştü; karşı anlatı yeni yeni güç kazanıyor.',
      whatHappened: 'Az takipçili bir hesap, çocuk sütü kutusundan yabancı madde çıktığını gösteren bir video paylaştı. Video kısa sürede tüketici hakları hesabı tarafından alıntılandı ve konu boykot çağrısına evrildi.',
      howItGrew: 'İlk 25 dakikada sessiz kaldı; tüketici hakları hesabının alıntısıyla erişim sıçradı. Mizah hesaplarıyla farklı bir kitleye geçti, ardından haber sitesi ve 1,2 milyon takipçili bir fenomen girdi.',
      whoStarted: '@ayse_anne34 (412 takipçi). Geçmişinde marka hakkında paylaşım yok.',
      whoAmplified: 'En çok etkileşim alanlar: @tuketicihaklari, @canberkvlog ve @mizahbaskisi.',
      whereNow: 'Hacim hâlâ yüksek ama artış hızı yavaşlıyor. "Video 2019\'dan" diyen karşı anlatı payını artırıyor.',
      meaning: 'Konu ürün güvenliği ve çocuk sağlığına dokunduğu için kendiliğinden sönmesini beklemek riskli. Doğrulanmış bir açıklama, karşı anlatının elini güçlendirebilir.',
      watchNext: ['Bakanlık hesabının yanıt verip vermediği', 'Karşı anlatının payının %20\'yi geçip geçmediği', 'Ana akım televizyon kanallarının konuya girmesi'],
      confidence: 'orta', basisNote: 'Sayılar ölçülmüş veriye dayanır; hesap rolleri ve anlatılar okunan 214 gönderilik örnekleme dayanır.' };
    if (clientId === 'kuzey-havayollari') return { at: t - 12 * MIN, by: 'yerel', headline: 'Ankara seferindeki rötar kısa bir şikâyet dalgası yarattı; sönüyor.',
      whatHappened: 'Sabah Ankara seferi yaklaşık üç saat gecikti. Yolcular bilgilendirme yapılmadığından şikâyet etti.', howItGrew: 'Bir yolcunun paylaşımı ve bir havacılık haber hesabıyla sınırlı kaldı.',
      whoStarted: '@seyyah_emre (8.400 takipçi).', whoAmplified: '@havacilikgundem ve @bagajimnerde.', whereNow: 'Hacim tabana dönüyor; kabin ekibini öven paylaşımlar da var.',
      meaning: 'Şu an büyük bir itibar riski görünmüyor; yine de bireysel şikâyetlere tek tek dönüş iyi olur.', watchNext: ['Aynı seferde ikinci bir gecikme olup olmadığı'],
      confidence: 'yüksek', basisNote: 'Az sayıda gönderi var; tümü okundu.' };
    return { at: t - 40 * MIN, by: 'yerel', headline: 'Sakin; yeni kitap olumlu karşılanıyor.', whatHappened: 'Kitabın çıkışından bu yana okur yorumları geliyor.', howItGrew: 'Belirgin bir büyüme yok.',
      whoStarted: '—', whoAmplified: '@kitapkurdu_elif', whereNow: 'Olağan düzey.', meaning: 'Şu an yapılacak bir şey yok.', watchNext: ['Aralıklı oruç önerisine gelen soruların artıp artmadığı'],
      confidence: 'yüksek', basisNote: 'Az sayıda gönderi; tümü okundu.' };
  }
  function defaultPlaybook(clientId, t) {
    if (clientId === 'selin-aktas') return null; // bilerek boş: arayüz null'a dayanmalı
    if (clientId === 'kuzey-havayollari') return { at: t - 12 * MIN, by: 'yerel', posture: 'izle', rationale: 'Dalga kendiliğinden sönüyor; kurumsal açıklama konuyu yeniden büyütebilir.',
      options: [{ name: 'Bireysel dönüş', when: 'Şikâyet eden yolculara', upside: 'Sorunu küçük tutar', risk: 'Düşük', draft: 'Yaşadığınız gecikme için özür dileriz. Rezervasyon kodunuzu DM ile iletirseniz ekibimiz size hemen dönecek.' }],
      doNot: ['Rötarı hava durumuna bağlayan genel bir açıklama yapmayın.'], holdingStatement: '', qna: [], nextCheckMin: 60 };
    return { at: t - 6 * MIN, by: 'yerel', posture: 'yanıtla', rationale: 'Konu çocuk sağlığına dokunuyor ve büyük hesaplar girdi; sessiz kalmak "saklıyorlar" anlatısını besleyebilir. Videonun eski olduğuna dair işaretler var ama henüz doğrulanmadı.',
      options: [
        { name: 'Kısa bekleme açıklaması', when: 'Hemen (ilk 1 saat içinde)', upside: 'Sessizlik algısını kırar, zaman kazandırır.', risk: 'Somut bilgi içermezse "kaçamak" bulunabilir.', draft: 'Paylaşılan videodan haberdarız ve konuyu çok ciddiye alıyoruz. Görüntüdeki ürünün üretim bilgilerini inceliyoruz; sonucu bugün içinde buradan paylaşacağız. Ürünlerimizle ilgili sorularınız için 0850 000 00 00.' },
        { name: 'Bağımsız test daveti', when: 'İnceleme sonucu temiz çıkarsa', upside: 'Güveni üçüncü tarafa dayandırır.', risk: 'Test süresi uzarsa ilgi azalırken konu yeniden açılır.', draft: 'Üretim hattımızı bağımsız bir laboratuvarın incelemesine açıyoruz. Rapor geldiğinde tamamını yayımlayacağız.' },
      ],
      doNot: ['Videoyu paylaşan kişiyi suçlamayın ya da hesabını hedef göstermeyin.', '"Video sahte" demeyin; eski olduğu doğrulanana kadar bu iddiayı markanın ağzından kurmayın.', 'Boykot etiketine doğrudan yanıt vermeyin.'],
      holdingStatement: 'Konudan haberdarız, inceliyoruz; bugün içinde bilgi vereceğiz.',
      qna: [{ q: 'Video gerçek mi?', a: 'Görüntüdeki ürünün üretim kodunu inceliyoruz. Sonucu bugün paylaşacağız.' }, { q: 'Ürünleri toplatacak mısınız?', a: 'İnceleme sonucuna göre gerekirse hiç beklemeden toplatırız; tüketici güvenliği önceliğimiz.' }],
      nextCheckMin: 30 };
  }

  function seedEvents() {
    const T = T0['anadolu-sut'];
    const add = (clientId, at, kind, level, title, detail) => events.push({ id: `e${++seq}`, clientId, at, kind, level, title, detail });
    add('selin-aktas', start - 20 * HOUR, 'yeni-anlatı', 'bilgi', 'Yeni anlatı: Yeni kitap: Sofradaki Denge', 'Kitabın çıkışıyla ilgili okur paylaşımları.');
    add('kuzey-havayollari', T0['kuzey-havayollari'] - 20 * MIN, 'yeni-anlatı', 'bilgi', 'Yeni anlatı: Ankara seferinde rötar', 'Bir yolcu üç saatlik gecikmeyi duyurdu.');
    add('anadolu-sut', T + 20 * MIN, 'yeni-anlatı', 'bilgi', 'Yeni anlatı: Çocuk sütünde yabancı madde iddiası', 'Az takipçili bir hesap video paylaştı.');
    add('kuzey-havayollari', T0['kuzey-havayollari'] + 10 * MIN, 'risk-yükseldi', 'dikkat', 'Risk sarıya çıktı', 'Şikâyet hacmi tabanın üç katı.');
    add('anadolu-sut', T + 28 * MIN, 'büyük-hesap', 'dikkat', '@tuketicihaklari konuya girdi', '186 bin takipçili hesap videoyu alıntıladı.');
    add('anadolu-sut', T + 52 * MIN, 'olay-açıldı', 'alarm', 'Olay açıldı: yabancı madde iddiası', 'Risk turuncuya çıktı; hacim tabanın 5 katı.');
    add('anadolu-sut', T + 82 * MIN, 'medya-girdi', 'dikkat', 'Gündem Haber konuyu haberleştirdi', 'İlk haber sitesi girişi.');
    add('anadolu-sut', T + 96 * MIN, 'risk-yükseldi', 'alarm', 'Risk kırmızıya çıktı', 'Büyük fenomen boykot etiketini paylaştı.');
    add('anadolu-sut', T + 104 * MIN, 'koordinasyon', 'dikkat', 'Kopya metin kümesi', 'Altı yeni hesap 12 dakikada aynı metni paylaştı.');
    add('kuzey-havayollari', T0['kuzey-havayollari'] + 70 * MIN, 'olay-soğudu', 'bilgi', 'Rötar dalgası soğuyor', 'Hız iki saattir düşüyor.');
    add('anadolu-sut', T + 140 * MIN, 'karşı-anlatı', 'bilgi', 'Karşı anlatı: Video eski, 2019\'dan', 'Videonun eski olduğunu gösteren paylaşımlar.');
    add('anadolu-sut', start - 5 * MIN, 'not-yenilendi', 'bilgi', 'Durum notu yenilendi', 'Duruş: yanıtla.');
  }

  // ---------- zaman akışı ----------
  const TICK_EVENTS = [
    ['anadolu-sut', 'anlatı-büyüyor', 'dikkat', '#AnadoluSütBoykot çağrısı büyüyor', 'Son bir saatte 1,6 kat arttı.'],
    ['anadolu-sut', 'büyük-hesap', 'alarm', '@unluoyuncu_x boykot gönderisini alıntıladı', '2,1 milyon takipçili hesap.'],
    ['kuzey-havayollari', 'risk-düştü', 'bilgi', 'Risk yeşile yaklaşıyor', 'Şikâyet hızı tabana indi.'],
    ['anadolu-sut', 'zirve', 'dikkat', 'Hacim zirveye yakın', 'Saatlik hız son 24 saatin en yükseği.'],
    ['selin-aktas', 'medya-girdi', 'bilgi', 'Sağlık Dergisi söyleşi yayımladı', 'Olumlu ton.'],
    ['anadolu-sut', 'karşı-anlatı', 'bilgi', 'Karşı anlatı güçleniyor', '"Video eski" payı %12\'ye çıktı.'],
  ];
  function tick() {
    tickNo++;
    const t = now();
    for (const c of clients) {
      addFreshItems(c.id, t);
      const s = build(c.id, t);
      snaps.set(c.id, s);
      const h = hist.get(c.id) || [];
      if (!h.length || t - h.at(-1).at >= 10 * MIN) { h.push(makeHistory(c.id, t)); while (h.length && h[0].at < t - 24 * HOUR) h.shift(); hist.set(c.id, h); }
      bus.emit('snapshot', s);
    }
    if (tickNo % 4 === 0) {
      const [clientId, kind, level, title, detail] = TICK_EVENTS[(tickNo / 4 - 1) % TICK_EVENTS.length];
      if (clients.some((c) => c.id === clientId)) {
        const ev = { id: `e${++seq}`, clientId, at: t, kind, level, title, detail };
        events.push(ev);
        bus.emit('event', ev);
      }
    }
    bus.emit('status', api.status());
  }

  const api = {
    on: (evt, fn) => { bus.on(evt, fn); },
    off: (evt, fn) => { bus.off(evt, fn); },
    async start() { if (timer) return; timer = setInterval(tick, tickMs); timer.unref?.(); },
    stop() { clearInterval(timer); timer = null; },
    status: () => ({ mode, ai: keys.anthropic ? 'claude' : 'yerel', clock: { now: now(), speed: sp },
      sources: mode === 'demo' ? [{ id: 'sim', label: 'Simülasyon', lastError: null }]
        : [{ id: 'x', label: 'X', lastError: keys.x ? null : 'X token\'ı girilmedi.' }, { id: 'haber', label: 'Haber', lastError: null }, { id: 'bluesky', label: 'Bluesky', lastError: null }],
      aiUsage: { calls: aiCalls, inputTokens: aiCalls * 1800, outputTokens: aiCalls * 420 }, lastError: null, keys: { ...keys } }),
    clients: () => clients.map((c) => structuredClone(c)),
    addClient(def) {
      const name = String(def?.name || '').trim();
      if (!name) throw new Error('Danışan adı gerekli.');
      const list = (v) => (Array.isArray(v) ? v : String(v || '').split(/[,\n]/)).map((x) => String(x).trim()).filter(Boolean);
      const id = name.toLocaleLowerCase('tr').replace(/[^a-z0-9ğüşıöç]+/g, '-').replace(/^-|-$/g, '') || 'danisan';
      const c = { id, name, kind: def.kind || 'marka', terms: list(def.terms).length ? list(def.terms) : [name], sensitivities: list(def.sensitivities), rivals: list(def.rivals), note: def.note || '' };
      clients = clients.filter((x) => x.id !== id).concat(c);
      items.set(id, new Map()); T0[id] = now() - 30 * HOUR; hist.set(id, []);
      briefs.set(id, { brief: null, playbook: null });
      snaps.set(id, null); // ilk turda dolar
      return structuredClone(c);
    },
    removeClient(id) { clients = clients.filter((c) => c.id !== id); snaps.delete(id); events = events.filter((e) => e.clientId !== id); },
    snapshot: (id) => snaps.get(id) || null,
    history: (id) => [...(hist.get(id) || [])],
    events: (id, { limit = 100 } = {}) => events.filter((e) => !id || e.clientId === id).sort((a, b) => b.at - a.at).slice(0, limit),
    items(id, { ids, narrative, authorId, order = 'new', limit = 50 } = {}) {
      const nlabel = narrative && (NARRATIVES[id] || []).find((n) => n.id === narrative || n.label === narrative)?.label;
      let list = itemList(id).filter((i) => i.createdAt <= now() + 1);
      if (ids?.length) list = list.filter((i) => ids.includes(i.id));
      if (narrative) list = list.filter((i) => i.enr?.narrative === (nlabel || narrative));
      if (authorId) list = list.filter((i) => i.author.id === authorId);
      list.sort(order === 'top' ? (a, b) => (b.metrics.likes + b.metrics.reposts * 2) - (a.metrics.likes + a.metrics.reposts * 2) : (a, b) => b.createdAt - a.createdAt);
      return list.slice(0, limit).map((i) => structuredClone(i));
    },
    async ask(id, question) {
      aiCalls++;
      const s = snaps.get(id); const q = String(question).toLocaleLowerCase('tr');
      if (!s) return 'Bu danışan için henüz veri yok.';
      if (q.includes('başlat')) return s.actors.find((a) => a.role === 'kaynak') ? `İlk paylaşan @${s.actors.find((a) => a.role === 'kaynak').handle}. Erişim, @${s.actors.find((a) => a.role === 'yükseltici')?.handle || '—'} alıntılayınca sıçradı. (Rol ataması okunan örnekleme dayanır.)` : 'Belirgin bir başlatıcı yok; konuşma dağınık.';
      if (q.includes('bot')) return s.coordination.length ? `${s.coordination.length} koordinasyon işareti var; en güçlüsü: ${s.coordination[0].note} Bu bir kanıt değil, dikkat edilmesi gereken bir işaret.` : 'Koordinasyon işareti görünmüyor.';
      if (q.includes('ne zaman') || q.includes('sön')) return `Tahmin: ${s.forecast.basis} Güven: ${s.forecast.confidence}.`;
      if (q.includes('yapmalı')) return s.playbook ? `Önerilen duruş: ${s.playbook.posture}. ${s.playbook.rationale}` : 'Şu an için yalnızca izlemeyi öneriyorum.';
      return 'Bu soruyu yerel modda yanıtlayamıyorum; ayrıntılı yorum için Claude anahtarı gerekli.';
    },
    async refreshBrief(id) {
      const t = now(); aiCalls++;
      briefs.set(id, { brief: { ...defaultBrief(id, t), at: t }, playbook: defaultPlaybook(id, t) && { ...defaultPlaybook(id, t), at: t } });
      const s = build(id, t); if (!s) return null;
      snaps.set(id, s);
      const ev = { id: `e${++seq}`, clientId: id, at: t, kind: 'not-yenilendi', level: 'bilgi', title: 'Durum notu yenilendi', detail: s.playbook ? `Duruş: ${s.playbook.posture}.` : '' };
      events.push(ev); bus.emit('event', ev); bus.emit('snapshot', s);
      return s;
    },
    setSpeed(n) { baseSim = now(); baseReal = realNow(); sp = Math.max(1, Math.min(600, Number(n) || 60)); bus.emit('status', api.status()); },
    async restartDemo() { reset(); bus.emit('status', api.status()); for (const c of clients) bus.emit('snapshot', snaps.get(c.id)); },
    async setMode(m) { if (m !== 'demo' && m !== 'canlı') throw new Error('Mod demo ya da canlı olmalı.'); mode = m; bus.emit('status', api.status()); },
    setKeys({ anthropicKey, xToken } = {}) {
      if (anthropicKey !== undefined) keys.anthropic = !!anthropicKey;
      if (xToken !== undefined) keys.x = !!xToken;
      bus.emit('status', api.status());
    },
  };
  reset();
  return api;
}

// doğrudan çalıştırma: sahte motorla sunucu
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { createServer } = await import('../src/server.js');
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const engine = createFakeEngine({ speed: Number(process.env.PUSULA_SPEED || 60) });
  const port = Number(process.env.PORT || 4400);
  const app = createServer(engine, { port, publicDir: join(root, 'public') });
  await app.listen();
  await engine.start();
  console.log(`Pusula (sahte motor, DEMO veri) http://localhost:${port}`);
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { engine.stop(); app.close().then(() => process.exit(0)); });
}
