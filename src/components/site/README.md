# Site components

Shared building blocks for the public site ("Cobalt Grid"). Styles live in `src/styles/site.css`
under `.site`, so a component only looks right inside `AppShell` (or anything else rendering the
`.site` root). The pages in `src/pages` show every component in use; the home page and /work
are the longest examples.

Rules that apply to every component and every string you pass in (the repo is public):

- No company, client, employer, staff or agent-persona names. Not in text, alt, title, meta,
  JSON-LD, data, link text, file names or code comments. Neil's own product names are not shown
  either; use the descriptive titles from `src/data/site.ts`.
- No em dashes or en dashes in copy. Plain, short sentences.
- Every image is `<Art>` placeholder art, seeded by slug. No screenshots, portraits or logos.
- Accent words render in cobalt through an `accent` prop (the words appended to a title, period
  included, the way the home hero does it). One accent per headline at most.
- WhatsApp first: build every WhatsApp link with the helpers in `src/data/site.ts`, never by hand.

Import paths below are from a page in `src/pages/`. From a deeper folder add `../` as needed.

## Layout

### AppShell (`src/layouts/AppShell.astro`)

Nav, phone menu, `<main>`, then one navy block with the closing ask and the footer.

| Prop | Type | Notes |
|---|---|---|
| `title`, `description` | string | Required. Title is the full `<title>`. |
| `canonical` | string | Absolute URL. Defaults to the current path on busqueneil.com. |
| `ogImage`, `ogType` | string | Defaults to the site social image and `website`. |
| `noindex` | boolean | Also drops the WebPage JSON-LD. |
| `active` | `'home' \| 'services' \| 'work' \| 'resources' \| 'free' \| 'contact' \| 'about' \| 'hire' \| 'article'` | Marks the nav item. |
| `ask` | boolean | Default true. `false` drops the closing ask, keeps the footer (Contact page). |
| `closing` | `Partial<ClosingCopy>` | Override the closing copy for one page. |
| `noConcierge` | boolean | Hides the live-talk widget. |
| `announce` | `{ id, text, tag?, href?, linkLabel? }` | One real piece of news in a bar above the nav. |
| `ctaHref`, `ctaLabel` | string | Override the nav button. Leave out: it is "Message me", opening WhatsApp. |
| slot `head` | | Extra `<head>` content: JSON-LD, preloads, page CSS links. |

```astro
<AppShell title="Work: AI agents, software and automations | Neil Busque" description="..." canonical="https://busqueneil.com/work" active="work">
```

### Section

Standard section padding and container. `band`: `plain` (default), `mist`, `navy`. Two plain
sections in a row share one hairline automatically; never put two mist sections back to back.
`wrap`: `true` (container), `'measure'` (680px reading column), `false` (no container).
Props: `band`, `id`, `labelledby`, `wrap`, `as` (`section | div | aside`), `class`.

```astro
<Section band="mist" id="how" labelledby="how-title">...</Section>
```

### PageHead

Inner-page head with its own container: optional label, H1 (with `accent`), lead, default slot
for buttons. Content in the `aside` slot fills a right column (7 | 5).
Props: `title`, `accent?`, `label?`, `lead?`, `id?`, `class?`.

```astro
<PageHead title="Built and" accent="launched." lead="..."><div class="btn-row btn-row--stack">...</div></PageHead>
```

### SectionHead

Section header, one shape per section: H2 alone (`title`), split heading (`strong` + `rest`), or
two columns (`title` plus `lead` and/or `link`; H2 left, lead and link right).
Props: `title?`, `accent?`, `strong?`, `rest?`, `label?`, `lead?`,
`link?: { href, label, style?: 'arrow' | 'button' }`, `id?`, `as?: 'h2' | 'h3'`, `class?`.

```astro
<SectionHead id="work-title" title="Selected work" lead="..." link={{ href: '/work', label: 'All work' }} />
```

## Actions

### Button

