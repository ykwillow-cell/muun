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

      <section className="pb-2">
        <ServiceGrid />
      </section>

      <div className="pb-2">
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
