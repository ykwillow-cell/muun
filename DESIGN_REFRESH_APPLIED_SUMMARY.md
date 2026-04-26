# MuUn 1.13.0 디자인 개선 적용 요약

이번 패치는 지금까지 진행한 pastel / soft-mobile 방향의 디자인 개선안을 실제 소스에 반영한 버전입니다.

## 핵심 반영 내용
- Pretendard 우선 폰트 스택 적용
- 홈 화면을 모바일 중심 pastel 톤으로 재구성
- 상단 앱바를 단순화하고 검색 / 전체 서비스 접근 구조 정리
- 하단 탭바를 모바일에서 항상 보이도록 개선
- 더 많은 무료 서비스 섹션과 전체 서비스 페이지 재정리
- 칼럼 / 사전 / 꿈해몽 / 결과 화면에 공통으로 쓰이는 light-pastel shared style 적용
- footer를 모바일에서는 숨기고 데스크톱 전용으로 정리

## 수정 파일
- client/src/components/AppBar.tsx
- client/src/components/BottomNav.tsx
- client/src/components/Footer.tsx
- client/src/components/HeroFirstVisit.tsx
- client/src/components/HeroReturnVisit.tsx
- client/src/components/ServiceGrid.tsx
- client/src/components/MainBanner.tsx
- client/src/components/HomeColumnSection.tsx
- client/src/components/HomeDictionarySection.tsx
- client/src/pages/More.tsx
- client/src/index.css

## 참고
- 기능 로직은 최대한 유지하고, shared UI shell과 홈 / 서비스 허브 중심으로 디자인을 개편했습니다.
- dictionary 대표 용어 링크는 실제 slug 확정이 어려운 항목은 search query 기반 링크로 연결했습니다.
