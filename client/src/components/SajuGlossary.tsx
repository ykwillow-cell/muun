import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Users, Activity, TrendingUp, ShieldCheck, GraduationCap } from "lucide-react";

const SajuGlossary: React.FC = () => {
  return (
    <div className="mt-12 space-y-6">
      <div className="border-t border-white/10 pt-8 mb-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          십신(십성)으로 보는 나의 사회적 관계와 성격
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed font-medium">
          사주명리학에서 '십신'은 내가 태어난 날의 기운(일간)을 기준으로 다른 글자들과의 관계를 열 가지 형태로 분류한 것입니다. 이를 통해 개인의 성격, 재물운, 직업운, 그리고 인간관계를 파악할 수 있습니다.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="item-1" className="border border-white/10 rounded-lg bg-white/5 px-4 overflow-hidden">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-white font-bold block">1. 비겁(비견과 겁재): 주체성과 경쟁심</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-white/90 space-y-4 pb-4">
            <p>
              <strong className="text-blue-300">비견(比肩):</strong> 나를 상징하는 기운과 동일한 오행입니다. 자존감이 강하고 주관이 뚜렷하며, 독립적인 성향을 나타냅니다. 동료나 형제와의 평등한 관계를 중시합니다.
            </p>
            <p>
              <strong className="text-blue-300">겁재(劫財):</strong> 나의 기운과 오행은 같지만 음양이 다른 경우입니다. 강력한 경쟁심과 승부욕을 상징하며, 때로는 예상치 못한 재물의 지출이 발생할 수 있으나 추진력이 뛰어난 장점이 있습니다.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border border-white/10 rounded-lg bg-white/5 px-4 overflow-hidden">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <Activity className="w-5 h-5 text-green-400" />
              <div>
                <span className="text-white font-bold block">2. 식상(식신과 상관): 표현과 창의성</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-white/90 space-y-4 pb-4">
            <p>
              <strong className="text-green-300">식신(食神):</strong> 내가 생해주는 기운으로 음양이 같은 경우입니다. 풍요로움과 먹을 복을 상징하며, 연구하고 탐구하는 능력, 그리고 한 분야에 몰입하는 기질이 강합니다.
            </p>
            <p>
              <strong className="text-green-300">상관(傷官):</strong> 내가 생해주는 기운 중 음양이 다른 경우입니다. 뛰어난 언변과 예술적 재능, 비판적 사고를 나타냅니다. 자신을 드러내는 능력이 탁월하여 마케팅이나 예술 분야에 적합합니다.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border border-white/10 rounded-lg bg-white/5 px-4 overflow-hidden">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <div>
                <span className="text-white font-bold block">3. 재성(편재와 정재): 재물과 결과</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-white/90 space-y-4 pb-4">
            <p>
              <strong className="text-yellow-300">편재(偏財):</strong> 내가 극하는 기운으로 음양이 같은 경우입니다. 고정적이지 않은 큰 재물, 사업 수완, 공간 지각 능력을 의미합니다. 모험심이 강하고 넓은 시야를 가진 것이 특징입니다.
            </p>
            <p>
              <strong className="text-yellow-300">정재(正財):</strong> 내가 극하는 기운 중 음양이 다른 경우입니다. 성실하게 쌓아 올리는 고정적인 수익과 신용을 상징합니다. 꼼꼼하고 계획적인 성향으로 안정적인 자산 관리에 능합니다.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border border-white/10 rounded-lg bg-white/5 px-4 overflow-hidden">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <ShieldCheck className="w-5 h-5 text-red-400" />
              <div>
                <span className="text-white font-bold block">4. 관성(편관과 정관): 규율과 명예</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-white/90 space-y-4 pb-4">
            <p>
              <strong className="text-red-300">편관(偏官):</strong> 나를 극하는 기운으로 음양이 같은 경우입니다. 강력한 카리스마, 책임감, 인내심을 상징합니다. 어려운 상황을 돌파하는 힘이 있으며 명예를 중시합니다.
            </p>
            <p>
              <strong className="text-red-300">정관(正官):</strong> 나를 극하는 기운 중 음양이 다른 경우입니다. 합리적인 규칙 준수, 원칙주의, 안정적인 조직 생활을 의미합니다. 타인의 신뢰를 받는 도덕적 기준이 높습니다.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="border border-white/10 rounded-lg bg-white/5 px-4 overflow-hidden">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              <div>
                <span className="text-white font-bold block">5. 인성(편인과 정인): 수용과 지혜</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-white/90 space-y-4 pb-4">
            <p>
              <strong className="text-purple-300">편인(偏印):</strong> 나를 생해주는 기운으로 음양이 같은 경우입니다. 독창적인 아이디어, 기술적 재능, 신비학적 관심 등을 나타냅니다. 남들이 보지 못하는 이면을 읽어내는 통찰력이 있습니다.
            </p>
            <p>
              <strong className="text-purple-300">정인(正印):</strong> 나를 생해주는 기운 중 음양이 다른 경우입니다. 학문적 성취, 어머니의 사랑과 같은 무조건적인 지원, 수용성을 의미합니다. 학습 능력이 뛰어나고 인덕이 많은 편입니다.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-5 mt-8 shadow-lg shadow-primary/5">
        <p className="text-primary font-medium text-sm leading-relaxed">
          <span className="font-bold text-primary flex items-center gap-2 mb-1">
            <span className="text-base">💡</span> 팁:
          </span> 
          위 설명은 일반적인 성향이며, 전체적인 사주 구성과 운의 흐름에 따라 실제 작용은 달라질 수 있습니다. 무운의 정밀 분석 결과를 통해 당신만의 특별한 기운을 확인해보세요.
        </p>
      </div>
    </div>
  );
};

export default SajuGlossary;
