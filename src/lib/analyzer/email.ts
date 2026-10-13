import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

const env = (k: string) => process.env[k] || (import.meta as any).env?.[k] || '';

/** Neil's inbox: contact messages and notices go here, and replies to reports come back here. */
const INBOX = 'busqueneil@gmail.com';

// Primary: the account's own Gmail SMTP, so every message also lands in Neil's Gmail "Sent"
// and replies come straight back to his inbox. Reused across invocations on a warm instance.
let gmail: Transporter | null = null;
function gmailTransport(): Transporter | null {
  const user = env('GMAIL_USER');
  const pass = env('GMAIL_APP_PASSWORD').replace(/\s+/g, ''); // Google shows app passwords in 4x4 groups
  if (!user || !pass) return null;
  if (!gmail) gmail = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } });
  return gmail;
}

// Fallback: Mailgun SMTP on the shared sending domain. A revoked Gmail app password once took
// the contact form and the analyzer report down silently, so no message depends on one login.
let mailgun: Transporter | null = null;
function mailgunTransport(): Transporter | null {
  const user = env('MAILGUN_SMTP_USER');
  const pass = env('MAILGUN_SMTP_PASS');
  if (!user || !pass) return null;
  if (!mailgun) mailgun = nodemailer.createTransport({ host: 'smtp.mailgun.org', port: 587, secure: false, auth: { user, pass } });
  return mailgun;
}

interface Mail {
  fromName: string;
  to?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: { filename: string; content: Buffer }[];
}

/** Gmail first, then Mailgun. Each failure is logged with its transport so the cause is visible. */
async function deliver(label: string, mail: Mail): Promise<boolean> {
  const to = mail.to ?? INBOX;
  const { fromName, ...rest } = mail;
  const g = gmailTransport();
  if (g) {
    try {
      await g.sendMail({ ...rest, to, from: `${fromName} <${env('GMAIL_USER')}>` });
      return true;
    } catch (e) {
      console.error(`gmail ${label} send failed`, (e as Error)?.message);
    }
  }
  const m = mailgunTransport();
  if (!m) {
    console.error(`${label}: no Mailgun fallback configured (MAILGUN_SMTP_USER / MAILGUN_SMTP_PASS)`);
    return false;
  }
  try {
    await m.sendMail({ ...rest, to, replyTo: mail.replyTo ?? INBOX, from: `${fromName} <${env('MAILGUN_SMTP_USER')}>` });
    return true;
  } catch (e) {
    console.error(`mailgun ${label} send failed`, (e as Error)?.message);
    return false;
  }
}

/** Deliver the branded PDF report to the lead, as Neil, with the PDF attached. */
export async function sendReportEmail(opts: { to: string; url: string; score: number; pdf: Buffer }): Promise<boolean> {
  const html = [
    `<p>Here is your full landing page report for <b>${opts.url}</b>.</p>`,
    `<p>You scored <b>${opts.score}/100</b>. The attached PDF breaks down every fix, with the actual copy to use.</p>`,
    `<p>If you want, just reply here and tell me what the page is for. I read every one.</p>`,
    `<p>Neil</p>`,
  ].join('');
  return deliver('report', {
    fromName: 'Neil Busque',
    to: opts.to,
    subject: `Your landing page report: ${opts.score}/100`,
    html,
    attachments: [{ filename: 'landing-page-report.pdf', content: opts.pdf }],
  });
}

/** Contact-form message to Neil's own inbox, Reply-To the visitor. */
export async function sendContactEmail(opts: { subject: string; html: string; text: string; replyTo: string }): Promise<boolean> {
  return deliver('contact', { fromName: 'busqueneil.com', replyTo: opts.replyTo, subject: opts.subject, html: opts.html, text: opts.text });
}

/** Internal heads-up to Neil (e.g. when the CRM push fails). */
export async function sendNotice(opts: { subject: string; html: string }): Promise<boolean> {
  return deliver('notice', { fromName: 'Analyzer', subject: opts.subject, html: opts.html });
}
