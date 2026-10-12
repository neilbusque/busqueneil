import { describe, expect, it } from 'vitest';
import * as site from '../site';
import { CHANNELS, CLOSING, FOOTER_COLUMNS, NAV, NAV_CONTACT, SERVICES, SITE, mailUrl, waUrl } from '../site';

/** Every string reachable from the module's exports. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => strings(v, out));
  return out;
}

describe('waUrl', () => {
  it('builds a wa.me link with the message encoded', () => {
    expect(waUrl('Hi Neil, I want to build: A custom CRM')).toBe(
      'https://wa.me/19083164140?text=Hi%20Neil%2C%20I%20want%20to%20build%3A%20A%20custom%20CRM',
    );
  });

  it('drops the text param when there is no message', () => {
    expect(waUrl()).toBe('https://wa.me/19083164140');
    expect(waUrl('   ')).toBe('https://wa.me/19083164140');
  });

  it('uses the number with its country code', () => {
    expect(SITE.whatsapp).toMatch(/^1\d{10}$/);
  });
});

describe('shared site data', () => {
  it('has no em or en dashes in any string', () => {
    const bad = strings(site).filter((s) => /[–—]/.test(s));
    expect(bad).toEqual([]);
  });

  it('only links to site paths, https pages or mail', () => {
    const hrefs = [
      ...NAV.map((n) => n.href),
      NAV_CONTACT.href,
      ...CHANNELS.map((c) => c.href),
      CLOSING.primary.href,
      CLOSING.secondary.href,
      ...FOOTER_COLUMNS.flatMap((c) => c.links.map((l) => l.href)),
      ...SERVICES.map((s) => s.href),
    ];
    for (const href of hrefs) expect(href).toMatch(/^(\/[a-z0-9/-]*|https:\/\/\S+|mailto:\S+)$/);
    expect(hrefs.some((h) => /github\.com/i.test(h))).toBe(false);
  });

  it('builds mail links for the public address', () => {
    expect(mailUrl()).toBe(`mailto:${SITE.email}`);
    expect(mailUrl('Hello there')).toBe(`mailto:${SITE.email}?subject=Hello%20there`);
  });

  it('keeps quotes empty until real approved ones exist', () => {
    expect(site.QUOTES).toEqual([]);
  });

  it('gives every stat a source', () => {
    for (const s of site.STATS) expect(s.source.trim().length).toBeGreaterThan(0);
  });
});
