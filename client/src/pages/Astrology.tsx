import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from "../components/ui/label";
import { calculateAstrology, ZODIAC_SIGNS } from '../lib/astrology';
import zodiacData from '../lib/zodiac-data.json';
import { Star, Moon, Sun, Info, ChevronLeft, Sparkles, User } from 'lucide-react';
import { Link } from "wouter";

const formSchema = z.object({
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  birthTime: z.string().min(1, "태어난 시간을 입력해주세요"),
});

type FormValues = z.infer<typeof formSchema>;

const Astrology: React.FC = () => {
  const [result, setResult] = useState<any>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: "2000-01-01",
      birthTime: "12:00",
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset({
        birthDate: parsed.birthDate,
        birthTime: parsed.birthTime,
      });
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    const date = new Date(`${data.birthDate}T${data.birthTime}`);
    const astrologyResult = calculateAstrology(date);
    setResult(astrologyResult);
    window.scrollTo(0, 0);
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20">
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto px-4 h-14 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">점성술 분석</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                서양 점성술 분석
              </h2>
              <p className="text-gray-400">당신이 태어난 순간, 하늘의 별들이 들려주는 이야기를 확인해보세요.</p>
            </div>

            <Card className="bg-card border-white/10 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  점성술 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="text-white block text-base font-semibold">생년월일</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...form.register("birthDate")}
                        className="bg-white/5 border-white/10 text-white w-full appearance-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthTime" className="text-white block text-base font-semibold">태어난 시간</Label>
                      <Input
                        id="birthTime"
                        type="time"
                        {...form.register("birthTime")}
                        className="bg-white/5 border-white/10 text-white w-full appearance-none"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold">
                    <Sparkles className="w-4 h-4 mr-2" />
                    별자리 분석하기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10" onClick={() => setResult(null)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-white">점성술 분석 결과</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">당신의 탄생 별자리 차트</h2>
          <p className="text-purple-400/80">하늘의 행성들이 당신에게 주는 특별한 메시지입니다.</p>
        </div>

      {result && (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sun Sign Card */}
            <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
              <CardHeader className="border-b border-slate-800/50 pb-4">
                <div className="flex items-center gap-2 text-yellow-500">
                  <Sun size={20} />
                  <h3 className="font-bold">태양 별자리 (Sun Sign)</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{result.sun.sign.icon}</span>
                  <div>
                    <div className="text-2xl font-bold text-white">{result.sun.sign.name}</div>
                    <div className="text-sm text-gray-500">{result.sun.sign.en}</div>
                  </div>
                </div>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {(zodiacData as any)[result.sun.sign.en]}
                </div>
              </CardContent>
            </Card>

            {/* Moon Sign Card */}
            <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
              <CardHeader className="border-b border-slate-800/50 pb-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Moon size={20} />
                  <h3 className="font-bold">달 별자리 (Moon Sign)</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{result.moon.sign.icon}</span>
                  <div>
                    <div className="text-2xl font-bold text-white">{result.moon.sign.name}</div>
                    <div className="text-sm text-gray-500">{result.moon.sign.en}</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4 italic">
                  * 달 별자리는 당신의 내면 세계와 감정적인 본능을 상징합니다.
                </p>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {(zodiacData as any)[result.moon.sign.en]}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6 flex items-start gap-3">
              <Info className="text-purple-400 mt-1 flex-shrink-0" size={18} />
              <p className="text-sm text-gray-400">
                본 분석 결과는 현대 점성술 이론을 바탕으로 생성되었습니다. 
                태어난 시간을 정확히 입력할수록 더욱 정밀한 달 별자리와 하우스 분석이 가능합니다.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Astrology;
