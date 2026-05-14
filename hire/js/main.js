/* Neil Busque · Hire Funnel — Rich Landing
   Reveal-on-scroll + scroll progress + card spotlight + tilt + magnetic + CTA fallback. */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- 1. Reveal-on-scroll ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- 2. Scroll progress bar ----------
  const progress = document.querySelector('.scroll-progress');
  if (progress) {
    let ticking = false;
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
      progress.style.width = pct + '%';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    updateProgress();
  }

  // ---------- 3. Card spotlight (mouse-position-aware glow) ----------
  if (!prefersReduced) {
    document.querySelectorAll('.card, .path').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      });
    });
  }

  // ---------- 4. Tilt-on-hover (subtle 3D) ----------
  if (!prefersReduced) {
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      const MAX_TILT = 4; // degrees
      let rafId = null;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = e.clientX - rect.left - cx;
        const dy = e.clientY - rect.top - cy;
        const rx = (dy / cy) * -MAX_TILT;
        const ry = (dx / cx) * MAX_TILT;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          el.style.transform = `translateY(-4px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
      });

      el.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        el.style.transform = '';
      });
    });
  }

  // ---------- 5. Magnetic buttons ----------
  if (!prefersReduced) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      const STRENGTH = 0.25;
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * STRENGTH}px, ${y * STRENGTH}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ---------- 6. "Book a call" CTA fallback ----------
  // Until Neil picks a calendar, links scroll to the close section or open mailto.
  const BOOKING_URL = ''; // e.g. 'https://calendly.com/busqueneil/30min'
  const MAILTO = 'mailto:busqueneil@gmail.com?subject=Booking%20request&body=Hi%20Neil%2C%20I%27d%20like%20to%20book%20a%20call.';

  document.querySelectorAll('[data-cta="book"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (BOOKING_URL) {
        e.preventDefault();
        window.open(BOOKING_URL, '_blank', 'noopener');
        return;
      }
      const href = el.getAttribute('href') || '';
      if (href.startsWith('#')) return;
      e.preventDefault();
      window.location.href = MAILTO;
    });
  });
})();
