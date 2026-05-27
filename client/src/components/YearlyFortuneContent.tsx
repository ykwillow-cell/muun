import RelatedServices from "@/components/RelatedServices";

const YearlyFortuneContent = () => {
  return (
    <RelatedServices
      title="신년운세와 함께 보면 좋은 서비스"
      services={[
        {
          href: "/lifelong-saju",
          label: "평생사주",
          description: "올해 운세의 배경이 되는 타고난 기질을 확인해보세요.",
          emoji: "🔮",
        },
        {
          href: "/daily-fortune",
          label: "오늘의 운세",
          description: "연간 흐름 안에서 오늘 하루의 운세도 확인해보세요.",
          emoji: "📅",
        },
        {
          href: "/compatibility",
          label: "궁합",
          description: "올해 인연운과 연결해 궁합도 함께 분석해보세요.",
          emoji: "💞",
        },
        {
          href: "/manselyeok",
          label: "만세력",
          description: "내 사주팔자 원국을 만세력으로 직접 확인해보세요.",
          emoji: "📅",
        },
      ]}
    />
  );
};

export default YearlyFortuneContent;
