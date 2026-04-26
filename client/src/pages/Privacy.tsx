import { motion } from "framer-motion";
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCanonical } from '@/lib/use-canonical';
import { ChevronLeft, Shield } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  useCanonical('/privacy');

  return (
    <div className="mu-subpage-screen min-h-screen bg-background text-foreground pb-20">
      <Helmet>
        <title>개인정보처리방침 - 무운 (MuUn)</title>
        <meta name="description" content="무운(MuUn)은 사용자의 개인정보를 저장하지 않습니다. 무운 서비스의 개인정보처리방침을 확인하세요." />
        <meta name="keywords" content="개인정보처리방침, 개인정보보호, 무운개인정보" />
        <link rel="canonical" href="https://muunsaju.com/privacy" />
        <meta property="og:title" content="개인정보처리방침 - 무운 (MuUn)" />
        <meta property="og:description" content="무운(MuUn)은 사용자의 개인정보를 저장하지 않습니다. 무운 서비스의 개인정보처리방침을 확인하세요." />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:url" content="https://muunsaju.com/privacy" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="개인정보처리방침 - 무운 (MuUn)" />
        <meta name="twitter:description" content="무운(MuUn)은 사용자의 개인정보를 저장하지 않습니다. 무운 서비스의 개인정보처리방침을 확인하세요." />
        <meta name="twitter:image" content="https://muunsaju.com/images/horse_mascot.png" />
      </Helmet>
      <header className="mu-subpage-header sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-black/10">
        <div className="w-full px-4 h-14 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2 text-[#1a1a18] hover:bg-black/[0.06]">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-[#1a1a18]">개인정보처리방침</h1>
        </div>
      </header>

      <main className="mu-service-main w-full px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full space-y-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-[#1a1a18]">개인정보처리방침</h2>
          </div>

          <Card className="bg-card border-black/10">
            <CardContent className="p-8 space-y-6 text-muted-foreground leading-relaxed">

              <p className="text-sm text-muted-foreground">
                본 개인정보처리방침은 Yu Lab(이하 '회사')이 제공하는 무운(MuUn) 서비스(이하 '서비스')에 적용됩니다.
                회사는 사용자의 개인정보 보호를 매우 중요하게 생각하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다.
                본 방침은 구글 애드센스(Google AdSense), 마이크로소프트 클레리티(Microsoft Clarity) 및 구글 플레이(Google Play)
                앱 등록 요구사항을 포함한 최신 규제 기준을 충족하도록 작성되었습니다.
              </p>

              {/* 1. 개인정보의 처리 목적 */}
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-[#1a1a18]">1. 개인정보의 처리 목적</h3>
                <p>
                  서비스는 다음의 목적을 위해 개인정보를 처리합니다. 처리하는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
                  이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-[#1a1a18]">핵심 기능 제공:</strong> 사용자가 입력한 생년월일, 태어난 시간, 성별 등의 정보는
                    오직 사주 및 운세 결과를 계산하고 사용자에게 표시하기 위한 목적으로만 사용됩니다.
                  </li>
                  <li>
                    <strong className="text-[#1a1a18]">서비스 개선 및 통계 분석:</strong> 서비스 품질 향상, 사용자 경험 최적화, 신규 서비스 개발 등을 위해
                    접속 로그, 쿠키, 행태정보 등 비식별 데이터를 통계적으로 분석하고 활용합니다.
                  </li>
                  <li>
                    <strong className="text-[#1a1a18]">광고 제공:</strong> 구글 애드센스를 통해 맞춤형 광고를 제공하고 서비스 운영 수익을 창출합니다.
                  </li>
                </ul>
              </section>

              {/* 2. 처리하는 개인정보 항목 및 수집 방법 */}
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-[#1a1a18]">2. 처리하는 개인정보 항목 및 수집 방법</h3>
                <p>
                  서비스는 회원가입 절차 없이 운영되며, 서비스 제공에 필요한 최소한의 개인정보만을 처리합니다.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-black/10">
                        <th className="text-left py-2 pr-4 text-[#1a1a18] font-semibold w-1/4">구분</th>
                        <th className="text-left py-2 pr-4 text-[#1a1a18] font-semibold w-2/4">수집 항목</th>
                        <th className="text-left py-2 text-[#1a1a18] font-semibold w-1/4">수집 방법</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-black/10">
                        <td className="py-2 pr-4 text-[#1a1a18] font-medium align-top">사용자 직접 입력</td>
                        <td className="py-2 pr-4 align-top">이름(별칭), 성별, 생년월일, 태어난 시간</td>
                        <td className="py-2 align-top">사용자가 서비스 내에서 직접 입력</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[#1a1a18] font-medium align-top">자동 수집</td>
                        <td className="py-2 pr-4 align-top">접속 로그, 쿠키, 접속 IP 정보, 행태정보(클릭, 스크롤, 마우스 움직임 등)</td>
                        <td className="py-2 align-top">서비스 이용 과정에서 자동 생성 및 수집</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 3. 개인정보의 보유 및 이용기간 */}
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-[#1a1a18]">3. 개인정보의 보유 및 이용기간</h3>
                <p>
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
                  개인정보를 처리 및 보유합니다.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-[#1a1a18]">사용자 입력 정보:</strong> 사용자의 편의를 위해 브라우저의 로컬 스토리지(Local Storage)에 임시 저장됩니다.
                    이 정보는 서버에 영구적으로 저장되지 않으며, 사용자가 브라우저의 캐시를 직접 삭제하면 정보는 즉시 파기됩니다.
                  </li>
                  <li>
                    <strong className="text-[#1a1a18]">자동 수집 정보:</strong> 통계 분석 및 서비스 개선 목적으로 최대 1년간 보관 후 복구 불가능한 방법으로 파기됩니다.
                  </li>
                </ul>
              </section>

              {/* 4. 제3자 제공 및 위탁 */}
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-[#1a1a18]">4. 개인정보의 제3자 제공 및 처리 위탁</h3>
                <p>
                  회사는 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
                  현재 회사는 사용자의 개인 식별 정보를 외부에 제공하거나 처리를 위탁하지 않습니다. 다만, 아래와 같이 서비스에 통합된 외부 서비스를
                  이용하는 과정에서 비식별화된 정보가 해당 업체로 전송될 수 있습니다.
                </p>
              </section>

              {/* 4-1. Google AdSense */}
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-[#1a1a18]">4-1. Google AdSense 광고 서비스</h3>
                <p>
                  본 서비스는 수익 창출을 위해 Google AdSense 광고를 게재합니다. 이 과정에서 다음과 같은 사항을 준수하고 사용자에게 고지합니다.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Google을 포함한 제3자 광고 사업자는 쿠키를 사용하여 사용자의 이전 웹사이트 방문 기록을 기반으로 광고를 게재합니다.
                  </li>
                  <li>
                    Google의 광고 쿠키 사용을 통해 Google과 파트너사는 본 서비스 및 다른 사이트 방문 기록을 토대로 사용자에게 맞춤형 광고를 제공할 수 있습니다.
                    Google의 데이터 사용에 관한 자세한 내용은{" "}
                    <a
                      href="https://policies.google.com/technologies/partner-sites"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google 파트너 사이트 또는 앱 사용 시 Google의 데이터 사용 방식
                    </a>
                    을 참고하시기 바랍니다.
                  </li>
                  <li>
                    사용자는{" "}
                    <a
                      href="https://adssettings.google.com/authenticated"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google 광고 설정
                    </a>
                    을 방문하여 맞춤형 광고 게재를 중단할 수 있으며,{" "}
                    <a
                      href="http://www.aboutads.info/choices/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      www.aboutads.info/choices
                    </a>
                    를 방문하여 다른 제3자 광고 사업자의 쿠키 사용을 차단할 수 있습니다.
                  </li>
                </ul>
              </section>

              {/* 4-2. Microsoft Clarity */}
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-[#1a1a18]">4-2. Microsoft Clarity 분석 도구</h3>
                <p>
                  본 서비스는 사용자 경험을 개선하고 서비스 품질을 최적화하기 위해 Microsoft Clarity 분석 도구를 사용합니다.
                  이 도구는 클릭, 스크롤, 마우스 움직임 등 사용자의 서비스 이용 행태 정보를 익명으로 수집합니다.
                  Microsoft Clarity의 데이터 수집 및 처리 방식에 대한 자세한 내용은{" "}
                  <a
                    href="https://privacy.microsoft.com/ko-kr/privacystatement"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Microsoft 개인정보처리방침
                  </a>
                  을 참고하시기 바랍니다.
                </p>
              </section>

              {/* 5. 정보주체의 권리 */}
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-[#1a1a18]">5. 정보주체와 법정대리인의 권리·의무 및 그 행사방법</h3>
                <p>
                  정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
                  다만, 서비스는 회원제를 운영하지 않으므로 대부분의 정보는 사용자의 브라우저에서 직접 관리할 수 있습니다.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-[#1a1a18]">쿠키 설정 거부:</strong> 사용자는 웹 브라우저의 옵션을 설정함으로써 모든 쿠키를 허용하거나,
                    쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.
                    (설정방법 예시: Chrome의 경우 → 웹 브라우저 우측 상단 '더보기' &gt; 설정 &gt; 개인정보 및 보안 &gt; 쿠키 및 기타 사이트 데이터)
                  </li>
                  <li>
                    <strong className="text-[#1a1a18]">로컬 스토리지 삭제:</strong> 사용자는 브라우저 설정 메뉴를 통해 로컬 스토리지에 저장된 정보를 직접 삭제할 수 있습니다.
                  </li>
                </ul>
              </section>

              {/* 6. 개인정보의 파기 */}
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-[#1a1a18]">6. 개인정보의 파기</h3>
                <p>
                  회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
                  서비스는 서버에 개인 식별 정보를 저장하지 않으므로 별도의 파기 절차는 없으며, 자동 수집된 비식별 정보는 보유기간 만료 시
                  기술적으로 복구 불가능한 방법으로 삭제됩니다.
                </p>
              </section>

              {/* 7. 안전성 확보 조치 */}
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-[#1a1a18]">7. 개인정보의 안전성 확보 조치</h3>
                <p>
                  회사는 개인정보의 안전성 확보를 위해 다음과 같은 기술적, 관리적 및 물리적 조치를 취하고 있습니다.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-[#1a1a18]">관리적 조치:</strong> 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
                  <li><strong className="text-[#1a1a18]">기술적 조치:</strong> 개인정보처리시스템 등의 접근권한 관리, 보안프로그램 설치</li>
                  <li><strong className="text-[#1a1a18]">물리적 조치:</strong> 전산실, 자료보관실 등의 접근통제</li>
                </ul>
              </section>

              {/* 8. 개인정보 보호책임자 */}
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-[#1a1a18]">8. 개인정보 보호책임자</h3>
                <p>
                  회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여
                  아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-[#1a1a18]">회사명:</strong> Yu Lab</li>
                  <li><strong className="text-[#1a1a18]">대표자:</strong> Yu, Yeonggyeong</li>
                  <li>
                    <strong className="text-[#1a1a18]">이메일:</strong>{" "}
                    <a href="mailto:ykwillow1@naver.com" className="text-primary hover:underline">
                      ykwillow1@naver.com
                    </a>
                  </li>
                </ul>
              </section>

              {/* 9. 정책 변경 */}
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-[#1a1a18]">9. 개인정보 처리방침 변경</h3>
                <p>
                  본 개인정보처리방침은 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터
                  공지사항을 통하여 고지할 것입니다.
                </p>
                <p>
                  <strong className="text-[#1a1a18]">시행일:</strong> 2026년 3월 6일
                </p>
              </section>

            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
