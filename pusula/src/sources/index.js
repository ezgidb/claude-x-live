// Kaynak fabrikası: demo modunda tek kaynak (simülasyon), canlı modda X + haber + Bluesky.
import { createSimulator, demoClients } from './simulator.js';
import { createXSource } from './x.js';
import { createHaberSource } from './haber.js';
import { createBlueskySource } from './bluesky.js';

export function createSources({ mode = 'demo', store, xToken, anchor, fetchImpl, seed } = {}) {
  if (mode === 'demo') return [createSimulator({ anchor, seed })];
  return [createXSource({ token: xToken, store, fetchImpl }), createHaberSource({ fetchImpl }), createBlueskySource({ fetchImpl })];
}
export { createSimulator, demoClients, createXSource, createHaberSource, createBlueskySource };
