import { motion } from "framer-motion";
import { SajuResult, STEM_ELEMENTS, BRANCH_ELEMENTS, STEM_YIN_YANG, BRANCH_YIN_YANG } from "@/lib/saju";
import { STEM_READINGS, BRANCH_READINGS, ELEMENT_READINGS, TEN_GOD_MEANINGS, pillarReading, withReading } from "@/lib/saju-reading";

interface SajuChartProps {
  result: SajuResult;
  theme?: 'yellow' | 'purple';
}

const ELEMENT_BG: Record<string, string> = {
  '木': 'bg-green-500/15 border-green-500/30',
  '火': 'bg-red-500/15 border-red-500/30',
  '土': 'bg-yellow-500/15 border-yellow-500/30',
  '金': 'bg-slate-300/15 border-slate-300/30',
  '水': 'bg-blue-500/15 border-blue-500/30',
};

const ELEMENT_TEXT: Record<string, string> = {
  '木': 'text-green-400',
  '火': 'text-red-400',
  '土': 'text-yellow-400',
  '金': 'text-slate-200',
  '水': 'text-blue-400',
};

export default function SajuChart({ result, theme = 'yellow' }: SajuChartProps) {
  const pillars = [
    { label: '시주(時柱)', pillar: result.hourPillar, desc: '말년·자녀' },
    { label: '일주(日柱)', pillar: result.dayPillar, desc: '본인·배우자' },
    { label: '월주(月柱)', pillar: result.monthPillar, desc: '청년·부모' },
    { label: '연주(年柱)', pillar: result.yearPillar, desc: '초년·조상' },
  ];

  const accentClass = theme === 'purple' ? 'text-purple-400' : 'text-yellow-400';
  const accentBg = theme === 'purple' ? 'bg-purple-500/10' : 'bg-yellow-500/10';

  return (
    <div className="space-y-4">
      {/* 사주팔자표 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {pillars.map((p, i) => (
                <th key={i} className="px-1 py-2 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className={`text-xs font-bold ${accentClass}`}>{p.label}</span>
                    <p className="text-[10px] text-white/40 mt-0.5">{p.desc}</p>
                  </motion.div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 십신 행 */}
            <tr>
              {pillars.map((p, i) => (
                <td key={i} className="px-1 py-1 text-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="text-[10px] text-white/50 font-medium"
                  >
                    {p.pillar.tenGod ? TEN_GOD_MEANINGS[p.pillar.tenGod]?.name || p.pillar.tenGod : '일간'}
                  </motion.div>
                </td>
              ))}
            </tr>
            {/* 천간 행 */}
            <tr>
              {pillars.map((p, i) => {
                const elem = STEM_ELEMENTS[p.pillar.stem];
                const isYang = STEM_YIN_YANG[p.pillar.stem];
                return (
                  <td key={i} className="px-1 py-1 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.15 }}
                      className={`mx-auto rounded-xl border ${ELEMENT_BG[elem]} p-2 md:p-3 relative`}
                    >
                      {i === 1 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-black">나</span>
                        </div>
                      )}
                      <div className={`text-2xl md:text-3xl font-bold ${ELEMENT_TEXT[elem]}`}>
                        {p.pillar.stem}
                      </div>
                      <div className="text-xs text-white/70 mt-1">
                        {STEM_READINGS[p.pillar.stem]}
                        <span className="text-[10px] text-white/40 ml-1">
                          ({isYang ? '양' : '음'}{ELEMENT_READINGS[elem]})
                        </span>
                      </div>
                    </motion.div>
                  </td>
                );
              })}
            </tr>
            {/* 지지 행 */}
            <tr>
              {pillars.map((p, i) => {
                const elem = BRANCH_ELEMENTS[p.pillar.branch];
                const isYang = BRANCH_YIN_YANG[p.pillar.branch];
                return (
                  <td key={i} className="px-1 py-1 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.15 }}
                      className={`mx-auto rounded-xl border ${ELEMENT_BG[elem]} p-2 md:p-3`}
                    >
                      <div className={`text-2xl md:text-3xl font-bold ${ELEMENT_TEXT[elem]}`}>
                        {p.pillar.branch}
                      </div>
                      <div className="text-xs text-white/70 mt-1">
                        {BRANCH_READINGS[p.pillar.branch]}
                        <span className="text-[10px] text-white/40 ml-1">
                          ({isYang ? '양' : '음'}{ELEMENT_READINGS[elem]})
                        </span>
                      </div>
                    </motion.div>
                  </td>
                );
              })}
            </tr>
            {/* 오행 행 */}
            <tr>
              {pillars.map((p, i) => {
                const stemElem = STEM_ELEMENTS[p.pillar.stem];
                const branchElem = BRANCH_ELEMENTS[p.pillar.branch];
                return (
                  <td key={i} className="px-1 py-1.5 text-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-center justify-center gap-1"
                    >
                      <span className={`text-[10px] font-medium ${ELEMENT_TEXT[stemElem]}`}>
                        {withReading(stemElem)}
                      </span>
                      <span className="text-[10px] text-white/30">/</span>
                      <span className={`text-[10px] font-medium ${ELEMENT_TEXT[branchElem]}`}>
                        {withReading(branchElem)}
                      </span>
                    </motion.div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 간지 요약 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`${accentBg} rounded-xl p-3 text-center`}
      >
        <p className="text-xs text-white/60 mb-1">사주팔자 간지(干支)</p>
        <p className="text-sm font-bold text-white tracking-wider">
          {pillarReading(result.yearPillar.stem, result.yearPillar.branch)}년{' '}
          {pillarReading(result.monthPillar.stem, result.monthPillar.branch)}월{' '}
          {pillarReading(result.dayPillar.stem, result.dayPillar.branch)}일{' '}
          {pillarReading(result.hourPillar.stem, result.hourPillar.branch)}시
        </p>
        <p className="text-[11px] text-white/50 mt-1">
          일간(日干): {withReading(result.dayPillar.stem)} — {STEM_YIN_YANG[result.dayPillar.stem] ? '양' : '음'}의 {ELEMENT_READINGS[STEM_ELEMENTS[result.dayPillar.stem]]}({STEM_ELEMENTS[result.dayPillar.stem]}) 기운
        </p>
      </motion.div>
    </div>
  );
}
