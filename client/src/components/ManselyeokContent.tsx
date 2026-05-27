import RelatedServices from "@/components/RelatedServices";

const ManselyeokContent = () => {
  return (
    <RelatedServices
      title="만세력과 함께 보면 좋은 서비스"
      services={[
        {
          href: "/lifelong-saju",
          label: "평생사주",
          description: "만세력으로 확인한 사주를 풀이로 연결해보세요.",
          emoji: "🔮",
        },
        {
          href: "/yearly-fortune",
          label: "신년운세",
          description: "올해의 세운이 내 사주에 어떤 영향을 미치는지 확인하세요.",
          emoji: "📆",
        },
        {
          href: "/compatibility",
          label: "궁합",
          description: "두 사람의 사주를 기반으로 궁합을 분석해보세요.",
          emoji: "💞",
        },
        {
          href: "/fortune-dictionary",
          label: "운세 사전",
          description: "천간·지지·십신 등 만세력 용어를 사전에서 찾아보세요.",
          emoji: "📖",
        },
      ]}
    />
  );
};

export default ManselyeokContent;
