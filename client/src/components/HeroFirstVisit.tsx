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

        {/* ── 압축형 헤더 ── */}
        <div className="mu-hero__header">
          <div className="mu-hero__eyebrow">명리학 기반 운세</div>
          <div className="mu-hero__title-row">
            <h1 className="mu-hero__title">내 사주 바로 확인</h1>
            <div className="mu-hero__chips">
              <span className="mu-hero__chip">무료</span>
              <span className="mu-hero__chip">비회원</span>
            </div>
          </div>
        </div>

        {/* ── 폼 카드 ── */}
        <div className="mu-hero__form-card">

          {/* 스텝 인디케이터 */}
          <div className="mu-hero__steps" aria-label="입력 단계">
            <div className="mu-hero__step-track" aria-hidden="true">
              <div
                className="mu-hero__step-fill"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>
            <div className="mu-hero__step-labels">
              <span className={`mu-hero__step-lbl${step >= 1 ? " active" : ""}`}>생년월일</span>
              <span className={`mu-hero__step-lbl${step >= 2 ? " active" : ""}`}>상세 정보</span>
            </div>
          </div>

          {step === 1 ? (
            <div className="mu-hero__step-body">
              <label className="mu-hero__input-label" htmlFor="birth-input">
                생년월일 입력
              </label>
              <div className="mu-hero__input-row">
                <input
                  id="birth-input"
                  type="text"
                  inputMode="numeric"
                  className={`mu-hero__input${inputError ? " mu-hero__input--error" : ""}`}
                  placeholder="예: 1993. 03. 16"
                  value={birthInput}
                  maxLength={10}
                  onChange={(e) => {
                    setBirthInput(e.target.value);
                    if (inputError) setInputError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && step1Valid && handleStep1Next()}
                  aria-describedby={inputError ? "birth-error" : undefined}
                />
                <button
                  type="button"
                  className={`mu-hero__cta-inline${step1Valid ? "" : " disabled"}`}
                  onClick={handleStep1Next}
                  disabled={!step1Valid}
                  aria-disabled={!step1Valid}
                >
                  확인
                </button>
              </div>
              {inputError && (
                <p id="birth-error" className="mu-hero__input-error" role="alert">
                  {inputError}
                </p>
              )}
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
                  className="mu-hero__cta"
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
        /* ── Hero 섹션 ── */
        .mu-hero--first {
          background: #ffffff;
          padding: 20px 16px 20px;
        }
        .mu-hero__inner {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* ── 압축형 헤더 ── */
        .mu-hero__header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mu-hero__eyebrow {
          font-size: 11px;
          font-weight: 500;
          color: #6B5FFF;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .mu-hero__title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .mu-hero__title {
          font-size: 22px;
          font-weight: 700;
          color: #191f28;
          letter-spacing: -0.5px;
          line-height: 1.2;
          margin: 0;
        }
        .mu-hero__chips {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }
        .mu-hero__chip {
          display: inline-flex;
          align-items: center;
          padding: 3px 8px;
          border-radius: 20px;
          background: rgba(107,95,255,0.08);
          color: #6B5FFF;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: -0.1px;
        }

        /* ── 폼 카드 ── */
        .mu-hero__form-card {
          background: #f2f4f6;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ── 스텝 인디케이터 (진행 바 스타일) ── */
        .mu-hero__steps {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mu-hero__step-track {
          height: 3px;
          background: #e8ebed;
          border-radius: 2px;
          overflow: hidden;
        }
        .mu-hero__step-fill {
          height: 100%;
          background: #6B5FFF;
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .mu-hero__step-labels {
          display: flex;
          justify-content: space-between;
        }
        .mu-hero__step-lbl {
          font-size: 11px;
          color: #8b95a1;
          font-weight: 400;
        }
        .mu-hero__step-lbl.active {
          color: #6B5FFF;
          font-weight: 500;
        }

        /* ── 입력 ── */
        .mu-hero__step-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mu-hero__input-label {
          font-size: 12px;
          color: #4e5968;
          font-weight: 500;
        }
        .mu-hero__input-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .mu-hero__input {
          flex: 1;
          height: 44px;
          background: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 0 14px;
          font-size: 15px;
          color: #191f28;
          outline: none;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          transition: box-shadow 0.15s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .mu-hero__input:focus {
          box-shadow: 0 0 0 2px rgba(107,95,255,0.25);
        }
        .mu-hero__input--error {
          box-shadow: 0 0 0 2px rgba(220,38,38,0.25);
        }
        .mu-hero__input-error {
          font-size: 12px;
          color: #dc2626;
          margin: -4px 0 0;
        }

        /* ── 인라인 확인 버튼 ── */
        .mu-hero__cta-inline {
          height: 44px;
          padding: 0 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          background: #6B5FFF;
          color: #ffffff;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          transition: background 0.15s, opacity 0.15s;
          flex-shrink: 0;
        }
        .mu-hero__cta-inline:hover { background: #5a4ee0; }
        .mu-hero__cta-inline.disabled,
        .mu-hero__cta-inline:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* ── 양/음력 토글 ── */
        .mu-hero__cal-toggle {
          display: flex;
          gap: 6px;
        }
        .mu-hero__cal-btn {
          flex: 1;
          height: 40px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          background: #ffffff;
          border: none;
          color: #4e5968;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .mu-hero__cal-btn--active {
          background: #6B5FFF;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(107,95,255,0.30);
        }

        /* ── Step2 버튼 행 ── */
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
          background: #ffffff;
          border: none;
          color: #4e5968;
          cursor: pointer;
          white-space: nowrap;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          transition: background 0.15s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .mu-hero__back-btn:hover { background: #f2f4f6; }
        .mu-hero__cta {
          flex: 1;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          background: #6B5FFF;
          color: #ffffff;
          border: none;
          cursor: pointer;
          transition: background 0.15s;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          letter-spacing: -0.2px;
        }
        .mu-hero__cta:hover { background: #5a4ee0; }
      `}</style>
    </section>
  );
}
