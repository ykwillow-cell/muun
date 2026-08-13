import { beforeEach, describe, expect, it } from "vitest";
import { applyPublicApiSecurity, clearRateLimitStoreForTests, readLimitedJsonBody } from "../api/_security";

function responseStub() {
  const headers = new Map<string, string>();
  let statusCode = 0;
  let body: unknown;
  return {
    headers,
    get statusCode() {
      return statusCode;
    },
    get body() {
      return body;
    },
    setHeader(name: string, value: string | number) {
      headers.set(name, String(value));
    },
    status(code: number) {
      statusCode = code;
      return {
        json(value: unknown) {
          body = value;
        },
        end() {
          body = null;
        },
      };
    },
  };
}

describe("public AI API security", () => {
  beforeEach(() => clearRateLimitStoreForTests());

  it("rejects an unapproved browser origin", () => {
    const res = responseStub();
    const allowed = applyPublicApiSecurity({ method: "POST", headers: { origin: "https://attacker.example" } }, res, "tarot");
    expect(allowed).toBe(false);
    expect(res.statusCode).toBe(403);
  });

  it("allows the production origin and caps tarot requests", () => {
    for (let index = 0; index < 8; index += 1) {
      const res = responseStub();
      expect(
        applyPublicApiSecurity(
          { method: "POST", headers: { origin: "https://muunsaju.com", "x-forwarded-for": "203.0.113.10" } },
          res,
          "tarot",
        ),
      ).toBe(true);
    }

    const blocked = responseStub();
    expect(
      applyPublicApiSecurity(
        { method: "POST", headers: { origin: "https://muunsaju.com", "x-forwarded-for": "203.0.113.10" } },
        blocked,
        "tarot",
      ),
    ).toBe(false);
    expect(blocked.statusCode).toBe(429);
  });

  it("rejects oversized request bodies", () => {
    expect(readLimitedJsonBody({ value: "a".repeat(1024) }, 100)).toBeNull();
  });
});
