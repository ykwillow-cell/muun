import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, cards } = req.body;

  // 입력 데이터 검증 및 로그
  console.log('[Tarot API] Received Request:', { question, cardsCount: cards?.length });

  if (!question || !cards || !Array.isArray(cards) || cards.length < 3) {
    return res.status(400).json({ 
      error: '필수 데이터가 누락되었습니다.', 
      details: '질문과 3장의 카드 정보가 필요합니다.' 
    });
  }

  // API 키 (환경변수에서 읽기)
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('[Tarot API] API key not found in environment variables');
    return res.status(500).json({ 
      error: 'API 설정 오류',
      details: 'Gemini API 키가 설정되지 않았습니다.'
    });
  }
  
  console.log('[Tarot API] Using API key:', apiKey.substring(0, 10) + '...');

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
    console.log('[Tarot API] Calling Gemini API with key:', apiKey.substring(0, 10) + '...');
    
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    console.log('[Tarot API] Gemini URL:', geminiUrl.substring(0, 80) + '...');
    
    const response = await axios.post(
      geminiUrl,
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
        headers: { 'Content-Type': 'application/json' },
        timeout: 25000 // Vercel 무료 티어 함수 실행 시간 제한(10초)을 고려해야 하지만, 일단 25초 설정 (Vercel 설정에 따라 다름)
      }
    );

    if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
      console.error('[Tarot API] Gemini API returned empty candidates:', JSON.stringify(response.data));
      throw new Error('AI가 해석을 생성하지 못했습니다. 다시 시도해 주세요.');
    }

    const interpretation = response.data.candidates[0].content.parts[0].text;
    console.log('[Tarot API] Success: Interpretation generated');
    
    return res.status(200).json({ interpretation });
  } catch (error: any) {
    const errorStatus = error.response?.status || 500;
    const errorData = error.response?.data || error.message;
    
    console.error('[Tarot API] Error occurred:', {
      status: errorStatus,
      data: errorData
    });

    return res.status(errorStatus).json({ 
      error: 'AI 해석 생성 중 오류가 발생했습니다.',
      details: typeof errorData === 'object' ? JSON.stringify(errorData) : errorData
    });
  }
}
