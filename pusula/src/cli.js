#!/usr/bin/env node
// Komut satırı: çalışan Pusula sunucusuna sorar (Claude'un ya da sizin yazıyla kullanmanız için).
const base = process.env.PUSULA_URL || 'http://localhost:4400';
const [cmd, ...args] = process.argv.slice(2);

async function api(path, body, method) {
  let r;
  try {
    r = await fetch(base + path, body ? { method: method || 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { method: method || 'GET' });
  } catch { console.error(`Pusula sunucusuna ulaşılamadı (${base}). Önce "npm start" ile başlatın.`); process.exit(1); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { console.error(j.error || `Hata ${r.status}`); process.exit(1); }
  return j;
}
const saat = (t) => new Date(t).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
const yuzde = (x) => `%${Math.round((x || 0) * 100)}`;
const unwrap = (j, k) => (Array.isArray(j) ? j : j[k] || []);

async function findClient(q) {
  const list = unwrap(await api('/api/clients'), 'clients');
  const c = list.find((x) => x.id === q) || list.find((x) => x.name.toLocaleLowerCase('tr').includes(String(q || '').toLocaleLowerCase('tr')));
  if (!c) { console.error(`Danışan bulunamadı: ${q}. Mevcutlar: ${list.map((x) => x.id).join(', ')}`); process.exit(1); }
  return c;
}
const snapOf = async (c) => { const j = await api(`/api/clients/${c.id}/snapshot`); return j.snapshot === undefined ? j : j.snapshot; };

const cmds = {
  async durum() {
    const s = await api('/api/status');
    console.log(`Mod: ${s.mode === 'demo' ? 'DEMO veri (uydurma)' : 'canlı'} · Yorum: ${s.ai === 'claude' ? 'Claude' : 'yerel'} · Saat: ${saat(s.clock.now)}${s.mode === 'demo' ? ` (${s.clock.speed}× hız)` : ''}`);
    for (const c of unwrap(await api('/api/clients'), 'clients')) {
      const n = await snapOf(c);
      if (!n) { console.log(`- ${c.name} [${c.id}]: veri bekleniyor`); continue; }
      console.log(`- ${c.name} [${c.id}]: ${n.risk.level.toUpperCase()} (${n.risk.score}) · ${n.pulse.trend} · saatte ${n.pulse.rate1h} gönderi (olağan ${Math.round(n.pulse.baseline1h)})${n.incident ? ` · OLAY: ${n.incident.headline}` : ''}`);
    }
  },
  async rapor(q) {
    const c = await findClient(q), n = await snapOf(c);
    if (!n) return console.log('Henüz veri yok.');
    const b = n.brief, p = n.playbook;
    console.log(`# ${c.name} — ${saat(n.at)}\nRisk: ${n.risk.level} (${n.risk.score}/100) · Eğilim: ${n.pulse.trend} · Saatlik: ${n.pulse.rate1h} (olağan ${Math.round(n.pulse.baseline1h)})`);
    console.log(`Risk etkenleri: ${n.risk.drivers.map((d) => d.note).join('; ') || '—'}`);
    console.log(`Tahmin: 1 saat sonra ~${n.forecast.next1h}, 3 saat sonra ~${n.forecast.next3h}; yön ${n.forecast.direction}; güven ${n.forecast.confidence}. ${n.forecast.basis || ''}`);
    console.log(`Duruş (son 3 saat): eleştiri ${yuzde(n.stance.elestiri)}, alay ${yuzde(n.stance.alay)}, destek ${yuzde(n.stance.destek)}, soru ${yuzde(n.stance.soru)}, nötr ${yuzde(n.stance.notr)}`);
    console.log(`Dayanak: ${n.sample.items} gönderi incelendi (${Object.entries(n.sources).map(([k, v]) => `${k} ${v}`).join(', ')}).`);
    if (b) console.log(`\n## Durum notu (${b.by === 'claude' ? 'Claude' : 'yerel'}, güven: ${b.confidence})\n${b.headline}\n\nNe oldu: ${b.whatHappened}\nNasıl büyüdü: ${b.howItGrew}\nKim başlattı: ${b.whoStarted}\nKim büyüttü: ${b.whoAmplified}\nŞimdi nerede: ${b.whereNow}\nAnlamı: ${b.meaning}\nSırada: ${(b.watchNext || []).join(' · ')}\n(${b.basisNote})`);
    console.log('\n## Anlatılar');
    for (const a of n.narratives.slice(0, 8)) console.log(`- ${a.label} [${a.kind}, ${a.status}] ${a.count} gönderi (${yuzde(a.share)}), risk ${a.risk}${a.summary ? ` — ${a.summary}` : ''}`);
    if (n.cascade?.steps?.length) { console.log('\n## Yayılım'); for (const s of n.cascade.steps) console.log(`- ${saat(s.t)} [${s.kind}] ${s.note}`); }
    if (n.coordination?.length) { console.log('\n## Koordinasyon şüphesi (kanıt değil, işaret)'); for (const k of n.coordination) console.log(`- ${k.kind}: ${k.accounts.length} hesap, ${k.windowMin} dk, skor ${k.score.toFixed(2)} — ${k.note}`); }
    console.log('\n## Öne çıkan hesaplar');
    for (const a of n.actors.slice(0, 10)) console.log(`- @${a.handle} [${a.role}] ${a.followers.toLocaleString('tr-TR')} takipçi — ${a.note || ''}`);
    if (p) {
      console.log(`\n## Ne yapmalı: ${p.posture.toUpperCase()}\n${p.rationale}`);
      for (const o of p.options || []) console.log(`\n• ${o.name} — ${o.when}\n  Getirisi: ${o.upside}\n  Riski: ${o.risk}\n  Taslak: ${o.draft}`);
      if (p.doNot?.length) console.log(`\nYapmayın: ${p.doNot.join(' · ')}`);
      console.log(`Sonraki kontrol: ${p.nextCheckMin} dk`);
    }
  },
  async olaylar(q) {
    const c = q ? await findClient(q) : null;
    for (const e of unwrap(await api(`/api/events?limit=30${c ? `&client=${c.id}` : ''}`), 'events')) console.log(`${saat(e.at)} [${e.level}] ${c ? '' : `${e.clientId}: `}${e.title}${e.detail ? ` — ${e.detail}` : ''}`);
  },
  async sor(q, ...soru) { const c = await findClient(q); console.log((await api(`/api/clients/${c.id}/ask`, { question: soru.join(' ') })).answer); },
  async ekle(ad, ...terimler) { const j = await api('/api/clients', { name: ad, terms: terimler }); console.log(`Eklendi: ${(j.client || j).id}`); },
  async sil(q) { const c = await findClient(q); await api(`/api/clients/${c.id}`, null, 'DELETE'); console.log(`Silindi: ${c.name}`); },
  async hiz(n) { await api('/api/demo', { speed: Number(n) }); console.log(`Demo hızı: ${n}×`); },
  async bastan() { await api('/api/demo', { restart: true }); console.log('Demo senaryosu baştan başlatıldı.'); },
};

if (!cmds[cmd]) {
  console.log(`Kullanım:
  pusula durum                       tüm danışanların anlık durumu
  pusula rapor <danışan>             durum notu, anlatılar, yayılım, yanıt planı
  pusula olaylar [danışan]           son olay akışı
  pusula sor <danışan> <soru…>       Pusula'ya sor
  pusula ekle "<ad>" [ifade…]        danışan ekle
  pusula sil <danışan>
  pusula hiz <1|60|300> · pusula bastan   (yalnızca demo)`);
} else await cmds[cmd](...args);
