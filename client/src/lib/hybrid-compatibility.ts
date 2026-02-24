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
  // 에너지 저울
  energyScale: {
    person1Energy: number;
    person2Energy: number;
    balanceScore: number;
    charger: string;
    consumer: string;
    description: string;
  };

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

  // 시너지 카드
  synergyCard: {
    nickname1: string;
    nickname2: string;
    combinedNickname: string;
  };

  // 4대 영역 리포트
  fourDimensions: {
    communication: { title: string; summary: string; score: number; advice: string; };
    conflictResolution: { title: string; summary: string; score: number; advice: string; };
    valuesAndReality: { title: string; summary: string; score: number; advice: string; };
    dailyRhythm: { title: string; summary: string; score: number; advice: string; };
  };

  // 인연 타임라인
  timeline: {
    썸: number;
    연애: number;
    장기안정기: number;
    description: string;
  };

  // 무운의 한 줄 처방전
  prescription: {
    luckyColor: string;
    luckyItem: string;
    tipForPartner: string;
  };

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

// 4대 영역 하이브리드 리포트 텍스트 생성 함수들

// 대화와 소통: MBTI(E/I) x 사주(화/수 기운) - 소통의 온도 분석
const getElementCommunicationStyle = (element: string): string => {
  switch (element) {
    case '木': return '새로운 아이디어를 제시하며 대화를 시작하는 스타일';
    case '火': return '열정적으로 자신의 의견을 표현하며 대화를 주도하는 스타일';
    case '土': return '상대방의 이야기를 잘 들어주고 안정감을 주는 스타일';
    case '金': return '논리적이고 핵심을 짚는 간결한 대화 스타일';
    case '水': return '상황에 맞춰 유연하게 공감하며 대화하는 스타일';
    default: return '';
  }
};

function generateCommunicationSummary(elem1: string, mbti1: MBTIType, elem2: string, mbti2: MBTIType, name1: string, name2: string): string {
  const getElementCommunicationStyle = (element: string): string => {
    switch (element) {
      case '木': return '새로운 아이디어를 제시하며 대화를 시작하는 스타일';
      case '火': return '열정적으로 자신의 의견을 표현하며 대화를 주도하는 스타일';
      case '土': return '상대방의 이야기를 잘 들어주고 안정감을 주는 스타일';
      case '金': return '논리적이고 핵심을 짚는 간결한 대화 스타일';
      case '水': return '상황에 맞춰 유연하게 공감하며 대화하는 스타일';
      default: return '';
    }
  };

  const p1EI = mbti1[0];
  const p2EI = mbti2[0];

  let summary = '';

  if (p1EI === p2EI) {
    if (p1EI === 'E') {
      summary = `두 분 모두 외향적인(E) 성향으로, 만남 초반부터 활발한 대화가 오고 갈 거예요. ${name1}님은 ${getElementCommunicationStyle(elem1)}이고, ${name2}님은 ${getElementCommunicationStyle(elem2)}이라, 서로의 에너지를 북돋아주며 즐거운 소통을 이어갈 수 있어요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 각자의 방식으로 대화에 활력을 불어넣을 거예요. 다만, 때로는 너무 많은 정보가 오가거나, 깊이 있는 대화보다는 표면적인 대화에 머무를 수 있으니 주의하세요.`;
    } else {
      summary = `두 분 모두 내향적인(I) 성향으로, 서로의 조용함을 존중하며 편안한 대화를 나눌 수 있어요. ${name1}님은 ${getElementCommunicationStyle(elem1)}이고, ${name2}님은 ${getElementCommunicationStyle(elem2)}이라, 깊이 있는 이야기를 선호하며 서로의 내면을 이해하려는 노력을 할 거예요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 서로의 내면을 탐구하며 깊은 유대감을 형성할 수 있습니다. 하지만, 때로는 너무 조용해서 오해가 생기거나, 중요한 이야기를 미루는 경향이 있을 수 있으니 솔직한 표현이 필요해요.`;
    }
  } else {
    summary = `${name1}님은 ${p1EI === 'E' ? '외향적인(E)' : '내향적인(I)'} 성향이고, ${name2}님은 ${p2EI === 'E' ? '외향적인(E)' : '내향적인(I)'} 성향이라 서로 다른 소통 방식을 가지고 있어요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 각자의 소통 스타일을 가지고 있어 처음에는 다소 어색할 수 있지만, 서로의 차이를 이해하고 존중하면 더욱 풍부한 대화가 가능해질 거예요. 외향적인 분은 내향적인 분에게 충분한 생각할 시간을 주고, 내향적인 분은 외향적인 분에게 먼저 다가가 표현하는 노력을 해보세요.`;
  }

  return summary;
}

