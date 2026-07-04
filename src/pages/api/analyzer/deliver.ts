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
