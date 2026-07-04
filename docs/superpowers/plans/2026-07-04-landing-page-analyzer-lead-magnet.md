# Free Landing Page Analyzer Lead Magnet — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a public, no-login landing-page analyzer lead magnet at busqueneil.com/analyzer (instant free teaser → email gate → AI teardown delivered as a branded PDF, lead pushed to Orbit) plus a site-wide exit-intent popup that deep-links into it.

**Architecture:** Fork the analyzer engine from Preflight (`funnel-sim`) into the busqueneil Astro repo. Two Node serverless API routes: `/api/analyzer/scan` (scrape + Google PageSpeed + a deterministic score, free) and `/api/analyzer/deliver` (email-gated: push to Orbit, ack, then run AI + render PDF + send via Resend in the background). Front end is two Preact islands.

**Tech Stack:** Astro 5 (`output: 'server'`, `@astrojs/vercel`, Node serverless), Preact islands, Google PageSpeed Insights v5, OpenRouter (Claude), Resend (email), `@react-pdf/renderer` (PDF), Supabase (operational log + caps), Orbit MCP (lead push), Vitest (tests).

## Global Constraints

- Repo: `busqueneil` brand site at `context/deliverables/neil/brand-site/`. Branch: `analyzer-lead-magnet` (already created).
- Astro API routes MUST export `export const prerender = false;` (server routes).
- Front-end components are **Preact**, not React. Use `preact/hooks`. Islands hydrate with `client:*` directives.
- `@react-pdf/renderer` is **server-only** (imported only from API/lib code, never a client island). Its `.tsx` file MUST start with `/** @jsxImportSource react */` because the project defaults to Preact JSX.
- **No em dashes** in any user-facing copy (page, popup, email, PDF). Use a comma, a period, or rewrite. (Neil's standing copy rule.)
- Deploy is **GitHub-first**, personal account `busqueneil@gmail.com`, **no Netlify**. Vercel auto-deploys from GitHub.
- Env access in routes/libs: `process.env[k] ?? (import.meta as any).env?.[k]` (matches existing `src/pages/api/agent.ts` `env()` helper).
- Reuse existing env: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`. New env (set in Vercel before deploy): `RESEND_API_KEY`, `ANALYZER_TOKEN_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `ORBIT_MCP_URL`, `ORBIT_MCP_KEY`, optional `PAGESPEED_API_KEY`, `ANALYZER_FROM`.
- Source of ported files: `context/deliverables/neil/funnel-sim/` (referred to below as `$FS`). Since it is a sibling project, copy file contents (do not import across repos).
- Spec: `docs/superpowers/specs/2026-07-04-landing-page-analyzer-lead-magnet-design.md`.

---

## File Structure

**Server libs** (`src/lib/analyzer/`):
- `scrapeExtract.ts` — HTML → ScrapedPage + AuditSignals (copied from `$FS/src/lib/scrapeExtract.ts`).
- `psiParse.ts` — PageSpeed Insights v5 → PsiResult (copied from `$FS/src/lib/psiParse.ts`).
- `audit.ts` — `PageAudit` type + `buildPageAudit`/`heuristicSpeedScore`/`conversionItems` (ported) + NEW `compositeScore`, `mobileScore`, `teaserSummary`.
- `report.ts` — `AnalysisReport` types + `validateReport` + `gradeForScore` (ported subset of `$FS/src/lib/analyzer.ts`).
- `prompt.ts` — `ANALYZER_PROMPT` string (copied from `$FS/api/ai.ts`).
- `ai.ts` — `runLandingAnalysis(audit, page)` → calls OpenRouter, returns validated `AnalysisReport`.
- `token.ts` — `signScan`/`verifyScan` HMAC scan token.
- `orbit.ts` — `upsertOrbitLead()` via Orbit MCP JSON-RPC.
- `email.ts` — `sendReportEmail()` via Resend with PDF attachment.
- `report-pdf.tsx` — react-pdf document + `renderReportPdf()` → Buffer.
- `caps.ts` — Supabase-backed lead insert + per-email/day + global/day cap checks; best-effort in-memory IP limiter.

**API routes** (`src/pages/api/analyzer/`): `scan.ts`, `deliver.ts`.

**Front end:** `src/pages/analyzer.astro`, `src/components/Analyzer.tsx`, `src/components/ExitIntentAnalyzer.tsx`; mount popup in `src/layouts/Base.astro`.

**DB:** `supabase/migrations/0003_analyzer_leads.sql`.

**Tests:** `src/lib/analyzer/__tests__/*.test.ts` + `vitest.config.ts`.

---

## Task 1: Test harness + port the pure extractors

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (add `test` script + devDeps)
- Create: `src/lib/analyzer/scrapeExtract.ts`, `src/lib/analyzer/psiParse.ts`
- Test: `src/lib/analyzer/__tests__/scrapeExtract.test.ts`, `src/lib/analyzer/__tests__/psiParse.test.ts`

**Interfaces:**
- Produces: `extractPage(html: string): ScrapedPage`, `extractSignals(html, bodyText): AuditSignals`, `parsePsi(json: unknown): PsiResult | null`. Types `ScrapedPage`, `AuditSignals`, `PsiResult`.

- [ ] **Step 1: Add Vitest**

Run: `cd context/deliverables/neil/brand-site && npm i -D vitest@^2`

- [ ] **Step 2: Add test script**

In `package.json` `"scripts"`, add: `"test": "vitest run"`.

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['src/**/*.test.ts'], environment: 'node' },
});
```

- [ ] **Step 4: Copy the two pure extractor files verbatim**

Copy `$FS/src/lib/scrapeExtract.ts` → `src/lib/analyzer/scrapeExtract.ts` and `$FS/src/lib/psiParse.ts` → `src/lib/analyzer/psiParse.ts`. No edits (both are already import-free and serverless-safe).

- [ ] **Step 5: Copy their tests verbatim**

Copy `$FS/src/lib/__tests__/psiParse.test.ts` → `src/lib/analyzer/__tests__/psiParse.test.ts`. Fix the relative import at the top to `../psiParse`. If `$FS` has no scrapeExtract test, create `src/lib/analyzer/__tests__/scrapeExtract.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { extractPage } from '../scrapeExtract';

