#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'client/public');
const POPULAR_BIRTH_DATES_FILE = path.join(ROOT_DIR, 'popular-birth-dates.json');
const BASE_URL = 'https://muunsaju.com';
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SUPABASE_URL = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function normalizeSlug(value) { return String(value || '').trim().toLowerCase(); }
function isValidSlug(value) { return SLUG_PATTERN.test(normalizeSlug(value)); }
function escapeXml(value = '') { return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;'); }
function urlsetXml(urls) { const items = urls.map((u) => `  <url>\n    <loc>${escapeXml(u)}</loc>\n  </url>`).join('\n'); return `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`; }
function sitemapIndexXml(files) { const items = files.map((f) => `  <sitemap>\n    <loc>${BASE_URL}/${escapeXml(f)}</loc>\n  </sitemap>`).join('\n'); return `<?xml version="1.0" encoding="utf-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`; }
function saveFile(filename, content) { const filePath = path.join(PUBLIC_DIR, filename); fs.mkdirSync(PUBLIC_DIR, { recursive: true }); fs.writeFileSync(filePath, content, 'utf-8'); const kb = (fs.statSync(filePath).size / 1024).toFixed(1); console.log(`💾 ${filename} 저장 완료 (${kb} KB)`); }
function uniqueOrdered(values) { const seen = new Set(); const result = []; for (const value of values) { if (!value || seen.has(value)) continue; seen.add(value); result.push(value); } return result; }

async function fetchColumns() { try { console.log('📡 Supabase에서 칼럼 데이터 조회 중...'); const { data, error } = await supabase.from('columns').select('id, slug').eq('published', true).order('published_at', { ascending: false, nullsFirst: false }); if (error) { console.warn('⚠️ columns 조회 실패:', error.message); return []; } const urls = uniqueOrdered((data || []).map((row) => normalizeSlug(row.slug || row.id)).filter(isValidSlug).map((slug) => `${BASE_URL}/guide/${slug}`)); console.log(`✅ Guide(columns): ${urls.length}개`); return urls; } catch (err) { console.warn('⚠️ 칼럼 조회 오류:', err.message); return []; } }
async function fetchDreams() { try { console.log('📡 Supabase에서 꿈해몽 데이터 조회 중...'); const { data, error } = await supabase.from('dreams').select('slug').eq('published', true).order('published_at', { ascending: false, nullsFirst: false }); if (error) { console.warn('⚠️ dreams 조회 실패:', error.message); return []; } const urls = uniqueOrdered((data || []).map((row) => normalizeSlug(row.slug)).filter(isValidSlug).map((slug) => `${BASE_URL}/dream/${slug}`)); console.log(`✅ Dream: ${urls.length}개`); return urls; } catch (err) { console.warn('⚠️ 꿈해몽 조회 오류:', err.message); return []; } }
async function fetchDictionaryEntries() { try { console.log('📡 Supabase에서 운세 사전 슬러그 조회 중...'); const { data, error } = await supabase.from('fortune_dictionary').select('slug').eq('published', true).order('created_at', { ascending: false }); if (error) { console.warn('⚠️ fortune_dictionary 조회 실패:', error.message); return []; } const urls = uniqueOrdered((data || []).map((row) => normalizeSlug(row.slug)).filter(isValidSlug).map((slug) => `${BASE_URL}/dictionary/${slug}`)); console.log(`✅ Dictionary: ${urls.length}개`); return urls; } catch (err) { console.warn('⚠️ 운세 사전 슬러그 조회 오류:', err.message); return []; } }
function loadYearlyFortuneUrls() { try { if (!fs.existsSync(POPULAR_BIRTH_DATES_FILE)) { const fallback = []; for (let year = 1970; year <= 2020; year += 1) fallback.push(`${BASE_URL}/yearly-fortune/${year}-01-01`); return fallback; } const data = JSON.parse(fs.readFileSync(POPULAR_BIRTH_DATES_FILE, 'utf-8')); const birthDates = Array.isArray(data.birth_dates) ? data.birth_dates : []; return uniqueOrdered(birthDates.map((value) => String(value || '').trim()).filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)).map((value) => `${BASE_URL}/yearly-fortune/${value}`)); } catch (error) { console.warn('⚠️ yearly-fortune URL 생성 실패:', error instanceof Error ? error.message : error); return []; } }
function generateCore() { const pages = ['/', '/naming', '/fortune-dictionary', '/yearly-fortune', '/lifelong-saju', '/compatibility', '/family-saju', '/tarot', '/tojeong', '/astrology', '/daily-fortune', '/manselyeok', '/hybrid-compatibility', '/psychology', '/lucky-lunch', '/about', '/contact', '/privacy', '/terms', '/guide', '/dream']; return urlsetXml(pages.map((page) => `${BASE_URL}${page}`)); }
function generateIndex() { return sitemapIndexXml(['sitemap-core.xml', 'sitemap-dictionary.xml', 'sitemap-guide.xml', 'sitemap-dream.xml', 'sitemap-yearly-fortune.xml']); }

async function main() {
  console.log('🚀 Sitemap 생성 시작 (SEO 정리 버전)\n' + '='.repeat(50));
  const [dictionaryUrls, guideUrls, dreamUrls] = await Promise.all([fetchDictionaryEntries(), fetchColumns(), fetchDreams()]);
  const yearlyFortuneUrls = loadYearlyFortuneUrls();
  console.log('\n📝 XML 파일 생성 중...');
  saveFile('sitemap-core.xml', generateCore());
  saveFile('sitemap-dictionary.xml', urlsetXml([`${BASE_URL}/fortune-dictionary`, ...dictionaryUrls]));
  saveFile('sitemap-guide.xml', urlsetXml([`${BASE_URL}/guide`, ...guideUrls]));
  saveFile('sitemap-dream.xml', urlsetXml([`${BASE_URL}/dream`, ...dreamUrls]));
  saveFile('sitemap-yearly-fortune.xml', urlsetXml(yearlyFortuneUrls));
  saveFile('sitemap.xml', generateIndex());
  const coreCount = 21; const total = coreCount + dictionaryUrls.length + 1 + guideUrls.length + 1 + dreamUrls.length + 1 + yearlyFortuneUrls.length;
  console.log(`\n✅ 총 ${total}개 URL 생성 완료`);
  console.log(`   core: ${coreCount} | dictionary: ${dictionaryUrls.length + 1} | guide: ${guideUrls.length + 1} | dream: ${dreamUrls.length + 1} | yearly: ${yearlyFortuneUrls.length}`);
  console.log('\n' + '='.repeat(50));
  console.log('✅ 사이트맵 생성 완료!\n');
}

main().catch((err) => { console.error('❌ Fatal error:', err instanceof Error ? err.message : err); process.exit(1); });
