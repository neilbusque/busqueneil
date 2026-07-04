import { useEffect, useState } from 'preact/hooks';

type Audit = any;
type Scan = { audit: Audit; score: number; grade: string; summary: string; scanToken: string };

export default function Analyzer({ initialUrl = '' }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [phase, setPhase] = useState<'idle'|'scanning'|'teaser'|'submitting'|'sent'|'error'>('idle');
  const [scan, setScan] = useState<Scan | null>(null);
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [err, setErr] = useState('');

  async function runScan(u: string) {
    setErr(''); setPhase('scanning');
    try {
      const res = await fetch('/api/analyzer/scan', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url: u }) });
      const data = await res.json();
      if (!res.ok) {
        let msg = 'That does not look like a valid URL.';
        if (data.error === 'unreachable') msg = "I couldn't reach that page. Check the URL and try again.";
        else if (data.error === 'blocked-url') msg = "That address can't be analyzed. Try a public website URL.";
        else if (res.status === 429) msg = "You've run a few scans already. Give it a minute and try again.";
        setErr(msg); setPhase('error'); return;
      }
      setScan(data); setPhase('teaser');
    } catch { setErr('Something went wrong. Try again.'); setPhase('error'); }
  }

  useEffect(() => { if (initialUrl) runScan(initialUrl); /* eslint-disable-next-line */ }, []);

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
  const mobileLabel = !mob ? '' : !mob.hasViewportMeta ? 'Poor'
    : (mob.tapTargetsOk === false || mob.legibleFontOk === false || mob.contentWidthOk === false) ? 'Fair'
    : 'Good';

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {(phase === 'idle' || phase === 'scanning' || phase === 'error') && (
        <form onSubmit={(e) => { e.preventDefault(); if (url) runScan(url); }}>
          <input value={url} onInput={(e) => setUrl((e.target as HTMLInputElement).value)} placeholder="yourwebsite.com" style={inp} />
          <button type="submit" disabled={phase === 'scanning'} style={btn}>{phase === 'scanning' ? 'Analyzing…' : 'Analyze my page'}</button>
          {err && <p style={{ color: '#f87171' }}>{err}</p>}
        </form>
      )}

      {(phase === 'teaser' || phase === 'submitting' || phase === 'sent') && scan && (
        <div>
          <div style={{ textAlign: 'center', margin: '18px 0' }}>
            <div style={{ fontSize: 64, fontWeight: 800, background: 'linear-gradient(90deg,#7c3aed,#db2777)', WebkitBackgroundClip: 'text', color: 'transparent' }}>{scan.score}<span style={{ fontSize: 24, color: '#9ca3af' }}>/100</span></div>
            <div style={{ color: '#9ca3af' }}>Grade {scan.grade}</div>
          </div>
          <div style={grid}>
            <Metric label="Page speed" value={`${scan.audit.speed.score}/100`} />
            <Metric label="Mobile" value={mobileLabel} />
            <Metric label="Conversion elements" value={`${conv?.presentCount}/${conv?.totalCount}`} />
          </div>
          <p style={{ marginTop: 14 }}>{scan.summary}</p>

          {phase !== 'sent' ? (
            <form onSubmit={submitEmail} style={{ marginTop: 18, borderTop: '1px solid #262633', paddingTop: 16 }}>
              <p style={{ fontWeight: 700 }}>Unlock the full breakdown and the exact fixes.</p>
              <input value={email} onInput={(e) => setEmail((e.target as HTMLInputElement).value)} type="email" required placeholder="Your best email" style={inp} />
              <input value={hp} onInput={(e) => setHp((e.target as HTMLInputElement).value)} tabIndex={-1} autocomplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
              <button type="submit" disabled={phase === 'submitting'} style={btn}>{phase === 'submitting' ? 'Sending…' : 'Email me the full report'}</button>
              {err && <p style={{ color: '#f87171' }}>{err}</p>}
            </form>
          ) : (
            <div style={{ marginTop: 18, borderTop: '1px solid #262633', paddingTop: 16 }}>
              <p style={{ fontWeight: 700 }}>On its way to your inbox 📬</p>
              <p style={{ color: '#9ca3af' }}>Your full report is landing in a minute or two. Check spam if you do not see it.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div style={{ background: '#14141c', border: '1px solid #262633', borderRadius: 10, padding: 12, textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div><div style={{ color: '#9ca3af', fontSize: 12 }}>{label}</div></div>;
}
const inp: any = { width: '100%', padding: 14, borderRadius: 10, border: '1px solid #262633', background: '#0f0f16', color: '#fff', marginBottom: 10 };
const btn: any = { width: '100%', padding: 14, borderRadius: 10, border: 0, color: '#fff', fontWeight: 700, cursor: 'pointer', background: 'linear-gradient(90deg,#7c3aed,#db2777)' };
const grid: any = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 };
