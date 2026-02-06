import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Heart, Share2, Sparkles, User, Activity, Calendar, Clock, Users } from "lucide-react";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateSaju, SajuResult } from "@/lib/saju";
import CompatibilityContent from "@/components/CompatibilityContent";

// 폼 스키마 정의
const formSchema = z.object({
  name1: z.string().min(1, "첫 번째 이름을 입력해주세요"),
  gender1: z.enum(["male", "female"]),
  birthDate1: z.string().min(1, "첫 번째 생년월일을 입력해주세요"),
  birthTime1: z.string().min(1, "첫 번째 태어난 시간을 입력해주세요"),
  calendarType1: z.enum(["solar", "lunar"]),
  name2: z.string().min(1, "두 번째 이름을 입력해주세요"),
  gender2: z.enum(["male", "female"]),
  birthDate2: z.string().min(1, "두 번째 생년월일을 입력해주세요"),
  birthTime2: z.string().min(1, "두 번째 태어난 시간을 입력해주세요"),
  calendarType2: z.enum(["solar", "lunar"]),
});

type FormValues = z.infer<typeof formSchema>;

// 오행 매핑
const elementMap: Record<string, string> = {
  '甲': '목', '乙': '목', '丙': '화', '丁': '화', '戊': '토',
  '己': '토', '庚': '금', '辛': '금', '壬': '수', '癸': '수'
};

// 오행 상성 계산
function calculateCompatibility(saju1: SajuResult, saju2: SajuResult): number {
  const element1 = elementMap[saju1.dayPillar.stem];
  const element2 = elementMap[saju2.dayPillar.stem];

  const compatibility: Record<string, Record<string, number>> = {
    '목': { '목': 100, '화': 90, '수': 40, '금': 20, '토': 60 },
    '화': { '화': 100, '토': 90, '목': 90, '수': 20, '금': 30 },
    '토': { '토': 100, '금': 90, '화': 90, '목': 60, '수': 40 },
    '금': { '금': 100, '수': 90, '토': 90, '화': 30, '목': 20 },
    '수': { '수': 100, '목': 40, '금': 90, '화': 20, '토': 40 }
  };

  return compatibility[element1]?.[element2] || 50;
}

// 궁합 해석
function getCompatibilityInterpretation(score: number, saju1: SajuResult, saju2: SajuResult): string {
  const element1 = elementMap[saju1.dayPillar.stem];
  const element2 = elementMap[saju2.dayPillar.stem];

  if (score >= 90) {
    return `${element1}과(와) ${element2}의 조합은 매우 좋은 궁합입니다. 오행 상성이 매우 우수하여 두 사람이 함께할 때 서로를 보완하고 발전시킬 수 있습니다. 감정적으로도 잘 맞아 깊은 이해와 신뢰가 형성될 수 있습니다.`;
  } else if (score >= 70) {
    return `${element1}과(와) ${element2}의 조합은 좋은 궁합입니다. 오행 상성이 양호하여 두 사람이 함께할 때 대체로 잘 맞습니다. 서로를 이해하고 존중한다면 충분히 좋은 관계를 만들 수 있습니다.`;
  } else if (score >= 50) {
    return `${element1}과(와) ${element2}의 조합은 보통의 궁합입니다. 서로 다른 부분이 있을 수 있지만, 이를 이해하고 존중한다면 좋은 관계를 만들 수 있습니다.`;
  } else {
    return `${element1}과(와) ${element2}의 조합은 신중함이 필요한 궁합입니다. 서로를 깊이 이해하고 존중한다면, 이러한 차이를 극복하고 좋은 관계를 만들 수 있습니다.`;
  }
}

