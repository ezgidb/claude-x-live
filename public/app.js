// Nabız arayüzü — çerçevesiz, derlemesiz. X'ten gelen metinler her zaman textContent ile basılır.
const $app = document.getElementById('app');
const $tip = document.getElementById('tooltip');
const NS = 'http://www.w3.org/2000/svg';
let S = null; // sunucu durumu
const ui = { range: '6h', accTab: 'bridges', progress: {}, form: null, tab: 'gunluk', jfilter: 'all', unseen: 0 };
try { ui.tab = localStorage.getItem('nabiz.tab') ?? 'gunluk'; } catch { /* yoksay */ }

// ---------------------------------------------------------------- yardımcılar
function h(tag, attrs, ...kids) {
  const el = tag === 'svg' || h.svg ? document.createElementNS(NS, tag) : document.createElement(tag);
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.setAttribute('class', v);
    else if (k === 'value' && 'value' in el) el.value = v;
    else if (k === 'checked' || k === 'disabled' || k === 'selected') el[k] = !!v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat(Infinity)) if (kid !== null && kid !== undefined && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  return el;
}
function s(tag, attrs, ...kids) { h.svg = true; try { return h(tag, attrs, ...kids); } finally { h.svg = false; } }
const nf = (n) => Math.round(n ?? 0).toLocaleString('tr-TR');
const nf1 = (n) => (n ?? 0).toLocaleString('tr-TR', { maximumFractionDigits: 1 });
const usd = (n) => `${(n ?? 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $`;
const compact = (n) => (n >= 1e6 ? `${nf1(n / 1e6)} Mn` : n >= 1e4 ? `${nf1(n / 1e3)} B` : nf(n));
const TZ = 'Europe/Istanbul';
const tHM = (ms) => new Date(ms).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
const tDay = (ms) => new Date(ms).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', timeZone: TZ });
function ago(ms) {
  if (!ms) return 'henüz yok';
  const m = Math.round((Date.now() - ms) / 60000);
  return m < 1 ? 'az önce' : m < 60 ? `${m} dk önce` : m < 1440 ? `${Math.round(m / 60)} sa önce` : `${Math.round(m / 1440)} gün önce`;
}
async function api(method, path, body) {
  const res = await fetch(path, { method, headers: body ? { 'content-type': 'application/json' } : (method === 'GET' ? {} : { 'content-type': 'application/json' }), body: body ? JSON.stringify(body) : (method === 'GET' ? undefined : '{}') });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Hata (${res.status})`);
  return data;
}
let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 4000);
}
async function act(fn, okMsg) { try { const r = await fn(); if (okMsg) toast(okMsg); return r; } catch (e) { toast(e.message); return null; } }
const STAGE_ICON = { quiet: '–', emerging: '↗', accelerating: '⇈', peak: '▲', declining: '↘' };
const stageBadge = (stage, label) => h('span', { class: `badge st-${stage}` }, STAGE_ICON[stage] ?? '', ' ', label);
const xLink = (username, id) => (id ? `https://x.com/${username ?? 'i'}/status/${id}` : `https://x.com/${username}`);
const ext = (href, ...kids) => h('a', { href, target: '_blank', rel: 'noopener noreferrer' }, ...kids);

function showTip(evt, ...kids) { $tip.replaceChildren(...kids); $tip.hidden = false; const w = $tip.offsetWidth; $tip.style.left = `${Math.min(window.innerWidth - w - 8, Math.max(8, evt.clientX + 14))}px`; $tip.style.top = `${evt.clientY - 38}px`; }
const hideTip = () => { $tip.hidden = true; };

// ---------------------------------------------------------------- grafikler
function niceMax(v) { if (v <= 5) return 5; const p = 10 ** Math.floor(Math.log10(v)); const f = v / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; }
function volumeChart(series, stepMs, { markTs = null, markLabel = '', height = 260, dots = [] } = {}) {
  const W = 900; const H = height; const m = { l: 44, r: 14, t: 16, b: 26 };
  const box = h('div', { class: 'chart' });
  if (series.length < 2) { box.append(h('p', { class: 'muted' }, 'Grafik için henüz yeterli veri yok.')); return box; }
  const x0 = series[0].ts; const x1 = series[series.length - 1].ts;
  const yMax = niceMax(Math.max(...series.map((d) => d.n)));
  const X = (t) => m.l + ((t - x0) / (x1 - x0)) * (W - m.l - m.r); const Y = (v) => m.t + (1 - v / yMax) * (H - m.t - m.b);
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Zamana göre gönderi sayısı' });
  for (let i = 0; i <= 4; i++) { const v = (yMax * i) / 4; svg.append(s('line', { class: 'grid-l', x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v) }), s('text', { x: m.l - 6, y: Y(v) + 4, 'text-anchor': 'end' }, compact(v))); }
  const long = x1 - x0 > 26 * 3600e3;
  for (let i = 0; i <= 6; i++) { const t = x0 + ((x1 - x0) * i) / 6; svg.append(s('text', { x: X(t), y: H - 6, 'text-anchor': i === 0 ? 'start' : i === 6 ? 'end' : 'middle' }, long ? `${tDay(t)} ${tHM(t)}` : tHM(t))); }
  const pts = series.map((d) => `${X(d.ts).toFixed(1)},${Y(d.n).toFixed(1)}`);
  svg.append(s('path', { class: 'area', d: `M${X(x0)},${Y(0)} L${pts.join(' L')} L${X(x1)},${Y(0)} Z` }), s('polyline', { class: 'line', points: pts.join(' ') }));
  if (markTs && markTs > x0 && markTs < x1) svg.append(s('line', { class: 'mark', x1: X(markTs), x2: X(markTs), y1: m.t, y2: Y(0) }), s('text', { class: 'mark-t', x: X(markTs) + 5, y: m.t + 10 }, markLabel));
  for (const d of dots) { // günlük notlarının zamanı
    if (d.ts < x0 || d.ts > x1) continue;
    let near = series[0]; for (const q of series) if (Math.abs(q.ts - d.ts) < Math.abs(near.ts - d.ts)) near = q;
    svg.append(s('circle', { class: 'jdot', cx: X(d.ts), cy: Y(near.n), r: 4 }));
  }
  const cross = s('line', { class: 'cross', y1: m.t, y2: Y(0), visibility: 'hidden' }); const dot = s('circle', { class: 'dot', r: 4.5, visibility: 'hidden' });
  const hit = s('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: 'transparent' });
  hit.addEventListener('pointermove', (e) => {
    const r = svg.getBoundingClientRect(); const t = x0 + (((e.clientX - r.left) / r.width) * W - m.l) / (W - m.l - m.r) * (x1 - x0);
    let best = series[0]; for (const d of series) if (Math.abs(d.ts - t) < Math.abs(best.ts - t)) best = d;
    cross.setAttribute('x1', X(best.ts)); cross.setAttribute('x2', X(best.ts)); cross.setAttribute('visibility', 'visible');
    dot.setAttribute('cx', X(best.ts)); dot.setAttribute('cy', Y(best.n)); dot.setAttribute('visibility', 'visible');
    showTip(e, h('b', null, nf(best.n)), ` gönderi · ${long ? `${tDay(best.ts)} ` : ''}${tHM(best.ts)}–${tHM(best.ts + stepMs)}`);
  });
  hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); hideTip(); });
  svg.append(cross, dot, hit); box.append(svg);
  return box;
}
function barChart(items, { height = 120, label, tip }) {
  const W = 480; const m = { l: 4, r: 4, t: 6, b: 18 }; const max = Math.max(1e-9, ...items.map((d) => d.v));
  const svg = s('svg', { viewBox: `0 0 ${W} ${height}`, role: 'img' }); const bw = (W - m.l - m.r) / items.length;
  items.forEach((d, i) => {
    const bh = Math.max(d.v > 0 ? 2 : 0, (d.v / max) * (height - m.t - m.b));
    const r = s('rect', { class: 'bar', x: m.l + i * bw + 1, y: height - m.b - bh, width: Math.max(1, bw - 2), height: bh, rx: Math.min(3, bw / 3) });
    r.addEventListener('pointermove', (e) => showTip(e, ...tip(d))); r.addEventListener('pointerleave', hideTip);
    svg.append(r);
    const lb = label(d, i); if (lb) svg.append(s('text', { x: m.l + i * bw + bw / 2, y: height - 4, 'text-anchor': 'middle' }, lb));
  });
  return h('div', { class: 'chart' }, svg);
}
function spark(values) {
  if (!values || values.length < 2) return h('span', { class: 'muted small' }, '—');
  const max = Math.max(1, ...values); const W = 120; const H = 28;
  return s('svg', { class: 'spark', viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' }, s('polyline', { points: values.map((v, i) => `${((i / (values.length - 1)) * W).toFixed(1)},${(H - 2 - (v / max) * (H - 4)).toFixed(1)}`).join(' ') }));
}

// ---------------------------------------------------------------- üst çubuk
function renderTop() {
  const route = location.hash.replace(/^#\//, '').split('/')[0];
  for (const a of document.querySelectorAll('#nav a')) a.classList.toggle('on', a.dataset.nav === (route === 'izleme' ? '' : route));
  const conn = document.getElementById('conn'); const q = document.getElementById('quota');
  if (!S) return;
  conn.textContent = S.demo ? 'Demo veri' : S.connected ? 'X bağlı' : 'Bağlı değil';
  conn.className = `pill ${S.demo ? 'warn' : S.connected ? 'good' : 'bad'}`;
  const u = S.usage; const pct = u.budget.daily ? u.today / u.budget.daily : 0;
  q.textContent = S.demo ? 'Demo: gerçek harcama yok' : `Bugün ${usd(u.today)} / ${usd(u.budget.daily)} · Ay ${usd(u.month)}`;
  q.className = `pill ${S.demo ? '' : pct >= 0.9 ? 'bad' : pct >= 0.7 ? 'warn' : ''}`;
}

// ---------------------------------------------------------------- bağlantı / karşılama
function viewConnect() {
  const input = h('input', { type: 'password', placeholder: 'AAAAAAAAAAAAAAAAAAAAA…', autocomplete: 'off' });
  const msg = h('div');
  const btn = h('button', { class: 'primary', onclick: async () => {
    btn.disabled = true; msg.replaceChildren(h('p', { class: 'muted' }, 'Bağlantı sınanıyor…'));
    try { const r = await api('POST', '/api/token', { token: input.value }); S = r.state; toast(r.capabilities.message); location.hash = S.client ? '#/yeni' : '#/danisan'; render(); } catch (e) { msg.replaceChildren(h('div', { class: 'notice err' }, e.message)); }
    btn.disabled = false;
  } }, 'Bağlantıyı sına ve kaydet');
  return h('div', { class: 'hero stack' },
    h('h1', null, 'Nabız’a hoş geldiniz'),
    h('p', { class: 'muted' }, 'X’te ilgilendiğiniz konuları izleyin; hangi konunun hızlandığını, hangi hesapların öne çıktığını ve danışanınıza ne önereceğinizi tek ekranda görün.'),
    h('div', { class: 'card stack' },
      h('h2', null, '1. X’e bağlanın'),
      h('label', { class: 'f' }, h('span', null, 'X API Bearer Token'), input, h('small', null, 'X Geliştirici Konsolu → uygulamanız → “Keys and tokens” → Bearer Token. Token yalnızca bu bilgisayardaki veritabanında saklanır ve bir daha gösterilmez.')),
      h('div', { class: 'row' }, btn), msg),
    h('div', { class: 'card stack' },
      h('h2', null, 'Önce denemek ister misiniz?'),
      h('p', { class: 'muted' }, 'Demo modu, gerçekçi görünen uydurma verilerle bütün ekranları gösterir. X’e bağlanmaz, harcama yapmaz.'),
      h('div', null, h('button', { onclick: async () => { S = await api('POST', '/api/demo', { on: true }); location.hash = '#/'; render(); } }, 'Demo veriyle dene'))));
}

// ---------------------------------------------------------------- genel bakış
function viewOverview() {
  if (!S.connected && !S.demo) return viewConnect();
  const head = h('div', { class: 'row spread' }, h('h1', null, 'Genel Bakış'), h('a', { href: '#/yeni' }, h('button', { class: 'primary' }, '+ Yeni izleme')));
  if (!S.watches.length) {
    return h('div', { class: 'stack' }, head, h('div', { class: 'card' }, h('p', null, 'Henüz bir izleme yok. İlgilendiğiniz bir konuyu ekleyin; geçmişi getirip takibe başlayalım.'), h('a', { href: '#/yeni' }, h('button', { class: 'primary' }, 'İlk izlemeyi oluştur'))));
  }
  const rows = [...S.watches].sort((a, b) => (b.summary?.score ?? -1) - (a.summary?.score ?? -1)).map((w) => {
    const m = w.summary;
    return h('tr', { class: 'click', onclick: () => { location.hash = `#/izleme/${w.id}`; } },
      h('td', null, h('b', null, w.name), h('div', { class: 'muted small' }, w.status === 'paused' ? 'Duraklatıldı' : w.running ? 'Veri çekiliyor…' : `Güncelleme: ${ago(w.last_poll_at)}`, w.last_error ? ' · ⚠ sorun var' : '')),
      h('td', null, m ? stageBadge(m.stage, m.stageLabel) : '—'),
      h('td', { class: 'num r' }, m ? h('b', null, m.score) : '—'),
      h('td', null, spark(m?.spark)),
      h('td', { class: 'num r' }, m ? nf(m.total24) : '—'),
      h('td', { class: 'num r' }, m?.change === null || !m ? '—' : `${m.change >= 0 ? '+' : '−'}%${nf(Math.abs(m.change) * 100)}`),
      h('td', null, m?.topTerm ?? h('span', { class: 'muted' }, '—')));
  });
  const hot = S.watches.filter((w) => w.summary && ['emerging', 'accelerating'].includes(w.summary.stage) && w.summary.topCard);
  return h('div', { class: 'stack' }, head,
    S.recent?.length ? h('div', { class: 'card' }, h('h2', null, 'Son gelişmeler'), h('div', { class: 'jlist' }, S.recent.map((j) => h('div', { class: 'jrow l1' }, h('div', { class: 'jt num' }, tHM(j.ts), h('div', { class: 'muted small' }, ago(j.ts))), h('div', { class: 'main' }, h('a', { class: 'tag', style: 'margin-left:0', href: `#/izleme/${j.watch_id}` }, j.watch), ' ', j.text)))))
    : hot.length ? h('div', { class: 'card stack' }, h('h2', null, 'Şu an ısınanlar'), hot.slice(0, 3).map((w) => h('div', { class: 'insight p1' }, h('div', null, h('div', { class: 't' }, h('a', { href: `#/izleme/${w.id}` }, w.name), ' — ', w.summary.topCard))))) : null,
    h('div', { class: 'card', style: 'overflow-x:auto' }, h('table', null,
      h('thead', null, h('tr', null, h('th', null, 'Konu'), h('th', null, 'Aşama'), h('th', { class: 'r' }, 'İvme'), h('th', null, 'Son 24 saat'), h('th', { class: 'r' }, 'Gönderi'), h('th', { class: 'r' }, 'Değişim'), h('th', null, 'Yükselen başlık'))),
      h('tbody', null, rows))));
}

// ---------------------------------------------------------------- yeni izleme
function chipInput(list, placeholder) {
  const box = h('div', { class: 'chips' });
  const input = h('input', { type: 'text', placeholder });
  const add = (refocus) => { const had = input.value.trim(); for (const v of input.value.split(',').map((x) => x.trim()).filter(Boolean)) if (!list.includes(v)) list.push(v); input.value = ''; if (had || refocus === true) draw(); if (refocus === true) input.focus(); };
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(true); } else if (e.key === 'Backspace' && !input.value && list.length) { list.pop(); draw(); input.focus(); } });
  input.addEventListener('blur', add);
  function draw() { box.replaceChildren(...list.map((v, i) => h('span', { class: 'chip' }, v, h('button', { type: 'button', 'aria-label': 'Kaldır', onclick: () => { list.splice(i, 1); draw(); } }, '×'))), input); }
  draw();
  return box;
}
function viewNew() {
  if (!S.connected && !S.demo) return viewConnect();
  const f = ui.form ??= { name: '', any: [], all: [], accounts: [], exclude: [], accountMode: 'both', postUrl: '', lang: 'tr', excludeReposts: true, interval_sec: 300, backfill_hours: 24, backfill_posts: 200, posts_per_poll: 25, preview: null };
  const side = h('div', { class: 'card stack' });
  const spec = () => ({ any: f.any, all: f.all, accounts: f.accounts, exclude: f.exclude, accountMode: f.accountMode, postUrl: f.postUrl, lang: f.lang, excludeReposts: f.excludeReposts, ...(f.preview?.spec?.postUrl === f.postUrl ? { postId: f.preview.spec.postId, conversationId: f.preview.spec.conversationId, postPreview: f.preview.spec.postPreview, postVariant: f.preview.spec.postVariant } : {}) });
  const sel = (key, opts) => h('select', { onchange: (e) => { f[key] = Number(e.target.value) || e.target.value; drawSide(); } }, opts.map(([v, l]) => h('option', { value: v, selected: f[key] === v }, l)));
  function estimate() {
    const p = S.usage.prices; const ticks = 86400 / f.interval_sec; const vol = (f.preview?.last24h ?? 0) * (f.excludeReposts ? 0.6 : 1);
    const reread = S.trackPosts ? (86400 / Math.max(900, f.interval_sec)) * 10 * p.post : 0;
    return { backfill: f.backfill_posts * (p.post + p.user * 0.6) + 2 * p.counts, daily: ticks * p.counts + Math.min(vol, ticks * f.posts_per_poll) * (p.post + p.user * 0.4) + reread };
  }
  function drawSide(err) {
    const e = estimate(); const pv = f.preview;
    side.replaceChildren(...[h('h2', null, 'Önizleme ve tahmini maliyet'),
      err ? h('div', { class: 'notice err' }, err) : null,
      pv ? h('div', { class: 'stack' },
        h('div', null, h('div', { class: 'tile' }, h('div', { class: 'v' }, `≈ ${nf(pv.total7d)}`), h('div', { class: 'l' }, `gönderi · son 7 gün (son 24 saatte ${nf(pv.last24h)})`))),
        barChart(dailyBuckets(pv.series), { height: 110, label: (d) => d.label, tip: (d) => [h('b', null, nf(d.v)), ` gönderi · ${d.label}`] }),
        pv.total7d === 0 ? h('div', { class: 'notice warn' }, 'Bu aramayla son 7 günde gönderi bulunamadı. Kelimeleri genişletmeyi deneyin.') : null,
        pv.total7d > 500000 ? h('div', { class: 'notice warn' }, 'Çok geniş bir konu. Örneklem küçük kalacağı için “Daralt” alanlarıyla sınırlamanız önerilir.') : null,
        pv.spec.postPreview ? h('div', { class: 'notice' }, h('b', null, `@${pv.spec.postPreview.username ?? '?'}`), h('div', { class: 'post-text' }, pv.spec.postPreview.text)) : null,
        h('details', null, h('summary', { class: 'muted small' }, 'Oluşan X sorgusu'), h('code', { class: 'q' }, pv.query)))
        : h('p', { class: 'muted' }, 'Konuyu tanımlayıp “Hacmi önizle”ye basın: son 7 günde kaç gönderi olduğunu ve yaklaşık maliyeti başlamadan görürsünüz. (Her önizleme X’e bir sayım isteği gönderir.)'),
      h('div', { class: 'notice' },
        h('div', null, 'Geçmişi getirme (bir kez): ', h('b', null, `≈ ${usd(e.backfill)}`)),
        h('div', null, 'Canlı izleme: ', h('b', null, `${pv ? '≈' : 'en az'} ${usd(e.daily / 24)} / saat`), h('span', { class: 'muted' }, ` (panel açık kaldıkça; 24 saat açık kalırsa ≈ ${usd(e.daily)})`)),
        h('div', { class: 'muted small', style: 'margin-top:6px' }, S.demo ? 'Demo modundasınız: gerçek harcama yapılmaz, rakamlar gerçek kullanımda ne olacağını gösterir.' : `Tahmini üst sınırdır; birim fiyatlar Ayarlar’dadır. Günlük tavanınız ${usd(S.usage.budget.daily)}; aşılınca veri çekimi kendiliğinden durur.`))].filter(Boolean));
  }
  const preview = async (btn) => { btn.disabled = true; try { f.preview = await api('POST', '/api/preview', { spec: spec() }); S.usage = f.preview.usage; renderTop(); drawSide(); } catch (e) { drawSide(e.message); } btn.disabled = false; };
  const start = async (btn) => {
    btn.disabled = true;
    const r = await act(() => api('POST', '/api/watches', { name: f.name, spec: spec(), interval_sec: f.interval_sec, backfill_hours: f.backfill_hours, backfill_posts: f.backfill_posts, posts_per_poll: f.posts_per_poll }));
    btn.disabled = false;
    if (r) { ui.form = null; S = await api('GET', '/api/state'); location.hash = `#/izleme/${r.id}`; }
  };
  const text = (key, ph) => h('input', { type: 'text', value: f[key], placeholder: ph, oninput: (e) => { f[key] = e.target.value; } });
  drawSide();
  return h('div', { class: 'stack' }, h('h1', null, 'Yeni izleme'),
    h('div', { class: 'grid g-form' },
      h('div', { class: 'card stack' },
        h('label', { class: 'f' }, h('span', null, 'Konu adı'), text('name', 'Örn. Asgari ücret tartışması'), h('small', null, 'Boş bırakırsanız ilk kelimeden üretilir.')),
        h('div', { class: 'f' }, h('label', { class: 'f' }, h('span', null, 'Bunlardan herhangi biri geçsin')), chipInput(f.any, 'kelime, #etiket ya da birkaç kelimelik ifade yazıp Enter’a basın'), h('small', { class: 'muted' }, 'Birden çok kelimeyi birlikte yazarsanız tam ifade olarak aranır.')),
        h('details', { open: f.all.length || f.accounts.length || f.exclude.length || f.postUrl ? true : null },
          h('summary', null, h('b', null, 'Daralt / hesap ya da gönderi izle')),
          h('div', { class: 'stack', style: 'margin-top:12px' },
            h('div', null, h('label', { class: 'f' }, h('span', null, 'Bunların hepsi geçsin')), chipInput(f.all, 'zorunlu kelime')),
            h('div', null, h('label', { class: 'f' }, h('span', null, 'Şu hesaplar')), chipInput(f.accounts, '@kullaniciadi'),
              h('div', { class: 'row', style: 'margin-top:6px' }, [['both', 'Yazdıkları ve onlardan bahsedenler'], ['from', 'Yalnızca yazdıkları'], ['mention', 'Yalnızca bahsedenler']].map(([v, l]) => h('label', null, h('input', { type: 'radio', name: 'am', checked: f.accountMode === v, onchange: () => { f.accountMode = v; } }), ' ', l))),
              h('small', { class: 'muted' }, 'Yukarıda kelime de varsa, yalnızca bu hesaplarla ilgili olanlar aranır.')),
            h('label', { class: 'f' }, h('span', null, 'Belirli bir gönderi'), text('postUrl', 'https://x.com/kullanici/status/…'), h('small', null, 'Gönderiye gelen yanıtlar ve alıntılar izlenir.')),
            h('div', null, h('label', { class: 'f' }, h('span', null, 'Hariç tut')), chipInput(f.exclude, 'kelime ya da @hesap')))),
        h('div', { class: 'row' },
          h('label', null, 'Dil ', h('select', { onchange: (e) => { f.lang = e.target.value; } }, [['tr', 'Türkçe'], ['', 'Tümü'], ['en', 'İngilizce']].map(([v, l]) => h('option', { value: v, selected: f.lang === v }, l)))),
          h('label', null, h('input', { type: 'checkbox', checked: f.excludeReposts, onchange: (e) => { f.excludeReposts = e.target.checked; drawSide(); } }), ' Yeniden paylaşımları çekme (önerilir, maliyeti düşürür)')),
        h('h3', null, 'Ne kadar veri çekilsin?'),
        h('div', { class: 'row' },
          h('label', null, 'Geriye bak ', sel('backfill_hours', [[6, '6 saat'], [24, '24 saat'], [72, '3 gün'], [168, '7 gün']])),
          h('label', null, 'Geçmişten en fazla ', sel('backfill_posts', [[0, 'gönderi çekme'], [100, '100 gönderi'], [200, '200 gönderi'], [500, '500 gönderi'], [1000, '1.000 gönderi'], [2000, '2.000 gönderi']])),
          h('label', null, 'Yenileme ', sel('interval_sec', [[60, '1 dk'], [120, '2 dk'], [300, '5 dk'], [900, '15 dk'], [1800, '30 dk']])),
          h('label', null, 'Her yenilemede en fazla ', sel('posts_per_poll', [[10, '10'], [25, '25'], [50, '50'], [100, '100']]), ' gönderi')),
        h('p', { class: 'muted small' }, 'Hacim grafiği X’in sayım verisinden eksiksiz gelir (ucuz). Gönderi içerikleri ise örneklem olarak çekilir; örneklem büyüdükçe hesap ve terim analizleri güvenilirleşir, maliyet artar.'),
        h('div', { class: 'row' }, h('button', { onclick: (e) => preview(e.currentTarget) }, 'Hacmi önizle'), h('button', { class: 'primary', onclick: (e) => start(e.currentTarget) }, 'İzlemeyi başlat'))),
      side));
}
function dailyBuckets(series) {
  const m = new Map();
  for (const b of series) { const k = tDay(b.ts); m.set(k, (m.get(k) ?? 0) + b.n); }
  return [...m].map(([label, v]) => ({ label, v }));
}

