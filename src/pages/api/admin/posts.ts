import type { APIRoute } from 'astro';
import { serverClient } from '../../../lib/supabase';
import { renderMarkdown, deriveExcerpt } from '../../../lib/markdown';
import type { PostType } from '../../../lib/types';

const TYPES: PostType[] = ['status', 'article', 'project', 'now'];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function autoSlug(type: PostType): string {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 6);
  return `${type[0]}-${ymd}-${rand}`;
}

// Middleware already verified the session; the Supabase client still carries
// the user JWT so RLS enforces authenticated-only writes end to end.
export const POST: APIRoute = async ({ request, cookies }) => {
  const sb = serverClient(request, cookies);
  if (!sb) return json({ error: 'not configured' }, 500);

  const body = await request.json();
  const type: PostType = TYPES.includes(body.type) ? body.type : 'status';
  const bodyMd = String(body.body_md ?? '');
  const title = body.title ? String(body.title) : null;
  const status = body.status === 'published' ? 'published' : 'draft';

  const record: Record<string, unknown> = {
    type,
    title,
    body_md: bodyMd,
    body_html: await renderMarkdown(bodyMd),
    excerpt: body.excerpt ? String(body.excerpt) : deriveExcerpt(bodyMd),
    link_url: body.link_url || null,
    project_meta: body.project_meta ?? null,
    images: Array.isArray(body.images) ? body.images : [],
    tags: Array.isArray(body.tags) ? body.tags : [],
    status,
  };

  if (body.id) {
    // update: only set published_at on first publish
    if (status === 'published') {
      const { data: existing } = await sb
        .from('posts')
        .select('published_at')
        .eq('id', body.id)
        .maybeSingle();
      if (!existing?.published_at) record.published_at = new Date().toISOString();
    }
    if (body.slug) record.slug = slugify(String(body.slug));
    const { data, error } = await sb
      .from('posts')
      .update(record)
      .eq('id', body.id)
      .select()
      .single();
    if (error) return json({ error: error.message }, 400);
    return json({ post: data });
  }

  record.slug = body.slug
    ? slugify(String(body.slug))
    : title
      ? slugify(title)
      : autoSlug(type);
  if (status === 'published') record.published_at = new Date().toISOString();

  const { data, error } = await sb.from('posts').insert(record).select().single();
  if (error) return json({ error: error.message }, 400);
  return json({ post: data });
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const sb = serverClient(request, cookies);
  if (!sb) return json({ error: 'not configured' }, 500);

  const { id } = await request.json();
  if (!id) return json({ error: 'missing id' }, 400);

  const { error } = await sb.from('posts').delete().eq('id', id);
  if (error) return json({ error: error.message }, 400);
  return json({ ok: true });
};

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
