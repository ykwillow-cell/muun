import { useState, useEffect, useRef } from 'react';
import RelatedServices from '@/components/RelatedServices';
import { useCanonical } from '@/lib/use-canonical';
import { setTarotOGTags } from '@/lib/og-tags';
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, ChevronRight, AlertCircle, ChevronLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Link } from "wouter";
import tarotData from "@/lib/tarot-data.json";
import { trackCustomEvent } from "@/lib/ga4";
import TarotContent from "@/components/TarotContent";
import RecommendedContent from "@/components/RecommendedContent";
import { getTarotInterpretation } from "@/lib/tarot-api";
import { processAIContent } from "@/lib/content-cleaner";

interface TarotCard {
  id: number;
  name: string;
  korName: string;
  arcana: string;
  image: string;
}

interface ErrorState {
  type: "quota" | "api" | "network" | "unknown";
  message: string;
}

const EMOTIONAL_ERROR_MESSAGES: Record<string, string> = {
  quota: "현재 상담 신청이 너무 많아 상담사가 잠시 휴식 중입니다.\n약 1분 뒤에 다시 '해석하기'를 눌러주세요.",
  api: "카드의 목소리가 아직 명확하지 않습니다.\n잠시 후 다시 한 번 시도해 주세요.",
  network: "신령한 연결이 원활하지 않습니다.\n인터넷 연결을 확인하고 다시 시도해 주세요.",
  unknown: "신비로운 기운에 일시적인 간섭이 생겼습니다.\n다시 시도해 주시면 정성껏 해석해 드릴게요.",
};

const EXAMPLE_QUESTIONS = [
  "올해 연애운이 궁금해요",
  "이직을 고민 중인데 잘 될까요?",
  "현재 하는 일이 나와 맞을까요?",
  "재물운과 투자 시기가 궁금해요",
  "소중한 사람과의 관계가 걱정돼요",
];

const CARD_POSITIONS = ["과거", "현재", "미래"];
const CARD_POSITION_EN = ["Past", "Present", "Future"];

