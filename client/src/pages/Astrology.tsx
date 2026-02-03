import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { calculateAstrology, ZODIAC_SIGNS } from '../lib/astrology';
import zodiacData from '../lib/zodiac-data.json';
import { Star, Moon, Sun, Info } from 'lucide-react';

const Astrology: React.FC = () => {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;

    const date = new Date(`${birthDate}T${birthTime || '12:00'}:00`);
    const data = calculateAstrology(date);
    setResult(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          서양 점성술 분석
        </h1>
        <p className="text-gray-400">당신이 태어난 순간, 하늘의 별들이 들려주는 이야기를 확인해보세요.</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">생년월일</label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">태어난 시간 (선택)</label>
              <Input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                별자리 분석하기
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

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
