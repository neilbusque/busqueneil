# v12 "Quiet" — busqueneil.com design direction

Reference: vercel.com. Scope: the `.v8` system in `src/styles/v8.css` + `src/styles/global.css`.

## 1. Visual Theme & Atmosphere

Quiet, neutral, engineered. The page is a white sheet with hairline structure and nothing
decorative on it. Confidence comes from spacing and restraint, not from weight, texture, or
ornament. Content sits on the ground rather than on stacked cards with shadows.

The outgoing v11 "Blueprint" direction was the opposite: warm paper, an 88px grid substrate,
heavy Archivo 900 uppercase display type. All three are removed. **This is a real tradeoff and
it is deliberate** — the bold editorial voice is what is being traded for the Vercel feel.

## 2. Color

Near-monochrome plus exactly one accent.

| Token | v11 | v12 | Note |
|---|---|---|---|
| `--paper` / `--surface` | `#FFFFFF` | `#FFFFFF` | unchanged |
| `--ink` | `#16150F` (warm) | `#0A0A0A` | neutral, near-black |
| `--muted` | `#605A51` (warm) | `#525252` | neutral |
| `--soft` | `#6E6860` | `#737373` | 4.6:1 on white, still AA |
| `--hair` | `#E9E7E2` (warm) | `#EAEAEA` | neutral hairline |
| `--hair-strong` | `#D8D5CE` | `#D4D4D4` | |
| `--sun` | `#FFE45C` | `#FFE45C` | **kept, unchanged** |

The warm cast is the main thing leaving. Vercel's neutrals are grey, not beige; warm hairlines
read as dirty next to pure white.

**Yellow rules.** The accent stays but stays *small*: the `.mark-hl` underline, the active-nav
dot, focus rings, and the dark CTA panel's primary button. Yellow is never a large fill and
never a section background. One yellow moment per viewport, maximum.

## 3. Typography

**One family: Geist.** It is Vercel's typeface, it is already loaded on the site, and using it
for both display and body is precisely how vercel.com reads. Geist Mono for code and labels.

- Display / H1: Geist 600, `clamp(32px, 4.2vw, 56px)`, tracking `-0.035em`, **sentence case**.
- Section H2: Geist 600, `clamp(22px, 2.4vw, 30px)`, tracking `-0.028em`, sentence case.
- H3: Geist 600, 18px.
- Body: Geist 400/450, 15-16px UI, 17px prose. Line height 1.6.
- Eyebrow: Geist Mono 11px, `0.08em` tracking, **sentence or lower case — not `.22em` caps**.

Retired: Archivo 900 uppercase display, Fraunces serif headings, the `.22em` letter-spaced
small-caps eyebrow. Fraunces survives only in `.script` / `.hand` decorative spots and the
case-study display H1, which is an intentional editorial exception.

## 4. Spacing & Grid

- **The `.v8.shell::before` grid substrate is deleted.** No background texture of any kind.
- Section rhythm `--gap-sec`: 96px → **80px** desktop, 56px mobile.
- Content max-width ~1100px, generous gutters.
- 8px base scale. Card padding 20-24px, not 26-40px.

## 5. Layout & Composition

Left-aligned, single column, generous vertical air. Sections separated by whitespace and a
single hairline rule rather than by boxes. Cards used only where the content is genuinely a
discrete item (service offers, work items) — not as a wrapper for prose.

## 6. Components

- **Radius:** `--r` 14px → **8px**. Buttons **6px, not pills.** This is the single most
  Vercel-identifying component change after typography.
- **Primary button:** `#0A0A0A` fill, white text, 6px radius, no shadow, `:hover` lightens to
  `#383838`.
- **Secondary button:** white fill, 1px `--hair` border, ink text, `:hover` border `--hair-strong`.
- **Cards:** 1px `--hair` border, 8px radius, **no shadow**, `:hover` border darkens only. No
  lift, no `translateY`.
- **Nav rail:** flat, hairline border, 8px radius items. Active item = subtle grey fill + yellow dot.

## 7. Motion & Interaction

Fast and small. 120-160ms, ease-out. Opacity and border-color only. Keep the existing
IntersectionObserver reveal but reduce travel from `y: 26` to `y: 8`. No transform lifts on
hover, no scale, no bouncing easing curves.

## 8. Voice & Brand

Copy is unchanged — this is a visual pass only. The Ribbon N mark stays. The brand keeps its
yellow; it loses its shout. Plain, specific, first-person sentences already match the quiet
direction better than the uppercase treatment did.

## 9. Anti-patterns

Exact things that fail review:

- Any `repeating-linear-gradient` background grid, dot grid, or paper texture.
- `text-transform: uppercase` on any H1, H2, or H3.
- Archivo or Fraunces on a section heading.
- `border-radius: 999px` on a button. Pills are for chips/tags only.
- `box-shadow` on a card at rest.
- `translateY` on card hover.
- Yellow as a section background, a large block fill, or behind body text.
- Warm greys (`#E9E7E2`, `#605A51`) — neutral only.
- Letter-spacing above `0.1em` on anything except Geist Mono labels.
