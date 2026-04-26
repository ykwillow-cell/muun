import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, BookOpen, MoonStar, Heart, X, Home, PenLine, type LucideIcon } from 'lucide-react';
import { trackCustomEvent } from '@/lib/ga4';

interface AppBarProps {
  onSearch?: (query: string) => void;
}

type QuickLink = { href: string; label: string; Icon: LucideIcon; badge?: string };

const QUICK_LINKS: QuickLink[] = [
  { href: '/lifelong-saju', label: '평생사주', Icon: Home },
  { href: '/compatibility', label: '궁합', Icon: Heart },
  { href: '/dream', label: '꿈해몽', Icon: MoonStar },
  { href: '/fortune-dictionary', label: '운세사전', Icon: BookOpen },
  { href: '/guide', label: '칼럼', Icon: PenLine, badge: 'NEW' },
];

function resolveSearchDestination(query: string) {
  const normalized = query.replace(/\s+/g, '').toLowerCase();

  const directMap: Array<{ keywords: string[]; href: string }> = [
    { keywords: ['궁합', '연애', '결혼'], href: '/compatibility' },
    { keywords: ['평생사주', '사주풀이', '사주'], href: '/lifelong-saju' },
    { keywords: ['만세력', '팔자'], href: '/manselyeok' },
    { keywords: ['타로', '카드'], href: '/tarot' },
    { keywords: ['점성술', '별자리', '네이탈'], href: '/astrology' },
    { keywords: ['작명', '이름'], href: '/naming' },
  ];

  const matched = directMap.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)));
  if (matched) return matched.href;

  if (['꿈', '해몽', '길몽', '흉몽'].some((keyword) => normalized.includes(keyword))) {
    return `/dream?q=${encodeURIComponent(query.trim())}`;
  }

  if (['용어', '사전', '십신', '오행', '천간', '지지', '용신', '대운', '역마', '격국'].some((keyword) => normalized.includes(keyword))) {
    return `/fortune-dictionary?q=${encodeURIComponent(query.trim())}`;
  }

  return `/guide?q=${encodeURIComponent(query.trim())}`;
}

