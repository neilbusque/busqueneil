import { describe, it, expect } from 'vitest';
import { hubHref, parseHubFilters, rowMatches, searchText, searchWords, visibleCount } from '../blogFilters';

const params = (s: string) => new URLSearchParams(s);

describe('parseHubFilters', () => {
  it('reads kind, topic, search and show more', () => {
    expect(parseHubFilters(params('type=research&topic=agents&q=%20mcp%20%20server%20&show=all'))).toEqual({
      kind: 'research',
      topic: 'agents',
      query: 'mcp server',
      expanded: true,
    });
  });
  it('falls back to the plain view for missing or unknown values', () => {
    expect(parseHubFilters(params(''))).toEqual({ kind: 'all', topic: null, query: '', expanded: false });
    expect(parseHubFilters(params('type=thoughts&topic=gym&show=1'))).toEqual({ kind: 'all', topic: null, query: '', expanded: false });
  });
  it('caps a long search', () => expect(parseHubFilters(params(`q=${'a'.repeat(200)}`)).query).toHaveLength(80));
});

describe('search', () => {
  it('normalises case, accents and apostrophes the same way on both sides', () => {
    const text = searchText('Cold email with AI that doesn’t read like AI', 'Guide');
    expect(rowMatches({ kind: 'guide', text }, 'all', searchWords('DOESNT read'))).toBe(true);
    expect(rowMatches({ kind: 'guide', text }, 'all', searchWords('café'))).toBe(false);
  });
  it('needs every word, and matches word starts inside longer words', () => {
    const text = searchText('Zapier AI vs n8n AI agents', 'Workflow automation');
    expect(rowMatches({ kind: 'comparison', text }, 'all', searchWords('n8n auto'))).toBe(true);
    expect(rowMatches({ kind: 'comparison', text }, 'all', searchWords('n8n stripe'))).toBe(false);
  });
  it('filters by kind', () => {
    const row = { kind: 'research', text: searchText('The false-zero machine') };
    expect(rowMatches(row, 'research', [])).toBe(true);
    expect(rowMatches(row, 'guide', [])).toBe(false);
    expect(rowMatches(row, 'all', [])).toBe(true);
  });
  it('keeps at most eight search words', () => expect(searchWords('a b c d e f g h i j')).toHaveLength(8));
});

describe('visibleCount', () => {
  it('shows a long list in pages of 20', () => expect(visibleCount(61, false)).toBe(20));
  it('never hides a short tail behind Show more', () => expect(visibleCount(23, false)).toBe(23));
  it('shows everything once expanded', () => expect(visibleCount(61, true)).toBe(61));
});

describe('hubHref', () => {
  it('leaves defaults out', () => expect(hubHref()).toBe('/resources#everything'));
  it('keeps topic, kind, search and show more', () => {
    expect(hubHref({ topic: 'software', kind: 'guide', query: 'web app', expanded: true })).toBe(
      '/resources?topic=software&type=guide&q=web+app&show=all#everything',
    );
  });
  it('drops the all kind', () => expect(hubHref({ kind: 'all' }, '')).toBe('/resources'));
});
