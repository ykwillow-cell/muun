const HybridCompatibilityContent = () => {
  return (
    <div className="w-full max-w-[700px] mx-auto px-4" style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* ── 오행 유형별 MBTI 성향 ── */}
      <section style={{ marginTop: '32px', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '19px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
          오행 유형별 MBTI 성향
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px', lineHeight: 1.7 }}>
          사주팔자의 오행(목·화·토·금·수)은 각각 고유한 기질과 에너지를 가집니다. 연구에 따르면 오행의 기질과 MBTI 성격 유형 사이에는 유의미한 연관성이 있으며, 이를 바탕으로 더 정밀한 궁합 분석이 가능합니다.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* 목 */}
          <div style={{ background: '#f0f7f2', border: '1px solid #b8ddc8', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <span style={{ fontSize: '20px' }}>🌿</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#2d6a4f' }}>목 (木)</span>
              <span style={{ fontSize: '11px', color: '#2d6a4f', background: 'rgba(255,255,255,0.7)', border: '1px solid #b8ddc8', borderRadius: '20px', padding: '2px 9px' }}>성장·창의·공감</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {['ENFP', 'INFP', 'ENFJ', 'INFJ'].map((t) => (
                  <span key={t} style={{ fontSize: '11px', fontWeight: 600, color: '#2d6a4f', background: 'rgba(255,255,255,0.8)', border: '1px solid #b8ddc8', borderRadius: '5px', padding: '2px 6px' }}>{t}</span>
                ))}
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.75, margin: 0 }}>
              목 기운은 위로 뻗어 자라는 나무처럼 창의성과 성장 지향성이 강합니다. MBTI의 NF형(직관+감정)과 높은 연관성을 보이며, 공감 능력이 뛰어나고 새로운 가능성을 추구합니다. 관계에서는 깊은 유대와 진정성을 중시하며, 상대의 감정을 섬세하게 읽어냅니다.
            </p>
          </div>

          {/* 화 */}
          <div style={{ background: '#fdf3f2', border: '1px solid #f5b7b1', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <span style={{ fontSize: '20px' }}>🔥</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#922b21' }}>화 (火)</span>
              <span style={{ fontSize: '11px', color: '#922b21', background: 'rgba(255,255,255,0.7)', border: '1px solid #f5b7b1', borderRadius: '20px', padding: '2px 9px' }}>열정·표현·사교</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {['ESFJ', 'ESFP', 'ENTJ', 'ENFJ'].map((t) => (
                  <span key={t} style={{ fontSize: '11px', fontWeight: 600, color: '#922b21', background: 'rgba(255,255,255,0.8)', border: '1px solid #f5b7b1', borderRadius: '5px', padding: '2px 6px' }}>{t}</span>
                ))}
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.75, margin: 0 }}>
              화 기운은 불꽃처럼 활활 타오르는 열정과 표현력이 특징입니다. 사교적이고 외향적인 성향이 강해 MBTI의 E형, 특히 SF형·NJ형과 연결됩니다. 관계에서는 적극적으로 감정을 표현하고 상대를 이끄는 역할을 맡는 경우가 많습니다.
            </p>
          </div>

          {/* 토 */}
          <div style={{ background: '#fefdf0', border: '1px solid #f7dc6f', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <span style={{ fontSize: '20px' }}>🏔️</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#7d6608' }}>토 (土)</span>
              <span style={{ fontSize: '11px', color: '#7d6608', background: 'rgba(255,255,255,0.7)', border: '1px solid #f7dc6f', borderRadius: '20px', padding: '2px 9px' }}>안정·신뢰·현실</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {['ISTJ', 'ESTJ', 'ISFJ', 'ESFJ'].map((t) => (
                  <span key={t} style={{ fontSize: '11px', fontWeight: 600, color: '#7d6608', background: 'rgba(255,255,255,0.8)', border: '1px solid #f7dc6f', borderRadius: '5px', padding: '2px 6px' }}>{t}</span>
                ))}
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.75, margin: 0 }}>
              토 기운은 대지처럼 묵직하고 안정적입니다. 책임감과 신뢰를 최우선으로 여기며, MBTI의 SJ형(감각+판단)과 가장 높은 연관성을 보입니다. 관계에서는 믿음직한 버팀목 역할을 하며, 장기적이고 안정적인 관계를 선호합니다.
            </p>
          </div>

          {/* 금 */}
          <div style={{ background: '#f4f6f7', border: '1px solid #aab7b8', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <span style={{ fontSize: '20px' }}>⚔️</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#4a5568' }}>금 (金)</span>
              <span style={{ fontSize: '11px', color: '#4a5568', background: 'rgba(255,255,255,0.7)', border: '1px solid #aab7b8', borderRadius: '20px', padding: '2px 9px' }}>논리·원칙·독립</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {['INTJ', 'ENTJ', 'INTP', 'ISTP'].map((t) => (
                  <span key={t} style={{ fontSize: '11px', fontWeight: 600, color: '#4a5568', background: 'rgba(255,255,255,0.8)', border: '1px solid #aab7b8', borderRadius: '5px', padding: '2px 6px' }}>{t}</span>
                ))}
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.75, margin: 0 }}>
              금 기운은 날카로운 금속처럼 논리적이고 원칙 중심적입니다. 감정보다 이성을 우선시하며 MBTI의 NT형(직관+사고)·ST형과 연관됩니다. 관계에서는 독립성을 중시하고, 감정 표현보다 실질적인 행동으로 애정을 표현하는 경향이 있습니다.
            </p>
          </div>

          {/* 수 */}
          <div style={{ background: '#eaf4fb', border: '1px solid #aed6f1', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <span style={{ fontSize: '20px' }}>💧</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#1a5276' }}>수 (水)</span>
              <span style={{ fontSize: '11px', color: '#1a5276', background: 'rgba(255,255,255,0.7)', border: '1px solid #aed6f1', borderRadius: '20px', padding: '2px 9px' }}>직관·유연·탐구</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {['INTP', 'ENTP', 'INFJ', 'INFP'].map((t) => (
                  <span key={t} style={{ fontSize: '11px', fontWeight: 600, color: '#1a5276', background: 'rgba(255,255,255,0.8)', border: '1px solid #aed6f1', borderRadius: '5px', padding: '2px 6px' }}>{t}</span>
                ))}
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.75, margin: 0 }}>
              수 기운은 물처럼 유연하게 흐르며 깊은 통찰력을 지닙니다. 직관과 탐구심이 강하며 MBTI의 N형(직관), 특히 NP형과 연관성이 높습니다. 관계에서는 상대를 깊이 이해하려 하지만, 감정 표현이 간접적이어서 오해가 생기기도 합니다.
            </p>
          </div>

        </div>

        <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '14px', lineHeight: 1.6 }}>
          * 오행과 MBTI의 연관성은 확정적 기준이 아닌 통계적 경향성을 기반으로 합니다. 같은 오행이어도 사주 전체 구성에 따라 성향이 달라질 수 있습니다.
        </p>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-tertiary)', margin: '0 0 40px' }} />

      {/* ── 자주 묻는 질문 ── */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '19px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '20px' }}>
          자주 묻는 질문
        </h2>

        <div>
          {[
            {
              q: 'Q. MBTI가 같으면 사주 궁합도 좋은가요?',
              a: 'MBTI가 같아도 사주 오행이 상극(相剋) 관계라면 가치관은 비슷하지만 에너지 충돌이 생길 수 있습니다. 반대로 MBTI가 전혀 다른 유형이어도 오행이 상생(相生) 관계라면 서로를 자연스럽게 보완하는 이상적인 궁합이 되기도 합니다. 하이브리드 궁합이 두 가지를 모두 분석하는 이유가 여기에 있습니다.',
              first: true,
            },
            {
              q: 'Q. 오행이 상극이면 나쁜 궁합인가요?',
              a: '상극이 반드시 나쁜 궁합을 의미하지는 않습니다. 상극 관계는 서로 긴장감을 주어 성장을 자극하기도 합니다. 중요한 것은 두 사람이 서로의 차이를 얼마나 이해하고 조율하느냐입니다. 하이브리드 궁합 분석에서는 상극 관계의 두 사람을 위한 구체적인 갈등 처방전도 함께 제공합니다.',
            },
            {
              q: 'Q. 사주 궁합과 MBTI 궁합 중 어떤 게 더 정확한가요?',
              a: '두 방법은 서로 다른 차원을 측정합니다. 사주 궁합은 태어날 때부터 타고난 에너지의 조화를, MBTI 궁합은 현재의 성격 유형 간 상성을 봅니다. 어느 쪽이 더 정확하다기보다, 두 가지를 함께 보면 훨씬 입체적인 그림이 나옵니다. 무운의 하이브리드 궁합은 이 두 가지를 960가지 조합으로 통합 분석합니다.',
            },
            {
              q: 'Q. 연인 궁합 외에 친구·직장 동료 궁합도 볼 수 있나요?',
              a: '물론입니다. 하이브리드 궁합은 연인 관계뿐 아니라 친구, 가족, 직장 동료 등 모든 대인 관계에 적용할 수 있습니다. 소통 방식의 차이, 가치관 충돌 원인, 관계 발전 단계 등을 분석하기 때문에 어떤 관계에서도 유용한 인사이트를 얻을 수 있습니다.',
            },
            {
              q: 'Q. MBTI를 모르거나 유형이 바뀐 경우에는 어떻게 하나요?',
              a: 'MBTI는 시간이 지나면서 바뀌는 경우도 있습니다. 가장 최근에 검사한 결과를 입력하시면 됩니다. MBTI를 모른다면 무료 MBTI 검사를 먼저 받아보신 후 입력하시는 것을 권장합니다. 사주 분석은 생년월일만 있으면 바로 가능합니다.',
            },
          ].map((item, idx, arr) => (
            <div
              key={idx}
              style={{
                borderTop: item.first ? '1px solid var(--color-border-tertiary)' : undefined,
                borderBottom: '1px solid var(--color-border-tertiary)',
                padding: '22px 0',
              }}
            >
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 8px', lineHeight: 1.5 }}>
                {item.q}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.8 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HybridCompatibilityContent;
