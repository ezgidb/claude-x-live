// Pusula'yı başlatır: motor + sunucu.
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEngine } from './engine.js';
import { createServer } from './server.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4400);
const settingsFile = process.env.PUSULA_DB || join(root, 'data', 'pusula.db');
mkdirSync(dirname(settingsFile), { recursive: true });

const engine = createEngine({ settingsFile, mode: process.env.PUSULA_MODE, speed: Number(process.env.PUSULA_SPEED || 60) });
const app = createServer(engine, { port, host: process.env.HOST || '127.0.0.1', publicDir: join(root, 'public') });

await app.listen();
console.log(`Pusula hazırlanıyor… http://localhost:${port}`);
await engine.start();
const s = engine.status();
console.log(`Pusula çalışıyor — mod: ${s.mode === 'demo' ? 'DEMO (uydurma veri)' : 'canlı'}, yorum: ${s.ai === 'claude' ? 'Claude' : 'yerel'}`);

for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { engine.stop(); app.close(); process.exit(0); });
