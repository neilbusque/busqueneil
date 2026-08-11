# 50 content pieces — AI, marketing, AI engineer

Goal: earn citations in AI answers (ChatGPT, Perplexity, AI Overviews, Gemini) and rank in
Google for terms the current 96 URLs do not touch.

Decided 2026-08-11 with Neil: **deep hand-written pages, not programmatic.** The `/software`
programmatic layer works because those are long-tail terms with little editorial competition.
These 50 target competitive editorial terms, where templated pages lose and can drag sitewide
quality.

## Why this mix

Citation share by format, from the Princeton GEO study (KDD 2024) and observed AI citation
patterns:

| Format | Share of AI citations | Neil has today |
|---|---:|---:|
| Comparison articles | ~33% | 3 |
| Definitive guides | ~15% | 9 |
| Original research / data | ~12% | **0** |
| Best-of / listicles | ~10% | 0 |

Two findings drive the allocation:

1. **Comparisons are the highest-citation format and Neil's thinnest coverage.** 22 pieces.
2. **Original data carries a +37-40% citation lift and cannot be copied by competitors.**
   Neil already owns the datasets and has published none of them. 12 pieces.

The third lane, AI × marketing, is the positioning bet: a marketing operator who is also a
shipping AI engineer is a rare combination, and almost nobody credibly occupies it. 16 pieces.

Neil dropped the "AI engineer role + hiring" lane; those 8 were redistributed.

## Information architecture

New clusters, each with a hub page carrying `ItemList` schema, all linked from `/resources`
and listed in `sitemap.xml` and `llms.txt`:

| Cluster | Count | URL | Rationale |
|---|---:|---|---|
| Comparisons | 22 | `/compare/*` | Distinct intent signal; own hub; matches "X vs Y" queries |
| AI × marketing | 16 | `/guides/*` | Joins the existing 9 guides, which already rank |
| Original research | 12 | `/research/*` | "Research" is a citation-attracting signal in itself |

Existing comparison pages stay where they are so their rankings are untouched
(`/guides/n8n-vs-zapier-vs-make`, `/software/ai-phone-agent-vs-answering-service`,
`/software/lovable-replit-vs-hiring-a-builder`), and are cross-linked from the new hub.

## Per-page spec

Every piece, no exceptions:

- **Opens with a 40-60 word extractable answer** in bold. This is the passage an LLM lifts.
- **1,200-2,000 words.** Long enough to answer the whole decision, short enough to stay dense.
- **Real numbers from Neil's own work.** No generic advice that any summary could carry.
- **A comparison table** wherever two or more options are weighed. Tables beat prose for
  extraction.
- **3-5 FAQs** in natural question phrasing, with `FAQPage` schema.
- **`TechArticle` schema** + `BreadcrumbList` + author attribution + `dateModified`.
- **Generated OG image** via the existing `/og/guides/[slug].png` route pattern.
- **Internal links** to the relevant `/services/*`, `/work`, and sibling pieces.
- **Sources cited with links** for any claim that is not Neil's own measurement. Citing
  sources is the single highest-ranked GEO tactic (+40%).

Hard rules, carried from the rest of the site:

- **Never fabricate a case study, testimonial, client name, or metric.** Real-work claims are
  limited to what is true: the roofing voice agent, the contractor AIA-billing app, portals,
  CRMs, 40+ builds, and the datasets listed below.
- **No keyword stuffing.** It measurably *reduces* AI visibility by ~10%.
- Where Neil has not used a tool first-hand, the piece says so and compares on documented
  behaviour instead of inventing experience.

---

## Lane 1 — Comparisons (22) → `/compare/*`

Every one of these is a tool Neil actually runs, which is the whole point: a first-hand
comparison is the version that gets cited.

