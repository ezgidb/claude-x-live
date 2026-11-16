// Yerel anlatı adlandırma: terimlerden ve örnek metinlerden okunur etiket + tek cümle özet.
import { norm, tokens, STOP } from './lexicon.js';
import { signals, classifyStance } from './local-enrich.js';
import { cap, fmtNum, joinTr } from './format.js';

// Sık görülen iletişim temaları. Sıra önemlidir: daha özgül olan önce.
const THEMES = [
  [/(eski video|video eski|eski görüntü|yıllar önce|montaj|asılsız|iftira|algı operasyon|karalama)/, 'Görüntünün eski olduğu savunması', 'paylaşılan içeriğin eski ya da yanıltıcı olduğunu öne süren, danışanı savunan paylaşımlar'],
  [/(boykot|almayın|almıyoruz|rafta bırak|kullanmayın)/, 'Boykot çağrısı', 'ürünü ya da hizmeti kullanmama çağrısı yapan paylaşımlar'],
  [/(bakanlı|denetim|denetle|göreve|ceza kes|toplatıl|cimer)/, 'Resmî denetim çağrısı', 'yetkili kurumları harekete geçmeye çağıran paylaşımlar'],
  [/(yabancı madde|böcek|kıl çık|küf|cam parça|plastik parça)/, 'Üründe yabancı madde iddiası', 'üründen yabancı madde çıktığını öne süren paylaşımlar'],
  [/(zehirlen|hastanelik|hastaneye|bozuk çık|ekşi|bayat|son kullanma)/, 'Ürün güvenliği şikâyetleri', 'ürünün bozuk ya da sağlığa zararlı olduğunu söyleyen paylaşımlar'],
  [/(rötar|gecik|kalkmadı|kalkmıyor|aktarma)/, 'Rötar ve gecikme şikâyetleri', 'gecikmelerden yakınan paylaşımlar'],
  [/(iptal)/, 'İptal şikâyetleri', 'iptallerden yakınan paylaşımlar'],
  [/(bavul|valiz|kayıp eşya)/, 'Kayıp bagaj şikâyetleri', 'kaybolan ya da geciken bagajlarla ilgili paylaşımlar'],
  [/(müşteri hizmet|çağrı merkez|muhatap|dönüş yok|cevap yok|ulaşamı)/, 'Müşteri hizmetlerine ulaşamama', 'yetkililere ulaşamamaktan yakınan paylaşımlar'],
  [/(zam|pahalı|fiyat|fahiş|ücret)/, 'Fiyat ve zam şikâyetleri', 'fiyatları yüksek bulan paylaşımlar'],
  [/(iade|tazminat|para iadesi)/, 'İade ve tazminat talepleri', 'iade ya da tazminat isteyen paylaşımlar'],
  [/(açıklama bekli|açıklama yap|sessiz|susuyor|neden konuşm)/, 'Açıklama beklentisi', 'danışanın sessizliğini sorgulayan paylaşımlar'],
  [/(reklam|kampanya|reklam filmi)/, 'Reklam kampanyası yorumları', 'reklam ve kampanyalar üzerine yorumlar'],
  [/(tarif|malzeme|su bardağı|kaşık|fırın)/, 'Tarif paylaşımları', 'ürünün geçtiği tarif ve kullanım paylaşımları'],
  [/(imza günü|kitab|kitap|ön sipariş)/, 'Kitap ve okur yorumları', 'kitap çıkışı ve okur yorumları'],
  [/(yeni hat|sefer|tarife|fabrika|yatırım|pazar payı|çeyrek|ciro)/, 'Kurumsal haberler', 'şirket haberleri ve duyurular'],
];

function sampleTexts(n) {
  const src = n.samples || n.examples || n.texts || n.items || [];
  return src.map((s) => (typeof s === 'string' ? s : s?.text)).filter(Boolean);
}

function toneOf(texts) {
  const c = { destek: 0, elestiri: 0, alay: 0, soru: 0, notr: 0 };
  for (const t of texts) c[classifyStance(signals(t))]++;
  const top = Object.entries(c).sort((a, b) => b[1] - a[1])[0];
  return { counts: c, top: top[1] ? top[0] : null, share: texts.length ? top[1] / texts.length : 0 };
}

const TONE = { destek: 'destekleyici', elestiri: 'eleştirel', alay: 'alaycı', soru: 'soru soran', notr: 'bilgi aktaran' };

export function nameOne(n, client) {
  const texts = sampleTexts(n);
  const hay = norm([...(n.terms || []), ...texts].join(' · '));
  const tone = toneOf(texts);
  let label = null, about = null;
  for (const [rx, lab, sum] of THEMES) {
    if (rx.test(hay)) { label = lab; about = sum; break; }
  }
  if (!label && tone.top === 'alay' && tone.share >= 0.5) { label = 'Mizah ve alay paylaşımları'; about = 'konuyu espriye vuran paylaşımlar'; }
  if (!label) {
    // Tema tanınmadı: en ayırt edici terimlerden okunur bir başlık kur.
    const clientToks = new Set([client?.name, ...(client?.terms || [])].flatMap((t) => tokens(t)));
    const terms = (n.terms || []).map((t) => norm(t).replace(/^[#@]/, ''))
      .filter((t) => t.length > 2 && !STOP.has(t) && !tokens(t).every((k) => clientToks.has(k)));
    const top = [...new Set(terms)].slice(0, 2);
    if (top.length) {
      label = `${cap(top.join(' ve '))} ${tone.top === 'elestiri' ? 'eleştirileri' : tone.top === 'soru' ? 'soruları' : tone.top === 'destek' ? 'övgüleri' : 'tartışması'}`;
      about = `${joinTr(top.map((t) => `“${t}”`))} sözcükleri çevresinde toplanan paylaşımlar`;
    } else {
      label = n.label || 'Adlandırılamayan konu';
      about = 'ortak sözcükleri belirgin olmayan paylaşımlar';
    }
  }
  const count = n.count != null ? `${fmtNum(n.count)} gönderi; ` : '';
  const toneNote = tone.top && texts.length >= 3 ? ` Okunan ${texts.length} örnekte ton ağırlıklı olarak ${TONE[tone.top]}.` : '';
  return { id: n.id, label, summary: `${cap(count + about)}.${toneNote}` };
}

export function nameNarrativesLocal(narratives, { client } = {}) {
  const used = new Map();
  return (narratives || []).map((n) => {
    const r = nameOne(n, client);
    // Aynı etiket iki kümeye düşerse ikincisini terimiyle ayır.
    const k = used.get(r.label) || 0;
    used.set(r.label, k + 1);
    if (k > 0) {
      const extra = (n.terms || []).map((t) => norm(t)).find((t) => t.length > 3 && !norm(r.label).includes(t.slice(0, 4)));
      r.label = extra ? `${r.label} (${extra})` : `${r.label} (${k + 1})`;
    }
    return r;
  });
}
