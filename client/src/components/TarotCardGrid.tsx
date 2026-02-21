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
 * 타로 카드 그리드 컴포넌트
 * - PC: 전체 카드를 한 화면에 보이도록 자동 조정
 * - 모바일: 3줄 배치 + 카드 겹침 효과
 * - 선택 전: 타로카드 뒷면 무늬
 * - 선택 후: 카드 앞면(이미지)
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

  // PC에서는 카드를 3줄로 분배, 모바일에서도 동일
  const cardsPerRow = Math.ceil(cards.length / 3);
  const rows = [
    cards.slice(0, cardsPerRow),
    cards.slice(cardsPerRow, cardsPerRow * 2),
    cards.slice(cardsPerRow * 2),
  ];

  return (
    <div className="relative w-full space-y-2 md:space-y-3">
      {/* 3줄 배치 */}
      {rows.map((rowCards, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex items-center justify-center md:justify-start gap-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0"
          style={{
            marginLeft: "-8px",
            marginRight: "-8px",
          }}
        >
          {/* 각 줄의 카드들 - 겹침 효과 */}
          {rowCards.map((card, colIndex) => {
            const isSelected = isCardSelected(card.id);
            const canSelect = canSelectMore || isSelected;
            const globalIndex = rowIndex * cardsPerRow + colIndex;

            // PC에서는 카드 크기를 동적으로 조정
            const cardWidth = typeof window !== "undefined" && window.innerWidth >= 768 
              ? Math.max(32, Math.min(48, (window.innerWidth - 100) / cardsPerRow * 0.4))
              : 48;
            const cardHeight = cardWidth * 1.5;

            return (
              <motion.button
                key={`${card.id}-${rowIndex}-${colIndex}`}
                onClick={() => {
                  if (!disabled && canSelect && !isSelected) {
                    onSelectCard(card);
                  }
                }}
                disabled={disabled || (!canSelect && !isSelected)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: Math.min(globalIndex * 0.008, 0.2),
                  duration: 0.3,
                }}
                whileHover={!disabled && (canSelect || isSelected) ? { scale: 1.08, zIndex: 50 } : {}}
                whileTap={!disabled && (canSelect || isSelected) ? { scale: 0.95 } : {}}
                className={`
                  relative rounded-md overflow-hidden transition-all duration-150 flex-shrink-0
                  ${isSelected ? "ring-2 ring-primary shadow-lg shadow-primary/50" : ""}
                  ${!disabled && (canSelect || isSelected) ? "cursor-pointer" : "cursor-not-allowed"}
                  ${disabled || (!canSelect && !isSelected) ? "opacity-60" : ""}
                `}
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  marginLeft: colIndex === 0 ? "8px" : "-16px",
                  marginRight: "0px",
                  zIndex: isSelected ? 100 : colIndex,
                }}
              >
                {isSelected ? (
                  /* 선택된 카드 - 앞면 이미지 */
                  <img
                    src={card.image}
                    alt={card.korName}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* 선택되지 않은 카드 - 뒷면 무늬 */
                  <div className="w-full h-full bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 border border-amber-700 relative overflow-hidden flex items-center justify-center">
                    {/* 타로카드 뒷면 무늬 */}
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="xMidYMid slice"
                    >
                      <defs>
                        {/* 동심원 패턴 */}
                        <pattern
                          id={`tarot-back-${card.id}`}
                          x="0"
                          y="0"
                          width="50"
                          height="50"
                          patternUnits="userSpaceOnUse"
                        >
                          {/* 배경 */}
                          <rect width="50" height="50" fill="#78350f" />

                          {/* 중앙 다이아몬드 */}
                          <circle cx="25" cy="25" r="12" fill="none" stroke="#fbbf24" strokeWidth="1" />
                          <circle cx="25" cy="25" r="8" fill="none" stroke="#fcd34d" strokeWidth="0.8" />
                          <circle cx="25" cy="25" r="4" fill="none" stroke="#fbbf24" strokeWidth="0.6" />
                          <circle cx="25" cy="25" r="2" fill="#fcd34d" />

                          {/* 코너 장식 */}
                          <circle cx="8" cy="8" r="1.5" fill="#fbbf24" />
                          <circle cx="42" cy="8" r="1.5" fill="#fbbf24" />
                          <circle cx="8" cy="42" r="1.5" fill="#fbbf24" />
                          <circle cx="42" cy="42" r="1.5" fill="#fbbf24" />

                          {/* 십자 선 */}
                          <line x1="25" y1="5" x2="25" y2="45" stroke="#fbbf24" strokeWidth="0.4" opacity="0.5" />
                          <line x1="5" y1="25" x2="45" y2="25" stroke="#fbbf24" strokeWidth="0.4" opacity="0.5" />

                          {/* 대각선 */}
                          <line x1="10" y1="10" x2="40" y2="40" stroke="#fbbf24" strokeWidth="0.3" opacity="0.3" />
                          <line x1="40" y1="10" x2="10" y2="40" stroke="#fbbf24" strokeWidth="0.3" opacity="0.3" />
                        </pattern>
                      </defs>

                      {/* 패턴 적용 */}
                      <rect width="100" height="100" fill={`url(#tarot-back-${card.id})`} />

                      {/* 테두리 강조 */}
                      <rect
                        x="5"
                        y="5"
                        width="90"
                        height="90"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="1.5"
                        opacity="0.6"
                      />
                    </svg>

                    {/* 중앙 별 장식 */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-amber-300 text-xs font-bold opacity-70">✦</div>
                    </div>
                  </div>
                )}

                {/* 선택 표시 (체크마크) */}
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="text-white font-bold text-xs">✓</div>
                  </div>
                )}

                {/* 호버 오버레이 */}
                {!disabled && (canSelect || isSelected) && !isSelected && (
                  <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors" />
                )}
              </motion.button>
            );
          })}
        </div>
      ))}

      {/* 선택 안내 텍스트 */}
      <div className="text-center text-xs text-muted-foreground mt-3">
        가장 마음이 끌리는 카드를 순서대로 {selectedCards.length}/3 선택
      </div>
    </div>
  );
}
