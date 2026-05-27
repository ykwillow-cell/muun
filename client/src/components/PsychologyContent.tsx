import RelatedServices from "@/components/RelatedServices";

const PsychologyContent = () => {
  return (
    <RelatedServices
      title="심리테스트와 함께 보면 좋은 서비스"
      services={[
        {
          href: "/tarot",
          label: "타로",
          description: "오늘의 마음을 타로 카드에게도 물어보세요.",
          emoji: "🃏",
        },
        {
          href: "/lifelong-saju",
          label: "평생사주",
          description: "심리 유형과 타고난 기질을 함께 비교해보세요.",
          emoji: "🔮",
        },
        {
          href: "/compatibility",
          label: "궁합",
          description: "두 사람의 심리적 궁합도 함께 확인해보세요.",
          emoji: "💞",
        },
        {
          href: "/dream",
          label: "꿈해몽",
          description: "내면의 이야기를 꿈해몽으로도 탐색해보세요.",
          emoji: "🌙",
        },
      ]}
    />
  );
};

export default PsychologyContent;
