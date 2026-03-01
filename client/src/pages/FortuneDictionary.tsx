import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCanonical } from '@/lib/use-canonical';
import { setDictionaryOGTags } from '@/lib/og-tags';
import { Search, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  fetchFortuneDictionary,
  getAllCategories,
  searchDictionary,
  type DictionaryEntry,
} from '@/lib/fortune-dictionary';

export default function FortuneDictionary() {
  useCanonical('/fortune-dictionary');

  useEffect(() => {
    setDictionaryOGTags();
  }, []);

  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = getAllCategories();

  // Supabase에서 데이터 로드
  useEffect(() => {
    fetchFortuneDictionary().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  // 검색 및 필터링된 항목들
  const filteredEntries = useMemo(() => {
    let results = entries;
    if (selectedCategory) {
      results = results.filter((entry) => entry.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      results = searchDictionary(searchQuery, entries);
      if (selectedCategory) {
        results = results.filter((entry) => entry.category === selectedCategory);
      }
    }
    return results;
  }, [selectedCategory, searchQuery, entries]);

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <Helmet>
        <title>사주 용어 사전 - 사주 기초 개념 무료 학습 | 무운 (MuUn)</title>
        <meta name="description" content="사주 명리학의 핵심 용어를 쉽게 풀이한 무료 사주 용어 사전. 천간, 지지, 십신, 대운, 오행 등 사주 기초 개념을 회원가입 없이 무료로 학습하세요." />
        <meta name="keywords" content="사주용어, 사주사전, 천간지지, 십신, 대운, 오행, 사주기초, 명리학용어, 사주공부" />
        <link rel="canonical" href="https://muunsaju.com/fortune-dictionary" />
        <meta property="og:title" content="사주 용어 사전 - 사주 기초 개념 무료 학습 | 무운 (MuUn)" />
        <meta property="og:description" content="사주 명리학의 핵심 용어를 쉽게 풀이한 무료 사주 용어 사전. 천간, 지지, 십신, 대운, 오행 등 사주 기초 개념을 회원가입 없이 무료로 학습하세요." />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:url" content="https://muunsaju.com/fortune-dictionary" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="사주 용어 사전 - 사주 기초 개념 무료 학습 | 무운 (MuUn)" />
        <meta name="twitter:description" content="사주 명리학의 핵심 용어를 쉽게 풀이한 무료 사주 용어 사전. 천간, 지지, 십신, 대운, 오행 등 사주 기초 개념을 회원가입 없이 무료로 학습하세요." />
        <meta name="twitter:image" content="https://muunsaju.com/images/horse_mascot.png" />
      </Helmet>
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">무운 운세 사전</h1>
          <p className="text-slate-300 text-lg">
            사주 명리학의 어려운 용어들을 쉽고 따뜻하게 설명해드립니다.
          </p>
        </div>
        {/* 검색창 */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="용어를 검색해보세요 (예: 역마살, 재성, 대운)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
            />
          </div>
        </div>
        {/* 카테고리 필터 - 칩(Chip) 스타일 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border transition-all min-h-[40px] active:scale-[0.97] ${
                selectedCategory === null
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border transition-all min-h-[40px] active:scale-[0.97] ${
                  selectedCategory === category.id
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        {/* 결과 표시 - 피드 스타일 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400 text-lg">사전 데이터를 불러오는 중...</p>
            </div>
          ) : filteredEntries.length > 0 ? (
            filteredEntries.map((entry, idx) => (
              <motion.button
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => {
                  navigate(`/dictionary/${entry.slug}`);
                }}
                className="w-full text-left p-5 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-purple-500/50 hover:bg-slate-800 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-2 py-0.5 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-400 text-xs font-semibold">
                        {entry.categoryLabel}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-primary transition">
                      {entry.title}
                    </h3>
                    {entry.subtitle && (
                      <p className="text-xs text-slate-400 mt-1">{entry.subtitle}</p>
                    )}
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {entry.summary}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-primary transition mt-0.5 flex-shrink-0" />
                </div>
              </motion.button>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400 text-lg">검색 결과가 없습니다.</p>
              <p className="text-slate-500 text-sm mt-2">다른 키워드로 검색해보세요.</p>
            </div>
          )}
        </div>
        {/* 상세 보기 모달 */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
              {/* 모달 헤더 */}
              <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-start justify-between">
                <div>
                  <div className="inline-block px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-400 text-xs font-semibold mb-3">
                    {selectedEntry.categoryLabel}
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedEntry.title}
                  </h2>
                  {selectedEntry.subtitle && (
                    <p className="text-slate-400 text-sm mt-2">{selectedEntry.subtitle}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-slate-400 hover:text-white transition text-2xl leading-none"
                >
                  ✕
                </button>
              </div>
              {/* 모달 콘텐츠 */}
              <div className="p-6 space-y-6">
                {/* 원래 의미 */}
                <div>
                  <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">
                    원래 의미
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedEntry.originalMeaning}
                  </p>
                </div>
                {/* 현대적 재해석 */}
                <div>
                  <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">
                    현대적 재해석 (무운의 시선)
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedEntry.modernInterpretation}
                  </p>
                </div>
                {/* 무운의 한마디 */}
                <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">
                    💡 무운의 따뜻한 한마디
                  </h3>
                  <p className="text-slate-200 leading-relaxed">
                    {selectedEntry.muunAdvice}
                  </p>
                </div>
                {/* 태그 */}
                {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
                      관련 키워드
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs hover:bg-slate-600 cursor-pointer transition"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* 모달 푸터 */}
              <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-4 flex justify-end">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
