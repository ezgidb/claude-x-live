// Yerel zenginleştirme: sözlük + kalıp tabanlı duruş, duygu, iddia, çağrı ve anlatı eşleştirme.
import * as L from './lexicon.js';

function hits(rx, text) {
  rx.lastIndex = 0;
  return [...text.matchAll(rx)];
}

// Metindeki işaretleri puanla (danışana karşı duruş için ham sinyaller).
export function signals(rawText) {
  const text = L.norm(rawText);
  let neg = 0, pos = 0, negStrong = 0;

  for (const m of hits(L.NEG_STRONG, text)) { neg += 2; negStrong++; }
  for (const m of hits(L.NEG_WEAK, text)) {
    const after = text.slice(m.index + m[0].length);
    if (L.RESOLVE_AFTER.test(after)) pos += 1;      // "sorun yok", "kötü değil", "sorunumu çözdüler"
    else neg += 1;
  }
  neg += Math.min(2, (text.match(L.NEG_EMOJI) || []).length);

  let posWords = 0;
  for (const [rx, w] of [[L.POS_STRONG, 2], [L.POS_WEAK, 1]]) {
    for (const m of hits(rx, text)) {
      const after = text.slice(m.index + m[0].length);
      if (L.NEGATOR_AFTER.test(after)) neg += w;     // "memnun değilim", "tavsiye etmem"
      else { pos += w; posWords++; }
    }
  }
  pos += Math.min(2, (text.match(L.POS_EMOJI) || []).length);

  const defense = hits(L.DEFENSE, text).length;

  // Alay ipuçları
  const ironicPraise = hits(L.IRONIC_PRAISE, text).length;
  const ironyWords = Math.min(2, hits(L.IRONY_WORDS, text).length);
  const laugh = L.LAUGH_EMOJI.test(text) || L.LAUGH_TEXT.test(text);
  const sneer = L.SNEER_EMOJI.test(text);
  const clown = L.CLOWN_EMOJI.test(text);
  const bang = L.BANG.test(text);
  let quotedPraise = false;
  L.QUOTED.lastIndex = 0;
  for (const m of text.matchAll(L.QUOTED)) {
    const q = m[1] || m[2];
    L.POS_STRONG.lastIndex = 0; L.POS_WEAK.lastIndex = 0;
    if (L.POS_STRONG.test(q) || L.POS_WEAK.test(q) || /(?<![\p{L}])(kalite|güven|hijyen|doğal|taze|özen|konfor|dakik)/u.test(q)) quotedPraise = true;
  }

  const question = text.includes('?') || L.Q_PARTICLE.test(text);
  L.Q_WORD.lastIndex = 0;
  const qWord = L.Q_WORD.test(text);
  const exclaim = (text.match(/!/g) || []).length;
  const letters = String(rawText || '').replace(/[^\p{L}]/gu, '');
  const upper = letters.replace(/[^\p{Lu}]/gu, '').length;
  const shout = letters.length >= 12 && upper / letters.length > 0.6;

  return { text, neg, pos, posWords, negStrong, defense, ironicPraise, ironyWords, laugh, sneer, clown, bang, quotedPraise,
    question, qWord, exclaim, shout };
}

export function classifyStance(s) {
  // Alay: övgü görünümlü söz + olumsuz bağlam, tırnak içi övgü, (!), gülme + olumsuz
  let sarc = 0;
  if (s.clown) sarc += 2;
  if (s.bang) sarc += 2;
  if (s.quotedPraise) sarc += 2;
  if (s.ironicPraise && (s.neg >= 1 || s.ironyWords >= 1)) sarc += 2;
  if (s.laugh) sarc += 1;
  if (s.sneer) sarc += 1;
  sarc += s.ironyWords;
  const negCtx = s.neg >= 1 || s.quotedPraise || s.bang || s.clown || (s.ironyWords >= 1 && (s.ironicPraise || s.laugh));
  const pureJoy = s.pos >= 2 && s.neg === 0 && s.ironyWords === 0 && !s.quotedPraise && !s.bang && !s.clown;
  if (!pureJoy && !s.defense && ((sarc >= 2 && negCtx) || (sarc >= 3))) return 'alay';

  if (s.defense && s.pos + 2 * s.defense >= s.neg - 1 && !s.question) return 'destek';
  if (s.defense && s.question && s.neg < 2) return 'soru';

  if (s.question && s.negStrong === 0 && s.neg <= 1 && s.pos < 2) return 'soru';
  if (s.neg > s.pos) return 'elestiri';
  if (s.pos > s.neg) return 'destek';
  if (s.neg >= 2) return 'elestiri';
  if (s.question) return 'soru';
  return 'notr';
}

