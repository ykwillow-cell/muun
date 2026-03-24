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
 let birthDateStr1 = data.birthDate1;
 if (typeof birthDateStr1 !== 'string') {
 if (birthDateStr1 instanceof Date) {
 birthDateStr1 = birthDateStr1.toISOString().split('T')[0];
 } else {
 birthDateStr1 = String(birthDateStr1);
 }
 }
 let birthDateStr2 = data.birthDate2;
 if (typeof birthDateStr2 !== 'string') {
 if (birthDateStr2 instanceof Date) {
 birthDateStr2 = birthDateStr2.toISOString().split('T')[0];
 } else {
 birthDateStr2 = String(birthDateStr2);
 }
 }
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
     const date1 = convertToSolarDate(birthDateStrForConverter1, time1, data.calendarType1);
     const date2 = convertToSolarDate(birthDateStrForConverter2, time2, data.calendarType2);
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

 const commonMaxWidth = "w-full max-w-2xl mx-auto";

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
 <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"궁합은 무료로 볼 수 있나요?","acceptedAnswer":{"@type":"Answer","text":"네, 무운의 궁합 서비스는 100% 무료입니다. 회원가입이나 개인정보 저장 없이 두 사람의 생년월일만 입력하면 즉시 궁합을 확인할 수 있습니다."}},{"@type":"Question","name":"사주 궁합에서 무엇을 알 수 있나요?","acceptedAnswer":{"@type":"Answer","text":"오행 조화, 음양 균형, 연애운, 재물운, 가정운 등 두 사람의 사주팔자를 기반으로 종합적인 궁합 점수와 상세 분석을 제공합니다."}},{"@type":"Question","name":"궁합은 연인과 부부 사이에만 해당되나요?","acceptedAnswer":{"@type":"Answer","text":"연인, 부부 사이는 물론 친구, 직장 동료, 사업 파트너 등 다양한 관계에서의 궁합도 확인할 수 있습니다."}},{"@type":"Question","name":"궁합 점수가 낙으면 나쁜 것인가요?","acceptedAnswer":{"@type":"Answer","text":"궁합 점수는 참고 지표일 뿐 절대적인 기준이 아닙니다. 점수가 낙더라도 서로의 노력과 이해로 충분히 좋은 관계를 만들어갈 수 있습니다."}}]})}</script>
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
 <div className="compatibility-page min-h-screen bg-[#FBF3F3] text-foreground pb-16 antialiased">

 {/* 헤더 — 흰색 불투명, 시안과 동일 */}
 <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
 <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
 <Link href="/">
 <Button variant="ghost" className="mr-2 text-[#1a1a18] hover:bg-black/[0.06] min-w-[44px] min-h-[44px] flex items-center gap-1 px-2">
   <ChevronLeft className="h-5 w-5" />
   <span className="text-sm font-medium">{backLabel}</span>
 </Button>
 </Link>
 <h2 className="text-base font-bold text-[#1a1a18]">궁합 풀이</h2>
 </div>
 </header>

 <main className="container mx-auto max-w-[1280px] px-4 py-6 md:py-8">
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
     <input
       type="checkbox"
       id="isLeapMonth1"
       checked={form.watch("isLeapMonth1") || false}
       onChange={(e) => form.setValue("isLeapMonth1", e.target.checked)}
       className="w-3.5 h-3.5 rounded"
       style={{ accentColor: '#D4537E' }}
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
     <input
       type="checkbox"
       id="isLeapMonth2"
       checked={form.watch("isLeapMonth2") || false}
       onChange={(e) => form.setValue("isLeapMonth2", e.target.checked)}
       className="w-3.5 h-3.5 rounded"
       style={{ accentColor: '#D4537E' }}
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

 // 세부 점수 항목
 const scoreItems = [
 { label: '오행 조화', score: scores.elementScore, icon: <Activity className="w-4 h-4" /> },
 { label: '음양 균형', score: scores.yinYangScore, icon: <Star className="w-4 h-4" /> },
 { label: '오행 보완', score: scores.complementScore, icon: <Shield className="w-4 h-4" /> },
 { label: '애정운', score: scores.loveScore, icon: <Heart className="w-4 h-4" /> },
 { label: '재물운', score: scores.wealthScore, icon: <Zap className="w-4 h-4" /> },
 { label: '가정운', score: scores.familyScore, icon: <Home className="w-4 h-4" /> },
 ];

 // 5단계: 공유 핸들러
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
 <meta name="robots" content="noindex, nofollow" />
 <meta name="keywords" content="궁합, 무료궁합, 사주궁합, 연애궁합, 결혼궁합, 오행궁합, 무료궁합보기, 커플궁합" />
 <link rel="canonical" href="https://muunsaju.com/compatibility" />
 </Helmet>
 {/* 7단계: tintColor CSS 변수 정의 */}
 <style>{`
   .compatibility-page { --compatibility-accent: #E8387A; }
 `}</style>
 <div className="compatibility-page min-h-screen bg-background text-foreground pb-16 relative antialiased">
 <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
 <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]" />
 <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px]" />
 </div>

 {/* Header */}
 <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-black/10">
 <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
 <div className="flex items-center">
 <Button variant="ghost" onClick={() => setResult(null)} className="mr-2 text-[#1a1a18] hover:bg-black/[0.06] min-w-[44px] min-h-[44px] flex items-center gap-1 px-2">
   <ChevronLeft className="h-5 w-5" />
   <span className="text-sm font-medium">궁합 입력</span>
 </Button>
 <h1 className="text-base md:text-lg font-bold text-[#1a1a18]">궁합 결과</h1>
 </div>
 <Button variant="ghost" size="icon" className="text-[var(--compatibility-accent,#E8387A)] min-w-[44px] min-h-[44px]" onClick={handleShare}>
 <Share2 className="h-5 w-5" />
 </Button>
 </div>
 </header>

 <main className="relative z-10 px-4 py-5 md:py-6">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className={`${commonMaxWidth} space-y-6 md:space-y-8`}
 >
 {/* ===== 1. 궁합 점수 원형 그래프 ===== */}
 <section className="flex flex-col items-center justify-center space-y-4 py-4">
 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 backdrop-blur-xl">
 <Heart className="w-3.5 h-3.5 text-[var(--compatibility-accent,#E8387A)]" />
 <span className="text-[10px] md:text-sm md:text-xs font-bold tracking-wider text-[var(--compatibility-accent,#E8387A)] uppercase">궁합 종합 점수</span>
 </div>
 
 <div className="relative w-36 h-36 md:w-44 md:h-44 mx-auto">
 <svg className="w-full h-full" viewBox="0 0 100 100">
 <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-[#1a1a18]/5" />
 <motion.circle
 cx="50" cy="50" r="45" fill="none"
 stroke="url(#compat-gradient)" strokeWidth="8"
 strokeDasharray="283"
 initial={{ strokeDashoffset: 283 }}
 animate={{ strokeDashoffset: 283 - (283 * scores.total) / 100 }}
 transition={{ duration: 1.5, ease: "easeOut" }}
 strokeLinecap="round"
 transform="rotate(-90 50 50)"
 />
 <defs>
 <linearGradient id="compat-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" stopColor="#E8387A" />
 <stop offset="100%" stopColor="#ef4444" />
 </linearGradient>
 </defs>
 </svg>
 <div className="absolute inset-0 flex flex-col items-center justify-center">
 <span className="text-4xl md:text-5xl font-black text-[#1a1a18]">{scores.total}</span>
 <span className="text-[10px] md:text-sm md:text-xs text-[var(--compatibility-accent,#E8387A)] font-bold mt-0.5">{getScoreLabel(scores.total)}</span>
 </div>
 </div>
 
 <div className="flex items-center justify-center gap-3 text-base">
 <span className="text-[var(--compatibility-accent,#E8387A)] font-bold">{name1}</span>
 <Heart className="w-5 h-5 text-[var(--compatibility-accent,#E8387A)] animate-pulse" />
 <span className="text-red-600 font-bold">{name2}</span>
 </div>
 </section>

 {/* ===== 2. 세부 점수 그래프 ===== */}
 <section>
 <h2 className="text-lg md:text-xl font-bold text-[#1a1a18] flex items-center gap-2 mb-4">
 <TrendingUp className="w-5 h-5 text-[var(--compatibility-accent,#E8387A)]" />
 세부 궁합 점수
 </h2>
 <Card className="rounded-xl overflow-hidden" data-result-card>
 <CardContent className="p-4 md:p-6 space-y-4">
 {scoreItems.map((item, idx) => (
 <div key={idx} className="space-y-1.5">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className={getScoreColor(item.score)}>{item.icon}</span>
 <span className="text-base md:text-sm text-[#1a1a18] font-medium">{item.label}</span>
 </div>
 <span className={`text-base md:text-sm font-bold ${getScoreColor(item.score)}`}>{item.score}점</span>
 </div>
 <div className="w-full h-2.5 bg-black/[0.05] rounded-full overflow-hidden">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: `${item.score}%` }}
 transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
 className={`h-full rounded-full ${getScoreBarColor(item.score)}`}
 />
 </div>
 </div>
 ))}
 </CardContent>
 </Card>
 </section>

 {/* ===== 3. 두 사람의 사주팔자표 ===== */}
 <section>
 <h2 className="text-lg md:text-xl font-bold text-[#1a1a18] flex items-center gap-2 mb-4">
 <Users className="w-5 h-5 text-[var(--compatibility-accent,#E8387A)]" />
 두 사람의 사주팔자(四柱八字)
 </h2>
 
 {/* 첫 번째 사람 */}
 <div className="mb-4">
 <div className="flex items-center gap-2 mb-2">
 <div className="w-5 h-5 rounded-full bg-[var(--compatibility-accent,#E8387A)] text-white text-xs md:text-[10px] font-bold flex items-center justify-center">1</div>
 <span className="text-base md:text-sm font-bold text-[var(--compatibility-accent,#E8387A)]">{name1}님의 사주</span>
 </div>
 <Card className="rounded-xl overflow-hidden" data-result-card>
 <CardContent className="p-3 md:p-4">
 <SajuChart result={saju1} theme="purple" />
 </CardContent>
 </Card>
 </div>
 
 {/* 두 번째 사람 */}
 <div>
 <div className="flex items-center gap-2 mb-2">
 <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs md:text-[10px] font-bold flex items-center justify-center">2</div>
 <span className="text-base md:text-sm font-bold text-red-600">{name2}님의 사주</span>
 </div>
 <Card className="rounded-xl overflow-hidden" data-result-card>
 <CardContent className="p-3 md:p-4">
 <SajuChart result={saju2} theme="purple" />
 </CardContent>
 </Card>
 </div>
 </section>

 {/* ===== 4. 일간 궁합 종합 해석 ===== */}
 <section>
 <h2 className="text-lg md:text-xl font-bold text-[#1a1a18] flex items-center gap-2 mb-4">
 <Quote className="w-5 h-5 text-[var(--compatibility-accent,#E8387A)]" />
 일간(日干) 궁합 종합 해석
 </h2>
 <Card className="rounded-xl overflow-hidden" data-result-card>
 <CardContent className="p-4 md:p-6">
 <div className="space-y-4">
 {overallInterpretation.map((para, idx) => (
 <p key={idx} className="text-sm md:text-[15px] text-[#1a1a18]/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-pink-600">$1</strong>') }} />
 ))}
 </div>
 </CardContent>
 </Card>
 </section>

 {/* ===== 5. 성격 궁합 비교 ===== */}
 {personality1 && personality2 && (
 <section>
 <h2 className="text-lg md:text-xl font-bold text-[#1a1a18] flex items-center gap-2 mb-4">
 <User className="w-5 h-5 text-[var(--compatibility-accent,#E8387A)]" />
 성격 궁합 비교
 </h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {/* 첫 번째 사람 성격 */}
 <Card className="bg-black/[0.05] border-pink-500/20 rounded-xl overflow-hidden">
 <CardHeader className="bg-pink-500/5 border-b border-black/10 py-3 px-4">
 <CardTitle className="text-base md:text-sm font-bold text-[var(--compatibility-accent,#E8387A)] flex items-center gap-2">
 <div className="w-5 h-5 rounded-full bg-[var(--compatibility-accent,#E8387A)] text-white text-xs md:text-[10px] font-bold flex items-center justify-center">1</div>
 {name1}님 — {personality1.name}
 </CardTitle>
 </CardHeader>
 <CardContent className="p-4 space-y-3">
 <div>
 <p className="text-xs md:text-[10px] text-[#999891] mb-1">상징</p>
 <p className="text-base md:text-sm text-[#1a1a18]/90">{personality1.nature} ({personality1.symbol})</p>
 </div>
 <div>
 <p className="text-xs md:text-[10px] text-green-600 mb-1">강점</p>
 <div className="flex flex-wrap gap-1.5">
 {personality1.strength.map((s, i) => (
 <span key={i} className="text-[11px] px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-600">{s}</span>
 ))}
 </div>
 </div>
 <div>
 <p className="text-xs md:text-[10px] text-red-600 mb-1">약점</p>
 <div className="flex flex-wrap gap-1.5">
 {personality1.weakness.map((w, i) => (
 <span key={i} className="text-[11px] px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-600">{w}</span>
 ))}
 </div>
 </div>
 </CardContent>
 </Card>

 {/* 두 번째 사람 성격 */}
 <Card className="bg-black/[0.05] border-red-500/20 rounded-xl overflow-hidden">
 <CardHeader className="bg-red-500/5 border-b border-black/10 py-3 px-4">
 <CardTitle className="text-base md:text-sm font-bold text-red-600 flex items-center gap-2">
 <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs md:text-[10px] font-bold flex items-center justify-center">2</div>
 {name2}님 — {personality2.name}
 </CardTitle>
 </CardHeader>
 <CardContent className="p-4 space-y-3">
 <div>
 <p className="text-xs md:text-[10px] text-[#999891] mb-1">상징</p>
 <p className="text-base md:text-sm text-[#1a1a18]/90">{personality2.nature} ({personality2.symbol})</p>
 </div>
 <div>
 <p className="text-xs md:text-[10px] text-green-600 mb-1">강점</p>
 <div className="flex flex-wrap gap-1.5">
 {personality2.strength.map((s, i) => (
 <span key={i} className="text-[11px] px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-600">{s}</span>
 ))}
 </div>
 </div>
 <div>
 <p className="text-xs md:text-[10px] text-red-600 mb-1">약점</p>
 <div className="flex flex-wrap gap-1.5">
 {personality2.weakness.map((w, i) => (
 <span key={i} className="text-[11px] px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-600">{w}</span>
 ))}
 </div>
 </div>
 </CardContent>
 </Card>
 </div>
 </section>
 )}

 {/* ===== 6. 오행 조화 비교 분석 ===== */}
 <section>
 <h2 className="text-lg md:text-xl font-bold text-[#1a1a18] flex items-center gap-2 mb-4">
 <Activity className="w-5 h-5 text-[var(--compatibility-accent,#E8387A)]" />
 오행(五行) 조화 비교
 </h2>
 <Card className="rounded-xl overflow-hidden" data-result-card>
 <CardContent className="p-4 md:p-6 space-y-5">
 {/* 오행 비교 바 차트 */}
 {['木', '火', '土', '金', '水'].map((elem) => {
 const v1 = balance1.find(b => b.name === elem)?.value || 0;
 const v2 = balance2.find(b => b.name === elem)?.value || 0;
 return (
 <div key={elem} className="space-y-1.5">
 <div className="flex items-center justify-between">
 <span className={`text-base md:text-sm font-bold ${ELEMENT_TEXT[elem]}`}>{withReading(elem)}</span>
 <span className="text-sm md:text-xs text-[#999891]">{name1}: {v1}개 / {name2}: {v2}개</span>
 </div>
 <div className="grid grid-cols-2 gap-1">
 <div className="flex items-center gap-1">
 <span className="text-xs md:text-[10px] text-[var(--compatibility-accent,#E8387A)] w-6">{name1.slice(0, 1)}</span>
 <div className="flex-1 h-2 bg-black/[0.05] rounded-full overflow-hidden">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: `${(v1 / 8) * 100}%` }}
 transition={{ duration: 0.8 }}
 className={`h-full rounded-full ${ELEMENT_BAR_COLOR[elem]} opacity-80`}
 />
 </div>
 </div>
 <div className="flex items-center gap-1">
 <span className="text-xs md:text-[10px] text-red-600 w-6">{name2.slice(0, 1)}</span>
 <div className="flex-1 h-2 bg-black/[0.05] rounded-full overflow-hidden">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: `${(v2 / 8) * 100}%` }}
 transition={{ duration: 0.8 }}
 className={`h-full rounded-full ${ELEMENT_BAR_COLOR[elem]} opacity-60`}
 />
 </div>
 </div>
 </div>
 </div>
 );
 })}
 
 {/* 오행 보완 분석 */}
 <div className="border-t border-black/10 pt-4 space-y-3">
 <p className="text-base md:text-sm text-[#1a1a18]/90 leading-relaxed">
 {cleanAIContent(elementAnalysis1.analysis)}
 </p>
 <p className="text-base md:text-sm text-[#1a1a18]/90 leading-relaxed">
 {cleanAIContent(elementAnalysis2.analysis)}
 </p>
 {elementAnalysis1.weakest !== elementAnalysis2.weakest && (
 <p className="text-base md:text-sm text-[var(--compatibility-accent,#E8387A)] leading-relaxed">
 {name1}님에게 부족한 {withReading(elementAnalysis1.weakest)}의 기운을 {name2}님이 보완해줄 수 있고, {name2}님에게 부족한 {withReading(elementAnalysis2.weakest)}의 기운을 {name1}님이 채워줄 수 있는 상호 보완적인 관계입니다.
 </p>
 )}
 {elementAnalysis1.weakest === elementAnalysis2.weakest && (
 <p className="text-base md:text-sm text-yellow-700 leading-relaxed">
 두 분 모두 {withReading(elementAnalysis1.weakest)}의 기운이 부족합니다. {elementAnalysis1.supplement} 함께 이 부분을 보충하는 활동을 하면 좋겠습니다.
 </p>
 )}
 </div>
 </CardContent>
 </Card>
 </section>

 {/* ===== 7. 애정운 궁합 ===== */}
 <section>
 <h2 className="text-lg md:text-xl font-bold text-[#1a1a18] flex items-center gap-2 mb-4">
 <Heart className="w-5 h-5 text-[var(--compatibility-accent,#E8387A)]" />
 애정운 궁합
 <span className={`text-base md:text-sm font-bold ${getScoreColor(scores.loveScore)}`}>({scores.loveScore}점)</span>
 </h2>
 <Card className="rounded-xl overflow-hidden" data-result-card>
 <CardContent className="p-4 md:p-6 space-y-4">
 {loveInterpretation.map((para, idx) => (
 <p key={idx} className="text-sm md:text-[15px] text-[#1a1a18]/90 leading-relaxed">{para}</p>
 ))}
 </CardContent>
 </Card>
 </section>

 {/* ===== 8. 재물 궁합 ===== */}
 <section>
 <h2 className="text-lg md:text-xl font-bold text-[#1a1a18] flex items-center gap-2 mb-4">
 <Zap className="w-5 h-5 text-yellow-600" />
 재물 궁합
 <span className={`text-base md:text-sm font-bold ${getScoreColor(scores.wealthScore)}`}>({scores.wealthScore}점)</span>
 </h2>
 <Card className="rounded-xl overflow-hidden" data-result-card>
 <CardContent className="p-4 md:p-6 space-y-4">
 {wealthInterpretation.map((para, idx) => (
 <p key={idx} className="text-sm md:text-[15px] text-[#1a1a18]/90 leading-relaxed">{para}</p>
 ))}
 </CardContent>
 </Card>
 </section>

 {/* ===== 9. 가정운 궁합 ===== */}
 <section>
 <h2 className="text-lg md:text-xl font-bold text-[#1a1a18] flex items-center gap-2 mb-4">
 <Home className="w-5 h-5 text-green-600" />
 가정운 궁합
 <span className={`text-base md:text-sm font-bold ${getScoreColor(scores.familyScore)}`}>({scores.familyScore}점)</span>
 </h2>
 <Card className="rounded-xl overflow-hidden" data-result-card>
 <CardContent className="p-4 md:p-6 space-y-4">
 {familyInterpretation.map((para, idx) => (
 <p key={idx} className="text-sm md:text-[15px] text-[#1a1a18]/90 leading-relaxed">{para}</p>
 ))}
 </CardContent>
 </Card>
 </section>

 {/* ===== 10. 갈등 포인트 및 해결 방법 ===== */}
 <section>
 <h2 className="text-lg md:text-xl font-bold text-[#1a1a18] flex items-center gap-2 mb-4">
 <AlertTriangle className="w-5 h-5 text-orange-600" />
 갈등 포인트 및 해결 방법
 </h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <Card className="bg-black/[0.05] border-orange-500/20 rounded-xl overflow-hidden">
 <CardHeader className="bg-orange-500/5 border-b border-black/10 py-3 px-4">
 <CardTitle className="text-base md:text-sm font-bold text-orange-600 flex items-center gap-2">
 <AlertTriangle className="w-4 h-4" /> 주의할 갈등 포인트
 </CardTitle>
 </CardHeader>
 <CardContent className="p-4">
 <ul className="space-y-3">
 {conflictAdvice.conflicts.map((c, i) => (
 <li key={i} className="text-base md:text-sm text-[#1a1a18] leading-relaxed flex items-start gap-2">
 <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0" />
 {c}
 </li>
 ))}
 </ul>
 </CardContent>
 </Card>
 <Card className="bg-black/[0.05] border-green-500/20 rounded-xl overflow-hidden">
 <CardHeader className="bg-green-500/5 border-b border-black/10 py-3 px-4">
 <CardTitle className="text-base md:text-sm font-bold text-green-600 flex items-center gap-2">
 <CheckCircle2 className="w-4 h-4" /> 관계 개선 방법
 </CardTitle>
 </CardHeader>
 <CardContent className="p-4">
 <ul className="space-y-3">
 {conflictAdvice.solutions.map((s, i) => (
 <li key={i} className="text-base md:text-sm text-[#1a1a18] leading-relaxed flex items-start gap-2">
 <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
 {s}
 </li>
 ))}
 </ul>
 </CardContent>
 </Card>
 </div>
 </section>

 {/* ===== 11. 종합 조언 ===== */}
 <section>
 <h2 className="text-lg md:text-xl font-bold text-[#1a1a18] flex items-center gap-2 mb-4">
 <Sparkles className="w-5 h-5 text-[var(--compatibility-accent,#E8387A)]" />
 전문가 종합 조언
 </h2>
 <Card className="bg-gradient-to-br from-pink-500/10 to-red-500/10 border-pink-500/20 rounded-xl overflow-hidden">
 <CardContent className="p-4 md:p-6 space-y-4">
 {finalAdvice.map((para, idx) => (
 <p key={idx} className="text-sm md:text-[15px] text-[#1a1a18]/90 leading-relaxed">{para}</p>
 ))}
 </CardContent>
 </Card>
 </section>

 {/* ===== 12. 십신(십성) 용어 설명 ===== */}
 <section>
 <SajuGlossary />
 </section>

 {/* ===== 하단 버튼 ===== */}
 <div className="space-y-2 pt-4">
 {saju1 && (
 <FortuneShareCard
 result={saju1}
 result2={saju2}
 userName={`${name1} ♥ ${name2}`}
 type="compatibility"
 name1={name1}
 name2={name2}
 score={scores.total}
 loveScore={scores.loveScore}
 familyScore={scores.familyScore}
 />
 )}

 {/* 5단계: 공유 버튼 — Web Share API 스타일 (DictionaryDetail 동일 패턴) */}
 <button
   onClick={handleShare}
   className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-black/10 bg-white/80 text-sm font-medium text-[#4E5968] hover:border-[var(--compatibility-accent,#E8387A)]/40 hover:text-[var(--compatibility-accent,#E8387A)] hover:bg-[var(--compatibility-accent,#E8387A)]/05 transition-all shadow-sm"
 >
   {shareCopied ? (
     <>
       <Check className="w-4 h-4 text-[var(--compatibility-accent,#E8387A)]" />
       링크 복사됨
     </>
   ) : (
     <>
       <Share2 className="w-4 h-4" />
       친구에게 공유하기
     </>
   )}
 </button>

 <Button 
 variant="ghost"
 className="w-full text-[#5a5a56] hover:text-[#1a1a18] hover:bg-black/[0.05] h-11 rounded-xl font-medium text-base md:text-sm"
 onClick={() => setResult(null)}
 >
 다른 정보로 다시 보기
 </Button>
 </div>
 {/* 콘텐츠 추천 섹션 */}
 <RecommendedContent />
 </motion.div>
 </main>
 </div>
 </>
 );
}
