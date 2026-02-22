import React, { useMemo } from 'react';
import { useParams } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trophy, CheckCircle2, AlertCircle, ArrowLeft, Share2, Heart,
  Sparkles, BookOpen, Brain, Lightbulb
} from 'lucide-react';
import { dreamData, DreamGrade } from '../data/dream-data';
import { useCanonical } from '@/lib/use-canonical';

const gradeConfig: Record<DreamGrade, { label: string; icon: any; color: string; bg: string; border: string; desc: string }> = {
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
  caution: { 
    label: '보랏빛 흉몽', 
    icon: AlertCircle, 
    color: 'text-purple-400', 
    bg: 'from-purple-500/20 to-transparent', 
    border: 'border-purple-500/30',
    desc: '주의와 액땜이 필요한 시기임을 알려주는 꿈입니다.'
  }
};

const DreamDetail: React.FC = () => {
  const params = useParams<{ keyword: string }>();
  const keyword = params?.keyword ? decodeURIComponent(params.keyword) : '';
  
  useCanonical(`/dream/${encodeURIComponent(keyword)}`);

  const dream = useMemo(() => {
    return dreamData[keyword] || null;
  }, [keyword]);

  if (!dream) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20 px-4">
        <Helmet>
          <title>[가입X] 꿈 검색 - 무운</title>
          <meta name="description" content="찾으시는 꿈해몽이 없습니다. 다시 검색해보세요." />
        </Helmet>
        <div className="container mx-auto max-w-4xl pt-20">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">꿈을 찾을 수 없습니다</h1>
            <p className="text-muted-foreground">다른 꿈을 검색해보세요.</p>
            <Button onClick={() => window.history.back()} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const grade = gradeConfig[dream.grade];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
      <Helmet>
        <title>[가입X] {dream.keyword} 꿈해몽 무료 풀이 - 무운</title>
        <meta name="description" content={`${dream.keyword} 꿈해몽: ${dream.interpretation.slice(0, 100)}... 가입 없이 100% 무료로 확인하세요.`} />
        <meta name="keywords" content={`${dream.keyword} 꿈, ${dream.keyword} 꿈해몽, 꿈 풀이, 꿈 의미`} />
        <link rel="canonical" href={`https://muunsaju.com/dream/${encodeURIComponent(dream.keyword)}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${dream.keyword} 꿈해몽 무료 풀이`,
            "description": dream.interpretation,
            "author": {
              "@type": "Organization",
              "name": "무운"
            },
            "publisher": {
              "@type": "Organization",
              "name": "무운",
              "logo": {
                "@type": "ImageObject",
                "url": "https://muunsaju.com/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://muunsaju.com/dream/${encodeURIComponent(dream.keyword)}`
            },
            "datePublished": new Date().toISOString().split('T')[0],
            "articleBody": `${dream.interpretation}\n\n전통적 의미: ${dream.traditionalMeaning}\n\n심리학적 의미: ${dream.psychologicalMeaning}`
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="px-4 pt-12 pb-8 text-center bg-gradient-to-b from-purple-900/10 to-transparent">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            돌아가기
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            {dream.keyword} 꿈해몽
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            당신의 무의식이 보내온 신호를 풀어보세요
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Grade Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className={`overflow-hidden border-2 ${grade.border} bg-gradient-to-br ${grade.bg} via-card to-background shadow-2xl relative`}>
            <div className="absolute top-0 right-0 p-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <Sparkles className={`w-8 h-8 ${grade.color} opacity-50`} />
              </motion.div>
            </div>
            
            <CardHeader className="text-center pb-2 pt-10">
              <div className="flex justify-center mb-6">
                <div className={`relative p-5 rounded-full border-2 ${grade.border} bg-background/50 backdrop-blur-md shadow-xl`}>
                  {React.createElement(grade.icon, {
                    className: `w-10 h-10 ${grade.color}`
                  })}
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
                <p className="text-sm text-muted-foreground">{grade.desc}</p>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Content Cards */}
        <div className="grid gap-6 mb-8">
          {/* Interpretation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 border-white/10 hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  현대적 해석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {dream.interpretation}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Traditional Meaning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/50 border-white/10 hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-400" />
                  전통 역학적 의미
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {dream.traditionalMeaning}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Psychological Meaning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/50 border-white/10 hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  심리학적 의미
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {dream.psychologicalMeaning}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 justify-center mb-12"
        >
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('링크가 복사되었습니다!');
            }}
          >
            <Share2 className="w-4 h-4" />
            공유하기
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              // 즐겨찾기 기능 (localStorage 활용)
              const saved = JSON.parse(localStorage.getItem('savedDreams') || '[]');
              if (!saved.includes(dream.keyword)) {
                saved.push(dream.keyword);
                localStorage.setItem('savedDreams', JSON.stringify(saved));
                alert('즐겨찾기에 추가되었습니다!');
              } else {
                alert('이미 즐겨찾기에 있습니다.');
              }
            }}
          >
            <Heart className="w-4 h-4" />
            즐겨찾기
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default DreamDetail;
