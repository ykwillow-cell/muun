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

  const today = new Date();
  const todayStr = `${today.getMonth() + 1}월 ${today.getDate()}일`;

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
                <span>{todayStr} · {birthYear}년생</span>
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
          padding: 20px 16px 24px;
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
          gap: 10px;
        }

        /* ── 인사 행 ── */
        .mu-hero__greeting-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .mu-hero__eyebrow {
          font-size: 11px;
          font-weight: 600;
          color: #a78bfa;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .mu-hero__greeting-line {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mu-hero__greeting {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.5px;
          margin: 0;
          line-height: 1.2;
        }
        .mu-hero__greeting-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
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
          top: calc(100% + 6px);
          left: 0;
          z-index: 20;
          background: #1e0f4a;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 12px;
          color: rgba(255,255,255,0.75);
          line-height: 1.5;
          width: 220px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.35);
        }
        .mu-hero__delete-btn {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          color: rgba(255,255,255,0.40);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 0;
          white-space: nowrap;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-hero__delete-btn:hover { color: rgba(255,255,255,0.65); }

        /* ── 운세 카드 (글래스모피즘) ── */
        .mu-fortune-card {
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .mu-fortune-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .mu-fortune-card__eyebrow {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
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
        .mu-fortune-card__score-badge {
          font-size: 13px;
          font-weight: 700;
          color: #c4b5fd;
          background: rgba(123,97,255,0.25);
          padding: 2px 10px;
          border-radius: 20px;
        }
        .mu-fortune-card__title {
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.4px;
          margin: 0 0 10px;
          line-height: 1.3;
        }
        .mu-fortune-card__gauge {
          height: 3px;
          background: rgba(255,255,255,0.15);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 10px;
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
          gap: 8px;
        }
        .mu-fortune-card__desc {
          font-size: 12px;
          color: rgba(255,255,255,0.55);
          line-height: 1.6;
          margin: 0;
          white-space: pre-line;
          flex: 1;
        }
        .mu-fortune-card__cta {
          font-size: 13px;
          color: #c4b5fd;
          text-decoration: none;
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ── 행운 메뉴 카드 ── */
        .mu-lunch-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 14px 16px;
        }
        .mu-lunch-card__emoji {
          font-size: 26px;
          line-height: 1;
          flex-shrink: 0;
        }
        .mu-lunch-card__body { flex: 1; min-width: 0; }
        .mu-lunch-card__eyebrow {
          font-size: 11px;
          color: rgba(255,255,255,0.40);
          margin-bottom: 2px;
        }
        .mu-lunch-card__title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.3px;
          margin: 0 0 2px;
          transition: opacity 0.18s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mu-lunch-card__title--fade { opacity: 0; }
        .mu-lunch-card__desc {
          font-size: 11px;
          color: rgba(255,255,255,0.40);
          margin: 0;
        }
        .mu-lunch-card__refresh {
          width: 32px; height: 32px;
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

        /* ── 바로가기 4버튼 ── */
        .mu-shortcuts {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .mu-shortcut-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 4px 12px;
          border-radius: 14px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          text-decoration: none;
          transition: background 0.12s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-shortcut-btn:hover { background: rgba(255,255,255,0.14); }
        .mu-shortcut-btn:active { opacity: 0.8; }
        .mu-shortcut-btn__icon {
          width: 36px; height: 36px;
          border-radius: 12px;
          background: rgba(123,97,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c4b5fd;
        }
        .mu-shortcut-btn__label {
          font-size: 11px;
          color: rgba(255,255,255,0.70);
          font-weight: 500;
          white-space: nowrap;
        }

        /* ── 바텀시트 ── */
        .mu-sheet-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0,0,0,0.35);
          display: flex;
          align-items: flex-end;
        }
        .mu-sheet {
          width: 100%;
          background: #ffffff;
          border-radius: 20px 20px 0 0;
          padding: 12px 20px calc(20px + var(--safe-area-bottom));
        }
        .mu-sheet__handle {
          width: 36px; height: 4px;
          border-radius: 2px;
          background: #e8ebed;
          margin: 0 auto 20px;
        }
        .mu-sheet__title {
          font-size: 17px;
          font-weight: 700;
          color: #191f28;
          text-align: center;
          margin: 0 0 8px;
        }
        .mu-sheet__desc {
          font-size: 13px;
          color: #4e5968;
          text-align: center;
          margin: 0 0 20px;
        }
        .mu-sheet__actions {
          display: flex;
          gap: 10px;
        }
        .mu-sheet__cancel {
          flex: 1;
          height: 50px;
          border-radius: 14px;
          background: #f2f4f6;
          border: none;
          color: #4e5968;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-sheet__confirm {
          flex: 1;
          height: 50px;
          border-radius: 14px;
          background: #dc2626;
          border: none;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
      `}</style>
    </section>
  );
}
