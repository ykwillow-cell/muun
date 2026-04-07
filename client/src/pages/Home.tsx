import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { ArrowRight, BookOpenText, MoonStar, Sparkles, HeartHandshake, ShieldCheck, Smartphone, Search, BookMarked } from 'lucide-react';
import { useCanonical } from '@/lib/use-canonical';
import { setHomeOGTags } from '@/lib/og-tags';
import { OrganizationSchema, BreadcrumbListSchema, WebApplicationSchema, SiteNavigationSchema } from '@/components/SchemaMarkup';
import { HeroFirstVisit } from '@/components/HeroFirstVisit';
import { HeroReturnVisit } from '@/components/HeroReturnVisit';
import { TrustBar } from '@/components/TrustBar';
import { MainBanner } from '@/components/MainBanner';
import { ServiceGrid } from '@/components/ServiceGrid';
import { HomeColumnSection } from '@/components/HomeColumnSection';
import { HomeDictionarySection } from '@/components/HomeDictionarySection';

const quickActions = [
  { href: '/lifelong-saju', label: '평생사주 시작', Icon: Sparkles },
  { href: '/compatibility', label: '궁합 보기', Icon: HeartHandshake },
  { href: '/guide', label: '운세 칼럼 읽기', Icon: BookOpenText },
  { href: '/dream', label: '꿈해몽 찾기', Icon: MoonStar },
] as const;

const qualityNotes = [
  { title: '회원가입 없이 시작', desc: '생년월일만 입력하면 바로 결과를 볼 수 있어요.', Icon: ShieldCheck },
  { title: '모바일 흐름 최적화', desc: '좁은 화면에서도 한 손으로 빠르게 이동할 수 있게 정리했습니다.', Icon: Smartphone },
  { title: '검색 이후 이동 강화', desc: '칼럼·사전·꿈해몽으로 자연스럽게 이어지는 구조입니다.', Icon: Search },
] as const;

const journeyCards = [
  {
    title: '1. 먼저 결과 확인',
    desc: '평생사주, 오늘의 운세, 궁합처럼 바로 쓰는 결과형 서비스를 먼저 제공합니다.',
    href: '/lifelong-saju',
    label: '결과형 서비스 보기',
  },
  {
    title: '2. 개념 이해하기',
    desc: '오행, 십신, 대운 같은 용어가 헷갈릴 때 운세 사전으로 바로 연결합니다.',
    href: '/fortune-dictionary',
    label: '운세 사전 보기',
  },
  {
    title: '3. 더 깊게 읽기',
    desc: '관계 운, 재물운, 건강운 같은 주제를 칼럼과 꿈해몽 허브에서 확장합니다.',
    href: '/guide',
    label: '칼럼 아카이브 보기',
  },
] as const;

