#!/usr/bin/env node

/**
 * MUUN sitemap generator
 *
 * Goals:
 * - Only list final, canonical, indexable URLs.
 * - Keep /yearly-fortune/:birthDate result pages out of the sitemap.
 * - Keep sitemap output aligned with prerendered dynamic detail pages.
 * - Avoid putting legacy UUID redirects, deleted slugs, Korean/non-prerendered slugs,
 *   duplicate variants, or known GSC exclusions into sitemap files.
 */

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
const BASE_URL = 'https://muunsaju.com';

// Must match the dynamic-page prerender rule. Korean/legacy slugs are not prerendered,
// so they should not be submitted in XML sitemaps.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const CORE_PATHS = [
  '/',
  '/yearly-fortune',
  '/manselyeok',
  '/daily-fortune',
  '/lifelong-saju',
  '/compatibility',
  '/family-saju',
  '/hybrid-compatibility',
  '/tojeong',
  '/psychology',
  '/astrology',
  '/tarot',
  '/tarot-history',
  '/dream',
  '/fortune-dictionary',
  '/guide',
  '/naming',
  '/lucky-lunch',
  '/past-life',
  '/about',
  '/privacy',
  '/terms',
  '/contact',
];

function normalizeSlug(value) {
  return String(value || '').trim().toLowerCase();
}

function isValidPrerenderedSlug(value) {
  const slug = normalizeSlug(value);
  return SLUG_PATTERN.test(slug) && !UUID_PATTERN.test(slug);
}

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function uniqueOrdered(values) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    const normalized = String(value || '').trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

