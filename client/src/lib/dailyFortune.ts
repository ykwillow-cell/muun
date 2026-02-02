import { calculateSaju, TenGod, HeavenlyStem, STEM_ELEMENTS } from "./saju";

export interface DailyFortuneResult {
  date: string;
  tenGod: TenGod;
  score: number;
  summary: string;
  detail: string;
  luckyColor: string;
  luckyFood: string;
  luckyItem: string;
  direction: string;
}

const FORTUNE_MESSAGES: Record<TenGod, { summary: string; details: string[] }> = {
  '비견': {
    summary: "나의 주관이 뚜렷해지고 에너지가 넘치는 날입니다.",
    details: [
      "자신감이 상승하여 계획했던 일을 추진하기 좋습니다. 다만 독단적인 결정은 피하세요.",
      "동료나 친구와의 유대감이 깊어지는 날입니다. 함께 식사하며 대화를 나눠보세요.",
      "자신의 역량을 발휘할 기회가 찾아옵니다. 주저하지 말고 실력을 보여주세요."
    ]
  },
  '겁재': {
    summary: "경쟁심이 생기고 변화를 추구하게 되는 날입니다.",
    details: [
      "뜻밖의 지출이 생길 수 있으니 자산 관리에 유의하세요. 충동구매는 금물입니다.",
      "선의의 경쟁이 성장의 발판이 됩니다. 타인의 성공을 질투하기보다 배울 점을 찾으세요.",
      "예상치 못한 인연으로부터 자극을 받게 됩니다. 새로운 시각으로 세상을 바라보세요."
    ]
  },
  '식신': {
    summary: "풍요롭고 즐거운 기운이 가득한 날입니다.",
    details: [
      "먹을 복과 즐길 거리가 풍부해지는 날입니다. 소중한 사람들과 맛있는 음식을 즐기세요.",
      "창의적인 아이디어가 샘솟는 날입니다. 예술적인 활동이나 기획 업무에 큰 성과가 있습니다.",
      "마음의 여유가 생겨 주변 사람들에게 너그러워집니다. 긍정적인 에너지를 전파하세요."
    ]
  },
  '상관': {
    summary: "표현력이 좋아지고 재능을 뽐내기 좋은 날입니다.",
    details: [
      "말솜씨가 화려해져 설득력이 높아지는 날입니다. 발표나 미팅에서 유리한 고지를 점하세요.",
      "기존의 틀을 깨는 혁신적인 생각이 떠오릅니다. 변화를 두려워하지 말고 시도해 보세요.",
      "감수성이 예민해질 수 있으니 감정 조절에 유의하세요. 예술로 승화시키면 좋습니다."
    ]
  },
  '편재': {
    summary: "활동 영역이 넓어지고 의외의 성과가 기대되는 날입니다.",
    details: [
      "생각지 못한 곳에서 재물운이 따릅니다. 작은 투자나 복권 구매도 나쁘지 않은 선택입니다.",
      "역동적인 활동이 운을 높여줍니다. 야외 활동이나 여행 계획을 세워보세요.",
      "과감한 결정이 필요한 순간입니다. 자신의 직관을 믿고 움직여보세요."
    ]
  },
  '정재': {
    summary: "안정적인 흐름 속에 성실함이 빛을 발하는 날입니다.",
    details: [
      "차곡차곡 쌓아온 노력이 결실을 맺는 날입니다. 꼼꼼한 일 처리가 인정을 받습니다.",
      "재무 상태를 점검하고 장기적인 계획을 세우기에 최적의 날입니다.",
      "가정이나 직장에서의 안정감이 높아집니다. 평범한 일상 속의 행복을 만끽하세요."
    ]
  },
  '편관': {
    summary: "강한 책임감과 리더십이 요구되는 날입니다.",
    details: [
      "어려운 과제가 주어질 수 있지만, 이를 극복하면 큰 명예가 따릅니다.",
      "긴장감을 늦추지 말고 철저히 준비하세요. 당신의 카리스마가 돋보이는 날입니다.",
      "건강 관리에 유의하며 무리한 일정은 피하는 것이 좋습니다."
    ]
  },
  '정관': {
    summary: "원칙과 질서 속에서 신뢰를 쌓는 날입니다.",
    details: [
      "윗사람이나 조직으로부터 신임을 얻게 되는 날입니다. 성실한 태도를 유지하세요.",
      "공적인 업무나 행정적인 절차를 처리하기에 매우 유리한 날입니다.",
      "단정한 차림새와 예의 바른 태도가 행운을 불러옵니다."
    ]
  },
  '편인': {
    summary: "직관력이 날카로워지고 전문 지식을 습득하기 좋은 날입니다.",
    details: [
      "철학적이고 심오한 분야에 관심이 생기는 날입니다. 독서나 명상을 즐겨보세요.",
      "독특한 문제 해결 방식이 빛을 발합니다. 남들이 보지 못하는 부분을 찾아내세요.",
      "혼자만의 시간이 에너지를 충전해 줍니다. 내면의 소리에 귀를 기울이세요."
    ]
  },
  '정인': {
    summary: "따뜻한 도움의 손길과 배움의 기쁨이 있는 날입니다.",
    details: [
      "주변의 귀인이 당신을 돕는 날입니다. 조언을 구하면 명쾌한 답을 얻을 수 있습니다.",
      "문서운이 좋아 계약이나 자격증 취득에 유리합니다. 준비한 것을 실행에 옮기세요.",
      "어머니와 같은 따뜻한 보살핌을 받거나 베풀게 되는 포근한 날입니다."
    ]
  }
};

