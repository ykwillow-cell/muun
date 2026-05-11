import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { CalendarDays, Trash2, UtensilsCrossed } from 'lucide-react';
import { trackCustomEvent } from '@/lib/ga4';

const LUNCH_MENUS = [
  { menu: '된장찌개 정식', reason: '오늘은 마음을 안정시키는 음식이 잘 맞아요. 구수하고 깊은 된장의 기운이 하루를 편안하게 해줄 거예요.' },
  { menu: '비빔밥', reason: '여러 재료가 조화를 이루는 비빔밥처럼, 오늘은 다양한 흐름을 한데 모아 정리하기 좋은 날이에요.' },
  { menu: '순두부찌개', reason: '부드럽고 따뜻한 음식이 오늘의 기운과 잘 맞아요. 몸과 마음을 편안하게 해줄 거예요.' },
  { menu: '삼겹살 구이', reason: '오늘은 든든하게 먹어두면 오후 에너지가 살아나요. 기운을 채워줄 음식이 필요한 날이에요.' },
  { menu: '칼국수', reason: '오늘은 따뜻하고 소박한 한 끼가 정답이에요. 긴 면처럼 좋은 흐름이 이어질 거예요.' },
  { menu: '제육볶음 정식', reason: '활기찬 에너지가 필요한 날이에요. 매콤하고 감칠맛 나는 제육볶음이 오후 집중력을 높여줄 거예요.' },
  { menu: '돼지국밥', reason: '오늘은 뭔가 진하고 든든한 한 끼가 좋아요. 국밥 한 그릇으로 하루의 중심을 잡아보세요.' },
  { menu: '쌀국수', reason: '가볍고 깔끔하게 먹고 싶은 날이에요. 개운한 한 끼가 오후를 상쾌하게 만들어줄 거예요.' },
  { menu: '김치찌개 정식', reason: '오늘은 익숙하고 편안한 음식이 최고예요. 집밥 같은 한 끼가 마음에도 위안이 돼요.' },
  { menu: '초밥 세트', reason: '섬세한 맛을 즐기는 여유가 오늘의 기운과 잘 맞아요. 천천히 음미하며 먹는 한 끼를 추천해요.' },
  { menu: '닭갈비', reason: '활기차고 재미있는 에너지가 필요한 날이에요. 매콤한 닭갈비가 오늘의 활력소가 될 거예요.' },
  { menu: '파스타', reason: '창의적인 흐름이 좋은 날이에요. 색다른 맛의 파스타 한 접시로 기분 전환을 해보세요.' },
  { menu: '설렁탕', reason: '오늘은 조용히 에너지를 채우는 날이에요. 담백하고 깊은 국물이 속을 든든하게 채워줄 거예요.' },
  { menu: '회덮밥', reason: '상쾌하고 맑은 기운이 필요한 날이에요. 신선한 회덮밥 한 그릇이 오후 집중력을 끌어올려 줄 거예요.' },
  { menu: '탕수육 정식', reason: '오늘은 달달하고 바삭한 맛이 기분을 업시켜줄 거예요. 소소한 즐거움을 더해줄 한 끼예요.' },
] as const;

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getLunchRecommendation(birth: string) {
  const today = new Date();
  const dateSeed = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  const seed = parseInt((birth || '19900101') + dateSeed, 10) % 99999;
  const idx = Math.floor(seededRandom(seed + 3) * LUNCH_MENUS.length);
  return LUNCH_MENUS[idx];
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

  const lunch = getLunchRecommendation(birth || '19900101');

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
        <p className="mu-home-hero__eyebrow">다시 돌아오셨군요</p>
        <h1 id="home-hero-return-title" className="mu-home-hero__title">오늘의 운세를<br />확인하고 하루를 시작해보세요</h1>
        <p className="mu-home-hero__desc">지난번에 입력한 생년월일로 오늘의 운세와 평생사주를 바로 이어볼 수 있어요.</p>

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
              <span className="mu-home-return-card__fortune-label"><UtensilsCrossed size={13} /> 오늘의 점심 추천</span>
              <h2>{lunch.menu}</h2>
              <p>{lunch.reason}</p>
            </div>
            <Link href="/lucky-lunch" className="mu-home-return-card__lunch-btn">메뉴 더보기</Link>
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
