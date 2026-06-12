import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getPostBySlug } from '../../lib/posts';
import { deriveExcerpt } from '../../lib/markdown';
import { formatDate } from '../../lib/format';

const fraunces = readFileSync(new URL('../../assets/fonts/fraunces-600.woff', import.meta.url));
const inter = readFileSync(new URL('../../assets/fonts/inter-400.woff', import.meta.url));

const TYPE_LABEL: Record<string, string> = {
  status: 'STATUS',
  article: 'ARTICLE',
  project: 'PROJECT',
  now: 'NOW',
};

export const GET: APIRoute = async ({ params, request, cookies, redirect }) => {
  try {
    const slug = params.slug!;
    const post = await getPostBySlug({ request, cookies }, slug);
    if (!post) return redirect('/og.png');

    const title = post.title ?? deriveExcerpt(post.body_md, 90);

    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#FAF6F0',
            padding: '70px 80px',
            fontFamily: 'Inter',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  fontSize: '22px',
                  letterSpacing: '0.14em',
                  color: '#E94F37',
                  fontWeight: 600,
                },
                children: TYPE_LABEL[post.type] ?? '',
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  fontFamily: 'Fraunces',
                  fontSize: title.length > 60 ? '54px' : '68px',
                  lineHeight: 1.12,
                  color: '#1A1714',
                  maxWidth: '1000px',
                },
                children: title,
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '2px solid #1A1714',
                  paddingTop: '28px',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', fontFamily: 'Fraunces', fontSize: '30px', color: '#1A1714' },
                      children: 'busqueneil.com',
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', fontSize: '24px', color: '#8A8276' },
                      children: formatDate(post.published_at),
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'Fraunces', data: fraunces, weight: 600, style: 'normal' },
          { name: 'Inter', data: inter, weight: 400, style: 'normal' },
        ],
      }
    );

    const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

    return new Response(new Uint8Array(png), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return redirect('/og.png');
  }
};
