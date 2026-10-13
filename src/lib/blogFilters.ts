/* Filters for the resources hub. /blog, /notes and /feed now redirect to /resources, so the
   filter logic that served the old blog chips lives here in its new form: which kind and topic a
   visitor asked for, the search words, which rows match, and the URL for a filtered view.

   The same functions run on the server (so filters, search and "Show more" work without
   JavaScript) and in the browser (so they work in place without a reload). Keep them pure. */

export const HUB_KINDS = ['all', 'guide', 'comparison', 'research', 'note'] as const;
export const HUB_TOPICS = ['agents', 'automation', 'software', 'marketing'] as const;

export type HubKind = (typeof HUB_KINDS)[number];
export type HubTopic = (typeof HUB_TOPICS)[number];

export interface HubFilters {
  kind: HubKind;
  topic: HubTopic | null;
  /** Search text as typed, trimmed and capped. */
  query: string;
  /** "Show more" was used: show every matching row. */
  expanded: boolean;
}

const isKind = (v: string | null): v is HubKind => v !== null && (HUB_KINDS as readonly string[]).includes(v);
const isTopic = (v: string | null): v is HubTopic => v !== null && (HUB_TOPICS as readonly string[]).includes(v);

/** Reads ?type=, ?topic=, ?q= and ?show=all. Unknown values fall back to no filter. */
export function parseHubFilters(params: URLSearchParams): HubFilters {
  const type = params.get('type');
  const topic = params.get('topic');
  return {
    kind: isKind(type) ? type : 'all',
    topic: isTopic(topic) ? topic : null,
    query: (params.get('q') ?? '').replace(/\s+/g, ' ').trim().slice(0, 80),
    expanded: params.get('show') === 'all',
  };
}

/** Lowercase words, accents and most punctuation dropped. */
function words(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9%.+# ]+/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[.]+|[.]+$/g, ''))
    .filter(Boolean);
}

/** The words of a search. At most eight. */
export function searchWords(query: string): string[] {
  return words(query).slice(0, 8);
}

/** The text a row is searched by (title, excerpt, type), normalised the same way as a search. */
export function searchText(...parts: (string | undefined)[]): string {
  return words(parts.filter(Boolean).join(' ')).join(' ');
}

/** True when a row of this kind and search text belongs in the current view. */
export function rowMatches(row: { kind: string; text: string }, kind: HubKind, words: string[]): boolean {
  if (kind !== 'all' && row.kind !== kind) return false;
  return words.every((w) => row.text.includes(w));
}

/** Rows visible in a list of matches: all of them, or the first `cap` when there are more than
    `threshold` and the list is not expanded. A short tail never hides behind "Show more". */
export function visibleCount(matching: number, expanded: boolean, cap = 20, threshold = 24): number {
  return !expanded && matching > threshold ? cap : matching;
}

/** URL of a filtered view of the hub. Defaults are left out, so the plain view is /resources. */
export function hubHref(f: Partial<HubFilters> = {}, hash = 'everything'): string {
  const params = new URLSearchParams();
  if (f.topic) params.set('topic', f.topic);
  if (f.kind && f.kind !== 'all') params.set('type', f.kind);
  if (f.query) params.set('q', f.query);
  if (f.expanded) params.set('show', 'all');
  const qs = params.toString();
  return `/resources${qs ? `?${qs}` : ''}${hash ? `#${hash}` : ''}`;
}
