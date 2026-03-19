import { useParams, useLocation } from 'wouter';
import { Helmet } from 'react-helmet-async';
import NotFound from '@/pages/NotFound';
import { ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchDictionaryEntryBySlug, type DictionaryEntry } from '@/lib/fortune-dictionary';
import CallToAction from '@/components/CallToAction';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

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
      <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!entry) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28]">
      <Helmet>
        <title>{entry.metaTitle || `${entry.title} - ${entry.summary} | 무운(MuUn) 사주 사전`}</title>
        <meta name="description" content={entry.metaDescription || `${entry.title}이 내 사주에 있다면 어떤 의미일까요? 20년 경력 역술가의 깊이 있는 통찰로 ${entry.title}의 현대적 해석과 대처법을 확인해 보세요.`} />
        <meta property="og:title" content={entry.metaTitle || `${entry.title} - ${entry.summary} | 무운`} />
        <meta property="og:description" content={entry.metaDescription || `${entry.title}이 내 사주에 있다면 어떤 의미일까요? 20년 경력 역술가의 깊이 있는 통찰로 ${entry.title}의 현대적 해석과 대처법을 확인해 보세요.`} />
        <meta name="keywords" content={`${entry.title}, ${entry.summary}, ${entry.categoryLabel}, 사주, 운세, ${(entry.tags || []).join(', ')}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://muunsaju.com/dictionary/${entry.slug}`} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={`https://muunsaju.com/dictionary/${entry.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'DefinedTerm',
            name: entry.title,
            description: entry.modernInterpretation,
            inDefinedTermSet: 'https://muunsaju.com/fortune-dictionary',
            url: `https://muunsaju.com/dictionary/${entry.slug}`,
            author: { '@type': 'Organization', name: '무운(MuUn)', url: 'https://muunsaju.com' },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${entry.title} - ${entry.summary}`,
            description: entry.metaDescription || `${entry.title}이 내 사주에 있다면 어떤 의미일까요?`,
            url: `https://muunsaju.com/dictionary/${entry.slug}`,
            mainEntityOfPage: { '@type': 'WebPage', '@id': `https://muunsaju.com/dictionary/${entry.slug}` },
            author: { '@type': 'Organization', name: '무운 (MuUn)', url: 'https://muunsaju.com' },
            publisher: {
              '@type': 'Organization',
              name: '무운 (MuUn)',
              url: 'https://muunsaju.com',
              logo: { '@type': 'ImageObject', url: 'https://muunsaju.com/logo.png' }
            },
            keywords: `${entry.title}, ${entry.categoryLabel}, 사주, 운세, ${(entry.tags || []).join(', ')}`,
            articleSection: '운세 사전'
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '홈', item: 'https://muunsaju.com' },
              { '@type': 'ListItem', position: 2, name: '운세 사전', item: 'https://muunsaju.com/fortune-dictionary' },
              { '@type': 'ListItem', position: 3, name: entry.title, item: `https://muunsaju.com/dictionary/${entry.slug}` }
            ]
          })}
        </script>
      </Helmet>

      {/* 헤더 */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/fortune-dictionary">
            <Button variant="ghost" size="icon" className="text-[#191F28] hover:bg-black/[0.06] min-w-[44px] min-h-[44px]">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <span className="text-sm font-semibold text-[#4E5968]">운세 사전</span>
          <div className="w-11" /> {/* Spacer for centering */}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* 타이틀 영역 */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-[#6B5FFF]/10 border border-[#6B5FFF]/20 rounded-full text-[#6B5FFF] text-xs font-semibold mb-4">
            {entry.categoryLabel}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#191F28] mb-3">{entry.title}</h1>
          {entry.subtitle && <p className="text-[#4E5968] text-lg">{entry.subtitle}</p>}
        </div>

        {/* 콘텐츠 영역 */}
        <div className="space-y-6 mb-12">
          {/* 원래 의미 */}
          <section className="bg-white border border-black/10 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#6B5FFF] mb-4">원래 의미</h2>
            <p className="text-[#191F28] leading-relaxed text-base md:text-lg">{entry.originalMeaning}</p>
          </section>

          {/* 현대적 해석 */}
          <section className="bg-white border border-black/10 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#6B5FFF] mb-4">현대적 해석</h2>
            <p className="text-[#191F28] leading-relaxed text-base md:text-lg">{entry.modernInterpretation}</p>
          </section>

          {/* 무운의 조언 */}
          <section className="bg-gradient-to-br from-[#6B5FFF]/05 to-[#6B5FFF]/10 border border-[#6B5FFF]/20 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#6B5FFF] mb-4 flex items-center gap-2">
              <span>💡</span> 무운의 조언
            </h2>
            <p className="text-[#191F28] leading-relaxed text-base md:text-lg font-medium">{entry.muunAdvice}</p>
          </section>

          {/* 관련 키워드 */}
          {entry.tags && entry.tags.length > 0 && (
            <section className="pt-4">
              <h3 className="text-sm font-semibold text-[#8B95A1] uppercase tracking-wider mb-4">관련 키워드</h3>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="px-4 py-1.5 bg-white border border-black/10 rounded-full text-sm text-[#4E5968] font-medium shadow-sm">
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
          <h3 className="text-xl font-bold text-[#191F28] mb-6">관련 서비스 둘러보기</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { path: '/yearly-fortune', title: '신년운세', desc: '2026년 총운 확인' },
              { path: '/lifelong-saju', title: '평생사주', desc: '타고난 기질과 운명' },
              { path: '/compatibility', title: '궁합', desc: '찰떡궁합 확인' },
              { path: '/tarot', title: '타로', desc: '카드가 전하는 인사이트' }
            ].map((service) => (
              <button
                key={service.path}
                onClick={() => navigate(service.path)}
                className="p-5 bg-white border border-black/10 rounded-2xl hover:border-[#6B5FFF]/30 hover:bg-[#6B5FFF]/05 transition-all group shadow-sm text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#191F28] group-hover:text-[#6B5FFF] transition-colors">{service.title}</h4>
                    <p className="text-sm text-[#4E5968] mt-1">{service.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#8B95A1] group-hover:text-[#6B5FFF] group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 다른 용어 탐색 */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate('/fortune-dictionary')}
            variant="outline"
            className="rounded-full border-[#6B5FFF] text-[#6B5FFF] hover:bg-[#6B5FFF]/05 px-8 h-12 font-semibold"
          >
            다른 용어 탐색하기
          </Button>
        </div>
      </main>
    </div>
  );
}
