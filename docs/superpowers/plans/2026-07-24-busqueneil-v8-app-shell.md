# busqueneil.com v8 "App Shell" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild busqueneil.com as an app-shell site (rail + tab bar, 5 views) on the new Ribbon N yellow brand, with a cinematic first-load opening.

**Architecture:** One new `AppShell.astro` layout (rail/tab-bar/status-strip + Astro view transitions) wraps five server-rendered views (Home, Story, Work, Blog, Hire) plus existing detail pages. Old URLs 301. Blog is a re-skin over the existing Supabase `posts` data via `getFeed`. All new styles live in `src/styles/v8.css`; funnels/admin/guides are untouched.

**Tech Stack:** Astro 5 SSR (Vercel adapter), Supabase (existing), vanilla CSS + WAAPI (NO GSAP), vitest for pure helpers.

**Spec:** `docs/superpowers/specs/2026-07-24-busqueneil-v8-app-shell-design.md` — read it first.

## Global Constraints

- Repo: `NeilOS/context/deliverables/neil/brand-site/`, deploy = merge to `main` (Vercel git-connected). GitHub-first, personal account.
- Brand tokens (exact): paper `#FAF8F2`, charcoal ink `#201E18`, sun yellow `#FFC61A`, sun-hi `#FFD84D`, fold amber `#E3A50E`, deep amber `#E89B2D`, gold (periods) `#DFA100`, hairline `#E8E2D2`, muted text `#6B675C`.
- Yellow is fills/highlights/buttons-with-dark-text ONLY. Never yellow text on ivory.
- NO em dashes in any user-facing copy (title-tag separators excepted). Verify with grep before ship.
- Light theme only. No GSAP. `prefers-reduced-motion` must get a working, motion-free experience.
- Do NOT touch: `public/build*`, `public/help*`, `public/ria*`, `public/support*`, `/analyzer`, `src/pages/admin/*`, `src/pages/api/*`, `src/pages/guides/*`, `src/lib/analyzer/*`, Supabase backend, `/api/form-lead` contract.
- Brand asset source of truth: `~/Documents/Work/Claude/NeilOS/context/deliverables/neil/logo-ribbon-n/`.
- Every commit message ends with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Verify build with `npm run build`; unit tests with `npm test` (vitest).

---

### Task 1: Brand assets + v8 token stylesheet + head plumbing

**Files:**
- Create: `public/assets/brand/` (copied PNGs/SVGs), `src/styles/v8.css`
- Modify: `src/layouts/Base.astro` (favicon links, `v8` font prop), `vercel.json` (favicon rewrite)

**Interfaces:**
- Produces: CSS classes `.v8` (root), `.v8-card`, `.btn-sun`, `.btn-ghost`, `.mark-hl`, `.chip`, `.eyebrow`, CSS vars `--paper --ink --sun --sun-hi --fold --amber --gold --hair --muted`; Base prop `v8?: boolean`.

- [ ] **Step 1: Copy brand assets**

```bash
SRC="$HOME/Documents/Work/Claude/NeilOS/context/deliverables/neil/logo-ribbon-n"
mkdir -p public/assets/brand
cp "$SRC"/svg/mark.svg "$SRC"/svg/mark-small.svg "$SRC"/svg/mark-ivory.svg public/assets/brand/
cp "$SRC"/icon/favicon-16.png "$SRC"/icon/favicon-32.png "$SRC"/icon/apple-touch-icon-180.png "$SRC"/icon/icon-512.png public/assets/brand/
cp "$SRC"/og/og-default.png public/assets/brand/og-default.png
```

- [ ] **Step 2: Create `src/styles/v8.css`**

```css
/* v8 "App Shell" — Ribbon N yellow system. Scoped under .v8 so funnels/admin/guides are untouched. */
.v8 {
  --paper: #FAF8F2; --surface: #FFFFFF; --ink: #201E18; --muted: #6B675C;
  --sun: #FFC61A; --sun-hi: #FFD84D; --fold: #E3A50E; --amber: #E89B2D; --gold: #DFA100;
  --hair: #E8E2D2; --grid: rgba(32, 30, 24, .045);
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--ink);
  background-color: var(--paper);
  background-image: linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 32px 32px;
  -webkit-font-smoothing: antialiased;
}
.v8 h1, .v8 h2, .v8 h3 { font-family: 'Fraunces', Georgia, serif; font-weight: 600; letter-spacing: -0.01em; text-wrap: balance; }
.v8 .eyebrow { font-size: 12px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.v8 .mark-hl { background: linear-gradient(100deg, var(--sun-hi), var(--sun)); padding: 0 .18em; border-radius: .12em; box-decoration-break: clone; -webkit-box-decoration-break: clone; color: #201E18; }
.v8 .v8-card { background: var(--surface); border: 1px solid var(--hair); border-radius: 18px; box-shadow: 0 1px 2px rgba(32,30,24,.04), 0 12px 32px -18px rgba(32,30,24,.12); }
.v8 .btn-sun { display: inline-block; font-weight: 650; font-size: 15px; color: #201E18; background: linear-gradient(100deg, var(--sun-hi), var(--sun)); padding: 12px 24px; border-radius: 999px; border: 0; cursor: pointer; text-decoration: none; box-shadow: 0 6px 16px -8px rgba(223,161,0,.6); transition: transform .15s ease, box-shadow .15s ease; }
.v8 .btn-sun:hover { transform: translateY(-1px); box-shadow: 0 10px 22px -8px rgba(223,161,0,.7); }
.v8 .btn-ghost { display: inline-block; font-weight: 650; font-size: 15px; color: var(--ink); background: transparent; border: 1px solid var(--hair); padding: 12px 24px; border-radius: 999px; text-decoration: none; }
.v8 .chip { font-size: 12px; font-weight: 600; letter-spacing: .06em; padding: 5px 12px; border-radius: 999px; border: 1px solid var(--hair); color: var(--muted); background: var(--surface); }
@media (prefers-reduced-motion: reduce) {
  .v8 * { animation: none !important; transition: none !important; }
}
```

(Shell layout classes are added in Task 3, page classes in their page tasks — same file.)

- [ ] **Step 3: Base.astro head changes**

