# busqueneil.com v6 — "Idea → Shipped" immersive scroll film

**Date:** 2026-07-21
**Owner:** Neil Busque
**Status:** Approved design, pending spec review
**Supersedes on `/`:** v5 "Electric Glow" (`src/pages/index.astro`, pkg v5.0.0). v5 remains in git history.

---

## 1. Goal

Rebuild the busqueneil.com homepage (`/`) as an immersive, GSAP-driven scroll experience that
tells one story: a client's rough idea becomes a shipped custom website or web app, built by Neil,
fast. The narrative arc mirrors darioo.busqueneil.com/v2 (idea → product) but reframed for Neil's
offer: **idea → custom website / custom software**.

It replaces `/` directly. Interior pages (`/feed`, `/about`, `/now`, `/admin`, `/case-studies`,
`/guides`, `/hire`, funnels) and the Supabase backend are untouched.

## 2. Scope

**In scope:** a single long-scroll homepage at `/`.
**Out of scope:** interior page restyles, backend/CMS changes, new API endpoints, new Supabase tables.

## 3. Decisions (locked)

- **Build target:** replace `/` in the existing `busqueneil` repo. v5 → git history.
- **Scope:** homepage experience only; keep all interior pages + backend.
- **Content:** reuse real assets where they exist —
  - **Testimonials:** reuse the 8 real screenshot testimonials (`public/assets/testimonials/testimonial1-8.png`).
  - **Museum samples:** reuse the 5 real product screenshots (`public/assets/work/orbit|otto|hop|play-together|tandem.webp`) on laptop mockups + 2 "coming soon" placeholder pedestals so it reads as a gallery.
  - **Photo:** reuse Neil's real photo (`public/assets/art/neilpic.png`) and the existing rendered 3D hero video (`public/assets/art/neil-hero.mp4` / `.webp`).
- **Animation intensity:** cinematic on desktop (`>=768px`); simplified, non-pinned version on mobile; fully static on `prefers-reduced-motion`.
- **Primary CTA:** WhatsApp-first everywhere (`https://api.whatsapp.com/send/?phone=9083164140`). The "what do you want to build?" section pre-fills a WhatsApp message (no form friction). The existing `/api/form-lead` → Orbit wiring stays available but is not the primary path.

## 4. Animation engine

**GSAP + ScrollTrigger**, driving **SVG + DOM/CSS** (no WebGL/Three.js).

- Install `gsap` (npm), import in a bundled Astro module script — no CDN, respects existing security headers / CSP posture.
- The "3D" aesthetic is achieved with the existing rendered 3D hero video + CSS isometric laptop mockups (a tilted mockup = the "3D website" output). No WebGL needed; lighter and mobile-friendly.
- Rationale over WebGL: less weight, better accessibility/degradation, no new heavy dependency, and the hero already ships a rendered-3D look.

## 5. Section-by-section

Order top → bottom on `/`:

1. **Nav** — carried over: `busqueneil` brand, anchor links (Work/About), WhatsApp "Get in touch" pill. Page cursor spotlight retained (desktop, `hover:hover` only).

2. **Hook (hero)** — headline + offer + Neil's real photo/hero video. Sub-line teases "what will you build?" Scroll cue animates to pull the user into the film. Copy: reuse/adapt current hero ("turn 'we should build that' into something live this week").

3–7. **The Process Film** — ONE pinned ScrollTrigger scene, scrubbed to scroll progress, five beats:
   - **Beat A — the idea:** an SVG scribble ("we should build that") draws on (path draw-on), then morphs/settles into a **"new request"** card.
   - **Beat B — we talk:** a video-call frame slides in with two participant tiles ("we talk it through, virtually").
   - **Beat C — building:** an isometric laptop appears; code lines type themselves on-screen; a subtle progress indicator.
   - **Beat D — days pass:** the sky behind the laptop cycles **sunny → midnight → sunny → midnight → sunny**, a sun/moon arcs across, a "Day 1 / Day 2 / Day 3" counter ticks.
   - **Beat E — shipped:** the laptop screen resolves into a finished product; **two outputs slide out — a 3D website card + a web-app card**, stamped "Shipped."
   - Captions per beat, fade-synced to scrub. Total pin length ≈ 400–500vh of scroll.

8. **The Museum** — pinned horizontal scroll: laptop mockups on spotlit pedestals translate left→right as the user scrolls down. 5 real screenshots + 2 placeholder "coming soon" pedestals. Click a piece → an inline `<dialog>` lightbox with a larger preview + live link (vanilla JS, no framework island).

9. **Testimonials** — the 8 real client messages as spotlight cards (masonry/staggered), reveal-on-scroll.

