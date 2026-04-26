import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'wouter';
import { createClient } from '@supabase/supabase-js';
import { ArrowRight } from 'lucide-react';

const supabaseUrl = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface BannerItem {
  id: string;
  tag: string | null;
  title: string;
  sub: string | null;
  cta: string;
  href: string;
  gradient: string;
  watermark: string | null;
  sort_order: number;
  is_active: boolean;
}

const FALLBACK_BANNERS: BannerItem[] = [
  { id: 'family', tag: '무운에서만', title: '가족 오행 함께\n분석하기', sub: '가족 구성원 사주 한눈에 비교', cta: '가족 사주 보기', href: '/family-saju', gradient: '#3929a0', watermark: '家\n運', sort_order: 1, is_active: true },
  { id: 'yearly', tag: '2026 병오년', title: '올해의 운세\n지금 확인하기', sub: '월별 상세 · 12가지 운세 항목', cta: '무료로 보기', href: '/yearly-fortune', gradient: '#3929a0', watermark: '丙\n午', sort_order: 2, is_active: true },
  { id: 'mbti', tag: '무운에서만', title: 'MBTI × 사주\n궁합 분석', sub: '성격 유형과 오행의 만남', cta: '궁합 보기', href: '/hybrid-compatibility', gradient: '#3929a0', watermark: '合\n命', sort_order: 3, is_active: true },
  { id: 'naming', tag: '작명소', title: '아이 이름\n사주로 짓다', sub: '402자 검증 한자 · 81수리 성명학', cta: '이름 짓기', href: '/naming', gradient: '#3929a0', watermark: '名\n字', sort_order: 4, is_active: true },
];

const AUTO_PLAY_INTERVAL = 4200;

export function MainBanner() {
  const [banners, setBanners] = useState<BannerItem[]>(FALLBACK_BANNERS);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase.from('banners').select('*').eq('is_active', true).order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) setBanners(data as BannerItem[]);
      } catch {
        // fallback 유지
      }
    };
    fetchBanners();
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => emblaApi?.scrollNext(), AUTO_PLAY_INTERVAL);
  }, [emblaApi, stopAutoPlay]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    startAutoPlay();
    return () => {
      stopAutoPlay();
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, startAutoPlay, stopAutoPlay]);

  return (
    <section className="muun-promo-strip" aria-label="추천 서비스">
      <div className="muun-promo-viewport" ref={emblaRef}>
        <div className="muun-promo-track">
          {banners.map((banner) => (
            <div key={banner.id} className="muun-promo-slide">
              <Link href={banner.href} className="muun-promo-card" style={{ background: banner.gradient || '#3929a0' }}>
                <span className="muun-promo-hanja" aria-hidden="true">{banner.watermark || '運'}</span>
                <span className="muun-promo-label">{banner.tag || '무운 추천'}</span>
                <h2 className="muun-promo-title">{banner.title}</h2>
                {banner.sub ? <p className="muun-promo-sub">{banner.sub}</p> : null}
                <span className="muun-promo-btn">{banner.cta}<ArrowRight size={12} aria-hidden="true" /></span>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="muun-dot-row" role="tablist" aria-label="추천 배너 선택">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            onClick={() => emblaApi?.scrollTo(index)}
            className={`muun-dot${index === selectedIndex ? ' muun-dot--on' : ''}`}
            aria-label={`${index + 1}번 배너 보기`}
            aria-selected={index === selectedIndex}
          />
        ))}
      </div>
    </section>
  );
}
