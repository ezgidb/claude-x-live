// Anlatılar: enr.narrative etiketleriyle gruplama (+ benzer etiket birleştirme),
// etiketsizler için sözcüksel kümeleme. Yeniden paylaşım kaynağının anlatısına sayılır.
import { MIN, HOUR, clamp, fmtTime, STANCES } from './util.js';
import { words, stemOf, STOP, slugify, jaccard, trLower } from './text.js';

const MAX_NARR = 12, HALF = 30 * MIN, NS = 48;

function labelStems(label) {
  const ws = words(label);
  let st = ws.filter((w) => w.length >= 2 && !STOP.has(w)).map(stemOf);
  if (!st.length) st = ws.map(stemOf);
  return [...new Set(st)].sort();
}
function similarLabels(a, b) {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  if (!inter) return false;
  const j = inter / (a.size + b.size - inter);
  return j >= 0.6 || (inter === Math.min(a.size, b.size) && inter >= 2 && j >= 0.5);
}
function find(p, i) { while (p[i] !== i) { p[i] = p[p[i]]; i = p[i]; } return i; }

// 1) Etiketli gruplar
function labeledGroups(units) {
  const byKey = new Map();
  for (const u of units) {
    if (!u.label) continue;
    const st = labelStems(u.label);
    const key = st.join(' ') || trLower(u.label);
    let g = byKey.get(key);
    if (!g) byKey.set(key, (g = { keys: new Set([key]), stems: new Set(st), variants: new Map(), units: [], n: 0 }));
    g.units.push(u); g.n += u.docs.length;
    g.variants.set(u.label, (g.variants.get(u.label) || 0) + u.docs.length);
  }
  const groups = [...byKey.values()].sort((a, b) => b.n - a.n || ([...a.keys][0] < [...b.keys][0] ? -1 : 1));
  const parent = groups.map((_, i) => i), inv = new Map();
  groups.forEach((g, i) => {
    const cand = new Set();
    for (const st of g.stems) { const l = inv.get(st); if (l) for (const j of l) cand.add(j); }
    for (const j of cand) if (similarLabels(g.stems, groups[j].stems)) { const a = find(parent, i), b = find(parent, j); if (a !== b) parent[Math.max(a, b)] = Math.min(a, b); }
    for (const st of g.stems) { let l = inv.get(st); if (!l) inv.set(st, (l = [])); l.push(i); }
  });
  const out = new Map();
  groups.forEach((g, i) => {
    const r = find(parent, i);
    if (r === i) { out.set(i, g); return; }
    const t = out.get(r);
    for (const k of g.keys) t.keys.add(k);
    for (const u of g.units) t.units.push(u);
    for (const [v, c] of g.variants) t.variants.set(v, (t.variants.get(v) || 0) + c);
    t.n += g.n;
  });
  return [...out.values()].map((g) => {
    let label = '', bc = -1;
    for (const [v, c] of g.variants) if (c > bc || (c === bc && v < label)) { label = v; bc = c; }
    return { lexical: false, label, keys: g.keys, stems: g.stems, units: g.units };
  });
}

// 2) Etiketsiz birimleri, sözcükleri güçlü biçimde örtüşen etiketli anlatıya bağla
function attachUnlabeled(ctx, recs, rest) {
  if (!recs.length || !rest.length) return rest;
  const inv = new Map();
  recs.forEach((r, ri) => {
    const cnt = new Map();
    for (const u of r.units) for (const st of u.stems) cnt.set(st, (cnt.get(st) || 0) + 1);
    const min = r.units.length < 3 ? 1 : Math.max(2, 0.15 * r.units.length);
    const top = [...cnt].filter(([, c]) => c >= min).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([st]) => st);
    for (const st of new Set([...top, ...r.stems])) { let l = inv.get(st); if (!l) inv.set(st, (l = [])); l.push(ri); }
  });
  const left = [];
  for (const u of rest) {
    let total = 0;
    const score = new Map(), shared = new Map();
    for (const st of u.stems) {
      const w = ctx.idf(st); total += w;
      const l = inv.get(st);
      if (l) for (const ri of l) { score.set(ri, (score.get(ri) || 0) + w); shared.set(ri, (shared.get(ri) || 0) + 1); }
    }
    let best = -1, bs = 0;
    for (const [ri, s] of score) if (shared.get(ri) >= 2 && s > bs) { best = ri; bs = s; }
    if (best >= 0 && bs / total >= 0.3) recs[best].units.push(u); else left.push(u);
  }
  return left;
}

