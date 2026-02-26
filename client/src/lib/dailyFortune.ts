import { calculateSaju, TenGod, HeavenlyStem, STEM_ELEMENTS, BRANCH_ELEMENTS, FiveElement, calculateElementBalance, ELEMENT_LUCKY_DATA } from "./saju";

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
  // 확장 데이터
  extended: ExtendedFortuneData;
}

export interface ElementBalance {
  name: string;
  value: number;
  fullMark: number;
}

export interface DecisionMatrix {
  logicScore: number;    // 논리 지수 (0~100)
  intuitionScore: number; // 직관 지수 (0~100)
  offenseScore: number;  // 공격 지수 (0~100)
  defenseScore: number;  // 수비 지수 (0~100)
}

export interface TimelineSlot {
  hour: number;         // 0~23
  label: string;        // 시진 이름 (자시, 축시 등)
  score: number;        // 0~100
  isGoldenTime: boolean;
  description: string;
}

export interface CautionItem {
  category: '사람' | '장소' | '사물';
  icon: string;
  title: string;
  description: string;
}

export interface LuckBooster {
  icon: string;
  title: string;
  description: string;
  timing: string;
}

export interface SpatialData {
  luckyDirection: string;
  luckyDirectionAngle: number; // 0~360 degrees for compass
  luckyColor: string;
  luckyColorHex: string;
  deskItems: { name: string; reason: string }[];
}

export interface SynergyData {
  mbtiType: string;
  mbtiDescription: string;
  reason: string;
  compatibility: string;
}

