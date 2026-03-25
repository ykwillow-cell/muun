import { useState, useEffect } from "react";
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Sparkles, User, BookOpen, Info, Calendar, ScrollText, RefreshCw, Star } from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateTojeong } from "@/lib/tojeong";
import { convertToSolarDate } from "@/lib/lunar-converter";
import TojeongContent from "@/components/TojeongContent";
import RecommendedContent from "@/components/RecommendedContent";
import { getHeroBirthForForm } from "@/lib/user-birth";

// 폼 스키마 정의 (태어난 시간 제외)
const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  calendarType: z.enum(["solar", "lunar"]),
  isLeapMonth: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

// 월별 운세 데이터 (예시 - 실제로는 144괘 데이터베이스 필요)
const getMonthlyFortunes = (hexagram: string) => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    content: `${i + 1}월은 기운이 상승하는 시기입니다. 주변의 도움으로 계획했던 일이 순조롭게 풀리며, 특히 중순 이후에는 뜻밖의 재물이 들어올 운세입니다.`,
    tag: i % 3 === 0 ? "길운" : "평탄"
  }));
};

export default function Tojeong() {
  useCanonical('/tojeong');

  const [result, setResult] = useState<any>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "2000-01-01",
      calendarType: "lunar", // 음력 기본값
      isLeapMonth: false,
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const { birthTime, ...rest } = parsed;
        form.reset({ ...form.getValues(), ...rest });
        return;
      } catch {}
    }
    const heroBirth = getHeroBirthForForm();
    if (heroBirth) {
      form.setValue("birthDate", heroBirth.birthDate);
      form.setValue("calendarType", heroBirth.calendarType);
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    localStorage.setItem("muun_user_data", JSON.stringify(data));
    const date = convertToSolarDate(data.birthDate, "12:00", data.calendarType, data.isLeapMonth);
    const tojeongResult = calculateTojeong(date, 2026);
    const monthlyFortunes = getMonthlyFortunes(tojeongResult.hexagram);
    
    setResult({
      ...tojeongResult,
      monthlyFortunes,
      name: data.name
    });
    
    window.scrollTo(0, 0);
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  if (!result) {
    return (
      <>
        <Helmet>
          <title>2026년 무료 토정비결 - 회원가입 없이 한 해 운세 확인 | 무운</title>
          <meta name="description" content="이지함 선생의 원문 괘 계산법으로 보는 2026년 병오년 무료 토정비결. 회원가입·개인정보 저장 없이 한 해의 흐름을 100% 무료로 확인하세요." />
        <meta name="keywords" content="토정비결, 무료토정비결, 2026년토정비결, 병오년토정비결, 무료운세, 한해운세, 토정비결무료" />
        <link rel="canonical" href="https://muunsaju.com/tojeong" />
          <meta property="og:title" content="2026년 무료 토정비결 - 회원가입 없이 한 해 운세 확인 | 무운" />
          <meta property="og:description" content="이지함 선생의 원문 괘 계산법으로 보는 2026년 병오년 무료 토정비결. 회원가입·개인정보 저장 없이 한 해의 흐름을 100% 무료로 확인하세요." />
                <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://muunsaju.com" },
              { "@type": "ListItem", "position": 2, "name": "토정비결", "item": "https://muunsaju.com/tojeong" }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "토정비결이란 무엇인가요?", "acceptedAnswer": { "@type": "Answer", "text": "토정비결은 조선시대 이지함 선생이 저술한 운세 예언서로, 생년월일을 바탕으로 1년의 운세를 12개월로 나누어 예측하는 전통 점술입니다." } },
              { "@type": "Question", "name": "무운의 토정비결은 무료인가요?", "acceptedAnswer": { "@type": "Answer", "text": "네, 무운의 토정비결은 100% 무료입니다. 회원가입이나 개인정보 저장 없이 생년월일만 입력하면 즉시 확인할 수 있습니다." } },
              { "@type": "Question", "name": "2026년 토정비결은 언제부터 보나요?", "acceptedAnswer": { "@type": "Answer", "text": "토정비결은 음력 기준으로 해를 나누며, 2026년 병오년 토정비결은 음력 1월 1일부터 적용됩니다. 양력 기준으로는 2026년 2월 이후부터입니다." } },
              { "@type": "Question", "name": "토정비결과 사주의 차이는 무엇인가요?", "acceptedAnswer": { "@type": "Answer", "text": "사주는 태어난 년·월·일·시 전체를 분석하여 평생의 운을 보는 반면, 토정비결은 생년월일을 바탕으로 1년의 운세 흐름을 월별로 예측하는 다른 접근법입니다." } }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "2026년 무료 토정비결",
            "description": "이지함 선생의 원문 괴 계산법으로 보는 2026년 병오년 무료 토정비결",
            "provider": { "@type": "Organization", "name": "무운 (MuUn)", "url": "https://muunsaju.com" },
            "url": "https://muunsaju.com/tojeong",
            "serviceType": "토정비결 운세",
            "areaServed": "KR",
            "isAccessibleForFree": true,
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" }
          })}
        </script>
