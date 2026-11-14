// İzleme döngüsü: geçmişi doldurur, sonra belirlenen aralıkla sayım + yeni gönderi çeker.
import { buildQuery, XError } from './xapi.js';

const MIN = 60_000; const HOUR = 3_600_000; const DAY = 86_400_000;
const TW_EPOCH = 1288834974657n;
const idTime = (id) => Number((BigInt(id) >> 22n) + TW_EPOCH);
const maxId = (a, b) => (!a ? b : !b ? a : BigInt(a) > BigInt(b) ? a : b);

export function createMonitor({ store, x, emit, isDemo, viewerSeenAt, onTick = () => {} }) {
  let busy = false; let timer = null;
  const running = new Set();

  function deriveHours(watchId, fromTs) {
    const rows = store.db.prepare(`SELECT ts / ${HOUR} AS h, COUNT(*) AS c, SUM(n) AS s FROM counts
      WHERE watch_id = ? AND gran = 'minute' AND ts >= ? GROUP BY h HAVING c = 60`).all(watchId, Math.floor(fromTs / HOUR) * HOUR);
    store.upsertCounts(watchId, 'hour', rows.map((r) => ({ ts: r.h * HOUR, n: r.s })));
  }
  const fullMinutes = (buckets) => buckets.filter((b) => !b.partial).map((b) => ({ ts: Math.floor(b.ts / MIN) * MIN, n: b.n }));

  async function backfill(w, q, now) {
    emit('progress', { watchId: w.id, step: 'Hacim geçmişi alınıyor…' });
    const hourly = await x.counts(q.countsQuery, { granularity: 'hour', startMs: now - 7 * DAY + 2 * MIN });
    store.upsertCounts(w.id, 'hour', hourly.buckets.filter((b, i) => !(i === 0 && b.partial)).map((b) => ({ ts: Math.floor(b.ts / HOUR) * HOUR, n: b.n })));
    const minute = await x.counts(q.countsQuery, { granularity: 'minute', startMs: now - DAY + 2 * MIN });
    store.upsertCounts(w.id, 'minute', fullMinutes(minute.buckets));
    emit('update', { watchId: w.id });

    // Örneklem zamana yayılır: yakın geçmiş sık, eski dönem seyrek dilimlenir; her dilime eşit pay düşer.
    // Böylece sıcak bir konuda bütün bütçe son dakikalara gitmez ve "önce/sonra" karşılaştırması yapılabilir.
    const target = w.backfill_posts;
    let got = 0; let newest = null;
    const take = (r) => { store.upsertUsers(r.users); store.upsertPosts(w.id, r.posts); got += r.posts.length; newest = maxId(newest, r.meta.newest_id); };
    if (target > 0) {
      const edges = [0, 1, 2, 4, 8, 16, 24, 48, 96, 168].filter((h) => h < w.backfill_hours).concat(w.backfill_hours);
      const hourN = (from, to) => hourly.buckets.filter((b) => b.ts + HOUR > from && b.ts < to).reduce((s, b) => s + b.n, 0);
      const slices = [];
      for (let i = 0; i + 1 < edges.length; i++) {
        const s = { from: now - edges[i + 1] * HOUR, to: i === 0 ? null : now - edges[i] * HOUR };
        if (hourN(s.from, s.to ?? now) > 0) slices.push(s);
      }
      const quota = Math.max(10, Math.ceil(target / Math.max(1, slices.length)));
      for (const s of slices) {
        let left = quota; let next;
        while (left > 0) {
          emit('progress', { watchId: w.id, step: `Geçmiş getiriliyor… ${got} / ${target} gönderi` });
          const r = await x.search(q.query, { startMs: Math.max(s.from, now - 7 * DAY + 2 * MIN), endMs: s.to, max: Math.min(100, Math.max(10, left)), nextToken: next });
          take(r); left -= r.posts.length;
          next = r.meta.next_token;
          if (!next || !r.posts.length) break;
        }
      }
    }
    store.updateWatch(w.id, { backfill_done: true, since_id: newest });
  }

  async function poll(w, q, now, force) {
    const mins = store.getCounts(w.id, 'minute', now - DAY);
    const lastMin = mins.length ? mins[mins.length - 1].ts : null;
    const start = Math.max(now - DAY + 2 * MIN, lastMin ? lastMin - 3 * MIN : 0);
    const c = await x.counts(q.countsQuery, { granularity: 'minute', startMs: start });
    const buckets = fullMinutes(c.buckets);
    store.upsertCounts(w.id, 'minute', buckets);
    deriveHours(w.id, start - HOUR);
    store.db.prepare("DELETE FROM counts WHERE watch_id = ? AND gran = 'minute' AND ts < ?").run(w.id, now - 2 * DAY);
    const fresh = buckets.filter((b) => !lastMin || b.ts > lastMin).reduce((s, b) => s + b.n, 0);
    if (fresh > 0 || force || !w.since_id) {
      const usable = w.since_id && now - idTime(w.since_id) < 6.5 * DAY;
      const r = await x.search(q.query, usable ? { sinceId: w.since_id, max: w.posts_per_poll } : { startMs: now - 6 * HOUR, max: w.posts_per_poll });
      store.upsertUsers(r.users); store.upsertPosts(w.id, r.posts);
      if (r.meta.newest_id) store.updateWatch(w.id, { since_id: maxId(w.since_id, r.meta.newest_id) });
    }
    // Gözlem günlüğünün izlediği sıcak gönderilerin etkileşimini en çok 15 dakikada bir yeniden oku
    if (store.getSetting('trackPosts', true)) {
      const ids = Object.keys(store.getSetting(`jstate:${w.id}`, null)?.watch ?? {});
      if (ids.length && now - store.getSetting(`reread:${w.id}`, 0) >= 15 * MIN) {
        store.setSetting(`reread:${w.id}`, now);
        const r = await x.refreshPosts(ids);
        store.upsertPosts(w.id, r.posts);
      }
    }
  }

  async function tick(id, { force = false } = {}) {
    if (running.has(id)) return;
    running.add(id);
    let w = store.getWatch(id);
    try {
      if (!w) return;
      const q = buildQuery(w.spec);
      const now = Date.now();
      if (!w.backfill_done) await backfill(w, q, now); else await poll(w, q, now, force);
      store.updateWatch(id, { last_poll_at: Date.now(), last_error: null });
      try { onTick(id); } catch (e) { console.error(e); }
    } catch (e) {
      const msg = e instanceof XError ? e.message : `Beklenmeyen hata: ${e.message}`;
      if (!(e instanceof XError)) console.error(e);
      if (store.getWatch(id)) store.updateWatch(id, { last_poll_at: Date.now(), last_error: msg });
    } finally {
      running.delete(id);
      emit('update', { watchId: id });
    }
  }

  async function loop() {
    if (busy) return;
    busy = true;
    try {
      const autoPause = store.getSetting('autoPause', true);
      if (autoPause && Date.now() - viewerSeenAt() > 30 * MIN) return; // kimse bakmıyorken harcama yapma
      for (const w of store.listWatches()) {
        if (w.status !== 'active' || !!w.spec.demo !== isDemo()) continue;
        if (w.last_poll_at && Date.now() - w.last_poll_at < w.interval_sec * 1000) continue;
        await tick(w.id);
      }
    } finally { busy = false; }
  }

  return {
    tick,
    isRunning: (id) => running.has(id),
    start() {
      // Saklama süresi: 30 günden eski gönderiler silinir (X geliştirici politikası gereği kısa tutulur)
      store.db.prepare('DELETE FROM posts WHERE created_at < ?').run(Date.now() - 30 * DAY);
      timer = setInterval(loop, 5000);
      loop();
    },
    stop() { clearInterval(timer); },
  };
}
