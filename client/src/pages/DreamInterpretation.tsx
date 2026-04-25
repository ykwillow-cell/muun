import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'wouter';
import { Search, MoonStar, PawPrint, Users, Mountain, Box, Activity, Layers, Trophy, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useCanonical } from '@/lib/use-canonical';
import { DREAM_INDEX } from '@/generated/content-snapshots';

type DreamGrade = 'great' | 'good' | 'bad';

const categories = [
  { id: null, name: '전체', Icon: Layers },
  { id: 'animal', name: '동물', Icon: PawPrint },
  { id: 'person', name: '인물 · 신체', Icon: Users },
  { id: 'nature', name: '자연 · 현상', Icon: Mountain },
  { id: 'object', name: '생활 · 사물', Icon: Box },
  { id: 'action', name: '상태 · 행동', Icon: Activity },
  { id: 'other', name: '기타', Icon: Layers },
] as const;

const quickTags = ['돼지', '물', '불', '뱀', '돈', '조상', '이빨', '대통령'] as const;

const gradeConfig: Record<DreamGrade, { label: string; Icon: typeof Trophy; tone: string; chip: string; panel: string }> = {
  great: {
    label: '길몽',
    Icon: Trophy,
    tone: 'text-amber-600',
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    panel: 'from-amber-100 via-white to-amber-50',
  },
  good: {
    label: '평몽',
    Icon: CheckCircle2,
    tone: 'text-sky-600',
    chip: 'bg-sky-50 text-sky-700 border-sky-200',
    panel: 'from-sky-100 via-white to-sky-50',
  },
  bad: {
    label: '흉몽',
    Icon: AlertCircle,
    tone: 'text-fuchsia-600',
    chip: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    panel: 'from-fuchsia-100 via-white to-fuchsia-50',
  },
};

