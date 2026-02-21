import { motion } from "framer-motion";
import { PrescriptionFortune } from "@/lib/prescriptionFortune";

interface PrescriptionHeaderProps {
  fortune: PrescriptionFortune;
  userName: string;
}

export function PrescriptionHeader({ fortune, userName }: PrescriptionHeaderProps) {
  const scorePercentage = (fortune.score / 100) * 360;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative space-y-6 py-8"
    >
      {/* 배경 효과 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 space-y-6">
        {/* 제목 */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">
            {userName}님의 오늘 처방전
          </h2>
          <p className="text-sm text-white/60">
            {new Date().toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </p>
        </div>

        {/* 점수 원형 그래프 + 도장 */}
        <div className="flex justify-center items-center py-8">
          <div className="relative w-64 h-64">
            {/* 배경 원 */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 200 200"
            >
              {/* 배경 트랙 */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
              />
              {/* 진행 트랙 */}
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="8"
                strokeDasharray={`${(scorePercentage / 360) * 565.48} 565.48`}
                initial={{ strokeDasharray: "0 565.48" }}
                animate={{
                  strokeDasharray: `${(scorePercentage / 360) * 565.48} 565.48`,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>

            {/* 중앙 점수 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="text-6xl font-black text-white">
                {fortune.score}
              </div>
              <div className="text-sm text-yellow-300 font-semibold">점</div>
            </motion.div>

            {/* 도장 배지 */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 border-4 border-yellow-200"
            >
              <div className="text-center">
                <div className="text-xs font-bold text-yellow-900">오늘의</div>
                <div className="text-sm font-black text-yellow-900">
                  {fortune.status.split(" ")[0]}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 한 줄 처방 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center space-y-3"
        >
          <p className="text-lg font-semibold text-white leading-relaxed">
            {fortune.oneLiner}
          </p>
        </motion.div>

        {/* 키워드 태그 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex justify-center gap-2 flex-wrap"
        >
          {fortune.keywords.map((keyword, index) => (
            <div
              key={index}
              className="px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 text-sm font-semibold hover:bg-yellow-500/30 transition-colors"
            >
              #{keyword}
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
