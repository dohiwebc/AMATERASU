import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL ?? 'https://amaterasu-web.studio';

export default defineConfig({
  site,
  output: 'static',
  compressHTML: true,
  integrations: [sitemap()],
});
