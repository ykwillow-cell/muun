import { Link } from 'wouter';
import { CheckCircle2, Lock, Sparkles } from 'lucide-react';

export function HeroFirstVisit({ onBirthSaved: _onBirthSaved }: { onBirthSaved: () => void }) {
  return (
    <section className="mu-home-hero" aria-labelledby="home-hero-title">
      <div className="mu-home-hero__sky" aria-hidden="true">
        <div className="mu-home-hero__moon" />
        <div className="mu-home-hero__cloud mu-home-hero__cloud--one" />
        <div className="mu-home-hero__cloud mu-home-hero__cloud--two" />
      </div>
      <div className="mu-home-hero__content">
        <p className="mu-home-hero__eyebrow">회원가입 없이 바로 확인</p>
        <h1 id="home-hero-title" className="mu-home-hero__title">오늘도 좋은 기운으로<br />빛나는 하루 되세요</h1>
        <p className="mu-home-hero__desc">생년월일만 입력하면 평생사주, 오늘의 운세, 궁합, 꿈해몽까지 자연스럽게 이어집니다.</p>
        <div className="mu-home-hero__trust">
          <span><CheckCircle2 size={14} /> 회원가입 없음</span>
          <span><Sparkles size={14} /> 100% 무료</span>
          <span><Lock size={14} /> 개인정보 저장 안 함</span>
        </div>
        <div className="mu-home-hero__cta-row">
          <Link href="/lifelong-saju" className="mu-home-hero__primary-link">
            무료로 시작하기
          </Link>
        </div>
      </div>
    </section>
  );
}
