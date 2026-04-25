import { useState } from "react";
import { useCanonical } from "@/lib/use-canonical";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RefreshCw,
  ChevronLeft,
  Scroll,
  Globe,
  Flame,
  BookOpen,
  Link2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { toast } from "sonner";
import { trackCustomEvent } from "@/lib/ga4";

const ELEMENT_BG: Record<string, string> = {
  목: "from-green-500/20 via-green-500/5 to-transparent",
  화: "from-red-500/20 via-red-500/5 to-transparent",
  토: "from-yellow-500/20 via-yellow-500/5 to-transparent",
  금: "from-gray-400/20 via-gray-400/5 to-transparent",
  수: "from-blue-500/20 via-blue-500/5 to-transparent",
};

const ELEMENT_BORDER: Record<string, string> = {
  목: "border-green-500/30",
  화: "border-red-500/30",
  토: "border-yellow-500/30",
  금: "border-gray-400/30",
  수: "border-blue-500/30",
};

const ELEMENT_EMOJI: Record<string, string> = {
  목: "🌿",
  화: "🔥",
  토: "🌍",
  금: "⚔️",
  수: "💧",
};

type PastLifeResult = {
  era: string;
  country: string;
  identity: string;
  name: string;
  trait: string;
  story: string;
  lesson: string;
  karma: string;
  element: string;
  elementColor: string;
};

const currentYear = new Date().getFullYear();

