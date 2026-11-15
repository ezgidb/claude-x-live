// Snapshot'ı okuyup not, plan ve soru-yanıt için ortak "durum okuması" çıkarır.
import { norm } from './lexicon.js';

const ISSUE = [
  ['ürün', /(ürün|yabancı madde|böcek|küf|bozuk|zehir|gıda|süt|paket|kutu|son kullanma|hijyen|içinden çık|parti)/],
  ['hizmet', /(rötar|gecik|iptal|bavul|bagaj|kayıp|müşteri hizmet|çağrı merkez|teslimat|kargo|arıza|kesinti|uçuş|sefer|muhatap)/],
  ['fiyat', /(fiyat|zam|pahalı|ücret|fahiş)/],
  ['söz', /(açıklama|sözleri|söyledi|paylaşımı|röportaj|ifade|tweet|yorumu)/],
];

function hay(n) {
  return norm([n.label, n.summary, ...(n.terms || [])].join(' · '));
}

function negShare(st) {
  return st ? (st.elestiri || 0) + (st.alay || 0) : 0;
}

export function readSnapshot({ client, snapshot, items }) {
  const s = snapshot || {};
  const now = s.at;
  const byId = new Map((items || []).map((it) => [it.id, it]));
  const pulse = s.pulse || {};
  const risk = s.risk || { score: 0, level: 'yeşil', drivers: [] };
  const narratives = s.narratives || [];
  const actors = s.actors || [];
  const steps = (s.cascade?.steps || []).slice().sort((a, b) => a.t - b.t);
  const coordination = (s.coordination || []).slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  const stance = s.stance || {};

  const calm = risk.level === 'yeşil' && !s.incident && ['sakin', 'hareketli', 'sönüyor', undefined].includes(pulse.trend);

  // Baskın saldırı anlatısı ve varsa savunma (karşı-anlatı)
  const attacks = narratives.filter((n) => n.kind === 'saldırı' || (n.kind !== 'savunma' && negShare(n.stance) >= 0.5));
  const attack = attacks.slice().sort((a, b) => ((b.risk || 0) - (a.risk || 0)) || ((b.share || 0) - (a.share || 0)))[0] || null;
  const counter = narratives.filter((n) => n.kind === 'savunma').sort((a, b) => (b.share || 0) - (a.share || 0))[0] || null;
  const counterStep = steps.find((x) => x.kind === 'karşı-anlatı') || null;
  const growing = narratives.filter((n) => n.status === 'büyüyor' || n.status === 'doğuyor')
    .sort((a, b) => (b.velocity || 0) - (a.velocity || 0));

  // Anlatının türü
  let nature = 'genel';
  const boycott = narratives.find((n) => /(boykot|almayın|almıyoruz|protesto)/.test(hay(n))) || null;
  if (attack) {
    const h = hay(attack);
    const ofAttack = (items || []).filter((it) => it.enr && it.enr.narrative && norm(it.enr.narrative) === norm(attack.label));
    const claimShare = ofAttack.length ? ofAttack.filter((it) => it.enr.claim).length / ofAttack.length : 0;
    if (/(iddia|çıktı|görüntü|video|belge|tespit|ortaya)/.test(h) || claimShare >= 0.4) nature = 'iddia';
    else if (/(boykot|almayın|protesto)/.test(h)) nature = 'boykot';
    else if ((attack.stance?.alay || 0) >= 0.4 || /(mizah|alay|espri|caps|dalga)/.test(h)) nature = 'alay';
    else if (/(şikayet|rötar|gecik|iptal|zam|fiyat|hizmet|bavul)/.test(h)) nature = 'şikâyet';
  }
  let issue = client?.kind === 'kişi' ? 'söz' : 'genel';
  if (attack) for (const [k, rx] of ISSUE) if (rx.test(hay(attack))) { issue = k; break; }

  // Aktörler
  const originId = s.cascade?.originItemId || attack?.originItemId || null;
  const originItem = originId ? byId.get(originId) : null;
  const source = actors.find((a) => a.role === 'kaynak') ||
    (originItem ? { handle: originItem.author?.handle, name: originItem.author?.name, followers: originItem.author?.followers, verified: originItem.author?.verified, kind: originItem.author?.kind } : null);
  const byReach = (a, b) => (b.reach || 0) - (a.reach || 0);
  const amplifiers = actors.filter((a) => ['yükseltici', 'köprü', 'medya'].includes(a.role)).sort(byReach);
  const defenders = actors.filter((a) => a.role === 'savunucu').sort(byReach);
  const mediaActors = actors.filter((a) => a.role === 'medya' || a.kind === 'medya').sort(byReach);
  const mediaStep = steps.find((x) => x.kind === 'medya') || null;
  const media = mediaActors.length > 0 || !!mediaStep;

  // Hassasiyet eşleşmesi
  const allHay = norm(narratives.slice(0, 5).map((n) => hay(n)).join(' ') + ' ' + (risk.drivers || []).map((d) => `${d.key} ${d.note}`).join(' '));
  const sensitivities = (client?.sensitivities || []).filter((x) => {
    const parts = norm(x).split(' ').filter((p) => p.length > 3);
    return parts.length > 0 && parts.every((p) => allHay.includes(p.slice(0, 5)));
  });

  const series = pulse.series || [];
  let peak = null;
  for (const b of series) if (!peak || b.n > peak.n) peak = b;
  const rate = pulse.rate1h || 0, base = pulse.baseline1h || 0;
  const ratio = base > 0 ? rate / base : (rate > 0 ? Infinity : 1);
  const total24 = series.reduce((a, b) => a + (b.n || 0), 0);
  const cta = !!boycott || (risk.drivers || []).some((d) => /çağrı|boykot/.test(norm(`${d.key} ${d.note}`)));

  return { client, snapshot: s, now, byId, pulse, risk, stance, narratives, actors, steps, coordination, calm,
    attack, counter, counterStep, growing, nature, issue, boycott, originId, originItem, source, amplifiers, defenders,
    mediaActors, mediaStep, media, sensitivities, peak, rate, base, ratio, total24, cta,
    forecast: s.forecast || null, incident: s.incident || null, sample: s.sample || { items: 0, enriched: 0 } };
}

export function handleOf(a) {
  if (!a) return null;
  const h = a.handle || a.name;
  if (!h) return null;
  return a.handle ? (a.handle.startsWith('@') ? a.handle : `@${a.handle}`) : a.name;
}

export function confidenceOf(r) {
  const { items = 0, enriched = 0 } = r.sample;
  if (enriched < 30) return 'düşük';
  if (enriched >= 150 && items > 0 && enriched / items >= 0.6) return 'yüksek';
  return 'orta';
}
