import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Star, Sparkles, User, TrendingUp, Zap, Heart, Share2, Briefcase, Activity, Users, Quote } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

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

// --- 고도화된 해석 로직 (이미지 스타일 반영) ---

// 1. 총론 생성
function getGeneralReview(stem: string, branch: string): { title: string; content: string } {
  const reviews: Record<string, { title: string; content: string }> = {
    '甲': { title: "하늘을 향해 뻗어가는 거대한 소나무의 기상", content: "당신은 갑목(甲木)의 기운을 타고나, 마치 숲속에서 가장 높이 솟은 소나무와 같은 존재입니다. 리더십이 강하고 명예를 소중히 여기며, 어떤 어려움이 와도 굴하지 않고 다시 일어서는 강인한 생명력을 가지고 있습니다. 주변 사람들에게 든든한 버팀목이 되어주는 분입니다." },
    '乙': { title: "바람에 꺾이지 않는 유연하고 아름다운 담쟁이", content: "당신은 을목(乙木)의 기운을 가져, 겉으로는 부드러워 보이지만 내면은 누구보다 끈질기고 강인합니다. 주변 환경에 적응하는 능력이 탁월하며, 예술적 감각과 섬세한 배려심으로 사람들의 마음을 사로잡는 매력을 지니고 있습니다." },
    '丙': { title: "세상을 환하게 비추는 뜨거운 태양의 열정", content: "당신은 병화(丙火)의 기운으로, 마치 하늘 높이 뜬 태양처럼 밝고 활기찬 에너지를 가졌습니다. 솔직하고 뒤끝이 없으며, 자신의 열정으로 주변을 변화시키는 힘이 있습니다. 당신이 가는 곳마다 활기가 넘치고 사람들의 주목을 받게 됩니다." },
    '丁': { title: "어둠 속을 밝히는 따뜻하고 깊이 있는 등불", content: "당신은 정화(丁火)의 기운을 타고나, 겉은 조용해 보일지라도 내면에는 뜨거운 열망과 깊은 통찰력을 품고 있습니다. 세심하고 분석적이며, 보이지 않는 곳에서 묵묵히 자신의 역할을 다해 세상을 따뜻하게 만드는 소중한 존재입니다." },
    '戊': { title: "모든 것을 품어주는 넓고 웅장한 대지의 포용력", content: "당신은 무토(戊土)의 기운으로, 마치 거대한 산이나 넓은 벌판처럼 듬직하고 믿음직스러운 사람입니다. 신의를 중요하게 여기며, 주변의 모든 것을 포용하고 중재하는 능력이 뛰어납니다. 당신의 안정감이 많은 사람들에게 평안을 줍니다." },
    '己': { title: "만물을 길러내는 비옥하고 따뜻한 정원의 흙", content: "당신은 기토(己土)의 기운을 가져, 인정이 많고 섬세하며 남을 잘 챙기는 어머니와 같은 마음을 가졌습니다. 성실하고 꼼꼼하며, 주어진 환경에서 최선을 다해 결실을 맺는 능력이 탁월합니다. 주변 사람들에게 꼭 필요한 존재입니다." },
    '庚': { title: "단단하게 벼려진 날카롭고 정의로운 칼날의 의지", content: "당신은 경금(庚金)의 기운으로, 결단력이 빠르고 의리가 강하며 정의로운 사람입니다. 한 번 마음먹은 일은 끝까지 밀어붙이는 추진력이 대단하며, 복잡한 상황을 명쾌하게 정리하는 능력이 있습니다. 당신의 강직함이 큰 성취를 이끌어냅니다." },
    '辛': { title: "빛나는 보석처럼 섬세하고 고귀한 감각의 소유자", content: "당신은 신금(辛金)의 기운을 타고나, 깔끔하고 섬세하며 자신만의 독특한 매력을 지닌 분입니다. 미적 감각이 뛰어나고 완벽을 추구하는 성향이 있어, 어떤 일이든 수준 높게 완성해냅니다. 당신의 고귀한 품격이 주변을 빛나게 합니다." },
    '壬': { title: "모든 것을 받아들이는 깊고 넓은 바다의 지혜", content: "당신은 임수(壬水)의 기운으로, 지혜롭고 유연하며 큰 도량을 가진 사람입니다. 생각이 깊고 창의적이며, 어떤 상황에서도 막힘없이 흘러가는 물처럼 적응력이 뛰어납니다. 당신의 넓은 마음이 큰 세상을 담아낼 수 있습니다." },
    '癸': { title: "만물을 적시는 맑고 깨끗한 이슬비의 생명력", content: "당신은 계수(癸水)의 기운을 가져, 조용하면서도 세밀하고 지혜로운 분입니다. 주변 사람들의 마음을 촉촉하게 적셔주는 공감 능력이 뛰어나며, 겉으로 드러나지 않아도 내실 있게 자신의 삶을 가꾸어가는 실속 있는 분입니다." }
  };
  return reviews[stem] || { title: "하늘의 기운을 품은 귀한 사주", content: "당신은 독특하고 귀한 기운을 타고나셨습니다. 삶의 매 순간마다 지혜롭게 대처하며 자신만의 길을 개척해나가는 힘이 있습니다." };
}

