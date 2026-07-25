// v9 motion layer: GSAP entrance + scroll-in reveals.
//
// Two hard rules, because this runs on pages whose job is to convert:
//   1. Nothing is hidden unless JS is running and motion is allowed. No JS = full content.
//   2. Nothing can stay hidden. IntersectionObserver drives the reveal (it fires on instant
//      jumps to the bottom, unlike a scroll-position observer), and a failsafe timer reveals
//      anything still hidden regardless. A stuck-invisible CTA converts nobody.
//
// Lifecycle-safe with Astro's ClientRouter: setup on astro:page-load, teardown on before-swap.
import gsap from 'gsap';

const REVEAL_SELECTOR = [
  '.v8 .workcard',
  '.v8 .svc li',
  '.v8 .shell-main .v8-card',
  '.v8 .postlist li',
  '.v8 .hire-step',
  '.v8 .stats .stat',
  '.v8 .art-img',
  '.v8 .darkcta',
  '.v8 .tl-row',
].join(', ');

const FAILSAFE_MS = 2500;

let observer: IntersectionObserver | null = null;
let failsafe: number | null = null;
let cellResize: number | null = null;
let clipObserver: IntersectionObserver | null = null;

// Work-card clips. preload="none" means nothing downloads until a card is actually on screen,
// and reduced-motion never plays at all: the poster is the full fallback, so the card still
// shows the product either way.
function initClips() {
  clipObserver?.disconnect();
  clipObserver = null;

  const clips = [...document.querySelectorAll<HTMLVideoElement>('video[data-wc-clip]')];
  if (!clips.length || !motionOK()) return;

  clipObserver = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target as HTMLVideoElement;
      // play() rejects on some browsers' autoplay policies; the poster is already correct, so
      // swallowing it is the right fallback rather than logging noise on a marketing page.
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }
  }, { threshold: 0.35 });

  clips.forEach((v) => clipObserver!.observe(v));
}

const motionOK = () => matchMedia('(prefers-reduced-motion: no-preference)').matches;

// v11 hero cell grid.
//
// The lit cells are real DOM cells inside the same grid that draws the hero's lines, so every
// one of them lands exactly on a line. The cluster is defined as offsets from an anchor derived
// from the measured column/row count, NOT as fixed indices, or it would drift off the box at
// every breakpoint. It sits up and left of the figure so the cells are not hidden behind him.
const CLUSTER: Array<[number, number, number]> = [
  // [row offset, col offset, opacity]
  [-2,  0, .30], [-1, -1, .55], [-1,  1, .34], [0, 0, .62],
  [ 0,  2, -1 ], [ 1, -1, .45], [ 2,  1, .26], [-2, 3, .22], [1, 4, .38],
];

function buildCellGrid(): HTMLElement[] {
  const grid = document.querySelector<HTMLElement>('[data-cellgrid]');
  if (!grid) return [];
  grid.replaceChildren();

  const box = grid.getBoundingClientRect();
  const mod = parseFloat(getComputedStyle(grid.closest('.v8') || document.body).getPropertyValue('--mod')) || 88;
  const cell = mod / 2;
  if (box.width < cell || box.height < cell) return [];

  const cols = Math.ceil(box.width / cell);
  const rows = Math.ceil(box.height / cell);
  const anchorRow = Math.round(rows * 0.34);
  const anchorCol = Math.round(cols * 0.50);

  const lit = new Map<string, number>();
  for (const [dr, dc, o] of CLUSTER) {
    const r = anchorRow + dr, c = anchorCol + dc;
    if (r >= 0 && r < rows && c >= 0 && c < cols) lit.set(`${r}:${c}`, o);
  }

  const frag = document.createDocumentFragment();
  const on: HTMLElement[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = document.createElement('i');
      const o = lit.get(`${r}:${c}`);
      if (o !== undefined) {
        // a single ink cell keeps the cluster from reading as one flat wash of yellow
        i.className = o < 0 ? 'on ink' : 'on';
        if (o > 0) i.style.setProperty('--o', String(o));
        on.push(i);
      }
      frag.appendChild(i);
    }
  }
  grid.appendChild(frag);
  return on;
}

