import { useState, type FormEvent } from 'react';
import { useLocation } from 'wouter';
import { Check, Lock, Star } from 'lucide-react';
import { trackCustomEvent } from '@/lib/ga4';

export function HeroFirstVisit({ onBirthSaved }: { onBirthSaved: () => void }) {
  const [, navigate] = useLocation();
  const [birthInput, setBirthInput] = useState('');
  const [inputError, setInputError] = useState('');

  const digits = birthInput.replace(/\D/g, '').slice(0, 8);
  const isValid = digits.length === 8;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!isValid) {
      setInputError('생년월일 8자리를 입력해 주세요. 예) 19930521');
      return;
    }

    const data = { birth: digits, calType: 'solar', siju: 'unknown', savedAt: new Date().toISOString() };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('muun_user_birth', JSON.stringify(data));
    }
    trackCustomEvent('hero_form_submit', { calType: 'solar', siju: 'unknown', entry: 'home_mobile_redesign' });
    onBirthSaved();
    navigate('/lifelong-saju');
  };

  return (
    <section className="muun-hero" aria-labelledby="home-hero-title">
      <div className="muun-hero__inner">
        <div className="muun-trust-row" aria-label="서비스 특징">
          <span className="muun-trust-pill"><Check size={11} aria-hidden="true" />회원가입 없음</span>
          <span className="muun-trust-pill"><Lock size={11} aria-hidden="true" />정보 저장 안 함</span>
          <span className="muun-trust-pill"><Star size={11} aria-hidden="true" />100% 무료</span>
        </div>

        <h1 id="home-hero-title" className="muun-hero__title">
          생년월일로 바로<br />평생사주 보기
        </h1>
        <p className="muun-hero__sub">입력 후 바로 결과 화면으로 이동합니다.</p>

        <form className="muun-input-card" onSubmit={handleSubmit} noValidate>
          <p className="muun-card-label">생년월일 입력</p>
          <label className="muun-field-wrap" htmlFor="birth-input">
            <span className="muun-field-title">생년월일 8자리</span>
            <input
              id="birth-input"
              type="text"
              inputMode="numeric"
              autoComplete="bday"
              className={`muun-field-input${inputError ? ' muun-field-input--error' : ''}`}
              placeholder="예) 19930521"
              value={digits}
              maxLength={8}
              onChange={(event) => {
                setBirthInput(event.target.value.replace(/\D/g, '').slice(0, 8));
                if (inputError) setInputError('');
              }}
              aria-describedby={inputError ? 'birth-input-error' : undefined}
            />
          </label>
          {inputError ? <p id="birth-input-error" className="muun-input-error" role="alert">{inputError}</p> : null}
          <button type="submit" className="muun-hero-cta" disabled={!isValid}>
            {isValid ? '무료 평생사주 보기' : '생년월일을 입력해주세요'}
          </button>
        </form>
      </div>
    </section>
  );
}
