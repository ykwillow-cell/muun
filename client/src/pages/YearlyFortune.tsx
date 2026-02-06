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

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-base md:text-lg font-bold text-white">2026년 무료 신년운세</h1>
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
                <ScrollText className="w-3 h-3 text-primary" />
                <span className="text-[10px] md:text-xs font-bold tracking-wider text-primary uppercase">2026년 병오년 운세</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">무료 신년운세</h2>
              <p className="text-muted-foreground text-xs md:text-sm">
                새로운 해의 기운을 미리 확인하고 당신의 한 해를 설계해보세요
              </p>
            </div>

            {/* Input Form Card - 컴팩트하게 */}
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  운세 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name & Gender Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-white text-sm font-medium flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-primary" />
                        이름
                      </Label>
                      <Input
                        id="name"
                        placeholder="이름을 입력해주세요"
                        {...form.register("name")}
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-primary/50 focus:border-primary transition-all text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
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
                          className="h-full rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white/70 transition-all font-medium text-sm"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="h-full rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white/70 transition-all font-medium text-sm"
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
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        생년월일
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...form.register("birthDate")}
                        className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-primary/50 focus:border-primary transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="birthTime" className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        태어난 시간
                      </Label>
                      <Input
                        id="birthTime"
                        type="time"
                        {...form.register("birthTime")}
                        className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-primary/50 focus:border-primary transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Calendar Type */}
                  <div className="space-y-1.5">
                    <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                      <ScrollText className="w-3.5 h-3.5 text-primary" />
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
                      className="w-full md:w-48 h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                    >
                      <ToggleGroupItem
                        value="solar"
                        className="h-full rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white/70 transition-all font-medium text-sm"
                      >
                        양력
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="lunar"
                        className="h-full rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white/70 transition-all font-medium text-sm"
                      >
                        음력
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-primary-foreground font-bold text-sm md:text-base rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    2026년 무료 신년운세 보기
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Feature Cards - 더 컴팩트하게 */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-3 md:p-4 text-center space-y-1.5">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-white">2026년 총운</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-3 md:p-4 text-center space-y-1.5">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mx-auto">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-white">재물운</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-3 md:p-4 text-center space-y-1.5">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto">
                    <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-white">직업운</p>
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
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base md:text-lg font-bold text-white">2026년 신년운세 결과</h1>
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

      <main className="relative z-10 px-4 py-5 md:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${commonMaxWidth} space-y-5 md:space-y-6`}
        >
          {/* 사주팔자 차트 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <ScrollText className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-white">{form.getValues('name')}님의 사주팔자</h2>
            </div>
            <Card className="glass-panel border-white/5 rounded-2xl overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <SajuChart result={result} />
              </CardContent>
            </Card>
          </section>

          {/* 오행 분석 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-white">오행 분석</h2>
            </div>
            <Card className="glass-panel border-white/5 rounded-2xl overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-3">
                  {calculateElementBalance(result).map((element) => (
                    <div key={element.name} className="flex items-center gap-3">
                      <span className="w-8 text-center font-bold text-base" style={{ color: element.color }}>
                        {element.name}
                      </span>
                      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${element.value}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: element.color }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs text-white/60">{element.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 행운 아이템 */}
          <LuckyItems result={result} extraInfo={extraInfo} />

          {/* 운세 결과 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-white">2026년 운세 풀이</h2>
            </div>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {Object.entries(fortunes).map(([key, fortune]) => {
                  if (!fortune) return null;
                  const titles: Record<string, string> = {
                    general: "2026년 총운",
                    wealth: "재물운",
                    career: "직업운",
                  };
                  const colors: Record<string, string> = {
                    general: "primary",
                    wealth: "yellow-400",
                    career: "blue-400",
                  };
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Card className="glass-panel border-white/5 rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-white/5 px-4 py-3">
                          <CardTitle className="text-white flex items-center gap-2 text-base">
                            <span className={`text-${colors[key]}`}>{fortuneIcons[key]}</span>
                            {titles[key]}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
                            {fortune.content}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>

          {/* 일주 해석 */}
          {result && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Quote className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-white">일간 성격 분석</h2>
              </div>
              <Card className="glass-panel border-white/5 rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <p className="text-white/80 text-sm leading-relaxed">
                    {(iljuData as Record<string, string>)[`${result.day.천간}${result.day.지지}`] || 
                     "일주 정보를 불러올 수 없습니다."}
                  </p>
                </CardContent>
              </Card>
            </section>
          )}

          {/* 용어 설명 */}
          <SajuGlossary />

          {/* 다시 보기 버튼 */}
          <Button
            onClick={() => setResult(null)}
            className="w-full h-12 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl"
          >
            다른 정보로 다시 보기
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
