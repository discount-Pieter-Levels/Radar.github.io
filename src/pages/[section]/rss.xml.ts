import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SECTIONS, load, type Section } from '../../lib/data';

export function getStaticPaths() {
  return Object.keys(SECTIONS).map((section) => ({ params: { section } }));
}
export function GET(ctx: APIContext) {
  const section = ctx.params.section as Section;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return rss({
    title: `Radar: ${SECTIONS[section].title}`,
    description: SECTIONS[section].blurb,
    site: ctx.site!,
    items: load(section)
      .sort((a, b) => b.added.localeCompare(a.added))
      .map((e) => ({ title: e.name, description: e.summary, link: `${base}/${section}/#${e.id}`, pubDate: new Date(e.added) })),
  });
}
