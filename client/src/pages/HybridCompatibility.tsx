import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChevronLeft, Heart, User, Calendar, Clock, Sparkles, Users, Brain, Star, Zap, Shield, MessageCircle, Home as HomeIcon, AlertTriangle, ThumbsUp, Lightbulb, ArrowDown } from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";
import FortuneShareCard from "@/components/FortuneShareCard";
import { calculateSaju, SajuResult, STEM_ELEMENTS, calculateElementBalance } from "@/lib/saju";
import { STEM_PERSONALITY, analyzeElementBalance } from "@/lib/saju-reading";
import { MBTIType, MBTI_TYPES, MBTI_INFO } from "@/lib/mbti-compatibility";
import { analyzeHybridCompatibility, HybridCompatResult } from "@/lib/hybrid-compatibility";
import { trackEvent, trackCustomEvent } from "@/lib/ga4";

const formSchema = z.object({
  name1: z.string().min(1, "이름을 입력해주세요"),
  gender1: z.enum(["male", "female"]),
  birthDate1: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime1: z.string(),
  birthTimeUnknown1: z.boolean(),
  calendarType1: z.enum(["solar", "lunar"]),
  mbti1: z.string().min(1, "MBTI를 선택해주세요"),
  name2: z.string().min(1, "이름을 입력해주세요"),
  gender2: z.enum(["male", "female"]),
  birthDate2: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime2: z.string(),
  birthTimeUnknown2: z.boolean(),
  calendarType2: z.enum(["solar", "lunar"]),
  mbti2: z.string().min(1, "MBTI를 선택해주세요"),
});

type FormValues = z.infer<typeof formSchema>;

// 점수에 따른 원형 그래프 색상
function getScoreColor(score: number): string {
  if (score >= 85) return '#ff6b9d';
  if (score >= 75) return '#ffd700';
  if (score >= 65) return '#4ecdc4';
  if (score >= 55) return '#7c83ff';
  return '#ff8c42';
}

