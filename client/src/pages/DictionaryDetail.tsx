import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, Share2, Loader2, ArrowUpRight, BookOpen, Lightbulb, Star, AlignLeft } from 'lucide-react';
import NotFound from '@/pages/NotFound';
import { fetchDictionaryEntryBySlug, type DictionaryEntry } from '@/lib/fortune-dictionary';
import { LinkedText } from '@/hooks/useLinkedText';
import { DICTIONARY_INDEX } from '@/generated/content-snapshots';
import CallToAction from '@/components/CallToAction';
import { useCanonical } from '@/lib/use-canonical';

const sections = [
  { key: 'originalMeaning'      as const, step: '원뜻',    title: '기본 개념',       Icon: BookOpen,  cls: 'bg-slate-50 border-slate-200',     iconBg: 'bg-slate-100',      stepColor: 'text-slate-400' },
  { key: 'modernInterpretation' as const, step: '현대 해석', title: '지금 내 삶에서는', Icon: Lightbulb, cls: 'bg-amber-50 border-amber-100',     iconBg: 'bg-amber-100',      stepColor: 'text-amber-500' },
  { key: 'muunAdvice'           as const, step: '무운 조언', title: '이렇게 활용하세요', Icon: Star,      cls: 'bg-green-50 border-green-100',     iconBg: 'bg-green-100',      stepColor: 'text-green-600' },
] as const;

