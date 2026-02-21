import { calculateSaju, HeavenlyStem, STEM_ELEMENTS, FIVE_ELEMENTS, FiveElement } from "./saju";
import { DailyFortuneResult } from "./dailyFortune";

export interface ExtendedDailyFortuneResult extends DailyFortuneResult {
  status: "대길" | "길" | "평범" | "주의";
  oneLiner: string;
  keywords: string[];
  luckyAction: string;
  warningAction: string;
  goldenTime: {
    startHour: number;
    endHour: number;
    description: string;
  };
  foodReason: string;
  socialTip: string;
  missions: {
    id: string;
    text: string;
    emoji: string;
  }[];
  deepAnalysis: {
    wealth: string;
    love: string;
    career: string;
    health: string;
  };
}

export type PersonaType = "young_female" | "mid_male" | "senior_female" | "default";

// 나이 계산 함수
function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// 페르소나 결정 함수
function determinePersona(birthDate: Date, gender: "male" | "female"): PersonaType {
  const age = calculateAge(birthDate);
  
  if (gender === "female" && age >= 20 && age < 35) return "young_female";
  if (gender === "male" && age >= 30 && age < 50) return "mid_male";
  if (gender === "female" && age >= 50) return "senior_female";
  return "default";
}

// 운세 점수에 따른 상태 결정
function getStatus(score: number): "대길" | "길" | "평범" | "주의" {
  if (score >= 85) return "대길";
  if (score >= 70) return "길";
  if (score >= 55) return "평범";
  return "주의";
}

// 페르소나별 한 줄 평 생성
function generateOneLiner(score: number, status: string, persona: PersonaType, dayMaster: HeavenlyStem): string {
  const templates: Record<PersonaType, Record<string, string>> = {
    young_female: {
      "대길": "오늘은 모든 것이 잘 풀리는 날! 자신감 있게 도전해보세요.",
      "길": "오늘 하루는 긍정적인 에너지로 가득해요. 새로운 시도를 해볼 좋은 날이에요.",
      "평범": "특별한 일은 없겠지만, 일상 속 소소한 행복을 찾아보세요.",
      "주의": "오늘은 신중함이 필요한 날이에요. 서두르지 말고 천천히 진행하세요."
    },
    mid_male: {
      "대길": "최고의 운세를 받은 날입니다. 중요한 결정을 내리기에 적합합니다.",
      "길": "긍정적인 기운이 흐르는 날입니다. 계획하던 일을 추진하세요.",
      "평범": "평범한 흐름의 하루입니다. 일상적인 업무에 충실하세요.",
      "주의": "신중한 판단이 요구되는 날입니다. 충동적인 결정은 피하세요."
    },
    senior_female: {
      "대길": "오늘은 복이 가득한 날입니다. 주변 사람들과 함께 기쁨을 나누세요.",
      "길": "따뜻한 기운이 흐르는 하루입니다. 가족과 함께하는 시간을 소중히 하세요.",
      "평범": "평화로운 하루가 될 것 같습니다. 건강하고 안정적인 하루를 보내세요.",
      "주의": "오늘은 여유를 가지고 신중하게 행동하세요. 휴식도 중요합니다."
    },
    default: {
      "대길": "오늘은 매우 좋은 운세를 받은 날입니다.",
      "길": "오늘은 긍정적인 기운이 흐르는 날입니다.",
      "평범": "오늘은 평범한 흐름의 하루입니다.",
      "주의": "오늘은 신중함이 필요한 날입니다."
    }
  };
  
  return templates[persona][status] || templates.default[status];
}

