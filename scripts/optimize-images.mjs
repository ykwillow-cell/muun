#!/usr/bin/env node

/**
 * WebP 이미지 최적화 스크립트
 * - JPG/PNG 이미지를 WebP로 변환
 * - 이미지 크기 최적화
 * - 변환 결과 리포트
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================
// 1. 이미지 디렉토리 설정
// ============================================

const imageDir = path.join(__dirname, '../client/public/images');
const outputDir = path.join(__dirname, '../client/public/images/webp');

// ============================================
// 2. 디렉토리 생성
// ============================================

function ensureDirectories() {
  try {
    if (!fs.existsSync(imageDir)) {
      console.log(`📁 Creating image directory: ${imageDir}`);
      fs.mkdirSync(imageDir, { recursive: true });
    }

    if (!fs.existsSync(outputDir)) {
      console.log(`📁 Creating WebP output directory: ${outputDir}`);
      fs.mkdirSync(outputDir, { recursive: true });
    }

    return true;
  } catch (error) {
    console.error('❌ Error creating directories:', error.message);
    return false;
  }
}

// ============================================
// 3. 이미지 파일 찾기
// ============================================

function getImageFiles() {
  try {
    if (!fs.existsSync(imageDir)) {
      console.log(`⚠️ Image directory not found: ${imageDir}`);
      return [];
    }

    const files = fs.readdirSync(imageDir)
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
      .map(f => ({
        name: f,
        path: path.join(imageDir, f),
      }));

    return files;
  } catch (error) {
    console.error('❌ Error reading image directory:', error.message);
    return [];
  }
}

// ============================================
// 4. 이미지 변환
// ============================================

async function convertToWebP(inputPath, outputPath, fileName) {
  try {
    const stats = fs.statSync(inputPath);
    const inputSize = stats.size;

    // WebP로 변환
    await sharp(inputPath)
      .webp({ quality: 80, alphaQuality: 100 })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const outputSize = outputStats.size;
    const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

    return {
      success: true,
      inputSize,
      outputSize,
      reduction: parseFloat(reduction),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================
// 5. 메인 함수
// ============================================

async function main() {
  console.log('🚀 Image Optimization Started\n');
  console.log('='.repeat(70));

  // 디렉토리 생성
  if (!ensureDirectories()) {
    process.exit(1);
  }

  // 이미지 파일 찾기
  const files = getImageFiles();

  if (files.length === 0) {
    console.log('\n⚠️ No image files found in:', imageDir);
    console.log('   Supported formats: JPG, JPEG, PNG');
    console.log('\n💡 Place images in:', imageDir);
    console.log('   Then run this script again.\n');
    process.exit(0);
  }

  console.log(`\n📸 Found ${files.length} image(s) to convert\n`);

  let totalInputSize = 0;
  let totalOutputSize = 0;
  let successCount = 0;
  let failCount = 0;

  // 각 이미지 변환
  for (const file of files) {
    const outputFileName = `${path.parse(file.name).name}.webp`;
    const outputPath = path.join(outputDir, outputFileName);

    process.stdout.write(`⏳ Converting ${file.name}... `);

    const result = await convertToWebP(file.path, outputPath, file.name);

    if (result.success) {
      totalInputSize += result.inputSize;
      totalOutputSize += result.outputSize;
      successCount++;

      const inputKB = (result.inputSize / 1024).toFixed(2);
      const outputKB = (result.outputSize / 1024).toFixed(2);

      console.log(`✅`);
      console.log(`   Input:  ${inputKB} KB`);
      console.log(`   Output: ${outputKB} KB`);
      console.log(`   Reduction: ${result.reduction}%\n`);
    } else {
      failCount++;
      console.log(`❌`);
      console.log(`   Error: ${result.error}\n`);
    }
  }

  // 요약
  console.log('='.repeat(70));
  console.log('\n📊 Summary:\n');
  console.log(`   Total files processed: ${files.length}`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Failed: ${failCount}`);

  if (successCount > 0) {
    const totalInputKB = (totalInputSize / 1024).toFixed(2);
    const totalOutputKB = (totalOutputSize / 1024).toFixed(2);
    const totalReduction = ((1 - totalOutputSize / totalInputSize) * 100).toFixed(1);

    console.log(`\n   Total input size: ${totalInputKB} KB`);
    console.log(`   Total output size: ${totalOutputKB} KB`);
    console.log(`   Total reduction: ${totalReduction}%`);
  }

  console.log(`\n💾 WebP files saved to: ${outputDir}\n`);

  // 사용 예시
  console.log('💡 Usage in React components:\n');
  console.log('   <picture>');
  console.log('     <source srcSet="/images/webp/image.webp" type="image/webp" />');
  console.log('     <source srcSet="/images/image.jpg" type="image/jpeg" />');
  console.log('     <img src="/images/image.jpg" alt="..." loading="lazy" />');
  console.log('   </picture>\n');

  process.exit(failCount > 0 ? 1 : 0);
}

// ============================================
// 실행
// ============================================

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
