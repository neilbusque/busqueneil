import { createServerClient, createBrowserClient, parseCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Per-request server client. Never share across requests (session bleed).
 * Reads the session from request cookies and writes refreshed tokens back.
 */
export function serverClient(request: Request, cookies: AstroCookies) {
  if (!supabaseConfigured) return null;
  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('cookie') ?? '').map(
          ({ name, value }) => ({ name, value: value ?? '' })
        );
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookies.set(name, value, { path: '/', ...options })
        );
      },
    },
  });
}

/** Browser client for islands (composer uploads, session refresh). */
export function browserClient() {
  if (!supabaseConfigured) return null;
  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}

/** Public storage URL for an object in the post-images bucket. */
export function publicImageUrl(path: string): string {
  if (!SUPABASE_URL) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/post-images/${path}`;
}
