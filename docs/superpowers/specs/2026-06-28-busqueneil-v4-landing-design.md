# busqueneil.com v4 — premium personal landing

**Date:** 2026-06-28
**Status:** Approved → implementing
**Repo:** `context/deliverables/neil/brand-site` (Astro 5 SSR + Supabase, deploy Vercel)

## Goal

Replace the build-in-public feed homepage with a premium personal landing in the
spirit of ai.neilb.me (dark, animated, high-craft) — **but with no loading
screen**. The page sells Neil as a builder + marketer who ships, showcases 8
shipped products as proof, states he is open for work (including senior
technical roles: fractional CTO / Head of AI / AI Systems Architect), embeds the
talk.busqueneil.com live concierge, and carries a short bio.

## Decisions (locked)

- **Homepage replaced.** New dark landing becomes `/`. The existing build-log
  feed moves to **`/feed`** (and stays linked from nav + footer + hero).
- **Positioning:** hero leads "builder + marketer who ships." The CTO / Head of
  AI / AI Systems Architect framing lives in the "Open for work" section.
- **Hero visual:** lightweight **WebGL shader canvas** — slow-drifting
  indigo→violet gradient mesh with a soft central glow + faint particle field,
  cursor-reactive parallax. Vanilla WebGL, renders on first paint (**no loading
  screen**), falls back to a static CSS gradient under `prefers-reduced-motion`
  and if WebGL is unavailable.
- **Dark scope:** dark/premium treatment is **scoped to the homepage only**.
  Interior pages (feed, projects, posts, about, now) keep the existing light
  Swiss system. Home is the premium front door; clicking in drops to the
  readable light environment.
- **Fonts:** add **Sora** (display) for the home only; keep **Geist Mono** for
  eyebrows/labels. Interior pages unchanged (Geist).
- **"Play Together" = Watch Together** (watch.yengandneil.site). Confirmed.

## Architecture / what changes

| File | Change |
|---|---|
| `src/pages/index.astro` | **Rewritten** as the dark landing (was the feed). |
| `src/pages/feed.astro` | **New** — the old homepage feed content (build log + projects strip + now), using the existing light `Site` layout. |
| `src/layouts/Site.astro` | Add **Feed** nav link + footer link. Keep Work/Writing/Now/About/Hire. |
| `src/layouts/Base.astro` | Conditionally load **Sora** font + allow a `bodyClass`/dark flag for the home. |
| `src/styles/home.css` | **New** — self-contained dark landing styles (scoped via a `.home-v4` wrapper so it cannot leak into light pages). |
| `src/components/HeroCanvas.tsx` | **New** Preact island — the WebGL shader hero (client-only, `client:idle` or `client:load`). |
| `src/components/home/*` | Optional small `.astro` partials for sections (kept inline if simpler). |

Untouched: admin, OG (`og/[slug].png.ts`), RSS, sitemap, llms.txt, Supabase libs,
SEO. The new home still emits the existing Schema / OG meta.

