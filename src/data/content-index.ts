/* The 50-piece content programme (plan: docs/content-plan-50.md).
 *
 * ⚠️ ONE source of truth. The hubs, sitemap.xml, llms.txt and the OG image route all read
 * this file. Adding an entry here and forgetting the page — or shipping a page and forgetting
 * the entry — is the failure mode this exists to prevent, so:
 *
 *   `live: false` means the .astro page does not exist yet.
 *
 * Nothing that is not `live` is ever listed in a hub, the sitemap, or llms.txt. A sitemap
 * entry for a URL that 404s reports as a coverage error in Search Console, and an orphan hub
 * link is worse than no link. Flip `live` to true in the SAME commit that adds the page.
 */

export type Cluster = 'compare' | 'guides' | 'research';

export interface ContentEntry {
  slug: string;
  cluster: Cluster;
  /** Title tag + H1 source. Keep under ~60 chars where possible. */
  title: string;
  /** Short label for the OG image and hub card eyebrow. */
  label: string;
  /** Hub blurb and meta description seed. */
  blurb: string;
  /** The query this page is written to answer. */
  target: string;
  published?: string;
  modified?: string;
  live?: boolean;
}

export const CONTENT: ContentEntry[] = [
  /* ---------------- Lane 1 — comparisons (22) ---------------- */
  /* ⚠️ Not written yet on purpose. Neil ships with Claude Code and Codex; he is not a daily
     Cursor user, and the whole value of this cluster is first-hand experience. Either put real
     hours into Cursor first or write it as a documented-behaviour comparison that says so. */
  { slug: 'claude-code-vs-cursor', cluster: 'compare', title: 'Claude Code vs Cursor', label: 'AI CODING', blurb: 'Where each one wins, and the workflow difference that matters more than the feature list.', target: 'claude code vs cursor' },
  { slug: 'mcp-vs-function-calling', cluster: 'compare', title: 'MCP vs Function Calling', label: 'AI AGENTS', blurb: 'What MCP adds over plain tool calls, and when the extra moving part is not worth it.', target: 'mcp vs function calling' },
  { slug: 'supabase-vs-firebase', cluster: 'compare', title: 'Supabase vs Firebase', label: 'BACKEND', blurb: 'Ten shipped products on Supabase. The Postgres argument, and the places Firebase is still the faster call.', target: 'supabase vs firebase' },
  { slug: 'vercel-vs-railway', cluster: 'compare', title: 'Vercel vs Railway', label: 'HOSTING', blurb: 'Both run production apps here. Where the serverless model helps, and where it quietly bites.', target: 'vercel vs railway' },
  { slug: 'astro-vs-nextjs', cluster: 'compare', title: 'Astro vs Next.js', label: 'FRAMEWORKS', blurb: 'This site is Astro. A client app is Next. How to pick without relitigating it every project.', target: 'astro vs next.js' },
  { slug: 'lovable-vs-replit-vs-bolt', cluster: 'compare', title: 'Lovable vs Replit vs Bolt', label: 'AI BUILDERS', blurb: 'Where all three get you in an afternoon, and the exact point each one stops.', target: 'lovable vs replit vs bolt' },
  { slug: 'openrouter-vs-direct-api', cluster: 'compare', title: 'OpenRouter vs Calling the API Direct', label: 'LLM OPS', blurb: 'Five models across live products. What the router buys you and what it costs.', target: 'openrouter vs openai api' },
  {
    slug: 'resend-vs-mailgun',
    cluster: 'compare',
    title: 'Resend vs Mailgun',
    label: 'EMAIL',
    blurb: 'I moved a production CRM to Mailgun and hit a deliverability trap that has nothing to do with either product. How to pick, and what to check before you switch.',
    target: 'resend vs mailgun',
    published: '2026-08-11',
    modified: '2026-08-11',
    live: true,
  },
  { slug: 'gohighlevel-vs-hubspot', cluster: 'compare', title: 'GoHighLevel vs HubSpot', label: 'CRM', blurb: 'Client work in both. Which one fits an agency, which fits a sales team, and the migration cost nobody mentions.', target: 'gohighlevel vs hubspot' },
  { slug: 'ai-sdr-vs-hiring-an-sdr', cluster: 'compare', title: 'AI SDR vs Hiring an SDR', label: 'SALES', blurb: 'I built a working sales agent. Honest read on what it replaced and what it absolutely did not.', target: 'ai sdr vs human sdr' },
  { slug: 'custom-crm-vs-gohighlevel', cluster: 'compare', title: 'Custom CRM vs GoHighLevel', label: 'CRM', blurb: 'I used GHL for years, then built my own. The three conditions that justify building.', target: 'custom crm vs gohighlevel' },
  { slug: 'claude-vs-gpt-for-coding', cluster: 'compare', title: 'Claude vs GPT for Coding', label: 'AI CODING', blurb: 'Both run daily against real repositories. Where each is stronger, measured on actual tasks.', target: 'claude vs gpt for coding' },
  { slug: 'firecrawl-vs-apify-vs-puppeteer', cluster: 'compare', title: 'Firecrawl vs Apify vs Puppeteer', label: 'SCRAPING', blurb: 'All three are in my stack for different jobs. A decision tree instead of a winner.', target: 'firecrawl vs apify' },
  { slug: 'rls-vs-app-layer-auth', cluster: 'compare', title: 'Row-Level Security vs App-Layer Auth', label: 'SECURITY', blurb: 'RLS shipped on several products, including the mistakes. Why the database is usually the right place.', target: 'row level security vs application auth' },
  { slug: 'supabase-functions-vs-vercel-functions', cluster: 'compare', title: 'Supabase Edge Functions vs Vercel Functions', label: 'BACKEND', blurb: '98 edge functions on one product. Where each runtime belongs and how they fail differently.', target: 'supabase edge functions vs vercel functions' },
  { slug: 'ai-phone-agent-vs-chatbot-vs-live-chat', cluster: 'compare', title: 'AI Phone Agent vs Chatbot vs Live Chat', label: 'AI AGENTS', blurb: 'Shipped a roofing voice agent. Which channel actually books the job, by lead type.', target: 'ai phone agent vs chatbot' },
  { slug: 'zapier-ai-vs-n8n-ai-agents', cluster: 'compare', title: 'Zapier AI vs n8n AI Agents', label: 'AUTOMATION', blurb: '20+ workflows across both. Where the managed version saves you and where it traps you.', target: 'zapier ai vs n8n ai agent' },
  { slug: 'twilio-vs-whatsapp-business-api', cluster: 'compare', title: 'Twilio vs WhatsApp Business API', label: 'MESSAGING', blurb: 'Both wired into live products. Deliverability, cost, and the template approval reality.', target: 'twilio vs whatsapp api' },
  { slug: 'stripe-checkout-vs-payment-links', cluster: 'compare', title: 'Stripe Checkout vs Payment Links', label: 'PAYMENTS', blurb: 'Live billing on both. The fastest path to a first paid customer, and when to upgrade.', target: 'stripe checkout vs payment links' },
  { slug: 'shopify-vs-custom-ecommerce', cluster: 'compare', title: 'Shopify vs Custom Ecommerce', label: 'ECOMMERCE', blurb: 'Client builds on both. The revenue point where custom starts to pay for itself.', target: 'shopify vs custom store' },
  { slug: 'wordpress-vs-astro', cluster: 'compare', title: 'WordPress vs Astro', label: 'WEBSITES', blurb: 'I have migrated sites off WordPress. What you gain, what you give up, who should not move.', target: 'wordpress vs astro' },
  { slug: 'n8n-vs-make-deep-dive', cluster: 'compare', title: 'n8n vs Make: The Deep Cut', label: 'AUTOMATION', blurb: 'Past the feature table, into error handling, versioning, and what breaks at scale.', target: 'n8n vs make' },

  /* ---------------- Lane 2 — AI × marketing (16) ---------------- */
  { slug: 'ai-for-seo', cluster: 'guides', title: 'How to Use AI for SEO', label: 'AI SEO', blurb: 'What held up when I built 58 pages with AI, and the three places it produced work I had to throw away.', target: 'how to use ai for seo' },
  {
    slug: 'programmatic-seo-with-ai',
    cluster: 'guides',
    title: 'Programmatic SEO with AI',
    label: 'PROGRAMMATIC SEO',
    blurb: 'I shipped 58 pages from one route and one data file. The method, the guardrails, and the part that decides whether it works.',
    target: 'programmatic seo ai',
    published: '2026-08-11',
    modified: '2026-08-11',
    live: true,
  },
  { slug: 'cold-email-ai-that-doesnt-sound-ai', cluster: 'guides', title: "Cold Email with AI That Doesn't Read Like AI", label: 'OUTBOUND', blurb: 'The tells that get you deleted, and the personalization layer that actually earns a reply.', target: 'ai cold email' },
  { slug: 'ai-lead-enrichment', cluster: 'guides', title: 'AI Lead Enrichment That Survives Contact With Reality', label: 'LEAD GEN', blurb: 'I enriched 254 contacts and had to throw away 44%. Why, and the checks that catch it.', target: 'ai lead enrichment' },
  { slug: 'build-an-ai-sdr', cluster: 'guides', title: 'How to Build an AI SDR', label: 'SALES AGENTS', blurb: 'A working sales agent: the tools it gets, the approval rules, and where a human stays in the loop.', target: 'how to build an ai sdr' },
  { slug: 'ai-competitor-research', cluster: 'guides', title: 'AI Competitor Research', label: 'RESEARCH', blurb: 'How I pulled and read 866 competitor ads, and what to do with the answer.', target: 'ai competitor research' },
  { slug: 'ai-ad-creative-workflow', cluster: 'guides', title: 'An AI Ad Creative Workflow That Ships', label: 'PAID ADS', blurb: 'Concept to rendered video, with the human decisions that cannot be automated.', target: 'ai ad creative' },
  { slug: 'ai-landing-page-copy', cluster: 'guides', title: 'Writing Landing Page Copy with AI', label: 'COPY', blurb: 'Where AI drafts well, where it flattens your voice, and the edit pass that fixes it.', target: 'ai landing page copy' },
  { slug: 'ai-content-that-ranks', cluster: 'guides', title: 'AI Content That Ranks vs AI Content That Gets Ignored', label: 'CONTENT', blurb: 'The difference is not the model. It is what you can say that nobody else can.', target: 'ai content seo' },
  { slug: 'automate-your-crm-with-ai', cluster: 'guides', title: 'Automating a CRM with AI', label: 'CRM', blurb: 'Eight AI-backed functions in a production CRM, and the two I turned back off.', target: 'ai crm automation' },
  { slug: 'ai-voice-agents-for-follow-up', cluster: 'guides', title: 'AI Voice Agents for Lead Follow-Up', label: 'VOICE', blurb: 'What a voice agent does well on inbound, and the failure modes to design around.', target: 'ai voice agent lead follow up' },
  { slug: 'geo-for-local-business', cluster: 'guides', title: 'GEO for Local Business', label: 'LOCAL AI SEARCH', blurb: 'How AI answers handle local intent, and the parts of your presence that feed them.', target: 'geo local business' },
  { slug: 'ai-for-social-content', cluster: 'guides', title: 'Using AI for Social Content', label: 'SOCIAL', blurb: 'Built from 19 posts and 33.1M plays of transcript analysis, not general best practice.', target: 'ai social media content' },
  { slug: 'measure-ai-impact-on-marketing', cluster: 'guides', title: 'How to Measure AI’s Impact on Marketing', label: 'ANALYTICS', blurb: 'Attribution that survives a cookieless setup, and the vanity metrics to drop.', target: 'measure ai marketing roi' },
  { slug: 'ai-marketing-stack-small-team', cluster: 'guides', title: 'An AI Marketing Stack for a Small Team', label: 'STACK', blurb: 'The actual tools I run, what each replaced, and what I pay.', target: 'ai marketing stack' },
  { slug: 'prompt-engineering-for-marketers', cluster: 'guides', title: 'Prompt Engineering for Marketers', label: 'PROMPTING', blurb: 'The handful of patterns that carry production work. No prompt library required.', target: 'prompt engineering marketing' },

  /* ---------------- Lane 3 — original research (12) ---------------- */
  {
    slug: '866-custom-software-ads',
    cluster: 'research',
    title: 'I Analyzed 866 Ads From 30 Custom Software Companies',
    label: 'MARKET STUDY',
    blurb: 'Screened from 585 advertisers running paid ads to US businesses. Three tiers, real prices, and the offers that have survived longest.',
    target: 'custom software company pricing',
    published: '2026-08-11',
    modified: '2026-08-11',
    live: true,
  },
  { slug: 'only-3-of-30-publish-a-price', cluster: 'research', title: 'Only 3 of 30 Software Companies Publish a Price', label: 'PRICING STUDY', blurb: 'Pricing opacity is near-universal in this market, which makes publishing one the cheapest differentiator available.', target: 'custom software pricing transparency', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'guarantees-in-the-ad-library', cluster: 'research', title: 'Only 4 of 30 Offer a Guarantee', label: 'OFFER STUDY', blurb: 'And three of those four run the longest-lived ads in the set. The exact wording of each.', target: 'software development guarantee', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'ad-longevity-as-a-conversion-proxy', cluster: 'research', title: 'Ad Longevity Is the Closest Thing to a Public Conversion Signal', label: 'METHOD', blurb: 'One ad ran 564 days on a single creative. Nobody keeps paying for a losing ad.', target: 'meta ad library longevity', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'the-vibe-coding-wall', cluster: 'research', title: 'The Vibe-Coding Wall', label: 'MARKET INSIGHT', blurb: 'One company launched 80 ad variants in two weeks around a single idea: you already tried building it with AI, and hit a wall.', target: 'ai app builder limitations', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: '10-hook-patterns-33m-plays', cluster: 'research', title: '10 Hook Patterns Behind 33.1M Plays', label: 'CONTENT STUDY', blurb: '19 Instagram posts over 1M plays, transcribed and analyzed. The patterns, ranked by plays behind them.', target: 'viral hook patterns' },
  { slug: 'tiktok-vs-instagram-physics', cluster: 'research', title: 'TikTok and Instagram Are Not the Same Game', label: 'PLATFORM STUDY', blurb: 'Shares are the lever on one, not the other. Duration is bimodal. The middle is dead.', target: 'tiktok vs instagram algorithm' },
  { slug: 'carousels-are-depth-not-reach', cluster: 'research', title: 'Carousels Are Depth, Not Reach', label: 'FORMAT STUDY', blurb: 'A tenth of the likes of a reel, and the same number of comments. What that means for what you post.', target: 'instagram carousel vs reel', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: '44-percent-of-ai-enriched-contacts-are-wrong', cluster: 'research', title: '44% of AI-Enriched B2B Contacts Were the Wrong Employer', label: 'DATA QUALITY', blurb: 'Measured across 254 contacts at 100 companies. Two failure modes, and the check that catches both.', target: 'b2b data enrichment accuracy', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: '40-products-in-a-year', cluster: 'research', title: 'What 40+ Shipped Products Taught Me About Scope', label: 'BUILD NOTES', blurb: 'The scope decisions that survived contact with real users, and the ones that never do.', target: 'software project scope' },
  /* ⚠️ BLOCKED on data, not on writing. Checked 2026-08-11: Sonar holds ~2 days of usable
     history and 136 visitors across 27 sites, most of it one property. That cannot support a
     sentence like "a year of analytics across 20 sites" without implying data that does not
     exist. Revisit once there are several months of history. */
  { slug: 'what-20-sites-taught-me-about-traffic', cluster: 'research', title: 'What 20 Sites Taught Me About Traffic', label: 'ANALYTICS STUDY', blurb: 'Cookieless analytics across a portfolio nobody is paying to promote.', target: 'small website traffic benchmarks' },
  { slug: 'the-false-zero-machine', cluster: 'research', title: 'The False-Zero Machine', label: 'METHOD', blurb: 'Ad-library search ranks the wrong page first and returns a confident zero. How to detect it before it poisons your analysis.', target: 'meta ad library search accuracy', published: '2026-08-11', modified: '2026-08-11', live: true },
];

export const liveContent = CONTENT.filter((c) => c.live);

export const byCluster = (cluster: Cluster) => CONTENT.filter((c) => c.cluster === cluster);
export const liveByCluster = (cluster: Cluster) => liveContent.filter((c) => c.cluster === cluster);

export const clusterPath: Record<Cluster, string> = {
  compare: '/compare',
  guides: '/guides',
  research: '/research',
};

export const urlFor = (c: ContentEntry) => `${clusterPath[c.cluster]}/${c.slug}`;
