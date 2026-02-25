/**
 * Vercel Build Output API 구조 생성 스크립트
 *
 * 빌드 후 dist/public 파일을 .vercel/output/static으로 복사하고
 * config.json을 생성합니다.
 *
 * 이 방식은 Vercel의 프레임워크 감지 및 outputDirectory 해석 문제를
 * 완전히 우회하며, Hobby/Pro/Enterprise 모든 플랜에서 동작합니다.
 *
 * 참고: https://vercel.com/docs/build-output-api/configuration
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const srcDir = path.join(root, 'dist', 'public');
const outDir = path.join(root, '.vercel', 'output');
const staticDir = path.join(outDir, 'static');

console.log('📦 Generating Vercel Build Output API structure...');

// .vercel/output/static 디렉토리 생성
fs.mkdirSync(staticDir, { recursive: true });

// dist/public → .vercel/output/static 복사
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(srcDir, staticDir);
console.log(`✅ Copied dist/public → .vercel/output/static`);

// config.json 생성 (SPA 라우팅 + 캐시 헤더 설정)
const config = {
  version: 3,
  routes: [
    // 1. 정적 에셋 (assets/) - 1년 캐시
    {
      src: '/assets/(.*)',
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
      continue: true
    },
    // 2. JS 파일 - 1시간 캐시
    {
      src: '/(.*)\\.js',
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
      continue: true
    },
    // 3. CSS 파일 - 1시간 캐시
    {
      src: '/(.*)\\.css',
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
      continue: true
    },
    // 4. 이미지 파일 - 1일 캐시
    {
      src: '/(.*)\\.(?:webp|jpg|jpeg|png|gif|svg|ico)',
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' },
      continue: true
    },
    // 5. sitemap.xml - 1일 캐시
    {
      src: '/sitemap(?:-[\\w-]+)?\\.xml',
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' },
      continue: true
    },
    // 6. HTML 파일 및 루트 - 1시간 캐시
    {
      src: '/(.*)\\.html',
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
      continue: true
    },
    // 7. 정적 파일 먼저 서빙 시도
    { handle: 'filesystem' },
    // 8. 없으면 SPA index.html로 폴백 (클라이언트 사이드 라우팅)
    {
      src: '/(.*)',
      dest: '/index.html'
    }
  ]
};

fs.writeFileSync(
  path.join(outDir, 'config.json'),
  JSON.stringify(config, null, 2)
);
console.log('✅ Generated .vercel/output/config.json');
console.log('🎉 Vercel Build Output API structure ready!');
