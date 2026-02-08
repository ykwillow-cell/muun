// 만세력 계산 엔진

import { SOLAR_TERMS_BY_YEAR } from './solar-terms-data';

// 천간
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export type HeavenlyStem = typeof HEAVENLY_STEMS[number];

// 지지
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
export type EarthlyBranch = typeof EARTHLY_BRANCHES[number];

// 오행
export const FIVE_ELEMENTS = {
  WOOD: '木',
  FIRE: '火',
  EARTH: '土',
  METAL: '金',
  WATER: '水',
} as const;
export type FiveElement = typeof FIVE_ELEMENTS[keyof typeof FIVE_ELEMENTS];

// 천간 오행 매핑
export const STEM_ELEMENTS: Record<HeavenlyStem, FiveElement> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

// 지지 오행 매핑
export const BRANCH_ELEMENTS: Record<EarthlyBranch, FiveElement> = {
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '辰': '土', '戌': '土', '丑': '土', '未': '土',
  '申': '金', '酉': '金',
  '亥': '水', '子': '水',
};

// 십신 (Ten Gods)
export type TenGod = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편관' | '정관' | '편인' | '정인';

// 오행 상생상극 관계
// 생: 목->화->토->금->수->목
// 극: 목->토->수->화->금->목
const ELEMENT_RELATIONS: Record<FiveElement, { generates: FiveElement, overcomes: FiveElement }> = {
  '木': { generates: '火', overcomes: '土' },
  '火': { generates: '土', overcomes: '金' },
  '土': { generates: '金', overcomes: '水' },
  '金': { generates: '水', overcomes: '木' },
  '水': { generates: '木', overcomes: '火' },
};

// 음양 (True: 양, False: 음)
export const STEM_YIN_YANG: Record<HeavenlyStem, boolean> = {
  '甲': true, '乙': false,
  '丙': true, '丁': false,
  '戊': true, '己': false,
  '庚': true, '辛': false,
  '壬': true, '癸': false,
};

export const BRANCH_YIN_YANG: Record<EarthlyBranch, boolean> = {
  '子': true, '丑': false, '寅': true, '卯': false,
  '辰': true, '巳': false, '午': true, '未': false,
  '申': true, '酉': false, '戌': true, '亥': false,
};

// 24절기 (양력 기준 대략적인 날짜, 실제로는 매년 달라짐 - 여기서는 간소화된 로직 사용)
// 정확한 만세력을 위해서는 1900~2100년 절기 데이터베이스가 필요함
// 이 구현에서는 알고리즘적 근사치를 사용하거나 외부 라이브러리 의존성을 최소화하기 위해
// 간단한 절기 계산 로직을 사용합니다. (실제 서비스에서는 정밀 데이터 필요)

export interface SajuPillar {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  stemElement: FiveElement;
  branchElement: FiveElement;
  tenGod?: TenGod; // 일간 기준 십신
}

export interface SajuResult {
  yearPillar: SajuPillar;
  monthPillar: SajuPillar;
  dayPillar: SajuPillar;
  hourPillar: SajuPillar;
  birthDate: Date;
  gender: 'male' | 'female';
}

// 1900년 1월 1일 기준 데이터 (갑진일)
const BASE_DATE = new Date(1900, 0, 1); // 1900-01-01
const BASE_YEAR_STEM_INDEX = 6; // 1900년은 경자년 (庚: 6)
const BASE_YEAR_BRANCH_INDEX = 0; // 1900년은 경자년 (子: 0)

// 절기 데이터 (월주 계산용, 양력 기준)
// 연도별 정확한 절기 데이터를 사용 (solar-terms-data.ts)
// 배열 순서: 입춘, 경칩, 청명, 입하, 망종, 소서, 입추, 백로, 한로, 입동, 대설, 소한
// 데이터 범위 밖의 연도를 위한 기본값
const DEFAULT_SOLAR_TERMS = [
  { month: 2, day: 4 },  // 입춘 (2월) -> 인월
  { month: 3, day: 6 },  // 경칩 (3월) -> 묘월
  { month: 4, day: 5 },  // 청명 (4월) -> 진월
  { month: 5, day: 6 },  // 입하 (5월) -> 사월
  { month: 6, day: 6 },  // 망종 (6월) -> 오월
  { month: 7, day: 7 },  // 소서 (7월) -> 미월
  { month: 8, day: 8 },  // 입추 (8월) -> 신월
  { month: 9, day: 8 },  // 백로 (9월) -> 유월
  { month: 10, day: 8 }, // 한로 (10월) -> 술월
  { month: 11, day: 7 }, // 입동 (11월) -> 해월
  { month: 12, day: 7 }, // 대설 (12월) -> 자월
  { month: 1, day: 6 },  // 소한 (1월) -> 축월
];