function calculateCommunicationScore(elem1: string, mbti1: MBTIType, elem2: string, mbti2: MBTIType): number {
  let score = 70;
  const p1EI = mbti1[0];
  const p2EI = mbti2[0];

  if (p1EI === p2EI) {
    score += 5;
  } else {
    score -= 5;
  }

  return Math.min(95, Math.max(50, score + Math.floor(Math.random() * 10 - 5)));
}

function generateCommunicationAdvice(elem1: string, mbti1: MBTIType, elem2: string, mbti2: MBTIType, name1: string, name2: string): string {
  const p1EI = mbti1[0];
  const p2EI = mbti2[0];

  if (p1EI === p2EI) {
    if (p1EI === 'E') {
      return `두 분 모두 외향적이라 대화가 끊이지 않을 거예요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 서로의 에너지를 북돋아주며 즐거운 소통을 이어갈 수 있습니다. 하지만 가끔은 상대방의 이야기를 끝까지 경청하고, 깊이 있는 질문을 던져보세요. 서로의 내면을 더 깊이 이해하는 계기가 될 수 있답니다.`;
    } else {
      return `두 분 모두 내향적이라 조용하고 편안한 대화를 선호할 거예요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 서로의 조용함을 존중하며 편안한 대화를 나눌 수 있습니다. 하지만 중요한 감정이나 생각은 솔직하게 표현하는 연습이 필요해요. 침묵보다는 진솔한 대화가 관계를 더욱 단단하게 만들 거예요.`;
    }
  } else {
    return `서로 다른 소통 방식이 처음에는 어렵게 느껴질 수 있어요. 외향적인 분은 내향적인 분에게 충분한 생각할 시간을 주고, 내향적인 분은 외향적인 분에게 먼저 다가가 표현하는 노력을 해보세요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 서로의 강점을 이해하고 활용한다면, 더욱 풍부하고 다채로운 소통을 할 수 있을 거예요.`;
  }
}

// 싸움과 화해: MBTI(T/F) x 사주(금/목 기운) - 갈등 해결 방식 분석
function generateConflictResolutionSummary(elem1: string, mbti1: MBTIType, elem2: string, mbti2: MBTIType, name1: string, name2: string): string {
  const p1TF = mbti1[2];
  const p2TF = mbti2[2];

  let summary = '';

  if (p1TF === p2TF) {
    if (p1TF === 'T') {
      summary = `두 분 모두 사고형(T)이라 갈등 상황에서 논리적이고 이성적으로 접근할 거예요. 문제의 본질을 파악하고 합리적인 해결책을 찾는 데 능숙해요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 냉철한 분석력으로 갈등의 핵심을 꿰뚫어 볼 수 있습니다. 하지만, 때로는 감정적인 부분을 간과하거나, 상대방의 마음을 헤아리지 못해 더 큰 오해를 불러일으킬 수 있으니 주의하세요.`;
    } else {
      summary = `두 분 모두 감정형(F)이라 갈등 상황에서 서로의 감정을 이해하고 공감하려 노력할 거예요. 관계의 조화를 중요하게 생각하며, 상대방의 기분을 상하게 하지 않으려 애쓸 거예요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 서로의 감정을 섬세하게 보듬어주며 갈등을 해결해 나갈 수 있습니다. 하지만, 때로는 갈등의 원인을 명확히 짚고 넘어가기보다 회피하거나, 감정적으로만 대응하여 문제가 해결되지 않을 수 있으니 주의하세요.`;
    }
  } else {
    summary = `${name1}님은 ${p1TF === 'T' ? '사고형(T)' : '감정형(F)'} 성향이고, ${name2}님은 ${p2TF === 'T' ? '사고형(T)' : '감정형(F)'} 성향이라 갈등 해결 방식에 차이가 있어요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 서로에게 부족한 부분을 채워줄 수 있어요. ${p1TF === 'T' ? name1 : name2}님이 이성적인 해결책을 제시하고, ${p1TF === 'F' ? name1 : name2}님이 감정적인 지지를 보내주면 완벽한 조화를 이룰 수 있답니다.`;
  }

  return summary;
}