export default function Compatibility() {
  const [result, setResult] = useState<{ saju1: SajuResult; saju2: SajuResult; score: number } | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name1: "",
      gender1: "male",
      birthDate1: "2000-01-01",
      birthTime1: "12:00",
      calendarType1: "solar",
      name2: "",
      gender2: "female",
      birthDate2: "2000-01-01",
      birthTime2: "12:00",
      calendarType2: "solar",
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset({
        name1: parsed.name || "",
        gender1: parsed.gender || "male",
        birthDate1: parsed.birthDate || "2000-01-01",
        birthTime1: parsed.birthTime || "12:00",
        calendarType1: parsed.calendarType || "solar",
        name2: "",
        gender2: "female",
        birthDate2: "2000-01-01",
        birthTime2: "12:00",
        calendarType2: "solar",
      });
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    const date1 = new Date(`${data.birthDate1}T${data.birthTime1}`);
    const date2 = new Date(`${data.birthDate2}T${data.birthTime2}`);
    const saju1 = calculateSaju(date1, data.gender1);
    const saju2 = calculateSaju(date2, data.gender2);
    const score = calculateCompatibility(saju1, saju2);
    
    setResult({ saju1, saju2, score });
    window.scrollTo(0, 0);
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-base md:text-lg font-bold text-white">무료 궁합 풀이</h1>
          </div>
        </header>

        {/* Form Section */}
        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-5`}
          >
            {/* Hero Section - 컴팩트하게 */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 backdrop-blur-xl">
                <Heart className="w-3 h-3 text-pink-400" />
                <span className="text-[10px] md:text-xs font-bold tracking-wider text-pink-400 uppercase">서로의 기운을 맞추다</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">무료 궁합</h2>
              <p className="text-muted-foreground text-xs md:text-sm">
                두 사람의 사주를 분석하여 서로의 조화를 확인해보세요
              </p>
            </div>

            {/* Input Form Card - 컴팩트하게 */}
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-pink-400" />
                  </div>
                  궁합 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* 첫 번째 사람 정보 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center">1</div>
                      <h3 className="text-white font-bold text-sm">첫 번째 사람</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name1" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-pink-400" />
                          이름
                        </Label>
                        <Input
                          id="name1"
                          placeholder="이름"
                          {...form.register("name1")}
                          className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-pink-500/50 focus:border-pink-500 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                          성별
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("gender1")}
                          onValueChange={(value) => {
                            if (value) form.setValue("gender1", value as "male" | "female");
                          }}
                          className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                        >
                          <ToggleGroupItem
                            value="male"
                            className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                          >
                            남성
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="female"
                            className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                          >
                            여성
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthDate1" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-pink-400" />
                          생년월일
                        </Label>
                        <Input
                          id="birthDate1"
                          type="date"
                          {...form.register("birthDate1")}
                          className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-pink-500/50 focus:border-pink-500 transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="birthTime1" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-pink-400" />
                          태어난 시간
                        </Label>
                        <Input
                          id="birthTime1"
                          type="time"
                          {...form.register("birthTime1")}
                          className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-pink-500/50 focus:border-pink-500 transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 구분선 */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <Heart className="w-4 h-4 text-pink-400" />
                    <div className="flex-1 h-px bg-white/10"></div>
                  </div>

                  {/* 두 번째 사람 정보 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">2</div>
                      <h3 className="text-white font-bold text-sm">두 번째 사람</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name2" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-red-400" />
                          이름
                        </Label>
                        <Input
                          id="name2"
                          placeholder="이름"
                          {...form.register("name2")}
                          className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-red-500/50 focus:border-red-500 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-red-400" />
                          성별
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("gender2")}
                          onValueChange={(value) => {
                            if (value) form.setValue("gender2", value as "male" | "female");
                          }}
                          className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                        >
                          <ToggleGroupItem
                            value="male"
                            className="h-full rounded-lg data-[state=on]:bg-red-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                          >
                            남성
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="female"
                            className="h-full rounded-lg data-[state=on]:bg-red-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                          >
                            여성
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthDate2" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-red-400" />
                          생년월일
                        </Label>
                        <Input
                          id="birthDate2"
                          type="date"
                          {...form.register("birthDate2")}
                          className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-red-500/50 focus:border-red-500 transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="birthTime2" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-red-400" />
                          태어난 시간
                        </Label>
                        <Input
                          id="birthTime2"
                          type="time"
                          {...form.register("birthTime2")}
                          className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-red-500/50 focus:border-red-500 transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold text-sm md:text-base rounded-xl shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    무료 궁합 결과 보기
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Feature Cards - 더 컴팩트하게 */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-pink-500/10 flex items-center justify-center mx-auto">
                    <Heart className="w-4 h-4 md:w-4.5 md:h-4.5 text-pink-400" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-white">궁합 점수</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-red-500/10 flex items-center justify-center mx-auto">
                    <Activity className="w-4 h-4 md:w-4.5 md:h-4.5 text-red-400" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-white">오행 분석</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto">
                    <Users className="w-4 h-4 md:w-4.5 md:h-4.5 text-purple-400" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-white">상세 해석</p>
                </CardContent>
              </Card>
            </div>

            {/* SEO 콘텐츠 */}
            <CompatibilityContent />
          </motion.div>
        </main>
      </div>
    );
  }

  // 결과 화면
  const interpretation = getCompatibilityInterpretation(result.score, result.saju1, result.saju2);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setResult(null)} className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base md:text-lg font-bold text-white">궁합 결과</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-pink-400 min-w-[44px] min-h-[44px]"
            onClick={() => shareContent({ title: '무운 궁합 결과', text: `궁합 점수: ${result.score}점! 우리의 궁합을 확인해보세요.` })}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 px-4 py-5 md:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${commonMaxWidth} space-y-5 md:space-y-6`}
        >
          {/* Score Section */}
          <section className="text-center space-y-3 py-3 md:py-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 backdrop-blur-xl">
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-[10px] md:text-xs font-bold tracking-wider text-pink-400 uppercase">궁합 점수</span>
            </div>
            
            {/* Score Circle */}
            <div className="relative inline-block">
              <svg className="w-32 h-32 md:w-40 md:h-40">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-white/5"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * result.score) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl md:text-4xl font-black text-white">{result.score}</span>
                <span className="text-[10px] md:text-xs text-pink-400 font-bold">LOVE SCORE</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="text-white font-medium">{form.getValues("name1")}</span>
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-white font-medium">{form.getValues("name2")}</span>
            </div>
          </section>

          {/* Interpretation Card */}
          <Card className="bg-white/5 border-white/10 overflow-hidden rounded-xl">
            <CardHeader className="border-b border-white/5 px-4 py-3">
              <CardTitle className="text-sm md:text-base flex items-center gap-2 text-pink-400">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
                궁합 해석
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-white/90 leading-relaxed">
                {interpretation}
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button 
              className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 h-11 rounded-xl font-medium text-sm"
              onClick={() => shareContent({ title: '무운 궁합 결과', text: `궁합 점수: ${result.score}점! 우리의 궁합을 확인해보세요.` })}
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
