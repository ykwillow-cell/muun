import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { fetchFortuneDictionary, type DictionaryEntry } from '@/lib/fortune-dictionary';
import { Link } from 'wouter';

/**
 * 오늘의 사주 용어를 추천하는 카드 컴포넌트
 * 매일 다른 용어를 보여줍니다.
 */
export function TodayTermCard() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchFortuneDictionary().then((data) => {
      setEntries(data);
      setLoaded(true);
    });
  }, []);

  // 오늘 날짜를 기반으로 일관된 용어를 선택 (매일 바뀜)
  const todayTerm = useMemo(() => {
    if (!entries.length) return null;
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const index = dayOfYear % entries.length;
    return entries[index];
  }, [entries]);

  // 로딩 중이거나 데이터 없으면 렌더링 안 함
  if (!loaded || !todayTerm) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-start gap-3 p-3.5 rounded-2xl bg-purple-500/[0.07] border border-purple-500/20 hover:border-purple-500/30 transition-all"
    >
      {/* 아이콘 */}
      <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4 text-purple-600" />
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-purple-600/60">오늘의 사주 용어</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">{todayTerm.categoryLabel}</span>
        </div>
        <h3 className="text-[14px] font-bold text-[#1a1a18] mb-1 leading-snug">{todayTerm.title}</h3>
        <p className="text-[12px] text-[#999891] leading-relaxed line-clamp-2">{todayTerm.modernInterpretation}</p>
      </div>

      {/* 사전 링크 */}
      <Link href="/fortune-dictionary" className="flex-shrink-0">
        <span className="flex items-center gap-0.5 text-[11px] text-purple-300/60 hover:text-purple-300 transition-colors whitespace-nowrap mt-0.5">
          사전 <ArrowRight className="w-3 h-3" />
        </span>
      </Link>
    </motion.div>
  );
}
