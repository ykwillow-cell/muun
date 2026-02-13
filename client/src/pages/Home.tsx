/**
 * MUUN Home Page — 기존 상단 유지 + 하단 탭 필터 리뉴얼
 * 
 * 컬러 팔레트: 기존 muunsaju.com 동일
 *   - 배경: #0f172a (딥 네이비/슬레이트 900)
 *   - 카드 배경: rgba(255,255,255,0.05) on #0f172a
 *   - 보조 배경: hsl(217,33%,17%) ≈ #1e293b
 *   - 포인트: #ffd700 / #fbbf24 (Gold)
 *   - 텍스트: #f8fafc (거의 흰색)
 *   - 보조 텍스트: #94a3b8 (슬레이트 400)
 *   - 테두리: hsl(217,33%,17%) ≈ #1e293b
 */
import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import {
  Calendar,
  Sparkles,
  Heart,
  Clock,
  Star,
  Zap,
  BookOpen,
  Moon,
  Search,
  History,
  ChevronRight,
  ChevronLeft,
  Share2,
  Menu,
  X,
  ArrowRight,
  Users,
  Brain,
  Coffee,
} from "lucide-react";
import { toast } from "sonner";
import {
  createOrganizationSchema,
  createWebSiteSchema,
  createWebPageSchema,
  createBreadcrumbSchema,
  injectMultipleSchemas,
} from "@/lib/schema-tags";

// ─── Brand Colors (기존 muunsaju.com 동일) ───
const C = {
  bg: "#0f172a",
  bgCard: "#1e293b",
  gold: "#ffd700",
  goldLight: "#fbbf24",
  goldDim: "rgba(218,165,32,0.15)",
  goldBorder: "rgba(218,165,32,0.3)",
  text: "#f8fafc",
  textSub: "#94a3b8",
  textDim: "#64748b",
  border: "#1e293b",
  borderLight: "rgba(255,255,255,0.08)",
  cardBg: "rgba(255,255,255,0.05)",
  cardHover: "rgba(255,255,255,0.08)",
};

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/ke6wSxXMdfjN7evZriHUNG/sandbox/LBszex56vV06N73AnfCJWn-img-1_1770807738000_na1fn_bXV1bi1oZXJvLWJn.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva2U2d1N4WE1kZmpON2V2WnJpSFVORy9zYW5kYm94L0xCc3pleDU2dlYwNk43M0FuZkNKV24taW1nLTFfMTc3MDgwNzczODAwMF9uYTFmbl9iWFYxYmkxb1pYSnZMV0puLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=oIYBuHf~j0w-dtKuRa1TKV2p771FVTdVVJ7cJjs818p9J79RRob-NLIOVmoPZJ1irvq6r6nUPNr1CxrOiIW1u9JCtCvDC3tOGeKyjbn82f9cnt-CyXsg9V3xY8h3Q7HajVn4p7E3fnJinI6vI77Vfx-TqOiQjP5-cio2Us6zz1D2VzoOQIN86DDVyYkCuKHaeZB1e-BxX3RKbNVGLxTBJjoxpvPFxL2VnUslF4pkIA7p9psuyD5HZGW2F~Jo1m~r5PJaR52zc3lKg58NwQpjg~oTZYZ~64zu8GGDaIGZlgCB6QWfsPSA2Kuh6yT11ZUZI3fCGTmdgLY9M4J6NkVEhg__";

