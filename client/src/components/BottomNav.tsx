import { BookOpen, Compass, Home, Settings2, UserRound } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const NAV_ITEMS = [
  { href: '/', label: '홈', Icon: Home },
  { href: '/daily-fortune', label: '운세', Icon: Compass },
  { href: '/lifelong-saju', label: '사주', Icon: Settings2 },
  { href: '/fortune-dictionary', label: '사주사전', Icon: BookOpen },
  { href: '/more', label: '마이', Icon: UserRound },
] as const;

export function BottomNav() {
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    if (href === '/daily-fortune') return location.startsWith('/daily-fortune') || location.startsWith('/yearly-fortune') || location.startsWith('/tojeong');
    if (href === '/lifelong-saju') return location.startsWith('/lifelong-saju') || location.startsWith('/manselyeok') || location.startsWith('/compatibility') || location.startsWith('/family-saju') || location.startsWith('/hybrid-compatibility') || location.startsWith('/astrology') || location.startsWith('/tarot') || location.startsWith('/psychology') || location.startsWith('/naming');
    if (href === '/fortune-dictionary') return location.startsWith('/fortune-dictionary') || location.startsWith('/dictionary') || location.startsWith('/dream') || location.startsWith('/guide');
    if (href === '/more') return location.startsWith('/more') || location.startsWith('/about') || location.startsWith('/contact') || location.startsWith('/privacy') || location.startsWith('/terms') || location.startsWith('/lucky-lunch') || location.startsWith('/past-life') || location.startsWith('/tarot-history');
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
              <span className="mu-bottom-nav-modern__icon-wrap"><Icon size={20} strokeWidth={active ? 2.3 : 2} /></span>
              <span className="mu-bottom-nav-modern__label">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
