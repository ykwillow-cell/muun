import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Vercel 빌드 한도: 45분(2700초) - Hobby/Pro/Enterprise 모두 동일
// 빌드 오버헤드(install + vite build + ssr build + server build) ~44초 예상
// 안전 마진 25% 적용 → prerender 가용 시간: ~2000초
const BUILD_START_TIME = Date.now();
const MAX_PRERENDER_SECONDS = 2000; // 안전 마진 포함 최대 허용 시간(초)

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

async function run() {
  console.log('🚀 Starting final stable pre-render...');
  
  const templatePath = toAbsolute('../client/dist/public/index.html');
  let template = fs.readFileSync(templatePath, 'utf-8');
  
  // 템플릿 마커 주입 (빌드 시 제거된 경우 대비)
  if (!template.includes('<!--app-html-->')) {
    template = template.replace('<div id="root"></div>', '<div id="root"><!--app-html--></div>');
    template = template.replace('</title>', '</title><!--app-head-->');
    template = template.replace('</body>', '<!--__REACT_QUERY_STATE__--></body>');
  }

  const serverEntryPath = toAbsolute('../client/dist/server/entry-server.js');
  const { render } = await import(pathToFileURL(serverEntryPath).href);
  
  // 프리렌더링할 주요 라우트
  const staticRoutes = [
    '/', 
    '/yearly-fortune', 
    '/manselyeok', 
    '/daily-fortune', 
    '/dream',
    '/lifelong-saju',
    '/compatibility',
    '/tojeong',
    '/psychology',
    '/astrology',
    '/tarot',
    '/about',
    '/privacy',
    '/terms',
    '/family-saju',
    '/hybrid-compatibility',
    '/fortune-dictionary',
    '/lucky-lunch',
    '/contact',
    '/guide'
  ];
  
  // 칼럼 상세 페이지 라우트
  const columnRoutes = [
  '/guide/column-001',
  '/guide/column-002',
  '/guide/column-003',
  '/guide/column-004',
  '/guide/column-005',
  '/guide/column-006',
  '/guide/column-007',
  '/guide/column-008',
  '/guide/column-009',
  '/guide/column-010',
  '/guide/column-011',
  '/guide/column-012',
  '/guide/column-013',
  '/guide/column-014',
  '/guide/column-015',
  '/guide/column-016',
  '/guide/column-017',
  '/guide/column-018',
  '/guide/column-019',
  '/guide/column-020',
  '/guide/column-021',
  '/guide/column-022',
  '/guide/column-023',
  '/guide/column-024',
  '/guide/column-025',
  '/guide/column-026',
  '/guide/column-027',
  '/guide/column-028',
  '/guide/column-029',
  '/guide/column-030',
];

  // 동적 라우트 (운세 페이지 등) - 안정성을 위해 상위 100개만 우선 처리
  const dynamicRoutes = [];
  for (let year = 1970; year <= 2020; year++) {
    dynamicRoutes.push(`/yearly-fortune/${year}-01-01`);
  }

  const allRoutes = [...staticRoutes, ...columnRoutes, ...dynamicRoutes];
  console.log(`📦 Total routes to pre-render: ${allRoutes.length}`);

  let successCount = 0;
  let skippedCount = 0;
  for (const url of allRoutes) {
    // Vercel Hobby 빌드 시간 초과 방지: 가용 시간 소진 시 조기 종료
    const elapsedSeconds = (Date.now() - BUILD_START_TIME) / 1000;
    if (elapsedSeconds > MAX_PRERENDER_SECONDS) {
      console.warn(`⏱️  Build time limit approaching (${elapsedSeconds.toFixed(1)}s elapsed). Stopping prerender to avoid Vercel Hobby timeout.`);
      skippedCount = allRoutes.length - successCount;
      break;
    }
    try {
      const { appHtml, head, dehydratedState } = await render({ path: url });
      
      const html = template
        .replace('<!--app-head-->', `${head.title}${head.meta}${head.link}`)
        .replace('<!--app-html-->', appHtml)
        .replace(
          '<!--__REACT_QUERY_STATE__-->',
          `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)}</script>`
        );

      // 디렉토리 기반 경로로 저장: /yearly-fortune → yearly-fortune/index.html
      // 이렇게 하면 Vercel filesystem 핸들러가 /yearly-fortune 요청에 대해
      // yearly-fortune/index.html을 자동으로 매칭할 수 있음
      const filePath = url === '/'
        ? toAbsolute('../client/dist/public/index.html')
        : toAbsolute(`../client/dist/public${url}/index.html`);
      
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, html);
      successCount++;
      
      if (successCount % 20 === 0) {
        console.log(`✅ Processed ${successCount}/${allRoutes.length} pages...`);
      }
    } catch (e) {
      console.error(`❌ Failed to render ${url}:`, e.message);
    }
  }

  const totalElapsed = ((Date.now() - BUILD_START_TIME) / 1000).toFixed(1);
  console.log(`✨ Successfully pre-rendered ${successCount} pages in ${totalElapsed}s!`);
  if (skippedCount > 0) {
    console.warn(`⚠️  Skipped ${skippedCount} pages due to build time limit. Consider reducing route count if this persists.`);
  }
}

run().catch(console.error);
