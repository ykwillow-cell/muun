import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCanonical } from '@/lib/use-canonical';
import { setHomeOGTags } from '@/lib/og-tags';
import { OrganizationSchema, BreadcrumbListSchema, WebApplicationSchema, SiteNavigationSchema } from "@/components/SchemaMarkup";
import { HeroFirstVisit } from "@/components/HeroFirstVisit";
import { HeroReturnVisit } from "@/components/HeroReturnVisit";
import { TrustBar } from "@/components/TrustBar";
import { MainBanner } from "@/components/MainBanner";
import { ServiceGrid } from "@/components/ServiceGrid";
import { HomeColumnSection } from "@/components/HomeColumnSection";
import { HomeDictionarySection } from "@/components/HomeDictionarySection";

export default function Home() {
  useCanonical('/');

  useEffect(() => {
    setHomeOGTags();
  }, []);

  const [hasBirth, setHasBirth] = useState<boolean>(
    () => !!localStorage.getItem("muun_user_birth")
  );
  const handleBirthSaved = () => setHasBirth(true);
  const handleBirthDeleted = () => setHasBirth(false);

  return (
    <div className="min-h-screen overflow-x-hidden antialiased" style={{ background: '#f2f4f6', color: '#191f28' }}>
      <Helmet>
        <title>무료 사주 무운 (MuUn) - 회원가입 없는 100% 무료 사주풀이 및 2026년 운세</title>
        <meta name="description" content="회원가입 없이, 개인정보 저장 없이, 생년월일만으로 바로 확인하는 100% 무료 사주풀이. 2026년 병오년 신년운세, 토정비결, 궁합, 타로, 꿈해몽까지 모든 서비스가 완전 무료입니다." />
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

      {/* Schema Markup */}
      <OrganizationSchema />
      <WebApplicationSchema />
      <SiteNavigationSchema />
      <BreadcrumbListSchema items={[
        { name: "홈", url: "https://muunsaju.com" },
      ]} />

      {/* 1. Trust Bar — AppBar 바로 아래 고정 */}
      <div style={{ background: '#ffffff', paddingTop: '8px' }}>
        <TrustBar />
      </div>

      {/* 2. Hero — 첫 방문 / 재방문 분기 (8px gray gap 위) */}
      <div style={{ height: '8px', background: '#F2F4F6' }} />
      {hasBirth ? (
        <HeroReturnVisit onDeleteBirth={handleBirthDeleted} />
      ) : (
        <HeroFirstVisit onBirthSaved={handleBirthSaved} />
      )}

      {/* 3. 메인 배너 (4장 Swiper) — Hero 아래 8px gap */}
      <div style={{ height: '8px', background: '#F2F4F6' }} />
      <MainBanner />

      {/* 4. 인기서비스 2×2 + 작명소 Spotlight + 더보기 2×3 (항상 노출) */}
      <ServiceGrid />

      {/* 5. 운세 칼럼 미리보기 */}
      <HomeColumnSection />

      {/* 6. 운세 사전 바로가기 */}
      <HomeDictionarySection />
    </div>
  );
}
