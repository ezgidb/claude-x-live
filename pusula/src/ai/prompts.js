// Claude için Türkçe sistem istemleri, JSON şemaları ve snapshot özetleyici.
// Sistem istemi danışana göre SABİT tutulur (prompt caching); değişen her şey kullanıcı mesajına gider.
import { fmtWhen, fmtTime } from './format.js';
import { handleOf } from './read.js';

export const STANCES = ['destek', 'elestiri', 'alay', 'soru', 'notr'];
export const EMOTIONS = ['öfke', 'kaygı', 'alay', 'üzüntü', 'sevinç', 'nötr'];
export const POSTURES = ['izle', 'hazırlan', 'yanıtla', 'düzelt', 'üstlen'];
export const CONFIDENCES = ['düşük', 'orta', 'yüksek'];

const str = { type: 'string' };
const obj = (properties) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });

export const ENRICH_SCHEMA = obj({
  items: { type: 'array', items: obj({
    id: str,
    stance: { type: 'string', enum: STANCES },
    emotion: { type: 'string', enum: EMOTIONS },
    narrative: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    claim: { type: 'boolean' },
    callToAction: { type: 'boolean' },
  }) },
});
export const NAMES_SCHEMA = obj({ narratives: { type: 'array', items: obj({ id: str, label: str, summary: str }) } });
export const BRIEF_SCHEMA = obj({
  headline: str, whatHappened: str, howItGrew: str, whoStarted: str, whoAmplified: str, whereNow: str, meaning: str,
  watchNext: { type: 'array', items: str }, confidence: { type: 'string', enum: CONFIDENCES }, basisNote: str,
});
export const PLAYBOOK_SCHEMA = obj({
  posture: { type: 'string', enum: POSTURES }, rationale: str,
  options: { type: 'array', items: obj({ name: str, when: str, upside: str, risk: str, draft: str }) },
  doNot: { type: 'array', items: str }, holdingStatement: str,
  qna: { type: 'array', items: obj({ q: str, a: str }) }, nextCheckMin: { type: 'integer' },
});

export function clientContext(client) {
  const c = client || {};
  return [
    '## Danışan',
    `Ad: ${c.name || '(bilinmiyor)'}`,
    `Tür: ${c.kind || 'bilinmiyor'}`,
    `Dinlenen ifadeler: ${(c.terms || []).join(', ') || '—'}`,
    `Hassas konular: ${(c.sensitivities || []).join(', ') || '—'}`,
    `Rakipler: ${(c.rivals || []).join(', ') || '—'}`,
    c.note ? `Not: ${c.note}` : '',
  ].filter(Boolean).join('\n');
}

const HONESTY = `## Dürüstlük kuralları
- Gönderi sayıları, saatler ve hız sayım verisidir; kesin olarak aktar. Anlatılar, duruş payları ve öne çıkan hesaplar okunan örnekleme dayanır; bunu belirt.
- Neden-sonuç uydurma. Sıralamayı ve zamanlamayı anlat; "X yüzünden büyüdü" deme. "Sürüklüyor" yerine "en çok etkileşim alan" de.
- Bir iddianın doğru olup olmadığını bu veriden bilemezsin; doğruymuş ya da yanlışmış gibi yazma.
- Koordinasyon bulgusu şüphedir, kanıt değildir.
- Veride olmayan hesap, sayı, saat ya da alıntı ekleme.`;

const STYLE = `## Üslup
Sade, doğal Türkçe; jargon ve İngilizce terim yok. Okuyan kişi teknik olmayan bir iletişim danışmanı. Saatleri "14.20", sayıları "12.400", payları "%46" biçiminde yaz. Gönderi metinlerini kısa alıntıla.`;

export function enrichSystem(client) {
  return `Bir iletişim danışmanlığının sosyal medya analistisin. Sana bir danışan hakkında yazılmış gönderiler verilecek; her birini etiketleyeceksin.

${clientContext(client)}

## Etiketler
- stance: gönderinin DANIŞANA karşı duruşu. "destek" (savunma, övgü), "elestiri" (şikâyet, suçlama, öfke), "alay" (ironi, espri, tırnak içinde övgü, "tebrikler" gibi tersinden övgü), "soru" (gerçekten bilgi isteyen), "notr" (haber, duyuru, ilgisiz anma). Rakibi övüp danışanı yeren gönderi "elestiri"dir. Retorik soru eleştiriyse "elestiri"dir.
- emotion: baskın duygu: öfke, kaygı, alay, üzüntü, sevinç, nötr.
- narrative: gönderinin anlattığı hikâyenin kısa etiketi. Mevcut anlatı listesi kullanıcı mesajında verilir: gönderi bunlardan birine uyuyorsa O ETİKETİ HARFİ HARFİNE kullan. Hiçbirine uymuyorsa 3-6 sözcüklük yeni bir Türkçe etiket yaz (örn. "Üründe yabancı madde iddiası"). Aynı konudaki gönderilere aynı yeni etiketi ver. Gönderi belirli bir hikâye anlatmıyorsa null.
- claim: doğrulanabilir somut bir iddia içeriyor mu (olay, tarih, sayı, görüntü). Görüş ve duygu iddia değildir.
- callToAction: boykot, şikâyet, paylaşma, denetim gibi bir çağrı içeriyor mu.

Her gönderi için tam bir kayıt döndür; id'leri değiştirme, gönderi atlama.`;
}

