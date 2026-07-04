/**
 * Pure HTML => ScrapedPage extraction for the analyzer's live-URL input.
 * Regex-based on purpose: no DOM, no deps, safe in serverless + vitest.
 * Used by api/scrape.ts - MUST stay import-free: Vercel compiles api files
 * under node16 resolution, and any src import chain would drag Vite-only
 * modules (import.meta.env) into the function's type graph. ScrapedPage is
 * defined here and re-exported by analyzer.ts.
 */
export interface AuditSignals {
  hasViewportMeta: boolean;
  formCount: number;
  emailOrTelInput: boolean;
  ctaTexts: string[];
  ctaAboveFold: boolean;
  imageCount: number;
  scriptCount: number;
  approxBytes: number;
  navLinkCount: number;
  hasHeroMedia: boolean;
  h1Count: number;
  hasSocialProof: boolean;
  hasGuarantee: boolean;
  hasUrgency: boolean;
}

export interface ScrapedPage {
  title: string;
  metaDescription: string;
  headings: string[];
  text: string;
  thin: boolean;
  signals: AuditSignals;
}

const TEXT_CAP = 15000;
const THIN_THRESHOLD = 200;

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&mdash;": "—",
  "&ndash;": "–",
  "&rsquo;": "'",
  "&lsquo;": "'",
  "&rdquo;": '"',
  "&ldquo;": '"',
};

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&[a-z]+;/gi, m => ENTITIES[m.toLowerCase()] ?? " ");
}

function collapse(s: string): string {
  return decodeEntities(s).replace(/\s+/g, " ").trim();
}

function stripTags(html: string): string {
  return collapse(html.replace(/<[^>]+>/g, " "));
}

const CTA_RE = /\b(get|start|book|try|download|join|claim|schedule|buy|sign[\s-]?up|register|request|reserve|apply|subscribe|order|call|quote)\b/i;
const PROOF_RE = /\b(testimonial|reviews?|rating|5[\s-]?star|trusted by|as seen (on|in)|clients?|customers?|case study)\b/i;
const GUARANTEE_RE = /\b(guarantee|money[\s-]?back|refund|no risk|risk[\s-]?free|cancel anytime)\b/i;
const URGENCY_RE = /\b(limited|today|now|deadline|ends|hurry|only \d+|spots? (left|remaining)|last chance|expires?)\b/i;

function countMatches(re: RegExp, s: string): number {
  const m = s.match(re);
  return m ? m.length : 0;
}

export function extractSignals(html: string, bodyText: string): AuditSignals {
  const hasViewportMeta = /<meta[^>]+name=["']viewport["']/i.test(html);
  const formCount = countMatches(/<form[\s>]/gi, html);
  const emailOrTelInput = /<input[^>]+type=["'](email|tel)["']/i.test(html);
  const imageCount = countMatches(/<img[\s>]/gi, html);
  const scriptCount = countMatches(/<script[\s>]/gi, html);
  const h1Count = countMatches(/<h1[\s>]/gi, html);
  const approxBytes = html.length;

  // CTA link/button texts matching the action pattern.
  const ctaTexts: string[] = [];
  for (const m of html.matchAll(/<(a|button)[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const txt = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (txt && CTA_RE.test(txt) && txt.length <= 60) {
      ctaTexts.push(txt);
      if (ctaTexts.length >= 10) break;
    }
  }

  // Above-the-fold proxy: first CTA text appears within first 1500 chars of body text.
  const foldSlice = bodyText.slice(0, 1500);
  const ctaAboveFold = ctaTexts.some(t => foldSlice.includes(t));

  // Nav links: count <a inside the first <nav> (or <header>) block.
  const navBlock = (html.match(/<nav[\s\S]*?<\/nav>/i) ?? html.match(/<header[\s\S]*?<\/header>/i))?.[0] ?? "";
  const navLinkCount = countMatches(/<a[\s>]/gi, navBlock);

  // Hero media before the first CTA in source order.
  const firstCtaIdx = (() => {
    for (const m of html.matchAll(/<(a|button)[^>]*>([\s\S]*?)<\/\1>/gi)) {
      if (CTA_RE.test(m[2].replace(/<[^>]+>/g, ' '))) return m.index ?? html.length;
    }
    return html.length;
  })();
  const firstMediaIdx = (() => {
    const m = html.match(/<(img|video|iframe)[\s>]/i);
    return m ? (m.index ?? html.length) : html.length;
  })();
  const hasHeroMedia = firstMediaIdx < firstCtaIdx;

  return {
    hasViewportMeta,
    formCount,
    emailOrTelInput,
    ctaTexts,
    ctaAboveFold,
    imageCount,
    scriptCount,
    approxBytes,
    navLinkCount,
    hasHeroMedia,
    h1Count,
    hasSocialProof: PROOF_RE.test(bodyText),
    hasGuarantee: GUARANTEE_RE.test(bodyText),
    hasUrgency: URGENCY_RE.test(bodyText),
  };
}

export function extractPage(html: string): ScrapedPage {
  // Title + meta description come from the raw head.
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? stripTags(titleMatch[1]) : "";

  const metaMatch =
    html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) ??
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const metaDescription = metaMatch ? collapse(metaMatch[1]) : "";

  // Body cleanup: drop non-content containers before text extraction.
  let body = html;
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) body = bodyMatch[1];
  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");

  const headings: string[] = [];
  for (const m of body.matchAll(/<h([123])[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    const h = stripTags(m[2]);
    if (h) headings.push(h);
  }

  const text = stripTags(body).slice(0, TEXT_CAP);
  const signals = extractSignals(html, text);

  return { title, metaDescription, headings, text, thin: text.length < THIN_THRESHOLD, signals };
}
