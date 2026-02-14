// Force redeploy - Fix YearlyFortune rendering
import { useState, useEffect } from "react";
import { useCanonical } from '@/lib/use-canonical';
import { setYearlyFortuneOGTags } from '@/lib/og-tags';
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceSchema } from "@/components/SchemaMarkup";
import { ChevronLeft, Star, Sparkles, User, Zap, Briefcase, Share2, Activity, Heart, Quote, ScrollText, Calendar, Clock, TrendingUp, Shield, ChevronDown, ChevronUp } from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";
import { autoLinkKeywordsToJSX } from "@/lib/auto-link-keywords";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateSaju, SajuResult, calculateElementBalance, generateFortuneDetails, STEM_ELEMENTS, BRANCH_ELEMENTS } from "@/lib/saju";
import { convertToSolarDate } from "@/lib/lunar-converter";
import SajuChart from "@/components/SajuChart";
import LuckyItems from "@/components/LuckyItems";
import SajuGlossary from "@/components/SajuGlossary";
import YearlyFortuneContent from "@/components/YearlyFortuneContent";
import SajuGuide from "@/components/SajuGuide";
import { iljuData } from "@/lib/ilju-data";
import { convertToHanja } from "@/lib/hanja-converter";
import FortuneShareCard from "@/components/FortuneShareCard";
import { trackEvent, trackCustomEvent } from "@/lib/ga4";
import { 
  generateYearlyFortune, 
  FortuneResult 
} from "@/lib/fortune-templates";
import {
  STEM_READINGS,
  BRANCH_READINGS,
  ELEMENT_READINGS,
  ELEMENT_KOREAN,
  withReading,
  pillarReading,
  STEM_PERSONALITY,
  TEN_GOD_MEANINGS,
  analyzeElementBalance,
  getElementRelation,
} from "@/lib/saju-reading";

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

