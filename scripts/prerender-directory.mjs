// Prerender the hallway directory into index.html so every reader sees the doors.
// Mirrors renderStorefronts() in /hallway.js. No dependencies.
// Usage: node scripts/prerender-directory.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const storesPath = join(root, 'data', 'stores.json');
const indexPath = join(root, 'index.html');
const START = '<!-- prerender:storefronts:start -->';
const END = '<!-- prerender:storefronts:end -->';

const esc = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const stores = JSON.parse(readFileSync(storesPath, 'utf8'));

const doors = stores.map((store, index) => {
  const cls = `storefront${store.status === 'construction' ? ' under-construction' : ''}`;
  const loading = index > 2 ? 'lazy' : 'eager';
  return [
    `      <a class="${cls}" href="${esc(store.path)}" data-unit="${esc(store.id)}" data-index="${index}">`,
    `        <img class="storefront__door" src="${esc(store.image)}" alt="${esc(store.name)}" loading="${loading}" decoding="async">`,
    `        <div class="storefront__text"><h2>${esc(store.name)}</h2><p>${esc(store.description || '')}</p></div>`,
    `      </a>`
  ].join('\n');
}).join('\n');

const html = readFileSync(indexPath, 'utf8');
const a = html.indexOf(START);
const b = html.indexOf(END);
if (a < 0 || b < a) {
  console.error('Marker comments not found in index.html');
  process.exit(1);
}
const out = `${html.slice(0, a + START.length)}\n${doors}\n      ${html.slice(b)}`;
writeFileSync(indexPath, out);
console.log(`Prerendered ${stores.length} doors into index.html`);
