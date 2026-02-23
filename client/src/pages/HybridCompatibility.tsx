'use client';

import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChevronLeft, Heart, User, Calendar, Clock, Sparkles, Users, Brain, Star, Zap, Shield, MessageCircle, Home as HomeIcon, AlertTriangle, ThumbsUp, Lightbulb, ArrowDown, ChevronDown, TrendingUp } from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";
import FortuneShareCard from "@/components/FortuneShareCard";
import { calculateSaju, SajuResult, STEM_ELEMENTS, calculateElementBalance } from "@/lib/saju";
import { convertToSolarDate } from "@/lib/lunar-converter";
import { STEM_PERSONALITY, analyzeElementBalance } from "@/lib/saju-reading";
import { MBTIType, MBTI_TYPES, MBTI_INFO } from "@/lib/mbti-compatibility";
import { analyzeHybridCompatibility, HybridCompatResult } from "@/lib/hybrid-compatibility";
import { trackEvent, trackCustomEvent } from "@/lib/ga4";
import { useState } from "react";

const formSchema = z.object({
  name1: z.string().min(1, "첫 번째 이름을 입력해주세요"),
  gender1: z.enum(["male", "female"]),
  birthDate1: z.string().min(1, "첫 번째 생년월일을 입력해주세요"),
  birthTime1: z.string().min(1, "첫 번째 태어난 시간을 입력해주세요"),
  calendarType1: z.enum(["solar", "lunar"]),
  isLeapMonth1: z.boolean().optional(),
  mbti1: z.string().min(1, "첫 번째 MBTI를 선택해주세요"),
  name2: z.string().min(1, "두 번째 이름을 입력해주세요"),
  gender2: z.enum(["male", "female"]),
  birthDate2: z.string().min(1, "두 번째 생년월일을 입력해주세요"),
  birthTime2: z.string().min(1, "두 번째 태어난 시간을 입력해주세요"),
  calendarType2: z.enum(["solar", "lunar"]),
  isLeapMonth2: z.boolean().optional(),
  mbti2: z.string().min(1, "두 번째 MBTI를 선택해주세요"),
});

type FormValues = z.infer<typeof formSchema>;

function ScoreCircle({ score, label, color }: { score: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center relative"
        style={{ background: `conic-gradient(${color} 0deg ${(score / 100) * 360}deg, rgba(255,255,255,0.1) ${(score / 100) * 360}deg 360deg)` }}
      >
        <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{score}</div>
            <div className="text-[10px] text-muted-foreground">/ 100</div>
          </div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 85) return '#ff6b9d';
  if (score >= 75) return '#ffd700';
  if (score >= 65) return '#4ecdc4';
  return '#ff6b6b';
}

