import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Star, Sparkles, User, Zap, Briefcase, Share2, Activity, Quote, ScrollText, Calendar, Clock } from "lucide-react";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateSaju, SajuResult, calculateElementBalance, generateFortuneDetails } from "@/lib/saju";
import SajuChart from "@/components/SajuChart";
import LuckyItems from "@/components/LuckyItems";
import SajuGlossary from "@/components/SajuGlossary";
import YearlyFortuneContent from "@/components/YearlyFortuneContent";
import iljuData from "@/lib/ilju-data.json";
import { trackEvent, trackCustomEvent } from "@/lib/ga4";
import { 
  generateYearlyFortune, 
  FortuneResult 
} from "@/lib/fortune-templates";

const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime: z.string().min(1, "태어난 시간을 입력해주세요"),
  calendarType: z.enum(["solar", "lunar"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function YearlyFortune() {
  const [result, setResult] = useState<SajuResult | null>(null);
  const [fortunes, setFortunes] = useState<{
    general: FortuneResult | null;
    wealth: FortuneResult | null;
    career: FortuneResult | null;
  }>({
    general: null,
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
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset(parsed);
    }
  }, [form]);

  const onSubmit = async (data: FormValues) => {
    // 결과 확인 버튼 클릭 이벤트 추적
    trackCustomEvent("check_fortune_result", {
      fortune_type: "신년운세",
      gender: data.gender,
      calendar_type: data.calendarType
    });

    localStorage.setItem("muun_user_data", JSON.stringify(data));
    const date = new Date(`${data.birthDate}T${data.birthTime}`);
    const sajuResult = calculateSaju(date, data.gender);
    setResult(sajuResult);
    window.scrollTo(0, 0);

    // 템플릿 기반 운세 생성 (비용 없음!)
    const allFortunes = generateYearlyFortune(sajuResult);
    const details = generateFortuneDetails(sajuResult);
    setExtraInfo(details);
    
    // 순차적으로 표시하는 효과를 위해 딜레이 적용
    const fortuneKeys = ['general', 'wealth', 'career'] as const;
    
    for (let i = 0; i < fortuneKeys.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
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
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-white">2026년 무료 신년운세</h1>
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-8`}
          >
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
                <ScrollText className="w-4 h-4 text-primary" />
                <span className="text-[11px] md:text-xs font-bold tracking-widest text-primary uppercase">2026년 병오년 운세</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">무료 신년운세</h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
                새로운 해의 기운을 미리 확인하고<br className="md:hidden" /> 당신의 한 해를 설계해보세요
              </p>
            </div>

            {/* Input Form Card */}
            <Card className="glass-panel border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b border-white/5 p-6 md:p-10">
                <CardTitle className="text-white flex items-center gap-3 text-xl md:text-2xl">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  운세 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-10">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                  {/* Name & Gender Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        이름
                      </Label>
                      <Input
                        id="name"
                        placeholder="이름을 입력해주세요"
                        {...form.register("name")}
                        className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-2xl focus:ring-primary/50 focus:border-primary transition-all text-base"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-white text-base font-medium ml-1 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
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
                        className="w-full h-14 bg-white/5 p-1.5 rounded-2xl border border-white/10"
                      >
                        <ToggleGroupItem
                          value="male"
                          className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white/70 transition-all font-medium text-base"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white/70 transition-all font-medium text-base"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  {/* Birth Date & Time Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="birthDate" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        생년월일
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...form.register("birthDate")}
                        className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-primary/50 focus:border-primary transition-all text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="birthTime" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        태어난 시간
                      </Label>
                      <Input
                        id="birthTime"
                        type="time"
                        {...form.register("birthTime")}
                        className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-primary/50 focus:border-primary transition-all text-base"
                      />
                    </div>
                  </div>

                  {/* Calendar Type */}
                  <div className="space-y-3">
                    <Label className="text-white text-base font-medium ml-1 flex items-center gap-2">
                      <ScrollText className="w-4 h-4 text-primary" />
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
                      className="w-full md:w-64 h-14 bg-white/5 p-1.5 rounded-2xl border border-white/10"
                    >
                      <ToggleGroupItem
                        value="solar"
                        className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white/70 transition-all font-medium text-base"
                      >
                        양력
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="lunar"
                        className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white/70 transition-all font-medium text-base"
                      >
                        음력
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-16 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-primary-foreground font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    2026년 무료 신년운세 보기
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-4 md:p-5 text-center space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Star className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-white">2026년 총운</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-4 md:p-5 text-center space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mx-auto">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-white">재물운</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-4 md:p-5 text-center space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto">
                    <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-white">직업운</p>
                </CardContent>
              </Card>
            </div>

            {/* SEO 콘텐츠 */}
            <YearlyFortuneContent />
          </motion.div>
        </main>
      </div>
    );
  }

  const fortuneIcons: Record<string, React.ReactNode> = {
    general: <Star className="w-5 h-5" />,
    wealth: <Zap className="w-5 h-5" />,
    career: <Briefcase className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setResult(null)} className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg md:text-xl font-bold text-white">2026년 신년운세 결과</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary min-w-[44px] min-h-[44px]"
            onClick={() => {
              shareContent({
                title: '무운 2026년 신년운세',
                text: `${form.getValues('name')}님의 2026년 신년운세 결과를 확인해보세요!`,
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
          {/* 사주팔자 차트 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <ScrollText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">사주팔자</h2>
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
                  className="space-y-4"
                >
                  <Card className="bg-white/5 border-white/10 overflow-hidden rounded-2xl">
                    <CardHeader className="border-b border-white/5 p-4 md:p-6">
                      <CardTitle className="text-base md:text-lg flex items-center gap-2 text-primary">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          {fortuneIcons[key]}
                        </div>
                        {fortune.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                      <p className="text-sm md:text-base text-white/90 leading-relaxed whitespace-pre-line">
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
          <div className="space-y-3 pt-2">
            <Button 
              className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 min-h-[48px] md:min-h-[56px] rounded-xl font-medium"
              onClick={() => {
                shareContent({
                  title: '무운 2026년 신년운세',
                  text: `${form.getValues('name')}님의 2026년 신년운세 결과를 확인해보세요!`,
                });
              }}
            >
              친구에게 공유하기
            </Button>
            <Button 
              variant="ghost"
              className="w-full text-white/60 hover:text-white hover:bg-white/5 min-h-[48px] rounded-xl font-medium"
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
