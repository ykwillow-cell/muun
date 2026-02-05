import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";

interface SajuChartProps {
  data: { name: string; value: number; fullMark: number }[];
  theme?: 'dark' | 'light';
}

export default function SajuChart({ data, theme = 'dark' }: SajuChartProps) {
  const isDark = theme === 'dark';
  
  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke={isDark ? "#ffffff10" : "#00000010"} />
          <PolarAngleAxis 
            dataKey="name" 
            tick={{ 
              fill: isDark ? '#ffffff60' : '#64748b', 
              fontSize: 14, 
              fontWeight: 'bold' 
            }} 
          />
          <Radar
            name="오행"
            dataKey="value"
            stroke={isDark ? "#FFD700" : "#2563eb"}
            fill={isDark ? "#FFD700" : "#3b82f6"}
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
