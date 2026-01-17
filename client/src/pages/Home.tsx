import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Star, ShieldCheck, Info } from "lucide-react";

export default function Home() {
  const menuItems = [
    { href: "/yearly-fortune", label: "신년운세", icon: "/images/icon_stars.png", color: "from-blue-500/20" },
    { href: "/tojeong", label: "토정비결", icon: "/images/icon_crystal_ball.png", color: "from-yellow-500/20" },
    { href: "/lifelong-saju", label: "평생사주", icon: "/images/icon_crystal_ball.png", color: "from-purple-500/20" },
    { href: "/compatibility", label: "짝궁합", icon: "/images/icon_heart.png", color: "from-pink-500/20" },
    { href: "/manselyeok", label: "만세력", icon: "/images/icon_calendar.png", color: "from-primary/20" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Background Stars Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-200 rounded-full blur-[2px] animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-100 rounded-full blur-[3px] animate-pulse delay-700" />
        <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-white rounded-full blur-[1px] animate-pulse delay-300" />
        <div className="absolute top-1/2 right-10 w-1 h-1 bg-yellow-300 rounded-full blur-[1px] animate-pulse delay-500" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center gap-12">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center pt-8 gap-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-lg aspect-[2/1] rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 shadow-2xl border border-white/20"
          >
            <div className="absolute inset-0 flex items-center justify-between px-8">
              <div className="space-y-2 z-10">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-bold uppercase tracking-wider">심리풀이 오픈</span>
                <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
                  오늘 내 심리는?<br />매일 달라지는 재미!
                </h2>
                <p className="text-white/80 text-xs">데일리 심리풀이 오픈!</p>
              </div>
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <img 
                  src="/images/horse_mascot.png" 
                  alt="무운 마스코트" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Compact Icon Grid Menu Section */}
        <section className="w-full max-w-2xl bg-white rounded-[2.5rem] p-8 shadow-xl">
          <div className="mb-6">
            <p className="text-gray-400 text-xs font-medium mb-1">소름 돋는 미래 예측</p>
            <h3 className="text-xl font-bold text-gray-900">가장 정확한 사주 풀이</h3>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-y-8 gap-x-4"
          >
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} to-transparent flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                    <img src={item.icon} alt={item.label} className="w-10 h-10 object-contain" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">N</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{item.label}</span>
                </div>
              </Link>
            ))}
          </motion.div>
        </section>

        {/* SEO Content Section */}
        <section className="w-full max-w-4xl space-y-12 py-12 border-t border-white/5">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <BookOpen className="text-primary w-6 h-6" />
              사주와 운세 지혜
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-muted-foreground text-sm leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white/90">사주팔자란?</h3>
                <p>
                  사주팔자는 태어난 연, 월, 일, 시를 바탕으로 한 사람의 타고난 기운을 분석하는 학문입니다. 무운은 전통 지혜를 현대적 알고리즘으로 풀어냅니다.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white/90">2026년 병오년</h3>
                <p>
                  2026년은 '붉은 말의 해'입니다. 열정과 성장의 에너지가 가득한 한 해를 무운의 전문적인 풀이와 함께 준비해보세요.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <Star className="text-yellow-400 w-5 h-5" />
              <h4 className="font-bold text-white text-sm">정확한 알고리즘</h4>
              <p className="text-[11px] text-muted-foreground">명리학 데이터를 바탕으로 정교한 결과를 제공합니다.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <ShieldCheck className="text-green-400 w-5 h-5" />
              <h4 className="font-bold text-white text-sm">개인정보 보호</h4>
              <p className="text-[11px] text-muted-foreground">입력 정보는 서버에 저장되지 않고 즉시 처리됩니다.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <Info className="text-blue-400 w-5 h-5" />
              <h4 className="font-bold text-white text-sm">무료 서비스</h4>
              <p className="text-[11px] text-muted-foreground">모든 운세 풀이를 결제 없이 무료로 이용하세요.</p>
            </div>
          </div>
        </section>

        <footer className="w-full pt-8 pb-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left space-y-1">
              <h2 className="text-lg font-bold text-white">무운 (MuUn)</h2>
              <p className="text-[10px] text-muted-foreground">© 2026 무운. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
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