A link when `href` is set, otherwise a `<button>`. External links (http, mailto) get the up-right
arrow and open in a new tab with screen-reader text; internal primary buttons get a right arrow.
Props: `href?`, `variant?: 'primary' | 'secondary'`, `size?: 'md' | 'sm'`,
`arrow?: 'auto' | 'right' | 'external' | 'none'`, `onNavy?`, `full?`, `newTab?`, `type?`,
`label?`, `class?`, plus any attribute (`aria-label`, `data-*`).

```astro
<div class="btn-row btn-row--stack">
  <Button href={waGlobal()}>Message me on WhatsApp</Button>
  <Button href="/work" variant="secondary">See the work</Button>
</div>
```

`.btn-row` lays buttons in a row; `.btn-row--stack` makes them full width and stacked on phones.
Text link with an arrow: `<a class="link-arrow" href="/work">All work<Icon name="arrow-right" strokeWidth={2} /></a>`.

### CtaRow

One sentence and one button on a single row under a hairline, no box (stacks on phones, button
full width), for "not sure what you need" and "build one for you" rows under a grid.
Props: `text`, `cta: { href, label }`, `variant?: 'primary' | 'secondary'` (default secondary),
`class?`, plus any attribute (`data-reveal`).

```astro
<CtaRow text="If you're not sure what you need, walk me through a normal day for your team. I'll say what I'd build first." cta={{ href: waGlobal(), label: 'Start with a message' }} />
```

### PromptCard

One-line brief that opens WhatsApp in a new tab with "Hi Neil, I want to build: <text>". An
empty input opens WhatsApp with the global prefill. Chips fill the input (three on desktop, two on
phones) and wrap inside the card. `floating` pins it inside a positioned parent (the hero media).
Props: `placeholder?`, `placeholderShort?`, `chips?: PromptChip[]`, `prefix?`, `emptyText?`,
`label?`, `sendLabel?`, `floating?`, `class?`. Defaults come from `PROMPT` in site.ts.

```astro
<div class="hero-media"><Art seed="home" kind="hero" loading="eager" /><PromptCard floating /></div>
```

### ContactChannels

One channel per 64px row (label, value, arrow). Light by default; switches to navy inside a navy
band, or pass `tone="navy"`. Props: `items?: Channel[]` (default `CHANNELS`), `tone?`, `label?`, `class?`.

```astro
<ContactChannels />
```

## Grids and cards

### RuledGrid and RuledCell

Cells share 1px hairlines, no radius, no shadow. `cols`: 4 (4, 2, 1), 3 (3, 1) or 2 (2, 1). The
cell count must fill every row at every width: 4 or 8 cells for cols 4, 3 or 6 for cols 3, 2 or 4
for cols 2 (a `span={2}` cell counts as two). Children can be RuledCell, StatCell, QuoteCard or any
single element.

RuledGrid props: `cols?`, `label?` (accessible group name), `class?`.
RuledCell props: `href?` (whole cell links), `label?`, `title?`, `titleAs?`, `compact?` (17px
title, for strips), `text?`, `span?: 1 | 2`, `cta?` (foot text on a linked cell),
`link?: { href, label }` (foot link on a plain cell), `class?`, default slot.

```astro
<RuledGrid cols={4} label="Services">
  {CAPABILITIES.map((c) => <RuledCell href={c.href} label={c.number} title={c.name} compact text={c.line} />)}
</RuledGrid>
```

Compact link cells (a name and an arrow, for an index such as the industries strip): give the
grid `class="ruled--links"` and pass linked RuledCells with only a `title` and `compact`.

### StatCell

Cobalt numeral, caption, optional source line. Real, sourced numbers only.
Props: `value`, `caption`, `source?` (renders a label line; leave it out to show none), `class?`.

```astro
<RuledGrid cols={3}>{STATS.map((s) => <StatCell value={s.value} caption={s.caption} />)}</RuledGrid>
```

### QuoteCard

Real, approved quotes only. No stars, avatars or logos. Props: `quote`, `name?`, `role?`, `class?`.

```astro
<RuledGrid cols={4}>{QUOTES.map((q) => <QuoteCard quote={q.quote} role={q.role} />)}</RuledGrid>
```

