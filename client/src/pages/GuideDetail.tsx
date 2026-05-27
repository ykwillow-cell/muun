import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'wouter';
import { CalendarDays, Clock3, Share2, Loader2, ChevronLeft, CheckCircle2 } from 'lucide-react';
import NotFound from '@/pages/NotFound';
import { useCanonical } from '@/lib/use-canonical';
import { getColumnBySlug, type ColumnData } from '@/lib/column-data-api';
import { injectLinksIntoHtml } from '@/hooks/useLinkedText';
import { GUIDE_INDEX } from '@/generated/content-snapshots';

function formatDate(value?: string) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

// 칼럼 카테고리별 연결 서비스 (문맥 기반)
const CATEGORY_SERVICES: Record<string, { href: string; emoji: string; label: string; hook: string; desc: string; gradient: string }[]> = {
  default: [
    { href: '/lifelong-saju',      emoji: '🔮', label: '평생사주',    hook: '이 칼럼의 내용이 내 사주에 어떻게 나타날까?',   desc: '생년월일만 입력하면 타고난 기질과 평생 운의 흐름을 바로 확인할 수 있어요.',      gradient: 'from-[#17114c] to-[#5648db]' },
    { href: '/daily-fortune',      emoji: '📅', label: '오늘의 운세',  hook: '오늘 내 운의 흐름은 어떨까?',                 desc: '오늘 하루의 총운, 재물운, 애정운을 생년월일 하나로 바로 확인해보세요.',         gradient: 'from-[#0c4a6e] to-[#0284c7]' },
    { href: '/fortune-dictionary', emoji: '📖', label: '운세 사전',   hook: '방금 읽은 용어가 정확히 어떤 뜻일까?',          desc: '칼럼에 나온 사주 용어를 바로 찾아볼 수 있는 무료 명리학 사전이에요.',          gradient: 'from-[#3b0764] to-[#7c3aed]' },
    { href: '/yearly-fortune',     emoji: '📆', label: '신년운세',    hook: '올해 내 운의 큰 그림이 궁금하다면?',            desc: '2026년 전체 운의 흐름을 한눈에 정리해드려요. 월별로 주의할 시기도 확인 가능.',  gradient: 'from-[#14532d] to-[#16a34a]' },
  ],
  relationship: [
    { href: '/compatibility',      emoji: '💞', label: '궁합',        hook: '우리 궁합이 사주로 보면 어떻게 나올까?',        desc: '두 사람의 사주 오행 궁합, 음양 조화, 인연의 깊이를 분석해드려요.',            gradient: 'from-[#500724] to-[#db2777]' },
    { href: '/lifelong-saju',      emoji: '🔮', label: '평생사주',    hook: '내 관계 운의 바탕이 되는 사주는?',             desc: '나의 인연 운, 결혼 운, 대인관계 운을 타고난 기질에서 확인해보세요.',           gradient: 'from-[#17114c] to-[#5648db]' },
    { href: '/daily-fortune',      emoji: '📅', label: '오늘의 운세',  hook: '오늘 애정운은 어떨까?',                       desc: '오늘의 애정운과 대인관계 운을 생년월일로 바로 확인해보세요.',                  gradient: 'from-[#0c4a6e] to-[#0284c7]' },
    { href: '/fortune-dictionary', emoji: '📖', label: '운세 사전',   hook: '정관, 편관, 식신... 용어가 헷갈린다면?',        desc: '관계와 인연에 관련된 사주 용어를 사전에서 바로 찾아볼 수 있어요.',             gradient: 'from-[#3b0764] to-[#7c3aed]' },
  ],
  money: [
    { href: '/lifelong-saju',      emoji: '🔮', label: '평생사주',    hook: '내 재물 운의 패턴이 궁금하다면?',              desc: '편재, 정재, 식신 배치로 나의 재물 운 흐름을 확인해보세요.',                   gradient: 'from-[#17114c] to-[#5648db]' },
    { href: '/yearly-fortune',     emoji: '📆', label: '신년운세',    hook: '올해 재물 운이 들어오는 시기는?',              desc: '2026년 월별 재물 운의 흐름과 주의할 시기를 확인해보세요.',                   gradient: 'from-[#14532d] to-[#16a34a]' },
    { href: '/daily-fortune',      emoji: '📅', label: '오늘의 운세',  hook: '오늘 재물운은 어떨까?',                       desc: '오늘의 재물 운을 생년월일 하나로 바로 확인해보세요.',                         gradient: 'from-[#0c4a6e] to-[#0284c7]' },
    { href: '/fortune-dictionary', emoji: '📖', label: '운세 사전',   hook: '편재, 정재, 겁재... 뭐가 다른 걸까?',          desc: '재물 운과 관련된 사주 용어를 사전에서 바로 확인해보세요.',                     gradient: 'from-[#3b0764] to-[#7c3aed]' },
  ],
  luck: [
    { href: '/daily-fortune',      emoji: '📅', label: '오늘의 운세',  hook: '오늘 개운하기 좋은 날인지 확인해볼까?',        desc: '오늘의 길흉과 주의사항, 행운 아이템을 바로 확인해보세요.',                    gradient: 'from-[#0c4a6e] to-[#0284c7]' },
    { href: '/lifelong-saju',      emoji: '🔮', label: '평생사주',    hook: '나에게 맞는 개운법이 따로 있을까?',            desc: '내 사주의 오행 균형을 보고 어떤 기운을 보완해야 하는지 확인해보세요.',          gradient: 'from-[#17114c] to-[#5648db]' },
    { href: '/yearly-fortune',     emoji: '📆', label: '신년운세',    hook: '올해 개운이 잘 되는 시기는 언제일까?',          desc: '2026년 행운의 시기와 조심해야 할 시기를 월별로 확인해보세요.',                 gradient: 'from-[#14532d] to-[#16a34a]' },
    { href: '/fortune-dictionary', emoji: '📖', label: '운세 사전',   hook: '용신, 기신이 뭔지 궁금하다면?',               desc: '개운법의 핵심 개념인 용신과 기신 등의 용어를 사전에서 확인하세요.',             gradient: 'from-[#3b0764] to-[#7c3aed]' },
  ],
};