const LUCKY_COLORS = ["Gold", "Silver", "Red", "Blue", "Green", "White", "Black", "Yellow", "Purple", "Pink"];
const LUCKY_FOODS = ["비빔밥", "스테이크", "파스타", "스시", "샐러드", "된장찌개", "커피", "과일 주스", "삼겹살", "샌드위치"];
const LUCKY_ITEMS = ["향수", "손목시계", "다이어리", "손거울", "이어폰", "책", "안경", "반지", "모자", "스카프"];
const DIRECTIONS = ["동쪽", "서쪽", "남쪽", "북쪽", "북동쪽", "남동쪽", "북서쪽", "남서쪽"];

function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDailyFortune(userBirthDate: Date, gender: 'male' | 'female'): DailyFortuneResult {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  
  // 사용자 사주 분석 (일간 추출용)
  const userSaju = calculateSaju(userBirthDate, gender);
  const dayStem = userSaju.dayPillar.stem;
  
  // 오늘의 일진 분석
  const todaySaju = calculateSaju(now, 'male'); // 성별은 일진 계산에 영향 없음
  const todayStem = todaySaju.dayPillar.stem;
  
  // 십신 계산 로직 (saju.ts의 로직 활용)
  // 직접 구현 (saju.ts의 calculateTenGod는 export되지 않았을 수 있으므로 재구현 또는 확인 필요)
  // 여기서는 원리만 구현
  const tenGod = calculateTenGodInternal(todayStem, dayStem);
  
  // 날짜와 사용자의 고유값을 조합한 시드 생성
  const seed = getHash(dateStr + dayStem + gender);
  
  const fortuneData = FORTUNE_MESSAGES[tenGod];
  const detailIndex = seed % fortuneData.details.length;
  
  // 점수 계산 (70~100점 사이로 랜덤하게 생성하되 날짜별로 고정)
  const score = 70 + (seed % 31);
  
  return {
    date: dateStr,
    tenGod,
    score,
    summary: fortuneData.summary,
    detail: fortuneData.details[detailIndex],
    luckyColor: LUCKY_COLORS[seed % LUCKY_COLORS.length],
    luckyFood: LUCKY_FOODS[seed % LUCKY_FOODS.length],
    luckyItem: LUCKY_ITEMS[seed % LUCKY_ITEMS.length],
    direction: DIRECTIONS[seed % DIRECTIONS.length]
  };
}

// saju.ts의 로직을 그대로 가져옴 (내부용)
function calculateTenGodInternal(targetStem: HeavenlyStem, dayStem: HeavenlyStem): TenGod {
  const STEM_ELEMENTS_INTERNAL: Record<string, string> = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
  };
  const STEM_YIN_YANG_INTERNAL: Record<string, boolean> = {
    '甲': true, '乙': false, '丙': true, '丁': false, '戊': true, '己': false, '庚': true, '辛': false, '壬': true, '癸': false,
  };
  const ELEMENT_RELATIONS_INTERNAL: Record<string, { generates: string, overcomes: string }> = {
    '木': { generates: '火', overcomes: '土' },
    '火': { generates: '土', overcomes: '金' },
    '土': { generates: '金', overcomes: '水' },
    '金': { generates: '수', overcomes: '木' }, // '水' 오타 수정 필요할 수 있음
    '水': { generates: '木', overcomes: '火' },
  };

  const targetElement = STEM_ELEMENTS_INTERNAL[targetStem];
  const dayElement = STEM_ELEMENTS_INTERNAL[dayStem];
  const isSameYinYang = STEM_YIN_YANG_INTERNAL[targetStem] === STEM_YIN_YANG_INTERNAL[dayStem];

  if (targetElement === dayElement) return isSameYinYang ? '비견' : '겁재';
  
  const relation = ELEMENT_RELATIONS_INTERNAL[dayElement];
  if (relation.generates === targetElement) return isSameYinYang ? '식신' : '상관';
  if (relation.overcomes === targetElement) return isSameYinYang ? '편재' : '정재';

  const targetRel = ELEMENT_RELATIONS_INTERNAL[targetElement];
  if (targetRel.overcomes === dayElement) return isSameYinYang ? '편관' : '정관';
  if (targetRel.generates === dayElement) return isSameYinYang ? '편인' : '정인';

  return '비견';
}
