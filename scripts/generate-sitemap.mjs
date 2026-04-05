#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadColumnsDataset, loadDreamsDataset, loadDictionaryDataset } from './utils/content-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'client/public');
const POPULAR_BIRTH_DATES_FILE = path.join(ROOT_DIR, 'popular-birth-dates.json');
const BASE_URL = 'https://muunsaju.com';
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeSlug(value) {
  return String(value || '').trim().toLowerCase();
}

function isValidSlug(value) {
  return SLUG_PATTERN.test(normalizeSlug(value));
}

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlsetXml(urls) {
  const items = urls.map((u) => `  <url>\n    <loc>${escapeXml(u)}</loc>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

function sitemapIndexXml(files) {
  const items = files.map((f) => `  <sitemap>\n    <loc>${BASE_URL}/${escapeXml(f)}</loc>\n  </sitemap>`).join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

function saveFile(filename, content) {
  const filePath = path.join(PUBLIC_DIR, filename);
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
  const kb = (fs.statSync(filePath).size / 1024).toFixed(1);
  console.log(`💾 ${filename} 저장 완료 (${kb} KB)`);
}

function uniqueOrdered(values) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }
  return result;
}

function buildGuideUrls(rows) {
  return uniqueOrdered(
    rows
      .map((row) => normalizeSlug(row.slug || row.id))
      .filter(isValidSlug)
      .map((slug) => `${BASE_URL}/guide/${slug}`),
  );
}

function buildDreamUrls(rows) {
  return uniqueOrdered(
    rows
      .map((row) => normalizeSlug(row.slug || row.id))
      .filter(isValidSlug)
      .map((slug) => `${BASE_URL}/dream/${slug}`),
  );
}

function buildDictionaryUrls(rows) {
  return uniqueOrdered(
    rows
      .map((row) => normalizeSlug(row.slug || row.id))
      .filter(isValidSlug)
      .map((slug) => `${BASE_URL}/dictionary/${slug}`),
  );
}

function loadYearlyFortuneUrls() {
  try {
    if (!fs.existsSync(POPULAR_BIRTH_DATES_FILE)) {
      const fallback = [];
      for (let year = 1970; year <= 2020; year += 1) fallback.push(`${BASE_URL}/yearly-fortune/${year}-01-01`);
      return fallback;
    }

    const data = JSON.parse(fs.readFileSync(POPULAR_BIRTH_DATES_FILE, 'utf-8'));
    const birthDates = Array.isArray(data.birth_dates) ? data.birth_dates : [];

    return uniqueOrdered(
      birthDates
        .map((value) => String(value || '').trim())
        .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value))
        .map((value) => `${BASE_URL}/yearly-fortune/${value}`),
    );
  } catch (error) {
    console.warn('⚠️ yearly-fortune URL 생성 실패:', error instanceof Error ? error.message : error);
    return [];
  }
}

function generateCore() {
  const pages = [
    '/', '/naming', '/fortune-dictionary', '/yearly-fortune', '/lifelong-saju', '/compatibility', '/family-saju',
    '/tarot', '/tojeong', '/astrology', '/daily-fortune', '/manselyeok', '/hybrid-compatibility', '/psychology',
    '/lucky-lunch', '/about', '/contact', '/privacy', '/terms', '/guide', '/dream', '/more',
  ];
  return urlsetXml(pages.map((page) => `${BASE_URL}${page}`));
}

function generateIndex() {
  return sitemapIndexXml([
    'sitemap-core.xml',
    'sitemap-dictionary.xml',
    'sitemap-guide.xml',
    'sitemap-dream.xml',
    'sitemap-yearly-fortune.xml',
  ]);
}

async function main() {
  console.log('🚀 Sitemap 생성 시작 (백업 폴백 지원)\n' + '='.repeat(50));

  const [dictionaryResult, guideResult, dreamResult] = await Promise.all([
    loadDictionaryDataset({ limit: 500 }),
    loadColumnsDataset({ limit: 500 }),
    loadDreamsDataset({ limit: 1000 }),
  ]);

  const dictionaryUrls = buildDictionaryUrls(dictionaryResult.rows);
  const guideUrls = buildGuideUrls(guideResult.rows);
  const dreamUrls = buildDreamUrls(dreamResult.rows);
  const yearlyFortuneUrls = loadYearlyFortuneUrls();

  console.log(`📚 dictionary source: ${dictionaryResult.source}`);
  console.log(`📚 guide source: ${guideResult.source}`);
  console.log(`📚 dream source: ${dreamResult.source}`);

  console.log('\n📝 XML 파일 생성 중...');
  saveFile('sitemap-core.xml', generateCore());
  saveFile('sitemap-dictionary.xml', urlsetXml([`${BASE_URL}/fortune-dictionary`, ...dictionaryUrls]));
  saveFile('sitemap-guide.xml', urlsetXml([`${BASE_URL}/guide`, ...guideUrls]));
  saveFile('sitemap-dream.xml', urlsetXml([`${BASE_URL}/dream`, ...dreamUrls]));
  saveFile('sitemap-yearly-fortune.xml', urlsetXml(yearlyFortuneUrls));
  saveFile('sitemap.xml', generateIndex());

  const coreCount = 22;
  const total = coreCount + dictionaryUrls.length + 1 + guideUrls.length + 1 + dreamUrls.length + 1 + yearlyFortuneUrls.length;
  console.log(`\n✅ 총 ${total}개 URL 생성 완료`);
  console.log(`   core: ${coreCount} | dictionary: ${dictionaryUrls.length + 1} | guide: ${guideUrls.length + 1} | dream: ${dreamUrls.length + 1} | yearly: ${yearlyFortuneUrls.length}`);
  console.log('\n' + '='.repeat(50));
  console.log('✅ 사이트맵 생성 완료!\n');
}

main().catch((err) => {
  console.error('❌ Fatal error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
