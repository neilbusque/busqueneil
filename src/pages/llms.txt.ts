import type { APIRoute } from 'astro';
import { getAllPublished } from '../lib/posts';
import { deriveExcerpt } from '../lib/markdown';
import { ARTICLES, ELSEWHERE, hrefFor, kindOf, type ContentEntry } from '../data/content-index';
import { FEATURED_TOOL, SERVICES, SITE, TOOLS } from '../data/site';
import { caseStudies } from '../data/case-studies';

/* A plain-text map of the site for AI assistants. Lists are built from the same data the pages
   use, so this file never names a page that does not exist. The bio is the copy deck's llms.txt
   bio. Keep it free of employers, schools, prices and offers. */

const abs = (href: string) => (href.startsWith('http') ? href : `${SITE.url}${href}`);
const list = (rows: { label: string; href: string; note?: string }[]) =>
  rows.map((r) => `- [${r.label}](${abs(r.href)})${r.note ? `: ${r.note}` : ''}`).join('\n');

const entries = (match: (c: ContentEntry) => boolean) =>
  [...ARTICLES, ...ELSEWHERE]
    .filter(match)
    .map((c) => ({ label: c.name, href: hrefFor(c), note: c.blurb }));

const GUIDES = list(entries((c) => kindOf(c) === 'guide'));
const COMPARISONS = list(entries((c) => kindOf(c) === 'comparison'));
const RESEARCH = list(entries((c) => kindOf(c) === 'research'));

const SERVICE_LIST = list(SERVICES.map((s) => ({ label: s.name, href: s.href, note: s.line })));
const TOOL_LIST = list([FEATURED_TOOL, ...TOOLS].map((t) => ({ label: t.name, href: t.href, note: t.text })));
const CASE_STUDIES = list(caseStudies.map((c) => ({ label: c.title, href: `/case-studies/${c.slug}` })));

const STATIC_BIO = `# Neil Busque

> Your AI guy. Neil Busque finds the work in a business worth handing to AI, builds the agents, apps and automations, and keeps them running. First versions in days.

## About

Neil Busque is an AI developer based in New Jersey, on US Eastern time, who works as the AI lead for small and mid-size businesses. He finds the work worth handing to AI, then builds it and keeps it running: AI agents, AI voice agents, custom software and business operating systems, automations, and AI-powered websites and funnels. He has shipped more than 40 products in 2026, including operating systems for six agencies and service businesses, and his first versions ship in days. Clients own the code and the accounts, and the fastest way to reach him is WhatsApp at +1 908-316-4140 or email at busqueneil@gmail.com.

## Services

${SERVICE_LIST}
- [All services and ways to work together](${SITE.url}/services)
- [Custom software by industry](${SITE.url}/software)

## Key pages

- [Home](${SITE.url}/)
- [Services](${SITE.url}/services)
- [Work: client builds, agency work and my own products](${SITE.url}/work)
- [About](${SITE.url}/story)
- [When to hire me](${SITE.url}/hire)
- [Hire an AI engineer](${SITE.url}/hire/ai-engineer)
- [Hire for AI automation](${SITE.url}/hire/ai-automation)
- [Hire an AI engineer in New Jersey](${SITE.url}/hire/ai-engineer-nj)
- [Hire an AI engineer in NYC](${SITE.url}/hire/ai-engineer-nyc)
- [Hire a remote AI engineer](${SITE.url}/hire/ai-engineer-remote)
- [Website design and development](${SITE.url}/services/websites)
- [Landing page design](${SITE.url}/services/landing-pages)
- [Sales funnel development](${SITE.url}/services/funnels)
- [Web app development](${SITE.url}/services/web-apps)
- [AI automation services](${SITE.url}/services/ai-automation-services)
- [AI agent development](${SITE.url}/services/ai-agent-development)
- [Working with an AI automation consultant](${SITE.url}/services/ai-automation-consultant)
- [Resources: guides, comparisons and research](${SITE.url}/resources)
- [Contact](${SITE.url}/contact)

## Case studies

${CASE_STUDIES}

## Free tools (no sales call)

${TOOL_LIST}
- [All free tools](${SITE.url}/free)

## Guides

${GUIDES}

## Comparisons

${COMPARISONS}
- [All comparisons](${SITE.url}/compare)

## Original research

${RESEARCH}
- [All research](${SITE.url}/research)

## Contact

- WhatsApp (fastest, usually a same-day reply): +1 908-316-4140, https://wa.me/${SITE.whatsapp}
- Email: ${SITE.email}
- Contact form: ${SITE.url}/contact
- Book a call: https://book.busqueneil.com
- LinkedIn: https://www.linkedin.com/in/neilbusque/
- RSS: ${SITE.url}/rss.xml`;

export const GET: APIRoute = async ({ request, cookies }) => {
  const posts = await getAllPublished({ request, cookies });
  const recent = posts
    .slice(0, 25)
    .map((p) => `- [${p.title ?? deriveExcerpt(p.body_md, 70)}](${SITE.url}/posts/${p.slug})`)
    .join('\n');

  const body = recent ? `${STATIC_BIO}\n\n## Build notes\n\n${recent}\n` : `${STATIC_BIO}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
    },
  });
};
