import { Link } from 'wouter';
import { BookOpen, Brain, CalendarDays, Clock3, Globe2, Heart, Home, Layers3, Moon, PenLine, ScrollText, Sparkles, Star, Users, type LucideIcon } from 'lucide-react';

type FeaturedTone = 'purple' | 'green' | 'coral';
type FeaturedService = { href: string; label: string; description: string; badge: string; Icon: LucideIcon; tone: FeaturedTone; full?: boolean };
type UtilityService = { href: string; label: string; description: string; Icon: LucideIcon; badge?: string };

const FEATURED_SERVICES: FeaturedService[] = [
  { href: '/lifelong-saju', label: '평생사주', description: '내 사주의 큰 흐름', badge: '대표', Icon: Globe2, tone: 'purple' },
  { href: '/yearly-fortune', label: '2026 신년운세', description: '올해 운세 항목별', badge: '시즌', Icon: ScrollText, tone: 'green' },
  { href: '/compatibility', label: '궁합 보기', description: '연애·결혼 궁합 확인', badge: '인기', Icon: Home, tone: 'coral', full: true },
];

const UTILITY_SERVICES: UtilityService[] = [
  { href: '/daily-fortune', label: '오늘의 운세', description: '하루 운세 체크', Icon: Clock3 },
  { href: '/manselyeok', label: '만세력', description: '사주 네 기둥 확인', Icon: CalendarDays },
  { href: '/tojeong', label: '토정비결', description: '월별 흐름 보기', Icon: Sparkles },
  { href: '/astrology', label: '점성술', description: '네이탈 차트 분석', Icon: Star, badge: '인기' },
  { href: '/tarot', label: '타로', description: '질문 중심 리딩', Icon: Layers3 },
  { href: '/family-saju', label: '가족사주', description: '가족 오행 조화', Icon: Users },
  { href: '/hybrid-compatibility', label: '사주×MBTI', description: '성향 결합 궁합', Icon: Brain, badge: 'NEW' },
  { href: '/dream', label: '꿈해몽', description: '자주 찾는 상징 해석', Icon: Moon },
  { href: '/naming', label: '작명소', description: '이름 후보 비교', Icon: PenLine, badge: 'NEW' },
  { href: '/psychology', label: '심리테스트', description: '성향과 심리 탐색', Icon: Brain },
  { href: '/fortune-dictionary', label: '운세 사전', description: '용어와 개념 정리', Icon: BookOpen },
  { href: '/guide', label: '운세 칼럼', description: '사주 읽을거리', Icon: BookOpen },
  { href: '/lucky-lunch', label: '행운 점심', description: '오늘의 추천 메뉴', Icon: Heart },
];

export function ServiceGrid() {
  return (
    <div className="muun-services">
      <section className="muun-section-block" aria-labelledby="core-services-title">
        <p className="muun-section-eyebrow">핵심 서비스</p>
        <div className="muun-section-row">
          <h2 id="core-services-title" className="muun-section-title">지금 바로 볼 수 있는 서비스</h2>
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
        </div>
        <div className="muun-mini-grid">
          {UTILITY_SERVICES.map(({ href, label, description, Icon, badge }) => (
            <Link key={href} href={href} className="muun-mini-card">
              <div className="muun-mini-card__head">
                <span className="muun-mini-icon"><Icon size={15} aria-hidden="true" /></span>
                {badge ? <span className={`muun-mini-badge${badge === 'NEW' ? ' muun-mini-badge--new' : ''}`}>{badge}</span> : null}
              </div>
              <h3 className="muun-mini-name">{label}</h3>
              <p className="muun-mini-desc">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
