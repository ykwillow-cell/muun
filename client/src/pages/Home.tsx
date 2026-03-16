import { Link } from "wouter";
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCanonical } from '@/lib/use-canonical';
import { setHomeOGTags } from '@/lib/og-tags';
import { motion } from "framer-motion";
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

export default function Home() {
  useCanonical('/');
  
  useEffect(() => {
    setHomeOGTags();
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  // GA 분석 기반 메뉴 순서 재배치
  const menuItems = [
    { 
      href: "/yearly-fortune", 
      label: "신년운세", 
      icon: <Star className="w-5 h-5" />, 
      color: "bg-yellow-500/20 text-yellow-400",
      desc: "2026년 총운 확인"
    },
    { 
      href: "/lifelong-saju", 
      label: "평생사주", 
      icon: <Sparkles className="w-5 h-5" />, 
      color: "bg-blue-500/20 text-blue-400",
      desc: "타고난 기질과 운명"
    },
    { 
      href: "/family-saju", 
      label: "가족사주", 
      icon: <Users className="w-5 h-5" />, 
      color: "bg-orange-500/20 text-orange-400",
      desc: "가족 오행 조화 분석",
      featured: true
    },
    { 
      href: "/tarot", 
      label: "타로", 
      icon: <Sparkles className="w-5 h-5" />, 
      color: "bg-purple-500/20 text-purple-400",
      desc: "신비로운 타로 상담",
      featured: true
    },
    { 
      href: "/tojeong", 
      label: "토정비결", 
      icon: <ScrollText className="w-5 h-5" />, 
      color: "bg-yellow-500/20 text-yellow-400",
      desc: "일 년의 흐름 보기"
    },
    { 
      href: "/compatibility", 
      label: "궁합", 
      icon: <Heart className="w-5 h-5" />, 
      color: "bg-pink-500/20 text-pink-400",
      desc: "찰떡궁합 확인",
      featured: true
    },
    { 
      href: "/hybrid-compatibility", 
      label: "사주xMBTI 궁합", 
      icon: <Brain className="w-5 h-5" />, 
      color: "bg-purple-500/20 text-purple-400",
      desc: "사주와 성격, 둘 다 보는 궁합"
    },
    { 
      href: "/manselyeok", 
      label: "만세력", 
      icon: <CalendarDays className="w-5 h-5" />, 
      color: "bg-blue-500/20 text-blue-400",
      desc: "정확한 사주 데이터"
    },
    { 
      href: "/astrology", 
      label: "점성술", 
      icon: <Star className="w-5 h-5" />, 
      color: "bg-indigo-500/20 text-indigo-400",
      desc: "별의 메시지"
    },
    { 
      href: "/daily-fortune", 
      label: "오늘의 운세", 
      icon: <Zap className="w-5 h-5" />, 
      color: "bg-green-500/20 text-green-400",
      desc: "오늘의 행운 확인"
    },
    { 
      href: "/psychology", 
      label: "심리테스트", 
      icon: <BrainCircuit className="w-5 h-5" />, 
      color: "bg-pink-500/20 text-pink-400",
      desc: "나의 진짜 성격 찾기"
    },
    { 
      href: "/lucky-lunch", 
      label: "행운의 점심 메뉴", 
      icon: <Coffee className="w-5 h-5" />, 
      color: "bg-amber-500/20 text-amber-400",
      desc: "사주에 맞는 추천 메뉴"
    },
    { 
      href: "/dream", 
      label: "꿈해몽", 
      icon: <CloudMoon className="w-5 h-5" />, 
      color: "bg-indigo-500/20 text-indigo-400",
      desc: "어젯밤 꿈의 의미 찾기"
    },
    { 
      href: "/naming", 
      label: "작명소", 
      icon: <PenLine className="w-5 h-5" />, 
      color: "bg-emerald-500/20 text-emerald-400",
      desc: "81수리 기반 무료 작명",
      isNew: true
    },

  ];

  // 인기 서비스 (가로 스크롤용) - 명시적 순서 지정
  const popularOrder = ["/family-saju", "/hybrid-compatibility", "/tarot", "/compatibility", "/yearly-fortune"];
  const popularItems = popularOrder
    .map(href => menuItems.find(item => item.href === href))
    .filter((item): item is typeof menuItems[number] => !!item);

  const handleCategoryClick = (label: string) => {
    trackCustomEvent("select_fortune_category", {
      fortune_type: label
    });
  };

  const commonMaxWidth = "max-w-4xl mx-auto";
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative antialiased">
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

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10">
        
        {/* Hero Section — localStorage 분기 (첫 방문 / 재방문) */}
        {hasBirth ? (
          <HeroReturnVisit onDeleteBirth={handleBirthDeleted} />
        ) : (
          <HeroFirstVisit onBirthSaved={handleBirthSaved} />
        )}

        {/* Main Banner — Embla Carousel */}
        <MainBanner />

        {/* Popular Services — v3 시안 스타일 */}
        <section className="py-4 px-4 border-b border-white/[0.07]">
          <div className={commonMaxWidth}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-white/30">인기 서비스</span>
              </div>
              <Link href="/" onClick={() => handleCategoryClick("전체보기")}>
                <span className="text-[12px] text-white/30 hover:text-white/50 transition-colors cursor-pointer">전체보기 →</span>
              </Link>
            </div>

            {/* 모바일: 가로 스크롤 / PC: 5열 그리드 */}
            <div
              ref={scrollContainerRef}
              className="flex md:grid md:grid-cols-5 gap-2.5 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0 snap-x snap-mandatory md:snap-none scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {popularItems.map((item, index) => (
                <Link key={index} href={item.href} onClick={() => handleCategoryClick(item.label)} className="flex-shrink-0 md:flex-shrink">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-[130px] md:w-full snap-start p-3.5 md:p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-primary/30 hover:bg-white/[0.07] transition-all cursor-pointer h-full"
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-2.5 border border-white/10`}>
                      {item.icon}
                    </div>
                    <h3 className="text-[13px] font-semibold text-white mb-0.5 leading-snug">{item.label}</h3>
                    <p className="text-[11px] text-white/40 line-clamp-2 leading-snug">{item.desc}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Dream Quick Search Section */}
        <DreamQuickSearch />

        {/* All Services Grid — v3 시안 스타일 */}
        <section className="px-4 py-5 md:py-8 border-b border-white/[0.07]">
          <div className={commonMaxWidth}>
            {/* 섹션 헤더 */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-white/30">전체 서비스</span>
            </div>

            {/* 작명소 Spotlight 레이 — v3 시안 */}
            <Link href="/naming" onClick={() => handleCategoryClick("작명소(Spotlight)")}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center justify-between p-4 rounded-2xl border border-primary/30 hover:border-primary/60 bg-gradient-to-r from-primary/10 to-emerald-500/5 transition-all cursor-pointer mb-3 overflow-hidden"
              >
                {/* 워터마크 */}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[48px] font-black text-primary/5 select-none pointer-events-none leading-none">字</span>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[13px] font-bold text-white">작명소</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">NEW</span>
                    </div>
                    <p className="text-[11px] text-white/40">81수리 기반 무료 작명</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all flex-shrink-0 relative z-10">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </Link>

            {/* 서비스 그리드 — 작명소 제외 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
              {menuItems.filter(item => item.href !== '/naming').map((item, index) => (
                <Link key={index} href={item.href} onClick={() => handleCategoryClick(item.label)}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group p-3.5 md:p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-primary/30 hover:bg-white/[0.07] transition-all cursor-pointer h-full"
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-2.5 border border-white/10`}>
                      {item.icon}
                    </div>
                    <div className="flex items-center gap-1 mb-0.5">
                      <h3 className="text-[13px] font-semibold text-white group-hover:text-primary transition-colors leading-snug">{item.label}</h3>
                    </div>
                    <p className="text-[11px] text-white/40 line-clamp-2 leading-snug">{item.desc}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Today's Term - 오늘의 사주 용어 */}
        <section className="px-4 py-4 border-b border-white/[0.07]">
          <div className={commonMaxWidth}>
            <TodayTermCard />
          </div>
        </section>

        {/* Latest Columns Section — 콤팩트 리스트 형태 */}
        <section className="px-4 py-4 border-b border-white/[0.07]">
          <div className={commonMaxWidth}>
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
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/guide/${column.slug || column.id}`}>
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition — v3 시안 스타일 */}
        <section className="px-4 py-6 md:py-10">
          <div className={commonMaxWidth}>
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
          </div>
        </section>
      </main>
    </div>
  );
}
