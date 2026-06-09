import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'wouter';
import {
  Share2, Loader2, Trophy, CheckCircle2, AlertCircle,
  ArrowUpRight, MoonStar, Search, BookOpen, ChevronRight,
  Sparkles, Star, ArrowRight, Brain,
} from 'lucide-react';
import NotFound from '@/pages/NotFound';
import { useCanonical } from '@/lib/use-canonical';
import { getDreamBySlug, type DreamData } from '@/lib/dream-data-api';
import RelatedServices from '@/components/RelatedServices';
import { LinkedText } from '@/hooks/useLinkedText';
import { DREAM_INDEX } from '@/generated/content-snapshots';
import { trackCustomEvent } from '@/lib/ga4';

type DreamGrade = 'great' | 'good' | 'bad';

const gradeConfig: Record<DreamGrade, {
  label: string; Icon: typeof Trophy;
  chip: string; chipDark: string;
  description: string; panel: string;
  accent: string; accentBg: string; accentLight: string;
  emoji: string;
}> = {
  great: {
    label: '길몽', Icon: Trophy,
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    chipDark: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: '재물, 성취, 경사와 연결되는 경우가 많은 좋은 상징입니다.',
    panel: 'from-amber-50 to-orange-50',
    accent: '#d97706', accentBg: '#fef3c7', accentLight: '#fffbeb',
    emoji: '✨',
  },
  good: {
    label: '평몽', Icon: CheckCircle2,
    chip: 'bg-sky-50 text-sky-700 border-sky-200',
    chipDark: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    description: '일상의 흐름과 심리 상태를 부드럽게 반영하는 중립적 꿈으로 볼 수 있습니다.',
    panel: 'from-sky-50 to-indigo-50',
    accent: '#0284c7', accentBg: '#e0f2fe', accentLight: '#f0f9ff',
    emoji: '🌙',
  },
  bad: {
    label: '흉몽', Icon: AlertCircle,
    chip: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    chipDark: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    description: '주의가 필요한 시기, 혹은 감정적 긴장을 상징할 수 있습니다.',
    panel: 'from-fuchsia-50 to-purple-50',
    accent: '#9333ea', accentBg: '#fae8ff', accentLight: '#fdf4ff',
    emoji: '🌑',
  },
};

const DREAM_KEYWORD_CHIPS = [
  '돼지꿈', '뱀꿈', '불꿈', '물꿈', '이빨꿈', '똥꿈', '죽음꿈', '아기꿈',
  '결혼꿈', '로또꿈', '귀신꿈', '조상꿈',
];

const RELATED_SERVICES = [
  { href: '/daily-fortune', icon: '📅', label: '오늘의 운세', desc: '꿈이 암시하는 오늘의 운기를 확인해보세요', free: true },
  { href: '/lifelong-saju', icon: '🔮', label: '평생사주', desc: '타고난 운명의 흐름을 사주로 더 깊이', free: true },
  { href: '/compatibility', icon: '💞', label: '궁합', desc: '꿈에 누군가 나왔다면 그 사람과의 궁합도', free: true },
  { href: '/fortune-dictionary', icon: '📖', label: '운세사전', desc: '꿈 속 상징을 명리학 용어로 더 깊이', free: true },
  { href: '/tarot', icon: '🃏', label: '타로 상담', desc: '꿈이 전하는 메시지를 타로로 확인', free: true },
  { href: '/tojeong', icon: '📜', label: '토정비결', desc: '올해 나에게 찾아올 운의 흐름', free: true },
];

const DREAM_COLUMNS = [
  { href: '/guide/fortune-flow-late-bloom-fortune-9f61d4e0', category: '운명의 흐름', title: '막막한 인생길, 내 사주의 보물 지도를 펼칠 시간', summary: '꿈이 보여주는 방향과 사주가 가리키는 운의 흐름을 함께 읽으면 인생의 다음 챕터가 보입니다.', emoji: '🗺️', thumbBg: '#eef2ff' },
  { href: '/guide/2026-byongo-year-zodiac-fortune-all', category: '올해의 운세', title: '2026 병오년 띠별 운세 총정리', summary: '올해 내 띠의 전반적인 흐름을 미리 확인하세요. 꿈이 반복된다면 대운의 변화와 연결되어 있을 수 있습니다.', emoji: '🐴', thumbBg: '#fef9c3' },
  { href: '/guide/luck-2026-daeun-change-b0d87c9e', category: '대운 변화', title: '2026년 대운 변화: 당신의 운명이 바뀌는 시기', summary: '사주의 대운이 바뀌는 시기에는 꿈의 패턴도 달라집니다. 내 운명의 전환점이 언제인지 지금 확인해보세요.', emoji: '🔮', thumbBg: '#f0fdf4' },
];

