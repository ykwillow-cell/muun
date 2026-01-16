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

// 폼 스키마 정의 (만세력과 동일)
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

// Persona B - 미래 방향 (더 자세함)
function getFutureDirection(stem: string): string {
  const directions: Record<string, string> = {
    '甲': "당신의 미래는 밝습니다. 지금까지 쌓은 경험과 도전 정신을 바탕으로 30대 중반부터 새로운 기회가 찾아올 것입니다. 당신이 원하던 일을 시작할 수 있는 시기가 올 것입니다. 지금은 그 기회를 위해 준비하는 시간입니다. 계속 배우고 성장하세요.",
    '乙': "당신의 섬세함과 창의성이 빛날 시간이 옵니다. 예술, 디자인, 문학 등 창의적인 분야에서 성공할 가능성이 높습니다. 당신의 감정을 표현하는 방법을 찾으면 많은 사람들이 감동받을 것입니다. 자신의 감정을 두려워하지 마세요. 그것이 당신의 가장 큰 자산입니다.",
    '丙': "40대가 당신의 전성기입니다. 지금까지의 밝은 에너지와 활동성이 큰 성과로 나타날 것입니다. 당신이 주도적으로 이끌 수 있는 프로젝트나 일이 생길 것입니다. 당신의 열정을 현실로 만들 수 있는 시기가 올 것입니다. 지금의 노력을 계속하세요.",
    '丁': "당신의 깊이 있는 생각이 큰 통찰력으로 발전할 것입니다. 인생의 의미를 찾는 일, 사람들을 상담하는 일, 또는 철학적인 일에서 성공할 수 있습니다. 당신의 깊이가 많은 사람들을 도울 것입니다. 자신의 생각을 표현하는 용기를 내세요.",
    '戊': "50대에 안정과 번영이 찾아올 것입니다. 당신의 성실함과 책임감이 큰 신뢰로 돌아올 것입니다. 지도자나 관리자의 위치에서 당신의 가치가 빛날 것입니다. 지금의 노력이 반드시 보상받을 것입니다. 계속 성실하게 살아가세요.",
    '己': "당신이 남을 돕는 일에서 진정한 행복을 찾을 것입니다. 상담, 교육, 의료, 사회복지 등 사람을 돕는 분야에서 큰 성공을 거둘 것입니다. 당신의 따뜻함이 세상을 바꿀 것입니다. 자신을 위한 시간도 가져야 한다는 것을 기억하세요.",
    '庚': "리더십이 필요한 자리에서 당신의 가치가 빛날 것입니다. 당신의 강한 의지와 결단력이 많은 사람들을 이끌 것입니다. 경영, 정치, 군사, 스포츠 등 여러 분야에서 성공할 수 있습니다. 당신의 강함을 긍정적으로 사용하세요.",
    '辛': "당신의 예민함을 예술이나 창작으로 표현하면 큰 성공을 거둘 것입니다. 음악, 미술, 문학, 영화 등에서 당신의 재능이 빛날 것입니다. 당신의 예민함은 약점이 아니라 강점입니다. 자신을 믿고 표현하세요.",
    '壬': "당신의 적응력을 활용해 새로운 분야에 도전하면 성공할 것입니다. 여행, 무역, 국제 업무 등 새로운 환경을 필요로 하는 일에서 빛날 것입니다. 당신의 유연함이 큰 자산이 될 것입니다. 계속 배우고 성장하세요.",
    '癸': "당신의 조용한 영향력으로 주변을 변화시킬 것입니다. 당신의 진정성이 사람들을 움직일 것입니다. 교육, 문화, 종교, 철학 등 정신적인 분야에서 성공할 수 있습니다. 자신의 목소리를 내세요. 당신의 말은 소중합니다."
  };
  return directions[stem] || "당신의 미래는 밝습니다. 현재에 충실하세요.";
}

// 십간 설명 (중학생 수준)
function getStemExplanation(stem: string): string {
  const explanations: Record<string, string> = {
    '甲': "갑(甲)은 봄의 새싹을 의미합니다. 새로운 시작, 성장, 도전을 나타냅니다. 갑 일주의 사람들은 항상 앞으로 나아가려는 에너지가 있습니다.",
    '乙': "을(乙)은 봄의 꽃을 의미합니다. 유연함, 섬세함, 창의성을 나타냅니다. 을 일주의 사람들은 감정이 풍부하고 예술적 감각이 있습니다.",
    '丙': "병(丙)은 여름의 태양을 의미합니다. 밝음, 열정, 활동성을 나타냅니다. 병 일주의 사람들은 에너지가 많고 주변을 밝게 만듭니다.",
    '丁': "정(丁)은 촛불을 의미합니다. 깊이, 통찰력, 감성을 나타냅니다. 정 일주의 사람들은 깊은 생각을 하고 감정이 풍부합니다.",
    '戊': "무(戊)는 여름의 땅을 의미합니다. 안정, 신뢰, 책임감을 나타냅니다. 무 일주의 사람들은 성실하고 믿을 수 있습니다.",
    '己': "기(己)는 땅의 양지를 의미합니다. 배려, 따뜻함, 공감을 나타냅니다. 기 일주의 사람들은 남을 돕는 것을 좋아합니다.",
    '庚': "경(庚)은 가을의 금속을 의미합니다. 강함, 결단력, 리더십을 나타냅니다. 경 일주의 사람들은 의지가 강하고 결정력이 있습니다.",
    '辛': "신(辛)은 보석을 의미합니다. 예민함, 섬세함, 아름다움을 나타냅니다. 신 일주의 사람들은 예술적 감각이 뛰어나고 예민합니다.",
    '壬': "임(壬)은 겨울의 물을 의미합니다. 유연함, 적응력, 지혜를 나타냅니다. 임 일주의 사람들은 어떤 상황에도 잘 적응합니다.",
    '癸': "계(癸)는 이슬을 의미합니다. 신중함, 깊이, 진정성을 나타냅니다. 계 일주의 사람들은 조용하지만 깊은 영향력이 있습니다."
  };
  return explanations[stem] || "십간은 동양 철학의 기본 개념입니다.";
}

