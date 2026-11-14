import { alarmHit } from './analytics.js';

// Gözlem günlüğü: ardışık analiz anlık görüntülerini karşılaştırır, DEĞİŞEN şeyleri zaman damgalı not olarak üretir.
// Deterministiktir. Gürültüyü önlemek için: aşama değişiminde iki ardışık doğrulama, olay başına bekleme süresi,
// düşük hacim ve küçük örneklem kapıları, yenileme başına en çok 3 ve saatte en çok 12 not.

const MIN = 60_000; const HOUR = 3_600_000;
const fmt = (n) => Math.round(n).toLocaleString('tr-TR');
const fmt1 = (n) => n.toLocaleString('tr-TR', { maximumFractionDigits: 1 });
const tHM = (ms) => new Date(ms).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
const E = (p) => p.likes + 2 * p.reposts + 2 * p.quotes + 1.5 * p.replies;

export const LEVEL = { important: 1, info: 2, summary: 3 };
export const WATCHLIST_SIZE = 10;

// prev: önceki durum (ya da null). a: son 24 saatlik analiz. posts: Map(id -> gönderi). ctx: { hourMax7d }
// Dönen: { events: [...], state }
export function observe(prev, a, posts, ctx, now = Date.now()) {
  const m = a.momentum;
  const s = prev ? structuredClone(prev) : { stage: 'quiet', stageTs: now, pending: null, burstKey: null, speedV: 0, topAcc: {}, leader: null, terms: {}, watch: {}, hot: {}, cool: {}, hour: [], lastSummary: 0, inorganic: false };
  const first = !prev;
  const out = [];
  const sampleOK = a.sample.n >= 100;
  const lowVolume = a.kpi.total < 50;
  const sampleNote = `örneklem: ${fmt(a.sample.n)} gönderi · güven: ${a.sample.confidence}`;
  const cooled = (key, ms) => !s.cool[key] || now - s.cool[key] >= ms;
  const add = (ev, coolKey) => { out.push(ev); if (coolKey) s.cool[coolKey] = now; };
  const burstKey = m.burst ? String(Math.round(m.burst.start / (30 * MIN))) : null;
  const accRef = (u) => ({ ref_kind: 'account', ref_user: u });

  // --- ilk gözlem: durumu kur, tek bir açılış notu yaz ---
  if (first) {
    s.stage = m.stage; s.burstKey = burstKey; s.speedV = m.velocity;
    for (const r of a.accounts.influencers.slice(0, 10)) s.topAcc[r.username] = now;
    for (const t of a.terms.terms.filter((x) => x.rising)) s.terms[t.key] = now;
    for (const p of a.content.topPosts.slice(0, 3)) s.hot[p.id] = now;
    s.leader = a.accounts.influencers.find((r) => r.shareE >= 0.25)?.username ?? null;
    s.inorganic = a.accounts.inorganicShare >= 0.25;
    let text = `İzleme başladı. Konu şu an “${m.stageLabel}” aşamasında; son 24 saatte ${fmt(a.kpi.total)}, son 1 saatte ${fmt(a.kpi.perHour)} gönderi.`;
    if (m.burst?.active) text += ` Dalga ${tHM(m.burst.start)} dolaylarında başlamış görünüyor.`;
    add({ type: 'watch_started', level: LEVEL.info, cat: 'seyir', text, evidence: m.why });
  } else {
    // --- aşama değişimi (iki ardışık yenilemede doğrulanır) ---
    if (m.stage !== s.stage) {
      if (s.pending === m.stage) {
        const from = s.stage; s.stage = m.stage; s.stageTs = now; s.pending = null;
        if (cooled(`stage:${m.stage}`, 30 * MIN)) {
          const key = `stage:${m.stage}`;
          const ev = `${fmt(m.last30)} gönderi / 30 dk · önceki 30 dk: ${fmt(m.prev30)} · bu saat için olağan: ~${fmt(m.baseline30)}`;
          if (from === 'quiet' && (m.stage === 'emerging' || m.stage === 'accelerating') && !lowVolume) {
            add({ type: 'started', level: LEVEL.important, cat: 'seyir', text: `Konu hareketlenmeye başladı: son 30 dakikada ${fmt(m.last30)} gönderi görüldü (bu saat için olağan düzey ~${fmt(m.baseline30)}).`, evidence: ev }, key);
            s.speedV = m.velocity;
          } else if (m.stage === 'accelerating') {
            add({ type: 'stage', level: LEVEL.important, cat: 'seyir', text: `Konu hızlanıyor: son 30 dakikada ${fmt(m.last30)} gönderi, önceki 30 dakikanın ${fmt1(m.ratio)} katı.`, evidence: ev }, key);
            s.speedV = m.velocity;
          } else if (m.stage === 'peak') {
            add({ type: 'stage', level: LEVEL.important, cat: 'seyir', text: `Konu zirveye ulaşmış görünüyor: hacim dakikada ~${fmt1(m.velocity)} gönderi düzeyinde sabitlendi.`, evidence: ev }, key);
          } else if (m.stage === 'declining') {
            add({ type: 'stage', level: LEVEL.info, cat: 'seyir', text: `İlgi azalmaya başladı: son 30 dakikada ${fmt(m.last30)} gönderi (önceki 30 dakika: ${fmt(m.prev30)}).`, evidence: ev }, key);
          } else if (m.stage === 'emerging' && !lowVolume) {
            add({ type: 'stage', level: LEVEL.info, cat: 'seyir', text: `Konu yeniden hareketleniyor: son 30 dakikada ${fmt(m.last30)} gönderi.`, evidence: ev }, key);
          } else if (m.stage === 'quiet' && from !== 'quiet') {
            add({ type: 'cooled', level: LEVEL.info, cat: 'seyir', text: 'Dalga sona erdi; konu olağan seyrine döndü.', evidence: ev }, key);
            s.speedV = 0;
          }
        }
      } else s.pending = m.stage;
    } else s.pending = null;

    if (!lowVolume) {
      // --- hız basamağı ---
      if (s.speedV > 0 && m.velocity >= 1.5 * s.speedV && m.ratio >= 1.3 && s.stage !== 'quiet' && cooled('speed', 15 * MIN)) {
        add({ type: 'speed', level: LEVEL.info, cat: 'seyir', text: `Hız artmaya devam ediyor: dakikada ~${fmt1(m.velocity)} gönderi (önceki nottan bu yana ${fmt1(m.velocity / s.speedV)} kat).` }, 'speed');
        s.speedV = m.velocity;
      }
      // --- 7 günün rekoru ---
      if (ctx.hourMax7d > 0 && a.kpi.perHour > ctx.hourMax7d && cooled(`record:${burstKey ?? 'x'}`, 6 * HOUR)) {
        add({ type: 'record', level: LEVEL.info, cat: 'seyir', text: `Son 7 günün en yoğun saati yaşanıyor: son 1 saatte ${fmt(a.kpi.perHour)} gönderi (önceki en yüksek saat: ${fmt(ctx.hourMax7d)}).` }, `record:${burstKey ?? 'x'}`);
      }
      // --- dalga büyük ölçüde söndü ---
      if (m.burst && s.stage === 'declining' && m.velocity < 0.3 * m.burst.peakVelocity && cooled(`cooled:${burstKey}`, 12 * HOUR)) {
        add({ type: 'cooled', level: LEVEL.info, cat: 'seyir', text: `Dalga büyük ölçüde söndü: hız zirvedeki düzeyin %${fmt((m.velocity / m.burst.peakVelocity) * 100)}’ine indi.` }, `cooled:${burstKey}`);
      }
    }

    if (sampleOK && !lowVolume) {
      // --- öne çıkan hesaplara yeni giren ---
      let nAcc = 0;
      for (const r of a.accounts.influencers.slice(0, 10)) {
        const seen = s.topAcc[r.username];
        if (r.influence >= 0.8 && (!seen || now - seen > 6 * HOUR) && nAcc < 2) {
          nAcc++;
          add({ type: 'account', level: r.followers >= 100000 ? LEVEL.important : LEVEL.info, cat: 'hesap', text: `@${r.username} konunun öne çıkan hesapları arasına girdi (${fmt(r.followers)} takipçi; ${r.reason}).`, evidence: sampleNote, ...accRef(r.username) });
        }
        s.topAcc[r.username] = now;
      }
      // --- etkileşimin en büyük payı el değiştirdi ---
      const lead = [...a.accounts.influencers].sort((x, y) => y.shareE - x.shareE)[0];
      if (lead && lead.shareE >= 0.25 && lead.username !== s.leader && cooled('leader', 60 * MIN)) {
        add({ type: 'leader', level: LEVEL.info, cat: 'hesap', text: `Etkileşimin en büyük payı şu an @${lead.username} hesabında (örneklemdeki etkileşimin %${fmt(lead.shareE * 100)}’i).`, evidence: sampleNote, ...accRef(lead.username) }, 'leader');
        s.leader = lead.username;
      }
      // --- yeni alt başlık ---
      let nTerm = 0;
      for (const t of a.terms.terms.filter((x) => x.rising)) {
        if (s.terms[t.key] && now - s.terms[t.key] < 12 * HOUR) { continue; }
        s.terms[t.key] = now;
        if (nTerm >= 2) continue;
        nTerm++;
        const strong = t.zeta >= 4 || (t.hashtag && t.isNew && t.y1 >= 8);
        add({ type: 'term', level: strong ? LEVEL.important : LEVEL.info, cat: 'konu', text: `${t.hashtag ? 'Yeni etiket' : 'Yeni alt başlık'} belirdi: “${t.term}” (${fmt(t.y1)} hesap kullandı${t.y0 ? `, önceki döneme göre ${fmt1(t.lift)} kat` : ', daha önce görülmüyordu'}).`, evidence: sampleNote, ref_kind: 'term', ref_id: t.term });
      }
      // --- örneklem kalitesi ve tepki dili ---
      const inorg = a.accounts.inorganicShare >= 0.25;
      if (inorg && !s.inorganic && cooled('inorganic', 2 * HOUR)) add({ type: 'quality', level: LEVEL.important, cat: 'konu', text: `Dikkat: örneklemdeki gönderilerin %${fmt(a.accounts.inorganicShare * 100)}’i şüpheli ya da kopya içerikli hesaplardan geliyor; organik ilgi göründüğünden düşük olabilir.`, evidence: sampleNote }, 'inorganic');
      s.inorganic = inorg;
      const r = a.content.reaction;
      if (r.nNow >= 30 && r.alarmNow >= 0.1 && r.alarmNow >= 2 * r.alarmBefore && cooled('reaction', 2 * HOUR)) add({ type: 'reaction', level: LEVEL.important, cat: 'konu', text: `Tepki dili artıyor: son 2 saatteki gönderilerin %${fmt(r.alarmNow * 100)}’inde tepki ifadeleri geçiyor (öncesinde %${fmt(r.alarmBefore * 100)}).`, evidence: sampleNote }, 'reaction');
    }

    // --- izlenen gönderilerde etkileşim tırmanışı (yeniden okunan gönderiler) ---
    for (const [id, w] of Object.entries(s.watch)) {
      const p = posts.get(id); if (!p) continue;
      const e = E(p);
      if (e === w.E) continue;
      const dt = Math.max(1, (now - w.ts) / MIN); const dE = e - w.E;
      if (dE >= 30 && e / Math.max(1, w.E) >= 1.5 && dE / dt >= 2 && cooled(`post:${id}`, 30 * MIN) && (!w.logged || e >= 2 * w.logged)) {
        add({ type: 'post_climbing', level: e >= 500 ? LEVEL.important : LEVEL.info, cat: 'gonderi', text: `@${p.username ?? '?'} hesabının gönderisi hızla etkileşim topluyor: ${fmt(w.E)} → ${fmt(e)} (${fmt(dt)} dakikada).`, evidence: String(p.text ?? '').replace(/\s+/g, ' ').slice(0, 140), ref_kind: 'post', ref_id: id, ref_user: p.username }, `post:${id}`);
        w.logged = e;
      }
      w.E = e; w.ts = now;
    }
    // --- yeni öne çıkan gönderi ---
    if (!lowVolume) {
      const hot = a.content.topPosts.slice(0, 3).find((p) => !s.hot[p.id] && now - p.created_at < 2 * HOUR && p.engagement >= 50);
      if (hot) {
        s.hot[hot.id] = now;
        add({ type: 'hot_post', level: LEVEL.info, cat: 'gonderi', text: `Yeni bir gönderi öne çıkıyor: @${hot.username ?? '?'} (${fmt(hot.engagement)} etkileşim, ${fmt((now - hot.created_at) / MIN)} dakika önce paylaşıldı).`, evidence: String(hot.text ?? '').replace(/\s+/g, ' ').slice(0, 140), ref_kind: 'post', ref_id: hot.id, ref_user: hot.username });
      }
    }
  }

  // --- izleme listesi: en sıcak, 6 saatten genç gönderiler ---
  const next = {};
  for (const p of a.content.topPosts.filter((x) => now - x.created_at < 6 * HOUR).slice(0, WATCHLIST_SIZE)) next[p.id] = s.watch[p.id] ?? { E: p.engagement, ts: now, logged: 0 };
  s.watch = next;

  // --- gürültü sınırı: yenileme başına 3, saatte 12; önemliler önce ---
  s.hour = s.hour.filter((t) => now - t < HOUR);
  out.sort((x, y) => x.level - y.level);
  const events = out.slice(0, Math.max(0, Math.min(3, 12 - s.hour.length)));
  for (let i = 0; i < events.length; i++) s.hour.push(now);

  // --- saatlik durum özeti (sınıra dahil değil) ---
  if (!first && (s.stage !== 'quiet' || m.score >= 40) && now - s.lastSummary >= HOUR && now - s.stageTs >= 0) {
    if (s.lastSummary) {
      const term = a.terms.terms.find((t) => t.rising);
      const accs = a.accounts.influencers.slice(0, 2).map((r) => '@' + r.username);
      let text = `Durum özeti: konu “${m.stageLabel}” aşamasında; son 1 saatte ${fmt(a.kpi.perHour)} gönderi, ivme ${m.score}/100.`;
      if (term) text += ` Öne çıkan alt başlık: “${term.term}”.`;
      if (accs.length && sampleOK) text += ` Öne çıkan hesaplar: ${accs.join(', ')}.`;
      if (m.projection && m.last30 >= 10) text += ` Önümüzdeki saat için beklenti: ${fmt(m.projection.low)}–${fmt(m.projection.high)} gönderi.`;
      events.push({ type: 'summary', level: LEVEL.summary, cat: 'ozet', text });
    }
    s.lastSummary = now;
  }
  // eski kayıtları buda
  for (const k of Object.keys(s.cool)) if (now - s.cool[k] > 24 * HOUR) delete s.cool[k];
  for (const k of Object.keys(s.terms)) if (now - s.terms[k] > 12 * HOUR) delete s.terms[k];
  for (const k of Object.keys(s.topAcc)) if (now - s.topAcc[k] > 6 * HOUR) delete s.topAcc[k];
  for (const k of Object.keys(s.hot)) if (now - s.hot[k] > 24 * HOUR) delete s.hot[k];
  return { events, state: s };
}

