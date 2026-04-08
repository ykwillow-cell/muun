import { Link } from 'wouter';
import { ArrowRight, ArrowUpRight, BookOpen, Clock3, HeartHandshake, ScrollText, Sparkles, Users } from 'lucide-react';

interface UtilityService {
  href: string;
  label: string;
  description: string;
  emoji: string;
  badge?: string;
}

const FEATURED_SERVICES = [
  { href: '/lifelong-saju', label: '평생사주', description: '내 사주의 큰 흐름과 성향을 자세히 살펴보는 기본 리포트', badge: '대표', Icon: Sparkles },
  { href: '/yearly-fortune', label: '2026 신년운세', description: '올해의 재물운 · 직장운 · 애정운을 항목별로 확인', badge: '시즌', Icon: ScrollText },
  { href: '/compatibility', label: '궁합 보기', description: '연애와 결혼, 관계 흐름을 두 사람의 사주로 비교', badge: '인기', Icon: HeartHandshake },
  { href: '/daily-fortune', label: '오늘의 운세', description: '하루의 기운과 조심할 점을 짧고 빠르게 확인', badge: '바로보기', Icon: Clock3 },
] as const;

const UTILITY_SERVICES: UtilityService[] = [
  { href: '/manselyeok', label: '만세력', description: '사주의 네 기둥과 오행 구성을 확인', emoji: '📅' },
  { href: '/tojeong', label: '토정비결', description: '월별 흐름과 큰 사건 운세를 살펴보기', emoji: '📘' },
  { href: '/astrology', label: '점성술', description: '네이탈 차트로 보는 기질과 성향', emoji: '✨' },
  { href: '/tarot', label: '타로', description: '질문 중심으로 빠르게 보는 카드 리딩', emoji: '🃏' },
  { href: '/naming', label: '작명소', description: '사주 흐름과 이름 후보를 함께 비교', emoji: '✍️', badge: 'NEW' },
  { href: '/lucky-lunch', label: '행운 점심', description: '오늘의 기운에 맞는 추천 메뉴 보기', emoji: '🍀' },
];

const highlights = [
  { label: '사주 균형 참고', Icon: Sparkles },
  { label: '81수리 성명학', Icon: ScrollText },
  { label: '한자 후보 비교', Icon: BookOpen },
  { label: '모바일 입력 최적화', Icon: Users },
] as const;

export function ServiceGrid() {
  return (
    <section className="mu-container-narrow pb-2">
      <div className="grid gap-6">
        <div className="mu-glass-panel p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="mu-divider-text">핵심 서비스</span>
                <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.05em] text-slate-900">가장 많이 찾는 무료 운세</h2>
                <p className="mt-2 text-sm leading-7 text-slate-700">처음 들어와도 바로 눌러볼 수 있는 결과형 서비스를 먼저 배치했습니다.</p>
              </div>
              <Link href="/more" className="inline-flex items-center gap-1 text-sm font-bold text-[#5748db]">
                전체 서비스 보기 <ArrowRight size={14} />
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

        <Link href="/naming" className="block overflow-hidden rounded-[30px] border border-[#6B5FFF]/12 bg-[linear-gradient(135deg,#ffffff_0%,#f7f5ff_52%,#eff5ff_100%)] px-5 py-5 shadow-[0_18px_38px_rgba(15,23,42,0.08)] sm:px-6 sm:py-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <span className="mu-section-eyebrow">NEW · 사주 기반 작명</span>
              <h2 className="mt-4 text-[28px] font-extrabold tracking-[-0.05em] text-slate-900">이름 후보를 사주 흐름과 함께 살펴보는 작명소</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">81수리 성명학과 사주 균형을 함께 참고해 이름 후보를 비교할 수 있는 신규 서비스입니다.</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#5748db]">이름 추천받기 <ArrowRight size={14} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {highlights.map(({ label, Icon }) => (
                <div key={label} className="rounded-[22px] border border-white/80 bg-white/92 px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6B5FFF]/10 text-[#5648db]">
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <div className="mt-3">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </Link>

        <div className="mu-glass-panel p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mu-divider-text">전체 탐색</span>
              <h2 className="mt-3 text-[26px] font-extrabold tracking-[-0.05em] text-slate-900">상황별로 바로 들어갈 수 있게 정리한 서비스 모음</h2>
            </div>
            <p className="text-sm leading-7 text-slate-600">폼 서비스와 콘텐츠 허브를 함께 배치해 다음 이동을 쉽게 만들었습니다.</p>
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
