
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, Star } from "lucide-react";

const AstrologyContent = () => {
  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">서양 점성술, 별들이 속삭이는 운명의 비밀</CardTitle>
        </CardHeader>
        <CardContent className="text-lg text-foreground/80 space-y-8 p-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">서양 점성술이란 무엇인가?</h2>
            <p>
              서양 점성술(Western Astrology)은 개인이 태어난 순간의 하늘의 별과 행성의 배치를 통해 그 사람의 성격, 잠재력, 그리고 인생의 전반적인 흐름을 해석하는 고대의 학문입니다. 하늘을 12개의 구역으로 나눈 황도 12궁(Zodiac)과 태양, 달, 그리고 여러 행성들의 위치와 상호 각도를 분석하여 개인의 출생 차트(Natal Chart)를 작성하고, 이를 바탕으로 운명을 예측합니다.
            </p>
            <p className="mt-4">
              점성술은 단순한 별자리 운세(Sun-sign astrology)를 넘어, 개인의 고유한 출생 정보를 바탕으로 한 매우 정밀하고 복잡한 상징 체계입니다. 무운의 점성술 서비스는 전문적인 점성술 차트 계산법을 사용하여 당신의 숨겨진 잠재력과 인생의 중요한 시기를 발견할 수 있도록 돕습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">출생 차트로 알 수 있는 것들</h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Sun className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">태양(Sun) 별자리: 나의 본질과 정체성</h3>
                  <p className="text-foreground/70">가장 기본적인 자아, 의식, 그리고 삶의 목적을 나타냅니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Moon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">달(Moon) 별자리: 나의 내면과 감정</h3>
                  <p className="text-foreground/70">무의식, 감정적인 반응, 그리고 내면의 안정감을 상징합니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Star className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">상승궁(Ascendant): 사회적 가면과 첫인상</h3>
                  <p className="text-foreground/70">다른 사람들에게 비치는 나의 모습과 사회생활에서의 페르소나를 의미합니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Star className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">행성들의 배치와 하우스</h3>
                  <p className="text-foreground/70">각 행성(수성, 금성, 화성 등)이 위치한 하우스(재물, 직업, 연애 등)를 통해 삶의 다양한 영역에서의 특징을 분석합니다.</p>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">점성술, 자기 이해의 도구</h2>
            <p>
              점성술은 정해진 운명을 맹목적으로 따르라고 말하지 않습니다. 오히려 자신의 출생 차트를 통해 타고난 강점과 약점, 기회와 위기를 이해하고, 이를 바탕으로 인생을 더욱 주체적으로 만들어나갈 수 있도록 돕는 강력한 자기 이해의 도구입니다. 별들의 지도를 통해 자신만의 길을 찾아가는 여정에 무운이 함께하겠습니다.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default AstrologyContent;
