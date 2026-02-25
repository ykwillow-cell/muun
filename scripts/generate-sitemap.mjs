#!/usr/bin/env node

/**
 * Sitemap 자동 생성 스크립트
 * - fortune-dictionary.ts에서 모든 용어 읽기
 * - sitemap.xml 자동 생성
 * - Google Search Console에 Ping 전송
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================
// 1. fortune-dictionary.ts 데이터 읽기
// ============================================

function readFortuneDictionary() {
  const dictionaryPath = path.join(
    __dirname,
    '../client/src/lib/fortune-dictionary.ts'
  );

  try {
    const content = fs.readFileSync(dictionaryPath, 'utf-8');

    // 정규식으로 slug 추출
    const slugMatches = content.match(/slug:\s*['"]([^'"]+)['"]/g);
    const slugs = slugMatches
      ? slugMatches.map(m => m.match(/['"]([^'"]+)['"]/)[1])
      : [];

    console.log(`✅ Found ${slugs.length} dictionary items`);
    return slugs;
  } catch (error) {
    console.error('❌ Error reading fortune-dictionary.ts:', error.message);
    return [];
  }
}

// ============================================
// 2. Sitemap XML 생성
// ============================================

function generateSitemap(slugs) {
  const baseUrl = 'https://muunsaju.com';
  const currentDate = new Date().toISOString().split('T')[0];

  // XML 헤더
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // 정적 페이지
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/fortune-dictionary', priority: 0.9, changefreq: 'weekly' },
    { url: '/yearly-fortune', priority: 0.8, changefreq: 'monthly' },
    { url: '/lifelong-saju', priority: 0.8, changefreq: 'monthly' }, // Fix: lifetime-saju -> lifelong-saju
    { url: '/compatibility', priority: 0.8, changefreq: 'monthly' },
    { url: '/family-saju', priority: 0.7, changefreq: 'monthly' },
    { url: '/tarot', priority: 0.7, changefreq: 'monthly' },
    { url: '/tojeong', priority: 0.7, changefreq: 'monthly' },
    { url: '/astrology', priority: 0.7, changefreq: 'monthly' },
    { url: '/daily-fortune', priority: 0.7, changefreq: 'daily' },
    { url: '/manselyeok', priority: 0.7, changefreq: 'monthly' },
    { url: '/hybrid-compatibility', priority: 0.7, changefreq: 'monthly' },
    { url: '/psychology', priority: 0.7, changefreq: 'monthly' }, // Added
    { url: '/lucky-lunch', priority: 0.6, changefreq: 'daily' },   // Added
    { url: '/dream', priority: 0.7, changefreq: 'weekly' },        // Added
    { url: '/guide', priority: 0.8, changefreq: 'weekly' },        // Added
    { url: '/about', priority: 0.5, changefreq: 'monthly' },       // Added
  ];

  staticPages.forEach(page => {
    xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Dictionary 동적 페이지
  slugs.forEach(slug => {
    xml += `  <url>
    <loc>${baseUrl}/dictionary/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>
`;
  });

  xml += `</urlset>`;

  return xml;
}

// ============================================
// 3. Sitemap 파일 저장
// ============================================

function saveSitemap(xml) {
  const sitemapPath = path.join(
    __dirname,
    '../client/public/sitemap.xml'
  );

  try {
    // 디렉토리 생성 (필요한 경우)
    const dir = path.dirname(sitemapPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(sitemapPath, xml, 'utf-8');
    console.log(`✅ Sitemap saved: ${sitemapPath}`);

    // 파일 크기 확인
    const stats = fs.statSync(sitemapPath);
    console.log(`   File size: ${(stats.size / 1024).toFixed(2)} KB`);

    return true;
  } catch (error) {
    console.error('❌ Error saving sitemap:', error.message);
    return false;
  }
}

// ============================================
// 4. Google Search Console Ping
// ============================================

async function pingGoogle() {
  const sitemapUrl = 'https://muunsaju.com/sitemap.xml';
  const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

  try {
    console.log('\n🔔 Sending ping to Google Search Console...');
    const response = await fetch(pingUrl, {
      method: 'GET',
      timeout: 5000,
    });

    if (response.ok) {
      console.log('✅ Google Ping sent successfully');
      console.log(`   Status: ${response.status} ${response.statusText}`);
      return true;
    } else {
      console.warn(`⚠️ Google Ping returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.warn('⚠️ Google Ping failed (this is normal in offline mode):', error.message);
    return false;
  }
}

// ============================================
// 5. 메인 함수
// ============================================

async function main() {
  console.log('🚀 Sitemap Generation Started\n');
  console.log('=' .repeat(50));

  // 1. Dictionary 데이터 읽기
  console.log('\n📖 Reading fortune-dictionary.ts...');
  const slugs = readFortuneDictionary();

  if (slugs.length === 0) {
    console.error('❌ No dictionary items found. Aborting.');
    process.exit(1);
  }

  // 2. Sitemap 생성
  console.log('\n📝 Generating sitemap...');
  const xml = generateSitemap(slugs);
  console.log(`✅ Sitemap generated with ${slugs.length} dictionary items`);

  // 3. 파일 저장
  console.log('\n💾 Saving sitemap...');
  const saved = saveSitemap(xml);

  if (!saved) {
    console.error('❌ Failed to save sitemap. Aborting.');
    process.exit(1);
  }

  // 4. Google Ping (선택사항)
  if (process.env.PING_GOOGLE === 'true') {
    await pingGoogle();
  } else {
    console.log('\n💡 Tip: Set PING_GOOGLE=true to send ping to Google');
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Sitemap generation completed successfully!\n');
}

// ============================================
// 실행
// ============================================

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
