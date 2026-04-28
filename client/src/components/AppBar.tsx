import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, Search, X } from 'lucide-react';
import { trackCustomEvent } from '@/lib/ga4';

interface AppBarProps {
  onSearch?: (query: string) => void;
}


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
  const [, navigate] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);


  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
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
    <header className="mu-appbar-modern" style={{ paddingTop: 'var(--safe-area-top)' }}>
      <div className="mu-appbar-modern__bar">
        <Link href="/" className="mu-appbar-modern__brand" aria-label="무운사주 홈">
          <img src="/images/muun-mark.svg" alt="" width="36" height="36" className="mu-appbar-modern__brand-mark" aria-hidden="true" />
          <span className="mu-appbar-modern__brand-name">무운사주</span>
        </Link>

        <div className="mu-appbar-modern__actions">
          <button
            className="mu-appbar-modern__icon-btn"
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label={searchOpen ? '검색 닫기' : '검색 열기'}
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
          <Link href="/more" className="mu-appbar-modern__icon-btn" aria-label="전체 서비스 보기">
            <Menu size={20} />
          </Link>
        </div>
      </div>

      <div className={`mu-appbar-modern__search ${searchOpen ? 'is-open' : ''}`} aria-hidden={!searchOpen}>
        <form onSubmit={handleSearchSubmit} className="mu-appbar-modern__search-form">
          <Search size={16} className="mu-appbar-modern__search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            className="mu-appbar-modern__search-input"
            placeholder="사주, 꿈해몽, 운세 용어 검색"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            tabIndex={searchOpen ? 0 : -1}
          />
          {searchQuery ? (
            <button type="button" className="mu-appbar-modern__search-clear" onClick={() => setSearchQuery('')} aria-label="검색어 지우기">
              <X size={14} />
            </button>
          ) : null}
        </form>
      </div>

    </header>
  );
}
