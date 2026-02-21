import { useState, useEffect, useRef } from "react";
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
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
import { convertToSolarDate } from "@/lib/lunar-converter";
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
  isLeapMonth1: z.boolean().optional(),
  mbti1: z.string().min(1, "MBTI를 선택해주세요"),
  name2: z.string().min(1, "이름을 입력해주세요"),
  gender2: z.enum(["male", "female"]),
  birthDate2: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime2: z.string(),
  birthTimeUnknown2: z.boolean(),
  calendarType2: z.enum(["solar", "lunar"]),
  isLeapMonth2: z.boolean().optional(),
  mbti2: z.string().min(1, "MBTI를 선택해주세요"),
});

type FormValues = z.infer<typeof formSchema>;

function getScoreColor(score: number): string {
  if (score >= 85) return '#ff6b9d';
  if (score >= 75) return '#ffd700';
  if (score >= 65) return '#4ecdc4';
  if (score >= 55) return '#7c83ff';
  return '#ff8c42';
}

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

function MBTISelector({ value, onChange, accentColor = "purple" }: { value: string; onChange: (v: string) => void; accentColor?: string }) {
  const groups = [
    { label: '분석가형', types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'] },
    { label: '외교관형', types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'] },
    { label: '관리자형', types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'] },
    { label: '탐험가형', types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'] },
  ];

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
  useCanonical('/hybrid-compatibility');

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

  const onSubmit = (data: FormValues) => {
    try {
      const time1 = data.birthTimeUnknown1 ? "12:00" : data.birthTime1;
      const time2 = data.birthTimeUnknown2 ? "12:00" : data.birthTime2;
      const date1 = convertToSolarDate(data.birthDate1, time1, data.calendarType1);
      const date2 = convertToSolarDate(data.birthDate2, time2, data.calendarType2);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try { trackEvent('hybrid_compat_result', 'engagement', 'hybrid_calculated'); } catch {}
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("분석 중 오류가 발생했습니다. 입력 정보를 다시 확인해주세요.");
    }
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  if (!result) {
    return (
      <>
        <Helmet>
          <title>사주xMBTI 궁합 - 무운</title>
          <meta name="description" content="전통 사주와 MBTI 성격 분석을 결합한 하이브리드 궁합 분석 서비스입니다. 회원가입 없이 무료로 두 분의 성격과 사주 궁합을 확인하세요." />
          <meta property="og:title" content="사주xMBTI 궁합 - 무운" />
          <meta property="og:description" content="전통 사주와 MBTI 성격 분석을 결합한 하이브리드 궁합 분석 서비스입니다." />
        </Helmet>
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
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-purple-400">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-bold">첫 번째 분</span>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-white text-xs">이름</Label>
                            <Input {...form.register("name1")} placeholder="이름을 입력하세요" className={`bg-white/5 border-white/10 text-white h-11 rounded-xl ${form.formState.errors.name1 ? "border-red-500/50" : ""}`} />
                            {form.formState.errors.name1 && <p className="text-[10px] text-red-400 ml-1">{form.formState.errors.name1.message}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-white text-xs">성별</Label>
                            <ToggleGroup type="single" value={form.watch("gender1")} onValueChange={(v) => v && form.setValue("gender1", v as any)} className="bg-white/5 p-1 rounded-xl border border-white/10 h-11">
                              <ToggleGroupItem value="male" className="flex-1 rounded-lg data-[state=on]:bg-purple-500 text-white text-xs">남성</ToggleGroupItem>
                              <ToggleGroupItem value="female" className="flex-1 rounded-lg data-[state=on]:bg-purple-500 text-white text-xs">여성</ToggleGroupItem>
                            </ToggleGroup>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-white text-xs">생년월일</Label>
                            <DatePickerInput 
                              value={form.watch("birthDate1")} 
                              onChange={(v) => form.setValue("birthDate1", v)} 
                              accentColor="purple" 
                            />
                            {form.formState.errors.birthDate1 && <p className="text-[10px] text-red-400 ml-1">{form.formState.errors.birthDate1.message}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-white text-xs">MBTI</Label>
                            <MBTISelector value={form.watch("mbti1")} onChange={(v) => form.setValue("mbti1", v)} accentColor="purple" />
                            {form.formState.errors.mbti1 && <p className="text-[10px] text-red-400 ml-1">{form.formState.errors.mbti1.message}</p>}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-white/5 my-4" />

                    {/* 두 번째 사람 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-pink-400">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-bold">두 번째 분</span>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-white text-xs">이름</Label>
                            <Input {...form.register("name2")} placeholder="이름을 입력하세요" className={`bg-white/5 border-white/10 text-white h-11 rounded-xl ${form.formState.errors.name2 ? "border-red-500/50" : ""}`} />
                            {form.formState.errors.name2 && <p className="text-[10px] text-red-400 ml-1">{form.formState.errors.name2.message}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-white text-xs">성별</Label>
                            <ToggleGroup type="single" value={form.watch("gender2")} onValueChange={(v) => v && form.setValue("gender2", v as any)} className="bg-white/5 p-1 rounded-xl border border-white/10 h-11">
                              <ToggleGroupItem value="male" className="flex-1 rounded-lg data-[state=on]:bg-pink-500 text-white text-xs">남성</ToggleGroupItem>
                              <ToggleGroupItem value="female" className="flex-1 rounded-lg data-[state=on]:bg-pink-500 text-white text-xs">여성</ToggleGroupItem>
                            </ToggleGroup>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-white text-xs">생년월일</Label>
                            <DatePickerInput 
                              value={form.watch("birthDate2")} 
                              onChange={(v) => form.setValue("birthDate2", v)} 
                              accentColor="pink" 
                            />
                            {form.formState.errors.birthDate2 && <p className="text-[10px] text-red-400 ml-1">{form.formState.errors.birthDate2.message}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-white text-xs">MBTI</Label>
                            <MBTISelector value={form.watch("mbti2")} onChange={(v) => form.setValue("mbti2", v)} accentColor="pink" />
                            {form.formState.errors.mbti2 && <p className="text-[10px] text-red-400 ml-1">{form.formState.errors.mbti2.message}</p>}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl mt-4">
                      <Sparkles className="w-4 h-4 mr-2" />
                      궁합 분석하기
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </>
    );
  }

  const { saju1, saju2, hybrid, name1, name2, mbti1, mbti2 } = result;
  const mbtiInfo1 = MBTI_INFO[mbti1];
  const mbtiInfo2 = MBTI_INFO[mbti2];

  return (
    <>
      <Helmet>
        <title>사주xMBTI 궁합 결과 - 무운</title>
        <meta name="description" content="전통 사주와 MBTI 성격 분석을 결합한 하이브리드 궁합 분석 결과입니다. 두 분의 케미와 상세 궁합 점수를 확인하세요." />
        <meta property="og:title" content="사주xMBTI 궁합 결과 - 무운" />
        <meta property="og:description" content="전통 사주와 MBTI 성격 분석을 결합한 하이브리드 궁합 분석 결과입니다." />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setResult(null)} className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-base md:text-lg font-bold text-white">궁합 결과</h1>
            </div>
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
          <div className={`${commonMaxWidth} space-y-6`}>
            {/* 결과 헤더 */}
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">두 분의 궁합 결과</h2>
              <div className="flex justify-center gap-8 md:gap-16 py-4">
                <ScoreCircle score={hybrid.totalScore} label="종합 궁합" size={140} />
              </div>
            </div>

            {/* 사주 궁합 분석 */}
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <Star className="w-4 h-4 text-yellow-400" /> 사주 궁합 분석
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <p className="text-sm text-white/80 leading-relaxed">{hybrid.sajuResult.summary}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-xs font-bold text-purple-300">첫 번째 분 기운</span>
                    <p className="text-xs text-white/70 mt-1">{hybrid.sajuResult.person1Energy}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-xs font-bold text-pink-300">두 번째 분 기운</span>
                    <p className="text-xs text-white/70 mt-1">{hybrid.sajuResult.person2Energy}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MBTI 궁합 분석 */}
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <Brain className="w-4 h-4 text-purple-400" /> MBTI 성격 궁합
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold">{mbti1}</span>
                  <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-bold">{mbti2}</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{hybrid.mbtiResult.summary}</p>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-xs font-bold text-green-400">케미 포인트</span>
                    <ul className="mt-1 space-y-1">
                      {hybrid.mbtiResult.chemistryPoints.map((p, i) => <li key={i} className="text-xs text-white/70">· {p}</li>)}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 크로스 분석 */}
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <Zap className="w-4 h-4 text-pink-400" /> 사주 x MBTI 크로스 분석
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                  <span className="text-sm font-bold text-pink-300">첫 번째 분 시너지</span>
                  <p className="text-xs text-white/70 mt-1">{hybrid.crossAnalysis.person1.synergy}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-red-500/10 to-purple-500/10 border border-red-500/20">
                  <span className="text-sm font-bold text-red-300">두 번째 분 시너지</span>
                  <p className="text-xs text-white/70 mt-1">{hybrid.crossAnalysis.person2.synergy}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-sm font-bold text-purple-300">종합 크로스 케미</span>
                  <p className="text-sm text-white/80 mt-1">{hybrid.crossAnalysis.crossChemistry}</p>
                </div>
              </CardContent>
            </Card>

            {/* 최종 조언 */}
            <Card className="bg-amber-500/5 border-amber-500/20 rounded-2xl overflow-hidden">
              <CardContent className="p-6 text-center">
                <Lightbulb className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <p className="text-sm text-white/90 leading-relaxed whitespace-pre-line">{hybrid.finalAdvice}</p>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button onClick={() => setResult(null)} variant="outline" className="flex-1 h-12 border-white/10 text-white hover:bg-white/5 rounded-xl">다시 분석하기</Button>
              <Link href="/" className="flex-1"><Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl">홈으로</Button></Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
