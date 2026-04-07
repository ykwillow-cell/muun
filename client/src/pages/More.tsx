import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Sparkles, Star, Calendar, Heart, BookOpen, Moon, Brain, Globe, Layers, Users, PenLine, Clock, ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'saju',
    label: '사주 · 운세',
    services: [
      { href: '/yearly-fortune', icon: Star, label: '신년운세', desc: '2026 병오년 한 해 흐름', badge: '인기' },
      { href: '/lifelong-saju', icon: Sparkles, label: '평생사주', desc: '타고난 기질과 전체 흐름', badge: '인기' },
      { href: '/daily-fortune', icon: Clock, label: '오늘의 운세', desc: '하루 운세 체크' },
      { href: '/tojeong', icon: BookOpen, label: '토정비결', desc: '전통 월별 운세' },
      { href: '/manselyeok', icon: Calendar, label: '만세력', desc: '사주팔자 조견표' },
    ],
  },
  {
    id: 'relation',
    label: '관계 · 궁합',
    services: [
      { href: '/compatibility', icon: Heart, label: '궁합', desc: '두 사람의 흐름 분석', badge: '인기' },
      { href: '/hybrid-compatibility', icon: Brain, label: '사주×MBTI', desc: '성향 결합 궁합', badge: 'NEW' },
      { href: '/family-saju', icon: Users, label: '가족사주', desc: '가족 오행 조화' },
    ],
  },
  {
    id: 'mystic',
    label: '신비 · 점술',
    services: [
      { href: '/tarot', icon: Layers, label: '타로', desc: '카드가 전하는 힌트' },
      { href: '/astrology', icon: Globe, label: '점성술', desc: '네이탈 차트 분석' },
      { href: '/dream', icon: Moon, label: '꿈해몽', desc: '자주 찾는 상징 해석' },
    ],
  },
  {
    id: 'life',
    label: '생활 · 기타',
    services: [
      { href: '/naming', icon: PenLine, label: '작명소', desc: '사주 기반 이름 풀이', badge: 'NEW' },
      { href: '/psychology', icon: Brain, label: '심리테스트', desc: '성향과 심리 탐색' },
      { href: '/fortune-dictionary', icon: BookOpen, label: '운세 사전', desc: '용어와 개념 정리' },
      { href: '/guide', icon: BookOpen, label: '운세 칼럼', desc: '사주 읽을거리 아카이브' },
      { href: '/lucky-lunch', icon: Star, label: '행운 점심', desc: '오늘의 추천 메뉴' },
    ],
  },
] as const;

export default function More() {
  const [activeTab, setActiveTab] = useState<(typeof CATEGORIES)[number]['id']>('saju');
  const activeCategory = CATEGORIES.find((category) => category.id === activeTab) || CATEGORIES[0];

  return (
    <div className="min-h-screen mu-page-bg pb-16">
      <Helmet>
        <title>전체 서비스 | 무운(MuUn) — 무료 사주·운세</title>
        <meta name="description" content="무운의 무료 사주·운세 서비스를 한눈에 확인하세요. 신년운세, 평생사주, 궁합, 타로, 꿈해몽, 작명소 등 다양한 서비스를 제공합니다." />
      </Helmet>

      <section className="mu-hero-shell">
        <div className="mu-container-narrow px-4 pb-8 pt-5 text-white">
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))] items-end">
            <div>
              <span className="mu-kicker">All services</span>
              <h1 className="mt-4 text-[34px] font-extrabold leading-[1.1] tracking-[-0.06em] text-white">무운 전체 서비스</h1>
              <p className="mt-4 text-sm leading-7 text-white/80">무료 사주 결과 페이지와 콘텐츠 허브를 카테고리별로 정리했습니다. 모바일에서 다음 이동이 잘 보이도록 서비스 간 역할도 함께 구분했습니다.</p>
            </div>
            <div className="mu-auto-grid-180">
              <div className="mu-soft-card p-4 text-slate-900">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">서비스 카테고리</div>
                <div className="mt-3 text-[30px] font-extrabold tracking-[-0.06em] text-[#5648db]">{CATEGORIES.length}</div>
                <div className="mt-1 text-sm text-slate-500">사주, 궁합, 점술, 생활 영역으로 구성</div>
              </div>
              <div className="mu-soft-card p-4 text-slate-900">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">총 서비스</div>
                <div className="mt-3 text-[30px] font-extrabold tracking-[-0.06em] text-[#5648db]">{CATEGORIES.reduce((sum, category) => sum + category.services.length, 0)}</div>
                <div className="mt-1 text-sm text-slate-500">무료 중심 서비스와 콘텐츠 허브 포함</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mu-container-narrow -mt-6 pb-6 relative z-10">
        <div className="mu-glass-panel p-5 sm:p-6">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((category) => (
              <button key={category.id} onClick={() => setActiveTab(category.id)} className={`mu-chip whitespace-nowrap ${activeTab === category.id ? 'mu-chip--active' : ''}`}>
                {category.label}
              </button>
            ))}
          </div>

          <div className="mt-5 mu-auto-grid-220">
            {activeCategory.services.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.href} href={service.href} className="mu-link-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6B5FFF]/10 text-[#5648db]">
                      <Icon size={21} aria-hidden="true" />
                    </div>
                    {service.badge ? <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">{service.badge}</span> : null}
                  </div>
                  <h2 className="mt-4 text-[20px] font-extrabold tracking-[-0.05em] text-slate-900">{service.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{service.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#5648db]">
                    이동하기 <ArrowUpRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
