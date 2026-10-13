import type { APIRoute } from 'astro';
import { DEFAULT_CARD, pngResponse, renderOgCard } from '../../lib/og-card';

/* The default social card (SOCIAL_IMAGE_URL in src/lib/seo.ts), rendered once at build time. */
export const prerender = true;

export const GET: APIRoute = async () => pngResponse(await renderOgCard(DEFAULT_CARD));
