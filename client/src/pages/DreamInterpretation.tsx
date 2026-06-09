import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Search, MoonStar, PawPrint, Users, Mountain, Box, Activity, Layers, Trophy, CheckCircle2, AlertCircle, ArrowUpRight, Loader2 } from 'lucide-react';
import RelatedServices from '@/components/RelatedServices';
import { useCanonical } from '@/lib/use-canonical';
import { DREAM_INDEX } from '@/generated/content-snapshots';
import { getAllDreams } from '@/lib/dream-data-api';
import type { DreamData } from '@/lib/dream-data-api';

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

const gradeConfig: Record<DreamGrade, { label: string; Icon: typeof Trophy; tone: string; chip: string; chipActive: string; panel: string; barColor: string }> = {
  great: {
    label: '길몽', Icon: Trophy, tone: 'text-amber-600',
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    chipActive: 'bg-amber-500 text-white border-amber-500',
    panel: 'from-amber-50 via-white to-amber-50/60', barColor: '#d97706',
  },
  good: {
    label: '평몽', Icon: CheckCircle2, tone: 'text-sky-600',
    chip: 'bg-sky-50 text-sky-700 border-sky-200',
    chipActive: 'bg-sky-500 text-white border-sky-500',
    panel: 'from-sky-50 via-white to-sky-50/60', barColor: '#0284c7',
  },
  bad: {
    label: '흉몽', Icon: AlertCircle, tone: 'text-fuchsia-600',
    chip: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    chipActive: 'bg-fuchsia-500 text-white border-fuchsia-500',
    panel: 'from-fuchsia-50 via-white to-fuchsia-50/60', barColor: '#9333ea',
  },
};

// DREAM_INDEX(스냅샷)를 DreamData 형태로 변환
function snapshotToData(item: typeof DREAM_INDEX[number]): DreamData {
  return {
    id: item.id,
    keyword: item.keyword,
    slug: item.slug,
    interpretation: item.excerpt || '',
    traditional_meaning: null,
    psychological_meaning: null,
    category: item.category,
    grade: item.grade as DreamGrade,
    score: item.score,
    meta_title: item.metaTitle || null,
    meta_description: item.metaDescription || item.excerpt || null,
    published: true,
    published_at: item.publishedDate || null,
    created_at: item.publishedDate || new Date().toISOString(),
  };
}

