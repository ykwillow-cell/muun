import { useState, useEffect } from "react";
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Info, Share2, Sparkles, RefreshCcw, Zap, User, Activity, ScrollText, Calendar, Clock } from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";
import { Link, useLocation } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BirthTimeSelect } from "@/components/ui/birth-time-select";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateSaju, SajuResult, FiveElement } from "@/lib/saju";
import { convertToSolarDate } from "@/lib/lunar-converter";
import SajuGlossary from "@/components/SajuGlossary";
import ManselyeokContent from "@/components/ManselyeokContent";
import { getHeroBirthForForm } from "@/lib/user-birth";

// 폼 스키마 정의
const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime: z.string(),
  birthTimeUnknown: z.boolean().default(false),
  calendarType: z.enum(["solar", "lunar"]),
  isLeapMonth: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const getElementColor = (element: FiveElement) => {
  switch (element) {
    case '木': return 'text-green-600 border-green-400/30 bg-green-400/10';
    case '火': return 'text-red-600 border-red-400/30 bg-red-400/10';
    case '土': return 'text-yellow-600 border-yellow-400/30 bg-yellow-400/10';
    case '金': return 'text-[#6a6a66] border-[#6a6a66]/30 bg-[#6a6a66]/10';
    case '水': return 'text-blue-600 border-blue-400/30 bg-blue-400/10';
    default: return 'text-[#1a1a18] border-black/15 bg-black/06';
  }
};

