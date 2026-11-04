import fs from 'node:fs';
import yaml from 'js-yaml';
import { SECTIONS, STATUSES, STALE_DAYS, SOON_DAYS, type Section } from '../../scripts/sections.ts';
export { SECTIONS, STATUSES, STALE_DAYS, SOON_DAYS, type Section };

export const REPO = process.env.REPO || 'https://github.com/OWNER/radar';
export const SUGGEST_URL = `${REPO}/issues/new?template=suggest.yml`;

export type Entry = {
  id: string; name: string; org: string; url: string; source_url: string; summary: string;
  region: 'India' | 'Global' | 'Remote'; tags: string[];
  status: (typeof STATUSES)[number];
  deadline: string | null; amount: string | null; added: string; last_verified: string;
  format?: string | null; cost?: string | null;
  topics?: string[];
  category?: string;
};

const DAY = 864e5;
export const daysSince = (d: string) => Math.floor((Date.now() - Date.parse(d)) / DAY);
export const daysUntil = (d: string) => Math.ceil((Date.parse(d) - Date.now()) / DAY);

export function load(section: Section): Entry[] {
  const all = yaml.load(fs.readFileSync(`data/${section}.yaml`, 'utf8'), { schema: yaml.JSON_SCHEMA }) as Entry[];
  return all;
}

export const recent = (n = 6) =>
  (Object.keys(SECTIONS) as Section[])
    .flatMap((s) => load(s).map((e) => ({ ...e, section: s })))
    .sort((a, b) => b.added.localeCompare(a.added) || a.name.localeCompare(b.name))
    .slice(0, n);
