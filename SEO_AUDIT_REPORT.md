# 무운(MUUN) SEO 기술 점검 보고서
**작성일**: 2026-02-12  
**검사 대상**: muunsaju.com

---

## 1. 기술적 SEO (Technical SEO) 점검

### 1.1 색인 방해 요소 확인 ✅
**상태**: 양호  
**발견 사항**:
- noindex 태그: **없음** (전체 코드 검색 결과 noindex 태그 발견 안 됨)
- 모든 페이지가 색인 가능한 상태
- robots.txt에서 모든 페이지 크롤 허용 (Allow: /)

**원인 분석 (18개 발견, 1개만 색인)**:
구글 서치콘솔에서 18개 페이지가 발견되었으나 1개만 색인된 이유는:
1. **동적 콘텐츠**: 결과 페이지들(YearlyFortune, LifelongSaju 등)이 사용자 입력 후 동적으로 생성되는 페이지
2. **메타 태그 부재**: 동적 페이지에 고유한 메타 태그(title, description)가 설정되지 않음
3. **구조화된 데이터 부재**: Schema.org 마크업 없음

---

### 1.2 404 오류 및 301 리디렉션 ⚠️
**상태**: 주의 필요  
**발견 사항**:
- 404 오류: 3개 발견됨 (서치콘솔 보고)
- 301 리디렉션: 현재 설정 없음

**권장 사항**:
- Vercel의 `vercel.json`에서 리디렉션 규칙 추가 필요
- 변경된 URL 경로에 대한 301 리디렉션 설정

**현재 라우팅 구조** (App.tsx):
```
/ → Home
/yearly-fortune → YearlyFortune
/lifelong-saju → LifelongSaju
/family-saju → FamilySaju
/tarot → Tarot
/tojeong → Tojeong
/compatibility → Compatibility
/hybrid-compatibility → HybridCompatibility
/manselyeok → Manselyeok
/fortune-dictionary → FortuneDictionary
/astrology → Astrology
/daily-fortune → DailyFortune
/psychology → Psychology
/tarot-history → TarotHistory
/about → About
/contact → Contact
/privacy → Privacy
/terms → Terms
/lucky-lunch → LuckyLunch (⚠️ sitemap.xml에 미포함)
```

---

### 1.3 동적 사이트맵 (Sitemap.xml) ⚠️
**상태**: 부분적 개선 필요  
**현재 상황**:
- ✅ 정적 사이트맵 존재: `/client/public/sitemap.xml`
- ✅ robots.txt에 sitemap 위치 명시: `Sitemap: https://muunsaju.com/sitemap.xml`
- ❌ **누락된 페이지**: `/lucky-lunch` (LuckyLunch 컴포넌트는 App.tsx에 등록되어 있으나 sitemap에 미포함)

**현재 sitemap 페이지 수**: 18개

**권장 사항**:
1. **LuckyLunch 페이지 추가**:
   ```xml
   <url>
     <loc>https://muunsaju.com/lucky-lunch</loc>
     <lastmod>2026-02-12</lastmod>
     <changefreq>weekly</changefreq>
     <priority>0.8</priority>
   </url>
   ```

2. **동적 사이트맵 자동 갱신** (향후 개선):
   - 현재는 정적 XML 파일
   - 향후 새로운 콘텐츠 추가 시 수동으로 업데이트 필요
   - 자동화를 위해서는 백엔드 서버 필요 (web-db-user 업그레이드 고려)

---

## 2. 온페이지 SEO (On-Page SEO) 점검

### 2.1 동적 메타 태그 ❌
**상태**: 개선 필요  
**현재 상황**:
- ✅ 메인 페이지(index.html): 기본 메타 태그 설정됨
  - Title: "무운 (MuUn) - 회원가입 없는 무료 사주 및 2026년 신년 운세"
  - Description: "회원가입 없이 생년월일만으로 확인하는 무료 사주, 2026년 병오년 신년 운세, 토정비결, 궁합 서비스..."
  
- ❌ **결과 페이지**: 동적 메타 태그 설정 없음
  - YearlyFortune, LifelongSaju, DailyFortune 등 결과 페이지에서 사용자 입력 후 고유한 title/description 미생성

**문제점**:
- 모든 페이지가 동일한 메타 태그 사용
- 검색 결과에서 클릭률(CTR) 저하
- 각 서비스별 고유 키워드 최적화 불가

**권장 사항**:
React Helmet 또는 react-head 라이브러리 도입하여 동적 메타 태그 설정:
```tsx
// 예시
useEffect(() => {
  document.title = `${userName}님의 2026년 신년운세 - 무운`;
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content', 
    `${userName}님의 사주팔자를 분석한 2026년 신년운세 결과입니다.`
  );
}, [userName]);
```