export default function LifelongSaju() {
  const [result, setResult] = useState<SajuResult | null>(null);
  const [showPeakDetails, setShowPeakDetails] = useState(false);
  
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
            <h1 className="text-xl font-bold text-white">평생사주</h1>
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
  const peakAge = lifeData.find(d => d.peak)?.label || "30대";

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
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
              const text = `${form.getValues('name')}님의 평생사주 결과를 확인해보세요! 무운(무료 운세)에서 당신의 인생 흐름을 알아보세요.`;
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

          {/* Persona C - 점수 카드 (최상단) */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-white/10 shadow-xl backdrop-blur-md">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">💰</div>
                <p className="text-xs text-muted-foreground mb-2">재물운</p>
                <p className="text-3xl font-bold text-yellow-400">{wealthScore}</p>
                <p className="text-xs text-white/60 mt-2">/ 100</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-white/10 shadow-xl backdrop-blur-md">
              <CardContent className="p-6 text-center">
                <Briefcase className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-2">사업운</p>
                <p className="text-3xl font-bold text-blue-400">{businessScore}</p>
                <p className="text-xs text-white/60 mt-2">/ 100</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 border-white/10 shadow-xl backdrop-blur-md">
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-2">연애운</p>
                <p className="text-3xl font-bold text-pink-400">{loveScore}</p>
                <p className="text-xs text-white/60 mt-2">/ 100</p>
              </CardContent>
            </Card>
          </div>

          {/* Persona A - 인생 굴곡 그래프 */}
          <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-white/10 shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                인생 굴곡 흐름 (전성기: {peakAge})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lifeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="label" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line
                    type="monotone" 
                    dataKey="score" 
                    stroke="#FFD700" 
                    strokeWidth={3}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      if (payload.peak) {
                        return (
                          <g key={`peak-${payload.age}`}>
                            <circle cx={cx} cy={cy} r={6} fill="#FFD700" />
                            <text x={cx} y={cy - 15} textAnchor="middle" fill="#FFD700" fontSize={14} fontWeight="bold">
                              🚩
                            </text>
                          </g>
                        );
                      }
                      return <circle key={`dot-${payload.age}`} cx={cx} cy={cy} r={4} fill="#FFD700" />;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-white/70 text-center mt-4">
                당신의 전성기는 {peakAge}입니다. 이 시기에 중요한 결정을 하거나 새로운 일을 시작하면 좋은 결과를 얻을 수 있습니다.
              </p>
            </CardContent>
          </Card>

          {/* Persona B - 성격 특성 */}
          <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-white/10 shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                당신의 성격 특성
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                {getPersonalityInterpretation(result.dayPillar.stem)}
              </p>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <p className="text-sm text-white/70 font-semibold mb-2">당신의 일주: {stemNames[result.dayPillar.stem]}{branchNames[result.dayPillar.branch]}({result.dayPillar.stem}{result.dayPillar.branch})</p>
                <p className="text-sm text-white/70">
                  {getStemExplanation(result.dayPillar.stem)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Persona B - 지나온 길 */}
          <Card className="bg-gradient-to-br from-orange-900/40 to-amber-900/40 border-white/10 shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                지나온 길 (과거)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 leading-relaxed">
                {getPastInterpretation(result.dayPillar.stem)}
              </p>
            </CardContent>
          </Card>

          {/* Persona B - 나아갈 길 */}
          <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-white/10 shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                나아갈 길 (미래)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 leading-relaxed">
                {getFutureDirection(result.dayPillar.stem)}
              </p>
            </CardContent>
          </Card>

          {/* 공유 버튼 */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                const text = `${form.getValues('name')}님의 평생사주:\n재물운 ${wealthScore}/100, 사업운 ${businessScore}/100, 연애운 ${loveScore}/100\n\n무운(무료 운세)에서 당신의 평생사주를 확인해보세요!`;
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
