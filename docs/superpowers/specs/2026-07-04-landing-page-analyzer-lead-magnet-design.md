# Free Landing Page Analyzer — Lead Magnet (design)

**Date:** 2026-07-04
**Repo:** `busqueneil` (busqueneil.com brand site — Astro 5, `output: 'server'`, `@astrojs/vercel`)
**Status:** Approved design, ready for implementation plan.

## 1. Summary

A public, no-login lead magnet at **`busqueneil.com/analyzer`**. A visitor enters their
website URL, gets an instant free teaser (an overall score plus four headline metrics),
and hands over their best email to unlock the full breakdown, which is generated as a
branded PDF and emailed to them automatically. The PDF closes with who Neil is, how he
can help, and a "Message me on WhatsApp" call to action.

A site-wide **exit-intent popup** promotes the analyzer: when a visitor on busqueneil.com
moves to leave, a modal offers the free analysis with an inline URL field that deep-links
into `/analyzer` and starts the scan automatically (see §13).

It is a fork of the analyzer engine inside **Preflight** (local project `funnel-sim` at
`context/deliverables/neil/funnel-sim/`), stripped to a single purpose (landing pages
only), with the Supabase JWT gate removed and abuse protection added because the endpoints
are now public.

## 2. Goals / non-goals

**Goals**
- Capture qualified leads (people who own a page and care about conversion) into Orbit CRM.
- Deliver genuine value up front: real Lighthouse page-speed + a real CRO teardown.
- Feel instant and free at the teaser step; spend AI money only after an email is given.
- Match the busqueneil.com "Electric Glow" visual system so it reads as part of the site.

**Non-goals (YAGNI)**
- No accounts, login, or saved history.
- No funnel-graph analysis, no in-app "apply fix", no dashboard.
- No screenshot/image analysis, no ad/email/opt-in scopes — landing pages only.
- No second CRM. Orbit is the lead store; Supabase holds only an operational log row.

## 3. User flow

0. *(optional entry)* An exit-intent popup elsewhere on the site deep-links to
   `/analyzer?url=<their-url>`, which prefills the field and auto-starts step 2 (see §13).
1. `/analyzer` — hero + a single URL input ("Analyze my landing page").
2. On submit → **"Analyzing…"** (~5s). Server scrapes the page and runs Google
   PageSpeed Insights (mobile). No AI, no cost.
3. **Teaser card** renders, free and instant:
   - **Overall score `XX/100`** (large, with a letter grade A–F).
   - **Page Speed** — real Lighthouse mobile performance score.
   - **Mobile** — viewport + tap-target / font-size / content-width pass/fail.
   - **Conversion Elements** — `N/9` present, with the checklist visible.
   - **Summary** — one to two sentences naming the single biggest gap (deterministic,
     see §5). No findings, no rewrites — those are the locked payload.
4. **Email gate** below the teaser: "Unlock the full breakdown and the exact fixes.
   Where should I send your report?" → one email field + button + hidden honeypot field.
5. On submit → immediate ack: **"On its way to your inbox 📬."** In the background the
   full AI teardown runs, a PDF is rendered, and it is emailed as an attachment.
6. Email arrives from Neil (Resend, busqueneil.com domain) with the PDF attached and a
   short human note. The PDF's final page is Neil's intro + WhatsApp CTA.

## 4. Architecture

All code lives inside the existing `busqueneil` Astro repo. Astro is `output: 'server'`
on Vercel, so API routes under `src/pages/api/` are Node serverless functions — a direct
home for the ported Preflight functions (which are already written as Node serverless
handlers).

### 4.1 Endpoints

| Route | Method | Purpose | Auth | Cost |
|---|---|---|---|---|
| `/api/analyzer/scan` | POST | Scrape + PSI → `PageAudit` + deterministic score + templated summary. Returns a signed `scanToken` (see §7) carrying the audit so `deliver` need not re-scrape. | Public, IP rate-limited | Free |
| `/api/analyzer/deliver` | POST | Body: `{ email, url, scanToken, hp }`. Validates, upserts lead → Orbit, writes log row, **acks immediately**, then runs AI → PDF → Resend via `waitUntil`. | Public, honeypot + per-email/day cap | AI $ here only |

