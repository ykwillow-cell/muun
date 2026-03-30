/**
 * useLinkedText
 *
 * 텍스트 내에서 사주 사전 용어를 자동으로 감지하여
 * 해당 사전 페이지(/dictionary/:slug)로 연결되는 인라인 링크로 변환합니다.
 *
 * 동작 방식:
 * - fortune_dictionary 전체 목록을 한 번만 fetch하여 메모이제이션
 * - 각 용어의 한글 이름(한자 괄호 제거)을 기준으로 텍스트 매칭
 * - 가장 긴 용어부터 매칭하여 부분 중복 방지
 * - 동일 용어는 첫 번째 등장에만 링크 삽입 (과도한 링크 방지)
 * - 현재 페이지 slug와 동일한 용어는 링크 제외 (자기 참조 방지)
 */

import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { fortuneDictionary } from '@/lib/fortune-dictionary';

/**
 * HTML 문자열 내 텍스트 노드에서 사주 사전 용어를 찾아 <a> 태그로 감싸 반환합니다.
 * GuideDetail처럼 dangerouslySetInnerHTML을 사용하는 경우에 활용합니다.
 */
export function injectLinksIntoHtml(html: string): string {
  if (!html || !fortuneDictionary.length) return html;

  const terms = fortuneDictionary
    .map((entry) => ({
      koreanName: entry.title.replace(/\(.*?\)/g, '').trim(),
      slug: entry.slug,
      title: entry.title,
    }))
    .filter((t) => t.koreanName.length >= 2)
    .sort((a, b) => b.koreanName.length - a.koreanName.length);

  const linkedSlugs = new Set<string>();
  let result = html;

  for (const term of terms) {
    if (linkedSlugs.has(term.slug)) continue;
    const escaped = term.koreanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // 태그 사이 텍스트에서만 매칭 (태그 속성 내부 제외)
    const regex = new RegExp(`(>|^)([^<]*?)(${escaped})([^<]*?)(?=<|$)`, 'g');
    let replaced = false;
    result = result.replace(regex, (_match, open, before, keyword, after) => {
      if (replaced) return _match;
      replaced = true;
      return `${open}${before}<a href="/dictionary/${term.slug}" class="text-[#6B5FFF] underline underline-offset-2 decoration-[#6B5FFF]/40 hover:decoration-[#6B5FFF] transition-colors font-medium" title="${term.title}">${keyword}</a>${after}`;
    });
    if (replaced) linkedSlugs.add(term.slug);
  }

  return result;
}

interface LinkedTextProps {
  text: string;
  /** 현재 페이지의 사전 slug (자기 참조 방지용) */
  excludeSlug?: string;
  className?: string;
}

/**
 * 사주 사전 용어를 인라인 링크로 변환하는 컴포넌트
 */
export function LinkedText({ text, excludeSlug, className }: LinkedTextProps) {
  const segments = useMemo(() => {
    if (!text || !fortuneDictionary.length) {
      return [{ type: 'text' as const, value: text || '' }];
    }

    // 용어 목록 준비: 한자 괄호 제거한 한글 이름 추출, 긴 것 우선
    const terms = fortuneDictionary
      .filter((entry) => entry.slug !== excludeSlug)
      .map((entry) => {
        // "역마살(驛馬煞)" → "역마살", "정재(正財)" → "정재"
        const koreanName = entry.title.replace(/\(.*?\)/g, '').trim();
        return { koreanName, slug: entry.slug, title: entry.title };
      })
      .filter((t) => t.koreanName.length >= 2) // 2글자 미만 제외 (오매칭 방지)
      .sort((a, b) => b.koreanName.length - a.koreanName.length); // 긴 것 우선

    type Segment =
      | { type: 'text'; value: string }
      | { type: 'link'; value: string; slug: string; title: string };

    let segments: Segment[] = [{ type: 'text', value: text }];
    const linkedSlugs = new Set<string>(); // 이미 링크된 용어 추적

    for (const term of terms) {
      if (linkedSlugs.has(term.slug)) continue;

      const newSegments: Segment[] = [];
      let found = false;

      for (const seg of segments) {
        if (seg.type !== 'text') {
          newSegments.push(seg);
          continue;
        }

        const idx = seg.value.indexOf(term.koreanName);
        if (idx === -1 || found) {
          newSegments.push(seg);
          continue;
        }

        // 첫 번째 등장에만 링크 삽입
        found = true;
        if (idx > 0) {
          newSegments.push({ type: 'text', value: seg.value.slice(0, idx) });
        }
        newSegments.push({ type: 'link', value: term.koreanName, slug: term.slug, title: term.title });
        const rest = seg.value.slice(idx + term.koreanName.length);
        if (rest) {
          newSegments.push({ type: 'text', value: rest });
        }
      }

      if (found) {
        linkedSlugs.add(term.slug);
        segments = newSegments;
      }
    }

    return segments;
  }, [text, excludeSlug]);

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.type === 'link' ? (
          <Link
            key={i}
            href={`/dictionary/${seg.slug}`}
            className="text-[#6B5FFF] underline underline-offset-2 decoration-[#6B5FFF]/40 hover:decoration-[#6B5FFF] transition-colors font-medium"
            title={seg.title}
          >
            {seg.value}
          </Link>
        ) : (
          <React.Fragment key={i}>{seg.value}</React.Fragment>
        )
      )}
    </span>
  );
}
