// ANALİZ: saf fonksiyonlar. analyze -> Snapshot, diffEvents -> Event[].
import { buildContext } from './context.js';
import { buildPulse } from './pulse.js';
import { buildNarratives } from './narratives.js';
import { buildCoordination } from './coordination.js';
import { buildCascade } from './cascade.js';
import { buildActors } from './actors.js';
import { buildForecast } from './forecast.js';
import { buildStance, buildRisk, buildIncident } from './risk.js';
export { diffEvents } from './events.js';

export function analyze({ client, items, now, prev = null }) {
  const ctx = buildContext({ client, items, now });
  const pulse = buildPulse(ctx);
  const st = buildStance(ctx);
  const narrs = buildNarratives(ctx, prev);
  const coord = buildCoordination(ctx);
  const cas = buildCascade(ctx, narrs);
  const actors = buildActors(ctx, narrs, coord, cas);
  const forecast = buildForecast(ctx, pulse);
  const risk = buildRisk(ctx, { pulse, st, narrs, coord, forecast, prev });
  const incident = buildIncident(ctx, { pulse, risk, st, cas, prev });
  const sources = { x: 0, haber: 0, bluesky: 0 };
  for (const d of ctx.docs) if (d.it.source) sources[d.it.source] = (sources[d.it.source] || 0) + 1;
  delete pulse._;
  return {
    clientId: client?.id ?? null, at: now, pulse, stance: st.stance,
    narratives: narrs.map((n) => n.pub), actors, cascade: cas.cascade,
    coordination: coord.findings.map(({ _authors, _docs, ...f }) => f),
    forecast, risk, incident, sources,
    sample: { items: ctx.docs.length, enriched: ctx.enriched },
    brief: null, playbook: null,
  };
}
