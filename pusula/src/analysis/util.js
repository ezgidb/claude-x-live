// Ortak sabitler ve küçük yardımcılar (saf).
export const MIN = 60_000, HOUR = 3_600_000, DAY = 86_400_000;
export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const round1 = (x) => Math.round(x * 10) / 10;

export function median(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// Sıralı dizide x'ten küçük olmayan ilk konum.
export function lowerBound(arr, x) {
  let lo = 0, hi = arr.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (arr[mid] < x) lo = mid + 1; else hi = mid; }
  return lo;
}
export const countIn = (times, a, b) => lowerBound(times, b) - lowerBound(times, a); // [a, b)

export const engagement = (it) => {
  const m = it.metrics || {};
  return (m.likes || 0) + 2 * (m.reposts || 0) + (m.replies || 0) + 2 * (m.quotes || 0);
};

// Türkiye saati (UTC+3, yaz saati yok).
export function fmtTime(ms) {
  const d = new Date(ms + 3 * HOUR);
  return `${String(d.getUTCHours()).padStart(2, '0')}.${String(d.getUTCMinutes()).padStart(2, '0')}`;
}
const dec = (x) => x.toFixed(1).replace('.0', '').replace('.', ',');
export function fmtNum(n) {
  n = Math.round(n || 0);
  if (n < 1000) return String(n);
  if (n < 1e6) return `${n < 1e5 ? dec(n / 1000) : Math.round(n / 1000)} bin`;
  return `${dec(n / 1e6)} milyon`;
}
export function fmtDur(min) {
  min = Math.max(1, Math.round(min));
  if (min < 60) return `${min} dakika`;
  const h = Math.floor(min / 60), m = min % 60;
  return m >= 5 ? `${h} saat ${m} dakika` : `${h} saat`;
}
export const handleOf = (a) => (a?.handle ? `@${String(a.handle).replace(/^@/, '')}` : (a?.name || 'bilinmeyen hesap'));
export const STANCES = ['destek', 'elestiri', 'alay', 'soru', 'notr'];
