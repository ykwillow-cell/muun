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
  description = "AI 기반 사주, 타로, 운세 분석 플랫폼",
  url = "https://muunsaju.com",
  logo = "https://muunsaju.com/logo.png",
  sameAs = [],
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    description,
    url,
    logo,
    sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: "https://muunsaju.com/contact",
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