// ---------------------------------------------------------------- izleme detayı
const RANGES = [['1h', '1 sa'], ['6h', '6 sa'], ['24h', '24 sa'], ['3d', '3 gün'], ['7d', '7 gün']];
async function viewWatch(id) {
  let d;
  try { d = await api('GET', `/api/watches/${id}/analysis?range=${ui.range}`); } catch (e) { return h('div', { class: 'stack' }, h('div', { class: 'notice err' }, e.message), h('a', { href: '#/' }, '← Genel Bakış')); }
  S.usage = d.usage; renderTop();
  const { watch: w, analysis: a, pins, journal } = d; const m = a.momentum;
  const reload = () => render();
  const pin = (kind, ref_id, note) => act(async () => { await api('POST', `/api/watches/${id}/pins`, { kind, ref_id, note }); reload(); }, 'Not sepetine eklendi');
  const pinned = (kind, ref) => pins.some((p) => p.kind === kind && p.ref_id === String(ref));
  const pinBtn = (kind, ref, note) => (pinned(kind, ref) ? h('span', { class: 'tag new' }, '✓ sepette') : h('button', { class: 'ghost small', title: 'Danışmanlık notuna ekle', onclick: () => pin(kind, ref, note) }, '＋ Nota ekle'));

  const header = h('div', { class: 'row spread' },
    h('div', null, h('a', { href: '#/', class: 'small' }, '← Genel Bakış'), h('div', { class: 'row' }, h('h1', null, w.name), stageBadge(m.stage, m.stageLabel), w.status === 'paused' ? h('span', { class: 'tag' }, 'Duraklatıldı') : null)),
    h('div', { class: 'row no-print' },
      h('div', { class: 'seg' }, RANGES.map(([v, l]) => h('button', { class: ui.range === v ? 'on' : '', onclick: () => { ui.range = v; reload(); } }, l))),
      h('label', { class: 'small' }, 'Yenileme ', h('select', { onchange: (e) => act(() => api('PATCH', `/api/watches/${id}`, { interval_sec: Number(e.target.value) }), 'Yenileme aralığı güncellendi') }, [[60, '1 dk'], [120, '2 dk'], [300, '5 dk'], [900, '15 dk'], [1800, '30 dk']].map(([v, l]) => h('option', { value: v, selected: w.interval_sec === v }, l)))),
      h('button', { onclick: () => act(() => api('POST', `/api/watches/${id}/refresh`), 'Yenileniyor…') }, 'Şimdi yenile'),
      w.status === 'active' ? h('button', { onclick: () => act(async () => { await api('PATCH', `/api/watches/${id}`, { status: 'paused' }); }, 'Duraklatıldı. Veri çekilmiyor, harcama yapılmıyor.') }, 'Duraklat')
        : h('button', { onclick: () => act(async () => { await api('PATCH', `/api/watches/${id}`, { status: 'active' }); }, 'Sürdürülüyor') }, 'Sürdür'),
      h('button', { class: 'primary', onclick: () => briefDialog(id) }, 'Danışmanlık notu')));

  const prog = ui.progress[id];
  const statusLine = h('div', { class: 'muted small' }, w.running ? (prog ?? 'Veri çekiliyor…') : `Son güncelleme: ${ago(w.last_poll_at)}`, ` · Örneklem: ${nf(a.sample.n)} gönderi (dönemdeki ${nf(a.kpi.total)} gönderinin %${nf(a.sample.coverage * 100)}’i) · Analiz güveni: ${a.sample.confidence}`);

  const tile = (v, l, dd) => h('div', { class: 'card tile' }, h('div', { class: 'l' }, l), h('div', { class: 'v' }, v), dd ? h('div', { class: 'd' }, dd) : null);
  const status = h('div', { class: 'status' },
    h('div', { class: `card score st-${m.stage}` }, h('div', { class: 'tile' }, h('div', { class: 'l' }, 'İvme puanı')), h('b', null, m.score, h('small', null, ' / 100')), h('div', { class: 'meter' }, h('i', { style: `width:${m.score}%` })), h('div', { class: 'muted small', style: 'margin-top:6px', title: m.why }, m.lowVolume ? 'Düşük hacim: puan sınırlı' : `Son 30 dk: ${nf(m.last30)} · önceki: ${nf(m.prev30)}`)),
    tile(nf(a.kpi.total), 'Gönderi (seçilen dönem)', a.kpi.change === null ? 'önceki dönem verisi yok' : `önceki döneme göre ${a.kpi.change >= 0 ? '+' : '−'}%${nf(Math.abs(a.kpi.change) * 100)}`),
    tile(nf(a.kpi.perHour), 'Gönderi (son 1 saat)', m.projection && m.last30 >= 10 ? `1 saatlik beklenti: ${nf(m.projection.low)}–${nf(m.projection.high)}` : null),
    tile(nf(a.kpi.uniqueAuthors), 'Tekil hesap', 'örneklemde'),
    tile(compact(a.kpi.engagement), 'Toplam etkileşim', 'örneklemde'));

  const chart = h('div', { class: 'card' }, h('h2', null, 'Gönderi hacmi'), h('div', { class: 'muted small', style: 'margin:-6px 0 8px' }, `${a.stepMs >= 3600e3 ? 'Saatlik' : `${a.stepMs / 60000} dakikalık`} dilimler · kaynak: X sayım verisi (yeniden paylaşımlar dahil)`),
    volumeChart(a.series, a.stepMs, { markTs: m.burst?.start, markLabel: 'Dalga başlangıcı', height: ui.tab === 'gunluk' ? 170 : 260, dots: ui.tab === 'gunluk' ? journal.filter((j) => j.level === 1) : [] }), h('div', { class: 'muted small' }, ui.tab === 'gunluk' ? 'Noktalar, günlükteki önemli notların zamanını gösterir.' : m.why));

  // --- gözlem günlüğü ---
  const JF = [['all', 'Tümü'], ['important', 'Önemli'], ['hesap', 'Hesaplar'], ['gonderi', 'Gönderiler'], ['konu', 'Alt konular'], ['ozet', 'Saatlik özet']];
  const jShown = journal.filter((j) => (ui.jfilter === 'all' ? true : ui.jfilter === 'important' ? j.level === 1 : j.cat === ui.jfilter));
  const dayLabel = (ms) => { const d0 = tDay(ms); return d0 === tDay(Date.now()) ? 'Bugün' : d0 === tDay(Date.now() - 86400e3) ? 'Dün' : d0; };
  const jRows = []; let lastDay = null;
  for (const j of jShown.slice(0, 120)) {
    const dl = dayLabel(j.ts); if (dl !== lastDay) { jRows.push(h('div', { class: 'jday' }, dl)); lastDay = dl; }
    jRows.push(h('div', { class: `jrow l${j.level}` },
      h('div', { class: 'jt num' }, tHM(j.ts), h('div', { class: 'muted small' }, ago(j.ts))),
      h('div', { class: 'main' }, h('div', { class: 'jx' }, j.level === 1 ? h('span', { class: 'tag new', style: 'margin-left:0' }, 'Önemli') : null, j.level === 1 ? ' ' : null, j.text),
        j.evidence ? h('div', { class: 'muted small' }, j.evidence) : null),
      h('div', { class: 'row no-print', style: 'gap:2px' },
        j.ref_kind === 'post' ? ext(xLink(j.ref_user, j.ref_id), h('button', { class: 'ghost small' }, 'X’te aç')) : j.ref_kind === 'account' ? ext(xLink(j.ref_user), h('button', { class: 'ghost small' }, 'X’te aç')) : null,
        j.level < 3 ? pinBtn('note', `j${j.id}`, `${tHM(j.ts)} — ${j.text}`) : null)));
  }
  const canNotify = 'Notification' in window && Notification.permission === 'default';
  const quiet = journal.length && Date.now() - journal[0].ts > 3 * 3600e3;
  const journalCard = h('div', { class: 'card' },
    h('div', { class: 'row spread' }, h('div', null, h('h2', { style: 'margin-bottom:2px' }, 'Gözlem günlüğü'), h('div', { class: 'muted small' }, 'Sistem bu konuyu izliyor ve değişiklikleri buraya not ediyor.')),
      canNotify ? h('button', { class: 'small no-print', onclick: async () => { await Notification.requestPermission(); reload(); } }, '🔔 Önemli gelişmelerde haber ver') : null),
    h('div', { class: 'tabs no-print', style: 'margin-top:10px' }, JF.map(([k, l]) => h('button', { class: ui.jfilter === k ? 'on' : '', onclick: () => { ui.jfilter = k; reload(); } }, l))),
    quiet ? h('p', { class: 'muted small' }, 'Son 3 saatte kayda değer bir değişiklik olmadı.') : null,
    jRows.length ? h('div', { class: 'jlist' }, jRows)
      : h('p', { class: 'muted' }, journal.length ? 'Bu süzgece uyan not yok.' : 'Henüz not yok. İzleme yeni başladı; ilk gözlem birkaç dakika içinde burada görünecek.'));
  const viewTabs = h('div', { class: 'seg no-print' }, [['gunluk', 'Günlük'], ['veriler', 'Veriler']].map(([k, l]) => h('button', { class: ui.tab === k ? 'on' : '', onclick: () => { ui.tab = k; try { localStorage.setItem('nabiz.tab', k); } catch { /* yoksay */ } reload(); } }, l)));

  const cards = h('div', { class: 'card stack' }, h('h2', null, 'Öne çıkan içgörüler ve öneriler'),
    a.cards.length ? a.cards.slice(0, 8).map((c) => h('div', { class: `insight p${c.priority} ${c.kind === 'risk' ? 'risk' : ''}` }, h('div', null, h('div', { class: 't' }, c.title), h('div', { class: 'a' }, '→ ', c.action)), pinBtn('note', c.id, `${c.title} ${c.action}`)))
      : h('p', { class: 'muted' }, a.sample.n < 100 ? 'Yorum yapmak için henüz yeterli veri yok (en az 100 gönderilik örneklem gerekir).' : 'Şu an dikkat çeken bir gelişme yok; konu olağan seyrinde.'));

  const termList = a.terms.terms.filter((t) => t.rising || t.isNew || t.lift >= 1.5).slice(0, 12);
  const terms = h('div', { class: 'card' }, h('h2', null, 'Yükselen başlıklar'), h('div', { class: 'muted small', style: 'margin:-6px 0 6px' }, a.terms.terms.length ? `Son ${nf(a.terms.windowMin)} dakika, öncesiyle karşılaştırıldı` : ''),
    termList.length ? h('div', { class: 'list' }, termList.map((t) => h('div', { class: 'item' },
      h('div', { class: 'main' }, h('b', null, t.term), t.isNew ? h('span', { class: 'tag new' }, 'YENİ') : t.rising ? h('span', { class: 'tag new' }, 'Hızlanıyor') : null,
        h('div', { class: 'muted small' }, `${nf(t.y1)} hesap · gönderilerin %${nf(t.share * 100)}’i${t.y0 ? ` · önceki döneme göre ${nf1(t.lift)} kat` : ''}`)),
      pinBtn('term', t.term))))
      : h('p', { class: 'muted' }, a.terms.n1 < 20 ? 'Henüz yeterli veri yok.' : 'Belirgin biçimde yükselen bir alt başlık yok; konuşma mevcut çerçevede sürüyor.'));

  const accTabs = [['bridges', 'Ulaşılabilir yayıcılar'], ['early', 'Erken girenler'], ['influencers', 'Öne çıkanlar']];
  const accList = a.accounts[ui.accTab] ?? [];
  const accounts = h('div', { class: 'card' }, h('h2', null, 'Hesaplar'),
    h('div', { class: 'tabs' }, accTabs.map(([k, l]) => h('button', { class: ui.accTab === k ? 'on' : '', onclick: () => { ui.accTab = k; reload(); } }, l, ` (${a.accounts[k].length})`))),
    accList.length ? h('div', { class: 'list' }, accList.slice(0, 10).map((r) => h('div', { class: 'item' },
      h('div', { class: 'main' }, ext(xLink(r.username), h('b', null, `@${r.username}`)), r.verified ? h('span', { class: 'tag' }, 'onaylı') : null, h('span', { class: 'tag' }, r.tier), r.suspicion >= 0.5 ? h('span', { class: 'tag' }, '⚠ şüpheli') : null,
        h('div', { class: 'muted small' }, `${compact(r.followers)} takipçi · ${r.reason}`)),
      pinBtn('account', r.username, r.reason))))
      : h('p', { class: 'muted' }, ui.accTab === 'early' ? 'Belirgin bir dalga ya da erken giren hesap saptanmadı.' : 'Henüz yeterli veri yok.'));

  const posts = h('div', { class: 'card' }, h('div', { class: 'row spread' }, h('h2', null, 'Öne çıkan gönderiler'), h('button', { class: 'ghost small no-print', title: 'Bu gönderilerin beğeni/paylaşım sayılarını X’ten yeniden okur (gönderi başına ücretlenir)', onclick: () => act(async () => { const r = await api('POST', `/api/watches/${id}/refresh-metrics`); toast(`${nf(r.updated)} gönderinin etkileşimi güncellendi`); }) }, '↻ Etkileşimleri güncelle')),
    a.content.topPosts.length ? h('div', { class: 'list' }, a.content.topPosts.slice(0, 8).map((p) => h('div', { class: 'item' },
      h('div', { class: 'main' }, h('b', null, `@${p.username ?? '?'}`), h('span', { class: 'muted small' }, ` · ${compact(p.followers)} takipçi · ${ago(p.created_at)}`),
        h('div', { class: 'post-text' }, p.text),
        h('div', { class: 'muted small num' }, `♥ ${nf(p.likes)} · ⟲ ${nf(p.reposts)} · 💬 ${nf(p.replies)} · ❝ ${nf(p.quotes)} · `, ext(xLink(p.username, p.id), 'X’te aç'))),
      pinBtn('post', p.id))))
      : h('p', { class: 'muted' }, 'Henüz gönderi yok.'));

  const hoursMax = Math.max(...a.content.hours.map((x) => x.n));
  const formats = h('div', { class: 'card stack' }, h('h2', null, 'Biçim ve zamanlama'),
    a.content.formats.length ? h('div', null, h('h3', null, 'Hangi biçim daha çok etkileşim alıyor?'), a.content.formats.map((f) => h('div', { class: 'bar-row' }, h('span', null, f.label), h('span', null, h('i', { style: `width:${Math.min(100, (f.lift / Math.max(2, ...a.content.formats.map((x) => x.lift))) * 100)}%` })), h('span', { class: 'num' }, `${nf1(f.lift)} kat`))))
      : h('p', { class: 'muted small' }, 'Biçim karşılaştırması için henüz yeterli olgun gönderi yok.'),
    hoursMax > 0 ? h('div', null, h('h3', null, 'Saate göre gönderi sayısı (örneklem, Türkiye saati)'), barChart(a.content.hours.map((x) => ({ v: x.n, hour: x.hour })), { height: 100, label: (d2, i) => (i % 3 === 0 ? String(d2.hour).padStart(2, '0') : ''), tip: (d2) => [h('b', null, nf(d2.v)), ` gönderi · ${String(d2.hour).padStart(2, '0')}:00`] }),
      a.content.bestHours.length ? h('div', { class: 'muted small' }, `En yüksek etkileşim: ${a.content.bestHours.map((x) => `${String(x.hour).padStart(2, '0')}:00`).join(', ')} (yalnızca bu konuda gözlenen)`) : null) : null);

  const noteInput = h('input', { type: 'text', placeholder: 'Kendi notunuzu yazın…' });
  const basket = h('div', { class: 'card stack' }, h('h2', null, `Not sepeti (${pins.length})`),
    pins.length ? h('div', { class: 'list' }, pins.map((p) => h('div', { class: 'item' },
      h('div', { class: 'main' }, h('span', { class: 'tag', style: 'margin-left:0' }, { post: 'Gönderi', account: 'Hesap', term: 'Başlık', note: 'Not' }[p.kind]), ' ',
        p.kind === 'post' ? (p.post ? `@${p.post.username}: ${p.post.text.slice(0, 120)}` : 'gönderi') : p.kind === 'account' ? `@${p.ref_id}` : p.kind === 'term' ? p.ref_id : p.note,
        p.kind !== 'note' && p.note ? h('div', { class: 'muted small' }, p.note) : null),
      h('button', { class: 'ghost small', 'aria-label': 'Kaldır', onclick: () => act(async () => { await api('DELETE', `/api/watches/${id}/pins/${p.id}`); reload(); }) }, '×'))))
      : h('p', { class: 'muted small' }, 'İzlerken “＋ Nota ekle” ile seçtiğiniz gönderi, hesap ve içgörüler burada birikir ve danışmanlık notuna aktarılır.'),
    h('div', { class: 'row no-print' }, h('div', { style: 'flex:1' }, noteInput), h('button', { onclick: () => noteInput.value.trim() && pin('note', null, noteInput.value.trim()) }, 'Not ekle')));

  const foot = h('details', { class: 'muted small no-print' }, h('summary', null, 'İzleme ayarları'), h('div', { class: 'stack', style: 'margin-top:8px' }, h('code', { class: 'q' }, w.query),
    h('div', null, `Saklanan gönderi: ${nf(w.stored)} · Her yenilemede en fazla ${w.posts_per_poll} gönderi · Oluşturulma: ${tDay(w.created_at)}`),
    h('div', null, h('button', { class: 'danger', onclick: async () => { if (confirm(`“${w.name}” izlemesi ve topladığı veriler silinsin mi?`)) { await act(() => api('DELETE', `/api/watches/${id}`)); S = await api('GET', '/api/state'); location.hash = '#/'; } } }, 'İzlemeyi sil'))));

  return h('div', { class: 'stack' }, header, statusLine,
    w.last_error ? h('div', { class: 'notice err' }, w.last_error, ' ', h('span', { class: 'muted' }, '(Ekrandaki veriler son başarılı çekime aittir.)')) : null,
    !w.backfill_done && !w.last_error ? h('div', { class: 'notice' }, prog ?? 'Geçmiş getiriliyor…') : null,
    status, viewTabs,
    ...(ui.tab === 'gunluk' ? [chart, h('div', { class: 'grid g-form' }, journalCard, basket)]
      : [chart, cards, h('div', { class: 'grid g2' }, terms, accounts), h('div', { class: 'grid g2' }, posts, h('div', { class: 'stack' }, formats, basket))]), foot);
}

