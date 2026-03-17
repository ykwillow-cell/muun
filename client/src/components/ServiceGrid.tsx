import { Link } from "wouter";

interface ServiceItem {
  emoji: string;
  label: string;
  sub?: string;
  href: string;
  isNew?: boolean;
  isHot?: boolean;
  iconBg?: string;
}

interface MoreItem {
  emoji: string;
  label: string;
  desc: string;
  href: string;
  fullWidth?: boolean;
}

/* 인기 서비스 4개 — 2×2 */
const POPULAR_SERVICES: ServiceItem[] = [
  { emoji: "⚖", label: "궁합",    sub: "사주 오행 조화 분석",     href: "/compatibility",  iconBg: "rgba(107,95,255,0.10)" },
  { emoji: "☯", label: "평생사주", sub: "타고난 기질과 운의 흐름", href: "/lifelong-saju",  iconBg: "rgba(107,95,255,0.10)" },
  { emoji: "✦", label: "점성술",  sub: "네이탈 차트 분석",        href: "/astrology",      iconBg: "rgba(96,200,212,0.12)" },
  { emoji: "🃏", label: "타로",    sub: "오늘의 카드 한 장",       href: "/tarot",          iconBg: "rgba(240,68,82,0.08)" },
];

/* 더보기 7개 */
const MORE_SERVICES: MoreItem[] = [
  { emoji: "📅", label: "만세력",      desc: "사주팔자 조회",     href: "/manselyeok" },
  { emoji: "📜", label: "토정비결",    desc: "월별 운세",         href: "/tojeong" },
  { emoji: "💭", label: "꿈해몽",      desc: "350+ 해석",         href: "/dream" },
  { emoji: "🧠", label: "심리테스트",  desc: "성향 분석",         href: "/psychology" },
  { emoji: "👨‍👩‍👧", label: "가족사주",    desc: "오행 조화",         href: "/family-saju" },
  { emoji: "🔀", label: "MBTI 궁합",  desc: "사주×MBTI",         href: "/hybrid-compatibility" },
  { emoji: "🌙", label: "오늘의운세",  desc: "일별 운세 상세 보기", href: "/daily-fortune", fullWidth: true },
];

/* 인기 서비스 카드 */
function PopularCard({ item }: { item: ServiceItem }) {
  return (
    <Link href={item.href} className="mu-pop-card" aria-label={item.label}>
      <div className="mu-pop-card__top">
        <div className="mu-pop-card__icon" style={{ background: item.iconBg }} aria-hidden="true">
          {item.emoji}
        </div>
        <span className="mu-pop-card__arrow" aria-hidden="true">›</span>
      </div>
      <span className="mu-pop-card__label">{item.label}</span>
      {item.sub && <span className="mu-pop-card__sub">{item.sub}</span>}
      {item.isNew && <span className="mu-badge mu-badge--new">N</span>}
      {item.isHot && <span className="mu-badge mu-badge--hot">HOT</span>}
    </Link>
  );
}

/* 더보기 카드 */
function MoreCard({ item }: { item: MoreItem }) {
  return (
    <Link
      href={item.href}
      className={`mu-more-card${item.fullWidth ? " mu-more-card--full" : ""}`}
      aria-label={item.label}
    >
      <span className="mu-more-card__icon" aria-hidden="true">
        <span>{item.emoji}</span>
      </span>
      <span className="mu-more-card__body">
        <span className="mu-more-card__label">{item.label}</span>
        <span className="mu-more-card__desc">{item.desc}</span>
      </span>
    </Link>
  );
}

