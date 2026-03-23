import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { fetchFortuneDictionary, type DictionaryEntry } from '@/lib/fortune-dictionary';

interface RelatedTermsSectionProps {
  currentTermId: string;
  currentTags?: string[];
  maxItems?: number;
}

/**
 * 관련 용어를 추천하는 컴포넌트
 * 현재 용어와 같은 태그를 가진 다른 용어들을 추천
 */
export function RelatedTermsSection({
  currentTermId,
  currentTags = [],
  maxItems = 5,
}: RelatedTermsSectionProps) {
  const [allEntries, setAllEntries] = useState<DictionaryEntry[]>([]);

  useEffect(() => {
    fetchFortuneDictionary().then(setAllEntries);
  }, []);

  const relatedTerms = useMemo(() => {
    if (!allEntries.length) return [];
    if (!currentTags || currentTags.length === 0) {
      return [];
    }

    // 현재 용어를 제외한 다른 용어들 중에서 공통 태그를 가진 것들 찾기
    const related = allEntries
      .filter((entry) => entry.id !== currentTermId)
      .map((entry) => {
        // 공통 태그 개수 계산
        const commonTags = (entry.tags || []).filter((tag) => currentTags.includes(tag));
        return {
          entry,
          matchScore: commonTags.length,
        };
      })
      .filter((item) => item.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxItems)
      .map((item) => item.entry);

    // 공통 태그가 없으면 같은 카테고리의 용어들 추천
    if (related.length === 0) {
      const currentEntry = allEntries.find((e) => e.id === currentTermId);
      if (currentEntry) {
        return allEntries
          .filter((entry) => entry.id !== currentTermId && entry.category === currentEntry.category)
          .slice(0, maxItems);
      }
    }

    return related;
  }, [currentTermId, currentTags, maxItems, allEntries]);

  if (relatedTerms.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-black/10">
      <h3 className="text-lg font-semibold text-[#191F28] mb-4">함께 보면 좋은 사전어</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {relatedTerms.map((term) => (
          <Link
            key={term.id}
            href={`/dictionary/${term.slug}`}
            className="group p-4 bg-white border border-black/10 rounded-2xl hover:border-[#6B5FFF]/30 hover:bg-[#6B5FFF]/05 transition-all duration-200 shadow-sm block"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#191F28] group-hover:text-[#6B5FFF] transition-colors mb-1 text-sm">
                  {term.title}
                </h4>
                <p className="text-xs text-[#4E5968] line-clamp-2 leading-relaxed">{term.summary}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8B95A1] group-hover:text-[#6B5FFF] group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
            </div>
            {term.tags && term.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {term.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 bg-[#F2F4F6] text-[#4E5968] rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

/*
 * 사용 예시:
 *
 * import { RelatedTermsSection } from '@/components/RelatedTermsSection';
 *
 * export default function DictionaryDetail() {
 *   const entry = fortuneDictionary50Complete.find(e => e.slug === slug);
 *
 *   return (
 *     <div>
 *       {* ... 기존 콘텐츠 ... *}
 *
 *       <RelatedTermsSection
 *         currentTermId={entry.id}
 *         currentTags={entry.tags}
 *         maxItems={5}
 *       />
 *     </div>
 *   );
 * }
 */