async function briefDialog(id) {
  const r = await act(() => api('GET', `/api/watches/${id}/brief?range=${ui.range}`));
  if (!r) return;
  const ta = h('textarea', { value: r.text });
  const dlg = h('dialog', null, h('div', { class: 'stack' }, h('div', { class: 'row spread' }, h('h2', null, 'Danışmanlık notu'), h('span', { class: 'muted small' }, 'Metin düzenlenebilir; istatistiklerden otomatik üretildi.')), ta,
    h('div', { class: 'row' }, h('button', { class: 'primary', onclick: async () => { try { await navigator.clipboard.writeText(ta.value); } catch { ta.select(); document.execCommand('copy'); } toast('Metin kopyalandı'); } }, 'Metni kopyala'),
      h('button', { onclick: () => { const win = window.open('', '_blank'); if (!win) return toast('Açılır pencere engellendi'); const pre = win.document.createElement('pre'); pre.style.cssText = 'font:14px/1.6 system-ui;white-space:pre-wrap;max-width:720px;margin:40px auto'; pre.textContent = ta.value; win.document.body.append(pre); win.document.title = 'Danışmanlık notu'; win.print(); } }, 'Yazdır / PDF'),
      h('button', { onclick: () => dlg.close() }, 'Kapat'))));
  dlg.addEventListener('close', () => dlg.remove());
  document.body.append(dlg); dlg.showModal();
}

