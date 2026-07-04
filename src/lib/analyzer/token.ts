import crypto from 'node:crypto';

const TTL_MS = 30 * 60 * 1000;

export interface ScanPayload {
  url: string;
  audit: unknown;
  score: number;
  grade: string;
  iat: number;
}

export function signScan(payload: Omit<ScanPayload, 'iat'>, secret: string): string {
  const body = JSON.stringify({ ...payload, iat: Date.now() });
  const b64 = Buffer.from(body).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

export function verifyScan(token: string, secret: string): ScanPayload | null {
  const [b64, sig] = (token || '').split('.');
  if (!b64 || !sig) return null;
  const expected = crypto.createHmac('sha256', secret).update(b64).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload: ScanPayload;
  try { payload = JSON.parse(Buffer.from(b64, 'base64url').toString()); } catch { return null; }
  if (typeof payload.iat !== 'number' || Date.now() - payload.iat > TTL_MS) return null;
  return payload;
}
