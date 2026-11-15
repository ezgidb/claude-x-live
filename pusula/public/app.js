// Pusula arayüzü: durum, canlı akış (SSE), yönlendirme, genel bakış ve formlar.
import { esc, api, setClock, simNow, simSpeed, hhmm, dayShort, rel, num, levelOf, trendOf, KIND, EVENT_LEVEL, arr, patchList, setHTML } from './util.js';
import { sparkline } from './charts.js';
import { mountRoom } from './room.js';

export const state = {
  status: null, clients: [], snaps: new Map(), events: [], dismissedAlert: null,
};
const view = document.getElementById('view');
let current = null;          // { name, update(kind, data), unmount() }

// ---------- üst çubuk ----------
function renderTop() {
  const s = state.status;
  const mb = document.getElementById('mode-badge');
  if (!s) { mb.textContent = 'Bağlanıyor…'; mb.className = 'mode-badge'; return; }
  if (s.mode === 'demo') { mb.textContent = 'DEMO — uydurma veri'; mb.className = 'mode-badge demo'; }
  else { mb.textContent = 'Canlı'; mb.className = 'mode-badge live'; }
  document.getElementById('ai-badge').textContent = s.ai === 'claude' ? 'Yorum: Claude' : 'Yorum: yerel';
  tickClock();
}
function tickClock() {
  if (!state.status) return;
  const now = simNow(), sp = simSpeed();
  document.getElementById('sim-clock').textContent = `${dayShort(now)} ${hhmm(now)}${state.status.mode === 'demo' && sp !== 1 ? ` · ${sp}×` : ''}`;
}
setInterval(tickClock, 1000);

// ---------- bildirim şeridi ----------
function showAlert(ev) {
  const el = document.getElementById('alert');
  const c = state.clients.find((x) => x.id === ev.clientId);
  el.innerHTML = `<span class="alert-mark" aria-hidden="true">!</span>
    <span class="alert-text"><b>${esc(c?.name || ev.clientId)}</b> · ${esc(ev.title)}<span class="muted"> · ${esc(rel(ev.at))}</span></span>
    <a class="btn small" href="#/d/${encodeURIComponent(ev.clientId)}">Odaya git</a>
    <button class="btn small ghost" data-act="close-alert" aria-label="Bildirimi kapat">Kapat</button>`;
  el.hidden = false;
  el.classList.remove('pulse-in'); void el.offsetWidth; el.classList.add('pulse-in');
}
export function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 2600);
}

// ---------- veri ----------
async function loadAll() {
  try {
    const [st, cl, ev] = await Promise.all([api('/api/status'), api('/api/clients'), api('/api/events?limit=120')]);
    state.status = st; setClock(st.clock);
    state.clients = arr(cl.clients); state.events = arr(ev.events);
    await Promise.all(state.clients.map(async (c) => {
      try { const r = await api(`/api/clients/${encodeURIComponent(c.id)}/snapshot`); if (r.snapshot) state.snaps.set(c.id, r.snapshot); } catch { /* sonra gelir */ }
    }));
  } catch (e) {
    view.innerHTML = `<div class="page"><div class="empty">Pusula hazırlanıyor… <span class="muted">${esc(e.message)}</span></div></div>`;
    setTimeout(loadAll, 2500);
    return;
  }
  renderTop(); route();
}
export async function reloadClients() {
  try { state.clients = arr((await api('/api/clients')).clients); } catch { /* yoksay */ }
}

let es;
function connect() {
  es = new EventSource('/api/stream');
  es.addEventListener('status', (e) => { const s = JSON.parse(e.data); state.status = s; setClock(s.clock); renderTop(); current?.update('status', s); });
  es.addEventListener('snapshot', (e) => {
    const s = JSON.parse(e.data);
    if (!s?.clientId) return;
    state.snaps.set(s.clientId, s);
    if (!state.clients.some((c) => c.id === s.clientId)) reloadClients().then(() => current?.update('clients'));
    schedule(s.clientId);
  });
  es.addEventListener('event', (e) => {
    const ev = JSON.parse(e.data);
    if (state.events.some((x) => x.id === ev.id)) return;
    state.events.unshift(ev); state.events.length = Math.min(state.events.length, 300);
    if (ev.level === 'alarm') showAlert(ev);
    current?.update('event', ev);
  });
  es.onerror = () => { document.getElementById('mode-badge').textContent = 'Bağlantı koptu, yeniden deneniyor…'; };
}
// aynı karede gelen güncellemeleri birleştir
const dirty = new Set(); let raf = 0;
function schedule(id) {
  dirty.add(id);
  if (!raf) raf = requestAnimationFrame(() => { raf = 0; const ids = [...dirty]; dirty.clear(); for (const d of ids) current?.update('snapshot', d); });
}

