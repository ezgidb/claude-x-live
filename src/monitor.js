// İzleme döngüsü. Üç iş yapar:
//  1) Tarama listeleri: yalnızca sayım verisiyle (gönderi okumadan) hareketlenme arar.
//  2) İncelemeler: onaylanan plana göre hedefli gönderi çekimi.
//  3) Canlı izlemeler: belirlenen aralıkla sayım + yeni gönderiler.
import { buildQuery, XError } from './xapi.js';
import { momentum } from './analytics.js';
import { segmentFetch } from './plan.js';

const MIN = 60_000; const HOUR = 3_600_000; const DAY = 86_400_000;
const TW_EPOCH = 1288834974657n;
const idTime = (id) => Number((BigInt(id) >> 22n) + TW_EPOCH);
const maxId = (a, b) => (!a ? b : !b ? a : BigInt(a) > BigInt(b) ? a : b);
const tHM = (ms) => new Date(ms).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
const fmt = (n) => Math.round(n).toLocaleString('tr-TR');

// Liste öğesi -> sorgu tanımı ("@hesap" hesap olarak, diğerleri kelime/etiket/ifade olarak)
export function itemSpec(value, lang) {
  const v = String(value).trim();
  return v.startsWith('@') ? { accounts: [v], accountMode: 'both', lang } : { any: [v], lang };
}