In `src/layouts/Base.astro`:
1. Add `v8?: boolean` to Props (default false).
2. Font link: when `v8` is true use
   `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600;700;800&family=Caveat:wght@600&display=swap`
   (keep the existing `dark`/interior branches for non-v8 pages).
3. theme-color: `v8 ? '#FAF8F2' : (dark ? '#08080C' : '#FFFFFF')`.
4. Replace ALL existing `rel="icon"` / `rel="apple-touch-icon"` links (grep the file for `favicon`/`apple-touch`) with:

```html
<link rel="icon" type="image/svg+xml" href="/assets/brand/mark-small.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/favicon-32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/assets/brand/favicon-16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/assets/brand/apple-touch-icon-180.png" />
```

5. Default `ogImage` fallback: `https://busqueneil.com/assets/brand/og-default.png` (replace the `/og.png` default).
6. In `vercel.json` change the `/favicon.ico` rewrite destination to `/assets/brand/favicon-32.png`.

- [ ] **Step 4: Build check** — Run `npm run build`. Expected: exit 0.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(v8): Ribbon N brand assets, v8 token stylesheet, head plumbing"`

---

### Task 2: RibbonMark component

**Files:**
- Create: `src/components/RibbonMark.astro`

**Interfaces:**
- Produces: `<RibbonMark size={32} variant="full" />` — Props `{ size?: number; variant?: 'full' | 'small' | 'ivory' }`. Inner SVG parts carry classes `.rm-stem-l .rm-stem-r .rm-ribbon .rm-fold-t .rm-fold-b` (the intro animates these). `small` = no folds (use at ≤32px).

- [ ] **Step 1: Write the component**

```astro
---
interface Props { size?: number; variant?: 'full' | 'small' | 'ivory'; }
const { size = 32, variant = 'full' } = Astro.props;
const stem = variant === 'ivory' ? '#FAF8F2' : '#201E18';
const showFolds = variant !== 'small';
---
<svg class="ribbon-mark" width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
  <polygon class="rm-stem-l" points="16,16 40,16 40,104 16,104" fill={stem} />
  <polygon class="rm-stem-r" points="80,16 104,16 104,104 80,104" fill={stem} />
  <polygon class="rm-ribbon" points="16,16 40,16 104,104 80,104" fill="#FFC61A" />
  {showFolds && <polygon class="rm-fold-t" points="40,16 40,49 16,16" fill="#E3A50E" />}
  {showFolds && <polygon class="rm-fold-b" points="80,104 80,71 104,104" fill="#E3A50E" />}
</svg>
```

- [ ] **Step 2: Build check** — `npm run build` (component compiles even if unused). Expected: exit 0.
- [ ] **Step 3: Commit** — `git commit -am "feat(v8): RibbonMark component"`

---

### Task 3: AppShell layout (rail, tab bar, status strip, view transitions)

**Files:**
- Create: `src/layouts/AppShell.astro`
- Modify: `src/styles/v8.css` (append shell styles)

**Interfaces:**
- Consumes: `RibbonMark`, Base `v8` prop, v8.css tokens.
- Produces: layout used as `<AppShell title description active canonical? ogImage? noindex?>` with `active: 'home' | 'story' | 'work' | 'blog' | 'hire'`. Slot `intro` (Home injects the cinematic). Every page content renders inside `<main class="shell-main">`.

- [ ] **Step 1: Write the layout**

```astro
---
import Base from './Base.astro';
import RibbonMark from '../components/RibbonMark.astro';
import { ClientRouter } from 'astro:transitions';

interface Props {
  title: string; description: string; canonical?: string; ogImage?: string; noindex?: boolean;
  active: 'home' | 'story' | 'work' | 'blog' | 'hire';
}
const { active, ...baseProps } = Astro.props;

const NAV = [
  { key: 'home',  href: '/',      label: 'Home' },
  { key: 'story', href: '/story', label: 'Story' },
  { key: 'work',  href: '/work',  label: 'Work' },
  { key: 'blog',  href: '/blog',  label: 'Blog' },
  { key: 'hire',  href: '/hire',  label: 'Hire' },
] as const;

const ICONS: Record<string, string> = {
  home: 'M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z',
  story: 'M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3zM5 4v16M17 8h2v13',
  work: 'M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2',
  blog: 'M5 5h14M5 10h14M5 15h9',
  hire: 'M21 8l-9 6-9-6M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z',
};
---
<Base {...baseProps} v8={true} noConcierge={true}>
  <slot name="head" slot="head" />
  <ClientRouter />
  <div class="v8 shell">
    <slot name="intro" />
    <div class="shell-strip">
      <span class="strip-live"><span class="strip-dot"></span>Open to work</span>
      <span class="strip-sep">·</span><span>New Jersey</span>
      <a class="strip-mail" href="mailto:busqueneil@gmail.com">busqueneil@gmail.com</a>
    </div>
    <aside class="shell-rail">
      <a class="rail-brand" href="/" aria-label="Neil Busque home">
        <RibbonMark size={34} />
        <span class="rail-name">Neil<span class="rail-dot">.</span></span>
      </a>
      <nav class="rail-nav" aria-label="Primary">
        {NAV.map((n) => (
          <a class:list={['rail-item', { active: active === n.key }]} href={n.href} aria-current={active === n.key ? 'page' : undefined}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={ICONS[n.key]} /></svg>
            <span>{n.label}</span>
          </a>
        ))}
      </nav>
      <div class="rail-foot">
        <img class="rail-avatar" src="/assets/art/neil-cutout.png" alt="Neil Busque" loading="lazy" />
        <a class="btn-sun rail-cta" href="https://wa.me/19083164140?text=Hi%20Neil%2C%20I%20want%20to%20build%20something">WhatsApp me</a>
      </div>
    </aside>
    <main class="shell-main" transition:animate="fade">
      <slot />
      <footer class="shell-foot">
        <span>© 2026 Neil Busque</span>
        <span class="shell-foot-links">
          <a href="/rss.xml">RSS</a><a href="/resume.pdf">Resume</a>
          <a href="https://www.linkedin.com/in/neilbusque/" rel="me">LinkedIn</a>
          <a href="https://github.com/neilbusque" rel="me">GitHub</a>
        </span>
      </footer>
    </main>
    <nav class="shell-tabbar" aria-label="Primary mobile">
      {NAV.map((n) => (
        <a class:list={['tab-item', { active: active === n.key }]} href={n.href} aria-current={active === n.key ? 'page' : undefined}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={ICONS[n.key]} /></svg>
          <span>{n.label}</span>
        </a>
      ))}
    </nav>
  </div>
</Base>
```

