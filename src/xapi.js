// X API v2 istemcisi (yalnızca uygulama Bearer Token'ı). SDK yok; Node'un yerleşik fetch'i kullanılır.
// Her çağrı öncesi yerel harcama defterine göre bütçe denetimi yapılır.
import { mockFetch } from './mock.js';

const BASE = 'https://api.x.com';
// Kullandıkça-öde birim fiyatları (USD). X fiyatları değiştirirse Ayarlar'dan güncellenebilir.
export const DEFAULT_PRICES = { post: 0.005, user: 0.01, counts: 0.005 };
export const DEFAULT_BUDGET = { daily: 10, monthly: 100 };

const TWEET_FIELDS = 'id,text,created_at,lang,author_id,conversation_id,in_reply_to_user_id,referenced_tweets,public_metrics,entities,attachments,note_tweet';
const USER_FIELDS = 'id,name,username,description,profile_image_url,created_at,verified,verified_type,public_metrics';
const EXPANSIONS = 'author_id,referenced_tweets.id,referenced_tweets.id.author_id';

export class XError extends Error {
  constructor(code, message, extra = {}) { super(message); this.code = code; Object.assign(this, extra); }
}

const iso = (ms) => new Date(ms).toISOString().slice(0, 19) + 'Z';
const utcDay = (ms = Date.now()) => new Date(ms).toISOString().slice(0, 10);

