import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getAllPublished } from '../lib/posts';
import { deriveExcerpt } from '../lib/markdown';

export const GET: APIRoute = async ({ request, cookies, site }) => {
  const posts = await getAllPublished({ request, cookies });

  const response = await rss({
    title: 'Neil Busque',
    description:
      'Everything Neil Busque builds, as he builds it: web apps, AI agents, automations.',
    site: site ?? 'https://busqueneil.com',
    items: posts.slice(0, 50).map((p) => ({
      title: p.title ?? deriveExcerpt(p.body_md, 70),
      link: `/posts/${p.slug}`,
      pubDate: p.published_at ? new Date(p.published_at) : new Date(p.created_at),
      description: p.excerpt ?? deriveExcerpt(p.body_md),
      content: p.body_html,
      categories: [p.type, ...p.tags],
    })),
  });

  response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
  return response;
};
