import { Link } from 'wouter';
import { ArrowRight, CalendarDays, Clock3, Globe2, Home, Layers3, PenLine, ScrollText, Sparkles, type LucideIcon } from 'lucide-react';

type FeaturedTone = 'purple' | 'green' | 'coral';
type FeaturedService = { href: string; label: string; description: string; badge: string; Icon: LucideIcon; tone: FeaturedTone; full?: boolean };
type UtilityService = { href: string; label: string; description: string; Icon: LucideIcon; badge?: string };

const FEATURED_SERVICES: FeaturedService[] = [
  { href: '/lifelong-saju', label: '평생사주', description: '내 사주의 큰 흐름', badge: '대표', Icon: Globe2, tone: 'purple' },
  { href: '/yearly-fortune', label: '2026 신년운세', description: '올해 운세 항목별', badge: '시즌', Icon: ScrollText, tone: 'green' },
  { href: '/compatibility', label: '궁합 보기', description: '연애·결혼 궁합 확인', badge: '인기', Icon: Home, tone: 'coral', full: true },
];

const UTILITY_SERVICES: UtilityService[] = [
  { href: '/manselyeok', label: '만세력', description: '사주 네 기둥 확인', Icon: CalendarDays },
  { href: '/tojeong', label: '토정비결', description: '월별 흐름 보기', Icon: Clock3 },
  { href: '/astrology', label: '점성술', description: '네이탈 차트 분석', Icon: Sparkles, badge: '인기' },
  { href: '/tarot', label: '타로', description: '질문 중심 리딩', Icon: Layers3 },
  { href: '/naming', label: '작명소', description: '이름 후보 비교', Icon: PenLine, badge: 'NEW' },
];

export function ServiceGrid() {
  return (
    <div className="muun-services">
      <section className="muun-section-block" aria-labelledby="core-services-title">
        <p className="muun-section-eyebrow">핵심 서비스</p>
        <div className="muun-section-row">
          <h2 id="core-services-title" className="muun-section-title">지금 바로 볼 수 있는 서비스</h2>
          <Link href="/more" className="muun-see-all">전체 <ArrowRight size={12} aria-hidden="true" /></Link>
        </div>

        <div className="muun-main-svc-grid">
          {FEATURED_SERVICES.map(({ href, label, description, badge, Icon, tone, full }) => (
            <Link key={href} href={href} className={`muun-main-svc-card${full ? ' muun-main-svc-card--full' : ''}`}>
              <div className={full ? 'muun-main-svc-card__full-icon' : 'muun-main-svc-card__top'}>
                <span className={`muun-svc-icon muun-svc-icon--${tone}`}><Icon size={18} aria-hidden="true" /></span>
                {!full ? <span className={`muun-svc-badge muun-svc-badge--${tone}`}>{badge}</span> : null}
              </div>
              <div className="muun-main-svc-card__body">
                {full ? <span className={`muun-svc-badge muun-svc-badge--${tone}`}>{badge}</span> : null}
                <h3 className="muun-svc-name">{label}</h3>
                <p className="muun-svc-desc">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="muun-section-block muun-section-block--flush-top" aria-labelledby="extra-services-title">
        <p className="muun-section-eyebrow">추가 서비스</p>
        <div className="muun-section-row">
          <h2 id="extra-services-title" className="muun-section-title">더 많은 무료 서비스</h2>
          <Link href="/more" className="muun-see-all">전체 <ArrowRight size={12} aria-hidden="true" /></Link>
        </div>

        <div className="muun-mini-grid">
          {UTILITY_SERVICES.map(({ href, label, description, Icon, badge }) => (
            <Link key={href} href={href} className="muun-mini-card">
              <div className="muun-mini-card__head">
                <span className="muun-mini-icon"><Icon size={15} aria-hidden="true" /></span>
                {badge ? <span className={`muun-mini-badge ${badge === 'NEW' ? 'muun-mini-badge--new' : ''}`}>{badge}</span> : null}
              </div>
              <h3 className="muun-mini-name">{label}</h3>
              <p className="muun-mini-desc">{description}</p>
            </Link>
          ))}
          <Link href="/more" className="muun-more-card">
            <span className="muun-more-card__plus">+</span>
            <strong>전체 서비스</strong>
            <span>모두 보기 →</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
