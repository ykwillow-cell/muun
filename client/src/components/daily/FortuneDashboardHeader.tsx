import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ExtendedDailyFortuneResult } from "@/lib/dailyFortuneExtended";

interface FortuneDashboardHeaderProps {
  fortune: ExtendedDailyFortuneResult;
  userName: string;
}

export function FortuneDashboardHeader({ fortune, userName }: FortuneDashboardHeaderProps) {
  // 상태에 따른 색상 및 아이콘
  const statusConfig = {
    "대길": { color: "from-yellow-400 to-orange-400", icon: "🌟", bgColor: "bg-yellow-500/20", textColor: "text-yellow-400" },
    "길": { color: "from-green-400 to-emerald-400", icon: "✨", bgColor: "bg-green-500/20", textColor: "text-green-400" },
    "평범": { color: "from-blue-400 to-cyan-400", icon: "🌤️", bgColor: "bg-blue-500/20", textColor: "text-blue-400" },
    "주의": { color: "from-orange-400 to-red-400", icon: "⚠️", bgColor: "bg-orange-500/20", textColor: "text-orange-400" }
  };

  const config = statusConfig[fortune.status];

  return (
    <section className="w-full space-y-6">
      {/* 한 줄 평 + 상태 배지 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        {/* 사용자명 */}
        <div className="text-sm md:text-base font-medium text-muted-foreground">
          {userName}님의 오늘
        </div>

        {/* 한 줄 평 */}
        <h2 className="text-lg md:text-2xl font-bold text-white leading-relaxed">
          {fortune.oneLiner}
        </h2>

        {/* 상태 인장 배지 */}
        <div className="flex justify-center gap-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bgColor} border border-white/10`}
          >
            <span className="text-xl">{config.icon}</span>
            <span className={`font-bold text-sm md:text-base ${config.textColor}`}>
              {fortune.status}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* 운세 점수 원형 그래프 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex justify-center"
      >
        <div className="relative w-40 h-40 md:w-48 md:h-48">
          {/* 배경 원 */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-white/10"
            />
            {/* 진행 원 */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="6"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * fortune.score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>

          {/* 중앙 점수 텍스트 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-5xl md:text-6xl font-black text-white"
            >
              {fortune.score}
            </motion.span>
            <span className="text-xs md:text-sm text-muted-foreground font-medium">점</span>
          </div>
        </div>
      </motion.div>

      {/* 핵심 키워드 해시태그 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {fortune.keywords.map((keyword, index) => (
          <motion.div
            key={keyword}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary/30 transition-colors"
          >
            <span className="text-xs md:text-sm font-medium text-white/80">
              #{keyword}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* 구분선 */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
