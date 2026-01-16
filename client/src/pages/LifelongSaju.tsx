import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Star, Sparkles, User, TrendingUp, Zap, Heart, Share2, Briefcase } from "lucide-react";
import { Link } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

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
  maritalStatus: z.enum(["single", "married"]),
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

// Persona A - 인생 굴곡 그래프 데이터 생성
function generateLifeCurveData() {
  return [
    { age: 10, score: 40, label: "10대" },
    { age: 20, score: 55, label: "20대" },
    { age: 30, score: 75, label: "30대", peak: true },
    { age: 40, score: 70, label: "40대" },
    { age: 50, score: 65, label: "50대" },
    { age: 60, score: 60, label: "60대" },
    { age: 70, score: 50, label: "70대" },
  ];
}

// Persona C - 재물운 점수 계산
function getWealthScore(stem: string): number {
  const scores: Record<string, number> = {
    '甲': 65, '乙': 60, '丙': 55, '丁': 70,
    '戊': 75, '己': 65, '庚': 80, '辛': 70,
    '壬': 85, '癸': 60
  };
  return scores[stem] || 60;
}

// Persona C - 사업운 점수 계산
function getBusinessScore(stem: string): number {
  const scores: Record<string, number> = {
    '甲': 70, '乙': 65, '丙': 75, '丁': 60,
    '戊': 80, '己': 70, '庚': 85, '辛': 75,
    '壬': 70, '癸': 65
  };
  return scores[stem] || 70;
}

// Persona C - 연애운 점수 계산
function getLoveScore(stem: string): number {
  const scores: Record<string, number> = {
    '甲': 75, '乙': 80, '丙': 70, '丁': 85,
    '戊': 60, '己': 70, '庚': 55, '辛': 65,
    '壬': 75, '癸': 80
  };
  return scores[stem] || 70;
}

// 성격 특성 해석 (중학생 수준)
function getPersonalityInterpretation(stem: string): string {
  const personalities: Record<string, string> = {
    '甲': "당신은 새로운 것을 좋아하고 도전 정신이 강한 사람입니다. 마치 봄의 새싹처럼 항상 앞으로 나아가려고 합니다. 때로는 너무 빨리 나아가려다 보니 주변을 돌아보지 못할 수도 있습니다. 하지만 그 열정이 당신의 가장 큰 장점입니다.",
    '乙': "당신은 섬세하고 감정이 풍부한 사람입니다. 주변 사람들의 기분을 잘 알아채고 배려하는 마음이 많습니다. 예술이나 창의적인 일에 재능이 있을 가능성이 높습니다. 때로는 자신의 감정에 흔들릴 수 있지만, 그것이 당신을 더 따뜻한 사람으로 만듭니다.",
    '丙': "당신은 밝고 활발한 에너지를 가진 사람입니다. 주변 사람들을 즐겁게 해주고 분위기를 밝게 만드는 능력이 있습니다. 마치 태양처럼 따뜻하고 밝은 존재입니다. 때로는 너무 활동적이어서 쉬지 못할 수도 있습니다. 가끔은 멈춰서 자신을 돌아보는 시간을 가져보세요.",
    '丁': "당신은 깊이 있는 생각을 하는 사람입니다. 표면적인 것보다는 본질을 파고드는 성향이 있습니다. 감정이 풍부해서 예술이나 문학에 관심이 많을 수 있습니다. 때로는 생각이 많아서 우울해질 수도 있지만, 그 깊이가 당신을 특별하게 만듭니다.",
    '戊': "당신은 책임감이 강하고 성실한 사람입니다. 주어진 일을 끝까지 해내려는 의지가 강합니다. 마치 땅처럼 안정적이고 믿을 수 있는 사람입니다. 때로는 너무 무거운 책임감으로 힘들 수도 있습니다. 하지만 그 성실함이 사람들에게 신뢰를 줍니다.",
    '己': "당신은 남을 돕는 것을 좋아하는 따뜻한 사람입니다. 주변 사람들의 어려움을 보면 자연스럽게 손을 내밀게 됩니다. 공감 능력이 뛰어나고 누군가의 좋은 친구가 될 수 있습니다. 때로는 자신을 너무 뒤로 미루지 않도록 주의하세요.",
    '庚': "당신은 강한 의지와 결단력을 가진 사람입니다. 어려운 상황에서도 흔들리지 않는 모습이 있습니다. 리더십이 있어서 사람들이 당신을 따릅니다. 때로는 너무 고집스러울 수도 있으니 다른 의견도 들어보세요.",
    '辛': "당신은 예민하고 섬세한 감각을 가진 사람입니다. 작은 변화도 잘 감지하고 디테일을 중요하게 생각합니다. 예술적 감각이 뛰어날 가능성이 높습니다. 때로는 너무 예민해서 상처받을 수도 있습니다. 하지만 그 예민함이 당신을 특별하게 만듭니다.",
    '壬': "당신은 유연하고 적응력이 뛰어난 사람입니다. 어떤 상황에서도 잘 적응하고 새로운 환경을 두려워하지 않습니다. 마치 물처럼 어디든지 흘러갈 수 있는 능력이 있습니다. 때로는 정체성을 잃을 수도 있으니 자신의 중심을 잃지 않도록 주의하세요.",
    '癸': "당신은 조용하지만 깊은 영향력을 가진 사람입니다. 말이 많지 않지만 행동으로 보여주는 사람입니다. 깊은 생각을 하고 신중한 판단을 합니다. 때로는 자신의 의견을 표현하지 못할 수도 있습니다. 하지만 당신의 진정성이 사람들을 움직입니다."
  };
  return personalities[stem] || "당신은 독특한 성격을 가진 사람입니다.";
}

