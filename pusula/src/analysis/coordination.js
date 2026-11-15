// Koordinasyon bulguları: kopyaya yakın metin kümeleri (MinHash + LSH), genç hesap dalgası,
// aynı gönderiyi eşzamanlı yayan genç hesaplar. Yanlış pozitiften kaçınmak için eşikler birlikte aranır.
import { MIN, clamp, fmtDur, handleOf } from './util.js';
import { fnv } from './text.js';

const K = 12, ROWS = 3, MIN_WORDS = 6, SIM = 0.7;
const SA = Int32Array.from({ length: K }, (_, i) => (0x9e3779b1 * (i + 1)) | 1), SB = Int32Array.from({ length: K }, (_, i) => (0x85ebca6b * (i + 7)) | 0);

function find(p, i) { while (p[i] !== i) { p[i] = p[p[i]]; i = p[i]; } return i; }
function jac(a, b) { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n); }
const round2 = (x) => Math.round(x * 100) / 100;

function pack(kind, docs, score, note, windowMin) {
  const seen = new Set(), accounts = [];
  for (const d of docs) if (!seen.has(d.authorId)) { seen.add(d.authorId); if (accounts.length < 30) accounts.push(handleOf(d.it.author)); }
  return { id: `${kind}:${docs[0].it.id}`, kind, accounts, itemIds: docs.slice(0, 50).map((d) => d.it.id), windowMin, score: round2(score), note,
    _authors: seen, _docs: docs };
}

function copyClusters(ctx) {
  const texts = new Map();
  for (const d of ctx.docs) {
    if (d.isRepost || d.isMedia) continue;
    const ws = d.unit.words;
    if (ws.length < MIN_WORDS) continue;
    const key = ws.join(' ');
    let t = texts.get(key);
    if (!t) texts.set(key, (t = { set: new Set(ws), docs: [], len: ws.length }));
    t.docs.push(d);
  }
  const uniq = [...texts.values()].filter((t) => t.set.size >= MIN_WORDS - 1);
  const parent = uniq.map((_, i) => i);
  const bands = Array.from({ length: K / ROWS }, () => new Map());
  const sig = new Uint32Array(K), hc = new Map();
  uniq.forEach((t, i) => {
    sig.fill(0xffffffff);
    for (const w of t.set) {
      let h = hc.get(w);
      if (h === undefined) hc.set(w, (h = fnv(w)));
      for (let k = 0; k < K; k++) { const v = (Math.imul(h, SA[k]) + SB[k]) >>> 0; if (v < sig[k]) sig[k] = v; }
    }
    for (let b = 0; b < K / ROWS; b++) {
      const buckets = bands[b], key = (sig[b * ROWS] ^ Math.imul(sig[b * ROWS + 1], 0x9e3779b1) ^ Math.imul(sig[b * ROWS + 2], 0x85ebca6b)) & 0x3fffffff;
      let l = buckets.get(key);
      if (!l) { buckets.set(key, [i]); continue; }
      for (let q = 0; q < l.length; q++) {
        const j = l[q], a = find(parent, i), c = find(parent, j), u = uniq[j].set;
        if (a !== c && Math.min(u.size, t.set.size) >= SIM * Math.max(u.size, t.set.size) && jac(t.set, u) >= SIM) parent[Math.max(a, c)] = Math.min(a, c);
      }
      if (l.length < 4) l.push(i);
    }
  });
  const groups = new Map();
  uniq.forEach((t, i) => { const r = find(parent, i); let g = groups.get(r); if (!g) groups.set(r, (g = { docs: [], len: 0, n: 0 })); for (const d of t.docs) g.docs.push(d); g.len += t.len; g.n++; });
  const out = [];
  for (const g of groups.values()) {
    if (g.docs.length < 4) continue;
    const acc = new Map();
    for (const d of g.docs) if (!acc.has(d.authorId)) acc.set(d.authorId, d);
    const nAcc = acc.size;
    if (nAcc < 4) continue;
    g.docs.sort((a, b) => a.t - b.t);
    const ts = g.docs.map((d) => d.t), n = ts.length;
    const core = n >= 10 ? ts[Math.floor(n * 0.9)] - ts[Math.floor(n * 0.1)] : ts[n - 1] - ts[0];
    const spanMin = core / MIN;
    let young = 0;
    for (const d of acc.values()) if (d.young) young++;
    const youngShare = young / nAcc;
    const tight = spanMin <= 20 ? 1 : spanMin <= 60 ? 0.8 : spanMin <= 180 ? 0.5 : spanMin <= 360 ? 0.25 : 0;
    const size = clamp((nAcc - 3) / 9);
    const score = 0.3 * size + 0.4 * youngShare + 0.3 * tight;
    const ok = score >= 0.5 && ((youngShare >= 0.4 && tight >= 0.5) || (youngShare >= 0.6 && nAcc >= 5) || (tight >= 0.8 && nAcc >= 10 && g.len / g.n >= 10));
    if (!ok) continue;
    const windowMin = Math.max(1, Math.round((ts[n - 1] - ts[0]) / MIN));
    const yn = young ? ` Bu hesapların ${young} tanesi son 45 günde açılmış.` : '';
    out.push(pack('kopya-metin', g.docs, score,
      `${nAcc} hesap ${fmtDur(windowMin)} içinde neredeyse aynı metni paylaştı.${yn} Kesin kanıt değil, şüpheli bir örüntü.`, windowMin));
  }
  return out;
}

