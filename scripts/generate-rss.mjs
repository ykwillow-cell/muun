#!/usr/bin/env node

/**
 * RSS Feed 자동 생성 스크립트 (네이버 서치어드바이저 제출용)
 * - Supabase에서 최신 칼럼 데이터 조회 (최근 50개)
 * - Supabase에서 최신 꿈해몽 데이터 조회 (최근 50개)
 * - RSS 2.0 형식으로 피드 생성
 * - rss.xml 자동 생성
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Supabase 설정
const SUPABASE_URL = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BASE_URL = 'https://muunsaju.com';
const SITE_TITLE = '무운 (MuUn) - 무료 사주 운세';
const SITE_DESCRIPTION = '회원가입 없는 100% 무료 사주풀이, 신년운세, 토정비결, 궁합, 타로, 꿈해몽';
const SITE_LANGUAGE = 'ko';

// ============================================
// 1. Supabase에서 최신 칼럼 데이터 조회
// ============================================

async function fetchLatestColumns(limit = 50) {
  try {
    console.log('📡 Supabase에서 최신 칼럼 데이터 조회 중...');
    const { data, error } = await supabase
      .from('columns')
      .select('id, slug, title, description, author, published_at, thumbnail_url')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('⚠️ Supabase 칼럼 조회 실패:', error.message);
      return [];
    }

    console.log(`✅ Found ${data?.length || 0} columns from Supabase`);
    return data || [];
  } catch (err) {
    console.warn('⚠️ 칼럼 조회 중 오류:', err.message);
    return [];
  }
}

// ============================================
// 2. Supabase에서 최신 꿈해몽 데이터 조회
// ============================================

async function fetchLatestDreams(limit = 50) {
  try {
    console.log('📡 Supabase에서 최신 꿈해몽 데이터 조회 중...');
    const { data, error } = await supabase
      .from('dreams')
      .select('slug, keyword, interpretation, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('⚠️ Supabase 꿈해몽 조회 실패:', error.message);
      return [];
    }

    console.log(`✅ Found ${data?.length || 0} dreams from Supabase`);
    return data || [];
  } catch (err) {
    console.warn('⚠️ 꿈해몽 조회 중 오류:', err.message);
    return [];
  }
}

// ============================================
// 3. RSS Item XML 생성 (칼럼)
// ============================================

function generateColumnItem(column) {
  const pubDate = new Date(column.published_at).toUTCString();
  const link = `${BASE_URL}/guide/${column.slug || column.id}`;
  const description = column.description || '운세 칼럼';
  
  // CDATA로 감싸서 특수문자 처리
  return `  <item>
    <title><![CDATA[${escapeXml(column.title)}]]></title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <pubDate>${pubDate}</pubDate>
    <description><![CDATA[${escapeXml(description)}]]></description>
    <author>${escapeXml(column.author || '무운 역술팀')}</author>
    <category>칼럼</category>
  </item>
`;
}

// ============================================
// 4. RSS Item XML 생성 (꿈해몽)
// ============================================

function generateDreamItem(dream) {
  const pubDate = new Date(dream.published_at).toUTCString();
  const link = `${BASE_URL}/dream/${dream.slug}`;
  const description = dream.interpretation || dream.keyword || '꿈해몽';
  
  return `  <item>
    <title><![CDATA[${escapeXml(dream.keyword)}의 꿈해몽]]></title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <pubDate>${pubDate}</pubDate>
    <description><![CDATA[${escapeXml(description)}]]></description>
    <category>꿈해몽</category>
  </item>
`;
}

// ============================================
// 5. RSS 피드 생성
// ============================================

function generateRssFeed(columns, dreams) {
  const now = new Date().toUTCString();
  
  // 모든 항목을 발행 날짜순으로 정렬
  const allItems = [
    ...columns.map(col => ({
      date: new Date(col.published_at),
      xml: generateColumnItem(col)
    })),
    ...dreams.map(dream => ({
      date: new Date(dream.published_at),
      xml: generateDreamItem(dream)
    }))
  ].sort((a, b) => b.date - a.date);

  // RSS 2.0 헤더
  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${SITE_TITLE}]]></title>
    <link>${BASE_URL}</link>
    <description><![CDATA[${SITE_DESCRIPTION}]]></description>
    <language>${SITE_LANGUAGE}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <ttl>1440</ttl>
    <image>
      <url>${BASE_URL}/images/horse_mascot.png</url>
      <title><![CDATA[${SITE_TITLE}]]></title>
      <link>${BASE_URL}</link>
    </image>
`;

  // RSS Items 추가
  allItems.forEach(item => {
    rss += item.xml;
  });

  // RSS 푸터
  rss += `  </channel>
</rss>`;

  return rss;
}

// ============================================
// 6. XML 특수문자 이스케이프
// ============================================

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ============================================
// 7. RSS 파일 저장
// ============================================

function saveRss(rss) {
  const rssPath = path.join(
    __dirname,
    '../client/public/rss.xml'
  );

  try {
    // 디렉토리 생성 (필요한 경우)
    const dir = path.dirname(rssPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(rssPath, rss, 'utf-8');
    console.log(`✅ RSS feed saved: ${rssPath}`);

    // 파일 크기 확인
    const stats = fs.statSync(rssPath);
    console.log(`   File size: ${(stats.size / 1024).toFixed(2)} KB`);

    return true;
  } catch (error) {
    console.error('❌ Error saving RSS feed:', error.message);
    return false;
  }
}

// ============================================
// 8. 메인 함수
// ============================================

async function main() {
  console.log('🚀 RSS Feed Generation Started\n');
  console.log('='.repeat(50));

  // 1. Supabase에서 최신 칼럼 조회
  console.log('\n📚 Fetching latest columns from Supabase...');
  const columns = await fetchLatestColumns(50);

  // 2. Supabase에서 최신 꿈해몽 조회
  console.log('\n🌙 Fetching latest dreams from Supabase...');
  const dreams = await fetchLatestDreams(50);

  // 3. RSS 피드 생성
  console.log('\n📝 Generating RSS feed...');
  const rss = generateRssFeed(columns, dreams);
  console.log(`✅ RSS feed generated with ${columns.length} columns + ${dreams.length} dreams`);

  // 4. 파일 저장
  console.log('\n💾 Saving RSS feed...');
  const saved = saveRss(rss);

  if (!saved) {
    console.error('❌ Failed to save RSS feed. Aborting.');
    process.exit(1);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ RSS feed generation completed successfully!');
  console.log(`\n📌 RSS Feed URL: ${BASE_URL}/rss.xml`);
  console.log('💡 네이버 서치어드바이저에 이 URL을 제출하세요.\n');
}

// ============================================
// 실행
// ============================================

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
