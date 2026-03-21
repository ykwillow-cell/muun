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
          padding: var(--md-sp-5) var(--md-sp-4); /* 20px 16px — MD3 4dp 배수 */
          margin-bottom: 0;
          background: var(--md-surface-container); /* #F2F4F6 — MD3 Surface Container */
        }
        .mu-dict-section__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--md-sp-3); /* 12px — MD3 4dp 배수 */
        }
        /* MD3 Title Large */
        .mu-dict-section__title {
          display: flex;
          align-items: center;
          gap: var(--md-sp-1); /* 4px */
          font-size: var(--md-title-large);      /* 22px — MD3 Title Large */
          line-height: var(--md-title-large-lh); /* 28px */
          letter-spacing: var(--md-title-large-ls);
          font-weight: 800;
          color: var(--md-on-surface); /* #1C1B1F — MD3 On Surface */
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-dict-section__title svg { color: var(--md-primary); } /* #6B5FFF — MD3 Primary */
        /* MD3 Label Medium */
        .mu-dict-section__more {
          display: flex;
          align-items: center;
          gap: var(--md-sp-1); /* 4px */
          font-size: var(--md-label-medium);      /* 12px — MD3 Label Medium */
          line-height: var(--md-label-medium-lh);
          letter-spacing: var(--md-label-medium-ls);
          font-weight: 600;
          color: var(--md-on-surface-variant); /* #49454F — MD3 On Surface Variant */
          text-decoration: none;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-dict-section__more:hover { color: var(--md-on-surface); }

        /* ── 용어 그리드 ── */
        .mu-dict-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--md-sp-2); /* 8px — MD3 4dp 배수 */
          margin-bottom: var(--md-sp-2); /* 8px */
        }

        /* ── 용어 카드 (MD3 Outlined Card) ── */
        .mu-dict-card {
          display: flex;
          flex-direction: column;
          gap: var(--md-sp-1); /* 4px — MD3 4dp */
          padding: var(--md-sp-3) var(--md-sp-4); /* 12px 16px */
          min-height: 48px; /* MD3 터치타겟 최소 48dp */
          background: var(--md-surface-container-lowest); /* #ffffff */
          border: 1px solid var(--md-outline-variant); /* MD3 Outlined Card 테두리 */
          border-radius: var(--md-shape-md); /* 12px — MD3 Medium shape */
          text-decoration: none;
          box-shadow: none;
          transition: box-shadow 0.15s, transform 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-dict-card:hover {
          box-shadow: var(--card-shadow-hover, var(--md-elev-1)); /* 어드민 card-shadow-hover 우선, fallback: MD3 Elevation 1 */
          transform: translateY(-1px);
        }
        .mu-dict-card:active { opacity: 0.85; }
        /* MD3 Title Medium */
        .mu-dict-card__term {
          font-size: var(--md-title-medium);      /* 16px — MD3 Title Medium */
          line-height: var(--md-title-medium-lh); /* 24px */
          letter-spacing: var(--md-title-medium-ls);
          font-weight: 700;
          color: var(--md-on-surface); /* #1C1B1F */
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        /* MD3 Body Small */
        .mu-dict-card__desc {
          font-size: var(--md-body-small);      /* 12px — MD3 Body Small */
          line-height: var(--md-body-small-lh); /* 16px */
          letter-spacing: var(--md-body-small-ls);
          color: var(--md-on-surface-variant); /* #49454F */
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── 전체 사전 CTA (MD3 List Item 스타일) ── */
        .mu-dict-all {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--md-sp-3) var(--md-sp-4); /* 12px 16px */
          min-height: 48px; /* MD3 터치타겟 최소 48dp */
          background: var(--md-surface-container-lowest); /* #ffffff */
          border: 1px solid var(--md-outline-variant); /* MD3 Outlined Card */
          border-radius: var(--md-shape-md); /* 12px — MD3 Medium shape */
          text-decoration: none;
          box-shadow: none;
          transition: background 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-dict-all:hover { background: var(--md-surface-container-low); } /* MD3 hover: Surface Container Low */
        .mu-dict-all__body {
          display: flex;
          flex-direction: column;
          gap: var(--md-sp-1); /* 4px */
        }
        /* MD3 Title Small */
        .mu-dict-all__title {
          font-size: var(--md-title-small);      /* 14px — MD3 Title Small */
          line-height: var(--md-title-small-lh); /* 20px */
          letter-spacing: var(--md-title-small-ls);
          font-weight: 600;
          color: var(--md-on-surface); /* #1C1B1F */
          margin: 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        /* MD3 Body Small */
        .mu-dict-all__sub {
          font-size: var(--md-body-small);      /* 12px — MD3 Body Small */
          line-height: var(--md-body-small-lh); /* 16px */
          letter-spacing: var(--md-body-small-ls);
          color: var(--md-on-surface-variant); /* #49454F */
          margin: 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-dict-all__btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--md-primary-container); /* #E8E4FF — MD3 Primary Container */
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--md-primary); /* #6B5FFF — MD3 Primary */
          flex-shrink: 0;
        }
      `}</style>
    </section>
  );
}
