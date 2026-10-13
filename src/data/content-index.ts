/* The article index: every guide, comparison and research page on the site.

   ONE source of truth. The hubs (/resources, /compare, /research), the article layout, the
   sitemap, llms.txt and the related lists all read this file, so a page and its listing cannot
   drift apart.

   Three lists:
   - CONTENT: the 50-piece programme. `live: false` means the page does not exist yet, and
     nothing that is not live is ever listed in a hub, the sitemap or llms.txt (a sitemap entry
     that 404s reports as a coverage error, and an orphan hub link is worse than no link).
     Flip `live` to true in the SAME change that adds the page.
   - EARLIER_GUIDES: nine guides published before the programme. Their URLs sit in the
     sitemap's fixed list, so they stay out of liveContent (which the sitemap also reads) to
     keep every URL listed once.
   - ELSEWHERE: two comparisons published as /software decision pages. Listed by the hubs only.

   Copy rules for every string here (the repo is public): no company, client or employer names,
   no product names of Neil's, no em or en dashes, sentence case for labels. */

export type Cluster = 'compare' | 'guides' | 'research';
/** What a reader sees in the Type column and the tabs. */
export type Kind = 'guide' | 'comparison' | 'research';
/** The four topics on /resources. */
export type Topic = 'agents' | 'automation' | 'software' | 'marketing';

export interface ContentEntry {
  slug: string;
  cluster: Cluster;
  /** Title tag and schema headline. Title case is kept here for search results. */
  title: string;
  /** Display title in sentence case: the article's H1, shown in the hubs and related lists. */
  name: string;
  /** Short topic label in sentence case. */
  label: string;
  /** Hub excerpt and meta description seed. */
  blurb: string;
  /** The query this page is written to answer. */
  target: string;
  topic: Topic;
  published?: string;
  modified?: string;
  live?: boolean;
  /** Display kind when it differs from the cluster: a comparison published under /guides. */
  kind?: Kind;
  /** Link target for a page outside the three clusters (the /software decision pages). */
  href?: string;
}

