# MuUn HTML Theme Renewal Applied

이 패키지는 업로드된 `muunsaju_final_full (1).html` 메인 화면 시안을 기준으로 무운사주 1.13.0 소스에 디자인 리뉴얼을 반영한 버전입니다.

## 핵심 반영 내용
- 메인 홈 화면을 HTML 시안 톤에 맞춰 파스텔/라벤더 중심 UI로 정리
- 앱바를 HTML 시안과 비슷한 로고 + 벨 + 메뉴 구조로 단순화
- 홈의 빠른 서비스 아이콘, 오늘의 운세 카드, 대표 서비스 카드, 칼럼/사전 섹션, 더 많은 무료 서비스 섹션 스타일 적용
- 전체 서브페이지에 공통으로 적용되는 배경, 카드, 버튼, 입력창, 라우트 배너, 하단탭 스타일을 메인 톤에 맞춰 재정렬
- Guide / Dream / Fortune Dictionary 리스트형 화면에서 상단 라우트 배너 중복 노출 방지

## 주요 수정 파일
- `client/src/components/AppBar.tsx`
- `client/src/components/RouteBanner.tsx`
- `client/src/index.css`

## 이미 반영된 홈 관련 파일 유지
- `client/src/components/HeroFirstVisit.tsx`
- `client/src/components/HeroReturnVisit.tsx`
- `client/src/components/ServiceGrid.tsx`
- `client/src/components/MainBanner.tsx`
- `client/src/components/HomeColumnSection.tsx`
- `client/src/components/HomeDictionarySection.tsx`
- `client/src/components/Footer.tsx`
- `client/src/pages/More.tsx`

## 참고
- 수정한 주요 TSX 파일은 문법 파싱(syntax) 확인을 수행했습니다.
- 전체 프로덕션 빌드는 이 환경에서 실행하지 않았습니다. 적용 후 브랜치/Vercel Preview에서 확인하는 것을 권장합니다.