// ─── Service Data ───
const allServices = [
  { to: "/yearly-fortune", label: "신년운세", desc: "2026년 총운 확인", icon: Star, iconBg: "bg-yellow-500/20", iconColor: "text-yellow-400", category: "fortune", featured: true },
  { to: "/lifelong-saju", label: "평생사주", desc: "타고난 기질과 운명", icon: Sparkles, iconBg: "bg-blue-500/20", iconColor: "text-blue-400", category: "saju", featured: true },
  { to: "/tarot", label: "AI 타로", desc: "AI가 답하는 타로", icon: Zap, iconBg: "bg-purple-500/20", iconColor: "text-purple-400", category: "tarot", featured: true },
  { to: "/compatibility", label: "궁합", desc: "찰떡궁합 확인", icon: Heart, iconBg: "bg-pink-500/20", iconColor: "text-pink-400", category: "compatibility" },
  { to: "/tojeong", label: "토정비결", desc: "일 년의 흐름 보기", icon: BookOpen, iconBg: "bg-amber-500/20", iconColor: "text-amber-400", category: "fortune" },
  { to: "/daily-fortune", label: "오늘의 운세", desc: "오늘의 행운 확인", icon: Clock, iconBg: "bg-green-500/20", iconColor: "text-green-400", category: "fortune" },
  { to: "/psychology", label: "심리테스트", desc: "나의 진짜 성격 찾기", icon: Brain, iconBg: "bg-violet-500/20", iconColor: "text-violet-400", category: "etc" },
  { to: "/calendar", label: "만세력", desc: "정확한 사주 데이터", icon: Calendar, iconBg: "bg-cyan-500/20", iconColor: "text-cyan-400", category: "saju" },
  { to: "/family-saju", label: "가족사주", desc: "가족 간의 오행 조화", icon: Users, iconBg: "bg-teal-500/20", iconColor: "text-teal-400", category: "saju" },
  { to: "/astrology", label: "점성술", desc: "별자리 운명 분석", icon: Moon, iconBg: "bg-indigo-500/20", iconColor: "text-indigo-400", category: "etc" },
  { to: "/tarot-compatibility", label: "명리+타로 궁합", desc: "동서양의 지혜로 보는 궁합", icon: Star, iconBg: "bg-rose-500/20", iconColor: "text-rose-400", category: "compatibility" },
  { to: "/today-menu", label: "오늘의 메뉴", desc: "기운을 북돋는 점심 추천", icon: Coffee, iconBg: "bg-orange-500/20", iconColor: "text-orange-400", category: "etc" },
];

const categories = [
  { id: "all", label: "전체" },
  { id: "saju", label: "사주" },
  { id: "tarot", label: "타로" },
  { id: "compatibility", label: "궁합" },
  { id: "fortune", label: "운세" },
  { id: "etc", label: "기타" },
];

// ─── Animated Section ───
function AnimatedSection({ children, className = "", delay = 0, style }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className} style={style}>
      {children}
    </motion.div>
  );
}

