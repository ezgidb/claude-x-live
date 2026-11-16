// Risk puanı (0-100) ve açıklanabilir sürücüler; olay yaşam döngüsü (histerezisli).
import { HOUR, clamp, fmtNum, STANCES } from './util.js';
import { sensitivityStems } from './narratives.js';

const LEVELS = ['yeşil', 'sarı', 'turuncu', 'kırmızı'];
const FLOOR = [0, 25, 50, 75];
export const levelIdx = (l) => Math.max(0, LEVELS.indexOf(l));
const levelOf = (s) => (s >= 75 ? 3 : s >= 50 ? 2 : s >= 25 ? 1 : 0);

export function buildStance(ctx) {
  const c = { destek: 0, elestiri: 0, alay: 0, soru: 0, notr: 0 };
  let n = 0;
  for (let i = ctx.docs.length - 1; i >= 0; i--) {
    const d = ctx.docs[i];
    if (ctx.now - d.t >= 3 * HOUR) break;
    c[d.stance]++; n++;
  }
  const out = {};
  if (!n) { for (const k of STANCES) out[k] = k === 'notr' ? 1 : 0; return { stance: out, n: 0, neg: 0, negShare: 0, hostile: 0, destek: 0 }; }
  let acc = 0;
  for (const k of STANCES) { out[k] = Math.round((c[k] / n) * 1000) / 1000; acc += out[k]; }
  out.notr = Math.round((out.notr + 1 - acc) * 1000) / 1000;
  const neg = c.elestiri + c.alay;
  return { stance: out, n, neg, negShare: neg / n, hostile: Math.min(1, (neg + 0.5 * c.soru) / n), destek: c.destek / n };
}

export function buildRisk(ctx, { pulse, st, narrs, coord, forecast, prev }) {
  const { now, client } = ctx;
  const sens = sensitivityStems(client);
  let reach = 0, cta = 0, n3 = 0, sensHit = 0, big = null, media = null;
  for (let i = ctx.docs.length - 1; i >= 0; i--) {
    const d = ctx.docs[i], age = now - d.t;
    if (age >= 6 * HOUR) break;
    const hostile = d.stance !== 'destek';
    if (hostile && !d.isMedia && !d.own && d.followers >= 100_000 && (d.neg || d.stance === 'soru' || narrKind(narrs, d.nid) === 'saldırı' || pulse.z >= 4) && (!big || d.followers > big.followers)) big = d;
    if (hostile && d.isMedia && (d.neg || narrKind(narrs, d.nid) === 'saldırı')) media = media || d;
    if (age >= 3 * HOUR) continue;
    n3++;
    if (d.neg) {
      reach += d.followers;
      if (sens.size) { for (const s of d.unit.stems) if (sens.has(s)) { sensHit++; break; } }
    }
    if (d.cta && hostile) cta++;
  }
  const negTone = clamp((st.hostile - 0.1) / 0.25);          // olumlu dalga risk sayılmaz
  // Mutlak büyüklük: son 3 saatte birkaç düzine gönderilik dalga, binlik dalgayla aynı puanı almaz
  const mag = 0.6 + 0.4 * clamp(Math.log10(Math.max(n3, 1) / 50) / Math.log10(20));
  const drivers = [];
  const add = (key, weight, note) => { weight = Math.round(weight * mag * 10) / 10; if (weight >= 0.5) drivers.push({ key, weight, note }); return weight; };

  const zF = clamp((pulse.z - 1.5) / 8.5), absF = clamp(Math.log10(Math.max(pulse.rate1h, 1) / 8) / Math.log10(40));
  const kat = pulse.baseline1h >= 1 ? ` (yaklaşık ${Math.max(1, Math.round(pulse.rate1h / pulse.baseline1h))} kat)` : '';
  add('hacim', 22 * zF * (0.4 + 0.6 * absF) * negTone, `Son 1 saatte ${pulse.rate1h} gönderi var; olağan düzey saatte ${Math.round(pulse.baseline1h)}${kat}.`);
  const negF = clamp((st.hostile - 0.15) / 0.35), volF = clamp(Math.log10(Math.max(st.neg, 1) / 5) / Math.log10(40));
  add('olumsuz', 20 * negF * volF, `Son 3 saatteki gönderilerin yüzde ${Math.round(st.negShare * 100)} kadarı eleştiri ya da alay (${st.neg} gönderi).`);
  const reachPts = add('erişim', 14 * clamp((Math.log10(reach + 1) - 4.5) / 2.5), `Olumsuz gönderileri paylaşan hesapların toplam takipçisi yaklaşık ${fmtNum(reach)}.`);
  let bm = 0; const bmNote = [];
  if (big) { bm += big.followers >= 1e6 ? 8 : 5; bmNote.push(`${fmtNum(big.followers)} takipçili bir hesap konuya girdi`); }
  if (media) { bm += 4; bmNote.push('konu medyada yer aldı'); }
  const bmPts = add('büyük-hesap-medya', Math.min(12, bm), bmNote.length ? bmNote.join('; ').replace(/^./, (ch) => ch.toLocaleUpperCase('tr')) + '.' : '');
  const sensShare = st.neg ? sensHit / st.neg : 0;
  add('hassas-konu', sensHit >= 3 ? 10 * clamp(sensShare / 0.2, 0.4, 1) * Math.max(volF, 0.3) : 0,
    `Olumsuz gönderilerin ${sensHit} tanesi danışanın hassas konularına değiniyor (${(client?.sensitivities || []).join(', ')}).`);
  const ctaShare = n3 ? cta / n3 : 0;
  add('çağrı', cta >= 20 || (cta >= 5 && ctaShare >= 0.15) ? 8 : cta >= 5 ? 4 : 0, `${cta} gönderide boykot, şikâyet ya da “paylaşın” çağrısı var.`);
  const topC = coord.findings[0];
  const coPts = add('koordinasyon', topC ? 8 * topC.score : 0, topC ? `Şüpheli eşgüdüm izi: ${topC.accounts.length} hesaplık bir küme.` : '');
  const sp = pulse.trend === 'patlama' ? 6 : pulse.trend === 'yükseliyor' ? 4 : forecast.direction === 'artış' ? 2 : 0;
  add('hız', sp * negTone, pulse.trend === 'patlama' ? 'Hacim çok hızlı artıyor.' : 'Hacim artmayı sürdürüyor.');

  let score = drivers.reduce((s, d) => s + d.weight, 0);
  // Yayılım sınırlıysa (büyük hesap, medya, geniş erişim, eşgüdüm yok) sarıyı geçmez
  if (!bmPts && reachPts < 5 && !coPts && score > 45) {
    score = 45;
    drivers.push({ key: 'sınırlı-yayılım', weight: 0, note: 'Konu şimdilik küçük hesaplar arasında; büyük hesap ya da medya ilgisi görülmedi.' });
  }
  score = Math.round(clamp(score, 0, 100));
  let li = levelOf(score);
  // Histerezis: bir alt düzeye inmek için eşiğin belirgin altına düşmeli
  if (prev?.risk && now - prev.at <= 2 * HOUR) {
    const pi = levelIdx(prev.risk.level);
    if (li < pi && score >= FLOOR[pi] - 4) li = pi;
  }
  drivers.sort((a, b) => b.weight - a.weight);
  return { score, level: LEVELS[li], drivers };
}
function narrKind(narrs, nid) { if (!nid) return null; for (const n of narrs) if (n.id === nid) return n.kind; return null; }

