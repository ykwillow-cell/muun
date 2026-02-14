import fs from 'fs';
import path from 'path';
import { Plugin } from 'vite';

/**
 * Vite 플러그인: 1,000개의 정적 페이지 사전 생성
 * 
 * 기능:
 * - popular-birth-dates.json에서 생년월일 리스트 읽기
 * - 각 생년월일별로 /yearly-fortune/:birthDate URL 생성
 * - 빌드 후 정적 HTML 파일 생성
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
        
        // popular-birth-dates.json 읽기
        const birthDatesPath = path.resolve(process.cwd(), 'popular-birth-dates.json');
        
        if (!fs.existsSync(birthDatesPath)) {
          console.warn('⚠️  popular-birth-dates.json not found, skipping pre-rendering');
          return;
        }

        const birthDatesData = JSON.parse(fs.readFileSync(birthDatesPath, 'utf-8'));
        const birthDates: string[] = birthDatesData.birth_dates || [];

        console.log(`📅 Found ${birthDates.length} birth dates to pre-render`);

        // 생성할 라우트 목록
        const routes = birthDates.map(date => `/yearly-fortune/${date}`);

        // 빌드 출력 디렉토리
        const outDir = path.resolve(viteConfig.build.outDir);
        const indexPath = path.resolve(outDir, 'index.html');

        if (!fs.existsSync(indexPath)) {
          console.warn('⚠️  index.html not found in build output');
          return;
        }

        // 기본 HTML 읽기
        const baseHtml = fs.readFileSync(indexPath, 'utf-8');

        // 각 라우트별 HTML 파일 생성
        let successCount = 0;
        let errorCount = 0;

        for (const route of routes) {
          try {
            // 라우트 경로에서 생년월일 추출
            const birthDate = route.split('/').pop();
            
            // 디렉토리 생성
            const routeDir = path.resolve(outDir, 'yearly-fortune', birthDate!);
            fs.mkdirSync(routeDir, { recursive: true });

            // HTML 파일 생성 (index.html 복사)
            // 실제 SSR이 필요한 경우 여기서 메타 태그 수정 가능
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
