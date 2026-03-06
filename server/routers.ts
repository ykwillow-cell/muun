import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { ENV } from "./_core/env";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  tarot: router({
    interpret: publicProcedure
      .input(
        z.object({
          question: z.string().min(1),
          cards: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              korName: z.string(),
              arcana: z.string(),
              image: z.string(),
            })
          ).length(3),
        })
      )
      .mutation(async ({ input }) => {
        const { question, cards } = input;

        // Build card names for the prompt
        const cardNames = cards.map((c) => `${c.korName}(${c.arcana})`).join(", ");

        const prompt = `당신은 전문 타로 카드 해석가입니다. 사용자의 질문에 대해 3장의 타로 카드를 통해 따뜻하고 희망적인 해석을 제공하세요.

사용자 질문: "${question}"

선택된 카드:
1번 카드: ${cards[0].korName} (${cards[0].arcana})
2번 카드: ${cards[1].korName} (${cards[1].arcana})
3번 카드: ${cards[2].korName} (${cards[2].arcana})

각 카드의 의미를 설명하고, 이 3장의 카드가 사용자의 질문에 어떤 메시지를 전하는지 따뜻하고 희망적으로 해석해주세요. 5-7문장 정도로 작성하되, 마지막에는 긍정적인 메시지로 마무리하세요.`;

        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "당신은 전문 타로 카드 해석가입니다. 따뜻하고 희망적인 해석을 제공합니다.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          });

          const interpretation =
            response.choices[0]?.message?.content || "해석을 생성할 수 없습니다.";

          return {
            interpretation:
              typeof interpretation === "string"
                ? interpretation
                : JSON.stringify(interpretation),
          };
        } catch (error) {
          console.error("Tarot interpretation error:", error);
          throw new Error(
            `타로 해석 생성 실패: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }),
  }),

  pastLife: router({
    reveal: publicProcedure
      .input(
        z.object({
          birthYear: z.number().int().min(1900).max(2025),
          birthMonth: z.number().int().min(1).max(12),
          birthDay: z.number().int().min(1).max(31),
          gender: z.enum(["male", "female", "unknown"]),
        })
      )
      .mutation(async ({ input }) => {
        const { birthYear, birthMonth, birthDay, gender } = input;

        const geminiApiKey = ENV.geminiApiKey;
        if (!geminiApiKey) {
          throw new Error("Gemini API 키가 설정되지 않았습니다.");
        }

        const genderLabel =
          gender === "male" ? "남성" : gender === "female" ? "여성" : "미상";

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

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

        const geminiResponse = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.9,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        });

        if (!geminiResponse.ok) {
          const errText = await geminiResponse.text();
          if (geminiResponse.status === 429) {
            throw new Error("429: API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
          }
          throw new Error(`Gemini API 오류: ${geminiResponse.status} - ${errText}`);
        }

        const geminiData = await geminiResponse.json();
        const rawText: string =
          geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

        if (!rawText) {
          throw new Error("전생 데이터를 받을 수 없습니다.");
        }

        // 마크다운 코드블록 제거 후 JSON 파싱
        const jsonStr = rawText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        let result: {
          era: string;
          country: string;
          identity: string;
          name: string;
          trait: string;
          story: string;
          lesson: string;
          karma: string;
          element: string;
          elementColor: string;
        };

        try {
          result = JSON.parse(jsonStr);
        } catch {
          throw new Error("전생 응답 파싱에 실패했습니다. 다시 시도해주세요.");
        }

        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
