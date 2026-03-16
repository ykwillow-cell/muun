import { useState } from "react";
import { useLocation } from "wouter";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { MuSelect, SIJU_OPTIONS } from "./MuSelect";
import { trackCustomEvent } from "@/lib/ga4";

const TRUST_ITEMS = [
  { num: "100%", label: "무료" },
  { num: "회원가입", label: "없음" },
  { num: "서버 저장", label: "없음" },
];

export function HeroFirstVisit({ onBirthSaved }: { onBirthSaved: () => void }) {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<1 | 2>(1);
  const [birthInput, setBirthInput] = useState("");
  const [calType, setCalType] = useState<"solar" | "lunar">("solar");
  const [siju, setSiju] = useState("unknown");
  const [inputError, setInputError] = useState("");

  // Step 1: 생년월일 6자 이상 입력 시 버튼 활성
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
      {/* 앰비언트 글로우 */}
      <div className="mu-hero__glow mu-hero__glow--gold" aria-hidden="true" />
      <div className="mu-hero__glow mu-hero__glow--purple" aria-hidden="true" />

      <div className="mu-hero__inner">
        {/* 타이틀 */}
        <h1 className="mu-hero__title">
          지금 바로<br />
          <em>내 사주를 확인하세요</em>
        </h1>
        <p className="mu-hero__sub">생년월일만 입력하면 바로 시작됩니다</p>

        {/* Trust Bar */}
        <div className="mu-hero__trust-bar" role="list">
          {TRUST_ITEMS.map((t) => (
            <div key={t.label} className="mu-hero__trust-item" role="listitem">
              <CheckCircle2 size={12} className="mu-hero__trust-check" />
              <span className="mu-hero__trust-num">{t.num}</span>
              <span className="mu-hero__trust-label">{t.label}</span>
            </div>
          ))}
        </div>

        {/* 폼 카드 */}
        <div className="mu-hero__form-card">
          {/* 스텝 인디케이터 */}
          <div className="mu-hero__steps" aria-label="입력 단계">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`mu-hero__step${step === s ? " mu-hero__step--active" : step > s ? " mu-hero__step--done" : ""}`}
              >
                <span className="mu-hero__step-dot">{step > s ? "✓" : s}</span>
                <span className="mu-hero__step-label">
                  {s === 1 ? "생년월일" : "상세 정보"}
                </span>
              </div>
            ))}
            <div className="mu-hero__step-line" aria-hidden="true" />
          </div>

          {step === 1 ? (
            <div className="mu-hero__step-body">
              <label className="mu-hero__input-label" htmlFor="birth-input">
                생년월일 입력
              </label>
              <input
                id="birth-input"
                type="text"
                inputMode="numeric"
                className={`mu-hero__input krds-input${inputError ? " mu-hero__input--error" : ""}`}
                placeholder="예: 19930316"
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
                className={`mu-hero__cta krds-btn primary${step1Valid ? "" : " disabled"}`}
                onClick={handleStep1Next}
                disabled={!step1Valid}
                aria-disabled={!step1Valid}
              >
                다음 단계
                <ArrowRight size={15} />
              </button>
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
              />

              <div className="mu-hero__step2-actions">
                <button
                  type="button"
                  className="mu-hero__back-btn krds-btn secondary"
                  onClick={() => setStep(1)}
                >
                  이전
                </button>
                <button
                  type="button"
                  className="mu-hero__cta mu-hero__cta--flex krds-btn primary"
                  onClick={handleSubmit}
                >
                  사주 확인하기
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .mu-hero {
          position: relative;
          overflow: hidden;
          padding: 24px 16px 28px;
        }
        .mu-hero__glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
          opacity: 0.18;
        }
        .mu-hero__glow--gold {
          width: 220px; height: 220px;
          top: -40px; left: -40px;
          background: oklch(0.85 0.18 85);
        }
        .mu-hero__glow--purple {
          width: 180px; height: 180px;
          bottom: -20px; right: -30px;
          background: oklch(0.45 0.2 290);
        }
        .mu-hero__inner {
          position: relative;
          z-index: 1;
        }
        /* 배지 */
        .mu-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 100px;
          background: oklch(0.85 0.18 85 / 0.12);
          border: 1px solid oklch(0.85 0.18 85 / 0.25);
          color: oklch(0.85 0.18 85);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.01em;
          margin-bottom: 14px;
        }
        /* 타이틀 */
        .mu-hero__title {
          font-size: 26px;
          font-weight: 700;
          line-height: 1.25;
          color: white;
          letter-spacing: -0.02em;
          margin: 0 0 8px;
        }
        .mu-hero__title em {
          font-style: normal;
          background: linear-gradient(90deg, oklch(0.85 0.18 85), oklch(0.90 0.15 70));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .mu-hero__sub {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          margin: 0 0 18px;
          line-height: 1.5;
        }
        /* Trust Bar */
        .mu-hero__trust-bar {
          display: flex;
          gap: 0;
          margin-bottom: 20px;
        }
        .mu-hero__trust-item {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          padding: 8px 0;
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        .mu-hero__trust-item:last-child { border-right: none; }
        .mu-hero__trust-check { color: oklch(0.85 0.18 85); flex-shrink: 0; }
        .mu-hero__trust-num {
          font-size: 13px;
          font-weight: 700;
          color: oklch(0.85 0.18 85);
        }
        .mu-hero__trust-label {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }
        /* 폼 카드 */
        .mu-hero__form-card {
          background: oklch(0.18 0.04 265 / 0.8);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 18px 16px;
          backdrop-filter: blur(8px);
        }
        /* 스텝 인디케이터 */
        .mu-hero__steps {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 18px;
          position: relative;
        }
        .mu-hero__step-line {
          position: absolute;
          top: 11px;
          left: 11px;
          right: 11px;
          height: 1px;
          background: rgba(255,255,255,0.08);
          z-index: 0;
        }
        .mu-hero__step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex: 1;
          position: relative;
          z-index: 1;
        }
        .mu-hero__step-dot {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          font-weight: 600;
        }
        .mu-hero__step--active .mu-hero__step-dot {
          background: oklch(0.85 0.18 85);
          border-color: oklch(0.85 0.18 85);
          color: oklch(0.12 0.04 265);
        }
        .mu-hero__step--done .mu-hero__step-dot {
          background: oklch(0.85 0.18 85 / 0.2);
          border-color: oklch(0.85 0.18 85 / 0.4);
          color: oklch(0.85 0.18 85);
        }
        .mu-hero__step-label {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
        }
        .mu-hero__step--active .mu-hero__step-label,
        .mu-hero__step--done .mu-hero__step-label {
          color: oklch(0.85 0.18 85);
        }
        /* 입력 */
        .mu-hero__step-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mu-hero__input-label {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          font-weight: 500;
        }
        .mu-hero__input {
          width: 100%;
          height: 44px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 10px;
          padding: 0 12px;
          font-size: 15px;
          color: white;
          outline: none;
          font-family: 'Pretendard', sans-serif;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }
        .mu-hero__input:focus {
          border-color: oklch(0.85 0.18 85 / 0.5);
        }
        .mu-hero__input--error {
          border-color: oklch(0.6 0.2 20 / 0.6);
        }
        .mu-hero__input-error {
          font-size: 12px;
          color: oklch(0.7 0.15 20);
          margin: -4px 0 0;
        }
        /* CTA 버튼 */
        .mu-hero__cta {
          width: 100%;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          background: oklch(0.85 0.18 85);
          color: oklch(0.12 0.04 265);
          border: none;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
          font-family: 'Pretendard', sans-serif;
          letter-spacing: -0.01em;
        }
        .mu-hero__cta:hover { background: oklch(0.80 0.18 85); }
        .mu-hero__cta.disabled,
        .mu-hero__cta:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        /* 양/음력 토글 */
        .mu-hero__cal-toggle {
          display: flex;
          gap: 6px;
        }
        .mu-hero__cal-btn {
          flex: 1;
          height: 38px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'Pretendard', sans-serif;
        }
        .mu-hero__cal-btn--active {
          background: oklch(0.85 0.18 85 / 0.15);
          border-color: oklch(0.85 0.18 85 / 0.4);
          color: oklch(0.85 0.18 85);
          font-weight: 600;
        }
        /* Step2 버튼 행 */
        .mu-hero__step2-actions {
          display: flex;
          gap: 8px;
        }
        .mu-hero__back-btn {
          height: 48px;
          padding: 0 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          white-space: nowrap;
          font-family: 'Pretendard', sans-serif;
          transition: background 0.15s;
        }
        .mu-hero__back-btn:hover { background: rgba(255,255,255,0.10); }
        .mu-hero__cta--flex { flex: 1; width: auto; }
      `}</style>
    </section>
  );
}
