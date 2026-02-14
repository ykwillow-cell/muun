// MBTI 궁합 분석 라이브러리
// 16가지 MBTI 유형 간 궁합 점수 및 해석

export type MBTIType = 
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export const MBTI_TYPES: MBTIType[] = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
];

export interface MBTIInfo {
  type: MBTIType;
  title: string;
  nickname: string;
  traits: string[];
  loveStyle: string;
  strengths: string[];
  weaknesses: string[];
}

export const MBTI_INFO: Record<MBTIType, MBTIInfo> = {
  ISTJ: {
    type: 'ISTJ', title: '청렴결백한 논리주의자', nickname: '신뢰의 아이콘',
    traits: ['책임감', '성실함', '체계적', '전통 중시'],
    loveStyle: '한번 마음을 주면 끝까지 지키는 타입이에요. 말보다 행동으로 사랑을 표현하고, 약속은 반드시 지켜요.',
    strengths: ['약속을 철저히 지킴', '경제적으로 안정적', '가정에 헌신적'],
    weaknesses: ['감정 표현이 서툴 수 있음', '변화를 어려워할 수 있음']
  },
  ISFJ: {
    type: 'ISFJ', title: '용감한 수호자', nickname: '따뜻한 수호천사',
    traits: ['헌신적', '따뜻함', '세심함', '배려심'],
    loveStyle: '상대방의 작은 변화도 놓치지 않는 세심한 연인이에요. 기념일을 꼭 챙기고, 상대의 취향을 기억해요.',
    strengths: ['세심한 배려', '안정적인 관계 유지', '가족을 최우선으로 생각'],
    weaknesses: ['자기 희생이 과할 수 있음', '갈등을 회피하려는 경향']
  },
  INFJ: {
    type: 'INFJ', title: '선의의 옹호자', nickname: '영혼의 상담사',
    traits: ['통찰력', '이상주의', '공감능력', '창의성'],
    loveStyle: '영혼까지 깊이 연결되는 관계를 원해요. 표면적인 만남보다 진정한 이해와 교감을 추구해요.',
    strengths: ['깊은 감정적 교감', '상대를 진심으로 이해', '의미 있는 관계 추구'],
    weaknesses: ['이상이 너무 높을 수 있음', '혼자만의 시간이 많이 필요']
  },
  INTJ: {
    type: 'INTJ', title: '용의주도한 전략가', nickname: '마스터 플래너',
    traits: ['전략적', '독립적', '분석적', '목표지향'],
    loveStyle: '연애도 전략적으로 접근하는 타입이에요. 하지만 한번 마음을 열면 누구보다 깊고 진지한 사랑을 해요.',
    strengths: ['장기적 비전 제시', '문제 해결 능력', '지적인 대화 가능'],
    weaknesses: ['감정 표현이 부족할 수 있음', '완벽주의 성향']
  },
  ISTP: {
    type: 'ISTP', title: '만능 재주꾼', nickname: '쿨한 해결사',
    traits: ['실용적', '적응력', '분석적', '독립적'],
    loveStyle: '자유로운 영혼이지만, 좋아하는 사람에게는 묵묵히 곁을 지켜요. 말보다 행동으로 보여주는 스타일이에요.',
    strengths: ['위기 상황에서 침착함', '실질적인 도움을 잘 줌', '간섭하지 않는 편안함'],
    weaknesses: ['감정 표현이 서툴 수 있음', '장기 계획을 어려워할 수 있음']
  },
  ISFP: {
    type: 'ISFP', title: '호기심 많은 예술가', nickname: '감성 예술가',
    traits: ['감성적', '자유로움', '예술적', '온화함'],
    loveStyle: '조용하지만 깊은 감성으로 사랑해요. 함께하는 순간순간을 소중히 여기고, 작은 것에서 행복을 찾아요.',
    strengths: ['감성적인 교감', '현재를 즐기는 능력', '상대를 있는 그대로 받아들임'],
    weaknesses: ['갈등 상황을 피하려 함', '미래 계획에 소홀할 수 있음']
  },
  INFP: {
    type: 'INFP', title: '열정적인 중재자', nickname: '낭만적 몽상가',
    traits: ['이상주의', '공감능력', '창의성', '진정성'],
    loveStyle: '동화 같은 사랑을 꿈꿔요. 상대의 내면을 깊이 이해하고, 진심 어린 감정을 나누는 관계를 원해요.',
    strengths: ['깊은 감정적 유대', '상대의 잠재력을 발견', '진심 어린 소통'],
    weaknesses: ['현실과 이상의 괴리', '상처받기 쉬운 마음']
  },
  INTP: {
    type: 'INTP', title: '논리적인 사색가', nickname: '천재 분석가',
    traits: ['논리적', '호기심', '독창적', '분석적'],
    loveStyle: '지적인 교감이 사랑의 시작이에요. 같이 토론하고 새로운 아이디어를 나눌 수 있는 관계를 좋아해요.',
    strengths: ['지적인 자극 제공', '독창적인 시각', '논리적 문제 해결'],
    weaknesses: ['감정 표현이 서툴 수 있음', '일상적인 것에 무관심할 수 있음']
  },
  ESTP: {
    type: 'ESTP', title: '모험을 즐기는 사업가', nickname: '에너지 넘치는 모험가',
    traits: ['활동적', '현실적', '대담함', '사교적'],
    loveStyle: '함께 모험하고 새로운 경험을 나누는 걸 좋아해요. 지루한 건 못 참고, 매 순간을 신나게 만들어요.',
    strengths: ['활기찬 관계', '즉각적인 문제 해결', '재미있는 데이트 기획'],
    weaknesses: ['장기적 약속을 어려워할 수 있음', '감정적 깊이가 부족할 수 있음']
  },
  ESFP: {
    type: 'ESFP', title: '자유로운 영혼의 연예인', nickname: '파티의 주인공',
    traits: ['사교적', '낙천적', '즉흥적', '열정적'],
    loveStyle: '사랑할 때 온 세상이 무대가 돼요. 상대를 웃게 만드는 걸 좋아하고, 함께하는 모든 순간을 축제로 만들어요.',
    strengths: ['밝은 에너지 전달', '현재를 즐기는 능력', '상대를 즐겁게 해줌'],
    weaknesses: ['진지한 대화를 피할 수 있음', '계획성이 부족할 수 있음']
  },
  ENFP: {
    type: 'ENFP', title: '재기발랄한 활동가', nickname: '아이디어 뱅크',
    traits: ['열정적', '창의적', '자유로움', '공감능력'],
    loveStyle: '"우리 갑자기 바다 갈래?" 같은 즉흥적인 제안을 잘 해요. 어디를 가든 분위기를 밝게 만드는 에너지가 있어요.',
    strengths: ['끊임없는 새로움', '깊은 감정적 교감', '상대의 잠재력 발견'],
    weaknesses: ['집중력이 분산될 수 있음', '현실적 문제에 소홀할 수 있음']
  },
  ENTP: {
    type: 'ENTP', title: '뜨거운 논쟁을 즐기는 변론가', nickname: '아이디어 폭격기',
    traits: ['창의적', '논쟁적', '도전적', '유머러스'],
    loveStyle: '지적인 대화가 최고의 데이트예요. 상대와 토론하고, 새로운 관점을 나누는 걸 사랑의 표현으로 여겨요.',
    strengths: ['지루할 틈 없는 관계', '창의적 문제 해결', '유머 감각'],
    weaknesses: ['논쟁이 과할 수 있음', '감정보다 논리를 앞세울 수 있음']
  },
  ESTJ: {
    type: 'ESTJ', title: '엄격한 관리자', nickname: '계획의 달인',
    traits: ['체계적', '책임감', '현실적', '리더십'],
    loveStyle: '약속 시간 10분 전에 도착하고, 여행 전에 일정표를 짜는 타입. 연인에게도 든든한 버팀목이 되어줘요.',
    strengths: ['안정적인 관계 유지', '책임감 있는 파트너', '실질적인 지원'],
    weaknesses: ['융통성이 부족할 수 있음', '상대를 통제하려 할 수 있음']
  },
  ESFJ: {
    type: 'ESFJ', title: '사교적인 외교관', nickname: '사랑의 전도사',
    traits: ['사교적', '배려심', '조화로움', '헌신적'],
    loveStyle: '사랑하는 사람을 위해서라면 뭐든 해주고 싶어요. 주변 사람들과의 관계도 잘 챙기는 따뜻한 연인이에요.',
    strengths: ['따뜻한 분위기 조성', '주변 관계까지 챙김', '헌신적인 사랑'],
    weaknesses: ['타인의 평가에 민감할 수 있음', '자기 희생이 과할 수 있음']
  },
  ENFJ: {
    type: 'ENFJ', title: '정의로운 사회운동가', nickname: '타고난 리더',
    traits: ['카리스마', '공감능력', '이타적', '소통력'],
    loveStyle: '상대의 성장을 진심으로 응원하고, 함께 더 나은 사람이 되고 싶어해요. 관계에서 깊은 의미를 추구해요.',
    strengths: ['상대의 성장을 도움', '깊은 감정적 교감', '소통 능력 뛰어남'],
    weaknesses: ['상대에게 너무 많은 기대를 할 수 있음', '자기 감정을 뒤로 미룰 수 있음']
  },
  ENTJ: {
    type: 'ENTJ', title: '대담한 통솔자', nickname: '타고난 CEO',
    traits: ['리더십', '전략적', '결단력', '목표지향'],
    loveStyle: '연애에서도 리더십을 발휘해요. 상대와 함께 목표를 세우고 달성해 나가는 파워 커플을 꿈꿔요.',
    strengths: ['강한 추진력', '명확한 방향 제시', '문제 해결 능력'],
    weaknesses: ['상대의 감정을 간과할 수 있음', '지나친 주도권 행사']
  }
};

