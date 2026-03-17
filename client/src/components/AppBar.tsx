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
        {/* 로고 — 퍼플 그라디언트 마크 + 텍스트 */}
        <Link href="/" className="mu-appbar__logo" aria-label="무운 홈">
          <div className="mu-appbar__logo-mark" aria-hidden="true">무</div>
          <span className="mu-appbar__logo-text">무운</span>
        </Link>

        {/* 검색 버튼 */}
        <button
          className="mu-appbar__icon-btn"
          onClick={handleSearchToggle}
          aria-label={searchOpen ? "검색 닫기" : "검색 열기"}
          aria-expanded={searchOpen}
        >
          {searchOpen ? <X size={18} strokeWidth={1.6} /> : <Search size={18} strokeWidth={1.6} />}
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
          background: #f2f4f6;
        }
        .mu-appbar__inner {
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
        }
        .mu-appbar__logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .mu-appbar__logo-mark {
          width: 28px;
          height: 28px;
          border-radius: 9px;
          background: linear-gradient(135deg, #6B5FFF 0%, #60C8D4 60%, #A8E6CF 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.3px;
          flex-shrink: 0;
        }
        .mu-appbar__logo-text {
          font-size: 17px;
          font-weight: 700;
          color: #191f28;
          letter-spacing: -0.4px;
        }
        .mu-appbar__icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4e5968;
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
        }
        .mu-appbar__icon-btn:hover {
          background: rgba(0,0,0,0.05);
          color: #191f28;
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
          color: #8b95a1;
          flex-shrink: 0;
        }
        .mu-appbar__search-input {
          flex: 1;
          height: 38px;
          background: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 0 10px 0 8px;
          font-size: 14px;
          color: #191f28;
          outline: none;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .mu-appbar__search-input::placeholder {
          color: #8b95a1;
        }
        .mu-appbar__search-input:focus {
          box-shadow: 0 0 0 2px rgba(107,95,255,0.25);
        }
        .mu-appbar__search-clear {
          position: absolute;
          right: 22px;
          color: #8b95a1;
          cursor: pointer;
          display: flex;
          align-items: center;
          background: none;
          border: none;
        }
      `}</style>
    </header>
  );
}
