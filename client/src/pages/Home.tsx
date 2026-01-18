import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Star, ShieldCheck, Info, BrainCircuit, ScrollText, Sparkles, Heart, CalendarDays, ArrowRight } from "lucide-react";

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

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex flex-col gap-20">
        
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
              <span className="text-gradient">당신의 운명을 비추는</span><br />
              <span className="text-primary">가장 맑은 거울, 무운</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              복잡한 가입 없이, 30년 전통의 명리학 지혜를<br className="hidden md:block" /> 
              현대적인 감각으로 풀어낸 무료 운세 서비스를 경험해보세요.
            </p>
          </motion.div>

          {/* Featured Banner */}
          <Link href="/psychology" className="w-full max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group relative w-full aspect-[21/9] md:aspect-[3/1] rounded-[2rem] overflow-hidden glass-panel hover:border-primary/30 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-between px-8 md:px-12">
                <div className="text-left space-y-3 z-10">
                  <div className="inline-block px-2 py-0.5 rounded bg-primary text-[10px] font-bold text-background uppercase">New</div>
                  <h2 className="text-xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors">
                    오늘 내 심리는?<br />매일 달라지는 마음의 날씨
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    지금 확인하기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="relative w-32 h-32 md:w-48 md:h-48">
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
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-white">운세 카테고리</h3>
              <p className="text-muted-foreground">당신이 궁금한 모든 미래를 준비했습니다.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <motion.div 
                  whileHover={{ y: -8 }}
                  className="group relative p-6 md:p-8 rounded-[2rem] glass-panel hover:bg-white/5 transition-all duration-300 cursor-pointer h-full flex flex-col gap-6"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} to-transparent flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{item.label}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-auto pt-4 flex justify-end">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Philosophy Section */}
        <section className={`${commonMaxWidth} grid grid-cols-1 md:grid-cols-3 gap-6`}>
          <div className="p-8 rounded-[2rem] glass-panel space-y-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center">
              <Star className="text-yellow-400 w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">정확한 알고리즘</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">30년 경력 역술인의 전문 데이터를 현대적 알고리즘으로 정교하게 구현했습니다.</p>
          </div>
          <div className="p-8 rounded-[2rem] glass-panel space-y-4">
            <div className="w-12 h-12 rounded-xl bg-green-400/10 flex items-center justify-center">
              <ShieldCheck className="text-green-400 w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">철저한 익명성</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">입력하신 정보는 서버에 저장되지 않으며, 오직 당신의 브라우저에서만 처리됩니다.</p>
          </div>
          <div className="p-8 rounded-[2rem] glass-panel space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center">
              <Info className="text-blue-400 w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">완전 무료 서비스</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">어떠한 결제 유도나 회원가입 없이 모든 운세 풀이를 자유롭게 이용하실 수 있습니다.</p>
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
