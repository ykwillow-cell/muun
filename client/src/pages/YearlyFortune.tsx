import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Star, Share2, Sparkles, User, TrendingUp, Zap, Briefcase, Activity, Users, Quote, Sun, Cloud, CloudRain } from "lucide-react";
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

// 한자 독음 매핑
const stemNames: Record<string, string> = {
  '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무',
  '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계'
};

// --- 고도화된 2026년 병오년 해석 로직 ---

// 1. 총론 생성
function getYearlyGeneralReview(stem: string): { title: string; content: string } {
  const reviews: Record<string, { title: string; content: string }> = {
    '甲': { title: "뜨거운 태양 아래, 지혜와 명예가 빛나는 해", content: "2026년 병오년은 하늘과 땅이 모두 강력한 불(火)의 기운으로 가득 찬 해입니다. 이는 갑목(甲木)인 당신에게 강력한 식상(食傷)의 기운을 불어넣는 것과 같습니다. 당신의 창의성과 지혜가 사회적으로 인정받고, 명예가 높아지는 한 해가 될 것입니다. 새로운 것을 배우거나 오랫동안 관심을 두었던 분야를 깊이 탐구하기에도 매우 좋은 시기입니다." },
    '乙': { title: "화려한 꽃이 만개하듯, 재능이 세상에 드러나는 해", content: "병오년의 강한 불기운은 을목(乙木)인 당신을 화려하게 꽃피우는 에너지가 됩니다. 그동안 숨겨왔던 당신의 재능과 매력이 세상에 널리 알려지며, 많은 사람의 주목을 받게 될 것입니다. 예술적 감각이 극대화되는 시기이니 자신감을 가지고 자신을 표현하세요. 다만, 너무 화려함만 쫓다 보면 실속을 놓칠 수 있으니 내실을 기하는 지혜가 필요합니다." },
    '丙': { title: "태양이 두 개 뜬 형상, 넘치는 에너지를 조절해야 하는 해", content: "병화(丙火)인 당신에게 병오년은 같은 기운이 중첩되는 해입니다. 에너지가 그 어느 때보다 넘치고 추진력이 대단해지지만, 자칫하면 독단적으로 보일 수 있습니다. 주변 사람들과 협력하고 속도를 조절한다면 인생의 큰 전환점을 만들 수 있는 강력한 운세입니다. 겸손함이 당신의 성공을 완성해줄 것입니다." },
    '丁': { title: "등불이 횃불이 되듯, 영향력이 확대되는 해", content: "정화(丁火)인 당신에게 병오년은 당신의 작은 빛이 큰 불꽃으로 번져나가는 시기입니다. 당신의 아이디어나 결과물이 큰 영향력을 발휘하게 되며, 조력자들이 나타나 당신을 돕게 됩니다. 정신적인 성숙과 더불어 사회적인 지위가 상승하는 기분 좋은 흐름입니다. 따뜻한 마음으로 주변을 살피면 더 큰 복이 돌아옵니다." },
    '戊': { title: "단단한 대지 위에 열기가 가득하니, 결실을 준비하는 해", content: "무토(戊土)인 당신에게 병오년은 대지가 뜨거운 태양을 받아 만물을 빠르게 성장시키는 형상입니다. 바쁘게 움직이는 만큼 성과가 눈에 보이기 시작하며, 부동산이나 문서와 관련된 운이 좋습니다. 다만, 너무 건조해질 수 있으니 대인관계에서 유연함을 잃지 않도록 노력하세요. 차분한 대응이 큰 이익을 가져다줍니다." },
    '己': { title: "비옥한 정원에 햇살이 가득하니, 풍요로움이 넘치는 해", content: "기토(己土)인 당신에게 병오년은 정원에 따뜻한 햇살이 내리쬐어 곡식이 잘 익어가는 평화로운 해입니다. 인정이 많아지고 주변 사람들과의 관계가 더욱 돈독해지며, 가정에 경사가 있을 수 있습니다. 성실하게 쌓아온 노력들이 결실을 맺는 시기이니 마음껏 풍요로움을 누리시길 바랍니다." },
    '庚': { title: "강한 불길에 원석이 제련되듯, 보석으로 거듭나는 해", content: "경금(庚金)인 당신에게 병오년은 뜨거운 불길이 당신이라는 원석을 아름다운 보석으로 제련하는 과정과 같습니다. 변화와 혁신이 요구되는 시기이며, 다소 힘들 수 있지만 이 과정을 거치면 당신의 가치는 비교할 수 없이 높아질 것입니다. 승진이나 이직 등 신분 상승의 기회가 찾아올 것입니다." },
    '辛': { title: "보석이 빛을 받아 더욱 찬란해지는 명예의 해", content: "신금(辛金)인 당신에게 병오년은 당신의 고귀함이 세상에 널리 알려지는 해입니다. 명예운이 매우 강하여 상을 받거나 높은 자리에 오를 수 있는 기회가 생깁니다. 당신의 섬세한 감각이 대중의 인정을 받게 될 것입니다. 다만, 건강 면에서 호흡기나 피부 관리에 신경을 쓰는 것이 좋습니다." },
    '壬': { title: "넓은 바다에 태양이 비치니, 재물과 기회가 넘실대는 해", content: "임수(壬水)인 당신에게 병오년은 재물운이 가장 강력하게 들어오는 해입니다. 활동 범위가 넓어지고 새로운 사업 기회나 투자 제안이 들어올 수 있습니다. 당신의 지혜가 재물로 연결되는 시기이니 과감하게 움직여보세요. 물과 불이 만나는 형상이니 감정 조절에만 유의한다면 최고의 한 해가 될 것입니다." },
    '癸': { title: "가뭄 끝에 단비가 내리듯, 귀인의 도움을 받는 해", content: "계수(癸水)인 당신에게 병오년은 다소 벅찰 수 있는 불기운이지만, 오히려 이를 해결해줄 귀인이 나타나는 해입니다. 어려운 상황에서 뜻밖의 도움을 받아 문제가 해결되고, 문서나 계약 관련해서 이득을 볼 수 있습니다. 겸손한 자세로 주변의 조언을 경청한다면 위기를 기회로 바꿀 수 있습니다." }
  };
  return reviews[stem] || { title: "2026년 병오년, 새로운 희망의 해", content: "올해는 당신에게 새로운 변화와 성장의 기회가 찾아오는 해입니다. 긍정적인 마음으로 도전한다면 좋은 결실을 맺을 수 있습니다." };
}

