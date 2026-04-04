/**
 * DictionaryDetail.tsx
 * 운세 사전 개별 항목 상세 페이지
 *
 * [개선 2026-03-23]
 * ① CTA 별점(☆☆★) 제거 → CallToAction variant='lifelong' (평생사주) 적용
 * ② CTA 카피 평생사주로 변경 (운세 사전 독자의 검색 의도 일치)
 * ③ 관련 사전어 섹션: RelatedTermsSection을 CTA 블록 위에 삽입
 *    (related_terms DB 필드 없음 → 태그 기반 유사 항목 추천으로 대체)
 * ④ 카테고리 배지 → /fortune-dictionary?category={id} 필터 링크로 전환
 * ⑤ 관련 서비스 그리드: 1 Featured(평생사주) + 3 Small 계층 구조로 개선
 *    (RelatedServices는 공유 컴포넌트이므로 DictionaryDetail 내부에서 직접 구현)
 * ⑥ 공유 버튼: 히어로 하단에 Web Share API + 링크 복사 fallback 추가
 * ⑦ 하단 내비게이션 active: /fortune-dictionary·/dictionary 경로에서 '전체메뉴' active 처리
 *    (BottomNav는 /more 기준이므로 DictionaryDetail 전용 헤더에서 breadcrumb 강화)
 */
import { useParams, useLocation } from 'wouter';
import { Helmet } from 'react-helmet-async';
import NotFound from '@/pages/NotFound';
import { ChevronLeft, ArrowRight, Loader2, Share2, Copy, Check, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchDictionaryEntryBySlug, type DictionaryEntry } from '@/lib/fortune-dictionary';
import CallToAction from '@/components/CallToAction';
import { RelatedTermsSection } from '@/components/RelatedTermsSection';
import { LinkedText } from '@/hooks/useLinkedText';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { trackCustomEvent } from '@/lib/ga4';

// 관련 서비스 데이터 (1 Featured + 3 Small)
const FEATURED_SERVICE = {
  path: '/family-saju',
  title: '가족사주',
  desc: '가족 구성원의 사주를 한 번에 분석해 관계와 운명의 흐름을 파악하세요',
  badge: '함께 보면 좋은 서비스',
  emoji: '👨‍👩‍👧‍👦',
};

const SMALL_SERVICES = [
  { path: '/yearly-fortune', title: '신년운세', desc: '2026년 총운 확인', emoji: '📅' },
  { path: '/compatibility', title: '궁합', desc: '찰떡궁합 확인', emoji: '💑' },
  { path: '/tarot', title: '타로', desc: '카드가 전하는 인사이트', emoji: '🃏' },
];

