# 마누스 개발자를 위한 SEO 최적화 즉시 실행 가이드

**대상**: 무운(muunsaju.com) 개발팀  
**작성일**: 2026년 2월 12일  
**우선순위**: 높음

---

## 📋 목차

1. [Sitemap 자동 갱신 로직](#1-sitemap-자동-갱신-로직)
2. [Canonical 태그 점검](#2-canonical-태그-점검)
3. [성능 최적화](#3-성능-최적화)
4. [구현 체크리스트](#4-구현-체크리스트)

---

## 1. Sitemap 자동 갱신 로직

### 1-1. 요구사항
- ✅ 새로운 사주 용어 추가 시 `/sitemap.xml` 자동 갱신
- ✅ Google Search Console에 Ping 자동 전송
- ✅ 빌드 시 또는 런타임에 동적 생성

### 1-2. 구현 방식 선택

#### 방식 A: 빌드 타임 생성 (권장)
**장점**: 성능 최적화, 캐싱 가능  
**단점**: 새 용어 추가 시 재배포 필요

#### 방식 B: 런타임 동적 생성
**장점**: 즉시 반영  
**단점**: 매 요청마다 생성 (성능 저하)

#### 방식 C: 하이브리드 (최적)
**장점**: 빌드 시 생성 + 새 용어 추가 시 재생성  
**단점**: 구현 복잡도 증가

### 1-3. 구현 코드 (Node.js)

#### 파일: `scripts/generate-sitemap.mjs`

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// fortune-dictionary.ts에서 데이터 import
import { fortuneDictionary } from '../client/src/lib/fortune-dictionary.ts';

// Sitemap 생성 함수
function generateSitemap() {
  const baseUrl = 'https://muunsaju.com';
  
  // XML 헤더
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // 정적 페이지
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/fortune-dictionary', priority: 0.9, changefreq: 'weekly' },
    { url: '/yearly-fortune', priority: 0.8, changefreq: 'monthly' },
    { url: '/lifetime-saju', priority: 0.8, changefreq: 'monthly' },
    { url: '/compatibility', priority: 0.8, changefreq: 'monthly' },
  ];

  staticPages.forEach(page => {
    xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Dictionary 동적 페이지
  fortuneDictionary.forEach(entry => {
    xml += `  <url>
    <loc>${baseUrl}/dictionary/${entry.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>
`;
  });

  xml += `</urlset>`;

  // 파일 저장
  const sitemapPath = path.join(__dirname, '../client/public/sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  
  console.log(`✅ Sitemap generated: ${fortuneDictionary.length} dictionary items`);
}

// Google Search Console Ping 함수
async function pingGoogle() {
  const sitemapUrl = 'https://muunsaju.com/sitemap.xml';
  const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

  try {
    const response = await fetch(pingUrl);
    if (response.ok) {
      console.log('✅ Google Ping sent successfully');
    } else {
      console.warn('⚠️ Google Ping failed:', response.status);
    }
  } catch (error) {
    console.error('❌ Google Ping error:', error.message);
  }
}

// 실행
async function main() {
  generateSitemap();
  await pingGoogle();
}

main();
```

### 1-4. package.json 스크립트 추가

```json
{
  "scripts": {
    "generate-sitemap": "node scripts/generate-sitemap.mjs",
    "build": "pnpm generate-sitemap && vite build",
    "postbuild": "pnpm generate-sitemap && pnpm ping-google"
  }
}
```

### 1-5. 자동화 설정

#### GitHub Actions (CI/CD)

파일: `.github/workflows/update-sitemap.yml`

```yaml
name: Update Sitemap

on:
  push:
    paths:
      - 'client/src/lib/fortune-dictionary.ts'
    branches:
      - main

jobs:
  update-sitemap:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Generate Sitemap
        run: pnpm generate-sitemap
      
      - name: Commit and push
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add client/public/sitemap.xml
          git commit -m "chore: update sitemap [skip ci]"
          git push
```

### 1-6. 테스트 방법

```bash
# 로컬에서 Sitemap 생성
pnpm generate-sitemap

# 생성된 파일 확인
cat client/public/sitemap.xml

# 항목 개수 확인
grep -c "<loc>" client/public/sitemap.xml
# 출력: 49개 (또는 최신 개수)
```

---

## 2. Canonical 태그 점검

### 2-1. 현재 상태 확인

#### DictionaryDetail.tsx에서 확인

```typescript
// 라인 36: Canonical 태그
<link 
  rel="canonical" 
  href={`https://muunsaju.com/dictionary/${entry.slug}`}
/>
```

**상태**: ✅ 이미 구현됨

### 2-2. 자기 참조 캐노니컬 검증

#### 확인 항목

| 페이지 | Canonical URL | 상태 |
|--------|---------------|------|
| `/dictionary/dohwa-sal` | `https://muunsaju.com/dictionary/dohwa-sal` | ✅ 자기 참조 |
| `/dictionary/gab-mok` | `https://muunsaju.com/dictionary/gab-mok` | ✅ 자기 참조 |

### 2-3. 다른 페이지에 Canonical 추가 (필요한 경우)

#### YearlyFortune.tsx 예시

```typescript
// 라인 상단에 추가
useEffect(() => {
  // Canonical 태그 설정
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.href = 'https://muunsaju.com/yearly-fortune';
  } else {
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = 'https://muunsaju.com/yearly-fortune';
    document.head.appendChild(link);
  }
}, []);
```

#### LifelongSaju.tsx 예시

```typescript
useEffect(() => {
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.href = 'https://muunsaju.com/lifetime-saju';
  } else {
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = 'https://muunsaju.com/lifetime-saju';
    document.head.appendChild(link);
  }
}, []);
```

### 2-4. Canonical 검증 스크립트

파일: `scripts/verify-canonical.mjs`

```javascript
import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'client/src/pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

console.log('🔍 Canonical Tag Verification\n');

let missingCanonical = [];

pages.forEach(page => {
  const content = fs.readFileSync(path.join(pagesDir, page), 'utf-8');
  const hasCanonical = content.includes('rel="canonical"');
  
  const status = hasCanonical ? '✅' : '❌';
  console.log(`${status} ${page}`);
  
  if (!hasCanonical) {
    missingCanonical.push(page);
  }
});

if (missingCanonical.length > 0) {
  console.log(`\n⚠️ Missing Canonical: ${missingCanonical.join(', ')}`);
} else {
  console.log('\n✅ All pages have Canonical tags');
}
```

실행:
```bash
pnpm node scripts/verify-canonical.mjs
```

---

## 3. 성능 최적화

### 3-1. LCP (Largest Contentful Paint) 1.2초 이내 목표

#### 현재 성능 측정

```bash
# Lighthouse CLI 설치
npm install -g @lhci/cli@latest

# 성능 측정
lhci autorun --config=lighthouserc.json
```

#### lighthouserc.json 설정

```json
{
  "ci": {
    "collect": {
      "url": ["https://muunsaju.com/dictionary/dohwa-sal"],
      "numberOfRuns": 3,
      "settings": {
        "configPath": "./lighthouserc-config.json"
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### 3-2. WebP 이미지 최적화

#### 이미지 변환 스크립트

파일: `scripts/optimize-images.mjs`

```javascript
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imageDir = path.join(process.cwd(), 'client/public/images');
const outputDir = path.join(process.cwd(), 'client/public/images/webp');

// 출력 디렉토리 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 이미지 파일 처리
const files = fs.readdirSync(imageDir).filter(f => 
  /\.(jpg|jpeg|png)$/i.test(f)
);

files.forEach(async (file) => {
  const inputPath = path.join(imageDir, file);
  const outputPath = path.join(outputDir, `${path.parse(file).name}.webp`);
  
  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    console.log(`✅ Converted: ${file} → ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error converting ${file}:`, error.message);
  }
});
```

package.json에 추가:
```json
{
  "scripts": {
    "optimize-images": "node scripts/optimize-images.mjs"
  }
}
```

#### React 컴포넌트에서 WebP 사용

```tsx
// 예: DictionaryDetail.tsx
export default function DictionaryDetail() {
  return (
    <div>
      <picture>
        <source 
          srcSet="/images/webp/dohwa-sal.webp" 
          type="image/webp" 
        />
        <source 
          srcSet="/images/dohwa-sal.jpg" 
          type="image/jpeg" 
        />
        <img 
          src="/images/dohwa-sal.jpg" 
          alt="도화살" 
          loading="lazy"
          width={800}
          height={600}
        />
      </picture>
    </div>
  );
}
```

### 3-3. 코드 압축 및 최적화

#### Vite 설정 (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotli',
      ext: '.br',
    }),
  ],
  build: {
    // 코드 분할 최적화
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-select'],
        },
      },
    },
    // 최소화 설정
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

### 3-4. 동적 임포트 (Code Splitting)

#### 예: DictionaryDetail.tsx

```typescript
import { lazy, Suspense } from 'react';

// 동적 임포트로 번들 크기 감소
const RelatedTermsSection = lazy(() => 
  import('@/components/RelatedTermsSection')
);

export default function DictionaryDetail() {
  return (
    <div>
      {/* ... */}
      <Suspense fallback={<div>로딩 중...</div>}>
        <RelatedTermsSection currentTermId={entry.id} />
      </Suspense>
    </div>
  );
}
```

### 3-5. 성능 모니터링

#### Web Vitals 추적

파일: `client/src/lib/web-vitals.ts`

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
}
```

#### main.tsx에서 사용

```typescript
import { reportWebVitals } from './lib/web-vitals';

reportWebVitals((metric) => {
  console.log('Web Vitals:', metric);
  
  // Google Analytics로 전송 (선택사항)
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'web_vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
});
```

### 3-6. 캐싱 전략

#### Cache-Control 헤더 설정 (Vercel)

파일: `vercel.json`

```json
{
  "headers": [
    {
      "source": "/dictionary/:slug",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, stale-while-revalidate=86400"
        }
      ]
    },
    {
      "source": "/images/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/:path*.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 4. 구현 체크리스트

### Phase 1: Sitemap 자동 갱신

- [ ] `scripts/generate-sitemap.mjs` 파일 생성
- [ ] `scripts/generate-sitemap.mjs`에서 fortune-dictionary.ts import
- [ ] Sitemap 생성 함수 구현
- [ ] Google Ping 함수 구현
- [ ] package.json에 `generate-sitemap` 스크립트 추가
- [ ] `build` 스크립트에 `generate-sitemap` 추가
- [ ] GitHub Actions 워크플로우 생성 (선택사항)
- [ ] 로컬에서 테스트: `pnpm generate-sitemap`
- [ ] 생성된 sitemap.xml 확인
- [ ] 배포 후 Google Search Console에서 확인

### Phase 2: Canonical 태그 점검

- [ ] DictionaryDetail.tsx에서 Canonical 태그 확인 (이미 구현됨)
- [ ] 다른 주요 페이지에 Canonical 추가:
  - [ ] YearlyFortune.tsx
  - [ ] LifelongSaju.tsx
  - [ ] Compatibility.tsx
  - [ ] Home.tsx
- [ ] `scripts/verify-canonical.mjs` 생성
- [ ] 모든 페이지에서 Canonical 검증: `pnpm node scripts/verify-canonical.mjs`
- [ ] 배포 후 브라우저에서 페이지 소스 확인

### Phase 3: 성능 최적화

- [ ] Lighthouse CLI 설치
- [ ] 현재 성능 측정 (LCP, FID, CLS 등)
- [ ] `scripts/optimize-images.mjs` 생성
- [ ] 이미지 WebP 변환: `pnpm optimize-images`
- [ ] React 컴포넌트에서 `<picture>` 태그 사용
- [ ] Vite 설정에서 코드 분할 최적화
- [ ] 동적 임포트 (lazy loading) 적용
- [ ] vercel.json에서 Cache-Control 헤더 설정
- [ ] Web Vitals 추적 코드 추가
- [ ] 배포 후 성능 재측정
- [ ] LCP 1.2초 이내 달성 확인

### Phase 4: 배포 및 모니터링

- [ ] 모든 코드 변경사항 커밋
- [ ] GitHub에 푸시
- [ ] Vercel 자동 배포 확인
- [ ] Google Search Console에서 Sitemap 제출 확인
- [ ] 1주일 후 색인화 진행 상황 확인
- [ ] 2주일 후 검색 결과 표시 확인
- [ ] 1개월 후 트래픽 증가 효과 측정

---

## 📊 예상 효과

### Sitemap 자동 갱신
- ✅ 새 용어 추가 시 즉시 Google에 알림
- ✅ 색인화 시간 단축 (기존 1-2주 → 2-3일)
- ✅ 수동 작업 제거

### Canonical 태그
- ✅ 중복 콘텐츠 문제 해결
- ✅ 검색 순위 집중화
- ✅ 크롤링 효율 증가

### 성능 최적화
- ✅ LCP 1.2초 이내 달성
- ✅ 사용자 경험 개선
- ✅ 검색 순위 상승 (Core Web Vitals 신호)
- ✅ 이탈률 감소

---

## 🚀 우선순위

### 즉시 (1-2일)
1. Sitemap 자동 갱신 로직 구현
2. Canonical 태그 점검 및 추가

### 단기 (1주)
3. 성능 최적화 (WebP, 코드 분할)

### 중기 (2-4주)
4. 모니터링 및 효과 측정

---

## 📞 문제 해결

### 문제 1: Sitemap 생성 시 fortune-dictionary import 오류

**해결**:
```javascript
// TypeScript 파일을 JavaScript로 변환하거나
// 또는 CommonJS로 export
export const fortuneDictionary = [...];
```

### 문제 2: Google Ping이 작동하지 않음

**해결**:
```javascript
// Fetch API 대신 axios 사용
import axios from 'axios';

const response = await axios.get(pingUrl);
```

### 문제 3: WebP 변환 시 sharp 오류

**해결**:
```bash
# sharp 재설치
npm rebuild sharp
```

---

## 📚 참고 자료

- [Google Sitemap 공식 문서](https://www.sitemaps.org/)
- [Canonical URL 가이드](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Web Vitals](https://web.dev/vitals/)
- [Vite 최적화 가이드](https://vitejs.dev/guide/build.html)

---

**이 가이드를 따라 구현하면, muunsaju.com의 SEO 성능이 크게 향상될 것입니다!** 🚀
