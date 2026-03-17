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
      <div className="mu-hero__inner">

        {/* ── 메인 타이틀 ── */}
        <div className="mu-hero__header">
          <h1 className="mu-hero__title">
            지금 바로<br />
            내 사주를<br />
            확인하세요
          </h1>
          <p className="mu-hero__sub">생년월일만 입력하면 바로 시작됩니다</p>
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
                다음 →
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
            <span className="mu-hero__badge-check" aria-hidden="true">✓</span>
            100% 무료
          </div>
          <div className="mu-hero__badge">
            <span className="mu-hero__badge-check" aria-hidden="true">✓</span>
            회원가입 없음
          </div>
          <div className="mu-hero__badge">
            <span className="mu-hero__badge-check" aria-hidden="true">✓</span>
            저장 안함
          </div>
        </div>

      </div>

      <style>{`
        /* ── Hero 섹션 ── */
        .mu-hero--first {
          background: #ffffff;
          padding: 24px 18px 24px;
        }
        .mu-hero__inner {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── 메인 타이틀 ── */
        .mu-hero__header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mu-hero__title {
          font-size: 28px;
          font-weight: 800;
          color: #191f28;
          letter-spacing: -0.04em;
          line-height: 1.25;
          margin: 0;
        }
        .mu-hero__sub {
          font-size: 14px;
          font-weight: 500;
          color: #8b95a1;
          margin: 0;
          line-height: 1.5;
        }

        /* ── 폼 카드 ── */
        .mu-hero__form-card {
          background: #f2f4f6;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* ── 스텝 탭 ── */
        .mu-hero__steps {
          padding: 0;
        }
        .mu-hero__step-tab-row {
          display: flex;
          background: #f2f4f6;
          border-radius: 12px;
          overflow: hidden;
          margin: 12px 12px 0;
        }
        .mu-hero__step-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 10px 0;
          font-size: 12px;
          font-weight: 600;
          color: #b0b8c1;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          transition: all 0.2s;
        }
        .mu-hero__step-tab.active {
          color: #191f28;
          background: #ffffff;
          border-radius: 10px;
        }
        .mu-hero__step-num {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #e8ebed;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 700;
          color: #b0b8c1;
        }
        .mu-hero__step-tab.active .mu-hero__step-num {
          background: #6B5FFF;
          color: #ffffff;
        }
        .mu-hero__step-divider {
          width: 1px;
          background: rgba(0,0,0,0.04);
          flex-shrink: 0;
        }

        /* ── 입력 영역 ── */
        .mu-hero__step-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 12px 12px 14px;
        }
        .mu-hero__input {
          width: 100%;
          background: #f2f4f6;
          border: 2px solid transparent;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 16px;
          font-weight: 500;
          color: #191f28;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          outline: none;
          transition: all 0.18s;
        }
        .mu-hero__input::placeholder {
          color: #d1d6db;
          font-weight: 400;
        }
        .mu-hero__input:focus {
          background: #ffffff;
          border-color: #ddd6ff;
          box-shadow: 0 0 0 4px rgba(107,95,255,0.08);
        }
        .mu-hero__input--error {
          border-color: rgba(240,68,82,0.4);
          box-shadow: 0 0 0 4px rgba(240,68,82,0.06);
        }
        .mu-hero__input-error {
          font-size: 12px;
          color: #f04452;
          margin: -4px 0 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── CTA 버튼 ── */
        .mu-hero__cta {
          width: 100%;
          height: 50px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          background: #6B5FFF;
          color: #ffffff;
          border: none;
          cursor: pointer;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          transition: background 0.15s, opacity 0.15s;
          letter-spacing: -0.2px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .mu-hero__cta:hover { background: #5a4ee0; }
        .mu-hero__cta.disabled,
        .mu-hero__cta:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* ── 힌트 ── */
        .mu-hero__hint {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #8b95a1;
          margin: 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-hero__hint-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #b0b8c1;
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
          background: #ffffff;
          border: 1.5px solid #e5e8eb;
          color: #4e5968;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-hero__cal-btn--active {
          background: #6B5FFF;
          border-color: #6B5FFF;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(107,95,255,0.30);
        }

        /* ── Step2 버튼 행 ── */
        .mu-hero__step2-actions {
          display: flex;
          gap: 8px;
        }
        .mu-hero__back-btn {
          height: 50px;
          padding: 0 18px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          background: #ffffff;
          border: none;
          color: #4e5968;
          cursor: pointer;
          white-space: nowrap;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          transition: background 0.15s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          flex-shrink: 0;
        }
        .mu-hero__back-btn:hover { background: #f2f4f6; }
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
          gap: 4px;
          padding: 5px 10px;
          border-radius: 20px;
          background: #f2f4f6;
          font-size: 11px;
          font-weight: 500;
          color: #4e5968;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-hero__badge-check {
          color: #6B5FFF;
          font-weight: 700;
          font-size: 11px;
        }
      `}</style>
    </section>
  );
}