// ---------- yönlendirme ----------
function route() {
  const h = location.hash.replace(/^#/, '') || '/';
  const [, a, b] = h.split('/');
  let name = 'overview', arg = null;
  if (a === 'd' && b) { name = 'room'; arg = decodeURIComponent(b); }
  else if (a === 'ekle') name = 'add';
  else if (a === 'ayarlar') name = 'settings';
  for (const n of document.querySelectorAll('[data-nav]')) n.classList.toggle('on', n.dataset.nav === name);
  current?.unmount?.();
  view.innerHTML = '';
  window.scrollTo(0, 0);
  current = name === 'room' ? mountRoom(view, arg, state) : name === 'add' ? mountAdd(view) : name === 'settings' ? mountSettings(view) : mountOverview(view);
}
window.addEventListener('hashchange', route);

// ---------- genel bakış ----------
function oneLine(s) {
  if (!s) return 'Veri bekleniyor.';
  if (s.incident && s.brief?.whereNow) return s.brief.whereNow;
  if (s.brief?.headline) return s.brief.headline;
  const t = trendOf(s.pulse?.trend).label.toLocaleLowerCase('tr');
  return `Konuşma ${t}; saatlik ${num(s.pulse?.rate1h)} gönderi (taban ${num(s.pulse?.baseline1h)}).`;
}
function cardHTML(c) {
  const s = state.snaps.get(c.id);
  const lv = levelOf(s?.risk?.level);
  const tr = trendOf(s?.pulse?.trend);
  return `<a class="ccard-link" href="#/d/${encodeURIComponent(c.id)}">
    <div class="ccard-head">
      <div><h3>${esc(c.name)}</h3><span class="muted small">${esc(KIND[c.kind] || c.kind || '')}</span></div>
      ${s ? `<div class="risk-pill ${lv.cls}"><i class="dot"></i><b>${num(s.risk?.score)}</b> ${esc(lv.label)}</div>` : '<span class="muted small">bekleniyor</span>'}
    </div>
    <div class="ccard-mid">
      ${sparkline(s?.pulse?.series, { w: 260, h: 44, label: 'Son 24 saat gönderi sayısı' })}
      <div class="ccard-num"><b>${num(s?.pulse?.rate1h)}</b><span class="muted small">/saat</span><span class="trend">${tr.icon} ${esc(tr.label)}</span></div>
    </div>
    ${s?.incident ? `<div class="incident ${s.incident.status === 'soğuyor' ? 'cooling' : ''}"><span class="tag">${s.incident.status === 'soğuyor' ? 'Olay soğuyor' : 'Açık olay'}</span> ${esc(s.incident.headline)}</div>` : ''}
    <p class="ccard-line">${esc(oneLine(s))}</p>
  </a>`;
}
export function eventHTML(ev, { showClient = true } = {}) {
  const c = state.clients.find((x) => x.id === ev.clientId);
  return `<div class="ev-head"><span class="ev-lv">${esc(EVENT_LEVEL[ev.level] || ev.level || '')}</span>${showClient ? `<a href="#/d/${encodeURIComponent(ev.clientId)}" class="ev-client">${esc(c?.name || ev.clientId)}</a>` : ''}<time class="muted" data-rel="${ev.at}">${esc(rel(ev.at))}</time></div>
    <div class="ev-title">${esc(ev.title)}</div>${ev.detail ? `<div class="ev-detail muted">${esc(ev.detail)}</div>` : ''}`;
}
export const eventAttrs = (ev) => ({ class: `lvl-${ev.level || 'bilgi'}` });

function mountOverview(root) {
  root.innerHTML = `<div class="page overview">
    <div class="ov-main"><div class="sec-title"><h2>Danışanlar</h2><span class="muted small" id="ov-sum"></span></div><div class="cards" id="cards"></div></div>
    <aside class="ov-side panel"><div class="sec-title"><h2>Canlı olay akışı</h2></div><div class="events" id="ov-events"></div></aside>
  </div>`;
  const cards = root.querySelector('#cards'), evs = root.querySelector('#ov-events');
  const order = { kırmızı: 0, turuncu: 1, sarı: 2, yeşil: 3 };
  const drawCards = () => {
    const list = [...state.clients].sort((a, b) => (order[state.snaps.get(a.id)?.risk?.level] ?? 9) - (order[state.snaps.get(b.id)?.risk?.level] ?? 9));
    if (!list.length) { setHTML(cards, '<div class="empty">Henüz danışan yok. <a href="#/ekle">Danışan ekleyin</a>.</div>'); return; }
    if (cards.querySelector('.empty')) cards.innerHTML = '';
    patchList(cards, list, (c) => c.id, cardHTML, { className: 'ccard', attrs: (c) => ({ class: levelOf(state.snaps.get(c.id)?.risk?.level).cls }) });
    const open = list.filter((c) => state.snaps.get(c.id)?.incident).length;
    root.querySelector('#ov-sum').textContent = `${list.length} danışan · ${open ? `${open} açık olay` : 'açık olay yok'}`;
  };
  const drawEvents = () => {
    const list = state.events.slice(0, 80);
    if (!list.length) { setHTML(evs, '<div class="empty small">Henüz olay yok.</div>'); return; }
    if (evs.querySelector('.empty')) evs.innerHTML = '';
    patchList(evs, list, (e) => e.id, (e) => eventHTML(e), { className: 'ev', attrs: eventAttrs });
  };
  drawCards(); drawEvents();
  const relTimer = setInterval(() => { for (const t of evs.querySelectorAll('[data-rel]')) t.textContent = rel(Number(t.dataset.rel)); }, 5000);
  return {
    update(kind) { if (kind === 'event') drawEvents(); else drawCards(); },
    unmount() { clearInterval(relTimer); },
  };
}

// ---------- danışan ekle ----------
function mountAdd(root) {
  root.innerHTML = `<div class="page narrow"><section class="panel">
    <h2>Danışan ekle</h2>
    <p class="muted">Pusula bu danışan hakkında konuşulanları sürekli dinler. İfadeleri virgülle ya da alt alta yazabilirsiniz.</p>
    <form id="add-form" class="form" autocomplete="off">
      <label>Ad<input name="name" required maxlength="80" placeholder="Örn. Anadolu Süt"></label>
      <label>Tür<select name="kind"><option value="marka">Marka</option><option value="kişi">Kişi</option><option value="kurum">Kurum</option></select></label>
      <label>Dinlenecek ifadeler<textarea name="terms" rows="3" placeholder="Anadolu Süt, @anadolusut, #AnadoluSüt"></textarea><span class="hint">Boş bırakırsanız yalnızca ad dinlenir.</span></label>
      <label>Hassas konular<textarea name="sensitivities" rows="2" placeholder="ürün güvenliği, çocuk sağlığı"></textarea><span class="hint">Bu konular konuşulursa risk daha hızlı yükselir.</span></label>
      <label>Rakipler<input name="rivals" placeholder="Trakya Süt"></label>
      <div class="form-row"><button class="btn primary" type="submit">Danışanı ekle</button><span class="form-msg" id="add-msg" role="status"></span></div>
    </form></section></div>`;
  root.querySelector('#add-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(e.target), msg = root.querySelector('#add-msg');
    msg.textContent = 'Ekleniyor…';
    try {
      const { client } = await api('/api/clients', { method: 'POST', body: Object.fromEntries(f) });
      await reloadClients();
      toast(`${client.name} eklendi. İlk veriler birkaç saniye içinde gelir.`);
      location.hash = `#/d/${encodeURIComponent(client.id)}`;
    } catch (err) { msg.textContent = err.message; msg.className = 'form-msg err'; }
  });
  return { update() {} };
}

