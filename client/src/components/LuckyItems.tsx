import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Coffee, Star, MapPin, CheckCircle2, AlertCircle, Hash } from "lucide-react";
import { SajuResult, STEM_ELEMENTS, BRANCH_ELEMENTS } from "@/lib/saju";

interface LuckyItemsProps {
  result: SajuResult;
  extraInfo?: any;
}

// 오행별 행운 데이터 매핑
const ELEMENT_LUCKY_DATA: Record<string, {
  colors: string[];
  numbers: number[];
  foods: string[];
  directions: string[];
  activities: string[];
  avoid: string[];
}> = {
  '木': {
    colors: ['초록색', '청색'],
    numbers: [3, 8],
    foods: ['신맛 나는 과일', '채소', '곡물'],
    directions: ['동쪽'],
    activities: ['산책', '독서', '새로운 계획 세우기'],
    avoid: ['지나친 음주', '충동적인 결정']
  },
  '火': {
    colors: ['빨간색', '주황색'],
    numbers: [2, 7],
    foods: ['쓴맛 나는 채소', '커피', '구운 요리'],
    directions: ['남쪽'],
    activities: ['운동', '사교 모임', '발표'],
    avoid: ['조급함', '다툼']
  },
  '土': {
    colors: ['노란색', '브라운'],
    numbers: [5, 0],
    foods: ['단맛 나는 단호박', '고구마', '뿌리 채소'],
    directions: ['중앙'],
    activities: ['명상', '부동산 관련 공부', '정리정돈'],
    avoid: ['게으름', '고집']
  },
  '金': {
    colors: ['흰색', '금색', '은색'],
    numbers: [4, 9],
    foods: ['매운맛 나는 음식', '무', '생강'],
    directions: ['서쪽'],
    activities: ['정리', '결단 내리기', '금속 공예'],
    avoid: ['냉소적인 태도', '슬픔']
  },
  '水': {
    colors: ['검정색', '파란색'],
    numbers: [1, 6],
    foods: ['짠맛 나는 음식', '해산물', '국물'],
    directions: ['북쪽'],
    activities: ['수영', '여행 계획', '사색'],
    avoid: ['우유부단', '과식']
  }
};

function getStrongestElement(result: SajuResult): string {
  const elements: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  
  const pillars = [result.yearPillar, result.monthPillar, result.dayPillar, result.hourPillar];
  pillars.forEach(pillar => {
    if (pillar?.stemElement) elements[pillar.stemElement]++;
    if (pillar?.branchElement) elements[pillar.branchElement]++;
  });
  
  let strongest = '木';
  let maxCount = 0;
  Object.entries(elements).forEach(([element, count]) => {
    if (count > maxCount) {
      maxCount = count;
      strongest = element;
    }
  });
  
  return strongest;
}

export default function LuckyItems({ result }: LuckyItemsProps) {
  const strongestElement = getStrongestElement(result);
  const lucky = ELEMENT_LUCKY_DATA[strongestElement] || ELEMENT_LUCKY_DATA['木'];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-white/10">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Palette className="w-8 h-8 text-pink-400" />
            <p className="text-xs text-muted-foreground">행운의 컬러</p>
            <p className="font-bold text-white">{lucky.colors.join(', ')}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-white/10">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Hash className="w-8 h-8 text-yellow-400" />
            <p className="text-xs text-muted-foreground">행운의 숫자</p>
            <p className="font-bold text-white">{lucky.numbers.join(', ')}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-white/10">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Coffee className="w-8 h-8 text-orange-400" />
            <p className="text-xs text-muted-foreground">추천 음식</p>
            <p className="font-bold text-white">{lucky.foods[0]}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-white/10">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <MapPin className="w-8 h-8 text-blue-400" />
            <p className="text-xs text-muted-foreground">행운의 방향</p>
            <p className="font-bold text-white">{lucky.directions[0]}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-white/10 overflow-hidden">
          <CardHeader className="bg-green-500/5 border-b border-white/5 py-3">
            <CardTitle className="text-sm font-bold text-green-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 추천 활동
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {lucky.activities.map((act, i) => (
                <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                  <span className="w-1 h-1 bg-green-400 rounded-full" /> {act}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-card border-white/10 overflow-hidden">
          <CardHeader className="bg-red-500/5 border-b border-white/5 py-3">
            <CardTitle className="text-sm font-bold text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> 주의해야 할 행동
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {lucky.avoid.map((act, i) => (
                <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-400 rounded-full" /> {act}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
