import RelatedServices from "@/components/RelatedServices";

const DailyFortuneContent = () => {
  return (
    <RelatedServices
      title="오늘의 운세와 함께 보면 좋은 서비스"
      services={[
        {
          href: "/lifelong-saju",
          label: "평생사주",
          description: "오늘 운세의 바탕이 되는 타고난 기질을 확인해보세요.",
          emoji: "🔮",
        },
        {
          href: "/yearly-fortune",
          label: "신년운세",
          description: "올해 전체 운의 흐름을 큰 그림으로 확인해보세요.",
          emoji: "📆",
        },
        {
          href: "/compatibility",
          label: "궁합",
          description: "오늘의 애정운과 연결해 궁합도 함께 확인해보세요.",
          emoji: "💞",
        },
        {
          href: "/tarot",
          label: "타로",
          description: "오늘 하루의 방향을 타로 카드에게 물어보세요.",
          emoji: "🃏",
        },
      ]}
    />
  );
};

export default DailyFortuneContent;
