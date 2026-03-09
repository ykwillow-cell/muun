/**
 * 무운 작명소 - 메인 페이지 (Naming.tsx)
 *
 * 기능:
 * 1. 성씨 선택 (한글 자동완성 Combobox + 동음이의 한자 선택)
 * 2. 사주 정보 입력 (생년월일, 시간, 성별, 양/음력)
 * 3. 81수리 4격(원·형·이·정격) 계산 및 결과 표시
 * 4. 길수 이름 후보 목록 (Supabase 한자 사전 연동)
 * 5. PDF 다운로드 (window.print 기반)
 * 6. 작명 이력 저장 (Supabase fire-and-forget)
 */

import { useState, useRef } from "react";
import { useCanonical } from "@/lib/use-canonical";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronLeft,
  PenLine,
  User,
  Calendar,
  Clock,
  ScrollText,
  Download,
  RefreshCw,
  XCircle,
  Info,
  Loader2,
  Star,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import DatePickerInput from "@/components/DatePickerInput";
import { BirthTimeSelect } from "@/components/ui/birth-time-select";
import SurnameCombobox from "@/components/SurnameCombobox";
import { calculateSaju } from "@/lib/saju";
import { convertToSolarDate } from "@/lib/lunar-converter";
import {
  calculate4Gyeok,
  generateNames,
  type NameCandidate,
  type SuriResult,
  SURI_TABLE,
} from "@/lib/naming-engine";
import { saveNamingHistory } from "@/lib/naming-api";
import { trackCustomEvent } from "@/lib/ga4";

// ──────────────────────────────────────────────
// 오행 스타일 맵
// ──────────────────────────────────────────────
const ELEMENT_COLOR: Record<string, string> = {
  목: "text-green-400",
  화: "text-red-400",
  토: "text-yellow-400",
  금: "text-slate-300",
  수: "text-blue-400",
};
const ELEMENT_BG: Record<string, string> = {
  목: "bg-green-500/10 border-green-500/20",
  화: "bg-red-500/10 border-red-500/20",
  토: "bg-yellow-500/10 border-yellow-500/20",
  금: "bg-slate-400/10 border-slate-400/20",
  수: "bg-blue-500/10 border-blue-500/20",
};

