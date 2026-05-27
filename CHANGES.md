# 무운사주 UI/UX 업데이트 — 최종본

---

## 수정 파일 목록

### pages/ (21개)

| 파일 | 주요 변경 내용 |
|------|--------------|
| FortuneDictionary.tsx | Hero 제거 → sticky 파스텔 검색 헤더, 카테고리 4열 그리드, 1열 카드, 태그·뱃지 클릭 필터, URL 파라미터 동기화, 서비스 링크 |
| DictionaryDetail.tsx | 핵심요약 hero 통합, 태그→사전검색 링크, 이전/다음 용어 네비, 관련용어 가로스크롤, 카테고리 전체보기 링크 |
| Guide.tsx | Hero 제거 → sticky 파스텔 검색 헤더, 카테고리 4열 그리드(편수 표시), 1열 가로 카드, 정렬 드롭다운 |
| GuideDetail.tsx | 영어 배지 제거, 완독 후 CTA(무료·가입불필요 강조), 카테고리별 문맥 서비스 훅, 관련칼럼 1열 레이아웃 |
| More.tsx | 카테고리 6개 그룹화, UX 라이팅 전면 교체(동기 중심), 소개문구·하단CTA 제거, 색상 아이콘 카드 |
| DreamInterpretation.tsx | RelatedServices 추가, "모바일 중심으로 정리했습니다" 문구 제거 |
| DreamDetail.tsx | RelatedServices 강화(평생사주 중복 제거) |
| Astrology.tsx | 폰트 사이즈·웨이트 수정 |
| Compatibility.tsx | 폰트 사이즈·웨이트 수정 |
| HybridCompatibility.tsx | 폰트 사이즈·웨이트 수정 |
| DailyFortune.tsx | 폰트 사이즈·웨이트 수정 |
| LifelongSaju.tsx | 폰트 사이즈·웨이트 수정 |
| Manselyeok.tsx | 폰트 사이즈·웨이트 수정 |
| Naming.tsx | RelatedServices 추가, 폰트 수정 |
| PastLife.tsx | RelatedServices 강화, 폰트 수정 |
| Tarot.tsx | 폰트 사이즈·웨이트 수정 |
| Tojeong.tsx | 폰트 사이즈·웨이트 수정 |
| YearlyFortune.tsx | 폰트 사이즈·웨이트 수정 |
| YearlyFortuneDetail.tsx | RelatedServices 추가 |
| FamilySaju.tsx | 폰트 수정 |
| TarotHistory.tsx | 폰트 수정 |

### components/ (11개)

| 파일 | 주요 변경 내용 |
|------|--------------|
| RelatedServices.tsx | "Related services" → "함께 이용하기" |
| RelatedTermsSection.tsx | "Related terms" → "연관 용어" |
| CallToAction.tsx | 신뢰 배지 "모바일 최적화" → "지금 바로 확인", 폰트 수정 |
| BottomNav.tsx | iOS 오버스크롤 공백 버그 수정 (paddingBottom 인라인 제거) |
| GNB.tsx | 폰트 사이즈·웨이트 수정 |
| SajuChart.tsx | 폰트 수정 |
| SurnameCombobox.tsx | 폰트 수정 |
| RecommendedContent.tsx | 폰트 수정 |
| TodayTermCard.tsx | 폰트 수정 |
| CompatibilityContent.tsx | 폰트 수정 |
| DreamQuickSearch.tsx | 폰트 수정 |

### CSS (1개)

| 파일 | 변경 내용 |
|------|----------|
| client/src/index.css | BottomNav spacer 고정 높이(120px), will-change:transform 추가 |

---

## 적용된 디자인 규칙

### 폰트 사이즈
- 기본: `text-base` (16px)
- 보조: `text-sm` (14px)
- 최소: `text-xs` (12px) — `text-[9px]` ~ `text-[11px]` 전수 교체 (143건)

### 폰트 웨이트
- 최대: `font-bold` (700) — `font-extrabold`(800), `font-black`(900) 전수 교체 (90건)

### 색상 시스템
- sticky 헤더: `#f5f4ff` 파스텔 라이트 (메인 홈 톤 통일)
- hero 섹션: `#3929a0` 브랜드 딥 퍼플 기준
- (기존 `#130e45` 네이비 → `#3929a0` 브랜드 퍼플로 교체)

### 내부링크
- 전 페이지 RelatedServices/교차링크 추가
- 중복 섹션 정리 (RecommendedContent 있는 페이지에서 RelatedServices 제거)
- "모바일 최적화" 등 사용자 불필요 문구 제거

---

## index.css 별도 수정 필요

`INDEX_CSS_PATCH.md` 참고 — `.mu-hero-shell` 배경 그라디언트 1줄 변경
