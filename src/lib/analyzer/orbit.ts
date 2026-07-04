const env = (k: string) => process.env[k] ?? (import.meta as any).env?.[k];

/** Upsert the visitor into Orbit CRM via its MCP JSON-RPC endpoint.
 *  ORBIT_MCP_URL = https://<orbit-project>.supabase.co/functions/v1/mcp
 *  ORBIT_MCP_KEY = orb_mcp_...  (must belong to a Pro/Team Orbit workspace) */
export async function upsertOrbitLead(l: { email: string; url: string; score: number; grade: string }): Promise<boolean> {
  const base = env('ORBIT_MCP_URL');
  const key = env('ORBIT_MCP_KEY');
  if (!base || !key) return false;
  const body = {
    jsonrpc: '2.0', id: 1, method: 'tools/call',
    params: {
      name: 'upsert_contact',
      arguments: {
        email: l.email,
        website: l.url,
        segment: 'lead_prospect',
        about: 'Landing-page analyzer lead',
        note: `Ran the free landing page analyzer on ${l.url} and scored ${l.score}/100 (grade ${l.grade}). Opted in for the full PDF breakdown. [analyzer-lead]`,
      },
    },
  };
  try {
    const res = await fetch(base, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) return false;
    const j: any = await res.json();
    return !j?.error && j?.result?.isError !== true;
  } catch { return false; }
}
