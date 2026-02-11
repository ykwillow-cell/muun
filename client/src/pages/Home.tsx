/**
 * MUUN Home Page — "Aurora Nexus" Design
 * Mystical Modernism & Personalization
 * Glassmorphism + Neon Glow + Deep Navy
 */
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Calendar,
  Sparkles,
  Users,
  Search,
  Heart,
  Clock,
  Star,
  Zap,
  BookOpen,
  Coffee,
  Moon,
  MessageSquare,
  History,
  ChevronRight,
  Share2,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";

// ─── Image URLs ───
const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/ke6wSxXMdfjN7evZriHUNG/sandbox/LBszex56vV06N73AnfCJWn-img-1_1770807738000_na1fn_bXV1bi1oZXJvLWJn.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva2U2d1N4WE1kZmpON2V2WnJpSFVORy9zYW5kYm94L0xCc3pleDU2dlYwNk43M0FuZkNKV24taW1nLTFfMTc3MDgwNzczODAwMF9uYTFmbl9iWFYxYmkxb1pYSnZMV0puLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=oIYBuHf~j0w-dtKuRa1TKV2p771FVTdVVJ7cJjs818p9J79RRob-NLIOVmoPZJ1irvq6r6nUPNr1CxrOiIW1u9JCtCvDC3tOGeKyjbn82f9cnt-CyXsg9V3xY8h3Q7HajVn4p7E3fnJinI6vI77Vfx-TqOiQjP5-cio2Us6zz1D2VzoOQIN86DDVyYkCuKHaeZB1e-BxX3RKbNVGLxTBJjoxpvPFxL2VnUslF4pkIA7p9psuyD5HZGW2F~Jo1m~r5PJaR52zc3lKg58NwQpjg~oTZYZ~64zu8GGDaIGZlgCB6QWfsPSA2Kuh6yT11ZUZI3fCGTmdgLY9M4J6NkVEhg__";
const FORTUNE_CARD = "https://private-us-east-1.manuscdn.com/sessionFile/ke6wSxXMdfjN7evZriHUNG/sandbox/LBszex56vV06N73AnfCJWn-img-2_1770807740000_na1fn_bXV1bi1mb3J0dW5lLWNhcmQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva2U2d1N4WE1kZmpON2V2WnJpSFVORy9zYW5kYm94L0xCc3pleDU2dlYwNk43M0FuZkNKV24taW1nLTJfMTc3MDgwNzc0MDAwMF9uYTFmbl9iWFYxYmkxbWIzSjBkVzVsTFdOaGNtUS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=GliImyZ9GWs9avoW69RyHNDCXFjC3raMmEwPxELzb9T61masgtcPXMf7p16UIGBcSTb2yXVx7eFcAKhxsOs1dclvkn3XI8Yvcz3gdoe0zhrtq0wCX0tatgFgIqIWptBeoexzCI7zRNYW8PHXAvi3AfpfiKihjrocCuuTe33WeQm4QYzD5moQEamuWT96R4ZP8OTqsrXR3CgXPKv9wTpKS-FivM7yDcRzn8m1ZellmGGyKc6aCAiZswClsxpxsnNCmGzBv-zSiWT-hYBIo69UySoWtcwW0zxOjL5FM-1CNwav~CnVmBL3qCvuerlYG~60q1jF91FmBEq5rSf0TfQWgA__";
const TAROT_CARD = "https://private-us-east-1.manuscdn.com/sessionFile/ke6wSxXMdfjN7evZriHUNG/sandbox/LBszex56vV06N73AnfCJWn-img-3_1770807741000_na1fn_bXV1bi10YXJvdC1jYXJk.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva2U2d1N4WE1kZmpON2V2WnJpSFVORy9zYW5kYm94L0xCc3pleDU2dlYwNk43M0FuZkNKV24taW1nLTNfMTc3MDgwNzc0MTAwMF9uYTFmbl9iWFYxYmkxMFlYSnZkQzFqWVhKay5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=lgyUu3jk6Kx1ZsotTfZmriUkJ8BVH-GrjEQbPr6KRahjZUWPPXkvIWJSTspFlm255f~Pjd3NQ8b0PkK0vFP9x-ur8boqOlF5bvcSUPqbUXn6KQ6Ksk4weuZtLcWTYhGCk7S0lMo3IWuAqE6QOPp5d2mdH9m3YjFZ8ThxO3~Zas5-UTMOBWTSKrw6rg4f7bu9383rX~f2MtgaTMM9xS8l02ADTX2mTHYmgvL6BfzOF9Ke7utKGLHQtf-DhCyc1d23yvusRRFr4jTPzeFzPG8vJme7ZrrndFFItDuzuf-UXnfrL0YGJSHgJSYfgXmrDNFXIRJvTMWzjiEQVKZd851OlQ__";
const ZODIAC_WHEEL = "https://private-us-east-1.manuscdn.com/sessionFile/ke6wSxXMdfjN7evZriHUNG/sandbox/LBszex56vV06N73AnfCJWn-img-4_1770807746000_na1fn_bXV1bi16b2RpYWMtd2hlZWw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva2U2d1N4WE1kZmpON2V2WnJpSFVORy9zYW5kYm94L0xCc3pleDU2dlYwNk43M0FuZkNKV24taW1nLTRfMTc3MDgwNzc0NjAwMF9uYTFmbl9iWFYxYmkxNmIyUnBZV010ZDJobFpXdy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=fpAWCKIZX0VyxQtbo5~7AgCM43ANaegB4QlqbXp8YrbqZPTqGAvBcOtfwv2jDq~cQUKNDjZT~fV48zRUaC94kcjaI1u3Pk11-xvScGlgD5eUcGVxr1gHGT09ZD9yYj5HlPaxYIGQtuJYTLIAlvN5RUyqPrf02~Rcjqk4XDH-VVDeMEY9VIcZb5XZStxtlj0etJu26AujK8uJg4P9-CpNoj0a-ST3wWECQXUL7ZC~RRhLair81d9iX~9W1hbQ43sM~DTR8~OycxH32LENpw54t087RsKQmg5pedFhLfG~UJR76y3Fvdo5Iqx94bxq0qzlZlJc-1Ql3W~91bjmIjGQUA__";
const ABSTRACT_PATTERN = "https://private-us-east-1.manuscdn.com/sessionFile/ke6wSxXMdfjN7evZriHUNG/sandbox/LBszex56vV06N73AnfCJWn-img-5_1770807747000_na1fn_bXV1bi1hYnN0cmFjdC1wYXR0ZXJu.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva2U2d1N4WE1kZmpON2V2WnJpSFVORy9zYW5kYm94L0xCc3pleDU2dlYwNk43M0FuZkNKV24taW1nLTVfMTc3MDgwNzc0NzAwMF9uYTFmbl9iWFYxYmkxaFluTjBjbUZqZEMxd1lYUjBaWEp1LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=U5WElDGGoqUr-8yB4bkJ0hmC7dKIBmGIFujhTlaWpLIFMe6tp0UsVFnuO54dfr-LUqpyYm~FqBo2h~KSOFj2zJphHXmXq2VBXuLUm0-2eHmYxywhlCpITlVYWRqOxAEcFuHu-kkrHzAE8MMuTwDhtZGZafYKFDhQ1P~6I07yuh8rHppU7Xj9ztaZZQitlQ5pbtMXeC4yg9RyvMKbH~Nef-QQ0PDYyG8RNHFOwHYUABvUbHYeYgh81k5PNpo-HE57R-TZyjNmhHKU7usfoIKlgEnnb5-9jLZA72yJ~UYM1KCui2F9L9iBp4lm3iyuViwUIE7gIdV6yeVIgspZ~K-36g__";

