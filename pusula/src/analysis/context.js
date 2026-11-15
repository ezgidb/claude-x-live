// Ham gönderilerden çözümleme bağlamı: pencere, yeniden paylaşım kökleri, belirteçler.
import { DAY, engagement, STANCES } from './util.js';
import { words, stemOf, guessStance, STOP } from './text.js';

const YOUNG_MS = 45 * DAY;

export function buildContext({ client, items, now }) {
  const clientStop = new Set();
  for (const s of [client?.name, ...(client?.terms || [])]) {
    for (const w of words(String(s ?? '').replace(/[@#]/g, ' #'))) clientStop.add(stemOf(w));
  }
  const all = [];
  let coverageStart = Infinity;
  for (const it of items || []) {
    if (!it || typeof it.createdAt !== 'number' || it.createdAt > now) continue;
    all.push(it);
    if (it.createdAt < coverageStart) coverageStart = it.createdAt;
  }
  const byId = new Map();
  for (const it of all) byId.set(it.id, it);
  const win = all.filter((it) => it.createdAt > now - DAY)
    .sort((a, b) => a.createdAt - b.createdAt || (String(a.id) < String(b.id) ? -1 : 1));

  const unitMap = new Map(), units = [], docs = [];
  const df = new Map(), surf = new Map();
  for (const it of win) {
    let src = it, hops = 0;
    while (src.refs?.repostOf && byId.has(src.refs.repostOf) && hops++ < 5) src = byId.get(src.refs.repostOf);
    let unit = unitMap.get(src.id);
    if (!unit) {
      const ws = words(src.text);
      const stems = new Set();
      for (let i = 0; i < ws.length; i++) {
        const w = ws[i];
        if (w.length < 3 || STOP.has(w)) continue;
        const st = w.length > 5 ? w.slice(0, 5) : w;
        if (clientStop.has(st)) continue;
        if (!stems.has(st)) { stems.add(st); df.set(st, (df.get(st) || 0) + 1); }
        const cur = surf.get(st);
        if (cur === undefined || w.length < cur.length || (w.length === cur.length && w < cur)) surf.set(st, w);
      }
      unit = { id: src.id, src, words: ws, stems, label: null, docs: [], guess: null, nar: null };
      const lab = src.enr?.narrative;
      if (typeof lab === 'string' && lab.trim()) unit.label = lab.trim();
      unitMap.set(src.id, unit);
      units.push(unit);
    }
    if (!unit.label && typeof it.enr?.narrative === 'string' && it.enr.narrative.trim()) unit.label = it.enr.narrative.trim();
    const enr = it.enr || src.enr || null;
    if (!enr && !unit.guess) unit.guess = guessStance(unit.words, src.text);
    let stance = enr ? enr.stance : unit.guess.stance;
    if (!STANCES.includes(stance)) stance = 'notr';
    const a = it.author || {};
    const doc = {
      it, t: it.createdAt, unit, isRepost: !!it.refs?.repostOf, enr, stance,
      neg: stance === 'elestiri' || stance === 'alay',
      cta: enr ? !!enr.callToAction : unit.guess.cta,
      claim: !!enr?.claim,
      eng: engagement(it), followers: a.followers || 0,
      authorId: a.id ?? a.handle ?? `?${it.id}`,
      young: typeof a.createdAt === 'number' && it.createdAt - a.createdAt >= 0 && it.createdAt - a.createdAt < YOUNG_MS,
      isMedia: a.kind === 'medya' || it.source === 'haber',
      nid: null,
    };
    unit.docs.push(doc);
    docs.push(doc);
  }
  // Görünen biçim: kökün rastlanan en kısa hâli (çoğunlukla yalın sözcük)
  const surface = (st) => surf.get(st) ?? st;
  const N = units.length || 1;
  const idf = (st) => Math.log(N / (df.get(st) || 1)) + 0.5;
  return { client, now, docs, units, byId, df, idf, surface, clientStop, coverageStart: all.length ? coverageStart : null,
    times: docs.map((d) => d.t), enriched: docs.reduce((n, d) => n + (d.it.enr ? 1 : 0), 0) };
}
