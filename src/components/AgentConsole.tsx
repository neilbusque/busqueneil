/**
 * AgentConsole — embedded chat + voice agent for the hero (not floating).
 * Chat tab: /api/agent (OpenRouter brain that knows Neil, qualifies the visitor,
 * collects name + phone, and pushes the lead to Otto).
 * Voice tab: real Vapi voice (same assistant/voice as ai.neilb.me).
 */
import { useEffect, useRef, useState } from 'preact/hooks';

type Line = { role: 'user' | 'assistant'; text: string };
type Status = 'idle' | 'thinking' | 'listening' | 'speaking';

const GREETING =
  "Hey, I'm Neil's assistant. Tell me what you're working on and I'll show you how Neil can help, or set up a quick call.";

// Public Vapi client values (safe to ship; same account/voice as ai.neilb.me).
const VAPI_PUBLIC = '3e884913-28cd-469d-ab8d-c7a6634bea57';
const VAPI_ASSISTANT = '91156e19-9454-4a02-9224-080261463a5b';

export default function AgentConsole() {
  const [tab, setTab] = useState<'chat' | 'voice'>('chat');
  const [lines, setLines] = useState<Line[]>([{ role: 'assistant', text: GREETING }]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [callLive, setCallLive] = useState(false);
  const [voiceErr, setVoiceErr] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines, status]);

  // tidy up any live call on unmount
  useEffect(() => () => { try { vapiRef.current?.stop(); } catch {} }, []);

  // ---- chat (OpenRouter brain) ----
  async function send(text: string) {
    const t = text.trim();
    if (!t || status === 'thinking') return;
    const next = [...lines, { role: 'user' as const, text: t }];
    setLines(next);
    setInput('');
    setStatus('thinking');
    try {
      const r = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map((l) => ({ role: l.role, content: l.text })) }),
      });
      const data = await r.json();
      setLines((p) => [...p, { role: 'assistant', text: data?.reply || "Sorry, I didn't catch that." }]);
    } catch {
      setLines((p) => [...p, { role: 'assistant', text: 'Connection hiccup. You can reach Neil at busqueneil@gmail.com.' }]);
    }
    setStatus('idle');
  }

  // ---- voice (Vapi) ----
  async function ensureVapi() {
    if (vapiRef.current) return vapiRef.current;
    const Vapi = (await import('@vapi-ai/web')).default;
    const v = new Vapi(VAPI_PUBLIC);
    v.on('call-start', () => { setCallLive(true); setStatus('listening'); });
    v.on('call-end', () => { setCallLive(false); setStatus('idle'); });
    v.on('speech-start', () => setStatus('speaking'));
    v.on('speech-end', () => setStatus('listening'));
    v.on('message', (m: any) => {
      if (m?.type === 'transcript' && m?.transcriptType === 'final' && m?.transcript) {
        setLines((p) => [...p.slice(-30), { role: m.role === 'user' ? 'user' : 'assistant', text: m.transcript }]);
      }
    });
    v.on('error', (e: any) => {
      console.error('vapi', e);
      setVoiceErr('Could not start the call. Allow mic access and try again.');
      setCallLive(false);
      setStatus('idle');
    });
    vapiRef.current = v;
    return v;
  }

  async function toggleVoice() {
    setVoiceErr('');
    if (callLive) { try { vapiRef.current?.stop(); } catch {} return; }
    setStatus('thinking');
    try {
      const v = await ensureVapi();
      await v.start(VAPI_ASSISTANT);
    } catch (e) {
      console.error(e);
      setVoiceErr('Could not start the call. Allow mic access and try again.');
      setStatus('idle');
    }
  }

  const statusLabel =
    status === 'thinking' ? 'Connecting…' : status === 'listening' ? 'Listening…' : status === 'speaking' ? 'Neil’s AI is talking…' : '';

  return (
    <div class="agent">
      <div class="agent-head">
        <div class="agent-id">
          <span class={`agent-dot ${status}`}></span>
          <span class="agent-name">Talk to Neil's AI</span>
        </div>
        <div class="agent-tabs">
          <button class={tab === 'chat' ? 'on' : ''} onClick={() => setTab('chat')}>Chat</button>
          <button class={tab === 'voice' ? 'on' : ''} onClick={() => setTab('voice')}>Voice</button>
        </div>
      </div>

      <div class="agent-thread" ref={scrollRef}>
        {lines.map((l, i) => (
          <div key={i} class={`agent-msg ${l.role}`}><span>{l.text}</span></div>
        ))}
        {status === 'thinking' && tab === 'chat' && (
          <div class="agent-msg assistant"><span class="typing"><i></i><i></i><i></i></span></div>
        )}
      </div>

      {tab === 'chat' ? (
        <form class="agent-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <input
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            placeholder="Type a message…"
            aria-label="Message"
          />
          <button type="submit" aria-label="Send" disabled={status === 'thinking' || !input.trim()}>↑</button>
        </form>
      ) : (
        <div class="agent-voice">
          <button class={`mic ${callLive ? 'live' : ''}`} onClick={toggleVoice} aria-label={callLive ? 'End call' : 'Start voice call'}>
            {callLive ? (
              <svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="2" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" /><path d="M19 11a7 7 0 0 1-14 0M12 18v3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
            )}
          </button>
          <span class="agent-voice-hint">{voiceErr || statusLabel || 'Tap to start a real voice chat'}</span>
        </div>
      )}
    </div>
  );
}
