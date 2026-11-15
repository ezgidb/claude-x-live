// Haber: Google News RSS araması (anahtarsız). Bağımlılıksız ayrıştırma.
const DAY = 86_400_000;

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
export function decodeEntities(s) {
  return String(s || '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, e) => {
    if (e[0] === '#') { const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(n) ? String.fromCodePoint(n) : all; }
    return ENT[e.toLowerCase()] ?? all;
  });
}
function tag(block, name) {
  const m = new RegExp(`<${name}(\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i').exec(block);
  if (!m) return null;
  const cdata = /^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/.exec(m[2]);
  return { attrs: m[1] || '', text: cdata ? cdata[1] : decodeEntities(m[2]) };
}
const plain = (html) => decodeEntities(String(html || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
function hash36(s) {
  let h1 = 2166136261;
  let h2 = 5381;
  for (let i = 0; i < s.length; i++) { h1 = Math.imul(h1 ^ s.charCodeAt(i), 16777619); h2 = (Math.imul(h2, 33) + s.charCodeAt(i)) | 0; }
  return (h1 >>> 0).toString(36) + (h2 >>> 0).toString(36);
}
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };

// RSS metni → Item[] (metin = "başlık — özet")
export function parseRss(xml, client) {
  const out = [];
  const re = /<item[\s>][\s\S]*?<\/item>/gi;
  for (const block of String(xml || '').match(re) || []) {
    const link = tag(block, 'link')?.text.trim() || '';
    const guid = tag(block, 'guid')?.text.trim() || link;
    const src = tag(block, 'source');
    const srcName = src ? plain(src.text) : '';
    const srcUrl = src ? decodeEntities((/url="([^"]*)"/i.exec(src.attrs) || [])[1] || '') : '';
    let title = plain(tag(block, 'title')?.text);
    if (srcName && title.endsWith(` - ${srcName}`)) title = title.slice(0, -srcName.length - 3).trim();
    if (!title) continue;
    let summary = plain(tag(block, 'description')?.text);
    if (srcName && summary.endsWith(srcName)) summary = summary.slice(0, -srcName.length).trim();
    if (summary.toLocaleLowerCase('tr').startsWith(title.toLocaleLowerCase('tr').slice(0, 40))) summary = ''; // özet başlığın tekrarıysa at
    const domain = host(srcUrl) || host(link) || 'haber';
    const createdAt = Date.parse(tag(block, 'pubDate')?.text || '');
    out.push({
      id: `haber:${hash36(guid || title)}`, source: 'haber', url: link, text: summary ? `${title} — ${summary}` : title, lang: 'tr',
      createdAt: Number.isFinite(createdAt) ? createdAt : 0,
      author: { id: `haber:${domain}`, handle: domain, name: srcName || domain, followers: 0, verified: false, createdAt: null, kind: 'medya' },
      metrics: { likes: 0, reposts: 0, replies: 0, quotes: 0, views: 0 }, refs: { replyTo: null, quoteOf: null, repostOf: null },
      media: false, clientId: client?.id ?? null, enr: null,
    });
  }
  return out;
}

export function buildNewsUrl(client, { since, until } = {}) {
  const terms = [];
  for (const raw of client?.terms || []) {
    const t = String(raw || '').replace(/^[@#]/, '').replace(/"/g, '').trim();
    if (t && !terms.includes(t)) terms.push(t);
  }
  if (!terms.length) return null;
  let q = terms.slice(0, 6).map((t) => (/\s/.test(t) ? `"${t}"` : t)).join(' OR ');
  if (Number.isFinite(since) && Number.isFinite(until)) q += ` when:${Math.min(7, Math.max(1, Math.ceil((until - since) / DAY)))}d`;
  return `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=tr&gl=TR&ceid=TR:tr`;
}

export function createHaberSource({ fetchImpl } = {}) {
  const src = {
    id: 'haber', label: 'Haber siteleri', lastError: null,
    async poll({ client, since, until } = {}) {
      try {
        const url = buildNewsUrl(client, { since, until });
        if (!url) return [];
        const res = await (fetchImpl || globalThis.fetch)(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; rss-reader)' } });
        if (!res.ok) { src.lastError = `Haber araması yanıt vermedi (hata ${res.status}).`; return []; }
        const items = parseRss(await res.text(), client).filter((i) =>
          (!Number.isFinite(since) || i.createdAt >= since) && (!Number.isFinite(until) || i.createdAt < until));
        src.lastError = null;
        return items;
      } catch (e) {
        src.lastError = `Haber aramasına ulaşılamadı: ${e?.message || e}`;
        return [];
      }
    },
  };
  return src;
}
