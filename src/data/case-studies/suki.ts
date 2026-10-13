import type { CaseStudy } from './types';

export const suki: CaseStudy = {
  slug: 'suki-neighbors',
  title: 'A neighborhood food marketplace that replaced a group chat',
  category: 'Software',
  year: '2026',
  seoTitle: 'Case study: a neighborhood marketplace app',
  seoDescription:
    'A food marketplace scoped to one residential building at a time, replacing the buy-and-sell group chat. Built and shipped by one person in under two weeks.',
  summary:
    'A food marketplace scoped to one residential building at a time, with live stock, seller tools and moderation, built and shipped in under two weeks.',
  lede:
    'In a lot of apartment buildings, home cooks and small sellers sell food through a group chat everyone is already in. I built a marketplace to replace that chat, scoped to one building at a time, and took it from spec to a live, installable app in about two weeks.',

  facts: {
    whoFor: 'Home cooks, small sellers and their neighbors in one building',
    built: 'A two-sided marketplace with live stock, seller tools, moderation and its own SEO pages',
    timeline: 'July 2026, 60+ releases in under two weeks',
    stack: 'Next.js 16, Supabase, Mailgun, Vercel',
  },

  stack: [
    'Next.js 16 (App Router, TypeScript, React 19)',
    'Tailwind CSS 3',
    'Supabase (Postgres, Auth, Storage, Realtime)',
    'Vercel (Cron, edge caching)',
    'Mailgun (transactional email, bounce and complaint webhooks)',
    'Web Push (VAPID)',
    'Installable web app (manifest, no service-worker caching)',
  ],

  metrics: [
    { value: '65', label: 'Database migrations shipped live' },
    { value: '600+', label: 'Automated tests' },
    { value: '130+', label: 'Live routes and pages' },
  ],

  problem: {
    body: [
      "Many residential buildings have a buy-and-sell group chat, sometimes three per building. Neighbors post what they're cooking that week, whatever a home cook or a small kitchen has ready, and buyers reply in the thread to claim a plate. Money changes hands, but the chat was never built to be a market.",
      'A building turns a few sellers and their regular customers into a real market, but the chat has no memory. A listing posted in the morning is buried under two hundred messages by night. Buyers ask "is it still available?" into threads the seller has not read in hours, hear nothing and give up. Sellers cannot tell a serious buyer from someone who will claim the last order and vanish.',
      "The big platforms do not solve this. Delivery apps take a commission a small home-cooked plate cannot absorb, and their riders often cannot get past a building's front desk. The market is real, every building has one, but it is a market of maybe forty sellers and a few hundred regular buyers: too small for a national platform and too messy for a chat app.",
    ],
  },

  approach: {
    body: [
      'I built it as an installable web app, not an app store listing. A product for one building does not clear the bar for an app store download: nobody searches a store for their building\'s food group. A link dropped into the same chat it replaces, tapped once and added to the home screen, gets someone from zero to browsing in under a minute.',
      "The tenancy model is the real product decision. Most marketplaces scope by distance; I scoped by community, chosen once at signup, because the real market boundary is the building, not a radius that pulls in three unrelated towers and none of the trust. A community can be public, unlisted or behind a join code, and the person who already runs the building's chat becomes its manager, with co-admins, a moderation queue and a printable QR code that lets people join without typing anything.",
      'Discovery and trust had to work for dozens of sellers, not thousands. Ratings belong to the seller, one per order, shown once a seller has one. Verification is a manual review of submitted proof, not a checkbox. Listings drop off the feed twelve hours after a seller last touched them, which turns "is it still available?" into a fact the app enforces. Sellers get a few free boosts each month instead of a pay-to-win auction, because paying to outrank your own neighbor breaks the thing that makes the market work.',
      'The app never touches money. Each seller sets the payment methods they accept, cash on delivery, a mobile wallet or a bank transfer, and the buyer pays the seller directly, the way the chat already worked. That also keeps the platform clear of the tax rules that apply once a platform holds or passes on funds. Delivery is the seller walking a plate to the door or a scheduled pickup, with an automatic apology and stock restore if a seller ignores an order for an hour.',
    ],
  },

  timeline: [
    { when: 'July 7, 2026', title: 'Spec to a complete first version', what: 'Buyer browsing and cart, seller signup and dashboard, order status and the freshness rule. 57 unit tests passing.' },
    { when: 'July 8, 2026', title: 'Backend live, a dozen features in a day', what: 'The database went live and about a dozen feature sets shipped: order management, seller profiles, listing drafts, private communities and Google sign-in.' },
    { when: 'July 8, 2026', title: 'Domain and brand', what: 'Domain, DNS and SSL wired, with the real logo and app icons.' },
    { when: 'July 9, 2026', title: 'Marketing and SEO foundation', what: 'A page system for guides, a home page with real food photos, and technical SEO: sitemap, schema and canonicals.' },
    { when: 'July 10, 2026', title: 'SEO grows to 130+ routes', what: 'More than sixty researched pages on permits, pricing, building rules and city hubs, taking the sitemap from 30 to 91 indexed URLs.' },
    { when: 'July 11, 2026', title: 'A safety net for ignored orders', what: 'Auto-cancel with an apology for ignored orders and a rising suspension ladder, both proven with forced-timing tests.' },
    { when: 'July 12, 2026', title: 'Public feedback board', what: 'Sellers and buyers vote and comment on what ships next.' },
    { when: 'July 13, 2026', title: 'A public demo', what: 'The live site reset to one demo community with sample sellers, so anyone can try it before a real building signs on.' },
    { when: 'July 14, 2026', title: 'Security lockdown', what: 'An audit found the public key could read buyer details, and the hole was closed the same day across all 31 tables.' },
    { when: 'July 15, 2026', title: 'Email delivery and browsing by place', what: 'Bounce and complaint suppression so a dead inbox stops hurting sender reputation, and a region-to-city directory.' },
  ],

  features: [
    {
      group: 'Buying',
      items: [
        'Browse your community with no account until checkout',
        'A cart per seller, since each seller fulfills and gets paid on their own',
        'Guest checkout with an instant order confirmation',
        'Live order tracking with status pushes and a photo when it is delivered',
        'Seller ratings, one per order',
      ],
    },
    {
      group: 'Selling',
      items: [
        'A seller dashboard with an order queue and batch status updates',
        'Stock that counts down safely and marks itself sold out at zero',
        'Listing drafts with a real preview before going public',
        'A storefront page with a cover photo, hours and a printable QR badge',
        'Sales numbers for today, the week and the month, plus unpaid balances and cancellation rate',
      ],
    },
    {
      group: 'Orders and fulfillment',
      items: [
        'As soon as possible, scheduled up to 7 days out, or pickup',
        'Pre-orders and group-buy requests with their own cutoff times',
        'Delivery fees per seller, with a free-delivery progress bar in the cart',
        'Cancellations with a reason and automatic stock restore',
        'Two people buying the last unit at the same moment cannot both win',
      ],
    },
    {
      group: 'Community, trust and admin',
      items: [
        'Public, unlisted or join-code communities, run by managers and co-admins',
        'A verified badge after manual review, renewed every year',
        'Warnings, timed suspensions and takedowns',
        'A strike ladder for sellers who keep ignoring orders',
        'Web push for restocks and order updates, and a live order bell for sellers',
      ],
    },
  ],

  hardParts: [
    {
      title: "The public key could read every buyer's name and phone number",
      problem:
        'New database projects come with the public and signed-in roles holding every privilege on every table, and row-level security off. That default sat live for weeks. An audit found the public key, the one shipped in the browser, could read real orders (names, phone numbers and addresses) and could delete from all 31 tables.',
      solution:
        'Row-level security forced on every table, every grant revoked, and default privileges set so a future migration cannot quietly reopen a new table. Only the two reads that live updates need were granted back, behind rules. Then I ran the actual exploit with the public key again to prove it was closed, instead of rereading the config.',
    },
    {
      title: 'Stopping the last plate from selling twice',
      problem:
        'Two buyers checking out the last unit at the same moment could both succeed. A stock count that stops at zero prevents negative stock, but not two people paying for one plate.',
      solution:
        'Stock is now reserved inside one locked database function before anything reaches the seller, so a shortfall rolls back, cancels that order and sends the buyer an apology. I tested it for real: one unit left, two checkouts fired at the same moment, exactly one success and one rejection, and stock landed at zero.',
    },
    {
      title: 'A 12-hour freshness rule on a once-a-day schedule',
      problem:
        'The hosting plan only runs scheduled jobs once a day, but a stale listing had to leave the feed within 12 hours of its seller going quiet, or buyers would see plates that sold out days ago and stop trusting the feed.',
      solution:
        'Enforcement and cleanup are split. Every feed query filters listings by last activity in the query itself, so a listing disappears the moment it crosses 12 hours, whenever the job last ran. The daily job only tidies up and nudges the seller to relist. Pre-orders and official stores get exemptions in the same filter rather than a second code path.',
    },
    {
      title: 'Cancelling an ignored order without cancelling a real one',
      problem:
        'An order a seller never confirms has to cancel and apologize eventually, but a simple timer could kill an order the seller was still cooking.',
      solution:
        'Two ordered steps: a warning push at 45 minutes that records a time, and a cancel at 60 minutes that refuses to run unless that warning exists and is at least 10 minutes old. A rising suspension ladder sits on top (1, then 3, then 7 days, at most one strike a day), with a guard so the automation can never turn a permanent ban into a timed one.',
    },
  ],

  outcome: {
    body: [
      'The app is live and installable on iPhone and Android. It carries 65 applied migrations, more than 600 automated tests and around 112 page routes, including a full local SEO layer of guides, comparison pages and a region-to-city directory.',
      'The live site runs as one public demo community: a fully working marketplace with sample sellers and listings, so anyone can try ordering and the seller dashboard before a real building signs on. That is a deliberate order of steps. The first communities are archived and can be restored while building managers are signed up one building at a time.',
      'Every core rule, the 12-hour freshness clock, the payment handoff, the oversell protection and the strike ladder, has been run against the live database with forced timing and real concurrency, not just in unit tests.',
    ],
  },

  lessons: [
    'Scope the market to where trust lives. One building beats one city when the product depends on neighbors knowing each other.',
    'A once-a-day job can still give minute-accurate behavior if the check runs when the data is read and the job only cleans up after.',
    'Cloud defaults are tuned for a fast demo, not real user data. Audit privileges and security rules before the first real row goes in.',
    'Write a race condition fix as an explicit guarantee you can test, like warn before cancel and never sell twice.',
    'An installable web app removes app store friction for anything this local. Nobody searches an app store for their own building.',
    'Keeping payments off the platform removes a whole class of compliance and trust problems before they exist.',
  ],

  proof:
    'This is a full two-sided marketplace with live stock, seller moderation, a direct payment handoff and its own SEO engine, built, secured and improved by one person in under two weeks. If you are planning a marketplace, a booking flow or an operations platform, I will find the race condition and the leaky default before your users do.',

  palette: 'paper',
};