function calculateConflictResolutionScore(elem1: string, mbti1: MBTIType, elem2: string, mbti2: MBTIType): number {
  let score = 70;
  const p1TF = mbti1[2];
  const p2TF = mbti2[2];

  if (p1TF === p2TF) {
    score -= 5;
  } else {
    score += 10;
  }

  return Math.min(95, Math.max(50, score + Math.floor(Math.random() * 10 - 5)));
}

function generateConflictResolutionAdvice(elem1: string, mbti1: MBTIType, elem2: string, mbti2: MBTIType, name1: string, name2: string): string {
  const p1TF = mbti1[2];
  const p2TF = mbti2[2];

  if (p1TF === p2TF) {
    if (p1TF === 'T') {
      return `두 분 모두 사고형이라 논리적인 해결을 선호할 거예요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 문제 해결에 탁월한 능력을 발휘할 수 있습니다. 하지만 갈등 상황에서는 감정적인 부분도 중요해요. 상대방의 감정을 먼저 헤아리고, 그 다음에 논리적인 해결책을 제시하는 연습을 해보세요.`;
    } else {
      return `두 분 모두 감정형이라 서로의 감정을 중요하게 생각할 거예요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 서로에게 깊은 공감과 위로를 줄 수 있습니다. 하지만 갈등의 원인을 명확히 파악하고, 감정적인 지지뿐만 아니라 구체적인 해결 방안을 함께 모색하는 것이 중요해요. 때로는 이성적인 판단이 필요할 때도 있답니다.`;
    }
  } else {
    return `사고형의 분은 감정형의 분의 마음을 먼저 이해하려 노력하고, 감정형의 분은 사고형의 분의 논리적인 설명을 경청해 보세요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 서로의 강점을 활용하여 갈등을 해결한다면, 더욱 단단하고 성숙한 관계로 발전할 수 있을 거예요.`;
  }
}

// 현실과 가치관: MBTI(S/N) x 사주(토/재성) - 돈과 꿈의 밸런스 분석
function generateValuesAndRealitySummary(elem1: string, mbti1: MBTIType, elem2: string, mbti2: MBTIType, name1: string, name2: string): string {
  const p1SN = mbti1[1];
  const p2SN = mbti2[1];

  let summary = '';

  if (p1SN === p2SN) {
    if (p1SN === 'S') {
      summary = `두 분 모두 감각형(S)이라 현실적이고 실용적인 가치관을 가지고 있어요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 눈앞의 목표를 중요하게 생각하며, 안정적인 삶을 추구할 거예요. 하지만, 때로는 새로운 가능성이나 장기적인 비전을 놓칠 수 있으니, 가끔은 큰 그림을 그려보는 것도 좋아요.`;
    } else {
      summary = `두 분 모두 직관형(N)이라 이상적이고 추상적인 가치관을 가지고 있어요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 미래의 가능성과 꿈을 중요하게 생각하며, 새로운 아이디어를 탐구하는 것을 즐길 거예요. 하지만, 때로는 현실적인 문제에 소홀하거나, 비현실적인 목표를 세울 수 있으니 주의가 필요해요.`;
    }
  } else {
    summary = `${name1}님은 ${p1SN === 'S' ? '감각형(S)' : '직관형(N)'} 성향이고, ${name2}님은 ${p2SN === 'S' ? '감각형(S)' : '직관형(N)'} 성향이라 현실과 가치관에 대한 접근이 다를 수 있어요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 서로에게 부족한 부분을 채워줄 수 있습니다. ${p1SN === 'S' ? name1 : name2}님이 현실적인 기반을 다져주고, ${p1SN === 'N' ? name1 : name2}님이 새로운 방향을 제시해주면 완벽한 밸런스가 가능해요.`;
  }

  return summary;
}

