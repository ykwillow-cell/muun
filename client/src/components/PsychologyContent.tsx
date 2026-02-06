
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

const PsychologyContent = () => {
  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">심리테스트, 나를 찾아 떠나는 여행</CardTitle>
        </CardHeader>
        <CardContent className="text-lg text-foreground/80 space-y-8 p-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">심리테스트란 무엇인가?</h2>
            <p>
              심리테스트는 개인의 성격, 가치관, 무의식적인 동기 등을 파악하기 위해 고안된 일련의 질문이나 과제입니다. 복잡하고 어려운 학문적 검사와는 달리, 일상적인 상황에 대한 선택이나 그림 해석 등을 통해 쉽고 재미있게 자신의 내면을 탐색할 수 있도록 돕는 도구입니다.
            </p>
            <p className="mt-4">
              무운의 심리테스트는 전문적인 심리학 이론을 바탕으로 하되, 누구나 즐겁게 참여할 수 있도록 구성되었습니다. MBTI나 애니어그램처럼 정형화된 틀을 넘어, 다양한 주제와 상황을 통해 자신도 몰랐던 새로운 모습을 발견하는 즐거움을 선사합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">무운 심리테스트의 특징</h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <BrainCircuit className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">다양하고 흥미로운 주제</h3>
                  <p className="text-foreground/70">연애 스타일, 직업 적성, 스트레스 대처 방식 등 다양한 주제의 테스트를 통해 자신을 다각도로 이해할 수 있습니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <BrainCircuit className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">직관적이고 재미있는 방식</h3>
                  <p className="text-foreground/70">간단한 그림 선택, 상황별 행동 선택 등 누구나 쉽고 재미있게 참여할 수 있는 방식으로 구성되어 있습니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <BrainCircuit className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">따뜻하고 통찰력 있는 결과</h3>
                  <p className="text-foreground/70">단순히 유형을 나누는 것을 넘어, 자신의 장점을 발견하고 삶에 긍정적인 변화를 가져올 수 있도록 돕는 따뜻한 조언을 제공합니다.</p>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">심리테스트, 가볍게 즐기는 자기 성찰</h2>
            <p>
              심리테스트의 결과는 과학적인 진단이 아닌, 자신을 돌아보고 이해하기 위한 참고 자료입니다. 결과에 너무 얽매이기보다는, 테스트 과정을 통해 자신의 생각과 감정을 들여다보는 시간을 갖는 것 자체에 의미가 있습니다. 친구나 연인과 함께 테스트를 즐기며 서로에 대해 더 깊이 이해하는 계기로 삼아보는 것은 어떨까요? 무운과 함께 즐거운 자기 탐색의 시간을 가져보세요.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default PsychologyContent;