// 3) Sözcüksel kümeleme: öne çıkan terimleri birlikte geçişe göre grupla, gönderileri gruba ata
function lexicalClusters(ctx, rest) {
  const N = rest.length;
  if (N < 6) return [];
  const df = new Map();
  for (const u of rest) for (const st of u.stems) df.set(st, (df.get(st) || 0) + 1);
  const minDf = Math.max(3, Math.ceil(0.01 * N));
  const sal = [...df].filter(([, c]) => c >= minDf).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 80);
  const T = sal.length;
  if (!T) return [];
  const idx = new Map(sal.map(([st], i) => [st, i]));
  const co = Array.from({ length: T }, () => new Float64Array(T));
  const unitTerms = rest.map((u) => { const l = []; for (const st of u.stems) { const i = idx.get(st); if (i !== undefined) l.push(i); } return l; });
  for (const l of unitTerms) for (let a = 0; a < l.length; a++) for (let b = a + 1; b < l.length; b++) { co[l[a]][l[b]]++; co[l[b]][l[a]]++; }
  const J = (i, j) => co[i][j] / (sal[i][1] + sal[j][1] - co[i][j]);
  // Ortalama bağlantılı birleştirme
  let clusters = sal.map((_, i) => [i]);
  for (;;) {
    let bi = -1, bj = -1, bv = 0.18;
    for (let a = 0; a < clusters.length; a++) for (let b = a + 1; b < clusters.length; b++) {
      let s = 0;
      for (const i of clusters[a]) for (const j of clusters[b]) s += J(i, j);
      s /= clusters[a].length * clusters[b].length;
      if (s > bv) { bv = s; bi = a; bj = b; }
    }
    if (bi < 0) break;
    clusters[bi] = clusters[bi].concat(clusters[bj]);
    clusters.splice(bj, 1);
  }
  const topicOf = new Int32Array(T);
  clusters.forEach((c, ci) => { for (const i of c) topicOf[i] = ci; });
  const w = sal.map(([, c]) => Math.log(N / c) + 0.5);
  const members = clusters.map(() => []);
  rest.forEach((u, ui) => {
    const l = unitTerms[ui];
    if (!l.length) return;
    const sc = new Map();
    for (const i of l) sc.set(topicOf[i], (sc.get(topicOf[i]) || 0) + w[i]);
    let best = -1, bs = 0;
    for (const [ci, s] of sc) if (s > bs || (s === bs && ci < best)) { best = ci; bs = s; }
    members[best].push(u);
  });
  const out = [];
  clusters.forEach((c, ci) => {
    const us = members[ci];
    const n = us.reduce((s, u) => s + u.docs.length, 0);
    if (us.length < 2 || n < 3) return;
    const terms = c.slice().sort((a, b) => sal[b][1] - sal[a][1]).map((i) => sal[i][0]);
    const label = terms.slice(0, 3).map(ctx.surface).join(', ');
    out.push({ lexical: true, label, autoLabel: label, keys: new Set(), stems: new Set(terms.slice(0, 8)), units: us });
  });
  return out;
}

function stats(ctx, r) {
  const { now } = ctx;
  const docs = [];
  for (const u of r.units) for (const d of u.docs) docs.push(d);
  docs.sort((a, b) => a.t - b.t);
  const st = { destek: 0, elestiri: 0, alay: 0, soru: 0, notr: 0 };
  const series = Array.from({ length: NS }, (_, i) => ({ t: now - (NS - i) * HALF, n: 0 }));
  let reach = 0, cta = 0, claim = 0, last1h = 0, prev1h = 0, origin = null;
  const authors = new Set();
  for (const d of docs) {
    st[d.stance]++; reach += d.followers; if (d.cta) cta++; if (d.claim) claim++;
    authors.add(d.authorId);
    const age = now - d.t;
    if (age < HOUR) last1h++; else if (age < 2 * HOUR) prev1h++;
    const i = NS - 1 - Math.floor(age / HALF);
    if (i >= 0) series[i].n++;
    if (!origin && !d.isRepost) origin = d;
  }
  origin = origin || docs[0];
  const count = docs.length;
  const stance = {};
  for (const k of STANCES) stance[k] = Math.round((st[k] / count) * 1000) / 1000;
  let peakHour = 0;
  for (let i = 1; i < NS; i++) peakHour = Math.max(peakHour, series[i].n + series[i - 1].n);
  const neg = (st.elestiri + st.alay) / count, pos = st.destek / count;
  const kind = neg >= 0.45 && neg > pos * 1.5 ? 'saldırı' : pos >= 0.45 && pos > neg * 1.5 ? 'savunma' : 'nötr';
  const velocity = Math.round((last1h / Math.max(1, prev1h)) * 100) / 100;
  const first = docs[0].t, last = docs[count - 1].t;
  let status;
  if (last1h === 0) status = 'sönüyor';
  else if (now - first <= 90 * MIN) status = 'doğuyor';
  else if (velocity >= 1.25 && last1h >= 3) status = 'büyüyor';
  else if (last1h >= 0.6 * peakHour) status = 'zirvede';
  else status = 'sönüyor';
  // Terimler
  const cnt = new Map();
  for (const u of r.units) for (const s of u.stems) cnt.set(s, (cnt.get(s) || 0) + 1);
  const termStems = [...cnt].map(([s, c]) => [s, c * ctx.idf(s)]).filter(([s]) => cnt.get(s) >= Math.min(2, r.units.length))
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 6).map(([s]) => s);
  const top = docs.filter((d) => !d.isRepost).sort((a, b) => b.eng - a.eng || a.t - b.t).slice(0, 5);
  Object.assign(r, { docs, count, reach, stance, negShare: neg, ctaShare: cta / count, claimShare: claim / count, authors: authors.size,
    firstSeen: first, lastSeen: last, last1h, prev1h, velocity, status, kind, series, peakHour,
    bursty: peakHour >= 5 && peakHour >= 3 * (count / 24), origin, top, termStems });
  return r;
}