// 2. 시기별 운세 생성
function getLifeStageFortune(stem: string) {
  return {
    early: {
      title: "초년운 (1세 ~ 27세): 배움과 성장의 시기",
      content: "이 시기는 마치 봄에 씨앗을 뿌리는 것과 같습니다. 호기심이 많고 배움에 대한 열망이 강해 다양한 경험을 쌓게 됩니다. 때로는 시행착오를 겪기도 하지만, 그 과정이 당신의 인생을 지탱하는 단단한 뿌리가 되어줄 것입니다."
    },
    middle: {
      title: "중년운 (28세 ~ 57세): 인생의 황금기, 결실을 맺는 시기",
      content: "그동안 쌓아온 노력들이 빛을 발하는 시기입니다. 사회적으로 자리를 잡고 재물과 명예를 동시에 얻을 수 있는 기회가 찾아옵니다. 특히 30대 후반부터 40대 사이에 큰 성취가 예상되며, 당신의 능력을 세상에 널리 알리게 될 것입니다."
    },
    late: {
      title: "말년운 (58세 이후): 평온과 존경의 시기",
      content: "인생의 풍파를 지나 평온한 바다에 도착한 형상입니다. 그동안의 지혜를 후배들에게 나누어주며 존경받는 어른으로서의 삶을 살게 됩니다. 경제적인 안정과 더불어 가족들과 화목하게 지내며 정신적인 풍요로움을 누리는 시기입니다."
    }
  };
}

// 3. 분야별 상세 풀이
function getDetailedAnalysis(stem: string, maritalStatus: string) {
  return [
    {
      category: "재물운",
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      content: "당신은 재물을 모으는 힘보다 관리하는 지혜가 뛰어납니다. 꾸준한 저축과 안정적인 투자를 통해 중년 이후 큰 부를 축적하게 됩니다. 횡재수보다는 성실함이 당신의 재물을 지켜주는 가장 큰 무기입니다."
    },
    {
      category: "직업운",
      icon: <Briefcase className="w-5 h-5 text-blue-400" />,
      content: "사람을 상대하거나 창의적인 아이디어를 내는 분야에서 두각을 나타냅니다. 전문직이나 교육, 상담 분야도 잘 어울리며, 조직 내에서 중재자 역할을 할 때 당신의 가치가 가장 높게 평가받습니다."
    },
    {
      category: "건강운",
      icon: <Activity className="w-5 h-5 text-green-400" />,
      content: "기본적으로 건강한 체질이지만, 스트레스로 인한 소화기 계통이나 순환기 질환을 주의해야 합니다. 규칙적인 운동과 명상을 통해 마음의 여유를 갖는 것이 장수의 비결입니다."
    },
    {
      category: "배우자/자녀",
      icon: <Heart className="w-5 h-5 text-pink-400" />,
      content: maritalStatus === "married" 
        ? "배우자와는 서로 보완해주는 관계입니다. 때로는 의견 차이가 있더라도 대화를 통해 풀어나가면 더욱 돈독해집니다. 자녀들은 당신의 성실함을 닮아 사회에서 제 역할을 다하는 효자가 될 것입니다."
        : "당신의 가치를 알아주는 따뜻한 인연이 기다리고 있습니다. 서두르기보다 자신을 먼저 사랑할 때 좋은 인연이 자연스럽게 찾아옵니다. 자녀운 또한 좋아 훗날 큰 기쁨을 줄 것입니다."
    }
  ];
}

