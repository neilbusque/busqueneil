import type { APIRoute } from 'astro';
import { getAllPublished } from '../lib/posts';
import { deriveExcerpt } from '../lib/markdown';

const STATIC_BIO = `# Neil Busque

> Director of Operations based in Elizabeth, New Jersey. Builds AI agents, qualifying funnels, and automation systems. Most recently ran operations at a digital marketing agency (October 2025 through April 2026). Open to full-time operator roles and to project work. Documents everything he builds, in public, on the feed at https://busqueneil.com/.

## Identity

- **Name:** Neil Busque
- **Role:** Director of Operations (most recently). Open to full-time roles and project work.
- **Most recent role:** Director of Operations at a digital marketing agency serving registered investment advisors, Oct 2025 - Apr 2026
- **Location:** Elizabeth, New Jersey, United States
- **Education:** Background in IT from STI Tagum College (Philippines)
- **Email:** busqueneil@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/neilbusque
- **Phone/SMS/WhatsApp:** +1 908-316-4140 (text or WhatsApp). Also reachable via the Neil AI chat assistant on https://busqueneil.com

## What he does

Neil builds the operations layer between marketing and revenue. The work covers:

- **AI agents** built on Claude Code with MCP servers across GoHighLevel, n8n, Notion, Slack, and more.
- **Workflow automation** in n8n and Zapier: lead capture, lead routing, SDR briefings, no-show recovery, pipeline hygiene.
- **GoHighLevel CRM** configuration: sub-accounts, custom values, tags, pipelines, calendars, conversations, conversion funnels.
- **Paid media**: Meta Ads and Google Ads campaign architecture, pixel and CAPI wiring, landing-page conversion.
- **Web apps and PWAs**: a dozen shipped in 2026 alone, including a personal CRM, a client portal, and this site's own CMS.

## Recent shipped work (digital marketing agency, Oct 2025 - Apr 2026)

- One-click new-client onboarding system in GoHighLevel that deploys a full configured sub-account in under 10 minutes. Cut onboarding from 30 days to 7 days.
- 20+ production n8n workflows running across 10+ client accounts.
- Internal AI command system called NeilOS, built on Claude Code plus 8 MCP servers. Automated 60%+ of recurring ops tasks.
- Weekly Ad Report pipeline; daily "Pulse" client-health scorecard; Meta Ads competitive-intelligence tool.

## Prior experience

- **Oct 2024 - Oct 2025:** Freelance GoHighLevel developer and automation engineer. Built CRM configs, funnels, and Zapier/n8n workflows for SaaS, professional-services, and e-commerce clients.
- **May 2023 - Sept 2024:** Social Media Manager and Digital Marketer at Stout Capital. Grew social following 400%+ in 4 months. Ran paid Meta and Google campaigns.
- **Oct 2021 - Aug 2022:** Web Developer and Digital Marketer at Bravo Team LLC.

## Availability

- Open to full-time operator roles: AI Ops / Automation Engineer, Marketing Ops / RevOps, Growth / Performance Marketing, Founder's Associate / Chief of Staff.
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