- [ ] **Step 2: Append shell styles to `src/styles/v8.css`**

```css
/* ---- shell chrome ---- */
.v8.shell { min-height: 100vh; }
.v8 .shell-strip { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; gap: 10px; font-size: 12.5px; color: var(--muted); background: color-mix(in srgb, var(--paper) 85%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--hair); padding: 7px 20px 7px 244px; }
.v8 .strip-live { display: flex; align-items: center; gap: 6px; font-weight: 600; color: var(--ink); }
.v8 .strip-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--sun); box-shadow: 0 0 0 3px rgba(255,198,26,.25); }
.v8 .strip-mail { margin-left: auto; color: inherit; text-decoration: none; }
.v8 .shell-rail { position: fixed; inset: 0 auto 0 0; width: 224px; display: flex; flex-direction: column; gap: 18px; padding: 18px 14px; background: color-mix(in srgb, var(--surface) 72%, var(--paper)); border-right: 1px solid var(--hair); z-index: 50; }
.v8 .rail-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--ink); padding: 4px 8px; }
.v8 .rail-name { font-weight: 700; font-size: 17px; letter-spacing: -0.02em; }
.v8 .rail-dot { color: var(--gold); }
.v8 .rail-nav { display: flex; flex-direction: column; gap: 4px; }
.v8 .rail-item { display: flex; align-items: center; gap: 11px; padding: 9px 12px; border-radius: 10px; text-decoration: none; color: var(--muted); font-weight: 550; font-size: 14.5px; transition: background .15s ease, color .15s ease; }
.v8 .rail-item:hover { background: rgba(32,30,24,.05); color: var(--ink); }
.v8 .rail-item.active { background: linear-gradient(100deg, var(--sun-hi), var(--sun)); color: #201E18; font-weight: 650; }
.v8 .rail-foot { margin-top: auto; display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.v8 .rail-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; object-position: top; border: 2px solid var(--surface); box-shadow: 0 2px 8px rgba(32,30,24,.18); background: var(--sun-hi); }
.v8 .rail-cta { font-size: 13.5px; padding: 10px 16px; }
.v8 .shell-main { margin-left: 224px; padding: 28px clamp(20px, 4vw, 56px) 64px; max-width: 1120px; }
.v8 .shell-foot { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-top: 72px; padding-top: 20px; border-top: 1px solid var(--hair); font-size: 13px; color: var(--muted); }
.v8 .shell-foot a { color: inherit; text-decoration: none; margin-left: 14px; }
.v8 .shell-tabbar { display: none; }
@media (max-width: 900px) {
  .v8 .shell-rail { display: none; }
  .v8 .shell-strip { padding-left: 20px; }
  .v8 .shell-main { margin-left: 0; padding-bottom: 96px; }
  .v8 .shell-tabbar { display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: color-mix(in srgb, var(--surface) 92%, transparent); backdrop-filter: blur(10px); border-top: 1px solid var(--hair); padding: 6px 4px calc(6px + env(safe-area-inset-bottom)); }
  .v8 .tab-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; font-size: 10.5px; font-weight: 600; color: var(--muted); text-decoration: none; padding: 4px 0; border-radius: 10px; }
  .v8 .tab-item.active { color: #201E18; }
  .v8 .tab-item.active svg { background: linear-gradient(100deg, var(--sun-hi), var(--sun)); border-radius: 8px; padding: 2px; box-sizing: content-box; }
}
```

- [ ] **Step 3: Build check** — `npm run build`. Expected: exit 0.
- [ ] **Step 4: Commit** — `git commit -am "feat(v8): AppShell layout with rail, tab bar, status strip, view transitions"`

---

### Task 4: Cinematic intro (Home only)

**Files:**
- Create: `src/components/IntroCinematic.astro`
- Modify: `src/styles/v8.css` (append intro styles)

**Interfaces:**
- Consumes: `RibbonMark` part classes (`.rm-stem-l` etc.).
- Produces: `<IntroCinematic />` rendered into AppShell's `intro` slot by Home only. Plays once per session (`sessionStorage['v8-intro']`), skippable (click/keydown/wheel/touchstart), reduced-motion and repeat visits get no overlay at all (removed before paint via inline script).

- [ ] **Step 1: Write the component**

```astro
---
import RibbonMark from './RibbonMark.astro';
---
<div class="intro" id="v8-intro" aria-hidden="true">
  <div class="intro-stage">
    <div class="intro-mark"><RibbonMark size={128} /></div>
    <div class="intro-word">Neil Busque<span class="intro-dot">.</span></div>
    <div class="intro-tag">From idea to product</div>
  </div>
</div>
<script is:inline>
  (() => {
    const el = document.getElementById('v8-intro');
    if (!el) return;
    const seen = sessionStorage.getItem('v8-intro');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || reduced) { el.remove(); return; }
    sessionStorage.setItem('v8-intro', '1');
    el.classList.add('play');
    const done = () => { el.classList.add('leave'); setTimeout(() => el.remove(), 450); cleanup(); };
    const cleanup = () => ['click', 'keydown', 'wheel', 'touchstart'].forEach((e) => window.removeEventListener(e, done));
    ['click', 'keydown', 'wheel', 'touchstart'].forEach((e) => window.addEventListener(e, done, { passive: true }));
    setTimeout(done, 2000);
  })();
</script>
```

- [ ] **Step 2: Append intro styles to `src/styles/v8.css`**

