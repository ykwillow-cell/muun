import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-10 mt-12">
      <div className="container mx-auto max-w-[1280px] px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">무운(MuUn)</h3>
            <p className="text-sm leading-relaxed">
              무운은 <strong>회원가입 없이</strong>, <strong>개인정보를 저장하지 않는</strong> 100% 무료 사주·운세 서비스입니다.
              누구나 부담 없이 사주, 운세, 타로, 꿈해몽을 이용할 수 있습니다.
            </p>
          </div>

          {/* 무료 운세 서비스 */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white uppercase tracking-wider">무료 운세 서비스</h3>
            <ul className="space-y-2">
              <li><Link href="/yearly-fortune" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">2026년 신년운세</Link></li>
              <li><Link href="/lifelong-saju" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">평생사주 풀이</Link></li>
              <li><Link href="/tojeong" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">토정비결</Link></li>
              <li><Link href="/compatibility" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">궁합 보기</Link></li>
              <li><Link href="/manselyeok" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">만세력 조회</Link></li>
              <li><Link href="/daily-fortune" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">오늘의 운세</Link></li>
              <li><Link href="/tarot" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">AI 타로 상담</Link></li>
            </ul>
          </div>

          {/* 더 알아보기 */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white uppercase tracking-wider">더 알아보기</h3>
            <ul className="space-y-2">
              <li><Link href="/dream" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">꿈해몽 사전</Link></li>
              <li><Link href="/psychology" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">심리테스트</Link></li>
              <li><Link href="/astrology" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">점성술</Link></li>
              <li><Link href="/fortune-dictionary" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">사주 용어 사전</Link></li>
              <li><Link href="/guide" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">운세 칼럼</Link></li>
              <li><Link href="/hybrid-compatibility" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">사주×MBTI 궁합</Link></li>
              <li><Link href="/family-saju" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">가족사주</Link></li>
            </ul>
          </div>

          {/* 서비스 안내 */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white uppercase tracking-wider">서비스 안내</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">무운 소개</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">문의하기</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">개인정보처리방침</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">이용약관</Link></li>
            </ul>
          </div>
        </div>

        {/* SEO 보강 텍스트 */}
        <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed text-center max-w-3xl mx-auto">
            무운(MuUn)은 회원가입 없이, 개인정보를 저장하지 않는 100% 무료 사주·운세 서비스입니다.
            무료 사주풀이, 2026년 신년운세, 토정비결, 궁합, AI 타로, 만세력, 꿈해몽, 심리테스트 등
            다양한 운명학 콘텐츠를 제공합니다.
          </p>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 mt-6 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} MUUN Celestial Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
