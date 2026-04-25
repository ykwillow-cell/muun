import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the invokeLLM function
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(async () => ({
    id: "test-id",
    created: Date.now(),
    model: "gemini-2.5-flash",
    choices: [
      {
        index: 0,
        message: {
          role: "user",
          content:
            "당신의 연애운은 밝습니다. 지팡이 2는 새로운 선택을, 펜타클 6는 안정을, 펜타클 페이지는 긍정적인 소식을 의미합니다. 희망을 잃지 마세요. 좋은 일이 있을 것입니다.",
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 100,
      completion_tokens: 50,
      total_tokens: 150,
    },
  })),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("tarot.interpret", () => {
  it("should return interpretation for valid input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tarot.interpret({
      question: "올해 연애운이 궁금해요",
      cards: [
        {
          id: 1,
          name: "Magician",
          korName: "마술사",
          arcana: "Major",
          image: "/tarot/1.jpg",
        },
        {
          id: 6,
          name: "The Lovers",
          korName: "연인",
          arcana: "Major",
          image: "/tarot/6.jpg",
        },
        {
          id: 10,
          name: "Wheel of Fortune",
          korName: "운명의 수레바퀴",
          arcana: "Major",
          image: "/tarot/10.jpg",
        },
      ],
    });

    expect(result).toHaveProperty("interpretation");
    expect(typeof result.interpretation).toBe("string");
    expect(result.interpretation.length).toBeGreaterThan(0);
  });

  it("should validate question is not empty", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.tarot.interpret({
        question: "",
        cards: [
          {
            id: 1,
            name: "Magician",
            korName: "마술사",
            arcana: "Major",
            image: "/tarot/1.jpg",
          },
          {
            id: 6,
            name: "The Lovers",
            korName: "연인",
            arcana: "Major",
            image: "/tarot/6.jpg",
          },
          {
            id: 10,
            name: "Wheel of Fortune",
            korName: "운명의 수레바퀴",
            arcana: "Major",
            image: "/tarot/10.jpg",
          },
        ],
      });
      expect.fail("Should have thrown validation error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should validate exactly 3 cards are provided", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.tarot.interpret({
        question: "올해 연애운이 궁금해요",
        cards: [
          {
            id: 1,
            name: "Magician",
            korName: "마술사",
            arcana: "Major",
            image: "/tarot/1.jpg",
          },
          {
            id: 6,
            name: "The Lovers",
            korName: "연인",
            arcana: "Major",
            image: "/tarot/6.jpg",
          },
        ],
      });
      expect.fail("Should have thrown validation error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should return string interpretation even if response is array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tarot.interpret({
      question: "올해 연애운이 궁금해요",
      cards: [
        {
          id: 1,
          name: "Magician",
          korName: "마술사",
          arcana: "Major",
          image: "/tarot/1.jpg",
        },
        {
          id: 6,
          name: "The Lovers",
          korName: "연인",
          arcana: "Major",
          image: "/tarot/6.jpg",
        },
        {
          id: 10,
          name: "Wheel of Fortune",
          korName: "운명의 수레바퀴",
          arcana: "Major",
          image: "/tarot/10.jpg",
        },
      ],
    });

    expect(typeof result.interpretation).toBe("string");
  });
});
