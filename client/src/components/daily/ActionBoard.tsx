import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, Utensils } from "lucide-react";
import { ExtendedDailyFortuneResult } from "@/lib/dailyFortuneExtended";

interface ActionBoardProps {
  fortune: ExtendedDailyFortuneResult;
}

export function ActionBoard({ fortune }: ActionBoardProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
      {/* 오늘의 나침반 (Lucky / Warning) */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
            <CardTitle className="text-sm md:text-base flex items-center gap-2 text-primary">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-lg">🧭</span>
              </div>
              오늘의 나침반
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-4">
            {/* Lucky Action */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1">하면 좋은 것</p>
                <p className="text-sm md:text-base text-white/90 leading-relaxed">
                  {fortune.luckyAction}
                </p>
              </div>
            </div>

            {/* 구분선 */}
            <div className="h-px bg-white/5" />

            {/* Warning Action */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1">피해야 할 것</p>
                <p className="text-sm md:text-base text-white/90 leading-relaxed">
                  {fortune.warningAction}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 골든 타임 */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-primary/10 to-orange-500/5 border border-primary/20 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-primary/10 px-4 py-3 md:px-6 md:py-4">
            <CardTitle className="text-sm md:text-base flex items-center gap-2 text-primary">
              <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              골든 타임
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              {/* 시간 표시 */}
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="text-2xl md:text-3xl font-black text-primary">
                    {fortune.goldenTime.startHour.toString().padStart(2, '0')}:00
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">시작</p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="h-1 flex-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full" />
                </div>
                <div className="text-center flex-1">
                  <div className="text-2xl md:text-3xl font-black text-primary">
                    {fortune.goldenTime.endHour.toString().padStart(2, '0')}:00
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">종료</p>
                </div>
              </div>

              {/* 설명 */}
              <p className="text-sm md:text-base text-white/80 text-center pt-2">
                {fortune.goldenTime.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 오늘의 음식 추천 */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
            <CardTitle className="text-sm md:text-base flex items-center gap-2 text-orange-400">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Utensils className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              오늘의 음식
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start gap-4">
              {/* 음식 아이콘 */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-4xl md:text-5xl">🍜</span>
              </div>

              {/* 음식명 및 이유 */}
              <div className="flex-1 min-w-0">
                <h4 className="text-base md:text-lg font-bold text-white mb-2">
                  {fortune.luckyFood}
                </h4>
                <p className="text-sm md:text-base text-white/70 leading-relaxed">
                  {fortune.foodReason}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
}
