import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Coffee, Star, MapPin, CheckCircle2, AlertCircle, Hash } from "lucide-react";

interface LuckyItemsProps {
  lucky: {
    colors: string[];
    numbers: number[];
    foods: string[];
    directions: string[];
    activities: string[];
    avoid: string[];
  };
}

export default function LuckyItems({ lucky }: LuckyItemsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-white/10">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Palette className="w-8 h-8 text-pink-400" />
            <p className="text-xs text-muted-foreground">행운의 컬러</p>
            <p className="font-bold text-white">{lucky.colors.join(', ')}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-white/10">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Hash className="w-8 h-8 text-yellow-400" />
            <p className="text-xs text-muted-foreground">행운의 숫자</p>
            <p className="font-bold text-white">{lucky.numbers.join(', ')}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-white/10">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Coffee className="w-8 h-8 text-orange-400" />
            <p className="text-xs text-muted-foreground">추천 음식</p>
            <p className="font-bold text-white">{lucky.foods[0]}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-white/10">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <MapPin className="w-8 h-8 text-blue-400" />
            <p className="text-xs text-muted-foreground">행운의 방향</p>
            <p className="font-bold text-white">{lucky.directions[0]}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-white/10 overflow-hidden">
          <CardHeader className="bg-green-500/5 border-b border-white/5 py-3">
            <CardTitle className="text-sm font-bold text-green-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 오늘 하면 좋은 행동
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {lucky.activities.map((act, i) => (
                <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                  <span className="w-1 h-1 bg-green-400 rounded-full" /> {act}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-card border-white/10 overflow-hidden">
          <CardHeader className="bg-red-500/5 border-b border-white/5 py-3">
            <CardTitle className="text-sm font-bold text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> 주의해야 할 행동
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {lucky.avoid.map((act, i) => (
                <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-400 rounded-full" /> {act}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
