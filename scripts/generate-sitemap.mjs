#!/usr/bin/env node

/**
 * Sitemap 자동 생성 스크립트 (분리 구조 버전)
 *
 * 생성 파일:
 *   sitemap.xml          — sitemap index (4개 하위 파일 참조)
 *   sitemap-core.xml     — 주요 서비스/루트 페이지 (정적)
 *   sitemap-dictionary.xml — fortune_dictionary 동적 페이지
 *   sitemap-guide.xml    — columns 동적 페이지
 *   sitemap-dream.xml    — dreams 동적 페이지
 *
 * README 지침 적용:
 *   - lastmod / changefreq / priority 제거 (잘못된 freshness 신호 방지)
 *   - 중복 URL 제거
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../client/public');

// Supabase 설정
const SUPABASE_URL = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// 1. Supabase 데이터 조회
// ============================================

async function fetchDictionarySlugs() {
  try {
    console.log('📡 Supabase에서 운세 사전 슬러그 조회 중...');
    const { data, error } = await supabase
      .from('fortune_dictionary')
      .select('slug')
      .eq('published', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('⚠️ fortune_dictionary 조회 실패:', error.message);
      return [];
    }
    const slugs = (data || []).map(row => row.slug).filter(Boolean);
    console.log(`✅ Dictionary: ${slugs.length}개`);
    return slugs;
  } catch (err) {
    console.warn('⚠️ 운세 사전 슬러그 조회 오류:', err.message);
    return [];
  }
}

async function fetchColumns() {
  try {
    console.log('📡 Supabase에서 칼럼 데이터 조회 중...');
    const { data, error } = await supabase
      .from('columns')
      .select('id, slug')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.warn('⚠️ columns 조회 실패:', error.message);
      return [];
    }
    console.log(`✅ Guide(columns): ${data?.length || 0}개`);
    return data || [];
  } catch (err) {
    console.warn('⚠️ 칼럼 조회 오류:', err.message);
    return [];
  }
}

async function fetchDreams() {
  try {
    console.log('📡 Supabase에서 꿈해몽 데이터 조회 중...');
    const { data, error } = await supabase
      .from('dreams')
      .select('slug')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.warn('⚠️ dreams 조회 실패:', error.message);
      return [];
    }
    console.log(`✅ Dream: ${data?.length || 0}개`);
    return data || [];
  } catch (err) {
    console.warn('⚠️ 꿈해몽 조회 오류:', err.message);
    return [];
  }
}

// ============================================
// 2. XML 생성 헬퍼
// ============================================

function urlsetXml(urls) {
  const items = urls.map(u => `  <url>\n    <loc>${u}</loc>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

function sitemapIndexXml(files) {
  const items = files.map(f => `  <sitemap>\n    <loc>https://muunsaju.com/${f}</loc>\n  </sitemap>`).join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

function saveFile(filename, content) {
  const filePath = path.join(PUBLIC_DIR, filename);
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
  const kb = (fs.statSync(filePath).size / 1024).toFixed(1);
  console.log(`💾 ${filename} 저장 완료 (${kb} KB)`);
}

// ============================================
// 3. 각 사이트맵 생성
// ============================================

function generateCore() {
  const BASE = 'https://muunsaju.com';
  const pages = [
    '/', '/naming', '/fortune-dictionary', '/yearly-fortune',
    '/lifelong-saju', '/compatibility', '/family-saju', '/tarot',
    '/tojeong', '/astrology', '/daily-fortune', '/manselyeok',
    '/hybrid-compatibility', '/psychology', '/lucky-lunch', '/about',
  ];
  return urlsetXml(pages.map(p => `${BASE}${p}`));
}

function generateDictionary(slugs) {
  const BASE = 'https://muunsaju.com';
  // 중복 제거
  const unique = [...new Set(slugs)];
  return urlsetXml(unique.map(s => `${BASE}/dictionary/${s}`));
}

function generateGuide(columns) {
  const BASE = 'https://muunsaju.com';
  const urls = [`${BASE}/guide`];
  const seen = new Set();
  for (const col of columns) {
    const slug = col.slug || col.id;
    if (slug && !seen.has(slug)) {
      seen.add(slug);
      urls.push(`${BASE}/guide/${slug}`);
    }
  }
  return urlsetXml(urls);
}

function generateDream(dreams) {
  const BASE = 'https://muunsaju.com';
  const urls = [`${BASE}/dream`];
  const seen = new Set();
  for (const d of dreams) {
    if (d.slug && !seen.has(d.slug)) {
      seen.add(d.slug);
      urls.push(`${BASE}/dream/${d.slug}`);
    }
  }
  return urlsetXml(urls);
}

function generateIndex() {
  return sitemapIndexXml([
    'sitemap-core.xml',
    'sitemap-dictionary.xml',
    'sitemap-guide.xml',
    'sitemap-dream.xml',
  ]);
}

// ============================================
// 4. Google Search Console Ping
// ============================================

async function pingGoogle() {
  const sitemapUrl = 'https://muunsaju.com/sitemap.xml';
  const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  try {
    console.log('\n🔔 Google Search Console에 Ping 전송 중...');
    const response = await fetch(pingUrl, { method: 'GET' });
    if (response.ok) {
      console.log(`✅ Google Ping 성공 (${response.status})`);
    } else {
      console.warn(`⚠️ Google Ping 응답: ${response.status}`);
    }
  } catch (err) {
    console.warn('⚠️ Google Ping 실패 (오프라인 환경에서는 정상):', err.message);
  }
}

// ============================================
// 5. 메인
// ============================================

async function main() {
  console.log('🚀 Sitemap 생성 시작 (분리 구조)\n' + '='.repeat(50));

  const [slugs, columns, dreams] = await Promise.all([
    fetchDictionarySlugs(),
    fetchColumns(),
    fetchDreams(),
  ]);

  console.log('\n📝 XML 파일 생성 중...');
  saveFile('sitemap-core.xml',       generateCore());
  saveFile('sitemap-dictionary.xml', generateDictionary(slugs));
  saveFile('sitemap-guide.xml',      generateGuide(columns));
  saveFile('sitemap-dream.xml',      generateDream(dreams));
  saveFile('sitemap.xml',            generateIndex());

  const total = 16 + slugs.length + columns.length + 1 + dreams.length + 1;
  console.log(`\n✅ 총 ${total}개 URL 생성 완료`);
  console.log(`   core: 16 | dictionary: ${slugs.length} | guide: ${columns.length + 1} | dream: ${dreams.length + 1}`);

  if (process.env.PING_GOOGLE === 'true') {
    await pingGoogle();
  } else {
    console.log('\n💡 Tip: PING_GOOGLE=true 환경변수로 Google Ping 전송 가능');
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ 사이트맵 생성 완료!\n');
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
