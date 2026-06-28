/**
 * VoiceWidget — floating, voice-only AI agent (Vapi). Lives bottom-right of the
 * viewport, not in the hero. Same Vapi assistant + voice as ai.neilb.me. No chat.
 */
import { useEffect, useRef, useState } from 'preact/hooks';

type Status = 'idle' | 'connecting' | 'listening' | 'speaking';
type Line = { role: 'user' | 'assistant'; text: string };

// Public Vapi client values (safe to ship; same account/voice as ai.neilb.me).
const VAPI_PUBLIC = '3e884913-28cd-469d-ab8d-c7a6634bea57';
const VAPI_ASSISTANT = '91156e19-9454-4a02-9224-080261463a5b';

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
      await v.start(VAPI_ASSISTANT);
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
