// Türkçe biçimlendirme yardımcıları: saat "14.20", sayı "12.400", pay "%46".
const TZ = 'Europe/Istanbul';
const timeFmt = new Intl.DateTimeFormat('tr-TR', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false });
const dayFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
const dateFmt = new Intl.DateTimeFormat('tr-TR', { timeZone: TZ, day: 'numeric', month: 'long' });
const numFmt = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });

export function fmtNum(n) {
  return numFmt.format(Math.round(Number(n) || 0));
}

// Büyük sayılar: 48 bin, 1,2 milyon
export function fmtBig(n) {
  n = Number(n) || 0;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace('.', ',').replace(',0', '')} milyon`;
  if (n >= 10000) return `${fmtNum(n / 1000)} bin`;
  return fmtNum(n);
}

export function fmtPct(share) {
  return `%${Math.round((Number(share) || 0) * 100)}`;
}

export function fmtTime(ms) {
  return timeFmt.format(new Date(ms)).replace(':', '.');
}

// "14.20", "dün 23.40", "12 Kasım 09.15" — `now`a göre
export function fmtWhen(ms, now) {
  if (ms == null) return '';
  const t = fmtTime(ms);
  if (now == null) return t;
  const d0 = Date.parse(dayFmt.format(new Date(now)));
  const d1 = Date.parse(dayFmt.format(new Date(ms)));
  const diff = Math.round((d0 - d1) / 864e5);
  if (diff === 0) return t;
  if (diff === 1) return `dün ${t}`;
  return `${dateFmt.format(new Date(ms))} ${t}`;
}

export function fmtDur(min) {
  min = Math.max(0, Math.round(min));
  if (min < 60) return `${min} dakika`;
  const h = Math.floor(min / 60), m = Math.round((min % 60) / 10) * 10;
  if (h >= 24) return `${Math.round(h / 24)} gün`;
  return m && m < 60 ? `${h} saat ${m} dakika` : `${h} saat`;
}

// Tohumlu seçim: aynı veri aynı cümleyi, farklı veri farklı cümleyi verir.
export function pick(seed, variants) {
  let h = 2166136261;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return variants[(h >>> 0) % variants.length];
}

export function excerpt(text, max = 140) {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const sp = cut.lastIndexOf(' ');
  return `${cut.slice(0, sp > max * 0.6 ? sp : max)}…`;
}

export function joinTr(list) {
  const a = list.filter(Boolean);
  if (a.length <= 1) return a[0] || '';
  return `${a.slice(0, -1).join(', ')} ve ${a[a.length - 1]}`;
}

export function cap(s) {
  s = String(s || '');
  return s ? s[0].toLocaleUpperCase('tr-TR') + s.slice(1) : s;
}
