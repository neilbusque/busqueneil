// v13 motion layer: one calm entrance rhythm, then lightweight scroll reveals.
//
// Conversion guardrails:
//   1. Content is hidden only after JS confirms motion is allowed.
//   2. Every hidden element has an IntersectionObserver path and an on-screen failsafe.
//   3. Reduced-motion visitors get the complete resting design with no animation setup.
//
// Lifecycle-safe with Astro's ClientRouter: setup on astro:page-load, teardown before swap.
import gsap from 'gsap';

const REVEAL_SELECTOR = [
  '.v8 .hsec > .eyebrow',
  '.v8 .hsec > .sec',
  '.v8 .hsec > .stack-note',
  '.v8 .hsec > .praise-note',
  '.v8 .stats .stat',
  '.v8 .svc > li',
  '.v8 .workcard',
  '.v8 .client-logos',
  '.v8 .praise-shot',
  '.v8 .nowwrap > :first-child',
  '.v8 .postlist li',
  '.v8 .statement',
  '.v8 .stack-group',
  '.v8 .diy > li',
  '.v8 .why > li',
  '.v8 .guar > li',
  '.v8 .darkcta',
  '.v8 .offer-card',
  '.v8 .svc-card',
  '.v8 .hire-step',
  '.v8 .steps > li',
  '.v8 .faq > details',
  '.v8 .tl-row',
  '.v8 .cs-row',
  '.v8 .art-img',
  '.v8 .about-photo',
  '.v8 .prose > h2',
  '.v8 .shell-foot > *',
].join(', ');

const ROW_SELECTOR = [
  '.stack-group',
  '.diy > li',
  '.postlist li',
  '.faq > details',
  '.tl-row',
  '.cs-row',
].join(', ');

const PANEL_SELECTOR = [
  '.statement',
  '.darkcta',
  '.workcard',
  '.svc > li',
  '.offer-card',
  '.svc-card',
  '.praise-shot',
].join(', ');

const HEADING_SELECTOR = '.eyebrow, .sec, .prose > h2';
const FAILSAFE_MS = 2200;

let observer: IntersectionObserver | null = null;
let clipObserver: IntersectionObserver | null = null;
let failsafe: number | null = null;
let entrance: gsap.core.Timeline | null = null;
const revealTweens = new Set<gsap.core.Tween>();

const motionOK = () => matchMedia('(prefers-reduced-motion: no-preference)').matches;

// Work-card clips download and play only while their card is visible. Posters remain the full
// fallback for reduced motion and browsers that reject autoplay.
function initClips() {
  clipObserver?.disconnect();
  clipObserver = null;

  const clips = [...document.querySelectorAll<HTMLVideoElement>('video[data-wc-clip]')];
  if (!clips.length || !motionOK()) return;

  clipObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const video = entry.target as HTMLVideoElement;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }
  }, { threshold: 0.35 });

  clips.forEach((video) => clipObserver!.observe(video));
}

function orderedByPagePosition(elements: Element[]) {
  return [...elements].sort((a, b) => {
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    return Math.abs(ar.top - br.top) > 8 ? ar.top - br.top : ar.left - br.left;
  });
}

function remember(tween: gsap.core.Tween) {
  revealTweens.add(tween);
  tween.eventCallback('onComplete', () => revealTweens.delete(tween));
}

function drawHighlights(within: Element[], delay = 0.12) {
  const highlights = within.flatMap((element) => [
    ...(element.matches('.mark-hl') ? [element] : []),
    ...element.querySelectorAll('.mark-hl'),
  ]) as HTMLElement[];
  if (!highlights.length) return;

  const unique = [...new Set(highlights)];
  const tween = gsap.to(unique, {
    backgroundSize: '100% .22em',
    duration: 0.62,
    delay,
    ease: 'power2.out',
    stagger: 0.05,
    overwrite: 'auto',
    clearProps: 'backgroundSize',
  });
  remember(tween);
}

function show(elements: Element[], stagger = true, delay = 0) {
  if (!elements.length) return;
  const ordered = orderedByPagePosition(elements);

  const tween = gsap.to(ordered, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    duration: 0.72,
    delay,
    ease: 'power3.out',
    stagger: stagger ? 0.065 : 0,
    overwrite: 'auto',
    clearProps: 'opacity,transform,willChange',
  });
  remember(tween);
  drawHighlights(ordered, delay + 0.14);
}

function prepare(element: HTMLElement) {
  let x = 0;
  let y = 18;
  let scale = 1;

  if (element.matches(ROW_SELECTOR)) {
    x = 14;
    y = 0;
  } else if (element.matches(PANEL_SELECTOR)) {
    y = 26;
    scale = 0.988;
  } else if (element.matches(HEADING_SELECTOR)) {
    y = 22;
  }

  gsap.set(element, { opacity: 0, x, y, scale, willChange: 'transform,opacity' });
  const highlights = [
    ...(element.matches('.mark-hl') ? [element] : []),
    ...element.querySelectorAll<HTMLElement>('.mark-hl'),
  ];
  if (highlights.length) gsap.set(highlights, { backgroundSize: '0% .22em' });
}

