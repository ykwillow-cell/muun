import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'wouter';
import {
  Search,
  MoonStar,
  PawPrint,
  Users,
  Mountain,
  Box,
  Activity,
  Layers,
  Trophy,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
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

const gradeConfig: Record<DreamGrade, { label: string; Icon: typeof Trophy; tone: string; chip: string }> = {
  great: {
    label: '길몽',
    Icon: Trophy,
    tone: 'text-amber-600',
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  good: {
    label: '평몽',
    Icon: CheckCircle2,
    tone: 'text-sky-600',
    chip: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  bad: {
    label: '흉몽',
    Icon: AlertCircle,
    tone: 'text-fuchsia-600',
    chip: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
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
      list = list.filter((item) =>
        [item.keyword, item.excerpt, item.categoryLabel, item.metaDescription]
          .join(' ')
          .toLowerCase()
          .includes(q),
      );
    }

    return list.sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [searchTerm, activeCategory]);

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

      <section className="mu-container-narrow pt-6">
        <div className="mu-glass-panel overflow-hidden p-6 sm:p-8">
          <span className="mu-section-eyebrow">
            <MoonStar size={14} aria-hidden="true" />
            Dream archive
          </span>
          <div className="mt-4 grid gap-6 md:grid-cols-[1.25fr_0.95fr] md:items-end">
            <div>
              <h1 className="mu-section-title">꿈해몽 아카이브</h1>
              <p className="mu-section-description mt-3">
                자주 찾는 길몽·흉몽 키워드를 한곳에 모았습니다. 꿈의 상징을 빠르게 찾고, 상세 페이지에서 전통적 의미와 심리적 해석을 함께 읽을 수 있습니다.
              </p>
            </div>
            <div className="grid gap-3 rounded-[24px] border border-slate-200/80 bg-white/70 p-4">
              <div className="text-sm font-bold text-slate-900">공개된 꿈 키워드</div>
              <div className="text-[32px] font-extrabold tracking-[-0.06em] text-[#5648db]">{DREAM_INDEX.length}</div>
              <div className="text-sm leading-6 text-slate-500">검색과 카테고리 필터로 필요한 꿈해몽을 바로 찾을 수 있습니다.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mu-container-narrow py-6">
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
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className={`mu-chip whitespace-nowrap ${searchTerm === tag ? 'mu-chip--active' : ''}`}
              >
                #{tag}
              </button>
            ))}
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(({ id, name, Icon }) => {
              const active = activeCategory === id;
              return (
                <button
                  key={name}
                  onClick={() => setActiveCategory(id)}
                  className={`mu-chip whitespace-nowrap ${active ? 'mu-chip--active' : ''}`}
                >
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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredDreams.map((dream) => {
              const grade = gradeConfig[dream.grade as DreamGrade] || gradeConfig.good;
              const GradeIcon = grade.Icon;

              return (
                <Link key={dream.slug} href={`/dream/${dream.slug}`} className="mu-link-card overflow-hidden p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${grade.chip}`}>
                      <GradeIcon size={12} aria-hidden="true" />
                      {grade.label}
                    </span>
                    <ArrowUpRight size={16} className="text-slate-400" aria-hidden="true" />
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400">
                    <span>{dream.categoryLabel}</span>
                    <span>·</span>
                    <span>점수 {dream.score}</span>
                  </div>

                  <h2 className="mt-2 text-[20px] font-extrabold tracking-[-0.05em] text-slate-900 line-clamp-2">
                    {dream.keyword} 꿈해몽
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{dream.excerpt}</p>
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
