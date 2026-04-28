import { Link } from 'wouter';

const groups = [
  {
    title: '서비스',
    links: [
      { href: '/daily-fortune', label: '오늘의 운세' },
      { href: '/lifelong-saju', label: '평생사주' },
      { href: '/compatibility', label: '궁합' },
      { href: '/fortune-dictionary', label: '사주사전' },
    ],
  },
  {
    title: '콘텐츠',
    links: [
      { href: '/dream', label: '꿈해몽' },
      { href: '/guide', label: '운세 칼럼' },
      { href: '/manselyeok', label: '만세력' },
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

const Footer = () => {
  return (
    <footer className="mu-footer-modern">
      <div className="mu-footer-modern__inner">
        <div className="mu-footer-modern__brand">
          <img src="/images/muun-mark.svg" alt="" width="28" height="28" aria-hidden="true" />
          <div>
            <strong>무운사주</strong>
            <p>회원가입 없이 보는 무료 사주·운세 서비스</p>
          </div>
        </div>
        <div className="mu-footer-modern__grid">
          {groups.map((group) => (
            <section key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mu-footer-modern__copy">© {new Date().getFullYear()} MUUN. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