// 2026년 월별 운세 생성 함수
function generateMonthlyFortune(saju: SajuResult): { month: number; title: string; content: string; score: number; color: string }[] {
  const dayElement = STEM_ELEMENTS[saju.dayPillar.stem];
  const months = [];
  
  const monthlyThemes: Record<string, { themes: string[]; scores: number[] }> = {
    '木': { 
      themes: [
        '새해 첫 달, 목생화(木生火)의 기운으로 새로운 계획을 세우기 좋은 시기입니다. 올해의 큰 그림을 그려보세요.',
        '봄의 기운이 시작되며 당신의 에너지가 상승합니다. 새로운 프로젝트나 학습을 시작하기에 최적의 시기입니다.',
        '목(木)의 기운이 가장 강한 달입니다. 성장과 발전의 기회가 찾아오니 적극적으로 움직이세요.',
        '봄의 절정기로, 그동안 준비한 것들이 싹을 틔우기 시작합니다. 인간관계에서도 좋은 소식이 있을 수 있습니다.',
        '화(火)의 기운이 강해지면서 당신의 노력이 빛을 발합니다. 사회적 인정을 받을 수 있는 기회가 옵니다.',
        '상반기를 마무리하며 중간 점검이 필요한 시기입니다. 지나친 욕심은 버리고 현재에 집중하세요.',
        '하반기의 시작으로, 새로운 방향 전환이 가능한 달입니다. 건강 관리에 특히 신경 쓰세요.',
        '금(金)의 기운이 강해져 결단이 필요한 상황이 올 수 있습니다. 신중하되 과감하게 행동하세요.',
        '가을의 수확기로, 상반기의 노력이 결실을 맺기 시작합니다. 재물운이 상승하는 시기입니다.',
        '변화의 기운이 강한 달입니다. 새로운 기회가 찾아오지만, 신중한 판단이 필요합니다.',
        '수(水)의 기운이 강해지며 내면의 성찰이 필요한 시기입니다. 내년을 위한 준비를 시작하세요.',
        '한 해를 마무리하며 감사하는 마음을 가지세요. 가족과의 시간이 행운을 가져다줍니다.'
      ],
      scores: [75, 82, 90, 85, 88, 72, 78, 70, 85, 76, 73, 80]
    },
    '火': {
      themes: [
        '새해 시작과 함께 열정이 불타오릅니다. 다만 너무 급하게 서두르지 말고 차분하게 계획을 세우세요.',
        '인간관계에서 좋은 기회가 찾아옵니다. 네트워킹에 적극적으로 참여하면 뜻밖의 행운이 있습니다.',
        '목생화(木生火)의 기운으로 당신의 매력이 빛나는 달입니다. 대인관계와 사교 활동에서 좋은 성과가 있습니다.',
        '창의적인 아이디어가 샘솟는 시기입니다. 새로운 프로젝트를 시작하거나 자기 표현에 집중하세요.',
        '화(火)의 기운이 절정에 달하는 달입니다. 명예와 인기가 상승하지만, 건강 관리에 주의하세요.',
        '에너지 소모가 큰 시기입니다. 충분한 휴식을 취하고, 무리한 일정은 피하세요.',
        '하반기 전환점으로, 새로운 목표를 설정하기 좋은 때입니다. 재물운이 서서히 상승합니다.',
        '토(土)의 기운이 당신을 안정시켜줍니다. 기반을 다지고 내실을 강화하는 데 집중하세요.',
        '가을의 기운이 당신의 열정을 차분하게 정리해줍니다. 그동안의 성과를 정리하고 다음 단계를 준비하세요.',
        '금(金)의 기운과 만나 도전적인 상황이 올 수 있습니다. 인내심을 가지고 대처하면 좋은 결과를 얻습니다.',
        '한 해의 마무리를 준비하며, 감사와 성찰의 시간을 가지세요. 가까운 사람들과의 관계가 중요합니다.',
        '따뜻한 마무리가 필요한 달입니다. 올 한 해의 성과를 축하하고, 새해를 위한 비전을 그려보세요.'
      ],
      scores: [80, 83, 88, 86, 92, 68, 78, 75, 80, 72, 76, 82]
    },
    '土': {
      themes: [
        '안정적인 시작이 기대되는 달입니다. 기존의 계획을 점검하고 보완하는 데 집중하세요.',
        '화생토(火生土)의 기운으로 외부의 도움이 들어옵니다. 주변 사람들의 조언에 귀 기울이세요.',
        '새로운 인연이 찾아올 수 있는 달입니다. 열린 마음으로 사람들을 만나보세요.',
        '부동산이나 실물 자산에서 좋은 기회가 있을 수 있습니다. 신중하게 검토하되 기회를 놓치지 마세요.',
        '사회적 활동이 활발해지는 시기입니다. 리더십을 발휘할 기회가 찾아옵니다.',
        '토(土)의 기운이 강한 달로, 안정과 평화가 찾아옵니다. 가족과의 시간을 소중히 여기세요.',
        '하반기의 전환점입니다. 새로운 도전보다는 기존의 것을 발전시키는 데 집중하세요.',
        '재물운이 상승하는 시기입니다. 저축이나 투자에 좋은 기회가 있을 수 있습니다.',
        '가을의 수확기로, 그동안의 노력이 결실을 맺습니다. 감사하는 마음을 가지세요.',
        '변화의 기운이 있지만, 당신의 안정적인 기반이 든든하게 지켜줍니다.',
        '내면의 성찰이 필요한 시기입니다. 자신을 돌아보고 내년의 계획을 세우세요.',
        '따뜻한 마무리가 필요한 달입니다. 주변 사람들에게 감사를 표현하세요.'
      ],
      scores: [78, 82, 80, 85, 83, 88, 76, 84, 87, 79, 75, 81]
    },
    '金': {
      themes: [
        '새해의 시작이지만 조심스러운 접근이 필요합니다. 무리한 계획보다는 실현 가능한 목표를 세우세요.',
        '인내심이 필요한 달입니다. 어려움이 있더라도 포기하지 말고 꾸준히 나아가세요.',
        '봄의 기운이 당신에게 새로운 활력을 줍니다. 건강 관리와 자기 계발에 투자하세요.',
        '인간관계에서 좋은 변화가 있을 수 있습니다. 오래된 인연을 다시 만나보세요.',
        '화극금(火克金)의 기운이 강한 달이므로 스트레스 관리에 신경 쓰세요. 무리하지 마세요.',
        '상반기를 돌아보며 전략을 수정하기 좋은 시기입니다. 유연한 대처가 필요합니다.',
        '금(金)의 기운이 회복되는 달입니다. 자신감을 되찾고 적극적으로 움직이세요.',
        '가을의 기운이 당신을 빛나게 합니다. 전문성을 발휘할 기회가 찾아옵니다.',
        '재물운이 상승하는 시기입니다. 그동안의 인내가 보상받는 달입니다.',
        '결단력이 필요한 상황이 올 수 있습니다. 당신의 판단을 믿고 과감하게 행동하세요.',
        '내면의 힘을 기르는 시기입니다. 명상이나 운동으로 심신을 단련하세요.',
        '한 해를 마무리하며 성취감을 느끼는 달입니다. 어려운 한 해를 잘 견딘 자신을 칭찬하세요.'
      ],
      scores: [72, 68, 76, 80, 65, 73, 82, 86, 88, 84, 78, 83]
    },
    '水': {
      themes: [
        '수(水)의 기운이 강한 시작입니다. 직관을 믿고 새해의 방향을 설정하세요.',
        '지혜로운 판단이 빛을 발하는 달입니다. 주변에서 조언을 구하는 사람이 많아집니다.',
        '봄의 기운과 만나 수생목(水生木)의 조화가 이루어집니다. 새로운 시작에 유리한 시기입니다.',
        '창의적인 아이디어가 풍부한 달입니다. 학습이나 연구에 좋은 성과가 있습니다.',
        '사회적 활동이 활발해지지만, 에너지 관리가 중요합니다. 적절한 휴식을 취하세요.',
        '수극화(水克火)의 기운으로 당신의 차분함이 빛을 발합니다. 중요한 결정에서 좋은 판단을 내립니다.',
        '하반기의 전환점으로, 새로운 학습이나 여행이 행운을 가져다줍니다.',
        '금생수(金生水)의 기운으로 외부의 도움이 들어옵니다. 좋은 인연을 만날 수 있습니다.',
        '가을의 기운이 당신의 지혜를 더욱 깊게 합니다. 중요한 프로젝트에 집중하세요.',
        '재물운이 상승하는 시기입니다. 정보를 활용한 투자에서 좋은 결과를 얻을 수 있습니다.',
        '수(水)의 기운이 절정에 달하는 달입니다. 내면의 평화를 찾고 자기 성찰의 시간을 가지세요.',
        '한 해를 지혜롭게 마무리하는 달입니다. 내년을 위한 비전을 명확히 하세요.'
      ],
      scores: [85, 83, 88, 86, 78, 84, 80, 86, 85, 82, 90, 84]
    }
  };

  const data = monthlyThemes[dayElement] || monthlyThemes['木'];
  const scoreColors = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };
  const barColors = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  for (let i = 0; i < 12; i++) {
    months.push({
      month: i + 1,
      title: `${i + 1}월`,
      content: data.themes[i],
      score: data.scores[i],
      color: barColors(data.scores[i]),
    });
  }
  return months;
}