### 4.2 Ported code (from `funnel-sim`)

Reused as-is or lightly adapted — these files are already import-free / serverless-safe:
- `src/lib/scrapeExtract.ts` → page extraction + `AuditSignals` (regex, no DOM).
- `src/lib/psiParse.ts` → `parsePsi()` for PSI v5 mobile results.
- From `src/lib/analyzer.ts`: `buildPageAudit`, `heuristicSpeedScore`, `conversionItems`,
  `validateReport`, `gradeForScore`, and the `PageAudit` / `AnalysisReport` types.
- From `api/ai.ts`: the `ANALYZER_PROMPT` (benchmark knowledge base) and the OpenRouter
  call + JSON-retry wrapper. Scope is hard-coded to `landing`.

Key change vs the original: **remove the Supabase JWT check** from `scrape`/`pagespeed`/`ai`.
Replace it with the abuse protection in §7. Auth is no longer the gate; the email is.

### 4.3 Front end

One Preact island (`src/components/Analyzer.tsx` or similar) rendered by
`src/pages/analyzer.astro`, styled with the site's existing Electric Glow tokens
(near-black background, violet→magenta gradient accents, Inter + JetBrains Mono).
States: idle → scanning → teaser+gate → submitting → sent → (error variants with a
"just reply to my email" fallback line).

`/analyzer` reads a `?url=` query param: if present and valid, prefill the field and
auto-fire the scan (drives the exit-intent deep-link and any future share links).

A second, tiny island (`src/components/ExitIntentAnalyzer.tsx`) mounts site-wide from the
base layout for the popup (§13).

### 4.4 Data flow

```
URL ─▶ /api/analyzer/scan ─▶ scrape + PSI (parallel)
                          ─▶ buildPageAudit ─▶ deterministic score + summary
                          ─▶ { audit, score, grade, summary, scanToken }
        (teaser renders; no AI)

email ─▶ /api/analyzer/deliver ─▶ verify scanToken + honeypot + caps
                               ─▶ upsert Orbit contact + log row  ─▶ ACK 200
              (waitUntil) ────▶ AI analyze(audit + pageText) ─▶ validateReport
                               ─▶ render PDF (@react-pdf/renderer)
                               ─▶ Resend send with PDF attachment
```

## 5. Deterministic teaser score

Computed with no AI so the teaser is instant, free, and identical to the PDF headline.

- `speedScore` = `audit.speed.score` (0–100; PSI performance, or heuristic fallback).
- `mobileScore` = viewport + responsive audits:
  - no viewport meta → `30`
  - viewport present, a tap-target/font/width audit fails → `70`
  - viewport present, all pass (or no PSI audits available) → `100`
- `conversionScore` = `round(presentCount / 9 * 100)`.
- **`overall = round(0.30·speedScore + 0.20·mobileScore + 0.50·conversionScore)`**,
  clamped 0–100. Grade via existing `gradeForScore`. *(Weights live in one constant, tunable.)*

**Templated summary:** pick the lowest of the three dimensions and the top 1–2 missing
conversion elements; produce one or two sentences, e.g.
> "Scoring 58/100. Biggest gap: no lead-capture form, and your main CTA sits below the
> fold. Page speed is solid at 82."

The AI report's `overallScore` is **not** shown as the headline — the PDF headline is
anchored to this deterministic composite so teaser and PDF never disagree. AI supplies
`verdict`, per-section scores, `findings`, `quickWins`, and `benchmarks` for the PDF body.

## 6. The PDF

Rendered server-side with **`@react-pdf/renderer`** (pure JS, no headless browser, safe in
a Vercel Node function; server-only dependency, does not touch the Preact front end).

