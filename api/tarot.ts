import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, cards } = req.body;

  if (!question || !cards || !Array.isArray(cards)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    return res.status(500).json({ error: 'API key not configured' });
  }

  const prompt = `
당신은 "신비롭고 다정한 전문 타로 상담사"입니다. 
사용자의 고민에 대해 뽑힌 3장의 타로 카드를 바탕으로 깊이 있고 따뜻한 해석을 제공해 주세요.

[사용자 질문]
${question}

[선택된 카드]
1. ${cards[0].korName} (${cards[0].name})
2. ${cards[1].korName} (${cards[1].name})
3. ${cards[2].korName} (${cards[2].name})

[해석 가이드]
- 첫 번째 카드는 현재 상황이나 질문의 배경을 나타냅니다.
- 두 번째 카드는 장애물이나 조언, 또는 진행 과정을 나타냅니다.
- 세 번째 카드는 결과나 미래의 가능성을 나타냅니다.
- 말투는 신비로우면서도 다정하게, 전문 상담사처럼 작성해 주세요.
- 가독성을 위해 적절한 문단 나누기와 강조를 사용해 주세요.
- 마지막에는 사용자를 응원하는 따뜻한 한마디를 덧붙여 주세요.
- 결과는 마크다운 형식이 포함된 일반 텍스트로 답변해 주세요.
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error.message || 'Gemini API Error');
    }

    const interpretation = response.data.candidates[0].content.parts[0].text;
    return res.status(200).json({ interpretation });
  } catch (error: any) {
    console.error('Tarot API Error:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'AI 해석을 생성하는 중 오류가 발생했습니다.',
      details: error.response?.data?.error?.message || error.message 
    });
  }
}
