import { useParams, useLocation } from 'wouter';
import { Helmet } from 'react-helmet-async';
import NotFound from '@/pages/NotFound';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchDictionaryEntryBySlug, type DictionaryEntry } from '@/lib/fortune-dictionary';
import CallToAction from '@/components/CallToAction';
import { Button } from '@/components/ui/button';

export default function DictionaryDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [entry, setEntry] = useState<DictionaryEntry | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setEntry(null);
      return;
    }
    fetchDictionaryEntryBySlug(id).then((data) => {
      setEntry(data);
    });
  }, [id]);

  // 로딩 중
  if (entry === undefined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#999891] text-lg">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <title>{entry.metaTitle || `${entry.title} - ${entry.summary} | 무운(Muun) 사주 사전`}</title>
        <meta name="description" content={entry.metaDescription || `${entry.title}이 내 사주에 있다면 어떤 의미일까요? 20년 경력 역술가의 깊이 있는 통찰로 ${entry.title}의 현대적 해석과 대처법을 확인해 보세요.`} />
        <meta property="og:title" content={entry.metaTitle || `${entry.title} - ${entry.summary} | 무운`} />
        <meta property="og:description" content={entry.metaDescription || `${entry.title}이 내 사주에 있다면 어떤 의미일까요? 20년 경력 역술가의 깊이 있는 통찰로 ${entry.title}의 현대적 해석과 대처법을 확인해 보세요.`} />
        <meta name="keywords" content={`${entry.title}, ${entry.summary}, ${entry.categoryLabel}, 사주, 운세, ${(entry.tags || []).join(', ')}`} />
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
            <h1 className="text-4xl font-bold text-[#1a1a18] mb-2">{entry.title}</h1>
            {entry.subtitle && <p className="text-[#999891] text-lg">{entry.subtitle}</p>}
          </div>

          {/* 콘텐츠 */}
          <div className="space-y-8">
            {/* 원래 의미 */}
            <section className="bg-[#f5f4ef] border border-black/10 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-400 mb-4">원래 의미</h2>
              <p className="text-[#1a1a18] leading-relaxed text-base">{entry.originalMeaning}</p>
            </section>

            {/* 현대적 해석 */}
            <section className="bg-[#f5f4ef] border border-black/10 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-400 mb-4">현대적 해석</h2>
              <p className="text-[#1a1a18] leading-relaxed text-base">{entry.modernInterpretation}</p>
            </section>

            {/* 무운의 조언 */}
            <section className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-400 mb-4">💡 무운의 조언</h2>
              <p className="text-[#1a1a18] leading-relaxed text-base">{entry.muunAdvice}</p>
            </section>

            {/* 관련 키워드 */}
            {entry.tags && entry.tags.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-[#999891] uppercase tracking-wide mb-3">관련 키워드</h3>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-[#f5f4ef] border border-black/10 rounded-full text-sm text-[#5a5a56]">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* CTA - 무료 운세 전환 유도 */}
          <CallToAction
            message="오늘 나의 운세도 확인해 보세요"
            targetPath="/daily-fortune"
          />

          {/* 관련 서비스 링크 */}
          <div className="mt-12 pt-8 border-t border-black/10">
            <h3 className="text-lg font-semibold text-[#1a1a18] mb-6">관련 서비스 둘러보기</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/yearly-fortune')}
                className="p-4 bg-[#f5f4ef] border border-black/10 rounded-lg hover:border-black/20 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="font-semibold text-[#1a1a18] group-hover:text-purple-400 transition">신년운세</h4>
                    <p className="text-sm text-[#999891]">2026년 총운 확인</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#5a5a56] group-hover:text-[#1a1a18] transition" />
                </div>
              </button>

              <button
                onClick={() => navigate('/lifelong-saju')}
                className="p-4 bg-[#f5f4ef] border border-black/10 rounded-lg hover:border-black/20 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="font-semibold text-[#1a1a18] group-hover:text-purple-400 transition">평생사주</h4>
                    <p className="text-sm text-[#999891]">타고난 기질과 운명</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#5a5a56] group-hover:text-[#1a1a18] transition" />
                </div>
              </button>

              <button
                onClick={() => navigate('/compatibility')}
                className="p-4 bg-[#f5f4ef] border border-black/10 rounded-lg hover:border-black/20 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="font-semibold text-[#1a1a18] group-hover:text-purple-400 transition">궁합</h4>
                    <p className="text-sm text-[#999891]">찰떡궁합 확인</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#5a5a56] group-hover:text-[#1a1a18] transition" />
                </div>
              </button>

              <button
                onClick={() => navigate('/tarot')}
                className="p-4 bg-[#f5f4ef] border border-black/10 rounded-lg hover:border-black/20 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="font-semibold text-[#1a1a18] group-hover:text-purple-400 transition">타로</h4>
                    <p className="text-sm text-[#999891]">카드가 전하는 인사이트</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#5a5a56] group-hover:text-[#1a1a18] transition" />
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