describe('extractPage', () => {
  it('extracts title, headline and CTA signals from a simple landing page', () => {
    const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width">
      <title>Book a Free Audit</title><meta name="description" content="We book calls"></head>
      <body><h1>Get 10 booked calls this month</h1>
      <a href="/x">Book my free audit</a>
      <form><input type="email"></form>
      <p>Trusted by 200 clients. 5 star reviews.</p></body></html>`;
    const page = extractPage(html);
    expect(page.title).toBe('Book a Free Audit');
    expect(page.signals.hasViewportMeta).toBe(true);
    expect(page.signals.h1Count).toBe(1);
    expect(page.signals.ctaTexts.length).toBeGreaterThan(0);
    expect(page.signals.formCount).toBe(1);
    expect(page.signals.emailOrTelInput).toBe(true);
    expect(page.signals.hasSocialProof).toBe(true);
  });

  it('flags a thin (client-rendered) page', () => {
    const page = extractPage('<html><body><div id="root"></div></body></html>');
    expect(page.thin).toBe(true);
  });
});
```

- [ ] **Step 6: Run tests**

Run: `npm test`
Expected: PASS for both files.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/analyzer/scrapeExtract.ts src/lib/analyzer/psiParse.ts src/lib/analyzer/__tests__
git commit -m "feat(analyzer): test harness + ported page/PSI extractors"
```

---

## Task 2: PageAudit + deterministic score + teaser summary

**Files:**
- Create: `src/lib/analyzer/audit.ts`
- Test: `src/lib/analyzer/__tests__/audit.test.ts`

**Interfaces:**
- Consumes: `ScrapedPage`, `AuditSignals` (Task 1 `scrapeExtract`), `PsiResult` (Task 1 `psiParse`).
- Produces: `PageAudit` type; `buildPageAudit(scraped, psi): PageAudit`; `compositeScore(audit): number`; `mobileScore(audit): number`; `teaserSummary(audit): string`; `SCORE_WEIGHTS`.

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from 'vitest';
import { extractPage } from '../scrapeExtract';
import { buildPageAudit, compositeScore, mobileScore, teaserSummary } from '../audit';

const strong = extractPage(`<!doctype html><html><head><meta name="viewport" content="width=device-width">
  <title>T</title></head><body><h1>Get 10 booked calls this month</h1>
  <img src="hero.jpg"><a href="/x">Book my free audit</a>
  <form><input type="email"></form><p>Money back guarantee. Only 5 spots left. 5 star reviews from clients.</p></body></html>`);

describe('score', () => {
  it('mobileScore is 30 with no viewport', () => {
    const a = buildPageAudit(extractPage('<html><body><h1>x</h1></body></html>'), null);
    expect(mobileScore(a)).toBe(30);
  });
  it('mobileScore is 100 with viewport and no PSI audit failures', () => {
    expect(mobileScore(buildPageAudit(strong, null))).toBe(100);
  });
  it('compositeScore is 0..100 and weights conversion heaviest', () => {
    const s = compositeScore(buildPageAudit(strong, { source: 'psi', performance: 90, audits: {} }));
    expect(s).toBeGreaterThan(0);
    expect(s).toBeLessThanOrEqual(100);
  });
  it('teaserSummary names a missing element when conversion is weakest', () => {
    const weak = extractPage('<html><head><meta name="viewport" content="w"></head><body><p>hi</p></body></html>');
    const summary = teaserSummary(buildPageAudit(weak, { source: 'psi', performance: 95, audits: {} }));
    expect(summary.toLowerCase()).toContain('gap');
    expect(summary).not.toContain('—');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- audit`
Expected: FAIL ("Cannot find module '../audit'").

- [ ] **Step 3: Implement `audit.ts`**

Port `PageAudit`, `heuristicSpeedScore`, `conversionItems`, `buildPageAudit` verbatim from `$FS/src/lib/analyzer.ts` (lines defining `PageAudit` through `buildPageAudit`), changing imports to `./scrapeExtract` and `./psiParse`. Then append:

```ts
export const SCORE_WEIGHTS = { speed: 0.30, mobile: 0.20, conversion: 0.50 };

export function mobileScore(audit: PageAudit): number {
  if (!audit.mobile.hasViewportMeta) return 30;
  const anyFail =
    audit.mobile.tapTargetsOk === false ||
    audit.mobile.legibleFontOk === false ||
    audit.mobile.contentWidthOk === false;
  return anyFail ? 70 : 100;
}

function conversionPct(audit: PageAudit): number {
  return Math.round((audit.conversion.presentCount / audit.conversion.totalCount) * 100);
}

export function compositeScore(audit: PageAudit): number {
  const raw =
    SCORE_WEIGHTS.speed * audit.speed.score +
    SCORE_WEIGHTS.mobile * mobileScore(audit) +
    SCORE_WEIGHTS.conversion * conversionPct(audit);
  return Math.max(0, Math.min(100, Math.round(raw)));
}

/** One or two sentences, no em dashes, naming the single biggest gap. */
export function teaserSummary(audit: PageAudit): string {
  const speed = audit.speed.score;
  const mobile = mobileScore(audit);
  const conversion = conversionPct(audit);
  const dims = [
    { key: 'speed', val: speed },
    { key: 'mobile', val: mobile },
    { key: 'conversion', val: conversion },
  ].sort((a, b) => a.val - b.val);
  const worst = dims[0];
  const missing = audit.conversion.items.filter(i => !i.present).map(i => i.label.toLowerCase());

  let lead: string;
  if (worst.key === 'conversion' && missing.length) {
    const two = missing.slice(0, 2);
    const verb = two.length > 1 ? 'are' : 'is';
    lead = `Your biggest gap is conversion: ${two.join(' and ')} ${verb} missing.`;
  } else if (worst.key === 'speed') {
    lead = `Your biggest gap is speed. It scores ${speed} out of 100, and slow pages lose sales.`;
  } else if (worst.key === 'mobile') {
    lead = `Your biggest gap is mobile. The page is not fully mobile friendly, and most traffic is on phones.`;
  } else {
    lead = `Solid fundamentals. The room to grow is a sharper offer and stronger proof.`;
  }
  const best = dims[dims.length - 1];
  const anchor =
    best.key === 'speed' && speed >= 80 ? ` Page speed is strong at ${speed}.` :
    conversion >= 78 ? ` Your conversion elements are mostly in place.` : '';
  return (lead + anchor).trim();
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- audit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/analyzer/audit.ts src/lib/analyzer/__tests__/audit.test.ts
git commit -m "feat(analyzer): PageAudit + deterministic composite score + teaser summary"
```

---

## Task 3: Report types + validateReport + analyzer prompt

**Files:**
- Create: `src/lib/analyzer/report.ts`, `src/lib/analyzer/prompt.ts`
- Test: `src/lib/analyzer/__tests__/report.test.ts`

**Interfaces:**
- Produces: `AnalysisReport`, `AnalysisFinding`, `AnalysisSection`, `AnalysisBenchmarkRow` types; `validateReport(raw): AnalysisReport`; `gradeForScore(n): 'A'|'B'|'C'|'D'|'F'`; `ANALYZER_PROMPT: string`.

- [ ] **Step 1: Create `report.ts`**

Port from `$FS/src/lib/analyzer.ts` **only** these exports and their private helpers (`clamp`, `isRecord`, `SEVERITIES`, `DELTAS`): the types `FindingSeverity`, `AnalysisFinding` (drop the `patch`/`nodeId`/`editInstruction`/`appliedAt` graph fields — landing scope has no graph), `AnalysisSection`, `AnalysisBenchmarkRow`, `AnalysisReport`; and functions `gradeForScore`, `validateReport`. Simplify `validateReport`'s signature to `validateReport(raw: unknown): AnalysisReport` (remove the `graph?` param and the `sanitisePatch` call — findings never carry patches here).

Keep the same validation philosophy: throw on missing `overallScore`/`verdict`/`sections`/`findings`; require at least one usable finding (id+issue+why+fix); grade always mirrors the clamped score.

- [ ] **Step 2: Create `prompt.ts`**

Copy the `ANALYZER_PROMPT` template-literal verbatim from `$FS/api/ai.ts` into:

```ts
export const ANALYZER_PROMPT = `...verbatim...`;
```

- [ ] **Step 3: Write test**

```ts
import { describe, it, expect } from 'vitest';
import { validateReport, gradeForScore } from '../report';

describe('validateReport', () => {
  it('clamps score, mirrors grade, keeps usable findings', () => {
    const r = validateReport({
      overallScore: 120, grade: 'F', verdict: 'v',
      sections: [{ title: 'Hook & headline', score: 40, findingIds: ['f1'] }],
      findings: [{ id: 'f1', severity: 'critical', section: 'Hook & headline', issue: 'i', why: 'w', fix: 'do x' }],
      quickWins: ['f1'],
    });
    expect(r.overallScore).toBe(100);
    expect(r.grade).toBe('A');
    expect(r.findings).toHaveLength(1);
  });
  it('throws when findings are empty', () => {
    expect(() => validateReport({ overallScore: 50, verdict: 'v', sections: [], findings: [] })).toThrow();
  });
  it('gradeForScore boundaries', () => {
    expect(gradeForScore(90)).toBe('A');
    expect(gradeForScore(49)).toBe('F');
  });
});
```

- [ ] **Step 4: Run**

Run: `npm test -- report`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/analyzer/report.ts src/lib/analyzer/prompt.ts src/lib/analyzer/__tests__/report.test.ts
git commit -m "feat(analyzer): report validation + analyzer prompt (landing scope)"
```

---

## Task 4: Scan token (HMAC)

**Files:**
- Create: `src/lib/analyzer/token.ts`
- Test: `src/lib/analyzer/__tests__/token.test.ts`

**Interfaces:**
- Produces: `signScan(payload, secret): string`; `verifyScan(token, secret): ScanPayload | null`; type `ScanPayload { url, audit, score, grade, iat }`.

- [ ] **Step 1: Write test**

```ts
import { describe, it, expect } from 'vitest';
import { signScan, verifyScan } from '../token';

const SECRET = 'test-secret';
const base = { url: 'https://x.com', audit: { a: 1 }, score: 62, grade: 'C' };

describe('scan token', () => {
  it('round-trips a valid token', () => {
    const t = signScan(base, SECRET);
    const v = verifyScan(t, SECRET);
    expect(v?.url).toBe('https://x.com');
    expect(v?.score).toBe(62);
  });
  it('rejects a tampered payload', () => {
    const t = signScan(base, SECRET);
    const [b64] = t.split('.');
    expect(verifyScan(`${b64}.deadbeef`, SECRET)).toBeNull();
  });
  it('rejects a wrong secret', () => {
    expect(verifyScan(signScan(base, SECRET), 'other')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- token`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `token.ts`**

```ts
import crypto from 'node:crypto';

const TTL_MS = 30 * 60 * 1000;

export interface ScanPayload {
  url: string;
  audit: unknown;
  score: number;
  grade: string;
  iat: number;
}

export function signScan(payload: Omit<ScanPayload, 'iat'>, secret: string): string {
  const body = JSON.stringify({ ...payload, iat: Date.now() });
  const b64 = Buffer.from(body).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

export function verifyScan(token: string, secret: string): ScanPayload | null {
  const [b64, sig] = (token || '').split('.');
  if (!b64 || !sig) return null;
  const expected = crypto.createHmac('sha256', secret).update(b64).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload: ScanPayload;
  try { payload = JSON.parse(Buffer.from(b64, 'base64url').toString()); } catch { return null; }
  if (typeof payload.iat !== 'number' || Date.now() - payload.iat > TTL_MS) return null;
  return payload;
}
```

- [ ] **Step 4: Run**

Run: `npm test -- token`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/analyzer/token.ts src/lib/analyzer/__tests__/token.test.ts
git commit -m "feat(analyzer): HMAC-signed scan token"
```

---

## Task 5: OpenRouter analyze helper

**Files:**
- Create: `src/lib/analyzer/ai.ts`

**Interfaces:**
- Consumes: `ANALYZER_PROMPT` (Task 3), `validateReport` (Task 3), `PageAudit` (Task 2), `ScrapedPage` (Task 1).
- Produces: `runLandingAnalysis(audit: PageAudit, page: ScrapedPage): Promise<AnalysisReport>`.

- [ ] **Step 1: Implement `ai.ts`**

Adapt the OpenRouter call + user-message assembly from `$FS/api/ai.ts` (the `analyze` branch and `callOpenRouter`), hard-coded to landing scope, no JWT, no daily-cap RPC (caps live in Task 8/deliver):

```ts
import { ANALYZER_PROMPT } from './prompt';
import { validateReport, type AnalysisReport } from './report';
import type { PageAudit } from './audit';
import type { ScrapedPage } from './scrapeExtract';

const env = (k: string) => process.env[k] ?? (import.meta as any).env?.[k];

function buildUserMessage(audit: PageAudit, page: ScrapedPage): string {
  const present = audit.conversion.items.filter(i => i.present).map(i => i.label);
  const missing = audit.conversion.items.filter(i => !i.present).map(i => i.label);
  const sp = audit.speed, mob = audit.mobile;
  return [
    `Analyze this landing page for conversion. Scope: landing.`,
    `CONTEXT:`,
    `  Goal: leads`,
    `  NOTE: niche/offer not given. Infer them from the ASSET; open the verdict by stating who this is for and what is being sold.`,
    `MEASURED SIGNALS (deterministic — trust these over your own guesses):`,
    `  Page speed: ${sp.score}/100 (${sp.source})${sp.lcp !== undefined ? `, LCP ${sp.lcp}s` : ''}${sp.cls !== undefined ? `, CLS ${sp.cls}` : ''}${sp.inp !== undefined ? `, INP ${sp.inp}ms` : ''}`,
    `  Mobile: viewport ${mob.hasViewportMeta ? 'present' : 'MISSING'}${mob.tapTargetsOk === false ? ', tap targets FAIL' : ''}${mob.legibleFontOk === false ? ', font size FAIL' : ''}`,
    `  Conversion elements PRESENT: ${present.join(', ') || 'none'}`,
    `  Conversion elements MISSING: ${missing.join(', ') || 'none'}`,
    `Factor these into the "Speed & mobile" section and the overall score. Missing critical elements (headline, CTA, form) are findings.`,
    `ASSET — scraped live page:`,
    `  Title: ${page.title}`,
    `  Meta description: ${page.metaDescription}`,
    `  Headings: ${page.headings.join(' | ')}`,
    `  Page text: ${page.text}`,
    page.thin ? `  NOTE: the page appears client-rendered; content above is limited. Say so in the verdict.` : '',
    `Do not emit patch or nodeId fields (no graph was sent) — put full rewrites in "fix".`,
    `Return ONLY the JSON report matching the contract.`,
  ].filter(Boolean).join('\n');
}

async function callOpenRouter(messages: Array<{ role: string; content: string }>): Promise<string | null> {
  const apiKey = env('OPENROUTER_API_KEY');
  const model = env('OPENROUTER_MODEL') || 'anthropic/claude-sonnet-4.6';
  if (!apiKey) throw new Error('OPENROUTER_API_KEY missing');
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 45000);
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST', signal: ctl.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages, response_format: { type: 'json_object' }, max_tokens: 6000 }),
    });
    if (!res.ok) return null;
    const j = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    return j.choices?.[0]?.message?.content ?? null;
  } finally {
    clearTimeout(timer);
  }
}

export async function runLandingAnalysis(audit: PageAudit, page: ScrapedPage): Promise<AnalysisReport> {
  const messages = [
    { role: 'system', content: ANALYZER_PROMPT },
    { role: 'user', content: buildUserMessage(audit, page) },
  ];
  let content = await callOpenRouter(messages);
  if (!content) throw new Error('ai unavailable');
  try {
    return validateReport(JSON.parse(content));
  } catch {
    const retry = await callOpenRouter([
      ...messages,
      { role: 'assistant', content },
      { role: 'user', content: 'Your previous reply was not valid JSON. Reply with ONLY the JSON object.' },
    ]);
    if (!retry) throw new Error('ai unavailable');
    return validateReport(JSON.parse(retry));
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npx astro check --minimumSeverity error 2>/dev/null || npx tsc --noEmit -p tsconfig.json`
Expected: no errors in `src/lib/analyzer/ai.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/analyzer/ai.ts
git commit -m "feat(analyzer): OpenRouter landing analysis helper"
```

---

## Task 6: `/api/analyzer/scan` endpoint

**Files:**
- Create: `src/pages/api/analyzer/scan.ts`

**Interfaces:**
- Consumes: `extractPage` (Task 1), `parsePsi` (Task 1), `buildPageAudit`/`compositeScore`/`teaserSummary` (Task 2), `gradeForScore` (Task 3), `signScan` (Task 4).
- Produces: `POST /api/analyzer/scan` — body `{ url }` → `200 { audit, score, grade, summary, scanToken }` | `400 invalid-url` | `429` | `502 unreachable`.

- [ ] **Step 1: Implement the endpoint**

```ts
import type { APIRoute } from 'astro';
import { extractPage } from '../../../lib/analyzer/scrapeExtract';
import { parsePsi } from '../../../lib/analyzer/psiParse';
import { buildPageAudit, compositeScore, teaserSummary } from '../../../lib/analyzer/audit';
import { gradeForScore } from '../../../lib/analyzer/report';
import { signScan } from '../../../lib/analyzer/token';

export const prerender = false;
const env = (k: string) => process.env[k] ?? (import.meta as any).env?.[k];

// Best-effort per-instance IP limiter (10 / hour). Real cost gate is the
// email-gated deliver endpoint; this just blunts casual abuse of the free scan.
const hits = new Map<string, number[]>();
function rateOk(ip: string): boolean {
  const now = Date.now(), win = 3600_000, cap = 10;
  const arr = (hits.get(ip) ?? []).filter(t => now - t < win);
  if (arr.length >= cap) { hits.set(ip, arr); return false; }
  arr.push(now); hits.set(ip, arr); return true;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

async function fetchPsi(url: string): Promise<ReturnType<typeof parsePsi>> {
  const params = new URLSearchParams();
  params.set('url', url); params.set('strategy', 'mobile');
  for (const c of ['performance', 'best-practices', 'seo']) params.append('category', c);
  const key = env('PAGESPEED_API_KEY');
  if (key) params.set('key', key);
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 40000);
  try {
    const r = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`, { signal: ctl.signal });
    if (!r.ok) return null;
    return parsePsi(await r.json());
  } catch { return null; } finally { clearTimeout(timer); }
}

async function fetchHtml(url: string): Promise<string | null> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 10000);
  try {
    const r = await fetch(url, {
      redirect: 'follow', signal: ctl.signal,
      headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 Busqueneil-Analyzer', accept: 'text/html,application/xhtml+xml' },
    });
    if (!r.ok) return null;
    return await r.text();
  } catch { return null; } finally { clearTimeout(timer); }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!rateOk(clientAddress || 'unknown')) return json({ error: 'Too many scans. Try again later.' }, 429);
  const secret = env('ANALYZER_TOKEN_SECRET');
  if (!secret) return json({ error: 'server misconfigured' }, 500);

  let url = '';
  try { url = (await request.json())?.url ?? ''; } catch { /* noop */ }
  let parsed: URL;
  try { parsed = new URL(url.startsWith('http') ? url : `https://${url}`); }
  catch { return json({ error: 'invalid-url' }, 400); }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return json({ error: 'invalid-url' }, 400);

  const [html, psi] = await Promise.all([fetchHtml(parsed.toString()), fetchPsi(parsed.toString())]);
  if (!html) return json({ error: 'unreachable' }, 502);

  const page = extractPage(html);
  const audit = buildPageAudit(page, psi);
  const score = compositeScore(audit);
  const grade = gradeForScore(score);
  const summary = teaserSummary(audit);
  const scanToken = signScan({ url: parsed.toString(), audit: { audit, page }, score, grade }, secret);

  return json({ audit, score, grade, summary, scanToken });
};
```

- [ ] **Step 2: Build to verify it compiles**

Run: `npm run build`
Expected: build succeeds (route compiled).

- [ ] **Step 3: Manual smoke test**

Run: `npm run dev` then in another shell:
`curl -s -X POST localhost:4321/api/analyzer/scan -H 'content-type: application/json' -d '{"url":"https://stripe.com"}' | head -c 400`
Expected: JSON with `score`, `grade`, `summary`, `audit`, `scanToken`. (Requires `ANALYZER_TOKEN_SECRET` in a local `.env`; set a dummy value.)

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/analyzer/scan.ts
git commit -m "feat(analyzer): public /api/analyzer/scan endpoint"
```

---

## Task 7: Supabase migration for the operational log

**Files:**
- Create: `supabase/migrations/0003_analyzer_leads.sql`

**Interfaces:**
- Produces: table `public.analyzer_leads(id, email, url, score, grade, delivered, created_at)`.

- [ ] **Step 1: Write the migration**

```sql
create table if not exists public.analyzer_leads (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  url         text not null,
  score       int  not null,
  grade       text not null,
  delivered   boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists analyzer_leads_email_idx on public.analyzer_leads (email, created_at desc);
create index if not exists analyzer_leads_created_idx on public.analyzer_leads (created_at desc);
alter table public.analyzer_leads enable row level security;
-- No anon/authenticated policies: only the service role (server) touches this table.
```

- [ ] **Step 2: Apply it**

Per `MEMORY.md → [[supabase-access]]`, apply the migration to the busqueneil Supabase project (personal token + `db push` workaround). Verify the table exists:
`select count(*) from public.analyzer_leads;` returns 0.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/0003_analyzer_leads.sql
git commit -m "feat(analyzer): analyzer_leads operational log table"
```

---

## Task 8: Caps + lead persistence helper

**Files:**
- Create: `src/lib/analyzer/caps.ts`

**Interfaces:**
- Consumes: `analyzer_leads` table (Task 7).
- Produces: `recordLead({email, url, score, grade}): Promise<{ ok: boolean; reason?: string }>` (inserts a row, enforces per-email/day and global/day caps via service-role REST); `markDelivered(email, url): Promise<void>`.

- [ ] **Step 1: Implement `caps.ts`**

```ts
const env = (k: string) => process.env[k] ?? (import.meta as any).env?.[k];

const PER_EMAIL_DAY = 3;
const GLOBAL_DAY = 300;

function sb() {
  const url = env('PUBLIC_SUPABASE_URL');
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return null;
  return { url, key, headers: { apikey: key, authorization: `Bearer ${key}`, 'content-type': 'application/json' } };
}
function since(): string { return new Date(Date.now() - 86400_000).toISOString(); }

export async function recordLead(l: { email: string; url: string; score: number; grade: string }): Promise<{ ok: boolean; reason?: string }> {
  const c = sb();
  if (!c) return { ok: false, reason: 'server misconfigured' };
  // Per-email/day cap.
  const eRes = await fetch(`${c.url}/rest/v1/analyzer_leads?select=id&email=eq.${encodeURIComponent(l.email)}&created_at=gte.${since()}`, { headers: { ...c.headers, Prefer: 'count=exact' } });
  const eCount = Number(eRes.headers.get('content-range')?.split('/')?.[1] ?? '0');
  if (eCount >= PER_EMAIL_DAY) return { ok: false, reason: 'daily-email-cap' };
  // Global/day cap.
  const gRes = await fetch(`${c.url}/rest/v1/analyzer_leads?select=id&created_at=gte.${since()}`, { headers: { ...c.headers, Prefer: 'count=exact' } });
  const gCount = Number(gRes.headers.get('content-range')?.split('/')?.[1] ?? '0');
  if (gCount >= GLOBAL_DAY) return { ok: false, reason: 'global-cap' };
  // Insert.
  const ins = await fetch(`${c.url}/rest/v1/analyzer_leads`, { method: 'POST', headers: c.headers, body: JSON.stringify(l) });
  return ins.ok ? { ok: true } : { ok: false, reason: 'insert-failed' };
}

export async function markDelivered(email: string, url: string): Promise<void> {
  const c = sb();
  if (!c) return;
  await fetch(`${c.url}/rest/v1/analyzer_leads?email=eq.${encodeURIComponent(email)}&url=eq.${encodeURIComponent(url)}`, {
    method: 'PATCH', headers: c.headers, body: JSON.stringify({ delivered: true }),
  });
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors in `caps.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/analyzer/caps.ts
git commit -m "feat(analyzer): lead persistence + per-email/global daily caps"
```

---

## Task 9: Orbit lead push

**Files:**
- Create: `src/lib/analyzer/orbit.ts`

**Interfaces:**
- Produces: `upsertOrbitLead({email, url, score, grade}): Promise<boolean>`.

- [ ] **Step 1: Implement `orbit.ts`**

```ts
const env = (k: string) => process.env[k] ?? (import.meta as any).env?.[k];

/** Upsert the visitor into Orbit CRM via its MCP JSON-RPC endpoint.
 *  ORBIT_MCP_URL = https://<orbit-project>.supabase.co/functions/v1/mcp
 *  ORBIT_MCP_KEY = orb_mcp_...  (must belong to a Pro/Team Orbit workspace) */
export async function upsertOrbitLead(l: { email: string; url: string; score: number; grade: string }): Promise<boolean> {
  const base = env('ORBIT_MCP_URL');
  const key = env('ORBIT_MCP_KEY');
  if (!base || !key) return false;
  const body = {
    jsonrpc: '2.0', id: 1, method: 'tools/call',
    params: {
      name: 'upsert_contact',
      arguments: {
        email: l.email,
        website: l.url,
        segment: 'lead_prospect',
        about: 'Landing-page analyzer lead',
        note: `Ran the free landing page analyzer on ${l.url} and scored ${l.score}/100 (grade ${l.grade}). Opted in for the full PDF breakdown. [analyzer-lead]`,
      },
    },
  };
  try {
    const res = await fetch(base, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) return false;
    const j: any = await res.json();
    return !j?.error && j?.result?.isError !== true;
  } catch { return false; }
}
```

- [ ] **Step 2: (Setup) obtain the Orbit MCP URL + key**

Find Neil's Orbit MCP endpoint + key from his MCP config (`~/.claude.json`, the `orbit` server entry) or by minting a new key in Orbit → Settings. Record `ORBIT_MCP_URL` and `ORBIT_MCP_KEY` to set in Vercel env. If the workspace is not Pro/Team, the key is rejected (403); note this to Neil so he can enable it, and the deliver flow will fall back to email-notify (Task 11).

- [ ] **Step 3: Commit**

```bash
git add src/lib/analyzer/orbit.ts
git commit -m "feat(analyzer): Orbit CRM lead upsert via MCP"
```

---

## Task 10: PDF document + Resend email

**Files:**
- Create: `src/lib/analyzer/report-pdf.tsx`, `src/lib/analyzer/email.ts`
- Modify: `package.json` (add `@react-pdf/renderer`, `react`, `react-dom`)

**Interfaces:**
- Consumes: `AnalysisReport` (Task 3), `PageAudit`/`mobileScore` (Task 2).
- Produces: `renderReportPdf(data): Promise<Buffer>`; `sendReportEmail({to, url, score, pdf}): Promise<boolean>`. `data` type `ReportPdfData { url, score, grade, audit, report }`.

- [ ] **Step 1: Add deps**

Run: `npm i @react-pdf/renderer react react-dom`

- [ ] **Step 2: Implement `report-pdf.tsx`** (note the required React JSX pragma)

```tsx
/** @jsxImportSource react */
import { Document, Page, Text, View, StyleSheet, Link, renderToBuffer } from '@react-pdf/renderer';
import type { AnalysisReport } from './report';
import type { PageAudit } from './audit';
import { mobileScore } from './audit';

export interface ReportPdfData {
  url: string; score: number; grade: string; audit: PageAudit; report: AnalysisReport;
}

const INK = '#0b0b12', VIOLET = '#7c3aed', MAGENTA = '#db2777', MUTE = '#6b7280', LINE = '#e5e7eb';
const s = StyleSheet.create({
  page: { padding: 44, fontSize: 10, color: INK, fontFamily: 'Helvetica', lineHeight: 1.5 },
  h1: { fontSize: 24, fontFamily: 'Helvetica-Bold' },
  h2: { fontSize: 13, fontFamily: 'Helvetica-Bold', marginTop: 18, marginBottom: 6, color: VIOLET },
  muted: { color: MUTE },
  scoreBig: { fontSize: 60, fontFamily: 'Helvetica-Bold', color: VIOLET },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottom: `1 solid ${LINE}`, paddingVertical: 4 },
  finding: { marginBottom: 10, paddingBottom: 8, borderBottom: `1 solid ${LINE}` },
  sevCrit: { color: MAGENTA, fontFamily: 'Helvetica-Bold' },
  cta: { marginTop: 10, padding: 10, backgroundColor: VIOLET, color: '#fff', borderRadius: 6, textAlign: 'center' },
});

function ReportDoc({ url, score, grade, audit, report }: ReportPdfData) {
  const conv = audit.conversion;
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.muted}>Landing Page Report</Text>
        <Text style={s.h1}>{url}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 12 }}>
          <Text style={s.scoreBig}>{score}</Text>
          <Text style={{ fontSize: 18, marginLeft: 6, marginBottom: 10 }}>/100  ·  Grade {grade}</Text>
        </View>

        <Text style={s.h2}>The four numbers</Text>
        <View style={s.metricRow}><Text>Page speed (Lighthouse mobile)</Text><Text>{audit.speed.score}/100</Text></View>
        <View style={s.metricRow}><Text>Mobile friendliness</Text><Text>{mobileScore(audit)}/100</Text></View>
        <View style={s.metricRow}><Text>Conversion elements present</Text><Text>{conv.presentCount}/{conv.totalCount}</Text></View>
        <View style={{ marginTop: 6 }}>
          {conv.items.map(i => (
            <Text key={i.key} style={s.muted}>{i.present ? '[x] ' : '[ ] '}{i.label}{i.detail ? ` — ${i.detail}` : ''}</Text>
          ))}
        </View>

        <Text style={s.h2}>The verdict</Text>
        <Text>{report.verdict}</Text>

        <Text style={s.h2}>Quick wins</Text>
        {report.quickWins.length
          ? report.findings.filter(f => report.quickWins.includes(f.id)).map(f => <Text key={f.id}>• {f.issue}</Text>)
          : <Text style={s.muted}>See the findings below.</Text>}
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.h2}>What to fix, in order</Text>
        {report.findings.map((f, n) => (
          <View key={f.id} style={s.finding}>
            <Text><Text style={f.severity === 'critical' ? s.sevCrit : undefined}>{n + 1}. [{f.severity}] {f.section}</Text></Text>
            <Text>Issue: {f.issue}</Text>
            <Text style={s.muted}>Why: {f.why}</Text>
            <Text>Fix: {f.fix}</Text>
          </View>
        ))}
        {report.benchmarks?.length ? (
          <>
            <Text style={s.h2}>How you compare</Text>
            {report.benchmarks.map((b, i) => (
              <View key={i} style={s.metricRow}><Text>{b.metric}</Text><Text>{b.yours} vs {b.benchmark} ({b.source})</Text></View>
            ))}
          </>
        ) : null}
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.h2}>Who put this together</Text>
        <Text style={s.h1}>Neil Busque</Text>
        <Text style={{ marginTop: 8 }}>
          I am a builder and marketer who ships. I take ideas from a blank file to a live product, usually solo, often in days.
          My path went from design to web to funnels and CRM to automation, and now I build with AI every day.
        </Text>
        <Text style={s.h2}>How I can help with this page</Text>
        <Text>I fix the exact issues in this report: sharper hook and offer, a single clear call to action, proof that builds trust, a faster mobile page, and the follow-up behind it so leads do not slip. I also build the CRM, automations, and AI systems around it.</Text>
        <Link src="https://api.whatsapp.com/send/?phone=9083164140" style={s.cta}>Message me on WhatsApp</Link>
        <Text style={{ marginTop: 12 }} >More at busqueneil.com  ·  linkedin.com/in/neilbusque  ·  busqueneil@gmail.com</Text>
      </Page>
    </Document>
  );
}

export async function renderReportPdf(data: ReportPdfData): Promise<Buffer> {
  return await renderToBuffer(<ReportDoc {...data} />);
}
```

- [ ] **Step 3: Implement `email.ts`**

```ts
const env = (k: string) => process.env[k] ?? (import.meta as any).env?.[k];

export async function sendReportEmail(opts: { to: string; url: string; score: number; pdf: Buffer }): Promise<boolean> {
  const key = env('RESEND_API_KEY');
  if (!key) return false;
  const from = env('ANALYZER_FROM') || 'Neil Busque <neil@busqueneil.com>';
  const html = [
    `<p>Here is your full landing page report for <b>${opts.url}</b>.</p>`,
    `<p>You scored <b>${opts.score}/100</b>. The attached PDF breaks down every fix, with the actual copy to use.</p>`,
    `<p>If you want, just reply here and tell me what the page is for. I read every one.</p>`,
    `<p>Neil</p>`,
  ].join('');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from, to: opts.to, reply_to: 'busqueneil@gmail.com',
      subject: `Your landing page report: ${opts.score}/100`,
      html,
      attachments: [{ filename: 'landing-page-report.pdf', content: opts.pdf.toString('base64') }],
    }),
  });
  return res.ok;
}
```

- [ ] **Step 4: Build to confirm the PDF module bundles**

Run: `npm run build`
Expected: build succeeds. If Vite fails to bundle `@react-pdf/renderer` for SSR, add `ssr: { noExternal: ['@react-pdf/renderer'] }` to `astro.config.mjs`'s `vite` block and rebuild.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/lib/analyzer/report-pdf.tsx src/lib/analyzer/email.ts astro.config.mjs
git commit -m "feat(analyzer): branded PDF report + Resend delivery"
```

---

## Task 11: `/api/analyzer/deliver` endpoint

**Files:**
- Create: `src/pages/api/analyzer/deliver.ts`
- Modify: `astro.config.mjs` (set `maxDuration`)

**Interfaces:**
- Consumes: `verifyScan` (Task 4), `recordLead`/`markDelivered` (Task 8), `upsertOrbitLead` (Task 9), `runLandingAnalysis` (Task 5), `renderReportPdf` (Task 10), `sendReportEmail` (Task 10).
- Produces: `POST /api/analyzer/deliver` — body `{ email, scanToken, hp }` → `200 { ok: true }` (ack) | `400` | `429`.

- [ ] **Step 1: Set the function timeout**

In `astro.config.mjs`, change `adapter: vercel()` to `adapter: vercel({ maxDuration: 60 })`.

- [ ] **Step 2: Implement the endpoint**

```ts
import type { APIRoute } from 'astro';
import { verifyScan } from '../../../lib/analyzer/token';
import { recordLead, markDelivered } from '../../../lib/analyzer/caps';
import { upsertOrbitLead } from '../../../lib/analyzer/orbit';
import { runLandingAnalysis } from '../../../lib/analyzer/ai';
import { renderReportPdf } from '../../../lib/analyzer/report-pdf';
import { sendReportEmail } from '../../../lib/analyzer/email';
import type { PageAudit } from '../../../lib/analyzer/audit';
import type { ScrapedPage } from '../../../lib/analyzer/scrapeExtract';

export const prerender = false;
const env = (k: string) => process.env[k] ?? (import.meta as any).env?.[k];
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'Content-Type': 'application/json' } });
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  const secret = env('ANALYZER_TOKEN_SECRET');
  if (!secret) return json({ error: 'server misconfigured' }, 500);

  let body: any = {};
  try { body = await request.json(); } catch { /* noop */ }
  const email = String(body.email || '').trim().toLowerCase();
  const hp = String(body.hp || '');
  if (hp) return json({ ok: true });                 // honeypot: pretend success, do nothing
  if (!EMAIL_RE.test(email)) return json({ error: 'invalid-email' }, 400);
  const payload = verifyScan(String(body.scanToken || ''), secret);
  if (!payload) return json({ error: 'expired' }, 400);

  const { url, score, grade } = payload;
  const rec = await recordLead({ email, url, score, grade });
  if (!rec.ok) {
    if (rec.reason === 'daily-email-cap') return json({ error: 'You already requested a few reports today. Check your inbox.' }, 429);
    if (rec.reason === 'global-cap') return json({ error: 'We are at capacity today. Try again tomorrow.' }, 429);
    // On misconfig, still ack so the UX is not broken; nothing was stored.
  }

  // Lead push (best-effort; fall back to a notify email if Orbit is unavailable).
  const orbitOk = await upsertOrbitLead({ email, url, score, grade });

  // Heavy work runs after we respond, still within maxDuration.
  const heavy = (async () => {
    try {
      const { audit, page } = (payload.audit as { audit: PageAudit; page: ScrapedPage });
      const report = await runLandingAnalysis(audit, page);
      const pdf = await renderReportPdf({ url, score, grade, audit, report });
      const sent = await sendReportEmail({ to: email, url, score, pdf });
      if (sent) await markDelivered(email, url);
      if (!orbitOk) await notifyNeil(email, url, score, grade);   // Orbit fallback
    } catch (e) {
      console.error('deliver heavy failed', (e as Error)?.message);
    }
  })();

  const ctx = (globalThis as any).context; // Vercel injects waitUntil via the request context
  if (ctx?.waitUntil) ctx.waitUntil(heavy); else await heavy;

  return json({ ok: true });
};

async function notifyNeil(email: string, url: string, score: number, grade: string) {
  const key = env('RESEND_API_KEY');
  if (!key) return;
  const from = env('ANALYZER_FROM') || 'Neil Busque <neil@busqueneil.com>';
  await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to: 'busqueneil@gmail.com', subject: `New analyzer lead: ${email} (${score}/100)`, html: `<p>${email} analyzed ${url}, scored ${score}/100 (${grade}). Orbit push failed, add manually.</p>` }),
  });
};
```

Note on `waitUntil`: `@astrojs/vercel` exposes it on `Astro.locals`/the request context depending on version. If `ctx?.waitUntil` is not present at runtime, the fallback `await heavy` runs the work inline (still within the 60s `maxDuration`), so delivery is never dropped. During QA, confirm which is active and prefer `waitUntil` for a snappier ack; if using `Astro.locals`, read it from the `APIContext` (`locals.runtime?.waitUntil` or `ctx.waitUntil`) instead of `globalThis`.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/analyzer/deliver.ts astro.config.mjs
git commit -m "feat(analyzer): email-gated /deliver (Orbit + AI + PDF + Resend)"
```

