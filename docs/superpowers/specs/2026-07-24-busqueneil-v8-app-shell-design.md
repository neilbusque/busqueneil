# busqueneil.com v8 — "App Shell" redesign (design spec)

Date: 2026-07-24
Status: awaiting Neil's approval
Predecessor: v7.3.1 "Grove" scroll film (kept in git history)

## Goal

Rebuild busqueneil.com so the whole site looks and feels like an app Neil built, not a website.
Homepage focuses on Neil himself: who he is, what he does, his story, companies/clients he has
worked with, plus a first-class blog (thoughts, tutorials, builds). Simple and easy to use is the
explicit mandate: no scroll-jacked film, no heavy animation, fast everywhere.

## Brand (new, canonical)

"Dot & Square" system from `NeilOS/context/deliverables/neil/logo-dot-square/` (see its README):

- Mark: forest-ink rounded square + emerald dot top-right. Wordmark "Neil Busque." with emerald period.
- Palette: paper `#FAF8F2`, forest ink `#16281C`, emerald `#1F9D55` / teal `#0E8C7F`, amber `#E89B2D`
  (annotations only), hairline `#E6E1D4`. Grid-paper texture as an ambient surface.
- Type: Fraunces 600 display (italic gradient emphasis), Inter UI/body, Caveat amber annotations (sparingly).
- Light theme only in v8 (matches brand; cuts scope). No em dashes in copy.
- Favicons/app icons/OG replaced site-wide from the new asset set.

## The shell (one layout, every main page)

New `src/layouts/AppShell.astro` used by all primary routes:

- **Desktop (≥1024px):** slim left rail. Top: mark + "Neil." lockup. Nav: Home, Story, Work, Blog, Hire
  (icon + label, emerald pill on active). Bottom of rail: avatar photo + availability dot + WhatsApp link.
- **Mobile:** bottom tab bar with the same 5 items (icon + label). No hamburger.
- **Top strip:** current status pulled from the latest `now` post ("Currently: …"), quiet, one line,
  linking to /blog?filter=now. Right side: ⌘K hint (desktop only).
- **Command palette (⌘K):** small vanilla island; navigates the 5 views + external links (GitHub,
  LinkedIn, WhatsApp). Nice-to-have tier: ship last, cut first if it threatens simplicity.
- **Navigation feel:** Astro ClientRouter (view transitions) so switching views feels like switching
  tabs in an app, with a subtle fade/slide. Every route stays a real server-rendered URL (SEO intact).
- Content area: cards on paper with hairline borders, generous whitespace, the grid texture at low alpha.

## Views

1. **Home `/`** (rebuilt): profile-first, in order:
   - Hero card: Neil cutout photo (reuse `neil-cutout.png`), name lockup, "From idea to product." line,
     two buttons ("Start your build" → /hire, "See the work" → /work), 3 quick stats (apps shipped,
     typical days to v1, years in tech; numbers must be git/live verifiable, no embellishment).
   - "What I do" capability cards: AI apps, websites, custom portals, automation, growth/marketing.
   - "Worked with" strip: Bravo Team, StoutCap, Fantum Growth, Darioo, Catalyze Growth Partners,
     Upstrm / TheWavMan, David Wong (Beauty Brand Accelerator), Heart Life, Matador Solutions,
     Noosa Sports Chiropractic. Typographic chips (no fake logos). CGP inclusion explicitly approved
     by Neil 2026-07-24.
   - Featured work: 4-6 cards with real screenshots → /work.
   - Latest from the blog: 3 most recent posts.
   - Why-me card ("Anyone can use AI. Finished is what you hire me for.") condensed from v7 copy.
   - CTA band: "Tell me what you want to build" → WhatsApp prefill + link to /hire form.
2. **Story `/story`** (new): the canvas narrative, told plainly. Timeline: Philippines → IT →
   graphic design → web dev → funnels/GHL → automation → AI → New Jersey. Manifesto block: "I didn't
   win awards. I didn't go to a top university. I work hard." Direct-with-me guarantee: no junior
   account managers, you get my number, I work until you are proud of it. `/about` 301s here
   (its "Outside the work" content moves here).
3. **Work `/work`** (new index): app grid of builds with real screenshots; each card links to its
   existing case study where one exists, else live URL. Full client list at the bottom.
   `/projects` and `/case-studies` index 301 → /work; `/case-studies/[slug]` detail pages KEEP their
   URLs and get AppShell chrome.
4. **Blog `/blog`** (new index over existing data): stream of the Supabase `posts` table with filter
   chips: All, Thoughts (type=status), Tutorials (type=article tagged `tutorial`), Builds
   (type=project), Now (type=now). Same /admin composer, instant publish, zero migration.
   `/feed` 301 → /blog (query preserved). `/posts` index 301 → /blog. `/posts/[slug]` permalinks
   UNCHANGED (SEO) but rendered inside AppShell. RSS/sitemap/llms.txt regenerate as-is.
5. **Hire `/hire`** (reskin): what you get, process (brief → build days → review → handoff or keep me),
   the existing Orbit-wired form (`/api/form-lead` contract untouched), WhatsApp button, guarantee.
   Programmatic hire pages (`/hire/ai-engineer*`, `/hire/ai-automation`) keep URLs + content, get shell chrome.

## Untouched

Funnels `/build`, `/help`, `/ria`, `/support`, `/analyzer` (+ their APIs), `/admin` composer +
auth, `/guides/*` (left entirely as-is in v8), Supabase backend, Orbit form pipeline, per-post OG generation. Talk/voice widget: REMOVED
from v8 shell (simplicity); `/api/vapi` endpoint stays dormant.

## SEO / plumbing

- 301s: `/feed`→`/blog`, `/posts`(index)→`/blog`, `/projects`→`/work`, `/case-studies`(index)→`/work`,
  `/about`→`/story`. All existing detail permalinks unchanged. Redirects carry query strings
  (RedirectPreservingQuery pattern already in repo).
- Schema: Person/WebSite refreshed with new brand assets; BreadcrumbList intact on detail pages.
- New favicon set + `og-default.png` from the brand folder; per-post OG images keep working.
- Package v8.0.0. Em-dash guard: `grep -c "—" src/pages/**` = 0 in user-facing copy before ship.

## QA bar

- `npm run build` green; no console errors on the 5 views.
- Headless screenshots at 1440 and 390 for all 5 views (use the unsandboxed `--headless=old
  --screenshot` recipe; emulate no-preference reduced-motion).
- Redirect spot checks (curl -I on the 5 301s), form e2e (test lead into Orbit, then delete),
  blog chips filter correctly against live data, /posts/[slug] renders in shell.
- LCP on / under 1s on broadband (no video, no film).

## Out of scope (explicit)

Dark mode, the visual companion, blog post editor changes, new case studies, Vapi/voice revival,
guides redesign, any backend/schema change.