export function namesSystem(client) {
  return `Bir iletişim danışmanlığının analistisin. Sana otomatik kümelenmiş gönderi grupları (ortak sözcükler ve örnek metinler) verilecek. Her kümeye danışmanın bir bakışta anlayacağı bir ad ver.

${clientContext(client)}

Her küme için: "label" 3-6 sözcüklük Türkçe bir başlık (örn. "Üründe yabancı madde iddiası"); "summary" kümenin ne anlattığını söyleyen tek cümle. Etiket bir iddiayı doğruymuş gibi sunmasın ("iddiası", "şikâyetleri", "çağrısı" gibi adlandır). id'leri değiştirme.`;
}

export function briefSystem(client) {
  return `Kıdemli bir iletişim danışmanının analistisin. Sana bir danışan için canlı gündem verisi (özetlenmiş anlık görüntü ve öne çıkan gönderiler) verilecek; danışmanın danışanına aktarabileceği bir durum notu yazacaksın.

${clientContext(client)}

## Alanlar
- headline: tek satır başlık.
- whatHappened: ne oldu.
- howItGrew: nasıl büyüdü (yayılım zincirindeki adımlar, saatleriyle).
- whoStarted: verideki en erken paylaşım kimden; "ilk" derken eldeki veriyi kastettiğini belirt.
- whoAmplified: en çok erişime ulaşan hesaplar; varsa koordinasyon şüphesi (şüphe olarak).
- whereNow: şu anki eğilim, duruş dağılımı, tahmin.
- meaning: danışan için ne anlama geliyor (risk düzeyi ve gerekçeleri, hassas konularla ilişkisi).
- watchNext: sırada neye bakılmalı; 2-5 kısa madde.
- confidence: yorumun güveni (örneklem büyüklüğüne göre).
- basisNote: neyin sayım, neyin örneklem olduğunu söyleyen tek-iki cümle.

Danışan sakinse not da kısa ve sakin olsun ("kayda değer hareket yok"); olmayan bir krizi büyütme. Her alan 1-4 cümle.

${HONESTY}

${STYLE}`;
}

export function playbookSystem(client) {
  return `Kıdemli bir kriz iletişimi danışmanısın. Sana bir danışan için canlı gündem verisi ve durum notu verilecek; danışmanın danışanına sunacağı yanıt planını yazacaksın.

${clientContext(client)}

## Alanlar
- posture: önerilen duruş. "izle" (adım gerekmez), "hazırlan" (metinler hazır, eşik beklenir), "yanıtla" (kısa inceleme açıklaması), "düzelt" (belgeli düzeltme; yalnızca yanlışlık danışanın kayıtlarıyla doğrulanabiliyorsa), "üstlen" (sorumluluk al, telafi et).
- rationale: bu duruşun gerekçesi; risk düzeyi, baskın anlatının türü (doğrulanabilir iddia mı, alay mı, boykot çağrısı mı), karşı-anlatı, medya girişi, koordinasyon şüphesi ve eğilime dayandır.
- options: 2-3 seçenek. Her biri: name, when (ne zaman / hangi koşulda), upside (getirisi), risk, draft.
- draft: DANIŞANIN kendi hesabından yayımlayabileceği hazır metin; danışmanın ağzından değil, danışanın ağzından (kurum/marka "biz", kişi "ben"). Bilinmeyen bilgiler için [köşeli parantez] bırak.
- doNot: yapılmaması gerekenler.
- holdingStatement: bilgi netleşene kadar kullanılacak kısa bekleme açıklaması.
- qna: olası basın soruları ve danışanın verebileceği yanıtlar (3-5).
- nextCheckMin: durumun yeniden değerlendirileceği süre, dakika.

## Kesin kurallar
- İddianın doğruluğu bilinmiyor: taslaklar iddiayı ne kabul etsin ne yalanlasın; "inceleme başlattık, sonucu paylaşacağız" tonunda olsun. Yalanlama ya da kabul içeren taslaklar yalnızca "doğrulanırsa" koşuluyla ayrı seçenek olabilir.
- Koordinasyon / bot şüphesini kamuya açık bir suçlama olarak ÖNERME; şüphe varsa bunu doNot listesine yaz.
- Taslaklarda suçlayıcı iddiayı ya da boykot etiketini tekrar etme.
- Sakin danışanda duruş "izle" olsun; gereksiz açıklama önerme.

${HONESTY}

${STYLE}`;
}

export function askSystem(client) {
  return `Pusula adlı canlı gündem odasının yardımcısısın. Bir iletişim danışmanı, danışanı hakkında soru soruyor. Yalnızca sana verilen veriye (anlık görüntü özeti, durum notu, yanıt planı, öne çıkan gönderiler) dayanarak yanıtla.

${clientContext(client)}

Kısa ve doğrudan yanıt ver (çoğu zaman 2-6 cümle), düz metin olarak; başlık ve madde işareti kullanma. Veride yanıtı olmayan bir şey sorulursa bunu açıkça söyle, tahmin yürütme. Taslak metin istenirse danışanın ağzından yaz; iddianın doğruluğunu varsayma; koordinasyon şüphesini kamuya açık suçlamaya çevirmeyi önerme.

${HONESTY}

${STYLE}`;
}

