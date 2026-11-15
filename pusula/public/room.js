// Danışan odası: durum şeridi + bölümler. Her bölüm ayrı güncellenir; açık satırlar, girdiler, kaydırma korunur.
import {
  esc, api, rel, hhmm, num, compact, pct, levelOf, trendOf, stanceOf, STANCE_ORDER, SOURCE, ROLE, ROLE_HELP, CASCADE, COORD, POSTURE,
  NARR_KIND, NARR_STATUS, CONF, KIND, driverLabel, arr, patchList, setHTML,
} from './util.js';
import { sparkline, stanceBar, stanceLegend, meter, pulseChart, pulseReadout } from './charts.js';
import { eventHTML, eventAttrs, toast } from './app.js';

const SOURCE_ICON = {
  x: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  haber: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.5" y="3" width="11" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5 6h6M5 8.5h6M5 11h3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  bluesky: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 7.2C7 5.2 4.6 2.8 3 2.8c-1.2 0-1 1.6-.8 3 .3 1.8 1.8 2.4 3.4 2.2-2.6.6-2.4 2.6-.8 3.6 2 1.2 2.8-.8 3.2-2.2.4 1.4 1.2 3.4 3.2 2.2 1.6-1 1.8-3-.8-3.6 1.6.2 3.1-.4 3.4-2.2.2-1.4.4-3-.8-3-1.6 0-4 2.4-5 4.4z" fill="currentColor"/></svg>',
};
const srcIcon = (s) => `<span class="src src-${esc(s)}" title="${esc(SOURCE[s] || s)}">${SOURCE_ICON[s] || esc(String(s || '?').slice(0, 1).toUpperCase())}<span class="sr">${esc(SOURCE[s] || s)}</span></span>`;
const stanceTag = (s) => s ? `<span class="stance-tag"><i class="sw ${stanceOf(s).cls}"></i>${esc(stanceOf(s).label)}</span>` : '';

const CHIPS = ['Kim başlattı?', 'Şu an ne yapmalıyım?', 'Bot var mı?', 'Ne zaman söner?'];

