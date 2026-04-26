import { useState, useEffect, useRef, useMemo } from "react";
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Info, Share2, Sparkles, RefreshCcw, Zap, User, Activity, ScrollText, Calendar, Clock, TrendingUp, ArrowRight, ChevronRight } from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";
import { Link, useLocation } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BirthTimeSelect } from "@/components/ui/birth-time-select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  calculateSaju, SajuResult, FiveElement,
  STEM_YIN_YANG, STEM_ELEMENTS, BRANCH_ELEMENTS,
  HEAVENLY_STEMS, EARTHLY_BRANCHES,
  type HeavenlyStem, type EarthlyBranch,
} from "@/lib/saju";
import { convertToSolarDate } from "@/lib/lunar-converter";
import ManselyeokContent from "@/components/ManselyeokContent";
import { getHeroBirthForForm } from "@/lib/user-birth";
import {
  ELEMENT_READINGS, BRANCH_READINGS, STEM_READINGS,
  TEN_GOD_MEANINGS, withReading,
} from "@/lib/saju-reading";
import { SOLAR_TERMS_BY_YEAR } from "@/lib/solar-terms-data";

// ─────────────────────────────────────────────
// 폼 스키마
// ─────────────────────────────────────────────
const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime: z.string(),
  birthTimeUnknown: z.boolean().default(false),
  calendarType: z.enum(["solar", "lunar"]),
  isLeapMonth: z.boolean().default(false),
});
type FormValues = z.infer<typeof formSchema>;

// ─────────────────────────────────────────────
// 오행 색상 헬퍼
// ─────────────────────────────────────────────
const getElementColor = (element: FiveElement) => {
  switch (element) {
    case '木': return 'text-green-600 border-green-400/30 bg-green-400/10';
    case '火': return 'text-red-600 border-red-400/30 bg-red-400/10';
    case '土': return 'text-yellow-600 border-yellow-400/30 bg-yellow-400/10';
    case '金': return 'text-[#6a6a66] border-[#6a6a66]/30 bg-[#6a6a66]/10';
    case '水': return 'text-blue-600 border-blue-400/30 bg-blue-400/10';
    default: return 'text-[#1a1a18] border-black/15 bg-black/[0.06]';
  }
};

const ELEMENT_HEX: Record<string, string> = {
  '木': '#22c55e', '火': '#ef4444', '土': '#eab308', '金': '#8b8b87', '水': '#3b82f6',
};

// ─────────────────────────────────────────────
// 동물 띠
// ─────────────────────────────────────────────
const ZODIAC_ANIMAL: Record<string, string> = {
  '子': '쥐', '丑': '소', '寅': '호랑이', '卯': '토끼', '辰': '용', '巳': '뱀',
  '午': '말', '未': '양', '申': '원숭이', '酉': '닭', '戌': '개', '亥': '돼지',
};

// ─────────────────────────────────────────────
// 12운성 맵
// ─────────────────────────────────────────────
const TWELVE_CYCLE_MAP: Record<string, Record<string, string>> = {
  '甲': { '亥': '장생', '子': '목욕', '丑': '관대', '寅': '건록', '卯': '제왕', '辰': '쇠', '巳': '병', '午': '사', '未': '묘', '申': '절', '酉': '태', '戌': '양' },
  '乙': { '午': '장생', '巳': '목욕', '辰': '관대', '卯': '건록', '寅': '제왕', '丑': '쇠', '子': '병', '亥': '사', '戌': '묘', '酉': '절', '申': '태', '未': '양' },
  '丙': { '寅': '장생', '卯': '목욕', '辰': '관대', '巳': '건록', '午': '제왕', '未': '쇠', '申': '병', '酉': '사', '戌': '묘', '亥': '절', '子': '태', '丑': '양' },
  '丁': { '酉': '장생', '申': '목욕', '未': '관대', '午': '건록', '巳': '제왕', '辰': '쇠', '卯': '병', '寅': '사', '丑': '묘', '子': '절', '亥': '태', '戌': '양' },
  '戊': { '寅': '장생', '卯': '목욕', '辰': '관대', '巳': '건록', '午': '제왕', '未': '쇠', '申': '병', '酉': '사', '戌': '묘', '亥': '절', '子': '태', '丑': '양' },
  '己': { '酉': '장생', '申': '목욕', '未': '관대', '午': '건록', '巳': '제왕', '辰': '쇠', '卯': '병', '寅': '사', '丑': '묘', '子': '절', '亥': '태', '戌': '양' },
  '庚': { '巳': '장생', '午': '목욕', '未': '관대', '申': '건록', '酉': '제왕', '戌': '쇠', '亥': '병', '子': '사', '丑': '묘', '寅': '절', '卯': '태', '辰': '양' },
  '辛': { '子': '장생', '亥': '목욕', '戌': '관대', '酉': '건록', '申': '제왕', '未': '쇠', '午': '병', '巳': '사', '辰': '묘', '卯': '절', '寅': '태', '丑': '양' },
  '壬': { '申': '장생', '酉': '목욕', '戌': '관대', '亥': '건록', '子': '제왕', '丑': '쇠', '寅': '병', '卯': '사', '辰': '묘', '巳': '절', '午': '태', '未': '양' },
  '癸': { '卯': '장생', '寅': '목욕', '丑': '관대', '子': '건록', '亥': '제왕', '戌': '쇠', '酉': '병', '申': '사', '未': '묘', '午': '절', '巳': '태', '辰': '양' },
};

