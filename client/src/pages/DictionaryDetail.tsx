import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, Share2, Loader2, BookOpen, Lightbulb, Star, Sparkles, ArrowRight } from 'lucide-react';
import NotFound from '@/pages/NotFound';
import { fetchDictionaryEntryBySlug, type DictionaryEntry } from '@/lib/fortune-dictionary';
import { LinkedText } from '@/hooks/useLinkedText';
import { DICTIONARY_INDEX } from '@/generated/content-snapshots';
import { useCanonical } from '@/lib/use-canonical';

const categoryStyle: Record<string, { side: string; bg: string; text: string; lightBg: string }> = {
  'basic':       { side: '#a78bfa', bg: 'bg-violet-100',  text: 'text-violet-700',  lightBg: '#f5f3ff' },
  'stem':        { side: '#6ee7b7', bg: 'bg-emerald-100', text: 'text-emerald-700', lightBg: '#ecfdf5' },
  'branch':      { side: '#93c5fd', bg: 'bg-blue-100',    text: 'text-blue-700',    lightBg: '#eff6ff' },
  'ten-stem':    { side: '#818cf8', bg: 'bg-indigo-100',  text: 'text-indigo-700',  lightBg: '#eef2ff' },
  'sipsin':      { side: '#818cf8', bg: 'bg-indigo-100',  text: 'text-indigo-700',  lightBg: '#eef2ff' },
  'evil-spirit': { side: '#fda4af', bg: 'bg-rose-100',    text: 'text-rose-700',    lightBg: '#fff1f2' },
  'luck-flow':   { side: '#67e8f9', bg: 'bg-cyan-100',    text: 'text-cyan-700',    lightBg: '#ecfeff' },
  'relation':    { side: '#f9a8d4', bg: 'bg-pink-100',    text: 'text-pink-700',    lightBg: '#fdf2f8' },
  'concept':     { side: '#d8b4fe', bg: 'bg-purple-100',  text: 'text-purple-700',  lightBg: '#faf5ff' },
  'wealth':      { side: '#fcd34d', bg: 'bg-amber-100',   text: 'text-amber-700',   lightBg: '#fffbeb' },
  'health':      { side: '#5eead4', bg: 'bg-teal-100',    text: 'text-teal-700',    lightBg: '#f0fdfa' },
  'other':       { side: '#cbd5e1', bg: 'bg-slate-100',   text: 'text-slate-600',   lightBg: '#f8fafc' },
};

const sections = [
  { key: 'originalMeaning'      as const, label: '기본 개념',       Icon: BookOpen,  iconBg: '#eef2ff', iconColor: '#4338ca', barColor: '#818cf8' },
  { key: 'modernInterpretation' as const, label: '지금 내 삶에서는', Icon: Lightbulb, iconBg: '#fffbeb', iconColor: '#d97706', barColor: '#fcd34d' },
  { key: 'muunAdvice'           as const, label: '이렇게 활용하세요', Icon: Star,      iconBg: '#f0fdf4', iconColor: '#16a34a', barColor: '#4ade80' },
] as const;