export default function Tarot() {
  useCanonical('/tarot');
  
  useEffect(() => {
    setTarotOGTags();
  }, []);

  const [question, setQuestion] = useState("");
  const [step, setStep] = useState<"input" | "shuffle" | "result">("input");

  useEffect(() => {
    if (step === 'result') {
      window.dispatchEvent(new Event('muun:banner:hide'));
    } else {
      window.dispatchEvent(new Event('muun:banner:show'));
    }
    return () => { window.dispatchEvent(new Event('muun:banner:show')); };
  }, [step]);

  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [error, setError] = useState<ErrorState | null>(null);

  const shuffleDeck = () => {
    const deck = [...tarotData];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setShuffledDeck(deck.slice(0, 22));
  };

  const handleStart = () => {
    if (!question.trim()) {
      toast.error("고민을 입력해 주세요.");
      return;
    }
    shuffleDeck();
    setStep("shuffle");
  };

  const handleSelectCard = (card: TarotCard) => {
    if (selectedCards.length >= 3) return;
    if (selectedCards.find(c => c.id === card.id)) return;
    setSelectedCards([...selectedCards, card]);
  };

  const handleInterpretation = async () => {
    try {
      const data = await getTarotInterpretation({ question, cards: selectedCards });
      setInterpretation(data.interpretation);
    } catch (error) {
      console.error("Tarot interpretation error:", error);
      let errorType: ErrorState["type"] = "unknown";
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
      if (errorMessage.includes("429")) errorType = "quota";
      else if (errorMessage.includes("FORBIDDEN") || errorMessage.includes("403")) errorType = "api";
      else if (errorMessage.includes("network") || errorMessage.includes("ERR_NETWORK")) errorType = "network";
      else if (errorMessage.includes("405")) errorType = "api";
      setError({ type: errorType, message: errorMessage });
      setIsLoading(false);
    }
  };

  const getInterpretation = async () => {
    if (isLoading) return;
    if (selectedCards.length !== 3) { toast.error("카드 3장을 모두 선택해 주세요."); return; }
    trackCustomEvent("check_fortune_result", { fortune_type: "타로", question_length: question.length });
    setIsLoading(true);
    setStep("result");
    setError(null);
    setInterpretation("");
    try { await handleInterpretation(); } finally { setIsLoading(false); }
  };

  const resetTarot = () => {
    setStep("input");
    setQuestion("");
    setSelectedCards([]);
    setInterpretation("");
    setError(null);
  };

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [rows, setRows] = useState<TarotCard[][]>([]);
  useEffect(() => {
    const updateRows = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        // 데스크탑: 팬 스프레드 (11-11)
        setRows([shuffledDeck.slice(0, 11), shuffledDeck.slice(11, 22)]);
      }
    };
    updateRows();
    window.addEventListener('resize', updateRows);
    return () => window.removeEventListener('resize', updateRows);
  }, [shuffledDeck]);

  return (
    <div className="mu-subpage-screen min-h-screen bg-[#F5F4F8] text-foreground pb-20 antialiased overflow-x-hidden" {...(step === "shuffle" ? { "data-tarot-shuffle": "" } : {})}>
      <Helmet>
        <title>무료 타로 상담 - 회원가입 없이 무료로 | 무운 (MuUn)</title>
        <meta name="description" content="회원가입 없이 바로 시작하는 무료 타로 상담. 고민되는 문제에 대한 해답을 개인정보 저장 없이 100% 무료로 확인하세요." />
        <link rel="canonical" href="https://muunsaju.com/tarot" />
        <meta property="og:title" content="무료 타로 상담 - 회원가입 없이 무료로 | 무운 (MuUn)" />
        <meta property="og:description" content="회원가입 없이 바로 시작하는 무료 타로 상담. 고민되는 문제에 대한 해답을 개인정보 저장 없이 100% 무료로 확인하세요." />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:url" content="https://muunsaju.com/tarot" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="무료 타로 상담 - 회원가입 없이 무료로 | 무운 (MuUn)" />
        <meta name="twitter:description" content="회원가입 없이 바로 시작하는 무료 타로 상담. 고민되는 문제에 대한 해답을 개인정보 저장 없이 100% 무료로 확인하세요." />
        <meta name="twitter:image" content="https://muunsaju.com/images/horse_mascot.png" />
      </Helmet>

      {/* ── 헤더 ── */}
      <header className="relative z-50 bg-white border-b border-black/[0.06]" style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}>
        <div className="w-full px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            {step !== 'input' ? (
              <button
                onClick={() => step === 'shuffle' ? setStep('input') : resetTarot()}
                className="mr-2 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/[0.06] transition-colors text-[#1a1a18]"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            ) : (
              <Link href="/">
                <button className="mr-2 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/[0.06] transition-colors text-[#1a1a18]">
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </Link>
            )}
            <h1 className="text-base font-bold text-[#1a1a18]">
              무운 타로 상담소
            </h1>
          </div>
          {step === 'shuffle' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {selectedCards.length} / 3
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="mu-service-main relative z-10 w-full px-0 pt-0 pb-0">
      <AnimatePresence mode="wait">

        {/* ════════════════════════════════
            STEP 1 : 질문 입력
        ════════════════════════════════ */}
        {step === "input" && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* 히어로 — 딥 미드나이트 퍼플 */}
            <div className="relative overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #130a38 0%, #221265 38%, #3a1660 68%, #1a0832 100%)', minHeight: '220px' }}>
              {/* 별 */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(18)].map((_, i) => (
                  <div key={i} className="absolute rounded-full bg-white"
                    style={{
                      width: i % 3 === 0 ? '3px' : '2px', height: i % 3 === 0 ? '3px' : '2px',
                      top: `${8 + (i * 13) % 75}%`, left: `${5 + (i * 17) % 85}%`,
                      opacity: 0.4 + (i % 4) * 0.15,
                    }} />
                ))}
              </div>
              {/* 달 */}
              <div className="absolute right-6 top-5" style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'radial-gradient(circle at 42% 40%, #fffef6 0%, #fff9e0 48%, rgba(255,244,196,0.4) 100%)',
                boxShadow: '0 0 40px rgba(255,228,100,0.2)',
              }} />
              {/* 텍스트 */}
              <div className="relative z-10 px-5 pt-8 pb-7">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Sparkles className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.8)' }} />
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.8)' }}>Tarot Reading</span>
                </div>
                <h2 className="text-2xl font-bold text-white leading-tight tracking-tight mb-2">
                  카드가 말하는<br />당신의 이야기
                </h2>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  마음속 고민을 떠올리고, 카드에게 물어보세요.
                </p>
              </div>
            </div>

            {/* 질문 입력 카드 */}
            <div className="px-4 py-5 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-black/[0.06] overflow-hidden">
                <div className="px-5 pt-5 pb-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-[#1a1a18] mb-3">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    어떤 고민이 있으신가요?
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="고민을 솔직하게 적어주세요. 카드가 더 정확하게 읽힙니다."
                    className="w-full bg-[#F7F5F3] border border-[#E8E5E0] rounded-xl p-4 text-base text-[#1a1a18] placeholder:text-[#b0ada6] focus:outline-none focus:border-purple-400 transition-colors resize-none"
                    style={{ minHeight: '120px' }}
                    disabled={isLoading}
                  />
                  {/* 예시 질문 칩 */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {EXAMPLE_QUESTIONS.map((q) => (
                      <button key={q} onClick={() => setQuestion(q)}
                        className="text-xs px-3 py-1.5 rounded-full border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors font-medium">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <button onClick={handleStart} disabled={isLoading}
                    className="w-full h-13 rounded-xl text-base font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                    style={{ height: '52px', background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}>
                    <Star className="w-4 h-4" />
                    카드 펼치기
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 안내 */}
              <div className="flex items-start gap-3 px-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a1a18] mb-0.5">3장 카드 타로 (과거·현재·미래)</p>
                  <p className="text-sm text-[#5a5a60] leading-relaxed">
                    78장의 타로 카드 중 3장을 직접 선택하면 AI가 과거·현재·미래의 흐름을 해석해 드려요.
                  </p>
                </div>
              </div>

              {/* SEO 콘텐츠 */}
              <TarotContent />
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════
            STEP 2 : 카드 선택 (셔플)
        ════════════════════════════════ */}
        {step === "shuffle" && (
          <motion.div key="shuffle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen"
            style={{ background: 'linear-gradient(180deg, #0f0a2e 0%, #1a0f4a 40%, #0f0a2e 100%)' }}>

            {/* 상단 안내 */}
            <div className="px-5 pt-6 pb-4 text-center">
              <p className="text-sm font-medium mb-1" style={{ color: 'rgba(167,139,250,0.9)' }}>
                마음이 끌리는 카드를 순서대로 선택하세요
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                "{question.length > 30 ? question.slice(0, 30) + '…' : question}"
              </p>
            </div>

            {/* 선택된 카드 슬롯 */}
            <div className="flex justify-center gap-4 px-5 mb-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="rounded-xl overflow-hidden"
                    style={{
                      width: '70px', height: '105px',
                      border: selectedCards[i] ? '2px solid rgba(167,139,250,0.8)' : '2px dashed rgba(255,255,255,0.2)',
                      background: selectedCards[i] ? 'transparent' : 'rgba(255,255,255,0.05)',
                      boxShadow: selectedCards[i] ? '0 8px 24px rgba(124,58,237,0.4)' : 'none',
                    }}>
                    {selectedCards[i] ? (
                      <img src={selectedCards[i].image} alt={selectedCards[i].korName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.15)' }}>{i + 1}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold" style={{ color: selectedCards[i] ? 'rgba(167,139,250,0.9)' : 'rgba(255,255,255,0.3)' }}>
                    {CARD_POSITIONS[i]}
                  </span>
                </div>
              ))}
            </div>

            {/* 카드 덱 — 모바일: 5열 그리드 / 데스크탑: 팬 스프레드 */}
            {isMobile ? (
              /* ── 모바일: 5열 그리드 — 전체 카드 한눈에 ── */
              <div className="px-4 pb-4">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {shuffledDeck.map((card) => {
                    const isSelected = !!selectedCards.find(c => c.id === card.id);
                    const selectIndex = selectedCards.findIndex(c => c.id === card.id);
                    const disabled = selectedCards.length >= 3 && !isSelected;
                    return (
                      <motion.div key={card.id}
                        onClick={() => !disabled && handleSelectCard(card)}
                        whileTap={!disabled ? { scale: 0.92 } : {}}
                        animate={isSelected ? { scale: 1.06 } : { scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                        style={{
                          aspectRatio: '2/3',
                          cursor: disabled ? 'not-allowed' : 'pointer',
                          opacity: disabled ? 0.45 : 1,
                          position: 'relative',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          boxShadow: isSelected
                            ? '0 0 0 2.5px #a78bfa, 0 8px 20px rgba(124,58,237,0.45)'
                            : '0 3px 10px rgba(0,0,0,0.45)',
                        }}>
                        {/* 카드 뒷면 */}
                        <div style={{
                          width: '100%', height: '100%',
                          background: isSelected
                            ? 'linear-gradient(135deg, #3b1f9e 0%, #5b21b6 100%)'
                            : 'linear-gradient(135deg, #1a0f4a 0%, #2d1a82 50%, #1a0f4a 100%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <div style={{
                            width: '78%', height: '78%',
                            border: `1px solid ${isSelected ? 'rgba(167,139,250,0.6)' : 'rgba(167,139,250,0.25)'}`,
                            borderRadius: '5px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Sparkles className="w-2.5 h-2.5" style={{ color: isSelected ? 'rgba(167,139,250,0.8)' : 'rgba(167,139,250,0.3)' }} />
                          </div>
                        </div>
                        {/* 선택 번호 뱃지 */}
                        {isSelected && (
                          <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(91,33,182,0.35)',
                          }}>
                            <div style={{
                              width: '24px', height: '24px', borderRadius: '50%',
                              background: '#7c3aed', color: 'white',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 700, fontSize: '12px',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                            }}>
                              {selectIndex + 1}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ── 데스크탑: 팬 스프레드 ── */
              <div className="relative space-y-4 py-2 px-2">
                {rows.map((row, rowIndex) => {
                  const maxAngle = row.length <= 7 ? 24 : 28;
                  return (
                    <div key={rowIndex} className="relative flex justify-center items-end" style={{ height: '110px' }}>
                      {row.map((card, cardIndex) => {
                        const isSelected = !!selectedCards.find(c => c.id === card.id);
                        const selectIndex = selectedCards.findIndex(c => c.id === card.id);
                        const rotation = row.length > 1 ? (cardIndex / (row.length - 1)) * maxAngle * 2 - maxAngle : 0;
                        return (
                          <motion.div key={card.id} onClick={() => handleSelectCard(card)}
                            animate={isSelected ? { y: -22, scale: 1.15 } : { y: 0, scale: 1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            style={{
                              width: '44px', aspectRatio: '2/3', flexShrink: 0,
                              marginLeft: cardIndex === 0 ? 0 : '-7px',
                              transformOrigin: 'bottom center',
                              rotate: rotation,
                              zIndex: isSelected ? 30 : cardIndex,
                              cursor: selectedCards.length >= 3 && !isSelected ? 'not-allowed' : 'pointer',
                            }}>
                            <div className={`w-full h-full rounded-lg overflow-hidden relative ${isSelected ? 'ring-2 ring-violet-400 ring-offset-2' : ''}`}
                              style={{ boxShadow: isSelected ? '0 12px 28px rgba(124,58,237,0.5)' : '0 4px 12px rgba(0,0,0,0.5)' }}>
                              <div className="w-full h-full flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #1a0f4a 0%, #2d1a82 50%, #1a0f4a 100%)' }}>
                                <div className="flex items-center justify-center"
                                  style={{ width: '82%', height: '82%', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '4px' }}>
                                  <Sparkles className="w-3 h-3" style={{ color: 'rgba(167,139,250,0.4)' }} />
                                </div>
                              </div>
                              {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center"
                                  style={{ background: 'rgba(124,58,237,0.4)', backdropFilter: 'blur(1px)' }}>
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white"
                                    style={{ background: '#7c3aed', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                                    {selectIndex + 1}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3장 선택 완료 → 해석 버튼 */}
            <AnimatePresence>
              {selectedCards.length === 3 && (
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                  className="fixed bottom-24 left-0 right-0 px-5 z-50 flex justify-center">
                  <button onClick={getInterpretation}
                    className="w-full max-w-sm h-14 rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 12px 40px rgba(124,58,237,0.5)' }}>
                    <Sparkles className="w-5 h-5" />
                    카드 해석하기
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ════════════════════════════════
            STEP 3 : 결과
        ════════════════════════════════ */}
        {step === "result" && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="px-4 py-5 space-y-5">

            {/* 질문 요약 */}
            <div className="rounded-2xl px-4 py-3 flex items-start gap-3"
              style={{ background: 'linear-gradient(135deg, #1a0f4a, #2d1a82)', }}>
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(167,139,250,0.9)' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                "{question}"
              </p>
            </div>

            {/* 선택된 3장 카드 */}
            <div className="grid grid-cols-3 gap-3">
              {selectedCards.map((card, index) => (
                <motion.div key={card.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.15 }}
                  className="flex flex-col items-center gap-2">
                  <div className="w-full rounded-xl overflow-hidden"
                    style={{ aspectRatio: '2/3', border: '2px solid rgba(124,58,237,0.3)', boxShadow: '0 8px 24px rgba(124,58,237,0.2)' }}>
                    <img src={card.image} alt={card.korName} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold mb-0.5" style={{ color: '#7c3aed' }}>
                      {CARD_POSITION_EN[index]} · {CARD_POSITIONS[index]}
                    </p>
                    <p className="text-sm font-bold text-[#1a1a18] leading-tight">{card.korName}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 해석 영역 */}
            {isLoading ? (
              <div className="bg-white border border-black/[0.06] rounded-2xl p-6" data-tarot-result-card>
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-purple-500 animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-base font-bold text-[#1a1a18]">카드의 목소리를 듣는 중입니다...</p>
                    <p className="text-sm text-[#8b95a1]">잠시만 기다려 주세요. 정성껏 해석해 드릴게요.</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[100, 90, 95, 85, 92].map((w, i) => (
                    <Skeleton key={i} className="h-4 bg-black/[0.05] rounded-full" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>
            ) : error ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#1a1a18]">해석을 가져오지 못했습니다</h3>
                  <p className="text-sm text-[#5a5a60] whitespace-pre-wrap">{EMOTIONAL_ERROR_MESSAGES[error.type]}</p>
                </div>
                <button onClick={getInterpretation}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold border border-red-300 text-red-600 hover:bg-red-100 transition-colors">
                  다시 시도하기
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden" data-tarot-result-card>
                {/* 헤더 */}
                <div className="px-5 py-4 border-b border-black/[0.06]"
                  style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-[#1a1a18]">타로의 메시지</h3>
                  </div>
                </div>
                {/* 본문 */}
                <div className="px-5 py-5">
                  <div className="text-base text-[#1a1a18] leading-relaxed whitespace-pre-wrap">
                    {processAIContent(interpretation)}
                  </div>
                </div>
                {/* 버튼 */}
                <div className="px-5 pb-5 space-y-2.5">

                  <button onClick={resetTarot}
                    className="w-full h-12 rounded-xl text-base font-bold text-[#1a1a18] border border-black/10 bg-white flex items-center justify-center gap-2 hover:bg-black/[0.03] transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    새로운 상담 시작
                  </button>
                </div>
              </motion.div>
            )}

            {/* 추천 콘텐츠 */}
                  <RelatedServices
        title="타로와 함께 보면 좋은 서비스"
        services={[
          { href: '/lifelong-saju', emoji: '🔮', label: '평생사주', description: '타로가 보여준 흐름을 사주로 더 깊이 확인해보세요.' },
          { href: '/daily-fortune', emoji: '📅', label: '오늘의 운세', description: '오늘 하루의 총운, 재물운, 애정운을 바로 확인해보세요.' },
          { href: '/compatibility', emoji: '💞', label: '궁합', description: '관계에 관한 질문이라면 궁합 분석도 함께 보세요.' },
          { href: '/past-life', emoji: '✨', label: '전생', description: '타로와 함께 전생으로 보는 나의 본질도 확인해보세요.' },
        ]}
      />
          <RecommendedContent />
          </motion.div>
        )}

      </AnimatePresence>
      </main>

      <Helmet>
        <title>타로 상담소 | 무운(MUUN) - 온라인 운세</title>
        <meta name="description" content="신비로운 타로 카드가 당신의 고민을 해석해 드립니다. 타로 카드로 미래를 엿보세요." />
        <meta name="keywords" content="타로, 무료타로, 타로상담, 무료타로점, 타로카드, 온라인타로" />
      </Helmet>
    </div>
  );
}