export const CONTENT: ContentEntry[] = [
  /* ---------------- Lane 1: comparisons (22) ---------------- */
  /* Not written yet on purpose. Neil ships with Claude Code and Codex; he is not a daily
     Cursor user, and the whole value of this cluster is first-hand experience. Either put real
     hours into Cursor first or write it as a documented-behaviour comparison that says so. */
  { slug: 'claude-code-vs-cursor', cluster: 'compare', title: 'Claude Code vs Cursor', name: 'Claude Code vs Cursor', label: 'AI coding', topic: 'software', blurb: 'Where each one wins, and the workflow difference that matters more than the feature list.', target: 'claude code vs cursor' },
  { slug: 'mcp-vs-function-calling', cluster: 'compare', title: 'MCP vs Function Calling', name: 'MCP vs function calling', label: 'AI agents', topic: 'agents', blurb: 'What MCP adds over plain tool calls, and when the extra moving part is not worth it.', target: 'mcp vs function calling', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'supabase-vs-firebase', cluster: 'compare', title: 'Supabase vs Firebase', name: 'Supabase vs Firebase', label: 'Backend', topic: 'software', blurb: 'Ten shipped products on Supabase. The Postgres argument, and the places Firebase is still the faster call.', target: 'supabase vs firebase', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'vercel-vs-railway', cluster: 'compare', title: 'Vercel vs Railway', name: 'Vercel vs Railway', label: 'Hosting', topic: 'software', blurb: 'Both run production apps here. Where the serverless model helps, and where it quietly bites.', target: 'vercel vs railway', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'astro-vs-nextjs', cluster: 'compare', title: 'Astro vs Next.js', name: 'Astro vs Next.js', label: 'Frameworks', topic: 'software', blurb: 'This site is Astro. A client app is Next. How to pick without relitigating it every project.', target: 'astro vs next.js', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'lovable-vs-replit-vs-bolt', cluster: 'compare', title: 'Lovable vs Replit vs Bolt', name: 'Lovable vs Replit vs Bolt', label: 'AI builders', topic: 'software', blurb: 'Where all three get you in an afternoon, and the exact point each one stops.', target: 'lovable vs replit vs bolt', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'openrouter-vs-direct-api', cluster: 'compare', title: 'OpenRouter vs Calling the API Direct', name: 'OpenRouter vs the API direct', label: 'LLM ops', topic: 'agents', blurb: 'Five models across live products. What the router buys you and what it costs.', target: 'openrouter vs openai api', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'resend-vs-mailgun', cluster: 'compare', title: 'Resend vs Mailgun', name: 'Resend vs Mailgun', label: 'Email', topic: 'software', blurb: 'I moved a production CRM to Mailgun and hit a deliverability trap that has nothing to do with either product. How to pick, and what to check before you switch.', target: 'resend vs mailgun', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'gohighlevel-vs-hubspot', cluster: 'compare', title: 'GoHighLevel vs HubSpot', name: 'GoHighLevel vs HubSpot', label: 'CRM', topic: 'automation', blurb: 'Client work in both. Which one fits an agency, which fits a sales team, and the migration cost nobody mentions.', target: 'gohighlevel vs hubspot', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'ai-sdr-vs-hiring-an-sdr', cluster: 'compare', title: 'AI SDR vs Hiring an SDR', name: 'AI SDR vs hiring an SDR', label: 'Sales', topic: 'agents', blurb: 'I built a working sales agent. An honest read on what it replaced and what it absolutely did not.', target: 'ai sdr vs human sdr', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'custom-crm-vs-gohighlevel', cluster: 'compare', title: 'Custom CRM vs GoHighLevel', name: 'Custom CRM vs GoHighLevel', label: 'CRM', topic: 'software', blurb: 'I used GHL for years, then built my own. The three conditions that justify building.', target: 'custom crm vs gohighlevel', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'claude-vs-gpt-for-coding', cluster: 'compare', title: 'Claude vs GPT for Coding', name: 'Claude vs GPT for coding', label: 'AI coding', topic: 'software', blurb: 'Both run daily against real repositories. Where each is stronger, measured on actual tasks.', target: 'claude vs gpt for coding', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'firecrawl-vs-apify-vs-puppeteer', cluster: 'compare', title: 'Firecrawl vs Apify vs Puppeteer', name: 'Firecrawl vs Apify vs Puppeteer', label: 'Scraping', topic: 'automation', blurb: 'All three are in my stack for different jobs. A decision tree instead of a winner.', target: 'firecrawl vs apify', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'rls-vs-app-layer-auth', cluster: 'compare', title: 'Row-Level Security vs App-Layer Auth', name: 'Row-level security vs app-layer auth', label: 'Security', topic: 'software', blurb: 'RLS shipped on several products, including the mistakes. Why the database is usually the right place.', target: 'row level security vs application auth', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'supabase-functions-vs-vercel-functions', cluster: 'compare', title: 'Supabase Edge Functions vs Vercel Functions', name: 'Supabase functions vs Vercel functions', label: 'Backend', topic: 'software', blurb: '98 edge functions on one product. Where each runtime belongs and how they fail differently.', target: 'supabase edge functions vs vercel functions', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'ai-phone-agent-vs-chatbot-vs-live-chat', cluster: 'compare', title: 'AI Phone Agent vs Chatbot vs Live Chat', name: 'AI phone agent vs chatbot vs live chat', label: 'AI agents', topic: 'agents', blurb: 'I shipped a voice agent for a roofing company. Which channel actually books the job, by lead type.', target: 'ai phone agent vs chatbot', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'zapier-ai-vs-n8n-ai-agents', cluster: 'compare', title: 'Zapier AI vs n8n AI Agents', name: 'Zapier AI vs n8n AI agents', label: 'Automation', topic: 'automation', blurb: '20+ workflows across both. Where the managed version saves you and where it traps you.', target: 'zapier ai vs n8n ai agent', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'twilio-vs-whatsapp-business-api', cluster: 'compare', title: 'Twilio vs WhatsApp Business API', name: 'Twilio vs WhatsApp Business API', label: 'Messaging', topic: 'automation', blurb: 'Both wired into live products. Deliverability, cost, and the template approval reality.', target: 'twilio vs whatsapp api', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'stripe-checkout-vs-payment-links', cluster: 'compare', title: 'Stripe Checkout vs Payment Links', name: 'Stripe Checkout vs Payment Links', label: 'Payments', topic: 'software', blurb: 'Live billing on both. The fastest path to a first paid customer, and when to upgrade.', target: 'stripe checkout vs payment links', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'shopify-vs-custom-ecommerce', cluster: 'compare', title: 'Shopify vs Custom Ecommerce', name: 'Shopify vs custom ecommerce', label: 'Ecommerce', topic: 'software', blurb: 'Client builds on both. The revenue point where custom starts to pay for itself.', target: 'shopify vs custom store', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'wordpress-vs-astro', cluster: 'compare', title: 'WordPress vs Astro', name: 'WordPress vs Astro', label: 'Websites', topic: 'software', blurb: 'I have migrated sites off WordPress. What you gain, what you give up, who should not move.', target: 'wordpress vs astro', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'n8n-vs-make-deep-dive', cluster: 'compare', title: 'n8n vs Make: The Deep Cut', name: 'n8n vs Make: the deep cut', label: 'Automation', topic: 'automation', blurb: 'Past the feature table, into error handling, versioning, and what breaks at scale.', target: 'n8n vs make', published: '2026-08-11', modified: '2026-08-11', live: true },
  /* Web-app buyer cluster (added 2026-08-15): low-difficulty terms behind the web-apps
     service page, picked from live keyword data. */
  { slug: 'web-application-vs-website', cluster: 'compare', title: 'Web Application vs Website', name: 'Web application vs website', label: 'Basics', topic: 'software', blurb: 'I build both. The real difference, the gray zone in between, and which one your project actually needs.', target: 'web application vs website', published: '2026-08-15', modified: '2026-08-15', live: true },

  /* ---------------- Lane 2: AI and marketing (16) ---------------- */
  { slug: 'ai-for-seo', cluster: 'guides', title: 'How to Use AI for SEO', name: 'How to use AI for SEO', label: 'AI SEO', topic: 'marketing', blurb: 'What held up when I built 58 pages with AI, and the three places it produced work I had to throw away.', target: 'how to use ai for seo', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'programmatic-seo-with-ai', cluster: 'guides', title: 'Programmatic SEO with AI', name: 'Programmatic SEO with AI', label: 'Programmatic SEO', topic: 'marketing', blurb: 'I shipped 58 pages from one route and one data file. The method, the guardrails, and the part that decides whether it works.', target: 'programmatic seo ai', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'cold-email-ai-that-doesnt-sound-ai', cluster: 'guides', title: "Cold Email with AI That Doesn't Read Like AI", name: "Cold email with AI that doesn't read like AI", label: 'Outbound', topic: 'marketing', blurb: 'The tells that get you deleted, and the personalization layer that actually earns a reply.', target: 'ai cold email', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'ai-lead-enrichment', cluster: 'guides', title: 'AI Lead Enrichment That Survives Contact With Reality', name: 'AI lead enrichment that actually works', label: 'Lead gen', topic: 'automation', blurb: 'I enriched 254 contacts and had to throw away 44%. Why, and the checks that catch it.', target: 'ai lead enrichment', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'build-an-ai-sdr', cluster: 'guides', title: 'How to Build an AI SDR', name: 'How to build an AI SDR', label: 'Sales agents', topic: 'agents', blurb: 'A working sales agent: the tools it gets, the approval rules, and where a human stays in the loop.', target: 'how to build an ai sdr', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'ai-competitor-research', cluster: 'guides', title: 'AI Competitor Research', name: 'AI competitor research that works', label: 'Research', topic: 'marketing', blurb: 'How I pulled and read 866 competitor ads, and what to do with the answer.', target: 'ai competitor research', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'ai-ad-creative-workflow', cluster: 'guides', title: 'An AI Ad Creative Workflow That Ships', name: 'An AI ad creative workflow that ships', label: 'Paid ads', topic: 'marketing', blurb: 'Concept to rendered video, with the human decisions that cannot be automated.', target: 'ai ad creative', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'ai-landing-page-copy', cluster: 'guides', title: 'Writing Landing Page Copy with AI', name: 'Writing landing page copy with AI', label: 'Copy', topic: 'marketing', blurb: 'Where AI drafts well, where it flattens your voice, and the edit pass that fixes it.', target: 'ai landing page copy', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'ai-content-that-ranks', cluster: 'guides', title: 'AI Content That Ranks vs AI Content That Gets Ignored', name: 'AI content that ranks vs content that gets ignored', label: 'Content', topic: 'marketing', blurb: 'The difference is not the model. It is what you can say that nobody else can.', target: 'ai content seo', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'automate-your-crm-with-ai', cluster: 'guides', title: 'Automating a CRM with AI', name: 'Automating a CRM with AI', label: 'CRM', topic: 'automation', blurb: 'Eight AI-backed functions in a production CRM, and the two I turned back off.', target: 'ai crm automation', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'ai-voice-agents-for-follow-up', cluster: 'guides', title: 'AI Voice Agents for Lead Follow-Up', name: 'AI voice agents for follow-up', label: 'Voice', topic: 'agents', blurb: 'What a voice agent does well on inbound, and the failure modes to design around.', target: 'ai voice agent lead follow up', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'geo-for-local-business', cluster: 'guides', title: 'GEO for Local Business', name: 'GEO for local business', label: 'Local AI search', topic: 'marketing', blurb: 'How AI answers handle local intent, and the parts of your presence that feed them.', target: 'geo local business', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'ai-for-social-content', cluster: 'guides', title: 'Using AI for Social Content', name: 'Using AI for social content', label: 'Social', topic: 'marketing', blurb: 'Built from 19 posts and 33.1M plays of transcript analysis, not general best practice.', target: 'ai social media content', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'measure-ai-impact-on-marketing', cluster: 'guides', title: 'How to Measure AI’s Impact on Marketing', name: 'How to measure AI’s impact on marketing', label: 'Analytics', topic: 'marketing', blurb: 'Attribution that survives a cookieless setup, and the vanity metrics to drop.', target: 'measure ai marketing roi', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'ai-marketing-stack-small-team', cluster: 'guides', title: 'An AI Marketing Stack for a Small Team', name: 'An AI marketing stack for a small team', label: 'Stack', topic: 'marketing', blurb: 'The actual tools I run, what each replaced, and what I pay for them.', target: 'ai marketing stack', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'prompt-engineering-for-marketers', cluster: 'guides', title: 'Prompt Engineering for Marketers', name: 'Prompt engineering for marketers', label: 'Prompting', topic: 'marketing', blurb: 'The handful of patterns that carry production work. No prompt library required.', target: 'prompt engineering marketing', published: '2026-08-11', modified: '2026-08-11', live: true },
  /* Web-app buyer cluster (added 2026-08-15): guides feeding /services/web-apps. */
  { slug: 'web-app-development-cost', cluster: 'guides', title: 'Web App Development Cost in 2026', name: 'What a web app costs in 2026', label: 'Cost', topic: 'software', blurb: 'Real ranges for agencies, freelancers, and AI-assisted builds, what moves the number, and why almost nobody publishes theirs.', target: 'web app development cost', published: '2026-08-15', modified: '2026-08-15', live: true },
  { slug: 'web-application-examples', cluster: 'guides', title: 'Web Application Examples: 12 Real Apps', name: 'Web application examples, 12 real ones', label: 'Examples', topic: 'software', blurb: 'Famous web apps grouped by pattern, plus six I built and shipped myself, with what each one teaches.', target: 'web application examples', published: '2026-08-15', modified: '2026-08-15', live: true },

  /* ---------------- Lane 3: original research (12) ---------------- */
  { slug: '866-custom-software-ads', cluster: 'research', title: 'I Analyzed 866 Ads From 30 Custom Software Companies', name: 'I analyzed 866 ads from 30 custom software companies', label: 'Market study', topic: 'software', blurb: 'Screened from 585 advertisers running paid ads to US businesses. Three tiers, real prices, and the offers that have survived longest.', target: 'custom software company pricing', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'only-3-of-30-publish-a-price', cluster: 'research', title: 'Only 3 of 30 Software Companies Publish a Price', name: 'Only 3 of 30 software companies publish a price', label: 'Pricing study', topic: 'software', blurb: 'Pricing is hidden almost everywhere in this market, which makes publishing one the cheapest way to stand out.', target: 'custom software pricing transparency', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'guarantees-in-the-ad-library', cluster: 'research', title: 'Only 4 of 30 Offer a Guarantee', name: 'Only 4 of 30 offer a guarantee', label: 'Offer study', topic: 'software', blurb: 'And three of those four run the longest-lived ads in the set. The exact wording of each.', target: 'software development guarantee', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'ad-longevity-as-a-conversion-proxy', cluster: 'research', title: 'Ad Longevity Is the Closest Thing to a Public Conversion Signal', name: 'Ad longevity is a public conversion signal', label: 'Method', topic: 'marketing', blurb: 'One ad ran 564 days on a single creative. Nobody keeps paying for a losing ad.', target: 'meta ad library longevity', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'the-vibe-coding-wall', cluster: 'research', title: 'The Vibe-Coding Wall', name: 'The vibe-coding wall', label: 'Market insight', topic: 'software', blurb: 'One company launched 80 ad variants in two weeks around a single idea: you already tried building it with AI, and hit a wall.', target: 'ai app builder limitations', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: '10-hook-patterns-33m-plays', cluster: 'research', title: '10 Hook Patterns Behind 33.1M Plays', name: '10 hook patterns behind 33.1M plays', label: 'Content study', topic: 'marketing', blurb: '19 Instagram posts over 1M plays, transcribed and analyzed. The patterns, ranked by plays behind them.', target: 'viral hook patterns', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'tiktok-vs-instagram-physics', cluster: 'research', title: 'TikTok and Instagram Are Not the Same Game', name: 'TikTok and Instagram are not the same game', label: 'Platform study', topic: 'marketing', blurb: 'Shares are the lever on one, not the other. Duration is bimodal. The middle is dead.', target: 'tiktok vs instagram algorithm', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: 'carousels-are-depth-not-reach', cluster: 'research', title: 'Carousels Are Depth, Not Reach', name: 'Carousels are depth, not reach', label: 'Format study', topic: 'marketing', blurb: 'A tenth of the likes of a reel, and the same number of comments. What that means for what you post.', target: 'instagram carousel vs reel', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: '44-percent-of-ai-enriched-contacts-are-wrong', cluster: 'research', title: '44% of AI-Enriched B2B Contacts Were the Wrong Employer', name: '44% of enriched contacts were wrong', label: 'Data quality', topic: 'automation', blurb: 'Measured across 254 contacts at 100 companies. Two failure modes, and the check that catches both.', target: 'b2b data enrichment accuracy', published: '2026-08-11', modified: '2026-08-11', live: true },
  { slug: '40-products-in-a-year', cluster: 'research', title: 'What 40+ Shipped Products Taught Me About Scope', name: 'What 40+ shipped products taught me about scope', label: 'Build notes', topic: 'software', blurb: 'The scope decisions that survived contact with real users, and the ones that never do.', target: 'software project scope' },
  /* Blocked on data, not on writing. Checked 2026-08-11: the analytics tool held about two days
     of usable history across 27 sites, most of it one property. That cannot support a sentence
     like "a year of analytics across 20 sites" without implying data that does not exist.
     Revisit once there are several months of history. */
  { slug: 'what-20-sites-taught-me-about-traffic', cluster: 'research', title: 'What 20 Sites Taught Me About Traffic', name: 'What 20 sites taught me about traffic', label: 'Analytics study', topic: 'marketing', blurb: 'Cookieless analytics across a portfolio nobody is paying to promote.', target: 'small website traffic benchmarks' },
  { slug: 'the-false-zero-machine', cluster: 'research', title: 'The False-Zero Machine', name: 'The false-zero machine', label: 'Method', topic: 'marketing', blurb: 'Ad-library search ranks the wrong page first and returns a confident zero. How to detect it before it poisons your analysis.', target: 'meta ad library search accuracy', published: '2026-08-11', modified: '2026-08-11', live: true },
];

