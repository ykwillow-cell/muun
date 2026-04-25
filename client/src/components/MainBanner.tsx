import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'wouter';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI';
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
  { id: 'yearly', tag: '2026 병오년', title: '올해의 운세\n지금 확인하기', sub: '월별 상세 · 12가지 운세 항목', cta: '무료로 보기', href: '/yearly-fortune', gradient: 'linear-gradient(135deg, #17114c 0%, #30208d 55%, #60c8d4 100%)', watermark: '丙\n午', sort_order: 1, is_active: true },
  { id: 'family', tag: '무운에서만', title: '가족 오행\n함께 분석', sub: '가족 구성원 사주 한눈에 비교', cta: '가족 사주 보기', href: '/family-saju', gradient: 'linear-gradient(135deg, #6A4FE8 0%, #5940CC 100%)', watermark: '家\n運', sort_order: 2, is_active: true },
  { id: 'mbti', tag: '무운에서만', title: 'MBTI × 사주\n궁합 분석', sub: '성격 유형과 오행의 만남', cta: '궁합 보기', href: '/hybrid-compatibility', gradient: 'linear-gradient(135deg, #334155 0%, #475569 100%)', watermark: '合\n命', sort_order: 3, is_active: true },
  { id: 'naming', tag: '작명소', title: '아이 이름\n사주로 짓다', sub: '402자 검증 한자 · 81수리 성명학', cta: '이름 짓기', href: '/naming', gradient: 'linear-gradient(135deg, #4A31B0 0%, #3A2490 100%)', watermark: '名\n字', sort_order: 4, is_active: true },
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
    <section className="mu-container-narrow py-4" aria-label="추천 서비스">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y gap-3">
          {banners.map((b) => (
            <div key={b.id} className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_47%]">
              <Link href={b.href} className="block overflow-hidden rounded-[28px] px-5 py-5 shadow-[0_24px_42px_rgba(15,23,42,0.12)]" style={{ background: b.gradient }}>
                <div className="relative min-h-[168px]">
                  {b.watermark && (
                    <span className="pointer-events-none absolute right-0 top-0 whitespace-pre-line text-right font-serif text-[64px] font-black leading-[0.86] text-white/12">
                      {b.watermark}
                    </span>
                  )}
                  {b.tag && <span className="inline-flex rounded-full bg-white/14 px-3 py-1 text-[11px] font-bold text-white/92 backdrop-blur">{b.tag}</span>}
                  <h3 className="relative mt-4 whitespace-pre-line text-[26px] font-extrabold leading-[1.12] tracking-[-0.05em] text-white">{b.title}</h3>
                  {b.sub && <p className="relative mt-3 max-w-[260px] text-sm leading-7 text-white/80">{b.sub}</p>}
                  <span className="relative mt-5 inline-flex rounded-full bg-white/14 px-4 py-2 text-xs font-bold text-white backdrop-blur">{b.cta}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {banners.map((b, index) => (
          <button
            key={b.id}
            type="button"
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2.5 rounded-full transition-all ${index === selectedIndex ? 'w-6 bg-[#6B5FFF]' : 'w-2.5 bg-slate-300'}`}
            aria-label={`${index + 1}번 배너`}
          />
        ))}
      </div>
    </section>
  );
}
