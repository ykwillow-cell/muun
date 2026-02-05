import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Star, Sparkles, User, Zap, Briefcase, Activity, Heart, Quote, TrendingUp, Share2, ScrollText } from "lucide-react";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateSaju, SajuResult, calculateElementBalance, generateFortuneDetails } from "@/lib/saju";
import SajuChart from "@/components/SajuChart";
import LuckyItems from "@/components/LuckyItems";
import SajuGlossary from "@/components/SajuGlossary";
import iljuData from "@/lib/ilju-data.json";
import { trackEvent } from "@/lib/ga4";
import { 
  generateLifelongFortune, 
  FortuneResult 
} from "@/lib/fortune-templates";

const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime: z.string().min(1, "태어난 시간을 입력해주세요"),
  calendarType: z.enum(["solar", "lunar"]),
  isMarried: z.enum(["yes", "no"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function LifelongSaju() {
  const [result, setResult] = useState<SajuResult | null>(null);
  const [fortunes, setFortunes] = useState<{
    personality: FortuneResult | null;
    earlyLife: FortuneResult | null;
    midLife: FortuneResult | null;
    lateLife: FortuneResult | null;
    wealth: FortuneResult | null;
    career: FortuneResult | null;
  }>({
    personality: null,
    earlyLife: null,
    midLife: null,
    lateLife: null,
    wealth: null,
    career: null,
  });
  const [extraInfo, setExtraInfo] = useState<any>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "2000-01-01",
      birthTime: "12:00",
      calendarType: "solar",
      isMarried: "no",
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset({
        ...form.getValues(),
        ...parsed,
      });
    }
  }, [form]);

  const onSubmit = async (data: FormValues) => {
    localStorage.setItem("muun_user_data", JSON.stringify(data));
    const date = new Date(`${data.birthDate}T${data.birthTime}`);
    const sajuResult = calculateSaju(date, data.gender);
    setResult(sajuResult);
    window.scrollTo(0, 0);

    // 템플릿 기반 운세 생성 (비용 없음!)
    const allFortunes = generateLifelongFortune(sajuResult);
    const details = generateFortuneDetails(sajuResult);
    setExtraInfo(details);
    
    // 순차적으로 표시하는 효과를 위해 딜레이 적용
    const fortuneKeys = ['personality', 'earlyLife', 'midLife', 'lateLife', 'wealth', 'career'] as const;
    
    for (let i = 0; i < fortuneKeys.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setFortunes(prev => ({
        ...prev,
        [fortuneKeys[i]]: allFortunes[fortuneKeys[i]]
      }));
    }
  };

  const commonMaxWidth = "w-full max-w-4xl mx-auto";

  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">무료 평생사주 풀이</h1>
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-8`}
          >
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[11px] md:text-xs font-bold tracking-widest text-primary uppercase">인생의 흐름을 읽는 지혜</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">무료 평생사주</h2>
              <p className="text-muted-foreground text-sm md:text-base">태어난 기운을 바탕으로 당신의 성격, 재물, 직업, 그리고 평생의 운을 분석합니다.</p>
            </div>

            <Card className="glass-panel border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b border-white/5 p-6 md:p-10">
                <CardTitle className="text-white flex items-center gap-3 text-xl md:text-2xl">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  사주 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-10">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-white text-base font-medium ml-1">이름</Label>
                      <Input
                        id="name"
                        placeholder="이름을 입력해주세요"
                        {...form.register("name")}
                        className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-white text-base font-medium ml-1">성별</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("gender")}
                        onValueChange={(value) => {
                          if (value) {
                            form.setValue("gender", value as "male" | "female");
                            trackEvent("User Input", "Change Gender", value);
                          }
                        }}
                        className="justify-start w-full h-14 bg-white/5 p-1 rounded-2xl border border-white/10"
                      >
                        <ToggleGroupItem
                          value="male"
                          className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white transition-all px-4"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white transition-all px-4"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="birthDate" className="text-white text-base font-medium ml-1">생년월일</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...form.register("birthDate")}
                        className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="birthTime" className="text-white text-base font-medium ml-1">태어난 시간</Label>
                      <Input
                        id="birthTime"
                        type="time"
                        {...form.register("birthTime")}
                        className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-white text-base font-medium ml-1">날짜 구분</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("calendarType")}
                        onValueChange={(value) => {
                          if (value) {
                            form.setValue("calendarType", value as "solar" | "lunar");
                            trackEvent("User Input", "Change Calendar Type", value);
                          }
                        }}
                        className="justify-start w-full h-14 bg-white/5 p-1 rounded-2xl border border-white/10"
                      >
                        <ToggleGroupItem
                          value="solar"
                          className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white transition-all px-4"
                        >
                          양력
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="lunar"
                          className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white transition-all px-4"
                        >
                          음력
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-white text-base font-medium ml-1">결혼 유무</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("isMarried")}
                        onValueChange={(value) => {
                          if (value) {
                            form.setValue("isMarried", value as "yes" | "no");
                            trackEvent("User Input", "Change Marriage Status", value);
                          }
                        }}
                        className="justify-start w-full h-14 bg-white/5 p-1 rounded-2xl border border-white/10"
                      >
                        <ToggleGroupItem
                          value="no"
                          className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white transition-all px-4"
                        >
                          미혼
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="yes"
                          className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white transition-all px-4"
                        >
                          기혼
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    onClick={() => trackEvent("User Action", "Click View Fortune", "Lifelong Saju")}
                    className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    무료 평생사주 보기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  const fortuneIcons: Record<string, React.ReactNode> = {
    personality: <User className="w-5 h-5" />,
    earlyLife: <Star className="w-5 h-5" />,
    midLife: <TrendingUp className="w-5 h-5" />,
    lateLife: <Heart className="w-5 h-5" />,
    wealth: <Zap className="w-5 h-5" />,
    career: <Briefcase className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setResult(null)} className="mr-2 text-white hover:bg-white/10">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-white">무료 평생사주 풀이 결과</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => {
              shareContent({
                title: '무운 무료 평생사주',
                text: `${form.getValues('name')}님의 평생사주 결과를 확인해보세요!`,
              });
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-[1280px] px-4 py-8 space-y-8">
        {/* 사주 정보 요약 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-4 gap-2 sm:gap-4"
        >
          {[
            { label: "시주", pillar: result.hourPillar },
            { label: "일주", pillar: result.dayPillar },
            { label: "월주", pillar: result.monthPillar },
            { label: "연주", pillar: result.yearPillar },
          ].map((item, i) => (
            <Card key={i} className="bg-white/5 border-white/10 text-center overflow-hidden">
              <div className="py-1 text-[10px] sm:text-xs text-white/60 border-b border-white/5">{item.label}</div>
              <CardContent className="p-2 sm:p-4">
                <div className="text-xl sm:text-3xl font-bold text-primary mb-1">{item.pillar.stem}</div>
                <div className="text-xl sm:text-3xl font-bold text-white">{item.pillar.branch}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* 오행 분석 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                오행 에너지 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SajuChart data={calculateElementBalance(result)} />
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                나의 행운 아이템
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LuckyItems result={result} />
            </CardContent>
          </Card>
        </div>

        {/* 운세 상세 풀이 */}
        <div className="space-y-6">
          <AnimatePresence>
            {(Object.keys(fortunes) as Array<keyof typeof fortunes>).map((key) => (
              fortunes[key] && (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Card className="bg-white/5 border-white/10 overflow-hidden">
                    <CardHeader className="bg-primary/10 border-b border-white/5">
                      <CardTitle className="text-primary flex items-center gap-2">
                        {fortuneIcons[key]}
                        {fortunes[key]?.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-2">
                          <Quote className="w-5 h-5 text-primary/40 mt-1 flex-shrink-0" />
                          <p className="text-lg font-semibold text-white leading-relaxed">
                            {fortunes[key]?.summary}
                          </p>
                        </div>
                        <div className="pl-7 space-y-4">
                          {fortunes[key]?.content.split('\n').map((para, i) => (
                            <p key={i} className="text-white/70 leading-relaxed">
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        <SajuGlossary />
      </main>
    </div>
  );
}
