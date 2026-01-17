import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Star, Sparkles, User, Zap, Briefcase, Activity, Heart, Quote, Loader2, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateSaju, SajuResult } from "@/lib/saju";
import { fortuneApi, FortuneSection } from "@/lib/fortune-api";

const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime: z.string().min(1, "태어난 시간을 입력해주세요"),
  calendarType: z.enum(["solar", "lunar"]),
  maritalStatus: z.enum(["single", "married"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function LifelongSaju() {
  const [result, setResult] = useState<SajuResult | null>(null);
  const [fortunes, setFortunes] = useState<Record<string, FortuneSection | null>>({
    early: null,
    middle: null,
    late: null,
    wealth: null,
    career: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "2000-01-01",
      birthTime: "12:00",
      calendarType: "solar",
      maritalStatus: "single",
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
    setIsLoading(true);
    localStorage.setItem("muun_user_data", JSON.stringify(data));
    const date = new Date(`${data.birthDate}T${data.birthTime}`);
    const sajuResult = calculateSaju(date, data.gender);
    setResult(sajuResult);
    window.scrollTo(0, 0);

    // 비동기 요청 시작 (순차적으로 상태 업데이트)
    const fetchAll = async () => {
      const tasks = [
        { key: 'early', fn: fortuneApi.fetchEarlyLife },
        { key: 'middle', fn: fortuneApi.fetchMidLife },
        { key: 'late', fn: fortuneApi.fetchLateLife },
        { key: 'wealth', fn: fortuneApi.fetchWealth },
        { key: 'career', fn: fortuneApi.fetchCareer },
      ];

      for (const task of tasks) {
        const res = await task.fn(sajuResult);
        setFortunes(prev => ({ ...prev, [task.key]: res }));
      }
      setIsLoading(false);
    };

    fetchAll();
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20">
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">평생사주</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <Card className="bg-card border-white/10 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  기본 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-white mb-2 block">이름</Label>
                    <Input
                      id="name"
                      placeholder="이름을 입력해주세요"
                      {...form.register("name")}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-white mb-3 block">성별</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("gender")}
                        onValueChange={(value) => {
                          if (value) form.setValue("gender", value as "male" | "female");
                        }}
                        className="justify-start"
                      >
                        <ToggleGroupItem
                          value="male"
                          className="px-6 py-3 text-base rounded-l-md border border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="px-6 py-3 text-base rounded-r-md border border-l-0 border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                    <div>
                      <Label className="text-white mb-3 block">결혼 유무</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("maritalStatus")}
                        onValueChange={(value) => {
                          if (value) form.setValue("maritalStatus", value as "single" | "married");
                        }}
                        className="justify-start"
                      >
                        <ToggleGroupItem
                          value="single"
                          className="px-6 py-3 text-base rounded-l-md border border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                        >
                          미혼
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="married"
                          className="px-6 py-3 text-base rounded-r-md border border-l-0 border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                        >
                          기혼
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="text-white block text-base font-semibold">생년월일</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...form.register("birthDate")}
                        className="bg-white/5 border-white/10 text-white w-full appearance-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthTime" className="text-white block text-base font-semibold">태어난 시간</Label>
                      <Input
                        id="birthTime"
                        type="time"
                        {...form.register("birthTime")}
                        className="bg-white/5 border-white/10 text-white w-full appearance-none"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block text-base font-semibold">구분</Label>
                    <ToggleGroup
                      type="single"
                      value={form.watch("calendarType")}
                      onValueChange={(value) => {
                        if (value) form.setValue("calendarType", value as "solar" | "lunar");
                      }}
                      className="justify-start"
                    >
                      <ToggleGroupItem
                        value="solar"
                        className="px-8 py-3 text-base rounded-l-md border border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                      >
                        양력
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="lunar"
                        className="px-8 py-3 text-base rounded-r-md border border-l-0 border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                      >
                        음력
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-6 text-lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    평생사주 보기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setResult(null)} className="mr-2 text-white hover:bg-white/10">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-white">평생사주 결과</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
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
              <div className="bg-white/10 py-1 text-[10px] sm:text-xs text-white/60">{item.label}</div>
              <CardContent className="p-2 sm:p-4">
                <div className="text-xl sm:text-3xl font-bold text-primary mb-1">{item.pillar.stem}</div>
                <div className="text-xl sm:text-3xl font-bold text-white">{item.pillar.branch}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* 운세 섹션들 */}
        <div className="space-y-6">
          <AnimatePresence>
            {Object.entries(fortunes).map(([key, fortune], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card border-white/10 overflow-hidden">
                  <CardHeader className="bg-white/5 border-b border-white/5">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                      {key === 'early' && <Star className="w-5 h-5" />}
                      {key === 'middle' && <TrendingUp className="w-5 h-5" />}
                      {key === 'late' && <Activity className="w-5 h-5" />}
                      {key === 'wealth' && <Zap className="w-5 h-5" />}
                      {key === 'career' && <Briefcase className="w-5 h-5" />}
                      {fortune?.title || "분석 중..."}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {fortune ? (
                      <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                        {fortune.content}
                      </p>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-white/40 text-sm">깊이 있는 운명을 분석하고 있습니다...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {isLoading && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary/20 backdrop-blur-md border border-primary/30 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <span className="text-primary text-sm font-bold">전체 운세를 정밀 분석 중입니다...</span>
          </div>
        )}
      </main>
    </div>
  );
}
