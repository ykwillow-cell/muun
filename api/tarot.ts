import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { question, cards } = req.body;

  if (!question || !cards || !Array.isArray(cards) || cards.length < 3) {
    return res.status(400).json({ error: '질문과 3장의 카드 정보가 필요합니다.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });

  const CARD_MEANINGS: Record<string, { upright: string; shadow: string; keywords: string }> = {
    "광대":            { upright: "새로운 시작, 무한한 가능성, 자유로운 도전 정신, 순수한 열정", shadow: "무모함, 준비 없는 도전, 현실 직시 부족", keywords: "시작·자유·모험·잠재력" },
    "마법사":          { upright: "창조력, 자기 주도성, 의지력, 모든 능력을 활용하는 힘", shadow: "능력의 오남용, 자기기만, 과신", keywords: "창조·의지·집중·실현" },
    "고위 여사제":     { upright: "직관, 내면의 지혜, 신비로운 통찰, 잠재의식의 목소리", shadow: "비밀 고수, 감정 억압, 너무 깊은 내면 세계", keywords: "직관·비밀·지혜·내면" },
    "여황제":          { upright: "풍요, 모성애, 창조성, 물질적 번영, 대지의 에너지", shadow: "과보호, 의존성, 물질에 집착", keywords: "풍요·창조·번영·돌봄" },
    "황제":            { upright: "권위, 안정, 체계적 통제, 강한 리더십, 현실 기반 구축", shadow: "독선, 경직성, 지나친 통제욕", keywords: "권위·안정·질서·리더십" },
    "교황":            { upright: "전통, 정신적 지혜, 도덕적 가치, 스승의 가르침", shadow: "규범에 얽매임, 형식주의, 독단", keywords: "전통·지혜·가르침·신앙" },
    "연인":            { upright: "사랑, 중요한 선택, 가치관의 조화, 진정한 결합", shadow: "우유부단, 갈등, 불균형한 관계", keywords: "사랑·선택·조화·결합" },
    "전차":            { upright: "승리, 강한 의지, 추진력, 목표를 향한 돌파", shadow: "무리한 강행, 방향 상실, 오만", keywords: "승리·의지·추진·통제" },
    "힘":              { upright: "내면의 용기, 인내, 부드러운 카리스마로 상황을 이끄는 힘", shadow: "힘의 남용, 억압, 자기 의심", keywords: "용기·인내·자기통제·힘" },
    "은자":            { upright: "내적 탐색, 고독 속의 지혜, 진정한 답을 향한 성찰", shadow: "고립, 지나친 은둔, 사회 단절", keywords: "성찰·고독·지혜·탐색" },
    "운명의 수레바퀴": { upright: "운명적 변화, 새로운 기회, 삶의 순환과 흐름", shadow: "통제 불가한 변화, 예상치 못한 반전", keywords: "변화·기회·순환·운명" },
    "정의":            { upright: "공정함, 균형, 인과응보, 이성적 판단", shadow: "편향된 판단, 냉혹함, 책임 회피", keywords: "공정·균형·판단·진실" },
    "매달린 사람":     { upright: "희생, 새로운 시각, 자발적 기다림과 인내로 얻는 깨달음", shadow: "무기력한 정체, 불필요한 희생", keywords: "인내·희생·시각전환·깨달음" },
    "죽음":            { upright: "변화와 새로운 시작, 낡은 것의 끝, 결정적 전환점", shadow: "변화에 대한 두려움, 과거 집착", keywords: "전환·끝·시작·변화" },
    "절제":            { upright: "조화, 절제, 균형, 두 에너지의 현명한 융합", shadow: "불균형, 극단, 과잉", keywords: "조화·절제·균형·융합" },
    "악마":            { upright: "구속에서 벗어날 인식, 집착과 욕망의 자각", shadow: "집착, 유혹, 자기 구속, 물질 의존", keywords: "집착·구속·욕망·자각" },
    "탑":              { upright: "급격한 변화, 낡은 기초의 붕괴, 이후 새로운 시작", shadow: "예상치 못한 충격, 혼돈, 파괴", keywords: "변화·붕괴·충격·재건" },
    "별":              { upright: "희망, 치유, 영감, 어둠 뒤에 찾아오는 빛", shadow: "희망 상실, 과도한 이상주의", keywords: "희망·치유·영감·빛" },
    "달":              { upright: "직관, 불안, 잠재의식, 신비로운 감정의 흐름", shadow: "혼란, 자기기만, 공포", keywords: "직관·불안·잠재의식·신비" },
    "태양":            { upright: "행복, 성공, 명확함, 활기찬 에너지와 풍요", shadow: "과도한 자신감, 표면적 행복", keywords: "행복·성공·명확·활기" },
    "심판":            { upright: "부활, 해방, 중요한 결단, 과거를 넘어서는 새 출발", shadow: "자기 비판 과잉, 과거에 얽매임", keywords: "심판·부활·해방·결단" },
    "세계":            { upright: "완성, 성취, 통합, 긴 여정의 완벽한 마무리", shadow: "미완성, 방향 상실, 목표 부재", keywords: "완성·성취·통합·완벽" },
    "지팡이 에이스":   { upright: "새로운 열정, 창의적 에너지의 씨앗, 기회의 시작", shadow: "에너지 낭비, 방향 없는 열정", keywords: "시작·열정·창조·기회" },
    "지팡이 여왕":     { upright: "카리스마, 자신감, 활기찬 리더십, 독립적인 에너지", shadow: "지배욕, 충동적 판단, 질투", keywords: "카리스마·자신감·열정·독립" },
    "펜타클 에이스":   { upright: "물질적 기회, 새로운 재물 씨앗, 안정의 출발점", shadow: "물질만능주의, 기회 낭비", keywords: "재물·기회·안정·시작" },
    "펜타클 여왕":     { upright: "현실적 지혜, 풍요로운 돌봄, 안정된 번영", shadow: "과보호, 물질 집착, 불안감", keywords: "풍요·안정·실용·돌봄" },
    "검 에이스":       { upright: "명확한 통찰, 진실의 시작, 새로운 아이디어", shadow: "혼란, 잘못된 판단, 갈등의 씨앗", keywords: "진실·명확·통찰·시작" },
    "컵 에이스":       { upright: "새로운 감정의 시작, 사랑·직관의 씨앗, 풍요로운 감성", shadow: "감정 억압, 차단된 흐름", keywords: "사랑·감정·직관·시작" },
  };

  const positionLabels = ["과거 (뿌리·원인·배경)", "현재 (핵심·장애·조언)", "미래 (결과·가능성·방향)"];

  const cardDetails = cards.map((card: { korName: string; name: string }, i: number) => {
    const meaning = CARD_MEANINGS[card.korName];
    return `카드 ${i + 1} [${positionLabels[i]}]
  카드명: ${card.korName} (${card.name})
  정방향 의미: ${meaning?.upright ?? "새로운 에너지와 전환점을 상징합니다"}
  그림자 의미: ${meaning?.shadow ?? "내면의 두려움과 직면이 필요합니다"}
  핵심 키워드: ${meaning?.keywords ?? "변화·통찰·성장"}`;
  }).join('\n\n');

  const prompt = `당신은 "무운 타로 상담소"의 전문 타로 마스터입니다. 15년 이상의 경력을 가진 상담사로서 라이더-웨이트 덱을 깊이 이해하고 있습니다.

[의뢰인의 질문]
"${question}"

[뽑힌 카드와 포지션]
${cardDetails}

[출력 규칙 — 반드시 준수]
- 응답은 반드시 JSON 객체 하나로만 구성합니다
- 첫 글자는 반드시 { 이고 마지막 글자는 반드시 } 입니다
- \`\`\`json 같은 마크다운 코드블록을 절대 사용하지 않습니다
- JSON 앞뒤로 어떤 설명 문장도 붙이지 않습니다

[출력 형식]
{
  "summary": "의뢰인 질문에 공감하는 도입 (2~3줄, 따뜻하고 신비로운 문체)",
  "cards": [
    {
      "position": "과거",
      "positionMeaning": "이 자리가 묻는 것 (예: 지금 상황의 뿌리, 지나온 흐름)",
      "cardName": "카드 한국명",
      "coreMessage": "이 카드가 이 자리에서 말하는 핵심 (2~3줄, 질문과 직접 연결)",
      "detailMessage": "더 깊은 해석 (4~6줄. 카드 이미지 상징, 질문과의 맥락)",
      "advice": "이 카드가 주는 실천 조언 (1~2줄, 구체적 행동 제안)"
    },
    {
      "position": "현재",
      "positionMeaning": "이 자리가 묻는 것",
      "cardName": "카드 한국명",
      "coreMessage": "핵심 메시지",
      "detailMessage": "더 깊은 해석",
      "advice": "실천 조언"
    },
    {
      "position": "미래",
      "positionMeaning": "이 자리가 묻는 것",
      "cardName": "카드 한국명",
      "coreMessage": "핵심 메시지",
      "detailMessage": "더 깊은 해석",
      "advice": "실천 조언"
    }
  ],
  "synthesis": "3장 카드 흐름을 통합하는 종합 메시지 (5~7줄. 과거→현재→미래 연결, 질문에 대한 직접적인 답 포함)",
  "keyMessage": "오늘 상담의 핵심 한 문장 (30자 이내)",
  "actionItems": ["행동 조언 1", "행동 조언 2", "행동 조언 3"],
  "closingWord": "따뜻하고 희망적인 마무리 (2~3줄)"
}`;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(
      geminiUrl,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.75,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 3000,
          responseMimeType: "application/json",
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 28000,
      }
    );

    if (!response.data?.candidates?.length) {
      throw new Error('AI가 해석을 생성하지 못했습니다.');
    }

    const rawText: string = response.data.candidates[0].content.parts[0].text ?? '';

    // JSON 파싱 — 코드블록 제거 → { } 범위 추출 순으로 시도
    const tryParse = (s: string) => { try { return JSON.parse(s); } catch { return null; } };

    let structured =
      tryParse(rawText) ??
      tryParse(rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()) ??
      tryParse((rawText.match(/\{[\s\S]*\}/) ?? [])[0] ?? '');

    if (structured?.summary && Array.isArray(structured?.cards)) {
      return res.status(200).json({ interpretation: null, structured });
    }

    // 파싱 실패 — raw 텍스트를 그대로 내려서 클라이언트가 재시도 유도
    console.error('[Tarot API] JSON parse failed. raw[:300]:', rawText.slice(0, 300));
    return res.status(200).json({ interpretation: rawText, structured: null });

  } catch (error: any) {
    const status = error.response?.status || 500;
    const detail = error.response?.data || error.message;
    console.error('[Tarot API] Error:', { status, detail });
    return res.status(status).json({
      error: 'AI 해석 생성 중 오류가 발생했습니다.',
      details: typeof detail === 'object' ? JSON.stringify(detail) : detail,
    });
  }
}
