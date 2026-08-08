/* Combo pages, part A: trades + clinical. See software-pages.ts for the type. */
import type { SoftwarePage } from './software-pages';

export const combosA: SoftwarePage[] = [
  {
    slug: 'custom-crm-for-roofing-companies',
    cat: 'combo',
    title: 'Custom CRM for Roofing Companies | Neil Busque',
    metaDescription:
      'A custom roofing CRM shaped to your pipeline: lead to inspection to build to final invoice. No per-user fees. $4,000/month, live in 14 days.',
    eyebrow: 'Roofing · CRM',
    h1: 'A custom CRM for **roofing companies**.',
    lede: 'Storm leads, canvass leads, referrals, adjuster meetings, supplements: roofing sales is its own animal. Your CRM should be shaped like it.',
    sections: [
      {
        h2: 'Why generic CRMs feel wrong for roofing',
        body: [
          'A roofing deal is not "lead, qualified, closed". It is inspection, photos, estimate, insurance back-and-forth, supplement, build date, final payment, warranty. Forcing that into generic stages is why your team keeps a side spreadsheet.',
        ],
      },
      {
        h2: 'What your roofing CRM would include',
        body: [],
        bullets: [
          'Your real pipeline, including insurance stages and supplements where you work them',
          'Photo and document capture tied to the job, from the roof, on a phone',
          'Automatic homeowner updates so your office stops narrating every job',
          'Commission math the way you actually pay: splits, overrides, redlines',
          'Storm-date and neighborhood tagging for canvass follow-up rounds',
        ],
      },
      {
        h2: 'Against AccuLynx and Roofr',
        body: [
          'AccuLynx and Roofr are real platforms with material integrations custom will not match on day one. Custom wins on fit and on math: your commission logic, your reports, no per-user fees, and you own the system. Plenty of roofers run a platform for materials and my build for everything else.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can you migrate our data from AccuLynx or JobNimbus?',
        a: 'Yes. Contacts, jobs, notes, and documents come over through export or API, cleaned on the way. The old system stays live until your team trusts the new one.',
      },
      {
        q: 'What does a roofing CRM cost?',
        a: '$4,000 a month on my seat, first working version in 14 days, month one refundable. No per-user fees at any crew size, and you own the code and data outright.',
      },
    ],
    related: [
      'custom-software-for-roofing-companies',
      'custom-crm-development',
      'ai-phone-agent-for-roofing-companies',
      'quoting-software-for-roofing-companies',
    ],
  },
  {
    slug: 'ai-phone-agent-for-roofing-companies',
    cat: 'combo',
    title: 'AI Phone Agent for Roofing Companies | Neil Busque',
    metaDescription:
      'An AI phone agent for roofers: answers storm-season call floods, qualifies homeowners, and books inspections. Built for your company. $4,000/month.',
    eyebrow: 'Roofing · AI Phone',
    h1: 'An AI phone agent for **roofing companies**.',
    lede: 'After a hail storm your phone rings more in a day than in a normal month. The AI agent answers all of it, and books the inspections.',
    sections: [
      {
        h2: 'Storm season breaks phone coverage',
        body: [
          'You cannot staff for the storm spike, and every unanswered homeowner calls the next roofer on the list. This is the exact problem software absorbs better than hiring.',
        ],
      },
      {
        h2: 'What your roofing agent would do',
        body: [],
        bullets: [
          'Answer every call, storm flood included, with zero hold time',
          'Ask your qualifying questions: address, roof age, insurance claim status, damage seen',
          'Book the inspection straight into your team calendar by territory',
          'Flag emergencies like active leaks to your on-call line immediately',
          'Log every call with a transcript so the office starts informed',
        ],
      },
      {
        h2: 'Built on a real roofing deployment',
        body: [
          'I built an AI voice agent for a commercial roofing contractor that answers and captures calls their office used to chase. This is not a demo category for me. It is shipped work.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it tell an emergency leak from a sales call?',
        a: 'Yes. It triages by your rules: active leak gets your on-call number with a live summary, storm inquiry gets an inspection slot, vendor calls get politely handled. You write the rules once.',
      },
      {
        q: 'How fast can it be answering our line?',
        a: 'Inside 14 days from plan approval, on your existing number or a new one you own. Month one refundable if it does not earn its place.',
      },
    ],
    related: [
      'custom-software-for-roofing-companies',
      'ai-phone-agent-for-business',
      'custom-crm-for-roofing-companies',
      'ai-phone-agent-vs-answering-service',
    ],
  },
  {
    slug: 'quoting-software-for-roofing-companies',
    cat: 'combo',
    title: 'Quoting Software for Roofing Companies | Neil Busque',
    metaDescription:
      'Custom roofing quoting software: consistent pricing from measurements to margin, branded proposals in minutes. $4,000/month.',
    eyebrow: 'Roofing · Quoting',
    h1: 'Quoting software for **roofing companies**.',
    lede: 'Same roof, two estimators, two prices: that gap is your margin. I build quoting tools that price like your best estimator every time.',
    sections: [
      {
        h2: 'The estimate is the business',
        body: [
          'Roofing wins on fast, credible quotes. If pricing lives in one veteran’s head, every quote he does not touch is a coin flip, and he cannot touch them all.',
        ],
      },
      {
        h2: 'What your quoting tool would include',
        body: [],
        bullets: [
          'Guided quote flow from measurements to materials to labor to margin',
          'Your price book, maintained in one place, not in six spreadsheets',
          'Branded proposals with good, better, best options homeowners understand',
          'E-signature and deposit collection on acceptance',
          'Quiet-quote follow-ups that go out automatically',
        ],
      },
      {
        h2: 'Priced flat, like everything I build',
        body: [
          '$4,000 a month, first version in 14 days, month one refundable. It usually pays for itself in the first week of faster, tighter quotes. You own the tool and the price book forever.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it work from EagleView or drone measurements?',
        a: 'Yes. Measurements come in from your existing source, and the tool prices from them using your cost model. No re-typing between systems.',
      },
      {
        q: 'Does it handle insurance and supplement pricing?',
        a: 'If supplements are part of your business, that logic gets built in: line-item mapping, versioned quotes, and a paper trail that holds up with adjusters.',
      },
    ],
    related: [
      'custom-software-for-roofing-companies',
      'quoting-and-invoicing-software',
      'custom-crm-for-roofing-companies',
      'quoting-software-for-hvac-companies',
    ],
  },
  {
    slug: 'project-tracking-software-for-construction',
    cat: 'combo',
    title: 'Project Tracking Software for Construction | Neil Busque',
    metaDescription:
      'Custom construction project tracking: phases, draws, retainage, and AIA-style billing without the spreadsheet fear. $4,000/month.',
    eyebrow: 'Construction · Projects',
    h1: 'Project tracking built for **construction companies**.',
    lede: 'Your master spreadsheet knows every job, draw, and retainage number. It is also one bad paste away from chaos. I turn it into software.',
    sections: [
      {
        h2: 'The billing logic is the hard part',
        body: [
          'Construction tracking is not a kanban board. It is progress billing, retainage math, change orders, and draws that must reconcile to the penny across periods. Generic project tools do not model it, which is why the spreadsheet survives.',
        ],
      },
      {
        h2: 'What your tracker would include',
        body: [],
        bullets: [
          'Jobs by phase with the billing status visible at a glance',
          'AIA-style progress billing that carries balances correctly every period',
          'Change orders with approval trails that hold up in a dispute',
          'Retainage tracked automatically, released on your rules',
          'Owner and PM views so the Monday meeting runs from live data',
        ],
      },
      {
        h2: 'Built from a real contractor system',
        body: [
          'I built exactly this for a commercial contractor: operations from bid to final payment, including the progress-billing math their office used to dread monthly. The pattern is proven; yours gets shaped to your jobs.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it produce AIA-style pay applications?',
        a: 'Yes, with continuation math that rebills correctly every period, which is precisely where spreadsheets and generic tools break. The math gets tested against your real past applications before you rely on it.',
      },
      {
        q: 'Does it replace Procore?',
        a: 'For a 10 to 50 person GC, it often replaces the spreadsheet next to Procore rather than Procore itself. On the call we map what you actually use and build only the missing piece.',
      },
    ],
    related: [
      'custom-software-for-construction-companies',
      'client-portal-for-construction-companies',
      'workflow-automation-for-construction',
      'custom-dashboards-and-reporting',
    ],
  },
  {
    slug: 'client-portal-for-construction-companies',
    cat: 'combo',
    title: 'Client Portal for Construction Companies | Neil Busque',
    metaDescription:
      'A construction client portal: owners see schedule, photos, change orders, and payments without calling your PM. $4,000/month.',
    eyebrow: 'Construction · Portal',
    h1: 'A client portal for **construction companies**.',
    lede: 'Every owner call about schedule or payment status is a PM interruption. A portal answers before they dial, and makes you look like the biggest GC in town.',
    sections: [
      {
        h2: 'Owners want visibility, not meetings',
        body: [
          'The owner is not difficult, just uninformed. Weekly photos, live schedule, and payment status in one login turn your most anxious client into your calmest reference.',
        ],
      },
      {
        h2: 'What your portal would include',
        body: [],
        bullets: [
          'Live schedule and milestone view per project',
          'Photo feeds from the field, organized by date and area',
          'Change orders presented for approval with one click',
          'Invoices, draw status, and payment history in one place',
          'Messages that stay attached to the project record',
        ],
      },
      {
        h2: 'Shipped pattern, real portals',
        body: [
          'I have built and shipped client portals for service teams this year, including branded per-client experiences. Construction owners ask simpler questions than agencies do. The portal answers them around the clock.',
        ],
      },
    ],
    faq: [
      {
        q: 'Will subcontractors get logins too?',
        a: 'If you want them: a separate sub view with schedule, documents, and requests keeps subs out of the owner’s sight while giving them what they call about.',
      },
      {
        q: 'What does it cost and how fast?',
        a: 'Part of the $4,000 a month seat. A first portal is a natural 14-day build. Month one refundable, and it runs on your domain in your accounts.',
      },
    ],
    related: [
      'custom-software-for-construction-companies',
      'client-portal-development',
      'project-tracking-software-for-construction',
      'client-portal-for-property-management',
    ],
  },
  {
    slug: 'workflow-automation-for-construction',
    cat: 'combo',
    title: 'Workflow Automation for Construction | Neil Busque',
    metaDescription:
      'Construction workflow automation: bid follow-ups, sub coordination, compliance docs, and owner reports that send themselves. $4,000/month.',
    eyebrow: 'Construction · Automation',
    h1: 'Workflow automation for **construction companies**.',
    lede: 'Your office re-types the same job data into estimating, accounting, and a status email every week. None of that needs a human.',
    sections: [
      {
        h2: 'Where contractor hours leak',
        body: [
          'Bid invitations that never get followed up. COIs expiring silently. The weekly owner update assembled by hand from three systems. Each one is a bridge a person is being paid to be.',
        ],
      },
      {
        h2: 'Automations I build for GCs',
        body: [],
        bullets: [
          'Bid follow-up sequences that chase invitations until answered',
          'Sub document tracking: COIs, W-9s, lien waivers, chased automatically',
          'Owner reports assembled from live job data and sent on schedule',
          'Estimating-to-accounting flow with no re-typing',
          'Permit and inspection date monitoring with alerts',
        ],
      },
      {
        h2: 'Small automations, big hours',
        body: [
          'Construction automation is rarely one big system. It is eight small bridges, each saving hours weekly. The seat model fits this perfectly: several automations shipped per month, $4,000 flat, each one documented and owned by you.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it chase lien waivers and COIs automatically?',
        a: 'Yes. The system watches expirations and gaps, emails the sub politely, escalates on your schedule, and shows your office one clean list of who is still missing what.',
      },
      {
        q: 'We use QuickBooks and Buildertrend. Does that work?',
        a: 'Both have workable APIs. Most GC automations are exactly this: gluing those two to each other and to your inbox, so data stops traveling by re-typing.',
      },
    ],
    related: [
      'custom-software-for-construction-companies',
      'workflow-automation-services',
      'project-tracking-software-for-construction',
      'workflow-automation-for-property-management',
    ],
  },
  {
    slug: 'ai-phone-agent-for-hvac-companies',
    cat: 'combo',
    title: 'AI Phone Agent for HVAC Companies | Neil Busque',
    metaDescription:
      'An AI phone agent for HVAC: answers the July call flood, quotes service windows, books jobs, routes emergencies. $4,000/month.',
    eyebrow: 'HVAC · AI Phone',
    h1: 'An AI phone agent for **HVAC companies**.',
    lede: 'The first heat wave doubles your call volume overnight. The agent answers every one, books the routine, and escalates the no-cool emergencies.',
    sections: [
      {
        h2: 'Peak season is a phone problem',
        body: [
          'Your dispatcher is great. There is one of her, and in July there are two hundred calls. Overflow goes to voicemail, and voicemail in a heat wave is a gift to your competitor.',
        ],
      },
      {
        h2: 'What your HVAC agent would do',
        body: [],
        bullets: [
          'Answer instantly at any volume, no hold queue',
          'Triage no-cool and no-heat calls by your urgency rules',
          'Quote your service-call fee and book into real dispatch windows',
          'Pitch maintenance agreements to eligible callers, gently',
          'Hand complex commercial calls to a human with a summary',
        ],
      },
      {
        h2: 'Connected to your dispatch board',
        body: [
          'Bookings land in your calendar or field-service platform, tagged by zone and urgency, so dispatch stays in one view. The phone number and every account involved stay in your name.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it upsell maintenance agreements?',
        a: 'Yes, politely and only where it fits: a repair call on an aging unit can end with an agreement offer. You approve the script and see the conversion numbers.',
      },
      {
        q: 'What happens with angry or complex calls?',
        a: 'It recognizes frustration and complexity and routes to your team with context instead of wrestling the call. The goal is booked jobs and calm customers, not AI heroics.',
      },
    ],
    related: [
      'custom-software-for-hvac-companies',
      'ai-phone-agent-for-business',
      'booking-software-for-hvac-companies',
      'ai-phone-agent-for-plumbing-companies',
    ],
  },
  {
    slug: 'booking-software-for-hvac-companies',
    cat: 'combo',
    title: 'Booking Software for HVAC Companies | Neil Busque',
    metaDescription:
      'Custom HVAC booking: real dispatch windows, zone-aware scheduling, maintenance-agreement slots, and reminder flows. $4,000/month.',
    eyebrow: 'HVAC · Booking',
    h1: 'Booking software for **HVAC companies**.',
    lede: 'Letting customers book online is easy. Letting them book slots your dispatcher would have chosen is the hard part I build.',
    sections: [
      {
        h2: 'Naive booking wrecks routes',
        body: [
          'A generic scheduler happily books a Tuesday 8am in a zone your trucks visit Thursdays. Real HVAC booking has to know zones, drive time, tech skills, and part availability, or it creates work instead of saving it.',
        ],
      },
      {
        h2: 'What your booking system would include',
        body: [],
        bullets: [
          'Zone-aware windows that protect your routing',
          'Job typing so a maintenance visit books differently than a no-cool call',
          'Maintenance-agreement customers seeing their priority slots',
          'Deposits for after-hours or long-drive bookings, your rules',
          'Reminders and truck-on-the-way texts that cut no-answer visits',
        ],
      },
      {
        h2: 'Flat price, no per-booking skim',
        body: [
          'Part of the $4,000 a month seat, live inside 14 days, month one refundable. No per-booking fees, and it pairs naturally with the AI phone agent so web and phone bookings follow the same rules.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it respect our routing zones?',
        a: 'Yes, that is the core of it: windows offered depend on zone schedules and drive time, so online bookings land where your dispatcher would have put them.',
      },
      {
        q: 'Does it sync with ServiceTitan or Housecall Pro?',
        a: 'Where the platform exposes scheduling APIs, yes. Where it does not, the booking system becomes the front door and your board stays the source of truth through a clean sync.',
      },
    ],
    related: [
      'custom-software-for-hvac-companies',
      'booking-and-scheduling-software',
      'ai-phone-agent-for-hvac-companies',
      'booking-software-for-med-spas',
    ],
  },
  {
    slug: 'quoting-software-for-hvac-companies',
    cat: 'combo',
    title: 'Quoting Software for HVAC Companies | Neil Busque',
    metaDescription:
      'HVAC quoting software: flat-rate options from the driveway, good-better-best proposals, and quote follow-up that never forgets. $4,000/month.',
    eyebrow: 'HVAC · Quoting',
    h1: 'Quoting software for **HVAC companies**.',
    lede: 'Replacement quotes win in the driveway, not three days later from the office. I build tools your techs can price with on the spot.',
    sections: [
      {
        h2: 'Slow quotes lose replacements',
        body: [
          'A homeowner with a dead system gets three bids fast. The company that hands them a clear good-better-best while still on site usually wins, and most shops cannot produce that without the comfort advisor.',
        ],
      },
      {
        h2: 'What your quoting tool would include',
        body: [],
        bullets: [
          'Flat-rate and replacement pricing from your real cost model',
          'Good, better, best proposals a tech can build on a phone',
          'Financing options presented cleanly where you offer them',
          'E-signature and deposit on the spot',
          'Automatic follow-up on every quote that leaves without a yes',
        ],
      },
      {
        h2: 'Your price book, finally in one place',
        body: [
          'Equipment costs move constantly. Your price book lives in one screen your office controls, so every tech quotes from today’s numbers, not last quarter’s printout.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can techs really use it in the field?',
        a: 'It is built phone-first for exactly that: pick the job type, answer a few guided questions, and a branded proposal is ready to show before you leave the driveway.',
      },
      {
        q: 'What does it cost?',
        a: 'Part of the $4,000 a month seat, first version inside 14 days, month one refundable. One closed replacement usually covers the month.',
      },
    ],
    related: [
      'custom-software-for-hvac-companies',
      'quoting-and-invoicing-software',
      'quoting-software-for-plumbing-companies',
      'quoting-software-for-roofing-companies',
    ],
  },
  {
    slug: 'ai-phone-agent-for-plumbing-companies',
    cat: 'combo',
    title: 'AI Phone Agent for Plumbing Companies | Neil Busque',
    metaDescription:
      'An AI phone agent for plumbers: answers 2am emergencies, quotes your fee, books the visit, and texts your on-call tech. $4,000/month.',
    eyebrow: 'Plumbing · AI Phone',
    h1: 'An AI phone agent for **plumbing companies**.',
    lede: 'The 2am burst-pipe call is the most valuable lead you get, and the most likely to hit voicemail. The agent answers it like your best dispatcher.',
    sections: [
      {
        h2: 'Emergencies do not wait for office hours',
        body: [
          'Plumbing leads are urgent by nature. Answer in thirty seconds and quote a fee, and the job is usually yours. Miss the call and the homeowner is already dialing the next listing.',
        ],
      },
      {
        h2: 'What your plumbing agent would do',
        body: [],
        bullets: [
          'Answer around the clock with your greeting and your rules',
          'Ask what happened, where, and how bad, like a pro would',
          'Quote your emergency and standard fees clearly',
          'Book the visit and text your on-call tech the summary instantly',
          'Handle the non-urgent calls too: estimates, reschedules, invoices',
        ],
      },
      {
        h2: 'The math is simple',
        body: [
          'One saved emergency job often covers a month of the seat. The agent is part of my flat $4,000 a month, live inside 14 days, month one refundable, and the phone number stays yours forever.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it tell a real emergency from a drip?',
        a: 'Yes, with your triage rules: active water and no-shutoff cases wake the on-call tech now; a dripping faucet books a morning slot and nobody loses sleep.',
      },
      {
        q: 'What if the caller insists on a human?',
        a: 'It hands off immediately to your on-call line with a live summary, or takes a detailed message and texts it instantly. Nobody gets trapped talking to a robot.',
      },
    ],
    related: [
      'custom-software-for-plumbing-companies',
      'ai-phone-agent-for-business',
      'ai-phone-agent-for-hvac-companies',
      'ai-phone-agent-vs-answering-service',
    ],
  },
  {
    slug: 'quoting-software-for-plumbing-companies',
    cat: 'combo',
    title: 'Quoting Software for Plumbing Companies | Neil Busque',
    metaDescription:
      'Plumbing quoting software: consistent flat-rate pricing, clean branded quotes from the van, and automatic follow-up. $4,000/month.',
    eyebrow: 'Plumbing · Quoting',
    h1: 'Quoting software for **plumbing companies**.',
    lede: 'Estimates written in text messages do not win water-heater jobs. A clean, fast, branded quote from the van does.',
    sections: [
      {
        h2: 'Consistency is the quiet profit lever',
        body: [
          'When every tech prices from his own experience, your margin depends on who took the call. A quoting tool encodes your price book once and everyone quotes like your best.',
        ],
      },
      {
        h2: 'What your quoting tool would include',
        body: [],
        bullets: [
          'Flat-rate price book for the common jobs, maintained in one place',
          'Phone-first quote builder a tech can finish in the driveway',
          'Options presented clearly: repair versus replace, standard versus premium',
          'E-signature and deposit collection on acceptance',
          'Follow-up nudges on quotes that stall',
        ],
      },
      {
        h2: 'Connected to your books',
        body: [
          'Accepted quotes become invoices in QuickBooks without re-typing, and payment status flows back. The office stops being a copy machine between two systems.',
        ],
      },
    ],
    faq: [
      {
        q: 'We price jobs differently per neighborhood. Possible?',
        a: 'Yes. Zone-based multipliers, travel fees, and after-hours rates are normal custom logic. If you can explain the rule, the tool can apply it consistently.',
      },
      {
        q: 'How fast is it live?',
        a: 'First working version inside 14 days from an approved plan, month one refundable, part of the flat $4,000 seat. Your price book stays yours forever.',
      },
    ],
    related: [
      'custom-software-for-plumbing-companies',
      'quoting-and-invoicing-software',
      'quoting-software-for-hvac-companies',
      'quoting-software-for-landscaping-companies',
    ],
  },
  {
    slug: 'quoting-software-for-landscaping-companies',
    cat: 'combo',
    title: 'Quoting Software for Landscaping Companies | Neil Busque',
    metaDescription:
      'Landscaping estimating software: price from your real cost model, quote maintenance and installs properly, follow up automatically. $4,000/month.',
    eyebrow: 'Landscaping · Quoting',
    h1: 'Quoting software for **landscaping companies**.',
    lede: 'Maintenance contracts and install projects price completely differently. Your quoting tool should know both, and your cost model, cold.',
    sections: [
      {
        h2: 'The spreadsheet only one person understands',
        body: [
          'Most landscapers price from a spreadsheet the owner built years ago. It works, if the owner does every quote forever. That ceiling is exactly what a real quoting tool removes.',
        ],
      },
      {
        h2: 'What your estimating tool would include',
        body: [],
        bullets: [
          'Maintenance pricing from mow time, crew rates, and frequency',
          'Install estimating from materials, labor, and equipment days',
          'Seasonal contract quotes with monthly-payment presentation',
          'Branded proposals with photos and clear scopes',
          'Renewal quotes generated automatically from last year plus your increase',
        ],
      },
      {
        h2: 'Your cost model, protected',
        body: [
          'I turn the owner’s spreadsheet into guided software with guardrails, so a new salesperson cannot accidentally quote below cost. The logic stays yours, documented, in a tool you own.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it quote both maintenance and installs?',
        a: 'Yes, as separate flows sharing one cost model. That split is precisely why generic quoting tools feel wrong for landscaping, and why this build keeps coming up.',
      },
      {
        q: 'What does it cost?',
        a: 'Part of the $4,000 a month seat: first version in 14 days, month one refundable, no per-user fees as your sales team grows.',
      },
    ],
    related: [
      'custom-software-for-landscaping-companies',
      'quoting-and-invoicing-software',
      'custom-crm-for-landscaping-companies',
      'quoting-software-for-plumbing-companies',
    ],
  },
  {
    slug: 'custom-crm-for-landscaping-companies',
    cat: 'combo',
    title: 'Custom CRM for Landscaping Companies | Neil Busque',
    metaDescription:
      'A landscaping CRM shaped to your seasons: leads, contracts, renewals, and crew handoffs in one owned system. $4,000/month.',
    eyebrow: 'Landscaping · CRM',
    h1: 'A custom CRM for **landscaping companies**.',
    lede: 'Landscaping runs on seasons and renewals, not a generic sales funnel. Your CRM should think in contracts, routes, and spring start-ups.',
    sections: [
      {
        h2: 'Why the generic funnel fails here',
        body: [
          'A landscaping client is not "closed won" once. They renew every season, add services, pause for winter, and refer neighbors. Generic CRMs model none of that, so the real business ends up in spreadsheets again.',
        ],
      },
      {
        h2: 'What your landscaping CRM would include',
        body: [],
        bullets: [
          'Contract-centric records: services, frequency, seasons, pricing history',
          'Renewal pipelines that start chasing before the season does',
          'Upsell tracking: aeration, cleanups, lighting, snow',
          'Property notes and photos crews can actually find',
          'Commercial account views with sites, contacts, and billing terms',
        ],
      },
      {
        h2: 'One flat price, no per-user fees',
        body: [
          '$4,000 a month on the seat, first version in 14 days, month one refundable. Add office staff and salespeople without a seat fee ever appearing. You own the system and every record in it.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it handle snow accounts too?',
        a: 'Yes. Winter services get their own pipeline and pricing, tied to the same client record, so the October switchover stops being an office fire drill.',
      },
      {
        q: 'Will crews use it in the field?',
        a: 'Crews get a dead-simple mobile view: today’s route, property notes, photo upload. The office gets the full system. Nobody is forced through screens they do not need.',
      },
    ],
    related: [
      'custom-software-for-landscaping-companies',
      'custom-crm-development',
      'quoting-software-for-landscaping-companies',
      'custom-crm-for-roofing-companies',
    ],
  },
  {
    slug: 'ai-phone-agent-for-dental-practices',
    cat: 'combo',
    title: 'AI Phone Agent for Dental Practices | Neil Busque',
    metaDescription:
      'An AI phone agent for dental offices: answers overflow and after-hours calls, books consults, and never leaves a new patient on hold. $4,000/month.',
    eyebrow: 'Dental · AI Phone',
    h1: 'An AI phone agent for **dental practices**.',
    lede: 'A new-patient call that hits voicemail books somewhere else by lunch. The agent answers every ring your front desk cannot reach.',
    sections: [
      {
        h2: 'The front desk cannot be three people',
        body: [
          'Checking in a patient, taking a payment, and answering the phone happen at the same moment all day. The phone loses, quietly, and new patients are disproportionately the ones calling.',
        ],
      },
      {
        h2: 'What your dental agent would do',
        body: [],
        bullets: [
          'Answer overflow and after-hours calls instantly',
          'Book new-patient consults with your intake questions asked properly',
          'Handle the routine: hours, insurance participation, directions, reschedules',
          'Flag emergencies like trauma or severe pain to your on-call protocol',
          'Leave transcripts so the desk starts every morning informed',
        ],
      },
      {
        h2: 'Careful with patient information',
        body: [
          'Calls and transcripts live in accounts your practice owns, collected minimally, with access you can revoke. Anything requiring formal compliance review beyond a sensible build gets flagged on the first call, not discovered later.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can it check insurance participation?',
        a: 'It answers from your participation list and flags verification tasks to your team. It does not guess: unknown plans become a callback with the caller’s details captured.',
      },
      {
        q: 'What does it cost against one new patient?',
        a: 'The seat is $4,000 a month flat. Practices measure new-patient lifetime value in the thousands, so the agent typically has to save a handful of missed calls a month to carry itself.',
      },
    ],
    related: [
      'custom-software-for-dental-practices',
      'ai-phone-agent-for-business',
      'booking-software-for-dental-practices',
      'ai-phone-agent-for-medical-offices',
    ],
  },
  {
    slug: 'booking-software-for-dental-practices',
    cat: 'combo',
    title: 'Booking Software for Dental Practices | Neil Busque',
    metaDescription:
      'Dental online booking that respects provider rules, operatory limits, and appointment types, with no-show reduction built in. $4,000/month.',
    eyebrow: 'Dental · Booking',
    h1: 'Booking software for **dental practices**.',
    lede: 'Online booking that ignores operatories and provider rules creates chaos your front desk then untangles. I build booking that thinks like your scheduler.',
    sections: [
      {
        h2: 'Dental scheduling has real constraints',
        body: [
          'Hygiene blocks, doctor exam timing, operatory availability, new-patient slots: your best scheduler holds all of it in her head. Generic booking widgets hold none of it, which is why many practices still refuse online booking.',
        ],
      },
      {
        h2: 'What your booking system would include',
        body: [],
        bullets: [
          'Appointment types with correct durations and provider rules',
          'New-patient flows with intake completed before the visit',
          'Confirmations and reminders tuned to actually cut no-shows',
          'Self-serve rescheduling inside your rules, not around them',
          'A waitlist that fills cancellations automatically',
        ],
      },
      {
        h2: 'Alongside your PMS',
        body: [
          'Your practice management system stays the source of truth. The booking layer syncs to it where supported and hands the desk a clean confirmed list where not. Patients get modern booking; your schedule stays sane.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does it work with Dentrix or Open Dental?',
        a: 'Integration depth depends on your PMS version and hosting. Open Dental is friendly; others vary. I confirm the exact sync path on the free call before you commit to anything.',
      },
      {
        q: 'Will it really reduce no-shows?',
        a: 'Reminder sequences with easy rescheduling reliably cut no-shows versus a single confirmation call. You will see the numbers on a small dashboard rather than taking my word.',
      },
    ],
    related: [
      'custom-software-for-dental-practices',
      'booking-and-scheduling-software',
      'ai-phone-agent-for-dental-practices',
      'booking-software-for-med-spas',
    ],
  },
  {
    slug: 'ai-phone-agent-for-medical-offices',
    cat: 'combo',
    title: 'AI Phone Agent for Medical Offices | Neil Busque',
    metaDescription:
      'An AI phone agent for medical practices: overflow answering, appointment booking, refill routing, careful escalation. $4,000/month.',
    eyebrow: 'Medical · AI Phone',
    h1: 'An AI phone agent for **medical offices**.',
    lede: 'Your staff spends hours on calls a well-built system could answer: scheduling, directions, refill routing. The agent takes those, carefully.',
    sections: [
      {
        h2: 'Phones are the biggest staff drain',
        body: [
          'Front-office teams in medical practices live on the phone, and most calls are administrative, not clinical. Those administrative calls are automatable with discipline about what is not.',
        ],
      },
      {
        h2: 'What your medical office agent would do',
        body: [],
        bullets: [
          'Answer overflow and after-hours with clear, honest identification',
          'Book and reschedule appointments by your scheduling rules',
          'Route refill requests to the right queue with details captured',
          'Answer administrative questions: hours, location, forms, insurance participation',
          'Escalate anything clinical or urgent to your protocol immediately, every time',
        ],
      },
      {
        h2: 'Hard lines, drawn honestly',
        body: [
          'The agent gives no medical advice, ever, and urgent symptoms trigger your escalation protocol without negotiation. Data is collected minimally in accounts you own. If your requirements cross into formal compliance territory beyond a sensible build, I say so on the first call.',
        ],
      },
    ],
    faq: [
      {
        q: 'What keeps it from overstepping into clinical territory?',
        a: 'Hard rules, not vibes: symptom or advice language triggers escalation scripts and human routing. The safe boundary is designed in from the start and tested with your team before launch.',
      },
      {
        q: 'How fast can it take our overflow?',
        a: 'Inside 14 days from an approved plan, starting overflow-only if you prefer a cautious rollout. Month one refundable, and every account involved is yours.',
      },
    ],
    related: [
      'ai-phone-agent-for-dental-practices',
      'ai-phone-agent-for-business',
      'ai-phone-agent-for-med-spas',
      'custom-software-for-dental-practices',
    ],
  },
];