```css
/* ---- cinematic intro ---- */
.v8 .intro { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; background-color: var(--paper); background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px); background-size: 32px 32px; }
.v8 .intro-stage { display: flex; flex-direction: column; align-items: center; gap: 18px; }
.v8 .intro-word { font-family: 'Fraunces', Georgia, serif; font-weight: 600; font-size: clamp(28px, 5vw, 44px); opacity: 0; }
.v8 .intro-dot { color: var(--gold); }
.v8 .intro-tag { font-size: 14px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); opacity: 0; }
.v8 .intro.play .rm-stem-l { animation: introStem .4s cubic-bezier(.2,.8,.25,1) both; transform-origin: 50% 100%; }
.v8 .intro.play .rm-stem-r { animation: introStem .4s cubic-bezier(.2,.8,.25,1) .15s both; transform-origin: 50% 100%; }
.v8 .intro.play .rm-ribbon { animation: introRibbon .5s cubic-bezier(.2,.8,.25,1) .35s both; transform-origin: 20% 15%; }
.v8 .intro.play .rm-fold-t, .v8 .intro.play .rm-fold-b { animation: introFade .3s ease .75s both; }
.v8 .intro.play .intro-word { animation: introUp .45s cubic-bezier(.2,.8,.25,1) .85s both; }
.v8 .intro.play .intro-tag { animation: introUp .45s cubic-bezier(.2,.8,.25,1) 1.05s both; }
.v8 .intro.leave { animation: introLeave .45s cubic-bezier(.6,0,.8,.2) both; }
@keyframes introStem { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes introRibbon { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes introFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes introUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes introLeave { to { opacity: 0; transform: translateY(-3vh); } }
```

- [ ] **Step 3: Build check** — `npm run build`. Expected: exit 0.
- [ ] **Step 4: Commit** — `git commit -am "feat(v8): cinematic ribbon intro, once per session, skippable"`

---

### Task 5: Blog filter helper (TDD)

**Files:**
- Create: `src/lib/blogFilters.ts`, `src/lib/__tests__/blogFilters.test.ts`

**Interfaces:**
- Produces: `filterToQuery(filter: string | null): { type?: 'status' | 'article' | 'project' | 'now'; tag?: string }` and `FILTERS: { key: string; label: string }[]` (keys: `all, thoughts, tutorials, builds, now`).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { filterToQuery, FILTERS } from '../blogFilters';

describe('filterToQuery', () => {
  it('maps thoughts to status type', () => expect(filterToQuery('thoughts')).toEqual({ type: 'status' }));
  it('maps tutorials to article + tutorial tag', () => expect(filterToQuery('tutorials')).toEqual({ type: 'article', tag: 'tutorial' }));
  it('maps builds to project', () => expect(filterToQuery('builds')).toEqual({ type: 'project' }));
  it('maps now to now', () => expect(filterToQuery('now')).toEqual({ type: 'now' }));
  it('maps all/null/garbage to no constraint', () => {
    expect(filterToQuery('all')).toEqual({});
    expect(filterToQuery(null)).toEqual({});
    expect(filterToQuery('nope')).toEqual({});
  });
  it('exposes 5 filter chips', () => expect(FILTERS.map((f) => f.key)).toEqual(['all', 'thoughts', 'tutorials', 'builds', 'now']));
});
```

- [ ] **Step 2: Run test, verify FAIL** — `npm test -- blogFilters`. Expected: fails (module not found).
- [ ] **Step 3: Implement**

```ts
export const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'thoughts', label: 'Thoughts' },
  { key: 'tutorials', label: 'Tutorials' },
  { key: 'builds', label: 'Builds' },
  { key: 'now', label: 'Now' },
] as const;

export function filterToQuery(filter: string | null): { type?: 'status' | 'article' | 'project' | 'now'; tag?: string } {
  switch (filter) {
    case 'thoughts': return { type: 'status' };
    case 'tutorials': return { type: 'article', tag: 'tutorial' };
    case 'builds': return { type: 'project' };
    case 'now': return { type: 'now' };
    default: return {};
  }
}
```

- [ ] **Step 4: Run test, verify PASS** — `npm test -- blogFilters`. Expected: all green.
- [ ] **Step 5: Commit** — `git commit -am "feat(v8): blog filter mapping helper with tests"`

---

### Task 6: PostCard component + Blog view + writing redirects

**Files:**
- Create: `src/components/PostCard.astro`, `src/pages/blog.astro`
- Modify: `src/pages/feed.astro` (→301), `src/pages/posts/index.astro` (→301), `src/pages/now/index.astro` (→301), `src/pages/posts/[slug].astro` (layout swap), `src/styles/v8.css` (append)

**Interfaces:**
- Consumes: `getFeed` from `src/lib/posts.ts` (signature above in repo), `filterToQuery`/`FILTERS`, `AppShell`, `Post` type from `src/lib/types.ts` (fields used: `slug title type body_html published_at tags`).
- Produces: `<PostCard post={post} />`.

- [ ] **Step 1: PostCard component**

```astro
---
import type { Post } from '../lib/types';
interface Props { post: Post; }
const { post } = Astro.props;
const TYPE_LABEL: Record<string, string> = { status: 'Thought', article: 'Article', project: 'Build', now: 'Now' };
const date = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
---
<a class="post-card v8-card" href={`/posts/${post.slug}`}>
  <div class="post-meta"><span class="chip">{TYPE_LABEL[post.type] ?? 'Post'}</span><span>{date}</span></div>
  <h3 class="post-title">{post.title}</h3>
