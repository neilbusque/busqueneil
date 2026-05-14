#!/usr/bin/env node
/**
 * update-now.js — archive the current /now state, drop in a new one.
 *
 * Usage:
 *   node scripts/update-now.js path/to/draft.md
 *
 * The draft.md file should look like:
 *
 *   # May 2026.
 *
 *   **Where I am.** ...
 *
 *   **What I'm building.** ...
 *
 *   **What I'm thinking about.** ...
 *
 *   **What's next.** ...
 *
 * The first line (`# Heading.`) is used as the section title.
 * Each subsequent paragraph becomes a <p>. **bold** is parsed.
 *
 * What this script does:
 *   1. Reads the current now/index.html.
 *   2. Extracts the existing "Right now" block + its title/date.
 *   3. Writes that block to now/archive/YYYY-MM-DD.html (a standalone page).
 *   4. Prepends a new archive list-item to now/index.html.
 *   5. Replaces the "Right now" block with the new draft.
 *   6. Updates "Updated [date]" on now/index.html AND the home page Now block.
 *   7. Updates the home page Now-block paragraphs.
 *
 * The script is intentionally simple — string operations, no DOM library.
 * It assumes the markers it inserts stay intact across edits. If you
 * hand-edit the marker comments, the script will refuse to run.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HOME = path.join(ROOT, 'index.html');
const NOW = path.join(ROOT, 'now', 'index.html');
const ARCHIVE_DIR = path.join(ROOT, 'now', 'archive');

const MARK = {
  homeNowBodyStart: '<!-- now-body:start -->',
  homeNowBodyEnd: '<!-- now-body:end -->',
  homeNowDateStart: '<!-- now-date:start -->',
  homeNowDateEnd: '<!-- now-date:end -->',
  nowCurrentStart: '<!-- now-current:start -->',
  nowCurrentEnd: '<!-- now-current:end -->',
  nowCurrentTitleStart: '<!-- now-current-title:start -->',
  nowCurrentTitleEnd: '<!-- now-current-title:end -->',
  nowCurrentDateStart: '<!-- now-current-date:start -->',
  nowCurrentDateEnd: '<!-- now-current-date:end -->',
  nowArchiveListStart: '<!-- now-archive:start -->',
  nowArchiveListEnd: '<!-- now-archive:end -->',
};

function fail(msg) {
  console.error('update-now: ' + msg);
  process.exit(1);
}

function between(src, start, end, where) {
  const s = src.indexOf(start);
  const e = src.indexOf(end);
  if (s === -1 || e === -1 || e < s) fail(`missing markers ${start}/${end} in ${where}`);
  return { before: src.slice(0, s + start.length), inner: src.slice(s + start.length, e), after: src.slice(e) };
}

function replaceBetween(src, start, end, replacement, where) {
  const parts = between(src, start, end, where);
  return parts.before + '\n' + replacement + '\n' + parts.after;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function prettyDate(iso) {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function parseDraft(draftPath) {
  const raw = fs.readFileSync(draftPath, 'utf8').trim();
  const lines = raw.split('\n');
  let title = '';
  if (lines[0].startsWith('# ')) {
    title = lines.shift().slice(2).trim();
  } else {
    fail(`draft must start with a "# Title." line`);
  }
  const body = lines.join('\n').trim();
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return { title, paragraphs };
}

function mdInline(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function renderHomeBody(paragraphs) {
  // Home Now block: show first 2 paragraphs (concise).
  const take = paragraphs.slice(0, 2);
  return take.map((p) => `        <p>${mdInline(p)}</p>`).join('\n');
}

function renderNowCurrentBody(paragraphs) {
  return paragraphs.map((p, i) => {
    const delay = i === 0 ? '' : ` delay-${i}`;
    return `        <p class="reveal${delay}">\n          ${mdInline(p)}\n        </p>`;
  }).join('\n');
}

function renderArchiveItem(iso, title, blurb) {
  const pretty = prettyDate(iso);
  return `        <li>
          <span class="archive-date"><a href="/now/archive/${iso}.html">${pretty}</a></span>
          <span class="archive-blurb">${mdInline(blurb)}</span>
        </li>`;
}

function archivePageHtml(iso, title, paragraphs) {
  const pretty = prettyDate(iso);
  const body = paragraphs.map((p) => `      <p>${mdInline(p)}</p>`).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Now — ${pretty} · Neil Busque</title>
  <link rel="canonical" href="https://busqueneil.com/now/archive/${iso}.html" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/logo/favicon-32.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/main.css" />
</head>
<body>
<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><img src="/assets/logo/icon-color.png" alt="" width="32" height="32" /><span class="nav-name">Neil Busque</span></a>
    <div class="nav-right"><a class="nav-cta" href="/now/">← All past states</a></div>
  </div>
</nav>
<main>
  <header class="hero">
    <div class="wrap">
      <div class="eyebrow">Archived Now · <time datetime="${iso}">${pretty}</time></div>
      <h1 class="display" style="font-size: clamp(2rem, 5vw, 3rem);">${mdInline(title)}</h1>
    </div>
  </header>
  <section>
    <div class="wrap about-prose">
${body}
    </div>
  </section>
</main>
<footer><div class="foot-inner"><a href="/" class="foot-mark"><img src="/assets/logo/icon-color.png" alt="" width="26" height="26" /><span>Neil Busque</span></a><div>&copy; <span data-year>2026</span> Neil Busque · <a href="/now/">/now</a></div></div></footer>
<script src="/js/main.js" defer></script>
</body>
</html>
`;
}

// --- Main ---
const draftPath = process.argv[2];
if (!draftPath) fail('usage: node scripts/update-now.js path/to/draft.md');
if (!fs.existsSync(draftPath)) fail(`draft not found: ${draftPath}`);

const { title: newTitle, paragraphs: newParas } = parseDraft(draftPath);
const newIso = todayISO();
const newPretty = prettyDate(newIso);

// 1. Read current state of now/index.html.
let nowSrc = fs.readFileSync(NOW, 'utf8');
const oldTitle = between(nowSrc, MARK.nowCurrentTitleStart, MARK.nowCurrentTitleEnd, 'now/index.html').inner.trim();
const oldDate = between(nowSrc, MARK.nowCurrentDateStart, MARK.nowCurrentDateEnd, 'now/index.html').inner.trim();
const oldBody = between(nowSrc, MARK.nowCurrentStart, MARK.nowCurrentEnd, 'now/index.html').inner.trim();

// 2. Extract old paragraphs from the rendered HTML — strip tags.
const oldParas = (oldBody.match(/<p[^>]*>([\s\S]*?)<\/p>/g) || []).map((p) =>
  p.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
);
const oldBlurb = oldParas[0] ? oldParas[0].slice(0, 140) + (oldParas[0].length > 140 ? '…' : '') : '';

// 3. Write the old block to the archive directory.
fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
const archivePath = path.join(ARCHIVE_DIR, `${oldDate}.html`);
fs.writeFileSync(archivePath, archivePageHtml(oldDate, oldTitle, oldParas));

// 4. Prepend new archive list item on now/index.html.
const archiveItem = renderArchiveItem(oldDate, oldTitle, oldBlurb);
nowSrc = replaceBetween(
  nowSrc,
  MARK.nowArchiveListStart,
  MARK.nowArchiveListEnd,
  archiveItem + (between(nowSrc, MARK.nowArchiveListStart, MARK.nowArchiveListEnd, 'now').inner.includes('archive-empty')
    ? ''
    : '\n' + between(nowSrc, MARK.nowArchiveListStart, MARK.nowArchiveListEnd, 'now').inner.trim()),
  'now/index.html'
);

// 5. Replace current block with new draft.
nowSrc = replaceBetween(nowSrc, MARK.nowCurrentTitleStart, MARK.nowCurrentTitleEnd, newTitle, 'now/index.html');
nowSrc = replaceBetween(nowSrc, MARK.nowCurrentDateStart, MARK.nowCurrentDateEnd, newIso, 'now/index.html');
nowSrc = replaceBetween(nowSrc, MARK.nowCurrentStart, MARK.nowCurrentEnd, renderNowCurrentBody(newParas), 'now/index.html');

// Also update the "Updated" line in /now's hero.
nowSrc = nowSrc.replace(
  /Updated <time datetime="[^"]+">[^<]+<\/time>/,
  `Updated <time datetime="${newIso}">${newPretty}</time>`
);

fs.writeFileSync(NOW, nowSrc);

// 6. Update home page Now block (date + body).
let homeSrc = fs.readFileSync(HOME, 'utf8');
homeSrc = replaceBetween(homeSrc, MARK.homeNowBodyStart, MARK.homeNowBodyEnd, renderHomeBody(newParas), 'index.html');
homeSrc = replaceBetween(homeSrc, MARK.homeNowDateStart, MARK.homeNowDateEnd, `<time datetime="${newIso}">${newPretty}</time>`, 'index.html');

// "Last updated" stamps in footer + meta — both pages.
homeSrc = homeSrc.replace(
  /Last updated <time datetime="[^"]+">[^<]+<\/time>/g,
  `Last updated <time datetime="${newIso}">${newPretty}</time>`
);
nowSrc = fs.readFileSync(NOW, 'utf8');
nowSrc = nowSrc.replace(
  /Last updated <time datetime="[^"]+">[^<]+<\/time>/g,
  `Last updated <time datetime="${newIso}">${newPretty}</time>`
);
fs.writeFileSync(NOW, nowSrc);
fs.writeFileSync(HOME, homeSrc);

console.log(`update-now: archived "${oldTitle}" (${oldDate}) → now/archive/${oldDate}.html`);
console.log(`update-now: new current "${newTitle}" (${newIso}) wired into home + /now.`);
console.log(`update-now: commit + push to deploy.`);
