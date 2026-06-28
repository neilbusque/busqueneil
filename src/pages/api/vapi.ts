import type { APIRoute } from 'astro';

export const prerender = false;

const env = (k: string) => process.env[k] ?? (import.meta as any).env?.[k];

// Vapi server webhook. The hero voice agent (VoiceWidget) sets this as its
// assistant.server.url. On the end-of-call report we pull the structured
// name/phone the agent collected and push the lead to Otto. Anything else is
// acknowledged with 200 so Vapi stays happy. Never throws back at the call.
export const POST: APIRoute = async ({ request }) => {
  let body: any = {};
  try { body = await request.json(); } catch {}
  const msg = body?.message ?? body;
  const type = msg?.type;

  if (type !== 'end-of-call-report') return json({ ok: true });

  const d = msg?.analysis?.structuredData ?? {};
  const name = (d.name || '').toString().trim();
  const phone = (d.phone || '').toString().trim();
  const email = (d.email || '').toString().trim();
  const interest = (d.interest || '').toString().trim();
  const summary = (msg?.analysis?.summary || '').toString().trim();

  // need at least a name + phone to be worth handing Neil a call
  if (!name || !phone) return json({ ok: true, captured: false });

  const ottoUrl = env('OTTO_INTAKE_URL') || 'https://otto-neilbusque.vercel.app/api/intake';
  const secret = env('OTTO_INTAKE_SECRET');
  const message = [
    'Wants a call with Neil (captured by the busqueneil.com voice agent).',
    `Phone: ${phone}`,
    interest ? `What they want: ${interest}` : '',
    summary ? `Call summary: ${summary}` : '',
  ].filter(Boolean).join('\n');

  try {
    await fetch(ottoUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(secret ? { 'x-otto-secret': secret } : {}) },
      body: JSON.stringify({ name, email, phone, message, source: 'busqueneil.com voice', ...(secret ? { secret } : {}) }),
    });
  } catch (e) {
    console.error('vapi->otto intake', e);
  }

  return json({ ok: true, captured: true });
};

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
