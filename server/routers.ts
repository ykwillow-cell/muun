import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
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
});

export type AppRouter = typeof appRouter;
