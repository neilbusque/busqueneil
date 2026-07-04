import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('node:dns/promises', () => ({ default: { lookup: vi.fn() } }));
import dns from 'node:dns/promises';
import { isPrivateIp, assertPublicUrl } from '../ssrf';

const lookup = dns.lookup as unknown as ReturnType<typeof vi.fn>;
// Block body is required: `mockReset()` returns the mock fn itself for chaining,
// and vitest treats a value returned from `beforeEach` as an implicit teardown
// callback — an arrow-expression body here would silently invoke `lookup()` a
// second time after each test, producing a stray unhandled rejection.
beforeEach(() => { lookup.mockReset(); });

describe('isPrivateIp', () => {
  it('flags private/reserved ranges', () => {
    for (const ip of ['127.0.0.1','10.0.0.5','192.168.1.1','172.16.0.1','169.254.169.254','0.0.0.0','100.64.0.1','224.0.0.1','::1','fe80::1','fd00::1','::ffff:127.0.0.1'])
      expect(isPrivateIp(ip)).toBe(true);
  });
  it('flags canonicalized IPv4-mapped IPv6 (hex hextets)', () => {
    expect(isPrivateIp('::ffff:a9fe:a9fe')).toBe(true); // 169.254.169.254
    expect(isPrivateIp('::ffff:7f00:1')).toBe(true);    // 127.0.0.1
  });
  it('allows public addresses', () => {
    for (const ip of ['8.8.8.8','1.1.1.1','151.101.1.69','2606:4700::1111'])
      expect(isPrivateIp(ip)).toBe(false);
    expect(isPrivateIp('::ffff:8.8.8.8')).toBe(false);
  });
  it('treats malformed input as unsafe', () => {
    expect(isPrivateIp('not-an-ip')).toBe(true);
    expect(isPrivateIp('999.1.1.1')).toBe(true);
  });
});

describe('assertPublicUrl', () => {
  it('rejects non-http(s) schemes as invalid-url', async () => {
    await expect(assertPublicUrl('ftp://example.com')).rejects.toThrow('invalid-url');
  });
  it('blocks loopback + metadata IP literals', async () => {
    await expect(assertPublicUrl('http://127.0.0.1/x')).rejects.toThrow('blocked-url');
    await expect(assertPublicUrl('http://169.254.169.254/latest/meta-data')).rejects.toThrow('blocked-url');
  });
  it('blocks bracketed IPv4-mapped IPv6 literals (metadata + loopback)', async () => {
    await expect(assertPublicUrl('http://[::ffff:169.254.169.254]/')).rejects.toThrow('blocked-url');
    await expect(assertPublicUrl('http://[::ffff:127.0.0.1]/')).rejects.toThrow('blocked-url');
  });
  it('blocks localhost hostname without touching DNS', async () => {
    await expect(assertPublicUrl('http://localhost:8080')).rejects.toThrow('blocked-url');
    expect(lookup).not.toHaveBeenCalled();
  });
  it('blocks a hostname that resolves to a private address', async () => {
    lookup.mockResolvedValue([{ address: '10.0.0.5', family: 4 }]);
    await expect(assertPublicUrl('http://sneaky.example.com')).rejects.toThrow('blocked-url');
  });
  it('throws unreachable when DNS lookup fails', async () => {
    lookup.mockRejectedValue(new Error('ENOTFOUND'));
    await expect(assertPublicUrl('http://nope.example.com')).rejects.toThrow('unreachable');
  });
  it('allows a hostname that resolves to a public address', async () => {
    lookup.mockResolvedValue([{ address: '8.8.8.8', family: 4 }]);
    const u = await assertPublicUrl('https://example.com/path');
    expect(u.hostname).toBe('example.com');
  });
});