// ---------------------------------------------------------------- danışan
function viewClient() {
  const c = S.client ?? { name: '', handle: '', goals: '', sensitive: [] };
  const name = h('input', { type: 'text', value: c.name, placeholder: 'Ad Soyad ya da kurum' }); const handle = h('input', { type: 'text', value: c.handle, placeholder: 'kullaniciadi' });
  const goals = h('textarea', { rows: 4, placeholder: 'Örn. Ekonomi alanında görünürlüğünü artırmak; gençlere ulaşmak.' }, c.goals); goals.value = c.goals;
  const sens = [...(c.sensitive ?? [])];
  return h('div', { class: 'stack', style: 'max-width:680px' }, h('h1', null, 'Danışan profili'),
    h('p', { class: 'muted' }, 'Danışmanlık notları bu kişiye göre başlıklanır. Hassas konulardan biri yükselişe geçerse ayrıca uyarılırsınız.'),
    h('div', { class: 'card stack' },
      h('label', { class: 'f' }, h('span', null, 'Danışan'), name), h('label', { class: 'f' }, h('span', null, 'X hesabı'), handle),
      h('label', { class: 'f' }, h('span', null, 'Hedefler'), goals),
      h('div', null, h('label', { class: 'f' }, h('span', null, 'Hassas konular')), chipInput(sens, 'kelime yazıp Enter’a basın'), h('small', { class: 'muted' }, 'Bu kelimeler yükselen başlıklarda görülürse “Dikkat” uyarısı çıkar.')),
      h('div', null, h('button', { class: 'primary', onclick: () => act(async () => { S = await api('PUT', '/api/client', { name: name.value, handle: handle.value, goals: goals.value, sensitive: sens }); if (!S.watches.length) location.hash = '#/yeni'; }, 'Kaydedildi') }, 'Kaydet'))));
}

