import type { APIRoute } from 'astro';
import { getAllPublished } from '../lib/posts';
import { caseStudies } from '../data/case-studies';
import { softwarePages } from '../data/software-pages';
import { ARTICLES, urlFor } from '../data/content-index';

/* Every live, indexable route and nothing else. Left out on purpose:
   - redirects (/about, /blog, /now, /feed, /notes, /posts, /guides, /case-studies, /projects,
     /shop and the retired funnels and PDFs in vercel.json), because a sitemap entry that
     redirects reports as an error in Search Console;
   - noindex pages (/unlimited, /unlimited/thanks, /admin, the 404 page);
   - API routes and generated images.
   Article URLs come from content-index, so a URL cannot appear here without a page behind it. */

const SITE = 'https://busqueneil.com';
/* The rebuilt pages: home, services, work, tools, resources hubs, contact and about. */
const REBUILT = '2026-10-12';

const PAGES: { path: string; lastmod?: string }[] = [
  { path: '/', lastmod: REBUILT },
  { path: '/services', lastmod: REBUILT },
  { path: '/services/ai-agent-development', lastmod: REBUILT },
  { path: '/services/ai-automation-services', lastmod: REBUILT },
  { path: '/services/ai-automation-consultant', lastmod: REBUILT },
  { path: '/services/web-apps', lastmod: REBUILT },
  { path: '/services/websites', lastmod: REBUILT },
  { path: '/services/landing-pages', lastmod: REBUILT },
  { path: '/services/funnels', lastmod: REBUILT },
  { path: '/hire', lastmod: REBUILT },
  { path: '/hire/ai-engineer', lastmod: REBUILT },
  { path: '/hire/ai-automation', lastmod: REBUILT },
  { path: '/hire/ai-engineer-nj', lastmod: REBUILT },
  { path: '/hire/ai-engineer-nyc', lastmod: REBUILT },
  { path: '/hire/ai-engineer-remote', lastmod: REBUILT },
  { path: '/work', lastmod: REBUILT },
  ...caseStudies.map((cs) => ({ path: `/case-studies/${cs.slug}`, lastmod: REBUILT })),
  { path: '/free', lastmod: REBUILT },
  { path: '/analyzer', lastmod: REBUILT },
  { path: '/resources', lastmod: REBUILT },
  { path: '/compare', lastmod: REBUILT },
  { path: '/research', lastmod: REBUILT },
  ...ARTICLES.map((c) => ({ path: urlFor(c), lastmod: c.modified ?? c.published })),
  { path: '/software', lastmod: REBUILT },
  ...softwarePages.map((p) => ({ path: `/software/${p.slug}`, lastmod: REBUILT })),
  { path: '/story', lastmod: REBUILT },
  { path: '/contact', lastmod: REBUILT },
];

export const GET: APIRoute = async ({ request, cookies }) => {
  /* Published build notes only: getAllPublished leaves out hidden and personal posts. */
  const posts = await getAllPublished({ request, cookies });

  const seen = new Set<string>();
  const rows = [
    ...PAGES.map((p) => ({ loc: `${SITE}${p.path}`, lastmod: p.lastmod })),
    ...posts.map((p) => ({ loc: `${SITE}/posts/${p.slug}`, lastmod: (p.updated_at ?? p.created_at).slice(0, 10) })),
  ].filter((r) => (seen.has(r.loc) ? false : (seen.add(r.loc), true)));

  const urls = rows
    .map((r) => `<url><loc>${r.loc}</loc>${r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : ''}</url>`)
    .join('\n  ');

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