### Bento and BentoCard

Services overview, once per page: first card 8 columns, second 4, then halves; four cards is the
intended count. The whole card is the link; art bleeds to the bottom edges.
BentoCard props: `href`, `title`, `text`, `items?` (large card only), `seed`, `kind?`, `palette?`,
`layout?`, `image?`, `imageAlt?`, `as?`, `class?`.

```astro
<Bento label="Services">
  {SERVICE_CARDS.map((s, i) => <BentoCard href={s.href} title={s.title} text={s.line} items={i === 0 ? s.items : undefined} seed={s.slug} layout={s.layout} palette={s.palette} data-reveal />)}
</Bento>
```

### WorkCard

Art 16/10, meta row (category left, year right), title, context, optional outcome. Wrap several
in `<div class="work-grid">` (2 columns, 1 on phones). With an `href` the whole card is a link
(external links open in a new tab); with `href={null}` it renders as a plain article.
Props: `href?: string | null`, `title`, `text`, `category`, `year?`, `outcome?: string | null`,
`seed`, `palette?`, `layout?`, `image?`, `imageAlt?`, `filter?` (Tabs key), `as?`, `class?`.

```astro
<div class="work-grid">
  {PROJECTS.slice(0, 4).map((p) => <WorkCard href={p.href} title={p.title} text={p.text} category={p.category} year={p.year} outcome={p.outcome} seed={p.slug} data-reveal />)}
</div>
```

### FeatureSplit

One bordered frame: art in 7 columns, body in 5 (art on top below 900px). Body: label (and year
on the right when given), title, context, optional outcome, a short checklist, stack line, then
a button or arrow link. `reverse` puts the art on the right.
Props: `title`, `text`, `label?`, `year?`, `outcome?: string | null`, `items?`, `itemsTitle?`
(default "What I built"), `stack?`, `cta?: { href, label, style?: 'button' | 'arrow' }`, `seed`,
`kind?`, `palette?`, `layout?`, `image?`, `imageAlt?`, `reverse?`, `as?`, `class?`.

```astro
<FeatureSplit label={FEATURED_PROJECT.category} year={FEATURED_PROJECT.year} title={FEATURED_PROJECT.title} text={FEATURED_PROJECT.text} outcome={FEATURED_PROJECT.outcome} items={FEATURED_PROJECT.built} stack={FEATURED_PROJECT.stack} cta={FEATURED_PROJECT.cta} seed={FEATURED_PROJECT.slug} />
```

### ToolCard

Art 4/3, platform line, name, one line, link line. The whole card is the link. Wrap several in
`<div class="tool-grid">` (3 across, rows on tablets, 1 on phones). The deck's platform lines
already say how free a tool is, so leave `free` off unless the platform line does not.
Props: `href`, `name`, `text`, `platform`, `free?`, `cta?` (default "Open the tool"), `seed`,
`palette?`, `layout?`, `image?`, `imageAlt?`, `as?`, `class?`.

```astro
<div class="tool-grid">{TOOLS.map((t) => <ToolCard href={t.href} name={t.name} text={t.text} platform={t.platform} cta={t.cta} seed={t.slug} data-reveal />)}</div>
```

### Portrait

4/5 frame (16px radius) with navy or mist placeholder art; `variant="avatar"` is the 72px square
for the article author box. Props: `src?`, `alt?`, `seed?`, `variant?: 'full' | 'avatar'`,
`palette?`, `loading?`, `class?`.

```astro
<Portrait seed="portrait" />
```

### Art (`src/components/Art.astro`)

Seeded placeholder art; the same `kind` + `seed` always draws the same picture. Seed by slug, never
by index. Props: `seed`, `kind?: 'project' | 'tool' | 'article' | 'service' | 'portrait' | 'hero'`,
`ratio?` (CSS ratio such as `"16 / 9"`), `src?` + `alt?` (a real image later, same frame),
`palette?: 'mist' | 'paper' | 'navy' | 'cobalt' | 'dusk'`, `layout?`, `loading?`, `srcset?`, `sizes?`, `class?`.
Keep at most one dark picture (navy, dusk, cobalt) per row of cards; force `palette` to balance.

