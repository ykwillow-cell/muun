import { BookOpen, CalendarDays, Compass, Grid3x3, Home } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const NAV_ITEMS = [
  { href: '/', label: '홈', Icon: Home },
  { href: '/daily-fortune', label: '운세', Icon: Compass },
  { href: '/lifelong-saju', label: '사주', Icon: CalendarDays },
  { href: '/fortune-dictionary', label: '사전', Icon: BookOpen },
  { href: '/more', label: '전체', Icon: Grid3x3 },
] as const;

const moreRoutes = ['/more', '/manselyeok', '/tojeong', '/astrology', '/tarot', '/family-saju', '/hybrid-compatibility', '/naming', '/psychology', '/lucky-lunch', '/yearly-fortune'];

export function BottomNav() {
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    if (href === '/more') return moreRoutes.some((path) => location === path || location.startsWith(`${path}/`));
    if (href === '/fortune-dictionary') {
      return location === href || location.startsWith('/dictionary/') || location.startsWith('/fortune-dictionary/');
    }
    return location === href || location.startsWith(`${href}/`);
  };

  return (
    <>
      <div className="mu-bottom-nav-modern__spacer" aria-hidden="true" />
      <nav className="mu-bottom-nav-modern" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} aria-label="하단 내비게이션">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href} className={`mu-bottom-nav-modern__tab ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined}>
              <span className="mu-bottom-nav-modern__icon-wrap"><Icon size={20} strokeWidth={active ? 2.2 : 1.9} /></span>
              <span className="mu-bottom-nav-modern__label">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
