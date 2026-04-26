/**
 * Compatibility.tsx
 * 무운 궁합 페이지
 *
 * [개선 2026-03-23]
 * 1단계: 페이지 구조 재편 — 에디토리얼 요약(접힘)을 입력 폼 위로 이동
 * 2단계: 피처 아이콘 3개 → Case B (단순 배지) — 카드 제거, 인라인 수평 나열, pointer-events:none
 * 3단계: 로딩 상태 피드백 — disabled 처리, 스피너 + 텍스트, 스켈레톤 UI, fade-in
 * 4단계: 입력 폼 개선 — 이름 마이크로카피, 성별 터치 타깃 44px, 두 번째 성별 기본값 미선택 + 연동 로직
 * 5단계: 공유 버튼 — 결과 영역 하단에 Web Share API 버튼 추가
 * 6단계: 관련 서비스 계층화 — CompatibilityContent에서 처리
 * 7단계: tintColor 통일 — --compatibility-accent: #E8387A CSS 변수 적용
 * 8단계: 헤더 뒤로가기 레이블 — 이전 경로 기반 레이블 표시
 */
import { useState, useEffect, useRef } from "react";
import { useCanonical } from '@/lib/use-canonical';
import { setCompatibilityOGTags } from '@/lib/og-tags';
import { useForm, useWatch } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Heart, Share2, Sparkles, User, Activity, Calendar, Clock, Users, Star, Zap, Briefcase, Shield, Home, ChevronDown, ChevronUp, Quote, AlertTriangle, CheckCircle2, TrendingUp, Loader2, Copy, Check } from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";
import { Link, useLocation } from "wouter";
import { shareContent } from "@/lib/share";
import { autoLinkKeywordsToJSX } from "@/lib/auto-link-keywords";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BirthTimeSelect } from "@/components/ui/birth-time-select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { calculateSaju, SajuResult, calculateElementBalance, STEM_ELEMENTS, BRANCH_ELEMENTS, STEM_YIN_YANG } from "@/lib/saju";
import { convertToSolarDate } from "@/lib/lunar-converter";
import SajuChart from "@/components/SajuChart";
import SajuGlossary from "@/components/SajuGlossary";
import CompatibilityContent, { CompatibilityRelatedServices } from "@/components/CompatibilityContent";
import RecommendedContent from "@/components/RecommendedContent";
import FortuneShareCard from "@/components/FortuneShareCard";
import { trackEvent, trackCustomEvent } from "@/lib/ga4";
import {
 STEM_READINGS,
 BRANCH_READINGS,
 ELEMENT_READINGS,
 ELEMENT_KOREAN,
 withReading,
 pillarReading,
 STEM_PERSONALITY,
 getElementRelation,
 analyzeElementBalance,
} from "@/lib/saju-reading";
import { cleanAIContent } from "@/lib/content-cleaner";

const formSchema = z.object({
 name1: z.string().min(1, "첫 번째 이름을 입력해주세요"),
 gender1: z.enum(["male", "female"]),
 birthDate1: z.string().min(1, "첫 번째 생년월일을 입력해주세요"),
 birthTime1: z.string().default("12:30"),
 birthTimeUnknown1: z.boolean().default(false),
 calendarType1: z.enum(["solar", "lunar"]),
 isLeapMonth1: z.boolean().optional(),
 name2: z.string().min(1, "두 번째 이름을 입력해주세요"),
 gender2: z.enum(["male", "female"]).optional(),
 birthDate2: z.string().min(1, "두 번째 생년월일을 입력해주세요"),
 birthTime2: z.string().default("12:30"),
 birthTimeUnknown2: z.boolean().default(false),
 calendarType2: z.enum(["solar", "lunar"]),
 isLeapMonth2: z.boolean().optional(),
});

// gender2를 optional로 처리하기 위한 확장 타입
type FormValues = {
 name1: string;
 gender1: "male" | "female";
 birthDate1: string;
 birthTime1: string;
 birthTimeUnknown1: boolean;
 calendarType1: "solar" | "lunar";
 isLeapMonth1?: boolean;
 name2: string;
 gender2?: "male" | "female";
 birthDate2: string;
 birthTime2: string;
 birthTimeUnknown2: boolean;
 calendarType2: "solar" | "lunar";
 isLeapMonth2?: boolean;
};