export default function DreamDetail() {
  const { slug } = useParams<{ slug: string }>();
  const preview = DREAM_INDEX.find((item) => item.slug === slug);
  const [dream, setDream] = useState<DreamData | null | undefined>(undefined);
  useCanonical(`/dream/${slug}`);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!slug) { setDream(null); return; }
      try {
        const result = await getDreamBySlug(slug);
        if (active) setDream(result);
      } catch {
        // Supabase 실패 시 null로 설정 (아래에서 preview fallback 처리)
        if (active) setDream(null);
      }
    };
    load();
    return () => { active = false; };
  }, [slug]);

  const gradeKey = (dream?.grade || preview?.grade || 'good') as DreamGrade;
  const grade = gradeConfig[gradeKey] || gradeConfig.good;
  const GradeIcon = grade.Icon;
  const metaTitle = dream?.meta_title || preview?.metaTitle || `${preview?.keyword || slug} 꿈해몽 | 무운`;
  const metaDescription = dream?.meta_description || preview?.metaDescription || preview?.excerpt || '꿈의 의미와 해석을 알아보세요.';
  const canonicalUrl = `https://muunsaju.com/dream/${slug}`;
  const rawCategory = dream?.category || preview?.category || 'other';
  const { label: categoryLabel } = (
    { animal: '동물', nature: '자연 · 현상', person: '사람', object: '생활 · 사물',
      action: '행동', emotion: '감정', place: '장소', other: '기타' }[rawCategory]
    ? { label: { animal: '동물', nature: '자연 · 현상', person: '사람', object: '생활 · 사물',
        action: '행동', emotion: '감정', place: '장소', other: '기타' }[rawCategory] as string }
    : { label: preview?.categoryLabel || '기타' }
  );
  const publishedDate = preview?.publishedDate || '';
  const score = dream?.score || preview?.score || 70;

  const relatedDreams = useMemo(() => {
    const category = dream?.category || preview?.category;
    const published = DREAM_INDEX.filter((item) =>
      item.slug !== slug && !!item.publishedDate
    );

    // 같은 카테고리 우선, 부족하면 전체에서 score 높은 순으로 보충
    const sameCategory = published
      .filter((item) => category && item.category === category)
      .sort((a, b) => (b.score || 0) - (a.score || 0));

    if (sameCategory.length >= 4) return sameCategory.slice(0, 4);

    const others = published
      .filter((item) => !category || item.category !== category)
      .sort((a, b) => (b.score || 0) - (a.score || 0));

    return [...sameCategory, ...others].slice(0, 4);
  }, [dream?.category, preview?.category, slug]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: metaTitle, text: metaDescription, url: canonicalUrl });
      } else {
        await navigator.clipboard.writeText(canonicalUrl);
        alert('링크가 복사되었습니다.');
      }
    } catch { /* user cancelled */ }
  };

  // 로딩 중 (preview도 없으면 스피너)
  if (dream === undefined && !preview) {
    return (
      <div className="flex min-h-screen items-center justify-center mu-page-bg">
        <Loader2 className="h-8 w-8 animate-spin text-[#5648db]" />
      </div>
    );
  }
  // Supabase fetch 완료됐지만 데이터 없고 preview도 없으면 404
  if (dream === null && !preview) return <NotFound />;
  // dream이 아직 로딩 중이지만 preview 있으면 계속 렌더링 (dream 로드 완료 시 업데이트됨)

  return (
    <div className="min-h-screen mu-page-bg pb-20">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${dream?.keyword || preview?.keyword || slug}, ${dream?.keyword || preview?.keyword || slug} 꿈해몽, 꿈해몽, 꿈풀이, 무운`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: metaTitle,
            description: metaDescription,
            datePublished: publishedDate,
            author: { '@type': 'Organization', name: '무운 (MuUn)' },
            publisher: {
              '@type': 'Organization', name: '무운 (MuUn)',
              logo: { '@type': 'ImageObject', url: 'https://muunsaju.com/images/muun-mark.svg' },
            },
            mainEntityOfPage: canonicalUrl,
          })}
        </script>
      </Helmet>

      {/* ━━━ 히어로 ━━━ */}
      <section className="mu-dream-hero">
        {/* 배경 레이어 */}
        <div className="mu-dream-hero__bg" aria-hidden="true" />
        <div className="mu-dream-hero__stars" aria-hidden="true" />

        <div className="mu-container-reading px-4 pt-6 pb-6 relative z-10">
          {/* 뱃지 행 */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link href="/dream">
              <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold cursor-pointer transition-opacity hover:opacity-80"
                style={{
                  background: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(111,99,255,0.15)',
                  color: '#5a4ddb',
                  backdropFilter: 'blur(4px)',
                }}>
                <MoonStar size={12} aria-hidden="true" />
                꿈 풀이 사전
              </span>
            </Link>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${grade.chip}`}>
              <GradeIcon size={12} aria-hidden="true" />
              {grade.label}
            </span>
            <span className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold"
              style={{
                background: 'rgba(255,255,255,0.65)',
                border: '1px solid rgba(111,99,255,0.15)',
                color: '#5a4ddb',
                backdropFilter: 'blur(4px)',
              }}>
              {categoryLabel}
            </span>
          </div>

          {/* 제목 */}
          <h1 className="text-[26px] font-extrabold leading-[1.2] tracking-[-0.05em] mb-2"
            style={{ color: '#1e2340' }}>
            {(dream?.keyword || preview?.keyword || slug).replace(/\s*꿈해몽\s*$/g, '').trim()} 꿈해몽
          </h1>
          <p className="text-sm leading-7 mb-5" style={{ color: '#6b6c91' }}>{metaDescription}</p>

          {/* 점수 카드 */}
          <div className="rounded-[16px] overflow-hidden mb-4"
            style={{
              background: 'rgba(255,255,255,0.82)',
              border: '1px solid rgba(111,99,255,0.10)',
              boxShadow: '0 16px 40px rgba(80,71,140,0.09)',
              backdropFilter: 'blur(8px)',
            }}>
            {/* 점수 헤더 */}
            <div className="flex items-center justify-between px-4 py-2.5"
              style={{ background: `${grade.accentBg}dd`, borderBottom: `1px solid rgba(111,99,255,0.06)` }}>
              <div className="flex items-center gap-1.5">
                <MoonStar size={13} style={{ color: grade.accent }} aria-hidden="true" />
                <span className="text-xs font-bold tracking-[0.08em]" style={{ color: grade.accent }}>꿈 점수</span>
              </div>
              <div className="rounded-full px-3 py-1 text-sm font-bold text-white"
                style={{ background: grade.accent }}>{score}점</div>
            </div>
            {/* 점수 본문 */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: grade.accentBg }}>
                <GradeIcon size={22} style={{ color: grade.accent }} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[20px] font-extrabold tracking-[-0.05em] leading-none mb-1.5"
                  style={{ color: '#1e2340' }}>
                  {grade.label} · {categoryLabel}
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(111,99,255,0.08)' }}>
                  <div className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, score)}%`, background: grade.accent }} />
                </div>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
              style={{
                background: 'rgba(255,255,255,0.70)',
                border: '1px solid rgba(111,99,255,0.15)',
                color: '#334155',
                backdropFilter: 'blur(4px)',
              }}>
              <Share2 size={14} aria-hidden="true" /> 공유하기
            </button>
            <Link href="/daily-fortune"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #6f63ff, #5a4ddb)', boxShadow: '0 6px 20px rgba(111,99,255,0.28)' }}>
              <Sparkles size={14} aria-hidden="true" /> 오늘의 운세 보기
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ 안내 문구 ━━━ */}
      <section className="mu-container-reading pt-4 px-4">
        <div className="rounded-[14px] px-4 py-3.5 text-sm leading-7"
          style={{
            background: 'rgba(249,248,255,0.95)',
            borderLeft: '3px solid #6f63ff',
            color: '#6b6c91',
          }}>
          꿈은 미래를 단정하기보다, 현재의 감정 흐름을 비춰주는 상징으로 읽는 편이 더 도움이 됩니다.
          아래에서 핵심 해석과 전통적 의미, 심리적 해석을 함께 살펴보세요.
        </div>
      </section>

      {/* ━━━ 본문 해석 ━━━ */}
      <section className="mu-container-reading pt-4 px-4">
        <div className="bg-white rounded-[20px] overflow-hidden"
          style={{ border: '0.5px solid #e8e5f8', boxShadow: '0 2px 10px rgba(80,71,140,0.05)' }}>

          {/* 핵심 해석 */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: grade.accentBg }}>
              <Star size={15} style={{ color: grade.accent }} aria-hidden="true" />
            </div>
            <h2 className="text-base font-bold" style={{ color: '#1e2340' }}>핵심 해석</h2>
          </div>
          <div className="px-5 py-5">
            <p className="text-base leading-8" style={{ color: '#334155' }}>
              <LinkedText text={dream?.interpretation || preview?.excerpt || ''} />
            </p>
          </div>

          {/* 전통적 의미 */}
          {dream?.traditional_meaning && (
            <>
              <div className="flex items-center gap-3 px-5 py-4 border-t border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#fef9c3' }}>
                  <BookOpen size={15} style={{ color: '#ca8a04' }} aria-hidden="true" />
                </div>
                <h2 className="text-base font-bold" style={{ color: '#1e2340' }}>전통적 의미</h2>
              </div>
              <div className="px-5 py-5">
                <p className="text-base leading-8" style={{ color: '#334155' }}>
                  <LinkedText text={dream?.traditional_meaning ?? ''} />
                </p>
              </div>
            </>
          )}

          {/* 심리적 해석 */}
          {dream?.psychological_meaning && (
            <>
              <div className="flex items-center gap-3 px-5 py-4 border-t border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#ede9fe' }}>
                  <Brain size={15} style={{ color: '#7c3aed' }} aria-hidden="true" />
                </div>
                <h2 className="text-base font-bold" style={{ color: '#1e2340' }}>심리적 해석</h2>
              </div>
              <div className="px-5 py-5">
                <p className="text-base leading-8" style={{ color: '#334155' }}>
                  <LinkedText text={dream?.psychological_meaning ?? ''} />
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ━━━ 구분선 ━━━ */}
      <section className="mu-container-reading pt-6 pb-2 px-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs font-bold text-slate-400 tracking-[0.1em] uppercase px-1">추천 콘텐츠</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
      </section>

      {/* ━━━ 관련 꿈해몽 ━━━ */}
      {relatedDreams.length > 0 && (
        <section className="mu-container-reading pt-4 px-4">
          <div className="bg-white rounded-[20px] overflow-hidden"
            style={{ border: '0.5px solid #e8e5f8', boxShadow: '0 2px 10px rgba(80,71,140,0.05)' }}>
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#eef2ff' }}>
                  <MoonStar size={15} className="text-indigo-600" aria-hidden="true" />
                </div>
                <h2 className="text-base font-bold" style={{ color: '#1e2340' }}>비슷한 분위기의 꿈 풀이</h2>
              </div>
              <Link href="/dream"
                className="text-sm font-bold flex items-center gap-1 transition-opacity hover:opacity-80"
                style={{ color: '#5a4ddb' }}>
                전체보기 <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {relatedDreams.map((item) => (
                <Link key={item.slug} href={`/dream/${item.slug}`}>
                  <div className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: '#eef2ff' }}>
                      <MoonStar size={16} className="text-indigo-500" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold ${
                          item.grade === 'great' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          item.grade === 'bad' ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' :
                          'bg-sky-50 text-sky-700 border-sky-200'
                        }`}>
                          {item.grade === 'great' ? '길몽' : item.grade === 'bad' ? '흉몽' : '평몽'}
                        </span>
                        <span className="text-xs text-slate-400">{item.categoryLabel}</span>
                      </div>
                      <p className="text-sm font-bold leading-snug mb-1" style={{ color: '#1e2340' }}>
                        {item.keyword} 꿈해몽
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.excerpt}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 flex-shrink-0 mt-1" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━ 키워드 검색 칩 ━━━ */}
      <section className="mu-container-reading pt-4 px-4">
        <div className="bg-white rounded-[20px] overflow-hidden"
          style={{ border: '0.5px solid #e8e5f8', boxShadow: '0 2px 10px rgba(80,71,140,0.05)' }}>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#eef2ff' }}>
              <Search size={15} className="text-indigo-600" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold" style={{ color: '#1e2340' }}>자주 찾는 꿈해몽</h3>
          </div>
          <div className="px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {DREAM_KEYWORD_CHIPS.map((kw) => (
                <Link key={kw} href={`/dream?q=${encodeURIComponent(kw.replace('꿈', ''))}`}>
                  <span className="inline-flex items-center text-sm px-3 py-1.5 rounded-full font-medium cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ background: '#eef2ff', color: '#4338ca', border: '0.5px solid rgba(99,102,241,0.25)' }}>
                    {kw}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 함께 보면 좋은 서비스 ━━━ */}
      <section className="mu-container-reading pt-4 px-4">
        <div className="bg-white rounded-[20px] overflow-hidden"
          style={{ border: '0.5px solid #e8e5f8', boxShadow: '0 2px 10px rgba(80,71,140,0.05)' }}>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6B5FFF, #5648db)' }}>
              <Sparkles size={15} className="text-white" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold" style={{ color: '#1e2340' }}>함께 보면 좋은 서비스</h3>
          </div>
          <div className="px-5 py-2.5 flex items-center gap-2 border-b border-slate-100">
            <span className="text-xs font-medium px-2 py-1 rounded-md"
              style={{ background: '#f5f3ff', color: '#5b21b6', border: '0.5px solid rgba(124,58,237,0.25)' }}>무료</span>
            <span className="text-xs font-medium px-2 py-1 rounded-md"
              style={{ background: '#f0fdf4', color: '#0f6e56', border: '0.5px solid #5DCAA5' }}>회원가입 없이</span>
            <span className="text-sm text-slate-500">바로 확인할 수 있어요</span>
          </div>
          <div className="divide-y divide-slate-100">
            {RELATED_SERVICES.map((svc) => (
              <Link key={svc.href} href={svc.href}>
                <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                    {svc.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold" style={{ color: '#1e2340' }}>{svc.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{svc.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 flex-shrink-0" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 꿈 관련 칼럼 ━━━ */}
      <section className="mu-container-reading pt-4 px-4">
        <div className="bg-white rounded-[20px] overflow-hidden"
          style={{ border: '0.5px solid #e8e5f8', boxShadow: '0 2px 10px rgba(80,71,140,0.05)' }}>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-50">
              <BookOpen size={15} className="text-emerald-600" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold" style={{ color: '#1e2340' }}>이런 칼럼은 어떠세요?</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {DREAM_COLUMNS.map((col) => (
              <Link key={col.href} href={col.href}>
                <div className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: col.thumbBg }}>
                    {col.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold mb-1" style={{ color: '#5a4ddb' }}>{col.category}</p>
                    <p className="text-sm font-bold leading-snug mb-1" style={{ color: '#1e2340' }}>{col.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{col.summary}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 flex-shrink-0 mt-1" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CTA 배너 ━━━ */}
      <section className="mu-container-reading pt-4 pb-4 px-4">
        <div className="relative overflow-hidden rounded-[24px] p-6"
          style={{
            background: 'linear-gradient(145deg, #17114c 0%, #2d1f8a 50%, #5d49cb 100%)',
            boxShadow: '0 20px 48px rgba(15,23,42,0.22)',
          }}>
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
          <div className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }} />

          <p className="text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
            오늘의 운세
          </p>
          <h3 className="text-[22px] font-extrabold leading-[1.25] tracking-[-0.04em] text-white mb-5">
            꿈의 기운, 오늘 운세로<br />확인해보세요
          </h3>

          <Link href="/daily-fortune"
            onClick={() => trackCustomEvent('click_cta_to_fortune', {
              source_page: `dream/${slug}`,
              cta_location: 'content_bottom',
              target_path: '/daily-fortune',
              variant: 'dream_detail',
            })}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#ffffff', color: '#17114c', boxShadow: '0 8px 24px rgba(15,23,42,0.25)' }}>
            무료로 바로 확인하기
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <p className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,0.38)' }}>
            회원가입 없음 · 저장 없음
          </p>
        </div>
      </section>
    </div>
  );
}
