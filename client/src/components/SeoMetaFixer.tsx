import { useEffect } from 'react';

/**
 * SeoMetaFixer Component
 * 
 * 배포 과정에서 제거되는 필수 SEO 메타 태그를 동적으로 주입합니다.
 * Manus 플랫폼의 vite-plugin-manus-runtime에 의해 정적 메타 태그가 필터링되므로,
 * 브라우저 렌더링 시점에 JavaScript를 통해 메타 태그를 강제로 추가합니다.
 * 
 * 주입되는 메타 태그:
 * 1. robots: 검색 엔진 크롤링 및 인덱싱 정책
 * 2. theme-color: 모바일 브라우저 상단 바 색상
 * 3. format-detection: 전화번호 자동 링크 방지
 */
export default function SeoMetaFixer() {
  useEffect(() => {
    // 1. Robots Meta (검색 엔진 수집 허용)
    let robotsMeta = document.querySelector("meta[name='robots']");
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute(
      'content',
      'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    );

    // 2. Theme Color (브라우저 상단 바 색상)
    let themeMeta = document.querySelector("meta[name='theme-color']");
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute('content', '#0f172a');

    // 3. Format Detection (전화번호 자동 링크 방지)
    let formatMeta = document.querySelector("meta[name='format-detection']");
    if (!formatMeta) {
      formatMeta = document.createElement('meta');
      formatMeta.setAttribute('name', 'format-detection');
      document.head.appendChild(formatMeta);
    }
    formatMeta.setAttribute('content', 'telephone=no');
  }, []); // 마운트 시 1회만 실행

  return null; // UI를 렌더링하지 않는 순수 기능 컴포넌트
}
