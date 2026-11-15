// HTTP sunucusu: JSON uçları, SSE canlı akış ve statik dosya sunumu.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, join, resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const MAX_BODY = 256 * 1024;
const KEEPALIVE_MS = 20_000;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
};

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
};

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, { ...SECURITY_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(data);
}

async function readJson(req) {
  const ct = String(req.headers['content-type'] || '');
  // JSON dışı gövde: başka sitelerden gelen basit form isteklerine (CSRF) kapı açmasın
  if (!ct.includes('application/json')) throw new HttpError(415, 'İstek gövdesi JSON olmalı.');
  let size = 0; const chunks = [];
  for await (const c of req) {
    size += c.length;
    if (size > MAX_BODY) throw new HttpError(413, 'İstek çok büyük.');
    chunks.push(c);
  }
  if (!size) return {};
  try {
    const v = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error();
    return v;
  } catch { throw new HttpError(400, 'İstek gövdesi okunamadı (geçersiz JSON).'); }
}

const toInt = (v, def, min, max) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : def;
};

// Motor çağrıları: motor henüz hazır değilse anlaşılır bir hata döndür
function call(fn) {
  try { return fn(); } catch (e) {
    if (e instanceof HttpError) throw e;
    if (e instanceof TypeError) throw new HttpError(503, 'Pusula hazırlanıyor, birkaç saniye sonra yeniden deneyin.');
    throw e;
  }
}