export default function HybridCompatibilityPage() {
  useCanonical();
  const [result, setResult] = useState<HybridCompatResult | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name1: "",
      gender1: "male",
      birthDate1: "2000-01-01",
      birthTime1: "12:00",
      calendarType1: "solar",
      mbti1: "",
      name2: "",
      gender2: "female",
      birthDate2: "2000-01-01",
      birthTime2: "12:00",
      calendarType2: "solar",
      mbti2: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    try {
      // 날짜 파싱
      const [year1, month1, day1] = data.birthDate1.split('-').map(Number);
      const [year2, month2, day2] = data.birthDate2.split('-').map(Number);
      
      const birthDateObj1 = new Date(year1, month1 - 1, day1);
      const birthDateObj2 = new Date(year2, month2 - 1, day2);
      
      const birthDateStrForConverter1 = `${birthDateObj1.getFullYear()}-${String(birthDateObj1.getMonth() + 1).padStart(2, '0')}-${String(birthDateObj1.getDate()).padStart(2, '0')}`;
      const birthDateStrForConverter2 = `${birthDateObj2.getFullYear()}-${String(birthDateObj2.getMonth() + 1).padStart(2, '0')}-${String(birthDateObj2.getDate()).padStart(2, '0')}`;
      
      // 사주 계산
      const date1 = convertToSolarDate(birthDateStrForConverter1, data.birthTime1, data.calendarType1);
      const date2 = convertToSolarDate(birthDateStrForConverter2, data.birthTime2, data.calendarType2);
      const saju1 = calculateSaju(date1, data.gender1);
      const saju2 = calculateSaju(date2, data.gender2);
      
      // 하이브리드 호환성 분석
      const hybrid = analyzeHybridCompatibility(saju1, saju2, data.mbti1 as MBTIType, data.mbti2 as MBTIType, data.name1, data.name2);
      
      setResult(hybrid);
      window.scrollTo(0, 0);
      
      trackCustomEvent("hybrid_compatibility_analyzed", {
        name1: data.name1,
        mbti1: data.mbti1,
        name2: data.name2,
        mbti2: data.mbti2,
        score: hybrid.totalScore,
      });
    } catch (error) {
      console.error("분석 오류:", error);
      alert(`분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  // 결과 화면
  if (result) {
    const { name1, name2, mbti1, mbti2 } = form.getValues();
    const hybrid = result;

    return (
      <>
        <Helmet>
          <title>사주xMBTI 궁합 - 무운</title>
          <meta name="description" content="전통 사주와 MBTI 성격 분석을 결합한 하이브리드 궁합 분석 서비스입니다." />
          <meta property="og:title" content="사주xMBTI 궁합 - 무운" />
          <meta property="og:description" content="전통 사주와 MBTI 성격 분석을 결합한 하이브리드 궁합 분석 서비스입니다." />
        </Helmet>
        <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]" />
          </div>

          <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
            <div className={`${commonMaxWidth} container mx-auto px-4 py-3 md:py-4 flex items-center justify-between`}>
              <button onClick={() => setResult(null)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">뒤로</span>
              </button>
              <h1 className="text-lg md:text-xl font-bold">궁합 결과</h1>
              <div className="w-[60px]" />
            </div>
          </header>

          <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`${commonMaxWidth} space-y-6`}
            >
              {/* 에너지 저울 */}
              <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                  <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>
                    에너지 저울
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="text-center space-y-4">
                    <div className="text-sm text-muted-foreground">{hybrid.energyBalance.description}</div>
                    <div className="flex justify-around items-end">
                      <div className="text-center">
                        <div className="text-xs font-bold text-purple-400 mb-2">{name1}</div>
                        <div className="text-2xl font-bold text-purple-300">{hybrid.energyBalance.person1Role}</div>
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white mb-2">⚖️</div>
                          <div className="text-xs text-muted-foreground">균형도</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-pink-400 mb-2">{name2}</div>
                        <div className="text-2xl font-bold text-pink-300">{hybrid.energyBalance.person2Role}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 시너지 카드 */}
              <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <CardContent className="p-4 md:p-6">
                  <div className="text-center space-y-4">
                    <div className="text-sm text-muted-foreground">{hybrid.synergyCard.description}</div>
                    <div className="text-2xl md:text-3xl font-bold text-white">{hybrid.synergyCard.nickname}</div>
                    <ScoreCircle score={hybrid.totalScore} label="종합 시너지" color={getScoreColor(hybrid.totalScore)} />
                  </div>
                </CardContent>
              </Card>

              {/* 4대 영역 */}
              <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                  <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-blue-400" />
                    </div>
                    4대 영역 분석
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-2">
                    {[
                      { id: 'communication', title: '대화와 소통', data: hybrid.fourAreas.communication },
                      { id: 'conflict', title: '싸움과 화해', data: hybrid.fourAreas.conflict },
                      { id: 'values', title: '현실과 가치관', data: hybrid.fourAreas.values },
                      { id: 'lifestyle', title: '일상의 리듬', data: hybrid.fourAreas.lifestyle },
                    ].map((section) => (
                      <div key={section.id} className="border border-white/10 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <span className="font-semibold text-white">{section.title}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedSection === section.id && (
                          <div className="p-4 border-t border-white/10 bg-white/2 space-y-3">
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-purple-400">점수: {section.data.score}/100</div>
                              <div className="w-full bg-white/10 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                  style={{ width: `${section.data.score}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed">{section.data.analysis}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 인연 타임라인 */}
              <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                  <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                    인연 타임라인
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    {hybrid.timeline.map((point, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="text-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mx-auto mb-2" />
                          <div className="text-xs text-muted-foreground">{point.phase}</div>
                        </div>
                        <div className="flex-1 pb-4 border-l border-white/10 pl-4">
                          <div className="text-sm font-semibold text-white mb-1">{point.score}점</div>
                          <div className="text-xs text-muted-foreground">{point.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 처방전 */}
              <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                  <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                    </div>
                    무운의 한 줄 처방전
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-amber-400">행운의 컬러</div>
                    <div className="text-sm text-white">{hybrid.finalAdvice.luckyColor}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-amber-400">행운의 아이템</div>
                    <div className="text-sm text-white">{hybrid.finalAdvice.luckyItem}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-amber-400">대화 팁</div>
                    <div className="text-sm text-muted-foreground">{hybrid.finalAdvice.communicationTip}</div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={() => setResult(null)}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                다시 분석하기
              </Button>
            </motion.div>
          </main>
        </div>
      </>
    );
  }

  // 입력 화면
  return (
    <>
      <Helmet>
        <title>사주xMBTI 궁합 - 무운</title>
        <meta name="description" content="전통 사주와 MBTI 성격 분석을 결합한 하이브리드 궁합 분석 서비스입니다." />
        <meta property="og:title" content="사주xMBTI 궁합 - 무운" />
        <meta property="og:description" content="전통 사주와 MBTI 성격 분석을 결합한 하이브리드 궁합 분석 서비스입니다." />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className={`${commonMaxWidth} container mx-auto px-4 py-3 md:py-4 flex items-center justify-between`}>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">뒤로</span>
            </Link>
            <h1 className="text-lg md:text-xl font-bold">사주xMBTI 궁합</h1>
            <div className="w-[60px]" />
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-6`}
          >
            <div className="space-y-2">
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
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                  {/* 첫 번째 사람 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-sm md:text-xs font-bold flex items-center justify-center">1</div>
                      <h3 className="text-white font-bold text-base md:text-sm">첫 번째 사람</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name1" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-purple-400" /> 이름
                        </Label>
                        <Input id="name1" placeholder="이름" {...form.register("name1")} className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-purple-500/50 focus:border-purple-500 transition-all text-base md:text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> 성별
                        </Label>
                        <ToggleGroup type="single" value={form.watch("gender1")} onValueChange={(v) => { if (v) form.setValue("gender1", v as "male" | "female"); }} className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1">
                          <ToggleGroupItem value="male" className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">남성</ToggleGroupItem>
                          <ToggleGroupItem value="female" className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">여성</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate1" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" /> 생년월일
                      </Label>
                      <DatePickerInput id="birthDate1" {...form.register("birthDate1")} accentColor="purple" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthTime1" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-purple-400" /> 태어난 시간
                        </Label>
                        <Input id="birthTime1" type="time" {...form.register("birthTime1")} className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-purple-500/50 focus:border-purple-500 transition-all text-base md:text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-purple-400" /> 양력/음력
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("calendarType1")}
                          onValueChange={(value) => {
                            if (value) {
                              form.setValue("calendarType1", value as "solar" | "lunar");
                            }
                          }}
                          className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                        >
                          <ToggleGroupItem value="solar" className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                            양력
                          </ToggleGroupItem>
                          <ToggleGroupItem value="lunar" className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                            음력
                          </ToggleGroupItem>
                        </ToggleGroup>
                        {form.watch("calendarType1") === "lunar" && (
                          <div className="flex items-center justify-end gap-2 pr-1 pt-0.5">
                            <input
                              type="checkbox"
                              id="isLeapMonth1"
                              checked={form.watch("isLeapMonth1") || false}
                              onChange={(e) => form.setValue("isLeapMonth1", e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/50"
                            />
                            <Label htmlFor="isLeapMonth1" className="text-white/60 text-[11px] cursor-pointer">
                              윤달입니다
                            </Label>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-purple-400" /> MBTI
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'].map((mbti) => (
                          <button
                            key={mbti}
                            type="button"
                            onClick={() => form.setValue("mbti1", mbti)}
                            className={`h-9 rounded-lg font-medium text-xs transition-all ${
                              form.watch("mbti1") === mbti
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            {mbti}
                          </button>
                        ))}
                      </div>
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
                      <div className="w-6 h-6 rounded-full bg-pink-500 text-white text-sm md:text-xs font-bold flex items-center justify-center">2</div>
                      <h3 className="text-white font-bold text-base md:text-sm">두 번째 사람</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name2" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-pink-400" /> 이름
                        </Label>
                        <Input id="name2" placeholder="이름" {...form.register("name2")} className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-pink-500/50 focus:border-pink-500 transition-all text-base md:text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-pink-400" /> 성별
                        </Label>
                        <ToggleGroup type="single" value={form.watch("gender2")} onValueChange={(v) => { if (v) form.setValue("gender2", v as "male" | "female"); }} className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1">
                          <ToggleGroupItem value="male" className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">남성</ToggleGroupItem>
                          <ToggleGroupItem value="female" className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">여성</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate2" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" /> 생년월일
                      </Label>
                      <DatePickerInput id="birthDate2" {...form.register("birthDate2")} accentColor="pink" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthTime2" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-pink-400" /> 태어난 시간
                        </Label>
                        <Input id="birthTime2" type="time" {...form.register("birthTime2")} className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-pink-500/50 focus:border-pink-500 transition-all text-base md:text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-pink-400" /> 양력/음력
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("calendarType2")}
                          onValueChange={(value) => {
                            if (value) {
                              form.setValue("calendarType2", value as "solar" | "lunar");
                            }
                          }}
                          className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                        >
                          <ToggleGroupItem value="solar" className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                            양력
                          </ToggleGroupItem>
                          <ToggleGroupItem value="lunar" className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                            음력
                          </ToggleGroupItem>
                        </ToggleGroup>
                        {form.watch("calendarType2") === "lunar" && (
                          <div className="flex items-center justify-end gap-2 pr-1 pt-0.5">
                            <input
                              type="checkbox"
                              id="isLeapMonth2"
                              checked={form.watch("isLeapMonth2") || false}
                              onChange={(e) => form.setValue("isLeapMonth2", e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-pink-500 focus:ring-pink-500/50"
                            />
                            <Label htmlFor="isLeapMonth2" className="text-white/60 text-[11px] cursor-pointer">
                              윤달입니다
                            </Label>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-pink-400" /> MBTI
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'].map((mbti) => (
                          <button
                            key={mbti}
                            type="button"
                            onClick={() => form.setValue("mbti2", mbti)}
                            className={`h-9 rounded-lg font-medium text-xs transition-all ${
                              form.watch("mbti2") === mbti
                                ? 'bg-pink-500 text-white'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            {mbti}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
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
