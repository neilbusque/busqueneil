# Design contract — busqueneil.com v12 "Quiet"

**Target artifact:** the live site busqueneil.com (Astro SSR). Visual pass only, no copy or IA changes.
**Audience:** hiring managers evaluating Neil for W2 roles, and small-team founders buying web apps / sites / funnels / automation.
**Requested by:** Neil, 2026-07-25 — "remove the grid lines because it looks distracting", "I want my site to look how vercel site's look and feel", "but still keep the yellow".

## Evidence

| Evidence | Source | Confidence |
|---|---|---|
| Remove the background grid | Neil, verbatim | provided |
| vercel.com is the target feel | Neil, verbatim | provided |
| Sun-yellow `#FFE45C` must survive | Neil, verbatim | provided |
| Current tokens, grid substrate, type scale | read from `src/styles/v8.css` | observed |
| Geist + Geist Mono already load on the site | `document.fonts.check` against production | observed |
| Vercel uses near-black on white, ~6px button radius, hairline borders, no card shadows, sentence case, Geist | general knowledge of vercel.com | **inferred** — not re-verified against the live site this session |
| Neil wants the *bold editorial* voice retired | — | **inferred** from "look and feel", not stated. Flagged to him. |

## Keep / Change / Do not copy

| | |
|---|---|
| **Keep** (from Vercel) | Near-monochrome neutral palette; one accent used sparingly; small radii; hairline borders; flat surfaces; sentence case; tight negative tracking; generous whitespace; fast small motion |
| **Change** (to Neil's) | Accent is sun-yellow `#FFE45C`, not Vercel blue. Ribbon N mark, rail navigation, copy, IA, and content all stay Neil's. Case-study pages keep their Fraunces editorial H1 as a deliberate exception |
| **Do not copy** | Vercel's logo, triangle mark, wordmark, product screenshots, copy, pricing, component library, or any literal page layout. This borrows a visual *stance*, not assets |

## Stance

One family (Geist), one accent (sun-yellow, small), neutral near-black on pure white, hairline
structure, 8px cards and 6px buttons with no shadows, and nothing decorative on the ground. The
page should feel engineered and quiet, carrying its confidence in spacing rather than in weight.

## Risks and unknowns

1. **This retires the Ribbon N bold voice.** Archivo 900 uppercase display is what currently makes
   the site feel like Neil's rather than like any clean SaaS site. Vercel's feel is deliberately
   anonymous. Neil should confirm he wants that trade — it is reversible in one commit.
2. **Vercel specifics are from memory**, not a fresh audit of vercel.com this session.
3. `--soft` moves `#6E6860` → `#737373`; must stay ≥4.5:1 on white (it carries labels and form
   notes). `#737373` measures 4.61:1. Verify after the change, do not assume.
4. The `.mark-hl` yellow underline sits behind sentence-case Geist rather than heavy Archivo caps;
   the `.30em` height may need reducing so it does not overpower lighter type.

## Quality gate

- [ ] No `repeating-linear-gradient` anywhere in the stylesheet
- [ ] No `text-transform: uppercase` on h1/h2/h3
- [ ] No `box-shadow` on `.v8-card` at rest
- [ ] No button at `border-radius: 999px`
- [ ] `--sun` still `#FFE45C` and still visible on the home page
- [ ] `--soft` contrast ≥4.5:1 on `#FFFFFF`, measured not assumed
- [ ] Zero horizontal overflow at 390px and 1440px across all 36 pages
- [ ] Exactly one h1 per page, unchanged from before
