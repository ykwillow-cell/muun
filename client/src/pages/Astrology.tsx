import React, { useState, useEffect } from 'react';
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from "../components/ui/label";
import { calculateAstrology, ZODIAC_SIGNS, PLANETS } from '../lib/astrology';
import { MAJOR_CITIES, City } from '../lib/cities';
import zodiacData from '../lib/zodiac-data.json';
import { Star, Moon, Sun, Info, ChevronLeft, Sparkles, User, Compass, Zap, Shield, Globe, MapPin, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from "wouter";
import AstrologyContent from "@/components/AstrologyContent";
import RecommendedContent from "@/components/RecommendedContent";
import { getHeroBirthForForm, isHeroBirthFresh } from "@/lib/user-birth";

const formSchema = z.object({
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime: z.string(),
  birthTimeUnknown: z.boolean().default(false),
  birthCity: z.string().min(1, "태어난 도시를 선택해주세요"),
});

type FormValues = z.infer<typeof formSchema>;

// 점성술 차트 컴포넌트
const AstrologyChart = ({ planets }: { planets: any[] }) => {
  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto">
      {/* 배경 원 (황도 12궁) */}
      <svg viewBox="0 0 400 400" className="w-full h-full transform -rotate-90">
        {/* 바깥 원 */}
        <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
        
        {/* 12궁 구분선 및 아이콘 */}
        {ZODIAC_SIGNS.map((sign, i) => {
          const angle = i * 30;
          const x1 = 200 + 140 * Math.cos((angle * Math.PI) / 180);
          const y1 = 200 + 140 * Math.sin((angle * Math.PI) / 180);
          const x2 = 200 + 180 * Math.cos((angle * Math.PI) / 180);
          const y2 = 200 + 180 * Math.sin((angle * Math.PI) / 180);
          
          // 아이콘 위치
          const iconAngle = angle + 15;
          const iconX = 200 + 160 * Math.cos((iconAngle * Math.PI) / 180);
          const iconY = 200 + 160 * Math.sin((iconAngle * Math.PI) / 180);
          
          return (
            <g key={sign.en}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,0,0,0.10)" strokeWidth="1" />
              <text 
                x={iconX} 
                y={iconY} 
                fill="rgba(0,0,0,0.25)" 
                fontSize="12" 
                textAnchor="middle" 
                alignmentBaseline="middle"
                transform={`rotate(90, ${iconX}, ${iconY})`}
              >
                {sign.icon}
              </text>
            </g>
          );
        })}

        {/* 행성 위치 표시 */}
        {planets.map((p) => {
          const angle = p.longitude;
          const r = p.en === 'Sun' ? 120 : p.en === 'Moon' ? 100 : 80;
          const x = 200 + r * Math.cos((angle * Math.PI) / 180);
          const y = 200 + r * Math.sin((angle * Math.PI) / 180);
          
          return (
            <motion.g 
              key={p.en}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + planets.indexOf(p) * 0.1 }}
            >
              <circle cx={x} cy={y} r="4" fill={p.en === 'Sun' ? '#fbbf24' : p.en === 'Moon' ? '#60a5fa' : '#a78bfa'} />
              <text 
                x={x} 
                y={y - 10} 
                fill="white" 
                fontSize="10" 
                textAnchor="middle"
                transform={`rotate(90, ${x}, ${y - 10})`}
              >
                {p.icon}
              </text>
            </motion.g>
          );
        })}
      </svg>
      
      {/* 중앙 로고 효과 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Sparkles className="w-6 h-6 text-primary opacity-50" />
      </div>
    </div>
  );
};

// 도시 선택 드롭다운 컴포넌트
const CitySelector = ({ value, onChange }: { value: string; onChange: (city: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const selectedCity = MAJOR_CITIES.find(c => c.name === value);
  const filteredCities = MAJOR_CITIES.filter(c => 
    c.name.includes(searchTerm) || c.en.toUpperCase().includes(searchTerm.toUpperCase())
  );

	  return (
	    <div className="relative z-[50]">
	      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-4 bg-black/[0.05] border border-black/10 text-[#1a1a18] rounded-lg flex items-center justify-between hover:border-primary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{selectedCity?.name || "도시 선택"}</span>
        </div>
        <ChevronLeft className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : '-rotate-90'}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
	          exit={{ opacity: 0, y: -10 }}
	          className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/10 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[100] backdrop-blur-xl"
	        >
          <div className="p-3 border-b border-black/10">
            <div className="flex items-center gap-2 bg-black/[0.05] px-3 py-2 rounded-lg">
              <Search className="w-4 h-4 text-[#999891]" />
              <input
                type="text"
                placeholder="도시 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-[#1a1a18] text-sm outline-none flex-1 placeholder-white/40"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredCities.map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => {
                  onChange(city.name);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-black/[0.05] transition-colors flex items-center gap-3 ${
                  selectedCity?.name === city.name ? 'bg-primary/20 text-primary' : 'text-[#5a5a56]'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <div>
                  <div className="font-medium">{city.name}</div>
                  <div className="text-xs text-[#999891]">{city.en}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const Astrology: React.FC = () => {
  useCanonical("/astrology");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: "2000-01-01",
      birthTime: "12:00",
      birthTimeUnknown: false,
      birthCity: "서울",
    },
  });

  // 생년월일 변경 시 기존 결과 초기화
  const watchedBirthDate = form.watch("birthDate");
  const watchedBirthTime = form.watch("birthTime");
  useEffect(() => {
    if (!initialLoadDone) return;
    setResult(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedBirthDate, watchedBirthTime]);

  useEffect(() => {
    const heroBirth = getHeroBirthForForm();
    // muun_user_birth가 최근(5분 이내) 저장된 경우 메인화면 입력값 우선 적용
    if (heroBirth && isHeroBirthFresh()) {
      form.setValue("birthDate", heroBirth.birthDate);
      form.setValue("birthTime", heroBirth.birthTime);
      setSelectedCity(MAJOR_CITIES[0]);
      setTimeout(() => setInitialLoadDone(true), 100);
      return;
    }
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.reset({
          birthDate: parsed.birthDate,
          birthTime: parsed.birthTime,
          birthCity: parsed.birthCity || "서울",
        });
        const city = MAJOR_CITIES.find(c => c.name === (parsed.birthCity || "서울"));
        setSelectedCity(city || MAJOR_CITIES[0]);
        setTimeout(() => setInitialLoadDone(true), 100);
        return;
      } catch {}
    }
    if (heroBirth) {
      form.setValue("birthDate", heroBirth.birthDate);
      form.setValue("birthTime", heroBirth.birthTime);
    }
    setSelectedCity(MAJOR_CITIES[0]);
    setTimeout(() => setInitialLoadDone(true), 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const city = MAJOR_CITIES.find(c => c.name === data.birthCity);
    if (!city) return;

    const time = data.birthTimeUnknown ? "12:00" : data.birthTime;
    const date = new Date(`${data.birthDate}T${time}`);
    const astrologyResult = calculateAstrology(date, city.lat, city.lng);
    
    setResult({
      ...astrologyResult,
      city: city
    });
    setLoading(false);
    window.scrollTo(0, 0);
  };

  const commonMaxWidth = "w-full";

  if (!result) {
    return (
      <div className="mu-subpage-screen min-h-screen bg-background text-foreground pb-20 relative antialiased">
        <Helmet>
          <title>네이탈차트 무료 | 내 태양·달·상승궁 별자리 분석 - 무운</title>
          <meta name="description" content="생년월일·출생지 입력만으로 즉시 확인하는 무료 네이탈차트. 태양·달·수성·금성·화성 등 행성 별자리 위치를 한국어로 풀이해 드립니다. 회원가입 불필요." />
          <meta name="keywords" content="네이탈차트, 네이탈 차트, 무료 네이탈차트, 출생차트, 탄생차트, 별자리 분석, 태양별자리, 달별자리, 상승궁, 어센던트, 점성술, 무료점성술, natal chart, birth chart, 행성배치" />
          <meta property="og:title" content="네이탈차트 무료 | 내 태양·달·상승궁 별자리 분석 - 무운" />
          <meta property="og:description" content="생년월일·출생지 입력만으로 즉시 확인하는 무료 네이탈차트. 태양·달·수성·금성·화성 등 행성 별자리 위치를 한국어로 풀이해 드립니다. 회원가입 불필요." />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="무운 (MuUn)" />
          <meta property="og:locale" content="ko_KR" />
          <meta property="og:url" content="https://muunsaju.com/astrology" />
          <meta property="og:image" content="https://muunsaju.com/favicon-512x512.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="네이탈차트 무료 | 내 태양·달·상승궁 별자리 분석 - 무운" />
          <meta name="twitter:description" content="생년월일·출생지 입력만으로 즉시 확인하는 무료 네이탈차트. 회원가입 불필요." />
          <meta name="twitter:image" content="https://muunsaju.com/favicon-512x512.png" />
          <link rel="canonical" href="https://muunsaju.com/astrology" />
          <script type="application/ld+json">{`{
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "네이탈차트 무료 분석 - 무운",
            "description": "생년월일과 출생지를 입력하면 태양·달·수성·금성·화성 등 행성의 별자리 위치를 계산해 한국어로 풀이해주는 무료 네이탈차트 서비스. 회원가입 불필요.",
            "url": "https://muunsaju.com/astrology",
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "KRW"
            },
            "publisher": {
              "@type": "Organization",
              "name": "무운 (MuUn)",
              "url": "https://muunsaju.com"
            }
          }`}</script>
        </Helmet>
        <header className="mu-subpage-header sticky top-[82px] z-50 bg-white border-b border-black/[0.06]">
          <div className={`${commonMaxWidth} px-4 h-14 flex items-center`}>
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-[#1a1a18] hover:bg-black/[0.06] min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-[#1a1a18]">점성술 분석</h1>
          </div>
        </header>

        <main className="mu-service-main px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-6 md:space-y-8`}
          >
            {/* Hero Section */}
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-purple-500/20 text-purple-600 text-xs font-medium">
                <Compass className="w-3 h-3" />
                <span>Birth Chart</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#1a1a18]">
                당신의 탄생 차트 분석
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                태어난 순간 하늘의 행성들이 배치된 지도를 통해<br className="hidden md:block" />
                당신의 성격과 운명의 흐름을 분석합니다.
              </p>
            </div>

            <Card className="bg-white border border-black/[0.06] shadow-sm relative z-10 rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-black/[0.06] px-4 py-3 md:px-6">
                <CardTitle className="text-[#1a1a18] flex items-center gap-2 text-base">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  탄생 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate" className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-primary" />
                        생년월일
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...form.register("birthDate")}
                        className="h-11 bg-[#F7F5F3] border-[#E8E5E0] text-[#1a1a18] focus:ring-primary/50 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="birthTime" className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 text-primary" />
                        태어난 시간
                      </Label>
                      <div className="space-y-2">
                        <Input
                          id="birthTime"
                          type="time"
                          {...form.register("birthTime")}
                          disabled={form.watch("birthTimeUnknown")}
                          className={`h-11 bg-[#F7F5F3] border-[#E8E5E0] text-[#1a1a18] focus:ring-primary/50 rounded-xl ${form.watch("birthTimeUnknown") ? 'opacity-40' : ''}`}
                        />
                        <label className="flex items-center gap-2 cursor-pointer group px-1">
                          <input
                            type="checkbox"
                            {...form.register("birthTimeUnknown")}
                            className="w-4 h-4 rounded border-[#E8E5E0] bg-[#F7F5F3] accent-primary"
                          />
                          <span className="text-sm text-[#1a1a18] group-hover:text-primary transition-colors">시간 모름</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 relative z-20">
                    <Label className="text-[#1a1a18] text-sm font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      태어난 도시
                    </Label>
                    <CitySelector 
                      value={form.watch("birthCity")} 
                      onChange={(city) => form.setValue("birthCity", city)}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#4338CA] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#6366F1]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                        천체 위치 계산 중...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        운명의 지도 그리기
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* SEO 콘텐츠 */}
            <AstrologyContent />
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="mu-subpage-screen min-h-screen bg-[#F5F4F8] text-foreground pb-20 antialiased">
      <Helmet>
        <title>{result.sun.sign.name} 태양 별자리 - 나의 네이탈 차트 점성술 분석 결과 | 무운 (MuUn)</title>
        <meta name="description" content={`태양 ${result.sun.sign.name}, 달 ${result.moon?.sign?.name || ''} 별자리의 네이탈 차트 분석 결과입니다. 태양·달·수성·금성·화성 등 7개 행성의 별자리 위치를 분석해 성격과 운명을 확인해보세요.`} />
        <meta property="og:title" content={`${result.sun.sign.name} 태양 별자리 - 나의 네이탈 차트 점성술 분석 결과 | 무운`} />
        <meta property="og:description" content={`태양 ${result.sun.sign.name} 별자리의 네이탈 차트 분석 결과입니다. 태양·달·행성들의 배치를 통해 당신의 본질과 운명을 확인해보세요.`} />
        <meta property="og:image" content="https://muunsaju.com/favicon-512x512.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:url" content="https://muunsaju.com/astrology" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${result.sun.sign.name} 태양 별자리 네이탈 차트 | 무운`} />
        <meta name="twitter:description" content={`태양 ${result.sun.sign.name} 별자리의 점성술 분석 결과입니다.`} />
        <meta name="twitter:image" content="https://muunsaju.com/favicon-512x512.png" />
        <link rel="canonical" href="https://muunsaju.com/astrology" />
      </Helmet>
      {/* '시간 모름' 시 안내 라벨 */}
      {form.watch("birthTimeUnknown") && (
        <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 relative z-50">
          <p className="text-[10px] md:text-xs text-primary text-center font-medium">
            태어난 시간을 제외한 분석 결과입니다 (일부 해석이 제한될 수 있습니다)
          </p>
        </div>
      )}
      <header className="mu-subpage-header sticky top-[82px] z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 text-[#1a1a18] hover:bg-black/[0.06] min-w-[44px] min-h-[44px]" onClick={() => setResult(null)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-bold text-[#1a1a18]">분석 결과</h1>
          </div>
          {result.city && (
            <div className="flex items-center gap-1 text-xs text-[#999891]">
              <MapPin className="w-3 h-3" />
              {result.city.name}
            </div>
          )}
        </div>
      </header>

      <main className="mu-service-main relative z-10 px-3 py-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* 핵심 요약 배너 */}
          <div className="bg-gradient-to-br from-primary/15 to-purple-500/15 border border-primary/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-10">
              <Sparkles className="w-16 h-16 text-primary" />
            </div>
            <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">나의 태양 별자리</p>
            <h2 className="text-xl font-black text-[#1a1a18] leading-snug mb-2">
              {result.sun.sign.name}의 기운을 타고난<br/>
              <span className="text-primary">당신은 어떤 사람일까요?</span>
            </h2>
            <p className="text-sm text-[#5a5a56] leading-relaxed">
              점성술에서 '태양'은 당신의 가장 핵심적인 모습과 삶을 대하는 태도를 말해줘요. {result.sun.sign.name}의 에너지를 품은 당신이 가진 특별한 매력을 아래에서 확인해보세요.
            </p>
          </div>

          {/* 네이탈 차트 + 행성 요약 */}
          <Card className="bg-white/80 border-black/10 backdrop-blur-xl overflow-hidden">
            <div className="p-4 pb-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#1a1a18] flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-primary" />
                  Natal Chart
                </h3>
                {result.city && (
                  <p className="text-[10px] text-primary flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {result.city.name}
                  </p>
                )}
              </div>
            </div>
            {/* 차트 - 모바일에서 작게 */}
            <div className="px-4">
              <div className="max-w-[220px] mx-auto">
                <AstrologyChart planets={result.planets} />
              </div>
            </div>
            {/* 행성 요약 그리드 - 2열 */}
            <div className="p-4 pt-3 grid grid-cols-2 gap-2">
              {result.planets.slice(0, 4).map((p: any) => (
                <div key={p.en} className="flex items-center gap-2 bg-black/[0.04] p-2.5 rounded-xl border border-black/[0.06]">
                  <span className="text-xl flex-shrink-0">{p.icon}</span>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#999891] truncate">{p.name}</div>
                    <div className="text-xs text-[#1a1a18] font-bold truncate">{p.sign.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 행성별 상세 분석 */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-[#1a1a18] flex items-center gap-2 px-1">
              <Zap className="w-4 h-4 text-yellow-600" />
              하늘의 행성들이 보내는 메시지
            </h3>

            <div className="space-y-3">
              {result.planets.map((p: any, i: number) => (
                <motion.div
                  key={p.en}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Card className="bg-white/80 border-black/10 overflow-hidden">
                    {/* 카드 헤더 */}
                    <div className="px-4 py-3 bg-black/[0.04] flex items-center justify-between border-b border-black/[0.06]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-lg border border-black/10 flex-shrink-0">
                          {p.icon}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#1a1a18] leading-tight">
                            {p.en === 'Sun' ? '나의 본모습' :
                             p.en === 'Moon' ? '나의 속마음' :
                             p.en === 'Mercury' ? '나의 소통 방식' :
                             p.en === 'Venus' ? '나의 사랑과 취향' :
                             p.en === 'Mars' ? '나의 열정과 에너지' :
                             p.en === 'Jupiter' ? '나의 행운과 성장' :
                             p.en === 'Saturn' ? '나의 책임과 교훈' : p.name}
                          </div>
                          <div className="text-[10px] text-primary font-semibold mt-0.5">
                            {p.name} · {p.sign.name} {p.longitude.toFixed(1)}°
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 카드 본문 - 마크다운 렌더링 */}
                    <div className="px-4 py-4">
                      <div className="prose prose-sm max-w-none text-[#5a5a56] leading-relaxed
                        [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-[#1a1a18] [&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:first:mt-0
                        [&_strong]:text-[#1a1a18] [&_strong]:font-semibold
                        [&_p]:text-sm [&_p]:mb-2 [&_p]:last:mb-0
                        [&_ul]:pl-4 [&_ul]:space-y-1 [&_li]:text-sm">
                        <ReactMarkdown>
                          {(zodiacData as any)[p.sign.en] || "상세 분석 데이터를 준비 중입니다."}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 안내 문구 */}
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-4 flex items-start gap-3">
              <Info className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
              <p className="text-xs text-blue-600/80 leading-relaxed">
                이 분석은 당신이 태어난 순간, 하늘의 행성들이 어디에 있었는지를 계산한 결과예요.
                태양은 당신의 겉모습을, 달은 숨겨진 감정을, 금성은 사랑의 방식을 알려준답니다.
                나를 더 깊이 이해하는 재미있는 가이드로 활용해보세요!
              </p>
            </CardContent>
          </Card>

          {/* 콘텐츠 추천 섹션 */}
          <RecommendedContent />
        </motion.div>
      </main>
    </div>
  );
};

export default Astrology;
