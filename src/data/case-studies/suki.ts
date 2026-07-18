import type { CaseStudy } from './types';

export const suki: CaseStudy = {
  slug: 'suki-neighbors',
  name: "Suki Neighbors",
  tagline: "The condo group chat, replaced",
  category: "Consumer PWA · Two-Sided Marketplace",
  year: "2026",
  status: "Live in production",
  liveUrl: "https://sukineighbors.com",
  summary:
    "A community-locked food marketplace PWA that replaces the buy-and-sell group chat inside a single Philippine condo tower or village, built and shipped solo in under two weeks.",
  lede:
    "Every condo tower in Metro Manila runs on the same hidden economy: home cooks and small sellers move food through a Viber or Facebook group chat that everyone in the building is already in. I built Suki Neighbors to replace that group chat with an actual marketplace, scoped to one building at a time, and took it from spec to a live, installable app in about two weeks.",

  facts: [
    { k: "Role", v: "Solo builder: product, engineering, brand, SEO" },
    { k: "Timeline", v: "July 2026, 60+ shipped releases in under 2 weeks" },
    { k: "Stack", v: "Next.js 16, Supabase, Mailgun, Vercel" },
    { k: "Scale", v: "65 migrations, 600+ tests, ~112 routes" },
  ],
  stack: [
    "Next.js 16 (App Router, TypeScript, React 19)",
    "Tailwind CSS 3",
    "Supabase (Postgres, Auth, Storage, Realtime)",
    "Vercel (Singapore region, Cron, edge caching)",
    "Mailgun (transactional email, bounce/complaint webhooks)",
    "Web Push (VAPID)",
    "Installable PWA (manifest, no service-worker caching)",
  ],
  metrics: [
    { value: "65", label: "migrations shipped live" },
    { value: "600+", label: "automated tests" },
    { value: "130+", label: "live routes and pages" },
  ],

  problem: {
    title: "The group chat that outgrew itself",
    body: [
      "Most Philippine condo towers have a buy-and-sell group chat on Viber or Facebook, sometimes three of them per building. Neighbors post what they are cooking that week: adobo, leche flan, meal-prep containers, whatever a home cook or a small carinderia has ready. Buyers reply in the thread to claim a plate. It works, in the sense that money changes hands, but it was never built to be a market.",
      "The word for the relationship at the center of this is suki: a regular customer a seller comes to know and favor, the backbone of how Filipinos have always bought from small vendors. A condo building recreates that relationship at scale, except the group chat has no memory. A listing posted Tuesday morning is buried under two hundred unrelated messages by Tuesday night. Buyers ask \"meron pa ba?\" (is it still available) into threads the seller has not seen in hours, get seen-zoned, and give up. Sellers cannot tell a serious buyer from someone who will ghost after claiming the last order.",
      "None of the big platforms solve this. Grab and foodpanda take a commission a P55 plate of adobo cannot absorb, and neither one lets a rider past a condo lobby without a resident badging them in. The market is real, every tower has one, but it is a market of maybe forty active sellers and a few hundred regular buyers: too small for a national platform and too disorganized for a chat app to manage.",
    ],
  },

  approach: {
    title: "The decisions",
    body: [
      "I built Suki as an installable web app, not an App Store or Play Store listing. A hyperlocal product for one building does not clear the bar of an app-store download: nobody searches an app store for \"my condo's food group,\" and a $99-a-year developer account plus review cycles buys nothing a resident cares about. A link dropped into the same group chat Suki is replacing, tapped once, \"Add to Home Screen,\" gets someone from zero to browsing in under a minute. That distribution math only works as a PWA.",
      "The tenancy model is the real product decision. Most marketplaces scope by GPS radius; I scoped by community instead, chosen once at signup, because the actual market boundary in a condo tower is the building, not a five-hundred-meter circle that pulls in three unrelated towers and none of the trust that makes a suki relationship work. Every community can be public, unlisted, or gated behind a join code, and the person already running the building's Viber group becomes the manager, with co-admin roles, a moderation queue, and a printable QR code that gets people in without typing anything.",
      "Discovery and trust both had to work at the scale of dozens of sellers, not thousands. Ratings live on the seller, not the platform, one review per order, shown only once a seller has at least one. Verification is a manual admin review of a submitted proof, not a self-serve checkbox. Listings auto-expire off the feed twelve hours after a seller last touched them, which forces the same \"is it still available\" signal the group chat never gave buyers, but as a fact the app enforces instead of a question buried in a thread. Sellers get a limited pool of free boosts each month, not a pay-to-win auction, because paying to outrank your literal neighbor breaks the thing that makes a suki market work in the first place.",
      "Suki never touches money. Every seller sets their own accepted methods, cash on delivery, GCash, or bank transfer, and the buyer pays the seller directly, the same way the group chat already worked, which also keeps Suki outside the marketplace withholding-tax rules that kick in the moment a platform starts holding or remitting funds. Delivery is the seller walking a plate to a unit themselves or a scheduled pickup, not a third-party rider account required to badge into a lobby; fulfillment runs on ASAP, a scheduled window, or pickup, with an automatic apology and stock restore if a seller ghosts an order for an hour.",
    ],
  },

  timeline: [
    {
      when: "2026-07-07",
      title: "Spec to code-complete v1",
      what: "Wrote the spec and plan, then built buyer browse and cart, seller signup and dashboard, order status flow, and the freshness auto-expiry mechanic. 57 unit tests green, no live services wired yet.",
    },
    {
      when: "2026-07-08",
      title: "Backend live, one-day feature sprint",
      what: "Stood up the Supabase project in Singapore, applied the first migrations, and shipped roughly a dozen feature sets in a single day: seller order management, public seller profiles, listing drafts and archive, private-community access with request-to-join, and Google sign-in.",
    },
    {
      when: "2026-07-08",
      title: "Domain and brand go live",
      what: "Registered sukineighbors.com, wired DNS and SSL, and swapped placeholder icons for the real pin-and-S logo and PWA manifest.",
    },
    {
      when: "2026-07-09",
      title: "Marketing and SEO foundation",
      what: "Built a registry-driven page system for guides, a home page with real dish photography, technical SEO (sitemap, schema, canonicals), and the first buyer and seller landing pages.",
    },
    {
      when: "2026-07-10",
      title: "SEO layer expands to 130+ routes",
      what: "Added over sixty keyword-researched pages (permits, pricing, condo rules, city hubs) after live SERP research surfaced under-served Taglish search terms, taking the sitemap from 30 to 91 indexed URLs.",
    },
    {
      when: "2026-07-11",
      title: "ASAP order safety net",
      what: "Shipped the auto-cancel-with-apology flow for ghosted orders and an escalating seller suspension ladder, both proven live with forced-timing tests before shipping.",
    },
    {
      when: "2026-07-12",
      title: "Public feedback board",
      what: "Opened a public feature and bug board so sellers and buyers could vote and comment on what shipped next.",
    },
    {
      when: "2026-07-13",
      title: "Converted to a public demo",
      what: "Reset the live site to one public Demo Community with sample sellers and listings, turning a solo-tested app into something anyone could try before a real building signed on.",
    },
    {
      when: "2026-07-14",
      title: "Security lockdown",
      what: "Audited Row Level Security and privilege grants on every table, found the anon key could read live buyer PII, and closed it the same day across all 31 tables.",
    },
    {
      when: "2026-07-15",
      title: "Email delivery and geo browsing",
      what: "Wired Mailgun with bounce and complaint suppression so a dead inbox stops burning sender reputation, and shipped an island-to-city geographic browse hierarchy.",
    },
  ],

  features: [
    {
      group: "Buying",
      items: [
        "Community-locked browse, no account needed until checkout",
        "Per-seller cart (orders are fulfilled and paid seller by seller)",
        "Guest checkout with instant order confirmation",
        "Saved address book, up to 6 addresses, synced across devices",
        "Live order tracking with status pushes and a proof-of-delivery photo",
        "Seller ratings, one per order, shown after a 24-hour window",
      ],
    },
    {
      group: "Selling",
      items: [
        "Seller dashboard with a bucketed order queue and batch status advance",
        "Tracked and untracked stock with atomic decrement, auto sold-out at zero",
        "Listing drafts with a real live preview before going public",
        "Free monthly boosts plus manager-granted boosts from a shared community pool",
        "Storefront page with cover photo, tagline, hours, and a printable QR badge",
        "Sales analytics: today, week, month, unpaid COD balance, cancellation rate",
      ],
    },
    {
      group: "Ordering and fulfillment",
      items: [
        "ASAP, scheduled (up to 7 days), and pickup fulfillment",
        "Pre-orders and pasabuy (bulk buying-favor requests) with their own cutoff clocks",
        "Per-seller delivery fees with a free-delivery progress bar in cart",
        "Reason-coded cancellation with automatic stock restore",
        "Oversell protection: concurrent checkouts on the last unit cannot both win",
      ],
    },
    {
      group: "Discovery",
      items: [
        "Shuffle-by-default feed so the same few sellers do not always lead",
        "Category filters, search, and a \"notify me when this exists\" watchlist",
        "Follow-a-store subscriptions with a push on every new listing",
        "One manager-assigned Featured Store slot per community",
        "Island / region / province / city browse hierarchy for the public directory",
      ],
    },
    {
      group: "Community and trust",
      items: [
        "Public, unlisted, or join-code-gated communities",
        "Manager and co-admin roles for the person already running the building's group",
        "Verified badge via manual admin review, auto-expires after one year",
        "Warn, timed suspend, and takedown moderation tools",
        "Request-to-join queue for private communities",
      ],
    },
    {
      group: "Admin and ops",
      items: [
        "Verification review queue for seller proof submissions",
        "Platform-wide stats dashboard: users, communities, GMV, order status mix",
        "Automated strike ladder for sellers who repeatedly ghost orders",
        "Public feedback board with admin-set status (working on it, shipped, not planned)",
      ],
    },
    {
      group: "Notifications",
      items: [
        "Web push for restocks, order status changes, and boost queue turns",
        "Mailgun transactional email with bounce and spam-complaint suppression",
        "Real-time seller bell on new orders via Supabase Realtime",
      ],
    },
  ],

  hardParts: [
    {
      title: "The anon key could read every buyer's name and phone number",
      problem:
        "Supabase ships new projects with anon and authenticated granted every privilege on every table by default, and Row Level Security off. That default sat live on Suki for weeks. An audit on 2026-07-14 found the public anon key, the one shipped in the browser bundle, could read real order rows (names, phone numbers, addresses) and held delete and truncate rights on all 31 tables.",
      solution:
        "Forced RLS on every table, revoked every grant from anon and authenticated, and set default privileges so future migrations cannot silently reopen a new table, the likely original cause. Re-granted only the two policy-gated reads Realtime needs, added REPLICA IDENTITY FULL where Realtime required it, then verified the fix by re-running the actual exploit against the anon key, not by re-reading the config.",
    },
    {
      title: "Stopping the same last plate from selling twice",
      problem:
        "Two buyers checking out the same down-to-one-unit listing at the same moment could both succeed. A decrement that floors at zero stops negative stock, but it does not stop two people from paying for one plate of adobo.",
      solution:
        "Moved stock reservation into a single row-locked Postgres function called before any seller-facing side effect runs, so a shortfall triggers an automatic partial rollback, a system-cancelled order, and a buyer apology push instead of a stranded oversold order. Verified with a real concurrency test: forced a listing to quantity 1, fired two simultaneous authenticated checkouts, got exactly one 200 and one 409, stock landed at exactly 0.",
    },
    {
      title: "Making a 12-hour freshness clock exact on a once-a-day cron",
      problem:
        "Vercel's free tier only runs cron jobs daily, but a stale listing had to disappear from the feed within 12 hours of the seller going quiet, or buyers would see \"sold out three days ago\" plates and stop trusting the freshness signal entirely.",
      solution:
        "Split enforcement from cleanup. Every feed read filters listings against the last-active timestamp inline, in the query itself, so a listing vanishes the instant it crosses 12 hours no matter when the cron last ran. The daily cron only materializes the already-true state and pings the seller to relist. Pre-orders and Official Store sellers got explicit exemptions layered onto the same read-time filter instead of a second parallel code path.",
    },
    {
      title: "Cancelling a ghosted order without ever cancelling on a false alarm",
      problem:
        "An ASAP order a seller never confirms has to eventually cancel and apologize to the buyer, but a naive timer risks killing an order the seller was actually still preparing.",
      solution:
        "Built the guarantee as two separate, ordered steps: a warning push fires at 45 minutes and stamps a timestamp, and the cancel job at 60 minutes refuses to run unless that timestamp exists and is at least 10 minutes old. Layered an escalating suspension ladder on top, one strike per seller per day, 1, then 3, then 7 days, with an explicit guard that stops the automation from ever converting a permanent admin ban into a lifted timed one.",
    },
  ],

  outcome: {
    title: "Where it stands",
    body: [
      "Suki Neighbors is live at sukineighbors.com, currently on v0.59.1, installable as a PWA on iOS and Android. The codebase carries 65 applied migrations, 600-plus automated unit tests, and around 112 page routes, including a full local-SEO layer of guides, comparison pages, and a PH island-to-city directory.",
      "The live site currently runs as a single public Demo Community: a real, fully working marketplace seeded with sample sellers and listings so anyone can try browsing, ordering, and the seller dashboard before a real building signs on. That is a deliberate sequencing choice, not a stall. The original condo and village communities are archived and reversible while pioneer building managers get recruited one tower at a time.",
      "Every core mechanic, the 12-hour freshness clock, the payment handoff, the oversell protection, the strike ladder, has been exercised against the live database with forced timing and concurrency, not just in unit tests.",
    ],
  },

  lessons: [
    "Scope the market to where trust actually lives. One building beats one city when the product depends on neighbors recognizing each other.",
    "A once-a-day cron can still deliver second-accurate behavior if the check runs at read time and the cron only cleans up after.",
    "Cloud-provider defaults are tuned for a fast demo, not for real user data. Audit privilege grants and RLS before the first real row goes in, not after.",
    "Write a race condition's fix as an explicit, testable guarantee, warn before cancel, never sell twice, instead of trusting it to fall out of the code naturally.",
    "A PWA kills app-store friction for anything hyperlocal. Nobody searches an app store for their own building.",
    "Taking payment off the platform removes a whole category of compliance and trust problems before they exist.",
  ],
  proof:
    "Suki is a full two-sided marketplace with real-time inventory, seller moderation, a peer-to-peer payment handoff, and its own SEO growth engine, built, secured, and iterated solo in under two weeks and counting. It is what I bring to a team building a marketplace, funnel, or ops platform: I will find the race condition and the leaky default before your users do.",
};