export default function DictionaryDetail() {
  const { id } = useParams<{ id: string }>();
  const preview = DICTIONARY_INDEX.find((item) => item.slug === id || item.id === id);
  const [entry, setEntry] = useState<DictionaryEntry | null | undefined>(
    preview ? { ...preview, subtitle: preview.subtitle, metaTitle: preview.metaTitle, metaDescription: preview.metaDescription } : undefined,
  );
  useCanonical(`/dictionary/${id}`);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!id) { setEntry(null); return; }
      const fetched = await fetchDictionaryEntryBySlug(id);
      if (active) setEntry(fetched || (preview ? { ...preview, subtitle: preview.subtitle, metaTitle: preview.metaTitle, metaDescription: preview.metaDescription } : null));
    };
    load();
    return () => { active = false; };
  }, [id, preview]);

  const canonicalUrl = `https://muunsaju.com/dictionary/${id}`;
  const metaTitle = entry?.metaTitle || `${entry?.title || preview?.title || '운세 용어'} | 무운 운세 사전`;
  const metaDescription = entry?.metaDescription || entry?.summary || preview?.summary || '사주 용어의 의미를 확인해 보세요.';

  // 이전 / 다음 용어 (같은 카테고리 내)
  const { prevEntry, nextEntry } = useMemo(() => {
    const category = entry?.category || preview?.category;
    const sameCategory = DICTIONARY_INDEX.filter((item) => item.category === category);
    const currentIndex = sameCategory.findIndex((item) => item.slug === id || item.id === id);
    return {
      prevEntry: currentIndex > 0 ? sameCategory[currentIndex - 1] : null,
      nextEntry: currentIndex < sameCategory.length - 1 ? sameCategory[currentIndex + 1] : null,
    };
  }, [entry?.category, preview?.category, id]);

  // 관련 용어 — 태그 기반 우선, 부족하면 같은 카테고리 보충
  const relatedEntries = useMemo(() => {
    const category = entry?.category || preview?.category;
    const tags = entry?.tags || preview?.tags || [];
    if (!tags.length) {
      return DICTIONARY_INDEX.filter((item) => item.slug !== id && item.category === category).slice(0, 4);
    }
    const byTag = DICTIONARY_INDEX
      .filter((item) => item.slug !== id)
      .map((item) => ({ item, score: (item.tags || []).filter((t) => tags.includes(t)).length }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item)
      .slice(0, 4);
    if (byTag.length >= 4) return byTag;
    const ids = new Set(byTag.map((i) => i.slug));
    const supplement = DICTIONARY_INDEX.filter((item) => item.slug !== id && !ids.has(item.slug) && item.category === category).slice(0, 4 - byTag.length);
    return [...byTag, ...supplement];
  }, [entry, preview, id]);

  const handleShare = async () => {
    if (!entry) return;
    try {
      if (navigator.share) await navigator.share({ title: metaTitle, text: metaDescription, url: canonicalUrl });
      else { await navigator.clipboard.writeText(canonicalUrl); alert('링크가 복사되었습니다.'); }
    } catch { /* cancelled */ }
  };

  if (entry === undefined) return <div className="flex min-h-screen items-center justify-center mu-page-bg"><Loader2 className="h-8 w-8 animate-spin text-[#5648db]" /></div>;
  if (!entry) return <NotFound />;

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
          {JSON.stringify({ '@context': 'https://schema.org', '@type': 'DefinedTerm', name: entry.title, description: entry.summary, inDefinedTermSet: 'https://muunsaju.com/fortune-dictionary', url: canonicalUrl })}
        </script>
      </Helmet>

      {/* ── Hero 헤더 ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3929a0] via-[#4a3bb5] to-[#6350e0] px-5 pb-6 pt-[calc(var(--safe-area-top,0px)+44px)]">
        <div className="absolute right-[-40px] top-[-40px] h-44 w-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          {/* 브레드크럼 */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Link href="/fortune-dictionary" className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/85 hover:bg-white/18 transition">
              <ChevronLeft size={13} /> 운세 사전
            </Link>
            {/* 카테고리 → 해당 카테고리 필터된 목록으로 */}
            <Link
              href={`/fortune-dictionary?category=${entry.category}`}
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/85 hover:bg-white/18 transition"
            >
              {entry.categoryLabel}
            </Link>
          </div>

          {/* 용어명 */}
          <h1 className="text-[36px] font-extrabold tracking-[-0.07em] text-white leading-[1.05]">{entry.title}</h1>
          {entry.subtitle && <p className="mt-1.5 text-sm font-semibold text-white/55">{entry.subtitle}</p>}

          {/* 핵심 요약 — hero 안에 */}
          <div className="mt-4 rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur-sm">
            <p className="text-[10px] font-extrabold tracking-[.08em] text-white/55 mb-2">한 줄 요약</p>
            <p className="text-sm leading-[1.8] text-white/92">{entry.summary}</p>
          </div>

          {/* 태그 — 클릭 시 사전 검색으로 이동 */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/fortune-dictionary?q=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-white/20 bg-white/12 px-2.5 py-1 text-[11px] font-semibold text-white/85 hover:bg-white/22 transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="mt-4 flex gap-2.5">
            <button onClick={handleShare} className="inline-flex items-center gap-1.5 rounded-2xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold text-white/85 hover:bg-white/18 transition">
              <Share2 size={13} /> 공유
            </button>
            <Link href="/lifelong-saju" className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-4 py-2.5 text-xs font-extrabold text-[#5648db] hover:bg-white/90 transition">
              내 사주 풀이 보기 <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 본문 ── */}
      <section className="mu-container-reading py-4">
        <div className="mu-reading-surface p-5 sm:p-6">
          <div className="flex flex-col gap-3">
            {sections.map((sec) => {
              const Icon = sec.Icon;
              const text = (entry as any)[sec.key] as string | undefined;
              if (!text) return null;
              return (
                <section key={sec.key} className={`rounded-[18px] border ${sec.cls} p-5`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${sec.iconBg}`}>
                      <Icon size={16} className="text-slate-600" aria-hidden="true" />
                    </div>
                    <div>
                      <span className={`block text-[9px] font-extrabold tracking-[.1em] ${sec.stepColor}`}>{sec.step}</span>
                      <h2 className="text-[15px] font-extrabold tracking-[-0.03em] text-slate-900 leading-none">{sec.title}</h2>
                    </div>
                  </div>
                  <p className="mt-3.5 text-sm leading-[1.85] text-slate-700">
                    <LinkedText text={text} excludeSlug={entry.slug} />
                  </p>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 관련 용어 (태그 기반 가로 스크롤) ── */}
      {relatedEntries.length > 0 && (
        <section className="mu-container-reading pb-2">
          <div className="mu-glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-extrabold tracking-[-0.04em] text-slate-900">함께 보면 좋은 용어</h2>
              {/* 이 카테고리 전체 보기 */}
              <Link
                href={`/fortune-dictionary?category=${entry.category}`}
                className="text-xs font-bold text-[#5648db] hover:underline"
              >
                {entry.categoryLabel} 전체 →
              </Link>
            </div>
            {/* 가로 스크롤 카드 */}
            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
              {relatedEntries.map((item) => (
                <Link key={item.slug} href={`/dictionary/${item.slug}`} className="shrink-0 w-48 rounded-2xl border border-slate-200/80 bg-white p-4 hover:border-[#6B5FFF]/25 hover:shadow-sm transition-all">
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">{item.categoryLabel}</span>
                  <p className="mt-2 text-[16px] font-extrabold tracking-[-0.04em] text-slate-900 leading-tight">{item.title}</p>
                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-[1.65] text-slate-500">{item.summary}</p>
                  <p className="mt-2 text-[11px] font-bold text-[#5648db]">자세히 보기 →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 이전 / 다음 용어 네비게이션 ── */}
      {(prevEntry || nextEntry) && (
        <section className="mu-container-reading pb-2">
          <div className="flex gap-2.5">
            {prevEntry ? (
              <Link href={`/dictionary/${prevEntry.slug}`} className="flex-1 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 hover:border-[#6B5FFF]/25 hover:shadow-sm transition-all min-w-0">
                <ChevronLeft size={18} className="text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold tracking-[.06em] text-slate-400">이전 용어</p>
                  <p className="text-[15px] font-extrabold tracking-[-0.04em] text-slate-900 truncate">{prevEntry.title}</p>
                </div>
              </Link>
            ) : <div className="flex-1" />}
            {nextEntry ? (
              <Link href={`/dictionary/${nextEntry.slug}`} className="flex-1 flex items-center justify-end gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 hover:border-[#6B5FFF]/25 hover:shadow-sm transition-all min-w-0 text-right">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold tracking-[.06em] text-slate-400">다음 용어</p>
                  <p className="text-[15px] font-extrabold tracking-[-0.04em] text-slate-900 truncate">{nextEntry.title}</p>
                </div>
                <ChevronRight size={18} className="text-slate-400 shrink-0" />
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </section>
      )}

      {/* ── 하단 CTA ── */}
      <section className="mu-container-reading pb-4">
        <div className="rounded-[24px] bg-gradient-to-br from-[#3929a0] to-[#6B5FFF] p-5 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-extrabold tracking-[.06em] text-white/60 mb-1">무운 서비스</p>
            <p className="text-[16px] font-extrabold tracking-[-0.04em] text-white leading-tight">
              {entry.title}이(가) 내 사주에서<br />어떻게 나타나는지 확인해보세요
            </p>
          </div>
          <Link href="/lifelong-saju" className="shrink-0 rounded-2xl bg-white px-4 py-2.5 text-[13px] font-extrabold text-[#5648db] hover:bg-white/90 transition text-center leading-tight">
            평생사주<br />보기
          </Link>
        </div>
      </section>

      {/* ── 관련 서비스 링크 ── */}
      <section className="mu-container-reading pb-10">
        <div className="mu-glass-panel p-5">
          <h3 className="text-[15px] font-extrabold tracking-[-0.03em] text-slate-900 mb-3">이 용어와 함께 보면 좋은 서비스</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { href: '/lifelong-saju',  emoji: '🔮', label: '평생사주',  desc: '이 용어가 내 사주에 어떻게 나타나는지' },
              { href: '/guide',          emoji: '📝', label: '운세 칼럼', desc: '용어와 연결된 실생활 칼럼 읽기' },
              { href: '/compatibility',  emoji: '💞', label: '궁합',      desc: '관계 운을 명리학으로 분석' },
              { href: '/dream',          emoji: '🌙', label: '꿈해몽',    desc: '상징 해석을 꿈해몽으로 확장' },
            ].map((s) => (
              <Link key={s.href} href={s.href} className="flex flex-col gap-1.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 hover:border-[#6B5FFF]/20 hover:shadow-sm transition-all">
                <span className="text-xl">{s.emoji}</span>
                <span className="text-[13px] font-extrabold tracking-[-0.03em] text-slate-900">{s.label}</span>
                <span className="text-[11px] leading-[1.55] text-slate-500">{s.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