// 2026 병오년 상세 해석 생성
function generate2026DetailedFortune(saju: SajuResult): {
  yearAnalysis: string;
  wealthFortune: string;
  careerFortune: string;
  loveFortune: string;
  healthFortune: string;
} {
  const dayElement = STEM_ELEMENTS[saju.dayPillar.stem];
  const dayStem = saju.dayPillar.stem;
  const stemName = STEM_READINGS[dayStem];
  
  const yearAnalysisMap: Record<string, string> = {
    '木': `2026년은 병오년(丙午年), 즉 붉은 말의 해예요. 올해의 주인공인 병화(丙火)와 오화(午火)는 모두 불(火)의 기운을 가지고 있어서, 열정과 활력이 넘치는 한 해가 될 거예요!\n\n${withReading(dayStem)} 일간이신 당신에게 올해는 "목생화(木生火)"의 원리가 작용해요. 쉽게 말하면, 나무(木)가 불(火)을 키워주는 관계예요. 당신의 기운이 세상을 밝히는 빛이 되는 해라고 할 수 있답니다!\n\n구체적으로 말하면, 당신이 가진 재능과 능력이 세상에 알려지고 인정받는 시기예요. 그동안 묵묵히 준비해온 것들이 드디어 빛을 발하게 돼요. 특히 상반기(1~6월)에 중요한 전환점이 있을 수 있으니, 기회가 왔을 때 주저하지 마세요!\n\n다만 주의할 점도 있어요. 나무가 불에 타면 재가 되듯이, 지나치게 에너지를 소모하면 번아웃이 올 수 있답니다. 열정을 쏟되, 반드시 충분한 휴식을 취해주세요. 건강 관리가 올해의 핵심 과제예요.`,
    '火': `2026년은 병오년(丙午年), 붉은 말의 해예요. 천간 병화(丙火)와 지지 오화(午火)가 모두 불(火)의 기운이라서, 올해는 불의 기운이 매우 강한 해랍니다.\n\n${withReading(dayStem)} 일간이신 당신에게 올해는 "비겁(比劫)"의 해예요. 쉽게 말하면, 나와 같은 기운이 강해지는 해라는 뜻이에요. 이건 두 가지 의미를 가지고 있답니다.\n\n좋은 면으로는, 당신의 존재감과 영향력이 극대화돼요! 리더십을 발휘할 기회가 많아지고, 대중적 인기나 명예가 상승해요. 같은 뜻을 가진 동료들과의 협력에서 큰 시너지를 낼 수 있답니다.\n\n주의할 면으로는, 같은 기운이 강하다는 것은 경쟁도 치열해진다는 뜻이에요. 라이벌이 등장하거나, 재물의 유출이 있을 수 있으니 투자나 큰 지출은 신중하게 결정하세요.\n\n건강 면에서는 "과열"에 주의해야 해요. 심장, 혈압, 눈 건강에 특히 신경 쓰고, 충분한 수분 섭취와 휴식이 필요하답니다.`,
    '土': `2026년은 병오년(丙午年), 붉은 말의 해예요. 올해의 기운인 병화(丙火)와 오화(午火)는 모두 불(火)의 기운이에요.\n\n${withReading(dayStem)} 일간이신 당신에게 올해는 "화생토(火生土)"의 원리가 작용해요. 불(火)이 흙(土)을 만들어주는 관계로, 쉽게 말하면 외부에서 당신에게 기운과 도움이 들어오는 아주 좋은 해랍니다!\n\n주변 사람들의 지원과 격려가 당신을 더욱 강하게 만들어주고, 새로운 기회가 자연스럽게 찾아와요. 특히 부동산, 안정적인 투자, 기반 확장에 유리한 해예요.\n\n인간관계에서도 든든한 지원군을 얻게 돼요. 멘토나 조력자가 나타날 수 있으니, 새로운 만남에 열린 마음을 가져보세요.\n\n다만 화(火)의 기운이 강해서 조급해질 수 있어요. 당신의 가장 큰 장점인 신중함과 안정감을 유지하면서, 기회를 잡으세요!`,
    '金': `2026년은 병오년(丙午年), 붉은 말의 해예요. 올해의 기운인 병화(丙火)와 오화(午火)는 모두 불(火)의 기운이에요.\n\n${withReading(dayStem)} 일간이신 당신에게 올해는 "화극금(火克金)"의 원리가 작용해요. 불(火)이 쇠(金)를 녹이는 관계로, 외부의 압박이나 도전이 있을 수 있는 해랍니다.\n\n하지만 걱정하지 마세요! 쇠가 불에 단련되면 더 강한 강철이 되듯이, 올해의 시련은 당신을 더욱 단단하게 만들어줄 거예요. 중요한 것은 정면 돌파보다는 지혜로운 우회 전략을 사용하는 거예요.\n\n올해는 내실을 다지는 데 집중하세요. 화려한 성과보다는 실력을 쌓고, 인맥을 관리하며, 건강을 챙기는 것이 현명해요. 하반기(7~12월)부터는 상황이 호전되기 시작하니, 상반기를 잘 견디면 좋은 결과가 찾아올 거예요!\n\n건강 면에서는 호흡기, 피부, 스트레스 관리에 특히 신경 써주세요.`,
    '水': `2026년은 병오년(丙午年), 붉은 말의 해예요. 올해의 기운인 병화(丙火)와 오화(午火)는 모두 불(火)의 기운이에요.\n\n${withReading(dayStem)} 일간이신 당신에게 올해는 "수극화(水克火)"의 원리가 작용해요. 물(水)이 불(火)을 끄는 관계로, 당신이 올해의 기운을 제어하는 위치에 있답니다!\n\n이것은 당신의 지혜와 통찰력이 빛을 발하는 해라는 의미예요. 주변에서 당신의 판단과 조언을 구하는 사람이 많아지고, 중요한 결정에서 핵심적인 역할을 맡게 돼요.\n\n특히 올해는 정보와 지식을 활용한 활동에서 큰 성과를 거둘 수 있어요. 연구, 분석, 컨설팅, IT 관련 분야에서 좋은 기회가 있답니다.\n\n다만 불(火)의 기운과 대립하면서 에너지 소모가 클 수 있어요. 충분한 휴식과 재충전이 필요하며, 신장과 방광 건강에 주의해주세요.`
  };

  const wealthMap: Record<string, string> = {
    '木': `올해 재물운은 "식상생재(食傷生財)"의 흐름이 있어서, 당신의 재능과 노력이 직접적으로 수입으로 연결되는 해예요!\n\n상반기에는 새로운 수입원이 생길 가능성이 높아요. 특히 교육, 컨설팅, 창작 활동 등 당신의 전문성을 활용한 부수입이 기대돼요. 투자보다는 실력으로 벌어들이는 소득이 유리하답니다.\n\n하반기에는 안정적인 재물 흐름이 이어져요. 다만 9~10월경에 예상치 못한 지출이 있을 수 있으니, 비상금을 미리 준비해두세요.\n\n올해 재물 관리의 핵심은 "씨앗을 뿌리되 조급하게 수확하지 않는 것"이에요. 장기적인 관점에서 투자하고, 단기 수익에 현혹되지 마세요!`,
    '火': `올해 재물운은 비겁(比劫)의 영향으로 들어오는 돈도 많지만 나가는 돈도 많은 해예요.\n\n수입 면에서는 당신의 인기와 명예가 재물로 연결돼요. 강연, 방송, SNS 활동 등 대중과 소통하는 활동에서 수입이 기대된답니다.\n\n지출 면에서는 사교비, 경조사비 등 인간관계 관련 지출이 늘어날 수 있어요. 또한 경쟁자의 등장으로 예상치 못한 비용이 발생할 수 있으니 주의하세요.\n\n올해 재물 관리의 핵심은 "수입의 30%는 반드시 저축하기"예요. 들어오는 대로 쓰면 남는 것이 없을 수 있으니, 계획적인 재무 관리가 필요하답니다.`,
    '土': `올해 재물운은 화생토(火生土)의 기운으로 매우 좋아요! 외부에서 재물이 들어오는 흐름이 있어서, 안정적인 수입 증가가 기대돼요.\n\n특히 부동산, 실물 자산, 안정적인 투자에서 좋은 결과를 얻을 수 있어요. 4~5월과 9~10월에 좋은 투자 기회가 있을 수 있으니 주목하세요!\n\n직장인이라면 연봉 인상이나 보너스를 기대할 수 있고, 사업자라면 매출 증가가 예상돼요.\n\n올해 재물 관리의 핵심은 "안정적인 자산을 늘리는 것"이에요. 투기성 투자보다는 실물 자산이나 안정적인 금융 상품에 집중하세요.`,
    '金': `올해 재물운은 화극금(火克金)의 영향으로 다소 도전적인 해예요. 예상치 못한 지출이나 투자 손실에 주의가 필요해요.\n\n상반기에는 재물의 유출이 있을 수 있어요. 큰 투자나 보증은 피하고, 현금 유동성을 확보해두세요. 충동적인 소비도 자제하는 게 좋아요.\n\n하반기부터는 상황이 호전돼요! 특히 8~9월에 좋은 수입 기회가 찾아올 수 있으니, 그때를 위해 실력을 갈고닦으세요.\n\n올해 재물 관리의 핵심은 "지키는 것이 버는 것"이에요. 공격적인 투자보다는 수비적인 재무 전략이 유리하답니다.`,
    '水': `올해 재물운은 수극화(水克火)의 기운으로, 당신의 지혜가 재물로 연결되는 해예요!\n\n정보와 지식을 활용한 수입이 유리해요. 컨설팅, 분석, 교육, IT 관련 분야에서 좋은 수입을 기대할 수 있답니다. 특히 3~4월과 8~9월에 좋은 기회가 있어요.\n\n투자에서는 정보력이 핵심이에요. 충분한 조사와 분석을 바탕으로 한 투자는 좋은 결과를 가져오지만, 감에 의존한 투자는 피해주세요.\n\n올해 재물 관리의 핵심은 "정보가 곧 돈"이라는 거예요. 트렌드를 읽고, 시장의 흐름을 파악하는 데 시간을 투자해보세요!`
  };

  const careerMap: Record<string, string> = {
    '木': `올해 직업운은 당신의 성장과 발전이 돋보이는 해예요! 새로운 프로젝트나 역할을 맡게 될 가능성이 높고, 이를 통해 실력을 인정받게 된답니다.\n\n직장인이라면 승진이나 부서 이동의 기회가 있을 수 있어요. 새로운 환경에서도 빠르게 적응하여 좋은 성과를 낼 수 있으니, 변화를 두려워하지 마세요!\n\n사업자라면 사업 확장이나 새로운 분야 진출을 고려해볼 만해요. 다만 무리한 확장보다는 단계적인 성장이 안전하답니다.\n\n취업 준비생이라면 교육, 문화, 환경 관련 분야에서 좋은 기회가 있어요.`,
    '火': `올해 직업운은 당신의 카리스마와 리더십이 빛나는 해예요! 조직 내에서 중요한 역할을 맡거나, 대외적으로 주목받는 기회가 많아져요.\n\n직장인이라면 프레젠테이션, 협상, 대외 업무에서 뛰어난 성과를 거둘 수 있어요. 팀을 이끄는 역할이 주어질 수 있으니, 리더십을 마음껏 발휘하세요!\n\n사업자라면 마케팅과 브랜딩에 투자하면 좋은 결과를 얻어요. SNS나 미디어를 활용한 홍보가 효과적이랍니다.\n\n다만 경쟁이 치열해질 수 있으니, 실력으로 승부하세요!`,
    '土': `올해 직업운은 안정적인 성장이 기대되는 해예요. 화생토(火生土)의 기운으로 상사나 선배의 지원을 받아 순조롭게 발전한답니다.\n\n직장인이라면 신뢰를 바탕으로 한 꾸준한 성과가 인정받아요. 특히 관리직이나 중재자 역할에서 빛을 발해요.\n\n사업자라면 기존 사업의 안정화와 내실 강화에 집중하면 좋은 결과를 얻어요. 새로운 파트너십도 기대할 수 있답니다.\n\n부동산, 건설, 식품, 교육 관련 분야에서 특히 좋은 기회가 있어요!`,
    '金': `올해 직업운은 도전과 성장이 공존하는 해예요. 화극금(火克金)의 기운으로 외부의 압박이 있지만, 이를 통해 더욱 단련된답니다.\n\n직장인이라면 업무량이 늘어나거나 어려운 프로젝트를 맡게 될 수 있어요. 하지만 이를 잘 해내면 큰 인정을 받게 돼요!\n\n사업자라면 경쟁이 치열해질 수 있으니, 차별화 전략에 집중하세요. 품질과 전문성으로 승부하면 좋은 결과를 얻어요.\n\n하반기부터 상황이 호전되니, 상반기에는 실력을 쌓는 데 집중하세요!`,
    '水': `올해 직업운은 당신의 지혜와 전문성이 빛나는 해예요! 수극화(水克火)의 기운으로 복잡한 상황에서 해결사 역할을 하게 돼요.\n\n직장인이라면 분석, 기획, 전략 수립 등의 업무에서 뛰어난 성과를 거둬요. 상사의 신뢰를 얻어 중요한 프로젝트에 참여할 기회가 있답니다.\n\n사업자라면 정보와 데이터를 활용한 의사결정이 좋은 결과를 가져와요. IT, 교육, 컨설팅 분야에서 새로운 기회가 있어요.\n\n해외 관련 업무나 글로벌 프로젝트에서도 좋은 성과를 기대할 수 있답니다!`
  };

  const loveMap: Record<string, string> = {
    '木': `올해 애정운은 새로운 만남과 성장이 기대되는 해예요! 목생화(木生火)의 기운으로 당신의 매력이 빛나며, 주변의 관심을 끌게 된답니다.\n\n미혼이라면 3~5월, 9~10월에 좋은 인연을 만날 가능성이 높아요. 학습 모임, 동호회, 직장 내에서 자연스러운 만남이 기대돼요.\n\n기혼이라면 배우자와의 관계가 더욱 깊어지는 해예요. 함께 새로운 것을 배우거나 여행을 계획하면 관계가 더욱 돈독해진답니다.\n\n다만 지나친 열정이 상대방을 부담스럽게 할 수 있으니, 적절한 거리감을 유지해주세요.`,
    '火': `올해 애정운은 열정적이지만 변동이 큰 해예요. 화(火)의 기운이 강해 감정의 기복이 클 수 있으니, 감정 조절에 신경 써주세요.\n\n미혼이라면 매력이 넘치는 해라서 만남의 기회는 많아요. 다만 여러 사람에게 관심을 받아 선택이 어려울 수 있어요. 진심으로 마음이 가는 사람에게 집중하세요!\n\n기혼이라면 배우자와의 소통에 더 신경 써주세요. 바쁜 일정 속에서도 함께하는 시간을 만드는 게 중요해요.\n\n6~7월에 감정적으로 힘든 시기가 올 수 있으니, 이때 인내심을 가져주세요.`,
    '土': `올해 애정운은 안정적이고 따뜻한 해예요. 화생토(火生土)의 기운으로 사랑이 깊어지고, 신뢰가 쌓이는 시기랍니다.\n\n미혼이라면 진지한 만남이 기대돼요. 특히 4~5월, 10~11월에 좋은 인연이 있을 수 있어요. 소개팅이나 중매를 통한 만남이 유리하답니다.\n\n기혼이라면 가정의 평화와 행복이 깊어지는 해예요. 가족 여행이나 함께하는 취미 활동이 관계를 더욱 돈독하게 해줘요.\n\n결혼을 고려하고 있다면 올해가 아주 좋은 시기예요!`,
    '金': `올해 애정운은 인내와 이해가 필요한 해예요. 화극금(火克金)의 기운으로 감정적인 갈등이 있을 수 있지만, 이를 통해 관계가 더 성숙해진답니다.\n\n미혼이라면 상반기보다는 하반기에 좋은 인연이 기대돼요. 8~10월에 운명적인 만남이 있을 수 있으니, 마음을 열어두세요!\n\n기혼이라면 배우자와의 의견 충돌이 있을 수 있어요. 자신의 주장만 고집하지 말고, 상대방의 입장에서 생각해보세요.\n\n올해 애정운의 핵심은 "부드러움이 강함을 이긴다"는 거예요.`,
    '水': `올해 애정운은 깊고 의미 있는 관계가 기대되는 해예요. 지적인 교감과 정서적 유대가 깊어지는 시기랍니다.\n\n미혼이라면 지적인 대화를 나눌 수 있는 상대를 만날 가능성이 높아요. 독서 모임, 학습 그룹, 온라인 커뮤니티에서 좋은 인연이 있을 수 있어요.\n\n기혼이라면 배우자와의 정서적 교감이 깊어지는 해예요. 서로의 꿈과 목표에 대해 진지하게 이야기하는 시간을 가져보세요.\n\n3~4월과 9~10월에 애정운이 특히 좋답니다!`
  };

  const healthMap: Record<string, string> = {
    '木': `올해 건강운에서 가장 주의해야 할 부분은 간(肝)과 눈 건강이에요. 목(木)은 간과 눈을 관장하는데, 화(火)의 기운이 강한 올해는 에너지 소모가 커서 간에 부담이 갈 수 있답니다.\n\n충분한 수면과 규칙적인 식사가 기본이에요. 특히 녹색 채소와 신맛 나는 과일을 많이 섭취하면 간 건강에 도움이 돼요.\n\n스트레스 관리도 중요해요. 산책, 요가, 명상 등 자연 속에서 하는 활동이 심신 안정에 효과적이랍니다.\n\n4~5월과 10~11월에 건강에 특히 주의하세요. 무리한 일정은 피하고, 정기 검진을 받는 것이 좋아요.`,
    '火': `올해 건강운에서 가장 주의해야 할 부분은 심장과 혈압이에요. 화(火)의 기운이 매우 강한 올해는 "과열"에 주의해야 해요.\n\n규칙적인 운동과 충분한 수분 섭취가 필수예요. 특히 유산소 운동보다는 요가, 수영 등 심신을 안정시키는 운동이 좋답니다.\n\n매운 음식이나 자극적인 음식은 줄이고, 쓴맛 나는 채소(여주, 셀러리 등)를 섭취하면 심장 건강에 도움이 돼요.\n\n5~7월에 건강에 특히 주의하세요. 더위에 약할 수 있으니, 여름철 건강 관리에 신경 써주세요!`,
    '土': `올해 건강운은 비교적 양호해요! 화생토(火生土)의 기운이 당신의 건강을 지원해주기 때문이에요.\n\n다만 소화기 건강에는 주의가 필요해요. 토(土)는 비장과 위장을 관장하므로, 규칙적인 식사와 균형 잡힌 식단이 중요하답니다.\n\n단맛 나는 음식(고구마, 단호박 등)을 적절히 섭취하면 비장 건강에 도움이 돼요. 과식은 피해주세요.\n\n규칙적인 생활 습관을 유지하면 올해 건강하게 보낼 수 있어요. 계절이 바뀌는 3월, 6월, 9월, 12월에 건강 점검을 하면 좋답니다.`,
    '金': `올해 건강운에서 가장 주의해야 할 부분은 호흡기와 피부예요. 화극금(火克金)의 기운으로 폐와 대장에 부담이 갈 수 있답니다.\n\n맑은 공기를 마시는 것이 중요해요. 공기청정기를 사용하고, 미세먼지가 심한 날은 외출을 자제하세요. 호흡 운동이나 명상이 폐 건강에 도움이 돼요.\n\n매운맛 나는 음식(무, 생강, 배)을 적절히 섭취하면 폐 건강에 좋아요. 피부 보습에도 신경 써주세요.\n\n5~7월에 건강에 특히 주의하세요. 스트레스가 건강에 직접적인 영향을 미치니, 적절한 해소 방법을 찾아보세요!`,
    '水': `올해 건강운에서 가장 주의해야 할 부분은 신장과 방광 건강이에요. 수(水)가 화(火)와 대립하면서 에너지 소모가 클 수 있답니다.\n\n충분한 수분 섭취가 가장 중요해요. 하루 8잔 이상의 물을 마시고, 카페인 섭취는 줄여주세요. 검은콩, 해조류, 견과류 등이 신장 건강에 도움이 돼요.\n\n보온에도 신경 써주세요. 특히 하체를 따뜻하게 유지하는 것이 중요해요. 족욕이나 반신욕이 건강에 좋답니다.\n\n1~2월과 11~12월에 건강에 특히 주의하세요. 충분한 휴식과 수면이 건강의 기본이에요!`
  };

  return {
    yearAnalysis: yearAnalysisMap[dayElement] || yearAnalysisMap['木'],
    wealthFortune: wealthMap[dayElement] || wealthMap['木'],
    careerFortune: careerMap[dayElement] || careerMap['木'],
    loveFortune: loveMap[dayElement] || loveMap['木'],
    healthFortune: healthMap[dayElement] || healthMap['木'],
  };
}

