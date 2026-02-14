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

const DEFAULT_OG_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/ke6wSxXMdfjN7evZriHUNG/sandbox/eHlTQumkYNMdWnZxcXyumz-img-1_1770983994000_na1fn_b2ctaW1hZ2UtbWFpbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva2U2d1N4WE1kZmpON2V2WnJpSFVORy9zYW5kYm94L2VIbFRRdW1rWU5NZFduWnhjWHl1bXotaW1nLTFfMTc3MDk4Mzk5NDAwMF9uYTFmbl9iMmN0YVcxaFoyVXRiV0ZwYmcucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=FRVfAY8xwHZDZq99Y5Z~3wpCEnMv6NOPd8hn5Jiz6N0gSgpRxJsTc6QhXA~gYKDbzDCu2AVaHPHzmsAZnCazPq-Ff8fXLOL6qKRBP9mv8g4ZiuAAOvn-pGf6DHu3xEUdOmz-q8JIZCxyWau-hB4AaUDyYUHWeS5OG3-cCsstwg-ibZ3e2PSxDyMZfWCEnZjw~IyAskd6b3GWDkOddbmgOLYsP7x0ckNfQYDiOZSSNnnRK-4KE-qqWr6JpiXiziC0g7HBglQWL~IAlAOXYs2tPHy1Qfp1wCc3o51fD3cYLxZULsPksBpN~XXFkV-mRyhIAxGojjeaPjgSepNIkftYiQ__";
const DICTIONARY_OG_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/ke6wSxXMdfjN7evZriHUNG/sandbox/eHlTQumkYNMdWnZxcXyumz-img-2_1770983990000_na1fn_b2ctaW1hZ2UtZGljdGlvbmFyeQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva2U2d1N4WE1kZmpON2V2WnJpSFVORy9zYW5kYm94L2VIbFRRdW1rWU5NZFduWnhjWHl1bXotaW1nLTJfMTc3MDk4Mzk5MDAwMF9uYTFmbl9iMmN0YVcxaFoyVXRaR2xqZEdsdmJtRnllUS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=BWp18GXvy2uVr7-ePVoH03-hAJK20hQ~3euE6i6BHpC8U3E2KQ17QqJ0xen5ZXpiUojU4lepuWi9FT08BpTkiXEZj2TSSwTJeHmrJQn0EPTX4uhMHU86mMPLRRZdmLz7EZOCNr5Qs8RU~R586W7l3qOZEzZ7WRgEeec0RiRdlgFyknGxPqPOs-kx-WhlzGQ0gPt~QlF5seogTtsnHvDguIe-~boXH67wj8S34dPhDPi1s8qT4juP5ZFaoDgRdor5x1vnofrZLF3RpQ2TgAtoa78SPoEFNwDue6JhmX5c7j3z4QGYEiTSHegtAePBvGMu6ra8g2QNAu8lpz8aZfwkGw__";
const TAROT_OG_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/ke6wSxXMdfjN7evZriHUNG/sandbox/eHlTQumkYNMdWnZxcXyumz-img-3_1770984000000_na1fn_b2ctaW1hZ2UtdGFyb3Q.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva2U2d1N4WE1kZmpON2V2WnJpSFVORy9zYW5kYm94L2VIbFRRdW1rWU5NZFduWnhjWHl1bXotaW1nLTNfMTc3MDk4NDAwMDAwMF9uYTFmbl9iMmN0YVcxaFoyVXRkR0Z5YjNRLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=VEEopdRJzGpaMjDHdskZRXO3L4W7xlzMfm-GpAcfxrtdzO6u~i7TS7EnGKxcMEzVMJMobCyLXhAbaI61yNWy~3duN4uu0XiphkpVcwgH23TWspYHSCbjX~fA5joioZ4ASWDL71E02KhEB4V87Fv9Il8nwSjfLHw76wmfN0LDQCVzqmlAMbOdy-BK5czdkcWjEmPhRhSzv6ovH2C3S9Nd3U1~i~HyU7iX4pmm4EI5wVYUDhlVAOfpcrOf86w8qPM58iD0zAD0DqCYSPOtwpu2hyHyfjszAGoWxc4sr1mfQ6Cl1mtv9uhCBmbH8ZQn0kAVlb0QFCCqJjg0FosaDo6KRQ__";

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
    url: "https://muunsaju.com/dictionary",
  });
};

export const setTarotOGTags = () => {
  updateOGTags({
    title: "타로 상담 - 무운",
    description: "AI 타로 상담으로 당신의 미래를 엿보세요. 생년월일로 개인 맞춤 타로 해석을 받을 수 있습니다.",
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
    url: "https://muunsaju.com/lifespan-saju",
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
