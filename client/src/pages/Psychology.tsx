import { useState } from "react";
import { useEffect } from 'react';
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Share2, RefreshCw, BrainCircuit, Heart, Sparkles, Target } from "lucide-react";
import { Link } from "wouter";
import { shareContent } from "@/lib/share";
import PsychologyContent from "@/components/PsychologyContent";

// 심리 테스트 데이터
const PSYCHOLOGY_TESTS = [
  {
    id: "personality",
    title: "무료 심리 테스트: 나의 숨겨진 성격 찾기",
    description: "평소 무심코 하는 행동 속에 숨겨진 당신의 진짜 성격은?",
    icon: <BrainCircuit className="w-6 h-6 text-purple-400" />,
    questions: [
      {
        question: "1. 낯선 숲속을 걷다가 갈림길을 만났습니다. 당신은 어떤 길을 선택하나요?",
        options: [
          { text: "꽃이 만발하고 햇살이 잘 드는 밝은 길", score: 10 },
          { text: "나무가 울창하고 신비로운 분위기의 좁은 길", score: 20 },
          { text: "누군가 지나간 흔적이 뚜렷한 넓은 길", score: 30 },
          { text: "어디로 연결될지 알 수 없는 안개 낀 길", score: 40 }
        ]
      },
      {
        question: "2. 우연히 발견한 오래된 상자 안에 한 가지 물건이 들어있다면 무엇일까요?",
        options: [
          { text: "어린 시절 소중했던 추억의 장난감", score: 10 },
          { text: "누군가에게 전달되지 못한 연애 편지", score: 20 },
          { text: "반짝이는 보석이나 금화", score: 30 },
          { text: "미래를 예언하는 신비한 지도", score: 40 }
        ]
      },
      {
        question: "3. 갑자기 비가 내리기 시작합니다. 당신의 첫 번째 행동은?",
        options: [
          { text: "빗소리를 즐기며 천천히 걷는다", score: 10 },
          { text: "가까운 건물 안으로 들어가 비를 피한다", score: 20 },
          { text: "가방에서 미리 준비한 우산을 꺼낸다", score: 30 },
          { text: "비를 맞으며 뛰어가는 사람들을 관찰한다", score: 40 }
        ]
      },
      {
        question: "4. 카페에서 창밖을 보며 휴식을 취할 때, 당신의 시선은 어디에 머무나요?",
        options: [
          { text: "웃으며 대화하는 사람들의 표정", score: 10 },
          { text: "바쁘게 움직이는 자동차와 도시의 풍경", score: 20 },
          { text: "하늘의 구름이나 흔들리는 나뭇잎", score: 30 },
          { text: "자신의 모습이 비치는 유리창", score: 40 }
        ]
      },
      {
        question: "5. 잠들기 전, 당신은 주로 어떤 생각을 하나요?",
        options: [
          { text: "오늘 하루 있었던 즐거운 일들", score: 10 },
          { text: "내일 해야 할 일들에 대한 계획", score: 20 },
          { text: "현실에서는 일어날 수 없는 판타지 같은 상상", score: 30 },
          { text: "삶의 의미나 우주의 신비에 대한 깊은 고민", score: 40 }
        ]
      }
    ],
    results: [
      {
        min: 50,
        max: 80,
        type: "A",
        title: "순수한 마음을 가진 낙천주의자",
        desc: "당신은 밝고 긍정적인 에너지를 가진 사람입니다. 주변 사람들에게 따뜻함을 전하며, 작은 것에서도 행복을 찾을 줄 아는 순수한 영혼을 가졌군요. 때로는 현실적인 고민보다 감정에 충실한 편이지만, 그 덕분에 당신 주변에는 항상 사람들이 모여듭니다. 당신의 숨겨진 성격은 '무한한 포용력'입니다."
      },
      {
        min: 90,
        max: 120,
        type: "B",
        title: "안정을 추구하는 신중한 전략가",
        desc: "당신은 상황을 객관적으로 파악하고 리스크를 최소화하려는 경향이 있습니다. 겉으로는 평온해 보이지만 속으로는 수많은 계산과 계획을 세우는 철저함을 가졌군요. 신뢰를 중요하게 생각하며, 한 번 맺은 인연을 소중히 여깁니다. 당신의 숨겨진 성격은 '강인한 책임감'입니다."
      },
      {
        min: 130,
        max: 160,
        type: "C",
        title: "자유로운 영혼의 예술가",
        desc: "당신은 틀에 박힌 것을 싫어하고 자신만의 독특한 시각으로 세상을 바라봅니다. 풍부한 감수성과 상상력을 바탕으로 새로운 가치를 창조해내는 능력이 탁월하군요. 남들과는 조금 다른 길을 걷는 것에 두려움이 없으며 독립적인 성향이 강합니다. 당신의 숨겨진 성격은 '독창적인 통찰력'입니다."
      },
      {
        min: 170,
        max: 200,
        type: "D",
        title: "깊은 내면을 가진 철학자",
        desc: "당신은 사물의 본질과 삶의 의미를 끊임없이 탐구하는 깊은 내면의 소유자입니다. 가벼운 대화보다는 진지한 사색을 즐기며, 혼자만의 시간 속에서 에너지를 얻는 편이군요. 남들이 보지 못하는 세밀한 진실을 꿰뚫어 보는 눈을 가졌습니다. 당신의 숨겨진 성격은 '냉철한 직관력'입니다."
      }
    ]
  }
];

