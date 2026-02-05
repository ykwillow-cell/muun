import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Star, ShieldCheck, Info, BrainCircuit, ScrollText, Sparkles, Heart, CalendarDays, ArrowRight, Zap } from "lucide-react";

export default function Home() {
  const mainItems = [
    { 
      href: "/tarot", 
      label: "AI 타로", 
      icon: <Sparkles className="w-8 h-8 text-yellow-400" />, 
      color: "from-yellow-500/20",
      desc: "고민을 말해보세요, AI가 답해주는 타로",
      featured: true
    },
    { 
      href: "/yearly-fortune", 
      label: "프리미엄 신년운세", 
      icon: <Star className="w-8 h-8 text-blue-400" />, 
      color: "from-blue-500/20",
      desc: "내년엔 대박 날까? 2026년 총운 확인",
      featured: true
    }
  ];

  const subItems = [
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
      href: "/lifelong-saju", 
      label: "평생사주", 
      icon: <Sparkles className="w-5 h-5 text-purple-400" />, 
      color: "from-purple-500/20",
      desc: "내가 타고난 기질과 직업, 재물운까지"
    },
    { 
      href: "/psychology", 
      label: "심리풀이", 
      icon: <BrainCircuit className="w-5 h-5 text-indigo-400" />, 
      color: "from-indigo-500/20",
      desc: "MBTI보다 정확한 나의 본 모습"
    },
    { 
      href: "/compatibility", 
      label: "짝궁합", 
      icon: <Heart className="w-5 h-5 text-pink-400" />, 
      color: "from-pink-500/20",
      desc: "우리 둘, 정말 잘 맞을까? 찰떡궁합 확인"
    },
    { 
      href: "/manselyeok", 
      label: "만세력", 
      icon: <CalendarDays className="w-5 h-5 text-primary" />, 
      color: "from-primary/20",
      desc: "정확한 명리학 데이터를 기반으로 한 분석"
    },
  ];

  const commonMaxWidth = "w-full max-w-4xl mx-auto";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative antialiased">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-6 md:py-16 flex flex-col gap-8 md:gap-16">
        
        {/* Hero Section - Compressed for Mobile */}
        <section className={`flex flex-col items-center text-center gap-4 md:gap-8 ${commonMaxWidth}`}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 md:space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] md:text-xs font-bold tracking-wider text-primary uppercase">가입 없는 무료 운세</span>
            </div>
            
            <h1 className="text-2xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-tight">
              30년 내공의 명리학,<br />
              <span className="text-primary font-bold">운명을 읽다</span>
            </h1>
          </motion.div>

          {/* Featured Banner - Compressed Height */}
          <Link href="/yearly-fortune" className="w-full max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group relative w-full min-h-[140px] md:min-h-[180px] md:aspect-[3/1] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden glass-panel hover:border-primary/30 transition-all duration-500 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-between px-5 md:px-12 py-4 md:py-6">
                <div className="text-left space-y-2 md:space-y-4 z-10 flex-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-primary text-[9px] md:text-[10px] font-bold text-background uppercase">로그인 없이 바로</div>
                  <h2 className="text-base md:text-3xl font-bold text-white group-hover:text-primary transition-colors leading-tight">
                    신년운세<br />내 한 해의 흐름 확인하기
                  </h2>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-full bg-primary text-background text-[11px] md:text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    지금 바로 확인하기 <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                </div>
                <div className="relative w-16 h-16 md:w-48 md:h-48 flex-shrink-0">
                  <img 
                    src="/images/horse_mascot.png" 
                    alt="Mascot" 
                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
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
          
          {/* Main Services - 2 Column Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-3 md:mb-6">
            {mainItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="group relative p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] glass-panel border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300 cursor-pointer h-full flex flex-col gap-3 md:gap-5"
                >
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${item.color} to-transparent flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm md:text-lg font-bold text-white group-hover:text-primary transition-colors">{item.label}</h4>
                    <p className="text-[10px] md:text-[14px] text-white/60 leading-snug line-clamp-1 md:line-clamp-none">{item.desc}</p>
                  </div>
                  <div className="mt-auto pt-1 md:pt-4 flex justify-end">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all">
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Sub Services - 2 Column Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {subItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="group relative p-3 md:p-8 rounded-[1.2rem] md:rounded-[2rem] glass-panel hover:bg-white/5 transition-all duration-300 cursor-pointer h-full flex flex-col md:flex-col gap-2 md:gap-5"
                >
                  <div className="flex items-center md:block gap-2">
                    <div className={`w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-gradient-to-br ${item.color} to-transparent flex items-center justify-center group-hover:scale-110 transition-transform duration-500 flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <h4 className="text-[13px] md:text-lg font-bold text-white group-hover:text-primary transition-colors md:mt-4">{item.label}</h4>
                  </div>
                  <div className="hidden md:block space-y-0.5">
                    <p className="text-[13px] md:text-[14px] text-white/70 leading-snug line-clamp-1">{item.desc}</p>
                  </div>
                  <div className="mt-auto pt-0 md:pt-4 flex justify-end">
                    <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all">
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Detailed Explanation Section - Kept for SEO and Desktop but slightly tighter */}
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
