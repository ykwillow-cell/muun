import React, { useState, useMemo, useEffect } from 'react';
import { Search, BrainCircuit, Sparkles, BookOpen, Heart, CloudMoon, ArrowRight, Info, ChevronRight, Quote, Zap, Star, X } from 'lucide-react';
import { dreamData, defaultDream, DreamData } from '../data/dream-data';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCanonical } from '@/lib/use-canonical';

const DreamInterpretation: React.FC = () => {
  useCanonical('/dream');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDream, setSelectedDream] = useState<DreamData | null>(null);

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
  }, [searchTerm]);

  const handleSelectDream = (dream: DreamData) => {
    setSelectedDream(dream);
    // 결과 선택 시 검색창이 가려지지 않도록 상단으로 스크롤하되, 약간의 여백을 둠
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
    const exactMatch = Object.values(dreamData).find(d => d.keyword === tag);
    if (exactMatch) {
      handleSelectDream(exactMatch);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedDream(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
      <Helmet>
        <title>[가입X/100%무료] 꿈해몽 검색 - 무운</title>
        <meta name="description" content="가입/결제 없이 2,000개 이상의 방대한 데이터로 당신의 꿈을 무료로 해몽해 보세요. 돼지꿈, 불나는 꿈, 조상님 꿈 등 모든 꿈의 의미를 분석해 드립니다." />
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
        {/* Search Bar Section - Removed sticky property as requested */}
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

        <AnimatePresence mode="wait">
          {selectedDream ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Result Header Card */}
              <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-purple-900/20 via-card to-background shadow-2xl relative">
                <div className="absolute top-0 right-0 p-4">
                  <Sparkles className="w-6 h-6 text-primary/40 animate-pulse" />
                </div>
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/20 rounded-full border border-primary/30">
                      <CloudMoon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-white mb-2">
                    {selectedDream.keyword} 꿈의 해석
                  </CardTitle>
                  <p className="text-primary font-medium">당신의 무의식이 보내는 특별한 메시지</p>
                </CardHeader>
                <CardContent className="text-center pb-8 px-6">
                  <div className="relative inline-block px-8 py-6 mt-4 bg-white/5 rounded-3xl border border-white/10 w-full">
                    <Quote className="absolute top-4 left-4 w-6 h-6 text-primary/30" />
                    <p className="text-lg md:text-xl text-slate-200 leading-relaxed italic">
                      {selectedDream.interpretation}
                    </p>
                    <Quote className="absolute bottom-4 right-4 w-6 h-6 text-primary/30 rotate-180" />
                  </div>
                </CardContent>
              </Card>

              {/* Detail Analysis Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white/5 border-white/10 hover:border-primary/30 transition-all group">
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

                <Card className="bg-white/5 border-white/10 hover:border-primary/30 transition-all group">
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
              {searchTerm.trim() ? (
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
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <CloudMoon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                              {dream.keyword} 꿈
                            </h3>
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                      <Zap className="w-5 h-5 text-yellow-500" /> 많이 찾는 꿈
                    </h2>
                    <div className="grid grid-cols-1 gap-2">
                      {["돼지꿈", "돈 받는 꿈", "불나는 꿈", "조상님 꿈"].map((dream, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleTagClick(dream.replace('꿈', '').trim())}
                          className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all text-left group"
                        >
                          <span className="text-slate-300 group-hover:text-primary transition-colors">{dream}</span>
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
