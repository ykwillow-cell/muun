// 사주 x MBTI 하이브리드 궁합 분석 라이브러리
import { SajuResult, STEM_ELEMENTS, calculateElementBalance, type FiveElement, type HeavenlyStem } from './saju';
import { MBTIType, MBTI_INFO, analyzeMBTICompatibility, getMBTICompatScore, type MBTICompatResult } from './mbti-compatibility';

// 오행-MBTI 크로스 매핑
const ELEMENT_MBTI_SYNERGY: Record<string, Record<string, { score: number; description: string }>> = {
  '木': {
    'E': { score: 85, description: '나무(木)의 성장하는 기운과 외향적 에너지가 만나 끊임없이 뻗어나가는 힘이 있어요' },
    'I': { score: 70, description: '나무(木)의 기운이 내면에서 조용히 뿌리를 내리며, 깊이 있는 성장을 이뤄요' },
    'N': { score: 90, description: '나무(木)의 창의적 성장력과 직관형의 상상력이 만나 무한한 가능성이 열려요' },
    'S': { score: 72, description: '나무(木)의 기운을 현실적으로 활용하여 실질적인 성과를 만들어내요' },
    'F': { score: 88, description: '나무(木)의 부드러운 기운과 감정형의 따뜻함이 만나 사람들에게 치유를 줘요' },
    'T': { score: 68, description: '나무(木)의 유연함이 논리적 사고와 만나 균형 잡힌 판단력을 가져요' },
    'P': { score: 82, description: '나무(木)처럼 자유롭게 뻗어나가는 기운과 유연한 생활 방식이 잘 어울려요' },
    'J': { score: 75, description: '나무(木)의 성장 에너지를 체계적으로 관리하여 큰 성과를 이룰 수 있어요' }
  },
  '火': {
    'E': { score: 92, description: '불(火)의 열정과 외향적 에너지가 만나 주변을 환하게 밝히는 카리스마가 있어요' },
    'I': { score: 62, description: '불(火)의 뜨거운 기운이 내면에 있어, 겉으로는 차분하지만 속은 열정적이에요' },
    'N': { score: 85, description: '불(火)의 빛나는 에너지와 직관형의 비전이 만나 혁신적인 아이디어가 넘쳐요' },
    'S': { score: 70, description: '불(火)의 에너지를 현실에 집중시켜 즉각적인 행동력으로 바꿔요' },
    'F': { score: 88, description: '불(火)의 따뜻함과 감정형의 공감 능력이 만나 주변 사람들을 감동시켜요' },
    'T': { score: 72, description: '불(火)의 열정을 논리적으로 제어하여 강력하면서도 현명한 판단을 내려요' },
    'P': { score: 80, description: '불(火)처럼 순간적으로 타오르는 에너지와 즉흥적 성향이 짜릿한 삶을 만들어요' },
    'J': { score: 78, description: '불(火)의 추진력을 계획적으로 활용하여 목표를 확실하게 달성해요' }
  },
  '土': {
    'E': { score: 75, description: '흙(土)의 안정감과 외향적 에너지가 만나 사람들에게 든든한 존재가 돼요' },
    'I': { score: 85, description: '흙(土)의 묵직한 기운과 내향적 깊이가 만나 흔들리지 않는 내면의 힘이 있어요' },
    'N': { score: 68, description: '흙(土)의 현실적 기반 위에 직관적 상상력이 더해져 실현 가능한 꿈을 꿔요' },
    'S': { score: 92, description: '흙(土)의 안정감과 감각형의 현실 감각이 만나 가장 믿음직한 사람이에요' },
    'F': { score: 82, description: '흙(土)의 포용력과 감정형의 따뜻함이 만나 모든 사람을 품어주는 넓은 마음이에요' },
    'T': { score: 80, description: '흙(土)의 중심 잡는 힘과 논리적 사고가 만나 현명하고 균형 잡힌 판단을 해요' },
    'P': { score: 65, description: '흙(土)의 안정 추구와 유연한 성향 사이에서 균형을 찾아가는 과정이에요' },
    'J': { score: 90, description: '흙(土)의 안정감과 체계적 성향이 만나 가장 든든하고 믿음직한 사람이에요' }
  },
  '金': {
    'E': { score: 78, description: '쇠(金)의 단단함과 외향적 에너지가 만나 강한 리더십과 추진력이 있어요' },
    'I': { score: 80, description: '쇠(金)의 날카로운 기운이 내면에서 빛나며, 조용하지만 강한 의지를 가져요' },
    'N': { score: 72, description: '쇠(金)의 정밀함과 직관형의 통찰력이 만나 핵심을 꿰뚫는 분석력이 있어요' },
    'S': { score: 88, description: '쇠(金)의 정확함과 감각형의 현실 감각이 만나 완벽주의적 성향이 돼요' },
    'F': { score: 65, description: '쇠(金)의 차가운 기운과 따뜻한 감정이 만나 겉은 쿨하지만 속은 따뜻한 사람이에요' },
    'T': { score: 92, description: '쇠(金)의 날카로움과 논리적 사고가 만나 최고의 분석력과 판단력을 가져요' },
    'P': { score: 68, description: '쇠(金)의 원칙과 유연한 성향 사이에서 독특한 매력이 만들어져요' },
    'J': { score: 88, description: '쇠(金)의 단단함과 체계적 성향이 만나 흔들리지 않는 원칙과 실행력이 있어요' }
  },
  '水': {
    'E': { score: 72, description: '물(水)의 흐르는 기운과 외향적 에너지가 만나 어디서든 자연스럽게 어울려요' },
    'I': { score: 90, description: '물(水)의 깊은 기운과 내향적 깊이가 만나 심오한 지혜와 통찰력을 가져요' },
    'N': { score: 88, description: '물(水)의 유연함과 직관형의 상상력이 만나 끝없는 창의성이 흘러나와요' },
    'S': { score: 70, description: '물(水)의 적응력과 현실 감각이 만나 어떤 상황에서도 유연하게 대처해요' },
    'F': { score: 85, description: '물(水)의 깊은 감성과 감정형의 공감 능력이 만나 타인의 마음을 깊이 이해해요' },
    'T': { score: 75, description: '물(水)의 지혜와 논리적 사고가 만나 냉철하면서도 유연한 판단력을 가져요' },
    'P': { score: 88, description: '물(水)처럼 자유롭게 흐르는 기운과 유연한 성향이 완벽하게 어울려요' },
    'J': { score: 70, description: '물(水)의 자유로운 흐름을 체계적으로 관리하여 큰 강처럼 힘 있게 흘러가요' }
  }
};

