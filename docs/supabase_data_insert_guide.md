# Supabase 꿈해몽 데이터 입력 가이드 (인수인계 문서)

본 문서는 `muunsaju.com`의 꿈해몽 데이터를 Supabase 데이터베이스에 추가하는 방법에 대한 가이드입니다. 향후 새로운 꿈해몽 데이터를 대량으로 추가하거나 관리할 때 참고하시기 바랍니다.

## 1. 데이터베이스 스키마 구조

Supabase의 `dreams` 테이블은 다음과 같은 컬럼 구조를 가지고 있습니다. 데이터를 입력할 때 이 구조에 맞게 JSON 객체를 구성해야 합니다.

| 컬럼명 | 데이터 타입 | 설명 | 필수 여부 |
|---|---|---|---|
| `keyword` | text | 꿈해몽 제목 (예: "큰 뱀이 집안으로 들어오는 꿈") | 필수 |
| `slug` | text | URL에 사용될 영문 슬러그 (예: "big-snake-entering-house-dream") | 필수 |
| `interpretation` | text | 꿈에 대한 전반적인 해석 | 필수 |
| `traditional_meaning` | text | 전통적/역학적 의미 | 필수 |
| `psychological_meaning` | text | 심리학적 의미 | 필수 |
| `category` | text | 카테고리 ('동물', '자연', '사람', '사물', '행동', '감정', '장소', '기타' 중 택 1) | 필수 |
| `grade` | text | 길흉 등급 ('길몽', '보통', '흉몽' 중 택 1) | 필수 |
| `score` | integer | 점수 (0~100) | 필수 |
| `guidelines` | text | 오늘의 행동 지침 가이드 | 필수 |
| `situations` | jsonb | 상황별 해석 배열 (`[{question: "질문", answer: "답변"}]` 형태) | 필수 |
| `lucky_items` | jsonb | 행운의 아이템 (`{numbers: ["1", "2"], colors: ["레드", "블루"]}` 형태) | 필수 |
| `seo_data` | jsonb | SEO 메타 데이터 (`{meta_title: "제목", meta_description: "설명"}` 형태) | 필수 |
| `published` | boolean | 발행 여부 (`true` 또는 `false`) | 필수 |
| `published_at` | timestamp | 발행 일시 (ISO 8601 포맷, 예: `new Date().toISOString()`) | 필수 |

## 2. 데이터 입력 스크립트 사용법

대량의 데이터를 입력할 때는 Node.js 스크립트를 사용하는 것이 가장 효율적입니다. 프로젝트 내에 작성된 `scripts/insert-dreams.mjs` 파일을 활용하여 데이터를 삽입할 수 있습니다.

### 2.1. 스크립트 준비

`scripts/insert-dreams.mjs` 파일을 열고 `dreams` 배열 안에 추가할 데이터 객체들을 넣습니다.

```javascript
// scripts/insert-dreams.mjs 예시
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://[프로젝트ID].supabase.co';
const SUPABASE_ANON_KEY = '[Anon Key]';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const dreams = [
  {
    keyword: '새로운 꿈 제목',
    slug: 'new-dream-slug',
    interpretation: '해석 내용...',
    traditional_meaning: '전통적 의미...',
    psychological_meaning: '심리학적 의미...',
    category: '동물',
    grade: '길몽',
    score: 90,
    situations: [
      { question: '상황 1?', answer: '해석 1' },
      { question: '상황 2?', answer: '해석 2' }
    ],
    guidelines: '행동 지침...',
    lucky_items: { numbers: ['1', '7'], colors: ['레드'] },
    seo_data: { meta_title: '메타 제목', meta_description: '메타 설명' },
    published: true,
    published_at: new Date().toISOString(),
  }
  // 추가할 데이터 객체들을 계속 나열...
];

async function insertDreams() {
  for (const dream of dreams) {
    const { data, error } = await supabase.from('dreams').insert(dream);
    if (error) console.error(`실패: ${dream.keyword}`, error);
    else console.log(`성공: ${dream.keyword}`);
  }
}

insertDreams();
```

### 2.2. 스크립트 실행

터미널(명령 프롬프트)을 열고 프로젝트 루트 디렉토리로 이동한 후 아래 명령어를 실행합니다.

```bash
node scripts/insert-dreams.mjs
```

실행 결과로 각 데이터의 성공/실패 여부가 출력됩니다.

## 3. 데이터 입력 후 필수 작업 (사이트맵 갱신)

데이터베이스에 새로운 꿈해몽 데이터가 추가되었다면, 구글 등 검색 엔진이 새로운 페이지를 크롤링할 수 있도록 **반드시 사이트맵을 재생성하고 배포**해야 합니다.

### 3.1. 사이트맵 재생성

프로젝트 루트 디렉토리에서 다음 명령어를 실행하여 사이트맵을 재생성합니다. 이 스크립트는 Supabase DB에서 최신 슬러그(slug) 목록을 가져와 `sitemap.xml` 파일을 업데이트합니다.

```bash
node scripts/generate-sitemap.mjs
```

### 3.2. 변경사항 배포 (Vercel)

사이트맵 파일(`client/public/sitemap.xml` 등)이 갱신되었으므로, 이를 GitHub에 푸시하여 Vercel 자동 배포를 트리거해야 합니다.

```bash
git add .
git commit -m "chore: 꿈해몽 새 데이터 추가 및 사이트맵 갱신"
git push origin main
```

Vercel 배포가 완료되면 `https://muunsaju.com/sitemap.xml`에 접속하여 새로 추가된 URL들이 정상적으로 반영되었는지 확인합니다.

## 4. 주의사항

- **Slug 중복 주의**: `slug` 값은 URL 경로로 사용되므로 영문 소문자와 하이픈(-)만 사용해야 하며, 기존 데이터와 중복되지 않도록 고유하게 작성해야 합니다.
- **JSON 포맷**: `situations`, `lucky_items`, `seo_data` 컬럼은 JSON 객체 형태이므로 괄호나 따옴표 등 문법 오류가 없도록 주의해야 합니다.
- **카테고리 및 등급**: `category`와 `grade`는 정해진 한글 텍스트 값만 사용해야 프론트엔드에서 정상적으로 필터링 및 렌더링됩니다.