// ─── Category Data ───
const categories = [
  { id: "all", label: "전체" },
  { id: "saju", label: "사주" },
  { id: "tarot", label: "타로" },
  { id: "compatibility", label: "궁합" },
  { id: "fortune", label: "운세" },
  { id: "etc", label: "기타" },
];

const menuItems = [
  {
    to: "/yearly-fortune",
    label: "2026 신년운세",
    desc: "병오년 총운과 월별 흐름",
    icon: Calendar,
    gradient: "from-amber-400 to-orange-500",
    glowColor: "rgba(245, 158, 11, 0.3)",
    category: "fortune",
    featured: true,
  },
  {
    to: "/lifelong-saju",
    label: "평생사주",
    desc: "타고난 기질과 평생의 운명",
    icon: Sparkles,
    gradient: "from-violet-400 to-purple-600",
    glowColor: "rgba(124, 58, 237, 0.3)",
    category: "saju",
    featured: true,
  },
  {
    to: "/family-saju",
    label: "가족사주",
    desc: "가족 간의 오행 조화 분석",
    icon: Users,
    gradient: "from-blue-400 to-cyan-500",
    glowColor: "rgba(6, 182, 212, 0.3)",
    category: "saju",
  },
  {
    to: "/tarot",
    label: "AI 타로",
    desc: "AI가 들려주는 신비로운 조언",
    icon: Zap,
    gradient: "from-pink-400 to-rose-500",
    glowColor: "rgba(244, 63, 94, 0.3)",
    category: "tarot",
    featured: true,
  },
  {
    to: "/tojeong",
    label: "토정비결",
    desc: "한 해의 길흉화복 상세 풀이",
    icon: BookOpen,
    gradient: "from-emerald-400 to-teal-500",
    glowColor: "rgba(20, 184, 166, 0.3)",
    category: "fortune",
  },
  {
    to: "/compatibility",
    label: "궁합",
    desc: "두 사람의 인연과 조화",
    icon: Heart,
    gradient: "from-red-400 to-pink-500",
    glowColor: "rgba(244, 63, 94, 0.3)",
    category: "compatibility",
  },
  {
    to: "/manselyeok",
    label: "만세력",
    desc: "정밀한 사주 명식 데이터",
    icon: Search,
    gradient: "from-slate-400 to-slate-600",
    glowColor: "rgba(148, 163, 184, 0.3)",
    category: "saju",
  },
  {
    to: "/daily-fortune",
    label: "오늘의 운세",
    desc: "오늘의 행운과 주의할 점",
    icon: Clock,
    gradient: "from-yellow-400 to-amber-500",
    glowColor: "rgba(245, 158, 11, 0.3)",
    category: "fortune",
  },
  {
    to: "/hybrid-compatibility",
    label: "명리+타로 궁합",
    desc: "동서양의 지혜를 모은 궁합",
    icon: Star,
    gradient: "from-violet-400 to-purple-600",
    glowColor: "rgba(124, 58, 237, 0.3)",
    category: "compatibility",
  },
  {
    to: "/lucky-lunch",
    label: "오늘의 메뉴",
    desc: "기운을 북돋는 점심 추천",
    icon: Coffee,
    gradient: "from-orange-400 to-red-500",
    glowColor: "rgba(239, 68, 68, 0.3)",
    category: "etc",
  },
  {
    to: "/astrology",
    label: "점성술",
    desc: "별자리가 알려주는 당신의 운명",
    icon: Moon,
    gradient: "from-indigo-400 to-blue-600",
    glowColor: "rgba(79, 70, 229, 0.3)",
    category: "etc",
  },
  {
    to: "/blog",
    label: "운세 매거진",
    desc: "역술인의 전문적인 칼럼",
    icon: MessageSquare,
    gradient: "from-cyan-400 to-blue-500",
    glowColor: "rgba(6, 182, 212, 0.3)",
    category: "etc",
  },
];

