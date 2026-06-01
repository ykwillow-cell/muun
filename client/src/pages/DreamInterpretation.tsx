import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'wouter';
import { Search, MoonStar, PawPrint, Users, Mountain, Box, Activity, Layers, Trophy, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import RelatedServices from '@/components/RelatedServices';
import { useCanonical } from '@/lib/use-canonical';
import { DREAM_INDEX } from '@/generated/content-snapshots';

type DreamGrade = 'great' | 'good' | 'bad';

const categories = [
  { id: null, name: '전체', Icon: Layers },
  { id: 'animal', name: '동물', Icon: PawPrint },
  { id: 'person', name: '인물 · 신체', Icon: Users },
  { id: 'nature', name: '자연 · 현상', Icon: Mountain },
  { id: 'object', name: '생활 · 사물', Icon: Box },
  { id: 'action', name: '상태 · 행동', Icon: Activity },
  { id: 'other', name: '기타', Icon: Layers },
] as const;

const quickTags = ['돼지', '물', '불', '뱀', '돈', '조상', '이빨', '대통령'] as const;

const gradeConfig: Record<DreamGrade, { label: string; Icon: typeof Trophy; tone: string; chip: string; panel: string; barColor: string }> = {
  great: {
    label: '길몽',
    Icon: Trophy,
    tone: 'text-amber-600',
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    panel: 'from-amber-50 via-white to-amber-50/60',
    barColor: '#d97706',
  },
  good: {
    label: '평몽',
    Icon: CheckCircle2,
    tone: 'text-sky-600',
    chip: 'bg-sky-50 text-sky-700 border-sky-200',
    panel: 'from-sky-50 via-white to-sky-50/60',
    barColor: '#0284c7',
  },
  bad: {
    label: '흉몽',
    Icon: AlertCircle,
    tone: 'text-fuchsia-600',
    chip: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    panel: 'from-fuchsia-50 via-white to-fuchsia-50/60',
    barColor: '#9333ea',
  },
};

export default function DreamInterpretation() {
  useCanonical('/dream');
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const query = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') || '' : '';
    setSearchTerm(query);
  }, [location]);

  const filteredDreams = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let list = activeCategory ? DREAM_INDEX.filter((item) => item.category === activeCategory) : [...DREAM_INDEX];
    if (q) {
      list = list.filter((item) =>
        [item.keyword, item.excerpt, item.categoryLabel, item.metaDescription].join(' ').toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [searchTerm, activeCategory]);

  const gradeStats = useMemo(() => ({
    great: DREAM_INDEX.filter((item) => item.grade === 'great').length,
    good: DREAM_INDEX.filter((item) => item.grade === 'good').length,
    bad: DREAM_INDEX.filter((item) => item.grade === 'bad').length,
  }), []);

  return (
    <div className="min-h-screen mu-page-bg pb-16">
      <Helmet>
        <title>꿈해몽 - 자주 찾는 길몽·흉몽 무료 풀이 | 무운 (MuUn)</title>
        <meta name="description" content="돼지꿈, 물꿈, 불꿈, 조상꿈, 대통령꿈까지. 무운의 꿈 풀이 사전에서 길몽·평몽·흉몽 풀이를 무료로 찾아보세요." />
        <meta name="keywords" content="꿈해몽, 꿈풀이, 길몽, 흉몽, 돼지꿈, 물꿈, 불꿈, 조상꿈, 대통령꿈" />
        <link rel="canonical" href="https://muunsaju.com/dream" />
        <meta property="og:title" content="꿈해몽 - 자주 찾는 길몽·흉몽 무료 풀이 | 무운 (MuUn)" />
        <meta property="og:description" content="돼지꿈, 물꿈, 불꿈, 조상꿈, 대통령꿈까지. 무운의 꿈 풀이 사전에서 길몽·평몽·흉몽 풀이를 무료로 찾아보세요." />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ━━━ 히어로 ━━━ */}
      <section className="mu-dream-hero">
        {/* 배경 레이어 */}
        <div className="mu-dream-hero__bg" aria-hidden="true" />
        <div className="mu-dream-hero__stars" aria-hidden="true" />

        <div className="mu-container-narrow px-4 pt-6 pb-6 relative z-10">
          {/* eyebrow */}
          <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold mb-4"
            style={{
              background: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(111,99,255,0.15)',
              color: '#5a4ddb',
              backdropFilter: 'blur(4px)',
            }}>
            <MoonStar size={13} aria-hidden="true" />
            꿈 풀이 · 해몽 사전
          </div>

          <h1 className="text-[26px] font-extrabold leading-[1.22] tracking-[-0.05em] mb-2.5"
            style={{ color: '#1e2340' }}>
            오늘 밤 꿈이<br />길몽일까 흉몽일까
          </h1>
          <p className="text-sm leading-7 mb-5" style={{ color: '#6b6c91' }}>
            전통 동양 해몽과 심리학적 관점을 함께 담은<br />무운의 꿈 풀이 사전입니다.
          </p>

          {/* 통계 + 검색 카드 */}
          <div className="rounded-[20px] overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.82)',
              border: '1px solid rgba(111,99,255,0.10)',
              boxShadow: '0 16px 40px rgba(80,71,140,0.09)',
              backdropFilter: 'blur(8px)',
            }}>

            {/* 통계 행 */}
            <div className="flex divide-x divide-[rgba(111,99,255,0.08)] border-b border-[rgba(111,99,255,0.07)]">
              {([
                { key: 'great', label: '길몽 키워드', color: '#c5870a' },
                { key: 'good',  label: '평몽 키워드', color: '#2563eb' },
                { key: 'bad',   label: '흉몽 키워드', color: '#8b3cd8' },
              ] as const).map(({ key, label, color }) => (
                <div key={key} className="flex-1 py-3.5 text-center">
                  <div className="text-[19px] font-extrabold tracking-[-0.04em] leading-none mb-1"
                    style={{ color }}>
                    {gradeStats[key]}
                  </div>
                  <div className="text-xs font-semibold" style={{ color: '#8b8fb0' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* 검색 */}
            <div className="px-3.5 pt-3 pb-3">
              <label className="relative block mb-2.5">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  size={15}
                  style={{ color: '#a09abe' }}
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="꿈 키워드 검색 (예: 돼지, 이빨, 조상)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-[#6B5FFF]/20"
                  style={{
                    background: 'rgba(249,248,255,0.95)',
                    border: '1px solid rgba(111,99,255,0.12)',
                    color: '#1e2340',
                    fontSize: '14px',
                  }}
                />
              </label>

              {/* 퀵태그 */}
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(searchTerm === tag ? '' : tag)}
                    className="flex-shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                    style={searchTerm === tag
                      ? { background: '#5a4ddb', color: '#fff', border: '1px solid #5a4ddb' }
                      : { background: 'rgba(255,255,255,0.9)', color: '#5a4ddb', border: '1px solid rgba(111,99,255,0.18)' }
                    }
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 카테고리 필터 ━━━ */}
      <section className="mu-container-narrow pt-3 pb-1">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar px-4">
          {categories.map(({ id, name, Icon }) => {
            const active = activeCategory === id;
            return (
              <button
                key={name}
                onClick={() => setActiveCategory(id)}
                className="flex-shrink-0 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors"
                style={active
                  ? { background: '#1e2340', color: '#fff', border: '1px solid #1e2340' }
                  : { background: '#fff', color: '#64748b', border: '0.5px solid #e2e8f0' }
                }
              >
                <Icon size={12} aria-hidden="true" />
                {name}
              </button>
            );
          })}
        </div>
      </section>

      {/* ━━━ 카드 그리드 ━━━ */}
      <section className="mu-container-narrow pb-10 px-4">
        {filteredDreams.length > 0 ? (
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))' }}>
            {filteredDreams.map((dream) => {
              const grade = gradeConfig[dream.grade as DreamGrade] || gradeConfig.good;
              const GradeIcon = grade.Icon;
              return (
                <Link key={dream.slug} href={`/dream/${dream.slug}`}
                  className="block bg-white rounded-[14px] overflow-hidden transition-transform hover:-translate-y-0.5"
                  style={{ border: '0.5px solid #e9e5fa', boxShadow: '0 2px 12px rgba(80,71,140,0.06)' }}>
                  <div className="p-3.5">
                    {/* 뱃지 + 아이콘 */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${grade.chip}`}>
                        <GradeIcon size={11} aria-hidden="true" />
                        {grade.label}
                      </span>
                      <ArrowUpRight size={14} className="text-slate-300" aria-hidden="true" />
                    </div>

                    {/* 패널 */}
                    <div className={`rounded-[10px] bg-gradient-to-br ${grade.panel} p-3 mb-3`}>
                      <div className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400 mb-1.5">
                        {dream.categoryLabel}
                      </div>
                      <h2 className="text-base font-extrabold tracking-[-0.04em] text-slate-900 leading-snug mb-2.5 line-clamp-2">
                        {dream.keyword} 꿈해몽
                      </h2>
                      <div className="h-1 rounded-full bg-white/70">
                        <div className="h-1 rounded-full transition-all"
                          style={{ width: `${Math.min(100, dream.score)}%`, background: grade.barColor }} />
                      </div>
                    </div>

                    {/* 발췌 */}
                    <p className="text-xs leading-relaxed text-slate-500 line-clamp-2 mb-2.5">{dream.excerpt}</p>
                    <div className={`text-xs font-bold ${grade.tone}`}>상세 풀이 보기 →</div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mu-glass-panel px-6 py-12 text-center">
            <h2 className="text-[22px] font-bold tracking-[-0.04em] text-slate-900">검색 결과가 없습니다</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">다른 꿈 키워드나 카테고리로 다시 찾아보세요.</p>
          </div>
        )}
      </section>

      <RelatedServices
        title="꿈해몽과 함께 보면 좋은 서비스"
        services={[
          { href: '/lifelong-saju', emoji: '🔮', label: '평생사주', description: '꿈에서 느낀 기운이 내 사주와 어떻게 연결되는지 확인해보세요.' },
          { href: '/daily-fortune', emoji: '📅', label: '오늘의 운세', description: '오늘의 전반적인 운의 흐름과 꿈 내용을 함께 비교해보세요.' },
          { href: '/fortune-dictionary', emoji: '📖', label: '운세 사전', description: '꿈 속 상징을 명리학 용어로 더 깊이 이해해보세요.' },
          { href: '/compatibility', emoji: '💞', label: '궁합', description: '꿈에 특정 사람이 나왔다면 궁합도 함께 확인해보세요.' },
        ]}
      />
    </div>
  );
}
