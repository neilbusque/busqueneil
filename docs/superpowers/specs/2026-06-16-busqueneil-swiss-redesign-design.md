# busqueneil.com v3 — "Swiss Grid Mono" Redesign + Full SEO

**Date:** 2026-06-16
**Repo:** `neilbusque/busqueneil` (branch `redesign-swiss`)
**Status:** Design approved (pending written-spec review)

---

## 1. Goal

Full ground-up rebuild of the **front-end** of busqueneil.com into a premium, techy, **light-mode Swiss-grid-minimal** look, while **reusing the proven backend** (Supabase CMS, admin/auth, OG pipeline, lead funnels). Plus a **full SEO pass** (technical + on-page + schema + GEO) with zero loss of indexed URLs.

### Decisions (locked with Neil)
- **Scope:** new front-end, reuse backend.
- **Aesthetic:** Swiss grid minimal — stark white, oversized type, thin rules, heavy whitespace, mono details.
- **Accent:** electric blue/indigo.
- **Homepage:** strong hero → selected work → build-in-public feed → now.
- **Content:** migrate everything (no data loss).
- **SEO:** full (audit + technical + on-page + schema + GEO + 301 continuity).
- **Fonts:** Geist Sans + Geist Mono (drop Fraunces serif).
- **Funnels:** leave as-is in v1; matching Swiss reskin is a follow-up.
- **Hero copy:** build-in-public maker identity.

---

## 2. The Contract — Reuse vs Rebuild

### Reused UNTOUCHED (verified backend contracts — must not break)
- **Supabase `posts` table** — all 15 columns, `post_type` enum (`status|article|project|now`), `slug` UNIQUE, `status` CHECK in (`draft|published`), indexes (`posts_feed_idx`, `posts_type_idx`, `posts_tags_idx` GIN), `set_updated_at` trigger.
- **RLS:** public anon reads scoped to `status='published'`; authenticated = full CRUD. All public queries keep `.eq('status','published')`. No service-role key on public paths.
- **Auth:** Supabase email/password; `middleware.ts` validates via `sb.auth.getUser()` (not `getSession`); protected patterns `/^/admin(?!/login)/` and `/^/api/admin//`; per-request server client carries user JWT.
- **Lib:** `src/lib/posts.ts`, `supabase.ts`, `markdown.ts`, `format.ts`, `og-fonts.ts`, `types.ts` — query functions and the markdown-at-save-time pipeline (`renderMarkdown`: remark-parse → gfm → rehype → slug → **sanitize BEFORE Shiki** → Shiki `vitesse-dark` → stringify). Read path consumes `body_html`, never re-renders.
- **Admin API:** `src/pages/api/admin/posts.ts` (upsert/delete), `api/auth/signin.ts`, `signout.ts`. `published_at` set only on first publish.
- **OG pipeline:** `src/pages/og/[slug].png.ts` (satori → resvg, base64 fonts), fallback `/og.png`.
- **Funnels:** `public/build|help|ria|support/index.html` + `/thanks/` pages, `public/js/lead-form.js`, `public/js/chat-widget.js` → Orbit edge fns via `vercel.json` rewrites `/api/form-lead` + `/api/chat` → `cubglfkgnjvlwelkmnbh.supabase.co`. `data-lead-form` values (`help|build|ria|tech-support`) tag Orbit source. **Frozen in v1.**
- **Config that must persist:** `astro.config.mjs` `output:'server'` + `@astrojs/vercel` adapter, `trailingSlash:'ignore'`, `security.checkOrigin:false`, `vite.ssr.external:['@resvg/resvg-js']`; `vercel.json` security headers, cache rules, `text/plain` for llms.txt, `/favicon.ico` rewrite, `/hire` + `/hire/*` → `/` 301s; env `PUBLIC_SUPABASE_URL` + `PUBLIC_SUPABASE_ANON_KEY`.

### Rebuilt from scratch (front-end)
- `src/styles/global.css` — entire new design system (tokens, type, grid, components).
- `src/layouts/Base.astro` (head/meta — keep contract, refresh asset/font links) + `src/layouts/Site.astro` (new Swiss chrome: ticker, masthead, footer).
- `src/pages/index.astro` — new hero → work → feed → now structure.
- `src/components/FeedEntry.astro` — hairline-row feed item with left mono meta rail.
- `src/pages/about.astro`, `projects/index.astro`, `posts/index.astro`, `posts/[slug].astro`, `now/index.astro`, `404.astro` — re-skinned, **routes/canonicals/slugs identical**.
- `src/components/Composer.tsx` — re-skinned (logic unchanged).
- `src/components/Schema.astro` — extended (see SEO) + entity fix.