function initEntrance() {
  const introDelay = document.getElementById('v8-intro') ? 1.05 : 0;
  entrance = gsap.timeline({
    delay: introDelay,
    defaults: { ease: 'power3.out', overwrite: 'auto' },
  });

  const nav = document.querySelector('.v8 .topnav-inner');
  if (nav) {
    entrance.fromTo(nav,
      { opacity: 0, y: -16, scale: 0.985 },
      { opacity: 1, y: 0, scale: 1, duration: 0.68, clearProps: 'opacity,transform' },
      0,
    );
  }

  const hero = document.querySelector('.v8 .hero');
  if (hero) {
    const copy = hero.querySelectorAll(
      '.hero-copy > .eyebrow, .hero-copy > h1, .hero-copy > .hero-sub, ' +
      '.hero-copy > .hero-ctas, .hero-copy > .hero-note',
    );
    const visual = hero.querySelector('.hero-visual');
    const person = hero.querySelector('.hero-person');

    if (copy.length) {
      entrance.fromTo(copy,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.72, stagger: 0.085, clearProps: 'opacity,transform' },
        0.12,
      );
    }
    if (visual) {
      entrance.fromTo(visual,
        { opacity: 0, y: 34, scale: 0.975 },
        { opacity: 1, y: 0, scale: 1, duration: 0.92, clearProps: 'opacity,transform' },
        0.22,
      );
    }
    if (person) {
      entrance.fromTo(person,
        { opacity: 0, y: 18, scale: 0.93 },
        { opacity: 1, y: 0, scale: 1, duration: 0.72, clearProps: 'opacity,transform' },
        0.54,
      );
    }
    return;
  }

  // Inner routes use either a page-head wrapper or a direct eyebrow/H1/lede trio.
  const heading = document.querySelectorAll(
    '.v8 .page-head > *, .v8 .shell-main > .eyebrow, .v8 .shell-main > h1.sec, ' +
    '.v8 .shell-main > .res-lede, .v8 .shell-main > .story-lede',
  );
  if (heading.length) {
    const highlights = [...heading].flatMap((element) => [
      ...(element.matches('.mark-hl') ? [element] : []),
      ...element.querySelectorAll('.mark-hl'),
    ]);
    if (highlights.length) gsap.set(highlights, { backgroundSize: '0% .22em' });
    entrance.fromTo(heading,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.075, clearProps: 'opacity,transform' },
      0.1,
    );
    if (highlights.length) {
      entrance.to(highlights, {
        backgroundSize: '100% .22em',
        duration: 0.58,
        stagger: 0.05,
        clearProps: 'backgroundSize',
      }, 0.34);
    }
  }
}

function teardown() {
  observer?.disconnect();
  observer = null;
  clipObserver?.disconnect();
  clipObserver = null;
  entrance?.kill();
  entrance = null;
  revealTweens.forEach((tween) => tween.kill());
  revealTweens.clear();
  if (failsafe !== null) {
    clearTimeout(failsafe);
    failsafe = null;
  }
}

function initReveal() {
  teardown();
  if (!('IntersectionObserver' in window)) return;
  initClips();
  if (!motionOK()) return;

  initEntrance();

  // Skip anything currently hidden for application-state reasons, and avoid taking ownership
  // of cards inside timeline rows because the row is already the motion unit.
  const targets = [...document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)]
    .filter((element) => element.getClientRects().length > 0)
    .filter((element) => !(element.classList.contains('v8-card') && element.closest('.tl-row')));
  if (!targets.length) return;

  targets.forEach(prepare);
  const pending = new Set<Element>(targets);
  let firstDelivery = true;

  observer = new IntersectionObserver((entries, activeObserver) => {
    const hit = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target);
    if (!hit.length) return;
    hit.forEach((element) => {
      pending.delete(element);
      activeObserver.unobserve(element);
    });
    // Let the navigation/hero establish the first beat before visible below-hero content joins.
    show(hit, true, firstDelivery ? 0.34 : 0);
    firstDelivery = false;
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.04 });

  targets.forEach((element) => observer!.observe(element));

  // Anything already visible after the entrance window should never remain hidden if an
  // observer delivery was delayed. Below-fold elements stay owned by the observer.
  failsafe = window.setTimeout(() => {
    const stuck = [...pending].filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    if (!stuck.length) return;
    stuck.forEach((element) => {
      pending.delete(element);
      observer?.unobserve(element);
    });
    show(stuck, false);
  }, FAILSAFE_MS);
}

document.addEventListener('astro:page-load', initReveal);
document.addEventListener('astro:before-swap', teardown);
