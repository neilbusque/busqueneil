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
