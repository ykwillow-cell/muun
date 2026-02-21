import { useParams } from 'wouter';
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getColumnById, getLatestColumns, COLUMN_CATEGORIES } from '@/lib/column-data';
import { Link } from 'wouter';

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const column = id ? getColumnById(id) : undefined;
  const relatedColumns = getLatestColumns(3).filter(col => col.id !== id);

  useCanonical(`/guide/${id}`);

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

  const categoryColor = COLUMN_CATEGORIES[column.category as keyof typeof COLUMN_CATEGORIES]?.color || 'bg-white/10 text-white/70';

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
        <link rel="canonical" href={`https://muunsaju.com/guide/${column.id}`} />
        
        {/* JSON-LD 스키마 (Article) */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: column.title,
            description: column.description,
            image: column.thumbnail,
            datePublished: column.publishedDate,
            author: {
              '@type': 'Organization',
              name: column.author,
            },
            publisher: {
              '@type': 'Organization',
              name: '무운 (MuUn)',
              logo: {
                '@type': 'ImageObject',
                url: 'https://muunsaju.com/logo.png',
              },
            },
          })}
        </script>
      </Helmet>

      {/* 헤더 */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 bg-white/5"
        >
          <img
            src={column.thumbnail}
            alt={column.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

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
                year: 'numeric',
                month: 'long',
                day: 'numeric',
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
          className="prose prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: column.content }}
        />

        {/* 서비스 연계 CTA */}
        {column.relatedServiceUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 bg-primary/10 border border-primary/20 rounded-2xl mb-12 text-center"
          >
            <h3 className="text-xl font-bold mb-3">지금 당신의 사주를 분석해보세요</h3>
            <p className="text-white/70 mb-6">
              이 칼럼에서 배운 지혜를 직접 당신의 사주에 적용해보세요.
            </p>
            <Link href={column.relatedServiceUrl}>
              <Button className="bg-primary hover:bg-primary/90 text-background font-bold px-8 py-3 rounded-xl">
                무료 분석 시작하기
              </Button>
            </Link>
          </motion.div>
        )}

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
                <Link key={relatedColumn.id} href={`/guide/${relatedColumn.id}`}>
                  <div className="group cursor-pointer bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 hover:bg-white/10 transition-all h-full">
                    <div className="aspect-video overflow-hidden bg-white/5">
                      <img
                        src={relatedColumn.thumbnail}
                        alt={relatedColumn.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${COLUMN_CATEGORIES[relatedColumn.category as keyof typeof COLUMN_CATEGORIES]?.color || 'bg-white/10 text-white/70'}`}>
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
