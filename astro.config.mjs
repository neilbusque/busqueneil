import { defineConfig, passthroughImageService } from 'astro/config';
import vercel from '@astrojs/vercel';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://busqueneil.com',
  output: 'server',
  trailingSlash: 'ignore',
  adapter: vercel(),
  image: { service: passthroughImageService() },
  integrations: [preact()],
});