---

### 2.2 시맨틱 마크업 (H1~H3) ✅
**상태**: 양호  
**발견 사항**:
- H1 태그: 29개 사용
- H2 태그: 70개 사용
- H3 태그: 적절히 사용됨

**예시 (YearlyFortune.tsx)**:
```tsx
<h2 className="text-lg font-bold text-white">{userName}님의 사주팔자</h2>
<h2 className="text-lg font-bold text-white">일간(日干) 성격 분석</h2>
<h2 className="text-lg font-bold text-white">2026년 병오년(丙午年) 총운</h2>
```

**개선 사항**:
- 페이지당 H1은 1개만 사용하는 것이 권장됨 (현재는 여러 개 사용)
- 각 페이지의 주제를 명확히 하는 H1 태그 추가 권장

---

### 2.3 이미지 Alt 태그 ✅
**상태**: 양호  
**발견 사항**:
- Tarot.tsx: ✅ alt 속성 있음 (`alt={card.korName}`)
- TarotHistory.tsx: ✅ alt 속성 있음 (`alt={card.name}`)
- 대부분의 아이콘: Lucide React 아이콘 사용 (접근성 자동 처리)

**결론**: 이미지 alt 태그 누락 없음

---

## 3. 추가 SEO 개선 사항

### 3.1 구조화된 데이터 (Schema.org) ❌
**현재 상태**: 없음  
**권장 사항**:
```tsx
// 예시: Organization Schema
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MUUN",
  "url": "https://muunsaju.com",
  "description": "회원가입 없는 무료 사주 및 운세 서비스"
}
</script>
```

### 3.2 Open Graph 메타 태그 ⚠️
**현재 상태**: 기본 메타 태그만 있음  
**권장 사항**: OG 태그 추가
```html
<meta property="og:title" content="무운 (MuUn) - 무료 사주 및 운세" />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:url" content="https://muunsaju.com" />
```

### 3.3 모바일 최적화 ✅
**상태**: 양호
- Viewport 메타 태그: ✅ 설정됨
- 반응형 디자인: ✅ 적용됨
- 모바일 속도: Vercel CDN으로 최적화됨

---

## 4. 구글 서치콘솔 데이터 해석

### 발견된 18개 페이지 목록:
1. ✅ / (홈)
2. /yearly-fortune (신년운세)
3. /lifelong-saju (평생사주)
4. /family-saju (가족사주)
5. /tarot (AI 타로)
6. /tojeong (토정비결)
7. /compatibility (궁합)
8. /hybrid-compatibility (궁합 심화)
9. /manselyeok (만세력)
10. /fortune-dictionary (운세 용어 사전)
11. /astrology (별자리)
12. /daily-fortune (오늘의 운세)
13. /psychology (심리 테스트)
14. /tarot-history (타로 히스토리)
15. /about (소개)
16. /contact (문의)
17. /privacy (개인정보)
18. /terms (이용약관)

**누락된 페이지**:
- ❌ /lucky-lunch (행운의 점심 메뉴) - sitemap.xml에 미포함

### 색인된 페이지 (1개):
- ✅ / (홈 페이지만 색인됨)

**원인**: 다른 페이지들이 동적 콘텐츠 페이지이고 고유 메타 태그가 없어 구글이 색인 우선순위를 낮게 평가

---

## 5. 우선순위별 개선 계획

### 🔴 긴급 (1순위)
1. **sitemap.xml에 /lucky-lunch 추가**
2. **동적 메타 태그 구현** (React Helmet 도입)
3. **구글 서치콘솔 재검증** (유효성 검사 완료 후)

### 🟡 중요 (2순위)
1. 구조화된 데이터(Schema.org) 추가
2. Open Graph 메타 태그 추가
3. 301 리디렉션 규칙 설정 (404 오류 해결)

### 🟢 권장 (3순위)
1. 각 페이지별 고유 H1 태그 정리
2. 내부 링크 구조 최적화
3. 페이지 로딩 속도 최적화

---

## 6. 결론

**현재 SEO 상태**: 기본 구조는 양호하나 **동적 메타 태그 부재**로 인해 색인 성능 저하

**즉시 조치 사항**:
1. ✅ sitemap.xml에 /lucky-lunch 추가
2. ✅ React Helmet 도입하여 동적 메타 태그 구현
3. ✅ 구글 서치콘솔에서 재검증 요청

이 조치들을 완료하면 **구글 색인 속도가 현저히 개선**될 것으로 예상됩니다.

---

**다음 단계**: 위 권장사항 구현 후 구글 서치콘솔에서 URL 검사 및 색인 재요청
