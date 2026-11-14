// HTTP sunucusu: arayüz dosyaları + JSON API + canlı güncelleme (SSE). Ek bağımlılık yok.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, normalize, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { timingSafeEqual } from 'node:crypto';
import { openStore } from './store.js';
import { createX, buildQuery, parsePostUrl, XError } from './xapi.js';
import { createMonitor } from './monitor.js';
import { analyze } from './analytics.js';
import { buildBrief } from './brief.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const HOUR = 3_600_000;
const RANGES = { '1h': [1, 'Son 1 saat'], '6h': [6, 'Son 6 saat'], '24h': [24, 'Son 24 saat'], '3d': [72, 'Son 3 gün'], '7d': [168, 'Son 7 gün'] };
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

export function createApp({ dbFile = process.env.DB_FILE ?? join(ROOT, 'data', 'nabiz.db'), password = process.env.APP_PASSWORD ?? '' } = {}) {
  const store = openStore(dbFile);
  const envToken = (process.env.X_BEARER_TOKEN ?? '').trim();
  const getToken = () => envToken || store.getSetting('token', '');
  const isDemo = () => !!store.getSetting('demo', false);
  const x = createX({ store, getToken, isDemo });

  const clients = new Set(); let viewerSeen = Date.now();
  const cache = new Map();
  const emit = (event, data) => {
    if (event === 'update') for (const k of cache.keys()) if (k.startsWith(`${data.watchId}|`)) cache.delete(k);
    const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of clients) res.write(msg);
  };
  const monitor = createMonitor({ store, x, emit, isDemo, viewerSeenAt: () => (clients.size ? Date.now() : viewerSeen) });

  function analysisFor(w, range) {
    const key = `${w.id}|${range}`;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < 60_000) return hit.data;
    const now = Date.now(); const rangeMs = RANGES[range][0] * HOUR;
    // Yükselen terim penceresi (en çok 42 saat) için aralıktan biraz geriye de bakılır
    const posts = store.getPosts(w.id, now - Math.max(rangeMs, 42 * HOUR));
    const ids = new Set(); for (const p of posts) { ids.add(p.author_id); if (p.ref_author_id) ids.add(p.ref_author_id); }
    const data = analyze({ countsMin: store.getCounts(w.id, 'minute', now - 25 * HOUR), countsHour: store.getCounts(w.id, 'hour', now - 8 * 24 * HOUR),
      posts, users: store.getUsers(ids), queryWords: buildQuery(w.spec).words, now, rangeMs, client: store.getSetting('client', null) });
    cache.set(key, { at: now, data });
    return data;
  }
  const watchView = (w) => {
    const base = { id: w.id, name: w.name, status: w.status, interval_sec: w.interval_sec, posts_per_poll: w.posts_per_poll, spec: w.spec, query: w.query,
      backfill_done: w.backfill_done, last_poll_at: w.last_poll_at, last_error: w.last_error, running: monitor.isRunning(w.id), created_at: w.created_at,
      stored: store.countPosts(w.id) };
    try {
      const a = analysisFor(w, '24h');
      const top = a.terms.terms.find((t) => t.rising);
      base.summary = { score: a.momentum.score, stage: a.momentum.stage, stageLabel: a.momentum.stageLabel, total24: a.kpi.total, change: a.kpi.change,
        perHour: a.kpi.perHour, topTerm: top?.term ?? null, spark: a.series.map((s) => s.n), topCard: a.cards[0]?.title ?? null };
    } catch (e) { console.error(e); base.summary = null; }
    return base;
  };
  const state = () => ({
    connected: !!getToken(), demo: isDemo(), tokenFromEnv: !!envToken, capabilities: store.getSetting('capabilities', null),
    client: store.getSetting('client', null), autoPause: store.getSetting('autoPause', true), usage: x.usageSummary(),
    watches: store.listWatches().filter((w) => !!w.spec.demo === isDemo()).map(watchView),
  });
  const pinsView = (watchId) => {
    const posts = new Map(store.getPosts(watchId).map((p) => [p.id, p]));
    return store.listPins(watchId).map((p) => {
      if (p.kind !== 'post') return p;
      const post = posts.get(p.ref_id); if (!post) return p;
      const u = store.getUsers([post.author_id]).get(post.author_id);
      return { ...p, post: { id: post.id, text: post.text, username: u?.username ?? null, engagement: post.likes + 2 * post.reposts + 2 * post.quotes + 1.5 * post.replies } };
    });
  };

  async function resolveSpec(raw) {
    const list = (v) => (Array.isArray(v) ? v : []).map((s) => String(s).trim()).filter(Boolean).slice(0, 30);
    const spec = { any: list(raw.any), all: list(raw.all), accounts: list(raw.accounts), exclude: list(raw.exclude),
      accountMode: ['from', 'mention', 'both'].includes(raw.accountMode) ? raw.accountMode : 'both',
      lang: /^[a-z]{2}$/.test(raw.lang ?? '') ? raw.lang : '', excludeReposts: raw.excludeReposts !== false, demo: isDemo() };
    if (raw.postUrl) {
      const id = parsePostUrl(raw.postUrl);
      if (!id) throw new XError('bad_query', 'Gönderi adresi tanınmadı. Örnek: https://x.com/kullanici/status/1234567890');
      spec.postId = id; spec.postUrl = String(raw.postUrl).trim();
      if (raw.postId === id && raw.conversationId) { spec.conversationId = raw.conversationId; spec.postPreview = raw.postPreview ?? null; spec.postVariant = raw.postVariant ?? 0; } else {
        const { post, author } = await x.getPost(id);
        spec.conversationId = post.conversation_id ?? id;
        spec.postPreview = { text: post.text, username: author?.username ?? null, created_at: post.created_at };
        spec.postVariant = 0;
      }
    }
    return spec;
  }
  // Sayım çağrısı sorguyu da sınar; gönderi izlemede operatör kabul edilmezse yedek biçime geçilir
  async function previewCounts(spec) {
    for (;;) {
      const q = buildQuery(spec);
      try { return { q, counts: await x.counts(q.countsQuery, { granularity: 'hour', startMs: Date.now() - 7 * 24 * HOUR + 120_000 }) }; } catch (e) {
        if (e.code === 'bad_query' && spec.postId && (spec.postVariant ?? 0) < 2) { spec.postVariant = (spec.postVariant ?? 0) + 1; continue; }
        throw e;
      }
    }
  }

  const routes = [
    ['GET', /^\/api\/state$/, () => state()],
    ['POST', /^\/api\/token$/, async (_, b) => {
      const token = String(b.token ?? '').trim().replace(/^Bearer\s+/i, '');
      if (token.length < 20) throw new XError('bad_token', 'Token çok kısa görünüyor. X Geliştirici Konsolu\'ndaki “Bearer Token” değerini eksiksiz yapıştırın.');
      const wasDemo = isDemo(); store.setSetting('demo', false);
      let r;
      try { r = await x.probe(token); } finally { store.setSetting('demo', wasDemo); }
      if (!r.valid) throw new XError('bad_token', r.message || 'Token doğrulanamadı.');
      store.setSetting('token', token); store.setSetting('capabilities', r); store.setSetting('demo', false);
      return { ok: true, capabilities: r, state: state() };
    }],
    ['DELETE', /^\/api\/token$/, () => { store.delSetting('token'); store.delSetting('capabilities'); return state(); }],
    ['POST', /^\/api\/demo$/, (_, b) => { store.setSetting('demo', !!b.on); return state(); }],
    ['PUT', /^\/api\/client$/, (_, b) => {
      const s = (v, n) => String(v ?? '').trim().slice(0, n);
      store.setSetting('client', { name: s(b.name, 120), handle: s(b.handle, 40).replace(/^@/, ''), goals: s(b.goals, 1000),
        sensitive: (Array.isArray(b.sensitive) ? b.sensitive : String(b.sensitive ?? '').split(',')).map((x) => s(x, 60)).filter(Boolean).slice(0, 30) });
      cache.clear();
      return state();
    }],
    ['PUT', /^\/api\/settings$/, (_, b) => {
      const num = (v, lo, hi) => Math.min(hi, Math.max(lo, Number(v)));
      if (b.budget) store.setSetting('budget', { daily: num(b.budget.daily, 0, 10000) || 0, monthly: num(b.budget.monthly, 0, 100000) || 0 });
      if (b.prices) store.setSetting('prices', { post: num(b.prices.post, 0, 10) || 0, user: num(b.prices.user, 0, 10) || 0, counts: num(b.prices.counts, 0, 10) || 0 });
      if (typeof b.autoPause === 'boolean') store.setSetting('autoPause', b.autoPause);
      return state();
    }],
    ['POST', /^\/api\/preview$/, async (_, b) => {
      const spec = await resolveSpec(b.spec ?? {});
      const { q, counts } = await previewCounts(spec);
      const now = Date.now();
      return { spec, query: q.query, countsQuery: q.countsQuery, total7d: counts.total || counts.buckets.reduce((s, x) => s + x.n, 0),
        last24h: counts.buckets.filter((x) => x.ts >= now - 24 * HOUR).reduce((s, x) => s + x.n, 0),
        series: counts.buckets.map((x) => ({ ts: x.ts, n: x.n })), usage: x.usageSummary() };
    }],
    ['POST', /^\/api\/watches$/, async (_, b) => {
      const spec = await resolveSpec(b.spec ?? {});
      const q = buildQuery(spec);
      const int = (v, lo, hi, d) => (Number.isFinite(Number(v)) ? Math.min(hi, Math.max(lo, Math.round(Number(v)))) : d);
      const w = store.createWatch({ name: String(b.name ?? '').trim().slice(0, 80) || spec.any[0] || spec.accounts[0] || 'İzleme', spec, query: q.query,
        interval_sec: int(b.interval_sec, 60, 3600, 300), posts_per_poll: int(b.posts_per_poll, 10, 100, 25),
        backfill_hours: int(b.backfill_hours, 1, 168, 24), backfill_posts: int(b.backfill_posts, 0, 5000, 200) });
      monitor.tick(w.id);
      return { id: w.id };
    }],
    ['PATCH', /^\/api\/watches\/(\d+)$/, (m, b) => {
      const patch = {};
      if (['active', 'paused'].includes(b.status)) patch.status = b.status;
      if (b.interval_sec) patch.interval_sec = Math.min(3600, Math.max(60, Math.round(Number(b.interval_sec)) || 300));
      if (b.posts_per_poll) patch.posts_per_poll = Math.min(100, Math.max(10, Math.round(Number(b.posts_per_poll)) || 50));
      if (b.name) patch.name = String(b.name).trim().slice(0, 80);
      store.updateWatch(Number(m[1]), patch);
      emit('update', { watchId: Number(m[1]) });
      return { ok: true };
    }],
    ['DELETE', /^\/api\/watches\/(\d+)$/, (m) => { store.deleteWatch(Number(m[1])); emit('update', { watchId: Number(m[1]) }); return { ok: true }; }],
    ['POST', /^\/api\/watches\/(\d+)\/refresh$/, (m) => { monitor.tick(Number(m[1]), { force: true }); return { ok: true }; }],
    ['POST', /^\/api\/watches\/(\d+)\/refresh-metrics$/, async (m) => {
      const w = need(m[1]);
      const ids = analysisFor(w, '24h').content.topPosts.map((p) => p.id);
      const cutoff = Date.now() - 2 * HOUR;
      for (const p of store.getPosts(w.id, cutoff)) if (p.kind !== 'repost' && ids.length < 100 && !ids.includes(p.id)) ids.push(p.id);
      if (!ids.length) return { updated: 0 };
      const r = await x.refreshPosts(ids);
      store.upsertPosts(w.id, r.posts.map((p) => ({ ...p, author_id: p.author_id })));
      emit('update', { watchId: w.id });
      return { updated: r.posts.length };
    }],
    ['GET', /^\/api\/watches\/(\d+)\/analysis$/, (m, _, url) => {
      const w = need(m[1]); const range = RANGES[url.searchParams.get('range')] ? url.searchParams.get('range') : '24h';
      return { watch: watchView(w), range, analysis: analysisFor(w, range), pins: pinsView(w.id), usage: x.usageSummary() };
    }],
    ['GET', /^\/api\/watches\/(\d+)\/brief$/, (m, _, url) => {
      const w = need(m[1]); const range = RANGES[url.searchParams.get('range')] ? url.searchParams.get('range') : '24h';
      return { text: buildBrief({ watch: w, analysis: analysisFor(w, range), client: store.getSetting('client', null), pins: pinsView(w.id), rangeLabel: RANGES[range][1] }) };
    }],
    ['POST', /^\/api\/watches\/(\d+)\/pins$/, (m, b) => {
      const w = need(m[1]);
      if (!['post', 'account', 'term', 'note'].includes(b.kind)) throw new XError('bad_request', 'Geçersiz sabitleme türü.');
      const id = store.addPin(w.id, b.kind, b.ref_id ? String(b.ref_id).slice(0, 200) : null, b.note ? String(b.note).slice(0, 2000) : null);
      return { id, pins: pinsView(w.id) };
    }],
    ['DELETE', /^\/api\/watches\/(\d+)\/pins\/(\d+)$/, (m) => { store.deletePin(Number(m[2])); return { pins: pinsView(Number(m[1])) }; }],
  ];
  function need(id) {
    const w = store.getWatch(Number(id));
    if (!w) throw new XError('not_found', 'İzleme bulunamadı.', { status: 404 });
    return w;
  }

  function authorized(req) {
    if (!password) return true;
    const h = req.headers.authorization ?? '';
    if (!h.startsWith('Basic ')) return false;
    const got = Buffer.from(Buffer.from(h.slice(6), 'base64').toString().split(':').slice(1).join(':'));
    const want = Buffer.from(password);
    return got.length === want.length && timingSafeEqual(got, want);
  }

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const send = (code, body, type = 'application/json; charset=utf-8') => { res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' }); res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body)); };
    try {
      if (!authorized(req)) { res.writeHead(401, { 'www-authenticate': 'Basic realm="Nabiz"' }); return res.end('Yetkisiz'); }
      if (url.pathname === '/api/events') {
        res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' });
        res.write('retry: 3000\n\n');
        clients.add(res);
        req.on('close', () => { clients.delete(res); viewerSeen = Date.now(); });
        return;
      }
      if (url.pathname.startsWith('/api/')) {
        // Başka sitelerden gelen isteklere karşı: değiştiren çağrılar JSON içerik türü ister
        if (req.method !== 'GET' && !(req.headers['content-type'] ?? '').includes('application/json')) return send(415, { error: 'JSON bekleniyor.' });
        for (const [method, re, fn] of routes) {
          const m = req.method === method && url.pathname.match(re);
          if (!m) continue;
          let body = {};
          if (req.method !== 'GET') {
            let raw = '';
            for await (const chunk of req) { raw += chunk; if (raw.length > 1e6) throw new XError('bad_request', 'İstek çok büyük.'); }
            body = raw ? JSON.parse(raw) : {};
          }
          return send(200, await fn(m, body, url));
        }
        return send(404, { error: 'Bulunamadı.' });
      }
      const rel = normalize(url.pathname === '/' ? '/index.html' : url.pathname).replace(/^(\.\.[/\\])+/, '');
      const file = join(PUBLIC, rel);
      if (!file.startsWith(PUBLIC)) return send(403, 'Yasak', 'text/plain');
      try { return send(200, await readFile(file), MIME[extname(file)] ?? 'application/octet-stream'); } catch { return send(404, 'Bulunamadı', 'text/plain; charset=utf-8'); }
    } catch (e) {
      if (e instanceof XError) return send(e.code === 'not_found' ? 404 : 400, { error: e.message, code: e.code });
      console.error(e);
      return send(500, { error: 'Beklenmeyen bir hata oluştu.' });
    }
  });
  const ping = setInterval(() => { for (const res of clients) res.write(': ping\n\n'); }, 25_000);
  return { server, store, monitor, x, close() { clearInterval(ping); monitor.stop(); for (const c of clients) c.end(); server.close(); store.close(); } };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 4321);
  const host = process.env.HOST ?? (process.env.APP_PASSWORD ? '0.0.0.0' : '127.0.0.1');
  const app = createApp();
  app.server.listen(port, host, () => {
    app.monitor.start();
    console.log(`\n  Nabız çalışıyor →  http://localhost:${port}\n  Kapatmak için Ctrl+C\n`);
  });
}
