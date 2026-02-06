import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Sparkles, Star, Coffee, MapPin, Palette, Zap, User, Sun, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getDailyFortune, DailyFortuneResult } from "@/lib/dailyFortune";
import { shareContent } from "@/lib/share";
import DailyFortuneContent from "@/components/DailyFortuneContent";

const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
});

type FormValues = z.infer<typeof formSchema>;

export default function DailyFortune() {
  const [fortune, setFortune] = useState<DailyFortuneResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userName, setUserName] = useState("");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "2000-01-01",
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
      });
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    // 기존 데이터와 병합하여 저장
    const existingData = localStorage.getItem("muun_user_data");
    const existing = existingData ? JSON.parse(existingData) : {};
    const mergedData = { ...existing, ...data };
    localStorage.setItem("muun_user_data", JSON.stringify(mergedData));
    
    setUserName(data.name);
    const result = getDailyFortune(new Date(data.birthDate), data.gender);
    setFortune(result);
    setShowResult(true);
    window.scrollTo(0, 0);
  };

  const commonMaxWidth = "w-full max-w-4xl mx-auto";

  // 입력 화면
  if (!showResult) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-white">오늘의 운세</h1>
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-8`}
          >
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-xl">
                <Sun className="w-4 h-4 text-green-400" />
                <span className="text-[11px] md:text-xs font-bold tracking-widest text-green-400 uppercase">오늘 하루의 기운</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">무료 오늘의 운세</h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
                오늘 하루의 기운을 미리 확인하고<br className="md:hidden" /> 행운을 잡아보세요
              </p>
            </div>

            {/* Input Form Card */}
            <Card className="glass-panel border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b border-white/5 p-6 md:p-10">
                <CardTitle className="text-white flex items-center gap-3 text-xl md:text-2xl">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                  </div>
                  운세 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-10">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Name & Gender Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                        <User className="w-4 h-4 text-green-400" />
                        이름
                      </Label>
                      <Input
                        id="name"
                        placeholder="이름을 입력해주세요"
                        {...form.register("name")}
                        className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-2xl focus:ring-green-500/50 focus:border-green-500 transition-all text-base"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-white text-base font-medium ml-1 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-green-400" />
                        성별
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("gender")}
                        onValueChange={(value) => {
                          if (value) form.setValue("gender", value as "male" | "female");
                        }}
                        className="w-full h-14 bg-white/5 p-1.5 rounded-2xl border border-white/10"
                      >
                        <ToggleGroupItem
                          value="male"
                          className="flex-1 h-full rounded-xl data-[state=on]:bg-green-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="flex-1 h-full rounded-xl data-[state=on]:bg-green-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className="space-y-3">
                    <Label htmlFor="birthDate" className="text-white text-base font-medium ml-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-400" />
                      생년월일
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      {...form.register("birthDate")}
                      className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-green-500/50 focus:border-green-500 transition-all text-base"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    오늘의 운세 확인하기
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-4 md:p-5 text-center space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-white">오늘의 총운</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-4 md:p-5 text-center space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mx-auto">
                    <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-white">행운 점수</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-4 md:p-5 text-center space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mx-auto">
                    <Palette className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-white">행운의 컬러</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-4 md:p-5 text-center space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-white">행운의 방향</p>
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

  // 결과 화면
  if (!fortune) return null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className={`container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between`}>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
              onClick={() => setShowResult(false)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg md:text-xl font-bold text-white">오늘의 운세 결과</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-green-400 min-w-[44px] min-h-[44px]"
            onClick={() => {
              shareContent({
                title: '무운 오늘의 운세',
                text: `오늘 내 운세 점수는 ${fortune.score}점! 당신의 운세도 확인해보세요.`,
              });
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 px-4 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${commonMaxWidth} space-y-6 md:space-y-8`}
        >
          {/* Hero Section */}
          <section className="text-center space-y-4 py-4 md:py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 backdrop-blur-xl">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-[11px] md:text-xs font-bold tracking-widest text-green-400 uppercase">오늘의 기운</span>
            </div>
            
            {/* Score Circle */}
            <div className="relative inline-block">
              <svg className="w-40 h-40 md:w-48 md:h-48">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-white/5"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * fortune.score) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-green-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-black text-white">{fortune.score}</span>
                <span className="text-xs md:text-sm text-green-400 font-bold">LUCKY SCORE</span>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">{fortune.summary}</h2>
          </section>

          {/* Detail Card */}
          <Card className="bg-white/5 border-white/10 overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-white/5 p-4 md:p-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2 text-green-400">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                오늘의 총평
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-sm md:text-base text-white/90 leading-relaxed">
                {fortune.detail}
              </p>
            </CardContent>
          </Card>

          {/* Lucky Items Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <Card className="bg-white/5 border-white/10 rounded-2xl">
              <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                  <Palette className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground">행운의 컬러</p>
                  <p className="font-bold text-white text-sm md:text-base truncate">{fortune.luckyColor}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 rounded-2xl">
              <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground">추천 음식</p>
                  <p className="font-bold text-white text-sm md:text-base truncate">{fortune.luckyFood}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 rounded-2xl">
              <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground">행운의 아이템</p>
                  <p className="font-bold text-white text-sm md:text-base truncate">{fortune.luckyItem}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 rounded-2xl">
              <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground">행운의 방향</p>
                  <p className="font-bold text-white text-sm md:text-base truncate">{fortune.direction}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button 
              className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 min-h-[48px] md:min-h-[56px] rounded-xl font-medium"
              onClick={() => {
                shareContent({
                  title: '무운 오늘의 운세',
                  text: `오늘 내 운세 점수는 ${fortune.score}점! 당신의 운세도 확인해보세요.`,
                });
              }}
            >
              친구에게 공유하기
            </Button>
            <Button 
              variant="ghost"
              className="w-full text-white/60 hover:text-white hover:bg-white/5 min-h-[48px] rounded-xl font-medium"
              onClick={() => setShowResult(false)}
            >
              다시 보기
            </Button>
          </div>
        </motion.div>

        {/* SEO 콘텐츠 */}
        <div className={commonMaxWidth}>
          <DailyFortuneContent />
        </div>
      </main>
    </div>
  );
}
