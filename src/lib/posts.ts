import type { AstroCookies } from 'astro';
import { serverClient } from './supabase';
import type { Post, PostType } from './types';

export const FEED_PAGE_SIZE = 20;

interface QueryOpts {
  request: Request;
  cookies: AstroCookies;
}

function client({ request, cookies }: QueryOpts) {
  return serverClient(request, cookies);
}

/** Published posts, newest first. All types interleaved. */
export async function getFeed(
  opts: QueryOpts,
  { page = 1, type, tag }: { page?: number; type?: PostType; tag?: string } = {}
): Promise<{ posts: Post[]; hasMore: boolean }> {
  const sb = client(opts);
  if (!sb) return { posts: [], hasMore: false };

  const from = (page - 1) * FEED_PAGE_SIZE;
  let q = sb
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, from + FEED_PAGE_SIZE); // one extra row to detect hasMore

  if (type) q = q.eq('type', type);
  if (tag) q = q.contains('tags', [tag]);

  const { data, error } = await q;
  if (error || !data) return { posts: [], hasMore: false };
  return {
    posts: data.slice(0, FEED_PAGE_SIZE) as Post[],
    hasMore: data.length > FEED_PAGE_SIZE,
  };
}

export async function getPostBySlug(opts: QueryOpts, slug: string): Promise<Post | null> {
  const sb = client(opts);
  if (!sb) return null;
  const { data } = await sb
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();
  return (data as Post) ?? null;
}

/** Latest published now-post + the archive of older ones. */
export async function getNow(opts: QueryOpts): Promise<{ current: Post | null; archive: Post[] }> {
  const { posts } = await getFeed(opts, { type: 'now', page: 1 });
  return { current: posts[0] ?? null, archive: posts.slice(1) };
}

/** Every published post, for sitemap/RSS/llms.txt. */
export async function getAllPublished(opts: QueryOpts): Promise<Post[]> {
  const sb = client(opts);
  if (!sb) return [];
  const { data } = await sb
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1000);
  return (data as Post[]) ?? [];
}

const CACHE_PUBLIC = 'public, s-maxage=60, stale-while-revalidate=86400';

/** Standard cache header for public SSR pages: live within 60s of a publish. */
export function setPublicCache(headers: Headers) {
  headers.set('Cache-Control', CACHE_PUBLIC);
}
