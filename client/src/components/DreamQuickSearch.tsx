import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Search, CloudMoon, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const DreamQuickSearch: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      // 검색어를 쿼리 스트링으로 전달하여 이동
      setLocation(`/dream?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <section className="px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900/40 border border-white/10 backdrop-blur-xl p-8 md:p-10"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <CloudMoon className="w-24 h-24 text-purple-400" />
          </div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold mb-4">
                <Sparkles className="w-3 h-3" /> 신규 서비스
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                어젯밤 꿈의 의미가 궁금하신가요?
              </h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
                돼지꿈, 불나는 꿈, 조상님 꿈까지!<br className="hidden md:block" />
                무운의 방대한 데이터로 당신의 꿈을 지금 바로 해몽해 보세요.
              </p>
              
              {/* Added link to Dream Interpretation Main */}
              <Link href="/dream">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 hover:border-primary/30 transition-all group">
                  꿈해몽 사전 전체보기
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            <div className="w-full md:w-auto flex-shrink-0">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="꿈 키워드 입력 (예: 돼지)"
                  className="w-full md:w-[300px] pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  해몽하기
                </button>
              </form>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                {["돼지", "물", "불", "뱀", "돈"].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setLocation(`/dream?q=${encodeURIComponent(tag)}`)}
                    className="text-[11px] text-slate-500 hover:text-purple-400 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