// Persona B - 공감형 과거 해석 (더 자세함)
function getPastInterpretation(stem: string): string {
  const interpretations: Record<string, string> = {
    '甲': "당신의 어린 시절은 항상 앞으로 나아가려는 욕구로 가득 찼을 겁니다. 새로운 것을 배우고 싶고, 빨리 성장하고 싶은 마음이 있었을 거예요. 때로는 그 열정 때문에 주변 사람들을 따라가지 못해 외로움을 느꼈을 수도 있습니다. 하지만 그 도전 정신이 당신을 지금의 모습으로 만들었습니다.",
    '乙': "당신은 주변 사람들의 감정을 많이 살피며 자랐을 겁니다. 누군가 슬프면 함께 슬프고, 누군가 기쁘면 함께 기뻐했을 거예요. 때로는 그 공감 능력 때문에 자신의 감정을 제대로 표현하지 못했을 수도 있습니다. 하지만 그 섬세함이 당신을 더 따뜻한 사람으로 만들었습니다.",
    '丙': "당신의 어린 시절은 밝고 활기찼을 겁니다. 항상 누군가를 웃게 만들고 싶었고, 분위기를 밝게 만들려고 노력했을 거예요. 때로는 그 활동성 때문에 조용히 쉬지 못했을 수도 있습니다. 하지만 당신의 밝은 에너지가 주변 사람들에게 희망을 주었습니다.",
    '丁': "당신은 깊이 있는 생각을 하며 자랐을 겁니다. 왜 이런 일이 일어날까, 이게 맞는 건가 하는 질문을 많이 했을 거예요. 때로는 그 생각의 깊이 때문에 혼자라고 느껴질 수도 있었습니다. 하지만 그 깊이가 당신을 특별하게 만들었습니다.",
    '戊': "당신은 책임감을 가지고 자랐을 겁니다. 주어진 일을 끝까지 해내려고 노력했고, 누군가를 실망시키지 않으려고 애썼을 거예요. 때로는 그 책임감이 너무 무거워서 힘들었을 수도 있습니다. 하지만 그 성실함이 사람들에게 신뢰를 주었습니다.",
    '己': "당신은 남을 돕는 것을 자연스럽게 배웠을 겁니다. 누군가 어려우면 도와주고, 누군가 외로우면 함께해주려고 했을 거예요. 때로는 자신의 일을 뒤로 미루고 남을 챙겼을 수도 있습니다. 하지만 그 따뜻함이 당신을 소중한 사람으로 만들었습니다.",
    '庚': "당신은 강함을 배우며 자랐을 겁니다. 어려운 상황에서도 흔들리지 않으려고 노력했고, 누군가를 보호하려고 했을 거예요. 때로는 그 강함 때문에 약한 모습을 보여주지 못했을 수도 있습니다. 하지만 당신의 강함이 주변 사람들을 안심시켰습니다.",
    '辛': "당신은 예민한 감각으로 세상을 느끼며 자랐을 겁니다. 작은 변화도 잘 감지했고, 남들이 놓치는 것들을 봤을 거예요. 때로는 그 예민함 때문에 상처를 많이 받았을 수도 있습니다. 하지만 그 섬세함이 당신을 특별하게 만들었습니다.",
    '壬': "당신은 유연하게 적응하며 자랐을 겁니다. 새로운 환경에 잘 적응했고, 어떤 상황에서도 잘 지낼 수 있었을 거예요. 때로는 그 유연함 때문에 자신이 뭔지 헷갈렸을 수도 있습니다. 하지만 그 적응력이 당신을 강하게 만들었습니다.",
    '癸': "당신은 조용히 견디며 자랐을 겁니다. 말은 많지 않았지만 행동으로 보여주려고 했을 거예요. 때로는 자신의 마음을 표현하지 못해 외로웠을 수도 있습니다. 하지만 당신의 진정성이 사람들의 마음을 움직였습니다."
  };
  return interpretations[stem] || "당신의 과거는 당신을 만드는 소중한 자산입니다.";
}

