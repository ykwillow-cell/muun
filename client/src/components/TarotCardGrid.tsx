import { motion } from "framer-motion";

interface TarotCard {
  id: number;
  name: string;
  korName: string;
  arcana: string;
  image: string;
}

interface TarotCardGridProps {
  cards: TarotCard[];
  selectedCards: TarotCard[];
  onSelectCard: (card: TarotCard) => void;
  maxSelections?: number;
  disabled?: boolean;
}

/**
 * 극소형 타로 카드 그리드 컴포넌트
 * - 3줄 가로 스크롤 레이아웃
 * - 초소형 카드 (50px x 75px)
 * - 78장 전량 노출
 * - 모바일 한 화면 내 유지
 */
export default function TarotCardGrid({
  cards,
  selectedCards,
  onSelectCard,
  maxSelections = 3,
  disabled = false,
}: TarotCardGridProps) {
  if (!cards || cards.length === 0) {
    return <div className="text-center text-muted-foreground py-4">카드를 불러오는 중...</div>;
  }

  const isCardSelected = (cardId: number) => {
    return selectedCards.some((c) => c.id === cardId);
  };

  const canSelectMore = selectedCards.length < maxSelections;

  return (
    <div className="relative w-full overflow-hidden">
      {/* 3줄 가로 스크롤 그리드 - 극소형 카드 */}
      <div
        className="grid gap-1 overflow-x-auto overflow-y-hidden pb-2"
        style={{
          gridTemplateRows: "repeat(3, minmax(75px, 1fr))",
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(50px, auto)",
          height: "calc(3 * 75px + 2 * 4px)", // 3줄 높이 + 간격
          touchAction: "pan-x",
          scrollBehavior: "smooth",
        }}
      >
        {cards.map((card, index) => {
          const isSelected = isCardSelected(card.id);
          const canSelect = canSelectMore || isSelected;

          return (
            <motion.button
              key={`${card.id}-${index}`}
              onClick={() => {
                if (!disabled && canSelect && !isSelected) {
                  onSelectCard(card);
                }
              }}
              disabled={disabled || (!canSelect && !isSelected)}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: Math.min(index * 0.01, 0.3), // 최대 0.3초
                duration: 0.2,
              }}
              whileHover={!disabled && (canSelect || isSelected) ? { scale: 1.1, zIndex: 50 } : {}}
              whileTap={!disabled && (canSelect || isSelected) ? { scale: 0.9 } : {}}
              className={`
                relative rounded-md overflow-hidden transition-all duration-150 flex-shrink-0
                ${isSelected ? "ring-2 ring-primary shadow-md shadow-primary/50" : "ring-1 ring-white/10"}
                ${!disabled && (canSelect || isSelected) ? "cursor-pointer hover:ring-primary/60" : "cursor-not-allowed"}
                ${disabled || (!canSelect && !isSelected) ? "opacity-40" : ""}
              `}
              style={{
                width: "50px",
                height: "75px",
              }}
            >
              {/* 카드 이미지 */}
              <img
                src={card.image}
                alt={card.korName}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // 이미지 로드 실패 시 대체 텍스트
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />

              {/* 선택 표시 */}
              {isSelected && (
                <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                  <div className="text-white font-bold text-xs">✓</div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 스크롤 힌트 (모바일) */}
      <div className="md:hidden absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
        <div className="animate-pulse text-primary text-xs font-bold">→</div>
      </div>
    </div>
  );
}
