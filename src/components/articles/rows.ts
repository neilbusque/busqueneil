/* Rows for the resource table: articles from content-index and public notes from the posts
   table, in one shape, newest first. Used by /resources, /compare, /research and the related
   list under each article. */
import {
  KIND_LABEL,
  RESOURCES,
  hrefFor,
  kindOf,
  readMinutes,
  type ContentEntry,
  type Kind,
  type Topic,
} from '../../data/content-index';
import type { Post } from '../../lib/types';
import { deriveExcerpt } from '../../lib/markdown';
import { hubHref, type HubKind, type HubTopic } from '../../lib/blogFilters';

export type RowKind = Kind | 'note';

export const ROW_KIND_LABEL: Record<RowKind, string> = { ...KIND_LABEL, note: 'Note' };

export interface HubRow {
  /** Stable key, also the art seed. */
  slug: string;
  href: string;
  kind: RowKind;
  /** Kind as shown in the Type column. */
  type: string;
  title: string;
  excerpt?: string;
  /** "8 min". */
  read?: string;
  /** "Aug 11, 2026". */
  date?: string;
  /** "2026-08-11". */
  dateTime?: string;
  topic?: Topic;
}

const DAY = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const DAY_ET = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' });
const ISO_ET = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/New_York' });

/** "2026-08-11" as "Aug 11, 2026". Date-only strings are read as calendar days, not instants. */
export const formatDay = (isoDay: string): string => DAY.format(new Date(`${isoDay}T12:00:00Z`));

export function rowFor(c: ContentEntry): HubRow {
  const kind = kindOf(c);
  const minutes = readMinutes(c);
  const day = c.published ?? c.modified;
  return {
    slug: c.slug,
    href: hrefFor(c),
    kind,
    type: KIND_LABEL[kind],
    title: c.name,
    excerpt: c.blurb,
    read: minutes ? `${minutes} min` : undefined,
    date: day ? formatDay(day) : undefined,
    dateTime: day,
    topic: c.topic,
  };
}

/** A public post as a row. Callers pass only posts that passed isPublicPost. */
export function noteRow(p: Post): HubRow {
  const words = p.body_md.trim().split(/\s+/).filter(Boolean).length;
  const when = p.published_at ?? p.created_at;
  const d = new Date(when);
  return {
    slug: p.slug,
    href: `/posts/${p.slug}`,
    kind: 'note',
    type: ROW_KIND_LABEL.note,
    title: p.title ?? deriveExcerpt(p.body_md, 70),
    excerpt: p.excerpt ?? deriveExcerpt(p.body_md, 140),
    read: `${Math.max(1, Math.round(words / 230))} min`,
    date: DAY_ET.format(d),
    dateTime: ISO_ET.format(d),
  };
}

const KIND_ORDER: RowKind[] = ['guide', 'research', 'comparison', 'note'];

/** Newest first. Rows from the same day alternate between kinds, so a day that published many
    pieces at once does not fill the first screen with one kind. */
export function newestFirst(rows: HubRow[]): HubRow[] {
  const byDay = new Map<string, HubRow[]>();
  for (const r of rows) {
    const key = r.dateTime ?? '';
    const list = byDay.get(key);
    if (list) list.push(r);
    else byDay.set(key, [r]);
  }
  const days = [...byDay.keys()].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  const out: HubRow[] = [];
  for (const day of days) {
    const queues = KIND_ORDER.map((k) => byDay.get(day)!.filter((r) => r.kind === k));
    while (queues.some((q) => q.length)) {
      for (const q of queues) {
        const next = q.shift();
        if (next) out.push(next);
      }
    }
  }
  return out;
}

/** Every article row, newest first. */
export const articleRows = (): HubRow[] => newestFirst(RESOURCES.map(rowFor));

/** Up to three rows to read next: same kind first, same topic before others, newest first. */
export function relatedRows(entry: ContentEntry, count = 3): HubRow[] {
  const kind = kindOf(entry);
  const pool = RESOURCES.filter((c) => c.slug !== entry.slug && kindOf(c) === kind);
  const rows = newestFirst(pool.map(rowFor));
  const sameTopic = rows.filter((r) => r.topic === entry.topic);
  const others = rows.filter((r) => r.topic !== entry.topic);
  return [...sameTopic, ...others].slice(0, count);
}

/* ---------------- tabs ---------------- */

export interface IndexTab {
  key: HubKind;
  label: string;
  count: number;
  href: string;
}

const TAB_LABEL: Record<HubKind, string> = { all: 'All', guide: 'Guides', comparison: 'Comparisons', research: 'Research', note: 'Notes' };

/* The filtered views have their own pages: /compare and /research. */
const VIEW_HREF: Record<HubKind, string> = {
  all: '/resources#everything',
  guide: '/resources?type=guide#everything',
  comparison: '/compare',
  research: '/research',
  note: '/resources?type=note#everything',
};

/** Tabs with real counts over `rows`. Notes get a tab only once there is at least one, so no
    tab ever shows 0. In the hub, tabs link to filtered views of the hub (and keep the topic);
    on /compare and /research they link to the sibling views. */
export function indexTabs(rows: HubRow[], mode: 'hub' | 'view', topic: HubTopic | null = null): IndexTab[] {
  const count = (k: HubKind) => rows.filter((r) => k === 'all' || r.kind === k).length;
  const keys: HubKind[] = ['all', 'guide', 'comparison', 'research'];
  if (count('note') > 0) keys.push('note');
  return keys.map((key) => ({
    key,
    label: TAB_LABEL[key],
    count: count(key),
    href: mode === 'hub' ? hubHref({ topic, kind: key }) : VIEW_HREF[key],
  }));
}
