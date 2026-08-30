import { describe, expect, it } from 'vitest';
import { isNowFresh, NOW_FRESH_DAYS } from '../now';

const NOW = Date.UTC(2026, 7, 30, 12);

describe('isNowFresh', () => {
  it('accepts a recent update', () => {
    expect(isNowFresh(new Date(NOW - 7 * 24 * 60 * 60 * 1000).toISOString(), NOW)).toBe(true);
  });

  it('falls back when an update is stale', () => {
    expect(isNowFresh(new Date(NOW - NOW_FRESH_DAYS * 24 * 60 * 60 * 1000).toISOString(), NOW)).toBe(false);
  });

  it('falls back for missing, invalid, or future dates', () => {
    expect(isNowFresh(null, NOW)).toBe(false);
    expect(isNowFresh('not-a-date', NOW)).toBe(false);
    expect(isNowFresh(new Date(NOW + 1000).toISOString(), NOW)).toBe(false);
  });
});
