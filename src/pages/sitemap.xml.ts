import type { APIRoute } from 'astro';
import { getAllPublished } from '../lib/posts';
import { caseStudies } from '../data/case-studies';

const LAST_UPDATED = '2026-07-25';

const STATIC_URLS: { loc: string; lastmod?: string }[] = [
  { loc: 'https://busqueneil.com/', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/resources', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/hire', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/hire/ai-engineer', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/hire/ai-automation', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/hire/ai-engineer-nj', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/hire/ai-engineer-nyc', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/hire/ai-engineer-remote', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/services', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/services/web-apps', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/services/websites', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/services/landing-pages', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/services/funnels', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/services/ai-automation-services', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/services/ai-agent-development', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/services/ai-automation-consultant', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/guides/geo-generative-engine-optimization-guide', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/guides/google-ai-overviews-guide', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/guides/build-ai-agent-claude-code', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/guides/what-is-mcp-model-context-protocol', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/guides/ship-web-app-in-days-with-ai', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/guides/how-to-build-an-mcp-server', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/guides/n8n-vs-zapier-vs-make', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/guides/postgres-row-level-security', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/story', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/work', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/blog', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/contact', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/shop', lastmod: LAST_UPDATED },
  { loc: 'https://busqueneil.com/analyzer' },
  /* /case-studies is deliberately absent: it 301s to /work (see case-studies/index.astro).
     A sitemap should only list URLs that return 200, or Search Console reports the entry
     as a redirect error. The five detail pages below are the real, indexable ones. */
  ...caseStudies.map((cs) => ({
    loc: `https://busqueneil.com/case-studies/${cs.slug}`,
  })),
  { loc: 'https://busqueneil.com/resume.pdf' },
];

export const GET: APIRoute = async ({ request, cookies }) => {
  const posts = await getAllPublished({ request, cookies });

  const urls = [
    ...STATIC_URLS.map((u) =>
      `<url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`
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
