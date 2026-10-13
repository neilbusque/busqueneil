/* Prepares a rendered article body for the article layout: gives every H2 a stable id, collects
   those H2s for the table of contents, and wraps any bare table so it scrolls inside its own box
   on phones instead of widening the page. Pure string work, safe at build time and on request. */

export interface TocItem {
  id: string;
  /** Inner HTML of the heading, tags removed, entities kept. Render with set:html. */
  html: string;
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', nbsp: ' ' };

function decode(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

export function slugify(text: string): string {
  return decode(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'section';
}

export function prepareProse(html: string, reserved: string[] = []): { html: string; toc: TocItem[] } {
  const used = new Set(reserved);
  const toc: TocItem[] = [];

  let out = html.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g, (whole, attrs: string | undefined, inner: string) => {
    const a = attrs ?? '';
    const label = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const given = /\sid="([^"]+)"/.exec(a)?.[1];
    let id = given ?? slugify(label);
    if (!given) {
      const base = id;
      for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
    }
    used.add(id);
    toc.push({ id, html: label });
    return given ? whole : `<h2${a} id="${id}">${inner}</h2>`;
  });

  // A table outside .table-wrap would set the page width on phones. Wrap it, unless the tag
  // right before it already opens a wrapper (with or without extra attributes).
  if (/<table/.test(out)) {
    out = out.replace(/<table[\s\S]*?<\/table>/g, (t, offset: number, all: string) => {
      const before = all.slice(Math.max(0, offset - 400), offset).trimEnd();
      return /<div\s[^>]*class="[^"]*\btable-wrap\b[^"]*"[^>]*>$/.test(before) ? t : `<div class="table-wrap">${t}</div>`;
    });
  }

  return { html: out, toc };
}

/** Words in a chunk of HTML, for read times. */
export function countWords(html: string): number {
  const text = decode(html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' '));
  const words = text.match(/[A-Za-z0-9][A-Za-z0-9'’.,%$-]*/g);
  return words ? words.length : 0;
}

/** Minutes to read, at 230 words a minute, never under 1. */
export const minutesFor = (words: number): number => Math.max(1, Math.round(words / 230));
