/**
 * Open Graph 메타 태그를 동적으로 업데이트하는 유틸리티
 */

interface OGTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const DEFAULT_OG_IMAGE = "https://muunsaju.com/images/horse_mascot.png";
const DICTIONARY_OG_IMAGE = "https://muunsaju.com/images/horse_mascot.png";
const TAROT_OG_IMAGE = "https://muunsaju.com/images/horse_mascot.png";

export const updateOGTags = (config: OGTagsConfig) => {
  const {
    title = "무운 (MuUn) - 회원가입 없는 무료 사주 및 2026년 신년 운세",
    description = "생년월일만으로 확인하는 무료 사주, 2026년 병오년 신년 운세, 토정비결, 궁합 서비스. 30년 경력 역술인의 전문적인 풀이를 만나보세요.",
    image = DEFAULT_OG_IMAGE,
    url = "https://muunsaju.com",
    type = "website",
  } = config;

  // og:title
  updateMetaTag("property", "og:title", title);
  
  // og:description
  updateMetaTag("property", "og:description", description);
  
  // og:image
  updateMetaTag("property", "og:image", image);
  
  // og:url
  updateMetaTag("property", "og:url", url);
  
  // og:type
  updateMetaTag("property", "og:type", type);
  
  // twitter:title
  updateMetaTag("name", "twitter:title", title);
  
  // twitter:description
  updateMetaTag("name", "twitter:description", description);
  
  // twitter:image
  updateMetaTag("name", "twitter:image", image);
};

const updateMetaTag = (
  attrName: "property" | "name",
  attrValue: string,
  content: string
) => {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  
  element.setAttribute("content", content);
};

// 페이지별 OG 태그 설정 함수들
export const setHomeOGTags = () => {
  updateOGTags({
    title: "무운 (MuUn) - 회원가입 없는 무료 사주 및 2026년 신년 운세",
    description: "생년월일만으로 확인하는 무료 사주, 2026년 병오년 신년 운세, 토정비결, 궁합 서비스. 30년 경력 역술인의 전문적인 풀이를 만나보세요.",
    image: DEFAULT_OG_IMAGE,
    url: "https://muunsaju.com",
  });
};

export const setDictionaryOGTags = () => {
  updateOGTags({
    title: "사주 용어 사전 - 무운",
    description: "사주 용어와 운세 관련 개념을 쉽게 설명하는 사전입니다. 무운에서 제공하는 전문적인 풀이를 만나보세요.",
    image: DICTIONARY_OG_IMAGE,
    url: "https://muunsaju.com/fortune-dictionary",
  });
};

export const setTarotOGTags = () => {
  updateOGTags({
    title: "타로 상담 - 무운",
    description: "타로 상담으로 당신의 미래를 엿보세요. 고민에 대한 답을 카드를 통해 확인해 보세요.",
    image: TAROT_OG_IMAGE,
    url: "https://muunsaju.com/tarot",
  });
};

export const setYearlyFortuneOGTags = () => {
  updateOGTags({
    title: "신년 운세 - 무운",
    description: "2026년 신년 운세를 확인하세요. 생년월일로 개인 맞춤 신년 운세를 받을 수 있습니다.",
    image: DEFAULT_OG_IMAGE,
    url: "https://muunsaju.com/yearly-fortune",
  });
};

export const setLifelongSajuOGTags = () => {
  updateOGTags({
    title: "평생 사주 - 무운",
    description: "평생 사주로 당신의 인생을 알아보세요. 생년월일로 개인 맞춤 평생 사주를 받을 수 있습니다.",
    image: DEFAULT_OG_IMAGE,
    url: "https://muunsaju.com/lifelong-saju",
  });
};

export const setCompatibilityOGTags = () => {
  updateOGTags({
    title: "궁합 - 무운",
    description: "두 사람의 궁합을 확인하세요. 생년월일로 개인 맞춤 궁합 분석을 받을 수 있습니다.",
    image: DEFAULT_OG_IMAGE,
    url: "https://muunsaju.com/compatibility",
  });
};

export const setGuideOGTags = () => {
  updateOGTags({
    title: "운세 가이드 - 무운",
    description: "사주 명리학의 지혜를 전해드립니다. 초보자를 위한 사주 보는 법부터 개운법까지 다양한 정보를 만나보세요.",
    image: DEFAULT_OG_IMAGE,
    url: "https://muunsaju.com/guide",
  });
};

export const setGuideDetailOGTags = (title: string, description: string, id: string) => {
  updateOGTags({
    title: `${title} - 무운 운세 가이드`,
    description: description,
    image: DEFAULT_OG_IMAGE,
    url: `https://muunsaju.com/guide/${id}`,
  });
};

// Guide.tsx 등에서 호출하던 getOgTags의 역할을 대신하거나 호환성을 위해 추가
export const getOgTags = (config: OGTagsConfig) => {
  return config; // 실제 태그 업데이트는 updateOGTags에서 수행하므로 여기서는 설정값만 반환하거나 빈 함수로 둡니다.
};
