import { useState, useEffect } from 'react';
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
      title: '사주 네 기둥, 바로 확인하세요',
      description: '생년월일을 입력하면 천간·지지 조합과 오행 흐름을 한눈에 확인할 수 있어요.',
      Icon: CalendarDays,
      chips: ['회원가입 없음', '오행 균형', '무료'],
      quickLinks: [{ href: '/lifelong-saju', label: '평생사주 보기' }, { href: '/fortune-dictionary', label: '용어 사전' }],
    },
  },
  {
    match: (path) => path.startsWith('/lifelong-saju'),
    meta: {
      eyebrow: '평생사주',
      title: '타고난 기질과 평생 운세를 분석합니다',
      description: '성격, 재물운, 직업운, 관계까지 타고난 기질을 항목별로 분석해 드려요.',
      Icon: Sparkles,
      chips: ['대표 서비스', '기질 해설', '무료'],
      quickLinks: [{ href: '/guide', label: '관련 칼럼' }, { href: '/fortune-dictionary', label: '용어 찾기' }],
    },
  },
  {
    match: (path) => path.startsWith('/yearly-fortune'),
    meta: {
      eyebrow: '2026 신년운세',
      title: '2026 병오년, 올해의 흐름을 확인하세요',
      description: '총운부터 월별 흐름, 재물·직업·건강까지 올해의 운세를 상세히 풀어드려요.',
      Icon: Sparkles,
      chips: ['월별 운세', '재물·직업', '무료'],
      quickLinks: [{ href: '/daily-fortune', label: '오늘의 운세' }, { href: '/lifelong-saju', label: '평생사주' }],
    },
  },
  {
    match: (path) => path.startsWith('/daily-fortune'),
    meta: {
      eyebrow: '오늘의 운세',
      title: '오늘 하루의 운세를 빠르게 확인하세요',
      description: '총운과 영역별 운세를 매일 새롭게 확인할 수 있어요.',
      Icon: Zap,
      chips: ['하루 요약', '빠른 확인', '무료'],
      quickLinks: [{ href: '/yearly-fortune', label: '신년운세' }, { href: '/guide', label: '운세 칼럼' }],
    },
  },
  {
    match: (path) => path.startsWith('/compatibility'),
    meta: {
      eyebrow: '궁합',
      title: '두 사람의 사주 궁합을 분석합니다',
      description: '두 사람의 오행 조화와 관계 특성으로 연애·결혼 궁합을 분석해 드려요.',
      Icon: Heart,
      chips: ['관계 분석', '연애·결혼', '무료'],
      quickLinks: [{ href: '/hybrid-compatibility', label: '사주×MBTI 궁합' }, { href: '/lifelong-saju', label: '평생사주' }],
    },
  },
  {
    match: (path) => path.startsWith('/tojeong'),
    meta: {
      eyebrow: '토정비결',
      title: '전통 방식으로 보는 올해의 운세',
      description: '토정비결로 이달의 흐름과 총운을 확인해 보세요.',
      Icon: ScrollText,
      chips: ['전통 운세', '월별 해설', '무료'],
      quickLinks: [{ href: '/yearly-fortune', label: '신년운세' }, { href: '/lifelong-saju', label: '평생사주' }],
    },
  },
  {
    match: (path) => path.startsWith('/astrology'),
    meta: {
      eyebrow: '점성술',
      title: '네이탈 차트로 별자리 운세를 분석합니다',
      description: '출생 시간과 장소를 기반으로 행성 배치를 분석하고 운세를 해석해 드려요.',
      Icon: Stars,
      chips: ['네이탈 차트', '행성 해설', '무료'],
      quickLinks: [{ href: '/lifelong-saju', label: '평생사주' }, { href: '/guide', label: '운세 칼럼' }],
    },
  },
  {
    match: (path) => path.startsWith('/tarot'),
    meta: {
      eyebrow: '타로',
      title: '질문을 떠올리고 카드를 선택하세요',
      description: '질문을 떠올리고 카드를 선택하면 해석과 조언을 드려요.',
      Icon: Stars,
      chips: ['카드 해석', '질문 중심', '무료'],
      quickLinks: [{ href: '/dream', label: '꿈해몽' }, { href: '/lifelong-saju', label: '평생사주' }],
    },
  },
  {
    match: (path) => path.startsWith('/naming'),
    meta: {
      eyebrow: '작명',
      title: '사주에 어울리는 이름을 찾아드려요',
      description: '81수리 성명학과 한자 의미를 바탕으로 사주에 어울리는 이름을 찾아드려요.',
      Icon: PenLine,
      chips: ['이름 분석', '한자 풀이', '무료'],
      quickLinks: [{ href: '/lifelong-saju', label: '평생사주' }, { href: '/fortune-dictionary', label: '용어 사전' }],
    },
  },
  {
    match: (path) => path.startsWith('/psychology'),
    meta: {
      eyebrow: '심리테스트',
      title: '나도 몰랐던 내 심리를 알아보세요',
      description: '짧은 질문으로 나의 성향과 특성을 파악하고, 사주와 연결해 볼 수 있습니다.',
      Icon: Brain,
      chips: ['가벼운 탐색', '짧은 결과', '무료'],
      quickLinks: [{ href: '/lifelong-saju', label: '평생사주' }, { href: '/hybrid-compatibility', label: 'MBTI 궁합' }],
    },
  },
  {
    match: (path) => path.startsWith('/family-saju'),
    meta: {
      eyebrow: '가족사주',
      title: '가족 구성원의 오행 조화를 분석합니다',
      description: '가족 구성원의 사주를 함께 입력하면 오행 균형과 관계 특성을 한눈에 확인할 수 있습니다.',
      Icon: Users,
      chips: ['가족 조화', '비교 분석', '무료'],
      quickLinks: [{ href: '/compatibility', label: '궁합 보기' }, { href: '/guide', label: '관계 칼럼' }],
    },
  },
  {
    match: (path) => path.startsWith('/hybrid-compatibility'),
    meta: {
      eyebrow: '사주×MBTI 궁합',
      title: '사주와 MBTI로 더 깊은 궁합을 봅니다',
      description: '사주 오행과 MBTI 성격 유형을 함께 분석해 두 사람의 조화를 다각도로 확인합니다.',
      Icon: WandSparkles,
      chips: ['사주+MBTI', '비교 분석', '무료'],
      quickLinks: [{ href: '/compatibility', label: '기본 궁합' }, { href: '/fortune-dictionary', label: '용어 사전' }],
    },
  },
  {
    match: (path) => path.startsWith('/dream'),
    meta: {
      eyebrow: '꿈해몽',
      title: '어젯밤 꿈의 의미를 찾아보세요',
      description: '꿈에 나온 키워드를 검색하면 해몽 풀이를 바로 확인할 수 있습니다.',
      Icon: MoonStar,
      chips: ['꿈 풀이', '키워드 검색', '무료'],
      quickLinks: [{ href: '/fortune-dictionary', label: '용어 사전' }, { href: '/lifelong-saju', label: '평생사주' }],
    },
  },
  {
    match: (path) => path.startsWith('/fortune-dictionary'),
    meta: {
      eyebrow: '운세 사전',
      title: '사주 용어를 쉽게 찾아보세요',
      description: '일주, 용신, 대운, 십신 등 사주 용어의 의미를 쉬운 말로 설명합니다.',
      Icon: BookOpenText,
      chips: ['용어 해설', '키워드 검색', '무료'],
      quickLinks: [{ href: '/lifelong-saju', label: '평생사주' }, { href: '/guide', label: '운세 칼럼' }],
    },
  },
  {
    match: (path) => path.startsWith('/guide'),
    meta: {
      eyebrow: '운세 칼럼',
      title: '사주와 운세에 관한 깊이 있는 이야기',
      description: '개운법, 연간 운세 분석, 사주 기초 등 다양한 주제의 칼럼을 읽어보세요.',
      Icon: BookOpenText,
      chips: ['개운법', '운세 분석', '무료'],
      quickLinks: [{ href: '/fortune-dictionary', label: '용어 사전' }, { href: '/lifelong-saju', label: '평생사주' }],
    },
  },
  {
    match: (path) => path === '/about' || path === '/contact' || path === '/privacy' || path === '/terms',
    meta: {
      eyebrow: '무운 안내',
      title: '무운에 대해 더 알아보세요',
      description: '무운은 회원가입 없이 무료로 사주, 궁합, 꿈해몽을 제공하는 모바일 운세 서비스입니다.',
      Icon: Shield,
      chips: ['무료 서비스', '회원가입 없음', '모바일 최적화'],
      quickLinks: [{ href: '/lifelong-saju', label: '평생사주' }, { href: '/more', label: '전체 서비스' }],
    },
  },
];

function resolveBannerMeta(path: string) {
  return routeBannerMeta.find((entry) => entry.match(path))?.meta ?? null;
}

export default function RouteBanner() {
  const [location] = useLocation();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const hide = () => setHidden(true);
    const show = () => setHidden(false);
    window.addEventListener('muun:banner:hide', hide);
    window.addEventListener('muun:banner:show', show);
    return () => {
      window.removeEventListener('muun:banner:hide', hide);
      window.removeEventListener('muun:banner:show', show);
    };
  }, []);

  const meta = resolveBannerMeta(location);

  if (!meta || hidden) return null;

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
