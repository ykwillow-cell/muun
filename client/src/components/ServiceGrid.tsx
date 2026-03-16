import { Link } from "wouter";

interface ServiceItem {
  emoji: string;
  label: string;
  href: string;
  isNew?: boolean;
  isHot?: boolean;
}

/* 항목 3: 인기 서비스 4개, 순서: 궁합 → 평생사주 → 점성술 → 타로 */
const POPULAR_SERVICES: ServiceItem[] = [
  { emoji: "💑", label: "궁합",    href: "/compatibility" },
  { emoji: "✨", label: "평생사주", href: "/lifelong-saju" },
  { emoji: "🔮", label: "점성술",  href: "/astrology" },
  { emoji: "🃏", label: "타로",    href: "/tarot" },
];

/* 더보기 7개 — 항상 노출 */
const MORE_SERVICES: ServiceItem[] = [
  { emoji: "📜", label: "토정비결",    href: "/tojeong" },
  { emoji: "🌟", label: "신년운세",    href: "/yearly-fortune" },
  { emoji: "🌙", label: "오늘의 운세", href: "/daily-fortune" },
  { emoji: "🧬", label: "심리테스트",  href: "/psychology" },
  { emoji: "☕", label: "행운의 점심", href: "/lucky-lunch" },
  { emoji: "💭", label: "꿈해몽",      href: "/dream" },
  { emoji: "🌏", label: "만세력",      href: "/manselyeok" },
];

function ServiceCard({ item }: { item: ServiceItem }) {
  return (
    <Link
      href={item.href}
      className="mu-service-card"
      aria-label={item.label}
    >
      <span className="mu-service-card__icon" aria-hidden="true">{item.emoji}</span>
      <span className="mu-service-card__label">{item.label}</span>
      {item.isNew && (
        <span className="mu-service-card__badge mu-service-card__badge--new" aria-label="신규">N</span>
      )}
      {item.isHot && (
        <span className="mu-service-card__badge mu-service-card__badge--hot" aria-label="인기">HOT</span>
      )}
    </Link>
  );
}

export function ServiceGrid() {
  return (
    <section className="mu-service-grid" aria-label="전체 서비스">

      {/* 인기 서비스 — 2×2 고정 */}
      <div className="mu-section-header">
        <span className="mu-section-label">인기 서비스</span>
      </div>
      <div className="mu-service-grid__popular" role="list">
        {POPULAR_SERVICES.map((s) => (
          <div key={s.href} role="listitem">
            <ServiceCard item={s} />
          </div>
        ))}
      </div>

      {/* 작명소 Spotlight */}
      <Link href="/naming" className="mu-naming-spotlight" aria-label="사주 기반 작명소 바로가기">
        <div className="mu-naming-spotlight__left">
          <span className="mu-naming-spotlight__badge">
            <span className="mu-naming-spotlight__badge-dot" aria-hidden="true" />
            NEW
          </span>
          <p className="mu-naming-spotlight__title">사주 기반 작명소</p>
          <p className="mu-naming-spotlight__sub">81수리 성명학으로 이름의 운을 분석합니다</p>
        </div>
        <div className="mu-naming-spotlight__visual" aria-hidden="true">字</div>
      </Link>

      {/* 더보기 — 항목 1: 아코디언 없이 항상 노출, 2×3 그리드 */}
      <div className="mu-section-header">
        <span className="mu-section-label">더보기</span>
      </div>
      <div className="mu-service-grid__more" role="list">
        {MORE_SERVICES.map((s) => (
          <div key={s.href} role="listitem">
            <ServiceCard item={s} />
          </div>
        ))}
      </div>

      <style>{`
        .mu-service-grid {
          padding: 12px 16px 16px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .mu-section-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .mu-section-label {
          font-size: 11px;
          font-weight: 500;
          color: #5a5a56;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        /* 인기 서비스 — 2×2 */
        .mu-service-grid__popular {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }
        /* 더보기 — 2×3 (6칸) + 나머지 */
        .mu-service-grid__more {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 0;
        }
        /* 서비스 카드 */
        .mu-service-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 8px;
          border-radius: 12px;
          background: #ffffff;
          border: 0.5px solid rgba(0,0,0,0.10);
          text-decoration: none;
          position: relative;
          transition: transform 0.12s, box-shadow 0.12s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-service-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .mu-service-card:active { transform: scale(0.97); }
        .mu-service-card__icon {
          font-size: 24px;
          line-height: 1;
        }
        .mu-service-card__label {
          font-size: 12px;
          font-weight: 500;
          color: #1a1a18;
          text-align: center;
          white-space: nowrap;
        }
        .mu-service-card__badge {
          position: absolute;
          top: 6px;
          right: 6px;
          font-size: 9px;
          font-weight: 500;
          padding: 1px 5px;
          border-radius: 100px;
          line-height: 1.4;
        }
        .mu-service-card__badge--new {
          background: rgba(74,222,128,0.15);
          color: #16a34a;
          border: 1px solid rgba(74,222,128,0.3);
        }
        .mu-service-card__badge--hot {
          background: rgba(248,113,113,0.12);
          color: #dc2626;
          border: 1px solid rgba(248,113,113,0.25);
        }
        /* 작명소 Spotlight */
        .mu-naming-spotlight {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          border-radius: 12px;
          background: #ffffff;
          border: 0.5px solid rgba(0,0,0,0.10);
          text-decoration: none;
          margin-bottom: 12px;
          overflow: hidden;
          transition: box-shadow 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-naming-spotlight:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .mu-naming-spotlight:active { opacity: 0.85; }
        .mu-naming-spotlight__left { flex: 1; }
        .mu-naming-spotlight__badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 500;
          color: #5a5a56;
          background: rgba(0,0,0,0.05);
          border: 0.5px solid rgba(0,0,0,0.12);
          border-radius: 100px;
          padding: 2px 8px;
          margin-bottom: 8px;
          letter-spacing: 0.04em;
        }
        .mu-naming-spotlight__badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #1a1a18;
          animation: live-pulse 1.5s ease-in-out infinite;
        }
        .mu-naming-spotlight__title {
          font-size: 16px;
          font-weight: 500;
          color: #1a1a18;
          letter-spacing: -0.02em;
          margin: 0 0 4px;
        }
        .mu-naming-spotlight__sub {
          font-size: 12px;
          color: #5a5a56;
          margin: 0;
          line-height: 1.4;
        }
        .mu-naming-spotlight__visual {
          font-size: 40px;
          font-weight: 500;
          color: #1a1a18;
          opacity: 0.12;
          font-family: 'Noto Serif KR', serif;
          flex-shrink: 0;
          margin-left: 12px;
          letter-spacing: -0.02em;
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </section>
  );
}
