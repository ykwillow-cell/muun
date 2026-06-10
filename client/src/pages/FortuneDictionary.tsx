import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCanonical } from '@/lib/use-canonical';
import { Search, X, BookOpen, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { DICTIONARY_INDEX } from '@/generated/content-snapshots';
import { fetchFortuneDictionary } from '@/lib/fortune-dictionary';

const categories = [
  { id: 'basic',        label: '사주 기초',    emoji: '☯️' },
  { id: 'stem',         label: '천간',          emoji: '🌿' },
  { id: 'branch',       label: '지지',          emoji: '🐉' },
  { id: 'sipsin',       label: '십신',          emoji: '⚖️' },
  { id: 'evil-spirit',  label: '신살',          emoji: '⚡' },
  { id: 'luck-flow',    label: '운의 흐름',     emoji: '🌊' },
  { id: 'relation',     label: '관계 · 궁합',  emoji: '💞' },
  { id: 'concept',      label: '운세 개념',     emoji: '🔮' },
  { id: 'wealth',       label: '재물 · 직업',  emoji: '💰' },
  { id: 'health',       label: '건강 · 신체',  emoji: '🌱' },
  { id: 'other',        label: '기타',          emoji: '📌' },
] as const;

const categoryStyle: Record<string, { side: string; bg: string; text: string; lightBg: string }> = {
  'basic':       { side: '#a78bfa', bg: 'bg-violet-100',  text: 'text-violet-700',  lightBg: '#f5f3ff' },
  'stem':        { side: '#6ee7b7', bg: 'bg-emerald-100', text: 'text-emerald-700', lightBg: '#ecfdf5' },
  'branch':      { side: '#93c5fd', bg: 'bg-blue-100',    text: 'text-blue-700',    lightBg: '#eff6ff' },
  'ten-stem':    { side: '#818cf8', bg: 'bg-indigo-100',  text: 'text-indigo-700',  lightBg: '#eef2ff' },
  'sipsin':      { side: '#818cf8', bg: 'bg-indigo-100',  text: 'text-indigo-700',  lightBg: '#eef2ff' },
  'evil-spirit': { side: '#fda4af', bg: 'bg-rose-100',    text: 'text-rose-700',    lightBg: '#fff1f2' },
  'luck-flow':   { side: '#67e8f9', bg: 'bg-cyan-100',    text: 'text-cyan-700',    lightBg: '#ecfeff' },
  'relation':    { side: '#f9a8d4', bg: 'bg-pink-100',    text: 'text-pink-700',    lightBg: '#fdf2f8' },
  'concept':     { side: '#d8b4fe', bg: 'bg-purple-100',  text: 'text-purple-700',  lightBg: '#faf5ff' },
  'wealth':      { side: '#fcd34d', bg: 'bg-amber-100',   text: 'text-amber-700',   lightBg: '#fffbeb' },
  'health':      { side: '#5eead4', bg: 'bg-teal-100',    text: 'text-teal-700',    lightBg: '#f0fdfa' },
  'other':       { side: '#cbd5e1', bg: 'bg-slate-100',   text: 'text-slate-600',   lightBg: '#f8fafc' },
};

// 인기 검색어
const POPULAR_KEYWORDS = ['역마살', '대운', '편재', '식신', '천간', '지지', '오행', '용신'];

// 하단 서비스 링크
const SERVICE_LINKS = [
  { href: '/lifelong-saju', emoji: '🔮', label: '평생사주',  desc: '용어가 내 사주에서 어떻게 나타나는지 직접 확인' },
  { href: '/dream',         emoji: '🌙', label: '꿈해몽',    desc: '꿈 속 상징을 사주 관점으로 풀어보기' },
  { href: '/compatibility', emoji: '💞', label: '궁합',      desc: '관계 운과 궁합을 명리학으로 분석' },
  { href: '/guide',         emoji: '📝', label: '운세 칼럼', desc: '용어가 실생활과 어떻게 연결되는지 칼럼으로' },
  { href: '/tarot',         emoji: '🃏', label: '타로 상담', desc: '카드가 전하는 오늘의 메시지' },
  { href: '/daily-fortune', emoji: '📅', label: '오늘의 운세', desc: '오늘 하루 총운·재물운·애정운' },
];

export default function FortuneDictionary() {
  useCanonical('/fortune-dictionary');
  const [location] = useLocation();
  const [allEntries, setAllEntries] = useState<typeof DICTIONARY_INDEX>(DICTIONARY_INDEX as any);

  useEffect(() => {
    fetchFortuneDictionary().then((data) => {
      if (data && data.length > 0) setAllEntries(data as any);
    });
  }, []);

  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(params?.get('category') || null);
  const [searchQuery, setSearchQuery] = useState(params?.get('q') || '');

  useEffect(() => {
    const p = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    setSelectedCategory(p?.get('category') || null);
    setSearchQuery(p?.get('q') || '');
  }, [location]);

  const applyCategory = (cat: string | null) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams();
      if (cat) p.set('category', cat);
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
      ? allEntries.filter((e: any) => {
          const cat = e.category === 'ten-stem' ? 'sipsin' : e.category;
          return cat === selectedCategory;
        })
      : [...allEntries];
    if (q) {
      results = results.filter((e: any) =>
        [e.title, e.subtitle || '', e.summary, e.originalMeaning, e.modernInterpretation, e.muunAdvice, ...(e.tags || [])]
          .join(' ').toLowerCase().includes(q),
      );
    }
    return results;
  }, [selectedCategory, searchQuery, allEntries]);

  const hasFilter = !!searchQuery || selectedCategory !== null;
  const categoryLabel = selectedCategory ? (categories.find((c) => c.id === selectedCategory)?.label ?? '선택됨') : null;
  const isSearching = !!searchQuery;

  return (
    <div className="min-h-screen mu-page-bg pb-20">
      <Helmet>
        <title>사주 용어 사전 - 사주 기초 개념 무료 학습 | 무운 (MuUn)</title>
        <meta name="description" content="사주 명리학의 핵심 용어를 쉽게 풀이한 무료 사주 용어 사전. 천간, 지지, 십신, 대운, 오행 등 사주 기초 개념을 정리했습니다." />
        <meta name="keywords" content="사주용어, 사주사전, 천간지지, 십신, 대운, 오행, 사주기초, 명리학용어, 사주공부" />
        <link rel="canonical" href="https://muunsaju.com/fortune-dictionary" />
        <meta property="og:title" content="사주 용어 사전 - 사주 기초 개념 무료 학습 | 무운 (MuUn)" />
        <meta property="og:description" content="사주 명리학의 핵심 용어를 쉽게 풀이한 무료 사주 용어 사전." />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:url" content="https://muunsaju.com/fortune-dictionary" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ── 헤더 + 검색 ── */}
      <section className="sticky top-0 z-20 bg-[#f5f4f8]/95 backdrop-blur-md border-b border-black/[0.06] px-4 pb-3 pt-[calc(var(--safe-area-top,0px)+44px)]">
        {/* 타이틀 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6B5FFF, #5648db)' }}>
              <BookOpen size={14} className="text-white" />
            </div>
            <h1 className="text-base font-bold text-[#1a1a18]">운세 사전</h1>
          </div>
          <span className="text-xs font-medium text-[#8b8fa8] bg-white border border-black/[0.06] px-2.5 py-1 rounded-full">
            {allEntries.length}개 용어
          </span>
        </div>

        {/* 검색창 */}
        <label className="relative block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b8fa8]" aria-hidden="true" />
          <input
            type="text"
            placeholder="용어 검색 (예: 역마살, 대운, 편재)"
            value={searchQuery}
            onChange={(e) => applySearch(e.target.value)}
            className="h-11 w-full rounded-2xl border border-black/[0.08] bg-white pl-10 pr-10 text-base text-[#1a1a18] placeholder:text-[#aeb3c8] outline-none shadow-sm transition focus:border-[#6B5FFF] focus:ring-2 focus:ring-[#6B5FFF]/15"
          />
          {searchQuery && (
            <button
              onClick={() => applySearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#aeb3c8] hover:text-[#1a1a18] transition-colors"
              aria-label="검색어 지우기"
            >
              <X size={15} />
            </button>
          )}
        </label>
      </section>

      {/* ── 검색 중: 인기 키워드 + 결과 ── */}
      {isSearching ? (
        <div className="px-4 pt-4">
          {/* 인기 검색어 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {POPULAR_KEYWORDS.map((kw) => (
              <button key={kw} onClick={() => applySearch(kw)}
                className="text-sm px-3 py-1.5 rounded-full font-medium transition-colors"
                style={{ background: '#eef2ff', color: '#4338ca', border: '0.5px solid rgba(99,102,241,0.2)' }}>
                {kw}
              </button>
            ))}
          </div>

          {/* 결과 카운트 */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500">
              <span className="font-bold text-[#5648db]">'{searchQuery}'</span> 검색 결과
              <span className="font-bold text-slate-900 ml-1">{filteredEntries.length}개</span>
            </p>
            <button onClick={() => applySearch('')}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#5648db] transition-colors">
              <X size={11} /> 초기화
            </button>
          </div>

          {/* 검색 결과 리스트 */}
          {filteredEntries.length > 0 ? (
            <div className="flex flex-col gap-2">
              {filteredEntries.map((entry) => {
                const style = categoryStyle[entry.category] ?? categoryStyle['other'];
                const catEmoji = categories.find((c) => c.id === entry.category || (entry.category === 'ten-stem' && c.id === 'sipsin'))?.emoji ?? '📌';
                return (
                  <Link key={entry.id} href={`/dictionary/${entry.slug}`}>
                    <div className="flex overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                      <div className="w-1 shrink-0" style={{ background: style.side }} />
                      <div className="flex-1 min-w-0 px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${style.bg} ${style.text}`}>
                          {catEmoji} {entry.categoryLabel}
                        </span>
                        <div className="mt-1.5 flex items-baseline gap-2">
                          <span className="text-base font-bold text-slate-900">{entry.title}</span>
                          {entry.subtitle && <span className="truncate text-xs text-slate-400">{entry.subtitle}</span>}
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">{entry.summary}</p>
                      </div>
                      <div className="flex items-center pr-3 text-slate-300"><ChevronRight size={16} /></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-black/[0.06] px-6 py-12 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h2 className="text-base font-bold text-slate-900 mb-1">검색 결과가 없습니다</h2>
              <p className="text-sm text-slate-500">다른 용어나 카테고리로 다시 찾아보세요.</p>
              <button onClick={() => applySearch('')}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#5648db] px-5 py-2.5 text-sm font-bold text-white">
                <X size={13} /> 초기화
              </button>
            </div>
          )}
        </div>

      ) : (
        <>
          {/* ── 카테고리 그리드 ── */}
          <section className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={13} className="text-[#5648db]" />
              <p className="text-xs font-bold tracking-[.06em] text-[#5648db]">카테고리 탐색</p>
            </div>

            {/* 전체 보기 */}
            <button
              onClick={() => applyCategory(null)}
              className={`w-full flex items-center justify-center gap-2 rounded-2xl border py-3 text-base font-bold mb-2 transition-all
                ${selectedCategory === null
                  ? 'border-[#5648db] bg-[#5648db] text-white shadow-[0_6px_16px_rgba(86,72,219,.25)]'
                  : 'border-black/[0.08] bg-white text-slate-600 hover:border-[#5648db]/30'}`}
            >
              <span>📖</span> 전체 보기
            </button>

            {/* 카테고리 그리드 */}
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const style = categoryStyle[cat.id] ?? categoryStyle['other'];
                return (
                  <button
                    key={cat.id}
                    onClick={() => applyCategory(cat.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border py-3 text-center transition-all
                      ${isActive
                        ? 'border-[#5648db] bg-[#5648db] text-white shadow-[0_6px_16px_rgba(86,72,219,.25)]'
                        : 'border-black/[0.08] bg-white hover:border-[#5648db]/30'}`}
                    style={!isActive ? { background: style.lightBg } : {}}
                  >
                    <span className="text-xl leading-none">{cat.emoji}</span>
                    <span className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : style.text}`}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── 결과 헤더 ── */}
          <section className="flex items-center justify-between px-4 pt-3 pb-2">
            <p className="text-sm text-slate-500">
              {categoryLabel
                ? <><span className="font-bold text-[#5648db]">{categoryLabel}</span> · <span className="font-bold text-slate-900">{filteredEntries.length}</span>개 용어</>
                : <>전체 <span className="font-bold text-slate-900">{filteredEntries.length}</span>개 용어</>
              }
            </p>
            {hasFilter && (
              <button onClick={() => applyCategory(null)}
                className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#5648db] transition-colors">
                <X size={11} /> 초기화
              </button>
            )}
          </section>

          {/* ── 카드 목록 (리스트형) ── */}
          <section className="px-4 pb-6">
            <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden shadow-sm">
              {filteredEntries.map((entry, idx) => {
                const style = categoryStyle[entry.category] ?? categoryStyle['other'];
                const catEmoji = categories.find(
                  (c) => c.id === entry.category || (entry.category === 'ten-stem' && c.id === 'sipsin')
                )?.emoji ?? '📌';
                return (
                  <Link key={entry.id} href={`/dictionary/${entry.slug}`}>
                    <div className={`flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${idx > 0 ? 'border-t border-black/[0.05]' : ''}`}>
                      {/* 카테고리 색상 도트 */}
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-[7px]" style={{ background: style.side }} />

                      {/* 내용 */}
                      <div className="flex-1 min-w-0">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold mb-1.5 ${style.bg} ${style.text}`}>
                          {catEmoji} {entry.categoryLabel}
                        </span>
                        <p className="text-base font-bold text-slate-900 mb-1">{entry.title}</p>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{entry.summary}</p>
                      </div>

                      <ChevronRight size={16} className="text-slate-300 flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── 하단 서비스 링크 ── */}
          <section className="px-4 pb-10">
            {/* 헤더 */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6B5FFF, #5648db)' }}>
                <Sparkles size={14} className="text-white" />
              </div>
              <h3 className="text-base font-bold text-[#1a1a18]">함께 보면 좋은 서비스</h3>
            </div>

            {/* 무료 안내 */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium px-2 py-1 rounded-md"
                style={{ background: '#f5f3ff', color: '#5b21b6', border: '0.5px solid rgba(124,58,237,0.25)' }}>무료</span>
              <span className="text-xs font-medium px-2 py-1 rounded-md"
                style={{ background: '#f0fdf4', color: '#0f6e56', border: '0.5px solid #5DCAA5' }}>회원가입 없이</span>
              <span className="text-sm text-slate-500">바로 확인할 수 있어요</span>
            </div>

            {/* 서비스 리스트 */}
            <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden shadow-sm">
              {SERVICE_LINKS.map((svc, idx) => (
                <Link key={svc.href} href={svc.href}>
                  <div className={`flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${idx > 0 ? 'border-t border-black/[0.05]' : ''}`}>
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                      {svc.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-slate-900">{svc.label}</p>
                      <p className="text-sm text-slate-500 truncate">{svc.desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