// ─────────────────────────────────────────────
// 60갑자
// ─────────────────────────────────────────────
const SIXTY_GAPJA: Array<[string, string]> = Array.from({ length: 60 }, (_, i) => [
  HEAVENLY_STEMS[i % 10],
  EARTHLY_BRANCHES[i % 12],
]);

function gapjaIndex(stem: string, branch: string): number {
  return SIXTY_GAPJA.findIndex(([s, b]) => s === stem && b === branch);
}

// ─────────────────────────────────────────────
// 십신 계산 (로컬)
// ─────────────────────────────────────────────
function calcTenGod(targetStem: string, dayStem: string): string {
  const tElem = STEM_ELEMENTS[targetStem as HeavenlyStem];
  const dElem = STEM_ELEMENTS[dayStem as HeavenlyStem];
  const tYang = STEM_YIN_YANG[targetStem as HeavenlyStem];
  const dYang = STEM_YIN_YANG[dayStem as HeavenlyStem];
  const same = tYang === dYang;

  const GENERATES: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const CONTROLS: Record<string, string> = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };

  if (tElem === dElem) return same ? '비견' : '겁재';
  if (GENERATES[dElem] === tElem) return same ? '식신' : '상관';
  if (CONTROLS[dElem] === tElem) return same ? '편재' : '정재';
  if (CONTROLS[tElem] === dElem) return same ? '편관' : '정관';
  if (GENERATES[tElem] === dElem) return same ? '편인' : '정인';
  return '비견';
}

// ─────────────────────────────────────────────
// 신강/신약 + 격국 + 용신 분석
// ─────────────────────────────────────────────
function analyzeGangYak(result: SajuResult) {
  const dayElem = result.dayPillar.stemElement;
  const GENERATES: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const GENERATED_BY: Record<string, string> = { '火': '木', '土': '火', '金': '土', '水': '金', '木': '水' };
  const CONTROLS: Record<string, string> = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
  const CONTROLLED_BY: Record<string, string> = { '土': '木', '金': '火', '水': '土', '木': '金', '火': '水' };

  const allElems = [
    result.yearPillar.stemElement, result.yearPillar.branchElement,
    result.monthPillar.stemElement, result.monthPillar.branchElement,
    result.dayPillar.branchElement,
    result.hourPillar.stemElement, result.hourPillar.branchElement,
  ];

  let support = 0, drain = 0;
  allElems.forEach(e => {
    if (e === dayElem) support += 2;
    else if (e === GENERATED_BY[dayElem]) support += 1.5;
    else if (e === GENERATES[dayElem]) drain += 1;
    else if (e === CONTROLS[dayElem]) drain += 1;
    else if (e === CONTROLLED_BY[dayElem]) drain += 1.5;
  });

  const total = support + drain;
  const score = total > 0 ? Math.round((support / total) * 100) : 50;
  const gangYak: '신강' | '중화' | '신약' = score > 60 ? '신강' : score >= 40 ? '중화' : '신약';

  const geokGukMap: Record<string, string> = {
    '비견': '건록격', '겁재': '양인격', '식신': '식신격', '상관': '상관격',
    '편재': '편재격', '정재': '정재격', '편관': '칠살격', '정관': '정관격',
    '편인': '편인격', '정인': '정인격',
  };
  const geokGuk = result.monthPillar.tenGod ? (geokGukMap[result.monthPillar.tenGod] || '외격') : '외격';

  let yongshinElements: FiveElement[];
  let yongshinDesc: string;
  if (gangYak === '신강') {
    const cands = [GENERATES[dayElem], CONTROLS[dayElem], CONTROLLED_BY[dayElem]] as FiveElement[];
    yongshinElements = cands.filter((e, i, a) => a.indexOf(e) === i);
    yongshinDesc = `일간의 기운이 왕성합니다. 식상(${ELEMENT_READINGS[GENERATES[dayElem]]})·재성(${ELEMENT_READINGS[CONTROLS[dayElem]]})·관성(${ELEMENT_READINGS[CONTROLLED_BY[dayElem]]})이 균형을 맞춰줍니다.`;
  } else if (gangYak === '신약') {
    const cands = [GENERATED_BY[dayElem], dayElem] as FiveElement[];
    yongshinElements = cands.filter((e, i, a) => a.indexOf(e) === i);
    yongshinDesc = `일간의 기운이 약합니다. 인성(${ELEMENT_READINGS[GENERATED_BY[dayElem]]})과 비겁(${ELEMENT_READINGS[dayElem]})의 도움이 필요합니다.`;
  } else {
    yongshinElements = [GENERATES[dayElem] as FiveElement];
    yongshinDesc = `오행이 비교적 균형 잡혀 있습니다. 식상(${ELEMENT_READINGS[GENERATES[dayElem]]})이 기운의 흐름을 부드럽게 이어줍니다.`;
  }

  return { score, gangYak, geokGuk, yongshinElements, yongshinDesc };
}

