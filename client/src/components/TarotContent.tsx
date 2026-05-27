import RelatedServices from "@/components/RelatedServices";

const TarotContent = () => {
  return (
    <RelatedServices
      title="타로와 함께 보면 좋은 서비스"
      services={[
        {
          href: "/lifelong-saju",
          label: "평생사주",
          description: "타로가 보여준 흐름을 사주로 더 깊이 확인해보세요.",
          emoji: "🔮",
        },
        {
          href: "/daily-fortune",
          label: "오늘의 운세",
          description: "오늘 하루의 총운·재물운·애정운을 바로 확인해보세요.",
          emoji: "📅",
        },
        {
          href: "/compatibility",
          label: "궁합",
          description: "관계에 관한 질문이라면 궁합 분석도 함께 보세요.",
          emoji: "💞",
        },
        {
          href: "/dream",
          label: "꿈해몽",
          description: "어젯밤 꿈이 궁금하다면 꿈해몽으로 이어보세요.",
          emoji: "🌙",
        },
      ]}
    />
  );
};

export default TarotContent;