export interface ExtendedFortuneData {
  elementBalance: ElementBalance[];
  decisionMatrix: DecisionMatrix;
  timeline: TimelineSlot[];
  cautions: CautionItem[];
  luckBoosters: LuckBooster[];
  spatial: SpatialData;
  synergy: SynergyData;
  energyKeyword: string;
  overallEnergy: string;
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

// 12시진 레이블
const SHICHEN_LABELS = [
  { hour: 23, label: '자시(子時)', desc: '심야의 고요함' },
  { hour: 1, label: '축시(丑時)', desc: '새벽의 시작' },
  { hour: 3, label: '인시(寅時)', desc: '여명의 기운' },
  { hour: 5, label: '묘시(卯時)', desc: '새벽 활력' },
  { hour: 7, label: '진시(辰時)', desc: '아침 에너지' },
  { hour: 9, label: '사시(巳時)', desc: '오전 집중' },
  { hour: 11, label: '오시(午時)', desc: '정오의 절정' },
  { hour: 13, label: '미시(未時)', desc: '오후 여유' },
  { hour: 15, label: '신시(申時)', desc: '활동의 시간' },
  { hour: 17, label: '유시(酉時)', desc: '저녁 결실' },
  { hour: 19, label: '술시(戌時)', desc: '황혼의 기운' },
  { hour: 21, label: '해시(亥時)', desc: '밤의 안정' },
];

const SHICHEN_DESCRIPTIONS: Record<string, string[]> = {
  '자시': ['깊은 수면으로 내일을 준비하세요', '야간 창작 활동에 영감이 넘칩니다'],
  '축시': ['조용한 사색의 시간입니다', '이른 기상으로 하루를 선점하세요'],
  '인시': ['새로운 계획을 세우기 좋은 시간입니다', '가벼운 스트레칭으로 몸을 깨우세요'],
  '묘시': ['집중력이 높아지는 황금 시간대입니다', '중요한 업무를 처리하기 좋습니다'],
  '진시': ['대인 관계에서 좋은 인상을 줄 수 있습니다', '미팅이나 협상에 유리합니다'],
  '사시': ['재물운이 활성화되는 시간입니다', '창의적 아이디어가 샘솟습니다'],
  '오시': ['에너지가 최고조에 달하는 시간입니다', '중요한 결정을 내리기 좋습니다'],
  '미시': ['소화가 잘 되는 시간, 가벼운 식사를 즐기세요', '인간관계 개선에 좋은 시간입니다'],
  '신시': ['활동적인 에너지가 넘치는 시간입니다', '운동이나 야외 활동을 추천합니다'],
  '유시': ['하루의 성과를 정리하기 좋은 시간입니다', '가족과 함께하는 시간이 행운을 부릅니다'],
  '술시': ['인맥 관리와 사교 활동에 좋습니다', '저녁 모임에서 귀인을 만날 수 있습니다'],
  '해시': ['내일을 위한 준비와 휴식의 시간입니다', '독서나 명상으로 마음을 정리하세요'],
};

// 오행별 결핍 기운을 보완하는 MBTI 추천
const ELEMENT_MBTI_SYNERGY: Record<FiveElement, { mbti: string; desc: string; reason: string; compat: string }> = {
  '木': {
    mbti: 'ENTJ',
    desc: '대담한 통솔자',
    reason: '목(木)의 성장 에너지가 강한 날, 결단력과 실행력의 ENTJ와 시너지를 이룹니다.',
    compat: '목화통명(木火通明) — 성장의 기운이 열정으로 이어집니다.'
  },
  '火': {
    mbti: 'ENFP',
    desc: '활동적인 영감가',
    reason: '화(火)의 열정적 에너지가 넘치는 날, 창의성과 사교성의 ENFP가 기운을 증폭시킵니다.',
    compat: '화토상생(火土相生) — 열정이 결실로 이어지는 조합입니다.'
  },
  '土': {
    mbti: 'ISFJ',
    desc: '용감한 수호자',
    reason: '토(土)의 안정적 기운이 강한 날, 세심하고 헌신적인 ISFJ와 깊은 신뢰를 쌓을 수 있습니다.',
    compat: '토금상생(土金相生) — 안정이 풍요로 이어지는 조합입니다.'
  },
  '金': {
    mbti: 'ISTJ',
    desc: '청렴결백한 논리주의자',
    reason: '금(金)의 결단력 있는 기운이 강한 날, 원칙적이고 신뢰할 수 있는 ISTJ와 완벽한 파트너십을 이룹니다.',
    compat: '금수상생(金水相生) — 결단이 지혜로 이어지는 조합입니다.'
  },
  '水': {
    mbti: 'INTP',
    desc: '논리적인 사색가',
    reason: '수(水)의 지혜로운 기운이 강한 날, 깊은 사고와 분석력의 INTP와 지적 시너지를 이룹니다.',
    compat: '수목상생(水木相生) — 지혜가 성장으로 이어지는 조합입니다.'
  },
};

// 오행별 주의사항
const ELEMENT_CAUTIONS: Record<FiveElement, CautionItem[]> = {
  '木': [
    { category: '사람', icon: '👥', title: '경쟁심 강한 인물', description: '오늘은 독단적 성향의 사람과 충돌하기 쉽습니다. 의견 차이가 생기면 한 발 물러서세요.' },
    { category: '장소', icon: '🏢', title: '소음이 많은 공간', description: '목(木)의 기운이 강한 날은 산만한 환경이 집중력을 흐트러뜨립니다. 조용한 공간을 찾으세요.' },
    { category: '사물', icon: '💳', title: '충동적 소비 유혹', description: '에너지가 넘쳐 과소비로 이어질 수 있습니다. 지갑을 열기 전 한 번 더 생각하세요.' },
  ],
  '火': [
    { category: '사람', icon: '🔥', title: '감정적으로 예민한 사람', description: '화(火)의 기운이 강한 날은 감정 충돌이 쉽게 일어납니다. 자극적인 대화는 피하세요.' },
    { category: '장소', icon: '🌡️', title: '더운 환경이나 혼잡한 장소', description: '체온이 올라가기 쉬운 날입니다. 통풍이 잘 되는 곳에서 활동하세요.' },
    { category: '사물', icon: '📱', title: '과도한 전자기기 사용', description: '눈과 신경이 예민해지는 날입니다. 스크린 타임을 줄이고 눈을 쉬게 하세요.' },
  ],
  '土': [
    { category: '사람', icon: '🤝', title: '우유부단한 인물', description: '토(土)의 기운이 강한 날은 결정을 미루는 사람과 함께하면 진전이 없습니다. 주도권을 잡으세요.' },
    { category: '장소', icon: '🏚️', title: '정돈되지 않은 공간', description: '토의 기운은 정리정돈과 연결됩니다. 어수선한 환경은 기운의 흐름을 막습니다.' },
    { category: '사물', icon: '🍬', title: '단 음식 과다 섭취', description: '토(土)는 단맛과 연결됩니다. 과도한 당 섭취는 오히려 기운을 떨어뜨립니다.' },
  ],
  '金': [
    { category: '사람', icon: '⚔️', title: '비판적이거나 냉소적인 사람', description: '금(金)의 날카로운 기운이 강할 때 부정적 에너지를 가진 사람과 있으면 기운이 꺾입니다.' },
    { category: '장소', icon: '🏥', title: '의료 시설이나 금속 관련 장소', description: '금(金)의 기운이 과도할 수 있는 날, 날카로운 물건이나 의료 시설 방문은 신중히 하세요.' },
    { category: '사물', icon: '🔪', title: '날카로운 도구', description: '금(金)의 기운이 강한 날은 날카로운 도구 사용 시 부상에 주의하세요.' },
  ],
  '水': [
    { category: '사람', icon: '🌊', title: '감언이설로 유혹하는 사람', description: '수(水)의 유동적 기운이 강한 날은 판단력이 흐려질 수 있습니다. 달콤한 말에 주의하세요.' },
    { category: '장소', icon: '💧', title: '물가나 습한 장소', description: '수(水)의 기운이 과도해질 수 있습니다. 물가 근처 활동은 안전에 유의하세요.' },
    { category: '사물', icon: '🍺', title: '알코올 음료', description: '수(水)의 기운이 강한 날 음주는 판단력을 더욱 흐리게 합니다. 절제를 권장합니다.' },
  ],
};

// 오행별 행운 부스터
const ELEMENT_LUCK_BOOSTERS: Record<FiveElement, LuckBooster[]> = {
  '木': [
    { icon: '🌱', title: '자연 속 산책', description: '나무와 풀이 있는 공원을 15분 이상 걸으면 목(木)의 기운이 충전됩니다.', timing: '오전 7~9시 (묘시)' },
    { icon: '📖', title: '새로운 지식 탐구', description: '관심 있던 분야의 책이나 강의를 시작하세요. 성장의 기운이 배움과 시너지를 냅니다.', timing: '오전 9~11시 (사시)' },
    { icon: '🌿', title: '초록 식물 곁에 두기', description: '책상 위에 작은 식물을 두면 목(木)의 기운이 지속적으로 보충됩니다.', timing: '하루 종일' },
  ],
  '火': [
    { icon: '🏃', title: '유산소 운동', description: '달리기나 자전거 타기로 화(火)의 에너지를 발산하면 오히려 기운이 안정됩니다.', timing: '오전 9~11시 (사시)' },
    { icon: '👥', title: '사람들과의 교류', description: '친구나 동료와 밝은 대화를 나누세요. 화(火)의 기운은 소통으로 빛을 발합니다.', timing: '점심 시간 (오시)' },
    { icon: '🕯️', title: '따뜻한 조명 켜두기', description: '주황빛 조명이나 캔들을 켜두면 화(火)의 기운이 공간에 퍼져 집중력이 높아집니다.', timing: '저녁 (술시)' },
  ],
  '土': [
    { icon: '🧘', title: '명상 또는 호흡 운동', description: '5분간 깊은 호흡으로 토(土)의 안정된 기운을 내면에 쌓으세요.', timing: '아침 기상 직후' },
    { icon: '🏠', title: '공간 정리정돈', description: '책상이나 방을 깔끔하게 정리하면 토(土)의 기운이 흐름을 타기 시작합니다.', timing: '오전 (진시)' },
    { icon: '🍠', title: '따뜻한 뿌리채소 식사', description: '고구마, 감자 등 뿌리채소를 섭취하면 토(土)의 기운이 보강됩니다.', timing: '점심 (오시~미시)' },
  ],
  '金': [
    { icon: '✅', title: '할 일 목록 작성', description: '오늘 해야 할 일을 명확히 적고 하나씩 지워나가세요. 금(金)의 결단력이 극대화됩니다.', timing: '아침 (인시~묘시)' },
    { icon: '🎵', title: '클래식 음악 감상', description: '금속 악기가 포함된 클래식 음악은 금(金)의 기운을 정제하고 집중력을 높입니다.', timing: '업무 중 (사시~오시)' },
    { icon: '💎', title: '금속 액세서리 착용', description: '반지나 시계 등 금속 소품을 착용하면 금(金)의 기운이 몸에 흐릅니다.', timing: '하루 종일' },
  ],
  '水': [
    { icon: '📝', title: '일기 또는 저널 쓰기', description: '오늘의 생각과 감정을 기록하세요. 수(水)의 지혜로운 기운이 글 속에 담깁니다.', timing: '저녁 (유시~술시)' },
    { icon: '🛁', title: '따뜻한 목욕', description: '수(水)의 기운이 강한 날, 따뜻한 물에 몸을 담그면 기운이 정화됩니다.', timing: '저녁 (술시~해시)' },
    { icon: '🌊', title: '물 충분히 마시기', description: '하루 2리터 이상 물을 마시면 수(水)의 기운이 몸 전체에 순환합니다.', timing: '하루 종일' },
  ],
};

// 오행별 데스크테리어 소품
const ELEMENT_DESK_ITEMS: Record<FiveElement, { name: string; reason: string }[]> = {
  '木': [
    { name: '작은 화분 (다육식물)', reason: '목(木)의 성장 기운을 공간에 불어넣습니다' },
    { name: '나무 소재 펜꽂이', reason: '천연 목재는 목(木)의 기운을 지속적으로 방출합니다' },
    { name: '초록색 메모지', reason: '시각적으로 목(木)의 기운을 자극합니다' },
  ],
  '火': [
    { name: '주황색 머그컵', reason: '화(火)의 열정 에너지를 시각화합니다' },
    { name: '따뜻한 조명 스탠드', reason: '화(火)의 기운을 공간에 퍼뜨립니다' },
    { name: '빨간 포인트 소품', reason: '화(火)의 활력 에너지를 보강합니다' },
  ],
  '土': [
    { name: '도자기 컵이나 그릇', reason: '흙으로 만든 도자기는 토(土)의 기운 그 자체입니다' },
    { name: '노란색 포스트잇', reason: '토(土)의 안정 에너지를 시각적으로 표현합니다' },
    { name: '천연 석재 문진', reason: '돌은 토(土)의 기운을 응축하고 있습니다' },
  ],
  '金': [
    { name: '금속 프레임 사진', reason: '금(金)의 결단력 에너지를 공간에 더합니다' },
    { name: '흰색 노트북 파우치', reason: '흰색은 금(金)의 대표 색상입니다' },
    { name: '은색 볼펜', reason: '금속 필기구는 금(金)의 기운을 손에 전달합니다' },
  ],
  '水': [
    { name: '검은색 마우스패드', reason: '수(水)의 지혜로운 기운을 책상에 깔아둡니다' },
    { name: '유리 물병', reason: '맑은 물이 담긴 유리병은 수(水)의 기운을 상징합니다' },
    { name: '파란색 다이어리', reason: '수(水)의 색상이 창의적 사고를 자극합니다' },
  ],
};

// 방향 각도 매핑
const DIRECTION_ANGLES: Record<string, number> = {
  '동쪽': 90, '서쪽': 270, '남쪽': 180, '북쪽': 0,
  '북동쪽': 45, '남동쪽': 135, '북서쪽': 315, '남서쪽': 225,
};

// 색상 HEX 매핑
const COLOR_HEX: Record<string, string> = {
  'Gold': '#F59E0B', 'Silver': '#9CA3AF', 'Red': '#EF4444',
  'Blue': '#3B82F6', 'Green': '#22C55E', 'White': '#F9FAFB',
  'Black': '#111827', 'Yellow': '#EAB308', 'Purple': '#A855F7', 'Pink': '#EC4899',
  '초록색': '#22C55E', '청색': '#3B82F6', '빨간색': '#EF4444',
  '주황색': '#F97316', '노란색': '#EAB308', '브라운': '#92400E',
  '흰색': '#F9FAFB', '금색': '#F59E0B', '은색': '#9CA3AF',
  '검은색': '#111827', '회색': '#6B7280',
};

// 에너지 키워드 (십신별)
const TENGOD_ENERGY_KEYWORDS: Record<TenGod, string> = {
  '비견': '자립', '겁재': '도전', '식신': '풍요', '상관': '표현',
  '편재': '기회', '정재': '안정', '편관': '극복', '정관': '신뢰',
  '편인': '직관', '정인': '지혜'
};

// 오늘의 에너지 총평 (십신별)
const TENGOD_OVERALL_ENERGY: Record<TenGod, string> = {
  '비견': '오늘은 나 자신의 에너지가 강하게 발현되는 날입니다. 독립적인 행동력과 추진력이 극대화되며, 자신만의 방식으로 목표를 향해 나아가기 좋은 하루입니다.',
  '겁재': '오늘은 변화와 경쟁의 기운이 감돕니다. 예상치 못한 상황이 생길 수 있지만, 이를 기회로 삼으면 큰 성장을 이룰 수 있는 역동적인 하루입니다.',
  '식신': '오늘은 풍요와 창의의 기운이 가득합니다. 먹을 복, 즐길 복이 넘치며 창의적인 활동에서 두각을 나타낼 수 있는 여유롭고 행복한 하루입니다.',
  '상관': '오늘은 표현력과 재능이 빛나는 날입니다. 말과 글, 예술적 감각이 최고조에 달하며, 자신의 개성을 마음껏 펼칠 수 있는 자유로운 하루입니다.',
  '편재': '오늘은 의외의 행운과 재물 기운이 따르는 날입니다. 활동적으로 움직일수록 더 많은 기회가 열리며, 과감한 도전이 성과로 이어지는 역동적인 하루입니다.',
  '정재': '오늘은 성실함과 안정의 기운이 지배하는 날입니다. 꾸준히 쌓아온 노력이 인정받고, 재물과 신뢰가 차곡차곡 쌓이는 든든한 하루입니다.',
  '편관': '오늘은 강한 압박과 책임의 기운이 흐르는 날입니다. 쉽지 않은 하루지만, 이 시련을 극복하면 큰 명예와 성취가 기다리는 단련의 하루입니다.',
  '정관': '오늘은 원칙과 신뢰의 기운이 강한 날입니다. 조직과 사회에서 인정받고 명예가 높아지는 날로, 성실하고 바른 태도가 행운을 불러오는 하루입니다.',
  '편인': '오늘은 직관과 영감의 기운이 날카로운 날입니다. 남들이 보지 못하는 것을 꿰뚫어보는 통찰력이 빛나며, 독창적인 아이디어가 솟아나는 하루입니다.',
  '정인': '오늘은 배움과 보살핌의 기운이 넘치는 날입니다. 귀인의 도움이 찾아오고, 지식과 지혜가 쌓이며, 따뜻한 인연이 깊어지는 풍요로운 하루입니다.',
};

function generateTimeline(seed: number, tenGod: TenGod, dominantElement: FiveElement): TimelineSlot[] {
  // 오행별 길한 시진 패턴
  const ELEMENT_PEAK_SHICHEN: Record<FiveElement, number[]> = {
    '木': [3, 5, 7],   // 인시, 묘시, 진시 (아침)
    '火': [9, 11, 13], // 사시, 오시, 미시 (낮)
    '土': [7, 13, 19], // 진시, 미시, 술시 (전환점)
    '金': [15, 17, 19],// 신시, 유시, 술시 (오후)
    '水': [21, 23, 1], // 해시, 자시, 축시 (밤)
  };

  const peakHours = ELEMENT_PEAK_SHICHEN[dominantElement];
  let goldenTimeSet = false;

  return SHICHEN_LABELS.map((shichen, idx) => {
    const isPeak = peakHours.includes(shichen.hour);
    const baseScore = isPeak ? 75 + ((seed + idx * 7) % 26) : 40 + ((seed + idx * 13) % 35);
    const isGolden = isPeak && !goldenTimeSet && baseScore >= 85;
    if (isGolden) goldenTimeSet = true;

    const shichenKey = shichen.label.replace('시(', '').replace('時)', '');
    const descList = SHICHEN_DESCRIPTIONS[shichenKey] || [shichen.desc];
    const desc = descList[(seed + idx) % descList.length];

    return {
      hour: shichen.hour,
      label: shichen.label,
      score: Math.min(100, baseScore),
      isGoldenTime: isGolden,
      description: desc,
    };
  });
}

function getDominantElement(saju: ReturnType<typeof calculateSaju>): FiveElement {
  const balance = calculateElementBalance(saju);
  const sorted = [...balance].sort((a, b) => b.value - a.value);
  return sorted[0].name as FiveElement;
}

export function getDailyFortune(userBirthDate: Date, gender: 'male' | 'female'): DailyFortuneResult {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  // 사용자 사주 분석
  const userSaju = calculateSaju(userBirthDate, gender);
  const dayStem = userSaju.dayPillar.stem;

  // 오늘의 일진 분석
  const todaySaju = calculateSaju(now, 'male');
  const todayStem = todaySaju.dayPillar.stem;

  // 십신 계산
  const tenGod = calculateTenGodInternal(todayStem, dayStem);

  // 날짜와 사용자의 고유값을 조합한 시드 생성
  const seed = getHash(dateStr + dayStem + gender);

  const fortuneData = FORTUNE_MESSAGES[tenGod];
  const detailIndex = seed % fortuneData.details.length;

  // 점수 계산 (70~100점)
  const score = 70 + (seed % 31);

  // 오행 밸런스
  const elementBalance = calculateElementBalance(userSaju);

  // 지배 오행 (사용자 사주 기준)
  const dominantElement = getDominantElement(userSaju);

  // 결핍 오행 (가장 낮은 오행)
  const sortedBalance = [...elementBalance].sort((a, b) => a.value - b.value);
  const deficientElement = sortedBalance[0].name as FiveElement;

  // 의사결정 매트릭스 계산
  const decisionMatrix: DecisionMatrix = {
    logicScore: 40 + ((seed * 3) % 61),
    intuitionScore: 40 + ((seed * 7) % 61),
    offenseScore: 40 + ((seed * 11) % 61),
    defenseScore: 40 + ((seed * 13) % 61),
  };

  // 타임라인 생성
  const timeline = generateTimeline(seed, tenGod, dominantElement);

  // 주의사항 (지배 오행 기준)
  const cautions = ELEMENT_CAUTIONS[dominantElement];

  // 행운 부스터 (지배 오행 기준, 2~3개)
  const allBoosters = ELEMENT_LUCK_BOOSTERS[dominantElement];
  const luckBoosters = allBoosters.slice(0, 2 + (seed % 2));

  // 공간 데이터
  const luckyColorKey = LUCKY_COLORS[seed % LUCKY_COLORS.length];
  const elementData = ELEMENT_LUCKY_DATA[dominantElement];
  const luckyDir = elementData.directions[seed % elementData.directions.length];
  const deskItems = ELEMENT_DESK_ITEMS[dominantElement];

  const spatial: SpatialData = {
    luckyDirection: luckyDir,
    luckyDirectionAngle: DIRECTION_ANGLES[luckyDir] ?? 0,
    luckyColor: luckyColorKey,
    luckyColorHex: COLOR_HEX[luckyColorKey] ?? '#F59E0B',
    deskItems: deskItems.slice(0, 3),
  };

  // MBTI 시너지 (결핍 오행 보완)
  const mbtiData = ELEMENT_MBTI_SYNERGY[deficientElement];
  const synergy: SynergyData = {
    mbtiType: mbtiData.mbti,
    mbtiDescription: mbtiData.desc,
    reason: mbtiData.reason,
    compatibility: mbtiData.compat,
  };

  return {
    date: dateStr,
    tenGod,
    score,
    summary: fortuneData.summary,
    detail: fortuneData.details[detailIndex],
    luckyColor: luckyColorKey,
    luckyFood: LUCKY_FOODS[seed % LUCKY_FOODS.length],
    luckyItem: LUCKY_ITEMS[seed % LUCKY_ITEMS.length],
    direction: DIRECTIONS[seed % DIRECTIONS.length],
    extended: {
      elementBalance,
      decisionMatrix,
      timeline,
      cautions,
      luckBoosters,
      spatial,
      synergy,
      energyKeyword: TENGOD_ENERGY_KEYWORDS[tenGod],
      overallEnergy: TENGOD_OVERALL_ENERGY[tenGod],
    },
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
    '金': { generates: '水', overcomes: '木' },
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
