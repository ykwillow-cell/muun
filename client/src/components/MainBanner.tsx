import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "wouter";

interface BannerItem {
  id: string;
  tag: string;
  title: string;
  sub: string;
  cta: string;
  href: string;
  gradient: string;
  watermark: string;
}

const BANNERS: BannerItem[] = [
  {
    id: "yearly",
    tag: "2026 병오년",
    title: "올해의 운세\n지금 확인하기",
    sub: "월별 상세 · 12가지 운세 항목",
    cta: "무료로 보기",
    href: "/yearly-fortune",
    gradient: "linear-gradient(135deg, #7B61FF 0%, #6A4FE8 100%)",
    watermark: "丙\n午",
  },
  {
    id: "family",
    tag: "무운에서만",
    title: "가족 오행\n함께 분석",
    sub: "가족 구성원 사주 한눈에 비교",
    cta: "가족 사주 보기",
    href: "/family-saju",
    gradient: "linear-gradient(135deg, #6A4FE8 0%, #5940CC 100%)",
    watermark: "家\n運",
  },
  {
    id: "mbti",
    tag: "무운에서만",
    title: "MBTI × 사주\n궁합 분석",
    sub: "성격 유형과 오행의 만남",
    cta: "궁합 보기",
    href: "/hybrid-compatibility",
    gradient: "linear-gradient(135deg, #5940CC 0%, #4A31B0 100%)",
    watermark: "合\n命",
  },
  {
    id: "naming",
    tag: "작명소",
    title: "아이 이름\n사주로 짓다",
    sub: "402자 검증 한자 · 81수리 성명학",
    cta: "이름 짓기",
    href: "/naming",
    gradient: "linear-gradient(135deg, #4A31B0 0%, #3A2490 100%)",
    watermark: "名\n字",
  },
];

const AUTO_PLAY_INTERVAL = 3500;

export function MainBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveredRef = useRef(false);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      if (!isHoveredRef.current && emblaApi) {
        emblaApi.scrollNext();
      }
    }, AUTO_PLAY_INTERVAL);
  }, [emblaApi, stopAutoPlay]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setProgressKey((k) => k + 1);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", stopAutoPlay);
    emblaApi.on("pointerUp", startAutoPlay);
    startAutoPlay();
    return () => {
      stopAutoPlay();
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect, startAutoPlay, stopAutoPlay]);

  const goTo = useCallback((idx: number) => {
    emblaApi?.scrollTo(idx);
    setProgressKey((k) => k + 1);
  }, [emblaApi]);

  return (
    <section
      className="mu-banner"
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
      aria-label="서비스 배너"
      aria-roledescription="carousel"
    >
      <div className="mu-banner__viewport" ref={emblaRef}>
        <div className="mu-banner__container">
          {BANNERS.map((b, i) => (
            <div
              key={b.id}
              className="mu-banner__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${BANNERS.length}: ${b.title.replace('\n', ' ')}`}
            >
              <Link
                href={b.href}
                className="mu-banner__card"
                style={{ background: b.gradient }}
                aria-label={b.title.replace('\n', ' ')}
              >
                {/* 한자 워터마크 */}
                <span className="mu-banner__watermark" aria-hidden="true" style={{ whiteSpace: 'pre-line' }}>{b.watermark}</span>

                {/* 콘텐츠 */}
                <div className="mu-banner__card-body">
                  <p className="mu-banner__title" style={{ whiteSpace: 'pre-line' }}>{b.title}</p>
                  <p className="mu-banner__sub">{b.sub}</p>
                  <span className="mu-banner__cta">{b.cta} →</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 도트 프로그레스 */}
      <div className="mu-banner__dots" role="tablist" aria-label="배너 탐색">
        {BANNERS.map((b, i) => (
          <button
            key={b.id}
            className={`mu-banner__dot${i === selectedIndex ? " mu-banner__dot--active" : ""}`}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === selectedIndex}
            aria-label={`${i + 1}번 배너`}
          >
            {i === selectedIndex && (
              <span
                key={progressKey}
                className="mu-banner__dot-progress"
                style={{ animationDuration: `${AUTO_PLAY_INTERVAL}ms` }}
              />
            )}
          </button>
        ))}
      </div>

      <style>{`
        /* ── 배너 섹션 ── */
        .mu-banner {
          padding: 12px 18px;
          background: #ffffff;
        }

        .mu-banner__viewport {
          overflow: hidden;
          border-radius: 20px;
        }
        .mu-banner__container {
          display: flex;
          touch-action: pan-y;
        }
        .mu-banner__slide {
          flex: 0 0 100%;
          min-width: 0;
        }

        /* ── 그라디언트 카드 ── */
        .mu-banner__card {
          display: block;
          padding: 18px;
          border-radius: 20px;
          text-decoration: none;
          min-height: 114px;
          max-height: 140px;
          position: relative;
          overflow: hidden;
          transition: opacity 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-banner__card:active { opacity: 0.90; }

        /* ── 한자 워터마크 ── */
        .mu-banner__watermark {
          position: absolute;
          right: 10px;
          bottom: -8px;
          font-size: 50px;
          font-weight: 900;
          color: rgba(255,255,255,0.13);
          line-height: 1;
          pointer-events: none;
          user-select: none;
          font-family: 'Noto Serif KR', serif;
          text-align: center;
        }

        /* ── 카드 콘텐츠 ── */
        .mu-banner__card-body {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .mu-banner__title {
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.5px;
          margin-top: 0;
          line-height: 1.25;
          margin: 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-banner__sub {
          font-size: 11px;
          color: rgba(255,255,255,0.75);
          line-height: 1.5;
          margin: 0;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-banner__cta {
          display: inline-flex;
          align-items: center;
          margin-top: 4px;
          padding: 7px 16px;
          border-radius: 20px;
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(4px);
          font-size: 12px;
          font-weight: 600;
          color: #ffffff;
          width: fit-content;
          letter-spacing: 0.01em;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── 도트 인디케이터 ── */
        .mu-banner__dots {
          display: flex;
          justify-content: center;
          gap: 5px;
          padding: 10px 0 4px;
        }
        .mu-banner__dot {
          position: relative;
          width: 5px;
          height: 5px;
          border-radius: 3px;
          background: #d1d5db;
          border: none;
          cursor: pointer;
          padding: 0;
          overflow: hidden;
          transition: width 0.2s, background 0.2s;
        }
        .mu-banner__dot--active {
          width: 18px;
          background: #e8ebed;
        }
        .mu-banner__dot-progress {
          position: absolute;
          inset: 0;
          background: #6B5FFF;
          border-radius: inherit;
          transform-origin: left;
          animation: dot-fill linear forwards;
        }
        @keyframes dot-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}
