/**
 * useCanonical Hook
 * 각 페이지에서 자기 참조 Canonical 태그를 자동으로 설정
 * 
 * 사용법:
 * useCanonical('/yearly-fortune');
 */

import { useEffect } from 'react';

export function useCanonical(path: string) {
  useEffect(() => {
    const baseUrl = 'https://muunsaju.com';
    const canonicalUrl = `${baseUrl}${path}`;

    // 기존 canonical 태그 찾기
    let canonicalLink = document.querySelector('link[rel="canonical"]');

    if (canonicalLink) {
      // 기존 태그 업데이트
      canonicalLink.setAttribute('href', canonicalUrl);
    } else {
      // 새 태그 생성
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = canonicalUrl;
      document.head.appendChild(canonicalLink);
    }

    // 정리 함수 (선택사항)
    return () => {
      // 필요하면 여기서 정리 작업 수행
    };
  }, [path]);
}
