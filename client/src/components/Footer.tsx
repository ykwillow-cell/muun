import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#F2F4F6', borderTop: '1px solid #E5E8EB', padding: '28px 18px 24px', marginTop: 0 }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        {/* 브랜드 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px', fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>
              <span style={{ color: '#191F28' }}>무</span><span style={{ color: '#7B61FF' }}>운</span>
            </span>
          </div>
          <p style={{ fontSize: 11, color: '#8B95A1', lineHeight: 1.6, margin: 0, fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>
            회원가입 없이, 개인정보 저장 없이<br />
            100% 무료 사주·운세 서비스
          </p>
        </div>

        {/* 링크 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0 16px', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B0B8C1', marginBottom: 10, fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>운세 서비스</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                  <Link href={href} style={{ fontSize: 12, color: '#4E5968', textDecoration: 'none', fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B0B8C1', marginBottom: 10, fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>더 알아보기</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                  <Link href={href} style={{ fontSize: 12, color: '#4E5968', textDecoration: 'none', fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B0B8C1', marginBottom: 10, fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>서비스 안내</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { href: '/about', label: '무운 소개' },
                { href: '/contact', label: '문의하기' },
                { href: '/privacy', label: '개인정보처리방침' },
                { href: '/terms', label: '이용약관' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ fontSize: 12, color: '#4E5968', textDecoration: 'none', fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SEO 보강 텍스트 */}
        <div style={{ borderTop: '1px solid #E5E8EB', paddingTop: 16, marginTop: 20, marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: '#B0B8C1', lineHeight: 1.6, margin: 0, fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>
            무운(MuUn)은 회원가입 없이, 개인정보를 저장하지 않는 100% 무료 사주·운세 서비스입니다.
            무료 사주풀이, 2026년 신년운세, 토정비결, 궁합, 타로, 만세력, 꿈해몽, 심리테스트 등
            다양한 운명학 콘텐츠를 제공합니다.
          </p>
        </div>

        {/* 카피라이트 */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#B0B8C1', margin: 0, fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>
            © {new Date().getFullYear()} MUUN Celestial Services. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