// 연도별 절기 데이터 가져오기
function getSolarTerms(year: number): Array<{month: number, day: number}> {
  return SOLAR_TERMS_BY_YEAR[year] || DEFAULT_SOLAR_TERMS;
}

// 연주 계산
function getYearPillar(date: Date): { stem: HeavenlyStem, branch: EarthlyBranch } {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 입춘 기준으로 연도가 바뀜 (연도별 정확한 입춘 날짜 사용)
  const solarTerms = getSolarTerms(year);
  const ipchunDay = solarTerms[0].day; // 입춘은 배열의 첫 번째
  const isBeforeIpchun = (month < 2) || (month === 2 && day < ipchunDay);
  const targetYear = isBeforeIpchun ? year - 1 : year;

  const stemIndex = (targetYear - 3 - 1 + 10) % 10; // 1984년 갑자년 기준 (4) -> 1984-3=1981, 1%10=1 (갑)??
  // 공식: (연도 - 3) % 10 -> 천간 인덱스 (0:계, 1:갑...) - 수정 필요
  // 갑(0), 을(1)...
  // 1984년 갑자년. (1984-4)%10 = 0 (갑)
  const stemIdx = (targetYear - 4) % 10;
  const finalStemIdx = stemIdx < 0 ? stemIdx + 10 : stemIdx;
  
  // 지지: (연도 - 4) % 12
  const branchIdx = (targetYear - 4) % 12;
  const finalBranchIdx = branchIdx < 0 ? branchIdx + 12 : branchIdx;

  return {
    stem: HEAVENLY_STEMS[finalStemIdx],
    branch: EARTHLY_BRANCHES[finalBranchIdx]
  };
}

// 월주 계산 (둔간법)
function getMonthPillar(date: Date, yearStem: HeavenlyStem): { stem: HeavenlyStem, branch: EarthlyBranch } {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 연도별 정확한 절기 데이터 사용
  // 소한(11번 인덱스)은 다음 해 1월이므로, 1월인 경우 전년도 데이터의 소한을 참조
  const solarTerms = getSolarTerms(year);
  // 전년도 소한 데이터 (1월에 필요)
  const prevYearTerms = getSolarTerms(year - 1);
  
  // 절기 기준으로 월 결정
  // 배열 순서: 0:입춘(2월), 1:경칩(3월), ..., 10:대설(12월), 11:소한(1월)
  
  let termIndex = -1;
  
  if (month === 1) {
    // 1월: 소한 전이면 자월(대설 이후), 소한 이후면 축월
    const sohanDay = prevYearTerms[11].day; // 전년도 소한 = 올해 1월
    if (day >= sohanDay) {
      termIndex = 11; // 축월
    } else {
      termIndex = 10; // 자월 (전년도 대설 이후)
    }
  } else {
    // 2~12월: 해당 월의 절기를 찾아서 비교
    for (let i = 0; i < 12; i++) {
      const term = solarTerms[i];
      if (month === term.month) {
        if (day >= term.day) {
          termIndex = i;
        } else {
          termIndex = (i - 1 + 12) % 12;
        }
        break;
      }
    }
  }
  
  // 월지 결정 (인월부터 시작)
  // termIndex 0(입춘) -> 인(2)
  // termIndex 1(경칩) -> 묘(3)
  // ...
  // termIndex 10(대설) -> 자(0)
  // termIndex 11(소한) -> 축(1)
  
  const branchIndices = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1]; // 인, 묘, 진 ... 자, 축
  const branchIndex = branchIndices[termIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];
  
  // 월간 결정 (연간에 의존 - 둔간법)
  // 갑기년 -> 병인두 (병화부터 시작)
  // 을경년 -> 무인두
  // 병신년 -> 경인두
  // 정임년 -> 임인두
  // 무계년 -> 갑인두
  
  const yearStemIdx = HEAVENLY_STEMS.indexOf(yearStem);
  const startStemIndices = [2, 4, 6, 8, 0]; // 병, 무, 경, 임, 갑
  const startStemIdx = startStemIndices[yearStemIdx % 5];
  
  // 인월이 0번째이므로 termIndex를 그대로 더함
  const stemIndex = (startStemIdx + termIndex) % 10;
  const stem = HEAVENLY_STEMS[stemIndex];
  
  return { stem, branch };
}

