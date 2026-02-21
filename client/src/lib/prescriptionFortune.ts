import { DailyFortuneResult } from "./dailyFortune";

export interface PrescriptionFortune {
  score: number;
  status: string; // "왕대박", "길", "평범", "주의"
  oneLiner: string; // 페르소나별 한 줄 처방
  keywords: string[]; // 3개의 핵심 키워드
  luckyAction: string; // 하면 좋은 행동
  warningAction: string; // 조심할 행동
  goldenTimeStart: number; // 시작 시간 (0-23)
  goldenTimeEnd: number; // 종료 시간 (0-23)
  recommendedFood: string; // 추천 음식
  foodReason: string; // 음식 추천 이유
  socialTip: string; // 사회생활 처세술
  missions: string[]; // 3개의 액운 방지 미션
  deepAnalysis: {
    money: string; // 용돈과 돈의 흐름
    love: string; // 친구와 사랑
    work: string; // 공부와 직장
    health: string; // 건강
  };
}

// 페르소나 타입 정의
type Persona = "young_female" | "middle_male" | "senior_female";

function getPersona(gender: string, age?: number): Persona {
  if (gender === "female") {
    if (!age || age < 35) return "young_female";
    return "senior_female";
  }
  return "middle_male";
}

function getOneLiner(persona: Persona, score: number): string {
  const templates = {
    young_female: [
      "오늘은 당신의 매력이 빛나는 날이에요! 자신감 있게 행동해 보세요.",
      "새로운 기회가 찾아오는 날이에요. 용감하게 도전해 보세요.",
      "오늘 하루는 당신이 주인공이에요. 자신감을 잃지 마세요.",
      "친구들이 당신을 찾는 날이에요. 따뜻한 마음으로 대해 주세요.",
    ],
    middle_male: [
      "오늘은 결단력이 필요한 날입니다. 신중하게 판단하고 행동하세요.",
      "새로운 계획을 세우기 좋은 날입니다. 목표를 명확히 하세요.",
      "오늘 당신의 의견이 빛날 날입니다. 자신의 생각을 표현하세요.",
      "팀 활동이 잘 되는 날입니다. 리더십을 발휘해 보세요.",
    ],
    senior_female: [
      "오늘은 지혜가 필요한 날입니다. 경험을 바탕으로 판단하세요.",
      "주변 사람들이 당신을 필요로 하는 날입니다. 따뜻한 조언을 나눠 주세요.",
      "오늘은 휴식과 명상이 좋은 날입니다. 마음을 정리해 보세요.",
      "가족과 함께 시간을 보내기 좋은 날입니다. 사랑을 나눠 보세요.",
    ],
  };

  const list = templates[persona];
  return list[Math.floor(Math.random() * list.length)];
}

function getKeywords(persona: Persona): string[] {
  const templates = {
    young_female: [
      ["자신감", "행운", "인기폭발"],
      ["새로운기회", "도전정신", "매력"],
      ["긍정에너지", "성공", "행복"],
    ],
    middle_male: [
      ["리더십", "성과", "성공"],
      ["전략", "판단력", "결정"],
      ["비즈니스", "기회", "성장"],
    ],
    senior_female: [
      ["지혜", "평온", "조화"],
      ["가족", "사랑", "안정"],
      ["경험", "성숙", "행복"],
    ],
  };

  const list = templates[persona];
  return list[Math.floor(Math.random() * list.length)];
}

function getLuckyAction(persona: Persona): string {
  const templates = {
    young_female: [
      "새로운 계획 세우기, 친구들과 함께 시간 보내기",
      "자신의 의견을 당당하게 말하기, 새로운 사람 만나기",
      "도전적인 일에 참여하기, 긍정적인 생각 유지하기",
    ],
    middle_male: [
      "중요한 결정 내리기, 팀 활동 주도하기",
      "새로운 프로젝트 시작하기, 동료들과 소통하기",
      "목표 설정하기, 전략 수립하기",
    ],
    senior_female: [
      "가족과 함께 시간 보내기, 따뜻한 조언 나누기",
      "명상이나 휴식 취하기, 마음 정리하기",
      "주변 사람들을 돌보기, 경험 나누기",
    ],
  };

  const list = templates[persona];
  return list[Math.floor(Math.random() * list.length)];
}

