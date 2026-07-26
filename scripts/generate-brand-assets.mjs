import { readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

const brand = new URL('../public/assets/brand/', import.meta.url);
const legacy = new URL('../public/assets/logo/', import.meta.url);

async function render(sourceName, outputName, size, destination = brand) {
  const svg = await readFile(new URL(sourceName, brand), 'utf8');
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  await writeFile(new URL(outputName, destination), png);
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

console.log('Generated unified busqueneil brand icons.');
