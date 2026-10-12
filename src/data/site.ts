/* Shared strings and lists for the public site: the one place to change contact details, nav,
   the closing ask, footer columns and the lists that pages render.

   Rules for everything in this file (the repo is public):
   - No company, client or employer names anywhere, including slugs, alt text and seeds.
   - No em dashes or en dashes. Plain, short sentences.
   - Only true statements. Quotes and stats stay empty until real, approved ones exist.

   The arrays marked "example entries" hold one or two sensible rows so components render.
   The copy deck replaces them. */

import type { ArtLayout, PaletteName } from '../lib/art';

/* ------------------------------------------------------------------ identity and channels */

export const SITE = {
  name: 'Neil Busque',
  url: 'https://busqueneil.com',
  email: 'busqueneil@gmail.com',
  /** Digits only, country code first, as wa.me expects. */
  whatsapp: '19083164140',
  whatsappDisplay: '+1 908 316 4140',
  linkedin: 'https://www.linkedin.com/in/neilbusque/',
  linkedinDisplay: 'in/neilbusque',
  booking: 'https://book.busqueneil.com/',
  timezone: 'US Eastern',
} as const;

/** WhatsApp chat link with an optional prefilled message. */
export function waUrl(text?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  const t = text?.trim();
  return t ? `${base}?text=${encodeURIComponent(t)}` : base;
}

/** mailto link with an optional subject. */
export function mailUrl(subject?: string): string {
  const s = subject?.trim();
  return s ? `mailto:${SITE.email}?subject=${encodeURIComponent(s)}` : `mailto:${SITE.email}`;
}

/** Message used when a visitor taps a general "message me" button. */
export const WA_HELLO = 'Hi Neil, I want to build something.';
/** Prefix for the prompt card. The visitor's text follows it. */
export const WA_PROMPT_PREFIX = 'Hi Neil, I want to build: ';

export interface LinkItem {
  label: string;
  href: string;
}

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

/** The small primary button in the nav. Opens WhatsApp in a new tab. */
export const NAV_CTA = {
  label: 'Start a project',
  /** Shown instead of `label` on very narrow phones, where the full label does not fit. */
  labelShort: 'Message me',
  message: 'Hi Neil, I want to start a project.',
} as const;

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

export const CHANNELS: Channel[] = [
  { key: 'whatsapp', label: 'WhatsApp', value: SITE.whatsappDisplay, href: waUrl(WA_HELLO) },
  { key: 'email', label: 'Email', value: SITE.email, href: mailUrl() },
  { key: 'booking', label: 'Book a call', value: 'Pick a time', href: SITE.booking },
  { key: 'linkedin', label: 'LinkedIn', value: SITE.linkedinDisplay, href: SITE.linkedin },
];

/* ------------------------------------------------------------------ closing band */

export interface ClosingCopy {
  title: string;
  lead: string;
  primary: LinkItem;
  secondary: LinkItem;
}

export const CLOSING: ClosingCopy = {
  title: 'Have something you want built?',
  lead: 'Send a rough idea. I reply with the questions I have and how I would approach it.',
  primary: { label: 'Message me on WhatsApp', href: waUrl(WA_HELLO) },
  secondary: { label: 'Book a call', href: SITE.booking },
};

/* ------------------------------------------------------------------ footer */

export const FOOTER_TAGLINE = 'AI agents, custom software, automations and AI-powered sites for small teams.';

