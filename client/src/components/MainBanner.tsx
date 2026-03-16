import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface BannerItem {
  id: string;
  tag: string;
  title: string;
  sub: string;
  cta: string;
  href: string;
  visual: string;
  gradFrom: string;
  gradTo: string;
  accentColor: string;
}

const BANNERS: BannerItem[] = [
  {
    id: "yearly",
    tag: "2026 병오년",
    title: "올해의 운세\n지금 확인하세요",
    sub: "병오년(丙午年) 나의 총운·월별 운세",
    cta: "신년운세 보기",
    href: "/yearly-fortune",
    visual: "丙\n午",
    gradFrom: "rgba(245,200,66,0.18)",
    gradTo: "rgba(245,200,66,0.04)",
    accentColor: "oklch(0.85 0.18 85)",
  },
  {
    id: "family",
    tag: "가족 사주",
    title: "가족의 오행 조화\n함께 확인해요",
    sub: "부모·자녀·형제의 사주를 한눈에",
    cta: "가족사주 보기",
    href: "/family-saju",
    visual: "家\n族",
    gradFrom: "rgba(52,211,153,0.18)",
    gradTo: "rgba(52,211,153,0.04)",
    accentColor: "#34d399",
  },
  {
    id: "mbti",
    tag: "사주 × MBTI",
    title: "사주와 성격\n둘 다 보는 궁합",
    sub: "명리학과 심리학이 만나는 진짜 궁합",
    cta: "MBTI 궁합 보기",
    href: "/hybrid-compatibility",
    visual: "合\n心",
    gradFrom: "rgba(167,139,250,0.18)",
    gradTo: "rgba(167,139,250,0.04)",
    accentColor: "#a78bfa",
  },
  {
    id: "naming",
    tag: "작명소 NEW",
    title: "81수리 성명학\n이름의 운을 바꾸다",
    sub: "사주 기반 이름 분석 및 작명 서비스",
    cta: "작명소 바로가기",
    href: "/naming",
    visual: "字\n名",
    gradFrom: "rgba(255,255,255,0.10)",
    gradTo: "rgba(255,255,255,0.02)",
    accentColor: "rgba(255,255,255,0.7)",
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
              aria-label={`${i + 1} / ${BANNERS.length}: ${b.title.replace("\n", " ")}`}
            >
              <Link href={b.href} className="mu-banner__card" style={{
                background: `linear-gradient(135deg, ${b.gradFrom} 0%, ${b.gradTo} 100%)`,
              }}>
                <div className="mu-banner__card-body">
                  <span
                    className="mu-banner__tag"
                    style={{ color: b.accentColor, borderColor: `${b.accentColor}40`, background: `${b.accentColor}15` }}
                  >
                    {b.tag}
                  </span>
                  <p className="mu-banner__title" style={{ whiteSpace: "pre-line" }}>{b.title}</p>
                  <p className="mu-banner__sub">{b.sub}</p>
                  <span className="mu-banner__cta" style={{ color: b.accentColor }}>
                    {b.cta} <ArrowRight size={13} style={{ display: "inline", verticalAlign: "middle" }} />
                  </span>
                </div>
                <div className="mu-banner__visual" style={{ color: b.accentColor }}>
                  {b.visual}
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
        .mu-banner {
          padding: 0 16px 4px;
        }
        .mu-banner__viewport {
          overflow: hidden;
          border-radius: 16px;
        }
        .mu-banner__container {
          display: flex;
          touch-action: pan-y;
        }
        .mu-banner__slide {
          flex: 0 0 100%;
          min-width: 0;
        }
        .mu-banner__card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 18px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          text-decoration: none;
          min-height: 120px;
          position: relative;
          overflow: hidden;
          transition: opacity 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-banner__card:active { opacity: 0.85; }
        .mu-banner__card-body { flex: 1; }
        .mu-banner__tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 100px;
          border: 1px solid;
          margin-bottom: 8px;
          letter-spacing: 0.01em;
        }
        .mu-banner__title {
          font-size: 18px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin: 0 0 6px;
        }
        .mu-banner__sub {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin: 0 0 10px;
          line-height: 1.4;
        }
        .mu-banner__cta {
          font-size: 13px;
          font-weight: 600;
        }
        .mu-banner__visual {
          font-size: 32px;
          font-weight: 800;
          line-height: 1.2;
          text-align: center;
          white-space: pre-line;
          opacity: 0.25;
          letter-spacing: -0.02em;
          flex-shrink: 0;
          margin-left: 12px;
          font-family: 'Noto Serif KR', serif;
        }
        /* 도트 */
        .mu-banner__dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          padding: 10px 0 4px;
        }
        .mu-banner__dot {
          position: relative;
          width: 6px;
          height: 6px;
          border-radius: 3px;
          background: rgba(255,255,255,0.15);
          border: none;
          cursor: pointer;
          padding: 0;
          overflow: hidden;
          transition: width 0.2s, background 0.2s;
        }
        .mu-banner__dot--active {
          width: 20px;
          background: rgba(255,255,255,0.2);
        }
        .mu-banner__dot-progress {
          position: absolute;
          inset: 0;
          background: oklch(0.85 0.18 85);
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
