import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { ArrowRight, BookMarked, BookOpenText, MoonStar, Sparkles } from 'lucide-react';
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

const journeyCards = [
  {
    title: '먼저 결과 확인',
    desc: '평생사주, 오늘의 운세, 궁합처럼 바로 쓰는 결과형 서비스를 가장 먼저 보여줍니다.',
    href: '/lifelong-saju',
    label: '평생사주 시작',
    Icon: Sparkles,
  },
  {
    title: '개념 이해하기',
    desc: '오행, 십신, 대운 같은 용어가 낯설면 운세 사전으로 바로 연결합니다.',
    href: '/fortune-dictionary',
    label: '운세 사전 보기',
    Icon: BookMarked,
  },
  {
    title: '더 깊게 읽기',
    desc: '관계 운, 재물운, 건강운처럼 더 넓은 주제는 칼럼과 꿈해몽 허브에서 확장합니다.',
    href: '/guide',
    label: '운세 칼럼 보기',
    Icon: BookOpenText,
  },
] as const;

const secondaryLinks = [
  { href: '/guide', label: '운세 칼럼', Icon: BookOpenText },
  { href: '/dream', label: '꿈해몽', Icon: MoonStar },
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

      {heroComponent}
      <TrustBar />

      <div className="pb-2">
        <MainBanner />
      </div>

      <section className="mu-container-narrow pb-6">
        <div className="mu-glass-panel px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="mu-divider-text">무운의 흐름</span>
              <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.05em] text-slate-900">결과를 먼저 보고, 필요한 설명은 바로 이어서 읽게 만들었습니다</h2>
              <p className="mt-3 max-w-[42rem] text-sm leading-7 text-slate-700">
                무료 플랜 환경에서는 무거운 인터랙션보다 빠르게 뜨는 구조가 중요해서, 첫 화면에서 무엇을 할지 바로 알 수 있도록 서비스와 콘텐츠 흐름을 단순하게 정리했습니다.
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {secondaryLinks.map(({ href, label, Icon }) => (
                <Link key={href} href={href} className="mu-secondary-btn whitespace-nowrap">
                  <Icon size={15} aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-2">
        <ServiceGrid />
      </section>

      <section className="mu-container-narrow py-6">
        <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <HomeColumnSection />
          <HomeDictionarySection />
        </div>
      </section>

      <section className="mu-container-narrow pb-12">
        <div className="mu-glass-panel overflow-hidden p-5 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div>
              <span className="mu-divider-text">이용 흐름</span>
              <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.05em] text-slate-900">처음 들어와도 다음 행동이 보이도록 정리했습니다</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                홈에서는 결과형 서비스를 먼저 배치하고, 그다음에 운세 사전과 칼럼을 연결해 사용자가 한 번에 너무 많은 선택지를 보지 않도록 했습니다.
              </p>
              <div className="mt-5 rounded-[24px] border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
                <div className="mb-1 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                  검색 최적화도 함께 고려
                </div>
                허브 페이지에서 전체 주제를 한눈에 보여주고, 상세 페이지에서는 본문·관련 사전어·관련 서비스로 자연스럽게 이어지도록 구조를 유지했습니다.
              </div>
            </div>

            <div className="mu-auto-grid-220">
              {journeyCards.map(({ title, desc, href, label, Icon }, index) => (
                <Link key={title} href={href} className="mu-link-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6B5FFF]/10 text-[#5648db]">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">STEP {index + 1}</span>
                  </div>
                  <h3 className="mt-4 text-[20px] font-extrabold tracking-[-0.05em] text-slate-900">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#5748db]">
                    {label} <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
