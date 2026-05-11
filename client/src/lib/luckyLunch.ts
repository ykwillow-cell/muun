import { STEM_ELEMENTS, BRANCH_ELEMENTS } from '@/lib/saju';

export interface LunchMenu {
  id: string;
  name: string;
  element: "木" | "火" | "土" | "金" | "水";
  description: string;
  benefits: string[];
  ingredients: string[];
  season: string;
  energyLevel: number; // 1-5
}

export interface LuckyLunchResult {
  element: "木" | "火" | "土" | "金" | "水";
  elementName: string;
  recommendedMenus: LunchMenu[];
  elementDescription: string;
  energyAdvice: string;
  seasonalAdvice: string;
}

// 오행별 메뉴 데이터 (각 오행별 12개 = 총 60개)
const LUNCH_MENUS: LunchMenu[] = [
  // 木 (목) - 봄, 신맛, 초록색
  {
    id: "wood-1",
    name: "시금치 계란덮밥",
    element: "木",
    description: "신선한 시금치와 계란으로 만든 영양 만점 덮밥",
    benefits: ["소화 촉진", "신진대사 활성화", "피로 회복"],
    ingredients: ["시금치", "계란", "쌀", "간장"],
    season: "봄",
    energyLevel: 4,
  },
  {
    id: "wood-2",
    name: "브로콜리 스테이크",
    element: "木",
    description: "풍부한 영양소를 담은 건강한 브로콜리 요리",
    benefits: ["면역력 강화", "항산화 작용", "뼈 건강"],
    ingredients: ["브로콜리", "올리브유", "마늘", "소금"],
    season: "봄",
    energyLevel: 5,
  },
  {
    id: "wood-3",
    name: "쑥국밥",
    element: "木",
    description: "봄의 향기를 담은 전통 쑥국",
    benefits: ["해독", "혈액 순환", "봄철 피로 회복"],
    ingredients: ["쑥", "쌀", "소금", "참기름"],
    season: "봄",
    energyLevel: 4,
  },
  {
    id: "wood-4",
    name: "케일 샐러드",
    element: "木",
    description: "슈퍼푸드 케일의 신선한 샐러드",
    benefits: ["독소 제거", "에너지 증진", "피부 개선"],
    ingredients: ["케일", "레몬", "올리브유", "견과류"],
    season: "봄",
    energyLevel: 4,
  },
  {
    id: "wood-5",
    name: "미역국",
    element: "木",
    description: "미역의 풍부한 미네랄을 담은 국",
    benefits: ["갑상선 건강", "신진대사 촉진", "혈액 정화"],
    ingredients: ["미역", "소고기", "참기름", "소금"],
    season: "봄",
    energyLevel: 3,
  },
  {
    id: "wood-6",
    name: "쑥갓 비빔밥",
    element: "木",
    description: "쑥갓의 향긋한 맛이 살아있는 비빔밥",
    benefits: ["간 건강", "혈액 정화", "소화 촉진"],
    ingredients: ["쑥갓", "쌀", "계란", "고추장"],
    season: "봄",
    energyLevel: 4,
  },
  {
    id: "wood-7",
    name: "냉이 된장국",
    element: "木",
    description: "봄나물의 대표 냉이를 담은 국",
    benefits: ["간 기능 강화", "해독", "봄철 건강"],
    ingredients: ["냉이", "된장", "두부", "소금"],
    season: "봄",
    energyLevel: 3,
  },
  {
    id: "wood-8",
    name: "아스파라거스 구이",
    element: "木",
    description: "신선한 아스파라거스의 담백한 맛",
    benefits: ["항산화", "소화 촉진", "피로 회복"],
    ingredients: ["아스파라거스", "올리브유", "마늘", "소금"],
    season: "봄",
    energyLevel: 4,
  },
  {
    id: "wood-9",
    name: "시래기 밥",
    element: "木",
    description: "시래기의 쫄깃한 식감이 특징인 밥",
    benefits: ["식이섬유 풍부", "소화 촉진", "혈당 조절"],
    ingredients: ["시래기", "쌀", "참기름", "소금"],
    season: "봄",
    energyLevel: 3,
  },
  {
    id: "wood-10",
    name: "파 계란찜",
    element: "木",
    description: "파의 향긋함과 계란의 부드러움이 어우러진 요리",
    benefits: ["신진대사 촉진", "피로 회복", "항염증"],
    ingredients: ["파", "계란", "간장", "참기름"],
    season: "봄",
    energyLevel: 3,
  },
  {
    id: "wood-11",
    name: "청경채 볶음밥",
    element: "木",
    description: "아삭한 청경채가 들어간 건강한 볶음밥",
    benefits: ["칼슘 흡수", "소화 촉진", "신진대사 활성화"],
    ingredients: ["청경채", "쌀", "계란", "간장"],
    season: "봄",
    energyLevel: 4,
  },
  {
    id: "wood-12",
    name: "돌나물 비빔국수",
    element: "木",
    description: "돌나물의 신맛이 살아있는 국수",
    benefits: ["소화 촉진", "혈액 순환", "피부 건강"],
    ingredients: ["돌나물", "국수", "고추장", "참기름"],
    season: "봄",
    energyLevel: 3,
  },

  // 火 (화) - 여름, 쓴맛, 빨간색
  {
    id: "fire-1",
    name: "불고기 덮밥",
    element: "火",
    description: "따뜻한 기운의 소고기 덮밥",
    benefits: ["에너지 충전", "근력 강화", "혈액 생성"],
    ingredients: ["소고기", "간장", "설탕", "쌀"],
    season: "여름",
    energyLevel: 5,
  },
  {
    id: "fire-2",
    name: "토마토 파스타",
    element: "火",
    description: "빨간 토마토의 풍미 가득한 파스타",
    benefits: ["항산화", "심장 건강", "피로 회복"],
    ingredients: ["토마토", "파스타", "마늘", "올리브유"],
    season: "여름",
    energyLevel: 4,
  },
  {
    id: "fire-3",
    name: "닭다리 구이",
    element: "火",
    description: "따뜻한 에너지의 닭다리 구이",
    benefits: ["단백질 풍부", "에너지 증진", "근력 강화"],
    ingredients: ["닭다리", "간장", "마늘", "생강"],
    season: "여름",
    energyLevel: 5,
  },
  {
    id: "fire-4",
    name: "고추장 제육볶음",
    element: "火",
    description: "매운맛의 고추장 제육볶음",
    benefits: ["신진대사 촉진", "혈액 순환", "소화 촉진"],
    ingredients: ["돼지고기", "고추장", "고추", "마늘"],
    season: "여름",
    energyLevel: 5,
  },
  {
    id: "fire-5",
    name: "새우 볶음밥",
    element: "火",
    description: "새우의 풍미가 살아있는 볶음밥",
    benefits: ["단백질 풍부", "에너지 충전", "항산화"],
    ingredients: ["새우", "쌀", "계란", "간장"],
    season: "여름",
    energyLevel: 4,
  },
  {
    id: "fire-6",
    name: "소시지 계란말이",
    element: "火",
    description: "소시지와 계란의 조화로운 요리",
    benefits: ["에너지 증진", "단백질 공급", "포만감"],
    ingredients: ["소시지", "계란", "파", "소금"],
    season: "여름",
    energyLevel: 4,
  },
  {
    id: "fire-7",
    name: "매운 떡볶이",
    element: "火",
    description: "매운맛으로 입맛을 돋우는 떡볶이",
    benefits: ["신진대사 촉진", "혈액 순환", "소화 촉진"],
    ingredients: ["떡", "고추장", "고추", "설탕"],
    season: "여름",
    energyLevel: 4,
  },
  {
    id: "fire-8",
    name: "돈까스",
    element: "火",
    description: "따뜻한 에너지의 돈까스",
    benefits: ["단백질 풍부", "에너지 충전", "근력 강화"],
    ingredients: ["돼지고기", "계란", "빵가루", "소금"],
    season: "여름",
    energyLevel: 5,
  },
  {
    id: "fire-9",
    name: "고추 계란볶음",
    element: "火",
    description: "고추의 매운맛과 계란의 부드러움",
    benefits: ["신진대사 촉진", "항산화", "소화 촉진"],
    ingredients: ["고추", "계란", "간장", "참기름"],
    season: "여름",
    energyLevel: 3,
  },
  {
    id: "fire-10",
    name: "소갈비 구이",
    element: "火",
    description: "소갈비의 풍미가 살아있는 구이",
    benefits: ["에너지 충전", "근력 강화", "혈액 생성"],
    ingredients: ["소갈비", "간장", "마늘", "생강"],
    season: "여름",
    energyLevel: 5,
  },
  {
    id: "fire-11",
    name: "매운 국수",
    element: "火",
    description: "매운 국물의 국수",
    benefits: ["신진대사 촉진", "혈액 순환", "소화 촉진"],
    ingredients: ["국수", "고추", "마늘", "간장"],
    season: "여름",
    energyLevel: 3,
  },
  {
    id: "fire-12",
    name: "닭가슴살 스테이크",
    element: "火",
    description: "담백하면서도 따뜻한 에너지의 닭가슴살",
    benefits: ["단백질 풍부", "에너지 증진", "근력 강화"],
    ingredients: ["닭가슴살", "올리브유", "마늘", "소금"],
    season: "여름",
    energyLevel: 4,
  },

  // 土 (토) - 환절기, 단맛, 노란색
  {
    id: "earth-1",
    name: "옥수수 계란밥",
    element: "土",
    description: "옥수수의 단맛이 살아있는 밥",
    benefits: ["소화 촉진", "에너지 안정화", "피로 회복"],
    ingredients: ["옥수수", "계란", "쌀", "버터"],
    season: "환절기",
    energyLevel: 4,
  },
  {
    id: "earth-2",
    name: "단호박 죽",
    element: "土",
    description: "단호박의 부드러운 맛이 특징인 죽",
    benefits: ["소화 촉진", "면역력 강화", "피로 회복"],
    ingredients: ["단호박", "쌀", "우유", "설탕"],
    season: "환절기",
    energyLevel: 3,
  },
  {
    id: "earth-3",
    name: "감자 계란국",
    element: "土",
    description: "감자의 포만감이 있는 국",
    benefits: ["소화 촉진", "에너지 안정화", "포만감"],
    ingredients: ["감자", "계란", "소금", "참기름"],
    season: "환절기",
    energyLevel: 3,
  },
  {
    id: "earth-4",
    name: "옥수수 수염차 밥",
    element: "土",
    description: "옥수수 수염차로 지은 건강한 밥",
    benefits: ["소화 촉진", "혈당 조절", "에너지 안정화"],
    ingredients: ["옥수수", "쌀", "옥수수 수염", "소금"],
    season: "환절기",
    energyLevel: 3,
  },
  {
    id: "earth-5",
    name: "고구마 계란말이",
    element: "土",
    description: "고구마의 단맛과 계란의 부드러움",
    benefits: ["식이섬유 풍부", "소화 촉진", "에너지 안정화"],
    ingredients: ["고구마", "계란", "파", "소금"],
    season: "환절기",
    energyLevel: 3,
  },
  {
    id: "earth-6",
    name: "팥죽",
    element: "土",
    description: "팥의 영양이 풍부한 죽",
    benefits: ["소화 촉진", "독소 제거", "에너지 안정화"],
    ingredients: ["팥", "쌀", "설탕", "소금"],
    season: "환절기",
    energyLevel: 3,
  },
  {
    id: "earth-7",
    name: "옥수수 스프",
    element: "土",
    description: "옥수수의 크리미한 스프",
    benefits: ["소화 촉진", "면역력 강화", "에너지 안정화"],
    ingredients: ["옥수수", "우유", "버터", "소금"],
    season: "환절기",
    energyLevel: 4,
  },
  {
    id: "earth-8",
    name: "감자 볶음",
    element: "土",
    description: "감자의 포만감이 있는 볶음",
    benefits: ["소화 촉진", "에너지 안정화", "포만감"],
    ingredients: ["감자", "올리브유", "마늘", "소금"],
    season: "환절기",
    energyLevel: 3,
  },
  {
    id: "earth-9",
    name: "고구마 밥",
    element: "土",
    description: "고구마가 들어간 건강한 밥",
    benefits: ["식이섬유 풍부", "소화 촉진", "에너지 안정화"],
    ingredients: ["고구마", "쌀", "소금", "참기름"],
    season: "환절기",
    energyLevel: 3,
  },
  {
    id: "earth-10",
    name: "옥수수 계란찜",
    element: "土",
    description: "옥수수와 계란의 부드러운 조화",
    benefits: ["소화 촉진", "단백질 공급", "에너지 안정화"],
    ingredients: ["옥수수", "계란", "간장", "참기름"],
    season: "환절기",
    energyLevel: 3,
  },
  {
    id: "earth-11",
    name: "감자 계란볶음",
    element: "土",
    description: "감자와 계란의 포만감 있는 요리",
    benefits: ["소화 촉진", "에너지 안정화", "포만감"],
    ingredients: ["감자", "계란", "간장", "참기름"],
    season: "환절기",
    energyLevel: 3,
  },
  {
    id: "earth-12",
    name: "옥수수 죽",
    element: "土",
    description: "옥수수의 단맛이 살아있는 죽",
    benefits: ["소화 촉진", "면역력 강화", "에너지 안정화"],
    ingredients: ["옥수수", "쌀", "우유", "설탕"],
    season: "환절기",
    energyLevel: 3,
  },

  // 金 (금) - 가을, 매운맛, 흰색
  {
    id: "metal-1",
    name: "무 국밥",
    element: "金",
    description: "무의 아삭함이 살아있는 국밥",
    benefits: ["소화 촉진", "항산화", "호흡기 건강"],
    ingredients: ["무", "쌀", "소고기", "소금"],
    season: "가을",
    energyLevel: 3,
  },
  {
    id: "metal-2",
    name: "도라지 무침",
    element: "金",
    description: "도라지의 쌉싸름한 맛이 특징",
    benefits: ["호흡기 건강", "기침 완화", "항염증"],
    ingredients: ["도라지", "간장", "참기름", "마늘"],
    season: "가을",
    energyLevel: 3,
  },
  {
    id: "metal-3",
    name: "배추 계란국",
    element: "金",
    description: "배추의 신선함이 살아있는 국",
    benefits: ["소화 촉진", "항산화", "면역력 강화"],
    ingredients: ["배추", "계란", "소금", "참기름"],
    season: "가을",
    energyLevel: 3,
  },
  {
    id: "metal-4",
    name: "양파 계란볶음",
    element: "金",
    description: "양파의 매운맛과 계란의 부드러움",
    benefits: ["혈액 순환", "항산화", "심장 건강"],
    ingredients: ["양파", "계란", "간장", "참기름"],
    season: "가을",
    energyLevel: 3,
  },
  {
    id: "metal-5",
    name: "무 된장국",
    element: "金",
    description: "무의 아삭함과 된장의 깊은 맛",
    benefits: ["소화 촉진", "항산화", "호흡기 건강"],
    ingredients: ["무", "된장", "두부", "소금"],
    season: "가을",
    energyLevel: 3,
  },
  {
    id: "metal-6",
    name: "마 계란말이",
    element: "金",
    description: "마의 미끈한 식감과 계란의 부드러움",
    benefits: ["소화 촉진", "면역력 강화", "에너지 증진"],
    ingredients: ["마", "계란", "파", "소금"],
    season: "가을",
    energyLevel: 3,
  },
  {
    id: "metal-7",
    name: "배추 무침",
    element: "金",
    description: "배추의 신선함이 살아있는 무침",
    benefits: ["소화 촉진", "항산화", "면역력 강화"],
    ingredients: ["배추", "간장", "참기름", "마늘"],
    season: "가을",
    energyLevel: 2,
  },
  {
    id: "metal-8",
    name: "무 볶음밥",
    element: "金",
    description: "무의 아삭함이 살아있는 볶음밥",
    benefits: ["소화 촉진", "항산화", "호흡기 건강"],
    ingredients: ["무", "쌀", "계란", "간장"],
    season: "가을",
    energyLevel: 3,
  },
  {
    id: "metal-9",
    name: "양파 소시지 계란말이",
    element: "金",
    description: "양파, 소시지, 계란의 조화",
    benefits: ["혈액 순환", "에너지 증진", "단백질 공급"],
    ingredients: ["양파", "소시지", "계란", "소금"],
    season: "가을",
    energyLevel: 4,
  },
  {
    id: "metal-10",
    name: "도라지 계란국",
    element: "金",
    description: "도라지의 쌉싸름한 맛과 계란의 부드러움",
    benefits: ["호흡기 건강", "기침 완화", "항염증"],
    ingredients: ["도라지", "계란", "소금", "참기름"],
    season: "가을",
    energyLevel: 3,
  },
  {
    id: "metal-11",
    name: "무 계란찜",
    element: "金",
    description: "무와 계란의 부드러운 조화",
    benefits: ["소화 촉진", "항산화", "호흡기 건강"],
    ingredients: ["무", "계란", "간장", "참기름"],
    season: "가을",
    energyLevel: 3,
  },
  {
    id: "metal-12",
    name: "배추 계란말이",
    element: "金",
    description: "배추의 신선함과 계란의 부드러움",
    benefits: ["소화 촉진", "항산화", "면역력 강화"],
    ingredients: ["배추", "계란", "파", "소금"],
    season: "가을",
    energyLevel: 3,
  },

  // 水 (수) - 겨울, 짠맛, 검은색
  {
    id: "water-1",
    name: "검은콩 밥",
    element: "水",
    description: "검은콩의 영양이 풍부한 밥",
    benefits: ["신장 건강", "항산화", "에너지 증진"],
    ingredients: ["검은콩", "쌀", "소금", "참기름"],
    season: "겨울",
    energyLevel: 4,
  },
  {
    id: "water-2",
    name: "미역국",
    element: "水",
    description: "미역의 풍부한 미네랄을 담은 국",
    benefits: ["신장 건강", "혈액 정화", "항산화"],
    ingredients: ["미역", "소고기", "참기름", "소금"],
    season: "겨울",
    energyLevel: 3,
  },
  {
    id: "water-3",
    name: "검은깨 계란말이",
    element: "水",
    description: "검은깨의 고소함과 계란의 부드러움",
    benefits: ["신장 건강", "항산화", "에너지 증진"],
    ingredients: ["검은깨", "계란", "파", "소금"],
    season: "겨울",
    energyLevel: 3,
  },
  {
    id: "water-4",
    name: "멸치 계란국",
    element: "水",
    description: "멸치의 짠맛과 계란의 부드러움",
    benefits: ["칼슘 흡수", "신장 건강", "항산화"],
    ingredients: ["멸치", "계란", "소금", "참기름"],
    season: "겨울",
    energyLevel: 3,
  },
  {
    id: "water-5",
    name: "검은콩 죽",
    element: "水",
    description: "검은콩의 영양이 풍부한 죽",
    benefits: ["신장 건강", "항산화", "에너지 증진"],
    ingredients: ["검은콩", "쌀", "우유", "설탕"],
    season: "겨울",
    energyLevel: 3,
  },
  {
    id: "water-6",
    name: "다시마 계란국",
    element: "水",
    description: "다시마의 깊은 맛과 계란의 부드러움",
    benefits: ["신장 건강", "혈액 정화", "항산화"],
    ingredients: ["다시마", "계란", "소금", "참기름"],
    season: "겨울",
    energyLevel: 3,
  },
  {
    id: "water-7",
    name: "검은깨 볶음밥",
    element: "水",
    description: "검은깨의 고소함이 살아있는 볶음밥",
    benefits: ["신장 건강", "항산화", "에너지 증진"],
    ingredients: ["검은깨", "쌀", "계란", "간장"],
    season: "겨울",
    energyLevel: 3,
  },
  {
    id: "water-8",
    name: "홍합 계란국",
    element: "水",
    description: "홍합의 풍미가 살아있는 국",
    benefits: ["신장 건강", "항산화", "에너지 증진"],
    ingredients: ["홍합", "계란", "소금", "참기름"],
    season: "겨울",
    energyLevel: 4,
  },
  {
    id: "water-9",
    name: "검은콩 계란말이",
    element: "水",
    description: "검은콩과 계란의 부드러운 조화",
    benefits: ["신장 건강", "항산화", "에너지 증진"],
    ingredients: ["검은콩", "계란", "파", "소금"],
    season: "겨울",
    energyLevel: 3,
  },
  {
    id: "water-10",
    name: "멸치 볶음밥",
    element: "水",
    description: "멸치의 짠맛이 살아있는 볶음밥",
    benefits: ["칼슘 흡수", "신장 건강", "항산화"],
    ingredients: ["멸치", "쌀", "계란", "간장"],
    season: "겨울",
    energyLevel: 3,
  },
  {
    id: "water-11",
    name: "다시마 무침",
    element: "水",
    description: "다시마의 깊은 맛이 살아있는 무침",
    benefits: ["신장 건강", "혈액 정화", "항산화"],
    ingredients: ["다시마", "간장", "참기름", "마늘"],
    season: "겨울",
    energyLevel: 2,
  },
  {
    id: "water-12",
    name: "홍합 미역국",
    element: "水",
    description: "홍합과 미역의 풍미가 어우러진 국",
    benefits: ["신장 건강", "혈액 정화", "항산화"],
    ingredients: ["홍합", "미역", "참기름", "소금"],
    season: "겨울",
    energyLevel: 4,
  },
];

