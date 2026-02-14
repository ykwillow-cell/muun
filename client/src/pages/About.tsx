import { motion } from "framer-motion";
import { useEffect } from 'react';
import { useCanonical } from '@/lib/use-canonical';
import { ChevronLeft, Info, Heart, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  useCanonical('/about');

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 antialiased">
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/60 border-b border-white/5">
        <div className="container mx-auto max-w-[1280px] px-4 h-16 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-4 rounded-full hover:bg-white/5">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold tracking-tight">서비스 소개</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-[1280px] px-4 py-16 md:py-24">
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
                무운(MuUn)은 '없을 무(無)'와 '운 운(運)'을 결합한 이름입니다. 이는 "정해진 운명은 없다"는 역설적인 의미를 내포하며, 타고난 기운을 이해하되 그에 얽매이지 않고 스스로의 선택으로 운을 만들어가는 주체적인 삶을 응원한다는 무운만의 독보적인 브랜드 철학을 담고 있습니다. 우리는 당신이 운명의 주인이 될 수 있도록 돕습니다.
              </p>
            </Card>

            <Card className="glass-panel border-white/5 p-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">따뜻한 위로</h3>
              <p className="text-muted-foreground leading-relaxed">
                우리는 단순한 길흉화복의 예측이나 단정적인 미래 고지를 지양합니다. 대신, 복잡하고 지친 현대 사회를 살아가는 당신에게 따뜻한 위로와 공감을 전하며, 명리학적 근거를 바탕으로 한 긍정적인 삶의 방향성과 실질적인 조언을 제시합니다. 무운은 당신의 마음을 치유하는 가장 맑은 거울이 되고자 합니다.
              </p>
            </Card>
          </div>

          <section className="glass-panel border-white/5 p-10 md:p-16 rounded-[3rem] space-y-10">
            <div className="max-w-2xl space-y-6">
              <h3 className="text-3xl font-bold text-white">무운의 핵심 가치와 전문성</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                무운은 사주명리학을 미신이나 단순한 점술이 아닌, <span className="text-primary font-bold">'자기 성찰의 인문학'</span>으로 정의합니다. 나 자신을 더 깊이 이해하고, 타인과의 관계를 조화롭게 만들며, 삶의 중요한 순간에 현명한 결정을 내릴 수 있도록 돕는 도구가 바로 사주입니다.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                우리의 서비스는 30년 이상의 풍부한 임상 경험을 가진 역술 전문가의 방대한 데이터를 기반으로 합니다. 이 전문 지식을 최신 IT 기술과 정교한 알고리즘으로 녹여내어, 누구나 이해하기 쉬운 현대적이고 친절한 언어로 당신의 운명 스토리를 들려드립니다.
              </p>
              <div className="space-y-4 pt-4">
                <h4 className="text-xl font-bold text-white">왜 무운을 신뢰할 수 있나요?</h4>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li><strong>검증된 데이터:</strong> 수만 건의 실제 상담 사례를 분석하여 도출된 고유의 해석 로직을 사용합니다.</li>
                  <li><strong>사용자 중심 설계:</strong> 복잡한 한자나 어려운 전문 용어 대신, 직관적이고 현대적인 문체로 결과를 제공합니다.</li>
                  <li><strong>투명한 가치 제공:</strong> 모든 분석 과정에서 사용자의 개인정보를 수집하지 않으며, 순수한 가치 전달에만 집중합니다.</li>
                </ul>
              </div>
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
