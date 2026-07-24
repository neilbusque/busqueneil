export const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'thoughts', label: 'Thoughts' },
  { key: 'tutorials', label: 'Tutorials' },
  { key: 'builds', label: 'Builds' },
  { key: 'now', label: 'Now' },
] as const;

export function filterToQuery(filter: string | null): { type?: 'status' | 'article' | 'project' | 'now'; tag?: string } {
  switch (filter) {
    case 'thoughts': return { type: 'status' };
    case 'tutorials': return { type: 'article', tag: 'tutorial' };
    case 'builds': return { type: 'project' };
    case 'now': return { type: 'now' };
    default: return {};
  }
}