// ---------------------------------------------------------------- ayarlar
function viewSettings() {
  const u = S.usage; const num = (v, step = '0.001') => h('input', { type: 'number', min: '0', step, value: v, style: 'width:110px' });
  const daily = num(u.budget.daily, '1'); const monthly = num(u.budget.monthly, '1'); const pp = num(u.prices.post); const pu = num(u.prices.user); const pc = num(u.prices.counts);
  const maxDay = Math.max(u.budget.daily, ...u.days.map((d) => d.cost));
  const token = h('input', { type: 'password', placeholder: 'Yeni Bearer Token', autocomplete: 'off' });
  return h('div', { class: 'stack', style: 'max-width:820px' }, h('h1', null, 'Ayarlar ve Bütçe'),
    h('div', { class: 'card stack' }, h('h2', null, 'X bağlantısı'),
      h('div', null, S.tokenFromEnv ? 'Token ortam değişkeninden (X_BEARER_TOKEN) okunuyor.' : S.connected ? 'Token kayıtlı (gizli).' : 'Token girilmemiş.', S.capabilities?.message ? h('span', { class: 'muted' }, ` ${S.capabilities.message}`) : null),
      S.tokenFromEnv ? null : h('div', { class: 'row' }, h('div', { style: 'flex:1;min-width:220px' }, token),
        h('button', { class: 'primary', onclick: () => act(async () => { const r = await api('POST', '/api/token', { token: token.value }); S = r.state; toast(r.capabilities.message); render(); }) }, S.connected ? 'Değiştir' : 'Bağlan'),
        S.connected ? h('button', { class: 'danger', onclick: () => confirm('Kayıtlı token silinsin mi?') && act(async () => { S = await api('DELETE', '/api/token'); render(); }) }, 'Token’ı sil') : null),
      h('label', null, h('input', { type: 'checkbox', checked: S.demo, onchange: (e) => act(async () => { S = await api('POST', '/api/demo', { on: e.target.checked }); render(); }) }), ' Demo modu (uydurma veri; X’e bağlanmaz, harcama yapmaz). Demo ve gerçek izlemeler ayrı tutulur.')),
    h('div', { class: 'card stack' }, h('h2', null, S.demo ? 'Harcama (demo: gerçek değil)' : 'Harcama ve tavanlar'),
      h('div', { class: 'row' }, h('div', { class: 'tile' }, h('div', { class: 'l' }, 'Bugün'), h('div', { class: 'v' }, usd(u.today))), h('div', { class: 'tile' }, h('div', { class: 'l' }, 'Bu ay'), h('div', { class: 'v' }, usd(u.month))),
        h('div', { class: 'tile' }, h('div', { class: 'l' }, 'Bu ay okunan'), h('div', { class: 'd' }, `${nf(u.detail.posts)} gönderi · ${nf(u.detail.users)} hesap · ${nf(u.detail.counts)} sayım isteği`))),
      u.days.length ? h('div', null, u.days.slice(-14).map((d) => h('div', { class: 'bar-row' }, h('span', null, d.day.slice(5)), h('span', null, h('i', { style: `width:${Math.min(100, (d.cost / maxDay) * 100)}%` })), h('span', { class: 'num' }, usd(d.cost))))) : null,
      h('div', { class: 'row' }, h('label', null, 'Günlük tavan ($) ', daily), h('label', null, 'Aylık tavan ($) ', monthly)),
      h('p', { class: 'muted small' }, 'Tavana ulaşıldığında izlemeler veri çekmeyi kendiliğinden bırakır. Rakamlar bu uygulamanın kendi tuttuğu tahmindir; kesin tutar için X Geliştirici Konsolu’na bakın. Günler UTC’ye göredir.'),
      h('label', null, h('input', { type: 'checkbox', checked: S.autoPause, id: 'ap' }), ' Panel 30 dakikadır hiçbir tarayıcıda açık değilse veri çekmeyi beklet (önerilir)'),
      h('label', null, h('input', { type: 'checkbox', checked: S.trackPosts, id: 'tp' }), ' Öne çıkan gönderilerin etkileşimini 15 dakikada bir yeniden oku (günlükteki “etkileşimi artıyor” notları için; izleme başına saatte en çok 40 gönderi okur)'),
      h('details', null, h('summary', { class: 'muted small' }, 'Birim fiyatlar (X fiyat değiştirirse güncelleyin)'), h('div', { class: 'row', style: 'margin-top:8px' }, h('label', null, 'Gönderi ', pp), h('label', null, 'Hesap ', pu), h('label', null, 'Sayım isteği ', pc))),
      h('div', null, h('button', { class: 'primary', onclick: () => act(async () => { S = await api('PUT', '/api/settings', { budget: { daily: daily.value, monthly: monthly.value }, prices: { post: pp.value, user: pu.value, counts: pc.value }, autoPause: document.getElementById('ap').checked, trackPosts: document.getElementById('tp').checked }); render(); }, 'Kaydedildi') }, 'Kaydet'))));
}

