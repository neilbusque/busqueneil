import { describe, expect, it } from 'vitest';
import * as site from '../site';
import { flagged } from './banned';
import {
  ABOUT_FACTS,
  CAPABILITIES,
  CHANNELS,
  CLOSING,
  FAQS,
  FEATURED_PROJECT,
  FEATURED_TOOL,
  FIT,
  FOOTER_COLUMNS,
  HELD_TOOLS,
  INDUSTRIES,
  MORE_BUILDS,
  NAV,
  NAV_CONTACT,
  NAV_CTA,
  PROJECTS,
  PROJECT_CATEGORY,
  PROMPT,
  QUOTES,
  SERVICES,
  SERVICE_CARDS,
  SITE,
  STATS,
  STEPS,
  TOOLS,
  WORK_TABS,
  mailUrl,
  waFeatured,
  waFreeTools,
  waGlobal,
  waOneBuild,
  waOngoing,
  waPrompt,
  waSoftware,
  waUrl,
} from '../site';

/** Every string reachable from the module's exports. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => strings(v, out));
  return out;
}

/** Strings a visitor can read: everything except link targets and internal stat sources. */
function visibleStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => visibleStrings(v, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k === 'href' || k === 'source' || k === 'slug' || k === 'image' || k === 'holdUntil') continue;
      visibleStrings(v, out);
    }
  }
  return out;
}

const WA = 'https://wa.me/19083164140';

describe('waUrl', () => {
  it('builds a wa.me link with the message encoded', () => {
    expect(waUrl('Hi Neil, I want to build: A custom CRM')).toBe(
      `${WA}?text=Hi%20Neil%2C%20I%20want%20to%20build%3A%20A%20custom%20CRM`,
    );
  });

  it('drops the text param when there is no message', () => {
    expect(waUrl()).toBe(WA);
    expect(waUrl('   ')).toBe(WA);
  });

  it('keeps the trailing space so the visitor types straight after the prefill', () => {
    expect(waUrl('Hi Neil, ')).toBe(`${WA}?text=Hi%20Neil%2C%20`);
  });

  it('uses the number with its country code', () => {
    expect(SITE.whatsapp).toMatch(/^1\d{10}$/);
  });
});

describe('WhatsApp prefills match the copy deck', () => {
  it('global', () => {
    expect(waGlobal()).toBe(`${WA}?text=Hi%20Neil%2C%20I%20found%20your%20site.%20Here's%20what%20I'd%20like%20help%20with%3A%20`);
  });

  it('prompt card, and the global prefill when the input is empty', () => {
    expect(waPrompt('a custom CRM')).toBe(`${WA}?text=Hi%20Neil%2C%20I%20want%20to%20build%3A%20a%20custom%20CRM`);
    expect(waPrompt('  ')).toBe(waGlobal());
    expect(waPrompt()).toBe(waGlobal());
  });

  it('services, work and free tools', () => {
    expect(waOneBuild()).toBe(`${WA}?text=Hi%20Neil%2C%20I'd%20like%20to%20talk%20about%20one%20build%3A%20`);
    expect(waOngoing()).toBe(
      `${WA}?text=Hi%20Neil%2C%20I'd%20like%20to%20talk%20about%20having%20you%20lead%20our%20AI%20work.%20Here's%20our%20business%3A%20`,
    );
    expect(waFeatured()).toBe(
      `${WA}?text=Hi%20Neil%2C%20I%20saw%20the%20recruiting%20system%20on%20your%20site.%20I'd%20like%20something%20like%20it%20for%20my%20business%3A%20`,
    );
    expect(waFreeTools()).toBe(`${WA}?text=Hi%20Neil%2C%20I'd%20like%20a%20tool%20built%20for%20my%20business%3A%20`);
  });

  it('software pages keep the title as written, without the site name', () => {
    const text = (url: string) => decodeURIComponent(url.split('?text=')[1]);
    expect(text(waSoftware('Custom CRM for Real Estate Teams | Neil Busque'))).toBe(
      "Hi Neil, I read your page on Custom CRM for Real Estate Teams. Here's what we need: ",
    );
    expect(text(waSoftware('How Much Does Custom Software Cost?'))).toBe(
      "Hi Neil, I read your page on How Much Does Custom Software Cost? Here's what we need: ",
    );
  });

  it('the nav button, closing band and WhatsApp channel use the global prefill', () => {
    expect(waUrl(NAV_CTA.message)).toBe(waGlobal());
    expect(CLOSING.primary.href).toBe(waGlobal());
    expect(CHANNELS[0]).toMatchObject({ key: 'whatsapp', href: waGlobal() });
    expect(FEATURED_PROJECT.cta.href).toBe(waFeatured());
  });
});

