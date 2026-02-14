import { motion } from "framer-motion";
import { useEffect } from 'react';
import { useCanonical } from '@/lib/use-canonical';
import { ChevronLeft, FileText } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  useCanonical('/terms');

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">이용약관</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-[1280px] px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-white">서비스 이용약관</h2>
          </div>

          <Card className="bg-card border-white/10">
            <CardContent className="p-8 space-y-6 text-muted-foreground leading-relaxed">
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">1. 목적</h3>
                <p>
                  본 약관은 '무운'(이하 '서비스')이 제공하는 운세 및 사주 풀이 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">2. 서비스의 성격</h3>
                <p>
                  본 서비스가 제공하는 모든 운세 및 사주 풀이 결과는 명리학적 알고리즘에 기반한 참고 자료일 뿐입니다. 서비스는 결과의 절대적인 정확성을 보장하지 않으며, 사용자의 중대한 결정(투자, 결혼, 계약 등)에 대한 법적 책임을 지지 않습니다.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">3. 이용자의 의무</h3>
                <p>
                  이용자는 본 서비스를 정당한 목적으로만 이용해야 하며, 서비스의 운영을 방해하거나 시스템에 위해를 가하는 행위를 해서는 안 됩니다.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">4. 서비스의 변경 및 중단</h3>
                <p>
                  서비스는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다. 무료 서비스의 경우 별도의 사전 공지 없이 변경될 수 있습니다.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">5. 면책 조항</h3>
                <p>
                  서비스는 천재지변, 디도스(DDoS) 공격, 서버 장애 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임을 지지 않습니다. 또한 사용자가 입력한 정보의 오류로 인해 발생하는 결과에 대해서도 책임을 지지 않습니다.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">6. 저작권</h3>
                <p>
                  서비스가 제공하는 모든 콘텐츠, 디자인, 로직에 대한 저작권은 '무운'에 귀속됩니다. 무단 복제, 배포, 상업적 이용은 엄격히 금지됩니다.
                </p>
              </section>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
