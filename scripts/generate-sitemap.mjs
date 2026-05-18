#!/usr/bin/env node

/**
 * MUUN sitemap generator — v3 (2026-05-10)
 *
 * 주요 개선사항:
 *  ① 모든 URL에 <lastmod>, <priority>, <changefreq> 추가 (Google 크롤링 신호)
 *  ② Guide URL: slug-{id.slice(0,8)} 패턴 강제 적용 (라우팅 형식 일치)
 *  ③ Dictionary/Dream도 동일 정규화로 stale slug 자동 수정
 *  ④ HEAD 요청으로 200 응답 검증 (선택적, VERIFY=1 환경변수)
 *  ⑤ 빈 콘텐츠 페이지 제외 옵션
 *
 * 사용법:
 *   pnpm run generate-sitemap                    # 기본
 *   VERIFY=1 pnpm run generate-sitemap          # URL 검증 포함 (느림)
 *   STRICT=1 pnpm run generate-sitemap          # 검증 실패 시 빌드 중단
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

const VERIFY_URLS = process.env.VERIFY === '1';
const STRICT_MODE = process.env.STRICT === '1';

// ────────────────────────────────────────────────────────────
// Slug 정규화 패턴
// ────────────────────────────────────────────────────────────

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HEX_SUFFIX_PATTERN = /-[0-9a-f]{8}$/;

// ── Supabase 접속 정보 (환경변수 우선, 없으면 기본값 사용) ──
const DEFAULT_SUPABASE_URL = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// ── Backup fallback 경로 ──
const BACKUPS_DIR = path.join(ROOT_DIR, 'backups');

/** 가장 최신 backup 날짜 폴더 경로에서 테이블 JSON 읽기 */
function readBackupTable(tableName) {
  if (!fs.existsSync(BACKUPS_DIR)) return [];
  const dirs = fs.readdirSync(BACKUPS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => b.localeCompare(a));
  for (const dir of dirs) {
    const fp = path.join(BACKUPS_DIR, dir, `${tableName}.json`);
    if (fs.existsSync(fp)) {
      try {
        const raw = JSON.parse(fs.readFileSync(fp, 'utf8'));
        return Array.isArray(raw) ? raw : [];
      } catch { continue; }
    }
  }
  return [];
}

/**
 * Dictionary short slug 감지: 20자 이하 & 하이픈 구분 단어가 3개 이하인 한국어 로마자 표기 slug.
 * 이런 slug는 DB 마이그레이션으로 새 slug로 대체됐거나 redirect/404 상태.
 * ⚠️ 단, DB에 실제로 존재하고 HTTP 200을 반환하는 유효한 short slug는 화이트리스트로 허용.
 */
const ALLOWED_SHORT_DICT_SLUGS = new Set([
  'am-rok', 'baek-ho-sal', 'bi-gyeon', 'chak-sal',
  'cheon-mun-seong', 'cheon-ui-seong', 'do-hwa-sal', 'do-sik',
  'gap-ja', 'geon-rok', 'geop-jae', 'go-ran-sal', 'goe-gang-sal',
  'hong-yeom-sal', 'hwa-gae-sal', 'hyeon-chim-sal', 'hyeong-sal',
  'jae-saeng-gwan', 'je-wang', 'jeong-gwan', 'jeong-in', 'jeong-jae',
  'pyeon-gwan', 'pyeon-in', 'sang-gwan', 'sik-sin',
  'won-jin-sal', 'yang-in-sal', 'yeok-ma-sal',
]);
function isLikelyStaleShortSlug(slug) {
  if (ALLOWED_SHORT_DICT_SLUGS.has(slug)) return false; // 유효한 short slug는 제외하지 않음
  return slug.length <= 20 && slug.split('-').length <= 3;
}