export default function Manselyeok() {
  useCanonical('/manselyeok');

  const [result, setResult] = useState<SajuResult | null>(null);
  const [location, setLocation] = useLocation();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "2000-01-01",
      birthTime: "12:00",
      birthTimeUnknown: false,
      calendarType: "solar",
      isLeapMonth: false,
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.reset(parsed);
        return;
      } catch {}
    }
    const heroBirth = getHeroBirthForForm();
    if (heroBirth) {
      form.setValue("birthDate", heroBirth.birthDate);
      form.setValue("calendarType", heroBirth.calendarType);
      form.setValue("birthTime", heroBirth.birthTime);
      form.setValue("birthTimeUnknown", heroBirth.birthTimeUnknown);
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    localStorage.setItem("muun_user_data", JSON.stringify(data));
    
    // 오늘의 운세에서 온 경우 바로 돌아가기
    const params = new URLSearchParams(window.location.search);
    if (params.get("redirect") === "daily-fortune") {
      setLocation("/daily-fortune");
      return;
    }

    const time = data.birthTimeUnknown ? "12:00" : data.birthTime;
    const date = convertToSolarDate(data.birthDate, time, data.calendarType, data.isLeapMonth);
    const sajuResult = calculateSaju(date, data.gender);
    setResult(sajuResult);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  return (
    <div className="min-h-screen bg-[#F5F4F8] text-foreground pb-20 antialiased">
      <Helmet>
        <title>무료 만세력 조회 - 회원가입 없이 사주팔자 확인 | 무운 (MuUn)</title>
        <meta name="description" content="회원가입 없이 생년월일시만 입력하면 바로 확인하는 무료 만세력 분석. 사주팔자, 오행 구성, 천간지지를 개인정보 저장 없이 100% 무료로 제공합니다." />
        <meta name="keywords" content="만세력, 무료만세력, 사주팔자, 오행분석, 천간지지, 무료사주, 만세력조회, 사주보기" />
        <link rel="canonical" href="https://muunsaju.com/manselyeok" />
        <meta property="og:title" content="무료 만세력 조회 - 회원가입 없이 사주팔자 확인 | 무운 (MuUn)" />
        <meta property="og:description" content="회원가입 없이 생년월일시만 입력하면 바로 확인하는 무료 만세력 분석. 사주팔자, 오행 구성, 천간지지를 개인정보 저장 없이 100% 무료로 제공합니다." />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:url" content="https://muunsaju.com/manselyeok" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="무료 만세력 조회 - 회원가입 없이 사주팔자 확인 | 무운 (MuUn)" />
        <meta name="twitter:description" content="회원가입 없이 생년월일시만 입력하면 바로 확인하는 무료 만세력 분석. 사주팔자, 오행 구성, 천간지지를 개인정보 저장 없이 100% 무료로 제공합니다." />
        <meta name="twitter:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"홈","item":"https://muunsaju.com"},{"@type":"ListItem","position":2,"name":"만세력","item":"https://muunsaju.com/manselyeok"}]})}</script>
        <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"만세력이란 무엇인가요?","acceptedAnswer":{"@type":"Answer","text":"만세력은 사주팔자를 연월일시로 정리한 동양의 달력 체계입니다. 개인의 생년월일시에 해당하는 사주팔자(년주, 월주, 일주, 시주)를 확인할 수 있습니다."}},{"@type":"Question","name":"만세력 조회는 무료인가요?","acceptedAnswer":{"@type":"Answer","text":"네, 무운의 만세력 서비스는 100% 무료입니다. 회원가입이나 개인정보 저장 없이 생년월일시만 입력하면 즉시 확인할 수 있습니다."}},{"@type":"Question","name":"만세력에서 무엇을 알 수 있나요?","acceptedAnswer":{"@type":"Answer","text":"사주팔자(년월일시 주), 오행(목화토금수) 구성, 천간지지 분석, 일주의 신살, 대운 등을 확인할 수 있습니다."}},{"@type":"Question","name":"양력과 음력 중 어떤 것을 선택해야 하나요?","acceptedAnswer":{"@type":"Answer","text":"일반적으로 양력을 선택하지만, 음력으로 태어난 경우 음력을 선택하세요. 확실하지 않다면 양력을 선택하는 것이 일반적입니다."}}]})}</script>
        <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"Service","name":"무료 만세력 조회","description":"사주팔자 기반의 무료 만세력 분석 서비스","provider":{"@type":"Organization","name":"무운 (MuUn)","url":"https://muunsaju.com"},"url":"https://muunsaju.com/manselyeok","serviceType":"만세력","areaServed":"KR","isAccessibleForFree":true,"offers":{"@type":"Offer","price":"0","priceCurrency":"KRW"}})}</script>
      </Helmet>
      {/* '시간 모름' 시 안내 라벨 */}
      {form.watch("birthTimeUnknown") && (
        <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 relative z-50">
          <p className="text-[10px] md:text-xs text-primary text-center font-medium">
            태어난 시간을 제외한 삼주 분석 결과입니다
          </p>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" className="mr-2 text-[#1a1a18] hover:bg-black/[0.06] -ml-2 flex items-center gap-1 text-sm font-medium">
                <ChevronLeft className="h-5 w-5" />
                <span>홈</span>
              </Button>
            </Link>
            <h1 className="text-base font-bold text-[#1a1a18]">만세력</h1>
          </div>
          {result && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-[#1a1a18] hover:bg-black/[0.06] min-w-[44px] min-h-[44px]"
                onClick={() => setResult(null)}
              >
                <RefreshCcw className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-emerald-400 min-w-[44px] min-h-[44px]"
                onClick={() => {
                  shareContent({
                    title: '무운 만세력 결과',
                    text: `${form.getValues('name')}님의 사주팔자 만세력 결과를 확인해보세요!`,
                    page: 'manselyeok',
                    buttonType: 'icon',
                  });
                }}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`${commonMaxWidth} space-y-5`}
            >
              {/* Hero Section - 컴팩트하게 */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-500/20 text-emerald-600 text-xs font-medium">
                  <Activity className="w-3 h-3" />
                  <span>정통 만세력 분석</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1a18]">만세력</h2>
                <p className="text-muted-foreground text-xs md:text-sm">
                  정확한 사주팔자 분석을 위해 태어난 시간을 입력해주세요
                </p>
              </div>

              {/* Input Form Card - 컴팩트하게 */}
              <Card className="bg-white rounded-2xl shadow-sm border border-black/[0.06] overflow-hidden">
                <CardHeader className="border-b border-black/[0.06] px-4 py-3 md:px-6 md:py-4">
                  <CardTitle className="text-[#1a1a18] flex items-center gap-2 text-base md:text-lg">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-400" />
                    </div>
                    사용자 정보 입력
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name & Gender Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-emerald-400" />
                          이름
                        </Label>
                        <Input 
                          id="name" 
                          placeholder="이름" 
                          {...form.register("name")} 
                          className="h-11 bg-[#F7F5F3] border-[#E8E5E0] text-[#1a1a18] placeholder:text-[#b0ada6] rounded-xl focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm"
                        />
                        {form.formState.errors.name && (
                          <p className="text-destructive text-xs font-medium">{form.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          성별
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("gender")}
                          onValueChange={(value) => {
                            if (value) form.setValue("gender", value as "male" | "female");
                          }}
                          className="w-full h-11 grid grid-cols-2 gap-[3px] bg-[#EDE8E8] rounded-xl p-[3px]"
                        >
                          <ToggleGroupItem
                            value="male"
                            className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-emerald-600 data-[state=on]:shadow-sm text-[#5a5a56] transition-all font-medium text-sm"
                          >
                            남성
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="female"
                            className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-emerald-600 data-[state=on]:shadow-sm text-[#5a5a56] transition-all font-medium text-sm"
                          >
                            여성
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>

                    {/* Birth Date & Time Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthDate" className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          생년월일
                        </Label>
                        <DatePickerInput
                          id="birthDate"
                          {...form.register("birthDate")}
                          value={form.watch("birthDate")}
                          accentColor="emerald"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="birthTime" className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          태어난 시간
                        </Label>
                        <BirthTimeSelect
                          value={form.watch("birthTime")}
                          onChange={(val) => form.setValue("birthTime", val)}
                          onUnknownChange={(isUnknown) => form.setValue("birthTimeUnknown", isUnknown)}
                          isUnknown={form.watch("birthTimeUnknown")}
                          accentClass="focus:ring-emerald-500/50 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Calendar Type */}
                    <div className="space-y-1.5">
                      <Label className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
                        <ScrollText className="w-3.5 h-3.5 text-emerald-400" />
                        날짜 구분
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("calendarType")}
                        onValueChange={(value) => {
                          if (value) form.setValue("calendarType", value as "solar" | "lunar");
                        }}
                        className="w-full md:w-48 h-11 grid grid-cols-2 gap-[3px] bg-[#EDE8E8] rounded-xl p-[3px]"
                      >
                        <ToggleGroupItem
                          value="solar"
                          className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-emerald-600 data-[state=on]:shadow-sm text-[#5a5a56] transition-all font-medium text-sm"
                        >
                          양력
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="lunar"
                          className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-emerald-600 data-[state=on]:shadow-sm text-[#5a5a56] transition-all font-medium text-sm"
                        >
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
                            style={{ width: '16px', height: '16px', minWidth: '16px', flexShrink: 0, accentColor: '#10b981' }}
                            className="rounded border-black/10 cursor-pointer"
                          />
                          <span className="text-sm text-[#1a1a18] group-hover:text-emerald-400 transition-colors">윤달(Leap Month)인 경우 체크</span>
                        </label>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                      className="w-full h-12 text-white font-bold text-sm md:text-base rounded-xl shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                   만세력 분석하기
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Feature Cards - 더 컴팩트하게 */}
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                <Card className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                  <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto">
                      <ScrollText className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-[10px] md:text-xs font-medium text-[#1a1a18]">사주팔자</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                  <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-teal-500/10 flex items-center justify-center mx-auto">
                      <Activity className="w-4 h-4 text-teal-600" />
                    </div>
                    <p className="text-[10px] md:text-xs font-medium text-[#1a1a18]">오행 분석</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                  <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center mx-auto">
                      <Zap className="w-4 h-4 text-cyan-600" />
                    </div>
                    <p className="text-[10px] md:text-xs font-medium text-[#1a1a18]">대운 세운</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                  <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto">
                      <Info className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-[10px] md:text-xs font-medium text-[#1a1a18]">상세 해석</p>
                  </CardContent>
                </Card>
              </div>

              {/* SEO 콘텐츠 */}
              <ManselyeokContent />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`${commonMaxWidth} space-y-5 md:space-y-6`}
            >
              {/* Result Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-500/20 text-emerald-600 text-xs font-medium">
                  <span>만세력 분석 결과</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1a1a18]">{form.getValues('name')}님의 사주팔자</h2>
              </div>

              {/* 사주팔자 테이블 */}
              <Card className="bg-white border border-black/[0.06] rounded-2xl shadow-sm overflow-hidden">
                <CardHeader className="border-b border-black/[0.06] px-4 py-3">
                  <CardTitle className="text-sm md:text-base flex items-center gap-2 text-emerald-600">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <ScrollText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </div>
                    사주팔자 (四柱八字)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-4 gap-2 md:gap-3">
                    {[
                      { label: '시주', pillar: result.hourPillar },
                      { label: '일주', pillar: result.dayPillar },
                      { label: '월주', pillar: result.monthPillar },
                      { label: '년주', pillar: result.yearPillar },
                    ].map((item) => (
                      <div key={item.label} className="text-center space-y-1.5">
                        <p className="text-[10px] md:text-xs text-[#5a5a56]">{item.label}</p>
                        <div className="space-y-1">
                          <div className={`p-2 rounded-lg border ${getElementColor(item.pillar.stemElement)}`}>
                            <p className="text-base md:text-xl font-bold">{item.pillar.stem}</p>
                            <p className="text-[9px] md:text-[10px] opacity-70">{item.pillar.stemElement}</p>
                          </div>
                          <div className={`p-2 rounded-lg border ${getElementColor(item.pillar.branchElement)}`}>
                            <p className="text-base md:text-xl font-bold">{item.pillar.branch}</p>
                            <p className="text-[9px] md:text-[10px] opacity-70">{item.pillar.branchElement}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 오행 분석 */}
              <Card className="bg-white border border-black/[0.06] rounded-2xl shadow-sm overflow-hidden">
                <CardHeader className="border-b border-black/[0.06] px-4 py-3">
                  <CardTitle className="text-sm md:text-base flex items-center gap-2 text-emerald-600">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Activity className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </div>
                    오행 분석
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-5 gap-2">
                    {(['木', '火', '土', '金', '水'] as FiveElement[]).map((element) => {
                      const count = [
                        result.yearPillar.stemElement,
                        result.yearPillar.branchElement,
                        result.monthPillar.stemElement,
                        result.monthPillar.branchElement,
                        result.dayPillar.stemElement,
                        result.dayPillar.branchElement,
                        result.hourPillar.stemElement,
                        result.hourPillar.branchElement,
                      ].filter(e => e === element).length;
                      
                      return (
                        <div key={element} className={`text-center p-2 md:p-3 rounded-lg border ${getElementColor(element)}`}>
                          <p className="text-base md:text-xl font-bold">{element}</p>
                          <p className="text-[10px] md:text-xs mt-0.5">{count}개</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 용어 설명 */}
              <SajuGlossary />

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <Button
                    className="flex-1 h-11 font-bold text-sm rounded-xl text-white"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                    onClick={() => {
                      shareContent({
                        title: '무운 만세력 결과',
                        text: `${form.getValues('name')}님의 사주팔자 만세력 결과를 확인해보세요!`,
                        page: 'manselyeok',
                        buttonType: 'text_button',
                      });
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    결과 공유
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-11 font-medium text-sm rounded-xl border-[#E8E5E0] text-[#1a1a18]"
                    onClick={() => setResult(null)}
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    다시보기
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
