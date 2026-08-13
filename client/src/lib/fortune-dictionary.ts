import { DICTIONARY_INDEX } from "@/generated/content-snapshots";

export interface DictionaryEntry {
  id: string;
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  subtitle?: string;
  summary: string;
  originalMeaning: string;
  modernInterpretation: string;
  muunAdvice: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

type StaticDictionaryRow = {
  id: string;
  slug?: string;
  category?: string;
  categoryLabel?: string;
  title?: string;
  subtitle?: string;
  summary?: string;
  originalMeaning?: string;
  modernInterpretation?: string;
  muunAdvice?: string;
  original_meaning?: string;
  modern_interpretation?: string;
  muun_advice?: string;
  metaTitle?: string;
  metaDescription?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: readonly string[];
};

const CATEGORY_LABELS: Record<string, string> = {
  basic: "사주 기초",
  stem: "천간",
  branch: "지지",
  "ten-stem": "십신",
  sipsin: "십신",
  "evil-spirit": "신살",
  "luck-flow": "운의 흐름",
  relation: "관계 & 궁합",
  concept: "운세 개념",
  wealth: "재물 & 직업",
  health: "건강 & 신체",
  other: "기타",
};

function mapRow(row: StaticDictionaryRow): DictionaryEntry {
  const category = row.category || "basic";
  return {
    id: String(row.id),
    slug: row.slug || String(row.id),
    category,
    categoryLabel: row.categoryLabel || CATEGORY_LABELS[category] || category,
    title: row.title || "",
    subtitle: row.subtitle || undefined,
    summary: row.summary || "",
    originalMeaning: row.original_meaning || row.originalMeaning || "",
    modernInterpretation: row.modern_interpretation || row.modernInterpretation || "",
    muunAdvice: row.muun_advice || row.muunAdvice || "",
    tags: Array.isArray(row.tags) ? [...row.tags] : [],
    metaTitle: row.meta_title || row.metaTitle || undefined,
    metaDescription: row.meta_description || row.metaDescription || undefined,
  };
}

const STATIC_DICTIONARY = DICTIONARY_INDEX.map((entry) => mapRow(entry));
const STATIC_BY_ID = new Map(STATIC_DICTIONARY.map((entry) => [entry.id, entry]));
const STATIC_BY_SLUG = new Map(STATIC_DICTIONARY.map((entry) => [entry.slug.toLowerCase(), entry]));

async function loadStaticDictionaryBySlug(slug: string): Promise<DictionaryEntry | null> {
  const normalized = String(slug || "").trim().toLowerCase();
  if (!normalized) return null;

  try {
    const response = await fetch(`/content-fallback/dictionary/${encodeURIComponent(normalized)}.json`, {
      cache: "force-cache",
    });
    if (!response.ok) return null;
    return mapRow((await response.json()) as StaticDictionaryRow);
  } catch {
    return null;
  }
}

/** 목록·검색 화면은 빌드 시 생성된 경량 정적 색인만 사용합니다. */
export async function fetchFortuneDictionary(): Promise<DictionaryEntry[]> {
  fortuneDictionary.splice(0, fortuneDictionary.length, ...STATIC_DICTIONARY);
  return STATIC_DICTIONARY;
}

/** 상세 콘텐츠는 CDN 정적 fallback만 사용해 공개 DB 직접 조회와 egress 재발을 방지합니다. */
export async function fetchDictionaryEntryBySlug(slug: string): Promise<DictionaryEntry | null> {
  const normalized = String(slug || "").trim().toLowerCase();
  if (!normalized) return null;

  const staticEntry = await loadStaticDictionaryBySlug(normalized);
  return staticEntry || STATIC_BY_SLUG.get(normalized) || null;
}

export async function fetchDictionaryEntryById(id: string): Promise<DictionaryEntry | null> {
  const listed = STATIC_BY_ID.get(String(id));
  if (!listed) return null;
  return (await loadStaticDictionaryBySlug(listed.slug)) || listed;
}

export function getAllCategories() {
  return [
    { id: "basic", label: "사주 기초" },
    { id: "stem", label: "천간" },
    { id: "branch", label: "지지" },
    { id: "ten-stem", label: "십신" },
    { id: "sipsin", label: "십신" },
    { id: "evil-spirit", label: "신살" },
    { id: "luck-flow", label: "운의 흐름" },
    { id: "relation", label: "관계 & 궁합" },
    { id: "concept", label: "운세 개념" },
    { id: "wealth", label: "재물 & 직업" },
    { id: "health", label: "건강 & 신체" },
    { id: "other", label: "기타" },
  ];
}

export function searchDictionary(query: string, entries: DictionaryEntry[] = fortuneDictionary): DictionaryEntry[] {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) return [];

  return entries.filter((entry) =>
    [entry.title, entry.summary, entry.originalMeaning, entry.modernInterpretation, ...(entry.tags || [])]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedQuery)),
  );
}

/** 기존 동기 API와의 호환성용 정적 목록입니다. */
export const fortuneDictionary: DictionaryEntry[] = [...STATIC_DICTIONARY];

export function getDictionaryEntryById(id: string): DictionaryEntry | undefined {
  return fortuneDictionary.find((entry) => entry.id === id);
}

export function getDictionaryEntryBySlug(slug: string): DictionaryEntry | undefined {
  return fortuneDictionary.find((entry) => entry.slug === slug);
}
