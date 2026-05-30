/**
 * Tarot API Integration
 * /api/tarot 서버 엔드포인트를 호출하여 AI 기반 해석 데이터를 가져옵니다.
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

export interface TarotCardResult {
  position: string;
  positionMeaning: string;
  cardName: string;
  coreMessage: string;
  detailMessage: string;
  advice: string;
}

export interface TarotStructuredResult {
  summary: string;
  cards: TarotCardResult[];
  synthesis: string;
  keyMessage: string;
  actionItems: string[];
  closingWord: string;
}

export interface TarotInterpretationResponse {
  interpretation: string | null;
  structured: TarotStructuredResult | null;
}

/**
 * 타로 카드 해석을 서버 API를 통해 가져옵니다.
 */
export async function getTarotInterpretation(
  request: TarotInterpretationRequest
): Promise<TarotInterpretationResponse> {
  const response = await fetch('/api/tarot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: request.question,
      cards: request.cards,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(
      `${response.status}: ${errData?.error || response.statusText}`
    );
  }

  const data = await response.json();
  return {
    interpretation: data.interpretation ?? null,
    structured: data.structured ?? null,
  };
}
