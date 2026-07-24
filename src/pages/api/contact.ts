import type { APIRoute } from 'astro';
import { sendContactEmail } from '../../lib/analyzer/email';

export const prerender = false;

const MG_DOMAIN = 'mail.hatchos.one';
const TO = 'busqueneil@gmail.com';
const ORBIT_FORM_LEAD = 'https://cubglfkgnjvlwelkmnbh.supabase.co/functions/v1/form-lead';
const ORBIT_ANON = 'sb_publishable_vxcbGxMEjdCxYm77sOwldg_hkWcIRbO';

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  // Honeypot: pretend success so bots stop retrying.
  if (String(body.bot_field ?? '').trim()) return json({ ok: true });

  const name = String(body.name ?? '').trim().slice(0, 200);
  const email = String(body.email ?? '').trim().slice(0, 200);
  const need = String(body.need ?? '').trim().slice(0, 100);
  const message = String(body.message ?? '').trim().slice(0, 5000);

  if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return json({ error: 'Missing or invalid fields' }, 400);
  }

  const subject = `[busqueneil.com] ${name} · ${need || 'Not sure yet'}`;
  const text = `New message from busqueneil.com/contact

Name: ${name}
Email: ${email}
Needs: ${need || 'Not sure yet'}

${message}`;
  const html = `<p><strong>New message from busqueneil.com/contact</strong></p>
<p>Name: ${esc(name)}<br/>Email: ${esc(email)}<br/>Needs: ${esc(need || 'Not sure yet')}</p>
<p style="white-space:pre-wrap">${esc(message)}</p>`;

  // Primary: Gmail SMTP (same proven transport as the Analyzer — lands in
  // Neil's inbox as a self-send, replies thread to the visitor via Reply-To).
  let sent = await sendContactEmail({ subject, html, text, replyTo: `${name} <${email}>` });

  // Fallback: Mailgun on mail.hatchos.one.
  if (!sent) sent = await sendViaMailgun({ subject, html, text, replyTo: `${name} <${email}>` });

  if (!sent) return json({ error: 'Could not send your message' }, 502);

  // Best-effort: also file the lead in Orbit CRM. Never blocks the reply.
  try {
    await fetch(ORBIT_FORM_LEAD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: ORBIT_ANON,
        Authorization: `Bearer ${ORBIT_ANON}`,
      },
      body: JSON.stringify({ form: 'contact', name, email, need, message }),
    });
  } catch {
    // email already delivered; CRM copy is optional
  }

  return json({ ok: true });
};

async function sendViaMailgun(opts: { subject: string; html: string; text: string; replyTo: string }): Promise<boolean> {
  const key = import.meta.env.MAILGUN_SENDING_KEY ?? process.env.MAILGUN_SENDING_KEY;
  if (!key) return false;
  try {
    const form = new URLSearchParams({
      from: `busqueneil.com <contact@${MG_DOMAIN}>`,
      to: TO,
      'h:Reply-To': opts.replyTo,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    const res = await fetch(`https://api.mailgun.net/v3/${MG_DOMAIN}/messages`, {
      method: 'POST',
      headers: { Authorization: 'Basic ' + btoa(`api:${key}`) },
      body: form,
    });
    if (!res.ok) console.error('mailgun send failed', res.status, await res.text().catch(() => ''));
    return res.ok;
  } catch (e) {
    console.error('mailgun send threw', (e as Error)?.message);
    return false;
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