// MBTI 궁합 점수 매트릭스 (심리학 이론 기반)
// 점수: 0~100
const MBTI_COMPAT_MATRIX: Record<MBTIType, Record<MBTIType, number>> = {
  ISTJ: { ISTJ: 65, ISFJ: 72, INFJ: 60, INTJ: 70, ISTP: 75, ISFP: 68, INFP: 55, INTP: 65, ESTP: 80, ESFP: 78, ENFP: 62, ENTP: 60, ESTJ: 70, ESFJ: 82, ENFJ: 58, ENTJ: 68 },
  ISFJ: { ISTJ: 72, ISFJ: 68, INFJ: 70, INTJ: 58, ISTP: 65, ISFP: 75, INFP: 68, INTP: 55, ESTP: 72, ESFP: 80, ENFP: 70, ENTP: 58, ESTJ: 78, ESFJ: 75, ENFJ: 72, ENTJ: 60 },
  INFJ: { ISTJ: 60, ISFJ: 70, INFJ: 65, INTJ: 78, ISTP: 55, ISFP: 68, INFP: 75, INTP: 72, ESTP: 52, ESFP: 60, ENFP: 88, ENTP: 85, ESTJ: 55, ESFJ: 68, ENFJ: 80, ENTJ: 82 },
  INTJ: { ISTJ: 70, ISFJ: 58, INFJ: 78, INTJ: 68, ISTP: 72, ISFP: 55, INFP: 70, INTP: 80, ESTP: 58, ESFP: 50, ENFP: 82, ENTP: 88, ESTJ: 65, ESFJ: 52, ENFJ: 78, ENTJ: 75 },
  ISTP: { ISTJ: 75, ISFJ: 65, INFJ: 55, INTJ: 72, ISTP: 68, ISFP: 72, INFP: 58, INTP: 75, ESTP: 78, ESFP: 80, ENFP: 65, ENTP: 72, ESTJ: 82, ESFJ: 70, ENFJ: 60, ENTJ: 75 },
  ISFP: { ISTJ: 68, ISFJ: 75, INFJ: 68, INTJ: 55, ISTP: 72, ISFP: 65, INFP: 72, INTP: 58, ESTP: 78, ESFP: 75, ENFP: 78, ENTP: 62, ESTJ: 82, ESFJ: 85, ENFJ: 88, ENTJ: 72 },
  INFP: { ISTJ: 55, ISFJ: 68, INFJ: 75, INTJ: 70, ISTP: 58, ISFP: 72, INFP: 62, INTP: 72, ESTP: 55, ESFP: 68, ENFP: 75, ENTP: 78, ESTJ: 58, ESFJ: 65, ENFJ: 88, ENTJ: 82 },
  INTP: { ISTJ: 65, ISFJ: 55, INFJ: 72, INTJ: 80, ISTP: 75, ISFP: 58, INFP: 72, INTP: 68, ESTP: 68, ESFP: 58, ENFP: 78, ENTP: 82, ESTJ: 62, ESFJ: 55, ENFJ: 75, ENTJ: 85 },
  ESTP: { ISTJ: 80, ISFJ: 72, INFJ: 52, INTJ: 58, ISTP: 78, ISFP: 78, INFP: 55, INTP: 68, ESTP: 70, ESFP: 82, ENFP: 72, ENTP: 78, ESTJ: 75, ESFJ: 80, ENFJ: 62, ENTJ: 72 },
  ESFP: { ISTJ: 78, ISFJ: 80, INFJ: 60, INTJ: 50, ISTP: 80, ISFP: 75, INFP: 68, INTP: 58, ESTP: 82, ESFP: 72, ENFP: 80, ENTP: 72, ESTJ: 78, ESFJ: 82, ENFJ: 70, ENTJ: 62 },
  ENFP: { ISTJ: 62, ISFJ: 70, INFJ: 88, INTJ: 82, ISTP: 65, ISFP: 78, INFP: 75, INTP: 78, ESTP: 72, ESFP: 80, ENFP: 70, ENTP: 82, ESTJ: 68, ESFJ: 75, ENFJ: 85, ENTJ: 80 },
  ENTP: { ISTJ: 60, ISFJ: 58, INFJ: 85, INTJ: 88, ISTP: 72, ISFP: 62, INFP: 78, INTP: 82, ESTP: 78, ESFP: 72, ENFP: 82, ENTP: 70, ESTJ: 65, ESFJ: 60, ENFJ: 80, ENTJ: 82 },
  ESTJ: { ISTJ: 70, ISFJ: 78, INFJ: 55, INTJ: 65, ISTP: 82, ISFP: 82, INFP: 58, INTP: 62, ESTP: 75, ESFP: 78, ENFP: 68, ENTP: 65, ESTJ: 68, ESFJ: 80, ENFJ: 65, ENTJ: 75 },
  ESFJ: { ISTJ: 82, ISFJ: 75, INFJ: 68, INTJ: 52, ISTP: 70, ISFP: 85, INFP: 65, INTP: 55, ESTP: 80, ESFP: 82, ENFP: 75, ENTP: 60, ESTJ: 80, ESFJ: 72, ENFJ: 78, ENTJ: 62 },
  ENFJ: { ISTJ: 58, ISFJ: 72, INFJ: 80, INTJ: 78, ISTP: 60, ISFP: 88, INFP: 88, INTP: 75, ESTP: 62, ESFP: 70, ENFP: 85, ENTP: 80, ESTJ: 65, ESFJ: 78, ENFJ: 72, ENTJ: 80 },
  ENTJ: { ISTJ: 68, ISFJ: 60, INFJ: 82, INTJ: 75, ISTP: 75, ISFP: 72, INFP: 82, INTP: 85, ESTP: 72, ESFP: 62, ENFP: 80, ENTP: 82, ESTJ: 75, ESFJ: 62, ENFJ: 80, ENTJ: 70 }
};

