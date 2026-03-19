import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Info, Trash2, RefreshCw, Heart, Sparkles, Layers, Star } from "lucide-react";
import { trackCustomEvent } from "@/lib/ga4";

/* ── 오행 매핑 ── */
const OHAENG_MENUS: Record<string, string[]> = {
  목: ["나물비빔밥", "시금치된장국", "봄나물무침", "콩나물국밥", "쑥개떡"],
  화: ["순대국", "떡볶이", "닭볶음탕", "부대찌개", "마라탕"],
  토: ["된장찌개", "청국장", "순두부찌개", "감자탕", "누룽지"],
  금: ["갈비탕", "설렁탕", "삼계탕", "육개장", "곰탕"],
  수: ["칼국수", "냉면", "물냉면", "콩국수", "해물탕"],
};
const OHAENG_EMOJI: Record<string, string> = {
  목: "🥗", 화: "🍲", 토: "🫕", 금: "🍖", 수: "🍜",
};
const OHAENG_DESC: Record<string, string> = {
  목: "목(木) 기운이 오늘을 돕습니다.",
  화: "화(火) 기운이 오늘을 돕습니다.",
  토: "토(土) 기운이 오늘을 돕습니다.",
  금: "금(金) 기운이 오늘을 돕습니다.",
  수: "수(水) 기운이 오늘을 돕습니다.",
};

const FORTUNE_TITLES = [
  "재물운이 열리는 날", "귀인을 만나는 날", "집중력이 높아지는 날",
  "변화의 기운이 오는 날", "안정이 찾아오는 날", "창의력이 빛나는 날",
  "인간관계가 풍요로운 날", "건강 에너지가 충만한 날",
];
const FORTUNE_DESCS = [
  "막혔던 흐름이 풀리는 시기.\n중요한 결정은 오전에 하세요.",
  "뜻밖의 도움이 찾아옵니다.\n주변의 제안에 귀를 기울이세요.",
  "오늘은 깊이 몰입할 수 있는 날.\n중요한 업무를 처리하기 좋습니다.",
  "새로운 시작을 두려워하지 마세요.\n변화 속에 기회가 있습니다.",
  "무리하지 말고 현재에 집중하세요.\n작은 것들이 큰 힘이 됩니다.",
  "아이디어가 넘치는 하루입니다.\n메모하는 습관이 빛을 발합니다.",
  "소중한 사람과의 시간이 행운을 부릅니다.",
  "몸과 마음을 돌보는 날입니다.\n가벼운 운동이 도움이 됩니다.",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getDailyFortune(birth: string) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  const seed = parseInt(birth.replace(/\D/g, "").slice(0, 8) + dateStr, 10) % 99999;
  const r1 = seededRandom(seed);
  const r2 = seededRandom(seed + 7);
  const ohaengList = Object.keys(OHAENG_MENUS);
  const ohaeng = ohaengList[Math.floor(r1 * ohaengList.length)];
  const score = Math.floor(r1 * 40) + 55;
  const titleIdx = Math.floor(r2 * FORTUNE_TITLES.length);
  return { score, title: FORTUNE_TITLES[titleIdx], desc: FORTUNE_DESCS[titleIdx], ohaeng };
}

const SHORTCUTS = [
  { href: "/compatibility",  label: "궁합",    Icon: Heart },
  { href: "/lifelong-saju",  label: "평생사주", Icon: Sparkles },
  { href: "/tarot",          label: "타로",     Icon: Layers },
  { href: "/astrology",      label: "점성술",   Icon: Star },
];

interface HeroReturnVisitProps {
  onDeleteBirth: () => void;
}

