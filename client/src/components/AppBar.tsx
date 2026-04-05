import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Sparkles, BookOpen, MoonStar, Heart, X } from "lucide-react";
import { trackCustomEvent } from "@/lib/ga4";

interface AppBarProps {
  onSearch?: (query: string) => void;
}

const QUICK_LINKS = [
  { href: "/lifelong-saju", label: "평생사주", Icon: Sparkles },
  { href: "/compatibility", label: "궁합", Icon: Heart },
  { href: "/dream", label: "꿈해몽", Icon: MoonStar },
  { href: "/fortune-dictionary", label: "운세 사전", Icon: BookOpen },
] as const;

function resolveSearchDestination(query: string) {
  const normalized = query.replace(/\s+/g, "").toLowerCase();

  const directMap: Array<{ keywords: string[]; href: string }> = [
    { keywords: ["궁합", "연애", "결혼"], href: "/compatibility" },
    { keywords: ["평생사주", "사주풀이", "사주"], href: "/lifelong-saju" },
    { keywords: ["만세력", "팔자"], href: "/manselyeok" },
    { keywords: ["타로", "카드"], href: "/tarot" },
    { keywords: ["점성술", "별자리", "네이탈"], href: "/astrology" },
    { keywords: ["작명", "이름"], href: "/naming" },
  ];

  const matched = directMap.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)));
  if (matched) return matched.href;

  if (["꿈", "해몽", "길몽", "흉몽"].some((keyword) => normalized.includes(keyword))) {
    return `/dream?q=${encodeURIComponent(query.trim())}`;
  }

  if (["용어", "사전", "십신", "오행", "천간", "지지", "용신", "대운", "역마", "격국"].some((keyword) => normalized.includes(keyword))) {
    return `/fortune-dictionary?q=${encodeURIComponent(query.trim())}`;
  }

  return `/guide?q=${encodeURIComponent(query.trim())}`;
}

export function AppBar({ onSearch }: AppBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [location, navigate] = useLocation();

  const activeQuickHref = useMemo(() => {
    if (location === "/") return "";
    return QUICK_LINKS.find((item) => location === item.href || location.startsWith(`${item.href}/`))?.href || "";
  }, [location]);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchToggle = () => {
    const next = !searchOpen;
    setSearchOpen(next);
    if (!next) setSearchQuery("");
    trackCustomEvent("appbar_search_toggle", { open: next });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    onSearch?.(query);
    const destination = resolveSearchDestination(query);
    trackCustomEvent("appbar_search_submit", { query, destination });
    navigate(destination);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="mu-appbar" style={{ paddingTop: "var(--safe-area-top)" }}>
      <div className="mu-appbar__inner">
        <Link href="/" className="mu-appbar__brand" aria-label="무운 홈">
          <div className="mu-appbar__brand-mark" aria-hidden="true">
            <span>무</span>
            <span>운</span>
          </div>
          <div className="mu-appbar__brand-copy">
            <span className="mu-appbar__brand-name">무운</span>
            <span className="mu-appbar__brand-sub">무료 사주 · 운세 아카이브</span>
          </div>
        </Link>

        <button
          className="mu-appbar__icon-btn"
          onClick={handleSearchToggle}
          aria-label={searchOpen ? "검색 닫기" : "검색 열기"}
          aria-expanded={searchOpen}
        >
          {searchOpen ? <X size={18} strokeWidth={1.9} /> : <Search size={18} strokeWidth={1.9} />}
        </button>
      </div>

      <div className={`mu-appbar__search-wrap ${searchOpen ? "mu-appbar__search-wrap--open" : ""}`} aria-hidden={!searchOpen}>
        <form onSubmit={handleSearchSubmit} className="mu-appbar__search-form">
          <Search size={15} className="mu-appbar__search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            className="mu-appbar__search-input"
            placeholder="서비스·운세 용어·칼럼 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            tabIndex={searchOpen ? 0 : -1}
          />
          {searchQuery && (
            <button type="button" className="mu-appbar__search-clear" onClick={() => setSearchQuery("")} aria-label="검색어 지우기">
              <X size={13} />
            </button>
          )}
        </form>
      </div>

      <div className="mu-appbar__quick-row no-scrollbar" aria-label="빠른 이동">
        {QUICK_LINKS.map(({ href, label, Icon }) => {
          const active = activeQuickHref === href;
          return (
            <Link key={href} href={href} className={`mu-appbar__quick-link ${active ? "mu-appbar__quick-link--active" : ""}`}>
              <Icon size={14} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      <style>{`
        .mu-appbar {
          position: sticky;
          top: 0;
          z-index: 60;
          backdrop-filter: blur(16px);
          background: rgba(255,255,255,0.88);
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
        }
        .mu-appbar__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          padding: 0 16px;
        }
        .mu-appbar__brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          min-width: 0;
        }
        .mu-appbar__brand-mark {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          background: linear-gradient(145deg, #ffffff 0%, #efeaff 100%);
          border: 1px solid rgba(107,95,255,0.16);
          display: grid;
          place-items: center;
          box-shadow: 0 8px 18px rgba(107,95,255,0.12);
          color: #5748db;
          font-weight: 800;
          font-size: 13px;
          line-height: 1;
        }
        .mu-appbar__brand-mark span:first-child { color: #111827; margin-right: 1px; }
        .mu-appbar__brand-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .mu-appbar__brand-name {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #111827;
          line-height: 1.1;
        }
        .mu-appbar__brand-sub {
          font-size: 11px;
          color: #6b7280;
          line-height: 1.2;
          margin-top: 2px;
        }
        .mu-appbar__icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: rgba(255,255,255,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4b5563;
          transition: all 0.18s ease;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
        }
        .mu-appbar__icon-btn:hover {
          color: #111827;
          border-color: rgba(107,95,255,0.18);
          background: rgba(107,95,255,0.05);
        }
        .mu-appbar__search-wrap {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.22s ease, opacity 0.18s ease;
        }
        .mu-appbar__search-wrap--open {
          max-height: 84px;
          opacity: 1;
        }
        .mu-appbar__search-form {
          position: relative;
          padding: 0 16px 12px;
          display: flex;
          align-items: center;
        }
        .mu-appbar__search-icon {
          position: absolute;
          left: 30px;
          color: #9ca3af;
        }
        .mu-appbar__search-input {
          width: 100%;
          height: 46px;
          padding: 0 44px 0 40px;
          border-radius: 16px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: rgba(255,255,255,0.96);
          color: #111827;
          font-size: 14px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 10px 24px rgba(15, 23, 42, 0.05);
        }
        .mu-appbar__search-input:focus {
          outline: none;
          border-color: rgba(107,95,255,0.4);
          box-shadow: 0 0 0 4px rgba(107,95,255,0.12);
        }
        .mu-appbar__search-clear {
          position: absolute;
          right: 26px;
          border: none;
          background: transparent;
          color: #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mu-appbar__quick-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 0 16px 12px;
        }
        .mu-appbar__quick-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          min-height: 34px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: rgba(255,255,255,0.95);
          color: #4b5563;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
        }
        .mu-appbar__quick-link--active {
          background: rgba(107,95,255,0.1);
          color: #5142da;
          border-color: rgba(107,95,255,0.2);
        }
      `}</style>
    </header>
  );
}