export default function DreamInterpretation() {
  useCanonical('/dream');
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const query = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') || '' : '';
    setSearchTerm(query);
  }, [location]);

  const filteredDreams = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let list = activeCategory ? DREAM_INDEX.filter((item) => item.category === activeCategory) : [...DREAM_INDEX];

    if (q) {
      list = list.filter((item) => [item.keyword, item.excerpt, item.categoryLabel, item.metaDescription].join(' ').toLowerCase().includes(q));
    }

    return list.sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [searchTerm, activeCategory]);

  const gradeStats = useMemo(() => ({
    great: DREAM_INDEX.filter((item) => item.grade === 'great').length,
    good: DREAM_INDEX.filter((item) => item.grade === 'good').length,
    bad: DREAM_INDEX.filter((item) => item.grade === 'bad').length,
  }), []);

  return (
    <div className="min-h-screen mu-page-bg pb-16">
      <Helmet>
        <title>꿈해몽 - 자주 찾는 길몽·흉몽 무료 풀이 | 무운 (MuUn)</title>
        <meta name="description" content="돼지꿈, 물꿈, 불꿈, 조상꿈, 대통령꿈까지. 무운의 꿈해몽 아카이브에서 길몽·평몽·흉몽 풀이를 무료로 찾아보세요." />
        <meta name="keywords" content="꿈해몽, 꿈풀이, 길몽, 흉몽, 돼지꿈, 물꿈, 불꿈, 조상꿈, 대통령꿈" />
        <link rel="canonical" href="https://muunsaju.com/dream" />
        <meta property="og:title" content="꿈해몽 - 자주 찾는 길몽·흉몽 무료 풀이 | 무운 (MuUn)" />
        <meta property="og:description" content="돼지꿈, 물꿈, 불꿈, 조상꿈, 대통령꿈까지. 무운의 꿈해몽 아카이브에서 길몽·평몽·흉몽 풀이를 무료로 찾아보세요." />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="mu-hero-shell">
        <div className="mu-container-narrow px-4 pb-8 pt-5 text-white">
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))] items-end">
            <div>
              <span className="mu-kicker">Dream archive</span>
              <h1 className="mt-4 text-[34px] font-extrabold leading-[1.1] tracking-[-0.06em] text-white">자주 찾는 꿈해몽 아카이브</h1>
              <p className="mt-4 text-sm leading-7 text-white/80">
                자주 검색되는 꿈 키워드를 빠르게 찾고, 상세 페이지에서 전통적 의미와 심리적 해석을 함께 읽을 수 있도록 모바일 중심으로 정리했습니다.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="mu-stat-pill"><MoonStar size={14} /> 길몽·평몽·흉몽 분류</span>
                <span className="mu-stat-pill">검색과 카테고리 필터 제공</span>
              </div>
            </div>

            <div className="mu-auto-grid-180">
              {(['great', 'good', 'bad'] as DreamGrade[]).map((gradeKey) => {
                const grade = gradeConfig[gradeKey];
                const Icon = grade.Icon;
                return (
                  <div key={gradeKey} className={`rounded-[24px] border border-white/12 bg-gradient-to-br ${grade.panel} p-4 text-slate-900 shadow-[0_18px_34px_rgba(15,23,42,0.08)]`}>
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${grade.chip}`}>
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <div className="mt-4 text-[22px] font-extrabold tracking-[-0.05em] text-slate-900">{gradeStats[gradeKey]}</div>
                    <div className="mt-1 text-sm font-bold text-slate-600">{grade.label} 키워드</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mu-container-narrow -mt-6 pb-6 relative z-10">
        <div className="mu-glass-panel p-5 sm:p-6">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="꿈 키워드를 검색해보세요 (예: 돼지, 이빨, 조상, 대통령)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-13 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#6B5FFF] focus:ring-4 focus:ring-[#6B5FFF]/10"
            />
          </label>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {quickTags.map((tag) => (
              <button key={tag} onClick={() => setSearchTerm(tag)} className={`mu-chip whitespace-nowrap ${searchTerm === tag ? 'mu-chip--active' : ''}`}>
                #{tag}
              </button>
            ))}
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(({ id, name, Icon }) => {
              const active = activeCategory === id;
              return (
                <button key={name} onClick={() => setActiveCategory(id)} className={`mu-chip whitespace-nowrap ${active ? 'mu-chip--active' : ''}`}>
                  <Icon size={14} aria-hidden="true" />
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mu-container-narrow pb-10">
        {filteredDreams.length > 0 ? (
          <div className="mu-auto-grid-220">
            {filteredDreams.map((dream) => {
              const grade = gradeConfig[dream.grade as DreamGrade] || gradeConfig.good;
              const GradeIcon = grade.Icon;
              return (
                <Link key={dream.slug} href={`/dream/${dream.slug}`} className="mu-link-card overflow-hidden p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${grade.chip}`}>
                      <GradeIcon size={12} aria-hidden="true" />
                      {grade.label}
                    </div>
                    <ArrowUpRight size={16} className="text-slate-400" aria-hidden="true" />
                  </div>

                  <div className={`mt-4 rounded-[22px] bg-gradient-to-br ${grade.panel} p-4`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{dream.categoryLabel}</div>
                      <div className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold text-slate-700">점수 {dream.score}</div>
                    </div>
                    <h2 className="mt-3 text-[20px] font-extrabold tracking-[-0.05em] text-slate-900 line-clamp-2">{dream.keyword} 꿈해몽</h2>
                    <div className="mt-3 h-2 rounded-full bg-white/70">
                      <div className="h-2 rounded-full bg-[#6B5FFF]" style={{ width: `${Math.min(100, dream.score)}%` }} />
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{dream.excerpt}</p>
                  <div className={`mt-4 text-sm font-bold ${grade.tone}`}>상세 풀이 보러가기</div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mu-glass-panel px-6 py-12 text-center">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-slate-900">검색 결과가 없습니다</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">다른 꿈 키워드나 카테고리로 다시 찾아보세요.</p>
          </div>
        )}
      </section>
    </div>
  );
}
