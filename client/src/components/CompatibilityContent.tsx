/**
 * CompatibilityContent.tsx
 *
 * [개선 2026-03-23]
 * ① 에디토리얼 접힘 처리: 기본 2~3줄 노출 + "더 보기" 토글 (SEO DOM 유지)
 * ② 헤딩 컬러 변경: text-primary(보라) → text-foreground(일반 텍스트)
 * ③ 관련 서비스 계층화: 1 Featured(평생사주) + 3 Small 구조 — 별도 컴포넌트로 분리
 *    → CompatibilityRelatedServices 는 입력 폼 아래(결과 영역 후)에서 사용
 */
import { useState } from "react";
import { Heart, Star, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useLocation } from "wouter";

// ─── 관련 서비스 데이터 ───────────────────────────────────────────────────────
const FEATURED_SERVICE = {
  path: "/lifelong-saju",
  title: "무료 평생사주 풀이",
  desc: "상대의 타고난 기질을 사주팔자로 더 깊이 이해해보세요",
  badge: "가장 많이 찾는 서비스",
  emoji: "🔮",
};

const SMALL_SERVICES = [
  { path: "/yearly-fortune", title: "2026년 신년운세", desc: "두 사람의 올해 운세를 비교해보세요.", emoji: "📅" },
  { path: "/manselyeok", title: "만세력", desc: "두 사람의 사주팔자 원국을 정확하게 확인합니다.", emoji: "📖" },
  { path: "/tarot", title: "AI 타로 상담", desc: "연애와 관계에 대한 고민을 타로 카드로 풀어보세요.", emoji: "🃏" },
];

// ─── 에디토리얼 컴포넌트 (입력 폼 위) ────────────────────────────────────────
const CompatibilityContent = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full">
      <div className="bg-white/80 backdrop-blur-sm border border-border/50 shadow-xl overflow-hidden rounded-2xl">
        {/* 항상 노출되는 첫 단락 */}
        <div className="p-6 pb-0">
          <h2 className="text-2xl font-bold text-center text-foreground mb-6">궁합, 인연의 깊이를 더하는 지혜</h2>
          <section className="mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-3">궁합이란 무엇인가?</h3>
            <p className="text-base text-foreground/80 leading-relaxed">
              궁합(宮合)은 두 사람의 사주(四柱)를 비교 분석하여 서로의 관계에서 나타나는 조화와 상호작용을 알아보는 전통적인 관계 분석법입니다. 단순히 '잘 맞는다', '안 맞는다'를 넘어, 두 사람이 함께할 때 어떤 시너지를 내고 어떤 점을 주의해야 하는지 구체적으로 파악하는 데 목적이 있습니다.
            </p>
          </section>
        </div>

        {/* 접힘 영역 — SEO를 위해 DOM에 유지, max-height로 처리 */}
        <div
          style={{
            maxHeight: expanded ? "2000px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.4s ease",
          }}
        >
          <div className="px-6 pb-6 space-y-6">
            <p className="text-base text-foreground/80 leading-relaxed">
              결혼을 앞둔 연인뿐만 아니라 친구, 동업자, 가족 등 모든 인간관계에 적용할 수 있으며, 서로의 다름을 이해하고 관계를 더욱 긍정적으로 발전시키는 데 도움을 줍니다. 무운의 궁합 서비스는 각자의 사주에 담긴 오행의 상생상극 원리를 바탕으로 정밀한 관계 분석을 제공합니다.
            </p>

            <section>
              <h3 className="text-xl font-semibold text-foreground mb-3">궁합으로 알 수 있는 것들</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-[#E8387A] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">타고난 성격의 조화</h4>
                    <p className="text-foreground/70 text-sm mt-0.5">서로의 기본적인 성격과 기질이 얼마나 잘 어울리는지, 어떤 부분에서 갈등이 발생할 수 있는지 분석합니다.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-[#E8387A] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">속궁합 (오행의 조화)</h4>
                    <p className="text-foreground/70 text-sm mt-0.5">두 사람의 사주에 담긴 오행의 기운이 서로에게 긍정적인 영향을 주는지, 혹은 부족한 부분을 채워주는 관계인지 분석합니다.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-[#E8387A] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">결혼 생활 예측</h4>
                    <p className="text-foreground/70 text-sm mt-0.5">함께 가정을 꾸렸을 때 예상되는 모습, 재물 관리 스타일, 자녀운 등 현실적인 결혼 생활을 예측합니다.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-[#E8387A] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">관계 개선을 위한 조언</h4>
                    <p className="text-foreground/70 text-sm mt-0.5">갈등을 피하고 관계를 더욱 돈독하게 만들기 위한 구체적이고 현실적인 조언을 제공합니다.</p>
                  </div>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-foreground mb-3">궁합을 대하는 현명한 자세</h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                궁합은 인연의 모든 것을 결정하는 절대적인 지표가 아닙니다. 서로의 장점과 단점을 미리 이해하고, 부족한 부분은 노력으로 채워나가기 위한 '관계 설명서'로 활용하는 것이 바람직합니다. 궁합이 좋지 않게 나왔더라도 실망하기보다는, 어떤 점을 서로 조심하고 배려해야 하는지 깨닫는 계기로 삼는 것이 중요합니다. 무운과 함께 두 분의 인연을 더욱 아름답게 가꾸어 나가세요.
              </p>
            </section>
          </div>
        </div>

        {/* 더 보기 / 접기 토글 버튼 */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-foreground/60 hover:text-foreground/80 border-t border-border/30 transition-colors"
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              접기
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              더 보기
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── 관련 서비스 컴포넌트 (입력 폼 아래, CTA 이후) ──────────────────────────
export const CompatibilityRelatedServices = () => {
  const [, navigate] = useLocation();

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-foreground mb-4">궁합과 함께 보면 좋은 서비스</h3>

      {/* Featured 카드 (평생사주) */}
      <button
        onClick={() => navigate(FEATURED_SERVICE.path)}
        className="w-full mb-3 p-5 bg-gradient-to-br from-pink-500/[0.08] to-pink-500/[0.03] border border-pink-500/25 rounded-2xl hover:border-pink-500/50 hover:shadow-md transition-all group text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{FEATURED_SERVICE.emoji}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-500/15 rounded-full text-[10px] font-bold text-pink-600 uppercase tracking-wide">
                <Star className="w-2.5 h-2.5 fill-pink-600" />
                {FEATURED_SERVICE.badge}
              </span>
            </div>
            <h4 className="text-base font-bold text-foreground group-hover:text-pink-600 transition-colors mb-1">
              {FEATURED_SERVICE.title}
            </h4>
            <p className="text-sm text-foreground/60 leading-relaxed">{FEATURED_SERVICE.desc}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-foreground/30 group-hover:text-pink-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
        </div>
      </button>

      {/* Small 카드 3개 */}
      <div className="grid grid-cols-3 gap-2">
        {SMALL_SERVICES.map((service) => (
          <button
            key={service.path}
            onClick={() => navigate(service.path)}
            className="p-3 bg-white/80 border border-border/50 rounded-2xl hover:border-pink-500/30 hover:bg-pink-500/[0.05] transition-all group shadow-sm text-left"
          >
            <span className="text-xl mb-1.5 block">{service.emoji}</span>
            <h4 className="font-bold text-foreground group-hover:text-pink-600 transition-colors text-sm leading-tight">{service.title}</h4>
            <p className="text-xs text-foreground/60 mt-0.5 leading-snug">{service.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompatibilityContent;