The home stays **SSR** (it's the canonical page) but pulls **no Supabase data**
that would slow it — project showcase content is static (hand-authored). It may
optionally read the latest `/now` line for a freshness touch; if that adds
latency or risk, omit it (YAGNI).

## Homepage sections (top → bottom)

1. **Hero** — shader canvas bg (no loading screen). Mono eyebrow. H1: *"I turn
   marketing and ideas into systems that run."* Sub: one line on the
   marketing↔engineering seam + AI. CTAs: **Hire me →** (`/help`) and **See the
   work** (anchor to showcase). Live "Open to work" pill. At-a-glance facts:
   Role · Focus · Stack · Based (Elizabeth, NJ · EST).
2. **What I do** — capability grid: Digital marketing · SEO · Paid search /
   Funnels & CRM / Automation (n8n · Make) / AI agents & systems / Custom web
   apps & PWAs.
3. **Project showcase** — 8 product cards (centerpiece), premium hover. Each:
   name, one-liner, short "what it does," stack chips, live link.
4. **Who I am** — short bio (marketing↔engineering seam; PH → Korea → NJ; ships
   fast and in public). Photo if available.
5. **Open for work** — explicit ask. "Open to W2 digital-marketing / SEO /
   paid-search roles — and ready to step in as your **fractional CTO, Head of
   AI, or AI Systems Architect**." Links: Email · LinkedIn · Resume.
6. **Talk live** — "Talk to me, live." Embeds talk.busqueneil.com via
   `<script src="https://talk.busqueneil.com/widget.js">` (floating concierge
   button) + an in-section **Start a live call →** CTA linking to
   talk.busqueneil.com. If the widget fails to load / blocks embedding, the CTA
   link is the graceful fallback.
7. **Footer** — existing footer + Feed link.

## Project showcase content (editable placeholders)

| Card | One-liner | Link |
|---|---|---|
| Orbit | Simple AI-powered CRM with a built-in AI assistant (Hiro), voice, pipelines, billing. | https://app.inorbit.one |
| Otto | Autonomous AI command center — CRM + closing agent on Claude. | https://otto-neilbusque.vercel.app |
| Magus | Cold-email app + AI SDR that books calls for you. | https://magus.neilb.me |
| Pulse | Personal trends dashboard + daily digest. | https://trends.neilb.me |
| Hop | Link shortener with analytics, push, PWA + Chrome extension. | https://links.busqueneil.com |
| Prism | macOS multi-account browser with built-in AI. | (desktop app — no public link) |
| Tandem | Couples habit + connection PWA. | https://hub.yengandneil.site |
| Play Together | 1:1 video calls that share tab audio — watch anything together. | https://watch.yengandneil.site |

## Visual system (home only)

- Base `#08080C`, panel `#0F0F16`, hairline `rgba(255,255,255,.08)`.
- Accent indigo→violet (`#5B5BF5` → `#8B5CF6`), reuse existing `--accent` family
  where it reads on dark.
- Sora display (600/700), Geist Mono eyebrows, system/Geist body.
- Generous vertical rhythm, max shell ~1180px (matches existing).
- Motion: subtle reveal-on-scroll (reuse existing reveal pattern), shader drift.
  All motion gated by `prefers-reduced-motion`.

## Performance / no-loading-screen guarantee

- Hero renders content (text, CTAs) immediately as static HTML; the shader canvas
  layers behind and animates once the island hydrates — **page is usable with
  zero blocking**. No spinner, no gate, no "enter" screen.
- Shader is a single fragment shader on one `<canvas>`; no textures/models to
  fetch. Pauses via `requestAnimationFrame` visibility checks.

## Build / QA / deploy

1. Build all files; `npm run build` clean.
2. **QA:** run `npm run dev`, screenshot the home (desktop + mobile widths) with
   a headless browser, run the UI pre-delivery checklist (contrast, spacing,
   no overflow, links resolve, reduced-motion fallback, `/feed` works, nav
   correct). Fix issues, re-screenshot until clean.
3. Bump `package.json` to `4.0.0`.
4. Deploy GitHub-first (existing Vercel pipeline). Verify live URL renders and
   `/feed` resolves.

## Out of scope (YAGNI)

- Full-site dark mode (interior pages stay light).
- New CMS fields for the showcase (content is hand-authored static).
- R3F / 3D model loading (defeats the no-loading-screen goal).
- Reworking admin, OG, RSS, or the posts pipeline.

## Risks

- **Widget embedding:** talk.busqueneil.com `/widget.js` may not exist or may
  block cross-origin. Mitigation: CTA link fallback (always works).
- **Dark→light transition** between home and interior pages. Accepted; common
  pattern. Smooth via consistent nav/footer and accent family.
- **Photo asset** for bio may be absent. Mitigation: ship without photo (text
  bio) if none found; design degrades gracefully.
