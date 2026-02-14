// 내부 링크 자동화 시스템
// 50개 사주 용어를 감지하고 자동으로 /dictionary/{slug}로 링크 생성

import React from 'react';
import { fortuneDictionary } from './fortune-dictionary';

export interface KeywordMatch {
  keyword: string;
  slug: string;
  title: string;
  startIndex: number;
  endIndex: number;
}

/**
 * 모든 키워드와 slug를 매핑한 객체 생성
 * 예: { "갑목": "gab-mok", "을목": "eul-mok", ... }
 */
export function createKeywordMap(): Record<string, string> {
  const map: Record<string, string> = {};
  fortuneDictionary.forEach((entry) => {
    // 용어명 전체 (예: "갑목(甲木)")
    map[entry.title] = entry.slug;
    // 한글 부분만 (예: "갑목")
    const koreanOnly = entry.title.replace(/\([^)]*\)/g, '').trim();
    map[koreanOnly] = entry.slug;
  });
  return map;
}

/**
 * 텍스트에서 키워드를 찾고 매칭 정보 반환
 * @param text - 검색할 텍스트
 * @param keywordMap - 키워드와 slug 매핑 객체
 * @returns 매칭된 키워드 정보 배열
 */
export function findKeywordMatches(
  text: string,
  keywordMap: Record<string, string>
): KeywordMatch[] {
  const matches: KeywordMatch[] = [];
  const keywords = Object.keys(keywordMap).sort((a, b) => b.length - a.length); // 긴 키워드부터 검색

  keywords.forEach((keyword) => {
    // 정규표현식으로 단어 경계 기준 검색 (이미 링크된 부분은 제외)
    const regex = new RegExp(`(?<!<a[^>]*>)(?<![\\w])${keyword}(?![\\w])`, 'g');
    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        keyword,
        slug: keywordMap[keyword],
        title: keyword,
        startIndex: match.index,
        endIndex: match.index + keyword.length,
      });
    }
  });

  // 중복 제거 및 정렬
  return Array.from(new Map(matches.map((m) => [m.startIndex, m])).values()).sort(
    (a, b) => a.startIndex - b.startIndex
  );
}

/**
 * 텍스트에 자동 하이퍼링크 삽입
 * @param text - 원본 텍스트
 * @param keywordMap - 키워드와 slug 매핑 객체
 * @returns 링크가 삽입된 HTML 문자열
 */
export function autoLinkKeywords(text: string, keywordMap?: Record<string, string>): string {
  if (!keywordMap) {
    keywordMap = createKeywordMap();
  }

  const matches = findKeywordMatches(text, keywordMap);

  if (matches.length === 0) {
    return text;
  }

  // 역순으로 처리하여 인덱스 변화 방지
  let result = text;
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const before = result.substring(0, match.startIndex);
    const keyword = result.substring(match.startIndex, match.endIndex);
    const after = result.substring(match.endIndex);

    result = `${before}<a href="/dictionary/${match.slug}" class="dictionary-link">${keyword}</a>${after}`;
  }

  return result;
}

/**
 * React 컴포넌트에서 사용할 수 있도록 텍스트를 JSX 요소로 변환
 * @param text - 원본 텍스트
 * @param keywordMap - 키워드와 slug 매핑 객체
 * @returns 링크가 포함된 React 요소 배열
 */
export function autoLinkKeywordsToJSX(
  text: string,
  keywordMap?: Record<string, string>
): (string | JSX.Element)[] {
  if (!keywordMap) {
    keywordMap = createKeywordMap();
  }

  const matches = findKeywordMatches(text, keywordMap);

  if (matches.length === 0) {
    return [text];
  }

  const elements: (string | JSX.Element)[] = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    // 매치 이전의 텍스트
    if (match.startIndex > lastIndex) {
      elements.push(text.substring(lastIndex, match.startIndex));
    }

    // 링크된 키워드
    elements.push(
      React.createElement('a', {
        key: `keyword-${index}`,
        href: `/dictionary/${match.slug}`,
        className: 'dictionary-link',
        title: match.title,
      }, match.keyword)
    );

    lastIndex = match.endIndex;
  });

  // 마지막 매치 이후의 텍스트
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
}

/**
 * 특정 카테고리의 키워드만 필터링하여 링크 생성
 * @param text - 원본 텍스트
 * @param categories - 필터링할 카테고리 배열
 * @returns 링크가 삽입된 HTML 문자열
 */
export function autoLinkKeywordsByCategory(
  text: string,
  categories: string[]
): string {
  const keywordMap: Record<string, string> = {};

  fortuneDictionary50Complete
    .filter((entry) => categories.includes(entry.category))
    .forEach((entry) => {
      const koreanOnly = entry.title.replace(/\([^)]*\)/g, '').trim();
      keywordMap[koreanOnly] = entry.slug;
    });

  return autoLinkKeywords(text, keywordMap);
}

/**
 * 링크 스타일 CSS
 * 이를 전역 스타일에 추가하세요
 */
export const DICTIONARY_LINK_STYLES = `
  .dictionary-link {
    color: #FFD700;
    text-decoration: none;
    border-bottom: 1px dotted #FFD700;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .dictionary-link:hover {
    color: #FFF;
    background-color: rgba(255, 215, 0, 0.1);
    border-bottom-color: #FFF;
  }

  .dictionary-link:visited {
    color: #FFD700;
  }
`;

/**
 * 사용 예시:
 *
 * // HTML 문자열로 반환
 * const linkedText = autoLinkKeywords(
 *   "당신의 갑목 기운과 도화살이 만나면 어떤 의미일까요?"
 * );
 * // 결과: "당신의 <a href="/dictionary/gab-mok" class="dictionary-link">갑목</a> 기운과 <a href="/dictionary/dohwa-sal" class="dictionary-link">도화살</a>이 만나면 어떤 의미일까요?"
 *
 * // React JSX로 반환
 * const linkedElements = autoLinkKeywordsToJSX(
 *   "당신의 갑목 기운과 도화살이 만나면 어떤 의미일까요?"
 * );
 * // 결과: ["당신의 ", <a href="/dictionary/gab-mok">갑목</a>, " 기운과 ", <a href="/dictionary/dohwa-sal">도화살</a>, "이 만나면 어떤 의미일까요?"]
 *
 * // 특정 카테고리만 링크
 * const linkedText = autoLinkKeywordsByCategory(
 *   "당신의 갑목 기운과 도화살이 만나면 어떤 의미일까요?",
 *   ["basic", "evil-spirit"]
 * );
 */
