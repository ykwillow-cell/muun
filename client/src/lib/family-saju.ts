import { SajuResult, STEM_ELEMENTS, BRANCH_ELEMENTS, calculateElementBalance } from "./saju";
import { STEM_PERSONALITY, ELEMENT_KOREAN, withReading, getElementRelation } from "./saju-reading";

export type FamilyRole = "나" | "아버지" | "어머니" | "아들" | "딸" | "할아버지" | "할머니" | "배우자" | "기타";

export interface FamilyMember {
  name: string;
  role: FamilyRole;
  gender: "male" | "female";
  birthDate: string;
  birthTime: string;
  birthTimeUnknown?: boolean;
  calendarType: "solar" | "lunar";
  isLeapMonth?: boolean;
  saju?: SajuResult;
}

// 오행 상생 관계
const GENERATING_PAIRS: [string, string][] = [
  ["木", "火"], ["火", "土"], ["土", "金"], ["金", "水"], ["水", "木"]
];

// 오행 상극 관계
const OVERCOMING_PAIRS: [string, string][] = [
  ["木", "土"], ["土", "水"], ["水", "火"], ["火", "金"], ["金", "木"]
];

function isGenerating(elem1: string, elem2: string): boolean {
  return GENERATING_PAIRS.some(([a, b]) => a === elem1 && b === elem2);
}

function isOvercoming(elem1: string, elem2: string): boolean {
  return OVERCOMING_PAIRS.some(([a, b]) => a === elem1 && b === elem2);
}

// 두 사람 간의 관계 점수 (0~100)
export function calculateRelationScore(saju1: SajuResult, saju2: SajuResult): number {
  const elem1 = STEM_ELEMENTS[saju1.dayPillar.stem];
  const elem2 = STEM_ELEMENTS[saju2.dayPillar.stem];

  let score = 60; // 기본 점수

  // 일간 오행 관계
  if (elem1 === elem2) score += 15; // 비화 (같은 오행)
  if (isGenerating(elem1, elem2) || isGenerating(elem2, elem1)) score += 20; // 상생
  if (isOvercoming(elem1, elem2) || isOvercoming(elem2, elem1)) score -= 10; // 상극

  // 음양 조화
  const yy1 = saju1.dayPillar.stem;
  const yy2 = saju2.dayPillar.stem;
  const YIN_YANG: Record<string, boolean> = {
    '甲': true, '乙': false, '丙': true, '丁': false, '戊': true,
    '己': false, '庚': true, '辛': false, '壬': true, '癸': false,
  };
  if (YIN_YANG[yy1] !== YIN_YANG[yy2]) score += 10; // 음양 조화

  // 오행 보완성
  const balance1 = calculateElementBalance(saju1);
  const balance2 = calculateElementBalance(saju2);
  const weak1 = balance1.reduce((min, cur) => cur.value < min.value ? cur : min);
  const strong2 = balance2.reduce((max, cur) => cur.value > max.value ? cur : max);
  if (weak1.name === strong2.name) score += 10; // 상대가 내 부족한 오행을 보완

  return Math.max(0, Math.min(100, score));
}

