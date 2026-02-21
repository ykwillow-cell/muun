import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
  const staticRoutes = ['/', '/yearly-fortune', '/manselyeok', '/daily-fortune', '/dream'];
  
  // 동적 라우트 (운세 페이지 등) - 안정성을 위해 상위 100개만 우선 처리
  const dynamicRoutes = [];
  for (let year = 1970; year <= 2020; year++) {
    dynamicRoutes.push(`/yearly-fortune/${year}-01-01`);
  }

  const allRoutes = [...staticRoutes, ...dynamicRoutes];
  console.log(`📦 Total routes to pre-render: ${allRoutes.length}`);

  let successCount = 0;
  for (const url of allRoutes) {
    try {
      const { appHtml, head, dehydratedState } = await render({ path: url });
      
      const html = template
        .replace('<!--app-head-->', `${head.title}${head.meta}${head.link}`)
        .replace('<!--app-html-->', appHtml)
        .replace(
          '<!--__REACT_QUERY_STATE__-->',
          `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)}</script>`
        );

      const fileName = url === '/' ? 'index.html' : `${url.replace(/^\//, '').replace(/\//g, '-')}.html`;
      const filePath = toAbsolute(`../client/dist/public/${fileName}`);
      
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

  console.log(`✨ Successfully pre-rendered ${successCount} pages!`);
}

run().catch(console.error);