export default function DreamInterpretation() {
  useCanonical('/dream');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeGrade, setActiveGrade] = useState<DreamGrade | null>(null);

  // Supabase에서 전체 데이터 로드 (스냅샷보다 우선)
  const [allDreams, setAllDreams] = useState<DreamData[]>(() =>
    DREAM_INDEX.map(snapshotToData)
  );
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // URL 초기 검색어
    const q = new URLSearchParams(window.location.search).get('q') || '';
    if (q) setSearchTerm(q);

    // Supabase에서 최신 데이터 fetch (중복 방지)
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    getAllDreams()
      .then((data) => {
        if (data && data.length > 0) {
          setAllDreams([...data]);
        }
      })
      .catch(() => {/* 실패 시 스냅샷 유지 */})
      .finally(() => setLoading(false));
  }, []);

  const filteredDreams = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let list = [...allDreams];

    if (activeGrade) {
      list = list.filter((item) => item.grade === activeGrade);
    }
    if (activeCategory) {
      list = list.filter((item) => item.category === activeCategory);
    }
    if (q) {
      list = list.filter((item) => {
        const target = [
          item.keyword,
          item.interpretation,
          item.meta_description,
          item.category,
        ].join(' ').toLowerCase();
        return target.includes(q);
      });
    }
    return list.sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [searchTerm, activeCategory, activeGrade, allDreams]);

  const gradeStats = useMemo(() => ({
    great: allDreams.filter((item) => item.grade === 'great').length,
    good: allDreams.filter((item) => item.grade === 'good').length,
    bad: allDreams.filter((item) => item.grade === 'bad').length,
  }), [allDreams]);

  // 카테고리 라벨 매핑
  const categoryLabelMap: Record<string, string> = {
    animal: '동물', person: '인물 · 신체', nature: '자연 · 현상',
    object: '생활 · 사물', action: '상태 · 행동', other: '기타',
  };

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
        <div className="mu-dream-hero__bg" aria-hidden="true" />
        <div className="mu-dream-hero__stars" aria-hidden="true" />

        <div className="mu-container-narrow px-4 pt-6 pb-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold mb-4"
            style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(111,99,255,0.15)', color: '#5a4ddb', backdropFilter: 'blur(4px)' }}>
            <MoonStar size={14} aria-hidden="true" />
            꿈 풀이 · 해몽 사전
          </div>

          <h1 className="text-[26px] font-extrabold leading-[1.22] tracking-[-0.05em] mb-3" style={{ color: '#1e2340' }}>
            오늘 밤 꿈이<br />길몽일까 흉몽일까
          </h1>
          <p className="text-base leading-7 mb-5" style={{ color: '#6b6c91' }}>
            전통 동양 해몽과 심리학적 관점을 함께 담은<br />무운의 꿈 풀이 사전입니다.
          </p>

          {/* 통계 + 검색 카드 */}
          <div className="rounded-[20px] overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid rgba(111,99,255,0.10)', boxShadow: '0 16px 40px rgba(80,71,140,0.09)', backdropFilter: 'blur(8px)' }}>

            {/* 통계 행 */}
            <div className="flex divide-x divide-[rgba(111,99,255,0.08)] border-b border-[rgba(111,99,255,0.07)]">
              {([
                { key: 'great', label: '길몽 키워드', color: '#c5870a', activeBg: '#fef3c7' },
                { key: 'good',  label: '평몽 키워드', color: '#2563eb', activeBg: '#dbeafe' },
                { key: 'bad',   label: '흉몽 키워드', color: '#8b3cd8', activeBg: '#fae8ff' },
              ] as const).map(({ key, label, color, activeBg }) => (
                <button key={key}
                  onClick={() => setActiveGrade(activeGrade === key ? null : key)}
                  className="flex-1 py-3.5 text-center transition-colors"
                  style={activeGrade === key ? { background: activeBg } : {}}>
                  <div className="text-[19px] font-extrabold tracking-[-0.04em] leading-none mb-1" style={{ color }}>
                    {loading ? '…' : gradeStats[key]}
                  </div>
                  <div className="text-xs font-semibold" style={{ color: '#8b8fb0' }}>{label}</div>
                </button>
              ))}
            </div>

            {/* 검색 */}
            <div className="pt-3 pb-3 px-3.5">
              <div className="relative mb-3 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" size={16} style={{ color: '#a09abe' }} aria-hidden="true" />
                <input
                  type="text"
                  placeholder="꿈 키워드를 검색해보세요 (예: 돼지, 이빨, 조상)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoComplete="off"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '44px',
                    paddingLeft: '40px',
                    paddingRight: '16px',
                    borderRadius: '12px',
                    outline: 'none',
                    background: 'rgba(249,248,255,0.95)',
                    border: '1px solid rgba(111,99,255,0.12)',
                    color: '#1e2340',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* 퀵태그 */}
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                {quickTags.map((tag) => (
                  <button key={tag}
                    onClick={() => setSearchTerm(searchTerm === tag ? '' : tag)}
                    className="flex-shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 font-semibold transition-colors"
                    style={{
                      fontSize: '14px',
                      ...(searchTerm === tag
                        ? { background: '#5a4ddb', color: '#fff', border: '1px solid #5a4ddb' }
                        : { background: 'rgba(255,255,255,0.9)', color: '#5a4ddb', border: '1px solid rgba(111,99,255,0.18)' }
                      ),
                    }}>
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 등급 + 카테고리 필터 ━━━ */}
      <section className="mu-container-narrow pt-3 pb-0">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-4">
          {categories.map(({ id, name, Icon }) => {
            const active = activeCategory === id;
            return (
              <button key={name}
                onClick={() => setActiveCategory(id)}
                className="flex-shrink-0 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-semibold transition-colors"
                style={{
                  fontSize: '14px', padding: '6px 14px',
                  ...(active
                    ? { background: '#1e2340', color: '#fff', border: '1px solid #1e2340' }
                    : { background: '#fff', color: '#64748b', border: '0.5px solid #e2e8f0' }
                  ),
                }}>
                <Icon size={13} aria-hidden="true" />
                {name}
              </button>
            );
          })}
        </div>

        {(activeGrade || activeCategory || searchTerm.trim()) && (
          <div className="flex items-center justify-between px-4 pb-2">
            <span className="text-sm text-slate-500">{filteredDreams.length}개 결과</span>
            <button
              onClick={() => { setActiveGrade(null); setActiveCategory(null); setSearchTerm(''); }}
              className="text-sm font-bold transition-opacity hover:opacity-70"
              style={{ color: '#5a4ddb' }}>
              필터 초기화
            </button>
          </div>
        )}
      </section>

      {/* ━━━ 카드 그리드 ━━━ */}
      <section className="mu-container-narrow pt-2 pb-10 px-4">
        {loading && allDreams.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#6B5FFF]" />
          </div>
        ) : filteredDreams.length > 0 ? (
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))' }}>
            {filteredDreams.map((dream) => {
              const grade = gradeConfig[dream.grade as DreamGrade] || gradeConfig.good;
              const GradeIcon = grade.Icon;
              const catLabel = categoryLabelMap[dream.category] || dream.category;
              const excerpt = dream.interpretation || dream.meta_description || '';
              return (
                <Link key={dream.id || dream.slug} href={`/dream/${dream.slug}`}
                  className="block bg-white rounded-[14px] overflow-hidden transition-transform hover:-translate-y-0.5"
                  style={{ border: '0.5px solid #e9e5fa', boxShadow: '0 2px 12px rgba(80,71,140,0.06)' }}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-bold ${grade.chip}`} style={{ fontSize: '12px' }}>
                        <GradeIcon size={11} aria-hidden="true" />
                        {grade.label}
                      </span>
                      <ArrowUpRight size={15} className="text-slate-300" aria-hidden="true" />
                    </div>

                    <div className={`rounded-[10px] bg-gradient-to-br ${grade.panel} p-3 mb-3`}>
                      <div className="font-bold uppercase tracking-[0.08em] text-slate-400 mb-1.5" style={{ fontSize: '12px' }}>
                        {catLabel}
                      </div>
                      <h2 className="font-extrabold tracking-[-0.04em] text-slate-900 leading-snug mb-2.5 line-clamp-2" style={{ fontSize: '16px' }}>
                        {dream.keyword} 꿈해몽
                      </h2>
                      <div className="h-1 rounded-full bg-white/70">
                        <div className="h-1 rounded-full transition-all"
                          style={{ width: `${Math.min(100, dream.score)}%`, background: grade.barColor }} />
                      </div>
                    </div>

                    <p className="leading-relaxed text-slate-500 line-clamp-2 mb-3" style={{ fontSize: '14px' }}>
                      {excerpt}
                    </p>
                    <div className={`font-bold ${grade.tone}`} style={{ fontSize: '14px' }}>
                      상세 풀이 보기 →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[20px] px-6 py-12 text-center"
            style={{ background: '#fff', border: '1px solid rgba(107,95,255,0.12)', boxShadow: '0 4px 24px rgba(80,71,140,0.07)' }}>
            <div className="text-4xl mb-4">🔍</div>
            {searchTerm.trim() ? (
              <>
                <h2 className="text-[18px] font-bold tracking-[-0.03em]" style={{ color: '#1e2340' }}>
                  <span style={{ color: '#6B5FFF' }}>'{searchTerm.trim()}'</span>에 대한 꿈해몽이 없어요
                </h2>
                <p className="mt-2 leading-7" style={{ color: '#8b8fb0', fontSize: '14px' }}>
                  다른 키워드로 검색하거나 필터를 초기화해보세요.
                </p>
                <button onClick={() => setSearchTerm('')}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-semibold text-sm"
                  style={{ background: '#6B5FFF', color: '#fff' }}>
                  검색어 지우기
                </button>
              </>
            ) : (
              <>
                <h2 className="text-[18px] font-bold tracking-[-0.03em]" style={{ color: '#1e2340' }}>
                  해당 조건의 꿈이 없어요
                </h2>
                <p className="mt-2 leading-7" style={{ color: '#8b8fb0', fontSize: '14px' }}>
                  다른 카테고리나 등급 필터로 다시 찾아보세요.
                </p>
                <button onClick={() => { setActiveGrade(null); setActiveCategory(null); }}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-semibold text-sm"
                  style={{ background: '#6B5FFF', color: '#fff' }}>
                  필터 초기화
                </button>
              </>
            )}
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