// ─────────────────────────────────────────────
// 대운 계산
// ─────────────────────────────────────────────
function calculateDaewun(result: SajuResult) {
  const isYangYear = STEM_YIN_YANG[result.yearPillar.stem];
  const isForward = (isYangYear && result.gender === 'male') || (!isYangYear && result.gender === 'female');

  const birthYear = result.birthDate.getFullYear();
  const birthMonth = result.birthDate.getMonth() + 1;
  const birthDay = result.birthDate.getDate();

  const terms = SOLAR_TERMS_BY_YEAR[birthYear];
  const termForMonth = terms?.find(t => t.month === birthMonth);
  const termDay = termForMonth?.day ?? 6;

  let daysToTerm: number;
  if (isForward) {
    if (birthDay < termDay) {
      daysToTerm = termDay - birthDay;
    } else {
      const nextM = birthMonth < 12 ? birthMonth + 1 : 1;
      const nextY = birthMonth < 12 ? birthYear : birthYear + 1;
      const nextTerms = SOLAR_TERMS_BY_YEAR[nextY];
      const nextTermDay = nextTerms?.find(t => t.month === nextM)?.day ?? 6;
      const daysInMonth = new Date(birthYear, birthMonth, 0).getDate();
      daysToTerm = (daysInMonth - birthDay) + nextTermDay;
    }
  } else {
    if (birthDay >= termDay) {
      daysToTerm = birthDay - termDay;
    } else {
      const prevM = birthMonth > 1 ? birthMonth - 1 : 12;
      const prevY = birthMonth > 1 ? birthYear : birthYear - 1;
      const prevTerms = SOLAR_TERMS_BY_YEAR[prevY];
      const prevTermDay = prevTerms?.find(t => t.month === prevM)?.day ?? 6;
      const prevMonthDays = new Date(birthYear, birthMonth - 1, 0).getDate();
      daysToTerm = (prevMonthDays - prevTermDay) + birthDay;
    }
  }

  const startAge = Math.max(1, Math.ceil(daysToTerm / 3));
  const monthIdx = gapjaIndex(result.monthPillar.stem, result.monthPillar.branch);

  const pillars = Array.from({ length: 8 }, (_, i) => {
    const idx = isForward ? (monthIdx + i + 1) % 60 : ((monthIdx - i - 1 + 60) % 60);
    const [stem, branch] = SIXTY_GAPJA[idx];
    const tenGod = calcTenGod(stem, result.dayPillar.stem);
    return {
      stem,
      branch,
      stemElement: STEM_ELEMENTS[stem as HeavenlyStem],
      branchElement: BRANCH_ELEMENTS[branch as EarthlyBranch],
      startAge: startAge + i * 10,
      tenGod,
    };
  });

  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;
  let currentIdx = -1;
  for (let i = pillars.length - 1; i >= 0; i--) {
    if (pillars[i].startAge <= currentAge) { currentIdx = i; break; }
  }

  return { startAge, isForward, pillars, currentIdx };
}

// ─────────────────────────────────────────────
// 십성 분포 집계
// ─────────────────────────────────────────────
const TEN_GOD_CATEGORY: Record<string, string> = {
  '비견': '비겁', '겁재': '비겁',
  '식신': '식상', '상관': '식상',
  '편재': '재성', '정재': '재성',
  '편관': '관성', '정관': '관성',
  '편인': '인성', '정인': '인성',
};
const TEN_GOD_CAT_COLOR: Record<string, string> = {
  '비겁': '#10b981', '식상': '#3b82f6', '재성': '#f59e0b', '관성': '#ef4444', '인성': '#8b5cf6',
};
const TEN_GOD_CAT_DESC: Record<string, string> = {
  '비겁': '자아·형제·경쟁',
  '식상': '표현·재능·자식',
  '재성': '재물·부친·실용',
  '관성': '명예·직업·규율',
  '인성': '학문·모친·보호',
};