// Persona B - 미래 방향 (결혼 유무 반영)
function getFutureDirection(stem: string, maritalStatus: string): string {
  const directions: Record<string, string> = {
    '甲': "당신의 미래는 밝습니다. 지금까지 쌓은 경험과 도전 정신을 바탕으로 30대 중반부터 새로운 기회가 찾아올 것입니다.",
    '乙': "당신의 섬세함과 창의성이 빛날 시간이 옵니다. 예술, 디자인, 문학 등 창의적인 분야에서 성공할 가능성이 높습니다.",
    '丙': "40대가 당신의 전성기입니다. 지금까지의 밝은 에너지와 활동성이 큰 성과로 나타날 것입니다.",
    '丁': "당신의 깊이 있는 생각이 큰 통찰력으로 발전할 것입니다. 인생의 의미를 찾는 일에서 성공할 수 있습니다.",
    '戊': "50대에 안정과 번영이 찾아올 것입니다. 당신의 성실함과 책임감이 큰 신뢰로 돌아올 것입니다.",
    '己': "당신이 남을 돕는 일에서 진정한 행복을 찾을 것입니다. 상담이나 교육 분야에서 큰 성공을 거둘 것입니다.",
    '庚': "리더십이 필요한 자리에서 당신의 가치가 빛날 것입니다. 당신의 강한 의지가 많은 사람들을 이끌 것입니다.",
    '辛': "당신의 예민함을 예술이나 창작으로 표현하면 큰 성공을 거둘 것입니다. 당신의 예민함은 강점입니다.",
    '壬': "당신의 적응력을 활용해 새로운 분야에 도전하면 성공할 것입니다. 여행이나 무역 분야에서 빛날 것입니다.",
    '癸': "당신의 조용한 영향력으로 주변을 변화시킬 것입니다. 당신의 진정성이 사람들을 움직일 것입니다."
  };

  const maritalAdvice = maritalStatus === "married" 
    ? " 배우자와의 소통이 당신의 운을 더욱 상승시키는 열쇠가 될 것입니다. 가정의 안정이 곧 사회적 성공으로 이어지는 흐름입니다."
    : " 지금은 자신에게 집중하며 내면의 역량을 키우는 시기입니다. 곧 당신의 가치를 알아주는 소중한 인연이나 기회가 찾아올 것입니다.";

  return (directions[stem] || "당신의 미래는 밝습니다. 현재에 충실하세요.") + maritalAdvice;
}

// 십간 설명
function getStemExplanation(stem: string): string {
  const explanations: Record<string, string> = {
    '甲': "갑(甲)은 봄의 새싹을 의미합니다. 새로운 시작, 성장, 도전을 나타냅니다.",
    '乙': "을(乙)은 봄의 꽃을 의미합니다. 유연함, 섬세함, 창의성을 나타냅니다.",
    '丙': "병(丙)은 여름의 태양을 의미합니다. 밝음, 열정, 활동성을 나타냅니다.",
    '丁': "정(丁)은 촛불을 의미합니다. 깊이, 통찰력, 감성을 나타냅니다.",
    '戊': "무(戊)는 여름의 땅을 의미합니다. 안정, 신뢰, 책임감을 나타냅니다.",
    '己': "기(己)는 땅의 양지를 의미합니다. 배려, 따뜻함, 공감을 나타냅니다.",
    '庚': "경(庚)은 가을의 금속을 의미합니다. 강함, 결단력, 리더십을 나타냅니다.",
    '辛': "신(辛)은 보석을 의미합니다. 예민함, 섬세함, 아름다움을 나타냅니다.",
    '壬': "임(壬)은 겨울의 물을 의미합니다. 유연함, 적응력, 지혜를 나타냅니다.",
    '癸': "계(癸)는 이슬을 의미합니다. 신중함, 깊이, 진정성을 나타냅니다."
  };
  return explanations[stem] || "십간은 동양 철학의 기본 개념입니다.";
}

