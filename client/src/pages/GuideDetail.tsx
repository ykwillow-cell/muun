import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'wouter';
import { CalendarDays, Clock3, Share2, Loader2, ArrowUpRight, BookOpenText } from 'lucide-react';
import NotFound from '@/pages/NotFound';
import { useCanonical } from '@/lib/use-canonical';
import { getColumnBySlug, type ColumnData } from '@/lib/column-data-api';
import CallToAction from '@/components/CallToAction';
import RelatedServices from '@/components/RelatedServices';
import { injectLinksIntoHtml } from '@/hooks/useLinkedText';
import { GUIDE_INDEX } from '@/generated/content-snapshots';

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const preview = GUIDE_INDEX.find((item) => item.slug === id || item.id === id);
  const [column, setColumn] = useState<ColumnData | null | undefined>(undefined);
  useCanonical(`/guide/${id}`);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!id) {
        setColumn(null);
        return;
      }
      const result = await getColumnBySlug(id);
      if (active) setColumn(result);
    };
    load();
    return () => {
      active = false;
    };
  }, [id]);

  const metaTitle = column?.metaTitle || preview?.title || '운세 칼럼 | 무운';
  const metaDescription = column?.metaDescription || preview?.description || '무운 운세 칼럼을 읽어보세요.';
  const canonicalUrl = `https://muunsaju.com/guide/${id}`;
  const publishedDate = column?.publishedDate || preview?.publishedDate || '';
  const categoryLabel = column?.categoryLabel || preview?.categoryLabel || '운세 칼럼';
  const articleCover = column?.thumbnail || preview?.thumbnail || '';

  const relatedColumns = useMemo(() => {
    const category = column?.category || preview?.category;
    return GUIDE_INDEX.filter((item) => item.slug !== id && (!category || item.category === category)).slice(0, 3);
  }, [column?.category, preview?.category, id]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: metaTitle, text: metaDescription, url: canonicalUrl });
      } else {
        await navigator.clipboard.writeText(canonicalUrl);
        alert('링크가 복사되었습니다.');
      }
    } catch {
      // user cancelled
    }
  };

  if (column === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center mu-page-bg">
        <Loader2 className="h-8 w-8 animate-spin text-[#5648db]" />
      </div>
    );
  }

  if (!column) {
    return <NotFound />;
  }

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
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: column.title,
            description: metaDescription,
            image: [articleCover || 'https://muunsaju.com/images/horse_mascot.png'],
            datePublished: publishedDate,
            dateModified: publishedDate,
            author: { '@type': 'Organization', name: column.author || '무운 역술팀' },
            publisher: {
              '@type': 'Organization',
              name: '무운 (MuUn)',
              logo: { '@type': 'ImageObject', url: 'https://muunsaju.com/images/muun-mark.svg' },
            },
            mainEntityOfPage: canonicalUrl,
          })}
        </script>
      </Helmet>

      <section className="mu-container-reading pt-6">
        <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_24px_54px_rgba(15,23,42,0.08)]">
          <div className="grid gap-0 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            <div className="p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/guide" className="mu-chip">운세 칼럼</Link>
                <span className="mu-chip">{categoryLabel}</span>
              </div>

              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#6B5FFF]/10 px-3 py-1.5 text-xs font-bold text-[#5648db]">
                <BookOpenText size={13} aria-hidden="true" /> Editorial story
              </span>

              <h1 className="mt-4 text-[32px] font-extrabold leading-[1.12] tracking-[-0.06em] text-slate-900">{column.title}</h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">{column.description || metaDescription}</p>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-500">
                <span>{column.author}</span>
                <span className="inline-flex items-center gap-1"><CalendarDays size={15} /> {formatDate(publishedDate)}</span>
                <span className="inline-flex items-center gap-1"><Clock3 size={15} /> {column.readTime}분</span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={handleShare} className="inline-flex min-h-[46px] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm">
                  <Share2 size={16} aria-hidden="true" /> 글 공유하기
                </button>
                <Link href="/lifelong-saju" className="inline-flex min-h-[46px] items-center justify-center rounded-2xl bg-[#6B5FFF] px-4 text-sm font-bold text-white shadow-[0_16px_30px_rgba(107,95,255,0.26)]">
                  평생사주 보기
                </Link>
              </div>
            </div>

            <div className="relative min-h-[260px] bg-[linear-gradient(135deg,#17114c_0%,#352597_55%,#5f4bcb_100%)]">
              {articleCover ? (
                <img src={articleCover} alt={column.title} className="h-full w-full object-cover" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-slate-950/5 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-[24px] border border-white/18 bg-white/10 p-4 text-white backdrop-blur">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">칼럼 한눈에 보기</div>
                <div className="mt-2 text-[22px] font-extrabold tracking-[-0.05em] text-white">{categoryLabel}</div>
                <p className="mt-2 text-sm leading-6 text-white/80">사주 기초 개념과 실제 생활 고민을 연결하는 무운의 editorial 시리즈입니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mu-container-reading py-6">
        <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-4 text-sm leading-7 text-slate-600 shadow-[0_16px_34px_rgba(15,23,42,0.05)]">
          이 글은 결과 페이지에서 바로 이해하기 어려운 사주 개념을 더 쉽게 읽을 수 있도록 정리한 칼럼입니다. 본문에서 본 용어가 낯설다면 함께 제공되는 운세 사전 링크도 같이 확인해 보세요.
        </div>
        <article className="mt-4 mu-reading-surface p-6 sm:p-8 lg:p-10">
          <div className="mu-reading-prose" dangerouslySetInnerHTML={{ __html: articleHtml }} />
        </article>
      </section>

      {relatedColumns.length > 0 && (
        <section className="mu-container-reading pb-2">
          <div className="mu-glass-panel p-5 sm:p-6">
            <span className="mu-divider-text">Related editorial</span>
            <h2 className="mt-3 text-[24px] font-extrabold tracking-[-0.05em] text-slate-900">같이 읽으면 좋은 칼럼</h2>
            <div className="mt-5 mu-auto-grid-220">
              {relatedColumns.map((item) => (
                <Link key={item.slug} href={`/guide/${item.slug}`} className="mu-link-card overflow-hidden p-0">
                  {item.thumbnail ? <img src={item.thumbnail} alt={item.title} className="aspect-[16/10] w-full object-cover" loading="lazy" /> : <div className="aspect-[16/10] bg-[linear-gradient(135deg,#17114c_0%,#352597_55%,#5f4bcb_100%)]" />}
                  <div className="p-4">
                    <div className="inline-flex rounded-full bg-[#6B5FFF]/10 px-2.5 py-1 text-[11px] font-bold text-[#5648db]">{item.categoryLabel}</div>
                    <h3 className="mt-3 line-clamp-2 text-[18px] font-extrabold tracking-[-0.04em] text-slate-900">{item.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{item.description}</p>
                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#5648db]">이어서 읽기 <ArrowUpRight size={14} /></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mu-container-reading">
        <CallToAction variant="lifelong" />
        <RelatedServices
          title="이 칼럼과 함께 보면 좋은 서비스"
          services={[
            { href: '/lifelong-saju', label: '평생사주', description: '타고난 기질과 전체 운의 흐름을 이어서 확인해 보세요.', emoji: '🔮' },
            { href: '/fortune-dictionary', label: '운세 사전', description: '칼럼에서 본 용어를 바로 찾아 의미를 정리할 수 있습니다.', emoji: '📚' },
            { href: '/compatibility', label: '궁합', description: '관계·궁합 주제를 실제 결과 페이지에서 확인해 보세요.', emoji: '💞' },
            { href: '/dream', label: '꿈해몽', description: '상징 해석이 궁금할 때 꿈 키워드 아카이브로 이동하세요.', emoji: '🌙' },
          ]}
        />
      </section>
    </div>
  );
}
