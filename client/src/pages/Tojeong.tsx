import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Sparkles, User, BookOpen, Info, Calendar } from "lucide-react";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateSaju, SajuResult } from "@/lib/saju";
import { calculateTojeong } from "@/lib/tojeong";

// 폼 스키마 정의 (태어난 시간 제외)
const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  calendarType: z.enum(["solar", "lunar"]),
});

type FormValues = z.infer<typeof formSchema>;

// 월별 운세 데이터 (예시 - 실제로는 144괘 데이터베이스 필요)
const getMonthlyFortunes = (hexagram: string) => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    content: `${i + 1}월은 기운이 상승하는 시기입니다. 주변의 도움으로 계획했던 일이 순조롭게 풀리며, 특히 중순 이후에는 뜻밖의 재물이 들어올 운세입니다.`,
    tag: i % 3 === 0 ? "길운" : "평탄"
  }));
};

export default function Tojeong() {
  const [result, setResult] = useState<any>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "2000-01-01",
      calendarType: "lunar", // 음력 기본값
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // 기존 데이터에서 birthTime 제외하고 로드
      const { birthTime, ...rest } = parsed;
      form.reset({ ...form.getValues(), ...rest });
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    localStorage.setItem("muun_user_data", JSON.stringify(data));
    const date = new Date(data.birthDate);
    
    // 토정비결 괘 계산
    const tojeongResult = calculateTojeong(date, 2026);
    const monthlyFortunes = getMonthlyFortunes(tojeongResult.hexagram);
    
    setResult({
      ...tojeongResult,
      monthlyFortunes,
      name: data.name
    });
    
    window.scrollTo(0, 0);
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20 font-serif">
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/50 border-b border-amber-900/30">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-amber-200 hover:bg-amber-900/20">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-amber-100">전통 토정비결</h1>
          </div>
        </header>

        <main className="container mx-auto max-w-[1280px] px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold text-amber-200">2026년 토정비결</h2>
              <p className="text-slate-400">이지함 선생의 원문 괘 계산법으로 한 해의 운세를 풀이합니다.</p>
            </div>

            <Card className="bg-slate-900/80 border-amber-900/30 shadow-2xl backdrop-blur-sm">
              <CardHeader>
                  <CardTitle className="text-amber-100 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    운세 정보 입력
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">이름</Label>
                      <Input
                        id="name"
                        placeholder="성함을 입력하세요"
                        {...form.register("name")}
                        className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">성별</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("gender")}
                        onValueChange={(value) => {
                          if (value) form.setValue("gender", value as "male" | "female");
                        }}
                        className="justify-start"
                      >
                        <ToggleGroupItem value="male" className="flex-1 border-slate-800 data-[state=on]:bg-amber-900/40 data-[state=on]:text-amber-200">남성</ToggleGroupItem>
                        <ToggleGroupItem value="female" className="flex-1 border-slate-800 data-[state=on]:bg-amber-900/40 data-[state=on]:text-amber-200">여성</ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-slate-300">생년월일</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      {...form.register("birthDate")}
                      className="bg-slate-950/50 border-slate-800 text-slate-200"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-300">날짜 구분</Label>
                    <ToggleGroup
                      type="single"
                      value={form.watch("calendarType")}
                      onValueChange={(value) => {
                        if (value) form.setValue("calendarType", value as "solar" | "lunar");
                      }}
                      className="justify-start"
                    >
                      <ToggleGroupItem value="solar" className="px-8 border-slate-800 data-[state=on]:bg-amber-900/40 data-[state=on]:text-amber-200">양력</ToggleGroupItem>
                      <ToggleGroupItem value="lunar" className="px-8 border-slate-800 data-[state=on]:bg-amber-900/40 data-[state=on]:text-amber-200">음력</ToggleGroupItem>
                    </ToggleGroup>
                    <p className="text-xs text-amber-500/80 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      토정비결은 전통적으로 음력 생일을 기준으로 할 때 가장 정확합니다.
                    </p>
                  </div>

                  <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-6 text-lg shadow-lg shadow-amber-900/20">
                    <Sparkles className="w-5 h-5 mr-2" />
                    2026년 토정비결 결과 보기
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
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20 font-serif">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/50 border-b border-amber-900/30">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 text-amber-200 hover:bg-amber-900/20" onClick={() => setResult(null)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-amber-100">토정비결 결과</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-amber-400" onClick={() => shareContent({ title: '무운 토정비결', text: '나의 2026년 운세는?' })}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-[1280px] px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto space-y-12"
        >
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-1 rounded-full bg-amber-900/30 border border-amber-700/50 text-amber-400 text-sm mb-2">
              제 {result.hexagram}괘
            </div>
            <h2 className="text-4xl font-bold text-amber-100">{result.name}님의 2026년 운세</h2>
            <p className="text-slate-400 text-lg">"하늘의 기운이 땅으로 내려와 만물이 소생하는 형국입니다."</p>
          </div>

          {/* 월별 운세 타임라인 */}
          <section className="space-y-8">
            <h3 className="text-2xl font-bold text-amber-200 flex items-center gap-2 border-b border-amber-900/30 pb-2">
              <Calendar className="w-6 h-6" />
              월별 상세 운세
            </h3>
            <div className="relative border-l-2 border-amber-900/30 ml-4 pl-8 space-y-12">
              {result.monthlyFortunes.map((item: any) => (
                <div key={item.month} className="relative">
                  <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-amber-600 border-4 border-slate-900" />
                  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:border-amber-700/50 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-bold text-amber-400">{item.month}월</span>
                      <span className="px-2 py-0.5 rounded bg-amber-900/20 text-amber-500 text-xs border border-amber-900/50">{item.tag}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Card className="bg-amber-900/10 border-amber-900/30 p-8 text-center">
            <p className="text-amber-200 italic">"운명은 정해진 것이 아니라, 스스로 만들어가는 것입니다. <br/>오늘의 지혜를 바탕으로 더 나은 내일을 설계하시기 바랍니다."</p>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
