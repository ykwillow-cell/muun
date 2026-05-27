import RelatedServices from "@/components/RelatedServices";

const TojeongContent = () => {
  return (
    <RelatedServices
      title="토정비결과 함께 보면 좋은 서비스"
      services={[
        {
          href: "/lifelong-saju",
          label: "평생사주",
          description: "토정비결과 함께 타고난 기질과 평생 운도 확인해보세요.",
          emoji: "🔮",
        },
        {
          href: "/yearly-fortune",
          label: "신년운세",
          description: "올해의 운 흐름을 더 다양한 관점으로 살펴보세요.",
          emoji: "📆",
        },
        {
          href: "/daily-fortune",
          label: "오늘의 운세",
          description: "오늘 하루의 구체적인 운세도 함께 확인해보세요.",
          emoji: "📅",
        },
        {
          href: "/fortune-dictionary",
          label: "운세 사전",
          description: "토정비결에 나오는 용어를 사전에서 찾아보세요.",
          emoji: "📖",
        },
      ]}
    />
  );
};

export default TojeongContent;
