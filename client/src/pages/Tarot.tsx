import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import tarotData from "@/lib/tarot-data.json";

interface TarotCard {
  id: number;
  name: string;
  korName: string;
  arcana: string;
  image: string;
}

export default function Tarot() {
  const [question, setQuestion] = useState("");
  const [step, setStep] = useState<"input" | "shuffle" | "result">("input");
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);

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

  const getInterpretation = async (cards: TarotCard[]) => {
    setIsLoading(true);
    setStep("result");
    try {
      // API 호출 경로를 절대 경로로 명시하거나 환경 변수를 고려할 수 있도록 설정
      const response = await fetch("/api/tarot", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          question: question.trim(), 
          cards: cards.map(c => ({ id: c.id, name: c.name, korName: c.korName })) 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 구체적인 에러 로그를 콘솔에 출력 (디버깅용)
        console.error("--- AI Tarot API Error Details ---");
        console.error("Status:", response.status);
        console.error("Error Data:", data);
        console.error("----------------------------------");
        
        throw new Error(data.details || data.error || `Server Error (${response.status})`);
      }

      if (!data.interpretation) {
        throw new Error("해석 데이터가 비어 있습니다.");
      }

      setInterpretation(data.interpretation);
    } catch (error: any) {
      console.error("[Tarot Page Error]:", error);
      toast.error(`해석을 가져오는 중 오류가 발생했습니다. 개발자 도구 콘솔을 확인해 주세요.`);
      // 에러 발생 시 셔플 단계로 돌아가지 않고 결과창에서 에러 상태를 보여주거나 리셋 버튼 제공
      setInterpretation("오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetTarot = () => {
    setQuestion("");
    setStep("input");
    setSelectedCards([]);
    setInterpretation("");
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
                className="w-full h-16 rounded-2xl text-lg font-bold gap-2 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
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
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
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
                        <span className="text-sm font-medium">AI 상담사가 카드를 읽고 있습니다...</span>
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
                      <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
                        {interpretation}
                      </div>
                    </motion.div>
                  )}
                </div>

                {!isLoading && (
                  <Button 
                    onClick={resetTarot}
                    variant="outline"
                    className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 gap-2"
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