// 가족 전체 오행 분포 분석
export function analyzeFamilyElementBalance(members: FamilyMember[]): {
  distribution: { name: string; value: number; members: string[] }[];
  strongestElement: string;
  weakestElement: string;
  advice: string;
} {
  const elementMap: Record<string, { count: number; members: string[] }> = {
    '木': { count: 0, members: [] },
    '火': { count: 0, members: [] },
    '土': { count: 0, members: [] },
    '金': { count: 0, members: [] },
    '水': { count: 0, members: [] },
  };

  members.forEach(m => {
    if (!m.saju) return;
    const elem = STEM_ELEMENTS[m.saju.dayPillar.stem];
    if (!elem) return; // elem이 undefined면 스킵
    elementMap[elem].count++;
    elementMap[elem].members.push(m.name);
  });

  const distribution = Object.entries(elementMap).map(([name, data]) => ({
    name,
    value: data.count,
    members: data.members,
  }));

  const sorted = [...distribution].sort((a, b) => b.value - a.value);
  const strongestElement = sorted[0].name;
  const weakestElement = sorted[sorted.length - 1].name;

  const adviceMap: Record<string, string> = {
    '木': "가족 전체적으로 목(木)의 기운이 강합니다. 성장과 발전의 에너지가 넘치지만, 때로는 서로 자기주장이 강해 충돌할 수 있습니다. 가족 회의를 통해 서로의 의견을 존중하는 문화를 만들어보세요. 봄나들이나 숲 산책이 가족 화합에 좋습니다.",
    '火': "가족 전체적으로 화(火)의 기운이 강합니다. 열정적이고 활기찬 가정이지만, 감정적으로 격해질 수 있으니 서로 한 템포 쉬어가는 여유가 필요합니다. 가족 캠핑이나 바베큐 파티가 유대감을 높여줍니다.",
    '土': "가족 전체적으로 토(土)의 기운이 강합니다. 안정적이고 든든한 가정이지만, 변화를 두려워하는 경향이 있습니다. 새로운 경험을 함께 시도해보세요. 가족 여행이나 새로운 취미 활동이 좋습니다.",
    '金': "가족 전체적으로 금(金)의 기운이 강합니다. 원칙적이고 체계적인 가정이지만, 때로는 유연성이 부족할 수 있습니다. 가족 간 감정 표현을 더 자주 하고, 함께 웃을 수 있는 시간을 만들어보세요.",
    '水': "가족 전체적으로 수(水)의 기운이 강합니다. 지적이고 깊이 있는 가정이지만, 각자의 세계에 빠져 소통이 부족할 수 있습니다. 정기적인 가족 식사 시간을 정해 대화의 시간을 가져보세요.",
  };

  const weakAdviceMap: Record<string, string> = {
    '木': " 부족한 목(木)의 기운을 보완하려면 집에 초록 식물을 키우거나, 함께 등산이나 산책을 즐겨보세요.",
    '火': " 부족한 화(火)의 기운을 보완하려면 가족이 함께 요리하거나, 따뜻한 조명의 거실에서 대화하는 시간을 가져보세요.",
    '土': " 부족한 토(土)의 기운을 보완하려면 가족이 함께 텃밭을 가꾸거나, 정기적인 가족 모임을 만들어보세요.",
    '金': " 부족한 금(金)의 기운을 보완하려면 가족 규칙을 함께 정하거나, 악기 연주 등 예술 활동을 함께 해보세요.",
    '水': " 부족한 수(水)의 기운을 보완하려면 가족이 함께 독서하거나, 수영장이나 바다 여행을 계획해보세요.",
  };

  const advice = adviceMap[strongestElement] + (weakestElement !== strongestElement ? weakAdviceMap[weakestElement] : "");

  return { distribution, strongestElement, weakestElement, advice };
}

