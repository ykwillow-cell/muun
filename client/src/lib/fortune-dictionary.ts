/**
 * 무운 운세 사전 데이터
 * 사주 명리학의 주요 용어들을 40대 여성 사용자를 위해 정중한 존댓말로 정리한 사전입니다.
 */

export interface DictionaryEntry {
  id: string;
  slug: string; // SEO 친화적 URL용 슬러그
  category: 'basic' | 'stem' | 'branch' | 'ten-stem' | 'evil-spirit' | 'luck-flow' | 'relation';
  categoryLabel: string;
  title: string;
  subtitle?: string;
  summary: string; // Meta Title 및 검색 결과용 핵심 풀이
  originalMeaning: string;
  modernInterpretation: string;
  muunAdvice: string;
  tags?: string[];
}

export const fortuneDictionary: DictionaryEntry[] = [
  // ===== 사주 기초 및 오행 =====
  {
    id: 'basic-001',
    slug: 'saju-palcha',
    category: 'basic',
    categoryLabel: '사주 기초',
    title: '사주팔자(四柱八字)',
    summary: '인생의 설계도, 태어날 때부터 가지고 있는 고유한 에너지 코드',
    originalMeaning:
      '사람이 태어난 연월일시를 네 개의 기둥(사주)으로 세우고, 각 기둥의 천간과 지지를 합친 여덟 글자(팔자)를 말합니다.',
    modernInterpretation:
      '사주팔자는 마치 당신의 인생 설계도나 DNA 지도와 같습니다. 태어날 때부터 가지고 있는 고유한 에너지 코드라고 생각하시면 돼요. 단순히 정해진 운명이 아니라, 당신의 잠재력을 최대한 발휘할 수 있는 사용 설명서 같은 것이죠.',
    muunAdvice:
      '당신의 사주팔자를 안다는 것은 당신 자신을 더 깊이 이해하는 첫걸음입니다. 이 지도를 보며 당신의 빛나는 재능을 발견하고 부족한 부분은 지혜롭게 채워나가세요.',
    tags: ['기초', '사주', '팔자'],
  },
  {
    id: 'basic-002',
    slug: 'yin-yang-five-elements',
    category: 'basic',
    categoryLabel: '사주 기초',
    title: '음양오행(陰陽五行)',
    summary: '우주의 모든 것을 이루는 다섯 가지 에너지의 조화',
    originalMeaning:
      '우주 만물이 음과 양의 조화와 목, 화, 토, 금, 수 다섯 가지 에너지의 순환으로 이루어져 있다는 철학입니다.',
    modernInterpretation:
      '음양오행은 세상의 모든 것을 이루는 다섯 가지 색깔과 같습니다. 당신의 사주에 이 색깔들이 어떤 비율로 섞여 있는지 보면, 당신의 성격과 재능, 그리고 당신에게 더 필요한 기운이 무엇인지 알 수 있지요.',
    muunAdvice:
      '당신의 사주에 어떤 오행이 부족하거나 넘치는지 알게 되면 그것을 조절하는 지혜를 배울 수 있습니다. 당신의 균형을 찾아가는 과정 자체가 당신을 더욱 행복하게 만들어 줄 거예요.',
    tags: ['기초', '음양', '오행'],
  },
  {
    id: 'basic-003',
    slug: 'heavenly-stems',
    category: 'basic',
    categoryLabel: '사주 기초',
    title: '천간(天干)',
    subtitle: '하늘의 기운을 나타내는 10가지 기호',
    summary: '당신의 성격 유형을 나타내는 10가지 천간의 에너지',
    originalMeaning:
      '천간은 갑(甲), 을(乙), 병(丙), 정(丁), 무(戊), 기(己), 경(庚), 신(辛), 임(壬), 계(癸) 10가지로 이루어져 있으며, 각각 음양과 오행의 특성을 가지고 있습니다.',
    modernInterpretation:
      '천간은 마치 당신의 성격 유형을 나타내는 10가지 프로필 같습니다. 각 천간마다 고유한 에너지와 특성이 있어서, 당신의 년주, 월주, 일주, 시주 천간을 보면 당신의 외향적 모습과 사회적 역할을 이해할 수 있지요.',
    muunAdvice:
      '당신의 일주 천간(태어난 날의 천간)은 당신의 가장 본질적인 성향을 나타냅니다. 이를 통해 당신의 강점과 약점을 객관적으로 바라보고, 인생의 중요한 결정을 내릴 때 참고하시면 좋습니다.',
    tags: ['기초', '천간', '10가지'],
  },
  {
    id: 'basic-004',
    slug: 'earthly-branches',
    category: 'basic',
    categoryLabel: '사주 기초',
    title: '지지(地支)',
    subtitle: '땅의 기운을 나타내는 12가지 기호',
    summary: '당신의 내면적 성향과 잠재력을 나타내는 12가지 에너지',
    originalMeaning:
      '지지는 자(子), 축(丑), 인(寅), 묘(卯), 진(辰), 사(巳), 오(午), 미(未), 신(申), 유(酉), 술(戌), 해(亥) 12가지로 이루어져 있으며, 십간지(십간십이지)를 이루는 기본 요소입니다.',
    modernInterpretation:
      '지지는 당신의 내면적 성향과 잠재력을 나타내는 12가지 캐릭터 같습니다. 천간이 겉으로 드러나는 모습이라면, 지지는 당신의 진정한 내면의 세계를 보여줍니다. 특히 당신의 일주 지지(태어난 날의 지지)는 당신의 기질과 운명의 흐름을 크게 좌우합니다.',
    muunAdvice:
      '당신의 지지 조합을 이해하면 당신이 어떤 환경에서 가장 행복하고 능력을 발휘할 수 있는지 알 수 있습니다. 자신의 지지 특성을 존중하고 활용하는 것이 성공의 지름길입니다.',
    tags: ['기초', '지지', '12가지'],
  },

  // ===== 천간(天干) - 10개 =====
  {
    id: 'stem-001',
    slug: 'gab-mok',
    category: 'stem',
    categoryLabel: '천간',
    title: '갑목(甲木)',
    summary: '큰 나무의 기운을 타고난 당신의 성격과 운명',
    originalMeaning: '천간의 첫 번째 갑목은 큰 나무의 기운을 상징합니다. 높이 솟아오르는 참나무처럼 당신은 타고난 리더십과 원대한 꿈을 가지고 있습니다.',
    modernInterpretation: '갑목 일간을 가진 사람은 자신의 신념을 굽히지 않고 앞으로 나아가는 기질을 가지고 있습니다. 현대 사회에서 이러한 기운은 창업가, 리더, 예술가 같은 분야에서 두각을 나타냅니다. 다만 너무 고집스러우면 주변과의 관계가 경직될 수 있으니 유연함도 필요합니다.',
    muunAdvice: '당신의 크고 원대한 꿈을 두려워하지 마세요. 그 꿈을 이루기 위해 필요한 것은 완벽함이 아니라 꾸준한 성장입니다. 주변 사람들의 의견에 귀 기울이면서도 자신의 길을 걸어가세요.',
    tags: ['천간', '갑목', '리더십', '성장'],
  },
  {
    id: 'stem-002',
    slug: 'eul-mok',
    category: 'stem',
    categoryLabel: '천간',
    title: '을목(乙木)',
    summary: '끈질긴 생명력을 가진 넝쿨 식물의 사주 특징',
    originalMeaning: '을목은 넝쿨처럼 자라나는 작은 나무의 기운입니다. 큰 나무인 갑목과 달리, 을목은 주어진 환경에 적응하며 끈질기게 살아가는 생명력을 상징합니다.',
    modernInterpretation: '을목 일간을 가진 사람은 적응력이 뛰어나고 섬세한 감정을 가지고 있습니다. 변화하는 환경 속에서도 유연하게 대처하는 능력이 있으며, 예술적 감수성이 풍부합니다. 이러한 특성은 디자인, 음악, 문학 등 창의적인 분야에서 큰 강점이 됩니다.',
    muunAdvice: '당신의 섬세함과 적응력은 큰 자산입니다. 다만 때로는 결단력 있게 자신의 의견을 표현하는 것도 필요합니다. 당신의 목소리가 세상을 더 아름답게 만들 수 있습니다.',
    tags: ['천간', '을목', '적응력', '감수성'],
  },
  {
    id: 'stem-003',
    slug: 'byeong-hwa',
    category: 'stem',
    categoryLabel: '천간',
    title: '병화(丙火)',
    summary: '세상을 밝히는 태양과 같은 열정의 사주',
    originalMeaning: '병화는 하늘의 태양을 상징하는 화의 기운입니다. 밝고 따뜻하게 모든 것을 비추는 태양처럼, 병화 일간은 밝은 에너지와 긍정적인 기질을 가지고 있습니다.',
    modernInterpretation: '병화 일간을 가진 사람은 밝은 성격과 뛰어난 표현력을 가지고 있습니다. 주변 사람들을 밝게 만드는 에너지를 가지고 있으며, 공개적인 활동이나 대중과의 소통을 잘합니다. 연예인, 강사, 마케터 같은 분야에서 두각을 나타낼 수 있습니다.',
    muunAdvice: '당신의 밝은 에너지를 세상과 나누세요. 다만 때로는 깊이 있는 성찰의 시간도 필요합니다. 밝음만큼 깊이가 있을 때 당신은 진정한 영향력을 발휘할 수 있습니다.',
    tags: ['천간', '병화', '열정', '표현력'],
  },
  {
    id: 'stem-004',
    slug: 'jeong-hwa',
    category: 'stem',
    categoryLabel: '천간',
    title: '정화(丁火)',
    summary: '따뜻한 등불처럼 세상을 비추는 섬세한 기운',
    originalMeaning: '정화는 촛불이나 등불의 불을 상징하는 화의 기운입니다. 태양인 병화와 달리, 정화는 따뜻하고 부드러우면서도 깊은 의미를 담고 있습니다.',
    modernInterpretation: '정화 일간을 가진 사람은 섬세한 감정과 따뜻한 마음을 가지고 있습니다. 직관력이 뛰어나고 타인의 감정을 잘 이해합니다. 상담가, 치료사, 영적 지도자 같은 분야에서 자신의 능력을 발휘할 수 있습니다.',
    muunAdvice: '당신의 따뜻한 마음이 주는 위로는 큰 선물입니다. 다만 타인의 감정에 너무 휘둘리지 않도록 자신의 경계를 지키는 것도 중요합니다.',
    tags: ['천간', '정화', '직관력', '감정'],
  },
  {
    id: 'stem-005',
    slug: 'mu-to',
    category: 'stem',
    categoryLabel: '천간',
    title: '무토(戊土)',
    summary: '듬직한 산처럼 믿음직한 포용력을 가진 사주',
    originalMeaning: '무토는 높이 솟은 산을 상징하는 토의 기운입니다. 안정적이고 견고하며, 모든 것을 포용하는 대지의 성질을 가지고 있습니다.',
    modernInterpretation: '무토 일간을 가진 사람은 안정감 있고 신뢰할 수 있는 성격을 가지고 있습니다. 리더십이 있으면서도 따뜻한 포용력을 가지고 있어, 조직 내에서 중심 역할을 잘합니다. 경영자, 관리자, 상담자 같은 역할에 적합합니다.',
    muunAdvice: '당신의 안정감 있는 기운은 주변 사람들에게 큰 힘이 됩니다. 다만 때로는 변화를 수용하고 새로운 도전을 두려워하지 않는 것도 필요합니다.',
    tags: ['천간', '무토', '안정성', '포용력'],
  },
  {
    id: 'stem-006',
    slug: 'gi-to',
    category: 'stem',
    categoryLabel: '천간',
    title: '기토(己土)',
    summary: '생명을 키워내는 옥토처럼 실속 있고 유연한 삶',
    originalMeaning: '기토는 생명을 키워내는 옥토를 상징하는 토의 기운입니다. 무토의 큰 산과 달리, 기토는 부드럽고 유연하면서도 실질적인 결과를 만들어냅니다.',
    modernInterpretation: '기토 일간을 가진 사람은 실용적이고 세심한 성격을 가지고 있습니다. 작은 것을 소중히 여기고 꼼꼼하게 일을 처리하는 능력이 있습니다. 이러한 특성은 회계, 행정, 기획 같은 분야에서 큰 강점이 됩니다.',
    muunAdvice: '당신의 세심함과 실용성은 큰 자산입니다. 때로는 큰 그림을 보면서도 세부사항을 챙기는 균형감각을 유지하세요.',
    tags: ['천간', '기토', '실용성', '세심함'],
  },
  {
    id: 'stem-007',
    slug: 'gyeong-geum',
    category: 'stem',
    categoryLabel: '천간',
    title: '경금(庚金)',
    summary: '강직한 원석처럼 흔들리지 않는 결단력의 소유자',
    originalMeaning: '경금은 광산에서 채굴한 거친 원석을 상징하는 금의 기운입니다. 강하고 단단하며, 어떤 압력에도 흔들리지 않는 견고함을 가지고 있습니다.',
    modernInterpretation: '경금 일간을 가진 사람은 강한 의지와 결단력을 가지고 있습니다. 옳다고 생각하는 일을 끝까지 밀어붙이는 추진력이 있습니다. 군인, 경찰, 기업가 같은 분야에서 두각을 나타낼 수 있습니다.',
    muunAdvice: '당신의 강한 의지는 큰 성취를 만들 수 있습니다. 다만 때로는 타인의 의견에 귀 기울이고 유연하게 대처하는 것도 필요합니다.',
    tags: ['천간', '경금', '결단력', '추진력'],
  },
  {
    id: 'stem-008',
    slug: 'sin-geum',
    category: 'stem',
    categoryLabel: '천간',
    title: '신금(辛金)',
    summary: '예리하고 빛나는 보석처럼 완벽을 추구하는 사주',
    originalMeaning: '신금은 보석처럼 다듬어진 금을 상징하는 금의 기운입니다. 경금의 거친 원석과 달리, 신금은 섬세하고 예리하며 완벽함을 추구합니다.',
    modernInterpretation: '신금 일간을 가진 사람은 뛰어난 미적 감각과 섬세한 기질을 가지고 있습니다. 완벽함을 추구하는 성향이 있어 디자인, 예술, 과학 같은 분야에서 뛰어난 성과를 낼 수 있습니다.',
    muunAdvice: '당신의 완벽함을 향한 추구는 훌륭합니다. 다만 때로는 불완전함을 수용하고 현실과 타협하는 지혜도 필요합니다.',
    tags: ['천간', '신금', '완벽성', '미적감각'],
  },
  {
    id: 'stem-009',
    slug: 'im-su',
    category: 'stem',
    categoryLabel: '천간',
    title: '임수(壬水)',
    summary: '깊은 바다처럼 지혜롭고 거침없는 인생의 흐름',
    originalMeaning: '임수는 큰 강이나 바다의 물을 상징하는 수의 기운입니다. 깊고 광활하며, 모든 것을 포용하는 대도량함을 가지고 있습니다.',
    modernInterpretation: '임수 일간을 가진 사람은 깊은 지혜와 포용력을 가지고 있습니다. 사물을 깊이 있게 분석하고 이해하는 능력이 있으며, 철학자, 학자, 상담가 같은 역할에 적합합니다.',
    muunAdvice: '당신의 깊은 지혜를 세상과 나누세요. 다만 때로는 행동으로 옮기고 결정을 내리는 용기도 필요합니다.',
    tags: ['천간', '임수', '지혜', '포용력'],
  },
  {
    id: 'stem-010',
    slug: 'gye-su',
    category: 'stem',
    categoryLabel: '천간',
    title: '계수(癸水)',
    summary: '빗물처럼 유연하고 생명력을 전하는 따뜻한 기운',
    originalMeaning: '계수는 빗물이나 이슬을 상징하는 수의 기운입니다. 임수의 큰 물과 달리, 계수는 부드럽고 유연하면서도 생명을 키워내는 섬세함을 가지고 있습니다.',
    modernInterpretation: '계수 일간을 가진 사람은 유연한 사고와 따뜻한 감정을 가지고 있습니다. 직관력이 뛰어나고 타인의 감정을 잘 이해합니다. 예술가, 치료사, 교육자 같은 분야에서 자신의 능력을 발휘할 수 있습니다.',
    muunAdvice: '당신의 유연함과 따뜻함은 큰 선물입니다. 다만 때로는 자신의 의견을 명확히 표현하고 경계를 지키는 것도 필요합니다.',
    tags: ['천간', '계수', '유연성', '직관력'],
  },

  // ===== 오행 =====
  {
    id: 'stem-011',
    slug: 'wood-element',
    category: 'stem',
    categoryLabel: '오행',
    title: '목(木) - 나무의 기운',
    summary: '새로운 시작과 성장을 나타내는 열정적인 나무 기운',
    originalMeaning:
      '목은 오행 중 봄을 대표하며, 새로운 시작, 성장, 발전을 상징합니다. 목의 성질은 곧고 유연하며, 위로 향하는 상승의 기운입니다.',
    modernInterpretation:
      '목은 새싹이 땅을 뚫고 솟아오르듯 새로운 일을 시작하고 성장하려는 열정적인 마음입니다. 마치 스타트업의 CEO처럼 말이에요. 목이 강한 사람은 도전 정신이 있고, 끊임없이 배우고 성장하려는 욕구가 있습니다.',
    muunAdvice:
      '목의 기운이 강하시다면 당신의 성장 욕구를 마음껏 펼쳐 보세요. 새로운 도전을 두려워하지 마시고, 당신의 아이디어를 현실로 만드는 데 집중하면 큰 성공을 거두실 수 있습니다.',
    tags: ['오행', '목', '성장', '시작'],
  },
  {
    id: 'stem-012',
    slug: 'fire-element',
    category: 'stem',
    categoryLabel: '오행',
    title: '화(火) - 불의 기운',
    summary: '등기와 마력을 나타내는 뜨거운 불 기운',
    originalMeaning:
      '화는 오행 중 여름을 대표하며, 열정, 밝음, 표현을 상징합니다. 화의 성질은 뜨겁고 밝으며, 위로 향하는 상승의 기운입니다.',
    modernInterpretation:
      '화는 무대 위에서 빛나는 아이돌처럼 당신의 뜨거운 열정과 끼를 세상에 표현하려는 에너지입니다. 인기 유튜버처럼 사람들의 마음을 사로잡는 매력이 있지요. 화가 강한 사람은 표현력이 뛰어나고, 사람들을 감동시키는 능력이 있습니다.',
    muunAdvice:
      '화의 기운이 강하시다면 당신의 끼와 매력을 마음껏 드러내세요. 예술, 연예, 교육, 마케팅 등 당신의 표현력이 빛날 수 있는 분야에서 큰 성공을 거두실 것입니다.',
    tags: ['오행', '화', '열정', '표현'],
  },
  {
    id: 'stem-013',
    slug: 'earth-element',
    category: 'stem',
    categoryLabel: '오행',
    title: '토(土) - 흐름의 기운',
    summary: '안정과 신뢰를 나타내는 든든한 흐름 기운',
    originalMeaning:
      '토는 오행의 중심이며, 안정, 신뢰, 포용을 상징합니다. 토의 성질은 무겁고 안정적이며, 모든 것을 품어주는 포용의 기운입니다.',
    modernInterpretation:
      '토는 든든한 대지처럼 모든 것을 품어주고 안정적으로 지탱해주는 마음입니다. 팀의 갈등을 해결하고 조화를 이끄는 유능한 PM 같은 성품을 가지셨네요. 토가 강한 사람은 신뢰감이 있고, 사람들이 의지하는 든든한 존재입니다.',
    muunAdvice:
      '토의 기운이 강하시다면 당신의 포용력과 신뢰감으로 주변을 이끌어 가세요. 조직 관리, 상담, 교육 등 사람들을 돌보는 일에서 당신의 진가가 드러날 것입니다.',
    tags: ['오행', '토', '안정', '신뢰'],
  },
  {
    id: 'stem-014',
    slug: 'metal-element',
    category: 'stem',
    categoryLabel: '오행',
    title: '금(金) - 쉼의 기운',
    summary: '논리성과 의지를 나타내는 결단력 있는 쉼 기운',
    originalMeaning:
      '금은 오행 중 가을을 대표하며, 정리, 정확, 의지를 상징합니다. 금의 성질은 차갑고 단단하며, 아래로 내려가는 수렴의 기운입니다.',
    modernInterpretation:
      '금은 정교한 로봇처럼 논리적이고 합리적인 사고로 문제를 해결하려는 능력입니다. 뛰어난 개발자나 변호사처럼 한번 결정한 일은 끝까지 밀어붙이는 강한 의지가 있지요. 금이 강한 사람은 원칙을 중시하고, 정확한 판단력이 있습니다.',
    muunAdvice:
      '금의 기운이 강하시다면 당신의 논리적 사고와 의지력을 믿고 나아가세요. 금융, 법률, 기술, 경영 등 정확한 판단이 필요한 분야에서 당신의 능력이 빛날 것입니다.',
    tags: ['오행', '금', '논리', '의지'],
  },
  {
    id: 'stem-015',
    slug: 'water-element',
    category: 'stem',
    categoryLabel: '오행',
    title: '수(水) - 물의 기운',
    summary: '지혜와 유연성을 나타내는 부드러운 물 기운',
    originalMeaning:
      '수는 오행 중 겨울을 대표하며, 지혜, 유연, 소통을 상징합니다. 수의 성질은 부드럽고 유연하며, 아래로 내려가는 수렴의 기운입니다.',
    modernInterpretation:
      '수는 깊은 바다처럼 모든 것을 포용하고 끊임없이 변화하며 길을 찾아내는 지혜입니다. 현명한 전략가나 심리학자처럼 유연하게 대처하는 능력이 뛰어나시네요. 수가 강한 사람은 직관력이 뛰어나고, 상황에 따라 유연하게 대응합니다.',
    muunAdvice:
      '수의 기운이 강하시다면 당신의 직관과 유연성을 믿으세요. 상담, 심리학, 예술, 전략 등 창의적이고 유연한 사고가 필요한 분야에서 당신의 재능이 빛날 것입니다.',
    tags: ['오행', '수', '지혜', '유연'],
  },

  // ===== 십신(육친) =====
  {
    id: 'ten-stem-001',
    slug: 'bi-gyeop',
    category: 'ten-stem',
    categoryLabel: '십신',
    title: '비격(比肩·劫財) - 동료와 경쟁자',
    summary: '동료와 경쟁자를 나타내는 독립심이 강한 에너지',
    originalMeaning:
      '비겁은 일간과 같은 오행이면서 같은 음양을 가진 십신입니다. 비견은 같은 성별의 형제자매를, 겁재는 다른 성별의 형제자매를 나타냅니다.',
    modernInterpretation:
      '비겁은 마치 당신의 든든한 팀원이자 당신을 더 강하게 만드는 선의의 라이벌 같습니다. 혼자서는 할 수 없는 일도 함께라면 해낼 수 있는 힘을 주는 기운이에요. 비겁이 강한 사람은 독립심이 있고, 자신의 신념을 굽히지 않습니다.',
    muunAdvice:
      '비겁이 강하시다면 당신의 독립심을 믿고 나아가되 주변과의 협력도 잊지 마세요. 경쟁 속에서 배우고 나누는 지혜가 당신을 더 크게 만들 것입니다.',
    tags: ['십신', '비겁', '동료', '경쟁'],
  },
  {
    id: 'ten-stem-002',
    slug: 'siksang',
    category: 'ten-stem',
    categoryLabel: '십신',
    title: '식상(食神·傷官) - 재능과 표현',
    summary: '산지력 있는 재능을 나타내는 창의적 에너지',
    originalMeaning:
      '식상은 일간이 생하는 십신입니다. 식신은 일간과 같은 음양의 오행을, 상관은 일간과 다른 음양의 오행을 생합니다.',
    modernInterpretation:
      '식상은 당신의 창의적인 아이디어를 세상에 보여주는 발표력이나 재능 같습니다. 식신은 안정적으로 재능을 펼치는 힘이고, 상관은 번뜩이는 아이디어로 세상을 놀라게 하는 힘이지요. 식상이 강한 사람은 표현력이 뛰어나고, 창의적인 생각을 합니다.',
    muunAdvice:
      '식상이 강하시다면 당신의 끼를 마음껏 발휘해 보세요. 예술이나 교육 등 어떤 분야든 당신의 표현력은 사람들에게 큰 감동을 줄 것입니다.',
    tags: ['십신', '식상', '재능', '표현'],
  },
  {
    id: 'ten-stem-003',
    slug: 'jaeseong',
    category: 'ten-stem',
    categoryLabel: '십신',
    title: '재성(正財·偏財) - 성과와 자산',
    summary: '노력으로 얻는 성과와 자산을 나타내는 에너지',
    originalMeaning:
      '재성은 일간을 극하는 십신입니다. 정재는 일간과 다른 음양의 오행을, 편재는 일간과 같은 음양의 오행을 극합니다.',
    modernInterpretation:
      '재성은 당신의 노력으로 얻는 성과나 자산 같습니다. 정재는 꾸준히 모으는 월급 같은 안정감이고, 편재는 사업이나 투자로 얻는 큰 수익 같은 기회이지요. 재성이 강한 사람은 수완이 있고, 재물을 모으는 능력이 뛰어납니다.',
    muunAdvice:
      '재성이 강하시다면 당신의 수완을 믿고 도전해 보세요. 다만 재물에만 집착하기보다 돈을 통해 당신과 주변을 행복하게 만드는 지혜를 발휘하는 게 중요합니다.',
    tags: ['십신', '재성', '재물', '성과'],
  },
  {
    id: 'ten-stem-004',
    slug: 'gwanseong',
    category: 'ten-stem',
    categoryLabel: '십신',
    title: '관성(正官·偏官) - 책임과 명예',
    summary: '책임감과 명예를 나타내는 리더십 에너지',
    originalMeaning:
      '관성은 일간을 극하는 십신입니다. 정관은 일간과 같은 음양의 오행을, 편관은 일간과 다른 음양의 오행을 극합니다.',
    modernInterpretation:
      '관성은 당신의 삶을 이끌어가는 규칙이나 책임감 같습니다. 정관은 안정적이고 명예로운 역할이고, 편관은 당신을 성장시키는 도전적인 과제와 같지요. 관성이 강한 사람은 책임감이 있고, 사회적 지위를 추구합니다.',
    muunAdvice:
      '관성이 강하시다면 당신의 리더십으로 사회에 긍정적인 영향을 주세요. 어려움을 견디는 끈기는 당신을 더욱 단단하게 만들고 반드시 보상받게 할 것입니다.',
    tags: ['십신', '관성', '책임', '명예'],
  },
  {
    id: 'ten-stem-005',
    slug: 'inseong',
    category: 'ten-stem',
    categoryLabel: '십신',
    title: '인성(正印·偏印) - 지혜와 배경',
    summary: '지식과 지혜를 나타내는 학구적 에너지',
    originalMeaning:
      '인성은 일간을 생하는 십신입니다. 정인은 일간과 같은 음양의 오행을, 편인은 일간과 다른 음양의 오행을 생합니다.',
    modernInterpretation:
      '인성은 당신에게 지혜를 주는 선생님이나 든든한 배경 같습니다. 정인은 체계적인 지식이고, 편인은 당신만의 개성을 살리는 독특한 사고방식이지요. 인성이 강한 사람은 학구적이고, 지적 호기심이 많습니다.',
    muunAdvice:
      '인성이 강하시다면 지적 호기심을 마음껏 펼쳐 보세요. 끊임없이 배우고 탐구하는 자세는 당신을 세상의 변화를 읽는 현명한 리더로 키워줄 것입니다.',
    tags: ['십신', '인성', '지혜', '배경'],
  },

  // ===== 신살 =====
  {
    id: 'evil-spirit-001',
    slug: 'dohwa-sal',
    category: 'evil-spirit',
    categoryLabel: '신살',
    title: '도화살(桃花煞)',
    summary: '사람들의 시선을 사로잡는 치명적인 매력의 비밀',
    originalMeaning: '복숭아꽃의 향기에 벌과 나비가 몰려들 듯, 이성에게 강한 매력을 어필하여 주변에 사람이 끊이지 않는 기운을 말합니다.',
    modernInterpretation: '오늘날의 도화살은 연예인이나 인플루언서처럼 대중의 사랑을 먹고 사는 이들에게 필수적인 성공의 열쇠입니다. 타인에게 호감을 사고 주목받는 능력은 현대 사회에서 가장 강력한 무기가 됩니다. 당신이 가진 그 빛나는 기운은 창조적인 활동이나 목소리를 내는 일에 사용될 때 진정한 복이 됩니다.',
    muunAdvice: '주변의 시선을 두려워하지 마세요. 당신이 가진 그 빛나는 기운을 숨기기보다, 당신만이 할 수 있는 창조적인 활동이나 목소리를 내는 일에 사용한다면 더할 나위 없는 복이 될 것입니다.',
    tags: ['신살', '도화', '매력', '인연'],
  },
  {
    id: 'evil-spirit-002',
    slug: 'yeokma-sal',
    category: 'evil-spirit',
    categoryLabel: '신살',
    title: '역마살(驛馬煞)',
    summary: '변화와 이동을 통해 성공을 거머쥐는 법',
    originalMeaning: '역마살은 말이 빠르게 달리듯 변화와 이동을 상징하는 신살입니다. 한 곳에 머물지 않고 끊임없이 움직이는 기운을 나타냅니다.',
    modernInterpretation: '역마살을 가진 사람은 변화를 두려워하지 않고 새로운 환경에 빠르게 적응합니다. 여행, 이사, 직업 변화 같은 이동이 많으며, 이러한 변화 속에서 새로운 기회를 만나게 됩니다. 현대 사회에서는 이러한 유동성이 큰 강점이 될 수 있습니다.',
    muunAdvice: '당신의 변화무쌍한 에너지를 믿고 새로운 환경을 두려워하지 마세요. 당신이 만나는 각각의 변화는 당신을 더 성장시킬 것입니다.',
    tags: ['신살', '역마', '변화', '이동'],
  },
  {
    id: 'evil-spirit-003',
    slug: 'hwagae-sal',
    category: 'evil-spirit',
    categoryLabel: '신살',
    title: '화개살(華蓋煞)',
    summary: '예술적 감수성과 깊은 고독이 만드는 비범한 재능',
    originalMeaning: '화개살은 왕의 수레 위에 펼쳐진 화려한 덮개를 상징합니다. 이는 높은 지위와 특별한 재능을 나타내면서도 동시에 고독함을 의미합니다.',
    modernInterpretation: '화개살을 가진 사람은 뛰어난 예술적 감수성과 철학적 사고를 가지고 있습니다. 깊이 있는 사유와 창의적인 표현이 특징이며, 예술가, 작가, 철학자 같은 분야에서 두각을 나타낼 수 있습니다. 다만 깊은 내면의 세계로 인해 타인과의 관계에서 고독함을 느낄 수 있습니다.',
    muunAdvice: '당신의 깊은 내면의 세계는 큰 예술적 자산입니다. 그 고독함을 작품이나 표현으로 승화시킨다면, 많은 사람들의 마음을 감동시킬 것입니다.',
    tags: ['신살', '화개', '예술성', '고독'],
  },
  {
    id: 'evil-spirit-004',
    slug: 'baekho-sal',
    category: 'evil-spirit',
    categoryLabel: '신살',
    title: '백호살(白虎煞)',
    summary: '강력한 에너지와 추진력으로 위기를 극복하는 힘',
    originalMeaning: '백호살은 흰 호랑이를 상징하는 신살로, 강력한 에너지와 위험성을 동시에 나타냅니다. 이는 큰 성취를 이루지만 동시에 위기도 함께 가져올 수 있습니다.',
    modernInterpretation: '백호살을 가진 사람은 강한 추진력과 결단력을 가지고 있습니다. 어려운 상황에서도 용감하게 맞서고 극복하는 능력이 있습니다. 다만 이러한 강력한 에너지가 때로는 주변 사람들에게 부담을 줄 수 있으니 조절이 필요합니다.',
    muunAdvice: '당신의 강력한 에너지를 믿고 앞으로 나아가세요. 다만 때로는 주변 사람들의 의견에 귀 기울이고 함께 나아가는 것도 중요합니다.',
    tags: ['신살', '백호', '강력함', '추진력'],
  },
  {
    id: 'evil-spirit-005',
    slug: 'goegang-sal',
    category: 'evil-spirit',
    categoryLabel: '신살',
    title: '괴강살(魁罡煞)',
    summary: '우두머리의 기운으로 세상을 주도하는 강력한 사주',
    originalMeaning: '괴강살은 우두머리의 기운을 상징하는 신살입니다. 이는 리더십과 권력을 나타내며, 조직을 이끌고 세상을 주도하는 힘을 가지고 있습니다.',
    modernInterpretation: '괴강살을 가진 사람은 타고난 리더십과 카리스마를 가지고 있습니다. 조직 내에서 자연스럽게 리더 역할을 하게 되며, 큰 결정을 내리고 책임을 지는 것을 두려워하지 않습니다. 경영자, 정치가, 조직의 수장 같은 역할에 적합합니다.',
    muunAdvice: '당신의 리더십을 믿고 앞으로 나아가세요. 당신이 이끄는 방향이 많은 사람들에게 영감을 줄 것입니다.',
    tags: ['신살', '괴강', '리더십', '권력'],
  },
  {
    id: 'evil-spirit-006',
    slug: 'cheoneul-gwiin',
    category: 'evil-spirit',
    categoryLabel: '신살',
    title: '천을귀인(天乙貴人)',
    summary: '인생의 위기마다 나를 돕는 최고의 길성',
    originalMeaning: '천을귀인은 하늘이 내려준 귀인을 상징합니다. 이는 인생의 어려운 순간마다 도움의 손길을 주는 사람이나 기회를 나타냅니다.',
    modernInterpretation: '천을귀인을 가진 사람은 인생의 중요한 순간마다 도움을 받는 운이 있습니다. 어려운 상황에서도 예기치 않은 도움이 찾아오며, 귀인을 만날 확률이 높습니다. 이는 당신의 성실함과 따뜻한 마음이 주변 사람들에게 좋은 인상을 주기 때문입니다.',
    muunAdvice: '당신을 도와주는 사람들에게 감사하고, 당신도 다른 사람들을 도와주는 마음을 잃지 마세요. 그 선한 순환이 당신의 인생을 더욱 풍요롭게 만들 것입니다.',
    tags: ['신살', '천을귀인', '도움', '운'],
  },
  {
    id: 'evil-spirit-007',
    slug: 'wonjin-sal',
    category: 'evil-spirit',
    categoryLabel: '신살',
    title: '원진살(怨嗔煞)',
    summary: '이유 없이 미워지는 마음과 갈등의 해법',
    originalMeaning: '원진살은 이유 없이 타인에게 미움을 받거나, 타인을 미워하는 마음이 생기는 신살입니다. 이는 관계에서의 갈등과 오해를 나타냅니다.',
    modernInterpretation: '원진살을 가진 사람은 때로 타인과의 관계에서 오해나 갈등을 경험할 수 있습니다. 다만 이는 당신의 잘못이 아니라 단순한 에너지의 충돌일 수 있습니다. 이러한 상황에서는 명확한 소통과 이해가 중요합니다.',
    muunAdvice: '갈등이 생기면 피하기보다 정면으로 대면하고 소통하세요. 대부분의 오해는 명확한 대화로 풀릴 수 있습니다.',
    tags: ['신살', '원진', '갈등', '관계'],
  },
  {
    id: 'evil-spirit-008',
    slug: 'gwimun-sal',
    category: 'evil-spirit',
    categoryLabel: '신살',
    title: '귀문관살(鬼門關殺)',
    summary: '예민한 직관력과 천재성을 가진 이들의 특징',
    originalMeaning: '귀문관살은 귀신의 문을 지나는 것을 상징하는 신살입니다. 이는 영적 감수성과 신비로운 능력을 나타냅니다.',
    modernInterpretation: '귀문관살을 가진 사람은 뛰어난 직관력과 영적 감수성을 가지고 있습니다. 타인의 감정을 잘 감지하고, 미래를 예감하는 능력이 있습니다. 상담가, 치료사, 영적 지도자 같은 분야에서 자신의 능력을 발휘할 수 있습니다.',
    muunAdvice: '당신의 직관력을 믿고 따르세요. 당신의 영적 감수성은 자신과 타인을 모두 치유할 수 있는 큰 선물입니다.',
    tags: ['신살', '귀문관', '직관', '영성'],
  },
  {
    id: 'evil-spirit-009',
    slug: 'gong-mang',
    category: 'evil-spirit',
    categoryLabel: '신살',
    title: '공망(空亡)',
    summary: '비어있는 자리에서 찾는 새로운 기회의 지혜',
    originalMeaning: '공망은 사주에서 비어있는 자리를 나타내는 신살입니다. 이는 일시적인 공백이나 손실을 의미하면서도 동시에 새로운 시작의 기회를 나타냅니다.',
    modernInterpretation: '공망을 가진 사람은 때로 예상치 못한 손실이나 공백을 경험할 수 있습니다. 다만 이러한 공백은 새로운 것을 채울 기회이기도 합니다. 현재의 공백을 두려워하지 말고, 그 안에서 새로운 가능성을 찾아보세요.',
    muunAdvice: '인생의 공백은 당신을 성장시키는 시간입니다. 그 시간 속에서 당신은 새로운 자신을 발견하게 될 것입니다.',
    tags: ['신살', '공망', '공백', '기회'],
  },
  {
    id: 'evil-spirit-010',
    slug: 'sam-jae',
    category: 'evil-spirit',
    categoryLabel: '신살',
    title: '삼재(三災)',
    summary: '2026년 삼재 띠, 위기를 기회로 바꾸는 처세술',
    originalMeaning: '삼재는 3년 동안 계속되는 어려운 시기를 나타내는 신살입니다. 이는 인생의 시련기이면서도 성장의 기회이기도 합니다.',
    modernInterpretation: '삼재 시기에는 예상치 못한 어려움이 찾아올 수 있습니다. 다만 이 시기를 슬기롭게 극복하면 큰 성장을 이루게 됩니다. 조심스럽게 행동하되, 너무 위축되지 말고 긍정적인 마음으로 대처하세요.',
    muunAdvice: '삼재는 시련이 아니라 당신을 단련하는 시간입니다. 이 시기를 현명하게 극복한다면, 당신은 더욱 강해질 것입니다.',
    tags: ['신살', '삼재', '시련', '성장'],
  },

  // ===== 운의 흐름 =====
  {
    id: 'luck-flow-001',
    slug: 'dae-un',
    category: 'luck-flow',
    categoryLabel: '운의 흐름',
    title: '대운(大運)',
    summary: '내 인생의 전환점이 찾아오는 10년 주기의 큰 흐름',
    originalMeaning: '대운은 10년 단위로 변하는 인생의 큰 흐름을 나타냅니다. 각 10년 주기마다 당신의 인생에 새로운 변화와 기회가 찾아옵니다.',
    modernInterpretation: '대운은 당신의 인생을 10년 단위로 구분하는 중요한 지표입니다. 각 대운 주기마다 당신은 새로운 도전과 성장의 기회를 만나게 됩니다. 현재 당신이 어느 대운 주기에 있는지 이해하면, 앞으로의 인생을 더욱 현명하게 설계할 수 있습니다.',
    muunAdvice: '당신의 대운 주기를 이해하고, 각 시기에 필요한 준비를 하세요. 현재의 상황이 당신을 어디로 이끌고 있는지 깊이 있게 생각해 보세요.',
    tags: ['운의 흐름', '대운', '변화', '주기'],
  },
  {
    id: 'luck-flow-002',
    slug: 'se-un',
    category: 'luck-flow',
    categoryLabel: '운의 흐름',
    title: '세운(歲運)',
    summary: '2026년 병오년, 한 해가 당신에게 건네는 메시지',
    originalMeaning: '세운은 매년 변하는 운세를 나타냅니다. 각 해마다 당신에게 새로운 메시지와 기회가 찾아옵니다.',
    modernInterpretation: '세운은 한 해 동안의 운세를 나타내는 지표입니다. 2026년 병오년은 붉은 말의 해로, 변화와 활동이 많은 시기입니다. 이 시기에 당신이 어떻게 행동하고 준비하는지에 따라 앞으로의 운이 결정됩니다.',
    muunAdvice: '2026년의 세운을 이해하고, 이 시기에 필요한 준비를 하세요. 변화의 흐름을 타면서도 자신의 중심을 잃지 마세요.',
    tags: ['운의 흐름', '세운', '연운', '변화'],
  },
  {
    id: 'luck-flow-003',
    slug: 'yong-sin',
    category: 'luck-flow',
    categoryLabel: '운의 흐름',
    title: '용신(用神)',
    summary: '내 사주의 균형을 잡아주는 가장 소중한 조력자',
    originalMeaning: '용신은 당신의 사주에서 가장 필요한 오행을 나타냅니다. 이는 당신의 사주를 균형 있게 만들어주는 핵심 요소입니다.',
    modernInterpretation: '용신을 이해하는 것은 당신의 인생을 더욱 풍요롭게 만드는 열쇠입니다. 당신의 용신에 해당하는 색깔, 방향, 직업 등을 활용하면 더욱 좋은 운을 만들 수 있습니다. 용신을 강화하는 것이 당신의 성공의 지름길입니다.',
    muunAdvice: '당신의 용신이 무엇인지 알아보고, 그것을 강화하는 방법을 찾아보세요. 당신의 용신을 활용할 때 당신의 진정한 잠재력이 발휘될 것입니다.',
    tags: ['운의 흐름', '용신', '균형', '조력'],
  },
  {
    id: 'luck-flow-004',
    slug: 'hui-sin',
    category: 'luck-flow',
    categoryLabel: '운의 흐름',
    title: '희신(喜神)',
    summary: '운을 좋게 만드는 환경과 습관을 찾는 지혜',
    originalMeaning: '희신은 당신의 운을 좋게 만드는 오행을 나타냅니다. 용신을 돕는 역할을 하며, 당신의 행운을 증대시킵니다.',
    modernInterpretation: '희신을 활용하면 당신의 운을 더욱 좋게 만들 수 있습니다. 희신에 해당하는 환경을 만들고, 희신의 특성을 반영한 습관을 들이면 당신의 삶이 더욱 긍정적으로 변할 것입니다.',
    muunAdvice: '당신의 희신이 무엇인지 알아보고, 그것을 생활 속에 반영해 보세요. 작은 변화가 모여 당신의 인생을 크게 바꿀 것입니다.',
    tags: ['운의 흐름', '희신', '행운', '습관'],
  },
  {
    id: 'luck-flow-005',
    slug: 'gi-sin',
    category: 'luck-flow',
    categoryLabel: '운의 흐름',
    title: '기신(忌神)',
    summary: '나를 힘들게 하는 기운을 지혜롭게 다스리는 법',
    originalMeaning: '기신은 당신의 사주에서 피해야 할 오행을 나타냅니다. 이는 당신에게 어려움을 주는 요소이지만, 이를 이해하고 관리하면 피할 수 있습니다.',
    modernInterpretation: '기신을 이해하는 것은 당신의 약점을 보완하는 첫 번째 단계입니다. 기신에 해당하는 환경이나 상황을 피하고, 대신 용신과 희신을 강화하는 데 집중하세요. 이렇게 하면 기신의 부정적인 영향을 최소화할 수 있습니다.',
    muunAdvice: '기신을 두려워하지 마세요. 그것을 알고 있다는 것 자체가 당신을 보호하는 가장 좋은 방법입니다. 지혜롭게 관리하면 기신도 당신의 성장을 도울 수 있습니다.',
    tags: ['운의 흐름', '기신', '약점', '관리'],
  },
  {
    id: 'luck-flow-006',
    slug: 'hap',
    category: 'relation',
    categoryLabel: '관계',
    title: '합(合)',
    summary: '사람과 상황이 만나 새로운 인연을 만드는 원리',
    originalMeaning: '합은 두 개의 오행이 만나 새로운 에너지를 만드는 것을 나타냅니다. 이는 인연과 조화를 상징합니다.',
    modernInterpretation: '합을 이해하면 당신의 인간관계를 더욱 긍정적으로 만들 수 있습니다. 당신과 합이 잘 맞는 사람들과의 관계를 소중히 여기고, 그들과 함께 새로운 것을 만들어 보세요. 합이 좋은 관계는 당신의 인생을 더욱 풍요롭게 만들 것입니다.',
    muunAdvice: '당신과 합이 잘 맞는 사람들을 찾아보세요. 그들과의 만남이 당신의 인생을 크게 바꿀 수 있습니다.',
    tags: ['관계', '합', '인연', '조화'],
  },
  {
    id: 'luck-flow-007',
    slug: 'chung',
    category: 'relation',
    categoryLabel: '관계',
    title: '충(沖)',
    summary: '부딪힘을 통해 일어나는 변화와 역동적인 성취',
    originalMeaning: '충은 두 개의 오행이 부딪혀 큰 변화를 만드는 것을 나타냅니다. 이는 갈등이면서도 동시에 성장의 기회입니다.',
    modernInterpretation: '충을 경험하는 것은 당신의 인생에 큰 변화를 가져올 수 있습니다. 이 시기에는 어려움이 있을 수 있지만, 이를 현명하게 극복하면 큰 성취를 이룰 수 있습니다. 충을 두려워하지 말고, 그 속에서 새로운 기회를 찾아보세요.',
    muunAdvice: '충의 시기가 찾아오면 피하지 마세요. 그 부딪힘 속에서 당신은 더욱 강해질 것입니다.',
    tags: ['관계', '충', '변화', '성장'],
  },
  {
    id: 'luck-flow-008',
    slug: 'hyeong',
    category: 'relation',
    categoryLabel: '관계',
    title: '형(刑)',
    summary: '갈등을 조율하며 전문성을 키워가는 강력한 에너지',
    originalMeaning: '형은 두 개의 오행이 만나 불편함을 만드는 것을 나타냅니다. 이는 갈등과 시련을 의미합니다.',
    modernInterpretation: '형을 경험하는 것은 당신을 단련하는 과정입니다. 이 시기에 당신은 갈등을 조율하고 전문성을 키워갈 수 있습니다. 형을 통해 당신은 더욱 성숙해질 것입니다.',
    muunAdvice: '형의 시기에는 인내심을 가지고 상황을 조율해 보세요. 그 과정 속에서 당신은 새로운 역량을 발견하게 될 것입니다.',
    tags: ['관계', '형', '갈등', '성숙'],
  },
];

