import { useState, type FormEvent } from 'react';
import { useLocation } from 'wouter';
import { CalendarDays, CheckCircle2, Lock, Sparkles } from 'lucide-react';
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
    if (typeof window !== 'undefined') window.localStorage.setItem('muun_user_birth', JSON.stringify(data));
    trackCustomEvent('hero_form_submit', { entry: 'home_pastel_design' });
    onBirthSaved();
    navigate('/lifelong-saju');
  };

  return (
    <section className="mu-home-hero" aria-labelledby="home-hero-title">
      <div className="mu-home-hero__sky" aria-hidden="true">
        <div className="mu-home-hero__moon" />
        <div className="mu-home-hero__cloud mu-home-hero__cloud--one" />
        <div className="mu-home-hero__cloud mu-home-hero__cloud--two" />
      </div>
      <div className="mu-home-hero__content">
        <p className="mu-home-hero__eyebrow">회원가입 없이 바로 시작</p>
        <h1 id="home-hero-title" className="mu-home-hero__title">생년월일만 입력하면<br />바로 보는 무료 사주</h1>
        <p className="mu-home-hero__desc">평생사주, 오늘의 운세, 궁합, 꿈해몽까지 빠르게 이어지는 모바일 사주 서비스를 준비했습니다.</p>

        <form className="mu-home-hero__form" onSubmit={handleSubmit} noValidate>
          <label className="mu-home-hero__field" htmlFor="home-birth-input">
            <span><CalendarDays size={16} /> 생년월일 8자리</span>
            <input
              id="home-birth-input"
              type="text"
              inputMode="numeric"
              autoComplete="bday"
              placeholder="예) 19930521"
              value={digits}
              maxLength={8}
              onChange={(event) => {
                setBirthInput(event.target.value.replace(/\D/g, '').slice(0, 8));
                if (inputError) setInputError('');
              }}
            />
          </label>
          {inputError ? <p className="mu-home-hero__error">{inputError}</p> : null}
          <button type="submit" className="mu-home-hero__cta" disabled={!isValid}>
            <Sparkles size={16} /> 무료 평생사주 보기
          </button>
        </form>

        <div className="mu-home-hero__trust">
          <span><CheckCircle2 size={14} /> 회원가입 없음</span>
          <span><Lock size={14} /> 개인정보 저장 안 함</span>
          <span><Sparkles size={14} /> 무료 결과 확인</span>
        </div>
      </div>
    </section>
  );
}
