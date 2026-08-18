import { z } from "zod";
import { applyPublicApiSecurity, fetchWithTimeout, readLimitedJsonBody } from "./_security.js";

const tarotRequestSchema = z
  .object({
    question: z.string().trim().min(1, "질문을 입력해주세요.").max(800, "질문은 800자 이하여야 합니다."),
    cards: z
      .array(
        z
          .object({
            id: z.number().int().nonnegative(),
            name: z.string().trim().min(1).max(100),
            korName: z.string().trim().min(1).max(100),
          })
          .strict(),
      )
      .length(3, "타로 카드는 정확히 3장이어야 합니다."),
  })
  .strict();

function extractGeminiText(data: unknown): string | null {
  const candidate = (data as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })
    ?.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;
  return typeof text === "string" && text.trim() ? text.trim() : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!applyPublicApiSecurity(req, res, "tarot")) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = readLimitedJsonBody<unknown>(req.body);
  if (!rawBody) {
    return res.status(413).json({ error: "요청 본문이 너무 크거나 올바른 JSON 형식이 아닙니다." });
  }

  const parsed = tarotRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return res.status(400).json({ error: "잘못된 요청입니다.", details: parsed.error.issues[0]?.message });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[Tarot API] Gemini API key is not configured");
    return res.status(503).json({ error: "AI 해석 서비스를 현재 사용할 수 없습니다." });
  }

  const { question, cards } = parsed.data;
  const prompt = `당신은 신비롭고 다정한 전문 타로 상담사입니다. 사용자의 고민에 대해 뽑힌 3장의 타로 카드를 바탕으로 깊이 있고 따뜻한 해석을 제공해주세요.

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
- 가독성을 위해 문단을 나누고 마지막에는 따뜻한 응원을 덧붙입니다.
- 결과는 마크다운을 포함한 일반 텍스트로 작성합니다.`;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
    const response = await fetchWithTimeout(
      geminiUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      },
      12_000,
    );

    if (!response.ok) {
      console.error("[Tarot API] Gemini request failed", { status: response.status });
      return res.status(502).json({ error: "AI 해석 생성에 실패했습니다. 잠시 후 다시 시도해주세요." });
    }

    const interpretation = extractGeminiText(await response.json());
    if (!interpretation) {
      console.error("[Tarot API] Gemini returned no usable text");
      return res.status(502).json({ error: "AI 해석을 생성하지 못했습니다. 잠시 후 다시 시도해주세요." });
    }

    return res.status(200).json({ interpretation });
  } catch (error) {
    console.error("[Tarot API] Unexpected Gemini invocation failure", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return res.status(502).json({ error: "AI 해석 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
  }
}