// 오행 한글 매핑
const ELEMENT_KOREAN: Record<string, string> = {
  '木': '나무', '火': '불', '土': '흙', '金': '쇠', '水': '물'
};

const ELEMENT_HANJA_READING: Record<string, string> = {
  '木': '목', '火': '화', '土': '토', '金': '금', '水': '수'
};

// 천간 한글 읽기
const STEM_READINGS: Record<string, { reading: string; meaning: string; nature: string }> = {
  '甲': { reading: '갑', meaning: '큰 나무', nature: '우뚝 솟은 소나무처럼 곧고 당당한 기운' },
  '乙': { reading: '을', meaning: '풀과 덩굴', nature: '바람에 유연하게 흔들리는 부드러운 기운' },
  '丙': { reading: '병', meaning: '태양', nature: '세상을 환하게 비추는 뜨거운 기운' },
  '丁': { reading: '정', meaning: '촛불', nature: '어둠 속에서 따뜻하게 빛나는 은은한 기운' },
  '戊': { reading: '무', meaning: '큰 산', nature: '흔들리지 않는 묵직하고 듬직한 기운' },
  '己': { reading: '기', meaning: '논밭', nature: '만물을 품어 키우는 포근한 기운' },
  '庚': { reading: '경', meaning: '바위와 쇠', nature: '단단하고 날카로운 의지의 기운' },
  '辛': { reading: '신', meaning: '보석', nature: '세련되고 빛나는 아름다운 기운' },
  '壬': { reading: '임', meaning: '큰 바다', nature: '끝없이 넓고 깊은 포용의 기운' },
  '癸': { reading: '계', meaning: '이슬과 빗물', nature: '조용히 스며드는 섬세한 기운' }
};

