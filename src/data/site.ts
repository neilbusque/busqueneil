/* Shared strings and lists for the public site: the one place to change contact details, nav,
   the closing ask, footer columns and the lists that pages render. Every string comes from the
   copy deck, word for word. Page-only copy (a page's H1, leads, its own FAQ) lives in the page.
   The shape of everything here is documented in src/components/site/README.md.

   Rules for everything in this file (the repo is public):
   - No company, client, employer, staff or agent-persona names anywhere, including slugs, alt
     text and seeds. Products are named for what they do; product URLs are link targets only.
   - No em dashes or en dashes. Plain, short sentences.
   - Only true statements. Every number traces to a source (see STATS). */

import type { ArtLayout, PaletteName } from '../lib/art';

/* ------------------------------------------------------------------ identity and channels */

export const SITE = {
  name: 'Neil Busque',
  url: 'https://busqueneil.com',
  email: 'busqueneil@gmail.com',
  /** Digits only, country code first, as wa.me expects. */
  whatsapp: '19083164140',
  whatsappDisplay: '+1 908-316-4140',
  linkedin: 'https://www.linkedin.com/in/neilbusque/',
  linkedinDisplay: 'linkedin.com/in/neilbusque',
  booking: 'https://book.busqueneil.com',
  bookingDisplay: 'book.busqueneil.com',
  location: 'New Jersey',
  timezone: 'US Eastern',
} as const;

export interface LinkItem {
  label: string;
  href: string;
}

/** WhatsApp chat link with an optional prefilled message. Blank text gives the bare link.
    The text is kept as written, trailing space included, so the visitor types straight after it. */
