import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';

export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [keystatic()],
});
