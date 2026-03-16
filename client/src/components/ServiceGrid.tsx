import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ServiceItem {
  emoji: string;
  label: string;
  href: string;
  color: string;
  bg: string;
  isNew?: boolean;
  isHot?: boolean;
}

const POPULAR_SERVICES: ServiceItem[] = [
  { emoji: "🌟", label: "신년운세",    href: "/yearly-fortune",       color: "#f5c842", bg: "rgba(245,200,66,0.12)" },
  { emoji: "✨", label: "평생사주",    href: "/lifelong-saju",        color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  { emoji: "💑", label: "궁합",        href: "/compatibility",        color: "#ec4899", bg: "rgba(236,72,153,0.12)" },
  { emoji: "🃏", label: "타로",        href: "/tarot",                color: "#a78bfa", bg: "rgba(167,139,250,0.12)", isHot: true },
  { emoji: "🌙", label: "오늘의 운세", href: "/daily-fortune",        color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  { emoji: "🔮", label: "점성술",      href: "/astrology",            color: "#2dd4bf", bg: "rgba(45,212,191,0.12)" },
];

const MORE_SERVICES: ServiceItem[] = [
  { emoji: "👨‍👩‍👧‍👦", label: "가족사주",      href: "/family-saju",          color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  { emoji: "🧠", label: "사주×MBTI",   href: "/hybrid-compatibility", color: "#c084fc", bg: "rgba(192,132,252,0.12)", isNew: true },
  { emoji: "💭", label: "꿈해몽",       href: "/dream",                color: "#818cf8", bg: "rgba(129,140,248,0.12)" },
  { emoji: "🌏", label: "만세력",       href: "/manse",                color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
  { emoji: "🧬", label: "심리테스트",   href: "/psychology",           color: "#f472b6", bg: "rgba(244,114,182,0.12)", isNew: true },
  { emoji: "⭐", label: "별자리 운세",  href: "/star-fortune",         color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  { emoji: "🀄", label: "사주 칼럼",   href: "/column",               color: "#64748b", bg: "rgba(100,116,139,0.12)" },
];

function ServiceCard({ item }: { item: ServiceItem }) {
  return (
    <Link
      href={item.href}
      className="mu-service-card"
      style={{ "--sc-bg": item.bg, "--sc-color": item.color } as React.CSSProperties}
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
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="mu-service-grid" aria-label="전체 서비스">
      {/* 인기 서비스 */}
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

      {/* 더보기 */}
      <button
        className="mu-more-toggle"
        onClick={() => setShowMore((p) => !p)}
        aria-expanded={showMore}
        aria-controls="mu-more-services"
      >
        <span className="mu-section-label">더보기</span>
        {showMore
          ? <ChevronUp size={14} className="mu-more-toggle__icon" />
          : <ChevronDown size={14} className="mu-more-toggle__icon" />
        }
      </button>

      {showMore && (
        <div
          id="mu-more-services"
          className="mu-service-grid__more"
          role="list"
        >
          {MORE_SERVICES.map((s) => (
            <div key={s.href} role="listitem">
              <ServiceCard item={s} />
            </div>
          ))}
        </div>
      )}

      <style>{`
        .mu-service-grid {
          padding: 0 16px 8px;
        }
        .mu-section-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        .mu-section-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        /* 인기 서비스 그리드 */
        .mu-service-grid__popular {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }
        /* 서비스 카드 */
        .mu-service-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 8px;
          border-radius: 14px;
          background: var(--sc-bg, rgba(255,255,255,0.05));
          border: 1px solid rgba(255,255,255,0.07);
          text-decoration: none;
          position: relative;
          transition: transform 0.12s, background 0.12s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-service-card:hover { transform: translateY(-2px); }
        .mu-service-card:active { transform: scale(0.97); }
        .mu-service-card__icon {
          font-size: 24px;
          line-height: 1;
        }
        .mu-service-card__label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          text-align: center;
          white-space: nowrap;
        }
        .mu-service-card__badge {
          position: absolute;
          top: 6px;
          right: 6px;
          font-size: 9px;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 100px;
          line-height: 1.4;
        }
        .mu-service-card__badge--new {
          background: oklch(0.55 0.2 145 / 0.25);
          color: #4ade80;
          border: 1px solid oklch(0.55 0.2 145 / 0.3);
        }
        .mu-service-card__badge--hot {
          background: oklch(0.6 0.2 20 / 0.2);
          color: #f87171;
          border: 1px solid oklch(0.6 0.2 20 / 0.3);
        }
        /* 작명소 Spotlight */
        .mu-naming-spotlight {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(245,200,66,0.12) 0%, rgba(245,200,66,0.04) 100%);
          border: 1px solid oklch(0.85 0.18 85 / 0.2);
          text-decoration: none;
          margin-bottom: 12px;
          position: relative;
          overflow: hidden;
          transition: opacity 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-naming-spotlight:active { opacity: 0.85; }
        .mu-naming-spotlight__left { flex: 1; }
        .mu-naming-spotlight__badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 700;
          color: oklch(0.85 0.18 85);
          background: oklch(0.85 0.18 85 / 0.12);
          border: 1px solid oklch(0.85 0.18 85 / 0.25);
          border-radius: 100px;
          padding: 2px 8px;
          margin-bottom: 8px;
          letter-spacing: 0.04em;
        }
        .mu-naming-spotlight__badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: oklch(0.85 0.18 85);
          animation: live-pulse 1.5s ease-in-out infinite;
        }
        .mu-naming-spotlight__title {
          font-size: 16px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
          margin: 0 0 4px;
        }
        .mu-naming-spotlight__sub {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin: 0;
          line-height: 1.4;
        }
        .mu-naming-spotlight__visual {
          font-size: 40px;
          font-weight: 800;
          color: oklch(0.85 0.18 85);
          opacity: 0.2;
          font-family: 'Noto Serif KR', serif;
          flex-shrink: 0;
          margin-left: 12px;
          letter-spacing: -0.02em;
        }
        /* 더보기 토글 */
        .mu-more-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 10px 0;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Pretendard', sans-serif;
          margin-bottom: 4px;
        }
        .mu-more-toggle__icon {
          color: rgba(255,255,255,0.3);
        }
        /* 더보기 그리드 */
        .mu-service-grid__more {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          animation: fade-in 0.2s ease;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </section>
  );
}
