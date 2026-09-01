/* v14 motion system — GSAP core + ScrollTrigger only (keep the bundle lean; no CDN).
   Lifecycle vs Astro's ClientRouter:
   - init on `astro:page-load` (fires on initial load AND after every client navigation)
   - teardown on `astro:before-swap` (never leave ScrollTriggers on detached DOM)
   gsap.matchMedia gives prefers-reduced-motion gating and cleanup in one object.

   Hooks (markup contract):
   - [data-reveal]        scroll-in rise/fade (batched, staggered, once)
   - [data-hero-word]     hero words settle in on load (must be visible at rest — the
                          from() tween enhances, it never pre-hides; LCP is unaffected)
   - [data-kinetic]       scroll-velocity skew on large display type (the kinetic signature)
   - [data-drift="40"]    slow parallax drift through the viewport (never combine with
                          data-reveal on the same element — both write transform) */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

let mm: gsap.MatchMedia | null = null;

function teardown() {
  mm?.revert();
  mm = null;
  document.documentElement.classList.remove('gsap-ready');
}

function init() {
  teardown(); // idempotent — safe if events ever double-fire

  mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const ctx = gsap.context(() => {
      /* 1 — scroll reveals. Inline-hide BEFORE stamping gsap-ready: the prepaint CSS rule
         stops applying the moment the class lands, so below-fold targets need their
         hidden state moved onto the elements first or they flash visible. */
      const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      if (reveals.length) {
        gsap.set(reveals, { autoAlpha: 0, y: 20 });
        ScrollTrigger.batch(reveals, {
          start: 'top 88%',
          once: true,
          onEnter: (els) =>
            gsap.to(els, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.07,
              ease: 'power3.out',
              overwrite: true,
            }),
        });
      }

      /* 2 — hero words settle on load */
      const heroWords = gsap.utils.toArray<HTMLElement>('[data-hero-word]');
      if (heroWords.length) {
        gsap.from(heroWords, {
          yPercent: 55,
          autoAlpha: 0,
          rotate: 1.5,
          duration: 1.05,
          stagger: 0.075,
          ease: 'power4.out',
          clearProps: 'all',
        });
      }

      /* 3 — scroll-velocity skew on display type */
      const kinetic = gsap.utils.toArray<HTMLElement>('[data-kinetic]');
      if (kinetic.length) {
        gsap.set(kinetic, { transformOrigin: 'center center', force3D: true });
        const proxy = { skew: 0 };
        const skewSetter = gsap.quickSetter(kinetic, 'skewY', 'deg');
        const clamp = gsap.utils.clamp(-2.5, 2.5);
        ScrollTrigger.create({
          onUpdate: (self) => {
            const skew = clamp(self.getVelocity() / -650);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.9,
                ease: 'power3',
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew),
              });
            }
          },
        });
      }

      /* 4 — slow drift through the viewport */
      gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((el) => {
        const amount = parseFloat(el.dataset.drift || '40');
        gsap.fromTo(
          el,
          { y: amount * 0.5 },
          {
            y: amount * -0.5,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          },
        );
      });
    });

    return () => ctx.revert();
  });

  /* Outside the media query: the class governs the prepaint CSS rule either way. */
  document.documentElement.classList.add('gsap-ready');

  /* Font swap changes trigger positions; refresh once faces are in. */
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', teardown);
