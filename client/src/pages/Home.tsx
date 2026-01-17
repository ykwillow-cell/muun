import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Star, ShieldCheck, Info, BrainCircuit, ScrollText, Sparkles, Heart, CalendarDays } from "lucide-react";

export default function Home() {
  const menuItems = [
    { 
      href: "/yearly-fortune", 
      label: "신년운세", 
      icon: <Star className="w-10 h-10 text-blue-400 drop-shadow-md" />, 
      color: "from-blue-500/20" 
    },
    { 
      href: "/tojeong", 
      label: "토정비결", 
      icon: <ScrollText className="w-10 h-10 text-yellow-400 drop-shadow-md" />, 
      color: "from-yellow-500/20" 
    },
    { 
      href: "/lifelong-saju", 
      label: "평생사주", 
      icon: <Sparkles className="w-10 h-10 text-purple-400 drop-shadow-md" />, 
      color: "from-purple-500/20" 
    },
    { 
      href: "/psychology", 
      label: "심리풀이", 
      icon: <BrainCircuit className="w-10 h-10 text-indigo-400 drop-shadow-md" />, 
      color: "from-indigo-500/20" 
    },
    { 
      href: "/compatibility", 
      label: "짝궁합", 
      icon: <Heart className="w-10 h-10 text-pink-400 drop-shadow-md" />, 
      color: "from-pink-500/20" 
    },
    { 
      href: "/manselyeok", 
      label: "만세력", 
      icon: <CalendarDays className="w-10 h-10 text-primary drop-shadow-md" />, 
      color: "from-primary/20" 
    },
  ];

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative scroll-smooth antialiased">
      {/* Background Stars Effect - Optimized for Mobile Performance */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Static Stars for performance on mobile */}
        <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-yellow-200/60 rounded-full" />
        <div className="absolute top-40 right-20 w-2 h-2 bg-yellow-100/50 rounded-full" />
        <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-white/40 rounded-full" />
        <div className="absolute top-1/2 right-10 w-1 h-1 bg-yellow-300/40 rounded-full" />
        
        {/* Optimized Gradient Orbs - Reduced blur and size for mobile performance */}
        <div className="absolute top-[-5%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-900/20 rounded-full blur-[60px] md:blur-[100px] will-change-transform" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-900/20 rounded-full blur-[60px] md:blur-[100px] will-change-transform" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center gap-12 will-change-scroll">
        
        {/* Hero Section */}
        <section className={`flex flex-col items-center justify-center pt-8 gap-6 ${commonMaxWidth}`}>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-medium mb-1 backdrop-blur-sm">
              무운 (MuUn)
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">
              회원가입 없는<br />
              <span className="text-primary">무료 운세 서비스</span>
            </h1>
          </motion.div>

          {/* Banner Style Character Section */}
          <Link href="/psychology" className="w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 shadow-2xl border border-white/20 cursor-pointer group transform-gpu"
            >
              <div className="absolute inset-0 flex items-center justify-between px-6 md:px-8">
                <div className="space-y-2 z-10">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-bold uppercase tracking-wider">심리풀이 오픈</span>
                  <h2 className="text-lg md:text-2xl font-bold text-white leading-tight group-hover:text-yellow-200 transition-colors">
                    오늘 내 심리는?<br />매일 달라지는 재미!
                  </h2>
                  <p className="text-white/80 text-[10px] md:text-xs">데일리 심리풀이 바로가기 &gt;</p>
                </div>
                <div className="relative w-28 h-28 md:w-40 md:h-40 transition-transform group-hover:scale-105 duration-500">
                  <img 
                    src="/images/horse_mascot.png" 
                    alt="무운 마스코트" 
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </motion.div>
          </Link>
        </section>

        {/* Compact Icon Grid Menu Section */}
        <section className={`${commonMaxWidth} bg-card/40 backdrop-blur-md md:backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/10 transform-gpu`}>
          <div className="mb-6">
            <p className="text-primary/60 text-[10px] md:text-xs font-medium mb-1">소름 돋는 미래 예측</p>
            <h3 className="text-lg md:text-xl font-bold text-white">가장 정확한 사주 풀이</h3>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-3 gap-y-6 md:gap-y-8 gap-x-2 md:gap-x-4"
          >
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${item.color} to-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-105 duration-300 shadow-lg transform-gpu`}>
                    {item.icon}
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-red-500 rounded-full border-2 border-background flex items-center justify-center">
                      <span className="text-[7px] md:text-[8px] text-white font-bold">N</span>
                    </div>
                  </div>
                  <span className="text-[11px] md:text-sm font-medium text-white/80 group-hover:text-primary transition-colors text-center">{item.label}</span>
                </div>
              </Link>
            ))}
          </motion.div>
        </section>

        {/* SEO Content Section */}
        <section className={`${commonMaxWidth} space-y-10 py-8 md:py-12 border-t border-white/5`}>
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <BookOpen className="text-primary w-5 h-5 md:w-6 md:h-6" />
              사주와 운세 지혜
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-muted-foreground text-xs md:text-sm leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-white/90">사주팔자란?</h3>
                <p>
                  사주팔자는 태어난 연, 월, 일, 시를 바탕으로 한 사람의 타고난 기운을 분석하는 학문입니다. 무운은 전통 지혜를 현대적 알고리즘으로 풀어냅니다.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-white/90">2026년 병오년</h3>
                <p>
                  2026년은 '붉은 말의 해'입니다. 열정과 성장의 에너지가 가득한 한 해를 무운의 전문적인 풀이와 함께 준비해보세요.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <Star className="text-yellow-400 w-4 h-4 md:w-5 md:h-5" />
              <h4 className="font-bold text-white text-xs md:text-sm">정확한 알고리즘</h4>
              <p className="text-[10px] md:text-[11px] text-muted-foreground">명리학 데이터를 바탕으로 정교한 결과를 제공합니다.</p>
            </div>
            <div className="p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <ShieldCheck className="text-green-400 w-4 h-4 md:w-5 md:h-5" />
              <h4 className="font-bold text-white text-xs md:text-sm">개인정보 보호</h4>
              <p className="text-[10px] md:text-[11px] text-muted-foreground">입력 정보는 서버에 저장되지 않고 즉시 처리됩니다.</p>
            </div>
            <div className="p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <Info className="text-blue-400 w-4 h-4 md:w-5 md:h-5" />
              <h4 className="font-bold text-white text-xs md:text-sm">무료 서비스</h4>
              <p className="text-[10px] md:text-[11px] text-muted-foreground">모든 운세 풀이를 결제 없이 무료로 이용하세요.</p>
            </div>
          </div>
        </section>

        <footer className={`${commonMaxWidth} pt-8 pb-8 border-t border-white/5`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left space-y-1">
              <h2 className="text-base md:text-lg font-bold text-white">무운 (MuUn)</h2>
              <p className="text-[9px] md:text-[10px] text-muted-foreground">© 2026 무운. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-[10px] md:text-xs text-muted-foreground">
              <Link href="/about" className="hover:text-primary transition-colors">서비스 소개</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">개인정보처리방침</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">이용약관</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
