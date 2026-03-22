import { useState } from 'react';
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Star, Calendar, Heart, BookOpen, Moon,
  Brain, Globe, Layers, Users, PenLine, Clock,
  Compass, ChevronRight
} from "lucide-react";

/* ── 서비스 카테고리 데이터 ── */
const CATEGORIES = [
  {
    id: "saju",
    label: "사주·운세",
    icon: <Sparkles size={15} />,
    color: "text-yellow-500",
    activeBg: "bg-yellow-500",
    services: [
      {
        href: "/yearly-fortune",
        icon: <Star size={20} />,
        iconBg: "bg-yellow-500/15 text-yellow-500",
        label: "신년운세",
        desc: "2026 병오년",
        badge: "인기",
        badgeColor: "bg-yellow-500/20 text-yellow-700",
      },
      {
        href: "/lifelong-saju",
        icon: <Sparkles size={20} />,
        iconBg: "bg-blue-500/15 text-blue-500",
        label: "평생사주",
        desc: "평생 운명 풀이",
        badge: "인기",
        badgeColor: "bg-yellow-500/20 text-yellow-700",
      },
      {
        href: "/daily-fortune",
        icon: <Clock size={20} />,
        iconBg: "bg-orange-500/15 text-orange-500",
        label: "오늘의 운세",
        desc: "오늘 하루 운세",
      },
      {
        href: "/tojeong",
        icon: <BookOpen size={20} />,
        iconBg: "bg-emerald-500/15 text-emerald-500",
        label: "토정비결",
        desc: "전통 한 해 운세",
      },
      {
        href: "/manselyeok",
        icon: <Calendar size={20} />,
        iconBg: "bg-teal-500/15 text-teal-500",
        label: "만세력",
        desc: "사주팔자 조견표",
      },
    ],
  },
  {
    id: "relation",
    label: "관계·궁합",
    icon: <Heart size={15} />,
    color: "text-pink-500",
    activeBg: "bg-pink-500",
    services: [
      {
        href: "/compatibility",
        icon: <Heart size={20} />,
        iconBg: "bg-pink-500/15 text-pink-500",
        label: "궁합",
        desc: "두 사람의 인연",
        badge: "인기",
        badgeColor: "bg-yellow-500/20 text-yellow-700",
      },
      {
        href: "/hybrid-compatibility",
        icon: <Brain size={20} />,
        iconBg: "bg-purple-500/15 text-purple-500",
        label: "사주×MBTI",
        desc: "MBTI 결합 궁합",
        badge: "NEW",
        badgeColor: "bg-purple-500/20 text-purple-700",
      },
      {
        href: "/family-saju",
        icon: <Users size={20} />,
        iconBg: "bg-green-500/15 text-green-500",
        label: "가족사주",
        desc: "가족 사주 분석",
      },
    ],
  },
  {
    id: "mystic",
    label: "신비·점술",
    icon: <Moon size={15} />,
    color: "text-indigo-500",
    activeBg: "bg-indigo-500",
    services: [
      {
        href: "/tarot",
        icon: <Layers size={20} />,
        iconBg: "bg-purple-500/15 text-purple-500",
        label: "타로",
        desc: "78장 타로 상담",
      },
      {
        href: "/astrology",
        icon: <Globe size={20} />,
        iconBg: "bg-teal-500/15 text-teal-500",
        label: "점성술",
        desc: "서양 별자리 운명",
      },
      {
        href: "/dream",
        icon: <Moon size={20} />,
        iconBg: "bg-indigo-500/15 text-indigo-500",
        label: "꿈해몽",
        desc: "꿈의 의미 풀이",
      },
    ],
  },
  {
    id: "life",
    label: "생활·기타",
    icon: <Star size={15} />,
    color: "text-amber-500",
    activeBg: "bg-amber-500",
    services: [
      {
        href: "/naming",
        icon: <PenLine size={20} />,
        iconBg: "bg-emerald-500/15 text-emerald-500",
        label: "작명소",
        desc: "무료 이름 풀이",
        badge: "NEW",
        badgeColor: "bg-emerald-500/20 text-emerald-700",
      },
      {
        href: "/psychology",
        icon: <Brain size={20} />,
        iconBg: "bg-violet-500/15 text-violet-500",
        label: "심리테스트",
        desc: "나를 알아가기",
      },
      {
        href: "/fortune-dictionary",
        icon: <BookOpen size={20} />,
        iconBg: "bg-stone-500/15 text-stone-500",
        label: "사주 사전",
        desc: "명리학 용어 해설",
      },
      {
        href: "/lucky-lunch",
        icon: <Star size={20} />,
        iconBg: "bg-yellow-500/15 text-yellow-500",
        label: "행운 점심",
        desc: "오늘의 추천 메뉴",
      },
      {
        href: "/guide",
        icon: <BookOpen size={20} />,
        iconBg: "bg-blue-500/15 text-blue-500",
        label: "운세 칼럼",
        desc: "명리학 읽을거리",
      },
    ],
  },
];

export default function More() {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id);
  const activeCategory = CATEGORIES.find(c => c.id === activeTab) || CATEGORIES[0];

  return (
    <>
      <Helmet>
        <title>전체 서비스 | 무운(MuUn) — 무료 사주·운세</title>
        <meta name="description" content="무운의 모든 무료 서비스를 한눈에 확인하세요. 신년운세, 평생사주, 궁합, 타로, 꿈해몽, 작명소 등 다양한 서비스 제공." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        {/* 페이지 헤더 */}
        <div className="px-4 pt-5 pb-3">
          <h1 className="text-[20px] font-bold text-[#1a1a18] leading-tight">
            전체 서비스
          </h1>
          <p className="text-[12px] text-[#999891] mt-0.5">
            회원가입 없이 모두 무료로 이용하세요
          </p>
        </div>

        {/* 카테고리 탭 */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? `${cat.activeBg} text-white shadow-sm`
                      : 'bg-black/[0.06] text-[#5a5a56] hover:bg-black/[0.09]'
                  }`}
                >
                  <span className={isActive ? 'text-white' : cat.color}>{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 서비스 그리드 */}
        <div className="px-4 pb-24 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-2 gap-3"
            >
              {activeCategory.services.map((svc, idx) => (
                <motion.div
                  key={svc.href}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Link href={svc.href}>
                    <div className="group relative flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-black/[0.08] hover:border-primary/25 hover:bg-black/[0.03] active:scale-[0.97] transition-all cursor-pointer h-full min-h-[110px] justify-center gap-2.5">
                      {/* 배지 */}
                      {svc.badge && (
                        <span className={`absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${svc.badgeColor}`}>
                          {svc.badge}
                        </span>
                      )}
                      {/* 아이콘 */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${svc.iconBg}`}>
                        {svc.icon}
                      </div>
                      {/* 텍스트 */}
                      <div>
                        <p className="text-[13px] font-bold text-[#1a1a18] group-hover:text-primary transition-colors leading-tight">
                          {svc.label}
                        </p>
                        <p className="text-[11px] text-[#1a1a18]/40 mt-0.5 leading-snug">
                          {svc.desc}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