// 상생 관계
const GENERATING: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
// 상극 관계
const OVERCOMING: Record<string, string> = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };

export interface HybridCompatResult {
  // 종합
  totalScore: number;
  totalGrade: string;
  totalSummary: string;
  
  // 사주 궁합
  sajuScore: number;
  sajuElementRelation: string;
  sajuInterpretation: string[];
  
  // MBTI 궁합
  mbtiResult: MBTICompatResult;
  
  // 크로스 분석
  crossAnalysis: {
    person1: { element: string; mbti: MBTIType; synergy: string; synergyScore: number };
    person2: { element: string; mbti: MBTIType; synergy: string; synergyScore: number };
    crossChemistry: string;
    crossScore: number;
  };
  
  // 세부 점수
  detailScores: {
    love: number;
    communication: number;
    marriage: number;
    crisis: number;
  };
  
  // 종합 조언
  finalAdvice: string;
  keywords: string[];
  recommendations: string[];
}

// 사주 오행 관계 분석
function analyzeSajuRelation(elem1: string, elem2: string): { relation: string; score: number; description: string } {
  const kor1 = ELEMENT_KOREAN[elem1];
  const kor2 = ELEMENT_KOREAN[elem2];
  const hanja1 = ELEMENT_HANJA_READING[elem1];
  const hanja2 = ELEMENT_HANJA_READING[elem2];
  
  if (elem1 === elem2) {
    return {
      relation: '비화(比和)',
      score: 72,
      description: `두 분 모두 ${kor1}(${elem1}, ${hanja1})의 기운을 타고났어요. 같은 기운끼리 만나면 서로를 깊이 이해할 수 있지만, 비슷한 부분에서 부딪힐 수도 있어요. 마치 거울을 보는 것처럼 상대에게서 자신의 모습을 발견하게 될 거예요.`
    };
  }
  
  if (GENERATING[elem1] === elem2) {
    return {
      relation: `상생(相生) - ${hanja1}생${hanja2}(${elem1}生${elem2})`,
      score: 88,
      description: `${kor1}(${elem1})이 ${kor2}(${elem2})를 살려주는 상생(相生) 관계예요! 쉽게 말하면, 첫 번째 분이 두 번째 분에게 에너지를 불어넣어 주는 거예요. ${elem1 === '木' ? '나무가 타면서 불을 만들어내듯' : elem1 === '火' ? '불이 타고 난 재가 흙이 되듯' : elem1 === '土' ? '흙 속에서 금속이 만들어지듯' : elem1 === '金' ? '차가운 금속 표면에 이슬이 맺히듯' : '물이 나무를 키우듯'}, 자연스럽게 상대를 성장시켜주는 아름다운 관계예요.`
    };
  }
  
  if (GENERATING[elem2] === elem1) {
    return {
      relation: `상생(相生) - ${hanja2}생${hanja1}(${elem2}生${elem1})`,
      score: 85,
      description: `${kor2}(${elem2})가 ${kor1}(${elem1})을 살려주는 상생(相生) 관계예요! 두 번째 분이 첫 번째 분에게 에너지를 불어넣어 주는 거예요. ${elem2 === '木' ? '나무가 타면서 불을 만들어내듯' : elem2 === '火' ? '불이 타고 난 재가 흙이 되듯' : elem2 === '土' ? '흙 속에서 금속이 만들어지듯' : elem2 === '金' ? '차가운 금속 표면에 이슬이 맺히듯' : '물이 나무를 키우듯'}, 자연스럽게 상대를 성장시켜주는 관계예요.`
    };
  }
  
  if (OVERCOMING[elem1] === elem2) {
    return {
      relation: `상극(相剋) - ${hanja1}극${hanja2}(${elem1}剋${elem2})`,
      score: 62,
      description: `${kor1}(${elem1})이 ${kor2}(${elem2})를 제어하는 상극(相剋) 관계예요. "어? 상극이면 안 좋은 거 아니에요?" 하실 수 있는데, 꼭 그렇지만은 않아요! ${elem1 === '木' ? '나무 뿌리가 흙을 잡아주듯' : elem1 === '火' ? '불이 쇠를 녹여 유용한 도구를 만들듯' : elem1 === '土' ? '둑이 물의 흐름을 조절하듯' : elem1 === '金' ? '도끼가 나무를 다듬어 가구를 만들듯' : '물이 불을 조절하듯'}, 적절한 제어는 오히려 서로를 더 빛나게 만들어요. 핵심은 "지배"가 아닌 "다듬어줌"이에요.`
    };
  }
  
  if (OVERCOMING[elem2] === elem1) {
    return {
      relation: `상극(相剋) - ${hanja2}극${hanja1}(${elem2}剋${elem1})`,
      score: 60,
      description: `${kor2}(${elem2})가 ${kor1}(${elem1})을 제어하는 상극(相剋) 관계예요. 상극이라고 해서 나쁜 관계가 아니에요! ${elem2 === '木' ? '나무 뿌리가 흙을 잡아주듯' : elem2 === '火' ? '불이 쇠를 녹여 유용한 도구를 만들듯' : elem2 === '土' ? '둑이 물의 흐름을 조절하듯' : elem2 === '金' ? '도끼가 나무를 다듬어 가구를 만들듯' : '물이 불을 조절하듯'}, 적절한 긴장감이 오히려 관계를 성장시키는 원동력이 돼요.`
    };
  }
  
  return {
    relation: '중화(中和)',
    score: 70,
    description: `두 분의 오행은 직접적인 상생이나 상극 관계가 아니라, 서로 독립적이면서도 조화를 이루는 관계예요. 간섭 없이 각자의 영역을 존중하면서도 필요할 때 힘을 합칠 수 있는 균형 잡힌 관계예요.`
  };
}

