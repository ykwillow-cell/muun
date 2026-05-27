import RelatedServices from "@/components/RelatedServices";

const AstrologyContent = () => {
  return (
    <RelatedServices
      title="별자리 운세와 함께 보면 좋은 서비스"
      services={[
        {
          href: "/lifelong-saju",
          label: "평생사주",
          description: "동양 사주와 함께 나를 더 깊이 알아보세요.",
          emoji: "🔮",
        },
        {
          href: "/tarot",
          label: "타로",
          description: "별자리의 흐름을 타로 카드로도 읽어보세요.",
          emoji: "🃏",
        },
        {
          href: "/daily-fortune",
          label: "오늘의 운세",
          description: "오늘 하루의 동양 운세도 함께 확인해보세요.",
          emoji: "📅",
        },
        {
          href: "/compatibility",
          label: "궁합",
          description: "별자리 궁합과 사주 궁합을 함께 분석해보세요.",
          emoji: "💞",
        },
      ]}
    />
  );
};

export default AstrologyContent;