// ─────────────────────────────────────────────
// 컴포넌트
// ─────────────────────────────────────────────
export default function Manselyeok() {
  useCanonical('/manselyeok');

  const [result, setResult] = useState<SajuResult | null>(null);
  const [, setLocation] = useLocation();
  const fiveElementRef = useRef<HTMLDivElement>(null);
  const [barsAnimated, setBarsAnimated] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "2000-01-01",
      birthTime: "12:00",
      birthTimeUnknown: false,
      calendarType: "solar",
      isLeapMonth: false,
    },
  });

  // 분석 캐시
  const analysis = useMemo(() => result ? analyzeGangYak(result) : null, [result]);
  const daewunData = useMemo(() => result ? calculateDaewun(result) : null, [result]);

  // 오행 바 애니메이션: result 변경 시 리셋 후 200ms 뒤 true
  useEffect(() => {
    setBarsAnimated(false);
    if (!result) return;
    const timer = setTimeout(() => setBarsAnimated(true), 200);
    return () => clearTimeout(timer);
  }, [result]);

  // 생년월일·성별·음양력 변경 시 기존 결과 초기화
  const watchedBirthDate = form.watch("birthDate");
  const watchedGender = form.watch("gender");
  const watchedCalendarType = form.watch("calendarType");
  useEffect(() => {
    if (!initialLoadDone) return;
    setResult(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedBirthDate, watchedGender, watchedCalendarType]);

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const safeData = {
          ...parsed,
          birthDate: /^\d{4}-\d{2}-\d{2}$/.test(parsed.birthDate) ? parsed.birthDate : "2000-01-01",
          birthTime: /^\d{2}:\d{2}$/.test(parsed.birthTime) ? parsed.birthTime : "12:00",
        };
        form.reset(safeData);
        setTimeout(() => setInitialLoadDone(true), 100);
        return;
      } catch {}
    }
    const heroBirth = getHeroBirthForForm();
    if (heroBirth) {
      form.setValue("birthDate", heroBirth.birthDate);
      form.setValue("calendarType", heroBirth.calendarType);
      form.setValue("birthTime", heroBirth.birthTime);
      form.setValue("birthTimeUnknown", heroBirth.birthTimeUnknown);
    }
    setTimeout(() => setInitialLoadDone(true), 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: FormValues) => {
    let birthDateStr = data.birthDate;
    if (typeof birthDateStr === 'string') {
      birthDateStr = birthDateStr.replace(/[./]/g, '-').replace(/\s/g, '');
      if (/^\d{8}$/.test(birthDateStr)) {
        birthDateStr = `${birthDateStr.substring(0, 4)}-${birthDateStr.substring(4, 6)}-${birthDateStr.substring(6, 8)}`;
      }
    } else if (birthDateStr instanceof Date) {
      birthDateStr = (birthDateStr as Date).toISOString().split('T')[0];
    }
    const dateParts = String(birthDateStr).match(/\d+/g);
    let finalDateStr = "2000-01-01";
    if (dateParts && dateParts.length >= 3) {
      finalDateStr = `${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
    }
    localStorage.setItem("muun_user_data", JSON.stringify(data));
    const params = new URLSearchParams(window.location.search);
    if (params.get("redirect") === "daily-fortune") { setLocation("/daily-fortune"); return; }
    const rawTime = data.birthTimeUnknown ? "12:00" : data.birthTime;
    const time = /^\d{2}:\d{2}$/.test(rawTime) ? rawTime : "12:00";
    const date = convertToSolarDate(finalDateStr, time, data.calendarType, data.isLeapMonth);
    const sajuResult = calculateSaju(date, data.gender);
    setResult(sajuResult);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const commonMaxWidth = "w-full";

  return (
    <div className="mu-subpage-screen min-h-screen bg-[#F5F4F8] text-foreground pb-20 antialiased">
      <Helmet>
        {result && analysis ? (() => {
          const name = form.getValues('name');
          const ilgan = `${STEM_READINGS[result.dayPillar.stem]}(${result.dayPillar.stem})`;
          const yongsin = analysis.yongshinElements.map(e => ELEMENT_READINGS[e]).join('·');
          const dynamicTitle = `${name}님의 사주팔자 만세력 분석 | 무운`;
          const dynamicDesc = `${name}님의 사주팔자 - 일간 ${ilgan}, ${analysis.gangYak}, 용신 ${yongsin}. 무운에서 무료로 확인하세요.`;
          return (
            <>
              <title>{dynamicTitle}</title>
              <meta name="description" content={dynamicDesc} />
              <meta property="og:title" content={dynamicTitle} />
              <meta property="og:description" content={dynamicDesc} />
              <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"WebPage","name":dynamicTitle,"description":dynamicDesc,"url":"https://muunsaju.com/manselyeok"})}</script>
            </>
          );
        })() : (
          <>
            <title>무료 만세력 - 사주팔자 분석 | 무운</title>
            <meta name="description" content="회원가입 없이 생년월일시만 입력하면 바로 확인하는 무료 만세력 분석. 사주팔자, 오행 구성, 천간지지를 개인정보 저장 없이 100% 무료로 제공합니다." />
            <meta property="og:title" content="무료 만세력 - 사주팔자 분석 | 무운" />
            <meta property="og:description" content="회원가입 없이 생년월일시만 입력하면 바로 확인하는 무료 만세력 분석. 사주팔자, 오행 구성, 천간지지를 개인정보 저장 없이 100% 무료로 제공합니다." />
            <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"WebPage","name":"무료 만세력 - 사주팔자 분석 | 무운","description":"회원가입 없이 생년월일시만 입력하면 바로 확인하는 무료 만세력 분석. 사주팔자, 오행 구성, 천간지지를 개인정보 저장 없이 100% 무료로 제공합니다.","url":"https://muunsaju.com/manselyeok"})}</script>
          </>
        )}
        <meta name="keywords" content="만세력, 무료만세력, 사주팔자, 오행분석, 천간지지, 무료사주, 만세력조회, 사주보기" />
        <link rel="canonical" href="https://muunsaju.com/manselyeok" />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:url" content="https://muunsaju.com/manselyeok" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"홈","item":"https://muunsaju.com"},{"@type":"ListItem","position":2,"name":"만세력","item":"https://muunsaju.com/manselyeok"}]})}</script>
        <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"Service","name":"무료 만세력 조회","description":"사주팔자 기반의 무료 만세력 분석 서비스","provider":{"@type":"Organization","name":"무운 (MuUn)","url":"https://muunsaju.com"},"url":"https://muunsaju.com/manselyeok","serviceType":"만세력","areaServed":"KR","isAccessibleForFree":true,"offers":{"@type":"Offer","price":"0","priceCurrency":"KRW"}})}</script>
      </Helmet>

      {form.watch("birthTimeUnknown") && (
        <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 relative z-50">
          <p className="text-[10px] md:text-xs text-primary text-center font-medium">
            태어난 시간을 제외한 삼주 분석 결과입니다
          </p>
        </div>
      )}

      <header className="mu-subpage-header sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="w-full px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" className="mr-2 text-[#1a1a18] hover:bg-black/[0.06] -ml-2 flex items-center gap-1 text-sm font-medium">
                <ChevronLeft className="h-5 w-5" />
                <span>홈</span>
              </Button>
            </Link>
            <h1 className="text-base font-bold text-[#1a1a18]">만세력</h1>
          </div>
          {result && (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon"
                className="text-[#1a1a18] hover:bg-black/[0.06] min-w-[44px] min-h-[44px]"
                onClick={() => setResult(null)}>
                <RefreshCcw className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon"
                className="text-emerald-400 min-w-[44px] min-h-[44px]"
                onClick={() => shareContent({ title: '무운 만세력 결과', text: `${form.getValues('name')}님의 사주팔자 만세력 결과를 확인해보세요!`, page: 'manselyeok', buttonType: 'icon' })}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="mu-service-main relative z-10 w-full px-4 py-5">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`${commonMaxWidth} space-y-5`}
            >
              {/* Hero Section */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-500/20 text-emerald-600 text-xs font-medium">
                  <Activity className="w-3 h-3" />
                  <span>정통 만세력 분석</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1a18]">만세력</h2>
                <p className="text-muted-foreground text-xs md:text-sm">
                  정확한 사주팔자 분석을 위해 태어난 시간을 입력해주세요
                </p>
              </div>

              {/* Input Form Card */}
              <Card className="bg-white rounded-2xl shadow-sm border border-black/[0.06] overflow-hidden">
                <CardHeader className="border-b border-black/[0.06] px-4 py-3 md:px-6">
                  <CardTitle className="text-[#1a1a18] flex items-center gap-2 text-base">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-400" />
                    </div>
                    사용자 정보 입력
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-emerald-400" />이름
                        </Label>
                        <Input id="name" placeholder="이름" {...form.register("name")}
                          className="h-11 bg-[#F7F5F3] border-[#E8E5E0] text-[#1a1a18] placeholder:text-[#b0ada6] rounded-xl focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm" />
                        {form.formState.errors.name && (
                          <p className="text-destructive text-xs font-medium">{form.formState.errors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />성별
                        </Label>
                        <ToggleGroup type="single" value={form.watch("gender")}
                          onValueChange={(v) => { if (v) form.setValue("gender", v as "male" | "female"); }}
                          className="w-full h-11 grid grid-cols-2 gap-[3px] bg-[#EDE8E8] rounded-xl p-[3px]">
                          <ToggleGroupItem value="male"
                            className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-emerald-600 data-[state=on]:shadow-sm text-[#5a5a56] transition-all font-medium text-sm">남성</ToggleGroupItem>
                          <ToggleGroupItem value="female"
                            className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-emerald-600 data-[state=on]:shadow-sm text-[#5a5a56] transition-all font-medium text-sm">여성</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthDate" className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />생년월일
                        </Label>
                        <DatePickerInput id="birthDate" {...form.register("birthDate")}
                          value={form.watch("birthDate")} accentColor="emerald" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="birthTime" className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />태어난 시간
                        </Label>
                        <BirthTimeSelect
                          value={form.watch("birthTime")}
                          onChange={(val) => form.setValue("birthTime", val)}
                          onUnknownChange={(isUnknown) => { form.setValue("birthTimeUnknown", isUnknown); if (isUnknown) form.setValue("birthTime", "12:00"); }}
                          isUnknown={form.watch("birthTimeUnknown")}
                          accentClass="focus:ring-emerald-500/50 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
                        <ScrollText className="w-3.5 h-3.5 text-emerald-400" />날짜 구분
                      </Label>
                      <ToggleGroup type="single" value={form.watch("calendarType")}
                        onValueChange={(v) => { if (v) { form.setValue("calendarType", v as "solar" | "lunar"); if (v === "solar") form.setValue("isLeapMonth", false); } }}
                        className="w-full md:w-48 h-11 grid grid-cols-2 gap-[3px] bg-[#EDE8E8] rounded-xl p-[3px]">
                        <ToggleGroupItem value="solar"
                          className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-emerald-600 data-[state=on]:shadow-sm text-[#5a5a56] transition-all font-medium text-sm">양력</ToggleGroupItem>
                        <ToggleGroupItem value="lunar"
                          className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-emerald-600 data-[state=on]:shadow-sm text-[#5a5a56] transition-all font-medium text-sm">음력</ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    {form.watch("calendarType") === "lunar" && (
                      <div className="flex items-center gap-2 px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <Checkbox checked={form.watch("isLeapMonth") || false}
                            onCheckedChange={(checked) => form.setValue("isLeapMonth", checked === true)}
                            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500" />
                          <span className="text-sm text-[#1a1a18] group-hover:text-emerald-400 transition-colors">윤달(Leap Month)인 경우 체크</span>
                        </label>
                      </div>
                    )}

                    <Button type="submit"
                      style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                      className="w-full h-12 text-white font-bold text-sm rounded-xl shadow-sm transition-all hover:opacity-90 active:scale-[0.98]">
                      <Activity className="w-4 h-4 mr-2" />만세력 분석하기
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Feature Cards */}
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {[
                  { icon: <ScrollText className="w-4 h-4 text-emerald-500" />, label: '사주팔자', bg: 'bg-emerald-500/10' },
                  { icon: <Activity className="w-4 h-4 text-teal-600" />, label: '오행 분석', bg: 'bg-teal-500/10' },
                  { icon: <Zap className="w-4 h-4 text-cyan-600" />, label: '대운 세운', bg: 'bg-cyan-500/10' },
                  { icon: <Info className="w-4 h-4 text-green-600" />, label: '상세 해석', bg: 'bg-green-500/10' },
                ].map((item) => (
                  <Card key={item.label} className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                    <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                      <div className={`w-8 h-8 md:w-9 md:h-9 rounded-lg ${item.bg} flex items-center justify-center mx-auto`}>
                        {item.icon}
                      </div>
                      <p className="text-[10px] md:text-xs font-medium text-[#1a1a18]">{item.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <ManselyeokContent />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`${commonMaxWidth} space-y-5 md:space-y-6`}
            >
              {/* ═══════════════════════════════════
                  1. 히어로 섹션
              ═══════════════════════════════════ */}
              <div
                className="rounded-2xl p-6 md:p-8 text-white overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg, #0a1f1a 0%, #0d2d22 100%)' }}
              >
                {/* 배경 장식 */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                  style={{ background: 'radial-gradient(circle, #34d399, transparent)', transform: 'translate(30%, -30%)' }} />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10"
                  style={{ background: 'radial-gradient(circle, #10b981, transparent)', transform: 'translate(-30%, 30%)' }} />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{form.getValues('name')}님의 사주</h2>
                      <p className="text-emerald-300 text-sm">
                        {result.birthDate.getFullYear()}년 {result.birthDate.getMonth() + 1}월 {result.birthDate.getDate()}일
                        {' · '}
                        {ZODIAC_ANIMAL[result.yearPillar.branch]} 띠
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-medium">
                      일간 {withReading(result.dayPillar.stem)}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-medium">
                      {analysis?.geokGuk}
                    </span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      analysis?.gangYak === '신강'
                        ? 'bg-red-500/20 border border-red-400/30 text-red-200'
                        : analysis?.gangYak === '신약'
                        ? 'bg-blue-500/20 border border-blue-400/30 text-blue-200'
                        : 'bg-white/10 border border-white/20 text-white/80'
                    }`}>
                      {analysis?.gangYak}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-medium">
                      용신 {analysis?.yongshinElements.map(e => ELEMENT_READINGS[e]).join('·')}
                    </span>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════
                  2. 사주팔자 차트 (개선)
              ═══════════════════════════════════ */}
              <Card className="bg-white border border-black/[0.06] rounded-2xl shadow-sm overflow-hidden">
                <CardHeader className="border-b border-black/[0.06] px-4 py-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-emerald-600">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <ScrollText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </div>
                    사주팔자 (四柱八字)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {(() => {
                    const pillars = [
                      { label: '시주', sub: '말년·자식', pillar: result.hourPillar },
                      { label: '일주', sub: '본인·배우자', pillar: result.dayPillar },
                      { label: '월주', sub: '청년·부모', pillar: result.monthPillar },
                      { label: '년주', sub: '초년·조상', pillar: result.yearPillar },
                    ];
                    return (
                      <div className="grid grid-cols-4 gap-2">
                        {pillars.map((item, i) => {
                          const isIlju = i === 1;
                          const tenGodLabel = isIlju
                            ? '일간'
                            : (item.pillar.tenGod ? (TEN_GOD_MEANINGS[item.pillar.tenGod]?.name || item.pillar.tenGod) : '—');
                          const twelveStage = TWELVE_CYCLE_MAP[item.pillar.stem]?.[item.pillar.branch] || '';
                          return (
                            <div key={item.label} className="text-center space-y-1">
                              {/* 기둥 레이블 */}
                              <p className="text-[10px] text-emerald-600 font-bold">{item.label}</p>
                              <p className="text-[9px] text-[#999891]">{item.sub}</p>

                              {/* 십성 */}
                              <div className="text-[9px] md:text-[10px] font-medium text-[#10b981] h-4 flex items-center justify-center">
                                {tenGodLabel}
                              </div>

                              {/* 천간 */}
                              <div
                                className={`rounded-xl border p-2 md:p-3 ${getElementColor(item.pillar.stemElement)}`}
                                style={isIlju ? { boxShadow: 'inset 0 0 0 2px #34d399' } : undefined}
                              >
                                <p className="text-xl font-bold">{item.pillar.stem}</p>
                                <p className="text-[9px] md:text-[10px] opacity-70 mt-0.5">
                                  {STEM_READINGS[item.pillar.stem]} · {ELEMENT_READINGS[item.pillar.stemElement]}
                                </p>
                              </div>

                              {/* 지지 */}
                              <div className={`rounded-xl border p-2 md:p-3 ${getElementColor(item.pillar.branchElement)}`}>
                                <p className="text-xl font-bold">{item.pillar.branch}</p>
                                <p className="text-[9px] md:text-[10px] opacity-70 mt-0.5">
                                  {BRANCH_READINGS[item.pillar.branch]} · {ELEMENT_READINGS[item.pillar.branchElement]}
                                </p>
                              </div>

                              {/* 12운성 */}
                              <div className="text-[9px] md:text-[10px] text-[#999891] h-4 flex items-center justify-center">
                                {twelveStage}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* ═══════════════════════════════════
                  3. 오행 분석 — % + 애니메이션 바
              ═══════════════════════════════════ */}
              <Card className="bg-white border border-black/[0.06] rounded-2xl shadow-sm overflow-hidden">
                <CardHeader className="border-b border-black/[0.06] px-4 py-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-emerald-600">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Activity className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </div>
                    오행 분석
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4" ref={fiveElementRef}>
                  {(() => {
                    const elements = (['木', '火', '土', '金', '水'] as FiveElement[]);
                    const allElems = [
                      result.yearPillar.stemElement, result.yearPillar.branchElement,
                      result.monthPillar.stemElement, result.monthPillar.branchElement,
                      result.dayPillar.stemElement, result.dayPillar.branchElement,
                      result.hourPillar.stemElement, result.hourPillar.branchElement,
                    ];
                    const counts = Object.fromEntries(elements.map(e => [e, allElems.filter(x => x === e).length]));
                    const total = 8;
                    return (
                      <div className="space-y-3">
                        {elements.map(elem => {
                          const count = counts[elem];
                          const pct = Math.round((count / total) * 100);
                          const color = ELEMENT_HEX[elem];
                          return (
                            <div key={elem} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold border ${getElementColor(elem)}`}>
                                    {elem}
                                  </span>
                                  <span className="text-[#5a5a56] font-medium">{ELEMENT_READINGS[elem]}</span>
                                </div>
                                <div className="flex items-center gap-2 text-right">
                                  <span className="text-[#999891]">{count}개</span>
                                  <span className="font-bold text-[#1a1a18] w-8 text-right">{pct}%</span>
                                </div>
                              </div>
                              <div className="h-2 rounded-full bg-black/[0.06] overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: barsAnimated ? `${pct}%` : '0%',
                                    background: color,
                                    transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
                                    transitionDelay: `${elements.indexOf(elem) * 0.08}s`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* ═══════════════════════════════════
                  4. 신강/신약 지수
              ═══════════════════════════════════ */}
              {analysis && (
                <Card className="bg-white border border-black/[0.06] rounded-2xl shadow-sm overflow-hidden">
                  <CardHeader className="border-b border-black/[0.06] px-4 py-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-emerald-600">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </div>
                      신강/신약 지수
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {/* 레이블 */}
                    <div className="flex justify-between text-[10px] text-[#999891] font-medium">
                      <span>신약</span>
                      <span>중화</span>
                      <span>신강</span>
                    </div>

                    {/* 미터 바 */}
                    <div className="relative h-3 rounded-full overflow-visible"
                      style={{ background: 'linear-gradient(to right, #3b82f6 0%, #10b981 50%, #ef4444 100%)' }}>
                      {/* 마커 */}
                      <div
                        className="absolute top-1/2 w-5 h-5 rounded-full bg-white border-2 border-white shadow-md -translate-y-1/2 -translate-x-1/2 transition-all duration-700"
                        style={{
                          left: `${analysis.score}%`,
                          boxShadow: '0 0 0 3px rgba(16,185,129,0.4)',
                        }}
                      />
                    </div>

                    {/* 결과 */}
                    <div className={`rounded-xl p-3 border ${
                      analysis.gangYak === '신강'
                        ? 'bg-red-50 border-red-200'
                        : analysis.gangYak === '신약'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-emerald-50 border-emerald-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-bold ${
                          analysis.gangYak === '신강' ? 'text-red-600'
                          : analysis.gangYak === '신약' ? 'text-blue-600'
                          : 'text-emerald-600'
                        }`}>
                          {analysis.gangYak} ({analysis.score})
                        </span>
                      </div>
                      <p className="text-xs text-[#5a5a56] leading-relaxed">
                        {analysis.gangYak === '신강'
                          ? `일간의 기운이 강한 사주입니다. 스스로의 의지와 추진력이 강하며, 독립적으로 행동하는 성향이 있습니다.`
                          : analysis.gangYak === '신약'
                          ? `일간의 기운이 약한 사주입니다. 주변의 도움과 협력을 통해 더 큰 힘을 발휘할 수 있는 유형입니다.`
                          : `일간과 주변 오행이 잘 균형을 이룬 사주입니다. 상황에 따라 유연하게 대응하는 능력이 뛰어납니다.`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ═══════════════════════════════════
                  5. 용신 섹션
              ═══════════════════════════════════ */}
              {analysis && (
                <Card className="bg-white border border-black/[0.06] rounded-2xl shadow-sm overflow-hidden">
                  <CardHeader className="border-b border-black/[0.06] px-4 py-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-emerald-600">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500" />
                      </div>
                      용신 (用神)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {/* 오행 칩 */}
                    <div className="flex flex-wrap gap-2">
                      {analysis.yongshinElements.map(elem => (
                        <span
                          key={elem}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-bold ${getElementColor(elem)}`}
                        >
                          <span className="text-base">{elem}</span>
                          <span className="text-xs font-medium">{ELEMENT_READINGS[elem]}</span>
                        </span>
                      ))}
                    </div>
                    {/* 설명 */}
                    <p className="text-xs text-[#5a5a56] leading-relaxed">{analysis.yongshinDesc}</p>
                    <p className="text-xs text-[#999891]">
                      용신의 오행과 관련된 색상, 방향, 음식을 가까이하면 운이 열립니다.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* ═══════════════════════════════════
                  6. 대운 섹션
              ═══════════════════════════════════ */}
              {daewunData && (
                <Card className="bg-white border border-black/[0.06] rounded-2xl shadow-sm overflow-hidden">
                  <CardHeader className="border-b border-black/[0.06] px-4 py-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2 text-emerald-600">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </div>
                        대운 (大運)
                      </CardTitle>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#999891]">
                          {daewunData.startAge}세 시작 · {daewunData.isForward ? '순행' : '역행'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <style>{`.daewun-scroll::-webkit-scrollbar{display:none}`}</style>
                    <div className="daewun-scroll overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}>
                      <div className="flex gap-3" style={{ width: 'max-content' }}>
                        {daewunData.pillars.map((p, i) => {
                          const isCurrent = i === daewunData.currentIdx;
                          const tenGodLabel = TEN_GOD_MEANINGS[p.tenGod]?.name || p.tenGod;
                          return (
                            <div key={i} className="flex-shrink-0 text-center" style={{ width: 40 }}>
                              {/* 십성 */}
                              <p style={{ fontSize: 10, color: '#aaa', marginBottom: 4 }} className="truncate font-medium">{tenGodLabel?.replace(/[()（）]/g, '').split(/\s/)[0]}</p>
                              {/* 천간 박스 */}
                              <div
                                className={`flex items-center justify-center ${getElementColor(p.stemElement)}`}
                                style={{ width: 40, height: 40, borderRadius: 10, marginBottom: 4, boxShadow: isCurrent ? 'inset 0 0 0 2px #34d399' : undefined }}
                              >
                                <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{p.stem}</p>
                              </div>
                              {/* 지지 박스 */}
                              <div
                                className={`flex items-center justify-center ${getElementColor(p.branchElement)}`}
                                style={{ width: 40, height: 40, borderRadius: 10, boxShadow: isCurrent ? 'inset 0 0 0 2px #34d399' : undefined }}
                              >
                                <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{p.branch}</p>
                              </div>
                              {/* 나이 */}
                              <p style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>{p.startAge}~{p.startAge + 9}세</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <p className="text-[10px] text-[#999891] mt-3 text-center">← 가로로 스크롤하여 전체 대운 확인</p>
                  </CardContent>
                </Card>
              )}

              {/* ═══════════════════════════════════
                  7. 십성 분포
              ═══════════════════════════════════ */}
              <Card className="bg-white border border-black/[0.06] rounded-2xl shadow-sm overflow-hidden">
                <CardHeader className="border-b border-black/[0.06] px-4 py-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-emerald-600">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </div>
                    십성 분포
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {(() => {
                    const cats = ['비겁', '식상', '재성', '관성', '인성'];
                    const counts: Record<string, number> = Object.fromEntries(cats.map(c => [c, 0]));
                    [result.yearPillar, result.monthPillar, result.dayPillar, result.hourPillar].forEach(p => {
                      const tg = p.tenGod || '비견';
                      const cat = TEN_GOD_CATEGORY[tg] || '비겁';
                      counts[cat]++;
                    });
                    const total = 4;
                    return cats.map(cat => {
                      const count = counts[cat];
                      const pct = Math.round((count / total) * 100);
                      const color = TEN_GOD_CAT_COLOR[cat];
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-10 text-[#1a1a18] font-bold">{cat}</span>
                              <span className="text-[#999891]">{TEN_GOD_CAT_DESC[cat]}</span>
                            </div>
                            <span className="font-bold text-[#1a1a18]">{pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: color }}
                            />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </CardContent>
              </Card>

              {/* ═══════════════════════════════════
                  8. 평생사주 링크 배너
              ═══════════════════════════════════ */}
              <Link href="/lifelong-saju">
                <div
                  className="rounded-2xl p-4 md:p-5 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #0a1f1a 0%, #0d2d22 100%)' }}
                >
                  <div className="space-y-1">
                    <p className="text-white font-bold text-sm">평생사주 풀이 보러가기</p>
                    <p className="text-emerald-300 text-xs">만세력 결과를 바탕으로 평생 운세를 분석합니다</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              </Link>

              {/* ═══════════════════════════════════
                  9. CTA 배너
              ═══════════════════════════════════ */}
              <div
                className="rounded-2xl p-5 md:p-6 space-y-4 mt-3"
                style={{ background: 'linear-gradient(135deg, #0a1f1a 0%, #0d2d22 100%)' }}
              >
                <div className="text-center space-y-1">
                  <p className="text-white font-bold text-base">더 알아보기</p>
                  <p className="text-emerald-300 text-xs">내 사주로 할 수 있는 다양한 분석</p>
                </div>
                <div className="flex gap-3">
                  <Link href="/compatibility" className="flex-1">
                    <button
                      className="w-full h-12 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #34d399)',
                        color: '#ffffff',
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <ChevronRight className="w-4 h-4" />
                        궁합 보기
                      </span>
                    </button>
                  </Link>
                  <button
                    className="flex-1 h-12 rounded-xl font-medium text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#ffffff',
                    }}
                    onClick={() => setResult(null)}
                  >
                    다시 입력
                  </button>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
