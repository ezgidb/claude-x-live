#!/usr/bin/env node
// Komut satırı: çalışan Nabız sunucusuna bağlanır. Claude ile sohbet ederken taramayı/incelemeyi
// başlatmak ve sonucu metin olarak okumak için kullanılır. Kullanım: node src/cli.js yardim
const BASE = process.env.NABIZ_URL ?? `http://127.0.0.1:${process.env.PORT ?? 4321}`;
const AUTH = process.env.APP_PASSWORD ? { authorization: 'Basic ' + Buffer.from(`nabiz:${process.env.APP_PASSWORD}`).toString('base64') } : {};
const args = process.argv.slice(2); const cmd = args.shift();
const flags = {}; const rest = [];
for (let i = 0; i < args.length; i++) { if (args[i].startsWith('--')) { const k = args[i].slice(2); flags[k] = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true; } else rest.push(args[i]); }

async function api(method, path, body) {
  let res;
  try { res = await fetch(BASE + path, { method, headers: { 'content-type': 'application/json', ...AUTH }, body: method === 'GET' ? undefined : JSON.stringify(body ?? {}) }); } catch { throw new Error(`Nabız sunucusuna ulaşılamadı (${BASE}). Önce "npm start" ile başlatın.`); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Hata (${res.status})`);
  return data;
}
const nf = (n) => Math.round(n ?? 0).toLocaleString('tr-TR');
const nf1 = (n) => (n ?? 0).toLocaleString('tr-TR', { maximumFractionDigits: 1 });
const tHM = (ms) => new Date(ms).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const hm = (ms) => new Date(ms).toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' });
const out = (...l) => console.log(l.join('\n'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const specOf = (terms) => ({ any: terms.filter((t) => !t.startsWith('@')), accounts: terms.filter((t) => t.startsWith('@')), lang: flags.dil === 'hepsi' ? '' : (flags.dil ?? 'tr'), excludeReposts: true });

function printList(l) {
  out(`\nLİSTE #${l.id} “${l.name}” — nöbetçi: ${l.enabled ? `açık (${l.interval_min} dk)` : 'kapalı'}; son tarama: ${l.last_scan_at ? tHM(l.last_scan_at) : 'yok'}${l.last_error ? `; HATA: ${l.last_error}` : ''}`);
  for (const i of [...l.items].sort((a, b) => (b.result?.score ?? -1) - (a.result?.score ?? -1))) {
    const r = i.result;
    out(r ? `  ${i.value}: ${r.stageLabel}, ivme ${r.score}/100, son 1 saat ${nf(r.lastHour)} gönderi, son 30 dk ${nf(r.last30)} (olağan ~${nf(r.baseline30)}), 24 saat ${nf(r.total24)}${r.burstActive ? `, dalga ${hm(r.burstStart)}’te başladı` : ''}` : `  ${i.value}: henüz taranmadı`);
  }
}
function printPlan(w) {
  const inv = w.investigation; const p = inv.plan;
  out(`\nİNCELEME #${w.id} “${w.name}” — son ${inv.hours} saat — durum: ${inv.status}`, `Sorgu: ${w.query}`, '', 'TARAMA SONUCU (yalnızca sayım verisi):', ...p.facts.map((f) => '  • ' + f), '', 'PLAN:');
  for (const s of p.segments) out(`  ${s.label} ${hm(s.from)}–${hm(s.to)}: ${nf(s.count)} gönderi → ${s.take === 'full' ? 'tamamı okunacak' : s.take === 'sample' ? `temsilî ${nf(s.quota)} gönderi (zamana eşit yayılmış)` : 'okunmayacak'}`);
  out(`  Toplam ≈ ${nf(inv.cost.posts)} gönderi, tahmini ≈ ${inv.cost.cost.toFixed(2)} $`, '', inv.status === 'planned' ? `Onay için: node src/cli.js onayla ${w.id}   (her evrenin tamamı için: --tam)` : '');
}
async function report(id) {
  const range = flags.aralik ?? '6h';
  const d = await api('GET', `/api/watches/${id}/analysis?range=${range}`);
  const a = d.analysis; const m = a.momentum; const w = d.watch;
  out(`\nRAPOR #${w.id} “${w.name}” — aralık ${range} — ${tHM(a.now)}`, `Sorgu: ${w.query}`,
    `Aşama: ${m.stageLabel}; ivme ${m.score}/100. ${m.why}`,
    `Dönem: ${nf(a.kpi.total)} gönderi (sayım); son 1 saat ${nf(a.kpi.perHour)}. Okunan örneklem: ${nf(a.sample.n)} gönderi (%${nf(a.sample.coverage * 100)}), güven: ${a.sample.confidence}.`);
  out('', 'GÖZLEM GÜNLÜĞÜ (eskiden yeniye):', ...[...d.journal].reverse().map((j) => `  ${tHM(j.ts)} ${j.level === 1 ? '[ÖNEMLİ] ' : ''}${j.text}${j.evidence ? `  (${j.evidence})` : ''}`));
  out('', 'YÜKSELEN BAŞLIKLAR:', ...(a.terms.terms.filter((t) => t.rising || t.lift >= 1.5).slice(0, 10).map((t) => `  “${t.term}”: ${nf(t.y1)} hesap, ${nf1(t.lift)} kat${t.isNew ? ' (yeni)' : ''}`)));
  for (const [k, title] of [['early', 'ERKEN GİRENLER'], ['influencers', 'ÖNE ÇIKAN HESAPLAR'], ['bridges', 'ULAŞILABİLİR YAYICILAR']]) out('', title + ':', ...a.accounts[k].slice(0, 8).map((r) => `  @${r.username} (${nf(r.followers)} takipçi): ${r.reason}`));
  out('', 'ÖNE ÇIKAN GÖNDERİLER:', ...a.content.topPosts.slice(0, 10).map((p) => `  @${p.username} [${tHM(p.created_at)}; ${nf(p.engagement)} etkileşim] ${String(p.text).replace(/\s+/g, ' ').slice(0, 240)}  https://x.com/${p.username}/status/${p.id}`));
  out('', 'OTOMATİK İÇGÖRÜLER:', ...a.cards.map((c) => `  • ${c.title} → ${c.action}`));
}

const HELP = `Nabız komutları (sunucu çalışırken):
  durum                              Bağlantı, harcama, listeler ve incelemelerin özeti
  tara <öğe> [öğe…] [--dil tr|en|hepsi]   Hızlı tarama: kelime, #etiket, "ifade" ya da @hesap (gönderi okumaz)
  listeler                           Tarama listeleri ve son sonuçları
  liste-tara <listeNo>               Bir listeyi şimdi tara
  incele <öğe> [öğe…] --saat N [--ad "Ad"]  N saat geriye tara ve inceleme planı çıkar (gönderi okumaz)
  plan <no>                          Bekleyen planı göster
  onayla <no> [--tam]                Planı onayla, veriyi çek, raporu yaz
  rapor <no> [--aralik 1h|6h|24h|3d|7d]   Günlük, hesaplar, başlıklar ve öne çıkan gönderiler
  canli <no> [--kapat]               İncelemeyi canlı izlemeye al / durdur`;

const run = {
  async yardim() { out(HELP); },
  async durum() {
    const s = await api('GET', '/api/state');
    out(`Bağlantı: ${s.demo ? 'DEMO veri (gerçek değil)' : s.connected ? 'X bağlı' : 'token yok'}. Harcama: bugün ${s.usage.today.toFixed(2)} $ / ${s.usage.budget.daily} $, bu ay ${s.usage.month.toFixed(2)} $ / ${s.usage.budget.monthly} $.`);
    s.lists.forEach(printList);
    out('', 'İNCELEMELER VE İZLEMELER:', ...s.watches.map((w) => `  #${w.id} “${w.name}” — ${w.investigation ? `inceleme (${w.investigation.status})` : 'canlı izleme'}${w.status === 'active' ? ', canlı' : ''}${w.summary ? `; ${w.summary.stageLabel}, ivme ${w.summary.score}` : ''}${w.last_error ? `; HATA: ${w.last_error}` : ''}`));
    if (s.recent.length) out('', 'SON ÖNEMLİ GELİŞMELER:', ...s.recent.map((j) => `  ${tHM(j.ts)} [${j.watch}] ${j.text}`));
  },
  async tara() {
    if (!rest.length) throw new Error('En az bir öğe verin. Örnek: tara "sarı torba" "#GS" @hesap');
    const s = await api('GET', '/api/state');
    let l = s.lists.find((x) => x.name === 'Hızlı tarama');
    const id = l ? l.id : (await api('POST', '/api/lists', { name: 'Hızlı tarama', items: rest })).id;
    await api('PUT', `/api/lists/${id}`, { items: rest, lang: flags.dil === 'hepsi' ? '' : (flags.dil ?? 'tr') });
    const r = await api('POST', `/api/lists/${id}/scan`, { wait: true });
    printList(r.lists.find((x) => x.id === id));
  },
  async listeler() { (await api('GET', '/api/state')).lists.forEach(printList); },
  async 'liste-tara'() { const id = Number(rest[0]); const r = await api('POST', `/api/lists/${id}/scan`, { wait: true }); printList(r.lists.find((x) => x.id === id)); },
  async incele() {
    if (!rest.length) throw new Error('En az bir öğe verin. Örnek: incele "sarı torba" --saat 3');
    const r = await api('POST', '/api/investigations', { spec: specOf(rest), hours: Number(flags.saat ?? 3), name: flags.ad });
    printPlan(r.watch);
  },
  async plan() { printPlan((await api('GET', `/api/watches/${Number(rest[0])}/analysis`)).watch); },
  async onayla() {
    const id = Number(rest[0]);
    const w = (await api('GET', `/api/watches/${id}/analysis`)).watch;
    await api('POST', `/api/investigations/${id}/approve`, { segments: flags.tam ? w.investigation.plan.segments.map((s) => ({ key: s.key, take: 'full' })) : [] });
    for (let i = 0; i < 600; i++) {
      await sleep(1000);
      const cur = (await api('GET', '/api/state')).watches.find((x) => x.id === id);
      if (cur?.last_error) throw new Error(cur.last_error);
      if (cur?.investigation?.status === 'done' && !cur.running) break;
    }
    await sleep(500);
    await report(id);
  },
  async rapor() { await report(Number(rest[0])); },
  async canli() { await api('PATCH', `/api/watches/${Number(rest[0])}`, { status: flags.kapat ? 'paused' : 'active' }); out(flags.kapat ? 'Canlı izleme durduruldu.' : 'Canlı izleme başladı.'); },
};
(run[cmd] ?? run.yardim)().catch((e) => { console.error('Hata: ' + e.message); process.exit(1); });
