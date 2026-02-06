import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Sparkles, User, BookOpen, Info, Calendar, ScrollText } from "lucide-react";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-yellow-900/10 rounded-full blur-[120px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">토정비결</h1>
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-8`}
          >
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-xl">
                <ScrollText className="w-4 h-4 text-yellow-400" />
                <span className="text-[11px] md:text-xs font-bold tracking-widest text-yellow-400 uppercase">2026년 병오년 운세</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">전통 토정비결</h2>
              <p className="text-muted-foreground text-sm md:text-base">이지함 선생의 원문 괘 계산법으로 한 해의 흐름을 읽어드립니다.</p>
            </div>

            <Card className="glass-panel border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b border-white/5 p-6 md:p-10">
                <CardTitle className="text-white flex items-center gap-3 text-xl md:text-2xl">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-yellow-400" />
                  </div>
                  운세 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-10">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-white text-base font-medium ml-1">이름</Label>
                      <Input
                        id="name"
                        placeholder="성함을 입력하세요"
                        {...form.register("name")}
                        className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-white text-base font-medium ml-1">성별</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("gender")}
                        onValueChange={(value) => {
                          if (value) form.setValue("gender", value as "male" | "female");
                        }}
                        className="justify-start w-48 h-14 bg-white/5 p-1 rounded-2xl border border-white/10"
                      >
                        <ToggleGroupItem value="male" className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white transition-all">남성</ToggleGroupItem>
                        <ToggleGroupItem value="female" className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white transition-all">여성</ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="birthDate" className="text-white text-base font-medium ml-1">생년월일</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      {...form.register("birthDate")}
                      className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-white text-base font-medium ml-1">날짜 구분</Label>
                    <ToggleGroup
                      type="single"
                      value={form.watch("calendarType")}
                      onValueChange={(value) => {
                        if (value) form.setValue("calendarType", value as "solar" | "lunar");
                      }}
                      className="justify-start w-48 h-14 bg-white/5 p-1 rounded-2xl border border-white/10"
                    >
                      <ToggleGroupItem value="solar" className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white transition-all">양력</ToggleGroupItem>
                      <ToggleGroupItem value="lunar" className="flex-1 h-full rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white transition-all">음력</ToggleGroupItem>
                    </ToggleGroup>
                    <div className="flex items-start gap-2 p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                      <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs md:text-sm text-yellow-200/70 leading-relaxed">
                        토정비결은 전통적으로 <strong>음력 생일</strong>을 기준으로 할 때 가장 정확합니다.
                      </p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
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
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-yellow-900/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10" onClick={() => setResult(null)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-white">토정비결 결과</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10" onClick={() => shareContent({ title: '무운 토정비결', text: '나의 2026년 운세는?' })}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${commonMaxWidth} space-y-12`}
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
              <span className="text-[11px] md:text-xs font-bold tracking-widest text-primary uppercase">제 {result.hexagram}괘</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">{result.name}님의 2026년 운세</h2>
            <p className="text-muted-foreground text-lg italic">"하늘의 기운이 땅으로 내려와 만물이 소생하는 형국입니다."</p>
          </div>

          {/* 월별 운세 타임라인 */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white">월별 상세 운세</h3>
            </div>
            
            <div className="relative border-l-2 border-white/10 ml-4 pl-8 space-y-10">
              {result.monthlyFortunes.map((item: any) => (
                <motion.div 
                  key={item.month} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                  <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] hover:bg-white/10 transition-all duration-300 group">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl md:text-2xl font-black text-primary group-hover:scale-110 transition-transform origin-left">{item.month}월</span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">{item.tag}</span>
                    </div>
                    <p className="text-white/70 leading-relaxed text-sm md:text-base">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <Card className="bg-primary/5 border-primary/20 p-8 md:p-12 rounded-[2.5rem] text-center shadow-2xl">
            <p className="text-primary/80 italic text-sm md:text-lg leading-relaxed">
              "운명은 정해진 것이 아니라, 스스로 만들어가는 것입니다. <br className="hidden md:block" />
              오늘의 지혜를 바탕으로 더 나은 내일을 설계하시기 바랍니다."
            </p>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
