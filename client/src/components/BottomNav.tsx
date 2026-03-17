import { Link, useLocation } from "wouter";
import { Home, Sparkles, Heart, BookOpen, Grid3x3 } from "lucide-react";

const NAV_ITEMS = [
  { href: "/",               label: "홈",       Icon: Home },
  { href: "/lifelong-saju",  label: "평생사주",  Icon: Sparkles },
  { href: "/compatibility",  label: "궁합",      Icon: Heart },
  { href: "/guide",          label: "운세칼럼",  Icon: BookOpen },
  { href: "/more",           label: "전체메뉴",  Icon: Grid3x3 },
] as const;

export function BottomNav() {
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <>
      {/* 하단 여백 확보 */}
      <div style={{ height: "var(--bottom-nav-height)" }} aria-hidden="true" />

      <nav
        className="mu-bottom-nav"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="하단 내비게이션"
      >
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`mu-bottom-nav__tab${active ? " mu-bottom-nav__tab--active" : ""}`}
              aria-current={active ? "page" : undefined}
              aria-label={label}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.6}
                className="mu-bottom-nav__icon"
              />
              <span className="mu-bottom-nav__label">{label}</span>
              {active && <span className="mu-bottom-nav__dot" aria-hidden="true" />}
            </Link>
          );
        })}
      </nav>

      <style>{`
        /* ── Bottom Nav ── */
        .mu-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: var(--mu-content-max-width);
          z-index: 50;
          display: flex;
          align-items: stretch;
          background: #ffffff;
          border-top: 1px solid #e8ebed;
          height: var(--bottom-nav-height);
        }

        /* ── 탭 ── */
        .mu-bottom-nav__tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 8px 4px 6px;
          min-height: 56px;
          position: relative;
          text-decoration: none;
          color: #c5ccd4;
          transition: color 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-bottom-nav__tab:hover {
          color: #8b95a1;
        }
        .mu-bottom-nav__tab--active {
          color: #6B5FFF;
        }

        /* ── 아이콘 ── */
        .mu-bottom-nav__icon {
          transition: transform 0.15s;
        }
        .mu-bottom-nav__tab--active .mu-bottom-nav__icon {
          transform: scale(1.05);
        }

        /* ── 레이블 ── */
        .mu-bottom-nav__label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: -0.01em;
          white-space: nowrap;
          line-height: 1;
        }

        /* ── 활성 탭 dot 인디케이터 ── */
        .mu-bottom-nav__dot {
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #6B5FFF;
        }
      `}</style>
    </>
  );
}
