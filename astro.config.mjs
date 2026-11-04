import { defineConfig } from 'astro/config';
// Set SITE / BASE for GitHub Pages, e.g. SITE=https://you.github.io BASE=/radar
export default defineConfig({
  site: process.env.SITE || 'https://radar.example.com',
  base: process.env.BASE || '/',
  trailingSlash: 'ignore',
});
