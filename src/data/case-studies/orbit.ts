import type { CaseStudy } from './types';

export const orbit: CaseStudy = {
  slug: 'orbit',
  title: 'A CRM where an AI assistant does the follow-up',
  category: 'Software',
  year: '2026',
  liveUrl: 'https://www.inorbit.one',
  seoTitle: 'Case study: a CRM with an AI assistant',
  seoDescription:
    'How I built a multi-workspace CRM with an AI assistant, live billing, its own email and a page builder, from first line of code to first payment in 24 days.',
  summary:
    'My own CRM for small teams. Its assistant can take about 150 different actions in the app, and it went from the first line of code to its first payment in 24 days.',
  lede:
    "It started as a way to stop losing track of people. Leads, clients and contacts were scattered across apps that didn't talk to each other, so I built a CRM for myself in a weekend. Then I kept building, and 24 days later it was taking real payments, with its own AI assistant, its own billing and its own marketing site.",

  facts: {
    whoFor: 'Small teams and solo operators, starting with my own contacts',
    built: 'A multi-workspace CRM with an AI assistant, inbox, billing and a page builder',
    timeline: 'First line of code to first payment in 24 days, May to June 2026',
    stack: 'React, TypeScript, Vite, Supabase, Stripe',
  },

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
    { value: '24 days', label: 'From the first line of code to the first payment' },
    { value: '246', label: 'Database migrations shipped' },
    { value: '96', label: 'Edge functions in production' },
    { value: '6', label: 'Languages shipped' },
  ],

  problem: {
    body: [
      "The CRMs that already exist are built for sales teams. They assume a sales org underneath them: a pipeline built around revenue, seats for reps, dashboards for a manager. I wanted one place for every relationship a small business has: a lead from a cold email, a client in the middle of a project, a partner I hadn't spoken to in months.",
      "The usual fallback, a spreadsheet or a notes database, has no memory. It doesn't tell you it's been three months since you talked to someone. It doesn't log a call on its own or know the difference between a catch-up and a sales follow-up. I wanted the discipline of a real CRM, with structured contacts, real pipelines and a timeline that updates itself, scoped to a small team instead of a sales quota.",
      'So I built it for myself first, with no market research and no landing page, just a schema and a weekend. The same gap turned out to exist for other people running a business alone or with a small team: too big for a spreadsheet, and priced out of or overbuilt by the tools made for sales orgs.',
    ],
  },

  approach: {
    body: [
      "The first real architecture call came four days in. I'd built everything around one owner per row: fine for a personal tool, but it wouldn't survive a second user, let alone a team. So I rebuilt the data model around workspace membership. Every user gets a private workspace by default and can create or join team workspaces with Owner, Admin and Member roles. Row-level security checks membership, not who created the row. Doing that rewrite in week one, before there was real data to move, cost a day. Doing it after launch would have meant rewriting every table's security policy under live traffic.",
      "It runs on the same stack as apps I'd already shipped (React, TypeScript, Vite, Tailwind and Supabase) and installs as a web app instead of a native one. That was a speed decision. One codebase means a fix ships in minutes, not after an app store review. A small native shell for the Mac menu bar came later, but the product never left the browser.",
      "The AI assistant is what makes it more than a CRM: it can read and act on your data through about 150 tools. The cost had to work at software margins, not pass through whatever the API charges. I moved the shared AI key off OpenRouter onto DeepSeek, which runs the same chat at a fraction of the price per token, and that is what makes a real free plan possible. Every workspace gets a monthly credit grant that resets on its own, with no card and no API key to paste in.",
      "Email first ran through each user's own Gmail account, which sounds convenient until you meet Google's review process for a multi-tenant app asking for Gmail access. I moved the whole send and receive path onto Mailgun, on a domain the product owns, with an inbound catch-all and bounce and complaint webhooks instead of polling an inbox. That also unlocked things Gmail never would: encrypted email bodies at rest, send caps by plan and automatic sender suspension on a bounce or spam spike.",
      'The AI also went through a real reversal. Early on I built eighteen named agents, each with its own persona and job. It looked impressive in a demo and was a maintenance problem in practice: eighteen prompts to keep consistent, eighteen places for a bug to hide, and users who could not tell which agent to talk to. I folded them into one assistant that chats when you talk to it and runs background jobs when a trigger fires, with one tool catalog and one memory. Two of the old agents stayed as plain code on purpose, because forcing deterministic logic through a language model would have made it worse.',
    ],
  },

  timeline: [
    { when: 'May 26, 2026', title: 'Built as a personal CRM', what: 'The first schema: contacts, interactions, pipelines and change history across 11 tables, with row-level security.' },
    { when: 'May 30, 2026', title: 'Rebuilt for team workspaces', what: 'Replaced the one-owner security model with workspace membership and roles, before there was real data to migrate.' },
    { when: 'June 11, 2026', title: 'Marketing site and SEO', what: 'Stood up a separate marketing site with a full editorial design and a programmatic SEO set of 122 pages, later grown past 200.' },
    { when: 'June 19, 2026', title: 'Live billing', what: 'Turned on live billing, moved all email off Gmail onto Mailgun and shipped the multi-language interface.' },
    { when: 'June 20, 2026', title: 'Cheaper AI underneath', what: 'Moved the shared assistant key onto DeepSeek and built an admin panel for rotating platform keys without a redeploy.' },
    { when: 'June 25, 2026', title: 'One assistant instead of eighteen agents', what: 'Retired the agent roster and rebuilt the AI as one chat and jobs assistant with one memory and one tool catalog.' },
    { when: 'June 26, 2026', title: 'Hands-free voice mode', what: 'Speech in and speech out, so you can talk to the assistant and it talks back, with barge-in and spoken confirmation before it writes.' },
    { when: 'July 9, 2026', title: 'Full visual rebrand', what: 'A new mark, new display type and a new palette across the product and the marketing site.' },
    { when: 'July 17, 2026', title: 'Still shipping', what: 'A release on most days since the first commit, often several in one day.' },
  ],

  features: [
    {
      group: 'CRM core',
      items: [
        'Contacts with rich profiles, social links and custom fields',
        'Companies and deal pipelines with drag-and-drop stages',
        'An interaction timeline and change history that fill in on their own',
        'Smart lists: reconnect reminders, key dates and per-segment views',
        'Free-form tables for anything that does not fit a contact',
      ],
    },
    {
      group: 'Communication',
      items: [
        'One inbox across email, SMS, WhatsApp and live chat',
        'Email sent through Mailgun, with four sending methods including your own SMTP',
        'Multi-step automations: wait, follow up if no reply, tag, webhook and drip',
        'An embeddable live-chat widget with an AI fallback when the team is away',
      ],
    },
    {
      group: 'The AI assistant',
      items: [
        'Chat with about 150 tools across the whole CRM, sorted into read, write, delete, outbound and publish',
        'Anything risky waits for a click before it runs',
        'Hands-free voice mode with barge-in and spoken confirmation before writes',
        'Background jobs on triggers: new email, deal stage change, a schedule or a new contact',
      ],
    },
    {
      group: 'Pages and booking',
      items: [
        'Landing pages, forms and scored quizzes in five ready-made styles',
        'Booking pages with real-time availability',
        'Custom domains per workspace',
        'Shared project boards that guests can edit without a login',
      ],
    },
    {
      group: 'Money',
      items: [
        'Invoices and proposals with e-signatures',
        'Card payments on invoices, as a deposit and balance or in full',
        'Its own subscription billing, running live',
      ],
    },
    {
      group: 'Platform',
      items: [
        'Team workspaces with Owner, Admin and Member roles',
        'Six languages: English, Spanish, French, German, Portuguese and Danish',
        'Installs as a web app, plus a Mac menu-bar app',
        'A Chrome extension for one-click contact capture',
        'An MCP server for programmatic access',
      ],
    },
  ],

  hardParts: [
    {
      title: 'A security counter that never counted',
      problem:
        'The PIN lockout added one to a failed-attempts counter and then raised an error to reject the wrong PIN. It read correctly, passed review twice and worked in every test. But the database runs each call as one transaction, and an error rolls back every write in that call, including the increment just before it. The counter was always zero, so a short PIN could be guessed as fast as requests could be sent.',
      solution:
        'I found it by measuring, not reading: checking the counter after a deliberately wrong attempt and seeing 0 instead of 1. The fix returns a status instead of raising, and raises only on the lockout branch, which writes nothing, so there is nothing to roll back. The app had treated "no error" as success, so it now checks the returned value too.',
    },
    {
      title: 'Voice replies that went silent on a muted phone',
      problem:
        "Voice mode worked in every test and was completely silent on a real iPhone, with no error on screen. A plain audio element obeys the phone's silent switch by design, so a flipped switch muted every reply with nothing to catch.",
      solution:
        'I moved playback to the Web Audio API, unlocked inside the same tap that starts the microphone, which plays through the silent switch the way mobile games do. Anything that still fails now shows an error on screen, so a real failure is never silent again.',
    },
    {
      title: 'A scheduled job that quietly never ran',
      problem:
        'A daily briefing job stopped running with no error anywhere. The scheduler moved its next-run time forward first, then fired the job without waiting for it and returned. The runtime shuts down background work once the response is sent, so the job was dropped, and because the next-run time had already moved, it did not retry until the next day.',
      solution:
        'The scheduler now waits for the job to be handed off before it returns. The rule that came out of it: any function that starts another function has to wait for that call. Fire and forget after a response is often just forget.',
    },
    {
      title: 'Default database permissions that were wide open',
      problem:
        'A routine audit found that the public and signed-in database roles held every privilege on every table by default, including delete, and the public key ships inside the browser bundle. On the stock setup, that key alone could read real customer data and wipe any table.',
      solution:
        'A full lockdown: row-level security forced on every table, every default grant revoked, and default privileges set so the next migration cannot quietly reopen a new table. I checked it by calling the API with the real public key and confirming the rejection, not by reading the config.',
    },
  ],

  outcome: {
    body: [
      'It is live, with a separate marketing site of more than 200 pages built for search. It runs on 246 database migrations and 96 edge functions on a Postgres database where row-level security enforces every workspace boundary. Billing runs live, with a webhook that matches every payment to its plan.',
      'It ships in six languages, installs as a web app, has a Mac menu-bar app, a Chrome extension for capturing contacts and an MCP server for programmatic access. Since the first commit it has shipped a new version on most days, through the same deploy pipeline the whole way.',
      'The same codebase now powers client builds too, which is why a client system can reach a working first version in days instead of weeks.',
    ],
  },

  lessons: [
    'A rewrite is cheap before there is data and expensive after. Make the architecture call you can already see coming while it still costs a day.',
    'Fire and forget in a serverless function is a bug waiting for the runtime to shut down before your request lands. Wait for it.',
    'Code that looks right and passes review can still do nothing. Measure the counter after the attempt.',
    'Cutting scope can be the upgrade. Eighteen agents looked like more product. One assistant that works was the better product.',
    'The model you run a free plan on decides whether the free plan can exist at all.',
    'Default cloud permissions are not safe defaults. Audit security rules and grants on day one, not after a customer asks.',
  ],

  proof:
    'This is what it looks like to take a product from a blank schema to real payments: the database design, the billing, the AI, the email and the marketing site that brings people in, all from one person. If you need something built end to end, not just designed or just coded, this is the work.',

  palette: 'mist',
};
