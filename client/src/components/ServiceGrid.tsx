import { Link } from "wouter";

interface ServiceItem {
  num: string;
  label: string;
  sub?: string;
  href: string;
  isNew?: boolean;
  isHot?: boolean;
}

/* 인기 서비스 4개 — 2×2 */
const POPULAR_SERVICES: ServiceItem[] = [
  { num: "01", label: "궁합",    sub: "사주 오행 조화 분석",     href: "/compatibility" },
  { num: "02", label: "평생사주", sub: "타고난 기질과 운의 흐름", href: "/lifelong-saju" },
  { num: "03", label: "점성술",  sub: "네이탈 차트 분석",        href: "/astrology" },
  { num: "04", label: "타로",    sub: "오늘의 카드 한 장",       href: "/tarot" },
];

/* 더보기 7개 — 항상 노출 */
const MORE_SERVICES: ServiceItem[] = [
  { num: "05", label: "토정비결",    href: "/tojeong" },
  { num: "06", label: "신년운세",    href: "/yearly-fortune" },
  { num: "07", label: "오늘의 운세", href: "/daily-fortune" },
  { num: "08", label: "심리테스트",  href: "/psychology" },
  { num: "09", label: "행운의 점심", href: "/lucky-lunch" },
  { num: "10", label: "꿈해몽",      href: "/dream" },
  { num: "11", label: "만세력",      href: "/manselyeok" },
];

/* 인기 서비스 카드 — 번호 워터마크 + 세로 레이아웃 */
function PopularCard({ item }: { item: ServiceItem }) {
  return (
    <Link href={item.href} className="mu-pop-card" aria-label={item.label}>
      <span className="mu-pop-card__num" aria-hidden="true">{item.num}</span>
      <span className="mu-pop-card__label">{item.label}</span>
      {item.sub && <span className="mu-pop-card__sub">{item.sub}</span>}
      {item.isNew && <span className="mu-badge mu-badge--new">N</span>}
      {item.isHot && <span className="mu-badge mu-badge--hot">HOT</span>}
    </Link>
  );
}