| # | Slug | Target query | First-hand basis |
|---|---|---|---|
| 1 | `claude-code-vs-cursor` | claude code vs cursor | Daily driver; ships all Neil's apps |
| 2 | `mcp-vs-function-calling` | mcp vs function calling | Built 59-tool Magus + Orbit MCP servers |
| 3 | `supabase-vs-firebase` | supabase vs firebase | Supabase backs ~10 shipped products |
| 4 | `vercel-vs-railway` | vercel vs railway | Both in production |
| 5 | `astro-vs-nextjs` | astro vs next.js | This site is Astro; AgencyOS is Next |
| 6 | `lovable-vs-replit-vs-bolt` | lovable vs replit vs bolt | Head-to-head; complements existing page |
| 7 | `openrouter-vs-direct-api` | openrouter vs openai api | Runs both across 5 models |
| 8 | `resend-vs-mailgun` | resend vs mailgun | **Migrated Orbit from Resend to Mailgun** |
| 9 | `gohighlevel-vs-hubspot` | gohighlevel vs hubspot | Client work in both |
| 10 | `ai-sdr-vs-hiring-an-sdr` | ai sdr vs human sdr | Built Ace, a working sales agent |
| 11 | `custom-crm-vs-gohighlevel` | custom crm vs gohighlevel | Built Orbit after using GHL |
| 12 | `claude-vs-gpt-for-coding` | claude vs gpt for coding | Both daily, across real repos |
| 13 | `firecrawl-vs-apify-vs-puppeteer` | firecrawl vs apify | All three in the scraping stack |
| 14 | `rls-vs-app-layer-auth` | row level security vs application auth | Shipped RLS on multiple products |
| 15 | `supabase-functions-vs-vercel-functions` | supabase edge functions vs vercel | 98 edge fns on Orbit alone |
| 16 | `ai-phone-agent-vs-chatbot-vs-live-chat` | ai phone agent vs chatbot | Shipped a roofing voice agent |
| 17 | `zapier-ai-vs-n8n-ai-agents` | zapier ai vs n8n ai agent | 20+ workflows across both |
| 18 | `twilio-vs-whatsapp-business-api` | twilio vs whatsapp api | Both wired into live products |
| 19 | `stripe-checkout-vs-payment-links` | stripe checkout vs payment links | Live Stripe billing |
| 20 | `shopify-vs-custom-ecommerce` | shopify vs custom store | Client builds on both |
| 21 | `wordpress-vs-astro` | wordpress vs astro | Migrated sites off WordPress |
| 22 | `n8n-vs-make-deep-dive` | n8n vs make | Deeper cut than the existing 3-way |

## Lane 2 — AI × marketing (16) → `/guides/*`

| # | Slug | Target query | First-hand basis |
|---|---|---|---|
| 23 | `ai-for-seo` | how to use ai for seo | Built the 58-page `/software` layer |
| 24 | `programmatic-seo-with-ai` | programmatic seo ai | **Same 58 pages, with the real method** |
| 25 | `cold-email-ai-that-doesnt-sound-ai` | ai cold email | Relay/Magus outbound system |
| 26 | `ai-lead-enrichment` | ai lead enrichment | 254-contact pipeline, incl. failure modes |
| 27 | `build-an-ai-sdr` | how to build an ai sdr | Ace, shipped and live |
| 28 | `ai-competitor-research` | ai competitor research | 866-ad sweep |
| 29 | `ai-ad-creative-workflow` | ai ad creative | Meta ads + Remotion pipeline |
| 30 | `ai-landing-page-copy` | ai landing page copy | Multiple shipped funnels |
| 31 | `ai-content-that-ranks` | ai content seo | What survived vs what got ignored |
| 32 | `automate-your-crm-with-ai` | ai crm automation | Orbit's 8 AI-backed edge functions |
| 33 | `ai-voice-agents-for-follow-up` | ai voice agent lead follow up | Roofing voice agent |
| 34 | `geo-for-local-business` | geo local business | Extends the existing GEO guide |
| 35 | `ai-for-social-content` | ai social media content | Viral bank + Zernio |
| 36 | `measure-ai-impact-on-marketing` | measure ai marketing roi | Sonar attribution work |
| 37 | `ai-marketing-stack-small-team` | ai marketing stack | The actual stack Neil runs |
| 38 | `prompt-engineering-for-marketers` | prompt engineering marketing | Daily production use |

