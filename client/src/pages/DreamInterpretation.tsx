import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { dreamData, defaultDream, DreamData } from '../data/dream-data';

const DreamInterpretation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDream, setSelectedDream] = useState<DreamData | null>(null);

  const filteredDreams = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return Object.values(dreamData).filter((dream) =>
      dream.keyword.includes(searchTerm.trim())
    );
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredDreams.length > 0) {
      setSelectedDream(filteredDreams[0]);
    } else if (searchTerm.trim()) {
      setSelectedDream(defaultDream);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>꿈해몽 검색 - 무운</title>
        <meta name="description" content="어젯밤 꾼 꿈의 의미가 궁금하신가요? 무운 꿈해몽에서 키워드로 쉽고 빠르게 해몽 결과를 확인하세요." />
        <link rel="canonical" href="https://muunsaju.com/dream" />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
            무운 꿈해몽
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            궁금한 꿈의 키워드를 입력해 보세요.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="예: 돼지, 불, 물, 돈..."
              className="w-full px-6 py-4 text-lg rounded-full border-2 border-indigo-100 focus:border-indigo-500 focus:outline-none shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-8 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors font-bold"
            >
              검색
            </button>
          </div>
        </form>

        {searchTerm.trim() && filteredDreams.length > 0 && !selectedDream && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">추천 검색어</h2>
            <div className="flex flex-wrap gap-2">
              {filteredDreams.map((dream) => (
                <button
                  key={dream.keyword}
                  onClick={() => setSelectedDream(dream)}
                  className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  # {dream.keyword}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedDream && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-indigo-600 px-8 py-6 text-white text-center">
              <h2 className="text-2xl font-bold">'{selectedDream.keyword === '기본' ? searchTerm : selectedDream.keyword}' 꿈해몽 결과</h2>
            </div>
            <div className="p-8 space-y-8">
              <section>
                <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center">
                  <span className="mr-2">💡</span> 현대적 해석
                </h3>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
                  {selectedDream.interpretation}
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                  <h3 className="text-md font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center">
                    <span className="mr-2">📜</span> 전통적 의미
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {selectedDream.traditional}
                  </p>
                </section>

                <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <h3 className="text-md font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center">
                    <span className="mr-2">🧠</span> 심리학적 분석
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {selectedDream.psychological}
                  </p>
                </section>
              </div>

              <div className="pt-6 text-center border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => {
                    setSelectedDream(null);
                    setSearchTerm('');
                  }}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  다른 꿈 검색하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DreamInterpretation;
