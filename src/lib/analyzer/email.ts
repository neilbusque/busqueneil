import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

const env = (k: string) => process.env[k] ?? (import.meta as any).env?.[k];

// Reused across invocations on a warm serverless instance. Sends through the
// account's own Gmail SMTP, so every message also lands in Neil's Gmail "Sent"
// and replies come straight back to his inbox.
let transporter: Transporter | null = null;
function transport(): Transporter | null {
  const user = env('GMAIL_USER');
  const pass = (env('GMAIL_APP_PASSWORD') || '').replace(/\s+/g, ''); // Google shows app passwords in 4x4 groups
  if (!user || !pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }
  return transporter;
}

/** Deliver the branded PDF report to the lead, as Neil, with the PDF attached. */
export async function sendReportEmail(opts: { to: string; url: string; score: number; pdf: Buffer }): Promise<boolean> {
  const t = transport();
  const user = env('GMAIL_USER');
  if (!t || !user) return false;
  const html = [
    `<p>Here is your full landing page report for <b>${opts.url}</b>.</p>`,
    `<p>You scored <b>${opts.score}/100</b>. The attached PDF breaks down every fix, with the actual copy to use.</p>`,
    `<p>If you want, just reply here and tell me what the page is for. I read every one.</p>`,
    `<p>Neil</p>`,
  ].join('');
  try {
    await t.sendMail({
      from: `Neil Busque <${user}>`,
      to: opts.to,
      subject: `Your landing page report: ${opts.score}/100`,
      html,
      attachments: [{ filename: 'landing-page-report.pdf', content: opts.pdf }],
    });
    return true;
  } catch (e) {
    console.error('gmail report send failed', (e as Error)?.message);
    return false;
  }
}

/** Internal heads-up to Neil (e.g. when the Orbit push fails). */
export async function sendNotice(opts: { subject: string; html: string }): Promise<boolean> {
  const t = transport();
  const user = env('GMAIL_USER');
  if (!t || !user) return false;
  try {
    await t.sendMail({ from: `Analyzer <${user}>`, to: user, subject: opts.subject, html: opts.html });
    return true;
  } catch (e) {
    console.error('gmail notice send failed', (e as Error)?.message);
    return false;
  }
}
