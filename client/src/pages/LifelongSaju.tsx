import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Star, Sparkles, User, Zap, Briefcase, Activity, Heart, Quote, TrendingUp, Share2, ScrollText, Calendar, Clock } from "lucide-react";
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
import SajuInfoContent from "@/components/SajuInfoContent";
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

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-base md:text-lg font-bold text-white">무료 평생사주 풀이</h1>
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-5`}
          >
            {/* Hero Section - 컴팩트하게 */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-xl">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span className="text-[10px] md:text-xs font-bold tracking-wider text-purple-400 uppercase">인생의 흐름을 읽는 지혜</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">무료 평생사주</h2>
              <p className="text-muted-foreground text-xs md:text-sm">
                태어난 기운을 바탕으로 당신의 성격, 재물, 직업, 그리고 평생의 운을 분석합니다
              </p>
            </div>

            {/* Input Form Card - 컴팩트하게 */}
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-400" />
                  </div>
                  사주 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name & Gender Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-white text-sm font-medium flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400" />
                        이름
                      </Label>
                      <Input
                        id="name"
                        placeholder="이름을 입력해주세요"
                        {...form.register("name")}
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        성별
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("gender")}
                        onValueChange={(value) => {
                          if (value) {
                            form.setValue("gender", value as "male" | "female");
                            trackEvent("User Input", "Change Gender", value);
                          }
                        }}
                        className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                      >
                        <ToggleGroupItem
                          value="male"
                          className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  {/* Birth Date & Time Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate" className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        생년월일
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...form.register("birthDate")}
                        className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="birthTime" className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        태어난 시간
                      </Label>
                      <Input
                        id="birthTime"
                        type="time"
                        {...form.register("birthTime")}
                        className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Calendar Type & Marriage Status Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                        <ScrollText className="w-3.5 h-3.5 text-purple-400" />
                        날짜 구분
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("calendarType")}
                        onValueChange={(value) => {
                          if (value) {
                            form.setValue("calendarType", value as "solar" | "lunar");
                            trackEvent("User Input", "Change Calendar Type", value);
                          }
                        }}
                        className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                      >
                        <ToggleGroupItem
                          value="solar"
                          className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                        >
                          양력
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="lunar"
                          className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                        >
                          음력
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-purple-400" />
                        결혼 유무
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("isMarried")}
                        onValueChange={(value) => {
                          if (value) {
                            form.setValue("isMarried", value as "yes" | "no");
                            trackEvent("User Input", "Change Marriage Status", value);
                          }
                        }}
                        className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                      >
                        <ToggleGroupItem
                          value="no"
                          className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                        >
                          미혼
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="yes"
                          className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                        >
                          기혼
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    onClick={() => trackEvent("User Action", "Click View Fortune", "Lifelong Saju")}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold text-sm md:text-base rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    무료 평생사주 보기
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Feature Cards - 더 컴팩트하게 */}
            <div className="grid grid-cols-4 gap-2 md:gap-3">
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto">
                    <User className="w-4 h-4 md:w-4.5 md:h-4.5 text-purple-400" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-white">타고난 성격</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center mx-auto">
                    <Zap className="w-4 h-4 md:w-4.5 md:h-4.5 text-yellow-400" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-white">재물운</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto">
                    <Briefcase className="w-4 h-4 md:w-4.5 md:h-4.5 text-blue-400" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-white">직업운</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-pink-500/10 flex items-center justify-center mx-auto">
                    <Heart className="w-4 h-4 md:w-4.5 md:h-4.5 text-pink-400" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-white">연애운</p>
                </CardContent>
              </Card>
            </div>

            {/* SEO 콘텐츠 */}
            <SajuInfoContent />
          </motion.div>
        </main>
      </div>
    );
  }

  const fortuneIcons: Record<string, React.ReactNode> = {
    personality: <User className="w-4 h-4" />,
    earlyLife: <Star className="w-4 h-4" />,
    midLife: <TrendingUp className="w-4 h-4" />,
    lateLife: <Heart className="w-4 h-4" />,
    wealth: <Zap className="w-4 h-4" />,
    career: <Briefcase className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setResult(null)} className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base md:text-lg font-bold text-white">무료 평생사주 풀이 결과</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-purple-400 min-w-[44px] min-h-[44px]"
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

      <main className="relative z-10 px-4 py-5 md:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${commonMaxWidth} space-y-5 md:space-y-6`}
        >
          {/* 사주팔자 차트 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <ScrollText className="w-4 h-4 text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-white">사주팔자</h2>
            </div>
            <SajuChart result={result} />
          </section>

          {/* 행운 아이템 */}
          <LuckyItems result={result} />

          {/* 운세 섹션들 */}
          <AnimatePresence>
            {Object.entries(fortunes).map(([key, fortune], index) => (
              fortune && (
                <motion.section
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-3"
                >
                  <Card className="bg-white/5 border-white/10 overflow-hidden rounded-xl">
                    <CardHeader className="border-b border-white/5 px-4 py-3">
                      <CardTitle className="text-sm md:text-base flex items-center gap-2 text-purple-400">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          {fortuneIcons[key]}
                        </div>
                        {fortune.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm text-white/90 leading-relaxed whitespace-pre-line">
                        {fortune.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.section>
              )
            ))}
          </AnimatePresence>

          {/* 용어 설명 */}
          <SajuGlossary />

          {/* 다시 보기 버튼 */}
          <div className="space-y-2 pt-2">
            <Button 
              className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 h-11 rounded-xl font-medium text-sm"
              onClick={() => {
                shareContent({
                  title: '무운 무료 평생사주',
                  text: `${form.getValues('name')}님의 평생사주 결과를 확인해보세요!`,
                });
              }}
            >
              친구에게 공유하기
            </Button>
            <Button 
              variant="ghost"
              className="w-full text-white/60 hover:text-white hover:bg-white/5 h-11 rounded-xl font-medium text-sm"
              onClick={() => setResult(null)}
            >
              다시 보기
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