export default function Home() {
  useCanonical('/');

  useEffect(() => {
    setHomeOGTags();
  }, []);

  const [hasBirth, setHasBirth] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setHasBirth(!!window.localStorage.getItem('muun_user_birth'));
  }, []);

  const handleBirthSaved = () => setHasBirth(true);
  const handleBirthDeleted = () => setHasBirth(false);

  const heroComponent = useMemo(
    () => (hasBirth ? <HeroReturnVisit onDeleteBirth={handleBirthDeleted} /> : <HeroFirstVisit onBirthSaved={handleBirthSaved} />),
    [hasBirth],
  );

  return (
    <div className="min-h-screen overflow-x-hidden antialiased mu-page-bg">
      <Helmet>
        <title>무료 사주 무운 (MuUn) - 회원가입 없는 100% 무료 사주풀이 및 2026년 운세</title>
        <meta name="description" content="회원가입 없이, 개인정보 저장 없이, 생년월일만으로 바로 확인하는 100% 무료 사주풀이. 2026년 병오년 신년운세, 토정비결, 궁합, 타로, 꿈해몽까지 모두 무료로 이용하세요." />
        <meta name="keywords" content="무료사주, 무료운세, 2026년운세, 사주풀이, 무료사주풀이, 신년운세, 병오년운세, 토정비결, 궁합, 만세력, 타로, 꿈해몽, 회원가입없는사주, 무료사주사이트" />
        <link rel="canonical" href="https://muunsaju.com/" />
        <meta property="og:title" content="무료 사주 무운 (MuUn) - 회원가입 없는 100% 무료 사주풀이" />
        <meta property="og:description" content="회원가입 없이, 개인정보 저장 없이, 생년월일만으로 바로 확인하는 100% 무료 사주풀이. 2026년 신년운세, 토정비결, 궁합, 타로까지 모두 무료!" />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:url" content="https://muunsaju.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="무료 사주 무운 (MuUn) - 회원가입 없는 100% 무료 사주풀이" />
        <meta name="twitter:description" content="회원가입 없이, 개인정보 저장 없이, 생년월일만으로 바로 확인하는 100% 무료 사주풀이 서비스." />
        <meta name="twitter:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <OrganizationSchema />
      <WebApplicationSchema />
      <SiteNavigationSchema />
      <BreadcrumbListSchema items={[{ name: '홈', url: 'https://muunsaju.com' }]} />

      <TrustBar />
      {heroComponent}

      <section className="mu-container-narrow relative z-10 -mt-6 pb-6">
        <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/90 shadow-[0_24px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="bg-[linear-gradient(135deg,#17114c_0%,#30208d_65%,#5f4bcb_100%)] px-5 py-6 text-white sm:px-7">
            <div className="mu-kicker">무료 사주 · 모바일 중심 서비스</div>
            <h2 className="mt-4 text-[28px] font-extrabold leading-[1.12] tracking-[-0.06em] text-white">
              결과만 보여주지 않고,
              <br />
              이해까지 이어지는 사주 서비스
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/80">
              무운은 평생사주와 오늘의 운세 같은 결과형 페이지를 먼저 보여주고, 필요한 개념은 운세 사전과 칼럼으로 자연스럽게 이어지도록 구성한 모바일 서비스입니다.
            </p>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {quickActions.map(({ href, label, Icon }) => (
                <Link key={href} href={href} className="inline-flex min-h-[38px] items-center gap-2 whitespace-nowrap rounded-full border border-white/14 bg-white/10 px-4 text-xs font-bold text-white backdrop-blur">
                  <Icon size={14} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="mu-auto-grid-220">
              {qualityNotes.map(({ title, desc, Icon }) => (
                <div key={title} className="mu-soft-card px-4 py-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6B5FFF]/10 text-[#5648db]">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <div className="mt-4 text-[17px] font-extrabold tracking-[-0.04em] text-slate-900">{title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mu-container-narrow pb-6">
        <div className="rounded-[30px] border border-slate-200/80 bg-white/84 p-4 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <span className="mu-divider-text">추천 서비스</span>
              <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.05em] text-slate-900">지금 많이 보는 운세와 리포트</h2>
            </div>
            <Link href="/more" className="inline-flex items-center gap-1 text-sm font-bold text-[#5748db]">
              전체 서비스 <ArrowRight size={14} />
            </Link>
          </div>
          <MainBanner />
        </div>
      </section>

      <section className="pb-2">
        <ServiceGrid />
      </section>

      <section className="mu-container-narrow py-6">
        <div className="grid gap-6">
          <HomeColumnSection />
          <HomeDictionarySection />
        </div>
      </section>

      <section className="mu-container-narrow pb-12">
        <div className="mu-glass-panel overflow-hidden p-6 sm:p-7">
          <div className="flex flex-col gap-5">
            <div>
              <span className="mu-divider-text">이용 흐름</span>
              <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.05em] text-slate-900">처음 들어온 사용자도 다음 행동이 보이도록 정리했습니다</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                무료 플랜 환경에서는 무거운 인터랙션보다 빠른 로딩과 명확한 동선이 중요해서, 한 화면에서 너무 많은 선택지를 보여주기보다 다음 이동이 또렷하게 보이도록 설계했습니다.
              </p>
            </div>

            <div className="mu-auto-grid-220">
              {journeyCards.map((card, index) => (
                <Link key={card.title} href={card.href} className="mu-link-card p-5">
                  <div className="inline-flex h-9 items-center rounded-full bg-[#6B5FFF]/10 px-3 text-xs font-bold text-[#5648db]">
                    STEP {index + 1}
                  </div>
                  <h3 className="mt-4 text-[20px] font-extrabold tracking-[-0.05em] text-slate-900">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{card.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#5748db]">
                    {card.label} <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>

            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
              <div className="mb-1 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                <BookMarked size={16} aria-hidden="true" /> 검색 최적화도 함께 고려
              </div>
              허브 페이지에서 전체 주제를 한눈에 보여주고, 상세 페이지에서는 본문·관련 사전어·관련 서비스로 자연스럽게 이어지도록 구조를 정리했습니다. 무료 플랜 환경에서도 무겁지 않게 동작하도록 정적 생성 중심 흐름을 유지합니다.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
