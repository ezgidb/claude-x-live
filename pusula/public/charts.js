// Elle SVG grafikler: nabız alanı, kıvılcım çizgisi, ölçer, duruş çubuğu.
import { esc, hhmm, num, pct, arr, stanceOf, STANCE_ORDER, CASCADE } from './util.js';

const r1 = (v) => Math.round(v * 10) / 10;

function niceMax(v) {
  if (!(v > 0)) return 4;
  const p = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p >= v) return m * p;
  return 10 * p;
}

function pathOf(pts) { return pts.map((p, i) => `${i ? 'L' : 'M'}${r1(p[0])},${r1(p[1])}`).join(''); }
function areaOf(pts, y0) {
  if (!pts.length) return '';
  return `${pathOf(pts)}L${r1(pts.at(-1)[0])},${y0}L${r1(pts[0][0])},${y0}Z`;
}

// Kıvılcım çizgisi: tek seri, eksensiz; son noktada işaret
export function sparkline(series, { w = 120, h = 32, key = 'n', cls = '', label = '' } = {}) {
  const s = arr(series).filter((p) => Number.isFinite(p?.[key]));
  if (s.length < 2) return `<svg class="spark ${cls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><line x1="0" x2="${w}" y1="${h - 2}" y2="${h - 2}" class="spark-base"/></svg>`;
  const max = Math.max(1, ...s.map((p) => p[key]));
  const pad = 4;
  const pts = s.map((p, i) => [pad / 2 + (i / (s.length - 1)) * (w - pad - 2), h - 2 - (p[key] / max) * (h - pad - 2)]);
  const last = pts.at(-1);
  return `<svg class="spark ${cls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">
    <path class="spark-area" d="${areaOf(pts, h - 1)}"/><path class="spark-line" d="${pathOf(pts)}"/>
    <circle class="spark-dot" cx="${r1(last[0])}" cy="${r1(last[1])}" r="3"/></svg>`;
}

// Duruş dağılımı: ince parçalı çubuk (2px aralıklı), ad ve pay erişilebilir adda
export function stanceBar(stance, { h = 8 } = {}) {
  const st = stance || {};
  const parts = STANCE_ORDER.map((k) => ({ k, v: Number(st[k]) || 0 })).filter((p) => p.v > 0.004);
  const total = parts.reduce((s, p) => s + p.v, 0);
  const desc = parts.map((p) => `${stanceOf(p.k).label} ${pct(p.v / (total || 1))}`).join(', ');
  if (!total) return `<div class="sbar empty" style="height:${h}px" role="img" aria-label="Duruş verisi yok"></div>`;
  return `<div class="sbar" style="height:${h}px" role="img" aria-label="Duruş: ${esc(desc)}" title="${esc(desc)}">${
    parts.map((p) => `<span class="${stanceOf(p.k).cls}" style="flex-grow:${p.v / total}"></span>`).join('')}</div>`;
}

export function stanceLegend() {
  return `<div class="legend">${STANCE_ORDER.map((k) => `<span class="lg"><i class="sw ${stanceOf(k).cls}"></i>${stanceOf(k).label}</span>`).join('')}</div>`;
}

// Ölçer: 0-100, dolgu risk renginde, iz aynı rengin açık tonu
export function meter(value, cls, { label = '' } = {}) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return `<div class="meter ${cls}" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(v)}" aria-label="${esc(label)}"><span style="width:${v}%"></span></div>`;
}

