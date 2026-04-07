import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, CalendarDays, Sparkles, ShieldCheck } from 'lucide-react';
import { MuSelect, SIJU_OPTIONS } from './MuSelect';
import { trackCustomEvent } from '@/lib/ga4';
import BrandLogo from '@/components/BrandLogo';

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
    localStorage.setItem('muun_user_birth', JSON.stringify(data));
    trackCustomEvent('hero_form_submit', { calType, siju });
    onBirthSaved();
    navigate('/lifelong-saju');
  };

  return (
    <section className="mu-hero-shell">
      <div className="mu-container-narrow px-4 pb-8 pt-5">
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))] items-end">
          <div className="relative z-[1] pb-1">
            <div className="mu-kicker">무료 사주 시작</div>
            <div className="mt-4 inline-flex rounded-[20px] bg-white/10 px-3 py-2 backdrop-blur">
              <BrandLogo size="md" />
            </div>
            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.08] tracking-[-0.06em] text-white">
              생년월일로 바로 보는
              <br />
              <span className="text-[#FFF1B8]">모바일 사주 리포트</span>
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/80">
              회원가입 없이 시작하고, 결과에서 끝나지 않도록 칼럼·사전·꿈해몽까지 자연스럽게 이어지는 구조로 설계했습니다.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="mu-stat-pill"><ShieldCheck size={14} /> 개인정보 저장 없음</span>
              <span className="mu-stat-pill"><Sparkles size={14} /> 무료 서비스 중심</span>
              <span className="mu-stat-pill"><CalendarDays size={14} /> 오늘 바로 확인</span>
            </div>
          </div>

          <div className="mu-soft-card relative z-[1] p-5 text-slate-900">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              <span className={`inline-flex h-7 items-center rounded-full px-3 ${step === 1 ? 'bg-[#6B5FFF] text-white' : 'bg-slate-100 text-slate-500'}`}>1 생년월일</span>
              <span className="text-slate-300">/</span>
              <span className={`inline-flex h-7 items-center rounded-full px-3 ${step === 2 ? 'bg-[#6B5FFF] text-white' : 'bg-slate-100 text-slate-500'}`}>2 상세 정보</span>
            </div>

            {step === 1 ? (
              <div className="mt-4">
                <label className="text-sm font-bold text-slate-900">생년월일 입력</label>
                <input
                  id="birth-input"
                  type="text"
                  inputMode="numeric"
                  className={`mt-3 h-13 w-full rounded-2xl border px-4 text-base outline-none ${inputError ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}
                  placeholder="예) 1993.05.21 또는 930521"
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
                  className="mt-4 inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#6B5FFF] px-5 text-sm font-bold text-white shadow-[0_18px_34px_rgba(107,95,255,0.28)] disabled:opacity-40"
                  onClick={handleStep1Next}
                  disabled={!step1Valid}
                >
                  다음 단계로 <ArrowRight size={16} />
                </button>
                <p className="mt-3 text-xs leading-6 text-slate-500">양력·음력과 태어난 시간은 다음 단계에서 선택합니다.</p>
              </div>
            ) : (
              <div className="mt-4">
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
                    placeholder="시간을 선택하세요"
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="h-12 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700"
                    onClick={() => setStep(1)}
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    className="h-12 rounded-2xl bg-[#6B5FFF] text-sm font-bold text-white shadow-[0_18px_34px_rgba(107,95,255,0.28)]"
                    onClick={handleSubmit}
                  >
                    사주 확인하기
                  </button>
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-500">태어난 시간을 몰라도 결과를 볼 수 있어요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
