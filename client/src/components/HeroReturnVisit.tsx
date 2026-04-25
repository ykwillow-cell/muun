import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { CalendarDays, Heart, MoonStar, Sparkles, Trash2 } from 'lucide-react';
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

const SHORTCUTS = [
  { href: '/lifelong-saju', label: '평생사주', desc: '기본 흐름 보기', Icon: Sparkles },
  { href: '/compatibility', label: '궁합', desc: '관계 운 확인', Icon: Heart },
  { href: '/dream', label: '꿈해몽', desc: '꿈 의미 찾기', Icon: MoonStar },
] as const;

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
  const birthStr = birthYear && birthMonth && birthDay ? `${parseInt(birthYear, 10)}년 ${parseInt(birthMonth, 10)}월 ${parseInt(birthDay, 10)}일생` : birthYear ? `${birthYear}년생` : '';

  const handleDeleteConfirm = () => {
    if (typeof window !== 'undefined') window.localStorage.removeItem('muun_user_birth');
    setShowDeleteSheet(false);
    trackCustomEvent('birth_delete', {});
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
    <section className="mu-hero-shell">
      <div className="mu-container-narrow px-4 pb-12 pt-7 sm:pt-8">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="relative z-[1]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mu-kicker">맞춤 분석 이어보기</div>
                <h1 className="mt-4 text-[31px] font-extrabold leading-[1.08] tracking-[-0.06em] text-white sm:text-[39px]">
                  저장된 정보로
                  <br />
                  <span className="text-[#FFF1B8]">프리미엄 리딩 바로 시작</span>
                </h1>
                <p className="mt-4 max-w-[30rem] text-[15px] leading-7 text-white/84 sm:text-base">
                  입력을 다시 하지 않아도 오늘의 운세부터 평생사주까지
                  <br className="hidden sm:block" />
                  원하는 분석 화면으로 즉시 이동할 수 있어요.
                </p>
              </div>

              <button
                className="inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/14 bg-white/10 px-4 text-sm font-bold text-white backdrop-blur"
                onClick={() => setShowDeleteSheet(true)}
              >
                <Trash2 size={15} />
                <span>정보 삭제</span>
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="mu-stat-pill"><CalendarDays size={14} /> {birthStr || '저장된 정보'}</span>
              <span className="mu-stat-pill">개인정보 서버 저장 없음</span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/65">Quick</div>
                <div className="mt-1 text-sm font-semibold text-white">즉시 재진입</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/65">Private</div>
                <div className="mt-1 text-sm font-semibold text-white">로컬 저장 기반</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/65">Flow</div>
                <div className="mt-1 text-sm font-semibold text-white">추천 경로 제공</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {SHORTCUTS.map(({ href, label, desc, Icon }) => (
                <Link
                  key={href}
                  href={`${href}?birth=${birth}`}
                  className="mu-soft-card flex items-center gap-3 border border-white/20 bg-white/95 px-4 py-4 text-slate-900 shadow-[0_16px_30px_rgba(15,23,42,0.12)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6B5FFF]/10 text-[#5648db]">
                    <Icon size={19} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold tracking-[-0.03em] text-slate-900">{label}</div>
                    <div className="mt-1 text-xs text-slate-600">{desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="relative z-[1] rounded-[30px] border border-white/20 bg-white/10 p-3 backdrop-blur-md">
            <div className="rounded-[24px] bg-[linear-gradient(155deg,#151045_0%,#2d1f8c_54%,#4654ca_100%)] p-5 text-white shadow-[0_24px_48px_rgba(15,23,42,0.18)]">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/72">오늘의 운세</div>
                <div className="rounded-full bg-white/14 px-3 py-1 text-xs font-bold text-white">{fortune.score}점</div>
              </div>
              <div className="mt-4 text-[26px] font-extrabold tracking-[-0.05em] text-white">{fortune.title}</div>
              <div className="mt-4 h-2 rounded-full bg-white/12">
                <div className="h-2 rounded-full bg-[#FFF1B8]" style={{ width: `${fortune.score}%` }} />
              </div>
              <p className="mt-4 text-sm leading-7 text-white/82">{fortune.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/daily-fortune" className="inline-flex rounded-full border border-white/12 bg-white/12 px-4 py-2 text-xs font-bold text-white backdrop-blur">
                  오늘의 운세
                </Link>
                <Link href="/yearly-fortune" className="inline-flex rounded-full border border-white/12 bg-white/12 px-4 py-2 text-xs font-bold text-white backdrop-blur">
                  신년운세
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteSheet && (
        <div className="fixed inset-0 z-[70] bg-slate-950/45" onClick={() => setShowDeleteSheet(false)}>
          <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white p-6 shadow-[0_-18px_60px_rgba(15,23,42,0.2)]" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="정보 삭제 확인">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200" />
            <p className="mt-4 text-[22px] font-extrabold tracking-[-0.04em] text-slate-900">저장된 정보를 삭제할까요?</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">삭제하면 첫 화면으로 돌아갑니다.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button className="mu-secondary-btn justify-center" onClick={() => setShowDeleteSheet(false)}>취소</button>
              <button className="mu-primary-btn justify-center" onClick={handleDeleteConfirm}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