export default function PastLife() {
  useCanonical("/past-life");

  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "unknown">("unknown");
  const [result, setResult] = useState<PastLifeResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReveal = async () => {
    setErrorMsg(null);
    const y = parseInt(birthYear);
    const m = parseInt(birthMonth);
    const d = parseInt(birthDay);

    if (!birthYear || !birthMonth || !birthDay) {
      toast.error("생년월일을 모두 입력해주세요.");
      return;
    }
    if (isNaN(y) || y < 1900 || y > currentYear) {
      toast.error(`출생 연도는 1900 ~ ${currentYear} 사이로 입력해주세요.`);
      return;
    }
    if (isNaN(m) || m < 1 || m > 12) {
      toast.error("월은 1 ~ 12 사이로 입력해주세요.");
      return;
    }
    if (isNaN(d) || d < 1 || d > 31) {
      toast.error("일은 1 ~ 31 사이로 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      // 명시적으로 JSON 문자열로 변환하고 Accept 헤더 추가
      const payload = {
        birthYear: Number(y),
        birthMonth: Number(m),
        birthDay: Number(d),
        gender: gender || 'unknown'
      };

      const response = await fetch("/api/reveal-past-life", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data?.error ?? "전생 탐색에 실패했습니다.";
        if (response.status === 429) {
          setErrorMsg("현재 전생 탐색 요청이 너무 많습니다.\n잠시 후 다시 시도해주세요.");
        } else {
          setErrorMsg(msg);
        }
        toast.error("전생 탐색에 실패했습니다.");
        return;
      }

      setResult(data);
      trackCustomEvent("past_life_reveal", { gender });
    } catch {
      setErrorMsg("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      toast.error("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setErrorMsg(null);
  };

  const bgClass = result ? (ELEMENT_BG[result.element] ?? ELEMENT_BG["수"]) : "";
  const borderClass = result ? (ELEMENT_BORDER[result.element] ?? ELEMENT_BORDER["수"]) : "";
  const elementEmoji = result ? (ELEMENT_EMOJI[result.element] ?? "✨") : "";

  return (
    <div className="mu-subpage-screen min-h-screen bg-[#F5F4F8] text-foreground pb-20 antialiased">
      <Helmet>
        <title>전생 체험 - 나의 전생은? | 무운 (MuUn)</title>
        <meta
          name="description"
          content="생년월일로 알아보는 나의 전생. Google Gemini AI가 당신의 전생 이야기를 들려드립니다. 무료 전생 체험 서비스."
        />
        <meta name="keywords" content="전생체험, 전생, 전생알아보기, 전생이야기, 무료전생, 사주전생" />
        <link rel="canonical" href="https://muunsaju.com/past-life" />
        <meta property="og:title" content="전생 체험 - 나의 전생은? | 무운" />
        <meta property="og:description" content="생년월일로 알아보는 나의 전생 이야기. AI가 당신의 전생을 생생하게 묘사해드립니다." />
      </Helmet>

      <header className="mu-subpage-header sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2 text-[#1a1a18] hover:bg-black/[0.06] min-w-[44px] min-h-[44px]">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-lg md:text-xl font-bold text-[#1a1a18]">무료 전생 체험</h1>
        </div>
      </header>
      <main className="mu-service-main px-4 py-6 md:py-8">
      <div className="max-w-2xl mx-auto">

        <AnimatePresence mode="wait">
          {/* 입력 폼 */}
          {!result && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* 헤더 타이틀 */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-violet-500/20 text-violet-500 text-xs font-medium">
                  <Scroll className="w-3 h-3" />
                  <span>Past Life Reading</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1a18]">전생 체험</h2>
                <p className="text-muted-foreground text-xs md:text-sm">생년월일로 알아보는 나의 전생 이야기</p>
              </div>

              {/* 안내 카드 */}
              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
                <p className="text-sm text-foreground/70 leading-relaxed">
                  수체년의 시간을 거슬러 올라가 당신의 전생을 탐색합니다.
                  생년월일의 기운을 분석하여 당신이 어떤 시대, 어떤 모습으로
                  살았는지 AI 영매사가 생생하게 들려드립니다.
                </p>
              </div>

              {/* 생년월일 입력 */}
              <div className="bg-white border border-black/[0.06] shadow-sm rounded-2xl p-5 md:p-6" data-misc-card>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#1a1a18] flex items-center gap-1.5">
                      <Scroll className="w-3.5 h-3.5 text-violet-500" />
                      생년월일
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-[#b0ada6] mb-1 block">년도</label>
                        <input
                          type="number"
                          placeholder="1990"
                          value={birthYear}
                          onChange={(e) => setBirthYear(e.target.value)}
                          className="w-full h-11 bg-[#F7F5F3] border border-[#E8E5E0] rounded-xl px-3 text-sm text-center text-[#1a1a18] placeholder:text-[#b0ada6] focus:outline-none focus:border-violet-500/50 transition-all"
                          min={1900}
                          max={currentYear}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#b0ada6] mb-1 block">월</label>
                        <input
                          type="number"
                          placeholder="1"
                          value={birthMonth}
                          onChange={(e) => setBirthMonth(e.target.value)}
                          className="w-full h-11 bg-[#F7F5F3] border border-[#E8E5E0] rounded-xl px-3 text-sm text-center text-[#1a1a18] placeholder:text-[#b0ada6] focus:outline-none focus:border-violet-500/50 transition-all"
                          min={1}
                          max={12}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#b0ada6] mb-1 block">일</label>
                        <input
                          type="number"
                          placeholder="1"
                          value={birthDay}
                          onChange={(e) => setBirthDay(e.target.value)}
                          className="w-full h-11 bg-[#F7F5F3] border border-[#E8E5E0] rounded-xl px-3 text-sm text-center text-[#1a1a18] placeholder:text-[#b0ada6] focus:outline-none focus:border-violet-500/50 transition-all"
                          min={1}
                          max={31}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 성별 선택 */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#1a1a18]">성별 (선택)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["male", "female", "unknown"] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={`h-11 rounded-xl text-sm font-medium transition-all border ${
                            gender === g
                              ? "bg-violet-500/20 border-violet-500/50 text-violet-700"
                              : "bg-[#F7F5F3] border-[#E8E5E0] text-[#5a5a56] hover:bg-black/[0.06]"
                          }`}
                        >
                          {g === "male" ? "남성" : g === "female" ? "여성" : "선택 안 함"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 에러 메시지 */}
              {errorMsg && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-600 whitespace-pre-line">{errorMsg}</p>
                </div>
              )}

              {/* 탐색 버튼 */}
              <Button
                onClick={handleReveal}
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold text-sm md:text-base transition-all shadow-lg shadow-[#8B5CF6]/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    전생의 기억을 탐색하는 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    나의 전생 탐색하기
                  </>
                )}
              </Button>

              {isLoading && (
                <p className="text-center text-xs text-foreground/40 mt-3">
                  AI 영매사가 시간의 흐름을 거슬러 올라가고 있습니다...
                </p>
              )}
            </motion.div>
          )}

          {/* 결과 카드 */}
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* 전생 카드 */}
              <div className={`rounded-2xl border ${borderClass} bg-gradient-to-b ${bgClass} p-6 mb-4`}>
                {/* 상단 배지 */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                    전생 탐색 결과
                  </span>
                  <span className={`text-sm font-black ${result.elementColor}`}>
                    {elementEmoji} {result.element}의 기운
                  </span>
                </div>

                {/* 이름 & 신분 */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-black mb-1">{result.name}</div>
                  <div className={`text-base font-bold ${result.elementColor} mb-1`}>
                    {result.identity}
                  </div>
                  <div className="text-xs text-foreground/50">{result.trait}</div>
                </div>

                {/* 시대 & 지역 */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-xl bg-[#F7F5F3] border border-black/[0.06] p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Scroll className="w-3.5 h-3.5 text-foreground/40" />
                      <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">시대</span>
                    </div>
                    <div className="text-sm font-bold">{result.era}</div>
                  </div>
                  <div className="rounded-xl bg-[#F7F5F3] border border-black/[0.06] p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Globe className="w-3.5 h-3.5 text-foreground/40" />
                      <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">지역</span>
                    </div>
                    <div className="text-sm font-bold">{result.country}</div>
                  </div>
                </div>

                {/* 전생 이야기 */}
                <div className="rounded-xl bg-[#F7F5F3] border border-black/[0.06] p-4 mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-foreground/40" />
                    <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">전생 이야기</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{result.story}</p>
                </div>

                {/* 교훈 */}
                <div className="rounded-xl bg-[#F7F5F3] border border-black/[0.06] p-4 mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Flame className="w-3.5 h-3.5 text-foreground/40" />
                    <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">이번 생의 사명</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{result.lesson}</p>
                </div>

                {/* 카르마 */}
                <div className="rounded-xl bg-[#F7F5F3] border border-black/[0.06] p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Link2 className="w-3.5 h-3.5 text-foreground/40" />
                    <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">현생과의 연결</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{result.karma}</p>
                </div>
              </div>

              {/* 다시 탐색 버튼 */}
              <div className="flex gap-2">
                <Button
                  onClick={handleReset}
                  className="flex-1 h-11 font-bold text-sm rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  다시 탐색
                </Button>
              </div>

              {/* 다른 서비스 추천 */}
              <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-xs text-foreground/40 text-center mb-3 uppercase tracking-widest font-bold">
                  함께 보면 좋은 서비스
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/lifelong-saju">
                    <div className="rounded-xl bg-white border border-black/[0.06] hover:bg-[#F7F5F3] transition-colors p-3 text-center cursor-pointer shadow-sm">
                      <div className="text-lg mb-1">✨</div>
                      <div className="text-xs font-bold">평생사주</div>
                    </div>
                  </Link>
                  <Link href="/tarot">
                    <div className="rounded-xl bg-white border border-black/[0.06] hover:bg-[#F7F5F3] transition-colors p-3 text-center cursor-pointer shadow-sm">
                      <div className="text-lg mb-1">🃏</div>
                      <div className="text-xs font-bold">타로</div>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </main>
    </div>
  );
}
