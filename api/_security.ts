type HeaderValue = string | string[] | undefined;

type RequestLike = {
  headers: Record<string, HeaderValue>;
  method?: string;
  socket?: { remoteAddress?: string };
};

type ResponseLike = {
  setHeader(name: string, value: string | number): void;
  status(code: number): { json(body: unknown): unknown; end(): unknown };
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const LIMITS = {
  tarot: 8,
  pastLife: 5,
} as const;

const rateLimitStore = new Map<string, RateLimitEntry>();

function headerValue(value: HeaderValue): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getClientIp(req: RequestLike): string {
  const forwarded = headerValue(req.headers["x-forwarded-for"])
    .split(",")[0]
    ?.trim();
  return forwarded || headerValue(req.headers["x-real-ip"]) || req.socket?.remoteAddress || "unknown";
}

function allowedOrigins(): Set<string> {
  const configured = (process.env.MUUN_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set([
    "https://muunsaju.com",
    "https://www.muunsaju.com",
    "https://muunsaju.vercel.app",
    ...configured,
  ]);
}

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return true;
  if (allowedOrigins().has(origin)) return true;
  return process.env.NODE_ENV !== "production" && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function consumeRateLimit(endpoint: keyof typeof LIMITS, clientIp: string) {
  const now = Date.now();
  const key = `${endpoint}:${clientIp}`;
  const current = rateLimitStore.get(key);
  const limit = LIMITS[endpoint];

  if (!current || current.resetAt <= now) {
    const entry = { count: 1, resetAt: now + WINDOW_MS };
    rateLimitStore.set(key, entry);
    return { allowed: true, limit, remaining: limit - 1, resetAt: entry.resetAt };
  }

  if (current.count >= limit) {
    return { allowed: false, limit, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  return { allowed: true, limit, remaining: limit - current.count, resetAt: current.resetAt };
}

export function applyPublicApiSecurity(
  req: RequestLike,
  res: ResponseLike,
  endpoint: keyof typeof LIMITS,
): boolean {
  const origin = headerValue(req.headers.origin);

  if (!isAllowedOrigin(origin)) {
    res.status(403).json({ error: "허용되지 않은 출처의 요청입니다." });
    return false;
  }

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "600");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return false;
  }

  const result = consumeRateLimit(endpoint, getClientIp(req));
  res.setHeader("X-RateLimit-Limit", String(result.limit));
  res.setHeader("X-RateLimit-Remaining", String(result.remaining));
  res.setHeader("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));

  if (!result.allowed) {
    res.setHeader("Retry-After", String(Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000))));
    res.status(429).json({ error: "요청이 많습니다. 잠시 후 다시 시도해주세요." });
    return false;
  }

  return true;
}

export function readLimitedJsonBody<T>(body: unknown, maxBytes = 64 * 1024): T | null {
  const raw = typeof body === "string" ? body : JSON.stringify(body ?? {});
  if (Buffer.byteLength(raw, "utf8") > maxBytes) return null;

  try {
    return (typeof body === "string" ? JSON.parse(body) : body) as T;
  } catch {
    return null;
  }
}

export async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit, timeoutMs = 12_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function clearRateLimitStoreForTests() {
  rateLimitStore.clear();
}
