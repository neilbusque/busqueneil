# busqueneil.com v6 Immersive Homepage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `/` with an immersive GSAP scroll film that tells the "rough idea → shipped custom website / web app" story.

**Architecture:** Rebuild `src/pages/index.astro` as a `.v6`-scoped long-scroll page reusing `Base.astro` (dark). All new styling in `src/styles/home-v6.css`; all animation in a single bundled module `src/scripts/home-v6.ts` using GSAP + ScrollTrigger. Markup is authored mobile-first and readable with zero JS; GSAP scenes are progressive enhancement gated to `>=768px` and disabled under `prefers-reduced-motion`.

**Tech Stack:** Astro 5 SSR, GSAP 3 + ScrollTrigger (new dep), plain CSS, TypeScript module script, native `<dialog>` + `<details>`.

## Global Constraints

- Copy voice: CopyOS — first person, confident, **no em dashes**, no "Claude/Anthropic" name-drops in body copy. Read `knowledge/copyos/CLAUDE.md` + `00-OVERVIEW.md` + `quick-reference.md` before writing NEW copy.
- Scope under `.v6` root class only. Do NOT touch interior pages, `home.css`, backend, or API routes.
- Reuse real assets: `public/assets/testimonials/testimonial1-8.png`, `public/assets/work/{orbit,otto,hop,play-together,tandem}.webp`, `public/assets/art/{neilpic.png,neil-hero.mp4,neil-hero.webp,terrain.png}`.
- Design tokens (redeclare in `.v6`, same values as `.home-v4`): `--ink #000`, `--panel #101013`, `--card #131316`, `--line rgba(255,255,255,.10)`, `--line-2 rgba(255,255,255,.18)`, `--text #F4F4F6`, `--muted #9A9AA3`, `--dim #5C5C64`, `--v1 #7C5CFF`, `--v2 #C44BFF`, `--glow rgba(124,92,255,.35)`; fonts `--display/--sans 'Inter'`, `--mono 'JetBrains Mono'`; `--shell 1280px`, `--gutter clamp(20px,5vw,56px)`.
- WhatsApp number `9083164140`; email `busqueneil@gmail.com`.
- Reduced-motion + `<768px`: no pinned/horizontal GSAP; content renders static and fully readable.
- Verification per task = `npm run build` passes + puppeteer **viewport** screenshots at scroll stops (never full-page — full-page shots blank out mid-page on this site). Bump `package.json` to `6.0.0` in the final task.
- Deploy: GitHub-first → Vercel prod. No Netlify. (Deploy is out of plan scope; stop at "build passes + QA screenshots".)

---

## Task 1: Scaffold — deps, page shell, stylesheet, script skeleton

**Files:**
- Modify: `package.json` (add `gsap` dependency)
- Rewrite: `src/pages/index.astro`
- Create: `src/styles/home-v6.css`
- Create: `src/scripts/home-v6.ts`

**Interfaces:**
- Produces: `.v6` root scope; a `home-v6.ts` module auto-run on import that exposes no exports but runs `initReveals()` + guards for later scene inits (`initProcessFilm`, `initMuseum`) added in later tasks.

- [ ] **Step 1: Install GSAP**

```bash
cd "/Users/neilbusque/Documents/Work/Claude/NeilOS/context/deliverables/neil/brand-site"
npm i gsap@3
```
Expected: `gsap` appears in `package.json` dependencies.

- [ ] **Step 2: Create `src/styles/home-v6.css` with tokens + primitives**

Redeclare the token block under `.v6` (values from Global Constraints), plus reuse-equivalents of `.shell`, `.label`, `.btn`/`.btn.primary`, `.reveal` visibility, film grain, `::selection`, `:focus-visible`. Author the same primitives the current `home.css` defines but scoped to `.v6` (copy the rules, swap the `.home-v4` selector prefix for `.v6`). Add a base section rhythm:

```css
.v6 { position: relative; background: var(--ink); color: var(--text); font-family: var(--sans); overflow-x: clip; -webkit-font-smoothing: antialiased; }
.v6 .section { padding: clamp(80px,12vh,160px) 0; }
.v6 .shell { max-width: var(--shell); margin: 0 auto; padding: 0 var(--gutter); }
/* reveal (JS + reduced-motion friendly) */
.v6 .reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
.v6 .reveal.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .v6 .reveal { opacity: 1; transform: none; transition: none; } }
```

