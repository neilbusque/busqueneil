import dns from 'node:dns/promises';
import ipaddr from 'ipaddr.js';

/** True unless `ip` is a globally-routable unicast address. Malformed input,
 *  private, loopback, link-local, unique-local, CGNAT, multicast, reserved,
 *  and IPv4-mapped/embedded IPv6 forms all return true (unsafe). Uses ipaddr.js
 *  so canonicalized IPv6 (e.g. ::ffff:a9fe:a9fe) is classified correctly. */
export function isPrivateIp(ip: string): boolean {
  let addr: ipaddr.IPv4 | ipaddr.IPv6;
  try { addr = ipaddr.parse(ip); } catch { return true; }
  if (addr.kind() === 'ipv6') {
    const v6 = addr as ipaddr.IPv6;
    if (v6.isIPv4MappedAddress()) return v6.toIPv4Address().range() !== 'unicast';
  }
  return addr.range() !== 'unicast';
}

const BLOCKED_HOSTS = /(^|\.)(localhost|internal|local|localdomain)$/i;

/** Normalize + validate a user-supplied URL for server-side fetching.
 *  Throws Error('invalid-url' | 'blocked-url' | 'unreachable'). Rejects hosts
 *  that are, or resolve to, a private/reserved address. Residual DNS-rebinding
 *  TOCTOU between this check and the later fetch is an accepted limitation. */
export async function assertPublicUrl(rawUrl: string): Promise<URL> {
  let u: URL;
  try { u = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`); }
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