// ---------- ayarlar ----------
function mountSettings(root) {
  root.innerHTML = `<div class="page narrow">
    <section class="panel"><h2>Bağlantılar</h2>
      <p class="muted">Anahtarlar yalnızca bu bilgisayardaki Pusula'ya gönderilir ve geri gösterilmez.</p>
      <form class="form" id="keys-form" autocomplete="off">
        <label>Claude anahtarı <span class="hint" id="k-a"></span><input type="password" name="anthropicKey" placeholder="sk-ant-…" autocomplete="new-password"></label>
        <label>X erişim token'ı <span class="hint" id="k-x"></span><input type="password" name="xToken" placeholder="Bearer token" autocomplete="new-password"></label>
        <div class="form-row"><button class="btn primary" type="submit">Kaydet</button><span class="form-msg" id="keys-msg" role="status"></span></div>
      </form></section>
    <section class="panel"><h2>Çalışma modu</h2>
      <div class="seg" role="radiogroup" aria-label="Mod" id="mode-seg">
        <button type="button" data-mode="demo" role="radio">Demo</button><button type="button" data-mode="canlı" role="radio">Canlı</button>
      </div>
      <p class="muted small">Demo: uydurma danışanlarla hızlandırılmış bir kriz senaryosu. Canlı: gerçek kaynaklar (X, haber, Bluesky); X için token gerekir ve kullanım ücretlidir.</p>
      <div id="sys" class="sys"></div></section>
    <section class="panel" id="demo-panel"><h2>Demo</h2>
      <div class="field-label">Saat hızı</div>
      <div class="seg" id="speed-seg" role="radiogroup" aria-label="Demo hızı">
        <button type="button" data-speed="1" role="radio">1×</button><button type="button" data-speed="60" role="radio">60×</button><button type="button" data-speed="300" role="radio">300×</button>
      </div>
      <p class="muted small">60×: bir gerçek dakika bir simüle saattir.</p>
      <button class="btn" type="button" id="restart">Senaryoyu baştan başlat</button>
    </section></div>`;
  const draw = () => {
    const s = state.status || {};
    root.querySelector('#k-a').textContent = s.keys?.anthropic ? '· kayıtlı' : '· girilmedi (yerel yorum kullanılıyor)';
    root.querySelector('#k-x').textContent = s.keys?.x ? '· kayıtlı' : '· girilmedi';
    for (const b of root.querySelectorAll('[data-mode]')) b.setAttribute('aria-checked', String(b.dataset.mode === s.mode));
    for (const b of root.querySelectorAll('[data-speed]')) b.setAttribute('aria-checked', String(Number(b.dataset.speed) === s.clock?.speed));
    root.querySelector('#demo-panel').hidden = s.mode !== 'demo';
    const u = s.aiUsage;
    setHTML(root.querySelector('#sys'), `<dl class="kv">
      <dt>Yapay zekâ</dt><dd>${s.ai === 'claude' ? 'Claude' : 'Yerel yöntem (anahtarsız)'}${u ? ` · ${num(u.calls)} çağrı` : ''}</dd>
      <dt>Kaynaklar</dt><dd>${arr(s.sources).map((x) => `${esc(x.label)}${x.lastError ? ` <span class="err">— ${esc(x.lastError)}</span>` : ' <span class="muted">— sorun yok</span>'}`).join('<br>') || '—'}</dd>
      ${s.lastError ? `<dt>Son hata</dt><dd class="err">${esc(s.lastError)}</dd>` : ''}</dl>`);
  };
  draw();
  root.querySelector('#keys-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {};
    for (const [k, v] of new FormData(e.target)) if (String(v).trim()) body[k] = String(v).trim();
    const msg = root.querySelector('#keys-msg');
    if (!Object.keys(body).length) { msg.textContent = 'Değiştirmek istediğiniz anahtarı yazın.'; return; }
    try { await api('/api/settings', { method: 'POST', body }); e.target.reset(); msg.textContent = 'Kaydedildi.'; msg.className = 'form-msg ok'; }
    catch (err) { msg.textContent = err.message; msg.className = 'form-msg err'; }
  });
  root.querySelector('#mode-seg').addEventListener('click', async (e) => {
    const m = e.target.closest('[data-mode]')?.dataset.mode;
    if (!m || m === state.status?.mode) return;
    if (m === 'canlı' && !confirm('Canlı moda geçilsin mi? Gerçek kaynaklar dinlenir; X kullanımı ücretlidir.')) return;
    try { await api('/api/settings', { method: 'POST', body: { mode: m } }); toast('Mod değiştiriliyor…'); } catch (err) { toast(err.message); }
  });
  root.querySelector('#speed-seg').addEventListener('click', async (e) => {
    const sp = e.target.closest('[data-speed]')?.dataset.speed;
    if (sp) try { await api('/api/demo', { method: 'POST', body: { speed: Number(sp) } }); } catch (err) { toast(err.message); }
  });
  root.querySelector('#restart').addEventListener('click', async () => {
    if (!confirm('Senaryo baştan başlasın mı? Demo verileri sıfırlanır.')) return;
    try { await api('/api/demo', { method: 'POST', body: { restart: true } }); state.events = []; toast('Senaryo yeniden başlatılıyor…'); } catch (err) { toast(err.message); }
  });
  return { update(kind) { if (kind === 'status') draw(); } };
}

// ---------- genel tıklamalar ----------
document.addEventListener('click', async (e) => {
  const t = e.target.closest('[data-act], [data-copy]');
  if (!t) return;
  if (t.dataset.act === 'close-alert') { document.getElementById('alert').hidden = true; return; }
  if (t.dataset.copy !== undefined) {
    const src = t.closest('[data-copy-root]')?.querySelector('[data-copy-text]');
    const text = src?.innerText || '';
    try { await navigator.clipboard.writeText(text); toast('Metin kopyalandı.'); }
    catch {
      const r = document.createRange(); r.selectNodeContents(src); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      toast('Metin seçildi; Ctrl+C ile kopyalayın.');
    }
  }
});

connect();
loadAll();