// MBTI 궁합 점수 조회
export function getMBTICompatScore(type1: MBTIType, type2: MBTIType): number {
  return MBTI_COMPAT_MATRIX[type1]?.[type2] || 60;
}

// 두 MBTI의 차원별 분석
export interface MBTIDimensionAnalysis {
  dimension: string;
  person1: string;
  person2: string;
  same: boolean;
  description: string;
  chemistry: string;
}

export function analyzeMBTIDimensions(type1: MBTIType, type2: MBTIType, name1: string, name2: string): MBTIDimensionAnalysis[] {
  const dims = [
    { idx: 0, name: '에너지 방향', options: { same: ['E', '외향(E)'], diff: ['I', '내향(I)'] } },
    { idx: 1, name: '인식 기능', options: { same: ['S', '감각(S)'], diff: ['N', '직관(N)'] } },
    { idx: 2, name: '판단 기능', options: { same: ['T', '사고(T)'], diff: ['F', '감정(F)'] } },
    { idx: 3, name: '생활 양식', options: { same: ['J', '판단(J)'], diff: ['P', '인식(P)'] } }
  ];

  const dimensionDescriptions: Record<string, { same: string; diff: string }> = {
    '에너지 방향': {
      same: type1[0] === 'E' 
        ? `둘 다 외향적(E)이라 함께 있으면 에너지가 넘쳐요! 같이 사람 만나고, 새로운 곳에 가는 걸 좋아해서 활발한 관계가 될 거예요. 다만 둘 다 밖으로만 향하다 보면 깊은 대화가 부족해질 수 있으니, 가끔은 둘만의 조용한 시간도 가져보세요.`
        : `둘 다 내향적(I)이라 서로의 혼자만의 시간을 존중해줄 수 있어요. 조용히 함께 있는 것만으로도 편안한 관계예요. 다만 둘 다 먼저 말을 꺼내기 어려워할 수 있으니, 중요한 이야기는 의식적으로 나누는 연습이 필요해요.`,
      diff: `${name1}님은 ${type1[0] === 'E' ? '사람들과 어울리며 에너지를 충전하는 외향형' : '혼자만의 시간에서 에너지를 얻는 내향형'}이고, ${name2}님은 ${type2[0] === 'E' ? '외향형' : '내향형'}이에요. 처음엔 "이 사람은 왜 이렇게 ${type1[0] === 'E' ? '조용하지?' : '시끄럽지?'}" 할 수 있지만, 시간이 지나면 서로에게 없는 부분을 채워주는 완벽한 밸런스가 돼요.`
    },
    '인식 기능': {
      same: type1[1] === 'S'
        ? `둘 다 감각형(S)이라 현실적이고 구체적인 것을 좋아해요. "오늘 뭐 먹을까?" 같은 일상적인 대화도 잘 통하고, 실질적인 계획을 함께 세우는 데 문제가 없어요.`
        : `둘 다 직관형(N)이라 미래의 가능성과 아이디어에 대해 이야기하는 걸 좋아해요. "만약에~" "혹시~" 같은 상상의 대화가 끝없이 이어질 수 있어요. 다만 현실적인 부분을 놓칠 수 있으니 가끔은 발밑도 살펴보세요.`,
      diff: `${name1}님은 ${type1[1] === 'S' ? '눈에 보이는 현실과 구체적인 사실을 중시하는 감각형' : '가능성과 큰 그림을 보는 직관형'}이고, ${name2}님은 ${type2[1] === 'S' ? '감각형' : '직관형'}이에요. ${type1[1] === 'S' ? name1 : name2}님이 현실적인 기반을 다져주고, ${type1[1] === 'N' ? name1 : name2}님이 새로운 방향을 제시해주는 환상의 팀워크가 가능해요.`
    },
    '판단 기능': {
      same: type1[2] === 'T'
        ? `둘 다 사고형(T)이라 논리적으로 문제를 해결하는 걸 좋아해요. 감정에 휘둘리지 않고 합리적인 결정을 내릴 수 있어요. 다만 서로의 감정을 표현하는 연습이 필요해요. "사랑해"라는 말, 가끔은 논리 없이 그냥 해주세요!`
        : `둘 다 감정형(F)이라 서로의 마음을 잘 이해해요. 공감 능력이 뛰어나서 상대가 힘들 때 진심으로 위로해줄 수 있어요. 다만 둘 다 감정적으로 반응하면 갈등이 커질 수 있으니, 한 발 물러서서 생각하는 연습도 해보세요.`,
      diff: `${name1}님은 ${type1[2] === 'T' ? '논리와 원칙으로 판단하는 사고형' : '사람의 마음과 가치를 중시하는 감정형'}이고, ${name2}님은 ${type2[2] === 'T' ? '사고형' : '감정형'}이에요. 이 조합이 사실 연애에서 가장 좋은 궁합 중 하나예요! ${type1[2] === 'T' ? name1 : name2}님의 논리가 ${type1[2] === 'F' ? name1 : name2}님의 감성과 만나면, 머리와 가슴이 모두 만족하는 결정을 내릴 수 있거든요.`
    },
    '생활 양식': {
      same: type1[3] === 'J'
        ? `둘 다 판단형(J)이라 계획적이고 체계적인 생활을 좋아해요. 여행 계획도 꼼꼼하게 세우고, 약속 시간도 잘 지켜요. 다만 "내 계획이 맞아!" vs "아니, 내 계획이 맞아!" 같은 충돌이 있을 수 있으니, 서로 양보하는 연습이 필요해요.`
        : `둘 다 인식형(P)이라 즉흥적이고 유연한 생활을 좋아해요. "오늘 뭐 할까?" "글쎄, 일단 나가보자!" 같은 자유로운 관계예요. 다만 중요한 일은 미루지 않도록 서로 챙겨주는 게 좋아요.`,
      diff: `${name1}님은 ${type1[3] === 'J' ? '계획적이고 체계적인 판단형' : '유연하고 즉흥적인 인식형'}이고, ${name2}님은 ${type2[3] === 'J' ? '판단형' : '인식형'}이에요. ${type1[3] === 'J' ? name1 : name2}님이 큰 틀을 잡아주고, ${type1[3] === 'P' ? name1 : name2}님이 거기에 재미와 변화를 더해주면 완벽한 밸런스가 돼요!`
    }
  };

  return dims.map(dim => {
    const c1 = type1[dim.idx];
    const c2 = type2[dim.idx];
    const same = c1 === c2;
    const desc = dimensionDescriptions[dim.name];
    
    return {
      dimension: dim.name,
      person1: `${c1}`,
      person2: `${c2}`,
      same,
      description: same ? desc.same : desc.diff,
      chemistry: same ? '공감형' : '보완형'
    };
  });
}

