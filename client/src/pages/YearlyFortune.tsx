import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Star, Cloud, CloudRain, Sun, Share2, Sparkles, User } from "lucide-react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

// 한자 독음 매핑
const stemNames: Record<string, string> = {
  '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무',
  '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계'
};

const branchNames: Record<string, string> = {
  '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
  '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해'
};

// 월별 운세 데이터
function getMonthlyFortuneFlow() {
  return [
    { month: "1월", weather: "흐림", detail: "새로운 시작의 달입니다. 지난해의 마무리를 하고 새로운 계획을 세우기에 좋습니다. 너무 성급하게 움직이지 말고 신중함을 유지하세요. 이 달의 결정이 올해 전체에 영향을 미칠 수 있습니다." },
    { month: "2월", weather: "비", detail: "변화의 바람이 불어오는 달입니다. 예상치 못한 일들이 발생할 수 있습니다. 하지만 이는 나쁜 일만은 아닙니다. 유연한 마음으로 변화에 대응하면 새로운 기회가 생길 수 있습니다." },
    { month: "3월", weather: "맑음", detail: "도전의 시기가 옵니다. 지금까지 미루고 있던 일들을 시작하기에 좋은 때입니다. 두려움이 있을 수 있지만 용기를 내세요. 이 달의 도전이 나중에 큰 성과로 이어질 것입니다." },
    { month: "4월", weather: "흐림", detail: "안정을 찾는 달입니다. 지난 3개월간의 활동으로 피로가 쌓여있을 수 있습니다. 차분한 마음으로 현재 상황을 정리하고 재정을 점검해보세요. 이 달의 휴식이 다음 활동의 에너지가 될 것입니다." },
    { month: "5월", weather: "맑음", detail: "활동적인 에너지가 높은 달입니다. 새로운 프로젝트를 시작하거나 중요한 결정을 내리기에 좋습니다. 당신의 밝은 에너지가 주변 사람들에게 긍정적인 영향을 미칠 수 있습니다. 이 달의 기회를 놓치지 마세요." },
    { month: "6월", weather: "비", detail: "감정의 변화가 있을 수 있는 달입니다. 주변 사람들과의 관계에서 작은 충돌이 있을 수 있습니다. 하지만 이는 관계를 더 깊게 만드는 기회가 될 수 있습니다. 상대방의 입장에서 생각해보세요." },
    { month: "7월", weather: "맑음", detail: "행운의 달입니다. 그동안의 노력이 빛을 발하는 시기입니다. 중요한 결정을 하거나 새로운 프로젝트를 시작하기에 좋습니다. 이 달의 기회는 당신의 인생을 바꿀 수 있습니다. 주저하지 말고 행동하세요." },
    { month: "8월", weather: "흐림", detail: "휴식의 시간이 필요한 달입니다. 7월의 활동으로 에너지를 많이 소비했을 것입니다. 이 달에는 충분한 휴식을 취하고 자신을 돌아보는 시간을 가져보세요. 명상이나 취미 활동을 통해 마음을 정화하세요." },
    { month: "9월", weather: "흐림", detail: "재정 관리에 주의해야 하는 달입니다. 예상치 못한 지출이 있을 수 있습니다. 큰 투자나 구매는 피하고 현재의 자산을 지키는 데 집중하세요. 이 달의 신중함이 나중의 풍요로움을 만듭니다." },
    { month: "10월", weather: "맑음", detail: "기회의 달입니다. 새로운 사람을 만나거나 새로운 일이 시작될 수 있습니다. 이 달의 기회는 당신의 인생을 바꿀 수 있습니다. 주변을 잘 살피고 놓치지 마세요. 주저하지 말고 행동하세요." },
    { month: "11월", weather: "맑음", detail: "성공의 시기입니다. 당신의 노력이 결실을 맺는 달입니다. 자신감을 가지고 앞으로 나아가세요. 이 달의 성공이 내년의 기반이 될 것입니다. 감사함을 잊지 말고 주변 사람들과 기쁨을 나누세요." },
    { month: "12월", weather: "흐림", detail: "마무리와 준비의 달입니다. 올해를 돌아보고 내년을 준비하는 시간입니다. 올해의 성과와 실패를 모두 받아들이고 배움으로 삼으세요. 새로운 해를 맞이할 준비를 하면서 희망을 가져보세요." },
  ];
}

