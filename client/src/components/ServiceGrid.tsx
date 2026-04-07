import { Link } from 'wouter';
import { ArrowRight, ArrowUpRight, Sparkles, Heart, Globe, Layers, BookOpen, Moon, Users, PenLine, Clock3 } from 'lucide-react';

interface FeaturedService {
  href: string;
  label: string;
  description: string;
  badge?: string;
  Icon: typeof Sparkles;
}

interface UtilityService {
  href: string;
  label: string;
  description: string;
  badge?: string;
  emoji: string;
}

const FEATURED_SERVICES: FeaturedService[] = [
  { href: '/lifelong-saju', label: '평생사주', description: '타고난 기질과 운의 흐름을 길게 읽습니다.', badge: '인기', Icon: Sparkles },
  { href: '/compatibility', label: '궁합', description: '두 사람의 오행과 관계 리듬을 살펴봅니다.', badge: '인기', Icon: Heart },
  { href: '/astrology', label: '점성술', description: '네이탈 차트로 성향과 흐름을 확인합니다.', Icon: Globe },
  { href: '/tarot', label: '타로', description: '오늘의 질문에 대한 카드 힌트를 받아보세요.', Icon: Layers },
];

const UTILITY_SERVICES: UtilityService[] = [
  { href: '/yearly-fortune', label: '신년운세', description: '2026 병오년 연간 흐름', badge: '시즌', emoji: '🐎' },
  { href: '/daily-fortune', label: '오늘의 운세', description: '하루 운세 체크', emoji: '☀️' },
  { href: '/manselyeok', label: '만세력', description: '사주팔자 조견표', emoji: '📅' },
  { href: '/tojeong', label: '토정비결', description: '전통 월별 운세', emoji: '📜' },
  { href: '/dream', label: '꿈해몽', description: '상징별 꿈 풀이', emoji: '🌙' },
  { href: '/fortune-dictionary', label: '운세 사전', description: '오행·십신 개념 정리', emoji: '📘' },
  { href: '/guide', label: '운세 칼럼', description: '사주 읽을거리 아카이브', emoji: '📝' },
  { href: '/psychology', label: '심리테스트', description: '성향과 심리 탐색', emoji: '🧠' },
  { href: '/family-saju', label: '가족사주', description: '가족 오행 조화 보기', emoji: '👨‍👩‍👧' },
  { href: '/hybrid-compatibility', label: '사주×MBTI', description: '성향 결합 궁합', badge: 'NEW', emoji: '🔀' },
  { href: '/naming', label: '작명소', description: '사주 기반 이름 풀이', badge: 'NEW', emoji: '✍️' },
  { href: '/lucky-lunch', label: '행운 점심', description: '오늘의 추천 메뉴', emoji: '🍀' },
];

const highlights = [
  { label: '즉시 결과', Icon: Clock3 },
  { label: '콘텐츠 확장', Icon: BookOpen },
  { label: '모바일 최적화', Icon: Moon },
  { label: '관계 분석', Icon: Users },
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
                <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.05em] text-slate-900">가장 많이 찾는 무료 운세</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">무료 플랜 환경에서도 빠르게 열리도록 자주 찾는 결과 페이지를 먼저 배치했습니다.</p>
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
                      {badge ? <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">{badge}</span> : null}
                      <ArrowUpRight size={16} className="text-slate-400" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-[20px] font-extrabold tracking-[-0.05em] text-slate-900">{label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Link href="/naming" className="overflow-hidden rounded-[30px] border border-[#6B5FFF]/14 bg-[linear-gradient(135deg,#17114c_0%,#352597_52%,#eff0ff_52%,#ffffff_100%)] px-6 py-6 shadow-[0_22px_44px_rgba(15,23,42,0.12)]">
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))] items-center">
            <div>
              <div className="inline-flex rounded-full bg-white/14 px-3 py-1 text-[11px] font-bold text-white">NEW</div>
              <h2 className="mt-4 text-[28px] font-extrabold tracking-[-0.05em] text-white">사주 기반 작명소</h2>
              <p className="mt-2 text-sm leading-7 text-white/80">81수리 성명학과 사주 균형을 함께 참고해 이름의 흐름을 읽는 신규 서비스입니다.</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#FFF1B8]">이름 추천받기 <ArrowRight size={14} /></div>
            </div>
            <div className="mu-auto-grid-180">
              {highlights.map(({ label, Icon }) => (
                <div key={label} className="rounded-2xl border border-white/70 bg-white/90 px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm">
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
            <p className="text-sm leading-7 text-slate-500">폼 서비스와 콘텐츠 허브를 함께 배치해 다음 이동을 쉽게 만들었습니다.</p>
          </div>
          <div className="mt-5 mu-auto-grid-180">
            {UTILITY_SERVICES.map((service) => (
              <Link key={service.href} href={service.href} className="mu-link-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-lg"><span aria-hidden="true">{service.emoji}</span></div>
                  {service.badge ? <span className="inline-flex rounded-full bg-[#6B5FFF]/10 px-2.5 py-1 text-[11px] font-bold text-[#5648db]">{service.badge}</span> : null}
                </div>
                <h3 className="mt-4 text-[18px] font-extrabold tracking-[-0.04em] text-slate-900">{service.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
