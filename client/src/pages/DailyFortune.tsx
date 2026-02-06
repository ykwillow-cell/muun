import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Sparkles, Star, Heart, Coffee, MapPin, Palette, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDailyFortune, DailyFortuneResult } from "@/lib/dailyFortune";
import { shareContent } from "@/lib/share";
import DailyFortuneContent from "@/components/DailyFortuneContent";

export default function DailyFortune() {
  const [fortune, setFortune] = useState<DailyFortuneResult | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUserData(parsed);
      const result = getDailyFortune(new Date(parsed.birthDate), parsed.gender);
      setFortune(result);
    }
  }, []);

  const commonMaxWidth = "max-w-4xl mx-auto";

  if (!userData) {
    return (
      <div className="min-h-screen bg-background text-foreground relative antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-900/10 rounded-full blur-[120px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className={`${commonMaxWidth} px-4 h-14 flex items-center`}>
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-white">오늘의 운세</h1>
          </div>
        </header>

        <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-56px)] p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <Card className="bg-white/5 border-white/10 text-center p-6 md:p-8 space-y-6 rounded-2xl">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">정보가 필요합니다</h2>
              <p className="text-sm md:text-base text-muted-foreground">
                오늘의 운세를 보려면 먼저 사주 정보를 입력해야 합니다.
              </p>
              <Link href="/manselyeok?redirect=daily-fortune">
                <Button className="w-full bg-primary text-background font-bold min-h-[48px] rounded-xl">
                  정보 입력하러 가기
                </Button>
              </Link>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  if (!fortune) return null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-900/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className={`${commonMaxWidth} px-4 h-14 flex items-center justify-between`}>
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-white">오늘의 운세</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary min-w-[44px] min-h-[44px]"
            onClick={() => {
              shareContent({
                title: '무운 오늘의 운세',
                text: `오늘 내 운세 점수는 ${fortune.score}점! 당신의 운세도 확인해보세요.`,
              });
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 px-4 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${commonMaxWidth} space-y-6 md:space-y-8`}
        >
          {/* Hero Section */}
          <section className="text-center space-y-4 py-4 md:py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 backdrop-blur-xl">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-[11px] md:text-xs font-bold tracking-widest text-green-400 uppercase">오늘의 기운</span>
            </div>
            
            {/* Score Circle */}
            <div className="relative inline-block">
              <svg className="w-40 h-40 md:w-48 md:h-48">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-white/5"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * fortune.score) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-primary"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-black text-white">{fortune.score}</span>
                <span className="text-xs md:text-sm text-primary font-bold">LUCKY SCORE</span>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">{fortune.summary}</h2>
          </section>

          {/* Detail Card */}
          <Card className="bg-white/5 border-white/10 overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-white/5 p-4 md:p-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2 text-primary">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                오늘의 총평
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-sm md:text-base text-white/90 leading-relaxed">
                {fortune.detail}
              </p>
            </CardContent>
          </Card>

          {/* Lucky Items Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <Card className="bg-white/5 border-white/10 rounded-2xl">
              <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                  <Palette className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground">행운의 컬러</p>
                  <p className="font-bold text-white text-sm md:text-base truncate">{fortune.luckyColor}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 rounded-2xl">
              <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground">추천 음식</p>
                  <p className="font-bold text-white text-sm md:text-base truncate">{fortune.luckyFood}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 rounded-2xl">
              <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground">행운의 아이템</p>
                  <p className="font-bold text-white text-sm md:text-base truncate">{fortune.luckyItem}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 rounded-2xl">
              <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground">행운의 방향</p>
                  <p className="font-bold text-white text-sm md:text-base truncate">{fortune.direction}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Share Button */}
          <div className="pt-2">
            <Button 
              className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 min-h-[48px] md:min-h-[56px] rounded-xl font-medium"
              onClick={() => {
                shareContent({
                  title: '무운 오늘의 운세',
                  text: `오늘 내 운세 점수는 ${fortune.score}점! 당신의 운세도 확인해보세요.`,
                });
              }}
            >
              친구에게 공유하기
            </Button>
          </div>
        </motion.div>

        {/* SEO 콘텐츠 */}
        <div className={commonMaxWidth}>
          <DailyFortuneContent />
        </div>
      </main>
    </div>
  );
}
