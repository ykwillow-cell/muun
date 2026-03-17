/**
 * RecommendedContent.tsx
 * 운세 결과 페이지 하단에 표시되는 콘텐츠 추천 섹션
 * - 운세 칼럼, 꿈해몽의 최신글을 카드 형태로 노출
 * - 사용자의 사이트 내 체류 시간 및 탐색 경험 향상 목적
 */
import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { BookOpen, CloudMoon, BookMarked, ArrowRight, Sparkles } from 'lucide-react';
import { getLatestColumns, type ColumnData } from '@/lib/column-data-api';
import { getLatestDreams, type DreamData } from '@/lib/dream-data-api';
import { trackCustomEvent } from '@/lib/ga4';
import { useLocation } from 'wouter';

type RecommendItem =
  | { type: 'column'; data: ColumnData }
  | { type: 'dream'; data: DreamData }
  | { type: 'dictionary'; id: string; title: string; summary: string; slug: string };

const DICTIONARY_PICKS: { id: string; title: string; summary: string; slug: string }[] = [
  { id: 'evil-001', title: '역마살(驛馬殺)', summary: '끊임없이 움직이고 변화를 추구하는 에너지', slug: 'yeokma-sal' },
  { id: 'evil-002', title: '도화살(桃花殺)', summary: '매력과 인기, 예술적 감수성을 상징하는 기운', slug: 'dohwa-sal' },
  { id: 'basic-001', title: '사주팔자(四柱八字)', summary: '인생의 설계도, 태어날 때부터 가지고 있는 에너지 코드', slug: 'saju-palcha' },
];

export default function RecommendedContent() {
  const [items, setItems] = useState<RecommendItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [location] = useLocation();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [columns, dreams] = await Promise.all([
          getLatestColumns(2),
          getLatestDreams(2),
        ]);

        const mixed: RecommendItem[] = [];

        // 칼럼 1개
        if (columns.length > 0) {
          mixed.push({ type: 'column', data: columns[0] });
        }
        // 꿈해몽 1개
        if (dreams.length > 0) {
          mixed.push({ type: 'dream', data: dreams[0] });
        }
        // 칼럼 2번째
        if (columns.length > 1) {
          mixed.push({ type: 'column', data: columns[1] });
        }
        // 운세 사전 1개 (정적)
        mixed.push({ type: 'dictionary', ...DICTIONARY_PICKS[Math.floor(Math.random() * DICTIONARY_PICKS.length)] });

        setItems(mixed.slice(0, 4));
      } catch (e) {
        // 오류 시 사전 항목만 표시
        setItems(
          DICTIONARY_PICKS.slice(0, 3).map((d) => ({ type: 'dictionary' as const, ...d }))
        );
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleClick = (item: RecommendItem) => {
    const contentType = item.type;
    const contentId =
      item.type === 'column'
        ? item.data.id
        : item.type === 'dream'
        ? item.data.slug
        : item.id;

    trackCustomEvent('click_recommendation', {
      content_type: contentType,
      content_id: contentId,
      source_page: location,
    });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-10 px-4 pb-10">
        <div className="h-6 w-40 bg-black/[0.05] rounded-full animate-pulse mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-black/[0.05] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="w-full max-w-2xl mx-auto mt-10 px-4 pb-12">
      {/* 섹션 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-5"
      >
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-bold tracking-widest text-primary uppercase">
          지금 읽어볼 만한 이야기
        </h2>
      </motion.div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
          >
            {item.type === 'column' && (
              <Link href={`/guide/${item.data.id}`}>
                <div
                  onClick={() => handleClick(item)}
                  className="group flex flex-col h-full min-h-[80px] bg-black/[0.05] border border-black/10 rounded-2xl overflow-hidden hover:border-primary/40 hover:bg-white/8 transition-all cursor-pointer active:scale-[0.98]"
                >
                  {item.data.thumbnail && (
                    <div className="w-full h-20 overflow-hidden bg-black/[0.05] flex-shrink-0">
                      <img
                        src={item.data.thumbnail}
                        alt={item.data.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <BookOpen className="w-3 h-3 text-primary flex-shrink-0" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">운세 칼럼</span>
                      </div>
                      <p className="text-xs font-semibold text-[#1a1a18]/90 line-clamp-2 leading-snug">
                        {item.data.title}
                      </p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#999891] group-hover:text-primary transition-colors mt-2 self-end" />
                  </div>
                </div>
              </Link>
            )}

            {item.type === 'dream' && (
              <Link href={`/dream/${item.data.slug}`}>
                <div
                  onClick={() => handleClick(item)}
                  className="group flex flex-col h-full min-h-[80px] bg-black/[0.05] border border-black/10 rounded-2xl overflow-hidden hover:border-purple-500/40 hover:bg-white/8 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <CloudMoon className="w-3 h-3 text-purple-400 flex-shrink-0" />
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">꿈해몽</span>
                      </div>
                      <p className="text-xs font-semibold text-[#1a1a18]/90 line-clamp-2 leading-snug">
                        {item.data.keyword}
                      </p>
                      <p className="text-[10px] text-[#999891] mt-1 line-clamp-2 leading-snug">
                        {item.data.interpretation}
                      </p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#999891] group-hover:text-purple-400 transition-colors mt-2 self-end" />
                  </div>
                </div>
              </Link>
            )}

            {item.type === 'dictionary' && (
              <Link href={`/dictionary/${item.slug}`}>
                <div
                  onClick={() => handleClick(item)}
                  className="group flex flex-col h-full min-h-[80px] bg-black/[0.05] border border-black/10 rounded-2xl overflow-hidden hover:border-yellow-500/40 hover:bg-white/8 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <BookMarked className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                        <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">운세 사전</span>
                      </div>
                      <p className="text-xs font-semibold text-[#1a1a18]/90 line-clamp-2 leading-snug">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-[#999891] mt-1 line-clamp-2 leading-snug">
                        {item.summary}
                      </p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#999891] group-hover:text-yellow-400 transition-colors mt-2 self-end" />
                  </div>
                </div>
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