export function HeroReturnVisit({ onDeleteBirth }: HeroReturnVisitProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [menuIdx, setMenuIdx] = useState(0);
  const [menuFade, setMenuFade] = useState(false);

  const rawData = localStorage.getItem("muun_user_birth");
  const userData = rawData ? JSON.parse(rawData) : null;
  const birth = userData?.birth ?? "";
  const fortune = getDailyFortune(birth);
  const birthYear = birth.slice(0, 4);
  const birthMonth = birth.slice(4, 6);
  const birthDay = birth.slice(6, 8);
  const birthStr = birthYear && birthMonth && birthDay
    ? `${parseInt(birthYear, 10)}년 ${parseInt(birthMonth, 10)}월 ${parseInt(birthDay, 10)}일생`
    : birthYear ? `${birthYear}년생` : "";

  const menus = OHAENG_MENUS[fortune.ohaeng] ?? OHAENG_MENUS["수"];

  const handleRefreshMenu = useCallback(() => {
    setMenuFade(true);
    setTimeout(() => {
      setMenuIdx((prev) => (prev + 1) % menus.length);
      setMenuFade(false);
    }, 180);
    trackCustomEvent("lucky_menu_refresh", { ohaeng: fortune.ohaeng });
  }, [menus.length, fortune.ohaeng]);

  const handleDeleteConfirm = () => {
    localStorage.removeItem("muun_user_birth");
    setShowDeleteSheet(false);
    trackCustomEvent("birth_delete", {});
    onDeleteBirth();
  };

  useEffect(() => {
    if (!showTooltip) return;
    const handler = () => setShowTooltip(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showTooltip]);

  return (
    <section className="mu-hero mu-hero--return">
      <div className="mu-hero__inner">

        {/* ── 인사 행 (압축) ── */}
        <div className="mu-hero__greeting-row">
          <div>
            <div className="mu-hero__eyebrow">명리학 기반 운세</div>
            <div className="mu-hero__greeting-line">
              <p className="mu-hero__greeting">오늘도 좋은 하루예요</p>
              <div className="mu-hero__greeting-meta">
                <span>{birthStr}</span>
                <button
                  className="mu-hero__info-btn"
                  onClick={(e) => { e.stopPropagation(); setShowTooltip((p) => !p); }}
                  aria-label="저장 정보 안내"
                  aria-expanded={showTooltip}
                >
                  <Info size={11} />
                </button>
                {showTooltip && (
                  <div className="mu-hero__tooltip" role="tooltip">
                    🔒 이 기기에만 저장됩니다. 서버로 전송되지 않으며 언제든지 삭제 가능합니다.
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            className="mu-hero__delete-btn"
            onClick={() => setShowDeleteSheet(true)}
            aria-label="저장된 정보 삭제"
          >
            <Trash2 size={11} />
            삭제
          </button>
        </div>

        {/* ── 오늘의 운세 카드 (토스 스타일) ── */}
        <div className="mu-fortune-card">
          <div className="mu-fortune-card__header">
            <div className="mu-fortune-card__eyebrow">
              <span className="mu-fortune-card__live-dot" aria-hidden="true" />
              오늘의 운세
            </div>
            <span className="mu-fortune-card__score-badge" aria-label={`오늘의 지수 ${fortune.score}점`}>
              {fortune.score}점
            </span>
          </div>
          <p className="mu-fortune-card__title">{fortune.title}</p>
          <div className="mu-fortune-card__gauge" role="progressbar" aria-valuenow={fortune.score} aria-valuemin={0} aria-valuemax={100}>
            <div className="mu-fortune-card__gauge-fill" style={{ width: `${fortune.score}%` }} />
          </div>
          <div className="mu-fortune-card__footer">
            <p className="mu-fortune-card__desc">{fortune.desc}</p>
            <Link href="/yearly-fortune" className="mu-fortune-card__cta">
              자세히 →
            </Link>
          </div>
        </div>

        {/* ── 행운 메뉴 카드 (토스 스타일 수평 행) ── */}
        <div className="mu-lunch-card">
          <span className="mu-lunch-card__emoji" aria-hidden="true">
            {OHAENG_EMOJI[fortune.ohaeng]}
          </span>
          <div className="mu-lunch-card__body">
            <p className="mu-lunch-card__eyebrow">오늘의 행운 메뉴</p>
            <p
              className={`mu-lunch-card__title${menuFade ? " mu-lunch-card__title--fade" : ""}`}
              aria-live="polite"
            >
              {menus[menuIdx]}
            </p>
            <p className="mu-lunch-card__desc">{OHAENG_DESC[fortune.ohaeng]}</p>
          </div>
          <button className="mu-lunch-card__refresh" onClick={handleRefreshMenu} aria-label="다른 메뉴 보기">
            <RefreshCw size={13} />
          </button>
        </div>

        {/* ── 바로가기 4버튼 (토스 스타일) ── */}
        <div className="mu-shortcuts" role="list" aria-label="서비스 바로가기">
          {SHORTCUTS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={`${href}?birth=${birth}`}
              className="mu-shortcut-btn"
              role="listitem"
              aria-label={label}
            >
              <span className="mu-shortcut-btn__icon">
                <Icon size={20} strokeWidth={1.6} />
              </span>
              <span className="mu-shortcut-btn__label">{label}</span>
            </Link>
          ))}
        </div>

      </div>

      {/* ── 삭제 확인 바텀시트 ── */}
      {showDeleteSheet && (
        <div className="mu-sheet-overlay" onClick={() => setShowDeleteSheet(false)}>
          <div className="mu-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="정보 삭제 확인">
            <div className="mu-sheet__handle" aria-hidden="true" />
            <p className="mu-sheet__title">저장된 정보를 삭제할까요?</p>
            <p className="mu-sheet__desc">삭제하면 첫 방문 화면으로 돌아갑니다.</p>
            <div className="mu-sheet__actions">
              <button className="mu-sheet__cancel" onClick={() => setShowDeleteSheet(false)}>취소</button>
              <button className="mu-sheet__confirm" onClick={handleDeleteConfirm}>삭제</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ── Hero 섹션 ── */
        .mu-hero--return {
          position: relative;
          background: linear-gradient(155deg, #12082e 0%, #1e0f4a 40%, #2a1060 70%, #1a0840 100%);
          padding: var(--md-sp-5) var(--md-sp-4) var(--md-sp-6); /* 20px 16px 24px — MD3 4dp 배수 */
          overflow: hidden;
        }
        .mu-hero--return::before {
          content: '';
          position: absolute;
          top: -80px; right: -60px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(123,97,255,0.30) 0%, transparent 70%);
          filter: blur(50px);
          pointer-events: none;
        }
        .mu-hero--return::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(160,120,255,0.18) 0%, transparent 70%);
          filter: blur(50px);
          pointer-events: none;
        }
        .mu-hero__inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: var(--md-sp-3); /* 12px — MD3 4dp 배수 */
        }

        /* ── 인사 행 ── */
        .mu-hero__greeting-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: var(--md-sp-1); /* 4px */
        }
        /* MD3 Label Small */
        .mu-hero__eyebrow {
          font-size: var(--md-label-small);      /* 11px — MD3 Label Small */
          line-height: var(--md-label-small-lh);
          letter-spacing: 0.04em;
          font-weight: 600;
          color: var(--md-inverse-primary); /* #CFBCFF — MD3 Inverse Primary */
          text-transform: uppercase;
          margin-bottom: var(--md-sp-1); /* 4px */
        }
        .mu-hero__greeting-line {
          display: flex;
          flex-direction: column;
          gap: var(--md-sp-1); /* 4px */
        }
        /* MD3 Headline Small */
        .mu-hero__greeting {
          font-size: var(--md-headline-small);      /* 24px — MD3 Headline Small */
          line-height: var(--md-headline-small-lh); /* 32px */
          letter-spacing: var(--md-headline-small-ls);
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }
        /* MD3 Body Small */
        .mu-hero__greeting-meta {
          display: flex;
          align-items: center;
          gap: var(--md-sp-1); /* 4px */
          font-size: var(--md-body-small);      /* 12px — MD3 Body Small */
          line-height: var(--md-body-small-lh);
          letter-spacing: var(--md-body-small-ls);
          color: rgba(255,255,255,0.45);
          position: relative;
        }
        .mu-hero__info-btn {
          width: 16px; height: 16px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.50);
          cursor: pointer;
        }
        .mu-hero__tooltip {
          position: absolute;
          top: calc(100% + var(--md-sp-1)); /* 4px */
          left: 0;
          z-index: 20;
          background: #1e0f4a;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: var(--md-shape-md); /* 12px — MD3 Medium shape */
          padding: var(--md-sp-3) var(--md-sp-3); /* 12px — MD3 4dp */
          font-size: var(--md-body-small);      /* 12px — MD3 Body Small */
          line-height: var(--md-body-small-lh);
          letter-spacing: var(--md-body-small-ls);
          color: rgba(255,255,255,0.75);
          width: 220px;
          box-shadow: var(--md-elev-3); /* MD3 Elevation 3 */
        }
        /* MD3 Label Small */
        .mu-hero__delete-btn {
          display: flex;
          align-items: center;
          gap: var(--md-sp-1); /* 4px */
          font-size: var(--md-label-small);      /* 11px — MD3 Label Small */
          line-height: var(--md-label-small-lh);
          letter-spacing: var(--md-label-small-ls);
          color: rgba(255,255,255,0.40);
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--md-sp-1) 0; /* 4px 0 */
          min-height: 32px; /* 터치타겟 최소 */
          white-space: nowrap;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-hero__delete-btn:hover { color: rgba(255,255,255,0.65); }

        /* ── 운세 카드 (글래스모피즘 + MD3 Extra Large shape) ── */
        .mu-fortune-card {
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: var(--md-shape-xl); /* 28px — MD3 Extra Large */
          padding: var(--md-sp-4); /* 16px */
          box-shadow: var(--md-elev-3); /* MD3 Elevation 3 */
        }
        .mu-fortune-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--md-sp-2); /* 8px */
        }
        /* MD3 Body Small */
        .mu-fortune-card__eyebrow {
          display: flex;
          align-items: center;
          gap: var(--md-sp-1); /* 4px */
          font-size: var(--md-body-small);      /* 12px — MD3 Body Small */
          line-height: var(--md-body-small-lh);
          letter-spacing: var(--md-body-small-ls);
          color: rgba(255,255,255,0.55);
          font-weight: 500;
        }
        .mu-fortune-card__live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #6B5FFF;
          animation: live-pulse 1.5s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        /* MD3 Label Large */
        .mu-fortune-card__score-badge {
          font-size: var(--md-label-large);      /* 14px — MD3 Label Large */
          line-height: var(--md-label-large-lh);
          letter-spacing: var(--md-label-large-ls);
          font-weight: 700;
          color: var(--md-inverse-primary); /* #CFBCFF — MD3 Inverse Primary */
          background: rgba(123,97,255,0.25);
          padding: var(--md-sp-1) var(--md-sp-3); /* 4px 12px */
          border-radius: var(--md-shape-full); /* MD3 Badge 완전 둥근 */
        }
        /* MD3 Title Medium */
        .mu-fortune-card__title {
          font-size: var(--md-title-medium);      /* 16px — MD3 Title Medium */
          line-height: var(--md-title-medium-lh); /* 24px */
          letter-spacing: var(--md-title-medium-ls);
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 var(--md-sp-3); /* 0 0 12px */
        }
        .mu-fortune-card__gauge {
          height: 4px; /* MD3 Linear Progress 기본 높이 4dp */
          background: rgba(255,255,255,0.15);
          border-radius: var(--md-shape-full);
          overflow: hidden;
          margin-bottom: var(--md-sp-3); /* 12px */
        }
        .mu-fortune-card__gauge-fill {
          height: 100%;
          background: linear-gradient(90deg, #6B5FFF, #60C8D4);
          border-radius: 2px;
          transition: width 0.6s ease;
        }
        .mu-fortune-card__footer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--md-sp-2); /* 8px */
        }
        /* MD3 Body Small */
        .mu-fortune-card__desc {
          font-size: var(--md-body-small);      /* 12px — MD3 Body Small */
          line-height: var(--md-body-small-lh); /* 16px */
          letter-spacing: var(--md-body-small-ls);
          color: rgba(255,255,255,0.55);
          margin: 0;
          white-space: pre-line;
          flex: 1;
        }
        /* MD3 Label Large */
        .mu-fortune-card__cta {
          font-size: var(--md-label-large);      /* 14px — MD3 Label Large */
          line-height: var(--md-label-large-lh);
          letter-spacing: var(--md-label-large-ls);
          color: var(--md-inverse-primary); /* #CFBCFF */
          text-decoration: none;
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ── 행운 메뉴 카드 (MD3 Large shape) ── */
        .mu-lunch-card {
          display: flex;
          align-items: center;
          gap: var(--md-sp-3); /* 12px */
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--md-shape-lg); /* 16px — MD3 Large shape */
          padding: var(--md-sp-3) var(--md-sp-4); /* 12px 16px */
        }
        .mu-lunch-card__emoji {
          font-size: 26px;
          line-height: 1;
          flex-shrink: 0;
        }
        .mu-lunch-card__body { flex: 1; min-width: 0; }
        /* MD3 Label Small */
        .mu-lunch-card__eyebrow {
          font-size: var(--md-label-small);      /* 11px — MD3 Label Small */
          line-height: var(--md-label-small-lh);
          letter-spacing: var(--md-label-small-ls);
          color: rgba(255,255,255,0.40);
          margin-bottom: var(--md-sp-1); /* 4px */
        }
        /* MD3 Title Medium */
        .mu-lunch-card__title {
          font-size: var(--md-title-medium);      /* 16px — MD3 Title Medium */
          line-height: var(--md-title-medium-lh); /* 24px */
          letter-spacing: var(--md-title-medium-ls);
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 var(--md-sp-1); /* 0 0 4px */
          transition: opacity 0.18s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mu-lunch-card__title--fade { opacity: 0; }
        /* MD3 Label Small */
        .mu-lunch-card__desc {
          font-size: var(--md-label-small);      /* 11px — MD3 Label Small */
          line-height: var(--md-label-small-lh);
          letter-spacing: var(--md-label-small-ls);
          color: rgba(255,255,255,0.40);
          margin: 0;
        }
        /* MD3 Icon Button */
        .mu-lunch-card__refresh {
          width: 40px; height: 40px; /* MD3 Icon Button 기본 크기 40dp */
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.60);
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .mu-lunch-card__refresh:hover { background: rgba(255,255,255,0.20); }

        /* ── 바로가기 4버튼 (MD3 Navigation Destination 스타일) ── */
        .mu-shortcuts {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--md-sp-2); /* 8px */
        }
        .mu-shortcut-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--md-sp-1); /* 4px */
          padding: var(--md-sp-3) var(--md-sp-1) var(--md-sp-3); /* 12px 4px 12px */
          min-height: 64px; /* MD3 Navigation 최소 높이 */
          border-radius: var(--md-shape-lg); /* 16px — MD3 Large shape */
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          text-decoration: none;
          transition: background 0.12s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-shortcut-btn:hover { background: rgba(255,255,255,0.14); }
        .mu-shortcut-btn:active { opacity: 0.8; }
        .mu-shortcut-btn__icon {
          width: 40px; height: 40px; /* MD3 터치타겟 최소 */
          border-radius: var(--md-shape-md); /* 12px — MD3 Medium shape */
          background: rgba(123,97,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--md-inverse-primary); /* #CFBCFF — MD3 Inverse Primary */
        }
        /* MD3 Label Small */
        .mu-shortcut-btn__label {
          font-size: var(--md-label-small);      /* 11px — MD3 Label Small */
          line-height: var(--md-label-small-lh);
          letter-spacing: var(--md-label-small-ls);
          color: rgba(255,255,255,0.70);
          font-weight: 500;
          white-space: nowrap;
        }

        /* ── 바텐시트 (MD3 Bottom Sheet) ── */
        .mu-sheet-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0,0,0,0.35); /* MD3 Scrim */
          display: flex;
          align-items: flex-end;
        }
        .mu-sheet {
          width: 100%;
          background: var(--md-surface-container-low); /* MD3 Surface Container Low */
          border-radius: var(--md-shape-xl) var(--md-shape-xl) 0 0; /* 28px 28px 0 0 — MD3 Bottom Sheet */
          padding: var(--md-sp-3) var(--md-sp-5) calc(var(--md-sp-5) + var(--safe-area-bottom, 0px)); /* 12px 20px */
        }
        .mu-sheet__handle {
          width: 32px; height: 4px; /* MD3 Bottom Sheet 핸들 */
          border-radius: var(--md-shape-full);
          background: var(--md-outline-variant); /* MD3 Outline Variant */
          margin: 0 auto var(--md-sp-5); /* 0 auto 20px */
        }
        /* MD3 Title Large */
        .mu-sheet__title {
          font-size: var(--md-title-large);      /* 22px — MD3 Title Large */
          line-height: var(--md-title-large-lh); /* 28px */
          letter-spacing: var(--md-title-large-ls);
          font-weight: 700;
          color: var(--md-on-surface); /* #1C1B1F */
          text-align: center;
          margin: 0 0 var(--md-sp-2); /* 0 0 8px */
        }
        /* MD3 Body Medium */
        .mu-sheet__desc {
          font-size: var(--md-body-medium);      /* 14px — MD3 Body Medium */
          line-height: var(--md-body-medium-lh); /* 20px */
          letter-spacing: var(--md-body-medium-ls);
          color: var(--md-on-surface-variant); /* #49454F */
          text-align: center;
          margin: 0 0 var(--md-sp-5); /* 0 0 20px */
        }
        .mu-sheet__actions {
          display: flex;
          gap: var(--md-sp-3); /* 12px */
        }
        /* MD3 Tonal Button */
        .mu-sheet__cancel {
          flex: 1;
          height: 40px;    /* MD3 Button 표준 높이 40dp */
          min-height: 48px; /* MD3 터치타겟 최소 48dp */
          border-radius: var(--md-shape-full); /* MD3 Button 완전 둥근 */
          background: var(--md-secondary-container); /* #E2E0F9 — MD3 Secondary Container */
          border: none;
          color: var(--md-on-secondary-container); /* #191631 */
          font-size: var(--md-label-large);      /* 14px — MD3 Label Large */
          line-height: var(--md-label-large-lh);
          letter-spacing: var(--md-label-large-ls);
          font-weight: 600;
          cursor: pointer;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        /* MD3 Filled Button (Error) */
        .mu-sheet__confirm {
          flex: 1;
          height: 40px;    /* MD3 Button 표준 높이 40dp */
          min-height: 48px; /* MD3 터치타겟 최소 48dp */
          border-radius: var(--md-shape-full); /* MD3 Button 완전 둥근 */
          background: var(--md-error); /* #B3261E — MD3 Error */
          border: none;
          color: var(--md-on-error); /* #ffffff */
          font-size: var(--md-label-large);      /* 14px — MD3 Label Large */
          line-height: var(--md-label-large-lh);
          letter-spacing: var(--md-label-large-ls);
          font-weight: 600;
          cursor: pointer;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
      `}</style>
    </section>
  );
}
