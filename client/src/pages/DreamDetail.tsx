import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'wouter';
import { Share2, Loader2, Trophy, CheckCircle2, AlertCircle, ArrowUpRight, MoonStar } from 'lucide-react';
import NotFound from '@/pages/NotFound';
import { useCanonical } from '@/lib/use-canonical';
import { getDreamBySlug, type DreamData } from '@/lib/dream-data-api';
import CallToAction from '@/components/CallToAction';
import RelatedServices from '@/components/RelatedServices';
import { LinkedText } from '@/hooks/useLinkedText';
import { DREAM_INDEX } from '@/generated/content-snapshots';

type DreamGrade = 'great' | 'good' | 'bad';

const gradeConfig: Record<DreamGrade, { label: string; Icon: typeof Trophy; chip: string; description: string; panel: string }> = {
  great: {
    label: '길몽',
    Icon: Trophy,
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    description: '재물, 성취, 경사와 연결되는 경우가 많은 좋은 상징입니다.',
    panel: 'from-amber-100 via-white to-amber-50',
  },
  good: {
    label: '평몽',
    Icon: CheckCircle2,
    chip: 'bg-sky-50 text-sky-700 border-sky-200',
    description: '일상의 흐름과 심리 상태를 부드럽게 반영하는 중립적 꿈으로 볼 수 있습니다.',
    panel: 'from-sky-100 via-white to-sky-50',
  },
  bad: {
    label: '흉몽',
    Icon: AlertCircle,
    chip: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    description: '주의가 필요한 시기, 혹은 감정적 긴장을 상징할 수 있습니다.',
    panel: 'from-fuchsia-100 via-white to-fuchsia-50',
  },
};

