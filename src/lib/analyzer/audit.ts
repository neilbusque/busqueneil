import type { AuditSignals, ScrapedPage } from './scrapeExtract';
import type { PsiResult } from './psiParse';

export interface PageAudit {
  speed: {
    source: 'psi' | 'heuristic';
    score: number;
    lcp?: number; cls?: number; inp?: number;
    approxWeightKb?: number; renderBlocking?: number;
  };
  mobile: {
    hasViewportMeta: boolean;
    responsivePass: boolean;
    tapTargetsOk?: boolean; legibleFontOk?: boolean; contentWidthOk?: boolean;
    notes: string[];
  };
  conversion: {
    items: { key: string; label: string; present: boolean; detail?: string }[];
    presentCount: number;
    totalCount: number;
  };
}

export function heuristicSpeedScore(approxBytes: number, scriptCount: number): number {
  let score = 100;
  const kb = approxBytes / 1024;
  if (kb > 1500) score -= Math.min(40, Math.floor((kb - 1500) / 100) * 2);
  if (scriptCount > 15) score -= Math.min(30, (scriptCount - 15) * 2);
  return Math.max(0, Math.min(100, score));
}

function conversionItems(s: AuditSignals): PageAudit['conversion']['items'] {
  return [
    { key: 'headline', label: 'Clear headline', present: s.h1Count > 0, ...(s.h1Count > 0 ? {} : { detail: 'no H1 found' }) },
    { key: 'primaryCta', label: 'Primary CTA', present: s.ctaTexts.length > 0, detail: s.ctaTexts.length > 0 ? `e.g. "${s.ctaTexts[0]}"` : 'no action button/link' },
    { key: 'ctaAboveFold', label: 'CTA near top', present: s.ctaAboveFold },
    { key: 'leadForm', label: 'Lead-capture form', present: s.formCount > 0 || s.emailOrTelInput, detail: `${s.formCount} form(s)` },
    { key: 'socialProof', label: 'Social proof', present: s.hasSocialProof },
    { key: 'riskReversal', label: 'Risk reversal / guarantee', present: s.hasGuarantee },
    { key: 'urgency', label: 'Urgency / scarcity', present: s.hasUrgency },
    { key: 'singleCtaFocus', label: 'Single-CTA focus', present: s.navLinkCount <= 6, detail: `${s.navLinkCount} nav links` },
    { key: 'heroVisual', label: 'Hero visual', present: s.hasHeroMedia },
  ];
}

export function buildPageAudit(scraped: ScrapedPage, psi: PsiResult | null): PageAudit {
  const s = scraped.signals;

  const speed: PageAudit['speed'] = psi
    ? { source: 'psi', score: psi.performance, ...(psi.lcp !== undefined ? { lcp: psi.lcp } : {}), ...(psi.cls !== undefined ? { cls: psi.cls } : {}), ...(psi.inp !== undefined ? { inp: psi.inp } : {}) }
    : { source: 'heuristic', score: heuristicSpeedScore(s.approxBytes, s.scriptCount), approxWeightKb: Math.round(s.approxBytes / 1024), renderBlocking: s.scriptCount };

  const notes: string[] = [];
  if (!s.hasViewportMeta) notes.push('No viewport meta tag — the page will not scale on mobile.');
  const auditsPass = psi ? (psi.audits.tapTargets !== false && psi.audits.fontSize !== false && psi.audits.contentWidth !== false) : true;
  if (psi && psi.audits.tapTargets === false) notes.push('Tap targets are too small or too close together.');
  if (psi && psi.audits.fontSize === false) notes.push('Body text is too small to read on mobile.');
  if (!psi) notes.push('Checked viewport only (no Lighthouse run).');

  const mobile: PageAudit['mobile'] = {
    hasViewportMeta: s.hasViewportMeta,
    responsivePass: s.hasViewportMeta && auditsPass,
    ...(psi?.audits.tapTargets !== undefined ? { tapTargetsOk: psi.audits.tapTargets } : {}),
    ...(psi?.audits.fontSize !== undefined ? { legibleFontOk: psi.audits.fontSize } : {}),
    ...(psi?.audits.contentWidth !== undefined ? { contentWidthOk: psi.audits.contentWidth } : {}),
    notes,
  };

  const items = conversionItems(s);
  const conversion = { items, presentCount: items.filter(i => i.present).length, totalCount: items.length };

  return { speed, mobile, conversion };
}

export const SCORE_WEIGHTS = { speed: 0.30, mobile: 0.20, conversion: 0.50 };

export function mobileScore(audit: PageAudit): number {
  if (!audit.mobile.hasViewportMeta) return 30;
  const anyFail =
    audit.mobile.tapTargetsOk === false ||
    audit.mobile.legibleFontOk === false ||
    audit.mobile.contentWidthOk === false;
  return anyFail ? 70 : 100;
}

function conversionPct(audit: PageAudit): number {
  return Math.round((audit.conversion.presentCount / audit.conversion.totalCount) * 100);
}

export function compositeScore(audit: PageAudit): number {
  const raw =
    SCORE_WEIGHTS.speed * audit.speed.score +
    SCORE_WEIGHTS.mobile * mobileScore(audit) +
    SCORE_WEIGHTS.conversion * conversionPct(audit);
  return Math.max(0, Math.min(100, Math.round(raw)));
}

/** One or two sentences, no em dashes, naming the single biggest gap. */
export function teaserSummary(audit: PageAudit): string {
  const speed = audit.speed.score;
  const mobile = mobileScore(audit);
  const conversion = conversionPct(audit);
  const dims = [
    { key: 'speed', val: speed },
    { key: 'mobile', val: mobile },
    { key: 'conversion', val: conversion },
  ].sort((a, b) => a.val - b.val);
  const worst = dims[0];
  const missing = audit.conversion.items.filter(i => !i.present).map(i => i.label.toLowerCase());

  let lead: string;
  if (worst.key === 'conversion' && missing.length) {
    const two = missing.slice(0, 2);
    const verb = two.length > 1 ? 'are' : 'is';
    lead = `Your biggest gap is conversion: ${two.join(' and ')} ${verb} missing.`;
  } else if (worst.key === 'speed') {
    lead = `Your biggest gap is speed. It scores ${speed} out of 100, and slow pages lose sales.`;
  } else if (worst.key === 'mobile') {
    lead = `Your biggest gap is mobile. The page is not fully mobile friendly, and most traffic is on phones.`;
  } else {
    lead = `Solid fundamentals. The room to grow is a sharper offer and stronger proof.`;
  }
  const best = dims[dims.length - 1];
  const anchor =
    best.key === 'speed' && speed >= 80 ? ` Page speed is strong at ${speed}.` :
    conversion >= 78 ? ` Your conversion elements are mostly in place.` : '';
  return (lead + anchor).trim();
}