---

## 3. Design System — "Swiss Grid Mono"

### Tokens (`:root` in `global.css`)
| Token | Value | Role |
|---|---|---|
| `--paper` | `#FFFFFF` | page |
| `--paper-2` | `#FAFAFB` | subtle alternating panels |
| `--ink` | `#0A0A0B` | display + body |
| `--ink-2` | `#3A3A40` | secondary prose |
| `--muted` | `#8A8A92` | mono metadata, bylines |
| `--rule` | `#E7E7EC` | 1px hairline dividers (cool grey) |
| `--rule-strong` | `#0A0A0B` | 2px structural ink rules |
| `--accent` | `#3B3DF5` | electric indigo: display accent, hover, focus ring, status dot |
| `--accent-ink` | `#2A2BD6` | body text links (AA ≥ 4.5:1 on white) |
| `--accent-wash` | `#EEEEFF` | rare tint fills |
| `--code-bg` | `#0B0B10` | code blocks |
| `--code-ink` | `#E7E7F0` | code text |

No `--coral*`, no warm paper. Radius 0 (max 2px). **No box-shadows.**

### Type
- **Geist Sans** — display + body. **Geist Mono** — timestamps, tags, eyebrows, metadata, code. Inter / `system-ui` fallback. Self-host or Google Fonts with `preconnect` + `font-display:swap`.
- Scale: display `clamp(48px, 9vw, 120px)` / tracking `-0.03em` / line-height `0.95–1.0`; h2 `clamp(28px,4vw,44px)`; body `16px`/`1.6`; mono labels `12px` uppercase `0.08em`.
- Emphasis device: accent-colored word in display headline (replaces old italic-coral `<em>`).

### Grid & spacing
- Shell container `max-width: 1180px`, 24px gutters; 12-column grid (CSS `grid-template-columns: repeat(12, 1fr)`).
- Prose reading measure `680px`.
- Asymmetric Swiss placement: hero text spans cols 1–8 with a mono facts rail cols 9–12; work + feed align to the 12-col grid; feed uses a left meta rail (mono date+type) + content.
- Generous vertical rhythm (96–160px section padding desktop).

### Components / patterns
- **Status ticker** — top hairline strip, Geist Mono: `OPEN TO WORK · ELIZABETH, NJ · EST` + accent live dot.
- **Masthead** — `busqueneil` wordmark (tight grotesque) left; nav right `Work · Writing · Now · About`; accent **Hire** pill (→ `/help`). `aria-current` accent underline on active.
- **Feed row** — `grid-template-columns: 140px 1fr` (mono meta rail | content), 1px hairline divider, NO cards/shadows/radius; collapses to single column < 640px.
- **Work card** — numbered `01–06`, name, one-liner, mono stack, live link; hairline grid.
- **Footer** — Swiss multi-column: RSS / Resume / Email / LinkedIn / GitHub + mono colophon.
- **Motion** — IntersectionObserver fade+translate on section enter (respects `prefers-reduced-motion`); accent underline transitions; faint dot/line grid motif behind hero.
- **Focus** — 2px `--accent` outline, visible on all interactive elements.

---

## 4. Page-by-page

### `/` (SSR, `setPublicCache`)
1. **Hero** — display headline (build-in-public identity, e.g. "Everything I build, as I build it."), one-sentence subhead, primary CTA **Hire me** (→ `/help`) + secondary **See what I'm building** (↓ anchor), mono status line; right rail mono facts (role / location / stack). Grid motif bg.
2. **Selected Work** — `getFeed({type:'project'})` top 6, numbered grid. → `/projects`.
3. **Build-in-public feed** — `getFeed()` first 20 (all types interleaved) as hairline rows. → `/posts`.
4. **Now strip** — latest `now` post teaser → `/now`.
- JSON-LD: Person + ProfilePage + FAQPage + **WebSite/SearchAction** (new).

### `/posts` (SSR), `/posts/[slug]` (SSR)
- Archive = paginated hairline feed (`?page`, `?tag`; noindex when page>1 or tag). Canonical `https://busqueneil.com/posts`.
- Permalink = Swiss reading view: mono byline rail, 680px measure, indigo-tinted code, project meta block. Canonical `/posts/{slug}`, `ogType=article`, OG `/og/{slug}.png?v={updated_at}`. JSON-LD BlogPosting (status/article/now) or CreativeWork (project) with `author` @id → `#person`. **Add BreadcrumbList.**