```astro
<Art seed={entry.slug} kind="article" />
```

## Lists

### Steps

Numbered rows with hairlines: numeral, title, text. `compact` gives small numerals and tight rows
("What happens next"). Props: `items: { title, text }[]`, `start?`, `compact?`, `as?: 'h3' | 'h4'`, `class?`.

```astro
<Steps items={STEPS} />
```

### CheckList

Cobalt checks, or muted x marks with `variant="no"`. Items are strings or `{ title, text? }`.
Props: `items`, `variant?: 'yes' | 'no'`, `class?`.

```astro
<CheckList items={SERVICES[0].items} />
```

### FitList

"A good fit if" and "Not a fit if" side by side in a 2-cell ruled grid; stacks on phones.
Props: `fit`, `notFit`, `fitTitle?`, `notFitTitle?`, `as?: 'h3' | 'h4'`, `class?`.

```astro
<FitList fit={FIT.fit} notFit={FIT.notFit} fitTitle={FIT.fitTitle} notFitTitle={FIT.notFitTitle} />
```

### DefList

Label left (muted), value right (ink), hairline rows. Real answers only.
Props: `items: { term, value, href? }[]`, `class?`.

```astro
<DefList items={SERVICES[0].facts} />
```

### ResourceTable and Tabs

Resource table: ink top rule, header row (Type, Title, Read, Date), 72px rows, whole row links.
Rows carry `data-filter`, so Tabs can filter a table by its `id`.
ResourceTable props: `rows: ResourceRow[]` (`{ href, type, title, excerpt?, read?, date?, dateTime?, filter? }`),
`id?`, `head?`, `columns?`, `class?`.
Tabs props: `tabs: { key, label, count? }[]`, `target` (id to filter), `label?`, `allKey?`
(default `all`), `param?` (URL param, default `filter`), `selected?`, `class?`. Works on any
container whose items carry `data-filter` (WorkCard takes a `filter` prop for this).

```astro
<Tabs target="work-list" label="Filter work" tabs={WORK_TABS} />
<ResourceTable id="all-resources" rows={rows} />
```

### Faq

`<details>` rows with hairlines. With `title` it renders the two-column layout (H2, line and an
"Ask me directly" link on the left, questions on the right). `schema` also emits FAQPage JSON-LD
that matches the visible questions; use it once per page, only for questions shown there.
Props: `items: { q, a }[]` (a blank line in `a` starts a new paragraph), `title?`, `lead?`,
`ask?: { href, label } | false` (default "Ask me directly", WhatsApp global prefill), `schema?`, `id?`, `class?`.

```astro
<Faq id="faq-title" title="Questions owners ask first" lead="Straight answers before we talk." items={FAQS} schema />
```

## Chrome (rendered by AppShell, rarely used directly)

- **SiteNav**: wordmark, four links, Contact and the "Message me" button (WhatsApp, new tab, aria-label "Message Neil on WhatsApp"); phone sheet with "Message me on WhatsApp" pinned at the bottom. Props: `active`, `cta: { href, label, labelShort?, ariaLabel?, sheetLabel? }`.
- **ClosingBand**: H2 with `accent`, lead, WhatsApp and contact-form buttons, channel rows. Props: `title?`, `accent?`, `lead?`, `primary?`, `secondary?`, `channels?`, `id?`. Put it inside a `.band--navy` element if used outside the shell.
- **SiteFooter**: brand column, three link columns from `FOOTER_COLUMNS`, base row. Props: `current?` (path, marks the matching link).
- **AnnouncementBar**: see AppShell `announce`. Real news only.
- **Breadcrumb**: one quiet back link plus BreadcrumbList JSON-LD. Props: `items: { name, url }[]` (absolute URLs, current page last), `backLabel?`, `back?`, `schema?`, `class?`. Do not combine with the older `src/components/Breadcrumb.astro` on one page.
- **Icon**: `name`: `arrow-right` (internal), `arrow-left` (back), `arrow-up-right` (external or another app), `arrow-up` (send), `check`, `x`, `plus`, `menu`, `close`. Props: `name`, `size?`, `strokeWidth?`, `label?` (only when the icon is the whole content), `class?`.

