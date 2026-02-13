/**
 * Schema.org JSON-LD 구조화된 데이터 유틸리티
 * 검색 엔진 최적화(SEO)를 위한 구조화된 데이터 생성
 */

export interface SchemaOrganization {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
  contactPoint?: {
    "@type": string;
    contactType: string;
    email?: string;
    telephone?: string;
  };
}

export interface SchemaWebSite {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  potentialAction: {
    "@type": string;
    target: {
      "@type": string;
      urlTemplate: string;
    };
    query_input: string;
  };
}

export interface SchemaWebPage {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    "@type": string;
    name: string;
  };
  isPartOf?: {
    "@id": string;
  };
}

export interface SchemaBreadcrumb {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item: string;
  }>;
}

/**
 * Organization 스키마 생성
 * 사이트 전체에 대한 조직 정보 제공
 */
export function createOrganizationSchema(): SchemaOrganization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "무운(MUUN)",
    url: "https://muunsaju.com",
    logo: "https://muunsaju.com/muun-logo.png",
    description:
      "30년 내공의 정통 명리학과 최신 AI 기술이 만나, 회원가입 없이 당신의 미래를 가장 정확하게 풀어드립니다.",
    sameAs: [
      "https://www.instagram.com/muunsaju",
      "https://www.facebook.com/muunsaju",
      "https://www.youtube.com/@muunsaju",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@muunsaju.com",
    },
  };
}

/**
 * WebSite 스키마 생성
 * 사이트 검색 기능 정보 제공
 */
export function createWebSiteSchema(): SchemaWebSite {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "무운(MUUN)",
    url: "https://muunsaju.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://muunsaju.com/search?q={search_term_string}",
      },
      query_input: "required name=search_term_string",
    },
  };
}

/**
 * WebPage 스키마 생성
 * 개별 페이지 정보 제공
 */
export function createWebPageSchema(
  pageName: string,
  pageUrl: string,
  description: string,
  imageUrl?: string,
  datePublished?: string,
  dateModified?: string
): SchemaWebPage {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageName,
    url: pageUrl,
    description: description,
    ...(imageUrl && { image: imageUrl }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    author: {
      "@type": "Organization",
      name: "무운(MUUN)",
    },
    isPartOf: {
      "@id": "https://muunsaju.com",
    },
  };
}

/**
 * BreadcrumbList 스키마 생성
 * 네비게이션 경로 정보 제공
 */
export function createBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
): SchemaBreadcrumb {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * LocalBusiness 스키마 생성
 * 지역 비즈니스 정보 제공
 */
export function createLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "무운(MUUN)",
    url: "https://muunsaju.com",
    description:
      "AI 기반 사주, 타로, 운세 상담 서비스",
    image: "https://muunsaju.com/muun-logo.png",
    priceRange: "$$",
    areaServed: "KR",
    availableLanguage: "ko-KR",
  };
}

/**
 * Article 스키마 생성
 * 블로그/사전 페이지 정보 제공
 */
export function createArticleSchema(
  headline: string,
  description: string,
  imageUrl: string,
  datePublished: string,
  dateModified: string,
  authorName: string = "무운(MUUN)"
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: headline,
    description: description,
    image: imageUrl,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "무운(MUUN)",
      logo: {
        "@type": "ImageObject",
        url: "https://muunsaju.com/muun-logo.png",
      },
    },
  };
}

/**
 * HTML head에 Schema.org JSON-LD 스크립트 추가
 */
export function injectSchemaTag(schema: Record<string, any>): void {
  // 기존 schema 스크립트 제거
  const existingScripts = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  existingScripts.forEach((script) => {
    const scriptEl = script as HTMLScriptElement;
    if (scriptEl.dataset?.schema === "true") {
      scriptEl.remove();
    }
  });

  // 새로운 schema 스크립트 추가
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.schema = "true";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * 여러 Schema를 한 번에 주입
 */
export function injectMultipleSchemas(
  schemas: Record<string, any>[]
): void {
  schemas.forEach((schema) => injectSchemaTag(schema));
}
