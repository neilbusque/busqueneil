/* Social cards (1200 x 630) in the site's look: near-white ground, ink type in Geist, the
   cobalt mark and wordmark, one cobalt accent at most. Used by the default card
   (src/pages/og/site.png.ts), the guide cards and the build note cards.
   satori and resvg load lazily, so a runtime that cannot load them can still fall back. */
import { GEIST_400_B64, GEIST_600_B64 } from './og-fonts';

const C = {
  bg: '#F7F8FA',
  ink: '#0E1116',
  muted: '#5B6270',
  line: '#DDE1E8',
  blue: '#2346E8',
  fold: '#1A37C4',
};

const MARK = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">` +
    `<path d="M16 16h24v88H16zM80 16h24v88H80z" fill="${C.ink}"/>` +
    `<path d="M16 16h24l64 88H80z" fill="${C.blue}"/>` +
    `<path d="M40 16v33L16 16zM80 104V71l24 33z" fill="${C.fold}"/>` +
    `</svg>`,
).toString('base64')}`;

export interface OgCard {
  /** Small sentence-case label at the top right, like "Guide". Optional. */
  label?: string;
  /** The headline. */
  title: string;
  /** Words appended to the title in cobalt, like the site's accent words. Optional. */
  accent?: string;
  /** One supporting line under the headline. Optional. */
  line?: string;
}

type Node = { type: string; props: Record<string, unknown> };
const div = (style: Record<string, unknown>, children?: unknown): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

export function ogCardTree({ label, title, accent, line }: OgCard): Node {
  const length = title.length + (accent ? accent.length + 1 : 0);
  const size = length > 70 ? 54 : length > 48 ? 62 : 72;
  const words = [
    ...title.split(' ').map((w) => ({ w, accent: false })),
    /* The accent stays on one line, so it never splits like "AI / guy." */
    ...(accent ? [{ w: accent, accent: true }] : []),
  ];
  return div(
    {
      width: '1200px',
      height: '630px',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: C.bg,
      color: C.ink,
      padding: '64px 72px',
      fontFamily: 'Geist',
    },
    [
      div({ alignItems: 'center', justifyContent: 'space-between' }, [
        div({ alignItems: 'center' }, [
          { type: 'img', props: { src: MARK, width: 56, height: 56 } },
          div({ marginLeft: '18px', fontSize: '30px', fontWeight: 600, letterSpacing: '-0.01em' }, 'Neil Busque'),
        ]),
        label ? div({ fontSize: '26px', color: C.muted }, label) : div({}),
      ]),
      div({ flexDirection: 'column', maxWidth: '1020px' }, [
        div(
          { flexWrap: 'wrap', fontSize: `${size}px`, fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.03em' },
          words.map(({ w, accent: a }, i) =>
            div({ color: a ? C.blue : C.ink, marginRight: i === words.length - 1 ? '0' : `${Math.round(size * 0.22)}px` }, w),
          ),
        ),
        line ? div({ marginTop: '28px', fontSize: '30px', lineHeight: 1.4, color: C.muted, maxWidth: '900px' }, line) : div({}),
      ]),
      div(
        {
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid ${C.line}`,
          paddingTop: '24px',
          fontSize: '24px',
          color: C.muted,
        },
        [div({}, 'busqueneil.com'), div({}, 'AI agents, software and automations')],
      ),
    ],
  );
}

export async function renderOgCard(card: OgCard): Promise<Uint8Array> {
  const [{ default: satori }, { Resvg }] = await Promise.all([import('satori'), import('@resvg/resvg-js')]);
  const svg = await satori(ogCardTree(card) as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Geist', data: Buffer.from(GEIST_400_B64, 'base64'), weight: 400, style: 'normal' },
      { name: 'Geist', data: Buffer.from(GEIST_600_B64, 'base64'), weight: 600, style: 'normal' },
    ],
  });
  return new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng());
}

export const pngResponse = (png: Uint8Array) =>
  new Response(png as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });

/** The site-wide default card: the hero line. */
export const DEFAULT_CARD: OgCard = {
  title: 'Your business needs an',
  accent: 'AI guy.',
  line: 'I find the work worth handing to AI, then build the agents, apps and automations. First versions in days.',
};
