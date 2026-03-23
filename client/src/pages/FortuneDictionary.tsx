import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCanonical } from '@/lib/use-canonical';
import { setDictionaryOGTags } from '@/lib/og-tags';
import { Search, ChevronRight, Loader2 } from 'lucide-react';
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

  // URL ?category= 쿼리파라미터로 초기 카테고리 설정 (사전 디테일 페이지에서 카테고리 배지 클릭 시)
  const initialCategory = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('category')
    : null;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
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
    <div className="min-h-screen bg-[#F2F4F6] py-8 md:py-12 px-4">
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
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-[#191F28] mb-3">무운 운세 사전</h1>
          <p className="text-[#4E5968] text-lg">
            사주 명리학의 어려운 용어들을 쉽고 따뜻하게 설명해드립니다.
          </p>
        </div>

        {/* 검색창 */}
        <div className="mb-8">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B95A1] group-focus-within:text-[#6B5FFF] transition-colors" />
            <input
              type="text"
              placeholder="용어를 검색해보세요 (예: 역마살, 재성, 대운)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-black/10 rounded-2xl text-[#191F28] placeholder-[#8B95A1] focus:outline-none focus:border-[#6B5FFF] focus:ring-4 focus:ring-[#6B5FFF]/10 transition-all shadow-sm text-lg"
            />
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`inline-flex items-center px-5 py-2 rounded-full text-sm font-bold border transition-all active:scale-[0.95] ${
                selectedCategory === null
                  ? 'bg-[#6B5FFF] border-[#6B5FFF] text-white shadow-lg shadow-[#6B5FFF]/20'
                  : 'bg-white border-black/10 text-[#4E5968] hover:bg-black/[0.04] hover:border-black/20'
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center px-5 py-2 rounded-full text-sm font-bold border transition-all active:scale-[0.95] ${
                  selectedCategory === category.id
                    ? 'bg-[#6B5FFF] border-[#6B5FFF] text-white shadow-lg shadow-[#6B5FFF]/20'
                    : 'bg-white border-black/10 text-[#4E5968] hover:bg-black/[0.04] hover:border-black/20'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* 결과 표시 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#6B5FFF] mb-4" />
              <p className="text-[#8B95A1] text-lg font-medium">사전 데이터를 불러오는 중...</p>
            </div>
          ) : filteredEntries.length > 0 ? (
            filteredEntries.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx % 10 * 0.05 }}
              >
                <button
                  onClick={() => navigate(`/dictionary/${entry.slug}`)}
                  className="w-full text-left p-6 bg-white border border-black/10 rounded-2xl hover:border-[#6B5FFF]/30 hover:bg-[#6B5FFF]/05 transition-all group shadow-sm flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-block px-2.5 py-1 bg-[#6B5FFF]/10 border border-[#6B5FFF]/20 rounded-lg text-[#6B5FFF] text-[11px] font-bold uppercase tracking-wider">
                      {entry.categoryLabel}
                    </span>
                    <ChevronRight className="w-5 h-5 text-[#8B95A1] group-hover:text-[#6B5FFF] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold text-[#191F28] group-hover:text-[#6B5FFF] transition-colors mb-2">
                    {entry.title}
                  </h3>
                  {entry.subtitle && (
                    <p className="text-sm text-[#8B95A1] mb-3 font-medium">{entry.subtitle}</p>
                  )}
                  <p className="text-sm text-[#4E5968] line-clamp-2 leading-relaxed mt-auto">
                    {entry.summary}
                  </p>
                </button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-black/10">
              <p className="text-[#8B95A1] text-xl font-bold">검색 결과가 없습니다</p>
              <p className="text-[#4E5968] text-base mt-2">다른 키워드로 검색해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
