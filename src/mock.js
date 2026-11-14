// Demo modu: X API v2 yanıt biçimini taklit eden sentetik veri üreticisi.
// Gerçek istemci (xapi.js) ile aynı kod yolundan geçer; token olmadan arayüzü denemek ve test için kullanılır.

const TW_EPOCH = 1288834974657n;
const MIN = 60_000;
const BOOT = Date.now();
const BURST_T0 = BOOT - 90 * MIN; // patlama, sunucu açılışından 90 dk önce başlar

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function poisson(lambda, r) {
  if (lambda > 30) { // normal yaklaşımı
    const u = Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
    return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * u));
  }
  const L = Math.exp(-lambda); let k = 0; let p = 1;
  do { k++; p *= r(); } while (p > L);
  return k - 1;
}
const pick = (arr, r) => arr[Math.floor(r() * arr.length)];

const FIRST = ['ahmet', 'ayse', 'mehmet', 'zeynep', 'can', 'elif', 'murat', 'deniz', 'emre', 'selin', 'burak', 'ece', 'kerem', 'melis', 'onur', 'irem', 'tolga', 'derya', 'baris', 'gizem'];
const LAST = ['yilmaz', 'kaya', 'demir', 'celik', 'sahin', 'ozturk', 'aydin', 'arslan', 'dogan', 'kilic', 'aslan', 'cetin', 'kara', 'koc', 'kurt', 'ozkan', 'simsek', 'polat', 'erdem', 'aksoy'];
const BRAND = ['gundemhaber', 'ekonomi_masasi', 'sondakikatr', 'analiz_notu', 'sehir_postasi', 'veri_gunlugu', 'medya_takip', 'piyasa_ozeti'];
const N_USERS = 400;

function mockUser(i) {
  const r = rng(hash('u' + i));
  const big = i < BRAND.length;
  const username = big ? BRAND[i] : `${pick(FIRST, r)}${pick(LAST, r)}${Math.floor(r() * 90 + 10)}`;
  const followers = Math.round(30 * (N_USERS / (i + 1)) ** 1.45 * (0.6 + r() * 0.8));
  const young = i > 300 && r() < 0.5;
  return {
    id: String(100000 + i),
    username,
    name: big ? username.replace(/_/g, ' ') : username.replace(/\d+$/, ''),
    created_at: new Date(young ? BOOT - r() * 60 * 86400e3 : BOOT - (400 + r() * 3000) * 86400e3).toISOString(),
    description: big ? 'Gündem, haber ve analiz.' : 'Kişisel görüşlerim.',
    verified: i < 25 && r() < 0.7,
    verified_type: i < 25 ? 'blue' : 'none',
    profile_image_url: '',
    public_metrics: {
      followers_count: followers,
      following_count: young ? 2000 + Math.floor(r() * 3000) : Math.round(200 + r() * 900),
      tweet_count: Math.round(500 + r() * 40000),
      listed_count: Math.round(followers / 300),
    },
  };
}

const THEMES = [
  { tag: 'açıklama', words: ['resmi açıklama bekleniyor', 'yeni açıklama geldi', 'açıklama yeterli değil'], w: (x) => 1 },
  { tag: 'tepki', words: ['tepkiler büyüyor', 'kamuoyu tepkili', 'sosyal medyada tepki yağdı'], w: (x) => 1 + 2 * x },
  { tag: 'kampanya', words: ['imza kampanyası başladı', 'kampanyaya destek çağrısı', 'destek kampanyası yayılıyor'], w: (x) => 0.3 + 6 * x },
  { tag: 'fiyat', words: ['fiyat artışı gündemde', 'fiyatlar yine konuşuluyor', 'zam tartışması'], w: (x) => 1.2 - 0.6 * x },
  { tag: 'toplantı', words: ['yarınki toplantı kritik', 'toplantıdan karar çıktı', 'toplantı sonrası ilk yorumlar'], w: (x) => 0.2 + 3 * x * x },
];
const OPENERS = ['Bence', 'Açıkçası', 'Dikkat:', 'Son durum:', 'Herkes soruyor:', 'Not düşelim,', 'Şunu konuşalım:', ''];
const CLOSERS = ['ne dersiniz?', 'takipteyiz.', 'detaylar geliyor.', 'bu böyle gitmez.', 'umarım çözülür.', 'paylaşalım, duyulsun!', ''];

