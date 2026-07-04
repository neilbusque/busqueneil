import { describe, it, expect } from 'vitest';
import { extractPage } from '../scrapeExtract';
import { buildPageAudit, compositeScore, mobileScore, teaserSummary } from '../audit';

const strong = extractPage(`<!doctype html><html><head><meta name="viewport" content="width=device-width">
  <title>T</title></head><body><h1>Get 10 booked calls this month</h1>
  <img src="hero.jpg"><a href="/x">Book my free audit</a>
  <form><input type="email"></form><p>Money back guarantee. Only 5 spots left. 5 star reviews from clients.</p></body></html>`);

describe('score', () => {
  it('mobileScore is 30 with no viewport', () => {
    const a = buildPageAudit(extractPage('<html><body><h1>x</h1></body></html>'), null);
    expect(mobileScore(a)).toBe(30);
  });
  it('mobileScore is 100 with viewport and no PSI audit failures', () => {
    expect(mobileScore(buildPageAudit(strong, null))).toBe(100);
  });
  it('compositeScore is 0..100 and weights conversion heaviest', () => {
    const s = compositeScore(buildPageAudit(strong, { source: 'psi', performance: 90, audits: {} }));
    expect(s).toBeGreaterThan(0);
    expect(s).toBeLessThanOrEqual(100);
  });
  it('teaserSummary names a missing element when conversion is weakest', () => {
    const weak = extractPage('<html><head><meta name="viewport" content="w"></head><body><p>hi</p></body></html>');
    const summary = teaserSummary(buildPageAudit(weak, { source: 'psi', performance: 95, audits: {} }));
    expect(summary.toLowerCase()).toContain('gap');
    expect(summary).not.toContain('—');
  });
});
