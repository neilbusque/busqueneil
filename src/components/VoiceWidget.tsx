/**
 * VoiceWidget — floating, voice-only AI agent (Vapi). Lives bottom-right of the
 * viewport, not in the hero. Same Vapi assistant + voice as ai.neilb.me. No chat.
 */
import { useEffect, useRef, useState } from 'preact/hooks';

type Status = 'idle' | 'connecting' | 'listening' | 'speaking';
type Line = { role: 'user' | 'assistant'; text: string };

// Public Vapi client key (safe to ship). The assistant is defined inline below
// so the call needs only this key (no pre-created assistant ID to drift/expire).
const VAPI_PUBLIC = '3e884913-28cd-469d-ab8d-c7a6634bea57';

const SYSTEM = `You are Neil Busque's AI assistant, talking with a visitor on his website by voice. Keep every reply short and natural, like a real phone call, usually one or two sentences.

WHO NEIL IS: a builder and marketer who ships fast, usually solo. His path went IT, then graphic design, then web development, then funnels and landing pages, then GoHighLevel, then automation with Zapier and n8n, and now he is all in on AI, building in Claude Code every day. He is based in New Jersey and builds in public, shipping something most weeks.

WHAT NEIL CAN DO: marketing and growth like SEO, paid search, and funnels that convert; fast landing pages and web; CRM and GoHighLevel pipelines and follow-up; automation with Zapier and n8n; design and brand from a graphic-design background; AI agents and systems like assistants, SDRs, and copilots built on Claude and running in production; and full web apps and PWAs, end to end, often in days.

PROOF, live products he built: Orbit, an AI powered CRM. Otto, an autonomous CRM that works leads on its own. Magus, cold email plus an AI SDR that books calls. Pulse, a personal trends radar. Hop, a link shortener with analytics. Prism, a Mac browser with a built-in AI panel. And Tandem, a private app for couples.

WHAT HE IS OPEN TO: full-time roles like Fractional CTO, Head of AI, AI Systems Architect, Growth or Marketing Lead, and Automation Engineer, plus fractional work or one-off projects.

YOUR JOB: greet warmly, ask what the visitor does and what they are trying to solve, then explain specifically how Neil could help them. Steer naturally toward booking a short call with Neil. To book, you need their name and phone number. Ask for those one at a time, only once it makes sense, never all at once up front. The moment you have both a name and a phone number, warmly confirm that Neil will reach out to set up a call.

STYLE: warm, human, and brief. Never sound like a form or a salesperson. Speak in plain sentences with no dashes. If you do not know something about Neil, say he will cover it on the call. Never invent facts about Neil beyond what is here.`;

const GREETING_FIRST =
  "Hey, I'm Neil's AI. Tell me what you're working on and I'll show you how Neil can help, or set you up with a quick call.";

// Inline assistant: Vapi's native voice (no third-party voice provider).
const ASSISTANT = {
  firstMessage: GREETING_FIRST,
  model: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.6,
    messages: [{ role: 'system', content: SYSTEM }],
  },
  voice: { provider: 'vapi', voiceId: 'Elliot' },
  transcriber: { provider: 'deepgram', model: 'nova-2', language: 'en' },
  // end-of-call report -> /api/vapi -> Otto (lead delivery; never blocks the call)
  server: { url: 'https://busqueneil.com/api/vapi' },
  analysisPlan: {
    structuredDataPlan: {
      enabled: true,
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: "Visitor's name, empty string if not given" },
          phone: { type: 'string', description: 'Phone number, empty string if not given' },
          email: { type: 'string', description: 'Email, empty string if not given' },
          interest: { type: 'string', description: 'Short note on what they want and why a call makes sense' },
        },
      },
      messages: [{
        role: 'system',
        content: "Extract the visitor's name, phone number, email if mentioned, and a short note on what they want. Use an empty string for anything not provided.",
      }],
    },
  },
} as const;

export default function VoiceWidget() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [callLive, setCallLive] = useState(false);
  const [err, setErr] = useState('');
  const [caption, setCaption] = useState<Line | null>(null);
  const vapiRef = useRef<any>(null);

  // tidy up any live call on unmount
  useEffect(() => () => { try { vapiRef.current?.stop(); } catch {} }, []);

  async function ensureVapi() {
    if (vapiRef.current) return vapiRef.current;
    const Vapi = (await import('@vapi-ai/web')).default;
    const v = new Vapi(VAPI_PUBLIC);
    v.on('call-start', () => { setCallLive(true); setStatus('listening'); });
    v.on('call-end', () => { setCallLive(false); setStatus('idle'); setCaption(null); });
    v.on('speech-start', () => setStatus('speaking'));
    v.on('speech-end', () => setStatus('listening'));
    v.on('message', (m: any) => {
      if (m?.type === 'transcript' && m?.transcriptType === 'final' && m?.transcript) {
        setCaption({ role: m.role === 'user' ? 'user' : 'assistant', text: m.transcript });
      }
    });
    v.on('error', (e: any) => {
      console.error('vapi', e);
      setErr('Could not start the call. Allow mic access and try again.');
      setCallLive(false);
      setStatus('idle');
    });
    vapiRef.current = v;
    return v;
  }

  async function toggleCall() {
    setErr('');
    if (callLive) { try { vapiRef.current?.stop(); } catch {} return; }
    setStatus('connecting');
    try {
      const v = await ensureVapi();
      await v.start(ASSISTANT as any);
    } catch (e) {
      console.error(e);
      setErr('Could not start the call. Allow mic access and try again.');
      setStatus('idle');
    }
  }

  function close() {
    if (callLive) { try { vapiRef.current?.stop(); } catch {} }
    setOpen(false);
  }

  const label =
    status === 'connecting' ? 'Connecting…'
    : status === 'speaking' ? "Neil's AI is talking…"
    : status === 'listening' ? 'Listening… talk now'
    : 'Tap to talk';

  const micIcon = (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" />
      <path d="M19 11a7 7 0 0 1-14 0M12 18v3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
    </svg>
  );

  return (
    <div class={`vw ${open ? 'open' : ''}`}>
      {open && (
        <div class="vw-panel" role="dialog" aria-label="Voice chat with Neil's AI">
          <div class="vw-head">
            <span class="vw-id"><span class={`vw-dot ${status}`}></span> Neil's AI</span>
            <button class="vw-x" onClick={close} aria-label="Close">✕</button>
          </div>
          <div class="vw-stage">
            <button
              class={`vw-orb ${callLive ? 'live' : ''} ${status}`}
              onClick={toggleCall}
              aria-label={callLive ? 'End call' : 'Start voice call'}
            >
              {callLive
                ? <svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="2.5" /></svg>
                : micIcon}
            </button>
            <p class="vw-status">{err || label}</p>
            {caption && <p class={`vw-cap ${caption.role}`}>{caption.text}</p>}
          </div>
          <p class="vw-foot">Voice only. Ask anything about Neil, or set up a call.</p>
        </div>
      )}

      <button
        class="vw-fab"
        onClick={() => (open ? close() : setOpen(true))}
        aria-label={open ? 'Close voice chat' : "Talk to Neil's AI"}
      >
        {open
          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          : <>{micIcon}<span class="vw-fab-label">Talk to Neil's AI</span></>}
      </button>
    </div>
  );
}