const SERVICE_LINKS = [
  { href: '/lifelong-saju', emoji: '🔮', label: '평생사주',  desc: '이 용어가 내 사주에 어떻게 나타나는지' },
  { href: '/guide',         emoji: '📝', label: '운세 칼럼', desc: '용어와 연결된 실생활 칼럼 읽기' },
  { href: '/compatibility', emoji: '💞', label: '궁합',      desc: '관계 운을 명리학으로 분석' },
  { href: '/dream',         emoji: '🌙', label: '꿈해몽',    desc: '상징 해석을 꿈해몽으로 확장' },
  { href: '/tarot',         emoji: '🃏', label: '타로 상담', desc: '카드가 전하는 오늘의 메시지' },
  { href: '/daily-fortune', emoji: '📅', label: '오늘의 운세', desc: '오늘 하루 총운·재물운·애정운' },
];

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

  const { prevEntry, nextEntry } = useMemo(() => {
    const category = entry?.category || preview?.category;
    const sameCategory = DICTIONARY_INDEX.filter((item) => item.category === category);
    const currentIndex = sameCategory.findIndex((item) => item.slug === id || item.id === id);
    return {
      prevEntry: currentIndex > 0 ? sameCategory[currentIndex - 1] : null,
      nextEntry: currentIndex < sameCategory.length - 1 ? sameCategory[currentIndex + 1] : null,
    };
  }, [entry?.category, preview?.category, id]);

  const relatedEntries = useMemo(() => {
    const category = entry?.category || preview?.category;
    const tags = entry?.tags || preview?.tags || [];
    if (!tags.length) return DICTIONARY_INDEX.filter((item) => item.slug !== id && item.category === category).slice(0, 4);
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

  const catStyle = categoryStyle[entry?.category ?? 'other'] ?? categoryStyle['other'];

  if (entry === undefined) return <div className="flex min-h-screen items-center justify-center mu-page-bg"><Loader2 className="h-8 w-8 animate-spin text-[#5648db]" /></div>;
  if (!entry) return <NotFound />;

  return (
    <div className="min-h-screen mu-page-bg pb-20">
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

      {/* ── 히어로 ── */}
      <section className="mu-container-reading pt-5">
        <div className="bg-white rounded-[20px] border border-black/[0.06] overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.06)]">

          {/* 상단 */}
          <div className="px-5 pt-5 pb-4">
            {/* 브레드크럼 */}
            <div className="flex items-center gap-2 mb-4">
              <Link href="/fortune-dictionary">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#5648db] transition-colors cursor-pointer">
                  <ChevronLeft size={13} /> 운세 사전
                </span>
              </Link>
              <span className="text-slate-300 text-xs">·</span>
              <Link href={`/fortune-dictionary?category=${entry.category}`}>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold cursor-pointer ${catStyle.bg} ${catStyle.text}`}>
                  {entry.categoryLabel}
                </span>
              </Link>
            </div>

            {/* 제목 */}
            <h1 className="text-[26px] font-bold tracking-[-0.05em] text-slate-900 leading-[1.15] mb-2">
              {entry.title}
            </h1>
            {entry.subtitle && (
              <p className="text-sm text-slate-400 mb-4">{entry.subtitle}</p>
            )}

            {/* 한 줄 요약 */}
            <div className="rounded-xl px-4 py-3 mb-4" style={{ background: catStyle.lightBg }}>
              <p className="text-xs font-bold mb-1" style={{ color: catStyle.side }}>한 줄 요약</p>
              <p className="text-base leading-relaxed text-slate-700">{entry.summary}</p>
            </div>

            {/* 태그 */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {entry.tags.map((tag) => (
                  <Link key={tag} href={`/fortune-dictionary?q=${encodeURIComponent(tag)}`}>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-2">
              <button onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <Share2 size={14} /> 공유하기
              </button>
              <Link href="/lifelong-saju"
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                style={{ background: '#5648db' }}>
                내 사주 풀이 보기
              </Link>
            </div>
          </div>

          {/* 이전/다음 네비 */}
          {(prevEntry || nextEntry) && (
            <div className="flex border-t border-black/[0.05]">
              {prevEntry ? (
                <Link href={`/dictionary/${prevEntry.slug}`} className="flex-1 min-w-0 flex items-center gap-2 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-r border-black/[0.05]">
                  <ChevronLeft size={15} className="text-slate-400 flex-shrink-0" />
                  <div className="min-w-0 overflow-hidden">
                    <p className="text-xs text-slate-400 mb-0.5">이전</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{prevEntry.title.replace(/\(.*?\)/g, '').trim()}</p>
                  </div>
                </Link>
              ) : <div className="flex-1 border-r border-black/[0.05]" />}
              {nextEntry ? (
                <Link href={`/dictionary/${nextEntry.slug}`} className="flex-1 min-w-0 flex items-center justify-end gap-2 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer text-right">
                  <div className="min-w-0 overflow-hidden">
                    <p className="text-xs text-slate-400 mb-0.5">다음</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{nextEntry.title.replace(/\(.*?\)/g, '').trim()}</p>
                  </div>
                  <ChevronRight size={15} className="text-slate-400 flex-shrink-0" />
                </Link>
              ) : <div className="flex-1" />}
            </div>
          )}
        </div>
      </section>

      {/* ── 본문 해석 (하나의 카드) ── */}
      <section className="mu-container-reading pt-3">
        <div className="bg-white rounded-[20px] border border-black/[0.06] overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
          {sections.map((sec, idx) => {
            const Icon = sec.Icon;
            const text = (entry as any)[sec.key] as string | undefined;
            if (!text) return null;
            return (
              <div key={sec.key} className={idx > 0 ? 'border-t border-black/[0.05]' : ''}>
                <div className="flex items-center gap-3 px-5 py-4 border-b border-black/[0.05]">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: sec.iconBg }}>
                    <Icon size={15} style={{ color: sec.iconColor }} aria-hidden="true" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{sec.label}</h2>
                </div>
                <div className="px-5 py-5">
                  <p className="text-base leading-8 text-slate-700">
                    <LinkedText text={text} excludeSlug={entry.slug} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 관련 용어 ── */}
      {relatedEntries.length > 0 && (
        <section className="mu-container-reading pt-3">
          <div className="bg-white rounded-[20px] border border-black/[0.06] overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.05]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: catStyle.lightBg }}>
                  <BookOpen size={15} style={{ color: catStyle.side }} />
                </div>
                <h2 className="text-base font-bold text-slate-900">함께 보면 좋은 용어</h2>
              </div>
              <Link href={`/fortune-dictionary?category=${entry.category}`}
                className="text-sm font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{ color: '#5648db' }}>
                전체보기 <ChevronRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-black/[0.05]">
              {relatedEntries.map((item) => {
                const itemStyle = categoryStyle[item.category] ?? categoryStyle['other'];
                return (
                  <Link key={item.slug} href={`/dictionary/${item.slug}`}>
                    <div className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-[7px]" style={{ background: itemStyle.side }} />
                      <div className="flex-1 min-w-0">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold mb-1.5 ${itemStyle.bg} ${itemStyle.text}`}>
                          {item.categoryLabel}
                        </span>
                        <p className="text-base font-bold text-slate-900 mb-1">{item.title}</p>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.summary}</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 구분선 ── */}
      <div className="mx-4 mt-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs font-medium text-slate-400 tracking-[0.1em]">추천 서비스</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* ── 서비스 링크 ── */}
      <section className="mu-container-reading pt-3">
        <div className="bg-white rounded-[20px] border border-black/[0.06] overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-black/[0.05]">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6B5FFF, #5648db)' }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-900">함께 보면 좋은 서비스</h3>
          </div>
          <div className="px-5 py-2.5 flex items-center gap-2 border-b border-black/[0.05]">
            <span className="text-xs font-medium px-2 py-1 rounded-md"
              style={{ background: '#f5f3ff', color: '#5b21b6', border: '0.5px solid rgba(124,58,237,0.25)' }}>무료</span>
            <span className="text-xs font-medium px-2 py-1 rounded-md"
              style={{ background: '#f0fdf4', color: '#0f6e56', border: '0.5px solid #5DCAA5' }}>회원가입 없이</span>
            <span className="text-sm text-slate-500">바로 확인할 수 있어요</span>
          </div>
          <div className="divide-y divide-black/[0.05]">
            {SERVICE_LINKS.map((svc) => (
              <Link key={svc.href} href={svc.href}>
                <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                    {svc.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-slate-900">{svc.label}</p>
                    <p className="text-sm text-slate-500 truncate">{svc.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA 배너 ── */}
      <section className="mu-container-reading pt-3 pb-4">
        <div className="relative overflow-hidden rounded-[22px] p-5"
          style={{ background: 'linear-gradient(145deg, #17114c 0%, #2d1f8a 50%, #5d49cb 100%)', boxShadow: '0 16px 40px rgba(15,23,42,0.18)' }}>
          <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-white/50 mb-2">평생사주</p>
          <h3 className="text-[20px] font-bold leading-[1.25] tracking-[-0.04em] text-white mb-4">
            {entry.title}이(가) 내 사주에서<br />어떻게 나타나는지 확인해보세요
          </h3>
          <Link href="/lifelong-saju"
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-bold transition-opacity hover:opacity-90"
            style={{ background: '#ffffff', color: '#17114c', boxShadow: '0 8px 24px rgba(15,23,42,0.3)', fontWeight: 700 }}>
            무료로 바로 확인하기
            <ArrowRight size={17} />
          </Link>
          <p className="text-center text-xs text-white/40 mt-2.5">회원가입 없음 · 저장 없음</p>
        </div>
      </section>
    </div>
  );
}
