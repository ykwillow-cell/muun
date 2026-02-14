import { useState, useEffect } from "react";
import { useCanonical } from '@/lib/use-canonical';
import { setCompatibilityOGTags } from '@/lib/og-tags';
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Heart, Share2, Sparkles, User, Activity, Calendar, Clock, Users, Star, Zap, Briefcase, Shield, Home, ChevronDown, ChevronUp, Quote, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";
import { autoLinkKeywordsToJSX } from "@/lib/auto-link-keywords";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { calculateSaju, SajuResult, calculateElementBalance, STEM_ELEMENTS, BRANCH_ELEMENTS, STEM_YIN_YANG } from "@/lib/saju";
import { convertToSolarDate } from "@/lib/lunar-converter";
import SajuChart from "@/components/SajuChart";
import SajuGlossary from "@/components/SajuGlossary";
import CompatibilityContent from "@/components/CompatibilityContent";
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

// 폼 스키마 정의
const formSchema = z.object({
  name1: z.string().min(1, "첫 번째 이름을 입력해주세요"),
  gender1: z.enum(["male", "female"]),
  birthDate1: z.string().min(1, "첫 번째 생년월일을 입력해주세요"),
  birthTime1: z.string().min(1, "첫 번째 태어난 시간을 입력해주세요"),
  calendarType1: z.enum(["solar", "lunar"]),
  isLeapMonth1: z.boolean().optional(),
  name2: z.string().min(1, "두 번째 이름을 입력해주세요"),
  gender2: z.enum(["male", "female"]),
  birthDate2: z.string().min(1, "두 번째 생년월일을 입력해주세요"),
  birthTime2: z.string().min(1, "두 번째 태어난 시간을 입력해주세요"),
  calendarType2: z.enum(["solar", "lunar"]),
  isLeapMonth2: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
  '木': 'text-green-400',
  '火': 'text-red-400',
  '土': 'text-yellow-400',
  '金': 'text-slate-200',
  '水': 'text-blue-400',
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
  if (score >= 85) return 'text-pink-400';
  if (score >= 70) return 'text-green-400';
  if (score >= 55) return 'text-yellow-400';
  return 'text-red-400';
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
    paragraphs.push(
      `두 분의 애정 궁합은 매우 좋습니다. 서로의 감정을 깊이 이해하고, 자연스럽게 상대방이 원하는 것을 알아차리는 능력이 있습니다. 함께 있을 때 편안함과 설렘이 공존하는 이상적인 관계를 만들어갈 수 있습니다. 다만 너무 편안해져서 서로에 대한 관심이 줄어들지 않도록 꾸준한 노력이 필요합니다.`
    );
  } else if (score >= 70) {
    paragraphs.push(
      `두 분의 애정 궁합은 양호합니다. 서로에 대한 호감과 존중이 바탕이 되어 안정적인 관계를 유지할 수 있습니다. 가끔 의견 차이가 있을 수 있지만, 대화를 통해 충분히 해결할 수 있는 수준입니다. 서로의 사랑 표현 방식이 다를 수 있으니, 상대방의 방식을 이해하려는 노력이 중요합니다.`
    );
  } else if (score >= 55) {
    paragraphs.push(
      `두 분의 애정 궁합은 보통 수준입니다. 서로 다른 감정 표현 방식으로 인해 오해가 생길 수 있지만, 이를 극복하면 오히려 더 깊은 유대감을 형성할 수 있습니다. 상대방의 감정을 먼저 헤아려주는 배려가 관계를 더욱 발전시키는 열쇠입니다.`
    );
  } else {
    paragraphs.push(
      `두 분의 애정 궁합에서는 서로 다른 감정 패턴으로 인한 갈등이 예상됩니다. 하지만 이는 극복할 수 없는 것이 아닙니다. 오히려 서로의 다름을 인정하고 받아들이는 과정에서 더욱 성숙한 사랑을 경험할 수 있습니다. 정기적인 대화 시간을 갖고, 서로의 감정을 솔직하게 나누는 것이 중요합니다.`
    );
  }
  
  return paragraphs;
}

