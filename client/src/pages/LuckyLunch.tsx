import { useState, useEffect } from "react";
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Sparkles, Coffee, User, Calendar, Zap } from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getLuckyLunchResult } from "@/lib/luckyLunch";
import { calculateSaju } from "@/lib/saju";
import { convertToSolarDate } from "@/lib/lunar-converter";
import { shareContent } from "@/lib/share";

const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime: z.string().default("12:00"),
  calendarType: z.enum(["solar", "lunar"]).default("solar"),
  isLeapMonth: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function LuckyLunch() {
  useCanonical('/lucky-lunch');

  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [userName, setUserName] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "2000-01-01",
      birthTime: "12:00",
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
        birthTime: parsed.birthTime || "12:00",
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
    const date = convertToSolarDate(data.birthDate, data.birthTime, data.calendarType, data.isLeapMonth);
    const saju = calculateSaju(date, data.gender);
    const lunchResult = getLuckyLunchResult(saju);
    setResult(lunchResult);
    setShowResult(true);
    window.scrollTo(0, 0);
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  // 입력 화면
  if (!showResult) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-base md:text-lg font-bold text-white">행운의 점심 메뉴</h1>
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-5`}
          >
            {/* Hero Section */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl">
                <Coffee className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] md:text-sm md:text-xs font-bold tracking-wider text-amber-400 uppercase">오늘의 추천 메뉴</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">행운의 점심 메뉴</h2>
              <p className="text-muted-foreground text-xs md:text-base md:text-sm">
                당신의 사주에 맞는 행운의 점심 메뉴를 추천받아보세요
              </p>
            </div>

            {/* Input Form Card */}
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-amber-400" />
                  </div>
                  기본 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name & Gender Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        이름
                      </Label>
                      <Input
                        id="name"
                        placeholder="이름을 입력해주세요"
                        {...form.register("name")}
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-amber-500/50 focus:border-amber-500 transition-all text-base md:text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
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
                          className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className="space-y-1.5">
                    <Label htmlFor="birthDate" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      생년월일
                    </Label>
                    <DatePickerInput
                      id="birthDate"
                      value={form.watch("birthDate")}
                      {...form.register("birthDate")}
                      accentColor="amber"
                    />
                  </div>

                  {/* Birth Time */}
                  <div className="space-y-1.5">
                    <Label htmlFor="birthTime" className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      출생 시간 (선택사항)
                    </Label>
                    <Input
                      id="birthTime"
                      type="time"
                      {...form.register("birthTime")}
                      className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-amber-500/50 focus:border-amber-500 transition-all text-base md:text-sm"
                    />
                  </div>

                  {/* Calendar Type */}
                  <div className="space-y-1.5">
                    <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
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
                      <ToggleGroupItem value="solar" className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                        양력
                      </ToggleGroupItem>
                      <ToggleGroupItem value="lunar" className="h-full rounded-lg data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm">
                        음력
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* Leap Month */}
                  {form.watch("calendarType") === "lunar" && (
                    <div className="flex items-center gap-2 px-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          {...form.register("isLeapMonth")}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 accent-amber-500"
                        />
                        <span className="text-base md:text-sm text-white/80 group-hover:text-amber-400 transition-colors">윤달(Leap Month)인 경우 체크</span>
                      </label>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm md:text-base rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    행운의 메뉴 추천받기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  // 결과 화면
  return (
    <>
      <Helmet>
        <title>{userName}님의 행운의 점심 메뉴 - 무운</title>
        <meta name="description" content={`${userName}님의 사주팔자를 기반으로 오늘의 행운의 점심 메뉴를 추천합니다. 오행 운세에 맞는 식단을 선택하세요.`} />
        <meta property="og:title" content={`${userName}님의 행운의 점심 메뉴 - 무운`} />
        <meta property="og:description" content={`${userName}님의 사주팔자를 기반으로 오늘의 행운의 점심 메뉴를 추천합니다.`} />
        <meta name="keywords" content="행운의 메뉴, 오늘의 메뉴, 사주 메뉴, 운세 메뉴, 무운" />
      </Helmet>
    <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              onClick={() => setShowResult(false)}
              variant="ghost"
              size="icon"
              className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base md:text-lg font-bold text-white">행운의 점심 메뉴</h1>
          </div>
          <Button
            onClick={() => shareContent(`${userName}님의 행운의 점심 메뉴: ${result.recommendedMenus[0]?.name || '메뉴'}`)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${commonMaxWidth} space-y-6`}
        >
          {/* Result Header */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-block">
              <div className="text-5xl mb-3">☯️</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{userName}님의 행운의 메뉴</h2>
              <p className="text-amber-400 font-bold text-xl">{result.elementName} 기운</p>
            </div>
            <p className="text-white/80 text-base md:text-sm leading-relaxed max-w-2xl mx-auto">{result.elementDescription}</p>
          </div>

          {/* Recommended Menus */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <Coffee className="w-5 h-5 text-amber-400" />
              추천 메뉴
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.recommendedMenus.map((menu: any, index: number) => (
                <motion.div
                  key={menu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass-panel border-white/5 overflow-hidden hover:border-amber-500/50 transition-all h-full group">
                    <CardHeader className="border-b border-white/5 pb-3 group-hover:border-amber-500/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm md:text-xs font-semibold text-amber-400 mb-1">추천 #{index + 1}</div>
                          <CardTitle className="text-white text-base group-hover:text-amber-400 transition-colors">{menu.name}</CardTitle>
                        </div>
                        <div className="text-2xl ml-2">🍽️</div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <p className="text-base md:text-sm text-white/70 leading-relaxed">{menu.description}</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm md:text-xs font-semibold text-amber-400 mb-2">✨ 주요 효능</p>
                          <ul className="space-y-1.5">
                            {menu.benefits.map((benefit: string, i: number) => (
                              <li key={i} className="text-sm md:text-xs text-white/70 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm md:text-xs font-semibold text-amber-400 mb-2">🥘 주요 재료</p>
                          <div className="flex flex-wrap gap-1.5">
                            {menu.ingredients.map((ingredient: string, i: number) => (
                              <span key={i} className="inline-block px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-sm md:text-xs text-white/70 hover:border-amber-400/50 transition-colors">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-white/10">
                          <p className="text-sm md:text-xs text-white/60">에너지 레벨: <span className="text-amber-400 font-semibold">{"⭐".repeat(menu.energyLevel)}</span></p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Energy Advice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="glass-panel border-white/5 overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-gradient-to-r from-amber-500/10 to-transparent">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  에너지 조언
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm md:text-xs font-semibold text-amber-400 uppercase tracking-wide">💫 기운 활성화</p>
                  <p className="text-base md:text-sm text-white/80 leading-relaxed">{result.energyAdvice}</p>
                </div>
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <p className="text-sm md:text-xs font-semibold text-amber-400 uppercase tracking-wide">🌍 계절 조언</p>
                  <p className="text-base md:text-sm text-white/80 leading-relaxed">{result.seasonalAdvice}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-3 pt-4"
          >
            <Button
              onClick={() => setShowResult(false)}
              variant="outline"
              className="flex-1 h-12 border-white/10 text-white hover:bg-white/5 rounded-xl font-semibold transition-all hover:scale-105"
            >
              다시 입력하기
            </Button>
            <Button
              onClick={() => shareContent(`${userName}님의 행운의 점심 메뉴: ${result.recommendedMenus.map((m: any) => m.name).join(", ")}`)}
              className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Share2 className="w-4 h-4 mr-2" />
              공유하기
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
    </>
  );
}
