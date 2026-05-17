import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  site: 'https://creativesolace.com',
  integrations: [react(), keystatic()],
});
