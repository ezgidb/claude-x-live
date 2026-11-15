// Ortak yardımcılar: kaçış, biçimleme, demo saatine göre zaman.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (v) => (v === null || v === undefined ? '' : String(v).replace(/[&<>"']/g, (c) => ESC[c]));

// demo saati: sunucudan gelen an + o andan bu yana geçen gerçek süre × hız
const clock = { now: Date.now(), speed: 1, at: performance.now() };
export function setClock(c) {
  if (!c || !Number.isFinite(c.now)) return;
  clock.now = c.now; clock.speed = Number(c.speed) || 1; clock.at = performance.now();
}
export const simNow = () => clock.now + (performance.now() - clock.at) * clock.speed;
export const simSpeed = () => clock.speed;

const TZ = 'Europe/Istanbul';
const fTime = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
const fDay = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', timeZone: TZ });
const fDayKey = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TZ });

export const hhmm = (ms) => (Number.isFinite(ms) ? fTime.format(ms) : '—');
export const dayShort = (ms) => (Number.isFinite(ms) ? fDay.format(ms) : '');

// "3 dk önce" — demo saatine göre
export function rel(ms) {
  if (!Number.isFinite(ms)) return '';
  const now = simNow();
  const d = now - ms;
  if (d < -60_000) return `${fmtDur(-d)} sonra`;
  if (d < 60_000) return 'az önce';
  if (d < 3_600_000) return `${Math.floor(d / 60_000)} dk önce`;
  if (d < 24 * 3_600_000) {
    const h = Math.floor(d / 3_600_000), m = Math.floor((d % 3_600_000) / 60_000);
    return m && h < 6 ? `${h} sa ${m} dk önce` : `${h} sa önce`;
  }
  return fDayKey.format(ms) === fDayKey.format(now - 86_400_000) ? `dün ${hhmm(ms)}` : `${dayShort(ms)} ${hhmm(ms)}`;
}
export function fmtDur(ms) {
  const m = Math.round(ms / 60_000);
  if (m < 60) return `${m} dk`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h} sa ${r} dk` : `${h} sa`;
}

const nf = new Intl.NumberFormat('tr-TR');
export const num = (v) => (Number.isFinite(v) ? nf.format(Math.round(v)) : '—');
export function compact(v) {
  if (!Number.isFinite(v)) return '—';
  const a = Math.abs(v);
  if (a >= 1e6) return `${(v / 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} Mn`;
  if (a >= 1e4) return `${Math.round(v / 1e3).toLocaleString('tr-TR')} B`;
  if (a >= 1e3) return `${(v / 1e3).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} B`;
  return nf.format(Math.round(v));
}
export const pct = (v, d = 0) => (Number.isFinite(v) ? `%${(v * 100).toLocaleString('tr-TR', { maximumFractionDigits: d })}` : '—');

// --- sözlükler ---
export const LEVEL = {
  yeşil: { label: 'Yeşil', text: 'Sakin', cls: 'lv-ok' },
  sarı: { label: 'Sarı', text: 'Dikkat', cls: 'lv-warn' },
  turuncu: { label: 'Turuncu', text: 'Ciddi', cls: 'lv-serious' },
  kırmızı: { label: 'Kırmızı', text: 'Kriz', cls: 'lv-crit' },
};
export const levelOf = (l) => LEVEL[l] || { label: l || 'Bilinmiyor', text: '', cls: 'lv-none' };
export const TREND = {
  sakin: { label: 'Sakin', icon: '→' }, hareketli: { label: 'Hareketli', icon: '↝' },
  yükseliyor: { label: 'Yükseliyor', icon: '↗' }, patlama: { label: 'Patlama', icon: '⇈' }, sönüyor: { label: 'Sönüyor', icon: '↘' },
};
export const trendOf = (t) => TREND[t] || { label: t || '—', icon: '·' };
export const STANCE = {
  destek: { label: 'Destek', cls: 'st-destek' }, soru: { label: 'Soru', cls: 'st-soru' }, notr: { label: 'Nötr', cls: 'st-notr' },
  alay: { label: 'Alay', cls: 'st-alay' }, elestiri: { label: 'Eleştiri', cls: 'st-elestiri' },
};
export const STANCE_ORDER = ['destek', 'soru', 'notr', 'alay', 'elestiri'];
export const stanceOf = (s) => STANCE[s] || { label: s || '—', cls: 'st-notr' };
export const SOURCE = { x: 'X', haber: 'Haber', bluesky: 'Bluesky', sim: 'Simülasyon' };
export const ROLE = {
  kaynak: 'Kaynak', yükseltici: 'Yükseltici', köprü: 'Köprü', medya: 'Medya', savunucu: 'Savunucu', şüpheli: 'Şüpheli',
};
export const ROLE_HELP = {
  kaynak: 'Konuyu ilk paylaşan', yükseltici: 'Erişimi sıçratan', köprü: 'Başka kitleye ya da platforma taşıyan',
  medya: 'Haber kuruluşu', savunucu: 'Danışanı savunan ya da düzelten', şüpheli: 'Koordinasyon işaretli hesap',
};
export const CASCADE = {
  ilk: 'İlk paylaşım', sıçrama: 'Sıçrama', 'büyük-hesap': 'Büyük hesap', medya: 'Medya', 'platform-geçişi': 'Platform geçişi', 'karşı-anlatı': 'Karşı anlatı',
};
export const COORD = { 'kopya-metin': 'Kopya metin', eşzamanlı: 'Eşzamanlı paylaşım', 'yeni-hesap': 'Yeni hesap kümesi' };
export const POSTURE = {
  izle: { label: 'İzle', help: 'Şimdilik açıklama gerekmiyor; gelişmeleri takip edin.' },
  hazırlan: { label: 'Hazırlan', help: 'Açıklama taslaklarını hazır tutun; tetikleyiciyi bekleyin.' },
  yanıtla: { label: 'Yanıtla', help: 'Kamuya açık bir yanıt verme zamanı.' },
  düzelt: { label: 'Düzelt', help: 'Yanlış bilgiyi kanıtla düzeltin.' },
  üstlen: { label: 'Sorumluluğu üstlen', help: 'Hatayı kabul edip ne yapılacağını açıklayın.' },
};
export const KIND = { marka: 'Marka', kişi: 'Kişi', kurum: 'Kurum' };
export const EVENT_LEVEL = { alarm: 'Alarm', dikkat: 'Dikkat', bilgi: 'Bilgi' };
export const NARR_KIND = { saldırı: 'Saldırı', savunma: 'Savunma', nötr: 'Nötr' };
export const NARR_STATUS = { doğuyor: 'Doğuyor', büyüyor: 'Büyüyor', zirvede: 'Zirvede', sönüyor: 'Sönüyor' };
export const CONF = { düşük: 'Düşük', orta: 'Orta', yüksek: 'Yüksek' };
export const DIR = { artış: 'artış', yatay: 'yatay', düşüş: 'düşüş' };

// bilinmeyen anahtarı okunur yap: 'hassas-konu' → 'Hassas konu'
const DRIVER = { 'hassas-konu': 'Hassas konu', hacim: 'Hacim', 'buyuk-hesap': 'Büyük hesap', 'büyük-hesap': 'Büyük hesap', cagri: 'Çağrı',
  çağrı: 'Çağrı', koordinasyon: 'Koordinasyon', 'olumsuz-pay': 'Olumsuz pay', erisim: 'Erişim', erişim: 'Erişim', hiz: 'Hız', hız: 'Hız', medya: 'Medya', z: 'Hacim sapması' };
export const driverLabel = (k) => DRIVER[k] || String(k || '').replace(/[-_]/g, ' ').replace(/^./, (c) => c.toLocaleUpperCase('tr'));

export const arr = (v) => (Array.isArray(v) ? v : []);

// liste düzeltme: aynı anahtarlı öğeleri koru, yalnızca değişeni yeniden yaz (açık satırlar, odak korunur)
export function patchList(container, list, keyOf, htmlOf, { tag = 'div', className = '', attrs } = {}) {
  const existing = new Map();
  for (const el of container.children) if (el.dataset.key) existing.set(el.dataset.key, el);
  let prev = null;
  const keep = new Set();
  for (const item of list) {
    const key = String(keyOf(item));
    keep.add(key);
    let el = existing.get(key);
    const html = htmlOf(item);
    if (!el) {
      el = document.createElement(tag);
      el.dataset.key = key;
      if (className) el.className = className;
      el.classList.add('fresh');
    }
    if (attrs) for (const [k, v] of Object.entries(attrs(item))) {
      if (k === 'class') { el.className = `${className} ${v}`.trim(); continue; }
      if (v === null || v === false) el.removeAttribute(k); else el.setAttribute(k, v === true ? '' : v);
    }
    if (el._html !== html) { el.innerHTML = html; el._html = html; }
    const want = prev ? prev.nextSibling : container.firstChild;
    if (want !== el) container.insertBefore(el, want);
    prev = el;
  }
  for (const [key, el] of existing) if (!keep.has(key)) el.remove();
}

// yalnızca içerik değiştiyse yaz
export function setHTML(el, html) {
  if (!el) return;
  if (el._html !== html) { el.innerHTML = html; el._html = html; }
}

export async function api(path, { method = 'GET', body } = {}) {
  const r = await fetch(path, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
  let data = null;
  try { data = await r.json(); } catch { /* boş yanıt */ }
  if (!r.ok) throw new Error(data?.error || `İstek başarısız (${r.status}).`);
  return data;
}