Content, branded to Electric Glow:
1. **Cover** — analyzed URL, big score + grade, date.
2. **Metrics** — the four teaser metrics with the conversion-element checklist.
3. **Verdict** — the AI `verdict` paragraph.
4. **Findings** — section by section (Hook & headline, Offer & CTA, Proof & trust,
   Form & friction, Speed & mobile, Structure & flow), each finding shows issue → why
   (benchmark-cited) → the **actual rewrite copy** in `fix`.
5. **Quick wins** — the 2–4 highest-leverage items.
6. **Benchmarks** — table, only if present.
7. **"Who I am / how I can help"** — Neil's bio and capability list (lifted from the
   on-site agent copy in `src/pages/api/agent.ts`), then a **Message me on WhatsApp**
   button (`https://api.whatsapp.com/send/?phone=9083164140`), plus LinkedIn
   (`linkedin.com/in/neilbusque`) and `busqueneil@gmail.com`.

Copy rules apply throughout (no em dashes, specific numbers, plain language) — already
enforced by `ANALYZER_PROMPT`.

## 7. Abuse & cost protection

The endpoints are public, so:
- **`/scan`**: per-IP rate limit (e.g. 10 / hour, tunable). Validate URL is http(s).
  Cheap ops only.
- **`scanToken`**: a short-lived HMAC-signed token (server secret) embedding the audit +
  url + issued-at, so `deliver` trusts the audit without re-scraping and a caller can't
  fabricate a fake audit. TTL ~30 min.
- **`/deliver`**: honeypot field (bots that fill it are silently dropped), per-email/day
  send cap, per-IP cap. AI + PDF + email fire **only** after this passes — no AI spend on
  anonymous teaser traffic.
- Reuse the spirit of Preflight's daily cap idea for a global/day ceiling on AI runs as a
  cost backstop.

## 8. Timeout handling

`/deliver` acks in <1s, then does AI (10–40s) + PDF + send in the background. Approach:
- Set the route's `maxDuration` high enough (target ≤ 60s to stay within Vercel plan
  limits) and use `waitUntil` (from `@vercel/functions`) so the heavy work runs after the
  response is sent.
- Keep the AI within budget: `landing` scope only, `max_tokens` ~4–6k, a snappy model via
  `OPENROUTER_MODEL`. If a run exceeds budget, the email step is retried/logged; the lead
  is already saved so nothing is lost.

## 9. Dependencies to confirm (potential blockers)

1. **Resend** — `RESEND_API_KEY` present on the busqueneil Vercel project **and**
   busqueneil.com verified as a sending domain (SPF/DKIM/DMARC). Required to send the PDF.
   *(The site already lists Resend as a tool; confirm the key + domain during build.)*
2. **Orbit server-to-server API** — the Orbit MCP is not callable from a deployed
   function. Need Orbit's REST base URL + an API token for a contact upsert. Investigate
   the Orbit codebase during build; **fallback** if none exists: skip Orbit and
   email-notify Neil instead (and still store the Supabase log row).
3. **PSI API key** (optional) — keyless PSI works but is rate-limited; a
   `PAGESPEED_API_KEY` from the `gws-hatchos` GCP project raises headroom.
4. **OpenRouter** — reuse the existing `OPENROUTER_API_KEY` / `OPENROUTER_MODEL` already
   in the busqueneil env.

## 10. Environment variables (busqueneil Vercel project)

| Var | Use | Status |
|---|---|---|
| `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` | AI teardown | already present |
| `RESEND_API_KEY` | send PDF email | confirm |
| `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` | log row | already present |
| `SUPABASE_SERVICE_ROLE_KEY` | server insert into log table (bypass RLS) | confirm |
| `ANALYZER_TOKEN_SECRET` | HMAC for `scanToken` | new |
| `PAGESPEED_API_KEY` | PSI headroom | optional |
| `ORBIT_API_URL`, `ORBIT_API_TOKEN` | lead upsert | pending investigation |

## 11. Data model (Supabase, operational log only)

