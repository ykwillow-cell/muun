// Auto-generated from Google Search Console exclusion list.
// Includes URLs that should NOT appear in sitemap.xml.
// - 404
// - noindex
// - redirecting legacy aliases
// - duplicate non-canonical paths that are not covered by automatic rules

const RAW_EXCLUDED_PATHS = [
  "/guide/good-luck-methods",
  "/dictionary/daeun",
  "/dream/신선",
  "/dictionary/dohwa-sal",
  "/dream/부모님",
  "/guide/truth-of-dohwasal",
  "/dream/발가락",
  "/dream/컴퓨터",
  "/dream/똥,-화장실,-재물운",
  "/dictionary/saju-palcha",
  "/dream/돼지-꿈,-돼지-꿈해몽,-복권-당첨-꿈",
  "/dream/eating-delicious-food-dream",
  "/$",
  "/dream/broad-shoulders-dream-meaning",
  "/dream/big-ears-dream-meaning",
  "/dream/ancestor-giving-money-dream",
  "/dream/dead-person-scolding-dream-guilt",
  "/dream/내가-죽는-꿈,-가족이-죽는-꿈,-시체-꿈",
  "/dream/눈(날씨)",
  "/guide/naming-baby-saju-key-factors",
  "/dream/third-eye-forehead-dream-meaning-2",
  "/guide/column-002",
  "/dictionary/se-un",
  "/guide/column-001",
  "/guide/column-003",
  "/guide/b0d87c9e-3c21-45b2-8e01-ea16f5070a58",
  "/dictionary/im-su",
  "/dream/고래",
  "/dream/밥",
  "/dream/불",
  "/dream/코",
  "/dream/화내는 꿈",
  "/dream/화해하는 꿈",
  "/guide/saju-basics",
  "/dream/가위",
  "/dream/시계",
  "/dream/웃는 꿈",
  "/dictionary/gab-mok",
  "/dream/씨앗",
  "/dictionary/gwanseong",
  "/dream/얼음",
  "/dream/입",
  "/dream/거미",
  "/dream/기본",
  "/dream/도둑",
  "/dream/연예인",
  "/dictionary/hyeong",
  "/dream/강도",
  "/dream/도망치는 꿈",
  "/dream/안개",
  "/dream/하늘을 나는 꿈",
  "/dream/흙",
  "/guide/f16e40e9-e4dd-4d8b-94e2-d442294b56c8",
  "/guide/30d117b4-fd0c-4327-aa4a-ee743b1bbd47",
  "/guide/c388f667-a547-4059-bfa7-56d42a281839",
  "/dictionary/hap",
  "/dictionary/jeong-hwa",
  "/dictionary/heavenly-stems",
  "/dictionary/mu-to",
  "/dictionary/sam-jae",
  "/dictionary/gong-mang",
  "/dictionary/gye-su",
  "/dictionary/yong-sin",
  "/dictionary/earthly-branches",
  "/dream/학교",
  "/dream/태양",
  "/dream/소",
  "/dream/손가락",
  "/dream/화산폭발",
  "/dream/바늘",
  "/dream/나무",
  "/dream/동굴",
  "/dream/똥",
  "/dream/지진",
  "/dream/폭포",
  "/dream/노인",
  "/dream/돈",
  "/dream/숲",
  "/dream/이사",
  "/dream/호랑이",
  "/dream/개",
  "/dream/꽃",
  "/dream/냉장고",
  "/dream/결혼",
  "/dream/아이",
  "/dream/거북이",
  "/dream/시험",
  "/dream/죽음",
  "/dream/토끼",
  "/dream/보석",
  "/dream/양",
  "/dream/침대",
  "/dream/달",
  "/dream/술",
  "/dream/홍수",
  "/dream/떨어지는 꿈",
  "/dream/쥐",
  "/dream/산",
  "/dream/책",
  "/dream/비",
  "/dream/원숭이",
  "/dream/고양이",
  "/dream/과일",
  "/dream/기린",
  "/dream/대통령",
  "/dream/벌",
  "/dream/천둥번개",
  "/dream/거지",
  "/dream/경찰",
  "/dream/길",
  "/dream/상어",
  "/dream/돼지",
  "/dream/코끼리",
  "/dream/물",
  "/dream/봉황",
  "/dream/닭",
  "/dream/샘물",
  "/dream/금반지",
  "/dream/예수님",
  "/dream/사냥하는 꿈",
  "/dream/동물",
  "/dream/거울",
  "/dream/집",
  "/dream/바다",
  "/guide/five-elements-harmony",
  // 2026-04-26~27 Google Search Console 404 확인 목록 (추가분)
  "/dream/말",
  "/dream/편지",
  "/dream/청소하는 꿈",
  "/dream/낚시하는 꿈",
  "/dream/여행하는 꿈",
  "/dream/열매",
  "/guide/what-is-dohwasal",
  "/dictionary/cheoneul-gwiin",
  "/dictionary/earth-element",
  "/dream/money-tree-growing-dream",
  "/dream/등산하는 꿈",
  "/dream/옷",
  "/dream/군인",
  "/dream/운동하는 꿈",
  "/dream/피",
  "/dream/자동차",
  "/dream/뱀",
  "/dictionary/goegang-sal",
];

export const EXCLUDED_PATHS = new Set(RAW_EXCLUDED_PATHS);

export const UUID_SLUG_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const DREAM_DUPLICATE_SUFFIX_PATTERN = /^(.+)-(\d+)$/;

export function normalizePathname(value = '') {
  let pathname = String(value || '').trim();
  if (!pathname) return '';
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // keep original value
  }
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  return pathname;
}

export function isManuallyExcluded(pathname) {
  return EXCLUDED_PATHS.has(normalizePathname(pathname));
}

export function isLegacyGuideUuid(slug) {
  return UUID_SLUG_PATTERN.test(String(slug || '').trim());
}

export function isDreamDuplicateVariant(slug, existingSlugSet) {
  const normalized = String(slug || '').trim();
  const match = DREAM_DUPLICATE_SUFFIX_PATTERN.exec(normalized);
  if (!match) return false;
  const baseSlug = match[1];
  return existingSlugSet.has(baseSlug);
}

export function shouldExcludeDreamSlug(slug, existingSlugSet) {
  const pathname = `/dream/${String(slug || '').trim()}`;
  if (isManuallyExcluded(pathname)) return { exclude: true, reason: 'manual' };
  if (isDreamDuplicateVariant(slug, existingSlugSet)) return { exclude: true, reason: 'duplicate-suffix' };
  return { exclude: false, reason: null };
}

export function shouldExcludeGuideSlug(slug) {
  const normalized = String(slug || '').trim();
  const pathname = `/guide/${normalized}`;
  if (!normalized) return { exclude: true, reason: 'empty' };
  if (isManuallyExcluded(pathname)) return { exclude: true, reason: 'manual' };
  if (isLegacyGuideUuid(normalized)) return { exclude: true, reason: 'legacy-uuid' };
  return { exclude: false, reason: null };
}

export function shouldExcludeDictionarySlug(slug) {
  const normalized = String(slug || '').trim();
  const pathname = `/dictionary/${normalized}`;
  if (!normalized) return { exclude: true, reason: 'empty' };
  if (isManuallyExcluded(pathname)) return { exclude: true, reason: 'manual' };
  return { exclude: false, reason: null };
}
