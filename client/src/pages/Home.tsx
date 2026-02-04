import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Star, ShieldCheck, Info, BrainCircuit, ScrollText, Sparkles, Heart, CalendarDays, ArrowRight, Zap } from "lucide-react";

export default function Home() {
  const menuItems = [
    { 
      href: "/yearly-fortune", 
      label: "신년운세", 
      icon: <Star className="w-8 h-8 text-blue-400" />, 
      color: "from-blue-500/20",
      desc: "2026년 병오년 흐름"
    },
    { 
      href: "/tojeong", 
      label: "토정비결", 
      icon: <ScrollText className="w-8 h-8 text-yellow-400" />, 
      color: "from-yellow-500/20",
      desc: "전통 비결의 지혜"
    },
    { 
      href: "/daily-fortune", 
      label: "오늘운세", 
      icon: <Zap className="w-8 h-8 text-orange-400" />, 
      color: "from-orange-500/20",
      desc: "매일 확인하는 나의 행운"
    },
    { 
      href: "/lifelong-saju", 
      label: "평생사주", 
      icon: <Sparkles className="w-8 h-8 text-purple-400" />, 
      color: "from-purple-500/20",
      desc: "타고난 운명의 지도"
    },
    { 
      href: "/psychology", 
      label: "심리풀이", 
      icon: <BrainCircuit className="w-8 h-8 text-indigo-400" />, 
      color: "from-indigo-500/20",
      desc: "나도 모르는 내 마음"
    },
    { 
      href: "/compatibility", 
      label: "짝궁합", 
      icon: <Heart className="w-8 h-8 text-pink-400" />, 
      color: "from-pink-500/20",
      desc: "서로의 기운과 조화"
    },
    { 
      href: "/astrology", 
      label: "점성술", 
      icon: <Star className="w-8 h-8 text-purple-400" />, 
      color: "from-purple-500/20",
      desc: "별이 들려주는 운명"
    },
    { 
      href: "/tarot", 
      label: "AI 타로", 
      icon: <Sparkles className="w-8 h-8 text-yellow-400" />, 
      color: "from-yellow-500/20",
      desc: "AI가 읽어주는 운명의 카드"
    },
    { 
      href: "/manselyeok", 
      label: "만세력", 
      icon: <CalendarDays className="w-8 h-8 text-primary" />, 
      color: "from-primary/20",
      desc: "정확한 사주 데이터"
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

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex flex-col gap-16 md:gap-20">
        
        {/* Hero Section */}
        <section className={`flex flex-col items-center text-center gap-8 ${commonMaxWidth}`}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-medium tracking-wider text-primary uppercase">Celestial Wisdom</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="text-gradient">무료 사주 및 2026년</span><br />
              <span className="text-primary">무료 운세 서비스, 무운</span>
            </h1>
            
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
              복잡한 가입 절차 없이, 30년 전통의 명리학적 통찰과 현대적인 알고리즘이 결합된 고품질 운세 서비스를 제공합니다. 당신의 과거를 돌아보고 현재를 진단하며, 더 나은 미래를 설계할 수 있도록 무운이 함께하겠습니다.
            </p>
          </motion.div>

          {/* Featured Banner */}
          <Link href="/psychology" className="w-full max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group relative w-full min-h-[180px] md:aspect-[3/1] rounded-[2rem] overflow-hidden glass-panel hover:border-primary/30 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-between px-6 md:px-12 py-6">
                <div className="text-left space-y-3 z-10 flex-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-primary text-[10px] font-bold text-background uppercase">New</div>
                  <h2 className="text-lg md:text-3xl font-bold text-white group-hover:text-primary transition-colors leading-tight">
                    무료 심리 테스트<br />매일 달라지는 마음의 날씨
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    지금 확인하기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="relative w-24 h-24 md:w-48 md:h-48 flex-shrink-0">
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

        {/* Services Grid */}
        <section className={commonMaxWidth}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-4 px-2 md:px-0">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">무료 사주 및 운세 카테고리</h2>
              <p className="text-muted-foreground text-sm md:text-base">당신이 궁금한 모든 미래를 준비했습니다.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <motion.div 
                  whileHover={{ y: -8 }}
                  className="group relative p-6 md:p-8 rounded-[2rem] glass-panel hover:bg-white/5 transition-all duration-300 cursor-pointer h-full flex flex-col gap-4 md:gap-6"
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${item.color} to-transparent flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{item.label}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-auto pt-2 md:pt-4 flex justify-end">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Detailed Explanation Section */}
        <section className={`${commonMaxWidth} space-y-12`}>
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">왜 무운 무료 사주인가요?</h2>
            <p className="text-muted-foreground">무운은 사용자에게 가장 가치 있는 통찰을 제공하기 위해 세 가지 원칙을 지킵니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-[2rem] glass-panel space-y-4 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                <Star className="text-yellow-400 w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">정밀한 명리 알고리즘</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                단순한 확률 게임이 아닙니다. 30년 이상의 임상 경험을 가진 명리학 전문가의 고유 데이터를 바탕으로, 수천 가지의 사주 조합을 정밀하게 분석하는 현대적 알고리즘을 구축했습니다.
              </p>
            </div>
            <div className="p-8 rounded-[2rem] glass-panel space-y-4 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-green-400/10 flex items-center justify-center">
                <ShieldCheck className="text-green-400 w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">데이터 주권과 익명성</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                당신의 소중한 개인정보는 서버에 단 1초도 머물지 않습니다. 모든 계산은 사용자의 브라우저 로컬 환경에서 수행되며, 페이지를 닫는 즉시 휘발됩니다. 우리는 정보의 보안을 최우선으로 생각합니다.
              </p>
            </div>
            <div className="p-8 rounded-[2rem] glass-panel space-y-4 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center">
                <Info className="text-blue-400 w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">지속 가능한 무료 가치</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                고품질의 운세 정보가 누구나 누릴 수 있는 보편적 가치가 되기를 바랍니다. 회원가입이나 유료 결제 유도 없이, 모든 프리미엄 콘텐츠를 투명하게 공개하여 사용자에게 실질적인 도움을 드립니다.
              </p>
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6">
            <h4 className="text-2xl font-bold text-white">운세를 대하는 무운의 자세</h4>
            <p className="text-muted-foreground leading-relaxed">
              사주는 결정된 미래를 맞추는 점술이 아닙니다. 태어난 시점의 우주 에너지를 분석하여 자신의 강점과 약점을 파악하고, 다가올 시련에 대비하며 기회를 포착하는 '인생의 기상청'과 같습니다. 무운은 명리학의 본질인 '중화(中和)'의 정신을 담아, 어느 한쪽으로 치우치지 않는 균형 잡힌 시각을 제공합니다.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              우리는 사용자가 자신의 운명을 스스로 개척해 나갈 수 있도록 돕는 조력자가 되고자 합니다. 무운에서 제공하는 만세력, 평생사주, 토정비결 등의 다양한 도구를 통해 당신만의 인생 지도를 그려보세요.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className={`${commonMaxWidth} pt-12 pb-20 border-t border-white/10`}>
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-background" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-primary">MUUN</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                운명에 얽매이지 않고 스스로 운을 만들어가는 삶을 응원합니다.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-white uppercase tracking-wider">Service</h5>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/manselyeok" className="hover:text-primary transition-colors">만세력</Link></li>
                  <li><Link href="/lifelong-saju" className="hover:text-primary transition-colors">평생사주</Link></li>
                  <li><Link href="/yearly-fortune" className="hover:text-primary transition-colors">신년운세</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-white uppercase tracking-wider">Company</h5>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/about" className="hover:text-primary transition-colors">서비스 소개</Link></li>
                  <li><Link href="/privacy" className="hover:text-primary transition-colors">개인정보처리방침</Link></li>
                  <li><Link href="/terms" className="hover:text-primary transition-colors">이용약관</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2026 MUUN Celestial Services. All rights reserved.</p>
            <div className="flex gap-6">
              {/* Social Icons Placeholder */}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
