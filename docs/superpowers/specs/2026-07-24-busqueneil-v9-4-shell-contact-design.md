# v9.4 — Floating rail, "Got an idea?" FAB, Contact page (2026-07-24)

Neil's request: "review busqueneil.com, make the UI UX better... the WhatsApp or something should be a floating button... something about Got an idea?... on the left side bar, make it that you can collapse it... sidebar to be like floating rounded corners modern... spacing between the sidebar and the canvas... a contact page where they can contact me a form... and it goes to my email."

Design language is v9 "Premium Paper" (approved same day) — this extends it, never restyles it.

## 1. Floating collapsible rail (desktop ≥900px)

- Rail becomes a floating card: `position: fixed; inset: 16px auto 16px 16px`, `border-radius: 22px`, `background: var(--surface)`, `border: 1px solid var(--hair)`, v8-card shadow. No more full-height border-right slab.
- Geometry via CSS vars on `.v8.shell`: `--rail-w: 232px`, collapsed `--rail-w: 84px`. `shell-main` margin-left and `shell-strip` padding-left derive from `calc(16px + var(--rail-w) + 28px)` so canvas keeps a real gap.
- Nav items gain SVG icons (same 24px stroke set as the mobile tab bar) + label. Collapsed: labels hidden, icons centered, `title` tooltip, avatar stays, WhatsApp/contact CTA hidden.
- Toggle: 28px circle button half-overlapping the rail's right edge (chevron), `aria-label` swaps Collapse/Expand.
- Persistence: `localStorage['v9-rail']`; class `rail-collapsed` applied to `<html>` pre-paint by an inline head script (no flash), re-applied on `astro:after-swap` (ClientRouter replaces html attrs). Width/margin transition 250ms; global reduced-motion rule already kills it.
- Mobile (≤900px) untouched: rail hidden, bottom tab bar.

## 2. Floating "Got an idea?" button

- Fixed bottom-right pill on every shell page: WhatsApp glyph + Caveat "Got an idea?" — sun-yellow sticker-shadow language (`btn-sun` family). Links to `https://wa.me/19083164140` with prefilled text.
- Mobile: sits above the tab bar (`bottom: calc(tabbar + safe-area)`).
- Rail foot CTA changes from "WhatsApp me" → "Contact me" → `/contact` (dedupe: FAB owns WhatsApp, rail owns the form).

## 3. Contact page + email

- `/contact` added to NAV (7th item, desktop rail + mobile tab bar, speech-bubble icon).
- Page: Archivo display header ("SAY HELLO." style), lede in site voice, two-column: form card + aside (email, WhatsApp, LinkedIn, response-time Caveat annotation). ContactPage JSON-LD, sitemap entry.
- Form: Name, Email, "What do you need?" select (Web app / Website / Landing page or funnel / Automation or AI / Something else), Message. Honeypot `bot_field`. Visible labels, inline errors, loading state, inline success ("Got it. I read everything myself — expect a reply within a day.").
- `POST /api/contact` (Astro SSR route, `prerender=false`):
  1. **Email to `busqueneil@gmail.com`** via Mailgun account B, domain `mail.hatchos.one`, From `busqueneil.com <contact@mail.hatchos.one>`, Reply-To = visitor. Required for `ok:true`. Key in env `MAILGUN_SENDING_KEY` (Vercel prod/preview + local `.env`).
  2. **Best-effort Orbit lead**: server-side POST to the existing `form-lead` Supabase fn with `form: 'contact'` (creates contact + deal in Orbit; failures swallowed).

## 4. UI/UX polish (restrained)

- `:focus-visible` rings site-wide under `.v8`.
- `touch-action: manipulation` on buttons/nav.
- Tab bar verified at 360px with 7 items.
- No canvas/page restyling — v9 was approved today.

Version bump 9.4.0. No em dashes in copy.