---

## Task 12: Analyzer page + island

**Files:**
- Create: `src/pages/analyzer.astro`, `src/components/Analyzer.tsx`

**Interfaces:**
- Consumes: `POST /api/analyzer/scan`, `POST /api/analyzer/deliver`.
- Produces: the `/analyzer` route; reads `?url=` to prefill + auto-scan.

- [ ] **Step 1: Create the island `src/components/Analyzer.tsx`**

Preact component. States: `idle | scanning | teaser | submitting | sent | error`. On mount, read `?url=` and auto-run. Match Electric Glow (near-black bg, violet→magenta accent, Inter/JetBrains Mono). Use the site's existing CSS custom properties/classes where present; otherwise the inline styles below are acceptable and can be polished in QA.

```tsx
import { useEffect, useState } from 'preact/hooks';

type Audit = any;
type Scan = { audit: Audit; score: number; grade: string; summary: string; scanToken: string };

export default function Analyzer({ initialUrl = '' }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [phase, setPhase] = useState<'idle'|'scanning'|'teaser'|'submitting'|'sent'|'error'>('idle');
  const [scan, setScan] = useState<Scan | null>(null);
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [err, setErr] = useState('');

  async function runScan(u: string) {
    setErr(''); setPhase('scanning');
    try {
      const res = await fetch('/api/analyzer/scan', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url: u }) });
      const data = await res.json();
      if (!res.ok) { setErr(data.error === 'unreachable' ? 'I could not reach that page. Check the URL and try again.' : 'That does not look like a valid URL.'); setPhase('error'); return; }
      setScan(data); setPhase('teaser');
    } catch { setErr('Something went wrong. Try again.'); setPhase('error'); }
  }

  useEffect(() => { if (initialUrl) runScan(initialUrl); /* eslint-disable-next-line */ }, []);

  async function submitEmail(e: Event) {
    e.preventDefault();
    if (!scan) return;
    setPhase('submitting'); setErr('');
    try {
      const res = await fetch('/api/analyzer/deliver', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, hp, scanToken: scan.scanToken }) });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || 'Could not send. Try again.'); setPhase('teaser'); return; }
      try { localStorage.setItem('analyzer_converted', '1'); } catch {}
      setPhase('sent');
    } catch { setErr('Could not send. Try again.'); setPhase('teaser'); }
  }

  const conv = scan?.audit?.conversion;
  const mob = scan?.audit?.mobile;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {(phase === 'idle' || phase === 'scanning' || phase === 'error') && (
        <form onSubmit={(e) => { e.preventDefault(); if (url) runScan(url); }}>
          <input value={url} onInput={(e) => setUrl((e.target as HTMLInputElement).value)} placeholder="yourwebsite.com" style={inp} />
          <button type="submit" disabled={phase === 'scanning'} style={btn}>{phase === 'scanning' ? 'Analyzing…' : 'Analyze my page'}</button>
          {err && <p style={{ color: '#f87171' }}>{err}</p>}
        </form>
      )}

      {(phase === 'teaser' || phase === 'submitting' || phase === 'sent') && scan && (
        <div>
          <div style={{ textAlign: 'center', margin: '18px 0' }}>
            <div style={{ fontSize: 64, fontWeight: 800, background: 'linear-gradient(90deg,#7c3aed,#db2777)', WebkitBackgroundClip: 'text', color: 'transparent' }}>{scan.score}<span style={{ fontSize: 24, color: '#9ca3af' }}>/100</span></div>
            <div style={{ color: '#9ca3af' }}>Grade {scan.grade}</div>
          </div>
          <div style={grid}>
            <Metric label="Page speed" value={`${scan.audit.speed.score}/100`} />
            <Metric label="Mobile" value={mob?.hasViewportMeta ? 'Pass' : 'Fail'} />
            <Metric label="Conversion elements" value={`${conv?.presentCount}/${conv?.totalCount}`} />
          </div>
          <p style={{ marginTop: 14 }}>{scan.summary}</p>

          {phase !== 'sent' ? (
            <form onSubmit={submitEmail} style={{ marginTop: 18, borderTop: '1px solid #262633', paddingTop: 16 }}>
              <p style={{ fontWeight: 700 }}>Unlock the full breakdown and the exact fixes.</p>
              <input value={email} onInput={(e) => setEmail((e.target as HTMLInputElement).value)} type="email" required placeholder="Your best email" style={inp} />
              <input value={hp} onInput={(e) => setHp((e.target as HTMLInputElement).value)} tabIndex={-1} autocomplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
              <button type="submit" disabled={phase === 'submitting'} style={btn}>{phase === 'submitting' ? 'Sending…' : 'Email me the full report'}</button>
              {err && <p style={{ color: '#f87171' }}>{err}</p>}
            </form>
          ) : (
            <div style={{ marginTop: 18, borderTop: '1px solid #262633', paddingTop: 16 }}>
              <p style={{ fontWeight: 700 }}>On its way to your inbox 📬</p>
              <p style={{ color: '#9ca3af' }}>Your full report is landing in a minute or two. Check spam if you do not see it.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div style={{ background: '#14141c', border: '1px solid #262633', borderRadius: 10, padding: 12, textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div><div style={{ color: '#9ca3af', fontSize: 12 }}>{label}</div></div>;
}
const inp: any = { width: '100%', padding: 14, borderRadius: 10, border: '1px solid #262633', background: '#0f0f16', color: '#fff', marginBottom: 10 };
const btn: any = { width: '100%', padding: 14, borderRadius: 10, border: 0, color: '#fff', fontWeight: 700, cursor: 'pointer', background: 'linear-gradient(90deg,#7c3aed,#db2777)' };
const grid: any = { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 };
```

