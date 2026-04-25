import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { MuSelect, SIJU_OPTIONS } from './MuSelect';
import { trackCustomEvent } from '@/lib/ga4';

export function HeroFirstVisit({ onBirthSaved }: { onBirthSaved: () => void }) {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<1 | 2>(1);
  const [birthInput, setBirthInput] = useState('');
  const [calType, setCalType] = useState<'solar' | 'lunar'>('solar');
  const [siju, setSiju] = useState('unknown');
  const [inputError, setInputError] = useState('');

  const step1Valid = birthInput.replace(/\D/g, '').length >= 6;

  const handleStep1Next = () => {
    const digits = birthInput.replace(/\D/g, '');
    if (digits.length < 6) {
      setInputError('생년월일을 6자 이상 입력해 주세요.');
      return;
    }
    setInputError('');
    setStep(2);
    trackCustomEvent('hero_form_step2', {});
  };

  const handleSubmit = () => {
    const digits = birthInput.replace(/\D/g, '');
    const data = { birth: digits, calType, siju, savedAt: new Date().toISOString() };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('muun_user_birth', JSON.stringify(data));
    }
    trackCustomEvent('hero_form_submit', { calType, siju });
    onBirthSaved();
    navigate('/lifelong-saju');
  };

  return (
    <section className="mu-hero-shell">
      <div className="mu-container-narrow px-4 pb-10 pt-6 sm:pt-7">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="relative z-[1]">
            <div className="mu-kicker">회원가입 없이 바로 시작</div>
            <h1 className="mt-4 text-[32px] font-extrabold leading-[1.08] tracking-[-0.06em] text-white sm:text-[40px]">
              생년월일로 바로
              <br />
              <span className="text-[#FFF1B8]">평생사주 보기</span>
            </h1>
            <p className="mt-4 max-w-[30rem] text-[15px] leading-7 text-white/82 sm:text-base">
              입력 후 바로 결과 화면으로 이동합니다.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="mu-stat-pill"><ShieldCheck size={14} /> 회원가입 없음</span>
              <span className="mu-stat-pill"><Sparkles size={14} /> 바로 결과 확인</span>
            </div>
          </div>

          <div className="mu-soft-card relative z-[1] p-5 text-slate-900 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#5748db]">평생사주 시작</div>
                <h2 className="mt-2 text-[24px] font-extrabold tracking-[-0.05em] text-slate-900">생년월일 입력</h2>
              </div>
              <div className="inline-flex min-w-[52px] justify-center rounded-full bg-[#6B5FFF]/10 px-3 py-1.5 text-xs font-bold text-[#5648db]">
                {step}/2
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <span className={`inline-flex h-9 items-center rounded-full px-4 text-sm font-bold ${step === 1 ? 'bg-[#6B5FFF] text-white shadow-[0_14px_28px_rgba(107,95,255,0.22)]' : 'bg-slate-100 text-slate-500'}`}>
                1. 생년월일
              </span>
              <span className={`inline-flex h-9 items-center rounded-full px-4 text-sm font-bold ${step === 2 ? 'bg-[#6B5FFF] text-white shadow-[0_14px_28px_rgba(107,95,255,0.22)]' : 'bg-slate-100 text-slate-500'}`}>
                2. 추가 정보
              </span>
            </div>

            {step === 1 ? (
              <div className="mt-5">
                <label htmlFor="birth-input" className="text-sm font-bold text-slate-900">생년월일</label>
                <input
                  id="birth-input"
                  type="text"
                  inputMode="numeric"
                  className={`mt-3 h-[52px] w-full rounded-2xl border px-4 text-base outline-none ${inputError ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}
                  placeholder="예) 19930521"
                  value={birthInput}
                  maxLength={12}
                  onChange={(e) => {
                    setBirthInput(e.target.value);
                    if (inputError) setInputError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && step1Valid && handleStep1Next()}
                  aria-describedby={inputError ? 'birth-error' : undefined}
                />
                {inputError && (
                  <p id="birth-error" className="mt-2 text-sm font-medium text-rose-600" role="alert">
                    {inputError}
                  </p>
                )}
                <button
                  type="button"
                  className="mu-primary-btn mt-4 w-full justify-center"
                  onClick={handleStep1Next}
                  disabled={!step1Valid}
                >
                  다음 <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="mt-5">
                <div className="flex rounded-2xl bg-slate-100 p-1">
                  <button
                    type="button"
                    className={`h-11 flex-1 rounded-[14px] text-sm font-bold ${calType === 'solar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                    onClick={() => setCalType('solar')}
                  >
                    양력
                  </button>
                  <button
                    type="button"
                    className={`h-11 flex-1 rounded-[14px] text-sm font-bold ${calType === 'lunar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                    onClick={() => setCalType('lunar')}
                  >
                    음력
                  </button>
                </div>

                <div className="mt-4">
                  <MuSelect
                    id="siju-select"
                    label="태어난 시간 (선택)"
                    options={SIJU_OPTIONS}
                    value={siju}
                    onChange={setSiju}
                    placeholder="시간 선택"
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="mu-secondary-btn justify-center"
                    onClick={() => setStep(1)}
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    className="mu-primary-btn justify-center"
                    onClick={handleSubmit}
                  >
                    결과 보기
                  </button>
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-500">태어난 시간을 몰라도 볼 수 있어요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
