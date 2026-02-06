import { BookOpen, Star, Sparkles, TrendingUp, Calendar, Zap, Target } from "lucide-react";

export default function YearlyFortuneContent() {
  return (
    <article className="prose prose-invert max-w-none">
      {/* 신년운세란? */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white m-0">신년운세란 무엇인가?</h2>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
          <p className="text-white/80 leading-relaxed mb-4">
            <strong className="text-primary">신년운세(新年運勢)</strong>는 새해를 맞이하여 한 해 동안의 운의 흐름을 미리 살펴보는 
            전통적인 운세 풀이입니다. 사주명리학에서는 매년 바뀌는 '세운(歲運)'이 개인의 타고난 사주와 어떻게 
            상호작용하는지를 분석하여, 그 해에 특별히 주의해야 할 점과 기회가 오는 시기를 예측합니다.
          </p>
          <p className="text-white/80 leading-relaxed mb-4">
            2026년은 <strong className="text-primary">병오년(丙午年)</strong>으로, 천간 '병(丙)'은 태양의 불을 상징하고 
            지지 '오(午)'는 말(馬)을 의미합니다. 병오년은 밝고 활기찬 에너지가 넘치는 해로, 
            새로운 시작과 도전에 유리한 기운이 흐릅니다. 특히 화(火)의 기운이 강한 해이므로, 
            열정과 추진력이 중요한 한 해가 될 것입니다.
          </p>
          <p className="text-white/80 leading-relaxed">
            무운의 신년운세는 당신의 사주팔자와 2026년 병오년의 기운이 어떻게 조화를 이루는지 분석하여, 
            총운, 재물운, 직업운, 건강운, 연애운 등 다양한 영역에서의 운세를 상세하게 알려드립니다.
          </p>
        </div>
      </section>

      {/* 2026년 병오년의 특징 */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white m-0">2026년 병오년의 특징</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-white m-0">화(火)의 기운이 강한 해</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed m-0">
              병오년은 천간과 지지 모두 화(火)의 기운을 가지고 있어 열정, 활력, 추진력이 강조되는 해입니다. 
              새로운 프로젝트를 시작하거나 도전적인 목표를 세우기에 좋은 시기입니다.
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white m-0">변화와 성장의 에너지</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed m-0">
              말(午)의 해답게 빠른 변화와 역동적인 움직임이 예상됩니다. 
              정체되어 있던 일들이 빠르게 진행되고, 새로운 기회가 찾아올 수 있습니다.
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white m-0">목표 달성에 유리</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed m-0">
              병화(丙火)는 태양처럼 밝고 따뜻한 에너지를 상징합니다. 
              명확한 목표를 세우고 꾸준히 노력한다면 좋은 결실을 맺을 수 있는 해입니다.
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white m-0">주의할 점</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed m-0">
              화기(火氣)가 과하면 성급함이나 충동적인 결정으로 이어질 수 있습니다. 
              중요한 결정은 신중하게, 감정 조절에 유의하는 것이 좋습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 신년운세로 알 수 있는 것들 */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white m-0">신년운세로 알 수 있는 것들</h2>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
          <ul className="space-y-4 m-0 p-0 list-none">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">1</span>
              <div>
                <strong className="text-white">2026년 총운</strong>
                <p className="text-white/70 text-sm mt-1 m-0">
                  한 해 전체의 운의 흐름과 기조를 파악합니다. 어떤 마음가짐으로 한 해를 보내면 좋을지, 
                  전반적인 방향성을 제시합니다.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">2</span>
              <div>
                <strong className="text-white">월별 운세 흐름</strong>
                <p className="text-white/70 text-sm mt-1 m-0">
                  12개월 각각의 운세 변화를 분석하여 특별히 좋은 달과 주의해야 할 달을 알려드립니다. 
                  중요한 일정을 계획할 때 참고할 수 있습니다.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">3</span>
              <div>
                <strong className="text-white">재물운과 투자 시기</strong>
                <p className="text-white/70 text-sm mt-1 m-0">
                  2026년 재물운의 흐름과 금전적으로 유리한 시기, 주의해야 할 시기를 분석합니다. 
                  큰 지출이나 투자 결정에 참고할 수 있습니다.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">4</span>
              <div>
                <strong className="text-white">직업운과 커리어 조언</strong>
                <p className="text-white/70 text-sm mt-1 m-0">
                  이직, 승진, 사업 등 직업과 관련된 운세를 분석합니다. 
                  커리어에서 도약할 수 있는 시기와 방법을 제안합니다.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">5</span>
              <div>
                <strong className="text-white">건강운과 주의사항</strong>
                <p className="text-white/70 text-sm mt-1 m-0">
                  2026년 건강 측면에서 특별히 주의해야 할 부분과 건강을 유지하기 위한 조언을 제공합니다.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* 신년운세 활용법 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white m-0">신년운세 현명하게 활용하는 법</h2>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-blue-900/10 rounded-2xl p-6 md:p-8 border border-primary/20">
          <p className="text-white/80 leading-relaxed mb-4">
            신년운세는 미래를 확정짓는 예언이 아닌, <strong className="text-primary">한 해를 현명하게 설계하기 위한 참고 자료</strong>입니다. 
            운세에서 좋다고 하는 시기에는 적극적으로 기회를 잡고, 주의가 필요한 시기에는 
            더욱 신중하게 행동하는 지혜가 필요합니다.
          </p>
          <p className="text-white/80 leading-relaxed mb-4">
            무운(MuUn)은 "정해진 운명은 없다"는 철학을 바탕으로, 운세를 통해 자신을 더 깊이 이해하고 
            더 나은 선택을 할 수 있도록 돕고자 합니다. 타고난 기운을 이해하되 그에 얽매이지 않고, 
            스스로의 선택으로 운을 만들어가는 주체적인 삶을 응원합니다.
          </p>
          <p className="text-white/80 leading-relaxed">
            2026년 병오년, 밝은 태양의 기운과 함께 당신의 한 해가 빛나기를 바랍니다. 
            지금 바로 무료 신년운세를 확인하고, 새해를 위한 준비를 시작해 보세요.
          </p>
        </div>
      </section>
    </article>
  );
}
