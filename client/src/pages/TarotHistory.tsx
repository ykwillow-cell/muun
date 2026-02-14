import { useState, useEffect } from "react";
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, Trash2, Calendar, HelpCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getAllTarotReadings, deleteTarotReading, type TarotReading } from "@/lib/tarot-db";
import { useLocation } from "wouter";

export default function TarotHistory() {
  useCanonical('/tarot-history');

  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReading, setSelectedReading] = useState<TarotReading | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    loadReadings();
  }, []);

  const loadReadings = async () => {
    setIsLoading(true);
    try {
      const data = await getAllTarotReadings();
      setReadings(data);
    } catch (error) {
      console.error("기록 로드 실패:", error);
      toast.error("기록을 불러올 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;

    if (confirm("이 기록을 삭제하시겠습니까?")) {
      try {
        await deleteTarotReading(id);
        setReadings(readings.filter(r => r.id !== id));
        if (selectedReading?.id === id) {
          setSelectedReading(null);
        }
        toast.success("기록이 삭제되었습니다.");
      } catch (error) {
        console.error("삭제 실패:", error);
        toast.error("기록 삭제에 실패했습니다.");
      }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}분 전`;
      }
      return `${hours}시간 전`;
    } else if (days === 1) {
      return "어제";
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="container max-w-6xl mx-auto px-4 pt-12 md:pt-20">
        {/* 헤더 */}
        <div className="text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium tracking-wider text-primary uppercase">My Tarot Records</span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">내 타로 기록</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            지난 상담 기록을 다시 살펴보세요. <br className="hidden md:block" />
            신비로운 카드의 메시지가 당신을 기다리고 있습니다.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : readings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-12 rounded-[2.5rem] text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">아직 저장된 타로 기록이 없습니다</h2>
              <p className="text-muted-foreground">지금 바로 상담을 시작해 보세요!</p>
            </div>
            <Button
              onClick={() => setLocation("/tarot")}
              className="px-8 h-12 rounded-2xl text-lg font-bold gap-2 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
            >
              <Sparkles className="w-5 h-5" />
              타로 상담 시작하기
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 기록 목록 */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">상담 기록 ({readings.length})</h2>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {readings.map((reading, index) => (
                    <motion.div
                      key={reading.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedReading(reading)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedReading?.id === reading.id
                          ? "bg-primary/20 border border-primary/50"
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-white truncate">{reading.question}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(reading.timestamp)}
                        </div>
                        <div className="flex gap-1">
                          {reading.selectedCards.slice(0, 3).map((card, i) => (
                            <div key={i} className="text-[10px] px-2 py-1 bg-primary/10 rounded text-primary font-bold truncate">
                              {card.korName}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 상세 보기 */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {selectedReading ? (
                    <motion.div
                      key={selectedReading.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="glass-panel p-8 md:p-12 rounded-[2.5rem] space-y-8"
                    >
                      {/* 헤더 */}
                      <div className="space-y-4 border-b border-white/10 pb-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <h2 className="text-2xl font-bold text-white">{selectedReading.question}</h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {new Date(selectedReading.timestamp).toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDelete(selectedReading.id)}
                            variant="outline"
                            size="sm"
                            className="border-red-500/30 hover:bg-red-500/10 text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* 카드 정보 */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">선택된 카드</h3>
                        <div className="grid grid-cols-3 gap-4">
                          {selectedReading.selectedCards.map((card, index) => (
                            <div key={index} className="space-y-3">
                              <div className="aspect-[2/3.5] rounded-xl overflow-hidden border border-primary/30 shadow-[0_0_30px_rgba(255,215,0,0.1)] bg-white/5">
                                <img
                                  src={card.image}
                                  alt={card.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 300'%3E%3Crect fill='%23333' width='200' height='300'/%3E%3C/svg%3E";
                                  }}
                                />
                              </div>
                              <div className="text-center">
                                <span className="text-[10px] text-primary font-bold uppercase tracking-widest block mb-1">
                                  {index === 0 ? "Past" : index === 1 ? "Present" : "Future"}
                                </span>
                                <h4 className="text-sm font-bold text-white">{card.korName}</h4>
                                <p className="text-xs text-muted-foreground">{card.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 해석 */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">AI 상담사의 해석</h3>
                        <div className="prose prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap text-base">
                          {selectedReading.interpretation}
                        </div>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex gap-3 pt-6 border-t border-white/10">
                        <Button
                          onClick={() => setLocation("/tarot")}
                          className="flex-1 h-12 rounded-xl text-lg font-bold gap-2 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                        >
                          <Sparkles className="w-5 h-5" />
                          새로운 상담 시작
                        </Button>
                        <Button
                          onClick={() => handleDelete(selectedReading.id)}
                          variant="outline"
                          className="border-red-500/30 hover:bg-red-500/10 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass-panel p-12 rounded-[2.5rem] flex items-center justify-center h-[600px]"
                    >
                      <div className="text-center space-y-4">
                        <p className="text-muted-foreground text-lg">왼쪽 목록에서 기록을 선택해 주세요</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 기록 저장 안내 문구 (하단 이동) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-3 p-6 rounded-[2rem] bg-white/5 border border-white/10 max-w-3xl mx-auto mt-12"
            >
              <Info className="w-5 h-5 text-primary/50 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-white/70">기록 저장 안내</p>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  무운은 사용자의 소중한 개인정보를 보호하기 위해 별도의 회원가입 없이 서비스를 제공합니다. 
                  타로 기록은 현재 사용 중인 브라우저의 <strong>로컬 저장소(Local Storage)</strong>에 안전하게 보관되며, 
                  브라우저를 닫아도 기록이 유지됩니다. 단, 브라우저 캐시를 삭제하거나 다른 기기를 사용하실 경우 기록이 보이지 않을 수 있으니 유의해 주세요.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