### `/projects` (SSR), `/now/` (SSR, trailing slash), `/about` (prerender), `/404` (SSR, noindex)
- Re-skinned to grid; canonicals + trailing-slash conventions unchanged. About adds BreadcrumbList; entity facts corrected.

### `/admin`, `/admin/login` (SSR, noindex, no-store)
- Composer re-skinned to Swiss; create/edit/delete/upload logic unchanged.

---

## 5. SEO Plan (full)

### Continuity (no ranking loss)
- Identical URL shapes for `/`, `/about`, `/projects`, `/posts`, `/posts/{slug}`, `/now/`. Preserve trailing-slash conventions (`/now/`, funnels trailing; `/about`, `/projects`, `/posts` none) — `trailingSlash:'ignore'` retained.
- Keep `/hire` + `/hire/*` → `/` 301s. No slug changes (DB-driven slugs are the indexed long-tail).
- Stable Person `@id` `https://busqueneil.com/#person`.

### Endpoints (preserve + upgrade)
- `sitemap.xml` — **fix: add `/support/`**; keep per-post `<url>` + lastmod.
- `rss.xml` — unchanged contract; refresh channel meta.
- `llms.txt` — refresh STATIC_BIO (current positioning, NAP), keep recent-posts list + `text/plain`.
- `/og/[slug].png` + `/og.png` — unchanged.
- `robots.txt` — keep Allow `/`, Disallow `/admin`, Sitemap directive.

### Schema
- Keep Person / ProfilePage / FAQPage (home), BlogPosting / CreativeWork (posts).
- **Add:** `WebSite` + `SearchAction` (home), `BreadcrumbList` (inner pages).
- **Fix entity:** `jobTitle` "Director of Operations" is stale CGP-era → update to current positioning; expand `sameAs` (LinkedIn, GitHub). Consistent NAP across Schema / llms.txt / About / footer.

### Technical / CWV / GEO
- Lean JS (Preact islands only where needed — Composer); fonts `preconnect` + `swap`; explicit image `width`/`height` (no CLS); AA contrast (accent-ink for links); descriptive alt text; semantic heading order.
- GEO/AI-search: clean semantic HTML, refreshed llms.txt, FAQ + answer-style content, strong entity consistency.
- Internal linking: hero → work → posts → projects → now; post → related.

### Post-deploy audit
- Technical audit on the live build, JSON-LD validation, sitemap fetch check, OG unfurl check, Lighthouse/CWV pass, then re-submit sitemap.

---

## 6. Build Process

1. **Mockups:** 2–3 standalone Swiss homepage variants in `design/` (Geist + indigo), Puppeteer screenshots (desktop+mobile) → Neil picks/tweaks.
2. **Implement:** chosen direction across all real Astro pages on `redesign-swiss`. New `global.css` first, then layouts, then pages, then Composer.
3. **QA:** Puppeteer screenshot every page desktop+mobile; fix; verify no console errors; run `astro build` clean.
4. **SEO pass:** schema, sitemap fix, llms refresh, entity fix, CWV checks.
5. **Ship:** bump `package.json` 2.0.0 → 3.0.0; merge `redesign-swiss` → `main` → Vercel prod. Verify: feed renders, admin can post, **test lead → contact + deal in Orbit**, all SEO endpoints 200, OG image renders.

---

## 7. Risks & Mitigations
- **Breaking live lead capture** → funnels + lead JS + vercel.json rewrites frozen; explicit Orbit E2E test before/after cutover.
- **OG image regression on Vercel** → keep `vite.ssr.external` + base64 fonts; verify `/og/[slug].png` post-deploy.
- **SEO ranking dip from URL/canonical drift** → URL inventory frozen; canonicals + 301s preserved; sitemap re-submitted.
- **Accent contrast** → dual-accent (`--accent` display / `--accent-ink` body links) to hold AA.
- **Font load CLS/perf** → preconnect + `font-display:swap` + fallback metrics.
- **Deploy = merge to main** → all work on `redesign-swiss`; mockup screenshots reviewed before merge.

## 8. Success Criteria
- Visually premium Swiss-grid light-mode site shipped to busqueneil.com.
- Homepage leads hero → work → feed → now.
- Feed, /posts, /projects, /now, /about, /posts/[slug] all functional and re-skinned.
- Admin posting works; a test lead lands in Orbit.
- Every prior indexable URL still 200s with correct canonical; sitemap/rss/llms/OG all valid; schema validates; no CWV regressions.
