import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface SajuGuideProps {
  userName: string;
  theme?: 'yellow' | 'purple';
}

const SajuGuide: React.FC<SajuGuideProps> = ({ userName, theme = 'yellow' }) => {
  const [isOpen, setIsOpen] = useState(true);

  const accentColor = theme === 'purple' ? 'purple' : 'primary';
  const accentBg = theme === 'purple' ? 'bg-purple-500/10 border-purple-500/20' : 'bg-primary/10 border-primary/20';
  const accentText = theme === 'purple' ? 'text-purple-400' : 'text-primary';
  const accentHover = theme === 'purple' ? 'hover:bg-purple-500/20' : 'hover:bg-primary/20';

  return (
    <div className={`rounded-2xl border ${accentBg} overflow-hidden transition-all`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 ${accentHover} transition-colors min-h-[48px]`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg ${theme === 'purple' ? 'bg-purple-500/20' : 'bg-primary/20'} flex items-center justify-center`}>
            <HelpCircle className={`w-4 h-4 ${accentText}`} />
          </div>
          <span className={`text-base font-bold ${accentText}`}>
            🧐 사주팔자, 함께 읽어볼까요?
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className={`w-4 h-4 ${accentText}`} />
        ) : (
          <ChevronDown className={`w-4 h-4 ${accentText}`} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 space-y-5">
              {/* 인트로 */}
              <p className="text-base text-white/80 leading-relaxed">
                위에 보이는 표는 <strong className="text-white">'만세력'</strong> 또는 <strong className="text-white">'사주팔자'</strong>라고 불러요.
                {userName}님이 태어난 생년월일시 정보를 우주의 기운을 담은 문자로 변환한, 일종의 <strong className="text-white">'인생 지도'</strong>와 같답니다.
                앞으로 펼쳐질 모든 풀이는 바로 이 지도에 담긴 비밀을 하나씩 풀어가는 과정이에요.
              </p>

              {/* 사주(四柱) 설명 */}
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                  <span className="text-base">📊</span> 사주(四柱) — 네 개의 기둥
                </h4>
                <p className="text-sm text-white/70 leading-relaxed">
                  오른쪽부터 <strong className="text-white/90">연주(태어난 해)</strong>, <strong className="text-white/90">월주(태어난 달)</strong>, <strong className="text-white/90">일주(태어난 날)</strong>, <strong className="text-white/90">시주(태어난 시간)</strong>라는 4개의 기둥을 세운 것이에요.
                  각 기둥은 나의 인생 시기(초년, 청년, 중년, 말년)와 나와 연결된 사람들(조상, 부모, 배우자, 자녀)을 상징한답니다.
                </p>
              </div>

              {/* 팔자(八字) 설명 */}
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                  <span className="text-base">✍️</span> 팔자(八字) — 여덟 개의 글자
                </h4>
                <p className="text-sm text-white/70 leading-relaxed">
                  4개의 기둥마다 위(<strong className="text-white/90">천간</strong>, 하늘의 기운)와 아래(<strong className="text-white/90">지지</strong>, 땅의 기운)에 글자가 하나씩, 총 8개의 글자가 새겨져 있어요.
                  그래서 '사주팔자'라고 부른답니다. 이 8글자의 조합이 바로 {userName}님만의 고유한 기운을 나타내요.
                </p>
              </div>

              {/* 오행(五行) 색상 설명 */}
              <div className="space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                  <span className="text-base">🎨</span> 오행(五行) 색상 — 다섯 가지 에너지
                </h4>
                <p className="text-sm text-white/70 leading-relaxed mb-2">
                  각 글자의 배경색은 세상을 이루는 5가지 기본 에너지, <strong className="text-white/90">오행(木, 火, 土, 金, 水)</strong>을 상징해요. 색깔만 봐도 어떤 기운이 많은지 한눈에 알 수 있죠!
                </p>

                <div className="grid grid-cols-1 gap-2">
                  {/* 목(木) */}
                  <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                      <span className="text-green-400 font-bold text-sm">木</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-green-400">목(木) 나무 — 초록색</p>
                      <p className="text-xs text-white/60 mt-0.5">성장, 시작, 자존심, 계획을 상징해요</p>
                    </div>
                  </div>

                  {/* 화(火) */}
                  <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                      <span className="text-red-400 font-bold text-sm">火</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-red-400">화(火) 불 — 빨간색</p>
                      <p className="text-xs text-white/60 mt-0.5">열정, 표현, 예의, 화려함을 상징해요</p>
                    </div>
                  </div>

                  {/* 토(土) */}
                  <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                      <span className="text-yellow-400 font-bold text-sm">土</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-yellow-400">토(土) 흙 — 노란색</p>
                      <p className="text-xs text-white/60 mt-0.5">신뢰, 안정, 중재, 포용력을 상징해요</p>
                    </div>
                  </div>

                  {/* 금(金) */}
                  <div className="flex items-center gap-3 bg-slate-300/10 border border-slate-300/20 rounded-xl px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-300/20 flex items-center justify-center shrink-0">
                      <span className="text-slate-200 font-bold text-sm">金</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-200">금(金) 쇠 — 회색</p>
                      <p className="text-xs text-white/60 mt-0.5">의리, 결단력, 이성, 마무리를 상징해요</p>
                    </div>
                  </div>

                  {/* 수(水) */}
                  <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <span className="text-blue-400 font-bold text-sm">水</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-blue-400">수(水) 물 — 파란색</p>
                      <p className="text-xs text-white/60 mt-0.5">지혜, 유연함, 생각, 휴식을 상징해요</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 마무리 팁 */}
              <div className={`${theme === 'purple' ? 'bg-purple-500/10 border-purple-500/20' : 'bg-primary/10 border-primary/20'} border rounded-xl p-3`}>
                <p className="text-sm text-white/70 leading-relaxed">
                  <strong className={accentText}>💡 Tip:</strong> 일주(日柱)의 천간, 즉 위쪽 글자에 <span className="text-yellow-400 font-bold">'나'</span>라는 표시가 붙어 있는 것이 보이시나요?
                  이것이 바로 {userName}님의 핵심 기운인 <strong className="text-white/90">'일간(日干)'</strong>이에요. 사주 풀이의 모든 해석은 이 글자를 중심으로 이루어진답니다!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SajuGuide;
