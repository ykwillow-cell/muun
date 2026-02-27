import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Share2, Loader2, Trophy, CheckCircle2, AlertCircle,
  Star, BrainCircuit, Quote, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import { getDreamBySlug, getLatestDreams, DREAM_CATEGORIES, type DreamData } from '@/lib/dream-data-api';

const gradeConfig: Record<string, { label: string; icon: any; color: string; bg: string; border: string; desc: string }> = {
  great: {
    label: '황금빛 길몽',
    icon: Trophy,
    color: 'text-yellow-400',
    bg: 'from-yellow-500/20 to-transparent',
    border: 'border-yellow-500/30',
    desc: '재물, 성공, 경사를 상징하는 아주 좋은 꿈입니다!'
  },
  good: {
    label: '푸른 평몽',
    icon: CheckCircle2,
    color: 'text-blue-400',
    bg: 'from-blue-500/20 to-transparent',
    border: 'border-blue-500/30',
    desc: '일상의 변화나 심리적 안정을 나타내는 긍정적인 꿈입니다.'
  },
  bad: {
    label: '보랏빛 흉몽',
    icon: AlertCircle,
    color: 'text-purple-400',
    bg: 'from-purple-500/20 to-transparent',
    border: 'border-purple-500/30',
    desc: '주의와 액땜이 필요한 시기임을 알려주는 꿈입니다.'
  }
};

