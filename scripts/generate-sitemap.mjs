#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  shouldExcludeDreamSlug,
  shouldExcludeGuideSlug,
  shouldExcludeDictionarySlug,
} from './sitemap-exclusions.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'client/public');
const POPULAR_BIRTH_DATES_FILE = path.join(ROOT_DIR, 'popular-birth-dates.json');
const BASE_URL = 'https://muunsaju.com';

const DEFAULT_SUPABASE_URL = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

function normalizeSlug(value) {
  return String(value || '').trim();
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
  const today = new Date().toISOString().split('T')[0];
  const items = urls.map((u) => `  <url>\n    <loc>${escapeXml(u)}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

function sitemapIndexXml(files) {
  const today = new Date().toISOString().split('T')[0];
  const items = files.map((f) => `  <sitemap>\n    <loc>${BASE_URL}/${escapeXml(f)}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`).join('\n');
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

function parseLocsFromSitemap(filename) {
  const filePath = path.join(PUBLIC_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  const xml = fs.readFileSync(filePath, 'utf-8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).filter(Boolean);
}

function extractSlugFromUrl(url, prefix) {
  if (!url.startsWith(`${BASE_URL}${prefix}`)) return null;
  const slug = url.slice(`${BASE_URL}${prefix}`.length);
  return slug ? decodeURIComponent(slug) : null;
}

function loadFallbackSlugs(filename, prefix) {
  return parseLocsFromSitemap(filename)
    .map((url) => extractSlugFromUrl(url, prefix))
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

async function fetchRestTable(tableName, { select = '*', filters = [], order = [], limit } = {}) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${tableName}`);
  url.searchParams.set('select', select);

  for (const filter of filters) {
    const op = filter.op || 'eq';
    const value = typeof filter.value === 'boolean' ? (filter.value ? 'true' : 'false') : String(filter.value);
    url.searchParams.set(filter.field, `${op}.${value}`);
  }

  for (const sortExpr of order) {
    url.searchParams.append('order', sortExpr);
  }

  if (typeof limit === 'number' && Number.isFinite(limit)) {
    url.searchParams.set('limit', String(limit));
  }

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`${tableName} REST fetch failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error(`${tableName} fetch returned non-array payload`);
  }

  return data;
}

async function loadDictionaryRows() {
  try {
    const rows = await fetchRestTable('fortune_dictionary', {
      select: 'slug',
      filters: [{ field: 'published', value: true }],
      order: ['published_at.desc.nullslast', 'created_at.desc'],
      limit: 500,
    });
    return { rows, source: 'supabase-rest' };
  } catch (error) {
    console.warn(`⚠️ dictionary fetch 실패, 기존 sitemap로 폴백: ${error instanceof Error ? error.message : error}`);
    return { rows: loadFallbackSlugs('sitemap-dictionary.xml', '/dictionary/'), source: 'existing-sitemap' };
  }
}

async function loadGuideRows() {
  try {
    const rows = await fetchRestTable('columns', {
      select: 'id,slug',
      filters: [{ field: 'published', value: true }],
      order: ['published_at.desc.nullslast', 'created_at.desc'],
      limit: 500,
    });
    return { rows, source: 'supabase-rest' };
  } catch (error) {
    console.warn(`⚠️ guide fetch 실패, 기존 sitemap로 폴백: ${error instanceof Error ? error.message : error}`);
    return { rows: loadFallbackSlugs('sitemap-guide.xml', '/guide/'), source: 'existing-sitemap' };
  }
}

async function loadDreamRows() {
  try {
    const rows = await fetchRestTable('dreams', {
      select: 'id,slug',
      filters: [{ field: 'published', value: true }],
      order: ['published_at.desc.nullslast', 'created_at.desc'],
      limit: 1000,
    });
    return { rows, source: 'supabase-rest' };
  } catch (error) {
    console.warn(`⚠️ dream fetch 실패, 기존 sitemap로 폴백: ${error instanceof Error ? error.message : error}`);
    return { rows: loadFallbackSlugs('sitemap-dream.xml', '/dream/'), source: 'existing-sitemap' };
  }
}

function buildDictionaryUrls(rows) {
  const counters = { manual: 0, empty: 0 };
  const urls = [];

  for (const row of rows) {
    const slug = normalizeSlug(row.slug || row.id);
    const { exclude, reason } = shouldExcludeDictionarySlug(slug);
    if (exclude) {
      counters[reason] = (counters[reason] || 0) + 1;
      continue;
    }
    urls.push(`${BASE_URL}/dictionary/${slug}`);
  }

  return { urls: uniqueOrdered(urls), counters };
}

function buildGuideUrls(rows) {
  const counters = { manual: 0, 'legacy-uuid': 0, empty: 0 };
  const urls = [];

  for (const row of rows) {
    const slug = normalizeSlug(row.slug || row.id);
    const { exclude, reason } = shouldExcludeGuideSlug(slug);
    if (exclude) {
      counters[reason] = (counters[reason] || 0) + 1;
      continue;
    }
    urls.push(`${BASE_URL}/guide/${slug}`);
  }

  return { urls: uniqueOrdered(urls), counters };
}

function buildDreamUrls(rows) {
  const normalizedSlugs = rows.map((row) => normalizeSlug(row.slug || row.id)).filter(Boolean);
  const existingSlugSet = new Set(normalizedSlugs);
  const counters = { manual: 0, 'duplicate-suffix': 0, empty: 0 };
  const urls = [];

  for (const slug of normalizedSlugs) {
    const { exclude, reason } = shouldExcludeDreamSlug(slug, existingSlugSet);
    if (exclude) {
      counters[reason] = (counters[reason] || 0) + 1;
      continue;
    }
    urls.push(`${BASE_URL}/dream/${slug}`);
  }

  return { urls: uniqueOrdered(urls), counters };
}

function loadYearlyFortuneUrls() {
  try {
    const raw = fs.readFileSync(POPULAR_BIRTH_DATES_FILE, 'utf-8');
    const data = JSON.parse(raw);
    const birthDates = Array.isArray(data.birth_dates) ? data.birth_dates : [];
    return uniqueOrdered(
      birthDates
        .map((value) => String(value || '').trim())
        .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value))
        .map((value) => `${BASE_URL}/yearly-fortune/${value}`),
    );
  } catch (error) {
    console.warn(`⚠️ yearly-fortune 생성 실패: ${error instanceof Error ? error.message : error}`);
    return [];
  }
}

function generateCoreUrls() {
  const pages = [
    '/',
    '/naming',
    '/fortune-dictionary',
    '/yearly-fortune',
    '/lifelong-saju',
    '/compatibility',
    '/family-saju',
    '/tarot',
    '/tojeong',
    '/astrology',
    '/daily-fortune',
    '/manselyeok',
    '/hybrid-compatibility',
    '/psychology',
    '/lucky-lunch',
    '/about',
  ];

  return pages.map((page) => `${BASE_URL}${page}`);
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
  console.log('🚀 Sitemap 생성 시작 (Search Console 제외 규칙 반영)\n' + '='.repeat(60));

  const [dictionaryResult, guideResult, dreamResult] = await Promise.all([
    loadDictionaryRows(),
    loadGuideRows(),
    loadDreamRows(),
  ]);

  const dictionary = buildDictionaryUrls(dictionaryResult.rows);
  const guide = buildGuideUrls(guideResult.rows);
  const dream = buildDreamUrls(dreamResult.rows);
  const yearlyFortuneUrls = loadYearlyFortuneUrls();
  const coreUrls = generateCoreUrls();

  console.log(`📚 dictionary source: ${dictionaryResult.source}`);
  console.log(`📚 guide source: ${guideResult.source}`);
  console.log(`📚 dream source: ${dreamResult.source}`);
  console.log(`🧹 dictionary excluded: ${JSON.stringify(dictionary.counters)}`);
  console.log(`🧹 guide excluded: ${JSON.stringify(guide.counters)}`);
  console.log(`🧹 dream excluded: ${JSON.stringify(dream.counters)}`);

  console.log('\n📝 XML 파일 생성 중...');
  saveFile('sitemap-core.xml', urlsetXml(coreUrls));
  saveFile('sitemap-dictionary.xml', urlsetXml(dictionary.urls));
  saveFile('sitemap-guide.xml', urlsetXml([`${BASE_URL}/guide`, ...guide.urls]));
  saveFile('sitemap-dream.xml', urlsetXml([`${BASE_URL}/dream`, ...dream.urls]));
  saveFile('sitemap-yearly-fortune.xml', urlsetXml(yearlyFortuneUrls));
  saveFile('sitemap.xml', generateIndex());

  const total = coreUrls.length + dictionary.urls.length + guide.urls.length + 1 + dream.urls.length + 1 + yearlyFortuneUrls.length;
  console.log(`\n✅ 총 ${total}개 URL 생성 완료`);
  console.log(`   core: ${coreUrls.length} | dictionary: ${dictionary.urls.length} | guide: ${guide.urls.length + 1} | dream: ${dream.urls.length + 1} | yearly: ${yearlyFortuneUrls.length}`);
  console.log('\n' + '='.repeat(60));
  console.log('✅ 사이트맵 생성 완료!\n');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error instanceof Error ? error.message : error);
  process.exit(1);
});
