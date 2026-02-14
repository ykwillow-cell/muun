import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * ScrollToTop 컴포넌트
 * 
 * 페이지 경로(Route)가 변경될 때마다 화면을 자동으로 최상단으로 스크롤합니다.
 * 
 * 사용 방법:
 * - App.tsx의 최상위 레이아웃에 <ScrollToTop /> 배치
 * - 모든 페이지 이동 시 자동으로 작동
 * 
 * 예시:
 * <App>
 *   <ScrollToTop />
 *   <Routes>
 *     ...
 *   </Routes>
 * </App>
 */
export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // 경로가 변경될 때마다 스크롤을 최상단으로 이동
    window.scrollTo(0, 0);
  }, [location]);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}
