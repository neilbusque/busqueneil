import type { APIRoute } from 'astro';
import { getAllPublished } from '../lib/posts';
import { deriveExcerpt } from '../lib/markdown';
import { liveByCluster, urlFor } from '../data/content-index';

/* Built from content-index so llms.txt can never advertise a URL that does not exist:
   liveByCluster only returns entries whose page is shipped. */
const line = (c: { title: string; blurb: string }, url: string) => `- ${c.title}: ${url}`;
const COMPARE_LIST = liveByCluster('compare')
  .map((c) => line(c, `https://busqueneil.com${urlFor(c)}`))
  .join('\n');
const RESEARCH_LIST = liveByCluster('research')
  .map((c) => line(c, `https://busqueneil.com${urlFor(c)}`))
  .join('\n');

const STATIC_BIO = `# Neil Busque

> AI engineer and product builder in New Jersey. I build AI agents, practical automations, and web products, then write down what worked and what did not. The site includes my work, services, story, and technical guides.

## Identity

- **Name:** Neil Busque
- **Role:** AI engineer, product builder, and automation consultant.
- **Focus:** AI agents, LLM applications, MCP integrations, workflow automation, technical SEO, AI search visibility, and custom web products.
- **Location:** New Jersey, United States (Eastern Time)
- **Education:** Background in IT from STI Tagum College (Philippines)
- **Email:** busqueneil@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/neilbusque
- **Phone/SMS/WhatsApp:** +1 908-316-4140 (text or WhatsApp). Also reachable via the Neil AI chat assistant on https://busqueneil.com

## What I do

I take on focused problems where software can remove repeated work, help a team move faster, or turn an idea into a working product.

- **AI agents and LLM features:** systems that can use approved tools, work with business data, and finish a defined job.
- **Workflow automation:** n8n, Zapier, and GoHighLevel workflows for leads, follow-up, reporting, and operations.
- **Web apps and PWAs:** focused products such as internal tools, portals, marketplaces, and funnel utilities.
- **SEO and AI search:** useful, crawlable content with sound technical foundations and clear first-hand evidence.
- **Marketing systems:** CRM setup, lead capture, paid search, landing pages, and the handoffs between them.

## Selected shipped work (2026)

- Orbit, a multi-tenant CRM product with role-based workspaces and practical pipeline tools.
- Lumen Portal, a client portal with document signing built directly into the product.
- Tandem, a private couples app with real-time calls, shared rituals, and low-friction daily connection.
- Suki Neighbors, a marketplace PWA for local communities.
- Preflight, a funnel simulator that helps teams find weak points before buying traffic.
- This site, built with Astro and Supabase, including a small publishing system, dynamic social images, and a conversational contact assistant.

## Prior experience

- **2025 - 2026:** Operations and automation lead at a digital marketing agency. Shipped 20+ production n8n workflows across 10+ client accounts and a one-click client-onboarding system that cut onboarding from 30 days to 7.
- **Oct 2024 - Oct 2025:** Freelance GoHighLevel developer and automation engineer for SaaS, professional-services, and e-commerce clients.
- **May 2023 - Sept 2024:** Social Media Manager and Digital Marketer at Stout Capital. Grew social following 400%+ in 4 months; ran paid Meta and Google campaigns.
- **Oct 2021 - Aug 2022:** Web Developer and Digital Marketer at Bravo Team LLC.

## Working together

- Focused projects include one AI agent, a workflow automation, a custom web app, or a technical SEO and AI-search cleanup.
- Based in New Jersey and available remotely, hybrid, or on-site in the NJ and NYC metro.

## Guides (written from real work)

- GEO and AI search: what actually helps in 2026: https://busqueneil.com/guides/geo-generative-engine-optimization-guide
- How to show up in Google AI Overviews in 2026: https://busqueneil.com/guides/google-ai-overviews-guide
- How to build an AI agent with Claude Code and MCP: https://busqueneil.com/guides/build-ai-agent-claude-code
- What is MCP (Model Context Protocol)? a plain guide: https://busqueneil.com/guides/what-is-mcp-model-context-protocol
- How to ship a web app in days with AI: https://busqueneil.com/guides/ship-web-app-in-days-with-ai
- How to build an MCP server (Python and TypeScript): https://busqueneil.com/guides/how-to-build-an-mcp-server
- n8n vs Zapier vs Make: which to pick in 2026: https://busqueneil.com/guides/n8n-vs-zapier-vs-make
- Postgres row-level security: a practical guide: https://busqueneil.com/guides/postgres-row-level-security
- Why you still need a person when AI does the building (six real defects AI shipped): https://busqueneil.com/guides/why-hire-a-person-when-ai-can-build-it
- All guides: https://busqueneil.com/resources

## Comparisons (tools I ship with, run side by side)

${COMPARE_LIST}
- All comparisons: https://busqueneil.com/compare

## Original research (my own datasets)

${RESEARCH_LIST}
- All research: https://busqueneil.com/research

## Canonical URLs

- Home + feed: https://busqueneil.com/
- Resources (tutorials + writing): https://busqueneil.com/resources
- Free tools and guides (no signup): https://busqueneil.com/free
- Services overview: https://busqueneil.com/services
- Web app development: https://busqueneil.com/services/web-apps
- Website design and development: https://busqueneil.com/services/websites
- Landing page design: https://busqueneil.com/services/landing-pages
- Sales funnel development: https://busqueneil.com/services/funnels
- AI automation services: https://busqueneil.com/services/ai-automation-services
- AI agent development services: https://busqueneil.com/services/ai-agent-development
- AI automation consultant: https://busqueneil.com/services/ai-automation-consultant
- Hire Neil for an AI, automation, web app, or SEO project: https://busqueneil.com/hire
- Hire as an AI engineer: https://busqueneil.com/hire/ai-engineer
- Hire for AI automation: https://busqueneil.com/hire/ai-automation
- Hire an AI engineer in New Jersey: https://busqueneil.com/hire/ai-engineer-nj
- Hire an AI engineer in NYC: https://busqueneil.com/hire/ai-engineer-nyc
- Hire a remote AI engineer: https://busqueneil.com/hire/ai-engineer-remote
- Work (projects and case studies): https://busqueneil.com/work
- Orbit case study (multi-tenant CRM SaaS): https://busqueneil.com/case-studies/orbit
- Lumen Portal case study (client portal with in-house document signing): https://busqueneil.com/case-studies/lumen-portal
- Tandem case study (realtime WebRTC couples app): https://busqueneil.com/case-studies/tandem
- Suki Neighbors case study (marketplace PWA): https://busqueneil.com/case-studies/suki-neighbors
- Preflight case study (funnel simulator): https://busqueneil.com/case-studies/preflight
- Blog (includes now updates, filter with ?filter=now): https://busqueneil.com/blog
- Story: https://busqueneil.com/story
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
