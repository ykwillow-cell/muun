import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, ChevronRight, AlertCircle, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import axios from "axios";
import tarotData from "@/lib/tarot-data.json";
import { saveTarotReading } from "@/lib/tarot-db";
import { trackCustomEvent } from "@/lib/ga4";

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
2. 현재/조언: ${selectedCards[1].korName} (${selectedCards[1].name})
3. 미래/결과: ${selectedCards[2].korName} (${selectedCards[2].name})

【해석 방식】
1. 3장의 카드를 개별적으로 설명하지 말고, 하나의 흐름 있는 이야기로 유기적으로 연결해 주세요.
2. "당신의 현재 상황에 비추어 볼 때..." 같은 표현으로 사용자의 고민과 직접 연결해 주세요.
3. 과거 → 현재 → 미래의 흐름을 명확하게 보여주되, 마치 한 편의 이야기를 읽는 듯한 느낌을 주세요.
4. 신비로우면서도 따뜻하고 다정한 말투를 유지해 주세요.
5. 마지막에는 사용자를 진심으로 응원하는 메시지로 마무리해 주세요.

【형식】
- 마크다운 형식을 사용하여 중요한 부분은 **굵게** 표시해 주세요.
- 문단을 명확히 나누어 가독성을 높여 주세요.
- 너무 길지 않되, 충분히 깊이 있는 해석을 제공해 주세요.`;

      await new Promise(r => setTimeout(r, 3000));

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7
          }
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("EMPTY_RESPONSE");
      }

      setInterpretation(text);
    } catch (err: any) {
      console.error("❌ AI Tarot Error:", err);
      
      let errorType: "quota" | "api" | "network" | "unknown" = "unknown";
      const status = err.response?.status;
      const errorMsg = err.response?.data?.error?.message || err.message || "";

      if (status === 429 || errorMsg.includes("quota") || errorMsg.includes("exhausted")) {
        errorType = "quota";
      } else if (status === 404 || status === 400 || errorMsg.includes("API")) {
        errorType = "api";
      } else if (err.code === "ERR_NETWORK") {
        errorType = "network";
      }

      setError({
        type: errorType,
        message: errorMsg,
      });
      toast.error(EMOTIONAL_ERROR_MESSAGES[errorType]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReading = async () => {
    if (!interpretation || selectedCards.length !== 3) {
      toast.error("저장할 수 없습니다.");
      return;
    }

    setIsSaving(true);
    try {
      await saveTarotReading({
        timestamp: Date.now(),
        question,
        selectedCards: selectedCards.map(card => ({
          id: card.id,
          name: card.name,
          korName: card.korName,
          image: card.image
        })),
        interpretation
      });
      setIsSaved(true);
      toast.success("상담 기록이 저장되었습니다!");
    } catch (error) {
      console.error("기록 저장 실패:", error);
      toast.error("기록 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetTarot = () => {
    setQuestion("");
    setStep("input");
    setSelectedCards([]);
    setInterpretation("");
    setError(null);
    setIsSaved(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="container max-w-4xl mx-auto px-4 pt-12 md:pt-20">
        <div className="text-center space-y-4 mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium tracking-wider text-primary uppercase">AI Tarot Reading</span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">AI 타로 상담소</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base px-4">
            마음을 가다듬고 고민을 떠올려 보세요. <br className="hidden md:block" />
            신비로운 타로 카드가 당신의 길을 안내해 줄 것입니다.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-6 md:p-12 rounded-[2.5rem] space-y-8"
            >
              <div className="space-y-4">
                <label className="text-lg font-bold text-white block">어떤 고민이 있으신가요?</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="예: 올해 연애운이 궁금해요. / 이직을 고민 중인데 잘 될까요?"
                  className="w-full min-h-[150px] bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  disabled={isLoading}
                />
              </div>
              <Button 
                onClick={handleStart}
                disabled={isLoading}
                className="w-full h-16 rounded-2xl text-lg font-bold gap-2 shadow-[0_0_20px_rgba(255,215,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                상담 시작하기 <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          )}

          {step === "shuffle" && (
            <motion.div
              key="shuffle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 md:space-y-12"
            >
              <div className="text-center space-y-2">
                <h2 className="text-xl md:text-2xl font-bold text-primary">카드를 3장 선택해 주세요</h2>
                <p className="text-muted-foreground text-xs md:text-sm">가장 마음이 끌리는 카드를 순서대로 클릭하세요. ({selectedCards.length}/3)</p>
              </div>

              {/* 선택된 카드 미리보기 섹션 */}
              <div className="flex justify-center gap-3 md:gap-8">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-20 h-32 md:w-32 md:h-48 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden bg-white/5 relative">
                    {selectedCards[i] ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        className="w-full h-full p-1"
                      >
                        <div className="w-full h-full bg-primary/20 rounded-xl flex flex-col items-center justify-center text-center p-2 border border-primary/30">
                          <span className="text-[8px] md:text-xs text-primary font-bold mb-1 uppercase">{i === 0 ? "과거" : i === 1 ? "현재" : "미래"}</span>
                          <span className="text-[10px] md:text-sm font-bold text-white leading-tight">{selectedCards[i].korName}</span>
                        </div>
                      </motion.div>
                    ) : (
                      <span className="text-white/10 text-3xl md:text-4xl font-bold">{i + 1}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* 카드 셔플 덱 - 정돈된 격자 레이아웃으로 수정 */}
              <div className="relative py-4 md:py-8 flex items-center justify-center">
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-6 max-w-4xl px-4">
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
                        whileHover={{ y: -10, scale: 1.05, zIndex: 50 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelectCard(card)}
                        className={`relative w-full min-w-[60px] md:min-w-[100px] aspect-[2/3] rounded-xl cursor-pointer transition-all duration-300 ${
                          isSelected ? "pointer-events-none" : "opacity-100"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-purple-900/40 border border-primary/30 rounded-xl flex items-center justify-center overflow-hidden shadow-lg backdrop-blur-sm">
                          <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 md:w-8 md:h-8 border-2 border-primary/30 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 md:w-4 md:h-4 bg-primary/20 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* 하단 버튼 영역 */}
              <div className={`flex justify-center transition-all duration-500 ${selectedCards.length === 3 ? "scale-110" : "opacity-50"}`}>
                <Button
                  size="lg"
                  disabled={selectedCards.length !== 3 || isLoading}
                  onClick={getInterpretation}
                  className={`h-16 px-12 rounded-2xl text-lg font-bold gap-2 shadow-2xl transition-all duration-500 ${
                    selectedCards.length === 3 
                      ? "bg-primary text-primary-foreground animate-bounce-subtle" 
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
              className="space-y-8"
            >
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {selectedCards.map((card, i) => (
                  <div key={i} className="space-y-3 text-center">
                    <div className="aspect-[2/3] relative group overflow-hidden rounded-2xl border border-primary/30 shadow-2xl transition-all duration-500 hover:border-primary/60">
                      <img 
                        src={card.image} 
                        alt={card.korName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                      <div className="absolute bottom-0 left-0 w-full p-2 md:p-4 text-center">
                        <div className="text-[8px] md:text-xs text-primary font-bold uppercase tracking-wider mb-0.5">
                          {i === 0 ? "과거" : i === 1 ? "현재" : "미래"}
                        </div>
                        <div className="text-[10px] md:text-base font-black text-white truncate">
                          {card.korName}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-panel p-6 md:p-12 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                
                {isLoading ? (
                  <div className="py-12 md:py-20 flex flex-col items-center justify-center space-y-8">
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center"
                      >
                        <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-primary animate-pulse" />
                      </motion.div>
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 rounded-full border-t-2 border-primary/60"
                      />
                    </div>
                    <div className="text-center space-y-3">
                      <h3 className="text-xl md:text-2xl font-bold text-white animate-pulse">운명의 흐름을 읽는 중입니다</h3>
                      <p className="text-muted-foreground text-sm md:text-base">
                        카드가 들려주는 신비로운 이야기를 정리하고 있어요.<br />
                        잠시만 기다려 주세요...
                      </p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                      <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">해석을 가져오지 못했습니다</h3>
                      <p className="text-muted-foreground whitespace-pre-line text-sm">
                        {EMOTIONAL_ERROR_MESSAGES[error.type]}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={getInterpretation}
                      className="border-white/10 hover:bg-white/5"
                    >
                      다시 시도하기
                    </Button>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <div className="text-base md:text-xl leading-relaxed text-white/90 whitespace-pre-wrap font-medium">
                      {interpretation}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-col md:flex-row gap-4 justify-center w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={resetTarot}
                    className="h-14 px-8 rounded-xl border-white/10 hover:bg-white/5 gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    다시 상담하기
                  </Button>
                  {!error && !isLoading && (
                    <Button
                      size="lg"
                      onClick={handleSaveReading}
                      disabled={isSaved || isSaving}
                      className="h-14 px-8 rounded-xl gap-2 shadow-lg"
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
                
                {/* 기록 저장 안내 문구 추가 */}
                {!error && !isLoading && !isSaved && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10 max-w-md"
                  >
                    <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-primary">기록을 저장하고 나의 운세 흐름을 확인해 보세요!</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        저장된 결과는 '내 타로 기록'에서 언제든 다시 볼 수 있으며, 과거의 고민과 현재의 상황을 비교하며 운의 변화를 추적할 수 있습니다.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
