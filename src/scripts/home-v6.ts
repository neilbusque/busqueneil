// busqueneil.com v7.1 — Grove: the seed-to-shipped scroll film + interactivity.
// Markup is readable with zero JS; GSAP scenes are progressive enhancement,
// gated to desktop and disabled under reduced-motion.
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

/* ---- sunlight cursor + hero depth (figure and emblem move on opposite axes) ---- */
function initCursor() {
  if (matchMedia('(hover: none)').matches) return;
  const pc = document.getElementById('pageCursor');
  const hero = document.querySelector<HTMLElement>('.v6 .hero');
  const vis = document.getElementById('heroVisual');
  const grove = document.querySelector<HTMLElement>('.v6 .hero-grove');
  const fig = document.querySelector<HTMLElement>('.v6 .hero-figure');
  let mx = 0, my = 0, raf = 0;
  let heroRect: DOMRect | null = null;
  const frame = () => {
    raf = 0;
    if (vis && hero) {
      if (!heroRect) heroRect = hero.getBoundingClientRect();
      if (mx >= heroRect.left && mx <= heroRect.right && my >= heroRect.top && my <= heroRect.bottom) {
        const nx = (mx - heroRect.left) / heroRect.width - 0.5;
        const ny = (my - heroRect.top) / heroRect.height - 0.5;
        if (fig) fig.style.transform = `translate(${(nx * 14).toFixed(1)}px,${(ny * 10).toFixed(1)}px)`;
        if (grove) grove.style.transform = `translate(calc(-50% - ${(nx * 10).toFixed(1)}px), calc(-52% - ${(ny * 8).toFixed(1)}px))`;
      } else {
        if (fig) fig.style.transform = '';
        if (grove) grove.style.transform = 'translate(-50%, -52%)';
      }
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

/* ---- process film: seed -> call -> build -> five days -> your app ---- */
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
  const note = b1.querySelector<HTMLElement>('.note')!;
  const codeLines = b3.querySelectorAll<HTMLElement>('.editor .cl');
  const shipShot = b3.querySelector<HTMLElement>('.ship-shot')!;
  const outs = b5.querySelectorAll<HTMLElement>('.out');
  const stamp = b5.querySelector<HTMLElement>('.stamp')!;
  const seed = root.querySelector<HTMLElement>('#filmSeed')!;
  const plant = root.querySelector<HTMLElement>('#filmPlant')!;
  const soil = plant.querySelector<SVGElement>('.soil')!;
  const stem = plant.querySelector<SVGPathElement>('.stem')!;
  const lf1 = plant.querySelector<SVGElement>('.lf1')!;
  const lf2 = plant.querySelector<SVGElement>('.lf2')!;
  const lf3 = plant.querySelector<SVGElement>('.lf3')!;
  const bloom = plant.querySelector<SVGElement>('.bloom')!;

  const captions = [
    'Every product starts as a seed. Your "we should build that."',
    'We hop on one quick call and pick exactly what to grow.',
    'Then I plant it and get to work. Just me, heads down.',
    'First working draft in your hands in about 5 days. Not weeks.',
    'And it grows into your web app. Or your site. Live, and yours.',
  ];

  const stemLen = stem.getTotalLength();
  gsap.set(stem, { strokeDasharray: stemLen, strokeDashoffset: stemLen });
  gsap.set([lf1, lf2, lf3, bloom], { scale: 0, transformOrigin: 'center bottom' });
  gsap.set([b1, b2, b3, b5], { autoAlpha: 0 });
  gsap.set(note, { autoAlpha: 0, y: 16, rotate: -3 });
  gsap.set(caption, { autoAlpha: 0 });
  gsap.set([outs[0], outs[1], stamp], { autoAlpha: 0 });
  gsap.set(seed, { autoAlpha: 0, y: '-42vh', scale: 0.8 });

  const setCap = (i: number) => () => { caption.textContent = captions[i]; };
  const setN = (n: string) => () => { filmN.textContent = n; };
  const setDay = (d: number) => () => { filmDay.hidden = false; filmDay.textContent = 'Day ' + d; };

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: root, start: 'top top', end: '+=500%', scrub: 0.6, pin, anticipatePin: 1, invalidateOnRefresh: true },
  });
  const cap = (i: number) => {
    tl.to(caption, { autoAlpha: 0, duration: 0.12 }).add(setCap(i)).to(caption, { autoAlpha: 1, duration: 0.2 });
  };

  // BEAT 1 — the seed
  tl.add(setN('01'));
  tl.to(b1, { autoAlpha: 1, duration: 0.2 });
  tl.to(note, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'back.out(1.6)' }, '<');
  cap(0);
  // the seed drops out of the idea and lands in the meadow
  tl.to(seed, { autoAlpha: 1, duration: 0.08 });
  tl.to(seed, { y: 0, scale: 1, duration: 0.5, ease: 'bounce.out' });
  tl.to(soil, { opacity: 1, duration: 0.15 }, '-=0.1');
  tl.to({}, { duration: 0.25 });
  tl.to(b1, { autoAlpha: 0, y: -30, duration: 0.3 });

  // BEAT 2 — we talk (seed sits planted)
  tl.add(setN('02'));
  tl.fromTo(b2, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35 });
  cap(1);
  tl.to({}, { duration: 0.4 });
  tl.to(b2, { autoAlpha: 0, y: -30, duration: 0.3 });

  // BEAT 3 — I plant it: the seed sprouts while the laptop opens
  tl.add(setN('03'));
  cap(2);
  tl.to(seed, { autoAlpha: 0, scale: 0.4, duration: 0.2 });
  tl.to(stem, { strokeDashoffset: stemLen * 0.58, duration: 0.4 }, '<');
  tl.to(lf1, { scale: 1, duration: 0.3, ease: 'back.out(2)' }, '-=0.15');
  tl.to(lf2, { scale: 1, duration: 0.3, ease: 'back.out(2)' }, '-=0.1');
  tl.fromTo(b3, { autoAlpha: 0, y: 40, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4 }, '-=0.2');
  tl.to(codeLines, { width: '100%', duration: 0.34, ease: 'none', stagger: 0.11 }, '<');
  tl.to({}, { duration: 0.2 });

  // BEAT 4 — five days pass; the plant grows with each day
  tl.add(setN('04'));
  cap(3);
  tl.add(setDay(1), '<');
  tl.to(wheel, { rotation: 180, duration: 0.55, ease: 'none' });
  tl.to([night, stars], { opacity: 1, duration: 0.55, ease: 'sine.inOut' }, '<');
  tl.add(setDay(2));
  tl.to(stem, { strokeDashoffset: stemLen * 0.28, duration: 0.3 }, '<');
  tl.to(wheel, { rotation: 360, duration: 0.55, ease: 'none' });
  tl.to([night, stars], { opacity: 0, duration: 0.55, ease: 'sine.inOut' }, '<');
  tl.add(setDay(3));
  tl.to(lf3, { scale: 1, duration: 0.3, ease: 'back.out(2)' }, '<');
  tl.to(wheel, { rotation: 540, duration: 0.55, ease: 'none' });
  tl.to([night, stars], { opacity: 1, duration: 0.55, ease: 'sine.inOut' }, '<');
  tl.add(setDay(4));
  tl.to(stem, { strokeDashoffset: 0, duration: 0.3 }, '<');
  tl.to(wheel, { rotation: 720, duration: 0.55, ease: 'none' });
  tl.to([night, stars], { opacity: 0, duration: 0.55, ease: 'sine.inOut' }, '<');
  tl.add(setDay(5));
  // day 5: the draft is real — the editor resolves into the product
  tl.to(shipShot, { autoAlpha: 1, duration: 0.35 });
  tl.to({}, { duration: 0.25 });
  tl.to(b3, { autoAlpha: 0, y: -30, duration: 0.3 });
  tl.to(filmDay, { autoAlpha: 0, duration: 0.2 }, '<');

  // BEAT 5 — it blooms into your app
  tl.add(setN('05'));
  tl.to(bloom, { scale: 1, duration: 0.35, ease: 'back.out(2.4)' });
  tl.to(b5, { autoAlpha: 1, duration: 0.2 });
  tl.fromTo(outs[0], { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.4 }, '<');
  tl.fromTo(outs[1], { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.4 }, '-=0.25');
  cap(4);
  tl.fromTo(stamp, { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, rotate: -9, duration: 0.35, ease: 'back.out(2)' }, '-=0.1');
  tl.to({}, { duration: 0.4 });
}

