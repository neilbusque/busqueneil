import { describe, expect, it } from 'vitest';
import { art, PALETTES, type ArtKind } from '../art';

const KINDS: ArtKind[] = ['project', 'tool', 'article', 'service', 'portrait', 'hero'];
const SEEDS = Array.from({ length: 60 }, (_, i) => `seed-${i}`);
const WARM = ['#FF6A3D', '#FFB38A', '#FFD84D'];
const GREEN = ['#1E7A55'];

const rectsFilled = (svg: string, color: string) =>
  [...svg.matchAll(/<rect class="b"[^>]*?width="([\d.]+)" height="([\d.]+)"[^>]*?fill="([^"]+)"/g)]
    .filter((m) => m[3] === color)
    .map((m) => ({ w: Number(m[1]), h: Number(m[2]) }));

describe('placeholder art', () => {
  it('draws the same picture for the same kind and seed', () => {
    for (const kind of KINDS) {
      expect(art({ seed: 'same-slug', kind })).toBe(art({ seed: 'same-slug', kind }));
    }
  });

  it('draws different pictures for different seeds', () => {
    const a = art({ seed: 'one', kind: 'project' });
    const b = art({ seed: 'two', kind: 'project' });
    expect(a).not.toBe(b);
  });

  it('keeps pattern ids unique per render when a uid is passed', () => {
    const a = art({ seed: 'twin', kind: 'project', uid: 'aaa111' });
    const b = art({ seed: 'twin', kind: 'project', uid: 'bbb222' });
    const ids = (svg: string) => [...svg.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    const shared = ids(a).filter((id) => ids(b).includes(id));
    expect(ids(a).length).toBeGreaterThan(0);
    expect(shared).toEqual([]);
    // every pattern reference points at an id defined in the same picture
    for (const svg of [a, b]) {
      for (const [, ref] of svg.matchAll(/url\(#([^)]+)\)/g)) expect(ids(svg)).toContain(ref);
    }
  });

  it('never uses the green field palette', () => {
    expect(Object.keys(PALETTES)).not.toContain('field');
    for (const kind of KINDS) {
      for (const seed of SEEDS) {
        const svg = art({ seed, kind });
        for (const g of GREEN) expect(svg).not.toContain(g);
        expect(svg).not.toContain('#FFB38A');
      }
    }
  });

  it('uses at most one small warm spark per picture', () => {
    for (const kind of KINDS) {
      for (const seed of SEEDS) {
        const w = 1600;
        const svg = art({ seed, kind, w, h: 1000 });
        const sparks = WARM.flatMap((c) => rectsFilled(svg, c));
        expect(sparks.length).toBeLessThanOrEqual(1);
        for (const s of sparks) {
          expect(s.w).toBeLessThanOrEqual(w / 16);
          expect(s.h).toBeLessThanOrEqual(w / 16);
        }
      }
    }
  });

  it('keeps the hero on navy and the portrait on navy or mist', () => {
    for (const seed of SEEDS.slice(0, 20)) {
      expect(art({ seed, kind: 'hero' })).toContain(`fill="${PALETTES.navy.base}"/>`);
      const portrait = art({ seed, kind: 'portrait' });
      const base = portrait.match(/<rect width="\d+" height="\d+" fill="([^"]+)"/)?.[1];
      expect([PALETTES.navy.base, PALETTES.mist.base]).toContain(base);
    }
  });

  it('is decorative, flat and light enough to inline', () => {
    for (const kind of KINDS) {
      for (const seed of SEEDS.slice(0, 20)) {
        const svg = art({ seed, kind });
        expect(svg.startsWith('<svg')).toBe(true);
        expect(svg).toContain('aria-hidden="true"');
        expect(svg).not.toMatch(/<text|<filter|Gradient|<image/);
        expect(svg.length).toBeLessThan(6000);
      }
    }
  });
});
