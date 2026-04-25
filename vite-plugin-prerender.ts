import fs from 'fs';
import path from 'path';
import { Plugin } from 'vite';

/**
 * Vite 플러그인: 정적 페이지 사전 생성
 * 
 * 기능:
 * - config.routes에서 라우트 리스트 읽기
 * - popular-birth-dates.json에서 생년월일 리스트 읽기
 * - 각 라우트별로 정적 HTML 파일 생성
 */

interface PreRenderConfig {
  routes: string[];
  renderer?: (route: string) => Promise<string>;
}

export function vitePluginPrerender(config: PreRenderConfig): Plugin {
  let viteConfig: any;

  return {
    name: 'vite-plugin-prerender',
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig;
    },
    async closeBundle() {
      if (viteConfig.command === 'build') {
        console.log('🔄 Pre-rendering static pages...');
        
        // 빌드 출력 디렉토리
        const outDir = path.resolve(viteConfig.build.outDir);
        const indexPath = path.resolve(outDir, 'index.html');

        if (!fs.existsSync(indexPath)) {
          console.warn('⚠️  index.html not found in build output');
          return;
        }

        // 기본 HTML 읽기
        const baseHtml = fs.readFileSync(indexPath, 'utf-8');

        // 생성할 라우트 목록
        let routes: string[] = config.routes || [];

        // popular-birth-dates.json 읽기 (있으면 추가)
        const birthDatesPath = path.resolve(process.cwd(), 'popular-birth-dates.json');
        if (fs.existsSync(birthDatesPath)) {
          try {
            const birthDatesData = JSON.parse(fs.readFileSync(birthDatesPath, 'utf-8'));
            const birthDates: string[] = birthDatesData.birth_dates || [];
            const birthDateRoutes = birthDates.map(date => `/yearly-fortune/${date}`);
            routes = [...routes, ...birthDateRoutes];
            console.log(`📅 Found ${birthDates.length} birth dates to pre-render`);
          } catch (err) {
            console.warn('⚠️  Error reading popular-birth-dates.json:', err);
          }
        }

        if (routes.length === 0) {
          console.warn('⚠️  No routes to pre-render');
          return;
        }

        console.log(`🔄 Pre-rendering ${routes.length} routes...`);

        // 각 라우트별 HTML 파일 생성
        let successCount = 0;
        let errorCount = 0;

        for (const route of routes) {
          try {
            // 라우트를 경로로 변환
            const parts = route.split('/').filter(Boolean);
            
            if (parts.length === 0) {
              // 루트 경로는 이미 index.html이므로 스킵
              successCount++;
              continue;
            }
            
            // 디렉토리 생성
            const routeDir = path.resolve(outDir, ...parts);
            fs.mkdirSync(routeDir, { recursive: true });

            // HTML 파일 생성 (index.html 복사)
            fs.writeFileSync(path.resolve(routeDir, 'index.html'), baseHtml);

            successCount++;
          } catch (err) {
            console.error(`❌ Error pre-rendering ${route}:`, err);
            errorCount++;
          }
        }

        console.log(`✅ Pre-rendering complete: ${successCount} pages generated, ${errorCount} errors`);
      }
    },
  };
}