function calculateValuesAndRealityScore(elem1: string, mbti1: MBTIType, elem2: string, mbti2: MBTIType): number {
  let score = 70;
  const p1SN = mbti1[1];
  const p2SN = mbti2[1];

  if (p1SN === p2SN) {
    score -= 5;
  } else {
    score += 10;
  }

  return Math.min(95, Math.max(50, score + Math.floor(Math.random() * 10 - 5)));
}

function generateValuesAndRealityAdvice(elem1: string, mbti1: MBTIType, elem2: string, mbti2: MBTIType, name1: string, name2: string): string {
  const p1SN = mbti1[1];
  const p2SN = mbti2[1];

  if (p1SN === p2SN) {
    if (p1SN === 'S') {
      return `두 분 모두 감각형이라 현실적인 목표를 중요하게 생각할 거예요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 안정적인 삶을 추구하며 현실적인 문제 해결에 강점을 보입니다. 하지만 가끔은 새로운 가능성을 탐색하고, 장기적인 비전을 함께 그려보는 시간을 가져보세요. 서로의 시야를 넓혀주는 계기가 될 수 있답니다.`;
    } else {
      return `두 분 모두 직관형이라 미래의 가능성과 꿈을 중요하게 생각할 거예요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 창의적인 아이디어와 통찰력으로 서로에게 영감을 줄 수 있습니다. 하지만 때로는 현실적인 문제에 대한 고려가 부족할 수 있어요. 서로의 아이디어를 현실에 적용할 수 있는 구체적인 계획을 세우고, 꾸준히 실행하는 노력이 필요해요.`;
    }
  } else {
    return `감각형의 분은 직관형의 분에게 현실적인 조언과 안정감을 제공하고, 직관형의 분은 감각형의 분에게 새로운 영감과 비전을 제시해 보세요. ${ELEMENT_KOREAN[elem1]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[elem2]} 기운의 ${name2}님은 서로의 강점을 인정하고 존중하면, 돈과 꿈의 밸런스를 완벽하게 맞출 수 있을 거예요.`;
  }
}

// 일상의 리듬: MBTI(P/J) x 사주(합/충) - 라이프스타일 조화도 분석
function generateDailyRhythmSummary(saju1: SajuResult, mbti1: MBTIType, saju2: SajuResult, mbti2: MBTIType, name1: string, name2: string): string {
  const getElementRhythmStyle = (element: string): string => {
    switch (element) {
      case '木': return '새로운 일을 시작하고 추진하는 데 에너지를 쏟는 경향이 있어요';
      case '火': return '열정적으로 활동하며 주변에 활력을 불어넣는 스타일이에요';
      case '土': return '안정적이고 꾸준하게 자신의 루틴을 지키는 것을 선호해요';
      case '金': return '정확하고 효율적으로 시간을 관리하며 목표를 달성하는 데 집중해요';
      case '水': return '유연하고 자유롭게 상황에 맞춰 변화하는 것을 즐겨요';
      default: return '';
    }
  };

  const p1PJ = mbti1[3];
  const p2PJ = mbti2[3];

  let summary = '';

  if (p1PJ === p2PJ) {
    if (p1PJ === 'J') {
      summary = `두 분 모두 계획적인(J) 성향이라 일상의 리듬이 체계적이고 안정적일 거예요. ${name1}님은 ${getElementRhythmStyle(saju1.dayPillar.stemElement)}이고, ${name2}님은 ${getElementRhythmStyle(saju2.dayPillar.stemElement)}이라, 미리 계획을 세우고 정해진 루틴을 따르는 것을 선호해요. 하지만, 때로는 너무 계획에 얽매여 유연성이 부족하거나, 즉흥적인 즐거움을 놓칠 수 있으니 주의하세요.`;
    } else {
      summary = `두 분 모두 즉흥적인(P) 성향이라 일상의 리듬이 자유롭고 유연할 거예요. ${name1}님은 ${getElementRhythmStyle(saju1.dayPillar.stemElement)}이고, ${name2}님은 ${getElementRhythmStyle(saju2.dayPillar.stemElement)}이라, 새로운 경험을 즐기고 변화에 잘 적응하는 것을 선호해요. 하지만, 때로는 너무 즉흥적이어서 중요한 일을 놓치거나, 계획성 부족으로 어려움을 겪을 수 있으니 주의가 필요해요.`;
    }
  } else {
    summary = `${name1}님은 ${p1PJ === 'J' ? '계획적인(J)' : '즉흥적인(P)'} 성향이고, ${name2}님은 ${p2PJ === 'J' ? '계획적인(J)' : '즉흥적인(P)'} 성향이라 일상의 리듬에 차이가 있을 수 있어요. ${name1}님은 ${getElementRhythmStyle(saju1.dayPillar.stemElement)}이고, ${name2}님은 ${getElementRhythmStyle(saju2.dayPillar.stemElement)}이라, 서로의 라이프스타일을 이해하고 조율하는 것이 중요해요. ${p1PJ === 'J' ? name1 : name2}님이 큰 틀을 잡아주고, ${p1PJ === 'P' ? name1 : name2}님이 거기에 재미와 변화를 더해주면 완벽한 밸런스가 될 거예요.`;
  }

  return summary;
}