// 일주 계산
function getDayPillar(date: Date): { stem: HeavenlyStem, branch: EarthlyBranch } {
  // 1900년 1월 1일은 갑술일(10)이 아니라... 실제 데이터 확인 필요
  // 여기서는 간단하게 1900-01-01을 기준으로 계산 (실제로는 윤년 등 고려 필요)
  // 정확성을 위해 기준일을 2000-01-01 (무오일)로 설정
  
  const base = new Date(2000, 0, 1); // 2000-01-01
  // 2000년 1월 1일은 무오일 (천간: 무(4), 지지: 오(6))
  const baseStemIdx = 4;
  const baseBranchIdx = 6;
  
  const diffTime = date.getTime() - base.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  let stemIdx = (baseStemIdx + diffDays) % 10;
  let branchIdx = (baseBranchIdx + diffDays) % 12;
  
  if (stemIdx < 0) stemIdx += 10;
  if (branchIdx < 0) branchIdx += 12;
  
  return {
    stem: HEAVENLY_STEMS[stemIdx],
    branch: EARTHLY_BRANCHES[branchIdx]
  };
}

// 시주 계산
function getHourPillar(date: Date, dayStem: HeavenlyStem): { stem: HeavenlyStem, branch: EarthlyBranch } {
  const hour = date.getHours();
  const minute = date.getMinutes();
  
  // 한국 표준시 보정 (동경 135도 기준 -> 127.5도 실제 경도)
  // 약 30분 차이. 
  // 자시: 23:30 ~ 01:30
  // 축시: 01:30 ~ 03:30
  // ...
  
  // 시간을 분으로 환산
  let totalMinutes = hour * 60 + minute;
  
  // 30분을 뺌 (보정) -> 이렇게 하면 23:30이 23:00이 되어 자시 시작점이 됨
  // 아니면 그냥 범위로 계산
  
  // 자시 (23:30 ~ 01:29) -> 0
  // 축시 (01:30 ~ 03:29) -> 1
  
  let branchIdx = 0;
  
  if (totalMinutes >= 23 * 60 + 30 || totalMinutes < 1 * 60 + 30) branchIdx = 0; // 자
  else if (totalMinutes < 3 * 60 + 30) branchIdx = 1; // 축
  else if (totalMinutes < 5 * 60 + 30) branchIdx = 2; // 인
  else if (totalMinutes < 7 * 60 + 30) branchIdx = 3; // 묘
  else if (totalMinutes < 9 * 60 + 30) branchIdx = 4; // 진
  else if (totalMinutes < 11 * 60 + 30) branchIdx = 5; // 사
  else if (totalMinutes < 13 * 60 + 30) branchIdx = 6; // 오
  else if (totalMinutes < 15 * 60 + 30) branchIdx = 7; // 미
  else if (totalMinutes < 17 * 60 + 30) branchIdx = 8; // 신
  else if (totalMinutes < 19 * 60 + 30) branchIdx = 9; // 유
  else if (totalMinutes < 21 * 60 + 30) branchIdx = 10; // 술
  else branchIdx = 11; // 해
  
  const branch = EARTHLY_BRANCHES[branchIdx];
  
  // 시간 결정 (일간에 의존 - 둔간법)
  // 갑기일 -> 갑자시
  // 을경일 -> 병자시
  // 병신일 -> 무자시
  // 정임일 -> 경자시
  // 무계일 -> 임자시
  
  const dayStemIdx = HEAVENLY_STEMS.indexOf(dayStem);
  const startStemIndices = [0, 2, 4, 6, 8]; // 갑, 병, 무, 경, 임
  const startStemIdx = startStemIndices[dayStemIdx % 5];
  
  const stemIndex = (startStemIdx + branchIdx) % 10;
  const stem = HEAVENLY_STEMS[stemIndex];
  
  return { stem, branch };
}

