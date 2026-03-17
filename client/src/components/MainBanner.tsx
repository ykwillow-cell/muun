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
    title: "신년운세",
    sub: "올해의 총운과 월별 운세",
    cta: "지금 보기",
    href: "/yearly-fortune",
    gradient: "linear-gradient(135deg, #6B5FFF 0%, #60C8D4 60%, #A8E6CF 100%)",
    watermark: "運",
  },
  {
    id: "family",
    tag: "무운에서만",
    title: "가족사주",
    sub: "가족 전체의 사주를 한 번에",
    cta: "시작하기",
    href: "/family-saju",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FDE68A 100%)",
    watermark: "家",
  },
  {
    id: "mbti",
    tag: "사주 × MBTI",
    title: "성격 궁합",
    sub: "명리학과 심리학이 만나는 진짜 궁합",
    cta: "확인하기",
    href: "/hybrid-compatibility",
    gradient: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 80%, #A78BFA 100%)",
    watermark: "合",
  },
  {
    id: "naming",
    tag: "작명소 NEW",
    title: "이름의 운",
    sub: "81수리 성명학으로 이름을 분석",
    cta: "분석하기",
    href: "/naming",
    gradient: "linear-gradient(135deg, #334155 0%, #475569 60%, #64748B 100%)",
    watermark: "名",
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
              aria-label={`${i + 1} / ${BANNERS.length}: ${b.title}`}
            >
              <Link
                href={b.href}
                className="mu-banner__card"
                style={{ background: b.gradient }}
                aria-label={b.title}
              >
                {/* 한자 워터마크 */}
                <span className="mu-banner__watermark" aria-hidden="true">{b.watermark}</span>

                {/* 콘텐츠 */}
                <div className="mu-banner__card-body">
                  <span className="mu-banner__tag">{b.tag}</span>
                  <p className="mu-banner__title">{b.title}</p>
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
          padding: 0 16px 4px;
          background: #f2f4f6;
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
          padding: 22px 20px 20px;
          border-radius: 20px;
          text-decoration: none;
          min-height: 148px;
          position: relative;
          overflow: hidden;
          transition: opacity 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-banner__card:active { opacity: 0.90; }

        /* ── 한자 워터마크 ── */
        .mu-banner__watermark {
          position: absolute;
          right: -4px;
          bottom: -18px;
          font-size: 110px;
          font-weight: 900;
          color: rgba(255,255,255,0.13);
          line-height: 1;
          pointer-events: none;
          user-select: none;
          font-family: 'Noto Serif KR', serif;
        }

        /* ── 카드 콘텐츠 ── */
        .mu-banner__card-body {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .mu-banner__tag {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #ffffff;
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(4px);
          width: fit-content;
          letter-spacing: 0.01em;
        }
        .mu-banner__title {
          font-size: 24px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.6px;
          line-height: 1.15;
          margin: 0;
        }
        .mu-banner__sub {
          font-size: 13px;
          color: rgba(255,255,255,0.80);
          line-height: 1.5;
          margin: 0;
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
