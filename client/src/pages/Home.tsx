import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Star, ShieldCheck, Info } from "lucide-react";

export default function Home() {
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

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center gap-16">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-[70vh] gap-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4"
          >
            <div className="inline-block px-4 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-2 backdrop-blur-sm">
              무운 (MuUn)
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
              회원가입 없는<br />
              <span className="text-primary">무료 운세 서비스</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              복잡한 절차 없이 생년월일만으로<br />
              당신의 운명을 확인해보세요.
            </p>
          </motion.div>

          {/* 3D Character (Horse on Crystal Ball) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-72 h-72 md:w-96 md:h-96 my-4 flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              <img 
                src="/images/horse_mascot.png" 
                alt="무운 마스코트" 
                className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]"
              />
              
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
                <Link href="/yearly-fortune">
                  <div className="px-6 py-3 bg-gradient-to-r from-primary to-yellow-300 text-primary-foreground rounded-full font-bold shadow-[0_0_20px_rgba(255,215,0,0.5)] cursor-pointer hover:scale-105 transition-transform text-center border border-white/30">
                    2026년<br />운세 보기
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Menu Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl"
          >
            <Link href="/lifelong-saju">
              <Card className="bg-card hover:bg-card/80 border-white/10 transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center gap-3 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 mb-2 transition-transform group-hover:scale-110 duration-300">
                    <img src="/images/icon_crystal_ball.png" alt="평생사주" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-xl font-bold text-white">평생사주</h3>
                  <p className="text-sm text-muted-foreground">타고난 운명과 성격 분석</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/yearly-fortune">
              <Card className="bg-card hover:bg-card/80 border-white/10 transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center gap-3 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 mb-2 transition-transform group-hover:scale-110 duration-300">
                    <img src="/images/icon_stars.png" alt="올해운세" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-xl font-bold text-white">올해운세</h3>
                  <p className="text-sm text-muted-foreground">2026년 신년 운세 확인</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/compatibility">
              <Card className="bg-card hover:bg-card/80 border-white/10 transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center gap-3 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 mb-2 transition-transform group-hover:scale-110 duration-300">
                    <img src="/images/icon_heart.png" alt="궁합" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-xl font-bold text-white">궁합</h3>
                  <p className="text-sm text-muted-foreground">두 사람의 궁합 분석</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/tojeong">
              <Card className="bg-card hover:bg-card/80 border-white/10 transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center gap-3 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 mb-2 transition-transform group-hover:scale-110 duration-300">
                    <img src="/images/icon_crystal_ball.png" alt="토정비결" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-xl font-bold text-white">토정비결</h3>
                  <p className="text-sm text-muted-foreground">한 해의 신비로운 지침서</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/manselyeok">
              <Card className="bg-card hover:bg-card/80 border-white/10 transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center gap-3 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 mb-2 transition-transform group-hover:scale-110 duration-300">
                    <img src="/images/icon_calendar.png" alt="만세력" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-xl font-bold text-white">만세력</h3>
                  <p className="text-sm text-muted-foreground">정확한 사주팔자 계산</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </section>

        {/* SEO Content Section for AdSense Approval */}
        <section className="w-full max-w-4xl space-y-12 py-12 border-t border-white/5">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <BookOpen className="text-primary w-8 h-8" />
              사주와 운세: 당신의 삶을 이해하는 지혜
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white/90">사주팔자란 무엇인가요?</h3>
                <p>
                  사주팔자는 사람이 태어난 연(年), 월(月), 일(日), 시(時)의 네 가지 기둥(사주)과 여덟 글자(팔자)를 의미합니다. 이는 동양 철학의 정수인 음양오행설을 바탕으로 한 사람의 타고난 기운과 운명의 흐름을 분석하는 학문입니다. 무운은 이러한 전통적인 지혜를 현대적인 알고리즘으로 풀어내어 누구나 쉽게 자신의 성향과 미래를 엿볼 수 있게 돕습니다.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white/90">2026년 병오년(丙午年)의 기운</h3>
                <p>
                  2026년은 '붉은 말의 해'인 병오년입니다. 천간의 병(丙)과 지지의 오(午)가 모두 강력한 불(火)의 기운을 상징합니다. 이는 열정과 변화, 그리고 폭발적인 성장의 에너지를 의미합니다. 무운의 올해 운세 서비스는 이러한 병오년의 특수한 기운이 개인의 사주와 어떻게 상호작용하는지 분석하여 최적의 조언을 제공합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <Star className="text-yellow-400 w-6 h-6" />
              <h4 className="font-bold text-white">정확한 알고리즘</h4>
              <p className="text-sm text-muted-foreground">수천 년간 축적된 명리학 데이터를 바탕으로 정교한 계산 결과를 제공합니다.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <ShieldCheck className="text-green-400 w-6 h-6" />
              <h4 className="font-bold text-white">개인정보 보호</h4>
              <p className="text-sm text-muted-foreground">입력하신 생년월일 정보는 서버에 저장되지 않으며 오직 결과 계산에만 사용됩니다.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <Info className="text-blue-400 w-6 h-6" />
              <h4 className="font-bold text-white">무료 서비스</h4>
              <p className="text-sm text-muted-foreground">복잡한 가입이나 결제 없이 모든 운세 풀이를 무료로 이용하실 수 있습니다.</p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 space-y-4">
            <h3 className="text-xl font-bold text-white">운세를 대하는 올바른 자세</h3>
            <p className="text-muted-foreground leading-relaxed">
              운세는 정해진 미래를 맞추는 예언이 아니라, 현재 내가 가진 기운의 흐름을 파악하여 더 나은 선택을 하도록 돕는 가이드라인입니다. 좋은 운이 왔을 때는 용기를 내어 도전하고, 조심해야 할 운이 왔을 때는 자신을 돌아보며 내실을 다지는 지혜가 필요합니다. 무운과 함께 당신의 삶을 더욱 풍요롭게 가꾸어 보세요.
            </p>
          </div>
        </section>

        <footer className="w-full pt-12 pb-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-xl font-bold text-white">무운 (MuUn)</h2>
              <p className="text-xs text-muted-foreground">© 2026 무운. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
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
