import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="mu-footer">
      <div className="mu-footer__inner">

        {/* 브랜드 */}
        <div className="mu-footer__brand">
          <div className="mu-footer__logo">
            <span className="mu-footer__logo-text">
              <span className="mu-footer__logo-mu">무</span><span className="mu-footer__logo-un">운</span>
            </span>
          </div>
          <p className="mu-footer__tagline">
            회원가입 없이, 개인정보 저장 없이<br />
            100% 무료 사주·운세 서비스
          </p>
        </div>

        {/* 링크 그리드 */}
        <div className="mu-footer__links">
          <div className="mu-footer__link-col">
            <p className="mu-footer__link-heading">운세 서비스</p>
            <ul className="mu-footer__link-list">
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
                  <Link href={href} className="mu-footer__link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mu-footer__link-col">
            <p className="mu-footer__link-heading">더 알아보기</p>
            <ul className="mu-footer__link-list">
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
                  <Link href={href} className="mu-footer__link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mu-footer__link-col">
            <p className="mu-footer__link-heading">서비스 안내</p>
            <ul className="mu-footer__link-list">
              {[
                { href: '/about', label: '무운 소개' },
                { href: '/contact', label: '문의하기' },
                { href: '/privacy', label: '개인정보처리방침' },
                { href: '/terms', label: '이용약관' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="mu-footer__link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SEO 보강 텍스트 */}
        <div className="mu-footer__seo">
          <p className="mu-footer__seo-text">
            무운(MuUn)은 회원가입 없이, 개인정보를 저장하지 않는 100% 무료 사주·운세 서비스입니다.
            무료 사주풀이, 2026년 신년운세, 토정비결, 궁합, 타로, 만세력, 꿈해몽, 심리테스트 등
            다양한 운명학 콘텐츠를 제공합니다.
          </p>
        </div>

        {/* 카피라이트 */}
        <div className="mu-footer__copyright">
          <p className="mu-footer__copyright-text">
            © {new Date().getFullYear()} MUUN Celestial Services. All rights reserved.
          </p>
        </div>

      </div>

      <style>{`
        /* ── 푸터 래퍼 ── */
        .mu-footer {
          background: var(--md-surface-container); /* #F2F4F6 — MD3 Surface Container */
          border-top: 1px solid var(--md-outline-variant); /* MD3 Outline Variant */
          padding: var(--md-sp-7) var(--md-sp-4) var(--md-sp-6); /* 28px 16px 24px — MD3 4dp 배수 */
          margin-top: 0;
        }
        .mu-footer__inner {
          max-width: 480px;
          margin: 0 auto;
        }

        /* ── 브랜드 영역 ── */
        .mu-footer__brand {
          margin-bottom: var(--md-sp-5); /* 20px */
        }
        .mu-footer__logo {
          display: flex;
          align-items: center;
          gap: var(--md-sp-2); /* 8px */
          margin-bottom: var(--md-sp-1); /* 4px */
        }
        /* MD3 Title Large */
        .mu-footer__logo-text {
          font-size: var(--md-title-large);      /* 22px — MD3 Title Large */
          line-height: var(--md-title-large-lh);
          letter-spacing: var(--md-title-large-ls);
          font-weight: 800;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-footer__logo-mu { color: var(--md-on-surface); } /* #1C1B1F */
        .mu-footer__logo-un { color: var(--md-primary); }    /* #6B5FFF */
        /* MD3 Body Small */
        .mu-footer__tagline {
          font-size: var(--md-body-small);      /* 12px — MD3 Body Small */
          line-height: var(--md-body-small-lh); /* 16px */
          letter-spacing: var(--md-body-small-ls);
          color: var(--md-on-surface-variant); /* #49454F — MD3 On Surface Variant */
          margin: 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── 링크 그리드 ── */
        .mu-footer__links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0 var(--md-sp-4); /* 0 16px */
          margin-bottom: var(--md-sp-5); /* 20px */
        }
        /* MD3 Label Small (캡션 스타일) */
        .mu-footer__link-heading {
          font-size: var(--md-label-small);      /* 11px — MD3 Label Small */
          line-height: var(--md-label-small-lh);
          letter-spacing: 0.08em; /* 캡션 강조 */
          text-transform: uppercase;
          font-weight: 700;
          color: var(--md-outline); /* #79747E — MD3 Outline (WCAG 개선) */
          margin-bottom: var(--md-sp-3); /* 12px */
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-footer__link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--md-sp-2); /* 8px */
        }
        /* MD3 Body Small */
        .mu-footer__link {
          font-size: var(--md-body-small);      /* 12px — MD3 Body Small */
          line-height: var(--md-body-small-lh); /* 16px */
          letter-spacing: var(--md-body-small-ls);
          color: var(--md-on-surface-variant); /* #49454F — MD3 On Surface Variant */
          text-decoration: none;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
          display: block;
          min-height: 24px; /* 가독성 확보 */
        }
        .mu-footer__link:hover { color: var(--md-on-surface); }

        /* ── SEO 텍스트 ── */
        .mu-footer__seo {
          border-top: 1px solid var(--md-outline-variant); /* MD3 Outline Variant */
          padding-top: var(--md-sp-4); /* 16px */
          margin-top: var(--md-sp-5); /* 20px */
          margin-bottom: var(--md-sp-3); /* 12px */
        }
        /* MD3 Body Small */
        .mu-footer__seo-text {
          font-size: var(--md-body-small);      /* 12px — MD3 Body Small */
          line-height: var(--md-body-small-lh); /* 16px */
          letter-spacing: var(--md-body-small-ls);
          color: var(--md-outline); /* #79747E — MD3 Outline (WCAG 개선: B0B8C1 → 79747E) */
          margin: 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── 카피라이트 ── */
        .mu-footer__copyright {
          text-align: center;
        }
        /* MD3 Body Small */
        .mu-footer__copyright-text {
          font-size: var(--md-body-small);      /* 12px — MD3 Body Small */
          line-height: var(--md-body-small-lh);
          letter-spacing: var(--md-body-small-ls);
          color: var(--md-outline); /* #79747E — MD3 Outline (WCAG 개선) */
          margin: 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
