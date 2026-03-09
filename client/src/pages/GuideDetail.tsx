import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Clock, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getColumnBySlug, getLatestColumns, COLUMN_CATEGORIES, type ColumnData } from '@/lib/column-data-api';
import CallToAction from '@/components/CallToAction';
import RelatedServices from '@/components/RelatedServices';
import { Link } from 'wouter';

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
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!column) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">칼럼을 찾을 수 없습니다</h1>
          <Link href="/guide">
            <Button className="bg-primary hover:bg-primary/90 text-background">
              칼럼 목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryColor = COLUMN_CATEGORIES[column.category]?.color || 'bg-white/10 text-white/70';

  return (
    <div className="min-h-screen bg-background text-white">
      <Helmet>
        <title>{column.title} | 무운 (MuUn)</title>
        <meta name="description" content={column.description} />
        <meta name="keywords" content={column.keywords.join(', ')} />
        <meta property="og:title" content={column.title} />
        <meta property="og:description" content={column.description} />
        <meta property="og:image" content={column.thumbnail} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={column.publishedDate} />
        <meta property="article:author" content={column.author} />
        <link rel="canonical" href={`https://muunsaju.com/guide/${column.slug || column.id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": column.title,
            "description": column.description,
            "author": { "@type": "Person", "name": column.author },
            "datePublished": column.publishedDate,
            "image": column.thumbnail,
            "publisher": {
              "@type": "Organization",
              "name": "무운 (MuUn)",
              "logo": { "@type": "ImageObject", "url": "https://muunsaju.com/logo.png" }
            }
          })}
        </script>
      </Helmet>

      {/* 헤더 */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/guide">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <span className="text-sm font-semibold text-white/60">칼럼</span>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
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
            className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 bg-white/5"
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
            <span className="text-xs text-white/40">{column.author}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {column.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-white/40 flex-wrap">
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
          className="prose prose-invert max-w-none mb-12 [&_p]:mb-5 [&_p]:leading-relaxed [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:mb-5 [&_ol]:mb-5 [&_li]:mb-2 [&_blockquote]:my-6 [&_hr]:my-8 [&_strong]:font-bold [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: column.content }}
        />

        {/* CTA - 무료 운세 전환 유도 */}
        <CallToAction
          message="오늘 나의 운세도 확인해 보세요"
          targetPath="/daily-fortune"
        />
        {/* 관련 서비스 내부 링크 */}
        <RelatedServices
          title="칼럼과 함께 보면 좋은 서비스"
          services={[
            {
              href: "/lifelong-saju",
              label: "무료 평생사주 풀이",
              description: "타고난 기질과 인생 전체의 운세 흐름을 사주팔자로 분석합니다.",
              emoji: "🔮",
            },
            {
              href: "/yearly-fortune",
              label: "2026년 신년운세",
              description: "병오년 한 해의 운세 흐름을 미리 확인하세요.",
              emoji: "📅",
            },
            {
              href: "/manselyeok",
              label: "만세력",
              description: "내 사주팔자 원국과 대운·세운의 흐름을 한눈에 확인합니다.",
              emoji: "📖",
            },
            {
              href: "/dream",
              label: "꿈해몽 사전",
              description: "1만여 건의 꿈 해석을 무료로 찾아보세요.",
              emoji: "🌙",
            },
          ]}
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
                  <div className="group cursor-pointer bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 hover:bg-white/10 transition-all h-full">
                    {relatedColumn.thumbnail && (
                      <div className="aspect-video overflow-hidden bg-white/5">
                        <img
                          src={relatedColumn.thumbnail}
                          alt={relatedColumn.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${COLUMN_CATEGORIES[relatedColumn.category]?.color || 'bg-white/10 text-white/70'}`}>
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
