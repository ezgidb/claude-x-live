// Nabız: 10 dakikalık kovalar, sağlam taban çizgisi (medyan + MAD), z ve eğilim.
import { MIN, HOUR, median, round1 } from './util.js';

const B = 144, W = 10 * MIN;

export function buildPulse(ctx) {
  const { docs, now } = ctx;
  const series = Array.from({ length: B }, (_, i) => ({ t: now - (B - i) * W, n: 0, reach: 0, neg: 0 }));
  for (const d of docs) {
    const idx = B - 1 - Math.floor((now - d.t) / W);
    if (idx < 0 || idx >= B) continue;
    const s = series[idx];
    s.n++; s.reach += d.followers; if (d.neg) s.neg++;
  }
  // Saatlik toplamlar: hours[0] = son saat.
  const hours = new Array(24).fill(0);
  for (let i = 0; i < B; i++) hours[Math.floor((B - 1 - i) / 6)] += series[i].n;
  const rate1h = hours[0];
  // Taban: verinin kapsadığı önceki saatler.
  const valid = [];
  if (ctx.coverageStart != null) {
    for (let h = 1; h < 24; h++) if (now - (h + 1) * HOUR >= ctx.coverageStart - W) valid.push(hours[h]);
  }
  const thin = valid.length < 3;
  const med = valid.length ? median(valid) : rate1h;
  const mad = median(valid.map((x) => Math.abs(x - med)));
  let sigma = Math.max(1.4826 * mad, Math.sqrt(Math.max(med, 1)), 1.5);
  if (thin) sigma = Math.max(sigma, med * 0.5 + 3);
  const z = round1((rate1h - med) / sigma);

  // Kayan saatlik toplam; son 6 saatin zirvesi.
  let peak1h = 0, peakIdx = B - 1;
  for (let i = B - 36; i < B; i++) {
    let r = 0;
    for (let k = 0; k < 6; k++) r += series[i - k].n;
    if (r > peak1h) { peak1h = r; peakIdx = i; }
  }
  const sum = (a, b) => { let s = 0; for (let i = a; i < b; i++) s += series[i].n; return s; };
  const last30 = sum(B - 3, B), prev30 = sum(B - 6, B - 3), prev30b = sum(B - 9, B - 6);
  const peakZ = (peak1h - med) / sigma;
  const falling = rate1h <= 0.75 * peak1h && last30 <= prev30;
  let trend = 'sakin';
  if (peakZ >= 3 && peak1h >= 10 && falling && z >= 1) trend = 'sönüyor';
  else if (z >= 6 && rate1h >= 20) trend = 'patlama';
  else if (z >= 2.5 && (last30 > prev30 * 1.1 || rate1h > hours[1] * 1.2)) trend = 'yükseliyor';
  else if (z >= 1.5) trend = 'hareketli';

  return {
    bucketMin: 10, series, rate1h, baseline1h: round1(med), z, trend,
    // ek alanlar (sözleşme dışı, zararsız)
    peak1h, peakAt: series[peakIdx].t + W,
    _: { hours, sigma, last30, prev30, prev30b, validHours: valid.length, thin },
  };
}