function show(els: Element[], stagger = true) {
  if (!els.length) return;
  gsap.to(els, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: 'power2.out',
    stagger: stagger ? 0.07 : 0,
    overwrite: 'auto',
    clearProps: 'transform',
  });
}

function teardown() {
  observer?.disconnect();
  observer = null;
  if (failsafe !== null) {
    clearTimeout(failsafe);
    failsafe = null;
  }
  if (cellResize !== null) {
    clearTimeout(cellResize);
    cellResize = null;
  }
  window.removeEventListener('resize', onCellResize);
  clipObserver?.disconnect();
  clipObserver = null;
}

function onCellResize() {
  if (cellResize !== null) clearTimeout(cellResize);
  cellResize = window.setTimeout(() => { buildCellGrid(); }, 180);
}

function initReveal() {
  teardown();

  // The hero grid is part of the DESIGN, not the motion layer: it must render at full opacity
  // even when motion is reduced. Only its entrance is gated below.
  const cells = buildCellGrid();
  if (cells.length) window.addEventListener('resize', onCellResize);
  initClips();

  if (!motionOK()) return;

  // Header entrance. Held back on first load of home while the intro overlay is still up.
  const introDelay = document.getElementById('v8-intro') ? 1.1 : 0;
  const head = document.querySelectorAll(
    '.v8 .shell-main .avail, .v8 .hero .script-hi, .v8 .hero h1, .v8 .hero .hero-sub, .v8 .hero .hero-ctas, ' +
    '.v8 .shell-main > .eyebrow, .v8 .shell-main > .sec, .v8 .shell-main > .story-lede'
  );
  if (head.length) {
    gsap.fromTo(head, { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.08, delay: introDelay, clearProps: 'transform' });
  }
  const photo = document.querySelector('.v8 .hero-photo-wrap');
  if (photo) {
    gsap.fromTo(photo, { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: introDelay + 0.25 });
  }

  // The cells build the grid behind him, one stagger sweeping out from the cluster's centre.
  // Opacity is function-based because each cell has its own resting alpha (they are deliberately
  // uneven); a single flat target would erase that. clearProps hands the resting state back to
  // the stylesheet's var(--o) so a later resize rebuild is not fighting inline styles.
  if (cells.length) {
    const restOf = (el: HTMLElement) =>
      el.classList.contains('ink') ? 0.09 : Number(el.style.getPropertyValue('--o') || 0.5);
    gsap.fromTo(cells,
      { scale: 0.6, opacity: 0 },
      {
        scale: 1,
        opacity: (_i: number, t: HTMLElement) => restOf(t),
        duration: 0.55,
        ease: 'power2.out',
        delay: introDelay + 0.45,
        stagger: { each: 0.075, from: 'center' },
        clearProps: 'opacity,scale',
      });
  }

  // Scroll reveals. Skip anything already hidden for other reasons (e.g. the form success card)
  // so we never take ownership of an element we are not allowed to show.
  const targets = [...document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)]
    .filter((el) => el.getClientRects().length > 0)
    .filter((el) => !(el.classList.contains('v8-card') && el.closest('.tl-row')));
  if (!targets.length) return;

  gsap.set(targets, { opacity: 0, y: 26 });
  const pending = new Set<Element>(targets);

  observer = new IntersectionObserver((entries, obs) => {
    const hit = entries.filter((e) => e.isIntersecting).map((e) => e.target);
    if (!hit.length) return;
    hit.forEach((el) => { pending.delete(el); obs.unobserve(el); });
    show(hit);
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });

  targets.forEach((el) => observer!.observe(el));

  // Belt and braces: anything sitting ON SCREEN and still hidden after this window is stuck,
  // so show it unconditionally. Below-fold elements stay with the observer and keep their
  // scroll-in animation.
  failsafe = window.setTimeout(() => {
    if (!pending.size) return;
    const stuck = [...pending].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    });
    if (!stuck.length) return;
    stuck.forEach((el) => { pending.delete(el); observer?.unobserve(el); });
    show(stuck, false);
  }, FAILSAFE_MS);
}

document.addEventListener('astro:page-load', initReveal);
document.addEventListener('astro:before-swap', teardown);
