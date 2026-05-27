import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { useCanonical } from '@/lib/use-canonical';
import {
  Sparkles, Clock3, Calendar, ScrollText, Star, Layers3,
  Users, Brain, Moon, PenLine, BookOpen, Heart, ChevronRight,
  type LucideIcon,
} from 'lucide-react';

// ── 카테고리별 서비스 정의 ──────────────────────────────────────────
type ServiceItem = {
  href: string;
  label: string;
  copy: string;          // UX 라이팅 — 사용자 관점의 동기 부여 문구
  icon: string;          // 이모지 (아이콘 대체)
  iconColor: string;     // Tailwind gradient 클래스
  badge?: 'hot' | 'new';
  wide?: boolean;        // 1열 와이드 카드 여부
};

type Category = {
  emoji: string;
  title: string;
  services: ServiceItem[];
};

const CATEGORIES: Category[] = [
  {
    emoji: '🔮',
    title: '나를 알아가는 사주',
    services: [
      {
        href: '/lifelong-saju',
        label: '평생사주',
        copy: '타고난 기질부터 평생 운의 흐름까지 한 번에',
        icon: '✨',
        iconColor: 'from-[#8c85ff] to-[#6f63ff]',
        badge: 'hot',
      },
      {
        href: '/yearly-fortune',
        label: '신년운세',
        copy: '2026년, 내 한 해 운의 큰 그림',
        icon: '📆',
        iconColor: 'from-[#fcd57a] to-[#f5b84a]',
        badge: 'hot',
      },
      {
        href: '/daily-fortune',
        label: '오늘의 운세',
        copy: '오늘 하루, 어디서 행운이 올까?',
        icon: '📅',
        iconColor: 'from-[#7dd3fc] to-[#38bdf8]',
      },
      {
        href: '/tojeong',
        label: '토정비결',
        copy: '이달, 이번 달은 어떻게 흘러갈까?',
        icon: '📜',
        iconColor: 'from-[#fbbf24] to-[#f59e0b]',
      },
      {
        href: '/manselyeok',
        label: '만세력',
        copy: '내 사주 원판(팔자)을 직접 눈으로 확인',
        icon: '🗂️',
        iconColor: 'from-[#a5b4fc] to-[#6366f1]',
        wide: true,
      },
    ],
  },
  {
    emoji: '💞',
    title: '관계와 인연',
    services: [
      {
        href: '/compatibility',
        label: '궁합',
        copy: '두 사람의 오행이 얼마나 잘 맞을까?',
        icon: '💞',
        iconColor: 'from-[#f9a8c9] to-[#e879a0]',
        badge: 'hot',
      },
      {
        href: '/hybrid-compatibility',
        label: '사주×MBTI 궁합',
        copy: 'MBTI도 맞고 사주도 맞는 진짜 궁합',
        icon: '🧠',
        iconColor: 'from-[#c4b5fd] to-[#8b5cf6]',
        badge: 'new',
      },
      {
        href: '/family-saju',
        label: '가족사주',
        copy: '우리 가족, 오행으로 보는 조화와 갈등',
        icon: '👨‍👩‍👧',
        iconColor: 'from-[#6eddd2] to-[#3fc9bb]',
        wide: true,
      },
    ],
  },
  {
    emoji: '🌙',
    title: '신비와 탐색',
    services: [
      {
        href: '/tarot',
        label: '타로',
        copy: '지금 이 고민, 카드에게 물어보기',
        icon: '🃏',
        iconColor: 'from-[#8cb0ff] to-[#5b8def]',
      },
      {
        href: '/astrology',
        label: '점성술',
        copy: '내 별자리로 보는 성격과 운명',
        icon: '⭐',
        iconColor: 'from-[#5eead4] to-[#14b8a6]',
      },
      {
        href: '/dream',
        label: '꿈해몽',
        copy: '어젯밤 꿈, 무슨 신호를 보내는 걸까?',
        icon: '🌙',
        iconColor: 'from-[#93c5fd] to-[#3b82f6]',
        wide: true,
      },
    ],
  },
  {
    emoji: '🧩',
    title: '더 알고 싶은 나',
    services: [
      {
        href: '/naming',
        label: '작명소',
        copy: '이름 속에 담긴 운의 힘, 지금 확인해보세요',
        icon: '✏️',
        iconColor: 'from-[#ffa6c2] to-[#f06292]',
        badge: 'new',
        wide: true,
      },
      {
        href: '/psychology',
        label: '심리테스트',
        copy: '나도 몰랐던 내 심리, 몇 가지 질문으로',
        icon: '🧩',
        iconColor: 'from-[#c4b5fd] to-[#a78bfa]',
        wide: true,
      },
    ],
  },
  {
    emoji: '📖',
    title: '읽고 배우기',
    services: [
      {
        href: '/fortune-dictionary',
        label: '운세 사전',
        copy: '역마살이 뭐지? 용신은? 사주 용어를 바로 찾아보세요',
        icon: '📖',
        iconColor: 'from-[#a5b4fc] to-[#6366f1]',
        wide: true,
      },
      {
        href: '/guide',
        label: '운세 칼럼',
        copy: '사주 전문가가 쓴 깊이 있는 운세 이야기',
        icon: '📝',
        iconColor: 'from-[#fde68a] to-[#f59e0b]',
        wide: true,
      },
    ],
  },
  {
    emoji: '🍱',
    title: '오늘의 소소한 재미',
    services: [
      {
        href: '/lucky-lunch',
        label: '행운 점심',
        copy: '오늘 뭐 먹을까? 내 운에 맞는 점심 메뉴 추천',
        icon: '🍱',
        iconColor: 'from-[#fdba74] to-[#f97316]',
        wide: true,
      },
    ],
  },
];

