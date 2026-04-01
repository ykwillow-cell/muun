import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { MuSelect, SIJU_OPTIONS } from "./MuSelect";
import { trackCustomEvent } from "@/lib/ga4";

export function HeroFirstVisit({ onBirthSaved }: { onBirthSaved: () => void }) {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<1 | 2>(1);
  const [birthInput, setBirthInput] = useState("");
  const [calType, setCalType] = useState<"solar" | "lunar">("solar");
  const [siju, setSiju] = useState("unknown");
  const [inputError, setInputError] = useState("");

  const step1Valid = birthInput.replace(/\D/g, "").length >= 6;

  const handleStep1Next = () => {
    const digits = birthInput.replace(/\D/g, "");
    if (digits.length < 6) {
      setInputError("생년월일을 6자 이상 입력해 주세요.");
      return;
    }
    setInputError("");
    setStep(2);
    trackCustomEvent("hero_form_step2", {});
  };

  const handleSubmit = () => {
    const digits = birthInput.replace(/\D/g, "");
    const data = {
      birth: digits,
      calType,
      siju,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("muun_user_birth", JSON.stringify(data));
    trackCustomEvent("hero_form_submit", { calType, siju });
    onBirthSaved();
    navigate("/lifelong-saju");
  };

  return (
    <section className="mu-hero mu-hero--first">

      {/* ── 배경 장식 ── */}
      <div className="mu-hero__bg" aria-hidden="true">
        <div className="mu-hero__orb mu-hero__orb--1" />
        <div className="mu-hero__orb mu-hero__orb--2" />
        <div className="mu-hero__orb mu-hero__orb--3" />
        <div className="mu-hero__stars">
          {Array.from({ length: 28 }).map((_, i) => (
            <span key={i} className="mu-hero__star" style={{
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              animationDelay: `${(i * 0.31) % 3}s`,
              width: i % 3 === 0 ? '2px' : '1.5px',
              height: i % 3 === 0 ? '2px' : '1.5px',
              opacity: 0.3 + (i % 5) * 0.1,
            }} />
          ))}
        </div>
      </div>

      <div className="mu-hero__inner">

        {/* ── 메인 타이틀 ── */}
        <div className="mu-hero__header">
          <h1 className="mu-hero__title">
            생년월일로 보는<br />
            <span className="mu-hero__title-accent">나의 사주</span>
          </h1>
        </div>

        {/* ── 폼 카드 ── */}
        <div className="mu-hero__form-card">

          {/* 스텝 탭 */}
          <div className="mu-hero__steps" aria-label="입력 단계">
            <div className="mu-hero__step-tab-row">
              <div className={`mu-hero__step-tab${step === 1 ? " active" : ""}`}>
                <span className="mu-hero__step-num">1</span>
                생년월일
              </div>
              <div className="mu-hero__step-divider" aria-hidden="true" />
              <div className={`mu-hero__step-tab${step === 2 ? " active" : ""}`}>
                <span className="mu-hero__step-num">2</span>
                상세 정보
              </div>
            </div>
          </div>

          {step === 1 ? (
            <div className="mu-hero__step-body">
              <input
                id="birth-input"
                type="text"
                inputMode="numeric"
                className={`mu-hero__input${inputError ? " mu-hero__input--error" : ""}`}
                placeholder="예) 1993. 05. 21"
                value={birthInput}
                maxLength={10}
                onChange={(e) => {
                  setBirthInput(e.target.value);
                  if (inputError) setInputError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && step1Valid && handleStep1Next()}
                aria-describedby={inputError ? "birth-error" : undefined}
              />
              {inputError && (
                <p id="birth-error" className="mu-hero__input-error" role="alert">
                  {inputError}
                </p>
              )}
              <button
                type="button"
                className={`mu-hero__cta${step1Valid ? "" : " disabled"}`}
                onClick={handleStep1Next}
                disabled={!step1Valid}
                aria-disabled={!step1Valid}
              >
                다음 단계로
                <ArrowRight size={15} />
              </button>
              <p className="mu-hero__hint">
                <span className="mu-hero__hint-dot" aria-hidden="true" />
                양력·음력은 다음 단계에서 선택합니다
              </p>
            </div>
          ) : (
            <div className="mu-hero__step-body">
              {/* 양/음력 토글 */}
              <div className="mu-hero__cal-toggle" role="group" aria-label="양력/음력 선택">
                <button
                  type="button"
                  className={`mu-hero__cal-btn${calType === "solar" ? " mu-hero__cal-btn--active" : ""}`}
                  onClick={() => setCalType("solar")}
                  aria-pressed={calType === "solar"}
                >
                  양력
                </button>
                <button
                  type="button"
                  className={`mu-hero__cal-btn${calType === "lunar" ? " mu-hero__cal-btn--active" : ""}`}
                  onClick={() => setCalType("lunar")}
                  aria-pressed={calType === "lunar"}
                >
                  음력
                </button>
              </div>

              {/* 시간 셀렉터 */}
              <MuSelect
                id="siju-select"
                label="태어난 시간 (선택)"
                options={SIJU_OPTIONS}
                value={siju}
                onChange={setSiju}
                placeholder="시간을 선택하세요"
                dark={true}
              />

              <div className="mu-hero__step2-actions">
                <button
                  type="button"
                  className="mu-hero__back-btn"
                  onClick={() => setStep(1)}
                >
                  이전
                </button>
                <button
                  type="button"
                  className="mu-hero__cta mu-hero__cta--submit"
                  onClick={handleSubmit}
                >
                  사주 확인하기
                  <ArrowRight size={15} />
                </button>
              </div>
              <p className="mu-hero__hint">
                <span className="mu-hero__hint-dot" aria-hidden="true" />
                시간을 모르면 건너뛰어도 됩니다
              </p>
            </div>
          )}
        </div>

        {/* ── 신뢰 배지 ── */}
        <div className="mu-hero__trust" aria-label="서비스 특징">
          <span className="mu-hero__trust-dot" aria-hidden="true" />
          <span className="mu-hero__trust-text">100% 무료</span>
          <span className="mu-hero__trust-sep" aria-hidden="true">·</span>
          <span className="mu-hero__trust-dot" aria-hidden="true" />
          <span className="mu-hero__trust-text">회원가입 없음</span>
          <span className="mu-hero__trust-sep" aria-hidden="true">·</span>
          <span className="mu-hero__trust-dot" aria-hidden="true" />
          <span className="mu-hero__trust-text">개인정보 저장 안함</span>
        </div>

      </div>

      <style>{`
        /* ── Hero 섹션 래퍼 (라이트 모드) ── */
        .mu-hero--first {
          position: relative;
          background: linear-gradient(158deg, #1a1260 0%, #3929a0 35%, #5040b8 58%, #4355b4 80%, #3358a8 100%);
          padding: 0 var(--md-sp-4) var(--md-sp-10);
          padding-top: 64px;
          overflow: hidden;
        }

        /* ── 배경 장식 ── */
        .mu-hero__bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .mu-hero__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
        }
        .mu-hero__orb--1 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(255,255,255,0.30) 0%, transparent 70%);
          top: -80px; right: -60px;
        }
        .mu-hero__orb--2 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(255,255,255,0.20) 0%, transparent 70%);
          bottom: -40px; left: -40px;
        }
        .mu-hero__orb--3 {
          width: 140px; height: 140px;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
          top: 50%; left: 30%;
          transform: translateY(-50%);
        }
        .mu-hero__stars {
          position: absolute;
          inset: 0;
        }
        .mu-hero__star {
          position: absolute;
          border-radius: 50%;
          background: #ffffff;
          animation: star-twinkle 3s ease-in-out infinite;
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: var(--base-opacity, 0.4); transform: scale(1); }
          50% { opacity: 0.1; transform: scale(0.6); }
        }

        /* ── 내부 콘텐츠 ── */
        .mu-hero__inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: var(--md-sp-5); /* 20px — MD3 4dp 배수 */
        }

        /* ── 상단 레이블 (MD3 Assist Chip 스타일) ── */
        .mu-hero__eyebrow-wrap {
          display: inline-flex;
          align-items: center;
          gap: var(--md-sp-1); /* 4px */
          background: rgba(255,255,255,0.20);
          border: 1px solid rgba(255,255,255,0.40);
          border-radius: var(--md-shape-sm); /* 8px — MD3 Chip shape */
          padding: var(--md-sp-1) var(--md-sp-3); /* 4px 12px */
          min-height: 32px; /* MD3 Chip 기본 높이 32dp */
          width: fit-content;
        }
        .mu-hero__eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #ffffff;
          animation: live-pulse 1.8s ease-in-out infinite;
          flex-shrink: 0;
        }
        .mu-hero__eyebrow-text {
          font-size: var(--md-label-small);      /* 11px — MD3 Label Small */
          line-height: var(--md-label-small-lh);
          letter-spacing: var(--md-label-small-ls);
          font-weight: 600;
          color: rgba(255,255,255,0.95);
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── 메인 타이틀 ── */
        .mu-hero__header {
          display: flex;
          flex-direction: column;
          gap: var(--md-sp-2); /* 8px */
        }
        .mu-hero__title {
          font-size: var(--md-headline-large);      /* 32px — MD3 Headline Large */
          line-height: var(--md-headline-large-lh); /* 40px */
          letter-spacing: var(--md-headline-large-ls);
          font-weight: 900;
          color: #ffffff;
          margin: 0;
          text-shadow: 0 2px 8px rgba(0,0,0,0.15);
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-hero__title-accent {
          background: linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.85) 50%, #e8e4ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .mu-hero__sub {
          font-size: var(--md-body-medium);      /* 14px — MD3 Body Medium */
          line-height: var(--md-body-medium-lh); /* 20px */
          letter-spacing: var(--md-body-medium-ls);
          font-weight: 500;
          color: rgba(255,255,255,0.90);
          margin: 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── 폼 카드 (글래스모피즘 + MD3 Extra Large shape) ── */
        .mu-hero__form-card {
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: none;
          border-radius: var(--md-shape-xl); /* 28px — MD3 Extra Large */
          padding: var(--md-sp-4); /* 16px */
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: var(--md-elev-3); /* MD3 Elevation 3 */
        }

        /* ── 스텝 탭 (MD3 Navigation Bar 스타일) ── */
        .mu-hero__steps {
          padding: 0;
          margin-bottom: var(--md-sp-3); /* 12px */
        }
        .mu-hero__step-tab-row {
          display: flex;
          background: rgba(0,0,0,0.12);
          border-radius: var(--md-shape-md); /* 12px — MD3 Medium */
          padding: var(--md-sp-1); /* 4px */
          gap: var(--md-sp-1); /* 4px */
          overflow: hidden;
          margin: 0;
        }
        .mu-hero__step-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--md-sp-1); /* 4px */
          padding: var(--md-sp-2) 0; /* 8px 0 */
          min-height: 40px; /* MD3 탭 최소 높이 */
          font-size: var(--md-label-large);      /* 14px — MD3 Label Large */
          line-height: var(--md-label-large-lh);
          letter-spacing: var(--md-label-large-ls);
          font-weight: 600;
          color: rgba(255,255,255,0.70);
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          transition: all 0.2s;
          border-radius: var(--md-shape-sm); /* 8px */
          border: none;
          box-shadow: none;
          background: transparent;
          text-align: center;
        }
        .mu-hero__step-tab.active {
          color: #191F28;
          font-weight: 700;
          background: #FFFFFF;
          border-radius: 9px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .mu-hero__step-num {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--md-label-small); /* 11px */
          font-weight: 700;
          color: rgba(255,255,255,0.80);
        }
        .mu-hero__step-tab.active .mu-hero__step-num {
          background: #7B61FF;
          color: #ffffff;
        }
        .mu-hero__step-divider {
          width: 1px;
          background: rgba(255,255,255,0.08);
          flex-shrink: 0;
        }

        /* ── 입력 영역 ── */
        .mu-hero__step-body {
          display: flex;
          flex-direction: column;
          gap: var(--md-sp-3); /* 12px — MD3 4dp 배수 */
          padding: var(--md-sp-3) 0 0; /* 12px 0 0 */
        }
        /* MD3 Filled Text Field */
        .mu-hero__input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,0.25);
          border: none;
          border-bottom: 1.5px solid rgba(255,255,255,0.60);
          border-radius: var(--md-shape-sm) var(--md-shape-sm) 0 0; /* 8px 8px 0 0 — MD3 Filled TextField */
          padding: var(--md-sp-4); /* 16px */
          height: 56px; /* MD3 Text Field 표준 높이 56dp */
          font-size: var(--md-body-large);      /* 16px — MD3 Body Large */
          line-height: var(--md-body-large-lh);
          letter-spacing: var(--md-body-large-ls);
          font-weight: 500;
          color: #ffffff;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          outline: none;
          transition: all 0.18s;
        }
        .mu-hero__input::placeholder {
          color: rgba(255,255,255,0.60);
          font-weight: 400;
        }
        .mu-hero__input:focus {
          background: rgba(255,255,255,0.35);
          border-bottom-color: #ffffff;
          border-bottom-width: 2px; /* MD3 focused indicator */
          box-shadow: none;
        }
        .mu-hero__input--error {
          border-bottom-color: var(--md-error-container); /* MD3 Error Container */
          border-bottom-width: 2px;
        }
        .mu-hero__input-error {
          font-size: var(--md-body-small);      /* 12px — MD3 Body Small */
          line-height: var(--md-body-small-lh);
          letter-spacing: var(--md-body-small-ls);
          color: var(--md-error-container); /* MD3 Error Container */
          margin: calc(-1 * var(--md-sp-2)) 0 0; /* -8px 0 0 */
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── CTA 버튼 (MD3 Filled Button) ── */
        .mu-hero__cta {
          width: 100%;
          height: 40px;    /* MD3 Filled Button 표준 높이 40dp */
          min-height: 48px; /* MD3 터치타겟 최소 48dp */
          border-radius: var(--md-shape-full); /* MD3 Filled Button 완전 둥근 */
          font-size: var(--md-label-large);      /* 14px — MD3 Label Large */
          line-height: var(--md-label-large-lh);
          letter-spacing: var(--md-label-large-ls);
          font-weight: 700;
          background: #ffffff;
          color: #3929a0;
          border: none;
          cursor: pointer;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--md-sp-2); /* 8px */
          box-shadow: var(--md-elev-1);
        }
        .mu-hero__cta:hover {
          background: #ffffff;
          box-shadow: var(--md-elev-2);
          opacity: 0.92;
        }
        .mu-hero__cta:active { transform: scale(0.98); opacity: 0.85; }
        .mu-hero__cta.disabled,
        .mu-hero__cta:disabled {
          background: rgba(255,255,255,0.20);
          color: rgba(255,255,255,0.50); /* MD3 disabled: 38% opacity */
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        /* ── 힌트 ── */
        .mu-hero__hint {
          display: flex;
          align-items: center;
          gap: var(--md-sp-1); /* 4px */
          font-size: var(--md-label-small);      /* 11px — MD3 Label Small */
          line-height: var(--md-label-small-lh);
          letter-spacing: var(--md-label-small-ls);
          color: rgba(255,255,255,0.75);
          margin: 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-hero__hint-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.60);
          flex-shrink: 0;
        }

        /* ── 양/음력 토글 (MD3 Segmented Button) ── */
        .mu-hero__cal-toggle {
          display: flex;
          gap: var(--md-sp-2); /* 8px */
        }
        .mu-hero__cal-btn {
          flex: 1;
          height: 40px;    /* MD3 Segmented Button 높이 */
          min-height: 48px; /* MD3 터치타겟 최소 48dp */
          border-radius: var(--md-shape-full); /* MD3 Segmented Button 완전 둥근 */
          font-size: var(--md-label-large);      /* 14px — MD3 Label Large */
          line-height: var(--md-label-large-lh);
          letter-spacing: var(--md-label-large-ls);
          font-weight: 600;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.40);
          color: rgba(255,255,255,0.85);
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-hero__cal-btn--active {
          background: var(--md-primary-container); /* #E8E4FF — MD3 Primary Container */
          border-color: var(--md-primary-container);
          color: var(--md-on-primary-container);   /* #1D0080 — MD3 On Primary Container */
          box-shadow: none;
        }

        /* ── Step2 버튼 행 ── */
        .mu-hero__step2-actions {
          display: flex;
          gap: var(--md-sp-2); /* 8px */
        }
        /* MD3 Outlined Button */
        .mu-hero__back-btn {
          height: 40px;    /* MD3 Outlined Button 표준 높이 40dp */
          min-height: 48px; /* MD3 터치타겟 최소 48dp */
          padding: 0 var(--md-sp-6); /* 0 24px — MD3 Outlined Button 패딩 */
          border-radius: var(--md-shape-full); /* MD3 Outlined Button 완전 둥근 */
          font-size: var(--md-label-large);      /* 14px — MD3 Label Large */
          line-height: var(--md-label-large-lh);
          letter-spacing: var(--md-label-large-ls);
          font-weight: 500;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.50); /* MD3 Outlined Button 테두리 */
          color: rgba(255,255,255,0.90);
          cursor: pointer;
          white-space: nowrap;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .mu-hero__back-btn:hover { background: rgba(255,255,255,0.30); } /* MD3 hover state layer */
        .mu-hero__cta--submit {
          flex: 1;
          width: auto;
        }

        /* ── 신뢰 배지 (dot + separator 인라인) ── */
        .mu-hero__trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          flex-wrap: nowrap;
        }
        .mu-hero__trust-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(195,185,255,0.75);
          flex-shrink: 0;
          margin-right: 5px;
        }
        .mu-hero__trust-text {
          font-size: var(--md-label-small); /* 11px */
          font-weight: 500;
          color: rgba(255,255,255,0.72);
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          white-space: nowrap;
        }
        .mu-hero__trust-sep {
          color: rgba(255,255,255,0.18);
          font-size: 15px;
          line-height: 1;
          margin: 0 8px;
        }

        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </section>
  );
}
