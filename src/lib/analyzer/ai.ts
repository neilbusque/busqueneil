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
