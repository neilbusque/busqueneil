import type { AstroCookies } from 'astro';
import { serverClient } from './supabase';
import type { Post, PostType } from './types';

export const FEED_PAGE_SIZE = 20;

/** Posts kept in the database but never shown on the public site: not in any list, feed,
    sitemap, RSS or llms.txt, and /posts/<slug> answers 404. Personal pieces stay private. */
export const HIDDEN_POST_SLUGS: readonly string[] = ['why-i-build-apps', 'now-2026-05'];

/** Post types the public site no longer shows at all. "now" updates were personal status
    notes; /now redirects to /resources. */
export const HIDDEN_POST_TYPES: readonly PostType[] = ['now'];

/** Hidden posts were in the old sitemap, so their URLs answer a 301 instead of a 404 and keep
    any links that point at them: the personal piece goes to /story (as /about does) and the
    status notes go to /resources (as /now does). Null means the slug is not a hidden post. */
export function hiddenPostRedirect(slug: string): string | null {
  if (slug === 'why-i-build-apps') return '/story';
  if (HIDDEN_POST_SLUGS.includes(slug) || /^now-\d{4}-\d{2}$/.test(slug)) return '/resources';
  return null;
}

/** True when a post may appear on the public site. Every list function and the single-post
    lookup check this, so a hidden post cannot leak through one path the others block. */
export function isPublicPost(post: Pick<Post, 'slug' | 'type'>): boolean {
  return !HIDDEN_POST_TYPES.includes(post.type) && !HIDDEN_POST_SLUGS.includes(post.slug);
}

/* PostgREST list syntax for the query-level exclusions. Filtering in the query (not only after
   it) keeps pagination honest: a page of 20 is 20 public posts, not 20 minus the hidden ones. */
const inList = (values: readonly string[]) => `(${values.map((v) => `"${v}"`).join(',')})`;

interface QueryOpts {
  request: Request;
  cookies: AstroCookies;
}

function client({ request, cookies }: QueryOpts) {
  return serverClient(request, cookies);
}

/** Published public posts, newest first. All public types interleaved. */
export async function getFeed(
  opts: QueryOpts,
  { page = 1, type, tag }: { page?: number; type?: PostType; tag?: string } = {}
): Promise<{ posts: Post[]; hasMore: boolean }> {
  if (type && HIDDEN_POST_TYPES.includes(type)) return { posts: [], hasMore: false };
  const sb = client(opts);
  if (!sb) return { posts: [], hasMore: false };

  const from = (page - 1) * FEED_PAGE_SIZE;
  let q = sb
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .not('type', 'in', inList(HIDDEN_POST_TYPES))
    .not('slug', 'in', inList(HIDDEN_POST_SLUGS))
    .order('published_at', { ascending: false })
    .range(from, from + FEED_PAGE_SIZE); // one extra row to detect hasMore

  if (type) q = q.eq('type', type);
  if (tag) q = q.contains('tags', [tag]);

  const { data, error } = await q;
  if (error || !data) return { posts: [], hasMore: false };
  const rows = (data as Post[]).filter(isPublicPost);
  return {
    posts: rows.slice(0, FEED_PAGE_SIZE),
    hasMore: rows.length > FEED_PAGE_SIZE,
  };
}

/** One public post by slug, or null. Hidden posts return null, so their URLs answer 404. */
export async function getPostBySlug(opts: QueryOpts, slug: string): Promise<Post | null> {
  if (HIDDEN_POST_SLUGS.includes(slug)) return null;
  const sb = client(opts);
  if (!sb) return null;
  const { data } = await sb
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();
  const post = (data as Post | null) ?? null;
  return post && isPublicPost(post) ? post : null;
}

/** Latest "now" update and its archive. "now" posts are no longer public, so this is always
    empty; it stays so older callers keep compiling and fall back to their default copy. */
export async function getNow(_opts: QueryOpts): Promise<{ current: Post | null; archive: Post[] }> {
  return { current: null, archive: [] };
}

/** Every published public post, for the sitemap, RSS, llms.txt and the resources hub. */
export async function getAllPublished(opts: QueryOpts): Promise<Post[]> {
  const sb = client(opts);
  if (!sb) return [];
  const { data } = await sb
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .not('type', 'in', inList(HIDDEN_POST_TYPES))
    .not('slug', 'in', inList(HIDDEN_POST_SLUGS))
    .order('published_at', { ascending: false })
    .limit(1000);
  return ((data as Post[] | null) ?? []).filter(isPublicPost);
}

const CACHE_PUBLIC = 'public, s-maxage=60, stale-while-revalidate=86400';

/** Standard cache header for public SSR pages: live within 60s of a publish. */
export function setPublicCache(headers: Headers) {
  headers.set('Cache-Control', CACHE_PUBLIC);
}
