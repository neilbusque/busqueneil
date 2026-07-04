/**
 * Pure parser for a Google PageSpeed Insights v5 result → PsiResult.
 * Import-free (used by api/pagespeed.ts under node16 resolution).
 */
export interface PsiResult {
  source: 'psi';
  performance: number;      // 0-100
  lcp?: number;             // seconds
  cls?: number;             // unitless
  inp?: number;             // ms (INP field, else TBT lab)
  audits: {
    viewport?: boolean;
    tapTargets?: boolean;
    fontSize?: boolean;
    contentWidth?: boolean;
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function auditScore(audits: Record<string, unknown>, key: string): boolean | undefined {
  const a = audits[key];
  if (!isRecord(a) || typeof a.score !== 'number') return undefined;
  return a.score === 1;
}

function numericValue(audits: Record<string, unknown>, key: string): number | undefined {
  const a = audits[key];
  if (!isRecord(a) || typeof a.numericValue !== 'number') return undefined;
  return a.numericValue;
}

export function parsePsi(json: unknown): PsiResult | null {
  if (!isRecord(json)) return null;
  const lr = json.lighthouseResult;
  if (!isRecord(lr)) return null;
  const cats = lr.categories;
  const audits = lr.audits;
  if (!isRecord(cats) || !isRecord(audits)) return null;
  const perfCat = cats.performance;
  if (!isRecord(perfCat) || typeof perfCat.score !== 'number') return null;

  const lcpMs = numericValue(audits, 'largest-contentful-paint');
  const tbt = numericValue(audits, 'total-blocking-time');

  const result: PsiResult = {
    source: 'psi',
    performance: Math.round(perfCat.score * 100),
    audits: {
      viewport: auditScore(audits, 'viewport'),
      tapTargets: auditScore(audits, 'tap-targets'),
      fontSize: auditScore(audits, 'font-size'),
      contentWidth: auditScore(audits, 'content-width'),
    },
  };
  if (lcpMs !== undefined) result.lcp = Math.round((lcpMs / 1000) * 10) / 10;
  const cls = numericValue(audits, 'cumulative-layout-shift');
  if (cls !== undefined) result.cls = Math.round(cls * 100) / 100;
  if (tbt !== undefined) result.inp = Math.round(tbt);
  return result;
}