// Nabız grafiği — toplam gönderi alanı + olumsuz gönderi alanı (aynı birim, tek eksen)
// olay başlangıcı dikey çizgi, yayılım adımları numaralı noktalar
export function pulseChart(snap, width) {
  const series = arr(snap?.pulse?.series).filter((p) => Number.isFinite(p?.t));
  const W = Math.max(280, Math.round(width || 720));
  const H = W < 520 ? 210 : 260;
  const m = { l: 40, r: 14, t: 26, b: 26 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  if (series.length < 2) return { svg: `<div class="empty-chart">Henüz nabız verisi yok.</div>`, scale: null };
  const t0 = series[0].t, t1 = series.at(-1).t;
  const max = niceMax(Math.max(...series.map((p) => p.n || 0)));
  const x = (t) => m.l + ((t - t0) / Math.max(1, t1 - t0)) * iw;
  const y = (v) => m.t + ih - (v / max) * ih;
  const yb = m.t + ih;
  const tot = series.map((p) => [x(p.t), y(p.n || 0)]);
  const neg = series.map((p) => [x(p.t), y(Math.min(p.neg || 0, p.n || 0))]);

  // eksenler
  const ticks = [0, max / 2, max];
  let g = ticks.map((v) => `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${r1(y(v))}" y2="${r1(y(v))}"/>
    <text class="axis" x="${m.l - 6}" y="${r1(y(v)) + 4}" text-anchor="end">${num(v)}</text>`).join('');
  const step = (W < 520 ? 6 : 3) * 3600_000;
  const first = Math.ceil(t0 / step) * step;
  for (let t = first; t <= t1; t += step) {
    const xx = x(t);
    if (xx < m.l + 16 || xx > W - m.r - 16) continue;
    g += `<text class="axis" x="${r1(xx)}" y="${H - 8}" text-anchor="middle">${hhmm(t)}</text>`;
  }
  g += `<line class="baseline" x1="${m.l}" x2="${W - m.r}" y1="${yb}" y2="${yb}"/>`;

  // olay başlangıcı
  let marks = '';
  const inc = snap.incident;
  if (inc && Number.isFinite(inc.startedAt) && inc.startedAt >= t0 && inc.startedAt <= t1) {
    const xi = r1(x(inc.startedAt));
    const anchor = xi > W - 110 ? 'end' : 'start';
    marks += `<line class="inc-line" x1="${xi}" x2="${xi}" y1="${m.t - 10}" y2="${yb}"/>
      <text class="inc-label" x="${anchor === 'end' ? xi - 5 : xi + 5}" y="${m.t - 12}" text-anchor="${anchor}">Olay başladı · ${hhmm(inc.startedAt)}</text>`;
  }
  // yayılım adımları — toplam çizgisinin üzerinde numaralı nokta
  const steps = arr(snap.cascade?.steps).map((s, i) => ({ ...s, i: i + 1 })).filter((s) => Number.isFinite(s.t) && s.t >= t0 && s.t <= t1);
  const valueAt = (t) => {
    let best = series[0];
    for (const p of series) if (Math.abs(p.t - t) < Math.abs(best.t - t)) best = p;
    return best.n || 0;
  };
  let lastX = -99;
  for (const s of steps) {
    const sx = x(s.t), sy = y(valueAt(s.t));
    const showNum = sx - lastX > 14;
    if (showNum) lastX = sx;
    marks += `<g class="step-mark"><circle cx="${r1(sx)}" cy="${r1(sy)}" r="5"/>${showNum ? `<text x="${r1(sx)}" y="${r1(sy) - 9}" text-anchor="middle">${s.i}</text>` : ''}</g>`;
  }

  const svg = `<svg class="pulse" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Son 24 saatte 10 dakikalık gönderi sayısı ve olumsuz gönderiler">
    ${g}
    <path class="a-tot" d="${areaOf(tot, yb)}"/><path class="l-tot" d="${pathOf(tot)}"/>
    <path class="a-neg" d="${areaOf(neg, yb)}"/><path class="l-neg" d="${pathOf(neg)}"/>
    ${marks}
  </svg>`;
  return { svg, scale: { series, x, y, m, W, H, t0, t1, steps } };
}

// grafik üstü işaretçi: en yakın 10 dk dilimi
export function pulseReadout(scale, px) {
  if (!scale) return null;
  const { series, x, steps } = scale;
  let best = series[0], bd = Infinity;
  for (const p of series) { const d = Math.abs(x(p.t) - px); if (d < bd) { bd = d; best = p; } }
  const near = steps.filter((s) => Math.abs(x(s.t) - x(best.t)) < 10);
  const share = best.n ? (best.neg || 0) / best.n : 0;
  const html = `<div class="tt-time">${hhmm(best.t)}–${hhmm(best.t + 600_000)}</div>
    <div class="tt-row"><i class="key k-tot"></i><b>${num(best.n)}</b> gönderi</div>
    <div class="tt-row"><i class="key k-neg"></i><b>${num(best.neg)}</b> olumsuz <span class="muted">(${pct(share)})</span></div>
    ${Number.isFinite(best.reach) ? `<div class="tt-row muted">Erişim ~${num(best.reach)}</div>` : ''}
    ${near.map((s) => `<div class="tt-step"><b>${s.i}. ${esc(CASCADE[s.kind] || s.kind)}</b> ${esc(s.note || '')}</div>`).join('')}`;
  return { x: x(best.t), html };
}
