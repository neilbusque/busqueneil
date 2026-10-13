import { describe, it, expect, vi, beforeEach } from 'vitest';

// Each transport records what it was asked to send; the Gmail one can be told to fail.
const sent: { host: string; mail: any }[] = [];
let gmailFails = false;
vi.mock('nodemailer', () => ({
  default: {
    createTransport: (cfg: { host: string }) => ({
      sendMail: async (mail: any) => {
        if (cfg.host === 'smtp.gmail.com' && gmailFails) throw new Error('535 Username and Password not accepted');
        sent.push({ host: cfg.host, mail });
      },
    }),
  },
}));

async function load() {
  vi.resetModules();
  return import('../email');
}

describe('mail delivery fallback', () => {
  beforeEach(() => {
    sent.length = 0;
    gmailFails = false;
    process.env.GMAIL_USER = 'owner@example.com';
    process.env.GMAIL_APP_PASSWORD = 'abcd efgh ijkl mnop';
    process.env.MAILGUN_SMTP_USER = 'site@mg.example.com';
    process.env.MAILGUN_SMTP_PASS = 'secret';
  });

  it('sends through Gmail when the login works', async () => {
    const { sendContactEmail } = await load();
    expect(await sendContactEmail({ subject: 's', html: 'h', text: 't', replyTo: 'A <a@b.co>' })).toBe(true);
    expect(sent.map((s) => s.host)).toEqual(['smtp.gmail.com']);
  });

  it('falls back to Mailgun when Gmail rejects the login', async () => {
    gmailFails = true;
    const { sendContactEmail } = await load();
    expect(await sendContactEmail({ subject: 's', html: 'h', text: 't', replyTo: 'A <a@b.co>' })).toBe(true);
    expect(sent).toHaveLength(1);
    expect(sent[0].host).toBe('smtp.mailgun.org');
    expect(sent[0].mail.from).toBe('busqueneil.com <site@mg.example.com>');
    expect(sent[0].mail.replyTo).toBe('A <a@b.co>');
    expect(sent[0].mail.to).toBe('busqueneil@gmail.com');
  });

  it('uses Mailgun when Gmail is not configured, and replies to reports reach the inbox', async () => {
    delete process.env.GMAIL_USER;
    delete process.env.GMAIL_APP_PASSWORD;
    const { sendReportEmail } = await load();
    const ok = await sendReportEmail({ to: 'lead@example.com', url: 'https://x.co', score: 70, pdf: Buffer.from('pdf') });
    expect(ok).toBe(true);
    expect(sent[0].host).toBe('smtp.mailgun.org');
    expect(sent[0].mail.to).toBe('lead@example.com');
    expect(sent[0].mail.replyTo).toBe('busqueneil@gmail.com');
    expect(sent[0].mail.attachments).toHaveLength(1);
  });

  it('reports failure when neither transport can send', async () => {
    gmailFails = true;
    delete process.env.MAILGUN_SMTP_USER;
    const { sendNotice } = await load();
    expect(await sendNotice({ subject: 's', html: 'h' })).toBe(false);
  });
});
