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
      <div className="mu-container-narrow px-4 pb-12 pt-7 sm:pt-8">
        <div className="grid gap-7 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
          <div className="relative z-[1]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white/90 backdrop-blur">
              <ShieldCheck size={14} />
              회원가입 없이 30초 시작
            </span>
            <h1 className="mt-5 text-[33px] font-extrabold leading-[1.08] tracking-[-0.06em] text-white sm:text-[43px]">
              프리미엄 사주 리딩을
              <br />
              <span className="text-[#FFF1B8]">가장 빠르게 경험하세요</span>
            </h1>
            <p className="mt-4 max-w-[34rem] text-[15px] leading-7 text-white/82 sm:text-base">
              생년월일만 입력하면 평생사주 핵심 요약부터 영역별 해설까지
              <br className="hidden sm:block" />
              한 화면에서 매끄럽게 확인할 수 있습니다.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/65">Start</div>
                <div className="mt-1 text-sm font-semibold text-white">즉시 분석 시작</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/65">Privacy</div>
                <div className="mt-1 text-sm font-semibold text-white">서버 저장 안함</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/65">Result</div>
                <div className="mt-1 text-sm font-semibold text-white">핵심 결과 우선 제공</div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="mu-stat-pill"><ShieldCheck size={14} /> 회원가입 없음</span>
              <span className="mu-stat-pill"><Sparkles size={14} /> 모바일 최적화</span>
            </div>
          </div>

          <div className="relative z-[1] rounded-[30px] border border-white/20 bg-white/95 p-5 text-slate-900 shadow-[0_35px_70px_rgba(15,23,42,0.32)] backdrop-blur sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#5748db]">Lifelong Saju</div>
                <h2 className="mt-2 text-[26px] font-extrabold tracking-[-0.05em] text-slate-900">무료 분석 시작</h2>
                <p className="mt-1 text-sm text-slate-500">두 단계로 1분 안에 완료됩니다.</p>
              </div>
              <div className="inline-flex min-w-[56px] justify-center rounded-full bg-[#6B5FFF]/10 px-3 py-1.5 text-xs font-bold text-[#5648db]">
                {step}/2
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
              <span className={`inline-flex h-10 items-center justify-center rounded-xl text-sm font-bold ${step === 1 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                1. 생년월일
              </span>
              <span className={`inline-flex h-10 items-center justify-center rounded-xl text-sm font-bold ${step === 2 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                2. 추가 설정
              </span>
            </div>

            {step === 1 ? (
              <div className="mt-5">
                <label htmlFor="birth-input" className="text-sm font-bold text-slate-900">생년월일 8자리</label>
                <input
                  id="birth-input"
                  type="text"
                  inputMode="numeric"
                  className={`mt-3 h-[54px] w-full rounded-2xl border px-4 text-base outline-none transition ${inputError ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50 focus:border-[#6B5FFF] focus:bg-white'}`}
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
                <button type="button" className="mu-primary-btn mt-4 w-full justify-center" onClick={handleStep1Next} disabled={!step1Valid}>
                  다음 단계 <ArrowRight size={16} />
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
                  <button type="button" className="mu-secondary-btn justify-center" onClick={() => setStep(1)}>
                    이전
                  </button>
                  <button type="button" className="mu-primary-btn justify-center" onClick={handleSubmit}>
                    결과 보기
                  </button>
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-500">태어난 시간을 몰라도 분석이 가능합니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
