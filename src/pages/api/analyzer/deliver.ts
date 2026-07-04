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
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

export const POST: APIRoute = async ({ request, clientAddress }) => {
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
  const rec = await recordLead({ email, url, score, grade, ip: clientAddress });
  if (!rec.ok) {
    if (rec.reason === 'daily-email-cap') return json({ error: 'You already requested a few reports today. Check your inbox.' }, 429);
    if (rec.reason === 'daily-ip-cap') return json({ error: 'Too many reports from your network today. Try again tomorrow.' }, 429);
    if (rec.reason === 'global-cap') return json({ error: 'We are at capacity today. Try again tomorrow.' }, 429);
    // On misconfig, still ack so the UX is not broken; nothing was stored.
  }

  // Heavy work runs after we respond, still within maxDuration. The Orbit push
  // lives here too so a slow CRM round-trip never delays the ack.
  const heavy = (async () => {
    try {
      const orbitOk = await upsertOrbitLead({ email, url, score, grade });
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

  // Prefer Vercel's waitUntil so the ack is instant and the heavy work finishes
  // in the background (bounded by maxDuration). waitUntil throws when called
  // outside the Vercel request context (local dev), so we fall back to an inline
  // await there so delivery is never dropped.
  let scheduled = false;
  try {
    const { waitUntil } = await import('@vercel/functions');
    waitUntil(heavy);
    scheduled = true;
  } catch {
    scheduled = false;
  }
  if (!scheduled) await heavy;

  return json({ ok: true });
};

async function notifyNeil(email: string, url: string, score: number, grade: string) {
  const key = env('RESEND_API_KEY');
  if (!key) return;
  const from = env('ANALYZER_FROM') || 'Neil Busque <neil@busqueneil.com>';
  await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to: 'busqueneil@gmail.com', subject: `New analyzer lead: ${email} (${score}/100)`, html: `<p>${esc(email)} analyzed ${esc(url)}, scored ${score}/100 (${grade}). Orbit push failed, add manually.</p>` }),
  });
};
