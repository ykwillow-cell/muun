import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { DICTIONARY_INDEX, type DictionaryIndexItem } from '@/generated/content-snapshots';

interface RelatedTermsSectionProps {
  currentTermId: string;
  currentTags?: string[];
  maxItems?: number;
}

function getFallbackCategoryEntries(currentEntry: DictionaryIndexItem | undefined, maxItems: number) {
  if (!currentEntry) return [];
  return DICTIONARY_INDEX
    .filter((entry) => entry.id !== currentEntry.id && entry.category === currentEntry.category)
    .slice(0, maxItems);
}

export function RelatedTermsSection({
  currentTermId,
  currentTags = [],
  maxItems = 5,
}: RelatedTermsSectionProps) {
  const relatedTerms = useMemo(() => {
    if (!DICTIONARY_INDEX.length) return [];

    const currentEntry = DICTIONARY_INDEX.find((entry) => entry.id === currentTermId);
    if (!currentEntry) return [];

    if (!currentTags.length) {
      return getFallbackCategoryEntries(currentEntry, maxItems);
    }

    const related = DICTIONARY_INDEX
      .filter((entry) => entry.id !== currentTermId)
      .map((entry) => ({
        entry,
        matchScore: (entry.tags || []).filter((tag) => currentTags.includes(tag)).length,
      }))
      .filter((item) => item.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxItems)
      .map((item) => item.entry);

    return related.length > 0 ? related : getFallbackCategoryEntries(currentEntry, maxItems);
  }, [currentTermId, currentTags, maxItems]);

  if (relatedTerms.length === 0) {
    return null;
  }

  return (
    <section className="my-10">
      <div className="mu-glass-panel p-5 sm:p-6">
        <span className="mu-divider-text">Related terms</span>
        <h3 className="mt-3 text-[22px] font-extrabold tracking-[-0.05em] text-slate-900">함께 보면 좋은 사전어</h3>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {relatedTerms.map((term) => (
            <Link key={term.id} href={`/dictionary/${term.slug}`} className="mu-link-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                    {term.categoryLabel}
                  </div>
                  <h4 className="mt-3 text-[17px] font-extrabold tracking-[-0.04em] text-slate-900 line-clamp-1">{term.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-2">{term.summary}</p>
                </div>
                <ArrowUpRight size={16} className="text-slate-400" aria-hidden="true" />
              </div>
              {term.tags && term.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {term.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-[#6B5FFF]/8 px-2.5 py-1 text-[11px] font-semibold text-[#5648db]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