// ---------------------------------------------------------------- Sorgu kurucu
const cleanTerm = (t) => String(t).trim().replace(/[()]/g, '');
function termExpr(t) {
  t = cleanTerm(t);
  if (!t) return null;
  if (/^".*"$/.test(t)) return t;
  if (/\s/.test(t)) return `"${t.replace(/"/g, '')}"`;
  return t.replace(/"/g, '');
}
const handle = (a) => cleanTerm(a).replace(/^@/, '').replace(/[^A-Za-z0-9_]/g, '');

// spec: { any[], all[], accounts[], accountMode: from|mention|both, postId, conversationId, exclude[], lang, excludeReposts }
// postVariant: gönderi izleme sorgusunun yedekli biçimleri (0: alıntı operatörü, 1: url eşleşmesi, 2: yalnızca konuşma)
export function buildQuery(spec, postVariant = spec.postVariant ?? 0) {
  const parts = [];
  const any = (spec.any ?? []).map(termExpr).filter(Boolean);
  if (any.length) parts.push(any.length > 1 ? `(${any.join(' OR ')})` : any[0]);
  for (const t of (spec.all ?? []).map(termExpr).filter(Boolean)) parts.push(t);
  const accs = (spec.accounts ?? []).map(handle).filter(Boolean);
  if (accs.length) {
    const one = (u) => (spec.accountMode === 'from' ? [`from:${u}`] : spec.accountMode === 'mention' ? [`@${u}`] : [`from:${u}`, `to:${u}`, `@${u}`]);
    const list = accs.flatMap(one);
    parts.push(list.length > 1 ? `(${list.join(' OR ')})` : list[0]);
  }
  if (spec.postId) {
    const cid = spec.conversationId ?? spec.postId;
    const v = [`(conversation_id:${cid} OR quotes_of_tweet_id:${spec.postId})`, `(conversation_id:${cid} OR url:"${spec.postId}")`, `conversation_id:${cid}`][postVariant];
    parts.push(v);
  }
  if (!parts.length) throw new XError('bad_query', 'En az bir kelime, etiket, hesap ya da gönderi adresi girin.');
  for (const e of spec.exclude ?? []) {
    const c = cleanTerm(e);
    if (!c) continue;
    parts.push(c.startsWith('@') ? `-from:${handle(c)}` : `-${termExpr(c)}`);
  }
  if (spec.lang) parts.push(`lang:${spec.lang}`);
  const countsQuery = parts.join(' ');
  const query = spec.excludeReposts === false ? countsQuery : `${countsQuery} -is:retweet`;
  if (query.length > 512) throw new XError('bad_query', `Sorgu çok uzun (${query.length}/512 karakter). Kelime sayısını azaltın.`);
  const words = [...(spec.any ?? []), ...(spec.all ?? [])].flatMap((t) => cleanTerm(t).replace(/"/g, '').split(/\s+/)).filter(Boolean);
  return { query, countsQuery, words };
}

export function parsePostUrl(s) {
  const m = String(s ?? '').match(/(?:x|twitter)\.com\/[^/]+\/status(?:es)?\/(\d+)/i) ?? String(s ?? '').trim().match(/^(\d{10,})$/);
  return m ? m[1] : null;
}

// ---------------------------------------------------------------- Yanıt dönüştürme
function normUser(u) {
  const m = u.public_metrics ?? {};
  return { id: u.id, username: u.username, name: u.name, followers: m.followers_count ?? 0, following: m.following_count ?? 0,
    tweet_count: m.tweet_count ?? 0, listed: m.listed_count ?? 0, verified: !!u.verified, verified_type: u.verified_type ?? null,
    created_at: u.created_at ? Date.parse(u.created_at) : null, description: u.description ?? '', avatar: u.profile_image_url ?? '' };
}
export function normalize(body) {
  const users = (body.includes?.users ?? []).map(normUser);
  const uById = new Map(users.map((u) => [u.id, u]));
  const refs = new Map((body.includes?.tweets ?? []).map((t) => [t.id, t]));
  const list = Array.isArray(body.data) ? body.data : body.data ? [body.data] : [];
  const posts = list.map((t) => {
    const r = t.referenced_tweets ?? [];
    const rt = r.find((x) => x.type === 'retweeted'); const rp = r.find((x) => x.type === 'replied_to'); const qt = r.find((x) => x.type === 'quoted');
    const kind = rt ? 'repost' : rp ? 'reply' : qt ? 'quote' : 'original';
    const ref = rt ?? rp ?? qt ?? null;
    const refTweet = ref ? refs.get(ref.id) : null;
    let text = t.note_tweet?.text ?? t.text ?? '';
    if (rt && refTweet) text = `RT @${uById.get(refTweet.author_id)?.username ?? '?'}: ${refTweet.note_tweet?.text ?? refTweet.text}`;
    const m = t.public_metrics ?? {};
    const e = t.entities ?? {};
    return {
      id: t.id, author_id: t.author_id, created_at: Date.parse(t.created_at), text, lang: t.lang,
      likes: m.like_count ?? 0, reposts: m.retweet_count ?? 0, replies: m.reply_count ?? 0, quotes: m.quote_count ?? 0,
      impressions: m.impression_count ?? 0, bookmarks: m.bookmark_count ?? 0,
      kind, ref_id: ref?.id ?? null, ref_author_id: refTweet?.author_id ?? (rp ? t.in_reply_to_user_id : null) ?? null,
      conversation_id: t.conversation_id ?? null,
      hashtags: (e.hashtags ?? []).map((h) => h.tag), mentions: (e.mentions ?? []).map((x) => x.username),
      urls: (e.urls ?? []).filter((u) => !u.media_key).map((u) => u.expanded_url ?? u.url).filter((u) => u && !/^https?:\/\/(x|twitter)\.com\//.test(u)),
      has_media: !!t.attachments?.media_keys?.length || (e.urls ?? []).some((u) => u.media_key),
    };
  });
  return { posts, users, meta: body.meta ?? {} };
}

// ---------------------------------------------------------------- İstemci
export function createX({ store, getToken, isDemo }) {
  const limits = new Map(); // uç nokta -> { remaining, reset }
  const prices = () => ({ ...DEFAULT_PRICES, ...store.getSetting('prices', {}) });
  const budget = () => ({ ...DEFAULT_BUDGET, ...store.getSetting('budget', {}) });
  const prefix = () => (isDemo() ? 'demo:' : '');

  function spend(sinceDay) {
    const p = prices(); const pre = prefix();
    let total = 0; const byDay = new Map(); const detail = { posts: 0, users: 0, counts: 0 };
    for (const r of store.usageSince(sinceDay)) {
      if (!r.endpoint.startsWith(pre) || (!pre && r.endpoint.startsWith('demo:'))) continue;
      const ep = r.endpoint.slice(pre.length);
      let c = 0;
      if (ep === 'counts') { c = r.requests * p.counts; detail.counts += r.requests; } else if (ep === 'users') { c = r.posts * p.user; detail.users += r.posts; } else { c = r.posts * p.post; detail.posts += r.posts; }
      total += c; byDay.set(r.day, (byDay.get(r.day) ?? 0) + c);
    }
    return { total, byDay, detail };
  }
  function usageSummary() {
    const today = utcDay(); const monthStart = today.slice(0, 8) + '01';
    const month = spend(monthStart);
    const b = budget();
    return { demo: isDemo(), today: month.byDay.get(today) ?? 0, month: month.total, budget: b, prices: prices(), detail: month.detail,
      days: [...month.byDay].map(([day, cost]) => ({ day, cost })) };
  }
  function guard() {
    if (isDemo()) return; // demo verisi ücretsizdir
    const u = usageSummary();
    if (u.today >= u.budget.daily) throw new XError('budget', `Günlük harcama tavanına ulaşıldı (${u.budget.daily} $). İzlemeler yarına kadar veri çekmeyecek; tavanı Ayarlar'dan artırabilirsiniz.`);
    if (u.month >= u.budget.monthly) throw new XError('budget', `Aylık harcama tavanına ulaşıldı (${u.budget.monthly} $). Tavanı Ayarlar'dan artırabilirsiniz.`);
  }

  async function call(endpoint, path, params = {}, { free = false, token = null } = {}) {
    if (!free) guard();
    const lim = limits.get(endpoint);
    if (lim && lim.remaining === 0 && Date.now() < lim.reset) throw new XError('rate_limited', rateMsg(lim.reset), { resetAt: lim.reset });
    const url = new URL(BASE + path);
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    let status; let headers; let body;
    if (isDemo() && !token) {
      ({ status, headers, body } = mockFetch(url));
    } else {
      const tk = token ?? getToken();
      if (!tk) throw new XError('no_token', 'X Bearer Token girilmemiş.');
      let res;
      for (let attempt = 0; ; attempt++) {
        try {
          res = await fetch(url, { headers: { authorization: `Bearer ${tk}` }, signal: AbortSignal.timeout(30_000) });
        } catch (e) {
          if (attempt >= 2) throw new XError('network', `X'e ulaşılamadı: ${e.cause?.code ?? e.message}`);
          await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
          continue;
        }
        if (res.status >= 500 && attempt < 2) { await new Promise((r) => setTimeout(r, 1500 * (attempt + 1))); continue; }
        break;
      }
      status = res.status;
      headers = Object.fromEntries(res.headers);
      const text = await res.text();
      try { body = JSON.parse(text); } catch { body = { detail: text.slice(0, 300) }; }
    }
    if (headers['x-rate-limit-remaining'] !== undefined) {
      limits.set(endpoint, { remaining: Number(headers['x-rate-limit-remaining']), reset: Number(headers['x-rate-limit-reset']) * 1000, limit: Number(headers['x-rate-limit-limit']) });
    }
    if (status === 200) return body;
    const detail = body?.detail ?? body?.errors?.[0]?.message ?? body?.title ?? `HTTP ${status}`;
    const type = String(body?.type ?? '');
    if (status === 401) throw new XError('unauthorized', 'Token kabul edilmedi. Kopyalarken başında/sonunda boşluk kalmadığından ve token\'ın iptal edilmediğinden emin olun.', { status });
    if (status === 402 || /credits/i.test(type + detail)) throw new XError('no_credits', 'X hesabınızdaki API kredisi tükenmiş görünüyor. X Geliştirici Konsolu\'ndan kredi ekleyin.', { status });
    if (status === 429) {
      if (/usage-capped/.test(type)) throw new XError('usage_capped', 'X tarafındaki aylık kullanım sınırına ulaşıldı. Sınır yenilenene kadar veri çekilemez.', { status });
      const reset = Number(headers['x-rate-limit-reset'] ?? 0) * 1000 || Date.now() + 15 * 60_000;
      limits.set(endpoint, { remaining: 0, reset });
      throw new XError('rate_limited', rateMsg(reset), { status, resetAt: reset });
    }
    if (status === 403) {
      const enrolled = /client-not-enrolled/.test(JSON.stringify(body));
      throw new XError('forbidden', enrolled
        ? 'Bu token\'ın bağlı olduğu uygulama X Geliştirici Konsolu\'nda bir projeye/pakete bağlı değil. Konsoldan uygulamayı projeye ekleyin.'
        : `Bu token bu işlem için yetkili değil (${detail}). X geliştirici planınızı kontrol edin.`, { status });
    }
    if (status === 400) throw new XError('bad_query', `X sorguyu kabul etmedi: ${detail}`, { status });
    throw new XError('x_error', `X hatası (${status}): ${detail}`, { status });
  }
  const rateMsg = (reset) => `X kısa süreli sınır koydu. ${new Date(reset).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' })}'te otomatik devam edilecek.`;

  function record(kind, body) {
    const pre = prefix();
    const n = Array.isArray(body.data) ? body.data.length : body.data ? 1 : 0;
    const users = body.includes?.users ?? [];
    // Aynı UTC günü içinde daha önce okunan hesaplar yeniden ücretlendirilmez (ihtiyatlı tahmin)
    const dayStart = Date.parse(utcDay() + 'T00:00:00Z');
    const known = store.getUsers(users.map((u) => u.id));
    const fresh = users.filter((u) => (known.get(u.id)?.updated_at ?? 0) < dayStart).length;
    store.addUsage(pre + kind, 1, n);
    if (fresh) store.addUsage(pre + 'users', 0, fresh);
  }

  return {
    usageSummary,
    limits: () => Object.fromEntries(limits),

    // Sayımlar: [{ts, n}] (tüm sayfalar, en çok maxPages)
    async counts(query, { granularity = 'hour', startMs, maxPages = 8 } = {}) {
      const out = []; let next; let total = 0;
      for (let page = 0; page < maxPages; page++) {
        const body = await call('counts', '/2/tweets/counts/recent', { query, granularity, start_time: startMs ? iso(startMs) : undefined, next_token: next });
        store.addUsage(prefix() + 'counts', 1, 0);
        for (const b of body.data ?? []) out.push({ ts: Date.parse(b.start), n: b.tweet_count, partial: Date.parse(b.end) - Date.parse(b.start) < (granularity === 'minute' ? 60_000 : granularity === 'hour' ? 3_600_000 : 86_400_000) });
        total += body.meta?.total_tweet_count ?? 0;
        next = body.meta?.next_token;
        if (!next) break;
      }
      out.sort((a, b) => a.ts - b.ts);
      return { buckets: out, total };
    },

    // Arama: tek sayfa
    async search(query, { sinceId, startMs, endMs, max = 100, nextToken, sort } = {}) {
      const body = await call('search', '/2/tweets/search/recent', {
        query, max_results: Math.min(100, Math.max(10, max)), since_id: sinceId, start_time: !sinceId && startMs ? iso(startMs) : undefined, end_time: endMs ? iso(endMs) : undefined,
        next_token: nextToken, sort_order: sort, 'tweet.fields': TWEET_FIELDS, 'user.fields': USER_FIELDS, expansions: EXPANSIONS,
      });
      record('search', body);
      return normalize(body);
    },

    async getPost(id) {
      const body = await call('lookup', `/2/tweets/${id}`, { 'tweet.fields': TWEET_FIELDS, 'user.fields': USER_FIELDS, expansions: 'author_id' });
      record('lookup', body);
      const n = normalize(body);
      if (!n.posts.length) throw new XError('not_found', 'Gönderi bulunamadı (silinmiş ya da korumalı olabilir).');
      return { post: n.posts[0], author: n.users.find((u) => u.id === n.posts[0].author_id) ?? null };
    },

    async refreshPosts(ids) {
      const posts = []; const users = [];
      for (let i = 0; i < ids.length; i += 100) {
        const body = await call('lookup', '/2/tweets', { ids: ids.slice(i, i + 100).join(','), 'tweet.fields': TWEET_FIELDS, expansions: 'referenced_tweets.id' });
        record('lookup', body);
        const n = normalize(body); posts.push(...n.posts); users.push(...n.users);
      }
      return { posts, users };
    },

    // Token sınaması: önce ücretsiz kullanım ucu, sonra en ucuz sayım çağrısı
    async probe(token) {
      const result = { valid: false, counts: false, usage: null, message: '' };
      const opt = token ? { token, free: true } : { free: true };
      try {
        const u = await call('usage', '/2/usage/tweets', {}, opt);
        result.valid = true;
        if (u?.data) result.usage = { used: Number(u.data.project_usage ?? 0), cap: Number(u.data.project_cap ?? 0), resetDay: u.data.cap_reset_day ?? null };
      } catch (e) {
        if (e.code === 'unauthorized' || e.code === 'network') { result.message = e.message; return result; }
        result.usageError = e.message; // kullanım ucu kapalı olabilir; sayım ile devam
      }
      try {
        await call('counts', '/2/tweets/counts/recent', { query: 'from:x', granularity: 'day' }, opt);
        if (!token || !isDemo()) store.addUsage(prefix() + 'counts', 1, 0);
        result.valid = true; result.counts = true;
        result.message = 'Bağlantı başarılı. Arama ve sayım kullanılabilir.';
      } catch (e) {
        if (e.code === 'unauthorized') { result.valid = false; result.message = e.message; return result; }
        result.message = result.valid ? `Token geçerli, ancak sayım ucu kullanılamadı: ${e.message}` : e.message;
      }
      return result;
    },
  };
}
