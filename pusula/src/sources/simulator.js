// Demo dünyası: tohumlu (deterministik), anchor = ana krizin başladığı an. Her şey uydurmadır.
import { FAM, GENERIC, CLUSTER_TEXTS, FIRST, LAST, NICK_A, NICK_B, NAME_EMOJI } from './sim-texts.js';

const MIN = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const START_H = -26; // dünya anchor'dan 26 saat önce başlar
const DEMO_URL = 'https://demo.pusula.example';

// ---------------------------------------------------------------- yardımcılar
export function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
export function mulberry32(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
function wpick(rng, pairs) {
  let sum = 0;
  for (const p of pairs) sum += p[1];
  let u = rng() * sum;
  for (const p of pairs) { u -= p[1]; if (u <= 0) return p[0]; }
  return pairs[pairs.length - 1][0];
}
const gauss = (rng) => Math.sqrt(-2 * Math.log(1 - rng())) * Math.cos(2 * Math.PI * rng());
function poisson(rng, lambda) {
  if (lambda <= 0) return 0;
  if (lambda > 30) return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * gauss(rng)));
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do { k++; p *= rng(); } while (p > L);
  return k - 1;
}
// Doğrusal ara değerleme: pts = [[t, değer], ...]
function interp(pts, t) {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (t <= pts[i][0]) {
      const [t0, v0] = pts[i - 1];
      const [t1, v1] = pts[i];
      return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
    }
  }
  return pts[pts.length - 1][1];
}
// "{a|b|}" seçeneklerini açar (iç içe olabilir)
export function expand(tpl, rng) {
  let s = tpl;
  for (let guard = 0; guard < 40; guard++) {
    const m = /\{([^{}]*)\}/.exec(s);
    if (!m) break;
    s = s.slice(0, m.index) + pick(rng, m[1].split('|')) + s.slice(m.index + m[0].length);
  }
  return s;
}
const ASCII = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', Ç: 'C', Ğ: 'G', İ: 'I', Ö: 'O', Ş: 'S', Ü: 'U', â: 'a' };
const asciify = (s) => s.replace(/[çğıöşüÇĞİÖŞÜâ]/g, (c) => ASCII[c]);
const lowerTr = (s) => s.toLocaleLowerCase('tr');
const endsPunct = (s) => /[.!?…:;,)"'”]$/u.test(s) || /\p{Extended_Pictographic}️?$/u.test(s);

