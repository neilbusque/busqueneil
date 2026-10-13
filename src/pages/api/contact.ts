import type { APIRoute } from 'astro';
import { sendContactEmail } from '../../lib/analyzer/email';

export const prerender = false;

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
  const company = String(body.company ?? '').trim().slice(0, 200);
  const message = String(body.message ?? '').trim().slice(0, 5000);

  if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return json({ error: 'Missing or invalid fields' }, 400);
  }

  const subject = `[busqueneil.com] ${name}${company ? `, ${company}` : ''}: ${need || 'Not sure yet'}`;
  const text = `New message from busqueneil.com/contact

Name: ${name}
Email: ${email}${company ? `\nCompany: ${company}` : ''}
Needs: ${need || 'Not sure yet'}

${message}`;
  const html = `<p><strong>New message from busqueneil.com/contact</strong></p>
<p>Name: ${esc(name)}<br/>Email: ${esc(email)}<br/>${company ? `Company: ${esc(company)}<br/>` : ''}Needs: ${esc(need || 'Not sure yet')}</p>
<p style="white-space:pre-wrap">${esc(message)}</p>`;

  // Gmail first, then Mailgun (both inside sendContactEmail), so one dead login can't drop a lead.
  const sent = await sendContactEmail({ subject, html, text, replyTo: `${name} <${email}>` });

  if (!sent) return json({ error: 'Could not send your message' }, 502);

  // Best effort: also file the lead in the CRM. Never blocks the reply.
  try {
    await fetch(ORBIT_FORM_LEAD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: ORBIT_ANON,
        Authorization: `Bearer ${ORBIT_ANON}`,
      },
      // The company also leads the message, so the CRM keeps it even where it has no company field.
      body: JSON.stringify({
        form: 'contact',
        name,
        email,
        need,
        company: company || undefined,
        message: company ? `Company: ${company}\n\n${message}` : message,
      }),
    });
  } catch {
    // email already delivered; CRM copy is optional
  }

  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
