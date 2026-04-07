import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, Share2, Loader2, ArrowUpRight, Hash } from 'lucide-react';
import NotFound from '@/pages/NotFound';
import { fetchDictionaryEntryBySlug, type DictionaryEntry } from '@/lib/fortune-dictionary';
import { RelatedTermsSection } from '@/components/RelatedTermsSection';
import { LinkedText } from '@/hooks/useLinkedText';
import { DICTIONARY_INDEX } from '@/generated/content-snapshots';
import CallToAction from '@/components/CallToAction';
import RelatedServices from '@/components/RelatedServices';
import { useCanonical } from '@/lib/use-canonical';

export default function DictionaryDetail() {
  const { id } = useParams<{ id: string }>();
  const preview = DICTIONARY_INDEX.find((item) => item.slug === id || item.id === id);
  const [entry, setEntry] = useState<DictionaryEntry | null | undefined>(
    preview
      ? {
          ...preview,
          subtitle: preview.subtitle,
          metaTitle: preview.metaTitle,
          metaDescription: preview.metaDescription,
        }
      : undefined,
  );
  useCanonical(`/dictionary/${id}`);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!id) {
        setEntry(null);
        return;
      }
      const fetched = await fetchDictionaryEntryBySlug(id);
      if (active) {
        setEntry(
          fetched ||
            (preview
              ? {
                  ...preview,
                  subtitle: preview.subtitle,
                  metaTitle: preview.metaTitle,
                  metaDescription: preview.metaDescription,
                }
              : null),
        );
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id, preview]);

  const canonicalUrl = `https://muunsaju.com/dictionary/${id}`;
  const metaTitle = entry?.metaTitle || `${entry?.title || preview?.title || '운세 용어'} | 무운 운세 사전`;
  const metaDescription = entry?.metaDescription || entry?.summary || preview?.summary || '사주 용어의 의미를 확인해 보세요.';

  const relatedEntries = useMemo(() => {
    const category = entry?.category || preview?.category;
    return DICTIONARY_INDEX.filter((item) => item.slug !== id && (!category || item.category === category)).slice(0, 3);
  }, [entry?.category, preview?.category, id]);

  const handleShare = async () => {
    if (!entry) return;
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

  if (entry === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center mu-page-bg">
        <Loader2 className="h-8 w-8 animate-spin text-[#5648db]" />
      </div>
    );
  }

  if (!entry) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen mu-page-bg pb-16">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta name="keywords" content={`${entry.title}, ${entry.summary}, ${entry.categoryLabel}, 사주, 운세, ${(entry.tags || []).join(', ')}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'DefinedTerm',
            name: entry.title,
            description: entry.summary,
            inDefinedTermSet: 'https://muunsaju.com/fortune-dictionary',
            url: canonicalUrl,
          })}
        </script>
      </Helmet>

      <section className="mu-container-reading pt-6">
        <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_24px_54px_rgba(15,23,42,0.08)]">
          <div className="grid gap-0 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            <div className="p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/fortune-dictionary" className="mu-chip">
                  <ChevronLeft size={14} aria-hidden="true" /> 운세 사전
                </Link>
                <Link href={`/fortune-dictionary?category=${entry.category}`} className="mu-chip">{entry.categoryLabel}</Link>
              </div>

              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#6B5FFF]/10 px-3 py-1.5 text-xs font-bold text-[#5648db]">
                <Hash size={13} aria-hidden="true" /> Fortune glossary
              </span>
              <h1 className="mt-4 text-[32px] font-extrabold leading-[1.12] tracking-[-0.06em] text-slate-900">{entry.title}</h1>
              {entry.subtitle && <p className="mt-2 text-base font-semibold text-slate-400">{entry.subtitle}</p>}
              <p className="mt-4 text-sm leading-7 text-slate-600">{entry.summary}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={handleShare} className="inline-flex min-h-[46px] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm">
                  <Share2 size={16} aria-hidden="true" /> 링크 공유하기
                </button>
                <Link href="/lifelong-saju" className="inline-flex min-h-[46px] items-center justify-center rounded-2xl bg-[#6B5FFF] px-4 text-sm font-bold text-white shadow-[0_16px_30px_rgba(107,95,255,0.26)]">
                  결과 서비스 보기
                </Link>
              </div>
            </div>

            <div className="bg-[linear-gradient(145deg,#17114c_0%,#30208d_58%,#5f4bcb_100%)] p-6 sm:p-7 text-white">
              <div className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">이 항목이 도움이 되는 경우</div>
                <div className="mt-4 text-[22px] font-extrabold tracking-[-0.05em] text-white">결과 화면에서 처음 보는 용어가 나왔을 때</div>
                <p className="mt-3 text-sm leading-7 text-white/80">칼럼에서 개념을 더 정확히 이해하고 싶거나, 결과 페이지에서 의미를 바로 확인하고 싶을 때 참고하면 좋습니다.</p>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full bg-white/14 px-3 py-1 text-xs font-semibold text-white">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mu-container-reading py-6">
        <article className="mu-reading-surface p-6 sm:p-8 lg:p-10">
          <div className="grid gap-4">
            <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-slate-900">핵심 요약</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600"><LinkedText text={entry.summary} excludeSlug={entry.slug} /></p>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5">
              <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-slate-900">원뜻과 기본 개념</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600"><LinkedText text={entry.originalMeaning} excludeSlug={entry.slug} /></p>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5">
              <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-slate-900">현대적 해석</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600"><LinkedText text={entry.modernInterpretation} excludeSlug={entry.slug} /></p>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5">
              <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-slate-900">무운의 조언</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600"><LinkedText text={entry.muunAdvice} excludeSlug={entry.slug} /></p>
            </section>
          </div>

          {entry.tags && entry.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#6B5FFF]/8 px-3 py-1.5 text-xs font-semibold text-[#5648db]">#{tag}</span>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="mu-container-reading pb-2">
        <RelatedTermsSection currentTermId={entry.id} currentTags={entry.tags} maxItems={5} />

        {relatedEntries.length > 0 && (
          <div className="mu-glass-panel p-5 sm:p-6">
            <span className="mu-divider-text">Same category</span>
            <h2 className="mt-3 text-[24px] font-extrabold tracking-[-0.05em] text-slate-900">같은 흐름의 용어 더 보기</h2>
            <div className="mt-5 mu-auto-grid-220">
              {relatedEntries.map((item) => (
                <Link key={item.slug} href={`/dictionary/${item.slug}`} className="mu-link-card p-4">
                  <div className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">{item.categoryLabel}</div>
                  <h3 className="mt-3 line-clamp-2 text-[18px] font-extrabold tracking-[-0.04em] text-slate-900">{item.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{item.summary}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#5648db]">자세히 보기 <ArrowUpRight size={14} /></div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mu-container-reading">
        <CallToAction variant="lifelong" />
        <RelatedServices
          title="이 용어와 함께 보면 좋은 서비스"
          services={[
            { href: '/lifelong-saju', label: '평생사주', description: '결과 화면에서 이 용어가 실제로 어떻게 나타나는지 확인할 수 있습니다.', emoji: '🔮' },
            { href: '/guide', label: '운세 칼럼', description: '용어가 실제 고민과 어떻게 연결되는지 칼럼으로 이어서 읽어보세요.', emoji: '📝' },
            { href: '/compatibility', label: '궁합', description: '관계 운이나 궁합 분석 화면에서 개념을 더 쉽게 체감할 수 있습니다.', emoji: '💞' },
            { href: '/dream', label: '꿈해몽', description: '상징과 해석을 확장해서 보고 싶다면 꿈해몽 아카이브도 함께 살펴보세요.', emoji: '🌙' },
          ]}
        />
      </section>
    </div>
  );
}
