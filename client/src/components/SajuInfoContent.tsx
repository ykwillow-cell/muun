import RelatedServices from "@/components/RelatedServices";

const SajuInfoContent = () => {
  return (
    <RelatedServices
      title="평생사주와 함께 보면 좋은 서비스"
      services={[
        {
          href: "/daily-fortune",
          label: "오늘의 운세",
          description: "오늘 하루의 구체적인 운세도 함께 확인해보세요.",
          emoji: "📅",
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
          description: "나의 사주를 기반으로 인연 운도 분석해보세요.",
          emoji: "💞",
        },
        {
          href: "/fortune-dictionary",
          label: "운세 사전",
          description: "결과에 나온 용어가 궁금하다면 사전에서 바로 찾아보세요.",
          emoji: "📖",
        },
      ]}
    />
  );
};

export default SajuInfoContent;