function calculateDailyRhythmScore(saju1: SajuResult, mbti1: MBTIType, saju2: SajuResult, mbti2: MBTIType): number {
  let score = 70;
  const p1PJ = mbti1[3];
  const p2PJ = mbti2[3];

  if (p1PJ === p2PJ) {
    score += 5;
  } else {
    score += 10;
  }

  return Math.min(95, Math.max(50, score + Math.floor(Math.random() * 10 - 5)));
}

function generateDailyRhythmAdvice(saju1: SajuResult, mbti1: MBTIType, saju2: SajuResult, mbti2: MBTIType, name1: string, name2: string): string {
  const p1PJ = mbti1[3];
  const p2PJ = mbti2[3];

  if (p1PJ === p2PJ) {
    if (p1PJ === 'J') {
      return `두 분 모두 계획적인 성향이라 안정적인 일상을 함께 만들어갈 수 있어요. ${ELEMENT_KOREAN[saju1.dayPillar.stemElement]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[saju2.dayPillar.stemElement]} 기운의 ${name2}님은 꾸준함과 성실함으로 서로에게 든든한 버팀목이 될 것입니다. 하지만 가끔은 계획에서 벗어나 즉흥적인 즐거움을 찾아보는 것도 좋아요. 예상치 못한 행복이 기다리고 있을지도 몰라요.`;
    } else {
      return `두 분 모두 즉흥적인 성향이라 자유롭고 활기찬 일상을 함께할 수 있어요. ${ELEMENT_KOREAN[saju1.dayPillar.stemElement]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[saju2.dayPillar.stemElement]} 기운의 ${name2}님은 새로운 경험과 변화를 두려워하지 않으며, 서로에게 신선한 자극을 줄 수 있습니다. 하지만 중요한 일이나 약속은 미리 계획하고, 서로에게 공유하는 습관을 들이는 것이 중요해요. 작은 계획이 큰 즐거움을 가져다줄 수 있답니다.`;
    }
  } else {
    return `계획적인 분은 즉흥적인 분에게 안정감을 제공하고, 즉흥적인 분은 계획적인 분에게 새로운 활력을 불어넣어 줄 수 있어요. ${ELEMENT_KOREAN[saju1.dayPillar.stemElement]} 기운의 ${name1}님과 ${ELEMENT_KOREAN[saju2.dayPillar.stemElement]} 기운의 ${name2}님은 서로의 리듬을 존중하고 조율한다면, 지루할 틈 없는 다채로운 일상을 만들어갈 수 있을 거예요.`;
  }
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

  // 오행 균형 계산
  const balance1 = calculateElementBalance(saju1);
  const balance2 = calculateElementBalance(saju2);

  // 가장 강한 오행 추출
  const strongest1 = balance1.sort((a, b) => b.value - a.value)[0];
  const strongest2 = balance2.sort((a, b) => b.value - a.value)[0];

  // 1. 에너지 저울 (Dynamic Scale) 로직
  let person1Energy = 0;
  let person2Energy = 0;

  // 사주 오행 에너지 계산
  if (GENERATING[strongest1.name] === strongest2.name) {
    person1Energy += 2;
  } else if (OVERCOMING[strongest1.name] === strongest2.name) {
    person1Energy -= 1;
  }

  if (GENERATING[strongest2.name] === strongest1.name) {
    person2Energy += 2;
  } else if (OVERCOMING[strongest2.name] === strongest1.name) {
    person2Energy -= 1;
  }

  // MBTI 배려 성향 (F, P) 에너지 계산
  if (mbti1.includes('F')) person1Energy += 1;
  if (mbti1.includes('P')) person1Energy += 1;
  if (mbti1.includes('T')) person1Energy -= 1;
  if (mbti1.includes('J')) person1Energy -= 1;

  if (mbti2.includes('F')) person2Energy += 1;
  if (mbti2.includes('P')) person2Energy += 1;
  if (mbti2.includes('T')) person2Energy -= 1;
  if (mbti2.includes('J')) person2Energy -= 1;

  const balanceScore = person1Energy - person2Energy;
  let charger = '';
  let consumer = '';
  let energyDescription = '';

  if (balanceScore > 0) {
    charger = name1;
    consumer = name2;
    energyDescription = `${name1}님은 ${name2}님에게 활력을 불어넣는 '에너지 충전기' 역할을, ${name2}님은 ${name1}님의 에너지를 받아 성장하는 '에너지 소비자' 역할을 할 가능성이 높아요. ${name1}님의 긍정적인 기운이 ${name2}님에게 새로운 동기를 부여하고, ${name2}님은 그 에너지를 바탕으로 안정적인 발전을 이룰 수 있습니다. 서로의 강점을 이해하고 존중하면 더욱 시너지를 낼 수 있는 관계가 될 거예요.`;
  } else if (balanceScore < 0) {
    charger = name2;
    consumer = name1;
    energyDescription = `${name2}님은 ${name1}님에게 활력을 불어넣는 '에너지 충전기' 역할을, ${name1}님은 ${name2}님의 에너지를 받아 성장하는 '에너지 소비자' 역할을 할 가능성이 높아요. ${name2}님의 따뜻한 에너지가 ${name1}님을 안정시키고, ${name1}님은 그 에너지를 받아 현실적인 성과를 만들어낼 수 있습니다. 서로의 강점을 이해하고 존중하면 더욱 시너지를 낼 수 있는 관계가 될 거예요.`;
  } else {
    charger = '두 분 모두';
    consumer = '두 분 모두';
    energyDescription = '두 분은 서로 에너지를 주고받는 균형 잡힌 관계예요. 어느 한쪽으로 치우치지 않고, 서로에게 긍정적인 영향을 주며 함께 성장할 수 있는 이상적인 관계입니다. 마치 춤을 추듯, 서로의 리듬에 맞춰 에너지를 교환하며 아름다운 조화를 만들어낼 거예요. 서로의 존재만으로도 큰 힘이 되며, 함께라면 어떤 어려움도 헤쳐나갈 수 있는 든든한 동반자가 될 것입니다.';
  }

  const energyScale = {
    person1Energy,
    person2Energy,
    balanceScore,
    charger,
    consumer,
    description: energyDescription,
  };

  // 2. 하이브리드 시너지 카드 로직
  const mbtiInfo1 = MBTI_INFO[mbti1];
  const mbtiInfo2 = MBTI_INFO[mbti2];

  const nickname1 = `${ELEMENT_KOREAN[elem1]} ${mbtiInfo1.nickname}`;
  const nickname2 = `${ELEMENT_KOREAN[elem2]} ${mbtiInfo2.nickname}`;

  let combinedNickname = '';
  if (balanceScore > 0) {
    combinedNickname = `${ELEMENT_KOREAN[elem1]} 기운의 ${mbti1}이 ${ELEMENT_KOREAN[elem2]} 기운의 ${mbti2}를 이끌어가는 관계`;
  } else if (balanceScore < 0) {
    combinedNickname = `${ELEMENT_KOREAN[elem2]} 기운의 ${mbti2}가 ${ELEMENT_KOREAN[elem1]} 기운의 ${mbti1}을 이끌어가는 관계`;
  } else {
    combinedNickname = `${ELEMENT_KOREAN[elem1]} 기운의 ${mbti1}과 ${ELEMENT_KOREAN[elem2]} 기운의 ${mbti2}의 완벽한 조화`;
  }

  const energyBalance = {
    description: balanceScore > 0 
      ? `${name1}님의 ${ELEMENT_KOREAN[elem1]} 기운이 ${name2}님의 ${ELEMENT_KOREAN[elem2]} 기운을 이끌어주는 형국이에요.`
      : balanceScore < 0
      ? `${name2}님의 ${ELEMENT_KOREAN[elem2]} 기운이 ${name1}님의 ${ELEMENT_KOREAN[elem1]} 기운을 이끌어주는 형국이에요.`
      : `두 분의 ${ELEMENT_KOREAN[elem1]} 기운과 ${ELEMENT_KOREAN[elem2]} 기운이 완벽한 균형을 이루고 있어요.`,
    person1Role: balanceScore > 0 ? '리더' : balanceScore < 0 ? '서포터' : '동반자',
    person2Role: balanceScore < 0 ? '리더' : balanceScore > 0 ? '서포터' : '동반자',
  };

  const synergyCard = {
    nickname1,
    nickname2,
    nickname: combinedNickname,
    description: '두 분의 에너지가 만나 생성되는 특별한 시너지 효과예요.',
  };

  // 3. 4대 영역 하이브리드 리포트 (Accordion UI) 로직
  const fourDimensions = {
    communication: {
      title: '대화와 소통: 소통의 온도 분석',
      summary: generateCommunicationSummary(elem1, mbti1, elem2, mbti2, name1, name2),
      score: calculateCommunicationScore(elem1, mbti1, elem2, mbti2),
      advice: generateCommunicationAdvice(elem1, mbti1, elem2, mbti2, name1, name2),
    },
    conflictResolution: {
      title: '싸움과 화해: 갈등 해결 방식 분석',
      summary: generateConflictResolutionSummary(elem1, mbti1, elem2, mbti2, name1, name2),
      score: calculateConflictResolutionScore(elem1, mbti1, elem2, mbti2),
      advice: generateConflictResolutionAdvice(elem1, mbti1, elem2, mbti2, name1, name2),
    },
    valuesAndReality: {
      title: '현실과 가치관: 돈과 꿈의 밸런스 분석',
      summary: generateValuesAndRealitySummary(elem1, mbti1, elem2, mbti2, name1, name2),
      score: calculateValuesAndRealityScore(elem1, mbti1, elem2, mbti2),
      advice: generateValuesAndRealityAdvice(elem1, mbti1, elem2, mbti2, name1, name2),
    },
    dailyRhythm: {
      title: '일상의 리듬: 라이프스타일 조화도 분석',
      summary: generateDailyRhythmSummary(saju1, mbti1, saju2, mbti2, name1, name2),
      score: calculateDailyRhythmScore(saju1, mbti1, saju2, mbti2),
      advice: generateDailyRhythmAdvice(saju1, mbti1, saju2, mbti2, name1, name2),
    },
  };

  // 4. 인연 타임라인 (Visual Graph) 로직
  const mbtiResult = analyzeMBTICompatibility(mbti1, mbti2, name1, name2);
  const sajuRelation = analyzeSajuRelation(elem1, elem2);
  
  const timeline = {
    썸: Math.min(95, Math.max(50, Math.round(mbtiResult.score * 0.6 + sajuRelation.score * 0.4 + (Math.random() * 10 - 5)))),
    연애: Math.min(95, Math.max(50, Math.round(mbtiResult.score * 0.5 + sajuRelation.score * 0.5 + (Math.random() * 10 - 5)))),
    장기안정기: Math.min(95, Math.max(50, Math.round(sajuRelation.score * 0.6 + mbtiResult.score * 0.4 + (Math.random() * 10 - 5)))),
    description: '두 분의 관계는 시간이 지남에 따라 더욱 깊어지고 안정될 가능성이 높아요. 서로의 변화를 이해하고 함께 성장한다면 아름다운 인연을 이어갈 수 있을 거예요.',
  };

  // 5. 무운의 한 줄 처방전 로직
  const prescription = {
    luckyColor: `두 분에게 행운을 가져다줄 색상은 ${ELEMENT_KOREAN[strongest1.name]}과 ${ELEMENT_KOREAN[strongest2.name]} 계열이에요. 함께 있을 때 이 색상의 옷이나 소품을 활용하면 좋은 기운을 더욱 북돋아 줄 거예요.`,
    luckyItem: `서로에게 ${GENERATING[strongest1.name] === strongest2.name ? ELEMENT_KOREAN[strongest1.name] : ELEMENT_KOREAN[strongest2.name]} 기운을 가진 아이템을 선물해 보세요. 예를 들어, 나무 기운은 책이나 식물, 불 기운은 향초나 조명, 흙 기운은 도자기, 쇠 기운은 금속 액세서리, 물 기운은 수족관이나 분수 등이 있어요.`,
    tipForPartner: `상대방을 대할 때는 ${mbti1.includes('F') || mbti2.includes('F') ? '따뜻한 감정적 공감' : '명확한 논리적 이해'}을 바탕으로 대화하는 것이 좋아요. 서로의 언어를 이해하려는 작은 노력이 큰 차이를 만들 거예요.`,
  };

  // 기존 로직 유지
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

  // 크로스 분석
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

  // 종합 점수 계산 (사주 40%, MBTI 35%, 크로스 25%)
  const totalScore = Math.round(sajuRelation.score * 0.4 + mbtiResult.score * 0.35 + crossScore * 0.25);

  let totalGrade = "";
  if (totalScore >= 90) totalGrade = "환상의 궁합";
  else if (totalScore >= 80) totalGrade = "아주 좋은 궁합";
  else if (totalScore >= 70) totalGrade = "좋은 궁합";
  else if (totalScore >= 60) totalGrade = "보통 궁합";
  else totalGrade = "노력하면 좋은 궁합";

  const seed = (saju1.dayPillar.stem.charCodeAt(0) + saju2.dayPillar.stem.charCodeAt(0) + mbti1.charCodeAt(0) + mbti2.charCodeAt(0)) % 20;

  const detailScores = {
    love: Math.min(98, Math.max(40, Math.round(totalScore * 0.4 + mbtiResult.score * 0.4 + sajuRelation.score * 0.2 + (seed % 8) - 3))),
    communication: Math.min(98, Math.max(40, Math.round(mbtiResult.score * 0.5 + totalScore * 0.3 + crossScore * 0.2 + ((seed + 3) % 8) - 3))),
    marriage: Math.min(98, Math.max(40, Math.round(sajuRelation.score * 0.4 + totalScore * 0.35 + mbtiResult.score * 0.25 + ((seed + 5) % 8) - 3))),
    crisis: Math.min(98, Math.max(40, Math.round(crossScore * 0.35 + sajuRelation.score * 0.35 + mbtiResult.score * 0.3 + ((seed + 7) % 8) - 3)))
  };

  const keywords: string[] = [];
  let finalAdvice = `두 분의 관계를 더욱 아름답게 만들기 위해, ${mbtiResult.loveAdvice} 또한, ${sajuRelation.relation} 관계의 특성을 이해하고, 서로의 다름을 존중하는 자세가 중요해요. ${totalScore >= 80 ? '두 분은 이미 충분히 좋은 관계이지만, 서로에게 작은 노력을 더한다면 더욱 완벽한 관계가 될 거예요.' : '서로에게 조금 더 관심을 기울이고 노력한다면, 분명 좋은 관계로 발전할 수 있을 거예요.'}`;
  let recommendations = [...mbtiResult.dateRecommendations.slice(0, 2)];

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
    totalSummary: `두 분의 사주와 MBTI를 종합적으로 분석한 결과, ${totalGrade}에 해당해요. ${sajuRelation.description} ${mbtiResult.summary} ${crossChemistry}`,
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
    recommendations: recommendations.slice(0, 4),
    energyScale,
    energyBalance,
    synergyCard,
    fourDimensions,
    timeline,
    prescription
  };
}
