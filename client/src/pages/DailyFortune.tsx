import { useState, useEffect, useRef } from "react";
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useInView } from "framer-motion";
import {
  ChevronLeft, Share2, Sparkles, Star, Coffee, MapPin, Palette, Zap, User, Sun, Calendar,
  AlertTriangle, Lightbulb, Compass, Brain, Shield, Sword, Clock, TrendingUp, Leaf, Flame,
  Mountain, Droplets, Wind, Gem, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Users, Building2, Package, CheckCircle2, RefreshCw
} from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getDailyFortune, DailyFortuneResult } from "@/lib/dailyFortune";
import { shareContent } from "@/lib/share";
import DailyFortuneContent from "@/components/DailyFortuneContent";
import { convertToSolarDate } from "@/lib/lunar-converter";

const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  calendarType: z.enum(["solar", "lunar"]).default("solar"),
  isLeapMonth: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

// ─── 오행 아이콘/색상 매핑 ───────────────────────────────────────────────────
const ELEMENT_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string; label: string }> = {
  '木': { icon: <Leaf className="w-4 h-4" />, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', label: '목(木)' },
  '火': { icon: <Flame className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: '화(火)' },
  '土': { icon: <Mountain className="w-4 h-4" />, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', label: '토(土)' },
  '金': { icon: <Gem className="w-4 h-4" />, color: 'text-gray-300', bg: 'bg-gray-500/10', border: 'border-gray-400/30', label: '금(金)' },
  '水': { icon: <Droplets className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', label: '수(水)' },
};

const DIRECTION_ICON: Record<string, React.ReactNode> = {
  '동쪽': <ArrowRight className="w-5 h-5" />,
  '서쪽': <ArrowLeft className="w-5 h-5" />,
  '남쪽': <ArrowDown className="w-5 h-5" />,
  '북쪽': <ArrowUp className="w-5 h-5" />,
  '북동쪽': <ArrowUp className="w-5 h-5" />,
  '남동쪽': <ArrowDown className="w-5 h-5" />,
  '북서쪽': <ArrowUp className="w-5 h-5" />,
  '남서쪽': <ArrowDown className="w-5 h-5" />,
};

const CAUTION_CATEGORY_ICON: Record<string, React.ReactNode> = {
  '사람': <Users className="w-4 h-4" />,
  '장소': <Building2 className="w-4 h-4" />,
  '사물': <Package className="w-4 h-4" />,
};

// ─── 애니메이션 게이지 컴포넌트 ──────────────────────────────────────────────
function AnimatedScore({ score }: { score: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (circumference * score) / 100;

  const getScoreColor = (s: number) => {
    if (s >= 90) return '#22c55e';
    if (s >= 75) return '#f97316';
    if (s >= 60) return '#eab308';
    return '#ef4444';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 90) return '대길(大吉)';
    if (s >= 80) return '길(吉)';
    if (s >= 70) return '중길(中吉)';
    if (s >= 60) return '평(平)';
    return '주의(注意)';
  };

  return (
    <div ref={ref} className="relative w-44 h-44 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* 배경 트랙 */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        {/* 진행 게이지 */}
        <motion.circle
          cx="50" cy="50" r="45" fill="none"
          stroke={getScoreColor(score)}
          strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
          strokeLinecap="round"
        />
        {/* 글로우 효과 */}
        <motion.circle
          cx="50" cy="50" r="45" fill="none"
          stroke={getScoreColor(score)}
          strokeWidth="2"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
          strokeLinecap="round"
          opacity={0.4}
          filter="blur(3px)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-black text-white tabular-nums"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs font-bold mt-1" style={{ color: getScoreColor(score) }}>
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}

// ─── 오행 밸런스 바 ──────────────────────────────────────────────────────────
function ElementBar({ name, value, fullMark }: { name: string; value: number; fullMark: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const config = ELEMENT_CONFIG[name] ?? { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: name, icon: null };
  const pct = Math.round((value / fullMark) * 100);

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1.5 ${config.color}`}>
          {config.icon}
          <span className="text-sm font-semibold">{config.label}</span>
        </div>
        <span className="text-xs text-white/50">{value}/{fullMark}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${config.bg.replace('/10', '/60')}`}
          style={{ background: `linear-gradient(90deg, currentColor, currentColor)` }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <div className={`h-full rounded-full ${
            name === '木' ? 'bg-green-400' :
            name === '火' ? 'bg-red-400' :
            name === '土' ? 'bg-yellow-400' :
            name === '金' ? 'bg-gray-300' :
            'bg-blue-400'
          }`} />
        </motion.div>
      </div>
    </div>
  );
}

// ─── 의사결정 매트릭스 게이지 ────────────────────────────────────────────────
function MatrixGauge({ label, value, leftLabel, rightLabel, icon }: {
  label: string; value: number; leftLabel: string; rightLabel: string; icon: React.ReactNode;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between text-xs text-white/60">
        <span className="flex items-center gap-1">{icon} {leftLabel}</span>
        <span className="font-bold text-orange-400">{value}</span>
        <span>{rightLabel}</span>
      </div>
      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-white/30"
          style={{ left: '50%' }}
        />
      </div>
    </div>
  );
}

// ─── 타임라인 그래프 ─────────────────────────────────────────────────────────
function TimelineChart({ slots }: { slots: DailyFortuneResult['extended']['timeline'] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const maxScore = Math.max(...slots.map(s => s.score));
  const goldenSlot = slots.find(s => s.isGoldenTime);

  return (
    <div ref={ref} className="space-y-4">
      {/* 골든 타임 배너 */}
      {goldenSlot && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/10 border border-yellow-500/30"
        >
          <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
            <Star className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <p className="text-xs text-yellow-400 font-bold">골든 타임</p>
            <p className="text-sm text-white font-semibold">{goldenSlot.label} — {goldenSlot.description}</p>
          </div>
          <div className="ml-auto text-2xl font-black text-yellow-400">{goldenSlot.score}</div>
        </motion.div>
      )}

      {/* 그래프 */}
      <div className="flex items-end gap-1 h-28 px-1">
        {slots.map((slot, idx) => {
          const heightPct = (slot.score / 100) * 100;
          const isGolden = slot.isGoldenTime;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div className="w-full flex flex-col items-center justify-end" style={{ height: '100px' }}>
                <motion.div
                  className={`w-full rounded-t-sm ${
                    isGolden
                      ? 'bg-gradient-to-t from-yellow-500 to-yellow-300'
                      : slot.score >= 80
                      ? 'bg-gradient-to-t from-orange-600 to-orange-400'
                      : slot.score >= 60
                      ? 'bg-gradient-to-t from-orange-800/60 to-orange-600/40'
                      : 'bg-white/10'
                  }`}
                  initial={{ height: 0 }}
                  animate={isInView ? { height: `${heightPct}%` } : {}}
                  transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.05 }}
                />
              </div>
              <span className="text-[8px] text-white/40 leading-none">
                {slot.hour}시
              </span>
              {isGolden && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                  <Star className="w-3 h-3 text-yellow-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 나침반 컴포넌트 ─────────────────────────────────────────────────────────
function CompassWidget({ direction, angle, colorHex }: { direction: string; angle: number; colorHex: string }) {
  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* 나침반 배경 */}
      <div className="absolute inset-0 rounded-full border-2 border-white/10 bg-white/5">
        {/* 방위 표시 */}
        {[
          { label: 'N', pos: 'top-1 left-1/2 -translate-x-1/2' },
          { label: 'S', pos: 'bottom-1 left-1/2 -translate-x-1/2' },
          { label: 'E', pos: 'right-1 top-1/2 -translate-y-1/2' },
          { label: 'W', pos: 'left-1 top-1/2 -translate-y-1/2' },
        ].map(({ label, pos }) => (
          <span key={label} className={`absolute text-[9px] text-white/30 font-bold ${pos}`}>{label}</span>
        ))}
        {/* 중심 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </div>
      {/* 방향 화살표 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ rotate: 0 }}
        animate={{ rotate: angle }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        style={{ transformOrigin: 'center' }}
      >
        <div className="relative h-12 flex flex-col items-center">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderBottom: `24px solid ${colorHex}`,
            }}
          />
          <div
            className="w-0 h-0"
            style={{
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '20px solid rgba(255,255,255,0.2)',
            }}
          />
        </div>
      </motion.div>
      {/* 방향 레이블 */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-center">
        <span className="text-sm font-bold" style={{ color: colorHex }}>{direction}</span>
      </div>
    </div>
  );
}

// ─── 섹션 헤더 컴포넌트 ──────────────────────────────────────────────────────
function SectionHeader({
  icon, label, title, accent = 'orange'
}: {
  icon: React.ReactNode; label: string; title: string; accent?: string;
}) {
  const accentColors: Record<string, string> = {
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  };
  const cls = accentColors[accent] ?? accentColors.orange;

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${cls}`}>
        {icon}
      </div>
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-widest ${cls.split(' ')[0]}`}>{label}</p>
        <h3 className="text-base font-bold text-white">{title}</h3>
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function DailyFortune() {
  useCanonical('/daily-fortune');

  const [fortune, setFortune] = useState<DailyFortuneResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userName, setUserName] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "2000-01-01",
      calendarType: "solar",
      isLeapMonth: false,
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset({
        name: parsed.name || "",
        gender: parsed.gender || "male",
        birthDate: parsed.birthDate || "2000-01-01",
        calendarType: parsed.calendarType || "solar",
        isLeapMonth: parsed.isLeapMonth || false,
      });
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    const existingData = localStorage.getItem("muun_user_data");
    const existing = existingData ? JSON.parse(existingData) : {};
    const mergedData = { ...existing, ...data };
    localStorage.setItem("muun_user_data", JSON.stringify(mergedData));

    setUserName(data.name);
    const date = convertToSolarDate(data.birthDate, "12:00", data.calendarType, data.isLeapMonth);
    const result = getDailyFortune(date, data.gender);
    setFortune(result);
    setShowResult(true);
    window.scrollTo(0, 0);
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  // ── 입력 화면 (절대 수정 금지) ────────────────────────────────────────────
  if (!showResult) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-base md:text-lg font-bold text-white">오늘의 운세</h1>
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-5`}
          >
            {/* Hero Section - 컴팩트하게 */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-xl">
                <Sun className="w-3 h-3 text-orange-400" />
                <span className="text-[10px] md:text-sm md:text-xs font-bold tracking-wider text-orange-400 uppercase">오늘 하루의 기운</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">오늘의 운세</h2>
              <p className="text-muted-foreground text-xs md:text-base md:text-sm">
                오늘 하루의 기운을 미리 확인하고 행운을 잡아보세요
              </p>
            </div>

            {/* Input Form Card - 컴팩트하게 */}
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-orange-400" />
                  </div>
                  운세 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name & Gender Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-orange-400" />
                        이름
                      </Label>
                      <Input
                        id="name"
                        placeholder="이름을 입력해주세요"
                        {...form.register("name")}
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-orange-500/50 focus:border-orange-500 transition-all text-base md:text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                        성별
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("gender")}
                        onValueChange={(value) => {
                          if (value) form.setValue("gender", value as "male" | "female");
                        }}
                        className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                      >
                        <ToggleGroupItem
                          value="male"
                          className="h-full rounded-lg data-[state=on]:bg-orange-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="h-full rounded-lg data-[state=on]:bg-orange-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className="space-y-1.5">
                    <Label htmlFor="birthDate" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-orange-400" />
                      생년월일
                    </Label>
                    <DatePickerInput
                      id="birthDate"
                      {...form.register("birthDate")}
                      accentColor="orange"
                    />
                  </div>

                  {/* 날짜 구분 */}
                  <div className="space-y-1.5">
                    <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-orange-400" />
                      날짜 구분
                    </Label>
                    <ToggleGroup
                      type="single"
                      value={form.watch("calendarType")}
                      onValueChange={(value) => {
                        if (value) form.setValue("calendarType", value as "solar" | "lunar");
                      }}
                      className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                    >
                      <ToggleGroupItem value="solar" className="h-full rounded-lg data-[state=on]:bg-orange-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                        양력
                      </ToggleGroupItem>
                      <ToggleGroupItem value="lunar" className="h-full rounded-lg data-[state=on]:bg-orange-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                        음력
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* 윤달 여부 (음력일 때만 표시) */}
                  {form.watch("calendarType") === "lunar" && (
                    <div className="flex items-center gap-2 px-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          {...form.register("isLeapMonth")}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 accent-orange-500"
                        />
                        <span className="text-base md:text-sm text-white/80 group-hover:text-orange-400 transition-colors">윤달(Leap Month)인 경우 체크</span>
                      </label>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm md:text-base rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    오늘의 운세 확인하기
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Feature Cards - 더 컴팩트하게 */}
            <div className="grid grid-cols-4 gap-2 md:gap-3">
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto">
                    <Zap className="w-4 h-4 md:w-4.5 md:h-4.5 text-orange-400" />
                  </div>
                  <p className="text-[10px] md:text-sm md:text-xs font-medium text-white">오늘의 총운</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center mx-auto">
                    <Star className="w-4 h-4 md:w-4.5 md:h-4.5 text-yellow-400" />
                  </div>
                  <p className="text-[10px] md:text-sm md:text-xs font-medium text-white">행운 점수</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-pink-500/10 flex items-center justify-center mx-auto">
                    <Palette className="w-4 h-4 md:w-4.5 md:h-4.5 text-pink-400" />
                  </div>
                  <p className="text-[10px] md:text-sm md:text-xs font-medium text-white">행운의 컬러</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-xl">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto">
                    <MapPin className="w-4 h-4 md:w-4.5 md:h-4.5 text-blue-400" />
                  </div>
                  <p className="text-[10px] md:text-sm md:text-xs font-medium text-white">행운의 방향</p>
                </CardContent>
              </Card>
            </div>

            {/* SEO 콘텐츠 */}
            <DailyFortuneContent />
          </motion.div>
        </main>
      </div>
    );
  }

  // ── 결과 화면 (전면 개편) ────────────────────────────────────────────────
  if (!fortune) return null;
  const { extended } = fortune;

  return (
    <>
      <Helmet>
        <title>오늘의 운세 - 무운</title>
        <meta name="description" content={`당신의 사주팔자를 기반으로 오늘의 운세를 알아보세요. 운세 점수, 연애운, 재물운, 직업운 등을 매일 마다 업데이트합니다.`} />
        <meta property="og:title" content="오늘의 운세 - 무운" />
        <meta property="og:description" content="당신의 사주팔자를 기반으로 오늘의 운세를 알아보세요." />
        <meta property="og:image" content="https://muunsaju.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://muunsaju.com/og-image.png" />
        <meta name="keywords" content="오늘의 운세, 사주 운세, 당신의 운세, 일일 운세, 무운" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px]" />
        </div>

        {/* 헤더 */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
                onClick={() => setShowResult(false)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-base md:text-lg font-bold text-white">오늘의 운세 리포트</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-orange-400 min-w-[44px] min-h-[44px]"
              onClick={() => {
                shareContent({
                  title: '무운 오늘의 운세',
                  text: `오늘 내 운세 점수는 ${fortune.score}점! 오늘의 운세를 확인해보세요.`,
                  page: 'daily_fortune',
                  buttonType: 'icon',
                });
              }}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-6">
          <div className="w-full max-w-2xl mx-auto space-y-4">

            {/* ─────────────────────────────────────────────────────────────
                SECTION 1: HERO — 종합 운세 점수 + 에너지 총평
            ───────────────────────────────────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                {/* 그라디언트 상단 바 */}
                <div className="h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600" />
                <CardContent className="p-6 space-y-5">
                  {/* 배지 */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                      <Zap className="w-3 h-3 text-orange-400" />
                      <span className="text-[10px] font-bold tracking-widest text-orange-400 uppercase">Section 01 · Hero</span>
                    </div>
                    <div className="text-xs text-white/40">{fortune.date}</div>
                  </div>

                  {/* 이름 + 키워드 */}
                  <div className="text-center space-y-1">
                    <p className="text-sm text-white/60">
                      <span className="text-orange-400 font-bold">{userName}</span>님의 오늘 에너지 키워드
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/10 border border-orange-500/30">
                      <span className="text-xl font-black text-white">{extended.energyKeyword}</span>
                    </div>
                  </div>

                  {/* 점수 게이지 */}
                  <AnimatedScore score={fortune.score} />

                  {/* 십신 배지 */}
                  <div className="flex justify-center">
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
                      <p className="text-[10px] text-white/40 mb-0.5">오늘의 십신</p>
                      <p className="text-base font-bold text-orange-400">{fortune.tenGod}</p>
                    </div>
                  </div>

                  {/* 에너지 총평 */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-white/80 leading-relaxed">{extended.overallEnergy}</p>
                  </div>

                  {/* 요약 */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
                    <TrendingUp className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-white/70">{fortune.summary}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 2: ANALYSIS — 오행 밸런스 + 의사결정 매트릭스
            ───────────────────────────────────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-green-500 via-blue-400 to-purple-500" />
                <CardContent className="p-6 space-y-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <Brain className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] font-bold tracking-widest text-green-400 uppercase">Section 02 · Analysis</span>
                  </div>

                  {/* 오행 밸런스 */}
                  <div>
                    <SectionHeader
                      icon={<Wind className="w-4 h-4 text-green-400" />}
                      label="오행 분석"
                      title="오행(五行) 밸런스"
                      accent="green"
                    />
                    <div className="space-y-3">
                      {extended.elementBalance.map((el) => (
                        <ElementBar key={el.name} name={el.name} value={el.value} fullMark={el.fullMark} />
                      ))}
                    </div>
                    <p className="text-xs text-white/40 mt-3 text-center">사주 8자 기준 오행 분포도</p>
                  </div>

                  {/* 구분선 */}
                  <div className="border-t border-white/5" />

                  {/* 의사결정 매트릭스 */}
                  <div>
                    <SectionHeader
                      icon={<Brain className="w-4 h-4 text-purple-400" />}
                      label="의사결정 매트릭스"
                      title="오늘의 판단 지수"
                      accent="purple"
                    />
                    <div className="space-y-4">
                      <MatrixGauge
                        label="논리 vs 직관"
                        value={extended.decisionMatrix.logicScore}
                        leftLabel="논리"
                        rightLabel="직관"
                        icon={<Brain className="w-3 h-3 text-purple-400" />}
                      />
                      <MatrixGauge
                        label="공격 vs 수비"
                        value={extended.decisionMatrix.offenseScore}
                        leftLabel="공격"
                        rightLabel="수비"
                        icon={<Sword className="w-3 h-3 text-red-400" />}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center">
                        <p className="text-[10px] text-white/40">논리 지수</p>
                        <p className="text-2xl font-black text-purple-400">{extended.decisionMatrix.logicScore}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                        <p className="text-[10px] text-white/40">직관 지수</p>
                        <p className="text-2xl font-black text-blue-400">{extended.decisionMatrix.intuitionScore}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-center">
                        <p className="text-[10px] text-white/40">공격 지수</p>
                        <p className="text-2xl font-black text-red-400">{extended.decisionMatrix.offenseScore}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20 text-center">
                        <p className="text-[10px] text-white/40">수비 지수</p>
                        <p className="text-2xl font-black text-green-400">{extended.decisionMatrix.defenseScore}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 3: TIMELINE — 24시간 운세 흐름
            ───────────────────────────────────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-yellow-500 via-orange-400 to-red-500" />
                <CardContent className="p-6 space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                    <Clock className="w-3 h-3 text-yellow-400" />
                    <span className="text-[10px] font-bold tracking-widest text-yellow-400 uppercase">Section 03 · Timeline</span>
                  </div>

                  <SectionHeader
                    icon={<Clock className="w-4 h-4 text-yellow-400" />}
                    label="12시진 흐름"
                    title="오늘의 운세 타임라인"
                    accent="yellow"
                  />

                  <TimelineChart slots={extended.timeline} />

                  {/* 시진 상세 리스트 (상위 3개) */}
                  <div className="space-y-2">
                    {[...extended.timeline]
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 3)
                      .map((slot, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-3 rounded-xl border ${
                            slot.isGoldenTime
                              ? 'bg-yellow-500/10 border-yellow-500/30'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            slot.isGoldenTime ? 'bg-yellow-500/20' : 'bg-orange-500/10'
                          }`}>
                            {slot.isGoldenTime
                              ? <Star className="w-4 h-4 text-yellow-400" />
                              : <Clock className="w-4 h-4 text-orange-400" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-bold ${slot.isGoldenTime ? 'text-yellow-400' : 'text-white'}`}>
                                {slot.label}
                              </p>
                              {slot.isGoldenTime && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-bold">GOLDEN</span>
                              )}
                            </div>
                            <p className="text-xs text-white/50 truncate">{slot.description}</p>
                          </div>
                          <div className={`text-lg font-black ${slot.isGoldenTime ? 'text-yellow-400' : 'text-orange-400'}`}>
                            {slot.score}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 4: CAUTIONS — 오늘 조심해야 할 것
            ───────────────────────────────────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-red-600 via-red-400 to-orange-500" />
                <CardContent className="p-6 space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span className="text-[10px] font-bold tracking-widest text-red-400 uppercase">Section 04 · Cautions</span>
                  </div>

                  <SectionHeader
                    icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
                    label="명리학적 주의사항"
                    title="오늘 조심해야 할 것들"
                    accent="red"
                  />

                  <div className="space-y-3">
                    {extended.cautions.map((caution, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20"
                      >
                        <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">{caution.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                              {CAUTION_CATEGORY_ICON[caution.category]}
                              {caution.category}
                            </span>
                            <p className="text-sm font-bold text-white">{caution.title}</p>
                          </div>
                          <p className="text-xs text-white/60 leading-relaxed">{caution.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 5: LUCK BOOSTERS — 오늘 하면 좋은 것
            ───────────────────────────────────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500" />
                <CardContent className="p-6 space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <Lightbulb className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] font-bold tracking-widest text-green-400 uppercase">Section 05 · Luck Boosters</span>
                  </div>

                  <SectionHeader
                    icon={<Lightbulb className="w-4 h-4 text-green-400" />}
                    label="기운 상승 활동"
                    title="오늘 하면 좋은 것들"
                    accent="green"
                  />

                  <div className="space-y-3">
                    {extended.luckBoosters.map((booster, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="p-4 rounded-xl bg-green-500/5 border border-green-500/20"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 text-xl">
                            {booster.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-bold text-white">{booster.title}</p>
                              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed mb-2">{booster.description}</p>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-green-400/60" />
                              <span className="text-[10px] text-green-400/80 font-medium">{booster.timing}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 6: SPATIAL — 행운의 방향 + 데스크테리어
            ───────────────────────────────────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-500" />
                <CardContent className="p-6 space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <Compass className="w-3 h-3 text-blue-400" />
                    <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">Section 06 · Spatial</span>
                  </div>

                  <SectionHeader
                    icon={<Compass className="w-4 h-4 text-blue-400" />}
                    label="공간 에너지"
                    title="행운의 방향 & 데스크테리어"
                    accent="blue"
                  />

                  {/* 나침반 + 행운 컬러 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                      <p className="text-xs text-white/50 font-medium">행운의 방향</p>
                      <CompassWidget
                        direction={extended.spatial.luckyDirection}
                        angle={extended.spatial.luckyDirectionAngle}
                        colorHex={extended.spatial.luckyColorHex}
                      />
                      <div className="mt-8" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex-1">
                        <p className="text-xs text-white/50 mb-2">행운의 컬러</p>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl border-2 border-white/20 flex-shrink-0"
                            style={{ backgroundColor: extended.spatial.luckyColorHex }}
                          />
                          <div>
                            <p className="text-sm font-bold text-white">{extended.spatial.luckyColor}</p>
                            <p className="text-[10px] text-white/40">{extended.spatial.luckyColorHex}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex-1">
                        <p className="text-xs text-white/50 mb-2">행운의 방향</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                            {DIRECTION_ICON[extended.spatial.luckyDirection] ?? <Compass className="w-4 h-4" />}
                          </div>
                          <p className="text-sm font-bold text-white">{extended.spatial.luckyDirection}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 데스크테리어 */}
                  <div>
                    <p className="text-sm font-bold text-white/80 mb-3 flex items-center gap-2">
                      <span className="text-base">🖥️</span> 행운을 부르는 데스크테리어
                    </p>
                    <div className="space-y-2">
                      {extended.spatial.deskItems.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-400">{idx + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{item.name}</p>
                            <p className="text-xs text-white/50">{item.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 7: SYNERGY — Saju x MBTI 역추천
            ───────────────────────────────────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500" />
                <CardContent className="p-6 space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                    <Users className="w-3 h-3 text-purple-400" />
                    <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase">Section 07 · Synergy</span>
                  </div>

                  <SectionHeader
                    icon={<Users className="w-4 h-4 text-purple-400" />}
                    label="사주 x MBTI 시너지"
                    title="오늘의 에너지 보완 유형"
                    accent="purple"
                  />

                  {/* MBTI 카드 */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-rose-500/5 border border-purple-500/30 p-6">
                    {/* 배경 장식 */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/20 border border-purple-500/40 flex items-center justify-center">
                          <span className="text-2xl font-black text-white">{extended.synergy.mbtiType}</span>
                        </div>
                        <div>
                          <p className="text-lg font-black text-white">{extended.synergy.mbtiType}</p>
                          <p className="text-sm text-purple-300">{extended.synergy.mbtiDescription}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-white/70 leading-relaxed">{extended.synergy.reason}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <div className="w-1 h-1 rounded-full bg-purple-400" />
                          <p className="text-xs text-purple-300 italic">{extended.synergy.compatibility}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-white/30 text-center">
                    * 결핍된 오행 기운을 보완해줄 수 있는 MBTI 유형을 명리학적으로 역추천합니다.
                  </p>
                </CardContent>
              </Card>
            </motion.section>

            {/* ─── 액션 버튼 ─────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-3 pt-2"
            >
              <Button
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {
                  shareContent({
                    title: '무운 오늘의 운세',
                    text: `오늘 내 운세 점수는 ${fortune.score}점! 오늘의 운세를 확인해보세요.`,
                    page: 'daily_fortune',
                    buttonType: 'text_button',
                  });
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                친구에게 공유하기
              </Button>
              <Button
                variant="ghost"
                className="w-full text-white/60 hover:text-white hover:bg-white/5 h-11 rounded-xl font-medium text-sm"
                onClick={() => setShowResult(false)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다시 입력하기
              </Button>
            </motion.div>

          </div>

          {/* SEO 콘텐츠 */}
          <div className="w-full max-w-2xl mx-auto mt-8">
            <DailyFortuneContent />
          </div>
        </main>
      </div>
    </>
  );
}