// Olay: risk turuncu+ (ya da çok yüksek z + olumsuz ton) ile açılır; soğuyunca 'soğuyor', sonra kapanır.
export function buildIncident(ctx, { pulse, risk, st, cas, prev }) {
  const { now, client } = ctx;
  const p = prev?.incident || null;
  const hot = risk.score >= 50 || (pulse.z >= 12 && pulse.rate1h >= 150 && st.hostile >= 0.35 && risk.score >= 40);
  const name = client?.name || 'Danışan';
  const topic = cas.focus ? `“${cas.focus.label}”` : 'olumsuz gönderiler';
  let inc = null;
  if (!p) {
    if (hot) {
      const startedAt = cas.originDoc && cas.originDoc.t > now - 24 * HOUR ? cas.originDoc.t : now;
      inc = { id: `${client?.id ?? 'd'}:olay:${startedAt}`, startedAt, status: 'açık', openedAt: now, coolingSince: null, peakRate: 0, peakAt: now, peaked: false };
    }
  } else if (p.status === 'açık') {
    inc = { ...p };
    if (risk.score < 40 && !hot) { inc.status = 'soğuyor'; inc.coolingSince = now; }
  } else {
    if (risk.score >= 55) inc = { ...p, status: 'açık', coolingSince: null };
    else if (risk.score < 25 || (now - (p.coolingSince ?? now) >= 3 * HOUR && risk.score < 40)) inc = null;
    else inc = { ...p };
  }
  if (!inc) return null;
  // Zirve takibi
  if (pulse.rate1h > (inc.peakRate || 0)) {
    if (inc.peaked && pulse.rate1h > inc.peakRate * 1.2) inc.peaked = false;
    if (!inc.peaked) { inc.peakRate = pulse.rate1h; inc.peakAt = now; }
  } else if (!inc.peaked && inc.peakRate >= 30 && pulse.rate1h <= 0.75 * inc.peakRate && now - inc.peakAt >= 40 * 60_000) inc.peaked = true;
  inc.counter = inc.counter || cas.counter?.id || null;
  inc.narrativeId = cas.focus?.id ?? inc.narrativeId ?? null;
  inc.headline = inc.status === 'açık'
    ? `${name}: ${topic} ${pulse.trend === 'sönüyor' ? 'konusu yavaşlıyor ama sürüyor' : pulse.trend === 'patlama' || pulse.trend === 'yükseliyor' ? 'konusu hızla yayılıyor' : 'konusu gündemde'}`
    : `${name}: ${topic} konusu soğuyor`;
  return inc;
}
