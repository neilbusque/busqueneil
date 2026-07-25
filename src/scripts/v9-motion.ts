// Lightweight motion layer built on the browser's native Web Animations API.
// Content stays visible without JavaScript, and no animation library is shipped.

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
  '.v8 .praise-shot',
].join(', ');

let observer: IntersectionObserver | null = null;
const animations = new Set<Animation>();

const motionOK = () => matchMedia('(prefers-reduced-motion: no-preference)').matches;

function animateIn(el: Element, delay = 0, distance = 22) {
  if (!(el instanceof HTMLElement) || !el.isConnected) return;
  const animation = el.animate(
    [
      { opacity: 0, transform: `translateY(${distance}px)` },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    {
      duration: 520,
      delay,
      easing: 'cubic-bezier(.2,.7,.3,1)',
      fill: 'both',
    },
  );
  animations.add(animation);
  animation.finished
    .then(() => animation.cancel())
    .catch(() => undefined)
    .finally(() => animations.delete(animation));
}

function teardown() {
  observer?.disconnect();
  observer = null;
  animations.forEach((animation) => animation.cancel());
  animations.clear();
}

function initReveal() {
  teardown();
  if (!motionOK()) return;

  const head = document.querySelectorAll([
    '.v8 .hero .hero-kicker',
    '.v8 .hero h1',
    '.v8 .hero .hero-sub',
    '.v8 .hero .hero-ctas',
    '.v8 .hero .hero-reassurance',
    '.v8 .shell-main > .eyebrow',
    '.v8 .shell-main > .sec',
    '.v8 .shell-main > .story-lede',
  ].join(', '));
  head.forEach((el, index) => animateIn(el, index * 65, 16));

  const photo = document.querySelector('.v8 .hero-photo-wrap');
  if (photo) animateIn(photo, 180, 26);

  const targets = [...document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)]
    .filter((el) => el.getClientRects().length > 0)
    .filter((el) => !(el.classList.contains('v8-card') && el.closest('.tl-row')));
  if (!targets.length) return;

  observer = new IntersectionObserver((entries, currentObserver) => {
    const visible = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target);
    visible.forEach((el, index) => {
      currentObserver.unobserve(el);
      animateIn(el, Math.min(index, 5) * 55);
    });
  }, { rootMargin: '0px 0px -7% 0px', threshold: 0.01 });

  targets.forEach((el) => observer!.observe(el));
}

document.addEventListener('astro:page-load', initReveal);
document.addEventListener('astro:before-swap', teardown);
