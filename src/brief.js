// Danışmanlık notu: istatistiklerden şablonla üretilen, düzenlenebilir düz metin.
const fmt = (n) => Math.round(n).toLocaleString('tr-TR');
const fmt1 = (n) => n.toLocaleString('tr-TR', { maximumFractionDigits: 1 });
const dt = (ms) => new Date(ms).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });
const link = (p) => `https://x.com/${p.username ?? 'i'}/status/${p.id}`;

export function buildBrief({ watch, analysis: a, client, pins, rangeLabel, journal = [] }) {
  const m = a.momentum; const L = [];
  const who = client?.name ? client.name : 'Danışan';
  L.push(`DANIŞMANLIK NOTU — ${watch.name}`);
  L.push(`${who}${client?.handle ? ` (@${client.handle.replace(/^@/, '')})` : ''} için · ${dt(a.now)} · Kapsam: ${rangeLabel}`);
  L.push('');
  L.push('ÖZET');
  const change = a.kpi.change === null ? '' : ` (önceki döneme göre %${fmt(Math.abs(a.kpi.change) * 100)} ${a.kpi.change >= 0 ? 'artış' : 'azalış'})`;
  L.push(`Konu şu an “${m.stageLabel}” aşamasında; ivme puanı ${m.score}/100. Seçilen dönemde yaklaşık ${fmt(a.kpi.total)} gönderi paylaşıldı${change}. `
    + `Son 30 dakikada ${fmt(m.last30)} gönderi görüldü (önceki 30 dakika: ${fmt(m.prev30)}).`);
  if (m.projection && m.last30 >= 10) L.push(`Mevcut eğilim sürerse önümüzdeki 1 saatte ${fmt(m.projection.low)}–${fmt(m.projection.high)} gönderi bekleniyor.`);
  L.push('');

  // Günlükten: önemli notlar, eskiden yeniye (en çok 8)
  const course = journal.filter((j) => j.level === 1 || j.type === 'watch_started').slice(0, 8).reverse();
  if (course.length) {
    L.push('GELİŞMELERİN SEYRİ');
    for (const j of course) L.push(`• ${new Date(j.ts).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} — ${j.text}`);
    L.push('');
  }

  const rising = a.terms.terms.filter((t) => t.rising).slice(0, 5);
  L.push('NE OLUYOR');
  if (rising.length) for (const t of rising) L.push(`• Yükselen başlık: “${t.term}” — ${fmt(t.y1)} hesap, önceki döneme göre ${fmt1(t.lift)} kat${t.isNew ? ' (yeni)' : ''}`);
  else L.push('• Belirgin biçimde yükselen yeni bir alt başlık saptanmadı; konuşma mevcut çerçevede sürüyor.');
  for (const c of a.cards.filter((c) => c.kind === 'risk')) L.push(`• Dikkat: ${c.title}`);
  L.push('');

  L.push('NEDEN ŞİMDİ / ZAMANLAMA');
  const mc = a.cards.find((c) => c.kind === 'momentum');
  L.push(`• ${mc ? `${mc.title} ${mc.action}` : 'Konu olağan seyrinde; acil bir zamanlama baskısı görünmüyor.'}`);
  if (a.content.bestHours.length) L.push(`• Bu konuda en yüksek etkileşim ${a.content.bestHours.map((h) => `${String(h.hour).padStart(2, '0')}:00`).join(', ')} saatlerinde gözlendi.`);
  L.push('');

  L.push('NE PAYLAŞMALI');
  if (rising.length) L.push(`• İçerik açısı önerisi: ${rising.slice(0, 3).map((t) => `“${t.term}”`).join(', ')} başlıklarına değinen bir paylaşım.`);
  for (const f of a.content.formats.filter((f) => f.lift >= 1.3).slice(0, 2)) L.push(`• Biçim: “${f.label}” içeren gönderiler yaklaşık ${fmt1(f.lift)} kat daha fazla etkileşim alıyor.`);
  const pinnedPosts = pins.filter((p) => p.kind === 'post' && p.post);
  const examples = pinnedPosts.length ? pinnedPosts.map((p) => ({ ...p.post, note: p.note })) : a.content.topPosts.slice(0, 2);
  if (examples.length) {
    L.push(pinnedPosts.length ? '• Seçtiğim örnek gönderiler:' : '• Öne çıkan örnek gönderiler:');
    for (const p of examples) L.push(`   – @${p.username}: “${String(p.text).replace(/\s+/g, ' ').slice(0, 140)}” (${fmt(p.engagement ?? 0)} etkileşim) ${link(p)}${p.note ? `\n     Not: ${p.note}` : ''}`);
  }
  L.push('');

  L.push('KİMLERLE TEMAS EDİLMELİ');
  const pinnedAcc = pins.filter((p) => p.kind === 'account');
  for (const p of pinnedAcc) L.push(`• @${p.ref_id}${p.note ? ` — ${p.note}` : ' — (seçtiğim hesap)'}`);
  const seen = new Set(pinnedAcc.map((p) => p.ref_id));
  for (const acc of [...a.accounts.early.slice(0, 3), ...a.accounts.bridges.slice(0, 4)]) {
    if (seen.has(acc.username)) continue; seen.add(acc.username);
    L.push(`• @${acc.username} (${fmt(acc.followers)} takipçi) — ${acc.reason}`);
  }
  if (!seen.size) L.push('• Bu dönem için öne çıkan bir temas önerisi yok.');
  L.push('');

  L.push('KİMLER PAYLAŞIRSA YAYILIR');
  const infl = a.accounts.influencers.filter((x) => !seen.has(x.username)).slice(0, 5);
  for (const acc of infl) L.push(`• @${acc.username} (${fmt(acc.followers)} takipçi) — ${acc.reason} · ${acc.tier}`);
  if (!infl.length) L.push('• Yeterli veri yok.');
  L.push('');

  L.push('NOTLARIM');
  const notes = pins.filter((p) => p.kind === 'note' || p.kind === 'term');
  for (const n of notes) L.push(`• ${n.kind === 'term' ? `“${n.ref_id}”${n.note ? `: ${n.note}` : ''}` : n.note}`);
  if (!notes.length) L.push('• ');
  L.push('');
  L.push(`Veri: X API · ${rangeLabel} · ${fmt(a.sample.n)} gönderilik örneklem (güven: ${a.sample.confidence}). Hacim rakamları X sayım verisidir; hesap ve içerik değerlendirmeleri örnekleme ve otomatik istatistiklere dayanır.`);
  return L.join('\n');
}