- [ ] **Step 2: Create the page `src/pages/analyzer.astro`**

Use `Base.astro` (match how `index.astro` invokes it — pass the same title/description/meta props). Read `?url=` server-side and pass to the island.

```astro
---
import Base from '../layouts/Base.astro';
import Analyzer from '../components/Analyzer.tsx';
export const prerender = false;
const initialUrl = new URL(Astro.request.url).searchParams.get('url') ?? '';
---
<Base title="Free Landing Page Analyzer" description="Get an instant score on your landing page speed, mobile, and conversion elements. Free, no signup to see your score.">
  <main style="max-width:720px;margin:0 auto;padding:80px 20px;">
    <h1 style="font-size:40px;font-weight:800;text-align:center;">Free Landing Page Analyzer</h1>
    <p style="text-align:center;color:#9ca3af;margin:12px 0 28px;">Paste your URL. Get an instant score on speed, mobile, and the conversion elements that matter. The full breakdown lands in your inbox.</p>
    <Analyzer client:load initialUrl={initialUrl} />
  </main>
</Base>
```

If `Base.astro`'s prop names differ, mirror exactly what `src/pages/index.astro` passes (open it and match). Keep copy free of em dashes.

- [ ] **Step 3: Manual browser test**

Run: `npm run dev`, open `http://localhost:4321/analyzer?url=https://stripe.com`.
Expected: auto-scans, shows score + 3 metrics + summary, then the email gate. (Requires local `.env` with `ANALYZER_TOKEN_SECRET`; `PAGESPEED_API_KEY`/`OPENROUTER_API_KEY` optional for the teaser since PSI is soft and AI only runs on deliver.)

