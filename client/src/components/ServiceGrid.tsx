import { Link } from 'wouter';
import { ArrowRight, ArrowUpRight, Clock3, HeartHandshake, ScrollText, Sparkles } from 'lucide-react';

interface UtilityService {
  href: string;
  label: string;
  description: string;
  emoji: string;
  badge?: string;
}

const FEATURED_SERVICES = [
  { href: '/lifelong-saju', label: '평생사주', description: '내 사주의 큰 흐름 확인', badge: '대표', Icon: Sparkles },
  { href: '/yearly-fortune', label: '2026 신년운세', description: '올해 운세 항목별 확인', badge: '시즌', Icon: ScrollText },
  { href: '/compatibility', label: '궁합 보기', description: '연애·결혼 궁합 확인', badge: '인기', Icon: HeartHandshake },
  { href: '/daily-fortune', label: '오늘의 운세', description: '하루 운세 빠르게 보기', badge: '바로보기', Icon: Clock3 },
] as const;

const UTILITY_SERVICES: UtilityService[] = [
  { href: '/manselyeok', label: '만세력', description: '사주 네 기둥 확인', emoji: '📅' },
  { href: '/tojeong', label: '토정비결', description: '월별 흐름 보기', emoji: '📘' },
  { href: '/astrology', label: '점성술', description: '네이탈 차트 분석', emoji: '✨' },
  { href: '/tarot', label: '타로', description: '질문 중심 카드 리딩', emoji: '🃏' },
  { href: '/naming', label: '작명소', description: '이름 후보 비교', emoji: '✍️', badge: 'NEW' },
  { href: '/lucky-lunch', label: '행운 점심', description: '오늘의 추천 메뉴', emoji: '🍀' },
];

export function ServiceGrid() {
  return (
    <section className="mu-container-narrow pb-2">
      <div className="grid gap-6">
        <div className="mu-glass-panel p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="mu-divider-text">핵심 서비스</span>
                <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.05em] text-slate-900">지금 바로 볼 수 있는 서비스</h2>
              </div>
              <Link href="/more" className="inline-flex items-center gap-1 text-sm font-bold text-[#5748db]">
                전체 서비스 <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mu-auto-grid-220">
              {FEATURED_SERVICES.map(({ href, label, description, badge, Icon }) => (
                <Link key={href} href={href} className="mu-link-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6B5FFF]/10 text-[#5648db]">
                      <Icon size={21} aria-hidden="true" />
                    </div>
                    <div className="flex items-center gap-2">
                      {badge ? <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{badge}</span> : null}
                      <ArrowUpRight size={16} className="text-slate-400" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-[20px] font-extrabold tracking-[-0.05em] text-slate-900">{label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mu-glass-panel p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mu-divider-text">추가 서비스</span>
              <h2 className="mt-3 text-[26px] font-extrabold tracking-[-0.05em] text-slate-900">더 많은 무료 서비스</h2>
            </div>
          </div>
          <div className="mt-5 mu-auto-grid-180">
            {UTILITY_SERVICES.map((service) => (
              <Link key={service.href} href={service.href} className="mu-link-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-lg"><span aria-hidden="true">{service.emoji}</span></div>
                  {service.badge ? <span className="inline-flex rounded-full bg-[#6B5FFF]/10 px-2.5 py-1 text-[11px] font-bold text-[#5648db]">{service.badge}</span> : null}
                </div>
                <h3 className="mt-4 text-[18px] font-extrabold tracking-[-0.04em] text-slate-900">{service.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
