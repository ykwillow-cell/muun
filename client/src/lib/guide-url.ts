/**
 * Guide URL helpers
 *
 * sitemap/prerender currently expose guide detail URLs as:
 *   /guide/{dbSlug}-{idFirst8Hex}
 * while some Supabase rows still store only {dbSlug}.
 * Keep all client-side links/canonical URLs aligned with the generated URL.
 */

export const GUIDE_HEX_SUFFIX_PATTERN = /-[0-9a-f]{8}$/i;

export function normalizeGuideSlug(value?: string | null): string {
  return String(value || '')
    .trim()
    .replace(/^\/guide\//, '')
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase();
}

export function getShortGuideId(id?: string | null): string | null {
  const match = String(id || '').trim().toLowerCase().match(/^([0-9a-f]{8})/);
  return match ? match[1] : null;
}

export function hasGeneratedGuideHexSuffix(slug?: string | null): boolean {
  return GUIDE_HEX_SUFFIX_PATTERN.test(normalizeGuideSlug(slug));
}

export function stripGeneratedGuideHexSuffix(slug?: string | null): string {
  return normalizeGuideSlug(slug).replace(GUIDE_HEX_SUFFIX_PATTERN, '');
}

export function resolveGeneratedGuideSlug(slug?: string | null, id?: string | null): string {
  const normalized = normalizeGuideSlug(slug);
  if (!normalized) return '';
  if (GUIDE_HEX_SUFFIX_PATTERN.test(normalized)) return normalized;

  const shortId = getShortGuideId(id);
  return shortId ? `${normalized}-${shortId}` : normalized;
}

export function getGuidePath(slug?: string | null, id?: string | null): string {
  const guideSlug = resolveGeneratedGuideSlug(slug, id);
  return guideSlug ? `/guide/${guideSlug}` : '/guide';
}

export function getGuideCanonicalUrl(slug?: string | null, id?: string | null): string {
  return `https://muunsaju.com${getGuidePath(slug, id)}`;
}
