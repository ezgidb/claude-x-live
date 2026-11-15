// Anlık görüntü farkından olay üretimi: yalnızca anlamlı değişim, deterministik id.
import { fmtNum, fmtTime, handleOf } from './util.js';
import { levelIdx } from './risk.js';

const NEW_NARR = 8, COUNTER_MIN = 3;
const MILESTONES = [50, 100, 250, 500, 1000, 2500, 5000, 10000];
const milestone = (n) => { let m = 0; for (const x of MILESTONES) if (n >= x) m = x; return m; };

export function diffEvents(prev, next, { client, items } = {}) {
  if (!next) return [];
  const cid = next.clientId ?? client?.id ?? 'd';
  const name = client?.name || 'Danışan';
  const at = next.at, out = [];
  const ev = (kind, key, level, title, detail, extra) => out.push({ id: `${cid}:${kind}:${key}`, clientId: cid, at, kind, level, title, detail, ...extra });
  const top = next.risk.drivers.filter((d) => d.weight > 0).slice(0, 2).map((d) => d.note).join(' ');
  const pi = prev ? levelIdx(prev.risk?.level) : 0, ni = levelIdx(next.risk.level);

  // Olay açılışı / soğuması
  const pInc = prev?.incident || null, nInc = next.incident;
  let opened = false;
  if (nInc && nInc.status === 'açık' && (!pInc || pInc.id !== nInc.id)) {
    opened = true;
    ev('olay-açıldı', nInc.id, 'alarm', `${name}: olay açıldı`, `${nInc.headline}. Risk ${next.risk.score}/100 (${next.risk.level}). ${top}`.trim(), { narrativeId: nInc.narrativeId || undefined });
  } else if (pInc && pInc.status === 'açık' && nInc && nInc.status === 'soğuyor') {
    ev('olay-soğudu', `${nInc.id}:soğuyor`, 'bilgi', `${name}: olay soğuyor`, `Hacim ve risk geriledi (risk ${next.risk.score}/100). Bir süre daha izlenecek.`);
  } else if (pInc && !nInc) {
    ev('olay-soğudu', `${pInc.id}:kapandı`, 'bilgi', `${name}: olay kapandı`, `Konuşma olağan düzeye indi (son 1 saatte ${next.pulse.rate1h} gönderi).`);
  }
  // Risk düzeyi değişimi
  if (ni > pi && !opened && (prev || ni >= 1)) {
    ev('risk-yükseldi', `${next.risk.level}:${at}`, ni >= 2 ? 'alarm' : 'dikkat', `${name}: risk ${next.risk.level} düzeye çıktı`, `Risk ${next.risk.score}/100. ${top}`.trim());
  } else if (prev && ni < pi) {
    ev('risk-düştü', `${next.risk.level}:${at}`, 'bilgi', `${name}: risk ${next.risk.level} düzeye indi`, `Risk ${next.risk.score}/100. Son 1 saatte ${next.pulse.rate1h} gönderi.`);
  }
  if (!prev) return out;

  // Anlatılar
  const pN = new Map((prev.narratives || []).map((n) => [n.id, n]));
  const attackOn = next.narratives.some((n) => n.kind === 'saldırı' && n.count >= NEW_NARR) || !!nInc;
  for (const n of next.narratives) {
    const p = pN.get(n.id);
    if (n.kind === 'savunma' && attackOn) {
      if (n.count >= COUNTER_MIN && !(p && p.kind === 'savunma' && p.count >= COUNTER_MIN)) {
        ev('karşı-anlatı', n.id, 'bilgi', 'Karşı görüş belirdi', `“${n.label}” başlığında danışanı savunan ${n.count} gönderi var.`, { narrativeId: n.id, itemId: n.originItemId });
      }
      continue;
    }
    if (n.count >= NEW_NARR && (!p || p.count < NEW_NARR)) {
      ev('yeni-anlatı', n.id, n.kind === 'saldırı' ? 'dikkat' : 'bilgi', n.kind === 'saldırı' ? 'Yeni eleştirel konu' : 'Yeni konu',
        `“${n.label}”: ${n.count} gönderi, ilk görülme ${fmtTime(n.firstSeen)}.`, { narrativeId: n.id, itemId: n.originItemId });
    } else if (p && n.kind !== 'savunma' && n.status === 'büyüyor' && n.velocity >= 1.3 && milestone(n.count) > milestone(p.count)) {
      const m = milestone(n.count);
      ev('anlatı-büyüyor', `${n.id}:${m}`, n.kind === 'saldırı' ? 'dikkat' : 'bilgi', 'Konu büyüyor', `“${n.label}” ${m} gönderiyi geçti; son 1 saatte hız ${String(n.velocity).replace('.', ',')} kat.`, { narrativeId: n.id });
    }
  }
  // Büyük hesap ve medya girişi (önceki anlık görüntüden sonra ilk kez görünenler)
  const pA = new Set((prev.actors || []).map((a) => a.id));
  const nA = new Map(next.actors.map((a) => [a.id, a]));
  const firsts = new Map();
  for (const it of items || []) {
    if (!it?.author || it.createdAt > at || it.createdAt <= at - 86_400_000) continue;
    const id = it.author.id ?? it.author.handle;
    const f = firsts.get(id);
    if (!f || it.createdAt < f.createdAt) firsts.set(id, it);
  }
  const bigs = [], medias = [];
  for (const [id, it] of firsts) {
    if (it.createdAt < prev.at || pA.has(id)) continue;
    const media = it.author.kind === 'medya' || it.source === 'haber';
    if (media) medias.push([id, it]); else if ((it.author.followers || 0) >= 100_000) bigs.push([id, it]);
  }
  const neg = (id, it) => { const s = nA.get(id)?.stance ?? it.enr?.stance; return s === 'elestiri' || s === 'alay'; };
  bigs.sort((a, b) => b[1].author.followers - a[1].author.followers);
  for (const [id, it] of bigs.slice(0, 3)) {
    const bad = neg(id, it), sup = (nA.get(id)?.stance ?? it.enr?.stance) === 'destek';
    ev('büyük-hesap', id, bad ? (it.author.followers >= 1e6 ? 'alarm' : 'dikkat') : 'bilgi', 'Büyük hesap konuya girdi',
      `${handleOf(it.author)} (${fmtNum(it.author.followers)} takipçi) ${bad ? 'eleştirel bir paylaşım yaptı' : sup ? 'destekleyen bir paylaşım yaptı' : 'konu hakkında paylaşım yaptı'}.`, { actorId: id, itemId: it.id });
  }
  medias.sort((a, b) => a[1].createdAt - b[1].createdAt);
  for (const [id, it] of medias.slice(0, 3)) {
    const hot = neg(id, it) || ni >= 1 || !!nInc;
    ev('medya-girdi', id ?? it.id, hot ? 'dikkat' : 'bilgi', 'Konu medyada', `${it.author.name || handleOf(it.author)} konuyu haberleştirdi.`, { actorId: id, itemId: it.id });
  }
  // Yeni koordinasyon bulgusu
  const pC = new Set((prev.coordination || []).map((c) => c.id));
  for (const c of next.coordination) {
    if (pC.has(c.id)) continue;
    ev('koordinasyon', c.id, c.score >= 0.8 ? 'alarm' : 'dikkat', 'Şüpheli eşgüdüm izi', c.note, { itemId: c.itemIds[0] });
  }
  // Zirve
  if (nInc?.peaked && !(pInc && pInc.id === nInc.id && pInc.peaked)) {
    ev('zirve', `${nInc.id}:${nInc.peakAt}`, 'bilgi', `${name}: zirve geride kalmış görünüyor`, `En yoğun an saat ${fmtTime(nInc.peakAt)} civarıydı (saatte ${nInc.peakRate} gönderi); şimdi saatte ${next.pulse.rate1h}.`);
  }
  const rank = { alarm: 0, dikkat: 1, bilgi: 2 };
  return out.sort((a, b) => rank[a.level] - rank[b.level]);
}
