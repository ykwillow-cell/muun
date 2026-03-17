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
  ChevronDown,
  ChevronUp,
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
  Globe,
  CheckCircle2,
  Lightbulb,
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
import { type EnglishNameSuggestion } from "@/lib/english-name-matcher";
import { trackCustomEvent } from "@/lib/ga4";

// ──────────────────────────────────────────────
// 오행 스타일 맵
// ──────────────────────────────────────────────
const ELEMENT_COLOR: Record<string, string> = {
  목: "text-green-400",
  화: "text-red-400",
  토: "text-yellow-400",
  금: "text-[#6a6a66]",
  수: "text-blue-400",
};
const ELEMENT_BG: Record<string, string> = {
  목: "bg-green-500/10 border-green-500/20",
  화: "bg-red-500/10 border-red-500/20",
  토: "bg-yellow-500/10 border-yellow-500/20",
  금: "bg-[#6a6a66]/10 border-[#6a6a66]/20",
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
// 4격 쉬운 풀이 맵 (일반인 언어)
// ──────────────────────────────────────────────
const GYEOK_EASY_EXPLAIN: Record<string, Record<number, string>> = {
  won: {
    1: "타고난 건강과 밝은 기운으로 어린 시절을 활기차게 보냅니다.",
    3: "창의력과 표현력이 넘쳐 어릴 때부터 주변의 사랑을 받습니다.",
    5: "안정적인 가정 환경 속에서 믿음직한 성격으로 자랍니다.",
    6: "따뜻한 마음씨와 배려심으로 가족과 친구들에게 사랑받습니다.",
    7: "독립심이 강하고 자기 주관이 뚜렷한 아이로 성장합니다.",
    8: "성실하고 끈기 있는 성격으로 무엇이든 꾸준히 해냅니다.",
    11: "직관력이 뛰어나고 감수성이 풍부한 어린 시절을 보냅니다.",
    13: "지혜롭고 총명하여 학업에서 두각을 나타냅니다.",
    15: "온화하고 덕스러운 성품으로 주변 사람들과 잘 어울립니다.",
    16: "리더십이 있고 책임감이 강해 친구들 사이에서 중심이 됩니다.",
    17: "강한 의지와 추진력으로 목표를 향해 나아갑니다.",
    18: "부지런하고 실력 있는 아이로 성장해 성공의 기반을 닦습니다.",
    21: "독창적인 아이디어와 리더십으로 어릴 때부터 두각을 나타냅니다.",
    23: "진취적인 기상과 열정으로 새로운 도전을 두려워하지 않습니다.",
    24: "노력한 만큼 결실을 거두는 복된 어린 시절을 보냅니다.",
    25: "안정 속에서도 새로운 것을 탐구하는 호기심 많은 아이입니다.",
    29: "지혜와 재능이 뛰어나 어릴 때부터 주목받습니다.",
    31: "사람을 이끄는 매력과 따뜻한 인품으로 인기를 얻습니다.",
    32: "유연한 사고와 친화력으로 어디서든 잘 적응합니다.",
    33: "활발하고 긍정적인 에너지로 주변을 밝게 만듭니다.",
    35: "학문과 예술에 재능이 있어 다양한 분야에서 빛납니다.",
    37: "신뢰받는 성품과 강한 의지로 어릴 때부터 인정받습니다.",
    38: "예술적 감각과 창의성이 뛰어나 독특한 재능을 발휘합니다.",
    39: "지혜롭고 통찰력이 있어 어릴 때부터 어른스러운 면모를 보입니다.",
    41: "덕망 있고 신뢰받는 성품으로 자연스럽게 리더가 됩니다.",
    45: "지혜와 인내로 어떤 어려움도 극복하는 강한 아이입니다.",
    47: "성실하고 정직한 성품으로 주변의 믿음을 얻습니다.",
    48: "지혜와 덕망을 겸비하여 어릴 때부터 존경받습니다.",
    52: "의지가 강하고 목표 지향적인 성격으로 꿈을 향해 나아갑니다.",
    57: "강한 의지와 끈기로 어떤 역경도 이겨내는 아이입니다.",
    61: "따뜻한 마음과 강한 의지로 주변 사람들에게 힘이 됩니다.",
    63: "안정적이고 화목한 가정 환경 속에서 행복하게 자랍니다.",
    65: "온화하고 덕스러운 성품으로 어릴 때부터 사랑받습니다.",
    67: "성실하고 꾸준한 노력으로 목표를 이루는 아이입니다.",
    68: "지혜롭고 성실하여 학업과 생활 모두에서 좋은 결과를 냅니다.",
    81: "최고의 기운을 타고나 어릴 때부터 특별한 재능을 발휘합니다.",
  },
  hyung: {
    1: "사회에 나가 능력을 인정받고 빠르게 성공의 길을 걷습니다.",
    3: "창의적인 아이디어와 표현력으로 사업과 직장에서 두각을 나타냅니다.",
    5: "안정적인 직장과 사업 기반을 다지며 꾸준히 성장합니다.",
    6: "인간관계가 좋아 협력을 통해 사업과 직장에서 성공합니다.",
    7: "독립적인 사업 능력으로 자신만의 길을 개척합니다.",
    8: "성실한 노력으로 직장과 사업에서 탄탄한 기반을 쌓습니다.",
    11: "직관력과 감수성을 살려 창의적인 분야에서 성공합니다.",
    13: "총명한 두뇌로 전문직이나 학문 분야에서 인정받습니다.",
    15: "원만한 인간관계로 어디서든 환영받으며 성공합니다.",
    16: "리더십을 발휘하여 조직을 이끌고 큰 성과를 냅니다.",
    17: "강한 추진력으로 목표를 달성하고 사업에서 성공합니다.",
    18: "부지런한 노력으로 직장과 사업에서 빠르게 성장합니다.",
    21: "독창적인 아이디어로 새로운 분야를 개척하고 성공합니다.",
    23: "도전 정신과 열정으로 사업과 직장에서 빠르게 성공합니다.",
    24: "꾸준한 노력이 결실을 맺어 안정적인 성공을 이룹니다.",
    25: "안정과 도전을 균형 있게 추구하며 성공합니다.",
    29: "뛰어난 재능과 지혜로 전문 분야에서 두각을 나타냅니다.",
    31: "사람을 이끄는 능력으로 조직에서 중요한 역할을 합니다.",
    32: "유연한 사고로 변화에 잘 적응하며 성공합니다.",
    33: "활발한 에너지와 긍정적인 태도로 사업에서 성공합니다.",
    35: "학문과 예술 분야에서 뛰어난 성과를 냅니다.",
    37: "신뢰받는 성품으로 직장과 사업에서 오래 인정받습니다.",
    38: "예술적 재능을 살려 창의적인 분야에서 성공합니다.",
    39: "통찰력과 지혜로 중요한 결정을 잘 내리고 성공합니다.",
    41: "덕망과 신뢰로 조직의 리더가 되어 큰 성과를 냅니다.",
    45: "인내와 지혜로 어떤 어려움도 극복하고 성공합니다.",
    47: "정직하고 성실한 태도로 직장과 사업에서 신뢰를 쌓습니다.",
    48: "지혜와 덕망으로 조직에서 존경받는 리더가 됩니다.",
    52: "강한 의지로 목표를 향해 나아가 성공을 이룹니다.",
    57: "끈기 있는 노력으로 어떤 역경도 이겨내고 성공합니다.",
    61: "따뜻한 리더십으로 조직을 이끌고 성공합니다.",
    63: "안정적인 환경 속에서 꾸준히 성장하여 성공합니다.",
    65: "온화한 성품으로 협력을 이끌어 성공합니다.",
    67: "성실한 노력으로 직장과 사업에서 인정받습니다.",
    68: "지혜와 성실함으로 직장과 사업에서 좋은 결과를 냅니다.",
    81: "최고의 운으로 사업과 직장에서 큰 성공을 이룹니다.",
  },
  i: {
    1: "배우자와 깊은 신뢰를 쌓고 사회적으로도 인정받습니다.",
    3: "밝고 창의적인 성격으로 사회 활동에서 인기를 얻습니다.",
    5: "안정적인 가정과 원만한 사회생활을 함께 누립니다.",
    6: "따뜻한 가정을 이루고 사회에서도 신뢰받습니다.",
    7: "독립적인 성격으로 자신만의 삶을 주체적으로 이끕니다.",
    8: "성실한 노력으로 가정과 사회 모두에서 안정을 이룹니다.",
    11: "감수성이 풍부하여 가족과 깊은 유대를 형성합니다.",
    13: "지혜로운 판단으로 가정과 사회에서 중요한 역할을 합니다.",
    15: "원만한 성격으로 가정과 사회 어디서든 사랑받습니다.",
    16: "책임감 있는 태도로 가정과 사회에서 신뢰를 얻습니다.",
    17: "강한 의지로 가정과 사회에서 자신의 역할을 다합니다.",
    18: "부지런함으로 가정을 안정시키고 사회에서도 인정받습니다.",
    21: "독창적인 아이디어로 사회에서 주목받고 가정도 화목합니다.",
    23: "활발한 사회 활동으로 인맥을 넓히고 가정도 행복합니다.",
    24: "노력의 결실로 가정과 사회 모두에서 풍요로움을 누립니다.",
    25: "균형 잡힌 삶으로 가정과 사회 모두에서 안정을 이룹니다.",
    29: "뛰어난 재능으로 사회에서 인정받고 가정도 화목합니다.",
    31: "따뜻한 인품으로 가정과 사회에서 중심적인 역할을 합니다.",
    32: "유연한 성격으로 가정과 사회 어디서든 잘 적응합니다.",
    33: "긍정적인 에너지로 가정과 사회를 밝게 만듭니다.",
    35: "다재다능한 능력으로 가정과 사회에서 빛납니다.",
    37: "신뢰받는 성품으로 가정과 사회에서 오래 인정받습니다.",
    38: "예술적 감각으로 가정과 사회에서 독특한 존재감을 발휘합니다.",
    39: "통찰력으로 가정과 사회에서 현명한 결정을 내립니다.",
    41: "덕망으로 가정과 사회에서 자연스럽게 리더가 됩니다.",
    45: "인내와 지혜로 가정과 사회에서 안정을 이룹니다.",
    47: "정직한 성품으로 가정과 사회에서 신뢰를 쌓습니다.",
    48: "지혜와 덕망으로 가정과 사회에서 존경받습니다.",
    52: "강한 의지로 가정과 사회에서 자신의 역할을 다합니다.",
    57: "끈기 있는 노력으로 가정과 사회에서 안정을 이룹니다.",
    61: "따뜻한 마음으로 가정과 사회에서 사랑받습니다.",
    63: "화목한 가정을 이루고 사회에서도 안정을 찾습니다.",
    65: "온화한 성품으로 가정과 사회에서 사랑받습니다.",
    67: "성실한 노력으로 가정과 사회에서 인정받습니다.",
    68: "지혜와 성실함으로 가정과 사회에서 좋은 결과를 냅니다.",
    81: "최고의 운으로 가정과 사회 모두에서 행복을 누립니다.",
  },
  jung: {
    1: "한 평생 건강하고 활기찬 삶을 누립니다.",
    3: "창의적이고 표현력 있는 삶으로 많은 이들에게 기억됩니다.",
    5: "안정적이고 평화로운 삶을 살며 주변에 좋은 영향을 줍니다.",
    6: "따뜻한 인간관계 속에서 행복하고 풍요로운 삶을 삽니다.",
    7: "자신만의 길을 개척하며 독립적이고 당당한 삶을 삽니다.",
    8: "성실한 노력으로 안정적이고 풍요로운 삶을 이룹니다.",
    11: "감수성 풍부한 삶 속에서 깊은 인간관계를 맺습니다.",
    13: "총명한 두뇌로 학문과 전문 분야에서 업적을 남깁니다.",
    15: "덕스러운 삶으로 주변 사람들에게 오래 기억됩니다.",
    16: "리더로서 많은 사람들에게 긍정적인 영향을 미칩니다.",
    17: "강한 의지로 큰 목표를 이루고 의미 있는 삶을 삽니다.",
    18: "부지런한 노력으로 풍요롭고 안정적인 삶을 이룹니다.",
    21: "독창적인 업적으로 사회에 큰 기여를 합니다.",
    23: "도전적인 삶으로 새로운 길을 개척하고 성공합니다.",
    24: "꾸준한 노력의 결실로 풍요롭고 행복한 삶을 삽니다.",
    25: "균형 잡힌 삶으로 안정과 성취를 함께 누립니다.",
    29: "뛰어난 재능으로 전문 분야에서 큰 업적을 남깁니다.",
    31: "따뜻한 인품으로 많은 사람들에게 사랑받는 삶을 삽니다.",
    32: "유연한 삶의 태도로 어떤 상황에서도 행복을 찾습니다.",
    33: "긍정적인 에너지로 주변을 밝히며 행복한 삶을 삽니다.",
    35: "다재다능한 능력으로 다양한 분야에서 성과를 냅니다.",
    37: "신뢰받는 삶으로 오래도록 존경받습니다.",
    38: "예술적 감각으로 아름다운 삶의 흔적을 남깁니다.",
    39: "통찰력 있는 삶으로 중요한 결정을 잘 내리고 성공합니다.",
    41: "덕망 있는 삶으로 많은 사람들에게 존경받습니다.",
    45: "인내와 지혜로 어떤 어려움도 극복하고 성공적인 삶을 삽니다.",
    47: "정직하고 성실한 삶으로 오래도록 신뢰받습니다.",
    48: "지혜와 덕망으로 사회에 큰 기여를 하고 존경받습니다.",
    52: "강한 의지로 큰 목표를 이루고 의미 있는 삶을 삽니다.",
    57: "끈기 있는 노력으로 어떤 역경도 이겨내고 성공합니다.",
    61: "따뜻한 마음으로 많은 사람들에게 사랑받는 삶을 삽니다.",
    63: "안정적이고 화목한 삶 속에서 행복을 누립니다.",
    65: "온화하고 덕스러운 삶으로 주변에 좋은 영향을 줍니다.",
    67: "성실한 노력으로 안정적이고 풍요로운 삶을 이룹니다.",
    68: "지혜와 성실함으로 풍요롭고 행복한 삶을 삽니다.",
    81: "최고의 총운으로 한 평생 행복하고 성공적인 삶을 삽니다.",
  },
};

/** 4격 유형에 따른 기본 쉬운 풀이 (수리 테이블에 없을 때 fallback) */
function getEasyExplain(gyeokType: 'won' | 'hyung' | 'i' | 'jung', number: number, isGil: boolean): string {
  const map = GYEOK_EASY_EXPLAIN[gyeokType];
  if (map[number]) return map[number];
  const suriInfo = SURI_TABLE[number];
  if (!suriInfo) return isGil ? "좋은 기운이 함께합니다." : "주의가 필요한 기운입니다.";
  if (isGil) return `${suriInfo.keyword}의 기운으로 좋은 운을 맞이합니다.`;
  return `${suriInfo.keyword}의 기운으로 주의가 필요합니다.`;
}

// ──────────────────────────────────────────────
// 4격 카드 컴포넌트
// ──────────────────────────────────────────────
function GyeokCard({
  label,
  number,
  description,
  gyeokType,
}: {
  label: string;
  number: number;
  description: string;
  gyeokType: 'won' | 'hyung' | 'i' | 'jung';
}) {
  const suriInfo = SURI_TABLE[number];
  const isGil = suriInfo?.judgment === "길";
  const easyExplain = getEasyExplain(gyeokType, number, isGil ?? false);

  return (
    <div
      className={`rounded-xl border p-3 space-y-2 ${
        isGil
          ? "bg-amber-500/8 border-amber-500/20"
          : "bg-red-500/8 border-red-500/20"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-[#999891]">{label}</p>
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
        <span className="text-sm text-[#999891] pb-1">수</span>
      </div>
      <div>
        <p className="text-sm font-bold text-[#1a1a18]">{suriInfo?.name}</p>
        <p className="text-xs text-[#999891]">{suriInfo?.keyword}</p>
      </div>
      {/* 쉬운 풀이 */}
      <div className={`rounded-lg p-2.5 ${
        isGil ? "bg-amber-500/8" : "bg-red-500/8"
      }`}>
        <div className="flex items-start gap-1.5">
          <Lightbulb className={`w-3 h-3 mt-0.5 flex-shrink-0 ${
            isGil ? "text-amber-400" : "text-red-400"
          }`} />
          <p className={`text-xs leading-relaxed ${
            isGil ? "text-amber-200/80" : "text-red-200/80"
          }`}>
            {easyExplain}
          </p>
        </div>
      </div>
      <p className="text-[11px] text-[#999891] italic">{description}</p>
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
  const { char1, char2, suri, hangulName, hanjaName, englishNames, fitnessScore } = candidate;
  // 이름 한 줄 요약: 한자 의미 키워드 추출
  const meaningKeywords = [char1.meaning, char2.meaning]
    .map(m => m.split(/[,\s·]+/)[0])
    .filter(Boolean)
    .join(' · ');
  // 영어 이름 첫 번째
  const firstEnglish = englishNames?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border cursor-pointer transition-all duration-200 overflow-hidden ${
        isSelected
          ? "bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/10"
          : "bg-black/[0.05] border-black/10 hover:bg-white hover:border-amber-500/20"
      }`}
      onClick={() => onSelect(candidate)}
    >
      {/* 이름 헤더 */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#1a1a18]">
            {surnameHangul}{hangulName}
          </span>
          <span className="text-sm text-[#999891]">
            {surnameHanja}{hanjaName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* 적합도 점수 배지 */}
          <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
            fitnessScore >= 90 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            fitnessScore >= 80 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
            'bg-black/06 text-[#999891] border border-black/10'
          }`}>
            <Star className="w-2.5 h-2.5" />
            {fitnessScore.toFixed(1)}점
          </div>
          {isSelected ? (
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />선택됨
            </Badge>
          ) : (
            <span className="text-[11px] text-amber-400/70 flex items-center gap-0.5">
              상세보기 <ChevronDown className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      {/* 한 줄 요약: 의미 + 영어 이름 */}
      <div className="px-4 pb-3 flex items-center justify-between gap-2">
        <p className="text-xs text-[#999891]">
          <span className="text-[#5a5a56]">{char1.hanja}</span> {char1.hangul}({meaningKeywords.split(' · ')[0]}) ·{" "}
          <span className="text-[#5a5a56]">{char2.hanja}</span> {char2.hangul}({meaningKeywords.split(' · ')[1] ?? char2.meaning.split(/[,\s·]+/)[0]})
        </p>
        {firstEnglish && (
          <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/20 text-[10px] flex-shrink-0">
            <Globe className="w-2.5 h-2.5 mr-1" />{firstEnglish.name}
          </Badge>
        )}
      </div>

      {/* 4격 수리 및 한자 오행 요약 */}
      <div className="px-4 pb-4 space-y-2">
        {/* 4격 요약 바 */}
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
              <p className="text-[10px] text-[#999891]">{g.label}</p>
              <p className={`text-sm font-black ${ g.j === "길" ? "text-amber-300" : "text-red-300" }`}>{g.val}</p>
              <p className={`text-[10px] font-bold ${ g.j === "길" ? "text-amber-400" : "text-red-400" }`}>{g.j}</p>
            </div>
          ))}
        </div>
        {/* 한자 오행 표시 */}
        <div className="flex gap-2">
          {[char1, char2].map((ch, idx) => (
            <div key={idx} className={`flex-1 rounded-lg border p-2 ${ ELEMENT_BG[ch.element] ?? "bg-black/[0.05] border-black/10" }`}>
              <div className="flex items-center gap-1">
                <span className="text-base font-black text-[#1a1a18]">{ch.hanja}</span>
                <span className="text-[11px] text-[#999891]">{ch.hangul}</span>
                <span className={`text-[11px] font-bold ml-auto ${ ELEMENT_COLOR[ch.element] ?? "text-[#999891]" }`}>{ch.element}({ch.strokes}획)</span>
              </div>
              <p className="text-[10px] text-[#999891] mt-0.5 leading-relaxed">{ch.meaning}</p>
            </div>
          ))}
        </div>
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
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-black/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-[#1a1a18] hover:bg-black/[0.06] min-w-[44px] min-h-[44px]"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className="text-base md:text-lg font-bold text-[#1a1a18]">
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
                  전통 작명 원리 기반
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1a18]">
                무운 작명소
              </h2>
              <p className="text-muted-foreground text-xs md:text-sm">
                아이의 사주에 맞는 한자 이름을 무료로 추천해드립니다
              </p>
              <p className="text-[10px] text-[#999891] mt-1">
                대법원 인명용 한자 기준 · 4격 수리 전부 길수 · 오행 균형 반영
              </p>
            </div>

            {/* 입력 폼 */}
            <Card className="glass-panel border-black/10 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-black/10 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-[#1a1a18] flex items-center gap-2 text-base md:text-lg">
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
                    <Label className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
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
                        <Label className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-400" />
                          성씨 원획수 직접 입력
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          max={40}
                          placeholder="예: 8 (金=8획)"
                          {...form.register("customStrokes")}
                          className="h-11 bg-black/[0.05] border-black/10 text-[#1a1a18] placeholder:text-[#999891] rounded-xl focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                        />
                        <p className="text-[11px] text-[#999891] leading-relaxed">
                          원획수(原劃數) 기준으로 입력해주세요.
                          변형 부수(氵→水 4획, 灬→火 4획 등)는 원래 획수로
                          계산합니다.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 성별 */}
                  <div className="space-y-1.5">
                    <Label className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
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
                      className="w-full h-11 bg-black/[0.05] p-1 rounded-xl border border-black/10 grid grid-cols-2 gap-1"
                    >
                      <ToggleGroupItem
                        value="male"
                        className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-[#1a1a18] text-[#5a5a56] transition-all font-medium text-sm"
                      >
                        남성
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="female"
                        className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-[#1a1a18] text-[#5a5a56] transition-all font-medium text-sm"
                      >
                        여성
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* 생년월일 + 시간 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
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
                      <Label className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
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
                    <Label className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
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
                      className="w-full h-11 bg-black/[0.05] p-1 rounded-xl border border-black/10 grid grid-cols-2 gap-1"
                    >
                      <ToggleGroupItem
                        value="solar"
                        className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-[#1a1a18] text-[#5a5a56] transition-all font-medium text-sm"
                      >
                        양력
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="lunar"
                        className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-[#1a1a18] text-[#5a5a56] transition-all font-medium text-sm"
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
                    <p className="text-[11px] text-[#999891] leading-relaxed">
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
                        이름 추천받기
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* STEP 섹션 */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold text-[#1a1a18]">
                  어떻게 이름을 추천하나요?
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  {
                    step: 1,
                    title: "사주팔자 분석",
                    desc: "아이가 태어난 연·월·일·시를 8개의 한자로 풀어냅니다. 목·화·토·금·수 다섯 가지 기운 중 어떤 것이 부족한지 파악하고, 이름은 그 부족한 기운을 채워주는 방향으로 짓습니다.",
                  },
                  {
                    step: 2,
                    title: "한자 선별",
                    desc: "대법원이 인명용으로 허가한 한자 중에서 뜻이 좋고 실제 이름에 쓰이는 한자만 추려낸 검증된 풀로 후보를 만듭니다. 부정적인 뜻, 어두운 의미의 한자는 구조적으로 배제됩니다.",
                  },
                  {
                    step: 3,
                    title: "81수리 검증",
                    desc: "성과 이름의 획수 조합에서 나오는 네 가지 격(원·형·이·정)을 81수리 길흉표와 대조합니다. 네 가지 격이 모두 길수인 조합만 최종 후보로 올라옵니다.",
                  },
                  {
                    step: 4,
                    title: "최종 추천",
                    desc: "오행 보완, 수리 길흉, 발음 조화, 성별 어울림을 종합 채점해 점수가 높은 순서로 이름 후보를 보여드립니다.",
                  },
                  {
                    step: 5,
                    title: "영어 이름 추천",
                    desc: "한자 이름이 정해지면, 발음과 느낌이 어울리는 영어 이름도 함께 추천해드립니다. 글로벌하게 살아갈 아이를 위해 한국 이름과 자연스럽게 어울리는 이름으로 골랐습니다.",
                  },
                ].map(({ step, title, desc }) => (
                  <div
                    key={step}
                    className="flex gap-3 p-3 rounded-xl bg-white border border-black/10"
                  >
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-amber-400">{step}</span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-[#1a1a18]">{title}</p>
                      <p className="text-xs text-[#999891] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3">
                <p className="text-xs text-[#999891] leading-relaxed text-center">
                  한자 이름부터 영어 이름까지, 아이의 이름을 한 번에 완성하세요.
                </p>
              </div>
            </div>

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
                  className="bg-black/[0.05] border-black/10 rounded-xl"
                >
                  <CardContent className="p-3 text-center space-y-1">
                    <div className="text-2xl">{f.icon}</div>
                    <p className="text-xs font-bold text-[#1a1a18]">{f.title}</p>
                    <p className="text-[10px] text-[#999891]">{f.desc}</p>
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
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-black/10 print:hidden">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="mr-2 text-[#1a1a18] hover:bg-black/[0.06] min-w-[44px] min-h-[44px]"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-base md:text-lg font-bold text-[#1a1a18]">
              작명 결과
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="border-black/10 text-[#1a1a18] hover:bg-black/[0.06] text-xs gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              PDF 저장
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-[#5a5a56] hover:text-[#1a1a18] hover:bg-black/[0.06] text-xs gap-1.5"
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
                    <p className="text-xs text-[#999891] mb-1">분석 대상 성씨</p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-amber-300">
                        {currentSurnameHangul}
                      </span>
                      {currentSurnameHanja && (
                        <span className="text-lg text-[#999891]">
                          {currentSurnameHanja}
                        </span>
                      )}
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                        {currentFamilyStrokes}획
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#999891] mb-1">후보 이름 수</p>
                    <p className="text-2xl font-black text-[#1a1a18]">
                      {candidates.length}
                      <span className="text-sm font-normal text-[#999891] ml-1">
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
                  <CardHeader className="border-b border-black/10 px-4 py-3 md:px-6 md:py-4">
                    <CardTitle className="text-[#1a1a18] flex items-center gap-2 text-base">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <Star className="w-4 h-4 text-amber-400" />
                      </div>
                      선택한 이름 — 4격 상세 분석
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 space-y-4">
                    {/* 이름 헤더 — 한자 대형 시각화 */}
                    <div className="text-center py-4 space-y-3">
                      {/* 한자 대형 표시 */}
                      <div className="flex items-center justify-center gap-1">
                        {/* 성씨 한자 */}
                        <div className="flex flex-col items-center">
                          <span className="text-5xl md:text-7xl font-black text-[#999891] leading-none">{currentSurnameHanja}</span>
                          <span className="text-xs text-[#1a1a18]/25 mt-1">{currentSurnameHangul}</span>
                        </div>
                        <span className="text-3xl text-[#1a1a18]/10 mx-1">·</span>
                        {/* 이름 첫째 한자 */}
                        <div className={`flex flex-col items-center rounded-2xl px-4 py-2 ${ ELEMENT_BG[selectedCandidate.char1.element] ?? 'bg-black/[0.05]' }`}>
                          <span className="text-5xl md:text-7xl font-black text-[#1a1a18] leading-none">{selectedCandidate.char1.hanja}</span>
                          <span className="text-xs text-[#5a5a56] mt-1">{selectedCandidate.char1.hangul}</span>
                        </div>
                        {/* 이름 둘째 한자 */}
                        <div className={`flex flex-col items-center rounded-2xl px-4 py-2 ${ ELEMENT_BG[selectedCandidate.char2.element] ?? 'bg-black/[0.05]' }`}>
                          <span className="text-5xl md:text-7xl font-black text-[#1a1a18] leading-none">{selectedCandidate.char2.hanja}</span>
                          <span className="text-xs text-[#5a5a56] mt-1">{selectedCandidate.char2.hangul}</span>
                        </div>
                      </div>
                      {/* 한글 이름 + 적합도 점수 */}
                      <div className="flex items-center justify-center gap-3">
                        <p className="text-2xl font-black text-[#1a1a18]">
                          {currentSurnameHangul}{selectedCandidate.hangulName}
                        </p>
                        <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${
                          selectedCandidate.fitnessScore >= 90 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          selectedCandidate.fitnessScore >= 80 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-black/06 text-[#999891] border border-black/10'
                        }`}>
                          <Star className="w-3.5 h-3.5" />
                          적합도 {selectedCandidate.fitnessScore.toFixed(1)}점
                        </div>
                      </div>
                      {/* 점수 설명 */}
                      <p className="text-[11px] text-[#999891]">
                        81수리 4격 길수 기본 70점 + 음운 조화 + 오행 보완 점수 반영
                      </p>
                    </div>

                    {/* 4격 카드 */}
                    <div className="grid grid-cols-2 gap-3">
                      <GyeokCard
                        label="원격 (元格) — 초년운"
                        number={selectedCandidate.suri.won}
                        description="이름 두 글자의 합 / 초년·건강·가정운"
                        gyeokType="won"
                      />
                      <GyeokCard
                        label="형격 (亨格) — 청년운"
                        number={selectedCandidate.suri.hyung}
                        description="성 + 이름 첫째자 / 청년·성공·사업운"
                        gyeokType="hyung"
                      />
                      <GyeokCard
                        label="이격 (利格) — 장년운"
                        number={selectedCandidate.suri.i}
                        description="성 + 이름 둘째자 / 장년·부부·사회운"
                        gyeokType="i"
                      />
                      <GyeokCard
                        label="정격 (貞格) — 총운"
                        number={selectedCandidate.suri.jung}
                        description="성 + 이름 전체 / 노년·총운"
                        gyeokType="jung"
                      />
                    </div>

                    {/* 이 이름을 추천하는 이유 */}
                    <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <p className="text-sm font-bold text-emerald-300">이 이름을 추천하는 이유</p>
                      </div>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 text-xs mt-0.5 flex-shrink-0">✓</span>
                          <p className="text-xs text-[#5a5a56] leading-relaxed">
                            <span className="text-[#1a1a18] font-semibold">원격 {selectedCandidate.suri.won}수</span>는 ‘{SURI_TABLE[selectedCandidate.suri.won]?.name ?? ''}’로, {getEasyExplain('won', selectedCandidate.suri.won, true)}
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 text-xs mt-0.5 flex-shrink-0">✓</span>
                          <p className="text-xs text-[#5a5a56] leading-relaxed">
                            <span className="text-[#1a1a18] font-semibold">형격 {selectedCandidate.suri.hyung}수</span>는 ‘{SURI_TABLE[selectedCandidate.suri.hyung]?.name ?? ''}’로, {getEasyExplain('hyung', selectedCandidate.suri.hyung, true)}
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 text-xs mt-0.5 flex-shrink-0">✓</span>
                          <p className="text-xs text-[#5a5a56] leading-relaxed">
                            <span className="text-[#1a1a18] font-semibold">이격 {selectedCandidate.suri.i}수</span>는 ‘{SURI_TABLE[selectedCandidate.suri.i]?.name ?? ''}’로, {getEasyExplain('i', selectedCandidate.suri.i, true)}
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 text-xs mt-0.5 flex-shrink-0">✓</span>
                          <p className="text-xs text-[#5a5a56] leading-relaxed">
                            <span className="text-[#1a1a18] font-semibold">정격 {selectedCandidate.suri.jung}수</span>는 ‘{SURI_TABLE[selectedCandidate.suri.jung]?.name ?? ''}’로, {getEasyExplain('jung', selectedCandidate.suri.jung, true)}
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 text-xs mt-0.5 flex-shrink-0">✓</span>
                          <p className="text-xs text-[#5a5a56] leading-relaxed">
                            <span className="text-[#1a1a18] font-semibold">{selectedCandidate.char1.hanja}({selectedCandidate.char1.hangul})</span>는 ‘{selectedCandidate.char1.meaning}’의 뜻을 담고 <span className={`font-semibold ${ELEMENT_COLOR[selectedCandidate.char1.element] ?? ''}`}>{selectedCandidate.char1.element}오행</span>을 품고 있으며, <span className="text-[#1a1a18] font-semibold">{selectedCandidate.char2.hanja}({selectedCandidate.char2.hangul})</span>는 ‘{selectedCandidate.char2.meaning}’의 뜻을 담고 <span className={`font-semibold ${ELEMENT_COLOR[selectedCandidate.char2.element] ?? ''}`}>{selectedCandidate.char2.element}오행</span>을 품고 있어 이름에 깊은 의미를 더합니다.
                          </p>
                        </li>
                      </ul>
                    </div>

                    {/* 음양 균형 분석 */}
                    {(() => {
                      // 한글 모음 음양 분류 (성명학 기준)
                      // 陽(양): ㅏ ㅑ ㅗ ㅛ ㅐ ㅒ — 밝고 적극적인 소리
                      // 陰(음): ㅓ ㅕ ㅜ ㅠ ㅡ ㅣ ㅔ ㅖ ㅚ ㅘ ㅙ ㅝ ㅞ ㅟ ㅢ — 어둡고 내향적인 소리
                      const YANG_VOWELS = new Set(['ㅏ','ㅑ','ㅗ','ㅛ','ㅐ','ㅒ']);
                      const getYinYang = (hangul: string): '양' | '음' | '중' => {
                        const code = hangul.charCodeAt(0) - 0xAC00;
                        if (code < 0 || code > 11171) return '중';
                        const jungIdx = Math.floor(code / 28) % 21;
                        const JUNGSEONG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
                        const vowel = JUNGSEONG[jungIdx];
                        return YANG_VOWELS.has(vowel) ? '양' : '음';
                      };
                      const surnameYY = getYinYang(currentSurnameHangul.slice(-1));
                      const name1YY  = getYinYang(selectedCandidate.char1.hangul);
                      const name2YY  = getYinYang(selectedCandidate.char2.hangul);
                      const yangCount = [surnameYY, name1YY, name2YY].filter(y => y === '양').length;
                      const yinCount  = [surnameYY, name1YY, name2YY].filter(y => y === '음').length;
                      const isBalanced = Math.abs(yangCount - yinCount) <= 1;
                      const chars = [
                        { hangul: currentSurnameHangul.slice(-1), hanja: currentSurnameHanja.slice(-1), label: '성', yy: surnameYY },
                        { hangul: selectedCandidate.char1.hangul, hanja: selectedCandidate.char1.hanja, label: '이름1', yy: name1YY },
                        { hangul: selectedCandidate.char2.hangul, hanja: selectedCandidate.char2.hanja, label: '이름2', yy: name2YY },
                      ];
                      return (
                        <div className="rounded-xl bg-purple-500/5 border border-purple-500/15 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-white to-gray-800 border border-black/10" />
                              <p className="text-sm font-bold text-purple-300">음양 균형 분석</p>
                            </div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              isBalanced ? 'bg-emerald-500/20 text-emerald-300' : 'bg-orange-500/20 text-orange-300'
                            }`}>
                              {isBalanced ? '균형 좋음' : '편중 주의'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {chars.map((ch, idx) => (
                              <div key={idx} className={`flex-1 rounded-xl border p-3 text-center ${
                                ch.yy === '양' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-blue-500/10 border-blue-500/20'
                              }`}>
                                <p className="text-2xl font-black text-[#1a1a18]">{ch.hanja}</p>
                                <p className="text-xs text-[#999891] mt-0.5">{ch.hangul}</p>
                                <div className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                  ch.yy === '양' ? 'bg-orange-500/20 text-orange-300' : 'bg-blue-500/20 text-blue-300'
                                }`}>
                                  {ch.yy === '양' ? '☀ 양(陽)' : '☾ 음(陰)'}
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-[11px] text-[#999891] leading-relaxed">
                            {isBalanced
                              ? `양(陽) ${yangCount}자 · 음(陰) ${yinCount}자로 음양이 균형을 이루어 조화로운 이름입니다. 밝고 활발한 기운과 차분하고 깊은 기운이 어우러집니다.`
                              : yangCount > yinCount
                                ? `양(陽) ${yangCount}자 · 음(陰) ${yinCount}자로 양기가 강합니다. 활발하고 적극적인 성격을 지니나 차분함을 보완하면 더욱 좋습니다.`
                                : `음(陰) ${yinCount}자 · 양(陽) ${yangCount}자로 음기가 강합니다. 내향적이고 섬세한 성격을 지니나 활발함을 보완하면 더욱 좋습니다.`
                            }
                          </p>
                        </div>
                      );
                    })()}

                    {/* 한자 상세 */}
                    <div className="rounded-xl bg-white border border-black/10 p-4 space-y-3">
                      <p className="text-xs font-bold text-[#5a5a56] uppercase tracking-wider">
                        한자 풀이
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          selectedCandidate.char1,
                          selectedCandidate.char2,
                        ].map((ch, idx) => (
                          <div
                            key={idx}
                            className={`rounded-xl border p-3 ${ELEMENT_BG[ch.element] ?? "bg-black/[0.05] border-black/10"}`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl font-black text-[#1a1a18]">
                                {ch.hanja}
                              </span>
                              <div>
                                <p className="text-sm font-bold text-[#1a1a18]">
                                  {ch.hangul}
                                </p>
                                <p
                                  className={`text-xs font-bold ${ELEMENT_COLOR[ch.element] ?? "text-[#999891]"}`}
                                >
                                  {ch.element}오행 · {ch.strokes}획
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-[#999891]">
                              {ch.meaning}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 영어 이름 추천 */}
                    {selectedCandidate.englishNames && selectedCandidate.englishNames.length > 0 && (
                      <div className="rounded-xl bg-blue-500/5 border border-blue-500/15 p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-400" />
                          <p className="text-sm font-bold text-blue-300">영어 이름 추천</p>
                          <span className="text-[11px] text-[#999891] ml-auto">한자 의미 · 발음 기반</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedCandidate.englishNames.map((en, idx) => (
                            <div key={idx} className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-center">
                              <p className="text-base font-black text-[#1a1a18]">{en.name}</p>
                              <p className="text-[10px] text-blue-300/70 mt-0.5">{en.reason}</p>
                              {en.keyword && (
                                <p className="text-[10px] text-[#999891] mt-0.5">‘{en.keyword}’ 의미</p>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-[#999891] leading-relaxed">
                          한자 이름의 의미와 발음을 바탕으로 어울리는 영어 이름을 추천합니다. 국제적인 환경에서도 자연스러운 이름으로 불릴 수 있습니다.
                        </p>
                      </div>
                    )}

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
            <Card className="glass-panel border-black/10 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-black/10 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-[#1a1a18] flex items-center gap-2 text-base">
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
                    <XCircle className="w-12 h-12 text-[#1a1a18]/20 mx-auto" />
                    <p className="text-[#999891] text-sm">
                      조건을 만족하는 이름 후보가 없습니다.
                    </p>
                    <p className="text-[#999891] text-xs">
                      Supabase 한자 데이터베이스에 해당 획수의 한자가 없을 수
                      있습니다. 관리자에게 문의해주세요.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="border-black/10 text-[#1a1a18] hover:bg-black/[0.06] mt-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                      다시 분석하기
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-3 flex items-start gap-2 mb-2">
                      <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-300/80 leading-relaxed">
                        아래 이름을 클릭하면 ‘이 이름을 추천하는 이유’와 한자 풀이, 영어 이름 추천이 표시됩니다.
                      </p>
                    </div>
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

          {/* 다시 분석 버튼 (성씨 변경 불가 안내 제거) */}
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
