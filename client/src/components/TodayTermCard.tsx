import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { fortuneDictionary } from '@/lib/fortune-dictionary';
import { Link } from 'wouter';

/**
 * 오늘의 사주 용어를 추천하는 카드 컴포넌트
 * 매일 다른 용어를 보여줍니다.
 */
export function TodayTermCard() {
  // 오늘 날짜를 기반으로 일관된 용어를 선택 (매일 바뀜)
  const todayTerm = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    // fortuneDictionary의 길이로 나눈 나머지를 인덱스로 사용
    const index = dayOfYear % fortuneDictionary.length;
    return fortuneDictionary[index];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-slate-900/20 border border-purple-500/30 p-6 md:p-8"
    >
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
            오늘의 사주 용어
          </span>
        </div>

        {/* 용어 제목 */}
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {todayTerm.title}
        </h3>

        {/* 카테고리 배지 */}
        <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
          <span className="text-xs font-medium text-purple-300">
            {todayTerm.categoryLabel}
          </span>
        </div>

        {/* 설명 */}
        <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6 line-clamp-3">
          {todayTerm.modernInterpretation}
        </p>

        {/* CTA 버튼 */}
        <Link href="/fortune-dictionary">
          <motion.div
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium text-sm transition-all cursor-pointer group"
          >
            <BookOpen className="w-4 h-4" />
            <span>전체 사전 보기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}
