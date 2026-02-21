import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PrescriptionFortune } from "@/lib/prescriptionFortune";
import { Lightbulb, CheckCircle2 } from "lucide-react";

interface PrescriptionMissionsProps {
  fortune: PrescriptionFortune;
}

export function PrescriptionMissions({ fortune }: PrescriptionMissionsProps) {
  const [completedMissions, setCompletedMissions] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const toggleMission = (index: number) => {
    const newCompleted = [...completedMissions];
    newCompleted[index] = !newCompleted[index];
    setCompletedMissions(newCompleted);
  };

  const completedCount = completedMissions.filter(Boolean).length;

  // 파티클 애니메이션을 위한 컴포넌트
  const Particle = ({ index }: { index: number }) => {
    const angle = (index / 10) * Math.PI * 2;
    const distance = 100;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return (
      <motion.div
        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        animate={{ x, y, opacity: 0, scale: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="space-y-6"
    >
      {/* 제목 */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white">오늘 하루 실천 미션</h3>
        <p className="text-xs text-white/50 mt-1">
          나쁜 기운은 막고, 좋은 기운은 불러오기!
        </p>
      </div>

      {/* 처세술 팁 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/30"
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <div className="text-sm font-semibold text-blue-300">
              사회생활 처세술
            </div>
            <p className="text-sm text-white leading-relaxed">
              {fortune.socialTip}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 미션 체크리스트 */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-white/70">
          액운 방지 미션 ({completedCount}/3)
        </div>

        {fortune.missions.map((mission, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
            className="relative"
          >
            <button
              onClick={() => toggleMission(index)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                completedMissions[index]
                  ? "bg-green-500/20 border-green-500/50"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  initial={false}
                  animate={{
                    scale: completedMissions[index] ? 1.2 : 1,
                  }}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    completedMissions[index]
                      ? "bg-green-500 border-green-400"
                      : "border-white/30"
                  }`}
                >
                  {completedMissions[index] && (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  )}
                </motion.div>
                <span
                  className={`text-sm font-medium ${
                    completedMissions[index]
                      ? "text-green-300 line-through"
                      : "text-white"
                  }`}
                >
                  {mission}
                </span>
              </div>
            </button>

            {/* 파티클 효과 */}
            <AnimatePresence>
              {completedMissions[index] && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Particle key={i} index={i} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 완료 메시지 */}
      <AnimatePresence>
        {completedCount === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 text-center"
          >
            <div className="text-lg font-bold text-yellow-300">
              🎉 모든 미션 완료! 참 잘했어요!
            </div>
            <p className="text-sm text-yellow-200 mt-2">
              오늘 하루 운이 최고조에 달했어요!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
