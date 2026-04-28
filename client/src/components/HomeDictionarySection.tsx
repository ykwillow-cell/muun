import { Link } from 'wouter';
import { ArrowRight, BookMarked } from 'lucide-react';

const FEATURED_TERMS = [
  { label: '오행', desc: '다섯 가지 기본 기운', slug: '?q=%EC%98%A4%ED%96%89' },
  { label: '십신', desc: '관계와 역할의 기준', slug: '?q=%EC%8B%AD%EC%8B%A0' },
  { label: '대운', desc: '10년 단위 흐름', slug: '?q=%EB%8C%80%EC%9A%B4' },
  { label: '용신', desc: '균형을 돕는 기운', slug: '?q=%EC%9A%A9%EC%8B%A0' },
] as const;

export function HomeDictionarySection() {
  return (
    <section className="mu-home-content-section" aria-labelledby="home-dictionary-title">
      <div className="mu-home-content-section__head">
        <div>
          <p className="mu-section-eyebrow"><BookMarked size={12} /> 사주사전</p>
          <h2 id="home-dictionary-title" className="muun-section-title">자주 찾는 용어</h2>
        </div>
        <Link href="/fortune-dictionary" className="muun-see-all">더보기 <ArrowRight size={12} /></Link>
      </div>
      <div className="mu-home-term-grid">
        {FEATURED_TERMS.map((term, index) => (
          <Link key={term.slug} href={term.slug.startsWith('?') ? `/fortune-dictionary${term.slug}` : `/dictionary/${term.slug}`} className={`mu-home-term-card is-${index % 4}`}>
            <div>
              <strong>{term.label}</strong>
              <small>{term.desc}</small>
            </div>
            <ArrowRight size={14} />
          </Link>
        ))}
      </div>
    </section>
  );
}
