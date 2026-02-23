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
      let date1 = new Date(data.birthDate1);
      if (data.calendarType1 === "lunar") {
        const solarDate = convertToSolarDate(
          date1.getFullYear(),
          date1.getMonth() + 1,
          date1.getDate(),
          data.isLeapMonth1 || false
        );
        date1 = new Date(solarDate.year, solarDate.month - 1, solarDate.day);
      }

      let date2 = new Date(data.birthDate2);
      if (data.calendarType2 === "lunar") {
        const solarDate = convertToSolarDate(
          date2.getFullYear(),
          date2.getMonth() + 1,
          date2.getDate(),
          data.isLeapMonth2 || false
        );
        date2 = new Date(solarDate.year, solarDate.month - 1, solarDate.day);
      }

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
            <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
              <button onClick={() => setResult(null)} className="mr-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </button>
              <h1 className="text-base md:text-lg font-bold text-white">사주xMBTI 궁합 결과</h1>
            </div>
          </header>

          <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`${commonMaxWidth} space-y-6`}
            >
              {/* ① 에너지 저울 (Dynamic Scale) */}
              <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-4 py-3">
                  <CardTitle className="text-white flex items-center gap-2 text-base">
                    <Zap className="w-4 h-4 text-yellow-400" /> 인연의 에너지 저울
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-center flex-1">
                      <div className="text-sm font-bold text-white mb-2">{name1}</div>
                      <div className="text-2xl font-bold text-purple-400">{hybrid.energyScale.person1Energy}</div>
                      <div className="text-xs text-white/60 mt-1">에너지 지수</div>
                    </div>
                    
                    {/* 저울 시각화 */}
                    <div className="flex-1 flex justify-center">
                      <svg width="120" height="80" viewBox="0 0 120 80" className="drop-shadow-lg">
                        {/* 저울대 */}
                        <line x1="60" y1="10" x2="60" y2="25" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                        {/* 왼쪽 팔 */}
                        <line 
                          x1="60" y1="25" 
                          x2={20 + (hybrid.energyScale.balanceScore * 0.5)} 
                          y2={25 + (Math.abs(hybrid.energyScale.balanceScore) * 0.3)} 
                          stroke="rgba(168, 85, 247, 0.5)" 
                          strokeWidth="3" 
                        />
                        {/* 오른쪽 팔 */}
                        <line 
                          x1="60" y1="25" 
                          x2={100 - (hybrid.energyScale.balanceScore * 0.5)} 
                          y2={25 + (Math.abs(hybrid.energyScale.balanceScore) * 0.3)} 
                          stroke="rgba(236, 72, 153, 0.5)" 
                          strokeWidth="3" 
                        />
                        {/* 왼쪽 추 */}
                        <circle cx={20 + (hybrid.energyScale.balanceScore * 0.5)} cy={25 + (Math.abs(hybrid.energyScale.balanceScore) * 0.3)} r="6" fill="rgba(168, 85, 247, 0.8)" />
                        {/* 오른쪽 추 */}
                        <circle cx={100 - (hybrid.energyScale.balanceScore * 0.5)} cy={25 + (Math.abs(hybrid.energyScale.balanceScore) * 0.3)} r="6" fill="rgba(236, 72, 153, 0.8)" />
                        {/* 텍스트 */}
                        <text x="20" y="70" textAnchor="middle" fill="rgba(168, 85, 247, 0.8)" fontSize="11" fontWeight="bold">
                          {hybrid.energyScale.charger === name1 ? '충전기' : '소비자'}
                        </text>
                        <text x="100" y="70" textAnchor="middle" fill="rgba(236, 72, 153, 0.8)" fontSize="11" fontWeight="bold">
                          {hybrid.energyScale.charger === name2 ? '충전기' : '소비자'}
                        </text>
                      </svg>
                    </div>

                    <div className="text-center flex-1">
                      <div className="text-sm font-bold text-white mb-2">{name2}</div>
                      <div className="text-2xl font-bold text-pink-400">{hybrid.energyScale.person2Energy}</div>
                      <div className="text-xs text-white/60 mt-1">에너지 지수</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-sm text-white/80">{hybrid.energyScale.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* ② 하이브리드 시너지 카드 */}
              <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs font-bold text-white/90">시너지 카드</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-white/70">{hybrid.synergyCard.nickname1}</div>
                      <div className="text-xs text-white/50">×</div>
                      <div className="text-sm text-white/70">{hybrid.synergyCard.nickname2}</div>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        {hybrid.synergyCard.combinedNickname}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-2 pt-2">
                    {hybrid.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-1 rounded-full bg-white/10 text-xs text-white/80 border border-white/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 종합 점수 */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="glass-panel border-white/5 rounded-2xl overflow-hidden">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <ScoreCircle score={hybrid.totalScore} label="종합 궁합" size={100} />
                    <div className="text-center mt-3">
                      <p className="text-sm font-bold text-white">{hybrid.totalGrade}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-panel border-white/5 rounded-2xl overflow-hidden">
                  <CardContent className="p-4 space-y-2">
                    <div className="text-xs text-white/60">사주 궁합</div>
                    <ScoreCircle score={hybrid.sajuScore} label="" size={80} />
                    <div className="text-xs text-white/60">MBTI 궁합</div>
                    <ScoreCircle score={hybrid.mbtiResult.score} label="" size={80} />
                  </CardContent>
                </Card>
              </div>

              {/* ③ 4대 영역 하이브리드 리포트 (Accordion) */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" /> 4대 영역 분석
                </h3>
                
                {Object.entries(hybrid.fourDimensions).map(([key, section]) => (
                  <Card 
                    key={key} 
                    className={`glass-panel border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all ${
                      expandedSection === key ? 'ring-2 ring-purple-500/50' : ''
                    }`}
                    onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                  >
                    <CardHeader className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                          {key === 'communication' && <MessageCircle className="w-4 h-4 text-blue-400" />}
                          {key === 'conflictResolution' && <Shield className="w-4 h-4 text-red-400" />}
                          {key === 'valuesAndReality' && <Lightbulb className="w-4 h-4 text-yellow-400" />}
                          {key === 'dailyRhythm' && <Clock className="w-4 h-4 text-green-400" />}
                          {section.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white/60">{section.score}점</span>
                          <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${expandedSection === key ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </CardHeader>
                    {expandedSection === key && (
                      <CardContent className="px-4 py-3 border-t border-white/5 space-y-3">
                        <p className="text-sm text-white/80">{section.summary}</p>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <p className="text-xs text-white/70">{section.advice}</p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>

              {/* ④ 인연 타임라인 */}
              <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-4 py-3">
                  <CardTitle className="text-white flex items-center gap-2 text-base">
                    <Heart className="w-4 h-4 text-red-400" /> 인연 타임라인
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">썸</span>
                      <div className="flex-1 mx-3 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${hybrid.timeline.썸}%` }} />
                      </div>
                      <span className="text-sm font-bold text-white">{hybrid.timeline.썸}점</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">연애</span>
                      <div className="flex-1 mx-3 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${hybrid.timeline.연애}%` }} />
                      </div>
                      <span className="text-sm font-bold text-white">{hybrid.timeline.연애}점</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">장기안정기</span>
                      <div className="flex-1 mx-3 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${hybrid.timeline.장기안정기}%` }} />
                      </div>
                      <span className="text-sm font-bold text-white">{hybrid.timeline.장기안정기}점</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-sm text-white/80">{hybrid.timeline.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* ⑤ 무운의 한 줄 처방전 */}
              <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-4 py-3">
                  <CardTitle className="text-white flex items-center gap-2 text-base">
                    <Sparkles className="w-4 h-4 text-yellow-400" /> 무운의 한 줄 처방전
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <p className="text-xs text-white/60 mb-1">행운의 컬러/아이템</p>
                      <p className="text-sm text-white">{hybrid.prescription.luckyColor}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                      <p className="text-xs text-white/60 mb-1">행운의 아이템</p>
                      <p className="text-sm text-white">{hybrid.prescription.luckyItem}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <p className="text-xs text-white/60 mb-1">상대방 대하는 팁</p>
                      <p className="text-sm text-white">{hybrid.prescription.tipForPartner}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
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
                          <Input {...form.register("name1")} placeholder="이름을 입력하세요" className={`bg-white/5 border-white/10 text-white h-11 rounded-xl ${form.formState.errors.name1 ? "border-red-500/50" : ""}`} />
                          {form.formState.errors.name1 && <p className="text-[10px] text-red-400 ml-1 font-medium">{form.formState.errors.name1.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-white text-xs">성별</Label>
                          <ToggleGroup type="single" value={form.watch("gender1")} onValueChange={(v) => v && form.setValue("gender1", v as any)} className="bg-white/5 p-1 rounded-xl border border-white/10 h-11 w-full">
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
                          <div className="flex gap-2">
                            <ToggleGroup type="single" value={form.watch("calendarType1")} onValueChange={(v) => v && form.setValue("calendarType1", v as any)} className="flex-1 h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1">
                              <ToggleGroupItem value="solar" className="h-full rounded-lg data-[state=on]:bg-purple-500 text-white text-xs">양력</ToggleGroupItem>
                              <ToggleGroupItem value="lunar" className="h-full rounded-lg data-[state=on]:bg-purple-500 text-white text-xs">음력</ToggleGroupItem>
                            </ToggleGroup>
                            {form.watch("calendarType1") === "lunar" && (
                              <div className="flex items-center px-2 bg-white/5 rounded-xl border border-white/10">
                                <label className="flex items-center gap-1.5 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={form.watch("isLeapMonth1")}
                                    onChange={(e) => form.setValue("isLeapMonth1", e.target.checked)}
                                    className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-purple-500"
                                  />
                                  <span className="text-[11px] text-white/80 group-hover:text-purple-400 transition-colors">윤달</span>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-xs">MBTI</Label>
                        <MBTISelector value={form.watch("mbti1")} onChange={(v) => form.setValue("mbti1", v)} accentColor="purple" />
                        {form.formState.errors.mbti1 && <p className="text-[10px] text-red-400 ml-1 font-medium">{form.formState.errors.mbti1.message}</p>}
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
                          {form.formState.errors.name2 && <p className="text-[10px] text-red-400 ml-1 font-medium">{form.formState.errors.name2.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-white text-xs">성별</Label>
                          <ToggleGroup type="single" value={form.watch("gender2")} onValueChange={(v) => v && form.setValue("gender2", v as any)} className="bg-white/5 p-1 rounded-xl border border-white/10 h-11 w-full">
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
                          <div className="flex gap-2">
                            <ToggleGroup type="single" value={form.watch("calendarType2")} onValueChange={(v) => v && form.setValue("calendarType2", v as any)} className="flex-1 h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1">
                              <ToggleGroupItem value="solar" className="h-full rounded-lg data-[state=on]:bg-pink-500 text-white text-xs">양력</ToggleGroupItem>
                              <ToggleGroupItem value="lunar" className="h-full rounded-lg data-[state=on]:bg-pink-500 text-white text-xs">음력</ToggleGroupItem>
                            </ToggleGroup>
                            {form.watch("calendarType2") === "lunar" && (
                              <div className="flex items-center px-2 bg-white/5 rounded-xl border border-white/10">
                                <label className="flex items-center gap-1.5 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={form.watch("isLeapMonth2")}
                                    onChange={(e) => form.setValue("isLeapMonth2", e.target.checked)}
                                    className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-pink-500"
                                  />
                                  <span className="text-[11px] text-white/80 group-hover:text-pink-400 transition-colors">윤달</span>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-xs">MBTI</Label>
                        <MBTISelector value={form.watch("mbti2")} onChange={(v) => form.setValue("mbti2", v)} accentColor="pink" />
                        {form.formState.errors.mbti2 && <p className="text-[10px] text-red-400 ml-1 font-medium">{form.formState.errors.mbti2.message}</p>}
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('버튼 클릭됨');
                      form.handleSubmit(handleSubmit)();
                    }}
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
