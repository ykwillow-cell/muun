import { useState } from "react";
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
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!API_KEY) {
        throw new Error("API_KEY_MISSING");
      }

      const prompt = `
당신은 "신비롭고 다정한 전문 타로 상담사"입니다. 
사용자의 고민에 대해 뽑힌 3장의 타로 카드를 바탕으로 깊이 있고 따뜻한 해석을 제공해 주세요.

【사용자 질문】
${question}

【선택된 카드】
1. 과거/상황: ${selectedCards[0].korName} (${selectedCards[0].name})
2. 현재/도전: ${selectedCards[1].korName} (${selectedCards[1].name})
3. 미래/조언: ${selectedCards[2].korName} (${selectedCards[2].name})

【해석 가이드라인】
- 각 카드의 상징적 의미를 질문과 연결하여 해석
- 과거→현재→미래의 흐름으로 이야기를 전개
- 구체적이고 실용적인 조언 포함
- 희망적이면서도 현실적인 톤 유지
- 800~1200자 분량으로 작성
- 마크다운 형식 사용 금지, 순수 텍스트로 작성
`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2048,
          },
        }
      );

      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
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
                          <div className="w-full h-full bg-primary/20 rounded-lg flex flex-col items-center justify-center text-center p-2 border border-primary/30">
                            <span className="text-[8px] md:text-xs text-primary font-bold mb-1 uppercase">{i === 0 ? "과거" : i === 1 ? "현재" : "미래"}</span>
                            <span className="text-[10px] md:text-sm font-bold text-white leading-tight">{selectedCards[i].korName}</span>
                          </div>
                        </motion.div>
                      ) : (
                        <span className="text-white/10 text-2xl md:text-3xl font-bold">{i + 1}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* 카드 셔플 덱 */}
                <div className="relative py-4 flex items-center justify-center">
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-4 max-w-4xl">
                    {shuffledDeck.slice(0, 22).map((card, index) => {
                      const isSelected = selectedCards.find(c => c.id === card.id);
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: isSelected ? 0 : 1,
                            y: isSelected ? -20 : 0,
                            scale: isSelected ? 0.8 : 1
                          }}
                          whileHover={{ y: -8, scale: 1.05, zIndex: 50 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSelectCard(card)}
                          className={`relative w-full min-w-[56px] md:min-w-[80px] aspect-[2/3] rounded-lg md:rounded-xl cursor-pointer transition-all duration-300 ${
                            isSelected ? "pointer-events-none" : "opacity-100"
                          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-purple-900/40 border border-primary/30 rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden shadow-lg backdrop-blur-sm">
                            <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-primary/30 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 md:w-3 md:h-3 bg-primary/20 rounded-full" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* 하단 버튼 영역 */}
                <div className={`flex justify-center transition-all duration-500 ${selectedCards.length === 3 ? "scale-105" : "opacity-50"}`}>
                  <Button
                    size="lg"
                    disabled={selectedCards.length !== 3 || isLoading}
                    onClick={getInterpretation}
                    className={`min-h-[48px] md:min-h-[56px] px-8 md:px-12 rounded-xl text-base md:text-lg font-bold gap-2 shadow-2xl transition-all duration-500 ${
                      selectedCards.length === 3 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-white/10 text-white/30"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        운명의 흐름을 읽는 중...
                      </>
                    ) : (
                      <>
                        해석하기 <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {selectedCards.map((card, i) => (
                    <div key={i} className="space-y-2 text-center">
                      <div className="aspect-[2/3] relative group overflow-hidden rounded-xl md:rounded-2xl border border-primary/30 shadow-xl transition-all duration-500 hover:border-primary/60">
                        <img 
                          src={card.image} 
                          alt={card.korName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                        <div className="absolute bottom-0 left-0 w-full p-2 md:p-3 text-center">
                          <div className="text-[8px] md:text-xs text-primary font-bold uppercase tracking-wider mb-0.5">
                            {i === 0 ? "과거" : i === 1 ? "현재" : "미래"}
                          </div>
                          <div className="text-[10px] md:text-sm font-bold text-white truncate">
                            {card.korName}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 border border-white/10 p-5 md:p-8 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  
                  {isLoading ? (
                    <div className="py-10 md:py-16 flex flex-col items-center justify-center space-y-6">
                      <div className="relative">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center"
                        >
                          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-primary animate-pulse" />
                        </motion.div>
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 w-20 h-20 md:w-28 md:h-28 rounded-full border-t-2 border-primary/60"
                        />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-lg md:text-xl font-bold text-white animate-pulse">운명의 흐름을 읽는 중입니다</h3>
                        <p className="text-sm text-muted-foreground">
                          카드가 들려주는 신비로운 이야기를 정리하고 있어요.
                        </p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-10 space-y-5">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg md:text-xl font-bold text-white">해석을 가져오지 못했습니다</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {EMOTIONAL_ERROR_MESSAGES[error.type]}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={getInterpretation}
                        className="border-white/10 hover:bg-white/5 min-h-[44px] rounded-xl"
                      >
                        다시 시도하기
                      </Button>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <div className="text-sm md:text-base leading-relaxed text-white/90 whitespace-pre-wrap">
                        {interpretation}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-4 md:gap-6">
                  <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center w-full">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={resetTarot}
                      className="min-h-[48px] px-6 rounded-xl border-white/10 hover:bg-white/5 gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      다시 상담하기
                    </Button>
                    {!error && !isLoading && (
                      <Button
                        size="lg"
                        onClick={handleSaveReading}
                        disabled={isSaved || isSaving}
                        className="min-h-[48px] px-6 rounded-xl gap-2 shadow-lg"
                      >
                        {isSaving ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        {isSaved ? "저장 완료" : "상담 기록 저장하기"}
                      </Button>
                    )}
                  </div>
                  
                  {/* 기록 저장 안내 문구 */}
                  {!error && !isLoading && !isSaved && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 max-w-md"
                    >
                      <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs md:text-sm font-bold text-primary">기록을 저장하고 나의 운세 흐름을 확인해 보세요!</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
                          저장된 결과는 '내 타로 기록'에서 언제든 다시 볼 수 있습니다.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
