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
  { emoji: "✦", label: "점성술",  sub: "네이탈 차트 분석",        href: "/astrology",      iconBg: "rgba(107,95,255,0.10)" },
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
          <span className="mu-naming-spotlight__badge">NEW</span>
          <p className="mu-naming-spotlight__title">사주 기반 작명소</p>
          <p className="mu-naming-spotlight__sub">81수리 성명학으로 이름의 운을 분석합니다</p>
          <span className="mu-naming-spotlight__cta">이름 추천받기 →</span>
        </div>
        <div className="mu-naming-spotlight__visual" aria-hidden="true">字</div>
      </Link>

      {/* ── 더보기 2열 그리드 ── */}
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
          padding: var(--md-sp-5) var(--md-sp-4); /* 20px 16px — MD3 4dp 배수 */
          background: var(--md-surface-container); /* #F2F4F6 — MD3 Surface Container */
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .mu-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--md-sp-3); /* 12px — MD3 4dp 배수 */
        }
        .mu-section-header--more {
          margin-top: var(--md-sp-4); /* 16px */
        }
        /* MD3 Title Large */
        .mu-section-label {
          font-size: var(--md-title-large);      /* 22px — MD3 Title Large */
          line-height: var(--md-title-large-lh); /* 28px */
          letter-spacing: var(--md-title-large-ls);
          font-weight: 800;
          color: var(--md-on-surface); /* #1C1B1F — MD3 On Surface */
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        /* MD3 Label Medium */
        .mu-section-more {
          font-size: var(--md-label-medium);      /* 12px — MD3 Label Medium */
          line-height: var(--md-label-medium-lh);
          letter-spacing: var(--md-label-medium-ls);
          font-weight: 600;
          color: var(--md-on-surface-variant); /* #49454F — MD3 On Surface Variant */
          text-decoration: none;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-section-more:hover { color: var(--md-on-surface); }

        /* ── 인기 서비스 2×2 ── */
        .mu-service-grid__popular {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--md-sp-2); /* 8px — MD3 4dp 배수 */
          margin-bottom: var(--md-sp-3); /* 12px */
        }

        /* ── 인기 서비스 카드 (MD3 Elevated Card) ── */
        .mu-pop-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--md-sp-1); /* 4px — MD3 4dp */
          padding: var(--md-sp-4) var(--md-sp-4) var(--md-sp-3); /* 16px 16px 12px */
          border-radius: var(--md-shape-lg); /* 16px — MD3 Large shape */
          background: var(--md-surface-container-lowest); /* #ffffff — MD3 Surface Container Lowest */
          border: none;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.12s, box-shadow 0.12s;
          -webkit-tap-highlight-color: transparent;
          min-height: 100px;
          box-shadow: var(--card-shadow, var(--md-elev-1)); /* 어드민 card-shadow 우선, fallback: MD3 Elevation 1 */
        }
        .mu-pop-card:hover { transform: translateY(-2px); box-shadow: var(--card-shadow-hover, var(--md-elev-2)); } /* 어드민 card-shadow-hover 우선, fallback: MD3 Elevation 2 */
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
          border-radius: var(--md-shape-md); /* 12px — MD3 Medium shape */
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
        /* MD3 Title Medium */
        .mu-pop-card__label {
          font-size: var(--md-title-medium);      /* 16px — MD3 Title Medium */
          line-height: var(--md-title-medium-lh); /* 24px */
          letter-spacing: var(--md-title-medium-ls);
          font-weight: 700;
          color: var(--md-on-surface); /* #1C1B1F */
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        /* MD3 Body Small */
        .mu-pop-card__sub {
          font-size: var(--md-body-small);      /* 12px — MD3 Body Small */
          line-height: var(--md-body-small-lh); /* 16px */
          letter-spacing: var(--md-body-small-ls);
          color: var(--md-on-surface-variant); /* #49454F */
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── 배지 (MD3 Badge) ── */
        .mu-badge {
          position: absolute;
          top: var(--md-sp-2); /* 8px */
          right: var(--md-sp-2); /* 8px */
          font-size: var(--md-label-small); /* 11px — MD3 Label Small */
          font-weight: 600;
          padding: 2px var(--md-sp-1); /* 2px 4px */
          border-radius: var(--md-shape-full); /* MD3 Badge 완전 둥근 */
          line-height: 1.4;
          z-index: 2;
        }
        .mu-badge--new {
          background: var(--md-primary-container); /* #E8E4FF — MD3 Primary Container */
          color: var(--md-on-primary-container);   /* #1D0080 — MD3 On Primary Container */
        }
        .mu-badge--hot {
          background: var(--md-error-container); /* #F9DEDC — MD3 Error Container */
          color: var(--md-on-error-container);   /* #410E0B — MD3 On Error Container */
        }

        /* ── 작명소 Spotlight (MD3 Filled Card) ── */
        .mu-naming-spotlight {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--md-sp-4); /* 16px — MD3 4dp 배수 */
          border-radius: var(--md-shape-lg); /* 16px — MD3 Large shape */
          background: var(--md-primary-container); /* #E8E4FF — MD3 Primary Container */
          text-decoration: none;
          margin-bottom: var(--md-sp-3); /* 12px */
          overflow: hidden;
          transition: transform 0.12s;
          -webkit-tap-highlight-color: transparent;
          position: relative;
          box-shadow: none; /* MD3 Filled Card: no shadow */
        }
        .mu-naming-spotlight:hover { transform: translateY(-2px); }
        .mu-naming-spotlight:active { opacity: 0.90; }
        .mu-naming-spotlight__left { flex: 1; }
        /* MD3 Label Medium */
        .mu-naming-spotlight__badge {
          display: inline-flex;
          align-items: center;
          font-size: var(--md-label-medium);      /* 12px — MD3 Label Medium */
          line-height: var(--md-label-medium-lh);
          letter-spacing: var(--md-label-medium-ls);
          font-weight: 800;
          color: var(--md-on-primary);  /* #ffffff */
          background: var(--md-primary); /* #6B5FFF */
          border-radius: var(--md-shape-full); /* MD3 Badge 완전 둥근 */
          padding: var(--md-sp-1) var(--md-sp-3); /* 4px 12px */
          margin-bottom: var(--md-sp-2); /* 8px */
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        /* MD3 Title Medium */
        .mu-naming-spotlight__title {
          font-size: var(--md-title-medium);      /* 16px — MD3 Title Medium */
          line-height: var(--md-title-medium-lh); /* 24px */
          letter-spacing: var(--md-title-medium-ls);
          font-weight: 700;
          color: var(--md-on-primary-container); /* #1D0080 — MD3 On Primary Container */
          margin: 0 0 var(--md-sp-1); /* 0 0 4px */
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        /* MD3 Body Small */
        .mu-naming-spotlight__sub {
          font-size: var(--md-body-small);      /* 12px — MD3 Body Small */
          line-height: var(--md-body-small-lh); /* 16px */
          letter-spacing: var(--md-body-small-ls);
          color: var(--md-on-primary-container); /* #1D0080 — MD3 On Primary Container */
          opacity: 0.75;
          margin: 0 0 var(--md-sp-3); /* 0 0 12px */
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        /* MD3 Label Large */
        .mu-naming-spotlight__cta {
          font-size: var(--md-label-large);      /* 14px — MD3 Label Large */
          line-height: var(--md-label-large-lh);
          letter-spacing: var(--md-label-large-ls);
          font-weight: 600;
          color: var(--md-primary); /* #6B5FFF */
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
          gap: var(--md-sp-2); /* 8px — MD3 4dp 배수 */
        }

        /* ── 더보기 카드 (MD3 Elevated Card) ── */
        .mu-more-card {
          display: flex;
          align-items: center;
          gap: var(--md-sp-2); /* 8px — MD3 4dp */
          padding: var(--md-sp-3); /* 12px — MD3 4dp */
          border-radius: var(--md-shape-md); /* 12px — MD3 Medium shape */
          background: var(--md-surface-container-lowest); /* #ffffff */
          text-decoration: none;
          transition: background 0.12s;
          -webkit-tap-highlight-color: transparent;
          min-height: 48px; /* MD3 터치타겟 최소 48dp */
          box-shadow: var(--card-shadow, var(--md-elev-1)); /* 어드민 card-shadow 우선, fallback: MD3 Elevation 1 */
        }
        .mu-more-card:hover { background: var(--md-surface-container-low); } /* MD3 hover: Surface Container Low */
        .mu-more-card:active { opacity: 0.80; }
        .mu-more-card--full {
          grid-column: 1 / -1;
        }
        .mu-more-card__icon {
          width: 32px; /* MD3 아이콘 컨테이너 크기 */
          height: 32px;
          border-radius: var(--md-shape-sm); /* 8px — MD3 Small shape */
          background: var(--md-surface-container); /* #F2F4F6 — MD3 Surface Container */
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
        /* MD3 Title Small */
        .mu-more-card__label {
          font-size: var(--md-title-small);      /* 14px — MD3 Title Small */
          line-height: var(--md-title-small-lh); /* 20px */
          letter-spacing: var(--md-title-small-ls);
          font-weight: 600;
          color: var(--md-on-surface); /* #1C1B1F */
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        /* MD3 Body Small */
        .mu-more-card__desc {
          font-size: var(--md-body-small);      /* 12px — MD3 Body Small */
          line-height: var(--md-body-small-lh); /* 16px */
          letter-spacing: var(--md-body-small-ls);
          color: var(--md-on-surface-variant); /* #49454F */
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
