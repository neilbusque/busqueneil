import dns from 'node:dns/promises';

/** True if an IP literal is in a private, loopback, link-local, CGNAT,
 *  multicast, or otherwise reserved range. Malformed input is treated as
 *  unsafe (returns true). */
export function isPrivateIp(ip: string): boolean {
  if (ip.includes(':')) {
    const v = ip.toLowerCase();
    if (v === '::1' || v === '::') return true;
    if (v.startsWith('fe80') || v.startsWith('fc') || v.startsWith('fd')) return true;
    const m = v.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (m) return isPrivateIp(m[1]);
    return false;
  }
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(n => Number.isNaN(n) || n < 0 || n > 255)) return true;
  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a >= 224) return true;
  return false;
}

const BLOCKED_HOSTS = /(^|\.)(localhost|internal|local|localdomain)$/i;

/** Normalize + validate a user-supplied URL for server-side fetching.
 *  Throws Error('invalid-url' | 'blocked-url' | 'unreachable'). Resolves DNS
 *  and rejects if the host is, or resolves to, a private/reserved address.
 *  (Residual DNS-rebinding TOCTOU risk is accepted for this use case.) */
export async function assertPublicUrl(rawUrl: string): Promise<URL> {
  let u: URL;
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(rawUrl);
  try { u = new URL(hasScheme ? rawUrl : `https://${rawUrl}`); }
  catch { throw new Error('invalid-url'); }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('invalid-url');
  const host = u.hostname.replace(/^\[|\]$/g, '');
  if (BLOCKED_HOSTS.test(u.hostname)) throw new Error('blocked-url');
  const isIpLiteral = /^\d+\.\d+\.\d+\.\d+$/.test(host) || host.includes(':');
  if (isIpLiteral) {
    if (isPrivateIp(host)) throw new Error('blocked-url');
    return u;
  }
  let addrs: { address: string }[] = [];
  try { addrs = await dns.lookup(host, { all: true }); }
  catch { throw new Error('unreachable'); }
  if (addrs.length === 0 || addrs.some(a => isPrivateIp(a.address))) throw new Error('blocked-url');
  return u;
}
