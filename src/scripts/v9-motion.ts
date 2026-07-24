// v9 motion layer: GSAP reveals + branded custom cursor.
// Lifecycle-safe with Astro's ClientRouter: setup on astro:page-load, teardown on astro:before-swap.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const motionOK = () => matchMedia('(prefers-reduced-motion: no-preference)').matches;

/* ---- custom cursor: instant ink dot + lagging ring that fills sun-yellow over interactives ---- */
let cursorCleanup: (() => void) | null = null;

function initCursor() {
  cursorCleanup?.();
  cursorCleanup = null;
  if (!matchMedia('(pointer: fine)').matches || !motionOK()) {
    document.documentElement.classList.remove('bn-cursor');
    return;
  }
  document.documentElement.classList.add('bn-cursor');

  const dot = document.createElement('div');
  dot.id = 'bn-cursor';
  const ring = document.createElement('div');
  ring.id = 'bn-cursor-ring';
  document.body.append(ring, dot);
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

  const dx = gsap.quickTo(dot, 'x', { duration: 0.06, ease: 'power2.out' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.06, ease: 'power2.out' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.3, ease: 'power2.out' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.3, ease: 'power2.out' });

  const move = (e: MouseEvent) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
  const over = (e: MouseEvent) => {
    const hot = (e.target as Element | null)?.closest?.('a, button, [role="button"], input, select, textarea, label');
    gsap.to(ring, { scale: hot ? 1.55 : 1, backgroundColor: hot ? 'rgba(255,232,98,.4)' : 'rgba(255,232,98,0)', duration: 0.2, overwrite: 'auto' });
  };
  const down = () => gsap.to(dot, { scale: 0.55, duration: 0.12 });
  const up = () => gsap.to(dot, { scale: 1, duration: 0.12 });

  window.addEventListener('mousemove', move, { passive: true });
  window.addEventListener('mouseover', over, { passive: true });
  window.addEventListener('mousedown', down);
  window.addEventListener('mouseup', up);

  cursorCleanup = () => {
    window.removeEventListener('mousemove', move);
    window.removeEventListener('mouseover', over);
    window.removeEventListener('mousedown', down);
    window.removeEventListener('mouseup', up);
    dot.remove();
    ring.remove();
  };
}

/* ---- reveals: header entrance + scroll-in for cards/rows ---- */
function initReveal() {
  if (!motionOK() || document.body.dataset.motion) return;
  document.body.dataset.motion = '1';

  // if the cinematic intro overlay is up (first visit to home), hold the entrance until it leaves
  const introDelay = document.getElementById('v8-intro') ? 1.1 : 0;

  const head = document.querySelectorAll(
    '.v8 .shell-main .avail, .v8 .hero .script-hi, .v8 .hero h1, .v8 .hero .hero-sub, .v8 .hero .hero-ctas, ' +
    '.v8 .shell-main > .eyebrow, .v8 .shell-main > .sec, .v8 .shell-main > .story-lede'
  );
  if (head.length) {
    gsap.fromTo(head, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.08, delay: introDelay, clearProps: 'transform' });
  }
  const photo = document.querySelector('.v8 .hero-photo-wrap');
  if (photo) gsap.fromTo(photo, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: introDelay + 0.25 });

  const items = gsap.utils
    .toArray<Element>('.v8 .workcard, .v8 .svc li, .v8 .shell-main .v8-card, .v8 .postlist li, .v8 .hire-step, .v8 .stats .stat, .v8 .cway, .v8 .art-img, .v8 .darkcta, .v8 .tl-row')
    .filter((el) => el.getClientRects().length > 0) // skip hidden elements (e.g. the form success card)
    .filter((el) => !(el.classList.contains('v8-card') && el.closest('.tl-row'))); // timeline cards ride their row
  const unique = [...new Set(items)];
  if (unique.length) {
    gsap.set(unique, { opacity: 0, y: 26 });
    ScrollTrigger.batch(unique, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.07, overwrite: true }),
    });
    // anything that never got a chance to trigger (e.g. filters/layout changes) shows itself as a safety net
    setTimeout(() => ScrollTrigger.refresh(), 600);
  }
}

function boot() {
  initCursor();
  initReveal();
}

document.addEventListener('astro:page-load', boot);
document.addEventListener('astro:before-swap', () => {
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
