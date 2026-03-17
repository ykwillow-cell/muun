import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080810] border-t border-white/[0.07] pt-8 pb-6 mt-4">
      <div className="px-4 max-w-[480px] mx-auto">

        {/* 브랜드 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5c842" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c-4.2 5.4-4.2 12.6 0 18"/>
              <path d="M12 3c4.2 5.4 4.2 12.6 0 18"/>
              <path d="M3 9h18"/>
              <path d="M3 15h18"/>
            </svg>
            <span className="text-[15px] font-bold text-[#1a1a18] tracking-tight">MUUN</span>
          </div>
          <p className="text-[11px] text-[#999891] leading-relaxed">
            회원가입 없이, 개인정보 저장 없이<br />
            100% 무료 사주·운세 서비스
          </p>
        </div>

        {/* 링크 그리드 */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-5 mb-6">
          <div>
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[#1a1a18]/25 mb-2.5">운세 서비스</p>
            <ul className="space-y-2">
              {[
                { href: '/yearly-fortune', label: '신년운세' },
                { href: '/lifelong-saju', label: '평생사주' },
                { href: '/tojeong', label: '토정비결' },
                { href: '/compatibility', label: '궁합' },
                { href: '/manselyeok', label: '만세력' },
                { href: '/daily-fortune', label: '오늘의 운세' },
                { href: '/tarot', label: '타로' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[12px] text-[#999891] hover:text-[#5a5a56] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[#1a1a18]/25 mb-2.5">더 알아보기</p>
            <ul className="space-y-2">
              {[
                { href: '/dream', label: '꿈해몽' },
                { href: '/psychology', label: '심리테스트' },
                { href: '/astrology', label: '점성술' },
                { href: '/fortune-dictionary', label: '사주 사전' },
                { href: '/guide', label: '운세 칼럼' },
                { href: '/hybrid-compatibility', label: '사주×MBTI' },
                { href: '/family-saju', label: '가족사주' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[12px] text-[#999891] hover:text-[#5a5a56] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[#1a1a18]/25 mb-2.5">서비스 안내</p>
            <ul className="space-y-2">
              {[
                { href: '/about', label: '무운 소개' },
                { href: '/contact', label: '문의하기' },
                { href: '/privacy', label: '개인정보처리방침' },
                { href: '/terms', label: '이용약관' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[12px] text-[#999891] hover:text-[#5a5a56] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SEO 보강 텍스트 */}
        <div className="border-t border-white/[0.07] pt-4 mb-4">
          <p className="text-[10px] text-[#1a1a18]/20 leading-relaxed">
            무운(MuUn)은 회원가입 없이, 개인정보를 저장하지 않는 100% 무료 사주·운세 서비스입니다.
            무료 사주풀이, 2026년 신년운세, 토정비결, 궁합, 타로, 만세력, 꿈해몽, 심리테스트 등
            다양한 운명학 콘텐츠를 제공합니다.
          </p>
        </div>

        {/* 카피라이트 */}
        <div className="text-center">
          <p className="text-[11px] text-[#1a1a18]/20">
            © {new Date().getFullYear()} MUUN Celestial Services. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
