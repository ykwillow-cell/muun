import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { CalendarDays, Check, Lock, Sparkles, Star, Trash2 } from 'lucide-react';
import { trackCustomEvent } from '@/lib/ga4';

const FORTUNE_TITLES = ['재물운이 열리는 날', '귀인을 만나는 날', '집중력이 높아지는 날', '변화의 기운이 오는 날', '안정이 찾아오는 날', '창의력이 빛나는 날'];
const FORTUNE_DESCS = [
  '막혔던 흐름이 풀리는 시기예요. 중요한 일은 오전에 가볍게 시작해 보세요.',
  '뜻밖의 도움이 찾아옵니다. 주변의 제안을 한 번 더 살펴보세요.',
  '집중력이 살아나는 흐름이라 중요한 일을 정리하기 좋습니다.',
  '새로운 방향을 시도해 볼 만한 하루예요. 작은 변화가 기회가 됩니다.',
  '무리하지 말고 현재에 집중할수록 흐름이 안정됩니다.',
  '좋은 아이디어가 떠오를 수 있는 날입니다. 기록을 남겨 보세요.',
];

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getDailyFortune(birth: string) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  const seed = parseInt(birth.replace(/\D/g, '').slice(0, 8) + dateStr, 10) % 99999;
  const r1 = seededRandom(seed);
  const r2 = seededRandom(seed + 7);
  const score = Math.floor(r1 * 38) + 58;
  const titleIdx = Math.floor(r2 * FORTUNE_TITLES.length);
  return { score, title: FORTUNE_TITLES[titleIdx], desc: FORTUNE_DESCS[titleIdx] };
}

interface HeroReturnVisitProps {
  onDeleteBirth: () => void;
}

export function HeroReturnVisit({ onDeleteBirth }: HeroReturnVisitProps) {
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [birth] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      const rawData = window.localStorage.getItem('muun_user_birth');
      const userData = rawData ? JSON.parse(rawData) : null;
      return userData?.birth ?? '';
    } catch {
      return '';
    }
  });

  const fortune = getDailyFortune(birth || '19900101');
  const birthYear = birth.slice(0, 4);
  const birthMonth = birth.slice(4, 6);
  const birthDay = birth.slice(6, 8);
  const birthStr = birthYear && birthMonth && birthDay ? `${parseInt(birthYear, 10)}년 ${parseInt(birthMonth, 10)}월 ${parseInt(birthDay, 10)}일생` : birthYear ? `${birthYear}년생` : '저장된 정보';

  const handleDeleteConfirm = () => {
    if (typeof window !== 'undefined') window.localStorage.removeItem('muun_user_birth');
    setShowDeleteSheet(false);
    trackCustomEvent('birth_delete', { entry: 'home_mobile_redesign' });
    onDeleteBirth();
  };

  useEffect(() => {
    if (!showDeleteSheet) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [showDeleteSheet]);

  return (
    <section className="muun-hero" aria-labelledby="home-hero-return-title">
      <div className="muun-hero__inner">
        <div className="muun-trust-row" aria-label="서비스 특징">
          <span className="muun-trust-pill"><Check size={11} aria-hidden="true" />회원가입 없음</span>
          <span className="muun-trust-pill"><Lock size={11} aria-hidden="true" />서버 저장 안 함</span>
          <span className="muun-trust-pill"><Star size={11} aria-hidden="true" />100% 무료</span>
        </div>

        <h1 id="home-hero-return-title" className="muun-hero__title">
          저장된 정보로 바로<br />오늘 운세 보기
        </h1>
        <p className="muun-hero__sub">평생사주와 오늘의 운세로 바로 이어집니다.</p>

        <div className="muun-input-card muun-return-card">
          <div className="muun-return-card__head">
            <div>
              <p className="muun-card-label">저장된 생년월일</p>
              <p className="muun-return-card__birth"><CalendarDays size={15} aria-hidden="true" />{birthStr}</p>
            </div>
            <button type="button" className="muun-delete-btn" onClick={() => setShowDeleteSheet(true)} aria-label="저장된 정보 삭제">
              <Trash2 size={15} />
            </button>
          </div>

          <div className="muun-daily-mini">
            <div className="muun-daily-mini__top">
              <span>오늘의 운세</span>
              <strong>{fortune.score}점</strong>
            </div>
            <p className="muun-daily-mini__title">{fortune.title}</p>
            <div className="muun-daily-mini__bar"><span style={{ width: `${fortune.score}%` }} /></div>
            <p className="muun-daily-mini__desc">{fortune.desc}</p>
          </div>

          <div className="muun-return-actions">
            <Link href={`/lifelong-saju?birth=${birth}`} className="muun-hero-cta muun-hero-cta--link"><Sparkles size={15} />평생사주 보기</Link>
            <Link href="/daily-fortune" className="muun-secondary-cta">오늘운세</Link>
          </div>
        </div>
      </div>

      {showDeleteSheet && (
        <div className="muun-sheet" onClick={() => setShowDeleteSheet(false)}>
          <div className="muun-sheet__panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="정보 삭제 확인">
            <div className="muun-sheet__handle" />
            <p className="muun-sheet__title">저장된 정보를 삭제할까요?</p>
            <p className="muun-sheet__desc">삭제하면 첫 화면으로 돌아갑니다.</p>
            <div className="muun-sheet__actions">
              <button className="muun-secondary-cta" onClick={() => setShowDeleteSheet(false)}>취소</button>
              <button className="muun-hero-cta" onClick={handleDeleteConfirm}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