function topicOf(query) {
  const cleaned = query.replace(/\([^)]*\)/g, (m) => m.slice(1, -1).split(/\s+OR\s+/)[0])
    .replace(/(^|\s)-?\w+:\S+/g, ' ').replace(/(^|\s)-\S+/g, ' ').replace(/["()]/g, ' ').replace(/\bOR\b/g, ' ').trim();
  return cleaned.split(/\s+/)[0] || 'gündem';
}

// Dakika başına beklenen gönderi sayısı
function rate(query, t) {
  const hourTR = (new Date(t).getUTCHours() + 3) % 24;
  const diurnal = 0.35 + 0.65 * Math.max(0, Math.sin(((hourTR - 7) / 17) * Math.PI));
  const base = 1.2 + (hash(query) % 100) / 60;
  const x = burstPhase(t);
  const decay = t > BURST_T0 + 240 * MIN ? Math.exp(-(t - BURST_T0 - 240 * MIN) / (300 * MIN)) : 1;
  const older = Math.exp(-(((t - (BOOT - 52 * 60 * MIN)) / (90 * MIN)) ** 2)) * 2.5; // 2 gün önceki küçük dalga
  return base * diurnal * (1 + older) + base * 9 * x * decay;
}
function burstPhase(t) { return 1 / (1 + Math.exp(-(t - BURST_T0 - 45 * MIN) / (14 * MIN))); }

function minuteCount(query, m) { return poisson(rate(query, m * MIN), rng(hash(`${query}|c|${m}`))); }

const cache = new Map();
function minutePosts(query, m, depth = 0) {
  const key = `${query}|${m}`;
  if (cache.has(key)) return cache.get(key);
  const n = minuteCount(query, m);
  const topic = topicOf(query);
  const x = burstPhase(m * MIN);
  const posts = [];
  for (let i = 0; i < n; i++) {
    const r = rng(hash(`${query}|p|${m}|${i}`));
    const ms = m * MIN + Math.floor(((i + r()) / n) * MIN);
    const id = (((BigInt(ms) - TW_EPOCH) << 22n) | BigInt(i)).toString();
    const roll = r();
    let post;
    if (roll < 0.45 && depth === 0) {
      // repost: önceki dakikalardan bir özgün gönderiyi yay
      let orig = null;
      for (let k = 0; k < 6 && !orig; k++) {
        const back = minutePosts(query, m - 1 - Math.floor(r() * 40), 1).filter((p) => !p.referenced_tweets);
        if (back.length) orig = back.reduce((a, b) => (b._pot > a._pot ? b : a));
      }
      if (orig) {
        const uid = String(100000 + 60 + Math.floor(r() * (N_USERS - 60)));
        post = { id, author_id: uid, text: `RT @${mockUser(Number(orig.author_id) - 100000).username}: ${orig.text}`,
          referenced_tweets: [{ type: 'retweeted', id: orig.id }], entities: { ...orig.entities, mentions: [{ username: mockUser(Number(orig.author_id) - 100000).username, id: orig.author_id }] }, _pot: 0, _ref: orig };
      }
    }
    if (!post) {
      const weights = THEMES.map((th) => th.w(x));
      let pickW = r() * weights.reduce((a, b) => a + b, 0);
      let theme = THEMES[0];
      for (let j = 0; j < THEMES.length; j++) { pickW -= weights[j]; if (pickW <= 0) { theme = THEMES[j]; break; } }
      // erken girenler: patlamanın ilk 25 dakikasında orta ölçekli birkaç hesap
      const early = ms > BURST_T0 + 20 * MIN && ms < BURST_T0 + 50 * MIN && r() < 0.35;
      const ui = early ? 40 + Math.floor(r() * 6) : Math.floor(N_USERS * r() ** 2.2);
      const u = mockUser(ui);
      const tags = [topic.replace(/^#/, '')];
      if (r() < 0.5) tags.push(theme.tag);
      const mention = r() < 0.15 ? mockUser(Math.floor(r() * 12)) : null;
      const hasUrl = r() < 0.18;
      const text = [pick(OPENERS, r), topic.startsWith('#') ? topic.slice(1) : topic, 'konusunda', pick(theme.words, r) + ',', pick(CLOSERS, r),
        mention ? `@${mention.username}` : '', tags.map((t) => '#' + t).join(' '), hasUrl ? 'https://t.co/ornek' + (hash(id) % 50) : '']
        .filter(Boolean).join(' ');
      const pot = (u.public_metrics.followers_count ** 0.75) * (0.2 + r() ** 3 * 6) * (early ? 6 : 1) * (theme.tag === 'kampanya' ? 1.8 : 1) / 40;
      post = { id, author_id: u.id, text, _pot: pot,
        entities: {
          hashtags: tags.map((t) => ({ tag: t })),
          ...(mention ? { mentions: [{ username: mention.username, id: mention.id }] } : {}),
          ...(hasUrl ? { urls: [{ expanded_url: `https://ornekhaber.com/haber/${hash(id) % 50}`, display_url: 'ornekhaber.com' }] } : {}),
        },
        ...(r() < 0.25 ? { attachments: { media_keys: ['3_' + id] } } : {}),
      };
      if (roll > 0.85) { post.referenced_tweets = [{ type: 'replied_to', id: String(BigInt(id) - 99999n) }]; post._pot *= 0.3; }
    }
    post.created_at = new Date(ms).toISOString();
    post.lang = 'tr';
    post.conversation_id = post.referenced_tweets?.[0]?.id ?? id;
    posts.push(post);
  }
  if (cache.size > 30000) cache.clear();
  cache.set(key, posts);
  return posts;
}

function publicView(p, now) {
  const age = Math.max(0, now - Date.parse(p.created_at)) / MIN;
  const g = p._pot * (1 - Math.exp(-age / 45));
  const { _pot, _ref, ...rest } = p;
  return { ...rest, public_metrics: {
    like_count: Math.round(g), retweet_count: Math.round(g * 0.32), reply_count: Math.round(g * 0.08),
    quote_count: Math.round(g * 0.05), bookmark_count: Math.round(g * 0.04), impression_count: Math.round(g * 45 + age) } };
}

function json(status, body, extra = {}) {
  return { status, headers: { 'x-rate-limit-limit': '450', 'x-rate-limit-remaining': '449', 'x-rate-limit-reset': String(Math.floor(Date.now() / 1000) + 900), ...extra }, body };
}

// url: URL nesnesi. Dönen: { status, headers, body }
export function mockFetch(url) {
  const p = url.pathname;
  const now = Date.now();
  const sp = url.searchParams;
  if (p === '/2/tweets/search/recent') {
    const query = sp.get('query') ?? '';
    const max = Math.min(100, Math.max(10, Number(sp.get('max_results') ?? 10)));
    const noRT = /-is:retweet/.test(query);
    const start = sp.get('start_time') ? Date.parse(sp.get('start_time')) : now - 7 * 86400e3;
    let end = sp.get('end_time') ? Date.parse(sp.get('end_time')) : now - 10_000;
    const sinceId = sp.get('since_id') ? BigInt(sp.get('since_id')) : null;
    const untilId = sp.get('next_token') ? BigInt(sp.get('next_token')) : null;
    if (untilId) end = Math.min(end, Number((untilId >> 22n) + TW_EPOCH) + 1);
    const out = [];
    let more = false;
    outer: for (let m = Math.floor(end / MIN); m >= Math.floor(start / MIN); m--) {
      const list = minutePosts(query, m);
      for (let i = list.length - 1; i >= 0; i--) {
        const post = list[i];
        const ms = Date.parse(post.created_at);
        const bid = BigInt(post.id);
        if (ms > end || ms < start) continue;
        if (untilId && bid >= untilId) continue;
        if (sinceId && bid <= sinceId) break outer;
        if (noRT && post.referenced_tweets?.[0]?.type === 'retweeted') continue;
        if (out.length >= max) { more = true; break outer; }
        out.push(post);
      }
    }
    const users = new Map(); const refs = new Map();
    for (const post of out) {
      users.set(post.author_id, mockUser(Number(post.author_id) - 100000));
      if (post._ref) { refs.set(post._ref.id, publicView(post._ref, now)); users.set(post._ref.author_id, mockUser(Number(post._ref.author_id) - 100000)); }
    }
    const data = out.map((x) => publicView(x, now));
    const meta = { result_count: data.length };
    if (data.length) { meta.newest_id = data[0].id; meta.oldest_id = data[data.length - 1].id; }
    if (more) meta.next_token = data[data.length - 1].id;
    return json(200, { ...(data.length ? { data, includes: { users: [...users.values()], tweets: [...refs.values()] } } : {}), meta });
  }
  if (p === '/2/tweets/counts/recent') {
    const query = sp.get('query') ?? '';
    const gran = sp.get('granularity') ?? 'hour';
    const step = gran === 'minute' ? MIN : gran === 'day' ? 1440 * MIN : 60 * MIN;
    const end = sp.get('end_time') ? Date.parse(sp.get('end_time')) : now - 10_000;
    const start = sp.get('start_time') ? Date.parse(sp.get('start_time')) : now - 7 * 86400e3;
    const k = /-is:retweet/.test(query) ? 0.6 : 1;
    const data = []; let total = 0;
    for (let t = Math.floor(start / step) * step; t < end; t += step) {
      const a = Math.max(t, start); const b = Math.min(t + step, end);
      let n = 0;
      for (let m = Math.floor(a / MIN); m * MIN < b; m++) n += minuteCount(query, m);
      n = Math.round(n * k); total += n;
      data.push({ start: new Date(a).toISOString(), end: new Date(b).toISOString(), tweet_count: n });
    }
    return json(200, { data, meta: { total_tweet_count: total } });
  }
  if (p.startsWith('/2/users/by/username/')) {
    return json(200, { data: { ...mockUser(3), username: decodeURIComponent(p.split('/').pop()) } });
  }
  if (p === '/2/usage/tweets') return json(200, { data: { project_usage: '0', project_cap: '3000000', cap_reset_day: 1 } });
  if (p === '/2/tweets') {
    const ids = new Set((sp.get('ids') ?? '').split(','));
    const data = [];
    for (const list of cache.values()) for (const x of list) if (ids.has(x.id)) data.push(publicView(x, now));
    return json(200, { data });
  }
  if (p.startsWith('/2/tweets/')) {
    const id = p.split('/').pop();
    return json(200, { data: { id, text: 'Demo gönderi', author_id: '100003', conversation_id: id, created_at: new Date(now - 3600e3).toISOString() }, includes: { users: [mockUser(3)] } });
  }
  return json(404, { title: 'Not Found', detail: 'mock: bilinmeyen uç nokta', status: 404 });
}