function getWarningAction(persona: Persona): string {
  const templates = {
    young_female: [
      "혼자만의 고집 피우기, 다른 사람 말 무시하기",
      "무리한 결정 내리기, 감정적으로 행동하기",
      "부정적인 생각 하기, 포기하기",
    ],
    middle_male: [
      "과도한 자신감, 동료의 의견 무시하기",
      "성급한 결정, 계획 없이 행동하기",
      "과도한 경쟁 의식, 독단적인 판단",
    ],
    senior_female: [
      "과도한 걱정, 부정적인 생각",
      "무리한 활동, 충분한 휴식 취하지 않기",
      "고집 부리기, 다른 의견 거부하기",
    ],
  };

  const list = templates[persona];
  return list[Math.floor(Math.random() * list.length)];
}

function getRecommendedFood(): { food: string; reason: string } {
  const foods = [
    { food: "소고기 무국", reason: "기운을 돋워줘서 몸에 에너지가 생겨요." },
    { food: "팥죽", reason: "나쁜 기운을 없애고 마음을 편하게 해줘요." },
    { food: "닭계탕", reason: "따뜻한 기운으로 몸을 보해줘요." },
    { food: "미역국", reason: "깨끗한 기운으로 몸을 정화해줘요." },
    { food: "삼계탕", reason: "원기를 회복시켜주고 활력을 줘요." },
    { food: "된장찌개", reason: "안정적인 기운으로 마음을 진정시켜줘요." },
  ];

  return foods[Math.floor(Math.random() * foods.length)];
}

function getSocialTip(persona: Persona): string {
  const templates = {
    young_female: [
      "오늘은 친구의 말을 잘 들어주는 것만으로도 행운이 찾아와요.",
      "상대방의 감정을 이해하려는 노력이 좋은 결과를 만들어요.",
      "따뜻한 말 한 마디가 누군가의 하루를 바꿀 수 있어요.",
    ],
    middle_male: [
      "오늘은 팀의 의견을 존중하고 함께 나아가는 것이 중요해요.",
      "상대방의 입장에서 생각하면 더 좋은 결과가 나와요.",
      "명확한 소통이 모든 문제를 해결해요.",
    ],
    senior_female: [
      "오늘은 경험에서 나온 조언이 누군가에게 큰 도움이 될 거예요.",
      "따뜻한 마음이 모든 관계를 좋게 만들어요.",
      "여유 있는 태도가 주변 사람들을 편하게 해줘요.",
    ],
  };

  const list = templates[persona];
  return list[Math.floor(Math.random() * list.length)];
}

