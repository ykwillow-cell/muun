import { useState, useEffect } from "react";
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
      }
      
      setError({
        type: errorType,
        message: EMOTIONAL_ERROR_MESSAGES[errorType],
      });
      return;
    }
    
    setStep("result");
    setError(null);
    trackCustomEvent("tarot_interpretation_complete", {
      question_length: question.length,
      cards_selected: selectedCards.map(c => c.korName).join(", "),
    });
  };

  const getInterpretation = async () => {
    setIsLoading(true);
    await handleInterpretation();
    setIsLoading(false);
  };

  const saveTarot = async () => {
    setIsSaving(true);
    try {
      await saveTarotReading({
        question,
        cards: selectedCards,
        interpretation,
        readAt: new Date().toISOString(),
      });
      setIsSaved(true);
      toast.success("타로 상담 기록이 저장되었습니다.");
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

  // 덱을 4줄로 나눕니다 (78장 ÷ 4 = 약 19-20장씩)
  const cardsPerRow = Math.ceil(shuffledDeck.length / 4);
  const rows = [
    shuffledDeck.slice(0, cardsPerRow),
    shuffledDeck.slice(cardsPerRow, cardsPerRow * 2),
    shuffledDeck.slice(cardsPerRow * 2, cardsPerRow * 3),
    shuffledDeck.slice(cardsPerRow * 3)
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className={`container mx-auto max-w-[1280px] px-4 h-14 flex items-center justify-between`}>
          <Link href="/">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-base md:text-lg font-bold text-white">무운 타로 상담소</h1>
          <div className="w-[44px]" />
        </div>
      </header>

      <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={commonMaxWidth + " space-y-8 md:space-y-12"}
        >
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-xl">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-primary uppercase">Tarot Reading</span>
            </div>
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
                {/* 선택 정보 섹션 */}
                <div className="bg-background/95 backdrop-blur-sm py-3 md:py-6 border-b border-white/10 -mx-4 px-4 mb-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <h3 className="text-base md:text-xl font-bold text-primary leading-tight">카드를 3장 선택해 주세요</h3>
                      <p className="text-[10px] md:text-sm text-muted-foreground">마음이 끌리는 카드를 순서대로 클릭하세요</p>
                    </div>
                    {/* 선택된 카드 슬롯 */}
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

                {/* 카드 덱 영역 - 모바일/PC 모두 중앙 정렬 */}
                <div className="relative w-full py-2 md:py-4 px-2 md:px-0 overflow-x-auto md:overflow-visible">
                  <div className="flex flex-col items-center gap-0 md:gap-0 min-w-full md:min-w-0">
                    {rows.map((row, rowIndex) => (
                      <div 
                        key={rowIndex}
                        className="flex items-center justify-center relative h-[48px] md:h-[80px] lg:h-[96px] xl:h-[104px] w-full md:w-auto"
                      >
                        <div className="relative" style={{ width: `${Math.max(row.length * 16 + 28, 180)}px`, height: '100%' }}>
                          {row.map((card, cardIndex) => {
                            const isSelected = selectedCards.find(c => c.id === card.id);
                            const selectIndex = selectedCards.findIndex(c => c.id === card.id);
                            
                            return (
                              <motion.button
                                key={card.id}
                                onClick={() => handleSelectCard(card)}
                                disabled={!isSelected && selectedCards.length >= 3}
                                whileTap={!isSelected && selectedCards.length < 3 ? { scale: 0.92 } : {}}
                                className={`
                                  absolute flex-shrink-0 w-[28px] h-[42px] md:w-[42px] md:h-[62px] lg:w-[48px] lg:h-[72px] xl:w-[52px] xl:h-[78px]
                                  rounded-sm md:rounded-md overflow-hidden transition-all duration-200
                                  border border-white/20
                                  ${isSelected 
                                    ? "ring-2 md:ring-3 ring-primary ring-offset-1 ring-offset-background scale-110 z-50" 
                                    : "z-0 hover:border-white/40"}
                                  ${!isSelected && selectedCards.length >= 3 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                `}
                                style={{
                                  left: `${cardIndex * 16}px`,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                }}
                              >
                                {/* 카드 뒷면 */}
                                <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-900 to-primary/40 flex items-center justify-center relative">
                                  <div className="absolute inset-1 border border-primary/30 rounded-[2px]" />
                                  <Sparkles className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-primary/40 relative z-10" />
                                </div>
                                
                                {/* 선택 스티커 */}
                                {isSelected && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-primary/30 backdrop-blur-[1px]">
                                    <div className="text-white font-bold text-xs md:text-sm">
                                      {selectIndex + 1}
                                    </div>
                                  </div>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
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
                      disabled={isLoading}
                      className="w-full max-w-md h-12 md:h-16 text-base md:text-xl font-bold rounded-xl md:rounded-2xl shadow-2xl shadow-primary/40 animate-bounce"
                    >
                      {isLoading ? "해석 중..." : "해석하기"} <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
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
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs md:text-sm font-semibold text-white">{card.korName}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">{card.arcana}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 에러 상태 */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm md:text-base text-red-200 font-semibold">해석에 실패했습니다</p>
                        <p className="text-xs md:text-sm text-red-300 whitespace-pre-line">{error.message}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={getInterpretation}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full text-red-400 border-red-400/50 hover:bg-red-500/10"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      다시 시도
                    </Button>
                  </motion.div>
                )}

                {/* 해석 결과 */}
                {interpretation && !error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6"
                  >
                    <div>
                      <h3 className="text-lg md:text-2xl font-bold text-white mb-4">타로 해석</h3>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-sm md:text-base text-white/90 leading-relaxed whitespace-pre-wrap">
                          {processAIContent(interpretation)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={saveTarot}
                        disabled={isSaving || isSaved}
                        className="w-full"
                      >
                        {isSaved ? "저장됨" : isSaving ? "저장 중..." : "결과 저장하기"}
                      </Button>
                      <Button 
                        onClick={resetTarot}
                        variant="outline"
                        className="w-full"
                      >
                        다시 상담받기
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* 로딩 상태 */}
                {isLoading && (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
