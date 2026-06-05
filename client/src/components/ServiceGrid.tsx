import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowRight, BookOpen, CalendarDays, Clock3, Compass,
  Heart, Layers, Moon, PenLine, ScrollText, Sparkles,
  Star, Brain, Briefcase, Home, ChevronRight,
} from 'lucide-react';

// ─── 서비스 칩 ───────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { href: '/daily-fortune',      label: '오늘의 운세', Icon: Sparkles,    tone: 'purple' },
  { href: '/yearly-fortune',     label: '올해운세',    Icon: Star,         tone: 'orange' },
  { href: '/lifelong-saju',      label: '평생사주',    Icon: CalendarDays, tone: 'pink'   },
  { href: '/compatibility',      label: '궁합',        Icon: Heart,        tone: 'blue'   },
  { href: '/career-fortune',     label: '취업·이직운', Icon: Briefcase,    tone: 'teal',  isNew: true },
  { href: '/moving-fortune',     label: '이사운',      Icon: Home,         tone: 'orange', isNew: true },
  { href: '/manselyeok',         label: '만세력',      Icon: Compass,      tone: 'teal'   },
  { href: '/dream',              label: '꿈해몽',      Icon: Moon,         tone: 'gold'   },
  { href: '/fortune-dictionary', label: '사주사전',    Icon: BookOpen,     tone: 'mint'   },
  { href: '/tarot',              label: '타로',        Icon: Layers,       tone: 'rose'   },
  { href: '/tojeong',            label: '토정비결',    Icon: ScrollText,   tone: 'amber'  },
  { href: '/psychology',         label: '심리테스트',  Icon: Brain,        tone: 'sky'    },
] as const;

// ─── 피처드 카드 ─────────────────────────────────────────────────────────────
const FEATURED = [
  { href: '/lifelong-saju', title: '평생사주', desc: '타고난 기질, 재물운, 직업운을 한번에 확인해보세요.', cta: '내 사주 보기', tone: 'lavender', emoji: '四柱' },
  { href: '/compatibility',  title: '궁합',    desc: '두 사람의 사주로 보는 연애·결혼 궁합 분석이에요.', cta: '궁합 보기',   tone: 'rose',     emoji: '♥'    },
] as const;

// ─── 세컨더리 카드 ───────────────────────────────────────────────────────────
const SECONDARY = [
  { href: '/fortune-dictionary', title: '사주사전', desc: '사주 명리학 용어를 쉽고 빠르게 찾아볼 수 있어요.', cta: '바로가기', tone: 'mint',  Icon: BookOpen },
  { href: '/dream',              title: '꿈해몽',   desc: '어젯밤 꿈의 의미가 궁금하다면 여기서 확인해보세요.', cta: '바로가기', tone: 'peach', Icon: Moon     },
  { href: '/guide',              title: '운세 칼럼', desc: '사주·운세에 관한 깊이 있는 칼럼을 읽어보세요.', cta: '더보기', tone: 'sky', Icon: PenLine  },
] as const;

// ─── 신규 서비스 배너 슬라이드 데이터 ────────────────────────────────────────
const NEW_BANNERS = [
  {
    href: '/career-fortune',
    kicker: '신규 · 취업 · 이직',
    title: '취업·이직운',
    desc: '지금 움직여도 될까요? 이직 적기와 잘 맞는 직종을 사주로 확인하세요.',
    Icon: Briefcase,
    bgClass: 'mu-home-new-banner__slide--career',
  },
  {
    href: '/moving-fortune',
    kicker: '신규 · 이사 · 방향',
    title: '이사운',
    desc: '어디로, 언제 이사할까요? 나에게 맞는 방향과 시기를 사주로 알아보세요.',
    Icon: Home,
    bgClass: 'mu-home-new-banner__slide--moving',
  },
] as const;