// 핵심 키워드 3개 생성
function generateKeywords(score: number, tenGod: string, dayMaster: HeavenlyStem): string[] {
  const keywordPool: Record<string, string[]> = {
    "비견": ["자신감", "주도권", "도전"],
    "겁재": ["변화", "경쟁", "성장"],
    "식신": ["창의성", "즐거움", "표현"],
    "상관": ["재능", "혁신", "소통"],
    "편재": ["기회", "행운", "활동"],
    "정재": ["안정", "성실", "축적"],
    "편관": ["도전", "책임", "성취"],
    "정관": ["신뢰", "질서", "성공"],
    "편인": ["지혜", "통찰", "독립"],
    "정인": ["도움", "배움", "따뜻함"
  };
  
  const baseKeywords = keywordPool[tenGod] || ["운세", "기운", "변화"];
  
  if (score >= 85) {
    return [...baseKeywords.slice(0, 2), "대길"];
  } else if (score >= 70) {
    return [...baseKeywords.slice(0, 2), "길운"];
  } else if (score >= 55) {
    return [...baseKeywords.slice(0, 2), "평온"];
  } else {
    return [...baseKeywords.slice(0, 2), "신중"];
  }
}

// 오늘 하면 좋은 것 / 피해야 할 것
function generateActions(tenGod: string, dayMasterElement: FiveElement): { lucky: string; warning: string } {
  const actionMap: Record<string, { lucky: string; warning: string }> = {
    "비견": {
      lucky: "새로운 프로젝트 시작, 팀 활동, 주도적 역할",
      warning: "혼자만의 고집, 타인의 의견 무시"
    },
    "겁재": {
      lucky: "친구 만남, 경쟁 참여, 변화 시도",
      warning: "과도한 지출, 무분별한 투자"
    },
    "식신": {
      lucky: "창의적 활동, 예술 작업, 즐거운 모임",
      warning: "무분별한 소비, 과식"
    },
    "상관": {
      lucky: "표현 활동, 발표, 창의적 도전",
      warning: "감정 표출, 과도한 비판"
    },
    "편재": {
      lucky: "투자, 새로운 사업, 야외 활동",
      warning: "무모한 투자, 과도한 위험 감수"
    },
    "정재": {
      lucky: "재무 계획, 저축, 안정적 활동",
      warning: "무리한 지출, 투기"
    },
    "편관": {
      lucky: "어려운 과제 도전, 리더십 발휘",
      warning: "과로, 무리한 일정"
    },
    "정관": {
      lucky: "공식 업무, 계약, 행정 처리",
      warning: "규칙 위반, 부정직한 행동"
    },
    "편인": {
      lucky: "학습, 연구, 깊은 생각",
      warning: "고집스러운 태도, 현실 도피"
    },
    "정인": {
      lucky: "배움, 도움 요청, 따뜻한 관계",
      warning: "의존성, 책임 회피"
    }
  };
  
  return actionMap[tenGod] || { lucky: "긍정적인 활동", warning: "부정적인 행동" };
}

// 골든 타임 생성
function generateGoldenTime(dayMasterElement: FiveElement, score: number): { startHour: number; endHour: number; description: string } {
  const elementTimeMap: Record<FiveElement, number[]> = {
    "木": [3, 4], // 인묘시 (새벽 3~5시, 오전 5~7시)
    "火": [11, 12], // 오미시 (오전 11시~오후 1시)
    "土": [13, 14], // 미시 (오후 1~3시)
    "金": [17, 18], // 유시 (오후 5~7시)
    "水": [23, 0] // 자시 (밤 11시~새벽 1시)
  };
  
  const times = elementTimeMap[dayMasterElement] || [12, 13];
  const startHour = times[0];
  const endHour = times[1];
  
  const descriptions: Record<FiveElement, string> = {
    "木": "새로운 시작과 성장의 기운이 가장 강한 시간",
    "火": "열정과 활동성이 최고조에 달하는 시간",
    "土": "안정과 신뢰가 가장 잘 전달되는 시간",
    "金": "결단과 실행력이 가장 강한 시간",
    "水": "지혜와 통찰력이 가장 예리한 시간"
  };
  
  return {
    startHour,
    endHour,
    description: descriptions[dayMasterElement] || "기운이 가장 좋은 시간"
  };
}

// 음식 추천 및 이유
function generateFoodRecommendation(dayMasterElement: FiveElement, persona: PersonaType): { food: string; reason: string } {
  const foodMap: Record<FiveElement, Record<PersonaType, { food: string; reason: string }>> = {
    "木": {
      young_female: { food: "시금치 무침", reason: "목의 기운을 보충해주고 신진대사를 활발하게 해요." },
      mid_male: { food: "브로콜리", reason: "목의 기운을 강화하고 체력을 보충하는 데 도움이 됩니다." },
      senior_female: { food: "미역국", reason: "목의 기운을 보충하고 건강을 지켜주는 음식이에요." },
      default: { food: "녹색 채소", reason: "목의 기운을 보충해줍니다." }
    },
    "火": {
      young_female: { food: "딸기", reason: "화의 기운을 활성화하고 에너지를 높여줘요." },
      mid_male: { food: "소고기", reason: "화의 기운을 강화하고 활력을 주는 음식입니다." },
      senior_female: { food: "팥죽", reason: "화의 기운을 보충하고 따뜻함을 더해주는 음식이에요." },
      default: { food: "빨간 음식", reason: "화의 기운을 활성화해줍니다." }
    },
    "土": {
      young_female: { food: "고구마", reason: "토의 기운을 안정화하고 소화를 돕는 음식이에요." },
      mid_male: { food: "현미밥", reason: "토의 기운을 강화하고 안정감을 주는 음식입니다." },
      senior_female: { food: "옥수수", reason: "토의 기운을 보충하고 건강을 지켜주는 음식이에요." },
      default: { food: "노란 음식", reason: "토의 기운을 안정화해줍니다." }
    },
    "金": {
      young_female: { food: "배", reason: "금의 기운을 맑게 해주고 호흡기를 건강하게 해요." },
      mid_male: { food: "흰살 생선", reason: "금의 기운을 강화하고 정신을 맑게 하는 음식입니다." },
      senior_female: { food: "우유", reason: "금의 기운을 보충하고 뼈 건강을 지켜주는 음식이에요." },
      default: { food: "흰색 음식", reason: "금의 기운을 맑게 해줍니다." }
    },
    "水": {
      young_female: { food: "검은콩", reason: "수의 기운을 깊게 해주고 신장 건강을 돕는 음식이에요." },
      mid_male: { food: "굴", reason: "수의 기운을 강화하고 정력을 주는 음식입니다." },
      senior_female: { food: "검은깨", reason: "수의 기운을 보충하고 노화를 방지하는 음식이에요." },
      default: { food: "검은색 음식", reason: "수의 기운을 깊게 해줍니다." }
    }
  };
  
  const element = dayMasterElement;
  const personaFood = foodMap[element]?.[persona] || foodMap[element]?.default;
  return personaFood || { food: "건강한 음식", reason: "기운을 보충해줍니다." };
}

// 사회생활 처세술
function generateSocialTip(persona: PersonaType, score: number): string {
  const tips: Record<PersonaType, Record<string, string>> = {
    young_female: {
      high: "오늘은 당신의 매력이 빛나는 날이에요. 새로운 사람들과의 만남을 두려워하지 말고 자신감 있게 다가가보세요.",
      mid: "오늘은 경청과 공감이 중요한 날이에요. 상대방의 말에 귀 기울이면 좋은 관계를 만들 수 있어요.",
      low: "오늘은 신중한 태도가 필요해요. 말보다는 듣는 것에 집중하고, 급하게 판단하지 않으세요."
    },
    mid_male: {
      high: "오늘은 리더십을 발휘하기 좋은 날입니다. 자신감 있게 의견을 제시하고 주도적으로 나아가세요.",
      mid: "오늘은 균형 잡힌 태도가 필요합니다. 자신의 의견을 표현하되, 상대방의 의견도 존중하세요.",
      low: "오늘은 신중한 판단이 필요합니다. 성급한 결정은 피하고, 신뢰할 수 있는 사람들과 상담하세요."
    },
    senior_female: {
      high: "오늘은 당신의 지혜가 빛나는 날이에요. 주변 사람들에게 따뜻한 조언과 격려를 나누어주세요.",
      mid: "오늘은 경험을 나누는 것이 좋은 날이에요. 당신의 인생 경험이 누군가에게 큰 도움이 될 수 있어요.",
      low: "오늘은 여유를 가지고 주변을 살피는 것이 좋아요. 급하지 않게 천천히 관계를 돌보세요."
    },
    default: {
      high: "오늘은 긍정적인 에너지로 사람들과 만나세요.",
      mid: "오늘은 균형 잡힌 태도로 관계를 유지하세요.",
      low: "오늘은 신중한 태도로 행동하세요."
    }
  };
  
  const level = score >= 80 ? "high" : score >= 60 ? "mid" : "low";
  return tips[persona][level] || tips.default[level];
}

// 액운 방지 미션
function generateMissions(persona: PersonaType): { id: string; text: string; emoji: string }[] {
  const missions: Record<PersonaType, { id: string; text: string; emoji: string }[]> = {
    young_female: [
      { id: "m1", text: "오늘 하루 긍정적인 생각 유지하기", emoji: "✨" },
      { id: "m2", text: "한 명 이상에게 따뜻한 말 건네기", emoji: "💬" },
      { id: "m3", text: "30분 이상 야외에서 시간 보내기", emoji: "🌳" }
    ],
    mid_male: [
      { id: "m1", text: "중요한 결정 미루지 않기", emoji: "⚡" },
      { id: "m2", text: "동료와 의견 나누기", emoji: "🤝" },
      { id: "m3", text: "운동이나 산책 30분 하기", emoji: "🏃" }
    ],
    senior_female: [
      { id: "m1", text: "가족에게 따뜻한 말 전하기", emoji: "❤️" },
      { id: "m2", text: "건강한 음식 챙겨 먹기", emoji: "🍲" },
      { id: "m3", text: "명상이나 휴식 시간 가지기", emoji: "🧘" }
    ],
    default: [
      { id: "m1", text: "긍정적인 마음 유지하기", emoji: "😊" },
      { id: "m2", text: "좋은 사람과 시간 보내기", emoji: "👥" },
      { id: "m3", text: "건강한 생활 습관 지키기", emoji: "💪" }
    ]
  };
  
  return missions[persona] || missions.default;
}

// 심층 분석 생성 (800자 이상)
function generateDeepAnalysis(
  tenGod: string,
  dayMasterElement: FiveElement,
  score: number,
  persona: PersonaType
): { wealth: string; love: string; career: string; health: string } {
  const baseAnalysis = `오늘의 십신은 ${tenGod}이며, 일간의 오행은 ${dayMasterElement}입니다. 이는 당신의 오늘 하루 운세에 중요한 영향을 미칩니다.`;
  
  const wealthAnalyses: Record<string, string> = {
    "비견": "비견의 기운이 강한 날입니다. 재정 운은 평온하지만, 예상치 못한 지출이 생길 수 있으니 주의하세요. 큰 투자나 거래는 신중하게 진행하고, 기존의 자산을 안정적으로 관리하는 것이 좋습니다. 친구나 동료와의 금전 거래는 명확한 합의 하에 진행하세요.",
    "겁재": "겁재의 기운이 작용하는 날입니다. 재정 운이 불안정할 수 있으니 충동적인 소비를 피하세요. 투자나 새로운 사업 진출은 충분한 검토 후 진행하고, 기존의 재산을 지키는 데 집중하세요. 예상치 못한 지출이 생길 수 있으니 비상금을 확보해두는 것이 좋습니다.",
    "식신": "식신의 길한 기운이 흐르는 날입니다. 재정 운이 좋아서 예상치 못한 수입이 들어올 수 있습니다. 하지만 즐거움에 취해 과소비하지 않도록 주의하세요. 이 시기에 얻은 수입을 현명하게 관리하면 장기적인 재정 안정을 이룰 수 있습니다.",
    "상관": "상관의 기운이 작용하는 날입니다. 창의적인 활동을 통해 추가 수입의 기회가 생길 수 있습니다. 새로운 사업 아이디어나 프로젝트를 추진하기에 좋은 날이지만, 무모한 투자는 피하세요. 신중한 계획과 실행이 성공의 열쇠입니다.",
    "편재": "편재의 길한 기운이 강한 날입니다. 예상치 못한 재물운이 따를 수 있으니 새로운 기회에 주목하세요. 투자나 사업 진출도 유리한 시기이지만, 과도한 욕심은 금물입니다. 기회를 잡되, 항상 위험 관리를 우선으로 생각하세요.",
    "정재": "정재의 안정적인 기운이 흐르는 날입니다. 꾸준한 노력과 성실함이 재정 운을 높여줍니다. 큰 변화보다는 기존의 계획을 차근차근 실행하는 것이 좋습니다. 저축과 투자 계획을 세우기에 좋은 날이며, 장기적인 재정 목표를 설정하세요.",
    "편관": "편관의 기운이 작용하는 날입니다. 재정 운에 변동이 있을 수 있으니 신중한 판단이 필요합니다. 중요한 금전 거래나 계약은 충분한 검토 후 진행하고, 법적 문제가 없는지 확인하세요. 이 시기에는 기존의 자산을 지키는 것에 집중하세요.",
    "정관": "정관의 길한 기운이 흐르는 날입니다. 신뢰할 수 있는 금융 상품이나 투자 기회가 나타날 수 있습니다. 공식적인 금융 거래나 계약을 진행하기에 좋은 날이며, 신뢰성 있는 파트너와의 협력도 유리합니다. 장기적인 재정 계획을 세우기에 적합한 시기입니다.",
    "편인": "편인의 기운이 작용하는 날입니다. 재정 운은 평온하지만, 예상치 못한 상황이 발생할 수 있으니 주의하세요. 새로운 정보나 기회에 주목하되, 충분한 검토 후 결정하세요. 전문가의 조언을 구하는 것도 좋은 방법입니다.",
    "정인": "정인의 길한 기운이 흐르는 날입니다. 신뢰할 수 있는 사람들로부터 도움이나 조언을 받을 수 있습니다. 재정 운은 안정적이며, 기존의 계획을 실행하기에 좋은 날입니다. 주변 사람들과의 협력을 통해 재정 목표를 달성할 수 있습니다."
  };
  
  const loveAnalyses: Record<string, string> = {
    "비견": "비견의 기운이 강한 날입니다. 연인이 있다면 자신감 있게 마음을 표현하세요. 새로운 만남을 기대하는 분이라면 자신의 매력을 드러낼 좋은 기회입니다. 다만, 상대방의 의견도 존중하고 일방적인 주장은 피하세요. 진정한 소통이 관계를 깊게 만듭니다.",
    "겁재": "겁재의 기운이 작용하는 날입니다. 관계에 변화나 도전이 있을 수 있습니다. 연인과의 관계에서 작은 마찰이 생길 수 있으니 차분한 대화를 통해 해결하세요. 새로운 만남을 기대하는 분이라면 너무 서두르지 말고 천천히 관계를 발전시키세요.",
    "식신": "식신의 길한 기운이 흐르는 날입니다. 애정 운이 매우 좋아서 연인과의 관계가 더욱 돈독해질 수 있습니다. 새로운 만남도 기대할 수 있는 시기입니다. 따뜻한 말과 행동으로 상대방의 마음을 얻으세요.",
    "상관": "상관의 기운이 작용하는 날입니다. 표현력이 좋아져서 자신의 감정을 잘 전달할 수 있습니다. 연인에게 솔직한 마음을 표현하거나, 새로운 사람과의 대화를 통해 좋은 인상을 남길 수 있습니다. 다만, 감정이 과하지 않도록 조절하세요.",
    "편재": "편재의 기운이 작용하는 날입니다. 새로운 만남의 기회가 생길 수 있습니다. 야외 활동이나 사교 모임에 참여하면 좋은 인연을 만날 수 있습니다. 연인이 있다면 함께 새로운 경험을 해보세요. 관계에 신선함을 더할 수 있는 시간입니다.",
    "정재": "정재의 안정적인 기운이 흐르는 날입니다. 애정 운은 평온하고 안정적입니다. 연인과의 관계를 더욱 깊게 다질 수 있는 시기입니다. 차분한 대화와 진정성 있는 행동으로 관계를 발전시키세요.",
    "편관": "편관의 기운이 작용하는 날입니다. 관계에 긴장이 흐를 수 있습니다. 연인과의 관계에서 작은 충돌이 있을 수 있으니 침착함을 유지하세요. 새로운 만남을 기대하는 분이라면 너무 적극적이지 않은 태도가 좋습니다.",
    "정관": "정관의 길한 기운이 흐르는 날입니다. 신뢰와 안정감이 중요한 시기입니다. 연인과의 관계에서 진정성 있는 태도를 유지하세요. 새로운 만남도 신뢰할 수 있는 사람과의 인연이 생길 가능성이 높습니다.",
    "편인": "편인의 기운이 작용하는 날입니다. 애정 운은 평온하지만, 혼자만의 생각에 빠질 수 있습니다. 연인이나 새로운 사람과의 만남에서 적극적으로 마음을 열어보세요. 깊은 대화를 통해 관계를 발전시킬 수 있습니다.",
    "정인": "정인의 길한 기운이 흐르는 날입니다. 따뜻한 감정이 흐르는 시기입니다. 연인과의 관계에서 서로를 돌보고 배려하는 마음이 중요합니다. 새로운 만남도 따뜻하고 편안한 분위기에서 이루어질 가능성이 높습니다."
  };
  
  const careerAnalyses: Record<string, string> = {
    "비견": "비견의 기운이 강한 날입니다. 업무에서 주도적인 역할을 할 수 있는 시기입니다. 자신감 있게 의견을 제시하고 새로운 프로젝트를 추진하세요. 팀 내에서 리더십을 발휘할 수 있는 좋은 기회입니다. 다만, 동료들의 의견도 존중하고 협력하는 자세를 잊지 마세요.",
    "겁재": "겁재의 기운이 작용하는 날입니다. 업무에서 경쟁이나 도전이 있을 수 있습니다. 새로운 과제에 적극적으로 대처하되, 무리한 일정은 피하세요. 동료와의 관계에서도 건설적인 태도를 유지하세요. 이 시기의 도전이 당신을 더욱 성장시킬 것입니다.",
    "식신": "식신의 길한 기운이 흐르는 날입니다. 창의적인 아이디어가 나오는 시기입니다. 새로운 프로젝트나 기획 업무에서 좋은 성과를 낼 수 있습니다. 동료들과의 협력도 원활하고, 긍정적인 분위기가 조성됩니다.",
    "상관": "상관의 기운이 작용하는 날입니다. 표현력과 소통 능력이 뛰어난 시기입니다. 발표나 미팅에서 자신의 의견을 효과적으로 전달할 수 있습니다. 새로운 기회나 제안이 들어올 수 있으니 주목하세요.",
    "편재": "편재의 기운이 작용하는 날입니다. 새로운 기회나 프로젝트가 나타날 수 있습니다. 야외 활동이나 영업 업무에 유리한 시기입니다. 새로운 인맥을 만들고 비즈니스 관계를 확대할 수 있는 좋은 기회입니다.",
    "정재": "정재의 안정적인 기운이 흐르는 날입니다. 꾸준한 노력이 인정받는 시기입니다. 기존의 업무를 충실하게 수행하고, 성실한 태도를 유지하세요. 승진이나 보상의 기회가 생길 수 있습니다.",
    "편관": "편관의 기운이 작용하는 날입니다. 업무에서 책임감 있는 역할이 주어질 수 있습니다. 어려운 과제도 자신감 있게 대처하세요. 이 시기의 경험이 당신의 커리어 발전에 큰 도움이 될 것입니다.",
    "정관": "정관의 길한 기운이 흐르는 날입니다. 신뢰와 신용이 중요한 시기입니다. 상사나 동료들로부터 신임을 얻을 수 있는 좋은 기회입니다. 성실하고 책임감 있는 태도로 업무를 진행하세요.",
    "편인": "편인의 기운이 작용하는 날입니다. 전문 지식이나 독특한 관점이 필요한 업무에 유리합니다. 깊이 있는 분석이나 연구 업무에 집중하세요. 새로운 정보나 기술을 습득할 수 있는 좋은 기회입니다.",
    "정인": "정인의 길한 기운이 흐르는 날입니다. 배움과 성장의 기회가 있는 시기입니다. 상사나 선배로부터 좋은 조언을 받을 수 있습니다. 새로운 기술이나 지식을 습득하기에 좋은 날입니다."
  };
  
  const healthAnalyses: Record<string, string> = {
    "비견": "비견의 기운이 강한 날입니다. 신체 에너지가 충만한 시기입니다. 규칙적인 운동과 건강한 식습관을 유지하세요. 과도한 활동으로 피로하지 않도록 주의하고, 충분한 휴식을 취하세요.",
    "겁재": "겁재의 기운이 작용하는 날입니다. 신체와 정신의 불안정이 있을 수 있습니다. 스트레스 관리가 중요한 시기입니다. 명상이나 요가 같은 이완 활동을 추천합니다.",
    "식신": "식신의 길한 기운이 흐르는 날입니다. 신체 건강이 좋은 시기입니다. 하지만 과식이나 과도한 활동은 피하세요. 균형 잡힌 식단과 적절한 운동을 유지하세요.",
    "상관": "상관의 기운이 작용하는 날입니다. 감정의 기복이 있을 수 있으니 정서 관리가 중요합니다. 충분한 수면과 휴식을 취하고, 스트레스를 해소하는 활동을 하세요.",
    "편재": "편재의 기운이 작용하는 날입니다. 활동적인 시기이므로 신체 활동을 충분히 하세요. 야외 활동이나 운동을 추천합니다. 다만, 무리한 활동은 피하고 안전에 주의하세요.",
    "정재": "정재의 안정적인 기운이 흐르는 날입니다. 건강이 안정적인 시기입니다. 규칙적인 생활 습관을 유지하고, 정기적인 건강 검진을 받으세요.",
    "편관": "편관의 기운이 작용하는 날입니다. 신체 긴장이 있을 수 있으니 이완에 집중하세요. 스트레칭이나 마사지 같은 활동이 도움이 됩니다.",
    "정관": "정관의 길한 기운이 흐르는 날입니다. 신체 건강이 좋은 시기입니다. 규칙적인 생활과 건강한 식습관을 유지하세요.",
    "편인": "편인의 기운이 작용하는 날입니다. 정신 건강이 중요한 시기입니다. 명상이나 독서 같은 정신 활동을 추천합니다.",
    "정인": "정인의 길한 기운이 흐르는 날입니다. 신체와 정신이 모두 안정적인 시기입니다. 건강한 생활 습관을 유지하세요."
  };
  
  return {
    wealth: wealthAnalyses[tenGod] || wealthAnalyses["정재"],
    love: loveAnalyses[tenGod] || loveAnalyses["정인"],
    career: careerAnalyses[tenGod] || careerAnalyses["정인"],
    health: healthAnalyses[tenGod] || healthAnalyses["정인"]
  };
}

// 메인 함수: 확장된 일간 운세 생성
export function getExtendedDailyFortune(
  userBirthDate: Date,
  gender: "male" | "female",
  basicFortune: DailyFortuneResult
): ExtendedDailyFortuneResult {
  const persona = determinePersona(userBirthDate, gender);
  const status = getStatus(basicFortune.score);
  
  // 사주 분석
  const userSaju = calculateSaju(userBirthDate, gender);
  const dayMasterElement = STEM_ELEMENTS[userSaju.dayPillar.stem];
  
  const oneLiner = generateOneLiner(basicFortune.score, status, persona, userSaju.dayPillar.stem);
  const keywords = generateKeywords(basicFortune.score, basicFortune.tenGod, userSaju.dayPillar.stem);
  const { lucky: luckyAction, warning: warningAction } = generateActions(basicFortune.tenGod, dayMasterElement);
  const goldenTime = generateGoldenTime(dayMasterElement, basicFortune.score);
  const { food: luckyFood, reason: foodReason } = generateFoodRecommendation(dayMasterElement, persona);
  const socialTip = generateSocialTip(persona, basicFortune.score);
  const missions = generateMissions(persona);
  const deepAnalysis = generateDeepAnalysis(basicFortune.tenGod, dayMasterElement, basicFortune.score, persona);
  
  return {
    ...basicFortune,
    status,
    oneLiner,
    keywords,
    luckyAction,
    warningAction,
    goldenTime,
    foodReason,
    socialTip,
    missions,
    deepAnalysis
  };
}