export default function DreamDetail() {
  const { slug } = useParams<{ slug: string }>();
  const preview = DREAM_INDEX.find((item) => item.slug === slug);
  const [dream, setDream] = useState<DreamData | null | undefined>(undefined);
  useCanonical(`/dream/${slug}`);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!slug) {
        setDream(null);
        return;
      }
      const result = await getDreamBySlug(slug);
      if (active) setDream(result);
    };
    load();
    return () => {
      active = false;
    };
  }, [slug]);

  const gradeKey = (dream?.grade || preview?.grade || 'good') as DreamGrade;
  const grade = gradeConfig[gradeKey] || gradeConfig.good;
  const GradeIcon = grade.Icon;
  const metaTitle = dream?.meta_title || preview?.metaTitle || `${preview?.keyword || slug} 꿈해몽 | 무운`;
  const metaDescription = dream?.meta_description || preview?.metaDescription || preview?.excerpt || '꿈의 의미와 해석을 알아보세요.';
  const canonicalUrl = `https://muunsaju.com/dream/${slug}`;
  const categoryLabel = dream ? dream.category : preview?.categoryLabel || '기타';
  const publishedDate = preview?.publishedDate || '';
  const score = dream?.score || preview?.score || 70;

  const relatedDreams = useMemo(() => {
    const category = dream?.category || preview?.category;
    return DREAM_INDEX.filter((item) => item.slug !== slug && (!category || item.category === category)).slice(0, 3);
  }, [dream?.category, preview?.category, slug]);

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

  if (dream === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center mu-page-bg">
        <Loader2 className="h-8 w-8 animate-spin text-[#5648db]" />
      </div>
    );
  }

  if (!dream) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen mu-page-bg pb-16">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${dream.keyword}, ${dream.keyword} 꿈, ${dream.keyword} 꿈해몽, 꿈해몽, 꿈풀이, 무운`} />
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
                <Link href="/dream" className="mu-chip">꿈해몽</Link>
                <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold ${grade.chip}`}>
                  <GradeIcon size={13} aria-hidden="true" />
                  {grade.label}
                </span>
              </div>

              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#6B5FFF]/10 px-3 py-1.5 text-xs font-bold text-[#5648db]">
                <MoonStar size={13} aria-hidden="true" /> Dream interpretation
              </span>
              <h1 className="mt-4 text-[32px] font-extrabold leading-[1.12] tracking-[-0.06em] text-slate-900">{dream.keyword} 꿈해몽</h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">{metaDescription}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={handleShare} className="inline-flex min-h-[46px] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm">
                  <Share2 size={16} aria-hidden="true" /> 링크 공유하기
                </button>
                <Link href="/daily-fortune" className="inline-flex min-h-[46px] items-center justify-center rounded-2xl bg-[#6B5FFF] px-4 text-sm font-bold text-white shadow-[0_16px_30px_rgba(107,95,255,0.26)]">
                  오늘의 운세 보기
                </Link>
              </div>
            </div>

            <div className={`bg-gradient-to-br ${grade.panel} p-6 sm:p-7`}>
              <div className="rounded-[28px] bg-[linear-gradient(145deg,#17114c_0%,#30208d_58%,#5f4bcb_100%)] p-5 text-white shadow-[0_24px_44px_rgba(15,23,42,0.18)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">꿈 판단 힌트</div>
                  <div className="rounded-full bg-white/14 px-3 py-1 text-xs font-bold text-white">점수 {score}</div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14">
                    <GradeIcon size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-[22px] font-extrabold tracking-[-0.05em] text-white">{grade.label}</div>
                    <div className="text-sm text-white/70">카테고리 · {categoryLabel}</div>
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/12">
                  <div className="h-2 rounded-full bg-[#FFF1B8]" style={{ width: `${Math.min(100, score)}%` }} />
                </div>
                <p className="mt-4 text-sm leading-7 text-white/80">{grade.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mu-container-reading py-6">
        <div className="grid gap-4">
          <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5 text-sm leading-7 text-slate-600 shadow-[0_16px_34px_rgba(15,23,42,0.05)]">
            꿈은 미래를 단정하기보다, 현재의 관심사와 감정 흐름을 비춰주는 상징으로 읽는 편이 더 도움이 됩니다. 아래에서 핵심 해석과 전통적 의미, 심리적 해석을 함께 살펴보세요.
          </div>

          <article className="mu-reading-surface p-6 sm:p-8 lg:p-10">
            <div className="mu-reading-prose">
              <h2>핵심 해석</h2>
              <p><LinkedText text={dream.interpretation} /></p>

              {dream.traditional_meaning && (
                <>
                  <h2>전통적 의미</h2>
                  <p><LinkedText text={dream.traditional_meaning} /></p>
                </>
              )}

              {dream.psychological_meaning && (
                <>
                  <h2>심리적 해석</h2>
                  <p><LinkedText text={dream.psychological_meaning} /></p>
                </>
              )}
            </div>
          </article>
        </div>
      </section>

      {relatedDreams.length > 0 && (
        <section className="mu-container-reading pb-2">
          <div className="mu-glass-panel p-5 sm:p-6">
            <span className="mu-divider-text">Related dreams</span>
            <h2 className="mt-3 text-[24px] font-extrabold tracking-[-0.05em] text-slate-900">비슷한 분위기의 꿈해몽</h2>
            <div className="mt-5 mu-auto-grid-220">
              {relatedDreams.map((item) => (
                <Link key={item.slug} href={`/dream/${item.slug}`} className="mu-link-card p-4">
                  <div className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">{item.categoryLabel}</div>
                  <h3 className="mt-3 line-clamp-2 text-[18px] font-extrabold tracking-[-0.04em] text-slate-900">{item.keyword} 꿈해몽</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{item.excerpt}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#5648db]">자세히 보기 <ArrowUpRight size={14} /></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mu-container-reading">
        <CallToAction variant="daily" />
        <RelatedServices
          title="꿈해몽과 함께 보면 좋은 서비스"
          services={[
            { href: '/daily-fortune', label: '오늘의 운세', description: '오늘 하루의 흐름을 빠르게 확인할 수 있습니다.', emoji: '☀️' },
            { href: '/lifelong-saju', label: '평생사주', description: '타고난 기질과 운의 큰 흐름을 함께 보면 해석 폭이 넓어집니다.', emoji: '🔮' },
            { href: '/fortune-dictionary', label: '운세 사전', description: '꿈풀이에서 자주 보이는 상징과 용어를 정리해 보세요.', emoji: '📚' },
            { href: '/guide', label: '운세 칼럼', description: '사주와 상징 해석에 관한 읽을거리를 더 깊게 살펴볼 수 있습니다.', emoji: '📝' },
          ]}
        />
      </section>
    </div>
  );
}
