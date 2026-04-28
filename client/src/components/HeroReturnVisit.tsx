import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { CalendarDays, Trash2 } from 'lucide-react';
import { trackCustomEvent } from '@/lib/ga4';

const TITLES = ['차분하게 흐름을 살피기 좋은 날', '작은 선택이 운을 키우는 날', '주변의 도움을 받기 좋은 날', '새로운 시작에 힘이 실리는 날'];
const DESCS = [
  '오늘은 급하게 결론 내리기보다, 차근차근 확인하는 태도가 좋은 결과로 이어집니다.',
  '작은 루틴과 준비가 하루 전체의 안정감을 만들어주는 흐름이에요.',
  '대화와 제안 속에서 생각보다 좋은 기회를 발견할 수 있습니다.',
  '마음을 가볍게 하고 시작하면 성과와 자신감이 함께 따라와요.',
];

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getDailyFortune(birth: string) {
  const today = new Date();
  const dateSeed = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  const seed = parseInt((birth || '19900101') + dateSeed, 10) % 99999;
  const r1 = seededRandom(seed);
  const r2 = seededRandom(seed + 9);
  const score = Math.floor(r1 * 22) + 72;
  const idx = Math.floor(r2 * TITLES.length);
  return { score, title: TITLES[idx], desc: DESCS[idx] };
}

interface HeroReturnVisitProps {
  onDeleteBirth: () => void;
}

export function HeroReturnVisit({ onDeleteBirth }: HeroReturnVisitProps) {
  const [showDelete, setShowDelete] = useState(false);
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

  const birthLabel = useMemo(() => {
    const y = birth.slice(0, 4);
    const m = birth.slice(4, 6);
    const d = birth.slice(6, 8);
    return y && m && d ? `${parseInt(y, 10)}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일생` : '저장된 생년월일';
  }, [birth]);

  const fortune = getDailyFortune(birth || '19900101');

  useEffect(() => {
    if (!showDelete) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [showDelete]);

  const handleDelete = () => {
    if (typeof window !== 'undefined') window.localStorage.removeItem('muun_user_birth');
    trackCustomEvent('birth_delete', { entry: 'home_pastel_design' });
    setShowDelete(false);
    onDeleteBirth();
  };

  return (
    <section className="mu-home-hero" aria-labelledby="home-hero-return-title">
      <div className="mu-home-hero__sky" aria-hidden="true">
        <div className="mu-home-hero__moon" />
        <div className="mu-home-hero__cloud mu-home-hero__cloud--one" />
        <div className="mu-home-hero__cloud mu-home-hero__cloud--two" />
      </div>
      <div className="mu-home-hero__content">
        <p className="mu-home-hero__eyebrow">저장된 정보로 이어보기</p>
        <h1 id="home-hero-return-title" className="mu-home-hero__title">오늘도 좋은 기운으로<br />빛나는 하루 되세요</h1>
        <p className="mu-home-hero__desc">저장된 생년월일로 오늘의 흐름과 평생사주를 바로 확인할 수 있어요.</p>

        <div className="mu-home-return-card">
          <div className="mu-home-return-card__top">
            <div>
              <span className="mu-home-return-card__label">저장된 정보</span>
              <strong className="mu-home-return-card__birth"><CalendarDays size={16} /> {birthLabel}</strong>
            </div>
            <button type="button" className="mu-home-return-card__trash" onClick={() => setShowDelete(true)} aria-label="저장된 정보 삭제">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="mu-home-return-card__fortune">
            <div>
              <span className="mu-home-return-card__fortune-label">오늘의 운세</span>
              <h2>{fortune.title}</h2>
              <p>{fortune.desc}</p>
            </div>
            <div className="mu-home-return-card__score">
              <strong>{fortune.score}</strong>
              <span>점</span>
            </div>
          </div>
          <div className="mu-home-return-card__actions">
            <Link href={`/lifelong-saju?birth=${birth}`} className="mu-home-return-card__primary">평생사주 보기</Link>
            <Link href="/daily-fortune" className="mu-home-return-card__secondary">오늘의 운세</Link>
          </div>
        </div>
      </div>

      {showDelete ? (
        <div className="mu-soft-sheet" onClick={() => setShowDelete(false)}>
          <div className="mu-soft-sheet__panel" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <div className="mu-soft-sheet__handle" />
            <h2 className="mu-soft-sheet__title">저장된 정보를 삭제할까요?</h2>
            <p className="mu-soft-sheet__desc">삭제하면 첫 화면 입력 상태로 돌아갑니다.</p>
            <div className="mu-soft-sheet__actions">
              <button type="button" className="mu-soft-sheet__secondary" onClick={() => setShowDelete(false)}>취소</button>
              <button type="button" className="mu-soft-sheet__primary" onClick={handleDelete}>삭제하기</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