export function sensitivityStems(client) {
  const s = new Set();
  for (const p of client?.sensitivities || []) for (const w of words(p)) if (w.length >= 4 && !STOP.has(w)) s.add(stemOf(w));
  return s;
}

function narrativeRisk(r, sens) {
  const negW = clamp((r.negShare - 0.2) / 0.5);
  const size = clamp(Math.log10(1 + r.count) / 3);
  const recent = clamp(r.last1h / 30);
  const reachF = clamp((Math.log10(r.reach + 1) - 4) / 3);
  let sensHit = 0;
  if (sens.size) { for (const s of r.termStems) if (sens.has(s)) sensHit = 1; for (const s of r.stems) if (sens.has(s)) sensHit = 1; }
  r.sensHit = !!sensHit;
  return Math.round(100 * negW * (0.35 * size + 0.25 * recent + 0.2 * reachF + 0.1 * clamp(r.ctaShare * 4) + 0.1 * sensHit));
}

function summarize(r) {
  const tone = r.kind === 'saldırı' ? 'çoğunlukla eleştirel' : r.kind === 'savunma' ? 'çoğunlukla destekleyici' : 'karışık ya da nötr tonda';
  return `${r.count} gönderi, ${r.authors} hesap; ${tone}. İlk görülme ${fmtTime(r.firstSeen)}, son 1 saatte ${r.last1h} gönderi.`;
}

export function buildNarratives(ctx, prev) {
  const sens = sensitivityStems(ctx.client);
  const recs = labeledGroups(ctx.units);
  let rest = ctx.units.filter((u) => !u.label);
  rest = attachUnlabeled(ctx, recs, rest);
  const all = recs.concat(lexicalClusters(ctx, rest)).map((r) => stats(ctx, r))
    .filter((r) => r.count >= (r.lexical ? 3 : 2))
    .sort((a, b) => b.count - a.count || a.firstSeen - b.firstSeen)
    .slice(0, MAX_NARR);

  // Kimlik kararlılığı: önceki anlık görüntüdeki id'leri koru
  const prevN = (prev?.narratives || []).map((p) => {
    const ls = labelStems(p.label || '');
    return { p, key: ls.join(' '), stems: new Set(ls), termStems: new Set((p.terms || []).map((t) => stemOf(trLower(t)))), used: false };
  });
  const usedIds = new Set();
  const total = ctx.docs.length || 1;
  for (const r of all) {
    let hit = null;
    if (!r.lexical) {
      hit = prevN.find((q) => !q.used && r.keys.has(q.key)) || prevN.find((q) => !q.used && similarLabels(q.stems, r.stems));
      if (hit && r.keys.has(hit.key)) r.label = hit.p.label;
    } else {
      const ts = new Set(r.termStems);
      hit = prevN.find((q) => !q.used && q.p.originItemId && q.p.originItemId === r.origin.it.id && (q.p.lexical || jaccard(q.termStems, ts) >= 0.2))
        || prevN.filter((q) => !q.used).map((q) => [q, jaccard(q.termStems, ts)]).filter(([, j]) => j >= 0.4).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
      if (hit) {
        r.label = hit.p.label;
        if (hit.p.lexical && hit.p.autoLabel) r.autoLabel = hit.p.autoLabel;
        // ZEKÂ adlandırdıysa (etiket otomatik etiketten farklı) özeti de koru
        if (hit.p.autoLabel && hit.p.label !== hit.p.autoLabel && hit.p.summary) r.keptSummary = hit.p.summary;
      }
    }
    let id;
    if (hit && !usedIds.has(hit.p.id)) { hit.used = true; id = hit.p.id; }
    else {
      const base = slugify(r.lexical ? r.autoLabel : r.label);
      id = base;
      for (let k = 2; usedIds.has(id) || prevN.some((q) => !q.used && q.p.id === id); k++) id = `${base}-${k}`;
    }
    usedIds.add(id);
    r.id = id;
    for (const d of r.docs) d.nid = id;
    r.risk = narrativeRisk(r, sens);
    r.pub = {
      id, label: r.label, summary: r.keptSummary || summarize(r), terms: r.termStems.map(ctx.surface),
      count: r.count, share: Math.round((r.count / total) * 1000) / 1000, reach: r.reach, stance: r.stance,
      firstSeen: r.firstSeen, lastSeen: r.lastSeen, velocity: r.velocity, status: r.status, kind: r.kind, risk: r.risk,
      originItemId: r.origin.it.id, topItemIds: r.top.map((d) => d.it.id), series: r.series,
      lexical: r.lexical, autoLabel: r.lexical ? r.autoLabel : null,
    };
  }
  return all;
}
