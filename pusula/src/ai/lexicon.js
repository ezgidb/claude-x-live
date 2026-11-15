// Türkçe duruş / duygu sözlükleri ve kalıpları (yerel mod).
// Kalıplar, normalize edilmiş (küçük harf, şapkasız) metinde SÖZCÜK BAŞINDAN eşleşir;
// böylece çekim ekleri ("rezaletin", "teşekkürler") kendiliğinden kapsanır.

export function norm(text) {
  return String(text || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u')
    .replace(/[’‘`´]/g, "'").replace(/[“”«»„]/g, '"')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

export function tokens(text) {
  return norm(text).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

const B = '(?<![\\p{L}\\p{N}])';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
// Sözcük başı eşleşmesi; "=" ile biten girdiler tam sözcük ister ("iyi=").
export function wordRx(list) {
  const parts = list.map((w) => (w.endsWith('=') ? `${esc(w.slice(0, -1))}(?![\\p{L}\\p{N}])` : esc(w)));
  return new RegExp(`${B}(?:${parts.join('|')})`, 'gu');
}

// --- Olumsuz ---
export const NEG_STRONG = wordRx([
  'rezalet', 'rezil', 'skandal', 'berbat', 'iğrenç', 'igrenc', 'utanmaz', 'utanın', 'utanmıyor', 'yazıklar olsun',
  'kepaze', 'felaket', 'zehir', 'boykot', 'dolandır', 'soygun', 'kazık', 'sahtekar', 'mide bulan', 'midem bulan',
  'tiksin', 'kabul edilemez', 'bir daha asla', 'asla alm', 'pişman', 'mağdur', 'sağlığıyla oyn', 'sağlığımızla oyn',
  'hesap ver', 'hesabını ver', 'istifa', 'nefret', 'korkunç', 'vicdansız', 'sorumsuz', 'saygısız', 'perişan', 'çile',
  'eziyet', 'batsın', 'kapatılsın', 'terbiyesiz', 'ahlaksız', 'şerefsiz', 'insanlık dışı', 'yeter artık', 'bıktık',
  'bıktım', 'illallah', 'lanet', 'rezillik', 'skandal', 'cinayet', 'katil', 'hırsız', 'yuh', 'ayıptır',
]);
export const NEG_WEAK = wordRx([
  'kötü', 'şikayet', 'bozuk', 'pahalı', 'zam=', 'zamm', 'zamlar', 'zamlan', 'eskisi gibi değil', 'düzeltin', 'düzeltsin', 'fahiş', 'yalan', 'ihmal', 'rötar', 'gecik', 'iptal',
  'kayıp', 'kaybol', 'kaybet', 'muhatap', 'ilgilenen yok', 'cevap yok', 'yanıt yok', 'dönüş yok', 'ulaşamı', 'ulaşılmıyor',
  'hasta', 'yabancı madde', 'böcek', 'küf', 'kıl çık', 'güvensiz', 'güvenilmez', 'tehlike', 'endişe', 'kork',
  'hayal kırıklığı', 'çöp', 'vasat', 'beceriksiz', 'ceza', 'dava', 'sorun', 'problem', 'hata', 'yanlış', 'eksik', 'ayıp',
  'yazık', 'almıyorum', 'almıyoruz', 'almayacağ', 'almam=', 'almayın', 'kullanmıyorum', 'kullanmam=', 'bırakıyorum', 'bıraktım',
  'güvenmiyor', 'güvenmem', 'güvenim kalmadı', 'güven kalmadı', 'inanmıyor', 'beğenme', 'beğenmi', 'sevme', 'sevmi',
  'memnun kalma', 'önermi', 'önerme', 'açıklama bekli', 'açıklama yap', 'sessiz', 'susuyor', 'sakl', 'örtbas', 'sorumlu',
  'iade', 'saatlerdir', 'günlerdir', 'haftalardır', 'bekliyoruz', 'bekletil', 'bekliyorum', 'mahvol', 'mahvet', 'rahatsız',
  'kalitesiz', 'düştü', 'bozul', 'ekşi', 'koku', 'bayat', 'zarar', 'umursam', 'umurunda', 'ilgisiz', 'kaba=', 'geç kal',
  'kaçırdı', 'aktarmayı kaçır', 'yetersiz', 'kandır', 'aldat', 'hayal kırık', 'yazıklar', 'tepki', 'isyan', 'çıldır',
  'sinir', 'bezdi', 'bezdir', 'maalesef', 'ne yazık ki', 'olmaz olsun', 'denetle', 'denetim', 'el koy', 'toplatıl',
]);
export const NEG_EMOJI = /[😡🤬👎🤮😤😠🤢💩]/gu;

// --- Olumlu ---
export const POS_STRONG = wordRx([
  'teşekkür', 'harika', 'mükemmel', 'bayıl', 'efsane', 'müthiş', 'kusursuz', 'iyi ki var', 'emeğinize sağlık',
  'emeğine sağlık', 'elinize sağlık', 'eline sağlık', 'tebrik', 'helal', 'bravo', 'gurur', 'vazgeçmem', 'vazgeçilmez',
  'yanındayız', 'yanındayım', 'arkasındayız', 'arkasındayım', 'destekliyor', 'favorim', 'en iyisi', 'bir numara',
  'şahane', 'enfes', 'on numara', 'çok başarılı', 'hayran', 'minnettar', 'tavsiye eder', 'tavsiye ediyor', 'öneririm',
]);
export const POS_WEAK = wordRx([
  'güzel', 'lezzetli', 'kaliteli', 'memnun', 'tavsiye', 'güveniyor', 'güvenim tam', 'seviyor', 'severek', 'sevdim',
  'sevdik', 'beğendi', 'beğeni', 'başarılı', 'süper', 'iyi=', 'iyiydi', 'iyidir', 'hızlı çöz', 'güler yüz', 'ilgili=',
  'ilgiliydi', 'keyif', 'mutlu', 'heyecan', 'sabırsız', 'merakla', 'sağ ol', 'sağol', 'özenli', 'nazik',
  'zamanında', 'sorunsuz', 'rahat', 'taze', 'doğal', 'ilham', 'faydalı', 'yararlı', 'bayılıyor', 'bekliyordum',
  'sonunda çıktı', 'aldım bile', 'sipariş verdim', 'ön sipariş', 'bağımlı', 'vazgeçem', 'şiddetle',
]);
export const POS_EMOJI = /[😍❤🥰💪👍🙏💚💙🤩😊🎉👌]/gu;

// Danışanı savunan kalıplar (karşı-anlatı)
export const DEFENSE = wordRx([
  'eski video', 'video eski', 'eski görüntü', 'görüntü eski', 'görüntüler eski', 'yıllar önce', 'montaj', 'yalan haber',
  'asılsız', 'iftira', 'karalama', 'algı operasyon', 'algı çalışma', 'linç', 'haksızlık', 'kanmayın', 'oyuna gelme',
  'gerçek değil', 'doğru değil', 'gerçeği yansıtm', 'çarpıt', 'sahte video', 'kumpas', 'rakip firma', 'rakiplerin işi',
  'yıllardır kullanıyor', 'yıllardır alıyor', 'yıllardır içiyor', 'hiç sorun yaşama', 'bir kere bile sorun',
]);

// Olumluyu olumsuza çeviren art-ek ("memnun değilim", "tavsiye etmem")
export const NEGATOR_AFTER = /^[\p{L}'" ]{0,22}?(?<![\p{L}])(değil|degil|yok|kalmadı|etmem|etmiyorum|etmiyoruz|edemem|olmadı|olmuyor|bulmadım|göremedim|gelmedi)(?![\p{L}])/u;
// Olumsuzu yumuşatan art-ek ("sorun yok", "kötü değil", "sorunumu çözdüler")
export const RESOLVE_AFTER = /^[\p{L}'" ]{0,24}?(?<![\p{L}])(değil|degil|yok|yaşamadım|yaşamadık|çöz|gider|hallet|olmadı|olmadan|kalmadı)/u;

// --- Alay ---
// Olumsuz bağlamla birlikte geldiğinde ironi sayılan övgü kalıpları
export const IRONIC_PRAISE = wordRx([
  'tebrik', 'helal olsun', 'bravo', 'aferin', 'alkışlıyor', 'alkış=', 'maşallah', 'ne güzel', 'çok şükür', 'sağ ol',
  'sağol', 'teşekkürler', 'teşekkür ederiz', 'teşekkür ederim', 'eline sağlık', 'elinize sağlık', 'süpersiniz',
  'harikasınız', 'büyüksünüz', 'kralsınız', 'gurur duyduk', 'gurur duyuyoruz', 'şahane', 'ne mutlu', 'çok yaşa',
]);
export const IRONY_WORDS = wordRx([
  'güya', 'sözde', 'tabii canım', 'tabi canım', 'tabii tabii', 'eminim', 'ne de olsa', 'bonus', 'hediyesi', 'hediye olarak',
  'promosyon', 'sürpriz', 'ekstra protein', 'protein takviye', 'yeni lezzet', 'yeni aroma', 'bir de üstüne', 'sayesinde',
  'dünya markası', 'şaka gibi', 'komedi', 'güldürme', 'gülsem mi ağlasam', 'pes=', 'yok artık', 'klasik=', 'klasiği',
  'her zamanki gibi', 'şaşırdık mı', 'şaşırmadık', 'bedavaya', 'ödüllü', 'premium', 'özel üretim', 'limited',
  'gelenek bozulm', 'yeni hizmet', 'ücretsiz ikram', 'sürprizli', 'kampanya mı', 'vizyon', 'inovasyon',
]);
export const LAUGH_EMOJI = /[😂🤣😆😹]/u;
export const SNEER_EMOJI = /[🙄😏💀🤭🫠😬🥲]/u;
export const CLOWN_EMOJI = /[🤡🎪]/u;
export const LAUGH_TEXT = /(?<![\p{L}])(?:(?:a?ha){2,}h?|(?:he){2,}|(?:sj){2,}\p{L}*|(?:ks){2,}\p{L}*|(?:kd){2,}\p{L}*|(?:js){2,}\p{L}*|asdf\p{L}*|ahah\p{L}*|haha\p{L}*|jsjs\p{L}*|random)(?![\p{L}])/u;
export const QUOTED = /"([^"]{2,40})"|'([^']{3,40})'/gu;
export const BANG = /\(\s*!+\s*\)/;

// --- Soru ---
export const Q_PARTICLE = /(?<![\p{L}])(m[ıiuü]|m[ıiuü]s[ıiuü]n[ıiuü]z|m[ıiuü]y[ıiuü]z|m[ıiuü]d[ıiuü]r|m[ıiuü]yd[ıiuü]|m[ıiuü]y[ıiuü]m)(?![\p{L}])/u;
export const Q_WORD = wordRx(['neden=', 'niye=', 'niçin', 'nasıl', 'kim=', 'ne zaman', 'hangi', 'nerede', 'kaç=', 'bilen var', 'bilgisi olan', 'doğru mu', 'gerçek mi']);

// --- Çağrı (boykot / şikâyet / paylaş) ---
export const CTA = wordRx([
  'boykot', 'almayın', 'almayalım', 'almıyoruz', 'kullanmayın', 'kullanmayalım', 'uçmayın', 'tercih etmeyin', 'bırakın',
  'paylaşın', 'paylaşalım', 'yayalım', 'yayın=', 'rt yap', 'rt=', 'retweet', 'herkes görsün', 'herkes duysun', 'duyurun',
  'duyuralım', 'şikayet edin', 'şikayet edelim', 'şikayet ediyoruz', 'imza', 'etiketleyin', 'etiketleyelim', 'tepki göster',
  'sessiz kalma', 'susmayın', 'susmayalım', 'göreve', 'denetlesin', 'denetim istiyoruz', 'el koysun', 'harekete geç',
  'ses verin', 'ses olun', 'destek olun', 'raflarda bırak', 'rafta bırak', 'cimer', 'alo 174', 'tüketici hakem',
]);

// --- Doğrulanabilir iddia ---
export const CLAIM = wordRx([
  'çıktı', 'çıkmış', 'buldum', 'bulduk', 'bulundu', 'gördüm', 'görüntü', 'video', 'fotoğraf', 'kanıt', 'belge', 'tespit',
  'hastanelik', 'hastaneye', 'zehirlen', 'iddia', 'ortaya çık', 'açıklandı', 'açıkladı', 'rapor', 'tahlil', 'analiz sonuc',
  'iptal edildi', 'iptal oldu', 'kayboldu', 'kaybettiler', 'eski video', 'video eski', 'sahte', 'montaj', 'ceza kesil',
  'toplatıl', 'geri çağır', 'saat rötar', 'saat gecik', 'saat bekle', 'saattir', 'dakika rötar', 'tarihli', 'parti no',
  'son kullanma', 'zam yap', 'zam geldi', 'tl oldu', 'lira oldu', 'liraya', 'kapattı', 'işten çıkar', 'dava aç', 'soruşturma',
]);

// --- Duygu ---
export const WORRY = wordRx([
  'kork', 'endişe', 'kaygı', 'tedirgin', 'çocuğum', 'çocuklarım', 'bebeğim', 'bebeğime', 'kızıma', 'oğluma', 'içirdim',
  'içiriyor', 'yedirdim', 'güvenli mi', 'zararlı mı', 'sağlığ', 'panik', 'ne yapacağız', 'emin olam', 'emin değil',
  'tehlikeli mi', 'risk', 'başımıza', 'ya bizim', 'içmeye devam', 'almaya devam',
]);
export const SAD = wordRx(['üzül', 'üzücü', 'üzgün', 'hayal kırık', 'kırgın', 'yazık oldu', 'içim acı', 'kırıldı', 'hüzün', 'keşke']);
export const SAD_EMOJI = /[😔😢💔😞😭]/u;

export const STOP = new Set(('ve ile bir bu şu o için gibi çok daha de da mi mı mu mü ama fakat ancak olan olarak hakkında üzerine ' +
  'ilgili en her ne ya ki diye kadar sonra önce göre ise veya hem hiç bile var yok ben sen biz siz onlar şey artık yine ' +
  'bence sanki zaten böyle şöyle nasıl neden niye değil olur oldu olmuş the rt via').split(' '));
