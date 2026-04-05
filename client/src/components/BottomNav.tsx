import { Link, useLocation } from "wouter";
import { Home, Sparkles, Heart, BookOpen, Grid3x3 } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "홈", Icon: Home },
  { href: "/lifelong-saju", label: "평생사주", Icon: Sparkles },
  { href: "/compatibility", label: "궁합", Icon: Heart },
  { href: "/guide", label: "칼럼", Icon: BookOpen },
  { href: "/more", label: "전체", Icon: Grid3x3 },
] as const;

export function BottomNav() {
  const [location] = useLocation();

  const isDictionaryPage =
    location === "/fortune-dictionary" ||
    location.startsWith("/fortune-dictionary/") ||
    location.startsWith("/dictionary/") ||
    location.startsWith("/dream/") ||
    location === "/dream";

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    if (href === "/more" && isDictionaryPage) return true;
    return location === href || location.startsWith(`${href}/`);
  };

  return (
    <>
      <div style={{ height: "var(--bottom-nav-height)" }} aria-hidden="true" />

      <nav className="mu-bottom-nav" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }} aria-label="하단 내비게이션">
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
              <span className="mu-bottom-nav__icon-wrap">
                <Icon size={21} strokeWidth={active ? 2.15 : 1.8} className="mu-bottom-nav__icon" />
              </span>
              <span className="mu-bottom-nav__label">{label}</span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        .mu-bottom-nav {
          position: fixed;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 16px);
          max-width: calc(var(--mu-content-max-width) - 16px);
          z-index: 55;
          display: flex;
          align-items: stretch;
          padding-top: 8px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
        }
        .mu-bottom-nav__tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 4px 10px;
          min-height: 58px;
          text-decoration: none;
          color: #94a3b8;
          transition: color 0.18s ease, transform 0.18s ease;
        }
        .mu-bottom-nav__tab--active {
          color: #5648db;
        }
        .mu-bottom-nav__icon-wrap {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }
        .mu-bottom-nav__tab--active .mu-bottom-nav__icon-wrap {
          background: rgba(107,95,255,0.12);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
          transform: translateY(-1px);
        }
        .mu-bottom-nav__label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}
