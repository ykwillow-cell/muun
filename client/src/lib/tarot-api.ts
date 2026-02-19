/**
 * Tarot API Integration
 * AI 기반 타로 카드 해석 - tRPC API 호출
 */

interface TarotCard {
  id: number;
  name: string;
  korName: string;
  arcana: string;
  image: string;
}

interface TarotInterpretationRequest {
  question: string;
  cards: TarotCard[];
}

interface TarotInterpretationResponse {
  interpretation: string;
}

export async function getTarotInterpretation(
  request: TarotInterpretationRequest
): Promise<TarotInterpretationResponse> {
  try {
    const { question, cards } = request;
    
    // Call backend tRPC API with correct format
    const response = await fetch("/api/trpc/tarot.interpret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        cards: cards.map(card => ({
          id: card.id,
          name: card.name,
          korName: card.korName,
          arcana: card.arcana,
          image: card.image,
        }))
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle tRPC response format
    if (data.result && data.result.data) {
      return {
        interpretation: data.result.data.interpretation
      };
    }
    
    // Handle direct response
    if (data.interpretation) {
      return {
        interpretation: data.interpretation
      };
    }

    throw new Error("Invalid response format from API");
  } catch (error) {
    console.error('Failed to get tarot interpretation:', error);
    
    // Fallback to placeholder if API fails
    const { question, cards } = request;
    const cardNames = cards.map((card, idx) => `${card.korName}(${["과거", "현재", "미래"][idx]})`)
      .join(", ");
    
    return {
      interpretation: `당신의 질문: "${question}"\n\n선택된 카드: ${cardNames}\n\n타로의 메시지를 받아오는 중입니다...`
    };
  }
}

export async function generateTarotReading(
  cardIds: number[],
  question: string
): Promise<string> {
  try {
    // TODO: Implement actual AI API call
    // For now, return a placeholder
    return `타로 리딩 결과: ${question}`;
  } catch (error) {
    console.error('Failed to generate tarot reading:', error);
    throw error;
  }
}
