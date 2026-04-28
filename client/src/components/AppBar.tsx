import { Bell, Menu } from 'lucide-react';
import { Link } from 'wouter';

interface AppBarProps {
  onSearch?: (query: string) => void;
}

export function AppBar({}: AppBarProps) {
  return (
    <header className="mu-appbar-modern" style={{ paddingTop: 'var(--safe-area-top)' }}>
      <div className="mu-appbar-modern__bar">
        <Link href="/" className="mu-appbar-modern__brand" aria-label="무운사주 홈">
          <img src="/images/muun-mark.svg" alt="무운사주" width="42" height="42" className="mu-appbar-modern__brand-mark" />
          <span className="mu-appbar-modern__brand-name">무운사주</span>
        </Link>

        <div className="mu-appbar-modern__actions">
          <button className="mu-appbar-modern__icon-btn" type="button" aria-label="알림">
            <Bell size={20} />
            <span className="mu-appbar-modern__notif-dot" aria-hidden="true" />
          </button>
          <Link href="/more" className="mu-appbar-modern__icon-btn" aria-label="전체 서비스 보기">
            <Menu size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}