describe('shared site data', () => {
  it('has no em or en dashes in any string', () => {
    const bad = strings(site).filter((s) => /[\u2013\u2014]/.test(s));
    expect(bad).toEqual([]);
  });

  it('only links to site paths, https pages or mail, and never to GitHub', () => {
    const hrefs = [
      ...NAV.map((n) => n.href),
      NAV_CONTACT.href,
      ...CHANNELS.map((c) => c.href),
      CLOSING.primary.href,
      CLOSING.secondary.href,
      ...FOOTER_COLUMNS.flatMap((c) => c.links.map((l) => l.href)),
      ...SERVICES.flatMap((s) => [s.href, s.link.href]),
      ...CAPABILITIES.map((c) => c.href),
      ...SERVICE_CARDS.map((c) => c.href),
      ...[FEATURED_PROJECT, ...PROJECTS, ...MORE_BUILDS].flatMap((p) => (p.href ? [p.href] : [])),
      FEATURED_TOOL.href,
      ...TOOLS.map((t) => t.href),
      ...HELD_TOOLS.map((t) => t.href),
      ...INDUSTRIES.map((i) => i.href),
    ];
    for (const href of hrefs) expect(href).toMatch(/^(\/[a-z0-9/#.-]*|https:\/\/\S+|mailto:\S+)$/);
    expect(strings(site).some((s) => /github/i.test(s))).toBe(false);
  });

  it('builds mail links for the public address', () => {
    expect(mailUrl()).toBe(`mailto:${SITE.email}`);
    expect(mailUrl('Hello there')).toBe(`mailto:${SITE.email}?subject=Hello%20there`);
  });

  it('keeps every list at the size the deck sets', () => {
    expect(NAV).toHaveLength(4);
    expect(CHANNELS.map((c) => c.key)).toEqual(['whatsapp', 'email', 'booking', 'linkedin']);
    expect(FOOTER_COLUMNS.map((c) => [c.title, c.links.length])).toEqual([
      ['Services', 5],
      ['Resources', 3],
      ['More', 6],
    ]);
    expect(PROMPT.chips).toHaveLength(3);
    expect(SERVICES).toHaveLength(5);
    expect(CAPABILITIES).toHaveLength(4);
    expect(SERVICE_CARDS).toHaveLength(4);
    expect(PROJECTS).toHaveLength(8);
    expect(MORE_BUILDS).toHaveLength(11);
    expect(TOOLS).toHaveLength(4);
    expect(HELD_TOOLS).toHaveLength(1);
    expect(QUOTES).toHaveLength(4);
    expect(STATS).toHaveLength(3);
    expect(STEPS).toHaveLength(4);
    expect(FIT.fit).toHaveLength(5);
    expect(FIT.notFit).toHaveLength(5);
    expect(INDUSTRIES).toHaveLength(8);
    expect(ABOUT_FACTS).toHaveLength(3);
    expect(FAQS).toHaveLength(6);
  });

  it('gives each service four items, three facts and a numbered slot', () => {
    SERVICES.forEach((s, i) => {
      expect(s.number).toBe(String(i + 1).padStart(2, '0'));
      expect(s.items).toHaveLength(4);
      expect(s.facts.map((f) => f.term)).toEqual(['Good for', 'How it starts', 'What you own']);
      expect(s.link.href).toBe(s.href);
    });
    expect(SERVICE_CARDS[0].items).toHaveLength(3);
    expect(SERVICE_CARDS.slice(1).every((c) => !c.items)).toBe(true);
  });

  it('uses unique slugs within each list, so every picture has its own seed', () => {
    for (const list of [SERVICES, SERVICE_CARDS, [FEATURED_PROJECT, ...PROJECTS, ...MORE_BUILDS], [FEATURED_TOOL, ...TOOLS, ...HELD_TOOLS]]) {
      const slugs = list.map((x) => x.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('labels every project with the category of its type', () => {
    for (const p of [FEATURED_PROJECT, ...PROJECTS, ...MORE_BUILDS]) expect(p.category).toBe(PROJECT_CATEGORY[p.type]);
  });

  it('counts the work tabs the way the deck does', () => {
    expect(WORK_TABS.map((t) => [t.label, t.count])).toEqual([
      ['All', 20],
      ['AI agents', 6],
      ['Software', 8],
      ['Automations', 3],
      ['Sites and funnels', 3],
    ]);
  });

  it('keeps the four approved quotes with role labels and no names', () => {
    for (const q of QUOTES) {
      expect(q.quote.trim().length).toBeGreaterThan(0);
      expect(q.role.trim().length).toBeGreaterThan(0);
      expect(q.name).toBeUndefined();
    }
  });

  it('gives every stat a source', () => {
    for (const s of STATS) expect(s.source.trim().length).toBeGreaterThan(0);
  });

  it('catches a listed word with the hashed check', () => {
    expect(flagged('Download my resume here')).toBe(true);
    expect(flagged('Your business needs an AI guy.')).toBe(false);
  });

  it('names no company, person, persona or product in visible text', () => {
    const visible = visibleStrings(site);
    expect(visible.filter(flagged)).toEqual([]);
    expect(visible.some((s) => /\$\s?\d/.test(s))).toBe(false);
  });
});
