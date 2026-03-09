/**
 * 무운 작명소 - Supabase 데이터 통신 모듈
 *
 * 아키텍처 결정:
 * - 기존 column-data-api.ts와 동일한 Supabase BaaS 패턴 적용
 * - 서버(tRPC)를 거치지 않고 프론트엔드에서 Supabase REST API 직접 호출
 * - hanja_dictionary: 대법원 인명용 한자 5,382자 (정적 읽기 전용)
 * - naming_history: 작명 이력 저장 (Supabase 일시 중지 방지 핑 겸용)
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ──────────────────────────────────────────────
// 타입 정의
// ──────────────────────────────────────────────

/** hanja_dictionary 테이블 행 타입 */
export interface HanjaData {
  hanja: string;    // 한자 (예: "民")
  hangul: string;   // 한글 음 (예: "민")
  strokes: number;  // 원획수 (변형부수 보정 완료)
  element: string;  // 자원오행: 목 | 화 | 토 | 금 | 수
  meaning: string;  // 뜻풀이
}

/** 획수 + 오행 조건으로 필터링된 한자 조회 결과 */
export interface HanjaQueryResult {
  hanja: string;
  hangul: string;
  strokes: number;
  element: string;
  meaning: string;
}

// ──────────────────────────────────────────────
// 한자 사전 조회 함수
// ──────────────────────────────────────────────

/**
 * 특정 획수 목록과 오행 목록을 동시에 만족하는 한자 조회
 *
 * 작명 엔진의 역순 탐색에서 호출됨:
 * 1) 81수리 4격이 모두 길수인 획수 조합을 먼저 산출
 * 2) 해당 획수 AND 부족한 오행을 가진 한자만 쿼리 → 성능 최적화
 *
 * @param strokes  필요한 획수 배열 (예: [5, 8])
 * @param elements 필요한 오행 배열 (예: ["목", "화"])
 */
export async function getHanjaByStrokesAndElements(
  strokes: number[],
  elements: string[]
): Promise<HanjaQueryResult[]> {
  try {
    const { data, error } = await supabase
      .from('hanja_dictionary')
      .select('hanja, hangul, strokes, element, meaning')
      .in('strokes', strokes)
      .in('element', elements);

    if (error) {
      console.error('Supabase getHanjaByStrokesAndElements error:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Failed to fetch hanja:', err);
    return [];
  }
}

/**
 * 특정 획수 목록에 해당하는 모든 한자 조회 (오행 무관)
 *
 * @param strokes 필요한 획수 배열
 */
export async function getHanjaByStrokes(strokes: number[]): Promise<HanjaQueryResult[]> {
  try {
    const { data, error } = await supabase
      .from('hanja_dictionary')
      .select('hanja, hangul, strokes, element, meaning')
      .in('strokes', strokes);

    if (error) {
      console.error('Supabase getHanjaByStrokes error:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Failed to fetch hanja by strokes:', err);
    return [];
  }
}

/**
 * 특정 오행을 가진 한자 전체 조회
 *
 * @param elements 오행 배열 (예: ["목", "화"])
 */
export async function getHanjaByElements(elements: string[]): Promise<HanjaQueryResult[]> {
  try {
    const { data, error } = await supabase
      .from('hanja_dictionary')
      .select('hanja, hangul, strokes, element, meaning')
      .in('element', elements);

    if (error) {
      console.error('Supabase getHanjaByElements error:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Failed to fetch hanja by elements:', err);
    return [];
  }
}

// ──────────────────────────────────────────────
// 작명 이력 저장
// ──────────────────────────────────────────────

/**
 * 작명 이력 저장
 * - 통계 목적 및 Supabase 무료 플랜 일시 중지 방지(핑) 겸용
 * - 실패해도 서비스에 영향 없음 (fire-and-forget)
 */
export async function saveNamingHistory(
  familyName: string,
  selectedName: string,
  englishName?: string
): Promise<void> {
  const { error } = await supabase
    .from('naming_history')
    .insert([
      {
        family_name: familyName,
        selected_name: selectedName,
        english_name: englishName ?? null,
      },
    ]);

  if (error) {
    console.error('Naming history save failed (non-critical):', error);
  }
}
