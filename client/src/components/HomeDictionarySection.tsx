import { Link } from 'wouter';
import { ArrowRight, BookMarked } from 'lucide-react';

const FEATURED_TERMS = [
  { label: '일주', desc: '나를 나타내는 기둥', href: '/fortune-dictionary?q=%EC%9D%BC%EC%A3%BC' },
  { label: '용신', desc: '필요한 오행', href: '/fortune-dictionary?q=%EC%9A%A9%EC%8B%A0' },
  { label: '대운', desc: '10년 흐름 운세', href: '/fortune-dictionary?q=%EB%8C%80%EC%9A%B4' },
  { label: '십신', desc: '관계와 역할', href: '/fortune-dictionary?q=%EC%8B%AD%EC%8B%A0' },
] as const;

export function HomeDictionarySection() {
  return (
    <section className="dict-sec" aria-labelledby="home-dictionary-title">
      <div className="col-hd">
        <div>
          <div className="col-eyebrow"><BookMarked size={11} /><span className="col-ey">운세 사전</span></div>
          <h2 id="home-dictionary-title" className="col-ht">용어 바로 찾기</h2>
        </div>
        <Link href="/fortune-dictionary" className="col-more">전체 <ArrowRight size={12} /></Link>
      </div>

      <div className="dict-grid">
        {FEATURED_TERMS.map((term) => (
          <Link key={term.label} href={term.href} className="dict-card">
            <div className="dict-hash">#</div>
            <div>
              <p className="dict-name">{term.label}</p>
              <p className="dict-desc">{term.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
