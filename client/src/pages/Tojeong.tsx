import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Sparkles, User, TrendingUp, Zap, Briefcase, Activity, Users, Quote, BookOpen } from "lucide-react";
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

// --- 토정비결 해석 로직 (전문가 스타일) ---

function getTojeongReview(stem: string): { title: string; general: string; detailed: any[], advice: string } {
  const reviews: Record<string, any> = {
    'default': {
      title: "하늘의 문이 열리고 복운이 찾아오는 형상",
      general: "올해의 토정비결은 '만사형통'의 기운을 담고 있습니다. 막혔던 일들이 풀리기 시작하고, 주변의 도움으로 큰 성취를 이룰 수 있는 해입니다. 특히 문서와 관련된 운이 좋아 새로운 계약이나 자격증 취득에 유리합니다. 다만, 너무 자만하지 말고 겸손한 자세를 유지한다면 더 큰 복이 찾아올 것입니다.",
      detailed: [
        { category: "재물운", content: "재물이 샘솟는 해입니다. 생각지 못한 곳에서 이득이 생기고, 투자했던 곳에서 좋은 소식이 들려옵니다. 지출을 관리한다면 큰 부를 축적할 수 있습니다." },
        { category: "직업운", content: "승진이나 영전의 기회가 있습니다. 당신의 능력이 상사나 동료들에게 인정받아 중요한 프로젝트를 맡게 될 것입니다." },
        { category: "건강운", content: "체력이 회복되고 활력이 넘칩니다. 다만 환절기 호흡기 질환만 주의한다면 건강한 한 해를 보낼 수 있습니다." },
        { category: "인간관계", content: "귀인이 나타나 당신을 돕습니다. 새로운 인연이 당신의 인생에 긍정적인 변화를 가져다줄 것입니다." }
      ],
      advice: "하늘은 스스로 돕는 자를 돕습니다. 당신의 성실함이 최고의 운을 완성할 것입니다."
    }
  };
  
  // 실제로는 stem별로 다른 데이터를 반환하도록 확장 가능
  return reviews[stem] || reviews['default'];
}

export default function Tojeong() {
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

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset(parsed);
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    localStorage.setItem("muun_user_data", JSON.stringify(data));
    const date = new Date(`${data.birthDate}T${data.birthTime}`);
    const sajuResult = calculateSaju(date, data.gender);
    setResult(sajuResult);
    window.scrollTo(0, 0);
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
            <h1 className="text-xl font-bold text-white">토정비결</h1>
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
                  <BookOpen className="w-5 h-5 text-primary" />
                  토정비결 정보 입력
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

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="birthDate" className="text-white mb-2 block">생년월일</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...form.register("birthDate")}
                        className="bg-white/5 border-white/10 text-white w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthTime" className="text-white mb-2 block">태어난 시간</Label>
                      <Input
                        id="birthTime"
                        type="time"
                        {...form.register("birthTime")}
                        className="bg-white/5 border-white/10 text-white w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">구분</Label>
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

                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold">
                    <Sparkles className="w-4 h-4 mr-2" />
                    토정비결 결과 보기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  const tojeong = getTojeongReview(result.dayPillar.stem);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10" onClick={() => setResult(null)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-white">토정비결 결과</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-yellow-400 hover:bg-yellow-400/10">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto space-y-10"
        >
          <section className="space-y-4">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-3xl font-bold text-white">2026년 토정비결 상세 풀이</h2>
              <p className="text-primary/80">토정 이지함 선생의 지혜를 빌려 한 해의 운세를 풀어드립니다.</p>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h3 className="text-2xl font-bold text-white">총론: {tojeong.title}</h3>
            </div>
            <Card className="bg-card border-white/10 shadow-xl overflow-hidden">
              <CardContent className="p-8">
                <p className="text-lg text-white/90 leading-relaxed indent-4">
                  {tojeong.general}
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h3 className="text-2xl font-bold text-white">분야별 상세 운세</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tojeong.detailed.map((item: any, idx: number) => (
                <Card key={idx} className="bg-card border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">{item.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/70 leading-relaxed">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h3 className="text-2xl font-bold text-white">인생 조언</h3>
            </div>
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <CardContent className="p-8 relative">
                <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
                <p className="text-lg text-white/90 leading-relaxed text-center italic">
                  "{tojeong.advice}"
                </p>
                <Quote className="absolute bottom-4 right-4 w-8 h-8 text-primary/20 rotate-180" />
              </CardContent>
            </Card>
          </section>

          <div className="flex flex-col gap-4 pt-6">
            <Button onClick={() => setResult(null)} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg">
              다시 확인하기
            </Button>
            <Link href="/">
              <Button variant="ghost" className="w-full text-white/50 hover:text-white">
                홈으로 돌아가기
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
