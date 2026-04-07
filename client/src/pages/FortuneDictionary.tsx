import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCanonical } from '@/lib/use-canonical';
import { Search, ChevronRight, BookMarked, Hash, Sparkles } from 'lucide-react';
import { useLocation, Link } from 'wouter';
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

const featuredKeywords = ['일주', '용신', '대운', '십신', '천간', '지지'] as const;

export default function FortuneDictionary() {
  useCanonical('/fortune-dictionary');
  const [location] = useLocation();

  const initialCategory = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('category') : null;
  const initialQuery = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') || '' : '';

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
      results = results.filter((entry) => [entry.title, entry.subtitle || '', entry.summary, entry.originalMeaning, entry.modernInterpretation, entry.muunAdvice, ...(entry.tags || [])].join(' ').toLowerCase().includes(q));
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

      <section className="mu-hero-shell">
        <div className="mu-container-narrow px-4 pb-8 pt-5 text-white">
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))] items-end">
            <div>
              <span className="mu-kicker">Fortune glossary</span>
              <h1 className="mt-4 text-[34px] font-extrabold leading-[1.1] tracking-[-0.06em] text-white">무운 운세 사전</h1>
              <p className="mt-4 text-sm leading-7 text-white/80">
                사주 명리학을 처음 보는 분도 이해할 수 있도록 용어를 짧고 선명하게 정리했습니다. 결과 화면에서 처음 보는 개념이 나와도 바로 찾아볼 수 있게 설계했습니다.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="mu-stat-pill"><BookMarked size={14} /> 핵심 용어 정리</span>
                <span className="mu-stat-pill"><Sparkles size={14} /> 결과 페이지와 내부 연결</span>
              </div>
            </div>

            <div className="mu-auto-grid-180">
              <div className="mu-soft-card p-4 text-slate-900">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">공개된 용어</div>
                <div className="mt-3 text-[30px] font-extrabold tracking-[-0.06em] text-[#5648db]">{DICTIONARY_INDEX.length}</div>
                <div className="mt-1 text-sm text-slate-500">천간·지지·십신·신살 등</div>
              </div>
              <div className="mu-soft-card p-4 text-slate-900">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">주요 분류</div>
                <div className="mt-3 text-[30px] font-extrabold tracking-[-0.06em] text-[#5648db]">{new Set(DICTIONARY_INDEX.map((entry) => entry.category)).size}</div>
                <div className="mt-1 text-sm text-slate-500">기초 개념부터 관계·재물 해석까지</div>
              </div>
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
              placeholder="용어를 검색해보세요 (예: 역마살, 재성, 대운)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-13 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#6B5FFF] focus:ring-4 focus:ring-[#6B5FFF]/10"
            />
          </label>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {featuredKeywords.map((term) => (
              <button key={term} onClick={() => setSearchQuery(term)} className={`mu-chip whitespace-nowrap ${searchQuery === term ? 'mu-chip--active' : ''}`}>
                #{term}
              </button>
            ))}
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button onClick={() => setSelectedCategory(null)} className={`mu-chip whitespace-nowrap ${selectedCategory === null ? 'mu-chip--active' : ''}`}>전체</button>
            {categories.map((category) => (
              <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`mu-chip whitespace-nowrap ${selectedCategory === category.id ? 'mu-chip--active' : ''}`}>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mu-container-narrow pb-10">
        {filteredEntries.length > 0 ? (
          <div className="mu-auto-grid-220">
            {filteredEntries.map((entry) => (
              <Link key={entry.id} href={`/dictionary/${entry.slug}`} className="mu-link-card h-full p-5 text-left">
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6B5FFF]/10 text-[#5648db]">
                    <Hash size={18} aria-hidden="true" />
                  </div>
                  <ChevronRight className="mt-1 h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <div className="mt-4 inline-flex rounded-full bg-[#6B5FFF]/10 px-2.5 py-1 text-[11px] font-bold text-[#5648db]">{entry.categoryLabel}</div>
                <h2 className="mt-4 text-[20px] font-extrabold tracking-[-0.05em] text-slate-900">{entry.title}</h2>
                {entry.subtitle && <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-400">{entry.subtitle}</p>}
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{entry.summary}</p>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">#{tag}</span>
                    ))}
                  </div>
                )}
              </Link>
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
