/**
 * Supabase에서 꿈해몽 데이터 직접 조회
 * muun-admin과 동일한 Supabase 프로젝트를 사용합니다.
 */
import { createClient } from '@supabase/supabase-js';
import { DREAM_INDEX } from '@/generated/content-snapshots';

const SUPABASE_URL = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  grade: 'great' | 'good' | 'bad';
  score: number;
  meta_title: string | null;
  meta_description: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  seo_data?: DreamSEOData | null;
}

export const DREAM_CATEGORIES: Record<string, { label: string; color: string }> = {
  animal: { label: '동물', color: 'bg-orange-500/20 text-orange-400' },
  nature: { label: '자연', color: 'bg-green-500/20 text-green-400' },
  person: { label: '사람', color: 'bg-blue-500/20 text-blue-400' },
  object: { label: '사물', color: 'bg-yellow-500/20 text-yellow-400' },
  action: { label: '행동', color: 'bg-purple-500/20 text-purple-400' },
  emotion: { label: '감정', color: 'bg-pink-500/20 text-pink-400' },
  place: { label: '장소', color: 'bg-teal-500/20 text-teal-400' },
  other: { label: '기타', color: 'bg-slate-500/20 text-slate-400' },
};

async function loadStaticDreamBySlug(slug: string): Promise<DreamData | null> {
  const normalized = String(slug || '').trim().toLowerCase();
  if (!normalized) return null;
  try {
    const response = await fetch(`/content-fallback/dreams/${encodeURIComponent(normalized)}.json`, { cache: 'force-cache' });
    if (!response.ok) return null;
    const row = await response.json();
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

function mapRow(row: any): DreamData {
  const seoData: DreamSEOData | null = row?.seo_data && typeof row.seo_data === 'object' ? row.seo_data : null;

  return {
    id: String(row.id),
    keyword: row.keyword || '',
    slug: row.slug || String(row.id),
    interpretation: row.interpretation || '',
    traditional_meaning: row.traditional_meaning || null,
    psychological_meaning: row.psychological_meaning || null,
    category: row.category || 'other',
    grade: row.grade || 'good',
    score: row.score ?? 70,
    meta_title: row.meta_title || seoData?.meta_title || seoData?.title || null,
    meta_description: row.meta_description || seoData?.meta_description || seoData?.description || null,
    published: row.published || false,
    published_at: row.published_at || null,
    created_at: row.created_at || new Date().toISOString(),
    seo_data: seoData,
  };
}

/**
 * 발행된 모든 꿈해몽 조회 (최신순)
 */
export async function getAllDreams(category?: string): Promise<DreamData[]> {
  // 목록 탐색에는 빌드 시 생성된 경량 색인을 사용합니다. 기존 구현은 한 방문마다
  // dreams 전 행을 select('*')·페이지네이션으로 전송해 egress를 급격히 소진했습니다.
  const rows = DREAM_INDEX.map((item) => ({
    id: item.id,
    keyword: item.keyword,
    slug: item.slug,
    interpretation: item.excerpt || '',
    traditional_meaning: null,
    psychological_meaning: null,
    category: item.category,
    grade: item.grade,
    score: item.score,
    meta_title: item.metaTitle || null,
    meta_description: item.metaDescription || item.excerpt || null,
    published: true,
    published_at: item.publishedDate || null,
    created_at: item.publishedDate || '',
  }));
  const filtered = category ? rows.filter((row) => row.category === category) : rows;
  return filtered.map(mapRow);
}

/**
 * slug로 꿈해몽 상세 조회
 */
export async function getDreamBySlug(slug: string): Promise<DreamData | null> {
  // 발행 콘텐츠는 CDN 정적 자산을 먼저 사용해 상세 페이지 조회 egress를 제거합니다.
  const staticDream = await loadStaticDreamBySlug(slug);
  if (staticDream) return staticDream;

  try {
    // published 필드 타입 불일치 방지: boolean/string 모두 커버하기 위해
    // published 조건 없이 slug만으로 먼저 조회 후 클라이언트에서 필터
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Supabase getDreamBySlug error:', error);
      return loadStaticDreamBySlug(slug);
    }
    if (!data) return loadStaticDreamBySlug(slug);
    // published가 boolean true 또는 string 'true' 모두 허용
    const pub = data.published;
    if (pub !== true && pub !== 'true' && pub !== 1) return loadStaticDreamBySlug(slug);
    return mapRow(data);
  } catch (error) {
    console.error('Failed to fetch dream by slug:', error);
    return loadStaticDreamBySlug(slug);
  }
}

/**
 * 키워드로 꿈해몽 검색
 */
export async function searchDreams(keyword: string): Promise<DreamData[]> {
  try {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('published', true)
      .ilike('keyword', `%${keyword}%`)
      .order('score', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase searchDreams error:', error);
      return [];
    }
    return (data || []).map(mapRow);
  } catch (error) {
    console.error('Failed to search dreams:', error);
    return [];
  }
}

/**
 * 최신 꿈해몽 N개 조회
 */
export async function getLatestDreams(limit: number = 10): Promise<DreamData[]> {
  try {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      console.error('Supabase getLatestDreams error:', error);
      return [];
    }
    return (data || []).map(mapRow);
  } catch (error) {
    console.error('Failed to fetch latest dreams:', error);
    return [];
  }
}