// 십신 계산
function calculateTenGod(targetStem: HeavenlyStem, dayStem: HeavenlyStem): TenGod {
  const targetElement = STEM_ELEMENTS[targetStem];
  const dayElement = STEM_ELEMENTS[dayStem];
  
  const targetYinYang = STEM_YIN_YANG[targetStem];
  const dayYinYang = STEM_YIN_YANG[dayStem];
  
  const isSameYinYang = targetYinYang === dayYinYang;
  
  if (targetElement === dayElement) {
    return isSameYinYang ? '비견' : '겁재';
  }
  
  const relation = ELEMENT_RELATIONS[dayElement];
  
  if (relation.generates === targetElement) {
    return isSameYinYang ? '식신' : '상관';
  }
  
  if (relation.overcomes === targetElement) {
    return isSameYinYang ? '편재' : '정재';
  }
  
  const targetRelation = ELEMENT_RELATIONS[targetElement];
  
  if (targetRelation.overcomes === dayElement) {
    return isSameYinYang ? '편관' : '정관';
  }
  
  if (targetRelation.generates === dayElement) {
    return isSameYinYang ? '편인' : '정인';
  }
  
  return '비견'; // Fallback
}

// 메인 계산 함수
// 오행별 행운 데이터 매핑
export const ELEMENT_LUCKY_DATA: Record<FiveElement, {
  colors: string[];
  numbers: number[];
  foods: string[];
  directions: string[];
  activities: string[];
  avoid: string[];
}> = {
  '木': {
    colors: ['초록색', '청색'],
    numbers: [3, 8],
    foods: ['신맛 나는 과일', '채소', '곡물'],
    directions: ['동쪽'],
    activities: ['산책', '독서', '새로운 계획 세우기'],
    avoid: ['지나친 음주', '충동적인 결정']
  },
  '火': {
    colors: ['빨간색', '주황색'],
    numbers: [2, 7],
    foods: ['쓴맛 나는 채소', '커피', '구운 요리'],
    directions: ['남쪽'],
    activities: ['운동', '사교 모임', '발표'],
    avoid: ['조급함', '다툼']
  },
  '土': {
    colors: ['노란색', '브라운'],
    numbers: [5, 0],
    foods: ['단맛 나는 단호박', '고구마', '뿌리 채소'],
    directions: ['중앙'],
    activities: ['명상', '부동산 관련 공부', '정리정돈'],
    avoid: ['게으름', '고집']
  },
  '金': {
    colors: ['흰색', '금색', '은색'],
    numbers: [4, 9],
    foods: ['매운맛 나는 음식', '무', '생강'],
    directions: ['서쪽'],
    activities: ['정리', '결단 내리기', '금속 공예'],
    avoid: ['냉소적인 태도', '슬픔']
  },
  '水': {
    colors: ['검은색', '회색'],
    numbers: [1, 6],
    foods: ['짠맛 나는 해조류', '검은콩', '물'],
    directions: ['북쪽'],
    activities: ['휴식', '지식 탐구', '목욕'],
    avoid: ['두려움', '밤샘']
  }
};

export function calculateSaju(birthDate: Date, gender: 'male' | 'female'): SajuResult {
  const yearPillarRaw = getYearPillar(birthDate);
  const monthPillarRaw = getMonthPillar(birthDate, yearPillarRaw.stem);
  const dayPillarRaw = getDayPillar(birthDate);
  const hourPillarRaw = getHourPillar(birthDate, dayPillarRaw.stem);
  
  const dayStem = dayPillarRaw.stem;
  
  const yearPillar: SajuPillar = {
    ...yearPillarRaw,
    stemElement: STEM_ELEMENTS[yearPillarRaw.stem],
    branchElement: BRANCH_ELEMENTS[yearPillarRaw.branch],
    tenGod: calculateTenGod(yearPillarRaw.stem, dayStem)
  };
  
  const monthPillar: SajuPillar = {
    ...monthPillarRaw,
    stemElement: STEM_ELEMENTS[monthPillarRaw.stem],
    branchElement: BRANCH_ELEMENTS[monthPillarRaw.branch],
    tenGod: calculateTenGod(monthPillarRaw.stem, dayStem)
  };
  
  const dayPillar: SajuPillar = {
    ...dayPillarRaw,
    stemElement: STEM_ELEMENTS[dayPillarRaw.stem],
    branchElement: BRANCH_ELEMENTS[dayPillarRaw.branch],
    tenGod: '비견' // 일간은 자기 자신이므로 비견
  };
  
  const hourPillar: SajuPillar = {
    ...hourPillarRaw,
    stemElement: STEM_ELEMENTS[hourPillarRaw.stem],
    branchElement: BRANCH_ELEMENTS[hourPillarRaw.branch],
    tenGod: calculateTenGod(hourPillarRaw.stem, dayStem)
  };
  
  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    birthDate,
    gender
  };
}