/**
 * 카테고리별로 사전 항목을 그룹화하는 함수
 */
export function getDictionaryByCategory(
  category: DictionaryEntry['category']
): DictionaryEntry[] {
  return fortuneDictionary.filter((entry) => entry.category === category);
}

/**
 * 검색어로 사전 항목을 검색하는 함수
 */
export function searchDictionary(query: string): DictionaryEntry[] {
  const lowerQuery = query.toLowerCase();
  return fortuneDictionary.filter(
    (entry) =>
      entry.title.toLowerCase().includes(lowerQuery) ||
      entry.subtitle?.toLowerCase().includes(lowerQuery) ||
      entry.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      entry.originalMeaning.toLowerCase().includes(lowerQuery) ||
      entry.modernInterpretation.toLowerCase().includes(lowerQuery)
  );
}

/**
 * 모든 카테고리 목록을 반환하는 함수
 */
export function getAllCategories() {
  return [
    { id: 'basic', label: '사주 기초' },
    { id: 'stem', label: '천간 & 오행' },
    { id: 'branch', label: '지지' },
    { id: 'ten-stem', label: '십신' },
    { id: 'evil-spirit', label: '신살' },
    { id: 'luck-flow', label: '운의 흐름' },
    { id: 'relation', label: '관계' },
  ];
}

/**
 * ID로 특정 사전 항목을 조회하는 함수
 */
export function getDictionaryEntryById(id: string): DictionaryEntry | undefined {
  return fortuneDictionary.find((entry) => entry.id === id);
}

/**
 * Slug로 특정 사전 항목을 조회하는 함수
 */
export function getDictionaryEntryBySlug(slug: string): DictionaryEntry | undefined {
  return fortuneDictionary.find((entry) => entry.slug === slug);
}
