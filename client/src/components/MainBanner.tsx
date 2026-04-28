import { Link } from 'wouter';
import { ArrowRight, BookOpen, Brain, CalendarDays, Clock3, Globe2, Heart, Layers3, Moon, PenLine, ScrollText, Sparkles, Star, Users, type LucideIcon } from 'lucide-react';

const EXTRA_SERVICES: Array<{ href: string; label: string; desc: string; badge?: string; tone: string; Icon: LucideIcon }> = [
  { href: '/daily-fortune', label: '오늘의 운세', desc: '하루 운세 체크', tone: 'cp', Icon: Clock3 },
  { href: '/manselyeok', label: '만세력', desc: '사주 네 기둥 확인', tone: 'cm', Icon: CalendarDays },
  { href: '/tojeong', label: '토정비결', desc: '월별 흐름 보기', tone: 'cb', Icon: Sparkles },
  { href: '/astrology', label: '점성술', desc: '네이탈 차트 분석', tone: 'cc', badge: '인기', Icon: Star },
  { href: '/tarot', label: '타로', desc: '질문 중심 리딩', tone: 'cv', Icon: Layers3 },
  { href: '/family-saju', label: '가족사주', desc: '가족 오행 조화', tone: 'cpk', Icon: Users },
  { href: '/hybrid-compatibility', label: '사주×MBTI', desc: '성향 결합 궁합', tone: 'ct', badge: 'NEW', Icon: Brain },
  { href: '/dream', label: '꿈해몽', desc: '자주 찾는 상징 해석', tone: 'cam', Icon: Moon },
  { href: '/naming', label: '작명소', desc: '이름 후보 비교', tone: 'cg', badge: 'NEW', Icon: PenLine },
  { href: '/psychology', label: '심리테스트', desc: '성향과 심리 탐색', tone: 'clv', Icon: Brain },
  { href: '/fortune-dictionary', label: '운세 사전', desc: '용어와 개념 정리', tone: 'cs', Icon: BookOpen },
  { href: '/guide', label: '운세 칼럼', desc: '사주 읽을거리', tone: 'csk', Icon: BookOpen },
  { href: '/lucky-lunch', label: '행운 점심', desc: '오늘의 추천 메뉴', tone: 'cor', Icon: Heart },
];

function PromoArt() {
  return (
    <svg className="mu-promo-art" viewBox="0 0 160 120" fill="none" aria-hidden="true">
      <circle cx="110" cy="34" r="30" fill="rgba(255,248,223,.88)" />
      <circle cx="121" cy="26" r="24" fill="rgba(251,236,255,.9)" />
      <path d="M32 88h88c14 0 23-7 29-18" stroke="rgba(255,255,255,.35)" strokeWidth="10" strokeLinecap="round" />
      <circle cx="60" cy="32" r="2" fill="rgba(255,255,255,.85)" />
      <circle cx="84" cy="20" r="1.5" fill="rgba(255,255,255,.65)" />
      <path d="M52 18l1.4 4 4 1.6-4 1.6-1.4 4-1.4-4-4-1.6 4-1.6z" fill="rgba(255,255,255,.9)" />
      <rect x="52" y="48" width="58" height="48" rx="8" fill="rgba(255,255,255,.16)" stroke="rgba(255,255,255,.24)" />
      <rect x="56" y="52" width="50" height="40" rx="6" fill="rgba(255,255,255,.2)" />
      <text x="81" y="73" textAnchor="middle" fontSize="16" fontWeight="900" fill="rgba(255,255,255,.92)" fontFamily="Pretendard, sans-serif">2026</text>
      <text x="81" y="87" textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(255,255,255,.78)" fontFamily="Pretendard, sans-serif">병오년</text>
    </svg>
  );
}

export function MainBanner() {
  return (
    <section className="mu-main-html-extra" aria-labelledby="more-free-services-title">
      <div className="mu-more-services__head">
        <div>
          <p className="mu-section-eyebrow">전체 서비스</p>
          <h2 id="more-free-services-title" className="muun-section-title">더 많은 무료 서비스</h2>
        </div>
        <Link href="/more" className="muun-see-all">전체 보기 <ArrowRight size={14} /></Link>
      </div>

      <div className="svgrid mu-home-html-services-grid">
        {EXTRA_SERVICES.map(({ href, label, desc, Icon, badge, tone }) => (
          <Link key={href} href={href} className={`sc ${tone}`}>
            <div className="sciw"><Icon size={18} /></div>
            {badge ? <span className={`scbadge ${badge === 'NEW' ? 'bnew' : 'bhot'}`}>{badge}</span> : null}
            <p className="scti">{label}</p>
            <p className="scde">{desc}</p>
          </Link>
        ))}
      </div>

      <div className="promo-wrap">
        <Link href="/yearly-fortune" className="promo-card">
          <div className="promo-year-badge"><span className="promo-year-text">2026 병오년</span></div>
          <p className="promo-title">올해의 운세<br />지금 확인하기</p>
          <div className="promo-btn">
            <span className="promo-btn-text">무료로 보기</span>
            <ArrowRight size={12} />
          </div>
          <div className="promo-hanja">丙<br />午</div>
          <PromoArt />
        </Link>
        <div className="dots" aria-hidden="true">
          <div className="dot" /><div className="dot on" /><div className="dot" /><div className="dot" />
        </div>
      </div>
    </section>
  );
}