- [ ] **Step 4: Commit**

```bash
git add src/pages/analyzer.astro src/components/Analyzer.tsx
git commit -m "feat(analyzer): /analyzer page + wizard island with ?url= autostart"
```

---

## Task 13: Exit-intent popup

**Files:**
- Create: `src/components/ExitIntentAnalyzer.tsx`
- Modify: `src/layouts/Base.astro`

**Interfaces:**
- Produces: a site-wide popup island; on submit redirects to `/analyzer?url=<encoded>`.

- [ ] **Step 1: Create `src/components/ExitIntentAnalyzer.tsx`**

```tsx
import { useEffect, useState } from 'preact/hooks';

const KEY = 'analyzer_exit_seen';
const DAYS = 7;

function suppressed(): boolean {
  try {
    if (location.pathname.startsWith('/analyzer')) return true;
    if (localStorage.getItem('analyzer_converted')) return true;
    const seen = Number(localStorage.getItem(KEY) || '0');
    if (seen && Date.now() - seen < DAYS * 86400_000) return true;
    if ((navigator as any).webdriver) return true;
  } catch {}
  return false;
}

export default function ExitIntentAnalyzer() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (suppressed()) return;
    let armed = true, depth = 0;
    const fire = () => { if (!armed) return; armed = false; setOpen(true); try { localStorage.setItem(KEY, String(Date.now())); } catch {} };
    const onMouseOut = (e: MouseEvent) => { if (e.clientY <= 0) fire(); };
    let lastY = window.scrollY;
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      if (pct > 0.4) depth = 1;
      const up = window.scrollY < lastY - 40; lastY = window.scrollY;
      if (depth && up) fire();
    };
    const dwell = setTimeout(fire, 25000);
    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(dwell); document.removeEventListener('mouseout', onMouseOut); window.removeEventListener('scroll', onScroll); };
  }, []);

  if (!open) return null;
  const go = (e: Event) => { e.preventDefault(); location.href = url ? `/analyzer?url=${encodeURIComponent(url)}` : '/analyzer'; };
  return (
    <div onClick={() => setOpen(false)} style={overlay}>
      <div onClick={(e) => e.stopPropagation()} style={card}>
        <button onClick={() => setOpen(false)} aria-label="Close" style={close}>×</button>
        <h3 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>Before you go, how does your page score?</h3>
        <p style={{ color: '#9ca3af', margin: '0 0 14px' }}>Free instant grade on speed, mobile, and conversion. No signup to see your score.</p>
        <form onSubmit={go}>
          <input value={url} onInput={(e) => setUrl((e.target as HTMLInputElement).value)} placeholder="yourwebsite.com" style={inp} />
          <button type="submit" style={btn}>Analyze my page free</button>
        </form>
      </div>
    </div>
  );
}
const overlay: any = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 };
const card: any = { position: 'relative', maxWidth: 420, width: '100%', background: '#101019', border: '1px solid #262633', borderRadius: 16, padding: 28, color: '#fff' };
const close: any = { position: 'absolute', top: 10, right: 14, background: 'none', border: 0, color: '#9ca3af', fontSize: 24, cursor: 'pointer' };
const inp: any = { width: '100%', padding: 13, borderRadius: 10, border: '1px solid #262633', background: '#0f0f16', color: '#fff', marginBottom: 10 };
const btn: any = { width: '100%', padding: 13, borderRadius: 10, border: 0, color: '#fff', fontWeight: 700, cursor: 'pointer', background: 'linear-gradient(90deg,#7c3aed,#db2777)' };
```

