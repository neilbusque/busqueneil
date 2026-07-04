const env = (k: string) => process.env[k] ?? (import.meta as any).env?.[k];

const PER_EMAIL_DAY = 3;
const PER_IP_DAY = 20;
const GLOBAL_DAY = 300;

function sb() {
  const url = env('PUBLIC_SUPABASE_URL');
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return null;
  return { url, key, headers: { apikey: key, authorization: `Bearer ${key}`, 'content-type': 'application/json' } };
}
function since(): string { return new Date(Date.now() - 86400_000).toISOString(); }

async function countSince(c: NonNullable<ReturnType<typeof sb>>, filter: string): Promise<number> {
  const q = filter ? `${filter}&` : '';
  const res = await fetch(`${c.url}/rest/v1/analyzer_leads?select=id&${q}created_at=gte.${since()}`, { headers: { ...c.headers, Prefer: 'count=exact' } });
  return Number(res.headers.get('content-range')?.split('/')?.[1] ?? '0');
}

export async function recordLead(l: { email: string; url: string; score: number; grade: string; ip?: string }): Promise<{ ok: boolean; reason?: string }> {
  const c = sb();
  if (!c) return { ok: false, reason: 'server misconfigured' };
  if (await countSince(c, `email=eq.${encodeURIComponent(l.email)}`) >= PER_EMAIL_DAY) return { ok: false, reason: 'daily-email-cap' };
  if (l.ip && await countSince(c, `ip=eq.${encodeURIComponent(l.ip)}`) >= PER_IP_DAY) return { ok: false, reason: 'daily-ip-cap' };
  if (await countSince(c, '') >= GLOBAL_DAY) return { ok: false, reason: 'global-cap' };
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
