import React from 'react';
import { Link } from 'wouter';
import { Sparkles, MoonStar, BookOpenText, ShieldCheck } from 'lucide-react';

const footerGroups = [
  {
    title: '주요 서비스',
    links: [
      { href: '/lifelong-saju', label: '평생사주' },
      { href: '/yearly-fortune', label: '신년운세' },
      { href: '/compatibility', label: '궁합' },
      { href: '/manselyeok', label: '만세력' },
    ],
  },
  {
    title: '콘텐츠',
    links: [
      { href: '/guide', label: '운세 칼럼' },
      { href: '/dream', label: '꿈해몽' },
      { href: '/fortune-dictionary', label: '운세 사전' },
      { href: '/more', label: '전체 서비스' },
    ],
  },
  {
    title: '안내',
    links: [
      { href: '/about', label: '무운 소개' },
      { href: '/contact', label: '문의하기' },
      { href: '/privacy', label: '개인정보처리방침' },
      { href: '/terms', label: '이용약관' },
    ],
  },
];

const footerHighlights = [
  { label: '회원가입 없이 이용', Icon: ShieldCheck },
  { label: '무료 사주·운세', Icon: Sparkles },
  { label: '꿈해몽·칼럼·사전 제공', Icon: BookOpenText },
  { label: '모바일 중심 경험', Icon: MoonStar },
] as const;

const Footer: React.FC = () => {
  return (
    <footer className="mu-footer">
      <div className="mu-footer__inner">
        <div className="mu-footer__top">
          <div className="mu-footer__brand">
            <div className="mu-footer__brand-badge">MUUN</div>
            <h2 className="mu-footer__brand-title">무운</h2>
            <p className="mu-footer__brand-copy">
              생년월일만으로 확인하는 무료 사주·운세 플랫폼.
              회원가입 없이 빠르게 보고, 꿈해몽·운세 칼럼·사전까지 한곳에서 이어서 탐색할 수 있도록 정리했습니다.
            </p>
          </div>

          <div className="mu-footer__highlight-grid">
            {footerHighlights.map(({ label, Icon }) => (
              <div key={label} className="mu-footer__highlight-item">
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mu-footer__grid">
          {footerGroups.map((group) => (
            <section key={group.title} className="mu-footer__group" aria-label={group.title}>
              <h3 className="mu-footer__group-title">{group.title}</h3>
              <ul className="mu-footer__group-list">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="mu-footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mu-footer__meta">
          <p>
            무운(MuUn)은 무료 사주풀이, 2026년 신년운세, 토정비결, 궁합, 타로, 꿈해몽, 운세 사전 등 다양한 명리·운세 콘텐츠를 제공합니다.
            검색과 내부 링크를 통해 필요한 페이지에 빠르게 도달할 수 있도록 정보 구조를 계속 개선하고 있습니다.
          </p>
          <p>© {new Date().getFullYear()} MUUN Celestial Services. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        .mu-footer {
          margin-top: 0;
          padding: 28px 16px calc(24px + var(--safe-area-bottom));
          background:
            radial-gradient(circle at top left, rgba(107,95,255,0.12), transparent 30%),
            linear-gradient(180deg, #f8f9fc 0%, #eff1f6 100%);
          border-top: 1px solid rgba(15, 23, 42, 0.08);
        }
        .mu-footer__inner {
          max-width: 1120px;
          margin: 0 auto;
        }
        .mu-footer__top {
          display: grid;
          gap: 18px;
        }
        .mu-footer__brand {
          padding: 22px;
          border-radius: 24px;
          background: rgba(255,255,255,0.94);
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.05);
        }
        .mu-footer__brand-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 30px;
          padding: 0 10px;
          border-radius: 999px;
          background: rgba(107,95,255,0.1);
          color: #5648db;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }
        .mu-footer__brand-title {
          margin: 14px 0 8px;
          font-size: 28px;
          line-height: 1.05;
          letter-spacing: -0.05em;
          font-weight: 800;
          color: #111827;
        }
        .mu-footer__brand-copy {
          margin: 0;
          font-size: 14px;
          line-height: 1.75;
          color: #4b5563;
        }
        .mu-footer__highlight-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .mu-footer__highlight-item {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          padding: 0 14px;
          border-radius: 16px;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(15, 23, 42, 0.08);
          color: #4b5563;
          font-size: 12px;
          font-weight: 700;
        }
        .mu-footer__highlight-item svg {
          color: #5648db;
          flex-shrink: 0;
        }
        .mu-footer__grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 22px;
        }
        .mu-footer__group {
          padding: 18px 16px;
          border-radius: 20px;
          background: rgba(255,255,255,0.86);
          border: 1px solid rgba(15, 23, 42, 0.08);
        }
        .mu-footer__group-title {
          margin: 0 0 12px;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #6b7280;
        }
        .mu-footer__group-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 8px;
        }
        .mu-footer__link {
          text-decoration: none;
          color: #111827;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.4;
        }
        .mu-footer__link:hover {
          color: #5648db;
        }
        .mu-footer__meta {
          margin-top: 18px;
          padding: 18px;
          border-radius: 18px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(15, 23, 42, 0.08);
          color: #6b7280;
          font-size: 12px;
          line-height: 1.8;
        }
        .mu-footer__meta p {
          margin: 0;
        }
        .mu-footer__meta p + p {
          margin-top: 10px;
        }
        @media (max-width: 640px) {
          .mu-footer__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