// 서비스 총수 계산
const TOTAL = CATEGORIES.reduce((acc, c) => acc + c.services.length, 0);

// ── 카드 컴포넌트 ──────────────────────────────────────────────────
function ServiceCard({ s }: { s: ServiceItem }) {
  const badgeClass =
    s.badge === 'hot'
      ? 'bg-amber-50 text-amber-700'
      : s.badge === 'new'
        ? 'bg-emerald-50 text-emerald-700'
        : '';

  if (s.wide) {
    return (
      <Link
        href={s.href}
        className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/96 px-4 py-3.5 shadow-sm hover:-translate-y-0.5 hover:border-[#6B5FFF]/20 hover:shadow-md transition-all"
      >
        {/* 아이콘 */}
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br ${s.iconColor} text-xl shadow-sm`}>
          {s.icon}
        </div>
        {/* 텍스트 */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold tracking-[-0.03em] text-[#1a1a18] leading-tight">{s.label}</p>
          <p className="mt-0.5 text-sm leading-[1.5] text-slate-500 line-clamp-2">{s.copy}</p>
        </div>
        {/* 오른쪽 */}
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {s.badge && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badgeClass}`}>
              {s.badge === 'hot' ? '인기' : 'NEW'}
            </span>
          )}
          <ChevronRight size={18} className="text-slate-300" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={s.href}
      className="relative flex flex-col rounded-2xl border border-slate-200/80 bg-white/96 p-4 shadow-sm hover:-translate-y-0.5 hover:border-[#6B5FFF]/20 hover:shadow-md transition-all"
    >
      {/* 배지 */}
      {s.badge && (
        <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-bold ${badgeClass}`}>
          {s.badge === 'hot' ? '인기' : 'NEW'}
        </span>
      )}
      {/* 아이콘 */}
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-br ${s.iconColor} text-lg shadow-sm`}>
        {s.icon}
      </div>
      {/* 텍스트 */}
      <p className="text-base font-bold tracking-[-0.03em] text-[#1a1a18] leading-tight">{s.label}</p>
      <p className="mt-1 text-xs leading-[1.55] text-slate-500 flex-1">{s.copy}</p>
      <p className="mt-3 text-xs font-bold text-[#5a4ddb]">보러가기 →</p>
    </Link>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────
export default function More() {
  useCanonical('/more');

  return (
    <div className="min-h-screen mu-page-bg pb-20">
      <Helmet>
        <title>전체 서비스 — 무료 사주·운세 모음 | 무운 (MuUn)</title>
        <meta name="description" content={`평생사주, 신년운세, 궁합, 꿈해몽 등 ${TOTAL}가지 무료 사주·운세 서비스를 한 곳에서. 회원가입 없이 생년월일만으로 지금 바로 확인하세요.`} />
        <link rel="canonical" href="https://muunsaju.com/more" />
      </Helmet>

      {/* ── 상단 헤더 (컴팩트) ── */}
      <section className="px-4 pt-3 pb-2">
        <h1 className="text-xl font-bold tracking-[-0.04em] text-[#1a1a18]">무운의 모든 서비스</h1>
        <p className="mt-0.5 text-sm text-slate-500">전체 {TOTAL}가지 · 모두 무료 · 가입 불필요</p>
      </section>

      {/* ── 카테고리별 서비스 ── */}
      {CATEGORIES.map((cat) => {
        const grid2  = cat.services.filter((s) => !s.wide);
        const wides  = cat.services.filter((s) => s.wide);

        return (
          <section key={cat.title} className="px-4 pb-1">
            {/* 카테고리 헤더 */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{cat.emoji}</span>
              <span className="text-xs font-bold tracking-[.04em] text-[#5a4ddb]">{cat.title}</span>
              <div className="flex-1 h-px bg-[#6B5FFF]/12" />
            </div>

            {/* 2열 그리드 (wide 아닌 카드) */}
            {grid2.length > 0 && (
              <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                {grid2.map((s) => <ServiceCard key={s.href} s={s} />)}
              </div>
            )}

            {/* 와이드 카드 */}
            {wides.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {wides.map((s) => <ServiceCard key={s.href} s={s} />)}
              </div>
            )}
          </section>
        );
      })}

    </div>
  );
}
