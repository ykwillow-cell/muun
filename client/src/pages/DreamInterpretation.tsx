import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, BrainCircuit, CloudMoon, ArrowRight, 
  Info, ChevronRight, Zap, X, 
  PawPrint, Users, Mountain, Box, Activity, Layers,
  Trophy, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { getAllDreams, searchDreams, DreamData } from '../lib/dream-data-api';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanonical } from '@/lib/use-canonical';
import { useLocation } from 'wouter';

type DreamGrade = 'great' | 'good' | 'bad';

const categories = [
  { id: 'animal', name: '동물', icon: PawPrint, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { id: 'person', name: '인물/신체', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'nature', name: '자연/현상', icon: Mountain, color: 'text-green-400', bg: 'bg-green-400/10' },
  { id: 'object', name: '생활/사물', icon: Box, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { id: 'action', name: '상태/행동', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'other', name: '기타', icon: Layers, color: 'text-slate-400', bg: 'bg-slate-400/10' },
] as const;

const gradeConfig: Record<DreamGrade, { label: string; icon: any; color: string; bg: string; border: string; desc: string }> = {
  great: { 
    label: '황금빛 길몽', 
    icon: Trophy, 
    color: 'text-yellow-400', 
    bg: 'from-yellow-500/20 to-transparent', 
    border: 'border-yellow-500/30',
    desc: '재물, 성공, 경사를 상징하는 아주 좋은 꿈입니다!'
  },
  good: { 
    label: '푸른 평몽', 
    icon: CheckCircle2, 
    color: 'text-blue-400', 
    bg: 'from-blue-500/20 to-transparent', 
    border: 'border-blue-500/30',
    desc: '일상의 변화나 심리적 안정을 나타내는 긍정적인 꿈입니다.'
  },
  bad: { 
    label: '보랏빛 흉몽', 
    icon: AlertCircle, 
    color: 'text-purple-400', 
    bg: 'from-purple-500/20 to-transparent', 
    border: 'border-purple-500/30',
    desc: '주의와 액땜이 필요한 시기임을 알려주는 꿈입니다.'
  }
};

const getGrade = (grade: string): DreamGrade => {
  if (grade === 'great' || grade === 'good' || grade === 'bad') return grade;
  return 'good';
};

const DreamInterpretation: React.FC = () => {
  useCanonical('/dream');
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDream, setSelectedDream] = useState<DreamData | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categoryDreams, setCategoryDreams] = useState<DreamData[]>([]);
  const [searchResults, setSearchResults] = useState<DreamData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // 카테고리 클릭 시 DB에서 해당 카테고리 꿈 조회
  const loadCategoryDreams = useCallback(async (catId: string) => {
    setIsLoading(true);
    try {
      const data = await getAllDreams(catId);
      setCategoryDreams(data);
    } catch (e) {
      setCategoryDreams([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 검색어 변경 시 DB 검색
  useEffect(() => {
    const term = searchTerm.trim();
    if (!term) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchDreams(term);
        setSearchResults(data);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // URL 쿼리 파라미터에서 검색어 읽기
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, []);

  const handleSelectDream = (dream: DreamData) => {
    // 상세 페이지로 이동
    navigate(`/dream/${dream.slug}`);
  };

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
    setActiveCategory(null);
    setSelectedDream(null);
  };

  const handleCategoryClick = (catId: string) => {
    if (activeCategory === catId) {
      setActiveCategory(null);
      setCategoryDreams([]);
    } else {
      setActiveCategory(catId);
      setSearchTerm('');
      setSelectedDream(null);
      loadCategoryDreams(catId);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedDream(null);
    setActiveCategory(null);
    setCategoryDreams([]);
    setSearchResults([]);
  };

  const displayDreams = searchTerm.trim() ? searchResults : categoryDreams;
  const isShowingResults = !!(searchTerm.trim() || activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
      <Helmet>
        <title>무료 꿈해몽 사전 - 회원가입 없이 꿈 풀이 확인 | 무운 (MuUn)</title>
        <meta name="description" content="어젯밤 꿈의 의미가 궁금하신가요? 회원가입 없이 바로 검색하는 무료 꿈해몽 사전. 방대한 데이터를 바탕으로 정확한 꿈 풀이를 개인정보 저장 없이 100% 무료로 제공합니다." />
        <meta name="keywords" content="꿈해몽, 무료꿈해몽, 꿈풀이, 꿈해석, 꿈사전, 길몽, 흉몽, 태몽, 돼지꿈, 뱀꿈" />
        <link rel="canonical" href="https://muunsaju.com/dream" />
        <meta property="og:title" content="무료 꿈해몽 사전 - 회원가입 없이 꿈 풀이 확인 | 무운 (MuUn)" />
        <meta property="og:description" content="어젯밤 꿈의 의미가 궁금하신가요? 회원가입 없이 바로 검색하는 무료 꿈해몽 사전. 방대한 데이터를 바탕으로 정확한 꿈 풀이를 개인정보 저장 없이 100% 무료로 제공합니다." />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:url" content="https://muunsaju.com/dream" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="무료 꿈해몽 사전 - 회원가입 없이 꿈 풀이 확인 | 무운 (MuUn)" />
        <meta name="twitter:description" content="어젯밤 꿈의 의미가 궁금하신가요? 회원가입 없이 바로 검색하는 무료 꿈해몽 사전. 방대한 데이터를 바탕으로 정확한 꿈 풀이를 개인정보 저장 없이 100% 무료로 제공합니다." />
        <meta name="twitter:image" content="https://muunsaju.com/images/horse_mascot.png" />
      </Helmet>

      {/* Hero Section */}
      <section className="px-4 pt-12 pb-8 text-center bg-gradient-to-b from-purple-900/10 to-transparent">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-xl">
            <CloudMoon className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold tracking-widest text-primary uppercase">신비로운 꿈의 해석</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">무운 꿈해몽 사전</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            어젯밤 당신의 무의식이 보내온 신호를 확인해 보세요.<br />
            방대한 데이터를 통해 가장 정확한 해몽을 제공합니다.
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Search Bar Section */}
        <div className="mb-8 py-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {isSearching ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              ) : (
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              )}
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (selectedDream) setSelectedDream(null);
                if (activeCategory) setActiveCategory(null);
              }}
              placeholder="어떤 꿈을 꾸셨나요? (예: 돼지, 물, 불)"
              className="w-full pl-12 pr-12 py-4 bg-card border border-white/10 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner transition-all"
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* Quick Tags */}
          <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-1 no-scrollbar">
            {["돼지", "물", "불", "뱀", "돈", "조상", "이빨", "대통령"].map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1.5 rounded-full border text-xs transition-all whitespace-nowrap ${
                  searchTerm === tag 
                  ? "bg-primary border-primary text-white font-bold" 
                  : "bg-white/5 border-white/10 text-muted-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/30"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Category Navigation - 칩(Chip) 스타일 */}
        {!selectedDream && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
              <Layers className="w-4 h-4" /> 카테고리로 찾기
            </h2>
            {/* 칩 형태 카테고리 필터 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setActiveCategory(null); setCategoryDreams([]); }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all min-h-[40px] ${
                  activeCategory === null
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                전체
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all min-h-[40px] active:scale-[0.97] ${
                    activeCategory === cat.id
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  <cat.icon className={`w-3.5 h-3.5 ${activeCategory === cat.id ? 'text-white' : cat.color}`} />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {isShowingResults ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-bold text-slate-400">
                    {activeCategory && !searchTerm.trim()
                      ? `${categories.find(c => c.id === activeCategory)?.name} 카테고리 결과` 
                      : `'${searchTerm}' 검색 결과`}
                    {!isLoading && !isSearching && (
                      <span className="ml-2 text-primary">{displayDreams.length}건</span>
                    )}
                  </h3>
                  <button onClick={clearSearch} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
                    초기화 <X className="w-3 h-3" />
                  </button>
                </div>
                
                {(isLoading || isSearching) ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {displayDreams.length > 0 ? (
                      displayDreams.map((dream, idx) => {
                        const grade = getGrade(dream.grade);
                        return (
                          <motion.div
                            key={dream.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.04 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectDream(dream)}
                            className="group flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${gradeConfig[grade].bg.replace('from-', 'bg-').replace('/20 to-transparent', '/20')} border ${gradeConfig[grade].border}`}>
                                {React.createElement(gradeConfig[grade].icon, {
                                  className: `w-6 h-6 ${gradeConfig[grade].color}`
                                })}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                    {dream.keyword}
                                  </h3>
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ${gradeConfig[grade].color}`}>
                                    {gradeConfig[grade].label}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {dream.interpretation}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all" />
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg text-slate-400">검색 결과가 없습니다.</p>
                        <p className="text-sm text-slate-500 mt-2">다른 키워드로 검색해 보세요.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Zap className="w-5 h-5 text-yellow-500" /> 많이 찾는 꿈
                  </h2>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: "돼지꿈", key: "돼지" },
                      { label: "돈 받는 꿈", key: "돈" },
                      { label: "불나는 꿈", key: "불" },
                      { label: "조상님 꿈", key: "조상" }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTagClick(item.key)}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all text-left group"
                      >
                        <span className="text-slate-300 group-hover:text-primary transition-colors">{item.label}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 flex flex-col items-center justify-center text-center">
                  <BrainCircuit className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-white">꿈은 무의식의 거울입니다</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    우리가 자는 동안 뇌는 하루의 정보를 정리하고 감정을 처리합니다. 무운의 꿈해몽으로 당신의 내면이 보내는 메시지를 읽어보세요.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DreamInterpretation;
