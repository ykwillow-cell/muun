import { useState, useEffect, useRef } from "react";
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Users, Plus, Trash2, Share2, Sparkles, Heart,
  User, Calendar, Clock, Star, Shield, TrendingUp, ArrowRight,
  ChevronDown, ChevronUp, Home as HomeIcon
} from "lucide-react";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";
import { cleanAIContent } from "@/lib/content-cleaner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateSaju, SajuResult, calculateElementBalance, STEM_ELEMENTS } from "@/lib/saju";
import { convertToSolarDate } from "@/lib/lunar-converter";
import SajuChart from "@/components/SajuChart";
import FortuneShareCard from "@/components/FortuneShareCard";
import DatePickerInput from "@/components/DatePickerInput";
import { trackEvent } from "@/lib/ga4";
import {
  STEM_READINGS,
  ELEMENT_KOREAN,
  withReading,
  STEM_PERSONALITY,
  analyzeElementBalance,
} from "@/lib/saju-reading";
import {
  FamilyMember,
  FamilyRole,
  analyzeFamilyElementBalance,
  generateRelationInterpretation,
  generateFamilySummary,
} from "@/lib/family-saju";

const ROLE_OPTIONS: { value: FamilyRole; label: string; icon: string }[] = [
  { value: "나", label: "나", icon: "🙋" },
  { value: "아버지", label: "아버지", icon: "👨" },
  { value: "어머니", label: "어머니", icon: "👩" },
  { value: "아들", label: "아들", icon: "👦" },
  { value: "딸", label: "딸", icon: "👧" },
  { value: "할아버지", label: "할아버지", icon: "👴" },
  { value: "할머니", label: "할머니", icon: "👵" },
  { value: "배우자", label: "배우자", icon: "💑" },
  { value: "기타", label: "기타", icon: "👤" },
];

const DEFAULT_MEMBER: () => FamilyMember = () => ({
  name: "",
  role: "나" as FamilyRole,
  gender: "male" as const,
  birthDate: "",
  birthTime: "12:00",
  birthTimeUnknown: false,
  calendarType: "solar" as const,
  isLeapMonth: false,
});

