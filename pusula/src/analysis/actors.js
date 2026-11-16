// Aktörler ve açıklanabilir rol ataması. Notlar sıralama bildirir ("ardından"), neden-sonuç iddia etmez.
import { fmtNum, fmtTime } from './util.js';
import { jumpAt, isJump, jumpText } from './cascade.js';

const MAX = 25;

export function buildActors(ctx, narrs, coord, cas) {
  const by = new Map();
  for (const d of ctx.docs) {
    let a = by.get(d.authorId);
    if (!a) by.set(d.authorId, (a = { id: d.authorId, au: d.it.author || {}, docs: [], eng: 0, reach: 0, st: {}, nids: new Set(), media: false, sources: new Set() }));
    a.docs.push(d); a.eng += d.eng;
    a.reach += Math.max(d.it.metrics?.views || 0, d.followers);
    a.st[d.stance] = (a.st[d.stance] || 0) + 1;
    if (d.nid) a.nids.add(d.nid);
    if (d.isMedia) a.media = true;
    if (d.followers > (a.followers || 0)) a.followers = d.followers;
    a.sources.add(d.it.source);
  }
  const origins = new Map(); // authorId -> anlatı
  for (const n of narrs) if (n.count >= 3 && !origins.has(n.origin.authorId)) origins.set(n.origin.authorId, n);
  const mainOrigin = cas.originDoc?.authorId;
  // Platform geçişi: olayın köken kaynağından farklı bir kaynakta ilk paylaşan
  const bridge = new Map();
  if (cas.originDoc) {
    const seen = new Set([cas.originDoc.it.source, 'haber']);
    for (const d of ctx.docs) if (cas.eventIds.has(d.nid) && d.it.source && !seen.has(d.it.source)) { seen.add(d.it.source); bridge.set(d.authorId, d.it.source); }
  }
  const evDocs = cas.eventIds.size ? ctx.docs.filter((d) => cas.eventIds.has(d.nid)) : ctx.docs;
  const engCut = evDocs.map((d) => d.eng).sort((x, y) => y - x)[Math.min(9, evDocs.length - 1)] || 0;
  const defN = new Set(narrs.filter((n) => n.kind === 'savunma').map((n) => n.id));

  // Hız: ayrıntılı rol çözümlemesi yalnızca aday hesaplara (özel rol adayları + en yüksek puanlı 80)
  const base = (a) => 2 * Math.log10(1 + a.eng) + Math.log10(1 + (a.followers || 0)) + Math.min(a.docs.length, 5) * 0.3;
  let pool = [...by.values()];
  if (pool.length > 200) {
    const special = [], plain = [];
    for (const a of pool) (origins.has(a.id) || a.media || coord.suspects.has(a.id) || bridge.has(a.id) || a.followers >= 10_000 ? special : plain).push(a);
    for (const a of plain) a.base = base(a);
    plain.sort((x, y) => y.base - x.base);
    special.sort((x, y) => base(y) - base(x));
    pool = special.slice(0, 300).concat(plain.slice(0, 80));
  }
  const out = [];
  for (const a of pool) {
    a.followers = a.followers || 0;
    const stance = Object.entries(a.st).sort((x, y) => y[1] - x[1] || (x[0] < y[0] ? -1 : 1))[0][0];
    const first = a.docs[0];
    let role, note, bonus = 0;
    const on = origins.get(a.id);
    const sus = coord.suspects.get(a.id);
    let jump = null;
    if (a.followers >= 10_000 || a.docs.some((d) => d.eng >= engCut && d.eng > 0)) {
      const d = a.docs.find((x) => !x.isRepost && (!cas.eventIds.size || cas.eventIds.has(x.nid))) ;
      if (d && d !== cas.originDoc) { const j = jumpAt(cas.times, d.t, ctx.now); if (isJump(j)) jump = j; }
    }
    if (a.docs[0].own) {
      role = 'savunucu'; bonus = 6;
      note = `Danışanın kendi hesabı; ${a.docs.length} paylaşım yaptı.`;
    } else if (on && (a.id === mainOrigin || !sus)) {
      role = 'kaynak'; bonus = a.id === mainOrigin ? 100 : 6;
      note = `“${on.label}” konusunu ilk paylaşan hesap (saat ${fmtTime(on.origin.t)}).`;
    } else if (a.media) {
      role = 'medya'; bonus = 6;
      note = `Medya kuruluşu; konuyu saat ${fmtTime(first.t)} itibarıyla işledi (${a.docs.length} içerik).`;
    } else if (sus) {
      role = 'şüpheli'; bonus = 3;
      note = sus.kind === 'kopya-metin' ? 'Başka hesaplarla neredeyse aynı metni kısa sürede paylaştı.' : sus.kind === 'eşzamanlı' ? 'Aynı gönderiyi başka yeni hesaplarla aynı dakikalarda yeniden paylaştı.' : 'Yeni açılmış hesapların yığıldığı dakikalarda paylaşım yaptı.';
    } else if (jump) {
      role = 'yükseltici'; bonus = 8;
      note = `Paylaşımının ardından ${jumpText(jump)}.`;
    } else if (bridge.has(a.id)) {
      role = 'köprü'; bonus = 5;
      note = `Konuyu ${bridge.get(a.id) === 'bluesky' ? 'Bluesky' : bridge.get(a.id)} tarafında ilk paylaşan hesap.`;
    } else if (stance === 'destek' || [...a.nids].some((n) => defN.has(n)) && stance !== 'elestiri' && stance !== 'alay') {
      role = 'savunucu'; bonus = 2;
      note = `Danışanı destekleyen ${a.docs.length} paylaşım yaptı.`;
    } else if (a.nids.size >= 3) {
      role = 'köprü'; bonus = 2;
      note = `${a.nids.size} ayrı konuda paylaşım yaptı.`;
    } else {
      role = 'yükseltici';
      note = a.followers >= 100_000 ? `Geniş kitleli hesap (${fmtNum(a.followers)} takipçi); ${a.docs.length} paylaşım.` : `En çok etkileşim alan hesaplardan: ${a.docs.length} paylaşım, ${fmtNum(a.eng)} etkileşim.`;
    }
    out.push({ score: bonus + 2 * Math.log10(1 + a.eng) + Math.log10(1 + a.followers) + Math.min(a.docs.length, 5) * 0.3,
      pub: { id: a.id, handle: a.au.handle ?? null, name: a.au.name ?? null, followers: a.followers, verified: !!a.au.verified, kind: a.au.kind || 'bilinmiyor',
        role, items: a.docs.length, reach: a.reach, engagement: a.eng, firstAt: first.t, stance, narrativeIds: [...a.nids], note } });
  }
  out.sort((x, y) => y.score - x.score || (String(x.pub.id) < String(y.pub.id) ? -1 : 1));
  // Şüpheli hesaplara en çok 6 yer; varsa en az 3'ü listede kalsın
  const reserved = out.filter((o) => o.pub.role === 'şüpheli').slice(0, 3);
  const picked = [];
  let sus = reserved.length;
  for (const o of out) {
    if (picked.length >= MAX - reserved.length) break;
    if (reserved.includes(o)) continue;
    if (o.pub.role === 'şüpheli' && ++sus > 6) continue;
    picked.push(o);
  }
  const res = picked.concat(reserved).sort((x, y) => y.score - x.score).map((o) => o.pub);
  return res;
}