// ─── Header ───
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50">
      <div className="border-b" style={{ background: C.bg, borderColor: C.goldBorder }}>
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.goldLight }}>
              <Sparkles className="w-5 h-5 text-gray-900" />
            </div>
            <span className="text-xl font-extrabold tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif", color: C.text }}>MUUN</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toast("공유 기능은 곧 제공될 예정입니다.")} className="p-2.5 rounded-full" style={{ color: C.textSub }}><Share2 className="w-5 h-5" /></button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2.5 rounded-full" style={{ color: C.textSub }}>{menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-14 left-0 right-0 border-b backdrop-blur-xl z-50" style={{ background: `${C.bg}f8`, borderColor: C.goldBorder }}>
          <div className="container py-3 space-y-1">
            {allServices.slice(0, 8).map((item) => (
              <button key={item.to} onClick={() => { toast(`${item.label} 페이지로 이동합니다.`); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors" style={{ color: C.text }}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.iconBg}`}><item.icon className={`w-4 h-4 ${item.iconColor}`} /></div>
                <div><p className="text-sm font-medium" style={{ color: C.text }}>{item.label}</p><p className="text-xs" style={{ color: C.textDim }}>{item.desc}</p></div>
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
  return (
    <section className="relative overflow-hidden" style={{ background: C.bg }}>
      <div className="absolute inset-0">
        <img 
          src={HERO_BG} 
          alt="" 
          className="w-full h-full object-cover opacity-20" 
          loading="lazy"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${C.bg}4d 0%, ${C.bg}b3 60%, ${C.bg} 100%)` }} />
      </div>
      <div className="relative z-10 container py-10 text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5" style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium" style={{ color: C.goldLight }}>가입 없는 무료 운세</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="text-2xl sm:text-3xl font-black leading-tight mb-3" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          <span style={{ color: C.text }}>30년 내공의 명리학,</span><br /><span style={{ color: C.goldLight }}>운명을 읽다</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-sm mb-0" style={{ color: C.textSub }}>
          회원가입 없이 바로 확인하는 프리미엄 운세 서비스
        </motion.p>
      </div>
    </section>
  );
}

// ─── Featured Banner Cards ───
function FeaturedBanners() {
  const banners = [
    { to: "/yearly-fortune", label: "2026 신년운세", desc: "내 한 해의 운세 흐름 확인", emoji: "🐍", borderColor: C.goldBorder, bgColor: C.goldDim },
    { to: "/lifelong-saju", label: "평생사주 분석", desc: "타고난 기질과 운명 확인", emoji: "🔮", borderColor: "rgba(96, 165, 250, 0.4)", bgColor: "rgba(96, 165, 250, 0.08)" },
  ];
  return (
    <AnimatedSection className="px-4 -mt-2 space-y-3 pb-6" delay={0.1}>
      {banners.map((banner) => (
        <motion.button key={banner.to} onClick={() => toast(`${banner.label} 페이지로 이동합니다.`)} className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all" style={{ background: banner.bgColor, border: `1px solid ${banner.borderColor}` }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: C.cardBg }}>{banner.emoji}</div>
          <div className="flex-1"><h3 className="font-bold text-base" style={{ color: C.text }}>{banner.label}</h3><p className="text-xs mt-0.5" style={{ color: C.textSub }}>{banner.desc}</p></div>
          <ArrowRight className="w-5 h-5 flex-shrink-0" style={{ color: C.textDim }} />
        </motion.button>
      ))}
    </AnimatedSection>
  );
}

// ─── Popular Carousel ───
function PopularCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const featured = allServices.filter((s) => s.featured);
  const scroll = (dir: "left" | "right") => { if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "left" ? -160 : 160, behavior: "smooth" }); };
  return (
    <AnimatedSection className="pb-8" delay={0.2}>
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><span className="text-lg">🔥</span><h2 className="text-base font-bold" style={{ color: C.text }}>지금 인기 서비스</h2></div>
          <div className="flex items-center gap-1 text-xs" style={{ color: C.textDim }}>
            <button onClick={() => scroll("left")} className="p-1"><ChevronLeft className="w-4 h-4" /></button><span>스크롤</span><button onClick={() => scroll("right")} className="p-1"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {featured.map((item) => (
            <motion.button key={item.to} onClick={() => toast(`${item.label} 페이지로 이동합니다.`)} className="flex-shrink-0 w-36 rounded-2xl p-4 text-left snap-start transition-all" style={{ background: C.cardBg, border: `1px solid ${C.borderLight}` }} whileTap={{ scale: 0.97 }}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${item.iconBg}`}><item.icon className={`w-5 h-5 ${item.iconColor}`} /></div>
              <h3 className="font-semibold text-sm" style={{ color: C.text }}>{item.label}</h3>
              <p className="text-xs mt-1" style={{ color: C.textDim }}>{item.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── Category Tabs ───
function CategoryTabs({ activeCategory, onCategoryChange }: { activeCategory: string; onCategoryChange: (id: string) => void }) {
  return (
    <div className="container mb-4">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <motion.button key={cat.id} onClick={() => onCategoryChange(cat.id)} className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0"
              style={{ background: isActive ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` : C.cardBg, color: isActive ? C.bg : C.textSub, border: isActive ? "none" : `1px solid ${C.borderLight}` }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {cat.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Service Grid Card ───
function ServiceGridCard({ item, index }: { item: (typeof allServices)[0]; index: number }) {
  const Icon = item.icon;
  return (
    <motion.button onClick={() => toast(`${item.label} 페이지로 이동합니다.`)} className="relative group w-full overflow-hidden rounded-2xl p-5 text-left transition-all"
      style={{ background: C.cardBg, border: `1px solid ${C.borderLight}` }}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ borderColor: C.goldBorder, boxShadow: `0 0 20px rgba(218, 165, 32, 0.1)` }} whileTap={{ scale: 0.97 }}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${item.iconBg}`}><Icon className={`w-6 h-6 ${item.iconColor}`} /></div>
      <h3 className="font-bold text-sm mb-1" style={{ color: C.text }}>{item.label}</h3>
      <p className="text-xs leading-relaxed" style={{ color: C.textDim }}>{item.desc}</p>
    </motion.button>
  );
}

// ─── Filtered Services Section ───
function FilteredServicesSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const filtered = activeCategory === "all" ? allServices : allServices.filter((s) => s.category === activeCategory);
  return (
    <AnimatedSection className="py-8" delay={0.3}>
      <div className="container mb-5"><h2 className="text-lg font-bold" style={{ color: C.text }}>전체 서비스</h2></div>
      <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <div className="container">
        <motion.div className="grid grid-cols-2 gap-3" layout>
          {filtered.map((item, idx) => (<ServiceGridCard key={item.to} item={item} index={idx} />))}
        </motion.div>
        {filtered.length === 0 && (<div className="text-center py-12"><Search className="w-10 h-10 mx-auto mb-3" style={{ color: C.textDim }} /><p className="text-sm" style={{ color: C.textDim }}>해당 카테고리의 서비스가 없습니다.</p></div>)}
      </div>
    </AnimatedSection>
  );
}

// ─── Why MUUN ───
function WhyMuunSection() {
  const features = [
    { icon: Star, title: "정밀한 알고리즘", desc: "30년 내공의 명리학 데이터를 기반으로 한 정확한 분석" },
    { icon: Zap, title: "AI 기술 결합", desc: "최신 AI 기술로 더욱 깊이 있는 해석을 제공합니다" },
    { icon: Heart, title: "100% 무료", desc: "회원가입 없이, 개인정보 저장 없이 바로 이용 가능" },
  ];
  return (
    <AnimatedSection className="py-10 border-t" style={{ borderColor: C.borderLight }} delay={0.2}>
      <div className="container text-center">
        <h2 className="text-lg font-bold mb-1" style={{ color: C.goldLight }}>왜 무운인가요?</h2>
        <p className="text-xs mb-6" style={{ color: C.textDim }}>무운만의 세 가지 약속</p>
        <div className="space-y-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i} className="flex items-start gap-4 p-4 rounded-2xl text-left" style={{ background: C.cardBg, border: `1px solid ${C.borderLight}` }}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: C.goldDim }}><Icon className="w-5 h-5" style={{ color: C.goldLight }} /></div>
                <div><h3 className="font-semibold text-sm" style={{ color: C.text }}>{f.title}</h3><p className="text-xs mt-1 leading-relaxed" style={{ color: C.textDim }}>{f.desc}</p></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── Footer ───
function Footer() {
  return (
    <footer className="py-8 border-t" style={{ borderColor: C.borderLight }}>
      <div className="container text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: C.goldLight }}><Sparkles className="w-3 h-3 text-gray-900" /></div>
          <span className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: C.textSub }}>MUUN</span>
        </div>
        <p className="text-xs mb-1" style={{ color: C.textDim }}>30년 내공의 명리학, 운명을 읽다</p>
        <p className="text-xs" style={{ color: C.textDim, opacity: 0.6 }}>muunsaju.com</p>
      </div>
    </footer>
  );
}

// ─── FAB ───
function FloatingActionButton() {
  return (
    <motion.button onClick={() => toast("타로 기록 페이지로 이동합니다.")} className="fixed bottom-6 right-5 rounded-full flex items-center justify-center z-40"
      style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, boxShadow: `0 4px 20px rgba(218, 165, 32, 0.4)`, width: 52, height: 52 }}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: "spring" }}>
      <History className="w-5 h-5 text-gray-900" />
    </motion.button>
  );
}

// ─── Main ───
export default function Home() {
  useEffect(() => {
    // Schema.org JSON-LD 구조화된 데이터 주입
    const schemas = [
      createOrganizationSchema(),
      createWebSiteSchema(),
      createWebPageSchema(
        "무운(MUUN) - 당신의 운명을 비추는 가장 맑은 거울",
        "https://muunsaju.com",
        "30년 내공의 정통 명리학과 최신 AI 기술이 만나, 회원가입 없이 당신의 미래를 가장 정확하게 풀어드립니다.",
        "https://muunsaju.com/og-image-main.png",
        new Date().toISOString().split("T")[0],
        new Date().toISOString().split("T")[0]
      ),
      createBreadcrumbSchema([
        { name: "홈", url: "https://muunsaju.com" },
      ]),
    ];

    injectMultipleSchemas(schemas);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <Header />
      <HeroSection />
      <FeaturedBanners />
      <PopularCarousel />
      <div className="container"><div className="h-px" style={{ background: C.borderLight }} /></div>
      <FilteredServicesSection />
      <WhyMuunSection />
      <Footer />
      <FloatingActionButton />
    </div>
  );
}