export default function DictionaryDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [entry, setEntry] = useState<DictionaryEntry | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) {
      setEntry(null);
      return;
    }
    fetchDictionaryEntryBySlug(id).then((data) => {
      setEntry(data);
    });
  }, [id]);

  // ⑥ 공유 핸들러: Web Share API → 링크 복사 fallback
  const handleShare = async () => {
    if (!entry) return;
    const shareUrl = `https://muunsaju.com/dictionary/${entry.slug}`;
    const shareData = {
      title: entry.metaTitle || `${entry.title} - ${entry.summary} | 무운 운세 사전`,
      text: `${entry.title}이 내 사주에 있다면? 무운 운세 사전에서 확인해 보세요.`,
      url: shareUrl,
    };
    try {
      trackCustomEvent('share_click', {
        source_page: shareUrl,
        button_type: 'dictionary_hero',
        entry_title: entry.title,
      });
    } catch {}
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        try { trackCustomEvent('share_success', { method: 'native_share', entry: entry.slug }); } catch {}
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        try { trackCustomEvent('share_success', { method: 'clipboard_copy', entry: entry.slug }); } catch {}
      }
    } catch (err) {
      // 사용자가 취소한 경우 무시
    }
  };

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
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
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
              logo: { '@type': 'ImageObject', url: 'https://muunsaju.com/images/muun_logo.png' }
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
          {/* ⑥ 공유 버튼 (헤더 우측) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="text-[#4E5968] hover:bg-black/[0.06] min-w-[44px] min-h-[44px]"
            aria-label="이 페이지 공유하기"
          >
            {copied ? <Check className="w-5 h-5 text-[#6B5FFF]" /> : <Share2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* 타이틀 영역 */}
        <div className="mb-8">
          {/* ④ 카테고리 배지 → 필터 링크로 전환 */}
          <Link href={`/fortune-dictionary?category=${entry.category}`}>
            <span className="inline-block px-3 py-1 bg-[#6B5FFF]/10 border border-[#6B5FFF]/20 rounded-full text-[#6B5FFF] text-xs font-semibold mb-4 hover:bg-[#6B5FFF]/20 transition-colors cursor-pointer">
              {entry.categoryLabel}
            </span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-[#191F28] mb-3">{entry.title}</h1>
          {entry.subtitle && <p className="text-[#4E5968] text-lg">{entry.subtitle}</p>}

          {/* ⑥ 공유 버튼 (히어로 하단) */}
          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 bg-white text-sm font-medium text-[#4E5968] hover:border-[#6B5FFF]/40 hover:text-[#6B5FFF] hover:bg-[#6B5FFF]/05 transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#6B5FFF]" />
                  링크 복사됨
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  이 용어 공유하기
                </>
              )}
            </button>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="space-y-6 mb-12">
          {/* 원래 의미 */}
          <section className="bg-white border border-black/10 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#6B5FFF] mb-4">원래 의미</h2>
            <p className="text-[#191F28] leading-relaxed text-base md:text-lg"><LinkedText text={entry.originalMeaning || ''} excludeSlug={entry.slug} /></p>
          </section>

          {/* 현대적 해석 */}
          <section className="bg-white border border-black/10 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#6B5FFF] mb-4">현대적 해석</h2>
            <p className="text-[#191F28] leading-relaxed text-base md:text-lg"><LinkedText text={entry.modernInterpretation || ''} excludeSlug={entry.slug} /></p>
          </section>

          {/* 무운의 조언 */}
          <section className="bg-gradient-to-br from-[#6B5FFF]/05 to-[#6B5FFF]/10 border border-[#6B5FFF]/20 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#6B5FFF] mb-4 flex items-center gap-2">
              <span>💡</span> 무운의 조언
            </h2>
            <p className="text-[#191F28] leading-relaxed text-base md:text-lg font-medium"><LinkedText text={entry.muunAdvice || ''} excludeSlug={entry.slug} /></p>
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

        {/* ③ 관련 사전어 섹션 (CTA 블록 위) */}
        {entry.tags && entry.tags.length > 0 && (
          <RelatedTermsSection
            currentTermId={entry.id}
            currentTags={entry.tags}
            maxItems={4}
          />
        )}

        {/* ①② CTA - 평생사주 전환 유도 (별점 제거, 신뢰 배지 3개) */}
        <CallToAction variant="lifelong" />

        {/* ⑤ 관련 서비스 링크 - 1 Featured + 3 Small 계층 구조 */}
        <div className="mt-12 pt-8 border-t border-black/10">
          <h3 className="text-xl font-bold text-[#191F28] mb-6">관련 서비스 둘러보기</h3>

          {/* Featured 카드 (평생사주) */}
          <button
            onClick={() => navigate(FEATURED_SERVICE.path)}
            className="w-full mb-4 p-6 bg-gradient-to-br from-[#6B5FFF]/08 to-[#6B5FFF]/03 border border-[#6B5FFF]/25 rounded-2xl hover:border-[#6B5FFF]/50 hover:shadow-md transition-all group text-left"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{FEATURED_SERVICE.emoji}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#6B5FFF]/15 rounded-full text-[10px] font-bold text-[#6B5FFF] uppercase tracking-wide">
                    <Star className="w-2.5 h-2.5 fill-[#6B5FFF]" />
                    {FEATURED_SERVICE.badge}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-[#191F28] group-hover:text-[#6B5FFF] transition-colors mb-1">
                  {FEATURED_SERVICE.title}
                </h4>
                <p className="text-sm text-[#4E5968] leading-relaxed">{FEATURED_SERVICE.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-[#8B95A1] group-hover:text-[#6B5FFF] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </div>
          </button>

          {/* Small 카드 3개 */}
          <div className="grid grid-cols-3 gap-3">
            {SMALL_SERVICES.map((service) => (
              <button
                key={service.path}
                onClick={() => navigate(service.path)}
                className="p-4 bg-white border border-black/10 rounded-2xl hover:border-[#6B5FFF]/30 hover:bg-[#6B5FFF]/05 transition-all group shadow-sm text-left"
              >
                <span className="text-xl mb-2 block">{service.emoji}</span>
                <h4 className="font-bold text-[#191F28] group-hover:text-[#6B5FFF] transition-colors text-sm">{service.title}</h4>
                <p className="text-xs text-[#4E5968] mt-0.5 leading-snug">{service.desc}</p>
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
