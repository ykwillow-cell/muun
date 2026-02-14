import { useState, useEffect } from 'react';
import { useCanonical } from '@/lib/use-canonical';
import { setTarotOGTags } from '@/lib/og-tags';
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, ChevronRight, AlertCircle, ArrowRight, Info, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Link } from "wouter";
import axios from "axios";
import tarotData from "@/lib/tarot-data.json";
import { saveTarotReading } from "@/lib/tarot-db";
import { trackCustomEvent } from "@/lib/ga4";
import TarotContent from "@/components/TarotContent";

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

  const getInterpretation = async () => {
    if (isLoading) return;
    if (selectedCards.length !== 3) {
      toast.error("카드 3장을 모두 선택해 주세요.");
      return;
    }

    trackCustomEvent("check_fortune_result", {
      fortune_type: "AI타로",
      question_length: question.length
    });

    setIsLoading(true);
    setStep("result");
    setError(null);
    setInterpretation("");

    try {
      // 백엔드 API 엔드포인트 호출
      const response = await axios.post(
        "/api/tarot",
        {
          question,
          cards: selectedCards,
        }
      );

      const text = response.data.interpretation;
      if (!text) {
        throw new Error("EMPTY_RESPONSE");
      }

      setInterpretation(text);
    } catch (err: any) {
      console.error("Tarot interpretation error:", err);
      
      let errorType: ErrorState["type"] = "unknown";
      if (err.response?.status === 429) {
        errorType = "quota";
      } else if (err.response?.status) {
        errorType = "api";
      } else if (err.code === "ERR_NETWORK") {
        errorType = "network";
      }
      
      setError({
        type: errorType,
        message: err.message || "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReading = async () => {
    if (isSaved || isSaving) return;
    setIsSaving(true);
    
    try {
      await saveTarotReading({
        question,
        cards: selectedCards,
        interpretation,
        createdAt: new Date().toISOString(),
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

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
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
          <h1 className="text-lg md:text-xl font-bold text-white">AI 타로 상담소</h1>
        </div>
      </header>

      <main className="relative z-10 px-4 py-6 md:py-8">
        <div className={commonMaxWidth}>
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-6 md:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[11px] md:text-xs font-bold tracking-widest text-primary uppercase">AI Tarot Reading</span>
            </motion.div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">신비로운 타로의 세계</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
              마음을 가다듬고 고민을 떠올려 보세요.<br className="hidden md:block" />
              타로 카드가 당신의 길을 안내해 줄 것입니다.
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
                className="space-y-6 md:space-y-8"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-primary">카드를 3장 선택해 주세요</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">가장 마음이 끌리는 카드를 순서대로 클릭하세요. ({selectedCards.length}/3)</p>
                </div>

                {/* 선택된 카드 미리보기 섹션 */}
                <div className="flex justify-center gap-3 md:gap-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-20 h-28 md:w-28 md:h-40 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden bg-white/5 relative">
                      {selectedCards[i] ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                          className="w-full h-full p-1"
                        >
                          <img 
                            src={selectedCards[i].image} 
                            alt={selectedCards[i].korName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </motion.div>
                      ) : (
                        <div className="text-center text-muted-foreground text-xs">
                          <div className="text-lg mb-1">?</div>
                          <div>카드 {i + 1}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 카드 그리드 */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
                  {shuffledDeck.map((card) => {
                    const isSelected = selectedCards.find(c => c.id === card.id);
                    return (
                      <motion.button
                        key={card.id}
                        onClick={() => handleSelectCard(card)}
                        disabled={selectedCards.length >= 3 && !isSelected}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative rounded-lg overflow-hidden transition-all ${
                          isSelected ? 'ring-2 ring-primary shadow-[0_0_10px_rgba(255,215,0,0.3)]' : ''
                        } ${selectedCards.length >= 3 && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {isSelected ? (
                          <img 
                            src={card.image} 
                            alt={card.korName}
                            className="w-full aspect-[3/4] object-cover"
                          />
                        ) : (
                          <div className="w-full aspect-[3/4] bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center rounded-lg border border-primary/30">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-primary mb-1">?</div>
                              <div className="text-xs text-primary/70">Tarot</div>
                            </div>
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{selectedCards.findIndex(c => c.id === card.id) + 1}</span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {selectedCards.length === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button 
                      onClick={getInterpretation}
                      disabled={isLoading}
                      className="w-full min-h-[48px] md:min-h-[56px] rounded-xl text-base md:text-lg font-bold gap-2 shadow-[0_0_20px_rgba(255,215,0,0.2)] disabled:opacity-50"
                    >
                      {isLoading ? "해석 중..." : "해석하기"} <ArrowRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-6 md:space-y-8"
              >
                {/* 선택된 카드 표시 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-primary mb-4">당신이 선택한 카드</h3>
                    <div className="flex justify-center gap-3 md:gap-6">
                      {selectedCards.map((card, idx) => (
                        <div key={card.id} className="text-center">
                          <img 
                            src={card.image} 
                            alt={card.korName}
                            className="w-16 h-24 md:w-20 md:h-32 object-cover rounded-lg mb-2"
                          />
                          <div className="text-xs md:text-sm text-muted-foreground">
                            <div className="font-bold text-white">{card.korName}</div>
                            <div className="text-[10px] md:text-xs">{["과거", "현재", "미래"][idx]}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 로딩 상태 */}
                {isLoading && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-8 space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5 text-primary" />
                      </motion.div>
                      <span className="text-sm md:text-base text-muted-foreground">타로의 메시지를 받아오는 중...</span>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                )}

                {/* 에러 상태 */}
                {error && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 md:p-8"
                  >
                    <div className="flex gap-4">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <h4 className="font-bold text-red-400">상담 중 오류가 발생했습니다</h4>
                        <p className="text-sm text-red-300/80">{EMOTIONAL_ERROR_MESSAGES[error.type]}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        setStep("shuffle");
                        setError(null);
                      }}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      다시 시도하기
                    </Button>
                  </motion.div>
                )}

                {/* 해석 결과 */}
                {interpretation && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-8 space-y-6"
                  >
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-primary mb-4">타로의 메시지</h3>
                      <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed text-foreground whitespace-pre-wrap">
                        {interpretation}
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
        </div>
      </main>

      <Helmet>
        <title>AI 타로 상담소 | 무운(MUUN) - 온라인 운세</title>
        <meta name="description" content="AI 타로 상담사가 당신의 고민을 해석해 드립니다. 신비로운 타로 카드로 미래를 엿보세요." />
        <meta name="keywords" content="타로, 타로 상담, AI 타로, 운세, 타로 해석" />
      </Helmet>
    </div>
  );
}
