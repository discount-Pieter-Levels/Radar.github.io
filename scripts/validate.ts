import fs from 'node:fs';
import yaml from 'js-yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { SECTIONS, GOVT_PATTERNS, type Section } from './sections.ts';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(JSON.parse(fs.readFileSync('schema/entry.schema.json', 'utf8')));
let failed = false;
const ids = new Set<string>();

for (const section of Object.keys(SECTIONS) as Section[]) {
  const entries = yaml.load(fs.readFileSync(`data/${section}.yaml`, 'utf8'), { schema: yaml.JSON_SCHEMA }) as any[];
  if (!validate(entries)) {
    failed = true;
    console.error(`✗ ${section}:`, ajv.errorsText(validate.errors, { separator: '\n  ' }));
  }
  const allowed = SECTIONS[section].tags as readonly string[];
  for (const e of entries ?? []) {
    if (ids.has(e.id)) { failed = true; console.error(`✗ duplicate id: ${e.id}`); }
    ids.add(e.id);
    for (const t of e.tags ?? []) if (allowed.length && !allowed.includes(t)) {
      failed = true; console.error(`✗ ${e.id}: unknown tag "${t}"`);
    }
    const hay = [e.name, e.org, e.url, e.source_url, e.summary, ...(e.tags ?? [])].join(' ');
    const hit = GOVT_PATTERNS.find((p) => p.test(hay));
    if (hit || e.govt) { failed = true; console.error(`✗ ${e.id}: looks government-backed (${hit ?? 'govt flag'})`); }
  }
  console.log(`✓ ${section}: ${entries?.length ?? 0} entries`);
}
if (failed) process.exit(1);