// 30 dakikalık pencerede genç hesap yığılması (genel ortalamaya göre belirgin olmalı)
function youngBurst(ctx, known) {
  const docs = ctx.docs, W = 30 * MIN;
  let totalYoung = 0;
  for (const d of docs) if (d.young) totalYoung++;
  let best = null, lo = 0, y = 0;
  for (let hi = 0; hi < docs.length; hi++) {
    if (docs[hi].young) y++;
    while (docs[hi].t - docs[lo].t > W) { if (docs[lo].young) y--; lo++; }
    const n = hi - lo + 1;
    if (y >= 10 && y / n >= 0.6 && (!best || y > best.y)) best = { lo, hi, y, n };
  }
  if (!best) return [];
  const outside = docs.length - best.n;
  const bg = outside > 0 ? (totalYoung - best.y) / outside : 0;
  if (bg > 0.3 || outside < best.n) return [];
  const yd = docs.slice(best.lo, best.hi + 1).filter((d) => d.young);
  const acc = new Set(yd.map((d) => d.authorId));
  if (acc.size < 10) return [];
  let overlap = 0;
  for (const a of acc) if (known.has(a)) overlap++;
  if (overlap / acc.size >= 0.6) return [];
  const share = best.y / best.n;
  const windowMin = Math.max(1, Math.round((yd[yd.length - 1].t - yd[0].t) / MIN));
  return [pack('yeni-hesap', yd, 0.4 + 0.3 * share + 0.3 * clamp(acc.size / 30),
    `${fmtDur(windowMin)} içinde paylaşım yapan hesapların çoğu (${acc.size} hesap) son 45 günde açılmış; olağan oran bunun çok altında.`, windowMin)];
}

// Aynı gönderiyi birkaç dakika içinde yeniden paylaşan genç hesaplar
function syncReposts(ctx) {
  const by = new Map();
  for (const d of ctx.docs) if (d.isRepost) { let l = by.get(d.unit.id); if (!l) by.set(d.unit.id, (l = [])); l.push(d); }
  const out = [], W = 3 * MIN;
  for (const l of by.values()) {
    if (l.length < 10) continue;
    let best = null, lo = 0, y = 0;
    for (let hi = 0; hi < l.length; hi++) {
      if (l[hi].young) y++;
      while (l[hi].t - l[lo].t > W) { if (l[lo].young) y--; lo++; }
      const n = hi - lo + 1;
      if (n >= 10 && y / n >= 0.5 && (!best || n > best.n)) best = { lo, hi, n, y };
    }
    if (!best) continue;
    const ds = l.slice(best.lo, best.hi + 1);
    if (new Set(ds.map((d) => d.authorId)).size < 10) continue;
    const windowMin = Math.max(1, Math.round((ds[ds.length - 1].t - ds[0].t) / MIN));
    out.push(pack('eşzamanlı', ds, 0.5 + 0.3 * (best.y / best.n) + 0.2 * clamp(best.n / 30),
      `${best.n} hesap aynı gönderiyi ${fmtDur(windowMin)} içinde yeniden paylaştı; ${best.y} tanesi yeni açılmış hesap.`, windowMin));
  }
  return out;
}

export function buildCoordination(ctx) {
  const copies = copyClusters(ctx);
  const known = new Set();
  for (const f of copies) for (const a of f._authors) known.add(a);
  const all = copies.concat(youngBurst(ctx, known), syncReposts(ctx)).sort((a, b) => b.score - a.score).slice(0, 8);
  const suspects = new Map();
  for (const f of all) for (const a of f._authors) if (!suspects.has(a)) suspects.set(a, f);
  return { findings: all, suspects };
}
