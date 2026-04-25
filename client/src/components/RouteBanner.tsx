import { Link, useLocation } from 'wouter';
import {
  Activity,
  ArrowRight,
  BookOpenText,
  Brain,
  CalendarDays,
  Clock3,
  Gem,
  Globe2,
  Heart,
  Layers3,
  MoonStar,
  Palette,
  PenLine,
  ScrollText,
  Shield,
  Sparkles,
  Stars,
  Users,
  UtensilsCrossed,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react';

type BannerLink = { href: string; label: string };

type BannerMeta = {
  title: string;
  description: string;
  eyebrow: string;
  Icon: LucideIcon;
  chips: string[];
  stats: Array<{ label: string; value: string }>;
  quickLinks: BannerLink[];
};

const routeBannerMeta: Array<{ match: (path: string) => boolean; meta: BannerMeta }> = [
  {
    match: (path) => path.startsWith('/manselyeok'),
    meta: {
      eyebrow: '핵심 사주 해석',
      title: '만세력과 사주 구조를 먼저 빠르게 확인하세요',
      description: '사주팔자의 천간·지지 조합과 오행 흐름을 모바일 화면에서 보기 쉽게 정리했습니다. 결과 카드도 같은 톤으로 이어집니다.',
      Icon: CalendarDays,
      chips: ['회원가입 없음', '오행 균형', '모바일 우선'],
      stats: [{ label: '핵심 포인트', value: '사주표 + 해설' }, { label: '이어서 보기', value: '운세 사전 연결' }],
      quickLinks: [{ href: '/fortune-dictionary', label: '운세 사전' }, { href: '/guide', label: '운세 칼럼' }],
    },
  },
  {
    match: (path) => path.startsWith('/lifelong-saju'),
    meta: {
      eyebrow: '대표 서비스',
      title: '평생사주를 한 번에 이해할 수 있도록 핵심만 담았습니다',
      description: '성격, 관계, 일, 재물처럼 자주 보는 항목을 먼저 보여주고 필요한 설명은 자연스럽게 이어서 읽을 수 있게 구성했습니다.',
      Icon: Sparkles,
      chips: ['대표 서비스', '기질 해설', '결과 중심'],
      stats: [{ label: '분석 흐름', value: '성격 → 운세 → 조언' }, { label: '탐색 연결', value: '칼럼 · 사전' }],
      quickLinks: [{ href: '/guide', label: '관련 칼럼' }, { href: '/fortune-dictionary', label: '용어 찾아보기' }],
    },
  },
  {
    match: (path) => path.startsWith('/yearly-fortune'),
    meta: {
      eyebrow: '신년 운세 가이드',
      title: '2026년 흐름을 월별·주제별로 보기 쉽게 정리했습니다',
      description: '올해운세와 상세 결과 화면 모두 메인 톤에 맞춰 더 밝고 선명한 모바일 카드 구조로 이어집니다.',
      Icon: ScrollText,
      chips: ['월별 운세', '재물 · 직업', '모바일 카드'],
      stats: [{ label: '주요 구조', value: '총운 + 월별 흐름' }, { label: '공유 가능', value: '결과 화면 최적화' }],
      quickLinks: [{ href: '/daily-fortune', label: '오늘의 운세' }, { href: '/tojeong', label: '토정비결' }],
    },
  },
  {
    match: (path) => path.startsWith('/daily-fortune'),
    meta: {
      eyebrow: '오늘의 운세',
      title: '오늘의 운세를 더 빠르게 읽고 다음 행동으로 이어지게 했습니다',
      description: '점수, 총평, 오늘의 포인트처럼 자주 보는 결과를 선명한 대비와 간격으로 재정리한 모바일 결과 화면입니다.',
      Icon: Clock3,
      chips: ['하루 요약', '짧은 해설', '빠른 스캔'],
      stats: [{ label: '읽는 흐름', value: '총평 → 영역별 운' }, { label: '연결', value: '점심 · 칼럼' }],
      quickLinks: [{ href: '/lucky-lunch', label: '행운 점심' }, { href: '/guide', label: '운세 칼럼' }],
    },
  },
  {
    match: (path) => path.startsWith('/compatibility'),
    meta: {
      eyebrow: '궁합 분석',
      title: '궁합 결과를 더 또렷한 비교 구조로 읽을 수 있게 바꿨습니다',
      description: '두 사람의 조화와 차이를 모바일에서도 빠르게 훑을 수 있도록 대비와 카드 구조를 메인 톤에 맞춰 정리했습니다.',
      Icon: Heart,
      chips: ['관계 분석', '비교 카드', '설명 강화'],
      stats: [{ label: '결과 포인트', value: '종합 · 영역별' }, { label: '확장 서비스', value: '사주×MBTI' }],
      quickLinks: [{ href: '/hybrid-compatibility', label: '사주×MBTI' }, { href: '/dream', label: '꿈해몽' }],
    },
  },
  {
    match: (path) => path.startsWith('/tojeong'),
    meta: {
      eyebrow: '전통 운세',
      title: '토정비결도 메인과 같은 카드 톤으로 다시 정리했습니다',
      description: '전통 운세 화면이 너무 무겁지 않도록 밝은 배경과 선명한 정보 계층으로 읽기 흐름을 맞췄습니다.',
      Icon: BookOpenText,
      chips: ['전통 운세', '월별 해설', '가벼운 화면'],
      stats: [{ label: '구성', value: '총운 + 월별' }, { label: '추천 흐름', value: '신년운세와 함께' }],
      quickLinks: [{ href: '/yearly-fortune', label: '신년운세' }, { href: '/guide', label: '운세 칼럼' }],
    },
  },
  {
    match: (path) => path.startsWith('/astrology'),
    meta: {
      eyebrow: '점성술 리딩',
      title: '점성술 화면도 무운의 메인 톤에 맞춰 다시 정돈했습니다',
      description: '차트 해석과 설명 카드의 대비를 높여 작은 화면에서도 필요한 정보가 먼저 보이도록 리듬을 맞췄습니다.',
      Icon: Globe2,
      chips: ['네이탈 차트', '행성 해설', '모바일 가독성'],
      stats: [{ label: '중심 흐름', value: '차트 → 의미 해설' }, { label: '연결', value: '심리 · 칼럼' }],
      quickLinks: [{ href: '/psychology', label: '심리 테스트' }, { href: '/guide', label: '칼럼 읽기' }],
    },
  },
  {
    match: (path) => path.startsWith('/tarot'),
    meta: {
      eyebrow: '타로 리딩',
      title: '타로 결과 화면을 더 차분하고 또렷하게 정리했습니다',
      description: '카드 선택, 해석, 조언의 단계가 자연스럽게 이어지도록 정보 밀도를 조절하고 배경 톤을 맞췄습니다.',
      Icon: Layers3,
      chips: ['카드 해석', '질문 중심', '모바일 카드'],
      stats: [{ label: '진행 방식', value: '질문 → 카드 → 메시지' }, { label: '연결', value: '전생 · 꿈해몽' }],
      quickLinks: [{ href: '/past-life', label: '전생 보기' }, { href: '/dream', label: '꿈해몽' }],
    },
  },
  {
    match: (path) => path.startsWith('/naming'),
    meta: {
      eyebrow: '작명 서비스',
      title: '작명소 화면도 메인 브랜드 톤에 맞춰 정돈했습니다',
      description: '이름 제안, 한자 조합, 의미 설명이 길어도 모바일에서 부담 없이 읽히도록 카드와 텍스트 구조를 손봤습니다.',
      Icon: PenLine,
      chips: ['이름 제안', '한자 풀이', '설명 카드'],
      stats: [{ label: '핵심 구조', value: '입력 → 추천 → 설명' }, { label: '연계', value: '평생사주 기반' }],
      quickLinks: [{ href: '/lifelong-saju', label: '평생사주' }, { href: '/guide', label: '칼럼 보기' }],
    },
  },
  {
    match: (path) => path.startsWith('/psychology'),
    meta: {
      eyebrow: '심리 테스트',
      title: '심리 테스트도 무운의 모바일 카드 경험으로 정리했습니다',
      description: '짧은 질문과 결과 해설을 더 명확하게 보여주고, 사주 서비스와 자연스럽게 이어질 수 있도록 화면 흐름을 맞췄습니다.',
      Icon: Brain,
      chips: ['가벼운 탐색', '짧은 결과', '다음 행동 연결'],
      stats: [{ label: '읽는 흐름', value: '질문 → 결과 요약' }, { label: '추천 이동', value: '평생사주' }],
      quickLinks: [{ href: '/lifelong-saju', label: '평생사주' }, { href: '/compatibility', label: '궁합 보기' }],
    },
  },
  {
    match: (path) => path.startsWith('/family-saju'),
    meta: {
      eyebrow: '가족 사주',
      title: '가족사주도 한 화면에서 비교하기 쉽게 정리했습니다',
      description: '구성원 입력부터 조화 분석 결과까지 같은 톤의 카드 시스템으로 연결해 모바일에서도 복잡해 보이지 않도록 다듬었습니다.',
      Icon: Users,
      chips: ['가족 조화', '비교 결과', '관계 해설'],
      stats: [{ label: '분석 구조', value: '구성원 → 조화 → 조언' }, { label: '관련 서비스', value: '궁합 · 칼럼' }],
      quickLinks: [{ href: '/compatibility', label: '궁합 보기' }, { href: '/guide', label: '관계 칼럼' }],
    },
  },
  {
    match: (path) => path.startsWith('/hybrid-compatibility'),
    meta: {
      eyebrow: '사주 × MBTI',
      title: '사주×MBTI 궁합도 메인 디자인과 같은 밀도로 정리했습니다',
      description: '차트와 요약 카드가 서로 경쟁하지 않도록 우선순위를 다시 잡아 모바일에서 읽기 쉬운 비교 화면으로 다듬었습니다.',
      Icon: WandSparkles,
      chips: ['사주 + MBTI', '비교 리포트', '모바일 최적화'],
      stats: [{ label: '핵심', value: '관계 조화 비교' }, { label: '연계', value: '기본 궁합' }],
      quickLinks: [{ href: '/compatibility', label: '기본 궁합' }, { href: '/fortune-dictionary', label: '용어 사전' }],
    },
  },
  {
    match: (path) => path.startsWith('/lucky-lunch'),
    meta: {
      eyebrow: '행운 점심 추천',
      title: '행운 점심도 메인과 같은 밝은 카드 흐름으로 맞췄습니다',
      description: '추천 메뉴, 이유, 가벼운 해설이 모바일에서 한 번에 읽히도록 카드 간격과 텍스트 체계를 재정리했습니다.',
      Icon: UtensilsCrossed,
      chips: ['오늘의 메뉴', '가벼운 재미', '빠른 확인'],
      stats: [{ label: '추천 방식', value: '오늘의 한 끼' }, { label: '연결', value: '오늘의 운세' }],
      quickLinks: [{ href: '/daily-fortune', label: '오늘의 운세' }, { href: '/more', label: '전체 서비스' }],
    },
  },
  {
    match: (path) => path.startsWith('/past-life'),
    meta: {
      eyebrow: '전생 스토리',
      title: '전생 보기 화면도 브랜드 톤에 맞춰 더 선명하게 정리했습니다',
      description: '입력과 결과 스토리가 흐트러지지 않도록 카드 대비와 간격을 조절해 메인 경험과 어울리는 화면으로 다듬었습니다.',
      Icon: Stars,
      chips: ['스토리형 결과', '몰입도 강화', '모바일 카드'],
      stats: [{ label: '진행', value: '입력 → 스토리 결과' }, { label: '추천 이동', value: '타로 · 꿈해몽' }],
      quickLinks: [{ href: '/tarot', label: '타로 보기' }, { href: '/dream', label: '꿈해몽' }],
    },
  },
  {
    match: (path) => path === '/about' || path === '/contact' || path === '/privacy' || path === '/terms',
    meta: {
      eyebrow: '브랜드 & 정책',
      title: '무운의 소개와 정책 페이지도 같은 톤으로 정리했습니다',
      description: '브랜드 소개, 문의, 개인정보처리방침, 이용약관도 서비스 화면과 같은 리듬으로 읽을 수 있도록 화면 톤을 맞췄습니다.',
      Icon: Shield,
      chips: ['브랜드 소개', '문의', '정책 문서'],
      stats: [{ label: '핵심 가치', value: '무료 · 모바일 · 가독성' }, { label: '연결', value: '대표 서비스로 이동' }],
      quickLinks: [{ href: '/lifelong-saju', label: '평생사주' }, { href: '/more', label: '전체 서비스' }],
    },
  },
];

function resolveBannerMeta(path: string) {
  return routeBannerMeta.find((entry) => entry.match(path))?.meta ?? null;
}

export default function RouteBanner() {
  const [location] = useLocation();
  const meta = resolveBannerMeta(location);

  if (!meta) return null;

  const { Icon } = meta;

  return (
    <section className="mu-route-banner" aria-label={`${meta.title} 안내`}>
      <div className="mu-container-narrow mu-route-banner__inner">
        <div className="mu-route-banner__shell">
          <div className="mu-route-banner__copy">
            <span className="mu-kicker">{meta.eyebrow}</span>
            <div className="mu-route-banner__icon-chip">
              <span className="mu-route-banner__icon-wrap"><Icon size={18} aria-hidden="true" /></span>
              <span>무운 서비스 안내</span>
            </div>
            <h2 className="mu-route-banner__title">{meta.title}</h2>
            <p className="mu-route-banner__description">{meta.description}</p>
            <div className="mu-route-banner__chips">
              {meta.chips.map((chip) => (
                <span key={chip} className="mu-stat-pill">{chip}</span>
              ))}
            </div>
          </div>

          <div className="mu-route-banner__aside">
            <div className="mu-route-banner__stats">
              {meta.stats.map((item) => (
                <div key={item.label} className="mu-route-banner__stat-card">
                  <div className="mu-route-banner__stat-label">{item.label}</div>
                  <div className="mu-route-banner__stat-value">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mu-route-banner__links mu-glass-panel">
              <div className="mu-route-banner__links-label">이어서 보기</div>
              <div className="mu-route-banner__link-list">
                {meta.quickLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="mu-route-banner__link-item">
                    <span>{link.label}</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
