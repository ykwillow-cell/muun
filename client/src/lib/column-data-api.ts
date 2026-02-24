/**
 * muun-admin API에서 칼럼 데이터 가져오기
 * 이 파일은 column-data.ts를 대체합니다
 */

export interface ColumnData {
  id: number;
  slug: string;
  title: string;
  content: string;
  category: string;
  author: string;
  published: boolean;
  publishedDate: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  thumbnailUrl?: string;
  readingTime?: number;
}

// muun-admin API URL (환경변수로 설정 가능)
const API_URL = import.meta.env.VITE_MUUN_ADMIN_API || 'https://3000-isuiaxh3c3oukpiwp91lq-5eca3185.us1.manus.computer';

/**
 * 발행된 모든 칼럼 조회
 */
export async function getAllColumns(category?: string): Promise<ColumnData[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    
    const response = await fetch(
      `${API_URL}/api/trpc/columns.publicList?input=${encodeURIComponent(JSON.stringify({ category, limit: 100 }))}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // tRPC 응답 형식 처리
    if (data.result?.data) {
      return data.result.data.map((col: any) => ({
        id: col.id,
        slug: col.slug,
        title: col.title,
        content: col.content,
        category: col.category,
        author: col.author || '무운 역술팀',
        published: col.published,
        publishedDate: col.publishedDate || new Date().toISOString(),
        metaTitle: col.metaTitle,
        metaDescription: col.metaDescription,
        canonicalUrl: col.canonicalUrl,
        thumbnailUrl: col.thumbnailUrl,
        readingTime: col.readingTime || 5,
      }));
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch columns from API:', error);
    return [];
  }
}

/**
 * 카테고리별 칼럼 조회
 */
export async function getColumnsByCategory(category: string): Promise<ColumnData[]> {
  const allColumns = await getAllColumns(category);
  return allColumns.filter(col => col.category === category);
}

/**
 * 슬러그로 칼럼 상세 조회
 */
export async function getColumnBySlug(slug: string): Promise<ColumnData | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/trpc/columns.publicGetBySlug?input=${encodeURIComponent(JSON.stringify(slug))}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.result?.data) {
      const col = data.result.data;
      return {
        id: col.id,
        slug: col.slug,
        title: col.title,
        content: col.content,
        category: col.category,
        author: col.author || '무운 역술팀',
        published: col.published,
        publishedDate: col.publishedDate || new Date().toISOString(),
        metaTitle: col.metaTitle,
        metaDescription: col.metaDescription,
        canonicalUrl: col.canonicalUrl,
        thumbnailUrl: col.thumbnailUrl,
        readingTime: col.readingTime || 5,
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch column by slug:', error);
    return null;
  }
}

// 카테고리 정의 (muun-admin과 동기화)
export const COLUMN_CATEGORIES = {
  '운세': { label: '운세', color: 'bg-blue-500/20 text-blue-400' },
  '풍수': { label: '풍수', color: 'bg-yellow-500/20 text-yellow-400' },
  '별자리': { label: '별자리', color: 'bg-pink-500/20 text-pink-400' },
  '명리학': { label: '명리학', color: 'bg-green-500/20 text-green-400' },
};

// 호환성을 위한 더미 데이터 (API 호출 실패 시 폴백)
export const columns: ColumnData[] = [];
