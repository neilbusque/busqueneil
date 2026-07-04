import { describe, it, expect } from 'vitest';
import { signScan, verifyScan } from '../token';

const SECRET = 'test-secret';
const base = { url: 'https://x.com', audit: { a: 1 }, score: 62, grade: 'C' };

describe('scan token', () => {
  it('round-trips a valid token', () => {
    const t = signScan(base, SECRET);
    const v = verifyScan(t, SECRET);
    expect(v?.url).toBe('https://x.com');
    expect(v?.score).toBe(62);
  });
  it('rejects a tampered payload', () => {
    const t = signScan(base, SECRET);
    const [b64] = t.split('.');
    expect(verifyScan(`${b64}.deadbeef`, SECRET)).toBeNull();
  });
  it('rejects a wrong secret', () => {
    expect(verifyScan(signScan(base, SECRET), 'other')).toBeNull();
  });
});
