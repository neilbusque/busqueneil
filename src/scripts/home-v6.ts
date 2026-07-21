// busqueneil.com v6 — immersive scroll film.
// One bundled module. Markup is readable with zero JS; GSAP scenes are
// progressive enhancement, gated to desktop and disabled under reduced-motion.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/* ---- process film: pinned, scrubbed 5-beat sequence in one dark sky ---- */
function initProcessFilm() {
  const root = document.querySelector<HTMLElement>('#process[data-film]');
  if (!root) return;
  const pin = root.querySelector<HTMLElement>('.film-pin');
  if (!pin) return;
  const beat = (n: number) => root.querySelector<HTMLElement>(`.beat[data-beat="${n}"]`)!;
  const b1 = beat(1), b2 = beat(2), b3 = beat(3), b5 = beat(5);
  const caption = root.querySelector<HTMLElement>('#filmCaption')!;
  const night = root.querySelector<HTMLElement>('.sky-night')!;
  const stars = root.querySelector<HTMLElement>('.stars')!;
  const wheel = root.querySelector<HTMLElement>('#celestial')!;
  const filmN = root.querySelector<HTMLElement>('#filmN')!;
  const filmDay = root.querySelector<HTMLElement>('#filmDay')!;
  const path = root.querySelector<SVGPathElement>('#filmScribble path')!;
  const note = b1.querySelector<HTMLElement>('.note')!;
  const codeLines = b3.querySelectorAll<HTMLElement>('.editor .cl');
  const shipShot = b3.querySelector<HTMLElement>('.ship-shot')!;
  const outs = b5.querySelectorAll<HTMLElement>('.out');
  const stamp = b5.querySelector<HTMLElement>('.stamp')!;

  const captions = [
    'It starts as a scribble.',
    'We hop on a quick call and nail down what it actually is.',
    'Then I build it. Just me, heads down.',
    'Days pass. Sun up, sun down, sun up.',
    'You get it back, live. And you own it.',
  ];

  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  gsap.set([b1, b2, b3, b5], { autoAlpha: 0 });
  gsap.set(note, { autoAlpha: 0, y: 16, rotate: -3 });
  gsap.set(caption, { autoAlpha: 0 });
  gsap.set([outs[0], outs[1], stamp], { autoAlpha: 0 });

  const setCap = (i: number) => () => { caption.textContent = captions[i]; };
  const setN = (n: string) => () => { filmN.textContent = n; };
  const setDay = (d: number) => () => { filmDay.hidden = false; filmDay.textContent = 'Day ' + d; };

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: root, start: 'top top', end: '+=450%', scrub: 0.6, pin, anticipatePin: 1, invalidateOnRefresh: true },
  });
  const cap = (i: number) => {
    tl.to(caption, { autoAlpha: 0, duration: 0.12 }).add(setCap(i)).to(caption, { autoAlpha: 1, duration: 0.2 });
  };

  // BEAT 1 — the idea
  tl.add(setN('01'));
  tl.to(b1, { autoAlpha: 1, duration: 0.2 });
  tl.to(path, { strokeDashoffset: 0, duration: 0.8 }, '<');
  cap(0);
  tl.to(note, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'back.out(1.6)' }, '-=0.1');
  tl.to({}, { duration: 0.4 });
  tl.to(b1, { autoAlpha: 0, y: -30, duration: 0.3 });

  // BEAT 2 — we talk
  tl.add(setN('02'));
  tl.fromTo(b2, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35 });
  cap(1);
  tl.to({}, { duration: 0.4 });
  tl.to(b2, { autoAlpha: 0, y: -30, duration: 0.3 });

  // BEAT 3 — building: editor lines type themselves
  tl.add(setN('03'));
  tl.fromTo(b3, { autoAlpha: 0, y: 40, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4 });
  cap(2);
  tl.to(codeLines, { width: '100%', duration: 0.34, ease: 'none', stagger: 0.11 }, '<');
  tl.to({}, { duration: 0.25 });

  // BEAT 4 — days pass (laptop stays; wheel turns 720deg; night+stars crossfade; day ticks)
  tl.add(setN('04'));
  cap(3);
  tl.add(setDay(1), '<');
  tl.to(wheel, { rotation: 180, duration: 0.6, ease: 'none' });
  tl.to([night, stars], { opacity: 1, duration: 0.6, ease: 'sine.inOut' }, '<');
  tl.to(wheel, { rotation: 360, duration: 0.6, ease: 'none' });
  tl.to([night, stars], { opacity: 0, duration: 0.6, ease: 'sine.inOut' }, '<');
  tl.add(setDay(2));
  tl.to(wheel, { rotation: 540, duration: 0.6, ease: 'none' });
  tl.to([night, stars], { opacity: 1, duration: 0.6, ease: 'sine.inOut' }, '<');
  tl.to(wheel, { rotation: 720, duration: 0.6, ease: 'none' });
  tl.to([night, stars], { opacity: 0, duration: 0.6, ease: 'sine.inOut' }, '<');
  tl.add(setDay(3));
  // the build resolves: the editor becomes the product
  tl.to(shipShot, { autoAlpha: 1, duration: 0.35 });
  tl.to({}, { duration: 0.25 });
  tl.to(b3, { autoAlpha: 0, y: -30, duration: 0.3 });
  tl.to(filmDay, { autoAlpha: 0, duration: 0.2 }, '<');

  // BEAT 5 — shipped
  tl.add(setN('05'));
  tl.to(b5, { autoAlpha: 1, duration: 0.2 });
  tl.fromTo(outs[0], { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.4 }, '<');
  tl.fromTo(outs[1], { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.4 }, '-=0.25');
  cap(4);
  tl.fromTo(stamp, { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, rotate: -9, duration: 0.35, ease: 'back.out(2)' }, '-=0.1');
  tl.to({}, { duration: 0.4 });
}

