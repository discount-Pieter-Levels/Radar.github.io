// Weekly: ping every url, close past-deadline entries, report stale entries.
// Rewrites data files in place and writes link-report.md (used as the GitHub issue body).
import fs from 'node:fs';
import yaml from 'js-yaml';
import { SECTIONS, STALE_DAYS, type Section } from './sections.ts';

const today = new Date().toISOString().slice(0, 10);
const days = (d: string) => (Date.now() - Date.parse(d)) / 864e5;
const broken: string[] = [], closed: string[] = [], stale: string[] = [];

async function status(url: string) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const r = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 (radar link check)' } });
      if (r.ok || [401, 402, 403, 429].includes(r.status)) return r.status; // bot walls aren't dead links
      if (method === 'GET') return r.status;
    } catch (e) { if (method === 'GET') return 0; }
  }
  return 0;
}

for (const section of Object.keys(SECTIONS) as Section[]) {
  const file = `data/${section}.yaml`;
  const entries = yaml.load(fs.readFileSync(file, 'utf8'), { schema: yaml.JSON_SCHEMA }) as any[];
  await Promise.all(entries.map(async (e) => {
    const s = await status(e.url);
    if (s === 404 || s === 410 || s === 0 || s >= 500) broken.push(`- [${section}] **${e.name}** — ${e.url} (${s || 'no response'})`);
    if (e.deadline && e.deadline < today && e.status !== 'closed' && e.status !== 'rolling') {
      e.status = 'closed'; closed.push(`- [${section}] ${e.name} (deadline ${e.deadline})`);
    }
    if (days(e.last_verified) > STALE_DAYS) stale.push(`- ${e.name} — last verified ${e.last_verified} (shown as Unverified)`);
  }));
  fs.writeFileSync(file, yaml.dump(entries, { lineWidth: 200, noRefs: true }));
}

const sec = (t: string, xs: string[]) => `## ${t} (${xs.length})\n${xs.length ? xs.sort().join('\n') : '_None._'}\n`;
const report = `# Link check — ${today}\n\n${sec('Broken links', broken)}\n${sec('Marked closed (past deadline)', closed)}\n${sec('Stale entries (re-verify or remove)', stale)}`;
fs.writeFileSync('link-report.md', report);
console.log(report);
