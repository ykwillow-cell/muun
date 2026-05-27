import RelatedServices from "@/components/RelatedServices";

const HybridCompatibilityContent = () => {
  return (
    <RelatedServices
      title="사주×MBTI 궁합과 함께 보면 좋은 서비스"
      services={[
        {
          href: "/lifelong-saju",
          label: "평생사주",
          description: "나의 타고난 사주를 더 깊이 확인해보세요.",
          emoji: "🔮",
        },
        {
          href: "/compatibility",
          label: "궁합",
          description: "오행 기반 전통 궁합도 함께 분석해보세요.",
          emoji: "💞",
        },
        {
          href: "/psychology",
          label: "심리테스트",
          description: "MBTI 외에 다른 심리 탐색도 해보세요.",
          emoji: "🧩",
        },
        {
          href: "/daily-fortune",
          label: "오늘의 운세",
          description: "오늘 두 사람의 운세 흐름을 확인해보세요.",
          emoji: "📅",
        },
      ]}
    />
  );
};

export default HybridCompatibilityContent;
