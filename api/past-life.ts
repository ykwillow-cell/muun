import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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

  const { birthYear, birthMonth, birthDay, gender } = req.body;

  if (!birthYear || !birthMonth || !birthDay) {
    return res.status(400).json({ error: '생년월일을 모두 입력해주세요.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[PastLife API] GEMINI_API_KEY not set');
    return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
  }

  const genderLabel =
    gender === 'male' ? '남성' : gender === 'female' ? '여성' : '미상';

  const prompt = `당신은 동양 사주와 전생 철학에 정통한 신비로운 영매사입니다.
아래 생년월일을 바탕으로 이 사람의 전생을 생생하게 묘사해주세요.

생년월일: ${birthYear}년 ${birthMonth}월 ${birthDay}일
성별: ${genderLabel}

다음 JSON 형식으로 정확하게 응답해주세요. JSON 외의 다른 텍스트는 절대 포함하지 마세요:

{
  "era": "구체적인 시대와 연도 (예: 고려 말기, 1380년대)",
  "country": "나라 또는 지역 (예: 고려, 당나라, 일본 에도, 유럽 중세 프랑스 등 다양하게)",
  "identity": "전생의 신분과 직업 (예: 고려의 무관, 당나라 시인, 조선의 의녀 등)",
  "name": "전생의 이름 (해당 시대와 나라에 어울리는 이름)",
  "trait": "전생 성격의 핵심 특징 한 줄 (20자 이내)",
  "story": "전생의 삶 이야기 (3~4문장, 구체적이고 생생하게, 감동적으로)",
  "lesson": "전생에서 이번 생으로 가져온 교훈이나 사명 (2문장)",
  "karma": "전생의 인연이 현생에 미치는 영향 (2문장, 긍정적으로)",
  "element": "전생의 지배 오행 (목/화/토/금/수 중 하나)",
  "elementColor": "오행에 맞는 tailwind 텍스트 색상 클래스 (목=text-green-400, 화=text-red-400, 토=text-yellow-400, 금=text-gray-300, 수=text-blue-400 중 하나)"
}

생년월일의 숫자들을 수비학적으로 분석하여 전생의 시대와 특성을 결정하세요.
매번 다양하고 흥미로운 전생을 만들어주세요. 한국, 중국, 일본, 유럽, 중동 등 다양한 배경을 활용하세요.`;

  try {
    // v1 엔드포인트와 정적 모델명 사용
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          response_mime_type: "application/json"
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[PastLife API] Gemini error:', response.status, errText);
      
      // 404 에러인 경우 v1beta로 재시도 로직 (Fallback)
      if (response.status === 404) {
        const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const fallbackResponse = await fetch(fallbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.9,
              response_mime_type: "application/json"
            },
          }),
        });
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
          return res.status(200).json(JSON.parse(rawText));
        }
      }

      if (response.status === 429) {
        return res.status(429).json({ error: '현재 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' });
      }
      return res.status(response.status).json({ error: `Gemini API 오류 (${response.status}): 서비스 지역 제한 또는 일시적 오류일 수 있습니다.` });
    }

    const data = await response.json();
    const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!rawText) {
      return res.status(500).json({ error: '전생 데이터를 받을 수 없습니다.' });
    }

    // JSON 모드이므로 바로 파싱 시도
    let result;
    try {
      result = JSON.parse(rawText);
    } catch {
      // 혹시 모를 마크다운 코드블록 제거 후 재시도
      const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleanJson);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[PastLife API] Unexpected error:', error);
    return res.status(500).json({ error: '전생 탐색 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
  }
}
