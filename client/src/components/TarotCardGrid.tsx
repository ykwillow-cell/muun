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
 * 최적화된 타로 카드 그리드 컴포넌트
 * - 3줄 가로 스크롤 레이아웃
 * - 모바일 한 화면 내 유지
 * - WebP 초경량 이미지
 * - 카드 겹침 효과
 */
export default function TarotCardGrid({
  cards,
  selectedCards,
  onSelectCard,
  maxSelections = 3,
  disabled = false,
}: TarotCardGridProps) {
  const isCardSelected = (cardId: number) => {
    return selectedCards.some((c) => c.id === cardId);
  };

  const canSelectMore = selectedCards.length < maxSelections;

  return (
    <div className="relative w-full overflow-hidden">
      {/* 3줄 가로 스크롤 그리드 */}
      <div
        className="grid gap-2 overflow-x-auto pb-4"
        style={{
          gridTemplateRows: "repeat(3, 1fr)",
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(90px, auto)",
          height: "calc(3 * (120px + 8px))", // 3줄 높이 + 간격
          touchAction: "pan-x",
        }}
      >
        {cards.map((card, index) => {
          const isSelected = isCardSelected(card.id);
          const canSelect = canSelectMore || isSelected;

          return (
            <motion.button
              key={card.id}
              onClick={() => {
                if (!disabled && canSelect && !isSelected) {
                  onSelectCard(card);
                }
              }}
              disabled={disabled || (!canSelect && !isSelected)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.02, // 순차 애니메이션
                duration: 0.3,
              }}
              whileHover={!disabled && (canSelect || isSelected) ? { scale: 1.05 } : {}}
              whileTap={!disabled && (canSelect || isSelected) ? { scale: 0.95 } : {}}
              className={`
                relative rounded-lg overflow-hidden transition-all duration-200
                ${isSelected ? "ring-2 ring-primary shadow-lg shadow-primary/50" : ""}
                ${!disabled && (canSelect || isSelected) ? "cursor-pointer" : "cursor-not-allowed"}
                ${disabled || (!canSelect && !isSelected) ? "opacity-50" : ""}
              `}
            >
              {/* 카드 이미지 - WebP 초경량 */}
              <img
                src={card.image}
                alt={card.korName}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                style={{
                  aspectRatio: "2 / 3",
                }}
              />

              {/* 선택 표시 */}
              {isSelected && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="text-white font-bold text-lg">✓</div>
                </div>
              )}

              {/* 호버 오버레이 */}
              {!disabled && (canSelect || isSelected) && (
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 스크롤 힌트 (모바일) */}
      <div className="md:hidden absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <div className="animate-pulse text-muted-foreground text-xs pr-2">→</div>
      </div>
    </div>
  );
}
