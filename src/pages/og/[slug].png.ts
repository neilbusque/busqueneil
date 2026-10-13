import type { APIRoute } from 'astro';
import { getPostBySlug } from '../../lib/posts';
import { deriveExcerpt } from '../../lib/markdown';
import { formatDate } from '../../lib/format';
import { pngResponse, renderOgCard } from '../../lib/og-card';

/* Social card for a build note at /posts/<slug>. Falls back to the default card when the post
   is missing or the renderer cannot load in this runtime. */
const FALLBACK = '/og/site.png';

export const GET: APIRoute = async ({ params, request, cookies, redirect }) => {
  try {
    const post = await getPostBySlug({ request, cookies }, params.slug!);
    if (!post) return redirect(FALLBACK);
    const title = post.title ?? deriveExcerpt(post.body_md, 90);
    const date = post.published_at ? formatDate(post.published_at) : '';
    return pngResponse(await renderOgCard({ label: date ? `Build note, ${date}` : 'Build note', title }));
  } catch {
    return redirect(FALLBACK);
  }
};
