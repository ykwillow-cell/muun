
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, Star, Zap, Heart, Briefcase } from "lucide-react";
import RelatedServices from "@/components/RelatedServices";

const AstrologyContent = () => {
  return (
    <>
    <div className="w-full max-w-4xl mx-auto my-12 px-4 space-y-6">
      <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">
            네이탈 차트(탄생 차트) 기반 무료 점성술 풀이
          </CardTitle>
        </CardHeader>
        <CardContent className="text-lg text-foreground/80 space-y-8 p-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">네이탈 차트(Natal Chart)란 무엇인가?</h2>
            <p>
              네이탈 차트(Natal Chart, 탄생 차트·출생 차트)는 내가 태어난 순간 하늘의 행성들이 어느 별자리에 위치했는지를 기록한 천문 지도입니다. 서양 점성술(Western Astrology)에서는 이 지도를 바탕으로 개인의 성격, 재능, 연애 스타일, 직업 적성, 인생 흐름을 분석합니다. 무운의 점성술 서비스는 회원가입·개인정보 저장 없이 생년월일과 출생 도시만 입력하면 즉시 네이탈 차트를 계산하고 한국어로 풀이해 드립니다.
            </p>
            <p className="mt-4">
              단순한 별자리 운세(태양 별자리만 보는 방식)를 넘어, 달 별자리(Moon Sign), 상승궁(Ascendant), 수성·금성·화성·목성·토성의 위치까지 종합적으로 분석하는 것이 진정한 네이탈 차트 풀이입니다. 무운은 실제 천문학 계산 라이브러리를 사용하여 정확한 행성 위치를 산출합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">별자리별 성격 - 태양 별자리(Sun Sign) 완전 가이드</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-foreground mb-2">♈ 양자리 (3/21~4/19)</h3>
                <p className="text-foreground/70 text-sm">개척 정신과 리더십이 강하며, 새로운 도전을 두려워하지 않는 불의 별자리입니다. 직설적이고 열정적인 성격으로 주변에 활력을 불어넣습니다.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-foreground mb-2">♉ 황소자리 (4/20~5/20)</h3>
                <p className="text-foreground/70 text-sm">안정과 감각적 풍요를 추구하는 흙의 별자리입니다. 인내심이 강하고 신뢰할 수 있으며, 물질적 안정과 아름다움을 중시합니다.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-foreground mb-2">♊ 쌍둥이자리 (5/21~6/21)</h3>
                <p className="text-foreground/70 text-sm">지적 호기심과 소통 능력이 뛰어난 공기의 별자리입니다. 다재다능하고 적응력이 강하며, 다양한 분야에 관심을 가집니다.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-foreground mb-2">♋ 게자리 (6/22~7/22)</h3>
                <p className="text-foreground/70 text-sm">감수성과 보호 본능이 강한 물의 별자리입니다. 가족과 가정을 소중히 여기며, 직관력이 뛰어나고 감정이 풍부합니다.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-foreground mb-2">♌ 사자자리 (7/23~8/22)</h3>
                <p className="text-foreground/70 text-sm">카리스마와 창의성이 넘치는 불의 별자리입니다. 리더십이 강하고 자신감 있으며, 주목받는 것을 즐기고 관대한 성품을 지닙니다.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-foreground mb-2">♍ 처녀자리 (8/23~9/22)</h3>
                <p className="text-foreground/70 text-sm">분석력과 완벽주의적 성향의 흙의 별자리입니다. 세심하고 실용적이며, 봉사 정신이 강하고 건강과 일상의 질서를 중시합니다.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-foreground mb-2">♎ 천칭자리 (9/23~10/22)</h3>
                <p className="text-foreground/70 text-sm">균형과 미적 감각이 뛰어난 공기의 별자리입니다. 공정함을 추구하고 협력적이며, 아름다움과 조화로운 관계를 중시합니다.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-foreground mb-2">♏ 전갈자리 (10/23~11/21)</h3>
                <p className="text-foreground/70 text-sm">깊은 직관과 변혁의 힘을 가진 물의 별자리입니다. 강렬하고 신비로우며, 진실을 꿰뚫어 보는 통찰력과 집중력이 탁월합니다.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-foreground mb-2">♐ 사수자리 (11/22~12/21)</h3>
                <p className="text-foreground/70 text-sm">자유와 철학적 탐구를 사랑하는 불의 별자리입니다. 낙관적이고 모험적이며, 넓은 세계관과 지식에 대한 열정을 지닙니다.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-foreground mb-2">♑ 염소자리 (12/22~1/19)</h3>
                <p className="text-foreground/70 text-sm">책임감과 성취 지향적인 흙의 별자리입니다. 인내심이 강하고 야망이 있으며, 장기적인 목표를 향해 꾸준히 나아가는 성품입니다.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-foreground mb-2">♒ 물병자리 (1/20~2/18)</h3>
                <p className="text-foreground/70 text-sm">혁신과 인도주의적 가치를 추구하는 공기의 별자리입니다. 독창적이고 미래 지향적이며, 사회 변화와 공동체에 관심이 많습니다.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-foreground mb-2">♓ 물고기자리 (2/19~3/20)</h3>
                <p className="text-foreground/70 text-sm">공감 능력과 영적 감수성이 뛰어난 물의 별자리입니다. 직관적이고 예술적이며, 타인의 감정을 깊이 이해하는 따뜻한 성품을 지닙니다.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">달 별자리(Moon Sign)와 상승궁(Ascendant)의 중요성</h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Moon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">달 별자리(Moon Sign) - 나의 내면과 감정</h3>
                  <p className="text-foreground/70">달은 약 2.5일마다 별자리를 이동하므로 정확한 출생 시간이 있어야 정밀하게 계산됩니다. 달 별자리는 무의식적 감정 반응, 내면의 안정감, 편안함을 느끼는 환경을 상징합니다. 태양 별자리가 '겉모습'이라면 달 별자리는 '속마음'입니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Star className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">상승궁(Ascendant) - 사회적 페르소나와 첫인상</h3>
                  <p className="text-foreground/70">상승궁(어센던트)은 출생 시각과 장소에 따라 결정되는 동쪽 지평선의 별자리입니다. 타인에게 보이는 첫인상, 외모적 특징, 사회생활에서의 행동 방식을 나타냅니다. 태양·달·상승궁 세 가지를 함께 분석하면 훨씬 입체적인 자기 이해가 가능합니다.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Sun className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">태양 별자리(Sun Sign) - 나의 본질과 정체성</h3>
                  <p className="text-foreground/70">가장 기본적인 자아, 의식, 삶의 목적과 방향을 나타냅니다. 생년월일만으로 확인할 수 있으며, 점성술에서 가장 널리 알려진 요소입니다.</p>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">행성별 의미 - 수성·금성·화성·목성·토성</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">수성(Mercury) - 사고와 소통</h3>
                  <p className="text-foreground/70 text-sm">사고방식, 의사소통 스타일, 학습 능력, 언어 감각을 지배합니다. 수성이 위치한 별자리는 어떻게 생각하고 말하는지를 보여줍니다.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">금성(Venus) - 사랑과 미적 감각</h3>
                  <p className="text-foreground/70 text-sm">연애관, 미적 취향, 대인관계에서의 매력, 가치관을 나타냅니다. 금성의 위치는 어떤 사람에게 끌리고 어떻게 사랑하는지를 알려줍니다.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">화성(Mars) - 행동력과 열정</h3>
                  <p className="text-foreground/70 text-sm">행동력, 욕망, 경쟁심, 에너지 사용 방식을 보여줍니다. 화성의 위치는 어떤 분야에서 열정을 발휘하고 어떻게 목표를 추구하는지를 나타냅니다.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Briefcase className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">목성(Jupiter) - 행운과 성장</h3>
                  <p className="text-foreground/70 text-sm">행운, 성장, 확장의 영역과 풍요를 가져오는 분야를 알려줍니다. 목성이 위치한 별자리와 하우스는 인생에서 가장 큰 행운이 찾아오는 영역을 나타냅니다.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">토성(Saturn) - 책임과 성숙</h3>
                  <p className="text-foreground/70 text-sm">책임, 제약, 인내를 통해 성숙해지는 삶의 과제를 상징합니다. 토성이 위치한 별자리는 가장 어렵지만 가장 큰 성장을 이루는 영역을 보여줍니다.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">점성술과 사주의 차이 - 서양 점성술 vs 동양 명리학</h2>
            <p>
              서양 점성술(Western Astrology)은 태어난 순간 행성의 황도 좌표를 기반으로 성격과 운명을 분석하는 학문입니다. 반면 동양 명리학(사주팔자)은 연·월·일·시의 천간지지(天干地支) 조합으로 운명을 해석합니다. 두 체계 모두 출생 시각을 중시하며, 개인의 타고난 기질과 인생 흐름을 파악한다는 공통점이 있습니다.
            </p>
            <p className="mt-4">
              점성술은 행성의 물리적 위치와 별자리의 상징적 의미를 결합하여 개인의 심리와 잠재력을 탐구하는 데 강점이 있으며, 사주는 오행(五行)의 균형과 대운(大運)의 흐름을 통해 인생의 시기별 운의 변화를 파악하는 데 탁월합니다. 무운에서는 서양 점성술과 동양 사주풀이를 모두 무료로 제공하므로 두 관점을 비교해보실 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">점성술, 자기 이해의 강력한 도구</h2>
            <p>
              점성술은 정해진 운명을 맹목적으로 따르라고 말하지 않습니다. 오히려 자신의 네이탈 차트를 통해 타고난 강점과 약점, 기회와 위기를 이해하고, 이를 바탕으로 인생을 더욱 주체적으로 만들어나갈 수 있도록 돕는 강력한 자기 이해의 도구입니다. 별들의 지도를 통해 자신만의 길을 찾아가는 여정에 무운이 함께하겠습니다.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
    <RelatedServices
      title="점성술과 함께 보면 좋은 서비스"
      services={[
        {
          href: "/lifelong-saju",
          label: "무료 평생사주 풀이",
          description: "동양의 명리학으로 타고난 운명과 인생 흐름을 분석합니다.",
          emoji: "🔮",
        },
        {
          href: "/psychology",
          label: "심리테스트",
          description: "나를 더 잘 이해하는 심리 테스트로 자아를 탐구해보세요.",
          emoji: "🧠",
        },
        {
          href: "/tarot",
          label: "AI 타로 상담",
          description: "점성술로 얻은 통찰을 타로로 더 깊이 탐구해보세요.",
          emoji: "🃏",
        },
        {
          href: "/compatibility",
          label: "무료 궁합 보기",
          description: "두 사람의 사주팔자를 비교하여 오행 궁합을 분석합니다.",
          emoji: "💕",
        },
      ]}
    />
    </>
  );
};

export default AstrologyContent;
