export interface ColumnData {
  id: string;
  title: string;
  description: string;
  category: 'basic' | 'luck' | 'relationship' | 'health' | 'money' | 'flow';
  author: string;
  publishedDate: string;
  readTime: number;
  thumbnail: string;
  keywords: string[];
  content: string;
  relatedServiceUrl?: string;
}

export const COLUMN_CATEGORIES = {
  basic: { label: '사주 기초', color: 'bg-blue-500/20 text-blue-400' },
  luck: { label: '개운법', color: 'bg-yellow-500/20 text-yellow-400' },
  relationship: { label: '관계 & 궁합', color: 'bg-pink-500/20 text-pink-400' },
  health: { label: '건강 & 운', color: 'bg-green-500/20 text-green-400' },
  money: { label: '재물운', color: 'bg-purple-500/20 text-purple-400' },
  flow: { label: '운명의 흐름', color: 'bg-indigo-500/20 text-indigo-400' },
};

export const columns: ColumnData[] = [
  {
    id: "column-001",
    title: "인생의 대운이 바뀌기 전, 반드시 나타나는 징조 3가지",
    description: "10년마다 바뀌는 대운의 변화. 그 전환점에서 나타나는 신호들을 미리 알아두면 인생의 기회를 잡을 수 있습니다.",
    category: "luck",
    author: "무운 역술팀",
    publishedDate: "2026-02-21",
    readTime: 6,
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    keywords: ["운 바뀌는 징조", "대운 변화", "개운법", "사주 팔자"],
    content: `<div class="prose prose-invert max-w-none"><h2>인생의 대운이 바뀌기 전, 반드시 나타나는 징조 3가지</h2><p>우리의 삶은 10년마다 큰 흐름의 변화를 맞이합니다. 이를 명리학에서는 '대운(大運)'이라고 부릅니다. 대운이 바뀌는 시기에는 마치 계절이 바뀌듯 우리 주변의 환경과 내면의 상태에 뚜렷한 변화가 나타납니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-002",
    title: "내 사주팔자 스스로 보는 법: 만세력 8글자의 비밀",
    description: "사주의 기본이 되는 8글자(년월일시)의 의미를 알면, 자신의 사주를 훨씬 더 깊이 있게 이해할 수 있습니다.",
    category: "basic",
    author: "무운 역술팀",
    publishedDate: "2026-02-20",
    readTime: 7,
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    keywords: ["사주 보는 법", "만세력 해석", "사주 팔자 기초"],
    content: `<div class="prose prose-invert max-w-none"><h2>내 사주팔자 스스로 보는 법: 만세력 8글자의 비밀</h2><p>사주팔자라는 말은 익숙하지만, 막상 내 사주를 보려고 하면 한자 투성이라 막막하셨죠? 사주(四柱)는 말 그대로 네 개의 기둥이고, 팔자(八字)는 여덟 개의 글자를 의미합니다.</p></div>`,
    relatedServiceUrl: "/manselyeok"
  },
  {
    id: "column-003",
    title: "자녀의 학업운을 높여주는 사주별 공부 환경 조성법",
    description: "아이의 사주 특징을 이해하고 그에 맞는 학습 환경을 만들어주면, 아이의 잠재력을 더 잘 발휘하게 할 수 있습니다.",
    category: "money",
    author: "무운 역술팀",
    publishedDate: "2026-02-19",
    readTime: 8,
    thumbnail: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=600&fit=crop",
    keywords: ["자녀 사주", "공부운", "학업운", "문창귀인"],
    content: `<div class="prose prose-invert max-w-none"><h2>자녀의 학업운을 높여주는 사주별 공부 환경 조성법</h2><p>부모라면 누구나 자녀가 공부를 즐겁게 하고 성취를 얻길 바랍니다. 하지만 모든 아이에게 똑같은 공부 방식을 강요하는 것은 효율적이지 않습니다.</p></div>`,
    relatedServiceUrl: "/family-saju"
  },
  {
    id: "column-004",
    title: "사주 오행(목화토금수) 자가 진단: 나에게 부족한 기운 찾기",
    description: "사주의 기본이 되는 오행 기운을 이해하고 자신에게 부족한 기운을 찾아 보완하는 방법을 소개합니다.",
    category: "basic",
    author: "무운 역술팀",
    publishedDate: "2026-02-18",
    readTime: 8,
    thumbnail: "https://images.unsplash.com/photo-1516589174184-c68536575960?w=800&h=600&fit=crop",
    keywords: ["사주 오행 분석", "오행 개운법", "목화토금수 뜻"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주 오행(목화토금수) 자가 진단: 나에게 부족한 기운 찾기</h2><p>사주팔자, 어렵게만 느껴지셨나요? 오늘은 그 중에서도 가장 기본이 되는 '오행'에 대해 쉽고 따뜻하게 이야기 나눠볼까 합니다.</p></div>`,
    relatedServiceUrl: "/manselyeok"
  },
  {
    id: "column-005",
    title: "태어난 시간 모를 때 사주 보는 법: 특징으로 유추하는 생시",
    description: "생시를 모른다고 해서 사주를 볼 수 없는 것은 아닙니다. 여러 특징을 통해 생시를 유추하는 방법을 알려드립니다.",
    category: "basic",
    author: "무운 역술팀",
    publishedDate: "2026-02-17",
    readTime: 6,
    thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
    keywords: ["생시 모를 때", "사주 시간 확인", "태어난 시 유추"],
    content: `<div class="prose prose-invert max-w-none"><h2>태어난 시간을 모를 때, 당신의 사주를 찾아가는 길</h2><p>살면서 한 번쯤은 자신의 사주팔자에 대해 궁금증을 가져보셨을 텐데요. 사주는 태어난 연월일시, 즉 '사주(四柱)'를 바탕으로 개인의 운명을 분석하는 학문입니다.</p></div>`,
    relatedServiceUrl: "/manselyeok"
  },
  {
    id: "column-006",
    title: "사주 천간과 지지의 의미: 하늘의 기운과 땅의 환경",
    description: "사주를 이루는 가장 기본적인 요소인 천간과 지지의 의미를 쉽게 설명합니다.",
    category: "basic",
    author: "무운 역술팀",
    publishedDate: "2026-02-16",
    readTime: 7,
    thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop",
    keywords: ["천간지지 뜻", "사주 기초 공부", "십간십이지"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주, 하늘의 기운과 땅의 환경: 천간과 지지의 의미</h2><p>살면서 우리는 알게 모르게 많은 기운 속에서 살아가고 있습니다. 특히 사주팔자라는 말을 자주 듣지만, 정작 그 깊은 의미를 아는 분은 많지 않으실 텐데요.</p></div>`,
    relatedServiceUrl: "/manselyeok"
  },
  {
    id: "column-007",
    title: "내 사주에 관성이 많다면? 직장운과 명예운의 상관관계",
    description: "내 사주에 관성이 많다면? 직장운과 명예운의 상관관계에 대한 전문적인 사주 풀이와 지혜를 만나보세요.",
    category: "basic",
    author: "무운 역술팀",
    publishedDate: "2026-02-15",
    readTime: 8,
    thumbnail: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=600&fit=crop",
    keywords: ["관성 많은 사주", "여자 사주 관성", "직장운 사주"],
    content: `<div class="prose prose-invert max-w-none"><h2>내 사주에 관성이 많다면? 직장운과 명예운의 상관관계</h2><p>사회생활의 정점에서 커리어와 명예에 대한 고민이 깊어지는 시기, 내 사주 속 관성이 직장운에 어떤 영향을 미칠까 궁금해하는 분들이 많으실 텐데요.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-008",
    title: "사주 비겁이 강한 사람의 특징: 자존감과 인간관계의 지혜",
    description: "사주 비겁이 강한 사람의 특징을 이해하면 자신의 성격과 인간관계를 더 잘 파악할 수 있습니다.",
    category: "basic",
    author: "무운 역술팀",
    publishedDate: "2026-02-14",
    readTime: 7,
    thumbnail: "https://images.unsplash.com/photo-1454165833767-02a6ed8a68b8?w=800&h=600&fit=crop",
    keywords: ["비겁 강한 사주", "고집 센 사주", "비견 겁재 뜻"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주 비겁이 강한 사람의 특징: 자존감과 인간관계의 지혜</h2><p>사주에서 '비겁'이라는 말을 들어보셨나요? 비겁은 나와 같은 오행을 가진 글자들을 의미합니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-009",
    title: "2026년 병오년(丙午年) 신년 운세: 붉은 말의 해, 나에게 미치는 영향",
    description: "2026년 병오년 신년 운세를 통해 올해 당신의 운명이 어떻게 흘러갈지 미리 알아보세요.",
    category: "flow",
    author: "무운 역술팀",
    publishedDate: "2026-02-13",
    readTime: 9,
    thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c29535a7?w=800&h=600&fit=crop",
    keywords: ["2026년 운세", "병오년 신년 운세", "띠별 운세"],
    content: `<div class="prose prose-invert max-w-none"><h2>2026년 병오년(丙午年) 신년 운세: 붉은 말의 해</h2><p>새로운 한 해가 시작되면서 올해의 운세가 어떻게 흘러갈지 궁금해하는 분들이 많으실 텐데요. 2026년은 십간십이지 중 병오(丙午)에 해당하는 해입니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-010",
    title: "사주에서 보는 인생의 황금기: 대운과 세운의 조화",
    description: "대운과 세운이 어떻게 조화를 이루는지 이해하면 인생의 황금기를 놓치지 않을 수 있습니다.",
    category: "flow",
    author: "무운 역술팀",
    publishedDate: "2026-02-12",
    readTime: 8,
    thumbnail: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop",
    keywords: ["대운 세운", "인생 황금기", "운의 흐름"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주에서 보는 인생의 황금기: 대운과 세운의 조화</h2><p>사주를 배우다 보면 '대운'과 '세운'이라는 말을 자주 듣게 됩니다. 이 두 개념을 제대로 이해하는 것이 자신의 인생 흐름을 파악하는 핵심입니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-011",
    title: "여성 사주에서 보는 남편운: 배우자 운의 흐름을 읽다",
    description: "여성 사주에서 남편운을 어떻게 읽는지, 그리고 배우자와의 관계를 개선하는 방법을 알아봅니다.",
    category: "relationship",
    author: "무운 역술팀",
    publishedDate: "2026-02-11",
    readTime: 8,
    thumbnail: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=800&h=600&fit=crop",
    keywords: ["여성 사주 남편운", "배우자 운", "부부 궁합"],
    content: `<div class="prose prose-invert max-w-none"><h2>여성 사주에서 보는 남편운: 배우자 운의 흐름을 읽다</h2><p>40대 여성분들 중에는 "내 남편운이 좋은지 나쁜지 궁금해요"라고 물어보시는 분들이 많습니다. 여성의 사주에서 남편운은 매우 중요한 부분입니다.</p></div>`,
    relatedServiceUrl: "/family-saju"
  },
  {
    id: "column-012",
    title: "사주의 '식상'이 발달한 사람: 창의력과 표현력의 힘",
    description: "식상이 발달한 사주의 특징과 그들이 어떤 분야에서 빛날 수 있는지 알아봅니다.",
    category: "basic",
    author: "무운 역술팀",
    publishedDate: "2026-02-10",
    readTime: 7,
    thumbnail: "https://images.unsplash.com/photo-1508962914676-139429cf197f?w=800&h=600&fit=crop",
    keywords: ["식상 발달 사주", "창의력 사주", "표현력 강한 사주"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주의 식상이 발달한 사람: 창의력과 표현력의 힘</h2><p>사주에서 '식상(食傷)'은 내가 표현하고 창조하는 기운을 나타냅니다. 식상이 발달한 사람들은 어떤 특징을 가지고 있을까요?</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-013",
    title: "재물운 좋은 사주의 특징: 부자가 되는 길을 찾다",
    description: "재물운이 좋은 사주의 특징을 알고 자신의 재물운을 높이는 방법을 배워봅시다.",
    category: "money",
    author: "무운 역술팀",
    publishedDate: "2026-02-09",
    readTime: 7,
    thumbnail: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=600&fit=crop",
    keywords: ["재물운 좋은 사주", "부자 사주", "돈복 있는 사주"],
    content: `<div class="prose prose-invert max-w-none"><h2>재물운 좋은 사주의 특징: 부자가 되는 길을 찾다</h2><p>누구나 부자가 되기를 꿈꾸지만, 사주학적으로 보면 재물을 담을 수 있는 그릇의 크기는 사람마다 다릅니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-014",
    title: "사주에서 보는 건강운: 내 몸의 약점을 미리 알다",
    description: "사주를 통해 타고난 건강 취약점을 파악하고 예방하는 방법을 알아봅니다.",
    category: "health",
    author: "무운 역술팀",
    publishedDate: "2026-02-08",
    readTime: 7,
    thumbnail: "https://images.unsplash.com/photo-1521791136366-398953f03473?w=800&h=600&fit=crop",
    keywords: ["사주 건강운", "건강 취약점", "체질 분석"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주에서 보는 건강운: 내 몸의 약점을 미리 알다</h2><p>40대가 되면서 건강이 점점 더 중요해집니다. 사주를 통해 내 몸의 약점을 미리 알 수 있다면 어떨까요?</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-015",
    title: "인간관계를 좌우하는 사주의 '인성': 모정과 배움의 기운",
    description: "인성이 발달한 사주의 특징과 인간관계에 미치는 영향을 알아봅니다.",
    category: "relationship",
    author: "무운 역술팀",
    publishedDate: "2026-02-07",
    readTime: 7,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
    keywords: ["인성 사주", "모정 많은 사주", "배움의 기운"],
    content: `<div class="prose prose-invert max-w-none"><h2>인간관계를 좌우하는 사주의 인성: 모정과 배움의 기운</h2><p>사주에서 '인성(印星)'은 어머니, 스승, 그리고 배움을 상징합니다. 인성이 발달한 사람들의 특징을 알아봅시다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-016",
    title: "사주의 '십신': 10가지 에너지로 읽는 내 성격과 운명",
    description: "사주의 십신 개념을 이해하면 자신의 성격과 운명을 더 깊이 있게 파악할 수 있습니다.",
    category: "basic",
    author: "무운 역술팀",
    publishedDate: "2026-02-06",
    readTime: 8,
    thumbnail: "https://images.unsplash.com/photo-1513519247388-193ad51cf507?w=800&h=600&fit=crop",
    keywords: ["십신 사주", "사주 에너지", "성격 분석"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주의 십신: 10가지 에너지로 읽는 내 성격과 운명</h2><p>사주를 배우다 보면 '십신(十神)'이라는 개념이 나옵니다. 이는 나를 중심으로 다른 글자들과의 관계를 나타내는 10가지 에너지입니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-017",
    title: "띠별 궁합: 나와 잘 맞는 사람은 누구일까?",
    description: "12띠의 궁합을 통해 나와 가장 잘 맞는 사람의 특징을 알아봅니다.",
    category: "relationship",
    author: "무운 역술팀",
    publishedDate: "2026-02-05",
    readTime: 6,
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop",
    keywords: ["띠별 궁합", "사주 궁합", "인간관계"],
    content: `<div class="prose prose-invert max-w-none"><h2>띠별 궁합: 나와 잘 맞는 사람은 누구일까?</h2><p>누구나 한 번쯤은 "우리 띠가 맞나요?"라는 질문을 받아본 적이 있을 겁니다. 12띠의 궁합에 대해 알아봅시다.</p></div>`,
    relatedServiceUrl: "/family-saju"
  },
  {
    id: "column-018",
    title: "사주 '납음오행': 상생의 조화로 운을 높이다",
    description: "오행의 상생 관계를 이해하고 자신의 운을 높이는 방법을 배워봅시다.",
    category: "luck",
    author: "무운 역술팀",
    publishedDate: "2026-02-04",
    readTime: 7,
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    keywords: ["오행 상생", "납음오행", "개운법"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주 납음오행: 상생의 조화로 운을 높이다</h2><p>사주에서 오행의 상생 관계를 이해하는 것은 자신의 운을 높이는 데 매우 중요합니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-019",
    title: "명리학으로 보는 직업 선택: 내 사주에 맞는 일을 찾다",
    description: "자신의 사주를 분석하여 가장 적성에 맞는 직업을 찾는 방법을 알아봅니다.",
    category: "flow",
    author: "무운 역술팀",
    publishedDate: "2026-02-03",
    readTime: 8,
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    keywords: ["직업 선택 사주", "적성 분석", "커리어 운"],
    content: `<div class="prose prose-invert max-w-none"><h2>명리학으로 보는 직업 선택: 내 사주에 맞는 일을 찾다</h2><p>인생의 대부분을 차지하는 직업. 내 사주에 맞는 일을 찾는다면 훨씬 더 행복하고 성공적인 커리어를 쌓을 수 있습니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-020",
    title: "사주의 '공망': 허상과 현실 사이의 기운을 이해하다",
    description: "공망이 있는 사주의 특징과 그것을 극복하는 방법을 알아봅니다.",
    category: "flow",
    author: "무운 역술팀",
    publishedDate: "2026-02-02",
    readTime: 7,
    thumbnail: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=600&fit=crop",
    keywords: ["공망 사주", "허상 기운", "극복법"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주의 공망: 허상과 현실 사이의 기운을 이해하다</h2><p>사주에서 '공망'이라는 말을 들으면 왠지 불길한 느낌이 들 수 있습니다. 하지만 공망을 제대로 이해하면 오히려 큰 도움이 될 수 있습니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-021",
    title: "자녀 운을 높이는 풍수: 아이의 방 꾸미기",
    description: "자녀의 사주와 풍수를 고려하여 아이의 방을 꾸미는 방법을 알아봅니다.",
    category: "luck",
    author: "무운 역술팀",
    publishedDate: "2026-02-01",
    readTime: 6,
    thumbnail: "https://images.unsplash.com/photo-1516589174184-c68536575960?w=800&h=600&fit=crop",
    keywords: ["자녀 풍수", "아이 방 꾸미기", "학업운 풍수"],
    content: `<div class="prose prose-invert max-w-none"><h2>자녀 운을 높이는 풍수: 아이의 방 꾸미기</h2><p>아이의 공부 환경은 학업 성취에 큰 영향을 미칩니다. 풍수를 고려하여 아이의 방을 꾸미는 방법을 알아봅시다.</p></div>`,
    relatedServiceUrl: "/family-saju"
  },
  {
    id: "column-022",
    title: "사주 '대운 바뀌는 해': 인생의 전환점을 준비하다",
    description: "대운이 바뀌는 해의 특징과 그 시기를 현명하게 준비하는 방법을 알아봅니다.",
    category: "flow",
    author: "무운 역술팀",
    publishedDate: "2026-01-31",
    readTime: 8,
    thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
    keywords: ["대운 바뀌는 해", "인생 전환점", "운의 변화"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주 대운 바뀌는 해: 인생의 전환점을 준비하다</h2><p>10년마다 찾아오는 대운의 변화. 그 시기를 미리 알고 준비한다면 인생을 더 현명하게 이끌 수 있습니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-023",
    title: "사주에서 보는 재물의 흐름: 돈이 들어오는 시기를 알다",
    description: "사주를 통해 재물이 들어오는 시기와 방법을 파악하는 방법을 알아봅니다.",
    category: "money",
    author: "무운 역술팀",
    publishedDate: "2026-01-30",
    readTime: 7,
    thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop",
    keywords: ["재물 흐름", "돈 들어오는 시기", "재물운"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주에서 보는 재물의 흐름: 돈이 들어오는 시기를 알다</h2><p>누구나 궁금해하는 재물운. 사주를 통해 돈이 언제 들어올지 미리 알 수 있다면 어떨까요?</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-024",
    title: "사주의 '납갑': 천간의 조화로 운을 읽다",
    description: "천간의 납갑 관계를 이해하면 사주의 흐름을 더 깊이 있게 파악할 수 있습니다.",
    category: "basic",
    author: "무운 역술팀",
    publishedDate: "2026-01-29",
    readTime: 7,
    thumbnail: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=600&fit=crop",
    keywords: ["납갑 관계", "천간 조화", "사주 분석"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주의 납갑: 천간의 조화로 운을 읽다</h2><p>사주에서 천간들 사이의 관계를 '납갑'이라고 합니다. 이를 이해하면 사주의 흐름이 더 명확해집니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-025",
    title: "여성의 결혼운: 사주로 보는 결혼 시기와 배우자의 특징",
    description: "여성의 사주에서 결혼운을 읽고 배우자의 특징을 파악하는 방법을 알아봅니다.",
    category: "relationship",
    author: "무운 역술팀",
    publishedDate: "2026-01-28",
    readTime: 8,
    thumbnail: "https://images.unsplash.com/photo-1454165833767-02a6ed8a68b8?w=800&h=600&fit=crop",
    keywords: ["여성 결혼운", "결혼 시기", "배우자 특징"],
    content: `<div class="prose prose-invert max-w-none"><h2>여성의 결혼운: 사주로 보는 결혼 시기와 배우자의 특징</h2><p>40대 여성분들 중에는 "내 결혼운이 좋은지 궁금해요"라고 물어보시는 분들이 많습니다. 사주로 결혼운을 어떻게 읽는지 알아봅시다.</p></div>`,
    relatedServiceUrl: "/family-saju"
  },
  {
    id: "column-026",
    title: "사주의 '살(殺)': 흉한 기운을 기회로 바꾸는 법",
    description: "사주의 여러 살(흉한 기운)을 이해하고 이를 극복하는 방법을 알아봅니다.",
    category: "luck",
    author: "무운 역술팀",
    publishedDate: "2026-01-27",
    readTime: 7,
    thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c29535a7?w=800&h=600&fit=crop",
    keywords: ["사주 살", "흉한 기운", "극복법"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주의 살(殺): 흉한 기운을 기회로 바꾸는 법</h2><p>사주에서 '살'이라는 말을 들으면 무섭게 느껴질 수 있습니다. 하지만 살을 제대로 이해하면 오히려 성공의 도구가 될 수 있습니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-027",
    title: "사주로 보는 건강 관리: 오행별 식이요법",
    description: "자신의 사주 오행에 맞는 식이요법으로 건강을 관리하는 방법을 알아봅니다.",
    category: "health",
    author: "무운 역술팀",
    publishedDate: "2026-01-26",
    readTime: 6,
    thumbnail: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop",
    keywords: ["오행 식이요법", "건강 관리", "체질 음식"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주로 보는 건강 관리: 오행별 식이요법</h2><p>사주의 오행을 이해하면 자신에게 맞는 음식과 식이요법을 선택할 수 있습니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-028",
    title: "사주의 '길성': 길한 기운을 활용하여 운을 높이다",
    description: "사주에서 길한 기운을 나타내는 길성을 이해하고 활용하는 방법을 알아봅니다.",
    category: "luck",
    author: "무운 역술팀",
    publishedDate: "2026-01-25",
    readTime: 7,
    thumbnail: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=800&h=600&fit=crop",
    keywords: ["길성", "길한 기운", "운 높이기"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주의 길성: 길한 기운을 활용하여 운을 높이다</h2><p>사주에서 길한 기운을 나타내는 '길성'을 이해하고 활용하면 자신의 운을 더욱 높일 수 있습니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-029",
    title: "명리학으로 보는 인생의 주기: 12년 주기의 의미",
    description: "12년을 주기로 반복되는 인생의 흐름을 이해하고 각 주기를 현명하게 보내는 방법을 알아봅니다.",
    category: "flow",
    author: "무운 역술팀",
    publishedDate: "2026-01-24",
    readTime: 8,
    thumbnail: "https://images.unsplash.com/photo-1508962914676-139429cf197f?w=800&h=600&fit=crop",
    keywords: ["인생 주기", "12년 주기", "운의 흐름"],
    content: `<div class="prose prose-invert max-w-none"><h2>명리학으로 보는 인생의 주기: 12년 주기의 의미</h2><p>인생은 일정한 주기를 가지고 반복됩니다. 이 주기를 이해하면 인생을 더 현명하게 설계할 수 있습니다.</p></div>`,
    relatedServiceUrl: "/saju"
  },
  {
    id: "column-030",
    title: "사주 상담 받기 전에: 정확한 정보 준비하기",
    description: "사주 상담을 받기 전에 준비해야 할 정보와 상담을 최대한 활용하는 방법을 알아봅니다.",
    category: "basic",
    author: "무운 역술팀",
    publishedDate: "2026-01-23",
    readTime: 5,
    thumbnail: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=600&fit=crop",
    keywords: ["사주 상담", "정보 준비", "상담 활용"],
    content: `<div class="prose prose-invert max-w-none"><h2>사주 상담 받기 전에: 정확한 정보 준비하기</h2><p>사주 상담을 받기 전에 정확한 정보를 준비하면 상담의 질을 크게 높일 수 있습니다.</p></div>`,
    relatedServiceUrl: "/saju"
  }
];

export function getColumnById(id: string): ColumnData | undefined {
  return columns.find(col => col.id === id);
}

export function getColumnsByCategory(category: string): ColumnData[] {
  return columns.filter(col => col.category === category);
}

export function getAllColumns(): ColumnData[] {
  return columns;
}

export function getLatestColumns(limit: number = 3): ColumnData[] {
  return [...columns]
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, limit);
}
