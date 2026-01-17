import { motion } from "framer-motion";
import { ChevronLeft, Info, Heart, Shield, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">서비스 소개</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-12"
        >
          <section className="text-center space-y-4">
            <div className="inline-block p-3 rounded-2xl bg-primary/20 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl font-bold text-white">무운 (MuUn)</h2>
            <p className="text-xl text-muted-foreground">
              당신의 삶에 작은 지혜와 위로를 더하는 무료 운세 서비스
            </p>
          </section>

          <Card className="bg-card border-white/10 overflow-hidden">
            <CardContent className="p-8 space-y-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Info className="w-6 h-6 text-primary" />
                  무운은 어떤 서비스인가요?
                </h3>
                <p>
                  무운(MuUn)은 '없을 무(無)'와 '운 운(運)'을 결합하여, 운명에 얽매이지 않고 스스로 운을 만들어가는 삶을 응원한다는 의미를 담고 있습니다. 복잡한 회원가입이나 유료 결제 없이, 누구나 자신의 생년월일만으로 전통 명리학 기반의 깊이 있는 사주 풀이를 경험할 수 있도록 설계되었습니다.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <Heart className="w-6 h-6 text-pink-400" />
                  <h4 className="text-lg font-bold text-white">따뜻한 위로</h4>
                  <p className="text-sm">단순한 길흉화복을 넘어, 지친 일상에 힘이 되는 따뜻한 조언과 인생의 방향성을 제시합니다.</p>
                </div>
                <div className="space-y-3 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <Shield className="w-6 h-6 text-blue-400" />
                  <h4 className="text-lg font-bold text-white">철저한 익명성</h4>
                  <p className="text-sm">사용자의 소중한 개인정보를 서버에 저장하지 않습니다. 오직 당신의 브라우저에서만 결과가 처리됩니다.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">우리의 철학</h3>
                <p>
                  우리는 사주가 정해진 미래를 맞추는 도구가 아니라, 나 자신을 더 깊이 이해하고 타인과의 관계를 조화롭게 만드는 '마음의 거울'이라고 믿습니다. 30년 경력 역술인의 전문적인 식견을 현대적인 알고리즘으로 구현하여, 가장 쉽고 친절한 언어로 당신의 운명을 설명해 드립니다.
                </p>
              </div>
            </CardContent>
          </Card>

          <section className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-white">지금 바로 당신의 운명을 확인해보세요.</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/lifelong-saju">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full font-bold">
                  평생사주 보기
                </Button>
              </Link>
              <Link href="/yearly-fortune">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-full font-bold">
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
