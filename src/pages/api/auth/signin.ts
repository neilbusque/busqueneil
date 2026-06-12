import type { APIRoute } from 'astro';
import { serverClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const email = String(form.get('email') ?? '');
  const password = String(form.get('password') ?? '');

  const sb = serverClient(request, cookies);
  if (!sb) return redirect('/admin/login?error=not-configured');

  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return redirect('/admin/login?error=invalid');

  return redirect('/admin');
};
