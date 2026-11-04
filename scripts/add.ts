// Usage: npm run add -- <url> [section]
// Derives what it can from the URL (incl. X posts via the public fxtwitter API), asks for the rest,
// validates and appends to data/<section>.yaml.
import fs from 'node:fs';
import readline from 'node:readline/promises';
import { execSync } from 'node:child_process';
import yaml from 'js-yaml';
import { SECTIONS, type Section } from './sections.ts';

const [url, sectionArg] = process.argv.slice(2);
if (!url) { console.error('Usage: npm run add -- <url> [grants|communities]'); process.exit(1); }
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = async (q: string, def = '') => (await rl.question(`${q}${def ? ` [${def}]` : ''}: `)).trim() || def;
const today = new Date().toISOString().slice(0, 10);

let hint: Record<string, string> = {};
const x = url.match(/(?:x|twitter)\.com\/([^/]+)\/status\/(\d+)/);
try {
  if (x) {
    const t = (await (await fetch(`https://api.fxtwitter.com/${x[1]}/status/${x[2]}`)).json()).tweet;
    console.log(`\n@${t.author.screen_name}: ${t.text}\n`);
    hint = { summary: t.text.split('\n')[0].slice(0, 200) };
  } else {
    const html = await (await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } })).text();
    const m = (re: RegExp) => html.match(re)?.[1]?.trim() ?? '';
    hint = { name: m(/<title>([^<]+)/i).split(/[|–—-]/)[0].trim(), summary: m(/name="description" content="([^"]+)/i).slice(0, 200) };
  }
} catch { /* offline is fine — just ask */ }

const section = (sectionArg || await ask('Section (grants/communities)', 'grants')) as Section;
if (!(section in SECTIONS)) { console.error('Unknown section'); process.exit(1); }
const name = await ask('Name', hint.name);
const e: any = {
  id: await ask('id', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')),
  name, org: await ask('Org', name),
  url: await ask('Official URL', x ? '' : url),
  source_url: await ask('Source URL', url),
  summary: (await ask('Summary (≤200)', hint.summary)).slice(0, 200),
  region: await ask('Region (India/Global/Remote)', 'India'),
  tags: (await ask(`Tags, comma-sep (${SECTIONS[section].tags.join(', ') || 'none'})`)).split(',').map((s) => s.trim()).filter(Boolean),
  status: await ask('Status (open/rolling/between cycles/closed/unknown)', 'unknown'),
  deadline: (await ask('Deadline YYYY-MM-DD (blank = none)')) || null,
  amount: (await ask('Amount (blank = unknown)')) || null,
};
if (section === 'communities') {
  e.format = (await ask('Format (Remote / Hybrid / In-person (City))')) || null;
  e.cost = (await ask('Cost (e.g. Free / Paid stipend / Costs money)')) || null;
  e.topics = (await ask('Topics, comma-sep')).split(',').map((s) => s.trim()).filter(Boolean);
}
e.added = today; e.last_verified = today;
rl.close();

const file = `data/${section}.yaml`;
const before = fs.readFileSync(file, 'utf8');
fs.appendFileSync(file, yaml.dump([e], { lineWidth: 200 }));
try { execSync('npx tsx scripts/validate.ts', { stdio: 'inherit' }); console.log(`\nAdded ${e.id} to ${file}`); }
catch { fs.writeFileSync(file, before); console.error('\nInvalid — nothing written.'); process.exit(1); }
