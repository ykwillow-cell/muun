/**
 * 무운(MuUn) 사주 칼럼 데이터
 * SEO 최적화된 전문 칼럼 콘텐츠 관리
 */

export interface ColumnData {
  id: string;
  title: string;
  description: string;
  category: 'beginner' | 'luck' | 'relationship' | 'health' | 'fortune' | 'fate';
  categoryLabel: string;
  author: string;
  publishedDate: string;
  readTime: number; // 분 단위
  thumbnail: string;
  keywords: string[];
  content: string; // HTML 형식의 본문 내용
  relatedServiceUrl?: string; // 관련 서비스 링크
}

export const COLUMN_CATEGORIES = {
  beginner: { label: '사주 기초', color: 'bg-blue-500/20 text-blue-400' },
  luck: { label: '개운법', color: 'bg-yellow-500/20 text-yellow-400' },
  relationship: { label: '관계 & 궁합', color: 'bg-pink-500/20 text-pink-400' },
  health: { label: '건강 & 운', color: 'bg-green-500/20 text-green-400' },
  fortune: { label: '재물운', color: 'bg-purple-500/20 text-purple-400' },
  fate: { label: '운명의 흐름', color: 'bg-indigo-500/20 text-indigo-400' },
};

export const columns: ColumnData[] = [
  {
    id: 'column-001',
    title: '인생의 대운이 바뀌기 전, 반드시 나타나는 징조 3가지',
    description: '10년마다 바뀌는 대운의 변화. 그 전환점에서 나타나는 신호들을 미리 알아두면 인생의 흐름을 더 현명하게 준비할 수 있습니다.',
    category: 'luck',
    categoryLabel: '개운법',
    author: '무운 역술팀',
    publishedDate: '2026-02-21',
    readTime: 6,
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    keywords: ['대운 바뀌는 징조', '운의 흐름', '인생 전환점', '사주 운세'],
    content: `
      <div class="prose prose-invert max-w-none">
        <h2 class="text-2xl font-bold mb-4 text-white">인생의 대운이 바뀌기 전, 반드시 나타나는 징조 3가지</h2>
        
        <p class="text-white/80 mb-6 leading-relaxed">
          사주에서 말하는 '대운(大運)'은 우리 인생에서 약 10년마다 찾아오는 큰 변화의 흐름입니다. 
          새로운 대운이 시작되기 전에는 반드시 작은 신호들이 나타나곤 합니다. 
          이 징조들을 미리 알아두면, 인생의 큰 변화에 더 현명하게 대비할 수 있습니다.
        </p>

        <h3 class="text-xl font-semibold mb-3 text-white mt-8">첫 번째 징조: 일상의 작은 변화들이 연쇄적으로 일어난다</h3>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          대운이 바뀌기 약 6개월에서 1년 전부터, 우리는 일상에서 작은 변화들을 경험하게 됩니다. 
          예를 들어:
        </p>
        
        <ul class="list-disc list-inside text-white/80 mb-6 space-y-2">
          <li>오래 다니던 직장에서 갑자기 이직의 기회가 생긴다</li>
          <li>친한 친구들과의 관계가 자연스럽게 멀어진다</li>
          <li>건강 문제가 작게 시작되어 점점 커진다</li>
          <li>살던 집을 떠나야 할 상황이 생긴다</li>
        </ul>
        
        <p class="text-white/80 mb-6 leading-relaxed">
          이런 변화들은 우연처럼 보이지만, 사실 우리의 운이 새로운 방향으로 흐르기 시작했다는 신호입니다. 
          중요한 것은 이 변화들을 거부하지 않고 자연스럽게 받아들이는 것입니다.
        </p>

        <div class="bg-primary/10 border-l-4 border-primary p-4 mb-6 rounded">
          <p class="text-white font-semibold mb-2">💡 무운의 팁</p>
          <p class="text-white/80">
            대운 전환기에 일어나는 변화들은 우리를 더 나은 곳으로 인도하기 위한 것입니다. 
            저항하기보다는 변화의 흐름을 타면서 새로운 기회를 찾아보세요.
          </p>
        </div>

        <h3 class="text-xl font-semibold mb-3 text-white mt-8">두 번째 징조: 꿈과 현실이 자주 겹친다</h3>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          대운의 변화가 임박했을 때, 많은 사람들이 꿈을 자주 꾸거나 꿈과 현실이 일치하는 경험을 하게 됩니다. 
          이는 우리의 잠재의식이 다가올 변화를 미리 감지하고 있다는 신호입니다.
        </p>
        
        <p class="text-white/80 mb-6 leading-relaxed">
          특히 반복되는 꿈이나 강렬한 감정을 남기는 꿈을 자주 꾼다면, 
          그것은 당신의 영혼이 준비하라고 보내는 메시지일 수 있습니다. 
          이런 시기에는 충분한 휴식과 명상을 통해 내면의 목소리에 귀를 기울이는 것이 좋습니다.
        </p>

        <h3 class="text-xl font-semibold mb-3 text-white mt-8">세 번째 징조: 인간관계의 재편성이 일어난다</h3>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          대운이 바뀌기 전에는 인간관계에서도 눈에 띄는 변화가 나타납니다. 
          오랫동안 함께했던 사람들과의 관계가 자연스럽게 정리되고, 
          새로운 인연들이 우연처럼 들어오게 됩니다.
        </p>
        
        <p class="text-white/80 mb-6 leading-relaxed">
          이것은 결코 슬픈 일이 아닙니다. 우리의 운이 새로운 방향으로 흐르면서, 
          그 흐름에 맞는 새로운 사람들을 만나게 되는 것입니다. 
          마치 강물이 흐르는 방향에 따라 다른 것들이 함께 흐르는 것처럼 말입니다.
        </p>

        <h3 class="text-xl font-semibold mb-3 text-white mt-8">대운 변화 앞에서 할 수 있는 준비</h3>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          이런 징조들을 느꼈다면, 다음과 같이 준비해 보세요:
        </p>
        
        <ul class="list-disc list-inside text-white/80 mb-6 space-y-2">
          <li><strong>마음의 정리:</strong> 과거에 집착하지 않고 새로운 시작을 받아들일 준비</li>
          <li><strong>신체 건강:</strong> 규칙적인 운동과 충분한 수면으로 신체 에너지 충전</li>
          <li><strong>환경 정리:</strong> 집안 정리정돈과 불필요한 물건 정리로 새로운 기운 맞이</li>
          <li><strong>목표 설정:</strong> 새 대운에서 이루고 싶은 것들을 명확히 하기</li>
        </ul>

        <p class="text-white/80 mb-6 leading-relaxed">
          당신의 사주에서 대운이 언제 바뀌는지, 그리고 그 시기에 어떤 운이 찾아올지 
          미리 알아두면 더욱 현명하게 준비할 수 있습니다.
        </p>

        <div class="bg-primary/10 border-l-4 border-primary p-4 rounded">
          <p class="text-white font-semibold mb-2">🌟 지금 당신의 대운을 확인해보세요</p>
          <p class="text-white/80 mb-4">
            생년월일만으로 당신의 현재 대운과 앞으로의 운의 흐름을 한눈에 볼 수 있습니다. 
            무운의 평생사주 분석에서 당신의 10년 대운을 확인해보세요.
          </p>
        </div>
      </div>
    `,
    relatedServiceUrl: '/lifelong-saju',
  },
  {
    id: 'column-002',
    title: '내 사주팔자 스스로 보는 법: 만세력 8글자의 비밀',
    description: '사주의 기본이 되는 8글자(년월일시)의 의미를 알면, 자신의 사주를 훨씬 더 깊이 있게 이해할 수 있습니다.',
    category: 'beginner',
    categoryLabel: '사주 기초',
    author: '무운 역술팀',
    publishedDate: '2026-02-20',
    readTime: 7,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f70504466?w=400&h=300&fit=crop',
    keywords: ['사주 보는 법', '만세력 해석', '사주팔자', '천간지지'],
    content: `
      <div class="prose prose-invert max-w-none">
        <h2 class="text-2xl font-bold mb-4 text-white">내 사주팔자 스스로 보는 법: 만세력 8글자의 비밀</h2>
        
        <p class="text-white/80 mb-6 leading-relaxed">
          사주를 처음 접하는 분들이 가장 많이 궁금해하는 것이 '만세력'입니다. 
          생년월일시를 입력하면 나오는 8글자(년월일시 각 2글자씩)가 바로 당신의 사주입니다. 
          이 8글자가 무엇을 의미하는지 알면, 자신을 훨씬 더 잘 이해할 수 있습니다.
        </p>

        <h3 class="text-xl font-semibold mb-3 text-white mt-8">사주 8글자는 어떻게 만들어질까?</h3>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          사주의 8글자는 '천간(天干)'과 '지지(地支)'라는 두 가지 기호로 이루어져 있습니다.
        </p>
        
        <ul class="list-disc list-inside text-white/80 mb-6 space-y-2">
          <li><strong>천간:</strong> 하늘의 기운을 나타내는 10개의 기호 (갑, 을, 병, 정, 무, 기, 경, 신, 임, 계)</li>
          <li><strong>지지:</strong> 땅의 기운을 나타내는 12개의 기호 (자, 축, 인, 묘, 진, 사, 오, 미, 신, 유, 술, 해)</li>
        </ul>
        
        <p class="text-white/80 mb-6 leading-relaxed">
          예를 들어 1985년 10월 1일 오후 12시에 태어난 사람이라면, 
          사주는 '을축 경술 기유 을미'라고 표현됩니다. 
          각 글자 쌍(을축, 경술, 기유, 을미)이 년주, 월주, 일주, 시주를 나타냅니다.
        </p>

        <h3 class="text-xl font-semibold mb-3 text-white mt-8">8글자 각각이 의미하는 것</h3>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          <strong>1. 년주(年柱) - 당신의 뿌리와 가정</strong>
        </p>
        <p class="text-white/80 mb-6 leading-relaxed">
          태어난 해를 나타내며, 당신의 가정환경, 부모와의 관계, 그리고 타고난 기질을 보여줍니다. 
          어떤 집안에 태어났는지, 어떤 가정 환경에서 자랐는지를 알 수 있습니다.
        </p>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          <strong>2. 월주(月柱) - 당신의 성격과 기질</strong>
        </p>
        <p class="text-white/80 mb-6 leading-relaxed">
          태어난 달을 나타내며, 당신의 기본적인 성격, 성향, 그리고 사회생활에서의 모습을 보여줍니다. 
          월주가 강할수록 그 사람의 성격이 뚜렷하고 일관성 있게 나타납니다.
        </p>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          <strong>3. 일주(日柱) - 당신의 본질</strong>
        </p>
        <p class="text-white/80 mb-6 leading-relaxed">
          태어난 날을 나타내며, 가장 중요한 주(柱)입니다. 
          일주의 천간은 '나'를 나타내고, 지지는 '배우자'를 나타냅니다. 
          따라서 일주를 보면 당신의 본질과 결혼생활의 특징을 알 수 있습니다.
        </p>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          <strong>4. 시주(時柱) - 당신의 자녀와 노후</strong>
        </p>
        <p class="text-white/80 mb-6 leading-relaxed">
          태어난 시간을 나타내며, 자녀와의 관계, 그리고 인생의 후반부와 노후를 보여줍니다. 
          또한 당신이 사회에서 어떤 역할을 하게 될지도 알 수 있습니다.
        </p>

        <div class="bg-primary/10 border-l-4 border-primary p-4 mb-6 rounded">
          <p class="text-white font-semibold mb-2">💡 무운의 팁</p>
          <p class="text-white/80">
            사주를 볼 때는 반드시 정확한 출생시간이 필요합니다. 
            시간을 모를 경우 정오(12시)를 기준으로 보기도 하지만, 
            가능하면 출생증명서나 가족에게 확인하여 정확한 시간을 알아두세요.
          </p>
        </div>

        <h3 class="text-xl font-semibold mb-3 text-white mt-8">오행(五行)으로 보는 나의 성격</h3>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          천간과 지지는 각각 목(木), 화(火), 토(土), 금(金), 수(水)라는 5가지 오행으로 분류됩니다. 
          당신의 사주에서 어떤 오행이 많은지 보면, 당신의 기본 성격을 파악할 수 있습니다.
        </p>
        
        <ul class="list-disc list-inside text-white/80 mb-6 space-y-2">
          <li><strong>목(木):</strong> 진취적, 창의적, 새로운 것을 좋아함</li>
          <li><strong>화(火):</strong> 밝고 활발함, 리더십, 감정 표현이 풍부함</li>
          <li><strong>토(土):</strong> 안정적, 신뢰감, 포용력이 있음</li>
          <li><strong>금(金):</strong> 논리적, 정확함, 원칙을 중시함</li>
          <li><strong>수(水):</strong> 지혜로움, 유연함, 감정이 풍부함</li>
        </ul>

        <p class="text-white/80 mb-6 leading-relaxed">
          당신의 사주에서 어떤 오행이 부족한지, 어떤 오행이 많은지 알면, 
          부족한 부분을 보완하고 강점을 더 잘 활용할 수 있습니다.
        </p>

        <div class="bg-primary/10 border-l-4 border-primary p-4 rounded">
          <p class="text-white font-semibold mb-2">🌟 지금 당신의 사주를 분석해보세요</p>
          <p class="text-white/80 mb-4">
            무운의 만세력 분석에서 당신의 8글자를 확인하고, 
            각 글자가 의미하는 바를 자세히 알아보세요. 
            당신의 성격, 운명, 그리고 미래가 한눈에 보입니다.
          </p>
        </div>
      </div>
    `,
    relatedServiceUrl: '/manselyeok',
  },
  {
    id: 'column-003',
    title: '자녀의 학업운을 높여주는 사주별 공부 환경 조성법',
    description: '아이의 사주 특징을 이해하고 그에 맞는 학습 환경을 만들어주면, 아이의 잠재력을 더 잘 발휘하게 할 수 있습니다.',
    category: 'fortune',
    categoryLabel: '재물운',
    author: '무운 역술팀',
    publishedDate: '2026-02-19',
    readTime: 8,
    thumbnail: 'https://images.unsplash.com/photo-1427504494785-cddf194bbb20?w=400&h=300&fit=crop',
    keywords: ['자녀 사주', '공부운', '학업운', '문창귀인', '자녀 교육'],
    content: `
      <div class="prose prose-invert max-w-none">
        <h2 class="text-2xl font-bold mb-4 text-white">자녀의 학업운을 높여주는 사주별 공부 환경 조성법</h2>
        
        <p class="text-white/80 mb-6 leading-relaxed">
          모든 부모는 자녀가 공부를 잘하기를 바랍니다. 
          하지만 모든 아이가 같은 방식으로 공부하면 좋은 결과를 얻을 수 있을까요? 
          아이의 사주를 이해하고 그에 맞는 학습 환경을 만들어주면, 
          아이의 진정한 잠재력을 발휘하게 할 수 있습니다.
        </p>

        <h3 class="text-xl font-semibold mb-3 text-white mt-8">사주에서 보는 학업운</h3>
        
        <p class="text-white/80 mb-6 leading-relaxed">
          사주에서 학업운을 보는 가장 중요한 요소는 '문창귀인(文昌貴人)'입니다. 
          이것은 지혜와 학문을 관장하는 길한 별로, 문창귀인이 있는 아이는 
          공부에 대한 이해력이 빠르고 학습 능력이 뛰어난 경향이 있습니다.
        </p>

        <p class="text-white/80 mb-6 leading-relaxed">
          또한 아이의 사주에서 '용신(用神)'이 무엇인지 아는 것도 중요합니다. 
          용신은 아이의 사주 오행 균형을 맞춰주는 가장 중요한 요소로, 
          용신이 무엇인지 알면 아이의 강점을 더 잘 살릴 수 있습니다.
        </p>

        <h3 class="text-xl font-semibold mb-3 text-white mt-8">오행별 학습 환경 조성법</h3>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          <strong>목(木) 오행이 강한 아이</strong>
        </p>
        <p class="text-white/80 mb-6 leading-relaxed">
          목 오행이 강한 아이는 창의력이 뛰어나고 새로운 것을 좋아합니다. 
          이런 아이에게는 정해진 교과서만 보는 것보다 다양한 책을 읽게 하고, 
          스스로 생각하고 표현하는 기회를 많이 주세요. 
          책상 위에 초록색 식물을 놓으면 집중력을 높이는 데 도움이 됩니다.
        </p>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          <strong>화(火) 오행이 강한 아이</strong>
        </p>
        <p class="text-white/80 mb-6 leading-relaxed">
          화 오행이 강한 아이는 밝고 활발하며 표현력이 좋습니다. 
          이런 아이는 혼자 조용히 공부하는 것보다 토론이나 발표를 통한 학습을 좋아합니다. 
          공부 시간을 너무 길게 잡기보다는 짧고 집중적으로 공부하게 하고, 
          중간중간 휴식 시간을 충분히 주세요.
        </p>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          <strong>토(土) 오행이 강한 아이</strong>
        </p>
        <p class="text-white/80 mb-6 leading-relaxed">
          토 오행이 강한 아이는 안정적이고 차근차근 공부하는 것을 좋아합니다. 
          이런 아이는 기초를 탄탄히 하는 것이 매우 중요합니다. 
          한 번에 많은 양의 공부를 하기보다는 매일 조금씩 꾸준히 하는 것이 효과적입니다. 
          공부 공간을 편안하고 안정적으로 꾸며주세요.
        </p>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          <strong>금(金) 오행이 강한 아이</strong>
        </p>
        <p class="text-white/80 mb-6 leading-relaxed">
          금 오행이 강한 아이는 논리적이고 정확함을 추구합니다. 
          이런 아이는 왜 그렇게 되는지 원리를 이해하고 싶어 합니다. 
          단순히 답을 외우게 하기보다는 원리를 설명해주고, 
          아이가 스스로 문제를 풀어내도록 유도하세요.
        </p>
        
        <p class="text-white/80 mb-4 leading-relaxed">
          <strong>수(水) 오행이 강한 아이</strong>
        </p>
        <p class="text-white/80 mb-6 leading-relaxed">
          수 오행이 강한 아이는 지혜롭고 유연한 사고를 합니다. 
          이런 아이는 다양한 관점에서 문제를 보는 능력이 뛰어납니다. 
          고정된 방식의 공부보다는 다양한 학습 방법을 시도해보게 하고, 
          아이의 호기심을 존중해주세요.
        </p>

        <div class="bg-primary/10 border-l-4 border-primary p-4 mb-6 rounded">
          <p class="text-white font-semibold mb-2">💡 무운의 팁</p>
          <p class="text-white/80">
            아이의 공부 능력은 타고난 것만이 아닙니다. 
            아이의 사주를 이해하고 그에 맞는 환경을 만들어주면, 
            아이의 진정한 잠재력을 발휘하게 할 수 있습니다.
          </p>
        </div>

        <h3 class="text-xl font-semibold mb-3 text-white mt-8">공부 공간 풍수 팁</h3>
        
        <ul class="list-disc list-inside text-white/80 mb-6 space-y-2">
          <li>책상은 창문이 보이는 위치에 놓되, 햇빛이 너무 강하지 않은 곳이 좋습니다</li>
          <li>책상 위에는 불필요한 물건을 놓지 않고 깔끔하게 정리하세요</li>
          <li>책상 뒤에는 벽이 있어야 심리적 안정감을 줍니다</li>
          <li>공부 공간에는 밝은 조명을 설치하되, 눈이 피로하지 않은 정도가 좋습니다</li>
          <li>아이의 사주 용신에 해당하는 색상을 공부 공간에 적절히 배치하면 집중력을 높일 수 있습니다</li>
        </ul>

        <p class="text-white/80 mb-6 leading-relaxed">
          가장 중요한 것은 아이를 있는 그대로 이해하고 존중하는 것입니다. 
          아이의 사주를 통해 아이의 강점과 약점을 파악하고, 
          그에 맞는 학습 방법을 찾아주세요.
        </p>

        <div class="bg-primary/10 border-l-4 border-primary p-4 rounded">
          <p class="text-white font-semibold mb-2">🌟 우리 아이의 사주를 분석해보세요</p>
          <p class="text-white/80 mb-4">
            무운의 가족사주 분석에서 아이의 사주를 확인하고, 
            아이의 학업운과 성격을 더 깊이 있게 이해해보세요. 
            아이에게 맞는 교육 방법을 찾을 수 있습니다.
          </p>
        </div>
      </div>
    `,
    relatedServiceUrl: '/family-saju',
  },
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
