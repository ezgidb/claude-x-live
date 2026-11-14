// Analiz motoru: tamamen deterministik istatistik (yapay zekâ yok).
// Hacim/ivme ölçüleri X "counts" verisinden (örneklemsiz), içerik ve hesap ölçüleri çekilen gönderi örnekleminden hesaplanır.

const MIN = 60_000;
const HOUR = 3_600_000;
const TR_OFFSET = 3 * HOUR; // Europe/Istanbul (sabit UTC+3)

const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
const sum = (a) => a.reduce((s, x) => s + x, 0);
const fmt = (n) => Math.round(n).toLocaleString('tr-TR');
const fmt1 = (n) => n.toLocaleString('tr-TR', { maximumFractionDigits: 1 });
function median(a) {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
// Her öğe için yüzdelik sıra (0-1)
function pctRank(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  return values.map((v) => {
    if (n <= 1) return n ? 1 : 0;
    let lo = 0; let hi = n;
    while (lo < hi) { const m = (lo + hi) >> 1; if (sorted[m] <= v) lo = m + 1; else hi = m; }
    return (lo - 1) / (n - 1);
  });
}
export const engagement = (p) => p.likes + 2 * p.reposts + 2 * p.quotes + 1.5 * p.replies;
const hourTR = (ts) => new Date(ts + TR_OFFSET).getUTCHours();

export const STAGES = {
  quiet: 'Sessiz', emerging: 'Kıpırdanıyor', accelerating: 'Hızlanıyor', peak: 'Zirvede', declining: 'Sönüyor',
};

// ---------------------------------------------------------------- 1. İvme
export function momentum(countsMin, countsHour, now) {
  const BIN = 5 * MIN;
  const lastFull = Math.floor(now / BIN) * BIN - BIN; // tamamlanmış son dilim
  const map = new Map();
  for (const c of countsMin) {
    const b = Math.floor(c.ts / BIN) * BIN;
    if (b <= lastFull) map.set(b, (map.get(b) ?? 0) + c.n);
  }
  const firstTs = countsMin.length ? Math.floor(countsMin[0].ts / BIN) * BIN + BIN : lastFull;
  const bins = [];
  for (let t = Math.max(firstTs, lastFull - 24 * HOUR); t <= lastFull; t += BIN) bins.push({ ts: t, n: map.get(t) ?? 0 });
  const empty = { score: 0, stage: 'quiet', stageLabel: STAGES.quiet, velocity: 0, ratio: 1, z: 0, last30: 0, prev30: 0,
    baseline30: 0, burst: null, lowVolume: true, projection: null, bins, why: 'Henüz yeterli sayım verisi yok.' };
  if (bins.length < 13) return empty;

  // Mevsimsel taban: aynı saat dilimi (±1 saat), önceki günler
  const olderHours = countsHour.filter((c) => c.ts < now - 20 * HOUR);
  const last24 = countsHour.filter((c) => c.ts >= now - 24 * HOUR && c.ts < now - 2 * HOUR).map((c) => c.n);
  const baseCache = new Map();
  const baselineFor = (ts) => {
    const h = hourTR(ts);
    if (baseCache.has(h)) return baseCache.get(h);
    let vals = olderHours.filter((c) => { const d = Math.abs(hourTR(c.ts) - h); return d <= 1 || d === 23; }).map((c) => c.n);
    if (vals.length < 3) vals = last24;
    const med = median(vals);
    const mad = median(vals.map((v) => Math.abs(v - med)));
    const b = med / 2; // 30 dakikaya ölçekle
    const r = { b, s: Math.max((1.4826 * mad) / 2, Math.sqrt(b + 1)) };
    baseCache.set(h, r);
    return r;
  };
  const win = (i) => { let s = 0; for (let k = Math.max(0, i - 5); k <= i; k++) s += bins[k].n; return s; };
  const zAt = (i) => { const { b, s } = baselineFor(bins[i].ts); return (win(i) - b) / s; };

  const alpha = 1 - 2 ** (-5 / 15);
  const v = [];
  bins.forEach((b, i) => { const r = b.n / 5; v.push(i ? alpha * r + (1 - alpha) * v[i - 1] : r); });

  const L = bins.length - 1;
  const x = win(L);
  const prev = win(L - 6);
  const R = (x + 5) / (prev + 5);
  const { b: base } = baselineFor(bins[L].ts);
  const z = zAt(L);
  const zs = bins.map((_, i) => (i >= 5 ? zAt(i) : 0));
  const burstAt = (i) => i >= 6 && zs[i] >= 3 && zs[i - 1] >= 3 && win(i) >= 10;

  let burst = null;
  const active = burstAt(L);
  let lastBurstIdx = -1;
  for (let i = L; i >= 6; i--) if (burstAt(i)) { lastBurstIdx = i; break; }
  if (lastBurstIdx >= 0) {
    let s = lastBurstIdx;
    while (s > 5 && zs[s - 1] >= 1.5) s--;
    let peakIdx = s;
    for (let i = s; i <= L; i++) if (v[i] > v[peakIdx]) peakIdx = i;
    burst = { active, start: bins[s].ts, peakTs: bins[peakIdx].ts, peakVelocity: v[peakIdx], ageMin: (now - bins[s].ts) / MIN };
  }

  const vNow = v[L];
  let stage = 'quiet';
  if (z >= 2 && R >= 1.5 && (!burst || !burst.active || burst.ageMin < 60)) stage = 'emerging';
  else if (active && R >= 1.3) stage = 'accelerating';
  else if (active && R >= 0.8 && vNow >= 0.85 * burst.peakVelocity) stage = 'peak';
  else if (burst && (R < 0.8 || vNow < 0.6 * burst.peakVelocity)) stage = 'declining';
  else if (active) stage = 'peak';

  let rose = 0;
  for (let i = L - 5; i <= L; i++) if (v[i] > v[i - 1]) rose++;
  const Lz = clamp(z / 6, 0, 1);
  const G = clamp(Math.log2(R) / 2, -1, 1);
  let score = 100 * clamp(0.45 * Lz + 0.35 * Math.max(G, 0) + 0.2 * (rose / 6) - 0.25 * Math.max(-G, 0), 0, 1);
  const total24 = sum(bins.map((b) => b.n));
  const lowVolume = total24 < 50;
  if (lowVolume) score = Math.min(score, 40);

  // Önümüzdeki 60 dk için sönümlü eğilim tahmini (aralık olarak)
  let g = Math.log(R) / 30; let rate = vNow; let expect = 0;
  for (let m = 0; m < 60; m += 5) {
    rate = clamp(rate * Math.exp(g * 5), 0.25 * vNow, 3 * vNow);
    expect += rate * 5;
    if ((m + 5) % 30 === 0) g /= 2;
  }
  const band = 1.64 * Math.sqrt(2 * expect);
  const projection = { expected: expect, low: Math.max(0, expect - band), high: expect + band };

  const why = `Son 30 dk: ${fmt(x)} gönderi (önceki 30 dk: ${fmt(prev)}, bu saat için olağan: ~${fmt(base)}). `
    + `Büyüme ${fmt1(R)} kat, olağandan sapma z=${fmt1(z)}.`;
  return { score: Math.round(score), stage, stageLabel: STAGES[stage], velocity: vNow, ratio: R, z, last30: x, prev30: prev,
    baseline30: base, burst, lowVolume, projection, bins, why };
}

// ---------------------------------------------------------------- 2. Terimler
const STOP = new Set(`ve veya ile ama fakat ancak çünkü için gibi kadar daha çok az en bir bu şu o da de ki mi mı mu mü ne
neden nasıl niye hangi her hiç bazı tüm bütün hep hem ya yani ise değil var yok ben sen biz siz onlar bana sana ona bize size
beni seni onu bizi sizi benim senin onun bizim sizin kendi şey şimdi sonra önce bugün yarın dün artık bile sadece yine gene
diye olan olarak oldu olur olsun olacak olmuş olduğu oluyor olmaz ediyor etti eden etmek yapıyor yaptı yapan yapmak diyor dedi
göre karşı üzere böyle şöyle öyle burada orada bunu şunu bunun bunlar şunlar ama lakin hatta zaten belki evet hayır tamam
the and for that this with from you are was have has not but https http www com amp via`.split(/\s+/).map(foldKey));

function fold(s) {
  return s.replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[şŞ]/g, 's').replace(/[üÜ]/g, 'u')
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function foldKey(tok) {
  const f = fold(tok.toLocaleLowerCase('tr-TR'));
  return f.length > 6 ? f.slice(0, 6) : f;
}
// Bir gönderiyi {key, surface} listesine çevirir. Etiketler '#' ile, kısaltılmadan tutulur.
export function tokenize(post) {
  let text = (post.text ?? '').normalize('NFC').replace(/^RT @\w+:\s*/, '').replace(/https?:\/\/\S+/g, ' ')
    .replace(/[@#][\p{L}\p{N}_]+/gu, ' ').replace(/[’ʼ`]/g, "'").replace(/'[\p{L}]+/gu, ' ');
  text = text.toLocaleLowerCase('tr-TR');
  const out = [];
  for (const sentence of text.split(/[.!?\n;:]+/)) {
    const toks = sentence.match(/[\p{L}\p{N}]+/gu) ?? [];
    let prev = null;
    for (const t of toks) {
      if (t.length < 3 || /^\d+$/.test(t)) { prev = null; continue; }
      const key = foldKey(t);
      if (STOP.has(key)) { prev = null; continue; }
      out.push({ key, surface: t });
      if (prev) out.push({ key: `${prev.key} ${key}`, surface: `${prev.surface} ${t}`, bigram: [prev.key, key] });
      prev = { key, surface: t };
    }
  }
  for (const h of post.hashtags ?? []) out.push({ key: '#' + fold(h.toLocaleLowerCase('tr-TR')), surface: '#' + h });
  return out;
}

export function risingTerms(posts, queryWords, now) {
  const docs = posts.filter((p) => p.kind !== 'repost').sort((a, b) => b.created_at - a.created_at);
  const qStop = new Set(queryWords.flatMap((w) => { const c = w.replace(/^[#@]/, ''); return [foldKey(c), '#' + fold(c.toLocaleLowerCase('tr-TR'))]; }));
  // W1: son 60 dk; en az 200 gönderi olana dek genişlet (en çok 6 saat)
  let w1 = HOUR;
  while (w1 < 6 * HOUR && docs.filter((p) => p.created_at >= now - w1).length < 200) w1 += 30 * MIN;
  const t1 = now - w1; const t0 = t1 - 6 * w1;
  const stat = new Map(); // key -> {a1:Set, a0:Set, surf:Map, bigram}
  let n1 = 0; let n0 = 0;
  for (const p of docs) {
    if (p.created_at < t0) break;
    const recent = p.created_at >= t1;
    if (recent) n1++; else n0++;
    for (const t of tokenize(p)) {
      if (qStop.has(t.key) || (t.bigram && t.bigram.every((k) => qStop.has(k)))) continue;
      let s = stat.get(t.key);
      if (!s) { s = { a1: new Set(), a0: new Set(), surf: new Map(), bigram: t.bigram }; stat.set(t.key, s); }
      (recent ? s.a1 : s.a0).add(p.author_id);
      s.surf.set(t.surface, (s.surf.get(t.surface) ?? 0) + 1);
    }
  }
  if (n1 < 20) return { terms: [], n1, n0, windowMin: w1 / MIN };
  const A = 500; const N = n1 + n0;
  const terms = [];
  for (const [key, s] of stat) {
    const y1 = s.a1.size; const y0 = s.a0.size;
    if (y1 < 3) continue;
    if (n0 >= 20 && y0 / n0 > 0.25 && !key.startsWith('#')) continue; // dinamik durak sözcük
    const a = (A * (y1 + y0)) / N;
    const delta = Math.log((y1 + a) / Math.max(1e-9, n1 + A - y1 - a)) - Math.log((y0 + a) / Math.max(1e-9, n0 + A - y0 - a));
    const zeta = delta / Math.sqrt(1 / (y1 + a) + 1 / (y0 + a));
    const lift = (y1 / n1) / ((y0 + 1) / (n0 + 1));
    const surface = [...s.surf].sort((p, q) => q[1] - p[1])[0][0];
    const rising = zeta >= 2.5 && y1 >= Math.max(5, 0.01 * n1) && lift >= 2;
    terms.push({ key, term: surface, y1, y0, share: y1 / n1, lift, zeta, rising, isNew: y0 === 0 && y1 >= 5, hashtag: key.startsWith('#'), bigram: s.bigram });
  }
  // Güçlü ikililer tekil bileşenlerini bastırır
  const byKey = new Map(terms.map((t) => [t.key, t]));
  const hide = new Set();
  for (const t of terms) {
    if (!t.bigram) continue;
    const [a, b] = t.bigram.map((k) => byKey.get(k));
    if (a && b && t.y1 >= 0.7 * Math.min(a.y1, b.y1)) { hide.add(a.key); hide.add(b.key); } else hide.add(t.key);
  }
  const used = new Set(); const list = [];
  for (const t of terms.filter((x) => !hide.has(x.key)).sort((p, q) => (q.rising - p.rising) || (q.zeta - p.zeta) || (q.y1 - p.y1))) {
    if (t.bigram && t.bigram.some((k) => used.has(k))) continue; // zincirleme ikilileri tekrar etme
    if (t.bigram) t.bigram.forEach((k) => used.add(k));
    list.push(t);
    if (list.length >= 20) break;
  }
  return { terms: list, n1, n0, windowMin: w1 / MIN };
}

// ---------------------------------------------------------------- 3. Hesaplar
function normText(t) { return (t ?? '').toLowerCase().replace(/https?:\/\/\S+/g, '').replace(/[@#]\w+/g, '').replace(/[\d\s]+/g, ''); }

export function accounts(posts, users, mom, now) {
  const uname = (id) => users.get(id)?.username?.toLowerCase() ?? null;
  const per = new Map(); // author_id -> agg
  const get = (id) => {
    let a = per.get(id);
    if (!a) { a = { id, n: 0, originals: 0, E: 0, rp: 0, amp: new Set(), repliesOut: 0, bestEarly: 0, first: Infinity, posts: [] }; per.set(id, a); }
    return a;
  };
  // kopya metin patlamaları
  const dupAuthors = new Set();
  const groups = new Map();
  for (const p of posts) {
    if (p.kind === 'repost') continue;
    const k = normText(p.text); if (k.length < 20) continue;
    const key = `${k}|${Math.floor(p.created_at / (10 * MIN))}`;
    if (!groups.has(key)) groups.set(key, new Set());
    groups.get(key).add(p.author_id);
  }
  for (const g of groups.values()) if (g.size >= 5) for (const a of g) dupAuthors.add(a);

  const span = posts.length ? Math.max(HOUR, now - posts[0].created_at) : HOUR;
  for (const p of posts) {
    const a = get(p.author_id);
    a.n++; a.first = Math.min(a.first, p.created_at);
    if (p.kind !== 'repost') { a.E += engagement(p); a.rp += p.reposts + p.quotes; a.posts.push(p); if (p.kind !== 'reply') a.originals++; }
    if (p.kind === 'reply') a.repliesOut++;
  }
  const susp = (id) => {
    const u = users.get(id); const a = per.get(id);
    let s = 0;
    if (u) {
      const ageD = u.created_at ? (now - u.created_at) / 86400e3 : 9999;
      if (ageD < 30) s += 0.3; else if (ageD < 90) s += 0.15;
      if (u.followers < 20) s += 0.15;
      if (u.following > 500 && u.following / Math.max(1, u.followers) > 20) s += 0.15;
      if (/\d{6,}$/.test(u.username ?? '')) s += 0.1;
    }
    if (dupAuthors.has(id)) s += 0.3;
    if (a && a.n / (span / HOUR) > 30) s += 0.2;
    return Math.min(0.9, s);
  };
  const S = new Map(); for (const id of per.keys()) S.set(id, susp(id));
  const q = (id) => 1 - (S.get(id) ?? 0);

  // Yayılım grafiği: u -> v (u, v'yi güçlendiriyor)
  const byName = new Map(); for (const [id, u] of users) if (u.username) byName.set(u.username.toLowerCase(), id);
  const edges = new Map();
  const addEdge = (u, v, w) => {
    if (!u || !v || u === v) return;
    const k = `${u}>${v}`; edges.set(k, Math.min(2, (edges.get(k) ?? 0) + w * q(u)));
  };
  for (const p of posts) {
    const w = p.kind === 'repost' || p.kind === 'quote' ? 1 : p.kind === 'reply' ? 0.5 : 0;
    if (w && p.ref_author_id) { addEdge(p.author_id, p.ref_author_id, w); if (per.has(p.ref_author_id)) per.get(p.ref_author_id).amp.add(p.author_id); else get(p.ref_author_id).amp.add(p.author_id); }
    if (p.kind !== 'repost') for (const m of p.mentions ?? []) { const v = byName.get(String(m).toLowerCase()); if (v && v !== p.ref_author_id) addEdge(p.author_id, v, 0.25); }
  }
  const nodes = [...new Set([...per.keys(), ...[...edges.keys()].flatMap((k) => k.split('>'))])];
  const idx = new Map(nodes.map((n, i) => [n, i]));
  const inW = new Array(nodes.length).fill(0); const outW = new Array(nodes.length).fill(0);
  const E = [...edges].map(([k, w]) => { const [u, v] = k.split('>'); const e = [idx.get(u), idx.get(v), w]; outW[e[0]] += w; inW[e[1]] += w; return e; });
  let pr = inW;
  if (E.length >= 200) {
    const n = nodes.length; pr = new Array(n).fill(1 / n);
    for (let it = 0; it < 20; it++) {
      const next = new Array(n).fill(0); let dangling = 0;
      for (let i = 0; i < n; i++) if (!outW[i]) dangling += pr[i];
      for (const [u, v, w] of E) next[v] += (pr[u] * w) / outW[u];
      for (let i = 0; i < n; i++) next[i] = 0.15 / n + 0.85 * (next[i] + dangling / n);
      pr = next;
    }
  }

  // Erken girenler
  const tb = mom?.burst?.start ?? null;
  const sortedTimes = posts.map((p) => p.created_at);
  const early20 = sortedTimes.length ? sortedTimes[Math.floor(sortedTimes.length * 0.2)] : now;
  for (const a of per.values()) {
    for (const p of a.posts) {
      const spread = p.reposts + p.quotes;
      if (p.kind === 'reply' || spread < 5) continue;
      let e;
      if (tb) { // dalga başlangıcından 2 saat önce ile 45 dk sonrası arası "erken" sayılır; ne kadar önce, o kadar yüksek
        const lo = tb - 2 * HOUR; const hi = tb + 45 * MIN;
        e = p.created_at >= lo && p.created_at <= hi ? 1 - 0.5 * (p.created_at - lo) / (hi - lo) : 0;
      } else e = p.created_at <= early20 ? 1 : 0;
      a.bestEarly = Math.max(a.bestEarly, e * Math.log(1 + spread));
    }
  }

  const list = [...per.values()].filter((a) => users.has(a.id));
  const prP = pctRank(list.map((a) => pr[idx.get(a.id)] ?? 0));
  const eP = pctRank(list.map((a) => Math.log(1 + a.E)));
  const fP = pctRank(list.map((a) => Math.log(1 + users.get(a.id).followers)));
  const emP = pctRank(list.map((a) => a.bestEarly));
  const erRaw = list.map((a) => (a.originals ? a.E / (a.n * (users.get(a.id).followers + 500)) : 0));
  const medER = median(erRaw.filter((x) => x > 0));
  const er = list.map((a, i) => (a.n * erRaw[i] + 2 * medER) / (a.n + 2));
  const eligible = list.map((a) => { const u = users.get(a.id); return u.followers >= 2000 && u.followers <= 150000 && S.get(a.id) < 0.3 && a.originals >= 1; });
  const erP = pctRank(er.filter((_, i) => eligible[i])); const ampP = pctRank(list.filter((_, i) => eligible[i]).map((a) => a.amp.size));
  let ei = 0;
  const totalE = sum(list.map((a) => a.E)) || 1;
  const rowsOut = list.map((a, i) => {
    const u = users.get(a.id); const qa = q(a.id);
    const row = { id: a.id, username: u.username, name: u.name, followers: u.followers, verified: u.verified, avatar: u.avatar,
      posts: a.n, originals: a.originals, engagement: Math.round(a.E), spread: a.rp, amplifiers: a.amp.size, suspicion: S.get(a.id),
      shareE: a.E / totalE,
      influence: qa * (0.4 * prP[i] + 0.35 * eP[i] + 0.25 * fP[i]),
      early: a.bestEarly > 0 ? qa * emP[i] : 0, bridge: 0,
      topPostId: a.posts.sort((x, y) => engagement(y) - engagement(x))[0]?.id ?? null };
    if (eligible[i]) { row.bridge = qa * (0.5 * erP[ei] + 0.3 * ampP[ei] + 0.2 * Math.min(a.n, 5) / 5) + (a.repliesOut ? 0.05 : 0); ei++; }
    return row;
  });
  const top = (key, n = 12) => rowsOut.filter((r) => r[key] > 0).sort((x, y) => y[key] - x[key]).slice(0, n);
  const suspicious = [...S.values()].filter((s) => s >= 0.5).length;
  const suspPosts = posts.filter((p) => (S.get(p.author_id) ?? 0) >= 0.5).length;
  return {
    influencers: top('influence').map((r) => ({ ...r, tier: r.followers > 500000 ? 'İzle' : 'Paylaşım iste', reason: `${fmt(r.engagement)} etkileşim · ${fmt(r.spread)} yeniden paylaşım/alıntı` })),
    early: top('early', 8).filter((r) => r.early >= 0.5).map((r) => ({ ...r, tier: 'Temas et', reason: 'Dalga büyümeden önce paylaştı ve yayıldı' })),
    bridges: top('bridge', 10).map((r) => ({ ...r, tier: 'Temas et', reason: `Takipçisine göre yüksek etkileşim (${fmt(r.posts)} gönderi, ${fmt(r.engagement)} etkileşim)` })),
    uniqueAuthors: per.size, inorganicShare: posts.length ? suspPosts / posts.length : 0, suspiciousAccounts: suspicious, dupAuthors: dupAuthors.size,
  };
}

// ---------------------------------------------------------------- 4. İçerik
const ALARM = ['boykot', 'rezalet', 'skandal', 'istifa', 'utanç', 'utanmaz', 'yazıklar', 'şikayet', 'dolandır', 'yalan', 'protesto',
  'kınıyor', 'tepki', 'mağdur', 'haksız', 'sahtekar', 'kriz', 'ifşa', 'linç', 'hesap sor', 'yuh', 'ayıp', 'felaket'].map((w) => fold(w));

export function alarmHit(text) { const t = fold(String(text ?? '').toLocaleLowerCase('tr-TR')); return ALARM.find((w) => t.includes(w)) ?? null; }

export function content(posts, users, now) {
  const own = posts.filter((p) => p.kind !== 'repost');
  const hot = own.map((p) => ({ p, H: (engagement(p) + 1) / ((now - p.created_at) / HOUR + 2) ** 1.5 }))
    .sort((a, b) => b.H - a.H);
  const view = ({ p, H }) => {
    const u = users.get(p.author_id);
    return { id: p.id, text: p.text, created_at: p.created_at, kind: p.kind, likes: p.likes, reposts: p.reposts, replies: p.replies, quotes: p.quotes,
      engagement: Math.round(engagement(p)), heat: H, username: u?.username ?? null, name: u?.name ?? null, followers: u?.followers ?? 0, has_media: p.has_media };
  };
  // Biçim etkisi: olgunlaşmış özgün gönderiler
  const mature = own.filter((p) => p.kind !== 'reply' && now - p.created_at >= 3 * HOUR);
  const y = (p) => Math.log(1 + engagement(p) / ((users.get(p.author_id)?.followers ?? 0) + 1000));
  const feats = [
    ['Görsel/video', (p) => p.has_media], ['Bağlantı', (p) => (p.urls ?? []).length > 0], ['Alıntı', (p) => p.kind === 'quote'],
    ['Soru', (p) => /\?|\b(mı|mi|mu|mü)\b/i.test(p.text ?? '')], ['Kısa metin (<100)', (p) => (p.text ?? '').length < 100],
    ['Uzun metin (>200)', (p) => (p.text ?? '').length > 200], ['3+ etiket', (p) => (p.hashtags ?? []).length >= 3],
  ];
  const formats = [];
  for (const [label, f] of feats) {
    const a = mature.filter(f); const b = mature.filter((p) => !f(p));
    if (a.length < 20 || b.length < 20) continue;
    const lift = Math.exp(median(a.map(y)) - median(b.map(y)));
    if (lift >= 1.3 || lift <= 0.77) formats.push({ label, lift, n: a.length });
  }
  formats.sort((a, b) => b.lift - a.lift);
  // Saatler
  const byHour = Array.from({ length: 24 }, () => []);
  for (const p of mature) byHour[hourTR(p.created_at)].push(y(p));
  const hourN = new Array(24).fill(0);
  for (const p of own) hourN[hourTR(p.created_at)]++;
  const hours = byHour.map((v, h) => ({ hour: h, n: hourN[h], matured: v.length, score: v.length ? median(v) : 0 }));
  const bestHours = hours.filter((h) => h.matured >= 20).sort((a, b) => b.score - a.score).slice(0, 3);
  // Tepki sinyali
  const recent = own.filter((p) => p.created_at >= now - 2 * HOUR); const before = own.filter((p) => p.created_at < now - 2 * HOUR && p.created_at >= now - 14 * HOUR);
  const alarmHits = new Map();
  const alarmShare = (list, track) => (list.length ? list.filter((p) => {
    const t = fold((p.text ?? '').toLocaleLowerCase('tr-TR'));
    const hit = ALARM.find((w) => t.includes(w));
    if (hit && track) alarmHits.set(hit, (alarmHits.get(hit) ?? 0) + 1);
    return !!hit;
  }).length / list.length : 0);
  const contro = own.filter((p) => engagement(p) >= 20).map((p) => (p.replies + p.quotes) / (p.likes + p.reposts + 1));
  return {
    topPosts: hot.slice(0, 15).map(view), hottest: hot[0] ? view(hot[0]) : null, hotCount: hot.length,
    formats, hours, bestHours,
    reaction: { alarmNow: alarmShare(recent, true), alarmBefore: alarmShare(before, false), nNow: recent.length,
      controversy: median(contro), terms: [...alarmHits].sort((a, b) => b[1] - a[1]).slice(0, 3).map((x) => x[0]) },
    totalEngagement: Math.round(sum(own.map(engagement))),
  };
}

// ---------------------------------------------------------------- 5. Öneri kartları
function buildCards({ mom, terms, acc, con, sampleN, client }) {
  const cards = [];
  const add = (id, priority, kind, title, action, extra = {}) => cards.push({ id, priority, kind, title, action, ...extra });
  const m = mom;
  if (m.ratio >= 2 && m.z >= 3 && m.last30 >= 20) {
    add('hizlanma', 1, 'momentum', `Konu son 30 dakikada ${fmt1(m.ratio)} kat hızlandı (${fmt(m.last30)} gönderi, olağanın ${fmt1(m.last30 / Math.max(1, m.baseline30))} katı).`,
      'Pencere açık: şimdi paylaşım yapılması önerilir.');
  } else if (m.stage === 'emerging') {
    add('yukselis', 1, 'momentum', 'Konu yeni kıpırdanıyor; henüz zirve yapmadı.', 'Erken konumlanın: ilk içeriği 30 dakika içinde çıkarmak avantaj sağlar.');
  } else if (m.stage === 'accelerating') {
    add('hizlaniyor', 1, 'momentum', `Konu hızlanmayı sürdürüyor (şu an ~${fmt1(m.velocity)} gönderi/dk).`, 'Görünürlük için uygun an; hazır içerik varsa bekletmeyin.');
  }
  if (m.stage === 'peak') add('zirve', 2, 'momentum', `Konu zirvede; hacim ~${fmt1(m.velocity)} gönderi/dk düzeyinde sabitlendi.`, 'Yeni içerik yerine öne çıkan gönderilere yanıt/alıntı ile görünür olun.');
  if (m.stage === 'declining') add('dusus', 2, 'momentum', `İlgi sönüyor (son 30 dk önceki 30 dk'ya göre %${fmt(Math.max(0, (1 - m.ratio) * 100))} azaldı).`, 'Yeni yatırım yapmayın; özet ya da kapanış içeriği yeterli.');

  if (sampleN >= 100) {
    const sens = (client?.sensitive ?? []).map((s) => foldKey(s)).filter(Boolean);
    for (const t of terms.terms.filter((x) => x.rising).slice(0, 3)) {
      const sensitive = sens.some((s) => t.key.includes(s));
      if (t.hashtag && t.isNew) add('etiket:' + t.key, 2, 'term', `Yeni etiket ortaya çıktı: ${t.term} (${fmt(t.y1)} hesap kullandı).`, 'Mesajınıza uygunsa bu etiketi kullanın.', { term: t.term, sensitive });
      else if (t.zeta >= 3.5) add('terim:' + t.key, 1, 'term', `Alt başlık yükseliyor: “${t.term}” (${fmt(t.y1)} hesap, önceki döneme göre ${fmt1(t.lift)} kat).`, 'Bu açıdan içerik üretilmesi önerilir.', { term: t.term, sensitive });
      if (sensitive) add('hassas:' + t.key, 1, 'risk', `Dikkat: yükselen “${t.term}” başlığı danışanın hassas konularıyla örtüşüyor.`, 'Paylaşımdan önce mesajı ve tonu gözden geçirin.');
    }
    if (acc.early.length && m.burst) add('erken', 1, 'account', `Şu hesaplar erken girdi ve yayılıyor: ${acc.early.slice(0, 3).map((a) => '@' + a.username).join(', ')}.`, 'Temas ve etkileşim önerilir (yanıt, alıntı, doğrudan mesaj).', { accounts: acc.early.slice(0, 3).map((a) => a.username) });
    const strong = acc.bridges.filter((b) => b.bridge >= 0.7);
    if (strong.length >= 3) add('kopru', 2, 'account', `Ulaşılabilir yayıcılar: ${strong.slice(0, 4).map((a) => '@' + a.username).join(', ')}.`, 'Gönderilerine yanıt verin; içeriğinizi paylaşmalarını isteyin.', { accounts: strong.slice(0, 4).map((a) => a.username) });
    const dom = acc.influencers.find((a) => a.shareE > 0.3);
    if (dom) add('baskin', 2, 'account', `Konuyu büyük ölçüde @${dom.username} sürüklüyor (etkileşimin %${fmt(dom.shareE * 100)}'i).`, 'O hesabın öne çıkan gönderisine alıntı ya da yanıtla eklemlenin.', { accounts: [dom.username] });
    const h = con.hottest;
    if (h && Date.now() - h.created_at < 2 * HOUR && h.engagement >= 30) add('sicak:' + h.id, 1, 'post', `Bu gönderi hızla yayılıyor: @${h.username} (${fmt(h.engagement)} etkileşim).`, 'İlk saat içinde yanıt vermek görünürlük sağlar.', { postId: h.id });
    const f = con.formats.find((x) => x.lift >= 1.5);
    if (f) add('bicim', 3, 'content', `“${f.label}” içeren gönderiler yaklaşık ${fmt1(f.lift)} kat daha fazla etkileşim alıyor (${fmt(f.n)} gönderi).`, 'Paylaşımda bu biçimi tercih edin.');
    if (con.bestHours.length) add('saat', 3, 'content', `Bu konuda en yüksek etkileşim ${con.bestHours.map((x) => `${String(x.hour).padStart(2, '0')}:00`).join(', ')} saatlerinde gözlendi.`, 'Paylaşımı bu saatlere planlayın (yalnızca bu konuda gözlenen veriye dayanır).');
    if (acc.inorganicShare >= 0.25 || acc.dupAuthors >= 10) add('inorganik', 1, 'risk', `Hacmin yaklaşık %${fmt(acc.inorganicShare * 100)}'i şüpheli ya da kopya içerikli hesaplardan geliyor.`, 'Organik ilgi daha düşük olabilir; rakamları temkinli aktarın.');
    const r = con.reaction;
    if ((r.nNow >= 30 && r.alarmNow >= 0.1 && r.alarmNow >= 2 * r.alarmBefore) || r.controversy > 1) add('tepki', 1, 'risk', `Tepki sinyali yükseliyor${r.terms.length ? ` (“${r.terms.join('”, “')}”)` : ''}.`, 'Paylaşımdan önce tonu gözden geçirin; gerekiyorsa kriz planını hazır tutun.');
  }
  return cards.sort((a, b) => a.priority - b.priority);
}

// ---------------------------------------------------------------- Ana giriş
// rangeMs: ekranda seçilen zaman aralığı. posts: aralıktaki örneklem (zamana göre artan). users: Map(id -> kullanıcı).
export function analyze({ countsMin, countsHour, posts, users, queryWords = [], now = Date.now(), rangeMs = 24 * HOUR, client = null }) {
  const mom = momentum(countsMin, countsHour, now);
  const since = now - rangeMs;
  const inRange = posts.filter((p) => p.created_at >= since);
  const terms = risingTerms(posts, queryWords, now);
  const acc = accounts(inRange, users, mom, now);
  const con = content(inRange, users, now);

  // Grafik serisi: kısa aralıkta 5 dk, 24 saate kadar 15 dk, üstünde saatlik
  let series; let stepMs;
  if (rangeMs <= 6 * HOUR) { stepMs = 5 * MIN; series = mom.bins.filter((b) => b.ts >= since); } else if (rangeMs <= 24 * HOUR) {
    stepMs = 15 * MIN; const m = new Map();
    for (const b of mom.bins) if (b.ts >= since) { const k = Math.floor(b.ts / stepMs) * stepMs; m.set(k, (m.get(k) ?? 0) + b.n); }
    series = [...m].map(([ts, n]) => ({ ts, n }));
    if (series.length && series[series.length - 1].ts + stepMs > now) series.pop();
  } else { stepMs = HOUR; series = countsHour.filter((c) => c.ts >= since && c.ts + HOUR <= now); }

  const totalCount = rangeMs <= 24 * HOUR ? sum(countsMin.filter((c) => c.ts >= since).map((c) => c.n)) : sum(countsHour.filter((c) => c.ts >= since).map((c) => c.n));
  const prevCount = sum(countsHour.filter((c) => c.ts >= since - rangeMs && c.ts < since).map((c) => c.n));
  const hasPrev = countsHour.length && countsHour[0].ts <= since - rangeMs + HOUR;
  const lastHour = sum(countsMin.filter((c) => c.ts >= now - HOUR).map((c) => c.n));
  const sampleN = inRange.length;
  const coverage = totalCount ? Math.min(1, sampleN / totalCount) : 0;
  const confidence = coverage >= 0.5 || sampleN >= 1000 ? 'Yüksek' : sampleN >= 200 ? 'Orta' : 'Düşük';
  const cards = buildCards({ mom, terms, acc, con, sampleN, client });
  const { bins, ...momOut } = mom;
  return {
    now, rangeMs, momentum: momOut, series, stepMs,
    kpi: { total: totalCount, change: hasPrev && prevCount ? (totalCount - prevCount) / prevCount : null, perHour: lastHour,
      uniqueAuthors: acc.uniqueAuthors, engagement: con.totalEngagement },
    sample: { n: sampleN, coverage, confidence },
    terms, accounts: acc, content: con, cards,
  };
}
