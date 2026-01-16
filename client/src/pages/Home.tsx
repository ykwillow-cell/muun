import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
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

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen gap-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-2 backdrop-blur-sm">
            무운
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
            회원가입 없는<br />
            <span className="text-primary">무료 운세</span>
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
            
            {/* Floating CTA Button over the crystal ball part */}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl"
        >
          <Link href="/lifelong-saju">
            <Card className="bg-card hover:bg-card/80 border-white/10 transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center gap-3 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 mb-2 transition-transform group-hover:scale-110 duration-300">
                  <img src="/images/icon_crystal_ball.png" alt="평생사주" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold text-white">평생사주</h3>
                <p className="text-sm text-muted-foreground">
                  타고난 운명과 성격 분석
                </p>
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
                <p className="text-sm text-muted-foreground">
                  2026년 신년 운세 확인
                </p>
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
                <p className="text-sm text-muted-foreground">
                  두 사람의 궁합 분석
                </p>
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
                <p className="text-sm text-muted-foreground">
                  정확한 사주팔자 계산
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p>© 2026 무운 (MuUn). All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
