import { Link } from 'wouter';
import { ArrowRight, BookMarked } from 'lucide-react';

const FEATURED_TERMS = [
  { label: '일주', desc: '나를 나타내는 기둥', slug: 'il-ju' },
  { label: '용신', desc: '필요한 오행', slug: 'yong-sin' },
  { label: '대운', desc: '10년 흐름 운세', slug: 'dae-un' },
  { label: '십신', desc: '관계와 역할', slug: 'sip-sin' },
] as const;

export function HomeDictionarySection() {
  return (
    <section className="muun-dictionary-section" aria-labelledby="home-dictionary-title">
      <div className="muun-section-row muun-section-row--compact">
        <div>
          <p className="muun-section-eyebrow"><BookMarked size={12} aria-hidden="true" /> 운세 사전</p>
          <h2 id="home-dictionary-title" className="muun-section-title">용어 바로 찾기</h2>
        </div>
        <Link href="/fortune-dictionary" className="muun-see-all">전체 <ArrowRight size={12} aria-hidden="true" /></Link>
      </div>

      <div className="muun-term-grid">
        {FEATURED_TERMS.map((term) => (
          <Link key={term.slug} href={`/dictionary/${term.slug}`} className="muun-term-card">
            <span className="muun-term-hash" aria-hidden="true">#</span>
            <span className="muun-term-copy">
              <strong>{term.label}</strong>
              <small>{term.desc}</small>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