// 오행 매핑
const elementMap: Record<string, string> = {
 '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
 '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

// 오행 한글
const elementKoreanMap: Record<string, string> = { '木': '나무', '火': '불', '土': '흙', '金': '쇠', '水': '물' };

// 오행 색상
const ELEMENT_BG: Record<string, string> = {
 '木': 'bg-green-500/15 border-green-500/30',
 '火': 'bg-red-500/15 border-red-500/30',
 '土': 'bg-yellow-500/15 border-yellow-500/30',
 '金': 'bg-slate-300/15 border-slate-300/30',
 '水': 'bg-blue-500/15 border-blue-500/30',
};
const ELEMENT_TEXT: Record<string, string> = {
 '木': 'text-green-600',
 '火': 'text-red-600',
 '土': 'text-yellow-600',
 '金': 'text-slate-200',
 '水': 'text-blue-600',
};
const ELEMENT_BAR_COLOR: Record<string, string> = {
 '木': 'bg-green-500',
 '火': 'bg-red-500',
 '土': 'bg-yellow-500',
 '金': 'bg-slate-300',
 '水': 'bg-blue-500',
};

// ===== 궁합 점수 계산 시스템 =====

// 일간 오행 궁합 점수 (상생/상극/비화)
const ELEMENT_COMPAT_SCORE: Record<string, Record<string, number>> = {
 '木': { '木': 75, '火': 90, '土': 40, '金': 30, '水': 85 },
 '火': { '木': 90, '火': 70, '土': 85, '金': 35, '水': 25 },
 '土': { '木': 40, '火': 85, '土': 75, '金': 88, '水': 35 },
 '金': { '木': 30, '火': 35, '土': 88, '金': 70, '水': 90 },
 '水': { '木': 85, '火': 25, '土': 35, '金': 90, '水': 75 },
};

// 음양 조화 점수 (양+음이 가장 좋음)
function getYinYangScore(saju1: SajuResult, saju2: SajuResult): number {
 const yang1 = STEM_YIN_YANG[saju1.dayPillar.stem];
 const yang2 = STEM_YIN_YANG[saju2.dayPillar.stem];
 if (yang1 !== yang2) return 90; // 음양 조화
 return 65; // 같은 음양
}

// 오행 보완 점수 (서로 부족한 오행을 채워주는지)
function getElementComplementScore(saju1: SajuResult, saju2: SajuResult): number {
 const balance1 = calculateElementBalance(saju1);
 const balance2 = calculateElementBalance(saju2);
 let complementScore = 0;
 let count = 0;
 
 balance1.forEach((b1) => {
 const b2 = balance2.find(b => b.name === b1.name);
 if (b2) {
 // 한쪽이 부족하고 다른 쪽이 풍부하면 보완 점수 높음
 if ((b1.value <= 1 && b2.value >= 3) || (b2.value <= 1 && b1.value >= 3)) {
 complementScore += 20;
 } else if (Math.abs(b1.value - b2.value) <= 1) {
 complementScore += 10; // 비슷한 균형
 } else {
 complementScore += 5;
 }
 count++;
 }
 });
 
 return count > 0 ? Math.min(95, 50 + complementScore) : 70;
}

// 종합 궁합 점수 계산
function calculateTotalCompatibility(saju1: SajuResult, saju2: SajuResult): {
 total: number;
 elementScore: number;
 yinYangScore: number;
 complementScore: number;
 loveScore: number;
 wealthScore: number;
 familyScore: number;
} {
 const elem1 = elementMap[saju1.dayPillar.stem];
 const elem2 = elementMap[saju2.dayPillar.stem];
 
 const elementScore = ELEMENT_COMPAT_SCORE[elem1]?.[elem2] || 60;
 const yinYangScore = getYinYangScore(saju1, saju2);
 const complementScore = getElementComplementScore(saju1, saju2);
 
 // 세부 점수 (오행 관계 기반 + 약간의 변동)
 const seed = (saju1.dayPillar.stem.charCodeAt(0) + saju2.dayPillar.stem.charCodeAt(0)) % 20;
 const loveScore = Math.min(98, Math.max(35, Math.round(elementScore * 0.5 + yinYangScore * 0.3 + complementScore * 0.2 + (seed % 10) - 5)));
 const wealthScore = Math.min(98, Math.max(35, Math.round(complementScore * 0.5 + elementScore * 0.3 + yinYangScore * 0.2 + ((seed + 3) % 10) - 5)));
 const familyScore = Math.min(98, Math.max(35, Math.round(yinYangScore * 0.4 + elementScore * 0.3 + complementScore * 0.3 + ((seed + 7) % 10) - 5)));
 
 const total = Math.round(elementScore * 0.35 + yinYangScore * 0.2 + complementScore * 0.2 + loveScore * 0.1 + wealthScore * 0.05 + familyScore * 0.1);
 
 return { total, elementScore, yinYangScore, complementScore, loveScore, wealthScore, familyScore };
}

// ===== 궁합 해석 생성 시스템 =====

function getScoreLabel(score: number): string {
 if (score >= 90) return '최상';
 if (score >= 80) return '상';
 if (score >= 70) return '중상';
 if (score >= 60) return '중';
 if (score >= 50) return '중하';
 return '하';
}

function getScoreColor(score: number): string {
 if (score >= 85) return 'text-pink-600';
 if (score >= 70) return 'text-green-600';
 if (score >= 55) return 'text-yellow-600';
 return 'text-red-600';
}

function getScoreBarColor(score: number): string {
 if (score >= 85) return 'bg-pink-500';
 if (score >= 70) return 'bg-green-500';
 if (score >= 55) return 'bg-yellow-500';
 return 'bg-red-500';
}

// 상생 관계 판별
function isGenerating(elem1: string, elem2: string): boolean {
 const gen: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
 return gen[elem1] === elem2 || gen[elem2] === elem1;
}

// 상극 관계 판별
function isOvercoming(elem1: string, elem2: string): boolean {
 const over: Record<string, string> = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
 return over[elem1] === elem2 || over[elem2] === elem1;
}

// 종합 해석 생성
function generateOverallInterpretation(saju1: SajuResult, saju2: SajuResult, name1: string, name2: string, scores: ReturnType<typeof calculateTotalCompatibility>): string[] {
 const elem1 = elementMap[saju1.dayPillar.stem];
 const elem2 = elementMap[saju2.dayPillar.stem];
 const stemReading1 = STEM_READINGS[saju1.dayPillar.stem];
 const stemReading2 = STEM_READINGS[saju2.dayPillar.stem];
 const elemReading1 = ELEMENT_READINGS[elem1];
 const elemReading2 = ELEMENT_READINGS[elem2];
 const elemKor1 = elementKoreanMap[elem1];
 const elemKor2 = elementKoreanMap[elem2];
 const personality1 = STEM_PERSONALITY[saju1.dayPillar.stem];
 const personality2 = STEM_PERSONALITY[saju2.dayPillar.stem];
 
 const paragraphs: string[] = [];
 
 // 기본 소개
 paragraphs.push(
 `${name1}님의 일간(日干)은 ${saju1.dayPillar.stem}(${stemReading1}), ${elem1}(${elemReading1}) 즉 '${elemKor1}'의 기운이며, ${name2}님의 일간(日干)은 ${saju2.dayPillar.stem}(${stemReading2}), ${elem2}(${elemReading2}) 즉 '${elemKor2}'의 기운입니다. 사주명리학에서 궁합(宮合)은 두 사람의 일간을 중심으로 오행(五行)의 상생(相生)과 상극(相剋) 관계를 분석하여 서로의 조화를 판단합니다.`
 );
 
 // 오행 관계 해석
 if (isGenerating(elem1, elem2)) {
 const relation = getElementRelation(elem1, elem2);
 paragraphs.push(
 `두 분의 오행 관계는 **상생(相生)** 관계입니다. ${relation}. 이는 한 사람의 기운이 다른 사람을 자연스럽게 도와주고 키워주는 관계로, 함께할수록 서로의 장점이 더욱 빛나게 됩니다. 마치 ${elemKor1}와(과) ${elemKor2}가 자연 속에서 조화를 이루듯, 두 분도 함께할 때 시너지가 발생합니다.`
 );
 } else if (isOvercoming(elem1, elem2)) {
 const relation = getElementRelation(elem1, elem2);
 paragraphs.push(
 `두 분의 오행 관계는 **상극(相剋)** 관계입니다. ${relation}. 상극이라고 해서 반드시 나쁜 것은 아닙니다. 적절한 긴장감은 오히려 서로를 성장시키는 원동력이 될 수 있습니다. 다만 서로의 차이를 인정하고 배려하는 노력이 필요합니다. 상극 관계의 커플이 오히려 더 강한 유대감을 형성하는 경우도 많습니다.`
 );
 } else if (elem1 === elem2) {
 paragraphs.push(
 `두 분은 같은 ${elem1}(${elemReading1}) 오행으로, **비화(比和)** 관계입니다. 같은 기운을 가진 두 사람이 만났으니 서로의 마음을 깊이 이해할 수 있는 장점이 있습니다. 취미나 가치관이 비슷하여 편안한 관계를 유지할 수 있지만, 너무 비슷하기 때문에 새로운 자극이 부족할 수 있으니 서로 다른 점을 발견하고 존중하는 노력이 필요합니다.`
 );
 } else {
 const relation = getElementRelation(elem1, elem2);
 paragraphs.push(
 `두 분의 오행 관계: ${relation}. 서로 다른 기운을 가지고 있어 다양한 상호작용이 일어납니다. 서로의 차이를 이해하고 존중한다면 균형 잡힌 좋은 관계를 만들어 갈 수 있습니다.`
 );
 }
 
 // 성격 조화 해석
 if (personality1 && personality2) {
 paragraphs.push(
 `성격적으로 ${name1}님은 ${personality1.symbol}의 성품으로 ${personality1.strength[0].toLowerCase()}이(가) 특징이며, ${name2}님은 ${personality2.symbol}의 성품으로 ${personality2.strength[0].toLowerCase()}이(가) 특징입니다. ${scores.total >= 75 ? '두 분의 성격은 서로를 잘 보완해주는 조합입니다.' : '서로 다른 성격이지만, 차이를 이해하면 오히려 서로에게 배울 점이 많은 관계입니다.'}`
 );
 }
 
 return paragraphs;
}

// 애정운 해석
function generateLoveInterpretation(saju1: SajuResult, saju2: SajuResult, name1: string, name2: string, score: number): string[] {
 const personality1 = STEM_PERSONALITY[saju1.dayPillar.stem];
 const personality2 = STEM_PERSONALITY[saju2.dayPillar.stem];
 const paragraphs: string[] = [];
 
 if (personality1 && personality2) {
 paragraphs.push(
 `${name1}님의 연애 스타일: ${personality1.loveStyle}`
 );
 paragraphs.push(
 `${name2}님의 연애 스타일: ${personality2.loveStyle}`
 );
 }
 
 if (score >= 85) {
 paragraphs.push(`두 분의 애정 궁합은 매우 좋습니다. 서로에 대한 감정이 자연스럽게 깊어지는 관계로, 함께할수록 더 큰 행복을 느낄 수 있습니다.`);
 } else if (score >= 70) {
 paragraphs.push(`두 분의 애정 궁합은 좋은 편입니다. 서로를 이해하고 배려하는 마음이 있다면 아름다운 연애를 할 수 있습니다.`);
 } else if (score >= 55) {
 paragraphs.push(`두 분의 애정 궁합은 보통 수준입니다. 서로의 다른 점을 인정하고 노력한다면 좋은 관계를 만들어 갈 수 있습니다.`);
 } else {
 paragraphs.push(`두 분의 애정 궁합에서는 주의가 필요합니다. 서로의 차이를 이해하고 많은 대화와 배려가 필요합니다.`);
 }
 
 return paragraphs;
}

// 재물운 해석
function generateWealthInterpretation(saju1: SajuResult, saju2: SajuResult, name1: string, name2: string, score: number): string[] {
 const elem1 = elementMap[saju1.dayPillar.stem];
 const elem2 = elementMap[saju2.dayPillar.stem];
 const paragraphs: string[] = [];
 
 if (score >= 85) {
 paragraphs.push(`두 분이 함께하면 재물운이 크게 상승합니다. 서로의 재물 관리 스타일이 잘 맞아 함께 부를 쌓아나갈 수 있는 관계입니다.`);
 } else if (score >= 70) {
 paragraphs.push(`두 분의 재물 궁합은 좋은 편입니다. 서로의 경제적 가치관을 존중하면서 함께 안정적인 재정을 만들어갈 수 있습니다.`);
 } else if (score >= 55) {
 paragraphs.push(`두 분의 재물 궁합은 보통입니다. 재물 관리에 대한 충분한 대화와 합의가 필요합니다.`);
 } else {
 paragraphs.push(`두 분의 재물 관리 스타일에 차이가 있을 수 있습니다. 재정 계획에 대해 충분히 소통하고 서로의 방식을 이해하는 것이 중요합니다.`);
 }
 
 paragraphs.push(`${elem1}과 ${elem2}의 오행 관계를 고려할 때, 두 분이 함께 재물을 관리할 때는 서로의 강점을 살리는 역할 분담이 효과적입니다.`);
 
 return paragraphs;
}

// 가정운 해석
function generateFamilyInterpretation(saju1: SajuResult, saju2: SajuResult, name1: string, name2: string, score: number): string[] {
 const paragraphs: string[] = [];
 
 if (score >= 85) {
 paragraphs.push(`두 분이 함께 가정을 이루면 매우 화목한 가정을 만들 수 있습니다. 서로에 대한 배려와 존중이 자연스럽게 이루어지는 관계입니다.`);
 } else if (score >= 70) {
 paragraphs.push(`두 분의 가정운 궁합은 좋습니다. 서로의 역할을 인정하고 협력한다면 행복한 가정을 꾸릴 수 있습니다.`);
 } else if (score >= 55) {
 paragraphs.push(`두 분의 가정운 궁합은 보통입니다. 가정 내 역할과 책임에 대한 충분한 대화가 필요합니다.`);
 } else {
 paragraphs.push(`두 분의 가정 생활에서는 서로 다른 가치관으로 인한 갈등이 생길 수 있습니다. 서로의 차이를 인정하고 타협점을 찾는 노력이 필요합니다.`);
 }
 
 paragraphs.push(`자녀 교육과 가정 운영에 있어서 두 분이 함께 의논하고 결정하는 습관을 들이면 더욱 안정적인 가정을 만들 수 있습니다.`);
 
 return paragraphs;
}

// 갈등 포인트 및 해결 방법
function generateConflictAdvice(saju1: SajuResult, saju2: SajuResult, name1: string, name2: string): { conflicts: string[]; solutions: string[] } {
 const elem1 = elementMap[saju1.dayPillar.stem];
 const elem2 = elementMap[saju2.dayPillar.stem];
 const personality1 = STEM_PERSONALITY[saju1.dayPillar.stem];
 const personality2 = STEM_PERSONALITY[saju2.dayPillar.stem];
 
 const conflicts: string[] = [];
 const solutions: string[] = [];
 
 if (personality1 && personality2) {
 if (personality1.weakness.length > 0 && personality2.weakness.length > 0) {
 conflicts.push(`${name1}님의 ${personality1.weakness[0]} 성향과 ${name2}님의 ${personality2.weakness[0]} 성향이 충돌할 수 있습니다.`);
 }
 }
 
 if (isOvercoming(elem1, elem2)) {
 conflicts.push(`오행의 상극 관계로 인해 서로의 방식이 맞지 않는다고 느낄 수 있습니다.`);
 conflicts.push(`의사결정 방식의 차이로 인한 갈등이 발생할 수 있습니다.`);
 solutions.push(`서로 다른 점을 단점이 아닌 보완 관계로 바라보는 시각 전환이 필요합니다.`);
 } else {
 conflicts.push(`비슷한 성향으로 인해 서로의 단점이 증폭될 수 있습니다.`);
 conflicts.push(`의견 충돌 시 양보하지 않으려는 경향이 나타날 수 있습니다.`);
 solutions.push(`서로의 강점을 인정하고 역할을 분담하면 시너지 효과를 낼 수 있습니다.`);
 }
 
 solutions.push(`정기적인 대화 시간을 갖고 서로의 감정과 필요를 솔직하게 표현하세요.`);
 solutions.push(`갈등 상황에서는 즉각적인 반응보다 충분한 시간을 두고 생각한 후 대화하세요.`);
 
 return { conflicts, solutions };
}

// 종합 조언
function generateFinalAdvice(saju1: SajuResult, saju2: SajuResult, scores: ReturnType<typeof calculateTotalCompatibility>): string[] {
 const paragraphs: string[] = [];
 
 if (scores.total >= 85) {
 paragraphs.push(
 `종합적으로 두 분은 매우 좋은 궁합입니다. 서로의 기운이 자연스럽게 조화를 이루며, 함께할수록 더 큰 시너지를 만들어낼 수 있는 관계입니다. 이런 좋은 인연을 만난 것에 감사하며, 서로에 대한 존중과 배려를 잊지 않는다면 오래도록 행복한 관계를 유지할 수 있습니다.`
 );
 } else if (scores.total >= 70) {
 paragraphs.push(
 `종합적으로 두 분은 좋은 궁합입니다. 서로를 보완해주는 부분이 많아 함께 성장할 수 있는 관계입니다. 작은 차이점들은 서로를 더 깊이 이해하는 기회로 삼으세요. 꾸준한 대화와 배려가 이 관계를 더욱 빛나게 만들 것입니다.`
 );
 } else if (scores.total >= 55) {
 paragraphs.push(
 `종합적으로 두 분의 궁합은 보통 수준이지만, 이는 노력에 따라 얼마든지 좋아질 수 있습니다. 궁합은 고정된 것이 아니라, 두 사람의 노력에 따라 변화하는 것입니다. 서로의 다름을 인정하고, 함께 성장하려는 의지가 있다면 충분히 행복한 관계를 만들 수 있습니다.`
 );
 } else {
 paragraphs.push(
 `종합적으로 두 분의 궁합에서는 주의가 필요한 부분이 있습니다. 하지만 궁합이 낮다고 해서 반드시 불행한 것은 아닙니다. 오히려 서로 다른 점이 많기 때문에 더 많은 것을 배우고 성장할 수 있는 관계이기도 합니다. 중요한 것은 서로를 향한 진심과 노력입니다.`
 );
 }
 
 paragraphs.push(
 `궁합은 참고 사항일 뿐, 두 사람의 관계를 결정짓는 절대적인 기준이 아닙니다. 30년 이상의 상담 경험에서 보면, 궁합이 좋아도 노력하지 않으면 관계가 멀어지고, 궁합이 나빠도 서로를 진심으로 아끼면 누구보다 행복한 커플이 됩니다. 가장 중요한 것은 두 분의 마음입니다.`
 );
 
 return paragraphs;
}


export default function Compatibility() {
 useCanonical('/compatibility');
 
 useEffect(() => {
 setCompatibilityOGTags();
 }, []);

 const [result, setResult] = useState<{ saju1: SajuResult; saju2: SajuResult } | null>(null);
 // 3단계: 로딩 상태
 const [isLoading, setIsLoading] = useState(false);
 const [loadError, setLoadError] = useState<string | null>(null);
 // 5단계: 공유 버튼 복사 상태
 const [shareCopied, setShareCopied] = useState(false);
 // 4단계: gender2 연동 로직 — 사용자가 직접 변경했는지 추적
 const gender2ManuallySet = useRef(false);

 // 8단계: 이전 경로 기반 뒤로가기 레이블
 const [, navigate] = useLocation();
 const [backLabel, setBackLabel] = useState("홈");
 useEffect(() => {
   const ref = document.referrer;
   if (ref) {
     try {
       const url = new URL(ref);
       const path = url.pathname;
       if (path === "/" || path === "") {
         setBackLabel("홈");
       } else if (path.includes("more") || path.includes("menu")) {
         setBackLabel("전체메뉴");
       } else {
         setBackLabel("홈");
       }
     } catch {
       setBackLabel("홈");
     }
   } else {
     setBackLabel("홈");
   }
 }, []);
 
 const form = useForm<FormValues>({
 resolver: zodResolver(formSchema) as any,
 defaultValues: {
 name1: "",
 gender1: "male",
 birthDate1: "2000-01-01",
 birthTime1: "12:30",
 birthTimeUnknown1: false,
 calendarType1: "solar",
 name2: "",
 gender2: undefined, // 4단계: 기본값 미선택
 birthDate2: "2000-01-01",
 birthTime2: "12:30",
 birthTimeUnknown2: false,
 calendarType2: "solar",
 },
 });

 useEffect(() => {
 const savedData = localStorage.getItem("muun_user_data");
 if (savedData) {
 const parsed = JSON.parse(savedData);
 form.reset({
 name1: parsed.name || "",
 gender1: parsed.gender || "male",
 birthDate1: parsed.birthDate || "2000-01-01",
 birthTime1: parsed.birthTime || "12:30",
 birthTimeUnknown1: false,
 calendarType1: parsed.calendarType || "solar",
 name2: "",
 gender2: undefined, // 4단계: 기본값 미선택
 birthDate2: "2000-01-01",
 birthTime2: "12:30",
 birthTimeUnknown2: false,
 calendarType2: "solar",
 });
 }
 }, [form]);

 // 윤달 체크박스 표시 조건 — useWatch로 즉각 반응 보장
 const calendarType1 = useWatch({ control: form.control, name: "calendarType1" });
 const calendarType2 = useWatch({ control: form.control, name: "calendarType2" });

 // 4단계: 첫 번째 사람 성별 선택 시 두 번째 사람 성별 자동 설정
 const gender1Value = form.watch("gender1");
 useEffect(() => {
   if (!gender2ManuallySet.current) {
     const opposite = gender1Value === "male" ? "female" : "male";
     form.setValue("gender2", opposite);
   }
 }, [gender1Value, form]);

 const onSubmit = (data: FormValues) => {
  // gender2 미선택 시 오류
  if (!data.gender2) {
    form.setError("gender2" as any, { message: "두 번째 사람의 성별을 선택해주세요" });
    return;
  }

 // 두 사람의 생년월일 데이터를 GA4에 전송 (SEO 분석용)
 // YYYY. MM. DD 표시 포맷 → YYYY-MM-DD ISO 포맷으로 정규화
 const normalizeDate = (v: string): string => {
   if (typeof v !== 'string') return String(v);
   // YYYY. MM. DD 포맷 처리
   const dotMatch = v.match(/^(\d{4})\s*\.\s*(\d{1,2})\s*\.\s*(\d{1,2})$/);
   if (dotMatch) {
     return `${dotMatch[1]}-${dotMatch[2].padStart(2,'0')}-${dotMatch[3].padStart(2,'0')}`;
   }
   // 이미 YYYY-MM-DD이면 그대로
   if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
   return v;
 };
 let birthDateStr1 = normalizeDate(data.birthDate1);
 let birthDateStr2 = normalizeDate(data.birthDate2);
 const [year1, month1, day1] = birthDateStr1.split('-').map(Number);
 const [year2, month2, day2] = birthDateStr2.split('-').map(Number);
 const birthDateObj1 = new Date(year1, month1 - 1, day1);
 const birthDateObj2 = new Date(year2, month2 - 1, day2);
 
 trackCustomEvent("check_fortune_result", {
 fortune_type: "궁합",
 birth_date_1: birthDateStr1,
 birth_date_2: birthDateStr2,
 gender_1: data.gender1,
 gender_2: data.gender2,
 calendar_type_1: data.calendarType1,
 calendar_type_2: data.calendarType2,
 });

 // 3단계: 로딩 상태 시작
 setIsLoading(true);
 setLoadError(null);

 // 약간의 딜레이로 로딩 피드백 표시 (클라이언트 계산이지만 UX 피드백 제공)
 setTimeout(() => {
   try {
     const birthDateStrForConverter1 = `${birthDateObj1.getFullYear()}-${String(birthDateObj1.getMonth() + 1).padStart(2, '0')}-${String(birthDateObj1.getDate()).padStart(2, '0')}`;
     const birthDateStrForConverter2 = `${birthDateObj2.getFullYear()}-${String(birthDateObj2.getMonth() + 1).padStart(2, '0')}-${String(birthDateObj2.getDate()).padStart(2, '0')}`;
     const time1 = data.birthTimeUnknown1 ? "12:00" : data.birthTime1;
     const time2 = data.birthTimeUnknown2 ? "12:00" : data.birthTime2;
     const date1 = convertToSolarDate(birthDateStrForConverter1, time1, data.calendarType1, data.isLeapMonth1 || false);
     const date2 = convertToSolarDate(birthDateStrForConverter2, time2, data.calendarType2, data.isLeapMonth2 || false);
     const saju1 = calculateSaju(date1, data.gender1);
     const saju2 = calculateSaju(date2, data.gender2!);
     
     setResult({ saju1, saju2 });
     setIsLoading(false);
     window.scrollTo(0, 0);
     
     try { trackEvent('compatibility_result', 'engagement', 'compatibility_calculated'); } catch {}
   } catch (err) {
     setIsLoading(false);
     setLoadError("계산 중 오류가 발생했습니다. 다시 시도해 주세요.");
   }
 }, 800);
 };

 const commonMaxWidth = "w-full";

 // ===== 입력 화면 =====
 if (!result) {
 return (
 <>
 <Helmet>
 <title>무료 궁합 보기 - 회원가입 없이 사주 궁합 분석 | 무운</title>
 <meta name="description" content="회원가입 없이 두 사람의 생년월일만으로 바로 확인하는 무료 사주 궁합. 오행 궁합, 성격 궁합, 연애 궁합을 개인정보 저장 없이 100% 무료로 분석합니다." />
 <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
 <link rel="canonical" href="https://muunsaju.com/compatibility" />
 <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"홈","item":"https://muunsaju.com"},{"@type":"ListItem","position":2,"name":"무료 궁합","item":"https://muunsaju.com/compatibility"}]})}</script>
 <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"Service","name":"무료 사주 궁합","description":"사주팔자 기반의 무료 궁합 분석 서비스","provider":{"@type":"Organization","name":"무운 (MuUn)","url":"https://muunsaju.com"},"url":"https://muunsaju.com/compatibility","serviceType":"궁합","areaServed":"KR","isAccessibleForFree":true,"offers":{"@type":"Offer","price":"0","priceCurrency":"KRW"}})}</script>
 </Helmet>
 {/* 시안 기반 전면 개선: 연한 핑크 베이지 배경, 클린 카드 UI */}
 <style>{`
   .compatibility-page { --compatibility-accent: #E8387A; }
   /* 세그먼트 컨트롤: 트랙(배경 컨테이너) 안에 옵션이 floating */
   .compat-segment-track {
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 3px;
     background-color: #EDE8E8;
     border-radius: 12px;
     padding: 3px;
     height: 44px;
   }
   .compat-segment-item {
     display: flex;
     align-items: center;
     justify-content: center;
     border-radius: 9px;
     font-size: 14px;
     font-weight: 500;
     cursor: pointer;
     transition: all 0.15s ease;
     border: none;
     background: transparent;
     color: #6b6b67;
     min-height: 38px;
   }
   .compat-segment-item[data-state=on] {
     background-color: white;
     color: #E8387A;
     box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08);
   }
   .compat-segment-item[data-state=off]:hover {
     color: #1a1a18;
   }
 `}</style>
 <div className="mu-subpage-screen compatibility-page min-h-screen bg-[#FBF3F3] text-foreground pb-16 antialiased">

 {/* 헤더 — 흰색 불투명, 시안과 동일 */}
 <header className="mu-subpage-header sticky top-0 z-50 bg-white border-b border-black/[0.06]">
 <div className="w-full px-4 h-14 flex items-center">
 <Link href="/">
 <Button variant="ghost" className="mr-2 text-[#1a1a18] hover:bg-black/[0.06] min-w-[44px] min-h-[44px] flex items-center gap-1 px-2">
   <ChevronLeft className="h-5 w-5" />
   <span className="text-sm font-medium">{backLabel}</span>
 </Button>
 </Link>
 <h2 className="text-base font-bold text-[#1a1a18]">궁합 풀이</h2>
 </div>
 </header>

 <main className="mu-service-main w-full px-4 py-6">
 <motion.div
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className={`${commonMaxWidth} space-y-4`}
 >
 {/* 히어로 영역 — 시안과 동일한 핑크 베이지 배경 위 */}
 <div className="text-center space-y-2 pt-2">
 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8387A]/30">
 <Heart className="w-3 h-3 text-[#E8387A]" />
 <span className="text-xs font-medium text-[#E8387A]">서로의 기운을 맞추다</span>
 </div>
 <h1 className="text-3xl font-bold tracking-tight text-[#1a1a18]">궁합</h1>
 <p className="text-[#5a5a56] text-sm">
 두 사람의 사주로 인연의 깊이를 확인해보세요
 </p>
 {/* 피처 배지 — 시안: ● 불릿 도트 스타일 */}
 <div className="flex items-center justify-center gap-4 pt-1" style={{ pointerEvents: 'none' }}>
   <span className="flex items-center gap-1.5 text-xs text-[#5a5a56]">
     <span className="w-1.5 h-1.5 rounded-full bg-[#E8387A] inline-block" />
     궁합 점수
   </span>
   <span className="flex items-center gap-1.5 text-xs text-[#5a5a56]">
     <span className="w-1.5 h-1.5 rounded-full bg-[#E8387A] inline-block" />
     오행 분석
   </span>
   <span className="flex items-center gap-1.5 text-xs text-[#5a5a56]">
     <span className="w-1.5 h-1.5 rounded-full bg-[#E8387A] inline-block" />
     상세 해석
   </span>
 </div>
 </div>

 {/* 에디토리얼 — 시안에서 숨겨져 있으나 SEO 유지를 위해 hidden 처리 */}
 <div className="sr-only" aria-hidden="true">
   <CompatibilityContent />
 </div>

 {/* 입력 카드 — 헤더 없는 흰색 카드, 좌우 패딩 추가 */}
 <div className="bg-white rounded-2xl shadow-sm border border-black/[0.06] p-5 md:p-8">
 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
 {/* 첫 번째 사람 */}
 <div className="space-y-4">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-full bg-[#E8387A] text-white text-xs font-bold flex items-center justify-center">1</div>
 <h3 className="text-[#1a1a18] font-bold text-sm">첫 번째 사람</h3>
 </div>
 {/* ①② 수직 정렬: items-start 적용, 성별 컨테이너 동일 높이 확보 */}
 <div className="grid grid-cols-2 gap-3 items-start">
 <div className="space-y-1.5">
 <Label htmlFor="name1" className="text-[#1a1a18] text-sm font-medium">이름</Label>
 <Input id="name1" placeholder="이름" {...form.register("name1")} className="h-11 bg-[#F7F5F3] border-[#E8E5E0] text-[#1a1a18] placeholder:text-[#b0ada6] rounded-xl focus:ring-[#E8387A]/30 focus:border-[#E8387A] transition-all text-sm" />
 </div>
 <div className="space-y-1.5">
 <Label className="text-[#1a1a18] text-sm font-medium">성별</Label>
 {/* 세그먼트 컨트롤: 트랙 안에 옵션 floating */}
 <ToggleGroup
   type="single"
   value={form.watch("gender1")}
   onValueChange={(v) => { if (v) form.setValue("gender1", v as "male" | "female"); }}
   className="compat-segment-track w-full"
 >
 <ToggleGroupItem value="male" className="compat-segment-item">남성</ToggleGroupItem>
 <ToggleGroupItem value="female" className="compat-segment-item">여성</ToggleGroupItem>
 </ToggleGroup>
 {/* ② 수직 정렬: 마이크로카피와 동일 높이 spacer */}
 <div className="h-[14px]" />
 </div>
 </div>
 <div className="space-y-1.5">
 <Label htmlFor="birthDate1" className="text-[#1a1a18] text-sm font-medium">생년월일</Label>
 <DatePickerInput id="birthDate1" {...form.register("birthDate1")} value={form.watch("birthDate1")} accentColor="pink" />
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div className="space-y-1.5">
 <Label htmlFor="birthTime1" className="text-[#1a1a18] text-sm font-medium">태어난 시간</Label>
 <BirthTimeSelect
 value={form.watch("birthTime1")}
 onChange={(val) => form.setValue("birthTime1", val)}
 onUnknownChange={(isUnknown) => form.setValue("birthTimeUnknown1", isUnknown)}
 isUnknown={form.watch("birthTimeUnknown1")}
 accentClass="focus:ring-[#E8387A]/30 focus:border-[#E8387A]"
 />
 </div>
 <div className="space-y-1.5">
 <Label className="text-[#1a1a18] text-sm font-medium">양력/음력</Label>
 <ToggleGroup
 type="single"
 value={form.watch("calendarType1")}
 onValueChange={(value) => {
 if (value) {
 form.setValue("calendarType1", value as "solar" | "lunar");
 if (value === "solar") form.setValue("isLeapMonth1", false);
 }
 }}
 className="compat-segment-track w-full"
 >
 <ToggleGroupItem value="solar" className="compat-segment-item">양력</ToggleGroupItem>
 <ToggleGroupItem value="lunar" className="compat-segment-item">음력</ToggleGroupItem>
 </ToggleGroup>
 {/* 윤달 체크박스 — 음력 선택 시에만 표시, 공간 없이 완전 숨김 */}
 {calendarType1 === "lunar" && (
   <div className="flex items-center gap-1.5 pt-1.5">
     <Checkbox
       id="isLeapMonth1"
       checked={form.watch("isLeapMonth1") || false}
       onCheckedChange={(checked) => form.setValue("isLeapMonth1", checked === true)}
       className="data-[state=checked]:bg-[#D4537E] data-[state=checked]:border-[#D4537E]"
     />
     <Label htmlFor="isLeapMonth1" className="cursor-pointer" style={{ fontSize: '11px', color: 'var(--color-text-secondary, #999891)' }}>
       윤달
     </Label>
   </div>
 )}
 </div>
 </div>
 </div>

 {/* 구분선 — [---- ♡ ----] 점선 + 중앙 하트 */}
 <div className="flex items-center gap-3 my-4">
   <div className="flex-1 border-t border-dashed border-[#ffd6e4]" style={{ borderWidth: '0.5px' }} />
   <Heart className="w-3.5 h-3.5 text-[#ED93B1] flex-shrink-0" />
   <div className="flex-1 border-t border-dashed border-[#ffd6e4]" style={{ borderWidth: '0.5px' }} />
 </div>

 {/* 두 번째 사람 */}
 <div className="space-y-4">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-full bg-[#E8387A] text-white text-xs font-bold flex items-center justify-center">2</div>
 <h3 className="text-[#1a1a18] font-bold text-sm">두 번째 사람</h3>
 </div>
 {/* ①② 수직 정렬: items-start 적용, 성별 컨테이너 동일 높이 확보 */}
 <div className="grid grid-cols-2 gap-3 items-start">
 <div className="space-y-1.5">
 <Label htmlFor="name2" className="text-[#1a1a18] text-sm font-medium">이름</Label>
 <Input id="name2" placeholder="이름" {...form.register("name2")} className="h-11 bg-[#F7F5F3] border-[#E8E5E0] text-[#1a1a18] placeholder:text-[#b0ada6] rounded-xl focus:ring-[#E8387A]/30 focus:border-[#E8387A] transition-all text-sm" />
 </div>
 <div className="space-y-1.5">
 <Label className="text-[#1a1a18] text-sm font-medium">성별</Label>
 <ToggleGroup
   type="single"
   value={form.watch("gender2") || ""}
   onValueChange={(v) => {
     if (v) {
       gender2ManuallySet.current = true;
       form.setValue("gender2", v as "male" | "female");
     }
   }}
   className="compat-segment-track w-full"
 >
 <ToggleGroupItem value="male" className="compat-segment-item">남성</ToggleGroupItem>
 <ToggleGroupItem value="female" className="compat-segment-item">여성</ToggleGroupItem>
 </ToggleGroup>
 {(form.formState.errors as any)?.gender2 && (
   <p className="text-[11px] text-red-500">{(form.formState.errors as any).gender2?.message}</p>
 )}
 {/* ② 수직 정렬: 마이크로카피와 동일 높이 spacer */}
 <div className="h-[14px]" />
 </div>
 </div>
 <div className="space-y-1.5">
 <Label htmlFor="birthDate2" className="text-[#1a1a18] text-sm font-medium">생년월일</Label>
 <DatePickerInput id="birthDate2" {...form.register("birthDate2")} value={form.watch("birthDate2")} accentColor="pink" />
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div className="space-y-1.5">
 <Label htmlFor="birthTime2" className="text-[#1a1a18] text-sm font-medium">태어난 시간</Label>
 <BirthTimeSelect
 value={form.watch("birthTime2")}
 onChange={(val) => form.setValue("birthTime2", val)}
 onUnknownChange={(isUnknown) => form.setValue("birthTimeUnknown2", isUnknown)}
 isUnknown={form.watch("birthTimeUnknown2")}
 accentClass="focus:ring-[#E8387A]/30 focus:border-[#E8387A]"
 />
 </div>
 <div className="space-y-1.5">
 <Label className="text-[#1a1a18] text-sm font-medium">양력/음력</Label>
 <ToggleGroup
 type="single"
 value={form.watch("calendarType2")}
 onValueChange={(value) => {
 if (value) {
 form.setValue("calendarType2", value as "solar" | "lunar");
 if (value === "solar") form.setValue("isLeapMonth2", false);
 }
 }}
 className="compat-segment-track w-full"
 >
 <ToggleGroupItem value="solar" className="compat-segment-item">양력</ToggleGroupItem>
 <ToggleGroupItem value="lunar" className="compat-segment-item">음력</ToggleGroupItem>
 </ToggleGroup>
 {/* 윤달 체크박스 — 음력 선택 시에만 표시, 공간 없이 완전 숨김 */}
 {calendarType2 === "lunar" && (
   <div className="flex items-center gap-1.5 pt-1.5">
     <Checkbox
       id="isLeapMonth2"
       checked={form.watch("isLeapMonth2") || false}
       onCheckedChange={(checked) => form.setValue("isLeapMonth2", checked === true)}
       className="data-[state=checked]:bg-[#D4537E] data-[state=checked]:border-[#D4537E]"
     />
     <Label htmlFor="isLeapMonth2" className="cursor-pointer" style={{ fontSize: '11px', color: 'var(--color-text-secondary, #999891)' }}>
       윤달
     </Label>
   </div>
 )}
 </div>
 </div>
 </div>

 {/* 로딩 에러 메시지 */}
 {loadError && (
   <p className="text-sm text-red-500 text-center">{loadError}</p>
 )}

 {/* CTA 버튼 — 시안: 단색 핑크 #E8387A, 더 큰 radius */}
 <Button
   type="submit"
   disabled={isLoading}
   className="w-full h-14 bg-[#E8387A] hover:bg-[#d42e6e] text-white font-bold text-base rounded-2xl shadow-md shadow-[#E8387A]/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
 >
   {isLoading ? (
     <>
       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
       궁합을 분석하고 있어요...
     </>
   ) : (
     <>
       <Heart className="w-4 h-4 mr-2" />
       궁합 결과 보기
     </>
   )}
 </Button>

 {/* 스켈레톤 UI */}
 <AnimatePresence>
   {isLoading && (
     <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       transition={{ duration: 0.2 }}
       className="space-y-3 pt-2"
     >
       {[1, 2, 3].map((i) => (
         <div key={i} className="h-20 bg-black/[0.05] rounded-xl animate-pulse" />
       ))}
     </motion.div>
   )}
 </AnimatePresence>
 </form>
 </div>

 {/* 관련 서비스 — 입력 폼 아래(CTA 이후) */}
 <CompatibilityRelatedServices />

 </motion.div>
 </main>
 </div>
 </>
 );
 }
 // ===== 결과 화면 ======
 const name1 = form.getValues("name1") || "첫 번째";
 const name2 = form.getValues("name2") || "두 번째";
 const { saju1, saju2 } = result;
 const scores = calculateTotalCompatibility(saju1, saju2);
 
 const elem1 = elementMap[saju1.dayPillar.stem];
 const elem2 = elementMap[saju2.dayPillar.stem];
 const personality1 = STEM_PERSONALITY[saju1.dayPillar.stem];
 const personality2 = STEM_PERSONALITY[saju2.dayPillar.stem];
 
 const balance1 = calculateElementBalance(saju1);
 const balance2 = calculateElementBalance(saju2);
 const elementAnalysis1 = analyzeElementBalance(balance1);
 const elementAnalysis2 = analyzeElementBalance(balance2);
 
 const overallInterpretation = generateOverallInterpretation(saju1, saju2, name1, name2, scores);
 const loveInterpretation = generateLoveInterpretation(saju1, saju2, name1, name2, scores.loveScore);
 const wealthInterpretation = generateWealthInterpretation(saju1, saju2, name1, name2, scores.wealthScore);
 const familyInterpretation = generateFamilyInterpretation(saju1, saju2, name1, name2, scores.familyScore);
 const conflictAdvice = generateConflictAdvice(saju1, saju2, name1, name2);
 const finalAdvice = generateFinalAdvice(saju1, saju2, scores);

 // 시안 기반 세부 점수 항목 — 각 항목 고유 컬러
 const scoreItems = [
   { label: '오행 조화', score: scores.elementScore, barColor: 'bg-[#E8387A]', textColor: 'text-[#E8387A]' },
   { label: '음양 균형', score: scores.yinYangScore, barColor: 'bg-[#7C5CFC]', textColor: 'text-[#7C5CFC]' },
   { label: '오행 보완', score: scores.complementScore, barColor: 'bg-[#22C55E]', textColor: 'text-[#22C55E]' },
   { label: '애정운', score: scores.loveScore, barColor: 'bg-[#E8387A]', textColor: 'text-[#E8387A]' },
   { label: '재물운', score: scores.wealthScore, barColor: 'bg-[#F59E0B]', textColor: 'text-[#F59E0B]' },
   { label: '가정운', score: scores.familyScore, barColor: 'bg-[#3B82F6]', textColor: 'text-[#3B82F6]' },
 ];

 // 궁합 등급 레이블
 const getCompatibilityGradeLabel = (score: number) => {
   if (score >= 90) return "최고의 궁합";
   if (score >= 80) return "좋은 궁합";
   if (score >= 70) return "보통의 궁합";
   if (score >= 60) return "노력이 필요한 궁합";
   return "도전적인 궁합";
 };
 const getCompatibilitySubLabel = (score: number) => {
   if (score >= 90) return "천생연분에 가까운 관계입니다";
   if (score >= 80) return "서로를 잘 이해하고 보완하는 관계";
   if (score >= 70) return "노력하면 충분히 좋아질 수 있는 관계";
   if (score >= 60) return "서로의 차이를 이해하는 노력이 필요";
   return "많은 대화와 배려가 필요한 관계";
 };
 const getCompatibilityHashtags = (score: number, e1: string, e2: string): string[] => {
   const tags: string[] = [];
   if (isGenerating(e1, e2)) tags.push('#상생관계');
   else if (isOvercoming(e1, e2)) tags.push('#상극관계');
   else tags.push('#비화관계');
   if (score >= 80) tags.push('#좋은궁합');
   if (scores.loveScore >= 80) tags.push('#애정운최상');
   if (scores.complementScore >= 80) tags.push('#서로보완');
   if (scores.yinYangScore >= 80) tags.push('#음양조화');
   tags.push('#소울메이트');
   tags.push('#운명적만남');
   return tags.slice(0, 4);
 };
 const hashtags = getCompatibilityHashtags(scores.total, elem1, elem2);

 // 공유 핸들러
 const handleShare = async () => {
   const shareText = `우리 궁합 결과가 나왔어요! 🔮\n두 사람의 오행 궁합 점수는 ${scores.total}점\n무운에서 무료로 확인해보세요 👇`;
   const shareUrl = "https://muunsaju.com/compatibility";
   try {
     trackCustomEvent('share_click', { source_page: shareUrl, button_type: 'compatibility_result' });
   } catch {}
   try {
     if (navigator.share && navigator.canShare) {
       await navigator.share({ title: '무운 궁합 결과', text: shareText, url: shareUrl });
       try { trackCustomEvent('share_success', { method: 'native_share', page: 'compatibility' }); } catch {}
     } else {
       await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
       setShareCopied(true);
       setTimeout(() => setShareCopied(false), 2000);
       try { trackCustomEvent('share_success', { method: 'clipboard_copy', page: 'compatibility' }); } catch {}
     }
   } catch (err) {
     if ((err as Error).name !== 'AbortError') {
       try {
         await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
         setShareCopied(true);
         setTimeout(() => setShareCopied(false), 2000);
       } catch {}
     }
   }
 };

 // 일간 해석 첫 문장 인용구 추출
 const firstPara = overallInterpretation[0] || "";
 const quoteMatch = firstPara.match(/['"'"](.*?)['"'"]/);
 const quoteText = quoteMatch ? quoteMatch[0] : `"${elem1}과 ${elem2}, 서로 다르기에 서로가 필요한 관계"`;

 return (
 <>
 <Helmet>
   <title>무료 궁합 보기 - 회원가입 없이 사주 궁합 분석 | 무운 (MuUn)</title>
   <meta name="description" content={`두 분의 사주를 기반으로 한 궁합 분석 결과입니다. 총 궁합 점수: ${scores.total}점`} />
   <meta property="og:title" content="무료 궁합 보기 - 회원가입 없이 사주 궁합 분석 | 무운 (MuUn)" />
   <meta property="og:description" content="회원가입 없이 두 사람의 생년월일만으로 바로 확인하는 무료 사주 궁합. 오행 궁합, 성격 궁합, 연애 궁합을 개인정보 저장 없이 100% 무료로 분석합니다." />
   <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
   <meta property="og:type" content="website" />
   <meta property="og:site_name" content="무운 (MuUn)" />
   <meta property="og:locale" content="ko_KR" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta name="twitter:image" content="https://muunsaju.com/images/horse_mascot.png" />
   <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
   <meta name="keywords" content="궁합, 무료궁합, 사주궁합, 연애궁합, 결혼궁합, 오행궁합, 무료궁합보기, 커플궁합" />
   <link rel="canonical" href="https://muunsaju.com/compatibility" />
 </Helmet>
 <style>{`
   .compatibility-page { --compatibility-accent: #E8387A; }
   .compat-segment-track {
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 3px;
     background-color: #EDE8E8;
     border-radius: 12px;
     padding: 3px;
     height: 44px;
   }
   .compat-segment-item {
     display: flex;
     align-items: center;
     justify-content: center;
     border-radius: 9px;
     font-size: 14px;
     font-weight: 500;
     cursor: pointer;
     transition: all 0.15s ease;
     border: none;
     background: transparent;
     color: #6b6b67;
     min-height: 38px;
   }
   .compat-segment-item[data-state=on] {
     background-color: white;
     color: #E8387A;
     box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08);
   }
   .result-card {
     background: white;
     border-radius: 16px;
     border: 1px solid rgba(0,0,0,0.06);
     overflow: hidden;
   }
   .result-section-header {
     display: flex;
     align-items: center;
     gap: 8px;
     font-size: 15px;
     font-weight: 700;
     color: #1a1a18;
     margin-bottom: 16px;
   }
 `}</style>
 <div className="mu-subpage-screen compatibility-page min-h-screen bg-[#F5F4F8] text-foreground pb-16 antialiased">

   {/* ===== 헤더 ===== */}
   <header className="mu-subpage-header sticky top-0 z-50 bg-white border-b border-black/[0.06]">
     <div className="w-full px-4 h-14 flex items-center justify-between">
       <div className="flex items-center">
         <Button variant="ghost" onClick={() => setResult(null)} className="mr-2 text-[#1a1a18] hover:bg-black/[0.06] min-w-[44px] min-h-[44px] flex items-center gap-1 px-2">
           <ChevronLeft className="h-5 w-5" />
           <span className="text-sm font-medium">궁합 입력</span>
         </Button>
         <h1 className="text-base font-bold text-[#1a1a18]">궁합 결과</h1>
       </div>
       <Button variant="ghost" size="icon" className="text-[#7C5CFC] min-w-[44px] min-h-[44px]" onClick={handleShare}>
         <Share2 className="h-5 w-5" />
       </Button>
     </div>
   </header>

   <main className="mu-service-main px-4 pb-8">
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className={`${commonMaxWidth} space-y-4`}
     >

       {/* ===== 1. 히어로 — 다크 보라 그라데이션 카드 ===== */}
       <section
         className="rounded-2xl overflow-hidden"
         style={{ background: 'linear-gradient(160deg, #2D1B5E 0%, #1A0F3C 50%, #2A1060 100%)' }}
       >
         <div className="px-6 pt-8 pb-8 flex flex-col items-center text-center space-y-5">
           {/* 이름 칩 + 하트 */}
           <div className="flex items-center gap-3">
             <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm">
               {name1}
             </span>
             <Heart className="w-5 h-5 text-[#E8387A] animate-pulse flex-shrink-0" />
             <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm">
               {name2}
             </span>
           </div>

           {/* 원형 그래프 — 보라→핑크 그라데이션, 두꺼운 stroke */}
           <div className="relative w-40 h-40 mx-auto">
             <svg className="w-full h-full" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
               <motion.circle
                 cx="50" cy="50" r="42" fill="none"
                 stroke="url(#hero-gradient)" strokeWidth="10"
                 strokeDasharray="264"
                 initial={{ strokeDashoffset: 264 }}
                 animate={{ strokeDashoffset: 264 - (264 * scores.total) / 100 }}
                 transition={{ duration: 1.8, ease: "easeOut" }}
                 strokeLinecap="round"
                 transform="rotate(-90 50 50)"
               />
               <defs>
                 <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" stopColor="#7C5CFC" />
                   <stop offset="100%" stopColor="#E8387A" />
                 </linearGradient>
               </defs>
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-5xl font-black text-white leading-none">{scores.total}</span>
               <span className="text-xs text-white/60 mt-1">/ 100</span>
             </div>
           </div>

           {/* 등급 레이블 */}
           <div className="space-y-1">
             <p className="text-xl font-bold text-white">'{getCompatibilityGradeLabel(scores.total)}'</p>
             <p className="text-sm text-white/60">{getCompatibilitySubLabel(scores.total)}</p>
           </div>

           {/* 해시태그 칩 */}
           <div className="flex flex-wrap justify-center gap-2">
             {hashtags.map((tag, i) => (
               <span
                 key={i}
                 className={`px-3 py-1 rounded-full text-xs font-medium ${
                   i === 1
                     ? 'bg-[#E8387A]/80 text-white'
                     : 'bg-white/10 text-white/80 border border-white/20'
                 }`}
               >
                 {tag}
               </span>
             ))}
           </div>
         </div>
       </section>

       {/* ===== 2. 세부 궁합 점수 ===== */}
       <section className="result-card p-5">
         <div className="result-section-header">
           <Activity className="w-4 h-4 text-[#7C5CFC]" />
           세부 궁합 점수
         </div>
         <div className="space-y-3.5">
           {scoreItems.map((item, idx) => (
             <div key={idx} className="flex items-center gap-3">
               <span className="text-sm text-[#555] w-16 flex-shrink-0">{item.label}</span>
               <div className="flex-1 h-2 bg-[#F0EEF8] rounded-full overflow-hidden">
                 <motion.div
                   initial={{ width: 0 }}
                   animate={{ width: `${item.score}%` }}
                   transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                   className={`h-full rounded-full ${item.barColor}`}
                 />
               </div>
               <span className={`text-sm font-bold w-8 text-right flex-shrink-0 ${item.textColor}`}>{item.score}</span>
             </div>
           ))}
         </div>
       </section>

       {/* ===== 3. 일간(日干) 궁합 종합 해석 ===== */}
       <section className="result-card p-5">
         <div className="result-section-header">
           <Quote className="w-4 h-4 text-[#7C5CFC]" />
           일간(日干) 궁합 종합 해석
         </div>
         {/* 인용구 강조 */}
         <blockquote className="text-base font-bold text-[#1a1a18] leading-snug mb-4 border-l-0">
           {`"${elementKoreanMap[elem1]}과 ${elementKoreanMap[elem2]}, 서로 다르기에 서로가 필요한 관계"`}
         </blockquote>
         <div className="space-y-3">
           {overallInterpretation.map((para, idx) => (
             <p
               key={idx}
               className="text-sm text-[#444] leading-relaxed"
               dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#7C5CFC]">$1</strong>') }}
             />
           ))}
         </div>
       </section>

       {/* ===== 4. 성격 궁합 비교 ===== */}
       {personality1 && personality2 && (
         <section className="result-card p-5">
           <div className="result-section-header">
             <User className="w-4 h-4 text-[#7C5CFC]" />
             성격 궁합 비교
           </div>
           <div className="grid grid-cols-2 gap-3 mb-4">
             {/* 첫 번째 사람 */}
             <div className="rounded-xl border border-[#E8E5F0] bg-[#FAFAFE] p-3 space-y-2.5">
               <div className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC]" />
                 <span className="text-xs text-[#7C5CFC] font-medium">{name1}님</span>
               </div>
               <p className="text-base font-bold text-[#1a1a18] leading-tight">
                 {STEM_YIN_YANG[saju1.dayPillar.stem] ? '양(陽)' : '음(陰)'}의 {elementKoreanMap[elem1] || elem1}
               </p>
               <div className="space-y-1.5">
                 {personality1.strength.slice(0, 3).map((s, i) => (
                   <span key={i} className="block text-xs px-2 py-1 bg-[#EEF2FF] text-[#4F46E5] rounded-md">{s}</span>
                 ))}
                 {personality1.weakness.slice(0, 2).map((w, i) => (
                   <span key={i} className="block text-xs px-2 py-1 bg-[#FFF0F5] text-[#E8387A] rounded-md">{w}</span>
                 ))}
               </div>
             </div>
             {/* 두 번째 사람 */}
             <div className="rounded-xl border border-[#F0EDE5] bg-[#FFFAF5] p-3 space-y-2.5">
               <div className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                 <span className="text-xs text-[#D97706] font-medium">{name2}님</span>
               </div>
               <p className="text-base font-bold text-[#1a1a18] leading-tight">
                 {STEM_YIN_YANG[saju2.dayPillar.stem] ? '양(陽)' : '음(陰)'}의 {elementKoreanMap[elem2] || elem2}
               </p>
               <div className="space-y-1.5">
                 {personality2.strength.slice(0, 3).map((s, i) => (
                   <span key={i} className="block text-xs px-2 py-1 bg-[#EEF2FF] text-[#4F46E5] rounded-md">{s}</span>
                 ))}
                 {personality2.weakness.slice(0, 2).map((w, i) => (
                   <span key={i} className="block text-xs px-2 py-1 bg-[#FFF0F5] text-[#E8387A] rounded-md">{w}</span>
                 ))}
               </div>
             </div>
           </div>
           <p className="text-sm text-[#666] leading-relaxed">
             {scores.total >= 75
               ? `서로 다른 성격이지만, 차이를 이해하면 오히려 서로에게 배울 점이 많은 관계입니다.`
               : `두 분의 성격은 서로를 잘 보완해주는 조합입니다.`}
           </p>
         </section>
       )}

       {/* ===== 5. 오행(五行) 조화 비교 ===== */}
       <section className="result-card p-5">
         <div className="result-section-header">
           <Star className="w-4 h-4 text-[#7C5CFC]" />
           오행(五行) 조화 비교
         </div>
         {/* 헤더 행 */}
         <div className="flex items-center mb-3">
           <span className="text-xs font-semibold text-[#7C5CFC] w-16 flex-shrink-0">{name1}</span>
           <span className="flex-1 text-center text-xs text-[#999] font-medium">오행 분포</span>
           <span className="text-xs font-semibold text-[#F59E0B] w-16 text-right flex-shrink-0">{name2}</span>
         </div>
         <div className="space-y-2.5">
           {['木', '火', '土', '金', '水'].map((elem) => {
             const v1 = balance1.find(b => b.name === elem)?.value || 0;
             const v2 = balance2.find(b => b.name === elem)?.value || 0;
             const elemSymbols: Record<string, string> = { '木': '木', '火': '火', '土': '土', '金': '金', '水': '水' };
             return (
               <div key={elem} className="flex items-center gap-2">
                 {/* 왼쪽 바 (보라) */}
                 <div className="flex-1 flex justify-end">
                   <div className="flex items-center gap-1.5">
                     <div className="w-20 h-2 bg-[#F0EEF8] rounded-full overflow-hidden flex justify-end">
                       <motion.div
                         initial={{ width: 0 }}
                         animate={{ width: `${(v1 / 8) * 100}%` }}
                         transition={{ duration: 0.8 }}
                         className="h-full rounded-full bg-[#7C5CFC]"
                         style={{ marginLeft: 'auto' }}
                       />
                     </div>
                   </div>
                 </div>
                 {/* 중앙 레이블 */}
                 <div className="flex flex-col items-center w-12 flex-shrink-0">
                   <span className="text-sm font-bold text-[#1a1a18]">{elemSymbols[elem]}</span>
                   <span className="text-[10px] text-[#999]">{v1}:{v2}</span>
                 </div>
                 {/* 오른쪽 바 (주황) */}
                 <div className="flex-1">
                   <div className="w-20 h-2 bg-[#FEF3C7] rounded-full overflow-hidden">
                     <motion.div
                       initial={{ width: 0 }}
                       animate={{ width: `${(v2 / 8) * 100}%` }}
                       transition={{ duration: 0.8 }}
                       className="h-full rounded-full bg-[#F59E0B]"
                     />
                   </div>
                 </div>
               </div>
             );
           })}
         </div>
         {/* 오행 보완 분석 텍스트 */}
         <div className="mt-4 pt-4 border-t border-[#F0EEF8] space-y-2">
           {elementAnalysis1.weakest !== elementAnalysis2.weakest ? (
             <p className="text-sm text-[#444] leading-relaxed">
               {name1}님에게 부족한 <strong className="text-[#7C5CFC]">{withReading(elementAnalysis1.weakest)}</strong>의 기운을 {name2}님이 보완해줄 수 있고, {name2}님에게 부족한 <strong className="text-[#F59E0B]">{withReading(elementAnalysis2.weakest)}</strong>의 기운을 {name1}님이 채워줄 수 있는 <strong className="text-[#7C5CFC]">상호 보완적인 관계</strong>입니다.
             </p>
           ) : (
             <p className="text-sm text-[#444] leading-relaxed">
               두 분 모두 {withReading(elementAnalysis1.weakest)}의 기운이 부족합니다. {elementAnalysis1.supplement} 함께 이 부분을 보충하는 활동을 하면 좋겠습니다.
             </p>
           )}
         </div>
       </section>

       {/* ===== 6. 애정운 궁합 ===== */}
       <section className="result-card p-5">
         <div className="result-section-header">
           <Heart className="w-4 h-4 text-[#E8387A]" />
           애정운 궁합
         </div>
         {/* 종합 점수 서브헤더 */}
         <div className="flex items-center gap-2 mb-3">
           <Heart className="w-3.5 h-3.5 text-[#E8387A]" />
           <span className="text-sm text-[#555]">종합 점수</span>
           <span className="ml-auto text-base font-bold text-[#E8387A]">{scores.loveScore}점</span>
         </div>
         <div className="w-full h-2 bg-[#FFF0F5] rounded-full overflow-hidden mb-4">
           <motion.div
             initial={{ width: 0 }}
             animate={{ width: `${scores.loveScore}%` }}
             transition={{ duration: 1, ease: "easeOut" }}
             className="h-full rounded-full bg-[#E8387A]"
           />
         </div>
         <div className="space-y-3">
           {loveInterpretation.map((para, idx) => (
             <p key={idx} className={`text-sm leading-relaxed ${idx === 0 || idx === 1 ? 'font-medium text-[#1a1a18]' : 'text-[#555]'}`}>
               {para}
             </p>
           ))}
         </div>
         {/* 핑크 강조 박스 */}
         {scores.loveScore < 80 && (
           <div className="mt-4 p-3 rounded-xl bg-[#FFF0F5] border border-[#FFD6E7]">
             <p className="text-sm text-[#E8387A] leading-relaxed">
               서로의 다른 점을 인정하고 노력한다면 좋은 관계를 만들어 갈 수 있습니다.
             </p>
           </div>
         )}
       </section>

       {/* ===== 7. 재물 궁합 ===== */}
       <section className="result-card p-5">
         <div className="result-section-header">
           <Zap className="w-4 h-4 text-[#F59E0B]" />
           재물 궁합
         </div>
         <div className="flex items-center gap-2 mb-3">
           <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
           <span className="text-sm text-[#555]">종합 점수</span>
           <span className="ml-auto text-base font-bold text-[#F59E0B]">{scores.wealthScore}점</span>
         </div>
         <div className="w-full h-2 bg-[#FFFBEB] rounded-full overflow-hidden mb-4">
           <motion.div
             initial={{ width: 0 }}
             animate={{ width: `${scores.wealthScore}%` }}
             transition={{ duration: 1, ease: "easeOut" }}
             className="h-full rounded-full bg-[#F59E0B]"
           />
         </div>
         <div className="space-y-3">
           {wealthInterpretation.map((para, idx) => (
             <p key={idx} className="text-sm text-[#444] leading-relaxed">{para}</p>
           ))}
         </div>
       </section>

       {/* ===== 8. 가정운 궁합 ===== */}
       <section className="result-card p-5">
         <div className="result-section-header">
           <Home className="w-4 h-4 text-[#3B82F6]" />
           가정운 궁합
         </div>
         <div className="flex items-center gap-2 mb-3">
           <Home className="w-3.5 h-3.5 text-[#3B82F6]" />
           <span className="text-sm text-[#555]">종합 점수</span>
           <span className="ml-auto text-base font-bold text-[#3B82F6]">{scores.familyScore}점</span>
         </div>
         <div className="w-full h-2 bg-[#EFF6FF] rounded-full overflow-hidden mb-4">
           <motion.div
             initial={{ width: 0 }}
             animate={{ width: `${scores.familyScore}%` }}
             transition={{ duration: 1, ease: "easeOut" }}
             className="h-full rounded-full bg-[#3B82F6]"
           />
         </div>
         <div className="space-y-3">
           {familyInterpretation.map((para, idx) => (
             <p key={idx} className="text-sm text-[#444] leading-relaxed">{para}</p>
           ))}
         </div>
       </section>

       {/* ===== 9. 갈등 포인트 및 해결 방법 ===== */}
       <section className="result-card p-5">
         <div className="result-section-header">
           <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
           갈등 포인트 및 해결 방법
         </div>
         <div className="grid grid-cols-2 gap-3">
           {/* 주의할 갈등 */}
           <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-3 space-y-2">
             <div className="flex items-center gap-1.5 mb-2">
               <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
               <span className="text-xs font-bold text-[#D97706]">주의할 갈등</span>
             </div>
             <ul className="space-y-2">
               {conflictAdvice.conflicts.map((c, i) => (
                 <li key={i} className="text-xs text-[#555] leading-relaxed flex items-start gap-1.5">
                   <span className="w-1 h-1 bg-[#F59E0B] rounded-full mt-1.5 flex-shrink-0" />
                   {c}
                 </li>
               ))}
             </ul>
           </div>
           {/* 관계 개선 방법 */}
           <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-3 space-y-2">
             <div className="flex items-center gap-1.5 mb-2">
               <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
               <span className="text-xs font-bold text-[#16A34A]">관계 개선 방법</span>
             </div>
             <ul className="space-y-2">
               {conflictAdvice.solutions.map((s, i) => (
                 <li key={i} className="text-xs text-[#555] leading-relaxed flex items-start gap-1.5">
                   <span className="w-1 h-1 bg-[#22C55E] rounded-full mt-1.5 flex-shrink-0" />
                   {s}
                 </li>
               ))}
             </ul>
           </div>
         </div>
       </section>

       {/* ===== 10. 전문가 종합 조언 ===== */}
       <section className="result-card p-5">
         <div className="result-section-header">
           <Shield className="w-4 h-4 text-[#7C5CFC]" />
           전문가 종합 조언
         </div>
         <div className="space-y-4">
           {finalAdvice.map((para, idx) => (
             <p
               key={idx}
               className="text-sm text-[#444] leading-relaxed"
               dangerouslySetInnerHTML={{
                 __html: para.replace(
                   /(노력에 따라 얼마든지 좋아질 수 있습니다|궁합이 나빠도 서로를 이해하는 마음이 있으면 누구보다 행복한 커플이 됩니다|가장 중요한 것은 두 분의 마음입니다)/g,
                   '<strong class="text-[#7C5CFC]">$1</strong>'
                 )
               }}
             />
           ))}
         </div>
         {/* 초록 강조 박스 */}
         <div className="mt-4 p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
           <p className="text-sm text-[#16A34A] leading-relaxed">
             궁합은 참고 사항일 뿐, 두 사람의 관계를 결정짓는 절대적인 기준이 아닙니다. 가장 중요한 것은 두 분의 마음입니다.
           </p>
         </div>
       </section>

       {/* ===== 11. 두 사람의 사주팔자표 (아코디언) ===== */}
       <section className="result-card overflow-hidden">
         <Accordion type="single" collapsible>
           <AccordionItem value="saju-chart" className="border-none">
             <AccordionTrigger className="px-5 py-4 hover:no-underline">
               <div className="flex items-center gap-2 text-sm font-bold text-[#1a1a18]">
                 <Users className="w-4 h-4 text-[#7C5CFC]" />
                 두 사람의 사주팔자(四柱八字)
               </div>
             </AccordionTrigger>
             <AccordionContent className="px-5 pb-5 space-y-4">
               <div>
                 <div className="flex items-center gap-2 mb-2">
                   <span className="w-5 h-5 rounded-full bg-[#7C5CFC] text-white text-[10px] font-bold flex items-center justify-center">1</span>
                   <span className="text-sm font-bold text-[#7C5CFC]">{name1}님의 사주</span>
                 </div>
                 <div className="rounded-xl border border-[#E8E5F0] overflow-hidden">
                   <SajuChart result={saju1} theme="purple" />
                 </div>
               </div>
               <div>
                 <div className="flex items-center gap-2 mb-2">
                   <span className="w-5 h-5 rounded-full bg-[#F59E0B] text-white text-[10px] font-bold flex items-center justify-center">2</span>
                   <span className="text-sm font-bold text-[#D97706]">{name2}님의 사주</span>
                 </div>
                 <div className="rounded-xl border border-[#F0EDE5] overflow-hidden">
                   <SajuChart result={saju2} theme="purple" />
                 </div>
               </div>
             </AccordionContent>
           </AccordionItem>
         </Accordion>
       </section>

       {/* ===== 12. 내 사주팔자 자세히 보기 배너 ===== */}
       <Link href="/lifelong-saju">
         <div className="result-card p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
           <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
             <Calendar className="w-6 h-6 text-[#7C5CFC]" />
           </div>
           <div className="flex-1 min-w-0">
             <p className="text-sm font-bold text-[#1a1a18]">내 사주팔자 자세히 보기</p>
             <p className="text-xs text-[#7C5CFC] mt-0.5">일간·십신·오행 상세 분석 →</p>
           </div>
           <ChevronDown className="w-5 h-5 text-[#7C5CFC] rotate-[-90deg] flex-shrink-0" />
         </div>
       </Link>

       {/* ===== 13. 지금 읽어볼 만한 이야기 ===== */}
       <RecommendedContent />

       {/* ===== 14. 하단 다크 CTA 배너 ===== */}
       <section
         className="rounded-2xl overflow-hidden p-6 text-center space-y-4"
         style={{ background: 'linear-gradient(160deg, #2D1B5E 0%, #1A0F3C 100%)' }}
       >
         <p className="text-xs text-white/50">다른 서비스도 확인해보세요</p>
         <p className="text-xl font-bold text-white leading-snug">나의 오늘 운세는<br />어떨까요?</p>
         <div className="flex gap-3 justify-center">
           <Link href="/daily-fortune">
             <button className="px-6 py-3 rounded-full bg-[#E8387A] text-white font-bold text-sm hover:bg-[#d42e6e] transition-colors">
               오늘운세 보기
             </button>
           </Link>
           <button
             onClick={() => setResult(null)}
             className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-colors"
           >
             다시 보기
           </button>
         </div>
       </section>

       {/* 공유 버튼 */}
       <button
         onClick={handleShare}
         className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-[#E8E5F0] bg-white text-sm font-medium text-[#7C5CFC] hover:bg-[#EEF2FF] transition-all"
       >
         {shareCopied ? (
           <>
             <Check className="w-4 h-4" />
             링크 복사됨
           </>
         ) : (
           <>
             <Share2 className="w-4 h-4" />
             친구에게 공유하기
           </>
         )}
       </button>

     </motion.div>
   </main>
 </div>
 </>
 );
}
