import { Helmet } from "react-helmet-async";
import { FortuneResult } from "@/lib/fortune-templates";
import { SajuResult } from "@/lib/saju";
import { BRANCH_READINGS, ELEMENT_KOREAN } from "@/lib/saju-reading";
import { STEM_ELEMENTS } from "@/lib/saju";

interface YearlyFortuneSchemaProps {
  birthDate: string; // "1990-01-15"
  saju: SajuResult;
  fortune: FortuneResult;
}

/**
 * 신년운세 Schema Markup 컴포넌트
 * 
 * 생성되는 Schema:
 * 1. ArticleSchema - 운세 결과를 기사로 표현
 * 2. FAQSchema - 자주 묻는 질문
 * 3. BreadcrumbSchema - 네비게이션 구조
 */
export function YearlyFortuneSchema({ birthDate, saju, fortune }: YearlyFortuneSchemaProps) {
  const zodiacAnimal = BRANCH_READINGS[saju.dayPillar.branch]?.animal || '미상';
  const dayElement = STEM_ELEMENTS[saju.dayPillar.stem];
  const elementKorean = ELEMENT_KOREAN[dayElement] || dayElement;
  const today = new Date().toISOString().split('T')[0];

  // ArticleSchema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `2026년 신년운세 - ${zodiacAnimal}띠 ${elementKorean}의 기운`,
    "description": `${zodiacAnimal}띠의 2026년 신년운세. 총운, 재물운, 직업운, 애정운 상세 분석`,
    "image": "https://muunsaju.com/images/horse_mascot.png",
    "datePublished": today,
    "dateModified": today,
    "author": {
      "@type": "Organization",
      "name": "무운(MUUN)",
      "url": "https://muunsaju.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "무운(MUUN)",
      "logo": {
        "@type": "ImageObject",
        "url": "https://muunsaju.com/images/muun-mark.svg"
      }
    },
    "mainEntity": {
      "@type": "Thing",
      "name": "신년운세 결과",
      "description": `${zodiacAnimal}띠 ${elementKorean}의 기운으로 2026년을 맞이하는 운세`
    }
  };

  // FAQSchema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "2026년 총운은 어떻게 되나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": fortune.overall?.summary || "2026년 운세를 확인해보세요."
        }
      },
      {
        "@type": "Question",
        "name": `${zodiacAnimal}띠의 재물운은?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": fortune.wealth?.summary || "재물운 정보를 확인해보세요."
        }
      },
      {
        "@type": "Question",
        "name": "직업운과 사업운은?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": fortune.career?.summary || "직업운 정보를 확인해보세요."
        }
      },
      {
        "@type": "Question",
        "name": "애정운과 결혼운은?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": fortune.love?.summary || "애정운 정보를 확인해보세요."
        }
      },
      {
        "@type": "Question",
        "name": "오행의 기운이 2026년에 어떤 영향을 미치나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${elementKorean}의 기운은 2026년 운세에 중요한 영향을 미칩니다. 오행의 상생과 상극 관계를 고려하여 운세를 분석했습니다.`
        }
      }
    ]
  };

  // BreadcrumbSchema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": "https://muunsaju.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "신년운세",
        "item": "https://muunsaju.com/yearly-fortune"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "신년운세 결과",
        "item": `https://muunsaju.com/yearly-fortune/${birthDate}`
      }
    ]
  };

  return (
    <Helmet>
      {/* ArticleSchema */}
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>

      {/* FAQSchema */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      {/* BreadcrumbSchema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      {/* Open Graph 메타 태그 */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content="2026년 신년운세 결과 - 무운" />
      <meta property="og:description" content="2026년 신년운세 분석 결과입니다. 총운, 재물운, 직업운, 애정운 상세 분석을 확인하세요." />
      <meta property="og:url" content={`https://muunsaju.com/yearly-fortune/${birthDate}`} />
      <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="2026년 신년운세 결과 - 무운" />
      <meta name="twitter:description" content="2026년 신년운세 분석 결과를 확인해보세요." />
      <meta name="twitter:image" content="https://muunsaju.com/images/horse_mascot.png" />

      {/* 추가 메타 태그 */}
      <meta name="keywords" content={`${zodiacAnimal}띠 운세, 2026년 신년운세, ${elementKorean} 운세`} />
      <meta name="article:published_time" content={today} />
      <meta name="article:modified_time" content={today} />
      <meta name="article:author" content="무운(MUUN)" />
    </Helmet>
  );
}

/**
 * 평생사주 Schema Markup 컴포넌트
 */
interface LifelongSajuSchemaProps {
  birthDate: string;
  saju: SajuResult;
}

export function LifelongSajuSchema({ birthDate, saju }: LifelongSajuSchemaProps) {
  const zodiacAnimal = BRANCH_READINGS[saju.dayPillar.branch]?.animal || '미상';
  const dayElement = STEM_ELEMENTS[saju.dayPillar.stem];
  const elementKorean = ELEMENT_KOREAN[dayElement] || dayElement;
  const today = new Date().toISOString().split('T')[0];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `평생사주 분석 - ${zodiacAnimal}띠 ${elementKorean}의 인생`,
    "description": `${zodiacAnimal}띠의 평생 사주 분석. 성격, 재능, 운명, 길한 방향 등 상세 분석`,
    "image": "https://muunsaju.com/images/horse_mascot.png",
    "datePublished": today,
    "dateModified": today,
    "author": {
      "@type": "Organization",
      "name": "무운(MUUN)",
      "url": "https://muunsaju.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "무운(MUUN)",
      "logo": {
        "@type": "ImageObject",
        "url": "https://muunsaju.com/images/muun-mark.svg"
      }
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>

      <meta property="og:type" content="article" />
      <meta property="og:title" content="평생사주 분석 결과 - 무운" />
      <meta property="og:description" content="사주팔자를 기반으로 한 평생 사주 분석 결과입니다." />
      <meta property="og:url" content={`https://muunsaju.com/lifelong-saju/${birthDate}`} />
      <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />

      <meta name="keywords" content={`${zodiacAnimal}띠 사주, 평생사주, 사주 분석`} />
      <meta name="article:published_time" content={today} />
      <meta name="article:modified_time" content={today} />
      <meta name="article:author" content="무운(MUUN)" />
    </Helmet>
  );
}
