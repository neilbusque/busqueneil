import type { CaseStudy } from './types';

export const orbit: CaseStudy = {
  slug: 'orbit',
  name: 'Orbit',
  tagline: 'A multi-tenant CRM built and shipped solo',
  category: 'SaaS · CRM',
  year: '2026',
  status: 'Live in production, paid subscribers',
  liveUrl: 'https://www.inorbit.one',
  summary:
    "I built Orbit as a personal contact tool and turned it into a live multi-tenant CRM with real Stripe subscribers, a built-in AI operator, and a 200-plus-page marketing site, shipping a new version almost daily for eight straight weeks.",
  lede:
    "Orbit started as a way to stop losing track of people. Everyone I actually needed to stay in touch with, personal contacts, work relationships, leads, clients, was scattered across apps that didn't talk to each other, so I built a CRM for myself in a weekend. Then I kept building, and twenty-four days later it was taking real Stripe payments, with its own AI assistant, its own billing, and its own marketing site.",

  facts: [
    { k: 'Role', v: 'Sole builder: product, engineering, design, deploy' },
    { k: 'Timeline', v: 'Built May 2026, still shipping weekly' },
    { k: 'Stack', v: 'React, TypeScript, Vite, Supabase, Stripe' },
    { k: 'Scale', v: '246 migrations, 99 edge functions, 6 languages' },
  ],

  stack: [
    'React 18',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'Supabase (Postgres, Auth, Edge Functions, Realtime)',
    'Stripe',
    'DeepSeek',
    'Mailgun',
    'Deepgram',
    'react-i18next',
    'Tauri',
    'Vercel',
  ],

  metrics: [
    { value: '246', label: 'database migrations shipped' },
    { value: '96', label: 'edge functions in production' },
    { value: '6', label: 'languages shipped' },
    { value: '24 days', label: 'idea to first Stripe payment' },
  ],

  problem: {
    title: 'Why Orbit exists',
    body: [
      "The tools that already exist for this are built for sales teams, not for one person managing every relationship in their life. Close, HubSpot, and their peers all assume a sales org underneath them: a pipeline built around revenue, seats for reps, dashboards for a manager. I didn't want a sales tool. I wanted one place for everyone, a lead from a cold email, a client mid-project, a friend I hadn't called in four months, a family birthday.",
      "The alternative, a spreadsheet or a Notion database, has no memory. It doesn't tell you it's been three months since you talked to someone. It doesn't log a call automatically or know the difference between a coffee catch-up and a sales follow-up. I wanted something with Close CRM's discipline, structured contacts, real pipelines, a timeline that updates itself, but scoped to a person's whole life instead of just their quota.",
      "So I built it for myself first, no market research, no landing page, just a schema and a weekend. It turned out the same gap existed for other people running a business alone or with a small team: too big for a spreadsheet, priced out of or overbuilt by the sales-org tools. That gap is what the SaaS version sells into.",
    ],
  },

  approach: {
    title: 'The build: decisions and why',
    body: [
      "The first real architectural call came four days in. I'd built Orbit around owner_id = auth.uid(), every row belongs to one user. Fine for a personal tool, but I could see it wouldn't survive a second user, let alone a team. So I rebuilt the data model around workspace membership instead of ownership: every user gets a private Personal workspace by default and can create or join team workspaces with Owner, Admin, and Member roles. Row-level security policies check workspace membership, not who created the row; owner_id stayed in the schema but got demoted to authorship metadata, who added this contact, not who can see it. Doing that rewrite in week one, before there was any real data to migrate, cost a day. Doing it after launch would have meant rewriting every table's RLS policy under live traffic. That's the kind of decision that's cheap early and expensive later, so I made it early.",
      "Orbit runs on the same stack as two other apps I'd already shipped, React, TypeScript, Vite, Tailwind, Supabase, installed as a PWA instead of built native. That wasn't a technology debate, it was a speed decision. A PWA means one codebase and a ship-to-production cycle measured in minutes, not an App Store review queue measured in days. For a solo builder iterating multiple times a day, that's the difference between shipping a fix this afternoon and waiting a week for someone else's review process. A native wrapper came later anyway, a small Tauri shell that loads the live web app in a menu-bar window, but the core product never left the browser.",
      "AI is the feature that makes Orbit more than a CRM: an assistant named Hiro that can read and act on your data through close to a hundred tools. The billing model for that had to work at SaaS margins, not \"pass through whatever the API costs.\" I moved the platform's shared AI key off OpenRouter onto DeepSeek specifically for cost, DeepSeek runs the same chat completions at a fraction of the per-token price, which is what makes a real free tier possible. Every workspace gets a monthly credit grant that resets automatically, no credit card, no API key to paste in, and paid tiers get more credits plus the option to bring your own key. The unit economics only work because the free path runs on the cheap model: a chat reply costs about a credit, a background job run costs six to eight, and DeepSeek is what keeps that at roughly 60 to 80 percent margin instead of losing money on every free user.",
      "Email was originally wired through each user's own Gmail account, which sounds convenient until you hit Google's OAuth verification process for a multi-tenant app requesting Gmail scopes, a slow review queue that resets every time you add a scope. I migrated the entire send and receive path off Gmail onto Mailgun on a domain Orbit owns, with a catch-all inbound route and bounce and complaint webhooks instead of polling an inbox. That trades \"your email, your Gmail\" for \"Orbit sends it, tracked and rate-limited,\" the tradeoff every real SaaS with transactional email eventually makes. It also unlocked things Gmail never would have: encrypted email bodies at rest, tiered send caps by plan, and automatic sender suspension on a bounce or spam spike.",
      "The AI system also went through a real reversal worth naming, not just a build-forward story. Early on I built eighteen named agents, each with its own persona and job: one for prospecting, one for chasing deals, one for drafting invoices. It looked impressive in a demo and was a maintenance problem in practice, eighteen prompts to keep coherent, eighteen places a bug could hide, and users who couldn't tell which agent to talk to. I collapsed the whole roster into one identity, Hiro, that chats when you talk to it and runs background jobs when a trigger fires, both against the same tool catalog and the same memory. Seven of the old named agents became job templates under that one AI. Three stayed native, two of them because they are deterministic, no-LLM logic on purpose, and forcing them onto a language model would have made them worse, not better. Knowing when not to use the AI is as much a design decision as knowing when to.",
    ],
  },

  timeline: [
    {
      when: '2026-05-26',
      title: 'Built as a personal CRM',
      what: 'Shipped the first schema: contacts, interactions, pipelines, and change history across 11 tables, with row-level security scoped to owner_id.',
    },
    {
      when: '2026-05-30',
      title: 'Rebuilt for multi-workspace teams',
      what: 'Replaced the owner-based security model with workspace membership and Owner/Admin/Member roles, before there was real user data to migrate.',
    },
    {
      when: '2026-06-11',
      title: 'Marketing site and SEO build',
      what: 'Stood up the standalone marketing site at inorbit.one with a full editorial redesign and a 122-page programmatic SEO corpus, later grown past 200 pages.',
    },
    {
      when: '2026-06-19',
      title: 'Went live as paid SaaS',
      what: 'Turned on Stripe billing in live mode, migrated all outbound and inbound email off Gmail onto Mailgun, and shipped the multi-language UI.',
    },
    {
      when: '2026-06-20',
      title: 'Switched the AI platform to DeepSeek',
      what: 'Moved the shared assistant key off OpenRouter onto DeepSeek and built an admin panel for rotating platform API keys without a redeploy.',
    },
    {
      when: '2026-06-25',
      title: 'Redesigned the AI system around one assistant',
      what: 'Retired the eighteen-agent roster and rebuilt Hiro as a single chat-plus-jobs identity sharing one memory and one tool catalog.',
    },
    {
      when: '2026-06-26',
      title: 'Shipped hands-free voice mode',
      what: 'Added speech-to-text and text-to-speech so Hiro can be talked to and talk back, with barge-in and voice-confirmed writes.',
    },
    {
      when: '2026-07-09',
      title: 'Full visual rebrand',
      what: 'Replaced the brand system app-wide: a new mark, new display type, and a dark navy palette across the product and the marketing site.',
    },
    {
      when: '2026-07-16',
      title: 'Restructured pricing to four tiers',
      what: 'Moved to Free, Lite at $8/mo, Pro at $14/mo with MCP access, and Team at $20 per seat with unlimited AI use.',
    },
    {
      when: '2026-07-17',
      title: 'Version 2.28, still shipping',
      what: 'Latest release cleaned up the mobile layout. The app has shipped a new version on most days since the first commit.',
    },
  ],

  features: [
    {
      group: 'CRM core',
      items: [
        'Contacts with rich profiles, socials, and custom fields',
        'Companies and deal pipelines with drag-and-drop stages',
        'Automatic interaction timeline and change history',
        'Smart lists: reconnect reminders, birthdays, per-segment views',
        'Freeform structured Tables for anything that does not fit a contact',
      ],
    },
    {
      group: 'Communication',
      items: [
        'Unified inbox across email, SMS, WhatsApp, and live chat',
        'Email sent via Mailgun with four sending methods including BYO SMTP',
        'Multi-step automations: wait, follow-up-if-no-reply, tag, webhook, drip',
        'Embeddable live-chat widget with AI fallback when the team is away',
      ],
    },
    {
      group: 'Hiro, the AI operator',
      items: [
        'Chat assistant with close to 100 tools across the whole CRM',
        'Hands-free voice mode with barge-in and voice-confirmed writes',
        'Background jobs on triggers: inbound email, deal-stage change, schedule, new contact',
        'Persistent memory, proactive check-ins, and a 30-day chat history',
      ],
    },
    {
      group: 'Page and site builder',
      items: [
        'Landing pages, forms, and scored quizzes across five curated visual styles',
        'Themed booking pages with real-time availability',
        'Custom domains per workspace',
        'Guest-editable shared project boards, no login required',
      ],
    },
    {
      group: 'Money',
      items: [
        'Invoices and proposals with e-signature',
        'Stripe Checkout on invoices, deposit and balance or full payment',
        "Orbit's own subscription billing running on live Stripe",
      ],
    },
    {
      group: 'Platform',
      items: [
        'Multi-workspace teams with Owner/Admin/Member roles',
        'Six shipped languages: English, Spanish, French, German, Portuguese, Danish',
        'Installable PWA plus a native macOS menu-bar app',
        'Chrome extension for one-click contact capture',
        'MCP server for programmatic access on Pro and Team',
      ],
    },
  ],

  hardParts: [
    {
      title: 'A security counter that never counted',
      problem:
        "The vault PIN lockout wrote failed_count = failed_count + 1 and then raised an exception to reject the wrong PIN. It read correctly, passed code review twice, and the wrong-PIN case worked in every test. But PostgREST runs each RPC in one database transaction, and a raise rolls back every write in that call, including the increment that ran right before it. The lockout counter was permanently zero. A 6-character PIN was brute-forceable at HTTP request rate.",
      solution:
        "Found it by measuring, not reading: checking failed_count after a deliberately wrong attempt and seeing 0 instead of 1. Fixed by returning a status from the function instead of raising, NULL on a wrong PIN, a real value on success, and raising only on the lockout branch itself, which writes nothing so there is nothing to roll back. The client side had to change too: error === null had been silently treated as success, so the fix meant checking the returned value, not just the error.",
    },
    {
      title: 'Voice replies that played through a phone set to silent',
      problem:
        "Hiro's voice mode worked in every test and was completely silent on a real iPhone, with no error on screen. An HTML audio element obeys the iOS hardware ring and silent switch by design, so a flipped switch mutes every reply with nothing to catch.",
      solution:
        'Routed text-to-speech playback through the Web Audio API instead of an audio tag, unlocked inside the same user gesture that starts the mic, which plays through the silent switch the same way mobile games get sound on a muted phone. Added an on-screen error state for anything that still fails, so a real failure is never silent again either.',
    },
    {
      title: 'A scheduled job that silently never fired',
      problem:
        'A daily briefing job stopped running with no error anywhere. The scheduler advanced its next-run timestamp first, then fired the actual job as an un-awaited request and returned immediately, on the assumption the request would still go out in the background. The edge runtime tears down background work after the response is sent, so the dispatch was silently dropped, and because the timestamp had already advanced, it would not even retry until the next scheduled slot.',
      solution:
        'Awaited the fan-out dispatch before returning from the scheduler. The rule that came out of it: any function that fires another function as a side effect has to await that call. Fire-and-forget after a response is not fire-and-forget, it is often just forgotten.',
    },
    {
      title: 'The default cloud permissions were a live breach',
      problem:
        'A routine audit found that the anon and authenticated database roles held every privilege, including delete and truncate, on every table by default, and that the anon key ships inside the browser bundle. That meant the public key alone could read real customer data and destroy any table, on the stock configuration the platform ships with.',
      solution:
        'Ran a full lockdown: enable and force row-level security on every table, revoke all default grants from anon and authenticated, and set default privileges going forward so the next migration cannot silently reopen new tables the same way. Verified it by hitting the API with the real anon key and confirming a rejection, not by reading the config and assuming it worked.',
    },
  ],

  outcome: {
    title: 'Where it landed',
    body: [
      'Orbit is live at app.inorbit.one, currently on version 2.28, with a standalone marketing site at www.inorbit.one carrying over 200 SEO-built pages. It runs on 246 applied database migrations and 96 deployed edge functions behind a Postgres database with row-level security enforcing every workspace boundary.',
      'Pricing is Free, Lite at $8 a month, Pro at $14 a month with MCP access, and Team at $20 per seat a month with effectively unlimited AI use. Stripe billing is live, not test mode, real subscriptions with a webhook that reconciles payment to plan. A founding promo code cuts Pro to $7 a month for life for early adopters.',
      'It ships in six languages, installs as a PWA, has a native macOS menu-bar companion app, a Chrome extension for one-click contact capture, and an MCP server for programmatic access on paid plans. Since the first commit it has shipped a new version on most days, sometimes several in one day, through the same GitHub-to-Vercel pipeline the whole way.',
    ],
  },

  lessons: [
    'A rewrite is cheap before there is data and expensive after. Make the architecture call you can already see coming while it still only costs a day.',
    'Fire-and-forget in a serverless function is not a shortcut, it is a bug waiting for the runtime to tear down before your request lands. Await it.',
    'A function that looks correct and passes review can still be dead code. Measure the counter after the attempt, do not trust the code path.',
    'Cutting scope can be the upgrade. Sixteen agents looked like more product. One assistant that actually works was the better product.',
    'Cheap model infrastructure is a margin decision, not a footnote. The model you run a free tier on decides whether the free tier can exist at all.',
    'Default cloud permissions are not safe defaults. Audit row-level security and key grants on day one, not after a customer asks about security.',
  ],

  proof:
    "Orbit is proof I can take a product from a blank schema to real paying subscribers by myself, the database design, the billing, the AI integration, the email infrastructure, and the marketing site that brings people in. If you need something built end to end, not just designed or just coded, this is what that actually looks like.",
};