- [ ] **Step 2: Mount it site-wide in `Base.astro`**

In `src/layouts/Base.astro`, import the component in the frontmatter and render it just before `</body>` (after the `<slot />`), hydrated late so it never blocks paint:

```astro
---
import ExitIntentAnalyzer from '../components/ExitIntentAnalyzer.tsx';
// ...existing frontmatter...
---
<!-- ...existing body... -->
    <slot />
    <ExitIntentAnalyzer client:idle />
  </body>
```

(Place the `<ExitIntentAnalyzer client:idle />` line immediately before the existing `</body>` at `Base.astro:83`.)

- [ ] **Step 3: Manual test**

Run: `npm run dev`, open `http://localhost:4321/`. Move the mouse above the top edge of the viewport (or wait 25s). Expected: the popup appears once; submitting with a URL lands on `/analyzer?url=...` and auto-scans; reload shows it does not reappear (localStorage). Open `/analyzer` directly: popup never shows.

- [ ] **Step 4: Commit**

```bash
git add src/components/ExitIntentAnalyzer.tsx src/layouts/Base.astro
git commit -m "feat(analyzer): site-wide exit-intent popup deep-linking into /analyzer"
```

---

## Task 14: Env, end-to-end verification, deploy

**Files:**
- Modify: `.env.example` (if present) / document env