export function waUrl(text?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return text && text.trim() ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** mailto link with an optional subject. */
export function mailUrl(subject?: string): string {
  const s = subject?.trim();
  return s ? `mailto:${SITE.email}?subject=${encodeURIComponent(s)}` : `mailto:${SITE.email}`;
}

/* ------------------------------------------------------------------ WhatsApp prefills */

/** The prefill texts. Each ends with a space so the visitor can type straight after it. */
export const WA_TEXT = {
  /** Nav button, hero, closing band, contact page, any WhatsApp button without its own prefill. */
  global: "Hi Neil, I found your site. Here's what I'd like help with: ",
  /** Home prompt card. The visitor's text follows it. */
  prompt: 'Hi Neil, I want to build: ',
  /** Services, "Talk about a build". */
  oneBuild: "Hi Neil, I'd like to talk about one build: ",
  /** Services, "Talk about ongoing help". */
  ongoing: "Hi Neil, I'd like to talk about having you lead our AI work. Here's our business: ",
  /** Work, featured project link. */
  featured: "Hi Neil, I saw the recruiting system on your site. I'd like something like it for my business: ",
  /** Free tools, build-for-you button. */
  freeTools: "Hi Neil, I'd like a tool built for my business: ",
} as const;

export const waGlobal = (): string => waUrl(WA_TEXT.global);
/** Prompt card: "Hi Neil, I want to build: <text>". Blank text falls back to the global prefill. */
export const waPrompt = (text?: string): string => {
  const t = text?.trim();
  return t ? waUrl(WA_TEXT.prompt + t) : waGlobal();
};
export const waOneBuild = (): string => waUrl(WA_TEXT.oneBuild);
export const waOngoing = (): string => waUrl(WA_TEXT.ongoing);
export const waFeatured = (): string => waUrl(WA_TEXT.featured);
export const waFreeTools = (): string => waUrl(WA_TEXT.freeTools);
/** /software pages CTA block. Pass the page's title with its capitals as written (never
    lowercased: that breaks CRM, HVAC and AI); a trailing " | Neil Busque" is dropped, and a
    title ending in a question mark gets no period after it. */
export const waSoftware = (pageTitle: string): string => {
  const title = pageTitle.replace(/\s*\|\s*Neil Busque\s*$/, '').trim();
  return waUrl(`Hi Neil, I read your page on ${title}${title.endsWith('?') ? '' : '.'} Here's what we need: `);
};

/** Older names, kept so existing imports keep working. */
export const WA_HELLO = WA_TEXT.global;
export const WA_PROMPT_PREFIX = WA_TEXT.prompt;

/* ------------------------------------------------------------------ navigation */

export type NavKey = 'services' | 'work' | 'resources' | 'free';

export interface NavItem extends LinkItem {
  key: NavKey;
}

export const NAV: NavItem[] = [
  { key: 'services', href: '/services', label: 'Services' },
  { key: 'work', href: '/work', label: 'Work' },
  { key: 'resources', href: '/resources', label: 'Resources' },
  { key: 'free', href: '/free', label: 'Free tools' },
];

export const NAV_CONTACT: LinkItem = { href: '/contact', label: 'Contact' };

/** The small primary button in the nav, on desktop and phones. Opens WhatsApp in a new tab. */
export const NAV_CTA = {
  label: 'Message me',
  /** Same as label: "Message me" fits the narrowest phones. */
  labelShort: 'Message me',
  ariaLabel: 'Message Neil on WhatsApp',
  /** The full-width button pinned to the bottom of the phone menu sheet. */
  sheetLabel: 'Message me on WhatsApp',
  message: WA_TEXT.global,
} as const;

/** Accessible names for the phone menu button. */
export const MENU_LABELS = { open: 'Open menu', close: 'Close menu' } as const;

/* ------------------------------------------------------------------ contact channels */

export type ChannelKey = 'whatsapp' | 'email' | 'booking' | 'linkedin';

export interface Channel {
  key: ChannelKey;
  /** Small label in the left column. */
  label: string;
  /** What the visitor sees as the value. */
  value: string;
  href: string;
}

/** WhatsApp first, as Neil asked. */
export const CHANNELS: Channel[] = [
  { key: 'whatsapp', label: 'WhatsApp', value: SITE.whatsappDisplay, href: waGlobal() },
  { key: 'email', label: 'Email', value: SITE.email, href: mailUrl() },
  { key: 'booking', label: 'Book a call', value: SITE.bookingDisplay, href: SITE.booking },
  { key: 'linkedin', label: 'LinkedIn', value: SITE.linkedinDisplay, href: SITE.linkedin },
];

/* ------------------------------------------------------------------ closing band */

export interface ClosingCopy {
  title: string;
  /** Words appended to the title in the accent color, period included. */
  accent?: string;
  lead: string;
  primary: LinkItem;
  secondary: LinkItem;
}

/** Every page except Contact. */
export const CLOSING: ClosingCopy = {
  title: 'Tell me what eats your',
  accent: 'week.',
  lead: 'Send a few lines about the work. I keep working until you are proud of it. If I am not the right fit, I will tell you on the first call.',
  primary: { label: 'Message me on WhatsApp', href: waGlobal() },
  secondary: { label: 'Use the contact form', href: '/contact#form' },
};

/* ------------------------------------------------------------------ footer */

export const FOOTER_TAGLINE = 'The AI guy for growing businesses. Based in New Jersey.';

export interface FooterColumn {
  title: string;
  links: LinkItem[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Services',
    links: [
      { label: 'AI agents', href: '/services/ai-agent-development' },
      { label: 'AI voice agents', href: '/software/ai-phone-agent-for-business' },
      { label: 'Custom software', href: '/services/web-apps' },
      { label: 'Automations', href: '/services/ai-automation-services' },
      { label: 'Websites and funnels', href: '/services/websites' },
    ],
  },
  {
    title: 'Resources',
    /* Notes (/blog) joins this column only once the first build note is published. */
    links: [
      { label: 'Guides', href: '/resources' },
      { label: 'Comparisons', href: '/compare' },
      { label: 'Research', href: '/research' },
    ],
  },
  {
    title: 'More',
    links: [
      { label: 'Work', href: '/work' },
      { label: 'Free tools', href: '/free' },
      { label: 'Software by industry', href: '/software' },
      { label: 'About', href: '/story' },
      { label: 'When to hire me', href: '/hire' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

/* ------------------------------------------------------------------ prompt card */

export interface PromptChip {
  /** Words on the chip. */
  label: string;
  /** Text the chip puts in the input. It follows "Hi Neil, I want to build: ". */
  fill: string;
}

export const PROMPT = {
  /** Visually hidden label for the input. */
  label: 'What do you want to build?',
  placeholder: 'Describe what you want to build or automate',
  placeholderShort: 'What should we build?',
  sendLabel: 'Send to Neil on WhatsApp',
  /** Phones show the first two. */
  chips: [
    { label: 'An AI receptionist', fill: 'an AI receptionist that answers calls and books appointments' },
    { label: 'A custom CRM', fill: 'a CRM built around how my team works' },
    { label: 'Lead follow-up', fill: 'automatic follow-up for every new lead' },
  ] as PromptChip[],
};

/* ------------------------------------------------------------------ art */

/** Optional real image for any record that renders art. Same frame and ratio as the placeholder. */
export interface WithImage {
  image?: string;
  imageAlt?: string;
  /** Force a placeholder palette to balance neighbors on a page. */
  palette?: PaletteName;
  layout?: ArtLayout;
}

/* ------------------------------------------------------------------ services */

export interface DefRow {
  term: string;
  value: string;
  href?: string;
}

export interface Service extends WithImage {
  /** Stable key: the art seed and the section id on /services. */
  slug: string;
  /** Index number as shown, "01" to "05". */
  number: string;
  /** Section title on /services. */
  name: string;
  /** One line for the /services index. */
  line: string;
  /** What it is and the problem it solves, for the /services section. */
  text: string;
  /** "What you get". */
  items: string[];
  /** Definition rows: Good for, How it starts, What you own. */
  facts: DefRow[];
  /** Link to the deep page. */
  link: LinkItem;
  /** The deep page (same URL as link.href). */
  href: string;
}

export const SERVICES: Service[] = [
  {
    slug: 'ai-agents',
    number: '01',
    name: 'AI agents and assistants',
    line: 'AI that works inside your tools and asks before anything risky.',
    text: 'An AI agent does one clear job inside the tools you already use, like sorting new leads, updating your CRM or drafting replies. It looks things up and gets the work ready on its own, and anything risky waits for a person to approve it.',
    items: [
      'An agent set up with your offers, prices and rules',
      'Connections to your CRM, inbox, calendar or database',
      'Clear limits, with risky steps waiting for your one-click approval',
      'Tuning after launch, as real use shows what to fix',
    ],
    facts: [
      { term: 'Good for', value: 'Lead follow-up, customer questions, CRM updates and inbox sorting' },
      { term: 'How it starts', value: 'We pick one job, like lead follow-up, and build that first' },
      { term: 'What you own', value: 'The code, the instructions and the accounts it runs on' },
    ],
    link: { label: 'More on AI agents', href: '/services/ai-agent-development' },
    href: '/services/ai-agent-development',
  },
  {
    slug: 'ai-voice-agents',
    number: '02',
    name: 'AI voice agents',
    line: 'Phone and website agents that answer, qualify and book.',
    text: 'A voice agent answers your phone or talks with visitors on your website, asks the right questions and books the appointment. It picks up after hours and on busy days, when calls would otherwise go to voicemail.',
    items: [
      'A phone agent that answers with your business name, day and night',
      'Questions that qualify each caller before booking',
      'Bookings made straight into your calendar',
      'Booking rules you set, like no same-day visits',
    ],
    facts: [
      { term: 'Good for', value: 'Home services, clinics, law firms and any team that misses calls' },
      { term: 'How it starts', value: 'We write the call script together, and you test it on your own phone first' },
      { term: 'What you own', value: 'The script, the phone number and the account the agent runs on' },
    ],
    link: { label: 'More on AI phone agents', href: '/software/ai-phone-agent-for-business' },
    href: '/software/ai-phone-agent-for-business',
  },
  {
    slug: 'custom-software',
    number: '03',
    name: 'Custom software and business operating systems',
    line: 'One system in place of the spreadsheets and tools you juggle.',
    text: 'One app your team runs the business from, in place of the spreadsheets and tools you juggle now. Leads, clients, projects and reports live in one place, built around how you already work.',
    items: [
      'A CRM, client portal or dashboard shaped to your process',
      'Your data moved over from the tools it replaces',
      'AI where it saves time, like turning calls into tasks',
      'An app your team can install on desktop and phone',
    ],
    facts: [
      { term: 'Good for', value: 'Agencies and service businesses running on too many tools' },
      { term: 'How it starts', value: 'You walk me through how your team works today, and you see a first version in days' },
      { term: 'What you own', value: 'The code, the database and every account, in your name' },
    ],
    link: { label: 'More on custom software', href: '/services/web-apps' },
    href: '/services/web-apps',
  },
  {
    slug: 'automations',
    number: '04',
    name: 'Automations and integrations',
    line: 'Work that moves between your tools on its own.',
    text: 'Automations move work between your tools, so nobody copies and pastes. New leads get a fast follow-up, form entries land in your CRM, and reports are ready when you need them.',
    items: [
      'Leads from forms, ads and job boards sent to one place',
      'Meeting notes turned into tasks for your team',
      'AI steps that sort, summarize and draft replies',
      'Fixes when a tool changes and a step breaks',
    ],
    facts: [
      { term: 'Good for', value: 'Teams that move the same data by hand every week' },
      { term: 'How it starts', value: "Show me the task your team repeats most, and I'll map it and price it" },
      { term: 'What you own', value: 'Every workflow, in your own n8n, Zapier, GoHighLevel or other account' },
    ],
    link: { label: 'More on automation', href: '/services/ai-automation-services' },
    href: '/services/ai-automation-services',
  },
  {
    slug: 'ai-sites',
    number: '05',
    name: 'AI-powered websites, landing pages and funnels',
    line: 'Fast pages that turn visitors into booked calls.',
    text: 'Fast sites and pages that say what you do in plain words and make the next step obvious. Forms, booking and follow-up are connected, and an AI assistant can answer questions and book calls.',
    items: [
      'Copy, design and build from one person',
      'Pages that load fast and work well on phones',
      'Forms and booking connected to your CRM',
      'A structure that search engines and AI answers can read',
    ],
    facts: [
      { term: 'Good for', value: "Businesses paying for traffic that doesn't turn into calls" },
      { term: 'How it starts', value: 'Run your page through my free analyzer, or send me the link' },
      { term: 'What you own', value: 'The site, the domain and the code' },
    ],
    link: { label: 'More on websites', href: '/services/websites' },
    href: '/services/websites',
  },
];

export interface Capability {
  /** "01" to "04". */
  number: string;
  name: string;
  line: string;
  href: string;
}

/** The ruled strip under the home hero. Also fits an About page. */
export const CAPABILITIES: Capability[] = [
  { number: '01', name: 'AI agents', line: 'Assistants and phone agents that answer, qualify and book.', href: '/services/ai-agent-development' },
  { number: '02', name: 'Custom software', line: 'One system in place of spreadsheets and logins.', href: '/services/web-apps' },
  { number: '03', name: 'Automations', line: 'Leads, follow-ups and reports that move on their own.', href: '/services/ai-automation-services' },
  { number: '04', name: 'AI sites and funnels', line: 'Fast pages that turn visitors into booked calls.', href: '/services/websites' },
];

export interface ServiceCard extends WithImage {
  /** Art seed, shared with the matching service so both pages show the same picture. */
  slug: string;
  title: string;
  line: string;
  href: string;
  /** "What you get", on the large first card only. */
  items?: string[];
}

/** The home services bento: one large card, then three. */
export const SERVICE_CARDS: ServiceCard[] = [
  {
    slug: 'ai-agents',
    title: 'AI agents and voice agents',
    line: 'Assistants that work inside your tools and answer your phone, within limits you set.',
    href: '/services/ai-agent-development',
    items: [
      'An assistant inside your CRM, inbox or database',
      'A phone or website agent that answers and books',
      'Your OK before anything risky happens',
    ],
    palette: 'mist',
    layout: 'skyline',
  },
  {
    slug: 'custom-software',
    title: 'Custom software',
    line: 'The CRM, portal or dashboard your team runs on, built around how you already work.',
    href: '/services/web-apps',
    palette: 'navy',
    layout: 'skyline',
  },
  {
    slug: 'automations',
    title: 'Automations',
    line: 'Your tools pass work to each other, so nobody copies and pastes.',
    href: '/services/ai-automation-services',
    palette: 'mist',
  },
  {
    slug: 'ai-sites',
    title: 'AI sites and funnels',
    line: 'Pages that say what you do in plain words and get visitors to book.',
    href: '/services/websites',
    palette: 'paper',
  },
];

/* ------------------------------------------------------------------ work */

export type ProjectType = 'agents' | 'software' | 'automations' | 'sites';

/** The visible category label for each type, also the work page tab labels. */
export const PROJECT_CATEGORY: Record<ProjectType, string> = {
  agents: 'AI agents',
  software: 'Software',
  automations: 'Automations',
  sites: 'Sites and funnels',
};

interface ProjectBase {
  /** Stable key, also the art seed. A generic descriptor, never a client or product name. */
  slug: string;
  /** Named for what it does. */
  title: string;
  /** Context: one to three sentences. */
  text: string;
  type: ProjectType;
  /** Visible label, PROJECT_CATEGORY[type]. */
  category: string;
  /** "2026", or "2025 to 2026". */
  year: string;
  /** Link target, or null when there is nothing public to link to. */
  href: string | null;
}

export interface Project extends ProjectBase, WithImage {
  /** A real, checkable outcome, or null. */
  outcome: string | null;
}

export interface FeaturedProject extends Project {
  /** "What I built", three short items. */
  built: string[];
  /** Stack as one plain line, comma separated. */
  stack: string;
  /** The featured link: WhatsApp with the featured prefill. */
  cta: LinkItem;
}

export type ProjectRow = ProjectBase;

const project = (type: ProjectType, p: Omit<Project, 'type' | 'category'>): Project => ({ ...p, type, category: PROJECT_CATEGORY[type] });
const row = (type: ProjectType, p: Omit<ProjectRow, 'type' | 'category'>): ProjectRow => ({ ...p, type, category: PROJECT_CATEGORY[type] });

export const FEATURED_PROJECT: FeaturedProject = {
  ...project('software', {
    slug: 'recruiting-crm-ai-screening',
    title: 'A recruiting CRM that screens every application with AI',
    text: "A recruiting agency tracked applicants across an old CRM, a project board and an ads account. I built one system where applications come in, AI screens each one, and recruiters call from the same screen. It runs on the agency's own accounts.",
    year: '2026',
    outcome: 'First version live within 2 days of signing.',
    href: null,
    palette: 'mist',
    layout: 'stair',
  }),
  built: [
    'AI screening on every application, checked by a second AI from another provider',
    "A power dialer, with each applicant's answers, notes and history on one screen",
    'Applications pulled in from job boards and ad forms, plus history moved over from the old CRM',
  ],
  stack: 'React, TypeScript, Supabase, Twilio, OpenAI, Claude',
  cta: { label: 'Ask me about a system like this', href: waFeatured() },
};

/** The eight project cards, in deck order. */
export const PROJECTS: Project[] = [
  project('software', {
    slug: 'crm-with-ai-follow-up',
    title: 'A CRM where an AI assistant does the follow-up',
    text: 'My own CRM for small teams. Its assistant can take about 150 different actions in the app, from updating deals to drafting replies, and it asks before anything risky.',
    year: '2026',
    outcome: 'First payment 24 days after the first line of code.',
    href: '/case-studies/orbit',
  }),
  project('software', {
    slug: 'agency-os-assistant-asks-first',
    title: 'An agency operating system with an assistant that asks first',
    text: 'One app for a marketing agency, with sales-call scoring, an SEO writer, booking and drafted review replies. Its 35-tool assistant waits for a click before it changes anything.',
    year: '2026',
    outcome: null,
    href: null,
    palette: 'paper',
  }),
  project('agents', {
    slug: 'ai-phone-receptionist-roofing',
    title: 'An AI phone receptionist for a roofing company',
    text: 'Answers inbound calls, asks about the roof and books inspections on the company calendar.',
    year: '2026',
    outcome: null,
    href: null,
    palette: 'navy',
    layout: 'skyline',
  }),
  project('agents', {
    slug: 'ai-ads-app',
    title: 'An AI ads app that reads a brand and drafts the ads',
    text: "Give it a website. It reads the brand, studies competitors' ads, then writes ad angles and makes the images.",
    year: '2026',
    outcome: 'From request to live in one day.',
    href: null,
    palette: 'mist',
    layout: 'stair',
  }),
  project('automations', {
    slug: 'one-click-client-onboarding',
    title: 'One-click client onboarding for an agency',
    text: "At a marketing agency, one click set up each new client's CRM account, with pipelines, tags and team channels ready.",
    year: '2025 to 2026',
    outcome: 'Cut new-client onboarding from 30 days to 7.',
    href: null,
    palette: 'mist',
  }),
  project('automations', {
    slug: 'meeting-notes-to-tasks',
    title: 'Meeting notes that turn into project tasks',
    text: "After a recorded client call, AI pulls out the action items, each linked to the moment it was said. Someone checks them, then they go to the team's project tool as tasks.",
    year: '2026',
    outcome: null,
    href: null,
    palette: 'navy',
  }),
  project('sites', {
    slug: 'funnel-simulator',
    title: 'A funnel simulator with an AI audit',
    text: 'Lay out a whole funnel, from ad to booking to follow-up, and click through it before you buy traffic. AI drafts the first version and audits it.',
    year: '2026',
    outcome: null,
    href: '/case-studies/preflight',
    palette: 'paper',
    layout: 'skyline',
  }),
  /* Invite-only signup, so no link target. */
  project('sites', {
    slug: 'funnel-builder-kits',
    title: 'A funnel builder with ready-made kits',
    text: 'Pick a kit for a webinar, video sales letter, challenge or book funnel, and it sets up the pages. Contacts and follow-up emails live in the same app.',
    year: '2026',
    outcome: null,
    href: null,
    palette: 'mist',
    layout: 'skyline',
  }),
];

/** "More builds": smaller builds, internal tools and client work without a write-up. */
export const MORE_BUILDS: ProjectRow[] = [
  row('software', {
    slug: 'ad-dashboard-ai-coach',
    title: 'Ad dashboard with an AI ad coach',
    text: "Every client's ad account on one screen for an ads agency, with billing alerts and an AI coach that flags accounts at risk.",
    year: '2026',
    href: null,
  }),
  row('agents', {
    slug: 'google-ads-assistant',
    title: 'Google Ads assistant that proposes changes',
    text: 'Chat with live Google Ads data. Suggested changes go live only after someone clicks Apply.',
    year: '2026',
    href: null,
  }),
  row('agents', {
    slug: 'bilingual-setter-practice-calls',
    title: 'Practice calls for bilingual appointment setters',
    text: "Setters rehearse spoken calls in Spanish with an AI patient, then get scored on the team's own scorecard.",
    year: '2026',
    href: null,
  }),
  row('agents', {
    slug: 'live-sales-call-copilot',
    title: 'Live sales-call copilot',
    text: 'Suggests what to say during a sales call, in a window the other side never sees on screen share, then writes a coaching report.',
    year: '2026',
    href: null,
  }),
  row('agents', {
    slug: 'ai-social-media-manager',
    title: 'AI social media manager',
    text: 'Drafts posts and designed slides each morning from trends, competitors and news, then schedules the ones you approve.',
    year: '2026',
    href: 'https://radar.neilb.app',
  }),
  row('software', {
    slug: 'finance-firm-client-portal',
    title: 'Client portal for a finance and tax firm',
    text: "Tasks, files and messages in one place for the firm's clients, in place of a paid portal tool. Live the day after the onboarding call.",
    year: '2026',
    href: null,
  }),
  row('software', {
    slug: 'branded-portal-e-signatures',
    title: 'Branded client portal with e-signatures',
    text: "Files, reports, boards and legally binding signatures in one place for a firm's clients.",
    year: '2026',
    href: null,
  }),
  row('software', {
    slug: 'construction-crm-takeover',
    title: 'Construction CRM, taken over and launched',
    text: 'Finished an app-builder prototype for a commercial contractor, with progress billing, change orders and several companies in one login.',
    year: '2026',
    href: null,
  }),
  row('software', {
    slug: 'field-crew-time-tracking',
    title: 'Time tracking for field crews',
    text: 'Field staff clock in and out by project from their phones.',
    year: '2026',
    href: null,
  }),
  row('automations', {
    slug: 'agency-production-workflows',
    title: 'Production workflows for a marketing agency',
    text: 'More than 20 n8n workflows across more than 10 client accounts, from lead capture to no-show recovery.',
    year: '2025 to 2026',
    href: null,
  }),
  row('sites', {
    slug: 'landing-page-analyzer',
    title: 'Landing page analyzer',
    text: 'Scores any page for speed, mobile and conversion, and can email you a full report.',
    year: '2026',
    href: '/analyzer',
  }),
];

export type WorkTabKey = 'all' | ProjectType;

const allWork = (): ProjectBase[] => [FEATURED_PROJECT, ...PROJECTS, ...MORE_BUILDS];
const countOf = (type?: ProjectType) => allWork().filter((p) => !type || p.type === type).length;

/** Work page filter tabs, with real counts over the featured project, the cards and the rows. */
export const WORK_TABS: { key: WorkTabKey; label: string; count: number }[] = [
  { key: 'all', label: 'All', count: countOf() },
  { key: 'agents', label: PROJECT_CATEGORY.agents, count: countOf('agents') },
  { key: 'software', label: PROJECT_CATEGORY.software, count: countOf('software') },
  { key: 'automations', label: PROJECT_CATEGORY.automations, count: countOf('automations') },
  { key: 'sites', label: PROJECT_CATEGORY.sites, count: countOf('sites') },
];

/* ------------------------------------------------------------------ free tools */

export interface Tool extends WithImage {
  /** Stable key, also the art seed. */
  slug: string;
  /** Named for what it does. */
  name: string;
  /** One line on what it does. */
  text: string;
  /** The deck's platform line, which already says how it is free. */
  platform: string;
  /** Link label, for example "Open the tool". */
  cta: string;
  /** Link target only. Never print the domain. */
  href: string;
  /** Only for a separate "Free" tag when the platform line does not say it. */
  free?: boolean;
}

export interface FeaturedTool extends Tool {
  /** What it does. */
  what: string;
  /** Who it's for. */
  who: string;
  /** How it works. */
  steps: string[];
}

/** The landing page analyzer, featured on /free. Its `text` is the one-line card version. */
export const FEATURED_TOOL: FeaturedTool = {
  slug: 'landing-page-analyzer',
  name: 'Landing page analyzer',
  text: 'Scores any page for speed, mobile and conversion, and can email you a full report.',
  platform: 'Web app, free, no signup to see your score',
  cta: 'Score my page',
  href: '/analyzer',
  what: 'Paste a link to your page. You get a score for speed, mobile and the parts that turn visitors into leads, like your headline, button, form and proof.',
  who: 'Owners and marketers paying for traffic to a page that should bring in calls or sales.',
  steps: [
    "Paste your page's link.",
    'See your score and grade on the spot, with no signup.',
    'Add your email if you want the full report as a PDF.',
  ],
};

/** The tool cards shown on /free, in deck order. */
export const TOOLS: Tool[] = [
  {
    slug: 'crm-with-ai-follow-up',
    name: 'A CRM where an AI assistant does the follow-up',
    text: 'Contacts, deals, inbox and booking in one place, with an assistant that drafts the next message. The free plan needs no credit card.',
    platform: 'Web app, free plan',
    cta: 'Open the tool',
    href: 'https://www.inorbit.one',
  },
  {
    slug: 'crm-live-demo',
    name: 'A live CRM demo with sample data',
    text: 'Click through a working CRM and ask its AI assistant a question. No signup needed.',
    platform: 'Web app, no signup',
    cta: 'Open the demo',
    href: 'https://app.inorbit.one/demo',
  },
  {
    slug: 'funnel-simulator',
    name: 'A funnel simulator with an AI audit',
    text: 'Lay out your ads, pages, booking and follow-up, click through like a buyer, and get an AI audit before you buy traffic.',
    platform: 'Web app, free account',
    cta: 'Open the tool',
    href: 'https://preflight.neilb.app',
  },
  {
    slug: 'website-design-library',
    name: 'A library of real website designs',
    text: 'Browse real sites when you plan a redesign, and copy a prompt to recreate a style you like.',
    platform: 'Web app, free to explore',
    cta: 'Open the tool',
    href: 'https://swipefile.design',
  },
];

/** Cards written and checked but not shown yet. Each says what has to happen first; move it into
    TOOLS (in this order) once that is done. Pages never render this list. */
export const HELD_TOOLS: (Tool & { holdUntil: string })[] = [
  {
    slug: 'viral-posts-field-report',
    name: 'How I used AI to study viral posts',
    text: 'A field report on 19 reels with over a million plays each. See what they share and the exact prompts I used.',
    platform: 'PDF, no email needed',
    cta: 'Read the report',
    href: '/viral-post-heist.pdf',
    holdUntil: 'The PDF cover line still carries an old job title. Show this card once the cover reads: Neil Busque, Field report 001.',
  },
];

/* ------------------------------------------------------------------ proof */

export interface Quote {
  /** The exact approved words. */
  quote: string;
  /** Generic role label. Never a company. */
  role: string;
  /** A first name, only if Neil approves one. */
  name?: string;
}

/** Approved quotes, verbatim, with role labels only: no names, stars or avatars. */
export const QUOTES: Quote[] = [
  { quote: 'You pick up tasks so quickly, deliver ahead of schedule, and always exceed expectations.', role: 'Med spa team, about 25 landing pages' },
  { quote: '...outperforming our previous ones and bringing in more leads and bookings than we ever imagined.', role: 'Same med spa team, on the new pages' },
  { quote: "You're the man Neil! I already love working with you", role: 'Client' },
  { quote: 'Very happy with the way this design is coming out.', role: 'Client, brand and site design' },
];

export interface Stat {
  /** The number as it should read, for example "40+". */
  value: string;
  caption: string;
  /** Where the number comes from. Internal: pages do not print it. A stat without one does not ship. */
  source: string;
}

export const STATS: Stat[] = [
  { value: '40+', caption: 'Products shipped in 2026, from apps to agents to automations.', source: "Neil's 2026 build log: more than 40 shipped apps, agents and automations" },
  { value: '3 days', caption: 'The longest it took to reach a working first version, across eight builds checked against their code history.', source: 'Git history of eight products, checked July 2026: every first version shipped in 3 days or less' },
  { value: '6', caption: 'Agencies and service businesses running on operating systems I build and look after.', source: 'Client operating systems built and still maintained in 2026' },
];

/* ------------------------------------------------------------------ home lists */

export interface Step {
  title: string;
  text: string;
}

/** Home "How it works". */
export const STEPS: Step[] = [
  { title: 'Send a message', text: "Tell me where your team loses time. I'll tell you what's worth handing to AI, and what isn't." },
  { title: 'Get a clear scope and price', text: "You see what I'll build, what it costs and when it'll be ready. Nothing starts until you say yes." },
  { title: 'See it working in days', text: 'You get a working first version fast. Click through it, tell me what to change, and it gets better each round.' },
  { title: 'Launch, then you choose', text: 'It goes live in your accounts, and you own it. I keep it running and add to it, or hand it to your team.' },
];

export interface FitLists {
  fitTitle: string;
  notFitTitle: string;
  fit: string[];
  notFit: string[];
}

/** Home "Who I work best with". */
export const FIT: FitLists = {
  fitTitle: 'A good fit if',
  notFitTitle: 'Not a fit if',
  fit: [
    'You run a growing business, and nobody on your team has time to own AI.',
    'Your team repeats the same tasks every week.',
    'You juggle too many tools and spreadsheets.',
    "You'd rather see a working version than read a long plan.",
    'You want AI that asks before anything risky.',
  ],
  notFit: [
    'You want a slide deck about AI, with nothing built.',
    'You expect AI to replace your whole team overnight.',
    'You want a big agency with layers of account managers.',
    "You won't have time to try early versions and give feedback.",
    'You need someone in your office every day.',
  ],
};

export interface Industry {
  name: string;
  href: string;
}

/** Home industries strip. Each links to its /software page. */
export const INDUSTRIES: Industry[] = [
  { name: 'Roofing', href: '/software/custom-software-for-roofing-companies' },
  { name: 'HVAC', href: '/software/custom-software-for-hvac-companies' },
  { name: 'Plumbing', href: '/software/custom-software-for-plumbing-companies' },
  { name: 'Dental', href: '/software/custom-software-for-dental-practices' },
  { name: 'Law firms', href: '/software/custom-software-for-law-firms' },
  { name: 'Med spas', href: '/software/custom-software-for-med-spas' },
  { name: 'Real estate', href: '/software/custom-software-for-real-estate-teams' },
  { name: 'Accounting', href: '/software/custom-software-for-accounting-firms' },
];

/** Home "Who you'll work with" facts. */
export const ABOUT_FACTS: DefRow[] = [
  { term: 'Based in', value: 'New Jersey, US Eastern time' },
  { term: 'Replies', value: 'Usually the same day' },
  { term: 'You own', value: 'The code and the accounts' },
];

export interface FaqItem {
  q: string;
  /** Plain text. A blank line starts a new paragraph. */
  a: string;
}

/** Home FAQ. */
export const FAQS: FaqItem[] = [
  {
    q: 'How much does it cost?',
    a: 'It depends on what we build. A single automation costs less than a full operating system. After a short talk, you get a clear scope and price, and no work starts until you say yes.',
  },
  {
    q: 'How long does it take?',
    a: "A working first version usually takes days. When I checked eight builds against their code history, every first version shipped in 3 days or less. Bigger systems take a few weeks, and you can use each part as soon as it's ready.",
  },
  {
    q: 'Who owns the code?',
    a: 'You do. The code and the accounts it runs on are in your name. If we ever stop working together, everything stays with you.',
  },
  {
    q: 'Can you work with the tools we already use?',
    a: "Yes. I connect what you already pay for, like your CRM, inbox, calendar and phone system. If a tool is holding you back, I'll say so, and we decide together whether to replace it.",
  },
  {
    q: 'What happens after launch?',
    a: "You choose. Keep me on each month to run and improve it, message me when something changes, or hand it to your team. You're never stuck renting it from me.",
  },
  {
    q: 'Do I need to be technical?',
    a: "No. Tell me how your business works, the way you'd explain it to a new hire. I handle the technical side and keep you posted in plain English.",
  },
];