export interface FooterColumn {
  title: string;
  links: LinkItem[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Services',
    links: [
      { label: 'AI agents', href: '/services/ai-agent-development' },
      { label: 'Custom software', href: '/services/web-apps' },
      { label: 'Automations', href: '/services/ai-automation-services' },
      { label: 'AI sites and funnels', href: '/services/websites' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Guides', href: '/resources' },
      { label: 'Comparisons', href: '/compare' },
      { label: 'Research', href: '/research' },
      { label: 'Notes', href: '/blog' },
    ],
  },
  {
    title: 'More',
    links: [
      { label: 'Work', href: '/work' },
      { label: 'Free tools', href: '/free' },
      { label: 'About', href: '/story' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

/* ------------------------------------------------------------------ prompt card */

/** Suggestion chips. Up to three show on desktop, two on phones. Each fills the input. */
export const PROMPT_CHIPS: string[] = ['An agent that answers leads', 'A custom CRM', 'Automate follow-ups'];

/* ------------------------------------------------------------------ lists the copy deck fills */

/** Optional real image for any record that renders art. Same frame and ratio as the placeholder. */
export interface WithImage {
  image?: string;
  imageAlt?: string;
  /** Force a placeholder palette to balance neighbors on a page. */
  palette?: PaletteName;
  layout?: ArtLayout;
}

export interface Service extends WithImage {
  /** Stable key, also the art seed. */
  slug: string;
  name: string;
  /** One line on what it is. */
  line: string;
  href: string;
  /** "What you get" items. Shown on the large bento card and the services page. */
  items: string[];
}

/** The four services. Example lines until the copy deck lands. Two layouts are pinned so the
    four bento pictures differ; pass layout and palette through to the art. */
export const SERVICES: Service[] = [
  {
    slug: 'ai-agents',
    name: 'AI agents',
    line: 'Agents that answer leads, follow up and handle the busywork.',
    href: '/services/ai-agent-development',
    items: ['Built on your tools and data', 'Clear rules for what it can and cannot do', 'A person stays in the loop where it matters'],
  },
  {
    slug: 'custom-software',
    name: 'Custom software',
    line: 'CRMs, portals and internal tools built around how you work.',
    href: '/services/web-apps',
    items: ['Logins, roles and real data', 'You own the code and the accounts', 'Changes are a message, not a ticket'],
    layout: 'stair',
  },
  {
    slug: 'automations',
    name: 'Automations',
    line: 'Connect the apps you already use and remove the manual steps.',
    href: '/services/ai-automation-services',
    items: ['Lead intake and follow-up', 'CRM sync and reporting', 'Alerts when something breaks'],
  },
  {
    slug: 'ai-sites',
    name: 'AI sites and funnels',
    line: 'Fast pages and funnels wired to your CRM and follow-up.',
    href: '/services/websites',
    items: ['Copy included', 'Forms, booking and tracking', 'Built to load fast on phones'],
    layout: 'skyline',
  },
];

export type ProjectType = 'agents' | 'software' | 'automations' | 'sites';

export interface Project extends WithImage {
  /** Stable key, also the art seed. A generic descriptor, never a client or product name. */
  slug: string;
  /** Generic descriptor, for example "Operating system for a marketing agency". */
  title: string;
  /** One or two lines of context. */
  text: string;
  /** Small label, left of the meta row. */
  category: string;
  /** Filter key for the work page tabs. */
  type: ProjectType;
  year: string;
  href: string;
  /** A real, checkable outcome. Leave out when there is none. */
  outcome?: string;
  /** What was built, three short items. Used by the featured split. */
  built?: string[];
  /** Stack as one plain line, comma separated. */
  stack?: string;
}

/** Example entries until the copy deck lands. */
export const PROJECTS: Project[] = [
  {
    slug: 'crm-with-ai-follow-up',
    title: 'CRM where an AI assistant does the follow-up',
    text: 'Contacts, deals, inbox and booking in one place, with an assistant that drafts and sends the next step.',
    category: 'Custom software',
    type: 'software',
    year: '2026',
    href: '/work',
    built: ['Inbox for email, SMS and chat', 'Booking pages and forms', 'An assistant that works through the CRM'],
    stack: 'TypeScript, Postgres, an LLM with tool use',
  },
  {
    slug: 'funnel-simulator',
    title: 'Funnel simulator with an AI audit',
    text: 'Click through ads, pages, booking and follow-up before spending on traffic.',
    category: 'AI sites and funnels',
    type: 'sites',
    year: '2026',
    href: '/work',
  },
];

export interface Tool extends WithImage {
  slug: string;
  name: string;
  /** One line on what it does. */
  text: string;
  /** For example "Web app", "Mac app", "Chrome extension". */
  platform: string;
  /** Only true when it is actually free to use. */
  free: boolean;
  href: string;
}

/** Example entries until the copy deck lands. */
export const TOOLS: Tool[] = [
  {
    slug: 'landing-page-analyzer',
    name: 'Landing page analyzer',
    text: 'Scores a landing page and emails you a PDF of what to fix.',
    platform: 'Web app',
    free: true,
    href: '/analyzer',
  },
];

export interface Quote {
  /** The exact approved words. */
  quote: string;
  /** A first name or a generic role. Never a company. */
  name?: string;
  role?: string;
}

/** Real, approved quotes only, with client names removed. Empty until Neil approves some. */
export const QUOTES: Quote[] = [];

export interface Stat {
  /** The number as it should read, for example "3 of 30". */
  value: string;
  caption: string;
  /** Where the number comes from. Required: a stat without a source does not ship. */
  source: string;
}

/** Real, sourced numbers only. Example entries come from Neil's own published study. */
export const STATS: Stat[] = [
  { value: '3 of 30', caption: 'custom software companies publish a price in their ads', source: 'My study of 866 ads, 2026' },
  { value: '4 of 30', caption: 'offer any kind of guarantee', source: 'My study of 866 ads, 2026' },
];

export interface Step {
  title: string;
  text: string;
}

/** How a project runs. Example entries from the current services page. */
export const STEPS: Step[] = [
  { title: 'One call', text: 'You tell me what is slow, broken or missing. I tell you honestly if I am the right fit.' },
  { title: 'Scope first', text: 'You see exactly what gets built and what does not, before anything starts.' },
  { title: 'Build', text: 'You see progress as it goes and can redirect it.' },
  { title: 'Launch', text: 'It goes live, you own it, and I am still reachable when something changes.' },
];

export interface FitLists {
  fit: string[];
  notFit: string[];
}

/** Who this is for. Example entries until the copy deck lands. */
export const FIT: FitLists = {
  fit: ['You have a process that eats hours every week', 'You want one person who builds and stays reachable'],
  notFit: ['You need a large team on site every day', 'You want the cheapest option, whatever it costs later'],
};

export interface Industry {
  name: string;
  href?: string;
}

/** Example entries. Each links to an existing industry page. */
export const INDUSTRIES: Industry[] = [
  { name: 'Roofing companies', href: '/software/custom-software-for-roofing-companies' },
  { name: 'Dental practices', href: '/software/custom-software-for-dental-practices' },
];

export interface FaqItem {
  q: string;
  /** Plain text. A blank line starts a new paragraph. */
  a: string;
}

/** Example entries from the current services page. */
export const FAQS: FaqItem[] = [
  {
    q: 'How much does a project cost?',
    a: 'It depends on scope, so I quote per project after the first call. Small automations and landing pages are the cheapest place to start.',
  },
  {
    q: 'Who owns the code?',
    a: 'You do. You own the code and the accounts, and nothing is locked behind a platform you have to keep renting from me.',
  },
];