// ────────────────────────────────────────────────────────────
// Core 페이지 정의 (priority, changefreq, lastmod)
// ────────────────────────────────────────────────────────────
// 형식: [path, priority, changefreq, lastmodOverride]
//
// ⚠️ 콘텐츠가 빈약한 페이지(/yearly-fortune, /dream, /tarot, /guide)는
//    GSC 'Soft 404' 후보. 하단 콘텐츠 보강 필수 — 사이트맵에는 일단 포함.

const CORE_PAGES = [
  ['/',                     '1.0', 'daily',   null],
  // 핵심 서비스 (홈 네비에 노출)
  ['/yearly-fortune',       '0.9', 'weekly',  null],
  ['/compatibility',        '0.9', 'weekly',  null],
  ['/lifelong-saju',        '0.9', 'weekly',  null],
  ['/naming',               '0.9', 'weekly',  null],
  // 서브 서비스
  ['/manselyeok',           '0.8', 'monthly', null],
  ['/daily-fortune',        '0.8', 'daily',   null],
  ['/family-saju',          '0.8', 'monthly', null],
  ['/hybrid-compatibility', '0.7', 'monthly', null],
  ['/tojeong',              '0.8', 'monthly', null],
  ['/psychology',           '0.8', 'monthly', null],
  ['/astrology',            '0.8', 'monthly', null],
  ['/tarot',                '0.8', 'monthly', null],
  ['/tarot-history',        '0.6', 'monthly', '2025-03-01'],
  ['/dream',                '0.8', 'weekly',  null],
  ['/fortune-dictionary',   '0.8', 'weekly',  null],
  ['/guide',                '0.8', 'weekly',  null],
  ['/lucky-lunch',          '0.6', 'monthly', null],
  ['/past-life',            '0.6', 'monthly', null],
  // 정보성
  ['/about',                '0.5', 'yearly',  '2025-01-01'],
  ['/privacy',              '0.4', 'yearly',  '2025-01-01'],
  ['/terms',                '0.4', 'yearly',  '2025-01-01'],
  ['/contact',              '0.5', 'monthly', '2025-01-01'],
];

// ────────────────────────────────────────────────────────────
// 유틸
// ────────────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().slice(0, 10);
}

function toDateStr(value) {
  if (!value) return today();
  try {
    const d = new Date(value);
    return isNaN(d.getTime()) ? today() : d.toISOString().slice(0, 10);
  } catch {
    return today();
  }
}

function normalizeSlug(value) {
  return String(value || '').trim().toLowerCase();
}

function isValidPrerenderedSlug(value) {
  const slug = normalizeSlug(value);
  return SLUG_PATTERN.test(slug) && !UUID_PATTERN.test(slug);
}

function shortIdFromUuid(id) {
  const trimmed = String(id || '').trim().toLowerCase().replace(/^[^0-9a-f]/, '');
  const match = trimmed.match(/^([0-9a-f]{8})/);
  return match ? match[1] : null;
}

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function uniqueByLoc(entries) {
  const seen = new Set();
  const result = [];
  for (const entry of entries) {
    if (!entry || !entry.loc || seen.has(entry.loc)) continue;
    seen.add(entry.loc);
    result.push(entry);
  }
  return result;
}

// ────────────────────────────────────────────────────────────
// XML 빌더
// ────────────────────────────────────────────────────────────

function buildUrlBlock(entry) {
  const parts = [`    <loc>${escapeXml(entry.loc)}</loc>`];
  if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
  if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  if (entry.priority != null) parts.push(`    <priority>${entry.priority}</priority>`);
  return `  <url>\n${parts.join('\n')}\n  </url>`;
}

function urlsetXml(entries) {
  const items = entries.map(buildUrlBlock).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

function sitemapIndexXml(files) {
  const items = files
    .map((f) => `  <sitemap>\n    <loc>${BASE_URL}/${escapeXml(f)}</loc>\n    <lastmod>${today()}</lastmod>\n  </sitemap>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

function saveFile(filename, content) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  const filePath = path.join(PUBLIC_DIR, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  const kb = (fs.statSync(filePath).size / 1024).toFixed(1);
  console.log(`💾 ${filename} (${kb} KB)`);
}

function removeFileIfExists(filename) {
  const filePath = path.join(PUBLIC_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🧹 ${filename} 삭제됨`);
  }
}

