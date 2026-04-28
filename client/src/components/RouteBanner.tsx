import { Link, useLocation } from 'wouter';
import {
  ArrowRight,
  BookOpenText,
  Brain,
  CalendarDays,
  Heart,
  MoonStar,
  PenLine,
  ScrollText,
  Shield,
  Sparkles,
  Stars,
  Users,
  WandSparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react';

type BannerLink = { href: string; label: string };

type BannerMeta = {
  title: string;
  description: string;
  eyebrow: string;
  Icon: LucideIcon;
  chips: string[];
  quickLinks: BannerLink[];
};

const routeBannerMeta: Array<{ match: (path: string) => boolean; meta: BannerMeta }> = [
  {
    match: (path) => path.startsWith('/manselyeok'),
    meta: {
      eyebrow: '만세력',
      title: '사주 네 기둥을 한눈에 확인하세요',
      description: '천간과 지지, 오행 균형, 핵심 해석까지 깔끔한 카드형 화면으로 정리했습니다.',
      Icon: CalendarDays,
      chips: ['사주팔자', '오행 균형', '기초 해석'],
      quickLinks: [{ href: '/lifelong-saju', label: '평생사주 보기' }, { href: '/fortune-dictionary', label: '용어 사전' }],
    },
  },
  {
    match: (path) => path.startsWith('/lifelong-saju'),
    meta: {
      eyebrow: '평생사주',
      title: '타고난 기질과 인생 흐름을 정리해 드려요',
      description: '성격, 재물, 관계, 건강까지 꼭 필요한 결과만 보기 쉬운 흐름으로 보여줍니다.',
      Icon: Sparkles,
      chips: ['핵심 요약', '인생 흐름', '쉬운 해석'],
      quickLinks: [{ href: '/guide', label: '관련 칼럼' }, { href: '/fortune-dictionary', label: '용어 찾기' }],
    },
  },
  {
    match: (path) => path.startsWith('/yearly-fortune'),
    meta: {
      eyebrow: '신년운세',
      title: '올해 흐름을 미리 읽고 준비해 보세요',
      description: '총운과 월별 포인트, 재물·직업·건강 흐름을 한 화면에서 빠르게 확인할 수 있습니다.',
      Icon: Sparkles,
      chips: ['총운', '월별 흐름', '연간 포인트'],
      quickLinks: [{ href: '/daily-fortune', label: '오늘의 운세' }, { href: '/tojeong', label: '토정비결' }],
    },
  },
  {
    match: (path) => path.startsWith('/daily-fortune'),
    meta: {
      eyebrow: '오늘의 운세',
      title: '하루 운세를 가볍고 빠르게 확인하세요',
      description: '총운과 애정·금전·건강 포인트를 읽기 쉬운 카드로 정리했습니다.',
      Icon: Zap,
      chips: ['하루 요약', '행운 포인트', '관련 콘텐츠'],
      quickLinks: [{ href: '/yearly-fortune', label: '신년운세' }, { href: '/guide', label: '운세 칼럼' }],
    },
  },
  {
    match: (path) => path.startsWith('/compatibility'),
    meta: {
      eyebrow: '궁합',
      title: '두 사람의 조화를 점수와 해석으로 보여드려요',
      description: '감정, 대화, 생활 리듬 같은 실제 관계 포인트를 보기 쉽게 확인할 수 있습니다.',
      Icon: Heart,
      chips: ['궁합 점수', '관계 포인트', '쉬운 해석'],
      quickLinks: [{ href: '/hybrid-compatibility', label: '사주×MBTI 궁합' }, { href: '/lifelong-saju', label: '평생사주' }],
    },
  },
  {
    match: (path) => path.startsWith('/tojeong'),
    meta: {
      eyebrow: '토정비결',
      title: '전통 운세로 한 해 흐름을 살펴보세요',
      description: '총평과 시즌별 포인트, 재물·건강·관계 흐름을 부드러운 카드 레이아웃으로 담았습니다.',
      Icon: ScrollText,
      chips: ['전통 운세', '연간 흐름', '실천 조언'],
      quickLinks: [{ href: '/yearly-fortune', label: '신년운세' }, { href: '/guide', label: '관련 칼럼' }],
    },
  },
  {
    match: (path) => path.startsWith('/astrology'),
    meta: {
      eyebrow: '점성술',
      title: '네이탈 차트로 나를 읽어보세요',
      description: '태양, 달, 상승궁과 차트 포인트를 한눈에 보고 나와 잘 맞는 키워드를 확인할 수 있어요.',
      Icon: Stars,
      chips: ['네이탈 차트', '별자리 해석', '성향 키워드'],
      quickLinks: [{ href: '/lifelong-saju', label: '평생사주' }, { href: '/guide', label: '운세 칼럼' }],
    },
  },
  {
    match: (path) => path.startsWith('/tarot'),
    meta: {
      eyebrow: '타로',
      title: '질문에 맞는 카드 메시지를 받아보세요',
      description: '선택한 카드의 의미, 현재 흐름, 다음 행동 포인트를 부드러운 화면 안에서 안내합니다.',
      Icon: Stars,
      chips: ['질문 중심', '카드 메시지', '행동 조언'],
      quickLinks: [{ href: '/dream', label: '꿈해몽' }, { href: '/daily-fortune', label: '오늘의 운세' }],
    },
  },
  {
    match: (path) => path.startsWith('/naming'),
    meta: {
      eyebrow: '작명소',
      title: '이름 후보를 비교하고 추천해 드려요',
      description: '발음, 의미, 오행 조화까지 함께 비교해서 보기 쉬운 추천 결과로 정리합니다.',
      Icon: PenLine,
      chips: ['이름 비교', '오행 조화', '추천 결과'],
      quickLinks: [{ href: '/lifelong-saju', label: '평생사주' }, { href: '/fortune-dictionary', label: '용어 사전' }],
    },
  },
  {
    match: (path) => path.startsWith('/psychology'),
    meta: {
      eyebrow: '심리테스트',
      title: '나를 더 잘 이해하는 결과 화면',
      description: '성향 점수와 핵심 특징, 추천 콘텐츠까지 한 화면에서 편하게 확인할 수 있어요.',
      Icon: Brain,
      chips: ['성향 유형', '핵심 특징', '추천 콘텐츠'],
      quickLinks: [{ href: '/hybrid-compatibility', label: '사주×MBTI 궁합' }, { href: '/guide', label: '칼럼 보기' }],
    },
  },
  {
    match: (path) => path.startsWith('/family-saju'),
    meta: {
      eyebrow: '가족사주',
      title: '가족의 조화와 관계 포인트를 확인하세요',
      description: '가족 구성원의 흐름과 오행 균형을 함께 보며 서로에게 필요한 조언을 살펴볼 수 있습니다.',
      Icon: Users,
      chips: ['가족 조화', '오행 비교', '관계 조언'],
      quickLinks: [{ href: '/compatibility', label: '궁합 보기' }, { href: '/guide', label: '관계 칼럼' }],
    },
  },
  {
    match: (path) => path.startsWith('/hybrid-compatibility'),
    meta: {
      eyebrow: '사주×MBTI',
      title: '사주와 MBTI를 함께 본 궁합 결과',
      description: '성향 조합과 관계 조언, 주의 포인트를 부드러운 카드 구조로 보여드립니다.',
      Icon: WandSparkles,
      chips: ['성향 조합', '강점·주의점', '관계 조언'],
      quickLinks: [{ href: '/compatibility', label: '기본 궁합' }, { href: '/psychology', label: '심리테스트' }],
    },
  },
  {
    match: (path) => path.startsWith('/dream/'),
    meta: {
      eyebrow: '꿈해몽',
      title: '꿈이 전하는 메시지를 차분히 읽어보세요',
      description: '핵심 해석, 상황별 의미, 관련 키워드를 보기 쉬운 순서로 정리했습니다.',
      Icon: MoonStar,
      chips: ['꿈 해석', '상황별 의미', '관련 키워드'],
      quickLinks: [{ href: '/dream', label: '다른 꿈 찾기' }, { href: '/daily-fortune', label: '오늘의 운세' }],
    },
  },
  {
    match: (path) => path.startsWith('/dictionary/'),
    meta: {
      eyebrow: '운세 사전',
      title: '사주 용어를 부드럽고 쉽게 이해하세요',
      description: '개념 설명과 예시, 관련 용어 연결로 처음 보는 용어도 부담 없이 읽을 수 있게 구성했습니다.',
      Icon: BookOpenText,
      chips: ['용어 해설', '예시 설명', '관련 용어'],
      quickLinks: [{ href: '/fortune-dictionary', label: '사전 홈' }, { href: '/lifelong-saju', label: '평생사주 보기' }],
    },
  },
  {
    match: (path) => path.startsWith('/guide/'),
    meta: {
      eyebrow: '운세 칼럼',
      title: '운세를 삶에 연결하는 읽을거리',
      description: '본문과 함께 관련 사전, 추천 칼럼, 연결 서비스까지 자연스럽게 이어지도록 정리했습니다.',
      Icon: BookOpenText,
      chips: ['읽기 쉬운 본문', '관련 사전', '추천 칼럼'],
      quickLinks: [{ href: '/guide', label: '칼럼 홈' }, { href: '/fortune-dictionary', label: '용어 사전' }],
    },
  },
  {
    match: (path) => path === '/about' || path === '/contact' || path === '/privacy' || path === '/terms',
    meta: {
      eyebrow: '무운 안내',
      title: '무운사주 서비스 소개',
      description: '무운은 회원가입 없이 무료로 사주, 궁합, 꿈해몽을 제공하는 모바일 중심 운세 서비스입니다.',
      Icon: Shield,
      chips: ['회원가입 없음', '무료', '모바일 최적화'],
      quickLinks: [{ href: '/lifelong-saju', label: '평생사주' }, { href: '/more', label: '전체 서비스' }],
    },
  },
];

function resolveBannerMeta(path: string) {
  if (path === '/guide' || path === '/dream' || path === '/fortune-dictionary') return null;
  return routeBannerMeta.find((entry) => entry.match(path))?.meta ?? null;
}

export default function RouteBanner() {
  const [location] = useLocation();
  const meta = resolveBannerMeta(location);

  if (!meta) return null;

  const { Icon } = meta;

  return (
    <section className="mu-route-banner" aria-label={`${meta.title} 안내`}>
      <div className="mu-route-banner__inner">
        <div className="mu-route-banner__body">
          <span className="mu-route-banner__eyebrow">
            <Icon size={13} aria-hidden="true" />
            {meta.eyebrow}
          </span>
          <h2 className="mu-route-banner__title">{meta.title}</h2>
          <p className="mu-route-banner__description">{meta.description}</p>
          <div className="mu-route-banner__chips">
            {meta.chips.map((chip) => (
              <span key={chip} className="mu-stat-pill">{chip}</span>
            ))}
          </div>
          <div className="mu-route-banner__links">
            {meta.quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="mu-route-banner__link-item">
                <span>{link.label}</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