export default function YearlyFortune() {
  useCanonical('/yearly-fortune');
  
  useEffect(() => {
    setYearlyFortuneOGTags();
  }, []);

  const [result, setResult] = useState<SajuResult | null>(null);
  const [detailedFortune, setDetailedFortune] = useState<ReturnType<typeof generate2026DetailedFortune> | null>(null);
  const [monthlyFortune, setMonthlyFortune] = useState<ReturnType<typeof generateMonthlyFortune> | null>(null);
  const [extraInfo, setExtraInfo] = useState<any>(null);
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
  
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

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset(parsed);
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    // 생년월일 데이터를 GA4에 전송 (SEO 분석용)
    let birthDateStr = data.birthDate;
    if (typeof birthDateStr !== 'string') {
      if (birthDateStr instanceof Date) {
        birthDateStr = birthDateStr.toISOString().split('T')[0];
      } else {
        birthDateStr = String(birthDateStr);
      }
    }
    const [year, month, day] = birthDateStr.split('-').map(Number);
    const birthDateObj = new Date(year, month - 1, day);
    
    trackCustomEvent("check_fortune_result", {
      fortune_type: "신년운세",
      gender: data.gender,
      birth_date: birthDateStr,
      birth_year: birthDateObj.getFullYear(),
      birth_month: String(birthDateObj.getMonth() + 1).padStart(2, '0'),
      birth_day: String(birthDateObj.getDate()).padStart(2, '0'),
      calendar_type: data.calendarType,
    });
    localStorage.setItem("muun_user_data", JSON.stringify(data));
    const time = data.birthTimeUnknown ? "12:00" : data.birthTime;
    // convertToSolarDate는 문자열 형식의 날짜를 받아야 함 (YYYY-MM-DD)
    const birthDateStrForConverter = `${birthDateObj.getFullYear()}-${String(birthDateObj.getMonth() + 1).padStart(2, '0')}-${String(birthDateObj.getDate()).padStart(2, '0')}`;
    const date = convertToSolarDate(birthDateStrForConverter, time, data.calendarType, data.isLeapMonth);
    console.log('[YearlyFortune] convertToSolarDate result:', date);
    const sajuResult = calculateSaju(date, data.gender);
    console.log('[YearlyFortune] calculateSaju result:', sajuResult);
    console.log('[YearlyFortune] dayPillar:', sajuResult?.dayPillar);
    setResult(sajuResult);
    window.scrollTo(0, 0);

    const details = generateFortuneDetails(sajuResult);
    setExtraInfo(details);
    
    const detailed = generate2026DetailedFortune(sajuResult);
    setDetailedFortune(detailed);
    
    const monthly = generateMonthlyFortune(sajuResult);
    setMonthlyFortune(monthly);
  };

  const toggleMonth = (month: number) => {
    setExpandedMonths(prev => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-base md:text-lg font-bold text-white">2026년 신년운세</h1>
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
                <ScrollText className="w-3 h-3 text-primary" />
                <span className="text-[10px] md:text-sm md:text-xs font-bold tracking-wider text-primary uppercase">2026년 병오년 운세</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">신년운세</h2>
              <p className="text-muted-foreground text-xs md:text-base md:text-sm">
                새로운 해의 기운을 미리 확인하고 당신의 한 해를 설계해보세요
              </p>
            </div>

            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  운세 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-primary" />
                        이름
                      </Label>
                      <Input
                        id="name"
                        placeholder="이름을 입력해주세요"
                        {...form.register("name")}
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-primary/50 focus:border-primary transition-all text-base md:text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        성별
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("gender")}
                        onValueChange={(value) => {
                          if (value) {
                            form.setValue("gender", value as "male" | "female");
                            trackEvent("User Input", "Change Gender", value);
                          }
                        }}
                        className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                      >
                        <ToggleGroupItem value="male" className="h-full rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white/70 transition-all font-medium text-base md:text-sm">
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem value="female" className="h-full rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white/70 transition-all font-medium text-base md:text-sm">
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        생년월일
                      </Label>
                      <DatePickerInput
                        id="birthDate"
                        {...form.register("birthDate")}
                        accentColor="primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="birthTime" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        태어난 시간
                      </Label>
                      <div className="space-y-2">
                        <Input
                          id="birthTime"
                          type="time"
                          {...form.register("birthTime")}
                          disabled={form.watch("birthTimeUnknown")}
                          className={`h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-primary/50 focus:border-primary transition-all text-base md:text-sm ${form.watch("birthTimeUnknown") ? 'opacity-40' : ''}`}
                        />
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            {...form.register("birthTimeUnknown")}
                            className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-primary"
                          />
                          <span className="text-[11px] text-white/60">모름</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                      <ScrollText className="w-3.5 h-3.5 text-primary" />
                      날짜 구분
                    </Label>
                    <ToggleGroup
                      type="single"
                      value={form.watch("calendarType")}
                      onValueChange={(value) => {
                        if (value) {
                          form.setValue("calendarType", value as "solar" | "lunar");
                          trackEvent("User Input", "Change Calendar Type", value);
                        }
                      }}
                      className="w-full md:w-48 h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                    >
                      <ToggleGroupItem value="solar" className="h-full rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white/70 transition-all font-medium text-base md:text-sm">
                        양력
                      </ToggleGroupItem>
                      <ToggleGroupItem value="lunar" className="h-full rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-white/70 transition-all font-medium text-base md:text-sm">
                        음력
                      </ToggleGroupItem>
                    </ToggleGroup>

                    {/* 윤달 여부 (음력일 때만 표시) */}
                    {form.watch("calendarType") === "lunar" && (
                      <div className="flex items-center gap-2 px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            {...form.register("isLeapMonth")}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 accent-primary"
                          />
                          <span className="text-base md:text-sm text-white/80 group-hover:text-primary transition-colors">윤달(Leap Month)인 경우 체크</span>
                        </label>
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-primary-foreground font-bold text-sm md:text-base rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                  2026년 신년운세 보기                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-3 md:p-4 text-center space-y-1.5">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <p className="text-[10px] md:text-sm md:text-xs font-medium text-white">2026년 총운</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-3 md:p-4 text-center space-y-1.5">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mx-auto">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                  </div>
                  <p className="text-[10px] md:text-sm md:text-xs font-medium text-white">재물운</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-3 md:p-4 text-center space-y-1.5">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto">
                    <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  </div>
                  <p className="text-[10px] md:text-sm md:text-xs font-medium text-white">직업운</p>
                </CardContent>
              </Card>
            </div>

            <YearlyFortuneContent />
          </motion.div>
        </main>
      </div>
    );
  }

  // ===== 결과 화면 =====
  const dayStem = result?.dayPillar?.stem;
  const dayElement = STEM_ELEMENTS[dayStem];
  const stemPersonality = STEM_PERSONALITY[dayStem];
  const elementBalance = calculateElementBalance(result);
  const balanceAnalysis = analyzeElementBalance(elementBalance);
  const userName = form.getValues('name');
  
  // 데이터 검증
  if (!result || !dayStem || !stemPersonality) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" size="sm" onClick={() => setResult(null)} className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">사주 계산 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const ELEMENT_TEXT_COLOR: Record<string, string> = {
    '木': 'text-green-400', '火': 'text-red-400', '土': 'text-yellow-400', '金': 'text-slate-200', '水': 'text-blue-400',
  };

  return (
    <>
      <Helmet>
        <title>{userName}님의 2026년 신년운세 - 무운</title>
        <meta name="description" content={`${userName}님의 사주팔자를 분석한 2026년 신년운세 결과입니다. 병오년 운세, 월별 운세, 재물운, 직업운, 애정운 등을 확인하세요.`} />
        <meta property="og:title" content={`${userName}님의 2026년 신년운세 - 무운`} />
        <meta property="og:description" content={`${userName}님의 사주팔자를 분석한 2026년 신년운세 결과입니다.`} />
        <meta name="keywords" content="신년운세, 2026년운세, 병오년운세, 사주, 운세, 무운" />
      </Helmet>
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* '시간 모름' 시 안내 라벨 */}
      {form.watch("birthTimeUnknown") && (
        <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 relative z-50">
          <p className="text-[10px] md:text-sm md:text-xs text-primary text-center font-medium">
            태어난 시간을 제외한 삼주 분석 결과입니다
          </p>
        </div>
      )}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setResult(null)} className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base md:text-lg font-bold text-white">2026년 신년운세 결과</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary min-w-[44px] min-h-[44px]"
            onClick={() => {
              shareContent({
                title: '무운 2026년 신년운세',
                text: `${userName}님의 2026년 신년운세 결과를 확인해보세요!`,
                page: 'yearly_fortune',
                buttonType: 'icon',
              });
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 px-4 py-5 md:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${commonMaxWidth} space-y-5 md:space-y-6`}
        >
          {/* 1. 사주팔자표 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <ScrollText className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-white">{userName}님의 사주팔자</h2>
            </div>
            <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <SajuChart result={result} theme="yellow" />
              </CardContent>
            </Card>
          </section>

          {/* 1-1. 사주팔자 설명 가이드 */}
          <SajuGuide userName={userName} theme="yellow" />

          {/* 2. 일간 성격 분석 */}
          {stemPersonality && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="text-lg font-bold text-white">일간(日干) 성격 분석</h2>
              </div>
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-4 py-3">
                  <CardTitle className="text-sm md:text-base text-purple-400 flex items-center gap-2">
                    <span className={`text-lg ${ELEMENT_TEXT_COLOR[dayElement]}`}>{dayStem}</span>
                    {stemPersonality.name} — {stemPersonality.nature} ({stemPersonality.symbol})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {stemPersonality.personality.map((p, i) => (
                    <p key={i} className="text-base md:text-sm text-white/80 leading-relaxed">{p}</p>
                  ))}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-3">
                      <p className="text-sm md:text-xs font-bold text-green-400 mb-2">강점</p>
                      <ul className="space-y-1">
                        {stemPersonality.strength.map((s, i) => (
                          <li key={i} className="text-sm md:text-xs text-white/70 flex items-start gap-1.5">
                            <span className="w-1 h-1 bg-green-400 rounded-full mt-1.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3">
                      <p className="text-sm md:text-xs font-bold text-red-400 mb-2">주의점</p>
                      <ul className="space-y-1">
                        {stemPersonality.weakness.map((w, i) => (
                          <li key={i} className="text-sm md:text-xs text-white/70 flex items-start gap-1.5">
                            <span className="w-1 h-1 bg-red-400 rounded-full mt-1.5 shrink-0" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-3">
                    <p className="text-sm md:text-xs font-bold text-yellow-400 mb-1">전문가 조언</p>
                    <p className="text-sm md:text-xs text-white/70 leading-relaxed">{stemPersonality.advice}</p>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* 3. 오행 분석 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-white">오행(五行) 분석</h2>
            </div>
            <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="space-y-3">
                  {elementBalance.map((element) => {
                    const color = ELEMENT_TEXT_COLOR[element.name] || 'text-white';
                    const percentage = Math.round((element.value / 8) * 100);
                    return (
                      <div key={element.name} className="flex items-center gap-3">
                        <span className={`w-12 text-center font-bold text-base md:text-sm ${color}`}>
                          {withReading(element.name)}
                        </span>
                        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`h-full rounded-full ${
                              element.name === '木' ? 'bg-green-500' :
                              element.name === '火' ? 'bg-red-500' :
                              element.name === '土' ? 'bg-yellow-500' :
                              element.name === '金' ? 'bg-slate-300' :
                              'bg-blue-500'
                            }`}
                          />
                        </div>
                        <span className="w-16 text-right text-sm md:text-xs text-white/60">{element.value}개 ({percentage}%)</span>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-white/5 rounded-xl p-3 space-y-2">
                  <p className="text-base md:text-sm text-white/80 leading-relaxed">{balanceAnalysis.analysis}</p>
                  {balanceAnalysis.supplement && (
                    <p className="text-sm md:text-xs text-white/60 leading-relaxed">{balanceAnalysis.supplement}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 4. 행운 아이템 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-pink-400" />
              </div>
              <h2 className="text-lg font-bold text-white">행운 아이템</h2>
            </div>
            <LuckyItems result={result} extraInfo={extraInfo} />
          </section>

          {/* 5. 2026년 총운 */}
          {detailedFortune && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-white">2026년 병오년(丙午年) 총운</h2>
              </div>
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <CardContent className="p-4 space-y-4">
                  {form.watch("birthTimeUnknown") && (
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-2">
                      <p className="text-sm md:text-xs text-primary leading-relaxed">
                        💡 태어난 시간을 모르시는 경우, 생년월일(삼주)을 중심으로 핵심 성격과 2026년 운세를 분석해 드립니다.
                      </p>
                    </div>
                  )}
                  <div className="text-base md:text-sm text-white/80 leading-relaxed whitespace-pre-line">{autoLinkKeywordsToJSX(detailedFortune.yearAnalysis)}</div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* 6. 재물운 */}
          {detailedFortune && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <h2 className="text-lg font-bold text-white">2026년 재물운</h2>
              </div>
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="text-base md:text-sm text-white/80 leading-relaxed whitespace-pre-line">{autoLinkKeywordsToJSX(detailedFortune.wealthFortune)}</div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* 7. 직업운 */}
          {detailedFortune && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                </div>
                <h2 className="text-lg font-bold text-white">2026년 직업운</h2>
              </div>
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="text-base md:text-sm text-white/80 leading-relaxed whitespace-pre-line">{autoLinkKeywordsToJSX(detailedFortune.careerFortune)}</div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* 8. 애정운 */}
          {detailedFortune && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-pink-400" />
                </div>
                <h2 className="text-lg font-bold text-white">2026년 애정운</h2>
              </div>
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="text-base md:text-sm text-white/80 leading-relaxed whitespace-pre-line">{autoLinkKeywordsToJSX(detailedFortune.loveFortune)}</div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* 9. 건강운 */}
          {detailedFortune && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-white">2026년 건강운</h2>
              </div>
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="text-base md:text-sm text-white/80 leading-relaxed whitespace-pre-line">{autoLinkKeywordsToJSX(detailedFortune.healthFortune)}</div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* 10. 월별 운세 */}
          {monthlyFortune && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                </div>
                <h2 className="text-lg font-bold text-white">2026년 월별 운세</h2>
              </div>
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <CardContent className="p-4 space-y-2">
                  {monthlyFortune.map((m) => (
                    <div key={m.month} className="border border-white/5 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleMonth(m.month)}
                        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors min-h-[44px]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base md:text-sm font-bold text-white w-8">{m.month}월</span>
                          <div className="flex-1 h-2 bg-white/10 rounded-full w-20 md:w-32 overflow-hidden">
                            <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.score}%` }} />
                          </div>
                          <span className={`text-sm md:text-xs font-bold ${
                            m.score >= 85 ? 'text-green-400' :
                            m.score >= 75 ? 'text-yellow-400' :
                            m.score >= 70 ? 'text-orange-400' :
                            'text-red-400'
                          }`}>{m.score}점</span>
                        </div>
                        {expandedMonths.has(m.month) ? (
                          <ChevronUp className="w-4 h-4 text-white/40" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-white/40" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedMonths.has(m.month) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 pt-1 border-t border-white/5">
                              <p className="text-sm md:text-xs text-white/70 leading-relaxed">{m.content}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          )}

          {/* Schema Markup - Temporarily disabled */}

          {/* 11. 일주 해석 */}
          {result && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Quote className="w-4 h-4 text-amber-400" />
                </div>
                <h2 className="text-lg font-bold text-white">일주(日柱) 해석</h2>
              </div>
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <p className="text-sm md:text-xs text-white/50 mb-2">
                    일주: {pillarReading(result.dayPillar.stem, result.dayPillar.branch)}
                  </p>
                  <p className="text-base md:text-sm text-white/80 leading-relaxed">
                    {(() => {
                      const stem = result.dayPillar.stem;
                      const branch = result.dayPillar.branch;
                      const hanjaKey = convertToHanja(stem, branch);
                      const iljuInfo = (iljuData as Record<string, string>)[hanjaKey];
                      
                      console.log('=== DEBUG: 일주 렌더링 ===');
                      console.log('stem:', stem, 'type:', typeof stem);
                      console.log('branch:', branch, 'type:', typeof branch);
                      console.log('hanjaKey:', hanjaKey);
                      console.log('iljuData type:', typeof iljuData);
                      console.log('iljuData is null/undefined:', iljuData == null);
                      console.log('iljuData keys sample:', Object.keys(iljuData).slice(0, 10));
                      console.log('iljuInfo:', iljuInfo);
                      console.log('=== END DEBUG ===');
                      
                      return iljuInfo || "일주 정보를 불러올 수 없습니다.";
                    })()}
                  </p>
                </CardContent>
              </Card>
            </section>
          )}

          {/* 12. 용어 설명 */}
          <SajuGlossary />

          {/* 이미지 저장 카드 */}
          <div className="pt-2">
            <FortuneShareCard result={result} userName={userName} type="yearly" />
          </div>

          {/* 하단 버튼 */}
          <div className="space-y-2 pt-2">
            <Button
              className="w-full h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-medium rounded-xl text-base md:text-sm"
              onClick={() => {
                shareContent({
                  title: '무운 2026년 신년운세',
                  text: `${userName}님의 2026년 신년운세 결과를 확인해보세요!`,
                  page: 'yearly_fortune',
                  buttonType: 'text_button',
                });
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              친구에게 공유하기
            </Button>
            <Button
              variant="ghost"
              onClick={() => setResult(null)}
              className="w-full h-12 text-white/60 hover:text-white hover:bg-white/5 font-medium rounded-xl text-base md:text-sm"
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
