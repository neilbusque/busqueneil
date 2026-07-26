# Implementation handoff — v12 "Quiet"

## Read first
- `docs/design/v12-vercel/DESIGN.md` (binding)
- `src/styles/v8.css` (tokens at `.v8`, line ~10; grid substrate at `.v8.shell::before`, line ~27)
- `src/styles/global.css` (`.page-head h1` ~line 200, `.prose h2/h3` ~line 328)

## Binding changes
1. **Delete `.v8.shell::before`** entirely (the 88px grid). Keep the `z-index: 1` rule on
   `.shell-main`/`.shell-rail`/`.shell-strip`/`.shell-tabbar` — harmless and still correct.
2. **Tokens:** `--ink #0A0A0A`, `--muted #525252`, `--soft #737373`, `--hair #EAEAEA`,
   `--hair-strong #D4D4D4`, `--r 8px`, `--gap-sec 80px`. Leave `--sun`/`--sun-deep` alone.
   Delete `--grid`, `--grid-strong`, `--mod`.
3. **Type:** `.v8 h1,h2,h3` and `.sec` → `'Geist', 'Inter', system-ui`; weight 600; **drop
   `text-transform: uppercase`**; tracking `-0.03em`. `.page-head h1` and `.prose h2/h3` → Geist 600.
   `.eyebrow` → Geist Mono 11px, tracking `0.08em`, drop uppercase and the `.22em`.
4. **Buttons:** `.btn-sun` and `.btn-ghost` → `border-radius: 6px`, remove `box-shadow`.
   `.btn-sun` hover `#383838`. Chips keep `999px`.
5. **Cards:** `.v8-card` → `border-radius: 8px`, remove `box-shadow`. Remove `translateY` from
   `.offer-card:hover` / `.svc-card:hover`; hover changes border-color only.
6. **Motion:** `v9-motion.ts` reveal `y: 26` → `y: 8`.

## Asset rules
Real product screenshots only (`/assets/work/*.webp`). No stock art, no AI-generated decoration,
no Vercel assets of any kind.

## Responsive
`--gap-sec` 80px desktop / 56px at ≤640px. Must hold zero horizontal overflow at 390px.

## First artifact should prove
The home page and `/services` read as quiet and engineered, the yellow still registers as the
brand accent at a glance, and no grid texture is visible anywhere.