export function AppBar({ onSearch }: AppBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [location, navigate] = useLocation();

  const activeQuickHref = useMemo(() => {
    if (location === '/') return '/lifelong-saju';
    return QUICK_LINKS.find((item) => location === item.href || location.startsWith(`${item.href}/`))?.href || '';
  }, [location]);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  const handleSearchToggle = () => {
    const next = !searchOpen;
    setSearchOpen(next);
    if (!next) setSearchQuery('');
    trackCustomEvent('appbar_search_toggle', { open: next });
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    onSearch?.(query);
    const destination = resolveSearchDestination(query);
    trackCustomEvent('appbar_search_submit', { query, destination });
    navigate(destination);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="mu-appbar" style={{ paddingTop: 'var(--safe-area-top)' }}>
      <div className="mu-appbar__inner">
        <Link href="/" className="mu-appbar__brand" aria-label="무운 홈">
          <img src="/images/muun-mark.svg" alt="" width="28" height="28" className="mu-appbar__brand-mark" aria-hidden="true" />
          <span className="mu-appbar__brand-copy">
            <span className="mu-appbar__brand-name">무운</span>
            <span className="mu-appbar__brand-sub">MOBILE FORTUNE STUDIO</span>
          </span>
        </Link>

        <button
          className="mu-appbar__icon-btn"
          onClick={handleSearchToggle}
          aria-label={searchOpen ? '검색 닫기' : '검색 열기'}
          aria-expanded={searchOpen}
        >
          {searchOpen ? <X size={15} strokeWidth={2} /> : <Search size={15} strokeWidth={2} />}
        </button>
      </div>

      <div className={`mu-appbar__search-wrap ${searchOpen ? 'mu-appbar__search-wrap--open' : ''}`} aria-hidden={!searchOpen}>
        <form onSubmit={handleSearchSubmit} className="mu-appbar__search-form">
          <Search size={15} className="mu-appbar__search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            className="mu-appbar__search-input"
            placeholder="사주, 꿈해몽, 운세 용어 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            tabIndex={searchOpen ? 0 : -1}
          />
          {searchQuery && (
            <button type="button" className="mu-appbar__search-clear" onClick={() => setSearchQuery('')} aria-label="검색어 지우기">
              <X size={13} />
            </button>
          )}
        </form>
      </div>

      <nav className="mu-appbar__quick-row no-scrollbar" aria-label="주요 서비스">
        {QUICK_LINKS.map(({ href, label, Icon, badge }) => {
          const active = activeQuickHref === href;
          return (
            <Link key={href} href={href} className={`mu-appbar__quick-link ${active ? 'mu-appbar__quick-link--active' : ''}`} aria-current={active ? 'page' : undefined}>
              <Icon size={13} aria-hidden="true" />
              <span>{label}</span>
              {badge ? <span className="mu-appbar__badge">{badge}</span> : null}
            </Link>
          );
        })}
      </nav>

      <style>{`
        .mu-appbar {
          position: sticky;
          top: 0;
          z-index: 60;
          background: #fff;
          border-bottom: 0.5px solid #ebebf0;
        }
        .mu-appbar__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 44px;
          padding: 0 16px;
        }
        .mu-appbar__brand {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-width: 0;
          color: inherit;
          text-decoration: none;
        }
        .mu-appbar__brand-mark {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          flex: 0 0 auto;
          display: block;
        }
        .mu-appbar__brand-copy {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }
        .mu-appbar__brand-name {
          font-size: 15px;
          font-weight: 900;
          color: #1a1a2e;
          letter-spacing: -0.04em;
        }
        .mu-appbar__brand-sub {
          display: block;
          margin-top: 3px;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #aaa;
          white-space: nowrap;
        }
        .mu-appbar__icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 0.5px solid #e8e6f7;
          background: #f5f4f8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
        }
        .mu-appbar__search-wrap {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.22s ease, opacity 0.18s ease;
        }
        .mu-appbar__search-wrap--open {
          max-height: 78px;
          opacity: 1;
        }
        .mu-appbar__search-form {
          position: relative;
          padding: 0 16px 10px;
          display: flex;
          align-items: center;
        }
        .mu-appbar__search-icon {
          position: absolute;
          left: 30px;
          color: #a7a2bd;
        }
        .mu-appbar__search-input {
          width: 100%;
          height: 44px;
          padding: 0 42px;
          border-radius: 14px;
          border: 1.5px solid #e8e6f7;
          background: #fafafe;
          color: #1a1a2e;
          font-size: 14px;
          outline: none;
        }
        .mu-appbar__search-input:focus {
          border-color: rgba(57,41,160,0.42);
          box-shadow: 0 0 0 4px rgba(57,41,160,0.08);
        }
        .mu-appbar__search-clear {
          position: absolute;
          right: 28px;
          border: none;
          background: transparent;
          color: #a7a2bd;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mu-appbar__quick-row {
          display: flex;
          gap: 0;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-top: 0;
          border-bottom: 0.5px solid #ebebf0;
          padding: 0;
          background: #fff;
        }
        .mu-appbar__quick-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          flex: 0 0 auto;
          min-height: 38px;
          padding: 0 12px;
          border-bottom: 2px solid transparent;
          color: #bbb;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }
        .mu-appbar__quick-link svg {
          stroke: currentColor;
        }
        .mu-appbar__quick-link--active {
          color: #3929a0;
          border-bottom-color: #3929a0;
          font-weight: 800;
        }
        .mu-appbar__badge {
          display: inline-flex;
          align-items: center;
          min-height: 14px;
          padding: 1px 5px;
          border-radius: 4px;
          background: #3929a0;
          color: #fff;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: -0.01em;
        }
        @media (min-width: 480px) {
          .mu-appbar__inner { height: 52px; padding: 0 22px; }
          .mu-appbar__quick-row { justify-content: center; }
        }
      `}</style>
    </header>
  );
}
