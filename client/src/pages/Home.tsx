import { Link } from "wouter";
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCanonical } from '@/lib/use-canonical';
import { setHomeOGTags } from '@/lib/og-tags';
import { BookOpen, Star, ShieldCheck, Info, BrainCircuit, ScrollText, Sparkles, Heart, CalendarDays, ArrowRight, Zap, ChevronRight, Users, Brain, Coffee, CloudMoon, Scroll, PenLine } from "lucide-react";
import { trackCustomEvent } from "@/lib/ga4";
import { useRef } from "react";
import { TodayTermCard } from "@/components/TodayTermCard";
import { DreamQuickSearch } from "@/components/DreamQuickSearch";
import { OrganizationSchema, BreadcrumbListSchema, WebApplicationSchema, SiteNavigationSchema } from "@/components/SchemaMarkup";
import { fortuneGuides } from "@/lib/fortune-guide";
import { getFeaturedColumns, COLUMN_CATEGORIES } from "@/lib/column-data-api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { HeroFirstVisit } from "@/components/HeroFirstVisit";
import { HeroReturnVisit } from "@/components/HeroReturnVisit";
import { MainBanner } from "@/components/MainBanner";
import { ServiceGrid } from "@/components/ServiceGrid";

export default function Home() {
  useCanonical('/');
  
  useEffect(() => {
    setHomeOGTags();
  }, []);

  const [latestColumns, setLatestColumns] = useState<any[]>([]);
  const [columnsLoading, setColumnsLoading] = useState(true);
  const [hasBirth, setHasBirth] = useState<boolean>(
    () => !!localStorage.getItem("muun_user_birth")
  );
  const handleBirthSaved = () => setHasBirth(true);
  const handleBirthDeleted = () => setHasBirth(false);

  useEffect(() => {
    getFeaturedColumns()
      .then((cols) => setLatestColumns(cols))
      .catch(() => setLatestColumns([]))
      .finally(() => setColumnsLoading(false));
  }, []);

  const handleCategoryClick = (label: string) => {
    trackCustomEvent("select_fortune_category", {
      fortune_type: label
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden antialiased">
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

      {/* 1. Hero Section — localStorage 분기 (첫 방문 / 재방문) */}
      {hasBirth ? (
        <HeroReturnVisit onDeleteBirth={handleBirthDeleted} />
      ) : (
        <HeroFirstVisit onBirthSaved={handleBirthSaved} />
      )}

      {/* 2. Main Banner — Embla Carousel */}
      <MainBanner />

      {/* 3. 인기 서비스 + 작명소 Spotlight + 더보기 그리드 */}
      <ServiceGrid />

      {/* 4. Dream Quick Search */}
      <DreamQuickSearch />

      {/* 5. Today's Term */}
      <section className="px-4 py-4 border-b border-white/[0.07]">
        <TodayTermCard />
      </section>

      {/* 6. Latest Columns */}
      <section className="px-4 py-4 border-b border-white/[0.07]">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-primary/60" />
            <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-white/30">운세 칼럼</span>
          </div>
          <Link href="/guide">
            <span className="flex items-center gap-0.5 text-[11px] text-primary/60 hover:text-primary transition-colors">
              전체보기 <ChevronRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        {/* 칼럼 리스트 */}
        <div className="space-y-2">
          {columnsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-white/10 rounded w-3/4" />
                  <div className="h-2.5 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : latestColumns.length === 0 ? (
            <div className="text-center py-8 text-[13px] text-white/30">등록된 칼럼이 없습니다.</div>
          ) : latestColumns.map((column, index) => (
            <Link key={column.id} href={`/guide/${column.slug || column.id}`}>
              <div className="group flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/25 hover:bg-white/[0.06] transition-all cursor-pointer">
                {/* 썸네일 */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-purple-500/20 flex-shrink-0 relative">
                  <img
                    src={column.thumbnail}
                    alt={column.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white/20">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                {/* 텍스트 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${COLUMN_CATEGORIES[column.category as keyof typeof COLUMN_CATEGORIES]?.color || 'bg-white/10 text-white/50'}`}>
                      {column.categoryLabel}
                    </span>
                    <span className="text-[10px] text-white/25">
                      <CalendarDays className="w-2.5 h-2.5 inline mr-0.5" />
                      {new Date(column.publishedDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-[13px] font-semibold text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {column.title}
                  </h3>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-primary/60 transition-colors flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Value Proposition */}
      <section className="px-4 py-6 md:py-10">
        <div className="mb-4">
          <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-white/30 block mb-1">왜 무운인가요?</span>
          <h2 className="text-[18px] md:text-2xl font-bold text-white">무운만의 세 가지 약속</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-3">
          <div className="p-4 md:p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-[14px] font-bold text-white">정밀한 알고리즘</h3>
            </div>
            <p className="text-[12px] text-white/40 leading-relaxed">
              30년 경력 명리학 전문가의 데이터를 바탕으로 한 현대적 분석 시스템
            </p>
          </div>

          <div className="p-4 md:p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-[14px] font-bold text-white">완벽한 익명성</h3>
            </div>
            <p className="text-[12px] text-white/40 leading-relaxed">
              모든 계산은 브라우저에서 처리되며, 개인정보는 서버에 저장되지 않습니다
            </p>
          </div>

          <div className="p-4 md:p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-[14px] font-bold text-white">진짜 무료</h3>
            </div>
            <p className="text-[12px] text-white/40 leading-relaxed">
              회원가입, 결제 유도 없이 모든 프리미엄 콘텐츠를 무료로 제공합니다
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
