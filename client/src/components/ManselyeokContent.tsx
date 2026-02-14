
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const ManselyeokContent = () => {
  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">만세력, 사주명리학의 핵심</CardTitle>
        </CardHeader>
        <CardContent className="text-lg text-foreground/80 space-y-8 p-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">만세력이란 무엇인가?</h2>
            <p>
              만세력(萬歲曆)은 사주명리학에서 개인의 사주팔자(四柱八字)를 뽑기 위해 사용하는 책력(冊曆)입니다. 태어난 연, 월, 일, 시를 입력하면 해당 시점의 천간(天干)과 지지(地支)를 찾아내어 여덟 글자로 이루어진 사주 원국을 구성하는 데 사용됩니다. 과거에는 전문가들이 두꺼운 책자를 일일이 찾아보며 사주를 뽑았지만, 현대에는 컴퓨터 프로그램을 통해 누구나 쉽고 정확하게 자신의 사주팔자를 확인할 수 있습니다.
            </p>
            <p className="mt-4">
              무운의 만세력 서비스는 한국천문연구원의 데이터를 기반으로 가장 정확한 절입일시를 적용하여 오차 없는 사주 정보를 제공합니다. 또한, 단순히 한자로 된 사주팔자만 보여주는 것을 넘어 대운, 세운, 월운 등 운의 흐름과 신살(神煞) 정보까지 한눈에 파악할 수 있도록 구성되어 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">만세력으로 알 수 있는 정보</h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">사주팔자 원국</h3>
                  <p className="text-foreground/70">타고난 천간과 지지의 여덟 글자로, 개인의 본질적인 기질과 운명의 밑그림을 나타냅니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">오행의 분포</h3>
                  <p className="text-foreground/70">사주를 구성하는 목(木), 화(火), 토(土), 금(金), 수(水) 오행의 개수와 비율을 통해 기운의 균형 상태를 파악합니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">대운의 흐름</h3>
                  <p className="text-foreground/70">10년 주기로 바뀌는 인생의 큰 운의 흐름을 보여주어, 인생의 전반적인 계획을 세우는 데 도움을 줍니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">세운/월운/일운</h3>
                  <p className="text-foreground/70">매년, 매월, 매일의 운세를 확인하여 단기적인 계획과 처세에 활용할 수 있습니다.</p>
                </div>
              </li>
               <li className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">합/형/충/파/해 및 신살</h3>
                  <p className="text-foreground/70">지지(地支) 사이의 복잡한 관계와 다양한 신살 정보를 통해 더욱 깊이 있는 사주 분석이 가능합니다.</p>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">만세력, 어떻게 활용해야 할까?</h2>
            <p>
              만세력은 사주명리학 공부의 첫걸음이자 가장 중요한 기초 자료입니다. 무운의 만세력을 통해 자신의 사주팔자를 확인하고, 각 글자가 가진 의미와 오행의 관계를 하나씩 탐구해 보세요. 자신의 운명을 이해하는 과정을 통해 인생을 더욱 주체적으로 설계하고 어려움을 지혜롭게 헤쳐나갈 힘을 얻을 수 있을 것입니다.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManselyeokContent;
