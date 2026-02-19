export type DreamGrade = 'great' | 'good' | 'caution';

export interface DreamData {
  keyword: string;
  interpretation: string;
  traditionalMeaning: string;
  psychologicalMeaning: string;
  category: 'animal' | 'person' | 'nature' | 'object' | 'action' | 'etc';
  grade: DreamGrade;
  score: number; // 1 to 100
}

export const dreamData: Record<string, DreamData> = {
  "돼지": {
    "keyword": "돼지",
    "interpretation": "돼지꿈은 대표적인 재물운의 상징입니다. 예상치 못한 횡재나 기분 좋은 소식이 찾아올 수 있는 아주 좋은 징조입니다.",
    "traditionalMeaning": "예로부터 돼지는 다산과 풍요를 상징하여, 재물이 들어오거나 사업이 번창할 길몽으로 여겨집니다.",
    "psychologicalMeaning": "심리적으로는 현재 진행 중인 일에 대한 긍정적인 기대감이나 풍요로운 마음 상태를 나타냅니다.",
    "category": "animal",
    "grade": "great",
    "score": 98
  },
  "물": {
    "keyword": "물",
    "interpretation": "물은 정화와 흐름의 상징으로, 재물운이나 감정 정리가 필요한 시기를 뜻할 수 있습니다. 오늘은 물처럼 유연하게 움직이면 도움이 됩니다.",
    "traditionalMeaning": "맑은 물은 길몽으로 재물운을, 흐린 물은 마음의 정리가 필요함을 의미합니다.",
    "psychologicalMeaning": "감정이 흐르는 방향을 살피며 마음의 균형을 찾고 있다는 신호입니다.",
    "category": "nature",
    "grade": "good",
    "score": 85
  },
  "불": {
    "keyword": "불",
    "interpretation": "불은 열정과 변화의 신호로, 추진력이 높아지는 시기를 알려줍니다.",
    "traditionalMeaning": "불은 명예와 기회의 상징이며, 강한 에너지가 들어오는 꿈으로 해석됩니다.",
    "psychologicalMeaning": "내면의 에너지가 커져 새로운 시도를 하고 싶다는 마음이 반영됩니다.",
    "category": "nature",
    "grade": "great",
    "score": 92
  },
  "돈": {
    "keyword": "돈",
    "interpretation": "돈은 풍요와 기회의 상징으로, 재물운 상승 또는 기회 포착을 의미합니다.",
    "traditionalMeaning": "돈이 나오는 꿈은 재물운이 들어오는 길몽으로 해석됩니다.",
    "psychologicalMeaning": "안정과 가치에 대한 욕구가 강해졌음을 보여줍니다.",
    "category": "object",
    "grade": "great",
    "score": 95
  },
  "뱀": {
    "keyword": "뱀",
    "interpretation": "뱀은 지혜와 경계의 상징으로, 신중한 선택이 필요함을 알려줍니다.",
    "traditionalMeaning": "뱀 꿈은 큰 변화나 기회를 의미하며, 조심스러운 판단이 중요합니다.",
    "psychologicalMeaning": "본능과 직감을 믿고 싶은 마음이 반영됩니다.",
    "category": "animal",
    "grade": "good",
    "score": 78
  },
  "죽음": {
    "keyword": "죽음",
    "interpretation": "죽음은 끝이 아니라 전환의 상징으로, 새로운 시작을 알리는 길몽입니다.",
    "traditionalMeaning": "죽음 꿈은 재생과 변화의 의미로 해석되어 좋은 전환을 예고합니다.",
    "psychologicalMeaning": "낡은 패턴을 정리하고 새로운 흐름으로 이동하려는 내면의 신호입니다.",
    "category": "action",
    "grade": "great",
    "score": 90
  },
  "나무": {
    "keyword": "나무",
    "interpretation": "나무는 성장과 확장의 상징으로, 꾸준한 노력이 결실을 맺을 수 있습니다.",
    "traditionalMeaning": "나무는 번창과 생명력을 의미하여 좋은 흐름을 암시합니다.",
    "psychologicalMeaning": "자기 성장과 안정에 대한 욕구가 나타난 것입니다.",
    "category": "nature",
    "grade": "good",
    "score": 82
  },
  "하늘": {
    "keyword": "하늘",
    "interpretation": "하늘은 큰 가능성과 자유를 뜻하며, 넓은 시야가 필요함을 알려줍니다.",
    "traditionalMeaning": "하늘은 큰 기회와 명예운을 상징합니다.",
    "psychologicalMeaning": "제약에서 벗어나고 싶은 마음이 드러납니다.",
    "category": "nature",
    "grade": "good",
    "score": 88
  },
  "비": {
    "keyword": "비",
    "interpretation": "비는 정화와 회복의 의미로, 마음을 씻고 새로 시작할 수 있습니다.",
    "traditionalMeaning": "비는 재물과 복이 스며드는 꿈으로 해석됩니다.",
    "psychologicalMeaning": "감정이 해소되고 정리되는 과정을 보여줍니다.",
    "category": "nature",
    "grade": "good",
    "score": 75
  },
  "산": {
    "keyword": "산",
    "interpretation": "산은 목표와 도전의 상징으로, 꾸준한 노력이 필요한 시기를 나타냅니다.",
    "traditionalMeaning": "산을 오르는 꿈은 성취와 진급을 뜻합니다.",
    "psychologicalMeaning": "도전을 통해 성장하고 싶다는 마음이 반영됩니다.",
    "category": "nature",
    "grade": "good",
    "score": 80
  },
  "바다": {
    "keyword": "바다",
    "interpretation": "바다는 큰 변화와 가능성을 의미하며, 새로운 흐름이 열릴 수 있습니다.",
    "traditionalMeaning": "바다 꿈은 큰 재물운이나 이동운을 뜻합니다.",
    "psychologicalMeaning": "무의식의 깊이를 탐색하고 있다는 신호입니다.",
    "category": "nature",
    "grade": "good",
    "score": 86
  },
  "집": {
    "keyword": "집",
    "interpretation": "집은 안정과 휴식의 상징으로, 생활 기반을 다질 시기입니다.",
    "traditionalMeaning": "집이 나오는 꿈은 가족운과 재물운이 좋아짐을 의미합니다.",
    "psychologicalMeaning": "안전과 소속감에 대한 욕구가 반영됩니다.",
    "category": "object",
    "grade": "good",
    "score": 84
  },
  "길": {
    "keyword": "길",
    "interpretation": "길은 방향과 선택을 의미하며, 새로운 진로를 고려할 수 있습니다.",
    "traditionalMeaning": "길을 걷는 꿈은 새로운 기회와 만남을 암시합니다.",
    "psychologicalMeaning": "앞으로의 방향을 고민하는 마음이 드러납니다.",
    "category": "etc",
    "grade": "good",
    "score": 72
  },
  "학교": {
    "keyword": "학교",
    "interpretation": "학교는 배움과 성장의 상징으로, 지식과 경험을 쌓을 시기입니다.",
    "traditionalMeaning": "학교 꿈은 시험운과 문서운이 좋아짐을 의미합니다.",
    "psychologicalMeaning": "스스로를 성장시키고 싶다는 욕구가 나타납니다.",
    "category": "etc",
    "grade": "good",
    "score": 70
  },
  "시험": {
    "keyword": "시험",
    "interpretation": "시험은 검증과 책임의 상징으로, 준비를 철저히 하면 좋은 결과가 있습니다.",
    "traditionalMeaning": "시험 꿈은 평가받는 상황이나 합격운을 암시합니다.",
    "psychologicalMeaning": "불안과 기대가 함께 나타나는 상태입니다.",
    "category": "etc",
    "grade": "caution",
    "score": 45
  },
  "아이": {
    "keyword": "아이",
    "interpretation": "아이는 새로운 시작과 순수함을 의미하며, 좋은 기회가 다가올 수 있습니다.",
    "traditionalMeaning": "아이 꿈은 재물과 인연운이 들어오는 길몽으로 해석됩니다.",
    "psychologicalMeaning": "새로운 프로젝트나 관계를 시작하고 싶은 마음이 반영됩니다.",
    "category": "person",
    "grade": "good",
    "score": 87
  },
  "동물": {
    "keyword": "동물",
    "interpretation": "동물은 본능과 감정의 상징으로, 내면의 감각을 따를 필요가 있습니다.",
    "traditionalMeaning": "동물 꿈은 인간관계나 재물운의 변화를 암시합니다.",
    "psychologicalMeaning": "감정적 욕구가 커졌음을 보여줍니다.",
    "category": "animal",
    "grade": "good",
    "score": 76
  },
  "자동차": {
    "keyword": "자동차",
    "interpretation": "자동차는 이동과 진행의 상징으로, 속도 조절이 필요합니다.",
    "traditionalMeaning": "자동차 꿈은 진로 변화나 출장운을 의미합니다.",
    "psychologicalMeaning": "목표를 향해 나아가고 싶은 마음이 반영됩니다.",
    "category": "object",
    "grade": "good",
    "score": 74
  },
  "비행기": {
    "keyword": "비행기",
    "interpretation": "비행기는 도약과 확장의 상징으로, 큰 변화가 열릴 수 있습니다.",
    "traditionalMeaning": "비행기 꿈은 승진이나 이동운이 좋음을 의미합니다.",
    "psychologicalMeaning": "한 단계 도약하고 싶은 욕구가 드러납니다.",
    "category": "object",
    "grade": "great",
    "score": 91
  },
  "결혼": {
    "keyword": "결혼",
    "interpretation": "결혼은 연결과 조화의 상징으로, 관계가 깊어질 수 있습니다.",
    "traditionalMeaning": "결혼 꿈은 인연운과 협업운이 상승함을 뜻합니다.",
    "psychologicalMeaning": "관계에 대한 기대와 안정 욕구가 반영됩니다.",
    "category": "action",
    "grade": "good",
    "score": 83
  },
  "이별": {
    "keyword": "이별",
    "interpretation": "이별은 정리와 전환의 상징으로, 새로운 시작을 준비할 시기입니다.",
    "traditionalMeaning": "이별 꿈은 오히려 좋은 변화가 가까움을 암시합니다.",
    "psychologicalMeaning": "감정의 정리와 변화 욕구가 나타납니다.",
    "category": "action",
    "grade": "caution",
    "score": 40
  },
  "똥": {
    "keyword": "똥",
    "interpretation": "똥은 재물과 횡재의 상징으로, 아주 좋은 운이 들어올 징조입니다.",
    "traditionalMeaning": "똥을 만지거나 밟는 꿈은 큰 재물을 얻게 될 길몽입니다.",
    "psychologicalMeaning": "억눌렸던 감정이 해소되거나 경제적 보상을 바라는 마음이 투영됩니다.",
    "category": "object",
    "grade": "great",
    "score": 99
  },
  "개": {
    "keyword": "개",
    "interpretation": "개는 충성심과 친구를 의미하며, 주변 사람들과의 관계가 중요해지는 시기입니다.",
    "traditionalMeaning": "개가 짖는 꿈은 경고를, 꼬리를 흔드는 꿈은 반가운 소식을 뜻합니다.",
    "psychologicalMeaning": "누군가에게 의지하고 싶거나 보호받고 싶은 마음이 반영됩니다.",
    "category": "animal",
    "grade": "good",
    "score": 81
  },
  "고양이": {
    "keyword": "고양이",
    "interpretation": "고양이는 직관과 독립성을 의미하며, 자신만의 시간을 가질 필요가 있습니다.",
    "traditionalMeaning": "고양이는 영험한 동물로 여겨져 신비로운 일이나 지혜를 암시합니다.",
    "psychologicalMeaning": "자유롭고 싶은 욕구나 숨겨진 재능을 발견하고 싶은 마음이 나타납니다.",
    "category": "animal",
    "grade": "good",
    "score": 73
  },
  "조상": {
    "keyword": "조상",
    "interpretation": "조상은 보호와 인도를 의미하며, 현재의 고민에 대한 해답을 얻을 수 있습니다.",
    "traditionalMeaning": "조상이 밝은 모습이면 길몽, 어두운 모습이면 주의가 필요한 경고입니다.",
    "psychologicalMeaning": "뿌리와 정체성을 찾거나 인생의 가르침을 갈구하는 상태입니다.",
    "category": "person",
    "grade": "great",
    "score": 96
  },
  "대통령": {
    "keyword": "대통령",
    "interpretation": "대통령은 권위와 명예의 상징으로, 사회적 지위가 상승하거나 큰 일을 맡게 될 수 있습니다.",
    "traditionalMeaning": "높은 지위의 인물을 만나는 것은 명예운과 성공운이 따르는 길몽입니다.",
    "psychologicalMeaning": "인정받고 싶은 욕구와 야망이 꿈으로 나타난 것입니다.",
    "category": "person",
    "grade": "great",
    "score": 94
  },
  "불이 나는 꿈": {
    "keyword": "불이 나는 꿈",
    "interpretation": "자신의 사업이나 일이 크게 번창할 것을 암시하는 아주 좋은 길몽입니다.",
    "traditionalMeaning": "불길이 거셀수록 운세가 더욱 강해지며 큰 재물이 들어옵니다.",
    "psychologicalMeaning": "열정이 최고조에 달해 변화를 주도하고 싶은 상태입니다.",
    "category": "nature",
    "grade": "great",
    "score": 97
  },
  "이빨 빠지는 꿈": {
    "keyword": "이빨 빠지는 꿈",
    "interpretation": "변화와 상실을 의미하며, 주변 지인이나 가족의 신변에 변화가 생길 수 있습니다.",
    "traditionalMeaning": "윗니는 윗사람, 아랫니는 아랫사람의 근심거리를 뜻하는 경고의 꿈입니다.",
    "psychologicalMeaning": "자신감이 떨어지거나 통제력을 잃을까 두려워하는 마음이 반영됩니다.",
    "category": "action",
    "grade": "caution",
    "score": 30
  },
  "도둑": {
    "keyword": "도둑",
    "interpretation": "도둑은 예상치 못한 손실이나 반대로 행운의 기회를 의미할 수 있습니다.",
    "traditionalMeaning": "도둑을 잡으면 길몽이지만, 물건을 잃어버리면 재물 손실을 주의해야 합니다.",
    "psychologicalMeaning": "무언가를 빼앗길까 봐 불안하거나 비밀을 감추고 싶은 심리입니다.",
    "category": "person",
    "grade": "caution",
    "score": 35
  },
  "이사": {
    "keyword": "이사",
    "interpretation": "이사는 새로운 환경과 변화를 의미하며, 인생의 전환점을 맞이할 수 있습니다.",
    "traditionalMeaning": "새 집으로 이사하는 것은 새로운 기회와 번창을 암시합니다.",
    "psychologicalMeaning": "현재 상황에서 벗어나 새로운 시작을 하고 싶은 욕구입니다.",
    "category": "action",
    "grade": "good",
    "score": 82
  },
  "연예인": {
    "keyword": "연예인",
    "interpretation": "연예인은 선망과 재능을 의미하며, 자신의 능력을 발휘할 기회가 찾아옵니다.",
    "traditionalMeaning": "인기 있는 인물과 대화하는 것은 귀인의 도움이나 명예운을 뜻합니다.",
    "psychologicalMeaning": "특별해지고 싶거나 사람들의 관심을 받고 싶은 욕망이 투영됩니다.",
    "category": "person",
    "grade": "good",
    "score": 79
  }
};

export const defaultDream: DreamData = {
  "keyword": "기본",
  "interpretation": "꿈은 현재 마음의 상태를 비추는 거울일 수 있습니다. 오늘은 차분히 자신을 돌보는 시간을 가져보세요.",
  "traditionalMeaning": "꿈은 흐름을 알려주는 신호이므로 차분한 태도가 도움이 됩니다.",
  "psychologicalMeaning": "마음의 균형을 맞추고 싶다는 내면의 메시지입니다.",
  "category": "etc",
  "grade": "good",
  "score": 50
};
