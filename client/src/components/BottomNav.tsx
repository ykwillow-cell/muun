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
      {/* 하단 여백 확보 (콘텐츠가 BottomNav에 가리지 않도록) */}
      <div style={{ height: "var(--bottom-nav-height)" }} aria-hidden="true" />

      <nav
        className="mu-bottom-nav"
        style={{ paddingBottom: "var(--safe-area-bottom)" }}
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
              <span className="mu-bottom-nav__pill" aria-hidden="true" />
              <Icon
                size={22}
                strokeWidth={active ? 2 : 1.5}
                className="mu-bottom-nav__icon"
              />
              <span className="mu-bottom-nav__label">{label}</span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        .mu-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          align-items: stretch;
          background: var(--background);
          border-top: 0.5px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          height: var(--bottom-nav-height);
        }
        .mu-bottom-nav__tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 8px 4px 4px;
          min-height: 56px;
          position: relative;
          text-decoration: none;
          color: rgba(255,255,255,0.35);
          transition: color 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-bottom-nav__tab:hover {
          color: rgba(255,255,255,0.6);
        }
        .mu-bottom-nav__tab--active {
          color: oklch(0.85 0.18 85);
        }
        /* 활성 탭 pill 배경 */
        .mu-bottom-nav__pill {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 56px;
          height: 28px;
          border-radius: 100px;
          background: transparent;
          transition: background 0.15s;
          pointer-events: none;
        }
        .mu-bottom-nav__tab--active .mu-bottom-nav__pill {
          background: oklch(0.85 0.18 85 / 0.12);
        }
        .mu-bottom-nav__icon {
          position: relative;
          z-index: 1;
          transition: transform 0.15s;
        }
        .mu-bottom-nav__tab--active .mu-bottom-nav__icon {
          transform: scale(1.05);
        }
        .mu-bottom-nav__label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: -0.01em;
          white-space: nowrap;
          line-height: 1;
        }
      `}</style>
    </>
  );
}
