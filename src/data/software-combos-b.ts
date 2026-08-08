/* Combo pages, part B: professional services + wellness. See software-pages.ts for the type. */
import type { SoftwarePage } from './software-pages';

export const combosB: SoftwarePage[] = [
  {
    slug: 'client-portal-for-law-firms',
    cat: 'combo',
    title: 'Client Portal for Law Firms | Neil Busque',
    metaDescription:
      'A secure law firm client portal: case status, documents, and messages in one login, so clients stop calling for updates. $4,000/month.',
    eyebrow: 'Legal · Portal',
    h1: 'A client portal for **law firms**.',
    lede: 'Half of client anxiety is not knowing what is happening. A portal that shows case status and next steps turns update calls into logins.',
    sections: [
      {
        h2: 'The "any update on my case?" call',
        body: [
          'Clients do not call because they are difficult. They call because silence is frightening when something important is at stake. Each call interrupts billable work, and the answer is usually one sentence a portal could have shown.',
        ],
      },
      {
        h2: 'What your firm portal would include',
        body: [],
        bullets: [
          'Case status in plain English with the next step always visible',
          'Secure document exchange with confirmations, not email attachments',
          'Messages that stay attached to the matter record',
          'Invoices and trust balances where clients expect them',
          'Intake and e-signature flows for new engagements',
        ],
      },
      {
        h2: 'Confidentiality as a design rule',
        body: [
          'Everything runs encrypted in accounts the firm owns, with client access scoped to their own matter and nothing else. I walk your managing partner through exactly where every document lives before launch.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does it integrate with Clio or MyCase?',
        a: 'Clio has a solid API and integration usually works well: matters and documents sync so the portal reflects reality without double entry. Other platforms vary, and I confirm your exact path on the free call.',
      },
      {
        q: 'What does it cost?',
        a: 'Part of the flat $4,000 a month seat. A first portal ships inside 14 days, month one is refundable, and the firm owns the code and every account.',
      },
    ],
    related: [
      'custom-software-for-law-firms',
      'client-portal-development',
      'workflow-automation-for-law-firms',
      'client-portal-for-accounting-firms',
    ],
  },
  {
    slug: 'workflow-automation-for-law-firms',
    cat: 'combo',
    title: 'Workflow Automation for Law Firms | Neil Busque',
    metaDescription:
      'Law firm automation: intake that runs itself, deadline tracking, document assembly, and follow-ups that never lapse. $4,000/month.',
    eyebrow: 'Legal · Automation',
    h1: 'Workflow automation for **law firms**.',
    lede: 'Unbillable admin eats firm margin quietly: intake, chasing signatures, assembling the same documents. Software should be doing most of it.',
    sections: [
      {
        h2: 'The unbillable hours audit',
        body: [
          'Track a week honestly and the pattern shows: hours on intake forms, engagement letters, status chasing, and document assembly. None of it needs a law degree, and most of it does not need a person.',
        ],
      },
      {
        h2: 'Automations I build for firms',
        body: [],
        bullets: [
          'Intake pipelines: inquiry, conflict-check prompt, engagement letter, signed and filed',
          'Document assembly from matter data: retainers, standard motions, letters',
          'Deadline and statute watchers with escalating alerts',
          'Client follow-up sequences that stay professional and never lapse',
          'Billing prep: time summaries assembled before invoicing day',
        ],
      },
      {
        h2: 'Judgment stays with the lawyer',
        body: [
          'Automation drafts and routes; attorneys approve anything that leaves the building. That line is designed in from the start, and every workflow is documented so the firm is never dependent on a mystery box.',
        ],
      },
    ],
    faq: [
      {
        q: 'What should a firm automate first?',
        a: 'Intake, almost always: it touches revenue, happens daily, and has clear rules. A firm typically sees the first automated intake flow live inside 14 days.',
      },
      {
        q: 'Is our client data safe in these workflows?',
        a: 'Workflows run in accounts the firm owns with minimal data movement, and nothing trains outside models. You can revoke my access at any time and everything keeps running.',
      },
    ],
    related: [
      'custom-software-for-law-firms',
      'workflow-automation-services',
      'ai-email-assistant-for-law-firms',
      'workflow-automation-for-accounting-firms',
    ],
  },
  {
    slug: 'ai-email-assistant-for-law-firms',
    cat: 'combo',
    title: 'AI Email Assistant for Law Firms | Neil Busque',
    metaDescription:
      'An AI email assistant for law firms: triage the inbox, draft routine replies for attorney review, and surface what matters. $4,000/month.',
    eyebrow: 'Legal · AI Email',
    h1: 'An AI email assistant for **law firms**.',
    lede: 'An attorney inbox mixes urgent court notices with newsletters and scheduling ping-pong. The assistant sorts it and drafts the routine, for review.',
    sections: [
      {
        h2: 'The inbox is a liability surface',
        body: [
          'A missed email in a law firm is not an inconvenience; it can be malpractice exposure. Triage cannot depend on whoever had time to scan the inbox between hearings.',
        ],
      },
      {
        h2: 'What your firm assistant would do',
        body: [],
        bullets: [
          'Triage by matter and urgency: court, client, opposing counsel, noise',
          'Draft routine replies in the attorney’s voice for one-click review',
          'Flag deadline-bearing language so nothing slips into tomorrow',
          'Surface threads that went quiet and should not have',
          'Produce a morning brief per attorney: what needs a decision today',
        ],
      },
      {
        h2: 'Draft-only by design',
        body: [
          'Nothing sends without attorney approval, full stop. The assistant runs inside the firm’s own workspace accounts, confidentiality intact, access revocable. The speed comes from drafting, not from removing judgment.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it understand legal context in emails?',
        a: 'It is tuned on your practice areas and your sent mail, so drafts sound like the attorney and flag what your matters care about. Attorneys still review everything; the win is starting from a good draft instead of a blank screen.',
      },
      {
        q: 'What does it cost?',
        a: 'Part of the $4,000 a month seat, commonly paired with intake automation in the same month. First version inside 14 days, month one refundable.',
      },
    ],
    related: [
      'custom-software-for-law-firms',
      'ai-email-assistant-for-business',
      'workflow-automation-for-law-firms',
      'client-portal-for-law-firms',
    ],
  },
  {
    slug: 'custom-crm-for-real-estate-teams',
    cat: 'combo',
    title: 'Custom CRM for Real Estate Teams | Neil Busque',
    metaDescription:
      'A custom real estate CRM: speed-to-lead routing, long-term nurture, and transaction tracking without per-agent fees. $4,000/month.',
    eyebrow: 'Real Estate · CRM',
    h1: 'A custom CRM for **real estate teams**.',
    lede: 'Per-agent seat fees punish growth, and rigid pipelines ignore how your team actually converts. A custom CRM fixes both, permanently.',
    sections: [
      {
        h2: 'The seat-fee math on a 15-agent team',
        body: [
          'Mainstream real estate CRMs price per agent per month. Across a growing team that becomes a five-figure annual tax on headcount. A custom CRM costs the same whether you run 5 agents or 50, because you own it.',
        ],
      },
      {
        h2: 'What your team CRM would include',
        body: [],
        bullets: [
          'Instant lead routing with AI first-touch in seconds, not hours',
          'Pipelines for buyers, sellers, and investors, modeled separately',
          'The 12-month nurture your database deserves, running automatically',
          'Transaction tracking from contract to close with deadline alerts',
          'Agent scoreboards and source-level ROI reporting for the team lead',
        ],
      },
      {
        h2: 'Your database stays yours',
        body: [
          'Years of contacts and conversation history should not be hostage to a platform export limit. Everything lives in accounts your team owns, fully exportable, forever. That alone changes the switching math.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it take leads from Zillow and our website instantly?',
        a: 'Yes: portal leads, sign calls, and site forms route in seconds, with an honest AI first-touch and the assigned agent notified with context. Speed to lead is the entire design brief.',
      },
      {
        q: 'What does it cost versus per-agent platforms?',
        a: '$4,000 a month flat while I build and improve it, no per-agent fees ever. Cross-check that against your current per-seat bill times your growth plan.',
      },
    ],
    related: [
      'custom-software-for-real-estate-teams',
      'custom-crm-development',
      'workflow-automation-for-real-estate',
      'ai-phone-agent-for-real-estate',
    ],
  },
  {
    slug: 'workflow-automation-for-real-estate',
    cat: 'combo',
    title: 'Workflow Automation for Real Estate Teams | Neil Busque',
    metaDescription:
      'Real estate automation: instant lead follow-up, transaction checklists, and past-client nurture that runs itself. $4,000/month.',
    eyebrow: 'Real Estate · Automation',
    h1: 'Workflow automation for **real estate teams**.',
    lede: 'Deals die in the gaps: the lead nobody texted back, the deadline nobody tracked, the past client nobody called. Automation closes the gaps.',
    sections: [
      {
        h2: 'Follow-up is a system, not a virtue',
        body: [
          'Telling agents to follow up harder has never once worked. Building the system that follows up for them works immediately, and the best agents love it most because it feeds them warmer conversations.',
        ],
      },
      {
        h2: 'Automations I build for teams',
        body: [],
        bullets: [
          'Instant new-lead sequences: text, email, and agent alert in seconds',
          'Transaction checklists that chase documents and deadlines themselves',
          'Past-client programs: anniversaries, market updates, referral asks',
          'Open-house follow-up that starts before the signs come down',
          'Listing coordination: photos, staging, MLS tasks on rails',
        ],
      },
      {
        h2: 'Works with your existing stack',
        body: [
          'Follow Up Boss, kvCORE, or the custom CRM I build you: automations glue whatever you run to your calendar, phones, and inbox. Each workflow is documented and owned by the team, not rented.',
        ],
      },
    ],
    faq: [
      {
        q: 'Will automated follow-up feel robotic to leads?',
        a: 'Not if it is written like your team and honest about being fast. Speed reads as service, and the handoff to a human happens the moment the lead engages.',
      },
      {
        q: 'What should a team automate first?',
        a: 'Speed-to-lead, always: it has the clearest revenue math and ships inside the first 14 days. Transaction checklists usually come second.',
      },
    ],
    related: [
      'custom-software-for-real-estate-teams',
      'workflow-automation-services',
      'custom-crm-for-real-estate-teams',
      'workflow-automation-for-small-business',
    ],
  },
  {
    slug: 'ai-phone-agent-for-real-estate',
    cat: 'combo',
    title: 'AI Phone Agent for Real Estate Teams | Neil Busque',
    metaDescription:
      'An AI phone agent for real estate: answers sign calls and portal leads, qualifies buyers, and books showings around the clock. $4,000/month.',
    eyebrow: 'Real Estate · AI Phone',
    h1: 'An AI phone agent for **real estate teams**.',
    lede: 'Sign calls come at dinner time and portal leads call once. The agent answers every time, qualifies politely, and books the showing.',
    sections: [
      {
        h2: 'The sign call is a hot lead with no patience',
        body: [
          'Someone standing in front of the listing calling the number on the sign is as warm as leads get, and they will not leave a voicemail. Whoever answers wins the conversation, and often the buyer.',
        ],
      },
      {
        h2: 'What your real estate agent line would do',
        body: [],
        bullets: [
          'Answer sign calls with listing details: price, beds, showings available',
          'Qualify gently: timeline, financing, agent status, without interrogating',
          'Book showings into the right agent’s calendar by listing and territory',
          'Catch after-hours portal leads with instant callback handling',
          'Log every conversation to your CRM with a summary',
        ],
      },
      {
        h2: 'Honest and licensed-friendly',
        body: [
          'The agent identifies itself, sticks to listing facts, and routes anything requiring a licensed conversation to a human fast. It exists to stop missed calls, not to practice real estate.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it answer questions about specific listings?',
        a: 'Yes, from your live listing data: price, features, showing windows, open-house times. New listings are available to it the moment your feed updates.',
      },
      {
        q: 'What does it cost?',
        a: 'Part of the $4,000 a month seat, live inside 14 days, month one refundable. One saved buyer conversation tends to settle the ROI debate for the year.',
      },
    ],
    related: [
      'custom-software-for-real-estate-teams',
      'ai-phone-agent-for-business',
      'custom-crm-for-real-estate-teams',
      'ai-phone-agent-vs-answering-service',
    ],
  },
  {
    slug: 'client-portal-for-property-management',
    cat: 'combo',
    title: 'Tenant & Owner Portal for Property Management | Neil Busque',
    metaDescription:
      'Custom portals for property managers: tenants self-serve maintenance and payments, owners see real numbers. Fewer calls all around. $4,000/month.',
    eyebrow: 'Property · Portal',
    h1: 'Tenant and owner portals for **property managers**.',
    lede: 'Tenants call about rent and repairs. Owners call about money. Two portals, one build, and your phone gets quiet.',
    sections: [
      {
        h2: 'Two audiences, two portals',
        body: [
          'Tenants and owners want completely different things, and mixing them in one clunky interface serves neither. A tenant portal kills routine calls; an owner portal builds the trust that keeps doors under management.',
        ],
      },
      {
        h2: 'What the portals would include',
        body: [],
        bullets: [
          'Tenants: maintenance requests with photos, rent status, documents, announcements',
          'Owners: occupancy, income, expenses, and statements without a phone call',
          'Maintenance tracking visible to the tenant, closing the "any update" loop',
          'Lease renewals and e-signatures handled in-portal',
          'Your branding throughout, on your domain',
        ],
      },
      {
        h2: 'Alongside AppFolio or Buildium',
        body: [
          'Your management platform stays the accounting spine. The portals read from it where APIs allow and present a calmer, branded face your tenants and owners actually enjoy using. You own every piece I add.',
        ],
      },
    ],
    faq: [
      {
        q: 'Why not just use AppFolio’s built-in portal?',
        a: 'If it satisfies your tenants and owners, use it. Custom wins when owners want reporting the platform does not offer, or your brand deserves better than a generic portal login page.',
      },
      {
        q: 'How fast can portals ship?',
        a: 'The tenant portal first, inside 14 days from an approved plan; the owner portal typically the following cycle. Month one refundable, everything in your accounts.',
      },
    ],
    related: [
      'custom-software-for-property-management',
      'client-portal-development',
      'ai-phone-agent-for-property-management',
      'client-portal-for-construction-companies',
    ],
  },
  {
    slug: 'ai-phone-agent-for-property-management',
    cat: 'combo',
    title: 'AI Phone Agent for Property Management | Neil Busque',
    metaDescription:
      'An AI phone agent for property managers: maintenance triage at 2am, rent questions answered, emergencies routed correctly. $4,000/month.',
    eyebrow: 'Property · AI Phone',
    h1: 'An AI phone agent for **property management**.',
    lede: 'The 7pm maintenance call decides whether your evening exists. The agent answers it, triages it, and wakes a human only when the rules say so.',
    sections: [
      {
        h2: 'After-hours calls are the burnout engine',
        body: [
          'Property management phones never stop, and most calls are routine: rent questions, lockouts, a dripping faucet. The occasional real emergency hides among them, so someone always has to answer. That someone should be software.',
        ],
      },
      {
        h2: 'What your property line would do',
        body: [],
        bullets: [
          'Answer every tenant call around the clock',
          'Triage maintenance by your rules: flood now, faucet tomorrow',
          'Create tickets with photos requested by text automatically',
          'Answer rent, lease, and policy questions from your playbook',
          'Wake the on-call tech only for true emergencies, with a summary',
        ],
      },
      {
        h2: 'Fewer 2am wake-ups, documented everything',
        body: [
          'Every call leaves a transcript attached to the unit and ticket, so morning standup starts with facts. Your on-call rotation stops being a lifestyle penalty, and tenants get answered faster than a human team could manage.',
        ],
      },
    ],
    faq: [
      {
        q: 'How does it know what counts as an emergency?',
        a: 'You define the matrix once: water where it should not be, no heat in winter, lockouts, gas smell. The agent applies it identically at 2pm and 2am, which is more than tired humans manage.',
      },
      {
        q: 'What does it cost per door?',
        a: 'Nothing per door: $4,000 a month flat, whatever your portfolio size. First version inside 14 days, month one refundable.',
      },
    ],
    related: [
      'custom-software-for-property-management',
      'ai-phone-agent-for-business',
      'client-portal-for-property-management',
      'workflow-automation-for-property-management',
    ],
  },
  {
    slug: 'workflow-automation-for-property-management',
    cat: 'combo',
    title: 'Workflow Automation for Property Management | Neil Busque',
    metaDescription:
      'Property management automation: turnovers on rails, delinquency follow-up, renewals, and owner statements that assemble themselves. $4,000/month.',
    eyebrow: 'Property · Automation',
    h1: 'Workflow automation for **property management**.',
    lede: 'Every door adds the same recurring chores. Automate the chores and doors stop costing headcount.',
    sections: [
      {
        h2: 'The per-door chore list',
        body: [
          'Turnovers, renewals, delinquency notices, owner statements, vendor chasing: the list repeats per door, per month, forever. It is the most automatable workload in small business, and mostly still done by hand.',
        ],
      },
      {
        h2: 'Automations I build for property managers',
        body: [],
        bullets: [
          'Turnover pipelines: notice received, checklist spawned, vendors scheduled, deposit math prepared',
          'Renewal sequences starting 90 days out with your pricing rules',
          'Delinquency follow-up that stays polite, consistent, and documented',
          'Owner statements assembled and sent on schedule',
          'Vendor dispatch and follow-up with photos required to close tickets',
        ],
      },
      {
        h2: 'Consistency is the product',
        body: [
          'Owners leave managers over dropped balls, not fees. Automation makes your operation identically reliable at 80 doors and 800, and every workflow is documented in accounts you own.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it work with our AppFolio data?',
        a: 'AppFolio and Buildium expose enough through APIs and reports to drive most of these workflows. I verify your exact version and plan on the free call, before any commitment.',
      },
      {
        q: 'What is the first automation worth doing?',
        a: 'Turnovers, usually: the most moving parts, the most dropped balls, and the fastest visible payoff. First workflow live inside 14 days.',
      },
    ],
    related: [
      'custom-software-for-property-management',
      'workflow-automation-services',
      'client-portal-for-property-management',
      'workflow-automation-for-real-estate',
    ],
  },
  {
    slug: 'client-portal-for-accounting-firms',
    cat: 'combo',
    title: 'Client Portal for Accounting Firms | Neil Busque',
    metaDescription:
      'A secure client portal for accounting firms: document collection that chases itself, e-signatures, and status clients can see. $4,000/month.',
    eyebrow: 'Accounting · Portal',
    h1: 'A client portal for **accounting firms**.',
    lede: 'Tax season is a document-collection problem wearing a deadline. A portal that chases files politely and relentlessly changes the season.',
    sections: [
      {
        h2: 'Email attachments are the enemy',
        body: [
          'Documents arrive by email, text, and shoebox. Staff spend mornings figuring out who still owes what. Clients, meanwhile, cannot tell if their return started. Everyone is anxious; nobody has a list.',
        ],
      },
      {
        h2: 'What your firm portal would include',
        body: [],
        bullets: [
          'Per-client document checklists that show exactly what is missing',
          'Automated reminders that escalate politely until the file arrives',
          'Secure upload with confirmations, replacing email attachments',
          'Return and engagement status clients can check themselves',
          'E-signatures on organizers, 8879s, and engagement letters',
        ],
      },
      {
        h2: 'Season-proof, and yours',
        body: [
          'The portal runs encrypted in accounts the firm owns. Hold the seat through busy season for changes and support, then pause if you like: the portal keeps working because you own it.',
        ],
      },
    ],
    faq: [
      {
        q: 'Will older clients actually upload documents?',
        a: 'The upload flow is deliberately dead simple: click the email link, phone camera, done. Firms are usually surprised by which clients adopt it first. Holdouts can still hand you paper; the checklist tracks them too.',
      },
      {
        q: 'What does it cost against staff hours?',
        a: '$4,000 a month flat. Set that against the staff hours currently spent chasing documents in March and the math tends to end the meeting.',
      },
    ],
    related: [
      'custom-software-for-accounting-firms',
      'client-portal-development',
      'workflow-automation-for-accounting-firms',
      'client-portal-for-law-firms',
    ],
  },
  {
    slug: 'workflow-automation-for-accounting-firms',
    cat: 'combo',
    title: 'Workflow Automation for Accounting Firms | Neil Busque',
    metaDescription:
      'Accounting firm automation: deadline tracking, client onboarding, document chasing, and recurring work on rails. $4,000/month.',
    eyebrow: 'Accounting · Automation',
    h1: 'Workflow automation for **accounting firms**.',
    lede: 'Firms sell accuracy under deadline, then track both in heads and spreadsheets. I put the recurring work on rails.',
    sections: [
      {
        h2: 'Recurring work should run itself',
        body: [
          'Monthly closes, quarterly filings, annual returns: the firm calendar is the most predictable in professional services, which makes it the most automatable. The chaos comes from tracking it manually across dozens of clients.',
        ],
      },
      {
        h2: 'Automations I build for firms',
        body: [],
        bullets: [
          'Deadline dashboards across every client, filing type, and extension',
          'Client onboarding: engagement letter, checklist, portal access, kickoff, automatic',
          'Document chasing tied to each engagement’s actual missing list',
          'Recurring task generation for closes and filings with assignment rules',
          'AI email triage drafting routine client replies for review',
        ],
      },
      {
        h2: 'Fits Karbon, Canopy, or spreadsheets',
        body: [
          'If you run a practice platform, automations extend it. If you run spreadsheets, we can automate around them first and replace them only when it clearly pays. Nothing gets ripped out for its own sake.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can automation handle extensions and shifting deadlines?',
        a: 'Yes: extension filed, downstream dates shift, reminders reschedule, the dashboard updates. The rules are your rules, encoded once instead of remembered monthly.',
      },
      {
        q: 'When should a firm start this, given busy season?',
        a: 'Off-season is ideal, but the 14-day first build means even a January start can ship the document chaser before the crunch peaks. Month one is refundable either way.',
      },
    ],
    related: [
      'custom-software-for-accounting-firms',
      'workflow-automation-services',
      'client-portal-for-accounting-firms',
      'workflow-automation-for-law-firms',
    ],
  },
  {
    slug: 'booking-software-for-med-spas',
    cat: 'combo',
    title: 'Booking Software for Med Spas | Neil Busque',
    metaDescription:
      'Med spa booking built for providers, rooms, and devices: deposits, consult flows, and no-show reduction. No per-booking fees. $4,000/month.',
    eyebrow: 'Med Spa · Booking',
    h1: 'Booking software for **med spas**.',
    lede: 'A med spa books against providers, rooms, and devices at once. Generic schedulers juggle one of the three, and your front desk pays for it.',
    sections: [
      {
        h2: 'Three constraints, one calendar',
        body: [
          'An injector, a treatment room, and the laser all have to be free at the same moment. Book any two without the third and the day unravels. This is exactly the constraint logic generic tools skip.',
        ],
      },
      {
        h2: 'What your spa booking would include',
        body: [],
        bullets: [
          'Availability computed across provider, room, and device together',
          'Consult-first flows for treatments that require them',
          'Deposits at booking with your cancellation policy enforced',
          'Reminder and prep sequences: what to avoid, what to bring',
          'Package and membership sessions booked against remaining credits',
        ],
      },
      {
        h2: 'Against Mindbody and Boulevard',
        body: [
          'Both are capable platforms. Custom wins when their model does not match your rooms-and-devices reality, when per-location pricing bites, or when you want the booking experience on your own domain looking like your brand, not theirs.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it require consults before certain treatments?',
        a: 'Yes: treatments carry rules, and a first-time client requesting one gets routed to the consult flow automatically. Your clinical policies become software instead of front-desk memory.',
      },
      {
        q: 'What does it cost?',
        a: 'Part of the $4,000 a month seat, no per-booking fees. First version inside 14 days, month one refundable, all accounts yours.',
      },
    ],
    related: [
      'custom-software-for-med-spas',
      'booking-and-scheduling-software',
      'ai-phone-agent-for-med-spas',
      'booking-software-for-dental-practices',
    ],
  },
  {
    slug: 'ai-phone-agent-for-med-spas',
    cat: 'combo',
    title: 'AI Phone Agent for Med Spas | Neil Busque',
    metaDescription:
      'An AI phone agent for med spas: answers during treatments, books consults, handles pricing questions with care. $4,000/month.',
    eyebrow: 'Med Spa · AI Phone',
    h1: 'An AI phone agent for **med spas**.',
    lede: 'When your team is in a treatment, the phone rings unanswered. That caller books with whichever spa picks up. Yours should always pick up.',
    sections: [
      {
        h2: 'Treatments mean missed calls by design',
        body: [
          'A med spa’s staff cannot answer mid-treatment, and consult inquiries are the highest-value calls you get. The overflow problem is structural, so the answer has to be too.',
        ],
      },
      {
        h2: 'What your spa agent would do',
        body: [],
        bullets: [
          'Answer every call during treatments and after hours',
          'Book consults with the right intake questions per treatment',
          'Handle pricing conversations by your rules: ranges, consult-first, or exact',
          'Manage reschedules against your real availability',
          'Escalate clinical questions to your team, never guessing',
        ],
      },
      {
        h2: 'On-brand and careful',
        body: [
          'The agent speaks in your tone, identifies itself honestly, and treats treatment questions with clinical caution: information about scheduling, escalation for anything medical. Transcripts stay in accounts you own.',
        ],
      },
    ],
    faq: [
      {
        q: 'How does it discuss treatment pricing?',
        a: 'However you decide: exact prices, ranges with a consult push, or consult-only for premium treatments. The policy is yours; the agent just applies it consistently.',
      },
      {
        q: 'What does it cost against one consult?',
        a: 'The seat is $4,000 a month flat. With consult values where they are in aesthetics, a few saved calls a month typically carries it, and the after-hours coverage is free on top.',
      },
    ],
    related: [
      'custom-software-for-med-spas',
      'ai-phone-agent-for-business',
      'booking-software-for-med-spas',
      'ai-phone-agent-for-medical-offices',
    ],
  },
  {
    slug: 'booking-software-for-gyms',
    cat: 'combo',
    title: 'Class Booking Software for Gyms & Studios | Neil Busque',
    metaDescription:
      'Custom class booking for gyms and studios: waitlists that fill themselves, membership rules, and no-show handling. $4,000/month.',
    eyebrow: 'Fitness · Booking',
    h1: 'Class booking for **gyms and studios**.',
    lede: 'Empty bikes in a "full" class are pure lost revenue. Waitlists that fill themselves and no-show rules with teeth fix it quietly.',
    sections: [
      {
        h2: 'The full-class-empty-room problem',
        body: [
          'Members book, do not show, and the waitlist never hears about it. Multiply by every class and you are running at a discount you never chose to offer.',
        ],
      },
      {
        h2: 'What your booking system would include',
        body: [],
        bullets: [
          'Class schedules with capacity, instructor, and room logic',
          'Waitlists that auto-fill cancellations and notify instantly',
          'Late-cancel and no-show policies enforced automatically',
          'Membership tiers controlling booking windows and class access',
          'Instructor views: roster, first-timers flagged, notes',
        ],
      },
      {
        h2: 'Your brand, no per-member fees',
        body: [
          'Booking runs on your domain in your app-like portal, not a marketplace app that upsells your members someone else’s classes. Flat $4,000 a month while you hold the seat, no per-member or per-booking fees, and you own it.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it enforce our late-cancel policy?',
        a: 'Yes, automatically and politely: your window, your fee or credit rule, applied every time. Front desk stops being the bad guy, the policy just works.',
      },
      {
        q: 'Does it replace Mindbody for us?',
        a: 'For class booking and member experience, often yes. If Mindbody stays for billing, the systems sync. The call determines the cheapest sane path; sometimes that answer is keep more of what you have.',
      },
    ],
    related: [
      'custom-software-for-gyms',
      'booking-and-scheduling-software',
      'client-portal-for-gyms',
      'booking-software-for-med-spas',
    ],
  },
  {
    slug: 'client-portal-for-gyms',
    cat: 'combo',
    title: 'Member Portal for Gyms & Studios | Neil Busque',
    metaDescription:
      'A custom member portal for gyms: schedule, milestones, referrals, and account self-service in your brand. $4,000/month.',
    eyebrow: 'Fitness · Portal',
    h1: 'A member portal for **gyms and studios**.',
    lede: 'Members who feel progress stay. A portal that shows their streaks, milestones, and next class makes progress visible every week.',
    sections: [
      {
        h2: 'Retention lives in the member experience',
        body: [
          'People quit gyms they feel anonymous in. A branded portal that greets them with their own numbers, their booked classes, and their next milestone is the cheapest retention tool you can own.',
        ],
      },
      {
        h2: 'What your member portal would include',
        body: [],
        bullets: [
          'Class booking and schedule in one clean, branded home',
          'Attendance streaks and milestone celebrations that feel earned',
          'Referral flows with rewards tracked automatically',
          'Account self-service: freeze, upgrade, payment method, no front-desk queue',
          'Announcements and challenges members actually see',
        ],
      },
      {
        h2: 'Built like a product, because it is one',
        body: [
          'I build consumer-grade apps for a living, including habit and streak products of my own, and that experience goes into the portal. Your members get software that feels like a brand-name app, wearing your logo.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is it an app members install?',
        a: 'It is a progressive web app: opens from their home screen like an app, no app-store approval cycle, updates instantly. For a gym portal that is the sweet spot of experience and cost.',
      },
      {
        q: 'What does it cost?',
        a: 'Part of the $4,000 a month seat, first version inside 14 days, month one refundable. No per-member fees at any size.',
      },
    ],
    related: [
      'custom-software-for-gyms',
      'client-portal-development',
      'booking-software-for-gyms',
      'workflow-automation-for-small-business',
    ],
  },
  {
    slug: 'workflow-automation-for-small-business',
    cat: 'combo',
    title: 'Workflow Automation for Small Business | Neil Busque',
    metaDescription:
      'Small business workflow automation: connect your tools, kill weekly copy-paste, and get the busywork off your team. $4,000/month.',
    eyebrow: 'Small Business · Automation',
    h1: 'Workflow automation for **small businesses**.',
    lede: 'You do not need enterprise software. You need the eleven tools you already pay for to finally talk to each other.',
    sections: [
      {
        h2: 'The invisible full-time job',
        body: [
          'Add up the re-typing, the chasing, the weekly report assembly across your team and it usually totals a full-time role nobody hired for. That role is the first thing I automate.',
        ],
      },
      {
        h2: 'The greatest hits for small teams',
        body: [],
        bullets: [
          'Leads flowing from forms and calls into one CRM automatically',
          'Invoices generated and chased without anyone remembering',
          'The weekly numbers assembling themselves into one email',
          'Review requests going out after every completed job',
          'Files, contracts, and onboarding checklists created from templates on trigger',
        ],
      },
      {
        h2: 'Start with the worst chore',
        body: [
          'On the free call we find the chore your team hates most and automate it first, inside 14 days. Momentum beats master plans. Month one refundable, $4,000 flat, every workflow documented and owned by you.',
        ],
      },
    ],
    faq: [
      {
        q: 'Our tools are a mess. Is that a problem?',
        a: 'A messy stack is the normal starting point, and automation is often cheaper than the great tool migration you have been dreading. We connect what you have first and only replace what truly earns replacement.',
      },
      {
        q: 'What does it cost?',
        a: '$4,000 a month, several automations per typical month, cancel any month and keep everything running. The full offer with guarantees is on my offer page.',
      },
    ],
    related: [
      'workflow-automation-services',
      'custom-software-vs-off-the-shelf',
      'custom-dashboards-and-reporting',
      'ai-email-assistant-for-business',
    ],
  },
];