export function createMonitor({ store, x, emit, isDemo, viewerSeenAt, onTick = () => {}, onAlert = () => {} }) {
  let busy = false; let timer = null;
  const running = new Set(); const scanning = new Set();

  function deriveHours(key, fromTs) {
    const rows = store.db.prepare(`SELECT ts / ${HOUR} AS h, COUNT(*) AS c, SUM(n) AS s FROM counts
      WHERE watch_id = ? AND gran = 'minute' AND ts >= ? GROUP BY h HAVING c = 60`).all(key, Math.floor(fromTs / HOUR) * HOUR);
    store.upsertCounts(key, 'hour', rows.map((r) => ({ ts: r.h * HOUR, n: r.s })));
  }
  const fullMinutes = (buckets) => buckets.filter((b) => !b.partial).map((b) => ({ ts: Math.floor(b.ts / MIN) * MIN, n: b.n }));

  // Sayımları eşitler: ilk seferde 7 günlük saatlik + 24 saatlik dakikalık; sonra yalnızca aradaki dakikalar.
  // Dönen: son eşitlemeden beri gelen yeni gönderi sayısı.
  async function syncCounts(key, countsQuery, now) {
    const mins = store.getCounts(key, 'minute', now - DAY);
    const lastMin = mins.length ? mins[mins.length - 1].ts : null;
    if (!lastMin || !store.getCounts(key, 'hour', now - 7 * DAY).length) {
      const hourly = await x.counts(countsQuery, { granularity: 'hour', startMs: now - 7 * DAY + 2 * MIN });
      store.upsertCounts(key, 'hour', hourly.buckets.filter((b, i) => !(i === 0 && b.partial)).map((b) => ({ ts: Math.floor(b.ts / HOUR) * HOUR, n: b.n })));
    }
    const start = Math.max(now - DAY + 2 * MIN, lastMin ? lastMin - 3 * MIN : 0);
    const c = await x.counts(countsQuery, { granularity: 'minute', startMs: start });
    const buckets = fullMinutes(c.buckets);
    store.upsertCounts(key, 'minute', buckets);
    deriveHours(key, start - HOUR);
    store.db.prepare("DELETE FROM counts WHERE watch_id = ? AND gran = 'minute' AND ts < ?").run(key, now - 2 * DAY);
    return buckets.filter((b) => !lastMin || b.ts > lastMin).reduce((s, b) => s + b.n, 0);
  }

  // ---------------------------------------------------------------- 1) tarama listeleri
  async function scanList(listId) {
    if (scanning.has(listId)) return;
    scanning.add(listId);
    const list = store.getList(listId);
    try {
      if (!list) return;
      emit('scan', { listId, running: true });
      for (const item of list.items) {
        const now = Date.now();
        const q = buildQuery(itemSpec(item.value, list.lang));
        await syncCounts(-item.id, q.countsQuery, now);
        const m = momentum(store.getCounts(-item.id, 'minute', now - 25 * HOUR), store.getCounts(-item.id, 'hour', now - 8 * DAY), now);
        const spark = []; for (let i = 0; i < m.bins.length; i += 6) spark.push(m.bins.slice(i, i + 6).reduce((s, b) => s + b.n, 0));
        const lastHour = m.bins.slice(-12).reduce((s, b) => s + b.n, 0);
        const result = { at: now, stage: m.stage, stageLabel: m.stageLabel, score: m.score, last30: m.last30, prev30: m.prev30, baseline30: m.baseline30,
          ratio: m.ratio, lastHour, total24: m.bins.reduce((s, b) => s + b.n, 0), spark, burstStart: m.burst?.start ?? null, burstActive: !!m.burst?.active, lowVolume: m.lowVolume };
        const st = item.state ?? { alertAt: 0, autoAt: 0 };
        if (m.burst?.active && !m.lowVolume && now - st.alertAt > 2 * HOUR) {
          st.alertAt = now;
          const text = `“${item.value}” hareketlendi: son 30 dakikada ${fmt(m.last30)} gönderi (bu saat için olağan ~${fmt(m.baseline30)}). Dalga ${tHM(m.burst.start)} dolaylarında başlamış görünüyor.`;
          const entry = { type: 'scan_alert', level: 1, cat: 'seyir', text, evidence: `Liste: ${list.name} · ivme ${m.score}/100` };
          entry.id = store.addJournal(-item.id, { ...entry, ts: now }); entry.ts = now;
          emit('journal', { watchId: -item.id, name: list.name, entries: [entry] });
          if (list.auto && now - st.autoAt > 6 * HOUR) {
            st.autoAt = now;
            try { await onAlert({ list, item, burstStart: m.burst.start }); } catch (e) { console.error(e); }
          }
        }
        store.updateItem(item.id, { result, state: st });
      }
      store.updateList(listId, { last_scan_at: Date.now(), last_error: null });
    } catch (e) {
      if (!(e instanceof XError)) console.error(e);
      store.updateList(listId, { last_scan_at: Date.now(), last_error: e instanceof XError ? e.message : `Beklenmeyen hata: ${e.message}` });
    } finally {
      scanning.delete(listId);
      emit('scan', { listId, running: false });
    }
  }

  // ---------------------------------------------------------------- 2) inceleme: plana göre çekim
  async function runPlan(w, q, now) {
    const inv = w.spec.investigation; const plan = inv.plan;
    emit('progress', { watchId: w.id, step: 'Hacim geçmişi alınıyor…' });
    await syncCounts(w.id, q.countsQuery, now);
    const target = plan.segments.reduce((n, s) => n + segmentFetch(s), 0) + (plan.top ? 100 : 0);
    let got = 0; let newest = null;
    const take = (r) => { store.upsertUsers(r.users); store.upsertPosts(w.id, r.posts); got += r.posts.length; newest = maxId(newest, r.meta.newest_id); };
    const step = (label) => emit('progress', { watchId: w.id, step: `${label} okunuyor… ${got} / ~${target} gönderi` });
    const lo = now - 7 * DAY + 2 * MIN; const hi = now - 15_000;
    const win = (a, b) => ({ startMs: Math.max(a, lo), endMs: b >= hi ? undefined : b });
    for (const s of plan.segments) {
      const n = segmentFetch(s);
      if (!n) continue;
      if (s.take === 'full') { // dilimin tamamı: sayfa sayfa sonuna kadar
        let next; let left = n + 50;
        for (let page = 0; page < 60 && left > 0; page++) {
          step(s.label);
          const r = await x.search(q.query, { ...win(s.from, s.to), max: 100, nextToken: next });
          take(r); left -= r.posts.length; next = r.meta.next_token;
          if (!next || !r.posts.length) break;
        }
      } else { // temsilî: dilim eşit alt aralıklara bölünür, her birinden eşit sayıda gönderi
        const k = Math.max(1, Math.min(Math.ceil((s.to - s.from) / (10 * MIN)), Math.ceil(n / 10)));
        const per = Math.min(100, Math.max(10, Math.ceil(n / k)));
        const size = (s.to - s.from) / k;
        for (let i = k - 1; i >= 0; i--) {
          step(s.label);
          take(await x.search(q.query, { ...win(s.from + i * size, s.from + (i + 1) * size), max: per }));
        }
      }
    }
    if (plan.important?.take) { // yüksek etkileşimli gönderilerin tamamı (temsilî okunan evrelerde önemli olanı kaçırmamak için)
      let next;
      for (let page = 0; page < 12; page++) {
        step('Yüksek etkileşimli gönderiler');
        const r = await x.search(`${q.query} ${plan.important.op}`, { ...win(plan.from, plan.to), max: 100, nextToken: next });
        take(r); next = r.meta.next_token;
        if (!next || !r.posts.length) break;
      }
    } else if (plan.top) { // dönem boyunca en çok etkileşim alanlar
      step('Öne çıkanlar');
      take(await x.search(q.query, { ...win(plan.from, plan.to), max: 100, sort: 'relevancy' }));
    }
    // Anahtar gönderilerin yanıt zincirleri: anahtar kelime geçmeyen tepkiler de okunur
    if (plan.threads?.take) {
      try {
        const E = (p) => p.likes + 2 * p.reposts + 2 * p.quotes + 1.5 * p.replies;
        const own = store.getPosts(w.id, plan.from).filter((p) => !p.thread && p.kind !== 'repost' && p.kind !== 'reply');
        const onset = plan.segments.find((s) => s.key === 'onset');
        const firsts = onset ? own.filter((p) => p.created_at >= onset.from && p.created_at < onset.to && p.replies >= 3).slice(0, 3) : [];
        const tops = own.filter((p) => p.replies >= 5).sort((a, b) => E(b) - E(a));
        const roots = []; for (const p of [...firsts, ...tops]) { if (!roots.some((r) => r.id === p.id)) roots.push(p); if (roots.length >= plan.threads.maxPosts) break; }
        inv.threads = [];
        for (const root of roots) {
          emit('progress', { watchId: w.id, step: `Yanıt zincirleri okunuyor… ${inv.threads.length + 1} / ${roots.length}` });
          const r = await x.search(`conversation_id:${root.id} -is:retweet`, { startMs: Math.max(root.created_at - MIN, lo), max: Math.min(plan.threads.perThread, Math.max(10, root.replies)) });
          const replies = r.posts.filter((p) => p.id !== root.id);
          store.upsertUsers(r.users); store.upsertPosts(w.id, replies, root.id);
          inv.threads.push({ id: root.id, replies: root.replies, read: replies.length });
        }
      } catch (e) { inv.threadError = e instanceof XError ? e.message : String(e.message); }
    }
    inv.status = 'done'; inv.fetched = store.countPosts(w.id); inv.doneAt = Date.now();
    store.updateWatch(w.id, { spec: w.spec, backfill_done: true, since_id: newest });
  }

  // ---------------------------------------------------------------- 3) canlı izleme
  async function backfill(w, q, now) {
    emit('progress', { watchId: w.id, step: 'Hacim geçmişi alınıyor…' });
    await syncCounts(w.id, q.countsQuery, now);
    emit('update', { watchId: w.id });
    // Örneklem zamana yayılır: yakın geçmiş sık, eski dönem seyrek dilimlenir; her dilime eşit pay düşer.
    const target = w.backfill_posts;
    let got = 0; let newest = null;
    const take = (r) => { store.upsertUsers(r.users); store.upsertPosts(w.id, r.posts); got += r.posts.length; newest = maxId(newest, r.meta.newest_id); };
    if (target > 0) {
      const hourly = store.getCounts(w.id, 'hour', now - 7 * DAY);
      const edges = [0, 1, 2, 4, 8, 16, 24, 48, 96, 168].filter((h) => h < w.backfill_hours).concat(w.backfill_hours);
      const hourN = (from, to) => hourly.filter((b) => b.ts + HOUR > from && b.ts < to).reduce((s, b) => s + b.n, 0);
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
    const fresh = await syncCounts(w.id, q.countsQuery, now);
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
    const w = store.getWatch(id);
    try {
      if (!w) return;
      const inv = w.spec.investigation;
      if (inv && inv.status === 'planned') return; // onay bekliyor
      const q = buildQuery(w.spec);
      const now = Date.now();
      if (!w.backfill_done) await (inv ? runPlan(w, q, now) : backfill(w, q, now)); else await poll(w, q, now, force);
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
      // Nöbetçi taramalar: açıkça açıldıkları için panel kapalıyken de çalışır (yalnızca sayım; harcama tavanı geçerlidir)
      for (const l of store.listLists()) {
        if (!l.enabled || l.demo !== isDemo() || !l.items.length) continue;
        if (l.last_scan_at && Date.now() - l.last_scan_at < l.interval_min * MIN) continue;
        await scanList(l.id);
      }
      const autoPause = store.getSetting('autoPause', true);
      if (autoPause && Date.now() - viewerSeenAt() > 30 * MIN) return; // canlı izlemeler: kimse bakmıyorken harcama yapma
      for (const w of store.listWatches()) {
        if (w.status !== 'active' || !!w.spec.demo !== isDemo()) continue;
        if (w.last_poll_at && Date.now() - w.last_poll_at < w.interval_sec * 1000) continue;
        await tick(w.id);
      }
    } finally { busy = false; }
  }

  return {
    tick, scanList, syncCounts,
    isRunning: (id) => running.has(id),
    isScanning: (id) => scanning.has(id),
    start() {
      // Saklama süresi: 30 günden eski gönderiler silinir (X geliştirici politikası gereği kısa tutulur)
      store.db.prepare('DELETE FROM posts WHERE created_at < ?').run(Date.now() - 30 * DAY);
      timer = setInterval(loop, 5000);
      loop();
    },
    stop() { clearInterval(timer); },
  };
}
