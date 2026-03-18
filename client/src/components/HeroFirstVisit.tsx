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

        {/* ── 상단 레이블 ── */}
        <div className="mu-hero__eyebrow-wrap">
          <span className="mu-hero__eyebrow-dot" />
          <span className="mu-hero__eyebrow-text">정통 명리학 기반 · 100% 무료</span>
        </div>

        {/* ── 메인 타이틀 ── */}
        <div className="mu-hero__header">
          <h1 className="mu-hero__title">
            생년월일로 보는<br />
            <span className="mu-hero__title-accent">나의 사주</span>
          </h1>
          <p className="mu-hero__sub">회원가입 없이 지금 바로 확인하세요</p>
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

        {/* ── 신뢰 배지 3개 ── */}
        <div className="mu-hero__badges" aria-label="서비스 특징">
          <div className="mu-hero__badge">
            <span className="mu-hero__badge-icon" aria-hidden="true">✦</span>
            100% 무료
          </div>
          <div className="mu-hero__badge">
            <span className="mu-hero__badge-icon" aria-hidden="true">✦</span>
            회원가입 없음
          </div>
          <div className="mu-hero__badge">
            <span className="mu-hero__badge-icon" aria-hidden="true">✦</span>
            저장 안함
          </div>
        </div>

      </div>

      <style>{`
        /* ── Hero 섹션 래퍼 ── */
        .mu-hero--first {
          position: relative;
          background: linear-gradient(155deg, #12082e 0%, #1e0f4a 40%, #2a1060 70%, #1a0840 100%);
          padding: 32px 18px 36px;
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
          background: radial-gradient(circle, rgba(123,97,255,0.35) 0%, transparent 70%);
          top: -80px; right: -60px;
        }
        .mu-hero__orb--2 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(160,120,255,0.20) 0%, transparent 70%);
          bottom: -40px; left: -40px;
        }
        .mu-hero__orb--3 {
          width: 140px; height: 140px;
          background: radial-gradient(circle, rgba(200,160,255,0.15) 0%, transparent 70%);
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
          gap: 20px;
        }

        /* ── 상단 레이블 ── */
        .mu-hero__eyebrow-wrap {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 100px;
          padding: 5px 12px;
          width: fit-content;
        }
        .mu-hero__eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #a78bfa;
          animation: live-pulse 1.8s ease-in-out infinite;
          flex-shrink: 0;
        }
        .mu-hero__eyebrow-text {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.02em;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── 메인 타이틀 ── */
        .mu-hero__header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mu-hero__title {
          font-size: 30px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.04em;
          line-height: 1.2;
          margin: 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-hero__title-accent {
          background: linear-gradient(90deg, #c4b5fd 0%, #a78bfa 50%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .mu-hero__sub {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          margin: 0;
          line-height: 1.5;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── 폼 카드 (글래스모피즘) ── */
        .mu-hero__form-card {
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 20px;
          padding: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15);
        }

        /* ── 스텝 탭 ── */
        .mu-hero__steps {
          padding: 0;
        }
        .mu-hero__step-tab-row {
          display: flex;
          background: rgba(0,0,0,0.25);
          border-radius: 12px;
          padding: 4px;
          gap: 4px;
          overflow: hidden;
          margin: 0;
        }
        .mu-hero__step-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 10px 0;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.40);
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          transition: all 0.2s;
          border-radius: 9px;
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
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 700;
          color: rgba(255,255,255,0.50);
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
          gap: 10px;
          padding: 12px 0 0;
        }
        .mu-hero__input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.20);
          border-radius: 12px;
          padding: 15px 16px;
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          outline: none;
          transition: all 0.18s;
        }
        .mu-hero__input::placeholder {
          color: rgba(255,255,255,0.35);
          font-weight: 400;
        }
        .mu-hero__input:focus {
          background: rgba(255,255,255,0.18);
          border-color: rgba(167,139,250,0.70);
          box-shadow: 0 0 0 4px rgba(123,97,255,0.20);
        }
        .mu-hero__input--error {
          border-color: rgba(240,68,82,0.6);
          box-shadow: 0 0 0 4px rgba(240,68,82,0.10);
        }
        .mu-hero__input-error {
          font-size: 12px;
          color: #fca5a5;
          margin: -4px 0 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── CTA 버튼 ── */
        .mu-hero__cta {
          width: 100%;
          height: 52px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          background: linear-gradient(135deg, #7B61FF 0%, #9B6DFF 100%);
          color: #ffffff;
          border: none;
          cursor: pointer;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          transition: all 0.15s;
          letter-spacing: -0.2px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 4px 16px rgba(123,97,255,0.45);
        }
        .mu-hero__cta:hover {
          background: linear-gradient(135deg, #6B51EF 0%, #8B5DEF 100%);
          box-shadow: 0 6px 20px rgba(123,97,255,0.55);
          transform: translateY(-1px);
        }
        .mu-hero__cta:active { transform: scale(0.98); }
        .mu-hero__cta.disabled,
        .mu-hero__cta:disabled {
          background: rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.30);
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        /* ── 힌트 ── */
        .mu-hero__hint {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: rgba(255,255,255,0.40);
          margin: 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-hero__hint-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.30);
          flex-shrink: 0;
        }

        /* ── 양/음력 토글 ── */
        .mu-hero__cal-toggle {
          display: flex;
          gap: 6px;
        }
        .mu-hero__cal-btn {
          flex: 1;
          height: 42px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          background: rgba(255,255,255,0.10);
          border: 1.5px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.60);
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-hero__cal-btn--active {
          background: #7B61FF;
          border-color: #7B61FF;
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(123,97,255,0.40);
        }

        /* ── Step2 버튼 행 ── */
        .mu-hero__step2-actions {
          display: flex;
          gap: 8px;
        }
        .mu-hero__back-btn {
          height: 52px;
          padding: 0 18px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 500;
          background: rgba(255,255,255,0.10);
          border: 1.5px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.70);
          cursor: pointer;
          white-space: nowrap;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .mu-hero__back-btn:hover { background: rgba(255,255,255,0.16); }
        .mu-hero__cta--submit {
          flex: 1;
          width: auto;
        }

        /* ── 신뢰 배지 ── */
        .mu-hero__badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .mu-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 100px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.15);
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-hero__badge-icon {
          color: #a78bfa;
          font-size: 9px;
        }

        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </section>
  );
}
