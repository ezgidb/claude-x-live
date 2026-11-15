// Arayüz sunucusu: uçlar, SSE, statik dosya ve güvenlik.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from '../src/server.js';
import { createFakeEngine } from './fake-engine.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let app, engine, base, port;

before(async () => {
  engine = createFakeEngine({ tickMs: 150 });
  app = createServer(engine, { port: 0, publicDir: join(root, 'public') });
  const addr = await app.listen();
  port = addr.port; base = `http://127.0.0.1:${port}`;
  await engine.start();
});
after(async () => { engine.stop(); await app.close(); });

const get = async (p) => { const r = await fetch(base + p); return { status: r.status, body: await r.json() }; };
const post = async (p, body, method = 'POST') => {
  const r = await fetch(base + p, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: r.status, body: await r.json() };
};
// ham istek: fetch '..' parçalarını normalize ettiği için doğrudan http ile
const raw = (path) => new Promise((ok, fail) => {
  const req = http.request({ host: '127.0.0.1', port, path, method: 'GET' }, (res) => {
    let data = ''; res.on('data', (c) => { data += c; }); res.on('end', () => ok({ status: res.statusCode, data }));
  });
  req.on('error', fail); req.end();
});

test('durum ve danışan listesi', async () => {
  const s = await get('/api/status');
  assert.equal(s.status, 200);
  assert.equal(s.body.mode, 'demo');
  assert.ok(Number.isFinite(s.body.clock.now));
  const c = await get('/api/clients');
  assert.equal(c.status, 200);
  assert.equal(c.body.clients.length, 3);
  assert.ok(c.body.clients.some((x) => x.id === 'anadolu-sut'));
});

test('anlık görüntü, geçmiş, olaylar, gönderiler', async () => {
  const s = await get('/api/clients/anadolu-sut/snapshot');
  assert.equal(s.status, 200);
  assert.equal(s.body.snapshot.clientId, 'anadolu-sut');
  assert.equal(s.body.snapshot.risk.level, 'kırmızı');
  assert.ok(s.body.snapshot.pulse.series.length > 100);
  const h = await get('/api/clients/anadolu-sut/history');
  assert.ok(Array.isArray(h.body.history) && h.body.history.length > 0);
  const e = await get('/api/events?limit=5');
  assert.equal(e.body.events.length, 5);
  const e2 = await get('/api/events?client=kuzey-havayollari');
  assert.ok(e2.body.events.every((x) => x.clientId === 'kuzey-havayollari'));
  const nar = s.body.snapshot.narratives[0];
  const it = await get(`/api/clients/anadolu-sut/items?narrative=${encodeURIComponent(nar.id)}&order=top&limit=3`);
  assert.equal(it.status, 200);
  assert.ok(it.body.items.length > 0 && it.body.items.length <= 3);
  const ids = nar.topItemIds.slice(0, 2);
  const byIds = await get(`/api/clients/anadolu-sut/items?ids=${ids.map(encodeURIComponent).join(',')}`);
  assert.deepEqual(byIds.body.items.map((x) => x.id).sort(), [...ids].sort());
});

test('soru, not yenileme, danışan ekle/sil', async () => {
  const a = await post('/api/clients/anadolu-sut/ask', { question: 'Kim başlattı?' });
  assert.equal(a.status, 200);
  assert.match(a.body.answer, /ayse_anne34/);
  const empty = await post('/api/clients/anadolu-sut/ask', { question: '  ' });
  assert.equal(empty.status, 400);
  assert.ok(empty.body.error);
  const b = await post('/api/clients/selin-aktas/brief', {});
  assert.equal(b.status, 200);
  assert.ok(b.body.snapshot.brief);
  const c = await post('/api/clients', { name: 'Deneme Kurumu', kind: 'kurum', terms: 'deneme, @deneme' });
  assert.equal(c.status, 201);
  assert.deepEqual(c.body.client.terms, ['deneme', '@deneme']);
  const bad = await post('/api/clients', { name: '' });
  assert.equal(bad.status, 400);
  assert.match(bad.body.error, /ad/i);
  const d = await post(`/api/clients/${c.body.client.id}`, undefined, 'DELETE');
  assert.equal(d.status, 200);
  assert.equal((await get('/api/clients')).body.clients.length, 3);
});

test('ayarlar ve demo uçları', async () => {
  assert.equal((await post('/api/settings', { anthropicKey: 'sk-deneme' })).status, 200);
  const s = await get('/api/status');
  assert.equal(s.body.ai, 'claude');
  assert.ok(!JSON.stringify(s.body).includes('sk-deneme'), 'anahtar geri dönmemeli');
  assert.equal((await post('/api/settings', { mode: 'uydurma' })).status, 400);
  assert.equal((await post('/api/demo', { speed: 300 })).status, 200);
  assert.equal((await get('/api/status')).body.clock.speed, 300);
  await post('/api/demo', { speed: 60 });
  await post('/api/settings', { anthropicKey: '' });
});

test('JSON olmayan gövde reddedilir', async () => {
  const r = await fetch(base + '/api/demo', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: 'speed=1' });
  assert.equal(r.status, 415);
  const bad = await fetch(base + '/api/demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bozuk' });
  assert.equal(bad.status, 400);
  assert.ok((await bad.json()).error);
});

test('404 yanıtları Türkçe JSON', async () => {
  const a = await get('/api/yok');
  assert.equal(a.status, 404);
  assert.match(a.body.error, /uç/);
  const b = await get('/api/clients/olmayan/snapshot');
  assert.equal(b.status, 404);
  assert.match(b.body.error, /danışan/);
  const c = await raw('/olmayan-dosya.js');
  assert.equal(c.status, 404);
});

test('statik dosya ve dizin dışına çıkış koruması', async () => {
  const idx = await raw('/');
  assert.equal(idx.status, 200);
  assert.match(idx.data, /<html/i);
  for (const p of ['/../package.json', '/../src/server.js', '/%2e%2e/package.json', '/..%2fpackage.json', '/%2e%2e%2f%2e%2e%2fetc/passwd', '/..\\package.json']) {
    const r = await raw(p);
    assert.ok(r.status === 403 || r.status === 404 || r.status === 400, `${p} → ${r.status}`);
    assert.ok(!r.data.includes('"name": "pusula"') && !r.data.includes('createServer'), `${p} sızdırdı`);
  }
});

test('SSE en az bir snapshot olayı iletir', async () => {
  const got = await new Promise((ok, fail) => {
    const req = http.get({ host: '127.0.0.1', port, path: '/api/stream' }, (res) => {
      assert.match(res.headers['content-type'], /text\/event-stream/);
      let buf = '';
      const seen = new Set();
      res.setEncoding('utf8');
      res.on('data', (c) => {
        buf += c;
        let i;
        while ((i = buf.indexOf('\n\n')) >= 0) {
          const block = buf.slice(0, i); buf = buf.slice(i + 2);
          const evt = /^event: (.+)$/m.exec(block)?.[1];
          const data = /^data: (.+)$/m.exec(block)?.[1];
          if (evt) seen.add(evt);
          if (evt === 'snapshot') { req.destroy(); ok({ seen, snap: JSON.parse(data) }); return; }
        }
      });
    });
    req.on('error', (e) => { if (e.code !== 'ECONNRESET') fail(e); });
    setTimeout(() => fail(new Error('SSE zaman aşımı')), 5000).unref();
  });
  assert.ok(got.seen.has('status'), 'bağlanınca durum gelmeli');
  assert.ok(got.snap.clientId && got.snap.risk);
});