// 4. 인생 조언
function getLifeAdvice(stem: string) {
  return "당신의 인생은 잔잔한 호수가 아닌, 때로는 거친 파도가 몰아치는 드넓은 바다와 같습니다. 수많은 시련은 당신을 더 단단하고 지혜롭게 만드는 과정일 뿐입니다. 이제는 지난 세월의 풍파를 자양분 삼아, 너그러운 마음으로 주변을 돌보며 지혜를 나누는 삶을 살아가시길 바랍니다. 당신의 앞날에 평안과 행복이 가득하기를 기원합니다.";
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                          className="px-6 py-2 rounded-l-md border border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="px-6 py-2 rounded-r-md border border-l-0 border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                    <div>
                      <Label className="text-white mb-3 block">결혼 유무</Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("maritalStatus")}
                        onValueChange={(value) => {
                          if (value) form.setValue("maritalStatus", value as "single" | "married");
                        }}
                        className="justify-start"
                      >
                        <ToggleGroupItem
                          value="single"
                          className="px-6 py-2 rounded-l-md border border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                        >
                          미혼
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="married"
                          className="px-6 py-2 rounded-r-md border border-l-0 border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white"
                        >
                          기혼
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
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

  const generalReview = getGeneralReview(result.dayPillar.stem, result.dayPillar.branch);
  const lifeStages = getLifeStageFortune(result.dayPillar.stem);
  const detailedAnalysis = getDetailedAnalysis(result.dayPillar.stem, form.getValues("maritalStatus"));
  const lifeAdvice = getLifeAdvice(result.dayPillar.stem);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10" onClick={() => setResult(null)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-white">평생사주 결과</h1>
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
          className="max-w-3xl mx-auto space-y-10"
        >
          {/* 1. 총론 섹션 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold text-white">총론: {generalReview.title}</h2>
            </div>
            <Card className="bg-card border-white/10 shadow-xl overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-4 gap-4 text-center py-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">연주</p>
                    <div className="text-2xl font-bold text-primary">{result.yearPillar.stem}{result.yearPillar.branch}</div>
                    <p className="text-xs text-white/40">{stemNames[result.yearPillar.stem]}{branchNames[result.yearPillar.branch]}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">월주</p>
                    <div className="text-2xl font-bold text-primary">{result.monthPillar.stem}{result.monthPillar.branch}</div>
                    <p className="text-xs text-white/40">{stemNames[result.monthPillar.stem]}{branchNames[result.monthPillar.branch]}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">일주</p>
                    <div className="text-2xl font-bold text-primary">{result.dayPillar.stem}{result.dayPillar.branch}</div>
                    <p className="text-xs text-white/40">{stemNames[result.dayPillar.stem]}{branchNames[result.dayPillar.branch]}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">시주</p>
                    <div className="text-2xl font-bold text-primary">{result.hourPillar.stem}{result.hourPillar.branch}</div>
                    <p className="text-xs text-white/40">{stemNames[result.hourPillar.stem]}{branchNames[result.hourPillar.branch]}</p>
                  </div>
                </div>
                <p className="text-lg text-white/90 leading-relaxed indent-4">
                  {form.getValues("name")}님의 사주는 <span className="text-primary font-bold">{stemNames[result.dayPillar.stem]}({result.dayPillar.stem})</span> 일간으로, {generalReview.content}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* 2. 시기별 운세 섹션 */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold text-white">시기별 운세</h2>
            </div>
            <div className="space-y-4">
              {[lifeStages.early, lifeStages.middle, lifeStages.late].map((stage, idx) => (
                <Card key={idx} className="bg-card border-white/10 hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-primary flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {stage.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 leading-relaxed">{stage.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* 3. 분야별 상세 풀이 섹션 */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold text-white">분야별 상세 풀이</h2>
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

          {/* 4. 인생 조언 섹션 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold text-white">인생 조언</h2>
            </div>
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <CardContent className="p-8 relative">
                <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
                <p className="text-lg text-white/90 leading-relaxed text-center italic">
                  "{lifeAdvice}"
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
