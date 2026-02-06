
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const TarotContent = () => {
  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">AI 타로, 인공지능이 전하는 카드의 지혜</CardTitle>
        </CardHeader>
        <CardContent className="text-lg text-foreground/80 space-y-8 p-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">타로란 무엇인가?</h2>
            <p>
              타로(Tarot)는 78장의 카드로 구성된 점술 도구로, 각 카드에 담긴 상징과 이미지를 통해 질문자의 현재 상황, 잠재된 가능성, 그리고 미래의 방향성에 대한 통찰을 제공합니다. 수백 년의 역사를 가진 타로는 단순한 점술을 넘어 자기 성찰과 심리 탐구의 도구로도 널리 활용되고 있습니다.
            </p>
            <p className="mt-4">
              무운의 AI 타로는 전통적인 타로 해석학을 학습한 인공지능이 당신의 고민에 맞춤형 카드를 뽑아 해석해 드립니다. 언제 어디서든 마음속 질문에 대한 답을 구할 수 있으며, 객관적이고 따뜻한 시선으로 당신의 상황을 바라봐 드립니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">무운 AI 타로의 특징</h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">전문적인 타로 해석 AI</h3>
                  <p className="text-foreground/70">방대한 타로 해석 데이터를 학습한 AI가 각 카드의 상징과 위치, 질문의 맥락을 고려하여 깊이 있는 해석을 제공합니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">맞춤형 질문 상담</h3>
                  <p className="text-foreground/70">연애, 직업, 재물, 관계 등 어떤 고민이든 자유롭게 질문하면 AI가 해당 주제에 맞는 스프레드와 해석을 제안합니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">24시간 언제든 가능</h3>
                  <p className="text-foreground/70">시간과 장소에 구애받지 않고, 마음이 복잡할 때 언제든 AI 타로 상담을 받아볼 수 있습니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">기록 저장 기능</h3>
                  <p className="text-foreground/70">과거의 타로 상담 기록을 저장하고 다시 확인할 수 있어, 시간이 지난 후 결과를 되돌아보며 통찰을 얻을 수 있습니다.</p>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">타로를 대하는 현명한 자세</h2>
            <p>
              타로 카드는 정해진 미래를 알려주는 예언이 아니라, 현재 상황에서 고려해야 할 점과 가능성을 보여주는 '거울'과 같습니다. 카드의 메시지를 통해 자신의 내면을 들여다보고, 더 나은 선택을 위한 영감을 얻는 것이 타로를 활용하는 가장 지혜로운 방법입니다. 무운 AI 타로와 함께 마음속 물음에 대한 답을 찾아보세요.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default TarotContent;
