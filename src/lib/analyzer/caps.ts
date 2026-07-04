const env = (k: string) => process.env[k] ?? (import.meta as any).env?.[k];

const PER_EMAIL_DAY = 3;
const GLOBAL_DAY = 300;

function sb() {
  const url = env('PUBLIC_SUPABASE_URL');
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return null;
  return { url, key, headers: { apikey: key, authorization: `Bearer ${key}`, 'content-type': 'application/json' } };
}
function since(): string { return new Date(Date.now() - 86400_000).toISOString(); }

export async function recordLead(l: { email: string; url: string; score: number; grade: string }): Promise<{ ok: boolean; reason?: string }> {
  const c = sb();
  if (!c) return { ok: false, reason: 'server misconfigured' };
  // Per-email/day cap.
  const eRes = await fetch(`${c.url}/rest/v1/analyzer_leads?select=id&email=eq.${encodeURIComponent(l.email)}&created_at=gte.${since()}`, { headers: { ...c.headers, Prefer: 'count=exact' } });
  const eCount = Number(eRes.headers.get('content-range')?.split('/')?.[1] ?? '0');
  if (eCount >= PER_EMAIL_DAY) return { ok: false, reason: 'daily-email-cap' };
  // Global/day cap.
  const gRes = await fetch(`${c.url}/rest/v1/analyzer_leads?select=id&created_at=gte.${since()}`, { headers: { ...c.headers, Prefer: 'count=exact' } });
  const gCount = Number(gRes.headers.get('content-range')?.split('/')?.[1] ?? '0');
  if (gCount >= GLOBAL_DAY) return { ok: false, reason: 'global-cap' };
  // Insert.
  const ins = await fetch(`${c.url}/rest/v1/analyzer_leads`, { method: 'POST', headers: c.headers, body: JSON.stringify(l) });
  return ins.ok ? { ok: true } : { ok: false, reason: 'insert-failed' };
}

export async function markDelivered(email: string, url: string): Promise<void> {
  const c = sb();
  if (!c) return;
  await fetch(`${c.url}/rest/v1/analyzer_leads?email=eq.${encodeURIComponent(email)}&url=eq.${encodeURIComponent(url)}`, {
    method: 'PATCH', headers: c.headers, body: JSON.stringify({ delivered: true }),
  });
}
