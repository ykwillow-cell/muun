import { useForm } from "react-hook-form";
import { useEffect } from 'react';
import { useCanonical } from '@/lib/use-canonical';
import { setLifelongSajuOGTags } from '@/lib/og-tags';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Star, Sparkles, User, Zap, Briefcase, Activity, Heart, Quote, TrendingUp, Share2, ScrollText, Calendar, Clock, Shield, Baby, Landmark, Sunset } from "lucide-react";
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
import SajuInfoContent from "@/components/SajuInfoContent";
import SajuGuide from "@/components/SajuGuide";
import FortuneShareCard from "@/components/FortuneShareCard";
import { iljuData } from "@/lib/ilju-data";
import { convertToHanja } from "@/lib/hanja-converter";
import { trackEvent, trackCustomEvent } from "@/lib/ga4";
import { 
  generateLifelongFortune, 
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
  birthTime: z.string().min(1, "태어난 시간을 입력해주세요"),
  calendarType: z.enum(["solar", "lunar"]),
  isMarried: z.enum(["yes", "no"]),
});

type FormValues = z.infer<typeof formSchema>;

// 평생 연애/결혼운 생성
function generateLoveFortune(saju: SajuResult, gender: string, isMarried: string): { title: string; content: string } {
  const dayElement = STEM_ELEMENTS[saju.dayPillar.stem];
  const dayStem = saju.dayPillar.stem;
  
  const loveMap: Record<string, { single: string; married: string }> = {
    '木': {
      single: `${withReading(dayStem)} 일간이신 당신은 연애에서도 나무처럼 곧고 진실된 사랑을 추구합니다.\n\n당신은 한번 마음을 주면 쉽게 변하지 않는 타입입니다. 상대방에게 헌신적이고, 관계를 오래 유지하려는 노력을 합니다. 다만 표현이 서툴러 상대방이 답답해할 수 있으니, 감정을 말로 표현하는 연습이 필요합니다.\n\n이상적인 배우자상은 당신의 곧은 성품을 이해하고 존중해주는 사람입니다. 물(水)의 기운을 가진 사람과 궁합이 좋으며, 지적이고 차분한 성격의 상대가 당신과 잘 맞습니다.\n\n연애 시기로는 봄(3~5월)에 새로운 인연을 만날 가능성이 높고, 학습 모임이나 동호회에서 좋은 만남이 기대됩니다.\n\n결혼 후에는 가정의 기둥 역할을 충실히 하며, 자녀 교육에 특히 열정적입니다. 배우자와의 소통을 꾸준히 하면 행복한 가정을 이룰 수 있습니다.`,
      married: `${withReading(dayStem)} 일간이신 당신은 가정에서 든든한 기둥과 같은 존재입니다.\n\n결혼 생활에서 당신은 책임감이 강하고 가족을 위해 묵묵히 헌신하는 타입입니다. 다만 너무 일에만 집중하다 보면 배우자와의 감정적 교류가 소홀해질 수 있으니 주의하세요.\n\n배우자와의 관계를 더욱 좋게 하려면, 주말에 함께 자연 속에서 시간을 보내거나 새로운 것을 함께 배우는 활동이 효과적입니다. 목(木)의 기운은 성장을 상징하므로, 함께 성장하는 관계를 만들어가세요.\n\n자녀운은 좋은 편입니다. 자녀가 당신의 뜻을 이어받아 훌륭하게 성장할 가능성이 높으며, 특히 교육 분야에서 좋은 성과를 거둘 수 있습니다.\n\n가정의 화목을 위해 가장 중요한 것은 대화입니다. 당신의 생각과 감정을 솔직하게 나누는 습관을 기르세요.`
    },
    '火': {
      single: `${withReading(dayStem)} 일간이신 당신은 연애에서도 태양처럼 열정적이고 적극적입니다.\n\n당신은 사랑에 빠지면 온 세상이 빛나는 것처럼 느끼는 로맨티스트입니다. 상대방에게 아낌없이 사랑을 표현하고, 함께하는 시간을 즐겁게 만드는 재능이 있습니다.\n\n다만 열정이 식는 것도 빠를 수 있으니, 관계를 오래 유지하려면 꾸준한 노력이 필요합니다. 초반의 설렘이 지나간 후에도 상대방에 대한 관심을 유지하세요.\n\n이상적인 배우자상은 당신의 열정을 받아줄 수 있는 넓은 마음을 가진 사람입니다. 토(土)의 기운을 가진 사람과 궁합이 좋으며, 안정적이고 포용력 있는 상대가 당신과 잘 맞습니다.\n\n결혼 후에는 가정에 활력을 불어넣는 역할을 하며, 가족 행사나 모임을 주도적으로 이끕니다.`,
      married: `${withReading(dayStem)} 일간이신 당신은 가정에서 따뜻한 햇살 같은 존재입니다.\n\n결혼 생활에서 당신은 가족들에게 밝은 에너지를 전하며, 가정의 분위기를 활기차게 만듭니다. 다만 외부 활동이 많아 가정에 소홀해질 수 있으니, 가족과의 시간을 의식적으로 확보하세요.\n\n배우자와의 관계에서는 서로의 개인 시간을 존중하면서도, 함께하는 특별한 순간을 만드는 것이 중요합니다. 기념일이나 이벤트를 챙기는 것이 관계 유지에 효과적입니다.\n\n자녀운은 활발하고 재능 있는 자녀를 둘 가능성이 높습니다. 자녀의 개성을 존중하고 자유롭게 키우되, 기본적인 예의와 규칙은 가르치세요.\n\n가정의 화목을 위해 감정 조절이 중요합니다. 화가 날 때는 한 템포 쉬고 대화하는 습관을 기르세요.`
    },
    '土': {
      single: `${withReading(dayStem)} 일간이신 당신은 연애에서도 대지처럼 안정적이고 신뢰감 있는 파트너입니다.\n\n당신은 화려한 연애보다는 진실되고 깊은 관계를 추구합니다. 상대방을 세심하게 챙기고, 든든한 울타리가 되어주는 것이 당신의 사랑 방식입니다.\n\n다만 너무 신중하게 접근하다 보면 기회를 놓칠 수 있으니, 마음이 가는 상대에게는 좀 더 적극적으로 다가가세요.\n\n이상적인 배우자상은 가정적이고 성실한 사람입니다. 화(火)의 기운을 가진 사람과 궁합이 좋으며, 밝고 활발한 성격의 상대가 당신의 삶에 활력을 줍니다.\n\n결혼 후에는 안정적이고 화목한 가정을 이루며, 배우자와 함께 재산을 착실하게 모아갑니다.`,
      married: `${withReading(dayStem)} 일간이신 당신은 가정의 든든한 터전과 같은 존재입니다.\n\n결혼 생활에서 당신은 안정감과 신뢰를 바탕으로 한 탄탄한 가정을 만들어갑니다. 경제적으로도 꾸준히 기반을 다져 가족이 불안하지 않도록 합니다.\n\n배우자와의 관계에서는 변화를 두려워하지 말고, 때로는 새로운 시도를 해보세요. 함께 여행을 가거나 새로운 취미를 시작하면 관계에 신선함을 더할 수 있습니다.\n\n자녀운은 매우 좋습니다. 자녀가 안정적인 환경에서 건강하게 성장하며, 부모의 사랑을 듬뿍 받아 정서적으로 안정된 아이로 자랍니다.\n\n가정의 화목을 위해 가장 중요한 것은 변화에 대한 유연한 태도입니다. 고집을 부리기보다 배우자의 의견을 존중하세요.`
    },
    '金': {
      single: `${withReading(dayStem)} 일간이신 당신은 연애에서도 보석처럼 빛나는 매력을 가지고 있습니다.\n\n당신은 이상이 높고, 쉽게 마음을 주지 않는 타입입니다. 하지만 한번 마음을 정하면 끝까지 지키려는 의리가 있습니다. 상대방에게 직설적으로 표현하는 편이라 오해를 살 수 있지만, 속마음은 따뜻합니다.\n\n이상적인 배우자상은 당신의 강한 성격을 부드럽게 감싸줄 수 있는 사람입니다. 수(水)의 기운을 가진 사람과 궁합이 좋으며, 지적이고 유연한 성격의 상대가 당신과 잘 맞습니다.\n\n연애 시기로는 가을(9~11월)에 좋은 인연을 만날 가능성이 높고, 직장이나 전문 모임에서 만남이 기대됩니다.\n\n결혼 후에는 원칙적이지만 가족을 위해서는 무엇이든 하는 헌신적인 배우자가 됩니다.`,
      married: `${withReading(dayStem)} 일간이신 당신은 가정에서 원칙과 질서를 세우는 역할을 합니다.\n\n결혼 생활에서 당신은 가족을 지키기 위해 강한 의지를 보입니다. 경제적으로도 계획적이고 체계적인 관리를 하여 안정적인 가정을 유지합니다.\n\n다만 너무 완벽을 추구하면 가족들이 부담을 느낄 수 있으니, 때로는 느슨하게 풀어주는 여유도 필요합니다.\n\n배우자와의 관계에서는 칭찬과 격려를 아끼지 마세요. 당신의 직설적인 표현이 상처가 될 수 있으니, 부드러운 말투를 연습하면 관계가 더욱 좋아집니다.\n\n자녀운은 총명하고 의지가 강한 자녀를 둘 가능성이 높습니다. 자녀의 자율성을 존중하되, 올바른 방향으로 이끌어주세요.`
    },
    '水': {
      single: `${withReading(dayStem)} 일간이신 당신은 연애에서도 깊고 신비로운 매력을 발산합니다.\n\n당신은 지적인 대화를 나눌 수 있는 상대에게 끌리며, 표면적인 관계보다는 깊은 정서적 교감을 추구합니다. 상대방의 내면을 읽는 직관력이 뛰어나 상대의 마음을 잘 이해합니다.\n\n다만 속마음을 잘 드러내지 않아 상대방이 답답해할 수 있으니, 감정 표현을 좀 더 적극적으로 해보세요.\n\n이상적인 배우자상은 지적 호기심이 풍부하고 대화가 통하는 사람입니다. 목(木)의 기운을 가진 사람과 궁합이 좋으며, 성장 지향적이고 긍정적인 상대가 당신과 잘 맞습니다.\n\n결혼 후에는 지혜로운 조언자 역할을 하며, 가족의 중요한 결정에서 현명한 판단을 내립니다.`,
      married: `${withReading(dayStem)} 일간이신 당신은 가정에서 지혜로운 참모와 같은 존재입니다.\n\n결혼 생활에서 당신은 가족의 미래를 내다보는 안목으로 현명한 결정을 이끕니다. 자녀 교육에서도 장기적인 관점에서 방향을 설정하는 능력이 있습니다.\n\n배우자와의 관계에서는 감정적인 교류를 더 늘리세요. 머리로만 판단하지 말고, 가슴으로 느끼는 시간을 가지면 관계가 더욱 깊어집니다.\n\n함께 여행을 가거나 새로운 문화를 체험하는 것이 부부 관계에 좋습니다. 특히 물가(바다, 호수, 강)에서의 시간이 당신에게 활력을 줍니다.\n\n자녀운은 지적이고 창의적인 자녀를 둘 가능성이 높습니다. 자녀의 호기심을 격려하고, 다양한 경험을 할 수 있도록 지원해주세요.`
    }
  };

  const data = loveMap[dayElement] || loveMap['木'];
  const content = isMarried === 'yes' ? data.married : data.single;
  
  return {
    title: isMarried === 'yes' ? '결혼·가정운' : '연애·결혼운',
    content
  };
}

