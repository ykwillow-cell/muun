import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Sparkles, Star, Heart, Coffee, MapPin, Palette, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDailyFortune, DailyFortuneResult } from "@/lib/dailyFortune";
import { shareContent } from "@/lib/share";

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

  if (!userData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <Card className="bg-card border-white/10 max-w-md w-full text-center p-8 space-y-6">
          <Sparkles className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-2xl font-bold text-white">정보가 필요합니다</h2>
          <p className="text-muted-foreground">
            오늘의 운세를 보려면 먼저 사주 정보를 입력해야 합니다.
          </p>
          <Link href="/manselyeok?redirect=daily-fortune">
            <Button className="w-full bg-primary text-background font-bold">
              정보 입력하러 가기
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!fortune) return null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">오늘의 운세</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary"
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

      <main className="container mx-auto max-w-[1280px] px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          {/* Score Section */}
          <section className="text-center space-y-4">
            <div className="relative inline-block">
              <svg className="w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-white/5"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray="553"
                  initial={{ strokeDashoffset: 553 }}
                  animate={{ strokeDashoffset: 553 - (553 * fortune.score) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-primary"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white">{fortune.score}</span>
                <span className="text-sm text-primary font-bold">LUCKY SCORE</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">{fortune.summary}</h2>
          </section>

          {/* Detail Card */}
          <Card className="bg-card border-white/10 overflow-hidden">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <Zap className="w-5 h-5" />
                오늘의 총평
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-lg text-white/90 leading-relaxed">
                {fortune.detail}
              </p>
            </CardContent>
          </Card>

          {/* Lucky Items Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card border-white/10">
              <CardContent className="p-6 flex items-center gap-4">
                <Palette className="w-8 h-8 text-pink-400" />
                <div>
                  <p className="text-xs text-muted-foreground">행운의 컬러</p>
                  <p className="font-bold text-white">{fortune.luckyColor}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-white/10">
              <CardContent className="p-6 flex items-center gap-4">
                <Coffee className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-xs text-muted-foreground">추천 음식</p>
                  <p className="font-bold text-white">{fortune.luckyFood}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-white/10">
              <CardContent className="p-6 flex items-center gap-4">
                <Star className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-xs text-muted-foreground">행운의 아이템</p>
                  <p className="font-bold text-white">{fortune.luckyItem}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-white/10">
              <CardContent className="p-6 flex items-center gap-4">
                <MapPin className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-xs text-muted-foreground">행운의 방향</p>
                  <p className="font-bold text-white">{fortune.direction}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="pt-6">
            <Button 
              className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 py-6"
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
      </main>
    </div>
  );
}
