import { useEffect, useState } from 'preact/hooks';

const KEY = 'analyzer_exit_seen';
const DAYS = 7;

function suppressed(): boolean {
  try {
    if (location.pathname.startsWith('/analyzer')) return true;
    if (localStorage.getItem('analyzer_converted')) return true;
    const seen = Number(localStorage.getItem(KEY) || '0');
    if (seen && Date.now() - seen < DAYS * 86400_000) return true;
    if ((navigator as any).webdriver) return true;
  } catch {}
  return false;
}

export default function ExitIntentAnalyzer() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (suppressed()) return;
    let armed = true, depth = 0;
    const fire = () => { if (!armed) return; armed = false; setOpen(true); try { localStorage.setItem(KEY, String(Date.now())); } catch {} };
    const onMouseOut = (e: MouseEvent) => { if (e.clientY <= 0) fire(); };
    let lastY = window.scrollY;
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      if (pct > 0.4) depth = 1;
      const up = window.scrollY < lastY - 40; lastY = window.scrollY;
      if (depth && up) fire();
    };
    const dwell = setTimeout(fire, 25000);
    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(dwell); document.removeEventListener('mouseout', onMouseOut); window.removeEventListener('scroll', onScroll); };
  }, []);

  if (!open) return null;
  const go = (e: Event) => { e.preventDefault(); location.href = url ? `/analyzer?url=${encodeURIComponent(url)}` : '/analyzer'; };
  return (
    <div onClick={() => setOpen(false)} style={overlay}>
      <div onClick={(e) => e.stopPropagation()} style={card}>
        <button onClick={() => setOpen(false)} aria-label="Close" style={close}>×</button>
        <h3 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>Before you go, how does your page score?</h3>
        <p style={{ color: '#9ca3af', margin: '0 0 14px' }}>Free instant grade on speed, mobile, and conversion. No signup to see your score.</p>
        <form onSubmit={go}>
          <input value={url} onInput={(e) => setUrl((e.target as HTMLInputElement).value)} placeholder="yourwebsite.com" style={inp} />
          <button type="submit" style={btn}>Analyze my page free</button>
        </form>
      </div>
    </div>
  );
}
const overlay: any = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 };
const card: any = { position: 'relative', maxWidth: 420, width: '100%', background: '#101019', border: '1px solid #262633', borderRadius: 16, padding: 28, color: '#fff' };
const close: any = { position: 'absolute', top: 10, right: 14, background: 'none', border: 0, color: '#9ca3af', fontSize: 24, cursor: 'pointer' };
const inp: any = { width: '100%', padding: 13, borderRadius: 10, border: '1px solid #262633', background: '#0f0f16', color: '#fff', marginBottom: 10 };
const btn: any = { width: '100%', padding: 13, borderRadius: 10, border: 0, color: '#fff', fontWeight: 700, cursor: 'pointer', background: 'linear-gradient(90deg,#7c3aed,#db2777)' };
