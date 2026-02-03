import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Heart, Share2, Sparkles, User } from "lucide-react";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateSaju, SajuResult } from "@/lib/saju";

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
  };

  if (!result) {
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
            <h1 className="text-xl font-bold text-white">무료 궁합 풀이</h1>
          </div>
        </header>

        {/* Form Section */}
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
                    <Heart className="w-5 h-5 text-primary" />
                    무료 궁합 정보 입력
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* 첫 번째 사람 정보 */}
                  <div className="space-y-4 pb-6 border-b border-white/10">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
                      첫 번째 사람
                    </h3>

                    <div>
                      <Label htmlFor="name1" className="text-white mb-2 block">이름</Label>
                      <Input
                        id="name1"
                        placeholder="이름을 입력해주세요"
                        {...form.register("name1")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div>
                      <Label className="text-white mb-3 block">성별</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("gender1")}
                        onValueChange={(value) => {
                          if (value) form.setValue("gender1", value as "male" | "female");
                        }}
                        className="justify-start"
                      >
                        <ToggleGroupItem
                          value="male"
                          className="px-8 py-3 text-base rounded-l-md border border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="px-8 py-3 text-base rounded-r-md border border-l-0 border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="birthDate1" className="text-white block text-base font-semibold">생년월일</Label>
                        <Input
                          id="birthDate1"
                          type="date"
                          {...form.register("birthDate1")}
                          className="bg-white/5 border-white/10 text-white w-full appearance-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthTime1" className="text-white block text-base font-semibold">태어난 시간</Label>
                        <Input
                          id="birthTime1"
                          type="time"
                          {...form.register("birthTime1")}
                          className="bg-white/5 border-white/10 text-white w-full appearance-none"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-white mb-3 block">구분</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("calendarType1")}
                        onValueChange={(value) => {
                          if (value) form.setValue("calendarType1", value as "solar" | "lunar");
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
                  </div>

                  {/* 두 번째 사람 정보 */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center">2</span>
                      두 번째 사람
                    </h3>

                    <div>
                      <Label htmlFor="name2" className="text-white mb-2 block">이름</Label>
                      <Input
                        id="name2"
                        placeholder="이름을 입력해주세요"
                        {...form.register("name2")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div>
                      <Label className="text-white mb-3 block">성별</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("gender2")}
                        onValueChange={(value) => {
                          if (value) form.setValue("gender2", value as "male" | "female");
                        }}
                        className="justify-start"
                      >
                        <ToggleGroupItem
                          value="male"
                          className="px-8 py-3 text-base rounded-l-md border border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="px-8 py-3 text-base rounded-r-md border border-l-0 border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="birthDate2" className="text-white block text-base font-semibold">생년월일</Label>
                        <Input
                          id="birthDate2"
                          type="date"
                          {...form.register("birthDate2")}
                          className="bg-white/5 border-white/10 text-white w-full appearance-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthTime2" className="text-white block text-base font-semibold">태어난 시간</Label>
                        <Input
                          id="birthTime2"
                          type="time"
                          {...form.register("birthTime2")}
                          className="bg-white/5 border-white/10 text-white w-full appearance-none"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-white mb-3 block">구분</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("calendarType2")}
                        onValueChange={(value) => {
                          if (value) form.setValue("calendarType2", value as "solar" | "lunar");
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
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold">
                    <Heart className="w-4 h-4 mr-2" />
                    궁합 보기
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
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10" onClick={() => setResult(null)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-white">무료 궁합 풀이</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-yellow-400 hover:bg-yellow-400/10"
            onClick={() => {
              shareContent({
                title: '무운 궁합 결과',
                text: `${form.getValues('name1')}님과 ${form.getValues('name2')}님의 궁합 결과를 확인해보세요!`,
              });
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Results Section */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* 궁합 점수 */}
          <Card className="bg-gradient-to-br from-pink-900/40 to-red-900/40 border-white/10 shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                {form.getValues('name1')} ❤️ {form.getValues('name2')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">궁합 점수</p>
                <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400">
                  {result.score}%
                </p>
                <p className="text-sm text-white/70 mt-2">
                  {result.score >= 90 ? "완벽한 궁합입니다! 💕" : 
                   result.score >= 70 ? "좋은 궁합입니다! 💗" :
                   result.score >= 50 ? "보통의 궁합입니다 💓" :
                   "신중함이 필요합니다 💔"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 사주팔자 비교 */}
          <Card className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-white/10 shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                사주팔자 비교
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* 첫 번째 사람 */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold text-center">{form.getValues('name1')}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-xs text-muted-foreground mb-1">년주</p>
                      <p className="text-lg font-bold text-primary">{result.saju1.yearPillar.stem}{result.saju1.yearPillar.branch}</p>
                      <p className="text-xs text-white/50">{stemNames[result.saju1.yearPillar.stem]}{branchNames[result.saju1.yearPillar.branch]}</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-xs text-muted-foreground mb-1">월주</p>
                      <p className="text-lg font-bold text-primary">{result.saju1.monthPillar.stem}{result.saju1.monthPillar.branch}</p>
                      <p className="text-xs text-white/50">{stemNames[result.saju1.monthPillar.stem]}{branchNames[result.saju1.monthPillar.branch]}</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-xs text-muted-foreground mb-1">일주</p>
                      <p className="text-lg font-bold text-primary">{result.saju1.dayPillar.stem}{result.saju1.dayPillar.branch}</p>
                      <p className="text-xs text-white/50">{stemNames[result.saju1.dayPillar.stem]}{branchNames[result.saju1.dayPillar.branch]}</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-xs text-muted-foreground mb-1">시주</p>
                      <p className="text-lg font-bold text-primary">{result.saju1.hourPillar.stem}{result.saju1.hourPillar.branch}</p>
                      <p className="text-xs text-white/50">{stemNames[result.saju1.hourPillar.stem]}{branchNames[result.saju1.hourPillar.branch]}</p>
                    </div>
                  </div>
                </div>

                {/* 두 번째 사람 */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold text-center">{form.getValues('name2')}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-xs text-muted-foreground mb-1">년주</p>
                      <p className="text-lg font-bold text-pink-400">{result.saju2.yearPillar.stem}{result.saju2.yearPillar.branch}</p>
                      <p className="text-xs text-white/50">{stemNames[result.saju2.yearPillar.stem]}{branchNames[result.saju2.yearPillar.branch]}</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-xs text-muted-foreground mb-1">월주</p>
                      <p className="text-lg font-bold text-pink-400">{result.saju2.monthPillar.stem}{result.saju2.monthPillar.branch}</p>
                      <p className="text-xs text-white/50">{stemNames[result.saju2.monthPillar.stem]}{branchNames[result.saju2.monthPillar.branch]}</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-xs text-muted-foreground mb-1">일주</p>
                      <p className="text-lg font-bold text-pink-400">{result.saju2.dayPillar.stem}{result.saju2.dayPillar.branch}</p>
                      <p className="text-xs text-white/50">{stemNames[result.saju2.dayPillar.stem]}{branchNames[result.saju2.dayPillar.branch]}</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-xs text-muted-foreground mb-1">시주</p>
                      <p className="text-lg font-bold text-pink-400">{result.saju2.hourPillar.stem}{result.saju2.hourPillar.branch}</p>
                      <p className="text-xs text-white/50">{stemNames[result.saju2.hourPillar.stem]}{branchNames[result.saju2.hourPillar.branch]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 궁합 해석 */}
          <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-white/10 shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                궁합 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 leading-relaxed">
                {getCompatibilityInterpretation(result.score, result.saju1, result.saju2)}
              </p>
            </CardContent>
          </Card>

          {/* 오행 상성 설명 */}
          <Card className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-white/10 shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                오행 상성
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80">
                {form.getValues('name1')}님의 일주 천간은 <span className="font-semibold text-primary">{result.saju1.dayPillar.stem}({stemNames[result.saju1.dayPillar.stem]})</span>이고, 오행은 <span className="font-semibold text-primary">{elementMap[result.saju1.dayPillar.stem]}</span>입니다.
              </p>
              <p className="text-white/80">
                {form.getValues('name2')}님의 일주 천간은 <span className="font-semibold text-pink-400">{result.saju2.dayPillar.stem}({stemNames[result.saju2.dayPillar.stem]})</span>이고, 오행은 <span className="font-semibold text-pink-400">{elementMap[result.saju2.dayPillar.stem]}</span>입니다.
              </p>
              <p className="text-white/80 leading-relaxed">
                오행은 목(木), 화(火), 토(土), 금(金), 수(水) 다섯 가지로 나뉩니다. 각 오행은 서로 다른 관계를 가지고 있습니다. 같은 오행이거나 상생(좋은 영향을 주는) 관계일수록 궁합이 좋고, 상극(나쁜 영향을 주는) 관계일수록 궁합이 좋지 않습니다. 하지만 이것이 절대적인 것은 아니며, 서로를 이해하고 존중한다면 어떤 조합이든 좋은 관계를 만들 수 있습니다.
              </p>
            </CardContent>
          </Card>

          {/* 공유 버튼 */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                const text = `${form.getValues('name1')}과 ${form.getValues('name2')}의 궁합 점수는 ${result.score}%입니다!\n\n무운(무료 운세)에서 당신들의 상세한 궁합 분석을 확인해보세요!`;
                if (window.Kakao) {
                  window.Kakao.Share.sendDefault({
                    objectType: 'feed',
                    content: {
                      title: '우리의 궁합',
                      description: text,
                      imageUrl: 'https://via.placeholder.com/1200x630',
                      link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                      },
                    },
                  });
                }
              }}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              <Share2 className="w-4 h-4 mr-2" />
              카카오톡으로 공유하기
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

declare global {
  interface Window {
    Kakao?: any;
  }
}
