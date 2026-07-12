import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://amaterasu-web.studio',
  output: 'static',
  compressHTML: true,
  integrations: [sitemap()],
});
