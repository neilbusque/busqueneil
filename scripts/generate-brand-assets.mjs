import { readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

/* Renders the brand marks in public/assets/brand/*.svg to the PNG icons and favicon.ico.
   Colors live in the SVGs: cobalt #2346E8 (fold #1A37C4), ink #0E1116, ground #F7F8FA.
   Run with `npm run brand:assets` after changing an SVG, then bump ?v= in Base.astro. */

const brand = new URL('../public/assets/brand/', import.meta.url);
const legacy = new URL('../public/assets/logo/', import.meta.url);
const publicDir = new URL('../public/', import.meta.url);

async function png(sourceName, size) {
  const svg = await readFile(new URL(sourceName, brand), 'utf8');
  return new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

async function render(sourceName, outputName, size, destination = brand) {
  await writeFile(new URL(outputName, destination), await png(sourceName, size));
}

/* An .ico file that wraps PNG images, which every current browser reads. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + 16 * images.length;
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

await Promise.all([
  render('app-icon.svg', 'icon-1024.png', 1024),
  render('app-icon.svg', 'icon-512.png', 512),
  render('app-icon.svg', 'icon-192.png', 192),
  render('app-icon.svg', 'apple-touch-icon-180.png', 180),
  render('app-icon.svg', 'favicon-32.png', 32),
  render('app-icon.svg', 'favicon-16.png', 16),
  render('maskable-icon.svg', 'maskable-512.png', 512),
  render('app-icon.svg', 'icon-512.png', 512, legacy),
  render('app-icon.svg', 'icon-color.png', 512, legacy),
  render('mark-mono.svg', 'icon-mono.png', 512, legacy),
  render('app-icon.svg', 'apple-touch-icon-180.png', 180, legacy),
  render('app-icon.svg', 'favicon-32.png', 32, legacy),
  render('app-icon.svg', 'favicon-16.png', 16, legacy),
]);

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(async (size) => ({ size, data: await png('app-icon.svg', size) })));
await writeFile(new URL('favicon.ico', publicDir), ico(images));

console.log('Generated the brand icons and favicon.ico.');
