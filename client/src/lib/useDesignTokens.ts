/**
 * useDesignTokens
 * Supabase에서 활성 테마를 런타임에 가져와 CSS 변수로 즉시 주입합니다.
 * 어드민에서 테마를 저장하면 사이트 새로고침만으로 반영됩니다.
 */

const SUPABASE_URL = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI';

const STYLE_TAG_ID = 'muun-design-tokens-runtime';
const CACHE_KEY = 'muun_design_tokens_cache';
const CACHE_TIME_KEY = 'muun_design_tokens_cache_time';
// 캐시 TTL: 0 (항상 최신 테마를 Supabase에서 가져옴)
// 어드민에서 저장 즉시 새로고침만으로 반영되도록 캐시 비활성화
const CACHE_TTL_MS = 0;

interface DesignTheme {
  id: string;
  name: string;
  colors?: Record<string, string>;
  typography?: Record<string, string>;
  gradients?: Record<string, string>;
  component_tokens?: Record<string, Record<string, string>>;
}

function buildCssText(theme: DesignTheme): string {
  const lines: string[] = [':root {'];

  // 색상 토큰
  if (theme.colors) {
    for (const [key, value] of Object.entries(theme.colors)) {
      lines.push(`  ${key}: ${value};`);
    }
  }

  // 타이포그래피 토큰
  if (theme.typography) {
    for (const [key, value] of Object.entries(theme.typography)) {
      lines.push(`  ${key}: ${value};`);
    }
  }

  // 그라디언트 토큰 (--aurora 포함)
  if (theme.gradients) {
    for (const [key, value] of Object.entries(theme.gradients)) {
      lines.push(`  ${key}: ${value};`);
    }
  }

  // 컴포넌트 토큰
  if (theme.component_tokens) {
    for (const group of Object.values(theme.component_tokens)) {
      if (!group) continue;
      for (const [key, value] of Object.entries(group)) {
        lines.push(`  ${key}: ${value};`);
      }
    }
  }

  lines.push('}');
  return lines.join('\n');
}

function injectStyleTag(cssText: string): void {
  let tag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
  if (!tag) {
    tag = document.createElement('style');
    tag.id = STYLE_TAG_ID;
    // <head> 마지막에 추가하여 기본 CSS보다 우선순위 높게
    document.head.appendChild(tag);
  }
  tag.textContent = cssText;
}

async function fetchAndInject(): Promise<void> {
  // 캐시 TTL이 0이면 항상 Supabase에서 최신 데이터를 가져옴
  if (CACHE_TTL_MS > 0) {
    try {
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      const cachedCss = localStorage.getItem(CACHE_KEY);
      if (cachedTime && cachedCss) {
        const elapsed = Date.now() - parseInt(cachedTime, 10);
        if (elapsed < CACHE_TTL_MS) {
          injectStyleTag(cachedCss);
          return;
        }
      }
    } catch {
      // localStorage 접근 실패 시 무시
    }
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/design_themes?is_active=eq.true&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        // 항상 최신 테마 가져오기 (브라우저 캐시 무시)
        cache: 'no-store',
      }
    );

    if (!res.ok) return;

    const themes: DesignTheme[] = await res.json();
    if (!themes || themes.length === 0) return;

    const cssText = buildCssText(themes[0]);
    injectStyleTag(cssText);

    // 캐시 저장 (TTL > 0인 경우에만)
    if (CACHE_TTL_MS > 0) {
      try {
        localStorage.setItem(CACHE_KEY, cssText);
        localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
      } catch {
        // localStorage 저장 실패 시 무시
      }
    }
  } catch (err) {
    // 네트워크 오류 등 — 기본 CSS 변수 유지
    console.warn('[muun] 디자인 토큰 런타임 주입 실패:', err);
  }
}

/**
 * 앱 최초 마운트 시 한 번 호출합니다.
 * React 훅이 아닌 일반 함수로 제공하여 main.tsx에서도 호출 가능합니다.
 */
export function initDesignTokens(): void {
  // SSR 환경 방어
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  fetchAndInject();
}

/**
 * 캐시를 무효화하고 즉시 최신 테마를 다시 가져옵니다.
 * 어드민에서 배포 트리거 시 사용 가능합니다.
 */
export function refreshDesignTokens(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIME_KEY);
  } catch {
    // ignore
  }
  fetchAndInject();
}