export function mountRoom(root, clientId, state) {
  const enc = encodeURIComponent(clientId);
  const ui = {
    openNarr: new Set(), roleFilter: 'hepsi', feedSrc: 'hepsi', feedStance: 'hepsi', feedOrder: 'new',
    items: new Map(),             // id -> Item (önbellek)
    narrItems: new Map(),         // anlatı id -> öne çıkan gönderiler
    feed: [], history: [], asks: (mountRoom.asks ||= new Map()).get(clientId) || [],
    briefBusy: false, chartScale: null, hoverX: null,
  };
  mountRoom.asks.set(clientId, ui.asks);
  const client = () => state.clients.find((c) => c.id === clientId);
  const snap = () => state.snaps.get(clientId) || null;

  root.innerHTML = `<div class="page room">
    <div class="room-head">
      <div class="room-title"><a href="#/" class="back" aria-label="Genel bakışa dön">←</a><h1 id="r-name"></h1><span class="muted small" id="r-kind"></span></div>
      <nav class="room-tabs" id="r-tabs" aria-label="Danışanlar"></nav>
    </div>
    <section class="strip panel" id="r-strip" aria-label="Durum şeridi"></section>
    <div id="r-incident"></div>
    <nav class="jump" aria-label="Bölümler">
      <a href="#s-brief">Durum notu</a><a href="#s-play">Ne yapmalı</a><a href="#s-pulse">Nabız</a><a href="#s-narr">Anlatılar</a><a href="#s-cascade">Yayılım</a><a href="#s-actors">Aktörler</a><a href="#s-coord">Koordinasyon</a><a href="#s-feed">Akış</a><a href="#s-ask">Sor</a>
    </nav>
    <div class="room-grid">
      <div class="room-main">
        <section class="panel" id="s-brief"><div class="sec-title"><h2>Durum notu</h2><button class="btn small" id="brief-btn" type="button">Notu yenile</button></div><div class="body"></div></section>
        <section class="panel" id="s-play"><div class="sec-title"><h2>Ne yapmalı</h2></div><div class="body"></div></section>
        <section class="panel" id="s-pulse"><div class="sec-title"><h2>Nabız — son 24 saat</h2><div class="legend"><span class="lg"><i class="sw sw-tot"></i>Tüm gönderiler</span><span class="lg"><i class="sw sw-neg"></i>Olumsuz (eleştiri + alay)</span></div></div>
          <div class="chart-wrap" id="pulse-wrap"><div class="chart" id="pulse-chart"></div><div class="xhair" hidden></div><div class="tooltip" hidden></div></div>
          <div class="chart-foot muted small" id="pulse-foot"></div>
          <details class="table-view"><summary>Saatlik tablo</summary><div id="pulse-table"></div></details></section>
        <section class="panel" id="s-narr"><div class="sec-title"><h2>Anlatılar</h2>${stanceLegend()}</div><div class="narrs" id="narrs"></div></section>
        <div class="two">
          <section class="panel" id="s-cascade"><div class="sec-title"><h2>Yayılım zinciri</h2></div><div class="body"></div></section>
          <section class="panel" id="s-coord"><div class="sec-title"><h2>Koordinasyon şüphesi</h2></div>
            <p class="warn-note">Bu bir kanıt değil, işarettir. Benzer metinler ya da genç hesaplar organik bir tepkiden de doğabilir; yorumlamadan önce örnekleri okuyun.</p><div class="body"></div></section>
        </div>
        <section class="panel" id="s-actors"><div class="sec-title"><h2>Aktörler</h2><div class="chips" id="role-chips" role="group" aria-label="Role göre süz"></div></div><div class="body"></div></section>
      </div>
      <aside class="room-side">
        <section class="panel" id="s-ask"><div class="sec-title"><h2>Pusula'ya sor</h2></div>
          <div class="chips" id="ask-chips">${CHIPS.map((c) => `<button type="button" class="chip-btn" data-q="${esc(c)}">${esc(c)}</button>`).join('')}</div>
          <form id="ask-form" class="ask-form" autocomplete="off"><label class="sr" for="ask-in">Sorunuz</label><input id="ask-in" maxlength="500" placeholder="Bu danışanla ilgili bir soru yazın…"><button class="btn primary" type="submit">Sor</button></form>
          <div class="asks" id="asks"></div></section>
        <section class="panel" id="s-feed"><div class="sec-title"><h2>Akış</h2><span class="live-dot" title="Canlı">canlı</span></div>
          <div class="filters">
            <select id="f-src" aria-label="Kaynak"><option value="hepsi">Tüm kaynaklar</option><option value="x">X</option><option value="haber">Haber</option><option value="bluesky">Bluesky</option></select>
            <select id="f-stance" aria-label="Duruş"><option value="hepsi">Tüm duruşlar</option>${STANCE_ORDER.map((s) => `<option value="${s}">${stanceOf(s).label}</option>`).join('')}</select>
            <select id="f-order" aria-label="Sıralama"><option value="new">En yeni</option><option value="top">En çok etkileşim</option></select>
          </div>
          <div class="feed" id="feed"></div></section>
        <section class="panel" id="s-events"><div class="sec-title"><h2>Olaylar</h2></div><div class="events" id="r-events"></div></section>
      </aside>
    </div></div>`;
  const $ = (sel) => root.querySelector(sel);

  // ---------- gönderi önbelleği ----------
  const pending = new Set();
  async function ensureItems(ids) {
    const need = ids.filter((id) => id && !ui.items.has(id) && !pending.has(id));
    if (!need.length) return false;
    need.forEach((id) => pending.add(id));
    try {
      const { items } = await api(`/api/clients/${enc}/items?ids=${need.map(encodeURIComponent).join(',')}&limit=${need.length}`);
      for (const it of arr(items)) ui.items.set(it.id, it);
    } catch { /* sessiz */ } finally { need.forEach((id) => pending.delete(id)); }
    return true;
  }
  const quote = (id, { short = false } = {}) => {
    const it = ui.items.get(id);
    if (!it) return id ? '<div class="quote muted small">Gönderi yükleniyor…</div>' : '';
    const text = short && it.text.length > 220 ? it.text.slice(0, 217) + '…' : it.text;
    return `<blockquote class="quote">${srcIcon(it.source)}<div><div class="q-text">${esc(text)}</div>
      <div class="q-meta muted small">${esc(it.author?.name || '')} <span>@${esc(it.author?.handle || '')}</span> · ${compact(it.author?.followers)} takipçi · ${esc(hhmm(it.createdAt))}${it.url ? ` · <a href="${esc(it.url)}" target="_blank" rel="noopener noreferrer">kaynağa git</a>` : ''}</div></div></blockquote>`;
  };

  // ---------- başlık ve şerit ----------
  function drawHead() {
    const c = client();
    $('#r-name').textContent = c?.name || clientId;
    $('#r-kind').textContent = c ? KIND[c.kind] || c.kind : '';
    document.title = `${c?.name || 'Danışan'} — Pusula`;
    setHTML($('#r-tabs'), state.clients.map((x) => {
      const lv = levelOf(state.snaps.get(x.id)?.risk?.level);
      return `<a href="#/d/${encodeURIComponent(x.id)}" class="${x.id === clientId ? 'on' : ''} ${lv.cls}"><i class="dot"></i>${esc(x.name)}</a>`;
    }).join(''));
  }
  function drawStrip() {
    const s = snap();
    if (!s) { setHTML($('#r-strip'), '<div class="empty">Bu danışan için ilk veriler toplanıyor…</div>'); return; }
    const lv = levelOf(s.risk?.level), tr = trendOf(s.pulse?.trend), f = s.forecast;
    const p = s.pulse || {};
    const ratio = p.baseline1h > 0 ? p.rate1h / p.baseline1h : null;
    const drivers = arr(s.risk?.drivers).slice().sort((a, b) => (b.weight || 0) - (a.weight || 0)).slice(0, 4);
    setHTML($('#r-strip'), `
      <div class="st-risk ${lv.cls}">
        <div class="st-label">Risk</div>
        <div class="st-big"><b>${num(s.risk?.score)}</b><span class="risk-pill ${lv.cls}"><i class="dot"></i>${esc(lv.label)} · ${esc(lv.text)}</span></div>
        ${meter(s.risk?.score, lv.cls, { label: 'Risk puanı' })}
        ${ui.history.length > 1 ? `<div class="st-hist">${sparkline(ui.history, { key: 'risk', w: 150, h: 22, cls: 'mono', label: 'Risk, son 24 saat' })}<span class="muted small">risk, 24 sa</span></div>` : ''}
      </div>
      <div class="st-drivers"><div class="st-label">Riski yükselten</div>${drivers.length ? `<ul>${drivers.map((d) => `<li title="${esc(d.note || '')}"><span class="d-name">${esc(driverLabel(d.key))}</span><span class="d-bar"><span style="width:${Math.round(Math.min(1, d.weight || 0) * 100)}%"></span></span><span class="d-note muted small">${esc(d.note || '')}</span></li>`).join('')}</ul>` : '<div class="muted small">Belirgin bir etken yok.</div>'}</div>
      <div class="st-cell"><div class="st-label">Eğilim</div><div class="st-val">${tr.icon} ${esc(tr.label)}</div><div class="muted small">z = ${Number.isFinite(p.z) ? p.z.toLocaleString('tr-TR') : '—'}</div></div>
      <div class="st-cell"><div class="st-label">Saatlik hız</div><div class="st-val">${num(p.rate1h)} <span class="muted small">gönderi</span></div><div class="muted small">taban ${num(p.baseline1h)}${ratio ? ` · ${ratio.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} kat` : ''}</div></div>
      <div class="st-cell st-fc"><div class="st-label">Tahmin</div>${f ? `<div class="st-val">1 saat sonra ~${num(f.next1h)}</div><div class="small">${esc(f.direction || '')} · güven ${esc((CONF[f.confidence] || f.confidence || '—').toLocaleLowerCase('tr'))}${f.peakAt ? ` · zirve ~${hhmm(f.peakAt)}` : ''}</div><div class="muted small fc-basis">${esc(f.basis || '')}</div>` : '<div class="muted small">Tahmin yok.</div>'}</div>`);
    const inc = s.incident;
    setHTML($('#r-incident'), inc ? `<div class="incident-bar ${inc.status === 'soğuyor' ? 'cooling' : ''}"><span class="tag">${inc.status === 'soğuyor' ? 'Olay soğuyor' : 'Açık olay'}</span><b>${esc(inc.headline)}</b><span class="muted small">${esc(hhmm(inc.startedAt))}'de başladı · ${esc(rel(inc.startedAt))}</span></div>` : '');
  }

  // ---------- a) durum notu ----------
  function drawBrief() {
    const b = snap()?.brief;
    const btn = $('#brief-btn');
    btn.disabled = ui.briefBusy; btn.textContent = ui.briefBusy ? 'Yazılıyor…' : b ? 'Notu yenile' : 'Notu yaz';
    if (!b) { setHTML($('#s-brief .body'), '<div class="empty small">Henüz durum notu yok. "Notu yaz" ile oluşturabilirsiniz.</div>'); return; }
    const field = (k, v) => v ? `<div class="bf"><h4>${k}</h4><p>${esc(v)}</p></div>` : '';
    setHTML($('#s-brief .body'), `<p class="headline">${esc(b.headline || '')}</p>
      <div class="brief-grid">
        ${field('Ne oldu', b.whatHappened)}${field('Nasıl büyüdü', b.howItGrew)}${field('Kim başlattı', b.whoStarted)}${field('Kim büyüttü', b.whoAmplified)}${field('Şu an nerede', b.whereNow)}${field('Danışan için anlamı', b.meaning)}
        ${arr(b.watchNext).length ? `<div class="bf"><h4>Sırada neye bakılmalı</h4><ul>${arr(b.watchNext).map((w) => `<li>${esc(w)}</li>`).join('')}</ul></div>` : ''}
      </div>
      <div class="basis"><span class="conf conf-${esc(b.confidence)}">Güven: ${esc(CONF[b.confidence] || b.confidence || '—')}</span><span>${esc(b.basisNote || '')}</span><span class="muted">${b.by === 'claude' ? 'Claude' : 'Yerel yöntem'} · ${esc(rel(b.at))} yazıldı</span></div>`);
  }
  $('#brief-btn').addEventListener('click', async () => {
    ui.briefBusy = true; drawBrief();
    try { const { snapshot } = await api(`/api/clients/${enc}/brief`, { method: 'POST', body: {} }); if (snapshot) state.snaps.set(clientId, snapshot); toast('Durum notu yenilendi.'); }
    catch (e) { toast(e.message); }
    ui.briefBusy = false; drawAll();
  });

  // ---------- b) ne yapmalı ----------
  function drawPlay() {
    const p = snap()?.playbook;
    if (!p) { setHTML($('#s-play .body'), '<div class="empty small">Henüz yanıt planı yok. Durum notu yazıldığında birlikte hazırlanır.</div>'); return; }
    const po = POSTURE[p.posture] || { label: p.posture || '—', help: '' };
    setHTML($('#s-play .body'), `<div class="posture"><span class="posture-badge p-${esc(p.posture)}">${esc(po.label)}</span><span class="muted small">${esc(po.help)}</span></div>
      ${p.rationale ? `<p class="rationale">${esc(p.rationale)}</p>` : ''}
      ${arr(p.options).length ? `<h4 class="sub">Seçenekler</h4><div class="options">${arr(p.options).map((o, i) => `<article class="option" data-copy-root>
        <div class="opt-head"><b>${i + 1}. ${esc(o.name)}</b>${o.when ? `<span class="muted small">${esc(o.when)}</span>` : ''}</div>
        <dl class="pc"><dt>Artısı</dt><dd>${esc(o.upside || '—')}</dd><dt>Riski</dt><dd>${esc(o.risk || '—')}</dd></dl>
        ${o.draft ? `<div class="draft"><div class="draft-head"><span class="muted small">Taslak metin</span><button type="button" class="btn small" data-copy>Kopyala</button></div><p data-copy-text>${esc(o.draft)}</p></div>` : ''}
      </article>`).join('')}</div>` : ''}
      ${arr(p.doNot).length ? `<h4 class="sub">Yapılmayacaklar</h4><ul class="donot">${arr(p.doNot).map((d) => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
      ${p.holdingStatement ? `<h4 class="sub">Bekleme açıklaması</h4><div class="draft" data-copy-root><div class="draft-head"><span class="muted small">Ayrıntılar netleşene kadar kullanılabilir</span><button type="button" class="btn small" data-copy>Kopyala</button></div><p data-copy-text>${esc(p.holdingStatement)}</p></div>` : ''}
      ${arr(p.qna).length ? `<h4 class="sub">Olası sorular ve yanıtlar</h4><div class="qna">${arr(p.qna).map((x) => `<details><summary>${esc(x.q)}</summary><p>${esc(x.a)}</p></details>`).join('')}</div>` : ''}
      <div class="basis muted small">${p.by === 'claude' ? 'Claude' : 'Yerel yöntem'} · ${esc(rel(p.at))} hazırlandı${Number.isFinite(p.nextCheckMin) ? ` · bir sonraki kontrol ${num(p.nextCheckMin)} dk sonra` : ''}</div>`);
  }

  // ---------- c) nabız ----------
  function drawPulse() {
    const s = snap();
    const wrap = $('#pulse-wrap');
    const { svg, scale } = pulseChart(s, wrap.clientWidth);
    ui.chartScale = scale;
    setHTML($('#pulse-chart'), svg);
    if (ui.hoverX !== null) hover(ui.hoverX);
    const st = s?.stance || {};
    const neg = (st.elestiri || 0) + (st.alay || 0);
    const src = s?.sources || {};
    setHTML($('#pulse-foot'), s ? `Son 3 saatte olumsuz pay ${pct(neg)} · Kaynaklar (24 sa): X ${num(src.x || 0)}, haber ${num(src.haber || 0)}, Bluesky ${num(src.bluesky || 0)}${arr(s.cascade?.steps).length ? ' · Numaralı noktalar yayılım zinciri adımlarıdır.' : ''}` : '');
    if ($('#s-pulse details').open) drawTable();
  }
  function drawTable() {
    const series = arr(snap()?.pulse?.series);
    const hours = new Map();
    for (const p of series) { const h = Math.floor(p.t / 3600_000) * 3600_000; const r = hours.get(h) || { n: 0, neg: 0 }; r.n += p.n || 0; r.neg += p.neg || 0; hours.set(h, r); }
    setHTML($('#pulse-table'), `<table class="tbl"><thead><tr><th>Saat</th><th class="r">Gönderi</th><th class="r">Olumsuz</th><th class="r">Pay</th></tr></thead><tbody>${
      [...hours].reverse().map(([h, r]) => `<tr><td>${hhmm(h)}</td><td class="r">${num(r.n)}</td><td class="r">${num(r.neg)}</td><td class="r">${pct(r.n ? r.neg / r.n : 0)}</td></tr>`).join('')}</tbody></table>`);
  }
  $('#s-pulse details').addEventListener('toggle', (e) => { if (e.target.open) drawTable(); });
  function hover(px) {
    const r = pulseReadout(ui.chartScale, px);
    const xh = $('#pulse-wrap .xhair'), tt = $('#pulse-wrap .tooltip');
    if (!r) { xh.hidden = tt.hidden = true; return; }
    const { m, H, W } = ui.chartScale;
    xh.hidden = false; xh.style.left = `${r.x}px`; xh.style.top = `${m.t}px`; xh.style.height = `${H - m.t - m.b}px`;
    tt.innerHTML = r.html; tt.hidden = false;
    const tw = tt.offsetWidth;
    tt.style.left = `${r.x + 12 + tw > W ? r.x - 12 - tw : r.x + 12}px`; tt.style.top = `${m.t}px`;
  }
  const pw = $('#pulse-wrap');
  pw.addEventListener('pointermove', (e) => { const b = $('#pulse-chart svg')?.getBoundingClientRect(); if (!b) return; ui.hoverX = e.clientX - b.left; hover(ui.hoverX); });
  pw.addEventListener('pointerleave', () => { ui.hoverX = null; pw.querySelector('.xhair').hidden = pw.querySelector('.tooltip').hidden = true; });
  const ro = new ResizeObserver(() => drawPulse()); ro.observe(pw);

  // ---------- d) anlatılar ----------
  function narrHTML(n) {
    const tops = ui.narrItems.get(n.id);
    const v = Number(n.velocity);
    return `<summary>
        <span class="n-label"><b>${esc(n.label)}</b><span class="n-meta"><span class="kind kind-${esc(n.kind)}">${esc(NARR_KIND[n.kind] || n.kind || '')}</span><span class="nstatus">${esc(NARR_STATUS[n.status] || n.status || '')}</span><span class="muted">${num(n.count)} gönderi</span></span></span>
        <span class="n-share"><span class="share-bar"><span style="width:${Math.round(Math.min(1, n.share || 0) * 100)}%"></span></span><span class="small">${pct(n.share)}</span></span>
        <span class="n-stance">${stanceBar(n.stance)}</span>
        <span class="n-spark">${sparkline(n.series, { w: 90, h: 24, label: 'Anlatının seyri' })}</span>
        <span class="n-vel small" title="Son 1 saat / önceki 1 saat">${Number.isFinite(v) ? `${v >= 1.05 ? '↗' : v <= 0.95 ? '↘' : '→'} ${v.toLocaleString('tr-TR', { maximumFractionDigits: 1 })}×` : '—'}</span>
      </summary>
      <div class="n-body">
        ${n.summary ? `<p>${esc(n.summary)}</p>` : ''}
        <div class="muted small">İlk görülme ${esc(hhmm(n.firstSeen))} · son ${esc(rel(n.lastSeen))} · erişim ~${compact(n.reach)}${arr(n.terms).length ? ` · öne çıkan sözcükler: ${arr(n.terms).map(esc).join(', ')}` : ''}</div>
        ${n.originItemId ? `<h4 class="sub">Köken gönderisi</h4>${quote(n.originItemId)}` : ''}
        <h4 class="sub">En çok etkileşim alan gönderiler</h4>
        ${tops ? (tops.length ? tops.map((it) => { ui.items.set(it.id, it); return quote(it.id, { short: true }); }).join('') : '<div class="muted small">Gönderi bulunamadı.</div>') : '<div class="muted small">Yükleniyor…</div>'}
      </div>`;
  }
  async function loadNarr(id) {
    try { const { items } = await api(`/api/clients/${enc}/items?narrative=${encodeURIComponent(id)}&order=top&limit=4`); ui.narrItems.set(id, arr(items)); }
    catch { ui.narrItems.set(id, []); }
    const n = arr(snap()?.narratives).find((x) => x.id === id);
    if (n?.originItemId) await ensureItems([n.originItemId]);
    drawNarr();
  }
  function drawNarr() {
    const list = arr(snap()?.narratives);
    const box = $('#narrs');
    if (!list.length) { setHTML(box, '<div class="empty small">Henüz belirgin bir anlatı yok.</div>'); return; }
    if (box.querySelector(':scope > .empty')) box.innerHTML = '';
    patchList(box, list, (n) => n.id, narrHTML, { tag: 'details', className: 'narr', attrs: (n) => ({ open: ui.openNarr.has(n.id), class: `k-${n.kind || 'nötr'}` }) });
  }
  $('#narrs').addEventListener('toggle', (e) => {
    const d = e.target; if (!d.matches?.('details.narr')) return;
    const id = d.dataset.key;
    if (d.open) { ui.openNarr.add(id); if (!ui.narrItems.has(id)) loadNarr(id); } else ui.openNarr.delete(id);
  }, true);

  // ---------- e) yayılım ----------
  function drawCascade() {
    const steps = arr(snap()?.cascade?.steps);
    if (!steps.length) { setHTML($('#s-cascade .body'), '<div class="empty small">Yayılım zinciri yok: konuşma tek bir kaynaktan büyümüyor.</div>'); return; }
    ensureItems(steps.map((s) => s.itemId)).then((did) => did && drawCascade());
    setHTML($('#s-cascade .body'), `<ol class="timeline">${steps.map((s, i) => `<li class="tl-${esc(s.kind)}">
      <span class="tl-n">${i + 1}</span>
      <div class="tl-body"><div class="tl-head"><b>${esc(CASCADE[s.kind] || s.kind)}</b><time class="muted small">${esc(hhmm(s.t))} · ${esc(rel(s.t))}</time></div>
      ${s.note ? `<div>${esc(s.note)}</div>` : ''}${s.itemId ? quote(s.itemId, { short: true }) : ''}</div></li>`).join('')}</ol>`);
  }

  // ---------- f) aktörler ----------
  function drawActors() {
    const actors = arr(snap()?.actors);
    const counts = {};
    for (const a of actors) counts[a.role] = (counts[a.role] || 0) + 1;
    if (ui.roleFilter !== 'hepsi' && !counts[ui.roleFilter]) ui.roleFilter = 'hepsi';
    setHTML($('#role-chips'), [['hepsi', `Hepsi ${actors.length}`], ...Object.keys(ROLE).filter((r) => counts[r]).map((r) => [r, `${ROLE[r]} ${counts[r]}`])]
      .map(([k, l]) => `<button type="button" class="chip-btn ${ui.roleFilter === k ? 'on' : ''}" data-role="${esc(k)}" aria-pressed="${ui.roleFilter === k}">${esc(l)}</button>`).join(''));
    const list = actors.filter((a) => ui.roleFilter === 'hepsi' || a.role === ui.roleFilter);
    if (!list.length) { setHTML($('#s-actors .body'), '<div class="empty small">Öne çıkan hesap yok.</div>'); return; }
    setHTML($('#s-actors .body'), `<div class="tbl-wrap"><table class="tbl actors"><thead><tr><th>Hesap</th><th>Rol</th><th class="r">Takipçi</th><th class="r">Erişim</th><th>Duruş</th><th>Not</th></tr></thead><tbody>${list.map((a) => `<tr>
      <td data-l="Hesap"><div class="acct"><b>${esc(a.name || a.handle)}</b>${a.verified ? '<span class="verified" title="Doğrulanmış hesap">✓</span>' : ''}<span class="muted small">@${esc(a.handle)}${a.kind && a.kind !== 'bilinmiyor' ? ` · ${esc(a.kind)}` : ''}</span></div></td>
      <td data-l="Rol"><span class="role role-${esc(a.role)}" title="${esc(ROLE_HELP[a.role] || '')}">${esc(ROLE[a.role] || a.role)}</span></td>
      <td data-l="Takipçi" class="r num">${compact(a.followers)}</td><td data-l="Erişim" class="r num">${compact(a.reach)}</td>
      <td data-l="Duruş">${stanceTag(a.stance)}</td><td data-l="Not" class="note">${esc(a.note || '')}</td></tr>`).join('')}</tbody></table></div>
      <p class="muted small">Roller okunan örnekleme dayanır; “yükseltici” en çok etkileşim alan anlamındadır, neden-sonuç iddiası değildir.</p>`);
  }
  $('#role-chips').addEventListener('click', (e) => { const r = e.target.closest('[data-role]')?.dataset.role; if (r) { ui.roleFilter = r; drawActors(); } });

  // ---------- g) koordinasyon ----------
  function drawCoord() {
    const list = arr(snap()?.coordination);
    if (!list.length) { setHTML($('#s-coord .body'), '<div class="empty small">Koordinasyon işareti yok.</div>'); return; }
    ensureItems(list.map((c) => arr(c.itemIds)[0])).then((did) => did && drawCoord());
    setHTML($('#s-coord .body'), list.map((c) => {
      const acc = arr(c.accounts);
      return `<article class="coord"><div class="coord-head"><b>${esc(COORD[c.kind] || c.kind)}</b><span class="muted small">${num(acc.length)} hesap · ${num(c.windowMin)} dk içinde</span></div>
        <div class="coord-score"><span class="small">İşaret gücü ${pct(c.score)}</span><span class="share-bar"><span style="width:${Math.round(Math.min(1, c.score || 0) * 100)}%"></span></span></div>
        ${c.note ? `<p>${esc(c.note)}</p>` : ''}
        <div class="accts small">${acc.slice(0, 6).map((h) => `<span>@${esc(h)}</span>`).join('')}${acc.length > 6 ? `<span class="muted">+${acc.length - 6}</span>` : ''}</div>
        ${arr(c.itemIds)[0] ? `<div class="muted small sample-l">Örnek metin</div>${quote(c.itemIds[0], { short: true })}` : ''}</article>`;
    }).join(''));
  }

  // ---------- h) akış ----------
  let feedBusy = false, feedAt = 0;
  async function loadFeed(force) {
    if (feedBusy || (!force && performance.now() - feedAt < 3500)) return;
    feedBusy = true; feedAt = performance.now();
    try { const { items } = await api(`/api/clients/${enc}/items?order=${ui.feedOrder}&limit=60`); ui.feed = arr(items); } catch { /* bir sonraki turda */ }
    feedBusy = false; drawFeed();
  }
  function feedHTML(it) {
    const e = it.enr;
    const m = it.metrics || {};
    return `${srcIcon(it.source)}<div class="f-body">
      <div class="f-head"><b>${esc(it.author?.name || '')}</b>${it.author?.verified ? '<span class="verified" title="Doğrulanmış">✓</span>' : ''}<span class="muted small">@${esc(it.author?.handle || '')} · ${compact(it.author?.followers)}</span><time class="muted small" data-rel="${it.createdAt}">${esc(rel(it.createdAt))}</time></div>
      <div class="f-text">${esc(it.text)}</div>
      <div class="f-foot small">${stanceTag(e?.stance)}${e?.narrative ? `<span class="n-tag">${esc(e.narrative)}</span>` : ''}${e?.callToAction ? '<span class="n-tag cta">çağrı</span>' : ''}<span class="muted">♥ ${compact(m.likes)} · ↻ ${compact(m.reposts)}</span></div></div>`;
  }
  function drawFeed() {
    const list = ui.feed.filter((i) => (ui.feedSrc === 'hepsi' || i.source === ui.feedSrc) && (ui.feedStance === 'hepsi' || i.enr?.stance === ui.feedStance)).slice(0, 40);
    const box = $('#feed');
    if (!list.length) { setHTML(box, `<div class="empty small">${ui.feed.length ? 'Bu süzgece uyan gönderi yok.' : 'Gönderiler yükleniyor…'}</div>`); return; }
    if (box.querySelector(':scope > .empty')) box.innerHTML = '';
    patchList(box, list, (i) => i.id, feedHTML, { className: 'fitem', attrs: (i) => ({ class: `fs-${i.enr?.stance || 'yok'}` }) });
  }
  for (const [sel, key] of [['#f-src', 'feedSrc'], ['#f-stance', 'feedStance'], ['#f-order', 'feedOrder']]) {
    $(sel).addEventListener('change', (e) => { ui[key] = e.target.value; if (key === 'feedOrder') { $('#feed').innerHTML = ''; loadFeed(true); } else drawFeed(); });
  }

  // ---------- i) sor ----------
  function drawAsks() {
    setHTML($('#asks'), ui.asks.length ? ui.asks.slice().reverse().map((a) => `<div class="ask"><div class="ask-q">${esc(a.q)}</div>
      <div class="ask-a ${a.pending ? 'pending' : ''} ${a.err ? 'err' : ''}">${a.pending ? 'Düşünüyor…' : esc(a.a).replace(/\n/g, '<br>')}</div></div>`).join('')
      : '<div class="muted small">Yanıtlar ölçülen veriye ve okunan örnekleme dayanır.</div>');
  }
  async function ask(q) {
    q = q.trim(); if (!q) return;
    const entry = { q, pending: true };
    ui.asks.push(entry); drawAsks();
    try { entry.a = (await api(`/api/clients/${enc}/ask`, { method: 'POST', body: { question: q } })).answer || 'Yanıt alınamadı.'; }
    catch (e) { entry.a = e.message; entry.err = true; }
    entry.pending = false; drawAsks();
  }
  $('#ask-form').addEventListener('submit', (e) => { e.preventDefault(); const i = $('#ask-in'); const q = i.value; i.value = ''; ask(q); });
  $('#ask-chips').addEventListener('click', (e) => { const q = e.target.closest('[data-q]')?.dataset.q; if (q) ask(q); });

  // ---------- olaylar ----------
  function drawEvents() {
    const list = state.events.filter((e) => e.clientId === clientId).slice(0, 30);
    const box = $('#r-events');
    if (!list.length) { setHTML(box, '<div class="empty small">Bu danışan için olay yok.</div>'); return; }
    if (box.querySelector(':scope > .empty')) box.innerHTML = '';
    patchList(box, list, (e) => e.id, (e) => eventHTML(e, { showClient: false }), { className: 'ev', attrs: eventAttrs });
  }

  async function loadHistory() {
    try { ui.history = arr((await api(`/api/clients/${enc}/history`)).history); drawStrip(); } catch { /* yoksay */ }
  }

  function drawAll() {
    drawHead(); drawStrip(); drawBrief(); drawPlay(); drawPulse(); drawNarr(); drawCascade(); drawActors(); drawCoord(); drawFeed(); drawEvents(); drawAsks();
  }
  drawAll();
  loadFeed(true); loadHistory();
  if (!state.clients.some((c) => c.id === clientId)) setHTML($('#r-strip'), '<div class="empty">Bu danışan bulunamadı. <a href="#/">Genel bakışa dönün</a>.</div>');
  const timers = [setInterval(loadHistory, 60_000), setInterval(() => { for (const t of root.querySelectorAll('[data-rel]')) t.textContent = rel(Number(t.dataset.rel)); }, 5000)];

  return {
    update(kind, data) {
      if (kind === 'snapshot') {
        drawHead();
        if (data !== clientId) return;
        drawStrip(); drawBrief(); drawPlay(); drawPulse(); drawNarr(); drawCascade(); drawActors(); drawCoord();
        for (const id of ui.openNarr) if (performance.now() - (ui._nAt?.[id] || 0) > 15000) { (ui._nAt ||= {})[id] = performance.now(); loadNarr(id); }
        loadFeed();
      } else if (kind === 'event') drawEvents();
      else if (kind === 'clients') drawHead();
    },
    unmount() { ro.disconnect(); timers.forEach(clearInterval); document.title = 'Pusula — gündem odası'; },
  };
}
