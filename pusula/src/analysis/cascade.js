// Yayılım zinciri: olayın köken gönderisi ve dönüm noktaları (zaman sıralı).
import { MIN, HOUR, countIn, fmtNum, fmtTime, handleOf } from './util.js';

// Bir paylaşımın öncesi/sonrası saatlik hacim. Neden-sonuç değil, yalnızca sıralama bilgisi.
export function jumpAt(times, t, now) {
  const span = Math.min(HOUR, now - t);
  if (span < 20 * MIN) return null;
  const before = countIn(times, t - HOUR, t);
  const after = Math.round(Math.max(0, countIn(times, t, t + span) - 1) * (HOUR / span));
  return { before, after, ratio: after / Math.max(before, 1) };
}
export const isJump = (j) => !!j && j.after >= 8 && j.ratio >= 2.5;
export const jumpText = (j) => `saatlik hacim ${j.before} → ${j.after}${j.before >= 1 ? ` (yaklaşık ${Math.round(j.ratio)} kat)` : ''}`;

const who = (d) => `${handleOf(d.it.author)} (${fmtNum(d.followers)} takipçi)`;
const SRC = { x: 'X', bluesky: 'Bluesky', haber: 'haber siteleri' };

// Dalganın başlangıcı: zirveden geriye doğru, önceki saatin sakin olduğu ilk gönderi.
// Köken: dalga başında en çok alıntılanan / yeniden paylaşılan gönderi; yoksa dalganın ilk gönderisi.
function findOrigin(docs, times) {
  const n = docs.length;
  let peakI = 0, peakC = 0;
  for (let i = 0; i < n; i += Math.max(1, n >> 9)) { const c = countIn(times, times[i] - HOUR, times[i] + 1); if (c > peakC) { peakC = c; peakI = i; } }
  const bg = Math.max(0, n - 2 * peakC) / 22;                       // dalga dışı saatlik akış (kaba)
  const thr = Math.max(2, 2 * bg);
  let i = peakI;
  while (i > 0 && countIn(times, times[i] - HOUR, times[i]) > thr) i--;
  if (bg <= 0.5) while (i > 0 && times[i] - times[i - 1] <= HOUR) i--;
  while (i < n - 1 && docs[i].isRepost) i++;
  const onset = docs[i];
  const refs = new Map();
  for (const d of docs) for (const k of ['repostOf', 'quoteOf', 'replyTo']) { const id = d.it.refs?.[k]; if (id) refs.set(id, (refs.get(id) || 0) + 1); }
  let max = 0;
  for (const c of refs.values()) if (c > max) max = c;
  const need = Math.max(3, 0.15 * max);
  for (const d of docs) {
    if (d.t > times[peakI]) break;
    if (!d.isRepost && d.t >= onset.t - 2 * HOUR && (refs.get(d.it.id) || 0) >= need) return d;
  }
  return onset;
}

export function buildCascade(ctx, narrs, pulse) {
  const empty = { cascade: { originItemId: null, steps: [] }, focus: null, eventIds: new Set(), times: ctx.times, originDoc: null, counter: null };
  const attack = narrs.filter((n) => n.kind === 'saldırı' && n.bursty && n.count >= 10 && n.peakHour >= 10);
  let focus = attack.slice().sort((a, b) => b.risk - a.risk || b.count - a.count)[0];
  if (!focus) focus = narrs.filter((n) => n.bursty && n.count >= 10 && n.peakHour >= 10 && n.kind !== 'savunma')[0];
  if (!focus) return empty;
  // Dalga yoksa (ne şimdi ne son saatlerde) zincir kurma
  const wave = pulse.z >= 2 || (pulse.peak1h - pulse.baseline1h) / pulse._.sigma >= 3 || focus.count >= 50;
  if (!wave) return empty;
  let ev = attack.filter((n) => n === focus || n.count >= 0.1 * focus.count);
  if (!ev.length) ev = [focus];
  const eventIds = new Set(ev.map((n) => n.id));
  const evAll = ctx.docs.filter((d) => eventIds.has(d.nid) && !d.own);
  if (!evAll.length) return empty;
  const originDoc = findOrigin(evAll, evAll.map((d) => d.t));
  const docs = evAll.filter((d) => d.t >= originDoc.t);
  const times = docs.map((d) => d.t);
  const steps = [{ t: originDoc.t, itemId: originDoc.it.id, kind: 'ilk', note: `İlk paylaşım: ${who(originDoc)}, saat ${fmtTime(originDoc.t)}.` }];

  // Sıçramalar
  const engCut = docs.map((d) => d.eng).sort((a, b) => b - a)[Math.min(19, docs.length - 1)] || 0;
  const cands = [];
  for (const d of docs) {
    if (d === originDoc || d.isRepost || d.isMedia) continue;
    if (!(d.followers >= 5000 || d.it.refs?.quoteOf === originDoc.it.id || (d.eng >= engCut && d.eng > 0))) continue;
    const j = jumpAt(times, d.t, ctx.now);
    if (isJump(j)) cands.push({ d, j, s: j.ratio * (1 + Math.log10(1 + d.followers)) });
  }
  cands.sort((a, b) => b.s - a.s || a.d.t - b.d.t);
  const picked = [];
  for (const c of cands) {
    if (picked.length >= 2) break;
    if (picked.some((p) => Math.abs(p.d.t - c.d.t) < 45 * MIN)) continue;
    picked.push(c);
    const q = c.d.it.refs?.quoteOf ? 'alıntıladı' : 'paylaştı';
    steps.push({ t: c.d.t, itemId: c.d.it.id, kind: 'sıçrama', note: `${who(c.d)} ${q}; ardından ${jumpText(c.j)}.` });
  }
  const big = docs.find((d) => d !== originDoc && d.followers >= 100_000 && !d.isMedia);
  if (big) steps.push({ t: big.t, itemId: big.it.id, kind: 'büyük-hesap', note: `Büyük hesap girdi: ${who(big)}.` });
  const media = docs.find((d) => d !== originDoc && d.isMedia);
  if (media) steps.push({ t: media.t, itemId: media.it.id, kind: 'medya', note: `İlk medya paylaşımı: ${media.it.author?.name || handleOf(media.it.author)}.` });
  const seenSrc = new Set([originDoc.it.source, 'haber']);
  for (const d of docs) {
    if (seenSrc.has(d.it.source) || !d.it.source) continue;
    seenSrc.add(d.it.source);
    steps.push({ t: d.t, itemId: d.it.id, kind: 'platform-geçişi', note: `Konu ${SRC[d.it.source] || d.it.source} tarafına da geçti (${handleOf(d.it.author)}).` });
  }
  const counter = narrs.filter((n) => n.kind === 'savunma' && n.count >= 5 && n.bursty && n.origin.t > originDoc.t + 20 * MIN && n.last1h + n.prev1h > 0 || false).sort((a, b) => a.firstSeen - b.firstSeen)[0];
  if (counter) steps.push({ t: counter.origin.t, itemId: counter.origin.it.id, kind: 'karşı-anlatı', note: `Karşı görüş belirdi: “${counter.label}” (${counter.count} gönderi).` });
  steps.sort((a, b) => a.t - b.t);
  return { cascade: { originItemId: originDoc.it.id, steps: steps.slice(0, 12) }, focus, eventIds, times, originDoc, counter: counter || null };
}
