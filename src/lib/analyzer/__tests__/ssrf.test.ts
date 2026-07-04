import { describe, it, expect } from 'vitest';
import { isPrivateIp, assertPublicUrl } from '../ssrf';

describe('isPrivateIp', () => {
  it('flags private/reserved ranges', () => {
    for (const ip of ['127.0.0.1', '10.0.0.5', '192.168.1.1', '172.16.0.1', '169.254.169.254', '0.0.0.0', '100.64.0.1', '224.0.0.1', '::1', 'fe80::1', 'fd00::1', '::ffff:127.0.0.1'])
      expect(isPrivateIp(ip)).toBe(true);
  });
  it('allows public addresses', () => {
    for (const ip of ['8.8.8.8', '1.1.1.1', '151.101.1.69', '2606:4700::1111'])
      expect(isPrivateIp(ip)).toBe(false);
  });
  it('treats malformed input as unsafe', () => {
    expect(isPrivateIp('not-an-ip')).toBe(true);
    expect(isPrivateIp('999.1.1.1')).toBe(true);
  });
});

describe('assertPublicUrl', () => {
  it('rejects non-http(s) schemes', async () => {
    await expect(assertPublicUrl('ftp://example.com')).rejects.toThrow('invalid-url');
  });
  it('rejects loopback + metadata IP literals', async () => {
    await expect(assertPublicUrl('http://127.0.0.1/x')).rejects.toThrow('blocked-url');
    await expect(assertPublicUrl('http://169.254.169.254/latest/meta-data')).rejects.toThrow('blocked-url');
  });
  it('rejects localhost hostname', async () => {
    await expect(assertPublicUrl('http://localhost:8080')).rejects.toThrow('blocked-url');
  });
});
