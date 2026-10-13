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

/* State colors only: good, fair, poor. Matches --success and --error in site.css. */
const GOOD = '#127A4A';
const FAIR = '#B54708';
const POOR = '#B42318';

function gradeAccent(grade: string): string {
  if (grade === 'A' || grade === 'B') return GOOD;
  if (grade === 'C') return FAIR;
  return POOR;
}
function speedColor(n: number): string {
  return n >= 80 ? GOOD : n >= 50 ? FAIR : POOR;
}
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

const Check = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

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
  const mobileColor = mobileLabel === 'Good' ? GOOD : mobileLabel === 'Fair' ? FAIR : POOR;
  const mobileFill = mobileLabel === 'Good' ? '100%' : mobileLabel === 'Fair' ? '66%' : '30%';

  const R = 52, CIRC = 2 * Math.PI * R;
  const accent = scan ? gradeAccent(scan.grade) : '#0E1116';
  const busy = phase === 'submitting';

  return (
    <div class="az">
      <style>{CSS}</style>

      {(phase === 'idle' || phase === 'error') && (
        <form class="az-card az-form" onSubmit={(e) => { e.preventDefault(); if (url.trim()) runScan(url.trim()); }}>
          <label class="az-label-strong" for="az-url">Your page's link</label>
          <div class="az-field">
            <span class="az-scheme" aria-hidden="true">https://</span>
            <input
              id="az-url"
              class="az-input"
              value={url}
              onInput={(e) => setUrl((e.target as HTMLInputElement).value)}
              placeholder="yourwebsite.com"
              inputMode="url"
              autocomplete="off" autocapitalize="off" spellcheck={false}
              aria-describedby={err ? 'az-err' : 'az-fine'}
            />
          </div>
          <button type="submit" class="btn btn--primary btn--full az-btn">Analyze my page</button>
          {err ? (
            <p class="az-err" id="az-err" role="alert">{err}</p>
          ) : (
            <p class="az-fine" id="az-fine">Free. No signup to see your score.</p>
          )}
        </form>
      )}

      {phase === 'scanning' && (
        <div class="az-card az-scan" aria-live="polite" aria-busy="true">
          <div class="az-scan-head">
            <p class="az-label-strong">Analyzing</p>
            <p class="az-scan-url">{url}</p>
          </div>
          <div class="az-bar" aria-hidden="true"><span class="az-bar-fill" /></div>
          <ol class="az-steps" role="list">
            {STEPS.map((s, i) => (
              <li key={s} class={`az-step ${i === step ? 'is-now' : i < step ? 'is-done' : ''}`}>
                <span class="az-step-mark" aria-hidden="true">{i < step ? <Check size={12} /> : null}</span>
                <span>{s}</span>
                {i === step && <span class="sr-only"> (in progress)</span>}
              </li>
            ))}
          </ol>
        </div>
      )}

      {(phase === 'teaser' || phase === 'submitting' || phase === 'sent') && scan && (
        <div class="az-card az-report">
          <div class="az-head az-rise">
            <div class="az-gauge">
              <svg viewBox="0 0 120 120" class="az-ring" aria-hidden="true">
                <circle class="az-ring-track" cx="60" cy="60" r={R} />
                <circle
                  class="az-ring-arc" cx="60" cy="60" r={R}
                  style={{
                    stroke: accent,
                    strokeDasharray: CIRC,
                    strokeDashoffset: revealed ? CIRC * (1 - scan.score / 100) : CIRC,
                    transition: reduce.current ? 'none' : 'stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)',
                  }}
                />
              </svg>
              <div class="az-gauge-center">
                <p class="az-score"><span class="sr-only">Score </span>{displayScore}<span class="az-score-max">/100</span></p>
              </div>
            </div>
            <div class="az-head-copy">
              <p class="az-grade" style={{ color: accent }}>Grade {scan.grade}</p>
              <p class="az-summary">{scan.summary}</p>
            </div>
          </div>

          <div class="az-tiles az-rise" style={{ animationDelay: '.06s' }}>
            <div class="az-tile">
              <div class="az-tile-head"><span class="az-tile-label">Speed</span><span class="az-tile-val" style={{ color: speedColor(speed) }}>{speed}<i>/100</i></span></div>
              <div class="az-meter"><span class="az-meter-fill" style={{ width: revealed ? `${speed}%` : '0%', background: speedColor(speed) }} /></div>
              <p class="az-tile-sub">Lighthouse mobile</p>
            </div>

            <div class="az-tile">
              <div class="az-tile-head"><span class="az-tile-label">Mobile</span><span class="az-tile-val" style={{ color: mobileColor }}>{mobileLabel}</span></div>
              <div class="az-meter"><span class="az-meter-fill" style={{ width: revealed ? mobileFill : '0%', background: mobileColor }} /></div>
              <p class="az-tile-sub">Viewport and tap targets</p>
            </div>

            <div class="az-tile">
              <div class="az-tile-head"><span class="az-tile-label">Conversion</span><span class="az-tile-val">{conv?.presentCount}<i>/{conv?.totalCount}</i></span></div>
              <div class="az-pips">
                {Array.from({ length: conv?.totalCount ?? 9 }).map((_, i) => (
                  <span key={i} class={`az-pip ${revealed && i < (conv?.presentCount ?? 0) ? 'on' : ''}`} style={{ transitionDelay: `${0.25 + i * 0.05}s` }} />
                ))}
              </div>
              <p class="az-tile-sub">Elements that convert</p>
            </div>
          </div>

          {phase !== 'sent' ? (
            <form class="az-gate az-rise" style={{ animationDelay: '.12s' }} onSubmit={submitEmail}>
              <p class="az-gate-head">Get the full breakdown and the exact fixes</p>
              <p class="az-gate-sub">The complete teardown, with copy you can paste in, lands in your inbox as a PDF.</p>
              <label class="az-label-strong" for="az-email">Your email</label>
              <input id="az-email" class="az-input az-gate-input" value={email} onInput={(e) => setEmail((e.target as HTMLInputElement).value)} type="email" required autocomplete="email" placeholder="you@company.com" />
              <input value={hp} onInput={(e) => setHp((e.target as HTMLInputElement).value)} tabIndex={-1} autocomplete="off" class="az-hp" aria-hidden="true" />
              <button type="submit" class="btn btn--primary btn--full az-btn" disabled={busy} aria-busy={busy ? 'true' : undefined}>
                {busy ? 'Sending your report' : 'Email me the full report'}
              </button>
              {err && <p class="az-err" role="alert">{err}</p>}
            </form>
          ) : (
            <div class="az-sent az-rise" role="status">
              <span class="az-sent-mark" aria-hidden="true"><Check size={20} /></span>
              <p class="az-gate-head">Building your report now</p>
              <p class="az-gate-sub">It takes a few minutes to write your full teardown and PDF. It will land in your inbox shortly. If you do not see it, check spam and the Promotions tab.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Styled with the site tokens (the component renders inside .site). Same bans as site.css:
   no gradients, glows, side accent borders, capitalised text transforms or card shadows. */
const CSS = `
.site .az{width:100%;color:var(--ink);font-family:var(--font-sans);container-type:inline-size}
.site .az *{box-sizing:border-box}
.site .az .az-card{display:grid;gap:16px;padding:28px;border:1px solid var(--line);border-radius:var(--r-lg);background:var(--surface)}
.site .az .az-label-strong{margin:0;font-size:14px;font-weight:500;line-height:1.4;color:var(--ink)}

/* input */
.site .az .az-form{gap:12px}
.site .az .az-field{display:flex;align-items:center;height:48px;padding:0 14px;border:1px solid var(--line-input);border-radius:var(--r-sm);background:var(--surface);transition:border-color var(--dur-hover) ease}
.site .az .az-field:focus-within{border-color:var(--blue);outline:2px solid var(--blue);outline-offset:1px}
.site .az .az-scheme{flex:none;font-size:16px;color:var(--muted);user-select:none}
.site .az .az-input{flex:1;min-width:0;width:100%;height:46px;margin:0;padding:0 0 0 2px;border:0;border-radius:0;background:transparent;box-shadow:none;font:400 16px/1.4 var(--font-sans);color:var(--ink);outline:none}
.site .az .az-input:focus,.site .az .az-input:focus-visible{outline:none}
.site .az .az-input::placeholder{color:var(--placeholder);opacity:1}
.site .az .az-btn{margin-top:4px}
.site .az .az-fine{margin:0;font-size:13px;line-height:1.5;color:var(--muted)}
.site .az .az-err{margin:0;font-size:14px;line-height:1.5;color:var(--error)}
.site .az .az-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}

/* scanning */
.site .az .az-scan{gap:18px}
.site .az .az-scan-head{display:grid;gap:2px;min-width:0}
.site .az .az-scan-url{margin:0;font-size:14px;color:var(--muted);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.site .az .az-bar{position:relative;height:4px;overflow:hidden;border-radius:2px;background:var(--bg-2)}
.site .az .az-bar-fill{position:absolute;inset:0 auto 0 0;width:36%;border-radius:2px;background:var(--blue);animation:az-slide 1.3s var(--ease-out) infinite}
.site .az .az-steps{list-style:none;display:grid;gap:10px;margin:0;padding:0}
.site .az .az-step{display:flex;align-items:center;gap:12px;font-size:15px;line-height:1.4;color:var(--muted);transition:color var(--dur-hover) ease}
.site .az .az-step-mark{flex:none;display:grid;place-items:center;width:20px;height:20px;border:1px solid var(--line-2);border-radius:var(--r-pill);color:#fff;transition:background-color var(--dur-hover) ease,border-color var(--dur-hover) ease}
.site .az .az-step.is-done{color:var(--ink-2)}
.site .az .az-step.is-done .az-step-mark{background:var(--blue);border-color:var(--blue)}
.site .az .az-step.is-now{color:var(--ink);font-weight:500}
.site .az .az-step.is-now .az-step-mark{border-color:var(--blue);background:var(--blue-wash);animation:az-pulse 1.1s ease-in-out infinite}

/* report */
.site .az .az-report{gap:24px}
.site .az .az-head{display:grid;grid-template-columns:132px minmax(0,1fr);gap:24px;align-items:center}
.site .az .az-gauge{position:relative;width:132px;height:132px}
.site .az .az-ring{width:100%;height:100%;transform:rotate(-90deg)}
.site .az .az-ring-track{fill:none;stroke:var(--bg-2);stroke-width:8}
.site .az .az-ring-arc{fill:none;stroke-width:8;stroke-linecap:round}
.site .az .az-gauge-center{position:absolute;inset:0;display:grid;place-items:center}
.site .az .az-score{margin:0;font-size:40px;font-weight:300;line-height:1;letter-spacing:-.03em;color:var(--ink);font-variant-numeric:tabular-nums}
.site .az .az-score-max{margin-left:2px;font-size:14px;font-weight:500;letter-spacing:0;color:var(--muted)}
.site .az .az-head-copy{display:grid;gap:6px;min-width:0}
.site .az .az-grade{margin:0;font-size:17px;font-weight:600;line-height:1.35;letter-spacing:-.01em}
.site .az .az-summary{margin:0;font-size:15px;line-height:1.6;color:var(--ink-2)}
@container (max-width:420px){
  .site .az .az-head{grid-template-columns:1fr;justify-items:start;gap:16px}
}

/* three scores in a ruled row: hairlines from a 1px gap over the line color */
.site .az .az-tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;padding:1px;border-radius:var(--r-md);background:var(--line);overflow:hidden}
.site .az .az-tile{display:grid;gap:10px;align-content:start;min-width:0;padding:16px;background:var(--surface)}
.site .az .az-tile-head{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.site .az .az-tile-label{font-size:13px;font-weight:500;color:var(--muted)}
.site .az .az-tile-val{font-size:20px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.site .az .az-tile-val i{font-style:normal;font-size:12px;font-weight:500;color:var(--muted)}
.site .az .az-meter{height:4px;overflow:hidden;border-radius:2px;background:var(--bg-2)}
.site .az .az-meter-fill{display:block;height:100%;border-radius:2px;transition:width 1s var(--ease-out) .2s}
.site .az .az-pips{display:flex;gap:3px}
.site .az .az-pip{flex:1;height:4px;border-radius:2px;background:var(--bg-2);transition:background-color .35s ease}
.site .az .az-pip.on{background:#127A4A}
.site .az .az-tile-sub{margin:0;font-size:13px;line-height:1.4;color:var(--muted)}
@container (max-width:460px){
  .site .az .az-tiles{grid-template-columns:1fr}
}

/* email capture */
.site .az .az-gate,.site .az .az-sent{display:grid;gap:10px;padding-top:24px;border-top:1px solid var(--line)}
.site .az .az-gate-head{margin:0;font-size:17px;font-weight:600;line-height:1.35;letter-spacing:-.01em;color:var(--ink)}
.site .az .az-gate-sub{margin:0 0 6px;font-size:15px;line-height:1.55;color:var(--muted)}
.site .az .az-gate .az-label-strong{margin-top:4px}
.site .az .az-gate-input{flex:none;height:48px;padding:0 14px;border:1px solid var(--line-input);border-radius:var(--r-sm);background:var(--surface);transition:border-color var(--dur-hover) ease}
.site .az .az-gate-input:focus,.site .az .az-gate-input:focus-visible{border-color:var(--blue);outline:2px solid var(--blue);outline-offset:1px}
.site .az .az-sent{justify-items:start}
.site .az .az-sent-mark{display:grid;place-items:center;width:40px;height:40px;margin-bottom:4px;border-radius:var(--r-md);background:var(--blue-wash);color:var(--blue-ink)}

@media (max-width:640px){
  .site .az .az-card{padding:24px 20px}
}

@keyframes az-pulse{0%,100%{transform:scale(1)}50%{transform:scale(.82)}}
@keyframes az-slide{0%{transform:translateX(-110%)}100%{transform:translateX(290%)}}
@keyframes az-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.site .az .az-rise{animation:az-rise .24s var(--ease-out) both}

@media (prefers-reduced-motion:reduce){
  .site .az .az-rise{animation:none}
  .site .az .az-step.is-now .az-step-mark{animation:none}
  .site .az .az-bar-fill{animation:none;width:100%}
  .site .az .az-meter-fill,.site .az .az-pip,.site .az .az-ring-arc{transition:none}
}
`;
