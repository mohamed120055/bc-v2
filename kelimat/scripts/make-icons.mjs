// Renders the Ursu React component into public/icon.svg + PNG app icons (via the preinstalled Playwright).
import { createServer } from 'vite';
import { writeFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRequire } from 'node:module';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const { default: Ursu } = await vite.ssrLoadModule('/src/components/Ursu.jsx');
await vite.close();

const bear = renderToStaticMarkup(createElement(Ursu, { size: 120 })).replace(/^<svg[^>]*>|<\/svg>$/g, '');

// padding: fraction of the canvas left around the bear (maskable icons need a bigger safe zone)
const iconSvg = (pad, rounded) => {
  const s = 120 + pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${s} ${s}">` +
    `<rect x="${-pad}" y="${-pad}" width="${s}" height="${s}" rx="${rounded ? s * 0.22 : 0}" fill="#F2A541"/>${bear}</svg>`;
};

writeFileSync('public/icon.svg', iconSvg(12, true));

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import('playwright')); }
const browser = await chromium.launch();
const page = await browser.newPage();
const targets = [
  ['public/icon-192.png', 192, iconSvg(12, false)],
  ['public/icon-512.png', 512, iconSvg(12, false)],
  ['public/icon-maskable-512.png', 512, iconSvg(36, false)],
  ['public/apple-touch-icon.png', 180, iconSvg(14, false)],
];
for (const [file, px, svg] of targets) {
  await page.setViewportSize({ width: px, height: px });
  await page.setContent(`<style>*{margin:0}svg{display:block;width:${px}px;height:${px}px}</style>${svg}`);
  await page.screenshot({ path: file, omitBackground: true });
  console.log('wrote', file);
}
await browser.close();
