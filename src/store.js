// SQLite kalıcı katmanı (Node'un yerleşik node:sqlite modülü; ek bağımlılık yok).
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS watches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  spec TEXT NOT NULL,            -- formdan gelen ham tanım (JSON)
  query TEXT NOT NULL,           -- X arama sorgusu
  status TEXT NOT NULL DEFAULT 'active',   -- active | paused
  interval_sec INTEGER NOT NULL DEFAULT 180,
  posts_per_poll INTEGER NOT NULL DEFAULT 100,
  backfill_hours INTEGER NOT NULL DEFAULT 24,
  backfill_posts INTEGER NOT NULL DEFAULT 300,
  backfill_done INTEGER NOT NULL DEFAULT 0,
  since_id TEXT,
  last_poll_at INTEGER,
  last_error TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS counts (
  watch_id INTEGER NOT NULL, gran TEXT NOT NULL, ts INTEGER NOT NULL, n INTEGER NOT NULL,
  PRIMARY KEY (watch_id, gran, ts)
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS posts (
  watch_id INTEGER NOT NULL, id TEXT NOT NULL,
  author_id TEXT, created_at INTEGER NOT NULL, text TEXT, lang TEXT,
  likes INTEGER DEFAULT 0, reposts INTEGER DEFAULT 0, replies INTEGER DEFAULT 0,
  quotes INTEGER DEFAULT 0, impressions INTEGER DEFAULT 0, bookmarks INTEGER DEFAULT 0,
  kind TEXT NOT NULL DEFAULT 'original',   -- original | reply | quote | repost
  ref_id TEXT, ref_author_id TEXT, conversation_id TEXT,
  hashtags TEXT, mentions TEXT, urls TEXT, has_media INTEGER DEFAULT 0,
  fetched_at INTEGER NOT NULL,
  PRIMARY KEY (watch_id, id)
) WITHOUT ROWID;
CREATE INDEX IF NOT EXISTS posts_time ON posts (watch_id, created_at);
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, username TEXT, name TEXT, followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0, tweet_count INTEGER DEFAULT 0, listed INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 0, verified_type TEXT, created_at INTEGER, description TEXT,
  avatar TEXT, updated_at INTEGER
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS usage (
  day TEXT NOT NULL, endpoint TEXT NOT NULL, requests INTEGER NOT NULL DEFAULT 0,
  posts INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (day, endpoint)
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS journal (
  id INTEGER PRIMARY KEY AUTOINCREMENT, watch_id INTEGER NOT NULL, ts INTEGER NOT NULL,
  type TEXT NOT NULL,            -- olay türü
  level INTEGER NOT NULL,        -- 1 önemli | 2 bilgi | 3 özet
  cat TEXT NOT NULL,             -- seyir | hesap | gonderi | konu | ozet
  text TEXT NOT NULL, evidence TEXT, ref_kind TEXT, ref_id TEXT, ref_user TEXT, past INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS journal_time ON journal (watch_id, ts);
CREATE TABLE IF NOT EXISTS scanlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, lang TEXT NOT NULL DEFAULT 'tr',
  enabled INTEGER NOT NULL DEFAULT 0, interval_min INTEGER NOT NULL DEFAULT 60,
  auto INTEGER NOT NULL DEFAULT 0, auto_limit REAL NOT NULL DEFAULT 2,
  demo INTEGER NOT NULL DEFAULT 0, last_scan_at INTEGER, last_error TEXT
);
CREATE TABLE IF NOT EXISTS scanitems (
  id INTEGER PRIMARY KEY AUTOINCREMENT, list_id INTEGER NOT NULL, value TEXT NOT NULL,
  state TEXT, result TEXT
);
CREATE TABLE IF NOT EXISTS pins (
  id INTEGER PRIMARY KEY AUTOINCREMENT, watch_id INTEGER NOT NULL,
  kind TEXT NOT NULL,            -- post | account | note
  ref_id TEXT, note TEXT, created_at INTEGER NOT NULL
);
`;

export function openStore(file) {
  if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  db.exec(SCHEMA);
  const q = (sql) => db.prepare(sql);
  const tx = (fn) => {
    db.exec('BEGIN');
    try { const r = fn(); db.exec('COMMIT'); return r; } catch (e) { db.exec('ROLLBACK'); throw e; }
  };
  const row = (r) => (r ? { ...r } : null);
  const rows = (rs) => rs.map((r) => ({ ...r }));
  const parseWatch = (w) => (w ? { ...w, spec: JSON.parse(w.spec), backfill_done: !!w.backfill_done } : null);

  const store = {
    db,
    close: () => db.close(),

    // --- ayarlar ---
    getSetting(key, fallback = null) {
      const r = q('SELECT value FROM settings WHERE key = ?').get(key);
      return r ? JSON.parse(r.value) : fallback;
    },
    setSetting(key, value) {
      q('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
        .run(key, JSON.stringify(value));
    },
    delSetting(key) { q('DELETE FROM settings WHERE key = ?').run(key); },

    // --- izlemeler ---
    listWatches() { return rows(q('SELECT * FROM watches ORDER BY id').all()).map(parseWatch); },
    getWatch(id) { return parseWatch(row(q('SELECT * FROM watches WHERE id = ?').get(id))); },
    createWatch(w) {
      const r = q(`INSERT INTO watches (name, spec, query, interval_sec, posts_per_poll, backfill_hours, backfill_posts, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(w.name, JSON.stringify(w.spec), w.query, w.interval_sec, w.posts_per_poll, w.backfill_hours, w.backfill_posts, Date.now());
      return store.getWatch(Number(r.lastInsertRowid));
    },
    updateWatch(id, patch) {
      const allowed = ['spec', 'query', 'name', 'status', 'interval_sec', 'posts_per_poll', 'backfill_done', 'since_id', 'last_poll_at', 'last_error'];
      const keys = Object.keys(patch).filter((k) => allowed.includes(k));
      if (!keys.length) return store.getWatch(id);
      const vals = keys.map((k) => (k === 'spec' ? JSON.stringify(patch[k]) : typeof patch[k] === 'boolean' ? Number(patch[k]) : patch[k]));
      q(`UPDATE watches SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`).run(...vals, id);
      return store.getWatch(id);
    },
    deleteWatch(id) {
      tx(() => {
        for (const t of ['counts', 'posts', 'pins', 'journal']) q(`DELETE FROM ${t} WHERE watch_id = ?`).run(id);
        q('DELETE FROM watches WHERE id = ?').run(id);
      });
    },

    // --- sayımlar ---
    upsertCounts(watchId, gran, buckets) {
      const s = q('INSERT INTO counts (watch_id, gran, ts, n) VALUES (?, ?, ?, ?) ON CONFLICT DO UPDATE SET n = excluded.n');
      tx(() => { for (const b of buckets) s.run(watchId, gran, b.ts, b.n); });
    },
    getCounts(watchId, gran, since = 0) {
      return rows(q('SELECT ts, n FROM counts WHERE watch_id = ? AND gran = ? AND ts >= ? ORDER BY ts').all(watchId, gran, since));
    },

    // --- gönderiler ve hesaplar ---
    upsertPosts(watchId, posts) {
      const s = q(`INSERT INTO posts (watch_id, id, author_id, created_at, text, lang, likes, reposts, replies, quotes,
          impressions, bookmarks, kind, ref_id, ref_author_id, conversation_id, hashtags, mentions, urls, has_media, fetched_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT DO UPDATE SET likes = excluded.likes, reposts = excluded.reposts, replies = excluded.replies,
          quotes = excluded.quotes, impressions = excluded.impressions, bookmarks = excluded.bookmarks, fetched_at = excluded.fetched_at`);
      const now = Date.now();
      tx(() => {
        for (const p of posts) {
          s.run(watchId, p.id, p.author_id ?? null, p.created_at, p.text ?? '', p.lang ?? null, p.likes | 0, p.reposts | 0,
            p.replies | 0, p.quotes | 0, p.impressions | 0, p.bookmarks | 0, p.kind ?? 'original', p.ref_id ?? null,
            p.ref_author_id ?? null, p.conversation_id ?? null, JSON.stringify(p.hashtags ?? []),
            JSON.stringify(p.mentions ?? []), JSON.stringify(p.urls ?? []), p.has_media ? 1 : 0, now);
        }
      });
    },
    getPosts(watchId, since = 0) {
      return rows(q('SELECT * FROM posts WHERE watch_id = ? AND created_at >= ? ORDER BY created_at').all(watchId, since))
        .map((p) => ({ ...p, hashtags: JSON.parse(p.hashtags), mentions: JSON.parse(p.mentions), urls: JSON.parse(p.urls), has_media: !!p.has_media }));
    },
    countPosts(watchId) { return q('SELECT COUNT(*) AS n FROM posts WHERE watch_id = ?').get(watchId).n; },
    upsertUsers(users) {
      const s = q(`INSERT INTO users (id, username, name, followers, following, tweet_count, listed, verified, verified_type,
          created_at, description, avatar, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET username = excluded.username, name = excluded.name, followers = excluded.followers,
          following = excluded.following, tweet_count = excluded.tweet_count, listed = excluded.listed,
          verified = excluded.verified, verified_type = excluded.verified_type, description = excluded.description,
          avatar = excluded.avatar, updated_at = excluded.updated_at`);
      const now = Date.now();
      tx(() => {
        for (const u of users) {
          s.run(u.id, u.username ?? null, u.name ?? null, u.followers | 0, u.following | 0, u.tweet_count | 0, u.listed | 0,
            u.verified ? 1 : 0, u.verified_type ?? null, u.created_at ?? null, u.description ?? null, u.avatar ?? null, now);
        }
      });
    },
    getUsers(ids) {
      const out = new Map();
      const s = q('SELECT * FROM users WHERE id = ?');
      for (const id of ids) { const u = s.get(id); if (u) out.set(id, { ...u, verified: !!u.verified }); }
      return out;
    },

    // --- kullanım / bütçe ---
    addUsage(endpoint, requests, posts) {
      const day = new Date().toISOString().slice(0, 10);
      q(`INSERT INTO usage (day, endpoint, requests, posts) VALUES (?, ?, ?, ?)
         ON CONFLICT DO UPDATE SET requests = requests + excluded.requests, posts = posts + excluded.posts`)
        .run(day, endpoint, requests, posts);
    },
    usageSince(day) {
      return rows(q('SELECT day, endpoint, requests, posts FROM usage WHERE day >= ? ORDER BY day').all(day));
    },

    // --- tarama listeleri ---
    listLists() {
      const items = rows(q('SELECT * FROM scanitems ORDER BY id').all()).map((i) => ({ ...i, state: i.state ? JSON.parse(i.state) : null, result: i.result ? JSON.parse(i.result) : null }));
      return rows(q('SELECT * FROM scanlists ORDER BY id').all()).map((l) => ({ ...l, enabled: !!l.enabled, auto: !!l.auto, demo: !!l.demo, items: items.filter((i) => i.list_id === l.id) }));
    },
    getList(id) { return store.listLists().find((l) => l.id === id) ?? null; },
    createList(name, demo) {
      return Number(q('INSERT INTO scanlists (name, demo) VALUES (?, ?)').run(name, demo ? 1 : 0).lastInsertRowid);
    },
    updateList(id, patch) {
      const allowed = ['name', 'lang', 'enabled', 'interval_min', 'auto', 'auto_limit', 'last_scan_at', 'last_error'];
      const keys = Object.keys(patch).filter((k) => allowed.includes(k));
      if (keys.length) q(`UPDATE scanlists SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`).run(...keys.map((k) => (typeof patch[k] === 'boolean' ? Number(patch[k]) : patch[k])), id);
    },
    setListItems(id, values) {
      const cur = store.getList(id)?.items ?? [];
      tx(() => {
        for (const i of cur) if (!values.includes(i.value)) store.deleteItem(i.id);
        for (const v of values) if (!cur.some((i) => i.value === v)) q('INSERT INTO scanitems (list_id, value) VALUES (?, ?)').run(id, v);
      });
    },
    updateItem(id, patch) {
      if ('state' in patch) q('UPDATE scanitems SET state = ? WHERE id = ?').run(JSON.stringify(patch.state), id);
      if ('result' in patch) q('UPDATE scanitems SET result = ? WHERE id = ?').run(JSON.stringify(patch.result), id);
    },
    deleteItem(itemId) { // sayım ve günlük kayıtları eksi kimlikle tutulur
      for (const t of ['counts', 'journal']) q(`DELETE FROM ${t} WHERE watch_id = ?`).run(-itemId);
      q('DELETE FROM scanitems WHERE id = ?').run(itemId);
    },
    deleteList(id) {
      for (const i of store.getList(id)?.items ?? []) store.deleteItem(i.id);
      q('DELETE FROM scanlists WHERE id = ?').run(id);
    },

    // --- gözlem günlüğü ---
    addJournal(watchId, e) {
      const r = q(`INSERT INTO journal (watch_id, ts, type, level, cat, text, evidence, ref_kind, ref_id, ref_user, past)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(watchId, e.ts ?? Date.now(), e.type, e.level, e.cat, e.text, e.evidence ?? null, e.ref_kind ?? null, e.ref_id ?? null, e.ref_user ?? null, e.past ? 1 : 0);
      return Number(r.lastInsertRowid);
    },
    listJournal(watchId, { since = 0, limit = 200 } = {}) {
      return rows(q('SELECT * FROM journal WHERE watch_id = ? AND ts >= ? ORDER BY ts DESC, id DESC LIMIT ?').all(watchId, since, limit)).map((j) => ({ ...j, past: !!j.past }));
    },
    recentJournal({ maxLevel = 1, limit = 8, since = 0 } = {}) {
      return rows(q('SELECT * FROM journal WHERE level <= ? AND ts >= ? AND past = 0 ORDER BY ts DESC, id DESC LIMIT ?').all(maxLevel, since, limit));
    },

    // --- sabitlenenler ve notlar ---
    listPins(watchId) { return rows(q('SELECT * FROM pins WHERE watch_id = ? ORDER BY id').all(watchId)); },
    addPin(watchId, kind, refId, note) {
      const r = q('INSERT INTO pins (watch_id, kind, ref_id, note, created_at) VALUES (?, ?, ?, ?, ?)')
        .run(watchId, kind, refId ?? null, note ?? null, Date.now());
      return Number(r.lastInsertRowid);
    },
    deletePin(id) { q('DELETE FROM pins WHERE id = ?').run(id); },
  };
  return store;
}
