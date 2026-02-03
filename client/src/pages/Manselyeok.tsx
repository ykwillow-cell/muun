import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Info, Share2, Sparkles, RefreshCcw, Zap, ArrowRight, User, Activity } from "lucide-react";
import { Link, useLocation } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateSaju, SajuResult, FiveElement } from "@/lib/saju";

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

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 antialiased">
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/60 border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold tracking-tight">무료 만세력</h1>
          </div>
          {result && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/5"
                onClick={() => setResult(null)}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/5"
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

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-center mb-10 space-y-2">
                <h2 className="text-3xl font-bold text-white">무료 만세력 사주 정보 입력</h2>
                <p className="text-muted-foreground">정확한 분석을 위해 태어난 시간을 입력해주세요.</p>
              </div>

              <Card className="glass-panel border-white/5 overflow-hidden">
                <CardHeader className="border-b border-white/5 mb-4">
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <User className="w-5 h-5" />
                    사용자 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 md:p-10">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">이름</Label>
                        <Input 
                          id="name" 
                          placeholder="이름을 입력하세요" 
                          {...form.register("name")} 
                          className="h-12 bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                        />
                        {form.formState.errors.name && (
                          <p className="text-destructive text-xs font-medium">{form.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">성별</Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("gender")}
                          onValueChange={(value) => {
                            if (value) form.setValue("gender", value as "male" | "female");
                          }}
                          className="justify-start h-12 p-1 bg-white/5 rounded-xl border border-white/10"
                        >
                          <ToggleGroupItem value="male" className="flex-1 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-background font-bold transition-all">남성</ToggleGroupItem>
                          <ToggleGroupItem value="female" className="flex-1 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-background font-bold transition-all">여성</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="birthDate" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">생년월일</Label>
                        <Input 
                          id="birthDate" 
                          type="date" 
                          {...form.register("birthDate")} 
                          className="h-12 bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="birthTime" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">태어난 시간</Label>
                        <Input 
                          id="birthTime" 
                          type="time" 
                          {...form.register("birthTime")} 
                          className="h-12 bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">달력 구분</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("calendarType")}
                        onValueChange={(value) => {
                          if (value) form.setValue("calendarType", value as "solar" | "lunar");
                        }}
                        className="justify-start h-12 p-1 bg-white/5 rounded-xl border border-white/10"
                      >
                        <ToggleGroupItem value="solar" className="flex-1 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-background font-bold transition-all">양력</ToggleGroupItem>
                        <ToggleGroupItem value="lunar" className="flex-1 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-background font-bold transition-all">음력</ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    <Button type="submit" className="w-full h-14 bg-primary text-background hover:bg-primary/90 font-black text-lg rounded-2xl shadow-[0_10px_30px_rgba(255,215,0,0.2)] transition-all active:scale-[0.98]">
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
                        <span className="text-[10px] font-bold text-muted-foreground">{item.pillar.tenGod}</span>
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black border transition-all shadow-lg ${getElementColor(item.pillar.stemElement)}`}>
                          {item.pillar.stem}
                        </div>
                      </div>
                      {/* 지지 */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black border transition-all shadow-lg ${getElementColor(item.pillar.branchElement)}`}>
                          {item.pillar.branch}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground">{item.pillar.branchElement}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 오늘의 운세 바로가기 버튼 */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-4"
              >
                <Link href="/daily-fortune">
                  <Button className="w-full h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-lg rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                    <Zap className="w-6 h-6 fill-white" />
                    오늘의 운세 확인하러 가기
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>

              {/* 추가 분석 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-panel border-white/5 overflow-hidden">
                  <CardHeader className="border-b border-white/5 mb-4">
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      조언
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-4">
                    <h4 className="font-bold text-white text-base">
                      {result.dayPillar.stemElement}의 기운
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {form.getValues("name")}님은 {result.dayPillar.stemElement}의 기운을 타고나셨습니다. 이는 당신의 핵심 성격과 인생의 태도를 결정짓는 가장 중요한 요소입니다.
                    </p>
                  </CardContent>
                </Card>
                <Card className="glass-panel border-white/5 overflow-hidden">
                  <CardHeader className="border-b border-white/5 mb-4">
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      성격 분석
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-4">
                    <div className="flex gap-2">
                      {['木', '火', '土', '金', '水'].map(el => (
                        <div key={el} className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                          <div className={`h-full ${getElementColor(el as FiveElement).split(' ')[2]}`} style={{ width: '60%' }} />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">전체적인 오행의 조화가 안정적입니다.</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center pt-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setResult(null)}
                  className="text-muted-foreground hover:text-white"
                >
                  다른 정보로 다시 분석하기
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
