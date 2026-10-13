/** Case study data model for busqueneil.com/case-studies/<slug>.
 *  One file per build under src/data/case-studies/<file>.ts, registered in index.ts.
 *  The repo is public, so: no company, client or product names in any visible string (the H1
 *  is a descriptive title, the URL slug stays as it was), no personal details, no prices or
 *  offer terms, no dashes in copy, and only claims that can be checked.
 */
import type { PaletteName } from '../../lib/art';

/** WhatsApp with the US country code. Prefer the helpers in src/data/site.ts in new code. */
export const WHATSAPP_URL = 'https://wa.me/19083164140';
/** The booking page (secondary to WhatsApp). */
export const BOOKING_URL = 'https://book.busqueneil.com';
export const EMAIL_URL = 'mailto:busqueneil@gmail.com';

export interface Metric {
  value: string;
  label: string;
}

/** A dated milestone in the build. */
export interface Milestone {
  when: string;
  title: string;
  what: string;
}

/** A grouped capability list. */
export interface FeatureGroup {
  group: string;
  items: string[];
}

/** An engineering problem worth telling. */
export interface HardPart {
  title: string;
  /** the constraint or failure */
  problem: string;
  /** what was actually done */
  solution: string;
}

export interface Section {
  /** paragraphs, plain text (no markdown) */
  body: string[];
}

/** The four cells under the page head. */
export interface CaseFacts {
  whoFor: string;
  built: string;
  timeline: string;
  stack: string;
}

export interface CaseStudy {
  /** URL slug. Kept from the original pages so every link keeps working. */
  slug: string;
  /** The H1: named for what it does, never a product or client name. */
  title: string;
  /** Visible category, one of the work page's: AI agents, Software, Automations, Sites and funnels. */
  category: string;
  year: string;
  /** Live product, used only as a link target ("Open the live app"). Never printed. */
  liveUrl?: string;
  /** One or two sentences for the next-project card and the meta description fallback. */
  summary: string;
  /** <title> front half, about 46 characters or fewer (" | Neil Busque" is appended). */
  seoTitle: string;
  /** Meta description, 155 characters or fewer. */
  seoDescription: string;
  /** The page's opening paragraph, two or three sentences. */
  lede: string;
  facts: CaseFacts;
  /** Full stack, for the schema keywords. */
  stack: string[];
  /** Real, sourced numbers only. Three or four, so the ruled row fills. */
  metrics?: Metric[];
  /** The situation: why it exists. */
  problem: Section;
  /** What I built: the decisions and why. */
  approach: Section;
  /** How it came together, in order. */
  timeline: Milestone[];
  /** What it does. */
  features: FeatureGroup[];
  /** The engineering that was hard. */
  hardParts: HardPart[];
  /** What changed: where it landed. */
  outcome: Section;
  /** Transferable takeaways, one line each. */
  lessons: string[];
  /** The bridge into the ask: what this shows I can build for you. */
  proof: string;
  /** Art palette for the page image, to balance neighbors. */
  palette?: PaletteName;
}