/* ---- museum lightbox (works everywhere) ---- */
function initLightbox() {
  const dlg = document.querySelector<HTMLDialogElement>('#museumLightbox');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  const img = dlg.querySelector<HTMLImageElement>('#lbImg')!;
  const title = dlg.querySelector<HTMLElement>('#lbTitle')!;
  const link = dlg.querySelector<HTMLAnchorElement>('#lbLink')!;
  const inner = dlg.querySelector<HTMLElement>('.lb-inner')!;
  document.querySelectorAll<HTMLElement>('#museum .piece[data-full]').forEach((p) => {
    p.querySelector('.piece-open')?.addEventListener('click', () => {
      img.src = p.dataset.full!;
      img.alt = p.dataset.title || '';
      title.textContent = p.dataset.title || '';
      const u = p.dataset.url;
      if (u) { link.href = u; link.hidden = false; } else { link.hidden = true; }
      dlg.showModal();
    });
  });
  dlg.querySelector('#lbClose')?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (!inner.contains(e.target as Node)) dlg.close(); });
}

/* ---- museum: pinned horizontal room ---- */
function initMuseum() {
  const root = document.querySelector<HTMLElement>('#museum[data-museum]');
  if (!root) return;
  const viewport = root.querySelector<HTMLElement>('.museum-viewport');
  const track = root.querySelector<HTMLElement>('.museum-track');
  if (!viewport || !track) return;
  viewport.style.overflow = 'hidden';
  const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
  gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: viewport,
      start: 'top top',
      end: () => '+=' + (distance() + window.innerHeight * 0.4),
      scrub: 0.6,
      pin: viewport,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}

/* ---- "what do you want to build" -> WhatsApp with the idea prefilled ---- */
function initBuildCTA() {
  const form = document.querySelector<HTMLFormElement>('#buildForm');
  if (!form) return;
  const input = form.querySelector<HTMLInputElement>('#buildInput')!;
  form.querySelectorAll<HTMLButtonElement>('.chip[data-fill]').forEach((c) =>
    c.addEventListener('click', () => { input.value = c.dataset.fill!; input.focus(); }),
  );
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const idea = input.value.trim() || 'I have something I want to build';
    const msg = encodeURIComponent('Hey Neil, ' + idea + '. Can we talk?');
    window.open('https://api.whatsapp.com/send/?phone=9083164140&text=' + msg, '_blank', 'noopener');
  });
}

function boot() {
  initReveals();
  initCursor();
  initLightbox();
  initBuildCTA();
  // gsap.matchMedia builds the pinned scenes only for desktop + motion, and
  // auto-reverts every animation/ScrollTrigger it created when the query stops
  // matching (e.g. resizing below 768px), so no orphaned pin-spacer gap is left.
  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    initProcessFilm();
    initMuseum();
  });
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