function urlsetXml(urls) {
  const items = urls
    .map((u) => `  <url>\n    <loc>${escapeXml(u)}</loc>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

function sitemapIndexXml(files) {
  const items = files
    .map((f) => `  <sitemap>\n    <loc>${BASE_URL}/${escapeXml(f)}</loc>\n  </sitemap>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

function saveFile(filename, content) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  const filePath = path.join(PUBLIC_DIR, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  const kb = (fs.statSync(filePath).size / 1024).toFixed(1);
  console.log(`💾 ${filename} saved (${kb} KB)`);
}

function removeFileIfExists(filename) {
  const filePath = path.join(PUBLIC_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🧹 ${filename} removed`);
  }
}

function parseLocsFromSitemap(filename) {
  const filePath = path.join(PUBLIC_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  const xml = fs.readFileSync(filePath, 'utf-8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].trim())
    .filter(Boolean);
}

function extractSlugFromUrl(url, prefix) {
  const basePrefix = `${BASE_URL}${prefix}`;
  if (!url.startsWith(basePrefix)) return null;
  const slug = url.slice(basePrefix.length);
  if (!slug) return null;
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function loadFallbackRows(filename, prefix) {
  return parseLocsFromSitemap(filename)
    .map((url) => extractSlugFromUrl(url, prefix))
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

async function fetchRestTable(tableName, { select = '*', filters = [], order = [], limit } = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase env vars are missing; using existing sitemap fallback.');
  }

  const url = new URL(`${SUPABASE_URL}/rest/v1/${tableName}`);
  url.searchParams.set('select', select);

  for (const filter of filters) {
    const op = filter.op || 'eq';
    const value = typeof filter.value === 'boolean' ? (filter.value ? 'true' : 'false') : String(filter.value);
    url.searchParams.set(filter.field, `${op}.${value}`);
  }
  for (const sortExpr of order) url.searchParams.append('order', sortExpr);
  if (typeof limit === 'number' && Number.isFinite(limit)) url.searchParams.set('limit', String(limit));

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
  if (!Array.isArray(data)) throw new Error(`${tableName} fetch returned non-array payload`);
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
    console.warn(`⚠️ dictionary fetch fallback: ${error instanceof Error ? error.message : error}`);
    return { rows: loadFallbackRows('sitemap-dictionary.xml', '/dictionary/'), source: 'existing-sitemap' };
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
    console.warn(`⚠️ guide fetch fallback: ${error instanceof Error ? error.message : error}`);
    return { rows: loadFallbackRows('sitemap-guide.xml', '/guide/'), source: 'existing-sitemap' };
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
    console.warn(`⚠️ dream fetch fallback: ${error instanceof Error ? error.message : error}`);
    return { rows: loadFallbackRows('sitemap-dream.xml', '/dream/'), source: 'existing-sitemap' };
  }
}

function buildDictionaryUrls(rows) {
  const counters = { invalidSlug: 0, excluded: 0 };
  const urls = [];

  for (const row of rows) {
    const slug = normalizeSlug(row.slug);
    if (!isValidPrerenderedSlug(slug)) {
      counters.invalidSlug += 1;
      continue;
    }
    const { exclude } = shouldExcludeDictionarySlug(slug);
    if (exclude) {
      counters.excluded += 1;
      continue;
    }
    urls.push(`${BASE_URL}/dictionary/${slug}`);
  }

  return { urls: uniqueOrdered(urls), counters };
}

function buildGuideUrls(rows) {
  const counters = { invalidSlug: 0, excluded: 0 };
  const urls = [];

  for (const row of rows) {
    const slug = normalizeSlug(row.slug || row.id);
    if (!isValidPrerenderedSlug(slug)) {
      counters.invalidSlug += 1;
      continue;
    }
    const { exclude } = shouldExcludeGuideSlug(slug);
    if (exclude) {
      counters.excluded += 1;
      continue;
    }
    urls.push(`${BASE_URL}/guide/${slug}`);
  }

  return { urls: uniqueOrdered(urls), counters };
}

function buildDreamUrls(rows) {
  const rawSlugs = rows.map((row) => normalizeSlug(row.slug)).filter(Boolean);
  const validSlugSet = new Set(rawSlugs.filter(isValidPrerenderedSlug));
  const counters = { invalidSlug: 0, excluded: 0 };
  const urls = [];

  for (const slug of rawSlugs) {
    if (!isValidPrerenderedSlug(slug)) {
      counters.invalidSlug += 1;
      continue;
    }
    const { exclude } = shouldExcludeDreamSlug(slug, validSlugSet);
    if (exclude) {
      counters.excluded += 1;
      continue;
    }
    urls.push(`${BASE_URL}/dream/${slug}`);
  }

  return { urls: uniqueOrdered(urls), counters };
}

async function main() {
  console.log('🚀 MUUN sitemap generation started');

  const [dictionaryResult, guideResult, dreamResult] = await Promise.all([
    loadDictionaryRows(),
    loadGuideRows(),
    loadDreamRows(),
  ]);

  const coreUrls = CORE_PATHS.map((p) => `${BASE_URL}${p === '/' ? '/' : p}`);
  const dictionary = buildDictionaryUrls(dictionaryResult.rows);
  const guide = buildGuideUrls(guideResult.rows);
  const dream = buildDreamUrls(dreamResult.rows);

  console.log(`📚 dictionary source: ${dictionaryResult.source}`);
  console.log(`📚 guide source: ${guideResult.source}`);
  console.log(`📚 dream source: ${dreamResult.source}`);
  console.log(`🧹 dictionary filtered: ${JSON.stringify(dictionary.counters)}`);
  console.log(`🧹 guide filtered: ${JSON.stringify(guide.counters)}`);
  console.log(`🧹 dream filtered: ${JSON.stringify(dream.counters)}`);

  saveFile('sitemap-core.xml', urlsetXml(coreUrls));
  saveFile('sitemap-dictionary.xml', urlsetXml(dictionary.urls));
  saveFile('sitemap-guide.xml', urlsetXml(guide.urls));
  saveFile('sitemap-dream.xml', urlsetXml(dream.urls));

  // Important: personalized/generated yearly result pages should not be submitted.
  removeFileIfExists('sitemap-yearly-fortune.xml');

  saveFile('sitemap.xml', sitemapIndexXml([
    'sitemap-core.xml',
    'sitemap-dictionary.xml',
    'sitemap-guide.xml',
    'sitemap-dream.xml',
  ]));

  const total = coreUrls.length + dictionary.urls.length + guide.urls.length + dream.urls.length;
  console.log(`✅ Sitemap generation complete: ${total} URLs`);
  console.log(`   core: ${coreUrls.length} | dictionary: ${dictionary.urls.length} | guide: ${guide.urls.length} | dream: ${dream.urls.length}`);
}

main().catch((error) => {
  console.error('❌ Fatal sitemap error:', error instanceof Error ? error.message : error);
  process.exit(1);
});
