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
import { Link } from "wouter";
import AstrologyContent from "@/components/AstrologyContent";

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
        <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        
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
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <text 
                x={iconX} 
                y={iconY} 
                fill="rgba(255,255,255,0.5)" 
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
    <div className="relative z-20">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white rounded-lg flex items-center justify-between hover:border-primary/30 transition-colors"
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
          className="absolute top-full left-0 right-0 mt-2 bg-background/95 border border-white/10 rounded-lg shadow-2xl z-[100] backdrop-blur-xl"
        >
          <div className="p-3 border-b border-white/10">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
              <Search className="w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="도시 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-white text-sm outline-none flex-1 placeholder-white/40"
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
                className={`w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-3 ${
                  selectedCity?.name === city.name ? 'bg-primary/20 text-primary' : 'text-white/70'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <div>
                  <div className="font-medium">{city.name}</div>
                  <div className="text-xs text-white/40">{city.en}</div>
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
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: "2000-01-01",
      birthTime: "12:00",
      birthTimeUnknown: false,
      birthCity: "서울",
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset({
        birthDate: parsed.birthDate,
        birthTime: parsed.birthTime,
        birthCity: parsed.birthCity || "서울",
      });
      const city = MAJOR_CITIES.find(c => c.name === (parsed.birthCity || "서울"));
      setSelectedCity(city || MAJOR_CITIES[0]);
    } else {
      setSelectedCity(MAJOR_CITIES[0]);
    }
  }, [form]);

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

  const commonMaxWidth = "max-w-4xl mx-auto";

  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className={`${commonMaxWidth} px-4 h-14 flex items-center`}>
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-white">점성술 분석</h1>
          </div>
        </header>

        <main className="relative z-10 px-4 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-6 md:space-y-8`}
          >
            {/* Hero Section */}
            <div className="text-center space-y-4 py-4 md:py-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-xl">
                <Compass className="w-4 h-4 text-purple-400" />
                <span className="text-[11px] md:text-xs font-bold tracking-widest text-purple-400 uppercase">Birth Chart</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
                당신의 탄생 차트 분석
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
                태어난 순간 하늘의 행성들이 배치된 지도를 통해<br className="hidden md:block" />
                당신의 성격과 운명의 흐름을 분석합니다.
              </p>
            </div>

            <Card className="bg-white/5 border-white/10 shadow-2xl backdrop-blur-xl relative z-10 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-purple-500/50 to-blue-500/50" />
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  탄생 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="text-white/70 text-xs md:text-sm font-medium">생년월일</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...form.register("birthDate")}
                        className="bg-white/5 border-white/10 text-white min-h-[48px] focus:ring-primary/50 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthTime" className="text-white/70 text-xs md:text-sm font-medium">태어난 시간</Label>
                      <div className="space-y-2">
                        <Input
                          id="birthTime"
                          type="time"
                          {...form.register("birthTime")}
                          disabled={form.watch("birthTimeUnknown")}
                          className={`bg-white/5 border-white/10 text-white min-h-[48px] focus:ring-primary/50 rounded-xl ${form.watch("birthTimeUnknown") ? 'opacity-40' : ''}`}
                        />
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            {...form.register("birthTimeUnknown")}
                            className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-primary"
                          />
                          <span className="text-[11px] text-white/60">모름</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 relative z-20">
                    <Label className="text-white/70 text-xs md:text-sm font-medium">태어난 도시</Label>
                    <CitySelector 
                      value={form.watch("birthCity")} 
                      onChange={(city) => form.setValue("birthCity", city)}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full min-h-[48px] md:min-h-[56px] bg-primary hover:bg-primary/90 text-background font-bold text-base md:text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
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
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
      {/* '시간 모름' 시 안내 라벨 */}
      {form.watch("birthTimeUnknown") && (
        <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 relative z-50">
          <p className="text-[10px] md:text-xs text-primary text-center font-medium">
            태어난 시간을 제외한 분석 결과입니다 (일부 해석이 제한될 수 있습니다)
          </p>
        </div>
      )}
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]" onClick={() => setResult(null)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg md:text-xl font-bold text-white">분석 결과</h1>
          </div>
          {result.city && (
            <div className="flex items-center gap-1 text-xs text-white/50">
              <MapPin className="w-3 h-3" />
              {result.city.name}
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 px-4 py-6 md:py-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 왼쪽: 시각적 차트 */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-card/30 border-white/10 backdrop-blur-xl p-6 sticky top-24">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Natal Chart
                </h3>
                <p className="text-xs text-white/40">당신이 태어난 순간의 하늘</p>
                {result.city && (
                  <p className="text-xs text-primary mt-2 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {result.city.name} ({result.city.lat.toFixed(2)}°N, {Math.abs(result.city.lng).toFixed(2)}°{result.city.lng > 0 ? 'E' : 'W'})
                  </p>
                )}
              </div>
              <AstrologyChart planets={result.planets} />
              <div className="mt-8 grid grid-cols-2 gap-2">
                {result.planets.slice(0, 4).map((p: any) => (
                  <div key={p.en} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-lg">{p.icon}</span>
                    <div className="text-[10px]">
                      <div className="text-white/40">{p.name}</div>
                      <div className="text-white font-bold">{p.sign.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 오른쪽: 상세 해석 */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* 핵심 요약 */}
              <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-24 h-24 text-primary" />
                </div>
                <h2 className="text-2xl font-black text-white mb-4">
                  {result.sun.sign.name}의 기운을 타고난 <br/>
                  <span className="text-primary">당신은 어떤 사람일까요?</span>
                </h2>
                <p className="text-white/70 leading-relaxed">
                  점성술에서 '태양'은 당신의 가장 핵심적인 모습과 삶을 대하는 태도를 말해줘요. {result.sun.sign.name}의 에너지를 품은 당신이 가진 특별한 매력을 아래에서 확인해보세요.
                </p>
              </div>

              {/* 행성별 상세 분석 */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 px-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  하늘의 행성들이 보내는 메시지
                </h3>
                
                <div className="grid gap-4">
                  {result.planets.map((p: any, i: number) => (
                    <motion.div
                      key={p.en}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="bg-card/50 border-white/10 hover:border-primary/30 transition-colors overflow-hidden group">
                        <CardHeader className="p-4 bg-white/5 flex flex-row items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-xl border border-white/10 group-hover:scale-110 transition-transform">
                              {p.icon}
                            </div>
                            <div>
                              <CardTitle className="text-sm font-bold text-white">
                                {p.en === 'Sun' ? '나의 본모습' : 
                                 p.en === 'Moon' ? '나의 속마음' : 
                                 p.en === 'Mercury' ? '나의 소통 방식' : 
                                 p.en === 'Venus' ? '나의 사랑과 취향' : 
                                 p.en === 'Mars' ? '나의 열정과 에너지' : 
                                 p.en === 'Jupiter' ? '나의 행운과 성장' : 
                                 p.en === 'Saturn' ? '나의 책임과 교훈' : p.name}
                              </CardTitle>
                              <div className="text-[10px] text-primary font-bold">{p.name}이(가) {p.sign.name}에 머물 때</div>
                            </div>
                          </div>
                          <div className="text-[10px] text-white/30 font-mono">
                            {p.longitude.toFixed(2)}°
                          </div>
                        </CardHeader>
                        <CardContent className="p-5">
                          <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                            {(zodiacData as any)[p.sign.en] || "상세 분석 데이터를 준비 중입니다."}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 안내 문구 */}
              <Card className="bg-blue-500/5 border-blue-500/20">
                <CardContent className="p-4 flex items-start gap-3">
                  <Info className="text-blue-400 mt-1 flex-shrink-0" size={18} />
                  <p className="text-xs text-blue-400/80 leading-relaxed">
                    이 분석은 당신이 태어난 순간, 하늘의 행성들이 어디에 있었는지를 계산한 결과예요. 
                    태양은 당신의 겉모습을, 달은 숨겨진 감정을, 금성은 사랑의 방식을 알려준답니다. 
                    나를 더 깊이 이해하는 재미있는 가이드로 활용해보세요!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Astrology;
