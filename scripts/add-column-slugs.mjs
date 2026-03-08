/**
 * columns 테이블에 SEO 친화적 slug 추가 스크립트
 * 
 * 실행: node scripts/add-column-slugs.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_KEY 환경변수가 필요합니다.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * 한글 제목을 SEO 친화적 영문 슬러그로 변환
 * 한글은 romanization 매핑 테이블 사용
 */
const koreanToRoman = {
  // 초성
  'ㄱ': 'g', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄹ': 'r', 'ㅁ': 'm',
  'ㅂ': 'b', 'ㅅ': 's', 'ㅇ': '', 'ㅈ': 'j', 'ㅊ': 'ch',
  'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h',
  'ㄲ': 'kk', 'ㄸ': 'tt', 'ㅃ': 'pp', 'ㅆ': 'ss', 'ㅉ': 'jj',
};

// 키워드 기반 슬러그 매핑 (한국어 제목 → 영문 슬러그)
const titleToSlugMap = {
  // 개운법 관련
  '청소': 'cleaning-luck',
  '방 청소': 'room-cleaning-luck',
  '습관': 'habits-luck',
  '마법의 습관': 'magic-habits-luck',
  // 재물운 관련
  '편재': 'pyeonjae-money',
  '정재': 'jeongjae-stable-money',
  '투자': 'investment-saju',
  '재물': 'wealth-luck',
  '돈': 'money-luck',
  // 관계 관련
  '궁합': 'compatibility',
  '비겁': 'bigyeop',
  '가족': 'family',
  '연애': 'love',
  '결혼': 'marriage',
  // 운의 흐름
  '대운': 'daeun-flow',
  '운의 흐름': 'fortune-flow',
  '운세': 'fortune',
  // 건강
  '건강': 'health',
  // 취업/커리어
  '취업': 'career',
  '직업': 'job',
};

/**
 * 제목에서 핵심 키워드를 추출하여 영문 슬러그 생성
 */
