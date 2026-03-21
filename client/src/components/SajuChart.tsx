import { motion } from "framer-motion";
import { SajuResult, STEM_ELEMENTS, BRANCH_ELEMENTS, STEM_YIN_YANG, BRANCH_YIN_YANG } from "@/lib/saju";
import { STEM_READINGS, BRANCH_READINGS, ELEMENT_READINGS, TEN_GOD_MEANINGS, pillarReading, withReading } from "@/lib/saju-reading";

interface SajuChartProps {
  result: SajuResult;
  theme?: 'yellow' | 'purple';
}

// 오행별 배경/테두리 (Tailwind 클래스 — 오행 고유 색상은 의미적 색상이므로 유지)
const ELEMENT_BG: Record<string, string> = {
  '木': 'bg-green-500/15 border-green-500/30',
  '火': 'bg-red-500/15 border-red-500/30',
  '土': 'bg-yellow-500/15 border-yellow-500/30',
  '金': 'bg-[#6a6a66]/15 border-[#6a6a66]/30',
  '水': 'bg-blue-500/15 border-blue-500/30',
};

const ELEMENT_TEXT: Record<string, string> = {
  '木': 'text-green-600',
  '火': 'text-red-600',
  '土': 'text-yellow-600',
  '金': 'text-[#6a6a66]',
  '水': 'text-blue-600',
};

export default function SajuChart({ result, theme = 'yellow' }: SajuChartProps) {
  const pillars = [
    { label: '시주(時柱)', pillar: result.hourPillar, desc: '말년·자녀' },
    { label: '일주(日柱)', pillar: result.dayPillar, desc: '본인·배우자' },
    { label: '월주(月柱)', pillar: result.monthPillar, desc: '청년·부모' },
    { label: '연주(年柱)', pillar: result.yearPillar, desc: '초년·조상' },
  ];

  // theme prop은 하위 호환성 유지 (어드민 토큰 없을 때 fallback)
  const fallbackAccentClass = theme === 'purple' ? 'text-purple-600' : 'text-yellow-600';
  const fallbackSummaryBg = theme === 'purple' ? 'rgba(168,85,247,0.10)' : 'rgba(234,179,8,0.10)';

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
                    {/* 기둥 레이블: 어드민 result-accent-primary 우선, fallback: theme prop */}
                    <span
                      className={`text-xs font-bold ${fallbackAccentClass}`}
                      style={{ color: 'var(--result-accent-primary)' }}
                    >
                      {p.label}
                    </span>
                    {/* 보조 텍스트: 어드민 result-label-color 우선 */}
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: 'var(--result-label-color, #999891)' }}
                    >
                      {p.desc}
                    </p>
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
                    className="text-[10px] font-medium"
                    style={{ color: 'var(--result-label-color, #999891)' }}
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
                        <div
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: 'var(--result-accent-primary, #eab308)' }}
                        >
                          <span className="text-[8px] font-bold text-white">나</span>
                        </div>
                      )}
                      <div className={`text-2xl md:text-3xl font-bold ${ELEMENT_TEXT[elem]}`}>
                        {p.pillar.stem}
                      </div>
                      <div
                        className="text-xs mt-1"
                        style={{ color: 'var(--result-label-color, #5a5a56)' }}
                      >
                        {STEM_READINGS[p.pillar.stem]}
                        <span
                          className="text-[10px] ml-1"
                          style={{ color: 'var(--result-label-color, #999891)' }}
                        >
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
                      <div
                        className="text-xs mt-1"
                        style={{ color: 'var(--result-label-color, #5a5a56)' }}
                      >
                        {BRANCH_READINGS[p.pillar.branch]}
                        <span
                          className="text-[10px] ml-1"
                          style={{ color: 'var(--result-label-color, #999891)' }}
                        >
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
                      <span
                        className="text-[10px]"
                        style={{ color: 'var(--result-label-color, #999891)' }}
                      >
                        /
                      </span>
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

      {/* 간지 요약 — 어드민 result-summary-bg 우선, fallback: theme prop */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="rounded-xl p-3 text-center"
        style={{ background: `var(--result-summary-bg, ${fallbackSummaryBg})` }}
      >
        <p
          className="text-xs mb-1"
          style={{ color: 'var(--result-label-color, #5a5a56)' }}
        >
          사주팔자 간지(干支)
        </p>
        <p className="text-sm font-bold tracking-wider" style={{ color: 'var(--foreground, #1a1a18)' }}>
          {pillarReading(result.yearPillar.stem, result.yearPillar.branch)}년{' '}
          {pillarReading(result.monthPillar.stem, result.monthPillar.branch)}월{' '}
          {pillarReading(result.dayPillar.stem, result.dayPillar.branch)}일{' '}
          {pillarReading(result.hourPillar.stem, result.hourPillar.branch)}시
        </p>
        <p
          className="text-[11px] mt-1"
          style={{ color: 'var(--result-label-color, #999891)' }}
        >
          일간(日干): {withReading(result.dayPillar.stem)} — {STEM_YIN_YANG[result.dayPillar.stem] ? '양' : '음'}의 {ELEMENT_READINGS[STEM_ELEMENTS[result.dayPillar.stem]]}({STEM_ELEMENTS[result.dayPillar.stem]}) 기운
        </p>
      </motion.div>
    </div>
  );
}
