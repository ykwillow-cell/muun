import { GUIDE_INDEX, HOME_COLUMNS_PREVIEW } from "@/generated/content-snapshots";
import { hasGeneratedGuideHexSuffix, stripGeneratedGuideHexSuffix } from "./guide-url";

export interface ColumnData {
  id: string;
  slug?: string;
  title: string;
  description: string;
  content: string;
  category: string;
  categoryLabel: string;
  author: string;
  published: boolean;
  publishedDate: string;
  readTime: number;
  thumbnail: string;
  keywords: string[];
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}

type StaticColumnRow = {
  id: string;
  slug?: string;
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  categoryLabel?: string;
  author?: string;
  published?: boolean;
  published_at?: string;
  publishedDate?: string;
  created_at?: string;
  read_time?: number;
  readTime?: number;
  thumbnail_url?: string;
  thumbnail?: string;
  keywords?: string[];
  meta_title?: string;
  metaTitle?: string;
  meta_description?: string;
  metaDescription?: string;
  canonical_url?: string;
  canonicalUrl?: string;
};

export const COLUMN_CATEGORIES: Record<string, { label: string; color: string }> = {
  luck: { label: "개운법", color: "bg-yellow-500/20 text-yellow-400" },
  basic: { label: "사주 기초", color: "bg-blue-500/20 text-blue-400" },
  relationship: { label: "관계 & 궁합", color: "bg-pink-500/20 text-pink-400" },
  health: { label: "건강 & 운", color: "bg-green-500/20 text-green-400" },
  money: { label: "재물운", color: "bg-purple-500/20 text-purple-400" },
  flow: { label: "운명의 흐름", color: "bg-indigo-500/20 text-indigo-400" },
  career: { label: "취업 & 커리어", color: "bg-orange-500/20 text-orange-400" },
  love: { label: "연애 & 결혼", color: "bg-rose-500/20 text-rose-400" },
  family: { label: "가족 & 자녀", color: "bg-teal-500/20 text-teal-400" },
};

function mapRow(row: StaticColumnRow): ColumnData {
  const category = row.category || "luck";
  return {
    id: String(row.id),
    slug: row.slug || String(row.id),
    title: row.title || "",
    description: row.description || "",
    content: row.content || "",
    category,
    categoryLabel: row.categoryLabel || COLUMN_CATEGORIES[category]?.label || category,
    author: row.author || "무운 역술팀",
    published: row.published ?? true,
    publishedDate: row.published_at || row.publishedDate || row.created_at || "",
    readTime: row.read_time || row.readTime || 5,
    thumbnail: row.thumbnail_url || row.thumbnail || "",
    keywords: row.keywords || [],
    metaTitle: row.meta_title || row.metaTitle,
    metaDescription: row.meta_description || row.metaDescription,
    canonicalUrl: row.canonical_url || row.canonicalUrl,
  };
}

const STATIC_COLUMNS: ColumnData[] = GUIDE_INDEX.map((entry) => mapRow(entry));
const STATIC_COLUMNS_BY_SLUG = new Map(STATIC_COLUMNS.map((entry) => [entry.slug?.toLowerCase(), entry]));
const STATIC_COLUMNS_BY_ID = new Map(STATIC_COLUMNS.map((entry) => [entry.id, entry]));

async function loadStaticColumnBySlug(slug: string): Promise<ColumnData | null> {
  const normalized = String(slug || "").trim().toLowerCase();
  if (!normalized) return null;

  try {
    const response = await fetch(`/content-fallback/guides/${encodeURIComponent(normalized)}.json`, {
      cache: "force-cache",
    });
    if (!response.ok) return null;
    return mapRow((await response.json()) as StaticColumnRow);
  } catch {
    return null;
  }
}

function findStaticColumn(slugOrId: string): ColumnData | null {
  const normalized = String(slugOrId || "").trim().toLowerCase();
  if (!normalized) return null;
  if (STATIC_COLUMNS_BY_ID.has(normalized)) return STATIC_COLUMNS_BY_ID.get(normalized) ?? null;
  if (STATIC_COLUMNS_BY_SLUG.has(normalized)) return STATIC_COLUMNS_BY_SLUG.get(normalized) ?? null;

  if (hasGeneratedGuideHexSuffix(normalized)) {
    const baseSlug = stripGeneratedGuideHexSuffix(normalized);
    return STATIC_COLUMNS_BY_SLUG.get(baseSlug) ?? null;
  }
  return null;
}

/** 정적으로 생성된 발행 칼럼 목록을 최신순으로 반환합니다. */
export async function getAllColumns(category?: string): Promise<ColumnData[]> {
  const normalizedCategory = String(category || "").trim().toLowerCase();
  return STATIC_COLUMNS.filter((entry) => {
    if (!normalizedCategory) return true;
    return entry.category.toLowerCase() === normalizedCategory || entry.categoryLabel.toLowerCase() === normalizedCategory;
  });
}

export async function getColumnsByCategory(category: string): Promise<ColumnData[]> {
  return getAllColumns(category);
}

export async function getColumnById(id: string): Promise<ColumnData | null> {
  const listed = findStaticColumn(id);
  if (!listed) return null;
  return (await loadStaticColumnBySlug(listed.slug || listed.id)) || listed;
}

/**
 * 발행 상세 페이지는 CDN의 정적 fallback을 우선 사용합니다. DB를 직접 조회하지 않아
 * 공개 anon key를 통한 콘텐츠 테이블 반복 다운로드와 egress 재발을 방지합니다.
 */
export async function getColumnBySlug(slug: string): Promise<ColumnData | null> {
  const normalized = String(slug || "").trim().toLowerCase();
  if (!normalized) return null;

  const direct = await loadStaticColumnBySlug(normalized);
  if (direct) return direct;

  const listed = findStaticColumn(normalized);
  if (!listed) return null;

  const byCanonicalSlug = await loadStaticColumnBySlug(listed.slug || listed.id);
  return byCanonicalSlug || listed;
}

export async function getLatestColumns(limit = 3): Promise<ColumnData[]> {
  const safeLimit = Math.max(0, Math.min(Math.floor(limit) || 0, STATIC_COLUMNS.length));
  return STATIC_COLUMNS.slice(0, safeLimit);
}

/** 홈 추천은 빌드 시 확정된 정적 미리보기로 제공하고, 부족하면 최신 정적 목록으로 채웁니다. */
export async function getFeaturedColumns(): Promise<ColumnData[]> {
  const featured = HOME_COLUMNS_PREVIEW.map((entry) => mapRow(entry));
  if (featured.length >= 3) return featured.slice(0, 3);

  const usedIds = new Set(featured.map((entry) => entry.id));
  return [...featured, ...STATIC_COLUMNS.filter((entry) => !usedIds.has(entry.id))].slice(0, 3);
}

/** 기존 동기 API와의 호환성용 정적 목록입니다. */
export const columns: ColumnData[] = STATIC_COLUMNS;
