import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from 'react-helmet-async';
import { Clock3, Search, X, ChevronDown } from 'lucide-react';
import { GUIDE_INDEX } from '@/generated/content-snapshots';
import RelatedServices from '@/components/RelatedServices';

// ── 카테고리 정의 (이모지 + 편수는 런타임 집계) ──
const CATEGORIES = [
  { id: null,           label: '전체',         emoji: '📋' },
  { id: 'luck',         label: '개운법',        emoji: '🍀' },
  { id: 'basic',        label: '사주 기초',     emoji: '☯️' },
  { id: 'money',        label: '재물운',        emoji: '💰' },
  { id: 'relationship', label: '관계 · 궁합',  emoji: '💞' },
  { id: 'love',         label: '연애 · 결혼',  emoji: '💕' },
  { id: 'career',       label: '취업 · 커리어', emoji: '💼' },
  { id: 'flow',         label: '운의 흐름',     emoji: '🌊' },
  { id: 'health',       label: '건강 · 운',     emoji: '🌿' },
  { id: 'family',       label: '가족 · 자녀',  emoji: '👨‍👩‍👧' },
] as const;

// 카테고리별 배지 색상
const CAT_STYLE: Record<string, { bg: string; text: string }> = {
  luck:         { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  basic:        { bg: 'bg-violet-50',  text: 'text-violet-700'  },
  money:        { bg: 'bg-amber-50',   text: 'text-amber-700'   },
  relationship: { bg: 'bg-pink-50',    text: 'text-pink-700'    },
  love:         { bg: 'bg-rose-50',    text: 'text-rose-700'    },
  career:       { bg: 'bg-sky-50',     text: 'text-sky-700'     },
  flow:         { bg: 'bg-cyan-50',    text: 'text-cyan-700'    },
  health:       { bg: 'bg-teal-50',    text: 'text-teal-700'    },
  family:       { bg: 'bg-orange-50',  text: 'text-orange-700'  },
};

const PAGE_SIZE = 10;

function formatDate(value: string) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Guide() {
  useCanonical('/guide');
  const [location] = useLocation();

  const getQuery = () =>
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') || '' : '';

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery]             = useState(getQuery);
  const [sortOrder, setSortOrder]                 = useState<'newest' | 'oldest'>('newest');
  const [visibleCount, setVisibleCount]           = useState(PAGE_SIZE);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery(getQuery());
    setVisibleCount(PAGE_SIZE);
  }, [location]);

  // URL 동기화
  const applySearch = (q: string) => {
    setSearchQuery(q);
    setVisibleCount(PAGE_SIZE);
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      q ? p.set('q', q) : p.delete('q');
      window.history.pushState(null, '', `${window.location.pathname}${p.toString() ? '?' + p.toString() : ''}`);
    }
  };

  const applyCategory = (cat: string | null) => {
    setSelectedCategory(cat);
    setVisibleCount(PAGE_SIZE);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  // 카테고리별 편수 집계
  const catCounts = useMemo(() => {
    const map: Record<string, number> = {};
    GUIDE_INDEX.forEach((item) => {
      map[item.category] = (map[item.category] || 0) + 1;
    });
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = selectedCategory
      ? GUIDE_INDEX.filter((item) => item.category === selectedCategory)
      : [...GUIDE_INDEX];
    if (q) {
      list = list.filter((item) =>
        [item.title, item.description, item.categoryLabel, item.author].join(' ').toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      const at = new Date(a.publishedDate).getTime() || 0;
      const bt = new Date(b.publishedDate).getTime() || 0;
      return sortOrder === 'newest' ? bt - at : at - bt;
    });
    return list;
  }, [searchQuery, selectedCategory, sortOrder]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore   = visibleCount < filtered.length;
  const hasFilter = !!searchQuery || selectedCategory !== null;
  const categoryLabel = selectedCategory
    ? (CATEGORIES.find((c) => c.id === selectedCategory)?.label ?? '')
    : null;

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

      {/* ── Sticky 검색 헤더 ── */}
      <section className="sticky top-0 z-20 bg-[#f5f4ff]/95 backdrop-blur-md border-b border-[#6B5FFF]/10 px-4 pb-4 pt-[calc(var(--safe-area-top,0px)+44px)]">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[22px] font-bold tracking-[-0.05em] text-[#1e2340]">운세 칼럼</h1>
          <span className="text-sm font-semibold text-[#707797]">{GUIDE_INDEX.length}편</span>
        </div>
        <label className="relative block">
          <Search className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#707797]" />
          <input
            type="text"
            placeholder="칼럼 제목이나 주제 검색"
            value={searchQuery}
            onChange={(e) => applySearch(e.target.value)}
            className="h-12 w-full rounded-2xl border border-[#6B5FFF]/20 bg-white pl-10 pr-10 text-base text-[#1e2340] placeholder:text-[#707797] outline-none shadow-sm transition focus:border-[#6B5FFF] focus:ring-4 focus:ring-[#6B5FFF]/10"
          />
          {searchQuery && (
            <button
              onClick={() => applySearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#707797] hover:text-[#1e2340]"
              aria-label="검색어 지우기"
            >
              <X size={16} />
            </button>
          )}
        </label>
      </section>

      {/* ── 카테고리 그리드 (검색 중엔 숨김) ── */}
      {!searchQuery && (
        <section className="px-4 pt-4 pb-2">
          <p className="mb-3 text-xs font-bold tracking-[.06em] text-[#5a4ddb]">카테고리 탐색</p>
          <div className="grid grid-cols-4 gap-2">
            {/* 전체 — 가로 full */}
            <button
              onClick={() => applyCategory(null)}
              className={`col-span-4 flex items-center justify-center gap-2 rounded-2xl border py-3 text-base font-bold transition
                ${selectedCategory === null
                  ? 'border-[#6B5FFF] bg-[#6B5FFF] text-white shadow-[0_6px_16px_rgba(107,95,255,.28)]'
                  : 'border-slate-200 bg-white/90 text-slate-700 hover:border-[#6B5FFF]/30'}`}
            >
              <span>📋</span> 전체 보기
            </button>
            {CATEGORIES.slice(1).map((cat) => {
              const cnt = catCounts[cat.id] ?? 0;
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => applyCategory(cat.id)}
                  className={`flex flex-col items-center gap-1 rounded-2xl border py-3 transition
                    ${active
                      ? 'border-[#6B5FFF] bg-[#6B5FFF] text-white shadow-[0_6px_16px_rgba(107,95,255,.28)]'
                      : 'border-slate-200 bg-white/90 hover:border-[#6B5FFF]/30'}`}
                >
                  <span className="text-xl leading-none">{cat.emoji}</span>
                  <span className={`text-xs font-bold leading-tight text-center px-0.5 ${active ? 'text-white' : 'text-slate-600'}`}>
                    {cat.label}
                  </span>
                  {cnt > 0 && (
                    <span className={`text-xs font-bold ${active ? 'text-white/80' : 'text-slate-400'}`}>
                      {cnt}편
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 결과 헤더 ── */}
      <div ref={resultRef} className="flex items-center justify-between px-4 pb-2 pt-3">
        <p className="text-sm font-semibold text-slate-500">
          {hasFilter ? (
            <>
              {categoryLabel && <span className="mr-1 font-bold text-[#5648db]">[{categoryLabel}]</span>}
              {searchQuery && <span className="mr-1 font-bold text-slate-700">'{searchQuery}'</span>}
              <span className="font-bold text-slate-900">{filtered.length}</span>편
            </>
          ) : (
            <>전체 <span className="font-bold text-slate-900">{filtered.length}</span>편</>
          )}
        </p>
        <div className="flex items-center gap-2">
          {hasFilter && (
            <button
              onClick={() => { applySearch(''); applyCategory(null); }}
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-[#5648db]"
            >
              <X size={11} /> 초기화
            </button>
          )}
          {/* 정렬 드롭다운 */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value as 'newest' | 'oldest'); setVisibleCount(PAGE_SIZE); }}
              className="h-8 appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-7 text-xs font-bold text-slate-600 outline-none cursor-pointer"
            >
              <option value="newest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* ── 카드 목록 ── */}
      <section className="px-4 pb-6">
        {displayed.length > 0 ? (
          <div className="flex flex-col gap-3">
            {displayed.map((column) => {
              const style = CAT_STYLE[column.category] ?? { bg: 'bg-slate-100', text: 'text-slate-600' };
              const catEmoji = CATEGORIES.find((c) => c.id === column.category)?.emoji ?? '📋';
              return (
                <Link
                  key={column.slug}
                  href={`/guide/${column.slug}`}
                  className="flex overflow-hidden rounded-2xl border border-slate-200/80 bg-white/96 shadow-sm hover:-translate-y-0.5 hover:border-[#6B5FFF]/20 hover:shadow-md transition-all"
                >
                  {/* 썸네일 */}
                  <div className="relative w-[108px] shrink-0">
                    {column.thumbnail ? (
                      <img src={column.thumbnail} alt={column.title} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(135deg,#17114c_0%,#352597_55%,#5f4bcb_100%)]" />
                    )}
                    {/* 읽기 시간 뱃지 */}
                    <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                      <Clock3 size={11} /> {column.readTime}분
                    </span>
                  </div>

                  {/* 텍스트 */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between px-4 py-3">
                    <div>
                      {/* 카테고리 뱃지 — 클릭 시 필터 */}
                      <button
                        onClick={(e) => { e.preventDefault(); applyCategory(column.category); }}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${style.bg} ${style.text} hover:opacity-80`}
                      >
                        {catEmoji} {column.categoryLabel}
                      </button>

                      <h2 className="mt-1.5 line-clamp-2 text-base font-bold tracking-[-0.04em] text-slate-900 leading-snug">
                        {column.title}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-sm leading-[1.65] text-slate-500">
                        {column.description}
                      </p>
                    </div>

                    {/* 메타 */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="text-xs font-semibold text-slate-400">{column.author}</span>
                      <span className="text-xs text-slate-300">{formatDate(column.publishedDate)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mu-glass-panel px-6 py-14 text-center">
            <div className="text-4xl">🔍</div>
            <h2 className="mt-4 text-[22px] font-bold tracking-[-0.04em] text-slate-900">검색 결과가 없습니다</h2>
            <p className="mt-2 text-base leading-7 text-slate-500">다른 키워드나 카테고리로 다시 찾아보세요.</p>
            <button
              onClick={() => { applySearch(''); applyCategory(null); }}
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#6B5FFF] px-5 py-2.5 text-base font-bold text-white shadow"
            >
              <X size={14} /> 초기화
            </button>
          </div>
        )}

        {/* 더 보기 */}
        {hasMore && (
          <div className="mt-5 flex flex-col items-center gap-1.5">
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#6B5FFF] px-8 text-base font-bold text-white shadow-[0_16px_30px_rgba(107,95,255,0.26)]"
            >
              칼럼 더 보기
            </button>
            <p className="text-xs text-slate-400">
              {displayed.length} / {filtered.length}편 표시 중
            </p>
          </div>
        )}
      </section>

      {/* ── 내부 서비스 링크 ── */}
      <section className="px-4 pb-10">
        <RelatedServices
          title="칼럼과 함께 보면 좋은 서비스"
          services={[
            { href: '/lifelong-saju',      emoji: '🔮', label: '평생사주',   description: '칼럼에서 읽은 내용이 내 사주에 어떻게 나타나는지 직접 확인해보세요.' },
            { href: '/daily-fortune',      emoji: '📅', label: '오늘의 운세', description: '오늘 하루의 운의 흐름을 실시간으로 확인해보세요.' },
            { href: '/dream',              emoji: '🌙', label: '꿈해몽',      description: '최근 꾼 꿈의 의미를 사주 관점에서 풀어보세요.' },
            { href: '/fortune-dictionary', emoji: '📖', label: '운세 사전',   description: '칼럼에서 나오는 사주 용어를 바로 찾아보세요.' },
          ]}
        />
      </section>
    </div>
  );
}
