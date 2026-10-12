/* Seeded placeholder art for the public site.

   Flat blocks snapped to a 16-column grid over a stepped halftone "terrain", in the site
   palette: blue, navy, pale and white grounds, with at most one small warm spark per picture.
   Rects, circles, polygons and dot patterns only: no blur, no filters, no text.

   The same kind + seed always draws the same picture, so a slot keeps its art across builds.
   Seed by slug, never by index, so reordering a list does not reshuffle its pictures.

   Pure string in, string out: safe during SSR and prerender, no DOM, no runtime JS.
   Pattern ids carry `uid` (Art.astro passes a fresh one per render) so many pictures on one
   page never share an id. Without unique ids, a copy hidden by a filter or a phone-only rule
   can stop its twin from drawing its dots. */

export type ArtKind = 'project' | 'tool' | 'article' | 'service' | 'portrait' | 'hero';
export type PaletteName = 'mist' | 'paper' | 'navy' | 'cobalt' | 'dusk';
export type ArtLayout = 'skyline' | 'stair' | 'split' | 'disc' | 'tiles' | 'hero';

interface Palette {
  /** Ground color. */
  base: string;
  /** Strong solid for split bands. */
  deep: string;
  /** Light solid for split bands. */
  pale: string;
  /** Solid block colors. Cool only: warm color never fills a block. */
  blocks: string[];
  /** The single warm accent this palette allows, drawn as one small square at most. */
  spark?: string;
  /** Halftone dot color. */
  dots: string;
  /** Faint vertical grid lines and tile outlines. */
  grid: string;
  /** Share of the weighted pick when no palette is forced. */
  weight: number;
}

export const PALETTES: Record<PaletteName, Palette> = {
  mist:   { base: '#EEF1F6', deep: '#2346E8', pale: '#C9D4FF', blocks: ['#2346E8', '#6F8BFF', '#C9D4FF', '#0A1633'], dots: '#6F8BFF', grid: '#DDE1E8', weight: 34 },
  paper:  { base: '#FFFFFF', deep: '#0A1633', pale: '#C9D4FF', blocks: ['#2346E8', '#C9D4FF', '#0A1633'], spark: '#FF6A3D', dots: '#6F8BFF', grid: '#E6E9EF', weight: 18 },
  navy:   { base: '#0A1633', deep: '#2346E8', pale: '#6F8BFF', blocks: ['#2346E8', '#6F8BFF', '#C9D4FF'], dots: '#3150E0', grid: '#16244A', weight: 18 },
  cobalt: { base: '#2346E8', deep: '#0A1633', pale: '#C9D4FF', blocks: ['#0A1633', '#C9D4FF', '#FFFFFF'], dots: '#C9D4FF', grid: '#3A5AF0', weight: 12 },
  dusk:   { base: '#0A1633', deep: '#2346E8', pale: '#C9D4FF', blocks: ['#2346E8', '#C9D4FF', '#6F8BFF'], spark: '#FFD84D', dots: '#6F8BFF', grid: '#16244A', weight: 10 },
};

/** Palettes a kind is limited to. Other kinds use the weighted pick. */
const KIND_PALETTES: Partial<Record<ArtKind, PaletteName[]>> = { portrait: ['navy', 'mist'], hero: ['navy'] };

/** Layouts per kind, picked by seed. Repeats weight the pick. */
const LAYOUTS: Record<ArtKind, ArtLayout[]> = {
  project: ['skyline', 'stair', 'skyline', 'split'],
  article: ['disc', 'skyline', 'stair', 'split'],
  tool: ['tiles', 'tiles', 'stair'],
  service: ['stair', 'skyline', 'split'],
  portrait: ['disc'],
  hero: ['hero'],
};

/** FNV-1a: string to 32-bit seed. */
export function hash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: tiny deterministic PRNG returning [0, 1). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(r: () => number, arr: readonly T[]): T => arr[Math.floor(r() * arr.length)];
const between = (r: () => number, a: number, b: number) => a + Math.floor(r() * (b - a + 1));
const f = (n: number) => Math.round(n * 10) / 10;

