import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, CheckSquare2, Square } from "lucide-react";
import { ExtendedDailyFortuneResult } from "@/lib/dailyFortuneExtended";

interface LifeSolutionProps {
  fortune: ExtendedDailyFortuneResult;
}

export function LifeSolution({ fortune }: LifeSolutionProps) {
  const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());

  const toggleMission = (missionId: string) => {
    const newCompleted = new Set(completedMissions);
    if (newCompleted.has(missionId)) {
      newCompleted.delete(missionId);
    } else {
      newCompleted.add(missionId);
    }
    setCompletedMissions(newCompleted);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-4"
    >
      {/* 사회생활 처세술 */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
            <CardTitle className="text-sm md:text-base flex items-center gap-2 text-blue-400">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              사회생활 팁
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <p className="text-sm md:text-base text-white/80 leading-relaxed">
              {fortune.socialTip}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* 액운 방지 미션 */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
            <CardTitle className="text-sm md:text-base flex items-center gap-2 text-purple-400">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <CheckSquare2 className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              오늘의 미션
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-2">
            {fortune.missions.map((mission, index) => {
              const isCompleted = completedMissions.has(mission.id);
              return (
                <motion.button
                  key={mission.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={() => toggleMission(mission.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 p-3 md:p-4 rounded-xl transition-all duration-300 ${
                    isCompleted
                      ? "bg-purple-500/20 border border-purple-500/30"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {/* 체크박스 */}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex-shrink-0"
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center"
                      >
                        <CheckSquare2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </motion.div>
                    ) : (
                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg border-2 border-white/30 flex items-center justify-center">
                        <Square className="w-3 h-3 md:w-4 md:h-4 text-white/30" />
                      </div>
                    )}
                  </motion.div>

                  {/* 미션 텍스트 */}
                  <div className="flex-1 text-left min-w-0">
                    <p className={`text-sm md:text-base font-medium transition-all ${
                      isCompleted ? "text-white line-through opacity-70" : "text-white/80"
                    }`}>
                      {mission.text}
                    </p>
                  </div>

                  {/* 이모지 */}
                  <span className="text-lg md:text-xl flex-shrink-0">
                    {mission.emoji}
                  </span>

                  {/* 완료 표시 */}
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400"
                    >
                      <span className="text-sm font-bold">완료!</span>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}

            {/* 완료 통계 */}
            {completedMissions.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 pt-4 border-t border-white/10 text-center"
              >
                <p className="text-xs md:text-sm text-muted-foreground">
                  <span className="font-bold text-purple-400">{completedMissions.size}/{fortune.missions.length}</span>개 미션 완료!
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
}
