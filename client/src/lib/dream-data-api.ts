import { DREAM_INDEX } from "@/generated/content-snapshots";

export interface DreamSEOData {
  meta_title?: string | null;
  meta_description?: string | null;
  title?: string | null;
  description?: string | null;
}

export interface DreamData {
  id: string;
  keyword: string;
  slug: string;
  interpretation: string;
  traditional_meaning: string | null;
  psychological_meaning: string | null;
  category: string;
  grade: "great" | "good" | "bad";
  score: number;
  meta_title: string | null;
  meta_description: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  seo_data?: DreamSEOData | null;
}

type StaticDreamRow = Partial<DreamData> & {
  id: string;
  keyword?: string;
  slug?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  publishedDate?: string;
};

export const DREAM_CATEGORIES: Record<string, { label: string; color: string }> = {
  animal: { label: "동물", color: "bg-orange-500/20 text-orange-400" },
  nature: { label: "자연", color: "bg-green-500/20 text-green-400" },
  person: { label: "사람", color: "bg-blue-500/20 text-blue-400" },
  object: { label: "사물", color: "bg-yellow-500/20 text-yellow-400" },
  action: { label: "행동", color: "bg-purple-500/20 text-purple-400" },
  emotion: { label: "감정", color: "bg-pink-500/20 text-pink-400" },
  place: { label: "장소", color: "bg-teal-500/20 text-teal-400" },
  other: { label: "기타", color: "bg-slate-500/20 text-slate-400" },
};

function normalizeGrade(value: unknown): DreamData["grade"] {
  return value === "great" || value === "bad" || value === "good" ? value : "good";
}

function mapRow(row: StaticDreamRow): DreamData {
  const seoData = row.seo_data && typeof row.seo_data === "object" ? row.seo_data : null;
  const publishedAt = row.published_at || row.publishedDate || null;

  return {
    id: String(row.id),
    keyword: row.keyword || "",
    slug: row.slug || String(row.id),
    interpretation: row.interpretation || row.excerpt || "",
    traditional_meaning: row.traditional_meaning || null,
    psychological_meaning: row.psychological_meaning || null,
    category: row.category || "other",
    grade: normalizeGrade(row.grade),
    score: typeof row.score === "number" ? row.score : 70,
    meta_title: row.meta_title || row.metaTitle || seoData?.meta_title || seoData?.title || null,
    meta_description: row.meta_description || row.metaDescription || seoData?.meta_description || seoData?.description || row.excerpt || null,
    published: row.published ?? true,
    published_at: publishedAt,
    created_at: row.created_at || publishedAt || "",
    seo_data: seoData,
  };
}

const STATIC_DREAMS = DREAM_INDEX.map((entry) => mapRow(entry));
/** 상세·목록 화면에서 사용하는 정규화된 정적 색인입니다. */
export const dreamIndex: readonly DreamData[] = STATIC_DREAMS;
const STATIC_DREAMS_BY_SLUG = new Map(STATIC_DREAMS.map((entry) => [entry.slug.toLowerCase(), entry]));

async function loadStaticDreamBySlug(slug: string): Promise<DreamData | null> {
  const normalized = String(slug || "").trim().toLowerCase();
  if (!normalized) return null;

  try {
    const response = await fetch(`/content-fallback/dreams/${encodeURIComponent(normalized)}.json`, {
      cache: "force-cache",
    });
    if (!response.ok) return null;
    return mapRow((await response.json()) as StaticDreamRow);
  } catch {
    return null;
  }
}

/** 발행 꿈 목록은 빌드 시 생성된 정적 색인을 사용합니다. */
export async function getAllDreams(category?: string): Promise<DreamData[]> {
  const normalizedCategory = String(category || "").trim().toLowerCase();
  return STATIC_DREAMS.filter((entry) => !normalizedCategory || entry.category.toLowerCase() === normalizedCategory);
}

/** 상세 콘텐츠는 CDN 정적 fallback만 사용해 공개 DB 직접 조회와 egress 재발을 방지합니다. */
export async function getDreamBySlug(slug: string): Promise<DreamData | null> {
  const normalized = String(slug || "").trim().toLowerCase();
  if (!normalized) return null;

  const staticDream = await loadStaticDreamBySlug(normalized);
  return staticDream || STATIC_DREAMS_BY_SLUG.get(normalized) || null;
}

/** 검색은 공개 DB가 아닌 정적 색인에서 수행합니다. */
export async function searchDreams(keyword: string): Promise<DreamData[]> {
  const query = String(keyword || "").trim().toLowerCase();
  if (!query) return [];

  return STATIC_DREAMS.filter((entry) => {
    return [entry.keyword, entry.interpretation, entry.meta_title, entry.meta_description]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(query));
  }).slice(0, 50);
}

export async function getLatestDreams(limit = 10): Promise<DreamData[]> {
  const safeLimit = Math.max(0, Math.min(Math.floor(limit) || 0, STATIC_DREAMS.length));
  return STATIC_DREAMS.slice(0, safeLimit);
}