// ──────────────────────────────────────────────
// 폼 스키마
// ──────────────────────────────────────────────
const formSchema = z.object({
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime: z.string(),
  birthTimeUnknown: z.boolean(),
  calendarType: z.enum(["solar", "lunar"]),
  customStrokes: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

// ──────────────────────────────────────────────
// 4격 카드 컴포넌트
// ──────────────────────────────────────────────
function GyeokCard({
  label,
  number,
  description,
}: {
  label: string;
  number: number;
  description: string;
}) {
  const suriInfo = SURI_TABLE[number];
  const isGil = suriInfo?.judgment === "길";

  return (
    <div
      className={`rounded-xl border p-3 space-y-2 ${
        isGil
          ? "bg-amber-500/8 border-amber-500/20"
          : "bg-red-500/8 border-red-500/20"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-white/50">{label}</p>
        <Badge
          className={`text-[10px] px-1.5 py-0 ${
            isGil
              ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
              : "bg-red-500/20 text-red-300 border-red-500/30"
          }`}
        >
          {isGil ? "길" : "흉"}
        </Badge>
      </div>
      <div className="flex items-end gap-1">
        <span
          className={`text-3xl font-black ${
            isGil ? "text-amber-300" : "text-red-300"
          }`}
        >
          {number}
        </span>
        <span className="text-sm text-white/50 pb-1">수</span>
      </div>
      <div>
        <p className="text-sm font-bold text-white">{suriInfo?.name}</p>
        <p className="text-xs text-white/50">{suriInfo?.keyword}</p>
      </div>
      <p className="text-xs text-white/40 leading-relaxed">
        {suriInfo?.description}
      </p>
      <p className="text-[11px] text-white/30 italic">{description}</p>
    </div>
  );
}

// ──────────────────────────────────────────────
// 이름 후보 카드
// ──────────────────────────────────────────────
function CandidateCard({
  candidate,
  surnameHangul,
  surnameHanja,
  onSelect,
  isSelected,
}: {
  candidate: NameCandidate;
  surnameHangul: string;
  surnameHanja: string;
  onSelect: (c: NameCandidate) => void;
  isSelected: boolean;
}) {
  const { char1, char2, suri, hangulName, hanjaName } = candidate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/10"
          : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
      }`}
      onClick={() => onSelect(candidate)}
    >
      {/* 이름 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xl font-black text-white">
            {surnameHangul}
            {hangulName}
          </span>
          <span className="ml-2 text-sm text-white/40">
            {surnameHanja}
            {hanjaName}
          </span>
        </div>
        {isSelected && (
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
            선택됨
          </Badge>
        )}
      </div>

      {/* 한자 정보 */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[char1, char2].map((ch, idx) => (
          <div
            key={idx}
            className={`rounded-lg border p-2 ${ELEMENT_BG[ch.element] ?? "bg-white/5 border-white/10"}`}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-white">{ch.hanja}</span>
              <span className="text-xs text-white/50">{ch.hangul}</span>
              <span
                className={`text-xs font-bold ml-auto ${ELEMENT_COLOR[ch.element] ?? "text-white/50"}`}
              >
                {ch.element}
              </span>
            </div>
            <p className="text-[11px] text-white/40 mt-0.5">{ch.meaning}</p>
            <p className="text-[10px] text-white/30">{ch.strokes}획</p>
          </div>
        ))}
      </div>

      {/* 4격 요약 */}
      <div className="grid grid-cols-4 gap-1">
        {[
          { label: "원격", val: suri.won, j: suri.wonJudgment },
          { label: "형격", val: suri.hyung, j: suri.hyungJudgment },
          { label: "이격", val: suri.i, j: suri.iJudgment },
          { label: "정격", val: suri.jung, j: suri.jungJudgment },
        ].map((g) => (
          <div
            key={g.label}
            className={`rounded-lg p-1.5 text-center ${
              g.j === "길"
                ? "bg-amber-500/10 border border-amber-500/20"
                : "bg-red-500/10 border border-red-500/20"
            }`}
          >
            <p className="text-[10px] text-white/40">{g.label}</p>
            <p
              className={`text-sm font-black ${
                g.j === "길" ? "text-amber-300" : "text-red-300"
              }`}
            >
              {g.val}
            </p>
            <p
              className={`text-[10px] font-bold ${
                g.j === "길" ? "text-amber-400" : "text-red-400"
              }`}
            >
              {g.j}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// 메인 페이지
// ──────────────────────────────────────────────
export default function Naming() {
  useCanonical("/naming");

  const [step, setStep] = useState<"form" | "result">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState<NameCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] =
    useState<NameCandidate | null>(null);
  const [noResultReason, setNoResultReason] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  // 성씨 상태 (Combobox에서 관리)
  const [surnameHangul, setSurnameHangul] = useState("");
  const [surnameHanja, setSurnameHanja] = useState("");
  const [surnameStrokes, setSurnameStrokes] = useState(0);
  const [surnameError, setSurnameError] = useState("");

  // 결과 저장용
  const [currentSurnameHangul, setCurrentSurnameHangul] = useState("");
  const [currentSurnameHanja, setCurrentSurnameHanja] = useState("");
  const [currentFamilyStrokes, setCurrentFamilyStrokes] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "male",
      birthDate: "2000-01-01",
      birthTime: "12:00",
      birthTimeUnknown: false,
      calendarType: "solar",
      customStrokes: "",
    },
  });

  // 직접 입력 모드 (목록에 없는 성씨)
  const isCustomSurname = surnameHanja === "?";

  const onSubmit = async (data: FormValues) => {
    // 성씨 유효성 검사
    if (!surnameHangul) {
      setSurnameError("성씨를 입력해주세요");
      return;
    }
    setSurnameError("");

    let familyStrokes = surnameStrokes;

    // 직접 입력 모드: 획수 별도 입력
    if (isCustomSurname) {
      familyStrokes = parseInt(data.customStrokes ?? "0") || 0;
      if (familyStrokes <= 0) {
        toast.error("성씨 원획수를 입력해주세요.");
        return;
      }
    }

    if (familyStrokes <= 0) {
      setSurnameError("성씨를 선택해주세요");
      return;
    }

    setIsLoading(true);
    setNoResultReason("");
    try {
      // 사주 계산
      const time = data.birthTimeUnknown ? "12:00" : data.birthTime;
      const birthDateObj = convertToSolarDate(
        data.birthDate,
        time,
        data.calendarType
      );
      const saju = calculateSaju(birthDateObj, data.gender);

      // GA4 이벤트
      trackCustomEvent("naming_request", {
        surname: `${surnameHangul}(${surnameHanja})`,
        family_strokes: familyStrokes,
        gender: data.gender,
        calendar_type: data.calendarType,
      });

      // 작명 후보 생성
      const result = await generateNames(saju, familyStrokes, {
        maxResults: 12,
        prioritizeWeakElements: true,
      });

      setCurrentSurnameHangul(surnameHangul);
      setCurrentSurnameHanja(surnameHanja === "?" ? "" : surnameHanja);
      setCurrentFamilyStrokes(familyStrokes);

      if (result.length === 0) {
        // 오행 조건 없이 재시도
        const fallback = await generateNames(saju, familyStrokes, {
          maxResults: 12,
          prioritizeWeakElements: false,
        });
        if (fallback.length === 0) {
          setNoResultReason(
            "해당 성씨의 획수 조합에서 4격이 모두 길수인 이름 후보를 찾지 못했습니다. " +
              "한자 데이터베이스에 해당 획수의 한자가 없을 수 있습니다."
          );
          setCandidates([]);
        } else {
          setCandidates(fallback);
          setNoResultReason(
            "부족 오행 조건을 만족하는 한자가 없어, 81수리 기준으로만 후보를 제시합니다."
          );
        }
      } else {
        setCandidates(result);
      }

      setStep("result");
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("작명 오류:", err);
      toast.error("작명 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCandidate = (c: NameCandidate) => {
    setSelectedCandidate(c);
    // 이력 저장 (fire-and-forget)
    saveNamingHistory(
      currentSurnameHangul,
      currentSurnameHangul +
        c.hangulName +
        "(" +
        currentSurnameHanja +
        c.hanjaName +
        ")"
    ).catch(() => {});
    trackCustomEvent("naming_select", {
      name: currentSurnameHangul + c.hangulName,
      hanja: currentSurnameHanja + c.hanjaName,
    });
  };

  const handlePrint = () => {
    trackCustomEvent("naming_pdf_download", {
      name: selectedCandidate?.hangulName ?? "미선택",
    });
    window.print();
  };

  const handleReset = () => {
    setStep("form");
    setCandidates([]);
    setSelectedCandidate(null);
    setNoResultReason("");
    setSurnameHangul("");
    setSurnameHanja("");
    setSurnameStrokes(0);
    setSurnameError("");
    form.reset();
    window.scrollTo(0, 0);
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  // ── 폼 단계 ──────────────────────────────────
  if (step === "form") {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        <Helmet>
          <title>작명소 - 81수리 성명학 이름 분석 | MUUN 무운</title>
          <meta
            name="description"
            content="81수리 성명학 기반으로 원격·형격·이격·정격 4격을 분석하고 길수 이름 후보를 추천합니다. 사주 오행을 반영한 맞춤 작명 서비스."
          />
        </Helmet>

        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-yellow-500/8 rounded-full blur-[100px]" />
        </div>

        {/* 헤더 */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className="text-base md:text-lg font-bold text-white">
              작명소
            </h2>
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-5`}
          >
            {/* 타이틀 */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl">
                <PenLine className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] md:text-xs font-bold tracking-wider text-amber-400 uppercase">
                  81수리 성명학
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                무운 작명소
              </h2>
              <p className="text-muted-foreground text-xs md:text-sm">
                원격·형격·이격·정격 4격이 모두 길수인 이름을 사주 오행에 맞춰
                추천합니다
              </p>
            </div>

            {/* 입력 폼 */}
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <PenLine className="w-4 h-4 text-amber-400" />
                  </div>
                  작명 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* 성씨 입력 (Combobox) */}
                  <div className="space-y-1.5">
                    <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      성씨
                    </Label>
                    <SurnameCombobox
                      value={
                        surnameHangul && surnameHanja && surnameHanja !== "?"
                          ? `${surnameHangul}(${surnameHanja})`
                          : surnameHangul
                      }
                      strokes={surnameStrokes}
                      onChange={(hangul, hanja, strokes) => {
                        setSurnameHangul(hangul);
                        setSurnameHanja(hanja);
                        setSurnameStrokes(strokes);
                        setSurnameError("");
                      }}
                      error={surnameError}
                    />
                  </div>

                  {/* 직접 입력 모드: 획수 입력 */}
                  <AnimatePresence>
                    {isCustomSurname && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5"
                      >
                        <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-400" />
                          성씨 원획수 직접 입력
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          max={40}
                          placeholder="예: 8 (金=8획)"
                          {...form.register("customStrokes")}
                          className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                        />
                        <p className="text-[11px] text-white/40 leading-relaxed">
                          원획수(原劃數) 기준으로 입력해주세요.
                          변형 부수(氵→水 4획, 灬→火 4획 등)는 원래 획수로
                          계산합니다.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 성별 */}
                  <div className="space-y-1.5">
                    <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      성별
                    </Label>
                    <ToggleGroup
                      type="single"
                      value={form.watch("gender")}
                      onValueChange={(value) => {
                        if (value)
                          form.setValue("gender", value as "male" | "female");
                      }}
                      className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                    >
                      <ToggleGroupItem
                        value="male"
                        className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                      >
                        남성
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="female"
                        className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                      >
                        여성
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* 생년월일 + 시간 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        생년월일
                      </Label>
                      <DatePickerInput
                        id="birthDate"
                        {...form.register("birthDate")}
                        accentColor="amber"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        태어난 시간
                      </Label>
                      <BirthTimeSelect
                        value={form.watch("birthTime")}
                        onChange={(val) => form.setValue("birthTime", val)}
                        onUnknownChange={(isUnknown) =>
                          form.setValue("birthTimeUnknown", isUnknown)
                        }
                        isUnknown={form.watch("birthTimeUnknown")}
                        accentClass="focus:ring-amber-500/50 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* 양/음력 */}
                  <div className="space-y-1.5">
                    <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                      <ScrollText className="w-3.5 h-3.5 text-amber-400" />
                      날짜 구분
                    </Label>
                    <ToggleGroup
                      type="single"
                      value={form.watch("calendarType")}
                      onValueChange={(value) => {
                        if (value)
                          form.setValue(
                            "calendarType",
                            value as "solar" | "lunar"
                          );
                      }}
                      className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                    >
                      <ToggleGroupItem
                        value="solar"
                        className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                      >
                        양력
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="lunar"
                        className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm"
                      >
                        음력
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* 안내 */}
                  <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <p className="text-xs font-bold text-amber-300">
                        작명 원칙
                      </p>
                    </div>
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      원격(초년운)·형격(청년운)·이격(장년운)·정격(총운) 4격이
                      모두 길수인 이름만 추천합니다. 사주 오행 분석으로 부족한
                      오행을 보완하는 한자를 우선 선정합니다.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold text-sm md:text-base rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        이름 분석 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        이름 분석하기
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* 기능 소개 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { icon: "🔢", title: "81수리", desc: "4격 길흉 분석" },
                { icon: "☯️", title: "사주 오행", desc: "부족 오행 보완" },
                { icon: "📖", title: "한자 사전", desc: "5,000자+ 데이터" },
                { icon: "📄", title: "PDF 저장", desc: "결과 다운로드" },
              ].map((f) => (
                <Card
                  key={f.title}
                  className="bg-white/5 border-white/10 rounded-xl"
                >
                  <CardContent className="p-3 text-center space-y-1">
                    <div className="text-2xl">{f.icon}</div>
                    <p className="text-xs font-bold text-white">{f.title}</p>
                    <p className="text-[10px] text-white/40">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // ── 결과 단계 ──────────────────────────────────
  return (
    <div
      className="min-h-screen bg-background text-foreground pb-16 relative antialiased"
      ref={resultRef}
    >
      <Helmet>
        <title>작명 결과 - 81수리 성명학 | MUUN 무운</title>
        <meta
          name="description"
          content="81수리 성명학 기반 작명 결과 - 원격·형격·이격·정격 4격 분석"
        />
      </Helmet>

      {/* 배경 */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-yellow-500/8 rounded-full blur-[100px]" />
      </div>

      {/* 헤더 */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10 print:hidden">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-base md:text-lg font-bold text-white">
              작명 결과
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="border-white/20 text-white hover:bg-white/10 text-xs gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              PDF 저장
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-white/60 hover:text-white hover:bg-white/10 text-xs gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              다시 분석
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
        <div className={`${commonMaxWidth} space-y-5`}>

          {/* 성씨 정보 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-panel border-amber-500/20 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/40 mb-1">분석 대상 성씨</p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-amber-300">
                        {currentSurnameHangul}
                      </span>
                      {currentSurnameHanja && (
                        <span className="text-lg text-white/40">
                          {currentSurnameHanja}
                        </span>
                      )}
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                        {currentFamilyStrokes}획
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40 mb-1">후보 이름 수</p>
                    <p className="text-2xl font-black text-white">
                      {candidates.length}
                      <span className="text-sm font-normal text-white/40 ml-1">
                        개
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 선택된 이름의 4격 상세 */}
          <AnimatePresence>
            {selectedCandidate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="glass-panel border-amber-500/20 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                    <CardTitle className="text-white flex items-center gap-2 text-base">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <Star className="w-4 h-4 text-amber-400" />
                      </div>
                      선택한 이름 — 4격 상세 분석
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 space-y-4">
                    {/* 이름 헤더 */}
                    <div className="text-center py-2">
                      <p className="text-4xl font-black text-white">
                        {currentSurnameHangul}
                        {selectedCandidate.hangulName}
                      </p>
                      <p className="text-lg text-white/40 mt-1">
                        {currentSurnameHanja}
                        {selectedCandidate.hanjaName}
                      </p>
                    </div>

                    {/* 4격 카드 */}
                    <div className="grid grid-cols-2 gap-3">
                      <GyeokCard
                        label="원격 (元格) — 초년운"
                        number={selectedCandidate.suri.won}
                        description="이름 두 글자의 합 / 초년·건강·가정운"
                      />
                      <GyeokCard
                        label="형격 (亨格) — 청년운"
                        number={selectedCandidate.suri.hyung}
                        description="성 + 이름 첫째자 / 청년·성공·사업운"
                      />
                      <GyeokCard
                        label="이격 (利格) — 장년운"
                        number={selectedCandidate.suri.i}
                        description="성 + 이름 둘째자 / 장년·부부·사회운"
                      />
                      <GyeokCard
                        label="정격 (貞格) — 총운"
                        number={selectedCandidate.suri.jung}
                        description="성 + 이름 전체 / 노년·총운"
                      />
                    </div>

                    {/* 한자 상세 */}
                    <div className="rounded-xl bg-white/3 border border-white/5 p-4 space-y-3">
                      <p className="text-xs font-bold text-white/60 uppercase tracking-wider">
                        한자 풀이
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          selectedCandidate.char1,
                          selectedCandidate.char2,
                        ].map((ch, idx) => (
                          <div
                            key={idx}
                            className={`rounded-xl border p-3 ${ELEMENT_BG[ch.element] ?? "bg-white/5 border-white/10"}`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl font-black text-white">
                                {ch.hanja}
                              </span>
                              <div>
                                <p className="text-sm font-bold text-white">
                                  {ch.hangul}
                                </p>
                                <p
                                  className={`text-xs font-bold ${ELEMENT_COLOR[ch.element] ?? "text-white/50"}`}
                                >
                                  {ch.element}오행 · {ch.strokes}획
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-white/50">
                              {ch.meaning}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PDF 저장 버튼 */}
                    <Button
                      onClick={handlePrint}
                      className="w-full h-11 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold rounded-xl gap-2 print:hidden"
                    >
                      <Download className="w-4 h-4" />
                      이 이름 PDF로 저장
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 이름 후보 목록 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <PenLine className="w-4 h-4 text-amber-400" />
                  </div>
                  이름 후보 목록
                  <Badge className="ml-auto bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
                    4격 전부 길수
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {noResultReason && (
                  <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3 mb-4 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300/80">{noResultReason}</p>
                  </div>
                )}

                {candidates.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <XCircle className="w-12 h-12 text-white/20 mx-auto" />
                    <p className="text-white/40 text-sm">
                      조건을 만족하는 이름 후보가 없습니다.
                    </p>
                    <p className="text-white/30 text-xs">
                      Supabase 한자 데이터베이스에 해당 획수의 한자가 없을 수
                      있습니다. 관리자에게 문의해주세요.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="border-white/20 text-white hover:bg-white/10 mt-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                      다시 분석하기
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-white/40 mb-2">
                      이름을 클릭하면 4격 상세 분석을 볼 수 있습니다.
                    </p>
                    {candidates.map((c, idx) => (
                      <CandidateCard
                        key={`${c.hanjaName}-${idx}`}
                        candidate={c}
                        surnameHangul={currentSurnameHangul}
                        surnameHanja={currentSurnameHanja}
                        onSelect={handleSelectCandidate}
                        isSelected={
                          selectedCandidate?.hanjaName === c.hanjaName
                        }
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* 다시 분석 버튼 */}
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full h-11 border-white/20 text-white hover:bg-white/10 rounded-xl gap-2 print:hidden"
          >
            <RefreshCw className="w-4 h-4" />
            다른 성씨로 다시 분석하기
          </Button>
        </div>
      </main>

      {/* 인쇄 전용 스타일 */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          header { display: none !important; }
        }
      `}</style>
    </div>
  );
}