- [ ] **Step 3: Create `src/scripts/home-v6.ts` skeleton**

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = () => matchMedia('(min-width: 768px)').matches;

function initReveals() {
  if (reduce || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.v6 .reveal').forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  document.querySelectorAll('.v6 .reveal').forEach((el) => io.observe(el));
}

function boot() {
  initReveals();
  // Scenes added in later tasks:
  // if (!reduce && desktop()) { initProcessFilm(); initMuseum(); }
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
```

- [ ] **Step 4: Rewrite `src/pages/index.astro` — shell + hero + empty anchors**

Frontmatter: keep `import Base`, `import Schema`, `import { setPublicCache }`, add `import '../styles/home-v6.css'`, keep the `featured`/`more`/`testimonials`/`faqs`/`caps` data arrays from the current file (carry verbatim). Body: `<Base ... dark>` with the `<Fragment slot="head">` preload + `<Schema />` reused. Root `<div class="v6">` containing: nav (carry from current, class names reused), `<section class="hero">` (carry current hero markup: headline, WhatsApp CTA, `#heroVisual` video), then EMPTY placeholder `<section>` anchors: `#process`, `#museum`, `#testimonials`, `#capabilities`, `#build`, `#faq`, `#contact`, and footer (carry current footer). At end of body add:

```astro
<script>
  import '../scripts/home-v6.ts';
</script>
```
(Use a processed `<script>` — NOT `is:inline` — so Astro bundles the gsap import.)

- [ ] **Step 5: Build**

```bash
npm run build
```
Expected: build succeeds, no unresolved `gsap` import.

- [ ] **Step 6: Screenshot QA (dev)**

```bash
npm run dev &  # then puppeteer viewport screenshot of http://localhost:4321/ at scroll 0
```
Expected: hero renders dark with headline + video + nav; reveals fade in on scroll; no console errors.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/pages/index.astro src/styles/home-v6.css src/scripts/home-v6.ts
git commit -m "feat(v6): scaffold immersive homepage shell + gsap"
```

---

## Task 2: Process Film — markup + static/mobile CSS

**Files:**
- Modify: `src/pages/index.astro` (fill `#process`)
- Modify: `src/styles/home-v6.css`

**Interfaces:**
- Produces: DOM the GSAP scene in Task 3 targets — a `.film` pin wrap containing `.film-stage` with 5 beat nodes `[data-beat="1..5"]`, an SVG scribble `#filmScribble` (with a `<path>` to draw), a `.film-sky` layer, a `.film-caption` node, and `.film-progress` day counter.

- [ ] **Step 1: Author beat copy (CopyOS voice, no em dashes)**

Beats: (1) "It starts as a scribble. 'We should build that.'" (2) "We hop on a quick call and nail down what it actually is." (3) "I build it. Just me, in Claude Code." (4) "Days pass. Sun up, sun down, sun up." (5) "You get it back. A site and an app you own, live."

- [ ] **Step 2: Add `#process` markup**

```astro
<section class="section film" id="process" data-film>
  <div class="film-pin">
    <div class="film-sky" aria-hidden="true"><span class="sun"></span><span class="moon"></span></div>
    <div class="film-stage">
      <svg class="film-scribble" id="filmScribble" viewBox="0 0 400 200" aria-hidden="true">
        <path d="M20,140 C60,60 120,60 150,120 S240,180 280,90 340,40 380,110" fill="none" stroke="var(--v1)" stroke-width="4" stroke-linecap="round"/>
      </svg>
      <div class="beat" data-beat="1"><span class="tag">the idea</span></div>
      <div class="beat" data-beat="2"><div class="callframe"><span class="tile you">You</span><span class="tile me">Neil</span></div></div>
      <div class="beat" data-beat="3"><div class="laptop"><div class="screen code"><span></span><span></span><span></span><span></span></div></div></div>
      <div class="beat" data-beat="4"><div class="daycount"><b class="day">Day 1</b></div></div>
      <div class="beat" data-beat="5"><div class="outputs"><div class="out site3d">3D website</div><div class="out webapp">Web app</div><span class="stamp">Shipped</span></div></div>
    </div>
    <p class="film-caption" id="filmCaption"></p>
  </div>
  <div class="film-fallback">
    <!-- static stacked beats for mobile + reduced-motion: 5 <figure> with the caption text -->
  </div>
</section>
```

- [ ] **Step 3: CSS — mobile/static first**

Default (mobile + no-JS): `.film-pin` is `display:none`; `.film-fallback` shows the 5 beats stacked as a vertical timeline (reveal-on-scroll). At `@media (min-width:768px)`: `.film-fallback { display:none }`, `.film-pin { display:block; height:100vh; position:relative; overflow:hidden }`, beats absolutely centered and initially hidden (`opacity:0`), `.film-sky` a full-bleed gradient (`--sky-day` / `--sky-night` custom props), sun/moon absolutely positioned, `.laptop`/`.callframe`/`.outputs` styled with the isometric tilt (`transform: rotateX(...) ` via CSS), `.film-caption` fixed bottom-center. Include `will-change: transform, opacity` only on animated nodes.

- [ ] **Step 4: Build + screenshot QA**

```bash
npm run build
```
Screenshot at desktop 1280px (beats visible but un-animated is fine here) and mobile 390px (fallback timeline readable). Expected: both readable, build passes.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/styles/home-v6.css
git commit -m "feat(v6): process film markup + static/mobile layout"
```

---

## Task 3: Process Film — GSAP pinned scrub scene

**Files:**
- Modify: `src/scripts/home-v6.ts`

**Interfaces:**
- Consumes: `#process[data-film]`, `.film-pin`, beats `[data-beat]`, `#filmScribble path`, `.film-sky`, `#filmCaption`, `.day`.
- Produces: `initProcessFilm()` called from `boot()` when `!reduce && desktop()`.

- [ ] **Step 1: Implement `initProcessFilm()`**

```ts
function initProcessFilm() {
  const root = document.querySelector<HTMLElement>('#process[data-film]');
  if (!root) return;
  const pin = root.querySelector<HTMLElement>('.film-pin')!;
  const beats = gsap.utils.toArray<HTMLElement>('#process .beat');
  const caption = root.querySelector<HTMLElement>('#filmCaption')!;
  const sky = root.querySelector<HTMLElement>('.film-sky')!;
  const dayLabel = root.querySelector<HTMLElement>('#process .day')!;
  const path = root.querySelector<SVGPathElement>('#filmScribble path')!;
  const captions = [
    'It starts as a scribble. We should build that.',
    'We hop on a quick call and nail down what it actually is.',
    'I build it. Just me, in Claude Code.',
    'Days pass. Sun up, sun down, sun up.',
    'You get it back. A site and an app you own, live.',
  ];
  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  gsap.set(beats, { autoAlpha: 0, y: 30 });
  gsap.set(caption, { autoAlpha: 0 });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: root, start: 'top top', end: '+=450%', scrub: 0.6, pin, anticipatePin: 1 },
  });
  const showBeat = (i: number) => {
    tl.to(caption, { autoAlpha: 0, duration: 0.15 }, '<')
      .set(caption, { onComplete: () => { caption.textContent = captions[i]; } })
      .to(beats[i], { autoAlpha: 1, y: 0, duration: 0.5 })
      .to(caption, { autoAlpha: 1, duration: 0.3 }, '<');
  };
  // Beat 1: draw scribble then reveal tag
  tl.to(path, { strokeDashoffset: 0, duration: 1 });
  showBeat(0);
  tl.to(beats[0], { autoAlpha: 0, y: -30, duration: 0.4 });
  // Beat 2: call
  showBeat(1);
  tl.to(beats[1], { autoAlpha: 0, y: -30, duration: 0.4 });
  // Beat 3: build
  showBeat(2);
  // Beat 4: day/night cycle (3 days) with the laptop still up
  showBeat(3);
  const days = ['Day 1', 'Day 2', 'Day 3'];
  [0, 1, 2].forEach((d) => {
    tl.to(sky, { '--sky-t': d % 2 === 0 ? 1 : 0, duration: 0.6 } as any)
      .set(dayLabel, { onComplete: () => { dayLabel.textContent = days[Math.min(d, 2)]; } }, '<');
  });
  tl.to([beats[2], beats[3]], { autoAlpha: 0, y: -30, duration: 0.4 });
  // Beat 5: outputs
  showBeat(4);
}
```

Note: `.film-sky` background is `linear-gradient` mixing day/night via a `--sky-t` custom prop the CSS reads (register with `CSS.registerProperty` in CSS, or interpolate two stacked layers' opacity instead if `@property` unsupported — use the two-layer opacity approach for Safari safety: give `.film-sky` a `.day` and `.night` child and tween their opacity instead of a custom prop). Prefer the two-layer opacity approach.

- [ ] **Step 2: Wire into `boot()`**

```ts
function boot() {
  initReveals();
  if (!reduce && desktop()) { initProcessFilm(); }
}
```

- [ ] **Step 3: Build + scrub QA**

```bash
npm run build
```
Dev-server: scroll slowly through `#process`, capture viewport screenshots at ~5 scroll offsets covering the pin range. Expected: section pins, scribble draws, beats swap, sky cycles day→night→day, "Day 1/2/3" tick, outputs + "Shipped" land, then unpins into next section. No jank/overlap with `#museum`.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/home-v6.ts src/styles/home-v6.css
git commit -m "feat(v6): process film pinned scrub scene"
```

---

## Task 4: Museum — markup, CSS, lightbox

**Files:**
- Modify: `src/pages/index.astro` (fill `#museum`)
- Modify: `src/styles/home-v6.css`
- Modify: `src/scripts/home-v6.ts` (lightbox JS)

**Interfaces:**
- Produces: `.museum-track` (the horizontal-scrolled element Task 5 translates) with `.piece` cards carrying `data-full`, `data-title`, `data-url`; a `<dialog id="museumLightbox">`; `initLightbox()` bound on load (works regardless of GSAP).

- [ ] **Step 1: Museum data + markup**

Pieces array (in frontmatter): 5 real + 2 placeholder:
```ts
const museum = [
  { name: 'Orbit', shot: '/assets/work/orbit.webp', url: 'https://www.inorbit.one', tag: 'AI CRM' },
  { name: 'Tandem', shot: '/assets/work/tandem.webp', url: 'https://tandem.yengandneil.site', tag: 'PWA for two' },
  { name: 'Otto', shot: '/assets/work/otto.webp', url: null, tag: 'Command center' },
  { name: 'Hop', shot: '/assets/work/hop.webp', url: 'https://links.busqueneil.com', tag: 'Link shortener' },
  { name: 'Play Together', shot: '/assets/work/play-together.webp', url: null, tag: 'Realtime games' },
  { name: 'Your app', shot: null, url: null, tag: 'Coming soon' },
  { name: 'Your site', shot: null, url: null, tag: 'Coming soon' },
];
```
Markup: `<section class="section museum" id="museum" data-museum>` → intro `.sec-head` (reveal) → `<div class="museum-viewport"><div class="museum-track">` mapping pieces to `.piece` (real ones: a `.pedestal` + `.laptop-frame` with `<img loading="lazy">` on the screen + spotlight; placeholders: `.piece.ghost` with a dashed frame + "Coming soon"). Real pieces get `data-full`/`data-title`/`data-url` + a `<button class="piece-open">View</button>`. After the track, add:
```astro
<dialog class="museum-lightbox" id="museumLightbox">
  <button class="lb-close" aria-label="Close">×</button>
  <img id="lbImg" alt="" />
  <div class="lb-meta"><h3 id="lbTitle"></h3><a id="lbLink" target="_blank" rel="noopener" hidden>Visit live →</a></div>
</dialog>
```

- [ ] **Step 2: CSS**

Mobile/no-JS: `.museum-track` is a normal responsive grid/stack. At `>=768px`: `.museum-viewport { overflow:hidden }`, `.museum-track { display:flex; gap:clamp(40px,6vw,90px); width:max-content }`, `.laptop-frame` museum lighting (radial spotlight behind, pedestal base, subtle 3D tilt on hover), `.piece.ghost` dashed. Style `<dialog>` + `::backdrop` (dim + blur).

- [ ] **Step 3: `initLightbox()` (framework-free)**

```ts
function initLightbox() {
  const dlg = document.querySelector<HTMLDialogElement>('#museumLightbox');
  if (!dlg) return;
  const img = dlg.querySelector<HTMLImageElement>('#lbImg')!;
  const title = dlg.querySelector<HTMLElement>('#lbTitle')!;
  const link = dlg.querySelector<HTMLAnchorElement>('#lbLink')!;
  document.querySelectorAll<HTMLElement>('#museum .piece[data-full]').forEach((p) => {
    p.querySelector('.piece-open')?.addEventListener('click', () => {
      img.src = p.dataset.full!; img.alt = p.dataset.title || '';
      title.textContent = p.dataset.title || '';
      const u = p.dataset.url;
      if (u) { link.href = u; link.hidden = false; } else { link.hidden = true; }
      dlg.showModal();
    });
  });
  dlg.querySelector('.lb-close')?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
}
```
Call `initLightbox()` inside `boot()` unconditionally (before the desktop/reduce gate).

- [ ] **Step 4: Build + QA**

```bash
npm run build
```
Screenshot: desktop museum row + open lightbox (click View); mobile stack. Expected: images load, lightbox opens/closes (Esc + backdrop + ×), live link present only for real URLs.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/styles/home-v6.css src/scripts/home-v6.ts
git commit -m "feat(v6): museum gallery + lightbox"
```

---

## Task 5: Museum — GSAP pinned horizontal scroll

**Files:**
- Modify: `src/scripts/home-v6.ts`

**Interfaces:**
- Consumes: `#museum[data-museum]`, `.museum-track`.
- Produces: `initMuseum()` called from `boot()` when `!reduce && desktop()`.

- [ ] **Step 1: Implement `initMuseum()`**

```ts
function initMuseum() {
  const root = document.querySelector<HTMLElement>('#museum[data-museum]');
  if (!root) return;
  const track = root.querySelector<HTMLElement>('.museum-track')!;
  const distance = () => track.scrollWidth - window.innerWidth * 0.9;
  gsap.to(track, {
    x: () => -Math.max(0, distance()),
    ease: 'none',
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: () => '+=' + Math.max(1, distance()),
      scrub: 0.6,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}
```

- [ ] **Step 2: Wire into `boot()`**

```ts
if (!reduce && desktop()) { initProcessFilm(); initMuseum(); }
```

- [ ] **Step 3: Build + QA**

```bash
npm run build
```
Dev-server: scroll through `#museum`, capture viewport at 4 offsets. Expected: section pins, laptops travel left→right, last piece rests near right edge before unpin, no horizontal body overflow, transition from `#process` clean. Re-check reduced-motion (add `?` — set OS reduce-motion) shows static grid.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/home-v6.ts
git commit -m "feat(v6): museum pinned horizontal scroll"
```

---

## Task 6: Testimonials + Capabilities + "What do you want to build?"

**Files:**
- Modify: `src/pages/index.astro` (fill `#testimonials`, `#capabilities`, `#build`)
- Modify: `src/styles/home-v6.css`
- Modify: `src/scripts/home-v6.ts` (WhatsApp prefill handler)

**Interfaces:**
- Produces: `#buildForm` (input `#buildInput` + chips) whose submit opens WhatsApp with prefilled text; `initBuildCTA()` bound in `boot()` unconditionally.

- [ ] **Step 1: Testimonials markup** — carry the current `testimonials` array; render as spotlight `.testi-card` figures (staggered, `.reveal`) in a masonry-ish grid, `loading="lazy"` + width/height preserved.

- [ ] **Step 2: Capabilities markup** — carry `caps` array; section headline "From a landing page to custom software you own." + cards grid (`.reveal`).

- [ ] **Step 3: Build-CTA markup**

```astro
<section class="section build" id="build">
  <div class="shell">
    <p class="label reveal"><span class="n">✳</span> &nbsp;Your turn</p>
    <h2 class="statement reveal">So what do you want to build?</h2>
    <form class="build-form reveal" id="buildForm">
      <input id="buildInput" name="idea" type="text" autocomplete="off"
        placeholder="A booking app, a funnel, an AI assistant..." />
      <button class="btn primary" type="submit">Send it to me <span class="ico">→</span></button>
      <div class="chips">
        <button type="button" class="chip" data-fill="I want to build a web app">Web app</button>
        <button type="button" class="chip" data-fill="I want to build a custom website">Website</button>
        <button type="button" class="chip" data-fill="I need an automation">Automation</button>
        <button type="button" class="chip" data-fill="I have an idea but not sure yet">Not sure yet</button>
      </div>
    </form>
  </div>
</section>
```

- [ ] **Step 4: `initBuildCTA()` — WhatsApp prefill (no em dashes in message)**

```ts
function initBuildCTA() {
  const form = document.querySelector<HTMLFormElement>('#buildForm');
  if (!form) return;
  const input = form.querySelector<HTMLInputElement>('#buildInput')!;
  form.querySelectorAll<HTMLButtonElement>('.chip[data-fill]').forEach((c) =>
    c.addEventListener('click', () => { input.value = c.dataset.fill!; input.focus(); }));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const idea = input.value.trim() || 'I have something I want to build';
    const msg = encodeURIComponent('Hey Neil, ' + idea + '. Can we talk?');
    window.open('https://api.whatsapp.com/send/?phone=9083164140&text=' + msg, '_blank', 'noopener');
  });
}
```
Call `initBuildCTA()` in `boot()` unconditionally.

- [ ] **Step 5: CSS** for testimonials grid, caps grid, build form (input styled like the opening scribble motif: hand-drawn underline / accent border), chips.

- [ ] **Step 6: Build + QA**

```bash
npm run build
```
Screenshot the three sections desktop + mobile; click a chip then submit and confirm a WhatsApp URL opens with the idea prefilled. Expected: all readable, prefill works.

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro src/styles/home-v6.css src/scripts/home-v6.ts
git commit -m "feat(v6): testimonials, capabilities, build-CTA with whatsapp prefill"
```

---

## Task 7: FAQ + Contact + Footer + final polish, QA, version bump

**Files:**
- Modify: `src/pages/index.astro` (fill `#faq`, `#contact`, footer)
- Modify: `src/styles/home-v6.css`
- Modify: `package.json` (version → 6.0.0)

- [ ] **Step 1: FAQ** — carry the 6 current `faqs` items verbatim, add one guarantee-forward item: `{ q: 'What if I do not like it?', a: 'We agree on what "done" looks like before I start, you see progress along the way, and I keep working until it matches. You own the code either way, so you are never locked in.' }`. Render as `<details class="faq-item">` accordion (reveal).

- [ ] **Step 2: Contact + footer** — carry the current `#contact` hire-band (terrain art, roles chips, alt-contact links, WhatsApp lead card) and `.v4-footer` markup verbatim, reclassed under `.v6` where needed.

- [ ] **Step 3: CSS** for FAQ accordion + ensure contact/footer styles exist under `.v6` (copy from `home.css` equivalents, reprefixed).

- [ ] **Step 4: Full reduced-motion + mobile audit**

Set OS `prefers-reduced-motion: reduce`, load `/`: confirm NO pin/jump, every section static and readable, museum = grid, film = fallback timeline. Then mobile 390px full scroll: no horizontal overflow, all sections readable, CTAs tappable.

- [ ] **Step 5: LCP guard** — confirm hero video/poster still preloaded (`fetchpriority=high`) and GSAP script does not block first paint (bundled `<script>` is deferred by Astro). Screenshot hero at cold load.

- [ ] **Step 6: Bump version + build**

```bash
npm version 6.0.0 --no-git-tag-version
npm run build
```
Expected: `package.json` = `6.0.0`, build passes.

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro src/styles/home-v6.css package.json
git commit -m "feat(v6): faq + contact + footer, reduced-motion/mobile polish, v6.0.0"
```

---

## Self-review notes

- Spec coverage: hero(T1) · process film(T2-3) · museum+lightbox(T4-5) · testimonials/caps/build-CTA(T6) · faq/contact/footer(T7) · reduced-motion+mobile(T3,T5,T7) · reuse wiring(T1) · WhatsApp-first(T6-7). All spec sections mapped.
- Sky animation: use two-layer opacity crossfade (Safari-safe), not `@property` — noted in T3.
- Lightbox + build-CTA init run unconditionally (not gated on desktop/motion) so they work everywhere.
- Verification is build + puppeteer viewport screenshots (this repo's homepage cannot be full-page screenshotted — known artifact), not vitest, because deliverables are visual scenes.
