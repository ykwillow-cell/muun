import { useState } from 'react';
import { Link } from 'wouter';
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllColumns, getColumnsByCategory, COLUMN_CATEGORIES, ColumnData } from '@/lib/column-data';

export default function Guide() {
  useCanonical('/guide');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const allColumns = getAllColumns();
  const displayedColumns = selectedCategory 
    ? getColumnsByCategory(selectedCategory)
    : allColumns;

  const categories = Object.entries(COLUMN_CATEGORIES).map(([key, value]) => ({
    id: key,
    label: value.label,
  }));

  return (
    <div className="min-h-screen bg-background text-white">
      <Helmet>
        <title>운세 칼럼 - 사주 지혜와 개운법 | 무운 (MuUn)</title>
        <meta name="description" content="30년 내공의 역술인이 전하는 사주 지혜와 개운법. 대운 변화, 자녀 교육, 재물운 등 실생활에 도움이 되는 전문 칼럼을 무료로 읽어보세요." />
        <meta name="keywords" content="사주 칼럼, 운세 지혜, 개운법, 대운, 자녀 사주, 재물운" />
        <meta property="og:title" content="운세 칼럼 - 사주 지혜와 개운법 | 무운 (MuUn)" />
        <meta property="og:description" content="30년 내공의 역술인이 전하는 사주 지혜와 개운법. 대운 변화, 자녀 교육, 재물운 등 실생활에 도움이 되는 전문 칼럼." />
        <link rel="canonical" href="https://muunsaju.com/guide" />
      </Helmet>

      {/* 헤더 */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            운세 칼럼
          </h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* 소개 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-primary uppercase">무운의 운세 지혜</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold">
            당신의 삶을 바꾸는<br />
            <span className="bg-gradient-to-r from-primary via-yellow-200 to-primary bg-clip-text text-transparent">사주 지혜</span>
          </h2>
          
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto">
            30년 내공의 역술인이 전하는 따뜻한 조언과 실질적인 개운법.
            <br className="hidden md:block" />
            대운의 변화, 자녀 교육, 재물운 등 당신의 궁금증을 풀어보세요.
          </p>
        </motion.div>

        {/* 카테고리 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8 justify-center"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? 'bg-primary text-background'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            전체 ({allColumns.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-background'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* 칼럼 목록 */}
        <div className="space-y-4">
          {displayedColumns.length > 0 ? (
            displayedColumns.map((column, index) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/guide/${column.id}`}>
                  <div className="group cursor-pointer">
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 hover:bg-white/10 transition-all p-6 md:p-8">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* 썸네일 */}
                        <div className="relative w-full md:w-48 h-40 md:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                          <img
                            src={column.thumbnail}
                            alt={column.title}
	                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
	                          />
	                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
	                          <div className="absolute inset-0 flex items-center justify-center text-white/10 group-hover:text-white/20 pointer-events-none">
	                            <BookOpen className="w-12 h-12 opacity-30" />
	                          </div>
                        </div>

                        {/* 콘텐츠 */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${COLUMN_CATEGORIES[column.category as keyof typeof COLUMN_CATEGORIES]?.color || 'bg-white/10 text-white/70'}`}>
                                {column.categoryLabel}
                              </span>
                              <span className="text-xs text-white/40">{column.author}</span>
                            </div>
                            
                            <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {column.title}
                            </h3>
                            
                            <p className="text-white/60 text-sm md:text-base line-clamp-2">
                              {column.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 mt-4 text-xs md:text-sm text-white/40">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(column.publishedDate).toLocaleDateString('ko-KR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {column.readTime}분
                            </div>
                          </div>
                        </div>

                        {/* 화살표 */}
                        <div className="hidden md:flex items-center justify-end flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all">
                            <ChevronLeft className="w-5 h-5 rotate-180" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60">해당 카테고리의 칼럼이 없습니다.</p>
            </div>
          )}
        </div>

        {/* CTA 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 p-8 md:p-12 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 border border-primary/20 rounded-2xl text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">당신의 사주도 분석해보세요</h3>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            칼럼에서 배운 사주 지혜를 직접 당신의 사주에 적용해보세요.
            생년월일만으로 당신의 운명을 한눈에 볼 수 있습니다.
          </p>
          <Link href="/lifelong-saju">
            <Button className="bg-primary hover:bg-primary/90 text-background font-bold px-8 py-3 rounded-xl">
              평생사주 분석 보러가기
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
