import React, { useState, useMemo } from 'react';
import { Search, BrainCircuit, Sparkles, BookOpen, Heart, CloudMoon, ArrowRight, Info } from 'lucide-react';
import { dreamData, defaultDream, DreamData } from '../data/dream-data';
import { Helmet } from 'react-helmet-async';

const DreamInterpretation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDream, setSelectedDream] = useState<DreamData | null>(null);

  const filteredDreams = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return Object.keys(dreamData)
      .filter(key => key.includes(searchTerm.trim()))
      .map(key => dreamData[key]);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedDream(null);
  };

  const handleSelectDream = (dream: DreamData) => {
    setSelectedDream(dream);
    setSearchTerm(dream.keyword);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Helmet>
        <title>꿈해몽 검색 - 무운(muun)</title>
        <meta name="description" content="2,000개 이상의 데이터를 기반으로 한 무료 꿈해몽 서비스. 당신의 꿈속에 숨겨진 의미를 찾아보세요." />
      </Helmet>

      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-400 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/20">
            <CloudMoon className="w-8 h-8 text-purple-200" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">꿈해몽 검색</h1>
          <p className="text-lg text-purple-100/80 mb-8 max-w-2xl mx-auto">
            어젯밤 꿈속에 나타난 상징들은 무엇을 의미할까요?<br />
            무운의 방대한 데이터로 당신의 무의식을 탐험해보세요.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="꿈속의 키워드를 입력하세요 (예: 돼지, 물, 불...)"
              className="block w-full pl-14 pr-4 py-5 bg-white border-none rounded-2xl text-slate-900 text-lg shadow-2xl focus:ring-4 focus:ring-purple-500/30 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        {/* Search Results Dropdown */}
        {searchTerm && !selectedDream && filteredDreams.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> 연관 검색어
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {filteredDreams.map((dream) => (
                <button
                  key={dream.keyword}
                  onClick={() => handleSelectDream(dream)}
                  className="w-full text-left px-6 py-4 hover:bg-purple-50 flex items-center justify-between group transition-colors border-b border-slate-50 last:border-0"
                >
                  <span className="text-slate-700 font-medium group-hover:text-purple-700">{dream.keyword}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Dream Result */}
        {selectedDream ? (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Main Result Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">꿈해몽 결과</span>
                  <h2 className="text-3xl font-bold text-slate-900">{selectedDream.keyword} 꿈</h2>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-3xl border border-purple-100 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-purple-900 mb-2">종합 해석</h3>
                      <p className="text-slate-700 leading-relaxed text-lg">
                        {selectedDream.interpretation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-bold text-slate-900">전통적 의미</h4>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {selectedDream.traditional}
                    </p>
                  </div>
                  
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <Heart className="w-5 h-5 text-rose-500" />
                      <h4 className="font-bold text-slate-900">심리학적 분석</h4>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {selectedDream.psychological}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 p-6 text-center">
                <button 
                  onClick={() => {setSearchTerm(''); setSelectedDream(null);}}
                  className="text-purple-300 hover:text-white font-medium flex items-center gap-2 mx-auto transition-colors"
                >
                  <Search className="w-4 h-4" /> 다른 꿈 검색하기
                </button>
              </div>
            </div>

            {/* Guide Tip */}
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                <strong>꿈해몽 팁:</strong> 꿈은 그날의 컨디션이나 환경에 따라 다르게 해석될 수 있습니다. 
                너무 맹신하기보다는 자신의 내면을 돌아보는 계기로 삼아보세요.
              </p>
            </div>
          </div>
        ) : searchTerm && filteredDreams.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BrainCircuit className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">'{searchTerm}'에 대한 결과를 찾지 못했습니다</h3>
            <p className="text-slate-500 mb-8">다른 키워드로 검색해보시거나, 핵심 단어 위주로 입력해보세요.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["돼지", "물", "불", "뱀", "돈", "똥"].map(tag => (
                <button 
                  key={tag}
                  onClick={() => handleSelectDream(dreamData[tag])}
                  className="px-4 py-2 bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 rounded-full text-sm transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Initial View - Popular Keywords */
          <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" /> 많이 찾는 꿈해몽 키워드
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["물", "불", "뱀", "돈", "똥", "조상", "이빨 빠지는 꿈", "대통령"].map(keyword => (
                <button
                  key={keyword}
                  onClick={() => handleSelectDream(dreamData[keyword])}
                  className="p-4 bg-slate-50 hover:bg-white hover:shadow-md hover:border-purple-200 border border-slate-100 rounded-2xl text-left group transition-all"
                >
                  <div className="text-slate-800 font-semibold mb-1 group-hover:text-purple-700">{keyword}</div>
                  <div className="text-xs text-slate-400">해석 보기</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DreamInterpretation;
