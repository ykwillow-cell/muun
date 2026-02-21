import { Link } from "wouter";
import { useEffect } from 'react';
import { useCanonical } from '@/lib/use-canonical';
import { setHomeOGTags } from '@/lib/og-tags';
import { motion } from "framer-motion";
import { BookOpen, Star, ShieldCheck, Info, BrainCircuit, ScrollText, Sparkles, Heart, CalendarDays, ArrowRight, Zap, ChevronRight, Users, Brain, Coffee, CloudMoon } from "lucide-react";
import { trackCustomEvent } from "@/lib/ga4";
import { useRef } from "react";
import { TodayTermCard } from "@/components/TodayTermCard";
import { DreamQuickSearch } from "@/components/DreamQuickSearch";
import { OrganizationSchema, BreadcrumbListSchema } from "@/components/SchemaMarkup";
import { fortuneGuides } from "@/lib/fortune-guide";
import { getLatestColumns, COLUMN_CATEGORIES } from "@/lib/column-data";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function Home() {
  useCanonical('/');
  
  useEffect(() => {
    setHomeOGTags();
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      label: "오늘의 타로", 
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
  const latestColumns = getLatestColumns(3);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative antialiased">
      {/* Schema Markup */}
      <OrganizationSchema />
      <BreadcrumbListSchema items={[
        { name: "홈", url: "https://muunsaju.com" },
      ]} />

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10">
        
        {/* Hero Section - 컴팩트 모바일 우선 */}
        <section className="px-4 pt-6 pb-6 md:pt-12 md:pb-8 text-center bg-gradient-to-b from-primary/5 to-transparent">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`${commonMaxWidth} space-y-4 md:space-y-6`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[11px] md:text-xs font-bold tracking-widest text-primary uppercase">가입 없는 무료 운세</span>
            </div>
            
            <h1 className="text-[1.75rem] md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.3]">
              30년 내공의 명리학,<br />
              <span className="bg-gradient-to-r from-primary via-yellow-200 to-primary bg-clip-text text-transparent">운명을 읽다</span>
            </h1>
            
            <p className="text-sm md:text-base text-muted-foreground">
              회원가입 없이 바로 확인하는 프리미엄 운세 서비스
            </p>
          </motion.div>
        </section>

        {/* Quick Actions - 핵심 CTA (모바일 최적화) */}
        <section className="px-4 pb-6 md:pb-8">
          <div className={`${commonMaxWidth} flex flex-col md:flex-row gap-3 md:gap-4`}>
            <Link href="/yearly-fortune" onClick={() => handleCategoryClick("신년운세(퀵액션)")} className="flex-1">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-between p-4 md:p-5 rounded-2xl bg-gradient-to-r from-primary/15 to-yellow-500/10 border border-primary/30 hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-primary rounded-xl flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
                    <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663329919991/ADofygAMfynBhdKC.png" alt="2026 신년운세" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-white">2026 신년운세</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">내 한 해의 운세 흐름 확인</p>
                  </div>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all flex-shrink-0">
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </motion.div>
            </Link>
            
            <Link href="/lifelong-saju" onClick={() => handleCategoryClick("평생사주(퀵액션)")} className="flex-1">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-between p-4 md:p-5 rounded-2xl bg-gradient-to-r from-blue-500/15 to-purple-500/10 border border-blue-500/30 hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-500 rounded-xl flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
                    🔮
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-white">평생사주 분석</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">타고난 기질과 운명 확인</p>
                  </div>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all flex-shrink-0">
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </motion.div>
            </Link>
          </div>
        </section>

        {/* Popular Services - 가로 스크롤 (모바일) / 그리드 (PC) */}
        <section className="py-6 md:py-8 px-4">
          <div className={commonMaxWidth}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <span className="text-xl">🔥</span> 지금 인기 서비스
              </h2>
              <span className="text-xs md:text-sm text-muted-foreground md:hidden">← 스크롤 →</span>
            </div>
            
            {/* 모바일: 가로 스크롤 / PC: 5열 그리드 */}
            <div 
              ref={scrollContainerRef}
              className="flex md:grid md:grid-cols-5 gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 snap-x snap-mandatory md:snap-none scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {popularItems.map((item, index) => (
                <Link key={index} href={item.href} onClick={() => handleCategoryClick(item.label)} className="flex-shrink-0 md:flex-shrink">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-[140px] md:w-full snap-start p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all cursor-pointer h-full"
                  >
                    <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                      {item.icon}
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-white mb-1">{item.label}</h3>
                    <p className="text-[11px] md:text-xs text-muted-foreground line-clamp-2">{item.desc}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Dream Quick Search Section */}
        <DreamQuickSearch />

        {/* All Services Grid - 2열 모바일 / 4열 데스크톱 */}
        <section className="px-4 py-6 md:py-8">
          <div className={commonMaxWidth}>
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">전체 서비스</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {menuItems.map((item, index) => (
                <Link key={index} href={item.href} onClick={() => handleCategoryClick(item.label)}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all cursor-pointer h-full"
                  >
                    <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                      {item.icon}
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-white group-hover:text-primary transition-colors mb-1">{item.label}</h3>
                    <p className="text-[11px] md:text-xs text-muted-foreground line-clamp-2">{item.desc}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Today's Term - 오늘의 사주 용어 */}
        <section className="px-4 py-6 md:py-8">
          <div className={commonMaxWidth}>
            <TodayTermCard />
          </div>
        </section>

        {/* Value Proposition - 가치 제안 */}
        <section className="px-4 py-8 md:py-12 bg-gradient-to-b from-transparent to-primary/5">
          <div className={commonMaxWidth}>
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-lg md:text-2xl font-bold text-white mb-2">왜 무운인가요?</h2>
              <p className="text-xs md:text-sm text-muted-foreground">무운만의 세 가지 약속</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-white">정밀한 알고리즘</h3>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  30년 경력 명리학 전문가의 데이터를 바탕으로 한 현대적 분석 시스템
                </p>
              </div>
              
              <div className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-white">완벽한 익명성</h3>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  모든 계산은 브라우저에서 처리되며, 개인정보는 서버에 저장되지 않습니다
                </p>
              </div>
              
              <div className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-white">진짜 무료</h3>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  회원가입, 결제 유도 없이 모든 프리미엄 콘텐츠를 무료로 제공합니다
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Columns Section - 전문 칼럼 보강 */}
        <section className="px-4 py-12 md:py-16 bg-white/5 border-t border-white/10">
          <div className={commonMaxWidth}>
            <div className="flex justify-between items-end mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 mb-3">
                  <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Insight</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-7 h-7 text-primary" />
                  최신 운세 칼럼
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">30년 내공의 역술인이 전하는 삶의 지혜</p>
              </div>
              <Link href="/guide">
                <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 gap-1 group hidden md:flex">
                  전체보기 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestColumns.map((column, index) => (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <Link href={`/guide/${column.id}`}>
                    <div className="group cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 hover:bg-white/10 transition-all h-full flex flex-col">
                      <div className="aspect-video overflow-hidden bg-white/5 relative">
                        <img
                          src={column.thumbnail}
                          alt={column.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${COLUMN_CATEGORIES[column.category as keyof typeof COLUMN_CATEGORIES]?.color || 'bg-white/10 text-white/70'}`}>
                            {column.categoryLabel}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {column.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                          {column.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {new Date(column.publishedDate).toLocaleDateString('ko-KR')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {column.readTime}분
                            </span>
                          </div>
                          <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            읽어보기 <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 md:hidden">
              <Link href="/guide">
                <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 py-6 rounded-xl font-bold">
                  전체 칼럼 보기
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
