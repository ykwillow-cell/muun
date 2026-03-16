import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Search, X } from "lucide-react";
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
        {/* 항목 6: 로고 — 별 아이콘 제거, 텍스트만 */}
        <Link href="/" className="mu-appbar__logo" aria-label="무운 홈">
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

      {/* 검색 확장 영역 */}
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
          background: #ffffff;
          border-bottom: 0.5px solid rgba(0,0,0,0.10);
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
          text-decoration: none;
        }
        /* 항목 7: font-weight 500 */
        .mu-appbar__logo-text {
          font-size: 17px;
          font-weight: 500;
          color: #1a1a18;
          letter-spacing: -0.01em;
        }
        .mu-appbar__logo-text em {
          font-style: normal;
          font-size: 11px;
          font-weight: 400;
          color: #5a5a56;
          margin-left: 4px;
        }
        .mu-appbar__icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0,0,0,0.04);
          border: 0.5px solid rgba(0,0,0,0.10);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5a5a56;
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
        }
        .mu-appbar__icon-btn:hover {
          background: rgba(0,0,0,0.08);
          color: #1a1a18;
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
          color: #9a9a96;
          flex-shrink: 0;
        }
        .mu-appbar__search-input {
          flex: 1;
          height: 36px;
          background: #f5f4ef;
          border: 0.5px solid rgba(0,0,0,0.10);
          border-radius: 8px;
          padding: 0 10px 0 8px;
          font-size: 13px;
          color: #1a1a18;
          outline: none;
          font-family: 'Pretendard', sans-serif;
        }
        .mu-appbar__search-input::placeholder {
          color: #9a9a96;
        }
        .mu-appbar__search-input:focus {
          border-color: rgba(0,0,0,0.25);
        }
        .mu-appbar__search-clear {
          position: absolute;
          right: 22px;
          color: #9a9a96;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
      `}</style>
    </header>
  );
}
