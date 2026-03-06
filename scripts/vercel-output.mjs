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

const srcDir = path.join(root, 'client', 'dist', 'public');
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

// 삭제된 페이지 URL 리다이렉트 규칙 생성
// 한글 URL은 원본 및 인코딩 버전 모두 동등하게 처리
const deletedUrls = [
  // Dictionary 페이지
  '/dictionary/baekho-sal', '/dictionary/bi-gyeop', '/dictionary/byeong-hwa',
  '/dictionary/chung', '/dictionary/dae-un', '/dictionary/earthly-branches',
  '/dictionary/eul-mok', '/dictionary/fire-element', '/dictionary/gi-sin',
  '/dictionary/gi-to', '/dictionary/gong-mang', '/dictionary/gwanseong',
  '/dictionary/gwimun-sal', '/dictionary/gye-su', '/dictionary/hap',
  '/dictionary/heavenly-stems', '/dictionary/hui-sin', '/dictionary/hwagae-sal',
  '/dictionary/hyeong', '/dictionary/im-su', '/dictionary/inseong',
  '/dictionary/jaeseong', '/dictionary/jeong-hwa', '/dictionary/metal-element',
  '/dictionary/mu-to', '/dictionary/sam-jae', '/dictionary/se-un',
  '/dictionary/siksang', '/dictionary/sin-geum', '/dictionary/wonjin-sal',
  '/dictionary/wood-element', '/dictionary/yin-yang-five-elements', '/dictionary/yong-sin',
  // Dream 페이지
  '/dream/가위', '/dream/강도', '/dream/개', '/dream/거미', '/dream/거북이',
  '/dream/거울', '/dream/거지', '/dream/결혼', '/dream/경찰', '/dream/고래',
  '/dream/고양이', '/dream/과일', '/dream/기린', '/dream/기본', '/dream/길',
  '/dream/꽃', '/dream/나무', '/dream/냉장고', '/dream/노인', '/dream/눈(신체',
  '/dream/달', '/dream/닭', '/dream/대통령', '/dream/도둑', '/dream/도망치는 꿈',
  '/dream/돈', '/dream/동굴', '/dream/동물', '/dream/돼지', '/dream/떨어지는 꿈',
  '/dream/똥', '/dream/물', '/dream/바늘', '/dream/바다', '/dream/밥',
  '/dream/벌', '/dream/보석', '/dream/봉황', '/dream/불', '/dream/비',
  '/dream/비행기', '/dream/사냥하는 꿈', '/dream/사자', '/dream/산', '/dream/상어',
  '/dream/샘물', '/dream/소', '/dream/손가락', '/dream/술', '/dream/숲',
  '/dream/시계', '/dream/시험', '/dream/씨앗', '/dream/아이', '/dream/안개',
  '/dream/양', '/dream/얼음', '/dream/연예인', '/dream/예수님', '/dream/우는 꿈',
  '/dream/웃는 꿈', '/dream/원숭이', '/dream/의사', '/dream/이별', '/dream/이사',
  '/dream/입', '/dream/죽음', '/dream/쥐', '/dream/지네', '/dream/지진',
  '/dream/집', '/dream/쫓기는 꿈', '/dream/책', '/dream/천둥번개', '/dream/침대',
  '/dream/코', '/dream/코끼리', '/dream/태양', '/dream/토끼', '/dream/폭포',
  '/dream/하늘', '/dream/하늘을 나는 꿈', '/dream/학교', '/dream/호랑이', '/dream/홍수',
  '/dream/화내는 꿈', '/dream/화산폭발', '/dream/화해하는 꿈', '/dream/흙', '/dream/TV'
];

// 한글 URL을 인코딩된 단로로 모든 리다이렉트 규칙 생성
const redirectRoutes = deletedUrls.flatMap(url => {
  const routes = [{
    src: `^${url}$`,
    status: 301,
    headers: { 'Location': '/' }
  }];
  
  // 한글이 도함면 인코딩 버전도 추가
  const encoded = encodeURI(url);
  if (encoded !== url) {
    routes.push({
      src: `^${encoded}$`,
      status: 301,
      headers: { 'Location': '/' }
    });
  }
  
  return routes;
});

// config.json 생성 (SPA 라우팅 + 캐시 헤더 설정)
const config = {
  version: 3,
  routes: [
    // 0. 삭제된 페이지 리다이렉트 (301 Moved Permanently)
    ...redirectRoutes,
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
      src: '/.*',
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