// 2. 분야별 상세 운세
function getYearlyDetailedAnalysis(stem: string) {
  return [
    {
      category: "재물운",
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      content: "2026년은 재물에 있어 신중함이 요구되는 해입니다. 강한 불의 기운이 재물을 상징하는 기운을 자극할 수 있으니, 새로운 사업이나 큰 규모의 투자는 가급적 피하는 것이 좋습니다. 현재 가진 것을 안정적으로 지키고 관리하는 데 집중하는 것이 현명한 전략입니다."
    },
    {
      category: "직업/명예운",
      icon: <Briefcase className="w-5 h-5 text-blue-400" />,
      content: "직업운과 명예운은 매우 밝게 빛나는 한 해입니다. 그동안 쌓아온 공로를 인정받아 명예로운 직책을 맡거나, 사회적으로 존경받는 일이 많아질 것입니다. 특히 문서와 관련된 일에서 좋은 성과가 기대됩니다. 주변의 신망을 얻고 리더로서의 역량을 발휘하기에 더없이 좋은 시기입니다."
    },
    {
      category: "건강운",
      icon: <Activity className="w-5 h-5 text-green-400" />,
      content: "건강은 각별한 주의가 필요한 부분입니다. 지나치게 강한 불의 기운은 심장, 혈압 관련 질환을 유발할 수 있습니다. 또한 호흡기나 뼈, 관절 건강이 약해질 수 있으니 과로를 피하고 꾸준한 운동과 충분한 휴식을 통해 심신의 안정을 찾는 것이 무엇보다 중요합니다."
    },
    {
      category: "가족/대인관계",
      icon: <Users className="w-5 h-5 text-pink-400" />,
      content: "가족 및 대인관계에서는 평온함 속에 작은 변화가 예상됩니다. 따뜻한 마음으로 주변 사람들을 포용하고 관계를 돈독히 하려는 노력이 필요합니다. 집안의 변화(이사, 수리 등)나 가족 구성원과의 작은 마찰이 있을 수 있으니, 이럴 때일수록 너그러운 마음으로 소통하세요."
    }
  ];
}

