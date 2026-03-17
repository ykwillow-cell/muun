import { Link } from 'wouter';
import { ChevronRight, BookMarked } from 'lucide-react';

/* 대표 용어 — 자주 검색되는 명리학 키워드 */
const FEATURED_TERMS = [
  { label: '일주', desc: '나를 나타내는 핵심 기둥', slug: 'il-ju' },
  { label: '용신', desc: '나에게 유리한 오행', slug: 'yong-sin' },
  { label: '대운', desc: '10년 단위 운의 흐름', slug: 'dae-un' },
  { label: '천간', desc: '하늘의 기운 10가지', slug: 'cheon-gan' },
  { label: '지지', desc: '땅의 기운 12가지', slug: 'ji-ji' },
  { label: '오행', desc: '목·화·토·금·수', slug: 'o-haeng' },
];

export function HomeDictionarySection() {
  return (
    <section className="mu-dict-section" aria-label="운세 사전">

      {/* 섹션 헤더 */}
      <div className="mu-dict-section__header">
        <span className="mu-dict-section__title">
          <BookMarked size={16} aria-hidden="true" />
          운세 사전
        </span>
        <Link href="/fortune-dictionary" className="mu-dict-section__more">
          전체보기 <ChevronRight size={13} aria-hidden="true" />
        </Link>
      </div>

      {/* 용어 그리드 — 2열 */}
      <div className="mu-dict-grid" role="list">
        {FEATURED_TERMS.map((term) => (
          <Link key={term.slug} href="/fortune-dictionary" className="mu-dict-card" role="listitem" aria-label={`${term.label}: ${term.desc}`}>
            <span className="mu-dict-card__term">{term.label}</span>
            <span className="mu-dict-card__desc">{term.desc}</span>
          </Link>
        ))}
      </div>

      {/* 전체 사전 CTA */}
      <Link href="/fortune-dictionary" className="mu-dict-all" aria-label="명리학 용어 전체 보기">
        <div className="mu-dict-all__body">
          <p className="mu-dict-all__title">명리학 용어 전체 보기</p>
          <p className="mu-dict-all__sub">일주·용신·대운·천간·지지 등 100+ 용어</p>
        </div>
        <div className="mu-dict-all__btn" aria-hidden="true">
          <ChevronRight size={16} />
        </div>
      </Link>

      <style>{`
        /* ── 운세 사전 섹션 ── */
        .mu-dict-section {
          padding: 20px 16px 24px;
          background: #ffffff;
        }
        .mu-dict-section__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .mu-dict-section__title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 18px;
          font-weight: 800;
          color: #191f28;
          letter-spacing: -0.03em;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-dict-section__title svg { color: #6B5FFF; }
        .mu-dict-section__more {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 12px;
          font-weight: 600;
          color: #8b95a1;
          text-decoration: none;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-dict-section__more:hover { color: #4e5968; }

        /* ── 용어 그리드 ── */
        .mu-dict-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 8px;
        }

        /* ── 용어 카드 ── */
        .mu-dict-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 14px 16px;
          background: #ffffff;
          border-radius: 14px;
          text-decoration: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: box-shadow 0.15s, transform 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-dict-card:hover {
          box-shadow: 0 4px 12px rgba(107,95,255,0.12);
          transform: translateY(-1px);
        }
        .mu-dict-card:active { opacity: 0.85; }
        .mu-dict-card__term {
          font-size: 16px;
          font-weight: 700;
          color: #191f28;
          letter-spacing: -0.3px;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-dict-card__desc {
          font-size: 11px;
          color: #8b95a1;
          line-height: 1.4;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── 전체 사전 CTA ── */
        .mu-dict-all {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: #ffffff;
          border-radius: 14px;
          text-decoration: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: background 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-dict-all:hover { background: #f8f9fa; }
        .mu-dict-all__body {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .mu-dict-all__title {
          font-size: 14px;
          font-weight: 600;
          color: #191f28;
          margin: 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-dict-all__sub {
          font-size: 12px;
          color: #8b95a1;
          margin: 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-dict-all__btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f0edff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6B5FFF;
          flex-shrink: 0;
        }
      `}</style>
    </section>
  );
}
