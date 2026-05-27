import RelatedServices from "@/components/RelatedServices";

const CompatibilityContent = () => {
  return (
    <RelatedServices
      title="궁합과 함께 보면 좋은 서비스"
      services={[
        {
          href: "/lifelong-saju",
          label: "평생사주",
          description: "두 사람의 사주 바탕을 각각 더 깊이 확인해보세요.",
          emoji: "🔮",
        },
        {
          href: "/yearly-fortune",
          label: "신년운세",
          description: "올해 두 사람의 운의 흐름을 함께 비교해보세요.",
          emoji: "📆",
        },
        {
          href: "/tarot",
          label: "타로",
          description: "관계의 방향을 타로 카드에게 물어보세요.",
          emoji: "🃏",
        },
        {
          href: "/fortune-dictionary",
          label: "운세 사전",
          description: "궁합 결과에 나온 용어를 사전에서 바로 확인하세요.",
          emoji: "📖",
        },
      ]}
    />
  );
};

export default CompatibilityContent;
