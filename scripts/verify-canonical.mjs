#!/usr/bin/env node

/**
 * Canonical 태그 검증 스크립트
 * - 모든 페이지에서 Canonical 태그 확인
 * - useCanonical Hook 확인
 * - 누락된 페이지 리포트
 * - 자기 참조 캐노니컬 검증
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================
// 1. 페이지 파일 읽기
// ============================================

function getPagesFiles() {
  const pagesDir = path.join(__dirname, '../client/src/pages');

  try {
    const files = fs.readdirSync(pagesDir)
      .filter(f => f.endsWith('.tsx'))
      .map(f => ({
        name: f,
        path: path.join(pagesDir, f),
      }));

    return files;
  } catch (error) {
    console.error('Error reading pages directory:', error.message);
    return [];
  }
}

// ============================================
// 2. Canonical 태그 검증
// ============================================

function checkCanonical(filePath, fileName) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Canonical 태그 확인 (정적)
    const hasStaticCanonical = content.includes('rel="canonical"');
    const canonicalMatch = content.match(/href=["']([^"']*canonical[^"']*)["']/);
    const canonicalUrl = canonicalMatch ? canonicalMatch[1] : null;

    // useCanonical Hook 확인 (동적)
    const hasUseCanonical = content.includes('useCanonical(');
    const useCanonicalMatch = content.match(/useCanonical\(['"]([^'"]+)['"]\)/);
    const useCanonicalPath = useCanonicalMatch ? useCanonicalMatch[1] : null;

    // useEffect 확인
    const hasUseEffect = content.includes('useEffect');

    const hasCanonical = hasStaticCanonical || hasUseCanonical;

    return {
      hasCanonical,
      canonicalUrl,
      useCanonicalPath,
      hasUseEffect,
      hasStaticCanonical,
      hasUseCanonical,
      isStatic: hasStaticCanonical,
      isDynamic: hasUseCanonical,
    };
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error.message);
    return null;
  }
}

// ============================================
// 3. 결과 출력
// ============================================

function printResults(results) {
  console.log('\n🔍 Canonical Tag Verification Report\n');
  console.log('='.repeat(70));

  let totalPages = 0;
  let withCanonical = 0;
  let missingCanonical = [];

  results.forEach(result => {
    totalPages++;
    const status = result.hasCanonical ? '✅' : '❌';
    let type = '(Missing)';
    let urlInfo = '';
    
    if (result.isStatic) {
      type = '(Static Canonical)';
      urlInfo = result.canonicalUrl;
    } else if (result.isDynamic) {
      type = '(useCanonical Hook)';
      urlInfo = result.useCanonicalPath;
    }

    console.log(`${status} ${result.name.padEnd(30)} ${type}`);

    if (result.hasCanonical) {
      withCanonical++;
      if (urlInfo) {
        console.log(`   └─ ${urlInfo}`);
      }
    } else {
      missingCanonical.push(result.name);
    }
  });

  console.log('='.repeat(70));
  console.log(`\n📊 Summary:`);
  console.log(`   Total pages: ${totalPages}`);
  console.log(`   With Canonical: ${withCanonical} (${((withCanonical / totalPages) * 100).toFixed(1)}%)`);
  console.log(`   Missing Canonical: ${missingCanonical.length}`);

  if (missingCanonical.length > 0) {
    console.log(`\n⚠️ Pages missing Canonical tag:`);
    missingCanonical.forEach(page => {
      console.log(`   - ${page}`);
    });
  } else {
    console.log('\n✅ All pages have Canonical tags!');
  }

  console.log('');
}

// ============================================
// 4. 메인 함수
// ============================================

function main() {
  console.log('🚀 Canonical Tag Verification Started\n');

  // 페이지 파일 읽기
  const files = getPagesFiles();

  if (files.length === 0) {
    console.error('No page files found');
    process.exit(1);
  }

  // 각 페이지 검증
  const results = files.map(file => ({
    name: file.name,
    ...checkCanonical(file.path, file.name),
  }));

  // 결과 출력
  printResults(results);

  // 종료 코드 설정
  const missingCount = results.filter(r => !r.hasCanonical).length;
  if (missingCount > 0) {
    process.exit(1); // 실패
  } else {
    process.exit(0); // 성공
  }
}

// ============================================
// 실행
// ============================================

main();
