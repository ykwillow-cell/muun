import { z } from "zod";
import { applyPublicApiSecurity, fetchWithTimeout, readLimitedJsonBody } from "./_security";

const currentYear = new Date().getUTCFullYear();

const pastLifeRequestSchema = z
  .object({
    birthYear: z.coerce.number().int().min(1900).max(currentYear),
    birthMonth: z.coerce.number().int().min(1).max(12),
    birthDay: z.coerce.number().int().min(1).max(31),
    gender: z.enum(["male", "female"]).optional(),
  })
  .strict()
  .superRefine(({ birthYear, birthMonth, birthDay }, ctx) => {
    const date = new Date(Date.UTC(birthYear, birthMonth - 1, birthDay));
    if (date.getUTCFullYear() !== birthYear || date.getUTCMonth() !== birthMonth - 1 || date.getUTCDate() !== birthDay) {
      ctx.addIssue({ code: "custom", path: ["birthDay"], message: "올바른 생년월일을 입력해주세요." });
    }
  });

const pastLifeResponseSchema = z
  .object({
    era: z.string().max(100),
    country: z.string().max(100),
    identity: z.string().max(150),
    name: z.string().max(100),
    trait: z.string().max(100),
    story: z.string().max(1_500),
    lesson: z.string().max(1_000),
    karma: z.string().max(1_000),
    element: z.enum(["목", "화", "토", "금", "수"]),
    elementColor: z.enum(["text-green-400", "text-red-400", "text-yellow-400", "text-gray-300", "text-blue-400"]),
  })
  .strict();

function parseGeminiJson(data: unknown) {
  const candidate = (data as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })
    ?.candidates?.[0];
  const rawText = candidate?.content?.parts?.[0]?.text;
  if (typeof rawText !== "string" || !rawText.trim()) return null;

  try {
    const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return pastLifeResponseSchema.safeParse(JSON.parse(cleaned));
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!applyPublicApiSecurity(req, res, "pastLife")) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = readLimitedJsonBody<unknown>(req.body);
  if (!rawBody) {
    return res.status(413).json({ error: "요청 본문이 너무 크거나 올바른 JSON 형식이 아닙니다." });
  }

  const parsed = pastLifeRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return res.status(400).json({ error: "잘못된 요청입니다.", details: parsed.error.issues[0]?.message });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[PastLife API] Gemini API key is not configured");
    return res.status(503).json({ error: "전생 탐색 서비스를 현재 사용할 수 없습니다." });
  }

  const { birthYear, birthMonth, birthDay, gender } = parsed.data;
  const genderLabel = gender === "male" ? "남성" : gender === "female" ? "여성" : "미상";
  const prompt = `당신은 동양 사주와 전생 철학에 정통한 신비로운 영매사입니다. 아래 생년월일을 바탕으로 이 사람의 전생을 생생하게 묘사해주세요.

생년월일: ${birthYear}년 ${birthMonth}월 ${birthDay}일
성별: ${genderLabel}

아래 JSON 형식만 반환하세요.
{
  "era":"구체적인 시대와 연도",
  "country":"나라 또는 지역",
  "identity":"전생의 신분과 직업",
  "name":"전생의 이름",
  "trait":"핵심 특징 한 줄",
  "story":"전생의 삶 이야기",
  "lesson":"이번 생으로 가져온 교훈이나 사명",
  "karma":"현생에 미치는 긍정적 영향",
  "element":"목/화/토/금/수 중 하나",
  "elementColor":"text-green-400/text-red-400/text-yellow-400/text-gray-300/text-blue-400 중 하나"
}`;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
    const response = await fetchWithTimeout(
      geminiUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, response_mime_type: "application/json", maxOutputTokens: 900 },
        }),
      },
      12_000,
    );

    if (!response.ok) {
      console.error("[PastLife API] Gemini request failed", { status: response.status });
      return res.status(502).json({ error: "전생 탐색에 실패했습니다. 잠시 후 다시 시도해주세요." });
    }

    const responseData = parseGeminiJson(await response.json());
    if (!responseData?.success) {
      console.error("[PastLife API] Gemini returned invalid structured output");
      return res.status(502).json({ error: "전생 탐색 결과를 생성하지 못했습니다. 잠시 후 다시 시도해주세요." });
    }

    return res.status(200).json(responseData.data);
  } catch (error) {
    console.error("[PastLife API] Unexpected Gemini invocation failure", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return res.status(502).json({ error: "전생 탐색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
  }
}