- [ ] **Step 1: Set env in the busqueneil Vercel project**

Set: `RESEND_API_KEY`, `ANALYZER_TOKEN_SECRET` (random 32+ chars), `SUPABASE_SERVICE_ROLE_KEY`, `ORBIT_MCP_URL`, `ORBIT_MCP_KEY`, optional `PAGESPEED_API_KEY`, optional `ANALYZER_FROM`. Confirm busqueneil.com is a verified sending domain in Resend (SPF/DKIM/DMARC green); if `neil@busqueneil.com` is not verified, set `ANALYZER_FROM` to a verified address.

- [ ] **Step 2: Full local E2E (real email)**

With all env set locally, run `npm run dev`, analyze a real weak page, submit a real inbox. Confirm: teaser score + metrics render; the email arrives with `landing-page-report.pdf`; the PDF headline score equals the teaser score; findings + WhatsApp CTA render; the Orbit contact appears (or the notify-Neil fallback email arrives). Confirm a second submit with the same email within a minute is capped.

- [ ] **Step 3: Abuse checks**

- Submit with the honeypot field populated → `200 {ok}` but no email sent, no lead row.
- Tamper the `scanToken` → `/deliver` returns 400 `expired`.
- Hit `/scan` 11 times from one instance → 11th returns 429.

