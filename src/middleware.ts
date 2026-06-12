import { defineMiddleware } from 'astro:middleware';
import { serverClient } from './lib/supabase';

const PROTECTED = [/^\/admin(?!\/login)/, /^\/api\/admin\//];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
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
