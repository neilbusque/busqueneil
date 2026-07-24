import { describe, it, expect } from 'vitest';
import { filterToQuery, FILTERS } from '../blogFilters';

describe('filterToQuery', () => {
  it('maps thoughts to status type', () => expect(filterToQuery('thoughts')).toEqual({ type: 'status' }));
  it('maps tutorials to article + tutorial tag', () => expect(filterToQuery('tutorials')).toEqual({ type: 'article', tag: 'tutorial' }));
  it('maps builds to project', () => expect(filterToQuery('builds')).toEqual({ type: 'project' }));
  it('maps now to now', () => expect(filterToQuery('now')).toEqual({ type: 'now' }));
  it('maps all/null/garbage to no constraint', () => {
    expect(filterToQuery('all')).toEqual({});
    expect(filterToQuery(null)).toEqual({});
    expect(filterToQuery('nope')).toEqual({});
  });
  it('exposes 5 filter chips', () => expect(FILTERS.map((f) => f.key)).toEqual(['all', 'thoughts', 'tutorials', 'builds', 'now']));
});
