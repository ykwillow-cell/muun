import { motion } from "framer-motion";
import { useEffect } from 'react';
import { useCanonical } from '@/lib/use-canonical';
import { ChevronLeft, Shield } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  useCanonical('/privacy');

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">개인정보처리방침</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-[1280px] px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-white">개인정보처리방침</h2>
          </div>

          <Card className="bg-card border-white/10">
            <CardContent className="p-8 space-y-6 text-muted-foreground leading-relaxed">
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">1. 개인정보의 처리 목적</h3>
                <p>
                  '무운'(이하 '서비스')은 사용자가 입력한 생년월일, 태어난 시간, 성별 등의 정보를 오직 사주 및 운세 결과 계산을 위한 목적으로만 처리합니다. 본 서비스는 회원가입을 요구하지 않으며, 입력된 정보는 서버에 영구적으로 저장되지 않습니다.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">2. 처리하는 개인정보 항목</h3>
                <p>
                  서비스 이용 과정에서 다음과 같은 정보가 입력될 수 있습니다:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>필수항목: 이름(별칭), 성별, 생년월일, 태어난 시간</li>
                  <li>자동수집항목: 접속 로그, 쿠키, 접속 IP 정보 (서비스 안정성 및 통계 분석용)</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">3. 개인정보의 보유 및 이용기간</h3>
                <p>
                  사용자가 입력한 사주 정보는 브라우저의 로컬 스토리지(Local Storage)에 임시 저장되어 사용자의 편의를 돕습니다. 서버에는 어떠한 개인 식별 정보도 저장되지 않으며, 브라우저 캐시를 삭제하거나 서비스를 종료하면 정보는 더 이상 이용되지 않습니다.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">4. 제3자 제공 및 위탁</h3>
                <p>
                  서비스는 사용자의 개인정보를 외부에 제공하거나 처리를 위탁하지 않습니다. 다만, 구글 애드센스 등 광고 서비스 이용 시 비식별화된 통계 정보가 활용될 수 있습니다.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">4-1. Google AdSense 및 쿠키 사용 고지</h3>
                <p>
                  본 서비스는 수익 창출 및 서비스 운영을 위해 Google AdSense 광고를 게재합니다. 이와 관련하여 다음과 같은 사항을 준수합니다:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Google을 포함한 제3자 제공업체는 사용자의 이전 웹사이트 방문 기록을 바탕으로 광고를 게재하기 위해 쿠키를 사용합니다.</li>
                  <li>Google의 광고 쿠키 사용을 통해 Google과 파트너사는 본 서비스 및 인터넷상의 다른 사이트 방문 기록을 토대로 사용자에게 맞춤형 광고를 제공할 수 있습니다.</li>
                  <li>사용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google 광고 설정</a>을 방문하여 맞춤형 광고 게재를 중단할 수 있습니다.</li>
                  <li>사용자는 <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aboutads.info</a>를 방문하여 맞춤형 광고를 위한 제3자 제공업체의 쿠키 사용을 차단할 수 있습니다.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">5. 이용자의 권리</h3>
                <p>
                  이용자는 언제든지 브라우저 설정을 통해 쿠키 저장을 거부하거나 로컬 스토리지를 삭제함으로써 자신의 정보를 직접 관리할 수 있습니다.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">5-1. 광고 정책 준수</h3>
                <p>
                  본 서비스는 Google AdSense 광고 정책을 준수하며, 사용자에게 광고 클릭을 유도하거나 강요하지 않습니다. 광고와 콘텐츠는 명확하게 구분되어 있습니다.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">6. 개인정보 보호책임자</h3>
                <p>
                  서비스 이용 중 발생하는 개인정보 관련 문의는 아래 메일로 연락 주시기 바랍니다.<br />
                  이메일: support@muun.im
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">7. 정책 변경</h3>
                <p>
                  본 개인정보처리방침은 법령 변경이나 서비스 정책 변경에 따라 수정될 수 있습니다. 변경 사항은 서비스 페이지에 공지됩니다.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-white">8. 시행일</h3>
                <p>
                  본 개인정보처리방침은 2026년 1월 18일부터 시행됩니다.
                </p>
              </section>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
