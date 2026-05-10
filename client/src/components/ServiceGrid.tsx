import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, BookOpen, BookMarked, CalendarDays, Clock3, Compass, Heart, Layers, Moon, PenLine, ScrollText, Sparkles, Star, Brain } from 'lucide-react';

const QUICK_ACTIONS = [
  { href: '/daily-fortune',      label: '오늘의 운세', Icon: Sparkles,    tone: 'purple' },
  { href: '/yearly-fortune',     label: '신년운세',    Icon: Star,         tone: 'orange' },
  { href: '/lifelong-saju',      label: '평생사주',    Icon: CalendarDays, tone: 'pink'   },
  { href: '/compatibility',      label: '궁합',        Icon: Heart,        tone: 'blue'   },
  { href: '/manselyeok',         label: '만세력',      Icon: Compass,      tone: 'teal'   },
  { href: '/dream',              label: '꿈해몽',      Icon: Moon,         tone: 'gold'   },
  { href: '/fortune-dictionary', label: '사주사전',    Icon: BookOpen,     tone: 'mint'   },
  { href: '/tarot',              label: '타로',        Icon: Layers,       tone: 'rose'   },
  { href: '/tojeong',            label: '토정비결',    Icon: ScrollText,   tone: 'amber'  },
  { href: '/psychology',         label: '심리테스트',  Icon: Brain,        tone: 'sky'    },
] as const;

const FEATURED = [
  {
    href: '/lifelong-saju',
    title: '평생사주',
    desc: '타고난 기질, 재물운, 직업운을 한번에 확인해보세요.',
    cta: '내 사주 보기',
    tone: 'lavender',
    emoji: '四柱',
  },
  {
    href: '/compatibility',
    title: '궁합',
    desc: '두 사람의 사주로 보는 연애·결혼 궁합 분석이에요.',
    cta: '궁합 보기',
    tone: 'rose',
    emoji: '♥',
  },
] as const;

const SECONDARY = [
  { href: '/fortune-dictionary', title: '사주사전', desc: '사주 명리학 용어를 쉽고 빠르게 찾아볼 수 있어요.', cta: '바로가기', tone: 'mint', Icon: BookOpen },
  { href: '/dream', title: '꿈해몽', desc: '어젯밤 꿈의 의미가 궁금하다면 여기서 확인해보세요.', cta: '바로가기', tone: 'peach', Icon: Moon },
  { href: '/guide', title: '운세 칼럼', desc: '사주·운세에 관한 깊이 있는 칼럼을 읽어보세요.', cta: '더보기', tone: 'sky', Icon: PenLine },
] as const;

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

export function ServiceGrid() {
  const [birth, setBirth] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('muun_user_birth');
      const parsed = raw ? JSON.parse(raw) : null;
      setBirth(parsed?.birth ?? null);
    } catch {
      setBirth(null);
    }
  }, []);
  return (
    <section className="mu-home-services" aria-labelledby="home-service-title">
      <div className="mu-home-service-strip" role="list" aria-label="주요 서비스 바로가기">
        {QUICK_ACTIONS.map(({ href, label, Icon, tone }) => (
          <Link key={href} href={href} className={`mu-home-service-chip is-${tone}`} role="listitem">
            <span className="mu-home-service-chip__icon"><Icon size={18} /></span>
            <span>{label}</span>
          </Link>
        ))}
      </div>

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
