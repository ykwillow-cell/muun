import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Activity, ShieldCheck, Heart } from "lucide-react";

interface SajuChartProps {
  data: { name: string; value: number; fullMark: number }[];
  scores: { wealth: number; health: number; love: number; career: number };
}

export default function SajuChart({ data, scores }: SajuChartProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 오행 밸런스 차트 */}
      <Card className="bg-card border-white/10 overflow-hidden">
        <CardHeader className="border-b border-white/5 mb-4">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            오행 에너지 밸런스
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#ffffff10" />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#ffffff60', fontSize: 14, fontWeight: 'bold' }} />
              <Radar
                name="오행"
                dataKey="value"
                stroke="#FFD700"
                fill="#FFD700"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 운세 지수 게이지 */}
      <Card className="bg-card border-white/10 overflow-hidden">
        <CardHeader className="border-b border-white/5 mb-4">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            핵심 운세 지수
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-yellow-500" /> 재물운</span>
              <span className="text-primary font-bold">{Math.round(scores.wealth)}점</span>
            </div>
            <Progress value={scores.wealth} className="h-2 bg-white/5" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70 flex items-center gap-2"><Activity className="w-4 h-4 text-green-500" /> 건강운</span>
              <span className="text-primary font-bold">{Math.round(scores.health)}점</span>
            </div>
            <Progress value={scores.health} className="h-2 bg-white/5" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70 flex items-center gap-2"><Heart className="w-4 h-4 text-red-500" /> 애정운</span>
              <span className="text-primary font-bold">{Math.round(scores.love)}점</span>
            </div>
            <Progress value={scores.love} className="h-2 bg-white/5" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70 flex items-center gap-2"><Target className="w-4 h-4 text-blue-500" /> 직업운</span>
              <span className="text-primary font-bold">{Math.round(scores.career)}점</span>
            </div>
            <Progress value={scores.career} className="h-2 bg-white/5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Target({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
