import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { BookOpen, Brain, Calendar, Clock3, Globe2, Heart, Layers3, Moon, PenLine, ScrollText, Sparkles, Star, Users, ArrowRight, type LucideIcon } from 'lucide-react';

const SERVICES: Array<{ href: string; label: string; desc: string; badge?: string; Icon: LucideIcon }> = [
  { href: '/daily-fortune', label: '오늘의 운세', desc: '하루 운세 체크', Icon: Clock3 },
  { href: '/manselyeok', label: '만세력', desc: '사주 네 기둥 확인', Icon: Calendar },
  { href: '/tojeong', label: '토정비결', desc: '월별 흐름 보기', Icon: Sparkles },
  { href: '/astrology', label: '점성술', desc: '네이탈 차트 분석', Icon: Star, badge: '인기' },
  { href: '/tarot', label: '타로', desc: '질문 중심 리딩', Icon: Layers3 },
  { href: '/family-saju', label: '가족사주', desc: '가족 오행 조화', Icon: Users },
  { href: '/hybrid-compatibility', label: '사주×MBTI', desc: '성향 결합 궁합', Icon: Brain, badge: 'NEW' },
  { href: '/dream', label: '꿈해몽', desc: '자주 찾는 상징 해석', Icon: Moon },
  { href: '/naming', label: '작명소', desc: '이름 후보 비교', Icon: PenLine, badge: 'NEW' },
  { href: '/psychology', label: '심리테스트', desc: '성향과 심리 탐색', Icon: Brain },
  { href: '/fortune-dictionary', label: '운세 사전', desc: '용어와 개념 정리', Icon: BookOpen },
  { href: '/guide', label: '운세 칼럼', desc: '사주 읽을거리', Icon: BookOpen },
  { href: '/lucky-lunch', label: '행운 점심', desc: '오늘의 추천 메뉴', Icon: Heart },
];

export default function More() {
  return (
    <div className="mu-subpage-screen min-h-screen bg-background text-foreground pb-20 antialiased">
      <Helmet>
        <title>전체 서비스 | 무운사주</title>
        <meta name="description" content="무운사주의 모든 무료 서비스를 한눈에 확인하세요." />
      </Helmet>

      <main className="mu-service-main px-4 py-6">
        <section className="mu-more-page">
          <div className="mu-home-content-section__head">
            <div>
              <p className="mu-section-eyebrow">무료 서비스</p>
              <h1 className="muun-section-title">더 많은 무료 서비스</h1>
            </div>
          </div>

          <div className="mu-more-page__grid">
            {SERVICES.map(({ href, label, desc, badge, Icon }) => (
              <Link key={href} href={href} className="mu-more-page__card">
                <div className="mu-more-page__icon"><Icon size={18} /></div>
                {badge ? <span className={`mu-more-page__badge ${badge === 'NEW' ? 'is-new' : ''}`}>{badge}</span> : null}
                <h2>{label}</h2>
                <p>{desc}</p>
                <span className="mu-more-page__link">이동하기 <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