// 점수 원형 차트 컴포넌트
function ScoreCircle({ score, label, size = 120, color }: { score: number; label: string; size?: number; color?: string }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  const scoreColor = color || getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke={scoreColor}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
        />
        <text x="50" y="46" textAnchor="middle" fill={scoreColor} fontSize="22" fontWeight="900">{score}</text>
        <text x="50" y="60" textAnchor="middle" fill="#999" fontSize="9">점</text>
      </svg>
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

// MBTI 선택 컴포넌트
function MBTISelector({ value, onChange, accentColor = "purple" }: { value: string; onChange: (v: string) => void; accentColor?: string }) {
  const groups = [
    { label: '분석가형', types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'] },
    { label: '외교관형', types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'] },
    { label: '관리자형', types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'] },
    { label: '탐험가형', types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'] },
  ];

  const colorMap: Record<string, string> = {
    purple: 'data-[state=on]:bg-purple-500',
    pink: 'data-[state=on]:bg-pink-500',
    red: 'data-[state=on]:bg-red-500',
  };

  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <div key={group.label}>
          <span className="text-[10px] text-muted-foreground mb-1 block">{group.label}</span>
          <div className="grid grid-cols-4 gap-1">
            {group.types.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onChange(type)}
                className={`text-xs py-1.5 px-1 rounded-lg border transition-all font-medium ${
                  value === type
                    ? `bg-${accentColor}-500 border-${accentColor}-400 text-white`
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
                style={value === type ? { backgroundColor: accentColor === 'pink' ? '#ec4899' : accentColor === 'red' ? '#ef4444' : '#a855f7', borderColor: accentColor === 'pink' ? '#f472b6' : accentColor === 'red' ? '#f87171' : '#c084fc' } : {}}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HybridCompatibility() {
  const [result, setResult] = useState<{
    saju1: SajuResult;
    saju2: SajuResult;
    hybrid: HybridCompatResult;
    name1: string;
    name2: string;
    mbti1: MBTIType;
    mbti2: MBTIType;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name1: "",
      gender1: "male",
      birthDate1: "2000-01-01",
      birthTime1: "12:00",
      birthTimeUnknown1: false,
      calendarType1: "solar",
      mbti1: "",
      name2: "",
      gender2: "female",
      birthDate2: "2000-01-01",
      birthTime2: "12:00",
      birthTimeUnknown2: false,
      calendarType2: "solar",
      mbti2: "",
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset({
        ...form.getValues(),
        name1: parsed.name || "",
        gender1: parsed.gender || "male",
        birthDate1: parsed.birthDate || "2000-01-01",
        birthTime1: parsed.birthTime || "12:00",
        calendarType1: parsed.calendarType || "solar",
      });
    }
  }, [form]);

  const birthTimeUnknown1 = form.watch("birthTimeUnknown1");
  const birthTimeUnknown2 = form.watch("birthTimeUnknown2");

  const onSubmit = (data: FormValues) => {
    const time1 = data.birthTimeUnknown1 ? "12:00" : data.birthTime1;
    const time2 = data.birthTimeUnknown2 ? "12:00" : data.birthTime2;
    const date1 = new Date(`${data.birthDate1}T${time1}`);
    const date2 = new Date(`${data.birthDate2}T${time2}`);
    const saju1 = calculateSaju(date1, data.gender1);
    const saju2 = calculateSaju(date2, data.gender2);

    const hybrid = analyzeHybridCompatibility(
      saju1, saju2,
      data.mbti1 as MBTIType, data.mbti2 as MBTIType,
      data.name1, data.name2
    );

    setResult({
      saju1, saju2, hybrid,
      name1: data.name1, name2: data.name2,
      mbti1: data.mbti1 as MBTIType, mbti2: data.mbti2 as MBTIType,
    });
    window.scrollTo(0, 0);

    try { trackEvent('hybrid_compat_result', 'engagement', 'hybrid_calculated'); } catch {}
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  // ===== 입력 화면 =====
  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-base md:text-lg font-bold text-white">사주xMBTI 궁합</h1>
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-5`}
          >
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-xl">
                <Brain className="w-3 h-3 text-purple-400" />
                <span className="text-[10px] md:text-xs font-bold tracking-wider text-purple-400 uppercase">사주 x MBTI</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">사주xMBTI 궁합</h2>
              <p className="text-muted-foreground text-xs md:text-sm">
                전통 사주와 MBTI 성격 분석을 결합한 하이브리드 궁합
              </p>
            </div>

            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  궁합 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* 첫 번째 사람 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center">1</div>
                      <h3 className="text-white font-bold text-sm">첫 번째 사람</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name1" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-pink-400" /> 이름
                        </Label>
                        <Input id="name1" placeholder="이름" {...form.register("name1")} className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-pink-500/50 focus:border-pink-500 transition-all text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-pink-400" /> 성별
                        </Label>
                        <ToggleGroup type="single" value={form.watch("gender1")} onValueChange={(v) => { if (v) form.setValue("gender1", v as "male" | "female"); }} className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1">
                          <ToggleGroupItem value="male" className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm">남성</ToggleGroupItem>
                          <ToggleGroupItem value="female" className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm">여성</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthDate1" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-pink-400" /> 생년월일
                        </Label>
                        <DatePickerInput id="birthDate1" {...form.register("birthDate1")} accentColor="pink" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="birthTime1" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-pink-400" /> 태어난 시간
                        </Label>
                        <div className="space-y-1">
                          <Input
                            id="birthTime1"
                            type="time"
                            {...form.register("birthTime1")}
                            disabled={birthTimeUnknown1}
                            className={`h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-pink-500/50 focus:border-pink-500 transition-all text-sm ${birthTimeUnknown1 ? 'opacity-40' : ''}`}
                          />
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={birthTimeUnknown1}
                              onChange={(e) => form.setValue("birthTimeUnknown1", e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-pink-500"
                            />
                            <span className="text-[11px] text-white/60">모름</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-pink-400" /> MBTI
                      </Label>
                      <MBTISelector value={form.watch("mbti1")} onChange={(v) => form.setValue("mbti1", v)} accentColor="pink" />
                      {form.watch("mbti1") && (
                        <div className="mt-2 p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                          <span className="text-xs text-pink-300 font-medium">{form.watch("mbti1")} - {MBTI_INFO[form.watch("mbti1") as MBTIType]?.title}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <Heart className="w-4 h-4 text-purple-400" />
                    <div className="flex-1 h-px bg-white/10"></div>
                  </div>

                  {/* 두 번째 사람 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">2</div>
                      <h3 className="text-white font-bold text-sm">두 번째 사람</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name2" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-red-400" /> 이름
                        </Label>
                        <Input id="name2" placeholder="이름" {...form.register("name2")} className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-red-500/50 focus:border-red-500 transition-all text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-red-400" /> 성별
                        </Label>
                        <ToggleGroup type="single" value={form.watch("gender2")} onValueChange={(v) => { if (v) form.setValue("gender2", v as "male" | "female"); }} className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1">
                          <ToggleGroupItem value="male" className="h-full rounded-lg data-[state=on]:bg-red-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm">남성</ToggleGroupItem>
                          <ToggleGroupItem value="female" className="h-full rounded-lg data-[state=on]:bg-red-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm">여성</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthDate2" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-red-400" /> 생년월일
                        </Label>
                        <DatePickerInput id="birthDate2" {...form.register("birthDate2")} accentColor="red" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="birthTime2" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-red-400" /> 태어난 시간
                        </Label>
                        <div className="space-y-1">
                          <Input
                            id="birthTime2"
                            type="time"
                            {...form.register("birthTime2")}
                            disabled={birthTimeUnknown2}
                            className={`h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-red-500/50 focus:border-red-500 transition-all text-sm ${birthTimeUnknown2 ? 'opacity-40' : ''}`}
                          />
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={birthTimeUnknown2}
                              onChange={(e) => form.setValue("birthTimeUnknown2", e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-red-500"
                            />
                            <span className="text-[11px] text-white/60">모름</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-red-400" /> MBTI
                      </Label>
                      <MBTISelector value={form.watch("mbti2")} onChange={(v) => form.setValue("mbti2", v)} accentColor="red" />
                      {form.watch("mbti2") && (
                        <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                          <span className="text-xs text-red-300 font-medium">{form.watch("mbti2")} - {MBTI_INFO[form.watch("mbti2") as MBTIType]?.title}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 hover:from-purple-700 hover:via-pink-600 hover:to-red-600 text-white font-bold text-base rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    사주xMBTI 궁합 분석하기
                  </Button>
                </form>
              </CardContent>
            </Card>

            <p className="text-center text-[10px] text-muted-foreground">
              본 서비스는 전통 사주학과 MBTI 성격유형을 결합한 참고용 분석입니다.
            </p>
          </motion.div>
        </main>
      </div>
    );
  }

  // ===== 결과 화면 =====
  const { saju1, saju2, hybrid, name1, name2, mbti1, mbti2 } = result;
  const mbtiInfo1 = MBTI_INFO[mbti1];
  const mbtiInfo2 = MBTI_INFO[mbti2];

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-base md:text-lg font-bold text-white">사주xMBTI 궁합 결과</h1>
        </div>
      </header>

      <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
        <div className={`${commonMaxWidth} space-y-6`}>

          {/* 1. 종합 점수 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-purple-400" />
                  </div>
                  종합 궁합 점수
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <ScoreCircle score={hybrid.totalScore} label="하이브리드 궁합" size={140} color="#a855f7" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                    <span className="text-sm font-bold text-purple-300">{hybrid.totalGrade}</span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed px-2">
                    {hybrid.totalSummary}
                  </p>

                  {/* 3개 점수 비교 */}
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    <ScoreCircle score={hybrid.sajuScore} label="사주 궁합" size={90} color="#ffd700" />
                    <ScoreCircle score={hybrid.mbtiResult.score} label="MBTI 궁합" size={90} color="#4ecdc4" />
                    <ScoreCircle score={hybrid.crossAnalysis.crossScore} label="크로스 시너지" size={90} color="#ff6b9d" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 2. 사주 궁합 분석 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </div>
                  🔮 전통 사주 궁합 분석
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-medium text-yellow-300">
                    {hybrid.sajuElementRelation}
                  </span>
                </div>
                {hybrid.sajuInterpretation.map((paragraph, idx) => (
                  <p key={idx} className="text-sm text-white/80 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* 3. MBTI 궁합 분석 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-teal-400" />
                  </div>
                  🧠 MBTI 성격 궁합 분석
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-4">
                {/* 두 사람의 MBTI 카드 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-center space-y-1">
                    <div className="text-lg font-bold text-pink-300">{mbti1}</div>
                    <div className="text-[11px] text-pink-200/80">{mbtiInfo1.title}</div>
                    <div className="text-[10px] text-white/50">{name1}님</div>
                  </div>
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center space-y-1">
                    <div className="text-lg font-bold text-red-300">{mbti2}</div>
                    <div className="text-[11px] text-red-200/80">{mbtiInfo2.title}</div>
                    <div className="text-[10px] text-white/50">{name2}님</div>
                  </div>
                </div>

                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-medium text-teal-300">
                    MBTI 궁합: {hybrid.mbtiResult.grade}
                  </span>
                </div>

                <p className="text-sm text-white/80 leading-relaxed">
                  {hybrid.mbtiResult.summary}
                </p>

                {/* 연애 스타일 */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-pink-400" /> 연애 스타일
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-xs font-medium text-pink-300">{name1}님 ({mbti1})</span>
                      <p className="text-xs text-white/70 mt-1 leading-relaxed">{mbtiInfo1.loveStyle}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-xs font-medium text-red-300">{name2}님 ({mbti2})</span>
                      <p className="text-xs text-white/70 mt-1 leading-relaxed">{mbtiInfo2.loveStyle}</p>
                    </div>
                  </div>
                </div>

                {/* 케미 포인트 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ThumbsUp className="w-3.5 h-3.5 text-green-400" /> 두 분의 케미 포인트
                  </h4>
                  {hybrid.mbtiResult.chemistryPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-green-500/5 border border-green-500/10">
                      <span className="text-green-400 text-xs mt-0.5">✓</span>
                      <p className="text-xs text-white/70 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>

                {/* 주의 포인트 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> 이것만 조심하세요
                  </h4>
                  {hybrid.mbtiResult.cautionPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                      <span className="text-amber-400 text-xs mt-0.5">!</span>
                      <p className="text-xs text-white/70 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 4. 크로스 분석 (사주 x MBTI) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-pink-400" />
                  </div>
                  🌟 사주 x MBTI 크로스 분석
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-4">
                <p className="text-xs text-purple-300/80 italic">
                  이 분석은 무운만의 독자적인 분석이에요. 타고난 사주의 기운과 실제 성격(MBTI)이 어떻게 시너지를 내는지 살펴볼게요.
                </p>

                {/* 개인별 크로스 시너지 */}
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-pink-300">{name1}님</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-200">
                        {hybrid.crossAnalysis.person1.element}({hybrid.crossAnalysis.person1.element === '木' ? '나무' : hybrid.crossAnalysis.person1.element === '火' ? '불' : hybrid.crossAnalysis.person1.element === '土' ? '흙' : hybrid.crossAnalysis.person1.element === '金' ? '쇠' : '물'}) x {mbti1}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">{hybrid.crossAnalysis.person1.synergy}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-r from-red-500/10 to-purple-500/10 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-red-300">{name2}님</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-200">
                        {hybrid.crossAnalysis.person2.element}({hybrid.crossAnalysis.person2.element === '木' ? '나무' : hybrid.crossAnalysis.person2.element === '火' ? '불' : hybrid.crossAnalysis.person2.element === '土' ? '흙' : hybrid.crossAnalysis.person2.element === '金' ? '쇠' : '물'}) x {mbti2}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">{hybrid.crossAnalysis.person2.synergy}</p>
                  </div>
                </div>

                {/* 크로스 케미 해석 */}
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <h4 className="text-sm font-bold text-purple-300 mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> 두 분의 크로스 케미
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {hybrid.crossAnalysis.crossChemistry}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 5. 세부 궁합 점수 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-indigo-400" />
                  </div>
                  📊 세부 궁합 점수
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                  {[
                    { label: '연애 궁합', score: hybrid.detailScores.love, icon: '💕', color: '#ff6b9d', desc: '두 분이 연인으로서 얼마나 잘 맞는지' },
                    { label: '소통 궁합', score: hybrid.detailScores.communication, icon: '💬', color: '#4ecdc4', desc: '대화와 감정 교류가 얼마나 원활한지' },
                    { label: '결혼 궁합', score: hybrid.detailScores.marriage, icon: '💒', color: '#ffd700', desc: '장기적인 동반자로서의 적합도' },
                    { label: '위기 극복력', score: hybrid.detailScores.crisis, icon: '🛡️', color: '#7c83ff', desc: '어려운 상황에서 함께 이겨낼 수 있는 힘' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white font-medium flex items-center gap-1.5">
                          <span>{item.icon}</span> {item.label}
                        </span>
                        <span className="text-sm font-bold" style={{ color: item.color }}>{item.score}점</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1.2, delay: 0.3 + idx * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                      <p className="text-[11px] text-white/50">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 6. 종합 조언 & 추천 활동 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                  </div>
                  💝 두 분에게 드리는 조언
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-4">
                <p className="text-sm text-white/80 leading-relaxed">
                  {hybrid.mbtiResult.loveAdvice}
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  {hybrid.finalAdvice}
                </p>

                {/* 추천 활동 */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    🎯 추천 데이트 & 활동
                  </h4>
                  {hybrid.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-purple-400 text-xs mt-0.5">▸</span>
                      <p className="text-xs text-white/70 leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 7. 운세 카드 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
            <FortuneShareCard
              type="compatibility"
              userName={name1}
              result={saju1}
              result2={saju2}
              name1={name1}
              name2={name2}
              score={hybrid.totalScore}
              loveScore={hybrid.detailScores.love}
              familyScore={hybrid.detailScores.marriage}
            />
          </motion.div>

          {/* 하단 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setResult(null)}
              variant="outline"
              className="flex-1 h-12 border-white/10 text-white hover:bg-white/5 rounded-xl"
            >
              다시 분석하기
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold rounded-xl">
                <HomeIcon className="w-4 h-4 mr-2" />
                홈으로
              </Button>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
