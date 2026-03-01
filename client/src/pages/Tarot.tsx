import { useState, useEffect, useRef } from 'react';
import { useCanonical } from '@/lib/use-canonical';
import { setTarotOGTags } from '@/lib/og-tags';
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, ChevronRight, AlertCircle, ArrowRight, Info, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Link } from "wouter";
import tarotData from "@/lib/tarot-data.json";
import { saveTarotReading } from "@/lib/tarot-db";
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

export default function Tarot() {
  useCanonical('/tarot');
  
  useEffect(() => {
    setTarotOGTags();
  }, []);

  const [question, setQuestion] = useState("");
  const [step, setStep] = useState<"input" | "shuffle" | "result">("input");
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const commonMaxWidth = "max-w-4xl mx-auto";

  const shuffleDeck = () => {
    const deck = [...tarotData];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setShuffledDeck(deck);
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
    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);
  };

  const handleInterpretation = async () => {
    try {
      const data = await getTarotInterpretation({
        question,
        cards: selectedCards,
      });
      setInterpretation(data.interpretation);
    } catch (error) {
      console.error("Tarot interpretation error:", error);
      
      let errorType: ErrorState["type"] = "unknown";
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
      
      if (errorMessage.includes("429")) {
        errorType = "quota";
      } else if (errorMessage.includes("FORBIDDEN") || errorMessage.includes("403")) {
        errorType = "api";
      } else if (errorMessage.includes("network") || errorMessage.includes("ERR_NETWORK")) {
        errorType = "network";
      } else if (errorMessage.includes("405")) {
        errorType = "api";
      }
      
      setError({
        type: errorType,
        message: errorMessage,
      });
      setIsLoading(false);
    }
  };

  const getInterpretation = async () => {
    if (isLoading) return;
    if (selectedCards.length !== 3) {
      toast.error("카드 3장을 모두 선택해 주세요.");
      return;
    }

    trackCustomEvent("check_fortune_result", {
      fortune_type: "타로",
      question_length: question.length
    });

    setIsLoading(true);
    setStep("result");
    setError(null);
    setInterpretation("");

    try {
      await handleInterpretation();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReading = async () => {
    if (isSaved || isSaving) return;
    setIsSaving(true);
    
    try {
      await saveTarotReading({
        timestamp: Date.now(),
        question,
        selectedCards,
        interpretation,
      });
      setIsSaved(true);
      toast.success("상담 기록이 저장되었습니다!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("저장에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetTarot = () => {
    setStep("input");
    setQuestion("");
    setSelectedCards([]);
    setInterpretation("");
    setError(null);
    setIsSaved(false);
  };

  // 덱을 3줄로 나눕니다.
  const rows = [
    shuffledDeck.slice(0, 26),
    shuffledDeck.slice(26, 52),
    shuffledDeck.slice(52, 78)
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased overflow-x-hidden">
      <Helmet>
        <title>무료 AI 타로 상담 - 회원가입 없이 오늘의 타로 | 무운 (MuUn)</title>
        <meta name="description" content="회원가입 없이 바로 시작하는 무료 AI 타로 상담. 고민되는 문제에 대한 해답을 개인정보 저장 없이 100% 무료로 확인하세요. 매일 새로운 타로 메시지를 받아보세요." />
        <link rel="canonical" href="https://muunsaju.com/tarot" />
        <meta property="og:title" content="무료 AI 타로 상담 - 회원가입 없이 오늘의 타로 | 무운 (MuUn)" />
        <meta property="og:description" content="회원가입 없이 바로 시작하는 무료 AI 타로 상담. 고민되는 문제에 대한 해답을 개인정보 저장 없이 100% 무료로 확인하세요. 매일 새로운 타로 메시지를 받아보세요." />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:url" content="https://muunsaju.com/tarot" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="무료 AI 타로 상담 - 회원가입 없이 오늘의 타로 | 무운 (MuUn)" />
        <meta name="twitter:description" content="회원가입 없이 바로 시작하는 무료 AI 타로 상담. 고민되는 문제에 대한 해답을 개인정보 저장 없이 100% 무료로 확인하세요. 매일 새로운 타로 메시지를 받아보세요." />
        <meta name="twitter:image" content="https://muunsaju.com/images/horse_mascot.png" />
      </Helmet>
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className={`${commonMaxWidth} px-4 h-14 flex items-center`}>
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-lg md:text-xl font-bold text-white">무운 타로 상담소</h1>
        </div>
      </header>

      <main className="relative z-10 px-4 py-6 md:py-8">
        <div className={commonMaxWidth}>
          {/* Hero Section */}
          <div className="text-center space-y-2 mb-4 md:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-primary uppercase">Tarot Reading</span>
            </motion.div>
            <h2 className="text-xl md:text-4xl font-bold tracking-tight text-white">신비로운 타로의 세계</h2>
            <p className="text-xs md:text-base text-muted-foreground max-w-md mx-auto">
              마음을 가다듬고 고민을 떠올려 보세요.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="bg-white/5 border border-white/10 p-5 md:p-8 rounded-2xl space-y-6">
                  <div className="space-y-3">
                    <label className="text-base md:text-lg font-bold text-white block">어떤 고민이 있으신가요?</label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="예: 올해 연애운이 궁금해요. / 이직을 고민 중인데 잘 될까요?"
                      className="w-full min-h-[120px] md:min-h-[150px] bg-white/5 border border-white/10 rounded-xl p-4 md:p-5 text-sm md:text-base focus:outline-none focus:border-primary/50 transition-colors resize-none"
                      disabled={isLoading}
                    />
                  </div>
                  <Button 
                    onClick={handleStart}
                    disabled={isLoading}
                    className="w-full min-h-[48px] md:min-h-[56px] rounded-xl text-base md:text-lg font-bold gap-2 shadow-[0_0_20px_rgba(255,215,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    상담 시작하기 <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* SEO 콘텐츠 */}
                <TarotContent />
              </motion.div>
            )}

            {step === "shuffle" && (
              <motion.div
                key="shuffle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-0"
              >
                {/* 선택 정보 섹션 - 더 컴팩트하게 */}
                <div className="bg-background/95 backdrop-blur-sm py-3 md:py-6 border-b border-white/10 -mx-4 px-4 mb-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <h3 className="text-base md:text-xl font-bold text-primary leading-tight">카드를 3장 선택해 주세요</h3>
                      <p className="text-[10px] md:text-sm text-muted-foreground">마음이 끌리는 카드를 순서대로 클릭하세요</p>
                    </div>
                    {/* 선택된 카드 슬롯 - 더 작게 */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <div className="flex justify-end gap-1 md:gap-3">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="w-8 h-11 md:w-14 md:h-20 rounded-md border border-dashed border-primary/40 flex items-center justify-center overflow-hidden bg-white/5 relative flex-shrink-0">
                            {selectedCards[i] ? (
                              <img 
                                src={selectedCards[i].image} 
                                alt={selectedCards[i].korName}
                                className="w-full h-full object-cover rounded-sm"
                              />
                            ) : (
                              <div className="text-sm font-bold text-primary/20">{i + 1}</div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="text-[9px] md:text-xs font-medium text-primary/60">
                        {selectedCards.length} / 3 선택됨
                      </div>
                    </div>
                  </div>
                </div>

                {/* 카드 덱 영역 - 모바일 최적화: 가로 스크롤 없이 더 촘촘하게 */}
                <div className="relative space-y-3 md:space-y-8 py-2 overflow-hidden touch-action-pan-x">
                  {rows.map((row, rowIndex) => (
                    <div 
                      key={rowIndex}
                      className="flex justify-center"
                    >
                      <div className="flex px-2 max-w-full">
                        {row.map((card, cardIndex) => {
                          const isSelected = selectedCards.find(c => c.id === card.id);
                          const selectIndex = selectedCards.findIndex(c => c.id === card.id);
                          
                          return (
                            <motion.div
                              key={card.id}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSelectCard(card)}
                              className={`
                                relative flex-shrink-0 w-[45px] h-[68px] md:w-[120px] md:h-[180px] 
                                transition-all duration-300
                                ${isSelected ? "z-20" : "z-0"}
                              `}
                              style={{ 
                                // 모바일에서 카드 겹치기를 더 촘촘하게 (-30px)
                                marginLeft: cardIndex === 0 ? 0 : '-32px', 
                                // 데스크톱에서는 기존대로
                                rotate: rowIndex % 2 === 0 ? (cardIndex % 2 === 0 ? 1 : -1) : (cardIndex % 2 === 0 ? -1 : 1)
                              }}
                            >
                              <div className={`
                                w-full h-full rounded-md md:rounded-xl overflow-hidden shadow-lg border border-white/10
                                ${isSelected 
                                  ? "ring-2 md:ring-4 ring-primary ring-offset-1 md:ring-offset-2 ring-offset-background scale-110" 
                                  : "hover:translate-y-[-5px] md:hover:translate-y-[-10px]"}
                              `}>
                                {/* 카드 뒷면 */}
                                <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-900 to-primary/40 flex items-center justify-center">
                                  <div className="w-[85%] h-[85%] border border-primary/20 rounded-sm md:rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-3 h-3 md:w-10 md:h-10 text-primary/30" />
                                  </div>
                                </div>
                                
                                {isSelected && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-[1px]">
                                    <div className="w-5 h-5 md:w-12 md:h-12 rounded-full bg-primary text-background flex items-center justify-center font-bold text-xs md:text-2xl shadow-xl">
                                      {selectIndex + 1}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedCards.length === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-8 left-0 right-0 px-4 z-50 flex justify-center"
                  >
                    <Button 
                      onClick={getInterpretation}
                      size="lg"
                      className="w-full max-w-md h-12 md:h-16 text-base md:text-xl font-bold rounded-xl md:rounded-2xl shadow-2xl shadow-primary/40 animate-bounce"
                    >
                      해석하기 <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* 선택된 카드 리스트 */}
                <div className="grid grid-cols-3 gap-3 md:gap-6">
                  {selectedCards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="space-y-3"
                    >
                      <div className="aspect-[2/3] rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/10">
                        <img 
                          src={card.image} 
                          alt={card.korName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] md:text-xs text-primary font-bold uppercase tracking-wider">
                          {["Past", "Present", "Future"][index]}
                        </span>
                        <h4 className="text-sm md:text-lg font-bold text-white truncate">{card.korName}</h4>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {isLoading ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 space-y-6">
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-lg font-bold text-white">카드의 목소리를 듣는 중입니다...</p>
                        <p className="text-sm text-muted-foreground">잠시만 기다려 주세요. 정성껏 해석해 드릴게요.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full bg-white/5" />
                      <Skeleton className="h-4 w-[90%] bg-white/5" />
                      <Skeleton className="h-4 w-[95%] bg-white/5" />
                      <Skeleton className="h-4 w-[85%] bg-white/5" />
                    </div>
                  </div>
                ) : error ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 md:p-8 text-center space-y-4"
                  >
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white">해석을 가져오지 못했습니다</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {EMOTIONAL_ERROR_MESSAGES[error.type]}
                      </p>
                    </div>
                    <Button 
                      onClick={handleInterpretation}
                      variant="outline"
                      className="border-red-500/30 hover:bg-red-500/10 text-red-500"
                    >
                      다시 시도하기
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-8 space-y-6"
                  >
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-primary mb-4">타로의 메시지</h3>
                      <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed text-foreground whitespace-pre-wrap">
                        {processAIContent(interpretation)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={handleSaveReading}
                        disabled={isSaved || isSaving}
                        className="w-full gap-2"
                      >
                        <Info className="w-4 h-4" />
                        {isSaved ? "저장됨" : isSaving ? "저장 중..." : "상담 기록 저장"}
                      </Button>
                      <Button 
                        onClick={resetTarot}
                        variant="outline"
                        className="w-full gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        새로운 상담 시작
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {/* 콘텐츠 추천 섹션 */}
          <RecommendedContent />
        </div>
      </main>

      <Helmet>
        <title>타로 상담소 | 무운(MUUN) - 온라인 운세</title>
        <meta name="description" content="신비로운 타로 카드가 당신의 고민을 해석해 드립니다. 타로 카드로 미래를 엿보세요." />
        <meta name="keywords" content="타로, 무료타로, AI타로, 오늘의타로, 타로상담, 무료타로점, 타로카드, 온라인타로" />
      </Helmet>
    </div>
  );
}
