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

export function buildCascade(ctx, narrs) {
  const empty = { cascade: { originItemId: null, steps: [] }, focus: null, eventIds: new Set(), times: ctx.times, originDoc: null };
  const attack = narrs.filter((n) => n.kind === 'saldırı' && n.bursty && n.count >= 5);
  let focus = attack.slice().sort((a, b) => b.risk - a.risk || b.count - a.count)[0];
  if (!focus) focus = narrs.filter((n) => n.bursty && n.count >= 8 && n.kind !== 'savunma')[0];
  if (!focus) return empty;
  let ev = attack.filter((n) => n === focus || (n.count >= 0.1 * focus.count && n.firstSeen >= focus.firstSeen - 6 * HOUR));
  if (!ev.length) ev = [focus];
  const originDoc = ev.map((n) => n.origin).sort((a, b) => a.t - b.t)[0];
  const eventIds = new Set(ev.map((n) => n.id));
  const docs = ctx.docs.filter((d) => eventIds.has(d.nid) && d.t >= originDoc.t);
  const times = docs.map((d) => d.t);
  const steps = [{ t: originDoc.t, itemId: originDoc.it.id, kind: 'ilk', note: `İlk paylaşım: ${who(originDoc)}, saat ${fmtTime(originDoc.t)}.` }];

  // Sıçramalar
  const engCut = docs.map((d) => d.eng).sort((a, b) => b - a)[Math.min(19, docs.length - 1)] || 0;
  const cands = [];
  for (const d of docs) {
    if (d === originDoc || d.isRepost) continue;
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
  const counter = narrs.filter((n) => n.kind === 'savunma' && n.count >= 3 && n.firstSeen > originDoc.t).sort((a, b) => a.firstSeen - b.firstSeen)[0];
  if (counter) steps.push({ t: counter.origin.t, itemId: counter.origin.it.id, kind: 'karşı-anlatı', note: `Karşı görüş belirdi: “${counter.label}” (${counter.count} gönderi).` });
  steps.sort((a, b) => a.t - b.t);
  return { cascade: { originItemId: originDoc.it.id, steps: steps.slice(0, 12) }, focus, eventIds, times, originDoc, counter: counter || null };
}