// 3. 월별 운세 흐름
function getMonthlyFlow() {
  return [
    { season: "봄 (2~4월)", title: "새로운 아이디어가 샘솟는 시기", content: "명예가 오르는 시기이나, 지나친 의욕은 금물입니다. 건강을 먼저 챙기세요." },
    { season: "여름 (5~7월)", title: "연중 가장 뜨거운 기운이 몰리는 시기", content: "재물 지출과 건강 악화에 각별히 주의해야 합니다. 마음을 차분히 다스리세요." },
    { season: "가을 (8~10월)", title: "안정을 되찾는 시기", content: "여름의 열기가 가라앉고 안정을 되찾습니다. 문서운이 좋으니 미뤄왔던 계약을 처리하기 좋습니다." },
    { season: "겨울 (11~1월)", title: "조화를 이루고 마무리하는 시기", content: "한 해를 차분히 마무리하고 새로운 계획을 세우기에 좋은 시기입니다. 재물운도 점차 회복됩니다." }
  ];
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
            <h1 className="text-xl font-bold text-white">올해운세</h1>
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

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="text-white block text-sm font-medium">생년월일</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...form.register("birthDate")}
                        className="bg-white/5 border-white/10 text-white w-full appearance-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthTime" className="text-white block text-sm font-medium">태어난 시간</Label>
                      <Input
                        id="birthTime"
                        type="time"
                        {...form.register("birthTime")}
                        className="bg-white/5 border-white/10 text-white w-full appearance-none"
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
                    2026년 운세 보기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  const yearlyReview = getYearlyGeneralReview(result.dayPillar.stem);
  const detailedAnalysis = getYearlyDetailedAnalysis(result.dayPillar.stem);
  const monthlyFlow = getMonthlyFlow();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10" onClick={() => setResult(null)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-white">2026년 운세 결과</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-yellow-400 hover:bg-yellow-400/10"
            onClick={() => {
              const text = `${form.getValues('name')}님의 2026년 병오년 운세 결과를 확인해보세요!`;
              if (window.Kakao) {
                window.Kakao.Share.sendDefault({
                  objectType: 'feed',
                  content: {
                    title: '나의 2026년 운세',
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
          className="max-w-3xl mx-auto space-y-10"
        >
          {/* 1. 총론 섹션 */}
          <section className="space-y-4">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-3xl font-bold text-white">2026년 병오년(丙午年) 운세 상세 풀이</h2>
              <p className="text-primary/80">고객님의 2026년 한 해가 평안하고 복되시기를 기원하며 운세를 상세히 풀어드립니다.</p>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h3 className="text-2xl font-bold text-white">총론: {yearlyReview.title}</h3>
            </div>
            <Card className="bg-card border-white/10 shadow-xl overflow-hidden">
              <CardContent className="p-8">
                <p className="text-lg text-white/90 leading-relaxed indent-4">
                  {yearlyReview.content}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* 2. 분야별 상세 운세 섹션 */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h3 className="text-2xl font-bold text-white">분야별 상세 운세</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detailedAnalysis.map((item, idx) => (
                <Card key={idx} className="bg-card border-white/10">
                  <CardHeader className="pb-2 flex flex-row items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg text-white">{item.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/70 leading-relaxed">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* 3. 월별 운세 흐름 섹션 */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h3 className="text-2xl font-bold text-white">월별 운세 흐름</h3>
            </div>
            <div className="space-y-4">
              {monthlyFlow.map((stage, idx) => (
                <Card key={idx} className="bg-card border-white/10 hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-primary flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {stage.season}: {stage.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 leading-relaxed">{stage.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* 4. 2026년 조언 섹션 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h3 className="text-2xl font-bold text-white">2026년 조언: 지혜로운 관리로 풍요로운 결실을</h3>
            </div>
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <CardContent className="p-8 relative">
                <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
                <p className="text-lg text-white/90 leading-relaxed text-center italic">
                  "2026년은 고객님께 명예와 지혜의 빛을 안겨주는 해이지만, 동시에 재물과 건강에 대한 세심한 관리를 요구하는 해이기도 합니다. 뜨거운 태양 아래 곡식이 잘 익기 위해서는 적절한 물과 바람이 필요한 것과 같은 이치입니다. 급하게 서두르기보다는 한 걸음 물러나 자신의 내면을 들여다보고 지혜를 쌓는 데 집중하십시오."
                </p>
                <Quote className="absolute bottom-4 right-4 w-8 h-8 text-primary/20 rotate-180" />
              </CardContent>
            </Card>
          </section>

          <div className="flex flex-col gap-4 pt-6">
            <Button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setResult(null);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg shadow-lg shadow-primary/20"
            >
              다른 정보로 다시 확인하기
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

declare global {
  interface Window {
    Kakao?: any;
  }
}