// 월별 날씨 아이콘 반환
function getWeatherIcon(weather: string) {
  switch (weather) {
    case "흐림":
      return <Cloud className="w-8 h-8 text-gray-400" />;
    case "비":
      return <CloudRain className="w-8 h-8 text-blue-400" />;
    case "맑음":
      return <Sun className="w-8 h-8 text-yellow-400" />;
    default:
      return <Sun className="w-8 h-8 text-white/50" />;
  }
}

// 올해 운세 종합 해석
function getYearlyFortuneInterpretation(stem: string): string {
  const interpretations: Record<string, string> = {
    '甲': "올해는 당신에게 새로운 기회가 많이 찾아오는 해입니다. 갑(甲)의 새싹 같은 에너지가 활발하게 움직이면서 지금까지 준비해온 것들이 꽃을 피울 수 있는 시기입니다. 새로운 프로젝트나 사업을 시작하려고 했다면 올해가 적기입니다. 다만 너무 빨리 나아가려다 보니 주변을 돌아보지 못할 수 있으니 주의하세요. 월별 운세 흐름을 참고하여 중요한 일을 진행하면 좋은 결과를 얻을 수 있습니다. 당신의 열정이 주변 사람들을 감동시킬 것입니다.",
    '乙': "올해는 감정의 변화가 많은 해입니다. 을(乙)의 섬세한 에너지로 당신의 감정이 풍부하고 예술적 감각이 빛날 수 있는 시기입니다. 예술이나 창의적인 일에 관심이 있다면 이번 해가 좋은 기회가 될 수 있습니다. 감정을 잘 관리하고 자신의 감정을 긍정적으로 표현하는 방법을 찾으세요. 주변 사람들과의 관계를 소중히 여기면 큰 도움을 받을 수 있습니다. 이 해는 당신의 내면을 성장시키는 시간이 될 것입니다.",
    '丙': "올해는 활동적인 에너지가 높은 해입니다. 병(丙)의 태양 같은 에너지가 당신을 밝게 비추면서 주변 사람들에게 긍정적인 영향을 미칠 수 있습니다. 새로운 일을 시작하거나 도전하기에 좋은 시기입니다. 다만 너무 많은 일을 한꺼번에 하려다 보니 피로할 수 있으니 적절한 휴식을 취하세요. 중요한 결정은 신중하게 하고, 주변 사람들의 의견도 들어보세요. 당신의 열정이 큰 성과로 이어질 것입니다.",
    '丁': "올해는 깊이 있는 생각을 할 수 있는 해입니다. 정(丁)의 촛불 같은 에너지로 인생의 의미를 찾거나 중요한 결정을 내리기에 좋은 시기입니다. 당신의 통찰력이 빛날 수 있으니 자신을 믿고 나아가세요. 감정의 변화가 있을 수 있지만, 그것을 통해 성장할 수 있습니다. 혼자만의 시간을 가지면서 자신을 돌아보는 것이 좋습니다. 이 해는 당신을 더 깊고 성숙한 사람으로 만들 것입니다.",
    '戊': "올해는 안정과 신뢰가 중요한 해입니다. 무(戊)의 땅 같은 에너지로 당신의 성실함과 책임감이 큰 신뢰로 돌아올 수 있습니다. 새로운 책임이나 역할이 주어질 수 있으니 그것을 잘 감당하면 큰 성과를 얻을 수 있습니다. 현재의 상황에 만족하고 꾸준히 노력하면 좋은 결과를 기대할 수 있습니다. 주변 사람들과의 관계를 소중히 여기세요. 당신의 안정적인 에너지가 주변을 편하게 만들 것입니다.",
    '己': "올해는 남을 돕는 일에서 행복을 찾을 수 있는 해입니다. 기(己)의 따뜻한 에너지로 당신의 배려심과 공감 능력이 빛날 수 있습니다. 새로운 인간관계가 형성될 수 있으니 열린 마음으로 만나세요. 다만 자신을 너무 뒤로 미루지 않도록 주의하세요. 자신을 위한 시간도 가져야 합니다. 이 해는 당신이 누군가에게 소중한 존재임을 깨닫게 해줄 것입니다.",
    '庚': "올해는 리더십이 필요한 해입니다. 경(庚)의 금속 같은 강한 에너지로 당신의 의지와 결단력이 빛날 수 있습니다. 새로운 책임이나 역할이 주어질 수 있으니 그것을 잘 감당하세요. 다만 너무 고집스럽지 않도록 주의하고 다른 의견도 들어보세요. 당신의 강함을 긍정적으로 사용하면 큰 성과를 얻을 수 있습니다. 이 해는 당신의 리더십을 증명하는 시간이 될 것입니다.",
    '辛': "올해는 당신의 예민함이 빛날 수 있는 해입니다. 신(辛)의 보석 같은 에너지로 당신의 섬세한 감각이 예술적 표현으로 나타날 수 있습니다. 예술이나 창의적인 일에 관심이 있다면 이번 해가 좋은 기회가 될 수 있습니다. 당신의 섬세한 감각을 표현하는 방법을 찾으세요. 감정의 변화가 있을 수 있지만, 그것을 통해 성장할 수 있습니다. 자신을 믿고 나아가세요.",
    '壬': "올해는 새로운 환경에 적응하기 좋은 해입니다. 임(壬)의 물 같은 유연한 에너지로 당신의 적응력과 지혜가 빛날 수 있습니다. 새로운 기회가 찾아올 수 있으니 열린 마음으로 맞이하세요. 다만 정체성을 잃지 않도록 주의하세요. 자신의 중심을 잃지 않으면서 변화에 적응하세요. 이 해는 당신을 더 유연하고 지혜로운 사람으로 만들 것입니다.",
    '癸': "올해는 당신의 진정성이 빛날 수 있는 해입니다. 계(癸)의 이슬 같은 부드러운 에너지로 당신의 진정성이 깊은 영향력을 미칠 수 있습니다. 조용하지만 깊은 영향력을 미칠 수 있습니다. 새로운 인간관계가 형성될 수 있으니 열린 마음으로 만나세요. 자신의 목소리를 내는 것이 중요합니다. 당신의 의견은 소중하니 용기 내어 표현하세요. 이 해는 당신의 진정성을 세상에 드러내는 시간이 될 것입니다."
  };
  return interpretations[stem] || "올해는 당신에게 특별한 해가 될 것입니다.";
}

