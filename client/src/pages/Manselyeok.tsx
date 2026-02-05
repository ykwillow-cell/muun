import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Info, Share2, Sparkles, RefreshCcw, Zap, ArrowRight, User, Activity, ScrollText } from "lucide-react";
import { Link, useLocation } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateSaju, SajuResult, FiveElement } from "@/lib/saju";
import SajuGlossary from "@/components/SajuGlossary";

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
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">무료 만세력</h1>
          </div>
          {result && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10"
                onClick={() => setResult(null)}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10"
                onClick={() => {
                  shareContent({
                    title: '무운 만세력 결과',
                    text: `${form.getValues('name')}님의 사주팔자 만세력 결과를 확인해보세요!`,
                  });
                }}
              >
                <Share2 className="h-4 w-4" />
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
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-[11px] md:text-xs font-bold tracking-widest text-primary uppercase">정통 만세력 분석</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">무료 만세력</h2>
                <p className="text-muted-foreground text-sm md:text-base">정확한 사주팔자 분석을 위해 태어난 시간을 입력해주세요.</p>
              </div>

              <Card className="glass-panel border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
                <CardHeader className="border-b border-white/5 p-6 md:p-10">
                  <CardTitle className="text-white flex items-center gap-3 text-xl md:text-2xl">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    사용자 정보 입력
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-10">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-white text-base font-medium ml-1">이름</Label>
                        <Input 
                          id="name" 
                          placeholder="이름을 입력하세요" 
                          {...form.register("name")} 
                          className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl focus:ring-primary/50 focus:border-primary transition-all"
                        />
                        {form.formState.errors.name && (
                          <p className="text-destructive text-xs font-medium ml-1">{form.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label className="text-white text-base font-medium ml-1">성별</Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("gender")}
                          onValueChange={(value) => {
                            if (value) form.setValue("gender", value as "male" | "female");
                          }}
                          className="justify-start h-14 bg-white/5 p-1 rounded-2xl border border-white/10"
                        >
                          <ToggleGroupItem value="male" className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white transition-all">남성</ToggleGroupItem>
                          <ToggleGroupItem value="female" className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white transition-all">여성</ToggleGroupItem>
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

                    <div className="space-y-3">
                      <Label className="text-white text-base font-medium ml-1">날짜 구분</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("calendarType")}
                        onValueChange={(value) => {
                          if (value) form.setValue("calendarType", value as "solar" | "lunar");
                        }}
                        className="justify-start h-14 bg-white/5 p-1 rounded-2xl border border-white/10"
                      >
                        <ToggleGroupItem value="solar" className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white transition-all">양력</ToggleGroupItem>
                        <ToggleGroupItem value="lunar" className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white transition-all">음력</ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    <Button type="submit" className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                      <Sparkles className="w-5 h-5 mr-2" />
                      무료 만세력 분석하기
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">Analysis Complete</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">{form.getValues("name")}님의 사주팔자</h2>
                <p className="text-muted-foreground">
                  {new Date(form.getValues("birthDate")).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} {form.getValues("birthTime")} 태생
                </p>
              </div>

              {/* 사주 팔자 그리드 */}
              <div className="grid grid-cols-4 gap-3 md:gap-6">
                {[
                  { label: '시주', pillar: result.hourPillar },
                  { label: '일주', pillar: result.dayPillar, isMain: true },
                  { label: '월주', pillar: result.monthPillar },
                  { label: '연주', pillar: result.yearPillar }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.label}</div>
                    <div className={`flex flex-col gap-3 p-4 md:p-6 rounded-[2rem] glass-panel border-white/5 ${item.isMain ? 'ring-2 ring-primary/30 bg-primary/5' : ''}`}>
                      {/* 천간 */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-full aspect-square rounded-2xl border flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105 ${getElementColor(item.pillar.stemElement)}`}>
                          <span className="text-2xl md:text-4xl font-black">{item.pillar.stem}</span>
                          <span className="text-[10px] md:text-xs font-bold opacity-70">{item.pillar.stemElement}</span>
                        </div>
                        <span className="text-[10px] md:text-xs font-medium text-white/40">{item.pillar.tenGodStem}</span>
                      </div>
                      {/* 지지 */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-full aspect-square rounded-2xl border flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105 ${getElementColor(item.pillar.branchElement)}`}>
                          <span className="text-2xl md:text-4xl font-black">{item.pillar.branch}</span>
                          <span className="text-[10px] md:text-xs font-bold opacity-70">{item.pillar.branchElement}</span>
                        </div>
                        <span className="text-[10px] md:text-xs font-medium text-white/40">{item.pillar.tenGodBranch}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 상세 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-panel border-white/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      나의 일주: {result.dayPillar.stem}{result.dayPillar.branch}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80 leading-relaxed">
                      {form.getValues("name")}님은 {result.dayPillar.stemElement}의 기운을 타고난 {result.dayPillar.stem}{result.dayPillar.branch}일주입니다. 
                      기본적으로 {result.dayPillar.tenGodStem}의 성향이 강하게 나타나며, {result.dayPillar.branchElement}의 지지를 받고 있습니다.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-white/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      오행 분포
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-end h-32 gap-2">
                      {(['木', '火', '土', '金', '水'] as FiveElement[]).map((el) => {
                        const count = [
                          result.yearPillar.stemElement, result.yearPillar.branchElement,
                          result.monthPillar.stemElement, result.monthPillar.branchElement,
                          result.dayPillar.stemElement, result.dayPillar.branchElement,
                          result.hourPillar.stemElement, result.hourPillar.branchElement,
                        ].filter(e => e === el).length;
                        return (
                          <div key={el} className="flex-1 flex flex-col items-center gap-2">
                            <div 
                              className={`w-full rounded-t-lg transition-all duration-1000 ${getElementColor(el).split(' ')[2]}`}
                              style={{ height: `${(count / 8) * 100}%`, minHeight: '4px' }}
                            />
                            <span className="text-xs font-bold text-white/60">{el}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <SajuGlossary />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
