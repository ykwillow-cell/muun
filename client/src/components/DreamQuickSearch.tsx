import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Search, CloudMoon, ArrowRight } from 'lucide-react';

export const DreamQuickSearch: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      setLocation(`/dream?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <section className="px-4 py-4 border-b border-white/[0.07]">
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-indigo-500/[0.07] border border-indigo-500/20 hover:border-indigo-500/30 transition-all">
        {/* 아이콘 */}
        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
          <CloudMoon className="w-4 h-4 text-indigo-300" />
        </div>

        {/* 검색 폼 */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 min-w-0">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="꿈 키워드 검색 (예: 돼지, 불, 조상)"
            className="flex-1 bg-transparent text-[13px] text-[#1a1a18] placeholder:text-[#1a1a18]/25 outline-none min-w-0"
          />
          <button
            type="submit"
            className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 flex items-center justify-center transition-colors"
            aria-label="꿈해몽 검색"
          >
            <Search className="w-3.5 h-3.5 text-indigo-300" />
          </button>
        </form>

        {/* 전체보기 링크 */}
        <Link href="/dream" className="flex-shrink-0">
          <span className="flex items-center gap-0.5 text-[11px] text-indigo-300/60 hover:text-indigo-300 transition-colors whitespace-nowrap">
            전체보기 <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
    </section>
  );
};