// ─── Daily fortune keywords (rotates) ───
const dailyKeywords = ["변화", "도전", "성장", "인연", "행운"];
const luckyColors = [
  { name: "코발트 블루", hex: "#2563eb" },
  { name: "로즈 골드", hex: "#f43f5e" },
  { name: "에메랄드", hex: "#10b981" },
  { name: "앰버 골드", hex: "#f59e0b" },
  { name: "라벤더", hex: "#8b5cf6" },
];

// ─── Animated Section Wrapper ───
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Header / GNB ───
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="backdrop-blur-xl border-b"
        style={{
          background: "rgba(11, 17, 32, 0.8)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="container flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #f97316)",
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-lg tracking-wider"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              MUUN
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => toast("공유 기능은 곧 제공될 예정입니다.")}
              className="p-2 rounded-full transition-colors"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <Share2 className="w-4 h-4 text-white/70" />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full transition-colors"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              {menuOpen ? (
                <X className="w-4 h-4 text-white/70" />
              ) : (
                <Menu className="w-4 h-4 text-white/70" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-14 left-0 right-0 border-b backdrop-blur-xl"
          style={{
            background: "rgba(11, 17, 32, 0.95)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div className="container py-4 space-y-1">
            {menuItems.slice(0, 6).map((item) => (
              <button
                key={item.to}
                onClick={() => {
                  toast(`${item.label} 페이지로 이동합니다.`);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left"
                style={{ background: "transparent" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.gradient}`}
                >
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">{item.label}</p>
                  <p className="text-xs text-white/40">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}

// ─── Hero Section ───
function HeroSection() {
  const [currentKeyword, setCurrentKeyword] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentKeyword((prev) => (prev + 1) % dailyKeywords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const todayIndex = new Date().getDate() % luckyColors.length;
  const todayColor = luckyColors[todayIndex];

  return (
    <section className="relative min-h-[85vh] flex items-end overflow-hidden pt-14">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.5 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(11,17,32,0.3) 0%, rgba(11,17,32,0.6) 50%, rgba(11,17,32,0.95) 85%, rgb(11,17,32) 100%)",
          }}
        />
      </div>

      {/* Aurora overlay */}
      <div className="absolute inset-0 aurora-bg opacity-40" />

      {/* Content */}
      <div className="relative z-10 container pb-8 w-full">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h1
            className="text-3xl sm:text-4xl font-black leading-tight mb-3"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            <span className="block text-white">당신의 운명을 비추는</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #a78bfa, #22d3ee, #fbbf24)",
              }}
            >
              가장 맑은 거울, 무운
            </span>
          </h1>
          <p className="text-sm text-white/50 leading-relaxed max-w-xs">
            30년 내공의 정통 명리학과 최신 AI 기술이 만나
            <br />
            당신의 미래를 가장 정확하게 풀어드립니다.
          </p>
        </motion.div>

        {/* Personalization Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="glass-card p-4 mb-5"
          style={{
            boxShadow:
              "0 0 30px rgba(124,58,237,0.1), 0 0 60px rgba(6,182,212,0.05)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center animate-float"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              }}
            >
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/40">오늘의 키워드</p>
              <motion.p
                key={currentKeyword}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-bold text-white"
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              >
                {dailyKeywords[currentKeyword]}
              </motion.p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full border-2"
                style={{
                  backgroundColor: todayColor.hex,
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              />
              <span className="text-xs text-white/60">
                행운 컬러: <span className="text-white/90 font-medium">{todayColor.name}</span>
              </span>
            </div>
            <div className="h-3 w-px bg-white/10" />
            <span className="text-xs text-white/60">
              행운 숫자:{" "}
              <span
                className="font-semibold"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "#fbbf24",
                }}
              >
                {((new Date().getDate() * 7) % 45) + 1}
              </span>
            </span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <button
            onClick={() => toast("2026 신년운세 페이지로 이동합니다.")}
            className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm glow-pulse flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            }}
          >
            <Calendar className="w-4 h-4" />
            2026 신년운세 바로보기
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Featured Carousel ───
function FeaturedCarousel() {
  const featured = menuItems.filter((item) => item.featured);
  const images = [FORTUNE_CARD, TAROT_CARD, ZODIAC_WHEEL];

  return (
    <AnimatedSection className="py-8">
      <div className="container">
        <h2
          className="text-lg font-bold text-white mb-4"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          추천 서비스
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {featured.map((item, i) => (
          <motion.button
            key={item.to}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast(`${item.label} 페이지로 이동합니다.`)}
            className="flex-shrink-0 w-[280px] snap-center rounded-2xl overflow-hidden relative group"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={images[i % images.length]}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(11,17,32,0.9) 0%, transparent 60%)",
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.gradient}`}
                >
                  <item.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-white">{item.label}</span>
              </div>
              <p className="text-xs text-white/50 pl-9">{item.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </AnimatedSection>
  );
}

// ─── Category Chips + Grid ───
function CategoryGrid() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <section className="py-6">
      {/* Category Chips */}
      <AnimatedSection>
        <div
          className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300"
              style={
                activeCategory === cat.id
                  ? {
                      background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                      color: "white",
                      boxShadow: "0 0 15px rgba(124,58,237,0.3)",
                    }
                  : {
                      background: "rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Grid */}
      <div className="container">
        <AnimatedSection>
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item, i) => (
              <motion.button
                key={item.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toast(`${item.label} 페이지로 이동합니다.`)}
                className="glass-card glass-card-hover p-4 text-left relative overflow-hidden group"
              >
                {/* Glow background on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${item.glowColor}, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${item.gradient}`}
                    style={{
                      boxShadow: `0 4px 15px ${item.glowColor}`,
                    }}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-0.5">
                    {item.label}
                  </h3>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Info Banner ───
function InfoBanner() {
  return (
    <AnimatedSection className="py-6">
      <div className="container">
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <img
              src={ABSTRACT_PATTERN}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 p-6 text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              AI가 분석하는 정통 명리학
            </h3>
            <p className="text-xs text-white/40 leading-relaxed max-w-sm mx-auto">
              30년 경력의 역술인이 검증한 알고리즘으로
              <br />
              사주팔자, 타로, 궁합을 정밀하게 분석합니다.
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── Footer ───
function Footer() {
  return (
    <footer className="py-8 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <div className="container text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
            }}
          >
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span
            className="text-sm tracking-wider text-white/60"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
          >
            MUUN
          </span>
        </div>
        <p className="text-[11px] text-white/30 mb-1">
          30년 내공의 정통 명리학 x 최신 AI 기술
        </p>
        <p className="text-[10px] text-white/20">
          &copy; 2026 MUUN. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Floating Action Button ───
function FloatingButton() {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.4 }}
      onClick={() => toast("나의 타로 기록을 확인합니다.")}
      className="fixed bottom-6 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
      style={{
        background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
        boxShadow: "0 0 20px rgba(124,58,237,0.4), 0 4px 20px rgba(0,0,0,0.3)",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <History className="w-5 h-5 text-white" />
    </motion.button>
  );
}

// ─── Main Page ───
export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#0b1120" }}
    >
      <Header />
      <HeroSection />
      <FeaturedCarousel />
      <CategoryGrid />
      <InfoBanner />
      <Footer />
      <FloatingButton />
    </div>
  );
}
