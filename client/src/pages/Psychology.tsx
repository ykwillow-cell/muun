import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Share2, RefreshCw, BrainCircuit, Heart, Sparkles, Target } from "lucide-react";
import { Link } from "wouter";

// 심리 테스트 데이터
const PSYCHOLOGY_TESTS = [
  {
    id: "personality",
    title: "나의 숨겨진 성격 찾기",
    description: "평소 무심코 하는 행동 속에 숨겨진 당신의 진짜 성격은?",
    icon: <BrainCircuit className="w-6 h-6 text-purple-400" />,
    questions: [
      {
        question: "길을 걷다 우연히 아주 예쁜 꽃을 발견했습니다. 당신의 행동은?",
        options: [
          { text: "사진을 찍어 SNS에 공유하거나 친구에게 보낸다.", score: "A" },
          { text: "가만히 서서 한참 동안 꽃의 향기와 모양을 감상한다.", score: "B" },
          { text: "예쁘다고 생각하며 그냥 지나간다.", score: "C" },
          { text: "이 꽃의 이름이 무엇인지 검색해본다.", score: "D" }
        ]
      },
      {
        question: "새로운 사람들과의 모임에서 당신은 주로 어떤 모습인가요?",
        options: [
          { text: "먼저 다가가 말을 걸고 분위기를 주도한다.", score: "A" },
          { text: "상대방의 이야기를 경청하며 리액션을 잘 해준다.", score: "B" },
          { text: "조용히 상황을 지켜보며 필요한 말만 한다.", score: "C" },
          { text: "공통 관심사를 찾아 깊이 있는 대화를 시도한다.", score: "D" }
        ]
      }
    ],
    results: {
      A: { title: "열정적인 분위기 메이커", desc: "당신은 에너지가 넘치고 주변 사람들에게 긍정적인 영향을 주는 사람입니다. 새로운 도전을 두려워하지 않으며, 당신의 밝은 기운이 주변을 환하게 만듭니다." },
      B: { title: "따뜻한 공감의 소유자", desc: "당신은 타인의 감정을 잘 이해하고 배려하는 따뜻한 마음을 가졌습니다. 사람들은 당신과 대화할 때 편안함을 느끼며, 당신은 존재만으로도 큰 위로가 됩니다." },
      C: { title: "냉철하고 합리적인 분석가", desc: "당신은 감정에 휘둘리지 않고 상황을 객관적으로 바라보는 능력이 탁월합니다. 효율적이고 실용적인 해결책을 찾아내는 데 능숙하며 신중한 성격입니다." },
      D: { title: "깊이 있는 탐구자", desc: "당신은 사물의 본질을 궁금해하고 지적인 호기심이 강한 사람입니다. 남들이 보지 못하는 세밀한 부분까지 찾아내며, 자신만의 세계가 뚜렷합니다." }
    }
  }
];

export default function Psychology() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finalResult, setFinalResult] = useState<any>(null);

  const test = PSYCHOLOGY_TESTS[0]; // 현재는 첫 번째 테스트만 제공

  const handleStart = () => {
    setStep("quiz");
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (score: string) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 결과 계산 (가장 많이 나온 점수 기준)
      const counts: any = {};
      newAnswers.forEach(s => counts[s] = (counts[s] || 0) + 1);
      const topScore = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      setFinalResult(test.results[topScore as keyof typeof test.results]);
      setStep("result");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '무운 데일리 심리풀이',
          text: `나의 심리 테스트 결과: ${finalResult.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('공유 실패:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">데일리 심리풀이</h1>
        </header>

        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="bg-card/40 backdrop-blur-xl border-white/10 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Sparkles className="w-20 h-20 text-white/50 animate-pulse" />
                </div>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="flex justify-center mb-2">{test.icon}</div>
                  <h2 className="text-2xl font-bold text-white">{test.title}</h2>
                  <p className="text-muted-foreground">{test.description}</p>
                  <Button 
                    onClick={handleStart}
                    className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 mt-4"
                  >
                    테스트 시작하기
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                <span>질문 {currentQuestion + 1} / {test.questions.length}</span>
                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300" 
                    style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-white leading-relaxed mb-8">
                {test.questions[currentQuestion].question}
              </h2>

              <div className="grid gap-4">
                {test.questions[currentQuestion].options.map((option, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="h-auto py-5 px-6 text-left justify-start bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all"
                    onClick={() => handleAnswer(option.score)}
                  >
                    <span className="text-base">{option.text}</span>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card className="bg-card/40 backdrop-blur-xl border-white/10 overflow-hidden">
                <div className="p-8 text-center space-y-6">
                  <div className="inline-block p-3 rounded-full bg-primary/20 text-primary mb-2">
                    <Target className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-primary font-medium">당신의 심리 분석 결과</p>
                    <h2 className="text-3xl font-bold text-white">{finalResult.title}</h2>
                  </div>
                  
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
                    <p className="text-muted-foreground leading-relaxed">
                      {finalResult.desc}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <Button 
                      variant="outline" 
                      className="gap-2 border-white/10"
                      onClick={handleStart}
                    >
                      <RefreshCw className="w-4 h-4" /> 다시하기
                    </Button>
                    <Button 
                      className="gap-2"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4" /> 공유하기
                    </Button>
                  </div>
                </div>
              </Card>

              <Link href="/">
                <Button variant="ghost" className="w-full text-muted-foreground">
                  홈으로 돌아가기
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