/** Guides published before the programme. `title` is each page's original title tag. */
export const EARLIER_GUIDES: ContentEntry[] = [
  { slug: 'why-hire-a-person-when-ai-can-build-it', cluster: 'guides', title: 'Why Hire a Person When AI Can Build It?', name: 'Why you still need a person when AI does the building', label: 'Working with AI', topic: 'software', blurb: 'Six defects AI shipped for me that passed every check, what each cost, and the review layer that catches them.', target: 'hire a developer or use ai', published: '2026-07-26', modified: '2026-07-26', live: true },
  { slug: 'how-to-build-an-mcp-server', cluster: 'guides', title: 'How to Build an MCP Server (Python and TypeScript)', name: 'How to build an MCP server', label: 'MCP', topic: 'agents', blurb: 'A working server in about 30 lines, then the parts that actually break.', target: 'how to build an mcp server', published: '2026-07-25', modified: '2026-07-25', live: true },
  { slug: 'n8n-vs-zapier-vs-make', cluster: 'guides', kind: 'comparison', title: 'n8n vs Zapier vs Make: Which to Pick in 2026', name: 'n8n vs Zapier vs Make', label: 'Automation', topic: 'automation', blurb: 'Shipped 20+ workflows across all three. How they differ and how to pick.', target: 'n8n vs zapier vs make', published: '2026-07-25', modified: '2026-07-25', live: true },
  { slug: 'postgres-row-level-security', cluster: 'guides', title: 'Postgres Row-Level Security: A Practical Guide', name: 'Postgres row-level security', label: 'Security', topic: 'software', blurb: 'Turn it on without breaking the app, plus the three gotchas that bite every time.', target: 'postgres row level security', published: '2026-07-25', modified: '2026-07-25', live: true },
  { slug: 'build-ai-agent-claude-code', cluster: 'guides', title: 'How to Build an AI Agent with Claude Code and MCP', name: 'How to build an AI agent with Claude Code and MCP', label: 'AI agents', topic: 'agents', blurb: 'A working pattern: one job, a few tools, clear approval rules, and real tests.', target: 'build ai agent claude code', published: '2026-06-30', modified: '2026-07-25', live: true },
  { slug: 'geo-generative-engine-optimization-guide', cluster: 'guides', title: 'GEO and AI Search: What Actually Helps in 2026', name: 'GEO and AI search: what actually helps', label: 'AI search', topic: 'marketing', blurb: 'The useful parts of AI search optimization, without the llms.txt myths or schema tricks.', target: 'generative engine optimization', published: '2026-06-30', modified: '2026-07-25', live: true },
  { slug: 'google-ai-overviews-guide', cluster: 'guides', title: 'How to Show Up in Google AI Overviews in 2026', name: 'How to show up in Google AI Overviews in 2026', label: 'Google search', topic: 'marketing', blurb: 'Google’s current guidance, translated into a practical checklist for your site.', target: 'google ai overviews seo', published: '2026-06-30', modified: '2026-07-25', live: true },
  { slug: 'what-is-mcp-model-context-protocol', cluster: 'guides', title: 'What Is MCP? A Plain Model Context Protocol Guide', name: 'What is MCP? A plain Model Context Protocol guide', label: 'MCP', topic: 'agents', blurb: 'What MCP connects, how clients and servers work, and where the USB analogy falls short.', target: 'what is mcp', published: '2026-06-30', modified: '2026-07-25', live: true },
  { slug: 'ship-web-app-in-days-with-ai', cluster: 'guides', title: 'How to Ship a Web App in Days with AI', name: 'How I ship a web app in days with AI', label: 'Product build', topic: 'software', blurb: 'The small-scope workflow I use to move from an idea to a reviewed, live app.', target: 'ship web app with ai', published: '2026-06-30', modified: '2026-07-25', live: true },
];