// 오행 분포 계산 함수
export function calculateElementBalance(saju: SajuResult) {
  const elements: Record<FiveElement, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  const pillars = [saju.yearPillar, saju.monthPillar, saju.dayPillar, saju.hourPillar];
  
  pillars.forEach(p => {
    elements[p.stemElement] += 1;
    elements[p.branchElement] += 1;
  });
  
  return Object.entries(elements).map(([name, value]) => ({
    name,
    value,
    fullMark: 8
  }));
}

// 운세 점수 및 조합형 문장 생성 엔진
// 단순한 해시 함수로 사주 결과에 따른 고정된 난수 생성
function getDeterministicSeed(saju: SajuResult): number {
  const sajuStr = JSON.stringify([
    saju.yearPillar,
    saju.monthPillar,
    saju.dayPillar,
    saju.hourPillar
  ]);
  let hash = 0;
  for (let i = 0; i < sajuStr.length; i++) {
    const char = sajuStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function generateFortuneDetails(saju: SajuResult) {
  const seed = getDeterministicSeed(saju);
  const balance = calculateElementBalance(saju);
  const strongest = [...balance].sort((a, b) => b.value - a.value)[0];
  const weakest = [...balance].sort((a, b) => a.value - b.value)[0];
  
  const elementNames: Record<FiveElement, string> = { '木': '나무', '火': '불', '土': '흙', '金': '쇠', '水': '물' };
  
  // 조합형 문장 생성
  const summaries = {
    '木': ["성장과 발전의 기운이 강합니다.", "창의적인 아이디어가 샘솟는 시기입니다.", "새로운 시작을 하기에 최적의 조건입니다."],
    '火': ["열정과 에너지가 넘치는 구성입니다.", "자신의 능력을 널리 알릴 기회가 많습니다.", "화려하고 역동적인 삶의 태도를 가집니다."],
    '土': ["안정감과 신뢰가 바탕이 되는 사주입니다.", "중재자로서의 능력이 탁월합니다.", "결실을 맺고 저장하는 능력이 좋습니다."],
    '金': ["결단력과 정의감이 돋보이는 구성입니다.", "군더더기 없는 깔끔한 처세가 강점입니다.", "단단한 의지로 목표를 달성하는 힘이 있습니다."],
    '水': ["지혜롭고 유연한 사고방식을 가졌습니다.", "통찰력이 깊어 본질을 꿰뚫어 봅니다.", "주변과 잘 융화되면서도 자신의 흐름을 유지합니다."]
  };

  const advice = {
    '木': "지나친 의욕보다는 내실을 다지는 것이 중요합니다.",
    '火': "감정 조절에 유의하며 차분함을 유지하세요.",
    '土': "변화를 두려워하지 말고 유연하게 대처하세요.",
    '金': "주변 사람들에게 조금 더 따뜻한 포용력을 보여주세요.",
    '水': "생각만 하기보다는 실행에 옮기는 용기가 필요합니다."
  };

  const luckyData = ELEMENT_LUCKY_DATA[strongest.name as FiveElement];

  return {
    summary: summaries[strongest.name as FiveElement][seed % 3],
    mainElement: elementNames[strongest.name as FiveElement],
    advice: advice[weakest.name as FiveElement],
    scores: {
      wealth: 70 + ((seed % 250) / 10),
      health: 65 + (((seed >> 2) % 300) / 10),
      love: 60 + (((seed >> 4) % 350) / 10),
      career: 75 + (((seed >> 6) % 200) / 10)
    },
    lucky: luckyData
  };
}
