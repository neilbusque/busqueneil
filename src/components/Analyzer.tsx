import { useEffect, useRef, useState } from 'preact/hooks';

type Audit = any;
type Scan = { audit: Audit; score: number; grade: string; summary: string; scanToken: string };

const STEPS = [
  'Loading your page',
  'Measuring speed on mobile',
  'Reading your headline and CTA',
  'Checking your form and proof',
  'Scoring your page',
];
const MIN_LOAD_MS = 2600;

function gradeAccent(grade: string): string {
  if (grade === 'A' || grade === 'B') return '#16A34A'; // emerald
  if (grade === 'C') return '#B45309'; // amber
  return '#B4231F'; // rose
}
function speedColor(n: number): string {
  return n >= 80 ? '#16A34A' : n >= 50 ? '#B45309' : '#B4231F';
}
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

export default function Analyzer({ initialUrl = '' }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'teaser' | 'submitting' | 'sent' | 'error'>('idle');
  const [scan, setScan] = useState<Scan | null>(null);
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [err, setErr] = useState('');
  const [step, setStep] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  async function runScan(u: string) {
    setErr(''); setPhase('scanning');
    const startedAt = Date.now();
    try {
      const res = await fetch('/api/analyzer/scan', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url: u }) });
      const data = await res.json();
      const settle = () => {
        if (!res.ok) {
          let msg = 'That does not look like a valid URL.';
          if (data.error === 'unreachable') msg = "I couldn't reach that page. Check the URL and try again.";
          else if (data.error === 'blocked-url') msg = "That address can't be analyzed. Try a public website URL.";
          else if (res.status === 429) msg = "You've run a few scans already. Give it a minute and try again.";
          setErr(msg); setPhase('error'); return;
        }
        setScan(data); setPhase('teaser');
      };
      const wait = Math.max(0, MIN_LOAD_MS - (Date.now() - startedAt));
      setTimeout(settle, reduce.current ? 0 : wait);
    } catch {
      const wait = Math.max(0, MIN_LOAD_MS - (Date.now() - startedAt));
      setTimeout(() => { setErr('Something went wrong. Try again.'); setPhase('error'); }, reduce.current ? 0 : wait);
    }
  }

  useEffect(() => { if (initialUrl) runScan(initialUrl); /* eslint-disable-next-line */ }, []);

  // Step the scanning status line while a scan runs; hold on the last step.
  useEffect(() => {
    if (phase !== 'scanning') return;
    setStep(0);
    const id = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 640);
    return () => clearInterval(id);
  }, [phase]);

  // Reveal sequence: draw the ring + count the score up.
  useEffect(() => {
    if (phase !== 'teaser' || !scan) return;
    if (reduce.current) { setDisplayScore(scan.score); setRevealed(true); return; }
    setRevealed(false); setDisplayScore(0);
    const raf0 = requestAnimationFrame(() => setRevealed(true));
    const dur = 1100, t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setDisplayScore(Math.round(easeOut(p) * scan.score));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf0); cancelAnimationFrame(raf); };
  }, [phase, scan]);

  async function submitEmail(e: Event) {
    e.preventDefault();
    if (!scan) return;
    setPhase('submitting'); setErr('');
    try {
      const res = await fetch('/api/analyzer/deliver', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, hp, scanToken: scan.scanToken }) });
      const data = await res.json();
      if (!res.ok) {
        let msg = 'Something went wrong. Try again, or just reply to my email.';
        if (data.error === 'expired') msg = 'That result expired. Please run the analysis again.';
        else if (data.error === 'invalid-email') msg = "That email doesn't look right. Mind checking it?";
        else if (res.status === 429) msg = data.error;
        setErr(msg); setPhase('teaser'); return;
      }
      try { localStorage.setItem('analyzer_converted', '1'); } catch {}
      setPhase('sent');
    } catch { setErr('Could not send. Try again.'); setPhase('teaser'); }
  }

  const conv = scan?.audit?.conversion;
  const mob = scan?.audit?.mobile;
  const speed = scan?.audit?.speed?.score ?? 0;
  const mobileLabel = !mob ? '' : !mob.hasViewportMeta ? 'Poor'
    : (mob.tapTargetsOk === false || mob.legibleFontOk === false || mob.contentWidthOk === false) ? 'Fair'
    : 'Good';
  const mobileColor = mobileLabel === 'Good' ? '#16A34A' : mobileLabel === 'Fair' ? '#B45309' : '#B4231F';

  const R = 52, CIRC = 2 * Math.PI * R;
  const accent = scan ? gradeAccent(scan.grade) : '#0A0A0A';

  return (
    <div class="az">
      <style>{CSS}</style>

      {(phase === 'idle' || phase === 'error') && (
        <form class="az-console az-rise" onSubmit={(e) => { e.preventDefault(); if (url.trim()) runScan(url.trim()); }}>
          <div class="az-eyebrow">Instant page report</div>
          <div class="az-field">
            <span class="az-field-scheme">https://</span>
            <input
              class="az-input"
              value={url}
              onInput={(e) => setUrl((e.target as HTMLInputElement).value)}
              placeholder="yourwebsite.com"
              autocomplete="off" autocapitalize="off" spellcheck={false}
              aria-label="Your website URL"
            />
          </div>
          <button type="submit" class="az-cta">Analyze my page</button>
          {err && <p class="az-err" role="alert">{err}</p>}
          <p class="az-fineprint">Free. No signup to see your score.</p>
        </form>
      )}

      {phase === 'scanning' && (
        <div class="az-scan az-rise" aria-live="polite" aria-busy="true">
          <div class="az-scanner"><span class="az-scanner-core" /></div>
          <div class="az-scan-label">Analyzing</div>
          <div class="az-steps">
            {STEPS.map((s, i) => (
              <div key={s} class={`az-step ${i === step ? 'is-now' : i < step ? 'is-done' : ''}`}>
                <span class="az-step-dot" />{s}
              </div>
            ))}
          </div>
          <div class="az-bar"><span class="az-bar-fill" /></div>
        </div>
      )}

      {(phase === 'teaser' || phase === 'submitting' || phase === 'sent') && scan && (
        <div class="az-report">
          <div class="az-gauge az-rise">
            <svg viewBox="0 0 120 120" class="az-ring" aria-hidden="true">
              <circle class="az-ring-track" cx="60" cy="60" r={R} />
              <circle
                class="az-ring-arc" cx="60" cy="60" r={R}
                style={{
                  stroke: accent,
                  strokeDasharray: CIRC,
                  strokeDashoffset: revealed ? CIRC * (1 - scan.score / 100) : CIRC,
                  transition: reduce.current ? 'none' : 'stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)',
                  filter: `drop-shadow(0 0 6px ${accent}66)`,
                }}
              />
            </svg>
            <div class="az-gauge-center">
              <div class="az-score">{displayScore}<span class="az-score-max">/100</span></div>
              <div class="az-grade" style={{ color: accent }}>Grade {scan.grade}</div>
            </div>
          </div>

          <div class="az-tiles">
            <div class="az-tile az-rise" style={{ animationDelay: '.05s' }}>
              <div class="az-tile-head"><span class="az-tile-label">Speed</span><span class="az-tile-val" style={{ color: speedColor(speed) }}>{speed}<i>/100</i></span></div>
              <div class="az-meter"><span class="az-meter-fill" style={{ width: revealed ? `${speed}%` : '0%', background: speedColor(speed) }} /></div>
              <div class="az-tile-sub">Lighthouse mobile</div>
            </div>

            <div class="az-tile az-rise" style={{ animationDelay: '.12s' }}>
              <div class="az-tile-head"><span class="az-tile-label">Mobile</span><span class="az-tile-val" style={{ color: mobileColor }}>{mobileLabel}</span></div>
              <div class="az-meter"><span class="az-meter-fill" style={{ width: revealed ? (mobileLabel === 'Good' ? '100%' : mobileLabel === 'Fair' ? '66%' : '30%') : '0%', background: mobileColor }} /></div>
              <div class="az-tile-sub">Viewport and tap targets</div>
            </div>

            <div class="az-tile az-rise" style={{ animationDelay: '.19s' }}>
              <div class="az-tile-head"><span class="az-tile-label">Conversion</span><span class="az-tile-val">{conv?.presentCount}<i>/{conv?.totalCount}</i></span></div>
              <div class="az-pips">
                {Array.from({ length: conv?.totalCount ?? 9 }).map((_, i) => (
                  <span key={i} class={`az-pip ${revealed && i < (conv?.presentCount ?? 0) ? 'on' : ''}`} style={{ transitionDelay: `${0.25 + i * 0.05}s` }} />
                ))}
              </div>
              <div class="az-tile-sub">Elements that convert</div>
            </div>
          </div>

          <p class="az-summary az-rise" style={{ animationDelay: '.24s' }}>{scan.summary}</p>

          {phase !== 'sent' ? (
            <form class="az-gate az-rise" style={{ animationDelay: '.3s' }} onSubmit={submitEmail}>
              <div class="az-gate-head">Unlock the full breakdown and the exact fixes</div>
              <div class="az-gate-sub">The complete teardown, with rewrite-ready copy, lands in your inbox.</div>
              <input class="az-input az-gate-input" value={email} onInput={(e) => setEmail((e.target as HTMLInputElement).value)} type="email" required placeholder="Your best email" aria-label="Your email" />
              <input value={hp} onInput={(e) => setHp((e.target as HTMLInputElement).value)} tabIndex={-1} autocomplete="off" class="az-hp" aria-hidden="true" />
              <button type="submit" class="az-cta" disabled={phase === 'submitting'}>
                {phase === 'submitting' ? 'Sending your report…' : 'Email me the full report'}
              </button>
              {err && <p class="az-err" role="alert">{err}</p>}
            </form>
          ) : (
            <div class="az-sent az-rise">
              <div class="az-sent-mark">✓</div>
              <div class="az-sent-head">Building your report now</div>
              <p class="az-sent-sub">It takes a few minutes to write your full teardown and PDF. It will land in your inbox shortly. If you do not see it, check spam and the Promotions tab.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const CSS = `
.az{max-width:560px;margin:0 auto;font-family:'Geist',system-ui,sans-serif;color:#0A0A0A}
.az *{box-sizing:border-box}
.az-eyebrow{font-family:'Geist Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#737373;margin-bottom:12px}
.az-console{background:#FFFFFF;border:1px solid #EAEAEA;border-radius:8px;padding:22px;box-shadow:none}
.az-field{display:flex;align-items:center;gap:2px;background:#FFFFFF;border:1px solid #D4D4D4;border-radius:6px;padding:0 14px;transition:border-color .2s,box-shadow .2s}
.az-field:focus-within{border-color:var(--sun,#FFE45C);box-shadow:0 0 0 3px rgba(255,228,92,.45)}
.az-field-scheme{font-family:'Geist Mono',ui-monospace,monospace;font-size:14px;color:#525252;user-select:none}
.az .az-input{flex:1;width:100%;border:0;background:transparent;color:#0A0A0A;font-size:16px;padding:15px 4px;outline:none;font-family:'Geist Mono',ui-monospace,monospace;border-radius:0}
.az .az-input:focus{outline:none}
.az .az-input::placeholder{color:#737373}
.az-cta{width:100%;margin-top:12px;padding:15px;border:0;border-radius:6px;color:#fff;font-weight:700;font-size:15px;cursor:pointer;background:var(--ink,#0A0A0A);background-size:180% 100%;transition:transform .15s,box-shadow .2s,background-position .5s;box-shadow:none}
.az-cta:hover{transform:translateY(-1px);background-position:100% 0;box-shadow:0 16px 40px -12px rgba(219,39,119,.75)}
.az-cta:active{transform:translateY(0)}
.az-cta:disabled{opacity:.7;cursor:default;transform:none}
.az-fineprint{margin:12px 0 0;text-align:center;font-size:12px;color:#525252}
.az-err{margin:12px 0 0;color:#B4231F;font-size:14px}
.az-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}

/* scanning */
.az-scan{background:#FFFFFF;border:1px solid #EAEAEA;border-radius:8px;padding:34px 22px;text-align:center;box-shadow:none}
.az-scanner{width:96px;height:96px;margin:0 auto 18px;border-radius:50%;position:relative;background:conic-gradient(from 0deg,rgba(10,10,10,0) 0 55%,#D4D4D4 82%,#0A0A0A 100%);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 9px),#000 calc(100% - 8px));mask:radial-gradient(farthest-side,transparent calc(100% - 9px),#000 calc(100% - 8px));animation:az-spin 1s linear infinite}
.az-scanner-core{position:absolute;inset:0;margin:auto;width:10px;height:10px;border-radius:50%;background:#0A0A0A;box-shadow:none;animation:az-pulse 1.4s ease-in-out infinite}
.az-scan-label{font-family:'Geist Mono',ui-monospace,monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#737373;margin-bottom:18px}
.az-steps{display:inline-flex;flex-direction:column;gap:9px;text-align:left;margin-bottom:20px}
.az-step{display:flex;align-items:center;gap:10px;font-size:14px;color:#737373;transition:color .3s}
.az-step .az-step-dot{width:7px;height:7px;border-radius:50%;background:#EAEAEA;transition:background .3s,box-shadow .3s}
.az-step.is-done{color:#737373}
.az-step.is-done .az-step-dot{background:#16A34A}
.az-step.is-now{color:#0A0A0A}
.az-step.is-now .az-step-dot{background:#0A0A0A;box-shadow:none;animation:az-pulse 1.1s ease-in-out infinite}
.az-bar{height:4px;border-radius:99px;background:#EAEAEA;overflow:hidden}
.az-bar-fill{display:block;height:100%;width:38%;border-radius:99px;background:var(--ink,#0A0A0A);animation:az-slide 1.3s ease-in-out infinite}

/* report */
.az-report{}
.az-gauge{position:relative;width:180px;height:180px;margin:6px auto 26px}
.az-ring{width:100%;height:100%;transform:rotate(-90deg)}
.az-ring-track{fill:none;stroke:#EAEAEA;stroke-width:9}
.az-ring-arc{fill:none;stroke-width:9;stroke-linecap:round}
.az-gauge-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.az-score{font-family:'Geist Mono',ui-monospace,monospace;font-size:52px;font-weight:700;line-height:1;letter-spacing:-.02em}
.az-score-max{font-size:18px;color:#525252;margin-left:2px}
.az-grade{font-family:'Geist Mono',ui-monospace,monospace;font-size:13px;letter-spacing:.14em;text-transform:uppercase;margin-top:8px;font-weight:600}
.az-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.az-tile{background:#FAFAFA;border:1px solid #EAEAEA;border-radius:8px;padding:14px}
.az-tile-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px}
.az-tile-label{font-family:'Geist Mono',ui-monospace,monospace;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#737373}
.az-tile-val{font-family:'Geist Mono',ui-monospace,monospace;font-size:20px;font-weight:700}
.az-tile-val i{font-style:normal;font-size:12px;color:#525252;font-weight:400}
.az-meter{height:5px;border-radius:99px;background:#EAEAEA;overflow:hidden}
.az-meter-fill{display:block;height:100%;border-radius:99px;transition:width 1s cubic-bezier(.2,.8,.2,1) .2s}
.az-pips{display:flex;gap:4px}
.az-pip{flex:1;height:5px;border-radius:2px;background:#EAEAEA;transition:background .35s}
.az-pip.on{background:#16A34A}
.az-tile-sub{margin-top:9px;font-size:11px;color:#525252}
.az-summary{margin:20px 0 0;font-size:15.5px;line-height:1.6;color:#525252}
.az-gate{margin-top:22px;padding-top:22px;border-top:1px solid #EAEAEA}
.az-gate-head{font-size:17px;font-weight:700;margin-bottom:4px}
.az-gate-sub{font-size:13.5px;color:#737373;margin-bottom:14px}
.az .az-gate-input{width:100%;background:#FFFFFF;color:#0A0A0A;border:1px solid #D4D4D4;border-radius:6px;padding:15px 14px;font-family:'Geist Mono',ui-monospace,monospace;transition:border-color .2s,box-shadow .2s}
.az .az-gate-input:focus{border-color:var(--sun,#FFE45C);box-shadow:0 0 0 3px rgba(255,228,92,.45);outline:none}
.az-sent{margin-top:22px;padding-top:22px;border-top:1px solid #EAEAEA;text-align:center}
.az-sent-mark{width:46px;height:46px;margin:0 auto 12px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;color:#FFFFFF;font-weight:800;background:linear-gradient(135deg,#16A34A,#0A0A0A);box-shadow:0 0 26px -4px rgba(52,211,153,.7)}
.az-sent-head{font-size:18px;font-weight:700}
.az-sent-sub{margin:6px 0 0;font-size:13.5px;color:#737373}

@keyframes az-spin{to{transform:rotate(360deg)}}
@keyframes az-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.55}}
@keyframes az-slide{0%{transform:translateX(-120%)}100%{transform:translateX(360%)}}
@keyframes az-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.az-rise{animation:az-rise .55s cubic-bezier(.2,.8,.2,1) both}

@media (prefers-reduced-motion:reduce){
  .az-rise{animation:none}
  .az-scanner{animation:none}
  .az-scanner-core,.az-step.is-now .az-step-dot{animation:none}
  .az-bar-fill{animation:none;width:100%}
  .az-meter-fill,.az-pip,.az-ring-arc{transition:none}
}
`;