export default function LifelongSaju() {
  const [result, setResult] = useState<SajuResult | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "2000-01-01",
      birthTime: "12:00",
      calendarType: "solar",
      maritalStatus: "single",
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
            <h1 className="text-xl font-bold text-white">평생사주</h1>
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
                  <User className="w-5 h-5 text-primary" />
                  기본 정보 입력
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
                    {form.formState.errors.name && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
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
                    <div>
                      <Label className="text-white mb-3 block">결혼 유무</Label>
                      <RadioGroup value={form.watch("maritalStatus")} onValueChange={(value) => form.setValue("maritalStatus", value as "single" | "married")}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="single" />
                          <Label htmlFor="single" className="text-white cursor-pointer">미혼</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="married" id="married" />
                          <Label htmlFor="married" className="text-white cursor-pointer">기혼</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="birthDate" className="text-white mb-2 block">생년월일</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...form.register("birthDate")}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthTime" className="text-white mb-2 block">태어난 시간</Label>
                      <Input
                        id="birthTime"
                        type="time"
                        {...form.register("birthTime")}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

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
                    평생사주 보기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  const wealthScore = getWealthScore(result.dayPillar.stem);
  const businessScore = getBusinessScore(result.dayPillar.stem);
  const loveScore = getLoveScore(result.dayPillar.stem);
  const lifeData = generateLifeCurveData();
  const maritalStatus = form.getValues("maritalStatus");

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10" onClick={() => setResult(null)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-white">평생사주</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-yellow-400 hover:bg-yellow-400/10"
            onClick={() => {
              const text = `${form.getValues('name')}님의 평생사주 결과를 확인해보세요!`;
              if (window.Kakao) {
                window.Kakao.Share.sendDefault({
                  objectType: 'feed',
                  content: {
                    title: '나의 평생사주',
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

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <Card className="bg-card border-white/10 shadow-xl backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-white/5 pb-4">
              <CardTitle className="text-2xl text-white text-center">
                {form.getValues("name")}님의 타고난 운명
              </CardTitle>
              <p className="text-center text-primary font-medium">
                {maritalStatus === "married" ? "💍 기혼" : "✨ 미혼"} · {form.getValues("gender") === "male" ? "남성" : "여성"}
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-4 gap-4 text-center mb-8">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">연주</p>
                  <div className="text-xl font-bold text-primary">{result.yearPillar.stem}{result.yearPillar.branch}</div>
                  <p className="text-xs text-white/50">{stemNames[result.yearPillar.stem]}{branchNames[result.yearPillar.branch]}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">월주</p>
                  <div className="text-xl font-bold text-primary">{result.monthPillar.stem}{result.monthPillar.branch}</div>
                  <p className="text-xs text-white/50">{stemNames[result.monthPillar.stem]}{branchNames[result.monthPillar.branch]}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">일주</p>
                  <div className="text-xl font-bold text-primary">{result.dayPillar.stem}{result.dayPillar.branch}</div>
                  <p className="text-xs text-white/50">{stemNames[result.dayPillar.stem]}{branchNames[result.dayPillar.branch]}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">시주</p>
                  <div className="text-xl font-bold text-primary">{result.hourPillar.stem}{result.hourPillar.branch}</div>
                  <p className="text-xs text-white/50">{stemNames[result.hourPillar.stem]}{branchNames[result.hourPillar.branch]}</p>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white/80 text-sm leading-relaxed text-center">
                  {getStemExplanation(result.dayPillar.stem)}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-white/10">
              <CardContent className="p-6 flex flex-col items-center gap-2">
                <Zap className="w-8 h-8 text-yellow-400" />
                <p className="text-sm text-muted-foreground">재물운</p>
                <p className="text-2xl font-bold text-white">{wealthScore}점</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-white/10">
              <CardContent className="p-6 flex flex-col items-center gap-2">
                <Briefcase className="w-8 h-8 text-blue-400" />
                <p className="text-sm text-muted-foreground">사업운</p>
                <p className="text-2xl font-bold text-white">{businessScore}점</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-white/10">
              <CardContent className="p-6 flex flex-col items-center gap-2">
                <Heart className="w-8 h-8 text-pink-400" />
                <p className="text-sm text-muted-foreground">연애운</p>
                <p className="text-2xl font-bold text-white">{loveScore}점</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                인생의 흐름
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lifeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="label" stroke="rgba(255,255,255,0.5)" />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#EAB308" strokeWidth={3} dot={{ r: 6, fill: '#EAB308' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                성격 및 특성
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 leading-relaxed">
                {getPersonalityInterpretation(result.dayPillar.stem)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                나아갈 길 (미래)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 leading-relaxed">
                {getFutureDirection(result.dayPillar.stem, maritalStatus)}
              </p>
            </CardContent>
          </Card>

          <Button
            onClick={() => setResult(null)}
            className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
          >
            다시 확인하기
          </Button>
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