10. **What I can do** — "From a landing page to custom software you own." Capabilities grid (carried over `caps` data), animated in.

11. **What do you want to build?** — an interactive prompt styled like the opening scribble (closes the narrative loop). A text input + a few quick-pick chips (App / Automation / Funnel / Not sure). On submit, opens WhatsApp with the typed text pre-filled in the message body.

12. **FAQ** — reuse existing objection copy (AI-built bugs, why-not-Lovable, why-not-ChatGPT-myself, handoff, reliability) + add one guarantee-forward item. `<details>` accordion.

13. **Contact + footer** — carried over: WhatsApp-primary CTA, roles chips, alt-contact links, footer.

## 6. File structure

- `src/pages/index.astro` — page shell, section markup, data arrays (`featured`, `more`, `testimonials`, `faqs`, `caps` — carried from current file). Uses `Base` with `dark`.
- `src/styles/home-v6.css` — all new styles, scoped under a `.v6` root class to avoid leaking into interior pages (same isolation pattern as `.home-v4`).
- `src/scripts/home-v6.ts` — one bundled module script: registers GSAP + ScrollTrigger, builds each scene in its own init function (`initProcessFilm`, `initMuseum`, `initReveals`), reads `matchMedia` to gate desktop-only scenes and honor `prefers-reduced-motion`.
- Museum lightbox — inline `<dialog>` + small vanilla JS in `home-v6.ts`.
- Old `src/styles/home.css` remains for git history; `index.astro` stops importing it.

Each scene init is independently understandable and testable: takes DOM roots, wires one ScrollTrigger, returns nothing. No shared mutable state between scenes.

## 7. Responsive + accessibility

- ScrollTrigger pinned/horizontal scenes initialize only at `>=768px`.
- `<768px`: the Process Film degrades to a vertical stacked strip of the five beats (reveal-on-scroll, no pin); the Museum degrades to a normal vertical card stack (native horizontal swipe optional, no pin).
- `prefers-reduced-motion: reduce`: no GSAP scenes run; all content renders in final/static state and is fully readable. (Base.astro already forces `.reveal` visible under reduced-motion; extend the same guard to v6 scenes.)
- All museum/testimonial images `loading="lazy"` with explicit width/height.
- Keyboard: museum lightbox is a native `<dialog>` (focus-trapped, Esc closes); FAQ is native `<details>`.

## 8. Reused wiring (do not break)

- `Base.astro` (dark theme, Inter + JetBrains Mono, `.reveal` IntersectionObserver, Talk concierge widget, `ExitIntentAnalyzer`).
- `Schema.astro` in the `head` slot; keep Person/ProfilePage/FAQ JSON-LD.
- `setPublicCache(Astro.response.headers)` for SSR cache headers.
- OG image `og-v5.png` (or regenerate a v6 frame — optional, not required).
- Meta title/description carried over.
- WhatsApp number `9083164140` and `busqueneil@gmail.com` throughout.

## 9. Copy

- **New copy to write** (CopyOS voice, no em dashes, first-person, confident): the five Process Film captions, museum piece labels, the "what do you want to build?" section, and section intros.
- **Reused copy:** hero headline, capabilities data, FAQ items, contact/roles.
- Load `knowledge/copyos/CLAUDE.md` + `00-OVERVIEW.md` + `quick-reference.md` before writing new copy.

## 10. Build, QA, deploy

- Local `npm run dev`, verify each scene at desktop + mobile widths + reduced-motion.
- Puppeteer viewport screenshots at scroll stops (NOT full-page — full-page shots blank out mid-page on this site, known artifact).
- `npm run build` must pass.
- Bump `package.json` to `6.0.0`.
- GitHub-first deploy: merge to `main` → Vercel production (personal account). No Netlify.
- Post-deploy: live QA of the pinned scenes on real scroll + a phone.

## 11. Non-goals / YAGNI

- No WebGL/Three.js, no new 3D asset generation (reuse existing hero video).
- No CMS/admin changes, no new lead form, no new API routes.
- No interior page restyle.
- No new testimonial or screenshot production this pass (placeholders where real assets are missing).

## 12. Risks

- **Scroll jank on heavy pins:** mitigate by keeping scenes SVG/DOM/transform-only (GPU-friendly), `will-change` sparingly, no layout thrash inside scrub handlers.
- **Pinned horizontal + pinned vertical adjacency:** ensure ScrollTrigger `end` values don't overlap; test the transition between Process Film and Museum.
- **Mobile Safari address-bar resize** re-triggering ScrollTrigger: use `ScrollTrigger.config({ ignoreMobileResize: true })` and refresh on orientation change only.
- **LCP regression:** hero must stay the LCP element with `fetchpriority=high` preload (as v5). GSAP loads deferred/after paint.
