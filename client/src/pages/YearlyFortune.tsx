import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Star, Sparkles, User, Zap, Briefcase, Share2, Check, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { calculateSaju, SajuResult, calculateElementBalance } from "@/lib/saju";
import SajuChart from "@/components/SajuChart";

const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime: z.string().optional(),
  timeUnknown: z.boolean().default(false),
  calendarType: z.enum(["solar", "lunar"]),
  keywords: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

const INTEREST_KEYWORDS = ["재물운", "연애운", "건강운", "직업운", "학업운", "대인관계"];

export default function YearlyFortune() {
  const [result, setResult] = useState<any>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "2000-01-01",
      birthTime: "12:00",
      timeUnknown: false,
      calendarType: "solar",
      keywords: [],
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset({ ...form.getValues(), ...parsed });
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    localStorage.setItem("muun_user_data", JSON.stringify(data));
    
    // 시간 모름 처리
    const time = data.timeUnknown ? "12:00" : (data.birthTime || "12:00");
    const date = new Date(`${data.birthDate}T${time}`);
    
    const sajuResult = calculateSaju(date, data.gender);
    const elementBalance = calculateElementBalance(sajuResult);
    
    // 종합 점수 계산 (가상 로직)
    const totalScore = Math.floor(Math.random() * 20) + 80; // 80~100점 사이
    
    setResult({
      saju: sajuResult,
      elements: elementBalance,
      score: totalScore,
      name: data.name,
      keywords: data.keywords
    });
    
    window.scrollTo(0, 0);
  };

  const toggleKeyword = (keyword: string) => {
    const current = form.getValues("keywords");
    if (current.includes(keyword)) {
      form.setValue("keywords", current.filter(k => k !== keyword));
    } else {
      form.setValue("keywords", [...current, keyword]);
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-slate-600">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">2026년 신년운세</h1>
          </div>
        </header>

        <main className="container mx-auto max-w-[1280px] px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold text-slate-900">데이터 기반 신년운세</h2>
              <p className="text-slate-500">사주 명리학을 현대적인 데이터 분석 기법으로 풀이합니다.</p>
            </div>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  분석 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">이름</Label>
                      <Input id="name" {...form.register("name")} placeholder="이름 입력" />
                    </div>
                    <div className="space-y-2">
                      <Label>성별</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("gender")}
                        onValueChange={(v) => v && form.setValue("gender", v as any)}
                        className="justify-start"
                      >
                        <ToggleGroupItem value="male" className="flex-1">남성</ToggleGroupItem>
                        <ToggleGroupItem value="female" className="flex-1">여성</ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>생년월일</Label>
                      <Input type="date" {...form.register("birthDate")} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>태어난 시간</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="timeUnknown" 
                            checked={form.watch("timeUnknown")}
                            onCheckedChange={(v) => form.setValue("timeUnknown", !!v)}
                          />
                          <label htmlFor="timeUnknown" className="text-xs text-slate-500 cursor-pointer">시간 모름</label>
                        </div>
                      </div>
                      <Input 
                        type="time" 
                        {...form.register("birthTime")} 
                        disabled={form.watch("timeUnknown")}
                        className={form.watch("timeUnknown") ? "opacity-50" : ""}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>관심 분야 (중복 선택 가능)</Label>
                    <div className="flex flex-wrap gap-2">
                      {INTEREST_KEYWORDS.map(kw => (
                        <Badge
                          key={kw}
                          variant={form.watch("keywords").includes(kw) ? "default" : "outline"}
                          className="cursor-pointer py-2 px-4 text-sm"
                          onClick={() => toggleKeyword(kw)}
                        >
                          {kw}
                          {form.watch("keywords").includes(kw) && <Check className="w-3 h-3 ml-1" />}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    데이터 분석 시작하기
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setResult(null)} className="mr-2">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">분석 결과 리포트</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => shareContent({ title: '신년운세 리포트', text: '나의 데이터 분석 결과' })}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-[1280px] px-4 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
          {/* 상단 요약 카드 */}
          <Card className="overflow-hidden border-none shadow-lg bg-white">
            <div className="bg-blue-600 p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-2">{result.name}님의 2026년 종합 운세</h2>
              <div className="text-6xl font-black mt-4">{result.score}<span className="text-2xl font-normal opacity-80">점</span></div>
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    오행 분포 분석
                  </h3>
                  <SajuChart data={result.elements} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">분석 요약</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {result.name}님의 사주는 <strong>{result.elements.find((e:any) => e.value === Math.max(...result.elements.map((el:any)=>el.value)))?.name}</strong> 기운이 강하게 나타납니다. 
                    올해는 선택하신 <strong>{result.keywords.join(", ") || "전반적인"}</strong> 분야에서 긍정적인 데이터 흐름이 감지됩니다.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((kw:string) => (
                      <Badge key={kw} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">{kw} 집중 분석</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 상세 분석 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "재물운", icon: <Zap className="text-yellow-500" />, score: 85 },
              { title: "직업운", icon: <Briefcase className="text-blue-500" />, score: 92 },
              { title: "연애운", icon: <Star className="text-pink-500" />, score: 78 },
            ].map(item => (
              <Card key={item.title} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-50 rounded-lg">{item.icon}</div>
                  <span className="text-2xl font-bold text-slate-800">{item.score}</span>
                </div>
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500">데이터 시뮬레이션 결과 상위 15%에 해당하는 긍정적인 흐름입니다.</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
