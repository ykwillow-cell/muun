/**
 * 무운 운세 사전 데이터 - Supabase DB 연동
 * muun-admin에서 등록한 데이터를 실시간으로 조회합니다.
 * 기존 하드코딩 데이터를 제거하고 DB 기반으로 전환합니다.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

// DB 카테고리 → 레이블 매핑
const CATEGORY_LABELS: Record<string, string> = {
  basic: '사주 기초',
  stem: '천간',
  branch: '지지',
  'ten-stem': '십신',
  sipsin: '십신',
  'evil-spirit': '신살',
  'luck-flow': '운의 흐름',
  relation: '관계 & 궁합',
  concept: '운세 개념',
  wealth: '재물 & 직업',
  health: '건강 & 신체',
  other: '기타',
};

function mapRow(row: any): DictionaryEntry {
  const category = row.category || 'basic';
  const categoryLabel = CATEGORY_LABELS[category] || category;
  return {
    id: row.id,
    slug: row.slug || row.id,
    category,
    categoryLabel,
    title: row.title || '',
    subtitle: row.subtitle || undefined,
    summary: row.summary || '',
    originalMeaning: row.original_meaning || '',
    modernInterpretation: row.modern_interpretation || '',
    muunAdvice: row.muun_advice || '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    metaTitle: row.meta_title || undefined,
    metaDescription: row.meta_description || undefined,
  };
}

// 캐시 (빌드 후 재요청 방지)
let _cache: DictionaryEntry[] | null = null;
let _cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5분

/**
 * 발행된 모든 사전 항목 조회 (캐시 포함)
 */
export async function fetchFortuneDictionary(): Promise<DictionaryEntry[]> {
  const now = Date.now();
  if (_cache && now - _cacheTime < CACHE_TTL) {
    return _cache;
  }
  try {
    const { data, error } = await supabase
      .from('fortune_dictionary')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase fortune_dictionary error:', error);
      return _cache || [];
    }
    _cache = (data || []).map(mapRow);
    _cacheTime = now;
    // 동기 배열도 업데이트
    fortuneDictionary.splice(0, fortuneDictionary.length, ..._cache);
    return _cache;
  } catch (err) {
    console.error('Failed to fetch fortune dictionary:', err);
    return _cache || [];
  }
}

/**
 * Slug로 단일 항목 조회
 */
export async function fetchDictionaryEntryBySlug(slug: string): Promise<DictionaryEntry | null> {
  try {
    const { data, error } = await supabase
      .from('fortune_dictionary')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Supabase fetchDictionaryEntryBySlug error:', error);
      return null;
    }
    return data ? mapRow(data) : null;
  } catch (err) {
    console.error('Failed to fetch dictionary entry by slug:', err);
    return null;
  }
}

/**
 * ID로 단일 항목 조회
 */
export async function fetchDictionaryEntryById(id: string): Promise<DictionaryEntry | null> {
  try {
    const { data, error } = await supabase
      .from('fortune_dictionary')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Supabase fetchDictionaryEntryById error:', error);
      return null;
    }
    return data ? mapRow(data) : null;
  } catch (err) {
    console.error('Failed to fetch dictionary entry by id:', err);
    return null;
  }
}

/**
 * 모든 카테고리 목록 반환
 */
export function getAllCategories() {
  return [
    { id: 'basic', label: '사주 기초' },
    { id: 'stem', label: '천간' },
    { id: 'branch', label: '지지' },
    { id: 'ten-stem', label: '십신' },
    { id: 'sipsin', label: '십신' },
    { id: 'evil-spirit', label: '신살' },
    { id: 'luck-flow', label: '운의 흐름' },
    { id: 'relation', label: '관계 & 궁합' },
    { id: 'concept', label: '운세 개념' },
    { id: 'wealth', label: '재물 & 직업' },
    { id: 'health', label: '건강 & 신체' },
    { id: 'other', label: '기타' },
  ];
}

/**
 * 텍스트 기반 검색 (캐시된 데이터 기준)
 */
export function searchDictionary(query: string, entries?: DictionaryEntry[]): DictionaryEntry[] {
  const list = entries || fortuneDictionary;
  const q = query.toLowerCase();
  return list.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.summary.toLowerCase().includes(q) ||
      e.originalMeaning.toLowerCase().includes(q) ||
      e.modernInterpretation.toLowerCase().includes(q) ||
      (e.tags || []).some((t) => t.toLowerCase().includes(q)),
  );
}

/**
 * 동기 방식으로 사용하던 코드를 위한 배열 (앱 시작 시 자동 로드)
 */
export const fortuneDictionary: DictionaryEntry[] = [];

// 앱 시작 시 미리 로드
fetchFortuneDictionary();

/**
 * ID로 특정 사전 항목을 조회하는 함수 (동기, 캐시 기반)
 */
export function getDictionaryEntryById(id: string): DictionaryEntry | undefined {
  return fortuneDictionary.find((entry) => entry.id === id);
}

/**
 * Slug로 특정 사전 항목을 조회하는 함수 (동기, 캐시 기반)
 */
export function getDictionaryEntryBySlug(slug: string): DictionaryEntry | undefined {
  return fortuneDictionary.find((entry) => entry.slug === slug);
}