function classifyEmotion(s, stance) {
  L.WORRY.lastIndex = 0; L.SAD.lastIndex = 0;
  const worry = L.WORRY.test(s.text);
  const sad = L.SAD.test(s.text) || L.SAD_EMOJI.test(s.text);
  if (stance === 'alay') return 'alay';
  if (stance === 'destek') return s.defense && s.posWords === 0 ? 'nötr' : 'sevinç';
  if (stance === 'soru') return worry ? 'kaygı' : 'nötr';
  if (stance === 'elestiri') {
    if (worry && s.negStrong < 2 && !s.shout) return 'kaygı';
    if (sad && s.negStrong === 0) return 'üzüntü';
    return 'öfke';
  }
  return worry ? 'kaygı' : 'nötr';
}

// --- Anlatı eşleştirme ---
function stemKey(tok) {
  return tok.length <= 5 ? tok : tok.slice(0, 5);
}

function clientStop(client) {
  const set = new Set();
  for (const t of [client?.name, ...(client?.terms || [])]) for (const k of L.tokens(t)) set.add(stemKey(k));
  return set;
}

function narrativeKeys(n, stop) {
  const keys = new Set();
  for (const src of [n.label, ...(n.terms || [])]) {
    for (const t of L.tokens(src)) {
      if (t.length < 3 || L.STOP.has(t)) continue;
      const k = stemKey(t);
      if (!stop.has(k)) keys.add(k);
    }
  }
  return [...keys];
}

export function buildNarrativeMatcher(narratives, client) {
  const stop = clientStop(client);
  const list = (narratives || []).filter((n) => n && n.label).map((n) => ({ label: n.label, keys: narrativeKeys(n, stop) }))
    .filter((n) => n.keys.length);
  return (text) => {
    const toks = L.tokens(text);
    const squashed = toks.join('');
    let best = null, bestScore = 0;
    for (const n of list) {
      let m = 0;
      for (const k of n.keys) {
        if (toks.some((t) => t.startsWith(k)) || (k.length >= 5 && squashed.includes(k))) m++;
      }
      const total = Math.min(n.keys.length, 5);     // uzun terim listeleri eşiği şişirmesin
      const ratio = m / total;
      const ok = (m >= 2 && ratio >= 0.4) || (m >= 1 && n.keys.length <= 2 && ratio >= 0.5);
      const score = m + ratio;
      if (ok && score > bestScore) { best = n.label; bestScore = score; }
    }
    return best;
  };
}

export function enrichOne(item, matchNarrative) {
  const s = signals(item.text);
  const stance = classifyStance(s);
  L.CTA.lastIndex = 0; L.CLAIM.lastIndex = 0;
  const callToAction = L.CTA.test(s.text) || /#\p{L}*boykot/u.test(s.text);
  const claim = stance !== 'soru' && L.CLAIM.test(s.text) && !(stance === 'alay' && !/(çıktı|buldum|gördüm|video|saat)/.test(s.text));
  return {
    id: item.id,
    stance,
    emotion: classifyEmotion(s, stance),
    narrative: matchNarrative ? matchNarrative(item.text) : null,
    claim: !!claim,
    callToAction: !!callToAction,
    by: 'yerel',
  };
}

export function enrichLocal(items, { client, narratives } = {}) {
  const match = buildNarrativeMatcher(narratives, client);
  return (items || []).map((it) => enrichOne(it, match));
}
