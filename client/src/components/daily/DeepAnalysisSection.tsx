import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Heart, Briefcase, Activity } from "lucide-react";
import { ExtendedDailyFortuneResult } from "@/lib/dailyFortuneExtended";

interface DeepAnalysisSectionProps {
  fortune: ExtendedDailyFortuneResult;
}

export function DeepAnalysisSection({ fortune }: DeepAnalysisSectionProps) {
  const [activeTab, setActiveTab] = useState("wealth");

  const categories = [
    {
      id: "wealth",
      label: "재물운",
      icon: Wallet,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      content: fortune.deepAnalysis.wealth
    },
    {
      id: "love",
      label: "애정운",
      icon: Heart,
      color: "text-pink-400",
      bgColor: "bg-pink-500/20",
      content: fortune.deepAnalysis.love
    },
    {
      id: "career",
      label: "직장운",
      icon: Briefcase,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      content: fortune.deepAnalysis.career
    },
    {
      id: "health",
      label: "건강운",
      icon: Activity,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      content: fortune.deepAnalysis.health
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4
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
      className="w-full"
    >
      <motion.div variants={itemVariants}>
        <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
            <CardTitle className="text-sm md:text-base flex items-center gap-2 text-primary">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-lg">📖</span>
              </div>
              명리학 심층 분석
            </CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground font-medium mt-2">
              4대 카테고리별 상세 분석으로 오늘 하루를 더 깊이 이해해보세요.
            </p>
          </CardHeader>

          <CardContent className="p-4 md:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* 탭 버튼 */}
              <TabsList className="grid w-full grid-cols-4 gap-1 bg-white/5 border border-white/10 rounded-xl p-1 mb-6">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 hover:text-white/70 text-[10px] md:text-xs font-medium`}
                    >
                      <Icon className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="hidden md:inline">{category.label}</span>
                      <span className="md:hidden">{category.label.slice(0, 2)}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* 탭 콘텐츠 */}
              {categories.map((category) => (
                <TabsContent
                  key={category.id}
                  value={category.id}
                  className="space-y-4 animate-in fade-in-50 duration-300"
                >
                  {/* 카테고리 헤더 */}
                  <div className={`flex items-center gap-3 p-3 md:p-4 rounded-xl ${category.bgColor} border border-white/10`}>
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${category.bgColor} border border-white/20 flex items-center justify-center`}>
                      {(() => {
                        const Icon = category.icon;
                        return <Icon className={`w-5 h-5 md:w-6 md:h-6 ${category.color}`} />;
                      })()}
                    </div>
                    <h3 className={`text-base md:text-lg font-bold ${category.color}`}>
                      {category.label}
                    </h3>
                  </div>

                  {/* 분석 텍스트 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-3"
                  >
                    <p className="text-sm md:text-base text-white/80 leading-relaxed whitespace-pre-wrap">
                      {category.content}
                    </p>

                    {/* 문자 수 표시 (SEO 투명성) */}
                    <div className="text-xs text-muted-foreground text-right">
                      {category.content.length}자
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>

            {/* SEO 최적화 메모 */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-[10px] md:text-xs text-muted-foreground text-center">
                💡 오늘의 운세는 명리학 전문 지식을 바탕으로 작성되었습니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
}
