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

// 한자 독음 매핑
const stemNames: Record<string, string> = {
  '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무',
  '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계'
};

const branchNames: Record<string, string> = {
  '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
  '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해'
};

// 오행 매핑
const elementMap: Record<string, string> = {
  '甲': '목', '乙': '목', '丙': '화', '丁': '화', '戊': '토',
  '己': '토', '庚': '금', '辛': '금', '壬': '수', '癸': '수'
};

// 오행 상성 계산
function calculateCompatibility(saju1: SajuResult, saju2: SajuResult): number {
  const element1 = elementMap[saju1.dayPillar.stem];
  const element2 = elementMap[saju2.dayPillar.stem];

  // 오행 상성 점수
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
    return `${element1}(${elementMap[saju1.dayPillar.stem]})과(와) ${element2}(${elementMap[saju2.dayPillar.stem]})의 조합은 매우 좋은 궁합입니다. 오행 상성이 매우 우수하여 두 사람이 함께할 때 서로를 보완하고 발전시킬 수 있습니다. 감정적으로도 잘 맞아 깊은 이해와 신뢰가 형성될 수 있습니다. 함께 노력한다면 오래도록 행복한 관계를 유지할 수 있을 것입니다. 이 조합은 부부로서도, 친구로서도, 사업 파트너로서도 좋은 결과를 기대할 수 있습니다.`;
  } else if (score >= 70) {
    return `${element1}과(와) ${element2}의 조합은 좋은 궁합입니다. 오행 상성이 양호하여 두 사람이 함께할 때 대체로 잘 맞습니다. 약간의 차이가 있을 수 있지만, 서로를 이해하고 존중한다면 충분히 좋은 관계를 만들 수 있습니다. 작은 갈등이 있을 수 있지만, 그것을 통해 관계가 더 깊어질 수 있습니다. 함께 노력한다면 행복한 관계를 유지할 수 있을 것입니다.`;
  } else if (score >= 50) {
    return `${element1}과(와) ${element2}의 조합은 보통의 궁합입니다. 오행 상성이 중간 정도로, 두 사람이 함께할 때 장점도 있고 단점도 있습니다. 서로 다른 부분이 있을 수 있지만, 이를 이해하고 존중한다면 좋은 관계를 만들 수 있습니다. 의사소통이 중요하며, 상대방을 이해하려는 노력이 필요합니다. 함께 노력한다면 충분히 좋은 관계를 유지할 수 있을 것입니다.`;
  } else {
    return `${element1}과(와) ${element2}의 조합은 신중함이 필요한 궁합입니다. 오행 상성이 좋지 않아 두 사람이 함께할 때 충돌이 있을 수 있습니다. 하지만 이것이 절대적인 것은 아닙니다. 서로를 깊이 이해하고 존중한다면, 이러한 차이를 극복하고 좋은 관계를 만들 수 있습니다. 특히 의사소통과 상호 존중이 매우 중요합니다. 함께 노력한다면 관계를 개선할 수 있을 것입니다.`;
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

  // 로컬 스토리지에서 데이터 불러오기
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
    // 사주 계산
    const date1 = new Date(`${data.birthDate1}T${data.birthTime1}`);
    const date2 = new Date(`${data.birthDate2}T${data.birthTime2}`);
    const saju1 = calculateSaju(date1, data.gender1);
    const saju2 = calculateSaju(date2, data.gender2);
    const score = calculateCompatibility(saju1, saju2);
    
    setResult({ saju1, saju2, score });
    window.scrollTo(0, 0);
  };

  const commonMaxWidth = "w-full max-w-4xl mx-auto";

  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px]" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-white">무료 궁합 풀이</h1>
          </div>
        </header>

        {/* Form Section */}
        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-8`}
          >
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 backdrop-blur-xl">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-[11px] md:text-xs font-bold tracking-widest text-pink-400 uppercase">서로의 기운을 맞추다</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">무료 궁합</h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
                두 사람의 사주를 분석하여<br className="md:hidden" /> 서로의 조화와 인연의 깊이를 확인해보세요
              </p>
            </div>

            {/* Input Form Card */}
            <Card className="glass-panel border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b border-white/5 p-6 md:p-10">
                <CardTitle className="text-white flex items-center gap-3 text-xl md:text-2xl">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
                  </div>
                  궁합 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-10">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                  {/* 첫 번째 사람 정보 */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-pink-500 text-white text-sm md:text-base font-bold flex items-center justify-center">1</div>
                      <h3 className="text-white font-bold text-base md:text-lg">첫 번째 사람</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="name1" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                          <User className="w-4 h-4 text-pink-400" />
                          이름
                        </Label>
                        <Input
                          id="name1"
                          placeholder="이름을 입력해주세요"
                          {...form.register("name1")}
                          className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-2xl focus:ring-pink-500/50 focus:border-pink-500 transition-all text-base"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-white text-base font-medium ml-1 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-pink-400" />
                          성별
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("gender1")}
                          onValueChange={(value) => {
                            if (value) form.setValue("gender1", value as "male" | "female");
                          }}
                          className="w-full h-14 bg-white/5 p-1.5 rounded-2xl border border-white/10"
                        >
                          <ToggleGroupItem
                            value="male"
                            className="flex-1 h-full rounded-xl data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base"
                          >
                            남성
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="female"
                            className="flex-1 h-full rounded-xl data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base"
                          >
                            여성
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="birthDate1" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-pink-400" />
                          생년월일
                        </Label>
                        <Input
                          id="birthDate1"
                          type="date"
                          {...form.register("birthDate1")}
                          className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-pink-500/50 focus:border-pink-500 transition-all text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="birthTime1" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-pink-400" />
                          태어난 시간
                        </Label>
                        <Input
                          id="birthTime1"
                          type="time"
                          {...form.register("birthTime1")}
                          className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-pink-500/50 focus:border-pink-500 transition-all text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 구분선 */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <Heart className="w-6 h-6 text-pink-400" />
                    <div className="flex-1 h-px bg-white/10"></div>
                  </div>

                  {/* 두 번째 사람 정보 */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500 text-white text-sm md:text-base font-bold flex items-center justify-center">2</div>
                      <h3 className="text-white font-bold text-base md:text-lg">두 번째 사람</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="name2" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                          <User className="w-4 h-4 text-red-400" />
                          이름
                        </Label>
                        <Input
                          id="name2"
                          placeholder="이름을 입력해주세요"
                          {...form.register("name2")}
                          className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-2xl focus:ring-red-500/50 focus:border-red-500 transition-all text-base"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-white text-base font-medium ml-1 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-red-400" />
                          성별
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("gender2")}
                          onValueChange={(value) => {
                            if (value) form.setValue("gender2", value as "male" | "female");
                          }}
                          className="w-full h-14 bg-white/5 p-1.5 rounded-2xl border border-white/10"
                        >
                          <ToggleGroupItem
                            value="male"
                            className="flex-1 h-full rounded-xl data-[state=on]:bg-red-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base"
                          >
                            남성
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="female"
                            className="flex-1 h-full rounded-xl data-[state=on]:bg-red-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base"
                          >
                            여성
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="birthDate2" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-red-400" />
                          생년월일
                        </Label>
                        <Input
                          id="birthDate2"
                          type="date"
                          {...form.register("birthDate2")}
                          className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-red-500/50 focus:border-red-500 transition-all text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="birthTime2" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-red-400" />
                          태어난 시간
                        </Label>
                        <Input
                          id="birthTime2"
                          type="time"
                          {...form.register("birthTime2")}
                          className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-red-500/50 focus:border-red-500 transition-all text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-16 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    무료 궁합 결과 보기
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-4 md:p-5 text-center space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mx-auto">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-white">궁합 점수</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-4 md:p-5 text-center space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto">
                    <Activity className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-white">오행 분석</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-4 md:p-5 text-center space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-white">상세 해석</p>
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
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setResult(null)} className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg md:text-xl font-bold text-white">궁합 결과</h1>
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

      <main className="relative z-10 px-4 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${commonMaxWidth} space-y-6 md:space-y-8`}
        >
          {/* Score Section */}
          <section className="text-center space-y-4 py-4 md:py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 backdrop-blur-xl">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-[11px] md:text-xs font-bold tracking-widest text-pink-400 uppercase">궁합 점수</span>
            </div>
            
            {/* Score Circle */}
            <div className="relative inline-block">
              <svg className="w-40 h-40 md:w-48 md:h-48">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-white/5"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
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
                <span className="text-4xl md:text-5xl font-black text-white">{result.score}</span>
                <span className="text-xs md:text-sm text-pink-400 font-bold">LOVE SCORE</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm md:text-base">
              <span className="text-white font-medium">{form.getValues("name1")}</span>
              <Heart className="w-5 h-5 text-pink-400" />
              <span className="text-white font-medium">{form.getValues("name2")}</span>
            </div>
          </section>

          {/* Interpretation Card */}
          <Card className="bg-white/5 border-white/10 overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-white/5 p-4 md:p-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2 text-pink-400">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <Activity className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                궁합 해석
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-sm md:text-base text-white/90 leading-relaxed">
                {interpretation}
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button 
              className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 min-h-[48px] md:min-h-[56px] rounded-xl font-medium"
              onClick={() => shareContent({ title: '무운 궁합 결과', text: `궁합 점수: ${result.score}점! 우리의 궁합을 확인해보세요.` })}
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
