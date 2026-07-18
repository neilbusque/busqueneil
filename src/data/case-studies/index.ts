import type { CaseStudy } from './types';
import { orbit } from './orbit';
import { lumen } from './lumen';
import { tandem } from './tandem';
import { suki } from './suki';
import { preflight } from './preflight';

/** Display order on /case-studies and for prev/next. */
export const caseStudies: CaseStudy[] = [orbit, lumen, tandem, suki, preflight];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export * from './types';
export type { CaseStudy };
