import { Helmet } from "react-helmet-async";

interface OrganizationSchemaProps {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbListSchemaProps {
  items: BreadcrumbItem[];
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  serviceType?: string;
}

/**
 * Organization Schema Markup
 * 웹사이트의 조직 정보를 구조화된 데이터로 제공
 */
export function OrganizationSchema({
  name = "무운 (MUUN)",
  description = "회원가입 없이, 개인정보 저장 없이 이용하는 100% 무료 사주, 타로, 운세 분석 서비스",
  url = "https://muunsaju.com",
  logo = "https://muunsaju.com/images/horse_mascot.png",
  sameAs = [],
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    description,
    url,
    logo: {
      "@type": "ImageObject",
      url: logo,
      width: 512,
      height: 512,
    },
    sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: "https://muunsaju.com/contact",
      availableLanguage: "Korean",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

/**
 * Breadcrumb List Schema Markup
 * 페이지의 계층 구조를 검색 결과에 표시
 */
export function BreadcrumbListSchema({ items }: BreadcrumbListSchemaProps) {
  const breadcrumbItems = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

/**
 * Service Schema Markup
 * 서비스 페이지의 정보를 구조화된 데이터로 제공
 */
export function ServiceSchema({
  name,
  description,
  url,
  image,
  serviceType = "Professional Service",
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    image,
    serviceType,
    isRelatedTo: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
      description: "회원가입 없이 이용 가능한 100% 무료 서비스",
    },
    provider: {
      "@type": "Organization",
      name: "무운 (MUUN)",
      url: "https://muunsaju.com",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

/**
 * Article Schema Markup
 * 블로그 포스트나 기사 페이지의 정보를 구조화된 데이터로 제공
 */
export function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author = "무운",
}: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: author,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

/**
 * FAQ Schema Markup
 * FAQ 페이지의 정보를 구조화된 데이터로 제공
 */
export function FAQSchema({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const mainEntity = faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

/**
 * WebApplication Schema Markup
 * 무운 서비스를 웹 애플리케이션으로 구조화된 데이터 제공
 */
export function WebApplicationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "무운 (MuUn) - 무료 사주 및 운세",
    description: "회원가입 없이, 개인정보 저장 없이 이용하는 100% 무료 사주풀이, 운세, 타로, 궁합, 꿈해몽 서비스",
    url: "https://muunsaju.com",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    featureList: [
      "무료 사주풀이",
      "2026년 신년운세",
      "무료 토정비결",
      "무료 궁합",
      "AI 타로 상담",
      "무료 만세력",
      "꿈해몽 사전",
      "심리테스트",
      "오늘의 운세",
      "점성술",
    ],
    screenshot: "https://muunsaju.com/images/horse_mascot.png",
    author: {
      "@type": "Organization",
      name: "MUUN Celestial Services",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

/**
 * SiteNavigationElement Schema Markup
 * 사이트 내비게이션 구조를 검색엔진에 전달
 */
export function SiteNavigationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "무운 주요 서비스",
    itemListElement: [
      { "@type": "SiteNavigationElement", position: 1, name: "신년운세", url: "https://muunsaju.com/yearly-fortune" },
      { "@type": "SiteNavigationElement", position: 2, name: "평생사주", url: "https://muunsaju.com/lifelong-saju" },
      { "@type": "SiteNavigationElement", position: 3, name: "토정비결", url: "https://muunsaju.com/tojeong" },
      { "@type": "SiteNavigationElement", position: 4, name: "궁합", url: "https://muunsaju.com/compatibility" },
      { "@type": "SiteNavigationElement", position: 5, name: "AI 타로", url: "https://muunsaju.com/tarot" },
      { "@type": "SiteNavigationElement", position: 6, name: "만세력", url: "https://muunsaju.com/manselyeok" },
      { "@type": "SiteNavigationElement", position: 7, name: "꿈해몽", url: "https://muunsaju.com/dream" },
      { "@type": "SiteNavigationElement", position: 8, name: "오늘의 운세", url: "https://muunsaju.com/daily-fortune" },
      { "@type": "SiteNavigationElement", position: 9, name: "심리테스트", url: "https://muunsaju.com/psychology" },
      { "@type": "SiteNavigationElement", position: 10, name: "운세 칼럼", url: "https://muunsaju.com/guide" },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