/* 더보기 카드 — 수평 행 레이아웃 */
function MoreCard({ item }: { item: ServiceItem }) {
  return (
    <Link href={item.href} className="mu-more-card" aria-label={item.label}>
      <span className="mu-more-card__icon-box" aria-hidden="true">
        <span className="mu-more-card__num">{item.num}</span>
      </span>
      <span className="mu-more-card__label">{item.label}</span>
      <svg className="mu-more-card__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  );
}

export function ServiceGrid() {
  return (
    <section className="mu-service-grid" aria-label="전체 서비스">

      {/* ── 인기 서비스 2×2 ── */}
      <div className="mu-section-header">
        <span className="mu-section-label">인기 서비스</span>
      </div>
      <div className="mu-service-grid__popular" role="list">
        {POPULAR_SERVICES.map((s) => (
          <div key={s.href} role="listitem">
            <PopularCard item={s} />
          </div>
        ))}
      </div>

      {/* ── 작명소 Spotlight ── */}
      <Link href="/naming" className="mu-naming-spotlight" aria-label="사주 기반 작명소 바로가기">
        <div className="mu-naming-spotlight__left">
          <span className="mu-naming-spotlight__badge">
            <span className="mu-naming-spotlight__badge-dot" aria-hidden="true" />
            NEW
          </span>
          <p className="mu-naming-spotlight__title">사주 기반 작명소</p>
          <p className="mu-naming-spotlight__sub">81수리 성명학으로 이름의 운을 분석합니다</p>
          <span className="mu-naming-spotlight__cta">분석하기 →</span>
        </div>
        <div className="mu-naming-spotlight__visual" aria-hidden="true">字</div>
      </Link>

      {/* ── 더보기 2열 수평 행 ── */}
      <div className="mu-section-header">
        <span className="mu-section-label">더보기</span>
      </div>
      <div className="mu-service-grid__more" role="list">
        {MORE_SERVICES.map((s) => (
          <div key={s.href} role="listitem">
            <MoreCard item={s} />
          </div>
        ))}
      </div>

      <style>{`
        /* ── 섹션 래퍼 ── */
        .mu-service-grid {
          padding: 16px 16px 20px;
          background: #f2f4f6;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .mu-section-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .mu-section-label {
          font-size: 11px;
          font-weight: 600;
          color: #8b95a1;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ── 인기 서비스 2×2 ── */
        .mu-service-grid__popular {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }

        /* ── 인기 서비스 카드 ── */
        .mu-pop-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          padding: 16px 14px 14px;
          border-radius: 16px;
          background: #ffffff;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.12s;
          -webkit-tap-highlight-color: transparent;
          min-height: 90px;
        }
        .mu-pop-card:hover { transform: translateY(-2px); }
        .mu-pop-card:active { transform: scale(0.97); }
        .mu-pop-card__num {
          position: absolute;
          bottom: -4px;
          right: 8px;
          font-size: 40px;
          font-weight: 900;
          color: rgba(107,95,255,0.07);
          line-height: 1;
          pointer-events: none;
          user-select: none;
          letter-spacing: -2px;
        }
        .mu-pop-card__label {
          font-size: 15px;
          font-weight: 700;
          color: #191f28;
          letter-spacing: -0.3px;
          position: relative;
          z-index: 1;
        }
        .mu-pop-card__sub {
          font-size: 11px;
          color: #8b95a1;
          line-height: 1.3;
          position: relative;
          z-index: 1;
        }

        /* ── 배지 ── */
        .mu-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 9px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 100px;
          line-height: 1.4;
          z-index: 2;
        }
        .mu-badge--new {
          background: rgba(107,95,255,0.12);
          color: #6B5FFF;
        }
        .mu-badge--hot {
          background: rgba(239,68,68,0.10);
          color: #dc2626;
        }

        /* ── 작명소 Spotlight ── */
        .mu-naming-spotlight {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 18px;
          border-radius: 16px;
          background: #ffffff;
          text-decoration: none;
          margin-bottom: 12px;
          overflow: hidden;
          transition: transform 0.12s;
          -webkit-tap-highlight-color: transparent;
          position: relative;
        }
        .mu-naming-spotlight:hover { transform: translateY(-2px); }
        .mu-naming-spotlight:active { opacity: 0.90; }
        .mu-naming-spotlight__left { flex: 1; }
        .mu-naming-spotlight__badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 600;
          color: #6B5FFF;
          background: rgba(107,95,255,0.10);
          border-radius: 100px;
          padding: 2px 8px;
          margin-bottom: 8px;
          letter-spacing: 0.04em;
        }
        .mu-naming-spotlight__badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #6B5FFF;
          animation: live-pulse 1.5s ease-in-out infinite;
        }
        .mu-naming-spotlight__title {
          font-size: 17px;
          font-weight: 700;
          color: #191f28;
          letter-spacing: -0.4px;
          margin: 0 0 4px;
        }
        .mu-naming-spotlight__sub {
          font-size: 12px;
          color: #4e5968;
          margin: 0 0 10px;
          line-height: 1.4;
        }
        .mu-naming-spotlight__cta {
          font-size: 13px;
          font-weight: 600;
          color: #6B5FFF;
        }
        .mu-naming-spotlight__visual {
          font-size: 52px;
          font-weight: 900;
          color: rgba(107,95,255,0.10);
          font-family: 'Noto Serif KR', serif;
          flex-shrink: 0;
          margin-left: 12px;
          letter-spacing: -2px;
          line-height: 1;
        }

        /* ── 더보기 2열 ── */
        .mu-service-grid__more {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        /* ── 더보기 카드 (수평 행) ── */
        .mu-more-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 12px;
          border-radius: 14px;
          background: #ffffff;
          text-decoration: none;
          transition: background 0.12s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-more-card:hover { background: #f8f9fa; }
        .mu-more-card:active { opacity: 0.80; }
        .mu-more-card__icon-box {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(107,95,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .mu-more-card__num {
          font-size: 12px;
          font-weight: 700;
          color: #6B5FFF;
          letter-spacing: -0.5px;
        }
        .mu-more-card__label {
          flex: 1;
          font-size: 13px;
          font-weight: 500;
          color: #191f28;
          letter-spacing: -0.2px;
        }
        .mu-more-card__arrow {
          color: #c5ccd4;
          flex-shrink: 0;
        }

        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </section>
  );
}
