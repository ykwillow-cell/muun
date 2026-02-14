import { useState, useEffect } from "react";
import { useEffect } from 'react';
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Sparkles, User, BookOpen, Info, Calendar, ScrollText } from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateTojeong } from "@/lib/tojeong";
import { convertToSolarDate } from "@/lib/lunar-converter";
import TojeongContent from "@/components/TojeongContent";

// 폼 스키마 정의 (태어난 시간 제외)
const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  calendarType: z.enum(["solar", "lunar"]),
  isLeapMonth: z.boolean().default(false),
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
  useCanonical('/tojeong');

  const [result, setResult] = useState<any>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "2000-01-01",
      calendarType: "lunar", // 음력 기본값
      isLeapMonth: false,
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const { birthTime, ...rest } = parsed;
      form.reset({ ...form.getValues(), ...rest });
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    localStorage.setItem("muun_user_data", JSON.stringify(data));
    const date = convertToSolarDate(data.birthDate, "12:00", data.calendarType, data.isLeapMonth);
    const tojeongResult = calculateTojeong(date, 2026);
    const monthlyFortunes = getMonthlyFortunes(tojeongResult.hexagram);
    
    setResult({
      ...tojeongResult,
      monthlyFortunes,
      name: data.name
    });
    
    window.scrollTo(0, 0);
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-yellow-600/10 rounded-full blur-[100px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-base md:text-lg font-bold text-white">무료 토정비결</h1>
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl">
                <ScrollText className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] md:text-xs font-bold tracking-wider text-amber-400 uppercase">2026년 병오년 운세</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">전통 토정비결</h2>
              <p className="text-muted-foreground text-xs md:text-sm">
                이지함 선생의 원문 괘 계산법으로 한 해의 흐름을 읽어드립니다
              </p>
            </div>

            {/* Input Form Card - 컴팩트하게 */}
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-amber-400" />
                  </div>
                  운세 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name & Gender Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-white text-sm font-medium flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        이름
                      </Label>
                      <Input
                        id="name"
                        placeholder="이름"
                        {...form.register("name")}
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
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
                          className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  {/* Birth Date & Calendar Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate" className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        생년월일
                      </Label>
                      <DatePickerInput
                        id="birthDate"
                        {...form.register("birthDate")}
                        accentColor="amber"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                        <ScrollText className="w-3.5 h-3.5 text-amber-400" />
                        날짜 구분
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("calendarType")}
                        onValueChange={(value) => {
                          if (value) form.setValue("calendarType", value as "solar" | "lunar");
                        }}
                        className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                      >
                        <ToggleGroupItem
                          value="solar"
                          className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                        >
                          양력
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="lunar"
                          className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                        >
                          음력
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  {/* 윤달 여부 (음력일 때만 표시) */}
                  {form.watch("calendarType") === "lunar" && (
                    <div className="flex items-center gap-2 px-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          {...form.register("isLeapMonth")}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 accent-amber-500"
                        />
                        <span className="text-sm text-white/80 group-hover:text-amber-400 transition-colors">윤달(Leap Month)인 경우 체크</span>
                      </label>
                    </div>
                  )}

                  {/* Info Box */}
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <Info className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] md:text-xs text-amber-200/70 leading-relaxed">
                      토정비결은 전통적으로 <strong className="text-amber-300">음력 생일</strong>을 기준으로 할 때 가장 정확합니다.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-sm md:text-base rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ScrollText className="w-4 h-4 mr-2" />
                    2026년 토정비결 보기
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Feature Cards - 더 컴팩트하게 */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto">
                    <ScrollText className="w-4 h-4 md:w-4.5 md:h-4.5 text-amber-400" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-white">144괘 해석</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center mx-auto">
                    <Calendar className="w-4 h-4 md:w-4.5 md:h-4.5 text-yellow-400" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-white">월별 운세</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto">
                    <BookOpen className="w-4 h-4 md:w-4.5 md:h-4.5 text-orange-400" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-white">전통 해석</p>
                </CardContent>
              </Card>
            </div>

            {/* SEO 콘텐츠 */}
            <TojeongContent />
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
      {/* 토정비결은 원래 삼주(연,월,일)만 사용하므로 안내 라벨 표시 */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 relative z-50">
        <p className="text-[10px] md:text-xs text-amber-400 text-center font-medium">
          전통 방식에 따른 연, 월, 일(삼주) 분석 결과입니다
        </p>
      </div>
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-yellow-600/10 rounded-full blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]" onClick={() => setResult(null)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base md:text-lg font-bold text-white">토정비결 결과</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-amber-400 min-w-[44px] min-h-[44px]" 
            onClick={() => shareContent({ title: '무운 토정비결', text: '나의 2026년 운세는?', page: 'tojeong', buttonType: 'icon' })}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 px-4 py-5 md:py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${commonMaxWidth} space-y-5 md:space-y-6`}
        >
          {/* Hero Section */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl">
              <span className="text-[10px] md:text-xs font-bold tracking-wider text-amber-400 uppercase">제 {result.hexagram}괘</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">{result.name}님의 2026년 운세</h2>
            <p className="text-muted-foreground text-xs md:text-sm italic">"하늘의 기운이 땅으로 내려와 만물이 소생하는 형국입니다."</p>
          </div>

          {/* 월별 운세 타임라인 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-white">월별 상세 운세</h3>
            </div>
            
            <div className="relative border-l-2 border-white/10 ml-3 pl-5 space-y-4">
              {result.monthlyFortunes.map((item: any) => (
                <motion.div 
                  key={item.month} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute -left-[27px] top-0 w-3 h-3 rounded-full bg-amber-500 border-3 border-background shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  <Card className="bg-white/5 border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-base md:text-lg font-black text-amber-400 group-hover:scale-110 transition-transform origin-left">{item.month}월</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] md:text-xs font-bold border border-amber-500/20">{item.tag}</span>
                      </div>
                      <p className="text-white/70 leading-relaxed text-xs md:text-sm">{item.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Quote Card */}
          <Card className="bg-amber-500/5 border-amber-500/20 rounded-xl overflow-hidden">
            <CardContent className="p-4 md:p-6 text-center">
              <p className="text-amber-200/80 italic text-xs md:text-sm leading-relaxed">
                "운명은 정해진 것이 아니라, 스스로 만들어가는 것입니다. 
                오늘의 지혜를 바탕으로 더 나은 내일을 설계하시기 바랍니다."
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button 
              className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 h-11 rounded-xl font-medium text-sm"
              onClick={() => shareContent({ title: '무운 토정비결', text: '나의 2026년 운세는?', page: 'tojeong', buttonType: 'text_button' })}
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
      </main>
    </div>
  );
}
