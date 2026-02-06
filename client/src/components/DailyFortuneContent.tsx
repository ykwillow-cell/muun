
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const DailyFortuneContent = () => {
  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">오늘의 운세, 하루를 시작하는 지혜</CardTitle>
        </CardHeader>
        <CardContent className="text-lg text-foreground/80 space-y-8 p-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">오늘의 운세란 무엇인가?</h2>
            <p>
              오늘의 운세는 태어난 생년월일을 기반으로 그날의 기운(에너지)을 분석하여 하루 동안의 길흉화복을 예측하는 운세 풀이입니다. 매일 아침, 그날의 컨디션, 행운의 방향, 주의해야 할 점 등을 미리 확인하여 하루를 더 계획적이고 지혜롭게 보낼 수 있도록 돕는 생활 밀착형 운세입니다.
            </p>
            <p className="mt-4">
              단순히 '좋다' 또는 '나쁘다'를 넘어, 어떤 기운이 강하게 작용하는지, 어떤 활동에 유리하고 어떤 관계를 조심해야 하는지 등 구체적인 조언을 제공하는 것이 특징입니다. 무운의 오늘의 운세는 명리학적 데이터를 기반으로 매일의 운세를 정밀하게 분석하여 제공합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">오늘의 운세로 알 수 있는 것들</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">오늘의 총운</h3>
                  <p className="text-foreground/70">하루의 전반적인 흐름과 길흉을 요약하여 알려드립니다.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">재물운</h3>
                  <p className="text-foreground/70">금전 거래, 투자, 소비 등 재물과 관련된 활동의 유불리를 분석합니다.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">애정운</h3>
                  <p className="text-foreground/70">연인, 부부, 또는 새로운 만남 등 애정 관계의 흐름을 예측합니다.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">직장운</h3>
                  <p className="text-foreground/70">업무 성과, 대인관계, 이직 등 직장 생활과 관련된 조언을 제공합니다.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">오늘의 운세 200% 활용법</h2>
            <p>
              오늘의 운세는 미래를 단정 짓는 예언이 아니라, 하루를 슬기롭게 살아갈 수 있도록 돕는 '인생 내비게이션'과 같습니다. 운세가 좋다면 자신감을 갖고 적극적으로 활동하고, 좋지 않다면 평소보다 신중하게 행동하며 스스로를 돌아보는 기회로 삼는 것이 현명합니다. 매일 아침 무운의 오늘의 운세와 함께 희망찬 하루를 시작해 보세요.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyFortuneContent;