- [ ] **Step 4: Push + verify production**

```bash
git push -u origin analyzer-lead-magnet
```
Open a PR to `main` (or merge per Neil's preference). After Vercel deploys, repeat Step 2 against the live `/analyzer` URL. Run the UI pre-delivery checklist (`MEMORY.md → ui-predelivery-checklist`) on desktop + mobile.

- [ ] **Step 5: Journal**

Append a session entry via the `neil-daily-journal` skill.

---

## Self-Review

**Spec coverage:**
- §3 flow (teaser → gate → PDF email) → Tasks 6, 11, 12. ✔
- §4 endpoints + ported code → Tasks 1–6, 11. ✔
- §5 deterministic score + summary → Task 2. ✔
- §6 PDF (react-pdf, bio, WhatsApp CTA) → Task 10. ✔
- §7 abuse (IP limit, scanToken, honeypot, caps) → Tasks 4, 6, 8, 11. ✔
- §8 timeout (`maxDuration`, waitUntil) → Task 11. ✔
- §9/§10 deps + env → Tasks 9, 10, 14. ✔
- §11 data model → Task 7. ✔
- §12 testing → Tasks 1–4 (unit) + 14 (E2E/abuse). ✔
- §13 exit-intent popup → Task 13. ✔
- Lead → Orbit → Task 9 + 11. ✔

**Placeholder scan:** No TBD/TODO. Ported files use exact source paths (`$FS/...`); all novel code is shown in full.

**Type consistency:** `PageAudit`/`AnalysisReport`/`ScanPayload`/`Scan` names and the `{ audit, page }` shape passed through `scanToken` → `deliver` → `runLandingAnalysis` are consistent across Tasks 2, 4, 5, 11. `upsert_contact` argument names match Orbit's schema (Task 9). `compositeScore`/`mobileScore`/`teaserSummary` names match between Task 2 and Tasks 6/10.

**Known risk to watch in execution:** the `waitUntil` access pattern (Task 11) varies by `@astrojs/vercel` version; the inline `await heavy` fallback guarantees delivery regardless, so verify and prefer `waitUntil` during QA but do not block on it.
