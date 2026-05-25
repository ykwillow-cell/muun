import { useState, useEffect } from "react";
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Sparkles, UtensilsCrossed, User, Calendar, RefreshCw, Zap } from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BirthTimeSelect } from "@/components/ui/birth-time-select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getLuckyLunchResult } from "@/lib/luckyLunch";
import { calculateSaju } from "@/lib/saju";
import { convertToSolarDate } from "@/lib/lunar-converter";
import { shareContent } from "@/lib/share";
import { cleanAIContent } from "@/lib/content-cleaner";

const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime: z.string().default("12:30"),
  birthTimeUnknown: z.boolean().default(false),
  calendarType: z.enum(["solar", "lunar"]).default("solar"),
  isLeapMonth: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const ENERGY_STAR = ["", "★", "★★", "★★★", "★★★★", "★★★★★"] as const;

export default function LuckyLunch() {
  useCanonical('/lucky-lunch');

  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  // 결과 화면일 때 RouteBanner 숨기기
  useEffect(() => {
    if (showResult) {
      window.dispatchEvent(new Event('muun:banner:hide'));
    } else {
      window.dispatchEvent(new Event('muun:banner:show'));
    }
    return () => {
      window.dispatchEvent(new Event('muun:banner:show'));
    };
  }, [showResult]);

  const [userName, setUserName] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "",
      birthTime: "12:30",
      birthTimeUnknown: false,
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
        birthDate: parsed.birthDate || "",
        birthTime: parsed.birthTime || "12:30",
        birthTimeUnknown: false,
        calendarType: parsed.calendarType || "solar",
        isLeapMonth: parsed.isLeapMonth || false,
      });
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    let birthDateStr = data.birthDate;
    if (typeof birthDateStr === 'string') {
      birthDateStr = birthDateStr.replace(/[\.\\/]/g, '-').replace(/\s/g, '');
      if (/^\d{8}$/.test(birthDateStr)) {
        birthDateStr = `${birthDateStr.substring(0, 4)}-${birthDateStr.substring(4, 6)}-${birthDateStr.substring(6, 8)}`;
      }
    } else if (birthDateStr instanceof Date) {
      birthDateStr = (birthDateStr as Date).toISOString().split('T')[0];
    }
    const dateParts = String(birthDateStr).match(/\d+/g);
    let finalDateStr = "2000-01-01";
    if (dateParts && dateParts.length >= 3) {
      finalDateStr = `${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
    }
    const existingData = localStorage.getItem("muun_user_data");
    const existing = existingData ? JSON.parse(existingData) : {};
    localStorage.setItem("muun_user_data", JSON.stringify({ ...existing, ...data }));

    setUserName(data.name);
    const rawTime = data.birthTimeUnknown ? "12:00" : data.birthTime;
    const time = /^\d{2}:\d{2}$/.test(rawTime) ? rawTime : "12:00";
    const date = convertToSolarDate(finalDateStr, time, data.calendarType, data.isLeapMonth);
    const saju = calculateSaju(date, data.gender);
    const lunchResult = getLuckyLunchResult(saju);
    setResult(lunchResult);
    setShowResult(true);
    window.scrollTo(0, 0);
  };

  const toggleClass = "w-full h-11 flex gap-[3px] bg-[#EDE8E8] rounded-xl p-[3px]";
  const toggleItemClass = "flex-1 h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-purple-600 data-[state=on]:shadow-sm text-[#5a5a56] transition-all font-medium text-sm";
  const labelClass = "text-sm font-medium text-[#3d3d3a] flex items-center gap-1.5";
  const inputClass = "h-11 bg-[#F7F6FF] border-[#e0daf5] text-[#1a1a18] placeholder:text-[#b0adc8] rounded-xl focus:ring-purple-400/30 focus:border-purple-400 transition-all text-sm";

  // ── 입력 화면 ────────────────────────────────────────────
  if (!showResult) {
    return (
      <div className="mu-subpage-screen min-h-screen bg-[#F5F4FB] pb-16">
        <header className="mu-subpage-header sticky top-[60px] z-50 bg-white/90 backdrop-blur border-b border-black/[0.06]">
          <div className="w-full px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" className="-ml-2 mr-1 flex items-center gap-1 text-sm font-medium text-[#3d3d3a] hover:bg-purple-50">
                <ChevronLeft className="h-5 w-5" />홈
              </Button>
            </Link>
            <h1 className="text-base font-bold text-[#1a1a18]">오늘의 점심 추천</h1>
          </div>
        </header>

        <main className="px-4 py-6 max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="space-y-5">

            {/* 히어로 */}
            <div className="text-center pt-2 pb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-xs font-semibold mb-3">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                사주 오행 기반 추천
              </div>
              <h2 className="text-2xl font-bold text-[#1a1a18] tracking-tight mb-1.5">오늘의 행운 점심 메뉴</h2>
              <p className="text-sm text-[#7a78a0]">생년월일을 입력하면 내 사주에 맞는 점심 메뉴를 추천해 드려요</p>
            </div>

            {/* 폼 카드 */}
            <div className="bg-white rounded-2xl border border-[#ece8f8] p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0edf9]">
                <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-purple-500" />
                </div>
                <span className="text-sm font-semibold text-[#1a1a18]">기본 정보 입력</span>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* 이름 + 성별 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className={labelClass}>
                      <User className="w-3.5 h-3.5 text-purple-400" />이름
                    </Label>
                    <Input id="name" placeholder="이름 입력" {...form.register("name")} className={inputClass} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={labelClass}>
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />성별
                    </Label>
                    <ToggleGroup type="single" value={form.watch("gender")} onValueChange={(v) => { if (v) form.setValue("gender", v as "male" | "female"); }} className={toggleClass}>
                      <ToggleGroupItem value="male" className={toggleItemClass}>남성</ToggleGroupItem>
                      <ToggleGroupItem value="female" className={toggleItemClass}>여성</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>

                {/* 생년월일 */}
                <div className="space-y-1.5">
                  <Label htmlFor="birthDate" className={labelClass}>
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />생년월일
                  </Label>
                  <DatePickerInput id="birthDate" value={form.watch("birthDate")} {...form.register("birthDate")} accentColor="purple" />
                </div>

                {/* 출생 시간 */}
                <div className="space-y-1.5">
                  <Label htmlFor="birthTime" className={labelClass}>
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />태어난 시간 <span className="text-[#b0adc8] font-normal">(선택)</span>
                  </Label>
                  <BirthTimeSelect
                    value={form.watch("birthTime")}
                    onChange={(val) => form.setValue("birthTime", val)}
                    onUnknownChange={(isUnknown) => { form.setValue("birthTimeUnknown", isUnknown); if (isUnknown) form.setValue("birthTime", "12:00"); }}
                    isUnknown={form.watch("birthTimeUnknown")}
                    accentClass="focus:ring-purple-400/50 focus:border-purple-400"
                  />
                </div>

                {/* 날짜 구분 */}
                <div className="space-y-1.5">
                  <Label className={labelClass}>
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />날짜 구분
                  </Label>
                  <ToggleGroup type="single" value={form.watch("calendarType")} onValueChange={(v) => { if (v) { form.setValue("calendarType", v as "solar" | "lunar"); if (v === "solar") form.setValue("isLeapMonth", false); } }} className={toggleClass}>
                    <ToggleGroupItem value="solar" className={toggleItemClass}>양력</ToggleGroupItem>
                    <ToggleGroupItem value="lunar" className={toggleItemClass}>음력</ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {form.watch("calendarType") === "lunar" && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={form.watch("isLeapMonth") || false} onCheckedChange={(checked) => form.setValue("isLeapMonth", checked === true)} className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500" />
                    <span className="text-sm text-[#3d3d3a]">윤달인 경우 체크</span>
                  </label>
                )}

                <button type="submit" className="w-full h-12 rounded-xl bg-[#6246b0] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#5038a0] transition-colors mt-1">
                  <UtensilsCrossed className="w-4 h-4" />
                  오늘의 점심 메뉴 추천받기
                </button>
              </form>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // ── 결과 화면 ────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>행운의 점심 메뉴 추천 - 사주 오행 기반 무료 추천 | 무운</title>
        <meta name="description" content="사주팔자 오행을 기반으로 오늘의 행운의 점심 메뉴를 추천합니다. 회원가입 없이 100% 무료로 나에게 맞는 음식을 확인하세요." />
        <meta property="og:title" content="행운의 점심 메뉴 추천 - 사주 오행 기반 무료 추천 | 무운" />
        <meta property="og:description" content="사주팔자 오행을 기반으로 오늘의 행운의 점심 메뉴를 추천합니다." />
        <meta property="og:image" content="https://muunsaju.com/images/og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://muunsaju.com/images/og-image.png" />
        <meta name="keywords" content="행운의점심, 점심메뉴추천, 오행음식, 사주음식, 행운음식, 오늘점심, 무료추천" />
        <link rel="canonical" href="https://muunsaju.com/lucky-lunch" />
      </Helmet>

      <div className="mu-subpage-screen min-h-screen bg-[#F5F4FB] pb-16">
        <header className="mu-subpage-header sticky top-[60px] z-50 bg-white/90 backdrop-blur border-b border-black/[0.06]">
          <div className="w-full px-4 h-14 flex items-center justify-between">
            <div className="flex items-center">
              <Button onClick={() => setShowResult(false)} variant="ghost" className="-ml-2 mr-1 flex items-center gap-1 text-sm font-medium text-[#3d3d3a] hover:bg-purple-50">
                <ChevronLeft className="h-5 w-5" />다시입력
              </Button>
              <h1 className="text-base font-bold text-[#1a1a18]">오늘의 점심 추천</h1>
            </div>
            <Button onClick={() => shareContent(`${userName}님의 오늘 행운 점심: ${result.recommendedMenus.map((m: any) => m.name).join(", ")}`)} variant="ghost" size="icon" className="text-[#3d3d3a] hover:bg-purple-50 min-w-[44px] min-h-[44px]">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="px-4 py-5 max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="space-y-4">

            {/* 히어로 — 오행 정보 */}
            <div className="bg-[#6246b0] rounded-2xl p-5 text-white text-center">
              <p className="text-xs font-semibold text-purple-200 mb-1">오늘 {userName}님의 기운</p>
              <h2 className="text-2xl font-bold mb-1">{result.elementName} 기운</h2>
              <p className="text-sm text-purple-100 leading-relaxed">{result.elementDescription}</p>
            </div>

            {/* 추천 메뉴 목록 */}
            <div>
              <p className="text-sm font-semibold text-[#3d3d3a] mb-3 flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-purple-500" />추천 메뉴
              </p>
              <div className="space-y-3">
                {result.recommendedMenus.map((menu: any, index: number) => (
                  <motion.div
                    key={menu.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="bg-white rounded-2xl border border-[#ece8f8] overflow-hidden shadow-sm"
                  >
                    {/* 카드 헤더 */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#f0edf9]">
                      <div className="w-7 h-7 rounded-full bg-[#6246b0] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                      <span className="text-base font-bold text-[#1a1a18] flex-1">{menu.name}</span>
                      <span className="text-xs text-purple-400 font-medium">
                        {ENERGY_STAR[Math.min(menu.energyLevel, 5)]}
                      </span>
                    </div>

                    {/* 카드 바디 */}
                    <div className="px-4 py-3 space-y-3">
                      <p className="text-sm text-[#5a5a56] leading-relaxed">{cleanAIContent(menu.description)}</p>

                      {/* 효능 */}
                      <div>
                        <p className="text-xs font-semibold text-purple-500 mb-1.5">✨ 주요 효능</p>
                        <div className="flex flex-wrap gap-1.5">
                          {menu.benefits.map((benefit: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">{benefit}</span>
                          ))}
                        </div>
                      </div>

                      {/* 재료 */}
                      <div>
                        <p className="text-xs font-semibold text-[#9080c0] mb-1.5">🥘 주요 재료</p>
                        <div className="flex flex-wrap gap-1.5">
                          {menu.ingredients.map((ingredient: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 rounded-full bg-[#f4f2ff] border border-[#e8e3f8] text-xs text-[#5a5a56]">{ingredient}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 에너지 조언 */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }} className="bg-white rounded-2xl border border-[#ece8f8] p-4 space-y-3 shadow-sm">
              <p className="text-sm font-semibold text-[#3d3d3a] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-500" />에너지 조언
              </p>
              <div className="space-y-2.5">
                <div className="bg-[#f8f6ff] rounded-xl p-3">
                  <p className="text-xs font-semibold text-purple-500 mb-1">💫 기운 활성화</p>
                  <p className="text-sm text-[#3d3d3a] leading-relaxed">{result.energyAdvice}</p>
                </div>
                <div className="bg-[#f8f6ff] rounded-xl p-3">
                  <p className="text-xs font-semibold text-purple-500 mb-1">🌿 계절 조언</p>
                  <p className="text-sm text-[#3d3d3a] leading-relaxed">{result.seasonalAdvice}</p>
                </div>
              </div>
            </motion.div>

            {/* 하단 버튼 */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.35 }} className="flex gap-3 pt-1">
              <button onClick={() => setShowResult(false)} className="flex-1 h-11 rounded-xl border border-[#ddd8f0] bg-white text-[#3d3d3a] text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-purple-50 transition-colors">
                <RefreshCw className="w-4 h-4" />다시보기
              </button>
              <button onClick={() => shareContent(`${userName}님의 오늘 행운 점심: ${result.recommendedMenus.map((m: any) => m.name).join(", ")}`)} className="flex-1 h-11 rounded-xl bg-[#6246b0] text-white text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-[#5038a0] transition-colors">
                <Share2 className="w-4 h-4" />결과 공유
              </button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </>
  );
}
