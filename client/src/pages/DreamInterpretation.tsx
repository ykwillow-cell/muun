import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, BrainCircuit, Sparkles, CloudMoon, ArrowRight, 
  Info, ChevronRight, Quote, Zap, Star, X, 
  PawPrint, Users, Mountain, Box, Activity, Layers,
  Trophy, CheckCircle2, AlertCircle
} from 'lucide-react';
import { dreamData, DreamData, DreamGrade } from '../data/dream-data';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCanonical } from '@/lib/use-canonical';

const categories = [
  { id: 'animal', name: '동물', icon: PawPrint, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { id: 'person', name: '인물/신체', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'nature', name: '자연/현상', icon: Mountain, color: 'text-green-400', bg: 'bg-green-400/10' },
  { id: 'object', name: '생활/사물', icon: Box, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { id: 'action', name: '상태/행동', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'etc', name: '기타', icon: Layers, color: 'text-slate-400', bg: 'bg-slate-400/10' },
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
  caution: { 
    label: '보랏빛 흉몽', 
    icon: AlertCircle, 
    color: 'text-purple-400', 
    bg: 'from-purple-500/20 to-transparent', 
    border: 'border-purple-500/30',
    desc: '주의와 액땜이 필요한 시기임을 알려주는 꿈입니다.'
  }
};

const DreamInterpretation: React.FC = () => {
  useCanonical('/dream');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDream, setSelectedDream] = useState<DreamData | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // URL 쿼리 파라미터에서 검색어 읽기
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) {
      setSearchTerm(query);
      const exactMatch = Object.values(dreamData).find(d => d.keyword === query);
      if (exactMatch) {
        setSelectedDream(exactMatch);
      }
    }
  }, []);

  const filteredDreams = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    
    // 카테고리 필터링이 활성화된 경우
    if (activeCategory && !term) {
      return Object.values(dreamData).filter(d => d.category === activeCategory);
    }

    if (!term) return [];
    
    // 1. 키워드와 정확히 일치하는 항목 우선
    const exactMatches = Object.values(dreamData).filter(
      d => d.keyword.toLowerCase() === term
    );
    
    // 2. 키워드를 포함하는 항목
    const partialMatches = Object.values(dreamData).filter(
      d => d.keyword.toLowerCase().includes(term) && d.keyword.toLowerCase() !== term
    );
    
    return [...exactMatches, ...partialMatches];
  }, [searchTerm, activeCategory]);

  const handleSelectDream = (dream: DreamData) => {
    setSelectedDream(dream);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
    setActiveCategory(null);
    const exactMatch = Object.values(dreamData).find(d => d.keyword === tag);
    if (exactMatch) {
      handleSelectDream(exactMatch);
    }
  };

  const handleCategoryClick = (catId: string) => {
    if (activeCategory === catId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(catId);
      setSearchTerm('');
      setSelectedDream(null);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedDream(null);
    setActiveCategory(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
      <Helmet>
        <title>{selectedDream ? `[가입X] ${selectedDream.keyword} 꿈해몽 무료 풀이 - 무운` : "[가입X/100%무료] 꿈해몽 검색 - 무운"}</title>
        <meta name="description" content={selectedDream ? `${selectedDream.keyword} 꿈해몽: ${selectedDream.interpretation.slice(0, 100)}... 가입 없이 100% 무료로 확인하세요.` : "가입/결제 없이 1,000개 이상의 방대한 데이터로 당신의 꿈을 무료로 해몽해 보세요. 길몽, 흉몽 분석과 행운 지수까지 확인 가능합니다."} />
        {selectedDream && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": `${selectedDream.keyword} 꿈해몽 무료 풀이`,
              "description": selectedDream.interpretation,
              "author": {
                "@type": "Organization",
                "name": "무운"
              },
              "publisher": {
                "@type": "Organization",
                "name": "무운",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://muunsaju.com/logo.png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://muunsaju.com/dream?q=${encodeURIComponent(selectedDream.keyword)}`
              }
            })}
          </script>
        )}
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
              <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
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

        {/* Category Navigation */}
        {!selectedDream && (
          <div className="mb-10">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
              <Layers className="w-4 h-4" /> 카테고리로 찾기
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                    activeCategory === cat.id
                    ? "bg-primary/20 border-primary shadow-lg shadow-primary/10"
                    : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className={`p-3 rounded-xl ${cat.bg}`}>
                    <cat.icon className={`w-6 h-6 ${cat.color}`} />
                  </div>
                  <span className={`text-xs font-medium ${activeCategory === cat.id ? 'text-white' : 'text-slate-400'}`}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {selectedDream ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Premium Result Header Card */}
              <Card className={`overflow-hidden border-2 ${gradeConfig[selectedDream.grade].border} bg-gradient-to-br ${gradeConfig[selectedDream.grade].bg} via-card to-background shadow-2xl relative`}>
                <div className="absolute top-0 right-0 p-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <Sparkles className={`w-8 h-8 ${gradeConfig[selectedDream.grade].color} opacity-50`} />
                  </motion.div>
                </div>
                
                <CardHeader className="text-center pb-2 pt-10">
                  <div className="flex justify-center mb-6">
                    <div className={`relative p-5 rounded-full border-2 ${gradeConfig[selectedDream.grade].border} bg-background/50 backdrop-blur-md shadow-xl`}>
                      {React.createElement(gradeConfig[selectedDream.grade].icon, {
                        className: `w-10 h-10 ${gradeConfig[selectedDream.grade].color}`
                      })}
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-primary text-[10px] font-bold px-2 py-1 rounded-full text-white shadow-lg"
                      >
                        {selectedDream.score}점
                      </motion.div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className={`text-sm font-bold tracking-widest uppercase ${gradeConfig[selectedDream.grade].color}`}>
                      {gradeConfig[selectedDream.grade].label}
                    </span>
                    <CardTitle className="text-3xl md:text-4xl font-bold text-white">
                      {selectedDream.keyword} 꿈
                    </CardTitle>
                  </div>
                  <p className="text-slate-400 text-sm mt-4 max-w-xs mx-auto">
                    {gradeConfig[selectedDream.grade].desc}
                  </p>
                </CardHeader>

                <CardContent className="text-center pb-10 px-6">
                  {/* Score Gauge */}
                  <div className="max-w-xs mx-auto mb-8 mt-4">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedDream.score}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${selectedDream.grade === 'great' ? 'from-yellow-400 to-orange-500' : selectedDream.grade === 'good' ? 'from-blue-400 to-indigo-500' : 'from-purple-400 to-pink-500'}`}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                      <span>기운 약함</span>
                      <span>강력한 에너지</span>
                    </div>
                  </div>

                  <div className="relative inline-block px-8 py-8 bg-white/5 rounded-3xl border border-white/10 w-full shadow-inner group">
                    <Quote className={`absolute top-6 left-6 w-8 h-8 ${gradeConfig[selectedDream.grade].color} opacity-20`} />
                    <p className="text-lg md:text-2xl text-slate-100 leading-relaxed font-medium">
                      {selectedDream.interpretation}
                    </p>
                    <Quote className={`absolute bottom-6 right-6 w-8 h-8 ${gradeConfig[selectedDream.grade].color} opacity-20 rotate-180`} />
                  </div>
                </CardContent>
              </Card>

              {/* Detail Analysis Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white/5 border-white/10 hover:border-primary/30 transition-all group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50" />
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    <CardTitle className="text-lg">전통적 의미</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {selectedDream.traditionalMeaning}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 hover:border-primary/30 transition-all group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                      <BrainCircuit className="w-5 h-5 text-blue-500" />
                    </div>
                    <CardTitle className="text-lg">심리학적 분석</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {selectedDream.psychologicalMeaning}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={() => setSelectedDream(null)}
                  variant="outline" 
                  className="flex-1 h-14 rounded-2xl border-white/10 hover:bg-white/5 text-lg"
                >
                  다른 꿈 검색하기
                </Button>
                <Button 
                  className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg shadow-primary/20"
                >
                  결과 공유하기
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {searchTerm.trim() || activeCategory ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold text-slate-400">
                      {activeCategory 
                        ? `${categories.find(c => c.id === activeCategory)?.name} 카테고리 결과` 
                        : `'${searchTerm}' 검색 결과`}
                      <span className="ml-2 text-primary">{filteredDreams.length}건</span>
                    </h3>
                    {(searchTerm || activeCategory) && (
                      <button onClick={clearSearch} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
                        초기화 <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {filteredDreams.length > 0 ? (
                      filteredDreams.map((dream, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => handleSelectDream(dream)}
                          className="group flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${gradeConfig[dream.grade].bg} border ${gradeConfig[dream.grade].border}`}>
                              {React.createElement(gradeConfig[dream.grade].icon, {
                                className: `w-6 h-6 ${gradeConfig[dream.grade].color}`
                              })}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                  {dream.keyword} 꿈
                                </h3>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ${gradeConfig[dream.grade].color}`}>
                                  {gradeConfig[dream.grade].label}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {dream.interpretation}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all" />
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg text-slate-400">검색 결과가 없습니다.</p>
                        <p className="text-sm text-slate-500 mt-2">다른 키워드로 검색해 보세요.</p>
                      </div>
                    )}
                  </div>
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
                        { label: "불나는 꿈", key: "불이 나는 꿈" },
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
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DreamInterpretation;