export default function Psychology() {
  useCanonical('/psychology');

  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [finalResult, setFinalResult] = useState<any>(null);

  const test = PSYCHOLOGY_TESTS[0];
  const commonMaxWidth = "max-w-4xl mx-auto";

  const handleStart = () => {
    setStep("quiz");
    setCurrentQuestion(0);
    setTotalScore(0);
  };

  const handleAnswer = (score: number) => {
    const newTotalScore = totalScore + score;
    setTotalScore(newTotalScore);

    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 결과 계산 (총점 기준)
      const result = test.results.find(r => newTotalScore >= r.min && newTotalScore <= r.max);
      setFinalResult(result || test.results[test.results.length - 1]);
      setStep("result");
    }
  };

  const handleShare = async () => {
    await shareContent({
      title: '무운 데일리 심리풀이',
      text: `나의 숨겨진 성격 테스트 결과: ${finalResult.title}`,
      page: 'psychology',
      buttonType: 'text_button',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative antialiased">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-900/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className={`${commonMaxWidth} px-4 h-14 flex items-center`}>
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-lg md:text-xl font-bold text-white">무료 심리 테스트</h1>
        </div>
      </header>

      <main className="relative z-10 px-4 py-6 md:py-8">
        <div className={commonMaxWidth}>
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 md:space-y-8"
              >
                {/* Hero Section */}
                <section className="text-center space-y-4 py-4 md:py-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-xl">
                    <BrainCircuit className="w-4 h-4 text-purple-400" />
                    <span className="text-[11px] md:text-xs font-bold tracking-widest text-purple-400 uppercase">심리 분석</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">나의 숨겨진 성격 찾기</h2>
                  <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
                    평소 무심코 하는 행동 속에 숨겨진 당신의 진짜 성격은?
                  </p>
                </section>

                <Card className="bg-white/5 border-white/10 overflow-hidden rounded-2xl">
                  <div className="aspect-video bg-gradient-to-br from-purple-600/50 to-pink-600/50 flex items-center justify-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center">
                      <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-white animate-pulse" />
                    </div>
                  </div>
                  <CardContent className="p-6 md:p-8 text-center space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto">
                      {test.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white">{test.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground">{test.description}</p>
                    <Button 
                      onClick={handleStart}
                      className="w-full min-h-[48px] md:min-h-[56px] text-base md:text-lg font-bold bg-primary hover:bg-primary/90 rounded-xl mt-4"
                    >
                      테스트 시작하기
                    </Button>
                  </CardContent>
                </Card>

                {/* SEO 콘텐츠 */}
                <PsychologyContent />
              </motion.div>
            )}

            {step === "quiz" && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 md:space-y-8"
              >
                {/* Progress */}
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span className="text-xs md:text-sm">질문 {currentQuestion + 1} / {test.questions.length}</span>
                  <div className="w-24 md:w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary" 
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
                
                <Card className="bg-white/5 border-white/10 rounded-2xl p-6 md:p-8">
                  <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed mb-6 md:mb-8">
                    {test.questions[currentQuestion].question}
                  </h2>

                  <div className="grid gap-3 md:gap-4">
                    {test.questions[currentQuestion].options.map((option, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="h-auto min-h-[56px] py-4 px-5 text-left justify-start bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all rounded-xl"
                        onClick={() => handleAnswer(option.score)}
                      >
                        <span className="text-sm md:text-base text-white">{option.text}</span>
                      </Button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {step === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 md:space-y-8"
              >
                <Card className="bg-white/5 border-white/10 overflow-hidden rounded-2xl">
                  <div className="p-6 md:p-8 text-center space-y-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
                      <Target className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm md:text-base text-primary font-medium">당신의 심리 분석 결과</p>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">{finalResult.title}</h2>
                    </div>
                    
                    <div className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {finalResult.desc}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4">
                      <Button 
                        variant="outline" 
                        className="gap-2 border-white/10 min-h-[48px] rounded-xl"
                        onClick={handleStart}
                      >
                        <RefreshCw className="w-4 h-4" /> 다시하기
                      </Button>
                      <Button 
                        className="gap-2 min-h-[48px] rounded-xl"
                        onClick={handleShare}
                      >
                        <Share2 className="w-4 h-4" /> 공유하기
                      </Button>
                    </div>
                  </div>
                </Card>

                <Link href="/">
                  <Button variant="ghost" className="w-full text-muted-foreground min-h-[48px]">
                    홈으로 돌아가기
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
