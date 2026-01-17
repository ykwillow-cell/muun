import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Info, Share2 } from "lucide-react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateSaju, SajuResult } from "@/lib/saju";

// 폼 스키마 정의
const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime: z.string().min(1, "태어난 시간을 입력해주세요"),
  calendarType: z.enum(["solar", "lunar"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function Manselyeok() {
  const [result, setResult] = useState<SajuResult | null>(null);
  
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

  // 로컬 스토리지에서 데이터 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset(parsed);
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    // 데이터 저장
    localStorage.setItem("muun_user_data", JSON.stringify(data));
    
    // 사주 계산
    const date = new Date(`${data.birthDate}T${data.birthTime}`);
    const sajuResult = calculateSaju(date, data.gender);
    setResult(sajuResult);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-white">만세력</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {!result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card border-white/10 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-primary">사주 정보 입력</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input 
                      id="name" 
                      placeholder="이름을 입력하세요" 
                      {...form.register("name")} 
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                    {form.formState.errors.name && (
                      <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>성별</Label>
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
                        className="px-8 py-2 rounded-l-md border border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                      >
                        남성
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="female"
                        className="px-8 py-2 rounded-r-md border border-l-0 border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                      >
                        여성
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">생년월일</Label>
                      <Input 
                        id="birthDate" 
                        type="date" 
                        {...form.register("birthDate")} 
                        className="bg-white/5 border-white/10 text-white w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthTime">태어난 시간</Label>
                      <Input 
                        id="birthTime" 
                        type="time" 
                        {...form.register("birthTime")} 
                        className="bg-white/5 border-white/10 text-white w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>구분</Label>
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
                        className="px-8 py-2 rounded-l-md border border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                      >
                        양력
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="lunar"
                        className="px-8 py-2 rounded-r-md border border-l-0 border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                      >
                        음력
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 text-lg shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                    만세력 확인하기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* 결과 카드 */}
            <Card className="bg-card border-white/10 shadow-xl backdrop-blur-md overflow-hidden">
              <CardHeader className="bg-white/5 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-white">{form.getValues("name")}님의 사주팔자</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setResult(null)} className="text-muted-foreground hover:text-white">
                    다시 입력
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {result.birthDate.toLocaleDateString()} {result.birthDate.toLocaleTimeString()}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="text-muted-foreground text-sm mb-2">시주</div>
                  <div className="text-muted-foreground text-sm mb-2">일주</div>
                  <div className="text-muted-foreground text-sm mb-2">월주</div>
                  <div className="text-muted-foreground text-sm mb-2">연주</div>

                  {/* 천간 */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-white/50">{result.hourPillar.tenGod}</span>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold bg-white/5 border border-white/10 ${getElementColor(result.hourPillar.stemElement)}`}>
                      {result.hourPillar.stem}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-primary font-bold">본원</span>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold bg-white/5 border-2 border-primary ${getElementColor(result.dayPillar.stemElement)}`}>
                      {result.dayPillar.stem}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-white/50">{result.monthPillar.tenGod}</span>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold bg-white/5 border border-white/10 ${getElementColor(result.monthPillar.stemElement)}`}>
                      {result.monthPillar.stem}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-white/50">{result.yearPillar.tenGod}</span>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold bg-white/5 border border-white/10 ${getElementColor(result.yearPillar.stemElement)}`}>
                      {result.yearPillar.stem}
                    </div>
                  </div>

                  {/* 지지 */}
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold bg-white/5 border border-white/10 ${getElementColor(result.hourPillar.branchElement)}`}>
                      {result.hourPillar.branch}
                    </div>
                    <span className="text-xs text-white/50">{result.hourPillar.branchElement}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold bg-white/5 border border-white/10 ${getElementColor(result.dayPillar.branchElement)}`}>
                      {result.dayPillar.branch}
                    </div>
                    <span className="text-xs text-white/50">{result.dayPillar.branchElement}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold bg-white/5 border border-white/10 ${getElementColor(result.monthPillar.branchElement)}`}>
                      {result.monthPillar.branch}
                    </div>
                    <span className="text-xs text-white/50">{result.monthPillar.branchElement}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold bg-white/5 border border-white/10 ${getElementColor(result.yearPillar.branchElement)}`}>
                      {result.yearPillar.branch}
                    </div>
                    <span className="text-xs text-white/50">{result.yearPillar.branchElement}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 오행 분석 */}
            <Card className="bg-card border-white/10 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  오행 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center px-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-900/50 border border-green-500 flex items-center justify-center text-green-400 font-bold">목</div>
                    <span className="text-xs text-muted-foreground">성장</span>
                  </div>
                  <div className="w-8 h-[1px] bg-white/10" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-red-900/50 border border-red-500 flex items-center justify-center text-red-400 font-bold">화</div>
                    <span className="text-xs text-muted-foreground">열정</span>
                  </div>
                  <div className="w-8 h-[1px] bg-white/10" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-yellow-900/50 border border-yellow-500 flex items-center justify-center text-yellow-400 font-bold">토</div>
                    <span className="text-xs text-muted-foreground">중용</span>
                  </div>
                  <div className="w-8 h-[1px] bg-white/10" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-700/50 border border-gray-400 flex items-center justify-center text-gray-300 font-bold">금</div>
                    <span className="text-xs text-muted-foreground">결실</span>
                  </div>
                  <div className="w-8 h-[1px] bg-white/10" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-900/50 border border-blue-500 flex items-center justify-center text-blue-400 font-bold">수</div>
                    <span className="text-xs text-muted-foreground">지혜</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                if (window.Kakao) {
                  window.Kakao.Link.sendDefault({
                    objectType: 'feed',
                    content: {
                      title: `${form.getValues('name')}님의 사주팔자`,
                      description: `${result.yearPillar.stem}${result.yearPillar.branch} ${result.monthPillar.stem}${result.monthPillar.branch} ${result.dayPillar.stem}${result.dayPillar.branch} ${result.hourPillar.stem}${result.hourPillar.branch}`,
                      imageUrl: 'https://muun.manus.space/images/horse_mascot.png',
                      link: {
                        webUrl: window.location.href,
                        mobileWebUrl: window.location.href,
                      },
                    },
                    buttons: [
                      {
                        title: '무운에서 나의 사주 보기',
                        link: {
                          webUrl: window.location.href,
                          mobileWebUrl: window.location.href,
                        },
                      },
                    ],
                  });
                }
              }}
              className="w-full bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-bold py-3 flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              카카오톡으로 공유하기
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/lifelong-saju">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-1 border-primary/50 text-primary hover:bg-primary/10">
                  <span className="text-lg font-bold">평생사주 보기</span>
                  <span className="text-xs opacity-70">나의 타고난 운명 확인하기</span>
                </Button>
              </Link>
              <Link href="/yearly-fortune">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-1 border-primary/50 text-primary hover:bg-primary/10">
                  <span className="text-lg font-bold">2026년 운세 보기</span>
                  <span className="text-xs opacity-70">올해의 흐름 확인하기</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function getElementColor(element: string) {
  switch (element) {
    case '木': return 'text-green-400 border-green-500/30 bg-green-900/20';
    case '火': return 'text-red-400 border-red-500/30 bg-red-900/20';
    case '土': return 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20';
    case '金': return 'text-gray-300 border-gray-400/30 bg-gray-800/20';
    case '水': return 'text-blue-400 border-blue-500/30 bg-blue-900/20';
    default: return 'text-white';
  }
}
