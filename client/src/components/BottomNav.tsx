import { Home, Sparkles, Heart, BookOpen, Grid3x3 } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const NAV_ITEMS = [
  { href: '/', label: '홈', Icon: Home },
  { href: '/lifelong-saju', label: '사주', Icon: Sparkles },
  { href: '/compatibility', label: '궁합', Icon: Heart },
  { href: '/guide', label: '콘텐츠', Icon: BookOpen },
  { href: '/more', label: '전체', Icon: Grid3x3 },
] as const;

export function BottomNav() {
  const [location] = useLocation();

  if (location === '/') return null;

  const isDictionaryPage =
    location === '/fortune-dictionary' ||
    location.startsWith('/fortune-dictionary/') ||
    location.startsWith('/dictionary/') ||
    location.startsWith('/dream/') ||
    location === '/dream';

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    if (href === '/more' && isDictionaryPage) return true;
    return location === href || location.startsWith(`${href}/`);
  };

  return (
    <>
      <div className="mu-bottom-nav__spacer" aria-hidden="true" />
      <nav className="mu-bottom-nav" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} aria-label="하단 내비게이션">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`mu-bottom-nav__tab${active ? ' mu-bottom-nav__tab--active' : ''}`}
              aria-current={active ? 'page' : undefined}
              aria-label={label}
            >
              <span className="mu-bottom-nav__icon-wrap">
                <Icon size={20} strokeWidth={active ? 2.1 : 1.85} className="mu-bottom-nav__icon" />
              </span>
              <span className="mu-bottom-nav__label">{label}</span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        .mu-bottom-nav__spacer {
          height: calc(var(--bottom-nav-height) + 26px + env(safe-area-inset-bottom, 0px));
        }
        .mu-bottom-nav {
          position: fixed;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: min(520px, calc(100vw - 20px));
          z-index: 55;
          display: flex;
          align-items: stretch;
          padding-top: 8px;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 24px;
          box-shadow: 0 20px 46px rgba(15,23,42,0.12);
        }
        .mu-bottom-nav__tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 4px 10px;
          min-height: 60px;
          text-decoration: none;
          color: #94a3b8;
        }
        .mu-bottom-nav__tab--active {
          color: #5648db;
        }
        .mu-bottom-nav__icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mu-bottom-nav__tab--active .mu-bottom-nav__icon-wrap {
          background: linear-gradient(135deg, rgba(107,95,255,0.14) 0%, rgba(96,200,212,0.14) 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
        }
        .mu-bottom-nav__label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1;
          white-space: nowrap;
        }
        @media (min-width: 480px) {
          .mu-bottom-nav,
          .mu-bottom-nav__spacer {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