## Page CSS

Page-only styles go in `src/styles/pages/<area>.css`, imported by your pages, scoped under
`.site`. Banned in every stylesheet: `border-left` accents, inset stripes, `gradient(`,
`text-transform: uppercase`, wide letter-spacing, shadows on cards. Tap targets 44px or more,
inputs 16px, no horizontal scroll at 320, 390 or 768.

---

# Shared data: `src/data/site.ts`

One place for contact details, nav, the closing ask, footer columns and the lists pages render.
Strings are the copy deck's, verbatim. Page-only copy (a page's H1, leads, its own FAQ) stays in
the page.

## Identity and links

| Export | Shape | Notes |
|---|---|---|
| `SITE` | `{ name, url, email, whatsapp, whatsappDisplay, linkedin, linkedinDisplay, booking, bookingDisplay, location, timezone }` | `whatsapp` is digits only with the country code. |
| `waUrl(text?)` | `string` | `https://wa.me/<number>?text=<encoded>`. Blank text gives the bare link. Keeps the trailing space. |
| `mailUrl(subject?)` | `string` | `mailto:` link for `SITE.email`. |
| `WA_TEXT` | `{ global, prompt, oneBuild, ongoing, featured, freeTools }` | The prefill texts. Each ends with a space so the visitor types straight after it. |
| `waGlobal()` | `string` | Nav button, hero, closing band, contact page, any WhatsApp button without its own prefill. |
| `waPrompt(text?)` | `string` | Prompt card: "Hi Neil, I want to build: <text>". Blank text gives `waGlobal()`. |
| `waOneBuild()` | `string` | Services, "Talk about a build". |
| `waOngoing()` | `string` | Services, "Talk about ongoing help". |
| `waFeatured()` | `string` | Work, featured project link. |
| `waFreeTools()` | `string` | Free tools, build-for-you button. |
| `waSoftware(pageTitle)` | `string` | /software CTA block: "Hi Neil, I read your page on <title>. Here's what we need: ". Pass the title with its capitals as written (never lowercased); a trailing " \| Neil Busque" is dropped, and a title ending in "?" gets no period after it. |
| `WA_HELLO`, `WA_PROMPT_PREFIX` | `string` | Older names for `WA_TEXT.global` and `WA_TEXT.prompt`. |
| `LinkItem` | `{ label, href }` | |

## Chrome

| Export | Shape |
|---|---|
| `NAV` | `NavItem[]`: `{ key: NavKey, label, href }` for Services, Work, Resources, Free tools. `NavKey = 'services' \| 'work' \| 'resources' \| 'free'`. |
| `NAV_CONTACT` | `LinkItem`, Contact. |
| `NAV_CTA` | `{ label, labelShort, ariaLabel, sheetLabel, message }`: "Message me", aria-label "Message Neil on WhatsApp", sheet button "Message me on WhatsApp", `message` = `WA_TEXT.global`. |
| `MENU_LABELS` | `{ open: 'Open menu', close: 'Close menu' }` |
| `CHANNELS` | `Channel[]`: `{ key: 'whatsapp' \| 'email' \| 'booking' \| 'linkedin', label, value, href }`, WhatsApp first. |
| `CLOSING` | `ClosingCopy`: `{ title, accent?, lead, primary: LinkItem, secondary: LinkItem }`. |
| `FOOTER_TAGLINE` | `string` |
| `FOOTER_COLUMNS` | `FooterColumn[]`: `{ title, links: LinkItem[] }` for Services (5), Resources (3: Guides, Comparisons, Research; Notes joins once the first build note is published) and More (6). |
| `PROMPT` | `{ label, placeholder, placeholderShort, sendLabel, chips: PromptChip[] }`, `PromptChip = { label, fill }` (label on the chip, fill = text it puts in the input). |