</a>
```

Append to v8.css:

```css
.v8 .post-card { display: flex; flex-direction: column; gap: 10px; padding: 20px; text-decoration: none; color: var(--ink); transition: transform .15s ease, box-shadow .15s ease; }
.v8 .post-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px -10px rgba(32,30,24,.25); }
.v8 .post-meta { display: flex; align-items: center; gap: 10px; font-size: 12.5px; color: var(--muted); }
.v8 .post-title { font-size: 19px; margin: 0; line-height: 1.3; }
.v8 .blog-chips { display: flex; gap: 8px; flex-wrap: wrap; margin: 18px 0 26px; }
.v8 .blog-chips a { text-decoration: none; }
.v8 .blog-chips .chip.on { background: linear-gradient(100deg, var(--sun-hi), var(--sun)); color: #201E18; border-color: transparent; }
.v8 .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.v8 .pager { display: flex; gap: 12px; margin-top: 28px; }
```

- [ ] **Step 2: `src/pages/blog.astro`**

```astro
---
import AppShell from '../layouts/AppShell.astro';
import PostCard from '../components/PostCard.astro';
import { getFeed } from '../lib/posts';
import { filterToQuery, FILTERS } from '../lib/blogFilters';

const url = Astro.url;
const filter = url.searchParams.get('filter');
const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10) || 1);
const q = filterToQuery(filter);
const { posts, hasMore } = await getFeed({ request: Astro.request, cookies: Astro.cookies }, { page, ...q });
const chipHref = (key: string) => (key === 'all' ? '/blog' : `/blog?filter=${key}`);
Astro.response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=86400');
---
<AppShell title="Blog — Neil Busque" description="Thoughts, tutorials, and build logs from Neil Busque." active="blog">
  <span class="eyebrow">The blog</span>
  <h1>Thoughts, tutorials, and <span class="mark-hl">builds.</span></h1>
  <div class="blog-chips">
    {FILTERS.map((f) => (
      <a class:list={['chip', { on: (filter ?? 'all') === f.key }]} href={chipHref(f.key)}>{f.label}</a>
    ))}
  </div>
  <div class="blog-grid">{posts.map((p) => <PostCard post={p} />)}</div>
  {posts.length === 0 && <p>Nothing here yet. Check back soon.</p>}
  <div class="pager">
    {page > 1 && <a class="btn-ghost" href={`/blog?${new URLSearchParams({ ...(filter ? { filter } : {}), page: String(page - 1) })}`}>Newer</a>}
    {hasMore && <a class="btn-ghost" href={`/blog?${new URLSearchParams({ ...(filter ? { filter } : {}), page: String(page + 1) })}`}>Older</a>}
  </div>
</AppShell>
```

- [ ] **Step 3: Redirects.** Replace the ENTIRE contents of each file:

`src/pages/feed.astro`:
```astro
---
export const prerender = false;
return Astro.redirect(`/blog${Astro.url.search}`, 301);
---
```

`src/pages/posts/index.astro` — identical file (query string carries `?tag=X` through unchanged).

`src/pages/now/index.astro`:
```astro
---
export const prerender = false;
return Astro.redirect('/blog?filter=now', 301);
---
```

(Every redirect file in this plan, including Task 9's, uses this exact shape with `export const prerender = false`.)

- [ ] **Step 4: `src/pages/posts/[slug].astro`** — swap the `Site` layout import/usage for `AppShell` with `active="blog"`; keep ALL existing frontmatter data fetching, Schema, Breadcrumb, and body markup inside the AppShell slot. Delete `active="writing"`-style props that AppShell doesn't accept.

- [ ] **Step 5: Build + test check** — `npm run build && npm test`. Expected: green. Also `grep -n "getFeed" src/pages/blog.astro` returns the import (sanity).
- [ ] **Step 6: Commit** — `git commit -am "feat(v8): blog view with filter chips, post cards, legacy redirects"`

---

### Task 7: Home rebuild (index.astro)

**Files:**
- Modify: `src/pages/index.astro` (full rewrite), `src/styles/v8.css` (append)
- Delete: `src/scripts/home-v6.ts`, `src/styles/home-v6.css`, `src/styles/home.css`; run `npm uninstall gsap @vapi-ai/web` and delete `src/components/VoiceWidget.tsx` if present (check `grep -rn "VoiceWidget" src/` first and remove imports).

**Interfaces:**
- Consumes: `AppShell` (`active="home"`), `IntroCinematic` (into `slot="intro"`), `PostCard`, `getFeed`, `getNow`.
- Produces: the five Home sections. Content below is FINAL COPY, use verbatim.

- [ ] **Step 1: Rewrite `src/pages/index.astro`**

```astro
---
import AppShell from '../layouts/AppShell.astro';
import IntroCinematic from '../components/IntroCinematic.astro';
import PostCard from '../components/PostCard.astro';
import Schema from '../components/Schema.astro';
import { getFeed, getNow } from '../lib/posts';

const opts = { request: Astro.request, cookies: Astro.cookies };
const [{ posts: latest }, { current: now }] = await Promise.all([
  getFeed(opts, { page: 1 }),
  getNow(opts),
]);
const latest3 = latest.filter((p) => p.type !== 'now').slice(0, 3);

