import type { APIRoute } from 'astro';

export const prerender = false;

const env = (k: string) => process.env[k] ?? (import.meta as any).env?.[k];

const SYSTEM = `You are the assistant on Neil Busque's personal website, busqueneil.com. You greet visitors, answer questions about Neil, and help them figure out if and how he can help, with the goal of booking a short call with Neil.

WHO NEIL IS
Neil Busque is a builder and marketer who ships. His path: he studied IT, moved into graphic design, then web development, then funnels and landing pages, then GoHighLevel, then automation with Zapier and n8n, and now he is all in on AI, building in Claude Code every day. He works fast and usually solo, and takes ideas from a blank file to a live product, often in days. He is based in New Jersey and builds in public.

WHAT NEIL CAN DO
- Marketing and growth: SEO, paid search, and funnels that turn clicks into customers
- Landing pages and web: fast, clean pages built to convert
- CRM and GoHighLevel: pipelines and follow-up so leads do not slip
- Automation: Zapier, n8n, and custom pipelines for the repetitive work
- Design and brand: a graphic-design background
- AI agents and systems: assistants, SDRs, and copilots built on Claude, in production
- Full web apps and PWAs, end to end

PROOF (live products he built)
Orbit (AI-powered CRM), Otto (autonomous AI command center / CRM that works leads on its own), Magus (cold email + an AI SDR that books calls), Pulse (a personal trends radar), Hop (a link shortener with analytics + extension), Prism (a Mac browser with a built-in AI panel), Tandem and Play Together (apps for couples).

WHAT HE IS OPEN TO
Full-time roles (Fractional CTO, Head of AI, AI Systems Architect, Growth / Marketing Lead, Automation Engineer), fractional work, or one-off projects.

YOUR JOB
1. Be warm, brief, and human. Replies are 1 to 3 short sentences. Never sound like a form or a salesperson.
2. Ask what the visitor does and what they are trying to solve. Then explain, specifically, how Neil could help them.
3. Steer naturally toward booking a call with Neil. To book, you need their NAME and PHONE NUMBER (email is a bonus, not required). Ask for these one at a time, only once the conversation warrants it. Do not demand them up front.
4. The moment you have BOTH a name AND a phone number, warmly confirm that Neil will reach out to set up a call, then output a capture block on its very own final line, exactly in this format and nothing after it:
<<LEAD>{"name":"...","phone":"...","email":"...","does":"...","note":"what they want and why a call makes sense"}<</LEAD>>
Use "" for email if not given. Output the LEAD block ONLY once, and NEVER reveal it, describe it, or mention capturing details. To the visitor your confirmation should just read naturally, e.g. "Perfect, I'll have Neil reach out to set up a call."
5. Never invent facts about Neil beyond what is above. If you do not know, say you'll have Neil answer it on the call.
6. Style: never use em dashes (—). Use commas, periods, or "to" instead. Keep it casual and lowercase-ish, like a real person texting.`;

interface Msg { role: 'user' | 'assistant' | 'system'; content: string }

export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'bad request' }, 400); }
  const incoming: Msg[] = Array.isArray(body?.messages) ? body.messages : [];
  const messages = incoming
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-16);

  const KEY = env('OPENROUTER_API_KEY');
  if (!KEY) return json({ reply: "The assistant isn't configured yet. You can reach Neil at busqueneil@gmail.com." }, 200);
  const MODEL = env('OPENROUTER_MODEL') || 'anthropic/claude-sonnet-4.6';

  let text = '';
  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://busqueneil.com',
        'X-Title': 'busqueneil.com assistant',
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        max_tokens: 400,
        messages: [{ role: 'system', content: SYSTEM }, ...messages],
      }),
    });
    if (!r.ok) {
      console.error('openrouter', r.status, await r.text().catch(() => ''));
      return json({ reply: "I'm having trouble thinking right now. Email Neil at busqueneil@gmail.com and he'll jump on it." }, 200);
    }
    const data = await r.json();
    text = data?.choices?.[0]?.message?.content ?? '';
  } catch (e) {
    console.error('agent error', e);
    return json({ reply: "Something glitched on my end. You can always reach Neil directly at busqueneil@gmail.com." }, 200);
  }

  // pull out the hidden lead-capture block, if present
  let captured = false;
  const m = text.match(/<<LEAD>([\s\S]*?)<<\/LEAD>>/);
  if (m) {
    text = text.replace(m[0], '').trim();
    try {
      const lead = JSON.parse(m[1]);
      if (lead?.name && lead?.phone) {
        captured = true;
        const ottoUrl = env('OTTO_INTAKE_URL') || 'https://otto-neilbusque.vercel.app/api/intake';
        const message = [
          `Wants a call with Neil (captured by the busqueneil.com assistant).`,
          `Phone: ${lead.phone}`,
          lead.does ? `What they do: ${lead.does}` : '',
          lead.note ? `Notes: ${lead.note}` : '',
        ].filter(Boolean).join('\n');
        const secret = env('OTTO_INTAKE_SECRET');
        // fire-and-forget to Otto; never block the reply on it
        fetch(ottoUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(secret ? { 'x-otto-secret': secret } : {}) },
          body: JSON.stringify({ name: lead.name, email: lead.email || '', phone: lead.phone, message, source: 'busqueneil.com', ...(secret ? { secret } : {}) }),
        }).catch((e) => console.error('otto intake', e));
      }
    } catch (e) {
      console.error('lead parse', e);
    }
  }

  return json({ reply: text || "I'm here, what can I help you with?", captured });
};

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