/** Comparisons that live as /software decision pages. Listed by the hubs, rendered elsewhere. */
export const ELSEWHERE: ContentEntry[] = [
  { slug: 'ai-phone-agent-vs-answering-service', cluster: 'compare', href: '/software/ai-phone-agent-vs-answering-service', title: 'AI Phone Agent vs Answering Service', name: 'AI phone agent vs answering service', label: 'Voice', topic: 'agents', blurb: 'What each one actually does with an after-hours call, and what it costs.', target: 'ai phone agent vs answering service', published: '2026-08-08', modified: '2026-08-08', live: true },
  { slug: 'lovable-replit-vs-hiring-a-builder', cluster: 'compare', href: '/software/lovable-replit-vs-hiring-a-builder', title: 'Lovable and Replit vs Hiring a Builder', name: 'Lovable and Replit vs hiring a builder', label: 'AI builders', topic: 'software', blurb: 'Where the AI builders get you, and the point they stop.', target: 'lovable vs hiring a developer', published: '2026-08-08', modified: '2026-08-08', live: true },
];

/* ---------------- read times ----------------
   Minutes to read each page's body and FAQ at 230 words a minute, counted from the page source.
   Recount after a large edit (the article layout prints the same number). */
export const READ_MINUTES: Record<string, number> = {
  '10-hook-patterns-33m-plays': 5, '44-percent-of-ai-enriched-contacts-are-wrong': 5,
  '866-custom-software-ads': 7, 'ad-longevity-as-a-conversion-proxy': 5, 'ai-ad-creative-workflow': 4,
  'ai-competitor-research': 5, 'ai-content-that-ranks': 4, 'ai-for-seo': 5, 'ai-for-social-content': 5,
  'ai-landing-page-copy': 4, 'ai-lead-enrichment': 5, 'ai-marketing-stack-small-team': 4,
  'ai-phone-agent-vs-answering-service': 2, 'ai-phone-agent-vs-chatbot-vs-live-chat': 4,
  'ai-sdr-vs-hiring-an-sdr': 4, 'ai-voice-agents-for-follow-up': 4, 'astro-vs-nextjs': 5,
  'automate-your-crm-with-ai': 5, 'build-ai-agent-claude-code': 6, 'build-an-ai-sdr': 4,
  'carousels-are-depth-not-reach': 5, 'claude-vs-gpt-for-coding': 4, 'cold-email-ai-that-doesnt-sound-ai': 4,
  'custom-crm-vs-gohighlevel': 4, 'firecrawl-vs-apify-vs-puppeteer': 4, 'geo-for-local-business': 4,
  'geo-generative-engine-optimization-guide': 5, 'gohighlevel-vs-hubspot': 4, 'google-ai-overviews-guide': 3,
  'guarantees-in-the-ad-library': 5, 'how-to-build-an-mcp-server': 5,
  'lovable-replit-vs-hiring-a-builder': 2, 'lovable-vs-replit-vs-bolt': 4, 'mcp-vs-function-calling': 5,
  'measure-ai-impact-on-marketing': 4, 'n8n-vs-make-deep-dive': 4, 'n8n-vs-zapier-vs-make': 5,
  'only-3-of-30-publish-a-price': 5, 'openrouter-vs-direct-api': 4, 'postgres-row-level-security': 5,
  'programmatic-seo-with-ai': 6, 'prompt-engineering-for-marketers': 4, 'resend-vs-mailgun': 5,
  'rls-vs-app-layer-auth': 4, 'ship-web-app-in-days-with-ai': 6, 'shopify-vs-custom-ecommerce': 4,
  'stripe-checkout-vs-payment-links': 4, 'supabase-functions-vs-vercel-functions': 5,
  'supabase-vs-firebase': 5, 'the-false-zero-machine': 5, 'the-vibe-coding-wall': 6,
  'tiktok-vs-instagram-physics': 4, 'twilio-vs-whatsapp-business-api': 4, 'vercel-vs-railway': 4,
  'web-app-development-cost': 5, 'web-application-examples': 4, 'web-application-vs-website': 4,
  'what-is-mcp-model-context-protocol': 4, 'why-hire-a-person-when-ai-can-build-it': 9,
  'wordpress-vs-astro': 4, 'zapier-ai-vs-n8n-ai-agents': 4,
};

