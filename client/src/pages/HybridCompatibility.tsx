'use client';

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
import { ChevronLeft, Heart, User, Calendar, Clock, Sparkles, Users, Brain, Star, Zap, Shield, MessageCircle, Home as HomeIcon, AlertTriangle, ThumbsUp, Lightbulb, ArrowDown, ChevronDown } from "lucide-react";
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
  if (score >= 50) return '#87ceeb';
  return '#ff6b6b';
}

function ScoreCircle({ score, size = 120, label = "", color = "" }: { score: number; size?: number; label?: string; color?: string }) {
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
                className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  value === type
                    ? accentColor === "purple"
                      ? "bg-purple-500 text-white"
                      : "bg-pink-500 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
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

const commonMaxWidth = "max-w-2xl mx-auto";

export default function HybridCompatibility() {
  useCanonical();
  const [result, setResult] = useState<HybridCompatResult | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender1: "male",
      gender2: "female",
      calendarType1: "solar",
      calendarType2: "solar",
      birthTimeUnknown1: true,
      birthTimeUnknown2: true,
      mbti1: "ENFP",
      mbti2: "INFJ",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    console.log("폼 제출 시작:", data);
    
    try {
      // YYYY-MM-DD 형식의 문자열을 파싱
      const parseDate = (dateStr: string) => {
        const parts = dateStr.split('-');
        return {
          year: parseInt(parts[0], 10),
          month: parseInt(parts[1], 10),
          day: parseInt(parts[2], 10)
        };
      };

      let dateObj1 = parseDate(data.birthDate1);
      if (data.calendarType1 === "lunar") {
        const solarDate = convertToSolarDate(
          dateObj1.year,
          dateObj1.month,
          dateObj1.day,
          data.isLeapMonth1 || false
        );
        dateObj1 = { year: solarDate.year, month: solarDate.month, day: solarDate.day };
      }
      const date1 = new Date(dateObj1.year, dateObj1.month - 1, dateObj1.day);

      let dateObj2 = parseDate(data.birthDate2);
      if (data.calendarType2 === "lunar") {
        const solarDate = convertToSolarDate(
          dateObj2.year,
          dateObj2.month,
          dateObj2.day,
          data.isLeapMonth2 || false
        );
        dateObj2 = { year: solarDate.year, month: solarDate.month, day: solarDate.day };
      }
      const date2 = new Date(dateObj2.year, dateObj2.month - 1, dateObj2.day);

      console.log("날짜 변환 완료:", date1, date2);

      const saju1 = calculateSaju(
        date1,
        data.birthTimeUnknown1 ? "12:00" : data.birthTime1,
        data.gender1 === "male"
      );
      const saju2 = calculateSaju(
        date2,
        data.birthTimeUnknown2 ? "12:00" : data.birthTime2,
        data.gender2 === "male"
      );

      console.log("사주 계산 완료:", saju1, saju2);

      const hybrid = analyzeHybridCompatibility(
        saju1, saju2,
        data.mbti1 as MBTIType, data.mbti2 as MBTIType,
        data.name1, data.name2
      );

      console.log("하이브리드 분석 완료:", hybrid);

      setResult(hybrid);
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

  if (result) {
    const { name1, name2, mbti1, mbti2 } = form.getValues();
    const hybrid = result;

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
            <div className={`${commonMaxWidth} container mx-auto px-4 py-3 md:py-4 flex items-center justify-between`}>
              <Link href="/hybrid-compatibility" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">뒤로</span>
              </Link>
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
                  <Accordion type="single" collapsible className="space-y-2">
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
                  </Accordion>
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
                    {hybrid.timeline.phases.map((phase, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                            {idx + 1}
                          </div>
                          {idx < hybrid.timeline.phases.length - 1 && <div className="w-0.5 h-12 bg-white/10 mt-2" />}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="font-semibold text-white text-sm">{phase.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{phase.description}</div>
                          <div className="text-xs text-purple-400 font-semibold mt-2">점수: {phase.score}/100</div>
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
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-purple-400">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-bold">첫 번째 분</span>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-white text-xs">이름</Label>
                          <Input id="name1" {...form.register("name1")} placeholder="이름을 입력하세요" className={`bg-white/5 border-white/10 text-white h-11 rounded-xl ${form.formState.errors.name1 ? "border-red-500/50" : ""}`} />
                          {form.formState.errors.name1 && <p className="text-[10px] text-red-400 ml-1 font-medium">{form.formState.errors.name1.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-white text-xs">성별</Label>
                          <ToggleGroup type="single" value={form.watch("gender1")} onValueChange={(v) => form.setValue("gender1", v as "male" | "female")} className="justify-start gap-2">
                            <ToggleGroupItem value="male" className="data-[state=on]:bg-purple-500 data-[state=on]:text-white h-11 rounded-xl">남성</ToggleGroupItem>
                            <ToggleGroupItem value="female" className="data-[state=on]:bg-purple-500 data-[state=on]:text-white h-11 rounded-xl">여성</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-white text-xs">생년월일</Label>
                          <DatePickerInput 
                            id="birthDate1"
                            value={form.watch("birthDate1")} 
                            onChange={(v) => {
                              if (v && v.target && v.target.value) {
                                form.setValue("birthDate1", v.target.value);
                              }
                            }}
                            accentColor="purple" 
                          />
                          {form.formState.errors.birthDate1 && <p className="text-[10px] text-red-400 ml-1 font-medium">{form.formState.errors.birthDate1.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-white text-xs">날짜 구분</Label>
                          <ToggleGroup type="single" value={form.watch("calendarType1")} onValueChange={(v) => form.setValue("calendarType1", v as "solar" | "lunar")} className="justify-start gap-2">
                            <ToggleGroupItem value="solar" className="data-[state=on]:bg-purple-500 data-[state=on]:text-white h-11 rounded-xl text-xs">양력</ToggleGroupItem>
                            <ToggleGroupItem value="lunar" className="data-[state=on]:bg-purple-500 data-[state=on]:text-white h-11 rounded-xl text-xs">음력</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-xs">MBTI</Label>
                        <MBTISelector value={form.watch("mbti1")} onChange={(v) => form.setValue("mbti1", v)} accentColor="purple" />
                        {form.formState.errors.mbti1 && <p className="text-[10px] text-red-400 ml-1 font-medium">{form.formState.errors.mbti1.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* 두 번째 사람 */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-pink-400">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-bold">두 번째 분</span>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-white text-xs">이름</Label>
                          <Input id="name2" {...form.register("name2")} placeholder="이름을 입력하세요" className={`bg-white/5 border-white/10 text-white h-11 rounded-xl ${form.formState.errors.name2 ? "border-red-500/50" : ""}`} />
                          {form.formState.errors.name2 && <p className="text-[10px] text-red-400 ml-1 font-medium">{form.formState.errors.name2.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-white text-xs">성별</Label>
                          <ToggleGroup type="single" value={form.watch("gender2")} onValueChange={(v) => form.setValue("gender2", v as "male" | "female")} className="justify-start gap-2">
                            <ToggleGroupItem value="male" className="data-[state=on]:bg-pink-500 data-[state=on]:text-white h-11 rounded-xl">남성</ToggleGroupItem>
                            <ToggleGroupItem value="female" className="data-[state=on]:bg-pink-500 data-[state=on]:text-white h-11 rounded-xl">여성</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-white text-xs">생년월일</Label>
                          <DatePickerInput 
                            id="birthDate2"
                            value={form.watch("birthDate2")} 
                            onChange={(v) => {
                              if (v && v.target && v.target.value) {
                                form.setValue("birthDate2", v.target.value);
                              }
                            }}
                            accentColor="pink" 
                          />
                          {form.formState.errors.birthDate2 && <p className="text-[10px] text-red-400 ml-1 font-medium">{form.formState.errors.birthDate2.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-white text-xs">날짜 구분</Label>
                          <ToggleGroup type="single" value={form.watch("calendarType2")} onValueChange={(v) => form.setValue("calendarType2", v as "solar" | "lunar")} className="justify-start gap-2">
                            <ToggleGroupItem value="solar" className="data-[state=on]:bg-pink-500 data-[state=on]:text-white h-11 rounded-xl text-xs">양력</ToggleGroupItem>
                            <ToggleGroupItem value="lunar" className="data-[state=on]:bg-pink-500 data-[state=on]:text-white h-11 rounded-xl text-xs">음력</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-xs">MBTI</Label>
                        <MBTISelector value={form.watch("mbti2")} onChange={(v) => form.setValue("mbti2", v)} accentColor="pink" />
                        {form.formState.errors.mbti2 && <p className="text-[10px] text-red-400 ml-1 font-medium">{form.formState.errors.mbti2.message}</p>}
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                  >
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
