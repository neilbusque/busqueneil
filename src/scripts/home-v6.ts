// busqueneil.com v6 — immersive scroll film.
// One bundled module. Markup is readable with zero JS; GSAP scenes are
// progressive enhancement, gated to desktop and disabled under reduced-motion.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = () => matchMedia('(min-width: 768px)').matches;

/* ---- reveal-on-scroll (works everywhere; static under reduced-motion) ---- */
function initReveals() {
  if (reduce || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.v6 .reveal').forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  document.querySelectorAll('.v6 .reveal').forEach((el) => io.observe(el));
}

/* ---- page cursor spotlight + hero parallax (desktop pointer only) ---- */
function initCursor() {
  if (matchMedia('(hover: none)').matches) return;
  const pc = document.getElementById('pageCursor');
  const hero = document.querySelector<HTMLElement>('.v6 .hero');
  const vis = document.getElementById('heroVisual');
  let mx = 0, my = 0, raf = 0;
  let heroRect: DOMRect | null = null;
  const frame = () => {
    raf = 0;
    if (vis && hero) {
      if (!heroRect) heroRect = hero.getBoundingClientRect();
      if (mx >= heroRect.left && mx <= heroRect.right && my >= heroRect.top && my <= heroRect.bottom) {
        const nx = (mx - heroRect.left) / heroRect.width - 0.5;
        const ny = (my - heroRect.top) / heroRect.height - 0.5;
        vis.style.transform = `translate(${(nx * 16).toFixed(1)}px,${(ny * 12).toFixed(1)}px) rotate(${(nx * 1.4).toFixed(2)}deg)`;
      } else { vis.style.transform = ''; }
    }
  };
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    mx = e.clientX; my = e.clientY;
    if (pc) { pc.style.transform = `translate(${mx}px,${my}px)`; pc.style.opacity = '1'; }
    if (!raf) raf = requestAnimationFrame(frame);
  }, { passive: true });
  window.addEventListener('scroll', () => { heroRect = null; }, { passive: true });
  window.addEventListener('resize', () => { heroRect = null; }, { passive: true });
  document.addEventListener('mouseleave', () => { if (pc) pc.style.opacity = '0'; });
}

function boot() {
  initReveals();
  initCursor();
  // Scenes wired in later tasks:
  // initLightbox(); initBuildCTA();
  // if (!reduce && desktop()) { initProcessFilm(); initMuseum(); }
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