// --- Kullanıcı mesajları ---
export function enrichUser(items, narratives) {
  const list = (narratives || []).map((n) => n.label).filter(Boolean);
  const rows = items.map((it) => ({
    id: it.id, kaynak: it.source, hesap: it.author?.handle || it.author?.name || null,
    takipci: it.author?.followers ?? null, metin: String(it.text || '').slice(0, 1200),
  }));
  return `Mevcut anlatılar:\n${list.length ? list.map((l) => `- ${l}`).join('\n') : '(henüz yok)'}\n\nGönderiler (JSON):\n${JSON.stringify(rows)}`;
}

export function namesUser(narratives) {
  const rows = (narratives || []).map((n) => ({
    id: n.id, gecici_etiket: n.label, terimler: n.terms || [], gonderi_sayisi: n.count ?? null,
    ornekler: (n.samples || n.examples || n.texts || n.items || []).map((s) => (typeof s === 'string' ? s : s?.text)).filter(Boolean).slice(0, 8),
  }));
  return `Kümeler (JSON):\n${JSON.stringify(rows)}`;
}

// Snapshot'ı modelin okuyacağı yalın bir özete indir (saatler hazır biçimde).
export function compactSnapshot(snapshot, items) {
  const s = snapshot || {};
  const now = s.at;
  const w = (t) => (t == null ? null : fmtWhen(t, now));
  const byId = new Map((items || []).map((it) => [it.id, it]));
  const series = s.pulse?.series || [];
  const hourly = [];
  const per = Math.max(1, Math.round(60 / (s.pulse?.bucketMin || 10)));
  for (let i = 0; i < series.length; i += per) {
    const chunk = series.slice(i, i + per);
    hourly.push({ saat: fmtTime(chunk[0].t), gonderi: chunk.reduce((a, b) => a + (b.n || 0), 0), olumsuz: chunk.reduce((a, b) => a + (b.neg || 0), 0) });
  }
  return {
    simdi: w(now),
    nabiz: { son1saat: s.pulse?.rate1h, olagan1saat: s.pulse?.baseline1h, z: s.pulse?.z, egilim: s.pulse?.trend, saatlik: hourly },
    durus_son3saat: s.stance,
    anlatilar: (s.narratives || []).slice(0, 8).map((n) => ({ etiket: n.label, ozet: n.summary, tur: n.kind, durum: n.status, gonderi: n.count,
      pay: n.share, erisim: n.reach, hiz: n.velocity, risk: n.risk, durus: n.stance, ilk: w(n.firstSeen), son: w(n.lastSeen) })),
    aktorler: (s.actors || []).slice(0, 15).map((a) => ({ hesap: handleOf(a), ad: a.name, takipci: a.followers, onayli: a.verified, tur: a.kind, rol: a.role,
      gonderi: a.items, erisim: a.reach, etkilesim: a.engagement, ilk: w(a.firstAt), durus: a.stance, not: a.note })),
    yayilim: (s.cascade?.steps || []).map((x) => ({ saat: w(x.t), tur: x.kind, hesap: handleOf(byId.get(x.itemId)?.author), not: x.note })),
    koordinasyon: (s.coordination || []).map((c) => ({ tur: c.kind, hesap_sayisi: c.accounts?.length, pencere_dk: c.windowMin, puan: c.score, not: c.note })),
    tahmin: s.forecast ? { ...s.forecast, peakAt: w(s.forecast.peakAt) } : null,
    risk: s.risk,
    olay: s.incident ? { durum: s.incident.status, baslangic: w(s.incident.startedAt), baslik: s.incident.headline } : null,
    kaynaklar_24saat: s.sources,
    orneklem: s.sample,
  };
}

export function featuredItems(items, now) {
  return (items || []).slice(0, 40).map((it) => ({
    saat: fmtWhen(it.createdAt, now), kaynak: it.source, hesap: handleOf(it.author), takipci: it.author?.followers ?? null,
    metin: String(it.text || '').slice(0, 600), begeni: it.metrics?.likes, paylasim: it.metrics?.reposts,
    durus: it.enr?.stance, anlati: it.enr?.narrative,
  }));
}

export function situationUser({ snapshot, items, brief, playbook }) {
  const parts = [`Anlık görüntü özeti (JSON):\n${JSON.stringify(compactSnapshot(snapshot, items))}`,
    `Öne çıkan gönderiler (JSON):\n${JSON.stringify(featuredItems(items, snapshot?.at))}`];
  if (brief) parts.push(`Durum notu (JSON):\n${JSON.stringify(strip(brief))}`);
  if (playbook) parts.push(`Yanıt planı (JSON):\n${JSON.stringify(strip(playbook))}`);
  return parts.join('\n\n');
}

function strip(o) {
  const { at, by, ...rest } = o;
  return rest;
}