function pickPalette(r: () => number, forced?: PaletteName): Palette {
  if (forced) return PALETTES[forced];
  const all = Object.values(PALETTES);
  let x = r() * all.reduce((s, p) => s + p.weight, 0);
  for (const p of all) {
    if ((x -= p.weight) < 0) return p;
  }
  return all[0];
}

/** Block colors never repeat back to back. */
function blockColors(r: () => number, pal: Palette) {
  let last: string | null = null;
  return (): string => {
    for (let i = 0; i < 24; i++) {
      const c = pick(r, pal.blocks);
      if (c === last) continue;
      last = c;
      return c;
    }
    return pal.deep;
  };
}

export interface ArtOptions {
  seed: string;
  kind?: ArtKind;
  /** Drawing size in user units. The SVG scales to its frame (slice), so only the ratio matters. */
  w?: number;
  h?: number;
  palette?: PaletteName;
  layout?: ArtLayout;
  /** Unique suffix for pattern ids. Pass a fresh one per rendered picture. */
  uid?: string;
}

export function art({ seed, kind = 'project', w = 1600, h = 1000, palette, layout, uid }: ArtOptions): string {
  const r = rng(hash(`${kind}:${seed}`));
  const allowed = KIND_PALETTES[kind];
  const forced = palette ?? (allowed ? pick(r, allowed) : undefined);
  const pal = pickPalette(r, forced);
  const lay = layout ?? pick(r, LAYOUTS[kind]);
  const id = 'art' + (uid ? uid.replace(/[^a-zA-Z0-9_-]/g, '') : hash(`${kind}:${seed}:${w}x${h}`).toString(36));
  const u = w / 16;   // grid unit
  const s = f(w / 92); // halftone cell
  const block = blockColors(r, pal);
  const out: string[] = [];

  // One warm spark per picture at most, and only when the palette has one.
  let sparkUsed = false;
  const takeSpark = (chance: number): string | null => {
    if (!pal.spark || sparkUsed || r() >= chance) return null;
    sparkUsed = true;
    return pal.spark;
  };

  const defs = [0.16, 0.27, 0.38]
    .map((k, i) => `<pattern id="${id}d${i}" width="${s}" height="${s}" patternUnits="userSpaceOnUse"><circle cx="${f(s / 2)}" cy="${f(s / 2)}" r="${f(s * k)}" fill="${pal.dots}"/></pattern>`)
    .join('');

  // Blocks carry class "b" so CSS can nudge them up when a parent link is hovered.
  const rect = (x: number, y: number, rw: number, rh: number, fill: string, rx = 0, cls = 'b') =>
    out.push(`<rect class="${cls}" x="${f(x)}" y="${f(y)}" width="${f(rw)}" height="${f(rh)}"${rx ? ` rx="${f(rx)}"` : ''} fill="${fill}"/>`);

  out.push(`<rect width="${w}" height="${h}" fill="${pal.base}"/>`);
  for (let x = 2 * u; x < w; x += 2 * u) {
    out.push(`<line x1="${f(x)}" y1="0" x2="${f(x)}" y2="${h}" stroke="${pal.grid}" stroke-width="1" vector-effect="non-scaling-stroke"/>`);
  }

  // Stepped ridge snapped to dot rows so its edge reads as pixels; three dot densities below it.
  const terrain = (x0: number, x1: number, yMin: number, yMax: number, start: number) => {
    const step = u / 2;
    let y = start;
    const pts: [number, number][] = [];
    for (let x = x0; x < x1; x += step) {
      y = Math.min(yMax, Math.max(yMin, y + (r() - 0.5) * u * 0.9));
      const yy = Math.round(y / s) * s;
      pts.push([x, yy], [Math.min(x + step, x1), yy]);
    }
    const band = (off: number, i: number) =>
      `<polygon points="${pts.map(([px, py]) => `${f(px)},${f(Math.min(h, py + off))}`).join(' ')} ${f(x1)},${h} ${f(x0)},${h}" fill="url(#${id}d${i})"/>`;
    out.push(band(0, 0), band(u * 0.9, 1), band(u * 1.9, 2));
  };

  if (lay === 'hero') {
    // Fixed composition: terrain across, three blocks clustered right, bottom left kept calm
    // for the prompt card that sits there.
    terrain(0, w, h * 0.3, h * 0.5, h * 0.4);
    for (const [cx, cw, ch] of [[9, 3, 6], [12, 2, 9], [14, 2, 4]]) rect(u * cx, h - u * ch, u * cw, u * ch, block());
    rect(u * 11, h - u * 11, u, u, takeSpark(0.6) ?? block());
  } else if (lay === 'skyline') {
    terrain(0, w, h * 0.22, h * 0.62, (h * between(r, 32, 52)) / 100);
    let x = u * between(r, 1, 4);
    const n = between(r, 3, 5);
    const tops: [number, number][] = [];
    for (let i = 0; i < n && x < w - u; i++) {
      const bw = u * between(r, 2, 4);
      const bh = u * between(r, 2, Math.max(3, Math.floor(h / u) - 3));
      rect(x, h - bh, Math.min(bw, w - x), bh, block());
      tops.push([x, h - bh]);
      x += bw + (r() < 0.25 ? u * 2 : 0);
    }
    const spark = takeSpark(0.6);
    if (spark && tops.length) {
      const [sx, sy] = pick(r, tops);
      rect(sx, sy - u, u, u, spark);
    }
  } else if (lay === 'stair') {
    terrain(0, w, h * 0.12, h * 0.4, h * 0.25);
    const n = between(r, 3, 4);
    const bw = u * between(r, 3, 4);
    const bh = u * between(r, 2, 3);
    const x0 = u * between(r, 0, 3);
    let top: [number, number] | null = null;
    for (let i = 0; i < n; i++) {
      const x = x0 + i * bw;
      if (x >= w) break;
      rect(x, h - (i + 1) * bh, Math.min(bw, w - x), (i + 1) * bh, block());
      top = [x, h - (i + 1) * bh];
    }
    const spark = takeSpark(0.5);
    if (spark && top && top[1] - u > 0) rect(top[0], top[1] - u, u, u, spark);
  } else if (lay === 'split') {
    const a = u * between(r, 4, 7);
    rect(0, 0, a, h, r() < 0.5 ? pal.deep : pal.pale, 0, 'p');
    out.push(`<svg x="${f(a)}" y="0" width="${f(w - a)}" height="${h}" overflow="hidden">`);
    terrain(0, w - a, h * 0.2, h * 0.55, h * 0.35);
    out.push(`</svg>`);
    rect(a - u / 2, h - u * between(r, 2, 4) - u, u, u, takeSpark(0.6) ?? block());
  } else if (lay === 'disc') {
    const R = Math.min(w, h) * (0.24 + r() * 0.08);
    const cx = w * (0.4 + r() * 0.22);
    const cy = h * (0.3 + r() * 0.1);
    out.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="url(#${id}d0)"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 0.62)}" fill="url(#${id}d2)"/>`);
    terrain(0, w, h * 0.62, h * 0.78, h * 0.7);
    const bw = u * between(r, 2, 3);
    const bx = u * between(r, 2, 10);
    const bh = u * between(r, 3, 5);
    rect(bx, h - bh, bw, bh, block());
    rect(bx + bw, h - u, u, u, takeSpark(0.6) ?? block());
  } else if (lay === 'tiles') {
    const cols = 4;
    const rows = Math.max(2, Math.round((cols * h) / w));
    const gap = u / 3;
    const cw = (w - gap * (cols + 1)) / cols;
    const ch = (h - gap * (rows + 1)) / rows;
    let filled = 0;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = gap + i * (cw + gap);
        const y = gap + j * (ch + gap);
        const roll = r();
        if (roll < 0.4 || (filled === 0 && i === cols - 1 && j === rows - 1)) {
          rect(x, y, cw, ch, block(), u / 6);
          filled++;
        } else if (roll < 0.75) {
          rect(x, y, cw, ch, `url(#${id}d${between(r, 0, 2)})`, u / 6, 'p');
        } else {
          out.push(`<rect x="${f(x + 0.5)}" y="${f(y + 0.5)}" width="${f(cw - 1)}" height="${f(ch - 1)}" rx="${f(u / 6)}" fill="none" stroke="${pal.grid}" stroke-width="1" vector-effect="non-scaling-stroke"/>`);
        }
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs>${defs}</defs>${out.join('')}</svg>`;
}
