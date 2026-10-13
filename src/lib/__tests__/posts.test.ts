import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Post } from '../types';

/* A fake Supabase client: every builder method chains, awaiting the builder (or maybeSingle)
   resolves to the rows the test set. It deliberately ignores the query-level filters, so these
   tests prove the code-level guard on its own: a hidden post the database returns anyway never
   reaches a caller. */
let rows: Partial<Post>[] = [];
const calls: { method: string; args: unknown[] }[] = [];

function builder() {
  const b: Record<string, unknown> = {};
  for (const m of ['from', 'select', 'eq', 'neq', 'not', 'order', 'range', 'limit', 'contains']) {
    b[m] = (...args: unknown[]) => {
      calls.push({ method: m, args });
      return b;
    };
  }
  b.maybeSingle = () => Promise.resolve({ data: rows[0] ?? null, error: null });
  b.then = (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
    Promise.resolve({ data: rows, error: null }).then(resolve, reject);
  return b;
}

vi.mock('../supabase', () => ({ serverClient: () => builder() }));

const { getAllPublished, getFeed, getNow, getPostBySlug, HIDDEN_POST_SLUGS, isPublicPost } = await import('../posts');

const opts = { request: new Request('https://busqueneil.com/'), cookies: {} as never };
const post = (slug: string, type: Post['type'] = 'article'): Partial<Post> => ({ slug, type, status: 'published', published_at: '2026-10-01T12:00:00Z' });

beforeEach(() => {
  rows = [];
  calls.length = 0;
});

describe('isPublicPost', () => {
  it('hides the two personal posts', () => {
    expect(HIDDEN_POST_SLUGS).toEqual(['why-i-build-apps', 'now-2026-05']);
    expect(isPublicPost({ slug: 'why-i-build-apps', type: 'article' })).toBe(false);
    expect(isPublicPost({ slug: 'now-2026-05', type: 'article' })).toBe(false);
  });
  it('hides every now post', () => expect(isPublicPost({ slug: 'now-2026-09', type: 'now' })).toBe(false));
  it('keeps ordinary notes', () => {
    expect(isPublicPost({ slug: 'build-note', type: 'article' })).toBe(true);
    expect(isPublicPost({ slug: 'a-thought', type: 'status' })).toBe(true);
    expect(isPublicPost({ slug: 'a-build', type: 'project' })).toBe(true);
  });
});

describe('getPostBySlug', () => {
  it('returns null for a hidden slug without asking the database', async () => {
    rows = [post('why-i-build-apps')];
    expect(await getPostBySlug(opts, 'why-i-build-apps')).toBeNull();
    expect(calls).toHaveLength(0);
  });
  it('returns null for a now post even when the database returns it', async () => {
    rows = [post('now-2026-09', 'now')];
    expect(await getPostBySlug(opts, 'now-2026-09')).toBeNull();
  });
  it('returns a public post', async () => {
    rows = [post('build-note')];
    expect((await getPostBySlug(opts, 'build-note'))?.slug).toBe('build-note');
  });
});

describe('list functions', () => {
  it('getAllPublished drops hidden and now posts, and excludes them in the query', async () => {
    rows = [post('build-note'), post('why-i-build-apps'), post('now-2026-05', 'now'), post('now-2026-09', 'now')];
    expect((await getAllPublished(opts)).map((p) => p.slug)).toEqual(['build-note']);
    const nots = calls.filter((c) => c.method === 'not').map((c) => c.args);
    expect(nots).toContainEqual(['type', 'in', '("now")']);
    expect(nots).toContainEqual(['slug', 'in', '("why-i-build-apps","now-2026-05")']);
  });
  it('getFeed drops hidden and now posts', async () => {
    rows = [post('why-i-build-apps'), post('build-note'), post('now-2026-09', 'now')];
    const { posts, hasMore } = await getFeed(opts);
    expect(posts.map((p) => p.slug)).toEqual(['build-note']);
    expect(hasMore).toBe(false);
  });
  it('getFeed for the now type returns nothing', async () => {
    rows = [post('now-2026-09', 'now')];
    expect(await getFeed(opts, { type: 'now' })).toEqual({ posts: [], hasMore: false });
  });
  it('getNow is always empty', async () => {
    rows = [post('now-2026-09', 'now')];
    expect(await getNow(opts)).toEqual({ current: null, archive: [] });
  });
});