export default function YearlyFortune() {
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
            <h1 className="text-xl font-bold text-white">올해운세</h1>
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
                  <User className="w-5 h-5 text-primary" />
                  기본 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* 이름 */}
                  <div>
                    <Label htmlFor="name" className="text-white mb-2 block">이름</Label>
                    <Input
                      id="name"
                      placeholder="이름을 입력해주세요"
                      {...form.register("name")}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  {/* 성별 */}
                  <div>
                    <Label className="text-white mb-3 block">성별</Label>
                    <RadioGroup value={form.watch("gender")} onValueChange={(value) => form.setValue("gender", value as "male" | "female")}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="text-white cursor-pointer">남성</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="text-white cursor-pointer">여성</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* 생년월일 */}
                  <div>
                    <Label htmlFor="birthDate" className="text-white mb-2 block">생년월일</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      {...form.register("birthDate")}
                      className="bg-white/5 border-white/10 text-white"
                    />
                    {form.formState.errors.birthDate && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.birthDate.message}</p>
                    )}
                  </div>

                  {/* 태어난 시간 */}
                  <div>
                    <Label htmlFor="birthTime" className="text-white mb-2 block">태어난 시간</Label>
                    <Input
                      id="birthTime"
                      type="time"
                      {...form.register("birthTime")}
                      className="bg-white/5 border-white/10 text-white"
                    />
                    {form.formState.errors.birthTime && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.birthTime.message}</p>
                    )}
                  </div>

                  {/* 달력 종류 */}
                  <div>
                    <Label htmlFor="calendarType" className="text-white mb-2 block">달력 종류</Label>
                    <Select value={form.watch("calendarType")} onValueChange={(value) => form.setValue("calendarType", value as "solar" | "lunar")}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="달력을 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solar">양력 (태양력)</SelectItem>
                        <SelectItem value="lunar">음력 (음력)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold">
                    <Sparkles className="w-4 h-4 mr-2" />
                    올해운세 보기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  const monthlyData = getMonthlyFortuneFlow();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10" onClick={() => setResult(null)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-white">올해운세</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-yellow-400 hover:bg-yellow-400/10"
            onClick={() => {
              const text = `${form.getValues('name')}님의 올해운세를 확인해보세요! 무운(무료 운세)에서 당신의 2026년 운세를 알아보세요.`;
              if (window.Kakao) {
                window.Kakao.Share.sendDefault({
                  objectType: 'feed',
                  content: {
                    title: '나의 올해운세',
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
          {/* 사주팔자 정보 */}
          <Card className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-white/10 shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                {form.getValues('name')}님의 사주팔자
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-muted-foreground mb-2">년주(年柱)</p>
                  <p className="text-2xl font-bold text-primary">{result.yearPillar.stem}{result.yearPillar.branch}</p>
                  <p className="text-xs text-white/50 mt-1">{stemNames[result.yearPillar.stem]}{branchNames[result.yearPillar.branch]}</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-muted-foreground mb-2">월주(月柱)</p>
                  <p className="text-2xl font-bold text-primary">{result.monthPillar.stem}{result.monthPillar.branch}</p>
                  <p className="text-xs text-white/50 mt-1">{stemNames[result.monthPillar.stem]}{branchNames[result.monthPillar.branch]}</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-muted-foreground mb-2">일주(日柱)</p>
                  <p className="text-2xl font-bold text-primary">{result.dayPillar.stem}{result.dayPillar.branch}</p>
                  <p className="text-xs text-white/50 mt-1">{stemNames[result.dayPillar.stem]}{branchNames[result.dayPillar.branch]}</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-muted-foreground mb-2">시주(時柱)</p>
                  <p className="text-2xl font-bold text-primary">{result.hourPillar.stem}{result.hourPillar.branch}</p>
                  <p className="text-xs text-white/50 mt-1">{stemNames[result.hourPillar.stem]}{branchNames[result.hourPillar.branch]}</p>
                </div>
              </div>
              <p className="text-sm text-white/70 text-center">
                사주팔자는 태어난 년, 월, 일, 시를 십간십지로 나타낸 것입니다. 각각 2글자씩, 총 8글자로 이루어져 있습니다.
              </p>
            </CardContent>
          </Card>

          {/* 올해 운세 종합 해석 */}
          <Card className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-white/10 shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                2026년 운세 종합
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 leading-relaxed">
                {getYearlyFortuneInterpretation(result.dayPillar.stem)}
              </p>
            </CardContent>
          </Card>

          {/* 월별 운세 흐름 */}
          <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-white/10 shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                월별 운세 흐름
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {monthlyData.map((month, index) => (
                  <div key={`month-${index}`} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm font-semibold text-white mb-2">{month.month}</p>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(month.weather)}
                    </div>
                    <p className="text-xs text-white/70 mb-2">{month.weather}</p>
                    <p className="text-xs text-white/60 leading-relaxed">{month.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 공유 버튼 */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                const text = `${form.getValues('name')}님의 2026년 올해운세를 확인해보세요!\n\n무운(무료 운세)에서 당신의 월별 운세와 상세한 해석을 알아보세요!`;
                if (window.Kakao) {
                  window.Kakao.Share.sendDefault({
                    objectType: 'feed',
                    content: {
                      title: '나의 올해운세',
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
