import type { APIRoute } from 'astro';
import { getAllPublished } from '../lib/posts';

const STATIC_URLS: { loc: string; changefreq: string; priority: string }[] = [
  { loc: 'https://busqueneil.com/', changefreq: 'daily', priority: '1.0' },
  { loc: 'https://busqueneil.com/posts', changefreq: 'daily', priority: '0.8' },
  { loc: 'https://busqueneil.com/projects', changefreq: 'weekly', priority: '0.8' },
  { loc: 'https://busqueneil.com/now/', changefreq: 'weekly', priority: '0.7' },
  { loc: 'https://busqueneil.com/about', changefreq: 'monthly', priority: '0.6' },
  { loc: 'https://busqueneil.com/ria/', changefreq: 'monthly', priority: '0.5' },
  { loc: 'https://busqueneil.com/build/', changefreq: 'monthly', priority: '0.5' },
  { loc: 'https://busqueneil.com/help/', changefreq: 'monthly', priority: '0.5' },
  { loc: 'https://busqueneil.com/resume.pdf', changefreq: 'monthly', priority: '0.4' },
];

export const GET: APIRoute = async ({ request, cookies }) => {
  const posts = await getAllPublished({ request, cookies });

  const urls = [
    ...STATIC_URLS.map(
      (u) =>
        `<url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
    ),
    ...posts.map(
      (p) =>
        `<url><loc>https://busqueneil.com/posts/${p.slug}</loc><lastmod>${
          (p.updated_at ?? p.created_at).slice(0, 10)
        }</lastmod></url>`
    ),
  ].join('\n  ');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
    },
  });
};
