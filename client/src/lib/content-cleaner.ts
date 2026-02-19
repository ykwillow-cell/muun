/**
 * 콘텐츠 렌더링 클리너
 * 텍스트를 자연스럽게 정제하여 가독성을 높임
 */

/**
 * 텍스트에서 기계적 요소를 제거하고 자연스럽게 정제
 * @param text - 정제할 텍스트
 * @returns 정제된 텍스트
 */
export const cleanAIContent = (text: string): string => {
  if (!text) return '';

  let cleaned = text
    // 별표(**) 제거 (가독성 저해 요소)
    .replace(/\*\*/g, '')
    // 불필요한 레이블 제거
    .replace(/무운의 분석:|역술가:|결론:|분석:|해석:/g, '')
    // 여러 줄의 공백 정규화 (3개 이상 줄바꿈 → 2개로)
    .replace(/\n\n\n+/g, '\n\n')
    // 문단 끝의 마침표 뒤에 공백 추가 (가독성)
    .replace(/([^。\n])\n/g, '$1\n')
    // 마침표 뒤 줄바꿈 전에 공백 추가
    .replace(/니다\.\n/g, '니다.\n\n')
    .replace(/습니다\.\n/g, '습니다.\n\n')
    .replace(/입니다\.\n/g, '입니다.\n\n')
    // 불필요한 공백 제거 (앞뒤)
    .trim();

  return cleaned;
};

/**
 * AI 생성 텍스트를 HTML로 변환하면서 정제
 * @param text - 정제할 텍스트
 * @returns HTML 형식의 정제된 텍스트
 */
export const cleanAIContentToHTML = (text: string): string => {
  const cleaned = cleanAIContent(text);

  // 문단 분리 (빈 줄을 기준으로)
  const paragraphs = cleaned
    .split('\n\n')
    .filter((p) => p.trim().length > 0)
    .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('\n\n');

  return paragraphs;
};

/**
 * AI 결과 텍스트에 따뜻한 격려 메시지 추가
 * @param text - 원본 텍스트
 * @param customClosing - 커스텀 마무리 메시지 (선택사항)
 * @returns 마무리 메시지가 추가된 텍스트
 */
export const addWarmClosing = (
  text: string,
  customClosing?: string
): string => {
  const defaultClosing =
    '당신의 운명은 당신의 손에 달려 있습니다. 이 해석이 당신의 삶에 작은 빛이 되기를 바랍니다.';
  const closing = customClosing || defaultClosing;

  // 이미 마무리 메시지가 있으면 추가하지 않음
  if (text.includes('당신의 운명은') || text.includes('당신의 손에 달려')) {
    return text;
  }

  return `${text.trim()}\n\n${closing}`;
};

/**
 * 전체 파이프라인: 정제 + 마무리 메시지 추가
 * @param text - 정제할 텍스트
 * @param customClosing - 커스텀 마무리 메시지 (선택사항)
 * @returns 완전히 정제된 텍스트
 */
export const processAIContent = (
  text: string,
  customClosing?: string
): string => {
  const cleaned = cleanAIContent(text);
  const withClosing = addWarmClosing(cleaned, customClosing);
  return withClosing;
};

/**
 * React 컴포넌트에서 사용할 정제된 콘텐츠
 * @param text - 정제할 텍스트
 * @returns 정제된 문단 배열
 */
export const getParagraphs = (text: string): string[] => {
  const cleaned = cleanAIContent(text);
  return cleaned
    .split('\n\n')
    .filter((p) => p.trim().length > 0);
};