/* ---- click the meadow, plant a sprout (a small thank-you for playing) ---- */
function initMeadowPlanting() {
  const pin = document.querySelector<HTMLElement>('#process .film-pin');
  if (!pin) return;
  let planted = 0;
  pin.addEventListener('click', (e) => {
    if (planted >= 15) return;
    const t = e.target as HTMLElement;
    if (t.closest('.beat, a, button')) return;
    const rect = pin.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < 20 || x > rect.width - 20) return;
    planted++;
    const s = document.createElement('div');
    s.className = 'mini-sprout';
    s.style.left = `${x - 13}px`;
    s.style.bottom = `${9 + Math.random() * 5}vh`;
    s.innerHTML = '<svg viewBox="0 0 26 40" fill="none"><path d="M13,38 C12,30 15,24 13,16" stroke="#2F6644" stroke-width="2.6" stroke-linecap="round"/><path d="M13,26 C7,24 4,19 5,14 C10,16 13,20 13,26 Z" fill="#2F8F58"/><path d="M13,21 C19,19 22,14 21,9 C16,11 13,15 13,21 Z" fill="#1F9D55"/></svg>';
    pin.appendChild(s);
    gsap.from(s, { scaleY: 0, duration: 0.55, ease: 'back.out(2.2)' });
  });
}

