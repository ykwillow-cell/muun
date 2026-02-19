/**
 * Tarot API Integration
 * AI 기반 타로 카드 해석
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
    
    // Build card information
    const cardInfo = cards.map((card, idx) => {
      const positions = ["과거", "현재", "미래"];
      return `${positions[idx]}: ${card.korName} (${card.name})`;
    }).join("\n");

    // Call Gemini API for tarot interpretation
    const prompt = `당신은 전문적인 타로 해석가입니다. 다음 정보를 바탕으로 타로 해석을 제공해주세요.

질문: "${question}"

선택된 카드:
${cardInfo}

위 카드들을 바탕으로 질문에 대한 깊이 있는 타로 해석을 한국어로 제공해주세요. 
각 카드의 의미, 위치(과거/현재/미래)의 의미, 그리고 전체적인 메시지를 포함해주세요.
따뜻하고 희망적인 톤으로 작성해주세요.`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const interpretation = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      `당신의 질문: "${question}"\n\n선택된 카드: ${cards.map(c => c.korName).join(", ")}\n\n타로의 메시지를 받아오는 중입니다...`;

    return {
      interpretation
    };
  } catch (error) {
    console.error('Failed to get tarot interpretation:', error);
    
    // Fallback to placeholder if API fails
    const { question, cards } = request;
    const cardNames = cards.map(card => `${card.korName}(${["과거", "현재", "미래"][cards.indexOf(card)]})`)
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
