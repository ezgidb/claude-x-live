// Bluesky: herkese açık searchPosts (anahtarsız). Hata olursa sessizce boş döner.
const API = 'https://public.api.bsky.app/xrpc';
const ms = (iso) => { const t = Date.parse(iso || ''); return Number.isFinite(t) ? t : null; };
// at://did/app.bsky.feed.post/rkey → 'bluesky:did/rkey'
function uriToId(uri) {
  const m = /^at:\/\/([^/]+)\/[^/]+\/([^/]+)$/.exec(uri || '');
  return m ? `bluesky:${m[1]}/${m[2]}` : null;
}

// searchPosts yanıtı → Item[]; followers: { did: sayı } (isteğe bağlı)
export function parseBlueskyResponse(json, client, followers = {}) {
  const out = [];
  for (const p of json?.posts || []) {
    const id = uriToId(p?.uri);
    if (!id) continue;
    const rec = p.record || {};
    const a = p.author || {};
    const rkey = id.split('/').pop();
    const et = String(p.embed?.$type || rec.embed?.$type || '');
    const quoted = rec.embed?.record?.uri || rec.embed?.record?.record?.uri || null;
    out.push({
      id, source: 'bluesky', url: `https://bsky.app/profile/${a.handle || a.did}/post/${rkey}`, text: rec.text || '',
      lang: (rec.langs && rec.langs[0]) || 'und', createdAt: ms(rec.createdAt) ?? ms(p.indexedAt) ?? 0,
      author: { id: `bluesky:${a.did || a.handle || ''}`, handle: a.handle || '', name: a.displayName || a.handle || '',
        followers: followers[a.did] ?? a.followersCount ?? 0, verified: a.verification?.verifiedStatus === 'valid', createdAt: ms(a.createdAt), kind: 'bilinmiyor' },
      metrics: { likes: p.likeCount ?? 0, reposts: p.repostCount ?? 0, replies: p.replyCount ?? 0, quotes: p.quoteCount ?? 0, views: 0 },
      refs: { replyTo: uriToId(rec.reply?.parent?.uri), quoteOf: uriToId(quoted), repostOf: null },
      media: /images|video|external/.test(et), clientId: client?.id ?? null, enr: null,
    });
  }
  return out;
}

export function createBlueskySource({ fetchImpl, maxTerms = 4 } = {}) {
  const src = {
    id: 'bluesky', label: 'Bluesky', lastError: null,
    async poll({ client, since, until } = {}) {
      const f = fetchImpl || globalThis.fetch;
      const byId = new Map();
      let err = null;
      const terms = [...new Set((client?.terms || []).map((t) => String(t || '').replace(/^@/, '').trim()).filter(Boolean))].slice(0, maxTerms);
      for (const term of terms) {
        try {
          const p = new URLSearchParams({ q: /\s/.test(term) ? `"${term}"` : term, limit: '100', sort: 'latest' });
          if (Number.isFinite(since)) p.set('since', new Date(since).toISOString());
          if (Number.isFinite(until)) p.set('until', new Date(until).toISOString());
          const res = await f(`${API}/app.bsky.feed.searchPosts?${p}`, { headers: { Accept: 'application/json' } });
          if (!res.ok) { err = `Bluesky araması yanıt vermedi (hata ${res.status}).`; continue; }
          for (const it of parseBlueskyResponse(await res.json(), client)) byId.set(it.id, it);
        } catch (e) { err = `Bluesky'a ulaşılamadı: ${e?.message || e}`; }
      }
      const items = [...byId.values()].filter((i) => (!Number.isFinite(since) || i.createdAt >= since) && (!Number.isFinite(until) || i.createdAt < until));
      // Takipçi sayıları arama yanıtında yok; yazarları toplu sor (olmazsa 0 kalır)
      try {
        const dids = [...new Set(items.map((i) => i.author.id.slice(8)).filter((d) => d.startsWith('did:')))].slice(0, 50);
        for (let i = 0; i < dids.length; i += 25) {
          const q = dids.slice(i, i + 25).map((d) => `actors=${encodeURIComponent(d)}`).join('&');
          const res = await f(`${API}/app.bsky.actor.getProfiles?${q}`, { headers: { Accept: 'application/json' } });
          if (!res.ok) break;
          const map = new Map(((await res.json())?.profiles || []).map((x) => [x.did, x.followersCount ?? 0]));
          for (const it of items) { const n = map.get(it.author.id.slice(8)); if (n != null) it.author.followers = n; }
        }
      } catch { /* takipçi bilgisi isteğe bağlı */ }
      src.lastError = err;
      return items;
    },
  };
  return src;
}
