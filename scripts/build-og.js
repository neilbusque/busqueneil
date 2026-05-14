#!/usr/bin/env node
/**
 * build-og.js — render og.png from scripts/og.html via Puppeteer.
 *
 * Requires a local server running at PORT (default 8080) serving
 * the brand-site root. The package.json `dev` script starts one
 * via `python3 -m http.server 8080`.
 *
 * Usage:
 *   npm run dev       # in another terminal
 *   npm run og
 */

const puppeteer = require('puppeteer');
const path = require('path');

const PORT = process.env.PORT || 8080;
const URL = `http://localhost:${PORT}/scripts/og.html`;
const OUT = path.resolve(__dirname, '..', 'og.png');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 20000 });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: OUT,
    type: 'png',
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  await browser.close();
  console.log(`og.png written → ${OUT}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