export default function FamilySaju() {
  useCanonical('/family-saju');

  const [members, setMembers] = useState<FamilyMember[]>([DEFAULT_MEMBER(), { ...DEFAULT_MEMBER(), role: "아버지" as FamilyRole }]);
  const [result, setResult] = useState<FamilyMember[] | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    if (result) {
      window.scrollTo(0, 0);
    }
  }, [result]);
  const [errors, setErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    trackEvent("page_view", "family_saju", "가족사주 페이지 방문");
    // localStorage에서 사용자 정보 불러와 첫 번째 구성원(나)에 자동 입력
    try {
      const savedData = localStorage.getItem("muun_user_data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.name && parsed.birthDate) {
          setMembers(prev => {
            const updated = [...prev];
              updated[0] = {
                ...updated[0],
                name: parsed.name || "",
                gender: parsed.gender || "male",
                birthDate: parsed.birthDate || "",
                birthTime: parsed.birthTime || "12:00",
                birthTimeUnknown: parsed.birthTimeUnknown || false,
                calendarType: parsed.calendarType || "solar",
                isLeapMonth: parsed.isLeapMonth || false,
              };
            return updated;
          });
        }
      }
    } catch (e) {
      console.error("사용자 정보 불러오기 실패:", e);
    }
  }, []);

  const addMember = () => {
    if (members.length >= 6) return;
    setMembers([...members, DEFAULT_MEMBER()]);
  };

  const removeMember = (index: number) => {
    if (members.length <= 2) return;
    setMembers(members.filter((_, i) => i !== index));
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const updateMember = (index: number, field: keyof FamilyMember, value: string) => {
    const updated = [...members];
    (updated[index] as any)[field] = value;
    // 역할에 따라 성별 자동 설정
    if (field === "role") {
      if (value === "아버지" || value === "할아버지" || value === "아들") {
        updated[index].gender = "male";
      } else if (value === "어머니" || value === "할머니" || value === "딸") {
        updated[index].gender = "female";
      }
    }
    setMembers(updated);
  };

  const validate = (): boolean => {
    const newErrors: Record<number, string> = {};
    members.forEach((m, i) => {
      if (!m.name.trim()) newErrors[i] = "이름을 입력해주세요";
      else if (!m.birthDate) newErrors[i] = "생년월일을 입력해주세요";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    trackEvent("family_saju_submit", "family_saju", `가족 ${members.length}명 분석`);

    const resultData = members.map(member => {
      const time = member.birthTimeUnknown ? "12:00" : member.birthTime;
      const date = convertToSolarDate(member.birthDate, time, member.calendarType, member.isLeapMonth);
      const saju = calculateSaju(date, member.gender);
      return { ...member, saju };
    });

    setResult(resultData);

  };

  // ===== 입력 화면 =====
  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        {/* 헤더 */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              가족사주 분석
            </h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* 소개 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-base md:text-sm font-medium">
              <Users className="w-4 h-4" />
              우리 가족의 사주 조화
            </div>
            <h2 className="text-2xl font-bold text-white">가족사주 분석</h2>
            <p className="text-white/60 text-base md:text-sm leading-relaxed">
              가족 구성원의 사주를 분석하여 오행의 조화,<br />
              관계별 궁합, 가족 역학을 알아봅니다
            </p>
          </motion.div>

          {/* 가족 구성원 입력 */}
          <div className="space-y-4">
            {members.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/[0.03] border-white/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-white flex items-center gap-2">
                        <span className="text-lg">{ROLE_OPTIONS.find(r => r.value === member.role)?.icon || "👤"}</span>
                        구성원 {index + 1}
                      </CardTitle>
                      {members.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 min-w-[36px] min-h-[36px]"
                          onClick={() => removeMember(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* 역할 선택 */}
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-base md:text-sm">가족 관계</Label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {ROLE_OPTIONS.map(role => (
                          <button
                            key={role.value}
                            onClick={() => updateMember(index, "role", role.value)}
                            className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg text-sm md:text-xs transition-all ${
                              member.role === role.value
                                ? "bg-primary/20 text-primary border border-primary/40"
                                : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <span className="text-base">{role.icon}</span>
                            <span>{role.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 이름 + 성별 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-base md:text-sm flex items-center gap-1">
                          <User className="w-3 h-3" /> 이름
                        </Label>
                        <Input
                          placeholder="이름"
                          value={member.name}
                          onChange={(e) => updateMember(index, "name", e.target.value)}
                          className="bg-white/5 border-white/10 text-white h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-base md:text-sm">성별</Label>
                        <ToggleGroup
                          type="single"
                          value={member.gender}
                          onValueChange={(v) => { if (v) updateMember(index, "gender", v); }}
                          className="w-full h-9 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                        >
                          <ToggleGroupItem value="male" className="h-full rounded-lg text-sm md:text-xs data-[state=on]:bg-blue-500/30 data-[state=on]:text-blue-300">남성</ToggleGroupItem>
                          <ToggleGroupItem value="female" className="h-full rounded-lg text-sm md:text-xs data-[state=on]:bg-pink-500/30 data-[state=on]:text-pink-300">여성</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>

                    {/* 생년월일 + 시간 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-base md:text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> 생년월일
                        </Label>
                        <DatePickerInput
                          value={member.birthDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              updateMember(index, "birthDate", val);
                            }
                          }}
                          accentColor="blue"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-base md:text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 태어난 시간
                        </Label>
                        <div className="space-y-2">
                          <Input
                            type="time"
                            value={member.birthTime}
                            onChange={(e) => updateMember(index, "birthTime", e.target.value)}
                            disabled={member.birthTimeUnknown}
                            className={`bg-white/5 border-white/10 text-white h-10 ${member.birthTimeUnknown ? 'opacity-40' : ''}`}
                          />
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={member.birthTimeUnknown}
                              onChange={(e) => updateMember(index, "birthTimeUnknown", e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-primary"
                            />
                            <span className="text-[11px] text-white/60">모름</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* 양력/음력 */}
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-base md:text-sm">날짜 구분</Label>
                      <ToggleGroup
                        type="single"
                        value={member.calendarType}
                        onValueChange={(v) => { if (v) updateMember(index, "calendarType", v); }}
                        className="w-full h-9 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                      >
                        <ToggleGroupItem value="solar" className="h-full rounded-lg text-sm md:text-xs data-[state=on]:bg-primary/30 data-[state=on]:text-primary">양력</ToggleGroupItem>
                        <ToggleGroupItem value="lunar" className="h-full rounded-lg text-sm md:text-xs data-[state=on]:bg-primary/30 data-[state=on]:text-primary">음력</ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    {/* 윤달 여부 (음력일 때만 표시) */}
                    {member.calendarType === "lunar" && (
                      <div className="flex items-center gap-2 px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={member.isLeapMonth}
                            onChange={(e) => updateMember(index, "isLeapMonth", e.target.checked)}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 accent-primary"
                          />
                          <span className="text-base md:text-sm text-white/80 group-hover:text-primary transition-colors">윤달(Leap Month)인 경우 체크</span>
                        </label>
                      </div>
                    )}

                    {errors[index] && (
                      <p className="text-red-400 text-sm md:text-xs">{errors[index]}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* 구성원 추가 버튼 */}
            {members.length < 6 && (
              <Button
                variant="outline"
                className="w-full border-dashed border-white/20 text-white/60 hover:text-white hover:bg-white/5 h-12"
                onClick={addMember}
              >
                <Plus className="w-4 h-4 mr-2" />
                가족 구성원 추가 (최대 6명)
              </Button>
            )}
          </div>

          {/* 분석 버튼 */}
          <Button
            className="w-full bg-gradient-to-r from-primary/80 to-yellow-500/80 hover:from-primary hover:to-yellow-500 text-primary-foreground h-12 rounded-xl font-bold text-base"
            onClick={handleSubmit}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            가족사주 분석하기
          </Button>

          {/* SEO 콘텐츠 */}
          <FamilySajuInfoContent />
        </div>
      </div>
    );
  }

  // ===== 결과 화면 =====
  const validMembers = result.filter(m => m.saju);
  const familyBalance = analyzeFamilyElementBalance(validMembers);
  const familySummary = generateFamilySummary(validMembers);

  // 모든 쌍의 관계 분석
  const relations: { member1: FamilyMember; member2: FamilyMember; analysis: ReturnType<typeof generateRelationInterpretation> }[] = [];
  for (let i = 0; i < validMembers.length; i++) {
    for (let j = i + 1; j < validMembers.length; j++) {
      relations.push({
        member1: validMembers[i],
        member2: validMembers[j],
        analysis: generateRelationInterpretation(validMembers[i], validMembers[j]),
      });
    }
  }

  const anyUnknownTime = result.some(m => m.birthTimeUnknown);
  const familyNames = result.map(m => m.name).join(" · ");

  return (
    <>
      <Helmet>
        <title>가족사주 분석 결과 - 무운</title>
        <meta name="description" content="가족 구성원들의 사주를 기반으로 한 가족 조화 분석 결과입니다. 가족 오행, 구성원 간 궁합 등을 확인하세요." />
        <meta property="og:title" content="가족사주 분석 결과 - 무운" />
        <meta property="og:description" content="가족 구성원들의 사주를 기반으로 한 가족 조화 분석 결과입니다." />
        <meta name="keywords" content="가족사주, 가족 조화, 오행 단어, 가족 운세, 무운" />
      </Helmet>
    <div className="min-h-screen bg-background">
      {/* '시간 모름' 시 안내 라벨 */}
      {anyUnknownTime && (
        <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 relative z-[60]">
          <p className="text-[10px] md:text-sm md:text-xs text-primary text-center font-medium">
            태어난 시간을 모르는 구성원이 포함된 삼주 분석 결과입니다
          </p>
        </div>
      )}
      {/* 헤더 */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setResult(null)} className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            가족사주 분석 결과
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* 가족 종합 점수 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-primary/10 to-yellow-500/5 border-primary/20 overflow-hidden">
            <CardContent className="pt-6 pb-6 text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-base md:text-sm font-medium">
                <Users className="w-4 h-4" />
                우리 가족의 사주 조화
              </div>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="54"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(familySummary.overallScore / 100) * 339.3} 339.3`}
                    transform="rotate(-90 60 60)"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffd700" />
                      <stop offset="100%" stopColor="#ff8c00" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-primary">{familySummary.overallScore}</span>
                  <span className="text-sm md:text-xs text-white/60">종합 점수</span>
                </div>
              </div>
              <p className="text-white/80 text-base md:text-sm leading-relaxed max-w-md mx-auto">
                {familySummary.harmony}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 가족 구성원 사주 요약 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-primary" />
            가족 구성원 사주 요약
          </h2>
          <div className="space-y-3">
            {validMembers.map((member, idx) => {
              const elem = STEM_ELEMENTS[member.saju!.dayPillar.stem];
              const elemKor = ELEMENT_KOREAN[elem] || elem;
              const personality = STEM_PERSONALITY[member.saju!.dayPillar.stem];
              const balance = calculateElementBalance(member.saju!);
              const analysis = analyzeElementBalance(balance);

              return (
                <Card key={idx} className="bg-white/[0.03] border-white/10">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg shrink-0">
                        {ROLE_OPTIONS.find(r => r.value === member.role)?.icon || "👤"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white">{member.name}</span>
                          <span className="text-sm md:text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{member.role}</span>
                        </div>
                        <p className="text-base md:text-sm text-white/60 mb-2">
                          일간(日干): {withReading(member.saju!.dayPillar.stem)} — {personality?.symbol || ""} {elemKor}의 기운
                        </p>
                        <p className="text-sm md:text-xs text-white/50 leading-relaxed">
                          {personality?.description?.substring(0, 80) || ""}...
                        </p>
                        {/* 미니 오행 바 */}
                        <div className="flex gap-1 mt-2">
                          {balance.map((b, bi) => (
                            <div key={bi} className="flex-1">
                              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${Math.min(100, b.value * 20)}%`,
                                    backgroundColor: b.name === '木' ? '#4ade80' : b.name === '火' ? '#f87171' : b.name === '土' ? '#fbbf24' : b.name === '金' ? '#e2e8f0' : '#60a5fa',
                                  }}
                                />
                              </div>
                              <span className="text-xs md:text-[10px] text-white/40 block text-center mt-0.5">{ELEMENT_KOREAN[b.name] || b.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.section>

        {/* 가족 오행 분포 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-primary" />
            가족 오행 분포
          </h2>
          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="pt-4 pb-4 space-y-4">
              {familyBalance.distribution.map((elem, idx) => {
                const maxVal = Math.max(...familyBalance.distribution.map(d => d.value), 1);
                const colors: Record<string, string> = { '木': '#4ade80', '火': '#f87171', '土': '#fbbf24', '金': '#e2e8f0', '水': '#60a5fa' };
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base md:text-sm text-white/80 font-medium">
                        {ELEMENT_KOREAN[elem.name] || elem.name} ({elem.name})
                      </span>
                      <span className="text-sm md:text-xs text-white/50">
                        {elem.members.length > 0 ? elem.members.join(", ") : "-"}
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(elem.value / maxVal) * 100}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: colors[elem.name] || '#888' }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-base md:text-sm text-white/70 leading-relaxed">{familyBalance.advice}</p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* 가족 관계별 분석 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-primary" />
            가족 관계별 궁합 분석
          </h2>
          <div className="space-y-3">
            {relations.map((rel, idx) => (
              <RelationCard key={idx} relation={rel} index={idx} />
            ))}
          </div>
        </motion.section>

        {/* 가족 강점 & 개선점 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            가족의 강점과 조언
          </h2>
          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="pt-4 pb-4 space-y-4">
              {/* 강점 */}
              <div>
                <h3 className="text-base md:text-sm font-bold text-green-400 flex items-center gap-1.5 mb-2">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-sm md:text-xs">+</span>
                  우리 가족의 강점
                </h3>
                <div className="space-y-2">
                  {familySummary.strengths.map((s, i) => (
                    <p key={i} className="text-base md:text-sm text-white/70 leading-relaxed pl-7">{s}</p>
                  ))}
                </div>
              </div>

              {/* 개선점 */}
              <div>
                <h3 className="text-base md:text-sm font-bold text-yellow-400 flex items-center gap-1.5 mb-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-sm md:text-xs">!</span>
                  더 좋은 관계를 위한 조언
                </h3>
                <div className="space-y-2">
                  {familySummary.improvements.map((s, i) => (
                    <p key={i} className="text-base md:text-sm text-white/70 leading-relaxed pl-7">{s}</p>
                  ))}
                </div>
              </div>

              {/* 추천 활동 */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <h3 className="text-base md:text-sm font-bold text-primary flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4" />
                  가족에게 추천하는 활동
                </h3>
                <p className="text-base md:text-sm text-white/70">{familySummary.luckyActivity}</p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* 하단 버튼 */}
        <div className="space-y-2 pt-4">
          {validMembers[0]?.saju && (
            <FortuneShareCard
              result={validMembers[0].saju}
              userName={`${validMembers.map(m => m.name).join(" · ")} 가족`}
              type="family"
              memberNames={validMembers.map(m => m.name)}
              overallScore={familySummary.overallScore}
              harmony={familySummary.harmony}
              luckyActivity={familySummary.luckyActivity}
            />
          )}
          <Button
            className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 h-11 rounded-xl font-medium text-base md:text-sm"
            onClick={() => shareContent({
              title: '무운 가족사주 분석',
              text: `우리 가족 사주 조화 점수: ${familySummary.overallScore}점! 가족의 오행 궁합을 확인해보세요.`,
              page: 'family_saju',
              buttonType: 'text_button'
            })}
          >
            <Share2 className="w-4 h-4 mr-2" />
            친구에게 공유하기
          </Button>
          <Button
            variant="ghost"
            className="w-full text-white/60 hover:text-white hover:bg-white/5 h-11 rounded-xl font-medium text-base md:text-sm"
            onClick={() => setResult(null)}
          >
            다른 가족 정보로 다시 보기
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}

// 관계 카드 컴포넌트
function RelationCard({ relation, index }: {
  relation: { member1: FamilyMember; member2: FamilyMember; analysis: ReturnType<typeof generateRelationInterpretation> };
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const { analysis, member1, member2 } = relation;
  const scoreColor = analysis.score >= 80 ? "text-green-400" : analysis.score >= 65 ? "text-blue-400" : analysis.score >= 50 ? "text-yellow-400" : "text-red-400";
  const scoreBg = analysis.score >= 80 ? "bg-green-500/20" : analysis.score >= 65 ? "bg-blue-500/20" : analysis.score >= 50 ? "bg-yellow-500/20" : "bg-red-500/20";

  return (
    <Card className="bg-white/[0.03] border-white/10 overflow-hidden">
      <button
        className="w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">{ROLE_OPTIONS.find(r => r.value === member1.role)?.icon}</span>
              <span className="text-base md:text-sm font-medium text-white">{member1.name}</span>
              <ArrowRight className="w-3 h-3 text-white/30" />
              <span className="text-base">{ROLE_OPTIONS.find(r => r.value === member2.role)?.icon}</span>
              <span className="text-base md:text-sm font-medium text-white">{member2.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-base md:text-sm font-bold ${scoreColor} ${scoreBg} px-2 py-0.5 rounded-full`}>
                {analysis.score}점
              </span>
              {isOpen ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
            </div>
          </div>
          <p className="text-sm md:text-xs text-white/50 mt-1">{analysis.title}</p>
        </CardContent>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 space-y-3 border-t border-white/5 pt-3">
              <p className="text-base md:text-sm text-white/70 leading-relaxed">{cleanAIContent(analysis.description)}</p>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm md:text-xs font-bold text-primary mb-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> 관계 개선 조언
                </p>
                <p className="text-base md:text-sm text-white/70 leading-relaxed">{cleanAIContent(analysis.advice)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// SEO 콘텐츠 컴포넌트
function FamilySajuInfoContent() {
  return (
    <div className="space-y-8 mt-8">
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white m-0">가족사주란 무엇인가?</h2>
        </div>
        <div className="space-y-4 text-white/70 text-base md:text-sm leading-relaxed">
          <p>
            <strong className="text-primary">가족사주(家族四柱)</strong>는 가족 구성원 각각의 사주팔자(四柱八字)를 종합적으로 분석하여,
            가족 간의 오행(五行) 조화와 관계 역학을 파악하는 명리학의 응용 분야입니다.
          </p>
          <p>
            개인의 사주가 한 사람의 타고난 기질과 운명을 보여준다면, 가족사주는 가족이라는 공동체 안에서
            각 구성원의 기운이 어떻게 상호작용하는지를 분석합니다. 부모와 자녀, 형제자매 간의 오행 상생(相生)과
            상극(相剋) 관계를 통해 가족 내 소통 방식, 갈등 원인, 화합의 열쇠를 찾을 수 있습니다.
          </p>
          <p>
            무운(MuUn)의 가족사주 서비스는 최대 6명의 가족 구성원을 동시에 분석하여, 가족 전체의 오행 균형,
            구성원 간 궁합 점수, 그리고 더 화목한 가정을 위한 실질적인 조언을 제공합니다.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white m-0">가족사주로 알 수 있는 것들</h2>
        </div>
        <div className="grid gap-4">
          {[
            { title: "가족 오행 균형", desc: "가족 전체의 오행 분포를 분석하여 어떤 기운이 강하고 부족한지 파악합니다." },
            { title: "부모-자녀 관계", desc: "부모와 자녀 간의 오행 관계를 통해 양육 스타일과 소통 방법을 제안합니다." },
            { title: "형제자매 관계", desc: "형제자매 간의 성격 차이와 상호 보완 관계를 분석합니다." },
            { title: "가족 화합 방법", desc: "가족 전체의 기운을 고려한 맞춤형 화합 활동과 조언을 제공합니다." },
          ].map((item, idx) => (
            <Card key={idx} className="bg-white/[0.03] border-white/10">
              <CardContent className="pt-4 pb-4">
                <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                <p className="text-base md:text-sm text-white/60">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white m-0">무운 가족사주의 특징</h2>
        </div>
        <div className="grid gap-3">
          {[
            { check: true, title: "최대 6명 동시 분석", desc: "가족 구성원을 한 번에 입력하여 종합적인 분석을 받을 수 있습니다." },
            { check: true, title: "관계별 맞춤 해석", desc: "부모-자녀, 형제자매, 부부 등 관계에 따른 맞춤형 해석을 제공합니다." },
            { check: true, title: "완전 무료, 회원가입 불필요", desc: "어떠한 결제 유도나 회원가입 없이 모든 분석을 자유롭게 이용하실 수 있습니다." },
            { check: true, title: "철저한 개인정보 보호", desc: "입력하신 정보는 서버에 저장되지 않으며, 브라우저 내에서만 안전하게 처리됩니다." },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-green-400 text-sm md:text-xs">✓</span>
              </div>
              <div>
                <h4 className="text-base md:text-sm font-bold text-white">{item.title}</h4>
                <p className="text-sm md:text-xs text-white/50 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