export function createServer(engine, { port = 4400, host = '127.0.0.1', publicDir = DEFAULT_PUBLIC } = {}) {
  const root = resolve(publicDir);
  const streams = new Set();

  // --- SSE yayını ---
  const broadcast = (evt, data) => {
    if (!streams.size) return;
    let payload;
    try { payload = `event: ${evt}\ndata: ${JSON.stringify(data)}\n\n`; } catch { return; }
    for (const res of streams) res.write(payload);
  };
  const handlers = {
    snapshot: (s) => broadcast('snapshot', s),
    event: (e) => broadcast('event', e),
    status: (s) => broadcast('status', s),
  };
  for (const [evt, fn] of Object.entries(handlers)) engine.on(evt, fn);
  const keepalive = setInterval(() => { for (const res of streams) res.write(': canlı\n\n'); }, KEEPALIVE_MS);
  keepalive.unref?.();

  function openStream(req, res) {
    res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.write('retry: 3000\n\n');
    streams.add(res);
    try { res.write(`event: status\ndata: ${JSON.stringify(engine.status())}\n\n`); } catch { /* motor hazırlanıyor */ }
    req.on('close', () => streams.delete(res));
  }

  const clientExists = (id) => call(() => engine.clients()).some((c) => c.id === id);
  const needClient = (id) => { if (!clientExists(id)) throw new HttpError(404, 'Böyle bir danışan yok.'); };

  // --- API ---
  async function api(req, res, url) {
    const method = req.method;
    const parts = url.pathname.split('/').filter(Boolean).slice(1).map((p) => {
      try { return decodeURIComponent(p); } catch { throw new HttpError(400, 'Adres çözülemedi.'); }
    });
    const q = url.searchParams;
    const [a, id, sub] = parts;

    if (a === 'status' && parts.length === 1 && method === 'GET') return sendJson(res, 200, call(() => engine.status()));
    if (a === 'stream' && parts.length === 1 && method === 'GET') return openStream(req, res);

    if (a === 'events' && parts.length === 1 && method === 'GET') {
      const client = q.get('client') || null;
      const events = call(() => engine.events(client, { limit: toInt(q.get('limit'), 100, 1, 500) })) || [];
      return sendJson(res, 200, { events });
    }

    if (a === 'clients') {
      if (parts.length === 1) {
        if (method === 'GET') return sendJson(res, 200, { clients: call(() => engine.clients()) || [] });
        if (method === 'POST') {
          const body = await readJson(req);
          if (!String(body.name || '').trim()) throw new HttpError(400, 'Danışan adı gerekli.');
          try { return sendJson(res, 201, { client: call(() => engine.addClient(body)) }); }
          catch (e) { if (e instanceof HttpError) throw e; throw new HttpError(400, e.message || 'Danışan eklenemedi.'); }
        }
        throw new HttpError(405, 'Bu işlem desteklenmiyor.');
      }
      if (parts.length === 2 && method === 'DELETE') {
        needClient(id);
        await call(() => engine.removeClient(id));
        return sendJson(res, 200, { ok: true });
      }
      if (parts.length === 3) {
        needClient(id);
        if (sub === 'snapshot' && method === 'GET') return sendJson(res, 200, { snapshot: call(() => engine.snapshot(id)) || null });
        if (sub === 'history' && method === 'GET') return sendJson(res, 200, { history: call(() => engine.history(id)) || [] });
        if (sub === 'items' && method === 'GET') {
          const opts = { limit: toInt(q.get('limit'), 50, 1, 200) };
          const ids = (q.get('ids') || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 200);
          if (ids.length) opts.ids = ids;
          if (q.get('narrative')) opts.narrative = q.get('narrative');
          if (q.get('author')) opts.authorId = q.get('author');
          if (q.get('order') === 'top' || q.get('order') === 'new') opts.order = q.get('order');
          return sendJson(res, 200, { items: call(() => engine.items(id, opts)) || [] });
        }
        if (sub === 'ask' && method === 'POST') {
          const body = await readJson(req);
          const question = String(body.question || '').trim().slice(0, 1000);
          if (!question) throw new HttpError(400, 'Bir soru yazın.');
          return sendJson(res, 200, { answer: String(await engine.ask(id, question) ?? '') });
        }
        if (sub === 'brief' && method === 'POST') {
          const snapshot = await engine.refreshBrief(id);
          return sendJson(res, 200, { snapshot: snapshot || null });
        }
      }
    }

    if (a === 'demo' && parts.length === 1 && method === 'POST') {
      const body = await readJson(req);
      if (body.speed !== undefined) {
        const n = Number(body.speed);
        if (!Number.isFinite(n) || n <= 0) throw new HttpError(400, 'Hız geçersiz.');
        call(() => engine.setSpeed(n));
      }
      if (body.restart) {
        // yeniden başlatma uzun sürebilir; yanıtı bekletme, durum SSE ile gelir
        Promise.resolve().then(() => engine.restartDemo()).catch((e) => console.error('[pusula] yeniden başlatma', e));
      }
      return sendJson(res, 200, { ok: true });
    }

    if (a === 'settings' && parts.length === 1 && method === 'POST') {
      const body = await readJson(req);
      const keys = {};
      if (typeof body.anthropicKey === 'string') keys.anthropicKey = body.anthropicKey.trim();
      if (typeof body.xToken === 'string') keys.xToken = body.xToken.trim();
      if (Object.keys(keys).length) call(() => engine.setKeys(keys));
      if (body.mode !== undefined) {
        if (body.mode !== 'demo' && body.mode !== 'canlı') throw new HttpError(400, 'Mod "demo" ya da "canlı" olmalı.');
        if (typeof engine.setMode !== 'function') throw new HttpError(501, 'Mod değiştirme bu sürümde yok.');
        Promise.resolve().then(() => engine.setMode(body.mode)).catch((e) => console.error('[pusula] mod', e));
      }
      return sendJson(res, 200, { ok: true });
    }

    throw new HttpError(404, 'Böyle bir uç yok.');
  }

  // --- statik ---
  async function serveStatic(req, res, url) {
    if (req.method !== 'GET' && req.method !== 'HEAD') throw new HttpError(405, 'Bu işlem desteklenmiyor.');
    let p;
    try { p = decodeURIComponent(url.pathname); } catch { throw new HttpError(400, 'Adres çözülemedi.'); }
    if (p.includes('\0')) throw new HttpError(400, 'Adres geçersiz.');
    if (p.endsWith('/')) p += 'index.html';
    const file = resolve(root, '.' + p);
    if (file !== root && !file.startsWith(root + sep)) throw new HttpError(403, 'Bu dosyaya erişilemez.');
    let st;
    try { st = await stat(file); } catch { throw new HttpError(404, 'Sayfa bulunamadı.'); }
    if (!st.isFile()) throw new HttpError(404, 'Sayfa bulunamadı.');
    const body = await readFile(file);
    res.writeHead(200, { ...SECURITY_HEADERS,
      'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': body.length, 'Cache-Control': 'no-cache',
      'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'" });
    res.end(req.method === 'HEAD' ? undefined : body);
  }

  // ham yol: istemciler '..' parçalarını normalize etmeden gönderebilir; ayrıştırmadan önce yakala
  const rawTraversal = (u) => /(^|\/|\\)\.\.(\/|\\|$)/.test(u.split('?')[0]) || /%2e%2e|%2f|%5c/i.test(u.split('?')[0]);

  const server = http.createServer(async (req, res) => {
    try {
      const raw = req.url || '/';
      if (!raw.startsWith('/')) throw new HttpError(400, 'Adres geçersiz.');
      const url = new URL(raw, 'http://yerel');
      if (url.pathname === '/api' || url.pathname.startsWith('/api/')) return await api(req, res, url);
      if (rawTraversal(raw)) throw new HttpError(403, 'Bu dosyaya erişilemez.');
      return await serveStatic(req, res, url);
    } catch (e) {
      const status = e instanceof HttpError ? e.status : 500;
      if (status === 500) console.error('[pusula] sunucu hatası', e);
      if (res.headersSent) { res.end(); return; }
      sendJson(res, status, { error: status === 500 ? 'Beklenmeyen bir hata oldu. Lütfen yeniden deneyin.' : e.message });
    }
  });

  return {
    server,
    listen: () => new Promise((ok, fail) => {
      server.once('error', fail);
      server.listen(port, host, () => { server.off('error', fail); ok(server.address()); });
    }),
    close: () => new Promise((ok) => {
      clearInterval(keepalive);
      for (const res of streams) res.end();
      streams.clear();
      if (typeof engine.off === 'function') for (const [evt, fn] of Object.entries(handlers)) engine.off(evt, fn);
      server.close(() => ok());
      server.closeAllConnections?.();
    }),
  };
}