/* ---- scroll-growth vine: the page grows as you read it ---- */
function initVine() {
  const vine = document.getElementById('vineProgress');
  if (!vine) return;
  const stemEl = vine.querySelector<HTMLElement>('.vine-stem')!;
  const tip = vine.querySelector<HTMLElement>('.vine-tip')!;
  ScrollTrigger.create({
    trigger: document.querySelector('.v6'),
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      stemEl.style.transform = `scaleY(${self.progress})`;
      tip.style.top = `${self.progress * 100}%`;
    },
  });
}

/* ---- capability cards: spotlight follows the cursor ---- */
function initCapsSpotlight() {
  const grid = document.querySelector<HTMLElement>('.v6 .caps-grid');
  if (!grid || matchMedia('(hover: none)').matches) return;
  grid.addEventListener('pointermove', (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('.cap-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    card.style.setProperty('--my', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  }, { passive: true });
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

/* ---- "what do you want to build": sprout grows as they type; submit -> WhatsApp ---- */
function initBuildCTA() {
  const form = document.querySelector<HTMLFormElement>('#buildForm');
  if (!form) return;
  const input = form.querySelector<HTMLInputElement>('#buildInput')!;
  const sprout = document.getElementById('inputSprout');
  const grow = () => {
    if (!sprout) return;
    const t = Math.min(1, input.value.length / 24);
    sprout.style.transform = `scale(${(0.45 + t * 0.55).toFixed(2)})`;
    sprout.style.opacity = `${0.65 + t * 0.35}`;
  };
  input.addEventListener('input', grow);
  form.querySelectorAll<HTMLButtonElement>('.chip[data-fill]').forEach((c) =>
    c.addEventListener('click', () => { input.value = c.dataset.fill!; input.focus(); grow(); }),
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
  initCapsSpotlight();
  // gsap.matchMedia builds the pinned scenes only for desktop + motion, and
  // auto-reverts every animation/ScrollTrigger it created when the query stops
  // matching (e.g. resizing below 768px), so no orphaned pin-spacer gap is left.
  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    initProcessFilm();
    initMuseum();
    initMeadowPlanting();
    initVine();
  });
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