function getServices(category?: string) {
  return CATEGORY_SERVICES[category ?? ''] ?? CATEGORY_SERVICES['default'];
}

// 신뢰 배지
const TRUST_BADGES = ['100% 무료', '회원가입 없음', '생년월일만 입력'] as const;

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const preview = GUIDE_INDEX.find((item) => item.slug === id || item.id === id);
  const [column, setColumn] = useState<ColumnData | null | undefined>(undefined);
  useCanonical(`/guide/${id}`);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!id) { setColumn(null); return; }
      const result = await getColumnBySlug(id);
      if (active) setColumn(result);
    };
    load();
    return () => { active = false; };
  }, [id]);

  const metaTitle       = column?.metaTitle       || preview?.title       || '운세 칼럼 | 무운';
  const metaDescription = column?.metaDescription || preview?.description || '무운 운세 칼럼을 읽어보세요.';
  const canonicalUrl    = `https://muunsaju.com/guide/${id}`;
  const publishedDate   = column?.publishedDate   || preview?.publishedDate || '';
  const categoryLabel   = column?.categoryLabel   || preview?.categoryLabel || '운세 칼럼';
  const articleCover    = column?.thumbnail       || preview?.thumbnail    || '';
  const category        = column?.category        || preview?.category;

  const services = getServices(category);

  const relatedColumns = useMemo(() => {
    return GUIDE_INDEX
      .filter((item) => item.slug !== id && (!category || item.category === category))
      .slice(0, 3);
  }, [category, id]);

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: metaTitle, text: metaDescription, url: canonicalUrl });
      else { await navigator.clipboard.writeText(canonicalUrl); alert('링크가 복사되었습니다.'); }
    } catch { /* cancelled */ }
  };

  if (column === undefined) return (
    <div className="flex min-h-screen items-center justify-center mu-page-bg">
      <Loader2 className="h-8 w-8 animate-spin text-[#5648db]" />
    </div>
  );
  if (!column) return <NotFound />;

  const articleHtml = injectLinksIntoHtml(column.content || '');

  return (
    <div className="min-h-screen mu-page-bg pb-16">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${column.title}, ${column.categoryLabel}, 사주칼럼, 운세칼럼, 무운`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={articleCover || 'https://muunsaju.com/images/horse_mascot.png'} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={publishedDate} />
        <meta property="article:section" content={categoryLabel} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org', '@type': 'BlogPosting',
            headline: column.title, description: metaDescription,
            image: [articleCover || 'https://muunsaju.com/images/horse_mascot.png'],
            datePublished: publishedDate, dateModified: publishedDate,
            author: { '@type': 'Organization', name: column.author || '무운 역술팀' },
            publisher: { '@type': 'Organization', name: '무운 (MuUn)', logo: { '@type': 'ImageObject', url: 'https://muunsaju.com/images/muun-mark.svg' } },
            mainEntityOfPage: canonicalUrl,
          })}
        </script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#3929a0] via-[#4a3bb5] to-[#6350e0] px-5 pb-7 pt-[calc(var(--safe-area-top,0px)+44px)]">
        {/* 브레드크럼 */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <Link href="/guide" className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-sm font-bold text-white hover:bg-white/25 transition">
            <ChevronLeft size={14} /> 운세 칼럼
          </Link>
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-bold text-white/85">
            {categoryLabel}
          </span>
        </div>

        {/* 썸네일 */}
        {articleCover && (
          <div className="mb-5 overflow-hidden rounded-2xl aspect-[16/9]">
            <img src={articleCover} alt={column.title} className="h-full w-full object-cover" />
          </div>
        )}

        {/* 제목 */}
        <h1 className="text-[28px] font-extrabold leading-[1.15] tracking-[-0.05em] text-white">
          {column.title}
        </h1>

        {/* 설명 */}
        <p className="mt-3 text-base leading-7 text-white/75">
          {column.description || metaDescription}
        </p>

        {/* 메타 */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-semibold text-white/55">
          <span>{column.author}</span>
          <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> {formatDate(publishedDate)}</span>
          <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> {column.readTime}분 읽기</span>
        </div>

        {/* 공유 */}
        <div className="mt-4">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white/85 hover:bg-white/18 transition"
          >
            <Share2 size={14} /> 글 공유하기
          </button>
        </div>
      </section>

      {/* ── 본문 ── */}
      <section className="mu-container-reading py-5">
        <article className="mu-reading-surface p-6 sm:p-8">
          <div className="mu-reading-prose" dangerouslySetInnerHTML={{ __html: articleHtml }} />
        </article>
      </section>

      {/* ── 완독 후 서비스 CTA — 핵심 섹션 ── */}
      <section className="mu-container-reading pb-4">
        <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1a1260] to-[#3929a0] p-5 sm:p-6">

          {/* 헤드라인 */}
          <div className="text-center mb-5">
            <p className="text-xs font-extrabold tracking-[.1em] text-white/50 mb-2">이 칼럼을 읽으셨다면</p>
            <h2 className="text-[22px] font-extrabold tracking-[-0.05em] text-white leading-tight">
              지금 바로 내 사주에<br/>직접 적용해보세요
            </h2>
            {/* 신뢰 배지 */}
            <div className="flex justify-center flex-wrap gap-2 mt-3">
              {TRUST_BADGES.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-bold text-white/85">
                  <CheckCircle2 size={13} className="text-emerald-400" /> {badge}
                </span>
              ))}
            </div>
          </div>

          {/* 서비스 카드 2×2 그리드 */}
          <div className="grid grid-cols-2 gap-3">
            {services.map((svc) => (
              <Link
                key={svc.href}
                href={svc.href}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white/8 border border-white/12 hover:bg-white/14 hover:border-white/22 transition-all"
              >
                {/* 카드 상단 그라디언트 띠 */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${svc.gradient}`} />
                <div className="flex flex-col flex-1 p-3.5 gap-2">
                  <span className="text-2xl leading-none">{svc.emoji}</span>
                  <p className="text-xs font-extrabold text-white/60 leading-tight">{svc.hook}</p>
                  <p className="text-base font-extrabold text-white tracking-[-0.03em] leading-tight">{svc.label}</p>
                  <p className="text-xs leading-[1.6] text-white/60 flex-1">{svc.desc}</p>
                  <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold text-white mt-1 self-start group-hover:bg-white/25 transition">
                    무료로 확인 →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 하단 안내 */}
          <p className="mt-4 text-center text-xs text-white/40 leading-relaxed">
            모든 서비스는 100% 무료이며, 회원가입 없이<br/>생년월일만으로 바로 이용할 수 있습니다.
          </p>
        </div>
      </section>

      {/* ── 같이 읽으면 좋은 칼럼 ── */}
      {relatedColumns.length > 0 && (
        <section className="mu-container-reading pb-4">
          <div className="mu-glass-panel p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-slate-900">같이 읽으면 좋은 칼럼</h2>
              <Link href="/guide" className="text-sm font-bold text-[#5648db] hover:underline">전체 보기 →</Link>
            </div>
            <div className="flex flex-col gap-3">
              {relatedColumns.map((item) => (
                <Link key={item.slug} href={`/guide/${item.slug}`}
                  className="flex overflow-hidden rounded-2xl border border-slate-200/80 bg-white hover:border-[#6B5FFF]/20 hover:shadow-sm transition-all"
                >
                  <div className="w-20 shrink-0 bg-[linear-gradient(135deg,#17114c_0%,#352597_55%,#5f4bcb_100%)]">
                    {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" loading="lazy" />}
                  </div>
                  <div className="flex-1 min-w-0 px-4 py-3">
                    <span className="inline-flex rounded-full bg-[#6B5FFF]/10 px-2.5 py-0.5 text-xs font-bold text-[#5648db]">
                      {item.categoryLabel}
                    </span>
                    <h3 className="mt-1.5 line-clamp-2 text-base font-extrabold tracking-[-0.04em] text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 하단 서비스 링크 (간결하게) ── */}
      <section className="mu-container-reading pb-10">
        <div className="mu-glass-panel p-5">
          <h3 className="text-base font-extrabold tracking-[-0.03em] text-slate-900 mb-3">
            이 칼럼과 함께 보면 좋은 서비스
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { href: '/daily-fortune',      emoji: '📅', label: '오늘의 운세', desc: '오늘 하루의 운 흐름 확인' },
              { href: '/yearly-fortune',     emoji: '📆', label: '신년운세',    desc: '올해 전체 운의 큰 그림' },
              { href: '/dream',              emoji: '🌙', label: '꿈해몽',      desc: '꿈 속 상징 사주 풀이' },
              { href: '/fortune-dictionary', emoji: '📖', label: '운세 사전',   desc: '사주 용어 바로 찾기' },
            ].map((s) => (
              <Link key={s.href} href={s.href}
                className="flex flex-col gap-1.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 hover:border-[#6B5FFF]/20 hover:shadow-sm transition-all"
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="text-sm font-extrabold tracking-[-0.03em] text-slate-900">{s.label}</span>
                <span className="text-xs leading-[1.5] text-slate-500">{s.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