## Lane 3 — Original research (12) → `/research/*`

**This is the lane no competitor can copy.** Every piece below is backed by a dataset already
on disk. Sources verified 2026-08-11.

Datasets:
- `NeilOS/research/custom-software-competitors/` — 909 files. 866 ads, 30 competitors,
  screened from 585 advertisers. `REPORT.md` already carries the analysis.
- `NeilOS/content/viral-bank/` — 160 files. 19 winners / 33.1M plays, hooks, formats,
  TikTok, carousels, LinkedIn, YouTube.
- Contact enrichment: 254 people at 100 companies, with measured error rates.
- Sonar: cookieless analytics across 20 live sites.

| # | Slug | The finding | Source |
|---|---|---|---|
| 39 | `866-custom-software-ads` | Flagship: the whole market teardown, three tiers | REPORT.md |
| 40 | `only-3-of-30-publish-a-price` | Pricing opacity is near-universal; the cheapest differentiator | §3 |
| 41 | `guarantees-in-the-ad-library` | Only 4 of 30 offer one, and 3 of those 4 are long-runners | §4 |
| 42 | `ad-longevity-as-a-conversion-proxy` | A 564-day ad on one creative; longevity ≈ public conversion signal | §6 |
| 43 | `the-vibe-coding-wall` | 80 ad variants in two weeks around one insight | STANDOUT.md |
| 44 | `10-hook-patterns-33m-plays` | The 10 patterns behind 19 posts and 33.1M plays | HOOKS.md |
| 45 | `tiktok-vs-instagram-physics` | Shares are the lever; duration is bimodal; dead middle | TIKTOK.md |
| 46 | `carousels-are-depth-not-reach` | 10-40k likes vs 1-13M views, but comments *match* reels | CAROUSELS.md |
| 47 | `44-percent-of-ai-enriched-contacts-are-wrong` | Platform collision + brand collision, with the fix | enrichment run |
| 48 | `40-products-in-a-year` | What scope actually survived contact with users | build history |
| 49 | `what-20-sites-taught-me-about-traffic` | Cookieless analytics across the portfolio | Sonar |
| 50 | `the-false-zero-machine` | Ad-library search ranks the wrong page first; how to detect it | measured trap |

Pieces 39-43 double as sales assets for `offer.busqueneil.com` and `ai.busqueneil.com`.
Pieces 44-46 double as proof for content work.

---

## Progress

| Lane | Live | Total |
|---|---:|---:|
| Research | 10 | 12 |
| Comparisons | 13 | 22 |
| AI × marketing | 14 | 16 |
| **Total** | **37** | **50** |

`src/layouts/ContentArticle.astro` carries the schema, breadcrumb and header for every piece,
so an article file is frontmatter plus prose. It throws at build time if the slug is missing
from `content-index.ts` or is not `live: true`, which is what stops a page shipping without a
sitemap entry. The three pilots predate it and still inline their own schema — worth migrating
when one of them next needs an edit, not before.

**Cut, not deferred:** `what-20-sites-taught-me-about-traffic`. Sonar holds ~2 days of usable
history and 136 visitors across 27 sites. That cannot carry a sentence like "a year of
analytics across 20 sites". Revisit after several months of data.

**Still to write in research:** only `40-products-in-a-year`, which needs a real scope-decision
inventory from Neil before it is anything more than an essay.

## Build order

1. **IA first** — `/compare` and `/research` hubs, wired into `/resources`, `sitemap.xml`,
   `llms.txt`. Without this the pieces are orphans and orphans do not get crawled well.
2. **Pilot 3**, one per lane, for Neil to review before the format is locked in 50 places.
3. **Batches of 8-10**, research lane first (highest differentiation, and the datasets are
   already written up, so they are the fastest to draft honestly).

## Not doing

- No fabricated stats, clients, or testimonials.
- No `llms.txt` tricks or "AI schema" — Google states plainly that neither affects ranking.
- No near-duplicate pages for keyword variants. One strong page per decision.
