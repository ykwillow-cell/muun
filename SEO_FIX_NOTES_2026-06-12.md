# MUUN SEO final patch - 2026-06-12

이번 버전은 GSC에서 주요 메뉴 전체가 반복적으로 색인 실패한 상황을 전제로 다시 수정한 최종 점검본입니다.

## 핵심 수정

1. 전체 메뉴 색인 실패 대응
   - `scripts/prerender.mjs`에 `CORE_LANDING_CONTENT`를 추가했습니다.
   - 핵심 메뉴는 React SSR 결과에만 의존하지 않고, 고유한 H1/description/section 본문/관련 링크/Schema.org WebPage/BreadcrumbList가 들어간 정적 SEO HTML을 우선 생성합니다.
   - 적용 메뉴: `/`, `/family-saju`, `/naming`, `/hybrid-compatibility`, `/compatibility`, `/lifelong-saju`, `/daily-fortune`, `/yearly-fortune`, `/career-fortune`, `/moving-fortune`, `/manselyeok`, `/tojeong`, `/psychology`, `/astrology`, `/tarot`, `/lucky-lunch`, `/past-life`, `/tarot-history`, `/more`, `/about`, `/contact`, `/privacy`, `/terms`.

2. `/guide` 인덱스 보강
   - `/guide`도 React render에만 맡기지 않고, 칼럼 설명과 최근 칼럼 링크가 들어간 정적 SEO HTML을 생성하도록 보강했습니다.

3. noindex 오염 가능성 제거
   - `/career-fortune`, `/moving-fortune` 결과 화면의 `<meta name="robots" content="noindex" />`를 `index, follow`로 변경했습니다.
   - `/tarot-history`도 sitemap에 포함된 메뉴이므로 `noindex, follow`에서 `index, follow`로 변경했습니다.
   - 404 및 `/yearly-fortune/:birthDate` 상세 noindex는 유지했습니다.

4. `/more` 누락 보완
   - `App.tsx`에 라우트가 있는 `/more`를 `STATIC_ROUTES`와 `sitemap-core.xml`/`CORE_PAGES`에 추가했습니다.

5. 기존 SEO 수정 유지
   - `/career-fortune`, `/moving-fortune` sitemap/prerender 포함 유지
   - `/hybrid-compatibility` canonical 수정 유지
   - 꿈해몽 숫자 suffix slug self-canonical 유지
   - sitemap/prerender 기본 limit 일치 유지
   - Supabase fetch strict mode 유지

## 배포 후 확인 순서

1. Vercel 배포 로그 확인
   - Supabase fetch 실패 시 배포가 실패해야 정상입니다.
   - 조용히 백업 데이터로 성공 배포되는 상황을 막기 위해 `STRICT=1 STRICT_CONTENT_FETCH=1`을 유지했습니다.

2. 페이지 소스 보기 확인
   - 아래 URL에서 고유 title, description, canonical, H1, 본문 섹션이 소스에 보여야 합니다.
   - `/family-saju`
   - `/naming`
   - `/hybrid-compatibility`
   - `/compatibility`
   - `/lifelong-saju`
   - `/career-fortune`
   - `/moving-fortune`
   - `/guide`
   - `/more`

3. GSC 실제 URL 테스트
   - 페이지 가져오기: 성공
   - 색인 생성 허용 여부: 예
   - 사용자가 선언한 표준 URL: 검사 URL과 동일
   - Google이 선택한 표준 URL: 검사 URL과 동일 또는 비어 있음
   - robots: index 허용

4. 색인 요청은 핵심 메뉴부터
   - 전체 유효성 검사를 바로 누르기보다 핵심 메뉴 5~10개를 먼저 개별 URL 검사로 요청하는 것을 권장합니다.
