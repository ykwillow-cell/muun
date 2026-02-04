import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";
import tarotData from "@/lib/tarot-data.json";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyAZwrh_Gt2iwQYiPDTzsWLyPgpuHA3WikI";

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
  retryCount: number;
}

// 감성적인 에러 메시지 매핑
const EMOTIONAL_ERROR_MESSAGES: Record<string, string> = {
  quota: "신비로운 기운이 잠시 흩어졌습니다.\n잠시 후 다시 카드를 뽑아주세요.",
  api: "카드의 목소리가 아직 명확하지 않습니다.\n다시 한 번 시도해 주세요.",
  network: "신령한 연결이 끊어졌습니다.\n인터넷 연결을 확인해 주세요.",
  unknown: "예상치 못한 신비로운 일이 발생했습니다.\n다시 시도해 주세요.",
};

export default function Tarot() {
  const [question, setQuestion] = useState("");
  const [step, setStep] = useState<"input" | "shuffle" | "result">("input");
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [error, setError] = useState<ErrorState | null>(null);
  const [retryCountdown, setRetryCountdown] = useState(0);

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

    if (newSelected.length === 3) {
      getInterpretation(newSelected);
    }
  };

  // Exponential Backoff를 이용한 재시도 로직
  const retryWithBackoff = async (
    fn: () => Promise<string>,
    maxRetries: number = 3,
    initialDelay: number = 2000
  ): Promise<string> => {
    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;

        // 429 에러인 경우만 재시도
        if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
          if (attempt < maxRetries - 1) {
            const delay = initialDelay * Math.pow(2, attempt);
            console.log(`⏳ 재시도 대기 중... (${delay / 1000}초)`);

            // UI에 카운트다운 표시
            for (let i = Math.ceil(delay / 1000); i > 0; i--) {
              setRetryCountdown(i);
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            setRetryCountdown(0);
          }
        } else {
          // 429가 아닌 다른 에러는 즉시 throw
          throw error;
        }
      }
    }

    throw lastError;
  };

  const getInterpretation = async (cards: TarotCard[]) => {
    setIsLoading(true);
    setStep("result");
    setError(null);
    setInterpretation("");

    try {
      if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
        throw new Error("API_KEY_NOT_SET");
      }

      // 3장의 카드를 하나의 프롬프트로 통합 (단 한 번의 API 호출)
      const prompt = `
너는 따뜻하고 통찰력 있는 타로 마스터야. 
사용자의 고민에 대해 뽑힌 3장의 타로 카드를 종합해서 하나의 운세로 해석해 줘.

[사용자 질문]
${question}

[선택된 카드 (3장 종합 해석)]
1. 과거/상황: ${cards[0].korName} (${cards[0].name})
2. 현재/조언: ${cards[1].korName} (${cards[1].name})
3. 미래/결과: ${cards[2].korName} (${cards[2].name})

[해석 가이드]
- 너는 신비로우면서도 다정한 전문 타로 상담사야. 
- 사용자의 마음을 어루만져주는 따뜻한 말투를 사용해줘.
- 3장의 카드를 종합해서 하나의 흐름 있는 이야기로 풀어내줘.
- 각 카드의 상징과 질문의 연관성을 깊이 있게 통찰해줘.
- 가독성을 위해 마크다운 형식을 사용하여 문단을 나누고 중요한 부분은 강조해줘.
- 마지막에는 사용자를 진심으로 응원하는 따뜻한 한마디를 덧붙여줘.
`;

      // Exponential Backoff와 함께 API 호출 (재시도 로직 포함)
      const result = await retryWithBackoff(async () => {
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        // gemini-1.5-flash 사용 (할당량이 더 넉넉함)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const response = await model.generateContent(prompt);
        const text = response.text();

        if (!text) {
          throw new Error("EMPTY_RESPONSE");
        }

        return text;
      });

      setInterpretation(result);
      console.log("✅ AI Tarot: 해석 생성 성공");
    } catch (error: any) {
      console.error("❌ AI Tarot Error:", error);

      // 에러 타입 분류
      let errorType: "quota" | "api" | "network" | "unknown" = "unknown";
      let errorMessage = error.message || "알 수 없는 오류";

      if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
        errorType = "quota";
      } else if (error.message?.includes("API")) {
        errorType = "api";
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        errorType = "network";
      }

      setError({
        type: errorType,
        message: errorMessage,
        retryCount: 0,
      });

      setInterpretation("");
      toast.error(EMOTIONAL_ERROR_MESSAGES[errorType]);
    } finally {
      setIsLoading(false);
      setRetryCountdown(0);
    }
  };

  const resetTarot = () => {
    setQuestion("");
    setStep("input");
    setSelectedCards([]);
    setInterpretation("");
    setError(null);
    setRetryCountdown(0);
  };

  const handleRetry = () => {
    if (selectedCards.length === 3) {
      getInterpretation(selectedCards);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="container max-w-4xl mx-auto px-4 pt-12 md:pt-20">
        <div className="text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium tracking-wider text-primary uppercase">AI Tarot Reading</span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">AI 타로 상담소</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
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
              className="glass-panel p-8 md:p-12 rounded-[2.5rem] space-y-8"
            >
              <div className="space-y-4">
                <label className="text-lg font-bold text-white block">어떤 고민이 있으신가요?</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="예: 올해 연애운이 궁금해요. / 이직을 고민 중인데 잘 될까요?"
                  className="w-full min-h-[150px] bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:outline-none focus:border-primary/50 transition-colors resize-none"
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
              className="space-y-12"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-primary">카드를 3장 선택해 주세요</h2>
                <p className="text-muted-foreground">가장 마음이 끌리는 카드를 순서대로 클릭하세요. ({selectedCards.length}/3)</p>
              </div>

              <div className="relative py-8 flex items-center justify-center">
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-3xl">
                  {shuffledDeck.slice(0, 21).map((card, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -15, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectCard(card)}
                      className={`relative w-16 h-28 md:w-24 md:h-40 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedCards.find(c => c.id === card.id) ? "opacity-0 pointer-events-none" : "opacity-100"
                      }`}
                      disabled={isLoading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-purple-900/40 border border-primary/30 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                        <div className="w-full h-full border-2 border-primary/10 m-1 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-primary/30" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-4 md:gap-8">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-20 h-32 md:w-32 md:h-52 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center relative bg-white/5">
                    {selectedCards[i] ? (
                      <motion.div
                        initial={{ rotateY: 180, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        className="w-full h-full bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/30"
                      >
                        <span className="text-[10px] md:text-xs font-bold text-primary text-center px-2">{selectedCards[i].korName}</span>
                      </motion.div>
                    ) : (
                      <span className="text-2xl font-bold text-white/10">{i + 1}</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-3 gap-4 md:gap-8">
                {selectedCards.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ rotateY: 180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                    className="space-y-4"
                  >
                    <div className="aspect-[2/3.5] rounded-2xl overflow-hidden border border-primary/30 shadow-[0_0_30px_rgba(255,215,0,0.1)] bg-white/5">
                      <img 
                        src={card.image} 
                        alt={card.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 300'%3E%3Crect fill='%23333' width='200' height='300'/%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] md:text-xs text-primary font-bold uppercase tracking-widest block mb-1">
                        {index === 0 ? "Past / Situation" : index === 1 ? "Present / Advice" : "Future / Result"}
                      </span>
                      <h3 className="text-sm md:text-lg font-bold text-white">{card.korName}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-background" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">AI 상담사의 해석</h2>
                  </div>

                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary animate-pulse mb-4">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium">
                          {retryCountdown > 0 
                            ? `신비로운 기운을 모으는 중... (${retryCountdown}초)`
                            : "AI 상담사가 카드를 읽고 있습니다..."}
                        </span>
                      </div>
                      <Skeleton className="h-4 w-full bg-white/5" />
                      <Skeleton className="h-4 w-[90%] bg-white/5" />
                      <Skeleton className="h-4 w-[95%] bg-white/5" />
                      <Skeleton className="h-4 w-[80%] bg-white/5" />
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="prose prose-invert max-w-none"
                    >
                      {error ? (
                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-3 text-purple-300 space-y-3">
                          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <div className="space-y-2">
                            <p className="font-bold whitespace-pre-line">{EMOTIONAL_ERROR_MESSAGES[error.type]}</p>
                            <Button 
                              onClick={handleRetry}
                              disabled={isLoading}
                              variant="outline"
                              className="mt-3 border-purple-500/30 hover:bg-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" /> 다시 시도하기
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
                          {interpretation}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {!isLoading && !error && (
                  <Button 
                    onClick={resetTarot}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="w-4 h-4" /> 다시 상담하기
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