// ---------------------------------------------------------------- yönlendirme ve canlı güncelleme
let renderSeq = 0;
async function render() {
  const seq = ++renderSeq;
  if (!S) S = await api('GET', '/api/state');
  renderTop();
  const [route, arg] = location.hash.replace(/^#\//, '').split('/');
  let view;
  if (route === 'izleme') view = await viewWatch(Number(arg));
  else if (route === 'yeni') view = viewNew();
  else if (route === 'danisan') view = viewClient();
  else if (route === 'ayarlar') view = viewSettings();
  else view = viewOverview();
  if (seq !== renderSeq) return;
  const y = window.scrollY; hideTip();
  $app.replaceChildren(view); window.scrollTo(0, y);
}
let lastRoute = '';
window.addEventListener('hashchange', () => { const r = location.hash; if (r !== lastRoute) { lastRoute = r; window.scrollTo(0, 0); } render(); });

let pending = null;
function liveRefresh() {
  clearTimeout(pending);
  pending = setTimeout(async () => {
    const busy = document.querySelector('dialog[open]') || ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
    const route = location.hash.replace(/^#\//, '').split('/')[0];
    if (busy || ['yeni', 'danisan', 'ayarlar'].includes(route)) { try { S = await api('GET', '/api/state'); renderTop(); } catch { /* yoksay */ } return; }
    try { S = await api('GET', '/api/state'); render(); } catch { /* yoksay */ }
  }, 400);
}
function connect() {
  const es = new EventSource('/api/events');
  es.addEventListener('update', (e) => { const d = JSON.parse(e.data); delete ui.progress[d.watchId]; liveRefresh(); });
  es.addEventListener('journal', (e) => {
    const d = JSON.parse(e.data); const imp = d.entries.filter((j) => j.level === 1);
    if (!imp.length) return;
    toast(`${d.name}: ${imp[0].text}`);
    if (document.hidden) { ui.unseen += imp.length; document.title = `(${ui.unseen}) Nabız · X konu izleme`; }
    if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
      try { new Notification(`Nabız · ${d.name}`, { body: imp.length > 1 ? `${imp.length} yeni gelişme: ${imp[0].text}` : imp[0].text, tag: `nabiz-${d.watchId}` }); } catch { /* yoksay */ }
    }
  });
  es.addEventListener('progress', (e) => { const d = JSON.parse(e.data); ui.progress[d.watchId] = d.step; liveRefresh(); });
  es.onerror = () => { document.getElementById('conn').textContent = 'Sunucuyla bağlantı koptu, yeniden deneniyor…'; document.getElementById('conn').className = 'pill bad'; };
  es.onopen = () => { if (S) renderTop(); };
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) { ui.unseen = 0; document.title = 'Nabız · X konu izleme'; } });
setInterval(liveRefresh, 60_000);
render().catch((e) => { $app.replaceChildren(h('div', { class: 'notice err' }, `Sunucuya ulaşılamadı: ${e.message}`)); });
connect();
