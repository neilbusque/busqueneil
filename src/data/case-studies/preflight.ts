import type { CaseStudy } from './types';

export const preflight: CaseStudy = {
  slug: 'preflight',
  name: 'Preflight',
  tagline: 'Run your funnel before you run your ads',
  category: 'SaaS · Marketing Tooling',
  year: '2026',
  status: 'Live in production',
  liveUrl: 'https://preflight.neilb.app',
  summary:
    'A node-canvas funnel simulator that lets you build, click through, and audit a full marketing funnel, ads to booking, before a dollar hits the ad account.',
  lede:
    'Preflight is a visual funnel builder that mocks up every step of a marketing funnel with faithful platform UI, then lets you click through it like a real prospect would. Build the ad, the landing page, the booking flow, and the follow-up in one canvas, walk it end to end, and find the broken step before you find it in your ad spend.',

  facts: [
    { k: 'Role', v: 'Solo builder, product + design + engineering' },
    { k: 'Timeline', v: '3 weeks, May–July 2026' },
    { k: 'Stack', v: 'Vite, React 18, TypeScript, React Flow, Supabase' },
    { k: 'Live', v: 'preflight.neilb.app' },
  ],
  stack: [
    'Vite',
    'React 18',
    'TypeScript',
    'Tailwind CSS',
    'React Flow (@xyflow/react)',
    'Framer Motion',
    'Supabase (Postgres, Auth, Storage, RLS)',
    'Vercel',
    'OpenRouter',
  ],
  metrics: [
    { value: '7', label: 'node types: ad, page, booking, email, SMS, action, decision' },
    { value: '5', label: 'live QA rounds across v1 through v4' },
    { value: '85+', label: 'automated tests (vitest) covering graph logic and analyzer parsing' },
  ],

  problem: {
    title: 'The problem',
    body: [
      "Most funnels fail somewhere nobody walked before launch. Not the offer, not the targeting, the plumbing: a booking link that opens to the wrong calendar, a follow-up SMS that fires before the email does, a decision branch nobody built the no-show path for. Nobody catches it because nobody experiences the funnel as a prospect would before spending is live. Reviewing a funnel today means opening five different tools, an ad manager, a page builder, a CRM, an email platform, a texting app, and mentally stitching them into a sequence. Nobody actually does that. So the first real walkthrough happens after the money's out the door, when a lead comments that the booking page 404s or the SMS never sent.",
      "The failure mode isn't bad strategy. It's an unwalked path. A funnel is a sequence of screens and decisions, and the only way to know if the sequence holds together is to move through it in order, seeing exactly what the prospect sees at each step, including the branches: what happens if they book, what happens if they ghost, what happens if they show up and no-show. Nobody builds a tool for that because it sits between two disciplines: it needs the visual fidelity of a design tool and the logic of a flowchart. Preflight is built to close that gap.",
    ],
  },

  approach: {
    title: 'The approach',
    body: [
      "Preflight does three jobs and the product is organized around exactly those three, no more: simulate the funnel, pitch it to a client or stakeholder, and audit it against real benchmarks. Simulate means build the sequence as nodes and walk it in play mode like a prospect would, including every branch. Pitch means the same canvas, in front of a client, replaces a slide deck: click through the actual ad, actual landing page, actual booking flow, with commenting turned on so they can react node by node. Audit means run the finished sequence, or a single piece of it, against a benchmark knowledge base and get a scored report with specific fixes, not a vague grade. Three jobs, one canvas, no context-switching between tools to do any of them.",
      "The core data model is a node graph: `funnels.graph` is a JSON blob of nodes and edges, each node carrying its own `config`, optional `metrics`, and optional `variants`. Edges carry timing labels ('Day 1', 'after 3 days no-show') so the sequence reads as a real campaign cadence, not just a flowchart. Decision nodes are the one node type that fans out more than a single edge, one branch per outcome (booked / no-show / ghosted), and every other node type enforces a strict one-outgoing-edge rule. That asymmetry is deliberate: it's what makes branching legible on the canvas instead of turning into an unreadable web, and it's the rule the drag-to-create interaction and the AI graph generator both have to respect.",
      "React Flow (`@xyflow/react`) is the canvas engine, but the differentiator isn't the graph library, it's the mockups. Every node type renders as a full-fidelity, platform-authentic mockup: five ad variants across Facebook feed, Instagram feed and story, LinkedIn, and Google; a browser-framed landing page (live URL via iframe or an uploaded screenshot); a Calendly-style booking screen; a Gmail-style email; an iMessage-style SMS thread; a phone-call or DM action screen themed per platform. This matters because Preflight has to work as a pitch tool in front of a non-technical stakeholder. A generic flowchart with labeled boxes doesn't land in a client meeting. A mockup that looks exactly like the Facebook ad they'll actually see does. Faithful platform chrome is what turns 'here's our plan' into 'here's what your customer sees,' and that's the sentence that closes the pitch.",
      "The product was originally named Funnel Simulator, which described the mechanism but not the reason anyone would use it. On 2026-07-03 it was rebranded to Preflight, with the tagline 'Run your funnel before you run your ads.' The rename reframes the product around an aviation metaphor that's already fluent to anyone who's flown: you don't take off without a checklist, you don't spend on ads without walking the sequence first. The visual system followed the metaphor directly, a checkmark-to-ascent logo mark meant to read as 'cleared for launch,' a coral-and-navy palette chosen for confidence over cuteness, and a literal preflight-checklist device used across the marketing site. Positioning language shifted from 'build and preview a funnel' to 'clear it before you spend,' which is a small wording change that changes who the product is for: not just funnel builders, but the person who has to sign off on ad spend.",
      "Every non-trivial feature after the rebrand was scoped against those three jobs. Page builder blocks and an A/B variant system serve simulate (make the mockup match reality). Comment threads on public share links serve pitch (a client reacts on the node, not in a separate feedback doc). The analyzer, benchmark citations, and PageSpeed-backed URL audits serve audit (a scored report instead of a gut check). Anything that didn't clearly serve one of the three didn't ship.",
    ],
  },

  timeline: [
    { when: '2026-06 (v1)', title: 'Core canvas + play mode', what: 'Node-canvas editor with five node types, edge timing labels, decision-node branching, public play mode, share links, autosave.' },
    { when: '2026-07-02', title: 'Live QA + autosave bug fixed', what: 'Headless Playwright pass on a seeded funnel: play, branching, share, RLS, and keyboard all verified. Found and fixed a debounce bug where React Flow\'s idle position/selection churn reset the autosave timer indefinitely.' },
    { when: '2026-07-03', title: 'v2: page builder, AI generation, device toggle', what: '10-block page builder, AI funnel generation via OpenRouter, mobile device toggle across all mockup types, Facebook feed intro sequence.' },
    { when: '2026-07-03', title: 'v3: Funnel Analyzer', what: 'Benchmark-grounded audit engine, five audit scopes, scored reports with per-section findings and one-click fix application.' },
    { when: '2026-07-03', title: 'v3.1: URL landing audit', what: 'Drop-a-link auto-audit backed by Google PageSpeed Insights, no funnel required, plus branded PDF export via print-to-PDF.' },
    { when: '2026-07-03', title: 'Rebrand: Funnel Simulator to Preflight', what: 'New name, tagline, logo mark, coral/navy brand system, and a public marketing landing page at the root domain (dashboard moved behind /app).' },
    { when: '2026-07-03', title: 'Action node + drag-to-create', what: 'Call and DM node type with platform-themed threads; drag out of any node\'s handle to drop and create the next node in one motion.' },
    { when: '2026-07-04', title: 'v4: multi-tenant + custom domain', what: 'Moved off a single shared unlock password to real per-account auth with row-level security, added a daily AI usage cap, launched on preflight.neilb.app with transactional email via Resend.' },
  ],

  features: [
    {
      group: 'Canvas editor',
      items: [
        'n8n-style node cards with colored icon chips per node type',
        'Auto-layout ("Tidy") via dagre graph layout',
        'Full-screen node editor: live mockup and editable inspector side by side, autosaves on every change',
        'Drag out of any node\'s connector and drop on empty canvas to create and auto-wire the next node',
      ],
    },
    {
      group: 'Node types',
      items: [
        'Ad: 5 platform variants (Facebook feed, Instagram feed and story, LinkedIn, Google)',
        'Page: live URL iframe, uploaded screenshot, or a 10-block page builder (nav, headline, media, bullets, CTA, form, testimonial, guarantee, footer) with an accent-color theme',
        'Booking, Email, SMS: Calendly-style, Gmail-style, and iMessage-style mockups',
        'Action: phone-call script screen or platform-themed DM thread (Instagram, LinkedIn, Messenger, X, WhatsApp)',
        'Decision: the one node type that branches, one outgoing edge per outcome',
      ],
    },
    {
      group: 'Play mode',
      items: [
        'Public, anonymous-capable click-through of the full sequence',
        'Facebook-feed intro: auto-scrolling fake feed that lands on the real ad before the journey starts',
        'Decision nodes let the presenter pick the branch live',
        'Desktop and mobile device toggle, phone-framed mockups on mobile',
        'Keyboard navigation (forward, back, replay)',
      ],
    },
    {
      group: 'Audit engine',
      items: [
        'Five scopes: whole funnel, landing page, ad, opt-in, email',
        'Drop-a-URL express audit backed by Google PageSpeed Insights, no funnel setup required',
        '0-100 score with per-section findings, each citing a benchmark (Unbounce conversion medians, WordStream CTR/CPC, Klaviyo email data)',
        'One-click deterministic fix application, or an AI-assisted edit instruction',
        'Branded PDF export via print-to-PDF with a customizable CTA block',
      ],
    },
    {
      group: 'Sharing + collaboration',
      items: [
        'Public share links with a view-only, comment-enabled mode',
        'Comment threads pinned to a specific node, resolvable by the owner',
        'A/B variants per node with side-by-side compare and in-play toggle',
        'Funnelytics-style per-node analytics: traffic, spend, impressions, clicks, revenue, and edge conversion percentages',
      ],
    },
    {
      group: 'Marketing site',
      items: [
        'Public landing page with a live canvas mockup in the hero',
        'Three-jobs framing (Simulate, Pitch, Audit) with feature deep-dives using the same real product mockups',
        'How-it-works checklist, agency/operator use-case split, FAQ, dark final-CTA band',
        'Reveal-on-scroll animation that respects reduced-motion preference',
      ],
    },
  ],

  hardParts: [
    {
      title: 'Drag-to-create without breaking the branching rule',
      problem:
        'Every node type except decision must have exactly one outgoing edge; decision nodes must have exactly one outgoing edge per outcome. The drag-to-create feature (drag out of a node\'s connector, drop on empty canvas, pick a type) had to create a new node AND wire the edge in one motion, without a code path that could violate that rule.',
      solution:
        'Wired the interaction through React Flow\'s `onConnectStart`/`onConnectEnd` (not present before this feature), which fire on a drag-out from a handle even when it doesn\'t land on an existing node. On drop over empty canvas, a node-type menu opens at the drop point; picking a type calls the same `addNode` path used by the toolbar palette, positioned via `screenToFlowPosition`, then auto-connects from the source using the exact same linear-one-edge / decision-per-outcome logic that governs manual `onConnect`. One rule set, two entry points, no special case for the drag-to-create path to drift out of sync with manual connection.',
    },
    {
      title: 'A scrollable canvas mock broke mobile page width',
      problem:
        'The new marketing landing page hero included a live, scrollable canvas mockup. On mobile it forced the entire page wider than the viewport, horizontal overflow on every section, not just the hero, because a flex/grid child with intrinsic scrollable content doesn\'t shrink below its content width by default.',
      solution:
        'The fix was a single missing Tailwind utility: `min-w-0` on the grid/flex container wrapping the canvas mock. Without it, a grid item defaults to `min-width: auto`, which lets its content (the scrollable canvas) dictate the column\'s minimum width instead of the column constraining the content. Caught in a puppeteer QA pass at 390px and 1440px specifically because the bug was invisible at desktop width and only showed up as overflow on narrow viewports.',
    },
    {
      title: 'Autosave silently stopped firing mid-session',
      problem:
        'A debounced autosave never fired while a user was actively working the canvas, even though data was correctly persisted on navigate-away. React Flow\'s `onNodesChange` handler was folding every change type, including idle `select` and `dimensions` events that fire on hover and layout measurement, back into the graph state, which reset the debounce timer on every one of those non-substantive events. The debounce effectively never had 2.5 seconds of quiet to fire.',
      solution:
        'Live QA (headless Playwright against a seeded funnel) caught the gap between "data survives" and "the save indicator is honest." Fixed by filtering `onNodesChange` to only persist actual `position` changes into the debounce trigger, plus adding a 2.5-second hard max-wait so a continuously-dragged node still saves periodically instead of waiting for a pause that dragging never produces.',
    },
    {
      title: 'Public share links needed the platform-security default turned off',
      problem:
        'Vercel\'s deployment protection (SSO gating) is on by default for a personal-account project, which is correct for an internal tool but silently breaks the entire pitch use case: a client clicking a public play/share link would hit a login wall instead of the funnel.',
      solution:
        'Deployment protection had to be explicitly disabled at the Vercel project level for `/:id/play` and `/preview` to actually be public. This is easy to miss because everything looks correct in local dev and in an authenticated browser session, the break only shows up when someone outside the account opens the link, which is exactly the moment it matters most (a client, mid-pitch, clicking a link Neil just sent them).',
    },
    {
      title: 'Going multi-tenant without an app-store level rewrite',
      problem:
        'The app shipped single-tenant first: one shared "app-unlock password" logged everyone into the same Supabase user, and row-level security was `authenticated = true`, meaning any signed-in session could see every row. Converting to real per-account isolation after the fact meant migrating live data without breaking the three funnels and eleven analyses that already existed.',
      solution:
        'Added a `user_id` column (default `auth.uid()`) to `funnels` and `analyses`, backfilled every existing row to the one prior user, then rewrote RLS to owner-only on those tables and owner-via-funnel on the dependent `comments` table, while preserving anonymous read (and, for public funnels, anonymous comment/insert) so play and pitch links kept working for logged-out viewers. New rows need zero application code changes to be correctly owned, the database default handles it. Paired with an atomic `bump_ai_usage` Postgres function (check-then-increment in one round trip) to enforce a daily AI generation cap per user without a race condition.',
    },
  ],

  outcome: {
    title: 'Where it landed',
    body: [
      "Preflight is live at preflight.neilb.app (also reachable at preflight.busqueneil.com and funnels.busqueneil.com, all serving the same deployment) with real multi-tenant accounts, transactional email, and a public marketing site separate from the authenticated app. It's in active use two ways: as a client-facing pitch tool, walking a prospect through their exact funnel with real platform mockups instead of a slide deck, and as Neil's own planning canvas for scoping funnel work before it's built, catching sequencing problems on a node graph instead of in a live campaign.",
      "The audit engine runs against a curated benchmark knowledge base (Unbounce, WordStream, Klaviyo, plus copy-quality heuristics) and, for landing pages, against live Google PageSpeed Insights data, so a report cites a real number instead of a generic score. That's the piece that turns the tool from a mockup builder into something with teeth: it doesn't just show what the funnel looks like, it tells you specifically where it's weak against real conversion benchmarks and lets you apply the fix on the spot.",
    ],
  },

  lessons: [
    'A tool that has to double as a pitch instrument needs pixel-faithful mockups, not schematic placeholders, fidelity is the difference between a plan and a demo.',
    'One asymmetric rule (decision nodes branch, everything else is linear) kept a graph-based UI legible at scale instead of turning into an unreadable web.',
    'The bug that broke mobile page width lived in a single missing `min-w-0`, viewport-specific QA at real breakpoints catches what desktop testing never will.',
    'Retrofitting multi-tenancy is a database-default problem more than an application-code problem: get the schema and RLS right and the app layer barely changes.',
    'A rename isn\'t just an asset swap, "Preflight" changed who the pitch was for, from funnel builders to the person who signs off on spend.',
    'Debounced autosave needs a hard max-wait as well as a quiet-period trigger, continuous interaction (like dragging) can prevent the quiet period from ever occurring.',
  ],

  proof:
    'Preflight is a marketing tool built by someone who runs marketing funnels for a living, which is why the product logic mirrors how a real campaign actually breaks: sequencing, branching, and the gap between what a deck promises and what a prospect sees. It shows I can take a product from a raw mechanism to a positioned brand, ship the unglamorous infrastructure underneath it (multi-tenant auth, RLS, benchmark-grounded scoring), and keep shipping without breaking what\'s already live.',
};
