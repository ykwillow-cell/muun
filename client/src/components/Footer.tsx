import React from 'react';
import { Link, useLocation } from 'wouter';

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

const Footer: React.FC = () => {
  const [location] = useLocation();
  const isHome = location === '/';

  return (
    <footer className={`mu-footer${isHome ? ' mu-footer--home' : ''}`}>
      <div className="mu-footer__inner">
        <div className="mu-footer__brand">
          <img src="/images/muun-mark.svg" alt="" width="22" height="22" className="mu-footer__brand-mark" aria-hidden="true" />
          <span>무운</span>
        </div>
        <p className="mu-footer__tagline">무료 사주, 궁합, 꿈해몽, 운세 사전을<br className="sm:hidden" /> 한곳에서 확인할 수 있습니다.</p>

        <div className="mu-footer__links">
          {footerGroups.map((group) => (
            <section key={group.title} className="mu-footer__group" aria-label={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mu-footer__copy">© {new Date().getFullYear()} MUUN Celestial Services. All rights reserved.</p>
      </div>

      <style>{`
        .mu-footer {
          background: #fff;
          border-top: 0.5px solid #ebebf0;
          padding: 20px 16px calc(20px + var(--bottom-nav-height) + var(--safe-area-bottom));
        }
        .mu-footer--home {
          padding-bottom: 20px;
        }
        .mu-footer__inner {
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
        }
        .mu-footer__brand {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
          font-size: 12px;
          font-weight: 900;
          color: #1a1a2e;
        }
        .mu-footer__brand-mark {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          display: block;
        }
        .mu-footer__tagline {
          margin: 0 0 14px;
          font-size: 11px;
          line-height: 1.6;
          color: #aaa;
        }
        .mu-footer__links {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 16px;
        }
        .mu-footer__group h3 {
          margin: 0 0 6px;
          font-size: 11px;
          font-weight: 800;
          color: #888;
        }
        .mu-footer__group ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 4px;
        }
        .mu-footer__group a {
          display: inline-flex;
          text-decoration: none;
          font-size: 11px;
          line-height: 1.35;
          color: #aaa;
        }
        .mu-footer__copy {
          margin: 0;
          padding-top: 12px;
          border-top: 0.5px solid #f0eef8;
          font-size: 10px;
          color: #ccc;
        }
        @media (min-width: 768px) {
          .mu-footer {
            padding-bottom: 24px;
          }
          .mu-footer__tagline,
          .mu-footer__group a,
          .mu-footer__group h3 {
            font-size: 12px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
