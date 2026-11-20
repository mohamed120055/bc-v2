// Turns dist-share/index.html into a page body for the claude.ai sharing host,
// which supplies its own <html>/<head>/<body> skeleton.
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('dist-share/index.html', 'utf8');
const pick = (re) => [...html.matchAll(re)].map((m) => m[0]).join('\n');
const title = html.match(/<title>[\s\S]*?<\/title>/)[0];
const styles = pick(/<style[\s\S]*?<\/style>/g);
const scripts = pick(/<script[\s\S]*?<\/script>/g);

const out = [
  title,
  `<meta name="theme-color" content="#F2A541">`,
  `<script>document.documentElement.dir='rtl';document.documentElement.lang='ar';</script>`,
  styles,
  `<div id="root"></div>`,
  scripts,
].join('\n');

writeFileSync('dist-share/kelimat.html', out);
console.log(`wrote dist-share/kelimat.html (${(out.length / 1024).toFixed(0)} KB)`);