// 재물 궁합 해석
function generateWealthInterpretation(saju1: SajuResult, saju2: SajuResult, name1: string, name2: string, score: number): string[] {
  const elem1 = elementMap[saju1.dayPillar.stem];
  const elem2 = elementMap[saju2.dayPillar.stem];
  const paragraphs: string[] = [];
  
  if (score >= 80) {
    paragraphs.push(
      `두 분의 재물 궁합은 매우 좋습니다. 함께 재물을 모으고 관리하는 데 있어 시너지가 발생합니다. 한 분이 돈을 벌어오는 능력이 뛰어나다면, 다른 분은 이를 잘 관리하고 불려나가는 능력이 있어 재정적으로 안정된 가정을 꾸릴 수 있습니다.`
    );
    paragraphs.push(
      `부동산이나 장기 투자에서 좋은 결과를 얻을 가능성이 높으며, 함께 사업을 하더라도 서로의 역할 분담이 자연스럽게 이루어집니다. 다만 큰 지출에 대해서는 반드시 상의하는 습관을 들이세요.`
    );
  } else if (score >= 65) {
    paragraphs.push(
      `두 분의 재물 궁합은 양호한 편입니다. 돈에 대한 가치관이 크게 다르지 않아 재정 관리에서 큰 갈등은 없을 것입니다. 다만 저축과 소비의 균형에 대해 미리 합의해두면 더욱 좋습니다.`
    );
    paragraphs.push(
      `함께 재테크 목표를 세우고 정기적으로 재정 상태를 점검하는 습관을 들이면, 안정적인 경제 기반을 마련할 수 있습니다. 각자의 용돈은 간섭하지 않되, 가정 경제는 투명하게 운영하는 것이 좋습니다.`
    );
  } else {
    paragraphs.push(
      `두 분의 재물 궁합에서는 돈에 대한 가치관 차이가 있을 수 있습니다. 한 분은 저축을 중시하고 다른 분은 소비를 즐기는 등의 차이가 갈등의 원인이 될 수 있습니다.`
    );
    paragraphs.push(
      `이를 해결하기 위해서는 결혼 전에 재정 관리 방식에 대해 충분히 대화하고, 공동 계좌와 개인 계좌를 분리하는 등의 구체적인 방법을 미리 정해두는 것이 좋습니다. 서로의 소비 패턴을 비난하기보다는 이해하려는 노력이 필요합니다.`
    );
  }
  
  return paragraphs;
}

// 가정운 해석
function generateFamilyInterpretation(saju1: SajuResult, saju2: SajuResult, name1: string, name2: string, score: number): string[] {
  const yang1 = STEM_YIN_YANG[saju1.dayPillar.stem];
  const yang2 = STEM_YIN_YANG[saju2.dayPillar.stem];
  const paragraphs: string[] = [];
  
  if (yang1 !== yang2) {
    paragraphs.push(
      `두 분은 음양(陰陽)이 조화를 이루는 관계입니다. ${yang1 ? name1 + '님이 양(陽)' : name1 + '님이 음(陰)'}의 기운, ${yang2 ? name2 + '님이 양(陽)' : name2 + '님이 음(陰)'}의 기운을 가지고 있어 가정 내에서 자연스러운 역할 분담이 이루어집니다. 한 분이 적극적으로 나아갈 때 다른 분이 뒤에서 든든하게 받쳐주는 이상적인 조합입니다.`
    );
  } else {
    paragraphs.push(
      `두 분은 같은 ${yang1 ? '양(陽)' : '음(陰)'}의 기운을 가지고 있습니다. 비슷한 에너지를 가지고 있어 서로를 잘 이해할 수 있지만, 가정 내에서 주도권 다툼이 생길 수 있습니다. 서로 양보하고 배려하는 마음이 중요합니다.`
    );
  }
  
  if (score >= 80) {
    paragraphs.push(
      `가정운이 매우 좋은 조합입니다. 결혼 후 안정적이고 화목한 가정을 꾸릴 수 있으며, 자녀 교육에서도 좋은 시너지를 발휘합니다. 시댁이나 처가와의 관계도 원만하게 유지할 가능성이 높습니다. 서로를 존중하는 태도가 행복한 가정의 기초가 됩니다.`
    );
  } else if (score >= 65) {
    paragraphs.push(
      `가정운은 양호한 편입니다. 큰 문제 없이 안정적인 가정을 꾸릴 수 있지만, 가사 분담이나 양육 방식에 대해 미리 충분한 대화가 필요합니다. 서로의 가정환경이 다를 수 있으니, 새로운 가정의 규칙을 함께 만들어가는 과정이 중요합니다.`
    );
  } else {
    paragraphs.push(
      `가정운에서는 생활 습관이나 가치관의 차이로 인한 마찰이 예상됩니다. 하지만 이는 대부분의 부부가 겪는 자연스러운 과정입니다. 중요한 것은 문제가 생겼을 때 회피하지 않고 함께 해결하려는 의지입니다. 정기적인 부부 대화 시간을 갖는 것을 추천합니다.`
    );
  }
  
  return paragraphs;
}

