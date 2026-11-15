// Claude Messages API için ham fetch istemcisi (SDK yok). Hata durumunda fırlatır; çağıran yerel yönteme düşer.
const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2026-10-21';
const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

export const DEFAULT_MODELS = { fast: 'claude-haiku-5-5', deep: 'claude-opus-5-5' };

// Güvenlik sınıflandırıcısı reddederse sunucu tarafında yedek modele geçişi destekleyen modeller.
const supportsFallback = (m) => /^claude-(fable-5-[12]|mythos-5-[12]|opus-5(-5)?$|sonnet-5-5)/.test(m);
// effort parametresini kabul eden modeller (eski Haiku / Sonnet 4.5 kabul etmez).
const supportsEffort = (m) => !/(haiku-4|sonnet-4-5|opus-4-[01]$|claude-3)/.test(m);

// Model çıktısından JSON'u sağlam biçimde ayıkla (kod çiti, baştaki/sondaki söz).
export function parseJsonLoose(text) {
  const t = String(text || '').trim();
  try { return JSON.parse(t); } catch { /* devam */ }
  const fenced = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) { try { return JSON.parse(fenced[1].trim()); } catch { /* devam */ } }
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch { /* devam */ } }
  throw new Error('Yanıt JSON olarak ayrıştırılamadı');
}

export function createClaude({ apiKey, fetchImpl, timeoutMs = 120000 }) {
  const doFetch = fetchImpl || globalThis.fetch;
  const usage = { calls: 0, inputTokens: 0, outputTokens: 0 };

  // system: sabit metin (önbelleğe alınır); messages: [{role, content}]; schema: verilirse yapılandırılmış JSON çıktı.
  async function call({ model, system, messages, schema, maxTokens = 16000, effort, timeout = timeoutMs }) {
    const body = {
      model,
      max_tokens: maxTokens,
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages,
    };
    const oc = {};
    if (effort && supportsEffort(model)) oc.effort = effort;
    if (schema) oc.format = { type: 'json_schema', schema };
    if (Object.keys(oc).length) body.output_config = oc;
    const headers = { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': API_VERSION };
    if (supportsFallback(model)) { headers['anthropic-beta'] = FALLBACK_BETA; body.fallbacks = 'default'; }

    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(new Error('zaman aşımı')), timeout);
    usage.calls++;
    let data;
    try {
      const res = await doFetch(API_URL, { method: 'POST', headers, body: JSON.stringify(body), signal: ctl.signal });
      if (!res.ok) {
        let detail = '';
        try { detail = (await res.text()).slice(0, 300); } catch { /* yok say */ }
        throw new Error(`Claude API ${res.status}: ${detail}`);
      }
      data = await res.json();
    } finally {
      clearTimeout(timer);
    }
    const u = data?.usage || {};
    usage.inputTokens += (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
    usage.outputTokens += u.output_tokens || 0;
    if (data?.stop_reason === 'refusal') throw new Error('Model yanıtı reddetti');
    if (data?.stop_reason === 'max_tokens') throw new Error('Yanıt yarıda kesildi (max_tokens)');
    const text = (data?.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
    if (!text) throw new Error('Boş yanıt');
    return schema ? { text, json: parseJsonLoose(text) } : { text };
  }

  return { call, usage: () => ({ ...usage }) };
}
