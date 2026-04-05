import React, { useEffect, useMemo, useState } from 'react';
import { LinkedText } from '@/hooks/useLinkedText';
import { Helmet } from 'react-helmet-async';
import { useCanonical } from '@/lib/use-canonical';
import { Search, ChevronRight, BookMarked } from 'lucide-react';
import { useLocation } from 'wouter';
import { DICTIONARY_INDEX } from '@/generated/content-snapshots';

const categories = [
  { id: 'basic', label: '사주 기초' },
  { id: 'stem', label: '천간' },
  { id: 'branch', label: '지지' },
  { id: 'ten-stem', label: '십신' },
  { id: 'sipsin', label: '십신' },
  { id: 'evil-spirit', label: '신살' },
  { id: 'luck-flow', label: '운의 흐름' },
  { id: 'relation', label: '관계 · 궁합' },
  { id: 'concept', label: '운세 개념' },
  { id: 'wealth', label: '재물 · 직업' },
  { id: 'health', label: '건강 · 신체' },
  { id: 'other', label: '기타' },
] as const;

export default function FortuneDictionary() {
  useCanonical('/fortune-dictionary');
  const [location, navigate] = useLocation();

  const initialCategory = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('category')
    : null;
  const initialQuery = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('q') || ''
    : '';

  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    setSelectedCategory(params?.get('category') || null);
    setSearchQuery(params?.get('q') || '');
  }, [location]);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let results = selectedCategory ? DICTIONARY_INDEX.filter((entry) => entry.category === selectedCategory) : [...DICTIONARY_INDEX];

    if (q) {
      results = results.filter((entry) =>
        [
          entry.title,
          entry.subtitle || '',
          entry.summary,
          entry.originalMeaning,
          entry.modernInterpretation,
          entry.muunAdvice,
          ...(entry.tags || []),
        ]
          .join(' ')
          .toLowerCase()
          .includes(q),
      );
    }

    return results;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen mu-page-bg pb-16">
      <Helmet>
        <title>사주 용어 사전 - 사주 기초 개념 무료 학습 | 무운 (MuUn)</title>
        <meta name="description" content="사주 명리학의 핵심 용어를 쉽게 풀이한 무료 사주 용어 사전. 천간, 지지, 십신, 대운, 오행 등 사주 기초 개념을 정리했습니다." />
        <meta name="keywords" content="사주용어, 사주사전, 천간지지, 십신, 대운, 오행, 사주기초, 명리학용어, 사주공부" />
        <link rel="canonical" href="https://muunsaju.com/fortune-dictionary" />
        <meta property="og:title" content="사주 용어 사전 - 사주 기초 개념 무료 학습 | 무운 (MuUn)" />
        <meta property="og:description" content="사주 명리학의 핵심 용어를 쉽게 풀이한 무료 사주 용어 사전. 천간, 지지, 십신, 대운, 오행 등 사주 기초 개념을 정리했습니다." />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:url" content="https://muunsaju.com/fortune-dictionary" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="mu-container-narrow pt-6">
        <div className="mu-glass-panel overflow-hidden p-6 sm:p-8">
          <span className="mu-section-eyebrow">
            <BookMarked size={14} aria-hidden="true" />
            Fortune glossary
          </span>
          <div className="mt-4 grid gap-6 md:grid-cols-[1.25fr_0.95fr] md:items-end">
            <div>
              <h1 className="mu-section-title">무운 운세 사전</h1>
              <p className="mu-section-description mt-3">
                사주 명리학을 처음 보는 분도 이해할 수 있도록 용어를 짧고 선명하게 정리했습니다.
                상세 항목에서는 원뜻, 현대적 해석, 무운의 조언을 함께 읽을 수 있습니다.
              </p>
            </div>
            <div className="grid gap-3 rounded-[24px] border border-slate-200/80 bg-white/70 p-4">
              <div className="text-sm font-bold text-slate-900">공개된 용어</div>
              <div className="text-[32px] font-extrabold tracking-[-0.06em] text-[#5648db]">{DICTIONARY_INDEX.length}</div>
              <div className="text-sm leading-6 text-slate-500">천간, 지지, 십신, 신살, 운의 흐름까지 카테고리별 탐색 가능</div>
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
              placeholder="용어를 검색해보세요 (예: 역마살, 재성, 대운)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-13 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#6B5FFF] focus:ring-4 focus:ring-[#6B5FFF]/10"
            />
          </label>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`mu-chip whitespace-nowrap ${selectedCategory === null ? 'mu-chip--active' : ''}`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`mu-chip whitespace-nowrap ${selectedCategory === category.id ? 'mu-chip--active' : ''}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mu-container-narrow pb-10">
        {filteredEntries.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredEntries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => navigate(`/dictionary/${entry.slug}`)}
                className="mu-link-card h-full w-full p-5 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex rounded-full bg-[#6B5FFF]/10 px-2.5 py-1 text-[11px] font-bold text-[#5648db]">
                    {entry.categoryLabel}
                  </span>
                  <ChevronRight className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-[20px] font-extrabold tracking-[-0.05em] text-slate-900">{entry.title}</h2>
                {entry.subtitle && (
                  <p className="mt-1 text-sm font-semibold text-slate-400">{entry.subtitle}</p>
                )}
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  <LinkedText text={entry.summary || ''} />
                </p>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="mu-glass-panel px-6 py-12 text-center">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-slate-900">검색 결과가 없습니다</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">다른 용어나 카테고리로 다시 찾아보세요.</p>
          </div>
        )}
      </section>
    </div>
  );
}