function generateSlugFromTitle(title, id, index) {
  // 특수문자 제거 및 공백 정규화
  const cleaned = title
    .replace(/['"''""「」『』【】〔〕]/g, '')
    .replace(/[!@#$%^&*()+=\[\]{}|\\<>?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // 핵심 키워드 추출 (앞 20자 기준)
  const shortTitle = cleaned.substring(0, 30);
  
  // 카테고리별 접두사 매핑
  const categoryPrefixes = {
    luck: 'luck',
    basic: 'basic',
    relationship: 'relation',
    health: 'health',
    money: 'money',
    flow: 'flow',
    career: 'career',
    love: 'love',
    family: 'family',
  };

  // UUID의 앞 8자리를 사용하여 고유성 보장
  const shortId = id.substring(0, 8);
  
  // 제목에서 주요 단어 추출 (한글 단어 기반 영문 슬러그)
  const keywordMappings = [
    // 개운법
    { ko: ['청소', '방 청소', '집 청소'], en: 'room-cleaning' },
    { ko: ['습관', '마법의 습관', '세 가지 습관'], en: 'magic-habits' },
    { ko: ['개운'], en: 'fortune-improvement' },
    // 재물운
    { ko: ['편재', '정재', '투자 손실', '투자'], en: 'investment-fortune' },
    { ko: ['재물운', '재물', '돈', '금전'], en: 'wealth-fortune' },
    { ko: ['주식', '코인', '부동산'], en: 'asset-investment' },
    // 관계/궁합
    { ko: ['비겁', '가족 갈등', '가족 간의'], en: 'family-conflict' },
    { ko: ['궁합', '연애 궁합'], en: 'compatibility' },
    { ko: ['연애', '이별', '짝사랑'], en: 'love-fortune' },
    { ko: ['결혼', '혼인'], en: 'marriage-fortune' },
    { ko: ['가족', '부모', '자녀'], en: 'family-fortune' },
    // 운의 흐름
    { ko: ['대운', '운의 흐름', '운세'], en: 'fortune-flow' },
    { ko: ['2026년', '병오년'], en: '2026-fortune' },
    { ko: ['하반기'], en: '2026-second-half' },
    { ko: ['신년', '새해'], en: 'new-year-fortune' },
    // 건강
    { ko: ['건강', '체질', '오행 건강'], en: 'health-fortune' },
    // 취업/커리어
    { ko: ['취업', '직업', '커리어', '직장'], en: 'career-fortune' },
    // 사주 기초
    { ko: ['일간', '천간', '지지', '오행', '십신'], en: 'saju-basics' },
    { ko: ['사주', '명리'], en: 'saju-guide' },
    // 심리/성격
    { ko: ['성격', '기질', '내향', '외향'], en: 'personality-saju' },
    // 운 관련 일반
    { ko: ['단비', '촉촉', '운의 비밀'], en: 'fortune-secret' },
    { ko: ['고속도로', '뻥 뚫'], en: 'fortune-breakthrough' },
  ];

  let matchedEn = null;
  for (const mapping of keywordMappings) {
    for (const koWord of mapping.ko) {
      if (title.includes(koWord)) {
        matchedEn = mapping.en;
        break;
      }
    }
    if (matchedEn) break;
  }

  if (matchedEn) {
    return `${matchedEn}-${shortId}`;
  }

  // 매핑이 없는 경우 column-{index}-{shortId} 형식 사용
  return `column-${String(index + 1).padStart(3, '0')}-${shortId}`;
}

async function main() {
  console.log('🚀 columns 테이블 slug 추가 시작...\n');

  // 1. 현재 columns 테이블 데이터 조회
  const { data: columns, error: fetchError } = await supabase
    .from('columns')
    .select('id, title, category, published_at')
    .order('published_at', { ascending: false, nullsFirst: false });

  if (fetchError) {
    console.error('❌ 데이터 조회 실패:', fetchError);
    process.exit(1);
  }

  console.log(`📊 총 ${columns.length}개 칼럼 발견\n`);

  // 2. 각 칼럼에 slug 생성
  const updates = columns.map((col, index) => {
    const slug = generateSlugFromTitle(col.title, col.id, index);
    return { id: col.id, slug, title: col.title };
  });

  // 슬러그 중복 확인 및 처리
  const slugCounts = {};
  updates.forEach(u => {
    slugCounts[u.slug] = (slugCounts[u.slug] || 0) + 1;
  });
  
  // 중복 슬러그 처리
  const slugUsed = {};
  updates.forEach(u => {
    if (slugCounts[u.slug] > 1) {
      const shortId = u.id.substring(0, 8);
      u.slug = `${u.slug}-${shortId}`;
    }
  });

  console.log('생성된 슬러그 목록:');
  updates.forEach(u => {
    console.log(`  ${u.slug}`);
    console.log(`    ← ${u.title.substring(0, 50)}`);
  });

  // 3. Supabase에 slug 업데이트
  console.log('\n📝 Supabase 업데이트 중...');
  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    const { error } = await supabase
      .from('columns')
      .update({ slug: update.slug })
      .eq('id', update.id);

    if (error) {
      console.error(`❌ 업데이트 실패 (${update.id}):`, error.message);
      errorCount++;
    } else {
      successCount++;
    }
  }

  console.log(`\n✅ 완료: ${successCount}개 성공, ${errorCount}개 실패`);
  
  // 4. 결과 확인
  const { data: verified } = await supabase
    .from('columns')
    .select('id, slug, title')
    .not('slug', 'is', null)
    .limit(5);
  
  console.log('\n검증 (slug가 있는 칼럼 샘플):');
  verified?.forEach(v => {
    console.log(`  /guide/${v.slug}`);
    console.log(`    ← ${v.title.substring(0, 50)}`);
  });
}

main().catch(console.error);
