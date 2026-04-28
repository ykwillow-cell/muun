import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { CalendarDays, Sparkles, Trash2 } from 'lucide-react';
import { trackCustomEvent } from '@/lib/ga4';

const TITLES = ['새로운 시작을 위한 좋은 기운이 들어와요.', '차분하게 흐름을 살피기 좋은 하루예요.', '작은 선택이 운을 바꾸는 날이에요.', '도움과 기회가 자연스럽게 모이는 흐름이에요.'];
const SCORE = [87, 83, 89, 85];

interface HeroReturnVisitProps {
  onDeleteBirth: () => void;
}

function formatBirthLabel(birth: string) {
  if (!birth || birth.length !== 8) return '저장된 생년월일';
  return `${Number(birth.slice(0, 4))}년 ${Number(birth.slice(4, 6))}월 ${Number(birth.slice(6, 8))}일`;
}

export function HeroReturnVisit({ onDeleteBirth }: HeroReturnVisitProps) {
  const [birth] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      const raw = window.localStorage.getItem('muun_user_birth');
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed?.birth ?? '';
    } catch {
      return '';
    }
  });

  const idx = useMemo(() => {
    const seed = Number((birth || '19900101').slice(-2));
    return seed % TITLES.length;
  }, [birth]);

  const deleteBirth = () => {
    if (typeof window !== 'undefined') window.localStorage.removeItem('muun_user_birth');
    trackCustomEvent('birth_delete', { entry: 'home_html_refresh' });
    onDeleteBirth();
  };

  return (
    <section className="mu-home-hero" aria-labelledby="home-hero-title">
      <div className="mu-home-hero__sky" aria-hidden="true">
        <div className="mu-home-hero__moon" />
        <div className="mu-home-hero__cloud mu-home-hero__cloud--one" />
        <div className="mu-home-hero__cloud mu-home-hero__cloud--two" />
      </div>
      <div className="mu-home-hero__content">
        <p className="mu-home-hero__eyebrow">저장된 정보로 이어보기</p>
        <h1 id="home-hero-title" className="mu-home-hero__title">오늘도 좋은 기운으로<br />빛나는 하루 되세요</h1>
        <p className="mu-home-hero__desc">저장된 생년월일로 평생사주와 오늘의 흐름을 바로 이어서 확인할 수 있어요.</p>

        <div className="mu-hero-saved-pill-row">
          <span className="mu-hero-saved-pill"><CalendarDays size={14} /> {formatBirthLabel(birth)}</span>
          <button type="button" className="mu-hero-saved-pill is-ghost" onClick={deleteBirth}>
            <Trash2 size={14} /> 삭제
          </button>
        </div>

        <div className="mu-home-hero__cta-row">
          <Link href={`/lifelong-saju?birth=${birth}`} className="mu-home-hero__primary-link">평생사주 보기</Link>
          <Link href="/daily-fortune" className="mu-home-hero__secondary-link">오늘의 운세</Link>
        </div>

        <div className="mu-hero-inline-fortune">
          <div className="mu-hero-inline-fortune__copy">
            <span className="mu-hero-inline-fortune__eyebrow">오늘의 운세</span>
            <h2>{TITLES[idx]}</h2>
            <p>지금 흐름을 먼저 보고, 필요한 서비스로 자연스럽게 이어가세요.</p>
          </div>
          <div className="mu-hero-inline-fortune__score">
            <strong>{SCORE[idx]}</strong>
            <span>점</span>
          </div>
        </div>
      </div>
    </section>
  );
}