// Yazarın yazım alışkanlığını metne uygular (etiket ve @anmalar korunur)
function applyStyle(text, style, rng) {
  if (style === 'duz') return text;
  const tr = (fn) => text.split(/(\s+)/).map((w) => (/^[#@]/.test(w) || /^https?:/.test(w) ? w : fn(w))).join('');
  if (style === 'kucuk') return tr(lowerTr).replace(/\.$/, '');
  if (style === 'ascii') { const t = tr(asciify); return rng() < 0.5 ? t.split(/(\s+)/).map((w) => (/^[#@]/.test(w) ? w : w.toLowerCase())).join('') : t; }
  if (style === 'bagiran') return text.length < 90 && rng() < 0.6 ? tr((w) => w.toLocaleUpperCase('tr')) + (/[.!?]$/.test(text) ? '' : '!!') : text.replace(/\.$/, '!!');
  // gevşek: küçük harf + gündelik yazım
  let t = tr(lowerTr).replace(/\.$/, '');
  const rep = [[/bir şey/g, 'bişey', 0.7], [/herkes/g, 'herkez', 0.5], [/yalnız/g, 'yanlız', 0.6], [/değil/g, 'diil', 0.3],
    [/yor(?![\p{L}])/gu, 'yo', 0.45], [/ çok /g, ' çoook ', 0.2], [/'/g, '', 0.6], [/ ya(?![\p{L}])/gu, ' yaa', 0.3], [/hiçbir/g, 'hiç bi', 0.4]];
  for (const [re, to, p] of rep) if (rng() < p) t = t.replace(re, to);
  return t;
}

// ---------------------------------------------------------------- danışanlar
export function demoClients() {
  return [
    { id: 'anadolu-sut', name: 'Anadolu Süt', kind: 'marka', terms: ['Anadolu Süt', '@anadolusut', '#AnadoluSüt'],
      sensitivities: ['ürün güvenliği', 'çocuk sağlığı', 'gıda denetimi'], rivals: ['Trakya Süt'],
      note: 'Süt ve süt ürünleri üreticisi; çocuk sütü serisi en bilinen ürünü. (Uydurma demo danışanı)' },
    { id: 'kuzey-havayollari', name: 'Kuzey Havayolları', kind: 'marka', terms: ['Kuzey Havayolları', '@kuzeyhavayollari', '#KuzeyHavayolları'],
      sensitivities: ['uçuş güvenliği', 'rötar ve iptal', 'yolcu hakları'], rivals: ['Ege Kanat'],
      note: 'İç hat ağırlıklı havayolu. (Uydurma demo danışanı)' },
    { id: 'selin-aktas', name: 'Dr. Selin Aktaş', kind: 'kişi', terms: ['Selin Aktaş', '@drselinaktas', 'Tabağımdaki Denge'],
      sensitivities: ['bilimsel güvenilirlik', 'sağlık tavsiyesi'], rivals: [],
      note: 'Diyetisyen ve yazar; yeni kitabı "Tabağımdaki Denge" bu hafta çıktı. (Uydurma demo danışanı)' },
  ];
}

// ---------------------------------------------------------------- senaryolar
const acct = (handle, name, followers, kind = 'kişi', verified = false, ageDays = 1500) => ({ handle, name, followers, kind, verified, ageDays });
const MEDIA = {
  gundem: { site: 'gundemhatti.example', ...acct('gundemhatti', 'Gündem Hattı', 312000, 'medya', true, 4100) },
  marmara: { site: 'marmarapostasi.example', ...acct('marmarapostasi', 'Marmara Postası', 188000, 'medya', true, 3600) },
  kent: { site: 'kentgundemi.example', ...acct('kentgundemi', 'Kent Gündemi', 96000, 'medya', true, 2900) },
  ekonomi: { site: 'ekonominotu.example', ...acct('ekonominotu', 'Ekonomi Notu', 141000, 'medya', true, 3300) },
  bulten: { site: 'bultenajansi.example', ...acct('bultenajansi', 'Bülten Ajansı', 74000, 'medya', true, 2500) },
};
const m = (likes, reposts, replies, quotes, views) => ({ likes, reposts, replies, quotes, views });
const lg = (mid, w) => ({ k: 'log', mid: mid * MIN, w: w * MIN });

const A_OFFICIAL = acct('anadolusut', 'Anadolu Süt', 96400, 'kurum', true, 4300);
const A_ORIGIN = acct('elifin_defteri', 'Elif 🌿', 412, 'kişi', false, 2260);
const A_RIGHTS = acct('tuketicinobeti', 'Tüketici Nöbeti', 86200, 'kurum', true, 2900);

const ANADOLU = {
  bg: (t) => 22 * (1 + 0.28 * Math.sin((t + 3) / 3.8)),
  wave: (t) => interp([[0, 0], [0.05, 10], [0.5, 35], [0.75, 75], [1.5, 150], [2.5, 250], [3, 320], [3.6, 470], [4.5, 590], [5.5, 750],
    [6, 810], [6.5, 770], [7.5, 630], [8.5, 500], [10, 340], [13, 170], [18, 70], [26, 25], [40, 6], [60, 0]], t),
  bgPool: 900, wavePool: 3400, tagAfter: 4.2, tag: '#AnadoluSütBoykot', blueskyFrom: 2.15,
  bgFams: [['a.fiyat', 3], ['a.tarif', 2.6], ['a.reklam', 1.8], ['a.siradan', 3]],
  waveFams: (t) => [
    ['a.ilktepki', Math.max(0.15, 3 - t)], ['a.kaygi', t < 6.4 ? 2.2 : 1.6], ['a.soru', 1.2], ['a.kizgin', t > 0.5 ? 1.6 : 0.5],
    ['a.sessizlik', t < 1.2 ? 0 : Math.min(1.8, (t - 1.2) * 0.5)], ['a.alay', t < 1.6 ? 0.1 : t < 4.5 ? 3 : 1.8],
    ['a.haberpay', t < 2.9 ? 0 : 0.9], ['a.benzer', t < 1.5 ? 0.1 : 0.7], ['a.rakip', t < 2.5 ? 0 : 0.5],
    ['a.boykot', t < 4.2 ? (t > 2 ? 0.2 : 0) : Math.min(3.2, 1 + (t - 4.2) * 1.5)], ['a.savunma', t < 1 ? 0.05 : t < 6.35 ? 0.45 : 1.3],
    ['a.eski', t < 6.36 ? 0 : t < 8 ? 2.6 : 1.8], ['a.itiraz', t < 6.6 ? 0 : 1.5], ['a.bakanlik', t < 3 ? 0.05 : t < 7.5 ? 0.5 : 2.6],
  ],
  lean: {
    kaygili: { 'a.kaygi': 2.2, 'a.ilktepki': 1.5, 'a.soru': 1.3, 'a.boykot': 1.2, 'a.alay': 0.3, 'a.savunma': 0.3, 'a.eski': 0.6 },
    alayci: { 'a.alay': 3.5, 'a.sessizlik': 1.3, 'a.rakip': 1.5, 'a.kaygi': 0.2, 'a.savunma': 0.3 },
    ofkeli: { 'a.kizgin': 2.5, 'a.boykot': 2.2, 'a.sessizlik': 1.8, 'a.bakanlik': 1.8, 'a.itiraz': 1.8, 'a.savunma': 0.05, 'a.eski': 0.1, 'a.alay': 0.5 },
    savunucu: { 'a.savunma': 12, 'a.eski': 5, 'a.soru': 1, '*': 0.08 },
    merakli: { 'a.soru': 3, 'a.haberpay': 2.5, 'a.eski': 1.5, 'a.bakanlik': 1.2, 'a.kizgin': 0.4, 'a.boykot': 0.5 },
  },
  to: {
    'a.ilktepki': ['origin', 'rights'], 'a.kaygi': ['origin', 'rights', 'influencer', 'a.kaygi', 'haber'], 'a.soru': ['origin', 'rights', 'haber', 'eskikey'],
    'a.kizgin': ['origin', 'rights', 'influencer', 'promo', 'haber', 'a.kizgin'], 'a.sessizlik': ['promo', 'rights', 'haber'],
    'a.alay': ['mock', 'promo', 'origin', 'a.alay'], 'a.haberpay': ['haber'], 'a.benzer': ['origin', 'rights', 'influencer'],
    'a.rakip': ['mock', 'influencer', 'boykotkey'], 'a.boykot': ['boykotkey', 'influencer', 'rights', 'a.boykot', 'origin'],
    'a.savunma': ['origin', 'rights', 'influencer', 'boykotkey', 'mock'], 'a.eski': ['eskikey', 'origin', 'boykotkey', 'a.eski'],
    'a.itiraz': ['eskikey', 'a.eski', 'originreply'], 'a.bakanlik': ['bakanlikkey', 'rights', 'haber', 'a.bakanlik'],
  },
  modes: { 'a.ilktepki': [0.2, 0.62, 0.1, 0.08], 'a.sessizlik': [0.4, 0.42, 0.12, 0.06], 'a.haberpay': [0.3, 0.1, 0.35, 0.25], '*': [0.44, 0.28, 0.13, 0.15] },
  script: [
    { at: -1290, who: A_OFFICIAL, text: 'Güne taze başlayanlara günaydın ☀️ Bugün sofranızda hangi Anadolu Süt lezzeti var?', final: m(180, 14, 22, 3, 41000), media: true, fam: 'a.reklam' },
    { at: -900, news: MEDIA.ekonomi, title: "Anadolu Süt, Balıkesir'deki tesisine yeni dolum hattı kuruyor", summary: 'Şirketten yapılan açıklamada yatırımın yıl sonuna kadar tamamlanacağı ve 120 kişilik ek istihdam sağlanacağı belirtildi.' },
    { at: -540, who: A_OFFICIAL, text: "Yeni reklam filmimiz yayında 🎬 'Sabah olmadan sofrada.' İzlemeyenler için bağlantı profilimizde. #AnadoluSüt", final: m(640, 96, 58, 21, 190000), media: true, fam: 'a.reklam', tags: ['a.reklam'] },
    { at: -150, who: A_OFFICIAL, text: 'Hafta sonu tarifi: Anadolu Süt kremasıyla fırın sütlaç 🍮 Tarif görselde, deneyenler yorumlara yazsın.', final: m(310, 40, 31, 5, 88000), media: true, fam: 'a.tarif' },
    // --- kriz ---
    { at: 0, key: 'origin', who: A_ORIGIN, media: true, fam: 'a.kaygi', curve: lg(250, 55), final: m(21000, 8200, 2300, 3100, 3400000), tags: ['origin'],
      text: 'Kızıma her sabah içirdiğim Anadolu Süt çocuk sütünün içinden bu çıktı. Plastik mi, ne olduğunu anlamadım. Videoyu çektim, kutu da duruyor. Kızım yarısını içmişti 😔 @anadolusut bir açıklama bekliyorum.' },
    { at: 41, key: 'rights', who: A_RIGHTS, quote: 'origin', fam: 'a.kizgin', curve: lg(150, 60), final: m(9400, 5200, 640, 410, 1100000), tags: ['rights'],
      text: 'Çocuk sütünden yabancı madde çıktığı iddiası. Anadolu Süt ürünü, video ortada, tüketici kutuyu saklıyor. @anadolusut derhal açıklama yapmalı: hangi parti, hangi tesis, ne önlem alındı? Benzer durum yaşayan bize yazsın.' },
    { at: 70, key: 'promo', who: A_OFFICIAL, media: true, fam: 'a.reklam', curve: lg(200, 80), final: m(240, 18, 1900, 520, 800000), tags: ['promo'],
      text: 'Güne Anadolu Süt ile başlayanlar burada mı? ☀️ Kahvaltı sofralarınızdan kareleri bekliyoruz. #GünaydınAnadolu' },
    { at: 95, key: 'mock', who: acct('biyiklitostcu', 'Bıyıklı Tostçu', 642000, 'kişi', true, 3100), fam: 'a.alay', curve: lg(120, 50), final: m(38000, 6100, 900, 1500, 4200000), tags: ['mock'],
      text: "Anadolu Süt'ün yeni sloganı hazır: “İçinde ne olduğunu biz de bilmiyoruz.” 🥛" },
    { at: 128, key: 'bsky', source: 'bluesky', who: acct('denizinnotlari.bsky.social', 'Deniz Erkmen', 9100, 'kişi', false, 700), fam: 'a.sessizlik', final: m(410, 160, 38, 22, 0), tags: ['bsky'],
      text: 'Öbür tarafta sabahtan beri Anadolu Süt konuşuluyor: bir anne çocuk sütünden yabancı madde çıktığını söyleyen bir video paylaştı, mizah hesapları da devraldı. Şirket henüz tek kelime etmedi. Buraya da not düşeyim.' },
    { at: 150, key: 'anneler', who: acct('mahalleanneleri', 'Mahalle Anneleri Ağı', 23400, 'kişi', false, 1900), fam: 'a.kaygi', final: m(1900, 720, 310, 90, 260000), tags: ['a.kaygi'],
      text: 'Üyelerimizden çok soru geliyor: Anadolu Süt çocuk sütü içirmeye devam edelim mi? Elimizde videodan başka bilgi yok. Firma açıklama yapana kadar kararı size bırakıyoruz; açılmamış kutuları ve fişleri saklayın.' },
    { at: 172, news: MEDIA.gundem, key: 'haber1', title: 'Çocuk sütünden yabancı madde çıktığı iddiası sosyal medyada gündem oldu',
      summary: "Bir annenin paylaştığı videoda Anadolu Süt marka çocuk sütünün içinden plastik benzeri bir parça çıktığı öne sürüldü. Paylaşım kısa sürede binlerce kez yayıldı. Anadolu Süt'e ulaşılamadı." },
    { at: 175, key: 'haberx1', who: MEDIA.gundem, fam: 'a.haberpay', final: m(2600, 1400, 520, 380, 610000), tags: ['haber'],
      text: "Çocuk sütünden yabancı madde çıktığı iddiası gündem oldu. Bir annenin videosu binlerce kez paylaşıldı; Anadolu Süt'ten henüz açıklama yok. gundemhatti.example/h/41872" },
    { at: 190, news: MEDIA.marmara, title: "Anadolu Süt'e tepki yağdı: 'Çocuğuma içirdim' paylaşımı binlerce kez yayıldı",
      summary: 'Tüketici Nöbeti adlı dernek şirketi açıklama yapmaya çağırdı. Sosyal medyada pek çok ebeveyn evdeki ürünleri kullanmadığını yazdı. Şirketten konuya ilişkin açıklama gelmedi.' },
    { at: 196, who: MEDIA.marmara, fam: 'a.haberpay', final: m(980, 510, 190, 120, 240000), tags: ['haber'],
      text: "Anadolu Süt'e tepki büyüyor. 'Çocuğuma içirdim' diyen annenin videosu gündemde, şirket sessiz. marmarapostasi.example/gundem/9930" },
    { at: 212, key: 'influencer', who: acct('minikadimlaranne', 'Minik Adımlar | Anne Günlüğü', 1240000, 'kişi', true, 2700), quote: 'origin', fam: 'a.kaygi', curve: lg(130, 55),
      final: m(61000, 14500, 3900, 2100, 7800000), tags: ['influencer'],
      text: 'İki çocuğuma da yıllardır Anadolu Süt içiriyorum. Bu videoyu izleyince elim ayağım buz kesti. Kimseyi peşinen suçlamak istemem ama bir çocuk ürününde beş saat susulmaz. @anadolusut lütfen çıkıp ne olduğunu anlatın. Açıklama gelene kadar bizim evde o kutular açılmayacak.' },
    { at: 236, news: MEDIA.kent, title: 'Fenomen anne de paylaştı: Anadolu Süt tartışması büyüyor',
      summary: 'Bir milyondan fazla takipçisi olan anne günlüğü hesabı videoyu alıntılayarak şirketi açıklama yapmaya çağırdı. Paylaşım bir saat içinde on binlerce beğeni aldı.' },
    { at: 252, key: 'boykotkey', who: acct('sofradakihak', 'Sofradaki Hak', 28600, 'kişi', false, 1300), fam: 'a.boykot', curve: lg(140, 60), final: m(12500, 9800, 700, 900, 1500000), tags: ['boykotkey'],
      text: 'Dört saat oldu. Çocuk sütüyle ilgili bir iddiaya dört saattir cevap vermeyen firmaya verilecek cevap bellidir: açıklama gelene kadar Anadolu Süt almıyoruz. Katılan etiketi kullansın. #AnadoluSütBoykot' },
    { at: 330, news: MEDIA.ekonomi, title: "Anadolu Süt'e boykot çağrısı: Şirketten açıklama bekleniyor",
      summary: "'#AnadoluSütBoykot' etiketi kısa sürede en çok konuşulanlar arasına girdi. Perakende kaynakları bazı marketlerde iade taleplerinin başladığını belirtti. Şirket yetkilileri sorularımızı yanıtsız bıraktı." },
    { at: 345, key: 'veri', who: acct('veriylebak', 'Veriyle Bak', 18300, 'kişi', false, 1700), fam: 'a.soru', final: m(3100, 1300, 240, 310, 420000), tags: ['a.eski'],
      text: '#AnadoluSütBoykot etiketine baktım. Tepkinin büyük kısmı sıradan kullanıcılardan geliyor; ama saat başında, 15 dakika içinde aynı cümleyi paylaşan onlarca hesap var ve çoğu son iki ayda açılmış. Bu kısım organik durmuyor. Gerisi için aynısını söyleyemem.' },
    { at: 352, who: MEDIA.ekonomi, fam: 'a.haberpay', final: m(760, 420, 130, 95, 180000), tags: ['haber'],
      text: "Anadolu Süt'e boykot çağrısı büyüyor. Marketlerde iade talepleri başladı, şirket sorularımızı yanıtlamadı. ekonominotu.example/sirketler/5521" },
    { at: 380, key: 'eskikey', who: acct('kaynakkontrol', 'Kaynak Kontrol', 45200, 'kişi', true, 2100), quote: 'origin', fam: 'a.eski', curve: lg(90, 45), final: m(14800, 7900, 2100, 1700, 2300000), tags: ['eskikey'],
      text: "Dolaşımdaki Anadolu Süt videosunu inceledik. Çok benzer bir görüntü Mart 2019'da, başka bir başlıkla paylaşılmış; kareleri yan yana koyduk. Bugünkü paylaşımın aynı kayıt olup olmadığını henüz kesinleştiremedik. İddia sahibine ulaşmaya çalışıyoruz. Video 2019'dan olabilir." },
    { at: 395, key: 'originreply', who: A_ORIGIN, quote: 'eskikey', fam: 'a.itiraz', curve: lg(100, 50), final: m(8900, 3600, 1200, 800, 1300000), tags: ['originreply'],
      text: 'Video benim, dün akşam kendi mutfağımda çektim. 2019 falan değil. Kutu da fiş de duruyor, son kullanma tarihi önümüzdeki ay. İsteyen kuruma, laboratuvara teslim etmeye hazırım. Anadolu Süt hâlâ beni aramadı.' },
    { at: 420, news: MEDIA.bulten, title: "'Yabancı madde' videosu eski mi? Sosyal medyada iki ayrı iddia",
      summary: "Bir doğrulama hesabı görüntünün 2019'da da dolaşımda olduğunu öne sürdü; videoyu paylaşan anne ise kaydın yeni olduğunu, ürünü teslim etmeye hazır olduğunu söyledi. Anadolu Süt sessizliğini koruyor." },
    { at: 450, key: 'bakanlikkey', who: A_RIGHTS, fam: 'a.bakanlik', curve: lg(110, 50), final: m(7200, 4900, 520, 460, 900000), tags: ['bakanlikkey'],
      text: 'Anadolu Süt çocuk sütü için Bakanlığa resmî başvurumuzu yaptık: ilgili partiden numune alınmasını ve tesisin denetlenmesini istedik. Video eski de olsa yeni de olsa bunu söyleyecek olan laboratuvardır. Siz de il müdürlüklerine başvurabilirsiniz.' },
    { at: 470, news: MEDIA.gundem, title: 'Tüketici derneği Anadolu Süt için Bakanlığa başvurdu',
      summary: 'Tüketici Nöbeti, çocuk sütüne ilişkin iddiaların ardından numune alınmasını ve üretim tesisinin denetlenmesini talep etti. Bakanlıktan henüz açıklama yapılmadı.' },
    { at: 476, who: MEDIA.gundem, fam: 'a.haberpay', final: m(1500, 860, 210, 140, 330000), tags: ['haber'],
      text: 'Tüketici derneği Anadolu Süt için Bakanlığa başvurdu: numune alınması ve denetim istendi. gundemhatti.example/h/41911' },
    { at: 520, who: acct('av_nehirtoprak', 'Av. Nehir Toprak', 64100, 'kişi', true, 2400), fam: 'a.bakanlik', final: m(4200, 2600, 180, 240, 520000), tags: ['a.bakanlik'],
      text: 'Anadolu Süt tartışmasında hukuken ne yapılır, kısaca: ürünü ve fişi saklayın, açılmamış kutuları iade edebilirsiniz, şikâyetinizi il tarım müdürlüğüne yazılı yapın. Sosyal medyada kesin hüküm cümleleri kurmayın; inceleme sonucu çıkmadan kimse suçlu değildir.' },
    { at: 600, news: MEDIA.marmara, title: 'Anadolu Süt cephesi sessiz: On saattir açıklama yok',
      summary: 'Çocuk sütüne ilişkin iddiaların üzerinden saatler geçmesine rağmen şirketten yazılı ya da sözlü açıklama gelmedi. Boykot çağrıları ve "video eski" tartışması sürüyor.' },
  ],
  bursts: [
    { at: 302, span: 12, n: 26, twice: 0.3, tpl: CLUSTER_TEXTS.dalga1.base },
    { at: 425, span: 11, n: 14, twice: 0.15, tpl: CLUSTER_TEXTS.dalga2.base },
  ],
};

const K_OFFICIAL = acct('kuzeyhavayollari', 'Kuzey Havayolları', 214000, 'kurum', true, 4600);
const KUZEY = {
  bg: (t) => 9 * (1 + 0.3 * Math.sin((t + 1) / 3.1)),
  wave: (t) => interp([[-16, 0], [-15.4, 20], [-14.6, 12], [-13.8, 0], [1.0, 0], [1.3, 28], [2, 78], [2.6, 62], [3.5, 26], [4.5, 7], [5.5, 0]], t),
  bgPool: 500, wavePool: 420, blueskyFrom: 99,
  bgFams: [['k.ovgu', 2.4], ['k.sikayet', 2.6], ['k.fiyat', 2], ['k.soru', 2]],
  waveFams: (t) => (t < 0 ? [['k.sikayet', 3], ['k.rotarAlay', 0.4]] : [['k.rotar', t < 3.1 ? 3 : 0.5], ['k.rotarAlay', t < 1.6 ? 0.2 : 1.1], ['k.rotarBitti', t < 3.1 ? 0 : 3]]),
  lean: {},
  to: { 'k.rotar': ['kpass', 'kblog', 'haber', 'k.rotar'], 'k.rotarAlay': ['kblog', 'kpass', 'k.rotarAlay'], 'k.rotarBitti': ['kofficial', 'kpass'] },
  modes: { '*': [0.5, 0.3, 0.1, 0.1] },
  script: [
    { at: -1100, who: K_OFFICIAL, text: 'Yaz tarifesinde 6 yeni iç hat noktası ✈️ Erken rezervasyon fırsatları için kuzeyhavayollari.example', final: m(420, 60, 75, 12, 130000), fam: 'k.ovgu' },
    { at: 62, key: 'kpass', who: acct('tugce_yollarda', 'Tuğçe', 1240, 'kişi', false, 1800), media: true, fam: 'k.rotar', final: m(1900, 640, 210, 130, 310000), curve: lg(70, 35), tags: ['kpass'],
      text: 'Kuzey Havayolları KH 418 İzmir–Trabzon. Üç saattir kapıdayız, tek bir anons yok. Görevli “teknik kontrol” deyip gitti. Yaşlılar, bebekli aileler yerde oturuyor. @kuzeyhavayollari biri bize ne olduğunu söyleyecek mi?' },
    { at: 96, key: 'kblog', who: acct('rotadefteri', 'Rota Defteri', 52400, 'kişi', true, 2600), quote: 'kpass', fam: 'k.rotar', final: m(3400, 900, 260, 150, 480000), curve: lg(60, 30), tags: ['kblog'],
      text: 'Rötar her havayolunda olur; fark, yolcuya nasıl davranıldığında. Kuzey Havayolları üç buçuk saattir KH 418 yolcularına bilgi vermiyor. Bilgi vermek bedava. Yolcular: iki saati geçen gecikmede ikram, üç saati geçince tazminat hakkınız var.' },
    { at: 121, news: MEDIA.kent, title: 'Kuzey Havayolları seferinde rötar: Yolcular saatlerce bekledi',
      summary: 'İzmir–Trabzon seferini yapacak KH 418 sayılı uçak teknik kontrol gerekçesiyle saatlerce kalkamadı. Yolcular bilgilendirme yapılmadığını söyledi.' },
    { at: 124, who: MEDIA.kent, fam: 'k.rotar', final: m(310, 140, 60, 25, 70000), tags: ['haber'],
      text: "Kuzey Havayolları'nın İzmir–Trabzon seferinde saatler süren rötar. Yolcular: 'Kimse bilgi vermiyor.' kentgundemi.example/ulasim/7718" },
    { at: 176, key: 'kofficial', who: K_OFFICIAL, fam: 'k.rotarBitti', final: m(680, 110, 540, 160, 390000), curve: lg(50, 25), tags: ['kofficial'],
      text: 'KH 418 İzmir–Trabzon seferimiz, uçuş öncesi kontrolde tespit edilen teknik bir bulgu nedeniyle gecikmiştir. Yedek uçağımız 20.40’ta kalkacaktır. Yolcularımıza ikram sunulmakta, tazminat başvuruları kapıda alınmaktadır. Yaşattığımız bekleyiş için özür dileriz.' },
    { at: 204, who: acct('tugce_yollarda', 'Tuğçe', 1240, 'kişi', false, 1800), fam: 'k.rotarBitti', final: m(520, 60, 45, 12, 90000), tags: ['kpass'],
      text: 'Güncelleme: KH 418 nihayet kalkıyor, yedek uçağa bindik. Kuzey Havayolları özür anonsu yaptı, tazminat formlarını dağıttı. Beş saat sürmesi gerekmezdi ama en azından sonunda konuştular.' },
  ],
  bursts: [],
};

const S_OFFICIAL = acct('drselinaktas', 'Dr. Selin Aktaş', 88300, 'kişi', true, 3000);
const SELIN = {
  bg: (t) => 6 * (1 + 0.3 * Math.sin((t + 2) / 3.4)),
  wave: (t) => interp([[-6.2, 0], [-5.8, 12], [-5, 8], [-4, 0], [1.4, 0], [2, 9], [3, 13], [4.2, 5], [5.5, 0]], t),
  bgPool: 380, wavePool: 200, blueskyFrom: 99,
  bgFams: [['s.kitap', 4], ['s.tarif', 2.2], ['s.soru', 1.4], ['s.elestiri', 0.5]],
  waveFams: (t) => (t < 0 ? [['s.kitap', 2], ['s.tarif', 1.5], ['s.soru', 1]] : [['s.imza', 4], ['s.kitap', 1.2], ['s.soru', 0.5]]),
  lean: {},
  to: { 's.kitap': ['sofficial', 's.kitap'], 's.imza': ['simza', 'skitabevi'], 's.soru': ['sofficial', 'simza'], 's.tarif': ['sofficial'], 's.elestiri': ['sofficial'] },
  modes: { '*': [0.62, 0.22, 0.08, 0.08] },
  script: [
    { at: -1330, key: 'sofficial', who: S_OFFICIAL, media: true, fam: 's.kitap', final: m(5200, 610, 380, 95, 640000), curve: lg(240, 110), tags: ['sofficial'],
      text: 'İki yılın emeği bugün raflarda 📚 “Tabağımdaki Denge”de yasak listesi yok; kendi düzeninizi kurmanın yolları var. Okuyup düşüncelerinizi yazarsanız çok sevinirim.' },
    { at: -1210, news: MEDIA.kent, title: "Diyetisyen Selin Aktaş'ın yeni kitabı 'Tabağımdaki Denge' raflarda",
      summary: 'Aktaş, kitabında kısıtlayıcı diyetler yerine sürdürülebilir alışkanlıkları anlatıyor. Yazar hafta boyunca okurlarıyla imza günlerinde buluşacak.' },
    { at: -365, who: S_OFFICIAL, fam: 's.kitap', final: m(1800, 190, 140, 30, 250000), tags: ['sofficial'],
      text: 'Bu akşam 21.00’de “Sofra Sohbetleri” programında kitabı ve en çok sorulan soruları konuşacağız. Sorularınızı bu paylaşımın altına bırakın, seçtiklerimi yayında yanıtlayacağım.' },
    { at: 104, key: 'simza', who: S_OFFICIAL, media: true, fam: 's.imza', final: m(3100, 260, 210, 60, 380000), curve: lg(70, 35), tags: ['simza'],
      text: 'İmza günü başladı ✍️ Köşe Sahaf Kitabevi’nde saat 18.00’e kadar buradayım. Gelemeyenler için imzalı kitaplar kitabevinin sitesinde olacak.' },
    { at: 168, key: 'skitabevi', who: acct('kosesahaf', 'Köşe Sahaf Kitabevi', 12700, 'kurum', false, 2200), media: true, fam: 's.imza', final: m(940, 120, 50, 22, 110000), tags: ['skitabevi'],
      text: 'Kuyruk sokağın köşesini döndü 😊 Selin Aktaş “Tabağımdaki Denge”yi imzalıyor. Sırada bekleyenlere limonata bizden.' },
  ],
  bursts: [],
};

const SCENARIOS = { 'anadolu-sut': ANADOLU, 'kuzey-havayollari': KUZEY, 'selin-aktas': SELIN };

// Demo sırasında eklenen danışan: adı geçen sakin, düşük hacimli bir akış
function genericScenario(client) {
  const name = client.name || (client.terms && client.terms[0]) || 'Bu konu';
  const fam = { ...GENERIC, b: GENERIC.b.map((t) => t.replaceAll('{NAME}', name)) };
  return { bg: (t) => 4 * (1 + 0.3 * Math.sin(t / 3)), wave: () => 0, bgPool: 300, wavePool: 10, blueskyFrom: 99,
    bgFams: [['g', 1]], waveFams: () => [], lean: {}, to: {}, modes: { '*': [0.8, 0, 0.1, 0.1] }, script: [], bursts: [], fams: { g: fam } };
}

// ---------------------------------------------------------------- dünya
const LEANS = [['kaygili', 0.4], ['alayci', 0.2], ['ofkeli', 0.2], ['savunucu', 0.08], ['merakli', 0.12]];
const STYLES = [['duz', 0.36], ['kucuk', 0.3], ['ascii', 0.1], ['gevsek', 0.19], ['bagiran', 0.05]];

function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
function frac(curve, age) {
  if (age <= 0) return 0;
  if (curve.k === 'log') {
    const f0 = sigmoid(-curve.mid / curve.w);
    return Math.min(1, (sigmoid((age - curve.mid) / curve.w) - f0) / (1 - f0));
  }
  return 1 - Math.exp(-age / curve.tau);
}
function metricsAt(p, t) {
  const f = frac(p.curve, t - p.createdAt);
  const F = p.final;
  return { likes: Math.floor(F.likes * f), reposts: Math.floor(F.reposts * f), replies: Math.floor(F.replies * f),
    quotes: Math.floor(F.quotes * f), views: Math.floor(F.views * f) };
}
const eng = (x) => x.likes + 2 * x.reposts + x.quotes + x.replies;
// Kademeli düzey: düzey değiştiyse metrik "kayda değer" değişmiş sayılır (sorgu aralığından bağımsız)
function level(x) {
  const e = eng(x);
  const le = e < 8 ? e : 8 + Math.floor(Math.log(e / 8) / Math.log(1.12));
  return le * 1000 + Math.floor(Math.log(1 + x.views) / Math.log(1.5));
}

function makeWorld(client, anchor, seed) {
  const sc = SCENARIOS[client.id] || genericScenario(client);
  const fams = sc.fams || FAM;
  const base = `${seed}|${client.id}`;
  const posts = []; // createdAt'e göre sıralı
  const keyed = new Map();
  let hubs = [];
  const seen = new Set();
  const handles = new Set();
  const authors = new Map();
  let nextHour = START_H;
  let seq = 0;
  const idBase = 1_700_000_000_000_000_000n + BigInt(hashStr(base) % 90_000) * 1_000_000_000_000n;

  function fixedAuthor(a, source) {
    const k = `fix:${a.handle}`;
    if (!authors.has(k)) {
      handles.add(a.handle);
      authors.set(k, { id: `${source === 'bluesky' ? 'bluesky' : 'x'}:u-${a.handle}`, handle: a.handle, name: a.name, followers: a.followers,
        verified: !!a.verified, createdAt: anchor - a.ageDays * DAY, kind: a.kind, _style: 'duz', _lean: 'merakli' });
    }
    return authors.get(k);
  }
  function uniqueHandle(h, r) {
    let out = h.slice(0, 15);
    while (handles.has(out)) out = (h.slice(0, 11) + Math.floor(10 + r() * 9990)).slice(0, 15);
    handles.add(out);
    return out;
  }
  function randomAuthor(pool, i) {
    const k = `${pool}:${i}`;
    if (authors.has(k)) return authors.get(k);
    const r = mulberry32(hashStr(`${base}|a|${k}`));
    const first = pick(r, FIRST);
    const last = pick(r, LAST);
    const f = asciify(first).toLowerCase();
    const l = asciify(last).toLowerCase();
    const yy = String(Math.floor(70 + r() * 35) % 100).padStart(2, '0');
    let handle;
    let name;
    let kind = 'kişi';
    const style = r();
    if (pool === 'cl') { // koordineli küme: yeni açılmış, rakamlı hesaplar
      handle = uniqueHandle(`${f}${l.slice(0, 4)}${Math.floor(10000 + r() * 89999)}`, r);
      name = `${first} ${last}`;
    } else if (style < 0.22) { handle = uniqueHandle(`${f}${l}`, r); name = `${first} ${last}`; }
    else if (style < 0.4) { handle = uniqueHandle(`${f}_${l}${yy}`, r); name = `${first} ${last[0]}.`; }
    else if (style < 0.55) { handle = uniqueHandle(`${f}${yy}${l.slice(0, 3)}`, r); name = first + pick(r, NAME_EMOJI); }
    else if (style < 0.68) { handle = uniqueHandle(`${l}${f[0]}_${Math.floor(r() * 99)}`, r); name = `${first} ${last}`.toLocaleLowerCase('tr'); }
    else { const a = pick(r, NICK_A); const b = pick(r, NICK_B); handle = uniqueHandle(`${asciify(a)}${r() < 0.5 ? '_' : ''}${b}`, r);
      name = `${a} ${b}` + pick(r, NAME_EMOJI); if (r() < 0.5) kind = 'bilinmiyor'; }
    const bsky = pool === 'bs';
    if (bsky) handle = `${handle.replace(/_/g, '')}.bsky.social`;
    let followers;
    let createdAt;
    if (pool === 'cl') { followers = Math.floor(2 + r() * 70); createdAt = anchor - Math.floor((16 + r() * 42) * DAY); }
    else {
      followers = Math.min(380000, Math.floor(Math.exp(5.3 + 1.55 * gauss(r)) * (bsky ? 0.35 : 1)));
      createdAt = anchor - Math.floor((70 + r() * r() * 5000) * DAY * (bsky ? 0.25 : 1));
    }
    const a = { id: `${bsky ? 'bluesky' : 'x'}:u${hashStr(k + base)}`, handle, name, followers, verified: !bsky && followers > 20000 && r() < 0.35,
      createdAt, kind, _style: pool === 'cl' ? 'duz' : wpick(r, STYLES), _lean: wpick(r, LEANS) };
    authors.set(k, a);
    return a;
  }

  function addPost(p, tags) {
    p.seqNo = seq++;
    const n = idBase + BigInt(p.seqNo) * 7919n + BigInt(hashStr(p.text) % 7919);
    if (p.source === 'x') { p.id = `x:${n}`; p.url = `${DEMO_URL}/x/${p.author.handle}/status/${n}`; }
    else if (p.source === 'bluesky') { const rk = n.toString(36); p.id = `bluesky:${rk}`; p.url = `${DEMO_URL}/bluesky/${p.author.handle}/post/${rk}`; }
    posts.push(p);
    if (p.key) keyed.set(p.key, p);
    if (tags && tags.length) hubs.push({ p, tags, key: !!p.key });
    return p;
  }

  function scripted(s) {
    const createdAt = anchor + s.at * MIN + 7000;
    if (s.news) {
      const slug = hashStr(s.title).toString(36);
      const med = s.news;
      const p = { source: 'haber', id: `haber:${slug}`, url: `https://${med.site}/haber/${slug}`, text: `${s.title} — ${s.summary}`, createdAt,
        author: { id: `haber:${med.site}`, handle: med.site, name: med.name, followers: med.followers, verified: true, createdAt: anchor - med.ageDays * DAY, kind: 'medya' },
        final: m(0, 0, 0, 0, Math.floor(med.followers * 0.35)), curve: { k: 'exp', tau: 150 * MIN }, refs: { replyTo: null, quoteOf: null, repostOf: null }, media: true, fam: 'haber', key: s.key };
      p.seqNo = seq++;
      posts.push(p);
      seen.add(p.text);
      return;
    }
    const source = s.source || 'x';
    const p = { source, text: s.text, createdAt, author: fixedAuthor(s.who, source), final: s.final, curve: s.curve || { k: 'exp', tau: 110 * MIN },
      refs: { replyTo: null, quoteOf: s.quote ? keyed.get(s.quote)?.id ?? null : null, repostOf: null }, media: !!s.media, fam: s.fam, key: s.key };
    seen.add(p.text);
    addPost(p, source === 'x' ? s.tags : null);
  }

  function pickHub(tags, t, rng) {
    let best = null;
    let total = 0;
    for (const h of hubs) {
      if (h.p.createdAt > t - 20000) continue;
      const age = t - h.p.createdAt;
      if (!h.key && age > 9 * HOUR) continue;
      const ti = tags.findIndex((x) => h.tags.includes(x));
      if (ti < 0) continue;
      const w = Math.pow(1 + eng(metricsAt(h.p, t)), 0.6) * Math.exp(-age / ((h.key ? 6 : 2.5) * HOUR)) * (h.key ? 3 : 1) / (1 + ti * 0.35) + 0.01;
      total += w;
      if (rng() * total < w) best = h; // ağırlıklı rezervuar seçimi
    }
    return best;
  }

  function compose(fam, mode, rng) {
    if (mode === 'reply' && fam.r && rng() < 0.6) return expand(pick(rng, fam.r), rng);
    const parts = [];
    if (fam.o && mode !== 'reply' && rng() < (fam.po ?? 0.3)) parts.push(expand(pick(rng, fam.o), rng));
    parts.push(expand(pick(rng, fam.b), rng));
    if (fam.e && rng() < (fam.pe ?? 0.2)) parts.push(expand(pick(rng, fam.e), rng));
    if (fam.c && rng() < (fam.pc ?? 0.4)) parts.push(expand(pick(rng, fam.c), rng));
    let out = '';
    for (const part of parts) {
      if (!part) continue;
      if (out && !endsPunct(out) && !/^\p{Extended_Pictographic}/u.test(part)) out += '.';
      out += (out ? ' ' : '') + part;
    }
    return out.replace(/\s+/g, ' ').replace(/ ([.,!?])/g, '$1').trim();
  }

  function organic(t, stream, rng) {
    const th = (t - anchor) / HOUR;
    const wave = stream === 'w';
    let source = 'x';
    if (rng() < (wave && th > sc.blueskyFrom ? 0.05 : 0.008)) source = 'bluesky';
    const size = source === 'bluesky' ? 160 : wave ? sc.wavePool : sc.bgPool;
    const author = randomAuthor(source === 'bluesky' ? 'bs' : stream, Math.floor(size * Math.pow(rng(), 1.35)));
    const aff = (wave && sc.lean[author._lean]) || {};
    const pairs = (wave ? sc.waveFams(th) : sc.bgFams).map(([f, w]) => [f, w * (aff[f] ?? aff['*'] ?? 1)]).filter((x) => x[1] > 0);
    if (!pairs.length) return;
    const famKey = wpick(rng, pairs);
    const fam = fams[famKey];
    const mp = wave ? sc.modes[famKey] || sc.modes['*'] : [0.86, 0.04, 0.05, 0.05];
    let mode = source === 'bluesky' ? 'post' : wpick(rng, [['post', mp[0]], ['reply', mp[1]], ['quote', mp[2]], ['repost', mp[3]]]);
    let hub = null;
    if (mode !== 'post') {
      hub = pickHub(sc.to[famKey] || [famKey], t, rng);
      if (!hub) mode = 'post';
    }
    const refs = { replyTo: null, quoteOf: null, repostOf: null };
    let text;
    if (mode === 'repost') {
      refs.repostOf = hub.p.id;
      const full = `RT @${hub.p.author.handle}: ${hub.p.text}`;
      text = full.length > 140 ? `${full.slice(0, 139)}…` : full;
    } else {
      for (let tries = 0; tries < 7; tries++) {
        let s = compose(fam, tries < 3 ? mode : 'post', rng);
        if (wave && sc.tag && fam.tag && th > sc.tagAfter && !s.includes(sc.tag) && rng() < fam.tag * Math.min(1, 0.35 + (th - sc.tagAfter) / 1.5)) s += ` ${sc.tag}`;
        s = applyStyle(s, author._style, rng);
        text = s;
        if (!seen.has(s)) break;
      }
      seen.add(text);
      if (mode === 'reply') { refs.replyTo = hub.p.id; text = `@${hub.p.author.handle} ${text}`; }
      if (mode === 'quote') refs.quoteOf = hub.p.id;
    }
    // Nihai etkileşim: takipçiye bağlı, ağır kuyruklu
    let final;
    if (mode === 'repost') final = m(0, 0, 0, 0, 0);
    else {
      const heat = wave ? 1 + Math.min(2, sc.wave(th) / 300) : 1;
      let likes = Math.pow(author.followers + 3, 0.8) * Math.exp(-3.6 + 1.3 * gauss(rng)) * heat * (mode === 'reply' ? 0.35 : 1);
      if (rng() < 0.012) likes *= 12 + rng() * 60;
      likes = Math.floor(likes);
      final = m(likes, Math.floor(likes * (0.06 + rng() * 0.24)), Math.floor(likes * (0.03 + rng() * 0.12)), Math.floor(likes * rng() * 0.05),
        Math.floor(author.followers * (0.12 + rng() * 0.45) + likes * (30 + rng() * 60) + rng() * 40));
    }
    const p = { source, text, createdAt: t, author, final, curve: { k: 'exp', tau: (25 + rng() * 125) * MIN }, refs, media: mode === 'post' && rng() < 0.07, fam: famKey };
    addPost(p, source === 'x' && mode !== 'repost' && mode !== 'reply' && eng(final) > 40 ? [famKey] : null);
  }

  function burstPost(b, bi, t, idx, rng) {
    const author = randomAuthor('cl', idx);
    const text = expand(pick(rng, b.tpl), rng).replace(/\s+/g, ' ').trim();
    const likes = Math.floor(rng() * 4);
    addPost({ source: 'x', text, createdAt: t, author, final: m(likes, Math.floor(rng() * 3), 0, 0, Math.floor(20 + rng() * 160)),
      curve: { k: 'exp', tau: 40 * MIN }, refs: { replyTo: null, quoteOf: null, repostOf: null }, media: false, fam: 'kume', cluster: `kume-${bi + 1}` }, null);
  }

  function genHour(h) {
    const rng = mulberry32(hashStr(`${base}|h|${h}`));
    const t0 = anchor + h * HOUR;
    const todo = [];
    for (const s of sc.script) if (Math.floor(s.at / 60) === h) todo.push({ t: anchor + s.at * MIN, s });
    sc.bursts.forEach((b, bi) => {
      if (Math.floor(b.at / 60) !== h) return;
      for (let i = 0; i < b.n; i++) {
        const t = anchor + b.at * MIN + Math.floor(rng() * b.span * MIN);
        todo.push({ t, b, bi, idx: i });
        if (rng() < b.twice) todo.push({ t: t + Math.floor((6 + rng() * 16) * MIN), b, bi, idx: i });
      }
    });
    let noise = 1;
    for (let mi = 0; mi < 60; mi++) {
      if (mi % 5 === 0) noise = Math.exp(0.22 * gauss(rng));
      const th = h + (mi + 0.5) / 60;
      for (const [stream, rate] of [['b', sc.bg(th)], ['w', sc.wave(th)]]) {
        const n = poisson(rng, (rate / 60) * noise);
        for (let i = 0; i < n; i++) todo.push({ t: t0 + mi * MIN + Math.floor(rng() * MIN), stream });
      }
    }
    todo.sort((a, b) => a.t - b.t);
    const from = posts.length;
    for (const x of todo) {
      if (x.s) scripted(x.s);
      else if (x.b) burstPost(x.b, x.bi, x.t, x.idx, rng);
      else organic(x.t, x.stream, rng);
    }
    // saat içinde sıralı tut (betikli gönderiler birkaç saniye kayık)
    const tail = posts.splice(from).sort((a, b) => a.createdAt - b.createdAt || a.seqNo - b.seqNo);
    for (const p of tail) posts.push(p);
    hubs = hubs.filter((x) => x.key || t0 - x.p.createdAt < 10 * HOUR);
  }

  function ensure(until) {
    const need = Math.ceil((until - anchor) / HOUR);
    while (nextHour < need) genHour(nextHour++);
  }
  function lowerBound(t) {
    let lo = 0;
    let hi = posts.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (posts[mid].createdAt < t) lo = mid + 1; else hi = mid; }
    return lo;
  }
  function toItem(p, t) {
    const { _style, _lean, ...author } = p.author;
    return { id: p.id, source: p.source, url: p.url, text: p.text, lang: 'tr', createdAt: p.createdAt, author,
      metrics: metricsAt(p, t), refs: { ...p.refs }, media: p.media, clientId: client.id, enr: null };
  }

  return {
    poll(since, until) {
      ensure(until);
      const out = [];
      const iNew = lowerBound(since);
      const iEnd = lowerBound(until);
      const seenIds = new Set();
      // metriği kayda değer değişen eskiler: son 20 saat + betikli (yavaş büyüyen) gönderiler
      const scan = (p) => {
        if (seenIds.has(p.id) || p.createdAt >= since) return;
        if (level(metricsAt(p, since)) !== level(metricsAt(p, until))) { seenIds.add(p.id); out.push(toItem(p, until)); }
      };
      for (let i = lowerBound(since - 20 * HOUR); i < iNew; i++) scan(posts[i]);
      for (const p of keyed.values()) scan(p);
      for (let i = iNew; i < iEnd; i++) out.push(toItem(posts[i], until));
      return out;
    },
  };
}

// Source: { id: 'sim', label, lastError, poll({ client, since, until }) }
export function createSimulator({ anchor, seed = 1907 } = {}) {
  if (!Number.isFinite(anchor)) throw new Error('Simülasyon için anchor (kriz başlangıç anı, ms) gerekli');
  const worlds = new Map();
  return {
    id: 'sim', label: 'Simülasyon (demo verisi)', lastError: null, anchor, seed,
    async poll({ client, since, until } = {}) {
      if (!client || !client.id) return [];
      const u = Number.isFinite(until) ? until : anchor;
      const s = Math.max(Number.isFinite(since) ? since : anchor + START_H * HOUR, anchor + START_H * HOUR);
      if (u <= s) return [];
      if (!worlds.has(client.id)) worlds.set(client.id, makeWorld(client, anchor, seed));
      return worlds.get(client.id).poll(s, u);
    },
  };
}