// 크로스 시너지 분석 (개인의 오행 x MBTI)
function analyzeCrossSynergy(element: string, mbti: MBTIType): { score: number; description: string } {
  const scores: number[] = [];
  const descriptions: string[] = [];
  
  for (const char of mbti) {
    const synergy = ELEMENT_MBTI_SYNERGY[element]?.[char];
    if (synergy) {
      scores.push(synergy.score);
      descriptions.push(synergy.description);
    }
  }
  
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 70;
  // 가장 높은 시너지 설명 선택
  const bestIdx = scores.indexOf(Math.max(...scores));
  
  return {
    score: avgScore,
    description: descriptions[bestIdx] || '오행과 성격이 조화를 이루고 있어요'
  };
}

// 하이브리드 궁합 종합 분석
export function analyzeHybridCompatibility(
  saju1: SajuResult, saju2: SajuResult,
  mbti1: MBTIType, mbti2: MBTIType,
  name1: string, name2: string
): HybridCompatResult {
  const elem1 = STEM_ELEMENTS[saju1.dayPillar.stem as HeavenlyStem];
  const elem2 = STEM_ELEMENTS[saju2.dayPillar.stem as HeavenlyStem];
  const stemInfo1 = STEM_READINGS[saju1.dayPillar.stem];
  const stemInfo2 = STEM_READINGS[saju2.dayPillar.stem];
  
  // 1. 사주 궁합 분석
  const sajuRelation = analyzeSajuRelation(elem1, elem2);
  
  // 사주 해석 생성
  const sajuInterpretation: string[] = [
    `${name1}님은 ${saju1.dayPillar.stem}(${stemInfo1.reading})${saju1.dayPillar.branch} 일주로, ${stemInfo1.meaning}의 기운을 타고났어요. ${stemInfo1.nature}을 가진 분이에요.`,
    `${name2}님은 ${saju2.dayPillar.stem}(${stemInfo2.reading})${saju2.dayPillar.branch} 일주로, ${stemInfo2.meaning}의 기운을 타고났어요. ${stemInfo2.nature}을 가진 분이에요.`,
    sajuRelation.description
  ];
  
  // 을경합 등 천간합 체크
  const STEM_COMBINATIONS: Record<string, string> = {
    '甲己': '갑기합(甲己合) - 토(土)로 변하는 합',
    '乙庚': '을경합(乙庚合) - 금(金)으로 변하는 합',
    '丙辛': '병신합(丙辛合) - 수(水)로 변하는 합',
    '丁壬': '정임합(丁壬合) - 목(木)으로 변하는 합',
    '戊癸': '무계합(戊癸合) - 화(火)로 변하는 합'
  };
  
  const stemPair1 = saju1.dayPillar.stem + saju2.dayPillar.stem;
  const stemPair2 = saju2.dayPillar.stem + saju1.dayPillar.stem;
  const stemCombination = STEM_COMBINATIONS[stemPair1] || STEM_COMBINATIONS[stemPair2];
  
  if (stemCombination) {
    sajuInterpretation.push(`여기서 정말 특별한 게 있어요! 두 분의 일간(日干)은 ${stemCombination}이라고 해서, 사주학에서 "만나면 자연스럽게 하나가 되는 천생의 조합"이에요. 마치 자석의 N극과 S극처럼 서로 끌어당기는 힘이 있어요. 이 합(合)이 있는 커플은 처음 만났을 때 "어? 이 사람 어디서 본 것 같은데?" 하는 묘한 친숙함을 느끼는 경우가 많아요.`);
    sajuRelation.score = Math.min(95, sajuRelation.score + 15);
  }
  
  // 2. MBTI 궁합 분석
  const mbtiResult = analyzeMBTICompatibility(mbti1, mbti2, name1, name2);
  
  // 3. 크로스 분석
  const cross1 = analyzeCrossSynergy(elem1, mbti1);
  const cross2 = analyzeCrossSynergy(elem2, mbti2);
  
  // 크로스 케미 해석
  let crossChemistry: string;
  const crossScore = Math.round((cross1.score + cross2.score) / 2);
  
  if (crossScore >= 82) {
    crossChemistry = `여기서 정말 신기한 게 있어요. ${name1}님의 ${ELEMENT_KOREAN[elem1]}(${elem1}) 기운은 MBTI의 ${mbti1} 성격과 정확히 일치해요. ${name2}님의 ${ELEMENT_KOREAN[elem2]}(${elem2}) 기운도 ${mbti2} 성격과 딱 맞아떨어지죠. 이게 뭘 의미하냐면, 두 분은 타고난 기운과 실제 성격이 일치하는 사람들이에요. 사주가 예측한 대로 살고 있다는 뜻이고, 그만큼 두 분의 궁합 분석이 정확하게 맞아떨어질 확률이 높다는 거예요.`;
  } else if (crossScore >= 72) {
    crossChemistry = `${name1}님의 ${ELEMENT_KOREAN[elem1]}(${elem1}) 기운과 ${mbti1} 성격이 서로 보완하며 균형을 이루고 있어요. ${name2}님도 ${ELEMENT_KOREAN[elem2]}(${elem2}) 기운과 ${mbti2} 성격이 조화롭게 어우러져 있어요. 두 분 모두 사주와 성격이 서로를 보완해주고 있어서, 관계에서도 자연스러운 밸런스가 만들어질 거예요.`;
  } else {
    crossChemistry = `${name1}님의 ${ELEMENT_KOREAN[elem1]}(${elem1}) 기운과 ${mbti1} 성격 사이에 약간의 긴장감이 있어요. 이건 나쁜 게 아니라, 내면에 다양한 면모를 가지고 있다는 뜻이에요. ${name2}님도 마찬가지로 ${ELEMENT_KOREAN[elem2]}(${elem2}) 기운과 ${mbti2} 성격이 독특한 조합을 이루고 있어요. 이런 복합적인 성격의 두 사람이 만나면, 예측할 수 없는 재미있는 케미가 생겨요.`;
  }
  
  // 4. 종합 점수 계산 (사주 40%, MBTI 35%, 크로스 25%)
  const totalScore = Math.round(sajuRelation.score * 0.4 + mbtiResult.score * 0.35 + crossScore * 0.25);
  
  // 세부 점수
  const seed = (saju1.dayPillar.stem.charCodeAt(0) + saju2.dayPillar.stem.charCodeAt(0) + mbti1.charCodeAt(0) + mbti2.charCodeAt(0)) % 20;
  const detailScores = {
    love: Math.min(98, Math.max(40, Math.round(totalScore * 0.4 + mbtiResult.score * 0.4 + sajuRelation.score * 0.2 + (seed % 8) - 3))),
    communication: Math.min(98, Math.max(40, Math.round(mbtiResult.score * 0.5 + totalScore * 0.3 + crossScore * 0.2 + ((seed + 3) % 8) - 3))),
    marriage: Math.min(98, Math.max(40, Math.round(sajuRelation.score * 0.4 + totalScore * 0.35 + mbtiResult.score * 0.25 + ((seed + 5) % 8) - 3))),
    crisis: Math.min(98, Math.max(40, Math.round(crossScore * 0.35 + sajuRelation.score * 0.35 + mbtiResult.score * 0.3 + ((seed + 7) % 8) - 3)))
  };
  
  // 종합 등급 및 요약
  let totalGrade: string;
  let totalSummary: string;
  
  if (totalScore >= 85) {
    totalGrade = '천생연분';
    totalSummary = `사주도, 성격도 찰떡! 만나야 할 운명이었어요. 두 분은 하늘이 맺어준 인연이라고 해도 과언이 아니에요. 사주의 오행이 서로를 살려주고, 성격도 완벽하게 보완해주는 최고의 조합이에요.`;
  } else if (totalScore >= 75) {
    totalGrade = '최고의 궁합';
    totalSummary = `사주와 성격 모두 좋은 조화를 이루고 있어요. 함께 있으면 자연스럽게 시너지가 나는 관계예요. 서로의 장점을 살려주고, 부족한 부분을 채워주는 이상적인 파트너예요.`;
  } else if (totalScore >= 65) {
    totalGrade = '좋은 궁합';
    totalSummary = `사주와 성격에서 서로 배울 점이 많은 관계예요. 처음엔 다른 점이 눈에 띌 수 있지만, 시간이 갈수록 "이 사람이 아니면 안 되겠다"로 바뀌는 궁합이에요. 소통을 잘하면 더욱 깊은 관계로 발전할 수 있어요.`;
  } else if (totalScore >= 55) {
    totalGrade = '노력하면 좋은 궁합';
    totalSummary = `사주와 성격에서 차이가 있지만, 그게 오히려 매력이 될 수 있어요. "다르다"는 건 "틀리다"가 아니에요. 서로의 다름을 인정하고 존중하면, 누구보다 단단한 관계가 될 수 있어요.`;
  } else {
    totalGrade = '도전적인 궁합';
    totalSummary = `솔직히 말하면, 두 분은 노력이 필요한 관계예요. 하지만 세상에서 가장 강한 커플은 "잘 맞아서 함께하는 커플"이 아니라 "다르지만 함께하기로 선택한 커플"이에요. 서로를 이해하려는 진심만 있다면, 어떤 궁합도 이겨낼 수 있어요.`;
  }
  
  // 종합 조언
  let finalAdvice: string;
  if (stemCombination) {
    finalAdvice = `두 분의 궁합을 한마디로 정리하면, "하늘도 인정하고 과학도 인정한 궁합"이에요. 사주에서 ${stemCombination.split(' - ')[0]}이라는 특별한 인연이 있고, MBTI에서도 ${mbtiResult.grade}이라는 결과가 나왔어요. 이 두 가지가 겹치는 건 정말 드문 일이에요. 서로에게 고마운 마음을 자주 표현하고, 이 특별한 인연을 소중히 가꿔가세요.`;
  } else if (totalScore >= 75) {
    finalAdvice = `두 분은 사주적으로도, 성격적으로도 서로를 성장시키는 관계예요. 한 가지만 기억하세요. 좋은 관계도 가꿔야 더 좋아져요. "잘 맞으니까 괜찮겠지"라는 안일함 대신, 매일 조금씩 서로에게 관심을 기울여보세요. 작은 관심이 큰 사랑이 됩니다.`;
  } else {
    finalAdvice = `두 분의 관계에서 가장 중요한 건 "소통"이에요. 사주에서 보이는 기운의 차이도, MBTI에서 보이는 성격의 차이도, 결국 대화로 극복할 수 있어요. "왜 그렇게 생각해?"라고 진심으로 물어보는 것, 그것만으로도 두 분의 관계는 크게 달라질 거예요.`;
  }
  
  // 키워드 생성
  const keywords: string[] = [];
  if (stemCombination) keywords.push('천생연분');
  if (sajuRelation.score >= 80) keywords.push('오행 조화');
  if (mbtiResult.score >= 80) keywords.push('성격 찰떡');
  if (crossScore >= 80) keywords.push('완벽한 시너지');
  if (detailScores.love >= 80) keywords.push('운명적 사랑');
  if (detailScores.communication >= 80) keywords.push('소통의 달인');
  if (detailScores.marriage >= 80) keywords.push('결혼 적합');
  if (detailScores.crisis >= 80) keywords.push('위기 극복력');
  
  // 최소 4개 키워드 보장
  const fallbackKeywords = ['함께 성장', '서로 보완', '깊은 유대', '새로운 발견', '따뜻한 관계'];
  while (keywords.length < 4) {
    const kw = fallbackKeywords.shift();
    if (kw && !keywords.includes(kw)) keywords.push(kw);
  }
  
  // 추천 활동
  const recommendations = [
    ...mbtiResult.dateRecommendations.slice(0, 2)
  ];
  
  if (sajuRelation.score >= 80) {
    recommendations.push('함께 명상이나 요가 - 서로의 기운을 느끼며 더 깊은 교감을 나눠보세요');
  }
  if (elem1 === '木' || elem2 === '木') {
    recommendations.push('자연 속 산책이나 등산 - 나무(木)의 기운을 충전하면 관계가 더 깊어져요');
  }
  if (elem1 === '火' || elem2 === '火') {
    recommendations.push('캠프파이어나 촛불 디너 - 불(火)의 따뜻한 기운이 두 분의 사랑을 더 뜨겁게 해요');
  }
  if (elem1 === '水' || elem2 === '水') {
    recommendations.push('바다나 호수 근처 데이트 - 물(水)의 기운이 마음의 평화를 가져다줘요');
  }
  
  return {
    totalScore,
    totalGrade,
    totalSummary,
    sajuScore: sajuRelation.score,
    sajuElementRelation: sajuRelation.relation,
    sajuInterpretation,
    mbtiResult,
    crossAnalysis: {
      person1: { element: elem1, mbti: mbti1, synergy: cross1.description, synergyScore: cross1.score },
      person2: { element: elem2, mbti: mbti2, synergy: cross2.description, synergyScore: cross2.score },
      crossChemistry,
      crossScore
    },
    detailScores,
    finalAdvice,
    keywords: keywords.slice(0, 4),
    recommendations: recommendations.slice(0, 4)
  };
}