## Services

| Export | Shape |
|---|---|
| `SERVICES` | `Service[]`, the five services in order: `{ slug, number, name, line, text, items, facts, link, href, image?, imageAlt?, palette?, layout? }`. `slug` is the art seed and the section id on /services; `line` is the one-liner for the /services index; `text` the section copy; `items` "What you get"; `facts` the definition rows (`DefRow = { term, value, href? }`: Good for, How it starts, What you own); `link` the deep-page link (`href` is the same URL). |
| `CAPABILITIES` | `Capability[]`, the four cells under the home hero: `{ number, name, line, href }`. |
| `SERVICE_CARDS` | `ServiceCard[]`, the four home bento cards: `{ slug, title, line, href, items?, palette?, layout? }`. Only the first has `items`. |

## Work

| Export | Shape |
|---|---|
| `ProjectType` | `'agents' \| 'software' \| 'automations' \| 'sites'` |
| `PROJECT_CATEGORY` | `Record<ProjectType, string>`: AI agents, Software, Automations, Sites and funnels (the visible category labels). |
| `FEATURED_PROJECT` | `FeaturedProject`: a `Project` plus `built: string[]` (What I built), `stack: string` and `cta: LinkItem` (WhatsApp, featured prefill). |
| `PROJECTS` | `Project[]`, the eight cards in deck order: `{ slug, title, text, type, category, year, outcome: string \| null, href: string \| null, image?, imageAlt?, palette?, layout? }`. `href: null` means no link target (render the card without a link). Palettes are pinned so each two-card row has at most one dark picture in deck order. |
| `MORE_BUILDS` | `ProjectRow[]`, the eleven "More builds" rows: `{ slug, title, text, type, category, year, href: string \| null }`. |
| `WORK_TABS` | `{ key: 'all' \| ProjectType, label, count }[]`, counted from the three lists above (All 20, AI agents 6, Software 8, Automations 3, Sites and funnels 3). |

## Free tools

| Export | Shape |
|---|---|
| `FEATURED_TOOL` | `FeaturedTool`: a `Tool` plus `what` (what it does), `who` (who it's for), `steps: string[]` (how it works). Its `text` is the one-line card version. |
| `TOOLS` | `Tool[]`, the cards shown on /free, in deck order (four today): `{ slug, name, text, platform, cta, href, free?, image?, imageAlt?, palette?, layout? }`. `cta` is the deck's link label; the URL is only a link target, never printed. |
| `HELD_TOOLS` | `(Tool & { holdUntil })[]`: cards written and checked but not shown yet (the viral posts field report waits on its PDF cover). Never render it; move a card into `TOOLS` once its `holdUntil` is done. |

## Proof and home lists

| Export | Shape |
|---|---|
| `QUOTES` | `Quote[]`: `{ quote, role, name? }`. The four approved quotes, verbatim, role labels only. |
| `STATS` | `Stat[]`: `{ value, caption, source }`. `source` is an internal note on where the number comes from; pages do not print it. |
| `STEPS` | `Step[]`: `{ title, text }`, home "How it works". |
| `FIT` | `{ fitTitle, notFitTitle, fit: string[], notFit: string[] }`, home "Who I work best with". |
| `INDUSTRIES` | `Industry[]`: `{ name, href }`, the eight /software industry pages. |
| `ABOUT_FACTS` | `DefRow[]`, home "Who you'll work with" facts. |
| `FAQS` | `FaqItem[]`: `{ q, a }`, the home FAQ. |
| `WithImage` | `{ image?, imageAlt?, palette?, layout? }` on every record that renders art. A real image drops into the same frame later. |

`src/data/__tests__/site.test.ts` checks the shape: no dashes in any string, links are site paths,
https or mailto (never GitHub), the WhatsApp helpers, counts per list, the work tab counts, and a
name check against a hashed list (clients, employers, personas, product names and personal
details are stored as hashes, so the public repo never spells them out). Run it with
`npx vitest run src/data`.
