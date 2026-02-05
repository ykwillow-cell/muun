import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Star, ShieldCheck, Info, BrainCircuit, ScrollText, Sparkles, Heart, CalendarDays, ArrowRight, Zap } from "lucide-react";
import { trackCustomEvent } from "@/lib/ga4";

export default function Home() {
  // GA 분석 기반 메뉴 순서 재배치
  const menuItems = [
    { 
      href: "/yearly-fortune", 
      label: "신년운세", 
      icon: <Star className="w-8 h-8 text-blue-400" />, 
      color: "from-blue-500/20",
      desc: "내년엔 대박 날까? 2026년 총운 확인",
      featured: true
    },
    { 
      href: "/lifelong-saju", 
      label: "평생사주", 
      icon: <Sparkles className="w-8 h-8 text-purple-400" />, 
      color: "from-purple-500/20",
      desc: "내가 타고난 기질과 직업, 재물운까지",
      featured: true
    },
    { 
      href: "/tarot", 
      label: "AI 타로", 
      icon: <Sparkles className="w-8 h-8 text-yellow-400" />, 
      color: "from-yellow-500/20",
      desc: "고민을 말해보세요, AI가 답해주는 타로",
      featured: true
    },
    { 
      href: "/compatibility", 
      label: "궁합", 
      icon: <Heart className="w-5 h-5 text-pink-400" />, 
      color: "from-pink-500/20",
      desc: "우리 둘, 정말 잘 맞을까? 찰떡궁합 확인"
    },
    { 
      href: "/tojeong", 
      label: "토정비결", 
      icon: <ScrollText className="w-5 h-5 text-yellow-400" />, 
      color: "from-yellow-500/20",
      desc: "일 년의 흐름을 한눈에 보는 지혜"
    },
    { 
      href: "/daily-fortune", 
      label: "오늘의 운세", 
      icon: <Zap className="w-5 h-5 text-orange-400" />, 
      color: "from-orange-500/20",
      desc: "오늘 나에게 행운을 줄 컬러와 숫자는?"
    },
    { 
      href: "/psychology", 
      label: "심리풀이", 
      icon: <BrainCircuit className="w-5 h-5 text-indigo-400" />, 
      color: "from-indigo-500/20",
      desc: "MBTI보다 정확한 나의 본 모습"
    },
    { 
      href: "/manselyeok", 
      label: "만세력", 
      icon: <CalendarDays className="w-5 h-5 text-primary" />, 
      color: "from-primary/20",
      desc: "정확한 명리학 데이터를 기반으로 한 분석"
    },
  ];

  const handleCategoryClick = (label: string) => {
    trackCustomEvent("select_fortune_category", {
      fortune_type: label
    });
  };

  const commonMaxWidth = "w-full max-w-4xl mx-auto";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative antialiased">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-6 md:py-16 flex flex-col gap-8 md:gap-16">
        
        {/* Hero Section - Optimized for Mobile */}
        <section className={`flex flex-col items-center text-center gap-6 md:gap-12 ${commonMaxWidth}`}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 md:space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[11px] md:text-xs font-bold tracking-widest text-primary uppercase">가입 없는 무료 운세</span>
            </div>
            
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] md:leading-tight">
              30년 내공의 명리학,<br />
              <span className="bg-gradient-to-r from-primary via-yellow-200 to-primary bg-clip-text text-transparent">운명을 읽다</span>
            </h1>
          </motion.div>

          {/* Featured Banner - User Feedback Reflected */}
          <Link href="/yearly-fortune" onClick={() => handleCategoryClick("신년운세(배너)")} className="w-full">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="group relative w-full min-h-[180px] md:min-h-[240px] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#1a1a3a] via-[#2a1a4a] to-[#1a1a3a] border border-white/10 hover:border-primary/40 transition-all duration-500 cursor-pointer shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50" />
              <div className="absolute inset-0 flex items-center justify-between px-8 md:px-16 py-8 md:py-12">
                <div className="text-left space-y-4 md:space-y-8 z-10 flex-1">

                  <h2 className="text-[22px] md:text-5xl font-bold text-white leading-[1.3]">
                    신년운세<br />
                    <span className="text-[17px] md:text-3xl font-medium text-white/90">내 한 해의 흐름 확인하기</span>
                  </h2>
                  <div className="flex items-center gap-2 text-[#ffcc00] group-hover:gap-4 transition-all duration-300">
                    <span className="text-sm md:text-xl font-bold border-b-2 border-[#ffcc00] pb-0.5">지금 바로 확인하기</span>
                    <ArrowRight className="w-5 h-5 md:w-7 md:h-7" />
                  </div>
                </div>
                <div className="relative w-32 h-32 md:w-72 md:h-72 flex-shrink-0 -mr-4 md:-mr-10">
                  <img 
                    src="/images/horse_mascot.png" 
                    alt="Mascot" 
                    className="relative w-full h-full object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>
          </Link>
        </section>

        {/* Services Grid - 2 Column for Mobile */}
        <section className={commonMaxWidth}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 md:mb-10 gap-1 px-2 md:px-0">
            <div className="space-y-0.5 md:space-y-2">
              <h2 className="text-lg md:text-3xl font-bold text-white">어떤 미래가 궁금하신가요?</h2>
              <p className="text-muted-foreground text-[11px] md:text-base">당신이 궁금한 모든 미래를 준비했습니다.</p>
            </div>
          </div>
          
          {/* All Services - Premium Grid for Mobile & Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href} onClick={() => handleCategoryClick(item.label)}>
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative p-5 md:p-10 rounded-[2rem] md:rounded-[2.5rem] glass-panel transition-all duration-500 cursor-pointer h-full flex flex-col gap-4 md:gap-8 shadow-xl hover:shadow-primary/10 ${
                    item.featured ? 'border-primary/30 bg-primary/5 hover:bg-primary/15' : 'border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex flex-col gap-3 md:gap-6">
                    <div className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-gradient-to-br ${item.color} to-transparent flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-inner flex-shrink-0`}>
                      {/* 아이콘 크기 모바일에서 더 크게 조정 */}
                      {index < 3 ? (
                        <div className="scale-125 md:scale-150">{item.icon}</div>
                      ) : (
                        <div className="scale-110 md:scale-125">{item.icon}</div>
                      )}
                    </div>
                    <div className="space-y-1 md:space-y-3">
                      <h4 className="text-base md:text-2xl font-black text-white group-hover:text-primary transition-colors tracking-tight">{item.label}</h4>
                      <p className="text-[11px] md:text-base text-white/50 group-hover:text-white/80 leading-relaxed line-clamp-2 md:line-clamp-none transition-colors">{item.desc}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-end">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all duration-500 shadow-lg group-hover:shadow-primary/40">
                      <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Detailed Explanation Section */}
        <section className={`${commonMaxWidth} space-y-8 md:space-y-12`}>
          <div className="text-center space-y-2 md:space-y-4">
            <h2 className="text-xl md:text-3xl font-bold text-white">왜 무운 무료 사주인가요?</h2>
            <p className="text-muted-foreground text-[11px] md:text-base">무운은 사용자에게 가장 가치 있는 통찰을 제공하기 위해 세 가지 원칙을 지킵니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] glass-panel space-y-3 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                <Star className="text-yellow-400 w-5 h-5" />
              </div>
              <h4 className="text-base md:text-xl font-bold text-white">정밀한 명리 알고리즘</h4>
              <p className="text-[11px] md:text-sm text-muted-foreground leading-relaxed">
                단순한 확률 게임이 아닙니다. 30년 이상의 임상 경험을 가진 명리학 전문가의 고유 데이터를 바탕으로, 수천 가지의 사주 조합을 정밀하게 분석하는 현대적 알고리즘을 구축했습니다.
              </p>
            </div>
            <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] glass-panel space-y-3 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center">
                <ShieldCheck className="text-green-400 w-5 h-5" />
              </div>
              <h4 className="text-base md:text-xl font-bold text-white">데이터 주권과 익명성</h4>
              <p className="text-[11px] md:text-sm text-muted-foreground leading-relaxed">
                당신의 소중한 개인정보는 서버에 단 1초도 머물지 않습니다. 모든 계산은 사용자의 브라우저 로컬 환경에서 수행되며, 페이지를 닫는 즉시 휘발됩니다. 우리는 정보의 보안을 최우선으로 생각합니다.
              </p>
            </div>
            <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] glass-panel space-y-3 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center">
                <Info className="text-blue-400 w-5 h-5" />
              </div>
              <h4 className="text-base md:text-xl font-bold text-white">지속 가능한 무료 가치</h4>
              <p className="text-[11px] md:text-sm text-muted-foreground leading-relaxed">
                고품질의 운세 정보가 누구나 누릴 수 있는 보편적 가치가 되기를 바랍니다. 회원가입이나 유료 결제 유도 없이, 모든 프리미엄 콘텐츠를 투명하게 공개하여 사용자에게 실질적인 도움을 드립니다.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`${commonMaxWidth} pt-8 pb-12 md:pt-12 md:pb-20 border-t border-white/10`}>
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-background" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-primary">MUUN</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground max-w-xs">
                운명에 얽매이지 않고 스스로 운을 만들어가는 삶을 응원합니다.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
              <div className="space-y-3 md:space-y-4">
                <h5 className="text-[11px] md:text-sm font-bold text-white uppercase tracking-wider">Service</h5>
                <ul className="space-y-1.5 md:space-y-2 text-[11px] md:text-sm text-muted-foreground">
                  <li><Link href="/manselyeok" className="hover:text-primary transition-colors">만세력</Link></li>
                  <li><Link href="/lifelong-saju" className="hover:text-primary transition-colors">평생사주</Link></li>
                  <li><Link href="/yearly-fortune" className="hover:text-primary transition-colors">신년운세</Link></li>
                </ul>
              </div>
              <div className="space-y-3 md:space-y-4">
                <h5 className="text-[11px] md:text-sm font-bold text-white uppercase tracking-wider">Company</h5>
                <ul className="space-y-1.5 md:space-y-2 text-[11px] md:text-sm text-muted-foreground">
                  <li><Link href="/about" className="hover:text-primary transition-colors">서비스 소개</Link></li>
                  <li><Link href="/privacy" className="hover:text-primary transition-colors">개인정보처리방침</Link></li>
                  <li><Link href="/terms" className="hover:text-primary transition-colors">이용약관</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 md:mt-20 pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] md:text-xs text-muted-foreground">© 2026 MUUN Celestial Services. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
