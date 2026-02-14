#!/usr/bin/env node

/**
 * 동적 Sitemap 생성 스크립트
 * 
 * 기능:
 * - popular-birth-dates.json에서 1,000개 생년월일 읽기
 * - 각 생년월일별로 /yearly-fortune/:birthDate URL 생성
 * - sitemap-yearly-fortune.xml 생성
 * - 메인 sitemap.xml에 통합
 * 
 * 실행: node generate-sitemap-yearly-fortune.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DOMAIN = 'https://muunsaju.com';
const POPULAR_BIRTH_DATES_FILE = path.join(__dirname, 'popular-birth-dates.json');
const SITEMAP_OUTPUT_DIR = path.join(__dirname, 'client/public');
const SITEMAP_YEARLY_FORTUNE_FILE = path.join(SITEMAP_OUTPUT_DIR, 'sitemap-yearly-fortune.xml');
const MAIN_SITEMAP_FILE = path.join(SITEMAP_OUTPUT_DIR, 'sitemap.xml');

/**
 * XML 특수문자 이스케이프
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * 날짜를 ISO 8601 형식으로 변환
 */
function getLastModDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * sitemap-yearly-fortune.xml 생성
 */
function generateYearlyFortuneSitemap() {
  console.log('📅 Generating sitemap-yearly-fortune.xml...');

  // popular-birth-dates.json 읽기
  if (!fs.existsSync(POPULAR_BIRTH_DATES_FILE)) {
    console.error(`❌ Error: ${POPULAR_BIRTH_DATES_FILE} not found`);
    process.exit(1);
  }

  const birthDatesData = JSON.parse(fs.readFileSync(POPULAR_BIRTH_DATES_FILE, 'utf-8'));
  const birthDates = birthDatesData.birth_dates || [];

  console.log(`📊 Found ${birthDates.length} birth dates`);

  // XML 헤더
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 각 생년월일별 URL 추가
  for (const birthDate of birthDates) {
    const url = `${DOMAIN}/yearly-fortune/${birthDate}`;
    const lastmod = getLastModDate();

    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(url)}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>';

  // 파일 생성
  fs.writeFileSync(SITEMAP_YEARLY_FORTUNE_FILE, xml, 'utf-8');
  console.log(`✅ Created ${SITEMAP_YEARLY_FORTUNE_FILE}`);
  console.log(`   Total URLs: ${birthDates.length}`);

  return birthDates.length;
}

/**
 * 메인 sitemap.xml 업데이트 (sitemap index 생성)
 */
function updateMainSitemap(yearlyFortuneCount) {
  console.log('\n🔗 Updating main sitemap.xml...');

  // 기존 sitemap.xml 읽기 (있으면)
  let mainSitemapContent = '';
  if (fs.existsSync(MAIN_SITEMAP_FILE)) {
    mainSitemapContent = fs.readFileSync(MAIN_SITEMAP_FILE, 'utf-8');
  }

  // Sitemap Index 형식으로 생성
  let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemapIndex += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 메인 사이트맵 (기존 페이지들)
  sitemapIndex += '  <sitemap>\n';
  sitemapIndex += `    <loc>${DOMAIN}/sitemap-main.xml</loc>\n`;
  sitemapIndex += `    <lastmod>${getLastModDate()}</lastmod>\n`;
  sitemapIndex += '  </sitemap>\n';

  // 신년운세 사이트맵 (1,000개 URL)
  sitemapIndex += '  <sitemap>\n';
  sitemapIndex += `    <loc>${DOMAIN}/sitemap-yearly-fortune.xml</loc>\n`;
  sitemapIndex += `    <lastmod>${getLastModDate()}</lastmod>\n`;
  sitemapIndex += '  </sitemap>\n';

  sitemapIndex += '</sitemapindex>';

  // 파일 생성
  fs.writeFileSync(MAIN_SITEMAP_FILE, sitemapIndex, 'utf-8');
  console.log(`✅ Updated ${MAIN_SITEMAP_FILE}`);
  console.log(`   Sitemap Index created with 2 sitemaps`);
}

/**
 * 메인 실행
 */
function main() {
  console.log('🚀 Sitemap Generation Script\n');
  console.log(`📁 Output directory: ${SITEMAP_OUTPUT_DIR}`);
  console.log(`🌐 Domain: ${DOMAIN}\n`);

  try {
    const yearlyFortuneCount = generateYearlyFortuneSitemap();
    updateMainSitemap(yearlyFortuneCount);

    console.log('\n✅ Sitemap generation completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Upload sitemap-yearly-fortune.xml to Google Search Console');
    console.log('2. Upload sitemap.xml (Sitemap Index) to Google Search Console');
    console.log('3. Monitor indexing progress in Google Search Console');
    console.log('4. Check Naver Search Advisor for indexing status');
  } catch (error) {
    console.error('❌ Error during sitemap generation:', error);
    process.exit(1);
  }
}

main();