// 두 사람 간의 관계 해석 생성
export function generateRelationInterpretation(
  member1: FamilyMember,
  member2: FamilyMember,
): {
  score: number;
  title: string;
  description: string;
  advice: string;
} {
  if (!member1.saju || !member2.saju) {
    return { score: 0, title: "", description: "", advice: "" };
  }

  const score = calculateRelationScore(member1.saju, member2.saju);
  const elem1 = STEM_ELEMENTS[member1.saju.dayPillar.stem];
  const elem2 = STEM_ELEMENTS[member2.saju.dayPillar.stem];
  const elemKor1 = ELEMENT_KOREAN[elem1] || elem1;
  const elemKor2 = ELEMENT_KOREAN[elem2] || elem2;
  const stem1 = withReading(member1.saju.dayPillar.stem);
  const stem2 = withReading(member2.saju.dayPillar.stem);
  const personality1 = STEM_PERSONALITY[member1.saju.dayPillar.stem];
  const personality2 = STEM_PERSONALITY[member2.saju.dayPillar.stem];

  const roleRelation = getRoleRelation(member1.role, member2.role);

  let relationDesc = "";
  let advice = "";

  if (isGenerating(elem1, elem2)) {
    relationDesc = `${member1.name}님(${stem1}, ${elemKor1})의 기운이 ${member2.name}님(${stem2}, ${elemKor2})에게 자연스럽게 힘을 주는 상생(相生) 관계입니다. ${roleRelation}으로서 서로에게 긍정적인 영향을 주고받으며, ${member1.name}님이 ${member2.name}님의 성장을 돕는 역할을 합니다.`;
    advice = `이미 좋은 관계이니 현재의 소통 방식을 유지하세요. ${member1.name}님이 ${member2.name}님에게 격려와 응원을 보내면 더욱 좋은 시너지가 생깁니다.`;
  } else if (isGenerating(elem2, elem1)) {
    relationDesc = `${member2.name}님(${stem2}, ${elemKor2})의 기운이 ${member1.name}님(${stem1}, ${elemKor1})에게 자연스럽게 힘을 주는 상생(相生) 관계입니다. ${roleRelation}으로서 ${member2.name}님이 ${member1.name}님에게 든든한 지원군이 됩니다.`;
    advice = `${member2.name}님의 조언과 도움을 열린 마음으로 받아들이세요. 서로에 대한 감사를 자주 표현하면 관계가 더욱 깊어집니다.`;
  } else if (isOvercoming(elem1, elem2)) {
    relationDesc = `${member1.name}님(${stem1}, ${elemKor1})과 ${member2.name}님(${stem2}, ${elemKor2})은 상극(相剋) 관계로, 의견 충돌이 있을 수 있습니다. 하지만 이는 서로를 단련시키는 관계이기도 합니다. ${roleRelation}으로서 서로의 다름을 인정하는 것이 중요합니다.`;
    advice = `서로의 의견이 다를 때는 감정적으로 대응하지 말고, 차분하게 대화하세요. 제3자(다른 가족 구성원)가 중재 역할을 하면 갈등이 쉽게 해결됩니다.`;
  } else if (isOvercoming(elem2, elem1)) {
    relationDesc = `${member2.name}님(${stem2}, ${elemKor2})과 ${member1.name}님(${stem1}, ${elemKor1})은 상극(相剋) 관계로, 때때로 긴장감이 있을 수 있습니다. 그러나 이 긴장감은 서로를 성장시키는 원동력이 될 수 있습니다.`;
    advice = `서로의 장점에 집중하고, 단점은 너그럽게 이해하세요. 함께 운동이나 야외 활동을 하면 관계가 부드러워집니다.`;
  } else {
    relationDesc = `${member1.name}님(${stem1}, ${elemKor1})과 ${member2.name}님(${stem2}, ${elemKor2})은 같은 ${elemKor1}의 기운을 가진 비화(比和) 관계입니다. 서로를 잘 이해하고 공감하는 사이이며, ${roleRelation}으로서 마음이 잘 통합니다.`;
    advice = `비슷한 성향이라 편안하지만, 때로는 서로 다른 관점을 제시해주는 것도 필요합니다. 함께 새로운 경험을 하면 관계에 신선함을 더할 수 있습니다.`;
  }

  const title = score >= 80 ? "최고의 조화" : score >= 65 ? "좋은 관계" : score >= 50 ? "보통의 관계" : "노력이 필요한 관계";

  return { score, title, description: relationDesc, advice };
}

// 역할 관계 문자열 생성
function getRoleRelation(role1: FamilyRole, role2: FamilyRole): string {
  const parentRoles: FamilyRole[] = ["아버지", "어머니", "할아버지", "할머니"];
  const childRoles: FamilyRole[] = ["아들", "딸"];

  // 부모-자녀 관계
  if (parentRoles.includes(role1) && childRoles.includes(role2)) return "부모-자녀";
  if (childRoles.includes(role1) && parentRoles.includes(role2)) return "자녀-부모";

  // 배우자(나의 배우자)와 자녀 관계
  if (role1 === "배우자" && childRoles.includes(role2)) return "부모-자녀";
  if (childRoles.includes(role1) && role2 === "배우자") return "자녀-부모";

  // "나"와 자녀 관계
  if (role1 === "나" && childRoles.includes(role2)) return "부모-자녀";
  if (childRoles.includes(role1) && role2 === "나") return "자녀-부모";

  // "나"와 부모 관계
  if (role1 === "나" && parentRoles.includes(role2)) return "자녀-부모";
  if (parentRoles.includes(role1) && role2 === "나") return "부모-자녀";

  // 부부 관계
  if (parentRoles.includes(role1) && parentRoles.includes(role2)) {
    if ((role1 === "아버지" && role2 === "어머니") || (role1 === "어머니" && role2 === "아버지")) return "부부";
    if ((role1 === "할아버지" && role2 === "할머니") || (role1 === "할머니" && role2 === "할아버지")) return "부부";
  }
  if ((role1 === "나" && role2 === "배우자") || (role1 === "배우자" && role2 === "나")) return "부부";

  // 형제자매 관계
  if (childRoles.includes(role1) && childRoles.includes(role2)) return "형제자매";

  return "가족";
}

