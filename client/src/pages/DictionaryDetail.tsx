import { useParams, useLocation } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { fortuneDictionary } from '@/lib/fortune-dictionary';
import { Button } from '@/components/ui/button';

export default function DictionaryDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  // URL에서 slug 추출 (예: /dictionary/dohwa-sal) 또는 id 기반 호환성 유지
  const entry = fortuneDictionary.find((e) => e.slug === id || e.id === id);

  if (!entry) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">찾을 수 없는 페이지입니다</h1>
          <Button onClick={() => navigate('/fortune-dictionary')} className="bg-purple-600 hover:bg-purple-700">
            운세 사전으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{entry.title} - {entry.summary} | 무운(Muun) 사주 사전</title>
        <meta name="description" content={`${entry.title}이 내 사주에 있다면 어떤 의미일까요? 20년 경력 역술가의 깊이 있는 통찰로 ${entry.title}의 현대적 해석과 대처법을 확인해 보세요.`} />
        <meta property="og:title" content={`${entry.title} - ${entry.summary} | 무운`} />
        <meta property="og:description" content={`${entry.title}이 내 사주에 있다면 어떤 의미일까요? 20년 경력 역술가의 깊이 있는 통찰로 ${entry.title}의 현대적 해석과 대처법을 확인해 보세요.`} />
        <meta name="keywords" content={`${entry.title}, ${entry.summary}, ${entry.categoryLabel}, 사주, 운세, ${entry.tags?.join(', ')}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://muunsaju.com/dictionary/${entry.slug}`} />
        <link rel="canonical" href={`https://muunsaju.com/dictionary/${entry.slug}`} />
      </Helmet>

      <div className="min-h-screen bg-black py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* DefinedTerm Schema Markup */}
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'DefinedTerm',
              name: entry.title,
              description: entry.modernInterpretation,
              inDefinedTermSet: 'https://muunsaju.com/fortune-dictionary',
              url: `https://muunsaju.com/dictionary/${entry.slug}`,
              author: {
                '@type': 'Organization',
                name: '무운(Muun)',
                url: 'https://muunsaju.com',
              },
            })}
          </script>

          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => navigate('/fortune-dictionary')}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition mb-8"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>운세 사전으로 돌아가기</span>
          </button>

          {/* 헤더 */}
          <div className="mb-8">
            <div className="inline-block px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-400 text-xs font-semibold mb-4">
              {entry.categoryLabel}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{entry.title}</h1>
            {entry.subtitle && <p className="text-slate-400 text-lg">{entry.subtitle}</p>}
          </div>

          {/* 콘텐츠 */}
          <div className="space-y-8">
            {/* 원래 의미 */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-400 mb-4">원래 의미</h2>
              <p className="text-slate-300 leading-relaxed text-base">{entry.originalMeaning}</p>
            </section>

            {/* 현대적 해석 */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-400 mb-4">현대적 해석</h2>
              <p className="text-slate-300 leading-relaxed text-base">{entry.modernInterpretation}</p>
            </section>

            {/* 무운의 조언 */}
            <section className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-400 mb-4">💡 무운의 조언</h2>
              <p className="text-slate-200 leading-relaxed text-base">{entry.muunAdvice}</p>
            </section>

            {/* 관련 키워드 */}
            {entry.tags && entry.tags.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">관련 키워드</h3>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* 관련 서비스 링크 */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-6">관련 서비스 둘러보기</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/yearly-fortune')}
                className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-purple-500 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="font-semibold text-white group-hover:text-purple-400 transition">신년운세</h4>
                    <p className="text-sm text-slate-400">2026년 총운 확인</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition" />
                </div>
              </button>

              <button
                onClick={() => navigate('/lifelong-saju')}
                className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-purple-500 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="font-semibold text-white group-hover:text-purple-400 transition">평생사주</h4>
                    <p className="text-sm text-slate-400">타고난 기질과 운명</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition" />
                </div>
              </button>

              <button
                onClick={() => navigate('/compatibility')}
                className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-purple-500 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="font-semibold text-white group-hover:text-purple-400 transition">궁합</h4>
                    <p className="text-sm text-slate-400">찰떡궁합 확인</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition" />
                </div>
              </button>

              <button
                onClick={() => navigate('/tarot')}
                className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-purple-500 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="font-semibold text-white group-hover:text-purple-400 transition">AI 타로</h4>
                    <p className="text-sm text-slate-400">AI가 답하는 타로</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition" />
                </div>
              </button>
            </div>
          </div>

          {/* 다른 용어 탐색 */}
          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate('/fortune-dictionary')}
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              다른 용어 탐색하기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
