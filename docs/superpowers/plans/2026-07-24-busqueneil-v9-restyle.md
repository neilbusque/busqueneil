# busqueneil.com v9 "Premium Paper" Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement task-by-task. Steps use checkbox syntax.

**Goal:** Restyle the live v8 app-shell site to the Neil-approved premium look: flat lemon yellow, editorial Archivo type, handwritten organic accents, warm paper. Add a Shop view to the IA (cart/checkout ships in a later commerce phase).

**Architecture:** Token + component restyle of the existing shell (no route/data changes except a new `/shop` page). THE PIXEL REFERENCE IS `docs/superpowers/specs/v9-ref/home-v9-mock.html` (open it in a browser; also `mock-full.png`). When this plan and the mock disagree on a visual value, the mock wins.

**Tech Stack:** Existing Astro 5 site. No new deps.

## Global Constraints

- Palette (exact, from the mock): paper `#F7F1ED`, surface `#FFFFFF`, ink `#242424`, muted `#6B675F`, soft `#A8A29A`, sun `#FFE862` (FLAT — gradients are BANNED everywhere), sun-deep `#FFD640` (hover only), dark `#1E1C19`, hairline `#E5DCD2`, grid `rgba(36,36,36,.035)` at 44px.
- Yellow is flat fill only, always with ink text/elements on it. Never yellow text on paper.
- Buttons: `.btn-sun` = flat sun bg, ink text, `box-shadow: 0 2px 0 rgba(36,36,36,.9)` (the sticker shadow), radius 999px.
- Type: Archivo 900 uppercase for display/section headings (letter-spacing -0.015em), Inter UI/body, Fraunces italic 600 for script accent words, Caveat 600 for handwritten annotations, Mrs Saint Delafield for the "Neil." signature.
- No em dashes in body copy (title separators excepted).
- Capabilities are exactly: Web Apps, Websites, Landing Pages, Funnels, Automation.
- Untouched: funnels (public/build|help|ria|support), /admin, /api, /guides, backend, redirects from v8.
- Commit trailer: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`. Verify: `npm run build && npm test`.

---

### Task 1: v9 tokens + fonts + flat components + brand asset recut

**Files:**
- Modify: `src/styles/v8.css` (token block + every gradient), `src/layouts/Base.astro` (v8 font link), `public/assets/brand/*` (recut), `src/components/RibbonMark.astro` (recolor)

- [ ] **Step 1: Token swap** in `src/styles/v8.css` `.v8` block — replace the old values with the Global Constraints palette (add `--soft:#A8A29A; --dark:#1E1C19; --sun-deep:#FFD640;` remove `--sun-hi`, `--fold`, `--gold`, `--amber` after updating their usages below). Grid: `background-size: 44px 44px;` color `rgba(36,36,36,.035)`.
- [ ] **Step 2: Kill every gradient.** `grep -n "linear-gradient" src/styles/v8.css` — for each hit EXCEPT the two grid-texture `linear-gradient(var(--grid)...)` pairs: replace with flat `var(--sun)`. That covers `.btn-sun`, `.mark-hl`, `.rail-item.active`, `.tab-item.active svg`, `.tl-dot`, `.hire-step b`, `.blog-chips .chip.on`. `.btn-sun` also gets the sticker shadow `box-shadow: 0 2px 0 rgba(36,36,36,.9);` (replace its old glow) and hover `background: var(--sun-deep); transform: translateY(-1px);`. `.mark-hl` stays ink-on-yellow (`color:#242424`).
- [ ] **Step 3: Type classes.** In v8.css: `.v8 h1,.v8 h2,.v8 h3` switch from Fraunces to keep as-is BUT add new helpers copied from the mock stylesheet: `.sec` (Archivo 900 uppercase clamp(30px,3.6vw,44px)), `.script` (Fraunces italic), `.hand` (Caveat), `.sig` (Delafield). Heading elements that should be editorial get the classes in their page tasks; do not globally uppercase h2.
- [ ] **Step 4: Fonts.** Base.astro v8 font link becomes: `https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;900&family=Caveat:wght@600&family=Fraunces:ital,opsz,wght@1,9..144,600&family=Inter:wght@400;500;600;700;800&family=Mrs+Saint+Delafield&display=swap`
- [ ] **Step 5: RibbonMark recolor.** In `RibbonMark.astro`: stems `#242424` (ivory variant `#F7F1ED`), ribbon `#FFE862`, folds `#FFD640`.
- [ ] **Step 6: Recut brand assets** with the same headless-Chrome recipe used before (see `~/Documents/Work/Claude/NeilOS/context/deliverables/neil/logo-ribbon-n/README.md`): regenerate `public/assets/brand/mark.svg`, `mark-small.svg`, `mark-ivory.svg`, `mark-mono.svg` (edit fills to new hexes: stems #242424, ribbon #FFE862, folds #FFD640, mono all #242424), then re-render favicon-16/32 (from mark-small), apple-touch-180 + icon-512 + icon-1024 (paper #F7F1ED ground), and og-default.png (edit `og/og.html` palette: bg #F7F1ED, ink #242424, highlight flat #FFE862, period ink; grid rgba(36,36,36,.05)) — og.html lives in the logo-ribbon-n deliverables folder; copy the rendered og-default.png into `public/assets/brand/`. Also copy the recolored SVGs back into the deliverables folder `svg/` so the brand folder stays canonical.
- [ ] **Step 7:** `npm run build && npm test` green. Commit `feat(v9): flat lemon palette, editorial type helpers, brand recut`.

---

### Task 2: Shell restyle + Shop nav + signature rail

**Files:**
- Modify: `src/layouts/AppShell.astro`, `src/styles/v8.css` (append/patch shell rules), `src/components/IntroCinematic.astro`

- [ ] **Step 1: Rail brand = signature.** Replace the RibbonMark+"Neil." lockup in the rail with `<span class="rail-sig">Neil.</span>` (Delafield, ~34px, rotate(-3deg), ink). CSS `.rail-sig{font-family:'Mrs Saint Delafield',cursive;font-size:34px;line-height:1;transform:rotate(-3deg);display:inline-block;color:var(--ink);}`.
- [ ] **Step 2: Nav gains Shop.** NAV array adds `{ key: 'shop', href: '/shop', label: 'Shop' }` between blog and hire; Props `active` union adds `'shop'`. Desktop rail items become TEXT-ONLY (drop the svg icons in the rail only); mobile tab bar KEEPS icons (add shop icon path `M6 8h12l-1 12H7zM9 8V6a3 3 0 0 1 6 0v2` to ICONS).
- [ ] **Step 3: Rail styling per mock:** rail bg = var(--paper) (not surface mix), items 15px weight 550 muted, active = flat sun pill radius 10 ink 650. Avatar: `object-position: top`. WhatsApp pill uses `.btn-sun` sizing already.
- [ ] **Step 4: Strip:** dot color flat `var(--sun)` with `box-shadow:0 0 0 3px rgba(255,232,98,.35)`. NO cart pill yet (ships with commerce phase).
- [ ] **Step 5: Intro recolor:** IntroCinematic wordmark line becomes Archivo: change `.intro-word` CSS to `font-family:'Archivo'; font-weight:900; text-transform:uppercase; letter-spacing:-0.015em;` and its markup text to `Neil Busque.` with `.intro-dot` removed (plain ink period — Neil explicitly removed the highlighted/colored period). Ribbon colors come free from Task 1.
- [ ] **Step 6:** build+test green; commit `feat(v9): signature rail, Shop nav, flat shell, intro recolor`.

---

### Task 3: Home rebuilt to the mock

**Files:**
- Modify: `src/pages/index.astro` (rewrite body to mock structure), `src/styles/v8.css` (append mock section styles)

Transcribe structure, classes, and copy from `docs/superpowers/specs/v9-ref/home-v9-mock.html` sections: hero (avail pill, script "hey, I'm", giant `NEIL BUSQUE.` Archivo h1 plain ink period, sub copy, `.btn-sun` + squiggle-arrow "See the work" link with the inline SVG from the mock), photo right with the Caveat note + hand-drawn arrow SVG ("that's me. you talk to me, not an agency"), stats strip (10+ / Days / 1 person), services 01-05 rows (`.svc` list, exact copy from mock), clients text-flow (`.clients`, 10 names dot-separated), work grid (4 cards: Orbit CRM, Tandem with `.worknote` "built this for my wife", Darioo, Otto; real webp paths from public/assets/work/), Shop tease section (h2 "Things I made that you can buy." + copy "The shop opens soon. Templates, playbooks, and the tools I use." + `.btn-sun` "Tell me what you want first" → WhatsApp link — DO NOT render fake products or add-to-cart buttons on the live site), What I'm up to (real `now` post text + real latest posts list in `.postlist` rows with type tags incl. `.tag.video` style ready; reuse getFeed/getNow data already in the frontmatter), statement (Archivo + Fraunces-italic mix, "Finished" flat-highlighted), dark CTA panel (`.darkcta` with Delafield signature in sun yellow), footer unchanged.

- [ ] **Step 1:** Port the mock's section CSS blocks (hero, stats, svc, clients, workgrid+worknote, nowwrap+postlist, statement, darkcta, note, link-arrow, avail) into v8.css, adapting selectors under `.v8` and swapping mock font names to the loaded families. Remove/replace the old v8 home styles they supersede (`.home-hero`, `.cap-grid`, `.cap-card`, `.client-strip` chips, `.why-card`, `.cta-band`, `.hero-stats` etc. — delete dead rules).
- [ ] **Step 2:** Rewrite index.astro body per above (keep frontmatter data fetching incl. latest3 + now; PostCard no longer used on Home — the `.postlist` rows render inline; keep IntroCinematic + Schema slots).
- [ ] **Step 3:** build+test; screenshot `/` at 1440 with the dev server and EYEBALL against `mock-full.png` (structure + palette must match; content differs where real data does). Commit `feat(v9): Home rebuilt to premium mock`.

---

### Task 4: Shop page + secondary views alignment

**Files:**
- Create: `src/pages/shop.astro`
- Modify: `src/pages/story.astro`, `src/pages/work.astro`, `src/pages/blog.astro`, `src/pages/hire/index.astro`, `src/pages/sitemap.xml.ts`, `src/styles/v8.css` (only if a class is missing)

- [ ] **Step 1: `/shop`** — AppShell active="shop". Content (honest, no fake products): eyebrow "Shop", h2.sec `Things I made that <span class="mark-hl">you can buy.</span>`, lede "The shop opens soon. Templates, playbooks, and the tools I use to ship real products, packaged for you.", `.btn-sun` "Tell me what you want first" → the WhatsApp link, plus a `.hand` note "first drops are in the works". Add `/shop` to sitemap static routes (weekly, 0.7).
- [ ] **Step 2: Headings pass.** On story/work/blog/hire index pages: give the main h1/h2s the `.sec` treatment where the mock's editorial voice fits (h1s become Archivo 900 uppercase via adding class `sec` — keep the existing `mark-hl` spans; they're flat yellow now automatically). Blog index: replace the `.blog-grid` of PostCards with the `.postlist` row style from Home (date / title / type tag), keeping filter chips + pager; PostCard stays for any other consumer or delete if now unused (check `grep -rn "PostCard" src/`).
- [ ] **Step 3:** build+test; commit `feat(v9): Shop page, editorial headings, blog list rows`.

---

### Task 5: QA vs mock + ship

- [ ] **Step 1:** `grep -n "linear-gradient" src/styles/v8.css` → only the 2 grid pairs (+ any inside untouched non-v8 files). `grep -rn "FFC61A\|E3A50E\|DFA100\|E89B2D\|FAF8F2\|201E18\|E8E2D2" src/styles/v8.css src/layouts src/components src/pages/index.astro src/pages/shop.astro` → zero hits (old palette gone from v9 surfaces; guides/funnels/case-study.css exempt).
- [ ] **Step 2:** dev server + headless screenshots: `/` `/story` `/work` `/blog` `/shop` `/hire` at 1440 and `/` `/blog` at 390. READ each: flat yellow only, Archivo headings render (not fallback), signature in rail, tab bar has 6 items, no horizontal scroll at 390.
- [ ] **Step 3:** em-dash guard on changed files; `npm run build && npm test` green.
- [ ] **Step 4:** bump package.json to `9.0.0`, commit, merge to main, push (deploy), verify live: `curl -s https://busqueneil.com/ | grep -c "FFE862\|rail-sig"` ≥1 and `/shop` returns 200.
