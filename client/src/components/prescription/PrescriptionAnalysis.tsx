import { useState } from "react";
import { motion } from "framer-motion";
import { PrescriptionFortune } from "@/lib/prescriptionFortune";
import { Coins, Heart, Briefcase, Activity } from "lucide-react";

interface PrescriptionAnalysisProps {
  fortune: PrescriptionFortune;
}

const categories = [
  {
    id: "money",
    label: "용돈과 돈",
    icon: Coins,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
  {
    id: "love",
    label: "친구와 사랑",
    icon: Heart,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
  },
  {
    id: "work",
    label: "공부와 직장",
    icon: Briefcase,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    id: "health",
    label: "건강",
    icon: Activity,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
];

export function PrescriptionAnalysis({ fortune }: PrescriptionAnalysisProps) {
  const [activeTab, setActiveTab] = useState<keyof PrescriptionFortune["deepAnalysis"]>(
    "money"
  );

  const activeCategory = categories.find((cat) => cat.id === activeTab)!;
  const IconComponent = activeCategory.icon;
  const analysisText =
    fortune.deepAnalysis[activeTab as keyof PrescriptionFortune["deepAnalysis"]];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="space-y-6"
    >
      {/* 제목 */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white">더 자세히 알고 싶다면?</h3>
        <p className="text-xs text-white/50 mt-1">
          당신이 궁금한 분야를 선택해 보세요!
        </p>
      </div>

      {/* 탭 버튼 */}
      <div className="grid grid-cols-4 gap-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setActiveTab(category.id as any)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-lg border-2 transition-all ${
              activeTab === category.id
                ? `${category.bgColor} ${category.borderColor} border-opacity-100`
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <IconComponent
              className={`w-5 h-5 mx-auto mb-1 ${
                activeTab === category.id ? category.color : "text-white/50"
              }`}
            />
            <div
              className={`text-xs font-semibold ${
                activeTab === category.id ? category.color : "text-white/70"
              }`}
            >
              {category.label}
            </div>
          </motion.button>
        ))}
      </div>

      {/* 분석 내용 */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`p-6 rounded-xl border-2 ${activeCategory.bgColor} ${activeCategory.borderColor}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <IconComponent className={`w-6 h-6 ${activeCategory.color}`} />
          <h4 className={`text-lg font-bold ${activeCategory.color}`}>
            {activeCategory.label}
          </h4>
        </div>

        <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">
          {analysisText}
        </p>

        {/* 글자 수 표시 */}
        <div className="mt-4 text-xs text-white/50 text-right">
          {analysisText.length}자
        </div>
      </motion.div>

      {/* SEO 최적화를 위한 숨겨진 텍스트 */}
      <div className="hidden">
        <h4>오늘의 운세 처방전 상세 분석</h4>
        <p>{fortune.deepAnalysis.money}</p>
        <p>{fortune.deepAnalysis.love}</p>
        <p>{fortune.deepAnalysis.work}</p>
        <p>{fortune.deepAnalysis.health}</p>
      </div>
    </motion.div>
  );
}