</Helmet>
      <div className="min-h-screen bg-[#F5F4F8] text-foreground pb-16 antialiased">

        <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" className="mr-2 text-[#191F28] hover:bg-black/[0.06] -ml-2 flex items-center gap-1 text-sm font-medium">
                <ChevronLeft className="h-5 w-5" />
                <span>홈</span>
              </Button>
            </Link>
            <h2 className="text-base font-bold text-[#191F28]">무료 토정비결</h2>
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#6B5FFF]/20 text-[#6B5FFF] text-xs font-medium">
                <ScrollText className="w-3 h-3" />
                <span>2026년 병오년 운세</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#191F28]">전통 토정비결</h2>
              <p className="text-muted-foreground text-xs md:text-sm">
                이지함 선생의 원문 괘 계산법으로 한 해의 흐름을 읽어드립니다
              </p>
            </div>

            {/* Input Form Card - 컴팩트하게 */}
            <Card className="bg-white rounded-2xl shadow-sm border border-black/[0.06] overflow-hidden">
              <CardHeader className="border-b border-black/[0.06] px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-[#191F28] flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-[#6B5FFF]/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#6B5FFF]" />
                  </div>
                  운세 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name & Gender Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-[#191F28] text-sm font-medium flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#6B5FFF]" />
                        이름
                      </Label>
                      <Input
                        id="name"
                        placeholder="이름"
                        {...form.register("name")}
                        className="h-11 bg-[#F7F5F3] border-[#E8E5E0] text-[#191F28] placeholder:text-[#b0ada6] rounded-xl focus:ring-[#6B5FFF]/30 focus:border-[#6B5FFF] transition-all text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[#191F28] text-sm font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#6B5FFF]" />
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
                          className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-[#6B5FFF] data-[state=on]:shadow-sm text-[#4E5968] transition-all font-medium text-sm"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-[#6B5FFF] data-[state=on]:shadow-sm text-[#4E5968] transition-all font-medium text-sm"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  {/* Birth Date & Calendar Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate" className="text-[#191F28] text-sm font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#6B5FFF]" />
                        생년월일
                      </Label>
                      <DatePickerInput
                        id="birthDate"
                        {...form.register("birthDate")}
                        value={form.watch("birthDate")}
                        accentColor="amber"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[#191F28] text-sm font-medium flex items-center gap-1.5">
                        <ScrollText className="w-3.5 h-3.5 text-[#6B5FFF]" />
                        날짜 구분
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("calendarType")}
                        onValueChange={(value) => {
                          if (value) {
                            form.setValue("calendarType", value as "solar" | "lunar");
                            if (value === "solar") form.setValue("isLeapMonth", false);
                          }
                        }}
                        className="w-full h-11 grid grid-cols-2 gap-[3px] bg-[#EDE8E8] rounded-xl p-[3px]"
                      >
                        <ToggleGroupItem
                          value="solar"
                          className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-[#6B5FFF] data-[state=on]:shadow-sm text-[#4E5968] transition-all font-medium text-sm"
                        >
                          양력
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="lunar"
                          className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-[#6B5FFF] data-[state=on]:shadow-sm text-[#4E5968] transition-all font-medium text-sm"
                        >
                          음력
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  {/* 윤달 여부 (음력일 때만 표시) */}
                  {form.watch("calendarType") === "lunar" && (
                    <div className="flex items-center gap-2 px-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          {...form.register("isLeapMonth")}
                          style={{ width: '16px', height: '16px', minWidth: '16px', flexShrink: 0, accentColor: '#6B5FFF' }}
                          className="rounded border-black/10 cursor-pointer"
                        />
                        <span className="text-sm text-[#191F28] group-hover:text-[#6B5FFF] transition-colors">윤달(Leap Month)인 경우 체크</span>
                      </label>
                    </div>
                  )}

                  {/* Info Box */}
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-[#6B5FFF]/5 border border-[#6B5FFF]/10">
                    <Info className="w-3.5 h-3.5 text-[#6B5FFF] mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] md:text-xs text-amber-200/70 leading-relaxed">
                      토정비결은 전통적으로 <strong className="text-[#6B5FFF]">음력 생일</strong>을 기준으로 할 때 가장 정확합니다.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    style={{ background: 'linear-gradient(135deg, #6B5FFF, #4F46E5)' }}
                    className="w-full h-12 text-white font-bold text-sm md:text-base rounded-xl shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                    <ScrollText className="w-4 h-4 mr-2" />
                    2026년 토정비결 보기
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Feature Cards - 더 컴팩트하게 */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <Card className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#6B5FFF]/10 flex items-center justify-center mx-auto">
                    <ScrollText className="w-4 h-4 text-[#6B5FFF]" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-[#191F28]">144괴 해석</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center mx-auto">
                    <Calendar className="w-4 h-4 text-yellow-500" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-[#191F28]">월별 운세</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-[#191F28]">전통 해석</p>
                </CardContent>
              </Card>
            </div>

            {/* SEO 콘텐츠 */}
            <TojeongContent />
          </motion.div>
        </main>
      </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>2026년 토정비결 결과 - 무운</title>
        <meta name="description" content="전통 방식에 따른 2026년 토정비결 분석 결과입니다. 한 해의 흐름과 월별 상세 운세를 확인하세요." />
        <meta property="og:title" content="2026년 무료 토정비결 - 회원가입 없이 한 해 운세 확인 | 무운" />
        <meta property="og:description" content="이지함 선생의 원문 괘 계산법으로 보는 2026년 병오년 무료 토정비결. 회원가입·개인정보 저장 없이 한 해의 흐름을 100% 무료로 확인하세요." />
        {/* 사용자 입력 기반 결과 페이지 - 개인정보 보호 및 SEO 품질 관리 */}
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
    <div className="min-h-screen bg-[#F5F4F8] text-foreground pb-16 antialiased">
      {/* 토정비결은 원래 삼주(연,월,일)만 사용하므로 안내 라벨 표시 */}
      <div className="bg-[#6B5FFF]/10 border-b border-[#6B5FFF]/20 py-2 px-4 relative z-50">
        <p className="text-[10px] md:text-xs text-[#6B5FFF] text-center font-medium">
          전통 방식에 따른 연, 월, 일(삼주) 분석 결과입니다
        </p>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" className="mr-2 text-[#191F28] hover:bg-black/[0.06] -ml-2 flex items-center gap-1 text-sm font-medium" onClick={() => setResult(null)}>
              <ChevronLeft className="h-5 w-5" />
              <span>다시입력</span>
            </Button>
            <h1 className="text-base font-bold text-[#191F28]">토정비결 결과</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-[#6B5FFF] min-w-[44px] min-h-[44px]" 
            onClick={() => shareContent({ title: '무운 토정비결', text: '나의 2026년 운세는?', page: 'tojeong', buttonType: 'icon' })}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 px-4 py-5 md:py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${commonMaxWidth} space-y-5 md:space-y-6`}
        >
          {/* Hero Section */}
          <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#6B5FFF]/20 text-[#6B5FFF] text-xs font-medium">
              <span>제 {result.hexagram}괴</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#191F28]">2026년 토정비결 결과</h2>
            <p className="text-muted-foreground text-xs md:text-sm italic">"하늘의 기운이 땅으로 내려와 만물이 소생하는 형국입니다."</p>
          </div>

          {/* 월별 운세 타임라인 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-black/10 pb-3">
              <div className="w-8 h-8 rounded-lg bg-[#6B5FFF]/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#6B5FFF]" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-[#191F28]">월별 상세 운세</h3>
            </div>
            
            <div className="relative border-l-2 border-black/10 ml-3 pl-5 space-y-4">
              {result.monthlyFortunes.map((item: any) => (
                <motion.div 
                  key={item.month} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute -left-[27px] top-0 w-3 h-3 rounded-full bg-[#6B5FFF] border-3 border-background shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  <Card className="bg-white border border-black/[0.06] rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 group">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-base md:text-lg font-black text-[#6B5FFF] group-hover:scale-110 transition-transform origin-left">{item.month}월</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#6B5FFF]/10 text-[#6B5FFF] text-[10px] md:text-xs font-bold border border-[#6B5FFF]/20">{item.tag}</span>
                      </div>
                      <p className="text-[#4E5968] leading-relaxed text-xs md:text-sm">{item.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Quote Card */}
          <Card className="bg-[#6B5FFF]/5 border-[#6B5FFF]/20 rounded-xl overflow-hidden">
            <CardContent className="p-4 md:p-6 text-center">
              <p className="text-amber-200/80 italic text-xs md:text-sm leading-relaxed">
                "운명은 정해진 것이 아니라, 스스로 만들어가는 것입니다. 
                오늘의 지혜를 바탕으로 더 나은 내일을 설계하시기 바랍니다."
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {/* 신년운세 배너 */}
            <a href="/yearly-fortune" className="rounded-2xl p-4 flex items-center gap-4 block" style={{ background: 'linear-gradient(135deg, #2D1B5E, #1A0F3C)' }}>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/60 mb-0.5">올해의 운을 미리 확인하려면</p>
                <p className="text-sm font-bold text-white">2026년 신년운세 바로가기</p>
              </div>
              <ChevronLeft className="w-4 h-4 text-white/40 rotate-180" />
            </a>
            <div className="flex gap-2">
              <Button
                className="flex-1 h-11 font-bold text-sm rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #6B5FFF, #4F46E5)' }}
                onClick={() => shareContent({ title: '무운 토정비결', text: '나의 2026년 운세는?', page: 'tojeong', buttonType: 'text_button' })}
              >
                <Share2 className="w-4 h-4 mr-2" />
                결과 공유
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-11 font-medium text-sm rounded-xl border-[#E8E5E0] text-[#191F28]"
                onClick={() => setResult(null)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다시보기
              </Button>
            </div>
          </div>
          {/* 콘텐츠 추천 섹션 */}
          <RecommendedContent />
        </motion.div>
      </main>
    </div>
    </>
  );
}
