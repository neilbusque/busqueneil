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

const motionOK = () => matchMedia('(prefers-reduced-motion: no-preference)').matches;

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
}

function initReveal() {
  teardown();
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