const CAPABILITIES = [
  { t: 'AI apps', d: 'Working products powered by AI, not demos. Built, deployed, and in your hands in days.' },
  { t: 'Websites', d: 'Fast, modern sites that look designed and convert. Not templates.' },
  { t: 'Custom portals', d: 'Client portals, dashboards, and internal tools shaped exactly to how you work.' },
  { t: 'Automation', d: 'n8n, Zapier, GHL, and custom glue. The busywork runs itself.' },
  { t: 'Growth', d: 'Funnels, copy, and paid media thinking baked in from the first screen.' },
];
const CLIENTS = ['Bravo Team', 'StoutCap', 'Fantum Growth', 'Darioo', 'Catalyze Growth Partners', 'Upstrm / TheWavMan', 'David Wong', 'Heart Life', 'Matador Solutions', 'Noosa Sports Chiropractic'];
const WORK = [
  { name: 'Orbit CRM', img: '/assets/work/orbit-app.webp', href: '/case-studies/orbit', tag: 'CRM + AI agents' },
  { name: 'Tandem', img: '/assets/work/tandem.webp', href: '/case-studies/tandem', tag: 'Couples app' },
  { name: 'Darioo', img: '/assets/work/darioo.webp', href: '/work', tag: 'Client site + app' },
  { name: 'Otto', img: '/assets/work/otto.webp', href: '/work', tag: 'AI command center' },
  { name: 'Hop', img: '/assets/work/hop.webp', href: '/work', tag: 'Link shortener' },
  { name: 'Play Together', img: '/assets/work/play-together.webp', href: '/work', tag: 'Realtime games' },
];
const WA = 'https://wa.me/19083164140?text=Hi%20Neil%2C%20I%20want%20to%20build%20something';
---
<AppShell title="Neil Busque — From idea to product" description="I build AI apps, websites, portals, and automation. You work directly with me, and it ships in days." active="home">
  <IntroCinematic slot="intro" />
  <Fragment slot="head"><Schema /></Fragment>

  <section class="home-hero v8-card">
    <div class="hero-copy">
      <span class="eyebrow">AI builder · New Jersey</span>
      <h1>I turn ideas into <span class="mark-hl">working products.</span></h1>
      <p class="hero-sub">AI apps, websites, portals, and automation. You work directly with me, and the first working version ships in days, not months.</p>
      {now && <p class="hero-now"><span class="strip-dot"></span>Currently: {now.title}</p>}
      <div class="hero-ctas">
        <a class="btn-sun" href="/hire">Start your build</a>
        <a class="btn-ghost" href="/work">See the work</a>
      </div>
      <div class="hero-stats">
        <div><b>10+</b><span>products shipped</span></div>
        <div><b>Days</b><span>to first version</span></div>
        <div><b>1 person</b><span>start to finish</span></div>
      </div>
    </div>
    <img class="hero-photo" src="/assets/art/neil-cutout.png" alt="Neil Busque" fetchpriority="high" />
  </section>

  <section class="home-sec">
    <span class="eyebrow">What I do</span>
    <h2>Five ways I can help.</h2>
    <div class="cap-grid">
      {CAPABILITIES.map((c) => (
        <div class="v8-card cap-card"><h3>{c.t}</h3><p>{c.d}</p></div>
      ))}
    </div>
  </section>

  <section class="home-sec">
    <span class="eyebrow">Worked with</span>
    <div class="client-strip">{CLIENTS.map((c) => <span class="chip">{c}</span>)}</div>
  </section>

  <section class="home-sec">
    <span class="eyebrow">Selected work</span>
    <h2>Real products, live right now.</h2>
    <div class="work-grid">
      {WORK.map((w) => (
        <a class="v8-card work-card" href={w.href}>
          <img src={w.img} alt={w.name} loading="lazy" />
          <div class="work-meta"><b>{w.name}</b><span>{w.tag}</span></div>
        </a>
      ))}
    </div>
  </section>

  <section class="home-sec">
    <span class="eyebrow">From the blog</span>
    <h2>Latest posts.</h2>
    <div class="blog-grid">{latest3.map((p) => <PostCard post={p} />)}</div>
    <p style="margin-top:14px"><a class="btn-ghost" href="/blog">Read the blog</a></p>
  </section>

  <section class="home-sec v8-card why-card">
    <h2>Anyone can use AI. <span class="mark-hl">Finished</span> is what you hire me for.</h2>
    <p>AI gives everyone the same generic starting point. It still needs someone who knows what good looks like, ships past the last 20 percent, and stands behind the result. That is the job.</p>
  </section>

  <section class="home-sec cta-band v8-card">
    <h2>Tell me what you want to build.</h2>
    <p>Message me on WhatsApp or send the form. I answer personally, usually same day.</p>
    <div class="hero-ctas">
      <a class="btn-sun" href={WA}>WhatsApp me</a>
      <a class="btn-ghost" href="/hire">Use the form</a>
    </div>
  </section>