function getMissions(): string[] {
  const missions = [
    "아침에 일어나서 기지개 크게 켜기 ☀️",
    "거울 보고 환하게 한 번 웃어주기 😊",
    "부모님이나 친구에게 고맙다고 말하기 💖",
    "오늘 하루 긍정적인 생각 유지하기 ✨",
    "누군가에게 따뜻한 말 건네기 🌟",
    "좋은 일 하나 찾아서 실천하기 🙏",
  ];

  // 랜덤하게 3개 선택
  const shuffled = missions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

function getDeepAnalysis(persona: Persona, score: number): PrescriptionFortune["deepAnalysis"] {
  const analyses = {
    young_female: {
      money: "이 시기는 작은 용돈이 생길 수 있는 좋은 기회예요. 주변을 잘 살펴보고 새로운 기회를 놓치지 마세요. 돈을 쓸 때는 신중하되, 자신에게 투자하는 것도 좋은 시기입니다.",
      love: "친구들과의 관계가 더욱 돈독해지는 시기입니다. 새로운 인간관계도 만들어질 수 있으니 긍정적인 마음으로 사람들을 만나세요. 누군가의 마음을 얻을 수 있는 좋은 기회가 있을 거예요.",
      work: "공부나 일에 집중하기 좋은 시기입니다. 머리가 맑아지고 창의력이 발휘되는 때이니 중요한 과제나 프로젝트를 시작하기 좋습니다. 자신의 능력을 충분히 발휘할 수 있을 거예요.",
      health: "신체와 정신이 모두 건강한 시기입니다. 충분한 수면과 운동으로 이 좋은 기운을 유지하세요. 스트레스를 받으면 산책이나 명상으로 마음을 진정시키는 것이 좋습니다.",
    },
    middle_male: {
      money: "사업이나 투자에 좋은 시기입니다. 신중한 판단과 전략적인 접근이 필요합니다. 큰 결정을 내릴 때는 충분히 검토하고 전문가의 조언을 구하는 것이 좋습니다.",
      love: "대인관계가 원만해지는 시기입니다. 동료나 상사와의 관계가 좋아질 수 있으니 이 기회를 잘 활용하세요. 가족과의 시간도 소중하게 여기는 것이 중요합니다.",
      work: "업무에서 성과를 낼 수 있는 좋은 시기입니다. 리더십을 발휘하고 팀을 이끌 수 있는 에너지가 충분합니다. 새로운 프로젝트나 도전에 적극적으로 참여하세요.",
      health: "신체 건강은 좋지만 정신적 스트레스에 주의가 필요합니다. 충분한 휴식과 운동으로 균형을 유지하세요. 과로하지 않도록 주의하고 정기적인 건강검진을 받는 것이 좋습니다.",
    },
    senior_female: {
      money: "안정적인 재정 상황이 유지되는 시기입니다. 무리한 투자보다는 안전한 저축을 추천합니다. 가족을 위한 투자는 좋은 결과를 가져올 수 있습니다.",
      love: "가족 관계가 더욱 돈독해지는 시기입니다. 자녀나 손주와의 시간을 소중하게 여기세요. 주변 사람들의 신뢰와 존경을 받을 수 있는 좋은 기간입니다.",
      work: "경험과 지혜가 빛나는 시기입니다. 후배나 후진을 지도하고 조언하는 것이 좋은 결과를 만듭니다. 여유 있는 마음으로 일을 진행하세요.",
      health: "신체적으로 안정적인 시기이지만 정기적인 건강관리가 필요합니다. 충분한 휴식과 가벼운 운동을 꾸준히 하세요. 마음의 평온을 유지하는 것이 가장 중요합니다.",
    },
  };

  return analyses[persona];
}

export function generatePrescriptionFortune(
  basicFortune: DailyFortuneResult,
  gender: string,
  age?: number
): PrescriptionFortune {
  const persona = getPersona(gender, age);
  const score = Math.min(Math.max(basicFortune.score, 0), 100);
  
  // 점수에 따른 상태 결정
  let status = "평범";
  if (score >= 80) status = "왕대박 👍";
  else if (score >= 60) status = "길 ✨";
  else if (score >= 40) status = "평범 😐";
  else status = "주의 ⚠️";

  const { food, reason } = getRecommendedFood();
  const goldenTimeStartValue = Math.floor(Math.random() * 22) + 1; // 1~22시
  const goldenTimeEndValue = goldenTimeStartValue + 1;

  return {
    score,
    status,
    oneLiner: getOneLiner(persona, score),
    keywords: getKeywords(persona),
    luckyAction: getLuckyAction(persona),
    warningAction: getWarningAction(persona),
    goldenTimeStart: goldenTimeStartValue,
    goldenTimeEnd: goldenTimeEndValue,
    recommendedFood: food,
    foodReason: reason,
    socialTip: getSocialTip(persona),
    missions: getMissions(),
    deepAnalysis: getDeepAnalysis(persona, score),
  };
}
