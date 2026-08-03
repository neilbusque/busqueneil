import { defineMiddleware } from 'astro:middleware';
import { serverClient } from './lib/supabase';

const PROTECTED = [/^\/admin(?!\/login)/, /^\/api\/admin\//];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (pathname === '/') {
    // Vercel terminates the public request before Astro sees it, so context.url can carry the
    // deployment hostname instead of the visitor-facing custom domain. Prefer the forwarded
    // host, then the raw Host header, and use context.url only as a local-development fallback.
    // Read headers only for the server-rendered root; prerendered routes do not expose them.
    const forwardedHost = context.request.headers.get('x-forwarded-host')
      ?.split(',')[0]
      ?.trim()
      .split(':')[0]
      ?.toLowerCase();
    const requestHost = context.request.headers.get('host')
      ?.split(':')[0]
      ?.toLowerCase();
    const host = forwardedHost || requestHost || context.url.hostname.toLowerCase();

    // Keep /hire available on the main site while the recruiter-facing domain stays memorable.
    if (host === 'hire.busqueneil.com') {
      return context.rewrite('/hire');
    }
  }

  const needsAuth = PROTECTED.some((re) => re.test(pathname));
  if (!needsAuth) return next();

  const sb = serverClient(context.request, context.cookies);
  // getUser() validates the JWT against the auth server; never trust getSession() here.
  const user = sb ? (await sb.auth.getUser()).data.user : null;

  if (!user) {
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return context.redirect('/admin/login');
  }

  context.locals.user = user;
  const response = await next();
  response.headers.set('Cache-Control', 'no-store');
  return response;
});
