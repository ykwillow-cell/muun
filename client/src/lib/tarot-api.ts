/**
 * Tarot API Integration
 * 비-AI 기반 타로 카드 해석 - 로컬 데이터 활용
 */
import tarotMeanings from './tarot-meanings.json';

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

/**
 * 타로 카드 해석을 가져옵니다.
 * 이제 AI API를 호출하지 않고 로컬의 고정된 해석 데이터를 조합하여 반환합니다.
 */
export async function getTarotInterpretation(
  request: TarotInterpretationRequest
): Promise<TarotInterpretationResponse> {
  // 인위적인 지연 시간을 주어 '해석 중'인 느낌을 줍니다.
  await new Promise(resolve => setTimeout(resolve, 1500));

  const { cards } = request;
  
  const positions = ["과거 (또는 원인)", "현재 (또는 상황)", "미래 (또는 결과)"];
  
  let fullInterpretation = "당신의 고민에 대해 타로 카드가 전하는 메시지입니다.\n\n";
  
  cards.forEach((card, index) => {
    const meaning = (tarotMeanings as Record<string, string>)[card.id.toString()] || "이 카드의 신비로운 의미를 읽어내는 중입니다.";
    fullInterpretation += `### ${index + 1}. ${positions[index]}: ${card.korName}\n${meaning}\n\n`;
  });
  
  fullInterpretation += "---\n\n**조언:** 선택하신 세 장의 카드는 당신의 상황이 변화의 흐름 속에 있음을 보여줍니다. 카드의 메시지를 마음속에 새기며 긍정적인 마음으로 나아가신다면 분명 좋은 결과가 있으실 거예요. 당신의 앞날을 응원합니다!";

  return {
    interpretation: fullInterpretation
  };
}

/**
 * 구 버전 호환성을 위한 함수
 */
export async function generateTarotReading(
  cardIds: number[],
  question: string
): Promise<string> {
  const dummyCards = cardIds.map(id => ({ id, name: "", korName: "", arcana: "", image: "" }));
  const res = await getTarotInterpretation({ question, cards: dummyCards as any });
  return res.interpretation;
}
