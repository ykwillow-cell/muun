import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import NotFound from '@/pages/NotFound';
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Clock, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getColumnBySlug, getLatestColumns, COLUMN_CATEGORIES, type ColumnData } from '@/lib/column-data-api';
import CallToAction from '@/components/CallToAction';
import RelatedServices from '@/components/RelatedServices';
import { Link } from 'wouter';
import { injectLinksIntoHtml } from '@/hooks/useLinkedText';

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const [column, setColumn] = useState<ColumnData | null>(null);
  const [relatedColumns, setRelatedColumns] = useState<ColumnData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useCanonical(`/guide/${id}`);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      if (id) {
        const [col, latest] = await Promise.all([
          getColumnBySlug(id),
          getLatestColumns(4),
        ]);
        setColumn(col);
        setRelatedColumns(latest.filter(c => c.slug !== id && c.id !== id).slice(0, 3));
      }
      setIsLoading(false);
    };
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-[#1a1a18] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!column) {
    return <NotFound />;
  }

  const categoryColor = COLUMN_CATEGORIES[column.category]?.color || 'bg-black/06 text-[#5a5a56]';
  const metaTitle = column.metaTitle || `${column.title} | 무운 (MuUn)`;
  const metaDescription = column.metaDescription || column.description;
  const canonicalUrl = column.canonicalUrl || `https://muunsaju.com/guide/${column.slug || column.id}`;
  const socialImage = column.thumbnail || 'https://muunsaju.com/images/horse_mascot.png';

  // 카테고리별 CTA 배너 설정
  const ctaConfig: Record<string, { message: string; targetPath: string; buttonLabel: string }> = {
    relationship: {
      message: '나와 어울리는 사람, 무료로 확인해보세요',
      targetPath: '/compatibility',
      buttonLabel: '무료 궁합 보러가기',
    },
    love: {
      message: '나와 어울리는 사람, 무료로 확인해보세요',
      targetPath: '/compatibility',
      buttonLabel: '무료 궁합 보러가기',
    },
    family: {
      message: '우리 가족의 운세를 함께 확인해보세요',
      targetPath: '/family-saju',
      buttonLabel: '가족사주 보러가기',
    },
  };
  const cta = ctaConfig[column.category] || {
    message: '타고난 기질과 운명, 지금 확인해 보세요',
    targetPath: '/lifelong-saju',
    buttonLabel: '평생사주 무료로 보기',
  };

  // 카테고리별 하단 추천 서비스 매핑
  type ServiceItem = { href: string; label: string; description: string; emoji: string };
  const relatedServicesMap: Record<string, ServiceItem[]> = {
    relationship: [
      { href: '/compatibility', label: '무료 궁합 풍이', description: '사주로 보는 두 사람의 콘테츠와 궁합을 분석합니다.', emoji: '💕' },
      { href: '/hybrid-compatibility', label: '사주×MBTI 궁합', description: '사주와 MBTI를 결합한 새로운 궁합 분석입니다.', emoji: '🧠' },
      { href: '/lifelong-saju', label: '무료 평생사주 풍이', description: '타고난 기질과 인생 전체의 운세 흐름을 분석합니다.', emoji: '🔮' },
    ],
    love: [
      { href: '/compatibility', label: '무료 궁합 풍이', description: '사주로 보는 두 사람의 콘테츠와 궁합을 분석합니다.', emoji: '💕' },
      { href: '/hybrid-compatibility', label: '사주×MBTI 궁합', description: '사주와 MBTI를 결합한 새로운 궁합 분석입니다.', emoji: '🧠' },
      { href: '/lifelong-saju', label: '무료 평생사주 풍이', description: '타고난 기질과 인생 전체의 운세 흐름을 분석합니다.', emoji: '🔮' },
    ],
    money: [
      { href: '/lifelong-saju', label: '무료 평생사주 풍이', description: '타고난 기질과 인생 전체의 운세 흐름을 분석합니다.', emoji: '🔮' },
      { href: '/yearly-fortune', label: '2026년 신년운세', description: '병오년 한 해의 재물운을 미리 확인하세요.', emoji: '📅' },
      { href: '/tojeong', label: '토정비결', description: '전통 토정비결으로 한 해의 운세를 확인합니다.', emoji: '📜' },
    ],
    career: [
      { href: '/lifelong-saju', label: '무료 평생사주 풍이', description: '타고난 기질과 인생 전체의 운세 흐름을 분석합니다.', emoji: '🔮' },
      { href: '/yearly-fortune', label: '2026년 신년운세', description: '병오년 한 해의 직장운을 미리 확인하세요.', emoji: '📅' },
      { href: '/tojeong', label: '토정비결', description: '전통 토정비결으로 한 해의 운세를 확인합니다.', emoji: '📜' },
    ],
    health: [
      { href: '/daily-fortune', label: '오늘의 운세', description: '오늘 하루의 기운과 건강운을 미리 확인하세요.', emoji: '☀️' },
      { href: '/lifelong-saju', label: '무료 평생사주 풍이', description: '타고난 기질과 인생 전체의 운세 흐름을 분석합니다.', emoji: '🔮' },
      { href: '/tarot', label: 'AI 타로 상담', description: '오늘 마음속 고민을 타로 카드로 풀어보세요.', emoji: '🎠' },
    ],
    luck: [
      { href: '/daily-fortune', label: '오늘의 운세', description: '오늘 하루의 기운과 행운을 미리 확인하세요.', emoji: '☀️' },
      { href: '/lifelong-saju', label: '무료 평생사주 풍이', description: '타고난 기질과 인생 전체의 운세 흐름을 분석합니다.', emoji: '🔮' },
      { href: '/tarot', label: 'AI 타로 상담', description: '오늘 마음속 고민을 타로 카드로 풀어보세요.', emoji: '🎠' },
    ],
    basic: [
      { href: '/lifelong-saju', label: '무료 평생사주 풍이', description: '타고난 기질과 인생 전체의 운세 흐름을 분석합니다.', emoji: '🔮' },
      { href: '/fortune-dictionary', label: '사주 사전', description: '사주팔자의 핵심 용어를 쉽고 재미있게 풀어드립니다.', emoji: '📖' },
      { href: '/yearly-fortune', label: '2026년 신년운세', description: '병오년 한 해의 운세 흐름을 미리 확인하세요.', emoji: '📅' },
    ],
    flow: [
      { href: '/lifelong-saju', label: '무료 평생사주 풍이', description: '타고난 기질과 인생 전체의 운세 흐름을 분석합니다.', emoji: '🔮' },
      { href: '/fortune-dictionary', label: '사주 사전', description: '사주팔자의 핵심 용어를 쉽고 재미있게 풀어드립니다.', emoji: '📖' },
      { href: '/yearly-fortune', label: '2026년 신년운세', description: '병오년 한 해의 운세 흐름을 미리 확인하세요.', emoji: '📅' },
    ],
    family: [
      { href: '/family-saju', label: '가족사주', description: '가족 구성원의 사주를 함께 분석합니다.', emoji: '👨‍👩‍👧‍👦' },
      { href: '/compatibility', label: '무료 궁합 풍이', description: '사주로 보는 두 사람의 콘테츠와 궁합을 분석합니다.', emoji: '💕' },
      { href: '/lifelong-saju', label: '무료 평생사주 풍이', description: '타고난 기질과 인생 전체의 운세 흐름을 분석합니다.', emoji: '🔮' },
    ],
  };
  const relatedServicesList = relatedServicesMap[column.category] || [
    { href: '/family-saju', label: '가족사주', description: '가족 구성원의 사주를 함께 분석하여 오행의 조화를 확인합니다.', emoji: '👨‍👩‍👧' },
    { href: '/yearly-fortune', label: '2026년 신년운세', description: '병오년 한 해의 운세 흐름을 미리 확인하세요.', emoji: '📅' },
    { href: '/daily-fortune', label: '오늘의 운세', description: '오늘 하루의 기운을 미리 확인하세요.', emoji: '☀️' },
  ];

  return (
    <div className="min-h-screen bg-background text-[#1a1a18]">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={column.keywords.join(', ')} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={socialImage} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="article:published_time" content={column.publishedDate} />
        <meta property="article:author" content={column.author} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={socialImage} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": column.title,
            "description": metaDescription,
            "url": canonicalUrl,
            "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
            "author": { "@type": "Person", "name": column.author },
            "datePublished": column.publishedDate,
            "dateModified": column.publishedDate,
            "image": { "@type": "ImageObject", "url": socialImage, "width": 1200, "height": 630 },
            "publisher": {
              "@type": "Organization",
              "name": "무운 (MuUn)",
              "url": "https://muunsaju.com",
              "logo": { "@type": "ImageObject", "url": "https://muunsaju.com/images/muun_logo.png" }
            },
            "keywords": column.keywords?.join(', '),
            "articleSection": "사주 칼럼"
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://muunsaju.com" },
              { "@type": "ListItem", "position": 2, "name": "칼럼", "item": "https://muunsaju.com/guide" },
              { "@type": "ListItem", "position": 3, "name": column.title, "item": canonicalUrl }
            ]
          })}
        </script>
      </Helmet>

      {/* 헤더 */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/guide">
            <Button variant="ghost" size="icon" className="text-[#1a1a18] hover:bg-black/[0.06] min-w-[44px] min-h-[44px]">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <span className="text-sm font-semibold text-[#5a5a56]">칼럼</span>
          <Button variant="ghost" size="icon" className="text-[#1a1a18] hover:bg-black/[0.06] min-w-[44px] min-h-[44px]">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* 썸네일 */}
        {column.thumbnail && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 bg-black/[0.05]"
          >
            <img
              src={column.thumbnail}
              alt={column.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </motion.div>
        )}

        {/* 메타 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColor}`}>
              {column.categoryLabel}
            </span>
            <span className="text-xs text-[#999891]">{column.author}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {column.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-[#999891] flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(column.publishedDate).toLocaleDateString('ko-KR', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {column.readTime}분 읽기
            </div>
          </div>
        </motion.div>

        {/* 본문 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose max-w-none mb-12 [&_p]:mb-5 [&_p]:leading-relaxed [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:mb-5 [&_ol]:mb-5 [&_li]:mb-2 [&_blockquote]:my-6 [&_hr]:my-8 [&_strong]:font-bold [&_em]:italic [&_p]:text-[#191f28] [&_h2]:text-[#191f28] [&_h3]:text-[#191f28] [&_li]:text-[#191f28] [&_blockquote]:text-[#4e5968] [&_blockquote]:border-l-primary/30"
          dangerouslySetInnerHTML={{ __html: injectLinksIntoHtml(column.content) }}
        />

        {/* CTA - 카테고리별 맞춤 전환 유도 */}
        <CallToAction
          message={cta.message}
          targetPath={cta.targetPath}
          buttonLabel={cta.buttonLabel}
        />
        {/* 관련 서비스 내부 링크 - 카테고리별 맞춤 */}
        <RelatedServices
          title="칼럼과 함께 보면 좋은 서비스"
          services={relatedServicesList}
        />

        {/* 관련 칼럼 */}
        {relatedColumns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6">관련 칼럼</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedColumns.map((relatedColumn) => (
                <Link key={relatedColumn.id} href={`/guide/${relatedColumn.slug || relatedColumn.id}`}>
                  <div className="group cursor-pointer bg-black/[0.05] border border-black/10 rounded-xl overflow-hidden hover:border-primary/30 hover:bg-black/[0.06] transition-all h-full">
                    {relatedColumn.thumbnail && (
                      <div className="aspect-video overflow-hidden bg-black/[0.05]">
                        <img
                          src={relatedColumn.thumbnail}
                          alt={relatedColumn.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${COLUMN_CATEGORIES[relatedColumn.category]?.color || 'bg-black/06 text-[#5a5a56]'}`}>
                        {relatedColumn.categoryLabel}
                      </span>
                      <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedColumn.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
