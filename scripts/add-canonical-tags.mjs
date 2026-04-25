#!/usr/bin/env node

/**
 * Canonical 태그 일괄 추가 스크립트
 * - 모든 주요 페이지에 useCanonical Hook 추가
 * - 자동으로 import 문 추가
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 페이지별 설정
const pageConfig = [
  { file: 'Home.tsx', path: '/' },
  { file: 'YearlyFortune.tsx', path: '/yearly-fortune' },
  { file: 'LifelongSaju.tsx', path: '/lifetime-saju' },
  { file: 'Compatibility.tsx', path: '/compatibility' },
  { file: 'FamilySaju.tsx', path: '/family-saju' },
  { file: 'Tarot.tsx', path: '/tarot' },
  { file: 'Tojeong.tsx', path: '/tojeong' },
  { file: 'Astrology.tsx', path: '/astrology' },
  { file: 'DailyFortune.tsx', path: '/daily-fortune' },
  { file: 'Manselyeok.tsx', path: '/manselyeok' },
  { file: 'HybridCompatibility.tsx', path: '/hybrid-compatibility' },
  { file: 'FortuneDictionary.tsx', path: '/fortune-dictionary' },
  { file: 'About.tsx', path: '/about' },
  { file: 'Contact.tsx', path: '/contact' },
  { file: 'Privacy.tsx', path: '/privacy' },
  { file: 'Terms.tsx', path: '/terms' },
  { file: 'Psychology.tsx', path: '/psychology' },
  { file: 'LuckyLunch.tsx', path: '/lucky-lunch' },
  { file: 'TarotHistory.tsx', path: '/tarot-history' },
];

// ============================================
// 1. 파일 읽기
// ============================================

function readPageFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    return null;
  }
}

// ============================================
// 2. Import 추가
// ============================================

function addImport(content) {
  // 이미 import가 있는지 확인
  if (content.includes("import { useCanonical }")) {
    return content;
  }

  // 첫 번째 import 찾기
  const importMatch = content.match(/^import\s+/m);
  if (!importMatch) {
    return content;
  }

  // useEffect import 확인
  if (!content.includes("import { useEffect }")) {
    // useEffect import 추가
    const firstImportEnd = content.indexOf('\n', importMatch.index) + 1;
    const beforeImport = content.substring(0, firstImportEnd);
    const afterImport = content.substring(firstImportEnd);
    
    return beforeImport + "import { useEffect } from 'react';\nimport { useCanonical } from '@/lib/use-canonical';\n" + afterImport;
  } else {
    // useCanonical import만 추가
    const firstImportEnd = content.indexOf('\n', importMatch.index) + 1;
    const beforeImport = content.substring(0, firstImportEnd);
    const afterImport = content.substring(firstImportEnd);
    
    return beforeImport + "import { useCanonical } from '@/lib/use-canonical';\n" + afterImport;
  }
}

// ============================================
// 3. Hook 호출 추가
// ============================================

function addHookCall(content, canonicalPath) {
  // 이미 useCanonical이 있는지 확인
  if (content.includes('useCanonical(')) {
    return content;
  }

  // export default function 찾기
  const functionMatch = content.match(/export\s+default\s+function\s+\w+\s*\(\s*\)\s*\{/);
  if (!functionMatch) {
    return content;
  }

  // 함수 본문 시작 위치
  const functionStart = functionMatch.index + functionMatch[0].length;
  
  // 첫 번째 줄 찾기 (들여쓰기 고려)
  const beforeFunction = content.substring(0, functionStart);
  const afterFunction = content.substring(functionStart);
  
  // useCanonical 호출 추가
  const hookCall = `\n  useCanonical('${canonicalPath}');\n`;
  
  return beforeFunction + hookCall + afterFunction;
}

// ============================================
// 4. 파일 저장
// ============================================

function savePageFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`❌ Error saving ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

// ============================================
// 5. 메인 함수
// ============================================

function main() {
  console.log('🚀 Adding Canonical Tags to Pages\n');
  console.log('='.repeat(70));

  const pagesDir = path.join(__dirname, '../client/src/pages');
  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  pageConfig.forEach(config => {
    const filePath = path.join(pagesDir, config.file);
    
    process.stdout.write(`⏳ Processing ${config.file}... `);

    // 파일 읽기
    let content = readPageFile(filePath);
    if (!content) {
      console.log('⏭️  (file not found)');
      skipCount++;
      return;
    }

    // 이미 Canonical이 있는지 확인
    if (content.includes('useCanonical(')) {
      console.log('⏭️  (already has canonical)');
      skipCount++;
      return;
    }

    // Import 추가
    content = addImport(content);

    // Hook 호출 추가
    content = addHookCall(content, config.path);

    // 파일 저장
    if (savePageFile(filePath, content)) {
      console.log('✅');
      successCount++;
    } else {
      console.log('❌');
      failCount++;
    }
  });

  console.log('='.repeat(70));
  console.log(`\n📊 Summary:`);
  console.log(`   Total pages: ${pageConfig.length}`);
  console.log(`   Added: ${successCount}`);
  console.log(`   Skipped: ${skipCount}`);
  console.log(`   Failed: ${failCount}`);

  if (successCount > 0) {
    console.log(`\n✅ Canonical tags added to ${successCount} pages!`);
  }

  console.log('\n💡 Verify with: pnpm verify-canonical\n');

  process.exit(failCount > 0 ? 1 : 0);
}

// ============================================
// 실행
// ============================================

main();