// 갈등 포인트 및 해결 방법
function generateConflictAdvice(saju1: SajuResult, saju2: SajuResult, name1: string, name2: string): { conflicts: string[]; solutions: string[] } {
  const personality1 = STEM_PERSONALITY[saju1.dayPillar.stem];
  const personality2 = STEM_PERSONALITY[saju2.dayPillar.stem];
  const elem1 = elementMap[saju1.dayPillar.stem];
  const elem2 = elementMap[saju2.dayPillar.stem];
  
  const conflicts: string[] = [];
  const solutions: string[] = [];
  
  // 성격 기반 갈등 포인트
  if (personality1 && personality2) {
    // 약점 기반 갈등
    conflicts.push(`${name1}님의 '${personality1.weakness[0].toLowerCase()}' 성향과 ${name2}님의 '${personality2.weakness[0].toLowerCase()}' 성향이 부딪힐 수 있습니다.`);
    
    if (personality1.weakness.length > 1 && personality2.weakness.length > 1) {
      conflicts.push(`${name1}님이 '${personality1.weakness[1].toLowerCase()}'일 때, ${name2}님도 '${personality2.weakness[1].toLowerCase()}'이면 갈등이 깊어질 수 있습니다.`);
    }
  }
  
  // 오행 기반 갈등
  if (isOvercoming(elem1, elem2)) {
    conflicts.push(`${withReading(elem1)}과(와) ${withReading(elem2)}의 상극(相剋) 관계로 인해 의견 충돌이 잦을 수 있습니다. 특히 중요한 결정을 내릴 때 서로 다른 방향을 원할 수 있습니다.`);
  }
  
  if (elem1 === elem2) {
    conflicts.push(`같은 오행끼리는 서로 이해는 잘 되지만, 비슷한 약점도 공유하기 때문에 함께 같은 실수를 반복할 수 있습니다.`);
  }
  
  // 해결 방법
  solutions.push(`서로의 감정을 비난하지 말고, "나는 이렇게 느꼈어"라는 '나 전달법(I-message)'으로 대화하세요.`);
  solutions.push(`갈등이 생겼을 때 바로 해결하려 하지 말고, 서로 냉각 시간을 가진 후 차분하게 이야기하세요.`);
  solutions.push(`매주 한 번은 '부부(연인) 회의 시간'을 정해 서로의 감정과 생각을 나누는 시간을 가지세요.`);
  
  if (isOvercoming(elem1, elem2)) {
    solutions.push(`상극 관계를 중화시키기 위해, 두 오행 사이의 중재 역할을 하는 오행의 기운을 생활에 활용하세요. 예를 들어 함께 자연 속에서 시간을 보내거나, 공통 취미를 만드는 것이 좋습니다.`);
  }
  
  solutions.push(`상대방의 장점을 매일 하나씩 말해주는 '칭찬 릴레이'를 실천해보세요. 작은 감사의 표현이 관계를 크게 변화시킵니다.`);
  
  return { conflicts, solutions };
}

