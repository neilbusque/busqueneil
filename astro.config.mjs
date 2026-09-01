import { defineConfig, passthroughImageService } from 'astro/config';
import vercel from '@astrojs/vercel';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://busqueneil.com',
  output: 'server',
  trailingSlash: 'ignore',
  adapter: vercel({ maxDuration: 300 }),
  // checkOrigin 403s legitimate form POSTs behind Vercel's proxy (forwarded
  // proto/host mismatch). Only the login form is a form POST; the admin JSON
  // API is protected by content-type + session cookie.
  security: { checkOrigin: false },
  // v14: prefetch prerendered pages as their links scroll into view — with ClientRouter
  // this makes most navigations feel instant at the cost of a few cached GETs.
  prefetch: { defaultStrategy: 'viewport', prefetchAll: true },
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
