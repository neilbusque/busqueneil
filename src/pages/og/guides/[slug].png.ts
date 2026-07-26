import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { FRAUNCES_600_B64, INTER_400_B64 } from '../../../lib/og-fonts';

export const prerender = true;

const GUIDES = {
  'build-ai-agent-claude-code': {
    label: 'AI AGENTS',
    title: 'How to Build an AI Agent with Claude Code and MCP',
  },
  'geo-generative-engine-optimization-guide': {
    label: 'AI SEARCH',
    title: 'GEO and AI Search: What Actually Helps in 2026',
  },
  'google-ai-overviews-guide': {
    label: 'GOOGLE SEARCH',
    title: 'How to Show Up in Google AI Overviews in 2026',
  },
  'ship-web-app-in-days-with-ai': {
    label: 'PRODUCT BUILD',
    title: 'How to Ship a Web App in Days with AI',
  },
  'why-hire-a-person-when-ai-can-build-it': {
    label: 'HIRING',
    title: 'Why You Still Need a Person When AI Does the Building',
  },
  'what-is-mcp-model-context-protocol': {
    label: 'MCP',
    title: 'What Is MCP? A Plain Model Context Protocol Guide',
  },
} as const;

type Guide = (typeof GUIDES)[keyof typeof GUIDES];

export function getStaticPaths() {
  return Object.entries(GUIDES).map(([slug, guide]) => ({ params: { slug }, props: { guide } }));
}

const mark = `data:image/svg+xml;base64,${Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <path d="M16 16h24v88H16zM80 16h24v88H80z" fill="#16150F"/>
    <path d="M16 16h24l64 88H80z" fill="#FFE45C"/>
    <path d="M40 16v33L16 16zM80 104V71l24 33z" fill="#F7C843"/>
  </svg>
`).toString('base64')}`;

export const GET: APIRoute = async ({ props }) => {
  const { guide } = props as { guide: Guide };
  const titleSize = guide.title.length > 53 ? '55px' : '64px';
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
          backgroundColor: '#F7F1ED',
          color: '#16150F',
          padding: '64px 72px',
          border: '16px solid #16150F',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
              children: [
                { type: 'img', props: { src: mark, width: 82, height: 82 } },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      backgroundColor: '#FFE45C',
                      padding: '13px 18px',
                      border: '2px solid #16150F',
                      fontSize: '20px',
                      letterSpacing: '0.16em',
                    },
                    children: guide.label,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontFamily: 'Fraunces',
                fontSize: titleSize,
                lineHeight: 1.08,
                maxWidth: '990px',
              },
              children: guide.title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '2px solid #16150F',
                paddingTop: '22px',
                fontSize: '22px',
                letterSpacing: '0.06em',
              },
              children: [
                { type: 'div', props: { style: { display: 'flex', fontWeight: 700 }, children: 'busqueneil' } },
                { type: 'div', props: { style: { display: 'flex' }, children: 'USEFUL SOFTWARE, BUILT WITH YOU.' } },
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
        { name: 'Fraunces', data: Buffer.from(FRAUNCES_600_B64, 'base64'), weight: 600, style: 'normal' },
        { name: 'Inter', data: Buffer.from(INTER_400_B64, 'base64'), weight: 400, style: 'normal' },
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
};
