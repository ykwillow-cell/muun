import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Info, Share2, Sparkles, RefreshCcw, Zap, ArrowRight, User, Activity, ScrollText, Calendar, Clock } from "lucide-react";
import { Link, useLocation } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateSaju, SajuResult, FiveElement } from "@/lib/saju";
import SajuGlossary from "@/components/SajuGlossary";
import ManselyeokContent from "@/components/ManselyeokContent";

// 폼 스키마 정의
const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime: z.string().min(1, "태어난 시간을 입력해주세요"),
  calendarType: z.enum(["solar", "lunar"]),
});

type FormValues = z.infer<typeof formSchema>;

const getElementColor = (element: FiveElement) => {
  switch (element) {
    case '木': return 'text-green-400 border-green-400/30 bg-green-400/10';
    case '火': return 'text-red-400 border-red-400/30 bg-red-400/10';
    case '土': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    case '金': return 'text-gray-300 border-gray-300/30 bg-gray-300/10';
    case '水': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    default: return 'text-white border-white/30 bg-white/10';
  }
};

export default function Manselyeok() {
  const [result, setResult] = useState<SajuResult | null>(null);
  const [location, setLocation] = useLocation();
  
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

  const onSubmit = (data: FormValues) => {
    localStorage.setItem("muun_user_data", JSON.stringify(data));
    
    // 오늘의 운세에서 온 경우 바로 돌아가기
    const params = new URLSearchParams(window.location.search);
    if (params.get("redirect") === "daily-fortune") {
      setLocation("/daily-fortune");
      return;
    }

    const date = new Date(`${data.birthDate}T${data.birthTime}`);
    const sajuResult = calculateSaju(date, data.gender);
    setResult(sajuResult);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const commonMaxWidth = "w-full max-w-4xl mx-auto";

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-white">무료 만세력</h1>
          </div>
          {result && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
                onClick={() => setResult(null)}
              >
                <RefreshCcw className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-emerald-400 min-w-[44px] min-h-[44px]"
                onClick={() => {
                  shareContent({
                    title: '무운 만세력 결과',
                    text: `${form.getValues('name')}님의 사주팔자 만세력 결과를 확인해보세요!`,
                  });
                }}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-8 md:py-16">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`${commonMaxWidth} space-y-8`}
            >
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] md:text-xs font-bold tracking-widest text-emerald-400 uppercase">정통 만세력 분석</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">무료 만세력</h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
                  정확한 사주팔자 분석을 위해<br className="md:hidden" /> 태어난 시간을 입력해주세요
                </p>
              </div>

              {/* Input Form Card */}
              <Card className="glass-panel border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
                <CardHeader className="border-b border-white/5 p-6 md:p-10">
                  <CardTitle className="text-white flex items-center gap-3 text-xl md:text-2xl">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                    </div>
                    사용자 정보 입력
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-10">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                    {/* Name & Gender Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                          <User className="w-4 h-4 text-emerald-400" />
                          이름
                        </Label>
                        <Input 
                          id="name" 
                          placeholder="이름을 입력해주세요" 
                          {...form.register("name")} 
                          className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-2xl focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-base"
                        />
                        {form.formState.errors.name && (
                          <p className="text-destructive text-xs font-medium ml-1">{form.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label className="text-white text-base font-medium ml-1 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          성별
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("gender")}
                          onValueChange={(value) => {
                            if (value) form.setValue("gender", value as "male" | "female");
                          }}
                          className="w-full h-14 bg-white/5 p-1.5 rounded-2xl border border-white/10"
                        >
                          <ToggleGroupItem
                            value="male"
                            className="flex-1 h-full rounded-xl data-[state=on]:bg-emerald-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base"
                          >
                            남성
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="female"
                            className="flex-1 h-full rounded-xl data-[state=on]:bg-emerald-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base"
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
                          <Calendar className="w-4 h-4 text-emerald-400" />
                          생년월일
                        </Label>
                        <Input 
                          id="birthDate" 
                          type="date" 
                          {...form.register("birthDate")} 
                          className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="birthTime" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-400" />
                          태어난 시간
                        </Label>
                        <Input 
                          id="birthTime" 
                          type="time" 
                          {...form.register("birthTime")} 
                          className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-base"
                        />
                      </div>
                    </div>

                    {/* Calendar Type */}
                    <div className="space-y-3">
                      <Label className="text-white text-base font-medium ml-1 flex items-center gap-2">
                        <ScrollText className="w-4 h-4 text-emerald-400" />
                        날짜 구분
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("calendarType")}
                        onValueChange={(value) => {
                          if (value) form.setValue("calendarType", value as "solar" | "lunar");
                        }}
                        className="w-full md:w-64 h-14 bg-white/5 p-1.5 rounded-2xl border border-white/10"
                      >
                        <ToggleGroupItem
                          value="solar"
                          className="flex-1 h-full rounded-xl data-[state=on]:bg-emerald-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base"
                        >
                          양력
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="lunar"
                          className="flex-1 h-full rounded-xl data-[state=on]:bg-emerald-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base"
                        >
                          음력
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full h-16 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Activity className="w-5 h-5 mr-2" />
                      무료 만세력 분석하기
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Feature Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card className="bg-white/5 border-white/10 rounded-2xl">
                  <CardContent className="p-4 md:p-5 text-center space-y-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto">
                      <ScrollText className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                    </div>
                    <p className="text-xs md:text-sm font-medium text-white">사주팔자</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 rounded-2xl">
                  <CardContent className="p-4 md:p-5 text-center space-y-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mx-auto">
                      <Activity className="w-5 h-5 md:w-6 md:h-6 text-teal-400" />
                    </div>
                    <p className="text-xs md:text-sm font-medium text-white">오행 분석</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 rounded-2xl">
                  <CardContent className="p-4 md:p-5 text-center space-y-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto">
                      <Zap className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                    </div>
                    <p className="text-xs md:text-sm font-medium text-white">대운 세운</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 rounded-2xl">
                  <CardContent className="p-4 md:p-5 text-center space-y-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto">
                      <Info className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                    </div>
                    <p className="text-xs md:text-sm font-medium text-white">상세 해석</p>
                  </CardContent>
                </Card>
              </div>

              {/* SEO 콘텐츠 */}
              <ManselyeokContent />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`${commonMaxWidth} space-y-8 md:space-y-10`}
            >
              {/* Result Header */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl">
                  <span className="text-[11px] md:text-xs font-bold tracking-widest text-emerald-400 uppercase">만세력 분석 결과</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">{form.getValues('name')}님의 사주팔자</h2>
              </div>

              {/* 사주팔자 테이블 */}
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 p-4 md:p-6">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2 text-emerald-400">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <ScrollText className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    사주팔자 (四柱八字)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="grid grid-cols-4 gap-2 md:gap-4">
                    {[
                      { label: '시주', pillar: result.hourPillar },
                      { label: '일주', pillar: result.dayPillar },
                      { label: '월주', pillar: result.monthPillar },
                      { label: '년주', pillar: result.yearPillar },
                    ].map((item) => (
                      <div key={item.label} className="text-center space-y-2">
                        <p className="text-xs md:text-sm text-white/60">{item.label}</p>
                        <div className="space-y-1">
                          <div className={`p-2 md:p-3 rounded-xl border ${getElementColor(item.pillar.stemElement)}`}>
                            <p className="text-lg md:text-2xl font-bold">{item.pillar.stem}</p>
                            <p className="text-[10px] md:text-xs opacity-70">{item.pillar.stemElement}</p>
                          </div>
                          <div className={`p-2 md:p-3 rounded-xl border ${getElementColor(item.pillar.branchElement)}`}>
                            <p className="text-lg md:text-2xl font-bold">{item.pillar.branch}</p>
                            <p className="text-[10px] md:text-xs opacity-70">{item.pillar.branchElement}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 오행 분석 */}
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 p-4 md:p-6">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2 text-emerald-400">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Activity className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    오행 분석
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="grid grid-cols-5 gap-2 md:gap-4">
                    {(['木', '火', '土', '金', '水'] as FiveElement[]).map((element) => {
                      const count = [
                        result.yearPillar.stemElement,
                        result.yearPillar.branchElement,
                        result.monthPillar.stemElement,
                        result.monthPillar.branchElement,
                        result.dayPillar.stemElement,
                        result.dayPillar.branchElement,
                        result.hourPillar.stemElement,
                        result.hourPillar.branchElement,
                      ].filter(e => e === element).length;
                      
                      return (
                        <div key={element} className={`text-center p-3 md:p-4 rounded-xl border ${getElementColor(element)}`}>
                          <p className="text-lg md:text-2xl font-bold">{element}</p>
                          <p className="text-xs md:text-sm mt-1">{count}개</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 용어 설명 */}
              <SajuGlossary />

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button 
                  className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 min-h-[48px] md:min-h-[56px] rounded-xl font-medium"
                  onClick={() => {
                    shareContent({
                      title: '무운 만세력 결과',
                      text: `${form.getValues('name')}님의 사주팔자 만세력 결과를 확인해보세요!`,
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
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