// 가족 전체 종합 해석
export function generateFamilySummary(members: FamilyMember[]): {
  overallScore: number;
  harmony: string;
  strengths: string[];
  improvements: string[];
  luckyActivity: string;
} {
  const validMembers = members.filter(m => m.saju);
  if (validMembers.length < 2) {
    return {
      overallScore: 0,
      harmony: "",
      strengths: [],
      improvements: [],
      luckyActivity: "",
    };
  }

  // 모든 쌍의 점수 평균
  let totalScore = 0;
  let pairCount = 0;
  for (let i = 0; i < validMembers.length; i++) {
    for (let j = i + 1; j < validMembers.length; j++) {
      totalScore += calculateRelationScore(validMembers[i].saju!, validMembers[j].saju!);
      pairCount++;
    }
  }
  const overallScore = pairCount > 0 ? Math.round(totalScore / pairCount) : 0;

  const familyBalance = analyzeFamilyElementBalance(validMembers);
  const strongElem = ELEMENT_KOREAN[familyBalance.strongestElement] || familyBalance.strongestElement;
  const weakElem = ELEMENT_KOREAN[familyBalance.weakestElement] || familyBalance.weakestElement;

  let harmony = "";
  if (overallScore >= 80) {
    harmony = `이 가족은 전체적으로 매우 조화로운 기운을 가지고 있습니다. 가족 구성원들의 오행이 서로를 잘 보완하며, 자연스러운 상생의 흐름이 있습니다. ${strongElem}의 기운이 가장 강하여 가족의 중심 에너지가 됩니다.`;
  } else if (overallScore >= 65) {
    harmony = `이 가족은 대체로 좋은 조화를 이루고 있습니다. 일부 구성원 간에 약간의 긴장이 있을 수 있지만, 서로에 대한 이해와 배려로 충분히 극복할 수 있습니다. ${strongElem}의 기운이 가족을 이끌어가는 힘이 됩니다.`;
  } else if (overallScore >= 50) {
    harmony = `이 가족은 다양한 기운이 섞여 있어 역동적인 관계를 형성합니다. 서로 다른 성향이 때로는 갈등의 원인이 되지만, 그만큼 서로에게 배울 점도 많습니다. ${strongElem}의 기운을 중심으로 가족의 방향성을 맞추면 좋겠습니다.`;
  } else {
    harmony = `이 가족은 서로 다른 기운이 강하게 작용하여 의견 충돌이 잦을 수 있습니다. 하지만 다양성은 곧 가족의 강점이 될 수 있습니다. 서로의 차이를 인정하고 존중하는 것이 가족 화합의 열쇠입니다.`;
  }

  const strengths: string[] = [];
  const improvements: string[] = [];

  // 상생 관계 찾기
  for (let i = 0; i < validMembers.length; i++) {
    for (let j = i + 1; j < validMembers.length; j++) {
      const e1 = STEM_ELEMENTS[validMembers[i].saju!.dayPillar.stem];
      const e2 = STEM_ELEMENTS[validMembers[j].saju!.dayPillar.stem];
      if (isGenerating(e1, e2) || isGenerating(e2, e1)) {
        strengths.push(`${validMembers[i].name}님과 ${validMembers[j].name}님은 상생 관계로, 서로에게 힘이 되는 사이입니다.`);
      }
      if (isOvercoming(e1, e2) || isOvercoming(e2, e1)) {
        improvements.push(`${validMembers[i].name}님과 ${validMembers[j].name}님은 상극 관계이므로, 서로의 의견을 경청하는 노력이 필요합니다.`);
      }
    }
  }

  if (strengths.length === 0) {
    strengths.push("가족 구성원들이 비슷한 기운을 가지고 있어 서로를 잘 이해합니다.");
  }
  if (improvements.length === 0) {
    improvements.push("전반적으로 조화로운 관계이지만, 새로운 활동을 함께 시도하면 더욱 좋아집니다.");
  }

  const luckyActivities: Record<string, string> = {
    '木': "함께 등산, 산책, 식물 가꾸기, 독서 모임",
    '火': "가족 캠핑, 바베큐, 요리 대회, 보드게임",
    '土': "텃밭 가꾸기, 도자기 체험, 가족 여행, 집 꾸미기",
    '金': "악기 연주, 박물관 관람, 가족 운동, 등산",
    '水': "수영, 낚시, 온천 여행, 가족 영화 감상",
  };

  const luckyActivity = luckyActivities[familyBalance.strongestElement] || "가족 나들이";

  return { overallScore, harmony, strengths, improvements, luckyActivity };
}
