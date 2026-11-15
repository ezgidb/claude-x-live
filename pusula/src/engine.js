// Motor: kaynakları dinler, gönderileri anlamlandırır, analiz eder, olay ve not üretir.
import { EventEmitter } from 'node:events';
import { openStore } from './store.js';
import { createSources } from './sources/index.js';
import { demoClients } from './sources/simulator.js';
import { analyze, diffEvents } from './analysis/index.js';
import { createAI } from './ai/index.js';

const HOUR = 3600_000, MIN = 60_000;
const WINDOW = 26 * HOUR;          // analiz penceresi
const LEVELS = ['yeşil', 'sarı', 'turuncu', 'kırmızı'];

const slug = (s) => String(s).toLocaleLowerCase('tr')
  .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'danisan';

export function createEngine({
  settingsFile = ':memory:', mode: modeOpt, speed = 60, tickMs = 2000,
  anthropicKey = process.env.ANTHROPIC_API_KEY, xToken = process.env.X_BEARER_TOKEN,
  realNow = () => Date.now(),
} = {}) {
  const bus = new EventEmitter();
  const settings = openStore(settingsFile);            // anahtarlar + canlı mod verisi
  let mode = modeOpt || settings.get('mode') || 'demo';
  anthropicKey ||= settings.get('anthropicKey') || undefined;
  xToken ||= settings.get('xToken') || undefined;

  let store, sources, ai, localAI = createAI({});
  let clock, timer = null, busy = false, stopped = true, lastError = null;
  const st = new Map();   // clientId -> { lastPoll, snapshot, briefAt, briefKey, names: Map }

  // --- saat ---
  function makeClock(start, spd) {
    let baseSim = start, baseReal = realNow(), s = spd;
    return {
      now: () => Math.round(baseSim + (realNow() - baseReal) * s),
      get speed() { return s; },
      setSpeed(n) { baseSim = this.now(); baseReal = realNow(); s = n; },
    };
  }

  function boot() {
    st.clear(); lastError = null;
    ai = createAI({ apiKey: anthropicKey });
    if (mode === 'demo') {
      store = openStore(':memory:');
      const start = realNow();
      clock = makeClock(start, speed);
      sources = createSources({ mode: 'demo', store, anchor: start + 4 * MIN });
      for (const c of demoClients()) store.upsertClient(c);
    } else {
      store = settings;
      clock = makeClock(realNow(), 1);
      sources = createSources({ mode: 'canlı', store, xToken });
    }
  }

  const state = (id) => { if (!st.has(id)) st.set(id, { lastPoll: 0, snapshot: null, briefAt: 0, briefKey: '', names: new Map() }); return st.get(id); };

  // --- bir danışan için tam tur ---
  async function cycle(client, now, { bulk = false } = {}) {
    const s = state(client.id);
    const since = s.lastPoll || now - 24 * HOUR;
    for (const src of sources) {
      try { store.upsertItems(await src.poll({ client, since, until: now })); }
      catch (e) { src.lastError = String(e.message || e); }
    }
    s.lastPoll = now;

    // anlamlandırma: canlı akışta Claude (varsa), toplu geçmişte yerel
    const narratives = (s.snapshot?.narratives || []).map((n) => ({ id: n.id, label: n.label }));
    for (let round = 0; round < (bulk ? 200 : 4); round++) {
      const todo = store.unenriched(client.id, 60);
      if (!todo.length) break;
      const engine = bulk ? localAI : ai;
      let enr;
      try { enr = await engine.enrich(todo, { client, narratives }); }
      catch { enr = await localAI.enrich(todo, { client, narratives }); }
      const seen = new Set(enr.map((e) => e.id));
      for (const it of todo) if (!seen.has(it.id)) enr.push({ id: it.id, stance: 'notr', emotion: 'nötr', narrative: null, claim: false, callToAction: false, by: 'yerel' });
      store.setEnrichments(enr);
    }

    const items = store.items(client.id, { since: now - WINDOW, until: now + 1, limit: 50_000 });
    const snap = analyze({ client, items, now, prev: s.snapshot });
    await nameNarratives(client, s, snap, items);
    snap.brief = s.snapshot?.brief || null;
    snap.playbook = s.snapshot?.playbook || null;
    return { s, snap, items };
  }

  async function nameNarratives(client, s, snap, items) {
    const fresh = snap.narratives.filter((n) => !s.names.has(n.id) && n.count >= 5 && !items.some((i) => i.enr?.by === 'claude' && i.enr.narrative === n.label));
    if (fresh.length) {
      const byId = new Map(items.map((i) => [i.id, i]));
      const input = fresh.map((n) => ({ id: n.id, label: n.label, terms: n.terms, samples: (n.topItemIds || []).map((id) => byId.get(id)?.text).filter(Boolean).slice(0, 6) }));
      try {
        for (const r of await ai.nameNarratives(input, { client })) if (r?.id && r.label) s.names.set(r.id, { label: r.label, summary: r.summary || '' });
      } catch { /* etiketsiz kalır */ }
      for (const n of fresh) if (!s.names.has(n.id)) s.names.set(n.id, { label: n.label, summary: n.summary || '' });
    }
    for (const n of snap.narratives) {
      const nm = s.names.get(n.id);
      if (nm) { n.label = nm.label; if (nm.summary) n.summary = nm.summary; }
    }
  }

  const topItems = (clientId, snap) => {
    const ids = new Set([snap.cascade?.originItemId, ...(snap.cascade?.steps || []).map((x) => x.itemId),
      ...snap.narratives.slice(0, 6).flatMap((n) => [n.originItemId, ...(n.topItemIds || []).slice(0, 4)])].filter(Boolean));
    return ids.size ? store.items(clientId, { ids: [...ids], limit: 80 }) : [];
  };

  async function writeBrief(client, s, snap, now, force = false) {
    const key = `${snap.risk.level}|${snap.incident?.id || ''}|${snap.incident?.status || ''}|${snap.narratives[0]?.id || ''}`;
    const every = (ai.mode === 'claude' ? 30 : 10) * MIN;
    const worse = LEVELS.indexOf(snap.risk.level) > LEVELS.indexOf(s.snapshot?.risk?.level || 'yeşil');
    if (!force && snap.brief && !worse && (key === s.briefKey ? now - s.briefAt < every : now - s.briefAt < 5 * MIN)) return false;
    const items = topItems(client.id, snap);
    try {
      const brief = await ai.brief({ client, snapshot: snap, items });
      const playbook = await ai.playbook({ client, snapshot: snap, brief, items });
      snap.brief = { ...brief, at: now }; snap.playbook = { ...playbook, at: now };
      s.briefAt = now; s.briefKey = key;
      return true;
    } catch (e) { lastError = `Not yazılamadı: ${e.message || e}`; return false; }
  }

  async function runClient(client, now, opts = {}) {
    const { s, snap, items } = await cycle(client, now, opts);
    const events = opts.silent ? [] : diffEvents(s.snapshot, snap, { client, items });
    await writeBrief(client, s, snap, now);
    s.snapshot = snap;
    store.saveSnapshot(snap);
    if (events.length) { store.addEvents(events); for (const e of events) bus.emit('event', e); }
    bus.emit('snapshot', snap);
  }

  async function tick() {
    if (busy || stopped) return;
    busy = true;
    try {
      const now = clock.now();
      for (const client of store.listClients()) {
        const s = state(client.id);
        if (mode === 'canlı' && s.lastPoll && now - s.lastPoll < 3 * MIN) continue;
        try { await runClient(client, now); }
        catch (e) { lastError = `${client.name}: ${e.message || e}`; console.error('[pusula]', client.id, e); }
      }
      bus.emit('status', api.status());
    } finally { busy = false; }
  }

  // demo: geçmiş 24 saati saat saat doldur ki olay akışı ve anlatı kimlikleri doğal oluşsun
  async function backfill() {
    if (mode !== 'demo') return;
    const now = clock.now();
    for (const client of store.listClients()) {
      for (let t = now - 6 * HOUR; t < now; t += HOUR) await runClient(client, t, { bulk: true, silent: true });
    }
  }

  async function start() {
    stopped = false;
    boot();
    busy = true;
    try { await backfill(); } finally { busy = false; }
    await tick();
    timer = setInterval(tick, mode === 'demo' ? tickMs : 30_000);
    timer.unref?.();
  }
  function stop() { stopped = true; clearInterval(timer); timer = null; }
  async function restart() { stop(); while (busy) await new Promise((r) => setTimeout(r, 50)); await start(); }

  const api = {
    on: (evt, fn) => bus.on(evt, fn), off: (evt, fn) => bus.off(evt, fn),
    start, stop,
    status: () => ({ mode, ai: ai?.mode || 'yerel', clock: { now: clock?.now() ?? realNow(), speed: clock?.speed ?? 1 },
      sources: (sources || []).map((s) => ({ id: s.id, label: s.label, lastError: s.lastError || null })),
      aiUsage: ai?.usage?.() || null, lastError, keys: { anthropic: !!anthropicKey, x: !!xToken } }),
    clients: () => store.listClients(),
    addClient(def) {
      const list = (v) => (Array.isArray(v) ? v : String(v || '').split(/[,\n]/)).map((x) => String(x).trim()).filter(Boolean);
      const name = String(def.name || '').trim();
      if (!name) throw new Error('Danışan adı gerekli.');
      const terms = list(def.terms);
      const client = { id: def.id || slug(name), name, kind: def.kind || 'marka', terms: terms.length ? terms : [name],
        sensitivities: list(def.sensitivities), rivals: list(def.rivals), note: def.note || '' };
      store.upsertClient(client);
      tick();
      return client;
    },
    removeClient(id) { store.removeClient(id); st.delete(id); bus.emit('status', api.status()); },
    snapshot: (id) => st.get(id)?.snapshot || store.latestSnapshot(id) || null,
    history: (id) => store.snapshotHistory(id, { since: clock.now() - 24 * HOUR }),
    events: (id, { limit = 100 } = {}) => {
      if (id) return store.events(id, { limit });
      return store.listClients().flatMap((c) => store.events(c.id, { limit })).sort((a, b) => b.at - a.at).slice(0, limit);
    },
    items: (id, q = {}) => store.items(id, { until: clock.now() + 1, limit: 50, order: 'new', ...q }),
    async ask(id, question) {
      const client = store.getClient(id), snapshot = api.snapshot(id);
      if (!client || !snapshot) return 'Bu danışan için henüz veri yok.';
      return ai.ask({ client, snapshot, items: topItems(id, snapshot), question });
    },
    async refreshBrief(id) {
      const client = store.getClient(id), s = state(id);
      if (!client || !s.snapshot) return null;
      await writeBrief(client, s, s.snapshot, clock.now(), true);
      store.saveSnapshot(s.snapshot); bus.emit('snapshot', s.snapshot);
      return s.snapshot;
    },
    setSpeed(n) { if (mode === 'demo') { speed = Math.max(1, Math.min(600, Number(n) || 60)); clock.setSpeed(speed); bus.emit('status', api.status()); } },
    restartDemo: () => restart(),
    async setMode(m) { if (m !== 'demo' && m !== 'canlı') throw new Error('Mod demo ya da canlı olmalı.'); mode = m; settings.set('mode', m); await restart(); },
    setKeys({ anthropicKey: a, xToken: x } = {}) {
      if (a !== undefined) { anthropicKey = a || undefined; settings.set('anthropicKey', a || ''); ai = createAI({ apiKey: anthropicKey }); }
      if (x !== undefined) { xToken = x || undefined; settings.set('xToken', x || ''); if (mode === 'canlı') sources = createSources({ mode: 'canlı', store, xToken }); }
      bus.emit('status', api.status());
    },
  };
  return api;
}