export function ServiceGrid() {
  return (
    <section className="mu-service-grid" aria-label="전체 서비스">

      {/* ── 인기 서비스 2×2 ── */}
      <div className="mu-section-header">
        <span className="mu-section-label">인기 서비스</span>
        <Link href="/more" className="mu-section-more">전체보기 →</Link>
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
          <span className="mu-naming-spotlight__cta">이름 추천받기 →</span>
        </div>
        <div className="mu-naming-spotlight__visual" aria-hidden="true">字</div>
      </Link>

      {/* ── 더보기 2열 그리드 ── */}
      <div className="mu-section-header mu-section-header--more">
        <span className="mu-section-label">더보기</span>
      </div>
      <div className="mu-service-grid__more" role="list">
        {MORE_SERVICES.map((s) => (
          <div key={s.href} role="listitem" style={s.fullWidth ? { gridColumn: "1 / -1" } : {}}>
            <MoreCard item={s} />
          </div>
        ))}
      </div>

      <style>{`
        /* ── 섹션 래퍼 ── */
        .mu-service-grid {
          padding: 20px 16px 20px;
          background: #f2f4f6;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .mu-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .mu-section-header--more {
          margin-top: 16px;
        }
        .mu-section-label {
          font-size: 18px;
          font-weight: 800;
          color: #191f28;
          letter-spacing: -0.03em;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-section-more {
          font-size: 12px;
          font-weight: 600;
          color: #8b95a1;
          text-decoration: none;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-section-more:hover { color: #4e5968; }

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
          gap: 6px;
          padding: 16px 14px 14px;
          border-radius: 16px;
          background: #ffffff;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.12s, box-shadow 0.12s;
          -webkit-tap-highlight-color: transparent;
          min-height: 100px;
          box-shadow: 0 2px 8px rgba(0,0,0,.05), 0 6px 18px rgba(0,0,0,.06);
        }
        .mu-pop-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,.10); }
        .mu-pop-card:active { transform: scale(0.97); }
        .mu-pop-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .mu-pop-card__icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .mu-pop-card__arrow {
          font-size: 20px;
          color: #d1d6db;
          line-height: 1;
          font-weight: 300;
        }
        .mu-pop-card__label {
          font-size: 15px;
          font-weight: 700;
          color: #191f28;
          letter-spacing: -0.3px;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-pop-card__sub {
          font-size: 11px;
          color: #8b95a1;
          line-height: 1.3;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
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
          background: #f0edff;
          text-decoration: none;
          margin-bottom: 0;
          overflow: hidden;
          transition: transform 0.12s;
          -webkit-tap-highlight-color: transparent;
          position: relative;
          box-shadow: 0 1px 4px rgba(107,95,255,0.08);
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
          background: rgba(107,95,255,0.15);
          border-radius: 100px;
          padding: 2px 8px;
          margin-bottom: 8px;
          letter-spacing: 0.04em;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
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
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-naming-spotlight__sub {
          font-size: 12px;
          color: #4e5968;
          margin: 0 0 10px;
          line-height: 1.4;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-naming-spotlight__cta {
          font-size: 13px;
          font-weight: 600;
          color: #6B5FFF;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-naming-spotlight__visual {
          font-size: 56px;
          font-weight: 900;
          color: rgba(107,95,255,0.10);
          font-family: 'Noto Serif KR', serif;
          flex-shrink: 0;
          margin-left: 12px;
          letter-spacing: -2px;
          line-height: 1;
        }

        /* ── 더보기 2열 그리드 ── */
        .mu-service-grid__more {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        /* ── 더보기 카드 ── */
        .mu-more-card {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 12px;
          border-radius: 12px;
          background: #F2F4F6;
          text-decoration: none;
          transition: background 0.12s;
          -webkit-tap-highlight-color: transparent;
          min-height: 50px;
        }
        .mu-more-card:hover { background: #eaecef; }
        .mu-more-card:active { opacity: 0.80; }
        .mu-more-card--full {
          grid-column: 1 / -1;
        }
        .mu-more-card__icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          line-height: 1;
          flex-shrink: 0;
        }
        .mu-more-card__body {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }
        .mu-more-card__label {
          font-size: 13px;
          font-weight: 600;
          color: #191f28;
          letter-spacing: -0.2px;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-more-card__desc {
          font-size: 11px;
          color: #8b95a1;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </section>
  );
}
