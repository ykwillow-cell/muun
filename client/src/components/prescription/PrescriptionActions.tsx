import { motion } from "framer-motion";
import { PrescriptionFortune } from "@/lib/prescriptionFortune";
import { CheckCircle2, AlertCircle, Clock, Utensils } from "lucide-react";

interface PrescriptionActionsProps {
  fortune: PrescriptionFortune;
}

export function PrescriptionActions({ fortune }: PrescriptionActionsProps) {
  const goldenHour = `${fortune.goldenTimeStart.toString().padStart(2, "0")}:00`;
  const goldenHourEnd = `${fortune.goldenTimeEnd.toString().padStart(2, "0")}:00`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="space-y-4"
    >
      {/* 제목 */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white">오늘 꼭 해야 할 일</h3>
        <p className="text-xs text-white/50 mt-1">무엇을 하고, 무엇을 조심할지 명확하게!</p>
      </div>

      {/* 하면 좋은 행동 & 조심할 행동 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 하면 좋은 행동 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="p-4 rounded-xl border-2 border-green-500/50 bg-green-500/10 hover:bg-green-500/20 transition-colors"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            <div className="space-y-2 flex-1">
              <div className="text-xs font-semibold text-green-300 uppercase">
                하면 좋은 행동
              </div>
              <p className="text-sm text-white leading-relaxed">
                {fortune.luckyAction}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 조심할 행동 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="p-4 rounded-xl border-2 border-red-500/50 bg-red-500/10 hover:bg-red-500/20 transition-colors"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div className="space-y-2 flex-1">
              <div className="text-xs font-semibold text-red-300 uppercase">
                조심할 행동
              </div>
              <p className="text-sm text-white leading-relaxed">
                {fortune.warningAction}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 골든 타임 바 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="space-y-3 pt-4"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-semibold text-white">가장 운 좋은 시간</span>
        </div>
        <div className="relative h-12 bg-white/5 rounded-lg overflow-hidden border border-white/10">
          {/* 타임라인 바 */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 border-r border-white/5 ${
                  i >= fortune.goldenTimeStart && i < fortune.goldenTimeEnd
                    ? "bg-gradient-to-r from-yellow-500/50 to-orange-500/50 shadow-lg shadow-yellow-500/50"
                    : ""
                }`}
              />
            ))}
          </div>

          {/* 시간 라벨 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-black text-yellow-300">
                {goldenHour} ~ {goldenHourEnd}
              </div>
              <div className="text-xs text-yellow-200">가장 운이 좋은 시간</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 오늘의 메뉴 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-400/30"
      >
        <div className="flex items-start gap-3">
          <Utensils className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
          <div className="space-y-2 flex-1">
            <div className="text-sm font-semibold text-orange-300">
              오늘의 추천 메뉴
            </div>
            <div className="text-lg font-bold text-white">
              {fortune.recommendedFood}
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {fortune.foodReason}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