// 종합 조언 생성
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
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name1: "",
      gender1: "male",
      birthDate1: "2000-01-01",
      birthTime1: "12:00",
      calendarType1: "solar",
      name2: "",
      gender2: "female",
      birthDate2: "2000-01-01",
      birthTime2: "12:00",
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
        birthTime1: parsed.birthTime || "12:00",
        calendarType1: parsed.calendarType || "solar",
        name2: "",
        gender2: "female",
        birthDate2: "2000-01-01",
        birthTime2: "12:00",
        calendarType2: "solar",
      });
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
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
    
    // convertToSolarDate는 문자열 형식의 날짜를 받아야 함 (YYYY-MM-DD)
    const birthDateStrForConverter1 = `${birthDateObj1.getFullYear()}-${String(birthDateObj1.getMonth() + 1).padStart(2, '0')}-${String(birthDateObj1.getDate()).padStart(2, '0')}`;
    const birthDateStrForConverter2 = `${birthDateObj2.getFullYear()}-${String(birthDateObj2.getMonth() + 1).padStart(2, '0')}-${String(birthDateObj2.getDate()).padStart(2, '0')}`;
    const date1 = convertToSolarDate(birthDateStrForConverter1, data.birthTime1, data.calendarType1);
    const date2 = convertToSolarDate(birthDateStrForConverter2, data.birthTime2, data.calendarType2);
    const saju1 = calculateSaju(date1, data.gender1);
    const saju2 = calculateSaju(date2, data.gender2);
    
    setResult({ saju1, saju2 });
    window.scrollTo(0, 0);
    
    try { trackEvent('compatibility_result', 'engagement', 'compatibility_calculated'); } catch {}
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  // ===== 입력 화면 =====
  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-base md:text-lg font-bold text-white">궁합 풀이</h1>
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 backdrop-blur-xl">
                <Heart className="w-3 h-3 text-pink-400" />
                <span className="text-[10px] md:text-sm md:text-xs font-bold tracking-wider text-pink-400 uppercase">서로의 기운을 맞추다</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">궁합</h2>
              <p className="text-muted-foreground text-xs md:text-base md:text-sm">
                두 사람의 사주를 분석하여 서로의 조화를 확인해보세요
              </p>
            </div>

            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-pink-400" />
                  </div>
                  궁합 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* 첫 번째 사람 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-pink-500 text-white text-sm md:text-xs font-bold flex items-center justify-center">1</div>
                      <h3 className="text-white font-bold text-base md:text-sm">첫 번째 사람</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name1" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-pink-400" /> 이름
                        </Label>
                        <Input id="name1" placeholder="이름" {...form.register("name1")} className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-pink-500/50 focus:border-pink-500 transition-all text-base md:text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-pink-400" /> 성별
                        </Label>
                        <ToggleGroup type="single" value={form.watch("gender1")} onValueChange={(v) => { if (v) form.setValue("gender1", v as "male" | "female"); }} className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1">
                          <ToggleGroupItem value="male" className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">남성</ToggleGroupItem>
                          <ToggleGroupItem value="female" className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">여성</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate1" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" /> 생년월일
                      </Label>
                      <DatePickerInput id="birthDate1" {...form.register("birthDate1")} accentColor="pink" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthTime1" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-pink-400" /> 태어난 시간
                        </Label>
                        <Input id="birthTime1" type="time" {...form.register("birthTime1")} className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-pink-500/50 focus:border-pink-500 transition-all text-base md:text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-pink-400" /> 양력/음력
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
                          <ToggleGroupItem value="solar" className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                            양력
                          </ToggleGroupItem>
                          <ToggleGroupItem value="lunar" className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
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
                              className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-pink-500 focus:ring-pink-500/50"
                            />
                            <Label htmlFor="isLeapMonth1" className="text-white/60 text-[11px] cursor-pointer">
                              윤달입니다
                            </Label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <Heart className="w-4 h-4 text-pink-400" />
                    <div className="flex-1 h-px bg-white/10"></div>
                  </div>

                  {/* 두 번째 사람 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-500 text-white text-sm md:text-xs font-bold flex items-center justify-center">2</div>
                      <h3 className="text-white font-bold text-base md:text-sm">두 번째 사람</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name2" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-red-400" /> 이름
                        </Label>
                        <Input id="name2" placeholder="이름" {...form.register("name2")} className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-red-500/50 focus:border-red-500 transition-all text-base md:text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-red-400" /> 성별
                        </Label>
                        <ToggleGroup type="single" value={form.watch("gender2")} onValueChange={(v) => { if (v) form.setValue("gender2", v as "male" | "female"); }} className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1">
                          <ToggleGroupItem value="male" className="h-full rounded-lg data-[state=on]:bg-red-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">남성</ToggleGroupItem>
                          <ToggleGroupItem value="female" className="h-full rounded-lg data-[state=on]:bg-red-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">여성</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate2" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-red-400" /> 생년월일
                      </Label>
                      <DatePickerInput id="birthDate2" {...form.register("birthDate2")} accentColor="red" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthTime2" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-red-400" /> 태어난 시간
                        </Label>
                        <Input id="birthTime2" type="time" {...form.register("birthTime2")} className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-red-500/50 focus:border-red-500 transition-all text-base md:text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-red-400" /> 양력/음력
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
                          <ToggleGroupItem value="solar" className="h-full rounded-lg data-[state=on]:bg-red-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                            양력
                          </ToggleGroupItem>
                          <ToggleGroupItem value="lunar" className="h-full rounded-lg data-[state=on]:bg-red-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
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
                              className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-red-500 focus:ring-red-500/50"
                            />
                            <Label htmlFor="isLeapMonth2" className="text-white/60 text-[11px] cursor-pointer">
                              윤달입니다
                            </Label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold text-sm md:text-base rounded-xl shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2">
                    <Heart className="w-4 h-4 mr-2" />
                 궁합 결과 보기
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-pink-500/10 flex items-center justify-center mx-auto">
                    <Heart className="w-4 h-4 text-pink-400" />
                  </div>
                  <p className="text-[10px] md:text-sm md:text-xs font-medium text-white">궁합 점수</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-red-500/10 flex items-center justify-center mx-auto">
                    <Activity className="w-4 h-4 text-red-400" />
                  </div>
                  <p className="text-[10px] md:text-sm md:text-xs font-medium text-white">오행 분석</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto">
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-[10px] md:text-sm md:text-xs font-medium text-white">상세 해석</p>
                </CardContent>
              </Card>
            </div>

            <CompatibilityContent />
          </motion.div>
        </main>
      </div>
    );
  }

  // ===== 결과 화면 =====
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

  return (
    <>
      <Helmet>
        <title>{name1} ♥ {name2} 국합 결과 - 무운</title>
        <meta name="description" content={`${name1}님과 ${name2}님의 사주 기반 국합 결과입니다. 총 국합 점수: ${scores.total}점`} />
        <meta property="og:title" content={`${name1} ♥ ${name2} 국합 결과 - 무운`} />
        <meta property="og:description" content={`${name1}님과 ${name2}님의 사주 기반 국합 결과입니다.`} />
        <meta name="keywords" content="국합, 사주 국합, 연애운, 결혼운, 무운" />
      </Helmet>
    <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setResult(null)} className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base md:text-lg font-bold text-white">궁합 결과</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-pink-400 min-w-[44px] min-h-[44px]" onClick={() => shareContent({ title: '무운 궁합 결과', text: `${name1} ♥ ${name2} 궁합 점수: ${scores.total}점! 우리의 궁합을 확인해보세요.`, page: 'compatibility', buttonType: 'icon' })}>
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
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-[10px] md:text-sm md:text-xs font-bold tracking-wider text-pink-400 uppercase">궁합 종합 점수</span>
            </div>
            
            <div className="relative w-36 h-36 md:w-44 md:h-44 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
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
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-black text-white">{scores.total}</span>
                <span className="text-[10px] md:text-sm md:text-xs text-pink-400 font-bold mt-0.5">{getScoreLabel(scores.total)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-base">
              <span className="text-pink-400 font-bold">{name1}</span>
              <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
              <span className="text-red-400 font-bold">{name2}</span>
            </div>
          </section>

          {/* ===== 2. 세부 점수 그래프 ===== */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-pink-400" />
              세부 궁합 점수
            </h2>
            <Card className="bg-white/5 border-white/10 rounded-xl overflow-hidden">
              <CardContent className="p-4 md:p-6 space-y-4">
                {scoreItems.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={getScoreColor(item.score)}>{item.icon}</span>
                        <span className="text-base md:text-sm text-white/80 font-medium">{item.label}</span>
                      </div>
                      <span className={`text-base md:text-sm font-bold ${getScoreColor(item.score)}`}>{item.score}점</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
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
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-pink-400" />
              두 사람의 사주팔자(四柱八字)
            </h2>
            
            {/* 첫 번째 사람 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-pink-500 text-white text-xs md:text-[10px] font-bold flex items-center justify-center">1</div>
                <span className="text-base md:text-sm font-bold text-pink-400">{name1}님의 사주</span>
              </div>
              <Card className="bg-white/5 border-white/10 rounded-xl overflow-hidden">
                <CardContent className="p-3 md:p-4">
                  <SajuChart result={saju1} theme="purple" />
                </CardContent>
              </Card>
            </div>
            
            {/* 두 번째 사람 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs md:text-[10px] font-bold flex items-center justify-center">2</div>
                <span className="text-base md:text-sm font-bold text-red-400">{name2}님의 사주</span>
              </div>
              <Card className="bg-white/5 border-white/10 rounded-xl overflow-hidden">
                <CardContent className="p-3 md:p-4">
                  <SajuChart result={saju2} theme="purple" />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ===== 4. 일간 궁합 종합 해석 ===== */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Quote className="w-5 h-5 text-pink-400" />
              일간(日干) 궁합 종합 해석
            </h2>
            <Card className="bg-white/5 border-white/10 rounded-xl overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                  {overallInterpretation.map((para, idx) => (
                    <p key={idx} className="text-sm md:text-[15px] text-white/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-pink-300">$1</strong>') }} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ===== 5. 성격 궁합 비교 ===== */}
          {personality1 && personality2 && (
            <section>
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-pink-400" />
                성격 궁합 비교
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 첫 번째 사람 성격 */}
                <Card className="bg-white/5 border-pink-500/20 rounded-xl overflow-hidden">
                  <CardHeader className="bg-pink-500/5 border-b border-white/5 py-3 px-4">
                    <CardTitle className="text-base md:text-sm font-bold text-pink-400 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-pink-500 text-white text-xs md:text-[10px] font-bold flex items-center justify-center">1</div>
                      {name1}님 — {personality1.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="text-xs md:text-[10px] text-white/40 mb-1">상징</p>
                      <p className="text-base md:text-sm text-white/90">{personality1.nature} ({personality1.symbol})</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-[10px] text-green-400 mb-1">강점</p>
                      <div className="flex flex-wrap gap-1.5">
                        {personality1.strength.map((s, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs md:text-[10px] text-red-400 mb-1">약점</p>
                      <div className="flex flex-wrap gap-1.5">
                        {personality1.weakness.map((w, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400">{w}</span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 두 번째 사람 성격 */}
                <Card className="bg-white/5 border-red-500/20 rounded-xl overflow-hidden">
                  <CardHeader className="bg-red-500/5 border-b border-white/5 py-3 px-4">
                    <CardTitle className="text-base md:text-sm font-bold text-red-400 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs md:text-[10px] font-bold flex items-center justify-center">2</div>
                      {name2}님 — {personality2.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="text-xs md:text-[10px] text-white/40 mb-1">상징</p>
                      <p className="text-base md:text-sm text-white/90">{personality2.nature} ({personality2.symbol})</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-[10px] text-green-400 mb-1">강점</p>
                      <div className="flex flex-wrap gap-1.5">
                        {personality2.strength.map((s, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs md:text-[10px] text-red-400 mb-1">약점</p>
                      <div className="flex flex-wrap gap-1.5">
                        {personality2.weakness.map((w, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400">{w}</span>
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
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-pink-400" />
              오행(五行) 조화 비교
            </h2>
            <Card className="bg-white/5 border-white/10 rounded-xl overflow-hidden">
              <CardContent className="p-4 md:p-6 space-y-5">
                {/* 오행 비교 바 차트 */}
                {['木', '火', '土', '金', '水'].map((elem) => {
                  const v1 = balance1.find(b => b.name === elem)?.value || 0;
                  const v2 = balance2.find(b => b.name === elem)?.value || 0;
                  return (
                    <div key={elem} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-base md:text-sm font-bold ${ELEMENT_TEXT[elem]}`}>{withReading(elem)}</span>
                        <span className="text-sm md:text-xs text-white/50">{name1}: {v1}개 / {name2}: {v2}개</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs md:text-[10px] text-pink-400 w-6">{name1.slice(0, 1)}</span>
                          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(v1 / 8) * 100}%` }}
                              transition={{ duration: 0.8 }}
                              className={`h-full rounded-full ${ELEMENT_BAR_COLOR[elem]} opacity-80`}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs md:text-[10px] text-red-400 w-6">{name2.slice(0, 1)}</span>
                          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
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
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <p className="text-base md:text-sm text-white/90 leading-relaxed">
                    {elementAnalysis1.analysis}
                  </p>
                  <p className="text-base md:text-sm text-white/90 leading-relaxed">
                    {elementAnalysis2.analysis}
                  </p>
                  {elementAnalysis1.weakest !== elementAnalysis2.weakest && (
                    <p className="text-base md:text-sm text-pink-300 leading-relaxed">
                      {name1}님에게 부족한 {withReading(elementAnalysis1.weakest)}의 기운을 {name2}님이 보완해줄 수 있고, {name2}님에게 부족한 {withReading(elementAnalysis2.weakest)}의 기운을 {name1}님이 채워줄 수 있는 상호 보완적인 관계입니다.
                    </p>
                  )}
                  {elementAnalysis1.weakest === elementAnalysis2.weakest && (
                    <p className="text-base md:text-sm text-yellow-300 leading-relaxed">
                      두 분 모두 {withReading(elementAnalysis1.weakest)}의 기운이 부족합니다. {elementAnalysis1.supplement} 함께 이 부분을 보충하는 활동을 하면 좋겠습니다.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ===== 7. 애정운 궁합 ===== */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-pink-400" />
              애정운 궁합
              <span className={`text-base md:text-sm font-bold ${getScoreColor(scores.loveScore)}`}>({scores.loveScore}점)</span>
            </h2>
            <Card className="bg-white/5 border-white/10 rounded-xl overflow-hidden">
              <CardContent className="p-4 md:p-6 space-y-4">
                {loveInterpretation.map((para, idx) => (
                  <p key={idx} className="text-sm md:text-[15px] text-white/90 leading-relaxed">{para}</p>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* ===== 8. 재물 궁합 ===== */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-400" />
              재물 궁합
              <span className={`text-base md:text-sm font-bold ${getScoreColor(scores.wealthScore)}`}>({scores.wealthScore}점)</span>
            </h2>
            <Card className="bg-white/5 border-white/10 rounded-xl overflow-hidden">
              <CardContent className="p-4 md:p-6 space-y-4">
                {wealthInterpretation.map((para, idx) => (
                  <p key={idx} className="text-sm md:text-[15px] text-white/90 leading-relaxed">{para}</p>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* ===== 9. 가정운 궁합 ===== */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-green-400" />
              가정운 궁합
              <span className={`text-base md:text-sm font-bold ${getScoreColor(scores.familyScore)}`}>({scores.familyScore}점)</span>
            </h2>
            <Card className="bg-white/5 border-white/10 rounded-xl overflow-hidden">
              <CardContent className="p-4 md:p-6 space-y-4">
                {familyInterpretation.map((para, idx) => (
                  <p key={idx} className="text-sm md:text-[15px] text-white/90 leading-relaxed">{para}</p>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* ===== 10. 갈등 포인트 및 해결 방법 ===== */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              갈등 포인트 및 해결 방법
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/5 border-orange-500/20 rounded-xl overflow-hidden">
                <CardHeader className="bg-orange-500/5 border-b border-white/5 py-3 px-4">
                  <CardTitle className="text-base md:text-sm font-bold text-orange-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> 주의할 갈등 포인트
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-3">
                    {conflictAdvice.conflicts.map((c, i) => (
                      <li key={i} className="text-base md:text-sm text-white/80 leading-relaxed flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-green-500/20 rounded-xl overflow-hidden">
                <CardHeader className="bg-green-500/5 border-b border-white/5 py-3 px-4">
                  <CardTitle className="text-base md:text-sm font-bold text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> 관계 개선 방법
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-3">
                    {conflictAdvice.solutions.map((s, i) => (
                      <li key={i} className="text-base md:text-sm text-white/80 leading-relaxed flex items-start gap-2">
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
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-pink-400" />
              전문가 종합 조언
            </h2>
            <Card className="bg-gradient-to-br from-pink-500/10 to-red-500/10 border-pink-500/20 rounded-xl overflow-hidden">
              <CardContent className="p-4 md:p-6 space-y-4">
                {finalAdvice.map((para, idx) => (
                  <p key={idx} className="text-sm md:text-[15px] text-white/90 leading-relaxed">{para}</p>
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
            <Button 
              className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 h-11 rounded-xl font-medium text-base md:text-sm"
              onClick={() => shareContent({ title: '무운 궁합 결과', text: `${name1} ♥ ${name2} 궁합 점수: ${scores.total}점! 우리의 궁합을 확인해보세요.`, page: 'compatibility', buttonType: 'text_button' })}
            >
              <Share2 className="w-4 h-4 mr-2" />
              친구에게 공유하기
            </Button>
            <Button 
              variant="ghost"
              className="w-full text-white/60 hover:text-white hover:bg-white/5 h-11 rounded-xl font-medium text-base md:text-sm"
              onClick={() => setResult(null)}
            >
              다른 정보로 다시 보기
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
    </>
  );
}