// 평생 건강운 생성
function generateHealthFortune(saju: SajuResult): { title: string; content: string } {
  const dayElement = STEM_ELEMENTS[saju.dayPillar.stem];
  
  const healthMap: Record<string, string> = {
    '木': `목(木) 일간이신 당신의 건강에서 가장 주의해야 할 장기는 간(肝)과 담(膽)입니다. 동양의학에서 목(木)은 간과 담을 관장하며, 눈 건강과도 밀접한 관련이 있습니다.\n\n**체질적 특성**\n당신은 기본적으로 생명력이 강하고 회복력이 좋은 체질입니다. 다만 스트레스를 받으면 간에 부담이 가기 쉽고, 이것이 눈의 피로, 두통, 근육 경직 등으로 나타날 수 있습니다.\n\n**주의해야 할 질환**\n간 기능 저하, 눈 건강(시력 저하, 안구건조증), 근육 및 인대 문제, 알레르기 질환에 주의하세요. 특히 봄철에 건강이 약해질 수 있으니 환절기 관리가 중요합니다.\n\n**건강 관리 방법**\n- 녹색 채소와 신맛 나는 과일을 충분히 섭취하세요 (브로콜리, 시금치, 레몬, 매실)\n- 규칙적인 스트레칭과 요가로 근육의 유연성을 유지하세요\n- 눈의 피로를 줄이기 위해 전자기기 사용 시간을 조절하세요\n- 산림욕이나 공원 산책이 심신 안정에 매우 효과적입니다\n- 과음은 간에 직접적인 부담을 주므로 절제하세요\n\n**나이대별 건강 포인트**\n- 20~30대: 눈 건강과 스트레스 관리에 집중\n- 40~50대: 간 기능 정기 검진, 근골격계 관리\n- 60대 이후: 관절 건강, 유연성 유지 운동`,
    '火': `화(火) 일간이신 당신의 건강에서 가장 주의해야 할 장기는 심장(心)과 소장(小腸)입니다. 동양의학에서 화(火)는 심장과 소장을 관장하며, 혈액 순환과 정신 건강과도 밀접한 관련이 있습니다.\n\n**체질적 특성**\n당신은 에너지가 넘치고 활동적인 체질이지만, 그만큼 에너지 소모도 큽니다. 열이 많은 체질이라 더위에 약하고, 감정의 기복이 건강에 직접적인 영향을 미칩니다.\n\n**주의해야 할 질환**\n심장 질환, 고혈압, 불면증, 구내염, 피부 발진에 주의하세요. 특히 여름철에 건강이 약해질 수 있으니 더위 관리가 중요합니다.\n\n**건강 관리 방법**\n- 쓴맛 나는 음식을 적절히 섭취하세요 (여주, 셀러리, 녹차, 쑥)\n- 격렬한 운동보다는 수영, 요가 등 심신을 안정시키는 운동이 좋습니다\n- 충분한 수면이 심장 건강의 기본입니다 (하루 7~8시간)\n- 명상이나 심호흡으로 마음의 평화를 유지하세요\n- 매운 음식과 카페인은 줄이세요\n\n**나이대별 건강 포인트**\n- 20~30대: 수면 패턴 관리, 스트레스 해소법 확보\n- 40~50대: 심장 건강 정기 검진, 혈압 관리\n- 60대 이후: 혈액 순환 개선, 정서적 안정`,
    '土': `토(土) 일간이신 당신의 건강에서 가장 주의해야 할 장기는 비장(脾)과 위장(胃)입니다. 동양의학에서 토(土)는 비장과 위장을 관장하며, 소화 기능과 면역력과도 밀접한 관련이 있습니다.\n\n**체질적 특성**\n당신은 기본적으로 안정적이고 튼튼한 체질이지만, 소화기가 약점이 될 수 있습니다. 걱정이 많으면 위장에 바로 영향이 오고, 과식이나 불규칙한 식사가 건강을 해칠 수 있습니다.\n\n**주의해야 할 질환**\n위장 질환(위염, 소화불량), 당뇨, 비만, 부종에 주의하세요. 특히 환절기(3월, 6월, 9월, 12월)에 건강이 약해질 수 있으니 관리가 필요합니다.\n\n**건강 관리 방법**\n- 단맛 나는 자연식품을 적절히 섭취하세요 (고구마, 단호박, 대추, 꿀)\n- 규칙적인 식사 시간을 지키고, 과식을 피하세요\n- 걷기 운동이 소화기 건강에 가장 효과적입니다\n- 흙을 만지는 활동(원예, 도예)이 심신 안정에 도움이 됩니다\n- 차가운 음식보다 따뜻한 음식을 선호하세요\n\n**나이대별 건강 포인트**\n- 20~30대: 규칙적인 식습관 형성, 체중 관리\n- 40~50대: 소화기 정기 검진, 당뇨 예방\n- 60대 이후: 면역력 강화, 균형 잡힌 영양 섭취`,
    '金': `금(金) 일간이신 당신의 건강에서 가장 주의해야 할 장기는 폐(肺)와 대장(大腸)입니다. 동양의학에서 금(金)은 폐와 대장을 관장하며, 피부 건강과 호흡기와도 밀접한 관련이 있습니다.\n\n**체질적 특성**\n당신은 기본적으로 강인한 체질이지만, 호흡기와 피부가 약점이 될 수 있습니다. 건조한 환경이나 미세먼지에 민감하며, 스트레스가 피부 트러블로 나타나기 쉽습니다.\n\n**주의해야 할 질환**\n호흡기 질환(기관지염, 천식), 피부 질환(아토피, 건조증), 대장 질환, 알레르기에 주의하세요. 특히 가을과 겨울에 건강이 약해질 수 있습니다.\n\n**건강 관리 방법**\n- 매운맛 나는 음식을 적절히 섭취하세요 (무, 생강, 배, 도라지)\n- 호흡 운동과 명상이 폐 건강에 매우 효과적입니다\n- 공기청정기를 사용하고, 실내 습도를 적절히 유지하세요\n- 피부 보습에 신경 쓰고, 충분한 수분을 섭취하세요\n- 규칙적인 생활 리듬을 유지하는 것이 중요합니다\n\n**나이대별 건강 포인트**\n- 20~30대: 피부 관리, 호흡기 건강 유지\n- 40~50대: 폐 기능 정기 검진, 대장 건강 관리\n- 60대 이후: 면역력 강화, 보온 관리`,
    '水': `수(水) 일간이신 당신의 건강에서 가장 주의해야 할 장기는 신장(腎)과 방광(膀胱)입니다. 동양의학에서 수(水)는 신장과 방광을 관장하며, 뼈 건강과 생식 기능과도 밀접한 관련이 있습니다.\n\n**체질적 특성**\n당신은 지적 활동이 활발한 체질이지만, 체력적으로는 무리하기 쉽습니다. 추위에 약하고, 하체가 차가워지기 쉬우며, 과로하면 신장에 부담이 갑니다.\n\n**주의해야 할 질환**\n신장 질환, 방광염, 요통, 관절 질환, 생식기 질환에 주의하세요. 특히 겨울철에 건강이 약해질 수 있으니 보온에 신경 쓰세요.\n\n**건강 관리 방법**\n- 짠맛 나는 음식을 적절히 섭취하세요 (해조류, 검은콩, 검은깨, 견과류)\n- 충분한 수분 섭취가 가장 중요합니다 (하루 8잔 이상)\n- 족욕이나 반신욕으로 하체를 따뜻하게 유지하세요\n- 수영이나 아쿠아로빅 같은 수중 운동이 효과적입니다\n- 카페인과 알코올은 신장에 부담을 주므로 절제하세요\n\n**나이대별 건강 포인트**\n- 20~30대: 수분 섭취 습관 형성, 허리 건강 관리\n- 40~50대: 신장 기능 정기 검진, 뼈 건강(골밀도) 관리\n- 60대 이후: 보온 관리, 관절 건강, 충분한 휴식`
  };

  return {
    title: '평생 건강운',
    content: healthMap[dayElement] || healthMap['木']
  };
}

