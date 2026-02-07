import { motion } from "framer-motion";
import { BookOpen, Star, ShieldCheck, Info, BrainCircuit, ScrollText, Sparkles, Heart, CalendarDays, ArrowRight, Zap, ChevronRight, Users } from "lucide-react";
import { trackCustomEvent } from "@/lib/ga4";
import { useRef } from "react";

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // GA 분석 기반 메뉴 순서 재배치
  const menuItems = [
    { 
      href: "/family-saju", 
      label: "가족사주", 
      icon: <Users className="w-5 h-5" />, 
      color: "bg-orange-500/20 text-orange-400",
      desc: "가족 오행 조화 분석",
      featured: true
    },
    { 
      href: "/tarot", 
      label: "AI 타로", 
      icon: <Sparkles className="w-5 h-5" />, 
      color: "bg-purple-500/20 text-purple-400",
      desc: "AI가 답하는 타로",
      featured: true
    },
    { 
      href: "/compatibility", 
      label: "궁합", 
      icon: <Heart className="w-5 h-5" />, 
      color: "bg-pink-500/20 text-pink-400",
      desc: "찰떡궁합 확인",
      featured: true
    },
    { 
      href: "/yearly-fortune", 
      label: "신년운세", 
      icon: <Star className="w-5 h-5" />, 
      color: "bg-yellow-500/20 text-yellow-400",
      desc: "2026년 총운 확인",
      featured: true
    },
    { 
      href: "/lifelong-saju", 
      label: "평생사주", 
      icon: <Sparkles className="w-5 h-5" />, 
      color: "bg-blue-500/20 text-blue-400",
      desc: "타고난 기질과 운명"
    },
    { 
      href: "/tojeong", 
      label: "토정비결", 
      icon: <ScrollText className="w-5 h-5" />, 
      color: "bg-yellow-500/20 text-yellow-400",
      desc: "일 년의 흐름 보기"
    },
    { 
      href: "/daily-fortune", 
      label: "오늘의 운세", 
      icon: <Zap className="w-5 h-5" />, 
      color: "bg-green-500/20 text-green-400",
      desc: "오늘의 행운 확인"
    },
    { 
      href: "/psychology", 
      label: "심리테스트", 
      icon: <BrainCircuit className="w-5 h-5" />, 
      color: "bg-pink-500/20 text-pink-400",
      desc: "나의 진짜 성격 찾기"
    },
    { 
      href: "/manselyeok", 
      label: "만세력", 
      icon: <CalendarDays className="w-5 h-5" />, 
      color: "bg-blue-500/20 text-blue-400",
      desc: "정확한 사주 데이터"
    },
  ];

  // 인기 서비스 (가로 스크롤용) - featured 항목만 필터
  const popularItems = menuItems.filter(item => item.featured);

  const handleCategoryClick = (label: string) => {
    trackCustomEvent("select_fortune_category", {
      fortune_type: label
    });
  };

  const commonMaxWidth = "max-w-4xl mx-auto";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative antialiased">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10">
        
        {/* Hero Section - 컴팩트 모바일 우선 */}
        <section className="px-4 pt-6 pb-6 md:pt-12 md:pb-8 text-center bg-gradient-to-b from-primary/5 to-transparent">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`${commonMaxWidth} space-y-4 md:space-y-6`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-medium text-primary">무료 사주 서비스</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                당신의 운명을 <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  무운에서 읽다
                </span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                회원가입 없이 즉시 사주, 궁합, 운세를 확인하세요
              </p>
            </div>
          </motion.div>
        </section>

        {/* 지금 인기 서비스 */}
        <section className={`${commonMaxWidth} px-4 py-6 md:py-10`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                지금 인기 서비스
              </h2>
            </div>

            {/* 가로 스크롤 컨테이너 */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
            >
              {popularItems.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  onClick={() => handleCategoryClick(item.label)}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex-shrink-0 w-40 md:w-48 snap-start group"
                >
                  <div className={`p-4 rounded-2xl border border-white/10 backdrop-blur-xl transition-all duration-300 ${item.color} hover:border-white/20 hover:shadow-lg h-full flex flex-col justify-between`}>
                    <div>
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h3 className="font-semibold text-sm md:text-base">{item.label}</h3>
                    </div>
                    <p className="text-xs text-white/70 group-hover:text-white/90 transition-colors">{item.desc}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* 모든 서비스 */}
        <section className={`${commonMaxWidth} px-4 py-6 md:py-10`}>
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              모든 서비스
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {menuItems.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  onClick={() => handleCategoryClick(item.label)}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                >
                  <div className={`p-4 rounded-xl border border-white/10 backdrop-blur-xl transition-all duration-300 ${item.color} hover:border-white/20 hover:shadow-lg h-full flex flex-col justify-between`}>
                    <div>
                      <div className="text-xl mb-2">{item.icon}</div>
                      <h3 className="font-medium text-sm">{item.label}</h3>
                    </div>
                    <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors mt-2">{item.desc}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* 정보 섹션 */}
        <section className={`${commonMaxWidth} px-4 py-8 md:py-12 space-y-6`}>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-white/10 backdrop-blur-xl bg-white/5">
              <ShieldCheck className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">회원가입 불필요</h3>
              <p className="text-sm text-muted-foreground">즉시 사주 분석을 시작하세요</p>
            </div>
            <div className="p-4 rounded-xl border border-white/10 backdrop-blur-xl bg-white/5">
              <Info className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">정확한 분석</h3>
              <p className="text-sm text-muted-foreground">전통 사주학을 기반으로 한 분석</p>
            </div>
            <div className="p-4 rounded-xl border border-white/10 backdrop-blur-xl bg-white/5">
              <Sparkles className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">AI 기술</h3>
              <p className="text-sm text-muted-foreground">최신 AI 기술로 더 정확한 결과</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`${commonMaxWidth} px-4 py-8 md:py-12 border-t border-white/10 text-center space-y-4`}>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              © 2024 MUUN. 회원가입 없는 무료 사주 및 운세 서비스
            </p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <a href="/family-saju" className="hover:text-primary transition-colors">가족사주</a>
              <a href="/tarot" className="hover:text-primary transition-colors">AI 타로</a>
              <a href="/compatibility" className="hover:text-primary transition-colors">궁합</a>
              <a href="/yearly-fortune" className="hover:text-primary transition-colors">신년운세</a>
              <a href="/lifelong-saju" className="hover:text-primary transition-colors">평생사주</a>
              <a href="/tojeong" className="hover:text-primary transition-colors">토정비결</a>
              <a href="/daily-fortune" className="hover:text-primary transition-colors">오늘의 운세</a>
              <a href="/manselyeok" className="hover:text-primary transition-colors">만세력</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
