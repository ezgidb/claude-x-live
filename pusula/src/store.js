// Pusula deposu: node:sqlite üstünde danışan, gönderi, anlık görüntü, olay ve ayar saklama.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS clients (id TEXT PRIMARY KEY, json TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY, client_id TEXT NOT NULL, source TEXT, created_at INTEGER NOT NULL,
  author_id TEXT, eng INTEGER NOT NULL DEFAULT 0, json TEXT NOT NULL, enr TEXT, narrative TEXT);
CREATE INDEX IF NOT EXISTS items_client_time ON items (client_id, created_at);
CREATE INDEX IF NOT EXISTS items_client_author ON items (client_id, author_id);
CREATE INDEX IF NOT EXISTS items_client_narr ON items (client_id, narrative);
CREATE TABLE IF NOT EXISTS snapshots (
  client_id TEXT NOT NULL, at INTEGER NOT NULL, risk REAL, rate1h REAL, json TEXT,
  PRIMARY KEY (client_id, at));
CREATE TABLE IF NOT EXISTS events (
  seq INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT, client_id TEXT, at INTEGER NOT NULL, json TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS events_client_time ON events (client_id, at);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
`;

const KEEP_FULL_SNAPSHOTS = 30; // danışan başına tam saklanan anlık görüntü; eskilerde yalnızca özet kalır

// Sıralama puanı: beğeni + 2×yeniden paylaşım + alıntı + yanıt
export function engagement(m) {
  if (!m) return 0;
  return (m.likes || 0) + 2 * (m.reposts || 0) + (m.quotes || 0) + (m.replies || 0);
}

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : null);

export function openStore(file = ':memory:') {
  if (file !== ':memory:') {
    try { mkdirSync(dirname(file), { recursive: true }); } catch { /* dizin zaten var */ }
  }
  const db = new DatabaseSync(file);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL;');
  db.exec(SCHEMA);

  const q = {
    clientUpsert: db.prepare('INSERT INTO clients (id, json) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET json = excluded.json'),
    clientGet: db.prepare('SELECT json FROM clients WHERE id = ?'),
    clientList: db.prepare('SELECT json FROM clients ORDER BY rowid'),
    clientDel: db.prepare('DELETE FROM clients WHERE id = ?'),
    itemExists: db.prepare('SELECT 1 AS x FROM items WHERE id = ?'),
    itemInsert: db.prepare('INSERT INTO items (id, client_id, source, created_at, author_id, eng, json, enr, narrative) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'),
    itemUpdate: db.prepare('UPDATE items SET eng = ?, json = ? WHERE id = ?'),
    enrSet: db.prepare('UPDATE items SET enr = ?, narrative = ? WHERE id = ?'),
    snapInsert: db.prepare('INSERT OR REPLACE INTO snapshots (client_id, at, risk, rate1h, json) VALUES (?, ?, ?, ?, ?)'),
    snapLatest: db.prepare('SELECT json FROM snapshots WHERE client_id = ? AND json IS NOT NULL ORDER BY at DESC LIMIT 1'),
    snapHist: db.prepare('SELECT at, risk, rate1h FROM snapshots WHERE client_id = ? AND at >= ? ORDER BY at'),
    snapTrim: db.prepare(`UPDATE snapshots SET json = NULL WHERE client_id = ? AND json IS NOT NULL AND at <
      (SELECT MIN(at) FROM (SELECT at FROM snapshots WHERE client_id = ? ORDER BY at DESC LIMIT ${KEEP_FULL_SNAPSHOTS}))`),
    eventInsert: db.prepare('INSERT INTO events (id, client_id, at, json) VALUES (?, ?, ?, ?)'),
    setGet: db.prepare('SELECT value FROM settings WHERE key = ?'),
    setPut: db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'),
    setDel: db.prepare('DELETE FROM settings WHERE key = ?'),
  };

  function tx(fn) {
    db.exec('BEGIN');
    try { const r = fn(); db.exec('COMMIT'); return r; } catch (e) { db.exec('ROLLBACK'); throw e; }
  }

  function rowToItem(r) {
    const item = JSON.parse(r.json);
    item.enr = r.enr ? JSON.parse(r.enr) : null;
    return item;
  }

  return {
    // ---- danışanlar ----
    upsertClient(client) {
      if (!client || !client.id) throw new Error('Danışan kimliği (id) gerekli');
      q.clientUpsert.run(String(client.id), JSON.stringify(client));
      return client;
    },
    removeClient(id) {
      tx(() => {
        q.clientDel.run(id);
        db.prepare('DELETE FROM items WHERE client_id = ?').run(id);
        db.prepare('DELETE FROM events WHERE client_id = ?').run(id);
        db.prepare('DELETE FROM snapshots WHERE client_id = ?').run(id);
      });
    },
    listClients() { return q.clientList.all().map((r) => JSON.parse(r.json)); },
    getClient(id) { const r = q.clientGet.get(id); return r ? JSON.parse(r.json) : null; },

    // ---- gönderiler ----
    // Yeni olanı ekler, var olanın içeriğini/metriklerini günceller (zenginleştirmeye dokunmaz).
    upsertItems(items) {
      if (!items || !items.length) return 0;
      return tx(() => {
        let added = 0;
        for (const it of items) {
          if (!it || !it.id) continue;
          const { enr, ...bare } = it;
          const json = JSON.stringify(bare);
          const eng = engagement(it.metrics);
          if (q.itemExists.get(it.id)) {
            q.itemUpdate.run(eng, json, it.id);
          } else {
            q.itemInsert.run(it.id, it.clientId ?? '', it.source ?? null, num(it.createdAt) ?? 0,
              it.author?.id ?? null, eng, json, enr ? JSON.stringify(enr) : null, enr?.narrative ?? null);
            added++;
          }
        }
        return added;
      });
    },

    // since dahil, until hariç. order: 'new' (varsayılan, yeni → eski) | 'top' (etkileşime göre)
    items(clientId, opts = {}) {
      const { since, until, limit, ids, narrative, authorId, order } = opts;
      const where = ['client_id = ?'];
      const args = [clientId];
      if (num(since) != null) { where.push('created_at >= ?'); args.push(num(since)); }
      if (num(until) != null) { where.push('created_at < ?'); args.push(num(until)); }
      if (Array.isArray(ids)) { where.push('id IN (SELECT value FROM json_each(?))'); args.push(JSON.stringify(ids)); }
      if (narrative != null && narrative !== '') { where.push('narrative = ? COLLATE NOCASE'); args.push(String(narrative)); }
      if (authorId != null && authorId !== '') { where.push('author_id = ?'); args.push(String(authorId)); }
      let sql = `SELECT json, enr FROM items WHERE ${where.join(' AND ')} ORDER BY ` +
        (order === 'top' ? 'eng DESC, created_at DESC, id' : 'created_at DESC, id');
      if (num(limit) != null && limit > 0) { sql += ' LIMIT ?'; args.push(num(limit)); }
      return db.prepare(sql).all(...args).map(rowToItem);
    },

    // Henüz anlamlandırılmamış gönderiler; en yeniler önce.
    unenriched(clientId, limit = 200) {
      return db.prepare('SELECT json, enr FROM items WHERE client_id = ? AND enr IS NULL ORDER BY created_at DESC, id LIMIT ?')
        .all(clientId, num(limit) ?? 200).map(rowToItem);
    },

    setEnrichments(list) {
      if (!list || !list.length) return;
      tx(() => {
        for (const e of list) {
          if (!e || !e.id) continue;
          const { id, ...enr } = e;
          q.enrSet.run(JSON.stringify(enr), enr.narrative ?? null, id);
        }
      });
    },

    // ---- anlık görüntüler ----
    saveSnapshot(snapshot) {
      if (!snapshot || !snapshot.clientId) return;
      q.snapInsert.run(snapshot.clientId, num(snapshot.at) ?? 0, snapshot.risk?.score ?? null,
        snapshot.pulse?.rate1h ?? null, JSON.stringify(snapshot));
      q.snapTrim.run(snapshot.clientId, snapshot.clientId);
    },
    latestSnapshot(clientId) { const r = q.snapLatest.get(clientId); return r ? JSON.parse(r.json) : null; },
    snapshotHistory(clientId, { since } = {}) {
      return q.snapHist.all(clientId, num(since) ?? 0).map((r) => ({ at: r.at, risk: r.risk, rate1h: r.rate1h }));
    },

    // ---- olaylar ----
    addEvents(events) {
      if (!events || !events.length) return;
      tx(() => {
        for (const e of events) q.eventInsert.run(e.id ?? null, e.clientId ?? null, num(e.at) ?? 0, JSON.stringify(e));
      });
    },
    // clientId null/boş ise bütün danışanlar. Yeni → eski.
    events(clientId, { since, limit } = {}) {
      const where = [];
      const args = [];
      if (clientId) { where.push('client_id = ?'); args.push(clientId); }
      if (num(since) != null) { where.push('at >= ?'); args.push(num(since)); }
      let sql = 'SELECT json FROM events' + (where.length ? ` WHERE ${where.join(' AND ')}` : '') + ' ORDER BY at DESC, seq DESC';
      if (num(limit) != null && limit > 0) { sql += ' LIMIT ?'; args.push(num(limit)); }
      return db.prepare(sql).all(...args).map((r) => JSON.parse(r.json));
    },

    // ---- ayarlar (JSON) ----
    get(key) {
      const r = q.setGet.get(key);
      if (!r) return undefined;
      try { return JSON.parse(r.value); } catch { return undefined; }
    },
    set(key, value) {
      if (value === undefined) q.setDel.run(key); else q.setPut.run(key, JSON.stringify(value));
    },

    // Demo yeniden başlatma: gönderi, olay ve anlık görüntüleri siler; danışanlar ve ayarlar kalır.
    reset() { db.exec('DELETE FROM items; DELETE FROM events; DELETE FROM snapshots;'); },
    close() { try { db.close(); } catch { /* zaten kapalı */ } },
  };
}
