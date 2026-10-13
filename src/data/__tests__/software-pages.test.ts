import { describe, expect, it } from 'vitest';
import { softwarePages, type SoftwarePage } from '../software-pages';
import { flagged } from './banned';

/* Guards for the 57 /software pages, so the old offer and the old names cannot come back. */

/** Every string a visitor can read on the page: meta, head, sections and FAQ. */
function pageStrings(p: SoftwarePage): string[] {
  return [
    p.title,
    p.metaDescription,
    p.h1,
    p.lede,
    ...p.sections.flatMap((s) => [s.h2, ...s.body, ...(s.bullets ?? [])]),
    ...p.faq.flatMap((f) => [f.q, f.a]),
    p.guide?.label ?? '',
  ].filter(Boolean);
}

/* Offer terms from the retired monthly offer. Market prices inside the decision pages (what
   SaaS or an agency charges) are fine; Neil's own price, refund and delivery promise are not. */
const OFFER_TERMS = [
  /\b4,?000\b/,
  /refund/i,
  /month one/i,
  /\b14[- ]days?\b/i,
  /\bseats?\b/i,
  /offer\.busqueneil/i,
  /free call/i,
  /cancel any month/i,
];

describe('software pages', () => {
  it('has the 57 pages with unique slugs', () => {
    expect(softwarePages).toHaveLength(57);
    expect(new Set(softwarePages.map((p) => p.slug)).size).toBe(softwarePages.length);
  });

  it('carries no offer terms', () => {
    const hits = softwarePages.flatMap((p) =>
      pageStrings(p)
        .filter((s) => OFFER_TERMS.some((re) => re.test(s)))
        .map((s) => `${p.slug}: ${s.slice(0, 80)}`),
    );
    expect(hits).toEqual([]);
  });

  it('uses no em dashes, en dashes or middots', () => {
    const hits = softwarePages.flatMap((p) =>
      pageStrings(p)
        .filter((s) => /[\u2013\u2014\u00b7]/.test(s))
        .map((s) => `${p.slug}: ${s.slice(0, 80)}`),
    );
    expect(hits).toEqual([]);
  });

  it('names no company, person, persona or product', () => {
    const hits = softwarePages.flatMap((p) => pageStrings(p).filter(flagged).map((s) => `${p.slug}: ${s.slice(0, 80)}`));
    expect(hits).toEqual([]);
  });
});
