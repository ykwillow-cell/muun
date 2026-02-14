import { useEffect } from 'react';

/**
 * SeoMetaFixer Component - Phase 3 Upgraded Version
 * 
 * 배포 과정에서 제거되는 필수 SEO 메타 태그를 동적으로 주입합니다.
 * Phase 2: 기본 SEO 메타 태그 (robots, theme-color, format-detection)
 * Phase 3: 소셜 미디어 최적화 (Open Graph, Twitter Card)
 * 
 * 주입되는 메타 태그:
 * 1. robots: 검색 엔진 크롤링 및 인덱싱 정책
 * 2. theme-color: 모바일 브라우저 상단 바 색상
 * 3. format-detection: 전화번호 자동 링크 방지
 * 4. Open Graph (og:*): 카카오톡, 페이스북 등 소셜 미디어 공유 최적화
 * 5. Twitter Card (twitter:*): 트위터/X 공유 최적화
 */
const SeoMetaFixer = () => {
  useEffect(() => {
    /**
     * 메타 태그를 생성하거나 업데이트하는 헬퍼 함수
     * @param attributeName - 태그의 속성 이름 ('name' 또는 'property')
     * @param attributeValue - 속성의 값 (예: 'description', 'og:title')
     * @param content - 태그의 내용
     */
    const setMetaTag = (
      attributeName: string,
      attributeValue: string,
      content: string
    ) => {
      // 기존 태그가 있는지 확인
      let element = document.querySelector(
        `meta[${attributeName}="${attributeValue}"]`
      );

      // 없으면 새로 생성
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }

      // 내용 설정
      element.setAttribute('content', content);
    };

    // --- 1. 기본 SEO & 뷰포트 설정 (Phase 2 항목) ---
    setMetaTag(
      'name',
      'robots',
      'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    );
    setMetaTag('name', 'theme-color', '#0f172a'); // 무운 브랜드 컬러
    setMetaTag('name', 'format-detection', 'telephone=no');

    // --- 2. Open Graph 설정 (카카오톡, 페이스북 등) ---
    // 주의: og 태그는 name 대신 property 속성을 사용합니다.
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', '무운 (Muun)');
    setMetaTag(
      'property',
      'og:title',
      '무운 (Muun) - AI가 분석하는 나의 운명'
    );
    setMetaTag(
      'property',
      'og:description',
      '오늘의 운세부터 사주 심층 분석까지, AI 무운이 당신의 하루를 안내합니다.'
    );
    setMetaTag('property', 'og:url', window.location.href);

    // Open Graph 이미지 (소셜 미디어 공유 시 표시되는 이미지)
    // 주의: 실제 이미지 URL로 변경해야 합니다.
    // 예: 'https://muunsaju.com/og-image.png' 또는 CDN URL
    setMetaTag(
      'property',
      'og:image',
      'https://muunsaju.com/images/og-default.png'
    );
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:image:alt', '무운 - AI가 분석하는 나의 운명');

    // --- 3. Twitter Card 설정 (트위터/X) ---
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag(
      'name',
      'twitter:title',
      '무운 (Muun) - AI가 분석하는 나의 운명'
    );
    setMetaTag(
      'name',
      'twitter:description',
      '오늘의 운세부터 사주 심층 분석까지, AI 무운이 당신의 하루를 안내합니다.'
    );

    // 트위터용 이미지 (Open Graph 이미지와 동일하게 설정 추천)
    setMetaTag(
      'name',
      'twitter:image',
      'https://muunsaju.com/images/og-default.png'
    );
  }, []);

  // 이 컴포넌트는 UI를 렌더링하지 않습니다.
  return null;
};

export default SeoMetaFixer;