export function getLuckyLunchResult(saju: any): LuckyLunchResult {
  // 사주의 오행 분석
  const elementCounts = {
    "木": 0,
    "火": 0,
    "土": 0,
    "金": 0,
    "水": 0,
  };

  // 네 기둥의 오행 개수 세기
  const pillars = [saju.yearPillar, saju.monthPillar, saju.dayPillar, saju.hourPillar];
  pillars.forEach((pillar: any) => {
    if (pillar) {
      const stemElement = STEM_ELEMENTS[pillar.stem];
      const branchElement = BRANCH_ELEMENTS[pillar.branch];
      if (stemElement && elementCounts.hasOwnProperty(stemElement)) {
        elementCounts[stemElement as keyof typeof elementCounts]++;
      }
      if (branchElement && elementCounts.hasOwnProperty(branchElement)) {
        elementCounts[branchElement as keyof typeof elementCounts]++;
      }
    }
  })

  // 가장 부족한 오행 찾기
  let recommendedElement = "木";
  let minCount = 999;

  Object.entries(elementCounts).forEach(([elem, count]) => {
    if (count < minCount) {
      minCount = count;
      recommendedElement = elem;
    }
  });

  // 추천 메뉴 3개 선택 (같은 오행의 메뉴 중 에너지 레벨 높은 순)
  const recommendedMenus = LUNCH_MENUS.filter(
    (menu) => menu.element === recommendedElement
  )
    .sort((a, b) => b.energyLevel - a.energyLevel)
    .slice(0, 3);

  const elementNames: Record<string, string> = {
    "木": "목(木)",
    "火": "화(火)",
    "土": "토(土)",
    "金": "금(金)",
    "水": "수(水)",
  };

  const elementDescriptions: Record<string, string> = {
    "木": "목 기운은 성장과 신진대사를 촉진합니다. 봄의 에너지로 새로운 시작과 활력을 가져옵니다.",
    "火": "화 기운은 열정과 에너지를 불태웁니다. 여름의 에너지로 활동성과 행동력을 높입니다.",
    "土": "토 기운은 안정과 균형을 가져옵니다. 환절기의 에너지로 소화와 흡수를 돕습니다.",
    "金": "금 기운은 정제와 정화를 의미합니다. 가을의 에너지로 호흡기와 피부 건강을 돕습니다.",
    "水": "수 기운은 저장과 휴식을 의미합니다. 겨울의 에너지로 신장 건강과 회복력을 높입니다.",
  };

  const energyAdvices: Record<string, string> = {
    "木": "목 기운이 부족한 당신은 신선한 초록색 채소와 신맛이 나는 음식을 섭취하면 좋습니다. 봄의 에너지를 담은 음식으로 신진대사를 활성화하세요.",
    "火": "화 기운이 부족한 당신은 따뜻한 성질의 음식과 빨간색 음식을 섭취하면 좋습니다. 여름의 에너지를 담은 음식으로 활동력을 높이세요.",
    "土": "토 기운이 부족한 당신은 노란색 음식과 단맛이 나는 음식을 섭취하면 좋습니다. 환절기의 에너지를 담은 음식으로 소화 기능을 강화하세요.",
    "金": "금 기운이 부족한 당신은 흰색 음식과 매운맛이 나는 음식을 섭취하면 좋습니다. 가을의 에너지를 담은 음식으로 호흡기 건강을 지키세요.",
    "水": "수 기운이 부족한 당신은 검은색 음식과 짠맛이 나는 음식을 섭취하면 좋습니다. 겨울의 에너지를 담은 음식으로 신장 건강을 강화하세요.",
  };

  // 현재 계절 판단 (실제 날짜 기반)
  const currentMonth = new Date().getMonth() + 1; // 1~12
  let currentSeason: string;
  if (currentMonth >= 3 && currentMonth <= 5)       currentSeason = "봄";
  else if (currentMonth >= 6 && currentMonth <= 8)  currentSeason = "여름";
  else if (currentMonth >= 9 && currentMonth <= 11) currentSeason = "가을";
  else                                               currentSeason = "겨울";

  // 현재 계절 × 오행별 조언
  const seasonalAdviceMap: Record<string, Record<string, string>> = {
    봄: {
      "木": "봄은 목 기운이 가장 왕성한 계절이에요. 신선한 봄나물과 녹색 채소로 신진대사를 끌어올리기 좋은 시기예요.",
      "火": "봄은 화 기운을 키우기 좋은 출발점이에요. 따뜻한 성질의 음식으로 몸에 활기를 불어넣어 보세요.",
      "土": "봄철 환절기에는 소화 기능이 흔들리기 쉬워요. 부드럽고 영양 균형 잡힌 음식으로 위장을 다독여 주세요.",
      "金": "봄에는 호흡기가 민감해지기 쉬운 계절이에요. 항산화 성분이 풍부한 음식으로 면역력을 챙겨보세요.",
      "水": "봄은 겨울 동안 저장된 수 기운이 순환을 시작하는 시기예요. 가볍고 수분 많은 음식으로 몸의 독소를 배출해 보세요.",
    },
    여름: {
      "木": "여름에는 목 기운을 서늘하게 식혀주는 것이 좋아요. 신맛이 나는 채소와 과일로 열기를 다스려 보세요.",
      "火": "여름은 화 기운이 최고조인 계절이에요. 과하지 않게 에너지를 쓰고, 충분한 수분과 함께 가볍게 드세요.",
      "土": "여름철 습도가 높아지면 소화가 더뎌질 수 있어요. 담백하고 소화가 잘 되는 음식으로 위장 부담을 줄이세요.",
      "金": "여름에는 호흡기와 피부가 땀으로 지치기 쉬워요. 미네랄이 풍부한 음식으로 속을 채워 보세요.",
      "水": "여름에는 수 기운이 땀으로 빠져나가기 쉬운 계절이에요. 짭조름하고 수분이 많은 음식으로 기운을 보충하세요.",
    },
    가을: {
      "木": "가을은 목 기운이 수렴하는 시기예요. 간과 눈을 위한 녹색 채소를 꾸준히 챙겨 겨울을 대비하세요.",
      "火": "가을에는 화 기운이 식어가는 시기예요. 따뜻한 성질의 음식으로 체온을 유지하고 냉기를 막아보세요.",
      "土": "가을은 수확과 저장의 계절이에요. 뿌리채소와 곡물로 소화 기능을 강화하고 체력을 비축하세요.",
      "金": "가을은 금 기운이 가장 왕성한 계절이에요. 호흡기와 피부 관리에 신경 쓰며 건조함에 대비하세요.",
      "水": "가을은 수 기운을 저장하기 시작하는 시기예요. 해산물과 검은 식재료로 신장 건강을 미리 챙겨보세요.",
    },
    겨울: {
      "木": "겨울에는 목 기운이 잠드는 시기예요. 따뜻한 나물과 발효 채소로 몸속의 생명력을 지켜보세요.",
      "火": "겨울에는 화 기운이 가장 약해지기 쉬운 계절이에요. 몸을 따뜻하게 하는 음식으로 냉기를 막아보세요.",
      "土": "겨울에는 소화 기관의 움직임이 둔해지기 쉬워요. 따뜻하고 부드러운 음식으로 위장을 편안하게 해주세요.",
      "金": "겨울철 건조한 공기는 호흡기를 자극해요. 수분이 풍부하고 점막을 보호하는 음식을 챙겨 드세요.",
      "水": "겨울은 수 기운이 가장 왕성한 계절이에요. 신장과 방광을 따뜻하게 보호하는 음식으로 건강을 유지하세요.",
    },
  };

  const seasonalAdvices: Record<string, string> = seasonalAdviceMap[currentSeason];

  return {
    element: recommendedElement as "木" | "火" | "土" | "金" | "水",
    elementName: elementNames[recommendedElement],
    recommendedMenus,
    elementDescription: elementDescriptions[recommendedElement],
    energyAdvice: energyAdvices[recommendedElement],
    seasonalAdvice: seasonalAdvices[recommendedElement],
  };
}