```sql
create table public.analyzer_leads (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  url         text not null,
  score       int  not null,
  grade       text not null,
  delivered   boolean not null default false,
  created_at  timestamptz not null default now()
);
-- Server-side inserts via service role; no anon access.
alter table public.analyzer_leads enable row level security;
```
Used for idempotency (dedupe repeat emails), a delivered flag, and a record of demand.
Not a CRM — Orbit is the CRM.

## 12. Testing

- **Unit (vitest, port existing tests):** `scrapeExtract` signal extraction, `parsePsi`,
  `buildPageAudit`, `validateReport`, plus new tests for the deterministic score formula
  and the templated summary generator.
- **Integration:** `/scan` against a couple of known URLs (a strong page and a weak one);
  assert score bands and the four metrics.
- **End-to-end (manual, before ship):** real URL → teaser → real email → confirm PDF
  arrives with the attachment, the score in the PDF matches the teaser, and the WhatsApp
  CTA + bio render. Confirm the Orbit contact appears (or the notify-Neil fallback fires).
- **Abuse:** honeypot drops a bot submission; rate limit returns 429; a tampered
  `scanToken` is rejected.
- **Exit-intent popup:** fires once on desktop `mouseout` past the top edge; does not fire
  on `/analyzer`; suppressed within 7 days of a dismiss and after conversion; submitting
  the inline field lands on `/analyzer?url=` and auto-scans.

## 13. Exit-intent popup (site-wide)

A modal that promotes the analyzer when a visitor is about to leave busqueneil.com.

**Placement:** a small client-only Preact island mounted from the shared base layout, so
it is available on every page. Renders nothing until triggered.

**Trigger**
- **Desktop:** `mouseout` where `e.clientY <= 0` (cursor leaves toward the tab bar/URL).
- **Mobile / touch (no real exit-intent):** fallback = fast scroll-up after the visitor
  has scrolled past ~40% of the page, OR a dwell fallback (e.g. 25s on page). One trigger
  arms the modal; whichever fires first wins.

**Frequency & suppression rules** (localStorage-backed)
- Show at most **once per visitor per 7 days**; never re-show in the same session after a
  dismiss.
- **Never** show on `/analyzer` itself.
- Suppress if the visitor has already run the analyzer or already opted in (a
  `analyzer_converted` flag set by the analyzer page).
- Suppress for obvious bots / when `navigator.webdriver` is true.

**Content**
- Headline: hook-first, no em dashes, e.g. "Before you go, how does your page score?"
- Subline: one line of value ("Free instant grade on speed, mobile, and conversion. No
  signup to see your score.").
- **Inline URL field + button.** On submit, redirect to `/analyzer?url=<encoded url>` so
  the analyzer prefills and auto-scans (one fewer step than a plain link). If the field is
  left empty, the button still links to `/analyzer`.
- Small dismiss ("X" / "no thanks"), Escape-to-close, click-outside-to-close.
- Styled to Electric Glow; respects `prefers-reduced-motion` for the entrance.

**Analytics (light):** fire the site's existing event mechanism (if any) on shown /
dismissed / submitted so conversion can be judged later. No new tracking dependency.

**Non-goals for the popup:** no email capture in the popup itself (email is captured on
the analyzer page after the teaser); no A/B testing framework; no server state — purely
client-side gating.

## 14. Open items resolved during design

- Engine: Google PSI + HTML heuristics + AI teardown. ✔
- Gating: instant deterministic teaser, AI only after email. ✔
- Lead destination: Orbit CRM (Supabase log row is operational only). ✔
- PDF CTA: "Message me on WhatsApp" (busqueneil.com pattern). ✔
- Location: route `/analyzer` on busqueneil.com. ✔
- PDF method: `@react-pdf/renderer`. ✔
- Exit-intent popup: site-wide, inline URL field, deep-links to `/analyzer?url=`. ✔

## 15. Small choices to confirm on spec review

- Popup content: inline URL field + auto-scan (recommended) vs a plain link/button.
- Popup scope: every page (recommended) vs homepage only.
- Popup frequency: once per 7 days per visitor (recommended).
