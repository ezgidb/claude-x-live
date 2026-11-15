// ZEKÂ: createAI — Claude modu (anahtar varsa) ya da yerel mod. Hiçbir yöntem fırlatmaz;
// Claude çağrısı başarısız olursa o çağrı için yerel yönteme düşülür.
import { createClaude, DEFAULT_MODELS } from './claude.js';
import * as P from './prompts.js';
import { enrichLocal } from './local-enrich.js';
import { nameNarrativesLocal } from './local-names.js';
import { briefLocal } from './local-brief.js';
import { playbookLocal } from './local-playbook.js';
import { askLocal } from './local-ask.js';

const ENRICH_BATCH = 50;       // çağrı başına gönderi
const ENRICH_PARALLEL = 3;

const isStr = (x) => typeof x === 'string' && x.trim().length > 0;

function cleanEnrichment(row, fallback) {
  if (!row || typeof row !== 'object') return fallback;
  if (!P.STANCES.includes(row.stance)) return fallback;
  const narrative = isStr(row.narrative) ? row.narrative.trim().slice(0, 80) : null;
  return {
    id: fallback.id,
    stance: row.stance,
    emotion: P.EMOTIONS.includes(row.emotion) ? row.emotion : fallback.emotion,
    narrative: narrative ?? fallback.narrative,
    claim: typeof row.claim === 'boolean' ? row.claim : fallback.claim,
    callToAction: typeof row.callToAction === 'boolean' ? row.callToAction : fallback.callToAction,
    by: 'claude',
  };
}

function historyMessages(history) {
  const out = [];
  for (const h of (history || []).slice(-8)) {
    if (!h) continue;
    if (h.role && isStr(h.content)) out.push({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content });
    else {
      if (isStr(h.q || h.question)) out.push({ role: 'user', content: h.q || h.question });
      if (isStr(h.a || h.answer)) out.push({ role: 'assistant', content: h.a || h.answer });
    }
  }
  return out;
}