// MBTI 궁합 종합 해석 생성
export interface MBTICompatResult {
  score: number;
  grade: string;
  summary: string;
  chemistryPoints: string[];
  cautionPoints: string[];
  loveAdvice: string;
  dateRecommendations: string[];
  dimensions: MBTIDimensionAnalysis[];
}

export function analyzeMBTICompatibility(
  type1: MBTIType, type2: MBTIType,
  name1: string, name2: string
): MBTICompatResult {
  const score = getMBTICompatScore(type1, type2);
  const info1 = MBTI_INFO[type1];
  const info2 = MBTI_INFO[type2];
  const dimensions = analyzeMBTIDimensions(type1, type2, name1, name2);
  
  const sameCount = dimensions.filter(d => d.same).length;
  
  let grade: string;
  let summary: string;
  
  if (score >= 85) {
    grade = '천생연분';
    summary = `${name1}님(${type1})과 ${name2}님(${type2})은 성격적으로 정말 잘 맞는 조합이에요! 서로를 이해하고 보완해주는 힘이 강해서, 함께 있으면 자연스럽게 시너지가 나는 관계예요. 이런 조합은 흔치 않으니, 서로를 만난 건 정말 행운이에요.`;
  } else if (score >= 75) {
    grade = '좋은 궁합';
    summary = `${name1}님(${type1})과 ${name2}님(${type2})은 서로에게 긍정적인 영향을 주는 좋은 조합이에요. 비슷한 부분에서는 편안함을, 다른 부분에서는 새로운 자극을 느낄 수 있어요. 서로의 차이를 존중하면 더욱 깊은 관계로 발전할 수 있어요.`;
  } else if (score >= 65) {
    grade = '노력하면 좋은 궁합';
    summary = `${name1}님(${type1})과 ${name2}님(${type2})은 서로 다른 매력이 있는 조합이에요. 처음엔 "이 사람 왜 이러지?" 할 수 있지만, 알아갈수록 "아, 이런 면이 있구나" 하며 서로를 이해하게 돼요. 소통을 잘하면 오히려 가장 단단한 관계가 될 수 있어요.`;
  } else {
    grade = '도전적인 궁합';
    summary = `${name1}님(${type1})과 ${name2}님(${type2})은 서로 많이 다른 타입이에요. 하지만 "다르다"가 "안 맞다"는 아니에요! 오히려 완전히 다른 시각을 가진 두 사람이 만나면, 혼자서는 절대 볼 수 없었던 세상을 함께 볼 수 있어요. 서로를 이해하려는 노력이 필요하지만, 그만큼 성장할 수 있는 관계예요.`;
  }

  // 케미 포인트 생성
  const chemistryPoints: string[] = [];
  if (type1[0] !== type2[0]) {
    chemistryPoints.push(`${type1[0] === 'E' ? name1 : name2}님이 새로운 사람과 경험을 소개해주고, ${type1[0] === 'I' ? name1 : name2}님이 깊이 있는 대화와 안정감을 제공해요`);
  } else if (type1[0] === 'E') {
    chemistryPoints.push('둘 다 활발해서 함께하면 에너지가 두 배! 어디를 가든 분위기 메이커 커플이에요');
  } else {
    chemistryPoints.push('서로의 조용한 시간을 존중해주는 편안한 관계예요. 말없이 함께 있어도 행복한 커플이에요');
  }
  
  if (type1[2] !== type2[2]) {
    chemistryPoints.push(`${type1[2] === 'T' ? name1 : name2}님의 논리적 판단과 ${type1[2] === 'F' ? name1 : name2}님의 따뜻한 감성이 만나 머리와 가슴이 모두 만족하는 결정을 내릴 수 있어요`);
  }
  
  if (type1[3] !== type2[3]) {
    chemistryPoints.push(`${type1[3] === 'J' ? name1 : name2}님이 안정적인 틀을 잡아주고, ${type1[3] === 'P' ? name1 : name2}님이 재미와 변화를 더해줘서 지루할 틈이 없어요`);
  }

  if (info1.traits.some(t => info2.traits.includes(t))) {
    const common = info1.traits.filter(t => info2.traits.includes(t));
    chemistryPoints.push(`두 분 모두 '${common[0]}'이라는 공통점이 있어서 서로를 깊이 이해할 수 있어요`);
  }

  // 주의 포인트 생성
  const cautionPoints: string[] = [];
  if (type1[0] !== type2[0]) {
    cautionPoints.push(`${type1[0] === 'E' ? name1 : name2}님은 함께 시간을 보내고 싶고, ${type1[0] === 'I' ? name1 : name2}님은 혼자만의 시간이 필요할 때가 있어요. 서로의 에너지 충전 방식을 이해해주세요`);
  }
  if (type1[2] !== type2[2]) {
    cautionPoints.push(`의견 충돌이 있을 때 ${type1[2] === 'T' ? name1 : name2}님은 논리로, ${type1[2] === 'F' ? name1 : name2}님은 감정으로 접근할 수 있어요. "맞다/틀리다"가 아니라 "다르다"는 걸 기억해주세요`);
  }
  if (sameCount <= 1) {
    cautionPoints.push('성격 차이가 큰 만큼 오해가 생길 수 있어요. 중요한 건 "왜 그렇게 생각해?"라고 물어보는 거예요. 대부분의 갈등은 소통으로 해결돼요');
  }
  if (cautionPoints.length === 0) {
    cautionPoints.push('비슷한 성격이라 편안하지만, 가끔은 새로운 시도를 함께 해보세요. 같은 방향만 보다 보면 놓치는 것들이 있을 수 있어요');
  }

  // 연애 조언
  let loveAdvice: string;
  if (score >= 85) {
    loveAdvice = `두 분은 만나기만 해도 자연스럽게 잘 맞는 커플이에요. 하지만 "잘 맞으니까 괜찮겠지"라는 안일함은 금물이에요. 좋은 관계도 가꿔야 더 좋아져요. 서로에게 고마운 마음을 자주 표현하고, 새로운 경험을 함께 하면서 관계를 더욱 풍성하게 만들어가세요.`;
  } else if (score >= 75) {
    loveAdvice = `두 분은 서로의 장점을 잘 살려줄 수 있는 조합이에요. ${name1}님의 ${info1.strengths[0]}과(와) ${name2}님의 ${info2.strengths[0]}이(가) 만나면 최고의 팀이 될 수 있어요. 가끔 의견이 다를 때는 "이 사람은 왜 이렇게 생각할까?"를 먼저 생각해보세요.`;
  } else if (score >= 65) {
    loveAdvice = `두 분은 서로에게 배울 점이 많은 관계예요. ${name1}님은 ${name2}님에게서 ${info2.strengths[0]}을(를) 배울 수 있고, ${name2}님은 ${name1}님에게서 ${info1.strengths[0]}을(를) 배울 수 있어요. 차이를 불편함이 아닌 성장의 기회로 바라보세요.`;
  } else {
    loveAdvice = `솔직히 말하면, 두 분은 노력이 필요한 관계예요. 하지만 세상에서 가장 강한 커플은 "잘 맞아서 함께하는 커플"이 아니라 "다르지만 함께하기로 선택한 커플"이에요. 서로의 다름을 인정하고, 매일 조금씩 이해의 폭을 넓혀가세요.`;
  }

  // 데이트 추천
  const dateRecommendations: string[] = [];
  if (type1[0] === 'E' || type2[0] === 'E') {
    dateRecommendations.push('새로운 맛집 탐방이나 팝업 스토어 방문 - 함께 새로운 경험을 나눠보세요');
  }
  if (type1[0] === 'I' || type2[0] === 'I') {
    dateRecommendations.push('집에서 함께 영화 보기나 보드게임 - 편안한 공간에서의 교감이 관계를 깊게 해요');
  }
  if (type1[1] === 'N' || type2[1] === 'N') {
    dateRecommendations.push('미술관이나 전시회 관람 - 서로의 생각을 나누며 지적 교감을 즐겨보세요');
  }
  if (type1[1] === 'S' || type2[1] === 'S') {
    dateRecommendations.push('요리 클래스나 공방 체험 - 함께 무언가를 만드는 과정에서 유대감이 커져요');
  }
  if (type1[3] === 'P' || type2[3] === 'P') {
    dateRecommendations.push('즉흥 드라이브나 여행 - 계획 없이 떠나는 모험이 특별한 추억이 돼요');
  }

  return {
    score,
    grade,
    summary,
    chemistryPoints,
    cautionPoints,
    loveAdvice,
    dateRecommendations,
    dimensions
  };
}