// ─── 롤링 배너 컴포넌트 ──────────────────────────────────────────────────────
function NewServiceBanner() {
  const [cur, setCur] = useState(0);
  const animatingRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const TOTAL = NEW_BANNERS.length;

  const goSlide = (next: number) => {
    if (animatingRef.current) return;
    const n = ((next % TOTAL) + TOTAL) % TOTAL;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    animatingRef.current = true;

    const slideW = viewport.offsetWidth;
    const current = cur;
    const currentEl = slideRefs.current[current];
    const nextEl = slideRefs.current[n];
    if (!currentEl || !nextEl) { animatingRef.current = false; return; }

    // 다음 슬라이드를 오른쪽에 절대 배치
    track.style.position = 'relative';
    track.style.height = `${currentEl.offsetHeight}px`;
    nextEl.style.position = 'absolute';
    nextEl.style.top = '0';
    nextEl.style.left = `${slideW}px`;
    nextEl.style.width = `${slideW}px`;

    const duration = 400;
    let start: number | null = null;

    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      const offset = ease * slideW;

      currentEl.style.transform = `translateX(-${offset}px)`;
      nextEl.style.transform = `translateX(${slideW - offset}px)`;

      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        // 정리
        currentEl.style.transform = '';
        nextEl.style.transform = '';
        nextEl.style.position = '';
        nextEl.style.top = '';
        nextEl.style.left = '';
        nextEl.style.width = '';
        track.style.position = '';
        track.style.height = '';
        track.style.transform = `translateX(-${n * 100}%)`;

        setCur(n);
        animatingRef.current = false;
      }
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    const id = setInterval(() => goSlide(cur + 1), 4000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur]);

  return (
    <div className="mu-home-new-banner" style={{ marginTop: '16px' }}>
      {/* 슬라이드 영역 */}
      <div className="mu-home-new-banner__viewport" ref={viewportRef}>
        <div className="mu-home-new-banner__track" ref={trackRef}>
          {NEW_BANNERS.map(({ href, kicker, title, desc, Icon, bgClass }, i) => (
            <Link
              key={href}
              href={href}
              ref={(el) => { slideRefs.current[i] = el; }}
              className={`mu-home-new-banner__slide mu-home-new-banner__slide--${bgClass.replace('mu-home-new-banner__slide--', '')}`}
            >
              <div className={`mu-home-new-banner__icon mu-home-new-banner__icon--${bgClass.replace('mu-home-new-banner__slide--', '')}`}>
                <Icon size={22} color="white" />
              </div>
              <div className="mu-home-new-banner__body">
                <p className="mu-home-new-banner__kicker">{kicker}</p>
                <p className="mu-home-new-banner__title">{title}</p>
                <p className="mu-home-new-banner__desc">{desc}</p>
                <span className="mu-home-new-banner__cta">
                  바로가기 <ArrowRight size={12} />
                </span>
              </div>
              <ChevronRight size={18} className="mu-home-new-banner__arrow" />
            </Link>
          ))}
        </div>
      </div>

      {/* 인디케이터 영역 */}
      <div className="mu-home-new-banner__dots" role="tablist" aria-label="배너 페이지">
        {NEW_BANNERS.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === cur}
            aria-label={`${i + 1}번 슬라이드`}
            className={`mu-home-new-banner__dot${i === cur ? ' is-active' : ''}`}
            onClick={() => goSlide(i)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── 점수 헬퍼 ──────────────────────────────────────────────────────────────
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}
function getDailyScore(birth: string): number {
  const today = new Date();
  const dateSeed = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  const seed = parseInt((birth || '19900101') + dateSeed, 10) % 99999;
  return Math.floor(seededRandom(seed) * 22) + 72;
}
function getScoreLabel(score: number): string {
  if (score >= 90) return '최고의 운세';
  if (score >= 80) return '매우 좋은 운세';
  if (score >= 70) return '좋은 운세';
  return '보통 운세';
}

// ─── ServiceGrid ─────────────────────────────────────────────────────────────
export function ServiceGrid({ birth }: { birth?: string | null }) {
  return (
    <section className="mu-home-services" aria-labelledby="home-service-title">

      {/* 서비스 칩 바 */}
      <div className="mu-home-service-strip" role="list" aria-label="주요 서비스 바로가기">
        {QUICK_ACTIONS.map(({ href, label, Icon, tone, ...rest }) => {
          const isNew = 'isNew' in rest && rest.isNew;
          return (
            <Link key={href} href={href} className={`mu-home-service-chip is-${tone}${isNew ? ' is-new' : ''}`} role="listitem">
              <span className="mu-home-service-chip__icon"><Icon size={18} color="white" /></span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* 신규 서비스 롤링 배너 */}
      <NewServiceBanner />

      {/* 오늘의 운세 카드 (로그인 유저) */}
      {birth && (() => {
        const score = getDailyScore(birth);
        const label = getScoreLabel(score);
        return (
          <Link href="/daily-fortune" className="mu-home-today-card">
            <div className="mu-home-today-card__copy">
              <p className="mu-home-today-card__eyebrow"><Clock3 size={14} /> 오늘의 운세</p>
              <h2 id="home-service-title">오늘 하루도<br />좋은 기운이 함께해요</h2>
              <p>오늘의 운세를 먼저 확인하고 필요한 서비스로 이어보세요.</p>
              <span className="mu-home-today-card__cta">자세히 보기 <ArrowRight size={15} /></span>
            </div>
            <div className="mu-home-today-card__side">
              <div className="mu-home-today-card__score">
                <strong>{score}<span>점</span></strong>
              </div>
              <div className="mu-home-today-card__tag">{label}</div>
            </div>
          </Link>
        );
      })()}

      {/* 피처드 카드 */}
      <div className="mu-home-feature-grid">
        {FEATURED.map((item) => (
          <Link key={item.href} href={item.href} className={`mu-home-feature-card is-${item.tone}`}>
            <div className="mu-home-feature-card__text">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span>{item.cta} <ArrowRight size={15} /></span>
            </div>
            <div className="mu-home-feature-card__art" aria-hidden="true">{item.emoji}</div>
          </Link>
        ))}
      </div>

      {/* 세컨더리 카드 */}
      <div className="mu-home-secondary-grid">
        {SECONDARY.map(({ href, title, desc, cta, tone, Icon }) => (
          <Link key={href} href={href} className={`mu-home-secondary-card is-${tone}`}>
            <div className="mu-home-secondary-card__icon"><Icon size={22} /></div>
            <h3>{title}</h3>
            <p>{desc}</p>
            <span>{cta} <ArrowRight size={14} /></span>
          </Link>
        ))}
      </div>

    </section>
  );
}
