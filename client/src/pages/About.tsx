import { motion } from "framer-motion";
import { ChevronLeft, Info, Heart, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 antialiased">
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/60 border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-4 rounded-full hover:bg-white/5">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold tracking-tight">서비스 소개</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto space-y-24"
        >
          <section className="text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex p-4 rounded-[2rem] bg-primary/10 mb-4 shadow-[0_0_40px_rgba(255,215,0,0.1)]"
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white">무운 (MuUn)</h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              당신의 삶에 맑은 지혜와 따뜻한 위로를 더하는<br />프리미엄 무료 운세 서비스
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-panel border-white/5 p-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white">무운의 의미</h3>
              <p className="text-muted-foreground leading-relaxed">
                무운(MuUn)은 '없을 무(無)'와 '운 운(運)'을 결합하여, 정해진 운명에 얽매이지 않고 스스로 운을 만들어가는 주체적인 삶을 응원한다는 철학을 담고 있습니다.
              </p>
            </Card>

            <Card className="glass-panel border-white/5 p-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">따뜻한 위로</h3>
              <p className="text-muted-foreground leading-relaxed">
                단순한 길흉화복의 예측을 넘어, 지친 일상에 작은 쉼표가 될 수 있는 따뜻한 조언과 인생의 긍정적인 방향성을 제시하고자 합니다.
              </p>
            </Card>
          </div>

          <section className="glass-panel border-white/5 p-10 md:p-16 rounded-[3rem] space-y-10">
            <div className="max-w-2xl space-y-6">
              <h3 className="text-3xl font-bold text-white">우리의 철학</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                우리는 사주가 정해진 미래를 맞추는 도구가 아니라, 나 자신을 더 깊이 이해하고 타인과의 관계를 조화롭게 만드는 <span className="text-primary font-bold">'마음의 거울'</span>이라고 믿습니다. 
              </p>
              <p className="text-muted-foreground leading-relaxed">
                30년 경력 역술인의 전문적인 식견을 현대적인 알고리즘으로 구현하여, 가장 쉽고 친절한 언어로 당신의 운명을 설명해 드립니다.
              </p>
            </div>
            
            <div className="pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">철저한 익명성</h4>
                  <p className="text-sm text-muted-foreground">사용자의 소중한 개인정보를 서버에 저장하지 않습니다. 모든 데이터는 당신의 브라우저 내에서만 안전하게 처리됩니다.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">완전 무료</h4>
                  <p className="text-sm text-muted-foreground">어떠한 결제 유도나 회원가입 없이 모든 프리미엄 운세 풀이를 자유롭게 이용하실 수 있습니다.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="text-center space-y-10 pb-10">
            <h3 className="text-3xl font-bold text-white">지금 바로 당신의 운명을 확인해보세요.</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/lifelong-saju">
                <Button className="bg-primary hover:bg-primary/90 text-background px-10 py-7 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(255,215,0,0.2)] transition-all active:scale-95">
                  평생사주 보기 <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/yearly-fortune">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 px-10 py-7 rounded-2xl font-bold text-lg transition-all active:scale-95">
                  올해운세 보기
                </Button>
              </Link>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
