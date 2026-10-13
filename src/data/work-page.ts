/* Page-only copy and small overrides for /work, /free and /analyzer. The shared lists (projects,
   rows, tools, tab counts) live in src/data/site.ts; this file only holds what those pages add.
   Same rules as site.ts: no company, client, employer or product names, no dashes in copy,
   only true statements. */

import type { PaletteName } from '../lib/art';

/* ------------------------------------------------------------------ /work */

export const WORK_PAGE = {
  title: 'Work: AI agents, software and automations | Neil Busque',
  description:
    "AI agents, business operating systems, automations and sites I've built. Client names stay private, so each build is named for what it does.",
  h1: 'Built and',
  accent: 'launched.',
  lead: "Client systems, agency work and my own products, most from 2026. Names stay private, so each build is named for what it does. Where I can share a result, it's on the card.",
  moreTitle: 'More builds',
  moreLead: 'Smaller builds, internal tools and client work without a write-up.',
  moreColumns: ['Build', 'What it does', 'Type', 'Year'] as const,
};

/* ------------------------------------------------------------------ /free */

export const FREE_PAGE = {
  title: 'Free tools: landing page analyzer and more | Neil Busque',
  description:
    'Free tools I built: a landing page analyzer, a CRM with an AI assistant, a funnel simulator and more. Open them now, no sales call.',
  h1: 'Tools I built,',
  accent: 'free to use.',
  lead: 'Open any of them now. A few ask for a free account so they can save your work. None of them need a call with me.',
  whoLabel: "Who it's for",
  stepsLabel: 'How it works',
  gridTitle: 'More free tools',
  buildLine: 'I can build a tool like these around how your business works.',
  buildCta: 'Tell me what you need',
};

/** Palettes for the /free tool cards, so the row of four carries one dark picture at most. */
export const FREE_TOOL_PALETTES: Record<string, PaletteName> = {
  'landing-page-analyzer': 'mist',
  'crm-with-ai-follow-up': 'paper',
  'crm-live-demo': 'navy',
  'funnel-simulator': 'mist',
  'website-design-library': 'paper',
};

/* ------------------------------------------------------------------ /analyzer */

export const ANALYZER_PAGE = {
  title: 'Free Landing Page Analyzer | Neil Busque',
  description:
    'Paste a link to your page and get a score for speed, mobile and the parts that turn visitors into leads. Free, no signup to see your score.',
  h1: 'Score your landing page,',
  accent: 'free.',
  lead: 'Paste a link to your page. You get a score for speed, mobile and the parts that turn visitors into leads, like your headline, button, form and proof.',
  aboutTitle: 'What the score covers',
  checks: [
    { title: 'Speed', text: 'How fast the page loads on a phone, measured the way search engines measure it.' },
    { title: 'Mobile', text: 'Whether the page fits a phone screen, with text you can read and buttons you can tap.' },
    { title: 'Conversion', text: 'The parts that turn a visitor into a lead: headline, button, form, proof and more.' },
  ],
  fixLine: "If you'd rather not fix it yourself, I build pages that load fast and get visitors to book.",
  fixCta: 'See landing pages',
  fixHref: '/services/landing-pages',
};
