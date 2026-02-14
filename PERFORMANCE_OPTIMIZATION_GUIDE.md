# 🚀 성능 최적화 가이드 (LCP 1.2초 이내)

## 📋 구현된 최적화 사항

### 1. Vite 설정 최적화 (`vite.config.ts`)

#### 코드 분할 (Code Splitting)
```typescript
rollupOptions: {
  output: {
    manualChunks: {
      'vendor': ['react', 'react-dom', 'wouter'],
      'ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
      'animation': ['framer-motion'],
      'charts': ['recharts'],
    },
  },
}
```

**효과**:
- 초기 로드 번들 크기 감소
- 병렬 다운로드로 로딩 시간 단축
- 캐싱 효율성 증가

#### 코드 최소화 (Minification)
```typescript
minify: 'terser',
terserOptions: {
  compress: {
    drop_console: true,
    drop_debugger: true,
  },
}
```

**효과**:
- 번들 크기 20-30% 감소
- 프로덕션 환경에서 console.log 제거
- 파일 전송 시간 단축

#### 소스맵 비활성화
```typescript
sourcemap: false
```

**효과**:
- 배포 크기 감소
- 프로덕션 환경 보안 강화

---

### 2. Vercel 캐싱 전략 (`vercel.json`)

#### 정적 자산 (Assets)
```json
{
  "source": "/assets/(.*)",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=31536000, immutable"
    }
  ]
}
```

**효과**:
- 1년 캐싱 (31536000초)
- 브라우저 캐시 최대 활용
- 반복 방문 시 0ms 로딩

#### JavaScript/CSS (1시간)
```json
{
  "source": "/(.*).js",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=3600, s-maxage=3600"
    }
  ]
}
```

**효과**:
- 1시간 브라우저 캐싱
- 1시간 CDN 캐싱
- 업데이트 반영 시간 최소화

#### 이미지 (24시간)
```json
{
  "source": "/(.*).webp",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=86400, s-maxage=86400"
    }
  ]
}
```

**효과**:
- 24시간 캐싱
- 이미지 전송 시간 단축
- 대역폭 절약

#### HTML (1시간)
```json
{
  "source": "/",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=3600, s-maxage=3600"
    }
  ]
}
```

**효과**:
- 1시간 캐싱
- 새로운 콘텐츠 빠른 반영
- 항상 최신 버전 제공

---

## 🎯 성능 측정 및 모니터링

### Lighthouse 성능 점수 확인

1. **Chrome DevTools 사용**
   ```
   F12 → Lighthouse → Generate report
   ```

2. **Google PageSpeed Insights**
   ```
   https://pagespeed.web.dev/
   ```

3. **WebPageTest**
   ```
   https://www.webpagetest.org/
   ```

### 주요 메트릭

| 메트릭 | 목표 | 설명 |
|--------|------|------|
| **LCP** | < 1.2초 | Largest Contentful Paint |
| **FID** | < 100ms | First Input Delay |
| **CLS** | < 0.1 | Cumulative Layout Shift |
| **FCP** | < 1.8초 | First Contentful Paint |
| **TTFB** | < 600ms | Time to First Byte |

---

## 📊 최적화 전후 비교

### 최적화 전
```
Bundle Size: 2,358 KB (gzip: 569 KB)
LCP: ~2.5초
FCP: ~1.8초
TTI: ~3.2초
```

### 최적화 후 (예상)
```
Bundle Size: 1,800 KB (gzip: 450 KB) ↓ 21%
LCP: ~1.0초 ↓ 60%
FCP: ~1.2초 ↓ 33%
TTI: ~2.0초 ↓ 38%
```

---

## 🔧 추가 최적화 (선택사항)

### 1. 동적 임포트 (Lazy Loading)

```typescript
// 무거운 컴포넌트는 동적으로 로드
const Tarot = lazy(() => import('./pages/Tarot'));
const Astrology = lazy(() => import('./pages/Astrology'));

// Suspense로 감싸기
<Suspense fallback={<LoadingSpinner />}>
  <Tarot />
</Suspense>
```

**효과**: 초기 로드 시간 단축

### 2. 이미지 최적화 (WebP)

```bash
pnpm optimize-images
```

**효과**: 이미지 크기 30-50% 감소

### 3. 폰트 최적화

```css
/* font-display: swap으로 FOUT 방지 */
@font-face {
  font-family: 'Custom Font';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
}
```

**효과**: 폰트 로딩 중 텍스트 표시

### 4. 리소스 힌트

```html
<!-- DNS 미리 조회 -->
<link rel="dns-prefetch" href="https://api.example.com" />

<!-- 연결 미리 설정 -->
<link rel="preconnect" href="https://fonts.googleapis.com" />

<!-- 리소스 미리 로드 -->
<link rel="preload" href="/fonts/custom.woff2" as="font" type="font/woff2" crossorigin />
```

**효과**: 외부 리소스 로딩 시간 단축

---

## 📈 배포 후 모니터링

### 1. Google Search Console
- Core Web Vitals 모니터링
- 성능 리포트 확인
- 문제 알림 설정

### 2. Vercel Analytics
- 실제 사용자 성능 데이터
- 지역별 성능 분석
- 트렌드 모니터링

### 3. 정기적인 성능 검사
- 주 1회 Lighthouse 검사
- 월 1회 WebPageTest 검사
- 배포 후 성능 비교

---

## 🚀 배포 체크리스트

- [ ] Vite 설정 최적화 완료
- [ ] Vercel 캐싱 설정 완료
- [ ] 로컬 빌드 테스트 완료
- [ ] Lighthouse 점수 확인 (LCP < 1.2초)
- [ ] Google PageSpeed Insights 확인
- [ ] 배포 후 성능 모니터링 시작

---

## 💡 성능 최적화 팁

1. **정기적인 번들 분석**
   ```bash
   npm run build -- --analyze
   ```

2. **불필요한 의존성 제거**
   - 사용하지 않는 라이브러리 삭제
   - 더 가벼운 대체 라이브러리 찾기

3. **API 응답 최적화**
   - 필요한 데이터만 요청
   - 응답 압축 설정
   - 캐싱 전략 수립

4. **이미지 최적화**
   - 적절한 크기로 리사이징
   - WebP 형식 사용
   - Lazy loading 적용

5. **모니터링 자동화**
   - CI/CD에 성능 검사 통합
   - 성능 저하 시 알림 설정

---

**이 가이드를 따라 구현하면, muunsaju.com의 LCP가 1.2초 이내로 단축될 것입니다!** 🎉
