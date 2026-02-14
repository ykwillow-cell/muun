import { useState, useEffect } from "react";
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Info, Share2, Sparkles, RefreshCcw, Zap, User, Activity, ScrollText, Calendar, Clock } from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";
import { Link, useLocation } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateSaju, SajuResult, FiveElement } from "@/lib/saju";
import { convertToSolarDate } from "@/lib/lunar-converter";
import SajuGlossary from "@/components/SajuGlossary";
import ManselyeokContent from "@/components/ManselyeokContent";

// 폼 스키마 정의
const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime: z.string(),
  birthTimeUnknown: z.boolean().default(false),
  calendarType: z.enum(["solar", "lunar"]),
  isLeapMonth: z.boolean().default(false),
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
  useCanonical('/manselyeok');

  const [result, setResult] = useState<SajuResult | null>(null);
  const [location, setLocation] = useLocation();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "2000-01-01",
      birthTime: "12:00",
      birthTimeUnknown: false,
      calendarType: "solar",
      isLeapMonth: false,
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

    const time = data.birthTimeUnknown ? "12:00" : data.birthTime;
    const date = convertToSolarDate(data.birthDate, time, data.calendarType, data.isLeapMonth);
    const sajuResult = calculateSaju(date, data.gender);
    setResult(sajuResult);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
      {/* '시간 모름' 시 안내 라벨 */}
      {form.watch("birthTimeUnknown") && (
        <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 relative z-50">
          <p className="text-[10px] md:text-xs text-primary text-center font-medium">
            태어난 시간을 제외한 삼주 분석 결과입니다
          </p>
        </div>
      )}
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-base md:text-lg font-bold text-white">만세력</h1>
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
                    page: 'manselyeok',
                    buttonType: 'icon',
                  });
                }}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`${commonMaxWidth} space-y-5`}
            >
              {/* Hero Section - 컴팩트하게 */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] md:text-xs font-bold tracking-wider text-emerald-400 uppercase">정통 만세력 분석</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">만세력</h2>
                <p className="text-muted-foreground text-xs md:text-sm">
                  정확한 사주팔자 분석을 위해 태어난 시간을 입력해주세요
                </p>
              </div>

              {/* Input Form Card - 컴팩트하게 */}
              <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                  <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-400" />
                    </div>
                    사용자 정보 입력
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name & Gender Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-emerald-400" />
                          이름
                        </Label>
                        <Input 
                          id="name" 
                          placeholder="이름" 
                          {...form.register("name")} 
                          className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"
                        />
                        {form.formState.errors.name && (
                          <p className="text-destructive text-xs font-medium">{form.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          성별
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("gender")}
                          onValueChange={(value) => {
                            if (value) form.setValue("gender", value as "male" | "female");
                          }}
                          className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                        >
                          <ToggleGroupItem
                            value="male"
                            className="h-full rounded-lg data-[state=on]:bg-emerald-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                          >
                            남성
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="female"
                            className="h-full rounded-lg data-[state=on]:bg-emerald-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                          >
                            여성
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>

                    {/* Birth Date & Time Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthDate" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          생년월일
                        </Label>
                        <DatePickerInput
                          id="birthDate"
                          {...form.register("birthDate")}
                          accentColor="emerald"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="birthTime" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          태어난 시간
                        </Label>
                        <div className="space-y-2">
                          <Input 
                            id="birthTime" 
                            type="time" 
                            {...form.register("birthTime")} 
                            disabled={form.watch("birthTimeUnknown")}
                            className={`h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm ${form.watch("birthTimeUnknown") ? 'opacity-40' : ''}`}
                          />
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              {...form.register("birthTimeUnknown")}
                              className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-emerald-500"
                            />
                            <span className="text-[11px] text-white/60">모름</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Calendar Type */}
                    <div className="space-y-1.5">
                      <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                        <ScrollText className="w-3.5 h-3.5 text-emerald-400" />
                        날짜 구분
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("calendarType")}
                        onValueChange={(value) => {
                          if (value) form.setValue("calendarType", value as "solar" | "lunar");
                        }}
                        className="w-full md:w-48 h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                      >
                        <ToggleGroupItem
                          value="solar"
                          className="h-full rounded-lg data-[state=on]:bg-emerald-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                        >
                          양력
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="lunar"
                          className="h-full rounded-lg data-[state=on]:bg-emerald-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                        >
                          음력
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    {/* 윤달 여부 (음력일 때만 표시) */}
                    {form.watch("calendarType") === "lunar" && (
                      <div className="flex items-center gap-2 px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            {...form.register("isLeapMonth")}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 accent-emerald-500"
                          />
                          <span className="text-sm text-white/80 group-hover:text-emerald-400 transition-colors">윤달(Leap Month)인 경우 체크</span>
                        </label>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm md:text-base rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                   만세력 분석하기
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Feature Cards - 더 컴팩트하게 */}
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                <Card className="bg-white/5 border-white/10 rounded-xl">
                  <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto">
                      <ScrollText className="w-4 h-4 md:w-4.5 md:h-4.5 text-emerald-400" />
                    </div>
                    <p className="text-[10px] md:text-xs font-medium text-white">사주팔자</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 rounded-xl">
                  <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-teal-500/10 flex items-center justify-center mx-auto">
                      <Activity className="w-4 h-4 md:w-4.5 md:h-4.5 text-teal-400" />
                    </div>
                    <p className="text-[10px] md:text-xs font-medium text-white">오행 분석</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 rounded-xl">
                  <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center mx-auto">
                      <Zap className="w-4 h-4 md:w-4.5 md:h-4.5 text-cyan-400" />
                    </div>
                    <p className="text-[10px] md:text-xs font-medium text-white">대운 세운</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 rounded-xl">
                  <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto">
                      <Info className="w-4 h-4 md:w-4.5 md:h-4.5 text-green-400" />
                    </div>
                    <p className="text-[10px] md:text-xs font-medium text-white">상세 해석</p>
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
              className={`${commonMaxWidth} space-y-5 md:space-y-6`}
            >
              {/* Result Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl">
                  <span className="text-[10px] md:text-xs font-bold tracking-wider text-emerald-400 uppercase">만세력 분석 결과</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">{form.getValues('name')}님의 사주팔자</h2>
              </div>

              {/* 사주팔자 테이블 */}
              <Card className="bg-white/5 border-white/10 rounded-xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-4 py-3">
                  <CardTitle className="text-sm md:text-base flex items-center gap-2 text-emerald-400">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <ScrollText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </div>
                    사주팔자 (四柱八字)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-4 gap-2 md:gap-3">
                    {[
                      { label: '시주', pillar: result.hourPillar },
                      { label: '일주', pillar: result.dayPillar },
                      { label: '월주', pillar: result.monthPillar },
                      { label: '년주', pillar: result.yearPillar },
                    ].map((item) => (
                      <div key={item.label} className="text-center space-y-1.5">
                        <p className="text-[10px] md:text-xs text-white/60">{item.label}</p>
                        <div className="space-y-1">
                          <div className={`p-2 rounded-lg border ${getElementColor(item.pillar.stemElement)}`}>
                            <p className="text-base md:text-xl font-bold">{item.pillar.stem}</p>
                            <p className="text-[9px] md:text-[10px] opacity-70">{item.pillar.stemElement}</p>
                          </div>
                          <div className={`p-2 rounded-lg border ${getElementColor(item.pillar.branchElement)}`}>
                            <p className="text-base md:text-xl font-bold">{item.pillar.branch}</p>
                            <p className="text-[9px] md:text-[10px] opacity-70">{item.pillar.branchElement}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 오행 분석 */}
              <Card className="bg-white/5 border-white/10 rounded-xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-4 py-3">
                  <CardTitle className="text-sm md:text-base flex items-center gap-2 text-emerald-400">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Activity className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </div>
                    오행 분석
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-5 gap-2">
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
                        <div key={element} className={`text-center p-2 md:p-3 rounded-lg border ${getElementColor(element)}`}>
                          <p className="text-base md:text-xl font-bold">{element}</p>
                          <p className="text-[10px] md:text-xs mt-0.5">{count}개</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 용어 설명 */}
              <SajuGlossary />

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button 
                  className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 h-11 rounded-xl font-medium text-sm"
                  onClick={() => {
                    shareContent({
                      title: '무운 만세력 결과',
                      text: `${form.getValues('name')}님의 사주팔자 만세력 결과를 확인해보세요!`,
                      page: 'manselyeok',
                      buttonType: 'text_button',
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
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
