import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'client', 'dist', 'public');
const sitemapNames = ['sitemap-core.xml', 'sitemap-guide.xml', 'sitemap-dream.xml', 'sitemap-dictionary.xml'];
const baseUrl = 'https://muunsaju.com';

function getUrls(sitemapName) {
  const file = path.join(publicDir, sitemapName);
  if (!fs.existsSync(file)) throw new Error(`Missing sitemap output: ${sitemapName}`);
  const xml = fs.readFileSync(file, 'utf8');
  return [...xml.matchAll(/<loc>(https:\/\/muunsaju\.com[^<]+)<\/loc>/g)].map((match) => match[1]);
}

function outputPath(url) {
  const pathname = new URL(url).pathname;
  return pathname === '/' ? path.join(publicDir, 'index.html') : path.join(publicDir, pathname, 'index.html');
}

function canonicalFromHtml(html) {
  return html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] || null;
}

function titleFromHtml(html) {
  return html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() || '';
}

const issues = [];
let checked = 0;
for (const sitemapName of sitemapNames) {
  for (const url of getUrls(sitemapName)) {
    checked += 1;
    const file = outputPath(url);
    if (!fs.existsSync(file)) {
      issues.push(`${url} -> missing prerender file`);
      continue;
    }
    const html = fs.readFileSync(file, 'utf8');
    const canonical = canonicalFromHtml(html);
    const title = titleFromHtml(html);
    if (!title || (url !== `${baseUrl}/` && title === '무운 사주 - 무료 사주, 운세, 궁합, 꿈해몽')) {
      issues.push(`${url} -> generic or missing title`);
    }
    if (canonical !== url) {
      issues.push(`${url} -> canonical=${canonical || 'missing'}`);
    }
  }
}

if (issues.length) {
  console.error(`❌ Prerender integrity failed: ${issues.length}/${checked} URLs invalid`);
  for (const issue of issues.slice(0, 100)) console.error(` - ${issue}`);
  if (issues.length > 100) console.error(` ... ${issues.length - 100} more`);
  process.exit(1);
}

console.log(`✅ Prerender integrity passed: ${checked} sitemap URLs have unique static HTML and self-canonicals.`);
