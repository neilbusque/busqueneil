/** Case study data model for busqueneil.com/case-studies
 *  One file per product under src/data/case-studies/<slug>.ts
 *  Registered in src/data/case-studies/index.ts
 */

/** Where every "book a call" CTA points. Swap in one place. */
export const BOOKING_URL = 'https://talk.busqueneil.com';
export const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=9083164140';
export const EMAIL_URL = 'mailto:busqueneil@gmail.com';

export interface Fact {
  /** short mono key, e.g. "Role", "Timeline", "Stack" */
  k: string;
  v: string;
}

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

/** An engineering war story: the interesting part. */
export interface HardPart {
  title: string;
  /** the constraint or failure */
  problem: string;
  /** what was actually done */
  solution: string;
}

export interface Section {
  title: string;
  /** paragraphs, plain text (no markdown) */
  body: string[];
}

export interface CaseStudy {
  slug: string;
  /** product name, e.g. "Orbit" */
  name: string;
  /** 4-8 words, appears under the name */
  tagline: string;
  /** e.g. "SaaS · CRM", "Consumer PWA" */
  category: string;
  /** e.g. "2026" */
  year: string;
  /** e.g. "Live in production" */
  status: string;
  liveUrl?: string;
  /** one sentence for the index card and meta description */
  summary: string;
  /** the page's opening paragraph, 2-3 sentences */
  lede: string;

  facts: Fact[];
  stack: string[];
  metrics?: Metric[];

  /** why it exists */
  problem: Section;
  /** the thinking: what was decided and why */
  approach: Section;
  /** how it got built, in order */
  timeline: Milestone[];
  /** what it does */
  features: FeatureGroup[];
  /** the genuinely hard engineering */
  hardParts: HardPart[];
  /** where it landed */
  outcome: Section;
  /** transferable takeaways, one line each */
  lessons: string[];
  /** the bridge into the CTA: what this proves I can build for you */
  proof: string;
}
