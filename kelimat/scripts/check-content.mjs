// Validates src/data/scenarios.json and reports how many entries are still unreviewed.
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../src/data/scenarios.json', import.meta.url), 'utf8'));
const errors = [];
const ids = new Set();
const need = (cond, msg) => { if (!cond) errors.push(msg); };
const str = (v) => typeof v === 'string' && v.trim().length > 0;

need(Array.isArray(data.scenarios) && data.scenarios.length === 6, 'expected 6 scenarios');
let items = 0, phrases = 0, unItems = 0, unPhrases = 0;

for (const s of data.scenarios ?? []) {
  need(str(s.id) && str(s.title) && str(s.titleRo), `scenario ${s.id}: missing id/title/titleRo`);
  need(s.items?.length === 15, `scenario ${s.id}: expected 15 items, got ${s.items?.length}`);
  for (const it of s.items ?? []) {
    items++;
    need(!ids.has(it.id), `duplicate id ${it.id}`); ids.add(it.id);
    for (const k of ['ro', 'ar', 'pron']) need(str(it[k]), `${it.id}: missing "${k}"`);
    need(str(it.example?.ro) && str(it.example?.ar), `${it.id}: missing example.ro / example.ar`);
    need(typeof it.verified === 'boolean', `${it.id}: "verified" must be true/false`);
    if (!it.verified) unItems++;
  }
  for (const p of s.phrases ?? []) {
    phrases++;
    need(!ids.has(p.id), `duplicate id ${p.id}`); ids.add(p.id);
    for (const k of ['ro', 'ar', 'pron']) need(str(p[k]), `${p.id}: missing "${k}"`);
    need(typeof p.verified === 'boolean', `${p.id}: "verified" must be true/false`);
    if (!p.verified) unPhrases++;
  }
}

if (errors.length) { console.error('✗ content errors:\n  ' + errors.join('\n  ')); process.exit(1); }
console.log(`✓ ${data.scenarios.length} scenarios, ${items} items, ${phrases} phrases`);
console.log(`  unreviewed: ${unItems}/${items} items, ${unPhrases}/${phrases} phrases (set "verified": true after checking)`);