export default function DreamDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [dream, setDream] = useState<DreamData | null>(null);
  const [relatedDreams, setRelatedDreams] = useState<DreamData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useCanonical(`/dream/${slug}`);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      if (slug) {
        const [d, latest] = await Promise.all([
          getDreamBySlug(slug),
          getLatestDreams(6),
        ]);
        setDream(d);
        setRelatedDreams(latest.filter(r => r.slug !== slug).slice(0, 3));
      }
      setIsLoading(false);
    };
    load();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!dream) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">꿈해몽을 찾을 수 없습니다</h1>
          <Link href="/dream">
            <Button className="bg-primary hover:bg-primary/90 text-background">
              꿈해몽 목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const grade = gradeConfig[dream.grade] || gradeConfig.good;
  const GradeIcon = grade.icon;
  const metaTitle = dream.meta_title || `${dream.keyword} 꿈해몽 - 무운`;
  const metaDescription = dream.meta_description || dream.interpretation?.slice(0, 155) || `${dream.keyword} 꿈의 의미와 해석을 알아보세요.`;
  const canonicalUrl = `https://muunsaju.com/dream/${dream.slug}`;
  const categoryLabel = DREAM_CATEGORIES[dream.category]?.label || dream.category;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: metaTitle,
          text: metaDescription,
          url: canonicalUrl,
        });
      } catch (_) {}
    } else {
      await navigator.clipboard.writeText(canonicalUrl);
      alert('링크가 복사되었습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${dream.keyword}, ${dream.keyword} 꿈, ${dream.keyword} 꿈해몽, 꿈해몽, 꿈풀이, 무운`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content="https://muunsaju.com/og-image.png" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content="https://muunsaju.com/og-image.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": metaTitle,
            "description": metaDescription,
            "author": {
              "@type": "Organization",
              "name": "무운 (MuUn)"
            },
            "datePublished": dream.published_at || dream.created_at,
            "publisher": {
              "@type": "Organization",
              "name": "무운 (MuUn)",
              "logo": {
                "@type": "ImageObject",
                "url": "https://muunsaju.com/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            }
          })}
        </script>
      </Helmet>

      {/* 헤더 */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dream">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <span className="text-sm font-semibold text-white/60">꿈해몽</span>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* 메인 결과 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`overflow-hidden border-2 ${grade.border} bg-gradient-to-br ${grade.bg} via-card to-background shadow-2xl relative mb-6`}>
            <div className="absolute top-0 right-0 p-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <Sparkles className={`w-8 h-8 ${grade.color} opacity-50`} />
              </motion.div>
            </div>

            <CardHeader className="text-center pb-4 pt-10 px-6">
              <div className="flex justify-center mb-6">
                <div className={`relative p-5 rounded-full border-2 ${grade.border} bg-background/50 backdrop-blur-md shadow-xl`}>
                  <GradeIcon className={`w-10 h-10 ${grade.color}`} />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-primary text-[10px] font-bold px-2 py-1 rounded-full text-white shadow-lg"
                  >
                    {dream.score}점
                  </motion.div>
                </div>
              </div>
              <div className="space-y-1">
                <span className={`text-sm font-bold tracking-widest uppercase ${grade.color}`}>
                  {grade.label}
                </span>
                <CardTitle className="text-3xl md:text-4xl font-bold text-white">
                  {dream.keyword} 꿈
                </CardTitle>
              </div>
              <div className="flex justify-center gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${DREAM_CATEGORIES[dream.category]?.color || 'bg-white/10 text-white/70'}`}>
                  {categoryLabel}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-4 max-w-xs mx-auto">
                {grade.desc}
              </p>
            </CardHeader>

            <CardContent className="text-center pb-10 px-6">
              {/* Score Gauge */}
              <div className="max-w-xs mx-auto mb-8 mt-4">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dream.score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${dream.grade === 'great' ? 'from-yellow-400 to-orange-500' : dream.grade === 'good' ? 'from-blue-400 to-indigo-500' : 'from-purple-400 to-pink-500'}`}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  <span>기운 약함</span>
                  <span>강력한 에너지</span>
                </div>
              </div>

              <div className="relative inline-block px-8 py-8 bg-white/5 rounded-3xl border border-white/10 w-full shadow-inner">
                <Quote className={`absolute top-6 left-6 w-8 h-8 ${grade.color} opacity-20`} />
                <p className="text-lg md:text-xl text-slate-100 leading-relaxed font-medium">
                  {dream.interpretation}
                </p>
                <Quote className={`absolute bottom-6 right-6 w-8 h-8 ${grade.color} opacity-20 rotate-180`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 전통적 의미 & 심리학적 의미 */}
        {(dream.traditional_meaning || dream.psychological_meaning) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            {dream.traditional_meaning && (
              <Card className="bg-white/5 border-white/10 hover:border-primary/30 transition-all group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50" />
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                  <CardTitle className="text-lg">전통적 의미</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {dream.traditional_meaning}
                  </p>
                </CardContent>
              </Card>
            )}
            {dream.psychological_meaning && (
              <Card className="bg-white/5 border-white/10 hover:border-primary/30 transition-all group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <BrainCircuit className="w-5 h-5 text-blue-500" />
                  </div>
                  <CardTitle className="text-lg">심리학적 분석</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {dream.psychological_meaning}
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* 액션 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mb-12"
        >
          <Link href="/dream" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 text-lg"
            >
              다른 꿈 검색하기
            </Button>
          </Link>
          <Button
            onClick={handleShare}
            className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg shadow-primary/20"
          >
            결과 공유하기
          </Button>
        </motion.div>

        {/* 관련 꿈해몽 */}
        {relatedDreams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6">다른 꿈해몽 보기</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedDreams.map((related) => {
                const relatedGrade = gradeConfig[related.grade] || gradeConfig.good;
                const RelatedIcon = relatedGrade.icon;
                return (
                  <Link key={related.id} href={`/dream/${related.slug}`}>
                    <div className={`group cursor-pointer bg-white/5 border ${relatedGrade.border} rounded-xl p-5 hover:bg-white/10 transition-all h-full`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg border ${relatedGrade.border} bg-background/50`}>
                          <RelatedIcon className={`w-5 h-5 ${relatedGrade.color}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                            {related.keyword} 꿈
                          </h3>
                          <span className={`text-[10px] font-bold ${relatedGrade.color}`}>
                            {relatedGrade.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {related.interpretation}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
