# busqueneil.com v5 — "Electric Glow" homepage redesign

**Date:** 2026-07-03
**Approved by:** Neil (design + "ship it" approval in session)
**Scope:** Homepage `/` only, plus meta description and a short "Outside the work" addendum on `/about`. Interior pages, `/feed`, funnels, `/admin`, APIs untouched. Same stack: Astro 5 SSR on Vercel, Orbit lead plumbing, Vapi voice widget.

## Why

CRO audit (2026-07-03) scored the page: Hook 44/F, Offer/CTA 48/F, Form 20/F, Proof 55/D, Speed 58/D. Root causes: vague headline, no lead form, buried CTA, all-"Demo soon" work grid, 7.9s LCP from the 2560px hero PNG. Neil also wants the visual language moved toward designrocket.io / localhost3030.com: near-black, motion background, big type, one glowing accent.

## Design decisions (locked)

1. **Primary CTA "Book a free call"** scrolls to the contact form (`#contact`). No external scheduler exists yet; swap the href to Calendly/Cal.com later without layout change. Subtext: "20 minutes. No prep needed."
2. **Visual direction: Electric Glow.** Near-black `#060608` base kept from v4. ONE accent family: violet→magenta gradient (approx `#7C5CFF` → `#E44BFF`), used sparingly (hero accent line, form button, small glows, hover states). No rainbow, no starfields, no orbs — restraint per Neil's taste memory. Type stays Inter (700/800 for display, tighter and larger than v4) + JetBrains Mono labels.
3. **Headline (audit rewrite):** "One person to own your AI, automation, and growth stack." with gradient-accent second line "Ships in days, not quarters." Subhead: "Fractional AI engineer and marketer. I build agents, automations, and the funnels around them, usually solo, usually fast."

## Hero

- **Looping video background** generated via kie.ai (wan/2-7-text-to-video, 1080p 16:9 10s): slow drifting luminous violet/magenta silk-light ribbons on near-black. Post-processed locally with ffmpeg: ping-pong concat for a seamless loop, transcoded to WebM (VP9) + MP4 (H.264) at ~2–3MB total, first frame exported as WebP poster (~100–200KB).
- **LCP strategy:** hero text + poster render immediately; `<video autoplay muted loop playsinline preload="none" poster>` starts after `load`. `prefers-reduced-motion` and mobile data-saver get the static poster only. Dark gradient scrim over video for text contrast (≥4.5:1).
- Layout: copy-only hero (no console/form in hero — Neil rejected hero widgets before). Eyebrow `● Open to work · New Jersey`, H1, subhead, primary CTA + subtext, ghost "See the work", factual proof line under buttons (live-product count from the work grid, e.g. "8 products live. Built solo, usually in days." — exact numbers verified before ship).
- **No marquee between hero and CTA.** Tech marquee moves below the About section.

## Section flow

1. Nav (sticky glass, unchanged structure; CTA button → `#contact`, label "Get in touch")
2. Hero (video bg)
3. About `01` — kept, copy tightened; real photo stays
4. Tech marquee (below fold)
5. Capabilities `02` — 8 cards kept, subtle glow hover accent
6. Work `03` — see Proof below
7. Risk-reversal band (replaces "How I spend my time"): "Not sure if I am the right fit? Let us talk for 20 minutes. If I cannot help, I will tell you who can." + secondary CTA to `#contact`
8. Open for work + form `04` (`#contact`) — headline, roles chips kept, 3-field form
9. Footer (unchanged) + floating Vapi voice widget (unchanged)

"How I spend my time" content moves to `/about` as a short "Outside the work" block.

## Proof (work grid)

- Card media = real screenshots of live products (captured via Puppeteer from live URLs), WebP, lazy-loaded, width/height declared.
- At least 2–3 cards get an outcome line in the format "[Name]: built in [X days]. [What it does live.]" where X comes from git history (first commit → ship commit). **No invented numbers** — products whose history can't be verified keep a factual descriptor + live link instead.
- Cards link out to live URLs where public. "Demo soon" placeholders removed entirely.

## Form (`#contact`)

- Exactly 3 fields: Name (text), Work email (email), "What do you need most?" dropdown [AI agents / Automation / Marketing / Web app / Not sure yet]. Button: **Get in touch**.
- POST JSON to `/api/form-lead` (Vercel rewrite → Orbit `form-lead` edge function, same contract as /help funnel: `form` key, `bot_field` honeypot, field passthrough + anon key headers). Inline success state ("Got it. I will reply within a day with times."), inline error with retry; button disables + shows sending state. No redirect.
- Secondary options below the form: email link, LinkedIn, resume, and "Around right now? Start a live call" → talk.busqueneil.com.

## Meta / SEO

- Meta description (home): "AI engineer and automation builder available fractional or project-based. I build agents, funnels, and the systems around them, usually solo, usually fast. Based in New Jersey."
- Title unchanged. OG image → new hero poster frame (1200×630 crop). Schema/JSON-LD untouched.

## Performance targets

- LCP < 2.5s (poster + text, no 2560 PNG in critical path)
- Video: preload=none, starts post-load; total page weight above fold < 500KB excluding video
- All work-grid images WebP + lazy + explicit dimensions

## Error handling

- Form: network/4xx → inline error "Something went wrong. Email me instead: busqueneil@gmail.com" (mailto fallback), button re-enabled.
- Video: `onerror` → hide video element, poster/gradient remains (background never blocks content).

## Testing / QA

- Puppeteer screenshots at 375 / 768 / 1440, desktop + mobile, reviewed visually.
- UI pre-delivery checklist (memory `ui-predelivery-checklist`): contrast, focus rings, labels, touch targets, reduced motion, no horizontal scroll, form states.
- Form submitted end-to-end once against Orbit (test lead, then noted for Neil to delete).
- PageSpeed/LCP sanity check post-deploy.

## Copy standards

CopyOS is canonical; no em dashes; no name-repeat; 4-U headline test on section heads. Voice: confident, first person, plain words (existing v4 voice).

## Out of scope

Interior page reskins, funnel skins, new scheduler integration, Prism/desktop app demo video, per-project case-study pages.
