import { Link } from 'wouter';
import { ArrowRight, BookOpen, CalendarDays, Clock3, Heart, Moon, PenLine, Sparkles } from 'lucide-react';

const QUICK_ACTIONS = [
  { href: '/daily-fortune', label: '오늘의 운세', Icon: Sparkles, tone: 'purple' },
  { href: '/lifelong-saju', label: '평생사주', Icon: CalendarDays, tone: 'pink' },
  { href: '/compatibility', label: '궁합', Icon: Heart, tone: 'blue' },
  { href: '/fortune-dictionary', label: '사주사전', Icon: BookOpen, tone: 'mint' },
  { href: '/dream', label: '꿈해몽', Icon: Moon, tone: 'gold' },
] as const;

const FEATURED = [
  {
    href: '/lifelong-saju',
    title: '평생사주',
    desc: '나의 성향과 운명의 흐름을 한눈에 확인해보세요.',
    cta: '내 사주 보기',
    tone: 'lavender',
    emoji: '四柱',
  },
  {
    href: '/compatibility',
    title: '궁합',
    desc: '함께하는 사람과의 조화를 확인해보세요.',
    cta: '궁합 보기',
    tone: 'rose',
    emoji: '♥',
  },
] as const;

const SECONDARY = [
  { href: '/fortune-dictionary', title: '사주사전', desc: '사주 기초부터 용어까지 쉽게 알아보세요.', cta: '바로가기', tone: 'mint', Icon: BookOpen },
  { href: '/dream', title: '꿈해몽', desc: '꿈이 전하는 메시지로 내 마음을 들여다보세요.', cta: '바로가기', tone: 'peach', Icon: Moon },
  { href: '/guide', title: '운세 칼럼', desc: '운세와 삶의 지혜를 함께 나눠요.', cta: '더보기', tone: 'sky', Icon: PenLine },
] as const;

export function ServiceGrid() {
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

      <Link href="/daily-fortune" className="mu-home-today-card">
        <div className="mu-home-today-card__copy">
          <p className="mu-home-today-card__eyebrow"><Clock3 size={14} /> 오늘의 운세</p>
          <h2 id="home-service-title">새로운 시작을 위한<br />좋은 기운이 들어와요.</h2>
          <p>오늘의 흐름을 먼저 확인하고, 필요한 서비스로 이어가세요.</p>
          <span className="mu-home-today-card__cta">자세히 보기 <ArrowRight size={15} /></span>
        </div>
        <div className="mu-home-today-card__side">
          <div className="mu-home-today-card__score">
            <strong>87</strong>
            <span>점</span>
          </div>
          <div className="mu-home-today-card__tag">매우 좋은 운세</div>
        </div>
      </Link>

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
