// İnceleme planı: yalnızca sayım verisine bakarak dalgayı evrelere ayırır ve hangi dilimden ne kadar
// gönderi okunacağını önerir. Öncelik doğruluktur: başlangıç evresi eksiksiz okunur; diğer evreler
// rastgele değil, zamana eşit yayılmış dilimlerle temsil edilir. Her dilimin kapsamı açıkça belirtilir.
import { momentum } from './analytics.js';

const MIN = 60_000; const HOUR = 3_600_000;
const fmt = (n) => Math.round(n).toLocaleString('tr-TR');
const fmt1 = (n) => n.toLocaleString('tr-TR', { maximumFractionDigits: 1 });
const tHM = (ms) => new Date(ms).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
const QUOTA = { pre: 100, growth: 300, after: 300, all: 400 };
export const MAX_FULL = 5000;

// minute/hourly: ARAMA sorgusunun (yeniden paylaşımlar hariç) sayımları. from/to: incelenecek aralık.
export function buildPlan({ minute, hourly, from, to, now = Date.now() }) {
  const BIN = 5 * MIN;
  const m = momentum(minute, hourly, now);
  const map = new Map();
  for (const c of minute) if (c.ts >= from && c.ts < to) { const b = Math.floor(c.ts / BIN) * BIN; map.set(b, (map.get(b) ?? 0) + c.n); }
  const bins = [];
  for (let t = Math.floor(from / BIN) * BIN; t < to; t += BIN) bins.push({ ts: t, n: map.get(t) ?? 0 });
  const count = (a, b) => minute.reduce((s, c) => s + (c.ts >= a && c.ts < b ? c.n : 0), 0);
  const total = count(from, to);
  const facts = []; const segments = []; let wave = null; let suggestHours = null;
  const seg = (key, label, a, b, full, why) => { if (b - a >= MIN) segments.push({ key, label, from: a, to: b, count: count(a, b), full, why }); };

  const burst = m.burst && m.burst.start < to && m.burst.peakTs >= from - HOUR ? m.burst : null;
  if (burst) {
    const startedBefore = burst.start - 30 * MIN < from;
    const onsetFrom = Math.max(from, burst.start - 30 * MIN);
    const after = bins.filter((b) => b.ts >= onsetFrom);
    const peak = after.reduce((x, y) => (y.n > x.n ? y : x), after[0] ?? { ts: onsetFrom, n: 0 });
    let t25 = Math.min(peak.ts, onsetFrom + 90 * MIN);
    for (const b of after) if (b.ts >= onsetFrom + 30 * MIN && b.n >= 0.25 * peak.n) { t25 = Math.min(t25, b.ts); break; }
    t25 = Math.max(t25, Math.min(to, onsetFrom + 30 * MIN));
    const peakEnd = Math.min(to, peak.ts + BIN);
    wave = { start: burst.start, peakTs: peak.ts, peakN: peak.n, active: burst.active };
    seg('pre', 'Öncesi', from, onsetFrom, false, 'Dalga öncesindeki olağan konuşma; karşılaştırma tabanı.');
    seg('onset', 'Başlangıç', onsetFrom, t25, true, 'Konuyu kimlerin başlattığını görmek için bu evre eksiksiz okunur.');
    seg('growth', 'Büyüme', t25, peakEnd, false, 'Dalgayı kimlerin ve hangi başlıkların büyüttüğü.');
    seg('after', peakEnd >= to - BIN ? 'Son durum' : 'Zirve sonrası', peakEnd, to, false, 'Konunun şimdiki hâli ve yönü.');
    const base = m.baseline30 / 6;
    facts.push(`Dalga ${tHM(burst.start)} dolaylarında başlamış görünüyor.`);
    facts.push(`En yoğun an ${tHM(peak.ts)}: 5 dakikada ${fmt(peak.n)} gönderi${base >= 0.5 ? ` (bu saat için olağan düzeyin yaklaşık ${fmt1(peak.n / base)} katı)` : ''}.`);
    if (peak.ts > burst.start) facts.push(`Başlangıçtan en yoğun ana ${fmt((peak.ts - burst.start) / MIN)} dakika geçmiş.`);
    facts.push(burst.active ? `Konu şu an “${m.stageLabel}” aşamasında; dalga sürüyor.` : `Konu şu an “${m.stageLabel}” aşamasında.`);
    if (startedBefore) { suggestHours = Math.min(24, Math.ceil((now - burst.start) / HOUR) + 1); facts.push(`Dikkat: dalga seçtiğiniz sürenin başından önce başlamış. Başlangıcı eksiksiz görmek için ${suggestHours} saat geriye bakmanız önerilir.`); }
  } else {
    seg('all', 'Tüm dönem', from, to, false, 'Belirgin bir dalga yok; dönem zamana eşit yayılarak temsil edilir.');
    facts.push('Bu dönemde belirgin bir dalga saptanmadı; hacim olağan seyrinde.');
  }
  facts.push(`Dönem toplamı: ${fmt(total)} gönderi (yeniden paylaşımlar hariç).`);
  for (const s of segments) {
    const Q = QUOTA[s.key] ?? 300;
    s.take = s.full || s.count <= Q * 1.2 ? 'full' : 'sample';
    s.quota = Math.min(s.count, s.count > Q ? Q : Math.max(10, Math.ceil(s.count / 2))); // "temsilî" seçilirse okunacak sayı
    if (s.count === 0) s.take = 'none';
  }
  return { from, to, total, bins, wave, facts, segments, top: total > 100, suggestHours, stage: m.stage, stageLabel: m.stageLabel };
}

export const segmentFetch = (s) => (s.take === 'full' ? Math.min(s.count, MAX_FULL) : s.take === 'sample' ? s.quota : 0);
export function planCost(plan, prices) {
  const posts = plan.segments.reduce((n, s) => n + segmentFetch(s), 0) + (plan.top ? Math.min(100, plan.total) : 0);
  return { posts, cost: posts * (prices.post + 0.6 * prices.user) + 4 * prices.counts };
}
