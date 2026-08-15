/* Programmatic SEO pages under /software/.
   One entry = one page. Rendered by src/pages/software/[slug].astro,
   listed by src/pages/software/index.astro, submitted by sitemap.xml.ts.
   Content rules: Neil's voice, short sentences, no em dashes, honest
   off-the-shelf comparisons, real example builds only where true. */

import { softwareCombos } from './software-combos';

export type SoftwareSection = {
  h2: string;
  body: string[];
  bullets?: string[];
};

export type SoftwarePage = {
  slug: string;
  cat: 'industry' | 'solution' | 'combo' | 'decision';
  title: string;
  metaDescription: string;
  eyebrow: string;
  h1: string; // wrap the accent phrase in **double asterisks**
  lede: string;
  sections: SoftwareSection[];
  faq: { q: string; a: string }[];
  related: string[];
  guide?: { href: string; label: string };
};

const industries: SoftwarePage[] = [
  {
    slug: 'custom-software-for-roofing-companies',
    cat: 'industry',
    title: 'Custom Software for Roofing Companies | Neil Busque',
    metaDescription:
      'Custom software for roofing companies: CRMs, AI phone agents, and quoting tools built around your crews. $4,000/month, first build in 14 days.',
    eyebrow: 'Software · Roofing',
    h1: 'Custom software for **roofing companies**.',
    lede: 'Roofing runs on speed. The first company to call a lead back usually wins the job. I build the software that makes your office as fast as your crews.',
    sections: [
      {
        h2: 'Where roofing companies lose money',
        body: [
          'Leads come in from door knockers, storm maps, referrals, and the website. They land in five places and nobody owns the follow-up. Estimates sit in a truck. The office re-types the same job into three tools.',
          'None of that is a people problem. It is a software problem, and it is very fixable.',
        ],
      },
      {
        h2: 'What I build for roofers',
        body: [
          'Everything connects to what you already use, and everything lives in accounts you own.',
        ],
        bullets: [
          'A CRM shaped around your pipeline: lead, inspection, estimate, build, final invoice',
          'An AI phone agent that answers after hours, qualifies the caller, and books the inspection',
          'Quoting tools that turn an inspection into a clean estimate in minutes',
          'Storm-season follow-up automations that never forget a homeowner',
          'Job dashboards so you see every crew and every stage at a glance',
        ],
      },
      {
        h2: 'Real work, not theory',
        body: [
          'I built an AI voice agent for a commercial roofing contractor that answers calls and captures the details their office used to chase. I have also shipped CRMs, quoting tools, and client portals across 40+ builds this year. Browse the work and judge for yourself.',
        ],
      },
    ],
    faq: [
      {
        q: 'We already use AccuLynx. Why would we need custom software?',
        a: 'If AccuLynx fits how you run jobs, keep it. Custom wins when your process does not fit their boxes: odd commission math, storm-season workflows, or tools your office wishes existed. I often build around an existing platform instead of replacing it.',
      },
      {
        q: 'How fast can a roofing CRM or phone agent be live?',
        a: 'A first working version in 14 days from an approved plan. Real software your team can click, connected to your actual lead sources.',
      },
      {
        q: 'What does it cost?',
        a: '$4,000 a month, published right here. First build lands in month one, and month one is refundable if you are not happy. You own the code and accounts either way.',
      },
    ],
    related: [
      'custom-crm-for-roofing-companies',
      'ai-phone-agent-for-roofing-companies',
      'quoting-software-for-roofing-companies',
      'custom-software-for-hvac-companies',
    ],
  },
  {
    slug: 'custom-software-for-construction-companies',
    cat: 'industry',
    title: 'Custom Software for Construction Companies | Neil Busque',
    metaDescription:
      'Custom software for construction: project tracking, AIA-style progress billing, client portals, and automations. $4,000/month, first build in 14 days.',
    eyebrow: 'Software · Construction',
    h1: 'Custom software for **construction companies**.',
    lede: 'Spreadsheets run more construction companies than any platform does. They work until the third change order. I build tools that match how your projects actually run.',
    sections: [
      {
        h2: 'The spreadsheet that runs the company',
        body: [
          'Most contractors have one: the master sheet with every job, every draw, every retainage number. One person maintains it. Everyone fears breaking it.',
          'Procore and Buildertrend are good platforms, but a 15-person GC often needs 10% of what they sell and one thing they do not have: your exact billing and reporting logic.',
        ],
      },
      {
        h2: 'What I build for contractors',
        body: ['Purpose-built, connected to your accounting, owned by you.'],
        bullets: [
          'Project tracking shaped around your phases, draws, and retainage',
          'Progress billing tools that handle AIA-style applications without the re-typing',
          'Client portals where owners see schedule, photos, and payment status',
          'Change-order workflows with approvals that hold up later',
          'Automated weekly owner reports pulled from real job data',
        ],
      },
      {
        h2: 'Real work, not theory',
        body: [
          'I built an operations app for a commercial contractor that runs their jobs from bid to final payment, including AIA-style progress billing that used to eat their office days every month. That is one of 40+ systems I shipped this year.',
        ],
      },
    ],
    faq: [
      {
        q: 'We use Procore. Is custom still worth it?',
        a: 'Sometimes the answer is no, and I will say so on the call. Custom usually wins for the gap tools: billing logic Procore does not model, owner reporting, or connecting Procore to your accounting without manual exports.',
      },
      {
        q: 'Can you handle progress billing and retainage?',
        a: 'Yes. I have built AIA-style progress billing with retainage math that rebills correctly every period. It is exactly the kind of logic off-the-shelf tools get almost right, which is worse than wrong.',
      },
      {
        q: 'What does it cost?',
        a: '$4,000 a month. First working version in 14 days. Month one is refundable, and you own the code, data, and accounts from day one.',
      },
    ],
    related: [
      'project-tracking-software-for-construction',
      'client-portal-for-construction-companies',
      'workflow-automation-for-construction',
      'custom-software-for-roofing-companies',
    ],
  },
  {
    slug: 'custom-software-for-hvac-companies',
    cat: 'industry',
    title: 'Custom Software for HVAC Companies | Neil Busque',
    metaDescription:
      'Custom software for HVAC: AI phone agents that book service calls, dispatch boards, quoting and maintenance-agreement tools. $4,000/month.',
    eyebrow: 'Software · HVAC',
    h1: 'Custom software for **HVAC companies**.',
    lede: 'Every missed call in July is a job your competitor took. I build software that answers, books, and dispatches while your techs stay on the tools.',
    sections: [
      {
        h2: 'The season decides everything',
        body: [
          'HVAC demand spikes hard. The office that handles January fine drowns in July. Hiring for the peak makes no sense, and voicemail is where service calls go to die.',
          'Software absorbs spikes better than people do. That is the whole case for it.',
        ],
      },
      {
        h2: 'What I build for HVAC companies',
        body: ['Connected to your existing field software where possible, replacing it only where it earns replacement.'],
        bullets: [
          'An AI phone agent that answers every call, quotes service windows, and books the visit',
          'Dispatch boards that show techs, jobs, and zones in one view',
          'Maintenance-agreement tracking with renewals that chase themselves',
          'Flat-rate quoting tools your techs can use from the driveway',
          'After-visit follow-ups that turn one-time calls into agreements',
        ],
      },
      {
        h2: 'Works with ServiceTitan, not against it',
        body: [
          'ServiceTitan and Housecall Pro are strong platforms. If you are on one and it fits, stay. What I usually build is the layer they do not cover for your shop: the phone agent, the odd pricing rule, the report the owner actually wants. You own every piece I build.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can the AI phone agent really book jobs?',
        a: 'Yes. It answers, asks the questions your dispatcher would ask, checks availability, and books the slot. Calls it cannot handle get routed to a human with a summary. You review transcripts any time.',
      },
      {
        q: 'We run ServiceTitan. Will custom tools connect to it?',
        a: 'Usually yes, through their API. Where an integration is not possible I build around it honestly and tell you before we start, not after.',
      },
      {
        q: 'What does it cost?',
        a: '$4,000 a month, first build live in 14 days, month one refundable. No per-tech seat fees, ever.',
      },
    ],
    related: [
      'ai-phone-agent-for-hvac-companies',
      'booking-software-for-hvac-companies',
      'quoting-software-for-hvac-companies',
      'custom-software-for-plumbing-companies',
    ],
  },
  {
    slug: 'custom-software-for-plumbing-companies',
    cat: 'industry',
    title: 'Custom Software for Plumbing Companies | Neil Busque',
    metaDescription:
      'Custom software for plumbing companies: AI answering, emergency dispatch, quoting, and follow-up automations. $4,000/month, first build in 14 days.',
    eyebrow: 'Software · Plumbing',
    h1: 'Custom software for **plumbing companies**.',
    lede: 'A burst pipe at 2am is your best lead of the week, if someone answers. I build the software that picks up, books, and keeps your board full.',
    sections: [
      {
        h2: 'Emergency work rewards whoever answers',
        body: [
          'Plumbing has the most urgent leads in the trades. The homeowner calls the next number the second yours goes to voicemail.',
          'An answering service reads a script. Software that knows your business asks the right questions, quotes the service fee, and books the visit.',
        ],
      },
      {
        h2: 'What I build for plumbers',
        body: ['Every piece runs in accounts you own, and every piece talks to the others.'],
        bullets: [
          'An AI phone agent that answers 24/7, triages emergencies, and books jobs',
          'Simple dispatch views so the office sees every truck and every ticket',
          'Quoting tools for the common jobs, so estimates stop living in text messages',
          'Automatic review requests after every closed job',
          'Repeat-service reminders for water heaters, sump pumps, and inspections',
        ],
      },
      {
        h2: 'Priced for a real plumbing company',
        body: [
          'The field-service platforms price per user and add up fast for a 6-truck shop. My seat is one flat number: $4,000 a month, published here. First working tool in 14 days. If month one does not earn it, you get the month back.',
        ],
      },
    ],
    faq: [
      {
        q: 'How does the AI agent handle a real emergency call?',
        a: 'It asks what happened, where, and how bad, quotes your emergency fee, and books the first slot. If the caller wants a human, it hands off and texts your on-call number a summary immediately.',
      },
      {
        q: 'We are a small shop. Is this overkill?',
        a: 'The smaller the shop, the more one missed call hurts. A first build for a small plumber is usually just the phone agent plus follow-ups. Simple, and it pays for itself in booked jobs.',
      },
      {
        q: 'What does it cost?',
        a: '$4,000 a month, cancel any month. No per-truck fees. You own the number, the software, and the data.',
      },
    ],
    related: [
      'ai-phone-agent-for-plumbing-companies',
      'quoting-software-for-plumbing-companies',
      'custom-software-for-hvac-companies',
      'custom-software-for-landscaping-companies',
    ],
  },
  {
    slug: 'custom-software-for-landscaping-companies',
    cat: 'industry',
    title: 'Custom Software for Landscaping Companies | Neil Busque',
    metaDescription:
      'Custom software for landscaping: estimating tools, route-day scheduling, contract renewals, and crew dashboards. $4,000/month.',
    eyebrow: 'Software · Landscaping',
    h1: 'Custom software for **landscaping companies**.',
    lede: 'Landscaping margins hide in estimating and routing. I build tools that price jobs consistently and keep every crew day full.',
    sections: [
      {
        h2: 'Where the margin leaks',
        body: [
          'Two estimators price the same yard differently. Contracts renew late or not at all. The schedule lives on a whiteboard that cannot see rain coming.',
          'Jobber and Aspire serve this market well at two very different sizes. The gap in the middle, a 10 to 50 person company with its own way of pricing, is where custom earns its keep.',
        ],
      },
      {
        h2: 'What I build for landscapers',
        body: ['Built around your pricing logic, your seasons, and your crews.'],
        bullets: [
          'Estimating tools that price from your real cost model, the same way every time',
          'Seasonal contract tracking with renewals that go out on schedule',
          'Crew-day dashboards: routes, jobs, hours, all in one view',
          'Snow-season switchover workflows if you plow in winter',
          'Simple client portals for commercial accounts that want visibility',
        ],
      },
      {
        h2: 'One price, no per-crew fees',
        body: [
          '$4,000 a month for an AI systems builder on your team. First tool live in 14 days. Month one refundable. Everything in your accounts, so if we part ways, nothing stops working.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can you match our estimating spreadsheet?',
        a: 'Yes, and that spreadsheet is usually the best spec I could ask for. I turn it into a tool the whole team can use without breaking the formulas.',
      },
      {
        q: 'We do maintenance and installs. Can one system handle both?',
        a: 'Yes. Recurring maintenance and one-time installs need different pipelines, and forcing them into one is why generic CRMs feel wrong. I build both flows properly.',
      },
      {
        q: 'What does it cost?',
        a: '$4,000 a month, flat. No per-user pricing, no seasonal upcharge. Cancel any month and keep everything.',
      },
    ],
    related: [
      'quoting-software-for-landscaping-companies',
      'custom-crm-for-landscaping-companies',
      'custom-software-for-plumbing-companies',
      'custom-software-for-roofing-companies',
    ],
  },
  {
    slug: 'custom-software-for-dental-practices',
    cat: 'industry',
    title: 'Custom Software for Dental Practices | Neil Busque',
    metaDescription:
      'Custom software for dental practices: AI phone answering, recall automation, and patient communication tools that work with your PMS. $4,000/month.',
    eyebrow: 'Software · Dental',
    h1: 'Custom software for **dental practices**.',
    lede: 'Your front desk is doing three jobs at once, and the phone always loses. I build the software layer that answers, reminds, and refills the chair.',
    sections: [
      {
        h2: 'The front desk bottleneck',
        body: [
          'Every missed call is a new patient who books somewhere else. Every unfilled recall is production lost quietly. The practice management system holds the data but does not do the chasing.',
          'I build the chasing layer: the software that works your schedule and your phone so the front desk can work the patients in front of them.',
        ],
      },
      {
        h2: 'What I build for dental offices',
        body: ['Designed to sit alongside Dentrix, Eaglesoft, or Open Dental, not fight them.'],
        bullets: [
          'An AI phone agent that answers overflow and after-hours calls and books consults',
          'Recall and reactivation campaigns that fill hygiene weeks out',
          'No-show reduction: confirmations, reminders, and easy rescheduling by text',
          'New-patient intake that happens before the visit, not on a clipboard',
          'A simple morning dashboard: today’s schedule, gaps, and who to call',
        ],
      },
      {
        h2: 'Careful with patient data',
        body: [
          'Health data gets handled properly: encrypted accounts in your name, minimal data collection, and access you can revoke. If a build touches territory that needs formal compliance review beyond what one builder should own, I say so on the first call.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does this replace our practice management software?',
        a: 'No. Dentrix or Open Dental stays your system of record. I build the layer around it: phones, reminders, recall, and reporting. Replacement projects that big are exactly what I tell owners not to buy from one builder.',
      },
      {
        q: 'Will the AI answering sound like a robot?',
        a: 'It sounds like a polite, fast receptionist. Patients can always reach a human, and every call leaves a transcript your team can read.',
      },
      {
        q: 'What does it cost?',
        a: '$4,000 a month, first working tool in 14 days, month one refundable. Compare that to one unfilled chair day.',
      },
    ],
    related: [
      'ai-phone-agent-for-dental-practices',
      'booking-software-for-dental-practices',
      'custom-software-for-med-spas',
      'ai-phone-agent-for-medical-offices',
    ],
  },
  {
    slug: 'custom-software-for-law-firms',
    cat: 'industry',
    title: 'Custom Software for Law Firms | Neil Busque',
    metaDescription:
      'Custom software for law firms: client intake automation, secure portals, and AI email triage that respects confidentiality. $4,000/month.',
    eyebrow: 'Software · Legal',
    h1: 'Custom software for **law firms**.',
    lede: 'Firms bill hours, then spend unbillable ones on intake, status calls, and email. I build systems that give those hours back.',
    sections: [
      {
        h2: 'The unbillable work problem',
        body: [
          'A small firm loses entire days to intake forms, "any update?" calls, and inbox triage. Clio and MyCase manage matters well, but the work around the edges stays manual.',
          'That edge work is exactly what software should do: collect, route, remind, and report, without a paralegal touching it.',
        ],
      },
      {
        h2: 'What I build for firms',
        body: ['Confidentiality first: your accounts, your data, access you control.'],
        bullets: [
          'Intake automation: forms, conflict-check prompts, engagement letters, all flowing into your matter system',
          'Secure client portals that answer "what is happening with my case" before anyone calls',
          'AI email triage that drafts routine replies for attorney review',
          'Deadline and status dashboards across every open matter',
          'After-hours AI phone answering that captures new-client details properly',
        ],
      },
      {
        h2: 'Built alongside Clio, not instead of it',
        body: [
          'If Clio fits, keep Clio. I connect to it and build what it does not do for your practice area: the personal-injury intake flow, the immigration document checklist, the estate-planning follow-up sequence. Specific beats general.',
        ],
      },
    ],
    faq: [
      {
        q: 'How do you handle confidentiality?',
        a: 'Everything runs in accounts your firm owns. I access only what the build needs, and you can revoke that access any time. AI drafting stays inside your accounts too, and I will walk your managing partner through exactly where data flows.',
      },
      {
        q: 'Can the AI send emails to clients on its own?',
        a: 'Only if you want it to, and most firms should not start there. The safe pattern is AI drafts, attorney approves, system sends. Judgment stays with the lawyer.',
      },
      {
        q: 'What does it cost?',
        a: '$4,000 a month, flat, published here. First working system in 14 days. Month one refundable if it does not earn its keep.',
      },
    ],
    related: [
      'client-portal-for-law-firms',
      'workflow-automation-for-law-firms',
      'ai-email-assistant-for-law-firms',
      'custom-software-for-accounting-firms',
    ],
  },
  {
    slug: 'custom-software-for-real-estate-teams',
    cat: 'industry',
    title: 'Custom Software for Real Estate Teams | Neil Busque',
    metaDescription:
      'Custom software for real estate teams: speed-to-lead automation, custom CRMs, and AI follow-up that works your database. $4,000/month.',
    eyebrow: 'Software · Real Estate',
    h1: 'Custom software for **real estate teams**.',
    lede: 'The team that calls in five minutes beats the team that calls in an hour. I build the software that makes five minutes automatic.',
    sections: [
      {
        h2: 'Speed to lead is the whole game',
        body: [
          'Zillow leads, sign calls, open-house sheets, referrals: they arrive scattered and cool off fast. Follow Up Boss and kvCORE work the mainstream flow well. Teams with their own model, ISAs, or investor pipelines outgrow the boxes.',
          'Custom software means your pipeline matches how your team actually sells, not how a vendor guessed teams sell.',
        ],
      },
      {
        h2: 'What I build for real estate teams',
        body: ['One flat price. No per-agent seat fees as you grow.'],
        bullets: [
          'Lead routing that texts the right agent in seconds, with instant AI first-touch',
          'A CRM shaped to your pipeline: nurture, active, under contract, past client',
          'AI phone answering for sign calls and after-hours inquiries',
          'Long-term nurture that works the 12-month database, not just this week’s leads',
          'Transaction dashboards so nothing dies between contract and close',
        ],
      },
      {
        h2: 'Your database is the asset',
        body: [
          'Teams switch platforms and lose years of contact history to export limits. Everything I build keeps your data in your own accounts, exportable, yours. That alone is worth the switch conversation.',
        ],
      },
    ],
    faq: [
      {
        q: 'We use Follow Up Boss. Replace or extend?',
        a: 'Extend first. FUB has a good API, and the highest-value builds are usually the AI first-touch, the sign-call agent, and reporting FUB does not do. Replacement only makes sense when seat fees or workflow limits actually hurt.',
      },
      {
        q: 'Is AI first-touch allowed on leads?',
        a: 'Instant text-back with honest identification and opt-out handling, tuned to the rules that apply to your market. Draft-for-review flows are available where you want a human eye first.',
      },
      {
        q: 'What does it cost?',
        a: '$4,000 a month for the whole team. Compare that to per-agent pricing across 15 agents and the math gets easy.',
      },
    ],
    related: [
      'custom-crm-for-real-estate-teams',
      'workflow-automation-for-real-estate',
      'ai-phone-agent-for-real-estate',
      'custom-software-for-property-management',
    ],
  },
  {
    slug: 'custom-software-for-property-management',
    cat: 'industry',
    title: 'Custom Software for Property Management | Neil Busque',
    metaDescription:
      'Custom software for property managers: tenant portals, maintenance triage, owner reporting, and AI phone answering. $4,000/month.',
    eyebrow: 'Software · Property Management',
    h1: 'Custom software for **property management companies**.',
    lede: 'Every door you add multiplies the calls, tickets, and owner questions. I build the systems that scale doors without scaling headcount.',
    sections: [
      {
        h2: 'The per-door math problem',
        body: [
          'Margins per door are thin and the work per door is constant: maintenance calls, rent questions, owner statements, turnovers. AppFolio and Buildium handle the accounting spine well.',
          'The overflow lives around that spine: the 7pm maintenance call, the owner who wants a custom report, the turnover checklist in someone’s head. That overflow is what I automate.',
        ],
      },
      {
        h2: 'What I build for property managers',
        body: ['Connected to your existing management platform wherever it has an API.'],
        bullets: [
          'AI phone answering that triages maintenance calls: emergency now, ticket for morning',
          'Tenant portals for the questions that fill your inbox',
          'Owner dashboards with the numbers owners actually ask for',
          'Turnover workflows: checklist, vendors, photos, deposit math',
          'Delinquency follow-up sequences that stay polite and consistent',
        ],
      },
      {
        h2: 'Real work, not theory',
        body: [
          'I have shipped tenant-facing portals, booking systems, and operations dashboards among 40+ builds this year. Property management is workflow software, and workflow software is the job.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does this replace AppFolio or Buildium?',
        a: 'No. Those stay your system of record for accounting and leases. I build the layer that reduces calls and manual work around them. Replacing your accounting spine is a project I would talk you out of.',
      },
      {
        q: 'How does maintenance triage actually work?',
        a: 'The AI answers, asks what happened, and applies your rules: burst pipe gets the on-call plumber now, dripping faucet becomes a morning ticket with photos requested by text. You set the rules, it applies them at 2am.',
      },
      {
        q: 'What does it cost?',
        a: '$4,000 a month regardless of door count. First build in 14 days. Month one refundable.',
      },
    ],
    related: [
      'client-portal-for-property-management',
      'ai-phone-agent-for-property-management',
      'workflow-automation-for-property-management',
      'custom-software-for-real-estate-teams',
    ],
  },
  {
    slug: 'custom-software-for-accounting-firms',
    cat: 'industry',
    title: 'Custom Software for Accounting Firms | Neil Busque',
    metaDescription:
      'Custom software for accounting firms: client document portals, deadline tracking, and workflow automation for tax season. $4,000/month.',
    eyebrow: 'Software · Accounting',
    h1: 'Custom software for **accounting firms**.',
    lede: 'Tax season should not run on email attachments and memory. I build the systems that chase documents and deadlines so your staff can do the work.',
    sections: [
      {
        h2: 'The document chase',
        body: [
          'Every return waits on a client who has not sent the thing. Staff burn hours emailing "just following up on the 1099" while deadlines stack.',
          'Karbon and Canopy run firm workflow well. What firms keep asking for is the client-facing layer: collection that chases itself and a portal clients actually use.',
        ],
      },
      {
        h2: 'What I build for firms',
        body: ['Secure by default: encrypted storage, your accounts, access you control.'],
        bullets: [
          'Client portals for document upload that confirm, remind, and track completeness',
          'Automated document chasing that escalates politely until the file arrives',
          'Deadline dashboards across every client and every filing type',
          'Engagement and onboarding flows: letter, checklist, kickoff, all automatic',
          'AI email triage that drafts the routine replies for review',
        ],
      },
      {
        h2: 'Priced like a line item, not a project',
        body: [
          '$4,000 a month, published here because you of all people appreciate a real number. First working tool in 14 days. Month one refundable. Cancel after busy season if you want; everything keeps working because you own it.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is client data safe?',
        a: 'Everything runs in accounts your firm owns, encrypted, with access you can revoke. I collect the minimum and I will walk you through exactly where every document lives.',
      },
      {
        q: 'Can it connect to our tax software?',
        a: 'The workflow layer connects where APIs exist and works alongside where they do not. The document chase, deadlines, and portal do not need to touch your tax software at all.',
      },
      {
        q: 'What does it cost?',
        a: '$4,000 a month, flat. If you only need it built once and then want to leave, that is allowed. You keep everything.',
      },
    ],
    related: [
      'client-portal-for-accounting-firms',
      'workflow-automation-for-accounting-firms',
      'custom-software-for-law-firms',
      'ai-email-assistant-for-business',
    ],
  },
  {
    slug: 'custom-software-for-med-spas',
    cat: 'industry',
    title: 'Custom Software for Med Spas | Neil Busque',
    metaDescription:
      'Custom software for med spas: booking that fills the calendar, membership management, and AI phone answering. $4,000/month.',
    eyebrow: 'Software · Med Spa',
    h1: 'Custom software for **med spas**.',
    lede: 'Your calendar is your revenue. I build the software that keeps it full: booking, memberships, reminders, and a phone that always answers.',
    sections: [
      {
        h2: 'Empty slots are the expensive kind',
        body: [
          'A missed call during a treatment is a consult lost. A no-show is an hour of provider time gone. Membership churn hides until the month it hurts.',
          'Mindbody and Boulevard cover the mainstream. Custom wins when your packages, provider rules, or growth plans stop fitting their tiers, and their per-location pricing starts to sting.',
        ],
      },
      {
        h2: 'What I build for med spas',
        body: ['Front-desk quality, without adding front desk.'],
        bullets: [
          'Booking flows tuned to your services, providers, rooms, and devices',
          'An AI phone agent that answers during treatments and books consults',
          'Membership and package tracking with renewal and usage nudges',
          'No-show reduction: deposits, confirmations, easy rescheduling',
          'Pre- and post-treatment instruction sequences clients actually read',
        ],
      },
      {
        h2: 'Careful with client data',
        body: [
          'Treatment history is sensitive. Everything runs encrypted in accounts you own, collected minimally. Anything that crosses into territory needing formal medical-compliance review gets flagged on the first call, honestly.',
        ],
      },
    ],
    faq: [
      {
        q: 'We use Mindbody. Why switch?',
        a: 'Maybe do not switch. The highest-value first build is often the AI phone agent plus reminder flows layered on top of what you have. If a full replacement ever makes sense, you will know because the math says so, not because I pushed it.',
      },
      {
        q: 'Can it handle memberships and packages?',
        a: 'Yes, including the odd ones: split payments, shared family credits, provider-specific rules. Odd rules are exactly why custom exists.',
      },
      {
        q: 'What does it cost?',
        a: '$4,000 a month, first build in 14 days, month one refundable. About the revenue of a few filled slots you are currently missing.',
      },
    ],
    related: [
      'booking-software-for-med-spas',
      'ai-phone-agent-for-med-spas',
      'custom-software-for-dental-practices',
      'custom-software-for-gyms',
    ],
  },
  {
    slug: 'custom-software-for-gyms',
    cat: 'industry',
    title: 'Custom Software for Gyms & Fitness Studios | Neil Busque',
    metaDescription:
      'Custom software for gyms and studios: member portals, retention automation, class booking, and churn-saving check-ins. $4,000/month.',
    eyebrow: 'Software · Fitness',
    h1: 'Custom software for **gyms and studios**.',
    lede: 'Gyms lose more revenue to quiet churn than to slow sales. I build the software that notices the member fading and does something about it.',
    sections: [
      {
        h2: 'Churn is a data problem first',
        body: [
          'A member who stops showing up in week 3 cancels in month 2. The signal is sitting in your check-in data the whole time. Nobody has time to watch it.',
          'Software watches it for free, every night, and triggers the save: a message, an offer, a coach check-in.',
        ],
      },
      {
        h2: 'What I build for gyms',
        body: ['Works alongside Mindbody, Glofox, or your access-control system.'],
        bullets: [
          'Attendance-based churn alerts with automatic win-back sequences',
          'Member portals: schedule, milestones, referrals, one place',
          'Class booking with waitlists that fill themselves',
          'Lead follow-up for trials that actually converts week one',
          'Simple owner dashboards: attendance, churn risk, revenue trend',
        ],
      },
      {
        h2: 'One flat price',
        body: [
          '$4,000 a month, no per-member fees, no per-location multiplier. First working tool in 14 days. Month one refundable. You own it all, so it keeps working even if we stop.',
        ],
      },
    ],
    faq: [
      {
        q: 'What is a good first build for a gym?',
        a: 'Churn alerts plus win-back automation, almost always. It uses data you already have, ships fast, and pays for itself the first month it saves a handful of members.',
      },
      {
        q: 'Can it read our check-in data?',
        a: 'Most access and booking systems export or expose attendance. I build on whatever yours provides, and I will confirm the path on the first call before you pay anything.',
      },
      {
        q: 'What does it cost?',
        a: '$4,000 a month. Saving roughly a member a week covers it for most studios, and the system works nights and weekends.',
      },
    ],
    related: [
      'booking-software-for-gyms',
      'client-portal-for-gyms',
      'custom-software-for-med-spas',
      'workflow-automation-for-small-business',
    ],
  },
];

const solutions: SoftwarePage[] = [
  {
    slug: 'custom-crm-development',
    cat: 'solution',
    title: 'Custom CRM Development for Small Business | Neil Busque',
    metaDescription:
      'Custom CRM development: a CRM shaped to your pipeline, owned by you, no per-seat fees. $4,000/month, first version in 14 days.',
    eyebrow: 'Software · CRM',
    h1: 'A **custom CRM** shaped like your business.',
    lede: 'Generic CRMs make your business fit their pipeline. A custom CRM fits yours: your stages, your follow-up rules, your reports, no per-seat rent.',
    sections: [
      {
        h2: 'When custom beats HubSpot and Salesforce',
        body: [
          'HubSpot and Salesforce are excellent platforms, and for many teams the right answer. Custom wins in three situations: your pipeline logic does not fit their objects, per-seat pricing has become a tax on growth, or you use 10% of the platform and pay for 100%.',
          'A custom CRM has exactly your fields, your stages, your automations. Nothing to configure around, nothing unused.',
        ],
      },
      {
        h2: 'What a custom CRM includes',
        body: ['Built in modern, boring tech your next developer can maintain.'],
        bullets: [
          'Pipelines that mirror how you actually sell, not a template',
          'Automated follow-ups so no lead dies of silence',
          'Email and calendar sync, call logging, task management',
          'Reports the owner actually wants, on a dashboard, not in an export',
          'Integrations with your phone system, forms, and billing',
        ],
      },
      {
        h2: 'I use my own',
        body: [
          'I run my business on a CRM I built, and I have shipped CRM builds for client teams this year alongside 40+ other systems. The demo on my offer page is a real one with sample data. Ask to click around it on the call.',
        ],
      },
    ],
    faq: [
      {
        q: 'How long does a custom CRM take?',
        a: 'A working first version in 14 days from an approved plan: your pipeline, your fields, your data imported. Then it grows month by month while your team uses it.',
      },
      {
        q: 'What about our data in the old CRM?',
        a: 'Migration is part of the build. Contacts, deals, notes, history: exported, cleaned, imported. The old system stays live until you trust the new one.',
      },
      {
        q: 'What does it cost compared to HubSpot?',
        a: '$4,000 a month while I am building for you, then nothing but hosting pennies when you stop. Fifteen seats on a mid-tier platform plan often costs more, forever, for software you rent.',
      },
    ],
    related: [
      'custom-crm-for-roofing-companies',
      'custom-crm-for-real-estate-teams',
      'custom-crm-for-landscaping-companies',
      'custom-software-vs-off-the-shelf',
    ],
  },
  {
    slug: 'ai-phone-agent-for-business',
    cat: 'solution',
    title: 'AI Phone Agent for Your Business | Neil Busque',
    metaDescription:
      'A custom AI phone agent that answers every call, books appointments, and hands hard calls to humans. Built for your business. $4,000/month.',
    eyebrow: 'Software · AI Phone',
    h1: 'An **AI phone agent** that never misses a call.',
    lede: 'It answers on the second ring, sounds human, asks the questions your best receptionist asks, and books the job. At 2pm and at 2am.',
    sections: [
      {
        h2: 'Better than voicemail, cheaper than an answering service',
        body: [
          'Voicemail loses the lead. Answering services read scripts and take messages you still have to chase. An AI agent built for your business qualifies the caller, answers real questions, checks your calendar, and books.',
          'Every call leaves a transcript and a summary. Nothing gets lost between a sticky note and a shift change.',
        ],
      },
      {
        h2: 'What your agent can do',
        body: ['Built on the same voice stack I have shipped for real client phone lines.'],
        bullets: [
          'Answer 24/7 with your greeting, your tone, your rules',
          'Qualify callers with the questions you decide matter',
          'Book directly into your calendar or field-service software',
          'Route emergencies and VIPs straight to a human, with context',
          'Log every call, transcript, and outcome where you can see it',
        ],
      },
      {
        h2: 'Real work, not theory',
        body: [
          'I built an AI voice agent for a commercial roofing contractor that answers and captures the calls their office used to miss. Voice is unforgiving to build well, which is exactly why it is worth having built properly.',
        ],
      },
    ],
    faq: [
      {
        q: 'Will callers know it is AI?',
        a: 'It identifies itself honestly and sounds natural. What callers care about is being helped fast. It helps them fast, and anyone who asks for a person gets one immediately.',
      },
      {
        q: 'What happens on a call it cannot handle?',
        a: 'It transfers to your on-call number with a live summary, or takes a detailed message and texts your team instantly. You define the escalation rules; it follows them every time.',
      },
      {
        q: 'What does it cost?',
        a: 'Part of the $4,000 a month seat, and a phone agent is a common first build: live inside 14 days. Month one refundable. The phone number and every account stay in your name.',
      },
    ],
    related: [
      'ai-phone-agent-for-hvac-companies',
      'ai-phone-agent-for-dental-practices',
      'ai-phone-agent-vs-answering-service',
      'ai-phone-agent-for-plumbing-companies',
    ],
    guide: { href: '/guides/build-ai-agent-claude-code', label: 'How I build AI agents' },
  },
  {
    slug: 'client-portal-development',
    cat: 'solution',
    title: 'Client Portal Development | Neil Busque',
    metaDescription:
      'Custom client portals: give clients one login for status, documents, and payments, and stop answering the same email. $4,000/month.',
    eyebrow: 'Software · Portals',
    h1: 'A **client portal** that answers the emails for you.',
    lede: 'Half your inbox is clients asking things a login could answer. Status, documents, invoices, next steps: one portal, zero "just checking in" emails.',
    sections: [
      {
        h2: 'The "any update?" tax',
        body: [
          'Service businesses pay a quiet tax: hours every week answering questions the client could self-serve. Worse, clients hate asking. A portal makes you look bigger and calmer than the competition on day one.',
          'I have shipped client portals for real service teams, including portals with white-label branding per client. It is one of the most requested builds on my list, because it works.',
        ],
      },
      {
        h2: 'What a portal includes',
        body: ['Branded yours, in your accounts, on your domain.'],
        bullets: [
          'Live project or case status the client checks instead of emailing',
          'Document upload and download with confirmations and reminders',
          'Invoices and payments in the same place, connected to Stripe',
          'Messages and approvals that stay attached to the work',
          'A clean mobile experience, because clients check from their phone',
        ],
      },
      {
        h2: 'Fits your stack',
        body: [
          'The portal reads from the tools you already run, whether that is your CRM, your project tracker, or the system I built you last month. Clients see a calm, single view. You keep working the way you work.',
        ],
      },
    ],
    faq: [
      {
        q: 'Will clients actually use it?',
        a: 'They use it when it is faster than emailing you, which is the design bar. One login, instant status, documents in one place. The reminder emails link straight into it, so adoption takes care of itself.',
      },
      {
        q: 'Can it match our branding?',
        a: 'Yes, fully: your logo, colors, and domain. If you serve multiple clients under different brands, per-client theming is a build I have already shipped elsewhere.',
      },
      {
        q: 'What does it cost?',
        a: 'Part of the $4,000 a month seat. A first portal is live in 14 days, month one refundable, and you own the code and every account.',
      },
    ],
    related: [
      'client-portal-for-law-firms',
      'client-portal-for-accounting-firms',
      'client-portal-for-construction-companies',
      'custom-software-vs-off-the-shelf',
    ],
  },
  {
    slug: 'quoting-and-invoicing-software',
    cat: 'solution',
    title: 'Custom Quoting & Invoicing Software | Neil Busque',
    metaDescription:
      'Custom quoting and invoicing tools: price jobs consistently, send clean quotes fast, and stop re-typing into your accounting. $4,000/month.',
    eyebrow: 'Software · Quoting',
    h1: '**Quoting software** that prices like your best estimator.',
    lede: 'Your pricing logic lives in one person’s head or one fragile spreadsheet. I turn it into a tool anyone on the team can use without breaking it.',
    sections: [
      {
        h2: 'Inconsistent quotes cost real margin',
        body: [
          'Two estimators, same job, different price: that gap is margin leaking. Slow quotes cost even more, because the fast quote usually wins the work.',
          'A custom quoting tool encodes your cost model once. Then every quote comes out consistent, branded, and fast, from anyone.',
        ],
      },
      {
        h2: 'What I build',
        body: ['Connected to your CRM on one side and your accounting on the other.'],
        bullets: [
          'Guided quote builders that walk through your real pricing logic',
          'Branded proposals sent in minutes, with e-signature',
          'Quote-to-invoice flow with no re-typing into QuickBooks',
          'Follow-up automation for quotes that go quiet',
          'Margin visibility per quote, before you send it',
        ],
      },
      {
        h2: 'Your spreadsheet is the spec',
        body: [
          'That estimating spreadsheet you are afraid to touch is the best starting point I could ask for. I turn it into software with guardrails, and the person who built it becomes its owner instead of its hostage.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it handle our weird pricing rules?',
        a: 'Weird rules are the reason to go custom. Tiered materials, zone-based labor, seasonal multipliers, commission math: if you can explain it, I can encode it.',
      },
      {
        q: 'Does it connect to QuickBooks?',
        a: 'Yes. Accepted quotes become invoices without re-typing, and payments flow back so you can see what is outstanding without opening two systems.',
      },
      {
        q: 'What does it cost?',
        a: 'Part of the $4,000 a month seat, first version in 14 days. Month one refundable. Most shops feel the payback in the first week of faster quotes.',
      },
    ],
    related: [
      'quoting-software-for-roofing-companies',
      'quoting-software-for-hvac-companies',
      'quoting-software-for-landscaping-companies',
      'custom-crm-development',
    ],
  },
  {
    slug: 'workflow-automation-services',
    cat: 'solution',
    title: 'Workflow Automation Services | Neil Busque',
    metaDescription:
      'Workflow automation services that kill copy-paste: connect your tools, automate the busywork, and get reports that send themselves. $4,000/month.',
    eyebrow: 'Software · Automation',
    h1: '**Workflow automation** that kills the copy-paste.',
    lede: 'Somewhere in your office, a person is re-typing data from one tool into another, every week, forever. That job should belong to software.',
    sections: [
      {
        h2: 'The busywork audit',
        body: [
          'Most businesses run on 5 to 15 tools that do not talk to each other. The gaps get bridged by people: exporting, re-typing, chasing, reminding. Each bridge is minutes a day that compound into someone’s entire job.',
          'The first thing I do on a call is find the three most expensive bridges. Those are the first automations.',
        ],
      },
      {
        h2: 'What I automate',
        body: ['Built in n8n and custom code, in your accounts, documented so it is never a mystery box.'],
        bullets: [
          'Data flowing between your CRM, accounting, forms, and calendars automatically',
          'Reports that assemble themselves and arrive on schedule',
          'Follow-up sequences that never forget: quotes, invoices, reviews, renewals',
          'Document generation: contracts and proposals from your live data',
          'Alerts when something needs a human: big deal, overdue invoice, angry email',
        ],
      },
      {
        h2: 'Automation with judgment',
        body: [
          'Not everything should be automated. Anything customer-facing gets a human-approval option, and anything risky fails loudly instead of silently. I have written about choosing the right automation stack; the short version is the tool matters less than the judgment.',
        ],
      },
    ],
    faq: [
      {
        q: 'What is a good first automation?',
        a: 'The one your team complains about most. Usually it is lead intake to CRM, quote follow-ups, or the weekly report someone assembles by hand. First one live inside 14 days.',
      },
      {
        q: 'What if an automation breaks?',
        a: 'It alerts instead of failing silently, and while you hold the seat I fix it as part of the month. That monitoring habit is the difference between automation and a future mess.',
      },
      {
        q: 'What does it cost?',
        a: '$4,000 a month, and automations usually come several per month since each is smaller than an app build. Month one refundable. You own every workflow.',
      },
    ],
    related: [
      'workflow-automation-for-construction',
      'workflow-automation-for-law-firms',
      'workflow-automation-for-small-business',
      'ai-email-assistant-for-business',
    ],
    guide: { href: '/guides/n8n-vs-zapier-vs-make', label: 'n8n vs Zapier vs Make' },
  },
  {
    slug: 'ai-email-assistant-for-business',
    cat: 'solution',
    title: 'AI Email Assistant for Business | Neil Busque',
    metaDescription:
      'A custom AI email assistant: triage the inbox, draft replies for review, and never lose a lead in the pile. $4,000/month.',
    eyebrow: 'Software · AI Email',
    h1: 'An **AI email assistant** for the inbox that never empties.',
    lede: 'The inbox is where leads cool off and balls get dropped. I build assistants that triage, draft, and chase, while a human keeps the judgment calls.',
    sections: [
      {
        h2: 'Draft-first, not send-first',
        body: [
          'The safe pattern for business email AI: it reads, sorts, and drafts. A human approves anything that matters. You get the speed without handing your reputation to a bot.',
          'Over time, the boring categories go fully automatic, because you decided they should, not because the software guessed.',
        ],
      },
      {
        h2: 'What the assistant does',
        body: ['Runs inside your Google Workspace or Microsoft 365 accounts. Nothing leaves your control.'],
        bullets: [
          'Triage: urgent, needs-you, routine, noise, sorted before you look',
          'Drafted replies in your voice for one-click review and send',
          'Lead detection: new inquiries get flagged and answered fast',
          'Follow-up tracking: threads that went quiet get resurfaced',
          'A morning digest of what actually needs a decision',
        ],
      },
      {
        h2: 'Tuned to your voice',
        body: [
          'The assistant learns from your sent mail: how you greet, how you close, how direct you are. The drafts read like you on a good day, not like a template. You will edit less than you expect.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it send without asking me?',
        a: 'Only categories you explicitly automate, like appointment confirmations. Everything else is draft-for-review. You loosen the rules at your pace, not mine.',
      },
      {
        q: 'Is my email safe?',
        a: 'It runs inside your own workspace accounts with access you can revoke. No mail gets copied out to third parties, and I will show you exactly where every piece flows.',
      },
      {
        q: 'What does it cost?',
        a: 'Part of the $4,000 a month seat, often paired with a phone agent or CRM in the same month. First version in 14 days. Month one refundable.',
      },
    ],
    related: [
      'ai-email-assistant-for-law-firms',
      'workflow-automation-services',
      'ai-phone-agent-for-business',
      'custom-crm-development',
    ],
  },
  {
    slug: 'booking-and-scheduling-software',
    cat: 'solution',
    title: 'Custom Booking & Scheduling Software | Neil Busque',
    metaDescription:
      'Custom booking systems built around your real rules: providers, rooms, crews, deposits, reminders. No per-booking fees. $4,000/month.',
    eyebrow: 'Software · Booking',
    h1: '**Booking software** built around your real rules.',
    lede: 'Calendly is great until your rules get real: two providers, one room, a deposit, and a 48-hour cancellation window. Then you need booking software that knows your business.',
    sections: [
      {
        h2: 'When generic scheduling breaks',
        body: [
          'Generic schedulers assume one person, one calendar, simple slots. Real businesses have crews, rooms, equipment, travel time, deposits, and no-show policies. Duct-taping that onto a simple tool creates double-bookings and awkward client emails.',
          'A custom booking system encodes the constraints once, then just works.',
        ],
      },
      {
        h2: 'What I build',
        body: ['On your domain, in your brand, with no per-booking fees skimming you.'],
        bullets: [
          'Availability logic across providers, rooms, crews, and equipment',
          'Deposits and payments at booking, through your own Stripe',
          'Reminder sequences that actually cut no-shows',
          'Rescheduling flows clients can do themselves without calling',
          'Calendar sync both directions with Google and Microsoft',
        ],
      },
      {
        h2: 'Real work, not theory',
        body: [
          'I have shipped booking systems inside CRMs and standalone, including fetch-ahead availability that keeps busy calendars fast. Scheduling looks simple and is not, which is why it is worth building properly once.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it handle deposits and cancellation fees?',
        a: 'Yes, through your own Stripe account: deposits at booking, your cancellation policy enforced automatically, refunds by your rules. The money never touches my accounts.',
      },
      {
        q: 'Will it sync with our existing calendars?',
        a: 'Both directions with Google and Microsoft. Your team keeps living in their calendar; the booking system keeps it accurate.',
      },
      {
        q: 'What does it cost?',
        a: 'Part of the $4,000 a month seat. A booking system is a classic 14-day first build. Month one refundable, and there are no per-booking fees, ever.',
      },
    ],
    related: [
      'booking-software-for-med-spas',
      'booking-software-for-hvac-companies',
      'booking-software-for-gyms',
      'booking-software-for-dental-practices',
    ],
  },
  {
    slug: 'custom-dashboards-and-reporting',
    cat: 'solution',
    title: 'Custom Dashboards & Business Reporting | Neil Busque',
    metaDescription:
      'Custom dashboards that pull from your real tools: one screen with the numbers that matter, updated automatically. $4,000/month.',
    eyebrow: 'Software · Dashboards',
    h1: 'A **dashboard** with the numbers you actually run on.',
    lede: 'Your numbers exist, scattered across six tools and one heroic spreadsheet. I build the one screen that shows the business truthfully, every morning.',
    sections: [
      {
        h2: 'The Monday-morning assembly job',
        body: [
          'Someone in your business spends hours assembling the same report every week: exports, pivot tables, screenshots into a slide. The report is stale by the time it is read.',
          'A custom dashboard does that assembly continuously. The owner checks it like weather.',
        ],
      },
      {
        h2: 'What I build',
        body: ['Live connections, not exports. Your accounts, your data, your definitions.'],
        bullets: [
          'One screen per audience: owner view, ops view, sales view',
          'Live pulls from your CRM, accounting, ads, and field software',
          'The metrics defined your way, not a template’s way',
          'Scheduled email or Slack summaries for people who will not open a dashboard',
          'Alerts when a number crosses a line you set',
        ],
      },
      {
        h2: 'Honest numbers only',
        body: [
          'A dashboard is only useful if you trust it. I document where every number comes from and reconcile against your source systems before you rely on it. If a metric cannot be trusted yet, it says so on the screen instead of pretending.',
        ],
      },
    ],
    faq: [
      {
        q: 'Which tools can you pull from?',
        a: 'Most modern tools have APIs: QuickBooks, HubSpot, Stripe, Google Ads, ServiceTitan, and hundreds more. Where there is no API there is usually an export we can automate. I confirm your exact stack on the call.',
      },
      {
        q: 'How is this different from Looker or Power BI?',
        a: 'Those are powerful platforms you staff and configure. This is done-for-you: I build the pipelines, define the metrics with you, and hand you a screen that is simply correct. No BI hire needed.',
      },
      {
        q: 'What does it cost?',
        a: 'Part of the $4,000 a month seat, first dashboard live in 14 days. Month one refundable. The data pipelines are documented and yours.',
      },
    ],
    related: [
      'workflow-automation-services',
      'custom-crm-development',
      'custom-software-cost',
      'custom-software-vs-off-the-shelf',
    ],
  },
];

const decisions: SoftwarePage[] = [
  {
    slug: 'custom-software-vs-off-the-shelf',
    cat: 'decision',
    title: 'Custom Software vs Off-the-Shelf: an Honest Guide | Neil Busque',
    metaDescription:
      'Custom software vs off-the-shelf SaaS: when each wins, real cost math, and the questions to ask before you build. From a builder who tells people not to build.',
    eyebrow: 'Software · Decisions',
    h1: 'Custom software **vs off-the-shelf**: the honest version.',
    lede: 'I sell custom software, and I still tell some owners to buy the SaaS. Here is the actual decision, without the sales pitch.',
    sections: [
      {
        h2: 'When off-the-shelf wins',
        body: [
          'Buy the SaaS when your process is standard, the tool fits without contortions, and the seat math stays sane. Accounting is the classic case: use QuickBooks, do not build one.',
          'A good platform also carries features you will grow into. Renting a mature product beats building a worse copy of it.',
        ],
      },
      {
        h2: 'When custom wins',
        body: ['Three signals, and you only need one:'],
        bullets: [
          'The workaround tax: your team bends its day around the tool, with spreadsheets bridging every gap',
          'The seat-fee tax: per-user pricing has turned growth into a penalty',
          'The 10% problem: you pay for a platform and use a tenth of it, while the one feature you need is missing',
        ],
      },
      {
        h2: 'The math, with real numbers',
        body: [
          'Mid-tier SaaS for a 15-person team commonly runs $100 to $200 per seat monthly: $18,000 to $36,000 a year, forever, for rented software. My seat is $4,000 a month, published on my offer page, and when the build is done you can stop paying and keep everything, because you own the code and accounts.',
          'The honest caveat: custom needs a builder you trust, and dev-shop pricing without a published number is where these projects go wrong. Ask any builder for their price in writing before you start. Mine is already in writing.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is custom software risky for a small business?',
        a: 'The risk is the builder, not the concept. Reduce it with published pricing, a written plan before money moves, short delivery cycles, and ownership of code and accounts from day one. Those four are my standard terms.',
      },
      {
        q: 'Can we mix both?',
        a: 'Most of my builds are mixes: keep QuickBooks and your field platform, add custom glue, dashboards, and the tools they do not make. Replace only what earns replacement.',
      },
      {
        q: 'What should we do first?',
        a: 'List the three most annoying manual processes in your week. That list is better than any requirements document, and it is exactly where a free planning call starts.',
      },
    ],
    related: [
      'custom-software-cost',
      'build-vs-buy-software-checklist',
      'custom-crm-development',
      'lovable-replit-vs-hiring-a-builder',
    ],
  },
  {
    slug: 'custom-software-cost',
    cat: 'decision',
    title: 'How Much Does Custom Software Cost in 2026? | Neil Busque',
    metaDescription:
      'Real 2026 custom software pricing: what agencies charge, what AI changed, and a published price you can actually plan around.',
    eyebrow: 'Software · Pricing',
    h1: 'What custom software **actually costs** in 2026.',
    lede: 'Almost nobody in this industry publishes a price. Here is the real market, with numbers, including mine.',
    sections: [
      {
        h2: 'The market, honestly',
        body: [
          'Traditional agencies quote roughly $10,000 to $250,000 per project across 3 to 9 months, and most will not say a number until you sit through discovery. Fast fixed-price shops cluster between $5,000 and $15,000 per build. AI app builders run free to about $1,000, and work until your app has to talk to the rest of your business.',
          'I checked 30 competitors currently advertising in this market: only 3 publish any price at all. The quote-after-discovery model exists because it prices by your budget, not by the work.',
        ],
      },
      {
        h2: 'What AI actually changed',
        body: [
          'AI writing the first draft of code made the build phase dramatically faster. It did not change the hard parts: understanding your business, connecting real systems, security, and being accountable when something breaks. Pricing should reflect that split: cheaper than the old $50k quotes, more than a prompt subscription.',
        ],
      },
      {
        h2: 'My price, published',
        body: [
          '$4,000 a month for an AI systems builder on your team. First working software in 14 days from an approved plan. Month one refundable if you are not happy. Unlimited requests, one at a time, cancel any month, and you own the code, data, and accounts from day one.',
          'One number, on the page, so you can decide from your desk instead of from a sales call.',
        ],
      },
    ],
    faq: [
      {
        q: 'Why do agencies refuse to publish prices?',
        a: 'Because unpublished pricing can flex to your budget. Discovery calls are partly scoping and partly pricing you. A published number removes that game, which is exactly why so few publish one.',
      },
      {
        q: 'What does $4,000 a month actually buy?',
        a: 'A build queue you control: apps, AI agents, automations, fixes, handled one at a time with a weekly call and daily updates. Most months ship one substantial system or several smaller automations.',
      },
      {
        q: 'What if we only need one thing built?',
        a: 'Hold the seat for a month or two, get the thing built, then cancel and keep everything. That is allowed and normal. Software you own does not stop working when you stop paying me.',
      },
    ],
    related: [
      'custom-software-vs-off-the-shelf',
      'build-vs-buy-software-checklist',
      'custom-crm-development',
      'custom-software-for-roofing-companies',
    ],
  },
  {
    slug: 'ai-phone-agent-vs-answering-service',
    cat: 'decision',
    title: 'AI Phone Agent vs Answering Service: Which Wins? | Neil Busque',
    metaDescription:
      'AI phone agent vs human answering service: cost, quality, and booking rates compared honestly, with the cases where humans still win.',
    eyebrow: 'Software · Decisions',
    h1: 'AI phone agent **vs answering service**.',
    lede: 'Both stop the missed-call bleed. They are not the same tool. Here is the honest comparison, including where the human service still wins.',
    sections: [
      {
        h2: 'What an answering service really does',
        body: [
          'A typical service answers with your greeting, reads a script, and takes a message. Billing is usually per minute or per call, and quality depends on whoever picks up. They do not know your schedule, so they rarely book. You still call the lead back.',
        ],
      },
      {
        h2: 'What a custom AI agent does differently',
        body: [
          'It is built on your business, not a script: it answers questions about your services, applies your qualifying rules, sees your real calendar, and books the appointment during the call. Flat cost, identical quality at 2pm and 2am, and a transcript of every call.',
          'Where humans still win: genuinely sensitive calls, complex negotiations, and businesses whose brand depends on a specific person’s touch. The right design routes those to people immediately.',
        ],
      },
      {
        h2: 'The decision in one line',
        body: [
          'If your calls are mostly "can you help, when, and how much", the AI agent answers better, books more, and costs less at volume. If your calls are mostly counseling, keep humans in the loop and let the AI handle the overflow and the after-hours.',
        ],
      },
    ],
    faq: [
      {
        q: 'What does each option cost?',
        a: 'Answering services commonly run $1 to $2 per minute, which scales with your call volume. A custom agent is part of my flat $4,000 a month seat, handles unlimited calls, and the number stays yours.',
      },
      {
        q: 'Can the AI handle my industry’s specific questions?',
        a: 'It is trained on your services, prices, and policies before it ever answers, and it improves from real transcripts. It also knows what it does not know, and hands those calls to a human with context.',
      },
      {
        q: 'How fast can it be live?',
        a: 'Inside 14 days from an approved plan, on your existing number or a new one. Month one refundable if it does not earn its place.',
      },
    ],
    related: [
      'ai-phone-agent-for-business',
      'ai-phone-agent-for-hvac-companies',
      'ai-phone-agent-for-dental-practices',
      'custom-software-cost',
    ],
  },
  {
    slug: 'lovable-replit-vs-hiring-a-builder',
    cat: 'decision',
    title: 'Lovable & Replit vs Hiring a Builder: After the Wall | Neil Busque',
    metaDescription:
      'You built it with Lovable or Replit and hit the wall: integrations, auth, production. What those tools are for, and when to bring in a builder.',
    eyebrow: 'Software · Decisions',
    h1: 'Lovable and Replit **vs hiring a builder**.',
    lede: 'AI app builders are genuinely good now. I use AI to build every day. Here is where they shine, where they wall, and what to do after the wall.',
    sections: [
      {
        h2: 'What the AI builders are great at',
        body: [
          'Lovable, Replit, and friends are excellent for proving an idea: a working prototype in an afternoon, a real feel for the product, momentum. If you have not tried one, try one before hiring anybody, including me.',
        ],
      },
      {
        h2: 'The wall, specifically',
        body: [
          'The wall is not code generation. It is everything around it:',
        ],
        bullets: [
          'Integrations: talking to your CRM, calendar, accounting, and phone system reliably',
          'Auth and security: real user accounts, permissions, and data that must not leak',
          'Production behavior: what happens at the 500th user, the failed webhook, the 2am error',
          'Maintenance: who fixes it when an API changes next quarter',
        ],
      },
      {
        h2: 'After the wall',
        body: [
          'Two honest options. Learn the production layer yourself: real skills, several months, worth it if software is becoming your business. Or bring in a builder who ships past the wall for a living. I do the second for a flat $4,000 a month, and your prototype is genuinely useful to me: it is the best product spec you could hand anyone.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can you finish an app I started in Lovable or Replit?',
        a: 'Yes, and it happens a lot. Sometimes I keep your code, sometimes rebuilding on production foundations is faster. I tell you which on the first call, with reasons, before you pay.',
      },
      {
        q: 'Was building the prototype myself a waste?',
        a: 'The opposite. You proved the idea and defined the product. That typically saves weeks of back-and-forth and makes the 14-day first build sharper.',
      },
      {
        q: 'What does finishing it cost?',
        a: 'The same published seat: $4,000 a month, first working production version inside 14 days, month one refundable, you own everything. No penalty for having tried it yourself first. The attempt earns respect.',
      },
    ],
    related: [
      'custom-software-cost',
      'custom-software-vs-off-the-shelf',
      'build-vs-buy-software-checklist',
      'workflow-automation-services',
    ],
    guide: { href: '/guides/ship-web-app-in-days-with-ai', label: 'How I ship apps in days with AI' },
  },
  {
    slug: 'build-vs-buy-software-checklist',
    cat: 'decision',
    title: 'Build vs Buy Software: a 10-Question Checklist | Neil Busque',
    metaDescription:
      'A 10-question build vs buy checklist for business software, from a builder who often answers "buy". Score your situation in five minutes.',
    eyebrow: 'Software · Decisions',
    h1: 'Build vs buy: a **10-question checklist**.',
    lede: 'Answer these honestly and the decision usually makes itself. I am a builder, and on plenty of calls the right answer is still "buy the SaaS".',
    sections: [
      {
        h2: 'The checklist',
        body: ['Count your yes answers.'],
        bullets: [
          '1. Does your team keep a spreadsheet alongside the tool to cover its gaps?',
          '2. Are per-seat fees making you hesitate to add people?',
          '3. Do you use less than a quarter of the platform you pay for?',
          '4. Is one process in your business genuinely different from competitors, on purpose?',
          '5. Have you asked the vendor for a feature and waited more than a year?',
          '6. Does data get re-typed between two systems weekly?',
          '7. Would owning your customer data outright matter in a sale or dispute?',
          '8. Is a manual process capping how much work you can take?',
          '9. Has a tool price increase ever forced a migration scramble?',
          '10. Could you describe exactly what you need in one page?',
        ],
      },
      {
        h2: 'Scoring, honestly',
        body: [
          '0 to 2 yes: buy. Your needs are standard, and mature SaaS will serve you well. 3 to 5: hybrid. Keep your platforms, add custom glue and the missing tools. 6 or more: your business has outgrown rented software, and custom is not a luxury, it is the cheaper path over three years.',
        ],
      },
      {
        h2: 'What to do with your score',
        body: [
          'Bring the checklist to a free call. I will tell you which yes answers are worth money and which are livable. If the answer is "stay on the SaaS", you will hear it plainly, and you will have saved yourself a project.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is hybrid a cop-out answer?',
        a: 'It is the most common right answer. Keep QuickBooks and your industry platform; add custom automation, dashboards, and the one tool nobody sells. Most of my monthly seats are hybrid work.',
      },
      {
        q: 'How fast would a build start after deciding?',
        a: 'Free call, written plain-English plan, and the 14-day clock starts on your approval. You see working software before the first month ends, and month one is refundable.',
      },
      {
        q: 'What does building cost?',
        a: '$4,000 a month, published, flat. The full offer with the guarantee stack is on my offer page. No discovery-call pricing games.',
      },
    ],
    related: [
      'custom-software-vs-off-the-shelf',
      'custom-software-cost',
      'lovable-replit-vs-hiring-a-builder',
      'custom-crm-development',
    ],
  },
];

export const softwarePages: SoftwarePage[] = [
  ...industries,
  ...solutions,
  ...softwareCombos,
  ...decisions,
];

export const softwareBySlug = new Map(softwarePages.map((p) => [p.slug, p]));

export const softwareCats: { key: SoftwarePage['cat']; label: string; blurb: string }[] = [
  { key: 'industry', label: 'By industry', blurb: 'Custom software shaped around how your trade actually runs.' },
  { key: 'solution', label: 'By system', blurb: 'CRMs, portals, phone agents, automations: the builds I ship most.' },
  { key: 'combo', label: 'By industry and system', blurb: 'The specific tool for the specific business.' },
  { key: 'decision', label: 'Decisions and pricing', blurb: 'Honest guides for the build-or-buy call, with real numbers.' },
];
