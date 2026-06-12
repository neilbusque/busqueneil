import { defineConfig, passthroughImageService } from 'astro/config';
import vercel from '@astrojs/vercel';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://busqueneil.com',
  output: 'server',
  trailingSlash: 'ignore',
  adapter: vercel(),
  image: { service: passthroughImageService() },
  vite: {
    ssr: {
      // keep the native binary out of the bundle so Vercel's file tracer
      // ships @resvg/resvg-js/*.node alongside the function
      external: ['@resvg/resvg-js'],
    },
  },
  integrations: [preact()],
});