export default function LifelongSaju() {
  useCanonical('/lifetime-saju');
  
  useEffect(() => {
    setLifelongSajuOGTags();
  }, []);

  const [result, setResult] = useState<SajuResult | null>(null);
  const [fortunes, setFortunes] = useState<{
    personality: FortuneResult | null;
    earlyLife: FortuneResult | null;
    midLife: FortuneResult | null;
    lateLife: FortuneResult | null;
    wealth: FortuneResult | null;
    career: FortuneResult | null;
  }>({
    personality: null,
    earlyLife: null,
    midLife: null,
    lateLife: null,
    wealth: null,
    career: null,
  });
  const [extraInfo, setExtraInfo] = useState<any>(null);
  const [loveFortune, setLoveFortune] = useState<{ title: string; content: string } | null>(null);
  const [healthFortune, setHealthFortune] = useState<{ title: string; content: string } | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "2000-01-01",
      birthTime: "12:00",
      calendarType: "solar",
      isMarried: "no",
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.reset({
          ...form.getValues(),
          ...parsed,
        });
      } catch (e) {
        console.error("Failed to parse saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: FormValues) => {
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
      fortune_type: "평생사주",
      gender: data.gender,
      birth_date: birthDateStr,
      birth_year: birthDateObj.getFullYear(),
      birth_month: String(birthDateObj.getMonth() + 1).padStart(2, '0'),
      birth_day: String(birthDateObj.getDate()).padStart(2, '0'),
      calendar_type: data.calendarType,
      is_married: data.isMarried,
    });
    localStorage.setItem("muun_user_data", JSON.stringify(data));
    // convertToSolarDate는 문자열 형식의 날짜를 받아야 함 (YYYY-MM-DD)
    const birthDateStrForConverter = `${birthDateObj.getFullYear()}-${String(birthDateObj.getMonth() + 1).padStart(2, '0')}-${String(birthDateObj.getDate()).padStart(2, '0')}`;
    const date = convertToSolarDate(birthDateStrForConverter, data.birthTime, data.calendarType);
    const sajuResult = calculateSaju(date, data.gender);
    setResult(sajuResult);
    window.scrollTo(0, 0);

    const allFortunes = generateLifelongFortune(sajuResult);
    const details = generateFortuneDetails(sajuResult);
    setExtraInfo(details);
    
    const love = generateLoveFortune(sajuResult, data.gender, data.isMarried);
    setLoveFortune(love);
    
    const health = generateHealthFortune(sajuResult);
    setHealthFortune(health);
    
    const fortuneKeys = ['personality', 'earlyLife', 'midLife', 'lateLife', 'wealth', 'career'] as const;
    
    for (let i = 0; i < fortuneKeys.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setFortunes(prev => ({
        ...prev,
        [fortuneKeys[i]]: allFortunes[fortuneKeys[i]]
      }));
    }
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  const ELEMENT_TEXT_COLOR: Record<string, string> = {
    '木': 'text-green-400', '火': 'text-red-400', '土': 'text-yellow-400', '金': 'text-slate-200', '水': 'text-blue-400',
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-base md:text-lg font-bold text-white">평생사주 풀이</h1>
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-xl">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span className="text-[10px] md:text-sm md:text-xs font-bold tracking-wider text-purple-400 uppercase">인생의 흐름을 읽는 지혜</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">평생사주</h2>
              <p className="text-muted-foreground text-xs md:text-base md:text-sm">
                태어난 기운을 바탕으로 당신의 성격, 재물, 직업, 그리고 평생의 운을 분석합니다
              </p>
            </div>

            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-400" />
                  </div>
                  사주 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400" />
                        이름
                      </Label>
                      <Input
                        id="name"
                        placeholder="이름을 입력해주세요"
                        {...form.register("name")}
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-purple-500/50 focus:border-purple-500 transition-all text-base md:text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
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
                        <ToggleGroupItem value="male" className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem value="female" className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        생년월일
                      </Label>
                      <DatePickerInput
                        id="birthDate"
                        {...form.register("birthDate")}
                        accentColor="purple"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="birthTime" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        태어난 시간
                      </Label>
                      <Input
                        id="birthTime"
                        type="time"
                        {...form.register("birthTime")}
                        className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-purple-500/50 focus:border-purple-500 transition-all text-base md:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <ScrollText className="w-3.5 h-3.5 text-purple-400" />
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
                        className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                      >
                        <ToggleGroupItem value="solar" className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                          양력
                        </ToggleGroupItem>
                        <ToggleGroupItem value="lunar" className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                          음력
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-purple-400" />
                        결혼 여부
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("isMarried")}
                        onValueChange={(value) => {
                          if (value) {
                            form.setValue("isMarried", value as "yes" | "no");
                          }
                        }}
                        className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                      >
                        <ToggleGroupItem value="no" className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                          미혼
                        </ToggleGroupItem>
                        <ToggleGroupItem value="yes" className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                          기혼
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold text-sm md:text-base rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    평생사주 보기
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-4 gap-2 md:gap-3">
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto">
                    <User className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-[10px] md:text-sm md:text-xs font-medium text-white">타고난 성격</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center mx-auto">
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                  <p className="text-[10px] md:text-sm md:text-xs font-medium text-white">재물운</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-[10px] md:text-sm md:text-xs font-medium text-white">직업운</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-pink-500/10 flex items-center justify-center mx-auto">
                    <Heart className="w-4 h-4 text-pink-400" />
                  </div>
                  <p className="text-[10px] md:text-sm md:text-xs font-medium text-white">연애운</p>
                </CardContent>
              </Card>
            </div>

            <SajuInfoContent />
          </motion.div>
        </main>
      </div>
    );
  }

  // ===== 결과 화면 =====
  const dayElement = STEM_ELEMENTS[result.dayPillar.stem];
  const dayStem = result.dayPillar.stem;
  const stemPersonality = STEM_PERSONALITY[dayStem];
  const elementBalance = calculateElementBalance(result);
  const balanceAnalysis = analyzeElementBalance(elementBalance);
  const userName = form.getValues('name');

  return (
    <>
      <Helmet>
        <title>{userName}님의 평생사주 - 무운</title>
        <meta name="description" content={`${userName}님의 사주팔자를 분석한 평생사주 풀이입니다. 타고난 기질, 인생 운세, 연애운, 결혼운, 재물운 등을 확인하세요.`} />
        <meta property="og:title" content={`${userName}님의 평생사주 - 무운`} />
        <meta property="og:description" content={`${userName}님의 사주팔자를 분석한 평생사주 풀이입니다.`} />
        <meta name="keywords" content="평생사주, 사주풀이, 사주팔자, 운세, 무운" />
      </Helmet>
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setResult(null)} className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base md:text-lg font-bold text-white">평생사주 풀이 결과</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-purple-400 min-w-[44px] min-h-[44px]"
            onClick={() => {
              shareContent({
                title: '무운 평생사주',
                text: `${userName}님의 평생사주 결과를 확인해보세요!`,
                page: 'lifelong_saju',
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
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <ScrollText className="w-4 h-4 text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-white">{userName}님의 사주팔자</h2>
            </div>
            <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <SajuChart result={result} theme="purple" />
              </CardContent>
            </Card>
          </section>

          {/* 1-1. 사주팔자 설명 가이드 */}
          <SajuGuide userName={userName} theme="purple" />

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-pink-500/5 border border-pink-500/10 rounded-xl p-3">
                      <p className="text-sm md:text-xs font-bold text-pink-400 mb-1">연애 스타일</p>
                      <p className="text-sm md:text-xs text-white/70 leading-relaxed">{stemPersonality.loveStyle}</p>
                    </div>
                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                      <p className="text-sm md:text-xs font-bold text-blue-400 mb-1">직업 스타일</p>
                      <p className="text-sm md:text-xs text-white/70 leading-relaxed">{stemPersonality.workStyle}</p>
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

          {/* 5~10. 운세 섹션들 */}
          <AnimatePresence>
            {/* 초년운 */}
            {fortunes.earlyLife && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Baby className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">{fortunes.earlyLife.title}</h2>
                </div>
                <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="text-base md:text-sm text-white/80 leading-relaxed whitespace-pre-line">{autoLinkKeywordsToJSX(fortunes.earlyLife.content)}</div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* 중년운 */}
            {fortunes.midLife && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">{fortunes.midLife.title}</h2>
                </div>
                <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="text-base md:text-sm text-white/80 leading-relaxed whitespace-pre-line">{autoLinkKeywordsToJSX(fortunes.midLife.content)}</div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* 말년운 */}
            {fortunes.lateLife && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Sunset className="w-4 h-4 text-amber-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">{fortunes.lateLife.title}</h2>
                </div>
                <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="text-base md:text-sm text-white/80 leading-relaxed whitespace-pre-line">{autoLinkKeywordsToJSX(fortunes.lateLife.content)}</div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* 재물운 */}
            {fortunes.wealth && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">{fortunes.wealth.title}</h2>
                </div>
                <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="text-base md:text-sm text-white/80 leading-relaxed whitespace-pre-line">{autoLinkKeywordsToJSX(fortunes.wealth.content)}</div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* 직업운 */}
            {fortunes.career && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">{fortunes.career.title}</h2>
                </div>
                <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="text-base md:text-sm text-white/80 leading-relaxed whitespace-pre-line">{autoLinkKeywordsToJSX(fortunes.career.content)}</div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* 연애/결혼운 */}
            {loveFortune && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-pink-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">{loveFortune.title}</h2>
                </div>
                <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="text-base md:text-sm text-white/80 leading-relaxed whitespace-pre-line">{autoLinkKeywordsToJSX(loveFortune.content)}</div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* 건강운 */}
            {healthFortune && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">{healthFortune.title}</h2>
                </div>
                <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="text-base md:text-sm text-white/80 leading-relaxed whitespace-pre-line">{autoLinkKeywordsToJSX(healthFortune.content)}</div>
                  </CardContent>
                </Card>
              </motion.section>
            )}
          </AnimatePresence>

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
                      
                      console.log('=== DEBUG: 일주 렌더링 (LifelongSaju) ===');
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

          {/* 하단 버튼 */}
          <div className="space-y-2 pt-2">
            {result && (
              <FortuneShareCard result={result} userName={userName} type="lifelong" />
            )}
            <Button 
              className="w-full h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-medium rounded-xl text-base md:text-sm"
              onClick={() => {
                shareContent({
                  title: '무운 평생사주',
                  text: `${userName}님의 평생사주 결과를 확인해보세요!`,
                  page: 'lifelong_saju',
                  buttonType: 'text_button',
                });
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              친구에게 공유하기
            </Button>
            <Button 
              variant="ghost"
              className="w-full h-12 text-white/60 hover:text-white hover:bg-white/5 font-medium rounded-xl text-base md:text-sm"
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
