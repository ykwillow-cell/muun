import { BookOpen, Star, Sparkles, Calendar, History, Scroll } from "lucide-react";

export default function TojeongContent() {
  return (
    <article className="prose prose-invert max-w-none">
      {/* 토정비결이란? */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Scroll className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white m-0">토정비결이란 무엇인가?</h2>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
          <p className="text-white/80 leading-relaxed mb-4">
            <strong className="text-primary">토정비결(土亭秘訣)</strong>은 조선 중기의 대학자이자 역술가인 
            <strong className="text-primary"> 토정 이지함(土亭 李之菡, 1517~1578)</strong> 선생이 저술한 것으로 전해지는 
            한국 고유의 운세서입니다. 500년 가까운 세월 동안 한국인들에게 가장 사랑받아 온 전통 운세 풀이로, 
            매년 새해가 되면 토정비결로 한 해의 운세를 점치는 것이 우리나라의 오랜 풍습으로 자리 잡았습니다.
          </p>
          <p className="text-white/80 leading-relaxed mb-4">
            토정비결은 태어난 해(年), 달(月), 날(日)의 세 가지 정보를 바탕으로 
            상괘(上卦), 중괘(中卦), 하괘(下卦)를 산출하고, 이 세 괘의 조합으로 
            144가지의 운세 중 하나를 도출합니다. 각 괘는 1년을 상반기, 중반기, 하반기로 나누어 
            그 시기의 운세를 상징적인 시(詩)와 해설로 알려줍니다.
          </p>
          <p className="text-white/80 leading-relaxed">
            토정비결의 특징은 단순히 길흉화복을 점치는 것이 아니라, 
            사자성어와 고사를 인용한 문학적인 표현으로 인생의 지혜를 전달한다는 점입니다. 
            운세 결과를 통해 한 해를 어떤 마음가짐으로 보내야 할지 깊이 생각해 볼 수 있습니다.
          </p>
        </div>
      </section>

      {/* 토정 이지함 선생 */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <History className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white m-0">토정 이지함 선생은 누구인가?</h2>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
          <p className="text-white/80 leading-relaxed mb-4">
            <strong className="text-primary">토정 이지함(土亭 李之菡)</strong> 선생은 조선 중기의 문신이자 학자, 
            역술가로 알려진 인물입니다. 본관은 한산(韓山), 자는 형백(馨伯), 호는 토정(土亭)입니다. 
            그는 성리학에 정통했을 뿐만 아니라 천문, 지리, 의학, 복서(卜筮) 등 다양한 분야에 해박했습니다.
          </p>
          <p className="text-white/80 leading-relaxed mb-4">
            '토정(土亭)'이라는 호는 그가 마포 강변에 흙으로 지은 작은 정자에서 살았다고 하여 붙여진 이름입니다. 
            이지함 선생은 벼슬에 연연하지 않고 청빈한 삶을 살면서도 백성들의 어려움을 돌보는 데 힘썼다고 전해집니다. 
            특히 가난한 백성들을 위해 무료로 운세를 봐주었다는 일화가 유명합니다.
          </p>
          <p className="text-white/80 leading-relaxed">
            토정비결이 실제로 이지함 선생이 직접 저술한 것인지에 대해서는 학계에서 논란이 있지만, 
            그의 이름을 빌어 전해 내려온 이 운세서가 수백 년간 한국인들의 삶에 깊이 뿌리내린 것은 분명한 사실입니다.
          </p>
        </div>
      </section>

      {/* 토정비결 보는 방법 */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white m-0">토정비결 보는 방법</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white m-0">상괘(上卦) 산출</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed m-0">
              태어난 해(年)의 나이 수를 기준으로 상괘를 계산합니다. 
              상괘는 한 해의 <strong className="text-primary">상반기(1~4월)</strong> 운세를 나타냅니다.
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white m-0">중괘(中卦) 산출</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed m-0">
              태어난 달(月)을 기준으로 중괘를 계산합니다. 
              중괘는 한 해의 <strong className="text-primary">중반기(5~8월)</strong> 운세를 나타냅니다.
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white m-0">하괘(下卦) 산출</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed m-0">
              태어난 날(日)을 기준으로 하괘를 계산합니다. 
              하괘는 한 해의 <strong className="text-primary">하반기(9~12월)</strong> 운세를 나타냅니다.
            </p>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mt-4">
          <p className="text-white/80 leading-relaxed m-0">
            이렇게 산출된 세 개의 괘를 조합하면 총 <strong className="text-primary">144가지</strong>의 운세 중 
            하나가 도출됩니다. 각 운세에는 한문으로 된 시(詩)와 그에 대한 해설이 담겨 있어, 
            한 해의 전반적인 흐름과 각 시기별 주의사항을 알 수 있습니다.
          </p>
        </div>
      </section>

      {/* 토정비결의 의미 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white m-0">토정비결을 현명하게 활용하는 법</h2>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-purple-900/10 rounded-2xl p-6 md:p-8 border border-primary/20">
          <p className="text-white/80 leading-relaxed mb-4">
            토정비결은 미래를 확정짓는 예언서가 아닙니다. 오히려 <strong className="text-primary">한 해를 지혜롭게 
            살아가기 위한 마음의 준비</strong>를 돕는 도구로 이해하는 것이 바람직합니다. 
            좋은 운세가 나왔다고 방심하거나, 나쁜 운세가 나왔다고 좌절할 필요가 없습니다.
          </p>
          <p className="text-white/80 leading-relaxed mb-4">
            토정비결의 결과는 "이런 점을 주의하라", "이런 기회를 잘 살려라"는 조언으로 받아들이면 됩니다. 
            어려운 시기가 예고되어 있다면 미리 마음의 준비를 하고, 좋은 시기가 예고되어 있다면 
            그 기회를 놓치지 않도록 준비하는 것이 현명한 활용법입니다.
          </p>
          <p className="text-white/80 leading-relaxed">
            무운(MuUn)의 토정비결 서비스는 전통적인 토정비결의 원리를 충실히 따르면서도, 
            현대인이 이해하기 쉬운 언어로 해석을 제공합니다. 
            지금 바로 2026년 병오년 토정비결을 확인하고, 한 해의 지혜로운 설계를 시작해 보세요.
          </p>
        </div>
      </section>
    </article>
  );
}
