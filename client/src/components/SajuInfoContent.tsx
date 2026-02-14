import { BookOpen, Star, Sparkles, TrendingUp, Heart, Briefcase, Zap } from "lucide-react";

export default function SajuInfoContent() {
  return (
    <article className="prose prose-invert max-w-none">
      {/* 평생사주란 무엇인가? */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white m-0">평생사주란 무엇인가?</h2>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
          <p className="text-white/80 leading-relaxed mb-4">
            <strong className="text-primary">평생사주(平生四柱)</strong>는 태어난 연(年), 월(月), 일(日), 시(時)의 네 기둥을 바탕으로 
            한 사람의 타고난 기질과 평생의 운명적 흐름을 분석하는 동양 철학의 정수입니다. 
            수천 년의 역사를 가진 사주명리학(四柱命理學)은 단순한 점술이 아닌, 
            음양오행(陰陽五行)의 원리에 기반한 체계적인 인생 분석 도구입니다.
          </p>
          <p className="text-white/80 leading-relaxed mb-4">
            사주팔자(四柱八字)라고도 불리는 이 체계는 네 개의 기둥(사주)에 각각 두 글자씩, 
            총 여덟 글자(팔자)로 구성됩니다. 이 여덟 글자는 천간(天干)과 지지(地支)의 조합으로 이루어지며, 
            각각의 글자가 가진 오행(木, 火, 土, 金, 水)의 기운이 서로 어떻게 상생(相生)하고 상극(相剋)하는지를 
            분석하여 개인의 성격, 재능, 적성, 그리고 인생의 흐름을 파악합니다.
          </p>
          <p className="text-white/80 leading-relaxed">
            무운(MuUn)의 평생사주 서비스는 30년 이상의 임상 경험을 가진 명리학 전문가의 해석 데이터를 기반으로, 
            현대인이 이해하기 쉬운 언어로 당신의 사주를 풀이해 드립니다. 
            복잡한 한자나 어려운 전문 용어 대신, 실생활에 적용할 수 있는 실질적인 조언을 제공합니다.
          </p>
        </div>
      </section>

      {/* 평생사주로 알 수 있는 것들 */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white m-0">평생사주로 알 수 있는 것들</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white m-0">타고난 성격과 기질</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed m-0">
              사주의 일간(日干)을 중심으로 당신이 타고난 본연의 성격, 기질, 그리고 대인관계 스타일을 분석합니다. 
              자신도 몰랐던 내면의 모습을 발견할 수 있습니다.
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white m-0">재물운과 금전 흐름</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed m-0">
              사주에 나타난 재성(財星)의 위치와 강약을 분석하여 재물을 모으는 능력, 
              돈을 다루는 성향, 그리고 재물운이 좋은 시기를 알려드립니다.
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white m-0">직업운과 적성</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed m-0">
              사주의 오행 구성과 격국(格局)을 통해 당신에게 맞는 직업 분야와 성공할 수 있는 업종, 
              그리고 커리어에서 주의해야 할 점을 안내합니다.
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-semibold text-white m-0">연애운과 결혼운</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed m-0">
              사주의 배우자궁과 도화살(桃花煞) 등을 분석하여 이성관계의 특징, 
              좋은 배우자의 조건, 결혼 적령기 등을 알려드립니다.
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white m-0">대운과 세운의 흐름</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed m-0">
              10년 단위로 바뀌는 대운(大運)과 매년 바뀌는 세운(歲運)을 분석하여 
              인생의 중요한 전환점과 기회가 오는 시기를 예측합니다.
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white m-0">건강운과 주의사항</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed m-0">
              사주의 오행 균형을 통해 선천적으로 약한 장기나 건강상 주의해야 할 부분, 
              그리고 건강을 유지하기 위한 생활 습관을 조언합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 무운 평생사주의 특징 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white m-0">무운 평생사주의 특징</h2>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-purple-900/10 rounded-2xl p-6 md:p-8 border border-primary/20">
          <ul className="space-y-4 m-0 p-0 list-none">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              <div>
                <strong className="text-white">30년 경력 전문가의 해석 데이터</strong>
                <p className="text-white/70 text-sm mt-1 m-0">
                  수만 건의 실제 상담 사례를 분석하여 도출된 고유의 해석 로직을 사용합니다.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              <div>
                <strong className="text-white">현대적이고 이해하기 쉬운 해석</strong>
                <p className="text-white/70 text-sm mt-1 m-0">
                  복잡한 한자나 어려운 전문 용어 대신, 누구나 이해할 수 있는 친절한 언어로 결과를 제공합니다.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              <div>
                <strong className="text-white">완전 무료, 회원가입 불필요</strong>
                <p className="text-white/70 text-sm mt-1 m-0">
                  어떠한 결제 유도나 회원가입 없이 모든 프리미엄 운세 풀이를 자유롭게 이용하실 수 있습니다.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              <div>
                <strong className="text-white">철저한 개인정보 보호</strong>
                <p className="text-white/70 text-sm mt-1 m-0">
                  입력하신 정보는 서버에 저장되지 않으며, 브라우저 내에서만 안전하게 처리됩니다.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
}
