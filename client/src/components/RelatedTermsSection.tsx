import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'wouter';
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
      <h3 className="text-lg font-semibold text-[#1a1a18] mb-6">함께 보면 좋은 기운</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedTerms.map((term) => (
          <Link key={term.id} href={`/dictionary/${term.slug}`}>
            <a className="group p-4 bg-[#f5f4ef] border border-black/10 rounded-lg hover:border-black/20 hover:bg-white transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1a1a18] group-hover:text-yellow-400 transition-colors mb-2">
                    {term.title}
                  </h4>
                  <p className="text-sm text-[#5a5a56] line-clamp-2">{term.summary}</p>
                </div>
                <div className="ml-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
              {term.tags && term.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {term.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-[#f5f4ef] text-[#5a5a56] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {term.tags.length > 2 && (
                    <span className="text-xs px-2 py-1 bg-[#f5f4ef] text-[#5a5a56] rounded-full">
                      +{term.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </a>
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
