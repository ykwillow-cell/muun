import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { ArrowRight, BookOpenText, MoonStar, Sparkles, HeartHandshake } from 'lucide-react';
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

const quickActions = [
  { href: '/lifelong-saju', label: '평생사주 시작', Icon: Sparkles },
  { href: '/compatibility', label: '궁합 보기', Icon: HeartHandshake },
  { href: '/guide', label: '운세 칼럼 읽기', Icon: BookOpenText },
  { href: '/dream', label: '꿈해몽 찾기', Icon: MoonStar },
] as const;

const trustPoints = [
  '회원가입 없이 바로 확인',
  '무료 서비스 중심 구성',
  '칼럼·사전·꿈해몽까지 내부 연결 강화',
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
    () =>
      hasBirth ? (
        <HeroReturnVisit onDeleteBirth={handleBirthDeleted} />
      ) : (
        <HeroFirstVisit onBirthSaved={handleBirthSaved} />
      ),
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

      <div>
        <TrustBar />
        {heroComponent}
      </div>

      <section className="mu-container-narrow -mt-6 relative z-10 pb-6">
        <div className="mu-glass-panel p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <span className="mu-section-eyebrow">회원가입 없는 무료 사주</span>
              <h2 className="mu-section-title mt-4">사주 풀이부터 꿈해몽까지, 한 번에 이어지는 탐색 구조</h2>
              <p className="mu-section-description mt-3">
                무운은 무료 사주풀이, 2026년 신년운세, 궁합, 만세력, 타로, 꿈해몽, 운세 사전, 운세 칼럼을 한곳에 모은 모바일 중심 서비스입니다.
                처음엔 결과를 빠르게 보고, 이어서 칼럼과 사전으로 개념을 이해하도록 화면과 내부 링크를 정리했습니다.
              </p>
            </div>

            <div className="mu-chip-row">
              {quickActions.map(({ href, label, Icon }) => (
                <Link key={href} href={href} className="mu-chip">
                  <Icon size={14} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {trustPoints.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mu-container-narrow pb-6">
        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <span className="mu-divider-text">추천 서비스</span>
              <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.05em] text-slate-900">지금 바로 많이 보는 운세</h2>
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
        <div className="mu-glass-panel p-6 sm:p-7">
          <span className="mu-divider-text">무운 이용 가이드</span>
          <div className="mt-4 grid gap-4 md:grid-cols-[1.3fr_1fr] md:items-end">
            <div>
              <h2 className="text-[26px] font-extrabold tracking-[-0.05em] text-slate-900">검색 유입에도 강한 구조로 계속 다듬고 있습니다</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                허브 페이지에서 전체 주제를 한눈에 보여주고, 상세 페이지에서는 본문·관련 사전어·관련 서비스로 자연스럽게 이어지도록 설계했습니다.
                무료 플랜 환경에서도 무겁지 않게 동작하도록 정적 생성 중심으로 유지합니다.
              </p>
            </div>
            <div className="grid gap-3">
              <Link href="/guide" className="mu-link-card px-5 py-4">
                <div className="text-sm font-bold text-slate-900">운세 칼럼으로 더 읽기</div>
                <div className="mt-1 text-sm text-slate-500">사주 기초, 개운법, 관계 운 등 주제별 아카이브</div>
              </Link>
              <Link href="/fortune-dictionary" className="mu-link-card px-5 py-4">
                <div className="text-sm font-bold text-slate-900">운세 사전으로 개념 정리</div>
                <div className="mt-1 text-sm text-slate-500">오행·십신·대운 같은 핵심 용어를 쉽게 풀이</div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