export function createAI({ apiKey, models, fetchImpl } = {}) {
  const env = (typeof process !== 'undefined' && process.env) || {};
  const model = {
    fast: models?.fast || env.PUSULA_MODEL_FAST || DEFAULT_MODELS.fast,
    deep: models?.deep || env.PUSULA_MODEL_DEEP || DEFAULT_MODELS.deep,
  };
  const claude = apiKey ? createClaude({ apiKey, fetchImpl }) : null;
  const mode = claude ? 'claude' : 'yerel';
  let lastError = null;
  const failed = (e) => { lastError = String(e?.message || e); };

  async function enrich(items, { client, narratives } = {}) {
    items = items || [];
    const local = enrichLocal(items, { client, narratives });
    if (!claude || !items.length) return local;
    const system = P.enrichSystem(client);
    const out = local.slice();
    const chunks = [];
    for (let i = 0; i < items.length; i += ENRICH_BATCH) chunks.push([i, items.slice(i, i + ENRICH_BATCH)]);
    const known = (narratives || []).slice();
    const run = async ([start, chunk]) => {
      try {
        const { json } = await claude.call({ model: model.fast, system, schema: P.ENRICH_SCHEMA, effort: 'low', timeout: 90000,
          messages: [{ role: 'user', content: P.enrichUser(chunk, known) }] });
        const rows = Array.isArray(json?.items) ? json.items : Array.isArray(json) ? json : null;
        if (!rows) throw new Error('Beklenen "items" dizisi yok');
        const byId = new Map(rows.map((r) => [String(r?.id), r]));
        chunk.forEach((it, k) => { out[start + k] = cleanEnrichment(byId.get(String(it.id)), local[start + k]); });
        // Yeni etiketleri sonraki partilere de bildir ki aynı konu aynı adı alsın.
        for (const r of rows) if (isStr(r?.narrative) && !known.some((n) => n.label === r.narrative)) known.push({ label: r.narrative });
      } catch (e) { failed(e); }   // bu parti yerel sonuçla kalır
    };
    for (let i = 0; i < chunks.length; i += ENRICH_PARALLEL) await Promise.all(chunks.slice(i, i + ENRICH_PARALLEL).map(run));
    return out;
  }

  async function nameNarratives(narratives, { client } = {}) {
    narratives = narratives || [];
    const local = nameNarrativesLocal(narratives, { client });
    if (!claude || !narratives.length) return local;
    try {
      const { json } = await claude.call({ model: model.fast, system: P.namesSystem(client), schema: P.NAMES_SCHEMA, effort: 'low', timeout: 60000,
        messages: [{ role: 'user', content: P.namesUser(narratives) }] });
      const byId = new Map((json?.narratives || []).map((r) => [String(r?.id), r]));
      return local.map((l) => {
        const r = byId.get(String(l.id));
        return r && isStr(r.label) ? { id: l.id, label: r.label.trim().slice(0, 80), summary: isStr(r.summary) ? r.summary.trim() : l.summary } : l;
      });
    } catch (e) { failed(e); return local; }
  }

  async function brief({ client, snapshot, items } = {}) {
    const local = () => briefLocal({ client, snapshot, items });
    if (!claude) return local();
    try {
      const { json } = await claude.call({ model: model.deep, system: P.briefSystem(client), schema: P.BRIEF_SCHEMA, effort: 'high', timeout: 180000,
        messages: [{ role: 'user', content: `${P.situationUser({ snapshot, items })}\n\nBu veriye dayanarak durum notunu yaz.` }] });
      const keys = ['headline', 'whatHappened', 'howItGrew', 'whoStarted', 'whoAmplified', 'whereNow', 'meaning', 'basisNote'];
      if (!json || !keys.every((k) => isStr(json[k]))) throw new Error('Durum notu alanları eksik');
      const out = { at: snapshot.at, by: 'claude' };
      for (const k of keys) out[k] = json[k].trim();
      out.watchNext = Array.isArray(json.watchNext) ? json.watchNext.filter(isStr).slice(0, 6) : [];
      out.confidence = P.CONFIDENCES.includes(json.confidence) ? json.confidence : local().confidence;
      return out;
    } catch (e) { failed(e); return local(); }
  }

  async function playbook({ client, snapshot, brief: b, items } = {}) {
    const local = () => playbookLocal({ client, snapshot, brief: b, items });
    if (!claude) return local();
    try {
      const { json } = await claude.call({ model: model.deep, system: P.playbookSystem(client), schema: P.PLAYBOOK_SCHEMA, effort: 'high', timeout: 180000,
        messages: [{ role: 'user', content: `${P.situationUser({ snapshot, items, brief: b })}\n\nBu veriye dayanarak yanıt planını yaz.` }] });
      if (!json || !P.POSTURES.includes(json.posture) || !isStr(json.rationale) || !isStr(json.holdingStatement)) throw new Error('Yanıt planı alanları eksik');
      const options = (Array.isArray(json.options) ? json.options : [])
        .filter((o) => o && isStr(o.name) && isStr(o.draft))
        .map((o) => ({ name: o.name, when: o.when || '', upside: o.upside || '', risk: o.risk || '', draft: o.draft }));
      if (!options.length) throw new Error('Yanıt planında seçenek yok');
      const n = Number(json.nextCheckMin);
      return {
        at: snapshot.at, by: 'claude', posture: json.posture, rationale: json.rationale.trim(), options,
        doNot: Array.isArray(json.doNot) ? json.doNot.filter(isStr) : [],
        holdingStatement: json.holdingStatement.trim(),
        qna: (Array.isArray(json.qna) ? json.qna : []).filter((x) => x && isStr(x.q) && isStr(x.a)).map((x) => ({ q: x.q, a: x.a })),
        nextCheckMin: Number.isFinite(n) && n > 0 ? Math.round(Math.min(n, 1440)) : local().nextCheckMin,
      };
    } catch (e) { failed(e); return local(); }
  }

  async function ask({ client, snapshot, items, question, history } = {}) {
    const local = () => {
      try { return askLocal({ client, snapshot, items, question }); }
      catch { return 'Bu soruyu şu an yanıtlayamıyorum; birazdan yeniden deneyin.'; }
    };
    if (!claude || !snapshot) return local();
    try {
      const context = P.situationUser({ snapshot, items, brief: snapshot.brief, playbook: snapshot.playbook });
      const { text } = await claude.call({ model: model.deep, system: P.askSystem(client), effort: 'medium', timeout: 120000,
        messages: [{ role: 'user', content: `Güncel veri:\n${context}` }, ...historyMessages(history), { role: 'user', content: `Soru: ${question}` }] });
      return text;
    } catch (e) { failed(e); return local(); }
  }

  // Yerel yöntemler de beklenmedik veride fırlatmasın.
  const safe = (fn, fallback) => async (...args) => {
    try { return await fn(...args); } catch (e) { failed(e); return fallback(...args); }
  };

  return {
    mode,
    models: model,
    enrich: safe(enrich, (items) => (items || []).map((it) => ({ id: it.id, stance: 'notr', emotion: 'nötr', narrative: null, claim: false, callToAction: false, by: 'yerel' }))),
    nameNarratives: safe(nameNarratives, (ns) => (ns || []).map((n) => ({ id: n.id, label: n.label || 'Adlandırılamayan konu', summary: '' }))),
    brief: safe(brief, ({ snapshot } = {}) => ({ at: snapshot?.at, by: 'yerel', headline: 'Durum notu üretilemedi', whatHappened: '', howItGrew: '', whoStarted: '', whoAmplified: '', whereNow: '', meaning: '', watchNext: [], confidence: 'düşük', basisNote: 'Not üretilirken bir hata oluştu; veriler panelden izlenebilir.' })),
    playbook: safe(playbook, ({ snapshot } = {}) => ({ at: snapshot?.at, by: 'yerel', posture: 'izle', rationale: 'Yanıt planı üretilemedi; durum panelden izlenmeli.', options: [], doNot: [], holdingStatement: '', qna: [], nextCheckMin: 30 })),
    ask: safe(ask, () => 'Bu soruyu şu an yanıtlayamıyorum; birazdan yeniden deneyin.'),
    usage: () => (claude ? claude.usage() : { calls: 0, inputTokens: 0, outputTokens: 0 }),
    lastError: () => lastError,
  };
}
