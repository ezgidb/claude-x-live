// X (API v2 recent search). Para harcar: gönderi başı tahmini ücret günlük deftere yazılır, tavan aşılırsa çekilmez.
const ENDPOINT = 'https://api.x.com/2/tweets/search/recent';
const DAY = 86_400_000;
export const X_COST_PER_POST = 0.005; // $ (tahmin)
export const X_DEFAULT_DAILY_CAP = 10; // $
const LEDGER_KEY = 'x.spend';
const CAP_KEY = 'x.dailyCapUsd';

// client.terms → arama sorgusu
export function buildXQuery(client, { maxLen = 480 } = {}) {
  const parts = [];
  let len = 20;
  for (const raw of client?.terms || []) {
    const t = String(raw || '').trim().replace(/"/g, '');
    if (!t) continue;
    const q = /\s/.test(t) ? `"${t}"` : t;
    if (len + q.length + 4 > maxLen) break;
    parts.push(q);
    len += q.length + 4;
  }
  if (!parts.length) return '';
  return `(${parts.join(' OR ')}) -is:retweet`;
}

const MEDIA_HINT = /haber|gazete|ajans|medya|news|\btv\b|dergi|radyo|postas[ıi]/i;
function userKind(u) {
  if (!u) return 'bilinmiyor';
  if (MEDIA_HINT.test(`${u.name || ''} ${u.username || ''} ${u.description || ''}`)) return 'medya';
  if (u.verified_type === 'business' || u.verified_type === 'government') return 'kurum';
  return 'kişi';
}
const ms = (iso) => { const t = Date.parse(iso || ''); return Number.isFinite(t) ? t : null; };

// API yanıtı → Item[]
export function parseXResponse(json, client) {
  const users = new Map();
  for (const u of json?.includes?.users || []) users.set(u.id, u);
  const out = [];
  for (const t of json?.data || []) {
    if (!t || !t.id) continue;
    const u = users.get(t.author_id);
    const pm = t.public_metrics || {};
    const refs = { replyTo: null, quoteOf: null, repostOf: null };
    for (const r of t.referenced_tweets || []) {
      if (r.type === 'replied_to') refs.replyTo = `x:${r.id}`;
      else if (r.type === 'quoted') refs.quoteOf = `x:${r.id}`;
      else if (r.type === 'retweeted') refs.repostOf = `x:${r.id}`;
    }
    const handle = u?.username || '';
    out.push({
      id: `x:${t.id}`, source: 'x', url: handle ? `https://x.com/${handle}/status/${t.id}` : `https://x.com/i/status/${t.id}`,
      text: t.text || '', lang: t.lang || 'und', createdAt: ms(t.created_at) ?? 0,
      author: { id: `x:u${t.author_id || ''}`, handle, name: u?.name || handle, followers: u?.public_metrics?.followers_count ?? 0,
        verified: !!(u?.verified || (u?.verified_type && u.verified_type !== 'none')), createdAt: ms(u?.created_at), kind: userKind(u) },
      metrics: { likes: pm.like_count ?? 0, reposts: pm.retweet_count ?? 0, replies: pm.reply_count ?? 0, quotes: pm.quote_count ?? 0, views: pm.impression_count ?? 0 },
      refs, media: !!(t.attachments?.media_keys?.length), clientId: client?.id ?? null, enr: null,
    });
  }
  return out;
}

const dayKey = (t) => new Date(t + 3 * 3_600_000).toISOString().slice(0, 10); // Türkiye günü

export function createXSource({ token, store, fetchImpl, maxPages = 3, costPerPost = X_COST_PER_POST } = {}) {
  const lastEnd = new Map(); // danışan → son çekilen aralığın bitişi
  const src = {
    id: 'x', label: 'X', lastError: null,
    setToken(t) { token = t; },
    // Günlük harcama defteri: { day, usd, posts, capUsd }
    spend(now) {
      const led = store?.get(LEDGER_KEY);
      const cap = Number(store?.get(CAP_KEY)) > 0 ? Number(store.get(CAP_KEY)) : X_DEFAULT_DAILY_CAP;
      const day = dayKey(now);
      return led && led.day === day ? { ...led, capUsd: cap } : { day, usd: 0, posts: 0, capUsd: cap };
    },
    async poll({ client, since, until } = {}) {
      try {
        if (!token) { src.lastError = 'X anahtarı girilmemiş; X gönderileri çekilmiyor.'; return []; }
        const query = buildXQuery(client);
        if (!query || !Number.isFinite(until)) return [];
        const f = fetchImpl || globalThis.fetch;
        const end = until - 15_000; // API, bitişin en az 10 sn geçmişte olmasını ister
        let start = Math.min(Number.isFinite(since) ? since : until - DAY, lastEnd.get(client.id) ?? Infinity);
        start = Math.max(start, until - 7 * DAY + 60_000);
        if (end - start < 1000) return [];
        const items = [];
        let next = null;
        let capped = false;
        for (let page = 0; page < maxPages; page++) {
          const led = src.spend(until);
          const room = Math.floor((led.capUsd - led.usd) / costPerPost + 1e-9);
          if (room < 10) { capped = true; break; }
          const p = new URLSearchParams({ query, max_results: String(Math.min(100, room)),
            start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(),
            'tweet.fields': 'created_at,public_metrics,lang,referenced_tweets,author_id,attachments',
            expansions: 'author_id', 'user.fields': 'username,name,public_metrics,verified,verified_type,created_at,description' });
          if (next) p.set('next_token', next);
          const res = await f(`${ENDPOINT}?${p}`, { headers: { Authorization: `Bearer ${token}` } });
          if (!res.ok) {
            src.lastError = res.status === 401 || res.status === 403 ? 'X anahtarı kabul edilmedi (yetki hatası).'
              : res.status === 429 ? 'X istek sınırına takıldı; biraz sonra yeniden denenecek.' : `X yanıt vermedi (hata ${res.status}).`;
            return items;
          }
          const json = await res.json();
          const got = parseXResponse(json, client);
          items.push(...got);
          if (store && got.length) store.set(LEDGER_KEY, { day: led.day, usd: Math.round((led.usd + got.length * costPerPost) * 1000) / 1000, posts: led.posts + got.length });
          next = json?.meta?.next_token || null;
          if (!next) break;
        }
        if (capped) {
          const led = src.spend(until);
          src.lastError = `Günlük X harcama tavanına ulaşıldı (${led.usd.toFixed(2)} $ / ${led.capUsd} $); bugün yeni gönderi çekilmiyor.`;
          if (!items.length) return [];
        } else {
          src.lastError = next ? 'X: bu aralıkta sayfa sınırından fazla gönderi vardı; bir kısmı alınamadı.' : null;
        }
        lastEnd.set(client.id, end);
        return items;
      } catch (e) {
        src.lastError = `X'e ulaşılamadı: ${e?.message || e}`;
        return [];
      }
    },
  };
  return src;
}
