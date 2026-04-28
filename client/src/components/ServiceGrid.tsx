import { Link } from 'wouter';
import { ArrowRight, BookOpen, CalendarDays, Heart, Moon, Sparkles } from 'lucide-react';

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
    art: 'scroll',
  },
  {
    href: '/compatibility',
    title: '궁합',
    desc: '함께하는 사람과의 조화를 확인해보세요.',
    cta: '궁합 보기',
    tone: 'rose',
    art: 'pouch',
  },
] as const;

const SECONDARY = [
  { href: '/fortune-dictionary', title: '사주사전', desc: '사주 기초부터 용어까지 쉽게 알아보세요.', cta: '바로가기', tone: 'mint', art: 'book' },
  { href: '/dream', title: '꿈해몽', desc: '꿈이 전하는 메시지로 내 마음을 들여다보세요.', cta: '바로가기', tone: 'peach', art: 'moon' },
  { href: '/guide', title: '운세 칼럼', desc: '운세와 삶의 지혜를 함께 나눠요.', cta: '더보기', tone: 'sky', art: 'feather' },
] as const;

function IllustratedBadge({ art }: { art: string }) {
  if (art === 'scroll') {
    return (
      <svg className="mu-home-illustration" viewBox="0 0 140 120" fill="none" aria-hidden="true">
        <rect x="36" y="18" width="68" height="84" rx="12" fill="#edeafd" stroke="#c8bff5" />
        <rect x="42" y="24" width="56" height="72" rx="10" fill="#f8f6ff" />
        <rect x="28" y="16" width="16" height="88" rx="8" fill="#d3ccfb" />
        <rect x="96" y="16" width="16" height="88" rx="8" fill="#d3ccfb" />
        <text x="70" y="58" textAnchor="middle" fontSize="22" fontWeight="800" fill="#6b5fff" fontFamily="serif">四</text>
        <text x="70" y="82" textAnchor="middle" fontSize="22" fontWeight="800" fill="#6b5fff" fontFamily="serif">柱</text>
        <circle cx="36" cy="98" r="6" fill="#f3bfd0" />
        <circle cx="104" cy="98" r="6" fill="#b8ddb7" />
        <circle cx="115" cy="92" r="8" fill="#f0d38f" opacity=".7" />
      </svg>
    );
  }
  if (art === 'pouch') {
    return (
      <svg className="mu-home-illustration" viewBox="0 0 140 120" fill="none" aria-hidden="true">
        <ellipse cx="50" cy="78" rx="32" ry="28" fill="#ffdbe7" />
        <ellipse cx="92" cy="82" rx="34" ry="30" fill="#d9ccff" />
        <path d="M36 56c0-8 28-8 28 0" stroke="#ef9ebd" strokeWidth="3" strokeLinecap="round" />
        <path d="M76 58c0-8 28-8 28 0" stroke="#b59dff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="80" r="10" fill="#fff" opacity=".75" />
        <circle cx="92" cy="84" r="10" fill="#fff" opacity=".75" />
        <path d="M50 72l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#f178a4" opacity=".9" />
        <path d="M92 76l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#7d6cff" opacity=".9" />
      </svg>
    );
  }
  if (art === 'book') {
    return (
      <svg className="mu-home-illustration" viewBox="0 0 140 120" fill="none" aria-hidden="true">
        <path d="M40 86h64" stroke="#7db9aa" strokeWidth="3" strokeLinecap="round" />
        <path d="M32 48c0-7 6-13 13-13h21c8 0 14 6 14 14v32c-6-4-11-5-18-5H32z" fill="#fff" stroke="#b8ddd2" />
        <path d="M108 48c0-7-6-13-13-13H74c-8 0-14 6-14 14v32c6-4 11-5 18-5h30z" fill="#fff" stroke="#b8ddd2" />
        <path d="M70 42v40" stroke="#b8ddd2" strokeWidth="2" />
        <path d="M104 26c-10 4-15 12-16 24" stroke="#9ad0b9" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 28c7 0 12 4 14 10" stroke="#9ad0b9" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (art === 'moon') {
    return (
      <svg className="mu-home-illustration" viewBox="0 0 140 120" fill="none" aria-hidden="true">
        <ellipse cx="82" cy="78" rx="24" ry="16" fill="#f6e1bf" opacity=".6" />
        <path d="M82 34c-22 0-36 17-36 34 0 19 15 32 33 32 11 0 21-4 28-11-9 1-18-2-25-8-9-7-13-17-13-28 0-7 2-13 6-19-4 0-7 0-9 0z" fill="#f3c880" />
        <path d="M45 90c8-8 18-12 28-12 12 0 22 5 32 14" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity=".9" />
        <circle cx="104" cy="34" r="4" fill="#f0d38f" />
      </svg>
    );
  }
  return (
    <svg className="mu-home-illustration" viewBox="0 0 140 120" fill="none" aria-hidden="true">
      <path d="M36 90c8-20 24-48 48-48 13 0 20 9 20 20 0 12-7 20-16 27" stroke="#8d80ff" strokeWidth="4" strokeLinecap="round" />
      <rect x="76" y="48" width="8" height="32" rx="4" fill="#6b5fff" />
      <path d="M90 42l-18 16 13 6z" fill="#d2ccff" />
      <ellipse cx="98" cy="95" rx="13" ry="10" fill="#1f2445" opacity=".15" />
    </svg>
  );
}

export function ServiceGrid() {
  return (
    <section className="mu-home-services" aria-labelledby="home-service-title">
      <div className="mu-home-service-strip" role="list" aria-label="주요 서비스 바로가기">
        {QUICK_ACTIONS.map(({ href, label, Icon, tone }) => (
          <Link key={href} href={href} className={`mu-home-service-chip is-${tone}`} role="listitem">
            <span className="mu-home-service-chip__icon"><Icon size={20} /></span>
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <Link href="/daily-fortune" className="mu-home-today-card">
        <div className="mu-home-today-card__copy">
          <div className="mu-home-today-card__meta"><span className="mu-home-today-card__eyebrow">오늘의 운세</span><span className="mu-home-today-card__date">2026.04.26 (일)</span></div>
          <h2 id="home-service-title">새로운 시작을 위한<br />좋은 기운이 들어와요.</h2>
          <p>오늘의 흐름을 먼저 확인하고, 필요한 서비스로 자연스럽게 이어가세요.</p>
          <span className="mu-home-today-card__cta">자세히 보기 <ArrowRight size={15} /></span>
        </div>
        <div className="mu-home-today-card__side">
          <div className="mu-home-today-card__score"><strong>87</strong><span>점</span></div>
          <div className="mu-home-today-card__tag">매우 좋은 운세</div>
        </div>
        <div className="mu-home-today-card__orb" aria-hidden="true" />
      </Link>

      <div className="mu-home-feature-grid">
        {FEATURED.map((item) => (
          <Link key={item.href} href={item.href} className={`mu-home-feature-card is-${item.tone}`}>
            <div className="mu-home-feature-card__text">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span>{item.cta} <ArrowRight size={15} /></span>
            </div>
            <IllustratedBadge art={item.art} />
          </Link>
        ))}
      </div>

      <div className="mu-home-secondary-grid">
        {SECONDARY.map(({ href, title, desc, cta, tone, art }) => (
          <Link key={href} href={href} className={`mu-home-secondary-card is-${tone}`}>
            <div className="mu-home-secondary-card__body">
              <h3>{title}</h3>
              <p>{desc}</p>
              <span>{cta} <ArrowRight size={14} /></span>
            </div>
            <IllustratedBadge art={art} />
          </Link>
        ))}
      </div>
    </section>
  );
}
