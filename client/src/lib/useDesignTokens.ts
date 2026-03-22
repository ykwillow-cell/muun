/**
 * useDesignTokens
 * Supabase에서 활성 테마를 런타임에 가져와 CSS 변수로 즉시 주입합니다.
 *
 * FOUC 방지 전략:
 * 1. index.html <head>의 인라인 스크립트가 localStorage 캐시를 즉시 주입 (깜빡임 없음)
 * 2. 앱 로드 후 Supabase에서 최신 테마를 백그라운드로 가져와 캐시 갱신
 * 3. 다음 방문 시 갱신된 캐시가 즉시 적용되어 항상 최신 테마 유지
 */

const SUPABASE_URL = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI';

const STYLE_TAG_ID = 'muun-design-tokens-runtime';
const CACHE_KEY = 'muun_design_tokens_cache';

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
  // 기존 태그 제거 후 재생성 (위치 재배치를 위해)
  const existing = document.getElementById(STYLE_TAG_ID);
  if (existing) existing.remove();

  const tag = document.createElement('style');
  tag.id = STYLE_TAG_ID;
  tag.textContent = cssText;

  // <body> 끝에 추가하여 빌드 타임 CSS(<head>의 <link>)보다 나중에 로드되도록 보장
  // CSS 소스 순서상 뒤에 위치할수록 우선순위가 높아 빌드 CSS 값을 덮어씀
  if (document.body) {
    document.body.appendChild(tag);
  } else {
    document.head.appendChild(tag);
  }
}

async function fetchAndInject(): Promise<void> {
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

    // 현재 페이지에 즉시 적용
    injectStyleTag(cssText);

    // 다음 방문 시 FOUC 방지를 위해 localStorage에 저장
    try {
      localStorage.setItem(CACHE_KEY, cssText);
    } catch {
      // localStorage 저장 실패 시 무시
    }
  } catch (err) {
    // 네트워크 오류 등 — 기본 CSS 변수 유지
    console.warn('[muun] 디자인 토큰 런타임 주입 실패:', err);
  }
}

/**
 * 앱 최초 마운트 시 한 번 호출합니다.
 * index.html 인라인 스크립트가 이미 캐시를 주입했으므로,
 * 여기서는 Supabase에서 최신 테마를 백그라운드로 가져와 캐시를 갱신합니다.
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
  } catch {
    // ignore
  }
  fetchAndInject();
}