// ────────────────────────────────────────────────────────────
// Supabase fetch
// ────────────────────────────────────────────────────────────

async function fetchRestTable(tableName, { select = '*', filters = [], order = [], limit } = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase 환경변수가 없음 → fallback 모드');
  }

  const url = new URL(`${SUPABASE_URL}/rest/v1/${tableName}`);
  url.searchParams.set('select', select);
  for (const filter of filters) {
    const op = filter.op || 'eq';
    const value = typeof filter.value === 'boolean' ? (filter.value ? 'true' : 'false') : String(filter.value);
    url.searchParams.set(filter.field, `${op}.${value}`);
  }
  for (const sortExpr of order) url.searchParams.append('order', sortExpr);
  if (typeof limit === 'number') url.searchParams.set('limit', String(limit));

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`${tableName} REST fetch 실패 (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) throw new Error(`${tableName} 응답이 배열이 아님`);
  return data;
}

async function loadDictionaryRows() {
  try {
    const rows = await fetchRestTable('fortune_dictionary', {
      select: 'id,slug,published_at,updated_at',
      filters: [{ field: 'published', value: true }],
      order: ['published_at.desc.nullslast', 'created_at.desc'],
      limit: 500,
    });
    console.log(`   ✅ dictionary Supabase: ${rows.length}개`);
    return rows;
  } catch (e) {
    console.warn(`   ⚠️ dictionary Supabase 실패 → backup 폴백: ${e.message}`);
    const rows = readBackupTable('fortune_dictionary').filter((r) => r.published !== false);
    console.log(`   📦 dictionary backup: ${rows.length}개`);
    if (STRICT_MODE) throw e;
    return rows;
  }
}

async function loadGuideRows() {
  try {
    const rows = await fetchRestTable('columns', {
      select: 'id,slug,published_at,updated_at',
      filters: [{ field: 'published', value: true }],
      order: ['published_at.desc.nullslast', 'created_at.desc'],
      limit: 500,
    });
    console.log(`   ✅ guide Supabase: ${rows.length}개`);
    return rows;
  } catch (e) {
    console.warn(`   ⚠️ guide Supabase 실패 → backup 폴백: ${e.message}`);
    const rows = readBackupTable('columns').filter((r) => r.published !== false);
    console.log(`   📦 guide backup: ${rows.length}개`);
    if (STRICT_MODE) throw e;
    return rows;
  }
}

async function loadDreamRows() {
  try {
    const rows = await fetchRestTable('dreams', {
      select: 'id,slug,published_at,updated_at',
      filters: [{ field: 'published', value: true }],
      order: ['published_at.desc.nullslast', 'created_at.desc'],
      limit: 1000,
    });
    console.log(`   ✅ dream Supabase: ${rows.length}개`);
    return rows;
  } catch (e) {
    console.warn(`   ⚠️ dream Supabase 실패 → backup 폴백: ${e.message}`);
    const rows = readBackupTable('dreams').filter((r) => r.published !== false);
    console.log(`   📦 dream backup: ${rows.length}개`);
    if (STRICT_MODE) throw e;
    return rows;
  }
}

// ────────────────────────────────────────────────────────────
// URL 빌더
// ────────────────────────────────────────────────────────────

function buildCoreEntries() {
  return CORE_PAGES.map(([p, priority, changefreq, lastmodOverride]) => ({
    loc: `${BASE_URL}${p === '/' ? '/' : p}`,
    lastmod: lastmodOverride ?? today(),
    changefreq,
    priority,
  }));
}

/**
 * Guide URL: 라우팅이 `${slug}-${id.slice(0,8)}` 형식이므로 강제 적용.
 * - slug 필드가 이미 hex suffix 포함 → 그대로
 * - 미포함 → id에서 추출하여 추가
 */
function buildGuideEntries(rows) {
  const counters = { invalid: 0, excluded: 0, missingId: 0, total: rows.length };
  const entries = [];

  for (const row of rows) {
    const rawSlug = normalizeSlug(row.slug || '');
    if (!rawSlug || !isValidPrerenderedSlug(rawSlug)) { counters.invalid++; continue; }

    const { exclude } = shouldExcludeGuideSlug(rawSlug);
    if (exclude) { counters.excluded++; continue; }

    let finalSlug;
    if (HEX_SUFFIX_PATTERN.test(rawSlug)) {
      finalSlug = rawSlug;
    } else {
      const shortId = shortIdFromUuid(row.id);
      if (!shortId) { counters.missingId++; continue; }
      finalSlug = `${rawSlug}-${shortId}`;
    }

    entries.push({
      loc: `${BASE_URL}/guide/${finalSlug}`,
      lastmod: toDateStr(row.updated_at || row.published_at),
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  return { entries: uniqueByLoc(entries), counters };
}

/**
 * Dictionary URL: 슬러그 그대로 사용 (long descriptive 형식).
 * ⚠️ Backup 폴백 시 short/stale slug(20자 이하 & 3단어 이하)는 제외.
 * 이런 slug는 DB에서 새 slug로 교체됐거나 redirect/404 상태.
 */
function buildDictionaryEntries(rows) {
  const counters = { invalid: 0, excluded: 0, staleShort: 0, total: rows.length };
  const entries = [];

  for (const row of rows) {
    const slug = normalizeSlug(row.slug);
    if (!slug || !isValidPrerenderedSlug(slug)) { counters.invalid++; continue; }

    const { exclude } = shouldExcludeDictionarySlug(slug);
    if (exclude) { counters.excluded++; continue; }

    // Backup 폴백 데이터에 포함된 stale short slug 제외
    if (isLikelyStaleShortSlug(slug)) { counters.staleShort++; continue; }

    entries.push({
      loc: `${BASE_URL}/dictionary/${slug}`,
      lastmod: toDateStr(row.updated_at || row.published_at),
      changefreq: 'monthly',
      priority: '0.6',
    });
  }

  return { entries: uniqueByLoc(entries), counters };
}

/**
 * Dream URL: 슬러그 그대로 사용 (long descriptive 형식).
 */
function buildDreamEntries(rows) {
  const counters = { invalid: 0, excluded: 0, total: rows.length };
  const entries = [];
  const validSlugSet = new Set(
    rows.map((r) => normalizeSlug(r.slug)).filter(isValidPrerenderedSlug)
  );

  for (const row of rows) {
    const slug = normalizeSlug(row.slug);
    if (!slug || !isValidPrerenderedSlug(slug)) { counters.invalid++; continue; }

    const { exclude } = shouldExcludeDreamSlug(slug, validSlugSet);
    if (exclude) { counters.excluded++; continue; }

    entries.push({
      loc: `${BASE_URL}/dream/${slug}`,
      lastmod: toDateStr(row.updated_at || row.published_at),
      changefreq: 'yearly',
      priority: '0.5',
    });
  }

  return { entries: uniqueByLoc(entries), counters };
}

// ────────────────────────────────────────────────────────────
// URL 검증 (선택적: VERIFY=1)
// ────────────────────────────────────────────────────────────

async function verifyUrls(entries, label) {
  console.log(`\n🔍 ${label} URL 검증 시작 (${entries.length}개)...`);
  const bad = { redirect: [], notFound: [], error: [] };
  let checked = 0;
  const CONCURRENCY = 8;

  async function checkOne(entry) {
    try {
      const res = await fetch(entry.loc, {
        method: 'HEAD',
        redirect: 'manual',
        signal: AbortSignal.timeout(8000),
      });
      if (res.status >= 300 && res.status < 400) {
        bad.redirect.push({ loc: entry.loc, status: res.status, dest: res.headers.get('location') });
      } else if (res.status === 404) {
        bad.notFound.push({ loc: entry.loc });
      }
    } catch (e) {
      bad.error.push({ loc: entry.loc, error: e.message });
    }
    checked++;
    if (checked % 50 === 0) process.stdout.write(`\r  진행: ${checked}/${entries.length}`);
  }

  for (let i = 0; i < entries.length; i += CONCURRENCY) {
    await Promise.all(entries.slice(i, i + CONCURRENCY).map(checkOne));
  }
  console.log(`\r  완료: ${checked}/${entries.length}`);

  if (bad.redirect.length) {
    console.warn(`  🔴 리디렉션: ${bad.redirect.length}개`);
    bad.redirect.slice(0, 5).forEach((r) => console.warn(`     ${r.status} ${r.loc}\n        → ${r.dest}`));
  }
  if (bad.notFound.length) {
    console.warn(`  🔴 404: ${bad.notFound.length}개`);
    bad.notFound.slice(0, 5).forEach((r) => console.warn(`     ${r.loc}`));
  }
  if (bad.error.length) {
    console.warn(`  ⚠️  연결 오류: ${bad.error.length}개`);
  }

  const badLocs = new Set([...bad.redirect, ...bad.notFound].map((b) => b.loc));
  const filtered = entries.filter((e) => !badLocs.has(e.loc));
  if (badLocs.size > 0) console.log(`  ✂️  사이트맵에서 ${badLocs.size}개 제외`);
  if (STRICT_MODE && badLocs.size > 0) {
    throw new Error(`STRICT 모드: ${badLocs.size}개 잘못된 URL이 있음`);
  }
  return filtered;
}

// ────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 MUUN sitemap generation v3 시작');
  console.log(`📅 ${today()} | VERIFY=${VERIFY_URLS} | STRICT=${STRICT_MODE}`);

  const [dictRows, guideRows, dreamRows] = await Promise.all([
    loadDictionaryRows(),
    loadGuideRows(),
    loadDreamRows(),
  ]);

  const coreEntries = buildCoreEntries();
  const dictionary = buildDictionaryEntries(dictRows);
  const guide = buildGuideEntries(guideRows);
  const dream = buildDreamEntries(dreamRows);

  console.log(`\n📊 빌드 결과:`);
  console.log(`   core: ${coreEntries.length}`);
  console.log(`   dictionary: ${dictionary.entries.length}/${dictionary.counters.total}`, dictionary.counters);
  console.log(`   guide: ${guide.entries.length}/${guide.counters.total}`, guide.counters);
  console.log(`   dream: ${dream.entries.length}/${dream.counters.total}`, dream.counters);

  let coreFinal = coreEntries;
  let dictFinal = dictionary.entries;
  let guideFinal = guide.entries;
  let dreamFinal = dream.entries;

  if (VERIFY_URLS) {
    coreFinal  = await verifyUrls(coreFinal, 'core');
    dictFinal  = await verifyUrls(dictFinal, 'dictionary');
    guideFinal = await verifyUrls(guideFinal, 'guide');
    dreamFinal = await verifyUrls(dreamFinal, 'dream');
  }

  console.log(`\n💾 저장:`);
  saveFile('sitemap-core.xml', urlsetXml(coreFinal));
  saveFile('sitemap-dictionary.xml', urlsetXml(dictFinal));
  saveFile('sitemap-guide.xml', urlsetXml(guideFinal));
  saveFile('sitemap-dream.xml', urlsetXml(dreamFinal));
  removeFileIfExists('sitemap-yearly-fortune.xml');
  saveFile('sitemap.xml', sitemapIndexXml([
    'sitemap-core.xml',
    'sitemap-dictionary.xml',
    'sitemap-guide.xml',
    'sitemap-dream.xml',
  ]));

  const total = coreFinal.length + dictFinal.length + guideFinal.length + dreamFinal.length;
  console.log(`\n✅ 완료: 총 ${total}개 URL`);
}

main().catch((error) => {
  console.error('❌ 치명적 오류:', error.message);
  process.exit(1);
});
