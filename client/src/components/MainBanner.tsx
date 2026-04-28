import { Link } from 'wouter';
import { ArrowUpRight, CalendarDays, Globe2, ScrollText, Sparkles } from 'lucide-react';

const EXTRA_SERVICES = [
  { href: '/yearly-fortune', label: '신년운세', desc: '2026년 한 해 흐름', Icon: Sparkles, badge: '인기' },
  { href: '/manselyeok', label: '만세력', desc: '사주 네 기둥 확인', Icon: CalendarDays },
  { href: '/tojeong', label: '토정비결', desc: '월별 흐름 보기', Icon: ScrollText },
  { href: '/astrology', label: '점성술', desc: '네이탈 차트 분석', Icon: Globe2, badge: '인기' },
  { href: '/tarot', label: '타로', desc: '질문 중심 리딩', Icon: Sparkles },
  { href: '/family-saju', label: '가족사주', desc: '가족 오행 조화', Icon: Globe2 },
  { href: '/hybrid-compatibility', label: '사주×MBTI', desc: '성향 결합 궁합', Icon: Sparkles, badge: 'NEW' },
  { href: '/naming', label: '작명소', desc: '이름 후보 비교', Icon: CalendarDays, badge: 'NEW' },
] as const;

export function MainBanner() {
  return (
    <section className="mu-more-services" aria-labelledby="more-free-services-title">
      <div className="mu-more-services__head">
        <div>
          <p className="mu-section-eyebrow">추가 서비스</p>
          <h2 id="more-free-services-title" className="muun-section-title">더 많은 무료 서비스</h2>
        </div>
        <Link href="/more" className="muun-see-all">전체 보기 <ArrowUpRight size={14} /></Link>
      </div>
      <div className="mu-more-services__grid">
        {EXTRA_SERVICES.map(({ href, label, desc, Icon, badge }) => (
          <Link key={href} href={href} className="mu-more-services__card">
            <div className="mu-more-services__top">
              <span className="mu-more-services__icon"><Icon size={18} /></span>
              {badge ? <span className={`mu-more-services__badge ${badge === 'NEW' ? 'is-new' : ''}`}>{badge}</span> : null}
            </div>
            <h3>{label}</h3>
            <p>{desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
