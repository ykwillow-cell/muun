import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Sparkles, Star, Calendar, Heart, BookOpen, Moon,
  Brain, Globe, Layers, Users, PenLine, Clock,
  ChevronRight, Compass
} from "lucide-react";

/* ── 서비스 카테고리 데이터 ── */
const CATEGORIES = [
  {
    id: "saju",
    label: "사주 · 운세",
    icon: <Sparkles size={14} />,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    services: [
      {
        href: "/yearly-fortune",
        icon: <Star size={18} />,
        iconBg: "bg-yellow-500/15 border-yellow-500/25 text-yellow-400",
        label: "신년운세",
        desc: "2026 병오년 한 해 운세 풀이",
        badge: "인기",
        badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      },
      {
        href: "/lifelong-saju",
        icon: <Sparkles size={18} />,
        iconBg: "bg-blue-500/15 border-blue-500/25 text-blue-400",
        label: "평생사주",
        desc: "사주팔자로 보는 평생 운명",
        badge: "인기",
        badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      },
      {
        href: "/tojeong",
        icon: <BookOpen size={18} />,
        iconBg: "bg-emerald-500/15 border-emerald-500/25 text-emerald-400",
        label: "토정비결",
        desc: "전통 토정비결로 보는 한 해 운세",
      },
      {
        href: "/daily-fortune",
        icon: <Clock size={18} />,
        iconBg: "bg-orange-500/15 border-orange-500/25 text-orange-400",
        label: "오늘의 운세",
        desc: "오늘 하루 사주 기반 운세",
      },
      {
        href: "/manselyeok",
        icon: <Calendar size={18} />,
        iconBg: "bg-teal-500/15 border-teal-500/25 text-teal-400",
        label: "만세력",
        desc: "사주팔자 · 대운 · 세운 조견표",
      },
    ],
  },
  {
    id: "relation",
    label: "관계 · 궁합",
    icon: <Heart size={14} />,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    services: [
      {
        href: "/compatibility",
        icon: <Heart size={18} />,
        iconBg: "bg-pink-500/15 border-pink-500/25 text-pink-400",
        label: "궁합",
        desc: "사주로 보는 두 사람의 인연",
        badge: "인기",
        badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      },
      {
        href: "/hybrid-compatibility",
        icon: <Brain size={18} />,
        iconBg: "bg-purple-500/15 border-purple-500/25 text-purple-400",
        label: "사주 × MBTI 궁합",
        desc: "사주와 MBTI를 결합한 궁합 분석",
        badge: "NEW",
        badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      },
      {
        href: "/family-saju",
        icon: <Users size={18} />,
        iconBg: "bg-green-500/15 border-green-500/25 text-green-400",
        label: "가족사주",
        desc: "가족 구성원의 사주 한눈에 보기",
      },
    ],
  },
  {
    id: "mystic",
    label: "신비 · 점술",
    icon: <Moon size={14} />,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    services: [
      {
        href: "/tarot",
        icon: <Layers size={18} />,
        iconBg: "bg-purple-500/15 border-purple-500/25 text-purple-400",
        label: "타로",
        desc: "78장 타로카드로 보는 현재와 미래",
      },
      {
        href: "/astrology",
        icon: <Globe size={18} />,
        iconBg: "bg-teal-500/15 border-teal-500/25 text-teal-400",
        label: "점성술",
        desc: "서양 별자리로 보는 운명",
      },
      {
        href: "/dream",
        icon: <Moon size={18} />,
        iconBg: "bg-indigo-500/15 border-indigo-500/25 text-indigo-400",
        label: "꿈해몽",
        desc: "꿈의 의미와 길흉 풀이",
      },
      {
        href: "/past-life",
        icon: <Compass size={18} />,
        iconBg: "bg-rose-500/15 border-rose-500/25 text-rose-400",
        label: "전생",
        desc: "사주로 보는 나의 전생",
      },
    ],
  },
  {
    id: "life",
    label: "생활 · 기타",
    icon: <Star size={14} />,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    services: [
      {
        href: "/naming",
        icon: <PenLine size={18} />,
        iconBg: "bg-emerald-500/15 border-emerald-500/25 text-emerald-400",
        label: "작명소",
        desc: "81수리 기반 무료 이름 풀이",
        badge: "NEW",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      },
      {
        href: "/psychology",
        icon: <Brain size={18} />,
        iconBg: "bg-violet-500/15 border-violet-500/25 text-violet-400",
        label: "심리테스트",
        desc: "나를 알아가는 심리 분석",
      },
      {
        href: "/fortune-dictionary",
        icon: <BookOpen size={18} />,
        iconBg: "bg-[#f5f4ef] border-black/10 text-[#5a5a56]",
        label: "사주 사전",
        desc: "사주 · 명리학 용어 해설",
      },
      {
        href: "/lucky-lunch",
        icon: <Star size={18} />,
        iconBg: "bg-yellow-500/15 border-yellow-500/25 text-yellow-400",
        label: "오늘의 행운 점심",
        desc: "사주로 추천하는 오늘의 메뉴",
      },
      {
        href: "/guide",
        icon: <BookOpen size={18} />,
        iconBg: "bg-blue-500/15 border-blue-500/25 text-blue-400",
        label: "운세 칼럼",
        desc: "명리학 기반 운세 읽을거리",
      },
    ],
  },
];

