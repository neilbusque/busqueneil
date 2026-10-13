import type { CaseStudy } from './types';

export const preflight: CaseStudy = {
  slug: 'preflight',
  title: 'A funnel simulator with an AI audit',
  category: 'Sites and funnels',
  year: '2026',
  liveUrl: 'https://preflight.neilb.app',
  seoTitle: 'Case study: funnel simulator with an AI audit',
  seoDescription:
    'A canvas where you lay out a whole funnel, from ad to booking to follow-up, click through it like a buyer and get an AI audit before you buy traffic.',
  summary:
    'Lay out a whole funnel, from ad to booking to follow-up, and click through it before you buy traffic. AI drafts the first version and audits it.',
  lede:
    'A visual funnel builder that mocks up every step of a marketing funnel in the look of the real platforms, then lets you click through it the way a buyer would. Build the ad, the landing page, the booking flow and the follow-up on one canvas, walk it end to end, and find the broken step before your ad spend does.',

  facts: {
    whoFor: 'Agencies and owners planning paid traffic, and the people who sign off on it',
    built: 'A node canvas with platform-style mockups, a click-through mode and a scored audit',
    timeline: 'About three weeks, mid 2026',
    stack: 'Vite, React 18, TypeScript, React Flow, Supabase',
  },

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
    { value: '7', label: 'Step types: ad, page, booking, email, SMS, action and decision' },
    { value: '5', label: 'Rounds of live testing across four versions' },
    { value: '85+', label: 'Automated tests on the graph logic and the audit parser' },
  ],

  problem: {
    body: [
      "Most funnels fail somewhere nobody walked before launch. Not the offer and not the targeting, but the plumbing: a booking link that opens the wrong calendar, a follow-up text that goes out before the email, a decision with no path for the no-show. Reviewing a funnel today means opening an ad manager, a page builder, a CRM, an email tool and a texting app, and stitching them together in your head. Nobody does that, so the first real walkthrough happens after the money is spent.",
      'The failure is not bad strategy. It is an unwalked path. A funnel is a sequence of screens and decisions, and the only way to know it holds together is to move through it in order, seeing what the buyer sees at each step, including what happens if they book, ghost or book and do not show. That sits between two kinds of tool: it needs the look of a design tool and the logic of a flowchart.',
    ],
  },

  approach: {
    body: [
      'The product does three jobs and is organized around exactly those three. Simulate: build the sequence as steps and walk it like a buyer, including every branch. Pitch: put the same canvas in front of a client instead of a slide deck, with comments on each step. Audit: run the finished sequence, or one part of it, against real benchmarks and get a scored report with specific fixes, not a vague grade.',
      "Underneath is a graph: each funnel is a set of steps and links, each step with its own settings, optional numbers and optional variants. Links carry timing labels, like 'Day 1' or 'after 3 days, no-show', so the sequence reads like a real campaign. Decision steps are the only kind that branch, one link per outcome (booked, no-show, ghosted), and every other kind allows exactly one link out. That one asymmetric rule keeps the canvas readable instead of a web, and both the drag-to-create gesture and the AI generator have to respect it.",
      "React Flow draws the canvas, but the mockups are what set it apart. Every step renders in the look of the real platform: five ad formats across Facebook, Instagram, LinkedIn and Google, a browser-framed landing page, a booking screen, an email, a text thread, and call and DM screens. That matters in a client meeting. A flowchart of labeled boxes does not land with a non-technical owner. A mockup that looks exactly like the ad they will see does.",
      "A rename early on reframed the product around one idea: clear the funnel before you spend on traffic. The positioning moved from 'build and preview a funnel' to 'check it before you spend', which changed who it is for: not only the person building funnels, but the person who signs off on the ad budget.",
      "After that, every feature was checked against the three jobs. Page blocks and A/B variants serve simulate. Comment threads on share links serve pitch. The audit, its benchmark sources and the page-speed checks serve audit. Anything that did not clearly serve one of the three did not ship.",
    ],
  },

  timeline: [
    { when: 'June 2026', title: 'Canvas and click-through', what: 'A step editor with five step types, timing labels, branching decisions, a public click-through mode, share links and autosave.' },
    { when: 'July 2, 2026', title: 'Live testing finds an autosave bug', what: 'A full browser test of a seeded funnel covered play mode, branching, sharing, permissions and the keyboard, and found the autosave timer resetting forever.' },
    { when: 'July 3, 2026', title: 'Page builder and AI drafts', what: 'A 10-block page builder, AI funnel generation, a phone preview for every mockup and an intro that scrolls a fake feed to the ad.' },
    { when: 'July 3, 2026', title: 'The audit', what: 'A benchmark-based audit with five scopes and scored reports, with one-click fixes.' },
    { when: 'July 3, 2026', title: 'Drop in a link', what: 'Audit any landing page from its URL, backed by Google PageSpeed Insights, plus a branded PDF export.' },
    { when: 'July 3, 2026', title: 'Rename and new brand', what: 'A new name, mark and palette, and a public marketing page, with the app moved behind a login.' },
    { when: 'July 3, 2026', title: 'Call and DM steps, drag to create', what: 'A call and DM step with platform-style threads, and drag out of any step to create and connect the next one.' },
    { when: 'July 4, 2026', title: 'Real accounts', what: 'Per-account sign-in with database security rules instead of one shared password, a daily AI usage cap, its own domain and transactional email.' },
  ],

  features: [
    {
      group: 'Canvas editor',
      items: [
        'Step cards with a colored icon for each type',
        'One-click tidy layout',
        'A full-screen editor with the live mockup and its settings side by side, saving as you go',
        'Drag out of any step and drop on empty canvas to create and connect the next one',
      ],
    },
    {
      group: 'Step types',
      items: [
        'Ads in five formats: Facebook feed, Instagram feed and story, LinkedIn and Google',
        'Pages from a live URL, a screenshot or a 10-block page builder',
        'Booking, email and text-message mockups',
        'Call scripts and DM threads for Instagram, LinkedIn, Messenger, X and WhatsApp',
        'Decisions, the only step that branches, one path per outcome',
      ],
    },
    {
      group: 'Click-through mode',
      items: [
        'A public click-through of the whole sequence, with no login needed',
        'An intro that scrolls a fake social feed and lands on the real ad',
        'The presenter picks each branch live',
        'Desktop and phone views, with phone-framed mockups',
        'Keyboard controls to go forward, back and replay',
      ],
    },
    {
      group: 'The audit',
      items: [
        'Five scopes: whole funnel, landing page, ad, opt-in and email',
        'Drop in a URL for a fast audit backed by Google PageSpeed Insights',
        'A score out of 100 with findings that each cite a benchmark (Unbounce, WordStream, Klaviyo)',
        'One-click fixes, or an AI-assisted edit',
        'A branded PDF export with your own call to action',
      ],
    },
    {
      group: 'Sharing',
      items: [
        'Share links that are view-only with comments turned on',
        'Comment threads pinned to a step, which the owner can resolve',
        'A/B variants per step, compared side by side',
        'Numbers per step: traffic, spend, clicks, revenue and conversion between steps',
      ],
    },
  ],

  hardParts: [
    {
      title: 'Drag to create without breaking the branching rule',
      problem:
        'Every step except a decision must have exactly one link out, and a decision exactly one per outcome. Drag-to-create had to make a new step and connect it in one motion, without a code path that could break that rule.',
      solution:
        "I wired the gesture through React Flow's connect-start and connect-end events, which fire even when the drag ends on empty canvas. Dropping opens a menu of step types at that spot, and picking one uses the same add-step path as the toolbar, then connects it with the exact same one-link and per-outcome logic as a manual connection. One rule set, two ways in, nothing to drift apart.",
    },
    {
      title: 'A scrolling canvas mockup broke the page width on phones',
      problem:
        'The marketing page hero included a live, scrollable canvas mockup. On phones it made the whole page wider than the screen, with sideways scroll on every section, because a grid child with scrollable content does not shrink below its content by default.',
      solution:
        'The fix was one missing min-w-0 on the container around the mockup. Without it, a grid item lets its content set the column\'s minimum width. A browser test at 390 and 1440 pixels caught it, because the bug was invisible on desktop.',
    },
    {
      title: 'Autosave that quietly stopped mid-session',
      problem:
        "Autosave never fired while someone was working on the canvas, even though nothing was lost on leaving the page. Every change event, including idle selection and size measurements that fire on hover, reset the save timer, so it never got 2.5 quiet seconds.",
      solution:
        'Live testing caught the gap between "the data survives" and "the save indicator tells the truth". Now only real position changes reset the timer, and a 2.5-second maximum wait means a step being dragged still saves along the way.',
    },
    {
      title: 'Share links hit a login wall',
      problem:
        "The hosting platform's deployment protection is on by default for a personal project, which is right for an internal tool and quietly breaks the pitch: a client opening a share link hit a login screen instead of the funnel.",
      solution:
        'Protection had to be turned off at the project level for the click-through and preview routes to be public. It is easy to miss, because everything looks fine in development and in a signed-in browser. It only breaks when someone outside the account opens the link, which is exactly when it matters most.',
    },
    {
      title: 'Moving to real accounts without breaking live funnels',
      problem:
        'The app first shipped with one shared password that signed everyone into the same user, and security rules that let any signed-in session see every row. Separating accounts afterwards meant migrating live data without breaking the funnels and reports that already existed.',
      solution:
        'A user column with the current user as its default, every existing row assigned to the one prior user, and owner-only rules on funnels, reports and their comments, while keeping public read access so click-through and pitch links still work for visitors. New rows are owned correctly with no app code changes. A single database function checks and counts AI use in one step, so the daily cap holds without a race.',
    },
  ],

  outcome: {
    body: [
      'It is live with real accounts, transactional email and a public marketing site separate from the app. I use it two ways: as a pitch tool, walking a prospect through their exact funnel with real platform mockups instead of a slide deck, and as my own planning canvas, catching sequencing problems on a graph before they reach a live campaign.',
      'The audit runs against a curated set of benchmarks (Unbounce, WordStream, Klaviyo and copy rules) and, for landing pages, live Google PageSpeed data, so a report cites a real number instead of a generic score. That turns the tool from a mockup builder into something with teeth: it shows where the funnel is weak against real conversion numbers and lets you apply the fix on the spot.',
    ],
  },

  lessons: [
    'A tool that doubles as a pitch needs mockups that look like the real thing. Fidelity is the difference between a plan and a demo.',
    'One asymmetric rule (decisions branch, everything else is linear) kept a graph interface readable as it grew.',
    'The bug that broke the page width on phones was one missing class. Test at real phone widths; desktop testing never catches it.',
    'Adding accounts after launch is mostly a database defaults problem. Get the schema and the security rules right and the app barely changes.',
    "A rename is not just new artwork. The new name changed who the pitch was for, from funnel builders to the person who approves the spend.",
    'Debounced autosave needs a maximum wait as well as a quiet period. Continuous work, like dragging, can stop the quiet period from ever arriving.',
  ],

  proof:
    'This is a marketing tool built by someone who runs funnels, which is why it mirrors how real campaigns break: sequencing, branching and the gap between the plan and what a buyer sees. It shows I can take a product from a raw idea to a positioned brand, build the unglamorous parts underneath (accounts, security rules, benchmark scoring) and keep shipping without breaking what is live.',

  palette: 'mist',
};
