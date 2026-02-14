
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const CompatibilityContent = () => {
  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">궁합, 인연의 깊이를 더하는 지혜</CardTitle>
        </CardHeader>
        <CardContent className="text-lg text-foreground/80 space-y-8 p-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">궁합이란 무엇인가?</h2>
            <p>
              궁합(宮合)은 두 사람의 사주(四柱)를 비교 분석하여 서로의 관계에서 나타나는 조화와 상호작용을 알아보는 전통적인 관계 분석법입니다. 단순히 '잘 맞는다', '안 맞는다'를 넘어, 두 사람이 함께할 때 어떤 시너지를 내고 어떤 점을 주의해야 하는지 구체적으로 파악하는 데 목적이 있습니다.
            </p>
            <p className="mt-4">
              결혼을 앞둔 연인뿐만 아니라 친구, 동업자, 가족 등 모든 인간관계에 적용할 수 있으며, 서로의 다름을 이해하고 관계를 더욱 긍정적으로 발전시키는 데 도움을 줍니다. 무운의 궁합 서비스는 각자의 사주에 담긴 오행의 상생상극 원리를 바탕으로 정밀한 관계 분석을 제공합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">궁합으로 알 수 있는 것들</h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">타고난 성격의 조화</h3>
                  <p className="text-foreground/70">서로의 기본적인 성격과 기질이 얼마나 잘 어울리는지, 어떤 부분에서 갈등이 발생할 수 있는지 분석합니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">속궁합 (오행의 조화)</h3>
                  <p className="text-foreground/70">두 사람의 사주에 담긴 오행의 기운이 서로에게 긍정적인 영향을 주는지, 혹은 부족한 부분을 채워주는 관계인지 분석합니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">결혼 생활 예측</h3>
                  <p className="text-foreground/70">함께 가정을 꾸렸을 때 예상되는 모습, 재물 관리 스타일, 자녀운 등 현실적인 결혼 생활을 예측합니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">관계 개선을 위한 조언</h3>
                  <p className="text-foreground/70">갈등을 피하고 관계를 더욱 돈독하게 만들기 위한 구체적이고 현실적인 조언을 제공합니다.</p>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">궁합을 대하는 현명한 자세</h2>
            <p>
              궁합은 인연의 모든 것을 결정하는 절대적인 지표가 아닙니다. 서로의 장점과 단점을 미리 이해하고, 부족한 부분은 노력으로 채워나가기 위한 '관계 설명서'로 활용하는 것이 바람직합니다. 궁합이 좋지 않게 나왔더라도 실망하기보다는, 어떤 점을 서로 조심하고 배려해야 하는지 깨닫는 계기로 삼는 것이 중요합니다. 무운과 함께 두 분의 인연을 더욱 아름답게 가꾸어 나가세요.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompatibilityContent;