export const readMinutes = (c: Pick<ContentEntry, 'slug'>): number | undefined => READ_MINUTES[c.slug];

/* ---------------- lists ---------------- */

/** The programme's live pages. The sitemap and llms.txt read this. */
export const liveContent = CONTENT.filter((c) => c.live);

export const byCluster = (cluster: Cluster) => CONTENT.filter((c) => c.cluster === cluster);
export const liveByCluster = (cluster: Cluster) => liveContent.filter((c) => c.cluster === cluster);

/** Every page that renders with the article layout. */
export const ARTICLES: ContentEntry[] = [...liveContent, ...EARLIER_GUIDES];

/** Every row the hubs list: the article pages plus the comparisons published elsewhere. */
export const RESOURCES: ContentEntry[] = [...ARTICLES, ...ELSEWHERE];

export const clusterPath: Record<Cluster, string> = {
  compare: '/compare',
  guides: '/guides',
  research: '/research',
};

export const urlFor = (c: ContentEntry) => `${clusterPath[c.cluster]}/${c.slug}`;
/** Where a row links: its own page, or the page it lives on outside the clusters. */
export const hrefFor = (c: ContentEntry) => c.href ?? urlFor(c);

const CLUSTER_KIND: Record<Cluster, Kind> = { compare: 'comparison', guides: 'guide', research: 'research' };
export const kindOf = (c: ContentEntry): Kind => c.kind ?? CLUSTER_KIND[c.cluster];

export const KIND_LABEL: Record<Kind, string> = { guide: 'Guide', comparison: 'Comparison', research: 'Research' };
/** Plural labels for the tabs. */
export const KIND_PLURAL: Record<Kind, string> = { guide: 'Guides', comparison: 'Comparisons', research: 'Research' };

/** The four topics on /resources, copy from the deck. */
export const TOPICS: { key: Topic; name: string; line: string }[] = [
  { key: 'agents', name: 'AI agents and voice', line: 'How AI agents and phone agents work, and how to build ones you can trust.' },
  { key: 'automation', name: 'Automation', line: 'Which tools to pick, and how to connect them so nobody copies data by hand.' },
  { key: 'software', name: 'Building software', line: 'What custom software costs, how long it takes and when to buy instead.' },
  { key: 'marketing', name: 'Marketing and AI search', line: 'Ads, content and SEO with AI, plus how to show up in AI answers.' },
];
