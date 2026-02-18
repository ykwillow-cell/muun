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
      fortune_type: "AI타로",
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
                className="space-y-0"
              >
                {/* 스티키 헤더 - 선택 슬롯 */}
                <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm py-4 md:py-5 border-b border-white/10 -mx-4 px-4 md:-mx-6 md:px-6 mb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-primary">카드를 3장 선택해 주세요</h3>
                      <p className="text-sm text-muted-foreground">가장 마음이 끌리는 카드를 순서대로 클릭하세요</p>
                    </div>
                    {/* 선택된 카드 슬롯 - 상단 우측 */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex justify-end gap-2">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="w-12 h-16 md:w-14 md:h-20 rounded-lg border-2 border-dashed border-primary/40 flex items-center justify-center overflow-hidden bg-white/5 relative flex-shrink-0">
                            {selectedCards[i] ? (
                              <img 
                                src={selectedCards[i].image} 
                                alt={selectedCards[i].korName}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <div className="text-center text-muted-foreground text-xs">
                                <div className="text-lg font-bold text-primary/40">{i + 1}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selectedCards.length}/3 선택됨
                      </div>
                    </div>
                  </div>
                </div>

                {/* 카드 그리드 - 가로 방향 부채꼴 3단 배치 */}
                <div className="relative w-full h-[450px] sm:h-[500px] md:h-[550px] flex items-end justify-center pb-8">
                  <div className="relative w-full max-w-4xl h-full flex items-end justify-center">
                    {shuffledDeck.slice(0, 22).map((card, index) => {
                      const isSelected = selectedCards.find(c => c.id === card.id);
                      const selectedIndex = selectedCards.findIndex(c => c.id === card.id);
                      
                      // 3단 가로 배치 (좌우로 펼쳐짐)
                      const cardsPerLayer = [8, 7, 7]; // 각 단 카드 개수
                      const layerCumulative = [0, 8, 15]; // 누적 인덱스
                      
                      let layer = 0;
                      let colInLayer = index;
                      for (let i = 0; i < layerCumulative.length; i++) {
                        if (index >= layerCumulative[i] && index < (layerCumulative[i] + cardsPerLayer[i])) {
                          layer = i;
                          colInLayer = index - layerCumulative[i];
                          break;
                        }
                      }
                      
                      // 가로 방향 부채꼴 배치: 중심축이 화면 하단 중앙
                      const layerStartAngles = [-Math.PI * 0.25, -Math.PI * 0.22, -Math.PI * 0.2];
                      const layerAngleRanges = [Math.PI * 0.5, Math.PI * 0.44, Math.PI * 0.4];
                      const layerStartAngle = layerStartAngles[layer];
                      const layerAngleRange = layerAngleRanges[layer];
                      const anglePerCard = layerAngleRange / (cardsPerLayer[layer] - 1);
                      const angle = layerStartAngle + anglePerCard * colInLayer;
                      
                      // 반지름 (각 단마다 다름 - 화면 하단에서 위로)
                      const baseRadii = [140, 160, 180];
                      let radius = baseRadii[layer];
                      if (typeof window !== 'undefined') {
                        if (window.innerWidth < 640) {
                          radius = baseRadii[layer] * 0.6;
                        } else if (window.innerWidth < 1024) {
                          radius = baseRadii[layer] * 0.75;
                        }
                      }
                      
                      // X 오프셋 (3단을 매우 가깝게 배치 - 위아래 겹침)
                      const layerYOffsets = [0, -25, -50];
                      const layerYOffset = layerYOffsets[layer];
                      
                      const centerX = 0;
                      const centerY = 0;
                      const x = centerX + radius * Math.cos(angle);
                      const y = centerY + radius * Math.sin(angle) + layerYOffset;
                      
                      // 선택된 카드는 슬롯으로 날아감
                      const slotX = (selectedIndex - 1) * 70 - 70;
                      const slotY = -350;
                      
                      return (
                        <motion.button
                          key={card.id}
                          onClick={() => handleSelectCard(card)}
                          disabled={selectedCards.length >= 3 && !isSelected}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            x: isSelected ? slotX : x,
                            y: isSelected ? slotY : y,
                            rotate: isSelected ? 0 : angle * (180 / Math.PI),
                            zIndex: isSelected ? 100 : 10,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: isSelected ? 200 : 100,
                            damping: isSelected ? 20 : 15,
                            delay: index * 0.01,
                          }}
                          whileHover={!isSelected ? { 
                            scale: 1.12,
                            zIndex: 50,
                            y: y - 30,
                            boxShadow: "0 0 30px rgba(255,215,0,0.6)",
                            transition: { duration: 0.2 }
                          } : {}}
                          whileTap={{ scale: 0.95 }}
                          className={`absolute w-14 h-20 sm:w-16 sm:h-24 md:w-20 md:h-28 rounded-lg overflow-hidden transition-all ${
                            isSelected ? 'ring-2 ring-primary shadow-[0_0_25px_rgba(255,215,0,0.7)]' : 'ring-1 ring-white/10'
                          } ${selectedCards.length >= 3 && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:ring-primary/60'}`}
                        >
                          {isSelected ? (
                            <img 
                              src={card.image} 
                              alt={card.korName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 border border-primary/60 relative overflow-hidden flex items-center justify-center">
                              {/* 카드 뒷면 - 원형 신비 패턴 */}
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                                <defs>
                                  <pattern id={`mystical-pattern-${card.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                    {/* 동심원 */}
                                    <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(255,215,0,0.2)" strokeWidth="0.8"/>
                                    <circle cx="20" cy="20" r="10" fill="none" stroke="rgba(255,215,0,0.25)" strokeWidth="0.8"/>
                                    <circle cx="20" cy="20" r="5" fill="none" stroke="rgba(255,215,0,0.3)" strokeWidth="0.8"/>
                                    {/* 중앙 점 */}
                                    <circle cx="20" cy="20" r="1.5" fill="rgba(255,215,0,0.4)"/>
                                    {/* 호형 선 */}
                                    <path d="M5,20 Q20,10 35,20" fill="none" stroke="rgba(255,215,0,0.15)" strokeWidth="0.6"/>
                                    <path d="M5,20 Q20,30 35,20" fill="none" stroke="rgba(255,215,0,0.15)" strokeWidth="0.6"/>
                                  </pattern>
                                </defs>
                                <rect width="100" height="100" fill={`url(#mystical-pattern-${card.id})`} />
                              </svg>
                              {/* 중앙 장식 */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-primary/50 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
                                </div>
                              </div>
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent flex items-center justify-center">
                              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-background font-bold text-xs">{selectedCards.findIndex(c => c.id === card.id) + 1}</span>
                              </div>
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

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
