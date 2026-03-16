import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Search, X, Sparkles } from "lucide-react";
import { trackCustomEvent } from "@/lib/ga4";

interface AppBarProps {
  onSearch?: (query: string) => void;
}

export function AppBar({ onSearch }: AppBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchToggle = () => {
    setSearchOpen((prev) => !prev);
    if (searchOpen) setSearchQuery("");
    trackCustomEvent("appbar_search_toggle", { open: !searchOpen });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
      trackCustomEvent("appbar_search_submit", { query: searchQuery.trim() });
    }
  };

  return (
    <header
      className="mu-appbar"
      style={{ paddingTop: "var(--safe-area-top)" }}
    >
      {/* 메인 바 */}
      <div className="mu-appbar__inner">
        {/* 로고 */}
        <Link href="/" className="mu-appbar__logo" aria-label="무운 홈">
          <span className="mu-appbar__logo-icon" aria-hidden="true">
            <Sparkles size={18} strokeWidth={1.5} />
          </span>
          <span className="mu-appbar__logo-text">
            무운 <em>MuUn</em>
          </span>
        </Link>

        {/* 검색 버튼 */}
        <button
          className="mu-appbar__icon-btn"
          onClick={handleSearchToggle}
          aria-label={searchOpen ? "검색 닫기" : "검색 열기"}
          aria-expanded={searchOpen}
        >
          {searchOpen ? <X size={18} strokeWidth={1.5} /> : <Search size={18} strokeWidth={1.5} />}
        </button>
      </div>

      {/* 검색 확장 영역 — 슬라이드 다운 */}
      <div
        className={`mu-appbar__search-wrap ${searchOpen ? "mu-appbar__search-wrap--open" : ""}`}
        aria-hidden={!searchOpen}
      >
        <form onSubmit={handleSearchSubmit} className="mu-appbar__search-form">
          <Search size={15} className="mu-appbar__search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            className="mu-appbar__search-input"
            placeholder="서비스, 운세 용어 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            tabIndex={searchOpen ? 0 : -1}
          />
          {searchQuery && (
            <button
              type="button"
              className="mu-appbar__search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="검색어 지우기"
            >
              <X size={13} />
            </button>
          )}
        </form>
      </div>

      <style>{`
        .mu-appbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--background);
          border-bottom: 0.5px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .mu-appbar__inner {
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
        }
        .mu-appbar__logo {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }
        .mu-appbar__logo-icon {
          color: oklch(0.85 0.18 85);
          display: flex;
          align-items: center;
        }
        .mu-appbar__logo-text {
          font-size: 17px;
          font-weight: 600;
          color: white;
          letter-spacing: -0.01em;
        }
        .mu-appbar__logo-text em {
          font-style: normal;
          font-size: 11px;
          font-weight: 400;
          color: rgba(255,255,255,0.35);
          margin-left: 4px;
        }
        .mu-appbar__icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.6);
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
        }
        .mu-appbar__icon-btn:hover {
          background: rgba(255,255,255,0.10);
          color: white;
        }
        /* 검색 확장 */
        .mu-appbar__search-wrap {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.22s cubic-bezier(0.4,0,0.2,1),
                      opacity 0.18s ease;
          opacity: 0;
        }
        .mu-appbar__search-wrap--open {
          max-height: 60px;
          opacity: 1;
        }
        .mu-appbar__search-form {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 16px 10px;
          position: relative;
        }
        .mu-appbar__search-icon {
          color: rgba(255,255,255,0.3);
          flex-shrink: 0;
        }
        .mu-appbar__search-input {
          flex: 1;
          height: 36px;
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,255,255,0.10);
          border-radius: 8px;
          padding: 0 10px 0 8px;
          font-size: 13px;
          color: white;
          outline: none;
          font-family: 'Pretendard', sans-serif;
        }
        .mu-appbar__search-input::placeholder {
          color: rgba(255,255,255,0.25);
        }
        .mu-appbar__search-input:focus {
          border-color: oklch(0.85 0.18 85 / 0.4);
        }
        .mu-appbar__search-clear {
          position: absolute;
          right: 22px;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
        }
      `}</style>
    </header>
  );
}
