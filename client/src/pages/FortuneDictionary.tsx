import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCanonical } from '@/lib/use-canonical';
import { Search, X, BookOpen, Moon, Heart, Newspaper } from 'lucide-react';
import { useLocation, Link, useRoute } from 'wouter';
import { DICTIONARY_INDEX } from '@/generated/content-snapshots';

const categories = [
  { id: 'basic',        label: '사주 기초',   emoji: '☯️' },
  { id: 'stem',         label: '천간',         emoji: '🌿' },
  { id: 'branch',       label: '지지',         emoji: '🐉' },
  { id: 'sipsin',       label: '십신',         emoji: '⚖️' },
  { id: 'evil-spirit',  label: '신살',         emoji: '⚡' },
  { id: 'luck-flow',    label: '운의 흐름',    emoji: '🌊' },
  { id: 'relation',     label: '관계 · 궁합', emoji: '💞' },
  { id: 'concept',      label: '운세 개념',    emoji: '🔮' },
  { id: 'wealth',       label: '재물 · 직업', emoji: '💰' },
  { id: 'health',       label: '건강 · 신체', emoji: '🌱' },
  { id: 'other',        label: '기타',         emoji: '📌' },
] as const;

// 카테고리별 사이드바 + 배지 색상
const categoryStyle: Record<string, { side: string; bg: string; text: string }> = {
  'basic':       { side: '#a78bfa', bg: 'bg-violet-50',  text: 'text-violet-700' },
  'stem':        { side: '#6ee7b7', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'branch':      { side: '#93c5fd', bg: 'bg-blue-50',    text: 'text-blue-700' },
  'ten-stem':    { side: '#818cf8', bg: 'bg-indigo-50',  text: 'text-indigo-700' },
  'sipsin':      { side: '#818cf8', bg: 'bg-indigo-50',  text: 'text-indigo-700' },
  'evil-spirit': { side: '#fda4af', bg: 'bg-rose-50',    text: 'text-rose-700' },
  'luck-flow':   { side: '#67e8f9', bg: 'bg-cyan-50',    text: 'text-cyan-700' },
  'relation':    { side: '#f9a8d4', bg: 'bg-pink-50',    text: 'text-pink-700' },
  'concept':     { side: '#d8b4fe', bg: 'bg-purple-50',  text: 'text-purple-700' },
  'wealth':      { side: '#fcd34d', bg: 'bg-amber-50',   text: 'text-amber-700' },
  'health':      { side: '#5eead4', bg: 'bg-teal-50',    text: 'text-teal-700' },
  'other':       { side: '#cbd5e1', bg: 'bg-slate-100',  text: 'text-slate-600' },
};

// 하단 서비스 내부링크 카드
const serviceLinks = [
  { href: '/lifelong-saju', emoji: '🔮', label: '평생사주', desc: '용어가 내 사주에서 어떻게 나타나는지 직접 확인' },
  { href: '/dream',         emoji: '🌙', label: '꿈해몽',   desc: '꿈 속 상징을 사주 관점으로 풀어보기' },
  { href: '/compatibility', emoji: '💞', label: '궁합',     desc: '관계 운과 궁합을 명리학으로 분석' },
  { href: '/guide',         emoji: '📝', label: '운세 칼럼', desc: '용어가 실생활과 어떻게 연결되는지 칼럼으로' },
] as const;

export default function FortuneDictionary() {
  useCanonical('/fortune-dictionary');
  const [location] = useLocation();

  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(params?.get('category') || null);
  const [searchQuery, setSearchQuery] = useState(params?.get('q') || '');

  // URL 파라미터 변경 감지 (다른 페이지에서 링크로 들어올 때)
  useEffect(() => {
    const p = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    setSelectedCategory(p?.get('category') || null);
    setSearchQuery(p?.get('q') || '');
  }, [location]);

  // 카테고리·검색어 변경 시 URL 동기화
  const applyCategory = (cat: string | null) => {
    setSelectedCategory(cat);
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      cat ? p.set('category', cat) : p.delete('category');
      p.delete('q');
      window.history.pushState(null, '', `${window.location.pathname}${p.toString() ? '?' + p.toString() : ''}`);
    }
  };

  const applySearch = (q: string) => {
    setSearchQuery(q);
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      q ? p.set('q', q) : p.delete('q');
      window.history.pushState(null, '', `${window.location.pathname}${p.toString() ? '?' + p.toString() : ''}`);
    }
  };

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let results = selectedCategory
      ? DICTIONARY_INDEX.filter((e) => {
          const cat = e.category === 'ten-stem' ? 'sipsin' : e.category;
          return cat === selectedCategory;
        })
      : [...DICTIONARY_INDEX];
    if (q) {
      results = results.filter((e) =>
        [e.title, e.subtitle || '', e.summary, e.originalMeaning, e.modernInterpretation, e.muunAdvice, ...(e.tags || [])]
          .join(' ').toLowerCase().includes(q),
      );
    }
    return results;
  }, [selectedCategory, searchQuery]);

  const hasFilter = !!searchQuery || selectedCategory !== null;
  const categoryLabel = selectedCategory ? (categories.find((c) => c.id === selectedCategory)?.label ?? '선택됨') : null;

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

      {/* ── sticky 검색 헤더 ── */}
      <section className="sticky top-0 z-20 bg-[#f5f4ff]/95 backdrop-blur-md border-b border-[#6B5FFF]/10 px-4 pb-4 pt-[calc(var(--safe-area-top,0px)+44px)]">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[22px] font-bold tracking-[-0.05em] text-[#1e2340]">운세 사전</h1>
          <span className="text-xs font-semibold text-[#707797]">{DICTIONARY_INDEX.length}개 용어</span>
        </div>
        <label className="relative block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707797]" aria-hidden="true" />
          <input
            type="text"
            placeholder="용어 검색 (예: 역마살, 대운, 편재)"
            value={searchQuery}
            onChange={(e) => applySearch(e.target.value)}
            className="h-11 w-full rounded-2xl border border-[#6B5FFF]/20 bg-white pl-10 pr-9 text-sm text-[#1e2340] placeholder:text-[#707797] outline-none shadow-sm transition focus:border-[#6B5FFF] focus:ring-4 focus:ring-[#6B5FFF]/10"
          />
          {searchQuery && (
            <button
              onClick={() => applySearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#707797] hover:text-[#1e2340]"
              aria-label="검색어 지우기"
            >
              <X size={15} />
            </button>
          )}
        </label>
      </section>

      {/* ── 카테고리 그리드 (검색 중엔 숨김) ── */}
      {!searchQuery && (
        <section className="px-4 pt-4 pb-2">
          <p className="mb-3 text-xs font-bold tracking-[.06em] text-[#5a4ddb]">카테고리 탐색</p>
          <div className="grid grid-cols-4 gap-2">
            {/* 전체 보기 — 가로 full */}
            <button
              onClick={() => applyCategory(null)}
              className={`col-span-4 flex items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-bold transition
                ${selectedCategory === null
                  ? 'border-[#6B5FFF] bg-[#6B5FFF] text-white shadow-[0_6px_16px_rgba(107,95,255,.28)]'
                  : 'border-slate-200 bg-white/90 text-slate-600 hover:border-[#6B5FFF]/30'}`}
            >
              <span>📖</span> 전체 보기
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => applyCategory(cat.id)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border py-3 text-center transition
                  ${selectedCategory === cat.id
                    ? 'border-[#6B5FFF] bg-[#6B5FFF] text-white shadow-[0_6px_16px_rgba(107,95,255,.28)]'
                    : 'border-slate-200 bg-white/90 hover:border-[#6B5FFF]/30'}`}
              >
                <span className="text-xl leading-none">{cat.emoji}</span>
                <span className={`text-xs font-bold leading-tight ${selectedCategory === cat.id ? 'text-white' : 'text-slate-600'}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── 결과 헤더 ── */}
      <section className="flex items-center justify-between px-4 pb-2 pt-3">
        <p className="text-sm font-semibold text-slate-500">
          {hasFilter ? (
            <>
              {categoryLabel && <span className="mr-1 font-bold text-[#5648db]">[{categoryLabel}]</span>}
              {searchQuery && <span className="mr-1 font-bold text-slate-700">'{searchQuery}'</span>}
              검색 결과 <span className="font-bold text-slate-900">{filteredEntries.length}</span>개
            </>
          ) : (
            <>전체 <span className="font-bold text-slate-900">{filteredEntries.length}</span>개 용어</>
          )}
        </p>
        {hasFilter && (
          <button
            onClick={() => { applySearch(''); applyCategory(null); }}
            className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm hover:border-[#6B5FFF]/30 hover:text-[#5648db]"
          >
            <X size={11} /> 초기화
          </button>
        )}
      </section>

      {/* ── 카드 목록 ── */}
      <section className="px-4 pb-6">
        {filteredEntries.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {filteredEntries.map((entry) => {
              const style = categoryStyle[entry.category] ?? categoryStyle['other'];
              const catEmoji = categories.find((c) => c.id === entry.category || (entry.category === 'ten-stem' && c.id === 'sipsin'))?.emoji ?? '📌';
              return (
                <Link key={entry.id} href={`/dictionary/${entry.slug}`} className="flex overflow-hidden rounded-2xl border border-slate-200/80 bg-white/96 shadow-sm hover:-translate-y-0.5 hover:border-[#6B5FFF]/20 hover:shadow-md transition-all">
                  {/* 카테고리 색상 사이드바 */}
                  <div className="w-1 shrink-0" style={{ background: style.side }} />
                  <div className="flex-1 min-w-0 px-4 py-3">
                    {/* 뱃지 */}
                    <button
                      onClick={(e) => { e.preventDefault(); applyCategory(entry.category === 'ten-stem' ? 'sipsin' : entry.category); }}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${style.bg} ${style.text} hover:opacity-80`}
                    >
                      {catEmoji} {entry.categoryLabel}
                    </button>
                    {/* 제목 */}
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-[18px] font-bold tracking-[-0.05em] text-slate-900">{entry.title}</span>
                      {entry.subtitle && <span className="truncate text-xs font-semibold text-slate-400">{entry.subtitle}</span>}
                    </div>
                    {/* 설명 */}
                    <p className="mt-1 line-clamp-2 text-[12px] leading-[1.7] text-slate-500">{entry.summary}</p>
                    {/* 태그 — 클릭 시 검색 */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => { e.preventDefault(); applySearch(tag); }}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 hover:bg-[#6B5FFF]/10 hover:text-[#5648db] transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center pr-3 text-slate-300 text-lg">›</div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mu-glass-panel px-6 py-14 text-center">
            <div className="text-4xl">🔍</div>
            <h2 className="mt-4 text-[18px] font-bold tracking-[-0.04em] text-slate-900">검색 결과가 없습니다</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">다른 용어나 카테고리로 다시 찾아보세요.</p>
            <button
              onClick={() => { applySearch(''); applyCategory(null); }}
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#6B5FFF] px-5 py-2.5 text-sm font-bold text-white shadow"
            >
              <X size={13} /> 초기화
            </button>
          </div>
        )}
      </section>

      {/* ── 하단 서비스 내부링크 ── */}
      <section className="px-4 pb-10">
        <p className="mb-3 text-xs font-bold tracking-[.06em] text-[#5a4ddb]">이 사전과 함께 보면 좋은 서비스</p>
        <div className="grid grid-cols-2 gap-2.5">
          {serviceLinks.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm hover:-translate-y-0.5 hover:border-[#6B5FFF]/20 hover:shadow-md transition-all"
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-[14px] font-bold tracking-[-0.04em] text-slate-900">{s.label}</span>
              <span className="text-xs leading-[1.6] text-slate-500">{s.desc}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
