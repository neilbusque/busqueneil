// Neil Busque — brand site. Minimal vanilla JS.

// Footer year stamp.
const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Nav border-on-scroll.
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => {
    if (window.scrollY > 8) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Reveal-on-scroll.
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// Stats count-up (respects reduced-motion).
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const statNums = document.querySelectorAll('.stat-num');

const animateCount = (el) => {
  // Find the leading integer in the element; suffix nodes (.dot/.plus/.unit) stay.
  const firstText = el.childNodes[0];
  if (!firstText || firstText.nodeType !== Node.TEXT_NODE) return;
  const target = parseInt(firstText.nodeValue.trim(), 10);
  if (!Number.isFinite(target)) return;
  if (prefersReducedMotion) {
    firstText.nodeValue = String(target);
    return;
  }
  const duration = 1100;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const value = Math.round(target * eased);
    firstText.nodeValue = String(value);
    if (t < 1) requestAnimationFrame(step);
    else firstText.nodeValue = String(target);
  };
  // Seed to 0 before observing.
  firstText.nodeValue = '0';
  requestAnimationFrame(step);
};

// Contact widget toggle (bottom-right floating).
const cw = document.getElementById('contactWidget');
if (cw) {
  const toggle = cw.querySelector('.cw-toggle');
  const close = () => {
    cw.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    cw.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  };
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    cw.classList.contains('is-open') ? close() : open();
  });
  // Click-outside to close.
  document.addEventListener('click', (e) => {
    if (cw.classList.contains('is-open') && !cw.contains(e.target)) close();
  });
  // Escape to close.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cw.classList.contains('is-open')) close();
  });
}

if (statNums.length && 'IntersectionObserver' in window) {
  const sio = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          sio.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.4 }
  );
  statNums.forEach((el) => {
    // Seed display to 0 so we don't see the final number flash before the animation.
    const firstText = el.childNodes[0];
    if (firstText && firstText.nodeType === Node.TEXT_NODE && !prefersReducedMotion) {
      firstText.nodeValue = '0';
    }
    sio.observe(el);
  });
}
