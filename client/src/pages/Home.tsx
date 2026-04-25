import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCanonical } from '@/lib/use-canonical';
import { setHomeOGTags } from '@/lib/og-tags';
import { OrganizationSchema, BreadcrumbListSchema, WebApplicationSchema, SiteNavigationSchema } from '@/components/SchemaMarkup';
import { HeroFirstVisit } from '@/components/HeroFirstVisit';
import { HeroReturnVisit } from '@/components/HeroReturnVisit';
import { MainBanner } from '@/components/MainBanner';
import { ServiceGrid } from '@/components/ServiceGrid';
import { HomeColumnSection } from '@/components/HomeColumnSection';
import { HomeDictionarySection } from '@/components/HomeDictionarySection';

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

      <section className="pb-1">
        <ServiceGrid />
      </section>

      <section className="mu-container-narrow px-4 py-5 md:py-7">
        <div className="rounded-[28px] border border-[#e9e8ff] bg-white/90 px-5 py-6 shadow-[0_20px_44px_rgba(15,23,42,0.08)] backdrop-blur sm:px-7">
          <div className="grid gap-5 md:grid-cols-[1.12fr_0.88fr] md:items-center">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#5b50d6]">Premium Experience</div>
              <h2 className="mt-2 text-[24px] font-extrabold tracking-[-0.04em] text-slate-900 sm:text-[30px]">
                필요한 운세를 빠르게 찾고, 결과는 깊이 있게 읽을 수 있게
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-[15px]">
                처음 방문자는 빠른 시작, 재방문자는 저장된 정보 기반 추천으로
                <br className="hidden sm:block" />
                끊김 없는 탐색 경험을 제공합니다.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">탐색</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">카테고리별 서비스</div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">분석</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">핵심 결과 우선 제공</div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">가독성</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">모바일 맞춤 레이아웃</div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">신뢰</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">개인정보 최소화</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-1">
        <MainBanner />
      </div>

      <section className="mu-container-narrow py-4 md:py-6">
        <div className="grid items-start gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <HomeColumnSection />
          <HomeDictionarySection />
        </div>
      </section>
    </div>
  );
}