// Geçmişe dönük seyir: bir inceleme tamamlandığında, olayın nasıl geliştiğini zaman damgalı notlarla yeniden kurar.
// a: inceleme aralığının analizi. posts: aralıktaki gönderiler (username, followers eklenmiş). inv: inceleme kaydı.
export function retrospect(a, posts, inv, now = Date.now(), threads = []) {
  const m = a.momentum; const out = [];
  const add = (ts, level, cat, type, text, extra = {}) => out.push({ ts: Math.min(ts, now), level, cat, type, text, past: true, ...extra });
  const own = posts.filter((p) => p.kind !== 'repost' && p.created_at >= inv.plan.from).sort((x, y) => x.created_at - y.created_at);
  const snippet = (p) => String(p.text ?? '').replace(/\s+/g, ' ').slice(0, 140);
  const postRef = (p) => ({ ref_kind: 'post', ref_id: p.id, ref_user: p.username, evidence: snippet(p) });
  const cover = `okunan: ${fmt(a.sample.n)} gönderi · dönem toplamı: ${fmt(a.kpi.total)} (yeniden paylaşımlar dahil)`;
  const wave = inv.plan.wave;
  if (!wave) {
    add(now, LEVEL.info, 'seyir', 'retro_none', `İnceleme tamamlandı: bu dönemde belirgin bir dalga saptanmadı; hacim olağan seyrinde.`, { evidence: cover });
    return out;
  }
  const t0 = wave.start;
  add(t0, LEVEL.important, 'seyir', 'retro_start', 'Konu bu sıralarda hareketlenmeye başladı.', { evidence: inv.plan.facts.slice(0, 2).join(' ') });
  // dalganın başındaki ilk paylaşımlar (başlangıç evresi eksiksiz okunduysa güvenilirdir)
  const onset = inv.plan.segments.find((s) => s.key === 'onset');
  const early = own.filter((p) => p.kind !== 'reply' && p.created_at >= t0 - 30 * MIN && p.created_at <= t0 + 30 * MIN);
  if (early.length) {
    const firsts = []; for (const p of early) { if (!firsts.some((q) => q.username === p.username)) firsts.push(p); if (firsts.length >= 4) break; }
    add(firsts[0].created_at, LEVEL.important, 'hesap', 'retro_first', `Dalganın başındaki ilk paylaşımlar: ${firsts.map((p) => `@${p.username} (${fmt(p.followers ?? 0)} takipçi)`).join(', ')}.`,
      { evidence: onset?.take === 'full' ? 'Başlangıç evresi eksiksiz okundu.' : 'Başlangıç evresi örneklemle okundu; daha erken paylaşımlar olabilir.', ref_kind: 'account', ref_user: firsts[0].username });
  }
  const firstNames = new Set(out.filter((e) => e.type === 'retro_first').flatMap((e) => [...e.text.matchAll(/@(\w+)/g)].map((x) => x[1])));
  // erken dönemin en çok etkileşim alan gönderisi
  const upTo = Math.max(wave.peakTs, t0 + 30 * MIN);
  const spark = own.filter((p) => p.created_at >= t0 - 60 * MIN && p.created_at <= upTo).sort((x, y) => E(y) - E(x))[0];
  if (spark && E(spark) >= 30) add(spark.created_at, LEVEL.important, 'gonderi', 'retro_spark', `@${spark.username} hesabının bu gönderisi, yükseliş döneminde en çok etkileşim alan paylaşım (${fmt(E(spark))} etkileşim).`, postRef(spark));
  // büyük hesapların konuya girişi
  const seen = new Set(); let big = 0;
  for (const p of own) {
    if (p.created_at < t0 - 30 * MIN || seen.has(p.username) || (p.followers ?? 0) < 100000 || firstNames.has(p.username)) continue;
    seen.add(p.username);
    if (big++ < 3) add(p.created_at, LEVEL.info, 'hesap', 'retro_big', `Büyük bir hesap konuya girdi: @${p.username} (${fmt(p.followers)} takipçi).`, postRef(p));
  }
  // hız basamakları
  const stepMin = a.stepMs / MIN; const base = Math.max(0.2, m.baseline30 / 30);
  const marks = [];
  for (const k of [3, 10, 30]) { const hit = a.series.find((s) => s.ts >= t0 - 15 * MIN && s.n / stepMin >= k * base); if (hit) marks.push([k, hit]); }
  for (const [k, hit] of marks.slice(-2)) add(hit.ts + a.stepMs, LEVEL.info, 'seyir', 'retro_speed', `Hız, bu saat için olağan düzeyin ${k} katını aştı (dakikada ~${fmt1(hit.n / stepMin)} gönderi).`);
  if (wave.peakTs < now - 20 * MIN) add(wave.peakTs, LEVEL.important, 'seyir', 'retro_peak', `En yoğun an: 5 dakikada ${fmt(wave.peakN)} gönderi.`);
  // anahtar gönderilerin yanıt zincirleri
  for (const t of [...threads].sort((x, y) => y.root.replies - x.root.replies).slice(0, 8)) {
    if (!t.replies.length) continue;
    const best = [...t.replies].sort((x, y) => E(y) - E(x));
    const byUser = new Map(); for (const r of t.replies) byUser.set(r.username, (byUser.get(r.username) ?? 0) + E(r) + 1);
    const names = [...byUser].sort((x, y) => y[1] - x[1]).slice(0, 3).map((x) => '@' + x[0]);
    const alarm = t.replies.filter((r) => alarmHit(r.text)).length / t.replies.length;
    let text = `@${t.root.username} hesabının gönderisine gelen yanıtlar okundu (${fmt(t.replies.length)} / ${fmt(Math.max(t.root.replies, t.replies.length))} yanıt).`;
    if (E(best[0]) >= 5) text += ` En çok etkileşim alan yanıt: @${best[0].username} — “${snippet(best[0]).slice(0, 110)}” (${fmt(E(best[0]))} etkileşim).`;
    text += ` Yanıtlarda öne çıkan hesaplar: ${names.join(', ')}.`;
    if (t.replies.length >= 10 && alarm >= 0.15) text += ` Yanıtların %${fmt(alarm * 100)}’inde tepki ifadeleri geçiyor.`;
    add(t.root.created_at + 1000, LEVEL.info, 'gonderi', 'retro_thread', text, { ...postRef(t.root), evidence: `Kök gönderi: ${snippet(t.root)}` });
  }
  const terms = a.terms.terms.filter((t) => t.rising).slice(0, 4);
  if (terms.length) add(now - 1000, LEVEL.info, 'konu', 'retro_terms', `Son dönemde öne çıkan alt başlıklar: ${terms.map((t) => `“${t.term}”`).join(', ')}.`, { evidence: `örneklem: ${fmt(a.sample.n)} gönderi · güven: ${a.sample.confidence}` });
  add(now, LEVEL.info, 'seyir', 'retro_done', `İnceleme tamamlandı. Konu şu an “${m.stageLabel}” aşamasında; son 1 saatte ${fmt(a.kpi.perHour)} gönderi.`, { evidence: cover, past: false });
  return out.sort((x, y) => x.ts - y.ts);
}
