/**
 * Landing-page analyzer report types + validation.
 *
 * Ported from the funnel-sim sibling project's analyzer.ts, trimmed to
 * landing-page scope: no funnel graph, no patch/edit machinery. Findings
 * here are read-only teardown items — there is nothing to "apply" to a page.
 *
 * Standalone module: no imports from other analyzer files.
 */

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type FindingSeverity = 'critical' | 'major' | 'minor';

export interface AnalysisFinding {
  id: string;
  severity: FindingSeverity;
  section: string;
  issue: string;
  why: string;
  fix: string;
}

export interface AnalysisSection { title: string; score: number; findingIds: string[] }

export interface AnalysisBenchmarkRow {
  metric: string;
  yours: string;
  benchmark: string;
  source: string;
  delta: 'above' | 'near' | 'below';
}

export interface AnalysisReport {
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  verdict: string;
  sections: AnalysisSection[];
  findings: AnalysisFinding[];
  quickWins: string[];
  benchmarks?: AnalysisBenchmarkRow[];
}

// ---------------------------------------------------------------------------
// validateReport
// ---------------------------------------------------------------------------

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function gradeForScore(score: number): AnalysisReport['grade'] {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 65) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

const SEVERITIES = new Set<FindingSeverity>(['critical', 'major', 'minor']);
const DELTAS = new Set(['above', 'near', 'below']);

/**
 * Validates and sanitises the raw JSON the AI returned for a landing-page
 * analysis. Philosophy mirrors validateAiGraph: throw on hard structural
 * failures, silently repair/drop soft ones (AI output is best-effort).
 */
export function validateReport(raw: unknown): AnalysisReport {
  if (!isRecord(raw)) throw new Error('Invalid analysis: response is not an object');
  if (typeof raw.overallScore !== 'number' || !Number.isFinite(raw.overallScore)) {
    throw new Error('Invalid analysis: missing overallScore');
  }
  if (typeof raw.verdict !== 'string' || !raw.verdict) throw new Error('Invalid analysis: missing verdict');
  if (!Array.isArray(raw.sections)) throw new Error('Invalid analysis: missing sections');
  if (!Array.isArray(raw.findings) || raw.findings.length === 0) {
    throw new Error('Invalid analysis: missing findings');
  }

  const overallScore = clamp(Math.round(raw.overallScore), 0, 100);
  // Grade always mirrors the clamped score — a valid-but-contradictory AI
  // grade (e.g. 85 + "F") must not survive.
  const grade = gradeForScore(overallScore);

  const findings: AnalysisFinding[] = [];
  for (const f of raw.findings) {
    if (!isRecord(f)) continue;
    const id = typeof f.id === 'string' ? f.id : '';
    const issue = typeof f.issue === 'string' ? f.issue : '';
    const why = typeof f.why === 'string' ? f.why : '';
    const fix = typeof f.fix === 'string' ? f.fix : '';
    if (!id || !issue || !why || !fix) continue;
    const severity = SEVERITIES.has(f.severity as FindingSeverity)
      ? (f.severity as FindingSeverity)
      : 'minor';
    findings.push({
      id,
      severity,
      section: typeof f.section === 'string' ? f.section : '',
      issue,
      why,
      fix,
    });
  }
  if (findings.length === 0) throw new Error('Invalid analysis: no usable findings');

  const findingIdSet = new Set(findings.map(f => f.id));

  const sections: AnalysisSection[] = [];
  for (const s of raw.sections) {
    if (!isRecord(s) || typeof s.title !== 'string' || typeof s.score !== 'number') continue;
    const ids = Array.isArray(s.findingIds)
      ? (s.findingIds as unknown[]).filter((x): x is string => typeof x === 'string' && findingIdSet.has(x))
      : [];
    sections.push({ title: s.title, score: clamp(Math.round(s.score), 0, 100), findingIds: ids });
  }

  const quickWins = Array.isArray(raw.quickWins)
    ? (raw.quickWins as unknown[]).filter((x): x is string => typeof x === 'string' && findingIdSet.has(x))
    : [];

  let benchmarks: AnalysisBenchmarkRow[] | undefined;
  if (Array.isArray(raw.benchmarks)) {
    const rows = (raw.benchmarks as unknown[])
      .filter(isRecord)
      .filter(
        b =>
          typeof b.metric === 'string' &&
          typeof b.yours === 'string' &&
          typeof b.benchmark === 'string' &&
          typeof b.source === 'string' &&
          DELTAS.has(b.delta as string),
      )
      .map(b => ({
        metric: b.metric as string,
        yours: b.yours as string,
        benchmark: b.benchmark as string,
        source: b.source as string,
        delta: b.delta as AnalysisBenchmarkRow['delta'],
      }));
    if (rows.length > 0) benchmarks = rows;
  }

  return { overallScore, grade, verdict: raw.verdict, sections, findings, quickWins, ...(benchmarks ? { benchmarks } : {}) };
}
