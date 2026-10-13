import type { APIRoute } from 'astro';
import { pngResponse, renderOgCard } from '../../../lib/og-card';

/* Title cards for the guides that set their own og:image. */
export const prerender = true;

const GUIDES = {
  'build-ai-agent-claude-code': {
    label: 'AI agents',
    title: 'How to build an AI agent with Claude Code and MCP',
  },
  'geo-generative-engine-optimization-guide': {
    label: 'AI search',
    title: 'GEO and AI search: what actually helps in 2026',
  },
  'google-ai-overviews-guide': {
    label: 'Google search',
    title: 'How to show up in Google AI Overviews in 2026',
  },
  'ship-web-app-in-days-with-ai': {
    label: 'Product build',
    title: 'How to ship a web app in days with AI',
  },
  'why-hire-a-person-when-ai-can-build-it': {
    label: 'Working with AI',
    title: 'Why you still need a person when AI does the building',
  },
  'what-is-mcp-model-context-protocol': {
    label: 'MCP',
    title: 'What is MCP? A plain Model Context Protocol guide',
  },
} as const;

type Guide = (typeof GUIDES)[keyof typeof GUIDES];

export function getStaticPaths() {
  return Object.entries(GUIDES).map(([slug, guide]) => ({ params: { slug }, props: { guide } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { guide } = props as { guide: Guide };
  return pngResponse(await renderOgCard({ label: `Guide, ${guide.label}`, title: guide.title }));
};
