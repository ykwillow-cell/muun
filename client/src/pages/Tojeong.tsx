import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Sparkles, User, BookOpen, Info, Calendar, ScrollText, Clock } from "lucide-react";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateTojeong } from "@/lib/tojeong";
import TojeongContent from "@/components/TojeongContent";

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
      const { birthTime, ...rest } = parsed;
      form.reset({ ...form.getValues(), ...rest });
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    localStorage.setItem("muun_user_data", JSON.stringify(data));
    const date = new Date(data.birthDate);
    const tojeongResult = calculateTojeong(date, 2026);
    const monthlyFortunes = getMonthlyFortunes(tojeongResult.hexagram);
    
    setResult({
      ...tojeongResult,
      monthlyFortunes,
      name: data.name
    });
    
    window.scrollTo(0, 0);
  };

  const commonMaxWidth = "w-full max-w-4xl mx-auto";

  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[120px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-white">무료 토정비결</h1>
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-8`}
          >
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl">
                <ScrollText className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] md:text-xs font-bold tracking-widest text-amber-400 uppercase">2026년 병오년 운세</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">전통 토정비결</h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
                이지함 선생의 원문 괘 계산법으로<br className="md:hidden" /> 한 해의 흐름을 읽어드립니다
              </p>
            </div>

            {/* Input Form Card */}
            <Card className="glass-panel border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b border-white/5 p-6 md:p-10">
                <CardTitle className="text-white flex items-center gap-3 text-xl md:text-2xl">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                  </div>
                  운세 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-10">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                  {/* Name & Gender Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-400" />
                        이름
                      </Label>
                      <Input
                        id="name"
                        placeholder="이름을 입력해주세요"
                        {...form.register("name")}
                        className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-2xl focus:ring-amber-500/50 focus:border-amber-500 transition-all text-base"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-white text-base font-medium ml-1 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
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
                          className="flex-1 h-full rounded-xl data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="flex-1 h-full rounded-xl data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className="space-y-3">
                    <Label htmlFor="birthDate" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      생년월일
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      {...form.register("birthDate")}
                      className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-amber-500/50 focus:border-amber-500 transition-all text-base"
                    />
                  </div>

                  {/* Calendar Type */}
                  <div className="space-y-4">
                    <Label className="text-white text-base font-medium ml-1 flex items-center gap-2">
                      <ScrollText className="w-4 h-4 text-amber-400" />
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
                        className="flex-1 h-full rounded-xl data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base"
                      >
                        양력
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="lunar"
                        className="flex-1 h-full rounded-xl data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base"
                      >
                        음력
                      </ToggleGroupItem>
                    </ToggleGroup>
                    <div className="flex items-start gap-2 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                      <Info className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs md:text-sm text-amber-200/70 leading-relaxed">
                        토정비결은 전통적으로 <strong className="text-amber-300">음력 생일</strong>을 기준으로 할 때 가장 정확합니다.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-16 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ScrollText className="w-5 h-5 mr-2" />
                    2026년 토정비결 보기
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-4 md:p-5 text-center space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto">
                    <ScrollText className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-white">144괘 해석</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-4 md:p-5 text-center space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mx-auto">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-white">월별 운세</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-4 md:p-5 text-center space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto">
                    <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-white">전통 해석</p>
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
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]" onClick={() => setResult(null)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg md:text-xl font-bold text-white">토정비결 결과</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-amber-400 min-w-[44px] min-h-[44px]" 
            onClick={() => shareContent({ title: '무운 토정비결', text: '나의 2026년 운세는?' })}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 px-4 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${commonMaxWidth} space-y-8 md:space-y-12`}
        >
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl">
              <span className="text-[11px] md:text-xs font-bold tracking-widest text-amber-400 uppercase">제 {result.hexagram}괘</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">{result.name}님의 2026년 운세</h2>
            <p className="text-muted-foreground text-sm md:text-base italic">"하늘의 기운이 땅으로 내려와 만물이 소생하는 형국입니다."</p>
          </div>

          {/* 월별 운세 타임라인 */}
          <section className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white">월별 상세 운세</h3>
            </div>
            
            <div className="relative border-l-2 border-white/10 ml-4 pl-6 md:pl-8 space-y-6 md:space-y-8">
              {result.monthlyFortunes.map((item: any) => (
                <motion.div 
                  key={item.month} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute -left-[33px] md:-left-[41px] top-0 w-4 h-4 rounded-full bg-amber-500 border-4 border-background shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                  <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg md:text-xl font-black text-amber-400 group-hover:scale-110 transition-transform origin-left">{item.month}월</span>
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">{item.tag}</span>
                      </div>
                      <p className="text-white/70 leading-relaxed text-sm md:text-base">{item.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Quote Card */}
          <Card className="bg-amber-500/5 border-amber-500/20 rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-10 text-center">
              <p className="text-amber-200/80 italic text-sm md:text-base leading-relaxed">
                "운명은 정해진 것이 아니라, 스스로 만들어가는 것입니다. <br className="hidden md:block" />
                오늘의 지혜를 바탕으로 더 나은 내일을 설계하시기 바랍니다."
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button 
              className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 min-h-[48px] md:min-h-[56px] rounded-xl font-medium"
              onClick={() => shareContent({ title: '무운 토정비결', text: '나의 2026년 운세는?' })}
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
      </main>
    </div>
  );
}
