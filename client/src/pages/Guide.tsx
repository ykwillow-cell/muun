import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from 'react-helmet-async';
import { ArrowUpRight, BookOpenText, Clock3, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { GUIDE_INDEX } from '@/generated/content-snapshots';

const CHIP_CATEGORIES = [
  { id: null, label: '전체' },
  { id: 'luck', label: '개운법' },
  { id: 'basic', label: '사주 기초' },
  { id: 'relationship', label: '관계 · 궁합' },
  { id: 'health', label: '건강 · 운' },
  { id: 'money', label: '재물운' },
  { id: 'flow', label: '운의 흐름' },
  { id: 'career', label: '취업 · 커리어' },
  { id: 'love', label: '연애 · 결혼' },
  { id: 'family', label: '가족 · 자녀' },
] as const;

const PAGE_SIZE = 12;

function formatDate(value: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Guide() {
  useCanonical('/guide');
  const [location] = useLocation();

  const getQuery = () => (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') || '' : '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(getQuery());
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setSearchQuery(getQuery());
    setVisibleCount(PAGE_SIZE);
  }, [location]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = selectedCategory ? GUIDE_INDEX.filter((item) => item.category === selectedCategory) : [...GUIDE_INDEX];

    if (q) {
      list = list.filter((item) => [item.title, item.description, item.categoryLabel, item.author].join(' ').toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      const aTime = new Date(a.publishedDate).getTime() || 0;
      const bTime = new Date(b.publishedDate).getTime() || 0;
      return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });

    return list;
  }, [searchQuery, selectedCategory, sortOrder]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const categoryCount = new Set(GUIDE_INDEX.map((item) => item.category)).size;

  return (
    <div className="min-h-screen mu-page-bg pb-16">
      <Helmet>
        <title>운세 칼럼 - 사주 전문가의 깊이 있는 운세 이야기 | 무운 (MuUn)</title>
        <meta name="description" content="사주 기초부터 개운법, 재물운, 건강운, 관계 운까지. 무운의 운세 칼럼 아카이브에서 깊이 있는 해설을 무료로 읽어보세요." />
        <meta name="keywords" content="사주칼럼, 운세칼럼, 개운법, 재물운, 건강운, 관계운, 사주기초, 사주공부" />
        <meta property="og:title" content="운세 칼럼 - 사주 전문가의 깊이 있는 운세 이야기 | 무운 (MuUn)" />
        <meta property="og:description" content="사주 기초부터 개운법, 재물운, 건강운, 관계 운까지. 무운의 운세 칼럼 아카이브에서 깊이 있는 해설을 무료로 읽어보세요." />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <link rel="canonical" href="https://muunsaju.com/guide" />
      </Helmet>

      <section className="mu-hero-shell">
        <div className="mu-container-narrow px-4 pb-8 pt-5 text-white">
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))] items-end">
            <div>
              <span className="mu-kicker">Fortune editorial</span>
              <h1 className="mt-4 text-[34px] font-extrabold leading-[1.1] tracking-[-0.06em] text-white">운세 칼럼 아카이브</h1>
              <p className="mt-4 text-sm leading-7 text-white/80">
                검색으로 들어온 방문자도 다음 글과 관련 서비스로 이어질 수 있도록, 사주 기초 개념과 실제 고민을 연결하는 읽을거리를 카테고리별로 정리했습니다.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="mu-stat-pill"><BookOpenText size={14} /> 무료 아카이브</span>
                <span className="mu-stat-pill"><Sparkles size={14} /> 사주 기초부터 관계 운까지</span>
              </div>
            </div>

            <div className="mu-auto-grid-180">
              <div className="mu-soft-card p-4 text-slate-900">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">현재 공개 칼럼</div>
                <div className="mt-3 text-[30px] font-extrabold tracking-[-0.06em] text-[#5648db]">{GUIDE_INDEX.length}</div>
                <div className="mt-1 text-sm text-slate-500">정적 스냅샷 기반으로 빠르게 노출</div>
              </div>
              <div className="mu-soft-card p-4 text-slate-900">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">탐색 가능한 분류</div>
                <div className="mt-3 text-[30px] font-extrabold tracking-[-0.06em] text-[#5648db]">{categoryCount}</div>
                <div className="mt-1 text-sm text-slate-500">개운법, 관계 운, 건강운, 재물운 등</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mu-container-narrow -mt-6 pb-6 relative z-10">
        <div className="mu-glass-panel p-5 sm:p-6">
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] items-center">
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="칼럼 제목이나 주제를 검색해보세요"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                className="h-13 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#6B5FFF] focus:ring-4 focus:ring-[#6B5FFF]/10"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                <SlidersHorizontal size={13} aria-hidden="true" />
                정렬
              </span>
              <button onClick={() => setSortOrder('newest')} className={`mu-chip ${sortOrder === 'newest' ? 'mu-chip--active' : ''}`}>최신순</button>
              <button onClick={() => setSortOrder('oldest')} className={`mu-chip ${sortOrder === 'oldest' ? 'mu-chip--active' : ''}`}>오래된순</button>
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CHIP_CATEGORIES.map((chip) => {
              const active = selectedCategory === chip.id;
              return (
                <button
                  key={chip.label}
                  onClick={() => {
                    setSelectedCategory(chip.id);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`mu-chip whitespace-nowrap ${active ? 'mu-chip--active' : ''}`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mu-container-narrow pb-10">
        {displayed.length > 0 ? (
          <div className="mu-auto-grid-220">
            {displayed.map((column) => (
              <Link key={column.slug} href={`/guide/${column.slug}`} className="mu-link-card overflow-hidden p-0">
                {column.thumbnail ? (
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img src={column.thumbnail} alt={column.title} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-[linear-gradient(135deg,#17114c_0%,#352597_55%,#5f4bcb_100%)]" />
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex rounded-full bg-[#6B5FFF]/10 px-2.5 py-1 text-[11px] font-bold text-[#5648db]">{column.categoryLabel}</span>
                    <ArrowUpRight size={16} className="text-slate-400" aria-hidden="true" />
                  </div>

                  <h2 className="mt-4 text-[20px] font-extrabold tracking-[-0.05em] text-slate-900 line-clamp-2">{column.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{column.description}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-400">
                    <span>{column.author}</span>
                    <span>{formatDate(column.publishedDate)}</span>
                    <span className="inline-flex items-center gap-1"><Clock3 size={12} aria-hidden="true" /> {column.readTime}분</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mu-glass-panel px-6 py-12 text-center">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-slate-900">검색 결과가 없습니다</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">다른 키워드나 카테고리로 다시 찾아보세요.</p>
          </div>
        )}

        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-[#6B5FFF] px-6 text-sm font-bold text-white shadow-[0_16px_30px_rgba(107,95,255,0.26)]"
            >
              칼럼 더 보기
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
