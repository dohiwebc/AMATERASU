import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dohiwebc.github.io/AMATERASU',
  base: '/AMATERASU/',
  output: 'static',
  compressHTML: true,
  integrations: [sitemap()],
});
