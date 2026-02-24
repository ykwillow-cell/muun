/**
 * Supabase에서 칼럼 데이터 직접 조회
 * muun-admin과 동일한 Supabase 프로젝트를 사용합니다.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmNya2oiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczOTM3MDg1MiwiZXhwIjoyMDU0OTQ2ODUyfQ.Yf9PJiCFRkFkGBKOBfMBSYhVMVGMHFdLbfaGBBqyBX4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

// 카테고리 정의 (muun-admin과 동기화)
export const COLUMN_CATEGORIES: Record<string, { label: string; color: string }> = {
  luck: { label: '개운법', color: 'bg-yellow-500/20 text-yellow-400' },
  basic: { label: '사주 기초', color: 'bg-blue-500/20 text-blue-400' },
  relationship: { label: '관계 & 궁합', color: 'bg-pink-500/20 text-pink-400' },
  health: { label: '건강 & 운', color: 'bg-green-500/20 text-green-400' },
  money: { label: '재물운', color: 'bg-purple-500/20 text-purple-400' },
  flow: { label: '운명의 흐름', color: 'bg-indigo-500/20 text-indigo-400' },
};

function mapRow(row: any): ColumnData {
  const category = row.category || 'luck';
  const categoryLabel = COLUMN_CATEGORIES[category]?.label || category;
  return {
    id: String(row.id),
    slug: row.slug || String(row.id),
    title: row.title || row.name || '',
    description: row.description || '',
    content: row.content || '',
    category,
    categoryLabel,
    author: row.author || '무운 역술팀',
    published: row.published || false,
    publishedDate: row.published_at || row.created_at || new Date().toISOString(),
    readTime: row.read_time || 5,
    thumbnail: row.thumbnail_url || '',
    keywords: row.keywords || [],
    metaTitle: row.meta_title || undefined,
    metaDescription: row.meta_description || undefined,
    canonicalUrl: row.canonical_url || undefined,
  };
}

/**
 * 발행된 모든 칼럼 조회 (최신순)
 */
export async function getAllColumns(category?: string): Promise<ColumnData[]> {
  try {
    let query = supabase
      .from('columns')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false, nullsFirst: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.limit(100);
    if (error) {
      console.error('Supabase getAllColumns error:', error);
      return [];
    }
    return (data || []).map(mapRow);
  } catch (error) {
    console.error('Failed to fetch columns from Supabase:', error);
    return [];
  }
}

/**
 * 카테고리별 칼럼 조회
 */
export async function getColumnsByCategory(category: string): Promise<ColumnData[]> {
  return getAllColumns(category);
}

/**
 * ID로 칼럼 상세 조회
 */
export async function getColumnById(id: string): Promise<ColumnData | null> {
  try {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Supabase getColumnById error:', error);
      return null;
    }
    return data ? mapRow(data) : null;
  } catch (error) {
    console.error('Failed to fetch column by id:', error);
    return null;
  }
}

/**
 * 슬러그로 칼럼 상세 조회
 */
export async function getColumnBySlug(slug: string): Promise<ColumnData | null> {
  try {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return getColumnById(slug);
      }
      console.error('Supabase getColumnBySlug error:', error);
      return null;
    }
    return data ? mapRow(data) : null;
  } catch (error) {
    console.error('Failed to fetch column by slug:', error);
    return null;
  }
}

/**
 * 최신 칼럼 N개 조회
 */
export async function getLatestColumns(limit: number = 3): Promise<ColumnData[]> {
  try {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      console.error('Supabase getLatestColumns error:', error);
      return [];
    }
    return (data || []).map(mapRow);
  } catch (error) {
    console.error('Failed to fetch latest columns:', error);
    return [];
  }
}

// 호환성을 위한 더미 데이터
export const columns: ColumnData[] = [];
