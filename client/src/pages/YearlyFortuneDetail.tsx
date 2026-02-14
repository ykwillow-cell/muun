import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Star, Sparkles, Zap, Briefcase, Activity, Heart, Quote, ScrollText, TrendingUp, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";
import { autoLinkKeywordsToJSX } from "@/lib/auto-link-keywords";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateSaju, SajuResult, generateFortuneDetails, STEM_ELEMENTS, BRANCH_ELEMENTS } from "@/lib/saju";
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
import { YearlyFortuneSchema } from "@/components/YearlyFortuneSchema";
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
  };

  const themes = monthlyThemes[dayElement] || monthlyThemes['木'];
  
  for (let i = 0; i < 12; i++) {
    const colors = ['from-red-500', 'from-orange-500', 'from-yellow-500', 'from-green-500', 'from-blue-500', 'from-indigo-500'];
    months.push({
      month: i + 1,
      title: `${i + 1}월`,
      content: themes.themes[i],
      score: themes.scores[i],
      color: colors[i % colors.length],
    });
  }
  
  return months;
}

export default function YearlyFortuneDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const birthDateStr = params.birthDate; // "1990-01-15"
  
  const [result, setResult] = useState<SajuResult | null>(null);
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [extraInfo, setExtraInfo] = useState<any>(null);
  const [monthlyFortune, setMonthlyFortune] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // 생년월일 파싱
      if (!birthDateStr) {
        setError('생년월일이 없습니다.');
        setLoading(false);
        return;
      }
      let dateStr = birthDateStr;
      if (typeof dateStr !== 'string') {
        if (dateStr instanceof Date) {
          dateStr = dateStr.toISOString().split('T')[0];
        } else {
          dateStr = String(dateStr);
        }
      }
      const [year, month, day] = dateStr.split('-').map(Number);
      
      // 유효성 검사
      if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
        setError('유효하지 않은 생년월일입니다.');
        setLoading(false);
        return;
      }
      
      // convertToSolarDate를 사용하여 음력->양력 변환
      // YearlyFortune.tsx와 동일한 로직 적용
      const date = convertToSolarDate(dateStr, '12:00', 'solar', false);
      
      // 사주 계산 (성별 미지정 - 기본값 'male')
      const sajuResult = calculateSaju(date, 'male');
      setResult(sajuResult);
      
      // 운세 생성
      const fortune = generateYearlyFortune(sajuResult);
      setFortune(fortune);
      
      // 추가 정보
      const details = generateFortuneDetails(sajuResult);
      setExtraInfo(details);
      
      // 월별 운세
      const monthly = generateMonthlyFortune(sajuResult);
      setMonthlyFortune(monthly);
      
      // GA4 추적
      trackCustomEvent("view_fortune_detail", {
        fortune_type: "신년운세",
        birth_date: birthDateStr,
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error calculating saju:', err);
      setError('사주 계산 중 오류가 발생했습니다.');
      setLoading(false);
    }
  }, [birthDateStr]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p>운세를 계산 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error || !result || !fortune) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        <div className="container mx-auto px-4 py-8">
          <Link href="/yearly-fortune">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          </Link>
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error || '오류가 발생했습니다.'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const zodiacSign = BRANCH_READINGS[result.dayPillar.branch]?.korean || '미상';
  const zodiacAnimal = BRANCH_READINGS[result.dayPillar.branch]?.animal || '미상';
  const dayElement = STEM_ELEMENTS[result.dayPillar.stem];
  const elementKorean = ELEMENT_KOREAN[dayElement] || dayElement;

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
      <Helmet>
        <title>{birthDateStr}생 2026년 신년운세 - 무운</title>
        <meta name="description" content={`${birthDateStr}생 ${zodiacAnimal}띠 2026년 신년운세. 총운, 재물운, 직업운, 애정운 상세 분석`} />
        <link rel="canonical" href={`https://muunsaju.com/yearly-fortune/${birthDateStr}`} />
      </Helmet>
      {result && fortune && <YearlyFortuneSchema birthDate={birthDateStr!} saju={result} fortune={fortune} />}

      <div className="container mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <Link href="/yearly-fortune">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        </Link>

        {/* 제목 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {birthDateStr}생 2026년 신년운세
          </h1>
          <p className="text-lg text-muted-foreground">
            {zodiacAnimal}띠 · {elementKorean}의 기운
          </p>
        </motion.div>

        {/* 공유 카드 */}
        <FortuneShareCard 
          title={`${birthDateStr}생 2026년 신년운세`}
          description={`${zodiacAnimal}띠 ${birthDateStr}생의 2026년 신년운세를 확인해보세요.`}
          url={`https://muunsaju.com/yearly-fortune/${birthDateStr}`}
        />

        {/* 사주 차트 */}
        {result && <SajuChart saju={result} />}

        {/* 운세 내용 */}
        {fortune && <YearlyFortuneContent fortune={fortune} />}

        {/* 월별 운세 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📅 2026년 월별 운세
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthlyFortune.map((month) => (
                <motion.div
                  key={month.month}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: month.month * 0.05 }}
                >
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{month.title}</CardTitle>
                        <div className="text-2xl font-bold text-primary">{month.score}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{month.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 길한 물건 */}
        {extraInfo && <LuckyItems saju={result} />}

        {/* 사주 용어 설명 */}
        <SajuGlossary />

        {/* 가이드 */}
        <SajuGuide />
      </div>
    </div>
  );
}