export default function More() {
  return (
    <>
      <Helmet>
        <title>전체 서비스 | 무운(MuUn) — 무료 사주·운세</title>
        <meta name="description" content="무운의 모든 무료 서비스를 한눈에 확인하세요. 신년운세, 평생사주, 궁합, 타로, 꿈해몽, 작명소 등 13가지 서비스 제공." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* 페이지 헤더 */}
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Grid3x3Icon />
            <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#999891]">전체 서비스</span>
          </div>
          <h1 className="text-[22px] font-bold text-[#1a1a18] leading-tight">
            무운의 모든 서비스
          </h1>
          <p className="text-[13px] text-[#999891] mt-1">
            회원가입 없이 모두 무료로 이용하세요
          </p>
        </div>

        {/* 카테고리별 서비스 목록 */}
        <div className="px-4 pb-8 space-y-6">
          {CATEGORIES.map((cat, catIdx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.07 }}
            >
              {/* 카테고리 헤더 */}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${cat.bgColor} ${cat.borderColor} mb-3`}>
                <span className={cat.color}>{cat.icon}</span>
                <span className={`text-[11px] font-bold ${cat.color}`}>{cat.label}</span>
              </div>

              {/* 서비스 카드 리스트 */}
              <div className="space-y-2">
                {cat.services.map((svc, svcIdx) => (
                  <motion.div
                    key={svc.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: catIdx * 0.07 + svcIdx * 0.04 }}
                  >
                    <Link href={svc.href}>
                      <div className="group flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-black/10 hover:border-primary/25 hover:bg-black/[0.04] active:scale-[0.98] transition-all cursor-pointer">
                        {/* 아이콘 */}
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${svc.iconBg}`}>
                          {svc.icon}
                        </div>

                        {/* 텍스트 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[14px] font-semibold text-[#1a1a18] group-hover:text-primary transition-colors">
                              {svc.label}
                            </span>
                            {svc.badge && (
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${svc.badgeColor}`}>
                                {svc.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-[#1a1a18]/35 leading-snug truncate">
                            {svc.desc}
                          </p>
                        </div>

                        {/* 화살표 */}
                        <ChevronRight
                          size={16}
                          className="text-[#1a1a18]/20 group-hover:text-primary/60 transition-colors flex-shrink-0"
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

/* Grid3x3 아이콘 인라인 */
function Grid3x3Icon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="text-[#999891]">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
}