</AppShell>
```

- [ ] **Step 2: Append home styles to v8.css**

```css
.v8 .home-hero { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; align-items: end; padding: clamp(24px, 4vw, 44px); overflow: hidden; }
.v8 .hero-copy h1 { font-size: clamp(34px, 4.6vw, 54px); margin: 10px 0 14px; line-height: 1.08; }
.v8 .hero-sub { color: var(--muted); font-size: 17px; max-width: 52ch; margin: 0 0 14px; }
.v8 .hero-now { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 600; margin: 0 0 18px; }
.v8 .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
.v8 .hero-stats { display: flex; gap: 28px; margin-top: 24px; }
.v8 .hero-stats b { display: block; font-size: 22px; font-weight: 750; letter-spacing: -0.02em; }
.v8 .hero-stats span { font-size: 12.5px; color: var(--muted); }
.v8 .hero-photo { width: 100%; max-width: 300px; justify-self: center; filter: drop-shadow(0 18px 30px rgba(32,30,24,.25)); }
.v8 .home-sec { margin-top: 44px; }
.v8 .home-sec h2 { font-size: clamp(24px, 3vw, 32px); margin: 8px 0 18px; }
.v8 .cap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 14px; }
.v8 .cap-card { padding: 20px; }
.v8 .cap-card h3 { font-size: 18px; margin: 0 0 6px; }
.v8 .cap-card p { font-size: 14px; color: var(--muted); margin: 0; }
.v8 .client-strip { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
.v8 .work-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.v8 .work-card { overflow: hidden; text-decoration: none; color: var(--ink); transition: transform .15s ease; }
.v8 .work-card:hover { transform: translateY(-2px); }
.v8 .work-card img { width: 100%; aspect-ratio: 16/10; object-fit: cover; object-position: top; border-bottom: 1px solid var(--hair); display: block; }
.v8 .work-meta { display: flex; justify-content: space-between; gap: 10px; padding: 12px 16px; font-size: 14px; }
.v8 .work-meta span { color: var(--muted); }
.v8 .why-card, .v8 .cta-band { padding: clamp(24px, 4vw, 40px); }
.v8 .why-card p, .v8 .cta-band p { color: var(--muted); max-width: 62ch; }
@media (max-width: 900px) { .v8 .home-hero { grid-template-columns: 1fr; } .v8 .hero-photo { max-width: 220px; } }
```

- [ ] **Step 3: Delete dead v6/v7 files + deps.** `grep -rn "home-v6\|home.css\|VoiceWidget\|gsap\|@vapi-ai" src/ | grep -v node_modules` and remove every reference; then `rm src/scripts/home-v6.ts src/styles/home-v6.css src/styles/home.css` and `npm uninstall gsap @vapi-ai/web`. Keep `src/pages/api/vapi.ts` (dormant per spec).
- [ ] **Step 4: Build check** — `npm run build && npm test`. Expected: green.
- [ ] **Step 5: Commit** — `git commit -am "feat(v8): Home rebuilt as app view; drop v7 film, gsap, voice widget"`

---

### Task 8: Story view + /about redirect

**Files:**
- Create: `src/pages/story.astro`
- Modify: `src/pages/about.astro` (→301), `src/styles/v8.css` (append)

- [ ] **Step 1: `src/pages/story.astro`** (copy is FINAL, use verbatim)

```astro
---
import AppShell from '../layouts/AppShell.astro';

const TIMELINE = [
  { k: 'Philippines', d: 'Where I am from. No awards, no fancy university. What I had was curiosity and work ethic.' },
  { k: 'IT support', d: 'First tech job. I learned that most problems are patience plus attention to detail.' },
  { k: 'Graphic design', d: 'Taught myself design. Learned what good looks like, pixel by pixel.' },
  { k: 'Web development', d: 'Started building sites for real businesses. Shipped things people paid for.' },
  { k: 'Funnels + CRM', d: 'GoHighLevel, landing pages, email. Learned marketing by doing it for clients.' },
  { k: 'Automation', d: 'Zapier, n8n, APIs. I fell in love with making busywork disappear.' },
  { k: 'AI', d: 'Went all in on Claude Code and AI builds. This is where everything I learned compounds.' },
  { k: 'New Jersey', d: 'Where I live and work now. Building products every single day.' },
];
---
<AppShell title="My story — Neil Busque" description="From the Philippines to New Jersey. No awards, no shortcuts, just work." active="story">
  <span class="eyebrow">My story</span>
  <h1>I'm not a big agency. <span class="mark-hl">That's the point.</span></h1>
  <p class="story-lede">I didn't win awards. I didn't go to a top university. I came from the Philippines, I work hard, and I keep working until it's right. Everything below is how I got here.</p>

  <div class="timeline">
    {TIMELINE.map((t, i) => (
      <div class="tl-row">
        <div class="tl-marker"><span class="tl-dot"></span>{i < TIMELINE.length - 1 && <span class="tl-line"></span>}</div>
        <div class="tl-body v8-card"><h3>{t.k}</h3><p>{t.d}</p></div>
      </div>
    ))}
  </div>

  <section class="home-sec v8-card why-card">
    <h2>When you hire me, you get <span class="mark-hl">me.</span></h2>
    <p>Not an agency that hands you to a junior account manager. You get my personal number. You talk to the person actually building your product. My best interest is to see you succeed, and I keep working until you are proud of what we made.</p>
    <div class="hero-ctas" style="margin-top:18px">
      <a class="btn-sun" href="/hire">Work with me</a>
      <a class="btn-ghost" href="/work">See what I've built</a>
    </div>
  </section>
</AppShell>
```

Append to v8.css:

```css
.v8 .story-lede { color: var(--muted); font-size: 17px; max-width: 60ch; margin: 0 0 30px; }
.v8 .timeline { display: flex; flex-direction: column; }
.v8 .tl-row { display: grid; grid-template-columns: 28px 1fr; gap: 14px; }
.v8 .tl-marker { display: flex; flex-direction: column; align-items: center; }
.v8 .tl-dot { width: 12px; height: 12px; border-radius: 50%; background: linear-gradient(100deg, var(--sun-hi), var(--sun)); border: 2px solid var(--surface); box-shadow: 0 0 0 1px var(--hair); margin-top: 22px; }
.v8 .tl-line { flex: 1; width: 2px; background: var(--hair); }
.v8 .tl-body { padding: 16px 20px; margin-bottom: 14px; }
.v8 .tl-body h3 { margin: 0 0 4px; font-size: 17px; }
.v8 .tl-body p { margin: 0; font-size: 14.5px; color: var(--muted); }
```

- [ ] **Step 2: `src/pages/about.astro`** — replace entire file:

```astro
---
export const prerender = false;
return Astro.redirect('/story', 301);
---
```

- [ ] **Step 3: Build check** — `npm run build`. Expected: exit 0.
- [ ] **Step 4: Commit** — `git commit -am "feat(v8): Story view with timeline; /about redirects"`

---

### Task 9: Work view + redirects + case-study reskin

**Files:**
- Create: `src/pages/work.astro`
- Modify: `src/pages/projects/index.astro` (→301 `/work`), `src/pages/case-studies/index.astro` (→301 `/work`), `src/pages/case-studies/[slug].astro` (layout swap to AppShell `active="work"`)

- [ ] **Step 1: `src/pages/work.astro`**

```astro
---
import AppShell from '../layouts/AppShell.astro';
import { caseStudies } from '../data/case-studies';

const CLIENTS = ['Bravo Team', 'StoutCap', 'Fantum Growth', 'Darioo', 'Catalyze Growth Partners', 'Upstrm / TheWavMan', 'David Wong', 'Heart Life', 'Matador Solutions', 'Noosa Sports Chiropractic'];
const APPS = [
  { name: 'Orbit CRM', img: '/assets/work/orbit-app.webp', tag: 'CRM + AI agents' },
  { name: 'Tandem', img: '/assets/work/tandem.webp', tag: 'Couples app' },
  { name: 'Darioo', img: '/assets/work/darioo.webp', tag: 'Client site + app' },
  { name: 'Otto', img: '/assets/work/otto.webp', tag: 'AI command center' },
  { name: 'Hop', img: '/assets/work/hop.webp', tag: 'Link shortener' },
  { name: 'Play Together', img: '/assets/work/play-together.webp', tag: 'Realtime games' },
  { name: 'Orbit dashboard', img: '/assets/work/orbit-dashboard.webp', tag: 'Mission control UI' },
  { name: 'Scott Greenleaf', img: '/assets/work/scottgreenleaf.webp', tag: 'Client rebuild' },
];
const csBySlug = new Map(caseStudies.map((c) => [c.slug, c]));
const csFor = (name: string) => {
  const key = name.toLowerCase().split(' ')[0];
  return csBySlug.has(key) ? `/case-studies/${key}` : null;
};
---
<AppShell title="Work — Neil Busque" description="Apps, sites, and client builds by Neil Busque. Real products, live right now." active="work">
  <span class="eyebrow">The work</span>
  <h1>Built by one person. <span class="mark-hl">Shipped for real.</span></h1>
  <div class="work-grid" style="margin-top:22px">
    {APPS.map((w) => {
      const href = csFor(w.name);
      const Tag = href ? 'a' : 'div';
      return (
        <Tag class="v8-card work-card" href={href ?? undefined}>
          <img src={w.img} alt={w.name} loading="lazy" />
          <div class="work-meta"><b>{w.name}</b><span>{w.tag}</span></div>
        </Tag>
      );
    })}
  </div>

  <section class="home-sec">
    <span class="eyebrow">Case studies</span>
    <h2>The deep dives.</h2>
    <ul class="cs-list">
      {caseStudies.map((cs) => (
        <li><a class="v8-card cs-row" href={`/case-studies/${cs.slug}`}><b>{cs.title}</b><span>{cs.summary ?? cs.tagline ?? ''}</span></a></li>
      ))}
    </ul>
  </section>

  <section class="home-sec">
    <span class="eyebrow">Worked with</span>
    <div class="client-strip">{CLIENTS.map((c) => <span class="chip">{c}</span>)}</div>
  </section>
</AppShell>
```

NOTE: before writing, open `src/data/case-studies/types.ts` and use the REAL field names for title/summary on the `cs-row` line (adjust `cs.summary ?? cs.tagline` to whatever exists — do not invent fields).

Append to v8.css:

```css
.v8 .cs-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.v8 .cs-row { display: flex; justify-content: space-between; gap: 14px; padding: 16px 20px; text-decoration: none; color: var(--ink); font-size: 15px; flex-wrap: wrap; }
.v8 .cs-row span { color: var(--muted); }
```

- [ ] **Step 2: Redirects** — replace `src/pages/projects/index.astro` and `src/pages/case-studies/index.astro` bodies with `return Astro.redirect('/work', 301);` frontmatter-only files (same shape as Task 8 Step 2).
- [ ] **Step 3: `src/pages/case-studies/[slug].astro`** — swap `Site` layout for `AppShell` `active="work"`; keep all data fetching, Schema, Breadcrumb, and the `case-study.css` import.
- [ ] **Step 4: Build check** — `npm run build`. Expected: exit 0.
- [ ] **Step 5: Commit** — `git commit -am "feat(v8): Work view, projects/case-studies redirects, case-study reskin"`

---

### Task 10: Hire view reskin + programmatic hire pages

**Files:**
- Modify: `src/pages/hire/index.astro`, `src/pages/hire/ai-engineer.astro`, `ai-engineer-nj.astro`, `ai-engineer-nyc.astro`, `ai-engineer-remote.astro`, `ai-automation.astro`

- [ ] **Step 1: `src/pages/hire/index.astro`** — swap its layout to `AppShell` `active="hire"`. Keep the ENTIRE existing lead form block (markup, IDs, inline script posting to `/api/form-lead`) byte-identical. Restructure surrounding content into: h1 `Let's build your thing.` (with `mark-hl` on "your thing"), a 4-step process strip (Brief → Build days → Review → Handoff or keep me), the form inside a `v8-card`, a WhatsApp `btn-sun` next to the form submit, and the guarantee line: `I keep working until you are proud of it. If I am not the right fit, I will tell you on the first call.`
- [ ] **Step 2: The 5 programmatic hire pages** — layout swap ONLY (`Site`/current wrapper → `AppShell active="hire"`); do not touch their SEO copy, titles, or Schema.
- [ ] **Step 3: Build check** — `npm run build`. Expected: exit 0.
- [ ] **Step 4: Commit** — `git commit -am "feat(v8): Hire views on AppShell, form contract untouched"`

---

### Task 11: SEO plumbing + version bump

**Files:**
- Modify: `src/pages/sitemap.xml.ts`, `src/components/Schema.astro`, `src/pages/llms.txt.ts`, `package.json`

- [ ] **Step 1: sitemap** — open `src/pages/sitemap.xml.ts`; in its static-routes list: add `/story`, `/work`, `/blog`; remove `/about`, `/feed`, `/projects`, `/now/`, `/posts` (redirects don't belong in sitemaps). Keep guides/hire/case-study entries.
- [ ] **Step 2: Schema.astro** — update the Person/WebSite JSON-LD: `image` → `https://busqueneil.com/assets/brand/og-default.png`; ensure `url` entries that pointed at `/about` now point at `/story`.
- [ ] **Step 3: llms.txt** — update any `/feed`, `/about`, `/posts` links to `/blog` and `/story`.
- [ ] **Step 4: package.json** — `"version": "8.0.0"`.
- [ ] **Step 5: Build check** — `npm run build && npm test`. Expected: green.
- [ ] **Step 6: Commit** — `git commit -am "feat(v8): sitemap, schema, llms.txt, v8.0.0"`

---

### Task 12: QA sweep + ship

**Files:** none new (fixes as needed)

- [ ] **Step 1: Em-dash guard** — `grep -rn "—" src/pages src/components src/layouts --include="*.astro" | grep -v "From idea to product\""` → expected: ZERO copy hits (title-tag `—` separators in `title=` props are the only allowed matches; inspect each hit).
- [ ] **Step 2: Local run + screenshots** — `npm run dev` (unsandboxed), then headless Chrome (`--headless=old --no-sandbox --screenshot --window-size=1440,2200` and `--window-size=390,1600`, and `--virtual-time-budget=4000`) against `/`, `/story`, `/work`, `/blog`, `/hire`. READ each screenshot: rail present ≥1024px, tab bar present at 390px, no yellow-on-ivory text, intro plays on `/` (screenshot at t≈1s shows the mark; a second load in the same profile skips it).
- [ ] **Step 3: Redirect checks** — with dev server: `for p in /feed /posts /projects /about /case-studies /now/; do curl -s -o /dev/null -w "%{http_code} %{redirect_url} $p\n" http://localhost:4321$p; done` → all 301 to the new routes; `/feed?tag=x` carries the query.
- [ ] **Step 4: Blog data check** — `curl -s http://localhost:4321/blog | grep -c "post-card"` ≥ 1; `/blog?filter=now` renders without error.
- [ ] **Step 5: Fix anything found, commit fixes.**
- [ ] **Step 6: Ship** — `git push origin main`. After Vercel deploy: `curl -sI https://busqueneil.com/feed | grep -i location` (301 → /blog), spot-check `https://busqueneil.com/` HTML contains `shell-rail`, and confirm the favicon link points at `/assets/brand/`.
- [ ] **Step 7: Final commit/tag if needed** — done.
