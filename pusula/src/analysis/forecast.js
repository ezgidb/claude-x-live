// Kısa vadeli tahmin: son yarım saatlerin eğilimi, sönümlü büyüme / tabana doğru sönüş.
import { MIN, HOUR, clamp } from './util.js';

export function buildForecast(ctx, pulse) {
  const { last30: a, prev30: b, prev30b: c, validHours } = pulse._;
  const K = 8;
  const g1 = clamp((a + K) / (b + K), 0.4, 2.5), g2 = clamp((b + K) / (c + K), 0.4, 2.5);
  const g = Math.pow(g1, 0.7) * Math.pow(g2, 0.3);
  const base = pulse.baseline1h / 2;
  let x = a, next1h = 0, next3h = 0;
  for (let k = 0; k < 6; k++) {
    if (g >= 1) x = x * (1 + (g - 1) * Math.pow(0.65, k));
    else x = base + (x - base) * Math.max(g, 0.6);
    if (x < 0) x = 0;
    if (k < 2) next1h += x;
    next3h += x;
  }
  next1h = Math.round(next1h); next3h = Math.round(next3h);
  const diff = next1h - pulse.rate1h, thr = Math.max(6, 0.15 * pulse.rate1h);
  const direction = diff >= thr ? 'artış' : diff <= -thr ? 'düşüş' : 'yatay';
  let peakAt = null;
  if (direction === 'artış') {
    const n = g > 1.05 ? Math.ceil(Math.log(0.05 / (g - 1)) / Math.log(0.65)) + 1 : 1;
    peakAt = ctx.now + Math.min(6 * HOUR, Math.max(1, n) * 30 * MIN);
  } else if (pulse.trend !== 'sakin' && pulse.peak1h >= 10) peakAt = pulse.peakAt;
  const flip = (a - b) * (b - c) < 0 && Math.abs(a - b) > 3 && Math.abs(b - c) > 3;
  let confidence = 'orta';
  if (pulse.rate1h < 12 || validHours < 3 || flip) confidence = 'düşük';
  else if (pulse.rate1h >= 60 && validHours >= 6) confidence = 'yüksek';
  const why = pulse.rate1h < 12 ? ' Hacim az olduğu için tahmin kabadır.' : flip ? ' Son bir saatte yön değiştiği için tahmin kabadır.' : '';
  const dir = direction === 'artış' ? 'artışın bir süre daha sürmesi' : direction === 'düşüş' ? 'hacmin azalması' : 'hacmin benzer düzeyde kalması';
  const basis = `Son 30 dakikada ${a}, önceki 30 dakikada ${b} gönderi var; bu gidişle ${dir} bekleniyor.${why}`;
  return { next1h, next3h, direction, peakAt, confidence, basis };
}
