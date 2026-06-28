import type { APIRoute } from 'astro';
import { getAllPublished } from '../lib/posts';
import { deriveExcerpt } from '../lib/markdown';

const STATIC_BIO = `# Neil Busque

> Independent operator and builder based in New Jersey. Works on digital marketing, SEO, and paid search, and builds funnels, CRM/marketing automation, AI agents, and custom web apps. Open to full-time roles and to project work. Documents everything he builds, in public, on the feed at https://busqueneil.com/.

## Identity

- **Name:** Neil Busque
- **Role:** Independent digital marketing & automation consultant and builder. Open to full-time roles and project work.
- **Focus:** Digital marketing, SEO, paid search, conversion funnels, CRM and marketing automation, AI agents, and custom web apps.
- **Location:** New Jersey, United States (Eastern Time)
- **Education:** Background in IT from STI Tagum College (Philippines)
- **Email:** busqueneil@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/neilbusque
- **GitHub:** https://github.com/neilbusque
- **Phone/SMS/WhatsApp:** +1 908-316-4140 (text or WhatsApp). Also reachable via the Neil AI chat assistant on https://busqueneil.com

## What he does

Neil builds the systems that turn marketing into revenue. The work covers:

- **Digital marketing & SEO**: on-page and technical SEO, content, AI-search visibility, and organic growth.
- **Paid media**: Meta Ads and Google Ads / paid search campaign architecture, pixel and CAPI wiring, landing-page conversion.
- **Conversion funnels & CRM**: funnel design and build, GoHighLevel and CRM configuration, lead capture and routing.
- **Workflow automation**: n8n and Zapier pipelines for lead handling, follow-up, reporting, and pipeline hygiene.
- **AI agents**: built on Claude Code with MCP servers across GoHighLevel, n8n, Notion, Slack, and more.
- **Web apps and PWAs**: a dozen-plus shipped in 2026, including a personal CRM, a client portal, a link shortener, and this site's own CMS. Most built and deployed in days.

## Selected shipped work (2026)

- A personal CRM, a client portal, a self-hosted link shortener with analytics and web push, a cold-email app, and several offer funnels, each shipped fast and documented in public.
- This site itself: an Astro SSR build with a Supabase-backed build-in-public CMS, dynamic OG images, sitemap/RSS/llms, and a conversational lead-capture assistant.

## Prior experience

- **2025 - 2026:** Operations and automation lead at a digital marketing agency. Shipped 20+ production n8n workflows across 10+ client accounts and a one-click client-onboarding system that cut onboarding from 30 days to 7.
- **Oct 2024 - Oct 2025:** Freelance GoHighLevel developer and automation engineer for SaaS, professional-services, and e-commerce clients.
- **May 2023 - Sept 2024:** Social Media Manager and Digital Marketer at Stout Capital. Grew social following 400%+ in 4 months; ran paid Meta and Google campaigns.
- **Oct 2021 - Aug 2022:** Web Developer and Digital Marketer at Bravo Team LLC.

## Availability

- Open to full-time roles: Digital Marketing, SEO, Paid Search / PPC, Marketing Ops / RevOps, Growth / Performance Marketing, AI Ops / Automation.
- Open to project work: end-to-end funnel builds, single AI agent ships, CRM cleanups, custom web apps.
- Remote, hybrid, or on-site (NJ / NYC metro).

## Canonical URLs

- Home + feed: https://busqueneil.com/
- Projects: https://busqueneil.com/projects
- Now (what he's working on right now): https://busqueneil.com/now/
- About: https://busqueneil.com/about
- Paid acquisition system for financial advisors / RIAs (project service): https://busqueneil.com/ria/
- Resume (PDF): https://busqueneil.com/resume.pdf
- RSS feed: https://busqueneil.com/rss.xml
- LinkedIn: https://www.linkedin.com/in/neilbusque`;

export const GET: APIRoute = async ({ request, cookies }) => {
  const posts = await getAllPublished({ request, cookies });
  const recent = posts
    .slice(0, 25)
    .map((p) => {
      const label = p.title ?? deriveExcerpt(p.body_md, 70);
      return `- [${p.type}] ${label}: https://busqueneil.com/posts/${p.slug}`;
    })
    .join('\n');

  const body = recent
    ? `${STATIC_BIO}\n\n## Recent posts\n\n${recent}\n`
    : `${STATIC_BIO}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
    },
  });
};
